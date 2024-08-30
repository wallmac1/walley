import { Customer } from "./customer";
import { Department } from "./department";
import { Location } from "./location";
import { User } from "./user";
import { Status } from "./status";
import { SubStatus } from "./substatus";

export interface Ticket {
    id: number;
    status: Status;
    internal: number;
    title: string;
    description: string;
    date_ticket: string;
    customer: Customer | null;
    location: Location | null;
    department: Department[] | number[] | null;
    incharge: User | number | null;
    keepinformed: User[] | number[] | null;
    note: string | null;
}