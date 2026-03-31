export const SCENE_SVGS = {
  '001': `<svg width="100%" height="100%" viewBox="0 0 800 350" xmlns="http://www.w3.org/2000/svg">
  <!-- Drawing room night scene -->
  <rect width="800" height="350" fill="#0d1015"/>
  <!-- Wallpaper pattern -->
  <rect width="800" height="350" fill="none" stroke="#1a1a22" stroke-width="0" />
  ${Array.from({length:12},(_,i)=>`<line x1="${i*70}" y1="0" x2="${i*70}" y2="350" stroke="#111318" stroke-width="0.5"/>`).join('')}
  ${Array.from({length:8},(_,i)=>`<line x1="0" y1="${i*50}" x2="800" y2="${i*50}" stroke="#111318" stroke-width="0.5"/>`).join('')}
  <!-- Bookcase left -->
  <rect x="30" y="40" width="110" height="260" fill="#1a1208" stroke="#2a1e0a" stroke-width="1"/>
  ${Array.from({length:6},(_,i)=>`<rect x="38" y="${52+i*36}" width="94" height="28" fill="${['#2a1a0a','#1a2a1a','#2a0a0a','#1a1a2a','#2a2010','#0a2a1a'][i]}" rx="1"/>`).join('')}
  <text x="85" y="300" fill="#3a2a10" font-size="10" text-anchor="middle" font-family="serif">LIBRARY</text>
  <!-- Window center-back with moonlight -->
  <rect x="280" y="30" width="240" height="180" fill="#0a0f1a" stroke="#1a2030" stroke-width="2"/>
  <line x1="400" y1="30" x2="400" y2="210" stroke="#1a2030" stroke-width="2"/>
  <line x1="280" y1="120" x2="520" y2="120" stroke="#1a2030" stroke-width="2"/>
  <!-- Moon glow through window -->
  <ellipse cx="400" cy="100" rx="80" ry="60" fill="rgba(180,190,220,0.04)"/>
  <ellipse cx="400" cy="100" rx="40" ry="30" fill="rgba(180,190,220,0.06)"/>
  <!-- Armchair (victim) -->
  <rect x="310" y="220" width="120" height="80" fill="#2a1a10" rx="4"/>
  <rect x="300" y="215" width="140" height="20" fill="#331f12" rx="3"/>
  <rect x="300" y="235" width="16" height="60" fill="#2a1a0f" rx="2"/>
  <rect x="424" y="235" width="16" height="60" fill="#2a1a0f" rx="2"/>
  <!-- Slumped figure silhouette -->
  <ellipse cx="370" cy="225" rx="22" ry="16" fill="#111"/>
  <rect x="348" y="224" width="44" height="55" fill="#111" rx="8"/>
  <!-- Brandy decanter on side table -->
  <rect x="450" y="260" width="40" height="50" fill="#0d0d0d" rx="2"/>
  <ellipse cx="460" cy="258" rx="10" ry="6" fill="#1a1a1a"/>
  <rect x="453" y="220" width="14" height="40" fill="#1c3020" rx="3"/>
  <ellipse cx="460" cy="220" rx="9" ry="5" fill="#264030" opacity="0.8"/>
  <!-- Shattered glass on floor -->
  <polygon points="458,302 463,298 468,305 460,308" fill="rgba(180,210,255,0.3)"/>
  <polygon points="470,305 475,300 480,307" fill="rgba(180,210,255,0.25)"/>
  <!-- Candlelight flicker - fireplace right -->
  <rect x="640" y="140" width="120" height="170" fill="#120c08" stroke="#1a1008" stroke-width="1"/>
  <rect x="648" y="200" width="104" height="90" fill="#0d0806"/>
  <ellipse cx="700" cy="195" rx="30" ry="8" fill="#7a2800" opacity="0.6"/>
  <polygon points="685,195 700,140 715,195" fill="#b03800" opacity="0.5"/>
  <polygon points="690,195 700,155 710,195" fill="#d06000" opacity="0.6"/>
  <polygon points="694,195 700,165 706,195" fill="#f09020" opacity="0.4"/>
  <!-- Warm firelight glow splash -->
  <radialGradient id="fg1"><stop offset="0%" stop-color="#b04000" stop-opacity="0.15"/><stop offset="100%" stop-color="transparent"/></radialGradient>
  <ellipse cx="700" cy="200" rx="200" ry="120" fill="url(#fg1)"/>
  <!-- Yellow chalk outline on floor -->
  <ellipse cx="365" cy="305" rx="55" ry="20" fill="none" stroke="rgba(220,200,60,0.4)" stroke-width="1.5" stroke-dasharray="4 3"/>
  <!-- Evidence markers -->
  <rect x="415" y="292" width="14" height="14" fill="rgba(220,200,60,0.8)" rx="1"/>
  <text x="422" y="303" fill="#0a0a00" font-size="8" font-weight="bold" text-anchor="middle" font-family="monospace">1</text>
  <rect x="448" y="298" width="14" height="14" fill="rgba(220,200,60,0.8)" rx="1"/>
  <text x="455" y="309" fill="#0a0a00" font-size="8" font-weight="bold" text-anchor="middle" font-family="monospace">2</text>
  <!-- Painting on wall -->
  <rect x="150" y="60" width="100" height="130" fill="#1a1208" stroke="#2a1e0a" stroke-width="2"/>
  <rect x="158" y="68" width="84" height="114" fill="#0f0c08"/>
  <ellipse cx="200" cy="125" rx="30" ry="40" fill="#1a1808" stroke="#2a2010" stroke-width="1"/>
  <text x="200" y="195" fill="#2a1a08" font-size="7" text-anchor="middle" font-family="serif">VERMEER</text>
  <!-- Floor shadow -->
  <rect x="0" y="300" width="800" height="50" fill="rgba(0,0,0,0.5)"/>
</svg>`,

  '002': `<svg width="100%" height="100%" viewBox="0 0 800 350" xmlns="http://www.w3.org/2000/svg">
  <!-- Office high-rise, daytime, sterile -->
  <rect width="800" height="350" fill="#090c10"/>
  <!-- City view through floor-to-ceiling glass -->
  <rect x="0" y="0" width="800" height="220" fill="#0a0d14"/>
  ${Array.from({length:20},(_,i)=>`<rect x="${i*42}" y="${20+Math.random()*60|0}" width="28" height="${80+Math.random()*80|0}" fill="rgba(30,50,80,0.4)" rx="1"/>`).join('')}
  ${Array.from({length:15},(_,i)=>`<rect x="${10+i*55}" y="${40+Math.random()*40|0}" width="20" height="${50+Math.random()*60|0}" fill="rgba(20,40,60,0.5)" rx="1"/>`).join('')}
  <!-- Building window grid -->
  ${Array.from({length:6},(_,i)=>Array.from({length:18},(_,j)=>`<rect x="${j*46+2}" y="${i*38+4}" width="40" height="30" fill="rgba(180,200,240,0.02)" stroke="rgba(40,60,90,0.3)" stroke-width="0.5"/>`).join('')).join('')}
  <!-- Conference table -->
  <ellipse cx="400" cy="280" rx="280" ry="50" fill="#0f1318" stroke="#1a2030" stroke-width="1.5"/>
  <!-- Chairs around table -->
  ${Array.from({length:6},(_,i)=>{const a=i/6*Math.PI*2;const x=400+Math.cos(a)*290;const y=280+Math.sin(a)*52;return `<ellipse cx="${x|0}" cy="${y|0}" rx="22" ry="14" fill="#0a0d10" stroke="#1a2028" stroke-width="1" transform="rotate(${(a*180/Math.PI)|0} ${x|0} ${y|0})"/>`}).join('')}
  <!-- Victim slumped at head of table -->
  <ellipse cx="680" cy="270" rx="18" ry="12" fill="#111"/>
  <rect x="665" y="268" width="36" height="28" fill="#111" rx="6"/>
  <!-- Presentation screen at far end -->
  <rect x="30" y="50" width="200" height="130" fill="#0f1520" stroke="#1a2535" stroke-width="2"/>
  <rect x="36" y="56" width="188" height="118" fill="#040810"/>
  <!-- Slide 7 content -->
  <text x="130" y="80" fill="rgba(200,210,230,0.7)" font-size="10" text-anchor="middle" font-family="monospace">SLIDE 07</text>
  <rect x="50" y="90" width="100" height="6" fill="rgba(200,210,230,0.15)" rx="2"/>
  <rect x="50" y="102" width="140" height="4" fill="rgba(200,210,230,0.1)" rx="2"/>
  <rect x="50" y="112" width="120" height="4" fill="rgba(200,210,230,0.1)" rx="2"/>
  <rect x="50" y="122" width="80" height="20" fill="rgba(192,57,43,0.2)" rx="2"/>
  <text x="90" y="136" fill="rgba(192,57,43,0.8)" font-size="8" text-anchor="middle" font-family="monospace">EMBEZZLEMENT</text>
  <text x="90" y="148" fill="rgba(192,57,43,0.6)" font-size="7" text-anchor="middle" font-family="monospace">$4,000,000</text>
  <!-- Fountain pen on table -->
  <rect x="380" y="270" width="60" height="6" fill="#1a1a30" rx="3"/>
  <ellipse cx="440" cy="273" rx="4" ry="3" fill="#111830"/>
  <!-- Coffee cup (clean = misleading) -->
  <ellipse cx="490" cy="268" rx="12" ry="8" fill="#1a0f08"/>
  <rect x="478" y="268" width="24" height="20" fill="#1a0f08" rx="2"/>
  <!-- Evidence number -->
  <rect x="365" y="290" width="14" height="14" fill="rgba(220,200,60,0.8)" rx="1"/>
  <text x="372" y="301" fill="#0a0a00" font-size="8" font-weight="bold" text-anchor="middle" font-family="monospace">A</text>
  <!-- Phone on table -->
  <rect x="440" y="255" width="22" height="36" fill="#111" rx="3" stroke="#1a1a1a" stroke-width="0.5"/>
  <rect x="443" y="259" width="16" height="24" fill="#0a1020" rx="1"/>
  <!-- Cold fluorescent ceiling light bars -->
  ${Array.from({length:4},(_,i)=>`<rect x="${80+i*165}" y="10" width="120" height="8" fill="rgba(180,200,240,0.04)" rx="1"/><rect x="${80+i*165}" y="10" width="120" height="2" fill="rgba(180,200,240,0.12)" rx="1"/>`).join('')}
  <radialGradient id="coldlight"><stop offset="0%" stop-color="#b0c8ff" stop-opacity="0.06"/><stop offset="100%" stop-color="transparent"/></radialGradient>
  <rect x="0" y="200" width="800" height="150" fill="rgba(0,0,0,0.6)"/>
</svg>`,

  '003': `<svg width="100%" height="100%" viewBox="0 0 800 350" xmlns="http://www.w3.org/2000/svg">
  <!-- Hotel corridor / bathroom -->
  <rect width="800" height="350" fill="#0c0c0e"/>
  <!-- Hallway perspective lines -->
  <polygon points="0,0 800,0 600,350 200,350" fill="#0e0e11"/>
  <!-- Carpet runner -->
  <polygon points="60,350 740,350 680,200 120,200" fill="#12100f"/>
  ${Array.from({length:12},(_,i)=>`<rect x="${60+i*57}" y="220" width="45" height="8" fill="rgba(40,30,20,0.5)" rx="1"/>`).join('')}
  <!-- Hotel room doors left -->
  <rect x="20" y="60" width="90" height="180" fill="#141210" stroke="#1e1c18" stroke-width="1.5" rx="2"/>
  <rect x="26" y="66" width="78" height="168" fill="#0f0e0c"/>
  <text x="65" y="155" fill="rgba(180,160,120,0.3)" font-size="11" text-anchor="middle" font-family="monospace">408</text>
  <circle cx="90" cy="150" r="4" fill="#1a1510" stroke="#2a2015" stroke-width="0.5"/>
  <!-- Room 412 door (slightly ajar, light spill) -->
  <rect x="620" y="60" width="120" height="210" fill="#141210" stroke="#1e1c18" stroke-width="1.5" rx="2"/>
  <rect x="626" y="66" width="108" height="198" fill="#0f0e0c"/>
  <text x="680" y="165" fill="rgba(180,160,120,0.4)" font-size="12" text-anchor="middle" font-family="monospace">412</text>
  <!-- Light spill from 412 - door ajar -->
  <polygon points="740,60 800,80 800,250 740,270" fill="rgba(220,200,160,0.06)"/>
  <!-- Chain latch detail -->
  <rect x="726" y="110" width="20" height="4" fill="#2a2010" rx="2"/>
  <rect x="730" y="108" width="6" height="8" fill="#1a1508" rx="1"/>
  <!-- Bathroom scene through door crack -->
  <rect x="745" y="80" width="55" height="180" fill="#0a1015"/>
  <rect x="750" y="120" width="45" height="100" fill="#080d10" rx="2"/>
  <!-- Bathtub silhouette -->
  <ellipse cx="772" cy="185" rx="25" ry="10" fill="#0a0e12" stroke="#121820" stroke-width="1"/>
  <!-- Figure in tub -->
  <ellipse cx="772" cy="175" rx="10" ry="6" fill="#0a0a0a"/>
  <!-- Water on floor -->
  <ellipse cx="400" cy="310" rx="200" ry="20" fill="rgba(30,50,80,0.3)"/>
  <ellipse cx="400" cy="310" rx="100" ry="10" fill="rgba(40,60,100,0.2)"/>
  <!-- Key card on hallway floor -->
  <rect x="350" y="295" width="36" height="24" fill="#1a1515" rx="2" stroke="#2a2020" stroke-width="0.5"/>
  <rect x="354" y="299" width="28" height="16" fill="#110f0f" rx="1"/>
  <!-- Evidence marker -->
  <rect x="384" y="312" width="13" height="13" fill="rgba(220,200,60,0.85)" rx="1"/>
  <text x="391" y="322" fill="#0a0a00" font-size="7" font-weight="bold" text-anchor="middle" font-family="monospace">K</text>
  <!-- Wet towel on floor near door -->
  <ellipse cx="600" cy="305" rx="40" ry="12" fill="#181412" opacity="0.8"/>
  <!-- Warm wall sconces -->
  <rect x="200" y="100" width="8" height="24" fill="#1a1510"/>
  <ellipse cx="204" cy="100" rx="6" ry="8" fill="rgba(180,130,40,0.08)"/>
  <rect x="560" y="100" width="8" height="24" fill="#1a1510"/>
  <ellipse cx="564" cy="100" rx="6" ry="8" fill="rgba(180,130,40,0.08)"/>
  <radialGradient id="sconce1" cx="204" cy="100" r="80" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#c09030" stop-opacity="0.06"/><stop offset="100%" stop-color="transparent"/></radialGradient>
  <rect x="0" y="0" width="800" height="350" fill="url(#sconce1)" opacity="0.5"/>
  <!-- Darkness gradient at bottom -->
  <rect x="0" y="250" width="800" height="100" fill="rgba(0,0,0,0.55)"/>
</svg>`,

  '004': `<svg width="100%" height="100%" viewBox="0 0 800 350" xmlns="http://www.w3.org/2000/svg">
  <!-- Underground parking garage -->
  <rect width="800" height="350" fill="#080808"/>
  <!-- Concrete ceiling with pipes -->
  <rect x="0" y="0" width="800" height="60" fill="#0c0c0d"/>
  ${Array.from({length:6},(_,i)=>`<rect x="${i*140}" y="20" width="100" height="8" fill="#0e0e10" rx="1"/>`).join('')}
  <rect x="0" y="55" width="800" height="3" fill="#111"/>
  <!-- Fluorescent strips (some flickering) -->
  <rect x="50" y="18" width="180" height="6" fill="rgba(180,200,220,0.06)" rx="1"/>
  <rect x="50" y="18" width="180" height="2" fill="rgba(180,200,220,0.15)" rx="1"/>
  <rect x="300" y="18" width="180" height="6" fill="rgba(180,200,220,0.03)" rx="1"/>
  <rect x="300" y="18" width="180" height="1" fill="rgba(180,200,220,0.07)" rx="1"/>
  <rect x="570" y="18" width="180" height="6" fill="rgba(180,200,220,0.07)" rx="1"/>
  <rect x="570" y="18" width="180" height="2" fill="rgba(180,200,220,0.18)" rx="1"/>
  <!-- Concrete pillars -->
  <rect x="130" y="55" width="28" height="295" fill="#0e0e10" stroke="#111" stroke-width="0.5"/>
  <rect x="390" y="55" width="28" height="295" fill="#0e0e10" stroke="#111" stroke-width="0.5"/>
  <rect x="650" y="55" width="28" height="295" fill="#0e0e10" stroke="#111" stroke-width="0.5"/>
  <!-- Column 47 marker -->
  <text x="144" y="80" fill="rgba(180,160,100,0.4)" font-size="10" text-anchor="middle" font-family="monospace">P3-47</text>
  <!-- Floor markings -->
  <rect x="0" y="280" width="800" height="4" fill="rgba(220,200,60,0.15)"/>
  <rect x="0" y="340" width="800" height="4" fill="rgba(220,200,60,0.1)"/>
  ${Array.from({length:5},(_,i)=>`<rect x="${60+i*160}" y="60" width="100" height="220" fill="rgba(255,255,255,0.006)" stroke="rgba(220,200,60,0.08)" stroke-width="1" rx="1"/>`).join('')}
  <!-- The victim's car - silver sedan -->
  <rect x="175" y="140" width="200" height="110" fill="#141416" rx="8" stroke="#1c1c20" stroke-width="1.5"/>
  <!-- Car windows -->
  <rect x="195" y="148" width="70" height="40" fill="#0a0c10" rx="3"/>
  <rect x="275" y="148" width="80" height="40" fill="#0a0c10" rx="3"/>
  <!-- Wheels -->
  <ellipse cx="205" cy="254" rx="20" ry="20" fill="#080808" stroke="#181818" stroke-width="2"/>
  <ellipse cx="355" cy="254" rx="20" ry="20" fill="#080808" stroke="#181818" stroke-width="2"/>
  <!-- Engine running - red tail lights -->
  <rect x="175" y="175" width="10" height="30" fill="rgba(192,40,20,0.6)" rx="2"/>
  <rect x="365" y="175" width="10" height="30" fill="rgba(192,40,20,0.6)" rx="2"/>
  <ellipse cx="180" cy="190" rx="20" ry="15" fill="rgba(192,40,20,0.08)"/>
  <ellipse cx="370" cy="190" rx="20" ry="15" fill="rgba(192,40,20,0.08)"/>
  <!-- GARDEN HOSE through window -->
  <path d="M 272 168 Q 290 155 330 165 Q 355 170 375 200 Q 390 225 385 260" fill="none" stroke="#1a2a10" stroke-width="6" stroke-linecap="round"/>
  <path d="M 272 168 Q 290 155 330 165 Q 355 170 375 200 Q 390 225 385 260" fill="none" stroke="#2a3a18" stroke-width="4" stroke-linecap="round"/>
  <!-- Exhaust fumes rising from hose end -->
  <ellipse cx="385" cy="250" rx="15" ry="8" fill="rgba(150,160,150,0.08)"/>
  <ellipse cx="382" cy="235" rx="10" ry="6" fill="rgba(150,160,150,0.05)"/>
  <!-- CCTV camera on pillar (facing away - blind spot) -->
  <rect x="148" y="90" width="18" height="10" fill="#0e0e10" rx="2"/>
  <rect x="160" y="88" width="12" height="14" fill="#111" rx="2"/>
  <text x="144" y="115" fill="rgba(192,57,43,0.4)" font-size="7" text-anchor="middle" font-family="monospace">BLIND</text>
  <!-- Security badge on floor -->
  <rect x="430" y="270" width="32" height="22" fill="#0f0f12" rx="2" stroke="#1a1a20" stroke-width="0.5"/>
  <rect x="433" y="273" width="26" height="16" fill="#080810" rx="1"/>
  <!-- Evidence markers -->
  <rect x="278" y="284" width="13" height="13" fill="rgba(220,200,60,0.85)" rx="1"/>
  <text x="284" y="294" fill="#0a0a00" font-size="7" font-weight="bold" text-anchor="middle" font-family="monospace">1</text>
  <rect x="428" y="288" width="13" height="13" fill="rgba(220,200,60,0.85)" rx="1"/>
  <text x="435" y="298" fill="#0a0a00" font-size="7" font-weight="bold" text-anchor="middle" font-family="monospace">2</text>
  <!-- Floor oil stains / tire tracks -->
  <ellipse cx="275" cy="310" rx="80" ry="12" fill="rgba(20,20,20,0.6)"/>
  <!-- Emergency tape across scene -->
  <line x1="160" y1="260" x2="420" y2="300" stroke="rgba(212,136,42,0.5)" stroke-width="4"/>
  <line x1="160" y1="268" x2="420" y2="308" stroke="rgba(212,136,42,0.3)" stroke-width="2"/>
  <!-- Deep dark floor -->
  <rect x="0" y="295" width="800" height="55" fill="rgba(0,0,0,0.7)"/>
</svg>`
};
