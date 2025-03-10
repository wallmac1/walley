import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConnectServerService } from '../../../services/connect-server.service';
import { ApiResponse } from '../../../weco/interfaces/api-response';
import { Connect } from '../../../classes/connect';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-payment-delete-popup',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule
  ],
  templateUrl: './payment-delete-popup.component.html',
  styleUrl: './payment-delete-popup.component.scss'
})
export class PaymentDeletePopupComponent {

  id: number = 0;

  constructor(public dialogRef: MatDialogRef<PaymentDeletePopupComponent>,
      private connectServerService: ConnectServerService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      // Inizializza il form con i dati passati al dialog
      this.id = data.id;
    }

  deleteCondition() {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'invoice/eliminaCondizionePagamento', {idcondition: this.id})
      .subscribe((val: ApiResponse<any>) => {
        if(val) {
          this.dialogRef.close(true);
        }
      })
  }

  close() {
    this.dialogRef.close(null);
  }

}
