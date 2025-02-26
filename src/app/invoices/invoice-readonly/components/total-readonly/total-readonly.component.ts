import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-total-readonly',
  standalone: true,
  imports: [],
  templateUrl: './total-readonly.component.html',
  styleUrl: './total-readonly.component.scss'
})
export class TotalReadonlyComponent {

  @Input() totalSummary: { taxable: string, tax: string, notTaxable: string } = { taxable: "0,00", tax: "0,00", notTaxable: "0,00" };

}
