import { Component} from '@angular/core';
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

  ticketGeneralForm = new FormGroup({
    title: new FormControl<string| null>(null, Validators.required),
    description: new FormControl<string| null>(null, Validators.required)
  })

  ticketId: number | null = null;

  constructor(private route: ActivatedRoute, public ticketInfoService: TicketsInfoService, public dialog: MatDialog) {
    // CHIAMATA AL SERVER PER OTTENERE I VALORI DEL TICKET
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.ticketId = +id;
      }
    });

    if(this.ticketId) {
      this.ticketGeneralForm.patchValue(ticketInfoService.getTicket(this.ticketId)!);
    }
  }

  modifyTitleDescription(): void {
    const dialogRef = this.dialog.open(TicketModalComponent, {
      width: '450px',
      data: this.ticketGeneralForm.value
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ticketGeneralForm.patchValue(result);
      }
    });
  }

  save() {}

  cancel() {}

}
