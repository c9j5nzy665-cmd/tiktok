import {
  AbsoluteFill,
  Audio,
  Composition,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {MilgramV1Video} from "./MilgramV1";

const RED = "#f20d2f";
const TOTAL_FRAMES = 1740;
const FPS = 30;

const cuts = [105, 330, 480, 680, 840, 975, 1185, 1440, 1650];

const Vignette = () => {
  const frame = useCurrentFrame();
  const y = (frame * 6) % 1920;
  return (
    <AbsoluteFill style={{pointerEvents: "none", zIndex: 62}}>
      <AbsoluteFill style={{boxShadow: "inset 0 0 240px rgba(0,0,0,.52)"}} />
      <div style={{position: "absolute", left: 55, right: 55, top: y, height: 2, background: "linear-gradient(90deg,transparent,rgba(242,13,47,.13),transparent)"}} />
    </AbsoluteFill>
  );
};

const ImpactFlash = () => {
  const frame = useCurrentFrame();
  const d = cuts.reduce((best, cut) => Math.min(best, Math.abs(frame - cut)), 999);
  const opacity = interpolate(d, [0, 1, 3], [0.13, 0.05, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return <AbsoluteFill style={{pointerEvents: "none", zIndex: 76, background: `rgba(255,255,255,${opacity})`}} />;
};

const HookWarning = () => {
  const frame = useCurrentFrame();
  if (frame < 42 || frame > 102) return null;
  const local = frame - 42;
  const opacity = interpolate(local, [0, 7, 46, 60], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const scale = interpolate(local, [0, 8, 20], [0.76, 1.08, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <div style={{position: "absolute", left: 78, top: 625, zIndex: 68, opacity, transform: `scale(${scale}) rotate(-2deg)`, transformOrigin: "left center", border: `4px solid ${RED}`, padding: "11px 17px 9px", background: "rgba(0,0,0,.68)", color: "white", fontFamily: "Arial,Helvetica,sans-serif", fontSize: 22, fontWeight: 950, letterSpacing: 5}}>
      450 V · ILS PENSAIENT QUE C’ÉTAIT RÉEL
    </div>
  );
};

const StopSignal = () => {
  const frame = useCurrentFrame();
  if (frame < 500 || frame >= 680) return null;
  const local = frame - 500;
  const opacity = interpolate(local, [0, 10, 145, 179], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const x = interpolate(local, [0, 26], [-70, 0], {extrapolateRight: "clamp"});
  return (
    <div style={{position: "absolute", left: 80, top: 900, zIndex: 66, opacity, transform: `translateX(${x}px)`, fontFamily: "Arial,Helvetica,sans-serif"}}>
      <div style={{fontSize: 18, letterSpacing: 6, color: "#8c8c8c", marginBottom: 10}}>150 VOLTS</div>
      <div style={{display: "inline-block", background: RED, color: "white", padding: "11px 18px 9px", fontSize: 42, fontWeight: 950, letterSpacing: 2}}>« JE VEUX SORTIR. »</div>
      <div style={{marginTop: 16, width: 410, height: 3, background: "#333"}}><div style={{height: "100%", width: `${Math.min(100, local * 0.7)}%`, background: RED}} /></div>
    </div>
  );
};

const AuthorityCommand = () => {
  const frame = useCurrentFrame();
  if (frame < 700 || frame >= 840) return null;
  const local = frame - 700;
  const opacity = interpolate(local, [0, 8, 112, 139], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const scale = interpolate(local, [0, 10, 34], [0.9, 1.04, 1], {extrapolateRight: "clamp"});
  return (
    <div style={{position: "absolute", right: 78, top: 820, width: 520, zIndex: 67, opacity, transform: `scale(${scale})`, transformOrigin: "right center", textAlign: "right", fontFamily: "Arial,Helvetica,sans-serif"}}>
      <div style={{fontSize: 17, color: "#8a8a8a", letterSpacing: 6}}>L’AUTORITÉ RÉPÈTE</div>
      <div style={{fontSize: 72, lineHeight: .92, fontWeight: 950, marginTop: 12, color: "white"}}>CONTINUEZ.</div>
      <div style={{height: 6, width: 180, background: RED, margin: "18px 0 0 auto"}} />
    </div>
  );
};

const ResultSmash = () => {
  const frame = useCurrentFrame();
  if (frame < 846 || frame >= 975) return null;
  const local = frame - 846;
  const opacity = interpolate(local, [0, 5, 105, 128], [0, 0.28, 0.28, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const scale = interpolate(local, [0, 20, 128], [0.72, 1.02, 1.13], {extrapolateRight: "clamp"});
  return (
    <div style={{position: "absolute", left: -20, right: -20, top: 650, zIndex: 4, textAlign: "center", opacity, transform: `scale(${scale})`, color: RED, fontFamily: "Arial,Helvetica,sans-serif", fontSize: 390, lineHeight: .72, fontWeight: 950, letterSpacing: -22}}>
      65%
    </div>
  );
};

const TruthReveal = () => {
  const frame = useCurrentFrame();
  if (frame < 975 || frame >= 1185) return null;
  const local = frame - 975;
  const opacity = interpolate(local, [0, 9, 176, 209], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const first = local < 82;
  return (
    <div style={{position: "absolute", left: 80, right: 80, top: 865, zIndex: 67, opacity, fontFamily: "Arial,Helvetica,sans-serif"}}>
      <div style={{fontSize: 18, letterSpacing: 6, color: "#8b8b8b"}}>LA RÉVÉLATION</div>
      <div style={{marginTop: 10, fontSize: 76, lineHeight: .92, fontWeight: 950, color: first ? RED : "white"}}>{first ? "0 VOLT RÉEL." : "UN ACTEUR."}</div>
      <div style={{marginTop: 18, fontSize: 22, lineHeight: 1.35, color: "#b5b5b5", maxWidth: 650}}>{first ? "Les décharges étaient simulées." : "Mais les participants croyaient pouvoir faire du mal."}</div>
    </div>
  );
};

const ObedienceTag = () => {
  const frame = useCurrentFrame();
  if (frame < 1275 || frame >= 1440) return null;
  const local = frame - 1275;
  const opacity = interpolate(local, [0, 12, 138, 164], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <div style={{position: "absolute", right: 74, top: 330, zIndex: 67, opacity, fontFamily: "Arial,Helvetica,sans-serif", writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: 16, fontWeight: 900, letterSpacing: 5, color: "#8a8a8a"}}>
      AUTORITÉ · PRESSION · OBÉISSANCE
    </div>
  );
};

const FinalAccent = () => {
  const frame = useCurrentFrame();
  if (frame < 1560 || frame >= 1650) return null;
  const local = frame - 1560;
  const opacity = interpolate(local, [0, 8, 72, 89], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const width = interpolate(local, [5, 38], [0, 100], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <div style={{position: "absolute", left: 82, right: 82, top: 1215, zIndex: 67, opacity, fontFamily: "Arial,Helvetica,sans-serif"}}>
      <div style={{fontSize: 19, letterSpacing: 7, color: "#8d8d8d"}}>ET VOUS ?</div>
      <div style={{height: 5, width: `${width}%`, background: RED, marginTop: 14}} />
    </div>
  );
};

export const MilgramV2Video = () => (
  <AbsoluteFill style={{background: "#050505"}}>
    <MilgramV1Video />

    <Sequence from={48} durationInFrames={28}><Audio src={staticFile("milgram-hit.wav")} volume={0.18} /></Sequence>
    <Sequence from={500} durationInFrames={28}><Audio src={staticFile("milgram-hit.wav")} volume={0.14} /></Sequence>
    <Sequence from={705} durationInFrames={28}><Audio src={staticFile("milgram-hit.wav")} volume={0.18} /></Sequence>
    <Sequence from={846} durationInFrames={28}><Audio src={staticFile("milgram-hit.wav")} volume={0.24} /></Sequence>
    <Sequence from={975} durationInFrames={28}><Audio src={staticFile("milgram-hit.wav")} volume={0.18} /></Sequence>
    <Sequence from={1057} durationInFrames={28}><Audio src={staticFile("milgram-hit.wav")} volume={0.13} /></Sequence>
    <Sequence from={1590} durationInFrames={28}><Audio src={staticFile("milgram-hit.wav")} volume={0.18} /></Sequence>

    <ResultSmash />
    <HookWarning />
    <StopSignal />
    <AuthorityCommand />
    <TruthReveal />
    <ObedienceTag />
    <FinalAccent />
    <Vignette />
    <ImpactFlash />
  </AbsoluteFill>
);

export const MilgramV2Composition = () => (
  <Composition id="MilgramV2" component={MilgramV2Video} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
);
