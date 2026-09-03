import "./index.css";
import {PetRockComposition} from "./Composition";
import {VictorLustigComposition} from "./VictorLustig";
import {VictorLustigV2Composition} from "./VictorLustigV2";
import {VictorLustigV3Composition} from "./VictorLustigV3";
import {MilgramV1Composition} from "./MilgramV1";
import {MilgramV2Composition} from "./MilgramV2";
import {ChoiceOverloadComposition} from "./ChoiceOverload";
import {ChoiceOverloadV2Composition} from "./ChoiceOverloadV2";
import {ChoiceOverloadV3Composition} from "./ChoiceOverloadV3";
import {PhoneBan2026Composition} from "./PhoneBan2026";
import {PhoneBan2026V2Composition} from "./PhoneBan2026V2";
import {PhoneBan2026V21Composition} from "./PhoneBan2026V21";

export const RemotionRoot: React.FC = () => (
  <>
    <PetRockComposition />
    <VictorLustigComposition />
    <VictorLustigV2Composition />
    <VictorLustigV3Composition />
    <MilgramV1Composition />
    <MilgramV2Composition />
    <ChoiceOverloadComposition />
    <ChoiceOverloadV2Composition />
    <ChoiceOverloadV3Composition />
    <PhoneBan2026Composition />
    <PhoneBan2026V2Composition />
    <PhoneBan2026V21Composition />
  </>
);
