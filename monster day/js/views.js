/* ==========================================================================
   🌿 LIFE IN THE JUNGLE — THE JUNGLE RANGERS
   High-Quality Modern Animated Storybook Visual Engine
   ========================================================================== */

class JungleViewsRenderer {
  constructor() {}

  // =========================================================================
  // 1. HIGH-FIDELITY ANIMATED CHARACTER ARTWORK & EMOTIONS
  // =========================================================================

  // Suki the Squirrel (Happy, Worried, Eating, Rescued)
  getSuki(state = "happy", size = 160) {
    const isWorried = state === "worried" || state === "scared";
    const isEating = state === "eating";
    
    return `
      <svg viewBox="0 0 160 160" width="${size}" height="${size}" class="storybook-character suki-character ${state}">
        <defs>
          <radialGradient id="sq-tail-fluff" cx="65%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#fb923c"/>
            <stop offset="45%" stop-color="#ea580c"/>
            <stop offset="85%" stop-color="#c2410c"/>
            <stop offset="100%" stop-color="#7c2d12"/>
          </radialGradient>
          <linearGradient id="sq-fur-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fdba74"/>
            <stop offset="35%" stop-color="#f97316"/>
            <stop offset="75%" stop-color="#ea580c"/>
            <stop offset="100%" stop-color="#9a3412"/>
          </linearGradient>
          <linearGradient id="sq-belly" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="100%" stop-color="#ffedd5"/>
          </linearGradient>
          <filter id="sq-shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.25"/>
          </filter>
        </defs>

        <!-- Shadow on ground -->
        <ellipse cx="80" cy="148" rx="42" ry="8" fill="#000" opacity="0.22"/>

        <!-- Giant Fluffy Tail with Fur Detail -->
        <g filter="url(#sq-shadow)">
          <path d="M 85 125 C 145 120 165 45 125 20 C 95 2 85 35 102 62 C 115 82 108 108 82 118 Z" 
                fill="url(#sq-tail-fluff)" stroke="#9a3412" stroke-width="2.5"/>
          <path d="M 125 20 C 135 35 130 65 110 82" stroke="#fed7aa" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.6"/>
          <path d="M 115 30 C 122 45 118 70 100 88" stroke="#ffedd5" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.4"/>
        </g>

        <!-- Body -->
        <ellipse cx="72" cy="108" rx="30" ry="34" fill="url(#sq-fur-body)" filter="url(#sq-shadow)"/>
        <path d="M 58 86 Q 74 100 66 128 Q 50 116 54 88 Z" fill="url(#sq-belly)"/>

        <!-- Feet with claws -->
        <ellipse cx="52" cy="142" rx="14" ry="7" fill="#ea580c"/>
        <ellipse cx="88" cy="142" rx="14" ry="7" fill="#ea580c"/>

        <!-- Head -->
        <circle cx="62" cy="64" r="26" fill="url(#sq-fur-body)" filter="url(#sq-shadow)"/>
        
        <!-- Ears -->
        <path d="M 44 44 C 38 25 50 20 54 38 Z" fill="#ea580c" stroke="#9a3412" stroke-width="1.5"/>
        <path d="M 46 40 C 42 28 48 25 52 38 Z" fill="#fbcfe8"/>
        <path d="M 72 44 C 78 25 66 20 62 38 Z" fill="#ea580c" stroke="#9a3412" stroke-width="1.5"/>
        <path d="M 70 40 C 74 28 68 25 64 38 Z" fill="#fbcfe8"/>

        <!-- Cheeks -->
        <ellipse cx="44" cy="74" rx="8" ry="6" fill="#fed7aa"/>
        <ellipse cx="78" cy="74" rx="8" ry="6" fill="#fed7aa"/>

        <!-- Eyes (Expressive) -->
        ${isWorried ? `
          <!-- Worried Eyes -->
          <ellipse cx="50" cy="60" rx="6" ry="7" fill="#1e1b4b"/>
          <circle cx="48" cy="58" r="2.5" fill="#fff"/>
          <ellipse cx="72" cy="60" rx="6" ry="7" fill="#1e1b4b"/>
          <circle cx="70" cy="58" r="2.5" fill="#fff"/>
          <!-- Worried Eyebrows -->
          <path d="M 44 50 Q 52 54 58 51" stroke="#451a03" stroke-width="2.5" stroke-linecap="round" fill="none"/>
          <path d="M 78 50 Q 70 54 64 51" stroke="#451a03" stroke-width="2.5" stroke-linecap="round" fill="none"/>
          <!-- Worried Trembling Mouth -->
          <path d="M 56 75 Q 61 72 66 75" stroke="#7c2d12" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        ` : `
          <!-- Happy Sparkling Eyes -->
          <ellipse cx="50" cy="60" rx="7" ry="8" fill="#1e1b4b"/>
          <circle cx="48" cy="57" r="3" fill="#fff"/>
          <circle cx="53" cy="63" r="1.2" fill="#fff"/>
          <ellipse cx="72" cy="60" rx="7" ry="8" fill="#1e1b4b"/>
          <circle cx="70" cy="57" r="3" fill="#fff"/>
          <circle cx="75" cy="63" r="1.2" fill="#fff"/>
          <!-- Happy Eyebrows -->
          <path d="M 44 48 Q 50 44 56 48" stroke="#451a03" stroke-width="2" stroke-linecap="round" fill="none"/>
          <path d="M 66 48 Q 72 44 78 48" stroke="#451a03" stroke-width="2" stroke-linecap="round" fill="none"/>
          <!-- Cute Smile -->
          <path d="M 55 72 Q 61 78 67 72" stroke="#7c2d12" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        `}

        <!-- Nose -->
        <polygon points="58,66 64,66 61,70" fill="#451a03"/>

        <!-- Whiskers -->
        <path d="M 42 68 L 26 64 M 42 71 L 24 71 M 42 74 L 26 78" stroke="#fdba74" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M 78 68 L 94 64 M 78 71 L 96 71 M 78 74 L 94 78" stroke="#fdba74" stroke-width="1.5" stroke-linecap="round"/>

        <!-- Acorn in Paws -->
        <g id="suki-acorn" transform="translate(48, 88)">
          <path d="M 8 6 C 8 20 20 20 20 6 Z" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
          <path d="M 5 6 C 5 2 23 2 23 6 Z" fill="#451a03"/>
          <path d="M 14 2 L 14 -2" stroke="#451a03" stroke-width="2" stroke-linecap="round"/>
          <!-- Paws holding acorn -->
          <circle cx="6" cy="10" r="5" fill="#ea580c"/>
          <circle cx="22" cy="10" r="5" fill="#ea580c"/>
        </g>
      </svg>
    `;
  }

  // Poppy the Frog (Happy, Worried, Jumping, Catching Fly)
  getPoppy(state = "happy", size = 160) {
    const isWorried = state === "worried" || state === "dry";
    
    return `
      <svg viewBox="0 0 160 160" width="${size}" height="${size}" class="storybook-character poppy-character ${state}">
        <defs>
          <radialGradient id="fr-skin-grad" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#86efac"/>
            <stop offset="40%" stop-color="#22c55e"/>
            <stop offset="85%" stop-color="#16a34a"/>
            <stop offset="100%" stop-color="#14532d"/>
          </radialGradient>
          <linearGradient id="fr-belly-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="100%" stop-color="#bbf7d0"/>
          </linearGradient>
          <radialGradient id="lily-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#4ade80"/>
            <stop offset="80%" stop-color="#15803d"/>
            <stop offset="100%" stop-color="#064e3b"/>
          </radialGradient>
        </defs>

        <!-- Lily Pad Under Poppy -->
        <g id="lilypad">
          <path d="M 20 130 C 25 100 135 100 140 130 C 135 155 95 160 80 142 C 65 160 25 155 20 130 Z" 
                fill="url(#lily-grad)" stroke="#14532d" stroke-width="2.5"/>
          <path d="M 80 130 L 35 118 M 80 130 L 125 118 M 80 130 L 80 142 M 80 130 L 50 145 M 80 130 L 110 145" 
                stroke="#86efac" stroke-width="1.5" opacity="0.6"/>
        </g>

        <!-- Hind Legs / Webbed Feet -->
        <ellipse cx="34" cy="115" rx="18" ry="12" fill="#16a34a" transform="rotate(-20, 34, 115)"/>
        <circle cx="20" cy="125" r="5" fill="#22c55e"/>
        <circle cx="28" cy="128" r="5" fill="#22c55e"/>
        <circle cx="36" cy="128" r="5" fill="#22c55e"/>

        <ellipse cx="126" cy="115" rx="18" ry="12" fill="#16a34a" transform="rotate(20, 126, 115)"/>
        <circle cx="140" cy="125" r="5" fill="#22c55e"/>
        <circle cx="132" cy="128" r="5" fill="#22c55e"/>
        <circle cx="124" cy="128" r="5" fill="#22c55e"/>

        <!-- Chubby Frog Body -->
        <ellipse cx="80" cy="98" rx="36" ry="28" fill="url(#fr-skin-grad)"/>
        <ellipse cx="80" cy="104" rx="24" ry="18" fill="url(#fr-belly-grad)"/>

        <!-- Big Cartoon Frog Eyes (Bulging at Top) -->
        <circle cx="56" cy="52" r="18" fill="url(#fr-skin-grad)"/>
        <circle cx="104" cy="52" r="18" fill="url(#fr-skin-grad)"/>
        
        <!-- Eye Whites & Sclera -->
        <circle cx="56" cy="52" r="13" fill="#fef08a"/>
        <circle cx="104" cy="52" r="13" fill="#fef08a"/>

        ${isWorried ? `
          <!-- Worried Eyes -->
          <ellipse cx="56" cy="52" rx="7" ry="4" fill="#022c22"/>
          <ellipse cx="104" cy="52" rx="7" ry="4" fill="#022c22"/>
          <!-- Tears -->
          <path d="M 45 64 Q 42 74 45 78 Q 48 74 45 64 Z" fill="#38bdf8"/>
          <!-- Sad Mouth -->
          <path d="M 58 92 Q 80 82 102 92" stroke="#064e3b" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        ` : `
          <!-- Happy Big Pupils with Highlights -->
          <ellipse cx="56" cy="52" rx="8" ry="10" fill="#022c22"/>
          <circle cx="53" cy="48" r="3.5" fill="#ffffff"/>
          <circle cx="58" cy="55" r="1.5" fill="#ffffff"/>
          
          <ellipse cx="104" cy="52" rx="8" ry="10" fill="#022c22"/>
          <circle cx="101" cy="48" r="3.5" fill="#ffffff"/>
          <circle cx="106" cy="55" r="1.5" fill="#ffffff"/>
          
          <!-- Cute Rosy Cheeks -->
          <ellipse cx="44" cy="80" rx="8" ry="5" fill="#f472b6" opacity="0.6"/>
          <ellipse cx="116" cy="80" rx="8" ry="5" fill="#f472b6" opacity="0.6"/>
          
          <!-- Giant Cheerful Smile -->
          <path d="M 52 82 Q 80 102 108 82" stroke="#064e3b" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        `}

        <!-- Cute Front Paws Resting on Belly -->
        <ellipse cx="64" cy="116" rx="6" ry="10" fill="#22c55e"/>
        <ellipse cx="96" cy="116" rx="6" ry="10" fill="#22c55e"/>
      </svg>
    `;
  }

  // Rico the Raccoon (Curious, Worried, Clean River)
  getRico(state = "happy", size = 160) {
    const isWorried = state === "worried";
    
    return `
      <svg viewBox="0 0 160 160" width="${size}" height="${size}" class="storybook-character rico-character ${state}">
        <defs>
          <linearGradient id="rc-fur" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#94a3b8"/>
            <stop offset="50%" stop-color="#64748b"/>
            <stop offset="100%" stop-color="#334155"/>
          </linearGradient>
        </defs>

        <!-- Ringed Tail -->
        <g id="rc-tail">
          <path d="M 95 110 C 145 105 155 60 135 45 C 120 35 115 55 105 85 Z" fill="#64748b" stroke="#1e293b" stroke-width="2"/>
          <path d="M 125 50 C 132 58 128 68 118 72" stroke="#0f172a" stroke-width="6" fill="none"/>
          <path d="M 115 70 C 122 78 118 88 108 92" stroke="#0f172a" stroke-width="6" fill="none"/>
        </g>

        <!-- Body -->
        <ellipse cx="75" cy="112" rx="34" ry="30" fill="url(#rc-fur)"/>
        <ellipse cx="75" cy="116" rx="20" ry="20" fill="#cbd5e1"/>

        <!-- Head -->
        <circle cx="75" cy="65" r="28" fill="url(#rc-fur)"/>
        
        <!-- Ears with white trim -->
        <polygon points="50,45 42,20 62,35" fill="#334155" stroke="#1e293b" stroke-width="1.5"/>
        <polygon points="48,42 45,26 58,36" fill="#f8fafc"/>
        <polygon points="100,45 108,20 88,35" fill="#334155" stroke="#1e293b" stroke-width="1.5"/>
        <polygon points="102,42 105,26 92,36" fill="#f8fafc"/>

        <!-- Iconic Black Bandit Mask -->
        <path d="M 48 58 Q 75 66 102 58 Q 98 76 75 72 Q 52 76 48 58 Z" fill="#0f172a"/>

        <!-- Eyes -->
        ${isWorried ? `
          <ellipse cx="58" cy="62" rx="5" ry="6" fill="#f8fafc"/>
          <circle cx="58" cy="62" r="3.5" fill="#020617"/>
          <ellipse cx="92" cy="62" rx="5" ry="6" fill="#f8fafc"/>
          <circle cx="92" cy="62" r="3.5" fill="#020617"/>
          <path d="M 68 84 Q 75 80 82 84" stroke="#0f172a" stroke-width="2.5" fill="none"/>
        ` : `
          <ellipse cx="58" cy="62" rx="6" ry="7" fill="#f8fafc"/>
          <circle cx="58" cy="62" r="4.5" fill="#020617"/>
          <circle cx="56" cy="60" r="1.8" fill="#ffffff"/>
          <ellipse cx="92" cy="62" rx="6" ry="7" fill="#f8fafc"/>
          <circle cx="92" cy="62" r="4.5" fill="#020617"/>
          <circle cx="90" cy="60" r="1.8" fill="#ffffff"/>
          <path d="M 66 80 Q 75 88 84 80" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        `}

        <!-- White Muzzle & Snout -->
        <ellipse cx="75" cy="76" rx="12" ry="9" fill="#f8fafc"/>
        <ellipse cx="75" cy="72" rx="5" ry="3.5" fill="#020617"/>

        <!-- Paws -->
        <ellipse cx="58" cy="120" rx="8" ry="12" fill="#334155"/>
        <ellipse cx="92" cy="120" rx="8" ry="12" fill="#334155"/>
      </svg>
    `;
  }

  // Boris the Bear (Friendly, Fishing, Eating Berries)
  getBoris(state = "happy", size = 160) {
    const isEating = state === "berries";
    
    return `
      <svg viewBox="0 0 160 160" width="${size}" height="${size}" class="storybook-character boris-character ${state}">
        <defs>
          <linearGradient id="br-fur" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#78350f"/>
            <stop offset="60%" stop-color="#582f0e"/>
            <stop offset="100%" stop-color="#3c1803"/>
          </linearGradient>
        </defs>

        <!-- Giant Furry Body -->
        <ellipse cx="80" cy="115" rx="46" ry="36" fill="url(#br-fur)"/>
        <ellipse cx="80" cy="118" rx="28" ry="24" fill="#9a3412" opacity="0.6"/>

        <!-- Big Round Ears -->
        <circle cx="50" cy="42" r="15" fill="#582f0e"/>
        <circle cx="50" cy="42" r="9" fill="#d97706"/>
        <circle cx="110" cy="42" r="15" fill="#582f0e"/>
        <circle cx="110" cy="42" r="9" fill="#d97706"/>

        <!-- Big Bear Head -->
        <circle cx="80" cy="68" r="34" fill="url(#br-fur)"/>

        <!-- Warm Amber Muzzle -->
        <ellipse cx="80" cy="78" rx="20" ry="16" fill="#d97706"/>
        <ellipse cx="80" cy="72" rx="9" ry="6.5" fill="#1c1917"/>

        <!-- Friendly Eyes -->
        <circle cx="64" cy="58" r="5" fill="#1c1917"/>
        <circle cx="63" cy="56" r="1.8" fill="#ffffff"/>
        <circle cx="96" cy="58" r="5" fill="#1c1917"/>
        <circle cx="95" cy="56" r="1.8" fill="#ffffff"/>

        ${isEating ? `
          <!-- Eating Berries Smile with Juice -->
          <path d="M 68 84 Q 80 94 92 84" stroke="#1c1917" stroke-width="3" stroke-linecap="round" fill="none"/>
          <circle cx="74" cy="86" r="4" fill="#e11d48"/>
          <circle cx="86" cy="87" r="3.5" fill="#9333ea"/>
        ` : `
          <!-- Warm Smile -->
          <path d="M 70 84 Q 80 92 90 84" stroke="#1c1917" stroke-width="3" stroke-linecap="round" fill="none"/>
        `}

        <!-- Huge Friendly Paws -->
        <ellipse cx="48" cy="125" rx="14" ry="18" fill="#582f0e"/>
        <ellipse cx="112" cy="125" rx="14" ry="18" fill="#582f0e"/>
      </svg>
    `;
  }

  // Fluffy Rabbit (Prey, Gentle)
  getRabbit(state = "happy", size = 160) {
    return `
      <svg viewBox="0 0 160 160" width="${size}" height="${size}" class="storybook-character rabbit-character ${state}">
        <defs>
          <linearGradient id="rb-fur-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="70%" stop-color="#e2e8f0"/>
            <stop offset="100%" stop-color="#cbd5e1"/>
          </linearGradient>
        </defs>

        <!-- Long Ears -->
        <g id="rb-ears">
          <ellipse cx="62" cy="35" rx="10" ry="30" fill="url(#rb-fur-grad)" stroke="#cbd5e1" stroke-width="1.5" transform="rotate(-10, 62, 35)"/>
          <ellipse cx="62" cy="35" rx="5" ry="22" fill="#fbcfe8" transform="rotate(-10, 62, 35)"/>
          
          <ellipse cx="98" cy="35" rx="10" ry="30" fill="url(#rb-fur-grad)" stroke="#cbd5e1" stroke-width="1.5" transform="rotate(10, 98, 35)"/>
          <ellipse cx="98" cy="35" rx="5" ry="22" fill="#fbcfe8" transform="rotate(10, 98, 35)"/>
        </g>

        <!-- Fluffy Body & Tail -->
        <ellipse cx="80" cy="115" rx="34" ry="30" fill="url(#rb-fur-grad)"/>
        <circle cx="116" cy="120" r="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>

        <!-- Round Head -->
        <circle cx="80" cy="75" r="26" fill="url(#rb-fur-grad)"/>

        <!-- Big Innocent Eyes -->
        <ellipse cx="68" cy="70" rx="6" ry="7" fill="#1e1b4b"/>
        <circle cx="66" cy="68" r="2.5" fill="#ffffff"/>
        <ellipse cx="92" cy="70" rx="6" ry="7" fill="#1e1b4b"/>
        <circle cx="90" cy="68" r="2.5" fill="#ffffff"/>

        <!-- Pink Nose & Cute Mouth -->
        <polygon points="76,80 84,80 80,85" fill="#f472b6"/>
        <path d="M 74 88 Q 80 92 86 88" stroke="#64748b" stroke-width="2" stroke-linecap="round" fill="none"/>

        <!-- Whiskers -->
        <path d="M 64 82 L 44 80 M 64 85 L 42 86 M 64 88 L 44 92" stroke="#94a3b8" stroke-width="1.5"/>
        <path d="M 96 82 L 116 80 M 96 85 L 118 86 M 96 88 L 116 92" stroke="#94a3b8" stroke-width="1.5"/>
      </svg>
    `;
  }

  // Red Fox (Predator, Sleek)
  getFox(state = "happy", size = 160) {
    return `
      <svg viewBox="0 0 160 160" width="${size}" height="${size}" class="storybook-character fox-character ${state}">
        <defs>
          <linearGradient id="fox-coat-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fb923c"/>
            <stop offset="50%" stop-color="#ea580c"/>
            <stop offset="100%" stop-color="#9a3412"/>
          </linearGradient>
        </defs>

        <!-- Bushy Tail with White Tip -->
        <path d="M 95 115 C 145 110 160 55 130 35 C 105 20 100 65 90 95 Z" fill="url(#fox-coat-grad)" stroke="#9a3412" stroke-width="2"/>
        <path d="M 130 35 C 140 45 135 60 120 62 Z" fill="#ffffff"/>

        <!-- Sleek Body -->
        <ellipse cx="75" cy="115" rx="34" ry="26" fill="url(#fox-coat-grad)"/>

        <!-- Pointed Triangular Ears -->
        <polygon points="45,45 35,15 62,35" fill="#0f172a"/>
        <polygon points="48,42 40,24 58,36" fill="#ffffff"/>
        <polygon points="105,45 115,15 88,35" fill="#0f172a"/>
        <polygon points="102,42 110,24 92,36" fill="#ffffff"/>

        <!-- Fox Head (Pointed V-shape) -->
        <polygon points="35,55 75,102 115,55" fill="url(#fox-coat-grad)"/>
        <polygon points="42,58 75,96 58,58" fill="#ffffff"/>
        <polygon points="108,58 75,96 92,58" fill="#ffffff"/>

        <!-- Clever Amber Eyes -->
        <ellipse cx="58" cy="58" rx="6" ry="4" fill="#d97706" transform="rotate(-15, 58, 58)"/>
        <circle cx="58" cy="58" r="2.5" fill="#0f172a"/>
        <ellipse cx="92" cy="58" rx="6" ry="4" fill="#d97706" transform="rotate(15, 92, 58)"/>
        <circle cx="92" cy="58" r="2.5" fill="#0f172a"/>

        <!-- Black Nose Tip -->
        <circle cx="75" cy="98" r="4.5" fill="#020617"/>
      </svg>
    `;
  }

  // Generic Animal Dispatcher
  getAnimalAvatar(animalKey, size = 150, state = "happy") {
    switch (animalKey) {
      case "squirrel": return this.getSuki(state, size);
      case "frog": return this.getPoppy(state, size);
      case "raccoon": return this.getRico(state, size);
      case "bear": return this.getBoris(state, size);
      case "rabbit": return this.getRabbit(state, size);
      case "fox": return this.getFox(state, size);
      default: return this.getSuki(state, size);
    }
  }

  // =========================================================================
  // 2. DETAILED STORYBOOK BIOMES & BACKGROUNDS
  // =========================================================================
  getBiomeBanner(biomeKey) {
    const biomes = {
      forest: `
        <div style="width:100%; height:100%; background:linear-gradient(180deg, #166534 0%, #14532d 100%); position:relative; border-radius:var(--radius-xl); overflow:hidden;">
          <svg viewBox="0 0 1000 350" width="100%" height="100%" preserveAspectRatio="none" style="position:absolute; top:0; left:0;">
            <!-- Tree Trunks & Foliage Layers -->
            <rect x="120" y="40" width="45" height="310" fill="#582f0e"/>
            <rect x="420" y="30" width="60" height="320" fill="#451a03"/>
            <rect x="780" y="50" width="50" height="300" fill="#582f0e"/>
            <circle cx="140" cy="60" r="110" fill="#15803d" opacity="0.9"/>
            <circle cx="450" cy="50" r="140" fill="#166534" opacity="0.95"/>
            <circle cx="800" cy="70" r="120" fill="#15803d" opacity="0.9"/>
            <!-- Sunlight Rays -->
            <polygon points="200,0 280,0 350,350 220,350" fill="#fef08a" opacity="0.12"/>
            <polygon points="550,0 640,0 720,350 600,350" fill="#fef08a" opacity="0.12"/>
            <!-- Mossy Ground with Ferns -->
            <path d="M 0 280 Q 250 250 500 270 Q 750 290 1000 260 L 1000 350 L 0 350 Z" fill="#14532d"/>
            <path d="M 0 310 Q 350 290 700 305 Q 880 295 1000 310 L 1000 350 L 0 350 Z" fill="#052e16"/>
          </svg>
        </div>
      `,
      pond: `
        <div style="width:100%; height:100%; background:linear-gradient(180deg, #0284c7 0%, #0369a1 100%); position:relative; border-radius:var(--radius-xl); overflow:hidden;">
          <svg viewBox="0 0 1000 350" width="100%" height="100%" preserveAspectRatio="none" style="position:absolute; top:0; left:0;">
            <!-- Water Ripples & Reeds -->
            <ellipse cx="500" cy="220" rx="420" ry="110" fill="#38bdf8" opacity="0.75"/>
            <ellipse cx="500" cy="230" rx="360" ry="85" fill="#0284c7" opacity="0.9"/>
            <!-- Cattails / Reeds -->
            <path d="M 80 350 L 95 140 M 110 350 L 120 120 M 135 350 L 140 150" stroke="#15803d" stroke-width="5"/>
            <rect x="90" y="140" width="10" height="35" rx="5" fill="#78350f"/>
            <rect x="115" y="120" width="10" height="40" rx="5" fill="#78350f"/>
            <!-- Water Lilies -->
            <ellipse cx="380" cy="240" rx="45" ry="16" fill="#16a34a"/>
            <ellipse cx="640" cy="220" rx="55" ry="18" fill="#15803d"/>
          </svg>
        </div>
      `
    };

    return biomes[biomeKey] || biomes.forest;
  }

  // =========================================================================
  // 3. VISUAL WORD WALL RENDERER
  // =========================================================================
  renderVisualWordWall(container) {
    const words = window.JUNGLE_DATA.wordWall;
    container.innerHTML = `
      <div class="modal-card" style="max-width:1050px; border-color:#10b981;">
        <div class="modal-header">
          <div class="modal-title">
            <span>🖼️</span>
            <span>VISUAL JUNGLE WORD WALL</span>
          </div>
          <button class="modal-close-btn" id="btn-close-word-wall">✕</button>
        </div>
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:16px; max-height:68vh; overflow-y:auto; padding:8px;">
          ${words.map(w => `
            <div class="word-wall-card tap-item" data-word="${w.word}" data-desc="${w.desc}" style="background:#f8fafc; border:3px solid #cbd5e1; border-radius:var(--radius-xl); padding:16px; display:flex; flex-direction:column; align-items:center; text-align:center; cursor:pointer; touch-action:manipulation;">
              <span style="font-size:3.5rem; margin-bottom:6px;">${w.icon}</span>
              <span style="font-family:var(--font-display); font-weight:900; font-size:1.35rem; color:#0f172a;">${w.word}</span>
              <span style="font-size:0.95rem; color:#475569; margin-top:6px; font-weight:700;">${w.desc}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

window.jungleViews = new JungleViewsRenderer();
