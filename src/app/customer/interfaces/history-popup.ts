export interface HistoryPopup {
    datetime_variation: string;
    fiscalcode: string;
    vat: string;
    country: {id: number, common_name: string} | null;
    sdi: string;
    pec: string;
    name: string;
    surname: string;
    businessName: string;
    naturalPerson: number;
    sameCode: number;
    user_created: {id: number, nickname: string, datetime: string};
    user_updated: {id: number, nickname: string, datetime: string};
}