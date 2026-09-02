/**
 * POKÉMON TRAINER BATTLE - CREATURE SYNTHESIS ENGINE
 * Procedural original Pokémon generation that creates visually distinct,
 * animated, child-friendly original creatures based on:
 * - SIZE (tiny, small, big, huge)
 * - PERSONALITY (cute, scary, friendly, funny, brave)
 * - POWER (fast, slow, strong, weak)
 * - TWO ABILITIES (fly, swim, jump, climb, dig, run fast, make fire, make ice, make electricity, become invisible, change colour, see in the dark)
 */

class CreatureEngine {
  constructor() {}

  // Determine the best creature archetype based on selected attributes
  determineArchetype(config) {
    const abilities = config.abilities || [];
    const size = config.size || 'big';
    const personality = config.personality || 'brave';
    const power = config.power || 'strong';

    const has = (ab) => abilities.includes(ab);

    if (has('make fire') && (size === 'huge' || size === 'big' || power === 'strong' || has('fly'))) {
      return 'pyro_dragon';
    }
    if (has('make electricity') || (power === 'fast' && (has('run fast') || personality === 'brave'))) {
      return 'volt_fox';
    }
    if (has('swim') || has('make ice')) {
      if (power === 'slow' || size === 'big' || size === 'huge' || personality === 'friendly') {
        return 'frost_turtle';
      }
      return 'glacier_wolf';
    }
    if (has('fly')) {
      if (size === 'tiny' || personality === 'cute') {
        return 'lumi_flutter';
      }
      return 'sky_falcon';
    }
    if (has('become invisible') || has('see in the dark') || personality === 'scary') {
      return 'shadow_wisp';
    }
    if (has('change colour') || personality === 'funny') {
      return 'kaleido_cham';
    }
    if (has('dig') || ((size === 'huge' || size === 'big') && power === 'strong')) {
      return 'magma_golem';
    }
    if (has('jump') || has('climb') || size === 'tiny' || personality === 'cute') {
      return 'flora_hopper';
    }

    // Default archetypes based on size
    if (size === 'huge' || size === 'big') return 'pyro_dragon';
    if (size === 'tiny' || size === 'small') return 'volt_fox';
    return 'glacier_wolf';
  }

  // Generate an evocative name
  generateName(config, archetype) {
    const prefixes = {
      'pyro_dragon': ['Pyro', 'Draco', 'Ignis', 'Blaze', 'Volcano'],
      'volt_fox': ['Volt', 'Spark', 'Zap', 'Flash', 'Thunder'],
      'frost_turtle': ['Aqua', 'Shell', 'Glacio', 'Tide', 'Frosty'],
      'sky_falcon': ['Zephyr', 'Aero', 'Gale', 'Sky', 'Wing'],
      'shadow_wisp': ['Spectro', 'Shadow', 'Phantom', 'Gloom', 'Night'],
      'magma_golem': ['Terra', 'Boulder', 'Magma', 'Titan', 'Crag'],
      'flora_hopper': ['Flora', 'Sprout', 'Leafy', 'Bloom', 'Hop'],
      'glacier_wolf': ['Blizzard', 'Frost', 'Arctic', 'Howler', 'Crystal'],
      'kaleido_cham': ['Kaleido', 'Prism', 'Chameleo', 'Rainbow', 'Hue'],
      'lumi_flutter': ['Lumi', 'Glow', 'Pixie', 'Flutter', 'Star']
    };

    const suffixes = {
      'huge': ['goliath', 'saurus', 'titan', 'don', 'roar'],
      'tiny': ['mite', 'ling', 'pip', 'tiny', 'kin'],
      'fast': ['swift', 'dash', 'strike', 'wind', 'bolt'],
      'strong': ['smash', 'claw', 'jaw', 'fist', 'power'],
      'cute': ['puff', 'bell', 'paw', 'heart', 'boo'],
      'scary': ['fang', 'shade', 'scare', 'bane', 'reaper'],
      'funny': ['wobble', 'jinx', 'goof', 'bounce', 'wiggle'],
      'brave': ['heart', 'valor', 'guard', 'crest', 'blade']
    };

    const prefixList = prefixes[archetype] || ['Nova', 'Apex', 'Star'];
    const prefix = prefixList[Math.floor(Math.random() * prefixList.length)];

    const trait = config.personality || config.power || 'brave';
    const suffixList = suffixes[trait] || suffixes['strong'];
    const suffix = suffixList[Math.floor(Math.random() * suffixList.length)];

    return `${prefix}${suffix.charAt(0).toUpperCase() + suffix.slice(1)}`;
  }

  // Generate complete creature data object including SVG rendering
  create(config, trainerName = "Trainer") {
    const archetype = this.determineArchetype(config);
    const name = this.generateName(config, archetype);
    const sizeScale = { 'tiny': 0.65, 'small': 0.82, 'big': 1.05, 'huge': 1.28 }[config.size] || 1.0;

    const svgMarkup = this.renderSVG(archetype, config);

    return {
      trainer: trainerName,
      name: name,
      archetype: archetype,
      size: config.size,
      scale: sizeScale,
      personality: config.personality,
      power: config.power,
      abilities: config.abilities || [],
      hp: 100,
      maxHp: 100,
      points: 0,
      svg: svgMarkup
    };
  }

  // Render the tailored SVG creature based on archetype & choices
  renderSVG(archetype, config) {
    const { size, personality, power, abilities } = config;
    const has = (ab) => (abilities || []).includes(ab);

    // Dynamic aura filter & effects
    const isFire = has('make fire');
    const isElectric = has('make electricity');
    const isIce = has('make ice');
    const isWater = has('swim');
    const isFly = has('fly');
    const isInvisible = has('become invisible');
    const isRainbow = has('change colour');
    const isDark = has('see in the dark');
    const isDig = has('dig');

    let auraClass = '';
    if (isFire) auraClass += ' aura-fire';
    if (isElectric) auraClass += ' aura-electric';
    if (isIce) auraClass += ' aura-ice';
    if (isWater) auraClass += ' aura-water';
    if (isInvisible) auraClass += ' aura-invisible';
    if (isRainbow) auraClass += ' aura-rainbow';

    // Build specific archetype body
    let bodyContent = '';

    switch (archetype) {
      case 'pyro_dragon':
        bodyContent = `
          <!-- Pyro Dragon Beast -->
          <defs>
            <radialGradient id="dragonSkin" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#fb923c"/>
              <stop offset="60%" stop-color="#ea580c"/>
              <stop offset="100%" stop-color="#9a3412"/>
            </radialGradient>
            <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a"/>
              <stop offset="50%" stop-color="#f97316"/>
              <stop offset="100%" stop-color="#b91c1c"/>
            </linearGradient>
            <linearGradient id="bellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#fef08a"/>
              <stop offset="100%" stop-color="#facc15"/>
            </linearGradient>
          </defs>

          <!-- Shadow -->
          <ellipse cx="200" cy="370" rx="140" ry="25" fill="#000000" opacity="0.3"/>

          <!-- Flaming Tail with Fire Tip -->
          <path d="M 120 310 C 60 320, 20 280, 25 210 C 28 170, 70 160, 60 140" fill="none" stroke="url(#dragonSkin)" stroke-width="32" stroke-linecap="round"/>
          <g transform="translate(45, 110)">
            <path d="M 15 50 Q 5 20 25 0 Q 40 25 30 50 Z" fill="#ef4444"/>
            <path d="M 18 45 Q 12 25 25 10 Q 34 25 26 45 Z" fill="#facc15"/>
          </g>

          <!-- Back Wing -->
          <path d="M 140 200 C 100 80, 40 60, 10 75 C 30 110, 40 140, 90 220 Z" fill="url(#wingGrad)" stroke="#c2410c" stroke-width="3"/>

          <!-- Dragon Body -->
          <ellipse cx="200" cy="270" rx="75" ry="90" fill="url(#dragonSkin)"/>
          <!-- Belly Plates -->
          <path d="M 170 230 C 185 220, 215 220, 230 230 C 235 280, 225 330, 200 340 C 175 330, 165 280, 170 230 Z" fill="url(#bellyGrad)"/>
          <line x1="172" y1="260" x2="228" y2="260" stroke="#ca8a04" stroke-width="3"/>
          <line x1="175" y1="290" x2="225" y2="290" stroke="#ca8a04" stroke-width="3"/>

          <!-- Front Wing (Dynamic & Fiery) -->
          <path d="M 230 210 C 290 90, 360 70, 390 90 C 370 140, 340 180, 260 250 Z" fill="url(#wingGrad)" stroke="#c2410c" stroke-width="4"/>
          <path d="M 230 210 L 360 80 L 320 170 L 260 240" fill="none" stroke="#7c2d12" stroke-width="4"/>

          <!-- Dragon Legs & Claws -->
          <path d="M 150 320 L 140 370 L 170 370" stroke="url(#dragonSkin)" stroke-width="26" stroke-linecap="round" fill="none"/>
          <path d="M 240 320 L 250 370 L 280 370" stroke="url(#dragonSkin)" stroke-width="26" stroke-linecap="round" fill="none"/>
          <!-- Sharp White Claws -->
          <polygon points="130,370 140,360 145,370" fill="#ffffff"/>
          <polygon points="150,375 160,360 165,375" fill="#ffffff"/>
          <polygon points="260,375 270,360 275,375" fill="#ffffff"/>
          <polygon points="280,370 290,360 295,370" fill="#ffffff"/>

          <!-- Neck & Dragon Head -->
          <path d="M 180 220 C 180 160, 210 140, 220 110 L 255 125 C 245 160, 230 190, 225 220 Z" fill="url(#dragonSkin)"/>
          <path d="M 190 120 C 190 70, 260 60, 290 90 C 300 130, 270 150, 220 145 Z" fill="url(#dragonSkin)"/>

          <!-- Dragon Horns -->
          <path d="M 220 80 Q 200 30 175 40 Q 205 65 215 85 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
          <path d="M 250 75 Q 260 25 285 30 Q 265 60 255 80 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>

          <!-- Eye (${personality}) -->
          ${this.renderEye(personality, 245, 95)}

          <!-- Snout & Flame Smoke -->
          <polygon points="290,105 280,120 300,125" fill="#ca8a04"/>
          <path d="M 275 125 Q 285 135 295 125" stroke="#7c2d12" stroke-width="3" fill="none"/>
          <!-- Sparkles/Embers -->
          <circle cx="315" cy="110" r="4" fill="#facc15"/>
          <circle cx="330" cy="95" r="3" fill="#f97316"/>
        `;
        break;

      case 'volt_fox':
        bodyContent = `
          <!-- Thunder Electric Fox -->
          <defs>
            <linearGradient id="foxGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a"/>
              <stop offset="50%" stop-color="#facc15"/>
              <stop offset="100%" stop-color="#eab308"/>
            </linearGradient>
            <linearGradient id="earBlue" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#38bdf8"/>
              <stop offset="100%" stop-color="#0284c7"/>
            </linearGradient>
          </defs>

          <!-- Shadow -->
          <ellipse cx="200" cy="360" rx="120" ry="20" fill="#000000" opacity="0.3"/>

          <!-- Giant Lightning Bolt Tail -->
          <polygon points="120,290 80,240 105,235 60,160 100,165 40,70 110,130 85,140 135,210 105,215 150,290" fill="#facc15" stroke="#ca8a04" stroke-width="4"/>

          <!-- Fox Body -->
          <ellipse cx="200" cy="270" rx="60" ry="75" fill="url(#foxGold)"/>
          <ellipse cx="200" cy="275" rx="38" ry="50" fill="#ffffff" opacity="0.85"/>

          <!-- Fox Legs (Agile runner) -->
          <path d="M 160 300 L 150 360 L 135 365" stroke="#eab308" stroke-width="18" stroke-linecap="round" fill="none"/>
          <path d="M 235 300 L 245 360 L 260 365" stroke="#eab308" stroke-width="18" stroke-linecap="round" fill="none"/>

          <!-- Big Spiky Fox Ears -->
          <polygon points="150,150 120,50 170,110" fill="url(#foxGold)" stroke="#ca8a04" stroke-width="3"/>
          <polygon points="145,130 130,70 160,110" fill="url(#earBlue)"/>
          <polygon points="230,150 260,50 210,110" fill="url(#foxGold)" stroke="#ca8a04" stroke-width="3"/>
          <polygon points="235,130 250,70 220,110" fill="url(#earBlue)"/>

          <!-- Head -->
          <ellipse cx="190" cy="180" rx="55" ry="48" fill="url(#foxGold)"/>
          <path d="M 140 190 L 120 200 L 145 210 Z" fill="url(#foxGold)"/>
          <path d="M 240 190 L 260 200 L 235 210 Z" fill="url(#foxGold)"/>

          <!-- Electric Cheek Pouches -->
          <circle cx="150" cy="205" r="14" fill="#38bdf8"/>
          <circle cx="230" cy="205" r="14" fill="#38bdf8"/>

          <!-- Eye (${personality}) -->
          ${this.renderEye(personality, 190, 175, 45)}

          <!-- Nose & Smile -->
          <polygon points="190,195 185,190 195,190" fill="#0f172a"/>
          <path d="M 183 202 Q 190 210 197 202" stroke="#0f172a" stroke-width="3" fill="none"/>

          <!-- Electric Sparks Around -->
          <polygon points="270,140 280,120 273,123 285,100 275,115 282,112" fill="#fef08a" stroke="#ca8a04"/>
          <polygon points="110,140 100,120 107,123 95,100 105,115 98,112" fill="#fef08a" stroke="#ca8a04"/>
        `;
        break;

      case 'frost_turtle':
        bodyContent = `
          <!-- Frost/Water Armored Turtle -->
          <defs>
            <radialGradient id="shellGrad" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#67e8f9"/>
              <stop offset="60%" stop-color="#0284c7"/>
              <stop offset="100%" stop-color="#0f172a"/>
            </radialGradient>
            <linearGradient id="turtleSkin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#a7f3d0"/>
              <stop offset="100%" stop-color="#10b981"/>
            </linearGradient>
          </defs>

          <!-- Shadow -->
          <ellipse cx="200" cy="360" rx="140" ry="25" fill="#000000" opacity="0.3"/>

          <!-- Ice Crystal Spikes on Shell -->
          <polygon points="150,150 140,90 165,130" fill="#cffafe" stroke="#0284c7" stroke-width="2"/>
          <polygon points="200,130 200,60 215,120" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
          <polygon points="250,150 260,90 235,130" fill="#cffafe" stroke="#0284c7" stroke-width="2"/>

          <!-- Massive Armored Shell -->
          <ellipse cx="200" cy="250" rx="95" ry="90" fill="url(#shellGrad)" stroke="#38bdf8" stroke-width="6"/>
          <!-- Hexagonal Shell Patterns -->
          <polygon points="200,190 235,210 235,250 200,270 165,250 165,210" fill="none" stroke="#e0f2fe" stroke-width="4"/>
          <line x1="200" y1="190" x2="200" y2="160" stroke="#e0f2fe" stroke-width="3"/>
          <line x1="235" y1="210" x2="270" y2="190" stroke="#e0f2fe" stroke-width="3"/>
          <line x1="235" y1="250" x2="270" y2="270" stroke="#e0f2fe" stroke-width="3"/>
          <line x1="200" y1="270" x2="200" y2="310" stroke="#e0f2fe" stroke-width="3"/>
          <line x1="165" y1="250" x2="130" y2="270" stroke="#e0f2fe" stroke-width="3"/>
          <line x1="165" y1="210" x2="130" y2="190" stroke="#e0f2fe" stroke-width="3"/>

          <!-- Heavy Flippers / Claws -->
          <path d="M 120 280 C 70 300, 70 350, 110 360 C 130 350, 140 330, 135 290 Z" fill="url(#turtleSkin)"/>
          <path d="M 280 280 C 330 300, 330 350, 290 360 C 270 350, 260 330, 265 290 Z" fill="url(#turtleSkin)"/>

          <!-- Head with Frost Horn -->
          <ellipse cx="200" cy="180" rx="42" ry="38" fill="url(#turtleSkin)"/>
          <circle cx="200" cy="140" r="14" fill="#38bdf8" stroke="#ffffff" stroke-width="2"/> <!-- forehead gem -->

          <!-- Eye (${personality}) -->
          ${this.renderEye(personality, 200, 175, 40)}

          <!-- Water Bubble Shield Overlay -->
          <circle cx="200" cy="240" r="115" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="10,10" opacity="0.6"/>
          <circle cx="120" cy="170" r="12" fill="#e0f2fe" opacity="0.7"/>
          <circle cx="280" cy="160" r="8" fill="#e0f2fe" opacity="0.7"/>
        `;
        break;

      case 'shadow_wisp':
        bodyContent = `
          <!-- Shadow / Invisible Phantom Spirit -->
          <defs>
            <radialGradient id="ghostDark" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#c084fc"/>
              <stop offset="60%" stop-color="#6b21a8"/>
              <stop offset="100%" stop-color="#1e1b4b"/>
            </radialGradient>
          </defs>

          <!-- Floating Shadow Ground Ring -->
          <ellipse cx="200" cy="360" rx="100" ry="18" fill="#581c87" opacity="0.4"/>

          <!-- Wispy Ghost Tail Swirls -->
          <path d="M 160 280 Q 200 380 240 330 Q 210 300 200 280" fill="url(#ghostDark)"/>
          <path d="M 140 260 Q 110 320 150 340 Q 160 310 160 270" fill="url(#ghostDark)" opacity="0.8"/>
          <path d="M 240 260 Q 280 330 230 350 Q 220 310 230 270" fill="url(#ghostDark)" opacity="0.8"/>

          <!-- Main Phantom Body -->
          <ellipse cx="200" cy="200" rx="75" ry="85" fill="url(#ghostDark)"/>

          <!-- Ghostly Floating Hands -->
          <g transform="translate(80, 190)">
            <ellipse cx="20" cy="20" rx="22" ry="16" fill="url(#ghostDark)"/>
            <circle cx="5" cy="15" r="6" fill="#c084fc"/>
            <circle cx="15" cy="5" r="6" fill="#c084fc"/>
            <circle cx="30" cy="8" r="6" fill="#c084fc"/>
          </g>
          <g transform="translate(280, 190)">
            <ellipse cx="20" cy="20" rx="22" ry="16" fill="url(#ghostDark)"/>
            <circle cx="35" cy="15" r="6" fill="#c084fc"/>
            <circle cx="25" cy="5" r="6" fill="#c084fc"/>
            <circle cx="10" cy="8" r="6" fill="#c084fc"/>
          </g>

          <!-- Floating Mystic Crown/Horns -->
          <polygon points="180,125 170,80 190,115" fill="#f43f5e"/>
          <polygon points="200,120 200,65 210,115" fill="#a855f7"/>
          <polygon points="220,125 230,80 210,115" fill="#f43f5e"/>

          <!-- Glowing Mystic Eyes -->
          ${this.renderEye(personality, 200, 190, 50, true)}

          <!-- Eerie/Playful Mouth -->
          <path d="M 175 225 Q 200 255 225 225 Z" fill="#1e1b4b" stroke="#f43f5e" stroke-width="2"/>
          <polygon points="185,225 190,233 195,225" fill="#ffffff"/>
          <polygon points="205,225 210,233 215,225" fill="#ffffff"/>

          <!-- Purple smoke orbs -->
          <circle cx="130" cy="130" r="10" fill="#c084fc" opacity="0.6"/>
          <circle cx="270" cy="140" r="14" fill="#c084fc" opacity="0.5"/>
        `;
        break;

      case 'flora_hopper':
        bodyContent = `
          <!-- Spring Flora Rabbit -->
          <defs>
            <linearGradient id="furGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a"/>
              <stop offset="50%" stop-color="#86efac"/>
              <stop offset="100%" stop-color="#22c55e"/>
            </linearGradient>
            <linearGradient id="petalPink" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#fbcfe8"/>
              <stop offset="100%" stop-color="#f43f5e"/>
            </linearGradient>
          </defs>

          <!-- Shadow -->
          <ellipse cx="200" cy="360" rx="95" ry="18" fill="#000000" opacity="0.3"/>

          <!-- Flower Petal Lop Ears -->
          <path d="M 160 140 C 110 90, 80 180, 100 260 C 115 250, 140 210, 155 160 Z" fill="url(#furGrad)" stroke="#15803d" stroke-width="3"/>
          <path d="M 125 170 C 105 140, 95 200, 108 240 Z" fill="url(#petalPink)"/>
          
          <path d="M 240 140 C 290 90, 320 180, 300 260 C 285 250, 260 210, 245 160 Z" fill="url(#furGrad)" stroke="#15803d" stroke-width="3"/>
          <path d="M 275 170 C 295 140, 305 200, 292 240 Z" fill="url(#petalPink)"/>

          <!-- Body -->
          <ellipse cx="200" cy="270" rx="60" ry="65" fill="url(#furGrad)"/>
          <ellipse cx="200" cy="275" rx="35" ry="42" fill="#ffffff" opacity="0.9"/>

          <!-- Spring Bouncing Legs -->
          <ellipse cx="145" cy="330" rx="26" ry="16" fill="url(#furGrad)" stroke="#15803d" stroke-width="2"/>
          <ellipse cx="255" cy="330" rx="26" ry="16" fill="url(#furGrad)" stroke="#15803d" stroke-width="2"/>

          <!-- Paws -->
          <circle cx="175" cy="250" r="14" fill="#ffffff"/>
          <circle cx="225" cy="250" r="14" fill="#ffffff"/>

          <!-- Head -->
          <ellipse cx="200" cy="180" rx="52" ry="45" fill="url(#furGrad)"/>

          <!-- Blossom Flower on Head -->
          <circle cx="200" cy="130" r="10" fill="#facc15"/>
          <circle cx="190" cy="122" r="8" fill="#f43f5e"/>
          <circle cx="210" cy="122" r="8" fill="#f43f5e"/>
          <circle cx="190" cy="138" r="8" fill="#f43f5e"/>
          <circle cx="210" cy="138" r="8" fill="#f43f5e"/>

          <!-- Eye (${personality}) -->
          ${this.renderEye(personality, 200, 180, 42)}

          <!-- Cute Bunny Nose & Mouth -->
          <polygon points="200,196 195,190 205,190" fill="#f43f5e"/>
          <path d="M 193 202 Q 200 208 207 202" stroke="#15803d" stroke-width="2" fill="none"/>
        `;
        break;

      default: // 'sky_falcon', 'magma_golem', 'glacier_wolf', 'kaleido_cham', 'lumi_flutter'
        bodyContent = `
          <!-- Mystic Elemental Beast -->
          <defs>
            <radialGradient id="beastSkin" cx="40%" cy="40%" r="65%">
              <stop offset="0%" stop-color="#38bdf8"/>
              <stop offset="60%" stop-color="#1d4ed8"/>
              <stop offset="100%" stop-color="#0f172a"/>
            </radialGradient>
            <linearGradient id="crestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fde047"/>
              <stop offset="100%" stop-color="#ea580c"/>
            </linearGradient>
          </defs>

          <!-- Shadow -->
          <ellipse cx="200" cy="360" rx="120" ry="22" fill="#000000" opacity="0.3"/>

          <!-- Feathered / Armored Wings -->
          <path d="M 140 220 C 60 160, 40 80, 80 70 C 110 110, 130 160, 150 240 Z" fill="url(#crestGrad)" stroke="#ca8a04" stroke-width="3"/>
          <path d="M 260 220 C 340 160, 360 80, 320 70 C 290 110, 270 160, 250 240 Z" fill="url(#crestGrad)" stroke="#ca8a04" stroke-width="3"/>

          <!-- Body -->
          <ellipse cx="200" cy="260" rx="68" ry="85" fill="url(#beastSkin)"/>
          <path d="M 180 230 C 190 210, 210 210, 220 230 C 225 270, 215 310, 200 320 C 185 310, 175 270, 180 230 Z" fill="#e0f2fe" opacity="0.8"/>

          <!-- Legs -->
          <path d="M 160 310 L 150 360 L 130 365" stroke="#1d4ed8" stroke-width="20" stroke-linecap="round" fill="none"/>
          <path d="M 240 310 L 250 360 L 270 365" stroke="#1d4ed8" stroke-width="20" stroke-linecap="round" fill="none"/>

          <!-- Head & Crest -->
          <ellipse cx="200" cy="170" rx="50" ry="46" fill="url(#beastSkin)"/>
          <!-- Crown Crest -->
          <polygon points="180,130 170,75 190,115" fill="url(#crestGrad)"/>
          <polygon points="200,125 200,55 210,115" fill="url(#crestGrad)"/>
          <polygon points="220,130 230,75 210,115" fill="url(#crestGrad)"/>

          <!-- Eye (${personality}) -->
          ${this.renderEye(personality, 200, 165, 46)}

          <!-- Sharp Beak / Snout -->
          <polygon points="200,195 190,180 210,180" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
        `;
    }

    // Wrap in standard SVG container with dynamic size scale and animations
    return `
      <svg class="pokemon-creature-svg ${auraClass}" viewBox="0 0 400 420" width="100%" height="100%" style="transform: scale(${config.scale || 1.0});">
        ${bodyContent}
      </svg>
    `;
  }

  // Render eye according to personality
  renderEye(personality, centerX, centerY, eyeSpacing = 44, isGlow = false) {
    const leftX = centerX - (eyeSpacing / 2);
    const rightX = centerX + (eyeSpacing / 2);

    switch (personality) {
      case 'cute':
        return `
          <!-- Cute Anime Eyes with Big Sparkles -->
          <ellipse cx="${leftX}" cy="${centerY}" rx="14" ry="16" fill="#1e293b"/>
          <circle cx="${leftX + 3}" cy="${centerY - 4}" r="6" fill="#ffffff"/>
          <circle cx="${leftX - 3}" cy="${centerY + 4}" r="2.5" fill="#ffffff"/>
          <ellipse cx="${leftX}" cy="${centerY + 16}" rx="8" ry="4" fill="#f43f5e" opacity="0.6"/> <!-- Blush -->

          <ellipse cx="${rightX}" cy="${centerY}" rx="14" ry="16" fill="#1e293b"/>
          <circle cx="${rightX + 3}" cy="${centerY - 4}" r="6" fill="#ffffff"/>
          <circle cx="${rightX - 3}" cy="${centerY + 4}" r="2.5" fill="#ffffff"/>
          <ellipse cx="${rightX}" cy="${centerY + 16}" rx="8" ry="4" fill="#f43f5e" opacity="0.6"/> <!-- Blush -->
        `;

      case 'scary':
        return `
          <!-- Scary Glowing Predatory Slit Eyes -->
          <path d="M ${leftX - 14} ${centerY - 6} Q ${leftX} ${centerY - 12} ${leftX + 14} ${centerY + 2} Q ${leftX} ${centerY + 6} ${leftX - 14} ${centerY - 6} Z" fill="#ef4444"/>
          <ellipse cx="${leftX}" cy="${centerY - 2}" rx="3" ry="8" fill="#1e293b"/>
          
          <path d="M ${rightX + 14} ${centerY - 6} Q ${rightX} ${centerY - 12} ${rightX - 14} ${centerY + 2} Q ${rightX} ${centerY + 6} ${rightX + 14} ${centerY - 6} Z" fill="#ef4444"/>
          <ellipse cx="${rightX}" cy="${centerY - 2}" rx="3" ry="8" fill="#1e293b"/>
        `;

      case 'funny':
        return `
          <!-- Goofy Cartoon Eyes -->
          <circle cx="${leftX}" cy="${centerY}" r="14" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
          <circle cx="${leftX + 4}" cy="${centerY + 2}" r="6" fill="#0f172a"/>
          
          <circle cx="${rightX}" cy="${centerY}" r="14" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
          <circle cx="${rightX - 4}" cy="${centerY - 3}" r="6" fill="#0f172a"/>
        `;

      case 'brave':
        return `
          <!-- Brave Determined Eyes -->
          <polygon points="${leftX - 14},${centerY - 8} ${leftX + 12},${centerY} ${leftX - 10},${centerY + 8}" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
          <circle cx="${leftX}" cy="${centerY}" r="4" fill="#0f172a"/>
          <path d="M ${leftX - 16} ${centerY - 10} L ${leftX + 12} ${centerY - 2}" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>

          <polygon points="${rightX + 14},${centerY - 8} ${rightX - 12},${centerY} ${rightX + 10},${centerY + 8}" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
          <circle cx="${rightX}" cy="${centerY}" r="4" fill="#0f172a"/>
          <path d="M ${rightX + 16} ${centerY - 10} L ${rightX - 12} ${centerY - 2}" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
        `;

      default: // 'friendly'
        return `
          <!-- Friendly Warm Curved Eyes -->
          <path d="M ${leftX - 12} ${centerY + 2} Q ${leftX} ${centerY - 10} ${leftX + 12} ${centerY + 2}" stroke="#0f172a" stroke-width="4" fill="none" stroke-linecap="round"/>
          <ellipse cx="${leftX}" cy="${centerY + 14}" rx="7" ry="3" fill="#fda4af" opacity="0.7"/>

          <path d="M ${rightX - 12} ${centerY + 2} Q ${rightX} ${centerY - 10} ${rightX + 12} ${centerY + 2}" stroke="#0f172a" stroke-width="4" fill="none" stroke-linecap="round"/>
          <ellipse cx="${rightX}" cy="${centerY + 14}" rx="7" ry="3" fill="#fda4af" opacity="0.7"/>
        `;
    }
  }
}

const creatures = new CreatureEngine();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CreatureEngine;
}
