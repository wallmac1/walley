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
import { TicketInfo } from '../interfaces/ticket-info';
import { Status } from '../interfaces/status';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButton } from '@angular/material/button';
import { Connect } from '../../classes/connect';
import { TicketLine } from '../interfaces/ticket-lines';
import { ApiResponse } from '../../weco/interfaces/api-response';

@Component({
  selector: 'app-ticket-modify',
  standalone: true,
  imports: [
    MatTabsModule,
    CommonModule,
    ReactiveFormsModule,
    TicketInfoComponent,
    TicketTimelineComponent,
    MatMenuModule,
  ],
  templateUrl: './ticket-modify.component.html',
  styleUrl: './ticket-modify.component.scss'
})
export class TicketModifyComponent {

  selectedTabIndex = 0;
  isStatusOpen = false;
  internal: boolean = false;
  lines: TicketLine[] = [];
  ticketInfo: TicketInfo | null = null;
  ticketStatus: { idstatus: number, idsubstatus: number, name_status: string, name_substatus: string, color: string } | null = null;
  ticketId: number = 0;

  ticketGeneralForm = new FormGroup({
    title: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null, Validators.required),
  });

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
        data: { form: this.ticketGeneralForm.value, index: i, ticketid: this.ticketId }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.ticketGeneralForm.patchValue(result);
        }
      });
    }
    else if (i == 1) {
      const statusForm = { statusid: this.ticketStatus?.idstatus, substatusid: this.ticketStatus?.idsubstatus }
      const dialogRef = this.dialog.open(TicketModalComponent, {
        width: '450px',
        data: { form: statusForm, index: i, ticketid: this.ticketId }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          //this.status.patchValue(result);
        }
      });
    }

  }

  private getTicketInfo() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'ticket/ticketAllInfo', { idticket: this.ticketId }).subscribe((val: any) => {
      if (val) {
        this.ticketInfo = val.data.ticketInfo;
        this.ticketGeneralForm.get('title')?.setValue(val.data.ticketInfo.title);
        this.ticketGeneralForm.get('description')?.setValue(val.data.ticketInfo.description);
        this.ticketStatus = val.data.ticketStatus;
        this.lines = val.data.ticketInfoLines;
      }
    });
  }

  goToWorksAndMessages() {
    this.selectedTabIndex = 1;
  }

  addWork() {
    this.goToWorksAndMessages();
    let work: TicketLine = {
      idticket: this.ticketId,
      idticketline: 0,
      type_line: 1,
      description: '',
      quantity: '0,00',
      hours: null,
      minutes: null,
      attachments: [],
      timeline: new Date().toISOString().slice(0, 10)
    }
    this.lines.unshift(work);
  }

  addArticle() {
    this.goToWorksAndMessages();
    let article: TicketLine = {
      idticket: this.ticketId,
      idticketline: 0,
      type_line: 2,
      description: '',
      quantity: '0,00',
      taxablepurchase: '0,00',
      taxablesale: '0,00',
      serialnumber: '',
      refidum: null,
      refidarticle: null,
      refidarticledata: null,
      refidarticleprice: null,
      code: '',
      title: '',
      attachments: [],
      timeline: new Date().toISOString().slice(0, 10)
    }
    this.lines.unshift(article);
  }

  addMessage() {
    this.goToWorksAndMessages();
    let message: TicketLine = {
      idticket: this.ticketId,
      idticketline: 0,
      type_line: 3,
      description: '',
      public: 0,
      quantity: '0,00',
      attachments: [],
      timeline: new Date().toISOString().slice(0, 10)
    }
    this.lines.unshift(message);
  }

  private getStatusList() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'ticket/statusListTicket', {})
  }

  private getSubstatusList() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'ticket/substatusListTicket', { idstatus: this.ticketStatus?.idstatus })
      .subscribe((val: any) => {
        if (val) {
          //this.substatus = val;
        }
      })
  }

}
