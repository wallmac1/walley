import { MeasurementUnit } from "../../interfaces/measurement-unit";

export interface Article {
    id: number;
    code: string;
    progressive: number;
    quantity: string;
    article_data: ArticleData;
    article_price: ArticlePrice;
}

export interface ArticleData {
    title: string;
    description: string | null;
    refidarticle: number;
    um: MeasurementUnit | null;
    date_snapshot: string | null; // Data Variazione
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

export interface ArticlePrice {
    refidarticle: number;
    serialnumber: string;
    taxablepurchase: string | null;
    taxablesale: string | null;
    taxablerecommended: string | null;
    vatpurchase: string | null;
    vatsale: string | null;
    vatrecommended: string | null;
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