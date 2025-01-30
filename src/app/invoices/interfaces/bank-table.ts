export interface BankTable {
    id: number;
    denomination: string;
    institute: string | null;
    address: string | null;
    iban: string;
    active: number;
}