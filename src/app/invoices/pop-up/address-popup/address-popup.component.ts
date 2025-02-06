import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Country } from '../../interfaces/country';
import { Address } from '../../interfaces/address';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { City } from '../../interfaces/city';

@Component({
  selector: 'app-address-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatDialogModule,
    MatAutocompleteModule
  ],
  templateUrl: './address-popup.component.html',
  styleUrl: './address-popup.component.scss'
})
export class AddressPopupComponent {

  idPopup: number = 0;
  address: Address | null = null;
  countriesList: Country[] = [];
  addressid: number = 0;
  customerid: number = 0;
  descriptionRows: number = 2;
  submitted: boolean = false;
  filteredCities$!: Observable<City[]>;

  addressForm = new FormGroup({
    id: new FormControl<number>(0),
    description: new FormControl<string | null>(''),
    country: new FormControl<number | null>(null),
    street: new FormControl<string | null>(null),
    city: new FormControl<City | null>(null),
    number: new FormControl<string | null>(null),
    province: new FormControl<string | null>(null),
    postalCode: new FormControl<string | null>(null),
    legalOffice: new FormControl<number>(0),
    mainOffice: new FormControl<number>(0),
  })

  constructor(public dialogRef: MatDialogRef<AddressPopupComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.idPopup = data.idpopup;
    if (this.idPopup == 1) {
      this.addressForm.patchValue(data.address);
      this.countriesList = data.countriesList;
    }
    else if (this.idPopup == 2) {
      this.addressid = data.addressid;
    }
    else {
      this.dialogRef.close(null);
    }
  }

  ngOnInit(): void {
    this.searchCity()
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

  saveAddress() { }

  deleteAddress() { }

  close() { }

}
