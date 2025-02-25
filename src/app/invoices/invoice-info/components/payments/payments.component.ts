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
  }

  getPaymentInfo() {
    const paymentEl = {
      type: 1,
      condition: 1,
    }

    this.paymentForm.patchValue(paymentEl);
  }

  calculateTotal() {
    const paymentTotalNumber = parseFloat(this.paymentTotal.replace(',', '.'));
    if (paymentTotalNumber != 0) {
      // A seconda del tipo di pagamento e delle condizioni di pagamento, calcolare il totale e le rate

      // Temporaneo
      this.installments.clear();
      this.addInstallment({ paymentType: { id: 1, title: "Bonifico" }, deadline: "2022-12-31", amount: this.paymentTotal });
    }
    this.dataSource.data = this.installments.getRawValue();
  }

  editOrAddPayment(index: number | null, idPopup: number) {
    // idpopup: 1 modify, 2 add
    let installment = { paymentType: '', deadline: '', amount: '' };
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
      if (result) {
        if (idPopup == 1) {
          if (result.installment) {
            this.installments.at(index!).patchValue(result.installment);
          }
        }
        else if (idPopup == 2) {
          if (result.installment) {
            this.addInstallment(result.installment);
          }
        }
      }
    });
  }

  deletePayment(index: number) { }

}
