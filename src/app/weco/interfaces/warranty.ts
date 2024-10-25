import { Cluster } from "./clusterData";
import { Inverter } from "./inverterData";

export interface Warranty {
    id: number;
    title: string;
    date: Date;
    problemDescription: string;
    status: string;
    inverters: Inverter;
    clusters: Cluster;
}
