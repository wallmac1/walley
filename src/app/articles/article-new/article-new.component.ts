import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MeasurementUnit } from '../../tickets/interfaces/article';
import { ConnectServerService } from '../../services/connect-server.service';
import { Connect } from '../../classes/connect';
import { ApiResponse } from '../../weco/interfaces/api-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-article-new',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './article-new.component.html',
  styleUrl: './article-new.component.scss'
})
export class ArticleNewComponent {

  submittedSearch: boolean = false;
  submittedSave: boolean = false;
  stepTwo: boolean = false;

  measurmentUnit: MeasurementUnit[] = [];

  articleForm = new FormGroup({
    code: new FormControl<string | null>(null, Validators.required),
    title: new FormControl<string | null>(null, Validators.required),
    refidum: new FormControl<number | null>(null),
    description: new FormControl<string | null>(null)
  })

  constructor(private connectServerService: ConnectServerService, private router: Router) {}

  ngOnInit(): void {
    this.getMeasurmentUnits();
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
      this.articleForm.get('code')?.disable();
      this.stepTwo = true;
      // CHIAMATA AL SERVER PER INSERIMENTO
      // OPZIONE 1: INSERIMENTO DI UN NUOVO ARTICOLO NELLA PAGINA STESSA
      // OPZIONE 2: CARICAMENTO DELLA PAGINA DI MODIFICA DI UN TICKET PREESISTENTE
    }
  }

  saveArticle() {
    this.submittedSave = true;
    if (this.articleForm.valid) {
      // CHIAMATA AL SERVER PER SALVATAGGIO NUOVO ARTICOLO
      // CARICAMENTO DELLA PAGINA DI MODIFICA
      const articleId = 0;
      this.router.navigate(['article', articleId]);
    }
  }

  resetArticle() {
    this.submittedSearch = false;
    this.stepTwo = false;
    this.articleForm.get('code')?.enable();
  }

}
