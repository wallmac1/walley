import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ModifyCustomerPopupComponent } from '../pop-up/modify-customer-popup/modify-customer-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Country } from '../../invoices/interfaces/country';
import { ConnectServerService } from '../../services/connect-server.service';
import { CustomerModifyComponent } from "./components/customer-modify/customer-modify.component";
import { Customer } from '../interfaces/customer';
import { CustomerTherapiesComponent } from "./components/customer-therapies/customer-therapies.component";
import { CustomerStudentsComponent } from './components/customer-students/customer-students.component';
import { Connect } from '../../classes/connect';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ApiResponse } from '../../weco/interfaces/api-response';

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
    CustomerStudentsComponent
  ],
  templateUrl: './customer-container.component.html',
  styleUrl: './customer-container.component.scss'
})
export class CustomerContainerComponent {

  @ViewChild(CustomerModifyComponent) customerModify!: CustomerModifyComponent;
  @ViewChild(CustomerTherapiesComponent) therapyComponent!: CustomerTherapiesComponent;
  @ViewChild(CustomerStudentsComponent) studentComponent!: CustomerStudentsComponent;

  idcustomer: number = 0;
  chargedTab: boolean[] = [false, false, false];
  countriesList: Country[] = [];
  customer: Customer | null = null;

  constructor(private dialog: MatDialog, private connectServerService: ConnectServerService,
    private route: ActivatedRoute, private cdr: ChangeDetectorRef
  ) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.idcustomer = parseInt(id);
      }
    });
  }

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
    // this.customer!.naturalPerson = event.customer.naturalPerson;
    // this.customer!.name = event.customer.name;
    // this.customer!.surname = event.customer.surname;
    // this.customer!.businessName = event.customer.surname;
    // this.customer!.vat = event.customer.vat;
    // this.customer!.fiscalcode = event.customer.fiscalcode;
    // this.customer!.country = event.customer.country;
    // this.customer!.sameCode = event.customer.sameCode;
    // this.customer!.sdi = event.customer.sdi;
    // this.customer!.pec = event.customer.pec;
    this.idcustomer = event.customer.idregistry;
    this.getCustomer();
  }

  modifyPopUp() {
    if (this.customer != null) {
      console.log("MODIFICA CLIENTE", this.customer?.naturalPerson);
      const dialogRef = this.dialog.open(ModifyCustomerPopupComponent, {
        maxWidth: '1000px',
        minWidth: '350px',
        maxHeight: '500px',
        width: '90%',
        data: {
          customerGeneralForm: {
            idregistry: this.customer.idregistry,
            naturalPerson: this.customer?.naturalPerson,
            name: this.customer?.name,
            surname: this.customer?.surname,
            businessName: this.customer?.businessName,
            vat: this.customer?.vat,
            fiscalcode: this.customer?.fiscalcode,
            country: this.customer?.country,
            sameCode: this.customer?.sameCode,
            sdi: this.customer?.sdi,
            pec: this.customer?.pec,
            health_cf: this.customer.health_cf,
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

  goBack() {
    window.history.back();
  }

  addTherapy() {
    setTimeout(() => {
      this.therapyComponent.createTherapy();
    }, 300);
  }

  addStudent() {
    setTimeout(() => {
      this.studentComponent.openStudentPopup(1, null);
    }, 300);
  }

  getCustomer() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'customer/customerData', { idregistry: this.idcustomer })
      .subscribe((val: ApiResponse<{ customerData: Customer }>) => {
        if (val.data) {
          this.customer = val.data.customerData;
          this.customerModify.customer = this.customer;
          this.customerModify.customerGeneralForm.patchValue(this.customer);
          this.customerModify.customerRecordsForm.patchValue(this.customer);
          this.customerModify.customerGeneralForm.get('idregistry')?.setValue(this.idcustomer);
        }
      });
  }
}
