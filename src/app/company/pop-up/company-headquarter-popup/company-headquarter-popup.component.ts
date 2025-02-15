import { Component, HostListener, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConnectServerService } from '../../../services/connect-server.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { City } from '../../../invoices/interfaces/city';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Country } from '../../../invoices/interfaces/country';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-company-headquarter-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatDialogModule
  ],
  templateUrl: './company-headquarter-popup.component.html',
  styleUrl: './company-headquarter-popup.component.scss'
})
export class CompanyHeadquarterPopupComponent {

  filteredCities$!: Observable<City[]>;
  isSmallScreen: boolean = false;
  idPopup: number = 0;
  submitted: boolean = false;
  countriesList: Country[] = [];
  provinceList: { id: number, name: string }[] = [];

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

  constructor(public dialogRef: MatDialogRef<CompanyHeadquarterPopupComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // Inizializza il form con i dati passati al dialog
    this.idPopup = data.idPopup;
    this.countriesList = data.countriesList;
    if (this.idPopup == 1) {
      this.companyLegalHeadquarterForm.patchValue(data.companyLegalHeadquarter);
    }
    else if (this.idPopup == 2) {
      this.companyBuildingForm.patchValue(data.companyBuilding);
    }
    else if (this.idPopup == 3) {
      this.provinceList = data.provinceList;
      this.companyReaForm.patchValue(data.companyRea);
    }
  }

  ngOnInit(): void {
    this.updateWindowDimensions();
    this.searchCity();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  updateWindowDimensions() {
    if (window.innerWidth < 767) {
      this.isSmallScreen = true;
    }
    else {
      this.isSmallScreen = false;
    }
  }

  historicize() {
    // CHIAMATA AL SERVER PER STORICIZZARE
    this.returnValues();
  }

  update() {
    // CHIAMATA AL SERVER PER AGGIORNARE
    this.returnValues();
  }

  returnValues() {
    if (this.idPopup == 1) {
      this.dialogRef.close({ idPopup: 1, companyLegalHeadquarter: this.companyLegalHeadquarterForm.getRawValue() });
    }
    else if (this.idPopup == 2) {
      this.dialogRef.close({ idPopup: 2, companyBuilding: this.companyBuildingForm.getRawValue() });
    }
    else if (this.idPopup == 3) {
      this.dialogRef.close({ idPopup: 3, companyRea: this.companyReaForm.getRawValue() });
    }
  }

  close() {
    this.dialogRef.close(null);
  }

  selectedCountry() { }

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
        cap: "50032",
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
