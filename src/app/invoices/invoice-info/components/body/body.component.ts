import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { InvoiceBodyLine } from '../../../interfaces/invoice-body-line';
import { MeasurementUnit } from '../../../../interfaces/measurement-unit';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { debounceTime } from 'rxjs';
import { InViewportDirective } from '../../../../directives/in-viewport.directive';
import { AdditionalInfoComponent } from "./components/additional-info/additional-info.component";

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatTooltipModule,
    ReactiveFormsModule,
    DragDropModule,
    AdditionalInfoComponent
  ],
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss'
})
export class BodyComponent {

  submitted: boolean = false;
  isSmallScreen: boolean = false;
  bodyForm!: FormGroup;
  additionalInfo: boolean = false;
  additionalFields: { discountList: { isDiscount: boolean, value: string }[] } = { discountList: [] };

  @Input() umList: MeasurementUnit[] = [];
  @Input() vatList: { id: number, name: string, value: number }[] = [];
  @Output() vatSummary = new EventEmitter<{ vatSummary: { total: { taxable: string, tax: string }, vat: { id: number, value: number } }[] }>();
  @Output() totalSummary = new EventEmitter<{ totalSummary: { taxable: string, tax: string, notTaxable: string } }>()

  constructor(private fb: FormBuilder) {
    this.bodyForm = this.fb.group({
      lines: this.fb.array([this.createEmptyLine()])
    });
  }

  ngOnInit(): void {
    this.addValueChangesListener();
    this.getLines();
    this.updateWindowDimensions();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  updateWindowDimensions() {
    if (window.innerWidth < 1200) {
      this.isSmallScreen = true;
    }
    else {
      this.isSmallScreen = false;
    }
  }

  setDiscount(event: {index: number, discountList: {isDiscount: boolean, value: string}[]}) {
    this.additionalFields.discountList = [...event.discountList];
    this.calculateTotal(event.index);
  }

  calculateDiscount(): number {
    let discount = 1;
    this.additionalFields.discountList.forEach(line => {
      if(line.isDiscount) {
        discount *= (1 - parseFloat(line.value.replace(',', '.') || '0') / 100)
      }
      else {
        discount *= (1 + parseFloat(line.value.replace(',', '.') || '0') / 100)
      }
    })
    return discount
  }

  calculateTotal(index: number) {
    if (this.lines.valid) {
      const line = this.lines.at(index);
      const quantity = parseFloat(line.get('quantity')?.value.replace(',', '.') || '0');
      const price = parseFloat(line.get('price')?.value.replace(',', '.') || '0');
      const discount = this.calculateDiscount();

      // Calcolo del totale con lo sconto
      let total = quantity * price * discount;
      line.patchValue({ total: total.toFixed(4).toString().replace('.', ',') }, { emitEvent: false });
      //console.log("CALCOLA TOTALE", total)
      this.calculateVatSummary();
      this.calculateTotalSummary();
    }
  }

  private addValueChangesListener() {
    this.lines.controls.forEach((group, index) => {
      group.get('quantity')?.valueChanges.pipe(debounceTime(300)).subscribe(() => this.calculateTotal(index));
      group.get('price')?.valueChanges.pipe(debounceTime(300)).subscribe(() => this.calculateTotal(index));
      group.get('vat')?.valueChanges.pipe(debounceTime(300)).subscribe(() => { this.calculateVatSummary(); this.calculateTotalSummary() });
    });
  }

  calculateVatSummary() {
    let arrayVatSummary: { total: { taxable: string, tax: string }, vat: { id: number, value: number } }[] = [];
    this.lines.controls.forEach((line) => {
      let lineVatSummary: { total: { taxable: string, tax: string }, vat: { id: number, value: number } } =
      {
        total: { taxable: '0,0000', tax: '0,0000' },
        vat: { id: 0, value: 0 }
      };
      lineVatSummary.total.taxable = line.get('total')?.value;
      lineVatSummary.vat.id = line.get('vat')?.value;
      if (lineVatSummary.vat.id && lineVatSummary.vat.id != 0) {
        lineVatSummary.vat.value = this.vatList.find(vat => vat.id == line.get('vat')?.value)?.value ?? 0;
        lineVatSummary.total.tax = this.scientificRound((lineVatSummary.vat.value * 0.01) * parseFloat(lineVatSummary.total.taxable.replace(',', '.')));
        console.log("TASSA SINGOLA LINEA", lineVatSummary.total.tax)
        if (arrayVatSummary.length > 0) {
          let foundSameVat: boolean = false;
          arrayVatSummary.forEach(arrayLine => {
            if (arrayLine.vat.id == lineVatSummary.vat.id) {
              let taxableResult = parseFloat(arrayLine.total.taxable.replace(',', '.')) + parseFloat(lineVatSummary.total.taxable.replace(',', '.'));
              arrayLine.total.taxable = this.scientificRound(taxableResult);
              let taxResult = parseFloat(arrayLine.total.tax.replace(',', '.')) + parseFloat(lineVatSummary.total.tax.replace(',', '.'));
              arrayLine.total.tax = this.scientificRound(taxResult);
              console.log("TASSA LINEE UNITE", arrayLine.total.tax)
              foundSameVat = true;
            }
          });
          if (foundSameVat == false) {
            lineVatSummary.total.taxable = this.scientificRound(parseFloat(lineVatSummary.total.taxable.replace(',', '.')));
            arrayVatSummary.push(lineVatSummary);
          }
        }
        else {
          lineVatSummary.total.taxable = this.scientificRound(parseFloat(lineVatSummary.total.taxable.replace(',', '.')));
          arrayVatSummary.push(lineVatSummary);
        }
      }
    })
    console.log("EMETTI VATSUMMARY", arrayVatSummary);
    this.vatSummary.emit({ vatSummary: arrayVatSummary });
  }

  calculateTotalSummary() {
    let totalSummary: { taxable: string, tax: string, notTaxable: string } =
    {
      taxable: '0,00', tax: '0,00', notTaxable: '0,00'
    };
    let taxable = 0;
    let tax = 0;
    let notTaxable = 0;
    this.lines.controls.forEach((line) => {
      if (line.get('vat')?.value != null && this.vatList.find(vat => vat.id == line.get('vat')?.value)?.value! > 0) {
        // SE C'È IVA, CALCOLARE E SOMMARE A TAX E TAXABLE
        // ARROTONDARE SULLE SINGOLE LINEE
        taxable += parseFloat(line.get('total')?.value.replace(',', '.'));
        tax += (this.vatList.find(vat => vat.id == line.get('vat')?.value)?.value! * 0.01) * parseFloat(line.get('total')?.value.replace(',', '.'));
      }
      else {
        // SE NON C'È IVA, SOMMARE A NOT TAXABLE
        notTaxable += parseFloat(line.get('total')?.value.replace(',', '.'));
      }
    });
    totalSummary.taxable = taxable.toFixed(2).toString().replace('.', ',');
    totalSummary.tax = tax.toFixed(2).toString().replace('.', ',');
    totalSummary.notTaxable = notTaxable.toFixed(2).toString().replace('.', ',');
    this.totalSummary.emit({ totalSummary: totalSummary });
  }

  scientificRound(value: number, decimalPlaces: number = 2): string {
    const factor = Math.pow(10, decimalPlaces);
    return (Math.round(value * factor) / factor).toFixed(2).toString().replace('.', ',');
  }

  drop(event: CdkDragDrop<FormGroup[]>) {
    // Sposta l'elemento all'interno del FormArray
    moveItemInArray(this.lines.controls, event.previousIndex, event.currentIndex);

    // Aggiorna il valore del FormArray (necessario per Angular)
    this.bodyForm.setControl('lines', this.fb.array(this.lines.controls));
  }

  getLines() {
    // CHIAMATA AL SERVER, SE LINEE > 0 ALLORA RESET DEL FORM E CREA QUELLE ESISTENTI. 
    // INOLTRE ASSEGNA TUTTI I CAMPI AGGIUNTIVI A "additionalFields" CHE LI RIFLETTE NEL COMPONENTE FIGLIO
    // NEL SUBSCRIBE: this.createBodyForm();
    this.calculateVatSummary();
    this.calculateTotalSummary();
  }

  get lines(): FormArray {
    return this.bodyForm.get('lines') as FormArray;
  }

  addLine() {
    this.lines.push(this.createEmptyLine());
    this.addValueChangesListener();
  }

  addStampLine(total: string, vat: number, description: string) {
    const stampLine = this.fb.group({
      id: [0],
      description: [{ value: description, disabled: true }],
      refidum: [{ value: null, disabled: true }],
      quantity: [{ value: "1,00", disabled: true }],
      price: [{ value: "", disabled: true }],
      total: [{ value: total, disabled: true }],
      vat: [{ value: vat, disabled: true }],
      stampLine: [true]
    })
    this.lines.push(stampLine);
    this.calculateVatSummary();
    this.calculateTotalSummary();
  }

  deleteLine(index: number) {
    this.lines.removeAt(index);
    this.calculateVatSummary();
    this.calculateTotalSummary();
  }

  duplicateLine(index: number) {
    const duplicateLine = this.lines.at(index);
    this.lines.insert(index + 1, duplicateLine);
  }

  toggleAdditionalInfo() {
    this.additionalInfo = !this.additionalInfo;
  }

  deleteStampLine() {
    const index = this.lines.controls.findIndex(line => line.get('stampLine')?.value == true);
    this.lines.removeAt(index);
    this.calculateVatSummary();
    this.calculateTotalSummary();
  }

  changeStampLine(total: string, vat: number, description: string) {
    const stampLineIndex = this.lines.controls.findIndex(line => line.get('stampLine')?.value == true);
    if (stampLineIndex) {
      this.lines.at(stampLineIndex).get('total')?.setValue(total);
      this.lines.at(stampLineIndex).get('vat')?.setValue(vat);
      this.calculateVatSummary();
      this.calculateTotalSummary();
    }
  }

  createBodyForm(lines: InvoiceBodyLine[]) {
    lines.splice(0, lines.length);
    lines.forEach((line: InvoiceBodyLine) => {
      this.lines.push(this.createLine(line));
    });
    this.addValueChangesListener();
  }

  createLine(line: InvoiceBodyLine) {
    return this.fb.group({
      id: [line.id],
      description: [line.description],
      refidum: [line.refidum],
      quantity: [line.quantity?.toString().replace('.', ','), this.numberWithCommaValidator(2)],
      price: [line.price?.toString().replace('.', ','), this.numberWithCommaValidator(4)],
      total: [{ value: line.total?.toString().replace('.', ','), disabled: true }],
      vat: [line.vat],
      stampLine: [line.stampLine]
    })
  }

  createEmptyLine() {
    return this.fb.group({
      id: [0],
      description: [null],
      refidum: [null],
      quantity: ["1,00", this.numberWithCommaValidator(2)],
      price: ["0,0000", this.numberWithCommaValidator(4)],
      total: [{ value: "0,0000", disabled: true }],
      vat: [null],
      stampLine: [false]
    })
  }

  numberWithCommaValidator(total: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null; // Se il campo è vuoto, consideralo valido
      }

      let isValid = false;

      // Controlla se il valore soddisfa i criteri
      if (total == 2) {
        const regex = /^\d*(,\d{0,2})?$/; // Regex: numeri con al massimo una virgola e due cifre dopo di essa
        isValid = regex.test(value);
      }
      else if (total == 4) {
        const regex = /^\d*(,\d{0,4})?$/; // Regex: numeri con al massimo una virgola e due cifre dopo di essa
        isValid = regex.test(value);
      }


      return isValid ? null : { invalidNumber: true }; // Restituisci l'errore se non valido
    };
  }

  saveBody() { }

}
