import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { TicketTable } from '../interfaces/ticket-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-system-tickets-list',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    TranslateModule,
    MatTableModule,
    MatSortModule
  ],
  templateUrl: './system-tickets-list.component.html',
  styleUrl: './system-tickets-list.component.scss'
})
export class SystemTicketsListComponent {

  idsystem: number = 20;
  displayedColumns: string[] = ['id', 'num_date', 'status', 'message', 'user_created', 'incharge'];
  dataSource = new MatTableDataSource<TicketTable>([]);
  ticketList: TicketTable[] = [];

  constructor(private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.getTicketList();
  }

  createTicket() {
    this.router.navigate(['newTicket'], {queryParams: {idsystem: this.idsystem}});
  }

  getTicketList() {
    this.ticketList = [
      {
        id: 1,
        num_date: "4/2023-06-15",
        status: { id: 1, name: "Open", color: "28a745" },
        message: "Il sistema è in funzione correttamente. Il sistema è in funzione correttamente. Il sistema è in funzione correttamente. Il sistema è in funzione correttamente. Il sistema è in funzione correttamente. Il sistema è in funzione correttamente. Il sistema è in funzione correttamente. Il sistema è in funzione correttamente. Il sistema è in funzione correttamente. Il sistema è in funzione correttamente. Il sistema è in funzione correttamente. Il sistema è in funzione correttamente. Il sistema è in funzione correttamente. Il sistema è in funzione correttamente. Il sistema è in funzione correttamente. Il sistema è in funzione correttamente. v Il sistema è in funzione correttamente. Il sistema è in funzione correttamente. ",
        user_created: { id: 101, nickname: "MarioRossi" },
        incharge: { id: 201, nickname: "AnnaBianchi" }
      },
      {
        id: 2,
        num_date: "2/2023-06-16",
        status: { id: 2, name: "In Progress", color: "ffc107" },
        message: "Sto verificando il problema segnalato.",
        user_created: { id: 102, nickname: "LucaVerdi" },
        incharge: { id: 202, nickname: "GiovanniNeri" }
      },
      {
        id: 3,
        num_date: "17/2023-06-17",
        status: { id: 3, name: "Closed", color: "dc3545" },
        message: "Il problema è stato risolto con successo.",
        user_created: { id: 103, nickname: "FrancescaBlu" },
        incharge: { id: 203, nickname: "MartaViola" }
      },
      {
        id: 4,
        num_date: "39/2023-06-18",
        status: { id: 1, name: "Open", color: "28a745" },
        message: "Nuova richiesta di assistenza ricevuta.",
        user_created: { id: 104, nickname: "CarloGiallo" },
        incharge: { id: 204, nickname: "PaolaRosa" }
      },
      {
        id: 5,
        num_date: "99/2023-06-19",
        status: { id: 2, name: "In Progress", color: "ffc107" },
        message: "Il tecnico è stato assegnato al ticket.",
        user_created: { id: 105, nickname: "SilviaArancio" },
        incharge: { id: 205, nickname: "LeonardoBianco" }
      }
    ];

    this.dataSource.data = this.ticketList;
  }

}
