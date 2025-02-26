export interface HistoryPopup {
    datetime: string;
    fiscalcode: string;
    vat: string;
    country: string;
    sdi: string;
    pec: string;
    name: string;
    surname: string;
    businessName: string;
    naturalPerson: number;
    sameCode: number;
    user_created: {nickname: string, datetime: string};
    user_updated: {nickname: string, datetime: string};
}