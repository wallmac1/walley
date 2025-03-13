import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConnectServerService } from '../../../../../services/connect-server.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketStatus } from '../../../interfaces/ticket-status';
import { Connect } from '../../../../../classes/connect';
import { ApiResponse } from '../../../../interfaces/api-response';

@Component({
  selector: 'app-change-status-popup',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-status-popup.component.html',
  styleUrl: './change-status-popup.component.scss'
})
export class ChangeStatusPopupComponent {

  submitted: boolean = false;
  idticket: number | null = null;
  statusList: TicketStatus[] = [];
  changeStatusForm = new FormGroup({
    idstatus: new FormControl<number | null>(null, Validators.required)
  })

  constructor(public dialogRef: MatDialogRef<ChangeStatusPopupComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // Inizializza il form con i dati passati al dialog
    this.idticket = data.idticket;
  }

  ngOnInit(): void {
    this.getStatusList();
  }

  getStatusList() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'lavorazioni/ticketStatusList', {})
      .subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          this.statusList = val.data.statuses;
        }
      })
  }

  save() {
    this.submitted = true;
    if (this.changeStatusForm.valid) {
      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'lavorazioni/changeTicketStatus',
        { idticket: this.idticket, idstatus: this.changeStatusForm.get('idstatus')?.value })
        .subscribe((val: ApiResponse<any>) => {
          if (val.data) {
            this.dialogRef.close(val.data);
          }
        })
    }
  }

  close() {
    this.dialogRef.close(null);
  }
}
