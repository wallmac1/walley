import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion'; 
import { Lines, MeasurementUnit } from '../interfaces/lines';

@Component({
  selector: 'app-voucher-work',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule
  ],
  templateUrl: './voucher-work.component.html',
  styleUrl: './voucher-work.component.scss'
})
export class VoucherWorkComponent {

  @Input() works: Lines[] = [];
  @Input() voucherId: number = 0;

  measurmentUnit: MeasurementUnit[] = [];
  worksForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.worksForm = this.fb.group({
      works: this.fb.array([])
    })
  }

  ngOnInit(): void {
    if (this.works.length > 0) {
      this.addWorks();
    }
    this.getMeasurmentUnits();
  }

  get worksArray(): FormArray {
    return this.worksForm.get('works') as FormArray
  }

  addWorks() {
    this.works.forEach((work: Lines) => {
      this.worksArray.push(this.createWork(work))
    })
  }

  addWork() {
    this.worksArray.push(this.createWorkEmpty());
  }

  private createWork(work: Lines): FormGroup {
    return this.fb.group({
      id: [work.id],
      type_line: [work.type_line],
      description: [work.description],
      quantity: [work.quantity],
      refidunit: [work.refidunit]
    })
  }

  private createWorkEmpty(): FormGroup {
    return this.fb.group({
      id: [0],
      type_line: [2],
      description: [null],
      quantity: [null],
      refidunit: [null]
    })
  }

  deleteWork(i: number) {
    this.worksArray.removeAt(i);
  }

  private getMeasurmentUnits() {
    // CHIAMATA AL SERVER PER PRENDERE LE UNITA' DI MISURA
    this.measurmentUnit = [
      {
        id: 1,
        acronym: "kg"
      },
      {
        id: 2,
        acronym: "pcs"
      },
      {
        id: 3,
        acronym: "m"
      },
      {
        id: 4,
        acronym: "l"
      }
    ]
  }

}
