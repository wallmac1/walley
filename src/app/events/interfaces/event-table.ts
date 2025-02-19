import { Customer } from "../../customer/interfaces/customer";
import { Trainee } from "../../customer/interfaces/trainee";

export interface EventTable {
    date: string;
    customer: string;
    course: string;
    start_time: string;
    end_time: string;
}
