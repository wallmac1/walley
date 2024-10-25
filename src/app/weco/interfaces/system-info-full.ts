import { ClusterData } from "./clusterData";
import { Inverter, InverterData } from "./inverterData";
import { StepFive } from "./step-five";
import { StepFour } from "./step-four";
import { StepOne } from "./step-one";
import { StepSix } from "./step-six";
import { StepThree } from "./step-three";
import { StepTwo } from "./step-two";

export interface SystemInfoFull {
    id: number;
    stepOne: StepOne;
    stepTwo: StepTwo;
    stepThree: StepThree;
    stepFour: StepFour;
    stepFive: StepFive;
    stepSix: StepSix;
}
