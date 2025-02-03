import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Country } from '../../../weco/interfaces/country';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Connect } from '../../../classes/connect';
import { ApiResponse } from '../../../weco/interfaces/api-response';

@Component({
  selector: 'app-bank-modify',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTooltipModule,
  ],
  templateUrl: './bank-modify.component.html',
  styleUrl: './bank-modify.component.scss'
})
export class BankModifyComponent {

  idbank: number = 0;
  countriesList: Country[] = [];
  isSmallScreen: boolean = false;
  submittedC: boolean = false;
  submittedS: boolean = false;
  bankName: string | null = null;
  bankAddress: string | null = null;
  ccn3: string | null = "380";

  bankForm = new FormGroup({
    active: new FormControl<boolean>(true),
    idcountry: new FormControl<number | null>(12, Validators.required),
    denomination: new FormControl<string | null>(null, Validators.required),
    iban: new FormControl<string | null>(null, [Validators.required, this.ibanValidator()]),
    bic: new FormControl<string | null>(null),
    acronym: new FormControl<number | null>({ value: null, disabled: true }),
    abi: new FormControl<string | null>({ value: null, disabled: true }),
    cab: new FormControl<string | null>({ value: null, disabled: true }),
    cc: new FormControl<string | null>({ value: null, disabled: true }),
    abi_info: new FormControl<string | null>(null),
    cab_info: new FormControl<string | null>(null)
  })

  constructor(private route: ActivatedRoute, private connectServerService: ConnectServerService,
    private router: Router) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.idbank = parseInt(id);
      }
    });
  }

  ngOnInit(): void {
    if (this.idbank > 0) {
      this.getBankInfo();
    }
    this.getCountries();
    this.updateWindowDimensions();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  updateWindowDimensions() {
    if (window.innerWidth < 576) {
      this.isSmallScreen = true;
    }
    else {
      this.isSmallScreen = false;
    }
  }

  goBack() {
    this.router.navigate(['bankList'])
  }

  getBankInfo() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'bank/bankInfo', { idbank: this.idbank })
      .subscribe((val: ApiResponse<any>) => {
        if (val) {
          this.bankForm.patchValue(val.data.bankInfo);
          this.bankForm.get('abi')?.setValue(val.data.bankInfo.abi.code);
          this.bankName = val.data.bankInfo.abi.description;
          this.bankForm.get('cab')?.setValue(val.data.bankInfo.cab.code);
          this.bankAddress = val.data.bankInfo.cab.description;
          this.bankForm.get('active')?.setValue(val.data.bankInfo.obsolete == 1 ? false : true);
          this.ccn3 = this.countriesList.find(country => country.id == val.data.bankInfo.idcountry)?.ccn3 || null;
          this.bankForm.get('acronym')?.setValue(val.data.bankInfo.idcountry);
          if (this.ccn3 = '380') {
            this.submittedC = true;
          }
        }
      })
  }

  getCountries() {
    this.connectServerService.getRequestCountry().subscribe((val: any) => {
      if (val) {
        this.countriesList = val;
      }
    });
  }

  ibanValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const iban: string = control.value;
      if (this.bankForm && this.ccn3 == "380") {
        if (!iban) {
          return { invalidIban: true };
        }
        if (iban.length !== 27) {
          return { invalidLength: true };
        }
        // Usa una regex per verificare la struttura: IT + 1 lettera + 5 cifre + 5 cifre + 12 cifre
        const ibanPattern = /^IT\d{2}[A-Z]\d{5}\d{5}\d{12}$/;
        if (!ibanPattern.test(iban)) {
          return { invalidFormat: true };
        }
        // Se tutto è corretto, il controllo è valido
        console.log("Iban e Nazione Corretta")
        return null;
      }
      else {
        return null;
      }
    }
  }

  checkIban() {
    this.submittedC = true;
    this.ibanValidator();
    const iban = this.bankForm.get('iban')
    if (iban?.valid) {
      const abi = iban.value?.substring(5, 10);  // ABI (5 cifre)
      const cab = iban.value?.substring(10, 15); // CAB (5 cifre)
      const cc = iban.value?.substring(15, 27);  // Conto Corrente (12 cifre)
      this.bankForm.patchValue({ abi, cab, cc });
      this.ibanCheckServer();
    }
  }

  ibanCheckServer() {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'bank/abiCabCheck',
      { abi: this.bankForm.get('abi')?.value, cab: this.bankForm.get('cab')?.value })
      .subscribe((val: ApiResponse<any>) => {
        if (val) {
          this.bankAddress = val.data.cab;
          this.bankName = val.data.abi;
        }
      })
  }

  checkSubmitted() {
    if (this.submittedC == true) {
      this.submittedC = false;
      this.bankAddress = null;
      this.bankName = null;
    }
  }

  saveBank() {
    this.submittedS = true;
    if (this.bankForm.valid) {
      console.log("QUI")
      const acronym = this.countriesList.find(country => country.id == this.bankForm.get('acronym')?.value)?.cca2;
      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'bank/bankStoreOrUpdate',
        {
          idbank: this.idbank, denomination: this.bankForm.get('denomination')?.value,
          iban: this.bankForm.get('iban')?.value, obsolete: this.bankForm.get('active')?.value ? 0 : 1,
          bic: this.bankForm.get('bic')?.value || null, acronym: acronym,
          abi: this.bankForm.get('abi')?.value || null, cab: this.bankForm.get('cab')?.value || null,
          cc: this.bankForm.get('cc')?.value || null, idcountry: this.bankForm.get('idcountry')?.value || null
        })
        .subscribe((val: ApiResponse<any>) => {
          if (val.data) {
            if (this.idbank == 0) {
              this.router.navigate(['bankModify', val.data.idbank]);
            }
          }
        })
    }
  }

  selectedCountry() {
    const control = this.bankForm.get('iban');
    this.bankForm.get('acronym')?.setValue(this.bankForm.get('idcountry')?.value || null);
    this.ccn3 = this.countriesList.find(country => country.id == this.bankForm.get('idcountry')?.value)?.ccn3 || null;
    if (this.ccn3 != '380') {
      if (control) {
        const currentValidators = control.validator ? [Validators.required] : [];
        control.setValidators(currentValidators);
        control.updateValueAndValidity();
      }
    }
    else {
      if (control) {
        control.setValidators([Validators.required, this.ibanValidator()]);
        control.updateValueAndValidity();
      }
    }
  }

}
