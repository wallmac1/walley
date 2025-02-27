import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InvoiceStampReadonly } from '../../../interfaces/invoice-stamp-readonly';

@Component({
  selector: 'app-stamp-readonly',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './stamp-readonly.component.html',
  styleUrl: './stamp-readonly.component.scss'
})
export class StampReadonlyComponent {

  @Input() stamp: InvoiceStampReadonly | null = null;

}
