export interface StatusLine {
    idticketline: number;
    type_line: number;
    timeline: string;
    actual_status: string;
    previous_status: string;
    user_updated: {
        id: number;
        nickname: string;
        datetime: string;      
    };
}