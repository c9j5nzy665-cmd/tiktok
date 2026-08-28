import type {CSSProperties, ReactNode} from "react";
import {Img, interpolate, staticFile, useCurrentFrame} from "remotion";

const RED = "#f20d2f";
const WHITE = "#f7f7f5";

type SceneKind = "hook" | "rock" | "portrait" | "idea" | "box" | "sales" | "number" | "why" | "lesson" | "outro";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const reveal = (frame: number, start: number, end = start + 12) => interpolate(frame, [start, end], [0, 1], clamp);
const pulse = (frame: number, start: number, peak: number, end: number, max = 1) =>
  interpolate(frame, [start, peak, end], [0, max, 0], clamp);

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

const motionByKind: Partial<
  Record<SceneKind, {scale: [number, number]; x: [number, number]; y: [number, number]; position: string}>
> = {
  hook: {scale: [1.025, 1.105], x: [-5, 9], y: [5, -4], position: "50% 50%"},
  rock: {scale: [1.085, 1.025], x: [8, -7], y: [-5, 5], position: "50% 56%"},
  portrait: {scale: [1.035, 1.075], x: [-7, 5], y: [5, -7], position: "50% 50%"},
  idea: {scale: [1.075, 1.035], x: [10, -8], y: [-4, 5], position: "50% 52%"},
  box: {scale: [1.025, 1.085], x: [-5, 7], y: [5, -6], position: "50% 53%"},
  sales: {scale: [1.055, 1.02], x: [8, -6], y: [-8, 4], position: "50% 57%"},
  number: {scale: [1.12, 1.025], x: [-7, 5], y: [5, -4], position: "50% 48%"},
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
        opacity: 0.045,
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
        transform: `translate(${Math.sin(frame / 48) * 4}px,${Math.cos(frame / 57) * 3}px) scale(${1 + frame / 22000})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const HookOverlay = () => {
  const frame = useCurrentFrame();
  const first = interpolate(frame, [0, 7, 28, 36], [0, 1, 1, 0], clamp);
  const second = interpolate(frame, [28, 36, 72, 82], [0, 1, 1, 0], clamp);
  const final = interpolate(frame, [76, 90, 145, 154], [0, 1, 1, 0], clamp);
  const flash = pulse(frame, 30, 33, 37, 0.38);

  return (
    <>
      <div style={{position: "absolute", inset: 0, background: `rgba(242,13,47,${flash})`, mixBlendMode: "screen"}} />
      <div
        style={{
          position: "absolute",
          top: 250,
          left: 85,
          right: 85,
          textAlign: "center",
          opacity: first,
          fontFamily: "Arial,Helvetica,sans-serif",
          fontSize: 70,
          fontWeight: 950,
          letterSpacing: -2,
          color: WHITE,
          textShadow: "0 10px 30px #000",
        }}
      >
        IL A VENDU
      </div>
      <div
        style={{
          position: "absolute",
          top: 745,
          left: 90,
          right: 90,
          padding: "18px 24px",
          textAlign: "center",
          opacity: second,
          background: "rgba(0,0,0,.86)",
          border: `3px solid ${RED}`,
          fontFamily: "Arial,Helvetica,sans-serif",
          fontSize: 76,
          fontWeight: 950,
          letterSpacing: -3,
          color: WHITE,
          transform: `scale(${interpolate(second, [0, 1], [0.96, 1], clamp)})`,
        }}
      >
        DES CAILLOUX.
      </div>
      <div
        style={{
          position: "absolute",
          top: 845,
          left: 180,
          right: 180,
          padding: "16px 20px",
          textAlign: "center",
          opacity: final,
          background: RED,
          fontFamily: "Arial,Helvetica,sans-serif",
          fontSize: 46,
          fontWeight: 950,
          letterSpacing: 2,
          color: WHITE,
          boxShadow: "0 15px 45px #000b",
        }}
      >
        MILLIONNAIRE.
      </div>
    </>
  );
};

const NumberReveal = () => {
  const frame = useCurrentFrame();
  const values = [
    {at: 0, value: "1"},
    {at: 10, value: "10"},
    {at: 20, value: "100"},
    {at: 30, value: "10 000"},
    {at: 40, value: "100 000"},
    {at: 50, value: "1 500 000"},
  ];
  let value = values[0].value;
  for (const item of values) if (frame >= item.at) value = item.value;
  const curtain = interpolate(frame, [48, 65], [0.93, 0], clamp);
  const big = reveal(frame, 46, 55);
  const flash = pulse(frame, 47, 50, 54, 0.75);

  return (
    <>
      <div style={{position: "absolute", inset: 0, background: `rgba(255,255,255,${flash})`, mixBlendMode: "screen"}} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          background: `rgba(0,0,0,${curtain})`,
          fontFamily: "Arial,Helvetica,sans-serif",
        }}
      >
        <div
          style={{
            fontSize: value === "1 500 000" ? 142 : 176,
            fontWeight: 950,
            lineHeight: 0.9,
            color: value === "1 500 000" ? RED : WHITE,
            letterSpacing: -5,
            textShadow: "0 15px 45px #000",
          }}
        >
          {value}
        </div>
        <div style={{marginTop: 32, fontSize: 24, fontWeight: 900, letterSpacing: 7, color: WHITE, opacity: big}}>
          EXEMPLAIRES VENDUS
        </div>
      </div>
    </>
  );
};

const ImageScene = ({kind}: {kind: SceneKind}) => {
  const frame = useCurrentFrame();
  const file = imageByKind[kind];
  if (!file) return null;
  const duration = durationByKind[kind] ?? 180;
  const motion = motionByKind[kind] ?? {scale: [1.02, 1.06] as [number, number], x: [0, 0] as [number, number], y: [0, 0] as [number, number], position: "50% 50%"};
  const scale = interpolate(frame, [0, duration], motion.scale, clamp);
  const driftX = interpolate(frame, [0, duration], motion.x, clamp);
  const driftY = interpolate(frame, [0, duration], motion.y, clamp);
  const fade = interpolate(frame, [0, 7], [0.94, 1], clamp);
  const soldOut = kind === "sales" ? reveal(frame, 145, 160) : 0;

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
          objectPosition: motion.position,
          opacity: fade,
          transform: `translate(${driftX}px,${driftY}px) scale(${scale})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom,rgba(0,0,0,.08) 0%,transparent 32%,transparent 66%,rgba(0,0,0,.18) 77%,rgba(0,0,0,.76) 100%)",
        }}
      />

      {kind === "hook" && <HookOverlay />}
      {kind === "number" && <NumberReveal />}

      {kind === "portrait" && (
        <div
          style={{
            position: "absolute",
            top: 84,
            left: 70,
            padding: "10px 14px",
            background: "rgba(0,0,0,.72)",
            borderLeft: `5px solid ${RED}`,
            color: "#d7d7d4",
            fontFamily: "Arial,Helvetica,sans-serif",
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: 4,
          }}
        >
          ILLUSTRATION ÉDITORIALE
        </div>
      )}

      {kind === "sales" && (
        <div
          style={{
            position: "absolute",
            top: 185,
            right: 78,
            padding: "16px 22px",
            opacity: soldOut,
            transform: `rotate(-7deg) scale(${interpolate(soldOut, [0, 1], [0.9, 1], clamp)})`,
            border: `5px solid ${RED}`,
            color: RED,
            fontFamily: "Arial,Helvetica,sans-serif",
            fontSize: 42,
            fontWeight: 950,
            letterSpacing: 3,
            background: "rgba(0,0,0,.62)",
          }}
        >
          SOLD OUT
        </div>
      )}
    </div>
  );
};

const EditorialBackdrop = ({file}: {file: string}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 180], [1.08, 1.14], clamp);
  return (
    <div style={{position: "absolute", inset: 0, overflow: "hidden"}}>
      <Img
        src={staticFile(file)}
        style={{
          position: "absolute",
          inset: -25,
          width: "calc(100% + 50px)",
          height: "calc(100% + 50px)",
          objectFit: "cover",
          opacity: 0.23,
          filter: "grayscale(1) contrast(1.2) blur(3px)",
          transform: `scale(${scale})`,
        }}
      />
      <div style={{position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,.62),rgba(0,0,0,.9))"}} />
    </div>
  );
};

const Why = () => {
  const frame = useCurrentFrame();
  const final = frame > 68;
  const line = reveal(frame, 7, 30);
  return (
    <>
      <EditorialBackdrop file="petrock-05-packaging.png" />
      <Stage style={{position: "relative", flexDirection: "column", gap: 15}}>
        {!final && (
          <div style={{width: 720, display: "grid", gridTemplateColumns: "1fr 55px 1fr 55px 1fr", alignItems: "center"}}>
            {["OBJET", "→", "PACKAGING", "→", "HISTOIRE"].map((x, i) => (
              <div
                key={`${x}-${i}`}
                style={{
                  padding: x === "→" ? 0 : "24px 10px",
                  textAlign: "center",
                  border: x === "→" ? "none" : `2px solid ${x === "HISTOIRE" ? RED : "#666"}`,
                  color: x === "HISTOIRE" ? RED : WHITE,
                  fontSize: x === "→" ? 30 : 26,
                  fontWeight: 950,
                  letterSpacing: x === "→" ? 0 : 3,
                  opacity: reveal(frame, i * 7, i * 7 + 10),
                  background: x === "→" ? "transparent" : "rgba(0,0,0,.62)",
                }}
              >
                {x}
              </div>
            ))}
          </div>
        )}
        {final && (
          <>
            <div style={{fontSize: 138, fontWeight: 950, letterSpacing: -5, color: RED, lineHeight: 0.9}}>HISTOIRE</div>
            <div style={{width: 560, height: 4, marginTop: 18, background: `linear-gradient(90deg,${RED} ${line * 100}%,#333 ${line * 100}%)`}} />
            <div style={{marginTop: 28, fontSize: 22, fontWeight: 800, letterSpacing: 5}}>PERCEPTION CREATES VALUE</div>
          </>
        )}
      </Stage>
    </>
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
  const final = frame > 108;
  return (
    <>
      <EditorialBackdrop file="petrock-04-bar.png" />
      <Stage style={{position: "relative", flexDirection: "column"}}>
        {!final && (
          <div style={{display: "flex", alignItems: "center", gap: 45}}>
            <div
              style={{
                width: 350,
                height: 410,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #666",
                background: "rgba(0,0,0,.72)",
                position: "relative",
              }}
            >
              <Rock small />
              <b style={{position: "absolute", bottom: 20, letterSpacing: 2}}>OBJET BANAL.</b>
            </div>
            <div
              style={{
                width: 350,
                height: 410,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `5px solid ${RED}`,
                background: "linear-gradient(145deg,rgba(34,34,34,.94),rgba(5,5,5,.96))",
                position: "relative",
                boxShadow: "0 20px 60px #000",
              }}
            >
              <CompactPremiumCard />
              <b style={{position: "absolute", bottom: -42, color: RED, letterSpacing: 2}}>HISTOIRE + PACKAGING.</b>
            </div>
          </div>
        )}
        {final && (
          <div
            style={{
              padding: "42px 52px",
              background: "rgba(0,0,0,.82)",
              borderLeft: `8px solid ${RED}`,
              fontSize: 56,
              fontWeight: 950,
              lineHeight: 1.05,
              maxWidth: 850,
              boxShadow: "0 20px 60px #000",
            }}
          >
            ON N’ACHÈTE PAS TOUJOURS
            <br />
            LE PRODUIT.
            <br />
            <span style={{color: RED}}>ON ACHÈTE L’HISTOIRE.</span>
          </div>
        )}
      </Stage>
    </>
  );
};

export const SceneVisual = ({kind}: {kind: SceneKind}) => {
  if (imageByKind[kind]) return <ImageScene kind={kind} />;
  if (kind === "why") return <Why />;
  if (kind === "lesson") return <ProductComparison />;
  return null;
};
