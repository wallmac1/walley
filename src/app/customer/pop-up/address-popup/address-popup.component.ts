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
import { AutocompleteMunicipality } from '../../interfaces/autocomplete-municipality';
import { ApiResponse } from '../../../weco/interfaces/api-response';
import { Connect } from '../../../classes/connect';

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
  descriptionRows: number = 2;
  submitted: boolean = false;
  filteredCities$!: Observable<AutocompleteMunicipality[]>;

  addressForm = new FormGroup({
    idregistry: new FormControl<number>(0),
    idlocation: new FormControl<number>(0),
    description: new FormControl<string | null>(''),
    country: new FormControl<number | null>(null, Validators.required),
    street: new FormControl<string | null>(null, Validators.required),
    city_it: new FormControl<AutocompleteMunicipality | null>(null, [Validators.required, this.cityValidator()]),
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
    this.addressForm.get('idregistry')?.setValue(data.idregistry)
    if (this.idPopup == 1) {
      this.addressForm.patchValue(data.address);
      this.countriesList = data.countriesList;
    }
    else if (this.idPopup == 2) {
      this.addressForm.get('idregistry')?.setValue(data.idregistry);
      this.addressForm.get('idlocation')?.setValue(data.idlocation);
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
      this.addressForm.get('province')?.setValue(city?.province_name!);
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

  displayCityName(city?: AutocompleteMunicipality): string {
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

  private getCity(val: string): Observable<AutocompleteMunicipality[]> {
    // CHIAMATA AL SERVER
    return this.connectServerService.getRequest<ApiResponse<{ city: AutocompleteMunicipality[] }>>(Connect.urlServerLaraApi,
      'infoworld/searchMunicipalities',
      {
        tipo: 1,
        val: val
      })
  }

  historicize() {
    this.submitted = true;
    if (this.addressForm.valid) {
      // Salvare usando gli idcustomer e idarticle, poi nel subscribe chiudere e ritornare valori, oppure null se fallisce
      this.saveAddress(2);
    }
  }

  update() {
    this.submitted = true;
    if (this.addressForm.valid) {
      // Salvare usando gli idcustomer e idarticle, poi nel subscribe chiudere e ritornare valori, oppure null se fallisce
      //this.addressForm.get('id')?.setValue(1);
      this.saveAddress(1);
    }
  }

  add() {
    this.submitted = true;
    if (this.addressForm.valid) {
      // Salvare usando gli idcustomer e idarticle, poi nel subscribe chiudere e ritornare valori, oppure null se fallisce
      //this.addressid = 1;
      this.saveAddress(1);
    }
  }

  saveAddress(type_request: number) {
    const mainOffice = this.addressForm.get('mainOffice')?.value ? 1 : 0;
    const legalOffice = this.addressForm.get('legalOffice')?.value ? 1 : 0;
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'customer/upsertLocation', {
      idregistry: this.addressForm.get('idregistry')?.value, idlocation: this.addressForm.get('idlocation')?.value,
      type_request: type_request, description: this.addressForm.get('description')?.value,
      country: this.addressForm.get('country')?.value, street: this.addressForm.get('street')?.value,
      city: this.addressForm.get('city')?.value, city_it: this.addressForm.get('city_it')?.value,
      street_number: this.addressForm.get('street_number')?.value, province: this.addressForm.get('province')?.value,
      postalcode: this.addressForm.get('postalcode')?.value, legalOffice: legalOffice,
      mainOffice: mainOffice
    })
      .subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          let insertion = 0;
          if (this.addressForm.get('idlocation')?.value == 0) {
            insertion = 1;
          }
          this.addressForm.get('idlocation')?.setValue(val.data.idlocation);
          this.dialogRef.close({ obj: this.addressForm.getRawValue(), insertion: insertion });
        }
      })
  }

  deleteAddress() {
    // Eliminare usando gli idcustomer e idarticle, poi nel subscribe chiudere e ritornare valori, oppure null se fallisce
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'customer/deleteLocation', {
      idregistry: this.addressForm.get('idregistry')?.value, idlocation: this.addressForm.get('idlocation')?.value
    })
      .subscribe(() => {
        this.dialogRef.close({ idlocation: this.addressForm.get('idlocation')?.value });
      })
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
        'province_acronym' in value &&
        typeof value.id === 'number' &&
        typeof value.name === 'string' &&
        typeof value.province_acronym === 'string';

      return isValid ? null : { invalidCity: true };
    };
  }

}
