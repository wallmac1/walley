import { Component, Inject } from '@angular/core';
import { Connect } from '../../../classes/connect';
import { ApiResponse } from '../../../weco/interfaces/api-response';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Customer } from '../../interfaces/customer';
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
    // this.connectServerService.getRequest(Connect.urlServerLaraApi, 'customer/customerDataHistory', { idregistry: this.idregistry })
    //   .subscribe((val: ApiResponse<any>) => {
    //     if (val.data) {
    //       this.customerHistory = val.data.customerHistory;
    //       console.log(val.data)
    //     }
    //   })

    //CHIAMATA AL SERVER PER OTTENERE LA STORIA DEGLI ARTICOLI
    const historyData: HistoryPopup[] = [
      {
        datetime: "2025-02-26 14:30:00",
        fiscalcode: "RSSMRA80A01H501Z",
        vat: "IT12345678901",
        country: "Italia",
        sdi: "ABCDE12345",
        pec: "mario.rossi@pec.it",
        name: "Mario",
        surname: "Rossi",
        businessName: "Rossi Srl",
        naturalPerson: 1,
        sameCode: 0,
        user_created: { nickname: "admin", datetime: "2025-01-15 09:00:00" },
        user_updated: { nickname: "user01", datetime: "2025-02-20 11:45:00" }
      },
      {
        datetime: "2025-02-25 10:15:00",
        fiscalcode: "VRDLGU70B12L219F",
        vat: "IT98765432109",
        country: "Italia",
        sdi: "XYZW98765",
        pec: "luigi.verdi@pec.it",
        name: "Luigi",
        surname: "Verdi",
        businessName: "Verdi & Co.",
        naturalPerson: 0,
        sameCode: 1,
        user_created: { nickname: "admin", datetime: "2025-01-10 08:30:00" },
        user_updated: { nickname: "user02", datetime: "2025-02-18 14:20:00" }
      },
      {
        datetime: "2025-02-24 17:50:00",
        fiscalcode: "BNCLRA85C18Z404Y",
        vat: "IT55555555555",
        country: "Italia",
        sdi: "LMNO65432",
        pec: "laura.bianchi@pec.it",
        name: "Laura",
        surname: "Bianchi",
        businessName: "Bianchi Spa",
        naturalPerson: 0,
        sameCode: 1,
        user_created: { nickname: "admin", datetime: "2025-01-05 12:00:00" },
        user_updated: { nickname: "user03", datetime: "2025-02-22 16:30:00" }
      },
    ];

    this.customerHistory = historyData;
  }

  close() {
    this.dialogRef.close();
  }

}
