export interface InvoicePaymentReadonly {
    id: number;
    type: string;
    condition: string;
    lines: {
        type: string;
        deadline: string,
        amount: string
    }[];
}