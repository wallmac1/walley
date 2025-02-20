import { Component, EventEmitter, output, Output } from '@angular/core';
import { PaymentConditions } from '../../interfaces/payment-conditions';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentTable } from '../../interfaces/payment-table';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

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

  @Output() modifyPayment = new EventEmitter<number>;

  displayedColumns: string[] = ['icons', 'code', 'description', 'xml_code', 'installment_number', 'periodicity', 'deadline', 'deadline_type', 'exact_day', 'bank'];
  displayedColumnsSmall: string[] = ['smallScreenCol'];
  //customerList: EventTable[] = [];
  paymentConditionList: PaymentTable[] = [];
  dataSource = new MatTableDataSource<PaymentTable>([]);
  todayDate = new Date();
  orderby_creation: string | null = 'asc';
  orderby_update: string | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
  totalResults: number = 0;
  itemsPerPage: number = 50;
  courseList: { id: number, name: string }[] = [];
  isSmallScreen: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getPaymentConditions();
  }

  modifyPopup(id: number) {
    this.modifyPayment.emit(id);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      //this.getCustomerList();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
      //this.getCustomerList();
    }
  }

  getPaymentConditions() {
    this.paymentConditionList = [
      {
        id: 1,
        code: "PM001",
        description: "Bonifico Bancario",
        xml_code: "BB",
        installment_number: "3",
        periodicity: "Mensile",
        deadline: "30",
        deadline_type: "Giorni",
        exact_day: "15",
        bank: "Intesa Sanpaolo"
      },
      {
        id: 2,
        code: "PM002",
        description: "Carta di Credito",
        xml_code: "CC",
        installment_number: "1",
        periodicity: "Una Tantum",
        deadline: "0",
        deadline_type: "Immediato",
        exact_day: null,
        bank: "Mastercard"
      },
      {
        id: 3,
        code: "PM003",
        description: "SEPA Direct Debit",
        xml_code: "SDD",
        installment_number: "12",
        periodicity: "Mensile",
        deadline: "5",
        deadline_type: "Giorni",
        exact_day: "5",
        bank: "Unicredit"
      },
      {
        id: 4,
        code: "PM004",
        description: "Contrassegno",
        xml_code: "COD",
        installment_number: "1",
        periodicity: "Una Tantum",
        deadline: "0",
        deadline_type: "Alla Consegna",
        exact_day: null,
        bank: null
      },
      {
        id: 5,
        code: "PM005",
        description: "PayPal",
        xml_code: "PP",
        installment_number: "1",
        periodicity: "Immediato",
        deadline: "0",
        deadline_type: "Immediato",
        exact_day: null,
        bank: "PayPal Holdings Inc."
      }
    ];

    this.dataSource.data = this.paymentConditionList;
  }

}
