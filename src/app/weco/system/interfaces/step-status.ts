export interface StepStatus {
    step: number;
    listStepStatus: Status[];
}

export interface Status {
    idstepstatus: number;
    name: string;
    color: string;
    message: string | null;
    message_date: string | null;
}