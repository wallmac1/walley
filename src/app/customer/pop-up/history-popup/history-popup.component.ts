import { Component, Inject } from '@angular/core';
import { Connect } from '../../../classes/connect';
import { ApiResponse } from '../../../weco/interfaces/api-response';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConnectServerService } from '../../../services/connect-server.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { HistoryPopup } from '../../interfaces/history-popup';

@Component({
  selector: 'app-history-popup',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatTooltipModule,
    MatDialogModule,
    MatExpansionModule
  ],
  templateUrl: './history-popup.component.html',
  styleUrl: './history-popup.component.scss'
})
export class HistoryPopupComponent {

  customerHistory: HistoryPopup[] = [];
  idregistry: number = 0;

  constructor(public dialogRef: MatDialogRef<HistoryPopupComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // Inizializza il form con i dati passati al dialog
    this.idregistry = data.idregistry;
  }

  ngOnInit(): void {
    this.getCustomerHistory();
  }

  getCustomerHistory() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'customer/customerDataHistory', { idregistry: this.idregistry })
      .subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          this.customerHistory = val.data.dataHistoryList;
        }
      })
  }

  close() {
    this.dialogRef.close();
  }

}
