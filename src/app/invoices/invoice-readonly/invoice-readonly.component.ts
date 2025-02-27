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
import { InvoiceBodyLine } from '../interfaces/invoice-body-line';
import { InvoiceBodyReadonly } from '../interfaces/invoice-body-readonly';
import { InvoiceHeadingReadonly } from '../interfaces/invoice-heading-readonly';
import { InvoiceVatReadonly } from '../interfaces/invoice-vat-readonly';
import { InvoiceStampReadonly } from '../interfaces/invoice-stamp-readonly';

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
  heading: InvoiceHeadingReadonly | null = null;
  bodyLines: InvoiceBodyReadonly[] = [];
  vatSummary: InvoiceVatReadonly[] = [];
  stamp: InvoiceStampReadonly | null = null;
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
      type: "Fattura Elettronica",
      format: "XML",
      number: "2024-00123",
      conformity: "Regolamento UE 910/2014",
      date: "2024-02-27",
      administrativeref: "ADM-456789",
      currency: "EUR",
      reason: "Servizi di consulenza",
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

    this.vatSummary = [
      {
        id: 1,
        tax: "22%",
        taxable: "1000.00",
        collectability: "Immediata",
        vat: "220.00",
      },
      {
        id: 2,
        tax: "10%",
        taxable: "500.00",
        collectability: "Differita",
        vat: "50.00",
      },
      {
        id: 3,
        tax: "5%",
        taxable: "200.00",
        collectability: "Immediata",
        vat: "10.00",
      },
    ]

    this.bodyLines = [
      {
        id: 1,
        description: "Prodotto Esempio",
        um: "Kg",
        quantity: "5",
        price: "20.50",
        discounts: [
          { isDiscount: 1, value: "10%" },
          { isDiscount: 1, value: "4%" },
        ],
        total: "92.25",
        vat: 22,
        stampLine: false,
      },
      {
        id: 1,
        description: "Prodotto Esempio",
        um: "Kg",
        quantity: "5",
        price: "20.50",
        discounts: [
          { isDiscount: 1, value: "10%" },
          { isDiscount: 0, value: "5%" },
        ],
        total: "92.25",
        vat: 22,
        stampLine: false,
      }
    ];

    this.stamp = {
      id: 1,
      inCharge: "Fornitore",
      total: "2€",
      vat: "0%"
    }
  }

}
