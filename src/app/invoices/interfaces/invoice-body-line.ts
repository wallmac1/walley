export interface InvoiceBodyLine {
    id: number;
    description: string | null;
    refidum: number | null;
    quantity: string | null;
    price: string | null;
    discounts: {isDiscount: number, value: string}[] | null;
    total: string | null;
    vat: number | null;
    stampLine: boolean;
}