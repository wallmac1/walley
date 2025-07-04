import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Connect } from '../../../classes/connect';
import { ApiResponse } from '../../../weco/interfaces/api-response';

@Component({
  selector: 'app-update-general-info',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './update.general.info.component.html',
  styleUrl: './update.general.info.component.scss'
})
export class UpdateGeneralInfoComponent {

  isBothFalse = true;
  idarticle: number | null = null;
  article: any = null;
  submitted: boolean = false;

  confirmForm = new FormGroup({
    historicize: new FormControl<boolean>(false),
    update: new FormControl<boolean>(false),
  })

  constructor(public dialogRef: MatDialogRef<UpdateGeneralInfoComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // Inizializza il form con i dati passati al dialog
    this.idarticle = data.idarticle;
    this.article = data.article;
    console.log(this.article)
  }

  formLogic(type: number) {
    if (this.isBothFalse == true) {
      this.isBothFalse = false;
    }
    if (type == 1) {
      if (this.confirmForm.get('historicize')?.value == true) {
        this.confirmForm.get('update')?.setValue(false);
      }
      else {
        this.confirmForm.get('update')?.setValue(true);
      }
    }
    else if (type == 2) {
      if (this.confirmForm.get('update')?.value == true) {
        this.confirmForm.get('historicize')?.setValue(false);
      }
      else {
        this.confirmForm.get('historicize')?.setValue(true);
      }
    }
  }

  updateArticle() {
    let action: number = 0;
    action = this.confirmForm.get('historicize')?.value ? 1 : 2;
    this.submitted = true;
    if (!this.isBothFalse) {
      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'articles/storeOrUpdateArticle',
        {
          idarticle: this.idarticle, title: this.article.title,
          refidum: this.article.refidum, description: this.article.description,
          note: this.article.note, action: action
        }).subscribe((val: ApiResponse<any>) => {
          this.dialogRef.close();
        })
    }
  }

  close(type: number | null) {
    if (type != null && type != 0) {
      this.dialogRef.close(type);
    }
    else if (type == 0) {
      this.isBothFalse = true;
    }
    else if (type == null) {
      this.dialogRef.close(null);
    }
  }
}
