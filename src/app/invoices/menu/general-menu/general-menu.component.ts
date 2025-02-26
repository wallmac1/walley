import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-general-menu',
  standalone: true,
  imports: [],
  templateUrl: './general-menu.component.html',
  styleUrl: './general-menu.component.scss'
})
export class GeneralMenuComponent {

  constructor(private router: Router) { }

  goToBank() {
    this.router.navigate(['bankList']);
  }
  goToCustomerList() {
    this.router.navigate(['customerList']);
  }
  goToCompany() {
    this.router.navigate(['companyRegistry', 0]);
  }
  goToInvoice() {
    this.router.navigate(['invoiceList']);
  }
  goToPaymentCondition() {
    this.router.navigate(['paymentConditions']);
  }

}
