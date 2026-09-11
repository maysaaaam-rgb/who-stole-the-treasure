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
      accent: '#a855f7',
      purple: '#c084fc',
      purpleDark: '#7c3aed',
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
      purple: '#e879f9',
      purpleDark: '#a21caf',
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
      purple: '#a7f3d0',
      purpleDark: '#047857',
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
      purple: '#fcd34d',
      purpleDark: '#b45309',
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
      purple: '#38bdf8',
      purpleDark: '#0284c7',
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
      purple: '#c084fc',
      purpleDark: '#7c3aed',
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

  function normalizeStageKey(stage) {
    if (!stage) return 'baby';
    const s = String(stage).toLowerCase().trim();
    if (s === 'mystery egg' || s === 'egg' || s === 'lvl-1' || s === 'level 1') return 'egg';
    if (s === 'cracking egg' || s === 'cracking_egg' || s === 'cracking' || s === 'lvl-2' || s === 'level 2') return 'cracking_egg';
    if (s === 'baby monster' || s === 'baby' || s === 'lvl-3' || s === 'level 3') return 'baby';
    if (s === 'growing monster' || s === 'growing' || s === 'lvl-4' || s === 'level 4') return 'growing';
    if (s === 'adventurer monster' || s === 'adventurer' || s === 'lvl-5' || s === 'level 5') return 'adventurer';
    if (s === 'advanced monster' || s === 'advanced' || s === 'lvl-6' || s === 'level 6') return 'advanced';
    if (s === 'ultimate monster' || s === 'ultimate' || s === 'lvl-7' || s === 'level 7') return 'ultimate';
    if (STAGE_META[s]) return s;
    return 'baby';
  }

  /**
   * Main Render Function
   * @param {Object} options
   */
  function renderMonsterSVG(options = {}) {
    const stage = normalizeStageKey(options.stage);
    let colorKey = String(options.color || (options.equipped && options.equipped.body) || 'blue').toLowerCase().trim().replace(/^body-/, '');
    if (!MONSTER_PALETTES[colorKey]) colorKey = 'blue';
    const palette = MONSTER_PALETTES[colorKey] || MONSTER_PALETTES.blue;
    const equipped = Object.assign({}, options.equipped || {});
    const size = options.size || 200;
    const animated = options.animated !== false;

    const animClass = animated ? 'eaa-monster-animated' : '';

    let defs = `
      <defs>
        <!-- Gradients -->
        <linearGradient id="mg-egg-${colorKey}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${palette.primaryLight}" />
          <stop offset="40%" stop-color="${palette.primary}" />
          <stop offset="75%" stop-color="#818cf8" />
          <stop offset="100%" stop-color="${palette.purple || '#c084fc'}" />
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
          <stop offset="50%" stop-color="${palette.purple || '#c084fc'}" />
          <stop offset="100%" stop-color="${palette.purpleDark || '#7c3aed'}" />
        </linearGradient>

        <linearGradient id="mg-wing-advanced" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${palette.primaryLight}" />
          <stop offset="50%" stop-color="${palette.primary}" />
          <stop offset="100%" stop-color="${palette.purple || '#c084fc'}" />
        </linearGradient>

        <linearGradient id="mg-wing-celestial" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fffbeb" />
          <stop offset="40%" stop-color="#fde047" />
          <stop offset="75%" stop-color="#eab308" />
          <stop offset="100%" stop-color="${palette.purple || '#c084fc'}" />
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
    let bgLayer = '';
    try {
      bgLayer = renderBackgroundLayer(equipped.background, stage);
    } catch (e) {
      bgLayer = renderBackgroundLayer('bg-meadow', stage);
    }

    // 2. Aura layer (under monster)
    let auraLayer = '';
    try {
      auraLayer = renderAuraLayer(equipped.aura, stage, palette);
    } catch (e) {
      auraLayer = '';
    }

    // 3. Wings layer (behind body)
    let wingsLayer = '';
    try {
      wingsLayer = renderWingsLayer(stage, equipped.wings, palette);
    } catch (e) {
      wingsLayer = '';
    }

    // 4. Tail layer (behind body)
    let tailLayer = '';
    try {
      tailLayer = renderTailLayer(stage, equipped.tail, palette);
    } catch (e) {
      tailLayer = '';
    }

    // 5. Backpack layer (behind body)
    let backpackLayer = '';
    try {
      backpackLayer = renderBackpackLayer(stage, equipped.backpack);
    } catch (e) {
      backpackLayer = '';
    }

    // 6. Main monster body or egg
    let mainEntityLayer = '';
    try {
      if (stage === 'egg') {
        mainEntityLayer = renderEggWhole(palette, colorKey);
      } else if (stage === 'cracking_egg') {
        mainEntityLayer = renderEggCracking(palette, colorKey);
      } else {
        mainEntityLayer = renderMonsterBody(stage, palette, colorKey, equipped);
      }
    } catch (e) {
      try {
        mainEntityLayer = renderMonsterBody('baby', palette, colorKey, {});
      } catch (err2) {
        mainEntityLayer = '';
      }
    }

    // 7. Foreground accessories (hats, glasses, handheld items)
    let fgAccessoryLayer = '';
    if (stage !== 'egg' && stage !== 'cracking_egg') {
      try {
        fgAccessoryLayer = renderForegroundAccessories(stage, equipped, palette);
      } catch (e) {
        fgAccessoryLayer = '';
      }
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
      <!-- Level 1: Mystery Egg -->
      <g filter="url(#mf-shadow)" class="monster-egg-whole">
        <!-- Egg Shell Base (Pastel Blue & Lavender Gradient) -->
        <path d="M 100 42 C 64 42 54 112 58 148 C 62 170 78 180 100 180 C 122 180 138 170 142 148 C 146 112 136 42 100 42 Z" 
              fill="url(#mg-egg-${colorKey})" stroke="${palette.primaryDark}" stroke-width="3" stroke-linejoin="round" />

        <!-- Soft Speckles establishing character colors (pastel cyan & lavender) -->
        <circle cx="76" cy="92" r="6.5" fill="${palette.primaryLight}" opacity="0.85" />
        <circle cx="124" cy="84" r="8" fill="#e9d5ff" opacity="0.85" />
        <circle cx="94" cy="148" r="9.5" fill="${palette.primaryLight}" opacity="0.85" />
        <circle cx="68" cy="138" r="5.5" fill="#e9d5ff" opacity="0.8" />
        <circle cx="132" cy="136" r="7" fill="${palette.primaryLight}" opacity="0.85" />
        <circle cx="86" cy="68" r="4.5" fill="${palette.purple || '#c084fc'}" opacity="0.5" />
        <circle cx="114" cy="116" r="5" fill="#818cf8" opacity="0.45" />

        <!-- Translucent Inner Hint of the Monster's Cute Eyes & Rosy Blush through the shell -->
        <g opacity="0.42" filter="url(#mf-glow)">
          <path d="M 85 110 Q 92 104 99 110" fill="none" stroke="#1e1b4b" stroke-width="2.8" stroke-linecap="round" />
          <path d="M 101 110 Q 108 104 115 110" fill="none" stroke="#1e1b4b" stroke-width="2.8" stroke-linecap="round" />
          <ellipse cx="82" cy="118" rx="6.5" ry="4" fill="${palette.cheek}" />
          <ellipse cx="118" cy="118" rx="6.5" ry="4" fill="${palette.cheek}" />
        </g>

        <!-- Glossy Egg Highlight -->
        <path d="M 72 58 C 65 70 63 90 65 112" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" fill="none" opacity="0.75" />
        <circle cx="78" cy="54" r="2.5" fill="#ffffff" opacity="0.85" />
      </g>
    `;
  }

  // --- EGG 2: CRACKING EGG ---
  function renderEggCracking(palette, colorKey) {
    return `
      <!-- Level 2: Cracking Egg -->
      <g filter="url(#mf-shadow)" class="monster-egg-cracking">
        <!-- EXACT SAME Egg Shell Base as Level 1 -->
        <path d="M 100 42 C 64 42 54 112 58 148 C 62 170 78 180 100 180 C 122 180 138 170 142 148 C 146 112 136 42 100 42 Z" 
              fill="url(#mg-egg-${colorKey})" stroke="${palette.primaryDark}" stroke-width="3" stroke-linejoin="round" />

        <!-- EXACT SAME Speckles as Level 1 -->
        <circle cx="76" cy="92" r="6.5" fill="${palette.primaryLight}" opacity="0.85" />
        <circle cx="124" cy="84" r="8" fill="#e9d5ff" opacity="0.85" />
        <circle cx="94" cy="148" r="9.5" fill="${palette.primaryLight}" opacity="0.85" />
        <circle cx="68" cy="138" r="5.5" fill="#e9d5ff" opacity="0.8" />
        <circle cx="132" cy="136" r="7" fill="${palette.primaryLight}" opacity="0.85" />
        <circle cx="86" cy="68" r="4.5" fill="${palette.purple || '#c084fc'}" opacity="0.5" />
        <circle cx="114" cy="116" r="5" fill="#818cf8" opacity="0.45" />

        <!-- Glossy Egg Highlight -->
        <path d="M 72 58 C 65 70 63 90 65 112" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" fill="none" opacity="0.75" />
        <circle cx="78" cy="54" r="2.5" fill="#ffffff" opacity="0.85" />

        <!-- Glowing Fissure Seams -->
        <path d="M 100 42 L 95 62 L 105 76 L 96 95 L 105 106" fill="none" stroke="#fef08a" stroke-width="2.5" filter="url(#mf-glow)" />
        <path d="M 100 42 L 95 62 L 105 76 L 96 95 L 105 106" fill="none" stroke="#ffffff" stroke-width="1.2" />

        <path d="M 84 130 L 74 144 L 82 156 L 76 168 L 84 179" fill="none" stroke="#fef08a" stroke-width="2" filter="url(#mf-glow)" />
        <path d="M 84 130 L 74 144 L 82 156 L 76 168 L 84 179" fill="none" stroke="#ffffff" stroke-width="1" />

        <path d="M 124 116 L 136 126 L 130 142 L 140 155" fill="none" stroke="#fef08a" stroke-width="2" filter="url(#mf-glow)" />
        <path d="M 124 116 L 136 126 L 130 142 L 140 155" fill="none" stroke="#ffffff" stroke-width="1" />

        <!-- Crack Opening Revealing Interior -->
        <polygon points="76,108 92,100 100,107 114,99 126,110 118,126 102,122 88,128 78,122" fill="#0f172a" />

        <!-- Character's EXACT SAME Cute Eyes & Cheeks Peeking Out Through the Crack! -->
        <ellipse cx="84" cy="119" rx="5.5" ry="3.5" fill="${palette.cheek}" opacity="0.85" />
        <ellipse cx="116" cy="119" rx="5.5" ry="3.5" fill="${palette.cheek}" opacity="0.85" />

        <ellipse cx="92" cy="112" rx="7" ry="9" fill="#1e1b4b" stroke="${palette.primary}" stroke-width="0.8" />
        <circle cx="90" cy="109" r="3" fill="#ffffff" />
        <circle cx="94" cy="115" r="1.4" fill="#ffffff" />

        <ellipse cx="108" cy="112" rx="7" ry="9" fill="#1e1b4b" stroke="${palette.primary}" stroke-width="0.8" />
        <circle cx="106" cy="109" r="3" fill="#ffffff" />
        <circle cx="110" cy="115" r="1.4" fill="#ffffff" />

        <path d="M 97 103 Q 100 99 103 103" fill="none" stroke="${palette.primaryLight}" stroke-width="2" stroke-linecap="round" />
      </g>
    `;
  }

  // --- WINGS LAYER ---
  function renderWingsLayer(stage, wingsId, palette) {
    if (stage === 'egg' || stage === 'cracking_egg') return '';

    let effectiveWings = wingsId;
    if (!effectiveWings || effectiveWings === 'default') {
      if (stage === 'growing') effectiveWings = 'wings-buds';
      else if (stage === 'adventurer') effectiveWings = 'wings-starter';
      else if (stage === 'advanced') effectiveWings = 'wings-advanced';
      else if (stage === 'ultimate') effectiveWings = 'wings-celestial';
      else return '';
    }

    if (effectiveWings === 'none' || effectiveWings === 'wings-none') return '';

    if (effectiveWings === 'wings-buds') {
      return `
        <!-- Tiny Wing Buds (Level 4: Growing) -->
        <g class="monster-wings-layer wings-buds" fill="${palette.primaryLight}" stroke="${palette.primaryDark}" stroke-width="2" opacity="0.9">
          <ellipse cx="68" cy="112" rx="8" ry="12" transform="rotate(-30, 68, 112)" />
          <ellipse cx="132" cy="112" rx="8" ry="12" transform="rotate(30, 132, 112)" />
        </g>
      `;
    }

    if (effectiveWings === 'wings-starter' || effectiveWings === 'wings-flutter') {
      return `
        <!-- Starter Flutter Wings (Level 5: Adventurer) -->
        <g class="monster-wings-layer wings-starter" fill="${palette.primaryLight}" stroke="${palette.primaryDark}" stroke-width="2.2" opacity="0.95" filter="url(#mf-shadow)">
          <path d="M 64 104 C 36 88 26 112 40 126 C 50 134 60 122 66 114 Z" />
          <path d="M 136 104 C 164 88 174 112 160 126 C 150 134 140 122 134 114 Z" />
        </g>
      `;
    }

    if (effectiveWings === 'wings-advanced' || effectiveWings === 'wings-dragon') {
      return `
        <!-- Advanced Graceful Wings (Level 6: Advanced) -->
        <g class="monster-wings-layer wings-advanced" filter="url(#mf-shadow)">
          <g fill="url(#mg-wing-advanced)" stroke="${palette.shadow}" stroke-width="2.2">
            <path d="M 66 100 C 26 56 10 84 18 118 C 28 108 42 118 50 132 C 56 120 62 116 70 116 Z" />
            <path d="M 66 100 C 35 72 22 90 28 120" fill="none" stroke="#ffffff" stroke-width="1.8" opacity="0.75" />
          </g>
          <g fill="url(#mg-wing-advanced)" stroke="${palette.shadow}" stroke-width="2.2">
            <path d="M 134 100 C 174 56 190 84 182 118 C 172 108 158 118 150 132 C 144 120 138 116 130 116 Z" />
            <path d="M 134 100 C 165 72 178 90 172 120" fill="none" stroke="#ffffff" stroke-width="1.8" opacity="0.75" />
          </g>
        </g>
      `;
    }

    if (effectiveWings === 'wings-celestial') {
      return `
        <!-- Celestial Sovereign Wings (Level 7: Ultimate) -->
        <g class="monster-wings-layer wings-celestial" filter="url(#mf-shadow)">
          <g fill="url(#mg-wing-celestial)" stroke="${palette.shadow}" stroke-width="2.2">
            <path d="M 66 96 C 8 32 -8 72 4 128 C 20 116 36 128 46 140 C 54 124 60 118 70 114 Z" />
            <path d="M 66 96 C 18 56 8 84 16 126" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.85" />
            <path d="M 134 96 C 192 32 208 72 196 128 C 180 116 164 128 154 140 C 146 124 140 118 130 114 Z" />
            <path d="M 134 96 C 182 56 192 84 184 126" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.85" />
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
      else if (stage === 'adventurer') effectiveTail = 'tail-perky';
      else if (stage === 'advanced') effectiveTail = 'tail-dragon';
      else if (stage === 'ultimate') effectiveTail = 'tail-celestial';
    }

    if (effectiveTail === 'none' || effectiveTail === 'tail-none') return '';

    if (effectiveTail === 'tail-puff') {
      return `
        <!-- Cute Baby Puff Tail (Level 3) -->
        <circle cx="134" cy="140" r="10" fill="${palette.primaryLight}" stroke="${palette.primaryDark}" stroke-width="2.2" />
      `;
    }

    if (effectiveTail === 'tail-perky' || effectiveTail === 'tail-spiked') {
      return `
        <!-- Perky Explorer Tail (Levels 4 & 5) -->
        <g class="monster-tail-layer">
          <path d="M 134 134 C 154 128 168 116 164 102 C 160 96 152 100 146 112 C 140 122 132 134 134 134 Z" fill="${palette.primary}" stroke="${palette.primaryDark}" stroke-width="2.4" />
          <ellipse cx="163" cy="102" rx="6" ry="6" fill="${palette.purple || '#c084fc'}" />
        </g>
      `;
    }

    if (effectiveTail === 'tail-dragon') {
      return `
        <!-- Advanced Dragon Tail (Level 6) -->
        <g class="monster-tail-layer">
          <path d="M 132 136 C 162 132 178 118 174 94 C 170 88 162 96 154 110 C 144 124 128 138 132 136 Z" fill="${palette.primaryDark}" stroke="${palette.shadow}" stroke-width="2.6" />
          <polygon points="174,94 182,86 178,100" fill="${palette.purple || '#c084fc'}" />
          <polygon points="166,108 174,102 168,114" fill="${palette.purple || '#c084fc'}" />
        </g>
      `;
    }

    if (effectiveTail === 'tail-celestial' || effectiveTail === 'tail-flame') {
      return `
        <!-- Ultimate Celestial Tail (Level 7) -->
        <g class="monster-tail-layer" filter="url(#mf-glow)">
          <path d="M 132 136 C 166 130 184 112 178 86 C 168 78 160 98 150 116 Z" fill="${palette.primaryDark}" stroke="${palette.shadow}" stroke-width="2.6" />
          <polygon points="178,86 188,76 184,94" fill="#facc15" />
          <circle cx="182" cy="84" r="3.5" fill="#fde047" />
        </g>
      `;
    }

    return '';
  }

  // --- BACKPACK LAYER ---
  function renderBackpackLayer(stage, backpackId) {
    if (stage === 'egg' || stage === 'cracking_egg') return '';

    let effBackpack = backpackId;
    if (!effBackpack || effBackpack === 'default') {
      if (stage === 'adventurer') effBackpack = 'bp-explorer';
      else effBackpack = 'none';
    }

    if (effBackpack === 'none' || effBackpack === 'backpack-none') return '';

    if (effBackpack === 'bp-explorer' || effBackpack === 'backpack-explorer') {
      return `
        <!-- Explorer Leather Backpack -->
        <g filter="url(#mf-shadow)">
          <rect x="52" y="106" width="16" height="34" rx="4" fill="#92400e" stroke="#78350f" stroke-width="2" />
          <line x1="52" y1="118" x2="68" y2="118" stroke="#d97706" stroke-width="2" />
          <circle cx="60" cy="118" r="2.5" fill="#facc15" />
        </g>
      `;
    }

    if (effBackpack === 'bp-book' || effBackpack === 'backpack-book') {
      return `
        <g filter="url(#mf-shadow)">
          <rect x="48" y="104" width="20" height="36" rx="3" fill="#2563eb" stroke="#1d4ed8" stroke-width="2" />
          <polygon points="48,104 54,109 54,140 48,140" fill="#1e40af" />
          <circle cx="58" cy="120" r="4" fill="#facc15" />
          <line x1="58" y1="117" x2="58" y2="123" stroke="#1e40af" stroke-width="1.5" />
        </g>
      `;
    }

    return '';
  }

  // --- MAIN MONSTER BODY LAYER (Stages 3 to 7) ---
  function renderMonsterBody(stage, palette, colorKey, equipped) {
    // Progressive growth scaling across the 5 character stages
    let bodyY = 114;
    let rx = 36;
    let ry = 34;
    let bellyRx = 23;
    let bellyRy = 20;
    let earScale = 0.85;
    let footY = 148;
    let footRx = 11;
    let footRy = 7;
    let footSpacing = 20;

    if (stage === 'baby') {
      bodyY = 114;
      rx = 36;
      ry = 34;
      bellyRx = 23;
      bellyRy = 20;
      earScale = 0.85;
      footY = 148;
      footRx = 11;
      footRy = 7;
      footSpacing = 20;
    } else if (stage === 'growing') {
      bodyY = 106;
      rx = 40;
      ry = 38;
      bellyRx = 25;
      bellyRy = 23;
      earScale = 0.95;
      footY = 148;
      footRx = 12.5;
      footRy = 7.5;
      footSpacing = 22;
    } else if (stage === 'adventurer') {
      bodyY = 100;
      rx = 43;
      ry = 42;
      bellyRx = 27;
      bellyRy = 25;
      earScale = 1.05;
      footY = 148;
      footRx = 13.5;
      footRy = 8;
      footSpacing = 24;
    } else if (stage === 'advanced') {
      bodyY = 94;
      rx = 46;
      ry = 46;
      bellyRx = 29;
      bellyRy = 28;
      earScale = 1.15;
      footY = 148;
      footRx = 14.5;
      footRy = 8.5;
      footSpacing = 25;
    } else if (stage === 'ultimate') {
      bodyY = 88;
      rx = 48;
      ry = 49;
      bellyRx = 30;
      bellyRy = 30;
      earScale = 1.25;
      footY = 148;
      footRx = 15.5;
      footRy = 9;
      footSpacing = 26;
    }

    const cX = 100;
    const cY = bodyY;

    const hornsEarsMarkup = renderHornsAndEars(stage, palette, equipped, cX, cY - ry, earScale);

    const feetMarkup = `
      <!-- Feet -->
      <g fill="${palette.primaryDark}" stroke="${palette.shadow}" stroke-width="2.5">
        <ellipse cx="${cX - footSpacing}" cy="${footY}" rx="${footRx}" ry="${footRy}" />
        <ellipse cx="${cX + footSpacing}" cy="${footY}" rx="${footRx}" ry="${footRy}" />
      </g>
    `;

    // Progressive arms
    let armsMarkup = '';
    if (stage === 'baby') {
      // Tiny baby paws curled happily on belly
      armsMarkup = `
        <ellipse cx="${cX - 14}" cy="${cY + 10}" rx="6.5" ry="5" transform="rotate(-15, ${cX - 14}, ${cY + 10})" fill="${palette.primary}" stroke="${palette.primaryDark}" stroke-width="2" />
        <ellipse cx="${cX + 14}" cy="${cY + 10}" rx="6.5" ry="5" transform="rotate(15, ${cX + 14}, ${cY + 10})" fill="${palette.primary}" stroke="${palette.primaryDark}" stroke-width="2" />
      `;
    } else if (stage === 'growing') {
      // Small arms reaching out slightly
      armsMarkup = `
        <ellipse cx="${cX - rx + 4}" cy="${cY + 6}" rx="7.5" ry="12" transform="rotate(20, ${cX - rx + 4}, ${cY + 6})" fill="${palette.primary}" stroke="${palette.primaryDark}" stroke-width="2.2" />
        <ellipse cx="${cX + rx - 4}" cy="${cY + 6}" rx="7.5" ry="12" transform="rotate(-20, ${cX + rx - 4}, ${cY + 6})" fill="${palette.primary}" stroke="${palette.primaryDark}" stroke-width="2.2" />
      `;
    } else {
      // Adventurer, Advanced, Ultimate arms
      armsMarkup = `
        <ellipse cx="${cX - rx + 4}" cy="${cY + 8}" rx="9" ry="14" transform="rotate(22, ${cX - rx + 4}, ${cY + 8})" fill="${palette.primary}" stroke="${palette.primaryDark}" stroke-width="2.4" />
        <ellipse cx="${cX + rx - 4}" cy="${cY + 8}" rx="9" ry="14" transform="rotate(-22, ${cX + rx - 4}, ${cY + 8})" fill="${palette.primary}" stroke="${palette.primaryDark}" stroke-width="2.4" />
      `;
    }

    const torsoMarkup = `
      <!-- Main Monster Body -->
      <g filter="url(#mf-shadow)">
        <ellipse cx="${cX}" cy="${cY}" rx="${rx}" ry="${ry}" fill="url(#mg-body-${colorKey})" stroke="${palette.primaryDark}" stroke-width="3" />
        
        <!-- Soft Belly Patch -->
        <ellipse cx="${cX}" cy="${cY + ry * 0.22}" rx="${bellyRx}" ry="${bellyRy}" fill="url(#mg-belly-${colorKey})" />

        ${armsMarkup}
      </g>
    `;

    const clothingMarkup = renderClothingLayer(equipped.clothing, cX, cY, rx, ry, palette);
    const faceMarkup = renderFaceElements(stage, palette, equipped, cX, cY, ry);

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
      else if (stage === 'advanced') hornId = 'horns-crystal';
      else if (stage === 'adventurer') hornId = 'horns-nub';
      else if (stage === 'growing') hornId = 'horns-nub';
      else hornId = 'none';
    }

    // Floppy Monster Ears are ALWAYS present to maintain signature character DNA across all stages!
    const earsMarkup = `
      <!-- Cute Floppy Monster Ears (Signature Character DNA) -->
      <g filter="url(#mf-shadow)" class="monster-ears">
        <ellipse cx="${cX - 34 * scale}" cy="${topY + 14 * scale}" rx="${11 * scale}" ry="${15 * scale}" transform="rotate(-25, ${cX - 34 * scale}, ${topY + 14 * scale})" fill="${palette.primary}" stroke="${palette.primaryDark}" stroke-width="2.5" />
        <ellipse cx="${cX - 34 * scale}" cy="${topY + 14 * scale}" rx="${6.5 * scale}" ry="${9.5 * scale}" transform="rotate(-25, ${cX - 34 * scale}, ${topY + 14 * scale})" fill="${palette.purple || '#c084fc'}" opacity="0.7" />
        <ellipse cx="${cX + 34 * scale}" cy="${topY + 14 * scale}" rx="${11 * scale}" ry="${15 * scale}" transform="rotate(25, ${cX + 34 * scale}, ${topY + 14 * scale})" fill="${palette.primary}" stroke="${palette.primaryDark}" stroke-width="2.5" />
        <ellipse cx="${cX + 34 * scale}" cy="${topY + 14 * scale}" rx="${6.5 * scale}" ry="${9.5 * scale}" transform="rotate(25, ${cX + 34 * scale}, ${topY + 14 * scale})" fill="${palette.purple || '#c084fc'}" opacity="0.7" />
      </g>
    `;

    if (hornId === 'none' || hornId === 'horns-none') {
      return earsMarkup;
    }

    // Horns that grow continuously from small sprout nubs (growing/adventurer) into majestic crystal horns (advanced/ultimate)
    let hornsMarkup = '';
    if (hornId === 'horns-crystal' || hornId === 'horns-dragon' || hornId === 'horns-curved') {
      hornsMarkup = `
        <!-- Elegant Curved Crystal Horns (Level 6 & 7) -->
        <g filter="url(#mf-shadow)">
          <path d="M ${cX - 22} ${topY + 10} C ${cX - 34} ${topY - 14} ${cX - 42} ${topY - 26} ${cX - 32} ${topY - 36} C ${cX - 20} ${topY - 22} ${cX - 14} ${topY - 4} ${cX - 12} ${topY + 12} Z" fill="url(#mg-crystal-horn)" stroke="${palette.shadow}" stroke-width="2.2" />
          <path d="M ${cX + 22} ${topY + 10} C ${cX + 34} ${topY - 14} ${cX + 42} ${topY - 26} ${cX + 32} ${topY - 36} C ${cX + 20} ${topY - 22} ${cX + 14} ${topY - 4} ${cX + 12} ${topY + 12} Z" fill="url(#mg-crystal-horn)" stroke="${palette.shadow}" stroke-width="2.2" />
        </g>
      `;
    } else if (hornId === 'horns-nub') {
      hornsMarkup = `
        <!-- Sprout Nub Horns (Level 4 & 5) -->
        <g fill="${palette.purple || '#c084fc'}" stroke="${palette.purpleDark || '#7c3aed'}" stroke-width="2" filter="url(#mf-shadow)">
          <polygon points="${cX - 16},${topY + 8} ${cX - 18},${topY - 6} ${cX - 10},${topY + 4}" />
          <polygon points="${cX + 16},${topY + 8} ${cX + 18},${topY - 6} ${cX + 10},${topY + 4}" />
        </g>
      `;
    }

    return `
      ${earsMarkup}
      ${hornsMarkup}
    `;
  }

  // --- FACE ELEMENTS ---
  function renderFaceElements(stage, palette, equipped, cX, cY, ry) {
    let eyesId = equipped.eyes;
    // CRITICAL: Always preserve signature anime sparkle eyes across ALL stages by default!
    if (!eyesId || eyesId === 'default') {
      eyesId = 'eyes-sparkle';
    }
    const mouthId = equipped.mouth || 'mouth-smile';

    const eyeY = cY - ry * 0.16;
    const eyeSpacing = stage === 'baby' ? 15 : (stage === 'growing' ? 16 : 17);

    // Warm signature pink blush cheeks
    const cheeks = `
      <ellipse cx="${cX - eyeSpacing - 9}" cy="${eyeY + 13}" rx="7" ry="4.5" fill="${palette.cheek}" opacity="0.65" />
      <ellipse cx="${cX + eyeSpacing + 9}" cy="${eyeY + 13}" rx="7" ry="4.5" fill="${palette.cheek}" opacity="0.65" />
    `;

    let eyesMarkup = '';
    if (eyesId === 'eyes-wink') {
      eyesMarkup = `
        <path d="M ${cX - eyeSpacing - 7} ${eyeY} Q ${cX - eyeSpacing} ${eyeY - 6} ${cX - eyeSpacing + 7} ${eyeY}" stroke="#0f172a" stroke-width="3" stroke-linecap="round" fill="none" />
        <ellipse cx="${cX + eyeSpacing}" cy="${eyeY}" rx="8.5" ry="11" fill="#1e1b4b" />
        <circle cx="${cX + eyeSpacing - 2.5}" cy="${eyeY - 3}" r="3.8" fill="#ffffff" />
        <circle cx="${cX + eyeSpacing + 2.5}" cy="${eyeY + 3}" r="1.8" fill="#ffffff" />
      `;
    } else if (eyesId === 'eyes-happy') {
      eyesMarkup = `
        <path d="M ${cX - eyeSpacing - 8} ${eyeY + 2} Q ${cX - eyeSpacing} ${eyeY - 8} ${cX - eyeSpacing + 8} ${eyeY + 2}" stroke="#0f172a" stroke-width="3.2" stroke-linecap="round" fill="none" />
        <path d="M ${cX + eyeSpacing - 8} ${eyeY + 2} Q ${cX + eyeSpacing} ${eyeY - 8} ${cX + eyeSpacing + 8} ${eyeY + 2}" stroke="#0f172a" stroke-width="3.2" stroke-linecap="round" fill="none" />
      `;
    } else {
      // Signature dark anime sparkle eyes with dual specular catchlights
      eyesMarkup = `
        <ellipse cx="${cX - eyeSpacing}" cy="${eyeY}" rx="8.5" ry="11" fill="#1e1b4b" stroke="${palette.primary}" stroke-width="0.8" />
        <circle cx="${cX - eyeSpacing - 2.5}" cy="${eyeY - 3.2}" r="3.8" fill="#ffffff" />
        <circle cx="${cX - eyeSpacing + 2.8}" cy="${eyeY + 3.2}" r="1.8" fill="#ffffff" />

        <ellipse cx="${cX + eyeSpacing}" cy="${eyeY}" rx="8.5" ry="11" fill="#1e1b4b" stroke="${palette.primary}" stroke-width="0.8" />
        <circle cx="${cX + eyeSpacing - 2.5}" cy="${eyeY - 3.2}" r="3.8" fill="#ffffff" />
        <circle cx="${cX + eyeSpacing + 2.8}" cy="${eyeY + 3.2}" r="1.8" fill="#ffffff" />
      `;
    }

    let mouthMarkup = '';
    const mouthY = eyeY + 14;
    if (mouthId === 'mouth-cheer' || mouthId === 'mouth-open') {
      mouthMarkup = `
        <path d="M ${cX - 8} ${mouthY} Q ${cX} ${mouthY + 13} ${cX + 8} ${mouthY} Z" fill="#e11d48" stroke="#9f1239" stroke-width="2" />
        <path d="M ${cX - 4} ${mouthY + 7} Q ${cX} ${mouthY + 5} ${cX + 4} ${mouthY + 7}" fill="#fda4af" />
      `;
    } else if (mouthId === 'mouth-toothy') {
      mouthMarkup = `
        <path d="M ${cX - 10} ${mouthY} Q ${cX} ${mouthY + 10} ${cX + 10} ${mouthY}" fill="#0f172a" stroke="#0f172a" stroke-width="2" />
        <polygon points="${cX - 5},${mouthY} ${cX - 3},${mouthY + 4} ${cX - 1},${mouthY}" fill="#ffffff" />
        <polygon points="${cX + 1},${mouthY} ${cX + 3},${mouthY + 4} ${cX + 5},${mouthY}" fill="#ffffff" />
      `;
    } else {
      // Gentle happy smile
      mouthMarkup = `
        <path d="M ${cX - 7} ${mouthY} Q ${cX} ${mouthY + 5.5} ${cX + 7} ${mouthY}" fill="none" stroke="#0f172a" stroke-width="2.4" stroke-linecap="round" />
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
        <!-- Sovereign Royal Crown (Level 7: Ultimate) -->
        <g filter="url(#mf-shadow)">
          <polygon points="80,56 86,30 100,44 114,30 120,56" fill="url(#mg-gold-crown)" stroke="#ca8a04" stroke-width="2" stroke-linejoin="round" />
          <rect x="78" y="54" width="44" height="6" rx="2" fill="#eab308" stroke="#a16207" stroke-width="1.2" />
          <circle cx="100" cy="46" r="3" fill="#ef4444" />
          <circle cx="87" cy="38" r="2.2" fill="#3b82f6" />
          <circle cx="113" cy="38" r="2.2" fill="#10b981" />
        </g>
      `;
    } else if (hatId === 'hat-explorer') {
      hatMarkup = `
        <!-- Adventurer Explorer Fedora (Level 5: Adventurer) -->
        <g filter="url(#mf-shadow)">
          <ellipse cx="100" cy="68" rx="38" ry="8" fill="#d97706" stroke="#92400e" stroke-width="2" />
          <path d="M 74 66 C 74 44 126 44 126 66 Z" fill="#b45309" stroke="#78350f" stroke-width="2" />
          <rect x="74" y="62" width="52" height="4.5" fill="#451a03" />
          <!-- Small feather accent -->
          <path d="M 116 62 Q 124 50 120 42" stroke="#facc15" stroke-width="2" stroke-linecap="round" fill="none" />
        </g>
        <!-- Adventurer Satchel Strap across chest -->
        <path d="M 78 98 L 118 126" stroke="#92400e" stroke-width="3" stroke-linecap="round" />
        <circle cx="98" cy="112" r="3" fill="#facc15" stroke="#ca8a04" stroke-width="1" />
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

  root.renderMonsterSVG = renderMonsterSVG;
  root.getStageInfo = getStageInfo;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.MonsterRenderer;
  }

})(typeof window !== 'undefined' ? window : global);

