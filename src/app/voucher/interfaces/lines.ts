import { LineFile } from "./line-file";

export interface Lines {
    idvoucherline: number;
    type_line: number;
    description: string;
    code?: string;
    hours?: number | null;
    title?: string,
    minutes?: number | null;
    quantity: string;
    refidum?: number | null;
    refidarticle?: number | null;
    refidarticledata?: number | null;
    refidarticleprice?: number | null;
    serialnumber?: number;
    taxablepurchase?: string | null;
    taxablesale?: string | null;
    attachments: LineFile[];
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
    // file: {
    //     src: string;
    // }
}

export interface MeasurementUnit {
    id: number;
    acronym: string;
    description: string;
}
