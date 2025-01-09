import { LineFile } from "../../voucher/interfaces/line-file";
import { User } from "./user";

export interface TicketLine {
    idticketline: number;
    idticket: number;
    public?: number;
    type_line: number; //1: job, 2: article, 3: message, 4: status
    description: string;
    code?: string;
    hours?: number | null;
    title?: string,
    minutes?: number | null;
    quantity: string;
    refidum?: number | null;
    refidarticle?: number | null;
    refidarticledata?: number | null;
    refidarticleprice?: number | null;
    serialnumber?: string;
    taxablepurchase?: string | null;
    taxablesale?: string | null;
    attachments: LineFile[];
    timeline: string;
    status?: string;
    substatus?: string;
    incharge?: User | null;
    color?: string; 
    user_created?: {
        id: number;
        nickname: string;
        datetime: string;
    };
    user_updated?: {
        id: number;
        nickname: string;
        datetime: string;      
    };
    // file: {
    //     src: string;
    // }
}