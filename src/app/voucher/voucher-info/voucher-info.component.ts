import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { VoucherWorkComponent } from "../voucher-work/voucher-work.component";
import { VoucherArticleComponent } from "../voucher-article/voucher-article.component";
import { Voucher } from '../interfaces/voucher';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, debounceTime, filter, map, of, startWith, switchMap } from 'rxjs';
import { Customer } from '../../tickets/interfaces/customer';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ApiResponse } from '../../weco/interfaces/api-response';
import { Connect } from '../../classes/connect';
import { ConnectServerService } from '../../services/connect-server.service';
import { Work } from '../../tickets/interfaces/work';
import { Lines } from '../interfaces/lines';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-voucher-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    VoucherWorkComponent,
    VoucherArticleComponent,
    MatAutocompleteModule,
    TranslateModule
  ],
  templateUrl: './voucher-info.component.html',
  styleUrl: './voucher-info.component.scss'
})
export class VoucherInfoComponent {

  filteredCustomer$!: Observable<Customer[]>;
  submitted: boolean = false;

  voucher: Voucher | null = null;
  voucherId: number = 0;
  lines: Lines[] = [];
  linesForm!: FormGroup;

  voucherForm = new FormGroup({
    progressive: new FormControl<string | null>({value: null, disabled: true}, Validators.required),
    voucher_date: new FormControl<string | null>({value: null, disabled: true}, Validators.required),
    customer: new FormControl<Customer | null>(null, Validators.required),
    location: new FormControl<string | null>(null, Validators.required),
    note: new FormControl<string | null>(null),
  })

  constructor(private route: ActivatedRoute, private connectServerService: ConnectServerService,
    private fb: FormBuilder) { 
      this.linesForm = this.fb.group({
        lines: this.fb.array([])
      })
    }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.voucherId = +id;
        this.getVoucher();
        this.getLines();
      }
    });
    this.searchCustomer();
  }

  numberWithCommaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
  
      if (!value) {
        return null; // Se il campo è vuoto, consideralo valido
      }
  
      // Controlla se il valore soddisfa i criteri
      const regex = /^\d*(,\d{0,2})?$/; // Regex: numeri con al massimo una virgola e due cifre dopo di essa
      const isValid = regex.test(value);
  
      return isValid ? null : { invalidNumber: true }; // Restituisci l'errore se non valido
    };
  }

  get linesArray(): FormArray {
    return this.linesForm.get('lines') as FormArray;
  }

  getLine(index: number): FormGroup {
    return this.linesArray.at(index) as FormGroup;
  }

  addLines() {
    this.linesArray.clear();
    this.lines.forEach((line: Lines) => {
      console.log("AGGIUNGI LINEA")
      this.linesArray.push(this.createLine(line))
    })
  }

  addLine(type: number) {
    this.linesArray.insert(0, this.createLineEmpty(type));
  }

  private createLine(line: Lines): FormGroup {
    return this.fb.group({
      id: [line.id],
      type_line: [line.type_line],
      description: [line.description],
      quantity: [line.quantity, [this.numberWithCommaValidator(), Validators.required]],
      refidunit: [line.refidunit, Validators.required]
    })
  }

  private createLineEmpty(type: number): FormGroup {
    return this.fb.group({
      id: [0],
      type_line: [type],
      description: [null],
      quantity: [null, [this.numberWithCommaValidator(), Validators.required]],
      refidunit: [null, Validators.required]
    })
  }

  deleteLine(i: number) {
    this.linesArray.removeAt(i);
  }

  saveLine(i: number) {
    // Chiama il server e salva la linea specifica
    console.log(this.linesArray.at(i).value);
  }

  displayCustomerName(customer?: Customer): string {
    return customer ? customer.denomination : '';
  }

  private getVoucher() {
    // CHIAMATA AL SERVER PER PRENDERE IL VOUCHER
    this.voucher = {
      id: 1,
      progressive: '001',
      status: 'Active',
      voucher_year: '2024',
      voucher_date: '2024-11-27',
      location: 'Rome',
      location_field: 'Cantiere',
      customer: {
        rifidanacliforprodati: 12345,
        id: 1,
        denomination: 'ACME Corporation'
      },
      note: 'Something about the voucher'
    };
    this.voucherId = this.voucher.id;
    this.voucherForm.patchValue(this.voucher);
    this.getLines();
  }

  private getLines() {
    // CHIAMATA AL SERVER PER PRENDERE I LAVORI E GLI ARTICOLI
    this.lines = [
      {
        id: 1,
        type_line: 1,
        description: 'General description of the work or article',
        quantity: "10",
        refidunit: 1,
        user_created: {
          id: 101,
          nickname: "worker_01",
          datetime: "2024-11-27T10:30:00Z"
        },
        user_updated: {
          id: 102,
          nickname: "manager_01",
          datetime: "2024-11-28T15:45:00Z"
        }
      },
      {
        id: 2,
        type_line: 2,
        description: 'General description of the work or article',
        quantity: "25",
        refidunit: 2,
        user_created: {
          id: 103,
          nickname: "worker_02",
          datetime: "2024-11-26T09:20:00Z"
        },
        user_updated: {
          id: 104,
          nickname: "manager_02",
          datetime: "2024-11-27T14:10:00Z"
        }
      },
      {
        id: 3,
        type_line: 1,
        description: 'General description of the work or article',
        quantity: "5",
        refidunit: 1,
        user_created: {
          id: 105,
          nickname: "worker_03",
          datetime: "2024-11-25T08:00:00Z"
        },
        user_updated: {
          id: 106,
          nickname: "manager_03",
          datetime: "2024-11-26T12:30:00Z"
        }
      }
    ];
    if (this.lines.length > 0) {
      this.addLines();
    }
  }

  // private filterLines(lines: Lines[]) {
  //   if(lines.length > 0) {
  //     this.works = lines.filter(line => line.type_line === 1); // Lavori
  //     this.articles = lines.filter(line => line.type_line === 2); // Articoli
  //   }
    
  // }

  private searchCustomer() {
    const customer_field = this.voucherForm.get('customer');
    if (customer_field) {
      this.filteredCustomer$ = customer_field.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value?.denomination || ''),
          filter(value => value.length > 0),
          debounceTime(600),
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
        denomination: 'ACME Corporation'
      },
      {
        rifidanacliforprodati: 67890,
        id: 2,
        denomination: 'Global Solutions'
      },
      {
        rifidanacliforprodati: 11223,
        id: 3,
        denomination: 'Tech Innovations'
      }
    ];

    // Restituisce la lista come Observable
    return of(customers);
  }

  addWork() {
    this.addLine(1);
  }

  addArticle() {
    this.addLine(2);
  }

  createVoucher() {
    
  }

  saveVoucher() {

  }

}
