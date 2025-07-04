import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { InvoiceBodyLine } from '../../../interfaces/invoice-body-line';
import { MeasurementUnit } from '../../../../interfaces/measurement-unit';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { debounceTime } from 'rxjs';
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

  // LISTE PER SELECT EREDITATE DA INVOICE-INFO
  @Input() umList: MeasurementUnit[] = [];
  @Input() vatList: { id: number, code: string, code_internal: string, description: string | null, value: number }[] = [];

  // EVENTI DI MODIFICA IVA E TOTALE DELLE LINEE, INVIATI AL COMPONENTE "INVOICE-INFO"
  @Output() vatSummary = new EventEmitter<{ vatSummary: { total: { taxable: string, tax: string }, 
    vat: { id: number, value: number, code: string, code_internal: string, description: string } }[] }>();
  @Output() totalSummary = new EventEmitter<{ totalSummary: { taxable: string, tax: string, notTaxable: string } }>()

  constructor(private fb: FormBuilder) {
    this.bodyForm = this.fb.group({
      lines: this.fb.array([this.createEmptyLine()])
    });
  }

  ngOnInit(): void {
    this.getLines();
    this.addValueChangesListener();
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

  getLine(index: number): FormGroup {
    return this.lines.at(index) as FormGroup
  }

  // CALCOLA IL VALORE DEL TOTALE SOLAMENTE SULLA LINEA CHE HA SUBITO UNA MODIFICA
  calculateTotal(index: number) {
    if (this.lines.valid) {
      const line = this.lines.at(index);
      const quantity = parseFloat(line.get('quantity')?.value.replace(',', '.') || '0');
      const price = parseFloat(line.get('price')?.value.replace(',', '.') || '0');

      // Calcolo del totale senza sconto
      let total = quantity * price;
      // Calcolo sconto
      this.getDiscounts(index).controls.forEach((line) => {
        let discount = total * parseFloat(line.get('value')?.value.replace(',', '.') || '0') / 100;
        if (line.get('isDiscount')?.value == 1) {
          total -= discount;
        }
        else {
          total += discount;
        }
      })

      line.patchValue({ total: total.toFixed(4).toString().replace('.', ',') }, { emitEvent: false });

      // Aggiorna i valori del resoconto iva e totale a seguito della modifica effettuata
      this.calculateVatSummary();
      this.calculateTotalSummary();
    }
  }

  // AGGIUNGE UN LISTENER PER LE MODIFICHE SUI CAMPI DEL FORM CHE DETERMINANO L'IVA E IL TOTALE 
  private addValueChangesListener() {
    this.lines.controls.forEach((group, index) => {
      group.get('quantity')?.valueChanges.pipe(debounceTime(300)).subscribe(() => this.calculateTotal(index));
      group.get('price')?.valueChanges.pipe(debounceTime(300)).subscribe(() => this.calculateTotal(index));
      group.get('vat')?.valueChanges.pipe(debounceTime(300)).subscribe(() => { this.calculateVatSummary(); this.calculateTotalSummary(); });
    });
  }

  // CALCOLA UN RESOCONTO IVA PER IL COMPONENTE "VAT"
  calculateVatSummary() {
    // Crea un array orientato all'interfaccia richiesta dal componente "vat"
    let arrayVatSummary: { total: { taxable: string, tax: string }, 
      vat: { id: number, value: number, description: string, code: string, code_internal: string } }[] = [];

    this.lines.controls.forEach((line) => {
      // Crea un oggetto che rappresenta un singolo elemento del precedente array, inizializzato a 0.
      let lineVatSummary: { total: { taxable: string, tax: string }, 
        vat: { id: number, value: number, description: string, code: string, code_internal: string } } =
      {
        total: { taxable: '0,0000', tax: '0,0000' },
        vat: { id: 0, value: 0, code: '', code_internal: '', description: '' }
      };

      // Assegna all'oggetto appena creato il valore del totale e l'id dell'iva selezionata
      lineVatSummary.total.taxable = line.get('total')?.value;
      lineVatSummary.vat = line.get('vat')?.value;

      if (lineVatSummary.vat.id && lineVatSummary.vat.id != 0) {
        // Se l'iva è stata assegnata, recupera il valore effettivo dell'iva selezionata
        lineVatSummary.vat.value = this.vatList.find(vat => vat.id == line.get('vat')?.value)?.value ?? 0;
        // Calcola l'imposta sul totale in base al valore di iva appena recuperato
        lineVatSummary.total.tax = this.scientificRound((lineVatSummary.vat.value * 0.01) * parseFloat(lineVatSummary.total.taxable.replace(',', '.')));

        if (arrayVatSummary.length > 0) {
          // Se è presente almeno un elemento nell'array, controlla se l'iva dell'oggetto corrente è uguale a quella di un altro elemento
          let foundSameVat: boolean = false;
          arrayVatSummary.forEach(arrayLine => {
            if (arrayLine.vat.id == lineVatSummary.vat.id) {
              // Se iva è la stessa somma il totale e l'imposta della linea corrente con quella già presente (arrotondando a 2 cifre)
              let taxableResult = parseFloat(arrayLine.total.taxable.replace(',', '.')) + parseFloat(lineVatSummary.total.taxable.replace(',', '.'));
              arrayLine.total.taxable = this.scientificRound(taxableResult);
              let taxResult = parseFloat(arrayLine.total.tax.replace(',', '.')) + parseFloat(lineVatSummary.total.tax.replace(',', '.'));
              arrayLine.total.tax = this.scientificRound(taxResult);
              foundSameVat = true;
            }
          });
          if (foundSameVat == false) {
            // Se nell'array non esiste un elemento con la stessa iva inserisce l'oggetto
            lineVatSummary.total.taxable = this.scientificRound(parseFloat(lineVatSummary.total.taxable.replace(',', '.')));
            arrayVatSummary.push(lineVatSummary);
          }
        }
        else {
          // Se l'array è vuoto inserisce l'oggetto
          lineVatSummary.total.taxable = this.scientificRound(parseFloat(lineVatSummary.total.taxable.replace(',', '.')));
          arrayVatSummary.push(lineVatSummary);
        }
      }
    })
    // Emette l'evento al componente padre "invoice-info"
    this.vatSummary.emit({ vatSummary: arrayVatSummary });
  }

  // CALCOLA UN RESOCONTO PER IL COMPONENTE "TOTAL"
  calculateTotalSummary() {
    // Crea un array orientato all'interfaccia richiesta dal componente "total"
    let totalSummary: { taxable: string, tax: string, notTaxable: string } =
    {
      taxable: '0,00', tax: '0,00', notTaxable: '0,00'
    };
    let taxable = 0;
    let tax = 0;
    let notTaxable = 0;

    this.lines.controls.forEach((line) => {
      if (line.get('vat')?.value != null && this.vatList.find(vat => vat.id == line.get('vat')?.value)?.value! > 0) {
        // Se è stato selezionato un valore per l'iva, calcola l'imposta, e cumula totale e imposta con le altre linee con iva
        taxable += parseFloat(line.get('total')?.value.replace(',', '.'));
        tax += (this.vatList.find(vat => vat.id == line.get('vat')?.value)?.value! * 0.01) * parseFloat(line.get('total')?.value.replace(',', '.'));
      }
      else {
        // Se non è stato selezionato un valore per l'iva somma il totale della linea con i valori non tassati
        notTaxable += parseFloat(line.get('total')?.value.replace(',', '.'));
      }
    });
    // Converti in stringhe
    totalSummary.taxable = taxable.toFixed(2).toString().replace('.', ',');
    totalSummary.tax = tax.toFixed(2).toString().replace('.', ',');
    totalSummary.notTaxable = notTaxable.toFixed(2).toString().replace('.', ',');

    // Emetti l'evento al comonente padre "invoice-info"
    this.totalSummary.emit({ totalSummary: totalSummary });
  }

  // ARROTONDA I VALORI
  scientificRound(value: number, decimalPlaces: number = 2): string {
    const factor = Math.pow(10, decimalPlaces);
    return (Math.round(value * factor) / factor).toFixed(2).toString().replace('.', ',');
  }

  // SPOSTA LE LINE A SEGUITO DEL TRASCINAMENTO
  drop(event: CdkDragDrop<FormGroup[]>) {
    moveItemInArray(this.lines.controls, event.previousIndex, event.currentIndex);
    this.addValueChangesListener();
  }

  // PRENDE LE LINEE DAL SERVER, CREA I FORM ARRAY E CALCOLA I NUOVI RESOCONTI
  getLines() {
    // CHIAMATA AL SERVER, SE LINEE > 0 ALLORA RESET DEL FORM E CREA QUELLE ESISTENTI. 
    // NEL SUBSCRIBE: this.createBodyForm(lines);
    this.calculateVatSummary();
    this.calculateTotalSummary();
    //this.addValueChangesListener(); Se ci sono linee aggiungi i valuechanges
  }

  get lines(): FormArray {
    return this.bodyForm.get('lines') as FormArray;
  }

  getDiscounts(index: number): FormArray {
    return this.lines.at(index).get('discounts') as FormArray;
  }

  addLine() {
    this.lines.push(this.createEmptyLine());
    this.addValueChangesListener();
  }

  // AGGIUNGE LA LINEA DEL BOLLO
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

  // ELIMINA LA LINEA DEL BOLLO
  deleteStampLine() {
    const index = this.lines.controls.findIndex(line => line.get('stampLine')?.value == true);
    this.lines.removeAt(index);
    this.calculateVatSummary();
    this.calculateTotalSummary();
  }

  // SPOSTA LA LINEA DEL BOLLO
  changeStampLine(total: string, vat: number, description: string) {
    const stampLineIndex = this.lines.controls.findIndex(line => line.get('stampLine')?.value == true);
    if (stampLineIndex) {
      this.lines.at(stampLineIndex).get('total')?.setValue(total);
      this.lines.at(stampLineIndex).get('vat')?.setValue(vat);
      this.calculateVatSummary();
      this.calculateTotalSummary();
    }
  }

  deleteLine(index: number) {
    this.lines.removeAt(index);
    this.calculateVatSummary();
    this.calculateTotalSummary();
  }

  duplicateLine(index: number) {
    const copiedLine = this.lines.at(index).getRawValue();
    let duplicateLine = this.fb.group({
      id: [0],
      description: [copiedLine.description],
      refidum: [copiedLine.refidum],
      quantity: [copiedLine.quantity],
      price: [copiedLine.price],
      total: [copiedLine.total],
      vat: [copiedLine.vat],
      stampLine: [false],
      isAdditionalFieldOpen: [false],
      discounts: this.fb.array([])
    })
    this.lines.insert(index + 1, duplicateLine);
  }

  // CREA I FORM ARRAY CON I VALORI RECUPERATI DAL SERVER
  createBodyForm(lines: InvoiceBodyLine[]) {
    this.lines.clear();
    let index = 0;
    lines.forEach((line: InvoiceBodyLine) => {
      this.lines.push(this.createLine(line));
      this.calculateTotal(index);
      index += 1;
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
      stampLine: [line.stampLine],
      isAdditionalFieldOpen: [false],
      discounts: this.createDiscountsArray(line.discounts)
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
      vat: [{id: 0, value: 0, code: '', code_internal: '', description: ''}],
      stampLine: [false],
      isAdditionalFieldOpen: [false],
      discounts: this.fb.array([])
    })
  }

  createEmptyDiscountLine() {
    return this.fb.group({
      isDiscount: [1],
      value: ["0,00"]
    })
  }

  createDiscountLine(discount: { isDiscount: number, value: string }): FormGroup {
    return this.fb.group({
      isDiscount: [discount.isDiscount],
      value: [discount.value, this.numberWithCommaValidator(2)]
    });
  }

  createDiscountsArray(discounts: { isDiscount: number, value: string }[] | null): FormArray {
    const discountArray = this.fb.array([]) as FormArray;

    if (discounts && discounts.length > 0) {
      discounts.forEach((discount) => {
        discountArray.push(this.createDiscountLine(discount));
      });
    }

    return discountArray;
  }

  // CHIAMATO DAL FIGLIO PER FORZARE LA RILEVAZIONE DELLA MODIFICA DEI VALORI
  modifiedDiscount(event: { lineIndex: number }) {
    this.calculateTotal(event.lineIndex);
  }

  // APRE E CHIUDE I VAMPI AGGIUNTIVI
  toggleAdditionalInfo(index: number) {
    this.lines.at(index).get('isAdditionalFieldOpen')?.setValue(!this.lines.at(index).get('isAdditionalFieldOpen')?.value);
    //console.log("TOGGLE", this.lines.at(index).get('isAdditionalFieldOpen')?.value)
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

  startsWithNumber(value: string | null): boolean {
    return !!value && /^[0-9]/.test(value);
  }

  saveBody() { }

}
