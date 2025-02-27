export interface Student {
    idregistry: number;
    idstudent: number;
    name: string | null;
    surname: string | null;
    denomination?: string | null;
    fiscalcode: string | null;
    birthday: string | null;
    email: string | null;
    phone: string | null;
}