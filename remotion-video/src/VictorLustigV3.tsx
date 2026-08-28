import {
  AbsoluteFill,
  Audio,
  Composition,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {VictorLustigV2Video} from "./VictorLustigV2";

const RED = "#f20d2f";
const TOTAL_FRAMES = 1791;
const FPS = 30;

const sceneCuts = [100, 360, 590, 820, 1045, 1180, 1310, 1440, 1725];

const CutFlashes = () => {
  const frame = useCurrentFrame();
  const hit = sceneCuts.reduce((best, cut) => {
    const d = Math.abs(frame - cut);
    return Math.min(best, d);
  }, 999);
  const opacity = interpolate(hit, [0, 1, 4], [0.18, 0.08, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{pointerEvents: "none", zIndex: 80, background: `rgba(255,255,255,${opacity})`}} />;
};

const PremiumOverlay = () => {
  const frame = useCurrentFrame();
  const vignette = 0.34 + Math.sin(frame / 53) * 0.02;
  const scanY = (frame * 7) % 1920;
  return (
    <AbsoluteFill style={{pointerEvents: "none", zIndex: 75}}>
      <AbsoluteFill
        style={{
          boxShadow: `inset 0 0 210px rgba(0,0,0,${vignette})`,
          background: "linear-gradient(180deg,rgba(255,255,255,.012),transparent 9%,transparent 90%,rgba(0,0,0,.12))",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 54,
          right: 54,
          top: scanY,
          height: 2,
          background: "linear-gradient(90deg,transparent,rgba(242,13,47,.16),transparent)",
          opacity: 0.55,
        }}
      />
    </AbsoluteFill>
  );
};

const HookAccent = () => {
  const frame = useCurrentFrame();
  if (frame < 60 || frame > 96) return null;
  const local = frame - 60;
  const alpha = interpolate(local, [0, 5, 22, 36], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(local, [0, 7, 18], [0.78, 1.08, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 74,
        top: 520,
        zIndex: 76,
        opacity: alpha,
        transform: `scale(${scale}) rotate(-1deg)`,
        transformOrigin: "left center",
        border: `3px solid ${RED}`,
        padding: "8px 16px 7px",
        color: "white",
        background: "rgba(0,0,0,.52)",
        fontFamily: "Arial,Helvetica,sans-serif",
        fontSize: 20,
        fontWeight: 950,
        letterSpacing: 6,
      }}
    >
      IMPOSSIBLE. ET POURTANT VRAI.
    </div>
  );
};

const DealGhost = () => {
  const frame = useCurrentFrame();
  if (frame < 700 || frame > 805) return null;
  const local = frame - 700;
  const opacity = interpolate(local, [0, 15, 74, 105], [0, 0.13, 0.13, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(local, [0, 105], [900, 820], {extrapolateRight: "clamp"});
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        textAlign: "center",
        zIndex: 2,
        color: RED,
        opacity,
        fontFamily: "Arial,Helvetica,sans-serif",
        fontSize: 250,
        lineHeight: 0.8,
        fontWeight: 950,
        letterSpacing: -14,
      }}
    >
      7 000
    </div>
  );
};

const EscapeTrace = () => {
  const frame = useCurrentFrame();
  if (frame < 1045 || frame >= 1180) return null;
  const local = frame - 1045;
  const line = interpolate(local, [8, 56], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fade = interpolate(local, [0, 12, 104, 134], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{position: "absolute", left: 95, right: 95, top: 990, zIndex: 68, opacity: fade, fontFamily: "Arial,Helvetica,sans-serif"}}>
      <div style={{display: "flex", alignItems: "center", gap: 18}}>
        <div style={{fontSize: 18, letterSpacing: 5, color: "#aaa"}}>PARIS</div>
        <div style={{height: 2, flex: 1, background: "#333", overflow: "hidden"}}>
          <div style={{height: "100%", width: `${line * 100}%`, background: RED, boxShadow: "0 0 16px rgba(242,13,47,.55)"}} />
        </div>
        <div style={{fontSize: 29, fontWeight: 950, color: RED}}>?</div>
      </div>
      <div style={{marginTop: 10, fontSize: 14, letterSpacing: 5, color: "#666"}}>L’ARGENT CHANGE DE MAIN. LUSTIG S’ÉVAPORE.</div>
    </div>
  );
};

const ShameStamp = () => {
  const frame = useCurrentFrame();
  if (frame < 1238 || frame >= 1310) return null;
  const local = frame - 1238;
  const opacity = interpolate(local, [0, 7, 55, 72], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(local, [0, 8, 18], [0.72, 1.12, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        right: 120,
        top: 960,
        zIndex: 74,
        opacity,
        transform: `rotate(-7deg) scale(${scale})`,
        border: `6px solid ${RED}`,
        padding: "12px 18px 10px",
        color: RED,
        fontFamily: "Arial,Helvetica,sans-serif",
        fontSize: 31,
        fontWeight: 950,
        letterSpacing: 5,
      }}
    >
      AUCUNE PLAINTE
    </div>
  );
};

const SecondTimeAccent = () => {
  const frame = useCurrentFrame();
  if (frame < 1354 || frame >= 1440) return null;
  const local = frame - 1354;
  const opacity = interpolate(local, [0, 9, 66, 86], [0, 0.2, 0.2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(local, [0, 32, 86], [0.85, 1.08, 1.16], {extrapolateRight: "clamp"});
  return (
    <div
      style={{
        position: "absolute",
        right: 50,
        bottom: 300,
        zIndex: 2,
        opacity,
        transform: `scale(${scale})`,
        color: RED,
        fontFamily: "Arial,Helvetica,sans-serif",
        fontSize: 360,
        fontWeight: 950,
        letterSpacing: -22,
        lineHeight: 0.8,
      }}
    >
      2×
    </div>
  );
};

const LessonAccent = () => {
  const frame = useCurrentFrame();
  if (frame < 1530 || frame >= 1725) return null;
  const local = frame - 1530;
  const opacity = interpolate(local, [0, 15, 165, 195], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        right: 70,
        top: 305,
        zIndex: 74,
        opacity,
        fontFamily: "Arial,Helvetica,sans-serif",
        fontSize: 15,
        fontWeight: 900,
        letterSpacing: 5,
        color: "#8a8a8a",
        writingMode: "vertical-rl",
        transform: "rotate(180deg)",
      }}
    >
      CRÉDIBLE ≠ VRAI
    </div>
  );
};

export const VictorLustigV3Video = () => (
  <AbsoluteFill style={{background: "#050505"}}>
    <VictorLustigV2Video />

    <Sequence from={66} durationInFrames={28}><Audio src={staticFile("victor-hit.wav")} volume={0.24} /></Sequence>
    <Sequence from={710} durationInFrames={28}><Audio src={staticFile("victor-hit.wav")} volume={0.18} /></Sequence>
    <Sequence from={1045} durationInFrames={28}><Audio src={staticFile("victor-hit.wav")} volume={0.16} /></Sequence>
    <Sequence from={1238} durationInFrames={28}><Audio src={staticFile("victor-hit.wav")} volume={0.14} /></Sequence>
    <Sequence from={1360} durationInFrames={28}><Audio src={staticFile("victor-hit.wav")} volume={0.22} /></Sequence>
    <Sequence from={1650} durationInFrames={28}><Audio src={staticFile("victor-hit.wav")} volume={0.12} /></Sequence>

    <DealGhost />
    <SecondTimeAccent />
    <EscapeTrace />
    <HookAccent />
    <ShameStamp />
    <LessonAccent />
    <PremiumOverlay />
    <CutFlashes />
  </AbsoluteFill>
);

export const VictorLustigV3Composition = () => (
  <Composition id="VictorLustigV3" component={VictorLustigV3Video} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
);
