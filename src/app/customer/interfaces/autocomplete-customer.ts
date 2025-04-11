export interface AutocompleteCustomer {
    idregistry: number;
    idregistrydata?: number;
    denomination: string;
    fiscalcode: string;
    vat: string;
    naturalPerson: number;
    path: string;
    pec?: string | null;
    sdi?: string | null;
    obj_location?: {
        postalcode?: string | null;
        street_number?: string | null;
        city?: string | null;
        city_it?: {name: string | null; province_name: string | null; region_name: string | null};
        province?: string | null;
        country?: {id: string | null; name: string | null};
        street?: string | null;
        region?: string | null;
    }
}  