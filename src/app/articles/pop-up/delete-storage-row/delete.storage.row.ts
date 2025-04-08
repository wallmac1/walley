import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConnectServerService } from '../../../services/connect-server.service';
import { TranslateModule } from '@ngx-translate/core';
import { ArticleStorage } from '../../interfaces/article';

@Component({
  selector: 'app-delete-storage-row',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    TranslateModule,
    MatDialogModule
  ],
  templateUrl: './delete.storage.row.html',
  styleUrl: './delete.storage.row.scss'
})
export class DeleteStorageRowComponent {

  management_type: number | null = null;
  article: ArticleStorage | null = null;

  constructor(public dialogRef: MatDialogRef<DeleteStorageRowComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.article = data.article;
    this.management_type = data.management_type;
  }

  deleteArticle() {
    // CHIAMATA AL SERVER PER ELIMINARE L'ARTICOLO
    this.close();
  }

  close() {
    this.dialogRef.close();
  }

}
