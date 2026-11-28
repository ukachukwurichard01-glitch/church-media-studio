import React from "react";

const DESIGNS = [
  ["gold-orbit","Gold Orbit","Countdown & presentation","radial-gradient(circle at 50% 50%,#66502a,#11131d 62%,#05070c)"],
  ["royal-blue","Royal Blue Depth","Countdown","radial-gradient(circle at 70% 20%,#275d91,#10182c 58%,#05070c)"],
  ["purple-glass","Purple Glass","Presentation","radial-gradient(circle at 25% 25%,#69458d,#211a35 58%,#080910)"],
  ["emerald-sanctuary","Emerald Sanctuary","Countdown","radial-gradient(circle at 50% 30%,#28765f,#10251f 58%,#050908)"],
  ["crimson-glory","Crimson Glory","Presentation","radial-gradient(circle at 75% 35%,#8d3445,#2b101d 60%,#08070b)"],
  ["heaven-rays","Heaven Rays","Countdown","linear-gradient(135deg,#6b593a,#25344a 48%,#080d18)"],
  ["midnight-stars","Midnight Stars","Presentation","radial-gradient(circle at 50% 40%,#283b66,#080d1c 65%,#03050a)"],
  ["white-marble","White Marble","Presentation","linear-gradient(135deg,#d9d5cb,#777f8b 45%,#242b36)"],
  ["sunrise-glory","Sunrise Glory","Countdown","linear-gradient(120deg,#e08c4b,#713d4d 48%,#17172b)"],
  ["ocean-worship","Ocean Worship","Presentation","linear-gradient(135deg,#1d8b9c,#143c5b 50%,#07111e)"],
  ["golden-cross","Golden Cross","Countdown","radial-gradient(ellipse at 50% 45%,#8c6a2d,#2c2116 48%,#08090d)"],
  ["smoke-stage","Smoke Stage","Presentation","radial-gradient(ellipse at 50% 20%,#58616e,#171c26 50%,#05070b)"],
  ["royal-purple","Royal Purple","Countdown","linear-gradient(145deg,#5e3e83,#241a3d 55%,#08070e)"],
  ["forest-light","Forest Light","Presentation","radial-gradient(circle at 50% 15%,#7c9a70,#1e493b 45%,#07120f)"],
  ["diamond-depth","Diamond Depth","Countdown & presentation","linear-gradient(145deg,#4a6278,#182b42 48%,#060b12)"]
];

export default function MotionTemplates({ selected, onSelect }) {
  return <section className="content-panel production-panel">
    <div className="panel-heading"><div><h2>15 Cinematic 3D Designs</h2><p>Choose animated countdown and presentation backdrops. The selected design is used by the programme output.</p></div><span className="small-label">15 DESIGNS</span></div>
    <div className="motion-template-grid">{DESIGNS.map(([id,name,kind,background],index)=><button type="button" key={id} className={"motion-template-card "+(selected===id?"selected":"")} onClick={()=>onSelect(id)}>
      <span className={"motion-template-art art-"+(index+1)} style={{background}}><i></i><b></b><em>{String(index+1).padStart(2,"0")}</em></span>
      <strong>{name}</strong><small>{kind}</small>
    </button>)}</div>
    <p className="notice">These designs provide animated depth, layered light and reusable backgrounds for countdown and presentation output. They do not require a paid template pack.</p>
  </section>;
}
