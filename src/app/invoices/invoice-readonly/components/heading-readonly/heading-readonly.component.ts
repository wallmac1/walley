import { Component, Input } from '@angular/core';
import { InvoiceHeading } from '../../../interfaces/invoice-heading';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { InvoiceHeadingReadonly } from '../../../interfaces/invoice-heading-readonly';

@Component({
  selector: 'app-heading-readonly',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './heading-readonly.component.html',
  styleUrl: './heading-readonly.component.scss'
})
export class HeadingReadonlyComponent {

  @Input() heading: InvoiceHeadingReadonly | null = null;

}
