export interface InvoiceBodyReadonly {
    id: number;
    description: string | null;
    um: string;
    quantity: string | null;
    price: string | null;
    discounts: {isDiscount: number, value: string}[] | null;
    total: string | null;
    vat: number | null;
    stampLine: boolean;
}