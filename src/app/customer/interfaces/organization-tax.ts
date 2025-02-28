import { AutocompleteMunicipality } from "./autocomplete-municipality";

export interface OrganizationTax {
    idregistry: number;
    city: AutocompleteMunicipality | null;
    province: string | null;
    organization_postalcode: string | null;
    organization_street: string | null;
    organization_street_number: string | null;
    tax_naturalPerson: number;
    tax_name: string | null;
    tax_surname: string | null;
    tax_denomination: string | null;
    tax_vat: string | null;
}
