import { ChangeDetectorRef, Component, HostListener, ViewChild } from '@angular/core';
import { BankTable } from '../../interfaces/bank-table';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-bank-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule
  ],
  templateUrl: './bank-list.component.html',
  styleUrl: './bank-list.component.scss'
})
export class BankListComponent {

  dataSource = new MatTableDataSource<BankTable>([]);
  isSmall: boolean = false;
  resultsLength: number = 0;
  isRateLimitReached: boolean = false;
  bankList: BankTable[] = [];
  orderby_creation: string | null = 'asc';
  orderby_update: string | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
  totalResults: number = 0;
  itemsPerPage: number = 50;
  displayedColumns: string[] = ['denomination', 'institute', 'address', 'iban', 'active'];
  displayedColumnsSmall: string[] = ['smallScreenCol']

  // lastSearch: InvoiceFilters = {
  //   datefrom: null,
  //   dateto: null,
  //   number: null,
  //   name: null,
  //   documenttype: null,
  //   status: null,
  //   fiscalcode: null,
  //   vat: null,
  // }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  //@ViewChild(InvoiceFiltersComponent) filtersChild!: InvoiceFiltersComponent;

  constructor(private connectServerService: ConnectServerService, private router: Router, 
    private cdr: ChangeDetectorRef) { }

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
      this.getBankList(2);
    });
    this.getBankList(2);
  }

  changeOrderCreation() {
    if (this.orderby_creation == 'asc' || this.orderby_creation == 'null') {
      this.orderby_creation = 'desc';
    }
    else {
      this.orderby_creation = 'asc';
    }
    this.getBankList(2)
  }

  getBankList(type: number) {
    // if (type == 1) {
    //   this.lastSearch = this.filtersChild.getFilters();
    // }

    // console.log('filters')
    if (this.sort.active === 'denomination') {
      this.orderby_creation = this.sort.direction;
      this.orderby_update = null;
      console.log("NUMBER", this.orderby_creation)
    } else if (this.sort.active === 'active') {
      this.orderby_update = this.sort.direction;
      this.orderby_creation = null;
      console.log("SENDDATE", this.orderby_update)
    }
    this.bankList = [
      {
        id: 1,
        denomination: "Intesa San Paolo",
        institute: "Sezione A",
        address: "Via Curtatone Montanara",
        iban: "IT38Y1796509537327379260909",
        active: 0
      },
      {
        id: 1,
        denomination: "Banca d'Italia",
        institute: "Sede F",
        address: "Via del Corso",
        iban: "IT38Y1796509537327379260909",
        active: 1
      },
      {
        id: 1,
        denomination: "ENG",
        institute: "Centrale",
        address: "Viale dei Mille",
        iban: "IT38Y1796509537327379260909",
        active: 0
      },
    ]

    this.dataSource.data = this.bankList;

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
      this.getBankList(2);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
      this.getBankList(2);
    }
  }

  // verifyTextTruncated() {
  //   this.isTextTruncated = this.customerColumn.nativeElement.offsetWidth < this.customerColumn.nativeElement.scrollWidth;
  // }

  newBank() {
    this.router.navigate(['bankModify', 0]);
  }

  goToBank(row: BankTable) {
    this.router.navigate(['bankModify', row.id]);
  }
}
