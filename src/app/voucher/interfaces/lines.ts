import { Article } from "./article";

export interface Lines {
    idvoucherline: number;
    type_line: number;
    description: string;
    code?: string;
    quantity: string;
    refidum?: number;
    article: Article;
    serialnumber?: number;
    taxable_purchase?: number | null;
    taxable_sale?: number | null;
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
    file: {
        src: string;
    }
}

export interface MeasurementUnit {
    id: number;
    acronym: string;
}
