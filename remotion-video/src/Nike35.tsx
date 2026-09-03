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
const TOTAL = 1290; // 43s
const RED = "#F20D2F";
const INK = "#0E0E0E";
const CREAM = "#F3EFE6";
const WHITE = "#FFFDF8";
const GRAY = "#A59F97";

const NIKE_ARCHIVE_1 = "https://nmp.about.nike.com/about/prod/11de709e-e63c-4b55-ad5a-eb3f8b349ed5/nike-swoosh-carolyn-davidson-dna-3.jpg?m=eyJlZGl0cyI6eyJqcGVnIjp7InF1YWxpdHkiOjEwMH0sIndlYnAiOnsicXVhbGl0eSI6MTAwfSwiZXh0cmFjdCI6eyJsZWZ0IjowLCJ0b3AiOjgwMiwid2lkdGgiOjIwMDAsImhlaWdodCI6MTg3MH0sInJlc2l6ZSI6eyJ3aWR0aCI6Mzg0MH19fQ%3D%3D&s=ce2ae2ce7c566ed754e45fe0acfb316c360a81acf9cca8e52009996f7ecfbad9";
const NIKE_ARCHIVE_2 = "https://nmp.about.nike.com/about/prod/2cb271ab-6c2a-48b0-8ea8-a0b2f5db551e/nike-logo-wordmark-carolyn-davidson-dna-1.jpg?m=eyJlZGl0cyI6eyJqcGVnIjp7InF1YWxpdHkiOjEwMH0sIndlYnAiOnsicXVhbGl0eSI6MTAwfSwiZXh0cmFjdCI6eyJsZWZ0IjowLCJ0b3AiOjAsIndpZHRoIjozMDAwLCJoZWlnaHQiOjIwMDB9LCJyZXNpemUiOnsid2lkdGgiOjM4NDB9fX0%3D&s=7d75a78fd5cf98c9d9c60a5eac347cda7f34026b448683db33f8e7298cf1dfbd";
const NIKE_ARCHIVE_3 = "https://nmp.about.nike.com/about/prod/4f85fe0c-cc0e-4a4a-b6a1-6340b1dcb47a/nike-football-boot-original-black-dna-3.jpg?m=eyJlZGl0cyI6eyJqcGVnIjp7InF1YWxpdHkiOjEwMH0sIndlYnAiOnsicXVhbGl0eSI6MTAwfSwiZXh0cmFjdCI6eyJsZWZ0IjowLCJ0b3AiOjI1MCwid2lkdGgiOjMwMDAsImhlaWdodCI6MTY4OH0sInJlc2l6ZSI6eyJ3aWR0aCI6Mzg0MH19fQ%3D%3D&s=32dde8d7157f26174f7eec423a77658e6c6b8c1faaa0f04ce02a1f30cb378ca9";
const NIKE_ARCHIVE_4 = "https://nmp.about.nike.com/about/prod/19c7861f-b28d-45f3-b07c-3b473b08868a/nike-blueprint-dna-5.jpg?m=eyJlZGl0cyI6eyJqcGVnIjp7InF1YWxpdHkiOjEwMH0sIndlYnAiOnsicXVhbGl0eSI6MTAwfSwiZXh0cmFjdCI6eyJsZWZ0IjowLCJ0b3AiOjEwNCwid2lkdGgiOjIxMzMsImhlaWdodCI6MjU5MH0sInJlc2l6ZSI6eyJ3aWR0aCI6Mzg0MH19fQ%3D%3D&s=18a28e0d15df93dfd4b935a62e442deb2bd3fab57f935b520485fc203acdab68";
const NIKE_TIMELINE = "https://nmp.about.nike.com/about/prod/0cc8c295-a643-44f4-acb3-c18bfc2289f1/nike-swoosh-logo-timeline.jpg?m=eyJlZGl0cyI6eyJqcGVnIjp7InF1YWxpdHkiOjEwMH0sIndlYnAiOnsicXVhbGl0eSI6MTAwfSwicmVzaXplIjp7IndpZHRoIjozODQwfX19&s=cf8fdb210e3ba5e388cdfd16eb16711c9303b0a5fd4921afd9d10e3f0600aa84";

const Brand = ({dark=false}:{dark?:boolean}) => (
  <div style={{position:"absolute",left:64,right:64,bottom:72,display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:"Arial,Helvetica,sans-serif",color:dark?WHITE:INK,zIndex:50}}>
    <div style={{fontSize:27,fontWeight:950,letterSpacing:2.4}}>HORS CADRE</div>
    <div style={{fontSize:18,fontWeight:800,letterSpacing:1,opacity:.66}}>PENSE AUTREMENT.</div>
  </div>
);
const Source = ({dark=false}:{dark?:boolean}) => <div style={{position:"absolute",left:64,top:70,fontFamily:"Arial",fontSize:15,fontWeight:800,letterSpacing:1.3,color:dark?"rgba(255,255,255,.52)":"rgba(14,14,14,.45)",zIndex:60}}>SOURCES · NIKE ARCHIVES · PORTLAND STATE UNIVERSITY</div>;
const Rule = () => <div style={{position:"absolute",left:64,top:112,width:118,height:8,borderRadius:99,background:RED,zIndex:60}}/>;
const Kicker = ({children,dark=false}:{children:React.ReactNode;dark?:boolean}) => <div style={{fontFamily:"Arial",fontSize:24,fontWeight:950,letterSpacing:3.2,textTransform:"uppercase",color:dark?WHITE:RED,marginBottom:20}}>{children}</div>;
const Big = ({children,dark=false,size=118}:{children:React.ReactNode;dark?:boolean;size?:number}) => <div style={{fontFamily:"Arial Black,Arial",fontSize:size,fontWeight:950,letterSpacing:-5.2,lineHeight:.89,textTransform:"uppercase",color:dark?WHITE:INK}}>{children}</div>;
const Small = ({children,dark=false}:{children:React.ReactNode;dark?:boolean}) => <div style={{fontFamily:"Arial",fontSize:31,lineHeight:1.22,fontWeight:760,color:dark?"rgba(255,255,255,.82)":"rgba(14,14,14,.7)",marginTop:26,maxWidth:880}}>{children}</div>;

const Photo = ({src,shade=.45,pos="center"}:{src:string;shade?:number;pos?:string}) => {
  const f=useCurrentFrame();
  return <AbsoluteFill style={{overflow:"hidden",background:INK}}>
    <Img src={src} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:pos,scale:interpolate(f,[0,190],[1.04,1.13],{extrapolateRight:"clamp"})}}/>
    <AbsoluteFill style={{background:`linear-gradient(180deg,rgba(0,0,0,${shade*.45}),rgba(0,0,0,${shade}) 58%,rgba(0,0,0,${Math.min(.84,shade+.2)}))`}}/>
  </AbsoluteFill>;
};

const Swoosh = ({color=INK,opacity=1}:{color?:string;opacity?:number}) => (
  <svg viewBox="0 0 500 220" style={{width:460,height:205,opacity}}>
    <path fill={color} d="M35 151c56 48 131 50 211 16 74-31 142-82 219-151-61 92-130 161-215 190-91 31-174 19-215-55z"/>
  </svg>
);

const Grain = () => {const f=useCurrentFrame();return <AbsoluteFill style={{pointerEvents:"none",zIndex:90,opacity:.07,mixBlendMode:"multiply",backgroundImage:"radial-gradient(circle,rgba(0,0,0,.28) 0 1px,transparent 1.2px)",backgroundSize:"11px 11px",backgroundPosition:`${(f*7)%23}px ${(f*5)%19}px`}}/>};
const Flash = () => {const f=useCurrentFrame();const cuts=[120,285,435,600,765,930,1080];const d=cuts.reduce((m,c)=>Math.min(m,Math.abs(f-c)),999);return <AbsoluteFill style={{pointerEvents:"none",zIndex:100,background:`rgba(255,255,255,${interpolate(d,[0,1,4],[.22,.08,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})})`}}/>};

const Hook = () => {
  const f=useCurrentFrame(); const p=spring({frame:f,fps:FPS,config:{damping:14,stiffness:180}});
  return <AbsoluteFill style={{background:CREAM}}><Source/><Rule/>
    <div style={{position:"absolute",left:64,top:205,width:910,scale:.86+p*.14,transformOrigin:"left top"}}>
      <Kicker>Un logo mondial</Kicker>
      <Big size={170}>35 $.</Big>
      <Small>Le prix facturé pour créer le Swoosh de Nike.</Small>
    </div>
    <div style={{position:"absolute",right:30,bottom:290,rotate:"-8deg",scale:1.08}}><Swoosh color={INK}/></div>
    <div style={{position:"absolute",left:64,bottom:255,fontFamily:"Arial",fontSize:20,fontWeight:900,letterSpacing:2,color:GRAY}}>1971 · PORTLAND, OREGON</div>
    <Brand/>
  </AbsoluteFill>;
};

const SceneArchive = () => <AbsoluteFill><Photo src={NIKE_ARCHIVE_1} shade={.62}/><Source dark/><Rule/>
  <div style={{position:"absolute",left:64,top:220,width:920,zIndex:20}}><Kicker dark>Carolyn Davidson</Kicker><Big dark size={110}>UNE ÉTUDIANTE<br/>EN GRAPHISME.</Big><Small dark>Phil Knight la payait 2 dollars de l’heure pour des travaux graphiques.</Small></div><Brand dark/>
</AbsoluteFill>;

const SceneBrief = () => <AbsoluteFill style={{background:WHITE}}><Source/><Rule/>
  <div style={{position:"absolute",left:64,top:220,width:600,zIndex:20}}><Kicker>La mission</Kicker><Big size={105}>DESSINER<br/>UNE BANDE<br/><span style={{color:RED}}>QUI ÉVOQUE<br/>LA VITESSE.</span></Big></div>
  <div style={{position:"absolute",right:-95,top:500,width:620,rotate:"-9deg"}}><Swoosh color={INK}/></div>
  <div style={{position:"absolute",left:64,right:64,bottom:250,height:3,background:INK,opacity:.16}}/>
  <Small>Le logo devait fonctionner sur le côté d’une chaussure et ne pas ressembler aux trois bandes d’Adidas.</Small>
  <Brand/>
</AbsoluteFill>;

const SceneSketch = () => <AbsoluteFill><Photo src={NIKE_ARCHIVE_4} shade={.58} pos="center"/><Source dark/><Rule/>
  <div style={{position:"absolute",left:64,top:220,width:930,zIndex:20}}><Kicker dark>Plusieurs esquisses</Kicker><Big dark size={110}>AUCUNE<br/>NE FAIT<br/><span style={{color:RED}}>L’UNANIMITÉ.</span></Big><Small dark>Le Swoosh est finalement choisi parce qu’il faut lancer la production.</Small></div><Brand dark/>
</AbsoluteFill>;

const SceneKnight = () => <AbsoluteFill style={{background:INK}}><Source dark/><Rule/>
  <div style={{position:"absolute",left:64,top:240,width:940}}><Kicker dark>Phil Knight</Kicker><Big dark size={106}>« JE NE<br/>L’ADORE PAS… »</Big><Small dark>« …mais il finira par me plaire. »</Small></div>
  <div style={{position:"absolute",right:50,bottom:260,opacity:.18,scale:1.45}}><Swoosh color={WHITE}/></div><Brand dark/>
</AbsoluteFill>;

const SceneInvoice = () => {const f=useCurrentFrame();const p=spring({frame:f,fps:FPS,config:{damping:16,stiffness:130}});return <AbsoluteFill style={{background:CREAM}}><Source/><Rule/>
  <div style={{position:"absolute",left:64,top:220,width:940}}><Kicker>La facture</Kicker><Big size={152}>35 DOLLARS.</Big><Small>Carolyn Davidson envoie simplement sa facture à Phil Knight.</Small></div>
  <div style={{position:"absolute",left:110,right:110,top:980,height:420,background:WHITE,borderRadius:28,border:`3px solid ${INK}`,padding:"44px 52px",boxSizing:"border-box",rotate:`${-2+p*2}deg`,boxShadow:"0 34px 80px rgba(0,0,0,.18)"}}>
    <div style={{fontFamily:"Arial",fontSize:18,fontWeight:900,letterSpacing:2,color:GRAY}}>INVOICE · 1971</div>
    <div style={{fontFamily:"Arial Black",fontSize:92,fontWeight:950,marginTop:50,color:INK}}>$35.00</div>
    <div style={{height:6,width:120,background:RED,borderRadius:99,marginTop:30}}/>
    <div style={{fontFamily:"Arial",fontSize:24,fontWeight:800,marginTop:30,color:INK}}>Logo / shoe stripe design</div>
  </div><Brand/>
</AbsoluteFill>};

const SceneShoe = () => <AbsoluteFill><Photo src={NIKE_ARCHIVE_3} shade={.62}/><Source dark/><Rule/>
  <div style={{position:"absolute",left:64,top:220,width:920,zIndex:20}}><Kicker dark>Et pourtant…</Kicker><Big dark size={108}>LE LOGO<br/>COMMENCE À<br/><span style={{color:RED}}>GAGNER.</span></Big><Small dark>En 1972, le Swoosh apparaît déjà sur des chaussures portées au marathon de Boston.</Small></div><Brand dark/>
</AbsoluteFill>;

const SceneTwist = () => <AbsoluteFill style={{background:WHITE}}><Source/><Rule/>
  <div style={{position:"absolute",left:64,top:210,width:930}}><Kicker>Le détail que l’on oublie</Kicker><Big size={108}>NIKE LUI<br/>OFFRIRA PLUS TARD<br/><span style={{color:RED}}>DES ACTIONS.</span></Big><Small>Le montant exact n’a jamais été rendu public.</Small></div>
  <div style={{position:"absolute",left:64,right:64,top:1060,height:310,display:"grid",gridTemplateColumns:"1fr 1fr",gap:22}}>
    <div style={{background:INK,borderRadius:26,padding:34,color:WHITE,fontFamily:"Arial"}}><div style={{fontSize:17,fontWeight:900,letterSpacing:2,opacity:.55}}>1971</div><div style={{fontFamily:"Arial Black",fontSize:62,fontWeight:950,marginTop:28}}>$35</div></div>
    <div style={{background:RED,borderRadius:26,padding:34,color:WHITE,fontFamily:"Arial"}}><div style={{fontSize:17,fontWeight:900,letterSpacing:2,opacity:.72}}>PLUS TARD</div><div style={{fontFamily:"Arial Black",fontSize:49,fontWeight:950,marginTop:28,lineHeight:1}}>ACTIONS<br/>NIKE</div></div>
  </div><Brand/>
</AbsoluteFill>;

const Final = () => <AbsoluteFill><Photo src={NIKE_TIMELINE} shade={.66}/><Source dark/><Rule/>
  <div style={{position:"absolute",left:64,top:225,width:930,zIndex:20}}><Kicker dark>Le vrai twist</Kicker><Big dark size={105}>UN CROQUIS<br/>D’ÉTUDIANTE.<br/><span style={{color:RED}}>DEVENU UNE ICÔNE.</span></Big><Small dark>L’un des symboles commerciaux les plus reconnaissables au monde.</Small></div>
  <div style={{position:"absolute",right:55,bottom:245,opacity:.8}}><Swoosh color={WHITE}/></div><Brand dark/>
</AbsoluteFill>;

export const Nike35Video:React.FC=()=> <AbsoluteFill style={{background:CREAM}}>
  <Sequence from={0} durationInFrames={120}><Hook/></Sequence>
  <Sequence from={120} durationInFrames={165}><SceneArchive/></Sequence>
  <Sequence from={285} durationInFrames={150}><SceneBrief/></Sequence>
  <Sequence from={435} durationInFrames={165}><SceneSketch/></Sequence>
  <Sequence from={600} durationInFrames={165}><SceneKnight/></Sequence>
  <Sequence from={765} durationInFrames={165}><SceneInvoice/></Sequence>
  <Sequence from={930} durationInFrames={150}><SceneShoe/></Sequence>
  <Sequence from={1080} durationInFrames={130}><SceneTwist/></Sequence>
  <Sequence from={1210} durationInFrames={80}><Final/></Sequence>
  <Grain/><Flash/>
</AbsoluteFill>;

export const Nike35Composition:React.FC=()=> <Composition id="Nike35" component={Nike35Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920}/>;