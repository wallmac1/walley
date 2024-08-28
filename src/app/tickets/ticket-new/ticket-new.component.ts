import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client } from '../interfaces/client';
import { Department } from '../interfaces/department';
import { Profile } from '../interfaces/profile';
import { Location } from '../interfaces/location';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import {MatSelect, MatSelectModule} from '@angular/material/select'; 
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import { map, Observable, startWith } from 'rxjs';
import { Router } from '@angular/router';
import { TicketsInfoService } from '../services/tickets-info.service';
import { ConnectServerService } from '../../services/connect-server.service';
import { Connect } from '../../classes/connect';

@Component({
  selector: 'app-ticket-new',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormField,
    MatLabel,
    MatOption,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
    MatAutocompleteModule
  ],
  templateUrl: './ticket-new.component.html',
  styleUrl: './ticket-new.component.scss'
})
export class TicketNewComponent {

  today: Date = new Date();
  formattedDate: string = this.today.toISOString().split('T')[0];

  @ViewChild('select1') select1!: MatSelect;
  @ViewChild('select2') select2!: MatSelect;

  ticketForm = new FormGroup({
    internal: new FormControl<number>(0, Validators.required),
    date_ticket: new FormControl<string>(this.formattedDate), //Non modificabile
    client: new FormControl<Client | string>('', Validators.required),
    location: new FormControl<Location | null>(null),
    title: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null, Validators.required),
    department: new FormControl<Department[] | null>(null),
    incharge: new FormControl<Profile | null>(null),
    keepinformed: new FormControl<Profile[] | null>(null)
  })

  //inputClient = new FormControl<string>('');

  constructor(private router: Router, public ticketInfoService: TicketsInfoService,
    private connectServerService: ConnectServerService) {
    this.ticketForm.get("date_ticket")?.disable();
  }

  print() {
    console.log(this.ticketForm.getRawValue())
  }

  openSelect(id: number) {
    if(id == 1) {
      this.select1.open();
    }
    else if( id == 2) {
      this.select2.open();
    }
  }

  internalExternalLogic() {
    const internal = this.ticketForm.get("internal")?.value;
    if(internal == 1) {
      this.ticketForm.get("client")?.setValue(null);
      this.ticketForm.get("client")?.disable();
      this.ticketForm.get("location")?.setValue(null);
    }
    else {
      this.ticketForm.get("client")?.enable();
    }
  }

  setNewTicketOnServer() {
    const obj_infoticket = this.ticketForm.getRawValue();
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'ticket/insertTicket', {obj_infoticket: obj_infoticket}).
      subscribe((val: any) => {
        console.log(val);
        if (val) {
          this.router.navigate(["modifyTicket", val]);
          //console.log("Tickets", val.data.listTickets)
        }
      })
  }

  save() {
    // SAVE THE TICKET, GET THE ID BACK AND NAVIGATE TO MODIFICATION PAGE
    this.setNewTicketOnServer();
  }

}
