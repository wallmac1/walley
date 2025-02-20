export interface PaymentTable {
    id: number;
    code: string | null;
    description: string | null;
    xml_code: string | null;
    installment_number: string | null;
    periodicity: string | null;
    deadline: string | null;
    deadline_type: string | null;
    exact_day: string | null;
    bank: string | null; 
}
