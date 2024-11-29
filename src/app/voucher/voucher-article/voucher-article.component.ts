import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { Lines, MeasurementUnit } from '../interfaces/lines';
import { Line } from 'ngx-extended-pdf-viewer';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-voucher-article',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    TranslateModule
  ],
  templateUrl: './voucher-article.component.html',
  styleUrl: './voucher-article.component.scss'
})
export class VoucherArticleComponent {

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

  deleteArticle(i: number) {
    this.delete.emit(this.index);
  }

  saveArticle(i: number) {
    this.submitted = true;
    if(this.line.valid) {
      this.submitted = false;
      this.save.emit(this.index);
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
