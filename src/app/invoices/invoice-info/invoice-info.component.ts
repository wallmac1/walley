import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Customer } from '../../tickets/interfaces/customer';
import { CustomerDataComponent } from "./components/customer-data/customer-data.component";
import { HeadingComponent } from "./components/heading/heading.component";
import { InvoiceHeading } from '../interfaces/invoice-heading';
import { MatDialog } from '@angular/material/dialog';
import { SelectCustomerPopupComponent } from '../pop-up/select-customer-popup/select-customer-popup.component';
import { ModifyCustomerPopupComponent } from '../pop-up/modify-customer-popup/modify-customer-popup.component';

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

  // Info of the invoice
  customer: Customer | null = null;
  heading: InvoiceHeading | null = null;

  // Select options
  typeList: { id: number, name: string }[] = [];
  formatList: { id: number, name: string }[] = [];
  currencyList: { id: number, name: string }[] = [];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getSelectOptions();
    this.getInvoiceInfo();
  }

  selectCustomer() {
    const dialogRef = this.dialog.open(SelectCustomerPopupComponent, {
      maxWidth: '700px',
      minWidth: '350px',
      maxHeight: '500px',
      width: '90%',
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.customer = result;
      }
    });
  }

  modifyCustomerData() {
    const dialogRef = this.dialog.open(ModifyCustomerPopupComponent, {
      maxWidth: '900px',
      minWidth: '350px',
      maxHeight: '500px',
      width: '90%',
      data: {customer: this.customer}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.customer = result;
      }
    });
  }

  removeCustomer() {
    this.customer = null;
  }

  getCustomerData(id: number) {
    // CHIAMATA AL SERVER PER OTTENERE I DATI DEL CLIENTE
    this.customer = {
      rifidanacliforprodati: 12345,
      id: 1,
      denominazione: "Wallnet snc di Banchi Leonardo e Andrea Margheri",
      codicefiscale: "123A",
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

  getInvoiceInfo() {
    // CHIAMATA AL SERVER PER OTTENERE I DATI DELLA FATTURA
    this.heading = {
      type: 1,
      format: 1,
      number: {
        part1: 5,
        part2: "20AC",
        part3: "41S"
      },
      conformity: 1,
      date: "2021-05-20",
      administrativeref: "Riferimento generico",
      currency: 1,
      reason: "Causale della fattura"
    };
  }

  getSelectOptions() {
    this.typeList = [{
      id: 1,
      name: "Fattura"
    }, {
      id: 2,
      name: "Nota di credito"
    }];

    this.currencyList = [{
      id: 1,
      name: "Euro"
    }, {
      id: 2,
      name: "Dollaro"
    }];

    this.formatList = [{
      id: 1,
      name: "Elettronica"
    }, {
      id: 2,
      name: "Cartacea"
    }];
  }

}
