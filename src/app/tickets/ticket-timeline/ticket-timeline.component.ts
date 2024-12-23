import { Component } from '@angular/core';
import { TicketWorkComponent } from "../ticket-work/ticket-work.component";
import { CommonModule } from '@angular/common';
import { TicketStatusCardComponent } from "../ticket-status-card/ticket-status-card.component";
import { TicketArticleComponent } from "../ticket-article/ticket-article.component";
import { TicketMessageComponent } from "../ticket-message/ticket-message.component";
import { ConnectServerService } from '../../services/connect-server.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Lines } from '../../voucher/interfaces/lines';

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

  lines: any[] = [];
  ticketId: number = 0;
  linesForm!: FormGroup;


  constructor(private connectServerService: ConnectServerService, private route: ActivatedRoute,
    private fb: FormBuilder) {
    this.linesForm = this.fb.group({
      lines: this.fb.array([])
    })
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id && parseInt(id) != 0) {
        this.ticketId = +id;
        this.getTicket();
      }
    });
  }

  getTicket() {
    this.lines = [
      {
        idticketline: 1,
        type_line: 3,
        timeline: "15/12/24",
        description: "Messaggio di esempio",
        public: 1,
        user_created: {
          id: 3,
          nickname: "Mario",
          datetime: "15/12/24"
        },
        user_updated: {
          id: 4,
          nickname: "Luigi",
          datetime: "16/12/24"
        }
      },
      {
        idticketline: 1, type_line: 1, description: "sdfgjkhsdfg", hours: 1, minutes: 15, timeline: "15/12/24",
        user_created: {
          id: 5, nickname: "Pippo", datetime: "20/12/24"
        },
        user_updated: {
          id: 7, nickname: "Franco", datetime: "24/12/24"
        }
      },
      {
        idticketline: 1,
        type_line: 2,
        description: "Descrizione dell'articolo",
        code: "COD123",
        title: "Titolo dell'articolo",
        quantity: "10",
        refidum: 100,
        refidarticle: null,
        refidarticledata: null,
        refidarticleprice: null,
        serialnumber: 123456,
        taxablepurchase: "100.00",
        taxablesale: "120.00",
        timeline: "20/12/24",
        user_created: {
          id: 1,
          nickname: "creatore",
          datetime: "20/12/24"
        },
        user_updated: {
          id: 2,
          nickname: "modificatore",
          datetime: "20/12/24"
        }
      },
      {
        idticketline: 1, type_line: 1, description: "sdfgjkhsdfg", hours: 1, minutes: 15, timeline: "15/12/24",
        user_created: {
          id: 5, nickname: "Pippo", datetime: "20/12/24"
        },
        user_updated: {
          id: 7, nickname: "Franco", datetime: "24/12/24"
        }
      },
      {
        idticketline: 2, type_line: 4, actual_status: "Nuovo", previous_status: "Nessuno", timeline: "20/12/24",
        user_updated: {
          id: 5, nickname: "Pippo", datetime: "20/12/24"
        }
      }
    ]
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

}
