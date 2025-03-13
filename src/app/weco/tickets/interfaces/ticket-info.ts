import { SafeUrl } from "@angular/platform-browser";

export interface TicketInfo {
    idsystem: number;
    public: number;
    incharge: {id: number; nickname: string; isInCharge: number};
    progressive: string | null;
    openingDate: string | null;
    description: string | null;
    requestType: number | null;
    email: string | null;
    note: string;
    attachments: {id: number, src: string | SafeUrl, ext: string, title: string}[];
    inverterList: {id: number, sn: string, selected_inverter: number}[];
    batteryList: {id: number, sn: string, selected_battery: number}[];
    user_created: {id: number; nickname: string; datetime: string};
    user_updated: {id: number; nickname: string; datetime: string};
    ticketStatus: {idstatus: number; color: string; name: string; type_status: number};
}