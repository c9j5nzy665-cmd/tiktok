import {
  AbsoluteFill,
  Audio,
  Composition,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {ChoiceOverloadV2Video} from "./ChoiceOverloadV2";

const RED = "#f20d2f";
const TOTAL_FRAMES = 1800;
const FPS = 30;

const GateTexture = () => {
  const frame = useCurrentFrame();
  const scanY = (frame * 7) % 1920;
  const pulse = interpolate(frame % 90, [0, 3, 7, 90], [0, 0.12, 0, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{pointerEvents: "none", zIndex: 82}}>
      <AbsoluteFill style={{boxShadow: "inset 0 0 300px rgba(0,0,0,.58)"}} />
      <div
        style={{
          position: "absolute",
          left: 54,
          right: 54,
          top: scanY,
          height: 1,
          background: "linear-gradient(90deg,transparent,rgba(255,255,255,.10),transparent)",
          opacity: 0.7,
        }}
      />
      <AbsoluteFill style={{background: `rgba(242,13,47,${pulse})`}} />
    </AbsoluteFill>
  );
};

const HookLock = () => {
  const frame = useCurrentFrame();
  if (frame < 20 || frame >= 180) return null;
  const local = frame - 20;
  const opacity = interpolate(local, [0, 10, 132, 159], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x = interpolate(local, [0, 20], [65, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ratio = interpolate(local, [52, 112], [0, 10.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 82,
        right: 82,
        top: 1088,
        zIndex: 73,
        opacity,
        translate: `${x}px 0px`,
        fontFamily: "Arial,Helvetica,sans-serif",
      }}
    >
      <div style={{display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24}}>
        <div>
          <div style={{fontSize: 17, letterSpacing: 6, color: "#8d8d8d"}}>LE PARADOXE</div>
          <div style={{fontSize: 48, lineHeight: .96, fontWeight: 950, marginTop: 12}}>ATTIRER PLUS{`\n`}NE VEUT PAS DIRE VENDRE PLUS.</div>
        </div>
        <div style={{textAlign: "right", minWidth: 250}}>
          <div style={{fontSize: 90, lineHeight: .82, fontWeight: 950, color: RED}}>×{ratio.toFixed(1)}</div>
          <div style={{fontSize: 16, letterSpacing: 4, color: "#999", marginTop: 12}}>PLUS D’ACHATS · 6 CHOIX</div>
        </div>
      </div>
      <div style={{height: 5, marginTop: 22, background: "#262626"}}>
        <div
          style={{
            height: "100%",
            width: `${interpolate(local, [8, 58], [0, 100], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}%`,
            background: RED,
          }}
        />
      </div>
    </div>
  );
};

const DecisionSplit = () => {
  const frame = useCurrentFrame();
  if (frame < 690 || frame >= 990) return null;
  const local = frame - 690;
  const opacity = interpolate(local, [0, 8, 270, 299], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });
  const left = interpolate(local, [88, 170], [0, 3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const right = interpolate(local, [150, 238], [0, 31], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 78,
        right: 78,
        top: 1110,
        zIndex: 72,
        opacity,
        fontFamily: "Arial,Helvetica,sans-serif",
      }}
    >
      <div style={{fontSize: 16, letterSpacing: 6, color: "#888", marginBottom: 16}}>AU MOMENT DE DÉCIDER</div>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20}}>
        <div style={{border: "2px solid #323232", padding: "20px 24px"}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline"}}>
            <span style={{fontSize: 20, letterSpacing: 4, color: "#8a8a8a"}}>24 CHOIX</span>
            <span style={{fontSize: 55, fontWeight: 950, color: RED}}>{left.toFixed(0)}%</span>
          </div>
          <div style={{height: 9, background: "#252525", marginTop: 14}}>
            <div style={{height: "100%", width: `${Math.min(100, left * 3.2)}%`, background: RED}} />
          </div>
        </div>
        <div style={{border: `3px solid ${RED}`, padding: "19px 23px"}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline"}}>
            <span style={{fontSize: 20, letterSpacing: 4, color: "#8a8a8a"}}>6 CHOIX</span>
            <span style={{fontSize: 55, fontWeight: 950}}>{right.toFixed(0)}%</span>
          </div>
          <div style={{height: 9, background: "#252525", marginTop: 14}}>
            <div style={{height: "100%", width: `${Math.min(100, right * 3.2)}%`, background: "#f2f2f2"}} />
          </div>
        </div>
      </div>
    </div>
  );
};

const CognitiveLoad = () => {
  const frame = useCurrentFrame();
  if (frame < 990 || frame >= 1230) return null;
  const local = frame - 990;
  const labels = ["COMPARER", "ANTICIPER", "DOUTER", "REPORTER", "RENONCER"];
  return (
    <div
      style={{
        position: "absolute",
        left: 78,
        right: 78,
        top: 1040,
        height: 360,
        zIndex: 71,
        overflow: "hidden",
        fontFamily: "Arial,Helvetica,sans-serif",
      }}
    >
      {labels.map((label, i) => {
        const l = local - i * 22;
        const opacity = interpolate(l, [0, 7, 126, 170], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const x = interpolate(l, [0, 24], [95, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={label}
            style={{
              opacity,
              translate: `${x}px 0px`,
              fontSize: 36 - i * 2,
              lineHeight: 1,
              fontWeight: 950,
              letterSpacing: 5,
              color: i >= 3 ? RED : "#d7d7d7",
              marginTop: i === 0 ? 0 : 18,
              textAlign: "right",
            }}
          >
            {label}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 4,
          width: `${interpolate(local, [20, 185], [0, 100], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}%`,
          height: 4,
          background: RED,
        }}
      />
    </div>
  );
};

const ModernStack = () => {
  const frame = useCurrentFrame();
  if (frame < 1230 || frame >= 1470) return null;
  const local = frame - 1230;
  const cards = [
    {label: "STREAMING", detail: "Que regarder ?"},
    {label: "MENU", detail: "Que prendre ?"},
    {label: "SHOPPING", detail: "Lequel choisir ?"},
    {label: "DATING", detail: "Et si le suivant était mieux ?"},
  ];
  return (
    <div style={{position: "absolute", inset: 0, zIndex: 69, pointerEvents: "none", fontFamily: "Arial,Helvetica,sans-serif"}}>
      {cards.map((card, i) => {
        const l = local - i * 24;
        const opacity = interpolate(l, [0, 10, 170, 210], [0, .94, .94, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const y = interpolate(l, [0, 24], [95, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={card.label}
            style={{
              position: "absolute",
              left: 115 + (i % 2) * 420,
              top: 1020 + Math.floor(i / 2) * 150,
              width: 350,
              height: 110,
              opacity,
              translate: `0px ${y}px`,
              rotate: `${i % 2 === 0 ? -2 : 2}deg`,
              background: "rgba(8,8,8,.94)",
              border: i === 3 ? `2px solid ${RED}` : "2px solid #343434",
              boxShadow: "0 18px 46px rgba(0,0,0,.55)",
              padding: "18px 22px",
            }}
          >
            <div style={{fontSize: 15, color: i === 3 ? RED : "#8c8c8c", letterSpacing: 4, fontWeight: 900}}>{card.label}</div>
            <div style={{fontSize: 24, fontWeight: 900, marginTop: 10, color: "#f0f0f0"}}>{card.detail}</div>
          </div>
        );
      })}
    </div>
  );
};

const ReductionMoment = () => {
  const frame = useCurrentFrame();
  if (frame < 1470 || frame >= 1710) return null;
  const local = frame - 1470;
  const active = Math.round(
    interpolate(local, [25, 155], [24, 6], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const opacity = interpolate(local, [0, 8, 210, 239], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 82,
        right: 82,
        top: 1080,
        zIndex: 70,
        opacity,
        fontFamily: "Arial,Helvetica,sans-serif",
      }}
    >
      <div style={{fontSize: 17, letterSpacing: 6, color: "#8a8a8a"}}>RÉDUIRE LE BRUIT</div>
      <div style={{display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 8, marginTop: 18}}>
        {Array.from({length: 24}).map((_, i) => (
          <div
            key={i}
            style={{
              height: 22,
              background: i < active ? (i < 6 ? "#f0f0f0" : "#3b3b3b") : "rgba(255,255,255,.035)",
              border: i < 6 ? `1px solid ${RED}` : "1px solid #292929",
              opacity: i < active ? 1 : .25,
            }}
          />
        ))}
      </div>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 22}}>
        <div style={{fontSize: 18, letterSpacing: 5, color: "#777"}}>OPTIONS RESTANTES</div>
        <div style={{fontSize: 72, lineHeight: .85, fontWeight: 950, color: active <= 6 ? RED : "white"}}>{active}</div>
      </div>
    </div>
  );
};

const FinalSeal = () => {
  const frame = useCurrentFrame();
  if (frame < 1590 || frame >= 1710) return null;
  const local = frame - 1590;
  const opacity = interpolate(local, [0, 10, 95, 119], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(local, [0, 12, 28], [.82, 1.06, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        right: 78,
        top: 1380,
        zIndex: 76,
        opacity,
        scale,
        transformOrigin: "right center",
        fontFamily: "Arial,Helvetica,sans-serif",
        textAlign: "right",
      }}
    >
      <div style={{display: "inline-block", border: `4px solid ${RED}`, padding: "10px 16px 9px", background: "rgba(0,0,0,.78)", color: RED, fontSize: 22, fontWeight: 950, letterSpacing: 5}}>MOINS ≠ MOINS BIEN</div>
      <div style={{fontSize: 17, color: "#9b9b9b", letterSpacing: 4, marginTop: 10}}>PARFOIS, C’EST JUSTE PLUS CLAIR.</div>
    </div>
  );
};

const CutFlash = () => {
  const frame = useCurrentFrame();
  const cuts = [20, 105, 480, 690, 865, 990, 1230, 1470, 1590, 1710];
  const d = cuts.reduce((best, cut) => Math.min(best, Math.abs(frame - cut)), 999);
  const opacity = interpolate(d, [0, 1, 3], [.17, .06, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{pointerEvents: "none", zIndex: 81, background: `rgba(255,255,255,${opacity})`}} />;
};

export const ChoiceOverloadV3Video = () => (
  <AbsoluteFill style={{background: "#050505"}}>
    <ChoiceOverloadV2Video />

    <Sequence from={20} durationInFrames={22}><Audio src={staticFile("choice-overload-whoosh.wav")} volume={.13} /></Sequence>
    <Sequence from={105} durationInFrames={20}><Audio src={staticFile("choice-overload-tick.wav")} volume={.18} /></Sequence>
    <Sequence from={690} durationInFrames={22}><Audio src={staticFile("choice-overload-whoosh.wav")} volume={.12} /></Sequence>
    <Sequence from={865} durationInFrames={20}><Audio src={staticFile("choice-overload-tick.wav")} volume={.24} /></Sequence>
    <Sequence from={990} durationInFrames={22}><Audio src={staticFile("choice-overload-whoosh.wav")} volume={.10} /></Sequence>
    <Sequence from={1230} durationInFrames={20}><Audio src={staticFile("choice-overload-tick.wav")} volume={.14} /></Sequence>
    <Sequence from={1470} durationInFrames={22}><Audio src={staticFile("choice-overload-whoosh.wav")} volume={.11} /></Sequence>
    <Sequence from={1590} durationInFrames={20}><Audio src={staticFile("choice-overload-tick.wav")} volume={.16} /></Sequence>

    <HookLock />
    <DecisionSplit />
    <CognitiveLoad />
    <ModernStack />
    <ReductionMoment />
    <FinalSeal />
    <GateTexture />
    <CutFlash />
  </AbsoluteFill>
);

export const ChoiceOverloadV3Composition = () => (
  <Composition id="ChoiceOverloadV3" component={ChoiceOverloadV3Video} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
);
