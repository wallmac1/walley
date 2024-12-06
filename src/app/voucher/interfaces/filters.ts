import { Customer } from "../../tickets/interfaces/customer";
import { Status } from "./status";

export interface Filters {
    date_from: Date | null;
    date_to: Date | null;
    customer: Customer | null;
    status: Status | null;
}