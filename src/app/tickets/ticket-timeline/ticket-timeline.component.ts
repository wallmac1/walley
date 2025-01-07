import { Component, EventEmitter, Input, Output } from '@angular/core';
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

@Component({
  selector: 'app-ticket-timeline',
  standalone: true,
  imports: [
    TicketWorkComponent,
    CommonModule,
    TicketStatusCardComponent,
    TicketArticleComponent,
    TicketMessageComponent
  ],
  templateUrl: './ticket-timeline.component.html',
  styleUrl: './ticket-timeline.component.scss'
})
export class TicketTimelineComponent {

  ticketId: number = 0;
  hours: { id: number, value: number }[] = [];
  minutes: { id: number, value: number }[] = [];
  measurmentUnit: MeasurementUnit[] = [];
  //linesForm!: FormGroup;

  @Input() lines: TicketLine[] = [];

  constructor(private connectServerService: ConnectServerService, private route: ActivatedRoute,
    private fb: FormBuilder) {
    console.log(this.lines);
  }

  ngOnInit(): void {
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

  private getLines() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'ticket/ticketLineInfo', { idticket: this.ticketId })
      .subscribe((val: ApiResponse<any>) => {
        if (val) {
          this.lines = val.data;
        }
      })
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
            this.getLines();
          }
        });
    }
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
