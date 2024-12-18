import { Status } from "./status";

export interface VoucherTable {
  id: number;
  voucher_date: string;
  progressive: number;
  customer: string;
  status: Status;
  note: string;
  location: string;
}