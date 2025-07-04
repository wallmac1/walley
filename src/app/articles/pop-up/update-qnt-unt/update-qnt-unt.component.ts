import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Connect } from '../../../classes/connect';
import { ApiResponse } from '../../../weco/interfaces/api-response';

@Component({
  selector: 'app-update-qnt-unt',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './update-qnt-unt.component.html',
  styleUrl: './update-qnt-unt.component.scss'
})
export class UpdateQntUntComponent {

  isSmall: boolean = false;
  submitted: boolean = false;
  management_type: number | null = null; // 0 = no SN no QNT, 1 = si SN no QNT, 2 = si SN si QNT
  idddt: number = 0;
  idarticlestorage: number = 0;
  idarticle: number = 0;

  modifyForm = new FormGroup({
    unit_available: new FormControl<number | null>({value: null, disabled: true}, Validators.required),
    //qnt_available: new FormControl<string | null>(null),
    serialnumber: new FormControl<string | null>(null),
    unit_taxablepurchase: new FormControl<string | null>(null, this.numberWithCommaValidator()),
    unit_taxablerecommended: new FormControl<string | null>(null, this.numberWithCommaValidator()),
    vatpurchase: new FormControl<string | null>(null, this.integerRangeValidator()),
    vatrecommended: new FormControl<string | null>(null, this.integerRangeValidator()),
    pricerecommended: new FormControl<string | null>({ value: null, disabled: true }),
    pricepurchase: new FormControl<string | null>({ value: null, disabled: true })
  })

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  constructor(public dialogRef: MatDialogRef<UpdateQntUntComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // Inizializza il form con i dati passati al dialog
    this.management_type = data.management_type;
    this.idddt = data.idddt;
    this.idarticle = data.idarticle;
    this.idarticlestorage = data.idarticlestorage;
    this.modifyForm.patchValue(data.article);
    this.modifyForm.get('unit_taxablepurchase')?.setValue(data.article.unit_taxablepurchase.replace('.', ','));
    this.modifyForm.get('unit_taxablerecommended')?.setValue(data.article.unit_taxablerecommended.replace('.', ','));
    this.modifyForm.get('vatpurchase')?.setValue(data.article.vatpurchase.split('.')[0]);
    this.modifyForm.get('vatrecommended')?.setValue(data.article.vatrecommended.split('.')[0]);
    this.modifyForm.get('pricepurchase')?.setValue(data.article.pricepurchase.replace('.', ','));
    this.modifyForm.get('pricerecommended')?.setValue(data.article.pricerecommended.replace('.', ','));
  }

  ngOnInit(): void {
    this.initForm();
    this.updateWindowDimensions();
  }

  updateWindowDimensions() {
    if (window.innerWidth < 767) {
      this.isSmall = true;
    }
    else {
      this.isSmall = false;
    }
  }

  initForm() {
    if(this.management_type == 0) {
      this.modifyForm.get('unit_available')?.enable();
    }
    this.modifyForm.get('unit_taxablepurchase')?.valueChanges.subscribe((result) => {
      this.calculateTotal(this.modifyForm.get('unit_taxablepurchase') as FormControl,
        this.modifyForm.get('vatpurchase') as FormControl, this.modifyForm.get('pricepurchase') as FormControl);
    });
    this.modifyForm.get('unit_taxablerecommended')?.valueChanges.subscribe((result) => {
      this.calculateTotal(this.modifyForm.get('unit_taxablerecommended') as FormControl,
        this.modifyForm.get('vatrecommended') as FormControl, this.modifyForm.get('pricerecommended') as FormControl);
    });
    this.modifyForm.get('vatpurchase')?.valueChanges.subscribe((result) => {
      this.calculateTotal(this.modifyForm.get('unit_taxablepurchase') as FormControl,
        this.modifyForm.get('vatpurchase') as FormControl, this.modifyForm.get('pricepurchase') as FormControl);
    });
    this.modifyForm.get('vatrecommended')?.valueChanges.subscribe((result) => {
      this.calculateTotal(this.modifyForm.get('unit_taxablerecommended') as FormControl,
        this.modifyForm.get('vatrecommended') as FormControl, this.modifyForm.get('pricerecommended') as FormControl);
    });
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

  integerRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      // Permetti null o stringa vuota per evitare errore a form iniziale
      if (value === null || value === '') return null;

      const parsed = Number(value);

      // Verifica se è un numero intero e compreso tra 0 e 100
      if (!Number.isInteger(parsed) || parsed < 0 || parsed > 100) {
        return { integerRangeInvalid: true };
      }

      return null;
    };
  }

  modifyUnit() {
    this.submitted = true;
    if (this.modifyForm.valid) {
      let article = this.modifyForm.getRawValue();
      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'articles/updateArticlePrices',
        { idddt: this.idddt, idarticle: this.idarticle, unit_available: article.unit_available, 
          unit_taxablepurchase: parseFloat(article.unit_taxablepurchase?.replace(',','.') || '0.00'), 
          unit_taxablerecommended: parseFloat(article.unit_taxablerecommended?.replace(',','.') || '0.00'),
          vatrecommended: parseInt(article.vatrecommended || '0'), vatpurchase: parseInt(article.vatpurchase || '0'), 
          pricerecommended: article.pricerecommended, idarticleprice: this.idarticlestorage,
          pricepurchase: article.pricepurchase, serialnumber: article.serialnumber })
        .subscribe((val: ApiResponse<any>) => {
          this.dialogRef.close(true);
        })
    }
  }

  blockInvalidInput(event: KeyboardEvent) {
    const invalidChars = ['e', 'E', '+', '-'];
    if (invalidChars.includes(event.key)) {
      event.preventDefault();
    }
  }

  calculateTotal(formControl: FormControl, vatControl: FormControl, resultControl: FormControl) {
    if (formControl.value != null && formControl.valid && vatControl.valid) {
      let resultVal = parseFloat(formControl.value.replace(',', '.'));
      if (vatControl.value != null && vatControl.value != '') {
        let vat = resultVal * parseInt(vatControl.value) / 100;
        resultVal = resultVal + vat;
      }
      resultControl.setValue(resultVal.toFixed(2).toString().replace(',', '.'))
    }
    else {
      resultControl.setValue('0,00');
    }
  }

  modifyArticle() {
    // CHIAMATA AL SERVER PER MODIFICARE L'ARTICOLO
    this.submitted = true;
    if (this.modifyForm.valid) {

      this.dialogRef.close();
    }
  }

  close() {
    this.dialogRef.close();
  }

}
