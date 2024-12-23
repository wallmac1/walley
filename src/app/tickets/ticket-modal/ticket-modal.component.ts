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

  ticketid: number | null = null;

  id: number | null = null;

  constructor(public dialogRef: MatDialogRef<TicketModalComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // Inizializza il form con i dati passati al dialog
    this.id = data.index;

    if (this.id == 0) {
      this.editTitleForm.patchValue(data.form);
    }
    else if (this.id == 1) {
      this.getStatusList();
      this.editStatusForm.patchValue(data.form);
      //console.log(this.editStatusForm.value);
      //console.log(data.form);
      if(data.form.statusid && data.form.statusid != 1) {
        this.getSubStatusList(data.form.statusid);
      }
      this.disableSubStatus();
    }
  }

  onStatusSelected() {
    this.enableSubStatus();
    this.getSubStatusList(this.editStatusForm.get("statusid")?.value!);
  }

  getStatusList() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'ticket/listStatusTicket', {}).
      subscribe((val: any) => {
        console.log(val);
        if (val) {
          this.statusList = val.data;
          //this.enableSubStatus();
        }
      })
  }

  getSubStatusList(id: number) {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'ticket/listSubStatusTicket', { refidticketstatus: id }).
      subscribe((val: any) => {
        console.log(val);
        if (val) {
          this.substatusList = val;
        }
      })
  }

  setStatusOnServer() {
    const status = this.editStatusForm.getRawValue()
    this.connectServerService.postRequest(Connect.urlServerLara, "status/setStatus",
      { statusid: status.statusid, substatusid: status.substatusid, ticketid: this.ticketid })
      .subscribe((val: any) => {
        this.dialogRef.close(val);
      })
  }

  setTitleDescriptionOnServer() {
    const titleDescription = this.editTitleForm.getRawValue();
    this.connectServerService.postRequest(Connect.urlServerLara, "status/setStatus",
      { title: titleDescription.title, description: titleDescription.description, ticketid: this.ticketid })
      .subscribe((val: any) => {
        this.dialogRef.close(val);
      })
  }

  enableSubStatus() {
    this.editStatusForm.get("substatusid")?.enable();
  }

  disableSubStatus() {
    //console.log("Status", this.editStatusForm.get("statusid")?.value)
    if (this.editStatusForm.get("statusid")?.value || this.editStatusForm.get("statusid")?.value == 4 || this.editStatusForm.get("statusid")?.value == 1) {
      this.editStatusForm.get("substatusid")?.disable();
    }
  }

  async save(): Promise<void> {
    if (this.id == 0) {
      this.setTitleDescriptionOnServer();
      this.dialogRef.close(this.editTitleForm.value);
    }
    else if (this.id == 1) {
      this.setStatusOnServer();
    }

  }

  cancel(): void {
    this.dialogRef.close();
  }

}
