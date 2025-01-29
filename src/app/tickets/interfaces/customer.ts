export interface Customer {
    rifidanacliforprodati: number,
    id: number,
    denominazione?: string | null,
    codicefiscale?: string | null,
    cognome?: string | null,
    data_nascita?: string | null;
    email?: string | null;
    nome?: string | null;
    piva?: string | null;
    telefono?: string | null;
    type?: number | string | null;
    address?: string | null;
    pec?: string | null;
    sdi?: string | null;
    cap?: string | null;
    city?: string | null;
    house_number?: string | null;
    country?: string | null;
    region?: string | null;
}
