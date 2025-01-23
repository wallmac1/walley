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
import { MatTabsModule } from '@angular/material/tabs';
import { ArticleStorageComponent } from "../article-storage/article-storage.component";
import { ArticleTaxableComponent } from "../article-taxable/article-taxable.component";
import { ArticleHistoryComponent } from "../article-history/article-history.component";
import { MatDialog } from '@angular/material/dialog';
import { HistoricComponent } from '../pop-up/historic/historic.component';
import { ConfirmComponent } from '../pop-up/confirm/confirm.component';
import { UpdateQuantityComponent } from '../pop-up/update-quantity/update-quantity.component';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-article-modify',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    TranslateModule,
    MatTabsModule,
    ArticleStorageComponent,
    ArticleTaxableComponent,
    ArticleHistoryComponent
  ],
  templateUrl: './article-modify.component.html',
  styleUrl: './article-modify.component.scss'
})
export class ArticleModifyComponent {

  submitted: boolean = false;
  measurmentUnit: MeasurementUnit[] = [];
  article: Article | null = null;
  selectedTabIndex = 0;
  idarticle: number = 0;

  articleForm = new FormGroup({
    code: new FormControl<string | null>(null, Validators.required),
    title: new FormControl<string | null>(null, Validators.required),
    refidum: new FormControl<number | null>(null),
    description: new FormControl<string | null>(null),
    quantity: new FormControl<string | null>(null, [Validators.required, this.numberWithCommaValidator()])
  });

  constructor(private connectServerService: ConnectServerService, public dialog: MatDialog, private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.idarticle = parseInt(id);
      }
    });
  }

  ngOnInit(): void {
    this.getArticle();
    this.initForm();
    this.getMeasurmentUnits();
  }

  private getArticle() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'articles/articleData', { idarticle: this.idarticle })
      .subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          this.articleForm.get('code')?.setValue(val.data.code);
          this.articleForm.get('title')?.setValue(val.data.title);
          this.articleForm.get('refidum')?.setValue(val.data.refidum);
          this.articleForm.get('quantity')?.setValue(val.data.quantity);
          this.articleForm.get('description')?.setValue(val.data.description);
        }
      })
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

  updateArticle(action: number) {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'articles/storeOrUpdateArticle',
      {
        idarticle: this.idarticle, title: this.articleForm.get('title')?.value,
        refidum: this.articleForm.get('refidum')?.value, description: this.articleForm.get('description')?.value,
        code: this.articleForm.get('code')?.value, action: action
      }).subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          this.getArticle();
        }
      })
  }

  updateQuantityPopUp() {
    const dialogRef = this.dialog.open(UpdateQuantityComponent, {
      maxWidth: '800px',
      minWidth: '350px',
      maxHeight: '500px',
      width: '90%',
      data: { idarticle: this.idarticle }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  historyPopUp() {
    const dialogRef = this.dialog.open(HistoricComponent, {
      maxWidth: '700px',
      minWidth: '350px',
      maxHeight: '500px',
      width: '90%',
      data: { articleid: this.idarticle }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  updateArticlePopup() {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: '700px',
      minWidth: '350px',
      maxHeight: '500px',
      width: '90%',
      data: { articleid: this.article?.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result != null) {
        this.updateArticle(result);
      }
    });
  }

}
