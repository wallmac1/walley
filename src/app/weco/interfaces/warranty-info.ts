export interface WarrantyInfo {
    listInverter: {
        id: number,
        serialnumber: string,
        inverter_date: string,
        warranty_limit: string,
        warrantyinverter_end: string;
        warrantyinverter_endextension: string;
    }[];
    warrantyInvertervalid: number | null;
    warrantyInverterExtended: number | null;
    warrantyInverterValidComment: string | null;
    warrantyInverterExtendedComment: string | null;
    listBatteries: {
        id: number,
        serialnumber: string,
        battery_date: string,
        warranty_limit: string,
    }[];
    warrantyBatteryValid: number | null;
    warrantyBatteryValidComment: string | null;
}

export interface WarrantyInverterForm {
    warrantyInverterValid: number | null;
    warrantyInverterExtended: number | null;
    warrantyInverterValidComment: string | null;
    warrantyInverterExtendedComment: string | null;
}

export interface WarrantyBatteryForm {
    warrantyBatteryValid: number | null;
    warrantyBatteryValidComment: string | null;
}