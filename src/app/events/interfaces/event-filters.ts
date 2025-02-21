import { Customer } from "../../customer/interfaces/customer";
import { Student } from "../../customer/interfaces/student";

export interface EventFilters {
    isPeriod: number;
    datefrom: string | null;
    dateto: string | null;
    people_isCustomer: number;
    people_isStudent: number;
    people_isAll: number;
    customer: Customer | null;
    student: Student | null;
    event_isAll: number;
    event_isOther: number;
    event_isCourse: number;
    course_type: number | null;
    notEnded: number;
}