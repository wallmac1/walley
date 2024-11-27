import { Customer } from "../../tickets/interfaces/customer";

export interface Voucher {
    id: number;
    progressive: string;
    status: string;
    voucher_year: string;
    voucher_date: string;
    location: string;
    location_field: string;
    customer: Customer;
    notes: string;
}
