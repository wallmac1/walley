import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { City } from '../../interfaces/city';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UpdateHistoricizePopupComponent } from '../update-historicize-popup/update-historicize-popup.component';

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
    naturalPerson: new FormControl<number>(0),
    surname: new FormControl<string | null>(null, Validators.required),
    name: new FormControl<string | null>(null, Validators.required),
    denomination: new FormControl<string | null>(null, Validators.required),
    vat: new FormControl<string | null>(null),
  })

  constructor(public dialogRef: MatDialogRef<OrganizationPopupComponent>, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.idPopup = data.idpopup;
    if (this.idPopup == 1) {
      this.organizationForm.patchValue(data.organization);
    }
    else if (this.idPopup == 2) {
      this.taxRepresentativeForm.patchValue(data.taxRepresentative);
    }
  }

  ngOnInit(): void {
    if (this.idPopup == 1) {
      this.searchCity();
      this.initOrganizationForm();
      this.organizationFormLogic();
    }
    else {
      this.initTaxRepresentativeForm();
      this.taxRepresentativeFormLogic();
    }
  }

  initTaxRepresentativeForm() {
    this.taxRepresentativeForm.get('naturalPerson')?.valueChanges.subscribe(() => {
      this.taxRepresentativeFormLogic();
    })
  }

  initOrganizationForm() {
    this.organizationForm.get('municipality')?.valueChanges.subscribe(() => {
      this.organizationFormLogic();
    })
  }

  organizationFormLogic() {
    const municipality = this.organizationForm.get('municipality');
    if (municipality?.valid) {
      this.organizationForm.get('province')?.setValue(municipality?.value?.province || null);
    }
    else {
      this.organizationForm.get('province')?.setValue(null);
    }
  }

  taxRepresentativeFormLogic() {
    if (this.taxRepresentativeForm.get('naturalPerson')?.value == 1) {
      this.taxRepresentativeForm.get('name')?.setValidators(Validators.required);
      this.taxRepresentativeForm.get('name')?.enable();
      this.taxRepresentativeForm.get('surname')?.setValidators(Validators.required);
      this.taxRepresentativeForm.get('surname')?.enable();
      this.taxRepresentativeForm.get('denomination')?.setValidators(null);
      this.taxRepresentativeForm.get('denomination')?.disable();
    }
    else {
      this.taxRepresentativeForm.get('name')?.setValidators(null);
      this.taxRepresentativeForm.get('name')?.disable();
      this.taxRepresentativeForm.get('surname')?.setValidators(null);
      this.taxRepresentativeForm.get('surname')?.disable();
      this.taxRepresentativeForm.get('denomination')?.setValidators(Validators.required);
      this.taxRepresentativeForm.get('denomination')?.enable();
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

  update() {
    this.submitted = true;
    if (this.idPopup == 1) {
      if (this.organizationForm.valid) {
        // Salva sul server e poi ritorna i valori. Ritorna null se il salvataggio fallisce
        this.dialogRef.close({ obj: this.organizationForm.getRawValue() });
      }
    }
    else {
      if (this.taxRepresentativeForm.valid) {
        this.updateOrHistoricizePopup();
      }
    }
  }

  updateOrHistoricizePopup() {
    const dialogRef = this.dialog.open(UpdateHistoricizePopupComponent, {
      maxWidth: '400px',
      minWidth: '350px',
      maxHeight: '600px',
      width: '90%',
      data: {
        taxRepresentative: this.taxRepresentativeForm.getRawValue(),
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close({ obj: this.taxRepresentativeForm.getRawValue() });
      }
    })
  }

  close() {
    this.dialogRef.close(null);
  }

}
