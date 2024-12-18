import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Customer } from '../../tickets/interfaces/customer';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from "./components/filters/filters.component";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConnectServerService } from '../../services/connect-server.service';
import { Connect } from '../../classes/connect';
import { VoucherTable } from '../interfaces/voucher-table';
import { Filters } from '../interfaces/filters';
import { ApiResponse } from '../../weco/interfaces/api-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-voucher-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FiltersComponent,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule
  ],
  templateUrl: './voucher-list.component.html',
  styleUrl: './voucher-list.component.scss'
})
export class VoucherListComponent {

  voucherList: VoucherTable[] = [];
  orderby: string = 'asc';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  displayedColumns: string[] = ['progressive', 'date', 'customer', 'status', 'info'];
  dataSource = new MatTableDataSource(this.voucherList);
  filters: Filters | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(FiltersComponent) filtersChild!: FiltersComponent;

  constructor(private connectServerService: ConnectServerService, private router: Router) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    this.getVoucherList();
  }

  private getVoucherList() {
    this.filters = this.filtersChild.getFilters()
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'voucher/vouchersList', {
      date_from: this.filters.date_from, date_to: this.filters.date_to,
      idcustomer: this.filters.customer?.id || null, orderby: this.orderby, currentPageIndex: this.currentPage,
      idstatusvoucher: this.filters.status?.id || null, itemsPerPage: this.itemsPerPage
    }).subscribe((val: ApiResponse<any>) => {
      if (val) {
        this.voucherList = val.data.vouchers;
        this.dataSource.data = this.voucherList;
      }
    })
  }

  newVoucher() {
    this.router.navigate(['voucher', 0]);
  }

  goToVoucher(row: VoucherTable) {
    this.router.navigate(['voucher', row.id]);
  }
}

