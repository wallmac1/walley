import { CommonModule, NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { VoucherWorkComponent } from "../voucher-work/voucher-work.component";
import { VoucherArticleComponent } from "../voucher-article/voucher-article.component";
import { Voucher } from '../interfaces/voucher';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, debounceTime, filter, map, of, startWith, switchMap } from 'rxjs';
import { Customer } from '../../tickets/interfaces/customer';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ApiResponse } from '../../weco/interfaces/api-response';
import { Connect } from '../../classes/connect';
import { ConnectServerService } from '../../services/connect-server.service';
import { Lines } from '../interfaces/lines';
import { TranslateModule } from '@ngx-translate/core';
import { Status } from '../interfaces/status';
import { Line } from 'ngx-extended-pdf-viewer';
import { STRING_TYPE } from '@angular/compiler';
import { LineFile } from '../interfaces/line-file';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-voucher-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    VoucherWorkComponent,
    VoucherArticleComponent,
    MatAutocompleteModule,
    TranslateModule,
    MatAccordion
  ],
  templateUrl: './voucher-info.component.html',
  styleUrl: './voucher-info.component.scss'
})
export class VoucherInfoComponent {

  isDisabled = true;
  voucherStatus: Status | null = null;
  currentDate = new Date();
  attachments: { files: LineFile[] }[] = [];

  voucher_label: { voucher_labelreference: string, voucher_labellocation: string } = {
    voucher_labelreference: 'Riferimento Documento',
    voucher_labellocation: 'Luogo'
  }

  filteredCustomer$!: Observable<Customer[]>;
  submitted: boolean = false;
  voucher: Voucher | null = null;
  voucherId: number = 0;
  lines: Lines[] = [];
  //linesForm!: FormGroup;

  voucherForm = new FormGroup({
    progressive: new FormControl<string | null>({ value: null, disabled: true }, Validators.required),
    voucher_date: new FormControl<string | null>({ value: null, disabled: true }, Validators.required),
    customer: new FormControl<Customer | null>(null, [this.customerValidator()]),
    location: new FormControl<string | null>(null, Validators.required),
    note: new FormControl<string | null>(null),
    reference: new FormControl<string | null>(null),
  })

  constructor(private route: ActivatedRoute, private connectServerService: ConnectServerService,
    private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id && parseInt(id) != 0) {
        this.voucherId = +id;
        this.getVoucher();
      }
      else {
        this.emptyVoucherInit();
      }
    });
    this.searchCustomer();
  }

  emptyVoucherInit() {
    this.isDisabled = false;
    const day = String(this.currentDate.getDate()).padStart(2, '0'); // Giorno con due cifre
    const month = String(this.currentDate.getMonth() + 1).padStart(2, '0'); // Mese con due cifre (i mesi partono da 0)
    const year = String(this.currentDate.getFullYear()).slice(-2); // Ultime due cifre dell'anno
    const formattedDate = `${day}-${month}-${year}`;

    this.voucher = {
      id: 0,
      progressive: '',
      voucher_year: this.currentDate.getFullYear().toString(),
      voucher_date: formattedDate,
      reference: '',
      location: '',
      note: '',
      customer: {
        id: 0,
        rifidanacliforprodati: 0,
        denominazione: '',
      },
    }

    this.voucherForm.patchValue(this.voucher!);
  }

  customerValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const customer = control.value;

      // Condizione unica combinata
      if (!customer || typeof customer === 'string' || !(customer.id > 0)) {
        return { invalidCustomer: true }; // Errore generico
      }

      return null; // Valido
    };
  }

  getLineServer(idvoucherline: number, index: number) {
    //voucherLineInfo
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'voucher/voucherLineInfo', {
      idvoucher: this.voucherId, idvoucherline: idvoucherline
    })
      .subscribe((val: ApiResponse<any>) => {
        if (val) {
          console.log(val.data.voucherInfoLine);
          this.lines[index] = val.data.voucherInfoLine;
        }
      })
  }

  saveVoucher() {
    console.log(this.voucherForm.get('customer')?.value);
    this.submitted = true;
    if (this.voucherForm.get('customer')?.valid) {
      const formValues = this.voucherForm.getRawValue();
      let refidregcussuppro = 0;
      let refidregcussupprodata = 0;
      refidregcussuppro = formValues.customer!.id!;
      refidregcussupprodata = formValues.customer!.rifidanacliforprodati!;

      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'voucher/saveVoucher',
        {
          refidregcussuppro: refidregcussuppro, refidregcussupprodata: refidregcussupprodata, location: formValues.location,
          note: formValues.note, reference: formValues.reference, id: this.voucherId
        })
        .subscribe((val: ApiResponse<any>) => {
          if (val) {
            if (this.voucherId == 0) {
              this.voucherId = val.data.idvoucher;
              this.router.navigate(['voucher', this.voucherId])
            }
          }
        })
    }
  }

  private getVoucher() {
    // CHIAMATA AL SERVER PER PRENDERE IL VOUCHER
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'voucher/voucherInfo', { id: this.voucherId })
      .subscribe((val: ApiResponse<any>) => {
        if (val) {
          this.voucher = val.data.voucherInfo;
          this.voucherForm.patchValue(this.voucher!);
          this.voucherStatus = val.data.voucherStatus;
          if (this.voucherStatus?.id == 40) {
            this.isDisabled = true;
          }
          else {
            this.isDisabled = false;
          }
          this.lines = val.data.voucherInfoLine;
        }
      })
  }

  deleteVoucher() {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'voucher/deleteVoucher', { id: this.voucherId })
      .subscribe((val: ApiResponse<any>) => {
        if (val) {
          this.router.navigate(['voucherList']);
        }
      })
  }

  goBack() {
    this.router.navigate(['voucherList']);
  }

  changeStatus(action: number) {
    let idstatusvoucher = 0;
    if (this.voucherStatus?.id == 10 && action == 1) {
      idstatusvoucher = 20;
    }
    else if (this.voucherStatus?.id == 20 && action == 2) {
      idstatusvoucher = 10;
    }
    else if (this.voucherStatus?.id == 20 && action == 3) {
      idstatusvoucher = 30;
    }
    else if (this.voucherStatus?.id == 30) {
      idstatusvoucher = 40;
    }
    //Cambia Stato
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'voucher/changeStatusVoucher',
      { idvoucher: this.voucherId, idstatusvoucher: idstatusvoucher })
      .subscribe((val: any) => {
        if (val) {
          this.getVoucher();
        }
      })
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
    const customer_field = this.voucherForm.get('customer');
    if (customer_field) {
      this.filteredCustomer$ = customer_field.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value?.denominazione || ''),
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
        rifidanacliforprodati: 39,
        id: 88,
        denominazione: 'Pippo Poppo',
        codicefiscale: "23323NLDSKNSDNKL",
        cognome: "poppo",
        data_nascita: null,
        email: null,
        nome: "Pippo",
        piva: null,
        telefono: null
      },
    ];

    // Restituisce la lista come Observable
    return of(customers);
  }

  addWork() {
    const line = {
      idvoucherline: 0,
      type_line: 1,
      description: '',
      hours: null,
      minutes: null,
      quantity: '0,00',
      attachments: [],
      user_created: {
        id: 0,
        nickname: '',
        datetime: '',
      },
      user_updated: {
        id: 0,
        nickname: '',
        datetime: '',
      },
    };

    this.lines.unshift(line);
  }

  addArticle() {
    const line = {
      idvoucherline: 0,
      type_line: 2,
      description: '',
      code: '',
      title: '',
      quantity: '0,00',
      refidum: null,
      refidarticle: null,
      refidarticledata: null,
      refidarticleprice: null,
      serialnumber: 0,
      taxablepurchase: '0,00',
      taxablesale: '0,00',
      attachments: [],
      user_created: {
        id: 0,
        nickname: '',
        datetime: '',
      },
      user_updated: {
        id: 0,
        nickname: '',
        datetime: '',
      },
    }

    this.lines.unshift(line);
  }

  deleteLine(event: {index: number, id: number}) {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'voucher/deleteVoucherLine', { idvoucherline: event.id, idvoucher: this.voucherId })
      .subscribe((val: ApiResponse<any>) => {
        if (val) {
          this.lines.splice(event.index, 1);
        }
      });
  }

  saveLine(event: {index: number, line: Lines}) {
      // Chiama il server e salva la linea specifica
      // this.lines[index] = line;
      const line_copy = JSON.parse(JSON.stringify(event.line));
      line_copy.idvoucher = this.voucherId;
      if (line_copy.type_line == 1) {
        line_copy.quantity = null;
        line_copy.title = null;
        line_copy.refidum = null;
        line_copy.taxablepurchase = null;
        line_copy.taxablesale = null;
        line_copy.refidarticle = null;
        line_copy.refidarticledata = null;
        line_copy.refidarticleprice = null;
      } else {
        line_copy.quantity = parseFloat(line_copy.quantity.replace(',', '.'));
        line_copy.taxablepurchase = line_copy.taxablepurchase != null ? parseFloat(line_copy.taxablepurchase.replace(',', '.')) : null;
        line_copy.taxablesale = line_copy.taxablesale != null ? parseFloat(line_copy.taxablesale.replace(',', '.')) : null;
        line_copy.minutes = null;
        line_copy.hours = null;
      }
      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'voucher/saveVoucherLine',
        { obj_line: line_copy })
        .subscribe((val: ApiResponse<any>) => {
          if (val) {
            if (val.data && val.data.idvoucherline) {
              this.lines[event.index].idvoucherline = val.data.idvoucherline;
            }
            this.getLineServer(this.lines[event.index].idvoucherline, event.index);
          }
        })
    }

}
