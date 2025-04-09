import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Connect } from '../../../classes/connect';
import { ApiResponse } from '../../../weco/interfaces/api-response';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-payment-new-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './payment-new-popup.component.html',
  styleUrl: './payment-new-popup.component.scss'
})
export class PaymentNewPopupComponent {

  xml_codes: { id: number; code: string; description: string }[] = [];
  bankList: { id: number; type: string }[] = [];
  deadlineList: { id: number; name: string }[] = [];

  installmentList: { id: number, title: string }[] = [];
  submitted: boolean = false;
  //isNote: boolean = false;

  paymentConditionsForm = new FormGroup({
    code: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null, Validators.required),
    xml_code: new FormControl<number | null>(null, Validators.required),
    installments_number: new FormControl<number>(0, this.periodicityRequiredValidator()),
    periodicity: new FormControl<string | null>(null, this.maxIntegerValidator()),
    deadline: new FormControl<string | null>(null, [this.maxIntegerValidator(), Validators.required]),
    deadline_type: new FormControl<number | null>(null, [Validators.required, this.exactDaySelectedValidator()]),
    exact_day: new FormControl<string | null>(null, this.maxIntegerValidator(31)),
    bank_type: new FormControl<number | null>(null),
  })

  constructor(public dialogRef: MatDialogRef<PaymentNewPopupComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // Inizializza il form con i dati passati al dialog
    this.paymentConditionsForm.patchValue(data.element);
    this.paymentConditionsForm.get('bank_type')?.setValue(data.element.bank_type?.id || null);
    this.paymentConditionsForm.get('deadline_type')?.setValue(data.element.deadline_type?.id || null);
    this.paymentConditionsForm.get('xml_code')?.setValue(data.element.xml_code?.id || null);
    if(data.element.exact_day) {
      this.paymentConditionsForm.get('exact_day')?.setValue(data.element.exact_day.toString());
    }
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

  filter() { }

  periodicityRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control.parent;
      if (!formGroup) {
        return null;
      }

      const installmentsNumber = formGroup.get('installments_number')?.value;
      const periodicityControl = formGroup.get('periodicity');
      const deadlineControl = formGroup.get('deadline');

      if (installmentsNumber > 1) {
        // Se installments_number > 1, il campo periodicity è obbligatorio
        periodicityControl?.enable({ emitEvent: false });
        periodicityControl?.addValidators([Validators.required, this.maxIntegerValidator()]);
        periodicityControl?.updateValueAndValidity({ emitEvent: false });
        // deadlineControl?.disable({ emitEvent: false });
        // deadlineControl?.setValue(null, { emitEvent: false });
        // deadlineControl?.clearValidators();
        // deadlineControl?.updateValueAndValidity({ emitEvent: false });
      } else {
        // Se installments_number <= 1, disabilita il campo periodicity
        periodicityControl?.disable({ emitEvent: false });
        periodicityControl?.setValue(null, { emitEvent: false });
        periodicityControl?.clearValidators();
        periodicityControl?.updateValueAndValidity({ emitEvent: false });
        // deadlineControl?.enable({ emitEvent: false });
        // deadlineControl?.addValidators([Validators.required, this.maxIntegerValidator()]);
        // deadlineControl?.updateValueAndValidity({ emitEvent: false });
      }
      return null;
    };
  }

  maxIntegerValidator(max: number = 120): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return null; // Non valida se il campo è vuoto, lascia ad altri validator (es. required)
      }
  
      const isInteger = Number.isInteger(+value);
      const isWithinRange = isInteger && +value > 0 && +value <= max;
  
      return isWithinRange ? null : { maxInteger: { max, actual: value } };
    };
  }

  exactDaySelectedValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control.parent;
      if (!formGroup) {
        return null;
      }

      const deadlineType = formGroup.get('deadline_type')?.value;
      const exactDayControl = formGroup.get('exact_day');

      if (deadlineType === 3) {
        // Se il deadline_type è 3, il campo exact_day è obbligatorio
        exactDayControl?.enable({ emitEvent: false });
        exactDayControl?.addValidators([Validators.required, this.maxIntegerValidator()]);
        exactDayControl?.updateValueAndValidity({ emitEvent: false });
      } else {
        // Se il deadline_type non è 3, disabilita il campo exact_day
        exactDayControl?.setValue(null, { emitEvent: false });
        exactDayControl?.disable({ emitEvent: false });
        exactDayControl?.updateValueAndValidity({ emitEvent: false });
      }
      return null;
    };
  }

  addPaymentCondition() {
    this.submitted = true;
    // console.log(this.paymentConditionsForm.errors)
    if (this.paymentConditionsForm.valid) {
      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'invoice/inserisciCondizionePagamento', {
        code: this.paymentConditionsForm.get('code')?.value,
        description: this.paymentConditionsForm.get('description')?.value, xml_code: this.paymentConditionsForm.get('xml_code')?.value,
        installments_number: this.paymentConditionsForm.get('installments_number')?.value,
        periodicity: this.paymentConditionsForm.get('periodicity')?.value, deadline: this.paymentConditionsForm.get('deadline')?.value,
        deadline_type: this.paymentConditionsForm.get('deadline_type')?.value, exact_day: this.paymentConditionsForm.get('exact_day')?.value,
        bank_type: this.paymentConditionsForm.get('bank_type')?.value, note: this.paymentConditionsForm.get('note')?.value
      }).subscribe((val: ApiResponse<any>) => {
        if (val) {

          this.dialogRef.close(true);
        }
      })
    }
  }

  close() {
    this.dialogRef.close(null);
  }

}
