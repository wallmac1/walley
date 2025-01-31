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

  constructor(private router: Router) {}

  goToBank() {
    this.router.navigate(['bankList']);
  }

  goToInvoice() {
    this.router.navigate(['invoiceList']);
  }

}
