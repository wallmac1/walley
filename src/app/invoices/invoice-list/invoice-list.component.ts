import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { InvoiceFiltersComponent } from '../components/invoice-filters/invoice-filters.component';
import { ConnectServerService } from '../../services/connect-server.service';
import { Router } from '@angular/router';
import { Connect } from '../../classes/connect';
import { ApiResponse } from '../../weco/interfaces/api-response';
import { InvoiceTable } from '../interfaces/invoice-table';
import { InvoiceFilters } from '../interfaces/invoice-filters';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    TranslateModule,
    MatTooltipModule,
    InvoiceFiltersComponent,
    MatSortModule
  ],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss'
})
export class InvoiceListComponent {

  dataSource = new MatTableDataSource<InvoiceTable>([]);
  isSmall: boolean = false;
  resultsLength: number = 0;
  isRateLimitReached: boolean = false;
  invoiceList: InvoiceTable[] = [];
  invoiceListReduced: any[] = []
  orderby_creation: string | null = 'asc';
  orderby_update: string | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
  totalResults: number = 0;
  itemsPerPage: number = 50;
  displayedColumns: string[] = ['iconsfield', 'number', 'documentdate', 'documenttype', 'customer', 'documenttotal', 'status', 'senddate'];
  displayedColumnsSmall: string[] = ['smallScreenCol']

  lastSearch: InvoiceFilters = {
    datefrom: null,
    dateto: null,
    number: null,
    name: null,
    documenttype: null,
    status: null,
    fiscalcode: null,
    vat: null,
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(InvoiceFiltersComponent) filtersChild!: InvoiceFiltersComponent;

  constructor(private connectServerService: ConnectServerService, private router: Router, private cdr: ChangeDetectorRef) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
    //this.verifyTextTruncated();
  }

  checkScreenSize(): void {
    const screenWidth = window.innerWidth;
    this.isSmall = screenWidth < 576;
  }

  ngOnInit(): void {
    this.checkScreenSize();
  }

  ngAfterViewInit(): void {
    //this.verifyTextTruncated();
    this.sort.sortChange.subscribe(() => {
      this.currentPage = 1;
      this.getInvoiceList(2);
    });
    this.getInvoiceList(2);
  }

  changeOrderCreation() {
    if (this.orderby_creation == 'asc' || this.orderby_creation == 'null') {
      this.orderby_creation = 'desc';
    }
    else {
      this.orderby_creation = 'asc';
    }
    this.getInvoiceList(2)
  }

  getInvoiceList(type: number) {
    if (type == 1) {
      this.lastSearch = this.filtersChild.getFilters();
    }

    // console.log('filters')
    if (this.sort.active === 'number') {
      this.orderby_creation = this.sort.direction;
      this.orderby_update = null;
      console.log("NUMBER", this.orderby_creation)
    } else if (this.sort.active === 'senddate') {
      this.orderby_update = this.sort.direction;
      this.orderby_creation = null;
      console.log("SENDDATE", this.orderby_update)
    }
    this.invoiceList = [
      {
        idinvoice: 1,
        iconsfield: "",
        number: "INV-001",
        documentdate: "2025-01-15",
        documenttype: "Invoice",
        customer: "Mario Rossi",
        documenttotal: "€1,250.00",
        status: "Paid",
        senddate: "2025-01-16",
        type: "Invoice"
      },
      {
        idinvoice: 2,
        iconsfield: "",
        number: "INV-002",
        documentdate: "2025-01-20",
        documenttype: "Invoice",
        customer: "Luca Bianchi",
        documenttotal: "€950.00",
        status: "Pending",
        senddate: "2025-01-21",
        type: "Invoice"
      },
      {
        idinvoice: 3,
        iconsfield: "",
        number: "INV-003",
        documentdate: "2025-01-25",
        documenttype: "Credit Note",
        customer: "Giulia Verdi",
        documenttotal: "-€350.00",
        status: "Refunded",
        senddate: "2025-01-26",
        type: "Invoice"
      },
      {
        idinvoice: 4,
        iconsfield: "",
        number: "INV-004",
        documentdate: "2025-01-28",
        documenttype: "Invoice",
        customer: "Francesca Neri",
        documenttotal: "€1,500.00",
        status: "Overdue",
        senddate: "2025-01-29",
        type: "Invoice"
      },
      {
        idinvoice: 5,
        iconsfield: "",
        number: "INV-005",
        documentdate: "2025-01-30",
        documenttype: "Pro Forma",
        customer: "Wallnet snc di Banchi Leonardo e Andrea Margheri, cliente lungo per truncate",
        documenttotal: "€500.00",
        status: "Draft",
        senddate: "2025-01-31",
        type: "Invoice"
      }
    ]

    this.dataSource.data = this.invoiceList;

    // list.forEach((val: any) => {
    //   this.invoiceList.push(val);
    // })

    // CHIAMATA AL SERVER
    // this.connectServerService.getRequest(Connect.urlServerLaraApi, 'ticket/ticketsList', {
    //   idcustomer: this.lastSearch.customer || null, idstatusticket: this.lastSearch.status || null,
    //   idsubstatusticket: this.lastSearch.substatus || null, incharge: this.lastSearch.incharge || null,
    //   iddepartment: this.lastSearch.department || null, notclosed: this.lastSearch.notclosed, orderby_creation: this.orderby_creation,
    //   orderby_lastupdate: this.orderby_update, itemsPerPage: this.itemsPerPage, currentPageIndex: this.currentPage
    // }).subscribe((val: ApiResponse<any>) => {
    //   if (val) {
    //     //console.log(val.data)
    //     this.ticketList = val.data.tickets;
    //     this.totalResults = val.data.pagination.total;
    //     this.totalPages = val.data.pagination.lastPage;
    //   }
    // })
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      this.getInvoiceList(2);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
      this.getInvoiceList(2);
    }
  }

  // verifyTextTruncated() {
  //   this.isTextTruncated = this.customerColumn.nativeElement.offsetWidth < this.customerColumn.nativeElement.scrollWidth;
  // }

  newInvoice() {
    this.router.navigate(['invoice', 0]);
  }

  goToInvoice(row: InvoiceTable) {
    this.router.navigate(['invoice', row.idinvoice]);
  }

}
