import { MeasurementUnit } from "../../interfaces/measurement-unit";

export interface Article {
    idarticle: number;
    code: string;
    progressive: number;
    total_quantityavailable?: number; // Disponibile
    total_quantitystorage?: number; // Magazzino
    total_unitavailable: number;
    total_unitstorage: number;
    article_data: ArticleData;
    article_storage: ArticleStorage[];
    management_sn: number; // 0 o 1
    management_qnt: number; // 0 o 1
}

export interface ArticleData {
    idarticledata: number
    title: string;
    description: string | null;
    note: string | null;
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

export interface ArticleStorage {
    idarticlestorage: number;
    serialnumber?: string;
    unit_taxablepurchase: string | null; // Imponibile Acquisto Unità
    unit_taxablerecommended: string | null; // Imponibile Consigliato Unità
    unit_storage: number;
    unit_available: number;
    qnt_taxablepurchase?: string | null; // Imponibile Acquisto Quantità
    qnt_taxablerecommended?: string | null; // Imponibile Consigliato Quantità
    qnt_storage?: number;
    qnt_available?: number; 
    vatpurchase: string | null; // Iva Acquisto
    vatrecommended: string | null; // Iva Consigliata
    pricepurchase: string | null; // Prezzo Acquisto
    pricerecommended: string | null; // Prezzo Consigliato
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

export interface ArticleDocumentTable {
    iddocument: number;
    document_title: string | null;
    document_type: string | null;
    serialnumber?: string | null;
    path: string | null;
}