import { Country } from "./country";

export interface Address {
    id: number;
    country: Country | null;
    city: string | null;
    street: string | null;
    postalcode: string | null;
    description: string | null,
    number: string | null,
    province: string | null,
    postalCode: string | null,
    legalOffice: number,
    mainOffice: number
}