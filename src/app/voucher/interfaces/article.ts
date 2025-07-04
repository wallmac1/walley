export interface Article {
    idarticle: number;
    idarticleprice: number;
    idarticledata: number;
    code: string;
    title: string;
    description: string | null;
    refidum: number | null;
    management_unt: number;
    management_qnt: number;
    qnt_available: number;
    unit_available: number;
    serialnumber: string | null;
    unit_taxablepurchase: string;
    unit_taxablerecommended: string;
}