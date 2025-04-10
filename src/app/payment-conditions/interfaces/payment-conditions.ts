export interface PaymentConditions {
    id: number;
    code: string | null;
    description: string | null;
    xml_code: string | null;
    installment_number: number;
    periodicity: string | null;
    deadline: string | null;
    deadline_type: number | null;
    exact_day: string | null;
    bank_type: {id: number, type: string } | null; 
    notes: string | null;
}
