export interface System {
    idsystem: number;
    date: string;
    denomination: string;
    title: string;
    status: {
        id: number;
        name: string;
        color: string;
    };
}