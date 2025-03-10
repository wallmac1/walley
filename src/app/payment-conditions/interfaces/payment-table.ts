export interface PaymentTable {
    id: number;
    code: string | null;
    description: string | null;
    xml_code: {id: number; description: string, code: string} | null;
    installments_number: number;
    periodicity: string | null;
    deadline: string | null;
    deadline_type: {id: number; name: string} | null;
    exact_day: string | null;
    bank_type: {id: number; type: string} | null; 
    default: number;
}
