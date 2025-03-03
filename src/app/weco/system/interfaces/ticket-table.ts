export interface TicketTable {
  id: number;
  num_date: string;
  status: {id: number; name: string; color: string;};
  message: string;
  user_created: {id: number; nickname: string;};
  incharge: {id: number; nickname: string}
}