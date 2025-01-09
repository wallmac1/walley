import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TicketWorkComponent } from "../ticket-work/ticket-work.component";
import { CommonModule } from '@angular/common';
import { TicketStatusCardComponent } from "../ticket-status-card/ticket-status-card.component";
import { TicketArticleComponent } from "../ticket-article/ticket-article.component";
import { TicketMessageComponent } from "../ticket-message/ticket-message.component";
import { ConnectServerService } from '../../services/connect-server.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TicketLine } from '../interfaces/ticket-lines';
import { ApiResponse } from '../../weco/interfaces/api-response';
import { Connect } from '../../classes/connect';
import { MeasurementUnit } from '../interfaces/article';
import { TicketInchargeCardComponent } from "../ticket-incharge-card/ticket-incharge-card.component";
import { MatChipListbox, MatChipListboxChange, MatChipOption, MatChipsModule } from '@angular/material/chips';
import { filter } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ticket-timeline',
  standalone: true,
  imports: [
    TicketWorkComponent,
    CommonModule,
    TicketStatusCardComponent,
    TicketArticleComponent,
    TicketMessageComponent,
    TicketInchargeCardComponent,
    MatChipsModule,
    TranslateModule
  ],
  templateUrl: './ticket-timeline.component.html',
  styleUrl: './ticket-timeline.component.scss'
})
export class TicketTimelineComponent {

  filters = [
    { label: 'TICKET.TIMELINE.ARTICLE' },
    { label: 'TICKET.TIMELINE.INCHARGE' },
    { label: 'TICKET.TIMELINE.MESSAGE' },
    { label: 'TICKET.TIMELINE.STATUS' },
    { label: 'TICKET.TIMELINE.WORK' },
  ];

  translatedFilters = [
    { label: '', icon: 'box-seam', value: 1, offset: 0 },
    { label: '', icon: 'person-raised-hand', value: 1, offset: 1 },
    { label: '', icon: 'chat-right-text', value: 1, offset: 2 },
    { label: '', icon: 'arrow-clockwise', value: 1, offset: 3 },
    { label: '', icon: 'tools', value: 1, offset: 4 },
  ];

  ticketId: number = 0;
  hours: { id: number, value: number }[] = [];
  minutes: { id: number, value: number }[] = [];
  measurmentUnit: MeasurementUnit[] = [];
  //linesForm!: FormGroup;

  @Input() lines: TicketLine[] = [];

  constructor(private connectServerService: ConnectServerService, private route: ActivatedRoute,
    private fb: FormBuilder, private translateService: TranslateService, private cdr: ChangeDetectorRef) {
    console.log(this.lines);
  }

  ngOnInit(): void {
    this.translateFilters();
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id && parseInt(id) != 0) {
        this.ticketId = +id;
        //this.getTicket();
      }
    });
    this.getMinutesHours();
    this.getMeasurmentUnits();
  }

  translateFilters(): void {
    let counter = 0;
    this.filters.forEach((filter) => {
      this.translateService.get(filter.label).subscribe((translatedLabel) => {
        this.translatedFilters[counter].label = translatedLabel;
        counter += 1;
      });
    });
  }

  onSelectionChange(event: any, offset: any) {
    this.translatedFilters[offset].value = event.selected ? 1 : 0;
    this.cdr.detectChanges();
  }

  // filterLines() {
  //   let filtered = this.lines;
  //   if (this.translatedFilters[0].value == 0) {
  //     filtered = filtered.filter(item => item.type_line !== 2);
  //   }
  //   if (this.translatedFilters[1].value == 0) {
  //     filtered = filtered.filter(item => item.type_line !== 5);
  //   }
  //   if (this.translatedFilters[2].value == 0) {
  //     filtered = filtered.filter(item => item.type_line !== 3);
  //   }
  //   if (this.translatedFilters[3].value == 0) {
  //     filtered = filtered.filter(item => item.type_line !== 4);
  //   }
  //   if (this.translatedFilters[4].value == 0) {
  //     filtered = filtered.filter(item => item.type_line !== 1);
  //   }

  //   this.filteredLines = filtered;
  // }

  trackById(index: number, item: any): number {
    return item.idticketline;
  }

  numberWithCommaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null; // Se il campo è vuoto, consideralo valido
      }

      // Controlla se il valore soddisfa i criteri
      const regex = /^\d*(,\d{0,2})?$/; // Regex: numeri con al massimo una virgola e due cifre dopo di essa
      const isValid = regex.test(value);

      return isValid ? null : { invalidNumber: true }; // Restituisci l'errore se non valido
    };
  }

  deleteLine(event: { index: number, idticketline: number }) {
    if (event.idticketline == 0) {
      this.lines.splice(event.index, 1);
    }
    else {
      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'ticket/deleteTicketLine', { idticketline: event.idticketline, idticket: this.ticketId })
        .subscribe((val: ApiResponse<any>) => {
          if (val) {
            this.lines.splice(event.index, 1);
          }
        });
    }
  }

  getLine(event: { index: number, idticketline: number }) {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'ticket/ticketLine',
      { idticket: this.ticketId, idticketline: event.idticketline })
      .subscribe((val: ApiResponse<any>) => {
        if (val) {
          this.lines[event.index] = val.data.ticketLineInfo;
          if (val.data.ticketLineInfo.type_line == 2) {
            this.lines[event.index].quantity = val.data.ticketLineInfo.quantity.replace(".", ",");
            this.lines[event.index].taxablepurchase = val.data.ticketLineInfo.taxablepurchase?.replace(".", ",");
            this.lines[event.index].taxablesale = val.data.ticketLineInfo.taxablesale?.replace(".", ",");
          }
        }
      })
  }

  private getMinutesHours() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'infogeneral/listHoursMinutesWorkTicket', {})
      .subscribe((val: ApiResponse<{ hours: { id: number, value: number }[], minutes: { id: number, value: number }[] }>) => {
        if (val) {
          this.hours = val.data.hours;
          this.minutes = val.data.minutes;
        }
      })
  }

  private getMeasurmentUnits() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'infogeneral/unitOfMeasurements', {})
      .subscribe((val: ApiResponse<{ unitOfMeasurements: MeasurementUnit[] }>) => {
        if (val) {
          this.measurmentUnit = val.data.unitOfMeasurements;
        }
      })
  }

}
