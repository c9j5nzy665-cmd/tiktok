import React from "react";
import {AbsoluteFill, Composition, Img, Sequence, interpolate, spring, useCurrentFrame} from "remotion";
import {Nike35V2Video} from "./Nike35V2";

const FPS = 30;
const TOTAL = 1301;
const RED = "#F20D2F";
const INK = "#0E0E0E";
const WHITE = "#FFFDF8";

const NIKE_SHOE_ARCHIVE = "https://nmp.about.nike.com/about/prod/4f85fe0c-cc0e-4a4a-b6a1-6340b1dcb47a/nike-football-boot-original-black-dna-3.jpg?m=eyJlZGl0cyI6eyJqcGVnIjp7InF1YWxpdHkiOjEwMH0sIndlYnAiOnsicXVhbGl0eSI6MTAwfSwiZXh0cmFjdCI6eyJsZWZ0IjowLCJ0b3AiOjI1MCwid2lkdGgiOjMwMDAsImhlaWdodCI6MTY4OH0sInJlc2l6ZSI6eyJ3aWR0aCI6Mzg0MH19fQ%3D%3D&s=32dde8d7157f26174f7eec423a77658e6c6b8c1faaa0f04ce02a1f30cb378ca9";

const Hook = () => {
  const f = useCurrentFrame();
  const reveal = spring({frame: Math.max(0, f - 10), fps: FPS, config: {damping: 16, stiffness: 175}});
  const money = spring({frame: Math.max(0, f - 22), fps: FPS, config: {damping: 13, stiffness: 190}});
  const sub = spring({frame: Math.max(0, f - 42), fps: FPS, config: {damping: 17, stiffness: 150}});
  const scale = interpolate(f, [0, 89], [1.18, 1.04], {extrapolateRight: "clamp"});
  const y = interpolate(f, [0, 89], [-28, 0], {extrapolateRight: "clamp"});
  const flash = interpolate(f, [0, 2, 6], [.78, .1, 0], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{background: INK, overflow: "hidden"}}>
      <Img
        src={NIKE_SHOE_ARCHIVE}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "48% center",
          transform: `translateY(${y}px) scale(${scale})`,
          filter: "contrast(1.03) saturate(.86)",
        }}
      />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(0,0,0,.08) 0%,rgba(0,0,0,.04) 38%,rgba(0,0,0,.45) 62%,rgba(0,0,0,.92) 100%)"}}/>
      <AbsoluteFill style={{background:`rgba(255,255,255,${flash})`,pointerEvents:"none"}}/>

      <div style={{position:"absolute",left:56,top:62,fontFamily:"Arial,Helvetica,sans-serif",fontSize:21,fontWeight:900,letterSpacing:2.2,color:"rgba(255,255,255,.78)"}}>
        HORS CADRE · HISTOIRE DE MARQUE
      </div>
      <div style={{position:"absolute",left:56,top:108,width:120,height:8,borderRadius:99,background:RED}}/>

      <div style={{position:"absolute",left:56,right:56,bottom:285,opacity:reveal,transform:`translateY(${(1-reveal)*36}px)`}}>
        <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:34,fontWeight:950,letterSpacing:3.4,color:WHITE,textTransform:"uppercase",marginBottom:8}}>
          Ce logo
        </div>
        <div style={{fontFamily:"Arial Black,Arial,Helvetica,sans-serif",fontSize:210,fontWeight:950,lineHeight:.82,letterSpacing:-10,color:RED,transform:`scale(${.86+money*.14})`,transformOrigin:"left center"}}>
          35 $.
        </div>
        <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:49,lineHeight:1.05,fontWeight:900,letterSpacing:-1.2,color:WHITE,maxWidth:900,marginTop:22,opacity:sub,transform:`translateY(${(1-sub)*24}px)`}}>
          C’est tout ce que Nike a payé pour le Swoosh.
        </div>
      </div>

      <div style={{position:"absolute",left:56,bottom:175,display:"flex",gap:13,fontFamily:"Arial,Helvetica,sans-serif",fontSize:23,fontWeight:900}}>
        <div style={{padding:"11px 18px",borderRadius:999,background:RED,color:WHITE}}>1971</div>
        <div style={{padding:"11px 18px",borderRadius:999,background:"rgba(255,255,255,.14)",border:"1px solid rgba(255,255,255,.2)",color:WHITE}}>NIKE</div>
        <div style={{padding:"11px 18px",borderRadius:999,background:"rgba(255,255,255,.14)",border:"1px solid rgba(255,255,255,.2)",color:WHITE}}>PORTLAND</div>
      </div>

      <div style={{position:"absolute",left:56,right:56,bottom:70,display:"flex",justifyContent:"space-between",fontFamily:"Arial,Helvetica,sans-serif",color:WHITE}}>
        <div style={{fontSize:27,fontWeight:950,letterSpacing:2.4}}>HORS CADRE</div>
        <div style={{fontSize:18,fontWeight:800,letterSpacing:1,opacity:.62}}>PENSE AUTREMENT.</div>
      </div>
    </AbsoluteFill>
  );
};

export const Nike35V23Video: React.FC = () => (
  <AbsoluteFill>
    <Nike35V2Video />
    <Sequence from={0} durationInFrames={90}><Hook /></Sequence>
  </AbsoluteFill>
);

export const Nike35V23Composition: React.FC = () => (
  <Composition id="Nike35V23" component={Nike35V23Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
