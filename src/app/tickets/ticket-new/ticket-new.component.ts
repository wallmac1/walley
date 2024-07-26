import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client } from '../interfaces/client';
import { Department } from '../interfaces/department';
import { Profile } from '../interfaces/profile';
import { Location } from '../interfaces/location';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';

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
    MatRadioModule
  ],
  templateUrl: './ticket-new.component.html',
  styleUrl: './ticket-new.component.scss'
})
export class TicketNewComponent {

  today: Date = new Date();
  formattedDate: string = this.today.toISOString().split('T')[0];

  clients: Client[] = [
    { id: 1, name: 'Client A' },
    { id: 2, name: 'Client B' }
  ];

  locations: Location[] = [
    { id: 1, address: '123 Main St', number: '1A', city: 'City A' },
    { id: 2, address: '456 Elm St', number: '2B', city: 'City B' }
  ];

  departments: Department[] = [
    { id: 1, name: 'Department A' },
    { id: 2, name: 'Department B' }
  ];

  profiles: Profile[] = [
    { id: 1, nickname: 'Profile A' },
    { id: 2, nickname: 'Profile B' }
  ];

  ticketForm = new FormGroup({
    internal: new FormControl<number>(0, Validators.required),
    date: new FormControl<string>(this.formattedDate), //Non modificabile
    client: new FormControl<Client | null>(null, Validators.required),
    location: new FormControl<Location | null>(null, Validators.required),
    title: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null, Validators.required),
    department: new FormControl<Department[] | null>(null),
    incharge: new FormControl<Profile | null>(null),
    keepinformed: new FormControl<Profile[] | null>(null)
  })

  constructor() {
    this.print()
  }

  print() {
    console.log(this.ticketForm.getRawValue())
  }

}
