export interface Message {
    idticketline: number;
    type_line: number;
    timeline: string;
    description: string;
    public: number;
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