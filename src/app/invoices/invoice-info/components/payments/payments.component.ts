import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { InstallmentsTable } from '../../../interfaces/installments-table';
import { MatDialog } from '@angular/material/dialog';
import { ModifyPaymentPopupComponent } from './components/modify-payment-popup/modify-payment-popup.component';
import { PaymentConditions } from '../../../../payment-conditions/interfaces/payment-conditions';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatTableModule
  ],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent {

  isNotCorresponding: boolean = false;
  dataSource = new MatTableDataSource<InstallmentsTable>([]);
  displayedColumns: string[] = ['actions', 'paymentType', 'deadline', 'amount'];
  submitted: boolean = false;
  @Input() typeList: { id: number, title: string }[] = [];
  @Input() paymentTypeList: { id: number, description: string, code: string }[] = [];
  @Input() conditionsList: PaymentConditions[] = [];
  @Input() paymentTotal: string = "0,00";
  paymentForm!: FormGroup;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private dialog: MatDialog) {
    this.paymentForm = this.fb.group({
      type: [null],
      condition: [null],
      installments: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getPaymentInfo();
    this.paymentForm.get('condition')?.valueChanges.subscribe((result) => {
      this.calculateTotal();
    });
    this.calculateTotal();
    this.checkTotal();
  }

  get installments(): FormArray {
    return this.paymentForm.get('installments') as FormArray;
  }

  addInstallment(installment: {
    paymentType: { id: number, description: string, code: string },
    deadline: string, amount: string, bank: { id: number; denomination: string } | null
  }) {
    this.installments.push(this.fb.group({
      paymentType: [installment.paymentType],
      bank: [installment.bank],
      deadline: [installment.deadline],
      amount: [installment.amount]
    }));
    this.dataSource.data = this.installments.getRawValue();
  }

  getPaymentInfo() {

  }

  // ADD DAYS TO A DATE
  private addDaysToDate(date: Date, days: number): Date {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  // TODO: TROVARE UN MODO PER PASSARE INSTALLMENTNUMBER E DAYSOFFSET
  calculateTotal() {
    const paymentTotalNumber = parseFloat(this.paymentTotal.replace(',', '.'));
    if (paymentTotalNumber != 0 && this.paymentForm.get('condition')?.value != null) {
      // A seconda delle condizioni di pagamento, calcolare il totale e le rate
      let paymentType = { id: 0, description: '--', code: '--' };
      let amount = '0,00';
      //this.installments.clear();
      this.installments.controls.splice(0, this.installments.length);
      console.log(this.paymentForm.get('condition')?.value);

      if (this.paymentForm.get('condition')?.value.installments_number == 1) {
        // COMPLETO
        amount = this.paymentTotal;

        // a seconda della data di scadenza preimpostata, calcolare deadline
        let deadline = this.calculateDeadline( new Date(), this.paymentForm.get('condition')?.value.deadline_type,
          this.paymentForm.get('condition')?.value.deadline, this.paymentForm.get('condition')?.value.exact_day);

        // TODO: a seconda del pagamento impostato assegnare paymentType

        this.addInstallment({ paymentType: paymentType, deadline: deadline.toISOString().split('T')[0], amount: amount, bank: null });
      }
      else if (this.paymentForm.get('condition')?.value.installments_number > 1) {
        // A RATE
        const installmentNumber: number = this.paymentForm.get('condition')?.value.installments_number;
        let daysOffset: number = this.paymentForm.get('condition')?.value.deadline;
        // Dividi il totale in rate e fai un ciclo di inserimento di installments
        amount = (parseFloat(this.paymentTotal.replace(',', '.')) / installmentNumber).toFixed(2).replace('.', ',');
        let difference = Math.ceil((parseFloat(this.paymentTotal.replace(',', '.')) - (parseFloat(amount.replace(',', '.')) * installmentNumber)) * 100) / 100;
        //console.log("DIFFERENCE", difference)
        let currentBaseDate = new Date();
        for (let i = 0; i < installmentNumber; i++) {
          // Calcola la data dell'attuale pagamento
          const dueDate = this.calculateDeadline(currentBaseDate, this.paymentForm.get('condition')?.value.deadline_type, 
            daysOffset, this.paymentForm.get('condition')?.value.exact_day);
          if (installmentNumber - i == 1) {
            // Se è l'utima rata, aggiungi la differenza al primo pagamento
            amount = (parseFloat(amount.replace(',', '.')) + difference).toFixed(2).replace('.', ',');
          }
          this.addInstallment({ paymentType: paymentType, deadline: dueDate.toISOString().split('T')[0], amount: amount, bank: null });
          currentBaseDate = dueDate;
          daysOffset = this.paymentForm.get('condition')?.value.periodicity
        }
      }
    }
    else {
      this.installments.controls.splice(0, this.installments.length);
      //this.installments.clear();
    }
    this.dataSource.data = this.installments.getRawValue();
  }

  editOrAddPayment(index: number | null, idPopup: number) {
    // idpopup: 1 modify, 2 add
    let installment = { paymentType: { id: 0, title: '--' }, deadline: '', amount: '' };
    if (index != null) {
      installment = this.installments.at(index).getRawValue();
    }
    const matDialog = this.dialog.open(ModifyPaymentPopupComponent, {
      maxWidth: '1000px',
      minWidth: '350px',
      width: '90%',
      data: {
        installment: installment,
        idPopup: idPopup,
        paymentTypeList: this.paymentTypeList,
        paymentTotal: this.paymentTotal
      },
    });

    matDialog.afterClosed().subscribe((result: any) => {
      if (result && result.installment) {
        console.log(this.paymentTypeList.find((type) => type.id == result.installment.paymentType))
        const installment = {
          paymentType: this.paymentTypeList.find((type) => type.id == result.installment.paymentType)!,
          deadline: result.installment.deadline,
          amount: result.installment.amount,
          bank: null
        }
        if (idPopup == 1) {
          this.installments.at(index!).patchValue(installment);
        }
        else if (idPopup == 2) {
          this.addInstallment(installment);
          this.checkTotal();
        }
      }
    });
  }

  calculateDeadline(baseDate: Date, deadline_type: { id: number, name: string }, deadline: number, exact_day: number): Date {
    let result = new Date(baseDate);
    result.setDate(result.getDate() + deadline);
    console.log(result)

    switch (deadline_type.id) {
      case 1:
        // Tipo 1: Data Fattura + offset diretto
        return result;

      case 2:
        // Tipo 2: Fine mese
        result.setDate(28)
        result.setMonth(result.getMonth() + 1);
        result.setDate(0); // giorno 0 del mese successivo = ultimo giorno del mese corrente
        return result;

      case 3:
        let trialDate = new Date(result);
        trialDate.setDate(exact_day);
        console.log(trialDate)
        if (trialDate < result || trialDate.getDate() !== exact_day) {
          // giorno già passato o non esiste in questo mese cerca il prossimo mese valido
          for (let i = 1; i <= 12; i++) {
            const nextTrial = new Date(result);
            nextTrial.setMonth(result.getMonth() + i);
            nextTrial.setDate(exact_day);
            if (nextTrial.getDate() === exact_day) {
              return nextTrial;
            }
          }
          return result;
        } else {
          return trialDate;
        }

      default:
        return result;
    }
  }

  private checkTotal() {
    let total = 0;
    this.installments.controls.forEach((control) => {
      total += parseFloat(control.get('amount')?.value.replace(',', '.') || '0');
    });
    if (total != parseFloat(this.paymentTotal.replace(',', '.'))) {
      this.isNotCorresponding = true;
    }
  }

  deletePayment(index: number) {
    this.installments.removeAt(index);
  }

}
