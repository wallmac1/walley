import { Component, Input, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { Customer } from '../interfaces/customer';
import { Department } from '../interfaces/department';
import { User } from '../interfaces/user';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TicketsInfoService } from '../services/tickets-info.service';
import { Status } from '../interfaces/status';
import { SubStatus } from '../interfaces/substatus';
import { Location } from '../interfaces/location';
import { MatOption, MatSelect } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Ticket } from '../interfaces/ticket';
import { ConnectServerService } from '../../services/connect-server.service';
import { Connect } from '../../classes/connect';
import { TranslateModule } from '@ngx-translate/core';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-ticket-info',
  standalone: true,
  imports: [
    MatTabsModule,
    MatSelect,
    MatOption,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    MatAutocompleteModule
  ],
  templateUrl: './ticket-info.component.html',
  styleUrl: './ticket-info.component.scss'
})
export class TicketInfoComponent {

  locations: Location[] = [];
  filteredCustomer$!: Observable<Customer[]>;
  submitted: boolean = false;

  @Input() data!: Ticket;
  @ViewChild('select1') select1!: MatSelect;
  @ViewChild('select2') select2!: MatSelect;

  ticketInfoForm = new FormGroup({
    id: new FormControl<number | null>(null, Validators.required),
    status: new FormControl<Status | number | null>(null, Validators.required),
    internal: new FormControl<number>(0, Validators.required),
    date_ticket: new FormControl<string>(''), //Non modificabile
    customer: new FormControl<Customer | null>(null, this.customerValidator()),
    location: new FormControl<Location | null>(null),
    title: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null, Validators.required),
    department: new FormControl<Department[] | number[] | null>(null),
    incharge: new FormControl<User | number | null>(null),
    keepinformed: new FormControl<User[] | number[] | null>(null),
    note: new FormControl<string | null>(null),
    number: new FormControl<number | null>(null)
  });

  ticketId: number | null = null;

  users: User[] | null = null;
  department: Department[] | null = null;

  constructor(private route: ActivatedRoute, public ticketInfoService: TicketsInfoService,
    private connectServerService: ConnectServerService) {
    // CHIAMATA AL SERVER PER OTTENERE I VALORI DEL TICKET
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.ticketId = +id;
      }
    });
  }

  ngOnInit(): void {
    this.searchCustomer();
    if (this.ticketId) {
      this.ticketInfoForm.get('date_ticket')?.disable();
      this.ticketInfoForm.get('number')?.disable();
      this.getUser();
      this.getDepartment();
      this.getLocations();
      this.ticketInfoService.getDepartmentFromServer();
      this.ticketInfoForm.patchValue(this.data);
      this.internalExternalLogic();
      this.print();
    }
  }

  customerValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const customer = control.value;

      // Condizione unica combinata
      if (!customer || typeof customer === 'string' || !(customer.id > 0)) {
        return { invalidCustomer: true }; // Errore generico
      }

      return null; // Valido
    };
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
    const customer_field = this.ticketInfoForm.get('customer');
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

  trackById(index: number, item: any): number {
    return item.id;
  }

  get clientDenomination(): string | null {
    return this.ticketInfoForm.get('customer')?.value?.denominazione || null;
  }

  print() {
    console.log(this.ticketInfoForm.getRawValue());
  }

  modifyTitleDescription() {

  }

  refresh() {
    if (this.ticketInfoService.ticketInfo && this.ticketInfoService.ticketInfo.id == this.ticketId) {
      this.ticketInfoForm.patchValue(this.ticketInfoService.ticketInfo);
    }
    else {
      this.ticketInfoService.getInfoTicketFromServer(this.ticketId!)
        .subscribe((val: any) => {
          if (val) {
            this.ticketInfoForm.patchValue(val);
          }
        })
    }

  }

  getUser() {
    if (this.ticketInfoService.users) {
      this.users = this.ticketInfoService.users!;
    }
    this.ticketInfoService.getUsersFromServer()
      .subscribe((val: any) => {
        this.users = val;
      })
  }

  getLocations() {
    const locations: Location[] = [
      { id: 1, number: 'Location 1', address: '123 Main St', city: 'City A' },
      { id: 2, number: 'Location 2', address: '456 Elm St', city: 'City B' },
      { id: 3, number: 'Location 3', address: '789 Oak St', city: 'City C' }
    ];

    this.locations = locations;
  }

  getDepartment() {
    if (this.ticketInfoService.departments) {
      this.department = this.ticketInfoService.departments!;
    }
    this.ticketInfoService.getDepartmentFromServer()
      .subscribe((val: any) => {
        this.department = val;
      })
  }

  save() {
    this.connectServerService.postRequest(Connect.urlServerLara, "ticket/saveTicketInfo", { ticketinfo: this.ticketInfoForm })
      .subscribe((val: any) => {
        if (val) {
          this.ticketInfoService.ticketInfo = val;
          this.ticketInfoForm.patchValue(val);
        }
      })
  }

  openSelect(id: number) {
    if (id == 1) {
      this.select1.open();
    }
    else if (id == 2) {
      this.select2.open();
    }
  }

  internalExternalLogic() {
    const internal = this.ticketInfoForm.get("internal")?.value;
    if (internal == 1) {
      this.ticketInfoForm.get("customer")?.setValue(null);
      this.ticketInfoForm.get("location")?.setValue(null);
      this.ticketInfoForm.get("customer")?.disable();
      this.ticketInfoForm.get("location")?.disable();
    }
    else {
      this.ticketInfoForm.get("customer")?.enable();
      this.ticketInfoForm.get("location")?.enable();
    }
  }

}
