import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { TicketTable } from '../../../interfaces/ticket-table';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticket-table',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    MatChipsModule
  ],
  templateUrl: './ticket-table.component.html',
  styleUrl: './ticket-table.component.scss'
})
export class TicketTableComponent {

  displayedColumns: string[] = ['id', 'progressive', 'openingDate', 'description', 'requestType'];
  dataSource = new MatTableDataSource<TicketTable>([]);

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getTicketList()
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    // Imposta il sortingDataAccessor per la colonna "openingDate" se necessario:
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'openingDate') {
        // Converti la stringa in data (timestamp) per ordinare correttamente
        return new Date(item.openingDate).getTime();
      }
      return (item as any)[property];
    };
  }

  getTicketList() {
    this.dataSource.data = [
      { id: 1, progressive: '001', openingDate: '2023-05-20', description: 'Richiesta di assistenza', requestType: 'Assistenza' },
      { id: 2, progressive: '002', openingDate: '2023-05-18', description: 'Richiesta informazioni', requestType: 'Info' },
      { id: 3, progressive: '003', openingDate: '2023-05-22', description: 'Richiesta preventivo', requestType: 'Preventivo' },
    ]
  }

  onSelectionChange(event: any, index: number) {
    console.log(event)
  }

  goToTicket(id: number) {
    this.router.navigate(['ticket', id]);
  }

  newTicket() {
    this.router.navigate(['ticketNewWeco'])
  }

}
