export const defaultCases = [
  {
    id:'001',title:'The Vandermeer Affair',
    location:'Vandermeer Estate — Drawing Room',
    icon:'🕯️',difficulty:'medium',
    image:null,
    description:'Art collector found dead beside his prized Vermeer painting on the eve of a high-stakes auction.',
    story:'The grandfather clock struck midnight as Reginald Vandermeer was discovered slumped in his leather armchair, a shattered brandy glass beside him. The drawing room door had been bolted from within — yet three guests remained on the property. The Vermeer still hung on the wall, undisturbed. But not everything was as it seemed.',
    clues:[
      {text:"A faint scent of almonds lingers near the brandy decanter.",misleading:false},
      {text:"The drawing room bolt shows fresh scratch marks on its underside.",misleading:false},
      {text:"A torn page from the auction catalogue bears a circled lot number — in red ink.",misleading:false},
      {text:"One of the champagne flutes still bears a lipstick imprint, though no women were admitted.",misleading:true},
      {text:"The victim's will, partially visible on his desk, cuts out his nephew entirely.",misleading:false},
      {text:"The grandfather clock runs exactly 12 minutes slow — and has done for years.",misleading:false}
    ],
    suspects:[
      {name:'Edgar Voss',role:'Art Appraiser',motive:'Vandermeer had discovered Voss had been secretly devaluing appraisals for a rival collector.',alibi:'Claims to have been reading in the library. A book found there was still warm.',hidden:'Voss carries cyanide capsules — "for rare document preservation", he insists.'},
      {name:'Celeste Marne',role:'Niece & Heir',motive:'Stood to inherit everything until the will was recently altered, cutting her share drastically.',alibi:'Says she was in the garden. Dew-soaked shoes support this — but she was also seen near the decanter.',hidden:'A pocket perfume bottle contains something other than perfume.'},
      {name:'Dr. Halfred Stout',role:'Family Physician',motive:'Vandermeer knew Stout had been falsifying his medical certificates for years.',alibi:'Insists he was administering a dose of his own medication. Bag shows no disturbed contents.',hidden:'His cufflink was found beside the armchair.'}
    ],
    killer:'Dr. Halfred Stout',
    explanation:'Dr. Stout laced the brandy with potassium cyanide — the almond scent was the telltale sign. The bolt was operated via a thin wire through the keyhole (scratches on the underside). His cufflink fell unnoticed when he reached across to confirm Vandermeer was dead. The will change was the motive — Vandermeer had threatened to expose the false medical certificates publicly.'
  },
  {
    id:'002',title:'Altitude Malice',
    location:'Meridian Tower — 47th Floor Conference Suite',
    icon:'🏙️',difficulty:'hard',
    image:null,
    description:'Tech billionaire collapses during a board meeting. All exits were monitored. No one left.',
    story:'At 10:14am, Garrett Finch — founder and CEO of Meridian Systems — seized violently mid-presentation and was dead within minutes. The conference suite sealed automatically for 12 minutes following a fire alarm test. Three board members, each with millions at stake in a hostile takeover vote, were present. The presentation screen still showed slide seven.',
    clues:[
      {text:"Slide seven contains a financial model proving someone in the room had been skimming funds.",misleading:false},
      {text:"The victim's coffee cup shows no trace of any foreign substance.",misleading:true},
      {text:"A tiny puncture mark is found on Finch's right forearm — initially attributed to a watch strap.",misleading:false},
      {text:"One board member's fountain pen has a retractable nib — and a hollow barrel.",misleading:false},
      {text:"Security footage shows all three suspects within arm's reach of Finch at 10:11am.",misleading:false},
      {text:"A text message on Finch's phone, unsent: 'I know what you did with Series B'.",misleading:false}
    ],
    suspects:[
      {name:'Priya Nambiar',role:'CFO & Board Chair',motive:'The financial model exposed her $4M embezzlement scheme.',alibi:'Was standing at the projector. Confirmed by all.',hidden:'Her pen barrel contains a fast-acting synthetic toxin.'},
      {name:'Otto Kleist',role:'Venture Partner',motive:"Finch's death would collapse the merger blocking Kleist's rival fund.",alibi:'Was seated at the far end of the table.',hidden:'His phone shows research into "ricin analogues" three weeks prior.'},
      {name:'Maya Lund',role:'Legal Counsel',motive:'Finch was about to fire her over leaked IP documents.',alibi:'Stood nearest the door.',hidden:'Has a history of chemistry coursework, unused until now.'}
    ],
    killer:'Priya Nambiar',
    explanation:'Priya Nambiar used a modified fountain pen loaded with a synthetic fast-acting neurotoxin. When she passed Finch a printed addendum at 10:11, she pressed the nib briefly against his forearm. The coffee was clean — deliberate misdirection she planted herself. Slide seven was the motive: it contained her embezzlement, which Finch planned to reveal that morning.'
  },
  {
    id:'003',title:'Room 412',
    location:'The Grandmont Hotel — 4th Floor Suite',
    icon:'🗝️',difficulty:'easy',
    image:null,
    description:'A celebrated novelist is found face-down in a hotel bathtub. The door was chained from inside.',
    story:"Housekeeping forced their way into Room 412 at 11am after guests reported water seeping through the floor below. Millicent Cross — author of twelve acclaimed crime novels — lay in the bath, drowned. The room was pristine: bed unslept, minibar untouched. Yet she had checked in with two companions the night before, and one of them still held a key.",
    clues:[
      {text:"A second key card was demagnetised in the hotel safe — by someone who knew the guest PIN.",misleading:false},
      {text:"Cross's laptop shows a manuscript chapter titled 'How I Would Kill My Editor'.",misleading:true},
      {text:"A single damp towel hangs in the bathroom — not her usual brand.",misleading:false},
      {text:"The chain latch was secured — but the screws show recent re-mounting.",misleading:false},
      {text:"Traces of sleeping medication are found at 4× therapeutic dose in her bloodstream.",misleading:false},
      {text:"A service lift log shows a staff card used at 2:17am accessing the 4th floor.",misleading:false}
    ],
    suspects:[
      {name:'Leon Farris',role:'Literary Agent',motive:'Cross had just signed with a rival agency, costing Farris 18% of $3M in future royalties.',alibi:'Claims he left at midnight. Taxi receipt confirms.',hidden:'His jacket pocket holds a hotel staff card — unnumbered.'},
      {name:'Suki Hayashi',role:'Publicist',motive:"Cross planned to expose Hayashi's fabricated review campaign.",alibi:'Stayed in Room 408 across the hall.',hidden:'She owns a pharmacy, and sleeping pills match her dispensary stock.'},
      {name:'Jonas Wren',role:'Film Rights Producer',motive:'Cross had rejected his film deal — worth $2M — in favour of a streaming platform.',alibi:'Has a confirmed dinner reservation at a restaurant 3km away.',hidden:'The dinner was booked — but he never showed.'}
    ],
    killer:'Leon Farris',
    explanation:"Farris had stolen a staff card earlier that week, using it to access the room at 2:17am. He sedated Cross with medication dissolved in her bedside water, then drowned her in the bath once she was unconscious. He re-secured the chain latch by unscrewing and repositioning the bracket — achievable from outside with a thin tool. His towel was left behind. The manuscript title was a red herring."
  },
  {
    id:'004',title:'The Parking Lot at 3am',
    location:'Silvergate Mall — Level P3, Column 47',
    icon:'🚗',difficulty:'medium',
    image:null,
    description:'A whistleblower is found in her car. Engine running. Garage sealed. Three colleagues had access.',
    story:"Security guard Marcus Peel found the car at 3:11am — a silver sedan idling at Column 47, Level P3, exhaust piped through the driver's window with a length of garden hose. Dana Cho, compliance officer at Silvergate Developments, had been about to submit a report implicating her employer in a $40M planning fraud. Her laptop was missing from the car.",
    clues:[
      {text:"The hose was cut to exact length using industrial shears — not available to the public.",misleading:false},
      {text:"Cho's phone shows nine missed calls from an unknown number between 1am and 2am.",misleading:false},
      {text:"A Silvergate security badge found near the vehicle belongs to a terminated employee.",misleading:true},
      {text:"CCTV blind spot at Column 47 was logged as a known maintenance issue two days prior.",misleading:false},
      {text:"One suspect's vehicle shows a 14-minute trip at 2:40am not accounted for in their statement.",misleading:false},
      {text:"The victim's draft report was emailed to an external recipient at 1:58am — from an unknown device.",misleading:false}
    ],
    suspects:[
      {name:'Harrison Gale',role:'Site Operations Manager',motive:'The fraud report directly named Gale as orchestrator of the planning scheme.',alibi:'Claims he was asleep. No corroboration.',hidden:'His vehicle has industrial shears in the boot.'},
      {name:'Renee Bastow',role:'HR Director',motive:'Was having an affair with the CEO — exposure of fraud would implicate her concealment.',alibi:'Logged in from home on her work laptop. VPN confirmed.',hidden:'The VPN log was spoofed — IT confirmed it can be done remotely.'},
      {name:'Neil Chandra',role:'IT Infrastructure Lead',motive:"Had just been passed over for promotion by Cho's recommendation.",alibi:'Has a key card swipe at the gym at 3am sharp.',hidden:'Gym card readers have a 12-minute clock error — documented but unfixed.'}
    ],
    killer:'Harrison Gale',
    explanation:"Gale tailed Cho to the garage after intercepting her final call using a cloned SIM. He had prior knowledge of the CCTV blind spot — he'd reported it himself two days earlier to ensure cover. Using his own industrial shears, he staged the scene as suicide. The 14-minute unaccounted trip matches the timing exactly."
  }
];
