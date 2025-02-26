import { Component, Input } from '@angular/core';
import { InvoiceHeading } from '../../../interfaces/invoice-heading';

@Component({
  selector: 'app-heading-readonly',
  standalone: true,
  imports: [],
  templateUrl: './heading-readonly.component.html',
  styleUrl: './heading-readonly.component.scss'
})
export class HeadingReadonlyComponent {

  @Input() heading: InvoiceHeading | null = null;

}
