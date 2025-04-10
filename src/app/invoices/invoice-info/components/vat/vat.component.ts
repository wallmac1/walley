import { Constructor } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-vat',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './vat.component.html',
  styleUrl: './vat.component.scss'
})
export class VatComponent {

  vatForm!: FormGroup;
  submitted: boolean = false;
  isSmallScreen: Boolean = false;

  @Input() collectabilityList: { id: number, name: string }[] = []
  @Input() vatSummary: { total: {taxable: string, tax: string}, 
    vat: { id: number, value: number, description: string | null, code: string; code_internal: string } }[] = [];

  constructor(private fb: FormBuilder) {
    this.vatForm = this.fb.group({
      lines: this.fb.array([])
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initForm();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  updateWindowDimensions() {
    if (window.innerWidth < 768) {
      this.isSmallScreen = true;
    }
    else {
      this.isSmallScreen = false;
    }
  }

  initForm() {
    this.lines.clear();
    this.vatSummary.forEach(line => {
      this.lines.push(this.createLine(line));
    })
  }

  get lines(): FormArray {
    return this.vatForm.get('lines') as FormArray
  }

  createLine(line: { total: {taxable: string, tax: string}, 
      vat: { id: number, value: number, code: string, code_internal: string, description: string | null } }) {
    return this.fb.group({
      vat: [line.vat],
      collectability: [null],
      taxable: [line.total.taxable],
      tax: [line.total.tax]
    })
  }

  startsWithNumber(value: string | null): boolean {
    return !!value && /^[0-9]/.test(value);
  }

}
