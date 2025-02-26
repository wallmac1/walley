import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { CustomerTable } from '../interfaces/customer-table';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConnectServerService } from '../../services/connect-server.service';
import { Connect } from '../../classes/connect';
import { ApiResponse } from '../../weco/interfaces/api-response';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    ReactiveFormsModule,
    MatTooltipModule
  ],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent {

  filterForm = new FormGroup({
    denomination: new FormControl<string | null>(null),
    fiscalcode: new FormControl<string | null>(null)
  })

  alphabeth: { id: number, name: string, isSelected: boolean }[] = [
    { id: 1, name: 'A', isSelected: false },
    { id: 2, name: 'B', isSelected: false },
    { id: 3, name: 'C', isSelected: false },
    { id: 4, name: 'D', isSelected: false },
    { id: 5, name: 'E', isSelected: false },
    { id: 6, name: 'F', isSelected: false },
    { id: 7, name: 'G', isSelected: false },
    { id: 8, name: 'H', isSelected: false },
    { id: 9, name: 'I', isSelected: false },
    { id: 10, name: 'J', isSelected: false },
    { id: 11, name: 'K', isSelected: false },
    { id: 12, name: 'L', isSelected: false },
    { id: 13, name: 'M', isSelected: false },
    { id: 14, name: 'N', isSelected: false },
    { id: 15, name: 'O', isSelected: false },
    { id: 16, name: 'P', isSelected: false },
    { id: 17, name: 'Q', isSelected: false },
    { id: 18, name: 'R', isSelected: false },
    { id: 19, name: 'S', isSelected: false },
    { id: 20, name: 'T', isSelected: false },
    { id: 21, name: 'U', isSelected: false },
    { id: 22, name: 'V', isSelected: false },
    { id: 23, name: 'W', isSelected: false },
    { id: 24, name: 'X', isSelected: false },
    { id: 25, name: 'Y', isSelected: false },
    { id: 26, name: 'Z', isSelected: false },
    { id: 27, name: 'All', isSelected: true }
  ];
  customerList: CustomerTable[] = [];
  dataSource = new MatTableDataSource<CustomerTable>([]);
  displayedColumns: string[] = ['denomination', 'fiscalcode', 'vat', 'mainAddress', 'info'];
  displayedColumnsSmall: string[] = ['smallScreenCol'];
  orderby_creation: string | null = 'asc';
  orderby_update: string | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
  totalResults: number = 0;
  itemsPerPage: number = 50;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router, private connectServerService: ConnectServerService) { }

  ngOnInit(): void {
    this.getCustomerList();
  }

  getCustomerList() {
    const letter = this.alphabeth.find((val) => val.isSelected == true)?.name;
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'customer/customerList', {
      itemsPerPage: this.itemsPerPage, currentPageIndex: this.currentPage, letter: letter
    })
      .subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          this.customerList = val.data.customerList.customers;
          this.dataSource.data = this.customerList;
        }
      })
  }

  letterFilter(id: number) {
    // CHIAMATA AL SERVER PER OTTENERE TUTTI I CLIENTI CON QUELLA LETTERA
    let index = -1;
    index = this.alphabeth.findIndex((letter) => letter.isSelected == true);
    if (index >= 0) {
      this.alphabeth[index].isSelected = false;
    }

    index = this.alphabeth.findIndex((letter) => letter.id == id);
    if (index >= 0) {
      this.alphabeth[index].isSelected = true;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      this.getCustomerList();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
      this.getCustomerList();
    }
  }

  goToCustomer(id: number) {
    this.router.navigate(['customer/new']);
  }

}
