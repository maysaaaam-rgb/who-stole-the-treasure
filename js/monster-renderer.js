/**
 * ENGLISH ADVENTURE ACADEMY — CELESTIAL DRAGON-FOX COMPANION
 * 
 * Official Species: Celestial Dragon-Fox ("Academy Companion")
 * Directly modeled from project reference: assets/monsters/monster-evolution-stages-banner.png
 * 
 * Architecture:
 * - 100% Scalable Vector SVG with semantic layer groups
 * - Master-crafted 3/4 hero perspective with anatomical depth (chest forward, angled paws, haunches)
 * - Directional lighting and multi-stop gradients
 * - 7 Continuous Evolution Stages (Egg -> Baby -> Tot -> Young -> Adventurer -> Elite -> Legendary)
 * - 5 Bespoke Colorways (Azure Blue, Emerald Sprout, Solar Ember, Arcane Twilight, Sakura Blossom)
 * - Tailored Apparel & Collectible Accessories
 */

(function(root) {
  'use strict';

  const EVOLUTION_THRESHOLDS = [
    { level: 0, stageKey: 'egg', name: 'Egg', xpRequired: 0, subtitle: 'Enchanted Cosmic Egg' },
    { level: 1, stageKey: 'baby', name: 'Baby', xpRequired: 100, subtitle: 'Tiny & Cuddly Hatchling' },
    { level: 2, stageKey: 'tot', name: 'Tot', xpRequired: 300, subtitle: 'Playful Growing Explorer' },
    { level: 3, stageKey: 'young', name: 'Young', xpRequired: 700, subtitle: 'Confident Alert Partner' },
    { level: 4, stageKey: 'adventurer', name: 'Adventurer', xpRequired: 1200, subtitle: 'Quest-Ready Hero Guardian' },
    { level: 5, stageKey: 'elite', name: 'Elite', xpRequired: 2500, subtitle: 'Winged Academy Champion' },
    { level: 6, stageKey: 'legendary', name: 'Legendary', xpRequired: 5000, subtitle: 'Apex Sovereign Dragon-Fox' }
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

  function getStageInfo(level) {
    const lvl = Math.max(0, Math.min(6, parseInt(level, 10) || 0));
    return EVOLUTION_THRESHOLDS[lvl] || EVOLUTION_THRESHOLDS[0];
  }

  const FUR_PALETTES = {
    blue: {
      name: 'Celestial Azure',
      highlight: '#bae6fd',
      primaryLight: '#60a5fa',
      primary: '#38bdf8',
      primaryDark: '#0284c7',
      primaryDeep: '#075985',
      shadow: '#082f49',
      belly: '#ffffff',
      bellyShade: '#e2e8f0',
      bellyDeep: '#cbd5e1',
      innerEar: '#f472b6',
      eyeTop: '#082f49',
      eyeMid: '#0284c7',
      eyeGleam: '#38bdf8',
      hornBase: '#b45309',
      hornMid: '#fbbf24',
      hornTip: '#fef08a',
      blush: '#fb7185',
      glow: 'rgba(56, 189, 248, 0.55)'
    },
    orange: {
      name: 'Solar Ember',
      highlight: '#fef08a',
      primaryLight: '#fb923c',
      primary: '#f97316',
      primaryDark: '#ea580c',
      primaryDeep: '#c2410c',
      shadow: '#431407',
      belly: '#fffbeb',
      bellyShade: '#fef3c7',
      bellyDeep: '#fde68a',
      innerEar: '#fb7185',
      eyeTop: '#451a03',
      eyeMid: '#ea580c',
      eyeGleam: '#f59e0b',
      hornBase: '#92400e',
      hornMid: '#f59e0b',
      hornTip: '#fef3c7',
      blush: '#f87171',
      glow: 'rgba(249, 115, 22, 0.55)'
    },
    purple: {
      name: 'Arcane Twilight',
      highlight: '#e9d5ff',
      primaryLight: '#c084fc',
      primary: '#a855f7',
      primaryDark: '#7e22ce',
      primaryDeep: '#581c87',
      shadow: '#2e1065',
      belly: '#faf5ff',
      bellyShade: '#f3e8ff',
      bellyDeep: '#e9d5ff',
      innerEar: '#f472b6',
      eyeTop: '#2e1065',
      eyeMid: '#7e22ce',
      eyeGleam: '#c084fc',
      hornBase: '#b45309',
      hornMid: '#fbbf24',
      hornTip: '#fef08a',
      blush: '#f472b6',
      glow: 'rgba(168, 85, 247, 0.55)'
    },
    green: {
      name: 'Emerald Sprout',
      highlight: '#a7f3d0',
      primaryLight: '#4ade80',
      primary: '#10b981',
      primaryDark: '#059669',
      primaryDeep: '#047857',
      shadow: '#064e3b',
      belly: '#f0fdf4',
      bellyShade: '#dcfce7',
      bellyDeep: '#bbf7d0',
      innerEar: '#fb7185',
      eyeTop: '#064e3b',
      eyeMid: '#059669',
      eyeGleam: '#34d399',
      hornBase: '#b45309',
      hornMid: '#fbbf24',
      hornTip: '#fef08a',
      blush: '#fb7185',
      glow: 'rgba(16, 185, 129, 0.55)'
    },
    pink: {
      name: 'Sakura Blossom',
      highlight: '#fce7f3',
      primaryLight: '#f472b6',
      primary: '#ec4899',
      primaryDark: '#db2777',
      primaryDeep: '#be185d',
      shadow: '#500724',
      belly: '#fff5f7',
      bellyShade: '#fce7f3',
      bellyDeep: '#fbcfe8',
      innerEar: '#fb7185',
      eyeTop: '#500724',
      eyeMid: '#db2777',
      eyeGleam: '#f472b6',
      hornBase: '#b45309',
      hornMid: '#fbbf24',
      hornTip: '#fef08a',
      blush: '#f43f5e',
      glow: 'rgba(236, 72, 153, 0.55)'
    }
  };

  const STAGE_SCALING = {
    0: { name: 'Egg', scale: 1.0 },
    1: { // Baby hatchling
      headSize: 1.18,
      bodyWidth: 0.82,
      bodyHeight: 0.80,
      pawScale: 0.80,
      hornLength: 0.25,
      hornType: 'bud',
      tailScale: 0.65,
      wingScale: 0,
      hasArmor: false,
      yOffset: 32
    },
    2: { // Tot
      headSize: 1.10,
      bodyWidth: 0.88,
      bodyHeight: 0.86,
      pawScale: 0.88,
      hornLength: 0.50,
      hornType: 'hornlet',
      tailScale: 0.82,
      wingScale: 0,
      hasArmor: false,
      yOffset: 22
    },
    3: { // Young
      headSize: 1.02,
      bodyWidth: 0.95,
      bodyHeight: 0.94,
      pawScale: 0.96,
      hornLength: 0.80,
      hornType: 'curved',
      tailScale: 0.95,
      wingScale: 0,
      hasArmor: false,
      yOffset: 12
    },
    4: { // Adventurer
      headSize: 0.98,
      bodyWidth: 1.04,
      bodyHeight: 1.02,
      pawScale: 1.02,
      hornLength: 1.0,
      hornType: 'swept',
      tailScale: 1.10,
      wingScale: 0,
      hasArmor: true,
      yOffset: 0
    },
    5: { // Elite
      headSize: 0.96,
      bodyWidth: 1.08,
      bodyHeight: 1.05,
      pawScale: 1.05,
      hornLength: 1.25,
      hornType: 'dragon',
      tailScale: 1.22,
      wingScale: 1.0,
      hasArmor: true,
      yOffset: -6
    },
    6: { // Legendary
      headSize: 0.95,
      bodyWidth: 1.12,
      bodyHeight: 1.08,
      pawScale: 1.08,
      hornLength: 1.45,
      hornType: 'crowned',
      tailScale: 1.35,
      wingScale: 1.25,
      hasArmor: true,
      yOffset: -12
    }
  };

  function renderMonsterSVG(config = {}, options = {}) {
    let stage = 3;
    if (config.previewStage !== undefined && config.previewStage !== null) {
      stage = parseInt(config.previewStage, 10);
    } else if (config.evolutionStage !== undefined && config.evolutionStage !== null) {
      stage = parseInt(config.evolutionStage, 10);
    } else if (config.stageKey) {
      const found = EVOLUTION_THRESHOLDS.find(t => t.stageKey === config.stageKey);
      if (found) stage = found.level;
    } else if (config.stage !== undefined) {
      stage = parseInt(config.stage, 10);
    }
    stage = Math.max(0, Math.min(6, isNaN(stage) ? 3 : stage));

    const colorKey = (config.furColor || config.color || 'blue').toLowerCase();
    const pal = FUR_PALETTES[colorKey] || FUR_PALETTES.blue;
    const isGirl = (config.style || config.monsterStyle || 'boy') === 'girl';

    const size = parseInt(options.size || config.size, 10) || 400;
    const showPedestal = options.showPedestal !== undefined ? options.showPedestal : true;
    const uid = 'cel_' + Math.random().toString(36).substr(2, 7);

    // =========================================================================
    // STAGE 0: ENCHANTED COSMIC EGG
    // =========================================================================
    if (stage === 0) {
      return `
        <svg class="monster-svg monster-egg" viewBox="0 0 400 400" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="display:block; margin:auto; overflow:hidden; user-select:none;">
          <defs>
            <radialGradient id="${uid}_egg_ped" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#0284c7" stop-opacity="0.85"/>
              <stop offset="70%" stop-color="#0369a1" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#082f49" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="${uid}_egg_grad" x1="15%" y1="10%" x2="85%" y2="90%">
              <stop offset="0%" stop-color="${pal.highlight}"/>
              <stop offset="35%" stop-color="${pal.primary}"/>
              <stop offset="75%" stop-color="${pal.primaryDark}"/>
              <stop offset="100%" stop-color="${pal.primaryDeep}"/>
            </linearGradient>
            <linearGradient id="${uid}_gold_crack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a"/>
              <stop offset="50%" stop-color="#fbbf24"/>
              <stop offset="100%" stop-color="#b45309"/>
            </linearGradient>
            <filter id="${uid}_glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
            <filter id="${uid}_drop_shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#020617" flood-opacity="0.65"/>
            </filter>
          </defs>

          ${showPedestal ? `
            <g id="layer-pedestal" class="monster-layer layer-pedestal">
              <ellipse cx="200" cy="342" rx="140" ry="40" fill="url(#${uid}_egg_ped)" />
              <ellipse cx="200" cy="336" rx="110" ry="24" fill="#091426" stroke="#1e3a8a" stroke-width="2" />
              <ellipse cx="200" cy="336" rx="85" ry="16" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="6,4" />
            </g>
          ` : ''}

          <g id="layer-aura" class="monster-layer layer-aura">
            <circle cx="200" cy="215" r="115" fill="${pal.glow}" opacity="0.35" filter="url(#${uid}_glow)" />
            <circle cx="120" cy="180" r="3" fill="#ffffff" opacity="0.8" filter="url(#${uid}_glow)" />
            <circle cx="280" cy="160" r="4" fill="#fef08a" opacity="0.85" filter="url(#${uid}_glow)" />
          </g>

          <g id="layer-egg-body" class="monster-layer layer-egg" filter="url(#${uid}_drop_shadow)">
            <path d="M 200,90 C 130,90 108,180 108,245 C 108,305 145,335 200,335 C 255,335 292,305 292,245 C 292,180 270,90 200,90 Z" fill="url(#${uid}_egg_grad)" stroke="${pal.primaryDeep}" stroke-width="3" />
            <path d="M 175,115 C 145,130 130,175 130,220 C 130,170 148,130 175,115 Z" fill="#ffffff" opacity="0.45" />

            <!-- Luminous Gold Cracks -->
            <path d="M 200,165 L 212,190 L 195,215 L 220,245 L 205,275 L 222,300" stroke="url(#${uid}_gold_crack)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#${uid}_glow)" />
            <path d="M 195,215 L 175,230 L 165,250" stroke="url(#${uid}_gold_crack)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#${uid}_glow)" />
            <path d="M 220,245 L 242,255 L 255,250" stroke="url(#${uid}_gold_crack)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#${uid}_glow)" />

            <!-- Dragon Scales -->
            <path d="M 150,275 Q 160,265 170,275" stroke="${pal.highlight}" stroke-width="2.5" fill="none" opacity="0.6" />
            <path d="M 230,280 Q 240,270 250,280" stroke="${pal.highlight}" stroke-width="2.5" fill="none" opacity="0.6" />
            <circle cx="212" cy="230" r="14" fill="#fef08a" opacity="0.65" filter="url(#${uid}_glow)" />
          </g>
        </svg>
      `;
    }

    // =========================================================================
    // STAGES 1 TO 6: THE CELESTIAL DRAGON-FOX COMPANION
    // =========================================================================
    const sConf = STAGE_SCALING[stage] || STAGE_SCALING[3];
    const yOff = sConf.yOffset || 0;

    const headScale = sConf.headSize;
    const bodyW = sConf.bodyWidth;
    const bodyH = sConf.bodyHeight;
    const tailSc = sConf.tailScale;
    const pawSc = sConf.pawScale;
    const wingSc = sConf.wingScale;

    const headCX = 200;
    const headCY = 158 + yOff;

    return `
      <svg class="monster-svg companion-celestial-species stage-${stage}" viewBox="0 0 400 400" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="display:block; margin:auto; overflow:hidden; user-select:none;">
        <defs>
          <!-- Directional 3D Fur Gradients -->
          <linearGradient id="${uid}_fur_body" x1="20%" y1="10%" x2="80%" y2="90%">
            <stop offset="0%" stop-color="${pal.highlight}"/>
            <stop offset="30%" stop-color="${pal.primaryLight}"/>
            <stop offset="65%" stop-color="${pal.primary}"/>
            <stop offset="88%" stop-color="${pal.primaryDark}"/>
            <stop offset="100%" stop-color="${pal.primaryDeep}"/>
          </linearGradient>

          <radialGradient id="${uid}_head_sphere" cx="44%" cy="36%" r="65%">
            <stop offset="0%" stop-color="${pal.highlight}"/>
            <stop offset="35%" stop-color="${pal.primaryLight}"/>
            <stop offset="70%" stop-color="${pal.primary}"/>
            <stop offset="90%" stop-color="${pal.primaryDark}"/>
            <stop offset="100%" stop-color="${pal.primaryDeep}"/>
          </radialGradient>

          <!-- Soft Cream Chest Bib & Muzzle -->
          <linearGradient id="${uid}_cream_bib" x1="45%" y1="0%" x2="55%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="55%" stop-color="${pal.belly}"/>
            <stop offset="85%" stop-color="${pal.bellyShade}"/>
            <stop offset="100%" stop-color="${pal.bellyDeep}"/>
          </linearGradient>

          <!-- Inner Ear Gradient -->
          <linearGradient id="${uid}_inner_ear" x1="30%" y1="10%" x2="70%" y2="90%">
            <stop offset="0%" stop-color="${pal.innerEar}"/>
            <stop offset="70%" stop-color="#f43f5e"/>
            <stop offset="100%" stop-color="#be185d"/>
          </linearGradient>

          <!-- 3D Dragon Horn Metallic Gradient -->
          <linearGradient id="${uid}_horn_gold" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stop-color="${pal.hornTip}"/>
            <stop offset="35%" stop-color="${pal.hornMid}"/>
            <stop offset="75%" stop-color="${pal.hornBase}"/>
            <stop offset="100%" stop-color="#78350f"/>
          </linearGradient>

          <!-- Anime Jewel Iris Gradient -->
          <radialGradient id="${uid}_eye_iris" cx="45%" cy="38%" r="62%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="30%" stop-color="${pal.eyeGleam}"/>
            <stop offset="70%" stop-color="${pal.eyeMid}"/>
            <stop offset="100%" stop-color="${pal.eyeTop}"/>
          </radialGradient>

          <!-- Feathered Wing Gradients -->
          <linearGradient id="${uid}_wing_primary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${pal.highlight}"/>
            <stop offset="40%" stop-color="${pal.primary}"/>
            <stop offset="85%" stop-color="${pal.primaryDark}"/>
            <stop offset="100%" stop-color="${pal.primaryDeep}"/>
          </linearGradient>

          <!-- Dais Platform Radial -->
          <radialGradient id="${uid}_dais_rad" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.85"/>
            <stop offset="50%" stop-color="#0284c7" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#0c4a6e" stop-opacity="0"/>
          </radialGradient>

          <!-- Soft Atmospheric Filters -->
          <filter id="${uid}_soft_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#020617" flood-opacity="0.45"/>
          </filter>
          <filter id="${uid}_deep_shadow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#020617" flood-opacity="0.55"/>
          </filter>
          <filter id="${uid}_glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>

        <!-- ================================================================= -->
        <!-- 1. LAYER: PEDESTAL & RUNIC DAIS                                   -->
        <!-- ================================================================= -->
        ${showPedestal ? `
          <g id="layer-pedestal" class="monster-layer layer-pedestal">
            <ellipse cx="200" cy="344" rx="145" ry="42" fill="url(#${uid}_dais_rad)" />
            <ellipse cx="200" cy="340" rx="122" ry="26" fill="#091426" stroke="#1e3a8a" stroke-width="2.5" />
            <ellipse cx="200" cy="338" rx="100" ry="20" fill="#0f223d" stroke="#38bdf8" stroke-width="1.8" />
            <ellipse cx="200" cy="338" rx="76" ry="14" fill="none" stroke="#60a5fa" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.75" />
            <circle cx="108" cy="338" r="3.5" fill="#38bdf8" filter="url(#${uid}_glow)" />
            <circle cx="292" cy="338" r="3.5" fill="#38bdf8" filter="url(#${uid}_glow)" />
          </g>
        ` : ''}

        <!-- ================================================================= -->
        <!-- 2. LAYER: AURA & STARDUST PARTICLES                               -->
        <!-- ================================================================= -->
        <g id="layer-aura" class="monster-layer layer-aura">
          ${(config.aura === 'wings' || stage >= 5) ? `
            <ellipse cx="200" cy="${210 + yOff}" rx="140" ry="115" fill="${pal.glow}" opacity="0.32" filter="url(#${uid}_glow)" />
          ` : ''}
          ${(config.aura === 'sparks' || stage >= 4) ? `
            <circle cx="95" cy="${160 + yOff}" r="3" fill="#fef08a" opacity="0.85" filter="url(#${uid}_glow)" />
            <circle cx="305" cy="${145 + yOff}" r="3.5" fill="#ffffff" opacity="0.9" filter="url(#${uid}_glow)" />
            <circle cx="115" cy="${255 + yOff}" r="2.5" fill="${pal.highlight}" opacity="0.8" />
            <circle cx="290" cy="${265 + yOff}" r="3" fill="#fef08a" opacity="0.85" filter="url(#${uid}_glow)" />
          ` : ''}
        </g>

        <!-- ================================================================= -->
        <!-- 3. LAYER: CELESTIAL FEATHERED WINGS (Stages 5 & 6)                -->
        <!-- ================================================================= -->
        ${(wingSc > 0) ? `
          <g id="layer-wings" class="monster-layer layer-wings" filter="url(#${uid}_soft_shadow)">
            <!-- Left Feathered Wing Spanning Upward & Outward -->
            <g transform="translate(130, ${180 + yOff}) scale(${wingSc}) translate(-130, -${180 + yOff})">
              <!-- Tier 1 Long Flight Feathers -->
              <path d="M 140,210 C 105,170 42,90 32,35 C 30,70 60,155 110,220 Z" fill="${pal.primaryDeep}" />
              <path d="M 136,210 C 106,165 58,98 52,62 C 58,95 90,165 125,220 Z" fill="${pal.primaryDark}" />
              <path d="M 132,215 C 112,175 75,120 76,88 C 82,118 108,175 132,224 Z" fill="url(#${uid}_wing_primary)" />
              <path d="M 128,220 C 116,188 95,145 98,118 C 104,142 120,185 136,226 Z" fill="${pal.highlight}" />
              ${stage === 6 ? `
                <polygon points="32,35 45,58 30,64" fill="#fbbf24" filter="url(#${uid}_glow)" />
                <polygon points="52,62 64,84 48,90" fill="#fbbf24" />
                <polygon points="76,88 88,108 72,114" fill="#fbbf24" />
              ` : ''}
            </g>

            <!-- Right Feathered Wing Spanning Upward & Outward -->
            <g transform="translate(270, ${180 + yOff}) scale(${wingSc}) translate(-270, -${180 + yOff})">
              <path d="M 260,210 C 295,170 358,90 368,35 C 370,70 340,155 290,220 Z" fill="${pal.primaryDeep}" />
              <path d="M 264,210 C 294,165 342,98 348,62 C 342,95 310,165 275,220 Z" fill="${pal.primaryDark}" />
              <path d="M 268,215 C 288,175 325,120 324,88 C 318,118 292,175 268,224 Z" fill="url(#${uid}_wing_primary)" />
              <path d="M 272,220 C 284,188 305,145 302,118 C 296,142 280,185 264,226 Z" fill="${pal.highlight}" />
              ${stage === 6 ? `
                <polygon points="368,35 355,58 370,64" fill="#fbbf24" filter="url(#${uid}_glow)" />
                <polygon points="348,62 336,84 352,90" fill="#fbbf24" />
                <polygon points="324,88 312,108 328,114" fill="#fbbf24" />
              ` : ''}
            </g>
          </g>
        ` : ''}

        <!-- ================================================================= -->
        <!-- 4. LAYER: SWEEPING DRAGON-FOX 'S' PLUME TAIL                      -->
        <!-- ================================================================= -->
        <g id="layer-tail" class="monster-layer layer-tail" filter="url(#${uid}_deep_shadow)">
          <g transform="translate(230, ${270 + yOff}) scale(${tailSc}) translate(-230, -${270 + yOff})">
            <!-- Under-shadow boundary for 3D depth -->
            <path d="M 235,285 C 295,305 358,272 368,198 C 378,138 318,88 262,118 C 236,132 230,168 232,208 C 234,245 234,272 235,285 Z" fill="${pal.primaryDeep}" />
            
            <!-- Volumetric Main Tail Fur Body -->
            <path d="M 230,280 C 286,298 348,266 358,198 C 368,142 312,96 264,124 C 242,136 236,168 238,208 Z" fill="url(#${uid}_fur_body)" stroke="${pal.primaryDeep}" stroke-width="2" />
            
            <!-- Soft Layered Tail Fur Crest Fluffs -->
            <path d="M 338,155 C 352,170 354,192 338,208 C 346,194 345,180 338,155 Z" fill="${pal.highlight}" opacity="0.8" />
            <path d="M 312,208 C 326,222 328,242 314,258 C 322,244 320,232 312,208 Z" fill="${pal.highlight}" opacity="0.7" />

            <!-- Cream/White Luminous Tail Tip -->
            <path d="M 358,198 C 368,142 312,96 264,124 C 286,118 325,135 338,168 C 348,182 355,192 358,198 Z" fill="#ffffff" opacity="0.96" />

            <!-- Golden Dragon Spine Scales (Stages 3+) -->
            ${stage >= 3 ? `
              <polygon points="340,140 360,128 348,155" fill="${pal.hornMid}" />
              <polygon points="352,170 372,162 358,186" fill="${pal.hornMid}" />
              <polygon points="344,204 362,200 348,222" fill="${pal.hornMid}" />
            ` : ''}

            ${stage === 6 ? `
              <!-- Legendary Stardust Sparkles on Tail -->
              <circle cx="345" cy="120" r="3.5" fill="#ffffff" filter="url(#${uid}_glow)" />
              <circle cx="365" cy="165" r="3" fill="#fef08a" filter="url(#${uid}_glow)" />
            ` : ''}
          </g>
        </g>

        <!-- ================================================================= -->
        <!-- 5. LAYER: HIND LEGS & 3/4 SEATED HAUNCHES                         -->
        <!-- ================================================================= -->
        <g id="layer-hind-legs" class="monster-layer layer-hind-legs" filter="url(#${uid}_soft_shadow)">
          <g transform="translate(200, ${305 + yOff}) scale(${bodyW}, ${bodyH}) translate(-200, -${305 + yOff})">
            <!-- Left Hind Haunch & Foot (3/4 Foreground) -->
            <path d="M 125,265 C 98,278 92,312 108,335 C 120,348 146,346 156,330 C 162,318 156,282 140,268 Z" fill="${pal.primaryDeep}" />
            <path d="M 128,268 C 104,278 98,310 112,332 C 124,344 146,342 154,328 C 158,315 152,285 140,270 Z" fill="url(#${uid}_fur_body)" />
            <ellipse cx="125" cy="336" rx="21" ry="12" fill="${pal.belly}" stroke="${pal.bellyDeep}" stroke-width="1.5" />
            <circle cx="113" cy="338" r="3.2" fill="${pal.blush}" opacity="0.6" />
            <circle cx="125" cy="339" r="3.6" fill="${pal.blush}" opacity="0.6" />
            <circle cx="137" cy="338" r="3.2" fill="${pal.blush}" opacity="0.6" />

            <!-- Right Hind Haunch (3/4 Background) -->
            <path d="M 270,265 C 294,275 298,310 285,332 C 274,345 250,342 242,328 C 236,315 242,282 256,268 Z" fill="${pal.primaryDeep}" />
            <path d="M 268,268 C 290,276 294,308 282,330 C 272,340 250,338 244,326 C 240,314 246,284 256,270 Z" fill="url(#${uid}_fur_body)" />
            <ellipse cx="270" cy="336" rx="20" ry="12" fill="${pal.belly}" stroke="${pal.bellyDeep}" stroke-width="1.5" />
            <circle cx="258" cy="338" r="3.2" fill="${pal.blush}" opacity="0.6" />
            <circle cx="270" cy="339" r="3.6" fill="${pal.blush}" opacity="0.6" />
            <circle cx="282" cy="338" r="3.2" fill="${pal.blush}" opacity="0.6" />
          </g>
        </g>

        <!-- ================================================================= -->
        <!-- 6. LAYER: TORSO & LAYERED FLUFFY CHEST BIB                        -->
        <!-- ================================================================= -->
        <g id="layer-body" class="monster-layer layer-body" filter="url(#${uid}_soft_shadow)">
          <g transform="translate(200, ${250 + yOff}) scale(${bodyW}, ${bodyH}) translate(-200, -${250 + yOff})">
            <!-- Organic Anatomic Torso Silhouette -->
            <path d="M 154,195 C 138,230 135,285 146,315 C 156,336 244,336 254,315 C 265,285 262,230 246,195 C 234,175 166,175 154,195 Z" fill="url(#${uid}_fur_body)" stroke="${pal.primaryDeep}" stroke-width="2.5" />

            <!-- Cream Chest Bib (3-Tier Layered Fluff System) -->
            <path d="M 166,198 C 154,235 156,285 168,318 C 178,332 222,332 232,318 C 244,285 246,235 234,198 C 220,186 180,186 166,198 Z" fill="url(#${uid}_cream_bib)" stroke="${pal.bellyDeep}" stroke-width="1.5" />

            <!-- Tier 1 Chest Fur Tuft -->
            <path d="M 178,212 C 188,226 195,232 200,230 C 205,232 212,226 222,212 C 215,225 208,236 200,238 C 192,236 185,225 178,212 Z" fill="#ffffff" opacity="0.95" />
            
            <!-- Tier 2 Chest Fur Tuft -->
            <path d="M 172,242 C 185,260 194,268 200,266 C 206,268 215,260 228,242 C 220,258 210,272 200,274 C 190,272 180,258 172,242 Z" fill="#ffffff" opacity="0.95" />

            <!-- Tier 3 Lower Belly Tuft -->
            <path d="M 180,275 C 190,290 196,296 200,295 C 204,296 210,290 220,275 C 214,288 208,298 200,300 C 192,298 186,288 180,275 Z" fill="#ffffff" opacity="0.9" />
          </g>
        </g>

        <!-- ================================================================= -->
        <!-- 7. LAYER: FORELIMBS & ROUNDED CAT/FOX PAWS                        -->
        <!-- ================================================================= -->
        <g id="layer-forelimbs" class="monster-layer layer-forelimbs" filter="url(#${uid}_soft_shadow)">
          <g transform="translate(200, ${315 + yOff}) scale(${pawSc}) translate(-200, -${315 + yOff})">
            <!-- Left Forearm (Angling from shoulder to paw) -->
            <path d="M 166,236 C 160,265 162,296 170,320 C 174,328 184,328 186,320 C 188,296 182,265 178,236 Z" fill="${pal.belly}" stroke="${pal.bellyDeep}" stroke-width="1.8" />
            <g transform="translate(176, 324)">
              <ellipse cx="0" cy="0" rx="16" ry="11" fill="${pal.belly}" stroke="${pal.bellyDeep}" stroke-width="1.6" />
              <ellipse cx="-5" cy="3" rx="3.0" ry="2.4" fill="${pal.blush}" opacity="0.65" />
              <ellipse cx="0" cy="4" rx="3.4" ry="2.6" fill="${pal.blush}" opacity="0.65" />
              <ellipse cx="5" cy="3" rx="3.0" ry="2.4" fill="${pal.blush}" opacity="0.65" />
            </g>

            <!-- Right Forearm (Angling from shoulder to paw) -->
            <path d="M 234,236 C 240,265 238,296 230,320 C 226,328 216,328 214,320 C 212,296 218,265 222,236 Z" fill="${pal.belly}" stroke="${pal.bellyDeep}" stroke-width="1.8" />
            <g transform="translate(224, 324)">
              <ellipse cx="0" cy="0" rx="16" ry="11" fill="${pal.belly}" stroke="${pal.bellyDeep}" stroke-width="1.6" />
              <ellipse cx="-5" cy="3" rx="3.0" ry="2.4" fill="${pal.blush}" opacity="0.65" />
              <ellipse cx="0" cy="4" rx="3.4" ry="2.6" fill="${pal.blush}" opacity="0.65" />
              <ellipse cx="5" cy="3" rx="3.0" ry="2.4" fill="${pal.blush}" opacity="0.65" />
            </g>
          </g>
        </g>

        <!-- ================================================================= -->
        <!-- 8. LAYER: TAILORED OUTFITS (Only for Stages 3+ or Equipped)       -->
        <!-- ================================================================= -->
        ${((config.outfit && config.outfit !== 'none' && stage >= 3) || (sConf.hasArmor && (!config.outfit || config.outfit === 'adventurer'))) ? `
          <g id="layer-outfit" class="monster-layer layer-outfit" filter="url(#${uid}_soft_shadow)">
            ${(config.outfit === 'scholar') ? `
              <!-- Scholar Tailored Vest -->
              <path d="M 160,215 L 150,298 C 165,308 235,308 250,298 L 240,215 C 228,212 215,228 200,232 C 185,228 172,212 160,215 Z" fill="#1e3a8a" stroke="#172554" stroke-width="2.2" />
              <path d="M 188,226 L 200,250 L 212,226" stroke="#fbbf24" stroke-width="2.5" fill="none" />
              <circle cx="200" cy="258" r="3.2" fill="#fbbf24" />
              <circle cx="200" cy="274" r="3.2" fill="#fbbf24" />
              <circle cx="200" cy="290" r="3.2" fill="#fbbf24" />
            ` : (config.outfit === 'hero') ? `
              <!-- Hero Flowing Cape & Gold Brooch -->
              <path d="M 146,205 C 122,240 112,315 118,338 C 144,332 152,285 160,250 Z" fill="#dc2626" stroke="#991b1b" stroke-width="2" />
              <path d="M 254,205 C 278,240 288,315 282,338 C 256,332 248,285 240,250 Z" fill="#dc2626" stroke="#991b1b" stroke-width="2" />
              <circle cx="200" cy="215" r="9" fill="#fbbf24" stroke="#b45309" stroke-width="2" />
              <polygon points="200,208 203,214 208,214 204,218 206,223 200,220 194,223 196,218 192,214 197,214" fill="#ffffff" />
            ` : (config.outfit === 'mystic') ? `
              <!-- Mystic Robe -->
              <path d="M 158,215 L 146,312 C 168,328 232,328 254,312 L 242,215 C 226,225 214,232 200,232 C 186,232 174,225 158,215 Z" fill="#4338ca" stroke="#312e81" stroke-width="2.2" />
              <path d="M 150,300 Q 200,320 250,300" stroke="#a855f7" stroke-width="3" fill="none" />
              <circle cx="200" cy="226" r="7" fill="#38bdf8" stroke="#0284c7" stroke-width="2" filter="url(#${uid}_glow)" />
            ` : `
              <!-- Adventurer Explorer Harness (Fitted to 3/4 Chest) -->
              <g id="outfit-adventurer">
                <path d="M 166,206 C 170,235 174,265 176,295 L 188,295 C 186,265 182,235 176,206 Z" fill="#78350f" stroke="#451a03" stroke-width="1.5" />
                <path d="M 234,206 C 230,235 226,265 224,295 L 212,295 C 214,265 218,235 224,206 Z" fill="#78350f" stroke="#451a03" stroke-width="1.5" />
                <rect x="156" y="278" width="88" height="15" rx="3" fill="#92400e" stroke="#451a03" stroke-width="1.8" />
                <rect x="190" y="274" width="20" height="23" rx="4" fill="#fbbf24" stroke="#b45309" stroke-width="2" />
                <rect x="195" y="279" width="10" height="13" rx="2" fill="#78350f" />
                <circle cx="172" cy="224" r="2.5" fill="#fbbf24" />
                <circle cx="228" cy="224" r="2.5" fill="#fbbf24" />
                <circle cx="175" cy="254" r="2.5" fill="#fbbf24" />
                <circle cx="225" cy="254" r="2.5" fill="#fbbf24" />
                <path d="M 148,228 C 135,238 130,268 138,288 L 146,284 C 140,268 142,244 152,234 Z" fill="#5c2b09" stroke="#451a03" stroke-width="1.2" />
              </g>
            `}
          </g>
        ` : ''}

        <!-- ================================================================= -->
        <!-- 9. LAYER: HEAD & CHUBBY CHEEK FUR TUFTS                           -->
        <!-- ================================================================= -->
        <g id="layer-head" class="monster-layer layer-head" filter="url(#${uid}_soft_shadow)">
          <g transform="translate(${headCX}, ${headCY}) scale(${headScale}) translate(-${headCX}, -${headCY})">
            <!-- Organic Cranium & 3-Tier Plush Cheek Fluffs -->
            <path d="
              M 150,118
              C 134,136 112,154 116,176
              C 106,184 108,206 128,216
              C 142,224 165,228 200,228
              C 235,228 258,224 272,216
              C 292,206 294,184 284,176
              C 288,154 266,136 250,118
              C 234,98 166,98 150,118 Z"
              fill="url(#${uid}_head_sphere)"
              stroke="${pal.primaryDeep}"
              stroke-width="2.6"
            />

            <!-- Soft Cream Face Mask (Snout & Lower Cheeks) -->
            <path d="
              M 136,172
              C 118,182 116,204 134,215
              C 148,224 170,227 200,227
              C 230,227 252,224 266,215
              C 284,204 282,182 264,172
              C 244,166 226,175 200,175
              C 174,175 156,166 136,172 Z"
              fill="url(#${uid}_cream_bib)"
              stroke="${pal.bellyDeep}"
              stroke-width="1.4"
            />
          </g>
        </g>

        <!-- ================================================================= -->
        <!-- 10. LAYER: LARGE EXPRESSIVE FENNEC EARS                           -->
        <!-- ================================================================= -->
        <g id="layer-ears" class="monster-layer layer-ears" filter="url(#${uid}_soft_shadow)">
          <g transform="translate(${headCX}, ${headCY}) scale(${headScale}) translate(-${headCX}, -${headCY})">
            <!-- Left Fennec Ear (Organic Curved Contour) -->
            <path d="M 160,118 C 132,92 88,58 74,40 C 70,72 96,128 142,145 Z" fill="url(#${uid}_head_sphere)" stroke="${pal.primaryDeep}" stroke-width="2.6" />
            <path d="M 154,116 C 130,94 92,65 82,50 C 80,74 102,122 138,138 Z" fill="url(#${uid}_inner_ear)" />
            <path d="M 136,134 Q 118,110 102,118" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.9" />

            <!-- Right Fennec Ear (Organic Curved Contour) -->
            <path d="M 240,118 C 268,92 312,58 326,40 C 330,72 304,128 258,145 Z" fill="url(#${uid}_head_sphere)" stroke="${pal.primaryDeep}" stroke-width="2.6" />
            <path d="M 246,116 C 270,94 308,65 318,50 C 320,74 298,122 262,138 Z" fill="url(#${uid}_inner_ear)" />
            <path d="M 264,134 Q 282,110 298,118" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.9" />
          </g>
        </g>

        <!-- ================================================================= -->
        <!-- 11. LAYER: CELESTIAL DRAGON HORNS (Growing per Stage)             -->
        <!-- ================================================================= -->
        <g id="layer-horns" class="monster-layer layer-horns" filter="url(#${uid}_soft_shadow)">
          <g transform="translate(${headCX}, ${headCY}) scale(${headScale}) translate(-${headCX}, -${headCY})">
            ${(sConf.hornType === 'bud') ? `
              <!-- Baby Horn Buds -->
              <ellipse cx="168" cy="110" rx="7.5" ry="9" fill="url(#${uid}_horn_gold)" stroke="#92400e" stroke-width="1.8" />
              <ellipse cx="232" cy="110" rx="7.5" ry="9" fill="url(#${uid}_horn_gold)" stroke="#92400e" stroke-width="1.8" />
            ` : (sConf.hornType === 'hornlet') ? `
              <!-- Tot Short Curved Hornlets -->
              <path d="M 170,114 C 158,95 152,80 156,68 C 162,78 168,96 176,114 Z" fill="url(#${uid}_horn_gold)" stroke="#92400e" stroke-width="2" />
              <path d="M 230,114 C 242,95 248,80 244,68 C 238,78 232,96 224,114 Z" fill="url(#${uid}_horn_gold)" stroke="#92400e" stroke-width="2" />
            ` : `
              <!-- Swept Dragon Horns (Stages 3 to 6) -->
              <!-- Left Horn -->
              <path d="M 172,116 C 150,85 136,52 142,32 C 150,48 165,82 180,114 Z" fill="url(#${uid}_horn_gold)" stroke="#92400e" stroke-width="2.4" />
              <path d="M 160,82 Q 168,88 174,84" stroke="#78350f" stroke-width="2" fill="none" />
              <path d="M 150,60 Q 158,66 164,62" stroke="#78350f" stroke-width="2" fill="none" />

              <!-- Right Horn -->
              <path d="M 228,116 C 250,85 264,52 258,32 C 250,48 235,82 220,114 Z" fill="url(#${uid}_horn_gold)" stroke="#92400e" stroke-width="2.4" />
              <path d="M 240,82 Q 232,88 226,84" stroke="#78350f" stroke-width="2" fill="none" />
              <path d="M 250,60 Q 242,66 236,62" stroke="#78350f" stroke-width="2" fill="none" />
            `}
          </g>
        </g>

        <!-- ================================================================= -->
        <!-- 12. LAYER: FOREHEAD MANE / WINDSWEPT CREST                        -->
        <!-- ================================================================= -->
        <g id="layer-hair" class="monster-layer layer-hair" filter="url(#${uid}_soft_shadow)">
          <g transform="translate(${headCX}, ${headCY}) scale(${headScale}) translate(-${headCX}, -${headCY})">
            <path d="
              M 174,122
              C 166,95 182,78 190,68
              C 194,80 198,62 200,52
              C 202,62 206,80 210,68
              C 218,78 234,95 226,122
              C 216,108 184,108 174,122 Z"
              fill="url(#${uid}_head_sphere)"
              stroke="${pal.primaryDeep}"
              stroke-width="2.2"
            />
            <path d="M 188,92 Q 198,72 204,86" stroke="${pal.highlight}" stroke-width="2.6" stroke-linecap="round" fill="none" />

            <!-- Girl Style: Sweet Silk Bow on Outer Left Ear Root -->
            ${isGirl ? `
              <g id="girl-ear-bow" transform="translate(136, 126) rotate(-22) scale(0.85)">
                <path d="M 0,0 C -22,-18 -36,-5 -28,12 C -24,20 -8,6 0,0 Z" fill="#f472b6" stroke="#db2777" stroke-width="2" />
                <path d="M 0,0 C 22,-18 36,-5 28,12 C 24,20 8,6 0,0 Z" fill="#f472b6" stroke="#db2777" stroke-width="2" />
                <circle cx="0" cy="0" r="5.5" fill="#fbcfe8" stroke="#db2777" stroke-width="2" />
                <path d="M -4,6 L -10,22 L -2,18 L 4,20 L 2,6 Z" fill="#f472b6" />
              </g>
            ` : ''}
          </g>
        </g>

        <!-- ================================================================= -->
        <!-- 13. LAYER: EXPRESSIVE ANIME EYES & SWEET FACE                     -->
        <!-- ================================================================= -->
        <g id="layer-face" class="monster-layer layer-face">
          <g transform="translate(${headCX}, ${headCY}) scale(${headScale}) translate(-${headCX}, -${headCY})">
            <!-- Rosy Airbrush Cheek Blush -->
            <ellipse cx="152" cy="188" rx="14" ry="8.5" fill="${pal.blush}" opacity="0.45" filter="url(#${uid}_glow)" />
            <ellipse cx="248" cy="188" rx="14" ry="8.5" fill="${pal.blush}" opacity="0.45" filter="url(#${uid}_glow)" />

            <!-- Left Anime Eye -->
            <g id="eye-left">
              <ellipse cx="168" cy="164" rx="17" ry="21" fill="#030712" />
              <ellipse cx="168" cy="166" rx="15" ry="18.5" fill="url(#${uid}_eye_iris)" />
              <ellipse cx="168" cy="167" rx="9" ry="12" fill="#030712" />
              <ellipse cx="162" cy="157" rx="6.5" ry="8" fill="#ffffff" />
              <circle cx="174" cy="172" r="3.6" fill="#ffffff" />
              <path d="M 150,164 Q 166,146 186,166" stroke="#030712" stroke-width="3.4" stroke-linecap="round" fill="none" />
              ${isGirl ? `
                <path d="M 184,163 L 190,158" stroke="#030712" stroke-width="2.6" stroke-linecap="round" />
              ` : ''}
            </g>

            <!-- Right Anime Eye -->
            <g id="eye-right">
              <ellipse cx="232" cy="164" rx="17" ry="21" fill="#030712" />
              <ellipse cx="232" cy="166" rx="15" ry="18.5" fill="url(#${uid}_eye_iris)" />
              <ellipse cx="232" cy="167" rx="9" ry="12" fill="#030712" />
              <ellipse cx="226" cy="157" rx="6.5" ry="8" fill="#ffffff" />
              <circle cx="238" cy="172" r="3.6" fill="#ffffff" />
              <path d="M 214,166 Q 234,146 250,164" stroke="#030712" stroke-width="3.4" stroke-linecap="round" fill="none" />
              ${isGirl ? `
                <path d="M 216,163 L 210,158" stroke="#030712" stroke-width="2.6" stroke-linecap="round" />
              ` : ''}
            </g>

            <!-- Delicate Dark Button Nose -->
            <path d="M 195,184 Q 200,189 205,184 Q 200,181 195,184 Z" fill="#0f172a" />
            <circle cx="198" cy="183.5" r="1.3" fill="#ffffff" />

            <!-- Sweet Joyful :3 Cat Smile with Pink Tongue -->
            <path d="M 190,193 Q 195,202 200,196 Q 205,202 210,193" stroke="#0f172a" stroke-width="2.6" stroke-linecap="round" fill="none" />
            <path d="M 196,198 Q 200,207 204,198 Z" fill="#f43f5e" />
          </g>
        </g>

        <!-- ================================================================= -->
        <!-- 14. LAYER: COLLECTIBLE ACCESSORIES (Stages 3+ or Equipped)        -->
        <!-- ================================================================= -->
        ${((config.accessory && config.accessory !== 'none' && stage >= 3) || (stage === 6 && config.accessory !== 'none')) ? `
          <g id="layer-accessory" class="monster-layer layer-accessory" filter="url(#${uid}_deep_shadow)">
            <g transform="translate(${headCX}, ${headCY}) scale(${headScale}) translate(-${headCX}, -${headCY})">
              ${(config.accessory === 'glasses') ? `
                <!-- Scholar Wire-Rim Glasses -->
                <circle cx="168" cy="164" r="22" fill="none" stroke="#fbbf24" stroke-width="3" />
                <circle cx="232" cy="164" r="22" fill="none" stroke="#fbbf24" stroke-width="3" />
                <path d="M 190,164 L 210,164" stroke="#fbbf24" stroke-width="2.8" />
                <path d="M 154,152 L 164,142" stroke="#ffffff" stroke-width="2.2" opacity="0.6" stroke-linecap="round" />
                <path d="M 218,152 L 228,142" stroke="#ffffff" stroke-width="2.2" opacity="0.6" stroke-linecap="round" />
              ` : (config.accessory === 'bandana') ? `
                <!-- Scout Kerchief -->
                <path d="M 166,198 Q 200,212 234,198 L 207,242 L 200,248 L 193,242 Z" fill="#ef4444" stroke="#991b1b" stroke-width="2.2" />
              ` : (config.accessory === 'blue_bow') ? `
                <!-- Satin Ribbon Bow (Collar) -->
                <g transform="translate(200, 204)">
                  <path d="M 0,0 C -22,-16 -35,-4 -28,10 C -24,20 -8,6 0,0 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
                  <path d="M 0,0 C 22,-16 35,-4 28,10 C 24,20 8,6 0,0 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
                  <circle cx="0" cy="0" r="5" fill="#bae6fd" stroke="#0284c7" stroke-width="1.8" />
                </g>
              ` : (config.accessory === 'badge') ? `
                <!-- Star Guild Badge -->
                <g transform="translate(160, 245)">
                  <circle cx="0" cy="0" r="14" fill="#fbbf24" stroke="#b45309" stroke-width="2.4" />
                  <polygon points="0,-8 2.5,-2.5 8.5,-2.5 3.5,2 5.5,8 0,4.5 -5.5,8 -3.5,2 -8.5,-2.5 -2.5,-2.5" fill="#ffffff" />
                </g>
              ` : (config.accessory === 'wizard_hat') ? `
                <!-- Wizard Hat -->
                <ellipse cx="200" cy="112" rx="55" ry="16" fill="#312e81" stroke="#4338ca" stroke-width="2.2" />
                <path d="M 158,112 L 206,18 L 242,112 Z" fill="#3730a3" stroke="#4338ca" stroke-width="2.2" />
                <polygon points="206,-20 208,-15 213,-15 209,-12 211,-7 206,-10 201,-7 203,-12 199,-15 204,-15" fill="#fbbf24" transform="translate(0, 75)" />
              ` : `
                <!-- Monarch Crown (Perfect between the horns) -->
                <g id="accessory-crown">
                  <path d="M 174,112 L 168,65 L 186,86 L 200,48 L 214,86 L 232,65 L 226,112 Z" fill="#fbbf24" stroke="#b45309" stroke-width="2.5" />
                  <path d="M 180,102 Q 200,78 220,102" stroke="#991b1b" stroke-width="4.5" fill="none" opacity="0.85" />
                  <circle cx="200" cy="85" r="5" fill="#ef4444" stroke="#991b1b" stroke-width="1.5" />
                  <circle cx="184" cy="94" r="3.6" fill="#10b981" />
                  <circle cx="216" cy="94" r="3.6" fill="#10b981" />
                </g>
              `}
            </g>
          </g>
        ` : ''}
      </svg>
    `;
  }

  function renderMonsterArtwork(opts = {}) {
    return renderMonsterSVG(opts, opts);
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
