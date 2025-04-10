import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-stamp',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    TranslateModule,
    MatSelectModule
  ],
  templateUrl: './stamp.component.html',
  styleUrl: './stamp.component.scss'
})
export class StampComponent {

  isSmallScreen: boolean = false;
  description: string = "Bollo virtuale";

  @Input() vatList: { id: number, code: string, code_internal: string, description: string, value: number }[] = [];
  @Output() addStampLine = new EventEmitter<{total: string, vat: number, description: string}>();
  @Output() changeStampLine = new EventEmitter<{total: string, vat: number, description: string}>();
  @Output() deleteStampLine = new EventEmitter<null>();

  stampForm = new FormGroup({
    isStamp: new FormControl<boolean>(false),
    supplierPays: new FormControl<boolean>(false),
    total: new FormControl<string>("0,00", this.numberWithCommaValidator()),
    vat: new FormControl<number>(3, Validators.required)
  })

  ngOnInit(): void {
    this.formLogic();
  }

  formLogic() {
    this.stampForm.get('supplierPays')?.valueChanges.subscribe((val: any) => {
      if(val == true) {
        this.deleteStampLine.emit();
      }
      else if(val == false) {
        this.addStampLine.emit({total: this.stampForm.get('total')?.value!, vat: this.stampForm.get('vat')?.value!, description: this.description});
      }
    })

    this.stampForm.get('isStamp')?.valueChanges.subscribe((val: any) => {
      if(val == false && this.stampForm.get('supplierPays')?.value == false) {
        this.deleteStampLine.emit();
      }
      else if(val == true && this.stampForm.get('supplierPays')?.value == false) {
        this.addStampLine.emit({total: this.stampForm.get('total')?.value!, vat: this.stampForm.get('vat')?.value!, description: this.description});
      }
    })

    this.stampForm.get('total')?.valueChanges.subscribe((val: any) => {
      if(this.stampForm.get('supplierPays')?.value == false) {
        this.changeStampLine.emit({total: this.stampForm.get('total')?.value!, vat: this.stampForm.get('vat')?.value!, description: this.description})
      }
    })

    this.stampForm.get('vat')?.valueChanges.subscribe((val: any) => {
      if(this.stampForm.get('supplierPays')?.value == false) {
        this.changeStampLine.emit({total: this.stampForm.get('total')?.value!, vat: this.stampForm.get('vat')?.value!, description: this.description})
      }
    })
  }

  getDescription() {
    // richiedi la descrizione dello stamp al server
  }

  numberWithCommaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return { invalidNumber: true }; // Se il campo è vuoto, consideralo non valido
      }

      // Controlla se il valore soddisfa i criteri
      const regex = /^\d*(,\d{0,2})?$/; // Regex: numeri con al massimo una virgola e due cifre dopo di essa
      const isValid = regex.test(value);

      return isValid ? null : { invalidNumber: true }; // Restituisci l'errore se non valido
    };
  }

  startsWithNumber(value: string | null): boolean {
    return !!value && /^[0-9]/.test(value);
  }

}
