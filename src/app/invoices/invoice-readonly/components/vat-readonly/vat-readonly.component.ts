import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InvoiceVatReadonly } from '../../../interfaces/invoice-vat-readonly';

@Component({
  selector: 'app-vat-readonly',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './vat-readonly.component.html',
  styleUrl: './vat-readonly.component.scss'
})
export class VatReadonlyComponent {

  isSmallScreen: boolean = false;

  @Input() vatSummary: InvoiceVatReadonly[] = [];

  ngOnInit(): void {
    this.updateWindowDimensions();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  updateWindowDimensions() {
    if (window.innerWidth < 992) {
      this.isSmallScreen = true;
    }
    else {
      this.isSmallScreen = false;
    }
  }

}
