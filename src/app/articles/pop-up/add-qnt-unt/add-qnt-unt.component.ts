import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Connect } from '../../../classes/connect';
import { ApiResponse } from '../../../weco/interfaces/api-response';

@Component({
  selector: 'app-add-storage',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  templateUrl: './add-qnt-unt.component.html',
  styleUrl: './add-qnt-unt.component.scss'
})
export class AddQntUntComponent {

  submitted: boolean = false;
  generated: boolean = false;
  isSmall: boolean = false;
  idarticle: number = 0;
  management_type: number | null = null; // 0 = no SN no QNT, 1 = si SN no QNT, 2 = si SN si QNT

  generationForm = new FormGroup({
    unit_available: new FormControl<number | null>(null, Validators.required),
    qnt_available: new FormControl<number | null>(null),
    unit_taxablepurchase: new FormControl<string | null>(null, this.numberWithCommaValidator()),
    unit_taxablerecommended: new FormControl<string | null>(null, this.numberWithCommaValidator()),
    serialnumber: new FormControl<string | null>(null),
    vatrecommended: new FormControl<string | null>(null, this.integerRangeValidator()),
    vatpurchase: new FormControl<string | null>(null, this.integerRangeValidator()),
    pricerecommended: new FormControl<string | null>({ value: null, disabled: true }),
    pricepurchase: new FormControl<string | null>({ value: null, disabled: true })
  })

  serialNumberForm!: FormGroup;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  constructor(public dialogRef: MatDialogRef<AddQntUntComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    // Inizializza il form con i dati passati al dialog
    this.idarticle = data.idarticle;
    this.management_type = data.management_type;
    if (this.management_type != 0) {
      this.serialNumberForm = this.fb.group({
        articles: this.fb.array([])
      })
    }
  }

  ngOnInit(): void {
    this.updateWindowDimensions();
    this.initForm();
  }

  updateWindowDimensions() {
    if (window.innerWidth < 700) {
      this.isSmall = true;
    }
    else {
      this.isSmall = false;
    }
  }

  blockInvalidInput(event: KeyboardEvent) {
    const invalidChars = ['e', 'E', '+', '-'];
    if (invalidChars.includes(event.key)) {
      event.preventDefault();
    }
  }

  initForm() {
    this.generationForm.get('unit_taxablepurchase')?.valueChanges.subscribe((result) => {
      this.calculateTotal(this.generationForm.get('unit_taxablepurchase') as FormControl,
        this.generationForm.get('vatpurchase') as FormControl, this.generationForm.get('pricepurchase') as FormControl);
    });
    this.generationForm.get('unit_taxablerecommended')?.valueChanges.subscribe((result) => {
      this.calculateTotal(this.generationForm.get('unit_taxablerecommended') as FormControl,
        this.generationForm.get('vatrecommended') as FormControl, this.generationForm.get('pricerecommended') as FormControl);
    });
    this.generationForm.get('vatpurchase')?.valueChanges.subscribe((result) => {
      this.calculateTotal(this.generationForm.get('unit_taxablepurchase') as FormControl,
        this.generationForm.get('vatpurchase') as FormControl, this.generationForm.get('pricepurchase') as FormControl);
    });
    this.generationForm.get('vatrecommended')?.valueChanges.subscribe((result) => {
      this.calculateTotal(this.generationForm.get('unit_taxablerecommended') as FormControl,
        this.generationForm.get('vatrecommended') as FormControl, this.generationForm.get('pricerecommended') as FormControl);
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

  get articles(): FormArray {
    return this.serialNumberForm.get('articles') as FormArray;
  }

  createArticlesFormCompiled(article: any) {
    for (let i = 0; i < this.generationForm.get('unit_available')?.value!; i++) {
      const form = this.createArticle(article)
      this.articles.push(form);
      form.get('unit_taxablepurchase')?.valueChanges.subscribe((result) => {
        this.calculateTotal(form.get('unit_taxablepurchase') as FormControl,
          form.get('vatpurchase') as FormControl, form.get('pricepurchase') as FormControl);
      });
      form.get('unit_taxablerecommended')?.valueChanges.subscribe((result) => {
        this.calculateTotal(form.get('unit_taxablerecommended') as FormControl,
          form.get('vatrecommended') as FormControl, form.get('pricerecommended') as FormControl);
      });
      form.get('vatpurchase')?.valueChanges.subscribe((result) => {
        this.calculateTotal(form.get('unit_taxablepurchase') as FormControl,
          form.get('vatpurchase') as FormControl, form.get('pricepurchase') as FormControl);
      });
      form.get('vatrecommended')?.valueChanges.subscribe((result) => {
        this.calculateTotal(form.get('unit_taxablerecommended') as FormControl,
          form.get('vatrecommended') as FormControl, form.get('pricerecommended') as FormControl);
      });
    };
  }

  createArticle(article?: any) {
    return this.fb.group({
      serialnumber: [article.serialnumber || null],
      qnt_available: [article.qnt_available || null],
      unit_taxablepurchase: [article.unit_taxablepurchase || null, this.numberWithCommaValidator()],
      unit_taxablerecommended: [article.unit_taxablerecommended || null, this.numberWithCommaValidator()],
      vatpurchase: [article.vatpurchase || null, this.integerRangeValidator()],
      vatrecommended: [article.vatrecommended || null, this.integerRangeValidator()],
      pricepurchase: [{ value: article.pricepurchase || null, disabled: true }],
      pricerecommended: [{ value: article.pricerecommended || null, disabled: true }]
    })
  }

  generateArticles() {
    this.submitted = true;
    if (this.generationForm.valid) {
      this.generated = true;
      if (this.management_type != 0) {
        this.articles.controls.splice(0, this.articles.length);
        this.createArticlesFormCompiled(this.generationForm.getRawValue());
      }
      else {
        this.addUnits();
      }
    }
  }

  addUnits() {
    let lines: any[] = [];
    if (this.management_type == 0) {
      lines.push(this.generationForm.getRawValue());
    }
    else {
      lines = this.serialNumberForm.get('articles')?.getRawValue();
    }
    for(let i = 0; i < lines.length; i++) {
      lines[i].unit_taxablepurchase = parseFloat(lines[0].unit_taxablepurchase?.replace(',', '.') || null);
      lines[i].unit_taxablerecommended = parseFloat(lines[0].unit_taxablerecommended?.replace(',', '.') || null);
      lines[i].vatrecommended = parseFloat(lines[0].vatrecommended || null);
      lines[i].vatpurchase = parseFloat(lines[0].vatpurchase || null);
    }
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'articles/addArticlePrices',
      { idarticle: this.idarticle, lines: lines })
      .subscribe((val: ApiResponse<any>) => {
        this.dialogRef.close();
      })
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

  close() {
    this.dialogRef.close();
  }
}
