import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../../services/connect-server.service';
import { MatDialog } from '@angular/material/dialog';
import { Country } from '../../../../invoices/interfaces/country';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { City } from '../../../../invoices/interfaces/city';
import { ModifyCustomerPopupComponent } from '../../../pop-up/modify-customer-popup/modify-customer-popup.component';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { AddressListComponent } from "./components/address-list/address-list.component";
import { PaymentDataComponent } from "./components/payment-data/payment-data.component";
import { Address } from '../../../../invoices/interfaces/address';
import { OrganizationComponent } from "./components/organization/organization.component";
import { Customer } from '../../../interfaces/customer';
import { OrganizationTax } from '../../../interfaces/organization-tax';

@Component({
  selector: 'app-customer-modify',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatTabsModule,
    AddressListComponent,
    PaymentDataComponent,
    OrganizationComponent
  ],
  templateUrl: './customer-modify.component.html',
  styleUrl: './customer-modify.component.scss'
})
export class CustomerModifyComponent {

  @Input() customer: Customer | null = null;
  @Input() countriesList: Country[] = [];
  @Output() modifiedCustomer = new EventEmitter<{ customer: Customer }>;
  @ViewChild(AddressListComponent) addressComponent!: AddressListComponent;
  @ViewChild(MatTabGroup) tabComponent!: MatTabGroup;

  chargedTab: boolean[] = [false, false, false];
  addressList: Address[] = [];
  filteredCities$!: Observable<City[]>;
  genderList: { id: number, name: string }[] = [];
  isSmall: boolean = false;
  submitted: boolean = false;
  idcustomer: number = 0;
  organizationTax: OrganizationTax = { 
    municipality: null, province: null, postalcode: null, street: null, number: null, 
    naturalPerson: 0, name: null, surname: null, denomination: null, vat: null 
  };

  customerGeneralForm = new FormGroup({
    id: new FormControl<number>(0),
    naturalPerson: new FormControl<number>(0),
    name: new FormControl<string | null>(null, Validators.required),
    surname: new FormControl<string | null>(null, Validators.required),
    businessName: new FormControl<string | null>(null, Validators.required),
    fiscalcode: new FormControl<string | null>(null),
    vat: new FormControl<string | null>(null),
    country: new FormControl<number | null>(null),
    sameCode: new FormControl<number>(0)
  })

  customerRecordsForm = new FormGroup({
    email: new FormControl<string | null>(null),
    pec: new FormControl<string | null>({ value: null, disabled: true }),
    phoneNumber: new FormControl<string | null>(null),
    fax: new FormControl<string | null>(null),
    website: new FormControl<string | null>(null),
    eori: new FormControl<string | null>(null),
    gender: new FormControl<number | null>(null),
    birth_country: new FormControl<number | null>(12),
    birth_city: new FormControl<string | null>(null),
    birth_city_it: new FormControl<City | null>(null),
    birthday: new FormControl<string | null>(null),
    job: new FormControl<string | null>(null),
    doctor: new FormControl<string | null>(null),
    specialist: new FormControl<string | null>(null),
    fiscalcode: new FormControl<string | null>({ value: null, disabled: true }),
    vat: new FormControl<string | null>({ value: null, disabled: true }),
    country: new FormControl<number | null>({ value: null, disabled: true }),
    sdi: new FormControl<string | null>({ value: null, disabled: true }),
    sameCode: new FormControl<number>(0),
    health_fc: new FormControl<{value: number, description: string} | null>(null),
  })

  constructor(private connectServerService: ConnectServerService, public dialog: MatDialog,
    private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.idcustomer = parseInt(id);
      }
    });
  }

  ngOnInit(): void {
    this.initForms();
    this.getGenderSelect();
    this.searchCity();
    this.getTabFiles(0);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  updateWindowDimensions() {
    if (window.innerWidth < 768) {
      this.isSmall = true;
    }
    else {
      this.isSmall = false;
    }
  }

  initForms() {
    if (this.customer != null) {
      this.customerGeneralForm.patchValue(this.customer);
      this.customerRecordsForm.patchValue(this.customer);
    }
  }

  onTabChange(index: number) {
    if (!this.chargedTab[index]) {
      this.getTabFiles(index);
    }
  }

  getTabFiles(tab: number) {
    // RICHIESTA AL SERVER, NEL SUBSCRIBE AGGIUNGERE chargedTab[tab] = true;
    if (this.chargedTab[tab] == false) {
      this.chargedTab[tab] = true;
      console.log("creato", tab);
    }
  }

  getGenderSelect() {
    // RICHIESTA AL SERVER CON LA SELECT PER IL GENERE
    this.genderList = [{ id: 1, name: "Male" }, { id: 2, name: "Female" }]
  }

  modifyPopUp() {
    const dialogRef = this.dialog.open(ModifyCustomerPopupComponent, {
      maxWidth: '1000px',
      minWidth: '350px',
      maxHeight: '500px',
      width: '90%',
      data: {
        customerGeneralForm: {
          id: this.customerGeneralForm.get('id')?.value,
          naturalPerson: this.customerGeneralForm.get('naturalPerson')?.value,
          name: this.customerGeneralForm.get('name')?.value,
          surname: this.customerGeneralForm.get('surname')?.value,
          businessName: this.customerGeneralForm.get('businessName')?.value,
          vat: this.customerGeneralForm.get('vat')?.value,
          fiscalcode: this.customerGeneralForm.get('fiscalcode')?.value,
          country: this.customerGeneralForm.get('country')?.value,
          sameCode: this.customerRecordsForm.get('sameCode')?.value,
          sdi: this.customerRecordsForm.get('sdi')?.value,
          pec: this.customerRecordsForm.get('pec')?.value,
        },
        idPopup: 2,
        countriesList: this.countriesList,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const customer = result;
        console.log(customer)
        // SALVARE IL CLIENTE
        // UPDATE DEL PADRE
        this.modifiedCustomer.emit({ customer: customer });
        this.customerGeneralForm.patchValue(customer);
        this.customerRecordsForm.patchValue(customer);
      }
    });
  }

  displayCityName(city?: City): string {
    return city ? city.name! : '';
  }

  private searchCity() {
    const city_field = this.customerRecordsForm.get('birth_city_it');
    if (city_field) {
      this.filteredCities$ = city_field.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value?.name || ''),
          filter(value => value.length > 0),
          debounceTime(400),
          switchMap((value: string) =>
            value ? this.getCity(value) : [])
        );
    }
  }

  private getCity(val: string): Observable<City[]> {
    // CHIAMATA AL SERVER
    // return this.connectServerService.getRequest<ApiResponse<{ city: Customer[] }>>(Connect.urlServerLaraApi, 'cities',
    //   {
    //     query: val
    //   }).pipe(
    //     map(response => response.data.cities)
    //   );
    // Esempio di una lista di tre clienti
    const cities = [
      {
        id: 88,
        name: 'Borgo San Lorenzo',
        postalcode: "50032",
        region: "Toscana",
        province: "Firenze",
      },
    ];

    // Restituisce la lista come Observable FILTRO DA TOGLIERE QUANDO AVVIENE CHIAMATA AL SERVER
    const filteredCities = cities.filter(city =>
      city.name.toLowerCase().includes(val.toLowerCase())
    );
    return of(filteredCities);
  }

  addAddress() {
    setTimeout(() => {
      this.addressComponent.newAddress();
    }, 300);
  }

  save() { }

}
