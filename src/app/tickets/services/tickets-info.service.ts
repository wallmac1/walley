import { Injectable } from '@angular/core';
import { Ticket } from '../interfaces/ticket';
import { Customer } from '../interfaces/customer';
import { Department } from '../interfaces/department';
import { User } from '../interfaces/user';
import { Location } from '../interfaces/location';
import { Connect } from '../../classes/connect';
import { ConnectServerService } from '../../services/connect-server.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketsInfoService {

  clients: Customer[] = [
    { rifidanacliforprodati: 1, id: 3, denominazione: 'Client A' },
    { rifidanacliforprodati: 2, id: 4, denominazione: 'Client B' }
  ];

  locations: Location[] = [
    { id: 1, address: '123 Main St', number: '1A', city: 'City A' },
    { id: 2, address: '456 Elm St', number: '2B', city: 'City B' }
  ];

  departments: Department[] = [];

  users: User[] = [];

  ticketInfo: Ticket | null = null;

  constructor(private connectServerService: ConnectServerService) { }

  // getTicket(id: number): Ticket | null {
  //   let foundTicket: Ticket | null;
  //   foundTicket = this.ticketsList.find(ticket => ticket.id === id) || null;
  //   return foundTicket;
  // }

  getUsersFromServer(): Observable<any> {
    return this.connectServerService.getRequest(Connect.urlServerLara, "user/usersListNoAdmin", {}).pipe(
      tap((val: any) => {
        if (val) {
          this.users = val;
        }
      })
    );
  }

  getDepartmentFromServer(): Observable<any> {
    return this.connectServerService.getRequest(Connect.urlServerLara, "user/departmentsList", {}).pipe(
      tap((val: any) => {
        if (val) {
          this.departments = val;
        }
      })
    );
  }

  getInfoTicketFromServer(ticketId: number): Observable<any> {
    return this.connectServerService.getRequest(Connect.urlServerLaraApi, 'ticket/infoTicket', { idticket: ticketId }).pipe(
      tap((val: any) => {
        if (val) {
          this.ticketInfo = val;
        }
      })
    );
  }

}
