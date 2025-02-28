import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { City } from '../../../invoices/interfaces/city';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Connect } from '../../../classes/connect';
import { ApiResponse } from '../../../weco/interfaces/api-response';
import { AutocompleteMunicipality } from '../../interfaces/autocomplete-municipality';

@Component({
  selector: 'app-organization-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatDialogModule,
    MatAutocompleteModule
  ],
  templateUrl: './organization-popup.component.html',
  styleUrl: './organization-popup.component.scss'
})
export class OrganizationPopupComponent {

  filteredCities$!: Observable<AutocompleteMunicipality[]>;
  submitted: boolean = false;
  idPopup: number = 0;

  organizationTaxForm = new FormGroup({
    idregistry: new FormControl<number>(0),
    city: new FormControl<AutocompleteMunicipality | null>(null, [Validators.required, this.cityValidator()]),
    province: new FormControl<string | null>({ value: null, disabled: true }),
    organization_postalcode: new FormControl<string | null>(null, Validators.required),
    organization_street: new FormControl<string | null>(null, Validators.required),
    organization_street_number: new FormControl<string | null>(null, Validators.required),
    tax_naturalPerson: new FormControl<number>(0),
    tax_surname: new FormControl<string | null>(null, Validators.required),
    tax_name: new FormControl<string | null>(null, Validators.required),
    tax_denomination: new FormControl<string | null>(null, Validators.required),
    tax_vat: new FormControl<string | null>(null),
  })

  constructor(public dialogRef: MatDialogRef<OrganizationPopupComponent>, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private connectServerService: ConnectServerService) {
    this.organizationTaxForm.patchValue(data.organizationTax);
    this.organizationTaxForm.get('idregistry')?.setValue(data.idregistry);
  }

  ngOnInit(): void {
    this.searchCity();
    this.municipalityFormLogic();
    this.naturalPersonFormLogic();
    this.initForm();
  }

  initForm() {
    this.organizationTaxForm.get('tax_naturalPerson')?.valueChanges.subscribe(() => {
      this.naturalPersonFormLogic();
    })

    this.organizationTaxForm.get('city')?.valueChanges.subscribe(() => {
      this.municipalityFormLogic();
    })
  }

  municipalityFormLogic() {
    const municipality = this.organizationTaxForm.get('city');
    if (municipality?.valid) {
      this.organizationTaxForm.get('province')?.setValue(municipality?.value?.province_name || null);
    }
    else {
      this.organizationTaxForm.get('province')?.setValue(null);
    }
  }

  naturalPersonFormLogic() {
    if (this.organizationTaxForm.get('tax_naturalPerson')?.value == 1) {
      this.organizationTaxForm.get('tax_name')?.setValidators(Validators.required);
      this.organizationTaxForm.get('tax_name')?.enable();
      this.organizationTaxForm.get('tax_surname')?.setValidators(Validators.required);
      this.organizationTaxForm.get('tax_surname')?.enable();
      this.organizationTaxForm.get('tax_denomination')?.setValidators(null);
      this.organizationTaxForm.get('tax_denomination')?.disable();
    }
    else {
      this.organizationTaxForm.get('tax_name')?.setValidators(null);
      this.organizationTaxForm.get('tax_name')?.disable();
      this.organizationTaxForm.get('tax_surname')?.setValidators(null);
      this.organizationTaxForm.get('tax_surname')?.disable();
      this.organizationTaxForm.get('tax_denomination')?.setValidators(Validators.required);
      this.organizationTaxForm.get('tax_denomination')?.enable();
    }
  }

  displayCityName(city?: AutocompleteMunicipality): string {
    return city ? city.name! : '';
  }

  private searchCity() {
    const city_field = this.organizationTaxForm.get('city');
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

  update() {
    this.submitted = true;
    if (this.organizationTaxForm.valid) {
      // Salva sul server e poi ritorna i valori. Ritorna null se il salvataggio fallisce
      this.saveOrganizaionTax();
    }
  }

  saveOrganizaionTax() {
    const natural_person = this.organizationTaxForm.get('tax_naturalPerson')?.value ? 1 : 0;
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'customer/upsertOrganizationTax', {
      idregistry: this.organizationTaxForm.get('idregistry')?.value,
      organization_municipality: this.organizationTaxForm.get('city')?.value,
      organization_postalcode: this.organizationTaxForm.get('organization_postalcode')?.value,
      organization_street: this.organizationTaxForm.get('organization_street')?.value,
      organization_street_number: this.organizationTaxForm.get('organization_street_number')?.value,
      tax_naturalPerson: natural_person,
      tax_surname: this.organizationTaxForm.get('tax_surname')?.value,
      tax_name: this.organizationTaxForm.get('tax_name')?.value,
      tax_denomination: this.organizationTaxForm.get('tax_denomination')?.value,
      tax_vat: this.organizationTaxForm.get('tax_vat')?.value,
    }).subscribe((val: ApiResponse<any>) => {
      this.dialogRef.close({ obj: this.organizationTaxForm.getRawValue() });
    })
  }

  // updateOrHistoricizePopup() {
  //   const dialogRef = this.dialog.open(UpdateHistoricizePopupComponent, {
  //     maxWidth: '400px',
  //     minWidth: '350px',
  //     maxHeight: '600px',
  //     width: '90%',
  //     data: {
  //       taxRepresentative: this.organizationTaxForm.getRawValue(),
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.dialogRef.close({ obj: this.organizationTaxForm.getRawValue() });
  //     }
  //   })
  // }

  cityValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      // Controlla se il valore è un oggetto e ha le proprietà corrette
      const isValid =
        typeof value === 'object' &&
        value !== null &&
        'id' in value &&
        'name' in value &&
        typeof value.id === 'number' &&
        typeof value.name === 'string'

      return isValid ? null : { invalidCity: true };
    };
  }

  close() {
    this.dialogRef.close(null);
  }

}
