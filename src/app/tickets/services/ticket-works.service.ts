import { Injectable } from '@angular/core';
import { Work } from '../interfaces/work';

@Injectable({
  providedIn: 'root'
})
export class TicketWorksService {

  tickets: Work[] = [
    {
      type: 0,
      id: 1,
      dateTime: "26/08/2024 alle 15:40",
      date: '24-08-2024',
      worktime: "1 ora",
      price: '200',
      user: {
        id: 101,
        nickname: 'Giovanni Rossi',
      },
      attached: ['pic1.jpg', 'pic2.jpg'],
      description: 'Installazione completa di impianto elettrico per abitazione unifamiliare.'
    },
    {
      type: 0,
      id: 2,
      dateTime: "22/08/2024 alle 10:30",
      date: '20-08-2024',
      price: '150',
      worktime: "2 ore",
      user: {
        id: 102,
        nickname: 'Laura Bianchi',
      },
      attached: ['pic3.jpg'],
      description: 'Riparazione tubature danneggiate in cucina.'
    },
    {
      type: 0,
      id: 3,
      dateTime: "24/08/2024 alle 18:00",
      date: '10-08-2024',
      worktime: "30 minuti",
      price: '100',
      user: {
        id: 103,
        nickname: 'Mario Verdi',
      },
      attached: ['pic1.jpg'],
      description: 'Manutenzione e controllo della caldaia con sostituzione del filtro.'
    },
    {
      type: 1,
      id: 7,
      dateTime: "24/08/2024 alle 18:00",
      date: '09-08-2024',
      worktime: "30 minuti",
      price: '100',
      user: {
        id: 103,
        nickname: 'Mario Verdi',
      },
      public: 1,
      attached: ['pic1.jpg'],
      description: 'Manutenzione e controllo della caldaia con sostituzione del filtro.'
    },
    {
      type: 0,
      id: 4,
      dateTime: "06/08/2024 alle 15:40",
      date: '05-08-2024',
      worktime: "1 ora e 30 minuti",
      price: '80',
      user: {
        id: 104,
        nickname: 'Elena Neri',
      },
      attached: [],
      description: 'Servizio di pulizia per ufficio di 100 mq.'
    },
    {
      type: 0,
      id: 5,
      dateTime: "30/07/2024 alle 09:10",
      date: '29-07-2024',
      worktime: "5 ore",
      price: '500',
      user: {
        id: 105,
        nickname: 'Francesco Galli',
      },
      attached: ['example.pdf'],
      description: 'Ristrutturazione completa del bagno, inclusa sostituzione piastrelle e sanitari.'
    }
  ];

  constructor() { }

  getTicketWorks(): Work[] {
    return this.tickets;
  }
}
