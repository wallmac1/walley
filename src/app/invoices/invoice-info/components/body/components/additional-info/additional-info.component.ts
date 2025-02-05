import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime } from 'rxjs';

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

  @Input() fatherLine!: FormGroup
  @Input() lineIndex: number = 0;

  @Output() modifiedDiscount = new EventEmitter<{lineIndex: number}>

  //additionalInfoForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.onValueChanges();
  }

  createEmptyLine() {
    return this.fb.group({
      isDiscount: [1],
      value: ["0,00", this.numberWithCommaValidator()]
    })
  }

  onValueChanges() {
    this.discounts.controls.forEach((group, index) => {
      group.get('value')?.valueChanges.pipe(debounceTime(300)).subscribe(() => this.modifiedDiscount.emit({lineIndex: this.lineIndex}));
      group.get('isDiscount')?.valueChanges.pipe(debounceTime(300)).subscribe(() => this.modifiedDiscount.emit({lineIndex: this.lineIndex}));
    });
  }

  get discounts(): FormArray {
    return this.fatherLine.get('discounts') as FormArray;
  }

  addDiscountLine() {
    this.discounts.push(this.createEmptyLine());
    this.onValueChanges();
    //console.log(this.discounts.getRawValue())
  }

  deleteLine(index: number) {
    this.discounts.controls.splice(index, 1);
    this.modifiedDiscount.emit({lineIndex: this.lineIndex})
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
