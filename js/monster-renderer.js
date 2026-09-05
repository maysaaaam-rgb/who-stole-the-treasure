/**
 * ENGLISH ADVENTURE ACADEMY — PROCEDURAL MONSTER RENDERER
 * 
 * Generates crisp, responsive, high-resolution SVG artwork for students' monsters.
 * Supports:
 * - 7 Evolution Stages: Mystery Egg -> Cracking Egg -> Baby -> Growing -> Adventurer -> Advanced -> Ultimate
 * - 6 Base Color Themes: Sky Blue, Berry Pink, Leaf Green, Sunset Orange, Lavender Purple, Royal Gold
 * - Modular Customization: Eyes, Mouths, Horns, Wings, Tails, Hats, Glasses, Backpacks, Accessories, Auras, Environments
 * - Zero external assets or broken image links
 */

(function(root) {
  'use strict';

  // Palette definitions for base monster colors
  const MONSTER_PALETTES = {
    blue: {
      primary: '#38bdf8',
      primaryDark: '#0284c7',
      primaryLight: '#bae6fd',
      belly: '#e0f2fe',
      accent: '#0369a1',
      cheek: '#f472b6',
      shadow: '#075985',
      name: 'Sky Blue'
    },
    pink: {
      primary: '#f472b6',
      primaryDark: '#db2777',
      primaryLight: '#fbcfe8',
      belly: '#fdf2f8',
      accent: '#be185d',
      cheek: '#fb7185',
      shadow: '#9d174d',
      name: 'Berry Pink'
    },
    green: {
      primary: '#4ade80',
      primaryDark: '#16a34a',
      primaryLight: '#bbf7d0',
      belly: '#f0fdf4',
      accent: '#15803d',
      cheek: '#f87171',
      shadow: '#14532d',
      name: 'Leaf Green'
    },
    orange: {
      primary: '#fb923c',
      primaryDark: '#ea580c',
      primaryLight: '#fed7aa',
      belly: '#fff7ed',
      accent: '#c2410c',
      cheek: '#f43f5e',
      shadow: '#7c2d12',
      name: 'Sunset Orange'
    },
    purple: {
      primary: '#c084fc',
      primaryDark: '#9333ea',
      primaryLight: '#f3e8ff',
      belly: '#faf5ff',
      accent: '#7e22ce',
      cheek: '#ec4899',
      shadow: '#581c87',
      name: 'Lavender Purple'
    },
    gold: {
      primary: '#facc15',
      primaryDark: '#ca8a04',
      primaryLight: '#fef08a',
      belly: '#fefce8',
      accent: '#a16207',
      cheek: '#fb7185',
      shadow: '#713f12',
      name: 'Royal Gold'
    }
  };

  const STAGE_META = {
    egg: { level: 1, name: 'Mystery Egg', title: 'Level 1: Mystery Egg', icon: '🥚', desc: 'A mysterious egg waiting for your learning journey to begin.' },
    cracking_egg: { level: 2, name: 'Cracking Egg', title: 'Level 2: Cracking Egg', icon: '🥚', desc: 'Glowing fissures appear as you earn XP and practice English!' },
    baby: { level: 3, name: 'Baby Monster', title: 'Level 3: Baby Monster', icon: '🐣', desc: 'Hatched! A cute, curious companion eager to learn with you.' },
    growing: { level: 4, name: 'Growing Monster', title: 'Level 4: Growing Monster', icon: '👾', desc: 'Bigger, bouncier, and sprouting distinctive traits.' },
    adventurer: { level: 5, name: 'Adventurer Monster', title: 'Level 5: Adventurer Monster', icon: '🧭', desc: 'Equipped for quests and eager for English challenges!' },
    advanced: { level: 6, name: 'Advanced Monster', title: 'Level 6: Advanced Monster', icon: '🐲', desc: 'Majestic crystal horns, sweeping wings, and proud posture.' },
    ultimate: { level: 7, name: 'Ultimate Monster', title: 'Level 7: Ultimate Monster', icon: '👑', desc: 'The legendary sovereign form crowned with celestial power!' }
  };

  /**
   * Main Render Function
   * @param {Object} options
   */
  function renderMonsterSVG(options = {}) {
    const stage = options.stage || 'baby';
    const colorKey = options.color || 'blue';
    const palette = MONSTER_PALETTES[colorKey] || MONSTER_PALETTES.blue;
    const equipped = options.equipped || {};
    const size = options.size || 200;
    const animated = options.animated !== false;

    const animClass = animated ? 'eaa-monster-animated' : '';

    let defs = `
      <defs>
        <!-- Gradients -->
        <linearGradient id="mg-egg-${colorKey}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${palette.primaryLight}" />
          <stop offset="60%" stop-color="${palette.primary}" />
          <stop offset="100%" stop-color="${palette.primaryDark}" />
        </linearGradient>

        <linearGradient id="mg-body-${colorKey}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${palette.primaryLight}" />
          <stop offset="35%" stop-color="${palette.primary}" />
          <stop offset="100%" stop-color="${palette.primaryDark}" />
        </linearGradient>

        <linearGradient id="mg-belly-${colorKey}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="${palette.belly}" />
        </linearGradient>

        <linearGradient id="mg-gold-crown" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="50%" stop-color="#eab308" />
          <stop offset="100%" stop-color="#ca8a04" />
        </linearGradient>

        <linearGradient id="mg-crystal-horn" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#a5f3fc" />
          <stop offset="60%" stop-color="#06b6d4" />
          <stop offset="100%" stop-color="#0e7490" />
        </linearGradient>

        <linearGradient id="mg-aura-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${palette.primaryLight}" stop-opacity="0.6" />
          <stop offset="100%" stop-color="${palette.primary}" stop-opacity="0" />
        </linearGradient>

        <!-- Filters -->
        <filter id="mf-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="mf-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" flood-opacity="0.25" />
        </filter>
      </defs>
    `;

    // 1. Background layer
    const bgLayer = renderBackgroundLayer(equipped.background, stage);

    // 2. Aura layer (under monster)
    const auraLayer = renderAuraLayer(equipped.aura, stage, palette);

    // 3. Wings layer (behind body)
    const wingsLayer = renderWingsLayer(stage, equipped.wings, palette);

    // 4. Tail layer (behind body)
    const tailLayer = renderTailLayer(stage, equipped.tail, palette);

    // 5. Backpack layer (behind body)
    const backpackLayer = renderBackpackLayer(stage, equipped.backpack);

    // 6. Main monster body or egg
    let mainEntityLayer = '';
    if (stage === 'egg') {
      mainEntityLayer = renderEggWhole(palette, colorKey);
    } else if (stage === 'cracking_egg') {
      mainEntityLayer = renderEggCracking(palette, colorKey);
    } else {
      mainEntityLayer = renderMonsterBody(stage, palette, colorKey, equipped);
    }

    // 7. Foreground accessories (hats, glasses, handheld items)
    let fgAccessoryLayer = '';
    if (stage !== 'egg' && stage !== 'cracking_egg') {
      fgAccessoryLayer = renderForegroundAccessories(stage, equipped, palette);
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="${size}" height="${size}" class="eaa-monster-svg ${animClass}" data-stage="${stage}" data-color="${colorKey}">
        ${defs}
        ${bgLayer}
        ${auraLayer}
        ${wingsLayer}
        ${tailLayer}
        ${backpackLayer}
        ${mainEntityLayer}
        ${fgAccessoryLayer}
      </svg>
    `.trim();
  }

  // --- BACKGROUND LAYER ---
  function renderBackgroundLayer(bgId, stage) {
    if (!bgId || bgId === 'none') {
      return `<ellipse cx="100" cy="180" rx="55" ry="12" fill="rgba(15, 23, 42, 0.14)" />`;
    }

    if (bgId === 'bg-meadow') {
      return `
        <rect x="0" y="0" width="200" height="200" rx="16" fill="#f0fdf4" />
        <circle cx="100" cy="195" r="70" fill="#bbf7d0" opacity="0.6" />
        <ellipse cx="100" cy="180" rx="60" ry="12" fill="rgba(22, 101, 52, 0.18)" />
        <circle cx="30" cy="30" r="14" fill="#fef08a" opacity="0.8" />
      `;
    }

    if (bgId === 'bg-cosmos') {
      return `
        <rect x="0" y="0" width="200" height="200" rx="16" fill="#090d16" />
        <circle cx="35" cy="35" r="1.5" fill="#ffffff" opacity="0.9" />
        <circle cx="160" cy="40" r="1.2" fill="#ffffff" opacity="0.8" />
        <circle cx="175" cy="120" r="1.5" fill="#38bdf8" opacity="0.9" />
        <circle cx="25" cy="130" r="1" fill="#f472b6" opacity="0.8" />
        <circle cx="100" cy="25" r="2" fill="#facc15" opacity="0.9" />
        <ellipse cx="100" cy="180" rx="60" ry="12" fill="rgba(56, 189, 248, 0.25)" />
      `;
    }

    if (bgId === 'bg-crystal') {
      return `
        <rect x="0" y="0" width="200" height="200" rx="16" fill="#082f49" />
        <polygon points="20,180 35,110 50,180" fill="#38bdf8" opacity="0.4" />
        <polygon points="150,180 168,95 186,180" fill="#06b6d4" opacity="0.5" />
        <ellipse cx="100" cy="180" rx="62" ry="14" fill="rgba(6, 182, 212, 0.3)" />
      `;
    }

    if (bgId === 'bg-castle') {
      return `
        <rect x="0" y="0" width="200" height="200" rx="16" fill="#fef3c7" />
        <rect x="25" y="100" width="24" height="80" fill="#e2e8f0" />
        <polygon points="20,100 37,70 54,100" fill="#ef4444" />
        <rect x="151" y="100" width="24" height="80" fill="#e2e8f0" />
        <polygon points="146,100 163,70 180,100" fill="#ef4444" />
        <ellipse cx="100" cy="180" rx="60" ry="12" fill="rgba(120, 53, 15, 0.16)" />
      `;
    }

    return `<ellipse cx="100" cy="180" rx="55" ry="12" fill="rgba(15, 23, 42, 0.14)" />`;
  }

  // --- AURA LAYER ---
  function renderAuraLayer(auraId, stage, palette) {
    if (stage === 'egg') return '';

    if ((stage === 'ultimate' || stage === 'advanced') && !auraId) {
      auraId = stage === 'ultimate' ? 'aura-cosmic' : 'aura-sparkle';
    }

    if (!auraId || auraId === 'none') return '';

    if (auraId === 'aura-sparkle' || auraId === 'aura-friendship') {
      return `
        <!-- Friendship Sparkles -->
        <g opacity="0.75">
          <circle cx="100" cy="115" r="70" fill="url(#mg-aura-glow)" filter="url(#mf-glow)" />
          <path d="M 40 80 Q 45 75 50 80 Q 45 85 40 80 Z" fill="#facc15" />
          <path d="M 155 70 Q 160 65 165 70 Q 160 75 155 70 Z" fill="#facc15" />
          <path d="M 35 130 Q 40 125 45 130 Q 40 135 35 130 Z" fill="#38bdf8" />
          <path d="M 160 135 Q 165 130 170 135 Q 165 140 160 135 Z" fill="#f472b6" />
        </g>
      `;
    }

    if (auraId === 'aura-flame') {
      return `
        <g opacity="0.65" filter="url(#mf-glow)">
          <path d="M 50 160 Q 60 90 100 65 Q 140 90 150 160 Z" fill="#fb923c" />
          <path d="M 65 160 Q 75 110 100 85 Q 125 110 135 160 Z" fill="#facc15" />
        </g>
      `;
    }

    if (auraId === 'aura-cosmic') {
      return `
        <g opacity="0.85" filter="url(#mf-glow)">
          <circle cx="100" cy="110" r="78" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="8 6" />
          <circle cx="100" cy="110" r="86" fill="none" stroke="#c084fc" stroke-width="1.8" stroke-dasharray="14 10" />
          <polygon points="100,20 103,28 111,28 105,33 107,41 100,36 93,41 95,33 89,28 97,28" fill="#facc15" />
          <polygon points="30,70 32,75 37,75 33,78 35,83 30,80 25,83 27,78 23,75 28,75" fill="#38bdf8" />
          <polygon points="170,75 172,80 177,80 173,83 175,88 170,85 165,88 167,83 163,80 168,80" fill="#f472b6" />
        </g>
      `;
    }

    return '';
  }

  // --- EGG 1: MYSTERY EGG ---
  function renderEggWhole(palette, colorKey) {
    return `
      <!-- Mystery Egg -->
      <g filter="url(#mf-shadow)">
        <!-- Egg Shell Base -->
        <path d="M 100 35 C 55 35 48 115 52 155 C 55 175 75 185 100 185 C 125 185 145 175 148 155 C 152 115 145 35 100 35 Z" fill="url(#mg-egg-${colorKey})" stroke="${palette.primaryDark}" stroke-width="3.5" stroke-linejoin="round" />

        <!-- Speckles & Spots -->
        <circle cx="78" cy="95" r="7" fill="${palette.primaryLight}" opacity="0.85" />
        <circle cx="120" cy="85" r="9" fill="${palette.primaryLight}" opacity="0.85" />
        <circle cx="95" cy="130" r="11" fill="${palette.primaryLight}" opacity="0.85" />
        <circle cx="68" cy="145" r="6" fill="${palette.primaryLight}" opacity="0.85" />
        <circle cx="132" cy="138" r="7.5" fill="${palette.primaryLight}" opacity="0.85" />

        <circle cx="88" cy="70" r="4.5" fill="${palette.accent}" opacity="0.35" />
        <circle cx="112" cy="110" r="5" fill="${palette.accent}" opacity="0.35" />

        <!-- Egg Shine Highlight -->
        <path d="M 72 55 C 65 65 62 85 64 105" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" fill="none" opacity="0.75" />
      </g>
    `;
  }

  // --- EGG 2: CRACKING EGG ---
  function renderEggCracking(palette, colorKey) {
    return `
      <!-- Cracking Egg with Glowing Fissures -->
      <g filter="url(#mf-shadow)">
        <!-- Egg Shell Base -->
        <path d="M 100 35 C 55 35 48 115 52 155 C 55 175 75 185 100 185 C 125 185 145 175 148 155 C 152 115 145 35 100 35 Z" fill="url(#mg-egg-${colorKey})" stroke="${palette.primaryDark}" stroke-width="3.5" stroke-linejoin="round" />

        <!-- Speckles -->
        <circle cx="75" cy="85" r="6" fill="${palette.primaryLight}" opacity="0.8" />
        <circle cx="125" cy="135" r="8" fill="${palette.primaryLight}" opacity="0.8" />
        <circle cx="70" cy="148" r="5" fill="${palette.primaryLight}" opacity="0.8" />

        <!-- Big Crack Opening showing curious glowing eyes inside -->
        <polygon points="76,105 88,98 96,112 115,100 126,112 108,122 92,116 82,126" fill="#0f172a" />

        <!-- Glowing Eyes Peeking Out! -->
        <circle cx="92" cy="110" r="5" fill="#fef08a" filter="url(#mf-glow)" />
        <circle cx="110" cy="108" r="5" fill="#fef08a" filter="url(#mf-glow)" />
        <circle cx="93" cy="110" r="2.5" fill="#0284c7" />
        <circle cx="111" cy="108" r="2.5" fill="#0284c7" />
        <circle cx="94.5" cy="108.5" r="1" fill="#ffffff" />
        <circle cx="112.5" cy="106.5" r="1" fill="#ffffff" />

        <!-- Jagged Crack Lines Across Shell -->
        <path d="M 100 38 L 94 52 L 104 62 L 96 78 L 108 88 L 115 100" fill="none" stroke="#fef08a" stroke-width="2.5" filter="url(#mf-glow)" />
        <path d="M 100 38 L 94 52 L 104 62 L 96 78 L 108 88 L 115 100" fill="none" stroke="#ffffff" stroke-width="1.2" />

        <path d="M 82 126 L 72 138 L 80 150 L 74 165 L 85 182" fill="none" stroke="#fef08a" stroke-width="2" filter="url(#mf-glow)" />
        <path d="M 82 126 L 72 138 L 80 150 L 74 165 L 85 182" fill="none" stroke="#ffffff" stroke-width="1" />

        <path d="M 126 112 L 138 120 L 132 135 L 144 148" fill="none" stroke="#fef08a" stroke-width="2" filter="url(#mf-glow)" />
        <path d="M 126 112 L 138 120 L 132 135 L 144 148" fill="none" stroke="#ffffff" stroke-width="1" />

        <!-- Highlights -->
        <path d="M 72 55 C 65 65 62 80 63 95" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" fill="none" opacity="0.75" />
      </g>
    `;
  }

  // --- WINGS LAYER ---
  function renderWingsLayer(stage, wingsId, palette) {
    if (stage === 'egg' || stage === 'cracking_egg') return '';

    let effectiveWings = wingsId;
    if (!effectiveWings || effectiveWings === 'default') {
      if (stage === 'adventurer') effectiveWings = 'wings-starter';
      else if (stage === 'advanced') effectiveWings = 'wings-dragon';
      else if (stage === 'ultimate') effectiveWings = 'wings-celestial';
      else return '';
    }

    if (effectiveWings === 'none' || effectiveWings === 'wings-none') return '';

    if (effectiveWings === 'wings-starter') {
      return `
        <g fill="${palette.primaryLight}" stroke="${palette.primaryDark}" stroke-width="2.2" opacity="0.95">
          <path d="M 60 105 C 30 90 20 115 35 130 C 45 138 58 125 62 118 Z" />
          <path d="M 140 105 C 170 90 180 115 165 130 C 155 138 142 125 138 118 Z" />
        </g>
      `;
    }

    if (effectiveWings === 'wings-dragon') {
      return `
        <g stroke="${palette.shadow}" stroke-width="3">
          <path d="M 65 110 C 25 70 10 95 15 125 C 25 115 40 120 48 135 C 55 125 60 122 68 125 Z" fill="${palette.primary}" />
          <path d="M 65 110 C 25 70 10 95 15 125" fill="none" stroke="${palette.accent}" stroke-width="3" />
          <path d="M 135 110 C 175 70 190 95 185 125 C 175 115 160 120 152 135 C 145 125 140 122 132 125 Z" fill="${palette.primary}" />
          <path d="M 135 110 C 175 70 190 95 185 125" fill="none" stroke="${palette.accent}" stroke-width="3" />
        </g>
      `;
    }

    if (effectiveWings === 'wings-celestial') {
      return `
        <g filter="url(#mf-shadow)">
          <g fill="url(#mg-gold-crown)" stroke="${palette.shadow}" stroke-width="2.5">
            <path d="M 68 110 C 15 50 0 85 10 135 C 25 125 40 135 50 145 C 58 132 64 128 72 122 Z" />
            <path d="M 68 110 C 25 70 15 95 24 135" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8" />
          </g>
          <g fill="url(#mg-gold-crown)" stroke="${palette.shadow}" stroke-width="2.5">
            <path d="M 132 110 C 185 50 200 85 190 135 C 175 125 160 135 150 145 C 142 132 136 128 128 122 Z" />
            <path d="M 132 110 C 175 70 185 95 176 135" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8" />
          </g>
        </g>
      `;
    }

    return '';
  }

  // --- TAIL LAYER ---
  function renderTailLayer(stage, tailId, palette) {
    if (stage === 'egg' || stage === 'cracking_egg') return '';

    let effectiveTail = tailId;
    if (!effectiveTail || effectiveTail === 'default') {
      if (stage === 'baby') effectiveTail = 'tail-puff';
      else if (stage === 'growing') effectiveTail = 'tail-perky';
      else if (stage === 'adventurer') effectiveTail = 'tail-spiked';
      else if (stage === 'advanced') effectiveTail = 'tail-dragon';
      else if (stage === 'ultimate') effectiveTail = 'tail-flame';
    }

    if (effectiveTail === 'none' || effectiveTail === 'tail-none') return '';

    if (effectiveTail === 'tail-puff') {
      return `
        <circle cx="145" cy="148" r="14" fill="${palette.primaryLight}" stroke="${palette.primaryDark}" stroke-width="2.5" />
      `;
    }

    if (effectiveTail === 'tail-perky' || effectiveTail === 'tail-spiked') {
      return `
        <path d="M 138 142 C 160 138 175 125 172 110 C 168 102 158 108 152 120 C 145 132 135 146 138 142 Z" fill="${palette.primary}" stroke="${palette.primaryDark}" stroke-width="2.5" />
        <polygon points="166,108 175,102 173,114" fill="${palette.accent}" />
      `;
    }

    if (effectiveTail === 'tail-dragon') {
      return `
        <path d="M 135 145 C 165 145 185 130 182 102 C 178 95 168 105 160 120 C 150 135 132 148 135 145 Z" fill="${palette.primaryDark}" stroke="${palette.shadow}" stroke-width="3" />
        <polygon points="182,102 192,94 186,108" fill="${palette.accent}" />
        <polygon points="172,116 182,110 176,122" fill="${palette.accent}" />
        <polygon points="160,128 170,124 164,134" fill="${palette.accent}" />
      `;
    }

    if (effectiveTail === 'tail-flame') {
      return `
        <g filter="url(#mf-glow)">
          <path d="M 135 145 C 165 140 185 120 180 95 C 170 85 162 105 152 125 Z" fill="#ea580c" stroke="#c2410c" stroke-width="2.5" />
          <path d="M 152 125 C 168 112 178 100 176 90 C 170 86 164 100 156 115 Z" fill="#facc15" />
        </g>
      `;
    }

    return '';
  }

  // --- BACKPACK LAYER ---
  function renderBackpackLayer(stage, backpackId) {
    if (stage === 'egg' || stage === 'cracking_egg' || !backpackId || backpackId === 'none') return '';

    if (backpackId === 'bp-explorer' || backpackId === 'backpack-explorer') {
      return `
        <!-- Explorer Leather Backpack -->
        <g filter="url(#mf-shadow)">
          <rect x="52" y="112" width="16" height="34" rx="4" fill="#92400e" stroke="#78350f" stroke-width="2" />
          <line x1="52" y1="124" x2="68" y2="124" stroke="#d97706" stroke-width="2" />
          <circle cx="60" cy="124" r="2.5" fill="#facc15" />
        </g>
      `;
    }

    if (backpackId === 'bp-book' || backpackId === 'backpack-book') {
      return `
        <g filter="url(#mf-shadow)">
          <rect x="48" y="110" width="20" height="36" rx="3" fill="#2563eb" stroke="#1d4ed8" stroke-width="2" />
          <polygon points="48,110 54,115 54,146 48,146" fill="#1e40af" />
          <circle cx="58" cy="126" r="4" fill="#facc15" />
          <line x1="58" y1="123" x2="58" y2="129" stroke="#1e40af" stroke-width="1.5" />
        </g>
      `;
    }

    return '';
  }

  // --- MAIN MONSTER BODY LAYER (Stages 3 to 7) ---
  function renderMonsterBody(stage, palette, colorKey, equipped) {
    let bodyY = 90;
    let bodyHeight = 88;
    let rx = 44;
    let ry = 42;
    let earScale = 1;

    if (stage === 'baby') {
      bodyY = 104;
      bodyHeight = 74;
      rx = 40;
      ry = 36;
      earScale = 0.8;
    } else if (stage === 'growing') {
      bodyY = 96;
      bodyHeight = 82;
      rx = 42;
      ry = 40;
      earScale = 1.0;
    } else if (stage === 'adventurer') {
      bodyY = 90;
      bodyHeight = 88;
      rx = 45;
      ry = 43;
      earScale = 1.2;
    } else if (stage === 'advanced') {
      bodyY = 85;
      bodyHeight = 94;
      rx = 48;
      ry = 46;
      earScale = 1.35;
    } else if (stage === 'ultimate') {
      bodyY = 82;
      bodyHeight = 98;
      rx = 50;
      ry = 48;
      earScale = 1.5;
    }

    const cX = 100;
    const cY = bodyY + ry;

    const hornsEarsMarkup = renderHornsAndEars(stage, palette, equipped, cX, bodyY, earScale);

    const feetMarkup = `
      <!-- Feet -->
      <g fill="${palette.primaryDark}" stroke="${palette.shadow}" stroke-width="2.5">
        <ellipse cx="${cX - 28}" cy="${bodyY + bodyHeight + 2}" rx="14" ry="9" />
        <ellipse cx="${cX + 28}" cy="${bodyY + bodyHeight + 2}" rx="14" ry="9" />
      </g>
    `;

    const torsoMarkup = `
      <!-- Main Body -->
      <g filter="url(#mf-shadow)">
        <ellipse cx="${cX}" cy="${cY}" rx="${rx}" ry="${ry}" fill="url(#mg-body-${colorKey})" stroke="${palette.primaryDark}" stroke-width="3.5" />
        
        <!-- Soft Belly Patch -->
        <ellipse cx="${cX}" cy="${cY + 12}" rx="${rx * 0.62}" ry="${ry * 0.55}" fill="url(#mg-belly-${colorKey})" />

        <!-- Arms -->
        <ellipse cx="${cX - rx + 4}" cy="${cY + 8}" rx="10" ry="16" transform="rotate(20, ${cX - rx + 4}, ${cY + 8})" fill="${palette.primary}" stroke="${palette.primaryDark}" stroke-width="2.5" />
        <ellipse cx="${cX + rx - 4}" cy="${cY + 8}" rx="10" ry="16" transform="rotate(-20, ${cX + rx - 4}, ${cY + 8})" fill="${palette.primary}" stroke="${palette.primaryDark}" stroke-width="2.5" />
      </g>
    `;

    const clothingMarkup = renderClothingLayer(equipped.clothing, cX, cY, rx, ry, palette);
    const faceMarkup = renderFaceElements(stage, palette, equipped, cX, cY);

    return `
      ${hornsEarsMarkup}
      ${feetMarkup}
      ${torsoMarkup}
      ${clothingMarkup}
      ${faceMarkup}
    `;
  }

  // --- CLOTHING LAYER ---
  function renderClothingLayer(clothingId, cX, cY, rx, ry, palette) {
    if (!clothingId || clothingId === 'none' || clothingId === 'clothing-none') return '';

    if (clothingId === 'clothing-vest') {
      return `
        <!-- Adventure Explorer Vest -->
        <g filter="url(#mf-shadow)">
          <path d="M ${cX - rx + 4} ${cY + 2} Q ${cX - 12} ${cY + 4} ${cX - 12} ${cY + ry - 4} L ${cX - rx + 8} ${cY + ry - 4} Z" fill="#78350f" stroke="#451a03" stroke-width="1.8" />
          <path d="M ${cX + rx - 4} ${cY + 2} Q ${cX + 12} ${cY + 4} ${cX + 12} ${cY + ry - 4} L ${cX + rx - 8} ${cY + ry - 4} Z" fill="#78350f" stroke="#451a03" stroke-width="1.8" />
          <circle cx="${cX - 8}" cy="${cY + 16}" r="2" fill="#facc15" />
          <circle cx="${cX - 8}" cy="${cY + 26}" r="2" fill="#facc15" />
        </g>
      `;
    }

    if (clothingId === 'clothing-cape') {
      return `
        <!-- Hero Cape -->
        <g filter="url(#mf-shadow)">
          <path d="M ${cX - 24} ${cY - 12} Q ${cX} ${cY - 6} ${cX + 24} ${cY - 12} L ${cX + 32} ${cY + ry + 10} Q ${cX} ${cY + ry + 2} ${cX - 32} ${cY + ry + 10} Z" fill="#dc2626" stroke="#991b1b" stroke-width="2" opacity="0.9" />
          <circle cx="${cX}" cy="${cY - 8}" r="4" fill="#facc15" stroke="#ca8a04" stroke-width="1.5" />
        </g>
      `;
    }

    if (clothingId === 'clothing-scarf') {
      return `
        <!-- Academy Striped Scarf -->
        <g filter="url(#mf-shadow)">
          <ellipse cx="${cX}" cy="${cY - 6}" rx="${rx * 0.75}" ry="7" fill="#2563eb" stroke="#1e40af" stroke-width="2" />
          <path d="M ${cX - 12} ${cY - 4} L ${cX - 16} ${cY + 24} L ${cX - 4} ${cY + 26} L ${cX} ${cY - 4} Z" fill="#2563eb" stroke="#1e40af" stroke-width="1.5" />
          <rect x="${cX - 15}" y="${cY + 6}" width="13" height="4" fill="#facc15" />
          <rect x="${cX - 15}" y="${cY + 16}" width="13" height="4" fill="#facc15" />
        </g>
      `;
    }

    if (clothingId === 'clothing-robe') {
      return `
        <!-- Mystic Scholar Robe -->
        <g filter="url(#mf-shadow)">
          <path d="M ${cX - rx + 4} ${cY} Q ${cX} ${cY + 8} ${cX + rx - 4} ${cY} L ${cX + rx} ${cY + ry + 4} L ${cX - rx} ${cY + ry + 4} Z" fill="#4338ca" stroke="#312e81" stroke-width="2" opacity="0.88" />
          <line x1="${cX}" y1="${cY + 6}" x2="${cX}" y2="${cY + ry + 4}" stroke="#facc15" stroke-width="2" />
          <polygon points="${cX},${cY + 18} ${cX+2},${cY+22} ${cX+6},${cY+22} ${cX+3},${cY+25} ${cX+4},${cY+29} ${cX},${cY+26} ${cX-4},${cY+29} ${cX-3},${cY+25} ${cX-6},${cY+22} ${cX-2},${cY+22}" fill="#facc15" />
        </g>
      `;
    }

    return '';
  }

  // --- HORNS & EARS ---
  function renderHornsAndEars(stage, palette, equipped, cX, topY, scale) {
    let hornId = equipped.horns;
    if (!hornId || hornId === 'default') {
      if (stage === 'ultimate') hornId = 'horns-crystal';
      else if (stage === 'advanced') hornId = 'horns-curved';
      else if (stage === 'adventurer') hornId = 'horns-nub';
      else hornId = 'horns-ears';
    }

    if (hornId === 'none' || hornId === 'horns-none') return '';

    if (hornId === 'horns-crystal' || hornId === 'horns-dragon') {
      return `
        <!-- Crystal Dragon Horns -->
        <g filter="url(#mf-shadow)">
          <path d="M ${cX - 28} ${topY + 12} C ${cX - 42} ${topY - 15} ${cX - 48} ${topY - 30} ${cX - 38} ${topY - 42} C ${cX - 24} ${topY - 26} ${cX - 18} ${topY - 6} ${cX - 16} ${topY + 14} Z" fill="url(#mg-crystal-horn)" stroke="${palette.shadow}" stroke-width="2.5" />
          <path d="M ${cX + 28} ${topY + 12} C ${cX + 42} ${topY - 15} ${cX + 48} ${topY - 30} ${cX + 38} ${topY - 42} C ${cX + 24} ${topY - 26} ${cX + 18} ${topY - 6} ${cX + 16} ${topY + 14} Z" fill="url(#mg-crystal-horn)" stroke="${palette.shadow}" stroke-width="2.5" />
        </g>
      `;
    }

    if (hornId === 'horns-curved') {
      return `
        <!-- Curved Ram / Dragon Horns -->
        <g fill="${palette.primaryDark}" stroke="${palette.shadow}" stroke-width="2.5" filter="url(#mf-shadow)">
          <path d="M ${cX - 26} ${topY + 12} C ${cX - 45} ${topY - 10} ${cX - 36} ${topY - 28} ${cX - 24} ${topY - 16} C ${cX - 16} ${topY} ${cX - 18} ${topY + 12} ${cX - 26} ${topY + 12} Z" />
          <path d="M ${cX + 26} ${topY + 12} C ${cX + 45} ${topY - 10} ${cX + 36} ${topY - 28} ${cX + 24} ${topY - 16} C ${cX + 16} ${topY} ${cX + 18} ${topY + 12} ${cX + 26} ${topY + 12} Z" />
        </g>
      `;
    }

    if (hornId === 'horns-nub') {
      return `
        <!-- Sprout Nub Horns -->
        <g fill="${palette.accent}" stroke="${palette.primaryDark}" stroke-width="2">
          <polygon points="${cX - 26},${topY + 10} ${cX - 32},${topY - 12} ${cX - 18},${topY + 6}" />
          <polygon points="${cX + 26},${topY + 10} ${cX + 32},${topY - 12} ${cX + 18},${topY + 6}" />
        </g>
      `;
    }

    // Default Floppy Monster Ears
    return `
      <!-- Cute Floppy Monster Ears -->
      <g filter="url(#mf-shadow)">
        <ellipse cx="${cX - 36 * scale}" cy="${topY + 12}" rx="${12 * scale}" ry="${16 * scale}" transform="rotate(-25, ${cX - 36 * scale}, ${topY + 12})" fill="${palette.primary}" stroke="${palette.primaryDark}" stroke-width="2.5" />
        <ellipse cx="${cX - 36 * scale}" cy="${topY + 12}" rx="${7 * scale}" ry="${10 * scale}" transform="rotate(-25, ${cX - 36 * scale}, ${topY + 12})" fill="${palette.cheek}" opacity="0.65" />
        <ellipse cx="${cX + 36 * scale}" cy="${topY + 12}" rx="${12 * scale}" ry="${16 * scale}" transform="rotate(25, ${cX + 36 * scale}, ${topY + 12})" fill="${palette.primary}" stroke="${palette.primaryDark}" stroke-width="2.5" />
        <ellipse cx="${cX + 36 * scale}" cy="${topY + 12}" rx="${7 * scale}" ry="${10 * scale}" transform="rotate(25, ${cX + 36 * scale}, ${topY + 12})" fill="${palette.cheek}" opacity="0.65" />
      </g>
    `;
  }

  // --- FACE ELEMENTS ---
  function renderFaceElements(stage, palette, equipped, cX, cY) {
    let eyesId = equipped.eyes;
    if (!eyesId || eyesId === 'default') {
      if (stage === 'advanced' || stage === 'ultimate') eyesId = 'eyes-dragon';
      else eyesId = 'eyes-sparkle';
    }
    const mouthId = equipped.mouth || 'mouth-smile';

    const eyeY = cY - 10;
    const eyeSpacing = 18;

    const cheeks = `
      <ellipse cx="${cX - 28}" cy="${eyeY + 16}" rx="8" ry="5" fill="${palette.cheek}" opacity="0.55" />
      <ellipse cx="${cX + 28}" cy="${eyeY + 16}" rx="8" ry="5" fill="${palette.cheek}" opacity="0.55" />
    `;

    let eyesMarkup = '';
    if (eyesId === 'eyes-wink') {
      eyesMarkup = `
        <path d="M ${cX - eyeSpacing - 8} ${eyeY} Q ${cX - eyeSpacing} ${eyeY - 6} ${cX - eyeSpacing + 8} ${eyeY}" stroke="#0f172a" stroke-width="3" stroke-linecap="round" fill="none" />
        <ellipse cx="${cX + eyeSpacing}" cy="${eyeY}" rx="9" ry="11" fill="#0f172a" />
        <circle cx="${cX + eyeSpacing - 2.5}" cy="${eyeY - 3}" r="4" fill="#ffffff" />
        <circle cx="${cX + eyeSpacing + 3}" cy="${eyeY + 3.5}" r="2" fill="#ffffff" />
      `;
    } else if (eyesId === 'eyes-happy') {
      eyesMarkup = `
        <path d="M ${cX - eyeSpacing - 9} ${eyeY + 2} Q ${cX - eyeSpacing} ${eyeY - 8} ${cX - eyeSpacing + 9} ${eyeY + 2}" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round" fill="none" />
        <path d="M ${cX + eyeSpacing - 9} ${eyeY + 2} Q ${cX + eyeSpacing} ${eyeY - 8} ${cX + eyeSpacing + 9} ${eyeY + 2}" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round" fill="none" />
      `;
    } else if (eyesId === 'eyes-dragon') {
      eyesMarkup = `
        <ellipse cx="${cX - eyeSpacing}" cy="${eyeY}" rx="9" ry="12" fill="#facc15" stroke="#ca8a04" stroke-width="1.5" />
        <ellipse cx="${cX - eyeSpacing}" cy="${eyeY}" rx="3.5" ry="9" fill="#0f172a" />
        <circle cx="${cX - eyeSpacing - 2.5}" cy="${eyeY - 4}" r="2.5" fill="#ffffff" />
        <ellipse cx="${cX + eyeSpacing}" cy="${eyeY}" rx="9" ry="12" fill="#facc15" stroke="#ca8a04" stroke-width="1.5" />
        <ellipse cx="${cX + eyeSpacing}" cy="${eyeY}" rx="3.5" ry="9" fill="#0f172a" />
        <circle cx="${cX + eyeSpacing - 2.5}" cy="${eyeY - 4}" r="2.5" fill="#ffffff" />
      `;
    } else {
      // eyes-sparkle (default)
      eyesMarkup = `
        <ellipse cx="${cX - eyeSpacing}" cy="${eyeY}" rx="9.5" ry="12" fill="#0f172a" />
        <circle cx="${cX - eyeSpacing - 2.5}" cy="${eyeY - 3.5}" r="4.2" fill="#ffffff" />
        <circle cx="${cX - eyeSpacing + 3.5}" cy="${eyeY + 3.5}" r="2.2" fill="#ffffff" />
        <ellipse cx="${cX + eyeSpacing}" cy="${eyeY}" rx="9.5" ry="12" fill="#0f172a" />
        <circle cx="${cX + eyeSpacing - 2.5}" cy="${eyeY - 3.5}" r="4.2" fill="#ffffff" />
        <circle cx="${cX + eyeSpacing + 3.5}" cy="${eyeY + 3.5}" r="2.2" fill="#ffffff" />
      `;
    }

    let mouthMarkup = '';
    const mouthY = eyeY + 16;
    if (mouthId === 'mouth-cheer' || mouthId === 'mouth-open') {
      mouthMarkup = `
        <path d="M ${cX - 9} ${mouthY} Q ${cX} ${mouthY + 14} ${cX + 9} ${mouthY} Z" fill="#e11d48" stroke="#9f1239" stroke-width="2" />
        <path d="M ${cX - 5} ${mouthY + 8} Q ${cX} ${mouthY + 6} ${cX + 5} ${mouthY + 8}" fill="#fda4af" />
      `;
    } else if (mouthId === 'mouth-toothy') {
      mouthMarkup = `
        <path d="M ${cX - 11} ${mouthY} Q ${cX} ${mouthY + 12} ${cX + 11} ${mouthY}" fill="#0f172a" stroke="#0f172a" stroke-width="2" />
        <polygon points="${cX - 6},${mouthY} ${cX - 4},${mouthY + 4} ${cX - 2},${mouthY}" fill="#ffffff" />
        <polygon points="${cX + 2},${mouthY} ${cX + 4},${mouthY + 4} ${cX + 6},${mouthY}" fill="#ffffff" />
      `;
    } else {
      mouthMarkup = `
        <path d="M ${cX - 8} ${mouthY} Q ${cX - 4} ${mouthY + 6} ${cX} ${mouthY + 2} Q ${cX + 4} ${mouthY + 6} ${cX + 8} ${mouthY}" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" />
      `;
    }

    return `
      ${cheeks}
      ${eyesMarkup}
      ${mouthMarkup}
    `;
  }

  // --- FOREGROUND ACCESSORIES ---
  function renderForegroundAccessories(stage, equipped, palette) {
    let hatMarkup = '';
    let glassesMarkup = '';
    let accessoryMarkup = '';

    let hatId = equipped.hat;
    if (!hatId || hatId === 'default') {
      if (stage === 'ultimate') hatId = 'hat-crown';
      else if (stage === 'adventurer') hatId = 'hat-explorer';
      else hatId = 'none';
    }

    const glassesId = equipped.glasses || 'none';
    const accId = equipped.accessory || 'none';

    if (hatId === 'hat-crown') {
      hatMarkup = `
        <g filter="url(#mf-shadow)">
          <polygon points="76,68 84,40 100,56 116,40 124,68" fill="url(#mg-gold-crown)" stroke="#ca8a04" stroke-width="2" stroke-linejoin="round" />
          <rect x="74" y="66" width="52" height="8" rx="2" fill="#eab308" stroke="#a16207" stroke-width="1.5" />
          <circle cx="100" cy="58" r="3.5" fill="#ef4444" />
          <circle cx="85" cy="48" r="2.5" fill="#3b82f6" />
          <circle cx="115" cy="48" r="2.5" fill="#10b981" />
        </g>
      `;
    } else if (hatId === 'hat-explorer') {
      hatMarkup = `
        <!-- Explorer Fedora -->
        <g filter="url(#mf-shadow)">
          <ellipse cx="100" cy="74" rx="42" ry="9" fill="#d97706" stroke="#92400e" stroke-width="2" />
          <path d="M 72 72 C 72 48 128 48 128 72 Z" fill="#b45309" stroke="#78350f" stroke-width="2" />
          <rect x="72" y="67" width="56" height="5" fill="#451a03" />
        </g>
      `;
    } else if (hatId === 'hat-wizard') {
      hatMarkup = `
        <g filter="url(#mf-shadow)">
          <ellipse cx="100" cy="74" rx="40" ry="8" fill="#4338ca" stroke="#312e81" stroke-width="2" />
          <path d="M 76 72 Q 100 20 120 18 Q 110 45 124 72 Z" fill="#4f46e5" stroke="#3730a3" stroke-width="2" />
          <polygon points="98,40 100,44 104,44 101,47 102,51 98,48 94,51 95,47 92,44 96,44" fill="#facc15" />
        </g>
      `;
    } else if (hatId === 'hat-scholar') {
      hatMarkup = `
        <g filter="url(#mf-shadow)">
          <polygon points="100,50 140,64 100,74 60,64" fill="#0f172a" stroke="#334155" stroke-width="2" />
          <rect x="80" y="70" width="40" height="10" rx="3" fill="#1e293b" />
          <line x1="100" y1="62" x2="132" y2="78" stroke="#facc15" stroke-width="2" />
          <circle cx="132" cy="79" r="2.5" fill="#facc15" />
        </g>
      `;
    }

    if (glassesId === 'glasses-round') {
      glassesMarkup = `
        <!-- Round Wire Glasses -->
        <g stroke="#0f172a" stroke-width="2.5" fill="rgba(255,255,255,0.25)">
          <circle cx="82" cy="118" r="12" />
          <circle cx="118" cy="118" r="12" />
          <line x1="94" y1="118" x2="106" y2="118" stroke-width="3" />
        </g>
      `;
    } else if (glassesId === 'glasses-goggles') {
      glassesMarkup = `
        <g filter="url(#mf-shadow)">
          <circle cx="82" cy="116" r="13" fill="#0284c7" stroke="#92400e" stroke-width="4" opacity="0.85" />
          <circle cx="118" cy="116" r="13" fill="#0284c7" stroke="#92400e" stroke-width="4" opacity="0.85" />
          <line x1="95" y1="116" x2="105" y2="116" stroke="#78350f" stroke-width="5" />
          <line x1="58" y1="116" x2="69" y2="116" stroke="#78350f" stroke-width="4" />
          <line x1="131" y1="116" x2="142" y2="116" stroke="#78350f" stroke-width="4" />
        </g>
      `;
    }

    if (accId === 'acc-microphone') {
      accessoryMarkup = `
        <!-- Golden Microphone -->
        <g filter="url(#mf-shadow)" transform="translate(138, 122) rotate(-15)">
          <rect x="0" y="14" width="8" height="26" rx="2" fill="#475569" stroke="#1e293b" stroke-width="1.5" />
          <ellipse cx="4" cy="8" rx="7" ry="9" fill="url(#mg-gold-crown)" stroke="#a16207" stroke-width="2" />
          <line x1="-3" y1="8" x2="11" y2="8" stroke="#ca8a04" stroke-width="1.2" />
          <line x1="4" y1="0" x2="4" y2="16" stroke="#ca8a04" stroke-width="1.2" />
        </g>
      `;
    } else if (accId === 'acc-book') {
      accessoryMarkup = `
        <g filter="url(#mf-shadow)" transform="translate(42, 130) rotate(15)">
          <rect x="0" y="0" width="22" height="28" rx="3" fill="#dc2626" stroke="#991b1b" stroke-width="2" />
          <rect x="4" y="2" width="16" height="24" rx="2" fill="#fef2f2" />
          <line x1="6" y1="8" x2="18" y2="8" stroke="#b91c1c" stroke-width="1.5" />
          <line x1="6" y1="14" x2="18" y2="14" stroke="#b91c1c" stroke-width="1.5" />
          <line x1="6" y1="20" x2="14" y2="20" stroke="#b91c1c" stroke-width="1.5" />
        </g>
      `;
    }

    return `
      ${hatMarkup}
      ${glassesMarkup}
      ${accessoryMarkup}
    `;
  }

  function getStageInfo(stageKey) {
    return STAGE_META[stageKey] || STAGE_META.baby;
  }

  root.MonsterRenderer = {
    renderMonsterSVG: renderMonsterSVG,
    getStageInfo: getStageInfo,
    palettes: MONSTER_PALETTES,
    stages: STAGE_META
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.MonsterRenderer;
  }

})(typeof window !== 'undefined' ? window : global);

