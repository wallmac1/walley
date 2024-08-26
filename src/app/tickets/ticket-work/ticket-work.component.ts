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

  ticketWorks: Work[] = [];
  time: any[] = [
    "30 minuti", "1 ora", "1 ora e 30 minuti", "2 ore", "2 ore e 30 minuti", "3 ore", "3 ore e 30 minuti",
    "4 ore", "4 ore e 30 minuti", "5 ore"
  ];

  workFormArray: FormArray;
  fb = new FormBuilder()

  constructor(private ticketWorksService: TicketWorksService) {
    this.ticketWorks = ticketWorksService.getTicketWorks();
    this.workFormArray = this.fb.array([]);
    this.ticketWorks.forEach(work => {
      const workGroup = this.fb.group({
        user: [work.user.nickname, Validators.required],
        date: [this.dateToISO(work.date!), Validators.required],
        workTime: [work.worktime, Validators.required],
        description: [work.description, Validators.required],
        price: [work.price, Validators.required],
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
    // A questo punto, work dovrebbe essere un oggetto con un controllo `public`
    const isPublic = this.getWorkFormGroup(index).get('public')?.value;
    return isPublic ? '#FFFFE0' : 'transparent'; // Giallo pastello, cambia se necessario
  }


}
