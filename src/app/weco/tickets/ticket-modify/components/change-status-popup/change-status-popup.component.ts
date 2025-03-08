import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConnectServerService } from '../../../../../services/connect-server.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketStatus } from '../../../interfaces/ticket-status';

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

  }

  close() {
    this.dialogRef.close();
  }
}
