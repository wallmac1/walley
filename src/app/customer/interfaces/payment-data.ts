export interface PaymentData {
    idregistry: number;
    paymentMethod: number | null;
    company_denomination: string | null;
    company_iban: string | null;
    company_abi: string | null;
    company_cab: string | null;
    company_cc: string | null;
    company_bic: string | null;
    customer_denomination: string | null;
    customer_iban: string | null;
    customer_abi: string | null;
    customer_cab: string | null;
    customer_cc: string | null;
    customer_bic: string | null;
}