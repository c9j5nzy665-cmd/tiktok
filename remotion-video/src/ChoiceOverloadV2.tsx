import {
  AbsoluteFill,
  Audio,
  Composition,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {ChoiceOverloadVideo} from "./ChoiceOverload";

const RED = "#f20d2f";
const TOTAL_FRAMES = 1800;
const FPS = 30;

const Vignette = () => {
  const frame = useCurrentFrame();
  const y = (frame * 5) % 1920;
  return (
    <AbsoluteFill style={{pointerEvents: "none", zIndex: 61}}>
      <AbsoluteFill style={{boxShadow: "inset 0 0 250px rgba(0,0,0,.48)"}} />
      <div style={{position: "absolute", left: 55, right: 55, top: y, height: 2, background: "linear-gradient(90deg,transparent,rgba(242,13,47,.10),transparent)"}} />
    </AbsoluteFill>
  );
};

const HookPunch = () => {
  const frame = useCurrentFrame();
  if (frame < 105 || frame >= 180) return null;
  const local = frame - 105;
  const opacity = interpolate(local, [0, 7, 58, 74], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const scale = interpolate(local, [0, 10, 28], [.72, 1.08, 1], {extrapolateRight: "clamp"});
  return (
    <div style={{position: "absolute", right: 78, top: 1180, zIndex: 66, opacity, transform: `scale(${scale}) rotate(-3deg)`, transformOrigin: "right center", fontFamily: "Arial,Helvetica,sans-serif"}}>
      <div style={{display: "inline-block", border: `5px solid ${RED}`, color: RED, background: "rgba(0,0,0,.76)", padding: "12px 18px 10px", fontSize: 27, fontWeight: 950, letterSpacing: 5}}>≈ 10× PLUS D’ACHATS</div>
      <div style={{fontSize: 18, color: "#999", letterSpacing: 4, textAlign: "right", marginTop: 12}}>AVEC 6 CHOIX</div>
    </div>
  );
};

const AttractionMeter = () => {
  const frame = useCurrentFrame();
  if (frame < 480 || frame >= 690) return null;
  const local = frame - 480;
  const a = interpolate(local, [15, 90], [0, 60], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const b = interpolate(local, [80, 155], [0, 40], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const opacity = interpolate(local, [0, 12, 182, 209], [0, 1, 1, 0], {extrapolateRight: "clamp"});
  return (
    <div style={{position: "absolute", left: 82, right: 82, top: 1240, zIndex: 65, opacity, fontFamily: "Arial,Helvetica,sans-serif"}}>
      <div style={{fontSize: 17, color: "#8b8b8b", letterSpacing: 5, marginBottom: 14}}>POUVOIR D’ATTRACTION</div>
      <div style={{height: 8, background: "#262626", marginBottom: 14}}><div style={{height: "100%", width: `${a}%`, background: RED}} /></div>
      <div style={{height: 8, background: "#262626"}}><div style={{height: "100%", width: `${b}%`, background: "#bdbdbd"}} /></div>
    </div>
  );
};

const ReversalSmash = () => {
  const frame = useCurrentFrame();
  if (frame < 865 || frame >= 990) return null;
  const local = frame - 865;
  const opacity = interpolate(local, [0, 5, 102, 124], [0, 1, 1, 0], {extrapolateRight: "clamp"});
  const scale = interpolate(local, [0, 14, 124], [.78, 1.03, 1.09], {extrapolateRight: "clamp"});
  return (
    <div style={{position: "absolute", left: 64, right: 64, top: 1180, zIndex: 66, opacity, transform: `scale(${scale})`, fontFamily: "Arial,Helvetica,sans-serif"}}>
      <div style={{display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 20}}>
        <div style={{textAlign: "right"}}><div style={{fontSize: 19, letterSpacing: 5, color: "#888"}}>24 CHOIX</div><div style={{fontSize: 90, lineHeight: .9, fontWeight: 950, color: RED}}>3%</div></div>
        <div style={{fontSize: 54, fontWeight: 950, color: "#666"}}>VS</div>
        <div><div style={{fontSize: 19, letterSpacing: 5, color: "#888"}}>6 CHOIX</div><div style={{fontSize: 90, lineHeight: .9, fontWeight: 950}}>31%</div></div>
      </div>
    </div>
  );
};

const OverloadCascade = () => {
  const frame = useCurrentFrame();
  if (frame < 1020 || frame >= 1230) return null;
  const local = frame - 1020;
  const labels = ["COMPARER", "DOUTER", "REPORTER", "RENONCER"];
  return (
    <div style={{position: "absolute", right: 78, top: 1090, zIndex: 65, fontFamily: "Arial,Helvetica,sans-serif", textAlign: "right"}}>
      {labels.map((label, i) => {
        const l = local - i * 24;
        const o = interpolate(l, [0, 8, 120, 160], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        const x = interpolate(l, [0, 18], [70, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        return <div key={label} style={{opacity: o, transform: `translateX(${x}px)`, fontSize: 29, fontWeight: 950, letterSpacing: 4, color: i === 3 ? RED : "#d3d3d3", marginTop: 12}}>{label}</div>;
      })}
    </div>
  );
};

const ModernNoise = () => {
  const frame = useCurrentFrame();
  if (frame < 1230 || frame >= 1470) return null;
  const local = frame - 1230;
  const opacity = interpolate(local, [0, 10, 205, 239], [0, .22, .22, 0], {extrapolateRight: "clamp"});
  const x = interpolate(local, [0, 239], [80, -140], {extrapolateRight: "clamp"});
  return (
    <div style={{position: "absolute", left: 0, right: 0, top: 1070, zIndex: 3, opacity, transform: `translateX(${x}px)`, whiteSpace: "nowrap", fontFamily: "Arial,Helvetica,sans-serif", fontSize: 150, fontWeight: 950, letterSpacing: -8, color: RED}}>
      999+ OPTIONS · 999+ OPTIONS · 999+ OPTIONS
    </div>
  );
};

const FinalQuestion = () => {
  const frame = useCurrentFrame();
  if (frame < 1565 || frame >= 1710) return null;
  const local = frame - 1565;
  const opacity = interpolate(local, [0, 10, 116, 144], [0, 1, 1, 0], {extrapolateRight: "clamp"});
  const width = interpolate(local, [10, 55], [0, 100], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <div style={{position: "absolute", left: 82, right: 82, top: 1215, zIndex: 66, opacity, fontFamily: "Arial,Helvetica,sans-serif"}}>
      <div style={{fontSize: 19, color: "#888", letterSpacing: 6}}>PLUS DE CHOIX = PLUS DE LIBERTÉ ?</div>
      <div style={{height: 5, width: `${width}%`, background: RED, marginTop: 14}} />
      <div style={{fontSize: 42, fontWeight: 950, marginTop: 18}}>PAS TOUJOURS.</div>
    </div>
  );
};

const ImpactFlash = () => {
  const frame = useCurrentFrame();
  const cuts = [105, 480, 690, 865, 990, 1230, 1470, 1590, 1710];
  const d = cuts.reduce((best, cut) => Math.min(best, Math.abs(frame - cut)), 999);
  const opacity = interpolate(d, [0, 1, 4], [.14, .05, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return <AbsoluteFill style={{pointerEvents: "none", zIndex: 75, background: `rgba(255,255,255,${opacity})`}} />;
};

export const ChoiceOverloadV2Video = () => (
  <AbsoluteFill style={{background: "#050505"}}>
    <ChoiceOverloadVideo />
    <Sequence from={105} durationInFrames={28}><Audio src={staticFile("choice-overload-hit.wav")} volume={.18} /></Sequence>
    <Sequence from={865} durationInFrames={28}><Audio src={staticFile("choice-overload-hit.wav")} volume={.25} /></Sequence>
    <Sequence from={1020} durationInFrames={28}><Audio src={staticFile("choice-overload-hit.wav")} volume={.15} /></Sequence>
    <Sequence from={1565} durationInFrames={28}><Audio src={staticFile("choice-overload-hit.wav")} volume={.16} /></Sequence>
    <ModernNoise />
    <HookPunch />
    <AttractionMeter />
    <ReversalSmash />
    <OverloadCascade />
    <FinalQuestion />
    <Vignette />
    <ImpactFlash />
  </AbsoluteFill>
);

export const ChoiceOverloadV2Composition = () => (
  <Composition id="ChoiceOverloadV2" component={ChoiceOverloadV2Video} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
);
