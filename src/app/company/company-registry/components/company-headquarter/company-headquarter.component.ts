import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Country } from '../../../../weco/interfaces/country';
import { CompanyHeadquarter } from '../../../interfaces/company-headquarter';
import { City } from '../../../../invoices/interfaces/city';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CompanyHeadquarterPopupComponent } from '../../../pop-up/company-headquarter-popup/company-headquarter-popup.component';

@Component({
  selector: 'app-company-headquarter',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    TranslateModule,
    MatAutocompleteModule
  ],
  templateUrl: './company-headquarter.component.html',
  styleUrl: './company-headquarter.component.scss'
})
export class CompanyHeadquarterComponent {

  @Input() countriesList: Country[] = [];
  @Input() companyHeadquarter: CompanyHeadquarter | null = null;

  provinceList: { id: number, name: string }[] = [];
  filteredCities$!: Observable<City[]>;
  submitted: boolean = false;

  companyLegalHeadquarterForm = new FormGroup({
    country: new FormControl<number>(0),
    street: new FormControl<string | null>(null),
    street_number: new FormControl<string | null>(null),
    municipality: new FormControl<City | null>(null),
    postalcode: new FormControl<string | null>(null),
    province: new FormControl<string | null>(null)
  });

  companyBuildingForm = new FormGroup({
    country: new FormControl<number>(0),
    street: new FormControl<string | null>(null),
    street_number: new FormControl<string | null>(null),
    municipality: new FormControl<City | null>(null),
    postalcode: new FormControl<string | null>(null),
    province: new FormControl<string | null>(null)
  });

  companyReaForm = new FormGroup({
    number: new FormControl<string | null>(null),
    province: new FormControl<string | null>(null),
    assets: new FormControl<string | null>(null),
    sole_shareholder: new FormControl<number>(0),
    closure: new FormControl<number>(0)
  });

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    if (this.companyHeadquarter) {
      this.companyLegalHeadquarterForm.patchValue(this.companyHeadquarter.company_building);
      this.companyBuildingForm.patchValue(this.companyHeadquarter.company_building);
      this.companyReaForm.patchValue(this.companyHeadquarter.rea);
    }
    this.initForm();
    this.searchCity();
  }

  initForm() {
    this.companyLegalHeadquarterForm.disable();
    this.companyBuildingForm.disable();
    this.companyReaForm.disable();
  }

  getHeadQuarter() {

  }

  selectedCountry() { }

  modifyHeadquarterPopup(type: any) {
      const dialogRef = this.dialog.open(CompanyHeadquarterPopupComponent, {
        maxWidth: '800px',
        maxHeight: '500px',
        minWidth: '350px',
        width: '94%',
        data: { 
          idPopup: type, 
          companyLegalHeadquarter: this.companyLegalHeadquarterForm.getRawValue(),
          companyBuilding: this.companyBuildingForm.getRawValue(),
          companyRea: this.companyReaForm.getRawValue(),
          countriesList: this.countriesList,
          provinceList: this.provinceList
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          // AGGIORNA CON LE MODIFICHE EFFETTUATE
          if(result.idPopup == 1) {
            this.companyLegalHeadquarterForm.patchValue(result.companyLegalHeadquarter);
          }
          else if (result.idPopup == 2) {
            this.companyBuildingForm.patchValue(result.companyBuilding);
          }
          else if (result.idPopup == 3) {
            this.companyReaForm.patchValue(result.companyRea);
          }
        }
      });
    }

  displayCityName(city?: City): string {
    return city ? city.name! : '';
  }

  private searchCity() {
    const city_field = this.companyLegalHeadquarterForm.get('municipality');
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

    // Restituisce la lista come Observable FILTRO DA TOGLIERE QUANDO AVVIENE CHIAMATA AL SERVER
    const filteredCities = cities.filter(city =>
      city.name.toLowerCase().includes(val.toLowerCase())
    );
    return of(filteredCities);
  }

}
