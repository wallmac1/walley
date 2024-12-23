export interface Article {
    idticketline: number;
    type_line: number;
    description: string;
    code: string;
    title: string,
    quantity: string;
    refidum: number;
    refidarticle: number | null;
    refidarticledata: number | null;
    refidarticleprice: number | null;
    serialnumber: number;
    taxablepurchase: string | null;
    taxablesale: string | null;
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

export interface MeasurementUnit {
    id: number;
    acronym: string;
    description: string;
}