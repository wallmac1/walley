import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-overview-popup',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  templateUrl: './payment-overview-popup.component.html',
  styleUrl: './payment-overview-popup.component.scss'
})
export class PaymentOverviewPopupComponent {


  xml_codes: { id: number; code: string; description: string }[] = [];
  bankList: { id: number; type: string }[] = [];
  deadlineList: { id: number; name: string }[] = [];

  installmentList: { id: number, title: string }[] = [];
  submitted: boolean = false;
  isNote: boolean = false;

  paymentConditionsForm = new FormGroup({
    code: new FormControl<string | null>(null),
    description: new FormControl<string | null>(null),
    xml_code: new FormControl<number | null>(null),
    installments_number: new FormControl<number>(0),
    periodicity: new FormControl<string | null>(null),
    deadline: new FormControl<string | null>(null),
    deadline_type: new FormControl<number | null>(null),
    exact_day: new FormControl<string | null>(null),
    bank_type: new FormControl<number | null>(null),
  })

  constructor(public dialogRef: MatDialogRef<PaymentOverviewPopupComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // Inizializza il form con i dati passati al dialog
    this.paymentConditionsForm.patchValue(data.element);
    this.paymentConditionsForm.get('bank_type')?.setValue(data.element.bank_type?.id || null);
    this.paymentConditionsForm.get('deadline_type')?.setValue(data.element.deadline_type?.id || null);
    this.paymentConditionsForm.get('xml_code')?.setValue(data.element.xml_code?.id || null);
    this.paymentConditionsForm.disable();
    this.xml_codes = data.xml_codes;
    this.bankList = data.bankList;
    this.deadlineList = data.deadlineList;
  }

  ngOnInit(): void {
    this.createInstallmentList();
  }

  createInstallmentList() {
    for (let i = 1; i <= 10; i++) {
      const installment = { id: i, title: (i).toString() }
      this.installmentList.push(installment);
    }
  }

  close() {
    this.dialogRef.close(null);
  }


}
