import { CommonModule } from '@angular/common';
import { Component, HostListener, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { CompanyData } from '../interfaces/company-data';
import { ConnectServerService } from '../../services/connect-server.service';
import { CompanyDataComponent } from "./components/company-data/company-data.component";
import { Country } from '../../invoices/interfaces/country';
import { CompanyHeadquarterComponent } from "./components/company-headquarter/company-headquarter.component";
import { CompanyBrokerComponent } from "./components/company-broker/company-broker.component";
import { CompanyInfo } from '../interfaces/company-info';
import { CompanyHeadquarter } from '../interfaces/company-headquarter';
import { CompanyTaxRepresentativeComponent } from "./components/company-tax-representative/company-tax-representative.component";
import { CompanyBroker } from '../interfaces/company-broker';

@Component({
  selector: 'app-company-registry',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTooltipModule,
    MatTabsModule,
    CompanyDataComponent,
    CompanyHeadquarterComponent,
    CompanyBrokerComponent,
    CompanyTaxRepresentativeComponent
  ],
  templateUrl: './company-registry.component.html',
  styleUrl: './company-registry.component.scss'
})
export class CompanyRegistryComponent {

  @ViewChild(CompanyDataComponent) companyData!: CompanyDataComponent;

  companyDataObj: CompanyData | null = null;
  companyHeadquarterObj: CompanyHeadquarter | null = null;
  companyBrokerObj: CompanyBroker | null = null;
  companyTaxRepresentativeObj: null = null;
  countriesList: Country[] = [];
  typeList: { id: number, name: string }[] = [{ id: 1, name: "Persona Fisica" }, { id: 2, name: "Persona Giuridica" }];
  isSmallScreen: boolean = false;

  companyDataForm = new FormGroup({
    naturalPerson: new FormControl<number>(0),
    name: new FormControl<string | null>(null),
    surname: new FormControl<string | null>(null),
    business_name: new FormControl<string | null>(null),
  })

  constructor(private connectServerService: ConnectServerService) { }

  ngOnInit(): void {
    this.getCompanyData();
    this.getCompanyBroker();
    this.getCompanyHeadQuarter();
    this.updateWindowDimensions();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  updateWindowDimensions() {
    if (window.innerWidth < 768) {
      this.isSmallScreen = true;
    }
    else {
      this.isSmallScreen = false;
    }
  }

  getAllInfo() {
    // CHIAMATA GENERICA PER OTTENERE TUTTE LE INFO
  }

  getCompanyBroker() {
    this.companyBrokerObj = {
      country: null,
      type: 1,
      business_name: "Business Inc.",
      name: "John",
      surname: "Doe",
      fiscalcode: "ABC12345",
      vat: "IT123456789",
      eori: "IT1234567890001",
      title: "Mr."
    }
  }

  getCompanyHeadQuarter() {
    this.companyHeadquarterObj = {
      legal_headquarter: {
        country: 12,
        street: "Via Roma",
        street_number: "10",
        municipality: {
          id: 88,
          name: 'Borgo San Lorenzo',
          cap: "50032",
          region: "Toscana",
          province: "Firenze",
        },
        postalcode: "00100",
        province: "RM"
      },
      company_building: {
        country: 12,
        street: "Via Milano",
        street_number: "20",
        municipality: {
          id: 88,
          name: 'Borgo San Lorenzo',
          cap: "50032",
          region: "Toscana",
          province: "Firenze",
        },
        postalcode: "20100",
        province: "MI"
      },
      rea: {
        number: "REA123456",
        province: "MI",
        assets: "1000000",
        sole_shareholder: 1,
        closure: 0
      }
    }
  }

  getCompanyData() {
    this.companyDataObj = {
      info: {
        naturalPerson: 0,
        name: null,
        surname: null,
        business_name: "Wallnet snc",
        refidcompany: 12345,
        tax_regime: null,
        fiscalcode: 'ABC123XYZ',
        vat: 'IT12345678901',
        title: 'Example Corp',
        pec: 'example@pec.com',
        eori: 'ITIT123456789',
        phone: '+390123456789',
        fax: '+390987654321',
        email: 'info@example.com',
        lender_code: 'LENDER123',
      },
      professional_board: {
        board_name: 'Board of Commerce',
        board_number: 'XYZ123',
        subscription_date: '2022-01-01',
        province: 'Rome',
      }
    }

    this.companyDataForm.patchValue(this.companyDataObj.info);
  }

  modifyData(event: {companyDataObj: any}) {
    this.companyDataObj!.info = event.companyDataObj;
    this.companyDataForm.patchValue(this.companyDataObj!.info);
  }

  modifyDataPopup() {
    this.companyData.modifyInfoPopup(1);
  }

  goBack() {
    window.history.back();
  }

}
