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
import { Title } from '@angular/platform-browser';
import { ConnectServerService } from '../../services/connect-server.service';
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
    MatLabel,
    MatFormField
  ],
  templateUrl: './ticket-modify.component.html',
  styleUrl: './ticket-modify.component.scss'
})
export class TicketModifyComponent {

  isStatusOpen = false;
  internal: boolean = false;
  client = {
    name: "Client Name",
    headquarter: "Client Headquarter"
  };
  status = {
    id: 1,
    name: "Working"
  };
  substatus = {
    id: 1,
    name: "Doing things"
  };
  statusList = [
    { id: 1, name: "Working" },
    { id: 2, name: "Waiting" },
    { id: 3, name: "Closed" }
  ]

  statusForm = new FormGroup({
    statusid: new FormControl<number | null>(null, Validators.required),
    substatusid: new FormControl<number | null>(null, Validators.required),
  })

  ticketGeneralForm = new FormGroup({
    title: new FormControl<string | null>("Ticket", Validators.required),
    description: new FormControl<string | null>("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas luctus metus, eget pretium nulla feugiat in. Morbi blandit massa vitae nisl hendrerit ornare. Morbi tincidunt, metus nec lobortis imperdiet, lorem sapien aliquam dolor, eget suscipit justo nunc in tellus. Ut eget justo augue. Fusce quis convallis sapien. Morbi nibh massa, bibendum in congue a, eleifend ut neque. Nullam ut felis ac nibh pellentesque efficitur. Proin sed porttitor quam. Nulla facilisi. ", Validators.required),
    statusid: new FormControl<number | null>(1, Validators.required)
  })

  ticketId: number | null = null;

  constructor(private route: ActivatedRoute, public ticketInfoService: TicketsInfoService, public dialog: MatDialog,
    private connectServerService: ConnectServerService) {
    // CHIAMATA AL SERVER PER OTTENERE I VALORI DEL TICKET
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.ticketId = +id;
      }
    });

    if (this.ticketId) {
      this.ticketGeneralForm.patchValue(ticketInfoService.getTicket(this.ticketId)!);
      this.statusForm.get('statusid')?.setValue(this.status.id);
      this.statusForm.get('substatusid')?.setValue(this.substatus.id);
    }

    this.getInfoTicketFromServer();

  }

  statusMenu() {
    this.isStatusOpen = !this.isStatusOpen;
  }

  getBackgroundColor(): string {
    let color = "white";
    if (this.status.id == 0) {
      color = "#99CFE7";
    }
    else if (this.status.id == 1) {
      color = "#DAED93";
    }
    else if (this.status.id == 2) {
      color = "#FFFFE0";
    }
    else if (this.status.id == 3) {
      color = "#ECD0DF";
    }
    return color;
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
      const dialogRef = this.dialog.open(TicketModalComponent, {
        width: '450px',
        data: { form: this.statusForm.value, index: i }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          //this.status.patchValue(result);
        }
      });
    }

  }

  setInfoTicketOnServer() {
    
  }

  getInfoTicketFromServer() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'ticket/listStatusTicket', {}).
      subscribe((val: any) => {
        console.log(val);
        if (val) {
          this.status = val;
          //console.log("Tickets", val.data.listTickets)
        }
      })
  }


  save() { }

  cancel() { }

}
