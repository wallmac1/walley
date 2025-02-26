import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-vat-readonly',
  standalone: true,
  imports: [],
  templateUrl: './vat-readonly.component.html',
  styleUrl: './vat-readonly.component.scss'
})
export class VatReadonlyComponent {

  @Input() vatSummary: { total: { taxable: string, tax: string }, vat: { id: number, value: number } }[] = [];

}
