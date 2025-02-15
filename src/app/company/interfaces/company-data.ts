export interface CompanyData {
    info: {
        naturalPerson: number;
        name: string | null;
        surname: string | null;
        business_name: string | null;
        refidcompany: number;
        tax_regime: number | null;
        fiscalcode: string | null;
        vat: string | null;
        title: string | null;
        pec: string | null;
        eori: string | null;
        phone: string | null;
        fax: string | null;
        email: string | null;
        lender_code: string | null;
    },
    professional_board: {
        board_name: string | null;
        board_number: string | null;
        subscription_date: string | null;
        province: string | null;
    }
}
