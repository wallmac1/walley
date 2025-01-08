import { Customer } from "./customer";
import { Department } from "./department";
import { Status } from "./status";
import { SubStatus } from "./substatus";
import { User } from "./user";

export interface Filters { 
    incharge: User | null;
    department: Department | null;
    customer: Customer | null;
    status: Status | null;
    substatus: SubStatus | null;
    orderby_creation?: string | null;
    orderby_lastupdate?: string | null;
    notclosed: number;
}