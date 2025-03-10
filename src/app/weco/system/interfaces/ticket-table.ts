export interface TicketTable {
  idticket: number;
  progressive: number;
  ticket_date: string;
  ticketStatus: {idstatus: number; name: string; color: string; type_status: number};
  description: string;
  user_created: {id: number; nickname: string;};
  incharge: {id: number; nickname: string};
  public: number;
}