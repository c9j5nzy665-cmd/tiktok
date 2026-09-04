import React from "react";
import {AbsoluteFill, Composition, Img, Sequence, interpolate, spring, useCurrentFrame} from "remotion";
import {Nike35V2Video} from "./Nike35V2";

const FPS = 30;
const TOTAL = 1301;
const RED = "#F20D2F";
const INK = "#0E0E0E";
const CREAM = "#F3EFE6";
const WHITE = "#FFFDF8";
const NIKE_OFFICIAL_LOGO = "https://nmp.about.nike.com/about/prod/2cb271ab-6c2a-48b0-8ea8-a0b2f5db551e/nike-logo-wordmark-carolyn-davidson-dna-1.jpg?m=eyJlZGl0cyI6eyJqcGVnIjp7InF1YWxpdHkiOjEwMH0sIndlYnAiOnsicXVhbGl0eSI6MTAwfSwiZXh0cmFjdCI6eyJsZWZ0IjowLCJ0b3AiOjAsIndpZHRoIjozMDAwLCJoZWlnaHQiOjIwMDB9LCJyZXNpemUiOnsid2lkdGgiOjM4NDB9fX0%3D&s=7d75a78fd5cf98c9d9c60a5eac347cda7f34026b448683db33f8e7298cf1dfbd";

const Hook = () => {
  const f = useCurrentFrame();
  const logoIn = spring({frame:f,fps:FPS,config:{damping:16,stiffness:170}});
  const moneyIn = spring({frame:Math.max(0,f-18),fps:FPS,config:{damping:14,stiffness:190}});
  const flash = interpolate(f,[0,2,6],[1,.15,0],{extrapolateRight:"clamp"});
  const imageScale = interpolate(f,[0,90],[1.02,1.08],{extrapolateRight:"clamp"});
  return <AbsoluteFill style={{background:CREAM,overflow:"hidden"}}>
    <AbsoluteFill style={{background:`rgba(255,255,255,${flash})`,zIndex:20,pointerEvents:"none"}}/>
    <div style={{position:"absolute",left:0,right:0,top:0,height:1030,background:WHITE,overflow:"hidden"}}>
      <Img src={NIKE_OFFICIAL_LOGO} style={{width:"100%",height:"100%",objectFit:"contain",transform:`scale(${imageScale})`,opacity:.98}}/>
      <div style={{position:"absolute",left:0,right:0,bottom:0,height:210,background:"linear-gradient(180deg,rgba(255,255,255,0),#fffdf8 82%)"}}/>
    </div>

    <div style={{position:"absolute",left:56,top:55,zIndex:30,fontFamily:"Arial,Helvetica,sans-serif",fontSize:22,fontWeight:900,letterSpacing:2.4,color:"rgba(14,14,14,.55)"}}>HORS CADRE · HISTOIRE DE MARQUE</div>
    <div style={{position:"absolute",left:56,top:102,width:118,height:9,borderRadius:99,background:RED,zIndex:30}}/>

    <div style={{position:"absolute",left:56,right:56,top:875,zIndex:30,transform:`translateY(${(1-logoIn)*36}px)`,opacity:logoIn}}>
      <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:34,fontWeight:950,letterSpacing:3.2,color:RED,textTransform:"uppercase"}}>Ce logo</div>
      <div style={{fontFamily:"Arial Black,Arial,Helvetica,sans-serif",fontSize:205,lineHeight:.86,fontWeight:950,letterSpacing:-9,color:INK,marginTop:12,transform:`scale(${.86+moneyIn*.14})`,transformOrigin:"left center"}}>35 $.</div>
      <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:54,lineHeight:1.02,fontWeight:900,letterSpacing:-1.5,color:INK,marginTop:20,maxWidth:920}}>C’est tout ce que Nike a payé pour le Swoosh.</div>
    </div>

    <div style={{position:"absolute",left:56,bottom:180,display:"flex",gap:14,zIndex:30,fontFamily:"Arial,Helvetica,sans-serif",fontWeight:900,fontSize:24}}>
      <div style={{padding:"12px 20px",borderRadius:999,background:RED,color:WHITE}}>1971</div>
      <div style={{padding:"12px 20px",borderRadius:999,background:"#E8E3DA",color:INK}}>PORTLAND</div>
      <div style={{padding:"12px 20px",borderRadius:999,background:"#E8E3DA",color:INK}}>CAROLYN DAVIDSON</div>
    </div>

    <div style={{position:"absolute",left:56,right:56,bottom:72,display:"flex",justifyContent:"space-between",fontFamily:"Arial,Helvetica,sans-serif",color:INK,zIndex:30}}>
      <div style={{fontSize:27,fontWeight:950,letterSpacing:2.4}}>HORS CADRE</div>
      <div style={{fontSize:18,fontWeight:800,letterSpacing:1,opacity:.58}}>PENSE AUTREMENT.</div>
    </div>
  </AbsoluteFill>;
};

export const Nike35V22Video: React.FC = () => (
  <AbsoluteFill>
    <Nike35V2Video />
    <Sequence from={0} durationInFrames={90}><Hook /></Sequence>
  </AbsoluteFill>
);

export const Nike35V22Composition: React.FC = () => (
  <Composition id="Nike35V22" component={Nike35V22Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
