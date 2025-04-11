import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Connect } from '../../../classes/connect';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-article',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './delete-article.component.html',
  styleUrl: './delete-article.component.scss'
})
export class DeleteArticleComponent {

  idarticle: number = 0;

  constructor(public dialogRef: MatDialogRef<DeleteArticleComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any, private router: Router) {
    this.idarticle = data.idarticle;
  }

  close() {
    this.dialogRef.close();
  }

  deleteArticle() {
    if(this.idarticle > 0) {
      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'articles/deleteArticle', {idarticle: this.idarticle})
        .subscribe((val) => {
          this.router.navigate(['articleList']);
          this.dialogRef.close();
        })
    }
  }

}
