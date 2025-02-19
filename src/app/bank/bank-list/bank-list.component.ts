import { ChangeDetectorRef, Component, HostListener, ViewChild } from '@angular/core';
import { BankTable } from '../interfaces/bank-table';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ConnectServerService } from '../../services/connect-server.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Connect } from '../../classes/connect';
import { ApiResponse } from '../../weco/interfaces/api-response';

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
  displayedColumns: string[] = ['denomination', 'iban', 'obsolete'];
  displayedColumnsSmall: string[] = ['smallScreenCol']

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private connectServerService: ConnectServerService, private router: Router,
    private cdr: ChangeDetectorRef) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    const screenWidth = window.innerWidth;
    this.isSmall = screenWidth < 576;
  }

  ngOnInit(): void {
    this.checkScreenSize();
    this.getBankList();
  }

  getBankList() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'bank/banksList', {})
      .subscribe((val: ApiResponse<{ bankList: BankTable[] }>) => {
        if (val.data) {
          this.bankList = val.data.bankList;
          this.dataSource.data = this.bankList;
        }
      })
  }

  newBank() {
    this.router.navigate(['bankModify', 0]);
  }

  goToBank(row: BankTable) {
    this.router.navigate(['bankModify', row.id]);
  }
}
