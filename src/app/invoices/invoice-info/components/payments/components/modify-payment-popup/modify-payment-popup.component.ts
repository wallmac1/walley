import { Component, Inject } from '@angular/core';
import { ConnectServerService } from '../../../../../../services/connect-server.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { SelectBankPopupComponent } from '../select-bank-popup/select-bank-popup.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-modify-payment-popup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    MatDialogModule,
    CommonModule,
    MatExpansionModule,
    MatTooltipModule,
    MatIconModule
  ],
  templateUrl: './modify-payment-popup.component.html',
  styleUrl: './modify-payment-popup.component.scss'
})
export class ModifyPaymentPopupComponent {

  submitted: boolean = false;
  installment: { paymentType: {id: number, title: string}, deadline: string, amount: string } = 
    { paymentType: {id: 0, title: '--'}, deadline: '', amount: '' };
  idPopup: number = 0;
  paymentTypeList: { id: number, description: string, code: string }[] = [];
  paymentTotal: string = "0,00";
  bankList: { id: number, denomination: string, iban: string, abi: string, cab: string, bic: string }[] = [];

  installmentForm = new FormGroup({
    paymentType: new FormControl<number>(0, [Validators.required]),
    deadline: new FormControl<string | null>(null, [Validators.required]),
    amount: new FormControl<string | null>(null, [Validators.required, 
      this.numberWithCommaValidator(), this.maximumValueValidator()]),
  })

  financialForm = new FormGroup({
    denomination: new FormControl<string | null>(null),
    iban: new FormControl<string | null>(null),
    abi: new FormControl<string | null>(null),
    cab: new FormControl<string | null>(null),
    bic: new FormControl<string | null>(null),
  },
    { validators: this.allOrNoneValidator(['denomination', 'iban']) }
  );

  quietanzanteForm = new FormGroup({
    name: new FormControl<string | null>(null),
    surname: new FormControl<string | null>(null),
    fiscalcode: new FormControl<string | null>(null),
    title: new FormControl<string | null>(null),
  },
    { validators: this.allOrNoneValidator(['name', 'surname', 'fiscalcode', 'title']) }
  );

  anticipatedPaymentForm = new FormGroup({
    discount: new FormControl<string | null>(null, [this.numberWithCommaValidator()]),
    deadline: new FormControl<string | null>(null),
  },
  { validators: this.allOrNoneValidator(['discount', 'deadline']) }
);

  delayedPaymentForm = new FormGroup({
    fine: new FormControl<string | null>(null, [this.numberWithCommaValidator()]),
    deadline: new FormControl<string | null>(null),
  },
  { validators: this.allOrNoneValidator(['fine', 'deadline']) }
);

  otherFieldsForm = new FormGroup({
    beneficiary: new FormControl<string | null>(null),
    startDate: new FormControl<string | null>(null),
    postaloffice: new FormControl<string | null>(null),
    code: new FormControl<string | null>(null),
    days: new FormControl<string | null>(null),
  },
  { validators: this.allOrNoneValidator(['startDate', 'postaloffice', 'postaloffice', 'code', 'days']) }
);

  constructor(public dialogRef: MatDialogRef<ModifyPaymentPopupComponent>,
    private connectServerService: ConnectServerService, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // Inizializza il form con i dati passati al dialog
    //console.log(data)
    this.idPopup = data.idPopup;
    this.installment = data.installment;
    this.paymentTypeList = data.paymentTypeList;
    this.paymentTotal = data.paymentTotal;
    this.installmentForm.get('amount')?.patchValue(this.installment.amount);
    this.installmentForm.get('deadline')?.patchValue(this.installment.deadline);
    this.installmentForm.get('paymentType')?.patchValue(this.installment.paymentType.id);
  }

  ngOnInit(): void {
    this.getBankList();
  }

  selectBankPopup() {
    const matDialog = this.dialog.open(SelectBankPopupComponent, {
      maxWidth: '500px',
      minWidth: '350px',
      width: '80%',
      data: {
        bankList: this.bankList,
      },
    });

    matDialog.afterClosed().subscribe((result: { id: number, denomination: string, iban: string, abi: string, cab: string, bic: string }) => {
      if (result) {
        this.financialForm.patchValue(result);
      }
    });
  }

  private maximumValueValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(!control.value || control.value === '') { 
        return null;
      }
      const value = parseFloat(control.value.replace(',', '.'));
      const total = parseFloat(this.paymentTotal.replace(',', '.'));
      //console.log("Totale Documento", total)

      if (value === 0) {
        return { notAllowedValue: true };
      }
      // else if (value > total && total > 0) {
      //   return { maxValue: true };
      // }
      else {
        return null;
      }

    }
  }

  private numberWithCommaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null; // Se il campo è vuoto, consideralo valido
      }

      // Controlla se il valore soddisfa i criteri
      const regex = /^\d*(,\d{0,2})?$/; // Regex: numeri con al massimo una virgola e due cifre dopo di essa
      const isValid = regex.test(value);

      return isValid ? null : { invalidNumber: true }; // Restituisci l'errore se non valido
    };
  }

  allOrNoneValidator(fields: string[]): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const values = fields.map(field => formGroup.get(field)?.value?.trim?.() || formGroup.get(field)?.value);

      const hasFilled = values.some(value => value !== null && value !== '');
      const hasEmpty = values.some(value => value === null || value === '');

      // Se ci sono sia campi compilati che vuoti, allora errore
      return hasFilled && hasEmpty ? { allOrNone: true } : null;
    };
  }

  getBankList() {
    this.bankList = [{
      id: 1,
      denomination: 'Intesa San Paolo - Titolo molto lungo per testare truncate',
      iban: 'IT00A0000000000000000000000',
      abi: '00000',
      cab: '00000',
      bic: 'BIC00000'
    }, {
      id: 2,
      denomination: 'Banca 2',
      iban: 'IT00A0000000000000000000000',
      abi: '00000',
      cab: '00000',
      bic: 'BIC00000'
    },
    {
      id: 2,
      denomination: 'Banca 2',
      iban: 'IT00A0000000000000000000000',
      abi: '00000',
      cab: '00000',
      bic: 'BIC00000'
    },
    {
      id: 1,
      denomination: 'Intesa San Paolo - Titolo molto lungo per testare truncate',
      iban: 'IT00A0000000000000000000000',
      abi: '00000',
      cab: '00000',
      bic: 'BIC00000'
    }, {
      id: 2,
      denomination: 'Banca 2',
      iban: 'IT00A0000000000000000000000',
      abi: '00000',
      cab: '00000',
      bic: 'BIC00000'
    },
    {
      id: 2,
      denomination: 'Banca 2',
      iban: 'IT00A0000000000000000000000',
      abi: '00000',
      cab: '00000',
      bic: 'BIC00000'
    }
    ]
  }

  add() {
    this.submitted = true;
    if (this.installmentForm.valid && this.financialForm.valid && this.quietanzanteForm.valid && 
      this.anticipatedPaymentForm.valid && this.delayedPaymentForm.valid && this.otherFieldsForm.valid) {
        // CHIAMATA AL SERVER PER IL SALVATAGGIO DEI DATI PRESENTI
        // CHIUSURA DEL POPUP CON IL RITORNO DEI DATI
      this.installmentForm.get('amount')?.setValue(this.formatToTwoDecimals(this.installmentForm.get('amount')?.value || '0'));
      this.dialogRef.close({ installment: this.installmentForm.getRawValue() });
    }
  }

  confirm() { 
    this.submitted = true;
    if (this.installmentForm.valid && this.financialForm.valid && this.quietanzanteForm.valid && 
      this.anticipatedPaymentForm.valid && this.delayedPaymentForm.valid && this.otherFieldsForm.valid) {
        // CHIAMATA AL SERVER PER IL SALVATAGGIO DEI DATI PRESENTI
        // CHIUSURA DEL POPUP CON IL RITORNO DEI DATI
      this.installmentForm.get('amount')?.setValue(this.formatToTwoDecimals(this.installmentForm.get('amount')?.value || '0'));
      this.dialogRef.close({ installment: this.installmentForm.getRawValue() });
    }
  }

  close() { 
    this.dialogRef.close(null)
  }

  private formatToTwoDecimals(value: string): string {
  
    // Se la stringa contiene già una virgola
    if (value.includes(',')) {
      let parts = value.split(',');
      if (parts[1].length === 1) {
        // Se c'è un solo decimale, aggiunge uno zero
        return `${parts[0]},${parts[1]}0`;
      } else if (parts[1].length === 2) {
        // Se ci sono già due decimali, non fa nulla
        return value;
      } else {
        // Se ci sono più di due decimali, tronca
        return `${parts[0]},${parts[1].substring(0, 2)}`;
      }
    } else {
      // Se non c'è la virgola, aggiunge ",00"
      return `${value},00`;
    }
  }

}
