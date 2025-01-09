import { Component, EventEmitter, Input, Output } from '@angular/core';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { Filters } from '../../../interfaces/filters';
import { Customer } from '../../../interfaces/customer';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Status } from '../../../interfaces/status';
import { User } from '../../../interfaces/user';
import { Department } from '../../../interfaces/department';
import { SubStatus } from '../../../interfaces/substatus';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { tick } from '@angular/core/testing';
import { Connect } from '../../../../classes/connect';
import { ConnectServerService } from '../../../../services/connect-server.service';
import { ApiResponse } from '../../../../weco/interfaces/api-response';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    TranslateModule,
    MatTooltipModule
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
export class FiltersComponent {

  @Output() filterEmit = new EventEmitter<null>();

  infoTooltip: string = ''
  submitted: boolean = false;
  todayDate = new Date();
  threeMonthsAgo: Date = new Date(this.todayDate);

  filteredCustomer$!: Observable<Customer[]>;

  listUser: User[] = [];
  listDepartments: Department[] = [];
  listStatus: Status[] = [];
  listSubStatus: SubStatus[] = [];

  ticketFilterForm = new FormGroup({
    customer: new FormControl<Customer | null>(null),
    creation: new FormControl<string>(new Date(this.todayDate).toISOString().split('T')[0]),
    incharge: new FormControl<User | null>(null),
    department: new FormControl<Department | null>(null),
    status: new FormControl<Status | null>(null),
    substatus: new FormControl<SubStatus | null>(null),
    notclosed: new FormControl<boolean>(true),
  })

  constructor(private connectServerService: ConnectServerService) { }

  ngOnInit(): void {
    this.ticketFilterForm.get('status')?.disable();
    this.ticketFilterForm.get('substatus')?.disable();
    this.ticketFilterForm.get('notclosed')?.valueChanges.subscribe((value) => {
      if (value === true) {
        this.ticketFilterForm.get('status')?.disable();
        this.ticketFilterForm.get('status')?.setValue(null);
        this.ticketFilterForm.get('substatus')?.disable();
        this.ticketFilterForm.get('substatus')?.setValue(null);
        this.listSubStatus = [];
      } else if (value === false) {
        this.ticketFilterForm.get('status')?.enable();
        if (this.ticketFilterForm.get('status')?.value != null) {
          this.ticketFilterForm.get('substatus')?.enable();
        }
        else {
          this.ticketFilterForm.get('substatus')?.disable();
        }
      }
    });
    this.ticketFilterForm.get('status')?.valueChanges.subscribe((value) => {
      this.ticketFilterForm.get('substatus')?.reset();
      if (value != null) {
        this.getSubstatusList();
        this.ticketFilterForm.get('substatus')?.enable();
      }
      else {
        this.ticketFilterForm.get('substatus')?.disable();
      }
    });
    this.getUsers();
    this.getStatusList();
    this.getDepartments();
    this.searchCustomer();
  }

  private getUsers() {
    this.connectServerService.getRequest(Connect.urlServerLara, "user/usersListNoAdmin", {}).subscribe((val: any) => {
      if (val) {
        this.listUser = val;
      }
    });
  }

  private getDepartments() {
    this.connectServerService.getRequest(Connect.urlServerLara, "infogeneral/departmentsList", {}).subscribe((val: any) => {
      if (val) {
        this.listDepartments = val.data.departments;
      }
    });
  }

  private getStatusList() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'ticket/allStatusListTicket', {}).subscribe((val: ApiResponse<any>) => {
      if (val) {
        this.listStatus = val.data.statusList;
      }
    })
  }

  private getSubstatusList() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'ticket/subStatusListTicket', 
      { idstatus: this.ticketFilterForm.get('status')?.value }).subscribe((val: ApiResponse<any>) => {
      if (val) {
        this.listSubStatus = val.data.subStatusList;
      }
    })
  }

  getFilters(): Filters {
    console.log("QUI", this.ticketFilterForm.value);
    return {
      customer: this.ticketFilterForm.get('customer')?.value || null,
      incharge: this.ticketFilterForm.get('incharge')?.value || null,
      department: this.ticketFilterForm.get('department')?.value || null,
      status: this.ticketFilterForm.get('status')?.value || null,
      substatus: this.ticketFilterForm.get('substatus')?.value || null,
      orderby_creation: 'asc',
      orderby_lastupdate: 'asc',
      notclosed: this.ticketFilterForm.value.notclosed ? 1 : 0
    };
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
    const customer_field = this.ticketFilterForm.get('customer');
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
