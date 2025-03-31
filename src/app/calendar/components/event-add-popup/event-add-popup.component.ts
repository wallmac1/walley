import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Customer } from '../../../tickets/interfaces/customer';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { dateRangeValidator } from '../validators/date-validator';
import { timeInterval } from 'rxjs';
import { timeRangeValidator } from '../validators/time-validator';
import { sub } from 'date-fns';
import { customerValidator, isCustomer } from '../validators/customer-validator';

@Component({
  selector: 'app-event-add-popup',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatSelectModule
  ],
  templateUrl: './event-add-popup.component.html',
  styleUrl: './event-add-popup.component.scss'
})
export class EventAddPopupComponent {

  submitted: boolean = false;
  isSmall: boolean = false;

  courseList: {id: number, name: string}[] = [];
  roomList: { id: number, name: string }[] = [];
  headquarterList: { id: number; name: string }[] = [];
  contactList: { id: number; name: string }[] = [];
  userList: { id: number; name: string }[] = [
    { id: 1, name: "Utente 1" },
    { id: 2, name: "Utente 2" },
    { id: 3, name: "Utente 3" },
  ];

  eventForm = new FormGroup({
    event_type: new FormControl<number>(0), // 0 MEMO, 1 EVENT, 2 SALA, 3 COURSE, 4 OTHER
    idcourse: new FormControl<number | null>(null, Validators.required),
    title: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null),
    internal: new FormControl<number>(1), // 0 EXTERNAL, 1 INTERNAL, 2 OTHER
    date_start: new FormControl<string | null>(null, Validators.required),
    date_end: new FormControl<string | null>(null, Validators.required),
    idroom: new FormControl<number | null>(null, Validators.required),
    isallday: new FormControl<number>(0),
    time_start: new FormControl<string | null>(null),
    time_end: new FormControl<string | null>(null),
    customer: new FormControl<Customer | null>(null, [Validators.required, customerValidator()]),
    idcontact: new FormControl<number | null>(null),
    customer_headquarter: new FormControl<number | null>(null),
    internal_person: new FormControl<string | null>(null),
    internal_headquarter: new FormControl<number | null>(null),
    keepinformed: new FormControl<number | null>(null)
  }, {
    validators: [dateRangeValidator(), timeRangeValidator()]
  })

  constructor(public dialogRef: MatDialogRef<EventAddPopupComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.updateWindowDimensions();
    this.initForm();
    this.getHeadquarters();
    this.getContacts();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  updateWindowDimensions() {
    if (window.innerWidth < 740) {
      this.isSmall = true;
    }
    else {
      this.isSmall = false;
    }
  }

  initForm() {
    this.eventTypeLogic(0);
    this.dateTypeLogic(0);
    this.isAllDayLogic(1);
    this.internalLogic(1);

    this.eventForm.get('event_type')?.valueChanges.subscribe((result) => {
      this.eventTypeLogic(result);
      this.dateTypeLogic(result);
    });
    this.eventForm.get('isallday')?.valueChanges.subscribe((result) => {
      this.isAllDayLogic(result);
    });
    this.eventForm.get('customer')?.valueChanges.subscribe((result) => {
      this.customerLogic(result);
    });
    this.eventForm.get('internal')?.valueChanges.subscribe((result) => {
      this.internalLogic(result);
    });
    this.eventForm.get('date_start')?.valueChanges.subscribe((result) => {
      this.dateLogic(result);
    })
  }

  internalLogic(result: any) {
    if(result == 0) {
      this.eventForm.get('customer')?.enable();
      this.eventForm.get('internal_headquarter')?.disable();
      this.eventForm.get('internal_headquarter')?.setValue(null);
    }
    else if(result == 1) {
      this.eventForm.get('customer')?.disable();
      this.eventForm.get('customer')?.setValue(null);
      this.eventForm.get('internal_headquarter')?.enable();
      this.eventForm.get('customer_headquarter')?.setValue(null);
      this.eventForm.get('customer_headquarter')?.disable();
      this.eventForm.get('idcontact')?.disable();
      this.eventForm.get('idcontact')?.setValue(null);
    }
    else if(result == 2) {
      this.eventForm.get('customer')?.disable();
      this.eventForm.get('customer')?.setValue(null);
      this.eventForm.get('customer_headquarter')?.setValue(null);
      this.eventForm.get('customer_headquarter')?.disable();
      this.eventForm.get('internal_headquarter')?.disable();
      this.eventForm.get('internal_headquarter')?.setValue(null);
      this.eventForm.get('idcontact')?.disable();
      this.eventForm.get('idcontact')?.setValue(null);
    }
  }

  customerLogic(result: any) {
    if (isCustomer(result) && this.eventForm.get('internal')?.value == 0) {
      this.eventForm.get('customer_headquarter')?.enable();
    }
    else {
      this.eventForm.get('customer_headquarter')?.setValue(null);
      this.eventForm.get('customer_headquarter')?.disable();
    }
  }

  eventTypeLogic(result: any) {
    if(result != 2 && result != 3) {
      this.eventForm.get('idcourse')?.disable();
      this.eventForm.get('idcourse')?.setValue(null);
      this.eventForm.get('idroom')?.disable();
      this.eventForm.get('idroom')?.setValue(null);
      this.eventForm.get('title')?.enable();
    }
    else if(result == 2) {
      this.eventForm.get('idcourse')?.disable();
      this.eventForm.get('idcourse')?.setValue(null);
      this.eventForm.get('title')?.disable();
      this.eventForm.get('title')?.setValue(null);
      this.eventForm.get('idroom')?.enable();
    }
    else if(result == 3) {
      this.eventForm.get('title')?.disable();
      this.eventForm.get('title')?.setValue(null);
      this.eventForm.get('idroom')?.disable();
      this.eventForm.get('idroom')?.setValue(null);
      this.eventForm.get('idcourse')?.enable();
    }
  }

  dateTypeLogic(result: any) {
    if (result == 0) {
      this.eventForm.get('isallday')?.setValue(1);
      this.eventForm.get('isallday')?.disable();
    }
    else {
      this.eventForm.get('isallday')?.enable();
    }
  }

  dateLogic(result: any) {
    if(this.eventForm.get('date_start')?.value && this.eventForm.get('date_end')?.value == null) {
      this.eventForm.get('date_end')?.setValue(result);
    }
  }

  isAllDayLogic(result: any) {
    if (result == 1 || result == true) {
      this.eventForm.get('time_start')?.disable();
      this.eventForm.get('time_start')?.setValue(null);
      this.eventForm.get('time_end')?.setValue(null);
      this.eventForm.get('time_end')?.disable();
    }
    else {
      this.eventForm.get('time_start')?.enable();
      this.eventForm.get('time_end')?.enable();
    }
  }

  getHeadquarters() {

  }

  getContacts() {

  }

  close() {
    this.dialogRef.close();
  }

  save() { 
    this.submitted = true;
    console.log(this.eventForm.getRawValue());

    if(this.eventForm.valid) {
      this.dialogRef.close({event: this.eventForm.getRawValue()});
    }
  }

}
