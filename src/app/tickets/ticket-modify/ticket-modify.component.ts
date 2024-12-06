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

  status: Status | null = null;

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
      this.getInfoTicketFromServer();
    }

  }

  statusMenu() {
    this.isStatusOpen = !this.isStatusOpen;
  }

  // getBackgroundColor(): string {
  //   let color = "white";
  //   const id = this.statusForm.get("status")?.value!.id;
  //   if (id == 0) {
  //     color = "#99CFE7";
  //   }
  //   else if (id == 1) {
  //     color = "#DAED93";
  //   }
  //   else if (id == 2) {
  //     color = "#FFFFE0";
  //   }
  //   else if (id == 3) {
  //     color = "#ECD0DF";
  //   }
  //   return color;
  // }

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

  private getInfoTicketFromServer() {
    if (this.ticketInfoService.ticketInfo && this.ticketInfoService.ticketInfo.id == this.ticketId) {
      this.ticketInfo = this.ticketInfoService.ticketInfo;
      this.ticketGeneralForm.get("title")?.setValue(this.ticketInfoService.ticketInfo.title);
      this.ticketGeneralForm.get("description")?.setValue(this.ticketInfoService.ticketInfo.description!);
      this.status = this.ticketInfoService.ticketInfo.status;
    }
    else {
      this.ticketInfoService.getInfoTicketFromServer(this.ticketId!)
        .subscribe((val: any) => {
          if (val) {
            this.ticketInfo = val;
            this.ticketGeneralForm.get("title")?.setValue(val.title);
            this.ticketGeneralForm.get("description")?.setValue(val.description);
            this.status = val.status;
          }
        })
    }
  }

}
