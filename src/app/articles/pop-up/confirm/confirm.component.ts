import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss'
})
export class ConfirmComponent {

  id: number | null = null;

  constructor(public dialogRef: MatDialogRef<ConfirmComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // Inizializza il form con i dati passati al dialog
    this.id = data.articleid;
  }

  vary() { 
    this.dialogRef.close(2);
  }

  close() {
    this.dialogRef.close(null);
  }

  update() { 
    this.dialogRef.close(1);
  }
}
