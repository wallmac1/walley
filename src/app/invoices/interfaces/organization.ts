import { City } from "./city";

export interface Organization {
    municipality: City | null;
    province: string | null;
    postalcode: string | null;
    street: string | null;
    number: string | null;
}