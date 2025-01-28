import { Component, Input } from '@angular/core';
import { Customer } from '../../../../tickets/interfaces/customer';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

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

  @Input() customer: Customer | null = null;

}
