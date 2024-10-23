import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { Customer } from '../interfaces/customer';
import { Department } from '../interfaces/department';
import { User } from '../interfaces/user';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TicketsInfoService } from '../services/tickets-info.service';
import { Status } from '../interfaces/status';
import { SubStatus } from '../interfaces/substatus';
import { Location } from '../interfaces/location';
import { MatOption, MatSelect } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Ticket } from '../interfaces/ticket';
import { ConnectServerService } from '../../services/connect-server.service';
import { Connect } from '../../classes/connect';

@Component({
  selector: 'app-ticket-info',
  standalone: true,
  imports: [
    MatTabsModule,
    MatSelect,
    MatOption,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './ticket-info.component.html',
  styleUrl: './ticket-info.component.scss'
})
export class TicketInfoComponent {
  @Input() data!: Ticket;
  @ViewChild('select1') select1!: MatSelect;
  @ViewChild('select2') select2!: MatSelect;

  ticketInfoForm = new FormGroup({
    id: new FormControl<number | null>(null, Validators.required),
    status: new FormControl<Status | number | null>(null, Validators.required),
    internal: new FormControl<number>(0, Validators.required),
    date_ticket: new FormControl<string>(''), //Non modificabile
    customer: new FormControl<Customer | null>(null, Validators.required),
    location: new FormControl<Location | null>(null),
    title: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null, Validators.required),
    department: new FormControl<Department[] | number[] | null>(null),
    incharge: new FormControl<User | number | null>(null),
    keepinformed: new FormControl<User[] | number[] | null>(null),
    note: new FormControl<string | null>(null)
  });

  ticketId: number | null = null;

  users: User[] | null = null;
  department: Department[] | null = null;

  constructor(private route: ActivatedRoute, public ticketInfoService: TicketsInfoService,
    private connectServerService: ConnectServerService) {
    // CHIAMATA AL SERVER PER OTTENERE I VALORI DEL TICKET
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.ticketId = +id;
      }
    });
  }

  ngOnInit(): void {
    if (this.ticketId) {
      this.getUser();
      this.getDepartment();
      this.ticketInfoService.getDepartmentFromServer();
      this.ticketInfoForm.patchValue(this.data);
      this.internalExternalLogic();
      this.print();
    }
  }

  get clientDenomination(): string | null {
    return this.ticketInfoForm.get('customer')?.value?.denomination || null;
  }

  print() {
    console.log(this.ticketInfoForm.getRawValue());
  }

  modifyTitleDescription() {

  }

  refresh() {
    if (this.ticketInfoService.ticketInfo && this.ticketInfoService.ticketInfo.id == this.ticketId) {
      this.ticketInfoForm.patchValue(this.ticketInfoService.ticketInfo);
    }
    else {
      this.ticketInfoService.getInfoTicketFromServer(this.ticketId!)
        .subscribe((val: any) => {
          if (val) {
            this.ticketInfoForm.patchValue(val);
          }
        })
    }

  }

  getUser() {
    if (this.ticketInfoService.users) {
      this.users = this.ticketInfoService.users!;
    }
    this.ticketInfoService.getUsersFromServer()
      .subscribe((val: any) => {
        this.users = val;
      })
  }

  getDepartment() {
    if (this.ticketInfoService.departments) {
      this.department = this.ticketInfoService.departments!;
    }
    this.ticketInfoService.getDepartmentFromServer()
      .subscribe((val: any) => {
        this.department = val;
      })
  }

  setTicketInfoOnServer() {
    this.connectServerService.postRequest(Connect.urlServerLara, "ticket/saveTicketInfo", {ticketinfo: this.ticketInfoForm})
      .subscribe((val: any) => {
        if(val) {
          this.ticketInfoService.ticketInfo = val;
          this.ticketInfoForm.patchValue(val);
        }
      })
  }

  save() {
    this.setTicketInfoOnServer();
  }

  openSelect(id: number) {
    if (id == 1) {
      this.select1.open();
    }
    else if (id == 2) {
      this.select2.open();
    }
  }

  internalExternalLogic() {
    const internal = this.ticketInfoForm.get("internal")?.value;
    if (internal == 1) {
      this.ticketInfoForm.get("customer")?.setValue(null);
      this.ticketInfoForm.get("location")?.setValue(null);
      this.ticketInfoForm.get("customer")?.disable();
      this.ticketInfoForm.get("location")?.disable();
    }
    else {
      this.ticketInfoForm.get("customer")?.enable();
      this.ticketInfoForm.get("location")?.enable();
    }
  }

}
