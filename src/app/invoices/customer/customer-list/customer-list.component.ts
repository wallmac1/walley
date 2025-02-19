import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { CustomerTable } from '../interfaces/customer-table';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    ReactiveFormsModule
  ],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent {

  filterForm = new FormGroup({
    denomination: new FormControl<string | null>(null),
    fiscalcode: new FormControl<string | null>(null)
  })

  alphabeth: {id: number, name: string}[] = [{id: 1, name: 'A'}, {id: 2, name: 'B'}, {id: 3, name: 'C'}];
  customerList: CustomerTable[] = [];
  dataSource = new MatTableDataSource<CustomerTable>([]);
  displayedColumns: string[] = ['denomination', 'fiscalcode', 'vat', 'mainAddress', 'info'];
  displayedColumnsSmall: string[] = ['smallScreenCol']

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getCustomerList();
  }

  getCustomerList() {
    this.customerList = [
      {
        id: 1,
        denomination: "Mario Rossi",
        fiscalcode: "RSSMRA80A01H501Z",
        vat: "IT12345678901",
        mainAddress: "Via Roma, 10 - 00100 Roma (RM)",
        info: "Cliente storico dal 2015"
      },
      {
        id: 2,
        denomination: "Acme Corporation",
        fiscalcode: null,
        vat: "IT98765432100",
        mainAddress: "Viale Milano, 20 - 20100 Milano (MI)",
        info: "Azienda specializzata in servizi IT"
      },
      {
        id: 3,
        denomination: null,
        fiscalcode: "VRDGLI90B02L219H",
        vat: null,
        mainAddress: "Piazza Dante, 5 - 50100 Firenze (FI)",
        info: "Cliente privato con contratti di consulenza"
      }
    ];

    this.dataSource.data = this.customerList;
  }

  letterFilter(id: number) {
    // CHIAMATA AL SERVER PER OTTENERE TUTTI I CLIENTI CON QUELLA LETTERA
  }

  newCustomer() {}

  goToCustomer(id: number) {
    this.router.navigate(['modifyCustomer', id]);
  }

}
