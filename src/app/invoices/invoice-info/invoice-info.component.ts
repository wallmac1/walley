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
import { AutocompleteCustomer } from '../../customer/interfaces/autocomplete-customer';
import { PaymentConditions } from '../../payment-conditions/interfaces/payment-conditions';
import { PaymentData } from '../../customer/interfaces/payment-data';

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
  customer: AutocompleteCustomer | null = null;
  paymentMehod: PaymentData | null = null;
  heading: InvoiceHeading | null = null;
  vatSummary: { total: { taxable: string, tax: string }, 
    vat: { id: number, value: number; code: string; code_internal: string, description: string | null } }[] = [];
  totalSummary: { taxable: string, tax: string, notTaxable: string } = { taxable: "0,00", tax: "0,00", notTaxable: "0,00" };
  paymentTotal: string = "0,00";

  // Select options
  typeList: { id: number, code: string, description: string }[] = [];
  formatList: { id: number, code: string, description: string }[] = [];
  currencyList: { id: number, code: string, description: string }[] = [];
  paymentType: { id: number, title: string }[] = [];
  paymentConditions: PaymentConditions[] = [];
  umList: MeasurementUnit[] = [];
  vatList: { id: number, code: string, code_internal: string, description: string, value: number }[] = [];
  vatStampList: { id: number, code: string, code_internal: string, description: string, value: number }[] = [];
  paymentTypeList: { id: number, description: string, code: string }[] = [];
  conditionsList: { id: number, title: string }[] = [];

  constructor(public dialog: MatDialog, private connectServerService: ConnectServerService,
    private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
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

  private getPaymentConditions() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'invoice/condizioniPagamento', {})
      .subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          this.paymentConditions = val.data.conditions;
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

  private getPaymentTypeList() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'invoice/modalitaPagamento', {})
      .subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          this.paymentTypeList = val.data.modalitaPagamento;
        }
      })
  }

  private getMeasurmentUnits() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'infogeneral/unitOfMeasurements', {})
      .subscribe((val: ApiResponse<{ unitOfMeasurements: MeasurementUnit[] }>) => {
        if (val) {
          this.umList = val.data.unitOfMeasurements;
        }
      })
  }

  private getVatList() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'invoice/naturaIvaPreferite', {})
      .subscribe((val: ApiResponse<any>) => {
        if (val) {
          this.vatList = val.data.vatList;
        }
      })
  }

  private getVatStampList() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'invoice/bolloNaturaIva', {})
      .subscribe((val: ApiResponse<any>) => {
        if (val) {
          this.vatStampList = val.data.vatStampList;
        }
      })
  }

  changedTotal(event: string) {
    //console.log("COMPONENTE PADRE", event)
    this.paymentTotal = event;
    this.cdr.detectChanges();
    this.paymentsComponent.calculateTotal();
  }

  changedVatSummary(event: { vatSummary: { total: { taxable: string, tax: string }, 
      vat: { id: number, value: number, code: string, code_internal: string, description: string | null } }[] }) {
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
        this.customer = result.customer;
        this.paymentMehod = result.paymentMethod;
      }
    });
  }

  goToCustomerData() {
    this.router.navigate(['customer/edit', this.customer?.idregistry]);
  }

  removeCustomer() {
    this.customer = null;
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

  getSelectOptions() {
    this.getMeasurmentUnits();
    this.getPaymentTypeList();
    this.getPaymentConditions();
    this.getTipiDocumento();
    this.getFormatoTrasmissione();
    this.getCurrencies();
    this.getVatList();
    this.getVatStampList();


    this.paymentType = [
      {
        id: 1, title: "Completo"
      },
      {
        id: 2, title: "A Rate"
      },
    ]
  }

}
