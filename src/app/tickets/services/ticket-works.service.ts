import { Injectable } from '@angular/core';
import { Work } from '../interfaces/work';

@Injectable({
  providedIn: 'root'
})
export class TicketWorksService {

  // tickets: Work[] = [
  //   {
  //     type: 2,
  //     id: 20,
  //     dateTime: "30/07/2024 09:00",
  //     description: "",
  //     date: '29-07-2024',
  //     user: {
  //       id: 105,
  //       nickname: 'Francesco Galli',
  //     },
  //     status: {
  //       previousid: 0,
  //       previous: "Working",
  //       actualid: 3,
  //       actual: "Closed"
  //     },
  //     substatus: {
  //       id: 10,
  //       actual: "Risolto"
  //     },
  //     attached: [],
  //   },
  //   {
  //     type: 0,
  //     id: 1,
  //     dateTime: "26/08/2024 15:40",
  //     date: '24-08-2024',
  //     hours: "1",
  //     minutes: "15",
  //     price: '200',
  //     user: {
  //       id: 101,
  //       nickname: 'Giovanni Rossi',
  //     },
  //     attached: ['pic1.jpg', 'pic2.jpg', 'pic2.jpg', 'pic2.jpg', 'pic1.jpg', 'pic1.jpg', 'wallnet.png', 'trial.jpeg'],
  //     description: 'Installazione completa di impianto elettrico per abitazione unifamiliare.'
  //   },
  //   {
  //     type: 0,
  //     id: 2,
  //     dateTime: "22/08/2024 10:30",
  //     date: '20-08-2024',
  //     price: '150',
  //     hours: "2",
  //     minutes: "30",
  //     user: {
  //       id: 102,
  //       nickname: 'Laura Bianchi',
  //     },
  //     attached: ['pic3.jpg'],
  //     description: 'Riparazione tubature danneggiate in cucina.'
  //   },
  //   {
  //     type: 0,
  //     id: 3,
  //     dateTime: "24/08/2024 18:00",
  //     date: '10-08-2024',
  //     hours: "5",
  //     minutes: "00",
  //     price: '100',
  //     user: {
  //       id: 103,
  //       nickname: 'Mario Verdi',
  //     },
  //     attached: ['pic1.jpg'],
  //     description: 'Manutenzione e controllo della caldaia con sostituzione del filtro.'
  //   },
  //   {
  //     type: 1,
  //     id: 7,
  //     dateTime: "24/08/2024 18:00",
  //     date: '09-08-2024',
  //     hours: "7",
  //     minutes: "45",
  //     price: '100',
  //     user: {
  //       id: 103,
  //       nickname: 'Mario Verdi',
  //     },
  //     public: 1,
  //     attached: ['pic1.jpg'],
  //     description: 'Manutenzione e controllo della caldaia con sostituzione del filtro.'
  //   },
  //   {
  //     type: 2,
  //     id: 11,
  //     dateTime: "30/07/2024 09:00",
  //     description: "",
  //     date: '29-07-2024',
  //     user: {
  //       id: 105,
  //       nickname: 'Francesco Galli',
  //     },
  //     status: {
  //       previousid: 2,
  //       previous: "Waiting",
  //       actualid: 1,
  //       actual: "Working"
  //     },
  //     substatus: {
  //       id: 0,
  //       actual: "Merce da Consegnare"
  //     },
  //     attached: [],
  //   },
  //   {
  //     type: 2,
  //     id: 12,
  //     dateTime: "30/07/2024 09:00",
  //     description: "",
  //     date: '29-07-2024',
  //     user: {
  //       id: 105,
  //       nickname: 'Francesco Galli',
  //     },
  //     status: {
  //       previousid: 1,
  //       previous: "Working",
  //       actualid: 2,
  //       actual: "Waiting"
  //     },
  //     substatus: {
  //       id: 2,
  //       actual: "Richiesta Preventivo"
  //     },
  //     attached: [],
  //   },
  //   {
  //     type: 0,
  //     id: 4,
  //     dateTime: "06/08/2024 15:40",
  //     date: '05-08-2024',
  //     hours: "10",
  //     minutes: "30",
  //     price: '80',
  //     user: {
  //       id: 104,
  //       nickname: 'Elena Neri',
  //     },
  //     attached: [],
  //     description: 'Servizio di pulizia per ufficio di 100 mq.'
  //   },
  //   {
  //     type: 0,
  //     id: 5,
  //     dateTime: "30/07/2024 alle 09:10",
  //     date: '29-07-2024',
  //     hours: "5",
  //     minutes: "15",
  //     price: '500',
  //     user: {
  //       id: 105,
  //       nickname: 'Francesco Galli',
  //     },
  //     attached: ['example.pdf'],
  //     description: 'Ristrutturazione completa del bagno, inclusa sostituzione piastrelle e sanitari.'
  //   },
  //   {
  //     type: 2,
  //     id: 10,
  //     dateTime: "30/07/2024 09:00",
  //     description: "",
  //     date: '29-07-2024',
  //     user: {
  //       id: 105,
  //       nickname: 'Francesco Galli',
  //     },
  //     status: {
  //       previousid: 0,
  //       previous: "New",
  //       actualid: 1,
  //       actual: "Working"
  //     },
  //     substatus: {
  //       id: 0,
  //       actual: "Merce da Consegnare"
  //     },
  //     attached: [],
  //   }
  // ];

  constructor() { }

  getTicketWorks() {
    
  }
}
