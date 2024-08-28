import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { Client } from '../interfaces/client';
import { Department } from '../interfaces/department';
import { Profile } from '../interfaces/profile';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TicketsInfoService } from '../services/tickets-info.service';
import { Status } from '../interfaces/status';
import { SubStatus } from '../interfaces/substatus';
import { Location } from '../interfaces/location';
import { MatOption, MatSelect } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket-info',
  standalone: true,
  imports: [
    MatTabsModule,
    MatSelect,
    MatOption,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './ticket-info.component.html',
  styleUrl: './ticket-info.component.scss'
})
export class TicketInfoComponent {
  @ViewChild('select1') select1!: MatSelect;
  @ViewChild('select2') select2!: MatSelect;

  ticketInfoForm = new FormGroup({
    id: new FormControl<number | null>(null, Validators.required),
    status: new FormControl<Status | null>(null, Validators.required),
    subStatus: new FormControl<SubStatus | null>(null, Validators.required),
    internal: new FormControl<number>(0, Validators.required),
    date_ticket: new FormControl<string>(''), //Non modificabile
    client: new FormControl<Client | null>(null, Validators.required),
    location: new FormControl<Location | null>(null),
    title: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null, Validators.required),
    department: new FormControl<Department[] | null>(null),
    incharge: new FormControl<Profile | null>(null),
    keepinformed: new FormControl<Profile[] | null>(null),
    note: new FormControl<string | null>(null)
  });

  ticketId: number | null = null;

  constructor(private route: ActivatedRoute, public ticketInfoService: TicketsInfoService) {
    // CHIAMATA AL SERVER PER OTTENERE I VALORI DEL TICKET
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.ticketId = +id;
      }
    });

    if (this.ticketId) {
      this.ticketInfoForm.patchValue(ticketInfoService.getTicket(this.ticketId!)!);
      this.internalExternalLogic();
      this.print();
    }
  }

  get clientDenomination(): string | null {
    return this.ticketInfoForm.get('client')?.value?.denominazione || null;
  }

  print() {
    console.log(this.ticketInfoForm.getRawValue());
  }

  modifyTitleDescription() {

  }

  save() {

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
    const internal = this.ticketInfoForm.get("internal")?.value;
    if(internal == 1) {
      this.ticketInfoForm.get("client")?.setValue(null);
      this.ticketInfoForm.get("location")?.setValue(null);
      this.ticketInfoForm.get("client")?.disable();
      this.ticketInfoForm.get("location")?.disable();
    }
    else {
      this.ticketInfoForm.get("client")?.enable();
      this.ticketInfoForm.get("location")?.enable();
    }
  }

  refresh() {

  }
}
