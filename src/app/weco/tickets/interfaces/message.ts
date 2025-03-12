import { Image } from "../../interfaces/image";

export interface Message {
    id: number;
    description: string | null;
    public: number | null;
    attachments: Image[];
    portal: number; //0: walley, 1: wecare
    user_created: {
        id: number; 
        nickname: string; 
        datetime: string;
        date_only: string;
        time_only: string
    };
    user_updated: {
        id: number; 
        nickname: string; 
        datetime: string;
        date_only: string;
        time_only: string
    }
}