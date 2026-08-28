import {
  AbsoluteFill,
  Audio,
  Composition,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const RED = "#f20d2f";
const WHITE = "#f7f6f2";
const BLACK = "#050505";
const FPS = 30;
const TOTAL_FRAMES = 1800;

type SceneKind =
  | "hook"
  | "setup"
  | "attraction"
  | "reversal"
  | "overload"
  | "modern"
  | "lesson"
  | "outro";

const scenes: {from: number; duration: number; kind: SceneKind}[] = [
  {from: 0, duration: 180, kind: "hook"},
  {from: 180, duration: 300, kind: "setup"},
  {from: 480, duration: 210, kind: "attraction"},
  {from: 690, duration: 300, kind: "reversal"},
  {from: 990, duration: 240, kind: "overload"},
  {from: 1230, duration: 240, kind: "modern"},
  {from: 1470, duration: 240, kind: "lesson"},
  {from: 1710, duration: 90, kind: "outro"},
];

const captions = [
  {from: 0, to: 180, text: "Dans un supermarché californien, deux chercheurs testent notre rapport au choix.", hot: "choix"},
  {from: 180, to: 330, text: "Un jour : 24 parfums de confiture.", hot: "24"},
  {from: 330, to: 480, text: "Un autre : seulement 6.", hot: "6"},
  {from: 480, to: 585, text: "Avec 24 choix, environ 60 % des passants s’arrêtent.", hot: "60 %"},
  {from: 585, to: 690, text: "Avec 6, seulement 40 %.", hot: "40 %"},
  {from: 690, to: 790, text: "Plus de choix attire davantage.", hot: "attire"},
  {from: 790, to: 900, text: "Mais au moment d’acheter, tout s’inverse.", hot: "s’inverse"},
  {from: 900, to: 990, text: "24 confitures : à peine 3 % achètent.", hot: "3 %"},
  {from: 990, to: 1110, text: "Avec 6, près d’un tiers passe à la caisse.", hot: "un tiers"},
  {from: 1110, to: 1230, text: "Le grand choix avait rendu la décision plus difficile.", hot: "plus difficile"},
  {from: 1230, to: 1350, text: "Cette expérience a popularisé le « choice overload ».", hot: "choice overload"},
  {from: 1350, to: 1470, text: "Dans certaines situations, trop d’options peut pousser à reporter ou renoncer.", hot: "trop d’options"},
  {from: 1470, to: 1590, text: "Menus, streaming, applis de rencontre, produits presque identiques…", hot: "streaming"},
  {from: 1590, to: 1710, text: "Parfois, moins de choix ne te limite pas. Il t’aide à décider.", hot: "décider"},
] as const;

const Frame = ({children}: {children: React.ReactNode}) => (
  <AbsoluteFill style={{background: BLACK, color: WHITE, overflow: "hidden", fontFamily: "Arial, Helvetica, sans-serif"}}>
    <div style={{position: "absolute", inset: 52, border: "2px solid rgba(255,255,255,.13)", zIndex: 40}} />
    <div style={{position: "absolute", top: 52, right: 52, width: 7, height: 190, background: RED, zIndex: 41}} />
    <div style={{position: "absolute", left: 52, bottom: 52, width: 110, height: 2, background: "rgba(255,255,255,.28)", zIndex: 41}} />
    {children}
  </AbsoluteFill>
);

const Kicker = ({children}: {children: React.ReactNode}) => (
  <div style={{fontSize: 22, fontWeight: 900, letterSpacing: 7, color: RED, marginBottom: 18}}>{children}</div>
);

const Big = ({children, size = 80}: {children: React.ReactNode; size?: number}) => (
  <div style={{fontSize: size, lineHeight: .92, fontWeight: 950, letterSpacing: -3, whiteSpace: "pre-line"}}>{children}</div>
);

const JamJar = ({label, active = false, scale = 1}: {label: string; active?: boolean; scale?: number}) => (
  <div style={{width: 112 * scale, height: 155 * scale, borderRadius: 16 * scale, border: `3px solid ${active ? RED : "#5f5b54"}`, background: "linear-gradient(180deg,#2b211f,#120d0c)", boxShadow: active ? `0 0 28px rgba(242,13,47,.35)` : "0 18px 30px #0009", position: "relative"}}>
    <div style={{position: "absolute", top: -11 * scale, left: 9 * scale, right: 9 * scale, height: 22 * scale, borderRadius: 5 * scale, background: active ? RED : "#a8a39a", border: "2px solid #292725"}} />
    <div style={{position: "absolute", left: 12 * scale, right: 12 * scale, top: 49 * scale, padding: `${10 * scale}px ${5 * scale}px`, background: "#ddd6c7", color: "#111", textAlign: "center", fontSize: 13 * scale, fontWeight: 950, letterSpacing: 1.5 * scale}}>{label}</div>
  </div>
);

const JarGrid = ({count, active = false}: {count: number; active?: boolean}) => {
  const cols = count > 10 ? 8 : 3;
  const scale = count > 10 ? .62 : 1;
  return (
    <div style={{display: "grid", gridTemplateColumns: `repeat(${cols}, ${112 * scale}px)`, gap: count > 10 ? 18 : 28, alignItems: "end"}}>
      {Array.from({length: count}).map((_, i) => <JamJar key={i} label={`${String(i + 1).padStart(2, "0")}`} active={active && i === 0} scale={scale} />)}
    </div>
  );
};

const Scene = ({kind}: {kind: SceneKind}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 19, stiffness: 120}});

  if (kind === "hook") {
    const left = Math.round(interpolate(frame, [8, 55], [0, 24], {extrapolateRight: "clamp"}));
    const right = Math.round(interpolate(frame, [55, 105], [0, 6], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
    const three = interpolate(frame, [105, 150], [0, 3], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
    const third = interpolate(frame, [135, 176], [0, 31], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
    return (
      <Frame>
        <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 25%,#33060c,transparent 33%),#050505"}} />
        <div style={{position: "absolute", top: 130, left: 80, right: 80, opacity: enter, transform: `translateY(${(1 - enter) * 25}px)`}}>
          <Kicker>UNE EXPÉRIENCE QUI CHANGE TOUT</Kicker>
          <Big size={75}>PLUS DE CHOIX.{`\n`}MOINS D’ACHATS.</Big>
        </div>
        <div style={{position: "absolute", left: 80, right: 80, top: 630, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28}}>
          <div style={{border: "2px solid #2f2f2f", padding: 30}}><div style={{fontSize: 120, fontWeight: 950}}>{left}</div><div style={{fontSize: 22, letterSpacing: 5, color: "#777"}}>CHOIX</div><div style={{fontSize: 56, fontWeight: 950, color: RED, marginTop: 42}}>{three.toFixed(0)}%</div><div style={{fontSize: 19, letterSpacing: 4}}>ACHÈTENT</div></div>
          <div style={{border: `2px solid ${RED}`, padding: 30}}><div style={{fontSize: 120, fontWeight: 950}}>{right}</div><div style={{fontSize: 22, letterSpacing: 5, color: "#777"}}>CHOIX</div><div style={{fontSize: 56, fontWeight: 950, color: RED, marginTop: 42}}>{third.toFixed(0)}%</div><div style={{fontSize: 19, letterSpacing: 4}}>ACHÈTENT</div></div>
        </div>
      </Frame>
    );
  }

  if (kind === "setup") {
    const swap = frame > 145;
    return (
      <Frame>
        <div style={{position: "absolute", inset: 0, background: "linear-gradient(135deg,#070707,#160407 80%)"}} />
        <div style={{position: "absolute", top: 115, left: 80, right: 80}}><Kicker>CALIFORNIE · SUPERMARCHÉ</Kicker><Big size={66}>24 PARFUMS.{`\n`}PUIS SEULEMENT 6.</Big></div>
        <div style={{position: "absolute", left: 75, top: 550, width: 930, height: 720, display: "flex", alignItems: "center", justifyContent: "center", borderTop: "2px solid #2f2f2f", borderBottom: "2px solid #2f2f2f"}}>
          <div style={{opacity: swap ? 0 : 1, transform: `scale(${swap ? .92 : 1})`, transition: "none"}}>{!swap && <JarGrid count={24} />}</div>
          <div style={{opacity: swap ? 1 : 0, transform: `scale(${swap ? 1 : .92})`}}>{swap && <JarGrid count={6} active />}</div>
        </div>
        <div style={{position: "absolute", right: 80, bottom: 390, fontSize: 18, letterSpacing: 5, color: "#777"}}>IYENGAR & LEPPER · 2000</div>
      </Frame>
    );
  }

  if (kind === "attraction") {
    const p60 = Math.round(interpolate(frame, [0, 80], [0, 60], {extrapolateRight: "clamp"}));
    const p40 = Math.round(interpolate(frame, [70, 155], [0, 40], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
    return (
      <Frame>
        <div style={{position: "absolute", inset: 0, background: "#050505"}} />
        <div style={{position: "absolute", top: 118, left: 82, right: 82}}><Kicker>CE QUI ATTIRE</Kicker><Big size={70}>LE GRAND CHOIX{`\n`}GAGNE.</Big></div>
        <div style={{position: "absolute", left: 82, right: 82, top: 580}}>
          <div style={{fontSize: 20, color: "#888", letterSpacing: 5}}>24 CONFITURES</div><div style={{display: "flex", alignItems: "baseline", gap: 18}}><div style={{fontSize: 170, fontWeight: 950, color: RED}}>{p60}%</div><div style={{fontSize: 29, fontWeight: 850}}>S’ARRÊTENT</div></div>
          <div style={{height: 2, background: "#333", margin: "42px 0"}} />
          <div style={{fontSize: 20, color: "#888", letterSpacing: 5}}>6 CONFITURES</div><div style={{display: "flex", alignItems: "baseline", gap: 18}}><div style={{fontSize: 150, fontWeight: 950}}>{p40}%</div><div style={{fontSize: 29, fontWeight: 850}}>S’ARRÊTENT</div></div>
        </div>
      </Frame>
    );
  }

  if (kind === "reversal") {
    const p3 = interpolate(frame, [30, 100], [0, 3], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
    const p31 = Math.round(interpolate(frame, [110, 210], [0, 31], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
    return (
      <Frame>
        <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 25% 35%,#25080c,transparent 35%),#050505"}} />
        <div style={{position: "absolute", top: 120, left: 82, right: 82}}><Kicker>MAIS AU MOMENT D’ACHETER…</Kicker><Big size={74}>TOUT{`\n`}S’INVERSE.</Big></div>
        <div style={{position: "absolute", top: 650, left: 82, right: 82, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 34}}>
          <div style={{padding: 34, border: "2px solid #333"}}><div style={{fontSize: 21, letterSpacing: 5, color: "#888"}}>24 CHOIX</div><div style={{fontSize: 170, fontWeight: 950, color: RED, marginTop: 25}}>{p3.toFixed(0)}%</div><div style={{fontSize: 26, fontWeight: 900}}>ACHÈTENT</div></div>
          <div style={{padding: 34, border: `3px solid ${RED}`}}><div style={{fontSize: 21, letterSpacing: 5, color: "#888"}}>6 CHOIX</div><div style={{fontSize: 170, fontWeight: 950, marginTop: 25}}>{p31}%</div><div style={{fontSize: 26, fontWeight: 900}}>ACHÈTENT</div></div>
        </div>
        <div style={{position: "absolute", left: 82, bottom: 390, fontSize: 20, letterSpacing: 4, color: "#888"}}>≈ 10× PLUS DE CONVERSION AVEC LE PETIT ASSORTIMENT</div>
      </Frame>
    );
  }

  if (kind === "overload") {
    const width = interpolate(frame, [15, 160], [0, 100], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
    return (
      <Frame>
        <div style={{position: "absolute", inset: 0, background: "linear-gradient(180deg,#050505,#150508)"}} />
        <div style={{position: "absolute", top: 120, left: 82, right: 82}}><Kicker>LE « CHOICE OVERLOAD »</Kicker><Big size={70}>QUAND CHOISIR{`\n`}DEVIENT UN EFFORT.</Big></div>
        <div style={{position: "absolute", left: 82, right: 82, top: 650}}>
          {["COMPARER", "HÉSITER", "REPORTER", "RENONCER"].map((t, i) => <div key={t} style={{height: 118, borderBottom: "2px solid #2d2d2d", display: "flex", alignItems: "center", justifyContent: "space-between"}}><div style={{fontSize: 34, fontWeight: 950, letterSpacing: 2}}>{t}</div><div style={{height: 8, width: `${Math.max(0, width - i * 12)}%`, maxWidth: 440, background: i === 3 ? RED : "#555"}} /></div>)}
        </div>
        <div style={{position: "absolute", left: 82, bottom: 370, fontSize: 19, color: "#888", letterSpacing: 4}}>EFFET CONTEXTUEL · PAS UNE LOI UNIVERSELLE</div>
      </Frame>
    );
  }

  if (kind === "modern") {
    const items = ["MENU · 48 PLATS", "STREAMING · 10 000 TITRES", "DATING · SWIPE INFINI", "SHOPPING · 73 MODÈLES"];
    return (
      <Frame>
        <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 20%,#27070c,transparent 38%),#050505"}} />
        <div style={{position: "absolute", top: 118, left: 82, right: 82}}><Kicker>AUJOURD’HUI</Kicker><Big size={70}>LE CHOIX{`\n`}EST PARTOUT.</Big></div>
        <div style={{position: "absolute", top: 590, left: 82, right: 82, display: "grid", gap: 22}}>
          {items.map((item, i) => {const local = Math.max(0, frame - i * 28); const x = interpolate(local, [0, 22], [80, 0], {extrapolateRight: "clamp"}); const o = interpolate(local, [0, 10], [0, 1], {extrapolateRight: "clamp"}); return <div key={item} style={{height: 150, border: "2px solid #303030", background: "rgba(255,255,255,.025)", padding: "0 30px", display: "flex", alignItems: "center", justifyContent: "space-between", opacity: o, transform: `translateX(${x}px)`}}><div style={{fontSize: 31, fontWeight: 950}}>{item}</div><div style={{fontSize: 58, color: i === 3 ? RED : "#777"}}>→</div></div>;})}
        </div>
      </Frame>
    );
  }

  if (kind === "lesson") {
    const line = interpolate(frame, [15, 145], [0, 100], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
    return (
      <Frame>
        <div style={{position: "absolute", inset: 0, background: "#050505"}} />
        <div style={{position: "absolute", top: 125, left: 82, right: 82}}><Kicker>LA LEÇON</Kicker><Big size={73}>MOINS DE CHOIX{`\n`}PEUT AIDER À DÉCIDER.</Big></div>
        <div style={{position: "absolute", left: 82, right: 82, top: 690}}>
          <div style={{fontSize: 27, lineHeight: 1.5, color: "#ccc", maxWidth: 820}}>Le problème n’est pas d’avoir des options. C’est d’en avoir assez pour ne plus savoir laquelle laisser de côté.</div>
          <div style={{height: 7, width: `${line}%`, background: RED, marginTop: 48}} />
          <div style={{fontSize: 72, lineHeight: .95, fontWeight: 950, marginTop: 70}}>CHOISIR,{`\n`}C’EST AUSSI <span style={{color: RED}}>RENONCER.</span></div>
        </div>
      </Frame>
    );
  }

  return (
    <Frame>
      <div style={{position: "absolute", inset: 0, background: "#000"}} />
      <div style={{position: "absolute", inset: 115, border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <div style={{position: "absolute", height: 620, width: 6, background: RED}} />
        <div style={{textAlign: "center", zIndex: 2}}><div style={{fontSize: 126, fontWeight: 950, lineHeight: .82, letterSpacing: -5}}>HORS</div><div style={{fontSize: 126, fontWeight: 950, lineHeight: .82, letterSpacing: -5}}>CADRE</div><div style={{marginTop: 45, fontSize: 24, fontWeight: 850, letterSpacing: 9}}>PENSE AUTREMENT.</div></div>
      </div>
    </Frame>
  );
};

const Subtitle = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cap = captions.find((c) => frame >= c.from && frame < c.to);
  if (!cap) return null;
  const enter = spring({frame: frame - cap.from, fps, config: {damping: 20, stiffness: 125}});
  const parts = cap.text.split(cap.hot);
  return (
    <div style={{position: "absolute", left: 88, right: 88, bottom: 250, zIndex: 80, display: "flex", justifyContent: "center", opacity: enter, transform: `translateY(${(1 - enter) * 10}px)`}}>
      <div style={{background: "rgba(0,0,0,.84)", borderBottom: `3px solid ${RED}`, padding: "15px 23px", fontSize: 38, fontWeight: 780, lineHeight: 1.2, textAlign: "center", maxWidth: 900, boxShadow: "0 8px 24px #0009"}}>{parts[0]}<span style={{color: RED}}>{cap.hot}</span>{parts[1]}</div>
    </div>
  );
};

const Grain = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{pointerEvents: "none", zIndex: 70, opacity: .09, mixBlendMode: "screen", backgroundImage: "repeating-radial-gradient(circle at 20% 30%,rgba(255,255,255,.22) 0 1px,transparent 1px 4px)", backgroundSize: "7px 7px", transform: `translate(${frame % 4 - 2}px,${(frame * 3) % 5 - 2}px)`}} />;
};

export const ChoiceOverloadVideo = () => (
  <AbsoluteFill style={{background: BLACK, color: WHITE}}>
    <Audio src={staticFile("choice-overload-voice.mp3")} volume={1} />
    <Audio src={staticFile("choice-overload-bed.wav")} volume={0.065} />
    {[0, 480, 690, 900, 990, 1230, 1470, 1590].map((from) => <Sequence key={from} from={from} durationInFrames={28}><Audio src={staticFile("choice-overload-hit.wav")} volume={from === 900 ? .22 : .13} /></Sequence>)}
    {scenes.map((scene) => <Sequence key={scene.from} from={scene.from} durationInFrames={scene.duration}><Scene kind={scene.kind} /></Sequence>)}
    <Grain />
    <Subtitle />
  </AbsoluteFill>
);

export const ChoiceOverloadComposition = () => (
  <Composition id="ChoiceOverloadV1" component={ChoiceOverloadVideo} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
);
