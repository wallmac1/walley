import { SubStatus } from "./substatus";

export interface Status {
    id: number;
    name: string;
    color?: string;
    substatus: SubStatus;
}