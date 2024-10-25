import { Inverter } from "./inverterData";

export interface StepFive {
  inverter_communication: number | null | boolean;
  inverter_power: number | null | boolean;
  inverters_list: Inverter[];
}
