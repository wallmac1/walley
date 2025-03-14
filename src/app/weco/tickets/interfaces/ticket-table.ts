export interface TicketTable {
    idticket: number;
    progressive: string;
    ticket_date: string;
    description: string;
    ticketStatus: {idstatus: number; type_status: number; color: string; name: string;};
    incharge: {id: number; nickname: string; datetime: string};
    public: string;
}
