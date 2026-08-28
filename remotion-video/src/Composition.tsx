import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const GOLD = "#d8ad62";
const CREAM = "#f4efe5";

const fadeAtEdges = (frame: number, duration: number) =>
  interpolate(frame, [0, 14, duration - 16, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

const FilmBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 240], [-70, 90]);
  const pulse = interpolate(Math.sin(frame / 25), [-1, 1], [0.1, 0.18]);

  return (
    <AbsoluteFill style={{backgroundColor: "#050505", overflow: "hidden"}}>
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          top: -250 + drift,
          left: -330,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(216,173,98,${pulse}) 0%, rgba(216,173,98,0) 68%)`,
          filter: "blur(25px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 760,
          height: 760,
          right: -390,
          bottom: -210 - drift,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(138,98,37,0.14) 0%, rgba(138,98,37,0) 70%)",
          filter: "blur(18px)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 15%, rgba(0,0,0,0.68) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 64,
          border: "1px solid rgba(216,173,98,0.16)",
        }}
      />
    </AbsoluteFill>
  );
};

const Eyebrow: React.FC<{children: ReactNode}> = ({children}) => (
  <div
    style={{
      color: GOLD,
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: 25,
      fontWeight: 600,
      letterSpacing: 9,
      textTransform: "uppercase",
      marginBottom: 38,
    }}
  >
    {children}
  </div>
);

const Scene: React.FC<{
  children: ReactNode;
  duration: number;
  style?: CSSProperties;
}> = ({children, duration, style}) => {
  const frame = useCurrentFrame();
  const opacity = fadeAtEdges(frame, duration);
  const lift = interpolate(frame, [0, 22], [25, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "190px 112px 300px",
        textAlign: "center",
        color: CREAM,
        opacity,
        transform: `translateY(${lift}px)`,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const OpeningTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = spring({frame, fps, config: {damping: 18, stiffness: 75}});
  const scale = interpolate(entrance, [0, 1], [0.94, 1]);
  const ruleWidth = interpolate(entrance, [0, 1], [0, 300]);

  return (
    <Scene duration={60}>
      <Eyebrow>Mini-documentaire</Eyebrow>
      <div
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 112,
          fontWeight: 600,
          letterSpacing: 5,
          lineHeight: 1.05,
          transform: `scale(${scale})`,
          textShadow: "0 12px 40px rgba(0,0,0,0.8)",
        }}
      >
        ARGENT
        <br />
        <span style={{color: GOLD, fontStyle: "italic"}}>CACHÉ</span>
      </div>
      <div
        style={{
          width: ruleWidth,
          height: 2,
          backgroundColor: GOLD,
          marginTop: 54,
        }}
      />
    </Scene>
  );
};

const Statement: React.FC<{children: ReactNode; delay: number}> = ({
  children,
  delay,
}) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        opacity: reveal,
        transform: `translateY(${interpolate(reveal, [0, 1], [34, 0])}px)`,
      }}
    >
      {children}
    </div>
  );
};

const MiddleScene: React.FC = () => (
  <Scene duration={90}>
    <Eyebrow>La réalité dépasse la fiction</Eyebrow>
    <div
      style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: 78,
        lineHeight: 1.2,
        fontWeight: 500,
      }}
    >
      <Statement delay={5}>Des idées absurdes.</Statement>
      <Statement delay={32}>
        <span style={{color: GOLD, fontStyle: "italic"}}>
          Des fortunes bien réelles.
        </span>
      </Statement>
    </div>
  </Scene>
);

const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const handleOpacity = interpolate(frame, [28, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Scene duration={90}>
      <div
        style={{
          width: 72,
          height: 3,
          backgroundColor: GOLD,
          marginBottom: 46,
        }}
      />
      <div
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 72,
          lineHeight: 1.22,
          fontWeight: 500,
          maxWidth: 820,
        }}
      >
        Tu ne verras plus
        <br />
        <span style={{color: GOLD, fontStyle: "italic"}}>l&apos;argent</span> de la
        même façon.
      </div>
      <div
        style={{
          marginTop: 58,
          color: "rgba(244,239,229,0.72)",
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 31,
          fontWeight: 600,
          letterSpacing: 4,
          opacity: handleOpacity,
        }}
      >
        @argentcache
      </div>
    </Scene>
  );
};

export const ArgentCacheVideo: React.FC = () => (
  <AbsoluteFill>
    <FilmBackground />
    <Sequence durationInFrames={60}>
      <OpeningTitle />
    </Sequence>
    <Sequence from={60} durationInFrames={90}>
      <MiddleScene />
    </Sequence>
    <Sequence from={150} durationInFrames={90}>
      <ClosingScene />
    </Sequence>
  </AbsoluteFill>
);

export const ArgentCacheComposition: React.FC = () => (
  <Composition
    id="ArgentCacheTest"
    component={ArgentCacheVideo}
    durationInFrames={240}
    fps={30}
    width={1080}
    height={1920}
  />
);
