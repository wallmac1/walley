import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Customer } from '../../../../tickets/interfaces/customer';

@Component({
  selector: 'app-customer-data-readonly',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './customer-data-readonly.component.html',
  styleUrl: './customer-data-readonly.component.scss'
})
export class CustomerDataReadonlyComponent {

  isSmallScreen: boolean = false;

  @Input() customer: Customer | null = null;

  ngOnInit(): void {
    this.updateWindowDimensions();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  updateWindowDimensions() {
    if (window.innerWidth < 768) {
      this.isSmallScreen = true;
    }
    else {
      this.isSmallScreen = false;
    }
  }

}
