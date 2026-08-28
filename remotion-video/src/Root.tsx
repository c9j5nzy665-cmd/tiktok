import "./index.css";
import {PetRockComposition} from "./Composition";
import {VictorLustigComposition} from "./VictorLustig";
import {VictorLustigV2Composition} from "./VictorLustigV2";
import {VictorLustigV3Composition} from "./VictorLustigV3";
import {MilgramV1Composition} from "./MilgramV1";
import {MilgramV2Composition} from "./MilgramV2";
import {ChoiceOverloadComposition} from "./ChoiceOverload";

export const RemotionRoot: React.FC = () => (
  <>
    <PetRockComposition />
    <VictorLustigComposition />
    <VictorLustigV2Composition />
    <VictorLustigV3Composition />
    <MilgramV1Composition />
    <MilgramV2Composition />
    <ChoiceOverloadComposition />
  </>
);
