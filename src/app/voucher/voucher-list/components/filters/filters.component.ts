import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Customer } from '../../../../tickets/interfaces/customer';
import { CommonModule } from '@angular/common';
import { Status } from '../../../interfaces/status';
import { Filters } from '../../../interfaces/filters';
import { TranslateModule } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatAutocompleteModule,
    MatOptionModule
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
export class FiltersComponent {

  @Input() statusList: Status[] = [];
  @Output() filterEmit = new EventEmitter<null>();

  submitted: boolean = false;
  todayDate = new Date();
  threeMonthsAgo: Date = new Date(this.todayDate);

  filteredCustomer$!: Observable<Customer[]>;

  voucherFilterForm = new FormGroup({
    date_from: new FormControl<string>(new Date(this.todayDate).toISOString().split('T')[0]),
    date_to: new FormControl<string>(this.todayDate.toISOString().split('T')[0]),
    customer: new FormControl<Customer | null>(null),
    status: new FormControl<Status | null>(null),
    date_all: new FormControl<boolean>(true),
  })

  constructor() {
    this.threeMonthsAgo.setMonth(this.threeMonthsAgo.getMonth() - 3);
    this.voucherFilterForm.get('date_from')?.setValue(this.threeMonthsAgo.toISOString().split('T')[0]);
  }

  ngOnInit(): void {
    this.voucherFilterForm.get('date_to')?.disable();
    this.voucherFilterForm.get('date_from')?.disable();
    this.voucherFilterForm.get('date_all')?.valueChanges.subscribe((value) => {
      if (value === true) {
        console.log('disabling', this.voucherFilterForm.getRawValue());
        this.voucherFilterForm.get('date_to')?.disable();
        this.voucherFilterForm.get('date_from')?.disable();
      } else {
        console.log('enabling', this.voucherFilterForm.getRawValue());
        this.voucherFilterForm.get('date_to')?.enable();
        this.voucherFilterForm.get('date_from')?.enable();
      }
    });
    this.searchCustomer();
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
    const customer_field = this.voucherFilterForm.get('customer');
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

  toggleAllDates() {
    const date_all = this.voucherFilterForm.get('date_all')?.value;
    this.voucherFilterForm.get('date_all')?.setValue(!date_all);
  }

  getFilters(): Filters {
    return {
      date_from: this.voucherFilterForm.get('date_from')?.value!,
      date_to: this.voucherFilterForm.get('date_to')?.value!,
      customer: this.voucherFilterForm.value.customer!,
      status: this.voucherFilterForm.value.status!,
      date_all: this.voucherFilterForm.value.date_all ? 1 : 0
    };
  }

  filter() {
    this.filterEmit.emit();
  }

}
