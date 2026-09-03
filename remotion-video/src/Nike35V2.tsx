import React from "react";
import {
  AbsoluteFill,
  Composition,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
} from "remotion";

const FPS = 30;
const TOTAL = 1301; // 43.366s - exact ElevenLabs voice duration
const RED = "#F20D2F";
const INK = "#0E0E0E";
const CREAM = "#F3EFE6";
const WHITE = "#FFFDF8";
const GRAY = "#A59F97";

const A1 = "https://nmp.about.nike.com/about/prod/11de709e-e63c-4b55-ad5a-eb3f8b349ed5/nike-swoosh-carolyn-davidson-dna-3.jpg?m=eyJlZGl0cyI6eyJqcGVnIjp7InF1YWxpdHkiOjEwMH0sIndlYnAiOnsicXVhbGl0eSI6MTAwfSwiZXh0cmFjdCI6eyJsZWZ0IjowLCJ0b3AiOjgwMiwid2lkdGgiOjIwMDAsImhlaWdodCI6MTg3MH0sInJlc2l6ZSI6eyJ3aWR0aCI6Mzg0MH19fQ%3D%3D&s=ce2ae2ce7c566ed754e45fe0acfb316c360a81acf9cca8e52009996f7ecfbad9";
const A2 = "https://nmp.about.nike.com/about/prod/2cb271ab-6c2a-48b0-8ea8-a0b2f5db551e/nike-logo-wordmark-carolyn-davidson-dna-1.jpg?m=eyJlZGl0cyI6eyJqcGVnIjp7InF1YWxpdHkiOjEwMH0sIndlYnAiOnsicXVhbGl0eSI6MTAwfSwiZXh0cmFjdCI6eyJsZWZ0IjowLCJ0b3AiOjAsIndpZHRoIjozMDAwLCJoZWlnaHQiOjIwMDB9LCJyZXNpemUiOnsid2lkdGgiOjM4NDB9fX0%3D&s=7d75a78fd5cf98c9d9c60a5eac347cda7f34026b448683db33f8e7298cf1dfbd";
const A3 = "https://nmp.about.nike.com/about/prod/4f85fe0c-cc0e-4a4a-b6a1-6340b1dcb47a/nike-football-boot-original-black-dna-3.jpg?m=eyJlZGl0cyI6eyJqcGVnIjp7InF1YWxpdHkiOjEwMH0sIndlYnAiOnsicXVhbGl0eSI6MTAwfSwiZXh0cmFjdCI6eyJsZWZ0IjowLCJ0b3AiOjI1MCwid2lkdGgiOjMwMDAsImhlaWdodCI6MTY4OH0sInJlc2l6ZSI6eyJ3aWR0aCI6Mzg0MH19fQ%3D%3D&s=32dde8d7157f26174f7eec423a77658e6c6b8c1faaa0f04ce02a1f30cb378ca9";
const A4 = "https://nmp.about.nike.com/about/prod/19c7861f-b28d-45f3-b07c-3b473b08868a/nike-blueprint-dna-5.jpg?m=eyJlZGl0cyI6eyJqcGVnIjp7InF1YWxpdHkiOjEwMH0sIndlYnAiOnsicXVhbGl0eSI6MTAwfSwiZXh0cmFjdCI6eyJsZWZ0IjowLCJ0b3AiOjEwNCwid2lkdGgiOjIxMzMsImhlaWdodCI6MjU5MH0sInJlc2l6ZSI6eyJ3aWR0aCI6Mzg0MH19fQ%3D%3D&s=18a28e0d15df93dfd4b935a62e442deb2bd3fab57f935b520485fc203acdab68";
const TL = "https://nmp.about.nike.com/about/prod/0cc8c295-a643-44f4-acb3-c18bfc2289f1/nike-swoosh-logo-timeline.jpg?m=eyJlZGl0cyI6eyJqcGVnIjp7InF1YWxpdHkiOjEwMH0sIndlYnAiOnsicXVhbGl0eSI6MTAwfSwicmVzaXplIjp7IndpZHRoIjozODQwfX19&s=cf8fdb210e3ba5e388cdfd16eb16711c9303b0a5fd4921afd9d10e3f0600aa84";

const Swoosh = ({color=INK, opacity=1, width=470}:{color?:string;opacity?:number;width?:number}) => (
  <svg viewBox="0 0 500 220" style={{width,height:width*0.44,opacity}}>
    <path fill={color} d="M35 151c56 48 131 50 211 16 74-31 142-82 219-151-61 92-130 161-215 190-91 31-174 19-215-55z"/>
  </svg>
);

const Source = ({dark=false}:{dark?:boolean}) => <div style={{position:"absolute",left:64,top:68,zIndex:80,fontFamily:"Arial,Helvetica,sans-serif",fontSize:14,fontWeight:900,letterSpacing:1.5,color:dark?"rgba(255,255,255,.55)":"rgba(14,14,14,.46)"}}>SOURCES · NIKE ARCHIVES · PORTLAND STATE UNIVERSITY</div>;
const Rule = () => <div style={{position:"absolute",left:64,top:108,width:118,height:8,borderRadius:99,background:RED,zIndex:80}}/>;
const Brand = ({dark=false}:{dark?:boolean}) => <div style={{position:"absolute",left:64,right:64,bottom:68,zIndex:80,display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:"Arial,Helvetica,sans-serif",color:dark?WHITE:INK}}><div style={{fontSize:27,fontWeight:950,letterSpacing:2.4}}>HORS CADRE</div><div style={{fontSize:18,fontWeight:850,letterSpacing:1,opacity:.66}}>PENSE AUTREMENT.</div></div>;
const Kicker = ({children,dark=false}:{children:React.ReactNode;dark?:boolean}) => <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:24,fontWeight:950,letterSpacing:3.1,textTransform:"uppercase",color:dark?WHITE:RED,marginBottom:18}}>{children}</div>;
const Big = ({children,dark=false,size=112}:{children:React.ReactNode;dark?:boolean;size?:number}) => <div style={{fontFamily:"Arial Black,Arial,Helvetica,sans-serif",fontSize:size,fontWeight:950,letterSpacing:-5,lineHeight:.9,textTransform:"uppercase",color:dark?WHITE:INK}}>{children}</div>;
const Small = ({children,dark=false,size=30}:{children:React.ReactNode;dark?:boolean;size?:number}) => <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:size,lineHeight:1.23,fontWeight:760,color:dark?"rgba(255,255,255,.82)":"rgba(14,14,14,.72)",marginTop:22}}>{children}</div>;

const Photo = ({src,shade=.48,pos="center",zoom=1.08}:{src:string;shade?:number;pos?:string;zoom?:number}) => {
  const f=useCurrentFrame();
  return <AbsoluteFill style={{overflow:"hidden",background:INK}}>
    <Img src={src} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:pos,transform:`scale(${interpolate(f,[0,220],[zoom,zoom+.08],{extrapolateRight:"clamp"})})`}}/>
    <AbsoluteFill style={{background:`linear-gradient(180deg,rgba(0,0,0,${shade*.42}),rgba(0,0,0,${shade}) 56%,rgba(0,0,0,${Math.min(.86,shade+.22)}))`}}/>
  </AbsoluteFill>;
};

const Tag = ({text,red=false,dark=false}:{text:string;red?:boolean;dark?:boolean}) => <div style={{padding:"13px 18px",borderRadius:999,background:red?RED:(dark?"rgba(255,255,255,.10)":"rgba(14,14,14,.08)"),border:red?"none":`1px solid ${dark?"rgba(255,255,255,.18)":"rgba(14,14,14,.12)"}`,fontFamily:"Arial",fontSize:17,fontWeight:900,letterSpacing:1.3,color:red?WHITE:(dark?WHITE:INK),whiteSpace:"nowrap"}}>{text}</div>;

const Grain = () => {const f=useCurrentFrame();return <AbsoluteFill style={{pointerEvents:"none",zIndex:95,opacity:.065,mixBlendMode:"multiply",backgroundImage:"radial-gradient(circle,rgba(0,0,0,.28) 0 1px,transparent 1.2px)",backgroundSize:"11px 11px",backgroundPosition:`${(f*7)%23}px ${(f*5)%19}px`}}/>};
const Flash = () => {const f=useCurrentFrame();const cuts=[72,254,426,554,695,813,945,1245];const d=cuts.reduce((m,c)=>Math.min(m,Math.abs(f-c)),999);const a=interpolate(d,[0,1,4],[.26,.1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});return <AbsoluteFill style={{pointerEvents:"none",zIndex:110,background:`rgba(255,255,255,${a})`}}/>};

// 0–2.4s
const Hook = () => {
  const f=useCurrentFrame();
  const pop=spring({frame:f,fps:FPS,config:{damping:13,stiffness:185}});
  return <AbsoluteFill style={{background:CREAM}}>
    <Source/><Rule/>
    <div style={{position:"absolute",left:64,top:190,width:710,zIndex:20,transform:`scale(${.84+pop*.16})`,transformOrigin:"left top"}}>
      <Kicker>Le logo que tout le monde connaît</Kicker>
      <Big size={190}>35 $.</Big>
      <Small size={32}>C’est tout ce que Nike a payé pour le Swoosh en 1971.</Small>
    </div>
    <div style={{position:"absolute",right:-120,top:500,transform:"rotate(-11deg) scale(1.55)",opacity:.11}}><Swoosh width={520}/></div>
    <div style={{position:"absolute",right:58,bottom:305,transform:"rotate(-7deg)"}}><Swoosh width={500}/></div>
    <div style={{position:"absolute",left:64,bottom:270,display:"flex",gap:10}}><Tag text="1971" red/><Tag text="PORTLAND"/><Tag text="LOGO DESIGN"/></div>
    <Brand/>
  </AbsoluteFill>;
};

// 2.4–8.46s
const Carolyn = () => {
  const f=useCurrentFrame();
  const inX=interpolate(f,[0,24],[70,0],{extrapolateRight:"clamp"});
  return <AbsoluteFill>
    <Photo src={A1} shade={.58} pos="center" zoom={1.13}/><Source dark/><Rule/>
    <div style={{position:"absolute",left:64,top:205,width:910,zIndex:25,transform:`translateX(${inX}px)`}}>
      <Kicker dark>Carolyn Davidson</Kicker>
      <Big dark size={105}>ÉTUDIANTE.<br/>GRAPHISTE.<br/><span style={{color:RED}}>2 $ / HEURE.</span></Big>
      <Small dark>Phil Knight lui confie de petits travaux graphiques pendant ses études à Portland State.</Small>
    </div>
    <div style={{position:"absolute",left:64,right:64,bottom:235,display:"grid",gridTemplateColumns:"1.15fr .85fr",gap:14,zIndex:30}}>
      <div style={{padding:24,borderRadius:22,background:"rgba(0,0,0,.54)",backdropFilter:"blur(7px)",border:"1px solid rgba(255,255,255,.14)",color:WHITE,fontFamily:"Arial"}}><div style={{fontSize:15,fontWeight:900,letterSpacing:2,opacity:.6}}>PROFIL</div><div style={{fontSize:27,fontWeight:950,marginTop:10}}>CAROLYN DAVIDSON</div></div>
      <div style={{padding:24,borderRadius:22,background:RED,color:WHITE,fontFamily:"Arial"}}><div style={{fontSize:15,fontWeight:900,letterSpacing:2,opacity:.7}}>TARIF</div><div style={{fontFamily:"Arial Black",fontSize:36,fontWeight:950,marginTop:8}}>2 $ / H</div></div>
    </div>
    <Brand dark/>
  </AbsoluteFill>;
};

// 8.46–14.2s
const Mission = () => {
  const f=useCurrentFrame();
  const divider=interpolate(f,[0,40],[58,45],{extrapolateRight:"clamp"});
  return <AbsoluteFill style={{background:WHITE,overflow:"hidden"}}><Source/><Rule/>
    <div style={{position:"absolute",left:0,top:0,bottom:0,width:`${divider}%`,background:CREAM}}/>
    <div style={{position:"absolute",right:0,top:0,bottom:0,width:`${100-divider}%`,overflow:"hidden"}}><Img src={A3} style={{position:"absolute",right:0,top:0,width:650,height:1920,objectFit:"cover",objectPosition:"53% center",transform:"scale(1.22)"}}/><div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(255,255,255,.95),rgba(255,255,255,.08) 34%,rgba(0,0,0,.18))"}}/></div>
    <div style={{position:"absolute",left:64,top:205,width:690,zIndex:30}}><Kicker>La mission</Kicker><Big size={102}>UNE BANDE<br/>POUR UNE<br/><span style={{color:RED}}>CHAUSSURE.</span></Big><Small>Une consigne : donner une sensation de vitesse et de mouvement.</Small></div>
    <div style={{position:"absolute",left:64,bottom:280,display:"flex",flexWrap:"wrap",gap:10,zIndex:30}}><Tag text="VITESSE" red/><Tag text="MOUVEMENT"/><Tag text="CHAUSSURE"/><Tag text="IDENTITÉ"/></div>
    <div style={{position:"absolute",right:-35,top:690,transform:"rotate(-10deg) scale(.95)",zIndex:28}}><Swoosh width={500}/></div>
    <Brand/>
  </AbsoluteFill>;
};

// 14.2–18.46s
const Sketches = () => {
  const f=useCurrentFrame();
  const p=spring({frame:f,fps:FPS,config:{damping:17,stiffness:130}});
  return <AbsoluteFill><Photo src={A4} shade={.6} zoom={1.14}/><Source dark/><Rule/>
    <div style={{position:"absolute",left:64,top:190,width:930,zIndex:25}}><Kicker dark>Plusieurs essais</Kicker><Big dark size={104}>PERSONNE<br/>N’EST VRAIMENT<br/><span style={{color:RED}}>CONVAINCU.</span></Big></div>
    <div style={{position:"absolute",left:74,right:74,top:960,height:390,zIndex:30,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
      {[0,1,2].map((i)=><div key={i} style={{position:"relative",borderRadius:22,background:i===2?RED:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.18)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",transform:`rotate(${[-4,3,-1][i]}deg) scale(${i===2?.9+p*.1:1})`}}><Swoosh color={WHITE} opacity={i===2?1:.48} width={250}/>{i===2&&<div style={{position:"absolute",right:18,top:18,width:42,height:42,borderRadius:"50%",background:WHITE,color:RED,fontFamily:"Arial Black",fontSize:25,display:"flex",alignItems:"center",justifyContent:"center"}}>✓</div>}</div>)}
    </div>
    <Brand dark/>
  </AbsoluteFill>;
};

// 18.46–23.16s
const Knight = () => {
  const f=useCurrentFrame();
  const q=interpolate(f,[8,35],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  return <AbsoluteFill style={{background:INK}}><Source dark/><Rule/>
    <div style={{position:"absolute",right:-80,top:290,opacity:.09,transform:"rotate(-9deg) scale(1.9)"}}><Swoosh color={WHITE} width={560}/></div>
    <div style={{position:"absolute",left:64,top:220,width:930,zIndex:30}}><Kicker dark>Phil Knight</Kicker><Big dark size={112}>« JE NE<br/><span style={{color:RED}}>L’ADORE PAS…</span> »</Big><div style={{marginTop:36,width:`${q*100}%`,height:4,background:RED}}/><Small dark size={33}>« …mais il finira par me plaire. »</Small></div>
    <div style={{position:"absolute",left:64,bottom:245,display:"flex",gap:10,zIndex:30}}><Tag text="PAS CONVAINCU" dark/><Tag text="PRODUCTION LANCÉE" red/></div>
    <Brand dark/>
  </AbsoluteFill>;
};

// 23.16–27.1s
const Invoice = () => {
  const f=useCurrentFrame();
  const p=spring({frame:f,fps:FPS,config:{damping:15,stiffness:135}});
  return <AbsoluteFill style={{background:CREAM}}><Source/><Rule/>
    <div style={{position:"absolute",left:64,top:190,width:930,zIndex:30}}><Kicker>La facture</Kicker><Big size={150}>35 DOLLARS.</Big><Small>Pas 35 000. Pas 3 500. Trente-cinq dollars.</Small></div>
    <div style={{position:"absolute",left:92,right:92,top:860,height:560,background:WHITE,border:`3px solid ${INK}`,borderRadius:28,boxShadow:"0 35px 85px rgba(0,0,0,.19)",padding:"42px 48px",boxSizing:"border-box",transform:`rotate(${-3+p*3}deg)`,zIndex:25}}>
      <div style={{display:"flex",justifyContent:"space-between",fontFamily:"Arial",fontSize:17,fontWeight:900,letterSpacing:2,color:GRAY}}><span>INVOICE</span><span>1971</span></div>
      <div style={{marginTop:30,height:2,background:"rgba(14,14,14,.16)"}}/>
      <div style={{fontFamily:"Arial Black",fontSize:116,fontWeight:950,letterSpacing:-5,marginTop:42}}>$35.00</div>
      <div style={{height:8,width:150,background:RED,borderRadius:99,marginTop:18}}/>
      <div style={{fontFamily:"Arial",fontSize:23,fontWeight:900,marginTop:34}}>SHOE STRIPE / LOGO DESIGN</div>
      <div style={{fontFamily:"Arial",fontSize:18,fontWeight:800,color:GRAY,marginTop:22}}>CAROLYN DAVIDSON → PHIL KNIGHT</div>
    </div>
    <Brand/>
  </AbsoluteFill>;
};

// 27.1–31.5s
const Twist = () => {
  const f=useCurrentFrame();
  const split=interpolate(f,[0,45],[48,58],{extrapolateRight:"clamp"});
  return <AbsoluteFill style={{background:WHITE}}><Source/><Rule/>
    <div style={{position:"absolute",left:64,top:190,width:930,zIndex:30}}><Kicker>Mais l’histoire ne s’arrête pas là</Kicker><Big size={100}>PLUS TARD,<br/>NIKE LUI OFFRE<br/><span style={{color:RED}}>DES ACTIONS.</span></Big><Small>Le nombre exact d’actions n’a jamais été rendu public.</Small></div>
    <div style={{position:"absolute",left:64,right:64,top:1050,height:330,display:"grid",gridTemplateColumns:`${split}% ${100-split}%`,gap:14,zIndex:30}}>
      <div style={{background:INK,borderRadius:26,padding:32,color:WHITE,fontFamily:"Arial"}}><div style={{fontSize:16,fontWeight:900,letterSpacing:2,opacity:.55}}>1971</div><div style={{fontFamily:"Arial Black",fontSize:70,fontWeight:950,marginTop:30}}>$35</div><div style={{fontSize:18,fontWeight:850,opacity:.7,marginTop:10}}>FACTURE INITIALE</div></div>
      <div style={{background:RED,borderRadius:26,padding:32,color:WHITE,fontFamily:"Arial"}}><div style={{fontSize:16,fontWeight:900,letterSpacing:2,opacity:.7}}>PLUS TARD</div><div style={{fontFamily:"Arial Black",fontSize:52,fontWeight:950,lineHeight:1.02,marginTop:31}}>ACTIONS<br/>NIKE</div><div style={{fontSize:17,fontWeight:850,opacity:.82,marginTop:13}}>QUANTITÉ NON DIVULGUÉE</div></div>
    </div>
    <Brand/>
  </AbsoluteFill>;
};

// 31.5–41.5s
const Legacy = () => {
  const f=useCurrentFrame();
  const cut=interpolate(f,[0,220],[35,70],{extrapolateRight:"clamp"});
  return <AbsoluteFill style={{background:INK,overflow:"hidden"}}>
    <Img src={A2} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center",transform:"scale(1.08)"}}/>
    <div style={{position:"absolute",inset:0,width:`${cut}%`,overflow:"hidden"}}><Img src={TL} style={{position:"absolute",left:0,top:0,width:1080,height:1920,objectFit:"cover",objectPosition:"center"}}/></div>
    <div style={{position:"absolute",left:`${cut}%`,top:0,bottom:0,width:8,background:RED,transform:"translateX(-4px)",zIndex:22}}/>
    <AbsoluteFill style={{background:"linear-gradient(180deg,rgba(0,0,0,.16),rgba(0,0,0,.08) 38%,rgba(0,0,0,.82) 78%)"}}/>
    <Source dark/><Rule/>
    <div style={{position:"absolute",left:64,right:64,bottom:250,zIndex:30}}><Kicker dark>De croquis à icône</Kicker><Big dark size={94}>35 $ →<br/><span style={{color:RED}}>UN SYMBOLE MONDIAL.</span></Big><Small dark>Un dessin d’étudiante devenu l’un des logos les plus reconnaissables au monde.</Small></div>
    <div style={{position:"absolute",left:64,top:180,display:"flex",gap:9,zIndex:30}}><Tag text="1971" dark/><Tag text="SWOOSH" red/><Tag text="NIKE" dark/></div>
    <Brand dark/>
  </AbsoluteFill>;
};

// 41.5–43.36s
const End = () => {
  const f=useCurrentFrame();
  const p=spring({frame:f,fps:FPS,config:{damping:14,stiffness:150}});
  return <AbsoluteFill style={{background:CREAM}}><Source/><Rule/>
    <div style={{position:"absolute",right:-125,top:540,opacity:.08,transform:"rotate(-10deg) scale(2.05)"}}><Swoosh width={570}/></div>
    <div style={{position:"absolute",left:64,top:280,width:930,zIndex:30,transform:`scale(${.9+p*.1})`,transformOrigin:"left center"}}><Kicker>Hors Cadre</Kicker><Big size={118}>35 $.<br/>UNE IDÉE.<br/><span style={{color:RED}}>UNE ICÔNE.</span></Big><Small>Pense autrement.</Small></div>
    <div style={{position:"absolute",left:64,right:64,bottom:230,borderTop:`4px solid ${INK}`,paddingTop:22,fontFamily:"Arial",fontSize:23,fontWeight:950,letterSpacing:1.5,zIndex:30}}>CAROLYN DAVIDSON · 1971 · PORTLAND</div>
    <Brand/>
  </AbsoluteFill>;
};

export const Nike35V2Video:React.FC=()=> <AbsoluteFill style={{background:CREAM}}>
  <Sequence from={0} durationInFrames={72}><Hook/></Sequence>
  <Sequence from={72} durationInFrames={182}><Carolyn/></Sequence>
  <Sequence from={254} durationInFrames={172}><Mission/></Sequence>
  <Sequence from={426} durationInFrames={128}><Sketches/></Sequence>
  <Sequence from={554} durationInFrames={141}><Knight/></Sequence>
  <Sequence from={695} durationInFrames={118}><Invoice/></Sequence>
  <Sequence from={813} durationInFrames={132}><Twist/></Sequence>
  <Sequence from={945} durationInFrames={300}><Legacy/></Sequence>
  <Sequence from={1245} durationInFrames={56}><End/></Sequence>
  <Grain/><Flash/>
</AbsoluteFill>;

export const Nike35V2Composition:React.FC=()=> <Composition id="Nike35V2" component={Nike35V2Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920}/>;