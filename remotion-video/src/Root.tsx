import "./index.css";
import {PetRockComposition} from "./Composition";
import {VictorLustigComposition} from "./VictorLustig";
import {VictorLustigV2Composition} from "./VictorLustigV2";
import {VictorLustigV3Composition} from "./VictorLustigV3";
import {MilgramV1Composition} from "./MilgramV1";

export const RemotionRoot: React.FC = () => (
  <>
    <PetRockComposition />
    <VictorLustigComposition />
    <VictorLustigV2Composition />
    <VictorLustigV3Composition />
    <MilgramV1Composition />
  </>
);
