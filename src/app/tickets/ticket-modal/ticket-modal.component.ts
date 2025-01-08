import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { Status } from '../interfaces/status';
import { Connect } from '../../classes/connect';
import { ConnectServerService } from '../../services/connect-server.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-ticket-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    CommonModule,
    TranslateModule
  ],
  templateUrl: './ticket-modal.component.html',
  styleUrl: './ticket-modal.component.scss'
})
export class TicketModalComponent {

  statusList: Status[] = [];
  substatusList: Status[] = [];
  error: string = '';

  editTitleForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl('')
  });

  editStatusForm = new FormGroup({
    statusid: new FormControl<number | null>(null, Validators.required),
    substatusid: new FormControl<number | null>(null)
  });

  ticketid: number = 0;

  id: number | null = null;

  constructor(public dialogRef: MatDialogRef<TicketModalComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // Inizializza il form con i dati passati al dialog
    this.id = data.index;
    this.ticketid = data.ticketid;

    if (this.id == 0) {
      this.editTitleForm.patchValue(data.form);
    }
    else if (this.id == 1) {
      this.getStatusList();
      this.disableSubStatus();
    }
  }

  onStatusSelected() {
    this.enableSubStatus();
    this.getSubStatusList(this.editStatusForm.get("statusid")?.value!);
  }

  getStatusList() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'ticket/statusListTicket', {}).
      subscribe((val: any) => {
        console.log(val);
        if (val) {
          this.statusList = val.data.statusList;
        }
      })
  }

  getSubStatusList(id: number) {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'ticket/subStatusListTicket', { idstatus: id }).
      subscribe((val: any) => {
        console.log(val);
        if (val) {
          this.substatusList = val.data.subStatusList;
        }
      })
  }

  saveStatus() {
    const status = this.editStatusForm.getRawValue()
    this.connectServerService.postRequest(Connect.urlServerLara, "ticket/changeStatusTicket",
      { idstatus: status.statusid, idsubstatus: status.substatusid, idticket: this.ticketid })
      .subscribe((val: any) => {
        this.dialogRef.close(1);
      })
  }

  saveTitleDescription() {
    //console.log("qui")
    const titleDescription = this.editTitleForm.getRawValue();
    this.connectServerService.postRequest(Connect.urlServerLara, "ticket/saveHeaderTicket",
      { idticket: this.ticketid, title: titleDescription.title, description: titleDescription.description })
      .subscribe((val: any) => {
        if (val) {
          this.dialogRef.close(titleDescription);
        }
        else {
          this.dialogRef.close(null);
        }
      })
  }

  enableSubStatus() {
    this.editStatusForm.get("substatusid")?.enable();
  }

  disableSubStatus() {
    //console.log("Status", this.editStatusForm.get("statusid")?.value)
    if (!this.editStatusForm.get("statusid")?.value) {
      this.editStatusForm.get("substatusid")?.disable();
    }
  }

  async save(): Promise<void> {
    if (this.id == 0) {
      this.saveTitleDescription();
    }
    else if (this.id == 1) {
      this.saveStatus();
    }

  }

  cancel(): void {
    this.dialogRef.close(null);
  }

}
