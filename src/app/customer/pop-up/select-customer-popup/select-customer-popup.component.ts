import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { Connect } from '../../../classes/connect';
import { ApiResponse } from '../../../weco/interfaces/api-response';
import { AutocompleteCustomer } from '../../interfaces/autocomplete-customer';
import { PaymentData } from '../../interfaces/payment-data';

@Component({
  selector: 'app-select-customer-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTooltipModule,
    MatExpansionModule,
    MatDialogModule,
    MatAutocompleteModule
  ],
  templateUrl: './select-customer-popup.component.html',
  styleUrl: './select-customer-popup.component.scss'
})
export class SelectCustomerPopupComponent {

  filteredCustomer$!: Observable<AutocompleteCustomer[]>;
  paymentMethod: PaymentData | null = null;
  submitted: boolean = false;

  customerForm = new FormGroup({
    customer: new FormControl<AutocompleteCustomer | null>(null, this.customerValidator())
  })

  constructor(public dialogRef: MatDialogRef<SelectCustomerPopupComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.searchCustomer();
  }

  customerValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if(value && typeof value === 'object' &&
        'fiscalcode' in value && typeof value.fiscalcode === 'string' &&
        'denomination' in value && typeof value.denomination === 'string') {
          return null;
      }
      else {
        return { invalidCustomer: true };
      }
    };
  }

  displayCustomerName(customer?: AutocompleteCustomer): string {
    return customer ? customer.denomination! : '';
  }

  private searchCustomer() {
    const customer_field = this.customerForm.get('customer');
    if (customer_field) {
      this.filteredCustomer$ = customer_field.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value?.denomination?.toLowerCase() || ''),
          filter(value => value.length > 0),
          debounceTime(400),
          switchMap((value: string) =>
            value ? this.getCustomers(value) : [])
        );
    }
  }

  private getCustomers(val: string): Observable<AutocompleteCustomer[]> {
    return this.connectServerService.getRequest<ApiResponse<any>>(Connect.urlServerLaraApi, 'customer/searchCustomer',
      {
        type: 0,
        query: val
      })
  }

  getPaymentData() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'customer/paymentFavorite', 
      { idregistry: this.customerForm.get('customer')?.value?.idregistry })
      .subscribe((val) => {
        if (val.data) {
          this.paymentMethod = val.data.paymentData;
          this.dialogRef.close({customer: this.customerForm.value.customer, paymentMethod: this.paymentMethod});
        }
      })
  }

  confirm() {
    this.submitted = true;
    if (this.customerForm.valid) {
      this.getPaymentData();
    }
  }

  close() {
    this.dialogRef.close(null);
  }
}
