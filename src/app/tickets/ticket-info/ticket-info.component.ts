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
import { AutocompleteCustomer } from '../../customer/interfaces/autocomplete-customer';
import { isCustomer } from '../../calendar/components/validators/customer-validator';
import { Address } from '../../invoices/interfaces/address';

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

  filteredCustomer$!: Observable<AutocompleteCustomer[]>;
  submitted: boolean = false;

  @Input() ticketInfo!: TicketInfo;
  @Input() ticketId!: number;
  @ViewChild('select1') select1!: MatSelect;
  @ViewChild('select2') select2!: MatSelect;

  ticketInfoForm = new FormGroup({
    status: new FormControl<Status | number | null>(null),
    internal: new FormControl<number>(0, Validators.required),
    ticket_date: new FormControl<string>(''), //Non modificabile
    customer: new FormControl<AutocompleteCustomer | null>(null, this.customerValidator()),
    location: new FormControl<Location | null>({ value: null, disabled: true }),
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
  locations: Address[] = [];

  constructor(private route: ActivatedRoute, public ticketInfoService: TicketsInfoService,
    private connectServerService: ConnectServerService, private router: Router) { }

  ngOnInit(): void {
    this.formLogic();
    this.searchCustomer();
    this.getUsers();
    this.getDepartments();
    this.getAddressList();
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

  formLogic() {
    this.ticketInfoForm.get('customer')?.valueChanges.subscribe((val) => {
      if (this.isCustomer(val)) {
        this.getAddressList();
        this.ticketInfoForm.get('location')?.enable();
      }
      else {
        this.ticketInfoForm.get('location')?.disable();
        this.ticketInfoForm.get('location')?.setValue(null);
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
    const customer_field = this.ticketInfoForm.get('customer');
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

  trackById(index: number, item: any): number {
    return item.id;
  }

  get clientDenomination(): string | null {
    return this.ticketInfoForm.get('customer')?.value?.denomination || null;
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

  private getAddressList() {
    if (this.isCustomer(this.ticketInfoForm.get('customer')?.value)) {
      this.connectServerService.getRequest(Connect.urlServerLaraApi, 'customer/locationsList',
        { idregistry: this.ticketInfoForm.get('customer')?.value?.idregistry })
        .subscribe((val) => {
          if (val.data) {
            this.locations = val.data.locationsList;
            //console.log(this.locations)
          }
        })
    }
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
        refidregcussuppro: formValues.customer?.idregistry || null,
        refidregcussupprodata: formValues.customer?.idregistrydata || null,
        refidcussupprolocation: formValues.location?.id || null
      };
      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'ticket/saveTicket', 
        { obj_infoticket: obj_infoticket, idticket: this.ticketId }).
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
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'ticket/deleteTicket', { idticket: this.ticketId })
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
        if (this.ticketInfoForm.get('internal')?.value == 0) {
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
      if (this.isCustomer(this.ticketInfoForm.get('customer')?.value)) {
        this.ticketInfoForm.get("location")?.enable();
      }
    }
  }

}
