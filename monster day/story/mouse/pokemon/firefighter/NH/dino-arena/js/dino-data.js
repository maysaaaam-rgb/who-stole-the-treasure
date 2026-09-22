/**
 * DINO ARENA: TOP TRUMPS PALEONTOLOGY CLASH — SELF-CONTAINED CURRICULUM & VECTOR ASSET DATA
 * Primary ESL / CLIL CEFR A1+-A2 | Comparative Adjectives & Adaptations
 * 100% Zero external image dependencies. Multi-layered anatomical SVG artwork with ambient aura.
 * Full 6-Stage Interactive Arcade Lesson.
 */
(function(root) {
  'use strict';

  const DINO_DATA = [
    {
      id: "trex",
      name: "Tyrannosaurus Rex",
      period: "Late Cretaceous",
      diet: "Carnivore",
      dietIcon: "🥩",
      dietColor: "#ef4444",
      lengthM: 12,
      lengthMeters: 12,
      weightKg: 8000,
      speedKmh: 27,
      armorRating: 3,
      weapon: "Bone-Crushing Jaws",
      weaponDesc: "Huge 20cm teeth that can crush bones!",
      teeth: "20cm serrated dagger teeth",
      clue: "I am the 8,000 kg apex predator with 20cm serrated teeth!",
      dietFact: "T-Rex is a carnivore because it has 20cm sharp teeth to hunt prey.",
      fallbackIcon: "🦖",
      pedestalColor: "#ef4444",
      svgArtwork: `
        <svg viewBox="0 0 320 220" class="dino-vector-art" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="trex-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#ef4444" stop-opacity="0.45"/>
              <stop offset="100%" stop-color="#ef4444" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <ellipse cx="160" cy="188" rx="110" ry="18" fill="url(#trex-aura)" />
          <ellipse cx="160" cy="188" rx="80" ry="9" fill="rgba(239, 68, 68, 0.3)" />
          <g fill="#f87171" stroke="#7f1d1d" stroke-width="2.5" stroke-linejoin="round">
            <path d="M 35 142 Q 90 115 145 110 Q 95 140 35 142 Z" fill="#dc2626"/>
            <path d="M 125 110 C 150 90 200 85 220 95 C 235 105 240 135 210 150 C 175 160 140 155 125 110 Z"/>
            <path d="M 140 125 C 160 125 170 150 160 175 L 145 188 L 180 188 L 165 170 C 178 145 155 125 140 125 Z" fill="#b91c1c"/>
            <path d="M 215 128 L 230 136 L 226 142 L 212 134 Z" fill="#fca5a5"/>
            <path d="M 210 95 C 225 70 275 65 300 80 C 305 95 285 105 250 108 L 295 118 C 285 130 250 128 230 118 Z"/>
            <circle cx="265" cy="85" r="4.5" fill="#fef08a" stroke="#000" stroke-width="1.5"/>
            <polygon points="255,108 260,115 265,108" fill="#ffffff" stroke="none"/>
            <polygon points="268,108 273,116 278,108" fill="#ffffff" stroke="none"/>
            <polygon points="280,108 285,115 290,108" fill="#ffffff" stroke="none"/>
          </g>
        </svg>`,
      hotspots: [
        { label: "Diet", text: "Carnivore: Apex hunter with keen binocular vision.", phrase: "T-Rex is a carnivore and eats meat!" },
        { label: "Weapon", text: "Bone-Crushing Jaws with 20cm serrated teeth.", phrase: "T-Rex has twenty-centimeter sharp teeth to crush bones!" },
        { label: "Speed", text: "Runs at 27 km/h across open valleys.", phrase: "T-Rex can run at twenty-seven kilometers per hour!" },
        { label: "Armor", text: "Tough hide rating 3 out of 10.", phrase: "T-Rex relies on pure attack power rather than heavy armor!" }
      ]
    },
    {
      id: "raptor",
      name: "Velociraptor",
      period: "Late Cretaceous",
      diet: "Carnivore",
      dietIcon: "🥩",
      dietColor: "#f97316",
      lengthM: 2,
      lengthMeters: 2,
      weightKg: 15,
      speedKmh: 60,
      armorRating: 1,
      weapon: "Sickle Claws",
      weaponDesc: "Curved foot claws designed for swift jumping attacks!",
      teeth: "Sharp backward-curving teeth & sickle claws",
      clue: "I am a swift 60 km/h runner hunting with curved foot claws!",
      dietFact: "Velociraptor is a carnivore because it hunts meat with sharp sickle claws.",
      fallbackIcon: "🦅",
      pedestalColor: "#f97316",
      svgArtwork: `
        <svg viewBox="0 0 320 220" class="dino-vector-art" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="raptor-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#f97316" stop-opacity="0.45"/>
              <stop offset="100%" stop-color="#f97316" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <ellipse cx="160" cy="188" rx="105" ry="18" fill="url(#raptor-aura)" />
          <ellipse cx="160" cy="188" rx="75" ry="9" fill="rgba(249, 115, 22, 0.3)" />
          <g fill="#fb923c" stroke="#9a3412" stroke-width="2.5" stroke-linejoin="round">
            <path d="M 25 98 Q 110 115 155 125 Q 105 132 25 98 Z" fill="#ea580c"/>
            <path d="M 150 120 C 170 105 205 105 220 120 C 215 140 185 148 150 120 Z"/>
            <path d="M 210 112 C 225 90 250 75 280 80 C 295 85 298 95 272 102 L 290 108 C 280 118 250 116 230 118 Z"/>
            <circle cx="270" cy="86" r="3.5" fill="#fef08a" stroke="#000" stroke-width="1.2"/>
            <path d="M 210 125 L 230 142 L 218 146 L 198 132 Z" fill="#fed7aa"/>
            <path d="M 170 130 C 185 135 192 160 180 185 L 165 188 L 198 188 L 192 170 Z" fill="#ea580c"/>
            <path d="M 190 174 Q 202 164 194 158 Q 186 168 190 174 Z" fill="#ffffff" stroke="#9a3412" stroke-width="1.8"/>
          </g>
        </svg>`,
      hotspots: [
        { label: "Diet", text: "Carnivore: Agile pack hunter targeting small prey.", phrase: "Velociraptor is a swift carnivore!" },
        { label: "Weapon", text: "Retractable sickle claw on each hind foot.", phrase: "Velociraptor has sharp sickle claws for jumping attacks!" },
        { label: "Speed", text: "Sprint speed of 60 km/h.", phrase: "Velociraptor runs at sixty kilometers per hour!" },
        { label: "Armor", text: "Light agile feathers rating 1 out of 10.", phrase: "Velociraptor relies on speed instead of heavy armor!" }
      ]
    },
    {
      id: "triceratops",
      name: "Triceratops",
      period: "Late Cretaceous",
      diet: "Herbivore",
      dietIcon: "🌿",
      dietColor: "#10b981",
      lengthM: 9,
      lengthMeters: 9,
      weightKg: 6000,
      speedKmh: 32,
      armorRating: 8,
      weapon: "Triple Horn Shield",
      weaponDesc: "Three sharp solid horns and a heavy neck frill for protection!",
      teeth: "Beak & scissor-like grinding tooth batteries",
      clue: "I have a massive skull shield and 3 solid ivory horns!",
      dietFact: "Triceratops is a herbivore because it shears tough palm fronds with grinding teeth.",
      fallbackIcon: "🦏",
      pedestalColor: "#10b981",
      svgArtwork: `
        <svg viewBox="0 0 320 220" class="dino-vector-art" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="tri-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.45"/>
              <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <ellipse cx="160" cy="188" rx="110" ry="18" fill="url(#tri-aura)" />
          <ellipse cx="160" cy="188" rx="80" ry="9" fill="rgba(16, 185, 129, 0.3)" />
          <g fill="#34d399" stroke="#065f46" stroke-width="2.5" stroke-linejoin="round">
            <path d="M 45 145 Q 85 130 115 120 Q 90 145 45 145 Z" fill="#059669"/>
            <path d="M 105 115 C 135 90 195 90 220 115 C 225 150 195 165 120 160 Z"/>
            <rect x="110" y="145" width="22" height="42" rx="6" fill="#059669"/>
            <rect x="145" y="148" width="20" height="40" rx="6" fill="#047857"/>
            <rect x="185" y="145" width="22" height="42" rx="6" fill="#059669"/>
            <rect x="210" y="148" width="20" height="40" rx="6" fill="#047857"/>
            <path d="M 210 90 C 205 58 245 52 250 85 C 260 110 230 130 210 90 Z" fill="#10b981"/>
            <path d="M 225 95 C 245 95 272 115 262 135 C 240 145 225 125 225 95 Z"/>
            <polygon points="230,85 280,55 244,90" fill="#ffffff" stroke="#065f46" stroke-width="2"/>
            <polygon points="242,90 286,65 250,96" fill="#ffffff" stroke="#065f46" stroke-width="2"/>
            <polygon points="260,118 288,115 264,125" fill="#ffffff" stroke="#065f46" stroke-width="1.8"/>
          </g>
        </svg>`,
      hotspots: [
        { label: "Diet", text: "Herbivore: Grazes on tough palms and cycad roots.", phrase: "Triceratops is a peaceful herbivore!" },
        { label: "Weapon", text: "Three solid facial horns up to 1 meter long.", phrase: "Triceratops has three hard horns to fight predators!" },
        { label: "Speed", text: "Charges at 32 km/h when threatened.", phrase: "Triceratops charges at thirty-two kilometers per hour!" },
        { label: "Armor", text: "Solid bone frill with rating 8 out of 10.", phrase: "Triceratops has a heavy bone frill to shield its neck!" }
      ]
    },
    {
      id: "brachiosaurus",
      name: "Brachiosaurus",
      period: "Late Jurassic",
      diet: "Herbivore",
      dietIcon: "🌿",
      dietColor: "#06b6d4",
      lengthM: 26,
      lengthMeters: 26,
      weightKg: 40000,
      speedKmh: 15,
      armorRating: 4,
      weapon: "Colossal Stomp",
      weaponDesc: "Gigantic height and tree-trunk legs reaching tallest trees!",
      teeth: "Peg-like chisel teeth for stripping tall trees",
      clue: "I weigh 40,000 kg and can browse leaves 15 meters high!",
      dietFact: "Brachiosaurus is a herbivore because it reaches tall treetops to eat leaves.",
      fallbackIcon: "🦒",
      pedestalColor: "#06b6d4",
      svgArtwork: `
        <svg viewBox="0 0 320 220" class="dino-vector-art" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="brach-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.45"/>
              <stop offset="100%" stop-color="#06b6d4" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <ellipse cx="160" cy="190" rx="115" ry="18" fill="url(#brach-aura)" />
          <ellipse cx="160" cy="190" rx="85" ry="10" fill="rgba(6, 182, 212, 0.3)" />
          <g fill="#38bdf8" stroke="#075985" stroke-width="2.5" stroke-linejoin="round">
            <path d="M 35 150 Q 88 135 120 125 Q 85 152 35 150 Z" fill="#0284c7"/>
            <path d="M 115 120 C 140 110 185 105 205 125 C 200 155 170 165 120 155 Z"/>
            <rect x="120" y="142" width="22" height="46" rx="6" fill="#0284c7"/>
            <rect x="145" y="144" width="20" height="44" rx="6" fill="#0369a1"/>
            <rect x="175" y="138" width="22" height="50" rx="6" fill="#0284c7"/>
            <rect x="195" y="140" width="20" height="48" rx="6" fill="#0369a1"/>
            <path d="M 185 115 C 190 68 215 32 238 28 C 258 28 252 45 230 65 C 215 85 210 115 205 125 Z"/>
            <ellipse cx="245" cy="32" rx="12" ry="7" fill="#38bdf8"/>
            <circle cx="248" cy="30" r="2.2" fill="#0f172a"/>
          </g>
        </svg>`,
      hotspots: [
        { label: "Diet", text: "Herbivore: Consumes 400 kg of treetop leaves daily.", phrase: "Brachiosaurus eats leafy treetops all day!" },
        { label: "Weapon", text: "Massive stomping feet and towering height.", phrase: "Brachiosaurus uses colossal size to deter carnivores!" },
        { label: "Speed", text: "Slow steady pace of 15 km/h.", phrase: "Brachiosaurus walks steadily at fifteen kilometers per hour!" },
        { label: "Armor", text: "Colossal body mass defense rating 4.", phrase: "Brachiosaurus is forty tons of pure living mountain!" }
      ]
    },
    {
      id: "ankylosaurus",
      name: "Ankylosaurus",
      period: "Late Cretaceous",
      diet: "Herbivore",
      dietIcon: "🌿",
      dietColor: "#eab308",
      lengthM: 8,
      lengthMeters: 8,
      weightKg: 6000,
      speedKmh: 10,
      armorRating: 10,
      weapon: "Heavy Tail Club",
      weaponDesc: "Thick bone armor plates and a heavy stone tail club!",
      teeth: "Small leaf-shaped teeth for crushing low ferns",
      clue: "I am a living battle tank with bone plates and a heavy tail club!",
      dietFact: "Ankylosaurus is a herbivore because it feeds on low forest ferns and shrub roots.",
      fallbackIcon: "🛡️",
      pedestalColor: "#eab308",
      svgArtwork: `
        <svg viewBox="0 0 320 220" class="dino-vector-art" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="ank-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#eab308" stop-opacity="0.45"/>
              <stop offset="100%" stop-color="#eab308" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <ellipse cx="160" cy="188" rx="105" ry="18" fill="url(#ank-aura)" />
          <ellipse cx="160" cy="188" rx="78" ry="9" fill="rgba(234, 179, 8, 0.3)" />
          <g fill="#facc15" stroke="#713f12" stroke-width="2.5" stroke-linejoin="round">
            <path d="M 60 145 L 115 135 L 115 145 Z" fill="#ca8a04"/>
            <ellipse cx="55" cy="144" rx="16" ry="11" fill="#fef08a" stroke="#713f12" stroke-width="2.5"/>
            <path d="M 110 142 C 120 105 210 105 235 142 C 220 160 130 160 110 142 Z"/>
            <rect x="120" y="150" width="22" height="36" rx="6" fill="#ca8a04"/>
            <rect x="150" y="152" width="20" height="34" rx="6" fill="#a16207"/>
            <rect x="185" y="150" width="22" height="36" rx="6" fill="#ca8a04"/>
            <rect x="210" y="152" width="20" height="34" rx="6" fill="#a16207"/>
            <polygon points="135,108 145,94 155,108" fill="#ffffff" stroke="#713f12" stroke-width="2"/>
            <polygon points="165,105 175,90 185,105" fill="#ffffff" stroke="#713f12" stroke-width="2"/>
            <polygon points="195,108 205,94 215,108" fill="#ffffff" stroke="#713f12" stroke-width="2"/>
            <path d="M 230 132 C 245 125 268 130 262 148 C 240 155 230 145 230 132 Z"/>
            <polygon points="238,126 252,118 245,132" fill="#ffffff" stroke="#713f12" stroke-width="1.8"/>
          </g>
        </svg>`,
      hotspots: [
        { label: "Diet", text: "Herbivore: Low-browser feeding on ferns and roots.", phrase: "Ankylosaurus feeds on low ferns and shrubs!" },
        { label: "Weapon", text: "Massive solid bone club on its tail.", phrase: "Ankylosaurus has a heavy tail club to shatter enemy bones!" },
        { label: "Speed", text: "Slow moving tank at 10 km/h.", phrase: "Ankylosaurus marches slowly at ten kilometers per hour!" },
        { label: "Armor", text: "Impenetrable fused bone armor rating 10/10.", phrase: "Ankylosaurus has maximum bone armor plates!" }
      ]
    },
    {
      id: "stegosaurus",
      name: "Stegosaurus",
      period: "Late Jurassic",
      diet: "Herbivore",
      dietIcon: "🌿",
      dietColor: "#10b981",
      lengthM: 9,
      lengthMeters: 9,
      weightKg: 5000,
      speedKmh: 18,
      armorRating: 7,
      weapon: "Spiked Thagomizer",
      weaponDesc: "Four sharp tail spikes and dorsal plates along its spine!",
      teeth: "Small triangular teeth for grinding soft plants",
      clue: "I have vertical kite plates along my spine and 4 sharp tail spikes!",
      dietFact: "Stegosaurus is a herbivore because it eats soft ground mosses and low shrubs.",
      fallbackIcon: "🐊",
      pedestalColor: "#10b981",
      svgArtwork: `
        <svg viewBox="0 0 320 220" class="dino-vector-art" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="steg-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.45"/>
              <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <ellipse cx="160" cy="188" rx="105" ry="18" fill="url(#steg-aura)" />
          <ellipse cx="160" cy="188" rx="78" ry="9" fill="rgba(16, 185, 129, 0.3)" />
          <g fill="#4ade80" stroke="#14532d" stroke-width="2.5" stroke-linejoin="round">
            <path d="M 45 135 Q 90 135 120 132 Q 90 145 45 135 Z" fill="#16a34a"/>
            <line x1="52" y1="135" x2="35" y2="118" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="58" y1="135" x2="44" y2="112" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="55" y1="137" x2="38" y2="152" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="62" y1="138" x2="48" y2="158" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M 115 130 C 130 95 195 95 220 130 C 210 155 135 158 115 130 Z"/>
            <rect x="120" y="145" width="20" height="40" rx="6" fill="#16a34a"/>
            <rect x="145" y="148" width="18" height="37" rx="6" fill="#15803d"/>
            <rect x="185" y="145" width="20" height="40" rx="6" fill="#16a34a"/>
            <rect x="205" y="148" width="18" height="37" rx="6" fill="#15803d"/>
            <polygon points="125,108 135,70 145,105" fill="#facc15" stroke="#713f12" stroke-width="2.2"/>
            <polygon points="150,98 162,60 174,96" fill="#facc15" stroke="#713f12" stroke-width="2.2"/>
            <polygon points="178,100 190,64 202,98" fill="#facc15" stroke="#713f12" stroke-width="2.2"/>
            <polygon points="205,110 216,80 225,112" fill="#facc15" stroke="#713f12" stroke-width="2.2"/>
            <path d="M 220 130 C 235 135 258 145 252 155 C 235 158 220 148 220 130 Z"/>
          </g>
        </svg>`,
      hotspots: [
        { label: "Diet", text: "Herbivore: Grazes on ground ferns, mosses, and horsetails.", phrase: "Stegosaurus eats low Jurassic ferns!" },
        { label: "Weapon", text: "Four 60-centimeter tail spikes called the Thagomizer.", phrase: "Stegosaurus swings four sharp tail spikes!" },
        { label: "Speed", text: "Trots at 18 km/h.", phrase: "Stegosaurus moves at eighteen kilometers per hour!" },
        { label: "Armor", text: "17 upright bony back plates rating 7.", phrase: "Stegosaurus has seventeen upright bony plates for protection!" }
      ]
    }
  ];

  // Set svg alias for backward compatibility
  DINO_DATA.forEach(d => {
    d.svg = d.svgArtwork;
  });

  // Stage 1: Mystery Silhouette & Roar Guessing Game
  const MYSTERY_ROUNDS = [
    {
      id: "mystery-1",
      dinoId: "triceratops",
      title: "Prehistoric Beast #1",
      clues: [
        { icon: "🌿", label: "Diet", text: "Herbivore (Plant-Eater)" },
        { icon: "⚖️", label: "Weight", text: "6,000 kg (6 metric tons)" },
        { icon: "🛡️", label: "Weapon", text: "3 facial horns & solid bone skull frill" }
      ],
      options: ["triceratops", "trex", "raptor", "ankylosaurus"],
      soundHint: "Heavy stomps echo in the dense palm forest..."
    },
    {
      id: "mystery-2",
      dinoId: "trex",
      title: "Prehistoric Beast #2",
      clues: [
        { icon: "🥩", label: "Diet", text: "Apex Carnivore (Meat-Eater)" },
        { icon: "⚡", label: "Speed", text: "27 km/h sprint speed" },
        { icon: "🦷", label: "Weapon", text: "Huge jaws with 20cm bone-crushing teeth" }
      ],
      options: ["trex", "stegosaurus", "brachiosaurus", "raptor"],
      soundHint: "A deafening, earth-shaking roar vibrates through the canyon!"
    },
    {
      id: "mystery-3",
      dinoId: "raptor",
      title: "Prehistoric Beast #3",
      clues: [
        { icon: "🥩", label: "Diet", text: "Fast Pack-Hunting Carnivore" },
        { icon: "⚡", label: "Speed", text: "Lightning fast: 60 km/h sprint" },
        { icon: "🦅", label: "Weapon", text: "Feathered body & sharp sickle foot claws" }
      ],
      options: ["raptor", "triceratops", "stegosaurus", "brachiosaurus"],
      soundHint: "Rapid, agile claw clicks tap against the rocky ground..."
    },
    {
      id: "mystery-4",
      dinoId: "brachiosaurus",
      title: "Prehistoric Beast #4",
      clues: [
        { icon: "🌿", label: "Diet", text: "Towering Herbivore (Eats tall cycads)" },
        { icon: "⚖️", label: "Weight", text: "Colossal mass: 40,000 kg (Living Mountain)" },
        { icon: "🦒", label: "Height", text: "13-meter neck reaching the highest trees" }
      ],
      options: ["brachiosaurus", "ankylosaurus", "trex", "stegosaurus"],
      soundHint: "Tremendous, slow vibrations shake ancient tree trunks..."
    },
    {
      id: "mystery-5",
      dinoId: "ankylosaurus",
      title: "Prehistoric Beast #5",
      clues: [
        { icon: "🌿", label: "Diet", text: "Low-Browsing Herbivore (Fern-Eater)" },
        { icon: "🛡️", label: "Armor", text: "Impenetrable fused armor plates (Rating 10/10)" },
        { icon: "🔨", label: "Weapon", text: "Massive solid-bone club on its tail" }
      ],
      options: ["ankylosaurus", "raptor", "trex", "triceratops"],
      soundHint: "A heavy metallic-sounding armored scrape in the underbrush..."
    },
    {
      id: "mystery-6",
      dinoId: "stegosaurus",
      title: "Prehistoric Beast #6",
      clues: [
        { icon: "🌿", label: "Diet", text: "Jurassic Ground Herbivore" },
        { icon: "⚖️", label: "Weight", text: "5,000 kg with walnut-sized brain" },
        { icon: "🗡️", label: "Weapon", text: "17 upright back plates & 4 sharp tail spikes" }
      ],
      options: ["stegosaurus", "brachiosaurus", "raptor", "ankylosaurus"],
      soundHint: "Tail spikes swish swiftly through ancient ferns..."
    }
  ];

  // Stage 3: The Comparative Adjective Balance Gym
  const GRAMMAR_GYM_ROUNDS = [
    {
      id: "gym-1",
      dinoA: "brachiosaurus",
      dinoB: "stegosaurus",
      statLabel: "WEIGHT",
      statA: "40,000 kg",
      statB: "5,000 kg",
      tilt: "left",
      formulaTokens: ["Brachiosaurus", "is heavier than", "Stegosaurus", "."],
      distractors: ["lighter than", "fast"],
      voiceText: "Brachiosaurus is heavier than Stegosaurus."
    },
    {
      id: "gym-2",
      dinoA: "raptor",
      dinoB: "trex",
      statLabel: "SPEED",
      statA: "60 km/h",
      statB: "27 km/h",
      tilt: "left",
      formulaTokens: ["Velociraptor", "is faster than", "Tyrannosaurus Rex", "."],
      distractors: ["slower than", "heavy"],
      voiceText: "Velociraptor is faster than Tyrannosaurus Rex."
    },
    {
      id: "gym-3",
      dinoA: "brachiosaurus",
      dinoB: "triceratops",
      statLabel: "LENGTH",
      statA: "26 m",
      statB: "9 m",
      tilt: "left",
      formulaTokens: ["Brachiosaurus", "is longer than", "Triceratops", "."],
      distractors: ["shorter than", "sharp"],
      voiceText: "Brachiosaurus is longer than Triceratops."
    },
    {
      id: "gym-4",
      dinoA: "ankylosaurus",
      dinoB: "trex",
      statLabel: "ARMOR",
      statA: "Armor 10",
      statB: "Armor 3",
      tilt: "left",
      formulaTokens: ["Ankylosaurus", "has stronger armor than", "Tyrannosaurus Rex", "."],
      distractors: ["weaker than", "quick"],
      voiceText: "Ankylosaurus has stronger armor than Tyrannosaurus Rex."
    },
    {
      id: "gym-5",
      dinoA: "trex",
      dinoB: "raptor",
      statLabel: "SIZE",
      statA: "12 m / 8,000 kg",
      statB: "2 m / 15 kg",
      tilt: "left",
      formulaTokens: ["Tyrannosaurus Rex", "is bigger than", "Velociraptor", "."],
      distractors: ["smaller than", "plates"],
      voiceText: "Tyrannosaurus Rex is bigger than Velociraptor."
    }
  ];

  // Stage 4: Dino Clash 1v1 Battle Rounds
  const BATTLE_ROUNDS = [
    {
      id: "clash-1",
      dino1: "raptor",
      dino2: "trex",
      statKey: "speedKmh",
      question: "Who is FASTER?",
      stampText: "FASTER!",
      winnerId: "raptor",
      comparativeFrame: "Velociraptor is faster than Tyrannosaurus Rex!",
      statComparison: "Velociraptor (60 km/h) vs T-Rex (27 km/h)"
    },
    {
      id: "clash-2",
      dino1: "brachiosaurus",
      dino2: "stegosaurus",
      statKey: "weightKg",
      question: "Who is HEAVIER?",
      stampText: "HEAVIER!",
      winnerId: "brachiosaurus",
      comparativeFrame: "Brachiosaurus is heavier than Stegosaurus!",
      statComparison: "Brachiosaurus (40,000 kg) vs Stegosaurus (5,000 kg)"
    },
    {
      id: "clash-3",
      dino1: "ankylosaurus",
      dino2: "trex",
      statKey: "armorRating",
      question: "Who has STRONGER ARMOR?",
      stampText: "STRONGER ARMOR!",
      winnerId: "ankylosaurus",
      comparativeFrame: "Ankylosaurus has stronger armor than Tyrannosaurus Rex!",
      statComparison: "Ankylosaurus (Armor 10) vs T-Rex (Armor 3)"
    },
    {
      id: "clash-4",
      dino1: "brachiosaurus",
      dino2: "triceratops",
      statKey: "lengthMeters",
      question: "Who is LONGER?",
      stampText: "LONGER!",
      winnerId: "brachiosaurus",
      comparativeFrame: "Brachiosaurus is longer than Triceratops!",
      statComparison: "Brachiosaurus (26 m) vs Triceratops (9 m)"
    },
    {
      id: "clash-5",
      dino1: "triceratops",
      dino2: "raptor",
      statKey: "weightKg",
      question: "Who is HEAVIER?",
      stampText: "HEAVIER!",
      winnerId: "triceratops",
      comparativeFrame: "Triceratops is heavier than Velociraptor!",
      statComparison: "Triceratops (6,000 kg) vs Velociraptor (15 kg)"
    },
    {
      id: "clash-6",
      dino1: "stegosaurus",
      dino2: "ankylosaurus",
      statKey: "speedKmh",
      question: "Who is FASTER?",
      stampText: "FASTER!",
      winnerId: "stegosaurus",
      comparativeFrame: "Stegosaurus is faster than Ankylosaurus!",
      statComparison: "Stegosaurus (18 km/h) vs Ankylosaurus (10 km/h)"
    },
    {
      id: "clash-7",
      dino1: "triceratops",
      dino2: "trex",
      statKey: "armorRating",
      question: "Who has STRONGER ARMOR?",
      stampText: "STRONGER ARMOR!",
      winnerId: "triceratops",
      comparativeFrame: "Triceratops has stronger armor than Tyrannosaurus Rex!",
      statComparison: "Triceratops (Armor 8) vs T-Rex (Armor 3)"
    },
    {
      id: "clash-8",
      dino1: "trex",
      dino2: "raptor",
      statKey: "lengthMeters",
      question: "Who is BIGGER & LONGER?",
      stampText: "BIGGER!",
      winnerId: "trex",
      comparativeFrame: "Tyrannosaurus Rex is bigger than Velociraptor!",
      statComparison: "T-Rex (12 m) vs Velociraptor (2 m)"
    }
  ];

  // Stage 5: Teleprompter Broadcast Templates (One per dinosaur)
  const TELEPROMPTER_ARCHETYPES = [
    {
      dinoId: "trex",
      title: "Apex Predator Arena Broadcast",
      sentence1: "Welcome to Dino Arena! This is the mighty Tyrannosaurus Rex.",
      sentence2: "It is bigger and heavier than the agile Velociraptor.",
      sentence3: "It is an apex carnivore and it uses its bone-crushing jaws to hunt!"
    },
    {
      dinoId: "raptor",
      title: "Lightning Striker Broadcast",
      sentence1: "Welcome to Dino Arena! This is the swift Velociraptor.",
      sentence2: "It is much faster than the giant Tyrannosaurus Rex.",
      sentence3: "It is an agile carnivore and it uses its sickle claws to hunt in packs!"
    },
    {
      dinoId: "triceratops",
      title: "Horned Defender Broadcast",
      sentence1: "Welcome to Dino Arena! This is the armored Triceratops.",
      sentence2: "It has stronger armor than the fearsome Tyrannosaurus Rex.",
      sentence3: "It is a peaceful herbivore and it uses its triple horns to defend its family!"
    },
    {
      dinoId: "brachiosaurus",
      title: "Colossal Titan Broadcast",
      sentence1: "Welcome to Dino Arena! This is the towering Brachiosaurus.",
      sentence2: "It is heavier and longer than all other prehistoric creatures.",
      sentence3: "It is a gentle herbivore and it uses its tall neck to reach high tree leaves!"
    },
    {
      dinoId: "ankylosaurus",
      title: "Living Tank Broadcast",
      sentence1: "Welcome to Dino Arena! This is the impenetrable Ankylosaurus.",
      sentence2: "It has stronger armor than any carnivore in the Cretaceous valley.",
      sentence3: "It is a tough herbivore and it uses its heavy tail club to shatter enemy attacks!"
    },
    {
      dinoId: "stegosaurus",
      title: "Spike-Tailed Guardian Broadcast",
      sentence1: "Welcome to Dino Arena! This is the iconic Stegosaurus.",
      sentence2: "It is faster and lighter than the armored Ankylosaurus.",
      sentence3: "It is a Jurassic herbivore and it uses its sharp tail spikes to protect itself!"
    }
  ];

  // Stage 6: Exit Ticket Rapid Diagnostic Quiz
  const EXIT_QUIZ_QUESTIONS = [
    {
      id: "quiz-1",
      question: "Which comparative adjective correctly finishes the sentence?\n'Velociraptor is _______ than Tyrannosaurus Rex.'",
      options: [
        { text: "faster", isCorrect: true },
        { text: "fastest", isCorrect: false },
        { text: "more fast", isCorrect: false },
        { text: "fast", isCorrect: false }
      ],
      explanation: "Add '-er than' for one-syllable adjectives: fast ➔ faster than!"
    },
    {
      id: "quiz-2",
      question: "Why is Tyrannosaurus Rex classified as a CARNIVORE?",
      options: [
        { text: "It has 20cm sharp dagger teeth to hunt meat", isCorrect: true },
        { text: "It eats leaves from the tallest Jurassic trees", isCorrect: false },
        { text: "It has a solid bone club on its tail", isCorrect: false },
        { text: "It only grazes on soft forest ferns", isCorrect: false }
      ],
      explanation: "Carnivores eat meat and evolve sharp cutting or bone-crushing teeth!"
    },
    {
      id: "quiz-3",
      question: "How does Triceratops use its physiological adaptations?",
      options: [
        { text: "It has 3 hard horns and a bone frill to defend against predators", isCorrect: true },
        { text: "It has feathered wings to fly away across canyons", isCorrect: false },
        { text: "It has a venomous bite to capture small prey", isCorrect: false },
        { text: "It swims deep underwater to escape enemies", isCorrect: false }
      ],
      explanation: "Herbivores evolve defensive horns, frills, armor, or clubs for protection!"
    }
  ];

  root.DINO_ARENA_DATA = {
    dinosaurs: DINO_DATA,
    mysteryRounds: MYSTERY_ROUNDS,
    grammarGymRounds: GRAMMAR_GYM_ROUNDS,
    battles: BATTLE_ROUNDS,
    teleprompter: TELEPROMPTER_ARCHETYPES,
    exitQuiz: EXIT_QUIZ_QUESTIONS
  };
})(typeof window !== 'undefined' ? window : global);
