import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Country } from '../../../weco/interfaces/country';
import { ConnectServerService } from '../../../services/connect-server.service';
import { BankListComponent } from "../bank-list/bank-list.component";

@Component({
  selector: 'app-bank-modify',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTooltipModule,
    BankListComponent
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

  bankForm = new FormGroup({
    active: new FormControl<number>(1),
    ccn3: new FormControl<number | null>(null, Validators.required),
    denomination: new FormControl<string | null>(null, Validators.required),
    iban: new FormControl<string | null>(null, [Validators.required, this.ibanValidator()]),
    bic: new FormControl<string | null>(null),
    acronym: new FormControl<number | null>({value: null, disabled: true}),
    abi: new FormControl<string | null>({value: null, disabled: true}),
    cab: new FormControl<string | null>({value: null, disabled: true}),
    cc: new FormControl<string | null>({value: null, disabled: true}),
    abi_info: new FormControl<string | null>(null),
    cab_info: new FormControl<string | null>(null)
  })

  constructor(private route: ActivatedRoute, private connectServerService: ConnectServerService) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.idbank = parseInt(id);
        // chiamata al server per prendere l'oggetto
      }
    });
  }

  ngOnInit(): void {
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

  // initForm() {
  //   this.bankForm.get('abi')?.disable();
  //   this.bankForm.get('cab')?.disable();
  //   this.bankForm.get('cc')?.disable();
  //   this.bankForm.get('acronym')?.disable();
  // }

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
      if (this.bankForm && this.bankForm.get('ccn3')?.value == 380) {
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
      // INVIA AL SERVER L'IBAN
    }
  }

  checkSubmitted() {
    if(this.submittedC == true) {
      this.submittedC = false;
      this.bankAddress = null;
      this.bankName = null;
    }
  }

  saveBank() {
    this.submittedS = true;
    if(this.bankForm.valid) {
      // INVIARE AL SERVER
    }
  }

  selectedCountry() {
    const control = this.bankForm.get('iban');
    if (this.bankForm.get('ccn3')?.value != 380) {
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
