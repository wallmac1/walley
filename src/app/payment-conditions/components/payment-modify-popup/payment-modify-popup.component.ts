import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';

@Component({
  selector: 'app-payment-modify-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatDialogModule
  ],
  templateUrl: './payment-modify-popup.component.html',
  styleUrl: './payment-modify-popup.component.scss'
})
export class PaymentModifyPopupComponent {

  xml_codes: { id: number, title: string }[] = [
    { id: 1, title: 'Codice 1' },
    { id: 2, title: 'Codice 2' }
  ];
  deadlineList: { id: number, title: string }[] = [
    { id: 1, title: 'Data Fattura' },
    { id: 2, title: 'Fine Mese' },
    { id: 3, title: 'Giorno Esatto' },
  ];
  bankList: { id: number, name: string }[] = [
    { id: 1, name: 'Intesa San Paolo' },
    { id: 2, name: 'Monte dei Paschi di Siena' },
    { id: 3, name: 'Credito Cooperativo del Mugello' },
  ];
  installmentList: { id: number, title: string }[] = [];
  submitted: boolean = false;
  isNote: boolean = false;

  paymentConditionsForm = new FormGroup({
    id: new FormControl<number>(0),
    code: new FormControl<string | null>(null),
    description: new FormControl<string | null>(null),
    xml_code: new FormControl<string | null>(null),
    installment_number: new FormControl<number>(0),
    periodicity: new FormControl<string | null>(null),
    deadline: new FormControl<string | null>(null),
    deadline_type: new FormControl<number | null>(null),
    exact_day: new FormControl<string | null>(null),
    bank: new FormControl<number | null>(null),
    note: new FormControl<string | null>(null),
  })

  constructor(public dialogRef: MatDialogRef<PaymentModifyPopupComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // Inizializza il form con i dati passati al dialog
    this.paymentConditionsForm = data.paymentCondition;
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

  addNote() {
    this.isNote = true;
  }

  filter() { }

  save() { }

}
