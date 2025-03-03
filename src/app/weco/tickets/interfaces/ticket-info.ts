export interface TicketInfo {
    id: number;
    public: number;
    progressive: string | null;
    openingDate: string | null;
    description: string | null;
    requestType: number | null;
    email: string | null;
    internalNotes: string;
    attachedFiles: {id: number, src: string, ext: string, folder: string, title: string}[];
    inverterList: {id: number, sn: string, selected_inverter: number}[];
    batteryList: {id: number, sn: string, selected_battery: number}[];
}