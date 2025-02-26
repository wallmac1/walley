import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Customer } from '../../tickets/interfaces/customer';
import { CustomerDataComponent } from "./components/customer-data/customer-data.component";
import { HeadingComponent } from "./components/heading/heading.component";
import { InvoiceHeading } from '../interfaces/invoice-heading';
import { MatDialog } from '@angular/material/dialog';
import { SelectCustomerPopupComponent } from '../../customer/pop-up/select-customer-popup/select-customer-popup.component';
import { ModifyCustomerPopupComponent } from '../../customer/pop-up/modify-customer-popup/modify-customer-popup.component';
import { BodyComponent } from "./components/body/body.component";
import { Connect } from '../../classes/connect';
import { MeasurementUnit } from '../../interfaces/measurement-unit';
import { ApiResponse } from '../../weco/interfaces/api-response';
import { ConnectServerService } from '../../services/connect-server.service';
import { VatComponent } from "./components/vat/vat.component";
import { TotalComponent } from "./components/total/total.component";
import { PaymentsComponent } from "./components/payments/payments.component";
import { Router } from '@angular/router';
import { StampComponent } from "./components/stamp/stamp.component";

@Component({
  selector: 'app-invoice-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    TranslateModule,
    CustomerDataComponent,
    HeadingComponent,
    BodyComponent,
    VatComponent,
    TotalComponent,
    PaymentsComponent,
    StampComponent
  ],
  templateUrl: './invoice-info.component.html',
  styleUrl: './invoice-info.component.scss'
})
export class InvoiceInfoComponent implements OnInit {

  @ViewChild(BodyComponent) bodyComponent!: BodyComponent;
  @ViewChild(TotalComponent) totalComponent!: TotalComponent;
  @ViewChild(PaymentsComponent) paymentsComponent!: PaymentsComponent;

  // Info of the invoice
  customer: Customer | null = null;
  heading: InvoiceHeading | null = null;
  vatSummary: { total: { taxable: string, tax: string }, vat: { id: number, value: number } }[] = [];
  totalSummary: { taxable: string, tax: string, notTaxable: string } = { taxable: "0,00", tax: "0,00", notTaxable: "0,00" };
  paymentTotal: string = "0,00";

  // Select options
  typeList: { id: number, code: string, description: string }[] = [];
  formatList: { id: number, code: string, description: string }[] = [];
  currencyList: { id: number, code: string, description: string }[] = [];
  paymentType: { id: number, title: string }[] = [];
  paymentCondition: { id: number, title: string }[] = [];
  umList: MeasurementUnit[] = [];
  vatList: { id: number, name: string, value: number }[] = [];
  paymentTypeList: { id: number, title: string }[] = [];
  conditionsList: { id: number, title: string }[] = [];

  constructor(public dialog: MatDialog, private connectServerService: ConnectServerService,
    private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.getTipiDocumento();
    this.getFormatoTrasmissione();
    this.getCurrencies();
    this.getSelectOptions();
    this.getInvoiceInfo();
  }

  private getTipiDocumento() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'invoice/tipiDocumento', {})
      .subscribe((val: ApiResponse<{ tipoDocumento: { id: number, code: string, description: string }[] }>) => {
        if (val.data) {
          this.typeList = val.data.tipoDocumento;
        }
      })
  }
  private getFormatoTrasmissione() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'invoice/formatiTrasmissione', {})
      .subscribe((val: ApiResponse<{ formatoTrasmissione: { id: number, code: string, description: string }[] }>) => {
        if (val.data) {
          this.formatList = val.data.formatoTrasmissione;
        }
      })
  }

  private getCurrencies() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'infogeneral/currenciesList', {})
      .subscribe((val: ApiResponse<{ currenciesList: { id: number, code: string, description: string }[] }>) => {
        if (val.data) {
          this.currencyList = val.data.currenciesList;
        }
      })
  }

  changedTotal(event: string) {
    //console.log("COMPONENTE PADRE", event)
    this.paymentTotal = event;
    this.cdr.detectChanges();
    this.paymentsComponent.calculateTotal();
  }

  changedVatSummary(event: { vatSummary: { total: { taxable: string, tax: string }, vat: { id: number, value: number } }[] }) {
    //console.log("COMPONENTE PADRE", event)
    this.vatSummary = event.vatSummary;
    this.cdr.detectChanges();
  }

  changedTotalSummary(event: { totalSummary: { taxable: string, tax: string, notTaxable: string } }) {
    this.totalSummary = event.totalSummary;
    this.cdr.detectChanges();
  }

  goBack() {
    this.router.navigate(['invoiceList'])
  }

  selectCustomer() {
    const dialogRef = this.dialog.open(SelectCustomerPopupComponent, {
      maxWidth: '700px',
      minWidth: '350px',
      maxHeight: '500px',
      width: '90%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
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
      data: { customer: this.customer }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
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
      country: 12,
      region: "Firenze"
    };
  }

  deleteStampLine() {
    this.bodyComponent.deleteStampLine()
  }

  addStampLine(event: { total: string, vat: number, description: string }) {
    this.bodyComponent.addStampLine(event.total, event.vat, event.description);
  }

  changeStampLine(event: { total: string, vat: number, description: string }) {
    this.bodyComponent.changeStampLine(event.total, event.vat, event.description);
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

  private getMeasurmentUnits() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'infogeneral/unitOfMeasurements', {})
      .subscribe((val: ApiResponse<{ unitOfMeasurements: MeasurementUnit[] }>) => {
        if (val) {
          this.umList = val.data.unitOfMeasurements;
        }
      })
  }

  getSelectOptions() {
    this.getMeasurmentUnits();

    this.vatList = [
      {
        id: 1,
        name: "22%",
        value: 22
      }, {
        id: 2,
        name: "55%",
        value: 55
      }, {
        id: 3,
        name: "N2.2",
        value: 0
      }
    ];

    this.paymentType = [{
      id: 1,
      title: "Completo"
    }, {
      id: 2,
      title: "A rate"
    },
    {
      id: 3,
      title: "Anticipo"
    }];

    this.paymentCondition = [{
      id: 1,
      title: "Contanti"
    }, {
      id: 2,
      title: "Assegno"
    }, {
      id: 3,
      title: "Bonifico"
    }];

    this.paymentTypeList = [
      {
        id: 0, title: "--"
      },
      {
        id: 1, title: "Bonifico"
      },
      {
        id: 2, title: "Assegno"
      },
    ]

    // this.currencyList = [{
    //   id: 1,
    //   name: "Euro"
    // }, {
    //   id: 2,
    //   name: "Dollaro"
    // }];

    // this.formatList = [{
    //   id: 1,
    //   name: "Elettronica"
    // }, {
    //   id: 2,
    //   name: "Cartacea"
    // }];
  }

}
