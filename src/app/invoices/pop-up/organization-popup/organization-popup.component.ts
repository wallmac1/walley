import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { City } from '../../interfaces/city';
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

  organizationForm = new FormGroup({
    municipality: new FormControl<City | null>(null, Validators.required),
    province: new FormControl<string | null>({ value: null, disabled: true }),
    postalcode: new FormControl<string | null>(null, Validators.required),
    street: new FormControl<string | null>(null, Validators.required),
    number: new FormControl<string | null>(null, Validators.required),
  })

  taxRepresentativeForm = new FormGroup({
    surname: new FormControl<string | null>(null),
    name: new FormControl<string | null>(null),
    denomination: new FormControl<string | null>(null),
    vat: new FormControl<string | null>(null),
  })

  constructor(public dialogRef: MatDialogRef<OrganizationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.idPopup = data.idPopup;
    if (this.idPopup == 1) {
      this.organizationForm.patchValue(data.organization);
    }
    else if (this.idPopup == 2) {
      this.taxRepresentativeForm.patchValue(data.taxRepresentative);
    }
    else {
      this.dialogRef.close(null);
    }
  }

  ngOnInit(): void {
    if (this.idPopup == 1) {
      this.searchCity();
    }
  }

  displayCityName(city?: City): string {
    return city ? city.name! : '';
  }

  private searchCity() {
    const city_field = this.organizationForm.get('municipality');
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

  save() {
    this.submitted = true;
    if (this.idPopup == 1) {
      if (this.organizationForm.valid) {
        this.dialogRef.close({ obj: this.organizationForm.getRawValue() });
      }
    }
    else {
      if (this.organizationForm.valid) {
        this.dialogRef.close({ obj: this.taxRepresentativeForm.getRawValue() });
      }
    }
  }

  close() {
    this.dialogRef.close(null);
  }

}
