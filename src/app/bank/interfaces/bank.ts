export interface Bank {
    id: number;
    denomination: string | null;
    iban: string | null;
    abi: {code: string | null, description: string | null};
    cab: {code: string | null, description: string | null};
    cc: string | null;
    bic: string | null;
}