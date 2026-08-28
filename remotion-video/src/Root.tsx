import "./index.css";
import {PetRockComposition} from "./Composition";
import {VictorLustigComposition} from "./VictorLustig";
import {VictorLustigV2Composition} from "./VictorLustigV2";
import {VictorLustigV3Composition} from "./VictorLustigV3";

export const RemotionRoot: React.FC = () => (
  <>
    <PetRockComposition />
    <VictorLustigComposition />
    <VictorLustigV2Composition />
    <VictorLustigV3Composition />
  </>
);
