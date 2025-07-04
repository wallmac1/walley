import { Component, HostListener, Input } from '@angular/core';
import { Customer } from '../../../../tickets/interfaces/customer';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AutocompleteCustomer } from '../../../../customer/interfaces/autocomplete-customer';

@Component({
  selector: 'app-customer-data',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatTooltipModule
  ],
  templateUrl: './customer-data.component.html',
  styleUrl: './customer-data.component.scss'
})
export class CustomerDataComponent {

  isSmallScreen: boolean = false;

  @Input() customer: AutocompleteCustomer | null = null;

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
