import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentTableComponent } from "./components/payment-table/payment-table.component";
import { MatDialog } from '@angular/material/dialog';
import { PaymentNewPopupComponent } from './components/payment-new-popup/payment-new-popup.component';
import { PaymentConditions } from './interfaces/payment-conditions';
import { PaymentDeletePopupComponent } from './components/payment-delete-popup/payment-delete-popup.component';
import { Connect } from '../classes/connect';
import { ApiResponse } from '../weco/interfaces/api-response';
import { ConnectServerService } from '../services/connect-server.service';
import { PaymentTable } from './interfaces/payment-table';
import { PaymentOverviewPopupComponent } from './components/payment-overview-popup/payment-overview-popup.component';

@Component({
  selector: 'app-payment-conditions',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatTableModule,
    PaymentTableComponent
  ],
  templateUrl: './payment-conditions.component.html',
  styleUrl: './payment-conditions.component.scss'
})
export class PaymentConditionsComponent {

  xml_codes: { id: number, description: string, code: string }[] = [];
  deadlineList: { id: number, name: string }[] = [];
  bankList: { id: number, type: string }[] = [];
  paymentConditionList: PaymentTable[] = [];
  dataSource = new MatTableDataSource<PaymentTable>([]);

  constructor(private dialog: MatDialog, private connectServerService: ConnectServerService) { }

  ngOnInit(): void {
    this.getPaymentConditions();
    this.getSelectOptions();
  }

  get emptyPaymentCondition() {
    return {
      id: 0,
      code: null,
      description: null,
      xml_code: null,
      installments_number: 1,
      periodicity: null,
      deadline: null,
      deadline_type: null,
      exact_day: null,
      bank_type: null,
      default: 0
    }
  }

  duplicatePopup(event: PaymentTable = this.emptyPaymentCondition) {
    const dialogRef = this.dialog.open(PaymentNewPopupComponent, {
      maxWidth: '1000px',
      minWidth: '350px',
      maxHeight: '700px',
      width: '90%',
      data: {
        element: event,
        xml_codes: this.xml_codes,
        bankList: this.bankList,
        deadlineList: this.deadlineList
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.getPaymentConditions();
      }
    });
  }

  deletePopup(event: number) {
    const dialogRef = this.dialog.open(PaymentDeletePopupComponent, {
      maxWidth: '600px',
      minWidth: '350px',
      maxHeight: '700px',
      width: '90%',
      data: {
        id: event
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getPaymentConditions();
      }
    })
  }

  overviewPopup(event: PaymentTable) {
    const dialogRef = this.dialog.open(PaymentOverviewPopupComponent, {
      maxWidth: '1000px',
      minWidth: '350px',
      maxHeight: '700px',
      width: '90%',
      data: {
        element: event,
        xml_codes: this.xml_codes,
        bankList: this.bankList,
        deadlineList: this.deadlineList
      }
    });
  }

  getPaymentConditions() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'invoice/condizioniPagamento', {})
      .subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          this.paymentConditionList = val.data.conditions;
          this.dataSource.data = this.paymentConditionList;
          // console.log(this.dataSource.data)
        }
      })
  }

  getSelectOptions() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'bank/bankType', {})
      .subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          this.bankList = val.data.bankType;
        }
      })

    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'invoice/modalitaPagamento', {})
      .subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          this.xml_codes = val.data.modalitaPagamento;
        }
      })

    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'invoice/tipoScadenzaPagamenti', {})
      .subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          this.deadlineList = val.data.conditions;
        }
      })
  }

}
