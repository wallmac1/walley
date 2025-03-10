import { Component, EventEmitter, Input, output, Output } from '@angular/core';
import { PaymentConditions } from '../../interfaces/payment-conditions';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentTable } from '../../interfaces/payment-table';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Connect } from '../../../classes/connect';
import { ApiResponse } from '../../../weco/interfaces/api-response';
import { PaymentDeletePopupComponent } from '../payment-delete-popup/payment-delete-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-table',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './payment-table.component.html',
  styleUrl: './payment-table.component.scss'
})
export class PaymentTableComponent {

  @Output() modifyPayment = new EventEmitter<PaymentTable>;
  @Output() overviewPayment = new EventEmitter<PaymentTable>;
  @Output() deletePayment = new EventEmitter<number>;

  @Input() dataSource: MatTableDataSource<PaymentTable> = new MatTableDataSource<PaymentTable>([]);

  displayedColumns: string[] = ['icons', 'code', 'description', 'xml_code', 'installments_number', 'periodicity', 'deadline', 'deadline_type', 'exact_day', 'bank_type'];
  displayedColumnsSmall: string[] = ['smallScreenCol'];
  todayDate = new Date();
  orderby_creation: string | null = 'asc';
  orderby_update: string | null = null;
  courseList: { id: number, name: string }[] = [];
  isSmallScreen: boolean = false;

  constructor() { }

  duplicatePopup(line: PaymentTable) {
    this.modifyPayment.emit(line);
  }

  deletePopup(id: number) {
    this.deletePayment.emit(id);
  }

  overviewPopup(line: PaymentTable) {
    this.overviewPayment.emit(line);
  }

}
