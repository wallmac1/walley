import { Customer } from "../../tickets/interfaces/customer";
import { Status } from "./status";

export interface Filters {
    date_from: string | null;
    date_to: string | null;
    customer: Customer | null;
    status: Status | null;
}