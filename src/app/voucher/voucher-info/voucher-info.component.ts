import { CommonModule } from '@angular/common';
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
import { Work } from '../../tickets/interfaces/work';
import { Lines } from '../interfaces/lines';
import { TranslateModule } from '@ngx-translate/core';
import { Line } from 'ngx-extended-pdf-viewer';

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

  currentDate = new Date();

  voucher_label: { voucher_labelreference: string, voucher_labellocation: string } = {
    voucher_labelreference: 'Riferimento Documento',
    voucher_labellocation: 'Luogo'
  }

  filteredCustomer$!: Observable<Customer[]>;
  submitted: boolean = false;

  voucher: Voucher | null = null;
  voucherId: number = 0;
  //lines: Lines[] = [];
  linesForm!: FormGroup;

  voucherForm = new FormGroup({
    progressive: new FormControl<string | null>({ value: null, disabled: true }, Validators.required),
    voucher_date: new FormControl<string | null>({ value: null, disabled: true }, Validators.required),
    customer: new FormControl<Customer | null>(null, Validators.required),
    location: new FormControl<string | null>(null, Validators.required),
    note: new FormControl<string | null>(null),
    reference: new FormControl<string | null>(null),
  })

  constructor(private route: ActivatedRoute, private connectServerService: ConnectServerService,
    private fb: FormBuilder, private router: Router) {
    this.linesForm = this.fb.group({
      lines: this.fb.array([])
    })
  }

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
    const day = String(this.currentDate.getDate()).padStart(2, '0'); // Giorno con due cifre
    const month = String(this.currentDate.getMonth() + 1).padStart(2, '0'); // Mese con due cifre (i mesi partono da 0)
    const year = String(this.currentDate.getFullYear()).slice(-2); // Ultime due cifre dell'anno
    const formattedDate = `${day}-${month}-${year}`;

    this.voucher = {
      id: 0,
      progressive: '',
      status: {
        id: 0,
        name: '',
        color: ''
      },
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

  addLines(lines: Lines[]) {
    this.linesArray.clear();
    lines.forEach((line: Lines) => {
      line.quantity = line.quantity.replace('.', ',');
      this.linesArray.push(this.createLine(line))
    })
  }

  addLine(type: number) {
    this.linesArray.insert(0, this.createLineEmpty(type));
  }

  private createLine(line: Lines): FormGroup {
    return this.fb.group({
      idvoucherline: [line.idvoucherline],
      type_line: [line.type_line],
      description: [line.description, Validators.required],
      quantity: [line.quantity, [this.numberWithCommaValidator(), Validators.required]],
      refidum: [line.refidum, Validators.required]
    })
  }

  private createLineEmpty(type: number): FormGroup {
    return this.fb.group({
      idvoucherline: [0],
      type_line: [type],
      description: [null, Validators.required],
      quantity: [null, [this.numberWithCommaValidator(), Validators.required]],
      refidum: [null, Validators.required]
    })
  }

  deleteLine(i: number) {
    const line = this.linesArray.at(i).getRawValue();
    if(line.idvoucherline != 0) {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'voucher/deleteVoucherLine', 
      { idvoucher: this.voucherId, idvoucherline: line.idvoucherline })
        .subscribe((val: ApiResponse<any>) => {
          if(val) {
            this.linesArray.removeAt(i)
          }
        })
    }
    else {
      this.linesArray.removeAt(i)
    }
  }

  saveLine(index: number) {
    // Chiama il server e salva la linea specifica
    const line = this.linesArray.at(index).getRawValue();
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'voucher/saveVoucherLine', 
      { idvoucher: this.voucherId, idvoucherline: line.idvoucherline, quantity: parseFloat(line.quantity), 
        type_line: line.type_line, description: line.description, refidum: line.refidum})
        .subscribe((val: ApiResponse<any>) => {
          if(val) {
            if(val.data && val.data.idvoucherline) {
              this.linesArray.at(index).get('idvoucherline')?.setValue(val.data.idvoucherline);
            }
            this.getLineServer(this.linesArray.at(index).get('idvoucherline')!.value, index);
          }
        })
  }

  getLineServer(idvoucherline: number, index: number) {
    //voucherLineInfo
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'voucher/voucherLineInfo', {
      idvoucher: this.voucherId, idvoucherline: idvoucherline})
        .subscribe((val: ApiResponse<any>) => {
          if(val) {
            let line = val.data.voucherInfoLine;
            line.quantity = line.quantity.replace('.', ',');
            this.linesArray.at(index).patchValue(line);
          }
        })
  }

  saveVoucher() {
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
          if(this.voucherId == 0) {
            this.voucherId = val.data.idvoucher;
          }
          this.getVoucher();
        }
      })
  }

  private getVoucher() {
    // CHIAMATA AL SERVER PER PRENDERE IL VOUCHER
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'voucher/voucherInfo', { id: this.voucherId })
      .subscribe((val: ApiResponse<any>) => {
        if (val) {
          this.voucher = val.data.voucherInfo;
          this.voucherForm.patchValue(this.voucher!);
          this.addLines(val.data.voucherInfoLine);
        }
      })
  }

  deleteVoucher() {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'voucher/deleteVoucher', {id: this.voucherId})
      .subscribe((val: ApiResponse<any>) => {
        if(val) {
          this.router.navigate(['voucherList']);
        }
      })
  }

  closeVoucher() {
    this.router.navigate(['voucherList']);
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
    this.addLine(1);
  }

  addArticle() {
    this.addLine(2);
  }

}
