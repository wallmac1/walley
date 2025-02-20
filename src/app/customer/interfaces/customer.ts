import { City } from "../../invoices/interfaces/city";

export interface Customer {
    naturalPerson: number;
    name: string | null;
    surname: string | null;
    businessName: string | null;
    denomination?: string | null;
    fiscalcode: string | null;
    vat: string | null;
    country: number | null;
    sameCode: number;
    email: string | null;
    pec: string | null;
    phoneNumber: string | null;
    fax: string | null;
    website: string | null;
    eori: string | null;
    gender: number | null;
    birth_country: number | null;
    birth_city: string | null;
    birth_city_it: City | null;
    birthday: string | null;
    job: string | null;
    doctor: string | null;
    specialist: string | null;
    sdi: string | null;
}