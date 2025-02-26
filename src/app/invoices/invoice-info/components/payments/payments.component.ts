import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { InstallmentsTable } from '../../../interfaces/installments-table';
import { MatDialog } from '@angular/material/dialog';
import { ModifyPaymentPopupComponent } from './components/modify-payment-popup/modify-payment-popup.component';

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
  @Input() paymentTypeList: { id: number, title: string }[] = [];
  @Input() conditionsList: { id: number, title: string }[] = [];
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
    this.paymentForm.get('type')?.valueChanges.subscribe(() => {
      this.calculateTotal();
    });
    this.paymentForm.get('condition')?.valueChanges.subscribe(() => {
      this.calculateTotal();
    });
    this.calculateTotal();
    this.checkTotal();
  }

  get installments(): FormArray {
    return this.paymentForm.get('installments') as FormArray;
  }

  addInstallment(installment: { paymentType: { id: number, title: string }, deadline: string, amount: string }) {
    this.installments.push(this.fb.group({
      paymentType: [installment.paymentType],
      deadline: [installment.deadline],
      amount: [installment.amount]
    }));
    this.dataSource.data = this.installments.getRawValue();
  }

  getPaymentInfo() {
    const paymentEl = {
      type: 1,
      condition: 1,
    }

    this.paymentForm.patchValue(paymentEl);
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
    const todayDate = new Date();
    if (paymentTotalNumber != 0) {
      // A seconda del tipo di pagamento e delle condizioni di pagamento, calcolare il totale e le rate
      let paymentType = { id: 0, title: '--' };
      let deadline = new Date(todayDate.setMonth(todayDate.getMonth() + 1));
      let amount = '0,00';
      this.installments.clear();

      if (this.paymentForm.get('type')?.value == 1) {
        // COMPLETO
        amount = this.paymentTotal;

        // a seconda della data di scadenza preimpostata, calcolare deadline

        // a seconda del pagamento impostato assegnare paymentType

        this.addInstallment({ paymentType: paymentType, deadline: deadline.toISOString().split('T')[0], amount: amount });
      }
      else if (this.paymentForm.get('type')?.value == 2) {
        // A RATE
        const installmentNumber: number = 3;
        const daysOffset: number = 30;
        // Dividi il totale in rate e fai un ciclo di inserimento di installments
        amount = (parseFloat(this.paymentTotal.replace(',', '.')) / installmentNumber).toFixed(2).replace('.', ',');
        let difference = Math.ceil((parseFloat(this.paymentTotal.replace(',', '.')) - (parseFloat(amount.replace(',', '.')) * installmentNumber)) * 100) / 100;
        console.log("DIFFERENCE", difference)
        for (let i = 0; i < installmentNumber; i++) {
          deadline = this.addDaysToDate(deadline, daysOffset);
          if (installmentNumber - i == 1) {
            // Se è l'utima rata, aggiungi la differenza al primo pagamento
            amount = (parseFloat(amount.replace(',', '.')) + difference).toFixed(2).replace('.', ',');
          }
          this.addInstallment({ paymentType: paymentType, deadline: deadline.toISOString().split('T')[0], amount: amount });
        }
      }
      else if (this.paymentForm.get('type')?.value == 2) {
        // ANTICIPO

      }
    }
    else {
      this.installments.clear();
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
      if (result.installment) {
        const installment = {
          paymentType: this.paymentTypeList.find((type) => type.id == result.installment.paymentType)!,
          deadline: result.installment.deadline,
          amount: result.installment.amount
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
