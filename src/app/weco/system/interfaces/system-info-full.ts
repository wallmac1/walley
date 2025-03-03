import { StepFive } from "../../interfaces/step-five";
import { StepFour } from "../../interfaces/step-four";
import { StepOne } from "../../interfaces/step-one";
import { StepSix } from "../../interfaces/step-six";
import { StepThree } from "../../interfaces/step-three";
import { StepTwo } from "../../interfaces/step-two";


export interface SystemInfoFull {
    id: number;
    stepOne: StepOne;
    stepTwo: StepTwo;
    stepThree: StepThree;
    stepFour: StepFour;
    stepFive: StepFive;
    stepSix: StepSix;
}
