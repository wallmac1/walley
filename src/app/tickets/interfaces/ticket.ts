import { Client } from "./client";
import { Department } from "./department";
import { Location } from "./location";
import { Profile } from "./profile";
import { Status } from "./status";
import { SubStatus } from "./sub-status";

export interface Ticket {
    id: number;
    status: Status;
    subStatus: SubStatus;
    internal: number;
    title: string;
    description: string;
    date_ticket: string;
    client: Client | null;
    location: Location | null;
    department: Department[] | null;
    incharge: Profile | null;
    keepinformed: Profile[] | null;
    note: string | null;
}