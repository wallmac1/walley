import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { City } from '../../invoices/interfaces/city';
import { ModifyCustomerPopupComponent } from '../pop-up/modify-customer-popup/modify-customer-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Country } from '../../invoices/interfaces/country';
import { ConnectServerService } from '../../services/connect-server.service';
import { CustomerModifyComponent } from "./components/customer-modify/customer-modify.component";
import { Customer } from '../interfaces/customer';
import { CustomerTherapiesComponent } from "./components/customer-therapies/customer-therapies.component";
import { CustomerTraineesComponent } from "./components/customer-trainees/customer-trainees.component";

@Component({
  selector: 'app-customer-container',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    TranslateModule,
    MatTooltipModule,
    CustomerModifyComponent,
    CustomerTherapiesComponent,
    CustomerTraineesComponent
],
  templateUrl: './customer-container.component.html',
  styleUrl: './customer-container.component.scss'
})
export class CustomerContainerComponent {

  @ViewChild(CustomerModifyComponent) customerModify!: CustomerModifyComponent;
  @ViewChild(CustomerTherapiesComponent) therapyComponent!: CustomerTherapiesComponent;
  @ViewChild(CustomerTraineesComponent) traineeComponent!: CustomerTraineesComponent;

  chargedTab: boolean[] = [false, false, false];
  countriesList: Country[] = [];
  customer: Customer | null = null;

  constructor(private dialog: MatDialog, private connectServerService: ConnectServerService) { }

  ngOnInit(): void {
    this.getCountries();
    this.getCustomer();
  }

  onTabChange(index: number) {
    if (!this.chargedTab[index]) {
      this.getTabFiles(index);
    }
  }

  getTabFiles(tab: number) {
    // RICHIESTA AL SERVER, NEL SUBSCRIBE AGGIUNGERE chargedTab[tab] = true;
    if (this.chargedTab[tab] == false) {
      this.chargedTab[tab] = true;
      console.log("creato", tab);
    }
  }

  getCountries() {
    this.connectServerService.getRequestCountry().subscribe((val: any) => {
      if (val) {
        this.countriesList = val;
      }
    });
  }

  modifyCustomer(event: { customer: any }) {
    this.customer!.naturalPerson = event.customer.naturalPerson;
    this.customer!.name = event.customer.name;
    this.customer!.surname = event.customer.surname;
    this.customer!.businessName = event.customer.surname;
    this.customer!.vat = event.customer.vat;
    this.customer!.fiscalcode = event.customer.fiscalcode;
    this.customer!.country = event.customer.country;
    this.customer!.sameCode = event.customer.sameCode;
    this.customer!.sdi = event.customer.sdi;
    this.customer!.pec = event.customer.pec;
  }

  modifyPopUp() {
    if (this.customer != null) {
      const dialogRef = this.dialog.open(ModifyCustomerPopupComponent, {
        maxWidth: '1000px',
        minWidth: '350px',
        maxHeight: '500px',
        width: '90%',
        data: {
          customerGeneralForm: {
            naturalPerson: this.customer?.naturalPerson,
            name: this.customer?.name,
            surname: this.customer?.surname,
            businessName: this.customer?.businessName,
            vat: this.customer?.vat,
            fiscalcode: this.customer?.fiscalcode,
            country: this.customer?.country,
            sameCode: this.customer?.sameCode,
            sdi: this.customer?.sdi,
            pec: this.customer?.pec
          },
          idPopup: 2,
          countriesList: this.countriesList,
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          // SALVARE IL CLIENTE
          // UPDATE DEGLI OGGETTI
          this.customer!.naturalPerson = result.naturalPerson;
          this.customer!.name = result.name;
          this.customer!.surname = result.surname;
          this.customer!.businessName = result.businessName;
          this.customer!.vat = result.vat;
          this.customer!.fiscalcode = result.fiscalcode;
          this.customer!.country = result.country;
          this.customer!.sameCode = result.sameCode;
          this.customer!.sdi = result.sdi;
          this.customer!.pec = result.pec;

          this.customerModify.customer = this.customer;
          this.customerModify.customerGeneralForm.patchValue(this.customer!);
          this.customerModify.customerRecordsForm.patchValue(this.customer!);
        }
      });
    }
  }

  addTherapy() {
    setTimeout(() => {
      this.therapyComponent.createTherapy();
    }, 300);
  }

  addTrainee() {
    setTimeout(() => {
      this.traineeComponent.openTraineePopup(1, null);
    }, 300);
  }

  getCustomer() {
    // RICHIEDI IL CUSTOMER AL SERVER
    const customer = {
      naturalPerson: 1,
      name: "Mario",
      surname: "Rossi",
      businessName: null,
      fiscalcode: "RSSMRA80A01H501Z",
      vat: "IT12345678901",
      country: 12,
      sameCode: 0,
      pec: "mario.rossi@example.com",
      email: "mario.rossi@example.com",
      phoneNumber: "+39 328 1234567",
      fax: "+39 06 9876543",
      website: "https://www.mariorossi.com",
      eori: "IT 123456789 12345",
      gender: 1,
      birth_country: 12,
      birth_city: null,
      birth_city_it: {
        id: 88,
        name: 'Borgo San Lorenzo',
        postalcode: "50032",
        region: "Toscana",
        province: "Firenze",
      },
      birthday: "1980-01-01",
      job: "Ingegnere",
      doctor: "Pippo Poppo",
      specialist: "Pippa Peppa",
      sdi: "ABCDE12345",
    }

    this.customer = customer;
  }
}
