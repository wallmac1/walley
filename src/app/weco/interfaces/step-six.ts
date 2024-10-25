import { Cluster } from "./clusterData";
import { Inverter } from "./inverterData";

export interface StepSix {
  cluster_parallel: number | null;
  clusters_list: Cluster[];
  inverters_list: Inverter[];
  cluster_numberdevices: number | null;
  cluster_singlebattery: number | null;
}
