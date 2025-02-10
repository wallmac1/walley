export interface SystemTable {
    system: {id: number, path: string};
    insertion_date: string;
    status: { id: number, color: string, title: string };
    title: string;
    description: string;
    ticket_list: { id: number, progressive: string, path: string }[];
    rma_list: string;
    owner: string;
    user: { id: number, nickname: string };
    installer_companyname: string;
    installation_date: string;
    product_systemcomposition: string;
    product_systemweco: string;
    battery_model: string;
    battery_type: string;
}