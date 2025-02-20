import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Country } from '../../../invoices/interfaces/country';
import { Address } from '../../../invoices/interfaces/address';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { City } from '../../../invoices/interfaces/city';

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

  idcustomer: number = 0;
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
    country: new FormControl<number | null>(null, Validators.required),
    street: new FormControl<string | null>(null, Validators.required),
    city_it: new FormControl<City | null>(null, [Validators.required, this.cityValidator()]),
    city: new FormControl<string | null>(null, Validators.required),
    street_number: new FormControl<string | null>(null, Validators.required),
    province: new FormControl<string | null>(null, Validators.required),
    postalcode: new FormControl<string | null>(null, Validators.required),
    legalOffice: new FormControl<number>(0),
    mainOffice: new FormControl<number>(0),
  })

  constructor(public dialogRef: MatDialogRef<AddressPopupComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.idPopup = data.idpopup;
    this.idcustomer = data.idcustomer;
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
    this.addressForm.get('country')?.valueChanges.subscribe(() => { this.formLogic() });
    this.addressForm.get('city_it')?.valueChanges.subscribe(() => { this.provinceLogic() });
    this.formLogic();
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

  provinceLogic() {
    if (this.addressForm.get('city_it')?.valid) {
      const city = this.addressForm.get('city_it')?.value;
      this.addressForm.get('province')?.disable();
      this.addressForm.get('province')?.setValue(city?.province!);
    }
    else {
      this.addressForm.get('province')?.setValue(null);
    }
  }

  formLogic() {
    if (this.addressForm.get('country')?.value == null) {
      this.addressForm.get('city')?.disable();
      this.addressForm.get('city')?.reset();
      this.addressForm.get('city_it')?.disable();
      this.addressForm.get('city_it')?.reset();
      this.addressForm.get('street')?.disable();
      this.addressForm.get('street')?.reset();
      this.addressForm.get('street_number')?.disable();
      this.addressForm.get('street_number')?.reset();
      this.addressForm.get('province')?.disable();
      this.addressForm.get('province')?.reset();
      this.addressForm.get('postalcode')?.disable();
      this.addressForm.get('postalcode')?.reset();
      this.addressForm.get('legalOffice')?.disable();
      this.addressForm.get('legalOffice')?.reset();
      this.addressForm.get('mainOffice')?.disable();
      this.addressForm.get('mainOffice')?.reset();
    }
    else if (this.addressForm.get('country')?.value != 12) {
      this.addressForm.get('city')?.enable();
      this.addressForm.get('city')?.setValidators(Validators.required);
      this.addressForm.get('city_it')?.disable();
      this.addressForm.get('city_it')?.setValidators(null);
      this.addressForm.get('street')?.enable();
      this.addressForm.get('street_number')?.enable();
      this.addressForm.get('province')?.enable();
      this.addressForm.get('postalcode')?.enable();
      this.addressForm.get('legalOffice')?.enable();
      this.addressForm.get('mainOffice')?.enable();
    }
    else {
      this.addressForm.get('city_it')?.enable();
      this.addressForm.get('city_it')?.setValidators([Validators.required, this.cityValidator()]);
      this.addressForm.get('city')?.disable();
      this.addressForm.get('city')?.setValidators(null);
      this.addressForm.get('street')?.enable();
      this.addressForm.get('street_number')?.enable();
      this.addressForm.get('province')?.disable();
      this.addressForm.get('postalcode')?.enable();
      this.addressForm.get('legalOffice')?.enable();
      this.addressForm.get('mainOffice')?.enable();
    }
  }

  displayCityName(city?: City): string {
    return city ? city.name! : '';
  }

  private searchCity() {
    const city_field = this.addressForm.get('city_it');
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

    // Restituisce la lista come Observable
    const filteredCities = cities.filter(city =>
      city.name.toLowerCase().includes(val.toLowerCase())
    );
    return of(filteredCities);
  }

  historicize() {
    this.submitted = true;
    if (this.addressForm.valid) {
      // Salvare usando gli idcustomer e idarticle, poi nel subscribe chiudere e ritornare valori, oppure null se fallisce
      this.dialogRef.close({ obj: this.addressForm.getRawValue(), id: this.addressid });
    }
  }

  update() {
    this.submitted = true;
    if (this.addressForm.valid) {
      // Salvare usando gli idcustomer e idarticle, poi nel subscribe chiudere e ritornare valori, oppure null se fallisce
      this.addressForm.get('id')?.setValue(1);
      this.dialogRef.close({ obj: this.addressForm.getRawValue(), id: this.addressid });
    }
  }

  add() {
    this.submitted = true;
    if (this.addressForm.valid) {
      // Salvare usando gli idcustomer e idarticle, poi nel subscribe chiudere e ritornare valori, oppure null se fallisce
      this.addressid = 1;
      this.dialogRef.close({ obj: this.addressForm.getRawValue(), id: this.addressid });
    }
  }

  deleteAddress() {
    // Eliminare usando gli idcustomer e idarticle, poi nel subscribe chiudere e ritornare valori, oppure null se fallisce
    this.dialogRef.close({ id: this.addressid });
  }

  close() {
    this.dialogRef.close(null);
  }

  cityValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      // Controlla se il valore è un oggetto e ha le proprietà corrette
      const isValid =
        typeof value === 'object' &&
        value !== null &&
        'id' in value &&
        'name' in value &&
        'cap' in value &&
        'region' in value &&
        'province' in value &&
        typeof value.id === 'number' &&
        typeof value.name === 'string' &&
        typeof value.cap === 'string' &&
        typeof value.region === 'string' &&
        typeof value.province === 'string';

      return isValid ? null : { invalidCity: true };
    };
  }

}
