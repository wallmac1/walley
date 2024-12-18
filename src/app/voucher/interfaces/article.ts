export interface Article {
    id: number;
    code: string;
    article_data: {
        id: number;
        title: string;
        description: string | null;
        refidum: number | null;
    },
    article_price: {
        id: number;
        taxablepurchase: number | null;
        taxablesale: number | null;
        serialnumber?: string | null;
    }
}