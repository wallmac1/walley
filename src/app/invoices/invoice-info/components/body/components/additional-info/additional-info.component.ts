import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-additional-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './additional-info.component.html',
  styleUrl: './additional-info.component.scss'
})
export class AdditionalInfoComponent {

  @Input() discountList: { isDiscount: boolean, value: string }[] = [];
  @Input() lineIndex: number = 0;

  @Output() modifiedDiscount = new EventEmitter<{index: number, discountList: { isDiscount: boolean, value: string }[]}>

  additionalInfoForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.additionalInfoForm = this.fb.group({
      discounts: this.fb.array([])
    })
  }

  ngOnInit(): void {
    this.initForm();
    this.discounts.controls.forEach(line => { 
      line.get('value')?.valueChanges
      .subscribe(() => {this.modifiedDiscount.emit({index: this.lineIndex, discountList: this.discounts.getRawValue()})}) 
      line.get('isDiscount')?.valueChanges
      .subscribe(() => {this.modifiedDiscount.emit({index: this.lineIndex, discountList: this.discounts.getRawValue()})}) 
    })
  }

  get discounts(): FormArray {
    return this.additionalInfoForm.get('discounts') as FormArray
  }

  initForm() {
    if (this.discountList.length > 0) {
      this.discountList.forEach(line => {
        this.discounts.push(this.createLine(line));
      })
    }
    else {
      this.discounts.push(this.createEmptyLine());
      console.log(this.discounts)
    }
  }

  createEmptyLine() {
    return this.fb.group({
      isDiscount: [true],
      value: ["0,00", this.numberWithCommaValidator()]
    })
  }

  createLine(line: { isDiscount: boolean, value: string }) {
    return this.fb.group({
      isDiscount: [line.isDiscount],
      value: [line.value, this.numberWithCommaValidator()]
    })
  }

  addDiscountLine() {
    this.discounts.push(this.createEmptyLine());
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

}
