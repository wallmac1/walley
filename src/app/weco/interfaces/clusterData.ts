import { Inverter } from "./inverterData";

export interface ClusterData {
  cluster_singlebattery: number | null;
  cluster_parallel: number | null;
  cluster_number: number | null;
  cluster_numberdevices: number | null;
  refidwecaresystemvolt: number | null;
  system_model: number | null;
  refidwecaresystemtype: number | null;
  clusters_list: Cluster[];
}

export interface Cluster {
  id: number;
  name: string
  batteries: Battery[];
  inverters: Inverter[];
}
export interface Battery {
  id: number;
  serialnumber: string;
  masterorslave: number | null;
}
