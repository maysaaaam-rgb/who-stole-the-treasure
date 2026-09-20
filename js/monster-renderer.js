/**
 * ENGLISH ADVENTURE ACADEMY — COMPOSABLE DATA-DRIVEN MONSTER RENDERER
 * 
 * Architecture:
 * - ONE SPECIES: "academy-companion" (charming magical fantasy companion)
 * - PURE DATA-DRIVEN: Assembled entirely from independent vector SVG layers
 * - NO FLAT PNGs: Zero reliance on static full-body PNG images
 * - 7 PHYSICAL EVOLUTION STAGES (Calculated from XP):
 *     Level 0: Egg (0 XP)
 *     Level 1: Baby (100 XP)
 *     Level 2: Tot (300 XP)
 *     Level 3: Young (700 XP)
 *     Level 4: Adventurer (1,200 XP)
 *     Level 5: Elite (2,500 XP)
 *     Level 6: Legendary (5,000 XP)
 * - BOY / GIRL STYLE: Dynamic visual styling & accessories without changing species
 * - INDEPENDENT CUSTOMIZABLE LAYERS:
 *     Fur Color (Blue, Green, Orange, Purple, Pink)
 *     Eyes (Round, Sparkle, Fierce, Happy, Curious)
 *     Ears (Fox, Cat, Floppy, Tufted)
 *     Tail (Fluffy, Dragon, Curly, Twin)
 *     Outfits (None, Adventurer Jacket, Scholar Vest, Hero Cape, Mystic Robe)
 *     Accessories (None, Crown, Blue Bow, Pink Bow, Bandana, Glasses, Guild Badge, Wizard Hat)
 *     Auras (None, Glow, Star Glow, Sparks, Flame, Wings)
 */

(function(root) {
  'use strict';

  // 1. XP Thresholds & Progression Map
  const EVOLUTION_THRESHOLDS = [
    { level: 0, stageKey: 'egg', name: 'Egg', xpRequired: 0, subtitle: 'Enchanted Egg' },
    { level: 1, stageKey: 'baby', name: 'Baby', xpRequired: 100, subtitle: 'Tiny & Curious' },
    { level: 2, stageKey: 'tot', name: 'Tot', xpRequired: 300, subtitle: 'Playful & Growing' },
    { level: 3, stageKey: 'young', name: 'Young', xpRequired: 700, subtitle: 'Confident & Alert' },
    { level: 4, stageKey: 'adventurer', name: 'Adventurer', xpRequired: 1200, subtitle: 'Ready for Quests' },
    { level: 5, stageKey: 'elite', name: 'Elite', xpRequired: 2500, subtitle: 'Noble Fluent Guardian' },
    { level: 6, stageKey: 'legendary', name: 'Legendary', xpRequired: 5000, subtitle: 'Apex Mythic Companion' }
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

  // 2. Color Palettes
  const FUR_PALETTES = {
    blue: {
      id: 'blue',
      name: 'Sky Azure',
      primaryLight: '#60a5fa',
      primary: '#3b82f6',
      primaryDark: '#1d4ed8',
      shadow: '#1e3a8a',
      belly: '#eff6ff',
      bellyShadow: '#bfdbfe',
      innerEar: '#f472b6',
      accent: '#93c5fd',
      glow: 'rgba(59, 130, 246, 0.45)'
    },
    green: {
      id: 'green',
      name: 'Leaf Emerald',
      primaryLight: '#34d399',
      primary: '#10b981',
      primaryDark: '#047857',
      shadow: '#064e3b',
      belly: '#f0fdf4',
      bellyShadow: '#a7f3d0',
      innerEar: '#fb7185',
      accent: '#6ee7b7',
      glow: 'rgba(16, 185, 129, 0.45)'
    },
    orange: {
      id: 'orange',
      name: 'Sunset Amber',
      primaryLight: '#fb923c',
      primary: '#f97316',
      primaryDark: '#c2410c',
      shadow: '#7c2d12',
      belly: '#fff7ed',
      bellyShadow: '#fed7aa',
      innerEar: '#f43f5e',
      accent: '#fdba74',
      glow: 'rgba(249, 115, 22, 0.45)'
    },
    purple: {
      id: 'purple',
      name: 'Lavender Arcane',
      primaryLight: '#c084fc',
      primary: '#a855f7',
      primaryDark: '#7e22ce',
      shadow: '#581c87',
      belly: '#faf5ff',
      bellyShadow: '#e9d5ff',
      innerEar: '#fb7185',
      accent: '#d8b4fe',
      glow: 'rgba(168, 85, 247, 0.45)'
    },
    pink: {
      id: 'pink',
      name: 'Berry Blossom',
      primaryLight: '#f472b6',
      primary: '#ec4899',
      primaryDark: '#be185d',
      shadow: '#831843',
      belly: '#fdf2f8',
      bellyShadow: '#fbcfe8',
      innerEar: '#fda4af',
      accent: '#f9a8d4',
      glow: 'rgba(236, 72, 153, 0.45)'
    }
  };

  function normalizeMonsterConfig(rawConfig = {}) {
    let data = rawConfig;
    if (rawConfig.monster && typeof rawConfig.monster === 'object') {
      data = Object.assign({}, rawConfig.monster, rawConfig);
    }

    // Evolution stage resolution
    let stage = 1;
    if (data.evolutionStage !== undefined) {
      stage = Number(data.evolutionStage);
    } else if (data.level !== undefined) {
      stage = Number(data.level);
    } else if (data.stage !== undefined) {
      stage = getStageInfo(data.stage).level;
    } else if (data.totalXP !== undefined || data.xp !== undefined) {
      stage = getEvolutionStage(data.totalXP || data.xp);
    }
    stage = Math.max(0, Math.min(6, isNaN(stage) ? 1 : stage));

    // Color resolution
    let colorKey = (data.furColor || data.baseColor || data.color || 'blue').toLowerCase().replace('body-', '');
    if (!FUR_PALETTES[colorKey]) colorKey = 'blue';

    // Style (boy vs girl)
    let style = (data.style || data.monsterStyle || data.gender || 'boy').toLowerCase();
    if (style !== 'girl') style = 'boy';

    // Eyes
    let eyes = (data.eyes || 'round').toLowerCase().replace('eyes-', '');
    if (!['round', 'sparkle', 'fierce', 'happy', 'curious'].includes(eyes)) eyes = 'round';

    // Ears
    let ears = (data.ears || 'fox').toLowerCase().replace('ears-', '');
    if (!['fox', 'cat', 'floppy', 'tufted'].includes(ears)) ears = 'fox';

    // Tail
    let tail = (data.tail || 'fluffy').toLowerCase().replace('tail-', '');
    if (!['fluffy', 'dragon', 'curly', 'twin'].includes(tail)) tail = 'fluffy';

    // Outfit
    let outfit = (data.outfit || (data.equipped && data.equipped.clothing) || 'none').toLowerCase().replace('clothing-', '');
    if (outfit === 'null' || outfit === 'none') outfit = null;

    // Accessory
    let accessory = (data.accessory || (data.equipped && (data.equipped.hat || data.equipped.accessory || data.equipped.glasses)) || 'none').toLowerCase();
    accessory = accessory.replace('hat-', '').replace('glasses-', '').replace('accessory-', '');
    if (accessory === 'null' || accessory === 'none') accessory = null;

    // Aura
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
   * Primary Vector SVG Character Generator
   * Generates a fully composable, responsive, 100% vector SVG character
   */
  function renderMonsterSVG(rawConfig = {}, options = {}) {
    const config = normalizeMonsterConfig(rawConfig);
    const size = Number(options.size) || 280;
    const isRound = options.round !== false;
    const showPedestal = options.showPedestal !== false;
    const animated = options.animated !== false && !options.paused;
    const customStyle = options.style || '';
    const className = options.className || '';

    const uid = 'mc_' + (++svgIdCounter) + '_' + Math.floor(Math.random() * 10000);
    const stage = config.evolutionStage;
    const pal = FUR_PALETTES[config.furColor] || FUR_PALETTES.blue;
    const isGirl = config.style === 'girl';

    const stageParams = {
      0: { headY: 200, headR: 0, bodyW: 130, bodyH: 175, bodyY: 220, pawW: 0, pawH: 0, earL: 0, tailScale: 0 },
      1: { headY: 170, headRX: 72, headRY: 64, bodyW: 84, bodyH: 80, bodyY: 255, pawW: 24, pawH: 28, pawY: 302, earL: 48, tailScale: 0.65 },
      2: { headY: 160, headRX: 68, headRY: 60, bodyW: 92, bodyH: 95, bodyY: 245, pawW: 26, pawH: 34, pawY: 300, earL: 58, tailScale: 0.85 },
      3: { headY: 148, headRX: 64, headRY: 56, bodyW: 98, bodyH: 112, bodyY: 235, pawW: 28, pawH: 42, pawY: 298, earL: 70, tailScale: 1.05 },
      4: { headY: 138, headRX: 60, headRY: 53, bodyW: 106, bodyH: 125, bodyY: 225, pawW: 30, pawH: 50, pawY: 295, earL: 80, tailScale: 1.25 },
      5: { headY: 128, headRX: 58, headRY: 50, bodyW: 116, bodyH: 140, bodyY: 215, pawW: 32, pawH: 58, pawY: 292, earL: 90, tailScale: 1.45 },
      6: { headY: 118, headRX: 56, headRY: 48, bodyW: 126, bodyH: 155, bodyY: 205, pawW: 35, pawH: 66, pawY: 290, earL: 102, tailScale: 1.70 }
    }[stage];

    // Gradients & Filters
    const defs = `
      <defs>
        <!-- Dynamic Fur Gradients -->
        <linearGradient id="${uid}_fur" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${pal.primaryLight}" />
          <stop offset="65%" stop-color="${pal.primary}" />
          <stop offset="100%" stop-color="${pal.primaryDark}" />
        </linearGradient>

        <linearGradient id="${uid}_fur_shade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${pal.primary}" />
          <stop offset="100%" stop-color="${pal.shadow}" />
        </linearGradient>

        <linearGradient id="${uid}_belly" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="70%" stop-color="${pal.belly}" />
          <stop offset="100%" stop-color="${pal.bellyShadow}" />
        </linearGradient>

        <linearGradient id="${uid}_inner_ear" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffe4e6" />
          <stop offset="100%" stop-color="${pal.innerEar}" />
        </linearGradient>

        <!-- Eye Gradients -->
        <radialGradient id="${uid}_iris_blue" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="50%" stop-color="#0284c7" />
          <stop offset="100%" stop-color="#082f49" />
        </radialGradient>
        <radialGradient id="${uid}_iris_purple" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#c084fc" />
          <stop offset="50%" stop-color="#7e22ce" />
          <stop offset="100%" stop-color="#3b0764" />
        </radialGradient>

        <!-- Pedestal Gradient -->
        <linearGradient id="${uid}_pedestal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#334155" />
          <stop offset="40%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#090d16" />
        </linearGradient>
        <linearGradient id="${uid}_pedestal_rim" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.2" />
          <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.2" />
        </linearGradient>

        <!-- Egg Gradients -->
        <radialGradient id="${uid}_egg" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="25%" stop-color="${pal.primaryLight}" />
          <stop offset="75%" stop-color="${pal.primary}" />
          <stop offset="100%" stop-color="${pal.shadow}" />
        </radialGradient>

        <!-- Glow Filters -->
        <filter id="${uid}_glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="${uid}_shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#000000" flood-opacity="0.3" />
        </filter>
      </defs>
    `;

    // 2. PEDESTAL & SHADOW
    let pedestalSVG = '';
    if (showPedestal) {
      pedestalSVG = `
        <g id="layer-pedestal" class="monster-layer layer-pedestal" data-layer="pedestal">
          <ellipse cx="200" cy="345" rx="140" ry="32" fill="#000000" opacity="0.45" />
          <ellipse cx="200" cy="340" rx="130" ry="24" fill="url(#${uid}_pedestal)" stroke="url(#${uid}_pedestal_rim)" stroke-width="2" />
          <ellipse cx="200" cy="339" rx="112" ry="18" fill="none" stroke="${pal.accent}" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.6" />
          <ellipse cx="200" cy="339" rx="85" ry="13" fill="none" stroke="${pal.primaryLight}" stroke-width="1" opacity="0.4" />
        </g>
      `;
    }

    // 3. AURA & EFFECTS
    let auraSVG = '';
    if (config.aura === 'glow' || stage === 6) {
      auraSVG = `
        <g id="layer-aura" class="monster-layer layer-aura" data-layer="aura">
          <circle cx="200" cy="220" r="160" fill="${pal.glow}" filter="url(#${uid}_glow)" opacity="${stage === 6 ? '0.75' : '0.45'}" />
          ${stage === 6 ? `
            <circle cx="200" cy="220" r="175" fill="none" stroke="${pal.accent}" stroke-width="2" stroke-dasharray="14 10" opacity="0.7">
              ${animated ? '<animateTransform attributeName="transform" type="rotate" from="0 200 220" to="360 200 220" dur="20s" repeatCount="indefinite"/>' : ''}
            </circle>
          ` : ''}
        </g>
      `;
    } else if (config.aura === 'star_glow' || config.aura === 'stars') {
      auraSVG = `
        <g id="layer-aura" class="monster-layer layer-aura" data-layer="aura">
          <circle cx="200" cy="220" r="150" fill="${pal.glow}" filter="url(#${uid}_glow)" opacity="0.5" />
          <g fill="#fbbf24" stroke="#f59e0b" stroke-width="1">
            <path d="M 90,140 L 93,148 L 101,150 L 94,155 L 96,163 L 90,158 L 84,163 L 86,155 L 79,150 L 87,148 Z" />
            <path d="M 310,130 L 313,138 L 321,140 L 314,145 L 316,153 L 310,148 L 304,153 L 306,145 L 299,140 L 307,138 Z" transform="scale(0.85) translate(65, 30)" />
            <path d="M 120,270 L 122,276 L 128,277 L 123,281 L 125,287 L 120,283 L 115,287 L 117,281 L 112,277 L 118,276 Z" />
            <path d="M 290,265 L 292,271 L 298,272 L 293,276 L 295,282 L 290,278 L 285,282 L 287,276 L 282,272 L 288,271 Z" />
          </g>
        </g>
      `;
    } else if (config.aura === 'sparks') {
      auraSVG = `
        <g id="layer-aura" class="monster-layer layer-aura" data-layer="aura">
          <circle cx="200" cy="220" r="140" fill="${pal.glow}" filter="url(#${uid}_glow)" opacity="0.3" />
          <g stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round">
            <path d="M 75,180 L 85,195 L 80,210 L 92,225" />
            <path d="M 325,175 L 315,190 L 320,205 L 308,220" />
            <circle cx="95" cy="170" r="3" fill="#38bdf8" />
            <circle cx="305" cy="165" r="3" fill="#38bdf8" />
          </g>
        </g>
      `;
    } else if (config.aura === 'wings') {
      auraSVG = `
        <g id="layer-aura" class="monster-layer layer-aura" data-layer="aura" opacity="0.85">
          <path d="M 170,180 C 130,100 60,110 40,160 C 25,200 70,240 160,225 Z" fill="url(#${uid}_inner_ear)" opacity="0.6" stroke="${pal.accent}" stroke-width="2" />
          <path d="M 230,180 C 270,100 340,110 360,160 C 375,200 330,240 240,225 Z" fill="url(#${uid}_inner_ear)" opacity="0.6" stroke="${pal.accent}" stroke-width="2" />
        </g>
      `;
    }

    // 4. LEVEL 0 — SPECIAL EGG RENDERER
    if (stage === 0) {
      return `
        <svg class="monster-svg ${className}" viewBox="0 0 400 400" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle; overflow:visible; ${customStyle}" data-stage="0" data-species="academy-companion" data-color="${config.furColor}" data-style="${config.style}">
          ${defs}
          ${pedestalSVG}
          ${auraSVG}
          <g id="layer-nest" class="monster-layer layer-nest">
            <ellipse cx="200" cy="305" rx="85" ry="32" fill="#78350f" />
            <ellipse cx="200" cy="302" rx="80" ry="28" fill="#92400e" stroke="#b45309" stroke-width="3" />
            <path d="M 125,302 Q 200,325 275,302" stroke="#d97706" stroke-width="3" fill="none" stroke-dasharray="10 5" />
          </g>
          <g id="layer-egg-body" class="monster-layer layer-body" filter="url(#${uid}_shadow)">
            <ellipse cx="200" cy="225" rx="65" ry="85" fill="url(#${uid}_egg)" stroke="${pal.accent}" stroke-width="2.5" />
            <path d="M 165,175 C 160,200 160,225 170,245" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.6" fill="none" />
            <circle cx="185" cy="215" r="10" fill="#ffffff" opacity="0.65" filter="url(#${uid}_glow)" />
            <circle cx="225" cy="245" r="8" fill="#ffffff" opacity="0.6" filter="url(#${uid}_glow)" />
            <circle cx="195" cy="265" r="7" fill="#ffffff" opacity="0.5" filter="url(#${uid}_glow)" />
            <path d="M 195,190 L 205,202 L 198,212 L 210,225" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.8" />
          </g>
        </svg>
      `.trim();
    }

    // 5. LAYER: TAIL (Behind Body)
    const tScale = stageParams.tailScale;
    let tailSVG = '';
    if (config.tail === 'fluffy') {
      tailSVG = `
        <g id="layer-tail" class="monster-layer layer-tail" data-layer="tail" filter="url(#${uid}_shadow)">
          <g transform="translate(200, 270) scale(${tScale}) translate(-200, -270)">
            <path d="M 235,275 C 315,285 365,220 345,155 C 330,110 275,130 260,165 C 250,185 240,240 230,265 Z" fill="url(#${uid}_fur)" stroke="${pal.shadow}" stroke-width="2" />
            <path d="M 345,155 C 330,110 275,130 260,165 C 275,155 305,150 330,175 Z" fill="#ffffff" opacity="0.9" />
            <path d="M 335,175 Q 315,195 325,225" stroke="${pal.accent}" stroke-width="2.5" fill="none" stroke-linecap="round" />
          </g>
        </g>
      `;
    } else if (config.tail === 'dragon') {
      tailSVG = `
        <g id="layer-tail" class="monster-layer layer-tail" data-layer="tail" filter="url(#${uid}_shadow)">
          <g transform="translate(200, 270) scale(${tScale}) translate(-200, -270)">
            <path d="M 230,270 C 310,285 355,230 350,160 C 340,140 320,150 310,175 C 290,225 250,250 230,265 Z" fill="url(#${uid}_fur)" stroke="${pal.shadow}" stroke-width="2" />
            <polygon points="345,160 365,145 348,175" fill="${pal.accent}" />
            <polygon points="338,190 355,180 340,205" fill="${pal.accent}" />
            <polygon points="318,225 335,220 320,240" fill="${pal.accent}" />
          </g>
        </g>
      `;
    } else if (config.tail === 'curly') {
      tailSVG = `
        <g id="layer-tail" class="monster-layer layer-tail" data-layer="tail" filter="url(#${uid}_shadow)">
          <g transform="translate(200, 270) scale(${tScale}) translate(-200, -270)">
            <path d="M 230,270 C 290,280 325,240 315,190 C 305,150 260,160 265,190 C 270,210 290,210 290,195" fill="url(#${uid}_fur)" stroke="${pal.shadow}" stroke-width="2" />
            <circle cx="280" cy="180" r="15" fill="#ffffff" opacity="0.8" />
          </g>
        </g>
      `;
    } else if (config.tail === 'twin' || stage === 6) {
      tailSVG = `
        <g id="layer-tail" class="monster-layer layer-tail" data-layer="tail" filter="url(#${uid}_shadow)">
          <g transform="translate(200, 270) scale(${tScale}) translate(-200, -270)">
            <path d="M 170,275 C 90,285 40,220 60,155 C 75,110 130,130 145,165 C 155,185 165,240 175,265 Z" fill="url(#${uid}_fur)" stroke="${pal.shadow}" stroke-width="2" />
            <path d="M 60,155 C 75,110 130,130 145,165 C 130,155 100,150 75,175 Z" fill="#ffffff" opacity="0.9" />
            <path d="M 230,275 C 310,285 360,220 340,155 C 325,110 270,130 255,165 C 245,185 235,240 225,265 Z" fill="url(#${uid}_fur)" stroke="${pal.shadow}" stroke-width="2" />
            <path d="M 340,155 C 325,110 270,130 255,165 C 270,155 300,150 325,175 Z" fill="#ffffff" opacity="0.9" />
          </g>
        </g>
      `;
    }

    // 6. LAYER: LEGS & PAWS
    const pawW = stageParams.pawW;
    const pawH = stageParams.pawH;
    const pawY = stageParams.pawY;
    const legsSVG = `
      <g id="layer-legs" class="monster-layer layer-legs" data-layer="legs">
        <ellipse cx="145" cy="${pawY + 6}" rx="${pawW + 6}" ry="${pawH * 0.48}" fill="${pal.shadow}" />
        <ellipse cx="255" cy="${pawY + 6}" rx="${pawW + 6}" ry="${pawH * 0.48}" fill="${pal.shadow}" />

        <g id="paw-left" class="layer-paw">
          <path d="M 160,${pawY - pawH * 0.8} L 155,${pawY} Q 155,${pawY + 8} 168,${pawY + 8} Q 180,${pawY + 8} 178,${pawY} L 175,${pawY - pawH * 0.8} Z" fill="url(#${uid}_fur)" stroke="${pal.shadow}" stroke-width="1.5" />
          <ellipse cx="167" cy="${pawY + 4}" rx="${pawW * 0.35}" ry="${pawH * 0.2}" fill="${pal.belly}" />
        </g>

        <g id="paw-right" class="layer-paw">
          <path d="M 225,${pawY - pawH * 0.8} L 222,${pawY} Q 220,${pawY + 8} 232,${pawY + 8} Q 245,${pawY + 8} 242,${pawY} L 240,${pawY - pawH * 0.8} Z" fill="url(#${uid}_fur)" stroke="${pal.shadow}" stroke-width="1.5" />
          <ellipse cx="233" cy="${pawY + 4}" rx="${pawW * 0.35}" ry="${pawH * 0.2}" fill="${pal.belly}" />
        </g>
      </g>
    `;

    // 7. LAYER: TORSO & BELLY
    const bW = stageParams.bodyW;
    const bH = stageParams.bodyH;
    const bY = stageParams.bodyY;
    const bodySVG = `
      <g id="layer-body" class="monster-layer layer-body" data-layer="body" filter="url(#${uid}_shadow)">
        <path d="M ${200 - bW * 0.38},${bY - bH * 0.35} 
                 C ${200 - bW * 0.65},${bY + bH * 0.1} ${200 - bW * 0.55},${bY + bH * 0.45} ${200},${bY + bH * 0.48} 
                 C ${200 + bW * 0.55},${bY + bH * 0.45} ${200 + bW * 0.65},${bY + bH * 0.1} ${200 + bW * 0.38},${bY - bH * 0.35} Z" 
              fill="url(#${uid}_fur)" stroke="${pal.shadow}" stroke-width="2" />

        <path d="M ${200 - bW * 0.22},${bY - bH * 0.15} 
                 C ${200 - bW * 0.36},${bY + bH * 0.15} ${200 - bW * 0.3},${bY + bH * 0.4} ${200},${bY + bH * 0.42} 
                 C ${200 + bW * 0.3},${bY + bH * 0.4} ${200 + bW * 0.36},${bY + bH * 0.15} ${200 + bW * 0.22},${bY - bH * 0.15} Z" 
              fill="url(#${uid}_belly)" />

        ${stage >= 2 ? `
          <path d="M 190,${bY - bH * 0.2} Q 200,${bY - bH * 0.05} 210,${bY - bH * 0.2} Q 200,${bY - bH * 0.1} 190,${bY - bH * 0.2} Z" fill="#ffffff" opacity="0.85" />
        ` : ''}

        ${stage >= 5 ? `
          <path d="M 155,${bY - bH * 0.32} Q 175,${bY - bH * 0.12} 200,${bY - bH * 0.25} Q 225,${bY - bH * 0.12} 245,${bY - bH * 0.32}" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" />
        ` : ''}
      </g>
    `;

    // 8. LAYER: OUTFIT
    let outfitSVG = '';
    if (config.outfit === 'adventurer_jacket' || (stage >= 4 && !config.outfit)) {
      outfitSVG = `
        <g id="layer-outfit" class="monster-layer layer-outfit" data-layer="outfit">
          <path d="M 172,${bY - bH * 0.25} L 165,${bY + bH * 0.25} L 180,${bY + bH * 0.25} L 184,${bY - bH * 0.25} Z" fill="#78350f" stroke="#451a03" stroke-width="1.5" />
          <path d="M 228,${bY - bH * 0.25} L 235,${bY + bH * 0.25} L 220,${bY + bH * 0.25} L 216,${bY - bH * 0.25} Z" fill="#78350f" stroke="#451a03" stroke-width="1.5" />
          <rect x="170" y="${bY + bH * 0.18}" width="60" height="10" rx="3" fill="#92400e" />
          <rect x="194" y="${bY + bH * 0.16}" width="12" height="14" rx="2" fill="#fbbf24" stroke="#d97706" stroke-width="1.5" />
        </g>
      `;
    } else if (config.outfit === 'vest') {
      outfitSVG = `
        <g id="layer-outfit" class="monster-layer layer-outfit" data-layer="outfit">
          <path d="M 168,${bY - bH * 0.25} L 164,${bY + bH * 0.3} L 186,${bY + bH * 0.3} L 192,${bY - bH * 0.25} Z" fill="#1e3a8a" stroke="#fbbf24" stroke-width="1.5" />
          <path d="M 232,${bY - bH * 0.25} L 236,${bY + bH * 0.3} L 214,${bY + bH * 0.3} L 208,${bY - bH * 0.25} Z" fill="#1e3a8a" stroke="#fbbf24" stroke-width="1.5" />
          <circle cx="200" cy="${bY - bH * 0.05}" r="3" fill="#fbbf24" />
          <circle cx="200" cy="${bY + bH * 0.12}" r="3" fill="#fbbf24" />
        </g>
      `;
    } else if (config.outfit === 'cape') {
      outfitSVG = `
        <g id="layer-outfit" class="monster-layer layer-outfit" data-layer="outfit">
          <path d="M 160,${bY - bH * 0.28} C 130,${bY + bH * 0.1} 135,${bY + bH * 0.5} 145,${bY + bH * 0.55} L 165,${bY + bH * 0.3} Z" fill="#dc2626" stroke="#991b1b" stroke-width="1.5" />
          <path d="M 240,${bY - bH * 0.28} C 270,${bY + bH * 0.1} 265,${bY + bH * 0.5} 255,${bY + bH * 0.55} L 235,${bY + bH * 0.3} Z" fill="#dc2626" stroke="#991b1b" stroke-width="1.5" />
          <circle cx="200" cy="${bY - bH * 0.25}" r="7" fill="#fbbf24" stroke="#d97706" stroke-width="1.5" />
        </g>
      `;
    } else if (config.outfit === 'robe') {
      outfitSVG = `
        <g id="layer-outfit" class="monster-layer layer-outfit" data-layer="outfit">
          <path d="M 162,${bY - bH * 0.28} L 155,${bY + bH * 0.42} L 245,${bY + bH * 0.42} L 238,${bY - bH * 0.28} Z" fill="#4c1d95" opacity="0.9" stroke="#c084fc" stroke-width="1.5" />
          <path d="M 200,${bY - bH * 0.28} L 200,${bY + bH * 0.42}" stroke="#fbbf24" stroke-width="2" />
        </g>
      `;
    }

    // 9. LAYER: HEAD & CHEEKS
    const hY = stageParams.headY;
    const hRX = stageParams.headRX;
    const hRY = stageParams.headRY;
    const headSVG = `
      <g id="layer-head" class="monster-layer layer-head" data-layer="head" filter="url(#${uid}_shadow)">
        <path d="M ${200 - hRX * 0.7},${hY - hRY * 0.7} 
                 C ${200 - hRX * 1.1},${hY} ${200 - hRX * 1.25},${hY + hRY * 0.55} ${200 - hRX * 0.8},${hY + hRY * 0.85} 
                 C ${200 - hRX * 0.4},${hY + hRY * 1.05} ${200 + hRX * 0.4},${hY + hRY * 1.05} ${200 + hRX * 0.8},${hY + hRY * 0.85} 
                 C ${200 + hRX * 1.25},${hY + hRY * 0.55} ${200 + hRX * 1.1},${hY} ${200 + hRX * 0.7},${hY - hRY * 0.7} 
                 C ${200 + hRX * 0.3},${hY - hRY * 1.05} ${200 - hRX * 0.3},${hY - hRY * 1.05} ${200 - hRX * 0.7},${hY - hRY * 0.7} Z" 
              fill="url(#${uid}_fur)" stroke="${pal.shadow}" stroke-width="2" />

        <path d="M ${200 - hRX * 1.15},${hY + hRY * 0.35} Q ${200 - hRX * 0.85},${hY + hRY * 0.6} ${200 - hRX * 0.7},${hY + hRY * 0.8}" stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.6" />
        <path d="M ${200 + hRX * 1.15},${hY + hRY * 0.35} Q ${200 + hRX * 0.85},${hY + hRY * 0.6} ${200 + hRX * 0.7},${hY + hRY * 0.8}" stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.6" />
      </g>
    `;

    // 10. LAYER: EARS
    const eL = stageParams.earL;
    let earsSVG = '';
    if (config.ears === 'fox') {
      earsSVG = `
        <g id="layer-ears" class="monster-layer layer-ears" data-layer="ears" filter="url(#${uid}_shadow)">
          <g transform="translate(${200 - hRX * 0.55}, ${hY - hRY * 0.6})">
            <path d="M 0,0 L -${eL * 0.45},-${eL} Q 5,-${eL * 0.7} ${eL * 0.35},-${eL * 0.15} Z" fill="url(#${uid}_fur)" stroke="${pal.shadow}" stroke-width="2" />
            <path d="M -3,-10 L -${eL * 0.35},-${eL * 0.82} Q 2,-${eL * 0.6} ${eL * 0.2},-${eL * 0.25} Z" fill="url(#${uid}_inner_ear)" />
            <path d="M -${eL * 0.15},-${eL * 0.35} Q 0,-${eL * 0.5} ${eL * 0.1},-${eL * 0.3}" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round" />
          </g>
          <g transform="translate(${200 + hRX * 0.55}, ${hY - hRY * 0.6})">
            <path d="M 0,0 L ${eL * 0.45},-${eL} Q -5,-${eL * 0.7} -${eL * 0.35},-${eL * 0.15} Z" fill="url(#${uid}_fur)" stroke="${pal.shadow}" stroke-width="2" />
            <path d="M 3,-10 L ${eL * 0.35},-${eL * 0.82} Q -2,-${eL * 0.6} -${eL * 0.2},-${eL * 0.25} Z" fill="url(#${uid}_inner_ear)" />
            <path d="M ${eL * 0.15},-${eL * 0.35} Q 0,-${eL * 0.5} -${eL * 0.1},-${eL * 0.3}" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round" />
          </g>
        </g>
      `;
    } else if (config.ears === 'cat') {
      earsSVG = `
        <g id="layer-ears" class="monster-layer layer-ears" data-layer="ears" filter="url(#${uid}_shadow)">
          <path d="M ${200 - hRX * 0.8},${hY - hRY * 0.4} L ${200 - hRX * 0.65},${hY - hRY * 1.3} L ${200 - hRX * 0.2},${hY - hRY * 0.75} Z" fill="url(#${uid}_fur)" stroke="${pal.shadow}" stroke-width="2" />
          <path d="M ${200 - hRX * 0.72},${hY - hRY * 0.48} L ${200 - hRX * 0.65},${hY - hRY * 1.15} L ${200 - hRX * 0.3},${hY - hRY * 0.75} Z" fill="url(#${uid}_inner_ear)" />

          <path d="M ${200 + hRX * 0.8},${hY - hRY * 0.4} L ${200 + hRX * 0.65},${hY - hRY * 1.3} L ${200 + hRX * 0.2},${hY - hRY * 0.75} Z" fill="url(#${uid}_fur)" stroke="${pal.shadow}" stroke-width="2" />
          <path d="M ${200 + hRX * 0.72},${hY - hRY * 0.48} L ${200 + hRX * 0.65},${hY - hRY * 1.15} L ${200 + hRX * 0.3},${hY - hRY * 0.75} Z" fill="url(#${uid}_inner_ear)" />
        </g>
      `;
    } else if (config.ears === 'floppy') {
      earsSVG = `
        <g id="layer-ears" class="monster-layer layer-ears" data-layer="ears" filter="url(#${uid}_shadow)">
          <path d="M ${200 - hRX * 0.5},${hY - hRY * 0.7} C ${200 - hRX * 1.3},${hY - hRY * 0.2} ${200 - hRX * 1.25},${hY + hRY * 0.5} ${200 - hRX * 0.85},${hY + hRY * 0.45} Z" fill="url(#${uid}_fur)" stroke="${pal.shadow}" stroke-width="2" />
          <path d="M ${200 + hRX * 0.5},${hY - hRY * 0.7} C ${200 + hRX * 1.3},${hY - hRY * 0.2} ${200 + hRX * 1.25},${hY + hRY * 0.5} ${200 + hRX * 0.85},${hY + hRY * 0.45} Z" fill="url(#${uid}_fur)" stroke="${pal.shadow}" stroke-width="2" />
        </g>
      `;
    } else if (config.ears === 'tufted' || stage >= 5) {
      earsSVG = `
        <g id="layer-ears" class="monster-layer layer-ears" data-layer="ears" filter="url(#${uid}_shadow)">
          <path d="M ${200 - hRX * 0.6},${hY - hRY * 0.6} C ${200 - hRX * 0.9},${hY - hRY * 1.4} ${200 - hRX * 0.3},${hY - hRY * 1.5} ${200 - hRX * 0.2},${hY - hRY * 0.7} Z" fill="url(#${uid}_fur)" stroke="${pal.shadow}" stroke-width="2" />
          <path d="M ${200 + hRX * 0.6},${hY - hRY * 0.6} C ${200 + hRX * 0.9},${hY - hRY * 1.4} ${200 + hRX * 0.3},${hY - hRY * 1.5} ${200 + hRX * 0.2},${hY - hRY * 0.7} Z" fill="url(#${uid}_fur)" stroke="${pal.shadow}" stroke-width="2" />
          <circle cx="${200 - hRX * 0.6}" cy="${hY - hRY * 1.4}" r="4" fill="${pal.accent}" filter="url(#${uid}_glow)" />
          <circle cx="${200 + hRX * 0.6}" cy="${hY - hRY * 1.4}" r="4" fill="${pal.accent}" filter="url(#${uid}_glow)" />
        </g>
      `;
    }

    // 11. LAYER: FACE (Eyes, Nose, Cheeks, Mouth)
    const eyeOffsetX = hRX * 0.42;
    const eyeY = hY + hRY * 0.08;
    const eyeR = Math.max(14, hRX * 0.24);

    let eyesMarkup = '';
    if (config.eyes === 'sparkle') {
      eyesMarkup = `
        <g id="eyes-pair" class="layer-eyes">
          <ellipse cx="${200 - eyeOffsetX}" cy="${eyeY}" rx="${eyeR}" ry="${eyeR * 1.15}" fill="#0f172a" />
          <ellipse cx="${200 + eyeOffsetX}" cy="${eyeY}" rx="${eyeR}" ry="${eyeR * 1.15}" fill="#0f172a" />
          <ellipse cx="${200 - eyeOffsetX}" cy="${eyeY + 2}" rx="${eyeR * 0.85}" ry="${eyeR}" fill="url(#${uid}_iris_blue)" />
          <ellipse cx="${200 + eyeOffsetX}" cy="${eyeY + 2}" rx="${eyeR * 0.85}" ry="${eyeR}" fill="url(#${uid}_iris_blue)" />
          <path d="M ${200 - eyeOffsetX},${eyeY - 4} L ${200 - eyeOffsetX + 2},${eyeY} L ${200 - eyeOffsetX + 6},${eyeY + 2} L ${200 - eyeOffsetX + 2},${eyeY + 4} L ${200 - eyeOffsetX},${eyeY + 8} L ${200 - eyeOffsetX - 2},${eyeY + 4} L ${200 - eyeOffsetX - 6},${eyeY + 2} L ${200 - eyeOffsetX - 2},${eyeY} Z" fill="#ffffff" />
          <path d="M ${200 + eyeOffsetX},${eyeY - 4} L ${200 + eyeOffsetX + 2},${eyeY} L ${200 + eyeOffsetX + 6},${eyeY + 2} L ${200 + eyeOffsetX + 2},${eyeY + 4} L ${200 + eyeOffsetX},${eyeY + 8} L ${200 + eyeOffsetX - 2},${eyeY + 4} L ${200 + eyeOffsetX - 6},${eyeY + 2} L ${200 + eyeOffsetX - 2},${eyeY} Z" fill="#ffffff" />
        </g>
      `;
    } else if (config.eyes === 'fierce') {
      eyesMarkup = `
        <g id="eyes-pair" class="layer-eyes">
          <path d="M ${200 - eyeOffsetX - eyeR},${eyeY - 2} Q ${200 - eyeOffsetX},${eyeY - 12} ${200 - eyeOffsetX + eyeR},${eyeY + 4} Q ${200 - eyeOffsetX},${eyeY + eyeR} ${200 - eyeOffsetX - eyeR},${eyeY - 2} Z" fill="#0f172a" />
          <path d="M ${200 + eyeOffsetX + eyeR},${eyeY - 2} Q ${200 + eyeOffsetX},${eyeY - 12} ${200 + eyeOffsetX - eyeR},${eyeY + 4} Q ${200 + eyeOffsetX},${eyeY + eyeR} ${200 + eyeOffsetX + eyeR},${eyeY - 2} Z" fill="#0f172a" />
          <circle cx="${200 - eyeOffsetX}" cy="${eyeY + 1}" r="${eyeR * 0.6}" fill="url(#${uid}_iris_purple)" />
          <circle cx="${200 + eyeOffsetX}" cy="${eyeY + 1}" r="${eyeR * 0.6}" fill="url(#${uid}_iris_purple)" />
          <circle cx="${200 - eyeOffsetX - 2}" cy="${eyeY - 1}" r="3.5" fill="#ffffff" />
          <circle cx="${200 + eyeOffsetX - 2}" cy="${eyeY - 1}" r="3.5" fill="#ffffff" />
        </g>
      `;
    } else if (config.eyes === 'happy') {
      eyesMarkup = `
        <g id="eyes-pair" class="layer-eyes">
          <path d="M ${200 - eyeOffsetX - eyeR},${eyeY + 4} Q ${200 - eyeOffsetX},${eyeY - 10} ${200 - eyeOffsetX + eyeR},${eyeY + 4}" stroke="#0f172a" stroke-width="4" stroke-linecap="round" fill="none" />
          <path d="M ${200 + eyeOffsetX - eyeR},${eyeY + 4} Q ${200 + eyeOffsetX},${eyeY - 10} ${200 + eyeOffsetX + eyeR},${eyeY + 4}" stroke="#0f172a" stroke-width="4" stroke-linecap="round" fill="none" />
        </g>
      `;
    } else {
      eyesMarkup = `
        <g id="eyes-pair" class="layer-eyes">
          <ellipse cx="${200 - eyeOffsetX}" cy="${eyeY}" rx="${eyeR}" ry="${eyeR * 1.15}" fill="#0f172a" />
          <ellipse cx="${200 + eyeOffsetX}" cy="${eyeY}" rx="${eyeR}" ry="${eyeR * 1.15}" fill="#0f172a" />
          <ellipse cx="${200 - eyeOffsetX}" cy="${eyeY + 2}" rx="${eyeR * 0.85}" ry="${eyeR}" fill="url(#${uid}_iris_blue)" />
          <ellipse cx="${200 + eyeOffsetX}" cy="${eyeY + 2}" rx="${eyeR * 0.85}" ry="${eyeR}" fill="url(#${uid}_iris_blue)" />
          <ellipse cx="${200 - eyeOffsetX}" cy="${eyeY + 3}" rx="${eyeR * 0.52}" ry="${eyeR * 0.6}" fill="#050814" />
          <ellipse cx="${200 + eyeOffsetX}" cy="${eyeY + 3}" rx="${eyeR * 0.52}" ry="${eyeR * 0.6}" fill="#050814" />
          <ellipse cx="${200 - eyeOffsetX - eyeR * 0.28}" cy="${eyeY - eyeR * 0.25}" rx="${eyeR * 0.32}" ry="${eyeR * 0.38}" fill="#ffffff" />
          <circle cx="${200 - eyeOffsetX + eyeR * 0.3}" cy="${eyeY + eyeR * 0.35}" r="${eyeR * 0.16}" fill="#ffffff" />
          <ellipse cx="${200 + eyeOffsetX - eyeR * 0.28}" cy="${eyeY - eyeR * 0.25}" rx="${eyeR * 0.32}" ry="${eyeR * 0.38}" fill="#ffffff" />
          <circle cx="${200 + eyeOffsetX + eyeR * 0.3}" cy="${eyeY + eyeR * 0.35}" r="${eyeR * 0.16}" fill="#ffffff" />
        </g>
      `;
    }

    const faceSVG = `
      <g id="layer-face" class="monster-layer layer-face" data-layer="face">
        <ellipse cx="${200 - eyeOffsetX - eyeR * 0.6}" cy="${eyeY + eyeR * 0.85}" rx="11" ry="6" fill="#f43f5e" opacity="0.45" />
        <ellipse cx="${200 + eyeOffsetX + eyeR * 0.6}" cy="${eyeY + eyeR * 0.85}" rx="11" ry="6" fill="#f43f5e" opacity="0.45" />

        ${eyesMarkup}

        ${isGirl ? `
          <path d="M ${200 - eyeOffsetX + eyeR * 0.6},${eyeY - eyeR * 0.8} L ${200 - eyeOffsetX + eyeR * 1.1},${eyeY - eyeR * 1.1}" stroke="#0f172a" stroke-width="2" stroke-linecap="round" />
          <path d="M ${200 + eyeOffsetX - eyeR * 0.6},${eyeY - eyeR * 0.8} L ${200 + eyeOffsetX - eyeR * 1.1},${eyeY - eyeR * 1.1}" stroke="#0f172a" stroke-width="2" stroke-linecap="round" />
        ` : ''}

        <path d="M 196,${hY + hRY * 0.42} Q 200,${hY + hRY * 0.46} 204,${hY + hRY * 0.42} Q 200,${hY + hRY * 0.38} 196,${hY + hRY * 0.42} Z" fill="#0f172a" />
        <path d="M 191,${hY + hRY * 0.58} Q 196,${hY + hRY * 0.7} 200,${hY + hRY * 0.6} Q 204,${hY + hRY * 0.7} 209,${hY + hRY * 0.58}" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" fill="none" />
      </g>
    `;

    // 12. LAYER: BOY / GIRL STYLE & HAIR
    let hairSVG = '';
    if (isGirl) {
      hairSVG = `
        <g id="layer-hair" class="monster-layer layer-hair" data-layer="hair">
          <path d="M 175,${hY - hRY * 0.85} C 185,${hY - hRY * 0.4} 195,${hY - hRY * 0.35} 205,${hY - hRY * 0.75}" stroke="url(#${uid}_fur)" stroke-width="7" stroke-linecap="round" fill="none" />
          <g id="girl-hair-bow" transform="translate(200, ${hY - hRY * 0.95})">
            <path d="M 0,0 C -18,-14 -32,-4 -28,8 C -24,18 -8,6 0,0 Z" fill="#f472b6" stroke="#db2777" stroke-width="1.5" />
            <path d="M 0,0 C 18,-14 32,-4 28,8 C 24,18 8,6 0,0 Z" fill="#f472b6" stroke="#db2777" stroke-width="1.5" />
            <circle cx="0" cy="0" r="5" fill="#fbcfe8" stroke="#db2777" stroke-width="1.5" />
          </g>
        </g>
      `;
    } else {
      hairSVG = `
        <g id="layer-hair" class="monster-layer layer-hair" data-layer="hair">
          <path d="M 188,${hY - hRY * 0.95} Q 194,${hY - hRY * 1.35} 200,${hY - hRY * 1.45} Q 206,${hY - hRY * 1.35} 212,${hY - hRY * 0.95} Z" fill="url(#${uid}_fur)" stroke="${pal.shadow}" stroke-width="2" />
          <path d="M 178,${hY - hRY * 0.88} Q 185,${hY - hRY * 1.2} 190,${hY - hRY * 1.25} Q 192,${hY - hRY * 1.05} 195,${hY - hRY * 0.9} Z" fill="url(#${uid}_fur)" stroke="${pal.shadow}" stroke-width="1.5" />
        </g>
      `;
    }

    // 13. LAYER: ACCESSORIES
    let accSVG = '';
    if (config.accessory === 'crown' || (stage === 6 && !config.accessory)) {
      accSVG = `
        <g id="layer-accessory" class="monster-layer layer-accessory" data-layer="accessory" filter="url(#${uid}_shadow)">
          <path d="M 178,${hY - hRY * 0.95} L 172,${hY - hRY * 1.4} L 188,${hY - hRY * 1.2} L 200,${hY - hRY * 1.55} L 212,${hY - hRY * 1.2} L 228,${hY - hRY * 1.4} L 222,${hY - hRY * 0.95} Z" fill="#fbbf24" stroke="#b45309" stroke-width="2" />
          <circle cx="200" cy="${hY - hRY * 1.15}" r="3.5" fill="#ef4444" stroke="#991b1b" stroke-width="1" />
          <circle cx="185" cy="${hY - hRY * 1.08}" r="2.5" fill="#10b981" />
          <circle cx="215" cy="${hY - hRY * 1.08}" r="2.5" fill="#10b981" />
        </g>
      `;
    } else if (config.accessory === 'blue_bow') {
      accSVG = `
        <g id="layer-accessory" class="monster-layer layer-accessory" data-layer="accessory">
          <g transform="translate(200, ${hY + hRY * 0.9})">
            <path d="M 0,0 C -18,-12 -28,-2 -24,8 C -20,16 -6,4 0,0 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5" />
            <path d="M 0,0 C 18,-12 28,-2 24,8 C 20,16 6,4 0,0 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5" />
            <circle cx="0" cy="0" r="4" fill="#bae6fd" stroke="#0284c7" stroke-width="1" />
          </g>
        </g>
      `;
    } else if (config.accessory === 'bandana') {
      accSVG = `
        <g id="layer-accessory" class="monster-layer layer-accessory" data-layer="accessory">
          <path d="M 172,${hY + hRY * 0.78} Q 200,${hY + hRY * 0.9} 228,${hY + hRY * 0.78} L 206,${hY + hRY * 1.3} L 200,${hY + hRY * 1.35} L 194,${hY + hRY * 1.3} Z" fill="#ef4444" stroke="#991b1b" stroke-width="1.5" />
        </g>
      `;
    } else if (config.accessory === 'glasses') {
      accSVG = `
        <g id="layer-accessory" class="monster-layer layer-accessory" data-layer="accessory">
          <circle cx="${200 - eyeOffsetX}" cy="${eyeY}" r="${eyeR * 1.1}" fill="none" stroke="#fbbf24" stroke-width="2.5" />
          <circle cx="${200 + eyeOffsetX}" cy="${eyeY}" r="${eyeR * 1.1}" fill="none" stroke="#fbbf24" stroke-width="2.5" />
          <path d="M ${200 - eyeOffsetX + eyeR * 1.1},${eyeY} L ${200 + eyeOffsetX - eyeR * 1.1},${eyeY}" stroke="#fbbf24" stroke-width="2" />
        </g>
      `;
    } else if (config.accessory === 'badge') {
      accSVG = `
        <g id="layer-accessory" class="monster-layer layer-accessory" data-layer="accessory">
          <g transform="translate(165, ${bY - bH * 0.1}) scale(0.8)">
            <circle cx="0" cy="0" r="10" fill="#fbbf24" stroke="#b45309" stroke-width="2" />
            <polygon points="0,-7 2,-2 7,-2 3,2 5,7 0,4 -5,7 -3,2 -7,-2 -2,-2" fill="#ffffff" />
          </g>
        </g>
      `;
    } else if (config.accessory === 'wizard_hat') {
      accSVG = `
        <g id="layer-accessory" class="monster-layer layer-accessory" data-layer="accessory" filter="url(#${uid}_shadow)">
          <ellipse cx="200" cy="${hY - hRY * 0.88}" rx="45" ry="12" fill="#312e81" stroke="#4338ca" stroke-width="1.5" />
          <path d="M 165,${hY - hRY * 0.88} L 205,${hY - hRY * 1.8} L 235,${hY - hRY * 0.88} Z" fill="#3730a3" stroke="#4338ca" stroke-width="1.5" />
          <polygon points="205,-20 207,-15 212,-15 208,-12 210,-7 205,-10 200,-7 202,-12 198,-15 203,-15" fill="#fbbf24" transform="translate(0, ${hY - hRY * 1.4})" />
        </g>
      `;
    }

    // 14. LAYER: CELESTIAL STAGE 6 APEX EFFECTS
    let apexSVG = '';
    if (stage === 6) {
      apexSVG = `
        <g id="layer-apex-effects" class="monster-layer layer-effects" data-layer="effects">
          <polygon points="200,${hY - hRY * 0.4} 204,${hY - hRY * 0.25} 200,${hY - hRY * 0.1} 196,${hY - hRY * 0.25}" fill="#fbbf24" filter="url(#${uid}_glow)" />
          <circle cx="130" cy="170" r="3" fill="#fbbf24" opacity="0.8" filter="url(#${uid}_glow)" />
          <circle cx="270" cy="160" r="3.5" fill="#38bdf8" opacity="0.8" filter="url(#${uid}_glow)" />
          <circle cx="150" cy="90" r="2.5" fill="#a855f7" opacity="0.8" filter="url(#${uid}_glow)" />
          <circle cx="250" cy="85" r="3" fill="#fbbf24" opacity="0.8" filter="url(#${uid}_glow)" />
        </g>
      `;
    }

    // Assemble final composable SVG
    return `
      <svg class="monster-svg monster-stage-${stage} ${className}" viewBox="0 0 400 400" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle; overflow:visible; user-select:none; ${customStyle}" data-stage="${stage}" data-species="${config.species}" data-color="${config.furColor}" data-style="${config.style}">
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

  function renderMonster(opts = {}) {
    let student = opts.student;
    let studentId = null;
    if (typeof opts === 'string') studentId = opts;
    else if (typeof student === 'string') studentId = student;
    else if (student && student.id) studentId = student.id;

    const store = (typeof window !== 'undefined' ? (window.store || window.schoolStore) : null);
    if (!student && studentId && store && store.getStudent) {
      student = store.getStudent(studentId);
    }

    let config = Object.assign({}, opts);

    if (student) {
      if (student.monster) {
        config = Object.assign({}, student.monster, config);
      } else if (store && store.getMonsterProfile) {
        const mp = store.getMonsterProfile(student.id);
        if (mp) {
          config.furColor = config.furColor || mp.baseColor || 'blue';
          config.style = config.style || mp.style || 'boy';
          config.equipped = config.equipped || mp.equipped || {};
        }
      }
      if (store && store.getStudentTotalXP) {
        config.totalXP = store.getStudentTotalXP(student.id);
      }
    }

    return renderMonsterSVG(config, opts);
  }

  // Public API
  const MonsterRenderer = {
    render: renderMonster,
    renderSVG: renderMonsterSVG,
    renderMonsterSVG: renderMonsterSVG,
    renderMonsterArtwork: renderMonsterArtwork,
    normalizeConfig: normalizeMonsterConfig,
    getEvolutionStage: getEvolutionStage,
    getStageInfo: getStageInfo,
    stages: EVOLUTION_THRESHOLDS,
    EVOLUTION_STAGES: EVOLUTION_THRESHOLDS,
    palettes: FUR_PALETTES
  };

  root.MonsterRenderer = MonsterRenderer;
  root.MonsterEvolutionRenderer = MonsterRenderer;
  root.renderMonster = renderMonster;
  root.renderMonsterSVG = renderMonsterSVG;
  root.renderMonsterArtwork = renderMonsterArtwork;
  root.getEvolutionStage = getEvolutionStage;

  if (typeof window !== 'undefined') {
    window.MonsterRenderer = MonsterRenderer;
    window.MonsterEvolutionRenderer = MonsterRenderer;
    window.renderMonster = renderMonster;
    window.renderMonsterSVG = renderMonsterSVG;
    window.renderMonsterArtwork = renderMonsterArtwork;
    window.getEvolutionStage = getEvolutionStage;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MonsterRenderer;
  }

})(typeof window !== 'undefined' ? window : global);
