import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Customer } from '../../../tickets/interfaces/customer';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatError, MatFormFieldModule, MatHint } from '@angular/material/form-field';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Connect } from '../../../classes/connect';
import { ApiResponse } from '../../../weco/interfaces/api-response';

@Component({
  selector: 'app-invoice-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    TranslateModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatError,
    MatFormFieldModule
  ],
  templateUrl: './invoice-filters.component.html',
  styleUrl: './invoice-filters.component.scss'
})
export class InvoiceFiltersComponent {

  @Output() filterEmit = new EventEmitter<null>();
  submitted: boolean = false;
  filteredCustomer$!: Observable<Customer[]>;
  listNumbers: { id: number, value: string }[] = [];
  listCustomer: Customer[] = [];
  typeList: { id: number, code: string, description: string }[] = [];
  listStatus: { id: number, name: string }[] = [];
  private connectServerService = inject(ConnectServerService);
  todayDate = new Date();

  invoiceFilterForm = new FormGroup({
    datefrom: new FormControl<Date | null>(new Date(this.todayDate)),
    dateto: new FormControl<Date | null>(new Date(this.todayDate)),
    number: new FormControl<string | null>(null),
    customer: new FormControl<Customer | null>(null),
    documenttype: new FormControl<string | null>(null),
    status: new FormControl<string | null>(null),
    fiscalcode: new FormControl<string | null>(null),
    vat: new FormControl<string | null>(null),
  })

  ngOnInit(): void {
    this.getDocumentTypeo();
    this.setDate();
    this.searchCustomer();
    this.getInvoiceInfo();
  }

  private getDocumentTypeo() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'invoice/tipiDocumento', {})
      .subscribe((val: ApiResponse<{ tipoDocumento: { id: number, code: string, description: string }[] }>) => {
        if (val.data) {
          this.typeList = val.data.tipoDocumento;
        }
      })
  }
  
  setDate() {
    const threeMonthsAgo = new Date(this.todayDate);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    this.invoiceFilterForm.get('datefrom')?.setValue(threeMonthsAgo);
  }

  getFilters() {
    return {
      datefrom: null,
      dateto: null,
      number: null,
      name: null,
      documenttype: null,
      status: null,
      fiscalcode: null,
      vat: null,
    }
  }

  getInvoiceInfo() {
    this.getInvoiceNumbers();
    // this.getTypes();
    this.getStatus();
  }

  getInvoiceNumbers() {
    this.listNumbers = [
      { id: 1, value: '1' },
      { id: 2, value: '2' },
      { id: 3, value: '3' },
      { id: 4, value: '4' },
      { id: 5, value: '5' },
    ]
  }

  // getTypes() {
  //   this.listTypes = [
  //     { id: 1, value: 'Invoice' },
  //     { id: 2, value: 'Other Types' },
  //   ]
  // }

  getStatus() {
    this.listStatus = [
      { id: 1, name: 'Open' },
      { id: 2, name: 'Closed' },
      { id: 3, name: 'Pending' },
    ]
  }

  filter() {
    this.filterEmit.emit();
  }

  displayCustomerName(customer?: Customer): string {
    return customer ? customer.denominazione! : '';
  }

  // private filterLines(lines: Lines[]) {
  //   if(lines.length > 0) {
  //     this.works = lines.filter(line => line.type_line === 1); // Lavori
  //     this.articles = lines.filter(line => line.type_line === 2); // Articoli
  //   }
  // }

  private searchCustomer() {
    const customer_field = this.invoiceFilterForm.get('customer');
    if (customer_field) {
      this.filteredCustomer$ = customer_field.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value?.denominazione || ''),
          filter(value => value.length > 0),
          debounceTime(400),
          switchMap((value: string) =>
            value ? this.getCustomers(value) : [])
        );
    }
  }

  private getCustomers(val: string): Observable<Customer[]> {
    // CHIAMATA AL SERVER
    // return this.connectServerService.getRequest<ApiResponse<{ city: Customer[] }>>(Connect.urlServerLaraApi, 'cities',
    //   {
    //     query: val
    //   }).pipe(
    //     map(response => response.data.cities)
    //   );
    // Esempio di una lista di tre clienti
    const customers: Customer[] = [
      {
        rifidanacliforprodati: 39,
        id: 88,
        denominazione: 'Pippo Poppo',
        codicefiscale: "23323NLDSKNSDNKL",
        cognome: "poppo",
        data_nascita: null,
        email: null,
        nome: "Pippo",
        piva: null,
        telefono: null
      },
    ];

    // Restituisce la lista come Observable
    return of(customers);
  }
}
