import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MeasurementUnit } from '../../tickets/interfaces/article';
import { ConnectServerService } from '../../services/connect-server.service';
import { Connect } from '../../classes/connect';
import { ApiResponse } from '../../weco/interfaces/api-response';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Article } from '../interfaces/article';
import { MatTabsModule } from '@angular/material/tabs';
import { ArticleTaxableComponent } from "../article-taxable/article-taxable.component";
import { ArticleHistoryComponent } from "../article-history/article-history.component";
import { MatDialog } from '@angular/material/dialog';
import { HistoricComponent } from '../pop-up/historic/historic.component';
import { ConfirmComponent } from '../pop-up/confirm/confirm.component';
import { UpdateQuantityComponent } from '../pop-up/update-quantity/update-quantity.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { StorageLineComponent } from '../article-storage/storage-line/storage-line.component';
import { StorageLineSnComponent } from "../article-storage/storage-line-sn/storage-line-sn.component";
import { StorageLineSnQntComponent } from "../article-storage/storage-line-sn-qnt/storage-line-sn-qnt.component";

@Component({
  selector: 'app-article-modify',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    TranslateModule,
    MatTabsModule,
    StorageLineComponent,
    ArticleTaxableComponent,
    ArticleHistoryComponent,
    StorageLineSnComponent,
    StorageLineSnQntComponent
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
  isSmall: boolean = false;
  isSmallUm: boolean = false;
  notesHeight: number = 6;
  manage_sn: boolean = false;
  manage_qnt: boolean = false;

  articleForm = new FormGroup({
    code: new FormControl<string | null>(null, Validators.required),
    title: new FormControl<string | null>(null, Validators.required),
    refidum: new FormControl<number | null>(null),
    description: new FormControl<string | null>(null),
    //quantity: new FormControl<string | null>(null, [Validators.required, this.numberWithCommaValidator()]),
    available_qnt: new FormControl<string | null>(null),
    storage_qnt: new FormControl<string | null>(null),
    available_unit: new FormControl<number>(0),
    storage_unit: new FormControl<number>(0),
    note: new FormControl<string | null>(null)
  });

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

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
    this.updateWindowDimensions();
  }

  updateWindowDimensions() {
    if(window.innerWidth < 1200 && window.innerWidth > 575) {
      this.isSmall = true;
    }
    else {
      this.isSmall = false;
    }

    if(window.innerWidth > 976) {
      this.isSmallUm = true;
    }
    else {
      this.isSmallUm = false;
    }

    if(window.innerWidth < 768) {
      this.notesHeight = 2;
    }
    else {
      this.notesHeight = 6;
    }
  }

  private getArticle() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'articles/articleData', { idarticle: this.idarticle })
      .subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          this.articleForm.get('code')?.setValue(val.data.code);
          this.articleForm.get('title')?.setValue(val.data.title);
          this.articleForm.get('refidum')?.setValue(val.data.refidum);
          this.articleForm.get('available_unit')?.setValue(val.data.quantity); // Da modificare
          this.articleForm.get('storage_unit')?.setValue(val.data.quantity); // Da modificare
          this.articleForm.get('description')?.setValue(val.data.description);
          this.articleForm.get('note')?.setValue(val.data.note);

          if(val.data.manage_qnt == 1) {
            this.articleForm.get('available_qnt')?.setValue(val.data.quantity); // Da modificare
            this.articleForm.get('storage_qnt')?.setValue(val.data.quantity); // Da modificare
            this.manage_qnt = true; // Da inserire valore reale
          }

          if(val.data.manage_sn == 1) {
            this.manage_sn = true; // Da inserire valore reale
          }
        }
      })
  }

  private initForm() {
    this.articleForm.get('code')?.disable();
    this.articleForm.get('quantity')?.disable();
    this.articleForm.get('available_qnt')?.disable();
    this.articleForm.get('storage_qnt')?.disable();
    this.articleForm.get('available_unit')?.disable();
    this.articleForm.get('storage_unit')?.disable();
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
      data: { articleid: this.article?.idarticle }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result != null) {
        this.updateArticle(result);
      }
    });
  }

}
