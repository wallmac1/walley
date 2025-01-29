import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Customer } from '../../../tickets/interfaces/customer';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';

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

  filteredCustomer$!: Observable<Customer[]>;
  submitted: boolean = false;

  customerForm = new FormGroup({
    customer: new FormControl<Customer | null>(null, this.customerValidator())
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
        'id' in value && typeof value.id === 'number') {
          return null;
      }
      else {
        return { invalidCustomer: true };
      }
    };
  }

  displayCustomerName(customer?: Customer): string {
    return customer ? customer.denominazione! : '';
  }

  // private filterLines(lines: Lines[]) {
  //   if(lines.length > 0) {
  //     this.works = lines.filter(line => line.type_line === 1); // Lavori
  //     this.articles = lines.filter(line => line.type_line === 2); // Articoli
  //   }
  // }

  private searchCustomer() {
    const customer_field = this.customerForm.get('customer');
    if (customer_field) {
      this.filteredCustomer$ = customer_field.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value?.denominazione?.toLowerCase() || ''),
          filter(value => value.length > 0),
          debounceTime(400),
          switchMap((value: string) =>
            value ? this.getCustomers(value) : [])
        );
    }
  }

  private getCustomers(val: string): Observable<Customer[]> {
    // CHIAMATA AL SERVER
    // return this.connectServerService.getRequest<ApiResponse<{ city: Customer[] }>>(Connect.urlServerLaraApi, 'cities',
    //   {
    //     query: val
    //   }).pipe(
    //     map(response => response.data.cities)
    //   );
    // Esempio di una lista di tre clienti
    const customers: Customer[] = [
      {
        rifidanacliforprodati: 12345,
        id: 1,
        denominazione: "Pippo Poppo",
        codicefiscale: "123A",
        cognome: "Rossi",
        data_nascita: "1985-05-20",
        email: "mario.rossi@example.com",
        nome: "Mario",
        piva: "IT98765432109",
        telefono: "+39 055 123456",
        type: "Azienda",
        address: "Via Roma",
        pec: "info@wallnet.it",
        sdi: "ABC1234",
        cap: "50100",
        city: "Firenze",
        house_number: "25A",
        country: "Italia",
        region: "Firenze"
      },
      {
        rifidanacliforprodati: 12345,
        id: 1,
        denominazione: "Wallnet snc di Banchi Leonardo e Andrea Margheri",
        codicefiscale: "123A",
        cognome: "Rossi",
        data_nascita: "1985-05-20",
        email: "mario.rossi@example.com",
        nome: "Mario",
        piva: "IT98765432109",
        telefono: "+39 055 123456",
        type: "Azienda",
        address: "Via Roma",
        pec: "info@wallnet.it",
        sdi: "ABC1234",
        cap: "50100",
        city: "Firenze",
        house_number: "25A",
        country: "Italia",
        region: "Firenze"
      }
    ];

    // Restituisce la lista come Observable
    return of(customers.filter(customer =>
      customer.denominazione?.toLowerCase().includes(val.toLowerCase())
    ));
  }

  confirm() {
    this.submitted = true;
    if (this.customerForm.valid) {
      this.dialogRef.close(this.customerForm.value.customer);
    }
  }

  close() {
    this.dialogRef.close(null);
  }
}
