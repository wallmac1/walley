export interface TherapyTable {
    id: number;
    therapy_date: string | null;
    totalsessions: string | null;
    description: string | null;
    info: {
        files: {id: number, src: string}[];
    }
}