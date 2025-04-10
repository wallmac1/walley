import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
import { ApiResponse } from '../../weco/interfaces/api-response';
import { AutocompleteCustomer } from '../../customer/interfaces/autocomplete-customer';
import { Address } from '../../invoices/interfaces/address';

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

  filteredCustomer$!: Observable<AutocompleteCustomer[]>;
  submitted: boolean = false;
  today: Date = new Date();
  formattedDate: string = this.today.toISOString().split('T')[0];
  departments: Department[] = [];
  users: User[] = [];
  locations: Address[] = [];

  @ViewChild('select1') select1!: MatSelect;
  @ViewChild('select2') select2!: MatSelect;

  ticketForm = new FormGroup({
    internal: new FormControl<number>(0, Validators.required),
    ticket_date: new FormControl<string>(this.formattedDate), //Non modificabile
    customer: new FormControl<AutocompleteCustomer | null>(null, this.customerValidator()),
    location: new FormControl<Address | null>({ value: null, disabled: true }),
    title: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null),
    notes: new FormControl<string | null>(null),
    departments: new FormControl<number[] | null>(null),
    keepinformed: new FormControl<User[] | null>(null),
    progressive: new FormControl<number | null>(null),
  })

  constructor(private router: Router, public ticketInfoService: TicketsInfoService,
    private connectServerService: ConnectServerService) { }

  ngOnInit(): void {
    this.formLogic();
    this.searchCustomer();
    this.getUsers();
    this.getDepartments();
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

  formLogic() {
    this.ticketForm.get('customer')?.valueChanges.subscribe((val) => {
      if (this.isCustomer(val)) {
        this.getAddressList();
        this.ticketForm.get('location')?.enable();
      }
      else {
        this.ticketForm.get('location')?.disable();
        this.ticketForm.get('location')?.setValue(null);
      }
    })
  }

  isCustomer(obj: any): obj is Customer {
    return (
      obj &&
      typeof obj === 'object' &&
      typeof obj.idregistry === 'number' &&
      typeof obj.denomination === 'string'
    );
  }

  customerValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (
        value &&
        typeof value === 'object' &&
        typeof value.idregistry === 'number' &&
        typeof value.denomination === 'string'
      ) {
        return null; // valido
      }

      return { invalidCustomer: true };
    };
  }

  displayCustomerName(customer?: AutocompleteCustomer): string {
    return customer ? customer.denomination! : '';
  }

  private searchCustomer() {
    const customer_field = this.ticketForm.get('customer');
    if (customer_field) {
      this.filteredCustomer$ = customer_field.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value?.denomination || ''),
          filter(value => value.length > 0),
          debounceTime(400),
          switchMap((value: string) =>
            value ? this.getCustomers(value) : [])
        );
    }
  }

  private getCustomers(val: string): Observable<AutocompleteCustomer[]> {
    return this.connectServerService.getRequest<ApiResponse<{ customer: AutocompleteCustomer[] }>>
      (Connect.urlServerLaraApi, 'customer/searchCustomer',
        {
          // 0: Nome Cognome o Ragione Sociale, 1: CF o P. IVA
          type: 0,
          query: val
        });
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

  getAddressList() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'customer/locationsList',
      { idregistry: this.ticketForm.get('customer')?.value?.idregistry })
      .subscribe((val) => {
        if (val.data) {
          this.locations = val.data.locationsList;
          console.log(this.locations)
        }
      })
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
        refidregcussuppro: formValues.customer!.idregistry!,
        refidregcussupprodata: formValues.customer!.idregistrydata!,
        refidcussupprolocation: formValues.location?.idlocation
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