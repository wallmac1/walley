import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, viewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion'; 
import { Lines, MeasurementUnit } from '../interfaces/lines';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-voucher-work',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    TranslateModule
  ],
  templateUrl: './voucher-work.component.html',
  styleUrl: './voucher-work.component.scss'
})
export class VoucherWorkComponent {

  @Input() line!: FormGroup;
  @Input() index: number = -1;
  @Output() delete = new EventEmitter<number>();
  @Output() save = new EventEmitter<number>();

  submitted = false;
  measurmentUnit: MeasurementUnit[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getMeasurmentUnits();
  }

  deleteWork(i: number) {
    this.delete.emit(this.index);
  }

  saveWork(i: number) {
    this.submitted = true;
    if(this.line.valid) {
      this.submitted = false;
      this.save.emit(i);
    }
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
