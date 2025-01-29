export interface InvoiceHeading {
    type: number;
    format: number;
    number: {
        part1: number;
        part2: string;
        part3: string;
    };
    conformity: number;
    date: string;
    administrativeref: string;
    currency: number;
    reason: string;
}