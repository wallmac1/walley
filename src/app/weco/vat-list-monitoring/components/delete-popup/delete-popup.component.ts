import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../../services/connect-server.service';
import { Connect } from '../../../../classes/connect';
import { ApiResponse } from '../../../interfaces/api-response';

@Component({
  selector: 'app-delete-popup',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './delete-popup.component.html',
  styleUrl: './delete-popup.component.scss'
})
export class DeletePopupComponent {

  value: { id: number, identifier: string } | null = null;

  constructor(public dialogRef: MatDialogRef<DeletePopupComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // Inizializza il form con i dati passati al dialog
    this.value = data.value;
    console.log(this.value)
  }

  close() {
    this.dialogRef.close(null);
  }

  deleteIdentifier() {
    // Richiesta al server con l'id corretto
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'settings/deleteMonitoringIdentifier', 
      { id_identifier: this.value?.id })
      .subscribe((val: ApiResponse<any>) => {
        if (val) {
          this.dialogRef.close({ id: this.value?.id, identifier: this.value?.identifier });
        }
      })
  }

}
