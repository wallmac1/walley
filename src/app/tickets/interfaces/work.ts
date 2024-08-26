import { Profile } from "./profile";

export interface Work {
    type: number;
    id: number;
    dateTime: string;
    date?: string;
    worktime?: string;
    price?: string;
    user: Profile;
    public?: number;
    attached: string[];
    description: string;
}