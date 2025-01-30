import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { InvoiceBodyLine } from '../../../interfaces/invoice-body-line';
import { MeasurementUnit } from '../../../../interfaces/measurement-unit';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatTooltipModule,
    ReactiveFormsModule,
    DragDropModule
  ],
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss'
})
export class BodyComponent {

  submitted: boolean = false;
  isSmallScreen: boolean = false;
  bodyForm!: FormGroup;

  @Input() umList: MeasurementUnit[] = [];
  @Input() vatList: {id: number, name: string}[] = [];


  constructor(private fb: FormBuilder) {
    this.bodyForm = this.fb.group({
      lines: this.fb.array([this.createEmptyLine()])
    })
  }

  ngOnInit(): void {
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

  drop(event: CdkDragDrop<FormGroup[]>) {
    // Sposta l'elemento all'interno del FormArray
    moveItemInArray(this.lines.controls, event.previousIndex, event.currentIndex);
    
    // Aggiorna il valore del FormArray (necessario per Angular)
    this.bodyForm.setControl('lines', this.fb.array(this.lines.controls));
  }

  getLines() {
    // CHIAMATA AL SERVER, SE LINEE > 0 ALLORA RESET DEL FORM E CREA QUELLE ESISTENTI
    // NEL SUBSCRIBE: this.createBodyForm();
  }

  get lines(): FormArray {
    return this.bodyForm.get('lines') as FormArray;
  }

  addLine() {
    this.lines.push(this.createEmptyLine());
  }

  deleteLine(index: number) {
    this.lines.removeAt(index);
  }

  createBodyForm(lines: InvoiceBodyLine[]) {
    lines.splice(0, lines.length);
    lines.forEach((line: InvoiceBodyLine) => {
      this.lines.push(this.createLine(line));
    });
  }

  createLine(line: InvoiceBodyLine) {
    return this.fb.group({
      id: [line.id],
      description: [line.description],
      refidum: [line.refidum],
      quantity: [line.quantity],
      price: [line.price],
      discount: [line.discount],
      total: [line.total],
      vat: [line.vat]
    })
  }

  createEmptyLine() {
    return this.fb.group({
      id: [0],
      description: [null],
      refidum: [null],
      quantity: ["0,00"],
      price: ["0,0000"],
      discount: ["0,00"],
      total: ["0,0000"],
      vat: [null]
    })
  }

  saveBody() {}

}
