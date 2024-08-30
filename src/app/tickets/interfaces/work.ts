import { User } from "./user";

export interface Work {
    type: number;
    id: number;
    dateTime: string;
    date?: string;
    hours?: string;
    minutes?: string;
    price?: string;
    price_total?: string;
    user: User;
    public?: number;
    attached: string[];
    description: string;
    status?: {
        previousid: number;
        previous: string;
        actualid: number;
        actual: string; 
    },
    substatus?: {
        id: number;
        actual: string;
    }
}