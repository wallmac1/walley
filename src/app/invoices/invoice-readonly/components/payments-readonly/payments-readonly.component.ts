import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InvoicePaymentReadonly } from '../../../interfaces/invoice-payment-readonly';

@Component({
  selector: 'app-payments-readonly',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './payments-readonly.component.html',
  styleUrl: './payments-readonly.component.scss'
})
export class PaymentsReadonlyComponent {

  @Input() payment: InvoicePaymentReadonly | null = null;

}
