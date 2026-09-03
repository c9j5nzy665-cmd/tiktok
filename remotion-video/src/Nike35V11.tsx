import React from "react";
import {AbsoluteFill, Composition, Sequence} from "remotion";
import {Nike35Video} from "./Nike35";

const FPS = 30;
const TOTAL = 1290;
const RED = "#F20D2F";
const INK = "#0E0E0E";
const CREAM = "#F3EFE6";
const WHITE = "#FFFDF8";

const Brand = () => <div style={{position:"absolute",left:64,right:64,bottom:72,display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:"Arial,Helvetica,sans-serif",color:INK,zIndex:50}}><div style={{fontSize:27,fontWeight:950,letterSpacing:2.4}}>HORS CADRE</div><div style={{fontSize:18,fontWeight:800,letterSpacing:1,opacity:.66}}>PENSE AUTREMENT.</div></div>;
const Source = () => <div style={{position:"absolute",left:64,top:70,fontFamily:"Arial",fontSize:15,fontWeight:800,letterSpacing:1.3,color:"rgba(14,14,14,.45)",zIndex:60}}>SOURCES · NIKE ARCHIVES · PORTLAND STATE UNIVERSITY</div>;
const Rule = () => <div style={{position:"absolute",left:64,top:112,width:118,height:8,borderRadius:99,background:RED,zIndex:60}}/>;
const Kicker = ({children}:{children:React.ReactNode}) => <div style={{fontFamily:"Arial",fontSize:24,fontWeight:950,letterSpacing:3.2,textTransform:"uppercase",color:RED,marginBottom:20}}>{children}</div>;
const Big = ({children,size=110}:{children:React.ReactNode;size?:number}) => <div style={{fontFamily:"Arial Black,Arial",fontSize:size,fontWeight:950,letterSpacing:-5.2,lineHeight:.89,textTransform:"uppercase",color:INK}}>{children}</div>;
const Small = ({children}:{children:React.ReactNode}) => <div style={{fontFamily:"Arial",fontSize:31,lineHeight:1.22,fontWeight:760,color:"rgba(14,14,14,.7)",marginTop:26,maxWidth:880}}>{children}</div>;

const Swoosh = ({color=INK}:{color?:string}) => <svg viewBox="0 0 500 220" style={{width:500,height:220}}><path fill={color} d="M35 151c56 48 131 50 211 16 74-31 142-82 219-151-61 92-130 161-215 190-91 31-174 19-215-55z"/></svg>;

const BriefPatch = () => <AbsoluteFill style={{pointerEvents:"none"}}>
  <div style={{position:"absolute",left:0,right:0,top:0,height:54,background:WHITE,zIndex:80}}/>
  <div style={{position:"absolute",left:64,top:1110,width:720,zIndex:81}}><Small>Le logo devait fonctionner sur le côté d’une chaussure et ne pas ressembler aux trois bandes d’Adidas.</Small></div>
</AbsoluteFill>;

const FinalPatch = () => <AbsoluteFill style={{background:CREAM}}>
  <Source/><Rule/>
  <div style={{position:"absolute",left:64,top:220,width:930}}>
    <Kicker>Le vrai twist</Kicker>
    <Big size={106}>UN CROQUIS<br/>D’ÉTUDIANTE.<br/><span style={{color:RED}}>DEVENU UNE ICÔNE.</span></Big>
    <Small>L’un des symboles commerciaux les plus reconnaissables au monde.</Small>
  </div>
  <div style={{position:"absolute",right:-10,bottom:250,rotate:"-8deg",scale:1.18}}><Swoosh/></div>
  <div style={{position:"absolute",left:64,right:64,bottom:250,borderTop:`4px solid ${INK}`,paddingTop:24,fontFamily:"Arial",fontSize:24,fontWeight:900,letterSpacing:1.5}}>35 $ · 1971 → UNE IDENTITÉ MONDIALE</div>
  <Brand/>
</AbsoluteFill>;

export const Nike35V11Video:React.FC=()=> <AbsoluteFill>
  <Nike35Video/>
  <Sequence from={285} durationInFrames={150}><BriefPatch/></Sequence>
  <Sequence from={1210} durationInFrames={80}><FinalPatch/></Sequence>
</AbsoluteFill>;

export const Nike35V11Composition:React.FC=()=> <Composition id="Nike35V11" component={Nike35V11Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920}/>;