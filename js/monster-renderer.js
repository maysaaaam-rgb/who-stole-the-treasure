/**
 * ENGLISH ADVENTURE ACADEMY — PREMIUM DATA-DRIVEN COMPOSABLE MONSTER RENDERER
 * 
 * High-Fidelity Vector Art Architecture:
 * - ONE SPECIES: "academy-companion" (Adorable magical fox/cat fantasy companion)
 * - PURE DATA-DRIVEN: 100% vector SVG with organic curves, 3D shading, highlights, and layers
 * - NO FLAT PNGs: Scalable to any size without quality loss
 * - 7 PHYSICAL EVOLUTION STAGES (Calculated from XP):
 *     Level 0: Egg (0 XP)
 *     Level 1: Baby (100 XP)
 *     Level 2: Tot (300 XP)
 *     Level 3: Young (700 XP)
 *     Level 4: Adventurer (1,200 XP)
 *     Level 5: Elite (2,500 XP)
 *     Level 6: Legendary (5,000 XP)
 * - BOY / GIRL STYLE: Dynamic hero crest vs. side satin ribbon flower/bow & silky bangs
 * - COMPOSABLE LAYERS (Z-Order):
 *     1. Dais & Shadow
 *     2. Background Aura / Effects
 *     3. Tail (Multi-layered plume with highlights)
 *     4. Back Accessories (Capes, Wings)
 *     5. Hind & Front Legs/Paws (Rounded with toe bean pads)
 *     6. Body & Belly (3D shading, organic chest curve, belly patch)
 *     7. Outfit (Anatomically fitted jacket, vest, cape, robe)
 *     8. Head & Cheek Fluff (Organic silhouette, rounded cheek fluff)
 *     9. Ears & Inner Ear Fluff (Curved outer shape, warm inner gradient, fluffy tufts)
 *    10. Face & Muzzle (Glossy anime eyes, rosy blush, dimensional muzzle, cute smile)
 *    11. Hair / Crest (Boy crest / Girl side bow & bangs)
 *    12. Accessories (Monarch crown, bows, glasses, bandana, badge, wizard hat)
 *    13. Apex Foreground Effects (Runic halo, floating stardust motes)
 */

(function(root) {
  'use strict';

  // 1. XP Thresholds & Progression Map
  const EVOLUTION_THRESHOLDS = [
    { level: 0, stageKey: 'egg', name: 'Egg', xpRequired: 0, subtitle: 'Enchanted Cosmic Egg' },
    { level: 1, stageKey: 'baby', name: 'Baby', xpRequired: 100, subtitle: 'Tiny & Cuddly Companion' },
    { level: 2, stageKey: 'tot', name: 'Tot', xpRequired: 300, subtitle: 'Playful & Growing Explorer' },
    { level: 3, stageKey: 'young', name: 'Young', xpRequired: 700, subtitle: 'Confident & Alert Partner' },
    { level: 4, stageKey: 'adventurer', name: 'Adventurer', xpRequired: 1200, subtitle: 'Quest-Ready Hero Guardian' },
    { level: 5, stageKey: 'elite', name: 'Elite', xpRequired: 2500, subtitle: 'Noble Fluent Academy Champion' },
    { level: 6, stageKey: 'legendary', name: 'Legendary', xpRequired: 5000, subtitle: 'Apex Mythic Sovereign Companion' }
  ];

  function getEvolutionStage(totalXP) {
    const xp = Number(totalXP) || 0;
    if (xp >= 5000) return 6;
    if (xp >= 2500) return 5;
    if (xp >= 1200) return 4;
    if (xp >= 700) return 3;
    if (xp >= 300) return 2;
    if (xp >= 100) return 1;
    return 0;
  }

  function getStageInfo(stageOrLevel) {
    if (typeof stageOrLevel === 'number') {
      const lvl = Math.max(0, Math.min(6, Math.floor(stageOrLevel)));
      return EVOLUTION_THRESHOLDS[lvl];
    }
    const s = String(stageOrLevel || '').toLowerCase().trim();
    const found = EVOLUTION_THRESHOLDS.find(t => t.stageKey === s || String(t.level) === s);
    return found || EVOLUTION_THRESHOLDS[1];
  }

  // 2. High-Fidelity Fur Palettes
  const FUR_PALETTES = {
    blue: {
      id: 'blue',
      name: 'Sky Azure',
      highlight: '#bae6fd',
      primaryLight: '#60a5fa',
      primary: '#3b82f6',
      primaryDark: '#1d4ed8',
      shadow: '#1e3a8a',
      ambientShadow: '#0f172a',
      bellyHighlight: '#ffffff',
      belly: '#eff6ff',
      bellyShadow: '#bfdbfe',
      innerEarTop: '#fbcfe8',
      innerEarBottom: '#f472b6',
      eyeColorLight: '#67e8f9',
      eyeColorMid: '#0284c7',
      eyeColorDark: '#082f49',
      glow: 'rgba(59, 130, 246, 0.45)'
    },
    purple: {
      id: 'purple',
      name: 'Lavender Arcane',
      highlight: '#f3e8ff',
      primaryLight: '#c084fc',
      primary: '#a855f7',
      primaryDark: '#7e22ce',
      shadow: '#581c87',
      ambientShadow: '#2e1065',
      bellyHighlight: '#ffffff',
      belly: '#faf5ff',
      bellyShadow: '#e9d5ff',
      innerEarTop: '#fbcfe8',
      innerEarBottom: '#f472b6',
      eyeColorLight: '#f0abfc',
      eyeColorMid: '#a855f7',
      eyeColorDark: '#3b0764',
      glow: 'rgba(168, 85, 247, 0.45)'
    },
    green: {
      id: 'green',
      name: 'Leaf Emerald',
      highlight: '#d1fae5',
      primaryLight: '#34d399',
      primary: '#10b981',
      primaryDark: '#047857',
      shadow: '#064e3b',
      ambientShadow: '#022c22',
      bellyHighlight: '#ffffff',
      belly: '#f0fdf4',
      bellyShadow: '#a7f3d0',
      innerEarTop: '#fecdd3',
      innerEarBottom: '#fb7185',
      eyeColorLight: '#6ee7b7',
      eyeColorMid: '#059669',
      eyeColorDark: '#064e3b',
      glow: 'rgba(16, 185, 129, 0.45)'
    },
    orange: {
      id: 'orange',
      name: 'Sunset Amber',
      highlight: '#ffedd5',
      primaryLight: '#fb923c',
      primary: '#f97316',
      primaryDark: '#c2410c',
      shadow: '#7c2d12',
      ambientShadow: '#431407',
      bellyHighlight: '#ffffff',
      belly: '#fff7ed',
      bellyShadow: '#fed7aa',
      innerEarTop: '#fecdd3',
      innerEarBottom: '#f43f5e',
      eyeColorLight: '#fde047',
      eyeColorMid: '#ea580c',
      eyeColorDark: '#7c2d12',
      glow: 'rgba(249, 115, 22, 0.45)'
    },
    pink: {
      id: 'pink',
      name: 'Berry Blossom',
      highlight: '#fce7f3',
      primaryLight: '#f472b6',
      primary: '#ec4899',
      primaryDark: '#be185d',
      shadow: '#831843',
      ambientShadow: '#500724',
      bellyHighlight: '#ffffff',
      belly: '#fdf2f8',
      bellyShadow: '#fbcfe8',
      innerEarTop: '#ffe4e6',
      innerEarBottom: '#fb7185',
      eyeColorLight: '#f472b6',
      eyeColorMid: '#db2777',
      eyeColorDark: '#831843',
      glow: 'rgba(236, 72, 153, 0.45)'
    }
  };

  function normalizeMonsterConfig(rawConfig = {}) {
    let data = rawConfig;
    if (rawConfig.monster && typeof rawConfig.monster === 'object') {
      data = Object.assign({}, rawConfig.monster, rawConfig);
    }

    let stage = 1;
    if (data.previewStage !== undefined) {
      stage = Number(data.previewStage);
    } else if (data.evolutionStage !== undefined) {
      stage = Number(data.evolutionStage);
    } else if (data.level !== undefined) {
      stage = Number(data.level);
    } else if (data.stage !== undefined) {
      stage = getStageInfo(data.stage).level;
    } else if (data.totalXP !== undefined || data.xp !== undefined) {
      stage = getEvolutionStage(data.totalXP || data.xp);
    }
    stage = Math.max(0, Math.min(6, isNaN(stage) ? 1 : stage));

    let colorKey = (data.furColor || data.baseColor || data.color || 'blue').toLowerCase().replace('body-', '');
    if (!FUR_PALETTES[colorKey]) colorKey = 'blue';

    let style = (data.style || data.monsterStyle || data.gender || 'boy').toLowerCase();
    if (style !== 'girl') style = 'boy';

    let eyes = (data.eyes || 'round').toLowerCase().replace('eyes-', '');
    if (!['round', 'sparkle', 'fierce', 'happy', 'curious'].includes(eyes)) eyes = 'round';

    let ears = (data.ears || 'fox').toLowerCase().replace('ears-', '');
    if (!['fox', 'cat', 'floppy', 'tufted'].includes(ears)) ears = 'fox';

    let tail = (data.tail || 'fluffy').toLowerCase().replace('tail-', '');
    if (!['fluffy', 'dragon', 'curly', 'twin'].includes(tail)) tail = 'fluffy';

    let outfit = (data.outfit || (data.equipped && data.equipped.clothing) || 'none').toLowerCase().replace('clothing-', '');
    if (outfit === 'null' || outfit === 'none') outfit = null;

    let accessory = (data.accessory || (data.equipped && (data.equipped.hat || data.equipped.accessory || data.equipped.glasses)) || 'none').toLowerCase();
    accessory = accessory.replace('hat-', '').replace('glasses-', '').replace('accessory-', '');
    if (accessory === 'null' || accessory === 'none') accessory = null;

    let aura = (data.aura || (data.equipped && (data.equipped.aura || data.equipped.wings)) || 'none').toLowerCase().replace('aura-', '').replace('wings-', '');
    if (aura === 'null' || aura === 'none') aura = null;

    return {
      species: 'academy-companion',
      evolutionStage: stage,
      style: style,
      furColor: colorKey,
      eyes: eyes,
      ears: ears,
      tail: tail,
      outfit: outfit,
      accessory: accessory,
      aura: aura
    };
  }

  let svgIdCounter = 0;

  /**
   * Premium Vector SVG Companion Generator
   */
  function renderMonsterSVG(rawConfig = {}, options = {}) {
    const config = normalizeMonsterConfig(rawConfig);
    const size = Number(options.size !== undefined ? options.size : (rawConfig.size !== undefined ? rawConfig.size : 300));
    const showPedestal = options.showPedestal !== undefined ? options.showPedestal : (rawConfig.showPedestal !== false);
    const animated = options.animated !== false && !options.paused && rawConfig.animated !== false;
    const customStyle = options.style || rawConfig.style || '';
    const className = options.className || rawConfig.className || '';

    const uid = 'mc_' + (++svgIdCounter) + '_' + Math.floor(Math.random() * 10000);
    const stage = config.evolutionStage;
    const pal = FUR_PALETTES[config.furColor] || FUR_PALETTES.blue;
    const isGirl = config.style === 'girl';

    // Organic Proportions Scaling across the 7 stages
    // Center point: X=200. Base: Y=334.
    const stageParams = {
      0: { headY: 190, headRX: 0, headRY: 0, bodyY: 200, bodyScale: 1.0, earL: 0, tailScale: 0 },
      1: { headY: 152, headRX: 74, headRY: 64, bodyY: 238, bodyScale: 0.72, earL: 52, tailScale: 0.68, legScale: 0.74, posture: 'baby' },
      2: { headY: 142, headRX: 71, headRY: 62, bodyY: 230, bodyScale: 0.84, earL: 64, tailScale: 0.86, legScale: 0.85, posture: 'tot' },
      3: { headY: 130, headRX: 68, headRY: 59, bodyY: 220, bodyScale: 0.98, earL: 78, tailScale: 1.05, legScale: 0.98, posture: 'young' },
      4: { headY: 120, headRX: 66, headRY: 57, bodyY: 212, bodyScale: 1.10, earL: 88, tailScale: 1.20, legScale: 1.08, posture: 'adventurer' },
      5: { headY: 110, headRX: 64, headRY: 55, bodyY: 202, bodyScale: 1.22, earL: 98, tailScale: 1.35, legScale: 1.18, posture: 'elite' },
      6: { headY: 100, headRX: 62, headRY: 53, bodyY: 194, bodyScale: 1.32, earL: 108, tailScale: 1.50, legScale: 1.26, posture: 'legendary' }
    }[stage];

    // ==========================================
    // 1. DEFS (Lush Gradients, Shading, Filters)
    // ==========================================
    const defs = `
      <defs>
        <!-- Spherical Head Gradient with Soft 3D Highlight Dome -->
        <radialGradient id="${uid}_head_sphere" cx="42%" cy="28%" r="72%">
          <stop offset="0%" stop-color="${pal.highlight}" />
          <stop offset="35%" stop-color="${pal.primaryLight}" />
          <stop offset="78%" stop-color="${pal.primary}" />
          <stop offset="100%" stop-color="${pal.primaryDark}" />
        </radialGradient>

        <!-- Torso & Limb 3D Gradient -->
        <linearGradient id="${uid}_fur_body" x1="25%" y1="0%" x2="75%" y2="100%">
          <stop offset="0%" stop-color="${pal.highlight}" />
          <stop offset="25%" stop-color="${pal.primaryLight}" />
          <stop offset="70%" stop-color="${pal.primary}" />
          <stop offset="100%" stop-color="${pal.primaryDark}" />
        </linearGradient>

        <!-- Belly Cream Gradient (Soft 3D Pillow) -->
        <linearGradient id="${uid}_belly" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stop-color="${pal.bellyHighlight}" />
          <stop offset="65%" stop-color="${pal.belly}" />
          <stop offset="100%" stop-color="${pal.bellyShadow}" />
        </linearGradient>

        <!-- Inner Ear Rosy Peach Gradient -->
        <linearGradient id="${uid}_inner_ear" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stop-color="${pal.innerEarTop}" />
          <stop offset="100%" stop-color="${pal.innerEarBottom}" />
        </linearGradient>

        <!-- Anime RPG Irises (4-Stop Crystalline Radial Glow) -->
        <radialGradient id="${uid}_eye_iris" cx="42%" cy="32%" r="68%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
          <stop offset="22%" stop-color="${pal.eyeColorLight}" />
          <stop offset="60%" stop-color="${pal.eyeColorMid}" />
          <stop offset="90%" stop-color="${pal.eyeColorDark}" />
          <stop offset="100%" stop-color="#020617" />
        </radialGradient>

        <!-- Pedestal Arcane Crystal Base -->
        <linearGradient id="${uid}_pedestal_top" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="50%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
        <linearGradient id="${uid}_pedestal_glow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${pal.primaryLight}" stop-opacity="0.3" />
          <stop offset="50%" stop-color="${pal.highlight}" stop-opacity="0.95" />
          <stop offset="100%" stop-color="${pal.primaryLight}" stop-opacity="0.3" />
        </linearGradient>

        <!-- Egg Cosmic Radiant -->
        <radialGradient id="${uid}_egg_grad" cx="35%" cy="28%" r="75%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="25%" stop-color="${pal.highlight}" />
          <stop offset="65%" stop-color="${pal.primary}" />
          <stop offset="100%" stop-color="${pal.shadow}" />
        </radialGradient>

        <!-- Soft Glow & Shading Filters -->
        <filter id="${uid}_glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="${uid}_soft_shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#020617" flood-opacity="0.35" />
        </filter>
        <filter id="${uid}_deep_shadow" x="-25%" y="-20%" width="150%" height="145%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000000" flood-opacity="0.45" />
        </filter>
      </defs>
    `;

    // ==========================================
    // 2. LAYER: PEDESTAL & SHADOW
    // ==========================================
    let pedestalSVG = '';
    if (showPedestal) {
      pedestalSVG = `
        <g id="layer-pedestal" class="monster-layer layer-pedestal" data-layer="pedestal">
          <ellipse cx="200" cy="346" rx="146" ry="32" fill="#000000" opacity="0.45" filter="url(#${uid}_glow)" />
          <ellipse cx="200" cy="340" rx="138" ry="24" fill="url(#${uid}_pedestal_top)" stroke="url(#${uid}_pedestal_glow)" stroke-width="2.5" />
          <ellipse cx="200" cy="338" rx="114" ry="17" fill="#090d16" stroke="${pal.primaryLight}" stroke-width="1.8" stroke-dasharray="12 6" opacity="0.85" />
          <ellipse cx="200" cy="337" rx="84" ry="11" fill="none" stroke="${pal.highlight}" stroke-width="1.2" opacity="0.65" />
        </g>
      `;
    }

    // ==========================================
    // 3. LAYER: AURA & AMBIENT EFFECTS (Behind Monster)
    // ==========================================
    let auraSVG = '';
    if (config.aura === 'glow' || stage === 6) {
      auraSVG = `
        <g id="layer-aura" class="monster-layer layer-aura" data-layer="aura">
          <circle cx="200" cy="205" r="160" fill="${pal.glow}" filter="url(#${uid}_glow)" opacity="${stage === 6 ? '0.7' : '0.42'}" />
          ${stage === 6 ? `
            <circle cx="200" cy="205" r="176" fill="none" stroke="${pal.highlight}" stroke-width="2.5" stroke-dasharray="18 12" opacity="0.8">
              ${animated ? '<animateTransform attributeName="transform" type="rotate" from="0 200 205" to="360 200 205" dur="20s" repeatCount="indefinite"/>' : ''}
            </circle>
          ` : ''}
        </g>
      `;
    } else if (config.aura === 'star_glow' || config.aura === 'stars') {
      auraSVG = `
        <g id="layer-aura" class="monster-layer layer-aura" data-layer="aura">
          <circle cx="200" cy="205" r="150" fill="${pal.glow}" filter="url(#${uid}_glow)" opacity="0.45" />
          <g fill="#fbbf24" stroke="#f59e0b" stroke-width="1">
            <path d="M 75,115 L 79,127 L 91,129 L 81,136 L 84,148 L 75,140 L 66,148 L 69,136 L 59,129 L 71,127 Z" opacity="0.9" />
            <path d="M 325,110 L 328,119 L 338,121 L 330,126 L 332,135 L 325,129 L 318,135 L 320,126 L 312,121 L 322,119 Z" opacity="0.9" />
            <path d="M 90,265 L 92,272 L 100,273 L 94,277 L 96,285 L 90,280 L 84,285 L 86,277 L 80,273 L 88,272 Z" opacity="0.8" />
            <path d="M 310,260 L 312,267 L 320,268 L 314,272 L 316,280 L 310,275 L 304,280 L 306,272 L 300,268 L 308,267 Z" opacity="0.8" />
          </g>
        </g>
      `;
    } else if (config.aura === 'sparks') {
      auraSVG = `
        <g id="layer-aura" class="monster-layer layer-aura" data-layer="aura">
          <circle cx="200" cy="205" r="140" fill="${pal.glow}" filter="url(#${uid}_glow)" opacity="0.35" />
          <g stroke="${pal.highlight}" stroke-width="2.5" stroke-linecap="round">
            <path d="M 68,160 L 80,180 L 74,198 L 88,216" />
            <path d="M 332,155 L 320,175 L 326,193 L 312,210" />
            <circle cx="90" cy="150" r="3.5" fill="#ffffff" />
            <circle cx="310" cy="145" r="3.5" fill="#ffffff" />
          </g>
        </g>
      `;
    } else if (config.aura === 'wings') {
      auraSVG = `
        <g id="layer-aura" class="monster-layer layer-aura" data-layer="aura" opacity="0.92">
          <path d="M 160,175 C 105,70 30,85 15,145 C 2,190 60,230 152,212 Z" fill="url(#${uid}_inner_ear)" opacity="0.6" stroke="${pal.highlight}" stroke-width="2.5" />
          <path d="M 240,175 C 295,70 370,85 385,145 C 398,190 340,230 248,212 Z" fill="url(#${uid}_inner_ear)" opacity="0.6" stroke="${pal.highlight}" stroke-width="2.5" />
        </g>
      `;
    }

    // ==========================================
    // 4. LEVEL 0: SPECIAL ENCHANTED EGG
    // ==========================================
    if (stage === 0) {
      return `
        <svg class="monster-svg ${className}" viewBox="0 0 400 400" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle; overflow:hidden; ${customStyle}" data-stage="0" data-species="academy-companion" data-color="${config.furColor}" data-style="${config.style}">
          ${defs}
          ${pedestalSVG}
          ${auraSVG}
          <g id="layer-nest" class="monster-layer layer-nest" filter="url(#${uid}_deep_shadow)">
            <ellipse cx="200" cy="308" rx="92" ry="35" fill="#78350f" />
            <ellipse cx="200" cy="304" rx="86" ry="30" fill="#92400e" stroke="#b45309" stroke-width="3" />
            <path d="M 118,303 Q 200,332 282,303" stroke="#d97706" stroke-width="3.5" fill="none" stroke-dasharray="12 6" />
          </g>
          <g id="layer-egg-body" class="monster-layer layer-body" filter="url(#${uid}_deep_shadow)">
            <ellipse cx="200" cy="222" rx="74" ry="96" fill="url(#${uid}_egg_grad)" stroke="${pal.highlight}" stroke-width="3" />
            <path d="M 158,165 C 150,195 150,225 164,248" stroke="#ffffff" stroke-width="6.5" stroke-linecap="round" opacity="0.7" fill="none" />
            <circle cx="182" cy="212" r="11" fill="#ffffff" opacity="0.75" filter="url(#${uid}_glow)" />
            <circle cx="230" cy="242" r="9" fill="#ffffff" opacity="0.7" filter="url(#${uid}_glow)" />
            <circle cx="195" cy="268" r="8" fill="#ffffff" opacity="0.6" filter="url(#${uid}_glow)" />
            <path d="M 194,185 L 206,200 L 198,212 L 214,228" stroke="#ffffff" stroke-width="2.8" fill="none" opacity="0.9" filter="url(#${uid}_glow)" />
          </g>
        </svg>
      `.trim();
    }

    // ==========================================
    // 5. LAYER: TAIL (Lush, Sweeping Plume)
    // ==========================================
    const tScale = stageParams.tailScale;
    let tailSVG = '';
    if (config.tail === 'fluffy') {
      tailSVG = `
        <g id="layer-tail" class="monster-layer layer-tail" data-layer="tail" filter="url(#${uid}_deep_shadow)">
          <g transform="translate(200, 260) scale(${tScale}) translate(-200, -260)">
            <path d="M 235,275 C 330,290 385,215 358,140 C 336,88 268,115 248,155 C 238,175 228,238 218,265 Z" fill="${pal.shadow}" />
            <path d="M 230,270 C 320,285 375,210 350,140 C 330,92 272,120 252,160 C 242,180 232,238 222,265 Z" fill="url(#${uid}_fur_body)" stroke="${pal.shadow}" stroke-width="2" />
            <path d="M 350,140 C 330,92 272,120 252,160 C 270,146 304,142 330,166 C 342,152 352,144 350,140 Z" fill="#ffffff" opacity="0.96" />
            <path d="M 342,168 Q 318,188 330,218" stroke="${pal.highlight}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.8" />
            <path d="M 318,202 Q 296,222 306,248" stroke="${pal.highlight}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.65" />
          </g>
        </g>
      `;
    } else if (config.tail === 'dragon') {
      tailSVG = `
        <g id="layer-tail" class="monster-layer layer-tail" data-layer="tail" filter="url(#${uid}_deep_shadow)">
          <g transform="translate(200, 260) scale(${tScale}) translate(-200, -260)">
            <path d="M 225,270 C 315,290 365,225 358,150 C 345,125 320,140 308,168 C 285,220 245,248 225,265 Z" fill="url(#${uid}_fur_body)" stroke="${pal.shadow}" stroke-width="2" />
            <polygon points="354,152 376,134 356,170" fill="${pal.highlight}" />
            <polygon points="346,182 368,170 348,200" fill="${pal.highlight}" />
            <polygon points="325,220 345,212 328,235" fill="${pal.highlight}" />
          </g>
        </g>
      `;
    } else if (config.tail === 'curly') {
      tailSVG = `
        <g id="layer-tail" class="monster-layer layer-tail" data-layer="tail" filter="url(#${uid}_deep_shadow)">
          <g transform="translate(200, 260) scale(${tScale}) translate(-200, -260)">
            <path d="M 225,270 C 295,285 335,235 320,180 C 305,135 255,145 260,180 C 265,205 292,205 290,188" fill="url(#${uid}_fur_body)" stroke="${pal.shadow}" stroke-width="2.5" />
            <circle cx="280" cy="172" r="18" fill="#ffffff" opacity="0.9" />
          </g>
        </g>
      `;
    } else if (config.tail === 'twin' || stage === 6) {
      tailSVG = `
        <g id="layer-tail" class="monster-layer layer-tail" data-layer="tail" filter="url(#${uid}_deep_shadow)">
          <g transform="translate(200, 260) scale(${tScale}) translate(-200, -260)">
            <path d="M 165,275 C 70,290 15,215 42,140 C 64,88 132,115 152,155 C 162,175 172,238 182,265 Z" fill="url(#${uid}_fur_body)" stroke="${pal.shadow}" stroke-width="2" />
            <path d="M 42,140 C 64,88 132,115 152,155 C 134,146 100,142 74,166 C 62,152 52,144 42,140 Z" fill="#ffffff" opacity="0.96" />
            <path d="M 235,275 C 330,290 385,215 358,140 C 336,88 268,115 248,155 C 238,175 228,238 218,265 Z" fill="url(#${uid}_fur_body)" stroke="${pal.shadow}" stroke-width="2" />
            <path d="M 358,140 C 336,88 268,115 248,155 C 266,146 300,142 326,166 C 338,152 348,144 358,140 Z" fill="#ffffff" opacity="0.96" />
          </g>
        </g>
      `;
    }

    // ==========================================
    // 6. LAYER: HIND LEGS & FRONT PAWS
    // ==========================================
    const bScale = stageParams.bodyScale;
    const lScale = stageParams.legScale || 1.0;
    const legsSVG = `
      <g id="layer-legs" class="monster-layer layer-legs" data-layer="legs" filter="url(#${uid}_soft_shadow)">
        <g id="hind-haunches">
          <path d="M 116,296 C 104,270 120,238 146,252 C 164,262 160,302 134,314 C 118,314 112,306 116,296 Z" fill="${pal.shadow}" />
          <ellipse cx="130" cy="310" rx="25" ry="15" fill="url(#${uid}_fur_body)" stroke="${pal.shadow}" stroke-width="1.8" />
          
          <path d="M 284,296 C 296,270 280,238 254,252 C 236,262 240,302 266,314 C 282,314 288,306 284,296 Z" fill="${pal.shadow}" />
          <ellipse cx="270" cy="310" rx="25" ry="15" fill="url(#${uid}_fur_body)" stroke="${pal.shadow}" stroke-width="1.8" />
        </g>

        <g id="forelimbs" transform="translate(200, 308) scale(${lScale}) translate(-200, -308)">
          <path d="M 166,230 C 154,255 150,285 158,304 C 162,312 174,312 178,304 C 182,285 180,255 178,230 Z" fill="url(#${uid}_fur_body)" />
          <g transform="translate(164, 304)">
            <ellipse cx="0" cy="0" rx="17" ry="12" fill="url(#${uid}_fur_body)" stroke="${pal.shadow}" stroke-width="1.5" />
            <ellipse cx="-6" cy="3.5" rx="3.4" ry="2.8" fill="${pal.belly}" />
            <ellipse cx="0" cy="4.5" rx="3.8" ry="3" fill="${pal.belly}" />
            <ellipse cx="6" cy="3.5" rx="3.4" ry="2.8" fill="${pal.belly}" />
          </g>

          <path d="M 234,230 C 246,255 250,285 242,304 C 238,312 226,312 222,304 C 218,285 220,255 222,230 Z" fill="url(#${uid}_fur_body)" />
          <g transform="translate(236, 304)">
            <ellipse cx="0" cy="0" rx="17" ry="12" fill="url(#${uid}_fur_body)" stroke="${pal.shadow}" stroke-width="1.5" />
            <ellipse cx="-6" cy="3.5" rx="3.4" ry="2.8" fill="${pal.belly}" />
            <ellipse cx="0" cy="4.5" rx="3.8" ry="3" fill="${pal.belly}" />
            <ellipse cx="6" cy="3.5" rx="3.4" ry="2.8" fill="${pal.belly}" />
          </g>
        </g>
      </g>
    `;

    // ==========================================
    // 7. LAYER: TORSO & SOFT BELLY (Organic 3D Curves)
    // ==========================================
    const bY = stageParams.bodyY;
    const bodySVG = `
      <g id="layer-body" class="monster-layer layer-body" data-layer="body" filter="url(#${uid}_deep_shadow)">
        <g transform="translate(200, ${bY}) scale(${bScale}) translate(-200, -220)">
          <path d="M 158,172 
                   C 132,198 122,252 144,288 
                   C 158,308 242,308 256,288 
                   C 278,252 268,198 242,172 
                   C 226,156 174,156 158,172 Z" 
                fill="url(#${uid}_fur_body)" stroke="${pal.shadow}" stroke-width="2.2" />

          <path d="M 172,182 
                   C 150,208 146,256 160,284 
                   C 174,298 226,298 240,284 
                   C 254,256 250,208 228,182 
                   C 214,172 186,172 172,182 Z" 
                fill="url(#${uid}_belly)" />

          <path d="M 186,186 Q 200,200 214,186 Q 200,192 186,186 Z" fill="#ffffff" opacity="0.9" />
          ${stage >= 3 ? `
            <path d="M 180,202 Q 200,216 220,202 Q 200,208 180,202 Z" fill="#ffffff" opacity="0.8" />
          ` : ''}

          ${stage >= 5 ? `
            <path d="M 136,182 Q 168,206 200,190 Q 232,206 264,182" stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.95" />
          ` : ''}
        </g>
      </g>
    `;

    // ==========================================
    // 8. LAYER: OUTFITS (Anatomically Fitted)
    // ==========================================
    let outfitSVG = '';
    if (config.outfit === 'adventurer_jacket' || (stage >= 4 && !config.outfit)) {
      outfitSVG = `
        <g id="layer-outfit" class="monster-layer layer-outfit" data-layer="outfit" filter="url(#${uid}_soft_shadow)">
          <g transform="translate(200, ${bY}) scale(${bScale}) translate(-200, -220)">
            <path d="M 164,174 L 154,260 L 176,260 L 182,174 Z" fill="#78350f" stroke="#451a03" stroke-width="2" />
            <path d="M 236,174 L 246,260 L 224,260 L 218,174 Z" fill="#78350f" stroke="#451a03" stroke-width="2" />
            <rect x="148" y="248" width="104" height="15" rx="4" fill="#92400e" stroke="#451a03" stroke-width="1.8" />
            <rect x="188" y="243" width="24" height="25" rx="4" fill="#fbbf24" stroke="#b45309" stroke-width="2.2" />
            <rect x="194" y="249" width="12" height="13" rx="2" fill="#78350f" />
          </g>
        </g>
      `;
    } else if (config.outfit === 'vest') {
      outfitSVG = `
        <g id="layer-outfit" class="monster-layer layer-outfit" data-layer="outfit" filter="url(#${uid}_soft_shadow)">
          <g transform="translate(200, ${bY}) scale(${bScale}) translate(-200, -220)">
            <path d="M 160,176 L 150,266 L 180,266 L 190,184 Z" fill="#1e3a8a" stroke="#fbbf24" stroke-width="2.2" />
            <path d="M 240,176 L 250,266 L 220,266 L 210,184 Z" fill="#1e3a8a" stroke="#fbbf24" stroke-width="2.2" />
            <circle cx="200" cy="204" r="3.8" fill="#fbbf24" stroke="#d97706" stroke-width="1" />
            <circle cx="200" cy="225" r="3.8" fill="#fbbf24" stroke="#d97706" stroke-width="1" />
            <circle cx="200" cy="246" r="3.8" fill="#fbbf24" stroke="#d97706" stroke-width="1" />
          </g>
        </g>
      `;
    } else if (config.outfit === 'cape') {
      outfitSVG = `
        <g id="layer-outfit" class="monster-layer layer-outfit" data-layer="outfit" filter="url(#${uid}_soft_shadow)">
          <g transform="translate(200, ${bY}) scale(${bScale}) translate(-200, -220)">
            <path d="M 154,176 C 118,210 112,276 128,288 L 154,246 Z" fill="#dc2626" stroke="#991b1b" stroke-width="2.2" />
            <path d="M 246,176 C 282,210 288,276 272,288 L 246,246 Z" fill="#dc2626" stroke="#991b1b" stroke-width="2.2" />
            <circle cx="200" cy="180" r="9" fill="#fbbf24" stroke="#b45309" stroke-width="2.2" />
            <circle cx="200" cy="180" r="4" fill="#ef4444" />
          </g>
        </g>
      `;
    } else if (config.outfit === 'robe') {
      outfitSVG = `
        <g id="layer-outfit" class="monster-layer layer-outfit" data-layer="outfit" filter="url(#${uid}_soft_shadow)">
          <g transform="translate(200, ${bY}) scale(${bScale}) translate(-200, -220)">
            <path d="M 154,174 L 138,272 L 262,272 L 246,174 Z" fill="#4c1d95" opacity="0.94" stroke="#c084fc" stroke-width="2.2" />
            <path d="M 200,174 L 200,272" stroke="#fbbf24" stroke-width="2.8" />
          </g>
        </g>
      `;
    }

    // ==========================================
    // 9. LAYER: HEAD & CHUBBY CHEEK FLUFF
    // ==========================================
    const hY = stageParams.headY;
    const hRX = stageParams.headRX;
    const hRY = stageParams.headRY;
    const headSVG = `
      <g id="layer-head" class="monster-layer layer-head" data-layer="head" filter="url(#${uid}_deep_shadow)">
        <path d="M 200,${hY - hRY} 
                 C ${200 + hRX * 0.65},${hY - hRY} ${200 + hRX * 1.05},${hY - hRY * 0.45} ${200 + hRX * 1.08},${hY} 
                 C ${200 + hRX * 1.14},${hY + hRY * 0.25} ${200 + hRX * 1.18},${hY + hRY * 0.50} ${200 + hRX * 1.12},${hY + hRY * 0.65} 
                 Q ${200 + hRX * 1.22},${hY + hRY * 0.75} ${200 + hRX * 1.05},${hY + hRY * 0.85} 
                 Q ${200 + hRX * 1.12},${hY + hRY * 0.95} ${200 + hRX * 0.85},${hY + hRY * 1.02} 
                 C ${200 + hRX * 0.50},${hY + hRY * 1.08} ${200 + hRX * 0.20},${hY + hRY * 1.08} 200,${hY + hRY * 1.08} 
                 C ${200 - hRX * 0.20},${hY + hRY * 1.08} ${200 - hRX * 0.50},${hY + hRY * 1.08} ${200 - hRX * 0.85},${hY + hRY * 1.02} 
                 Q ${200 - hRX * 1.12},${hY + hRY * 0.95} ${200 - hRX * 1.05},${hY + hRY * 0.85} 
                 Q ${200 - hRX * 1.22},${hY + hRY * 0.75} ${200 - hRX * 1.12},${hY + hRY * 0.65} 
                 C ${200 - hRX * 1.18},${hY + hRY * 0.50} ${200 - hRX * 1.14},${hY + hRY * 0.25} ${200 - hRX * 1.08},${hY} 
                 C ${200 - hRX * 1.05},${hY - hRY * 0.45} ${200 - hRX * 0.65},${hY - hRY} 200,${hY - hRY} Z" 
              fill="url(#${uid}_head_sphere)" stroke="${pal.shadow}" stroke-width="2.6" />

        <path d="M ${200 - hRX * 1.00},${hY + hRY * 0.35} Q ${200 - hRX * 0.76},${hY + hRY * 0.60} ${200 - hRX * 0.52},${hY + hRY * 0.85}" stroke="${pal.highlight}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.75" />
        <path d="M ${200 + hRX * 1.00},${hY + hRY * 0.35} Q ${200 + hRX * 0.76},${hY + hRY * 0.60} ${200 + hRX * 0.52},${hY + hRY * 0.85}" stroke="${pal.highlight}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.75" />
      </g>
    `;

    // ==========================================
    // 10. LAYER: EARS & INNER EAR FLUFF
    // ==========================================
    const eL = stageParams.earL;
    let earsSVG = '';
    if (config.ears === 'fox') {
      earsSVG = `
        <g id="layer-ears" class="monster-layer layer-ears" data-layer="ears" filter="url(#${uid}_soft_shadow)">
          <g transform="translate(${200 - hRX * 0.50}, ${hY - hRY * 0.60})">
            <path d="M 0,0 C -12,-22 -${eL * 0.55},-${eL * 0.74} -${eL * 0.36},-${eL} C -${eL * 0.10},-${eL * 0.86} ${eL * 0.22},-${eL * 0.52} ${eL * 0.38},-${eL * 0.08} Z" fill="url(#${uid}_head_sphere)" stroke="${pal.shadow}" stroke-width="2.6" />
            <path d="M -4,-8 C -14,-22 -${eL * 0.42},-${eL * 0.66} -${eL * 0.26},-${eL * 0.86} C -${eL * 0.06},-${eL * 0.72} ${eL * 0.16},-${eL * 0.42} ${eL * 0.24},-${eL * 0.16} Z" fill="url(#${uid}_inner_ear)" />
            <path d="M -${eL * 0.22},-${eL * 0.32} Q 0,-${eL * 0.52} ${eL * 0.16},-${eL * 0.26}" stroke="#ffffff" stroke-width="3.6" fill="none" stroke-linecap="round" />
            <path d="M -${eL * 0.14},-${eL * 0.48} Q 2,-${eL * 0.64} ${eL * 0.20},-${eL * 0.42}" stroke="#ffffff" stroke-width="2.8" fill="none" stroke-linecap="round" />
          </g>

          <g transform="translate(${200 + hRX * 0.50}, ${hY - hRY * 0.60})">
            <path d="M 0,0 C 12,-22 ${eL * 0.55},-${eL * 0.74} ${eL * 0.36},-${eL} C ${eL * 0.10},-${eL * 0.86} -${eL * 0.22},-${eL * 0.52} -${eL * 0.38},-${eL * 0.08} Z" fill="url(#${uid}_head_sphere)" stroke="${pal.shadow}" stroke-width="2.6" />
            <path d="M 4,-8 C 14,-22 ${eL * 0.42},-${eL * 0.66} ${eL * 0.28},-${eL * 0.86} C ${eL * 0.06},-${eL * 0.72} -${eL * 0.16},-${eL * 0.42} -${eL * 0.24},-${eL * 0.16} Z" fill="url(#${uid}_inner_ear)" />
            <path d="M ${eL * 0.22},-${eL * 0.32} Q 0,-${eL * 0.52} -${eL * 0.16},-${eL * 0.26}" stroke="#ffffff" stroke-width="3.6" fill="none" stroke-linecap="round" />
            <path d="M ${eL * 0.14},-${eL * 0.48} Q -2,-${eL * 0.64} -${eL * 0.20},-${eL * 0.42}" stroke="#ffffff" stroke-width="2.8" fill="none" stroke-linecap="round" />
          </g>
        </g>
      `;
    } else if (config.ears === 'cat') {
      earsSVG = `
        <g id="layer-ears" class="monster-layer layer-ears" data-layer="ears" filter="url(#${uid}_soft_shadow)">
          <path d="M ${200 - hRX * 0.72},${hY - hRY * 0.34} L ${200 - hRX * 0.65},${hY - hRY * 1.35} L ${200 - hRX * 0.16},${hY - hRY * 0.74} Z" fill="url(#${uid}_head_sphere)" stroke="${pal.shadow}" stroke-width="2.6" />
          <path d="M ${200 - hRX * 0.66},${hY - hRY * 0.44} L ${200 - hRX * 0.62},${hY - hRY * 1.20} L ${200 - hRX * 0.24},${hY - hRY * 0.74} Z" fill="url(#${uid}_inner_ear)" />

          <path d="M ${200 + hRX * 0.72},${hY - hRY * 0.34} L ${200 + hRX * 0.65},${hY - hRY * 1.35} L ${200 + hRX * 0.16},${hY - hRY * 0.74} Z" fill="url(#${uid}_head_sphere)" stroke="${pal.shadow}" stroke-width="2.6" />
          <path d="M ${200 + hRX * 0.66},${hY - hRY * 0.44} L ${200 + hRX * 0.62},${hY - hRY * 1.20} L ${200 + hRX * 0.24},${hY - hRY * 0.74} Z" fill="url(#${uid}_inner_ear)" />
        </g>
      `;
    } else if (config.ears === 'floppy') {
      earsSVG = `
        <g id="layer-ears" class="monster-layer layer-ears" data-layer="ears" filter="url(#${uid}_soft_shadow)">
          <path d="M ${200 - hRX * 0.54},${hY - hRY * 0.64} C ${200 - hRX * 1.36},${hY - hRY * 0.12} ${200 - hRX * 1.28},${hY + hRY * 0.56} ${200 - hRX * 0.84},${hY + hRY * 0.50} Z" fill="url(#${uid}_head_sphere)" stroke="${pal.shadow}" stroke-width="2.6" />
          <path d="M ${200 + hRX * 0.54},${hY - hRY * 0.64} C ${200 + hRX * 1.36},${hY - hRY * 0.12} ${200 + hRX * 1.28},${hY + hRY * 0.56} ${200 + hRX * 0.84},${hY + hRY * 0.50} Z" fill="url(#${uid}_head_sphere)" stroke="${pal.shadow}" stroke-width="2.6" />
        </g>
      `;
    } else if (config.ears === 'tufted' || stage >= 5) {
      earsSVG = `
        <g id="layer-ears" class="monster-layer layer-ears" data-layer="ears" filter="url(#${uid}_soft_shadow)">
          <path d="M ${200 - hRX * 0.56},${hY - hRY * 0.54} C ${200 - hRX * 0.92},${hY - hRY * 1.46} ${200 - hRX * 0.32},${hY - hRY * 1.56} ${200 - hRX * 0.20},${hY - hRY * 0.64} Z" fill="url(#${uid}_head_sphere)" stroke="${pal.shadow}" stroke-width="2.6" />
          <path d="M ${200 + hRX * 0.56},${hY - hRY * 0.54} C ${200 + hRX * 0.92},${hY - hRY * 1.46} ${200 + hRX * 0.32},${hY - hRY * 1.56} ${200 + hRX * 0.20},${hY - hRY * 0.64} Z" fill="url(#${uid}_head_sphere)" stroke="${pal.shadow}" stroke-width="2.6" />
          <circle cx="${200 - hRX * 0.58}" cy="${hY - hRY * 1.46}" r="5.5" fill="${pal.highlight}" filter="url(#${uid}_glow)" />
          <circle cx="${200 + hRX * 0.58}" cy="${hY - hRY * 1.46}" r="5.5" fill="${pal.highlight}" filter="url(#${uid}_glow)" />
        </g>
      `;
    }

    // ==========================================
    // 11. LAYER: EXPRESSIVE RPG EYES & FACE
    // ==========================================
    const eyeOffsetX = 32;
    const eyeY = hY + hRY * 0.12;
    const eyeRX = 19;
    const eyeRY = 23;

    let eyesMarkup = '';
    if (config.eyes === 'sparkle') {
      eyesMarkup = `
        <g id="eyes-pair" class="layer-eyes">
          <ellipse cx="${200 - eyeOffsetX}" cy="${eyeY}" rx="${eyeRX}" ry="${eyeRY}" fill="#050814" />
          <ellipse cx="${200 + eyeOffsetX}" cy="${eyeY}" rx="${eyeRX}" ry="${eyeRY}" fill="#050814" />
          <ellipse cx="${200 - eyeOffsetX}" cy="${eyeY + 2}" rx="${eyeRX * 0.90}" ry="${eyeRY * 0.88}" fill="url(#${uid}_eye_iris)" />
          <ellipse cx="${200 + eyeOffsetX}" cy="${eyeY + 2}" rx="${eyeRX * 0.90}" ry="${eyeRY * 0.88}" fill="url(#${uid}_eye_iris)" />
          <ellipse cx="${200 - eyeOffsetX}" cy="${eyeY + 3}" rx="${eyeRX * 0.52}" ry="${eyeRY * 0.58}" fill="#050814" />
          <ellipse cx="${200 + eyeOffsetX}" cy="${eyeY + 3}" rx="${eyeRX * 0.52}" ry="${eyeRY * 0.58}" fill="#050814" />
          <path d="M ${200 - eyeOffsetX},${eyeY - 6} L ${200 - eyeOffsetX + 3},${eyeY - 1} L ${200 - eyeOffsetX + 8},${eyeY + 2} L ${200 - eyeOffsetX + 3},${eyeY + 5} L ${200 - eyeOffsetX},${eyeY + 10} L ${200 - eyeOffsetX - 3},${eyeY + 5} L ${200 - eyeOffsetX - 8},${eyeY + 2} L ${200 - eyeOffsetX - 3},${eyeY - 1} Z" fill="#ffffff" />
          <path d="M ${200 + eyeOffsetX},${eyeY - 6} L ${200 + eyeOffsetX + 3},${eyeY - 1} L ${200 + eyeOffsetX + 8},${eyeY + 2} L ${200 + eyeOffsetX + 3},${eyeY + 5} L ${200 + eyeOffsetX},${eyeY + 10} L ${200 + eyeOffsetX - 3},${eyeY + 5} L ${200 + eyeOffsetX - 8},${eyeY + 2} L ${200 + eyeOffsetX - 3},${eyeY - 1} Z" fill="#ffffff" />
        </g>
      `;
    } else if (config.eyes === 'fierce') {
      eyesMarkup = `
        <g id="eyes-pair" class="layer-eyes">
          <path d="M ${200 - eyeOffsetX - eyeRX},${eyeY - 2} Q ${200 - eyeOffsetX},${eyeY - 14} ${200 - eyeOffsetX + eyeRX},${eyeY + 5} Q ${200 - eyeOffsetX},${eyeY + eyeRY * 0.95} ${200 - eyeOffsetX - eyeRX},${eyeY - 2} Z" fill="#050814" />
          <path d="M ${200 + eyeOffsetX + eyeRX},${eyeY - 2} Q ${200 + eyeOffsetX},${eyeY - 14} ${200 + eyeOffsetX - eyeRX},${eyeY + 5} Q ${200 + eyeOffsetX},${eyeY + eyeRY * 0.95} ${200 + eyeOffsetX + eyeRX},${eyeY - 2} Z" fill="#050814" />
          <circle cx="${200 - eyeOffsetX}" cy="${eyeY + 1}" r="${eyeRX * 0.65}" fill="url(#${uid}_eye_iris)" />
          <circle cx="${200 + eyeOffsetX}" cy="${eyeY + 1}" r="${eyeRX * 0.65}" fill="url(#${uid}_eye_iris)" />
          <circle cx="${200 - eyeOffsetX - 3}" cy="${eyeY - 1}" r="4.5" fill="#ffffff" />
          <circle cx="${200 + eyeOffsetX - 3}" cy="${eyeY - 1}" r="4.5" fill="#ffffff" />
        </g>
      `;
    } else if (config.eyes === 'happy') {
      eyesMarkup = `
        <g id="eyes-pair" class="layer-eyes">
          <path d="M ${200 - eyeOffsetX - eyeRX + 2},${eyeY + 5} Q ${200 - eyeOffsetX},${eyeY - 12} ${200 - eyeOffsetX + eyeRX - 2},${eyeY + 5}" stroke="#050814" stroke-width="5" stroke-linecap="round" fill="none" />
          <path d="M ${200 + eyeOffsetX - eyeRX + 2},${eyeY + 5} Q ${200 + eyeOffsetX},${eyeY - 12} ${200 + eyeOffsetX + eyeRX - 2},${eyeY + 5}" stroke="#050814" stroke-width="5" stroke-linecap="round" fill="none" />
        </g>
      `;
    } else {
      eyesMarkup = `
        <g id="eyes-pair" class="layer-eyes">
          <ellipse cx="${200 - eyeOffsetX}" cy="${eyeY}" rx="${eyeRX}" ry="${eyeRY}" fill="#050814" />
          <ellipse cx="${200 + eyeOffsetX}" cy="${eyeY}" rx="${eyeRX}" ry="${eyeRY}" fill="#050814" />
          <ellipse cx="${200 - eyeOffsetX}" cy="${eyeY + 2}" rx="${eyeRX * 0.90}" ry="${eyeRY * 0.88}" fill="url(#${uid}_eye_iris)" />
          <ellipse cx="${200 + eyeOffsetX}" cy="${eyeY + 2}" rx="${eyeRX * 0.90}" ry="${eyeRY * 0.88}" fill="url(#${uid}_eye_iris)" />
          <ellipse cx="${200 - eyeOffsetX}" cy="${eyeY + 3}" rx="${eyeRX * 0.52}" ry="${eyeRY * 0.58}" fill="#020617" />
          <ellipse cx="${200 + eyeOffsetX}" cy="${eyeY + 3}" rx="${eyeRX * 0.52}" ry="${eyeRY * 0.58}" fill="#020617" />
          <ellipse cx="${200 - eyeOffsetX - eyeRX * 0.32}" cy="${eyeY - eyeRY * 0.32}" rx="${eyeRX * 0.38}" ry="${eyeRY * 0.40}" fill="#ffffff" />
          <ellipse cx="${200 + eyeOffsetX - eyeRX * 0.32}" cy="${eyeY - eyeRY * 0.32}" rx="${eyeRX * 0.38}" ry="${eyeRY * 0.40}" fill="#ffffff" />
          <circle cx="${200 - eyeOffsetX + eyeRX * 0.36}" cy="${eyeY + eyeRY * 0.38}" r="${eyeRX * 0.22}" fill="#ffffff" />
          <circle cx="${200 + eyeOffsetX + eyeRX * 0.36}" cy="${eyeY + eyeRY * 0.38}" r="${eyeRX * 0.22}" fill="#ffffff" />
        </g>
      `;
    }

    const faceSVG = `
      <g id="layer-face" class="monster-layer layer-face" data-layer="face">
        <ellipse cx="${200 - eyeOffsetX - 14}" cy="${eyeY + eyeRY * 0.92}" rx="15" ry="8.5" fill="#f43f5e" opacity="0.48" filter="url(#${uid}_glow)" />
        <ellipse cx="${200 + eyeOffsetX + 14}" cy="${eyeY + eyeRY * 0.92}" rx="15" ry="8.5" fill="#f43f5e" opacity="0.48" filter="url(#${uid}_glow)" />

        <path d="M ${200 - eyeOffsetX - 15},${eyeY - eyeRY * 0.90} Q ${200 - eyeOffsetX},${eyeY - eyeRY * 1.25} ${200 - eyeOffsetX + 12},${eyeY - eyeRY * 0.95}" stroke="${pal.primaryDark}" stroke-width="3.2" stroke-linecap="round" fill="none" />
        <path d="M ${200 + eyeOffsetX - 12},${eyeY - eyeRY * 0.95} Q ${200 + eyeOffsetX},${eyeY - eyeRY * 1.25} ${200 + eyeOffsetX + 15},${eyeY - eyeRY * 0.90}" stroke="${pal.primaryDark}" stroke-width="3.2" stroke-linecap="round" fill="none" />

        ${eyesMarkup}

        ${isGirl ? `
          <path d="M ${200 - eyeOffsetX + eyeRX * 0.72},${eyeY - eyeRY * 0.88} L ${200 - eyeOffsetX + eyeRX * 1.28},${eyeY - eyeRY * 1.20}" stroke="#050814" stroke-width="2.6" stroke-linecap="round" />
          <path d="M ${200 + eyeOffsetX - eyeRX * 0.72},${eyeY - eyeRY * 0.88} L ${200 + eyeOffsetX - eyeRX * 1.28},${eyeY - eyeRY * 1.20}" stroke="#050814" stroke-width="2.6" stroke-linecap="round" />
        ` : ''}

        <ellipse cx="200" cy="${hY + hRY * 0.50}" rx="24" ry="15" fill="${pal.belly}" opacity="0.92" />
        <path d="M 194,${hY + hRY * 0.42} Q 200,${hY + hRY * 0.47} 206,${hY + hRY * 0.42} Q 200,${hY + hRY * 0.38} 194,${hY + hRY * 0.42} Z" fill="#0f172a" />
        <circle cx="198" cy="${hY + hRY * 0.41}" r="1.6" fill="#ffffff" />

        <path d="M 189,${hY + hRY * 0.56} Q 195,${hY + hRY * 0.68} 200,${hY + hRY * 0.58} Q 205,${hY + hRY * 0.68} 211,${hY + hRY * 0.56}" stroke="#0f172a" stroke-width="3" stroke-linecap="round" fill="none" />
        <path d="M 196,${hY + hRY * 0.62} Q 200,${hY + hRY * 0.74} 204,${hY + hRY * 0.62} Z" fill="#f43f5e" opacity="0.9" />
      </g>
    `;

    // ==========================================
    // 12. LAYER: BOY / GIRL STYLE & HAIR
    // ==========================================
    let hairSVG = '';
    if (isGirl) {
      hairSVG = `
        <g id="layer-hair" class="monster-layer layer-hair" data-layer="hair" filter="url(#${uid}_soft_shadow)">
          <path d="M 172,${hY - hRY * 0.88} C 182,${hY - hRY * 0.42} 196,${hY - hRY * 0.38} 208,${hY - hRY * 0.78}" stroke="url(#${uid}_head_sphere)" stroke-width="8.5" stroke-linecap="round" fill="none" />
          <g id="girl-hair-bow" transform="translate(${200 - hRX * 0.78}, ${hY - hRY * 0.68}) rotate(-24) scale(0.85)">
            <path d="M 0,0 C -20,-16 -35,-3 -28,12 C -24,20 -8,6 0,0 Z" fill="#f472b6" stroke="#db2777" stroke-width="2" />
            <path d="M 0,0 C 20,-16 35,-3 28,12 C 24,20 8,6 0,0 Z" fill="#f472b6" stroke="#db2777" stroke-width="2" />
            <circle cx="0" cy="0" r="5.5" fill="#fbcfe8" stroke="#db2777" stroke-width="2" />
          </g>
        </g>
      `;
    } else {
      hairSVG = `
        <g id="layer-hair" class="monster-layer layer-hair" data-layer="hair" filter="url(#${uid}_soft_shadow)">
          <path d="M 184,${hY - hRY * 0.96} Q 194,${hY - hRY * 1.45} 200,${hY - hRY * 1.55} Q 206,${hY - hRY * 1.45} 216,${hY - hRY * 0.96} Z" fill="url(#${uid}_head_sphere)" stroke="${pal.shadow}" stroke-width="2.2" />
          <path d="M 174,${hY - hRY * 0.90} Q 183,${hY - hRY * 1.28} 188,${hY - hRY * 1.34} Q 190,${hY - hRY * 1.10} 193,${hY - hRY * 0.92} Z" fill="url(#${uid}_head_sphere)" stroke="${pal.shadow}" stroke-width="2" />
        </g>
      `;
    }

    // ==========================================
    // 13. LAYER: ACCESSORIES
    // ==========================================
    let accSVG = '';
    if (config.accessory === 'crown' || (stage === 6 && !config.accessory)) {
      accSVG = `
        <g id="layer-accessory" class="monster-layer layer-accessory" data-layer="accessory" filter="url(#${uid}_deep_shadow)">
          <path d="M 172,${hY - hRY * 0.96} L 166,${hY - hRY * 1.48} L 185,${hY - hRY * 1.24} L 200,${hY - hRY * 1.66} L 215,${hY - hRY * 1.24} L 234,${hY - hRY * 1.48} L 228,${hY - hRY * 0.96} Z" fill="#fbbf24" stroke="#b45309" stroke-width="2.6" />
          <path d="M 180,${hY - hRY * 1.04} Q 200,${hY - hRY * 1.32} 220,${hY - hRY * 1.04}" stroke="#991b1b" stroke-width="4.5" fill="none" opacity="0.8" />
          <circle cx="200" cy="${hY - hRY * 1.20}" r="5" fill="#ef4444" stroke="#991b1b" stroke-width="1.5" />
          <circle cx="182" cy="${hY - hRY * 1.12}" r="3.6" fill="#10b981" />
          <circle cx="218" cy="${hY - hRY * 1.12}" r="3.6" fill="#10b981" />
        </g>
      `;
    } else if (config.accessory === 'blue_bow') {
      accSVG = `
        <g id="layer-accessory" class="monster-layer layer-accessory" data-layer="accessory" filter="url(#${uid}_soft_shadow)">
          <g transform="translate(200, ${hY + hRY * 0.94})">
            <path d="M 0,0 C -22,-16 -35,-4 -28,10 C -24,20 -8,6 0,0 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
            <path d="M 0,0 C 22,-16 35,-4 28,10 C 24,20 8,6 0,0 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
            <circle cx="0" cy="0" r="5" fill="#bae6fd" stroke="#0284c7" stroke-width="1.8" />
          </g>
        </g>
      `;
    } else if (config.accessory === 'bandana') {
      accSVG = `
        <g id="layer-accessory" class="monster-layer layer-accessory" data-layer="accessory" filter="url(#${uid}_soft_shadow)">
          <path d="M 166,${hY + hRY * 0.82} Q 200,${hY + hRY * 0.96} 234,${hY + hRY * 0.82} L 209,${hY + hRY * 1.38} L 200,${hY + hRY * 1.44} L 191,${hY + hRY * 1.38} Z" fill="#ef4444" stroke="#991b1b" stroke-width="2.2" />
        </g>
      `;
    } else if (config.accessory === 'glasses') {
      accSVG = `
        <g id="layer-accessory" class="monster-layer layer-accessory" data-layer="accessory" filter="url(#${uid}_soft_shadow)">
          <circle cx="${200 - eyeOffsetX}" cy="${eyeY}" r="${eyeRX * 1.20}" fill="none" stroke="#fbbf24" stroke-width="3" />
          <circle cx="${200 + eyeOffsetX}" cy="${eyeY}" r="${eyeRX * 1.20}" fill="none" stroke="#fbbf24" stroke-width="3" />
          <path d="M ${200 - eyeOffsetX + eyeRX * 1.20},${eyeY} L ${200 + eyeOffsetX - eyeRX * 1.20},${eyeY}" stroke="#fbbf24" stroke-width="2.6" />
          <path d="M ${200 - eyeOffsetX - eyeRX * 0.8},${eyeY - eyeRY * 0.5} L ${200 - eyeOffsetX - eyeRX * 0.3},${eyeY - eyeRY * 0.8}" stroke="#ffffff" stroke-width="2.2" opacity="0.65" stroke-linecap="round" />
          <path d="M ${200 + eyeOffsetX - eyeRX * 0.8},${eyeY - eyeRY * 0.5} L ${200 + eyeOffsetX - eyeRX * 0.3},${eyeY - eyeRY * 0.8}" stroke="#ffffff" stroke-width="2.2" opacity="0.65" stroke-linecap="round" />
        </g>
      `;
    } else if (config.accessory === 'badge') {
      accSVG = `
        <g id="layer-accessory" class="monster-layer layer-accessory" data-layer="accessory" filter="url(#${uid}_soft_shadow)">
          <g transform="translate(160, ${bY - 14}) scale(0.95)">
            <circle cx="0" cy="0" r="13" fill="#fbbf24" stroke="#b45309" stroke-width="2.4" />
            <polygon points="0,-8 2.5,-2.5 8.5,-2.5 3.5,2 5.5,8 0,4.5 -5.5,8 -3.5,2 -8.5,-2.5 -2.5,-2.5" fill="#ffffff" />
          </g>
        </g>
      `;
    } else if (config.accessory === 'wizard_hat') {
      accSVG = `
        <g id="layer-accessory" class="monster-layer layer-accessory" data-layer="accessory" filter="url(#${uid}_deep_shadow)">
          <ellipse cx="200" cy="${hY - hRY * 0.92}" rx="54" ry="15" fill="#312e81" stroke="#4338ca" stroke-width="2.2" />
          <path d="M 158,${hY - hRY * 0.92} L 206,${hY - hRY * 1.94} L 242,${hY - hRY * 0.92} Z" fill="#3730a3" stroke="#4338ca" stroke-width="2.2" />
          <polygon points="206,-20 208,-15 213,-15 209,-12 211,-7 206,-10 201,-7 203,-12 199,-15 204,-15" fill="#fbbf24" transform="translate(0, ${hY - hRY * 1.48})" />
        </g>
      `;
    }

    // ==========================================
    // 14. LAYER: CELESTIAL STAGE 6 APEX EFFECTS
    // ==========================================
    let apexSVG = '';
    if (stage === 6) {
      apexSVG = `
        <g id="layer-apex-effects" class="monster-layer layer-effects" data-layer="effects">
          <polygon points="200,${hY - hRY * 0.48} 206,${hY - hRY * 0.30} 200,${hY - hRY * 0.12} 194,${hY - hRY * 0.30}" fill="#fbbf24" filter="url(#${uid}_glow)" />
          <circle cx="125" cy="155" r="4" fill="#fbbf24" opacity="0.9" filter="url(#${uid}_glow)" />
          <circle cx="275" cy="145" r="4.5" fill="${pal.highlight}" opacity="0.9" filter="url(#${uid}_glow)" />
          <circle cx="145" cy="75" r="3.5" fill="#ffffff" opacity="0.95" filter="url(#${uid}_glow)" />
          <circle cx="255" cy="70" r="4" fill="#fbbf24" opacity="0.95" filter="url(#${uid}_glow)" />
        </g>
      `;
    }

    // Assemble Final High-Fidelity Vector SVG
    return `
      <svg class="monster-svg monster-stage-${stage} ${className}" viewBox="0 0 400 400" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle; overflow:hidden; user-select:none; ${customStyle}" data-stage="${stage}" data-species="${config.species}" data-color="${config.furColor}" data-style="${config.style}">
        ${defs}
        ${pedestalSVG}
        ${auraSVG}
        ${tailSVG}
        ${legsSVG}
        ${bodySVG}
        ${outfitSVG}
        ${headSVG}
        ${earsSVG}
        ${faceSVG}
        ${hairSVG}
        ${accSVG}
        ${apexSVG}
      </svg>
    `.trim();
  }

  function renderMonsterArtwork(options = {}) {
    return renderMonsterSVG(options, options);
  }

  function renderMonster(configOrStudentOrOpts = {}, maybeOptions = {}) {
    let options = maybeOptions;
    let monsterConfig = {};

    if (typeof configOrStudentOrOpts === 'string') {
      const store = (typeof window !== 'undefined' ? (window.store || window.schoolStore) : null);
      if (store && store.getStudentMonster) {
        monsterConfig = store.getStudentMonster(configOrStudentOrOpts);
      }
    } else if (configOrStudentOrOpts && configOrStudentOrOpts.studentId) {
      const store = (typeof window !== 'undefined' ? (window.store || window.schoolStore) : null);
      if (store && store.getStudentMonster) {
        monsterConfig = store.getStudentMonster(configOrStudentOrOpts.studentId);
      }
      options = Object.assign({}, configOrStudentOrOpts, maybeOptions);
    } else if (configOrStudentOrOpts && configOrStudentOrOpts.species) {
      monsterConfig = configOrStudentOrOpts;
    } else if (configOrStudentOrOpts && configOrStudentOrOpts.evolutionStage !== undefined) {
      monsterConfig = configOrStudentOrOpts;
    } else {
      monsterConfig = configOrStudentOrOpts;
    }

    return renderMonsterSVG(monsterConfig, options);
  }

  const MonsterRenderer = {
    render: renderMonster,
    renderSVG: renderMonsterSVG,
    renderArtwork: renderMonsterArtwork,
    getEvolutionStage: getEvolutionStage,
    getStageInfo: getStageInfo,
    stages: EVOLUTION_THRESHOLDS,
    palettes: FUR_PALETTES
  };

  root.MonsterRenderer = MonsterRenderer;
  root.renderMonsterSVG = renderMonsterSVG;
  root.renderMonsterArtwork = renderMonsterArtwork;
  root.renderMonster = renderMonster;
  root.getEvolutionStage = getEvolutionStage;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MonsterRenderer;
  }
})(typeof window !== 'undefined' ? window : global);
