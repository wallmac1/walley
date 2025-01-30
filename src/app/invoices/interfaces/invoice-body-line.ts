export interface InvoiceBodyLine {
    id: number;
    description: string | null;
    refidum: number | null;
    quantity: string | null;
    price: string | null;
    discount: string | null;
    total: string | null;
    vat: number | null;
}