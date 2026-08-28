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
import {FilmGrain, SceneVisual} from "./V3Visuals";

export const RED = "#f20d2f";
export const WHITE = "#f7f7f5";
export const TOTAL_FRAMES = 1875;

export const scenes = [
  {from: 0, duration: 157, kicker: "UNE IDÉE À UN MILLION", title: "IL A VENDU\nDES CAILLOUX.", kind: "hook"},
  {from: 157, duration: 233, kicker: "LE CONCEPT", title: "UN ANIMAL\nQUI NE DEMANDE RIEN", kind: "rock"},
  {from: 390, duration: 164, kicker: "CALIFORNIE · 1975", title: "GARY DAHL", kind: "portrait"},
  {from: 554, duration: 185, kicker: "UNE BLAGUE DE BAR", title: "ET SI LE PET PARFAIT…\nÉTAIT UNE PIERRE ?", kind: "idea"},
  {from: 739, duration: 289, kicker: "LE VRAI COUP DE GÉNIE", title: "LE PACKAGING", kind: "box"},
  {from: 1028, duration: 260, kicker: "NOËL 1975", title: "LA FOLIE\nPET ROCK", kind: "sales"},
  {from: 1288, duration: 234, kicker: "EN QUELQUES MOIS", title: "1,5 MILLION", kind: "number"},
  {from: 1522, duration: 124, kicker: "POURQUOI ÇA MARCHE", title: "UNE HISTOIRE\nPLUS FORTE QUE L’OBJET", kind: "why"},
  {from: 1646, duration: 177, kicker: "LA LEÇON BUSINESS", title: "ON N’ACHÈTE PAS\nUN CAILLOU.", kind: "lesson"},
  {from: 1823, duration: 52, kicker: "", title: "", kind: "outro"},
] as const;

const captions = [
  {from: 0, to: 157, text: "Cet homme est devenu millionnaire en vendant des cailloux.", hot: "millionnaire"},
  {from: 157, to: 289, text: "Oui, un simple caillou présenté comme un animal de compagnie.", hot: "caillou"},
  {from: 289, to: 390, text: "Et le plus fou, c’est que les gens se l’arrachaient.", hot: "se l’arrachaient"},
  {from: 390, to: 554, text: "Son nom : Gary Dahl, publicitaire californien.", hot: "Gary Dahl"},
  {from: 554, to: 739, text: "L’idée naît comme une blague, autour d’un verre entre amis.", hot: "une blague"},
  {from: 739, to: 872, text: "Mais Dahl ne vend pas seulement une pierre.", hot: "pas seulement"},
  {from: 872, to: 1028, text: "Il lui invente un packaging impossible à oublier.", hot: "packaging"},
  {from: 1028, to: 1179, text: "Une boîte trouée, de la paille et un mode d’emploi hilarant.", hot: "mode d’emploi"},
  {from: 1179, to: 1288, text: "À Noël 1975, le Pet Rock devient un phénomène.", hot: "phénomène"},
  {from: 1288, to: 1407, text: "Près d’un million et demi d’exemplaires sont vendus.", hot: "million et demi"},
  {from: 1407, to: 1522, text: "Le tout en seulement quelques mois.", hot: "quelques mois"},
  {from: 1522, to: 1646, text: "Le produit était banal. L’histoire, elle, était irrésistible.", hot: "irrésistible"},
  {from: 1646, to: 1734, text: "La valeur ne vit pas toujours dans l’objet.", hot: "valeur"},
  {from: 1734, to: 1823, text: "Elle vit parfois dans la façon de le raconter.", hot: "raconter"},
] as const;

const IMAGE_KINDS = new Set(["hook", "rock", "portrait", "idea", "box", "sales", "number"]);

const Background = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: "#030303", overflow: "hidden"}}>
      <div
        style={{
          position: "absolute",
          inset: -180,
          opacity: 0.28,
          transform: `translate(${Math.sin(frame / 65) * 28}px,${Math.cos(frame / 83) * 20}px) scale(${1 + frame / 180000})`,
          background:
            "radial-gradient(circle at 18% 20%,#43080f 0,transparent 30%),radial-gradient(circle at 85% 75%,#26070b 0,transparent 28%)",
        }}
      />
      <div style={{position: "absolute", inset: 52, border: "2px solid rgba(255,255,255,.13)"}} />
      <div style={{position: "absolute", top: 52, right: 52, width: 7, height: 190, background: RED}} />
    </AbsoluteFill>
  );
};

const Scene = ({scene}: {scene: (typeof scenes)[number]}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10, scene.duration - 10, scene.duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (scene.kind === "outro") {
    const frameScale = interpolate(frame, [0, 22], [0, 1], {extrapolateRight: "clamp"});
    const redScale = interpolate(frame, [8, 30], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const logoOpacity = interpolate(frame, [18, 45], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return (
      <AbsoluteFill style={{opacity, alignItems: "center", justifyContent: "center", background: "#000"}}>
        <div
          style={{
            position: "absolute",
            width: 850,
            height: 850,
            border: "2px solid #fff",
            transform: `scaleX(${frameScale})`,
          }}
        />
        <div style={{position: "absolute", width: 6, height: 650, background: RED, transform: `scaleY(${redScale})`}} />
        <Img
          src={staticFile("logo-hors-cadre.png")}
          style={{width: 820, height: 820, objectFit: "contain", opacity: logoOpacity}}
        />
      </AbsoluteFill>
    );
  }

  const imageDriven = IMAGE_KINDS.has(scene.kind);

  return (
    <AbsoluteFill
      style={{
        opacity,
        padding: imageDriven ? 0 : "145px 90px 315px",
        color: WHITE,
        fontFamily: "Arial,Helvetica,sans-serif",
      }}
    >
      {!imageDriven && (
        <>
          <div style={{fontSize: 23, fontWeight: 900, letterSpacing: 7, color: RED, marginBottom: 22}}>{scene.kicker}</div>
          <div style={{fontSize: 70, fontWeight: 950, lineHeight: 0.98, letterSpacing: -2, whiteSpace: "pre-line", maxWidth: 900}}>
            {scene.title}
          </div>
        </>
      )}
      <SceneVisual kind={scene.kind} />
      {!imageDriven && (
        <div style={{position: "absolute", bottom: 330, left: 90, fontSize: 19, letterSpacing: 5, color: "#777"}}>
          HORS CADRE  /  PET ROCK
        </div>
      )}
    </AbsoluteFill>
  );
};

const Subtitle = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cap = captions.find((c) => frame >= c.from && frame < c.to);
  if (!cap) return null;
  const parts = cap.text.split(cap.hot);
  const local = frame - cap.from;
  const enter = spring({frame: local, fps, config: {damping: 20, stiffness: 120}});
  return (
    <div
      style={{
        position: "absolute",
        left: 88,
        right: 88,
        bottom: 255,
        display: "flex",
        justifyContent: "center",
        opacity: enter,
        transform: `translateY(${(1 - enter) * 10}px)`,
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,.76)",
          borderBottom: `3px solid ${RED}`,
          padding: "15px 23px",
          fontFamily: "Arial,Helvetica,sans-serif",
          fontSize: 39,
          fontWeight: 780,
          lineHeight: 1.2,
          textAlign: "center",
          boxShadow: "0 8px 24px #0008",
          maxWidth: 880,
        }}
      >
        {parts[0]}
        <span style={{color: RED}}>{cap.hot}</span>
        {parts[1]}
      </div>
    </div>
  );
};

export const PetRockVideo = () => (
  <AbsoluteFill style={{background: "#000", color: WHITE}}>
    <Background />
    <Audio src={staticFile("voiceover-pet-rock.mp3")} volume={1} />
    <Audio src={staticFile("ambient-documentary.mp3")} volume={0.3} />
    {scenes.map((scene) => (
      <Sequence key={scene.from} from={scene.from} durationInFrames={scene.duration}>
        <Scene scene={scene} />
      </Sequence>
    ))}
    <FilmGrain />
    <Subtitle />
  </AbsoluteFill>
);

export const PetRockComposition = () => (
  <Composition id="PetRockV1" component={PetRockVideo} durationInFrames={TOTAL_FRAMES} fps={30} width={1080} height={1920} />
);
