export interface SystemStatus {
    id: number;
    name: string;
    color: string;
    message: string | null;
    message_date: string | null;
    warranty_extend: number | null;
    date_request: string | null;
    date_endwarranty: string | null;
}