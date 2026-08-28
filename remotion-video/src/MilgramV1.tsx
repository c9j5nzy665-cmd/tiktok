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
const PAPER = "#ded7ca";
const FPS = 30;
const TOTAL_FRAMES = 1740;

const AUDIO_URL =
  "https://resource2.heygen.ai/text_to_speech/5d875a3e07b64bbb909ad6947106c6ea/25a6a67280574d3da78e97b1935ebfc7/id=d51c9eb8-889a-49f8-baa9-c6d0c2e7ef6a.wav";

const AD_URL =
  "https://upload.wikimedia.org/wikipedia/commons/3/34/Milgram_Experiment_advertising.png";
const DIAGRAM_URL =
  "https://upload.wikimedia.org/wikipedia/commons/d/dd/Exp%C3%A9rience_de_Milgram.png";
const MILGRAM_URL =
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Stanley_Milgram_1954.jpg";

type SceneKind =
  | "hook"
  | "yale"
  | "machine"
  | "protest"
  | "authority"
  | "result"
  | "reveal"
  | "milgram"
  | "question"
  | "outro";

const scenes: {from: number; duration: number; kind: SceneKind}[] = [
  {from: 0, duration: 105, kind: "hook"},
  {from: 105, duration: 225, kind: "yale"},
  {from: 330, duration: 150, kind: "machine"},
  {from: 480, duration: 200, kind: "protest"},
  {from: 680, duration: 160, kind: "authority"},
  {from: 840, duration: 135, kind: "result"},
  {from: 975, duration: 210, kind: "reveal"},
  {from: 1185, duration: 255, kind: "milgram"},
  {from: 1440, duration: 210, kind: "question"},
  {from: 1650, duration: 90, kind: "outro"},
];

const captions = [
  {from: 0, to: 105, text: "En 1961, à Yale…", hot: "Yale"},
  {from: 105, to: 205, text: "Des hommes ordinaires pensent participer à une expérience sur la mémoire.", hot: "hommes ordinaires"},
  {from: 215, to: 330, text: "Devant eux, une machine de 15 à 450 volts.", hot: "450 volts"},
  {from: 330, to: 470, text: "À chaque mauvaise réponse, ils doivent augmenter la décharge.", hot: "augmenter"},
  {from: 480, to: 575, text: "À 150 volts, il exige d’être libéré.", hot: "150 volts"},
  {from: 585, to: 630, text: "Puis il refuse de répondre.", hot: "refuse"},
  {from: 642, to: 680, text: "Beaucoup veulent arrêter.", hot: "arrêter"},
  {from: 680, to: 825, text: "Mais l’homme en blouse blanche répète : « L’expérience exige que vous continuiez. »", hot: "continuiez"},
  {from: 840, to: 975, text: "Résultat : 65 % vont jusqu’à 450 volts.", hot: "65 %"},
  {from: 985, to: 1030, text: "Aucun choc n’était réel.", hot: "Aucun choc"},
  {from: 1040, to: 1115, text: "L’homme derrière le mur était un acteur.", hot: "acteur"},
  {from: 1118, to: 1185, text: "Mais les participants croyaient pouvoir lui faire du mal.", hot: "croyaient"},
  {from: 1185, to: 1280, text: "Stanley Milgram révélait quelque chose de dérangeant.", hot: "dérangeant"},
  {from: 1280, to: 1440, text: "Sous la pression d’une autorité légitime, des gens ordinaires peuvent aller beaucoup plus loin qu’ils ne l’imaginent.", hot: "autorité"},
  {from: 1450, to: 1590, text: "La vraie question n’est peut-être pas : « Est-ce que j’aurais obéi ? »", hot: "obéi"},
  {from: 1590, to: 1650, text: "Mais : « À quel moment j’aurais arrêté ? »", hot: "arrêté"},
] as const;

const Grain = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 70,
        opacity: 0.11,
        mixBlendMode: "screen",
        backgroundImage:
          "repeating-radial-gradient(circle at 20% 30%,rgba(255,255,255,.24) 0 1px,transparent 1px 4px)",
        backgroundSize: "7px 7px",
        transform: `translate(${(frame % 4) - 2}px,${((frame * 3) % 5) - 2}px)`,
      }}
    />
  );
};

const Frame = ({children}: {children: React.ReactNode}) => (
  <AbsoluteFill
    style={{
      background: BLACK,
      color: WHITE,
      overflow: "hidden",
      fontFamily: "Arial, Helvetica, sans-serif",
    }}
  >
    <div style={{position: "absolute", inset: 52, border: "2px solid rgba(255,255,255,.14)", zIndex: 45}} />
    <div style={{position: "absolute", top: 52, right: 52, width: 7, height: 190, background: RED, zIndex: 46}} />
    <div style={{position: "absolute", left: 52, bottom: 52, width: 110, height: 2, background: "rgba(255,255,255,.28)", zIndex: 46}} />
    {children}
  </AbsoluteFill>
);

const Kicker = ({children}: {children: React.ReactNode}) => (
  <div style={{fontSize: 22, fontWeight: 900, letterSpacing: 7, color: RED, marginBottom: 18}}>{children}</div>
);

const Big = ({children, size = 82}: {children: React.ReactNode; size?: number}) => (
  <div style={{fontSize: size, lineHeight: 0.92, fontWeight: 950, letterSpacing: -3, whiteSpace: "pre-line"}}>{children}</div>
);

const Stamp = ({children, rotate = -7}: {children: React.ReactNode; rotate?: number}) => (
  <div
    style={{
      display: "inline-block",
      border: `5px solid ${RED}`,
      color: RED,
      padding: "10px 16px 8px",
      fontSize: 25,
      fontWeight: 950,
      letterSpacing: 5,
      transform: `rotate(${rotate}deg)`,
    }}
  >
    {children}
  </div>
);

const ShockMachine = ({progress}: {progress: number}) => {
  const levels = [15, 45, 75, 105, 135, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450];
  const active = Math.round(progress * (levels.length - 1));
  return (
    <div
      style={{
        width: 850,
        background: "linear-gradient(180deg,#d9d5ca,#aaa59a)",
        color: "#111",
        border: "9px solid #57534c",
        boxShadow: "0 30px 80px #000c",
        padding: "30px 34px 36px",
      }}
    >
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div style={{fontFamily: "Georgia,serif", fontSize: 20, letterSpacing: 4}}>SHOCK GENERATOR</div>
        <div style={{fontSize: 18, fontWeight: 900, letterSpacing: 4}}>15 — 450 VOLTS</div>
      </div>
      <div style={{height: 3, background: "#555", margin: "20px 0 28px"}} />
      <div style={{display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 15}}>
        {levels.map((v, i) => (
          <div key={v} style={{textAlign: "center"}}>
            <div style={{fontSize: 14, fontWeight: 900, marginBottom: 8}}>{v}</div>
            <div
              style={{
                height: 54,
                borderRadius: 5,
                background: i <= active ? RED : "#393733",
                border: "3px solid #222",
                boxShadow: i === active ? "0 0 26px rgba(242,13,47,.85)" : "inset 0 2px 5px #0008",
                transform: i === active ? "translateY(5px)" : "none",
              }}
            />
          </div>
        ))}
      </div>
      <div style={{marginTop: 28, display: "flex", justifyContent: "space-between", color: "#4b4945", fontSize: 15, fontWeight: 900, letterSpacing: 3}}>
        <span>SLIGHT SHOCK</span><span>STRONG SHOCK</span><span>DANGER</span><span>XXX</span>
      </div>
    </div>
  );
};

const Scene = ({kind}: {kind: SceneKind}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 20, stiffness: 120}});
  const rise = (1 - enter) * 28;

  if (kind === "hook") {
    const number = Math.round(interpolate(frame, [5, 48], [0, 65], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
    const voltage = interpolate(frame, [45, 92], [15, 450], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
    const flash = interpolate(frame, [0, 4, 9], [1, 0.2, 0], {extrapolateRight: "clamp"});
    return (
      <Frame>
        <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 28%,#39070e,transparent 32%),#050505"}} />
        <AbsoluteFill style={{background: `rgba(255,255,255,${flash})`, zIndex: 2}} />
        <div style={{position: "absolute", top: 150, left: 80, right: 80, zIndex: 5, transform: `translateY(${rise}px)`, opacity: enter}}>
          <Kicker>UNE EXPÉRIENCE QUI DÉRANGE ENCORE</Kicker>
          <div style={{fontSize: 190, lineHeight: .8, fontWeight: 950, letterSpacing: -10, color: RED}}>{number}%</div>
          <Big size={76}>ONT CONTINUÉ{`\n`}JUSQU’AU BOUT.</Big>
        </div>
        <div style={{position: "absolute", left: 82, right: 82, top: 800, borderTop: "2px solid #2c2c2c", paddingTop: 28}}>
          <div style={{fontSize: 24, letterSpacing: 6, color: "#888"}}>TENSION AFFICHÉE</div>
          <div style={{fontSize: 112, fontWeight: 950, marginTop: 10}}>{Math.round(voltage)} <span style={{fontSize: 44, color: RED}}>VOLTS</span></div>
        </div>
        <div style={{position: "absolute", right: 82, bottom: 350}}><Stamp rotate={4}>YALE · 1961</Stamp></div>
      </Frame>
    );
  }

  if (kind === "yale") {
    const card = spring({frame: Math.max(0, frame - 30), fps, config: {damping: 18, stiffness: 115}});
    return (
      <Frame>
        <div style={{position: "absolute", inset: 0, background: "linear-gradient(135deg,#080808,#1c070b 75%,#050505)"}} />
        <div style={{position: "absolute", top: 115, left: 80, right: 80}}>
          <Kicker>NEW HAVEN · CONNECTICUT</Kicker>
          <Big size={68}>UNE ÉTUDE{`\n`}SUR LA MÉMOIRE.</Big>
        </div>
        <div style={{position: "absolute", left: 80, top: 520, width: 465, background: PAPER, padding: 16, transform: `translateY(${(1 - card) * 50}px) rotate(-2deg)`, opacity: card, boxShadow: "0 25px 65px #000b"}}>
          <Img src={AD_URL} style={{width: "100%", height: 650, objectFit: "cover", objectPosition: "top", filter: "grayscale(1) contrast(1.12)"}} />
          <div style={{fontSize: 15, letterSpacing: 4, color: "#555", marginTop: 12}}>ANNONCE DE RECRUTEMENT · 1961</div>
        </div>
        <div style={{position: "absolute", right: 80, top: 590, width: 390}}>
          <div style={{fontSize: 17, letterSpacing: 5, color: "#777"}}>CE QU’ILS CROIENT TESTER</div>
          <div style={{fontSize: 54, lineHeight: .95, fontWeight: 950, marginTop: 14}}>MÉMOIRE{`\n`}ET APPRENTISSAGE</div>
          <div style={{height: 6, width: 110, background: RED, marginTop: 28}} />
          <div style={{fontSize: 25, lineHeight: 1.4, color: "#bbb", marginTop: 30}}>Des volontaires ordinaires. Une université prestigieuse. Un protocole qui paraît scientifique.</div>
        </div>
      </Frame>
    );
  }

  if (kind === "machine") {
    const progress = interpolate(frame, [0, 135], [0.02, 1], {extrapolateRight: "clamp"});
    return (
      <Frame>
        <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 46%,#251015,#050505 56%)"}} />
        <div style={{position: "absolute", top: 118, left: 80, right: 80}}>
          <Kicker>LE PROTOCOLE</Kicker>
          <Big size={66}>À CHAQUE ERREUR…{`\n`}ON MONTE.</Big>
        </div>
        <div style={{position: "absolute", left: 115, top: 575, transform: `scale(${.94 + enter * .06})`, transformOrigin: "top center"}}>
          <ShockMachine progress={progress} />
        </div>
        <div style={{position: "absolute", left: 82, bottom: 370, fontSize: 20, color: "#888", letterSpacing: 5}}>15 V → 30 V → 45 V → … → <span style={{color: RED, fontWeight: 950}}>450 V</span></div>
      </Frame>
    );
  }

  if (kind === "protest") {
    const volts = Math.round(interpolate(frame, [0, 70], [75, 150], {extrapolateRight: "clamp"}));
    const silence = interpolate(frame, [112, 160], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
    return (
      <Frame>
        <div style={{position: "absolute", inset: 0, background: "linear-gradient(180deg,#090909,#030303)"}} />
        <div style={{position: "absolute", top: 120, left: 82, right: 82}}>
          <Kicker>DE L’AUTRE CÔTÉ DU MUR</Kicker>
          <Big size={68}>IL DEMANDE{`\n`}D’ARRÊTER.</Big>
        </div>
        <div style={{position: "absolute", left: 82, top: 590, width: 520, height: 360, border: "2px solid #333", background: "rgba(255,255,255,.025)", padding: 32}}>
          <div style={{fontSize: 18, letterSpacing: 5, color: "#777"}}>NIVEAU</div>
          <div style={{fontSize: 130, lineHeight: .85, fontWeight: 950, color: RED, marginTop: 20}}>{volts}V</div>
          <div style={{fontSize: 27, fontWeight: 900, marginTop: 35}}>« LAISSEZ-MOI SORTIR. »</div>
        </div>
        <div style={{position: "absolute", right: 82, top: 620, width: 360, height: 300, background: PAPER, padding: 20, transform: "rotate(2deg)", boxShadow: "0 20px 50px #000a"}}>
          <Img src={DIAGRAM_URL} style={{width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) contrast(1.1)"}} />
        </div>
        <div style={{position: "absolute", left: 82, right: 82, top: 1030, opacity: silence}}>
          <div style={{height: 2, background: "#333"}} />
          <div style={{fontSize: 56, fontWeight: 950, letterSpacing: 8, marginTop: 28}}>PUIS… <span style={{color: RED}}>SILENCE.</span></div>
        </div>
      </Frame>
    );
  }

  if (kind === "authority") {
    const pulse = interpolate(frame, [35, 50, 74], [.86, 1.06, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
    return (
      <Frame>
        <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 78% 35%,#32060c,transparent 34%),#050505"}} />
        <div style={{position: "absolute", top: 125, left: 82, right: 82}}>
          <Kicker>L’AUTORITÉ</Kicker>
          <Big size={72}>L’HOMME EN{`\n`}BLOUSE BLANCHE.</Big>
        </div>
        <div style={{position: "absolute", top: 610, left: 82, right: 82, padding: "42px 46px", borderLeft: `8px solid ${RED}`, background: "rgba(255,255,255,.035)", transform: `scale(${pulse})`, transformOrigin: "left center"}}>
          <div style={{fontSize: 25, letterSpacing: 5, color: "#888"}}>IL RÉPÈTE</div>
          <div style={{fontSize: 64, lineHeight: 1.02, fontWeight: 950, marginTop: 24}}>« L’EXPÉRIENCE EXIGE{`\n`}QUE VOUS CONTINUIEZ. »</div>
        </div>
        <div style={{position: "absolute", bottom: 390, left: 82, fontSize: 20, letterSpacing: 5, color: "#777"}}>UNE PHRASE · AUCUNE FORCE PHYSIQUE</div>
      </Frame>
    );
  }

  if (kind === "result") {
    const n = Math.round(interpolate(frame, [0, 50], [0, 65], {extrapolateRight: "clamp"}));
    const volt = Math.round(interpolate(frame, [48, 92], [150, 450], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
    return (
      <Frame>
        <div style={{position: "absolute", inset: 0, background: "#050505"}} />
        <div style={{position: "absolute", top: 125, left: 82, right: 82}}>
          <Kicker>LE RÉSULTAT · CONDITION DE BASE</Kicker>
          <div style={{fontSize: 250, lineHeight: .78, fontWeight: 950, color: RED, letterSpacing: -14}}>{n}%</div>
          <Big size={64}>VONT JUSQU’AU{`\n`}MAXIMUM.</Big>
        </div>
        <div style={{position: "absolute", left: 82, right: 82, top: 930, borderTop: "2px solid #333", paddingTop: 30, display: "flex", alignItems: "baseline", justifyContent: "space-between"}}>
          <div style={{fontSize: 22, letterSpacing: 5, color: "#777"}}>DERNIER INTERRUPTEUR</div>
          <div style={{fontSize: 112, fontWeight: 950}}>{volt}<span style={{fontSize: 34, color: RED, marginLeft: 10}}>VOLTS</span></div>
        </div>
      </Frame>
    );
  }

  if (kind === "reveal") {
    const fake = spring({frame: Math.max(0, frame - 18), fps, config: {damping: 16, stiffness: 145}});
    const actor = spring({frame: Math.max(0, frame - 85), fps, config: {damping: 17, stiffness: 120}});
    return (
      <Frame>
        <div style={{position: "absolute", inset: 0, background: "linear-gradient(135deg,#050505,#1c070b 75%,#050505)"}} />
        <div style={{position: "absolute", top: 125, left: 82, right: 82}}>
          <Kicker>LE TWIST</Kicker>
          <Big size={72}>AUCUN CHOC{`\n`}N’ÉTAIT RÉEL.</Big>
        </div>
        <div style={{position: "absolute", left: 82, top: 610, width: 520, padding: 34, background: PAPER, color: "#111", transform: `rotate(-2deg) scale(${.85 + fake * .15})`, opacity: fake, boxShadow: "0 20px 60px #000b"}}>
          <div style={{fontSize: 17, letterSpacing: 5}}>RÉVÉLATION</div>
          <div style={{fontSize: 64, fontWeight: 950, marginTop: 25, lineHeight: .92}}>DÉCHARGES{`\n`}SIMULÉES</div>
          <div style={{height: 7, width: 130, background: RED, marginTop: 32}} />
          <div style={{fontSize: 23, lineHeight: 1.4, marginTop: 28}}>Le « learner » ne recevait aucune électricité.</div>
        </div>
        <div style={{position: "absolute", right: 82, top: 720, width: 360, border: "2px solid #333", padding: 25, opacity: actor, transform: `translateX(${(1 - actor) * 60}px)`}}>
          <div style={{fontSize: 17, letterSpacing: 5, color: "#888"}}>DERRIÈRE LE MUR</div>
          <div style={{fontSize: 62, fontWeight: 950, marginTop: 18}}>UN{`\n`}ACTEUR.</div>
          <div style={{marginTop: 35}}><Stamp rotate={5}>MAIS ILS Y CROYAIENT</Stamp></div>
        </div>
      </Frame>
    );
  }

  if (kind === "milgram") {
    const portrait = spring({frame: Math.max(0, frame - 10), fps, config: {damping: 18, stiffness: 110}});
    const line = interpolate(frame, [85, 190], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
    return (
      <Frame>
        <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 75% 30%,#2b0b10,transparent 35%),#050505"}} />
        <div style={{position: "absolute", top: 118, left: 82, right: 82}}>
          <Kicker>STANLEY MILGRAM</Kicker>
          <Big size={69}>CE N’EST PAS{`\n`}UNE HISTOIRE DE MONSTRES.</Big>
        </div>
        <div style={{position: "absolute", right: 82, top: 520, width: 360, background: PAPER, padding: 15, opacity: portrait, transform: `translateY(${(1 - portrait) * 55}px) rotate(2deg)`, boxShadow: "0 22px 60px #000b"}}>
          <Img src={MILGRAM_URL} style={{width: "100%", height: 430, objectFit: "cover", objectPosition: "center 20%", filter: "grayscale(1) contrast(1.18)"}} />
          <div style={{fontSize: 15, letterSpacing: 4, color: "#555", marginTop: 12}}>STANLEY MILGRAM · ARCHIVE</div>
        </div>
        <div style={{position: "absolute", left: 82, top: 620, width: 530}}>
          <div style={{fontSize: 27, lineHeight: 1.45, color: "#ccc"}}>Sous la pression d’une autorité légitime, des gens ordinaires peuvent dépasser leurs propres limites.</div>
          <div style={{height: 4, width: `${line * 100}%`, background: RED, marginTop: 34}} />
          <div style={{fontSize: 20, letterSpacing: 5, color: "#777", marginTop: 25}}>AUTORITÉ · CONTEXTE · OBÉISSANCE</div>
        </div>
      </Frame>
    );
  }

  if (kind === "question") {
    const q1 = spring({frame: Math.max(0, frame - 5), fps, config: {damping: 19, stiffness: 115}});
    const q2 = spring({frame: Math.max(0, frame - 100), fps, config: {damping: 18, stiffness: 130}});
    return (
      <Frame>
        <div style={{position: "absolute", inset: 0, background: "linear-gradient(180deg,#050505,#120508)"}} />
        <div style={{position: "absolute", top: 140, left: 82, right: 82}}>
          <Kicker>LA VRAIE QUESTION</Kicker>
          <div style={{opacity: q1, transform: `translateY(${(1 - q1) * 30}px)`}}>
            <Big size={65}>« EST-CE QUE{`\n`}J’AURAIS OBÉI ? »</Big>
          </div>
        </div>
        <div style={{position: "absolute", left: 82, right: 82, top: 720, opacity: q2, transform: `translateY(${(1 - q2) * 30}px)`}}>
          <div style={{fontSize: 22, letterSpacing: 6, color: "#777"}}>PEUT-ÊTRE PAS.</div>
          <div style={{fontSize: 78, lineHeight: .95, fontWeight: 950, marginTop: 20}}>« À QUEL MOMENT{`\n`}J’AURAIS <span style={{color: RED}}>ARRÊTÉ ?</span> »</div>
        </div>
        <div style={{position: "absolute", left: 82, bottom: 370, right: 82, height: 2, background: "#333"}} />
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
    <div style={{position: "absolute", left: 88, right: 88, bottom: 250, zIndex: 80, display: "flex", justifyContent: "center", opacity: enter, transform: `translateY(${(1 - enter) * 10}px)`}}>
      <div style={{background: "rgba(0,0,0,.83)", borderBottom: `3px solid ${RED}`, padding: "15px 23px", fontSize: 39, fontWeight: 780, lineHeight: 1.2, textAlign: "center", maxWidth: 890, boxShadow: "0 8px 24px #0009"}}>
        {parts[0]}<span style={{color: RED}}>{cap.hot}</span>{parts[1]}
      </div>
    </div>
  );
};

const CutFlashes = () => {
  const frame = useCurrentFrame();
  const cuts = [105, 330, 480, 680, 840, 975, 1185, 1440, 1650];
  const d = cuts.reduce((best, cut) => Math.min(best, Math.abs(frame - cut)), 999);
  const opacity = interpolate(d, [0, 1, 4], [0.16, 0.06, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return <AbsoluteFill style={{pointerEvents: "none", zIndex: 75, background: `rgba(255,255,255,${opacity})`}} />;
};

export const MilgramV1Video = () => (
  <AbsoluteFill style={{background: BLACK, color: WHITE}}>
    <Audio src={AUDIO_URL} volume={1} />
    <Audio src={staticFile("milgram-bed.wav")} volume={0.07} />
    <Sequence from={0} durationInFrames={28}><Audio src={staticFile("milgram-hit.wav")} volume={0.26} /></Sequence>
    <Sequence from={840} durationInFrames={28}><Audio src={staticFile("milgram-hit.wav")} volume={0.22} /></Sequence>
    <Sequence from={975} durationInFrames={28}><Audio src={staticFile("milgram-hit.wav")} volume={0.17} /></Sequence>
    <Sequence from={1590} durationInFrames={28}><Audio src={staticFile("milgram-hit.wav")} volume={0.15} /></Sequence>
    {scenes.map((scene) => (
      <Sequence key={scene.from} from={scene.from} durationInFrames={scene.duration}>
        <Scene kind={scene.kind} />
      </Sequence>
    ))}
    <Grain />
    <CutFlashes />
    <Subtitle />
  </AbsoluteFill>
);

export const MilgramV1Composition = () => (
  <Composition id="MilgramV1" component={MilgramV1Video} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
);
