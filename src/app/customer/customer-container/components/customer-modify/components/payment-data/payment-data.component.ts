import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { BankPopupComponent } from '../../../../../pop-up/bank-popup/bank-popup.component';
import { PaymentData } from '../../../../../interfaces/payment-data';
import { ConnectServerService } from '../../../../../../services/connect-server.service';
import { Connect } from '../../../../../../classes/connect';
import { PaymentTable } from '../../../../../../payment-conditions/interfaces/payment-table';
import { ApiResponse } from '../../../../../../weco/interfaces/api-response';

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

  @Input() idregistry: number = 0;
  @Input() paymentData: PaymentData | null = null;
  @Input() paymentMethodList: PaymentTable[] = [];
  @Output() refreshPaymentData = new EventEmitter<null>;

  submitted: boolean = false;

  paymentMethodForm = new FormGroup({
    payment_method: new FormControl<number | null>(null)
  })

  bankForm = new FormGroup({
    idregistry: new FormControl<number>(0),
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

  constructor(private dialog: MatDialog, private connectServerService: ConnectServerService) { }

  initForm() {
    if(this.paymentData) {
      this.bankForm.patchValue(this.paymentData);
      this.paymentMethodForm.get('payment_method')?.setValue(this.paymentData?.payment_method || null);
    }
    else {
      this.bankForm.reset();
    }
  }

  searchBank() {
    const dialogRef = this.dialog.open(BankPopupComponent, {
      maxWidth: '600px',
      minWidth: '350px',
      maxHeight: '600px',
      width: '90%',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: any | null) => {
      if (result) {
        if (result.bank) {
          this.bankForm.get('company_denomination')?.setValue(result.bank.denomination);
          this.bankForm.get('company_iban')?.setValue(result.bank.iban);
          this.bankForm.get('company_abi')?.setValue(result.bank.abi.code);
          this.bankForm.get('company_cab')?.setValue(result.bank.cab.code);
          this.bankForm.get('company_bic')?.setValue(result.bank.bic);
          this.bankForm.get('company_cc')?.setValue(result.bank.cc);
        }
        else {
          this.bankForm.get('company_denomination')?.setValue(null);
          this.bankForm.get('company_iban')?.setValue(null);
          this.bankForm.get('company_abi')?.setValue(null);
          this.bankForm.get('company_cab')?.setValue(null);
          this.bankForm.get('company_bic')?.setValue(null);
          this.bankForm.get('company_cc')?.setValue(null);
        }
      }
    });
  }

  save() {
    const paymentDataObj = this.bankForm.getRawValue();
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'customer/upsertPaymentFavorite', {
      idregistry: this.idregistry, company_denomination: paymentDataObj.company_denomination,
      company_iban: paymentDataObj.company_iban, company_abi: paymentDataObj.company_abi,
      company_cab: paymentDataObj.company_cab, company_cc: paymentDataObj.company_cc,
      company_bic: paymentDataObj.company_bic, customer_denomination: paymentDataObj.customer_denomination,
      customer_iban: paymentDataObj.customer_iban, customer_abi: paymentDataObj.customer_abi,
      customer_cab: paymentDataObj.customer_cab, customer_cc: paymentDataObj.customer_cc,
      customer_bic: paymentDataObj.customer_bic, payment_method: this.paymentMethodForm.getRawValue().payment_method
    }).subscribe((val: ApiResponse<any>) => {
      if (val) {
        this.refreshPaymentData.emit();
      }
    })
  }

}
