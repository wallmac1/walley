import { Injectable } from '@angular/core';
import { Ticket } from '../interfaces/ticket';
import { Client } from '../interfaces/client';
import { Department } from '../interfaces/department';
import { Profile } from '../interfaces/profile';
import { Location } from '../interfaces/location';

@Injectable({
  providedIn: 'root'
})
export class TicketsInfoService {

  clients: Client[] = [
    { rifidanacliforprodati: 1, id: 3, denominazione: 'Client A' },
    { rifidanacliforprodati: 2, id: 4, denominazione: 'Client B' }
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

  ticketsList: Ticket[] = [
    {
        id: 1,
        status: { id: 1, title: 'Open' },
        subStatus: { id: 1, refStatusId: 1, title: 'Pending Approval' },
        internal: 1,
        title: 'Preventivo nuovo sito web PFUT',
        description: 'Network is down in the main office.',
        date_ticket: '2024-08-07',
        client: null,
        location: null,
        department: [{ id: 1, name: 'IT Department' }],
        incharge: { id: 1, nickname: 'jdoe' },
        keepinformed: [{ id: 2, nickname: 'asmith' }, { id: 3, nickname: 'mbrown' }],
        note: null
    },
    {
        id: 2,
        status: { id: 2, title: 'In Progress' },
        subStatus: { id: 2, refStatusId: 2, title: 'Work in Progress' },
        internal: 0,
        title: 'Client Software Upgrade',
        description: 'Upgrade the software for the external client.',
        date_ticket: '2024-08-06',
        client: { id: 1, denominazione: 'Acme Corp', rifidanacliforprodati: 1 },
        location: { id: 1, city: 'New York', address: '123 Main St', number: "1A" },
        department: [{ id: 2, name: 'Software Development' }],
        incharge: { id: 4, nickname: 'mjones' },
        keepinformed: [{ id: 5, nickname: 'twilliamson' }],
        note: null
    },
    {
        id: 3,
        status: { id: 3, title: 'Closed' },
        subStatus: { id: 3, refStatusId: 3, title: 'Resolved' },
        internal: 1,
        title: 'Update Security Policies',
        description: 'Update the security policies to comply with new regulations.',
        date_ticket: '2024-08-05',
        client: null,
        location: null,
        department: [{ id: 3, name: 'Security' }],
        incharge: { id: 6, nickname: 'jblack' },
        keepinformed: null,
        note: null
    }
];

  constructor() { }

  getTicket(id: number): Ticket | null {
    let foundTicket: Ticket | null;
    foundTicket = this.ticketsList.find(ticket => ticket.id === id) || null;
    return foundTicket;
  }

}
