import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-total',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './total.component.html',
  styleUrl: './total.component.scss'
})
export class TotalComponent {

  @Input() totalSummary: { taxable: string, tax: string, notTaxable: string } = { taxable: "0,00", tax: "0,00", notTaxable: "0,00" };
  @Output() totalChanged = new EventEmitter<string>();

  totalForm = new FormGroup({
    discount: new FormControl<string>("0,00", [this.numberWithCommaValidatorPlusMinus(), this.maxNegativeValueValidator(() => this.getTotalDocument())]),
    rounding: new FormControl<string>("0,00", [this.numberWithCommaValidatorPlusMinus(), this.maxNegativeValueValidator(() => this.getTotalDocumentMinusDiscount())]),
    documentTotal: new FormControl<string>("0,00", this.numberWithCommaValidator()),
    paymentTotal: new FormControl<string>("0,00", this.numberWithCommaValidator()),
  })

  constructor() {
    console.log("inizializzato")
  }

  ngOnInit(): void {
    this.initComponent();
    this.totalForm.get('documentTotal')?.valueChanges.subscribe((val) => {
      this.totalChanged.emit(val || '0,00');
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalSummary']) {
      this.totalForm.get('discount')?.updateValueAndValidity();
      this.totalForm.get('rounding')?.updateValueAndValidity();
      this.calculateDocumentTotal();
    }
  }

  initComponent() {
    this.onValueChanges();
    this.calculateDocumentTotal();
  }

  onValueChanges() {
    this.totalForm.get('discount')?.valueChanges.subscribe((val) => { this.calculateDocumentTotal() })
    this.totalForm.get('rounding')?.valueChanges.subscribe((val) => { this.calculateDocumentTotal() })
  }

  calculateDocumentTotal() {
    let total = this.getTotalDocumentMinusDiscount();
    let rounding = 0;

    if (this.totalForm.get('rounding')?.valid) {
      //console.log("dentro")
      rounding = parseFloat(this.totalForm.get('rounding')?.value!.replace(',', '.') || '0')
    }

    total += rounding;

    this.totalForm.get('documentTotal')?.setValue(total.toFixed(2).toString().replace('.', ','))
    //console.log("TOTALE", total)
  }

  getTotalDocument(): number {
    return parseFloat(this.totalSummary.taxable.replace(',', '.')) +
      parseFloat(this.totalSummary.tax.replace(',', '.')) +
      parseFloat(this.totalSummary.notTaxable.replace(',', '.'));
  }

  getTotalDocumentMinusDiscount(): number {
    let discount = 0;
    let total = parseFloat(this.totalSummary.taxable.replace(',', '.')) + parseFloat(this.totalSummary.tax.replace(',', '.'))
      + parseFloat(this.totalSummary.notTaxable.replace(',', '.'))

    if (this.totalForm && this.totalForm.get('discount')?.valid) {
      discount = parseFloat(this.totalForm.get('discount')?.value!.replace(',', '.') || '0')
    }

    total += discount
    return total
  }

  numberWithCommaValidator(): ValidatorFn {
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

  numberWithCommaValidatorPlusMinus(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let value = control.value;

      if (!value) {
        return null; // Se il campo è vuoto, consideralo valido e implicitamente positivo
      }

      // Regex per verificare che il valore sia nel formato corretto
      const regex = /^[+-]?\d*(,\d{0,2})?$/;
      const isValid = regex.test(value);

      return isValid ? null : { invalidNumber: true }; // Restituisce l'errore se non valido
    };
  }

  maxNegativeValueValidator(getTotal: () => number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let value = control.value;

      if (!value) {
        return null; // Se il campo è vuoto, consideralo valido
      }

      // Converte il valore in numero, sostituendo la virgola con il punto per i decimali
      let numericValue = parseFloat(value.replace(',', '.'));

      // Ottiene il totale del documento
      let totalDocument = getTotal();

      // Verifica che il valore non sia inferiore al massimo negativo ammesso (-totalDocument)
      if (numericValue < -totalDocument) {
        return { maxNegativeExceeded: true };
      }

      return null; // Il valore è valido
    };
  }

}
