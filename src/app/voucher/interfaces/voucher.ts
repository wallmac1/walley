import { Customer } from "../../tickets/interfaces/customer";
import { Status } from "./status";


export interface Voucher {
    id: number;
    progressive: string;
    voucher_year: string;
    voucher_date: string;
    reference: string;
    location: string;
    customer: Customer;
    note: string;
}
