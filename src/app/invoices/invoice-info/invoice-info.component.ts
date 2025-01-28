import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Customer } from '../../tickets/interfaces/customer';
import { CustomerDataComponent } from "./components/customer-data/customer-data.component";
import { HeadingComponent } from "./components/heading/heading.component";

@Component({
  selector: 'app-invoice-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    TranslateModule,
    CustomerDataComponent,
    HeadingComponent
],
  templateUrl: './invoice-info.component.html',
  styleUrl: './invoice-info.component.scss'
})
export class InvoiceInfoComponent {

  customer: Customer | null = null;

  constructor() { }

  ngOnInit(): void {
    this.getCustomer();
  }

  getCustomer() {
    this.customer = {
      rifidanacliforprodati: 12345,
      id: 1,
      denominazione: "Wallnet snc di Banchi Leonardo e Andrea Margheri",
      codicefiscale: "12345678901",
      cognome: "Rossi",
      data_nascita: "1985-05-20",
      email: "mario.rossi@example.com",
      nome: "Mario",
      piva: "IT98765432109",
      telefono: "+39 055 123456",
      type: "Azienda",
      address: "Via Roma",
      pec: "info@wallnet.it",
      sdi: "ABC1234",
      cap: "50100",
      city: "Firenze",
      house_number: "25A",
      country: "Italia",
      region: "Firenze"
    };
  }

}
