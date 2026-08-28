import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const RED = "#f20d2f";
const WHITE = "#f6f3ee";
const BLACK = "#050505";
const FPS = 30;
const TOTAL_FRAMES = 1791;

const AUDIO_URL =
  "https://resource2.heygen.ai/text_to_speech/5d875a3e07b64bbb909ad6947106c6ea/25a6a67280574d3da78e97b1935ebfc7/id=5356e8e5-9ee0-4d81-8dc1-04169a55bd5c.wav";

const LUSTIG_URL = "https://upload.wikimedia.org/wikipedia/commons/c/c0/Victor_Lustig.jpg";
const EIFFEL_URL =
  "https://upload.wikimedia.org/wikipedia/commons/6/66/Illumination_Citro%C3%ABn_de_la_Tour_Eiffel_1925.jpg";
const CRILLON_URL =
  "https://upload.wikimedia.org/wikipedia/commons/2/2d/H%C3%B4tel_de_Crillon_%28World_War_I%29.jpg";

type SceneKind =
  | "hook"
  | "paris"
  | "official"
  | "deal"
  | "poisson"
  | "escape"
  | "shame"
  | "again"
  | "lesson"
  | "outro";

const scenes: {from: number; duration: number; kind: SceneKind}[] = [
  {from: 0, duration: 100, kind: "hook"},
  {from: 100, duration: 260, kind: "paris"},
  {from: 360, duration: 230, kind: "official"},
  {from: 590, duration: 230, kind: "deal"},
  {from: 820, duration: 225, kind: "poisson"},
  {from: 1045, duration: 135, kind: "escape"},
  {from: 1180, duration: 130, kind: "shame"},
  {from: 1310, duration: 130, kind: "again"},
  {from: 1440, duration: 285, kind: "lesson"},
  {from: 1725, duration: 66, kind: "outro"},
];

const captions = [
  {from: 0, to: 100, text: "Cet homme a vendu la Tour Eiffel. Deux fois.", hot: "Deux fois"},
  {from: 100, to: 277, text: "Paris, 1925. Victor Lustig lit que la Tour Eiffel coûte cher à entretenir.", hot: "1925"},
  {from: 277, to: 360, text: "Et il voit une opportunité complètement folle.", hot: "folle"},
  {from: 360, to: 480, text: "Il se fait passer pour un haut fonctionnaire français.", hot: "haut fonctionnaire"},
  {from: 480, to: 590, text: "Il convoque plusieurs grands ferrailleurs à l’Hôtel de Crillon.", hot: "Hôtel de Crillon"},
  {from: 590, to: 710, text: "Le gouvernement aurait décidé de démonter la Tour Eiffel.", hot: "démonter"},
  {from: 710, to: 820, text: "Et de vendre ses sept mille tonnes de métal dans le plus grand secret.", hot: "sept mille tonnes"},
  {from: 820, to: 920, text: "Un industriel, André Poisson, tombe dans le piège.", hot: "André Poisson"},
  {from: 920, to: 1045, text: "Pour paraître crédible, Lustig réclame même un pot-de-vin.", hot: "pot-de-vin"},
  {from: 1045, to: 1180, text: "Poisson paie. Lustig prend l’argent… et disparaît.", hot: "disparaît"},
  {from: 1180, to: 1310, text: "Trop honteuse, la victime ne porte pas plainte.", hot: "ne porte pas plainte"},
  {from: 1310, to: 1440, text: "Plus tard, Lustig revient à Paris… pour recommencer.", hot: "recommencer"},
  {from: 1440, to: 1560, text: "Une arnaque fonctionne rarement grâce au mensonge seul.", hot: "mensonge"},
  {from: 1560, to: 1725, text: "Elle fonctionne quand le mensonge ressemble à ce qu’on s’attend à croire.", hot: "s’attend à croire"},
] as const;

const Grain = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity: 0.14,
        mixBlendMode: "screen",
        backgroundImage:
          "repeating-radial-gradient(circle at 20% 30%,rgba(255,255,255,.28) 0 1px,transparent 1px 4px)",
        backgroundSize: "7px 7px",
        transform: `translate(${(frame % 4) - 2}px,${((frame * 3) % 5) - 2}px)`,
      }}
    />
  );
};

const Frame = ({children}: {children: React.ReactNode}) => (
  <AbsoluteFill style={{background: BLACK, color: WHITE, overflow: "hidden", fontFamily: "Arial, Helvetica, sans-serif"}}>
    <div style={{position: "absolute", inset: 52, border: "2px solid rgba(255,255,255,.14)", zIndex: 20}} />
    <div style={{position: "absolute", top: 52, right: 52, width: 7, height: 190, background: RED, zIndex: 21}} />
    {children}
  </AbsoluteFill>
);

const ArchiveImage = ({src, zoom = 1.06, x = 0, y = 0, dark = 0.22}: {src: string; zoom?: number; x?: number; y?: number; dark?: number}) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, 240], [zoom, zoom + 0.08], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "grayscale(1) contrast(1.12) sepia(.18)",
          transform: `translate(${x + Math.sin(frame / 44) * 8}px,${y + Math.cos(frame / 60) * 6}px) scale(${z})`,
        }}
      />
      <AbsoluteFill style={{background: `rgba(0,0,0,${dark})`}} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.18) 42%,rgba(0,0,0,.78))"}} />
    </AbsoluteFill>
  );
};

const Kicker = ({children}: {children: React.ReactNode}) => (
  <div style={{fontSize: 23, fontWeight: 900, letterSpacing: 7, color: RED, marginBottom: 18}}>{children}</div>
);

const Big = ({children, size = 84}: {children: React.ReactNode; size?: number}) => (
  <div style={{fontSize: size, lineHeight: 0.92, fontWeight: 950, letterSpacing: -3, whiteSpace: "pre-line"}}>{children}</div>
);

const Scene = ({kind}: {kind: SceneKind}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 20, stiffness: 110}});
  const rise = (1 - enter) * 28;

  if (kind === "hook") {
    const hit = interpolate(frame, [0, 8, 18], [0.82, 1.09, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
    return (
      <Frame>
        <ArchiveImage src={EIFFEL_URL} zoom={1.2} dark={0.32} />
        <div style={{position: "absolute", left: 85, right: 85, top: 260, zIndex: 5, transform: `translateY(${rise}px)`, opacity: enter}}>
          <Kicker>UNE ARNAQUE IMPOSSIBLE</Kicker>
          <Big size={88}>IL A VENDU{`\n`}LA TOUR EIFFEL.</Big>
          <div style={{marginTop: 42, display: "inline-block", background: RED, padding: "12px 25px", fontSize: 59, fontWeight: 950, transform: `scale(${hit})`}}>DEUX FOIS.</div>
        </div>
        <div style={{position: "absolute", bottom: 330, left: 86, fontSize: 18, letterSpacing: 5, color: "#aaa", zIndex: 5}}>PARIS · 1925</div>
      </Frame>
    );
  }

  if (kind === "paris") {
    return (
      <Frame>
        <ArchiveImage src={EIFFEL_URL} zoom={1.12} dark={0.18} />
        <div style={{position: "absolute", top: 125, left: 84, right: 84, zIndex: 4, transform: `translateY(${rise}px)`, opacity: enter}}>
          <Kicker>PARIS · 1925</Kicker>
          <Big size={66}>LA TOUR COÛTE{`\n`}CHER À ENTRETENIR.</Big>
        </div>
        <div style={{position: "absolute", right: 85, bottom: 385, width: 470, padding: 24, background: "rgba(0,0,0,.72)", borderLeft: `6px solid ${RED}`, zIndex: 4}}>
          <div style={{fontSize: 18, letterSpacing: 5, color: "#aaa"}}>JOURNAL DU JOUR</div>
          <div style={{fontSize: 38, fontWeight: 900, marginTop: 10}}>ENTRETIEN COÛTEUX</div>
          <div style={{fontSize: 23, lineHeight: 1.25, marginTop: 10, color: "#ddd"}}>Rouille, réparations, dépenses… Lustig voit une faille.</div>
        </div>
      </Frame>
    );
  }

  if (kind === "official") {
    return (
      <Frame>
        <ArchiveImage src={CRILLON_URL} zoom={1.12} y={-10} dark={0.34} />
        <div style={{position: "absolute", top: 120, left: 78, right: 78, zIndex: 4}}>
          <Kicker>LE PERSONNAGE</Kicker>
          <Big size={68}>UN FAUX{`\n`}HAUT FONCTIONNAIRE.</Big>
        </div>
        <div style={{position: "absolute", left: 85, bottom: 380, width: 600, padding: "25px 30px", background: "#e6dfd3", color: "#111", transform: "rotate(-2deg)", boxShadow: "0 15px 45px #000a", zIndex: 4}}>
          <div style={{fontFamily: "Georgia,serif", fontSize: 18, letterSpacing: 3}}>RÉPUBLIQUE FRANÇAISE</div>
          <div style={{height: 3, background: RED, margin: "14px 0 20px"}} />
          <div style={{fontFamily: "Georgia,serif", fontSize: 28, fontWeight: 800}}>CONFIDENTIEL</div>
          <div style={{fontFamily: "Georgia,serif", fontSize: 20, marginTop: 12, lineHeight: 1.4}}>Convocation — Hôtel de Crillon<br/>Industrie du métal / Paris</div>
          <div style={{position: "absolute", right: 22, bottom: 18, width: 96, height: 96, border: `4px solid ${RED}`, borderRadius: 60, display: "flex", alignItems: "center", justifyContent: "center", color: RED, fontWeight: 900, transform: "rotate(15deg)"}}>OFFICIEL</div>
        </div>
      </Frame>
    );
  }

  if (kind === "deal") {
    const count = Math.round(interpolate(frame, [18, 70], [0, 7000], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
    return (
      <Frame>
        <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 25%,#3a080e,transparent 32%),#050505"}} />
        <div style={{position: "absolute", top: 120, left: 82, right: 82, transform: `translateY(${rise}px)`, opacity: enter}}>
          <Kicker>LE MENSONGE</Kicker>
          <Big size={70}>« LA TOUR VA ÊTRE{`\n`}DÉMONTÉE. »</Big>
        </div>
        <div style={{position: "absolute", top: 600, left: 80, right: 80, textAlign: "center"}}>
          <div style={{fontSize: 170, lineHeight: 0.82, fontWeight: 950, letterSpacing: -8, color: RED}}>{count.toLocaleString("fr-FR")}</div>
          <div style={{fontSize: 38, fontWeight: 900, letterSpacing: 9, marginTop: 25}}>TONNES DE MÉTAL</div>
          <div style={{fontSize: 23, color: "#999", marginTop: 32, letterSpacing: 4}}>VENTE SECRÈTE · AU PLUS OFFRANT</div>
        </div>
      </Frame>
    );
  }

  if (kind === "poisson") {
    return (
      <Frame>
        <div style={{position: "absolute", inset: 0, background: "linear-gradient(135deg,#060606,#190507 70%,#050505)"}} />
        <div style={{position: "absolute", top: 118, left: 82, right: 82}}>
          <Kicker>LA CIBLE</Kicker>
          <Big size={75}>ANDRÉ{`\n`}POISSON.</Big>
        </div>
        <div style={{position: "absolute", left: 80, right: 80, top: 560, display: "flex", gap: 32}}>
          <div style={{flex: 1, height: 440, border: "2px solid rgba(255,255,255,.18)", padding: 28, background: "rgba(255,255,255,.035)"}}>
            <div style={{fontSize: 19, color: "#888", letterSpacing: 4}}>INDUSTRIEL</div>
            <div style={{fontSize: 42, fontWeight: 900, marginTop: 14}}>NOUVEAU À PARIS</div>
            <div style={{fontSize: 25, lineHeight: 1.35, marginTop: 28, color: "#ccc"}}>Il veut décrocher le marché qui pourrait changer sa carrière.</div>
          </div>
          <div style={{width: 360, height: 440, background: "#d8d0c2", color: "#111", padding: 28, transform: "rotate(2deg)", boxShadow: "0 20px 50px #0009"}}>
            <div style={{fontSize: 18, letterSpacing: 4}}>SOUS LA TABLE</div>
            <div style={{fontSize: 62, fontWeight: 950, lineHeight: .95, marginTop: 70}}>POT-{`\n`}DE-VIN</div>
            <div style={{height: 6, background: RED, width: 120, marginTop: 30}} />
          </div>
        </div>
      </Frame>
    );
  }

  if (kind === "escape") {
    const slide = interpolate(frame, [0, 35], [0, 580], {extrapolateRight: "clamp"});
    return (
      <Frame>
        <div style={{position: "absolute", inset: 0, background: "linear-gradient(180deg,#090909,#020202)"}} />
        <div style={{position: "absolute", top: 180, left: 80, right: 80}}>
          <Kicker>LE COUP PARFAIT</Kicker>
          <Big size={75}>POISSON PAIE.</Big>
          <div style={{fontSize: 58, fontWeight: 900, color: RED, marginTop: 28}}>LUSTIG DISPARAÎT.</div>
        </div>
        <div style={{position: "absolute", left: 120 + slide, bottom: 490, width: 410, height: 250, background: "#d4c7b0", transform: "rotate(-8deg)", boxShadow: "0 20px 60px #000"}}>
          <div style={{position: "absolute", left: 20, right: 20, top: 25, height: 5, background: "#887c68"}} />
          <div style={{position: "absolute", left: 0, right: 0, top: 0, height: "100%", clipPath: "polygon(0 0,100% 0,50% 60%)", background: "#b8aa91"}} />
          <div style={{position: "absolute", left: 135, bottom: 28, fontSize: 22, color: "#111", fontWeight: 900, letterSpacing: 4}}>ARGENT</div>
        </div>
      </Frame>
    );
  }

  if (kind === "shame") {
    return (
      <Frame>
        <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 45% 40%,#251117,#050505 58%)"}} />
        <div style={{position: "absolute", top: 180, left: 82, right: 82}}>
          <Kicker>ET POURTANT…</Kicker>
          <Big size={76}>IL NE PORTE{`\n`}PAS PLAINTE.</Big>
          <div style={{fontSize: 34, lineHeight: 1.35, color: "#bbb", marginTop: 48, maxWidth: 780}}>Trop honteux d’avoir été dupé, André Poisson garde le silence.</div>
        </div>
        <div style={{position: "absolute", left: 82, right: 82, bottom: 390, borderTop: "2px solid #333", paddingTop: 26, fontSize: 21, letterSpacing: 5, color: "#777"}}>PAS DE PLAINTE · PAS D’ALERTE</div>
      </Frame>
    );
  }

  if (kind === "again") {
    const pulse = interpolate(frame, [0, 12, 26], [0.75, 1.08, 1], {extrapolateRight: "clamp"});
    return (
      <Frame>
        <ArchiveImage src={LUSTIG_URL} zoom={1.18} dark={0.52} />
        <div style={{position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(0,0,0,.9),rgba(0,0,0,.15))"}} />
        <div style={{position: "absolute", top: 190, left: 82, width: 700, zIndex: 5}}>
          <Kicker>LE PLUS FOU</Kicker>
          <Big size={76}>IL REVIENT{`\n`}À PARIS.</Big>
          <div style={{marginTop: 38, display: "inline-block", background: RED, padding: "10px 22px", fontSize: 52, fontWeight: 950, transform: `scale(${pulse})`, transformOrigin: "left center"}}>POUR RECOMMENCER.</div>
        </div>
        <div style={{position: "absolute", bottom: 360, left: 82, fontSize: 17, letterSpacing: 5, color: "#aaa", zIndex: 5}}>VICTOR LUSTIG · ARCHIVE 1935</div>
      </Frame>
    );
  }

  if (kind === "lesson") {
    const split = interpolate(frame, [85, 165], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
    return (
      <Frame>
        <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 28%,#29060c,transparent 35%),#050505"}} />
        <div style={{position: "absolute", top: 135, left: 82, right: 82}}>
          <Kicker>LA LEÇON PSYCHOLOGIQUE</Kicker>
          <Big size={68}>LE MENSONGE{`\n`}NE SUFFIT PAS.</Big>
        </div>
        <div style={{position: "absolute", top: 630, left: 82, right: 82}}>
          <div style={{fontSize: 30, lineHeight: 1.35, color: "#c9c9c9", maxWidth: 850}}>Une arnaque devient crédible quand elle ressemble à quelque chose que la victime est déjà prête à croire.</div>
          <div style={{marginTop: 58, height: 2, background: "#333"}} />
          <div style={{marginTop: 46, display: "flex", alignItems: "center", gap: 22, opacity: split}}>
            <div style={{fontSize: 76, fontWeight: 950, color: RED}}>CRÉDIBLE</div>
            <div style={{fontSize: 44, color: "#777"}}>≠</div>
            <div style={{fontSize: 76, fontWeight: 950}}>VRAI</div>
          </div>
        </div>
      </Frame>
    );
  }

  return (
    <Frame>
      <div style={{position: "absolute", inset: 0, background: "#000"}} />
      <div style={{position: "absolute", inset: 115, border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <div style={{position: "absolute", height: 620, width: 6, background: RED}} />
        <div style={{textAlign: "center", zIndex: 2}}>
          <div style={{fontSize: 126, fontWeight: 950, lineHeight: .82, letterSpacing: -5}}>HORS</div>
          <div style={{fontSize: 126, fontWeight: 950, lineHeight: .82, letterSpacing: -5}}>CADRE</div>
          <div style={{marginTop: 45, fontSize: 24, fontWeight: 850, letterSpacing: 9}}>PENSE AUTREMENT.</div>
        </div>
      </div>
    </Frame>
  );
};

const Subtitle = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cap = captions.find((c) => frame >= c.from && frame < c.to);
  if (!cap) return null;
  const local = frame - cap.from;
  const enter = spring({frame: local, fps, config: {damping: 20, stiffness: 125}});
  const parts = cap.text.split(cap.hot);
  return (
    <div style={{position: "absolute", left: 88, right: 88, bottom: 255, zIndex: 40, display: "flex", justifyContent: "center", opacity: enter, transform: `translateY(${(1 - enter) * 10}px)`}}>
      <div style={{background: "rgba(0,0,0,.8)", borderBottom: `3px solid ${RED}`, padding: "15px 23px", fontFamily: "Arial,Helvetica,sans-serif", fontSize: 39, fontWeight: 780, lineHeight: 1.2, textAlign: "center", maxWidth: 890, boxShadow: "0 8px 24px #0009"}}>
        {parts[0]}<span style={{color: RED}}>{cap.hot}</span>{parts[1]}
      </div>
    </div>
  );
};

export const VictorLustigVideo = () => (
  <AbsoluteFill style={{background: BLACK, color: WHITE}}>
    <Audio src={AUDIO_URL} volume={1} />
    {scenes.map((scene) => (
      <Sequence key={scene.from} from={scene.from} durationInFrames={scene.duration}>
        <Scene kind={scene.kind} />
      </Sequence>
    ))}
    <Grain />
    <Subtitle />
  </AbsoluteFill>
);

export const VictorLustigComposition = () => (
  <Composition id="VictorLustigV1" component={VictorLustigVideo} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
);
