import { Customer } from "./customer";
import { Department } from "./department";
import { Location } from "./location";
import { User } from "./user";
import { Status } from "./status";
import { AutocompleteCustomer } from "../../customer/interfaces/autocomplete-customer";

export interface TicketInfo {
    id: number;
    status: Status;
    internal: number;
    title: string;
    description: string;
    ticket_date: string;
    customer: AutocompleteCustomer | null;
    location: Location | null;
    departments: Department[] | number[] | null;
    incharge: User | null;
    keepinformed: User[] | number[] | null;
    notes: string | null;
}