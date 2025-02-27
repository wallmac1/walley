import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../../services/connect-server.service';
import { MatDialog } from '@angular/material/dialog';
import { Country } from '../../../../invoices/interfaces/country';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ModifyCustomerPopupComponent } from '../../../pop-up/modify-customer-popup/modify-customer-popup.component';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { AddressListComponent } from "./components/address-list/address-list.component";
import { PaymentDataComponent } from "./components/payment-data/payment-data.component";
import { Address } from '../../../../invoices/interfaces/address';
import { OrganizationComponent } from "./components/organization/organization.component";
import { Customer } from '../../../interfaces/customer';
import { OrganizationTax } from '../../../interfaces/organization-tax';
import { Connect } from '../../../../classes/connect';
import { ApiResponse } from '../../../../weco/interfaces/api-response';
import { AutocompleteMunicipality } from '../../../interfaces/autocomplete-municipality';
import { HistoryPopupComponent } from '../../../pop-up/history-popup/history-popup.component';

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
  filteredCities$!: Observable<AutocompleteMunicipality[]>;
  genderList: { id: number, acronym: string, description: string }[] = [];
  isSmall: boolean = false;
  submitted: boolean = false;
  idcustomer: number = 0;
  organizationTax: OrganizationTax = {
    municipality: null, province: null, postalcode: null, street: null, number: null,
    naturalPerson: 0, name: null, surname: null, denomination: null, vat: null
  };

  customerGeneralForm = new FormGroup({
    idregistry: new FormControl<number>(0),
    naturalPerson: new FormControl<boolean>(false),
    name: new FormControl<string | null>(null, Validators.required),
    surname: new FormControl<string | null>(null, Validators.required),
    businessName: new FormControl<string | null>(null, Validators.required),
    fiscalcode: new FormControl<string | null>(null),
    vat: new FormControl<string | null>(null),
    country: new FormControl<number | null>(null),
    sameCode: new FormControl<boolean>(false),
    health_cf: new FormControl<{ value: number, description: string } | null>(null),
  })

  customerRecordsForm = new FormGroup({
    email: new FormControl<string | null>(null, Validators.email),
    pec: new FormControl<string | null>({ value: null, disabled: true }, Validators.email),
    phoneNumber: new FormControl<string | null>(null),
    fax: new FormControl<string | null>(null),
    website: new FormControl<string | null>(null),
    eori: new FormControl<string | null>(null),
    gender: new FormControl<number | null>(null),
    birth_country: new FormControl<number | null>(12),
    birth_city: new FormControl<string | null>(null),
    birth_city_it: new FormControl<AutocompleteMunicipality | null>(null),
    birthday: new FormControl<string | null>(null),
    job: new FormControl<string | null>(null),
    doctor: new FormControl<string | null>(null),
    specialist: new FormControl<string | null>(null),
    fiscalcode: new FormControl<string | null>({ value: null, disabled: true }),
    vat: new FormControl<string | null>({ value: null, disabled: true }),
    country: new FormControl<number | null>({ value: null, disabled: true }),
    sdi: new FormControl<string | null>({ value: null, disabled: true }),
    sameCode: new FormControl<boolean>(false),
  })

  constructor(private connectServerService: ConnectServerService, public dialog: MatDialog,
    private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
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
    if (tab == 0) {
      this.getAddressList();
    }
    else if (tab == 1) {

    }
    else if (tab == 2) {

    }
  }

  getAddressList() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'customer/locationsList', { idregistry: this.idcustomer })
      .subscribe((val) => {
        if (val.data) {
          this.addressList = val.data.locationsList;
          this.addressComponent.addressList = this.addressList;
          this.chargedTab[0] = true;
        }
      })
  }

  getGenderSelect() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'infogeneral/gendersList', {})
      .subscribe((val: any) => {
        if (val) {
          this.genderList = val;
        }
      })
  }

  historyPopup() {
    const dialogRef = this.dialog.open(HistoryPopupComponent, {
      maxWidth: '1000px',
      minWidth: '350px',
      maxHeight: '600px',
      width: '90%',
      data: {
        idregistry: this.customerGeneralForm.get('idregistry')?.value
      }
    });
  }

  modifyPopUp() {
    const dialogRef = this.dialog.open(ModifyCustomerPopupComponent, {
      maxWidth: '1000px',
      minWidth: '350px',
      maxHeight: '600px',
      width: '90%',
      data: {
        customerGeneralForm: {
          idregistry: this.customerGeneralForm.get('idregistry')?.value,
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
          health_cf: this.customerRecordsForm.get('health_fc')?.value,
        },
        idPopup: 2,
        countriesList: this.countriesList,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const customer = result;
        // UPDATE DEL PADRE
        this.modifiedCustomer.emit({ customer: customer });
        // PADRE RICHIAMA I VALORI
      }
    });
  }

  displayCityName(city?: AutocompleteMunicipality): string {
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
    else {
      this.filteredCities$ = of([]);
    }
  }

  private getCity(val: string): Observable<AutocompleteMunicipality[]> {
    // CHIAMATA AL SERVER
    return this.connectServerService.getRequest<ApiResponse<{ city: AutocompleteMunicipality[] }>>
      (Connect.urlServerLaraApi, 'infoworld/searchMunicipalities',
        {
          tipo: 1,
          val: val
        });
  }

  addAddress() {
    setTimeout(() => {
      this.addressComponent.newAddress();
    }, 300);
  }

  save() {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'customer/customerUpdate', {
      idregistry: this.idcustomer,
      email: this.customerRecordsForm.get('email')?.value,
      phoneNumber: this.customerRecordsForm.get('phoneNumber')?.value,
      fax: this.customerRecordsForm.get('fax')?.value,
      website: this.customerRecordsForm.get('website')?.value,
      eori: this.customerRecordsForm.get('eori')?.value,
      gender: this.customerRecordsForm.get('gender')?.value,
      birth_country: this.customerRecordsForm.get('birth_country')?.value,
      birth_city: this.customerRecordsForm.get('birth_city')?.value,
      birth_city_it: this.customerRecordsForm.get('birth_city_it')?.value?.id,
      birthday: this.customerRecordsForm.get('birthday')?.value,
      job: this.customerRecordsForm.get('job')?.value,
      doctor: this.customerRecordsForm.get('doctor')?.value,
      specialist: this.customerRecordsForm.get('specialist')?.value,
    })
      .subscribe(() => { })
  }

}
