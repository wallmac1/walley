import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { Status } from '../interfaces/status';
import { Connect } from '../../classes/connect';
import { ConnectServerService } from '../../services/connect-server.service';

@Component({
  selector: 'app-ticket-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatLabel,
    CommonModule
  ],
  templateUrl: './ticket-modal.component.html',
  styleUrl: './ticket-modal.component.scss'
})
export class TicketModalComponent {

  statusList: Status[] = [];
  substatusList: Status[] = [];

  editTitleForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl('')
  });

  editStatusForm = new FormGroup({
    statusid: new FormControl<number | null>(null, Validators.required),
    substatusid: new FormControl<number | null>(null)
  });

  id: number | null = null;

  constructor(public dialogRef: MatDialogRef<TicketModalComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // Inizializza il form con i dati passati al dialog
    this.id = data.index;

    this.disableSubStatus();

    if (this.id == 0) {
      this.editTitleForm.patchValue(data.form);
    }
    else if (this.id == 1) {
      this.editStatusForm.patchValue(data.form);
    }

    this.getStatusFromServer();

  }

  onStatusSelected() {
    this.enableSubStatus();
    this.getSubStatusFromServer(this.editStatusForm.get("statusid")?.value!);
  }

  getStatusFromServer() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'ticket/listStatusTicket', {}).
      subscribe((val: any) => {
        console.log(val);
        if (val) {
          this.statusList = val;
          //this.enableSubStatus();
        }
      })
  }

  getSubStatusFromServer(id: number) {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'ticket/listSubStatusTicket', { refidticketstatus: id }).
      subscribe((val: any) => {
        console.log(val);
        if (val) {
          this.substatusList = val;
        }
      })
  }

  enableSubStatus() {
    this.editStatusForm.get("substatusid")?.enable();
  }

  disableSubStatus() {
    this.editStatusForm.get("substatusid")?.disable();
  }

  save(): void {
    if (this.id == 0) {
      this.dialogRef.close(this.editTitleForm.value);
    }
    else if (this.id == 1) {
      this.dialogRef.close(this.editStatusForm.value);
    }

  }

  cancel(): void {
    this.dialogRef.close();
  }

}
