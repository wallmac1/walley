import { City } from "../../invoices/interfaces/city";

export interface OrganizationTax {
    municipality: City | null;
    province: string | null;
    postalcode: string | null;
    street: string | null;
    number: string | null;
    naturalPerson: number;
    name: string | null;
    surname: string | null;
    denomination: string | null;
    vat: string | null;
}
