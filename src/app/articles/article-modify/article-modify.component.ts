import { CommonModule } from '@angular/common';
import { Component, HostListener, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MeasurementUnit } from '../../tickets/interfaces/article';
import { ConnectServerService } from '../../services/connect-server.service';
import { Connect } from '../../classes/connect';
import { ApiResponse } from '../../weco/interfaces/api-response';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Article } from '../interfaces/article';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { HistoricComponent } from '../pop-up/historic/historic.component';
import { UpdateGeneralInfoComponent } from '../pop-up/update-general-info/update.general.info.component';
import { AddQntUntComponent } from '../pop-up/add-qnt-unt/add-qnt-unt.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { StorageLineComponent } from '../article-storage/storage-line/storage-line.component';
import { StorageLineSnComponent } from "../article-storage/storage-line-sn/storage-line-sn.component";
import { StorageLineSnQntComponent } from "../article-storage/storage-line-sn-qnt/storage-line-sn-qnt.component";
import { UpdateCodeComponent } from '../pop-up/update-code/update-code.component';
import { ArticleAveragePriceComponent } from "../article-average-price/article-average-price.component";
import { ArticleInputOutputReservedComponent } from "../article-input-output-reserved/article-input-output-reserved.component";
import { DeleteArticleComponent } from '../pop-up/delete-article/delete-article.component';

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
    StorageLineSnComponent,
    StorageLineSnQntComponent,
    ArticleAveragePriceComponent,
    ArticleInputOutputReservedComponent
  ],
  templateUrl: './article-modify.component.html',
  styleUrl: './article-modify.component.scss'
})
export class ArticleModifyComponent {

  @ViewChild('storageLineComponent') storageLineComponent!: StorageLineComponent;
  @ViewChild('storageLineSnComponent') storageLineSnComponent!: StorageLineSnComponent;
  @ViewChild('storageLineSnQntComponent') storageLineSnQntComponent!: StorageLineSnQntComponent;


  submitted: boolean = false;
  measurmentUnit: MeasurementUnit[] = [];
  article: Article | null = null;
  selectedTabIndex = 0;
  idarticle: number = 0;
  isSmall: boolean = false;
  isSmallUm: boolean = false;
  notesHeight: number = 6;
  manage_sn: boolean = false;
  manage_qnt: boolean = true;

  articleForm = new FormGroup({
    code: new FormControl<string | null>(null, Validators.required),
    title: new FormControl<string | null>(null, Validators.required),
    refidum: new FormControl<number | null>(null),
    description: new FormControl<string | null>(null),
    //quantity: new FormControl<string | null>(null, [Validators.required, this.numberWithCommaValidator()]),
    total_quantityavailable: new FormControl<number>(0),
    total_quantitystorage: new FormControl<number>(0),
    total_unitavailable: new FormControl<number>(0),
    total_unitstorage: new FormControl<number>(0),
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
    if (window.innerWidth < 1200 && window.innerWidth > 575) {
      this.isSmall = true;
    }
    else {
      this.isSmall = false;
    }

    if (window.innerWidth > 976) {
      this.isSmallUm = true;
    }
    else {
      this.isSmallUm = false;
    }

    if (window.innerWidth < 768) {
      this.notesHeight = 2;
    }
    else {
      this.notesHeight = 6;
    }
  }

  getArticle() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'articles/articleData', { idarticle: this.idarticle })
      .subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          this.article = val.data.articleData;
          this.articleForm.patchValue(val.data.articleData);
          this.manage_qnt = val.data.articleData.management_qnt == 1 ? true : false;
          this.manage_sn = val.data.articleData.management_sn == 1 ? true : false;
        }
      })
  }

  private initForm() {
    this.articleForm.get('code')?.disable();
    this.articleForm.get('total_quantityavailable')?.disable();
    this.articleForm.get('total_quantitystorage')?.disable();
    this.articleForm.get('total_unitavailable')?.disable();
    this.articleForm.get('total_unitstorage')?.disable();
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

  insertQuantityPopUp() {
    let management_type = 0;
    if (this.manage_qnt && this.manage_sn) {
      management_type = 2;
    }
    else if (this.manage_sn) {
      management_type = 1;
    }
    const dialogRef = this.dialog.open(AddQntUntComponent, {
      maxWidth: '900px',
      minWidth: '350px',
      maxHeight: '800px',
      width: '90%',
      data: { idarticle: this.idarticle, management_type: management_type }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getArticle();
      if(this.selectedTabIndex == 0) {
        if(this.manage_qnt == false && this.manage_sn == false) {
          this.storageLineComponent.getArticles();
        }
        else if(this.manage_qnt == false && this.manage_sn == true) {
          this.storageLineSnComponent.getArticles();
        }
        else if(this.manage_qnt == true && this.manage_sn == true) {
          this.storageLineSnQntComponent.getArticles();
        }
      }
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
  }

  updateArticlePopup() {
    if (this.articleForm.valid) {
      this.submitted = false;
      const dialogRef = this.dialog.open(UpdateGeneralInfoComponent, {
        maxWidth: '700px',
        minWidth: '350px',
        maxHeight: '500px',
        width: '90%',
        data: { idarticle: this.idarticle, article: this.articleForm.getRawValue() }
      });
    }
    else {
      this.submitted = true;
    }
  }

  deleteArticlePopup() {
    const dialogRef = this.dialog.open(DeleteArticleComponent, {
      maxWidth: '700px',
      minWidth: '350px',
      maxHeight: '500px',
      width: '90%',
      data: { idarticle: this.idarticle }
    });
  }

  modifyCodePopup() {
    const dialogRef = this.dialog.open(UpdateCodeComponent, {
      maxWidth: '700px',
      minWidth: '350px',
      maxHeight: '500px',
      width: '90%',
      data: { idarticle: this.idarticle, code: this.articleForm.get('code')?.value }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.articleForm.get('code')?.setValue(result.code);
      }
    });
  }

}
