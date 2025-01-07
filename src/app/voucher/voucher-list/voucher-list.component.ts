import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Customer } from '../../tickets/interfaces/customer';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from "./components/filters/filters.component";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConnectServerService } from '../../services/connect-server.service';
import { Connect } from '../../classes/connect';
import { VoucherTable } from '../interfaces/voucher-table';
import { Filters } from '../interfaces/filters';
import { ApiResponse } from '../../weco/interfaces/api-response';
import { Router } from '@angular/router';
import { Status } from '../interfaces/status';
import { catchError, map, merge, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-voucher-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FiltersComponent,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatSortModule
  ],
  templateUrl: './voucher-list.component.html',
  styleUrl: './voucher-list.component.scss'
})
export class VoucherListComponent implements AfterViewInit {

  resultsLength: number = 0;
  isRateLimitReached: boolean = false;
  voucherListStatus: Status[] = [];
  voucherList: VoucherTable[] = [];
  //orderby: string = 'asc';
  currentPage: number = 1;
  totalPages: number = 1;
  totalResults: number = 0;
  itemsPerPage: number = 10;
  displayedColumns: string[] = ['progressive', 'date', 'customer', 'status', 'info'];
  filters: Filters | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(FiltersComponent) filtersChild!: FiltersComponent;

  constructor(private connectServerService: ConnectServerService, private router: Router) { }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => {
      this.currentPage = 1;
      this.getVoucherList();
    });
    this.getVoucherList();
    this.getStatusList();
  }

  // changeOrder() {
  //   if (this.orderby == 'asc' || this.orderby == 'null') {
  //     this.orderby = 'desc';
  //   }
  //   else {
  //     this.orderby = 'asc';
  //   }
  //   this.getVoucherList();
  // }

  private getStatusList() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'voucher/voucherListStatus', {}).subscribe((val: ApiResponse<any>) => {
      if (val) {
        this.voucherListStatus = val.data.listVoucherStatus;
      }
    })
  }

  getVoucherList() {
    this.filters = this.filtersChild.getFilters();
    console.log(this.filters)
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'voucher/vouchersList', {
      date_from: this.filters.date_from, date_to: this.filters.date_to, date_all: this.filters.date_all,
      idcustomer: this.filters.customer?.id || null, orderby: this.sort.direction, currentPageIndex: this.currentPage,
      idstatusvoucher: this.filters.status || null, itemsPerPage: this.itemsPerPage
    }).subscribe((val: ApiResponse<any>) => {
      if (val) {
        console.log(val.data)
        this.voucherList = val.data.vouchers;
        this.totalResults = val.data.pagination.total;
        this.totalPages = val.data.pagination.lastPage;
      }
    })
  }

  prevPage() {
    if(this.currentPage > 1) {
      this.currentPage -= 1;
      this.getVoucherList();
    }
  }

  nextPage() {
    if(this.currentPage < this.totalPages) {
      this.currentPage += 1;
      this.getVoucherList();
    }
  }

  newVoucher() {
    this.router.navigate(['voucher', 0]);
  }

  goToVoucher(row: VoucherTable) {
    this.router.navigate(['voucher', row.id]);
  }
}

