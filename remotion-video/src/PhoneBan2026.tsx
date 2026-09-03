import React from "react";
import {
  AbsoluteFill,
  Composition,
  Img,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const RED = "#f20d2f";
const INK = "#111111";
const PAPER = "#f4f1e9";
const WHITE = "#fffdf8";
const MUTED = "#a8a39a";
const FPS = 30;
const TOTAL_FRAMES = 1170; // 39s

const IMG_PHONE_SOLO =
  "https://images.pexels.com/photos/7092370/pexels-photo-7092370.jpeg?cs=srgb&dl=pexels-rdne-7092370.jpg&fm=jpg";
const IMG_PHONE_CLASS =
  "https://images.pexels.com/photos/6936147/pexels-photo-6936147.jpeg?cs=srgb&dl=pexels-rdne-6936147.jpg&fm=jpg";
const IMG_TALKING_LECTURE =
  "https://images.pexels.com/photos/8197498/pexels-photo-8197498.jpeg?cs=srgb&dl=pexels-yankrukov-8197498.jpg&fm=jpg";
const IMG_TALKING_CLASS =
  "https://images.pexels.com/photos/8419499/pexels-photo-8419499.jpeg?cs=srgb&dl=pexels-rdne-8419499.jpg&fm=jpg";

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

const Grain = () => {
  const frame = useCurrentFrame();
  const x = (frame * 17) % 37;
  const y = (frame * 11) % 29;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 60,
        opacity: 0.12,
        mixBlendMode: "multiply",
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(0,0,0,.18) 0 1px, transparent 1.2px), radial-gradient(circle at 80% 65%, rgba(0,0,0,.12) 0 1px, transparent 1.3px)",
        backgroundSize: "13px 13px, 17px 17px",
        backgroundPosition: `${x}px ${y}px, ${-x}px ${-y}px`,
      }}
    />
  );
};

const Brand = ({inverse = false}: {inverse?: boolean}) => (
  <div
    style={{
      position: "absolute",
      left: 68,
      right: 68,
      bottom: 82,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      zIndex: 40,
      fontFamily: "Arial, Helvetica, sans-serif",
      color: inverse ? WHITE : INK,
    }}
  >
    <div style={{fontWeight: 900, fontSize: 28, letterSpacing: 2.2}}>HORS CADRE</div>
    <div style={{fontWeight: 700, fontSize: 19, letterSpacing: 0.8, opacity: 0.72}}>PENSE AUTREMENT.</div>
  </div>
);

const RedRule = ({top = 88}: {top?: number}) => (
  <div
    style={{
      position: "absolute",
      left: 68,
      top,
      width: 124,
      height: 9,
      background: RED,
      borderRadius: 999,
      zIndex: 30,
    }}
  />
);

const Kicker = ({children, inverse = false}: {children: React.ReactNode; inverse?: boolean}) => (
  <div
    style={{
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: 26,
      fontWeight: 900,
      letterSpacing: 3.4,
      textTransform: "uppercase",
      color: inverse ? WHITE : RED,
      marginBottom: 22,
    }}
  >
    {children}
  </div>
);

const Title = ({children, inverse = false, size = 116}: {children: React.ReactNode; inverse?: boolean; size?: number}) => (
  <div
    style={{
      fontFamily: "Arial Black, Arial, Helvetica, sans-serif",
      fontSize: size,
      lineHeight: 0.88,
      letterSpacing: -6,
      fontWeight: 950,
      textTransform: "uppercase",
      color: inverse ? WHITE : INK,
    }}
  >
    {children}
  </div>
);

const Small = ({children, inverse = false}: {children: React.ReactNode; inverse?: boolean}) => (
  <div
    style={{
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: 34,
      lineHeight: 1.22,
      fontWeight: 700,
      color: inverse ? "rgba(255,253,248,.86)" : "rgba(17,17,17,.72)",
      marginTop: 30,
      maxWidth: 870,
    }}
  >
    {children}
  </div>
);

const PhotoLayer = ({src, dark = 0.36, zoom = 1.08}: {src: string; dark?: number; zoom?: number}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [zoom, zoom + 0.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{overflow: "hidden", background: INK}}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,${dark * 0.6}), rgba(0,0,0,${dark}) 55%, rgba(0,0,0,${Math.min(0.78, dark + 0.2)}))`,
        }}
      />
    </AbsoluteFill>
  );
};

const PhoneShape = () => {
  const frame = useCurrentFrame();
  const jitter = Math.sin(frame * 0.45) * 2.2;
  return (
    <div
      style={{
        position: "absolute",
        width: 330,
        height: 650,
        left: 375,
        top: 445,
        borderRadius: 58,
        border: `14px solid ${INK}`,
        background: "#171717",
        transform: `rotate(${jitter * 0.22}deg)`,
        boxShadow: "0 34px 80px rgba(0,0,0,.28)",
        overflow: "hidden",
      }}
    >
      <div style={{height: 42, width: 126, borderRadius: 999, background: INK, margin: "18px auto 0"}} />
      {[0, 1, 2, 3, 4].map((i) => {
        const t = clamp((frame - i * 8) / 16);
        return (
          <div
            key={i}
            style={{
              margin: `${i === 0 ? 65 : 16}px 22px 0`,
              height: 70,
              borderRadius: 18,
              background: i === 0 ? RED : "#f4f1e9",
              transform: `translateX(${interpolate(t, [0, 1], [360, 0])}px)`,
              opacity: t,
              display: "flex",
              alignItems: "center",
              padding: "0 18px",
              fontFamily: "Arial, sans-serif",
              fontWeight: 900,
              fontSize: 20,
              color: i === 0 ? WHITE : INK,
            }}
          >
            {i === 0 ? "12 nouvelles notifications" : ["Snapchat", "TikTok", "Messages", "Instagram"][i - 1]}
          </div>
        );
      })}
    </div>
  );
};

const Hook = () => {
  const frame = useCurrentFrame();
  const pop = spring({frame, fps: FPS, config: {damping: 13, stiffness: 170}});
  const wipe = interpolate(frame, [45, 64], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <RedRule />
      <PhoneShape />
      <div style={{position: "absolute", left: 68, top: 160, width: 900, zIndex: 25}}>
        <Kicker>France · rentrée 2026</Kicker>
        <div style={{transform: `scale(${0.82 + pop * 0.18})`, transformOrigin: "left top"}}>
          <Title size={150}>C’EST<br />FINI.</Title>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: INK,
          transformOrigin: "left center",
          transform: `scaleX(${wipe})`,
          zIndex: 35,
        }}
      />
      <Brand />
    </AbsoluteFill>
  );
};

const SceneRule = () => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, 22], [70, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill>
      <PhotoLayer src={IMG_PHONE_CLASS} dark={0.58} zoom={1.04} />
      <RedRule />
      <div style={{position: "absolute", left: 68, top: 190, width: 920, transform: `translateY(${y}px)`, zIndex: 20}}>
        <Kicker inverse>Depuis le 1er septembre 2026</Kicker>
        <Title inverse size={112}>L’USAGE<br />DU TÉLÉPHONE<br /><span style={{color: RED}}>INTERDIT.</span></Title>
        <Small inverse>Dans les lycées français, la règle vise l’utilisation du téléphone pendant le temps scolaire.</Small>
      </div>
      <Brand inverse />
    </AbsoluteFill>
  );
};

const SceneScope = () => {
  const frame = useCurrentFrame();
  const split = interpolate(frame, [0, 28], [56, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{background: WHITE}}>
      <Img
        src={IMG_PHONE_SOLO}
        style={{position: "absolute", right: 0, top: 0, width: 590, height: 1920, objectFit: "cover", objectPosition: "58% center"}}
      />
      <div style={{position: "absolute", right: 0, top: 0, width: 590, height: 1920, background: "linear-gradient(90deg,#fffdf8 0%,rgba(255,253,248,.15) 35%,rgba(0,0,0,.08) 100%)"}} />
      <RedRule />
      <div style={{position: "absolute", left: 68, top: 210, width: 620, transform: `translateX(${split}px)`, zIndex: 20}}>
        <Kicker>Pas seulement en cours</Kicker>
        <Title size={102}>DANS TOUT<br />L’ÉTABLISSEMENT.</Title>
        <Small>Le principe s’applique pendant le temps scolaire. Le règlement intérieur fixe les modalités concrètes.</Small>
      </div>
      <div style={{position: "absolute", left: 68, top: 1180, width: 630, height: 4, background: INK, opacity: 0.2}} />
      <div style={{position: "absolute", left: 68, top: 1220, width: 630, fontFamily: "Arial", fontSize: 30, fontWeight: 900, color: INK}}>
        POSSÉDER UN TÉLÉPHONE ≠ L’UTILISER
      </div>
      <Brand />
    </AbsoluteFill>
  );
};

const SceneWhy = () => {
  const frame = useCurrentFrame();
  const words = ["ATTENTION.", "CONCENTRATION.", "ÉCRANS."];
  return (
    <AbsoluteFill style={{background: INK}}>
      <RedRule />
      <div style={{position: "absolute", left: 68, top: 205, width: 930}}>
        <Kicker inverse>Pourquoi cette mesure ?</Kicker>
        {words.map((w, i) => {
          const local = clamp((frame - i * 18) / 14);
          return (
            <div
              key={w}
              style={{
                fontFamily: "Arial Black, Arial, sans-serif",
                fontWeight: 950,
                fontSize: i === 1 ? 104 : 124,
                lineHeight: 1,
                letterSpacing: -4,
                color: i === 2 ? RED : WHITE,
                transform: `translateX(${interpolate(local, [0, 1], [-90, 0])}px)`,
                opacity: local,
                marginBottom: 16,
              }}
            >
              {w}
            </div>
          );
        })}
        <Small inverse>Le ministère met notamment en avant la surexposition aux écrans et la capacité à rester concentré.</Small>
      </div>
      <div style={{position: "absolute", right: 90, bottom: 270, width: 210, height: 210, border: `4px solid ${RED}`, borderRadius: "50%", opacity: 0.8}} />
      <Brand inverse />
    </AbsoluteFill>
  );
};

const SceneSanction = () => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [0, 40], [0, 690], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill>
      <PhotoLayer src={IMG_PHONE_CLASS} dark={0.68} zoom={1.1} />
      <div style={{position: "absolute", left: 68, top: 108, width: line, height: 9, background: RED, borderRadius: 999, zIndex: 20}} />
      <div style={{position: "absolute", left: 68, top: 250, width: 900, zIndex: 20}}>
        <Kicker inverse>Si la règle n’est pas respectée</Kicker>
        <Title inverse size={126}>CONFISCATION<br /><span style={{color: RED}}>POSSIBLE.</span></Title>
        <Small inverse>La confiscation peut être prévue dans le cadre fixé par l’établissement.</Small>
      </div>
      <Brand inverse />
    </AbsoluteFill>
  );
};

const SceneContrast = () => {
  const frame = useCurrentFrame();
  const slider = interpolate(frame, [15, 70], [18, 82], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{background: INK, overflow: "hidden"}}>
      <Img src={IMG_PHONE_CLASS} style={{position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover"}} />
      <div style={{position: "absolute", inset: 0, width: `${slider}%`, overflow: "hidden"}}>
        <Img src={IMG_TALKING_CLASS} style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1920, objectFit: "cover"}} />
      </div>
      <div style={{position: "absolute", left: `${slider}%`, top: 0, bottom: 0, width: 8, background: RED, transform: "translateX(-4px)"}} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(0,0,0,.18),rgba(0,0,0,.04) 45%,rgba(0,0,0,.72))"}} />
      <div style={{position: "absolute", left: 68, bottom: 270, width: 900, zIndex: 20}}>
        <Kicker inverse>L’idée derrière la mesure</Kicker>
        <Title inverse size={108}>MOINS D’ÉCRAN.<br /><span style={{color: RED}}>PLUS D’ÉCHANGES ?</span></Title>
      </div>
      <Brand inverse />
    </AbsoluteFill>
  );
};

const Final = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 7) * 0.01;
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <RedRule />
      <div style={{position: "absolute", left: 68, top: 260, width: 930, transform: `scale(${pulse})`, transformOrigin: "left center"}}>
        <Kicker>Alors…</Kicker>
        <Title size={125}>NÉCESSAIRE…<br /><span style={{color: RED}}>OU TROP LOIN ?</span></Title>
        <Small>La règle est posée. Le débat, lui, ne fait que commencer.</Small>
      </div>
      <div style={{position: "absolute", left: 68, bottom: 290, width: 940, paddingTop: 24, borderTop: `4px solid ${INK}`, fontFamily: "Arial", fontSize: 30, fontWeight: 900, letterSpacing: 1.2, color: INK}}>
        À TOI DE TRANCHER ↓
      </div>
      <Brand />
    </AbsoluteFill>
  );
};

const CutFlash = () => {
  const frame = useCurrentFrame();
  const cuts = [120, 330, 510, 690, 855, 1020];
  const nearest = cuts.reduce((m, c) => Math.min(m, Math.abs(frame - c)), 999);
  const opacity = interpolate(nearest, [0, 1, 4], [0.28, 0.12, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return <AbsoluteFill style={{pointerEvents: "none", zIndex: 100, background: `rgba(255,255,255,${opacity})`}} />;
};

export const PhoneBan2026Video: React.FC = () => (
  <AbsoluteFill style={{background: PAPER}}>
    <Sequence from={0} durationInFrames={120}><Hook /></Sequence>
    <Sequence from={120} durationInFrames={210}><SceneRule /></Sequence>
    <Sequence from={330} durationInFrames={180}><SceneScope /></Sequence>
    <Sequence from={510} durationInFrames={180}><SceneWhy /></Sequence>
    <Sequence from={690} durationInFrames={165}><SceneSanction /></Sequence>
    <Sequence from={855} durationInFrames={165}><SceneContrast /></Sequence>
    <Sequence from={1020} durationInFrames={150}><Final /></Sequence>
    <Grain />
    <CutFlash />
  </AbsoluteFill>
);

export const PhoneBan2026Composition: React.FC = () => (
  <Composition
    id="PhoneBan2026"
    component={PhoneBan2026Video}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
