import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Country } from '../../../../../../interfaces/country';
import { ConnectServerService } from '../../../../../../../services/connect-server.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { City } from '../../../../../../interfaces/city';
import { AddressPopupComponent } from '../../../../../../pop-up/address-popup/address-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Address } from '../../../../../../interfaces/address';

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

  @Input() addressList: Address[] = [];
  @Input() idcustomer: number = 0;
  @Input() countriesList: Country[] = [];
  descriptionRows: number = 2;
  submitted: boolean = false;
  filteredCities$!: Observable<City[]>;
  addressForm!: FormGroup;

  constructor(private fb: FormBuilder, private connectServerService: ConnectServerService,
    private dialog: MatDialog) {
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
    let emptyAddress = this.createEmptyAddress();
    this.modifyAddressPopup(emptyAddress.getRawValue());
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
      maxHeight: '600px',
      width: '90%',
      data: { 
        addressid: idaddress,
        idpopup: 2,
        idcustomer: this.idcustomer,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != null) {
        // se è stato eliminato allora elimina dalla lista
        let index = this.addresses.controls.findIndex(address => address.get('id')?.value == result.id);
        this.addresses.controls.splice(index, 1);
      }
    })
  }

  modifyAddressPopup(address: any) {
    const dialogRef = this.dialog.open(AddressPopupComponent, {
      maxWidth: '1200px',
      minWidth: '350px',
      maxHeight: '600px',
      width: '90%',
      data: { 
        address: address,
        idcustomer: this.idcustomer,
        idpopup: 1,
        countriesList: this.countriesList,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != null) {
        // Se è stato correttamente salvato sul server aggiorna. Se id == 0 inserisci.
        if(result.obj.id != 0 && result.obj.id != null) {
          let index = this.addresses.controls.findIndex(address => address.get('id')?.value == result.id);
          this.addresses.at(index).patchValue(result.article);
        }
        else {
          this.addresses.push(this.createAddress(result.obj));
        }
      }
    })
  }
}
