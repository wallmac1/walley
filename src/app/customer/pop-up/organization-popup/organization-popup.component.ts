import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { City } from '../../../invoices/interfaces/city';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

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

  filteredCities$!: Observable<City[]>;
  submitted: boolean = false;
  idPopup: number = 0;

  organizationTaxForm = new FormGroup({
    municipality: new FormControl<City | null>(null, Validators.required),
    province: new FormControl<string | null>({ value: null, disabled: true }),
    postalcode: new FormControl<string | null>(null, Validators.required),
    street: new FormControl<string | null>(null, Validators.required),
    street_number: new FormControl<string | null>(null, Validators.required),
    naturalPerson: new FormControl<number>(0),
    surname: new FormControl<string | null>(null, Validators.required),
    name: new FormControl<string | null>(null, Validators.required),
    denomination: new FormControl<string | null>(null, Validators.required),
    vat: new FormControl<string | null>(null),
  })

  constructor(public dialogRef: MatDialogRef<OrganizationPopupComponent>, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.organizationTaxForm.patchValue(data.organizationTax);
  }

  ngOnInit(): void {
    this.searchCity();
    this.municipalityFormLogic();
    this.naturalPersonFormLogic();
    this.initForm();
  }

  initForm() {
    this.organizationTaxForm.get('naturalPerson')?.valueChanges.subscribe(() => {
      this.naturalPersonFormLogic();
    })

    this.organizationTaxForm.get('municipality')?.valueChanges.subscribe(() => {
      this.municipalityFormLogic();
    })
  }

  municipalityFormLogic() {
    const municipality = this.organizationTaxForm.get('municipality');
    if (municipality?.valid) {
      this.organizationTaxForm.get('province')?.setValue(municipality?.value?.province || null);
    }
    else {
      this.organizationTaxForm.get('province')?.setValue(null);
    }
  }

  naturalPersonFormLogic() {
    if (this.organizationTaxForm.get('naturalPerson')?.value == 1) {
      this.organizationTaxForm.get('name')?.setValidators(Validators.required);
      this.organizationTaxForm.get('name')?.enable();
      this.organizationTaxForm.get('surname')?.setValidators(Validators.required);
      this.organizationTaxForm.get('surname')?.enable();
      this.organizationTaxForm.get('denomination')?.setValidators(null);
      this.organizationTaxForm.get('denomination')?.disable();
    }
    else {
      this.organizationTaxForm.get('name')?.setValidators(null);
      this.organizationTaxForm.get('name')?.disable();
      this.organizationTaxForm.get('surname')?.setValidators(null);
      this.organizationTaxForm.get('surname')?.disable();
      this.organizationTaxForm.get('denomination')?.setValidators(Validators.required);
      this.organizationTaxForm.get('denomination')?.enable();
    }
  }

  displayCityName(city?: City): string {
    return city ? city.name! : '';
  }

  private searchCity() {
    const city_field = this.organizationTaxForm.get('municipality');
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
        postalcode: "50032",
        region: "Toscana",
        province: "Firenze",
      },
    ];

    // Restituisce la lista come Observable
    return of(city);
  }

  update() {
    this.submitted = true;
    if (this.organizationTaxForm.valid) {
      // Salva sul server e poi ritorna i valori. Ritorna null se il salvataggio fallisce
      this.dialogRef.close({ obj: this.organizationTaxForm.getRawValue() });
    }
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

  close() {
    this.dialogRef.close(null);
  }

}
