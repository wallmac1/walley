import { AutocompleteMunicipality } from "../../customer/interfaces/autocomplete-municipality";
import { Country } from "./country";

export interface Address {
    idregistry: number;
    idlocation: number;
    country: number | null;
    city: string | null;
    city_it: AutocompleteMunicipality | null;
    street: string | null;
    postalcode: string | null;
    description: string | null,
    street_number: string | null,
    province: string | null,
    postalCode: string | null,
    legalOffice: number,
    mainOffice: number
}