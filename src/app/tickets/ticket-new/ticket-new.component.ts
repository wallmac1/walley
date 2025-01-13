import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Customer } from '../interfaces/customer';
import { Department } from '../interfaces/department';
import { User } from '../interfaces/user';
import { Location } from '../interfaces/location';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { TicketsInfoService } from '../services/tickets-info.service';
import { ConnectServerService } from '../../services/connect-server.service';
import { Connect } from '../../classes/connect';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-ticket-new',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatOption,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
    MatAutocompleteModule,
    TranslateModule
  ],
  templateUrl: './ticket-new.component.html',
  styleUrl: './ticket-new.component.scss'
})
export class TicketNewComponent {

  filteredCustomer$!: Observable<Customer[]>;
  submitted: boolean = false;
  today: Date = new Date();
  formattedDate: string = this.today.toISOString().split('T')[0];
  departments: Department[] = [];
  users: User[] = [];
  locations: Location[] = [];

  @ViewChild('select1') select1!: MatSelect;
  @ViewChild('select2') select2!: MatSelect;

  ticketForm = new FormGroup({
    internal: new FormControl<number>(0, Validators.required),
    ticket_date: new FormControl<string>(this.formattedDate), //Non modificabile
    customer: new FormControl<Customer | null>(null, Validators.required),
    location: new FormControl<Location | null>(null),
    title: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null),
    notes: new FormControl <string | null>(null),
    departments: new FormControl<number[] | null>(null),
    keepinformed: new FormControl<User[] | null>(null),
    progressive: new FormControl<number | null>(null),
  })

  //inputClient = new FormControl<string>('');

  constructor(private router: Router, public ticketInfoService: TicketsInfoService,
    private connectServerService: ConnectServerService) {}

  ngOnInit(): void {
    this.searchCustomer();
    this.getUsers();
    this.getDepartments();
    this.getLocations();
    this.ticketForm.get("ticket_date")?.disable();
    this.ticketForm.get("progressive")?.disable();
  }

  print() {
    console.log(this.ticketForm.getRawValue())
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
    const internal = this.ticketForm.get("internal")?.value;
    if (internal == 1) {
      this.ticketForm.get("customer")?.setValue(null);
      this.ticketForm.get("customer")?.disable();
      this.ticketForm.get("location")?.setValue(null);
    }
    else {
      this.ticketForm.get("customer")?.enable();
    }
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
    const customer_field = this.ticketForm.get('customer');
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

  private getUsers() {
    this.connectServerService.getRequest(Connect.urlServerLara, "user/usersListNoAdmin", {}).subscribe((val: any) => {
      if (val) {
        this.users = val ;
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
    if (this.ticketForm.valid) {
      const formValues = this.ticketForm.getRawValue();
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
        refidregcussuppro: formValues.customer!.id!,
        refidregcussupprodata: formValues.customer!.rifidanacliforprodati!,
        refidcussupprolocation: null //TODO: DA CAMBIARE CON VALORE REALE
      };
      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'ticket/saveTicket', { obj_infoticket: obj_infoticket, idticket: 0 }).
        subscribe((val: any) => {
          if (val) {
            this.router.navigate(["ticket", val.data.idticket]);
          }
        })
    }
  }

}