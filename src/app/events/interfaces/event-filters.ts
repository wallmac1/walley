import { Customer } from "../../customer/interfaces/customer";
import { Trainee } from "../../customer/interfaces/trainee";

export interface EventFilters {
    isPeriod: number;
    datefrom: string | null;
    dateto: string | null;
    people_isCustomer: number;
    people_isTrainee: number;
    people_isAll: number;
    customer: Customer | null;
    trainee: Trainee | null;
    event_isAll: number;
    event_isOther: number;
    event_isCourse: number;
    course_type: number | null;
    notEnded: number;
}