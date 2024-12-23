import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TicketsInfoService } from '../services/tickets-info.service';
import { CommonModule } from '@angular/common';
import { TicketInfoComponent } from "../ticket-info/ticket-info.component";
import { TicketTimelineComponent } from "../ticket-timeline/ticket-timeline.component";
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { TicketModalComponent } from '../ticket-modal/ticket-modal.component';
import { ConnectServerService } from '../../services/connect-server.service';
import { Ticket } from '../interfaces/ticket';
import { Status } from '../interfaces/status';
import { MatIcon } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu'; 
import { MatButton } from '@angular/material/button';
import { Connect } from '../../classes/connect';

@Component({
  selector: 'app-ticket-modify',
  standalone: true,
  imports: [
    MatTabsModule,
    CommonModule,
    ReactiveFormsModule,
    TicketInfoComponent,
    TicketTimelineComponent,
    MatIcon,
    MatMenuModule,
  ],
  templateUrl: './ticket-modify.component.html',
  styleUrl: './ticket-modify.component.scss'
})
export class TicketModifyComponent {

  isStatusOpen = false;
  internal: boolean = false;

  status: Status | null = {id: 0, name: "Aperto", substatus: {id: 0, name: "In attesa"}};

  ticketGeneralForm = new FormGroup({
    title: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null, Validators.required),
  });

  ticketInfo: Ticket | null = null;

  ticketId: number | null = null;

  constructor(private route: ActivatedRoute, public ticketInfoService: TicketsInfoService, public dialog: MatDialog,
    private connectServerService: ConnectServerService) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.ticketId = parseInt(id);
      }
    });

    if (this.ticketId) {
      this.getTicketInfo();
    }

  }

  statusMenu() {
    this.isStatusOpen = !this.isStatusOpen;
  }

  modifyPopup(i: number): void {
    if (i == 0) {
      const dialogRef = this.dialog.open(TicketModalComponent, {
        width: '450px',
        data: { form: this.ticketGeneralForm.value, index: i }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.ticketGeneralForm.patchValue(result);
        }
      });
    }
    else if (i == 1) {
      let subid;
      if (this.status?.substatus) {
        subid = this.status?.substatus.id;
      }
      else {
        subid = null;
      }
      const statusForm = { statusid: this.status?.id, substatusid: subid }
      const dialogRef = this.dialog.open(TicketModalComponent, {
        width: '450px',
        data: { form: statusForm, index: i }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          //this.status.patchValue(result);
        }
      });
    }

  }

  private setInfoTicketOnServer() {

  }

  private getTicketInfo() {}

  private getStatusList() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'ticket/statusListTicket', {})
  }

  private getSubstatusList() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'ticket/substatusListTicket', {idstatus: this.status?.id})
    .subscribe((val: any) => {
      if (val) {
        //this.substatus = val;
      }
    })
  }

}
