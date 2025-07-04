import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MeasurementUnit } from '../../tickets/interfaces/article';
import { ConnectServerService } from '../../services/connect-server.service';
import { Connect } from '../../classes/connect';
import { ApiResponse } from '../../weco/interfaces/api-response';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-article-new',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    TranslateModule
  ],
  templateUrl: './article-new.component.html',
  styleUrl: './article-new.component.scss'
})
export class ArticleNewComponent {

  submittedSearch: boolean = false;
  submittedSave: boolean = false;
  stepTwo: boolean = false;
  idarticle: number = 0;

  measurmentUnit: MeasurementUnit[] = [];

  articleForm = new FormGroup({
    code: new FormControl<string | null>(null, Validators.required),
    title: new FormControl<string | null>(null, Validators.required),
    refidum: new FormControl<number | null>(null),
    description: new FormControl<string | null>(null),
    management_sn: new FormControl<number>(1),
    management_qnt: new FormControl<number>(1),
    note: new FormControl<string | null>(null)
  })

  constructor(private connectServerService: ConnectServerService, private router: Router) { }

  ngOnInit(): void {
    this.getMeasurmentUnits();
    this.articleForm.get('management_sn')?.valueChanges.subscribe((val: any) => {
      if(val == 1) {
        this.articleForm.get('management_qnt')?.enable();
      }
      else {
        this.articleForm.get('management_qnt')?.setValue(0);
        this.articleForm.get('management_qnt')?.disable();
      }
    })
  }

  private getMeasurmentUnits() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'infogeneral/unitOfMeasurements', {})
      .subscribe((val: ApiResponse<{ unitOfMeasurements: MeasurementUnit[] }>) => {
        if (val) {
          this.measurmentUnit = val.data.unitOfMeasurements;
        }
      })
  }

  insertArticle() {
    this.submittedSearch = true;
    if (this.articleForm.get('code')?.valid) {
      this.connectServerService.getRequest(Connect.urlServerLaraApi, 'articles/checkCodeArticle',
        { code: this.articleForm.get('code')?.value }).subscribe((val: ApiResponse<any>) => {
          //console.log(val)
          if (val.data && val.data.idarticle) {
            // ALERT ARTICOLO GIA' ESISTENTE
            alert(`Codice articolo già esistente`);
          }
          else {
            this.stepTwo = true;
            this.articleForm.get('code')?.disable();
          }
        })
    }
  }

  saveArticle() {
    this.submittedSave = true;
    if (this.articleForm.valid) {
      const article = this.articleForm.getRawValue();

      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'articles/storeOrUpdateArticle',
        {
          idarticle: this.idarticle, title: article.title, management_sn: article.management_sn ? 1 : 0,
          refidum: article.refidum, description: article.description,
          code: article.code, note: article.note, management_qnt: article.management_qnt ? 1 : 0
        }).subscribe((val: ApiResponse<any>) => {
          if (val.data) {
            this.idarticle = val.data.idarticle;
            this.router.navigate(['article', this.idarticle]);
          }
        })
    }
  }

  resetArticle() {
    this.submittedSearch = false;
    this.stepTwo = false;
    this.articleForm.get('code')?.enable();
  }

}
