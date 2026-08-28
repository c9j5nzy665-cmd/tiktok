import type {CSSProperties, ReactNode} from "react";
import {Img, interpolate, staticFile, useCurrentFrame} from "remotion";

const RED = "#f20d2f";

type SceneKind = "hook" | "rock" | "portrait" | "idea" | "box" | "sales" | "number" | "why" | "lesson" | "outro";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const reveal = (frame: number, start: number, end = start + 12) => interpolate(frame, [start, end], [0, 1], clamp);

const imageByKind: Partial<Record<SceneKind, string>> = {
  hook: "petrock-01-hook.png",
  rock: "petrock-02-concept.png",
  portrait: "petrock-03-gary.png",
  idea: "petrock-04-bar.png",
  box: "petrock-05-packaging.png",
  sales: "petrock-06-sales.png",
  number: "petrock-07-number.png",
};

const durationByKind: Partial<Record<SceneKind, number>> = {
  hook: 157,
  rock: 233,
  portrait: 164,
  idea: 185,
  box: 289,
  sales: 260,
  number: 234,
};

export const FilmGrain = () => {
  const frame = useCurrentFrame();
  const x = (frame * 17) % 43;
  const y = (frame * 29) % 37;
  return (
    <div
      style={{
        position: "absolute",
        inset: -50,
        pointerEvents: "none",
        opacity: 0.055,
        transform: `translate(${x - 21}px,${y - 18}px)`,
        backgroundImage: "repeating-radial-gradient(circle at 20% 30%,#fff 0 1px,transparent 1px 4px)",
        backgroundSize: "7px 7px",
        mixBlendMode: "screen",
      }}
    >
      <div style={{position: "absolute", inset: 0, boxShadow: "inset 0 0 190px #000"}} />
    </div>
  );
};

const Stage = ({children, style}: {children: ReactNode; style?: CSSProperties}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        height: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `translate(${Math.sin(frame / 48) * 5}px,${Math.cos(frame / 57) * 4}px) scale(${1 + frame / 18000})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const ImageScene = ({kind}: {kind: SceneKind}) => {
  const frame = useCurrentFrame();
  const file = imageByKind[kind];
  if (!file) return null;
  const duration = durationByKind[kind] ?? 180;
  const scale = interpolate(frame, [0, duration], [1.015, 1.065], clamp);
  const driftX = Math.sin(frame / 42) * 7;
  const driftY = Math.cos(frame / 55) * 5;
  const fade = interpolate(frame, [0, 12], [0.88, 1], clamp);
  return (
    <div style={{position: "absolute", inset: 0, overflow: "hidden", background: "#000"}}>
      <Img
        src={staticFile(file)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: fade,
          transform: `translate(${driftX}px,${driftY}px) scale(${scale})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, transparent 0%, transparent 66%, rgba(0,0,0,.16) 76%, rgba(0,0,0,.7) 100%)",
        }}
      />
    </div>
  );
};

const Why = () => {
  const frame = useCurrentFrame();
  const final = frame > 70;
  return (
    <Stage style={{flexDirection: "column", gap: 15}}>
      {!final &&
        ["OBJET", "↓", "PACKAGING", "↓"].map((x, i) => (
          <div
            key={`${x}-${i}`}
            style={{
              fontSize: x === "↓" ? 30 : 40,
              fontWeight: 900,
              letterSpacing: 7,
              opacity: 1 - reveal(frame, 48 + i * 4),
            }}
          >
            {x}
          </div>
        ))}
      <div style={{fontSize: final ? 135 : 48, fontWeight: 950, letterSpacing: final ? -4 : 7, color: RED}}>HISTOIRE</div>
      <div style={{fontSize: 22, letterSpacing: 5, opacity: reveal(frame, 75)}}>PERCEPTION CREATES VALUE</div>
    </Stage>
  );
};

const Rock = ({small = false}: {small?: boolean}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width: small ? 155 : 390,
        height: small ? 108 : 270,
        borderRadius: "52% 44% 47% 40%",
        transform: `translateY(${Math.sin(frame / 20) * 5}px) rotate(-5deg)`,
        background: "radial-gradient(circle at 34% 28%,#aaa69f 0,#5b5852 38%,#191919 78%)",
        boxShadow: "0 38px 60px #000b,inset -30px -30px 45px #111,inset 20px 16px 22px #bbb5",
        border: "2px solid #777",
      }}
    />
  );
};

const CompactPremiumCard = () => (
  <div
    style={{
      width: 310,
      height: 315,
      background: "#d9cfb8",
      color: "#151515",
      boxShadow: "12px 16px 35px #0009",
      border: "2px solid #887e69",
      padding: 18,
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: "rotate(-2deg)",
    }}
  >
    <div style={{position: "absolute", top: 14, left: 16, fontSize: 15, fontWeight: 900, letterSpacing: 4}}>PREMIUM</div>
    <div style={{position: "absolute", inset: 10, border: "1px solid #746b58"}} />
    <Rock small />
    <div style={{position: "absolute", right: 14, bottom: 12, color: RED, fontSize: 14, fontWeight: 900}}>ARCHIVE / 1975</div>
  </div>
);

const ProductComparison = () => {
  const frame = useCurrentFrame();
  const final = frame > 112;
  return (
    <Stage style={{flexDirection: "column"}}>
      {!final && (
        <div style={{display: "flex", alignItems: "center", gap: 65}}>
          <div
            style={{
              width: 350,
              height: 410,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #555",
              position: "relative",
            }}
          >
            <Rock small />
            <b style={{position: "absolute", bottom: 20}}>MÊME OBJET.</b>
          </div>
          <div
            style={{
              width: 350,
              height: 410,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `5px solid ${RED}`,
              background: "linear-gradient(145deg,#222,#050505)",
              position: "relative",
            }}
          >
            <CompactPremiumCard />
            <b style={{position: "absolute", bottom: -45, color: RED}}>VALEUR DIFFÉRENTE.</b>
          </div>
        </div>
      )}
      {final && (
        <div style={{fontSize: 56, fontWeight: 950, lineHeight: 1.05, maxWidth: 850}}>
          ON N’ACHÈTE PAS TOUJOURS
          <br />
          LE PRODUIT.
          <br />
          <span style={{color: RED}}>ON ACHÈTE L’HISTOIRE.</span>
        </div>
      )}
    </Stage>
  );
};

export const SceneVisual = ({kind}: {kind: SceneKind}) => {
  if (imageByKind[kind]) return <ImageScene kind={kind} />;
  if (kind === "why") return <Why />;
  if (kind === "lesson") return <ProductComparison />;
  return null;
};
