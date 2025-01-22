import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConnectServerService } from '../../../services/connect-server.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    TranslateModule
  ],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss'
})
export class DeleteComponent {

  totalQuantity: number | null = null;

  articles: { action: boolean, id: number, quantity: string,
  serialnumber: string | null, taxablepurchase: string, pricesale: string, pricerecommended: string,
  taxablerecommended: string, vatpurchase: string, vatrecommended: string }[] = [];

  constructor(public dialogRef: MatDialogRef<DeleteComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if(Array.isArray(data.articles)) {
      this.articles = data.articles;
    }
    else {
      this.articles.push(data.articles);
    }
    console.log(this.articles)
    if(this.articles.length > 1) {
      let quantity = 0;
      this.articles.forEach((element) => {
        quantity += parseFloat(element.quantity);
      })
      this.totalQuantity = quantity;
    }
  }

  deleteArticle() {
    // CHIAMATA AL SERVER PER ELIMINARE L'ARTICOLO
    this.close();
  }

  close() {
    this.dialogRef.close();
  }

}
