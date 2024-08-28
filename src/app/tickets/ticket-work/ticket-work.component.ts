import { Component } from '@angular/core';
import { Work } from '../interfaces/work';
import { CommonModule } from '@angular/common';
import { TicketWorksService } from '../services/ticket-works.service';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-ticket-work',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
  ],
  templateUrl: './ticket-work.component.html',
  styleUrl: './ticket-work.component.scss'
})
export class TicketWorkComponent {

  ticketStatus = {
    actualstatusid: null,
    actualstatus: null,
  }

  ticketWorks: Work[] = [];
  hours: string[] = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"
  ];
  minutes: string[] = [
    "00", "15", "30", "45"
  ];

  statusForm = new FormGroup({
    nextstatus: new FormControl<number | null>(null, Validators.required),
    actualsubstatus: new FormControl<number | null>(null, Validators.required),
    user: new FormControl<string | null>(null, Validators.required),
    dateTime: new FormControl<Date | null>(null, Validators.required)
  })

  workFormArray: FormArray;
  fb = new FormBuilder()

  constructor(private ticketWorksService: TicketWorksService) {
    this.ticketWorks = ticketWorksService.getTicketWorks();
    this.workFormArray = this.fb.array([]);
    this.ticketWorks.forEach(work => {
      const workGroup = this.fb.group({
        user: [work.user.nickname, Validators.required],
        date: [this.dateToISO(work.date!), Validators.required],
        hours: [work.hours, Validators.required],
        minutes: [work.minutes, Validators.required],
        description: [work.description, Validators.required],
        price: [work.price, Validators.required],
        price_total: [work.price_total, Validators.required],
        attached: [work.attached, Validators.required],
        public: [work.public, Validators.required],
      });
      this.workFormArray.push(workGroup);
    });

  }

  getWorkFormGroup(index: number): FormGroup {
    return this.workFormArray.at(index) as FormGroup;
  }

  // Converte la data in formato Date
  dateToISO(dateStr: string): String {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day + 1).toISOString().split('T')[0];
  }

  isImage(fileName: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(fileName);
  }

  save(index: number) {

  }

  reset(index: number) {
    
  }

  getCardBackgroundColor(index: number): string {
    const isPublic = this.getWorkFormGroup(index).get('public')?.value;
    return isPublic ? '#f8ad77' : '#FED0AF';
  }

  getCardBackgroundColorStatus(index: number): string {
    const actualStatus = this.ticketWorks[index].status?.actualid;
    let selectedColor = "white"
    if(actualStatus == 0) {           // Nuovo
      selectedColor = "#99CFE7";
    }
    else if(actualStatus == 1) {      // Lavorazione
      selectedColor = "#DAED93"
    }
    else if(actualStatus == 2) {      // Attesa
      selectedColor = "#FFFFE0"
    }
    else if(actualStatus == 3) {      //Chiuso
      selectedColor = "#ECD0DF"
    }

    return selectedColor;
  }


}
