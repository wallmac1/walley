import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { InvoiceBodyLine } from '../../../interfaces/invoice-body-line';
import { InvoiceBodyReadonly } from '../../../interfaces/invoice-body-readonly';

@Component({
  selector: 'app-body-readonly',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    TranslateModule
  ],
  templateUrl: './body-readonly.component.html',
  styleUrl: './body-readonly.component.scss'
})
export class BodyReadonlyComponent {

  @Input() bodyLines: InvoiceBodyReadonly[] = [];

  isSmallScreen: boolean = false;

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
