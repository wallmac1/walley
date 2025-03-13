import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Connect } from '../../../../../classes/connect';
import { ApiResponse } from '../../../../interfaces/api-response';
import { ConnectServerService } from '../../../../../services/connect-server.service';

@Component({
  selector: 'app-delete-message-popup',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './delete-message-popup.component.html',
  styleUrl: './delete-message-popup.component.scss'
})
export class DeleteMessagePopupComponent {

  idticket: number = 0;
  idticketline: number = 0;

  constructor(public dialogRef: MatDialogRef<DeleteMessagePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private connectServerService: ConnectServerService) {
    this.idticket = data.idticket;
    this.idticketline = data.idticketline;
  }

  close() {
    this.dialogRef.close(null);
  }

  deleteMessage() {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'lavorazioni/deleteTicketLine',
      { idticket: this.idticket, idticketline: this.idticketline })
      .subscribe((val: ApiResponse<any>) => {
        if (val) {
          this.dialogRef.close(true);
        }
      })
  }

}
