export interface InverterData {
    // hybridInverter: boolean,
    // parallelInverter: boolean,
    // powerInverter: string,
    // inverterInfo: [{
    //     serialNumber: string,
    //     model: string,
    //     askSupport: boolean,
    // }],
    inverter_number: number | null;
    inverter_hybrid: boolean | number | null;
    inverter_communication: boolean | number | null;
    inverter_power: boolean | number | null;
    inverter_online: boolean | number | null;
    inverters_list: Inverter[];
}

export interface Inverter{
  id: number;
  serialnumber: string;
  model: string;
}
