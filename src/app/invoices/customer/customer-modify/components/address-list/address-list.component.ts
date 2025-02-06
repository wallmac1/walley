import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Country } from '../../../../interfaces/country';
import { ConnectServerService } from '../../../../../services/connect-server.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { City } from '../../../../interfaces/city';
import { AddressPopupComponent } from '../../../../pop-up/address-popup/address-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatAutocompleteModule
  ],
  templateUrl: './address-list.component.html',
  styleUrl: './address-list.component.scss'
})
export class AddressListComponent {

  @Input() addressList: any[] = [];

  descriptionRows: number = 2;
  submitted: boolean = false;
  filteredCities$!: Observable<City[]>;
  addressForm!: FormGroup;
  countriesList: Country[] = [];

  constructor(private fb: FormBuilder, private connectServerService: ConnectServerService,
    private dialog: MatDialog) {
    console.log("creato 1")
    this.addressForm = this.fb.group({
      addresses: this.fb.array([])
    })
  }

  ngOnInit(): void {
    this.initForm();
    this.searchCity();
    this.updateWindowDimensions();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  updateWindowDimensions() {
    if (window.innerWidth < 992) {
      this.descriptionRows = 2;
    }
    else {
      this.descriptionRows = 1;
    }
  }

  initForm() {
    if (this.addressList.length > 0) {
      this.addressList.forEach((line) => {
        this.addresses.push(this.createAddress(line));
      })
    }
    else {
      this.addresses.push(this.createEmptyAddress());
    }
  }

  get addresses(): FormArray {
    return this.addressForm.get('addresses') as FormArray;
  }

  createEmptyAddress() {
    return this.fb.group({
      id: [{value: null, disabled: true}],
      description: [{value: null, disabled: true}],
      country: [{value: null, disabled: true}],
      street: [{value: null, disabled: true}],
      city: [{value: null, disabled: true}],
      number: [{value: null, disabled: true}],
      province: [{value: null, disabled: true}],
      postalCode: [{value: null, disabled: true}],
      legalOffice: [{value: null, disabled: true}],
      mainOffice: [{value: null, disabled: true}]
    })
  }

  createAddress(address: any) {
    return this.fb.group({
      id: [{value: address.id, disabled: true}],
      description: [{value: address.description, disabled: true}],
      country: [{value: address.country, disabled: true}],
      street: [{value: address.street, disabled: true}],
      city: [{value: address.city, disabled: true}],
      number: [{value: address.number, disabled: true}],
      province: [{value: address.province, disabled: true}],
      postalCode: [{value: address.postalcode, disabled: true}],
      legalOffice: [{value: address.legalOffice, disabled: true}],
      mainOffice: [{value: address.mainOffice, disabled: true}]
    })
  }

  newAddress() {
    // APRI IL POPUP POI PUSH NEL FORMARRAY
    this.addresses.push(this.createEmptyAddress());
  }

  getCountries() {
    this.connectServerService.getRequestCountry().subscribe((val: any) => {
      if (val) {
        this.countriesList = val;
      }
    });
  }

  displayCityName(city?: City): string {
    return city ? city.name! : '';
  }

  private searchCity() {
    const city_field = this.addressForm.get('city');
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
    const city = [
      {
        id: 88,
        name: 'Borgo San Lorenzo',
        cap: "50032",
        region: "Toscana",
        province: "Firenze",
      },
    ];

    // Restituisce la lista come Observable
    return of(city);
  }

  deleteAddressPopup(idaddress: number) {
    const dialogRef = this.dialog.open(AddressPopupComponent, {
      maxWidth: '600px',
      minWidth: '350px',
      maxHeight: '500px',
      width: '90%',
      data: { 
        addressid: idaddress,
        idpopup: 2,
      }
    });
  }

  modifyAddressPopup(address: any) {
    const dialogRef = this.dialog.open(AddressPopupComponent, {
      maxWidth: '1000px',
      minWidth: '350px',
      maxHeight: '500px',
      width: '90%',
      data: { 
        address: address,
        idpopup: 1,
        countriesList: this.countriesList,
      }
    });
  }
}
