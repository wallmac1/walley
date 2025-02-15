import { City } from "../../invoices/interfaces/city";

export interface CompanyHeadquarter {
    legal_headquarter: {
        country: number;
        street: string | null;
        street_number: string | null;
        municipality: City | null;
        postalcode: string | null;
        province: string | null;
    }
    company_building: {
        country: number;
        street: string | null;
        street_number: string | null;
        municipality: City | null;
        postalcode: string | null;
        province: string | null;
    },
    rea: {
        number: string | null;
        province: string | null;
        assets: string | null;
        sole_shareholder: number;
        closure: number;
    }
}
