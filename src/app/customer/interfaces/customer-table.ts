export interface CustomerTable {
    idregistry: number;
    denomination: string | null;
    fiscalcode: string | null;
    vat: string | null;
    mainAddress: string | null;
    info: string | null;
    health_fc: {value: number, description: string} | null;
}