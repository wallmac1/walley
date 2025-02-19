import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { BankPopupComponent } from '../../../../../pop-up/bank-popup/bank-popup.component';

@Component({
  selector: 'app-payment-data',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './payment-data.component.html',
  styleUrl: './payment-data.component.scss'
})
export class PaymentDataComponent {

  @Input() paymentData: any = null;
  @Input() paymentMethods: { id: number, name: string }[] = [
    { id: 1, name: "Metodo 1" }, { id: 2, name: "Metodo 2" }
  ];

  submitted: boolean = false;

  paymentMethod = new FormGroup({
    paymentMethod: new FormControl<number | null>(null)
  })

  bankForm = new FormGroup({
    company_denomination: new FormControl<string | null>(null),
    company_iban: new FormControl<string | null>(null),
    company_abi: new FormControl<string | null>(null),
    company_cab: new FormControl<string | null>(null),
    company_cc: new FormControl<string | null>(null),
    company_bic: new FormControl<string | null>(null),
    customer_denomination: new FormControl<string | null>(null),
    customer_iban: new FormControl<string | null>(null),
    customer_abi: new FormControl<string | null>(null),
    customer_cab: new FormControl<string | null>(null),
    customer_cc: new FormControl<string | null>(null),
    customer_bic: new FormControl<string | null>(null),
  })

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.bankForm.patchValue(this.paymentData);
  }

  searchBank() {
    const dialogRef = this.dialog.open(BankPopupComponent, {
      maxWidth: '800px',
      minWidth: '350px',
      maxHeight: '600px',
      width: '90%',
      data: {
        bankName: this.bankForm.get('denomination')?.getRawValue(),
      }
    });

    dialogRef.afterClosed().subscribe((result: any | null) => {
      if (result) {
        this.bankForm.patchValue(result);
      }
    });
  }

}
