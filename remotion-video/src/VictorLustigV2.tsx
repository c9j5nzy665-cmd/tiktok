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
const WHITE = "#f6f3ee";
const BLACK = "#050505";
const PAPER = "#ded6c8";
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
  {from: 100, to: 277, text: "Paris, 1925. Victor Lustig lit que la Tour Eiffel coûte cher à entretenir.", hot: "Victor Lustig"},
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
        zIndex: 60,
        opacity: 0.12,
        mixBlendMode: "screen",
        backgroundImage:
          "repeating-radial-gradient(circle at 20% 30%,rgba(255,255,255,.25) 0 1px,transparent 1px 4px)",
        backgroundSize: "7px 7px",
        transform: `translate(${(frame % 4) - 2}px,${((frame * 3) % 5) - 2}px)`,
      }}
    />
  );
};

const Frame = ({children}: {children: React.ReactNode}) => (
  <AbsoluteFill style={{background: BLACK, color: WHITE, overflow: "hidden", fontFamily: "Arial, Helvetica, sans-serif"}}>
    <div style={{position: "absolute", inset: 52, border: "2px solid rgba(255,255,255,.14)", zIndex: 40}} />
    <div style={{position: "absolute", top: 52, right: 52, width: 7, height: 190, background: RED, zIndex: 41}} />
    <div style={{position: "absolute", left: 52, bottom: 52, width: 110, height: 2, background: "rgba(255,255,255,.28)", zIndex: 41}} />
    {children}
  </AbsoluteFill>
);

const ArchiveImage = ({
  src,
  zoom = 1.06,
  x = 0,
  y = 0,
  dark = 0.22,
  direction = 1,
  position = "center",
}: {
  src: string;
  zoom?: number;
  x?: number;
  y?: number;
  dark?: number;
  direction?: 1 | -1;
  position?: string;
}) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, 260], [zoom, zoom + 0.075], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          filter: "grayscale(1) contrast(1.14) sepia(.16)",
          transform: `translate(${x + Math.sin(frame / 47) * 7 * direction}px,${y + Math.cos(frame / 61) * 5}px) scale(${z})`,
        }}
      />
      <AbsoluteFill style={{background: `rgba(0,0,0,${dark})`}} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(0,0,0,.03),rgba(0,0,0,.18) 43%,rgba(0,0,0,.82))"}} />
    </AbsoluteFill>
  );
};

const Kicker = ({children}: {children: React.ReactNode}) => (
  <div style={{fontSize: 22, fontWeight: 900, letterSpacing: 7, color: RED, marginBottom: 18}}>{children}</div>
);

const Big = ({children, size = 84}: {children: React.ReactNode; size?: number}) => (
  <div style={{fontSize: size, lineHeight: 0.92, fontWeight: 950, letterSpacing: -3, whiteSpace: "pre-line"}}>{children}</div>
);

const Stamp = ({children, rotate = -8}: {children: React.ReactNode; rotate?: number}) => (
  <div
    style={{
      display: "inline-block",
      border: `5px solid ${RED}`,
      color: RED,
      padding: "10px 16px 8px",
      fontSize: 26,
      fontWeight: 950,
      letterSpacing: 5,
      transform: `rotate(${rotate}deg)`,
    }}
  >
    {children}
  </div>
);

const PortraitCard = ({compact = false}: {compact?: boolean}) => {
  const frame = useCurrentFrame();
  const enter = spring({frame: Math.max(0, frame - 58), fps: FPS, config: {damping: 18, stiffness: 120}});
  return (
    <div
      style={{
        width: compact ? 260 : 330,
        background: PAPER,
        padding: compact ? 13 : 17,
        color: "#111",
        boxShadow: "0 20px 55px #000b",
        transform: `translateY(${(1 - enter) * 36}px) rotate(-2deg)`,
        opacity: enter,
      }}
    >
      <div style={{height: compact ? 260 : 340, overflow: "hidden", background: "#999"}}>
        <Img
          src={LUSTIG_URL}
          style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 25%", filter: "grayscale(1) contrast(1.18)"}}
        />
      </div>
      <div style={{fontSize: compact ? 14 : 17, letterSpacing: 4, marginTop: 13, color: "#555"}}>DOSSIER</div>
      <div style={{fontSize: compact ? 28 : 37, fontWeight: 950, marginTop: 4}}>VICTOR LUSTIG</div>
      <div style={{height: 5, width: 90, background: RED, marginTop: 11}} />
    </div>
  );
};

const PaperDocument = () => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, 28], [50, 0], {extrapolateRight: "clamp"});
  const opacity = interpolate(frame, [0, 15], [0, 1], {extrapolateRight: "clamp"});
  return (
    <div
      style={{
        width: 650,
        padding: "28px 32px 34px",
        background: PAPER,
        color: "#111",
        transform: `translateY(${y}px) rotate(-2deg)`,
        opacity,
        boxShadow: "0 18px 50px #000b",
      }}
    >
      <div style={{fontFamily: "Georgia,serif", fontSize: 18, letterSpacing: 3}}>RÉPUBLIQUE FRANÇAISE</div>
      <div style={{height: 3, background: RED, margin: "14px 0 22px"}} />
      <div style={{fontFamily: "Georgia,serif", fontSize: 31, fontWeight: 800}}>CONFIDENTIEL</div>
      <div style={{fontFamily: "Georgia,serif", fontSize: 21, marginTop: 15, lineHeight: 1.5}}>
        Convocation privée<br />
        Hôtel de Crillon · Paris<br />
        Industrie du métal
      </div>
      <div style={{position: "absolute", right: 24, bottom: 20}}>
        <Stamp rotate={11}>OFFICIEL</Stamp>
      </div>
    </div>
  );
};

const Scene = ({kind}: {kind: SceneKind}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 20, stiffness: 115}});
  const rise = (1 - enter) * 26;

  if (kind === "hook") {
    const hit = interpolate(frame, [0, 7, 18], [0.82, 1.08, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
    const sweep = interpolate(frame, [7, 28], [-1100, 900], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
    const card = spring({frame: Math.max(0, frame - 42), fps, config: {damping: 18, stiffness: 125}});
    return (
      <Frame>
        <ArchiveImage src={EIFFEL_URL} zoom={1.19} dark={0.34} position="center 44%" />
        <div style={{position: "absolute", top: 0, bottom: 0, width: 190, left: sweep, background: "linear-gradient(90deg,transparent,rgba(242,13,47,.4),transparent)", transform: "skewX(-16deg)", zIndex: 3}} />
        <div style={{position: "absolute", left: 82, right: 82, top: 255, zIndex: 5, transform: `translateY(${rise}px)`, opacity: enter}}>
          <Kicker>UNE ARNAQUE IMPOSSIBLE</Kicker>
          <Big size={88}>IL A VENDU{`\n`}LA TOUR EIFFEL.</Big>
          <div style={{marginTop: 38, display: "inline-block", background: RED, padding: "12px 25px", fontSize: 61, fontWeight: 950, transform: `scale(${hit})`}}>DEUX FOIS.</div>
        </div>
        <div style={{position: "absolute", right: 82, bottom: 360, width: 250, background: PAPER, padding: 12, color: "#111", zIndex: 6, opacity: card, transform: `translateX(${(1 - card) * 55}px) rotate(2deg)`}}>
          <Img src={LUSTIG_URL} style={{width: "100%", height: 230, objectFit: "cover", objectPosition: "center 22%", filter: "grayscale(1) contrast(1.2)"}} />
          <div style={{fontSize: 22, fontWeight: 950, marginTop: 10}}>VICTOR LUSTIG</div>
          <div style={{fontSize: 12, letterSpacing: 3, marginTop: 4, color: "#555"}}>ESCROC · ARCHIVE</div>
        </div>
        <div style={{position: "absolute", bottom: 330, left: 84, fontSize: 18, letterSpacing: 5, color: "#aaa", zIndex: 5}}>PARIS · 1925</div>
      </Frame>
    );
  }

  if (kind === "paris") {
    const line = interpolate(frame, [105, 155], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
    return (
      <Frame>
        <ArchiveImage src={EIFFEL_URL} zoom={1.1} dark={0.2} direction={-1} position="center 45%" />
        <div style={{position: "absolute", top: 120, left: 82, right: 82, zIndex: 5, transform: `translateY(${rise}px)`, opacity: enter}}>
          <Kicker>PARIS · 1925</Kicker>
          <Big size={66}>LA TOUR COÛTE{`\n`}CHER À ENTRETENIR.</Big>
        </div>
        <div style={{position: "absolute", left: 82, top: 555, zIndex: 6}}>
          <PortraitCard compact />
        </div>
        <div style={{position: "absolute", right: 82, bottom: 390, width: 455, padding: 24, background: "rgba(0,0,0,.78)", borderLeft: `6px solid ${RED}`, zIndex: 5}}>
          <div style={{fontSize: 16, letterSpacing: 5, color: "#aaa"}}>LE DÉCLIC</div>
          <div style={{fontSize: 38, fontWeight: 950, marginTop: 10}}>ENTRETIEN COÛTEUX</div>
          <div style={{fontSize: 22, lineHeight: 1.35, marginTop: 12, color: "#ddd"}}>Une information banale. Une opportunité parfaite pour un imposteur.</div>
          <div style={{height: 4, width: `${line * 100}%`, background: RED, marginTop: 20}} />
        </div>
      </Frame>
    );
  }

  if (kind === "official") {
    return (
      <Frame>
        <ArchiveImage src={CRILLON_URL} zoom={1.12} y={-8} dark={0.32} position="center 48%" />
        <div style={{position: "absolute", top: 116, left: 78, right: 78, zIndex: 5}}>
          <Kicker>LE PERSONNAGE</Kicker>
          <Big size={68}>UN FAUX{`\n`}HAUT FONCTIONNAIRE.</Big>
        </div>
        <div style={{position: "absolute", left: 82, bottom: 375, zIndex: 6}}>
          <PaperDocument />
        </div>
        <div style={{position: "absolute", right: 82, top: 540, zIndex: 6}}>
          <PortraitCard compact />
        </div>
      </Frame>
    );
  }

  if (kind === "deal") {
    const count = Math.round(interpolate(frame, [20, 72], [0, 7000], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
    const cut = interpolate(frame, [35, 145], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
    return (
      <Frame>
        <ArchiveImage src={EIFFEL_URL} zoom={1.14} dark={0.7} position="center 42%" />
        <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 25%,rgba(58,8,14,.72),transparent 32%)"}} />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{position: "absolute", left: 110, right: 110, top: 580 + i * 150, height: 3, background: RED, opacity: Math.max(0, Math.min(1, cut * 1.5 - i * 0.18)), boxShadow: "0 0 18px rgba(242,13,47,.5)"}} />
        ))}
        <div style={{position: "absolute", top: 115, left: 82, right: 82, zIndex: 5, transform: `translateY(${rise}px)`, opacity: enter}}>
          <Kicker>LE MENSONGE</Kicker>
          <Big size={70}>« LA TOUR VA ÊTRE{`\n`}DÉMONTÉE. »</Big>
        </div>
        <div style={{position: "absolute", top: 650, left: 80, right: 80, textAlign: "center", zIndex: 5}}>
          <div style={{fontSize: 176, lineHeight: 0.82, fontWeight: 950, letterSpacing: -8, color: RED}}>{count.toLocaleString("fr-FR")}</div>
          <div style={{fontSize: 38, fontWeight: 900, letterSpacing: 9, marginTop: 25}}>TONNES DE MÉTAL</div>
          <div style={{fontSize: 22, color: "#aaa", marginTop: 28, letterSpacing: 4}}>VENTE SECRÈTE · AU PLUS OFFRANT</div>
        </div>
        <div style={{position: "absolute", right: 92, bottom: 420, zIndex: 7, opacity: cut}}><Stamp>À DÉMONTER</Stamp></div>
      </Frame>
    );
  }

  if (kind === "poisson") {
    const bribe = spring({frame: Math.max(0, frame - 92), fps, config: {damping: 17, stiffness: 125}});
    return (
      <Frame>
        <div style={{position: "absolute", inset: 0, background: "linear-gradient(135deg,#060606,#190507 70%,#050505)"}} />
        <div style={{position: "absolute", inset: 0, opacity: .15, backgroundImage: "linear-gradient(rgba(255,255,255,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.15) 1px,transparent 1px)", backgroundSize: "75px 75px"}} />
        <div style={{position: "absolute", top: 115, left: 82, right: 82}}>
          <Kicker>LA CIBLE</Kicker>
          <Big size={75}>ANDRÉ{`\n`}POISSON.</Big>
        </div>
        <div style={{position: "absolute", left: 82, top: 540, width: 520, height: 505, border: "2px solid rgba(255,255,255,.18)", padding: 30, background: "rgba(255,255,255,.035)"}}>
          <div style={{fontSize: 16, color: "#888", letterSpacing: 5}}>DOSSIER CIBLE</div>
          <div style={{fontSize: 40, fontWeight: 950, marginTop: 14}}>INDUSTRIEL</div>
          <div style={{height: 2, background: "#333", margin: "25px 0"}} />
          <div style={{fontSize: 25, lineHeight: 1.42, color: "#ccc"}}>Il veut décrocher un marché énorme. Lustig transforme cette ambition en levier.</div>
          <div style={{position: "absolute", right: 25, bottom: 28, width: 120, height: 120, borderRadius: 70, border: "3px solid rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 47, fontWeight: 950, color: "#777"}}>AP</div>
        </div>
        <div style={{position: "absolute", right: 80, top: 690, width: 350, height: 290, background: PAPER, color: "#111", padding: 27, transform: `translateY(${(1 - bribe) * 80}px) rotate(3deg)`, opacity: bribe, boxShadow: "0 20px 50px #000b"}}>
          <div style={{fontSize: 16, letterSpacing: 4}}>SOUS LA TABLE</div>
          <div style={{fontSize: 62, fontWeight: 950, lineHeight: .92, marginTop: 58}}>POT-{`\n`}DE-VIN</div>
          <div style={{height: 7, background: RED, width: 120, marginTop: 28}} />
        </div>
      </Frame>
    );
  }

  if (kind === "escape") {
    const slide = interpolate(frame, [0, 43], [0, 610], {extrapolateRight: "clamp"});
    const stampIn = spring({frame: Math.max(0, frame - 42), fps, config: {damping: 16, stiffness: 145}});
    return (
      <Frame>
        <ArchiveImage src={EIFFEL_URL} zoom={1.2} dark={0.75} direction={-1} position="center 45%" />
        <div style={{position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,.3),rgba(0,0,0,.92))"}} />
        <div style={{position: "absolute", top: 175, left: 80, right: 80, zIndex: 5}}>
          <Kicker>LE COUP PARFAIT</Kicker>
          <Big size={75}>POISSON PAIE.</Big>
          <div style={{fontSize: 58, fontWeight: 950, color: RED, marginTop: 28}}>LUSTIG DISPARAÎT.</div>
        </div>
        <div style={{position: "absolute", left: 105 + slide, bottom: 500, width: 430, height: 260, background: "#d4c7b0", transform: "rotate(-8deg)", boxShadow: "0 20px 60px #000", zIndex: 5}}>
          <div style={{position: "absolute", left: 0, right: 0, top: 0, height: "100%", clipPath: "polygon(0 0,100% 0,50% 60%)", background: "#b8aa91"}} />
          <div style={{position: "absolute", left: 142, bottom: 28, fontSize: 22, color: "#111", fontWeight: 900, letterSpacing: 4}}>ARGENT</div>
        </div>
        <div style={{position: "absolute", right: 100, bottom: 505, opacity: stampIn, transform: `scale(${.72 + stampIn * .28})`, zIndex: 6}}><Stamp rotate={-5}>DISPARU</Stamp></div>
      </Frame>
    );
  }

  if (kind === "shame") {
    const form = spring({frame: Math.max(0, frame - 16), fps, config: {damping: 18, stiffness: 115}});
    const crossed = interpolate(frame, [58, 95], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
    return (
      <Frame>
        <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 45% 40%,#251117,#050505 58%)"}} />
        <div style={{position: "absolute", top: 150, left: 82, right: 82}}>
          <Kicker>ET POURTANT…</Kicker>
          <Big size={76}>IL NE PORTE{`\n`}PAS PLAINTE.</Big>
        </div>
        <div style={{position: "absolute", left: 82, top: 590, width: 670, background: PAPER, color: "#111", padding: "30px 34px 42px", transform: `translateY(${(1 - form) * 70}px) rotate(-1deg)`, opacity: form, boxShadow: "0 20px 55px #000c"}}>
          <div style={{fontFamily: "Georgia,serif", fontSize: 18, letterSpacing: 4}}>DÉCLARATION</div>
          <div style={{fontFamily: "Georgia,serif", fontSize: 32, fontWeight: 800, marginTop: 18}}>PLAINTE</div>
          <div style={{height: 2, background: "#aaa", margin: "24px 0"}} />
          <div style={{fontFamily: "Georgia,serif", fontSize: 20, lineHeight: 1.7}}>Nom : André Poisson<br/>Motif : escroquerie<br/>Signature : __________________</div>
          <div style={{position: "absolute", right: 30, bottom: 30, opacity: crossed}}><Stamp rotate={-10}>NON DÉPOSÉE</Stamp></div>
        </div>
        <div style={{position: "absolute", left: 82, right: 82, bottom: 385, borderTop: "2px solid #333", paddingTop: 24, fontSize: 20, letterSpacing: 5, color: "#777"}}>HONTE · SILENCE · AUCUNE ALERTE</div>
      </Frame>
    );
  }

  if (kind === "again") {
    const pulse = interpolate(frame, [0, 12, 27], [0.75, 1.08, 1], {extrapolateRight: "clamp"});
    const two = spring({frame: Math.max(0, frame - 50), fps, config: {damping: 15, stiffness: 150}});
    return (
      <Frame>
        <ArchiveImage src={LUSTIG_URL} zoom={1.16} dark={0.48} position="center 28%" />
        <div style={{position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(0,0,0,.92),rgba(0,0,0,.12))"}} />
        <div style={{position: "absolute", top: 180, left: 82, width: 720, zIndex: 5}}>
          <Kicker>LE PLUS FOU</Kicker>
          <Big size={76}>IL REVIENT{`\n`}À PARIS.</Big>
          <div style={{marginTop: 38, display: "inline-block", background: RED, padding: "10px 22px", fontSize: 52, fontWeight: 950, transform: `scale(${pulse})`, transformOrigin: "left center"}}>POUR RECOMMENCER.</div>
        </div>
        <div style={{position: "absolute", right: 92, top: 690, fontSize: 210, fontWeight: 950, color: RED, lineHeight: .8, opacity: two, transform: `scale(${.75 + two * .25})`, transformOrigin: "center"}}>2×</div>
        <div style={{position: "absolute", right: 95, top: 855, fontSize: 17, letterSpacing: 6, color: "#ddd", zIndex: 5}}>LA MÊME TOUR</div>
        <div style={{position: "absolute", bottom: 360, left: 82, fontSize: 17, letterSpacing: 5, color: "#aaa", zIndex: 5}}>VICTOR LUSTIG · ARCHIVE</div>
      </Frame>
    );
  }

  if (kind === "lesson") {
    const reveal1 = spring({frame: Math.max(0, frame - 45), fps, config: {damping: 18, stiffness: 110}});
    const reveal2 = spring({frame: Math.max(0, frame - 130), fps, config: {damping: 18, stiffness: 110}});
    const split = interpolate(frame, [175, 235], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
    return (
      <Frame>
        <ArchiveImage src={LUSTIG_URL} zoom={1.18} x={220} dark={0.82} position="center 25%" />
        <div style={{position: "absolute", inset: 0, background: "linear-gradient(90deg,#050505 0%,rgba(5,5,5,.95) 55%,rgba(5,5,5,.55))"}} />
        <div style={{position: "absolute", top: 130, left: 82, right: 82, zIndex: 5}}>
          <Kicker>LA LEÇON PSYCHOLOGIQUE</Kicker>
          <Big size={68}>LE MENSONGE{`\n`}NE SUFFIT PAS.</Big>
        </div>
        <div style={{position: "absolute", top: 575, left: 82, width: 760, zIndex: 5}}>
          <div style={{display: "flex", gap: 18, alignItems: "stretch", transform: `translateY(${(1 - reveal1) * 25}px)`, opacity: reveal1}}>
            <div style={{flex: 1, padding: 22, border: "2px solid #333", background: "rgba(0,0,0,.72)"}}>
              <div style={{fontSize: 16, letterSpacing: 5, color: "#888"}}>1</div>
              <div style={{fontSize: 34, fontWeight: 950, marginTop: 9}}>LE MENSONGE</div>
            </div>
            <div style={{width: 70, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, color: RED, fontWeight: 950}}>+</div>
            <div style={{flex: 1, padding: 22, border: "2px solid #333", background: "rgba(0,0,0,.72)"}}>
              <div style={{fontSize: 16, letterSpacing: 5, color: "#888"}}>2</div>
              <div style={{fontSize: 34, fontWeight: 950, marginTop: 9}}>LE CONTEXTE</div>
            </div>
          </div>
          <div style={{marginTop: 36, padding: "28px 30px", borderLeft: `6px solid ${RED}`, background: "rgba(242,13,47,.08)", transform: `translateY(${(1 - reveal2) * 25}px)`, opacity: reveal2}}>
            <div style={{fontSize: 25, lineHeight: 1.45, color: "#ddd"}}>Ça devient puissant quand l’histoire ressemble exactement à ce que la victime est déjà prête à croire.</div>
          </div>
          <div style={{marginTop: 48, display: "flex", alignItems: "center", gap: 22, opacity: split}}>
            <div style={{fontSize: 72, fontWeight: 950, color: RED}}>CRÉDIBLE</div>
            <div style={{fontSize: 42, color: "#777"}}>≠</div>
            <div style={{fontSize: 72, fontWeight: 950}}>VRAI</div>
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
    <div style={{position: "absolute", left: 88, right: 88, bottom: 250, zIndex: 70, display: "flex", justifyContent: "center", opacity: enter, transform: `translateY(${(1 - enter) * 10}px)`}}>
      <div style={{background: "rgba(0,0,0,.82)", borderBottom: `3px solid ${RED}`, padding: "15px 23px", fontFamily: "Arial,Helvetica,sans-serif", fontSize: 39, fontWeight: 780, lineHeight: 1.2, textAlign: "center", maxWidth: 890, boxShadow: "0 8px 24px #0009"}}>
        {parts[0]}<span style={{color: RED}}>{cap.hot}</span>{parts[1]}
      </div>
    </div>
  );
};

export const VictorLustigV2Video = () => (
  <AbsoluteFill style={{background: BLACK, color: WHITE}}>
    <Audio src={AUDIO_URL} volume={1} />
    <Audio src={staticFile("victor-bed.wav")} volume={0.08} />
    <Sequence from={0} durationInFrames={28}><Audio src={staticFile("victor-hit.wav")} volume={0.28} /></Sequence>
    <Sequence from={66} durationInFrames={28}><Audio src={staticFile("victor-hit.wav")} volume={0.20} /></Sequence>
    <Sequence from={706} durationInFrames={28}><Audio src={staticFile("victor-hit.wav")} volume={0.16} /></Sequence>
    <Sequence from={1310} durationInFrames={28}><Audio src={staticFile("victor-hit.wav")} volume={0.20} /></Sequence>
    {scenes.map((scene) => (
      <Sequence key={scene.from} from={scene.from} durationInFrames={scene.duration}>
        <Scene kind={scene.kind} />
      </Sequence>
    ))}
    <Grain />
    <Subtitle />
  </AbsoluteFill>
);

export const VictorLustigV2Composition = () => (
  <Composition id="VictorLustigV2" component={VictorLustigV2Video} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
);
