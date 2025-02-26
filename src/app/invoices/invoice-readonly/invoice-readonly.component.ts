import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CustomerDataReadonlyComponent } from "./components/customer-data-readonly/customer-data-readonly.component";
import { HeadingReadonlyComponent } from "./components/heading-readonly/heading-readonly.component";
import { BodyReadonlyComponent } from "./components/body-readonly/body-readonly.component";
import { PaymentsReadonlyComponent } from "./components/payments-readonly/payments-readonly.component";
import { StampReadonlyComponent } from "./components/stamp-readonly/stamp-readonly.component";
import { TotalReadonlyComponent } from "./components/total-readonly/total-readonly.component";
import { Customer } from '../../tickets/interfaces/customer';
import { InvoiceHeading } from '../interfaces/invoice-heading';
import { MatDialog } from '@angular/material/dialog';
import { ConnectServerService } from '../../services/connect-server.service';
import { VatReadonlyComponent } from "./components/vat-readonly/vat-readonly.component";

@Component({
  selector: 'app-invoice-readonly',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CustomerDataReadonlyComponent,
    HeadingReadonlyComponent,
    BodyReadonlyComponent,
    PaymentsReadonlyComponent,
    StampReadonlyComponent,
    TotalReadonlyComponent,
    VatReadonlyComponent
],
  templateUrl: './invoice-readonly.component.html',
  styleUrl: './invoice-readonly.component.scss'
})
export class InvoiceReadonlyComponent {

    // Info of the invoice
    customer: Customer | null = null;
    heading: InvoiceHeading | null = null;
    vatSummary: { total: { taxable: string, tax: string }, vat: { id: number, value: number } }[] = [];
    totalSummary: { taxable: string, tax: string, notTaxable: string, discount: string, rounding: string, documentTotal: string } = 
    { taxable: "0,00", tax: "0,00", notTaxable: "0,00", discount: "0,00", rounding: "0,00", documentTotal: "0,00" };
  
    constructor(public dialog: MatDialog, private connectServerService: ConnectServerService,
      private router: Router) { }
  
    ngOnInit(): void {
      this.getInvoiceInfo();
    }
  
    goBack() {
      this.router.navigate(['invoiceList'])
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
        country: 12,
        region: "Firenze"
      };

      this.totalSummary = {
        taxable: "1000,00",
        tax: "220,00",
        notTaxable: "50,00",
        discount: "30,00",
        rounding: "0,05",
        documentTotal: "1240,05"
      };
    }

}
