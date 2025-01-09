import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { Customer } from '../interfaces/customer';
import { Department } from '../interfaces/department';
import { User } from '../interfaces/user';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TicketsInfoService } from '../services/tickets-info.service';
import { Status } from '../interfaces/status';
import { SubStatus } from '../interfaces/substatus';
import { Location } from '../interfaces/location';
import { MatOption, MatSelect } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { TicketInfo } from '../interfaces/ticket-info';
import { ConnectServerService } from '../../services/connect-server.service';
import { Connect } from '../../classes/connect';
import { TranslateModule } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { async, debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiResponse } from '../../weco/interfaces/api-response';

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
    MatAutocompleteModule,
    MatTooltipModule
  ],
  templateUrl: './ticket-info.component.html',
  styleUrl: './ticket-info.component.scss'
})
export class TicketInfoComponent {

  filteredCustomer$!: Observable<Customer[]>;
  submitted: boolean = false;

  @Input() ticketInfo!: TicketInfo;
  @Input() ticketId!: number;
  @ViewChild('select1') select1!: MatSelect;
  @ViewChild('select2') select2!: MatSelect;

  ticketInfoForm = new FormGroup({
    status: new FormControl<Status | number | null>(null),
    internal: new FormControl<number>(0, Validators.required),
    ticket_date: new FormControl<string>(''), //Non modificabile
    customer: new FormControl<Customer | null>(null, this.customerValidator()),
    location: new FormControl<Location | null>(null),
    title: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null),
    departments: new FormControl<Department[] | number[] | null>(null),
    incharge: new FormControl<User | number | null>(null),
    keepinformed: new FormControl<User[] | number[] | null>(null),
    notes: new FormControl<string | null>(null),
    progressive: new FormControl<number | null>(null)
  });

  users: User[] = [];
  departments: Department[] = [];
  locations: Location[] = [];

  constructor(private route: ActivatedRoute, public ticketInfoService: TicketsInfoService,
    private connectServerService: ConnectServerService, private router: Router) { }

  ngOnInit(): void {
    this.searchCustomer();
    this.getUsers();
    this.getDepartments();
    this.getLocations();
    this.ticketInfoForm.get('ticket_date')?.disable();
    this.ticketInfoForm.get('progressive')?.disable();
    if (this.ticketId > 0) {
      this.ticketInfoForm.patchValue(this.ticketInfo);
      this.internalExternalLogic();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ticketInfo'] && changes['ticketInfo'].currentValue) {
      this.ticketInfoForm.patchValue(this.ticketInfo);
      this.internalExternalLogic();
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
    return of(customers).pipe(
      map(items => items.filter(customer =>
        customer.denominazione!.toLowerCase().includes(val.toLowerCase())
      )));
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

  private getUsers() {
    this.connectServerService.getRequest(Connect.urlServerLara, "user/usersListNoAdmin", {}).subscribe((val: any) => {
      if (val) {
        this.users = val;
      }
    });
  }

  private getDepartments() {
    this.connectServerService.getRequest(Connect.urlServerLara, "infogeneral/departmentsList", {}).subscribe((val: any) => {
      if (val) {
        this.departments = val.data.departments;
      }
    });
  }

  private getLocations() {
    //CHIAMATA AL SERVER
    this.locations = [
      { id: 1, address: '123 Main St', number: '1A', city: 'City A' },
      { id: 2, address: '456 Elm St', number: '2B', city: 'City B' }
    ];
  }

  save() {
    this.submitted = true;
    if (this.ticketInfoForm.valid) {
      const formValues = this.ticketInfoForm.getRawValue();
      let obj_infoticket;
      obj_infoticket = {
        internal: formValues.internal,
        location: formValues.location,
        title: formValues.title,
        description: formValues.description,
        departments: formValues.departments,
        notes: formValues.notes,
        keepinformed: formValues.keepinformed,
        progressive: formValues.progressive,
        refidregcussuppro: formValues.customer?.id || null,
        refidregcussupprodata: formValues.customer?.rifidanacliforprodati || null,
        refidcussupprolocation: null //TODO: DA CAMBIARE CON VALORE REALE
      };
      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'ticket/saveTicket', { obj_infoticket: obj_infoticket, idticket: this.ticketId }).
        subscribe((val: any) => {
          if (val) {
            this.getTicketInfo();
            this.submitted = false;
          }
        })
    }
  }

  reset() {
    this.ticketInfoForm.get('location')?.reset();
    this.ticketInfoForm.get('customer')?.reset();
    this.getTicketInfo();
  }

  deleteTicket() {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'ticket/deleteTicket', {idticket: this.ticketId})
      .subscribe((val: ApiResponse<any>) => {
        if (val) {
          this.router.navigate(['ticketsList']);
        }
      })
  }

  getTicketInfo() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'ticket/ticketInfo', { idticket: this.ticketId }).subscribe((val: any) => {
      if (val) {
        this.ticketInfo = val.data.ticketInfo;
        this.ticketInfoForm.patchValue(this.ticketInfo);
        if(this.ticketInfoForm.get('internal')?.value == 0) {
          this.ticketInfoForm.get('customer')?.enable();
          this.ticketInfoForm.get('location')?.enable();
        }
        else {
          this.ticketInfoForm.get('customer')?.disable();
          this.ticketInfoForm.get('location')?.disable();
        }
      }
    });
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
