import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../../../services/connect-server.service';
import { Connect } from '../../../../../classes/connect';
import { ApiResponse } from '../../../../interfaces/api-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-ticket-popup',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule
  ],
  templateUrl: './delete-ticket-popup.component.html',
  styleUrl: './delete-ticket-popup.component.scss'
})
export class DeleteTicketPopupComponent {

  idticket: number = 0;
  idsystem: number = 0;

  constructor(public dialogRef: MatDialogRef<DeleteTicketPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private connectServerService: ConnectServerService,
    private router: Router) {
    this.idticket = data.idticket;
    this.idsystem = data.idsystem;
  }

  close() {
    this.dialogRef.close(null);
  }

  deleteMessage() {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'systems/deleteTicket',
      { idticket: this.idticket })
      .subscribe((val: ApiResponse<any>) => {
        if (val) {
          this.router.navigate(['systemTicketList', this.idsystem]);
          this.dialogRef.close();
        }
      })
  }
}
