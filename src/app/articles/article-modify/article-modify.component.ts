import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MeasurementUnit } from '../../tickets/interfaces/article';
import { ConnectServerService } from '../../services/connect-server.service';
import { Connect } from '../../classes/connect';
import { ApiResponse } from '../../weco/interfaces/api-response';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Article } from '../interfaces/article';

@Component({
  selector: 'app-article-modify',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    TranslateModule
  ],
  templateUrl: './article-modify.component.html',
  styleUrl: './article-modify.component.scss'
})
export class ArticleModifyComponent {

  submitted: boolean = false;
  measurmentUnit: MeasurementUnit[] = [];
  article: Article | null = null;

  articleForm = new FormGroup({
    code: new FormControl<string | null>(null, Validators.required),
    title: new FormControl<string | null>(null, Validators.required),
    refidum: new FormControl<number | null>(null),
    description: new FormControl<string | null>(null),
    quantity: new FormControl<number | null>(null, [Validators.required, this.numberWithCommaValidator()])
  });

  constructor(private connectServerService: ConnectServerService) { }

  ngOnInit(): void {
    this.getArticle();
    this.initForm();
    this.getMeasurmentUnits();
  }

  private getArticle() {
    // const articles: Article =
    // {
    //   id: 6,
    //   code: "8745",
    //   article_data: {
    //     id: 48,
    //     title: "Prodotto D",
    //     description: "Descrizione del prodotto D.",
    //     refidum: 4,
    //   },
    //   article_price: {
    //     id: 5,
    //     taxablepurchase: 400.25,
    //     taxablesale: 450.75,
    //     serialnumber: "35467",
    //   }
    // };

    // return article;
  }

  private initForm() {
    this.articleForm.get('code')?.disable();
    this.articleForm.get('quantity')?.disable();
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

  private getMeasurmentUnits() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'infogeneral/unitOfMeasurements', {})
      .subscribe((val: ApiResponse<{ unitOfMeasurements: MeasurementUnit[] }>) => {
        if (val) {
          this.measurmentUnit = val.data.unitOfMeasurements;
        }
      })
  }

  updateArticle() { }

  historyPopUp() { }

}
