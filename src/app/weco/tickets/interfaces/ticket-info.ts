export interface TicketInfo {
    id: number;
    progressive: string | null;
    openingDate: string | null;
    description: string | null;
    requestType: string | null;
    email: string | null;
    inverterList: {id: number, sn: string}[];
    batteryList: {id: number, sn: string}[];
}