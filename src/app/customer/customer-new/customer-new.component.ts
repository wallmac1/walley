import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../services/connect-server.service';
import { Country } from '../../invoices/interfaces/country';
import { InViewportDirective } from '../../directives/in-viewport.directive';
import { ExistingCustomerPopupComponent } from '../pop-up/existing-customer-popup/existing-customer-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Connect } from '../../classes/connect';
import { ApiResponse } from '../../weco/interfaces/api-response';

@Component({
  selector: 'app-customer-new',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatTooltipModule,
    ReactiveFormsModule,
    InViewportDirective
  ],
  templateUrl: './customer-new.component.html',
  styleUrl: './customer-new.component.scss'
})
export class CustomerNewComponent {

  countriesList: Country[] = [];
  isSmall: boolean = false;
  submitted: boolean = false;

  customerForm = new FormGroup({
    naturalPerson: new FormControl<boolean>(true),
    name: new FormControl<string | null>(null, Validators.required),
    surname: new FormControl<string | null>(null, Validators.required),
    businessName: new FormControl<string | null>(null, Validators.required),
    fiscalcode: new FormControl<string | null>(null),
    vat: new FormControl<string | null>(null),
    country: new FormControl<number | null>(null),
    sameCode: new FormControl<boolean>(false)
  })

  constructor(private connectServerService: ConnectServerService, public dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
    this.customerForm.get('naturalPerson')?.valueChanges.subscribe(() => { this.formLogic() });
    this.formLogic();
    this.getCountries();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  updateWindowDimensions() {
    if (window.innerWidth < 768) {
      this.isSmall = true;
    }
    else {
      this.isSmall = false;
    }
  }

  formLogic() {
    if (this.customerForm.get('naturalPerson')?.value == true) {
      this.customerForm.get('businessName')?.setValidators(null);
      this.customerForm.get('businessName')?.reset();
      this.customerForm.get('businessName')?.disable();
      this.customerForm.get('name')?.setValidators(Validators.required);
      this.customerForm.get('surname')?.setValidators(Validators.required);
      this.customerForm.get('name')?.enable();
      this.customerForm.get('surname')?.enable();
    }
    else {
      this.customerForm.get('businessName')?.setValidators(Validators.required);
      this.customerForm.get('businessName')?.enable();
      this.customerForm.get('name')?.setValidators(null);
      this.customerForm.get('surname')?.setValidators(null);
      this.customerForm.get('name')?.disable();
      this.customerForm.get('surname')?.disable();
      this.customerForm.get('name')?.reset();
      this.customerForm.get('surname')?.reset();
    }
  }

  addCustomer() {
    this.submitted = true;
    if (this.customerForm.valid) {
      const naturalPerson = this.customerForm.get('naturalPerson')?.value ? 1 : 0;
      const sameCode = this.customerForm.get('sameCode')?.value ? 1 : 0;
      //RICHIESTA AL SERVER PER SALVARE IL NUOVO CLIENTE
      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'customer/customerInsert', {
        naturalPerson: naturalPerson,
        name: this.customerForm.get('name')?.value,
        surname: this.customerForm.get('surname')?.value,
        businessName: this.customerForm.get('businessName')?.value,
        fiscalcode: this.customerForm.get('fiscalcode')?.value,
        vat: this.customerForm.get('vat')?.value,
        country: this.customerForm.get('country')?.value,
        sameCode: sameCode
      })
        .subscribe((val: ApiResponse<{ id?: number, path: string, customerList?: { id: number, denomination: string, address: string }[] }>) => {
          if (val.code == 200) {
            if (val.data && val.data.id) {
              this.router.navigate([val.data.path, val.data.id])
            }
          }
          else {
            // CODE 244: WALLNET
            // if (val.data && val.data.customerList) {
            //   this.existingCustomerPopUp(val.data.customerList!);
            // }
          }
        })
    }
  }
  
  existingCustomerPopUp(customerList: { id: number, denomination: string, address: string }[]) {
    const dialogRef = this.dialog.open(ExistingCustomerPopupComponent, {
      maxWidth: '700px',
      minWidth: '350px',
      maxHeight: '500px',
      width: '90%',
      data: {
        
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        // SALVARE COMUNUE IL CLIENTE
      }
    });
  }

  private getCountries() {
    this.connectServerService.getRequestCountry().subscribe((val: any) => {
      if (val) {
        this.countriesList = val;
      }
    });
  }

}
