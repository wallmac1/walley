import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-total',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './total.component.html',
  styleUrl: './total.component.scss'
})
export class TotalComponent {

  @Input() totalSummary: {taxable: string, tax: string, notTaxable: string} = {taxable: "0,00", tax: "0,00", notTaxable: "0,00"};
  total: number = 0;

  totalForm = new FormGroup({
    discount: new FormControl<string>("0,00"),
    rounding: new FormControl<string | null>(null),
  })

  constructor() {}

  ngOnInit(): void {
    this.initComponent();
  }

  initComponent() {
    console.log("Cambiato", this.totalSummary);
    this.total = parseFloat(this.totalSummary.taxable.replace(',', '.')) + parseFloat(this.totalSummary.tax.replace(',', '.')) + parseFloat(this.totalSummary.notTaxable.replace(',', '.'))
  }

}
