export interface Work {
    idticketline: number;
    type_line: number;
    description: string;
    hours: number;
    minutes: number;
    taxablepurchase?: string | null;
    taxablesale?: string | null;
    timeline: string;
    user_created: {
        id: number;
        nickname: string;
        datetime: string;
    };
    user_updated: {
        id: number;
        nickname: string;
        datetime: string;      
    };
}