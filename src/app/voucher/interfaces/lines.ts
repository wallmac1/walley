export interface Lines {
    idvoucherline: number;
    type_line: number;
    description: string;
    quantity: string;
    refidum: number;
    user_created: {
        id: number;
        nickname: string;
        datetime: string;
    };
    user_updated: {
        id: number;
        nickname: string;
        datetime: string;      
    }
}

export interface MeasurementUnit {
    id: number;
    acronym: string;
}
