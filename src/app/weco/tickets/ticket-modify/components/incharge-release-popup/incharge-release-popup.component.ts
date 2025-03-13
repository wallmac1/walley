import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../../../services/connect-server.service';
import { Connect } from '../../../../../classes/connect';
import { ApiResponse } from '../../../../interfaces/api-response';

@Component({
  selector: 'app-incharge-release-popup',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './incharge-release-popup.component.html',
  styleUrl: './incharge-release-popup.component.scss'
})
export class InchargeReleasePopupComponent {

  idticket: number = 0;
  request_type: number = 0;

  constructor(public dialogRef: MatDialogRef<InchargeReleasePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private connectServerService: ConnectServerService) {
    this.idticket = data.idticket;
    this.request_type = data.request_type;
  }

  close() {
    this.dialogRef.close(null);
  }

  takeInChargeOrRelease() {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'lavorazioni/takeTicketInCharge',
      { idticket: this.idticket, request_type: this.request_type })
      .subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          this.dialogRef.close(val.data);
        }
      })
  }

}
