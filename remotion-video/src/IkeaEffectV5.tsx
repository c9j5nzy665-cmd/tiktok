import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const RED = "#f20d2f";
const WHITE = "#f5f3ef";
const BLACK = "#050505";
const PAPER = "#ddd5c8";
const FPS = 30;
const TOTAL_FRAMES = 1068;

type SceneKind = "hook" | "name" | "experiment" | "result" | "overvalue" | "failure" | "conclusion" | "outro";

const scenes: {from: number; duration: number; kind: SceneKind}[] = [
  {from: 0, duration: 150, kind: "hook"},
  {from: 150, duration: 90, kind: "name"},
  {from: 240, duration: 210, kind: "experiment"},
  {from: 450, duration: 135, kind: "result"},
  {from: 585, duration: 150, kind: "overvalue"},
  {from: 735, duration: 105, kind: "failure"},
  {from: 840, duration: 156, kind: "conclusion"},
  {from: 996, duration: 72, kind: "outro"},
];

const captions = [
  {from: 0, to: 69, text: "Ce meuble IKEA vaut peut-être plus à tes yeux", hot: "plus"},
  {from: 87, to: 150, text: "simplement parce que tu l’as monté toi-même.", hot: "toi-même"},
  {from: 168, to: 189, text: "Ça porte un nom.", hot: "nom"},
  {from: 208, to: 239, text: "L’EFFET IKEA.", hot: "L’EFFET IKEA"},
  {from: 262, to: 367, text: "Des chercheurs ont demandé à des participants d’assembler des boîtes IKEA,", hot: "boîtes IKEA"},
  {from: 380, to: 424, text: "des Lego et des origamis.", hot: "Lego"},
  {from: 447, to: 463, text: "RÉSULTAT.", hot: "RÉSULTAT"},
  {from: 478, to: 510, text: "Lorsqu’ils réussissaient à construire l’objet,", hot: "réussissaient"},
  {from: 517, to: 549, text: "ils lui accordaient davantage de valeur.", hot: "davantage"},
  {from: 563, to: 636, text: "Ils pouvaient même surestimer la qualité", hot: "surestimer"},
  {from: 656, to: 732, text: "de leur propre création.", hot: "propre création"},
  {from: 755, to: 793, text: "Mais lorsque le montage échouait,", hot: "échouait"},
  {from: 803, to: 832, text: "l’effet disparaissait.", hot: "disparaissait"},
  {from: 849, to: 865, text: "EN CLAIR.", hot: "EN CLAIR"},
  {from: 875, to: 932, text: "Plus tu investis d’effort dans quelque chose,", hot: "effort"},
  {from: 950, to: 995, text: "plus tu risques de t’y attacher.", hot: "t’y attacher"},
  {from: 1013, to: 1056, text: "Même quand ce n’est qu’une étagère.", hot: "étagère"},
] as const;

const Grain = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 90,
        opacity: 0.105,
        mixBlendMode: "screen",
        backgroundImage: "repeating-radial-gradient(circle at 24% 31%,rgba(255,255,255,.26) 0 1px,transparent 1px 4px)",
        backgroundSize: "8px 8px",
        transform: `translate(${(frame % 5) - 2}px,${((frame * 3) % 5) - 2}px)`,
      }}
    />
  );
};

const PremiumOverlay = () => {
  const frame = useCurrentFrame();
  const scanY = (frame * 6) % 1920;
  return (
    <AbsoluteFill style={{pointerEvents: "none", zIndex: 86}}>
      <AbsoluteFill style={{boxShadow: "inset 0 0 260px rgba(0,0,0,.48)"}} />
      <div
        style={{
          position: "absolute",
          left: 54,
          right: 54,
          top: scanY,
          height: 1,
          background: "linear-gradient(90deg,transparent,rgba(242,13,47,.14),transparent)",
          opacity: 0.65,
        }}
      />
    </AbsoluteFill>
  );
};

const CutFlash = () => {
  const frame = useCurrentFrame();
  const cuts = [150, 240, 450, 585, 735, 840, 996];
  const d = cuts.reduce((best, cut) => Math.min(best, Math.abs(frame - cut)), 999);
  const opacity = interpolate(d, [0, 1, 4], [0.16, 0.06, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{pointerEvents: "none", zIndex: 95, background: `rgba(255,255,255,${opacity})`}} />;
};

const Frame = ({children}: {children: React.ReactNode}) => (
  <AbsoluteFill style={{background: BLACK, color: WHITE, overflow: "hidden", fontFamily: "Arial,Helvetica,sans-serif"}}>
    <div style={{position: "absolute", inset: 52, border: "2px solid rgba(255,255,255,.14)", zIndex: 55}} />
    <div style={{position: "absolute", top: 52, right: 52, width: 7, height: 185, background: RED, zIndex: 56}} />
    <div style={{position: "absolute", left: 52, bottom: 52, width: 110, height: 2, background: "rgba(255,255,255,.28)", zIndex: 56}} />
    <div style={{position: "absolute", left: 78, top: 76, zIndex: 57, fontSize: 13, fontWeight: 900, letterSpacing: 5, color: "rgba(255,255,255,.46)"}}>HORS CADRE</div>
    {children}
  </AbsoluteFill>
);

const RealImage = ({src, position = "center", dark = 0.28, zoom = 1.04, direction = 1}: {src: string; position?: string; dark?: number; zoom?: number; direction?: 1 | -1}) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, 220], [zoom, zoom + 0.055], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          filter: "grayscale(1) contrast(1.16) sepia(.08)",
          transform: `translate(${Math.sin(frame / 43) * 6 * direction}px,${Math.cos(frame / 59) * 4}px) scale(${z})`,
        }}
      />
      <AbsoluteFill style={{background: `rgba(0,0,0,${dark})`}} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(0,0,0,.03),rgba(0,0,0,.18) 48%,rgba(0,0,0,.82))"}} />
    </AbsoluteFill>
  );
};

const Kicker = ({children}: {children: React.ReactNode}) => (
  <div style={{fontSize: 20, fontWeight: 950, letterSpacing: 7, color: RED, marginBottom: 18}}>{children}</div>
);

const Big = ({children, size = 82}: {children: React.ReactNode; size?: number}) => (
  <div style={{fontSize: size, lineHeight: 0.92, fontWeight: 950, letterSpacing: -3, whiteSpace: "pre-line"}}>{children}</div>
);

const Stamp = ({children, rotate = -6}: {children: React.ReactNode; rotate?: number}) => (
  <div style={{display: "inline-block", border: `5px solid ${RED}`, color: RED, padding: "10px 16px 8px", fontSize: 24, fontWeight: 950, letterSpacing: 5, transform: `rotate(${rotate}deg)`, background: "rgba(0,0,0,.55)"}}>
    {children}
  </div>
);

const PaperCard = ({src, title, tag, rotate = -2}: {src: string; title: string; tag: string; rotate?: number}) => {
  const frame = useCurrentFrame();
  const enter = spring({frame, fps: FPS, config: {damping: 18, stiffness: 120}});
  return (
    <div style={{width: 275, background: PAPER, padding: 13, color: "#111", boxShadow: "0 20px 54px #000c", transform: `translateY(${(1 - enter) * 38}px) rotate(${rotate}deg)`, opacity: enter}}>
      <div style={{height: 250, overflow: "hidden", background: "#999"}}>
        <Img src={staticFile(src)} style={{width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) contrast(1.18)"}} />
      </div>
      <div style={{fontSize: 11, letterSpacing: 4, marginTop: 10, color: "#555"}}>{tag}</div>
      <div style={{fontSize: 24, fontWeight: 950, marginTop: 4}}>{title}</div>
      <div style={{height: 4, width: 72, background: RED, marginTop: 9}} />
    </div>
  );
};

const Caption = () => {
  const frame = useCurrentFrame();
  const current = captions.find((c) => frame >= c.from && frame < c.to);
  if (!current) return null;
  const parts = current.text.split(current.hot);
  return (
    <div style={{position: "absolute", left: 74, right: 74, bottom: 190, zIndex: 82, display: "flex", justifyContent: "center", textAlign: "center", fontFamily: "Arial,Helvetica,sans-serif"}}>
      <div style={{display: "inline", background: "rgba(5,5,5,.80)", padding: "12px 18px 11px", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone", fontSize: 42, lineHeight: 1.16, fontWeight: 900, color: WHITE, textShadow: "0 2px 12px #000"}}>
        {parts[0]}<span style={{color: RED}}>{current.hot}</span>{parts[1] ?? ""}
      </div>
    </div>
  );
};

const HookScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 20, stiffness: 118}});
  const sweep = interpolate(frame, [5, 28], [-1100, 960], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const punch = spring({frame: Math.max(0, frame - 82), fps, config: {damping: 17, stiffness: 145}});
  return (
    <Frame>
      <RealImage src="ikea-assembly.jpg" position="center 42%" dark={0.37} zoom={1.10} />
      <div style={{position: "absolute", top: 0, bottom: 0, left: sweep, width: 190, background: "linear-gradient(90deg,transparent,rgba(242,13,47,.38),transparent)", transform: "skewX(-16deg)", zIndex: 3}} />
      <div style={{position: "absolute", left: 80, right: 80, top: 245, zIndex: 8, transform: `translateY(${(1 - enter) * 28}px)`, opacity: enter}}>
        <Kicker>TON CERVEAU TE JOUE UN TOUR</Kicker>
        <Big size={88}>CE MEUBLE{`\n`}VAUT PLUS{`\n`}À TES YEUX.</Big>
      </div>
      <div style={{position: "absolute", right: 80, bottom: 460, zIndex: 10, transform: `translateX(${(1 - punch) * 52}px) rotate(2deg)`, opacity: punch}}>
        <PaperCard src="ikea-instructions.jpg" title="TU L’AS MONTÉ" tag="DOSSIER · EFFORT" rotate={2} />
      </div>
      <div style={{position: "absolute", left: 80, bottom: 520, zIndex: 12, opacity: punch, transform: `scale(${0.82 + punch * 0.18})`}}>
        <Stamp>PARCE QUE C’EST TOI.</Stamp>
      </div>
    </Frame>
  );
};

const NameScene = () => {
  const frame = useCurrentFrame();
  const enter = spring({frame, fps: FPS, config: {damping: 18, stiffness: 125}});
  return (
    <Frame>
      <RealImage src="ikea-shelf.jpg" position="center 45%" dark={0.70} zoom={1.03} direction={-1} />
      <div style={{position: "absolute", left: 20, right: 20, top: 560, textAlign: "center", zIndex: 2, color: RED, opacity: 0.13, fontSize: 300, lineHeight: .8, fontWeight: 950, letterSpacing: -18}}>IKEA</div>
      <div style={{position: "absolute", left: 82, right: 82, top: 430, zIndex: 8, opacity: enter, transform: `translateY(${(1 - enter) * 34}px)`}}>
        <Kicker>BIAIS COGNITIF</Kicker>
        <Big size={94}>L’EFFET{`\n`}IKEA.</Big>
        <div style={{height: 6, width: `${enter * 360}px`, background: RED, marginTop: 30}} />
      </div>
    </Frame>
  );
};

const ExperimentScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entries = [0, 24, 48].map((d) => spring({frame: Math.max(0, frame - d), fps, config: {damping: 18, stiffness: 120}}));
  const cards = [
    {src: "ikea-instructions.jpg", title: "BOÎTE", tag: "IKEA", rotate: -3},
    {src: "ikea-blocks.jpg", title: "LEGO", tag: "CONSTRUCTION", rotate: 2},
    {src: "ikea-origami.jpg", title: "ORIGAMI", tag: "PAPIER", rotate: -1},
  ];
  return (
    <Frame>
      <AbsoluteFill style={{background: "radial-gradient(circle at 50% 42%,#1a1a1a,#050505 70%)"}} />
      <div style={{position: "absolute", left: 80, top: 215, zIndex: 8}}>
        <Kicker>L’EXPÉRIENCE</Kicker>
        <Big size={60}>ILS CONSTRUISENT.{`\n`}PUIS ILS ÉVALUENT.</Big>
      </div>
      <div style={{position: "absolute", left: 76, right: 76, top: 600, display: "flex", gap: 24, justifyContent: "space-between", zIndex: 8}}>
        {cards.map((card, i) => (
          <div key={card.title} style={{opacity: entries[i], transform: `translateY(${(1 - entries[i]) * 70}px) rotate(${card.rotate}deg)`}}>
            <PaperCard src={card.src} title={card.title} tag={card.tag} rotate={0} />
          </div>
        ))}
      </div>
      <div style={{position: "absolute", left: 80, right: 80, top: 1080, zIndex: 7, fontSize: 16, letterSpacing: 6, color: "#777"}}>MÊME PROTOCOLE · TROIS TYPES D’OBJETS</div>
    </Frame>
  );
};

const ResultScene = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [15, 88], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const enter = spring({frame, fps: FPS, config: {damping: 18, stiffness: 125}});
  return (
    <Frame>
      <RealImage src="ikea-assembly.jpg" position="center 48%" dark={0.48} zoom={1.08} />
      <div style={{position: "absolute", left: 80, right: 80, top: 300, zIndex: 8, opacity: enter}}>
        <Kicker>RÉSULTAT</Kicker>
        <Big size={82}>CONSTRUIT{`\n`}PAR MOI.</Big>
        <div style={{marginTop: 26, fontSize: 55, fontWeight: 950, color: RED}}>VALEUR PERÇUE ↑</div>
      </div>
      <div style={{position: "absolute", left: 80, right: 80, top: 1050, zIndex: 8}}>
        <div style={{fontSize: 16, letterSpacing: 6, color: "#8c8c8c", marginBottom: 14}}>ATTACHEMENT À L’OBJET</div>
        <div style={{height: 12, background: "#272727", border: "1px solid #3a3a3a"}}>
          <div style={{height: "100%", width: `${progress * 100}%`, background: RED, boxShadow: "0 0 22px rgba(242,13,47,.45)"}} />
        </div>
      </div>
    </Frame>
  );
};

const OvervalueScene = () => {
  const frame = useCurrentFrame();
  const enter = spring({frame, fps: FPS, config: {damping: 19, stiffness: 116}});
  const ghost = interpolate(frame, [0, 16, 120, 149], [0, .14, .14, 0], {extrapolateRight: "clamp"});
  return (
    <Frame>
      <RealImage src="ikea-shelf.jpg" position="center 48%" dark={0.42} zoom={1.05} direction={-1} />
      <div style={{position: "absolute", left: -20, right: -20, top: 620, textAlign: "center", color: RED, opacity: ghost, fontSize: 265, fontWeight: 950, letterSpacing: -14, lineHeight: .8, zIndex: 2}}>MIEN</div>
      <div style={{position: "absolute", left: 80, right: 80, top: 285, zIndex: 8, opacity: enter, transform: `translateY(${(1 - enter) * 28}px)`}}>
        <Kicker>LE PIÈGE</Kicker>
        <Big size={72}>MA CRÉATION{`\n`}ME PARAÎT{`\n`}MEILLEURE.</Big>
        <div style={{marginTop: 34}}><Stamp rotate={-4}>QUALITÉ SURESTIMÉE</Stamp></div>
      </div>
    </Frame>
  );
};

const FailureScene = () => {
  const frame = useCurrentFrame();
  const enter = spring({frame, fps: FPS, config: {damping: 17, stiffness: 135}});
  const xScale = interpolate(frame, [0, 20], [.6, 1], {extrapolateRight: "clamp"});
  return (
    <Frame>
      <RealImage src="ikea-instructions.jpg" position="center" dark={0.56} zoom={1.06} />
      <div style={{position: "absolute", left: 50, right: 50, top: 500, textAlign: "center", color: RED, opacity: .18, fontSize: 540, lineHeight: .6, fontWeight: 950, transform: `scale(${xScale})`, zIndex: 2}}>×</div>
      <div style={{position: "absolute", left: 80, right: 80, top: 360, zIndex: 8, opacity: enter}}>
        <Kicker>MAIS SI TU ÉCHOUES…</Kicker>
        <Big size={84}>L’EFFET{`\n`}DISPARAÎT.</Big>
        <div style={{marginTop: 34}}><Stamp rotate={5}>ÉCHEC</Stamp></div>
      </div>
    </Frame>
  );
};

const ConclusionScene = () => {
  const frame = useCurrentFrame();
  const enter = spring({frame, fps: FPS, config: {damping: 18, stiffness: 120}});
  const line = interpolate(frame, [25, 100], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <Frame>
      <RealImage src="ikea-assembly.jpg" position="center 44%" dark={0.56} zoom={1.12} />
      <div style={{position: "absolute", left: 80, right: 80, top: 310, zIndex: 8, opacity: enter}}>
        <Kicker>EN CLAIR</Kicker>
        <Big size={90}>EFFORT</Big>
        <div style={{height: 6, width: `${line * 100}%`, background: "#303030", margin: "28px 0", overflow: "hidden"}}>
          <div style={{height: "100%", width: `${line * 100}%`, background: RED}} />
        </div>
        <Big size={90}>ATTACHEMENT.</Big>
        <div style={{marginTop: 30, fontSize: 18, lineHeight: 1.5, letterSpacing: 4, color: "#9a9a9a", maxWidth: 700}}>PLUS TU Y METS DE TOI, PLUS TU PEUX Y TENIR.</div>
      </div>
    </Frame>
  );
};

const OutroScene = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 14, 55, 71], [0, 1, 1, 0], {extrapolateRight: "clamp"});
  const end = interpolate(frame, [36, 52], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <Frame>
      <RealImage src="ikea-shelf.jpg" position="center 46%" dark={0.54} zoom={1.06} />
      <div style={{position: "absolute", left: 80, right: 80, top: 310, zIndex: 8, opacity: fade}}>
        <Kicker>MÊME UNE ÉTAGÈRE.</Kicker>
        <Big size={76}>TU N’AIMES PAS{`\n`}SEULEMENT L’OBJET.</Big>
      </div>
      <AbsoluteFill style={{background: `rgba(5,5,5,${end * .94})`, zIndex: 20}} />
      <div style={{position: "absolute", left: 0, right: 0, top: 770, textAlign: "center", zIndex: 21, opacity: end, fontFamily: "Arial,Helvetica,sans-serif"}}>
        <div style={{fontSize: 64, fontWeight: 950, letterSpacing: 2}}>HORS <span style={{color: RED}}>CADRE</span></div>
        <div style={{fontSize: 17, letterSpacing: 8, color: "#999", marginTop: 15}}>PENSE AUTREMENT</div>
      </div>
    </Frame>
  );
};

const Scene = ({kind}: {kind: SceneKind}) => {
  if (kind === "hook") return <HookScene />;
  if (kind === "name") return <NameScene />;
  if (kind === "experiment") return <ExperimentScene />;
  if (kind === "result") return <ResultScene />;
  if (kind === "overvalue") return <OvervalueScene />;
  if (kind === "failure") return <FailureScene />;
  if (kind === "conclusion") return <ConclusionScene />;
  return <OutroScene />;
};

export const IkeaEffectV5Video = () => (
  <AbsoluteFill style={{background: BLACK}}>
    <Audio src={staticFile("ikea-voice.ogg")} volume={1.0} />
    <Audio src={staticFile("ikea-bed.wav")} volume={0.10} />
    <Sequence from={2} durationInFrames={26}><Audio src={staticFile("ikea-hit.wav")} volume={0.17} /></Sequence>
    <Sequence from={150} durationInFrames={26}><Audio src={staticFile("ikea-hit.wav")} volume={0.13} /></Sequence>
    <Sequence from={450} durationInFrames={26}><Audio src={staticFile("ikea-hit.wav")} volume={0.16} /></Sequence>
    <Sequence from={735} durationInFrames={26}><Audio src={staticFile("ikea-hit.wav")} volume={0.18} /></Sequence>
    <Sequence from={840} durationInFrames={26}><Audio src={staticFile("ikea-hit.wav")} volume={0.13} /></Sequence>

    {scenes.map((scene) => (
      <Sequence key={`${scene.kind}-${scene.from}`} from={scene.from} durationInFrames={scene.duration}>
        <Scene kind={scene.kind} />
      </Sequence>
    ))}

    <Caption />
    <PremiumOverlay />
    <Grain />
    <CutFlash />
  </AbsoluteFill>
);

export const IkeaEffectV5Composition = () => (
  <Composition id="IkeaEffectV5" component={IkeaEffectV5Video} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
);
