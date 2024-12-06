import { Status } from "./status";

export interface VoucherTable {
    voucher_date: string;
    progressive: number;
    customer: string;
    status: Status;
    notes: string;
    location: string;
  }