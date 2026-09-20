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
      shadowDark: '#0c4a6e',
      iris: '#0284c7',
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
      shadowDark: '#831843',
      iris: '#db2777',
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
      shadowDark: '#052e16',
      iris: '#16a34a',
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
      shadowDark: '#431407',
      iris: '#ea580c',
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
      shadowDark: '#3b0764',
      iris: '#9333ea',
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
      shadowDark: '#451a03',
      iris: '#ca8a04',
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
   * Comprehensive Shared SVG Defs (Volumetric Gradients & Filters)
   */
  function getSharedDefs(colorKey, palette) {
    return `
      <defs>
        <!-- 11 O'Clock Key Light Volumetric Plush Fur Radial Gradient -->
        <radialGradient id="plush-fur-${colorKey}" cx="36%" cy="28%" r="72%" fx="32%" fy="24%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
          <stop offset="18%" stop-color="${palette.primaryLight}" />
          <stop offset="55%" stop-color="${palette.primary}" />
          <stop offset="85%" stop-color="${palette.primaryDark}" />
          <stop offset="100%" stop-color="${palette.shadow}" />
        </radialGradient>

        <!-- 3D Egg Shell Gradient (Keylit) -->
        <radialGradient id="plush-egg-${colorKey}" cx="36%" cy="28%" r="70%" fx="32%" fy="22%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
          <stop offset="20%" stop-color="${palette.primaryLight}" />
          <stop offset="55%" stop-color="${palette.primary}" />
          <stop offset="85%" stop-color="${palette.primaryDark}" />
          <stop offset="100%" stop-color="${palette.shadowDark || palette.shadow}" />
        </radialGradient>

        <!-- Volumetric Snout & Muzzle Dome -->
        <radialGradient id="plush-snout-${colorKey}" cx="42%" cy="32%" r="65%" fx="38%" fy="28%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="40%" stop-color="${palette.belly}" />
          <stop offset="80%" stop-color="${palette.primaryLight}" />
          <stop offset="100%" stop-color="${palette.primaryDark}" stop-opacity="0.4" />
        </radialGradient>

        <!-- Volumetric Belly Patch Gradient -->
        <radialGradient id="plush-belly-${colorKey}" cx="40%" cy="30%" r="68%" fx="36%" fy="26%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="42%" stop-color="${palette.belly}" />
          <stop offset="85%" stop-color="${palette.primaryLight}" />
          <stop offset="100%" stop-color="${palette.primary}" stop-opacity="0.7" />
        </radialGradient>

        <!-- 3D Rear Ear Shading (Deep Occlusion) -->
        <radialGradient id="plush-rear-ear-${colorKey}" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stop-color="${palette.primary}" />
          <stop offset="60%" stop-color="${palette.primaryDark}" />
          <stop offset="100%" stop-color="${palette.shadowDark || palette.shadow}" />
        </radialGradient>

        <!-- 3D Front Ear Shading (Keylit Velvet) -->
        <radialGradient id="plush-front-ear-${colorKey}" cx="35%" cy="25%" r="75%">
          <stop offset="0%" stop-color="${palette.primaryLight}" />
          <stop offset="45%" stop-color="${palette.primary}" />
          <stop offset="85%" stop-color="${palette.primaryDark}" />
          <stop offset="100%" stop-color="${palette.shadow}" />
        </radialGradient>

        <!-- Inner Ear Cavity Soft Ambient Shade -->
        <radialGradient id="plush-inner-ear-${colorKey}" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#fce7f3" />
          <stop offset="65%" stop-color="#f472b6" />
          <stop offset="100%" stop-color="#9d174d" />
        </radialGradient>

        <!-- Living Glass Eye Iris Radial Gradient -->
        <radialGradient id="plush-eye-iris-${colorKey}" cx="48%" cy="62%" r="52%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4" />
          <stop offset="25%" stop-color="${palette.primary}" />
          <stop offset="65%" stop-color="${palette.primaryDark}" />
          <stop offset="100%" stop-color="#020617" />
        </radialGradient>

        <!-- Tiered Wooden Pedestal Top Surface Gradient -->
        <radialGradient id="pedestal-top" cx="42%" cy="38%" r="60%">
          <stop offset="0%" stop-color="#fef3c7" />
          <stop offset="50%" stop-color="#fde68a" />
          <stop offset="85%" stop-color="#d97706" />
          <stop offset="100%" stop-color="#92400e" />
        </radialGradient>

        <!-- Tiered Wooden Pedestal Side Bevel Cylinder -->
        <linearGradient id="pedestal-side" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#78350f" />
          <stop offset="25%" stop-color="#b45309" />
          <stop offset="55%" stop-color="#d97706" />
          <stop offset="85%" stop-color="#78350f" />
          <stop offset="100%" stop-color="#451a03" />
        </linearGradient>

        <!-- Sovereign Royal Crown 3D Gold Gradient -->
        <linearGradient id="plush-gold-crown" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="25%" stop-color="#fef08a" />
          <stop offset="55%" stop-color="#eab308" />
          <stop offset="85%" stop-color="#ca8a04" />
          <stop offset="100%" stop-color="#713f12" />
        </linearGradient>

        <!-- Crystal Horns 3D Shading -->
        <linearGradient id="plush-crystal-horn" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="20%" stop-color="#a5f3fc" />
          <stop offset="60%" stop-color="${palette.purple || '#c084fc'}" />
          <stop offset="100%" stop-color="#4c1d95" />
        </linearGradient>

        <!-- Celestial Wings 3D Volumetric Gradient -->
        <linearGradient id="plush-wing-celestial" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="35%" stop-color="#fde047" />
          <stop offset="70%" stop-color="#eab308" />
          <stop offset="100%" stop-color="${palette.primaryDark}" />
        </linearGradient>

        <!-- Filters for Ultra-Soft Ambient Occlusion & Shadows -->
        <filter id="plush-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3.5" stdDeviation="2.8" flood-color="#020617" flood-opacity="0.28" />
        </filter>

        <filter id="plush-contact-blur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" />
        </filter>

        <filter id="plush-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <!-- Backward-Compatible Secondary Gradients & Filters -->
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

        <linearGradient id="mg-gold-horn" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="50%" stop-color="#eab308" />
          <stop offset="100%" stop-color="#a16207" />
        </linearGradient>

        <linearGradient id="mg-nature-horn" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#86efac" />
          <stop offset="60%" stop-color="#22c55e" />
          <stop offset="100%" stop-color="#15803d" />
        </linearGradient>

        <linearGradient id="mg-ice-horn" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="40%" stop-color="#7dd3fc" />
          <stop offset="100%" stop-color="#0284c7" />
        </linearGradient>

        <linearGradient id="mg-flame-horn" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="45%" stop-color="#f97316" />
          <stop offset="100%" stop-color="#dc2626" />
        </linearGradient>

        <linearGradient id="mg-rainbow-aura" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f43f5e" />
          <stop offset="20%" stop-color="#f97316" />
          <stop offset="40%" stop-color="#eab308" />
          <stop offset="60%" stop-color="#10b981" />
          <stop offset="80%" stop-color="#06b6d4" />
          <stop offset="100%" stop-color="#8b5cf6" />
        </linearGradient>

        <linearGradient id="mg-galaxy-aura" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#c084fc" />
          <stop offset="50%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#4338ca" />
        </linearGradient>

        <filter id="mf-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="mf-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" flood-opacity="0.25" />
        </filter>
      </defs>
    `;
  }

  // --- PEDESTAL STAGE DAIS (Tiered Circular Platform) ---
  function renderPedestalDais() {
    return `
      <!-- Tiered Circular Wooden Pedestal Dais Stage -->
      <g class="monster-pedestal-stage">
        <!-- Lower Base Ambient Shadow Cast by Dais -->
        <ellipse cx="100" cy="174" rx="60" ry="11" fill="rgba(15,23,42,0.22)" filter="url(#plush-contact-blur)" />

        <!-- Pedestal Base Rim (Lower Tier Cylinder Bevel) -->
        <path d="M 44 165 C 44 175 156 175 156 165 L 156 170 C 156 180 44 180 44 170 Z" fill="url(#pedestal-side)" stroke="#451a03" stroke-width="1.2" />

        <!-- Pedestal Top Surface (Polished Bevel Rim) -->
        <ellipse cx="100" cy="165" rx="56" ry="11" fill="url(#pedestal-top)" stroke="#d97706" stroke-width="1.2" />
        <ellipse cx="100" cy="165" rx="54" ry="9.5" fill="none" stroke="#fef3c7" stroke-width="0.9" opacity="0.8" />
      </g>
    `;
  }

  // --- CONTACT SHADOW LAYER ---
  function renderContactShadow(stage) {
    if (stage === 'egg' || stage === 'cracking_egg') {
      return `
        <!-- Contact Shadow for Egg Base onto Dais Surface -->
        <g class="monster-contact-shadow-group">
          <ellipse cx="100" cy="162" rx="34" ry="8.5" fill="rgba(15,23,42,0.34)" filter="url(#plush-contact-blur)" />
        </g>
      `;
    }
    return `
      <!-- Contact Shadow of Monster Body & Paws onto Dais Surface -->
      <g class="monster-contact-shadow-group">
        <ellipse cx="100" cy="154" rx="34" ry="6.5" fill="rgba(15,23,42,0.38)" filter="url(#plush-contact-blur)" />
        <ellipse cx="80" cy="154" rx="14" ry="4.5" fill="rgba(15,23,42,0.28)" filter="url(#plush-contact-blur)" />
        <ellipse cx="120" cy="154" rx="14" ry="4.5" fill="rgba(15,23,42,0.28)" filter="url(#plush-contact-blur)" />
      </g>
    `;
  }

  /**
   * Modular Layered Viewport Renderer
   * Standardized 6-layer coordinate stack:
   * 1. layer-stage-pedestal
   * 2. layer-contact-shadow
   * 3. layer-rear-accessories (back horns, wings, tails, backpack, aura, rear ear)
   * 4. layer-base-body (torso, feet, belly patch, clothes, egg shell)
   * 5. layer-face (eyes, blush, snout dome, button nose, mouth)
   * 6. layer-fore-accessories (front horns, front ear, hats, eyewear, handheld gear)
   */
  function renderMonsterViewport(options = {}) {
    const stage = normalizeStageKey(options.stage);
    let colorKey = String(options.color || (options.equipped && options.equipped.body) || 'blue').toLowerCase().trim().replace(/^body-/, '');
    if (!MONSTER_PALETTES[colorKey]) colorKey = 'blue';
    const palette = MONSTER_PALETTES[colorKey] || MONSTER_PALETTES.blue;
    const equipped = Object.assign({}, options.equipped || {});
    const size = options.size || 200;
    const animated = options.animated !== false;

    const animClass = animated ? 'eaa-monster-animated' : '';
    const isAvatar = options.isAvatar || options.hideBackground || options.transparentBg || false;

    const defs = getSharedDefs(colorKey, palette);

    // Layer 1: Stage Pedestal Layer
    let bgLayer = '';
    if (!isAvatar) {
      try {
        bgLayer = renderBackgroundLayer(equipped.background, stage);
      } catch (e) {
        bgLayer = renderBackgroundLayer('bg-meadow', stage);
      }
    }
    const pedestalMarkup = renderPedestalDais();

    // Layer 2: Contact Shadow Layer
    const contactShadowMarkup = renderContactShadow(stage);

    // Layer 3: Rear Accessories Layer
    let rearAccessoriesMarkup = '';
    try {
      const auraLayer = renderAuraLayer(equipped.aura, stage, palette);
      const wingsLayer = renderWingsLayer(stage, equipped.wings, palette);
      const tailLayer = renderTailLayer(stage, equipped.tail, palette);
      const backpackLayer = renderBackpackLayer(stage, equipped.backpack);
      let rearUnderBody = '';
      if (stage !== 'egg' && stage !== 'cracking_egg') {
        const g = getStageGeometry(stage);
        rearUnderBody = renderUnderBodyAccessories(stage, palette, colorKey, equipped, 100, g);
      }
      rearAccessoriesMarkup = `${auraLayer}${wingsLayer}${tailLayer}${backpackLayer}${rearUnderBody}`.trim();
    } catch (e) {
      rearAccessoriesMarkup = '';
    }

    // Layer 4: Base Body Layer
    let baseBodyMarkup = '';
    try {
      if (stage === 'egg') {
        baseBodyMarkup = renderEggWhole(palette, colorKey);
      } else if (stage === 'cracking_egg') {
        baseBodyMarkup = renderEggCrackingShell(palette, colorKey);
      } else {
        const g = getStageGeometry(stage);
        const cX = 100;
        const cY = (g.topY + g.botY) / 2;
        const rx = g.bW;
        const ry = (g.botY - g.topY) / 2;
        const feetMarkup = renderGroundedFeet(palette, colorKey, cX, g);
        const torsoMarkup = renderChibiTorso(stage, palette, colorKey, cX, g, equipped);
        const clothingMarkup = renderClothingLayer(equipped.clothing, cX, cY, rx, ry, palette, stage);
        baseBodyMarkup = `${feetMarkup}${torsoMarkup}${clothingMarkup}`.trim();
      }
    } catch (e) {
      baseBodyMarkup = '';
    }

    // Layer 5: Face Layer
    let faceMarkup = '';
    try {
      if (stage === 'egg') {
        faceMarkup = '';
      } else if (stage === 'cracking_egg') {
        faceMarkup = renderEggCrackingFace(palette, colorKey);
      } else {
        const g = getStageGeometry(stage);
        faceMarkup = renderFaceElements(stage, palette, colorKey, equipped, 100, g);
      }
    } catch (e) {
      faceMarkup = '';
    }

    // Layer 6: Fore Accessories Layer
    let foreAccessoriesMarkup = '';
    try {
      if (stage !== 'egg' && stage !== 'cracking_egg') {
        const g = getStageGeometry(stage);
        const overBodyMarkup = renderOverBodyAccessories(stage, palette, colorKey, equipped, 100, g);
        const fgAccessories = renderForegroundAccessories(stage, equipped, palette);
        foreAccessoriesMarkup = `${overBodyMarkup}${fgAccessories}`.trim();
      }
    } catch (e) {
      foreAccessoriesMarkup = '';
    }

    function wrapLayerSVG(content, layerClass) {
      if (!content || !content.trim()) {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%" class="${layerClass}"></svg>`;
      }
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%" class="${layerClass}">
          ${defs}
          ${content}
        </svg>
      `.trim();
    }

    return `
      <div class="monster-stage-viewport ${animClass}" style="--stage-size:${size}px; width:${size}px; height:${size}px;" data-stage="${stage}" data-color="${colorKey}">
        <div class="layer layer-stage-pedestal">${wrapLayerSVG(bgLayer + pedestalMarkup, 'layer-svg-stage-pedestal')}</div>
        <div class="layer layer-contact-shadow">${wrapLayerSVG(contactShadowMarkup, 'layer-svg-contact-shadow')}</div>
        <div class="layer layer-rear-accessories">${wrapLayerSVG(rearAccessoriesMarkup, 'layer-svg-rear-accessories')}</div>
        <div class="layer layer-base-body">${wrapLayerSVG(baseBodyMarkup, 'layer-svg-base-body')}</div>
        <div class="layer layer-face">${wrapLayerSVG(faceMarkup, 'layer-svg-face')}</div>
        <div class="layer layer-fore-accessories">${wrapLayerSVG(foreAccessoriesMarkup, 'layer-svg-fore-accessories')}</div>
      </div>
    `.trim();
  }

  /**
   * Monolithic SVG Single-element Renderer (rawSvg fallback)
   */
  function renderMonsterSingleSVG(options = {}) {
    const stage = normalizeStageKey(options.stage);
    let colorKey = String(options.color || (options.equipped && options.equipped.body) || 'blue').toLowerCase().trim().replace(/^body-/, '');
    if (!MONSTER_PALETTES[colorKey]) colorKey = 'blue';
    const palette = MONSTER_PALETTES[colorKey] || MONSTER_PALETTES.blue;
    const equipped = Object.assign({}, options.equipped || {});
    const size = options.size || 200;
    const animated = options.animated !== false;

    const animClass = animated ? 'eaa-monster-animated' : '';
    const isAvatar = options.isAvatar || options.hideBackground || options.transparentBg || false;

    const defs = getSharedDefs(colorKey, palette);

    let bgLayer = '';
    if (!isAvatar) {
      try {
        bgLayer = renderBackgroundLayer(equipped.background, stage);
      } catch (e) {
        bgLayer = renderBackgroundLayer('bg-meadow', stage);
      }
    }

    const pedestalMarkup = renderPedestalDais();
    const contactShadowMarkup = renderContactShadow(stage);

    let auraLayer = '';
    try { auraLayer = renderAuraLayer(equipped.aura, stage, palette); } catch (e) { auraLayer = ''; }

    let wingsLayer = '';
    try { wingsLayer = renderWingsLayer(stage, equipped.wings, palette); } catch (e) { wingsLayer = ''; }

    let tailLayer = '';
    try { tailLayer = renderTailLayer(stage, equipped.tail, palette); } catch (e) { tailLayer = ''; }

    let backpackLayer = '';
    try { backpackLayer = renderBackpackLayer(stage, equipped.backpack); } catch (e) { backpackLayer = ''; }

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
        ${pedestalMarkup}
        ${contactShadowMarkup}
        ${auraLayer}
        ${wingsLayer}
        ${tailLayer}
        ${backpackLayer}
        ${mainEntityLayer}
        ${fgAccessoryLayer}
      </svg>
    `.trim();
  }

  /**
   * Static Asset Image Pipeline: Monster Viewport
   * Stacks real static PNG image elements with CSS
   */
  function renderMonsterImageViewport(options = {}) {
    const stage = normalizeStageKey(options.stage);
    let colorKey = String(options.color || (options.equipped && options.equipped.body) || 'blue').toLowerCase().trim().replace(/^body-/, '');
    if (!MONSTER_PALETTES[colorKey]) colorKey = 'blue';
    const equipped = Object.assign({}, options.equipped || {});
    const size = options.size || 200;
    const animated = options.animated !== false;
    const animClass = animated ? 'eaa-monster-animated' : '';

    // 1. Stage pedestal image
    const stageSrc = 'assets/monsters/stages/wooden_pedestal.png';

    // 2. Body image
    let bodySrc = `assets/monsters/bodies/${colorKey}_chibi.png`;
    if (stage === 'egg') {
      bodySrc = 'assets/monsters/bodies/mystery_egg.png';
    } else if (stage === 'cracking_egg') {
      bodySrc = 'assets/monsters/bodies/cracking_egg.png';
    }

    // 3. Horns image
    let hornSrc = 'assets/monsters/horns/none.png';
    if (stage !== 'egg' && stage !== 'cracking_egg') {
      let hornId = equipped.horns;
      if (!hornId || hornId === 'default') {
        if (stage === 'ultimate' || stage === 'advanced') hornId = 'horns-crystal';
        else if (stage === 'adventurer' || stage === 'growing') hornId = 'horns-small';
        else hornId = 'none';
      }

      if (hornId === 'horns-small' || hornId === 'horns-nub' || hornId === 'sprout_nubs') {
        hornSrc = 'assets/monsters/horns/sprout_nubs.png';
      } else if (hornId === 'horns-curved' || hornId === 'curved_horns') {
        hornSrc = 'assets/monsters/horns/curved_horns.png';
      } else if (hornId === 'horns-crystal' || hornId === 'crystal_horns' || hornId === 'horns-ice') {
        hornSrc = 'assets/monsters/horns/crystal_horns.png';
      } else if (hornId === 'horns-gold' || hornId === 'gold_horns' || hornId === 'horns-flame' || hornId === 'horns-nature') {
        hornSrc = 'assets/monsters/horns/gold_horns.png';
      } else {
        hornSrc = 'assets/monsters/horns/none.png';
      }
    }

    // 4. Face/Eyes image
    let faceSrc = 'assets/monsters/eyes/default_eyes.png';
    if (stage === 'egg' || stage === 'cracking_egg') {
      faceSrc = 'assets/monsters/horns/none.png'; // No separate eyes on egg shell
    } else {
      let eyeId = equipped.eyes || 'default';
      if (eyeId === 'eyes-sparkle' || eyeId === 'sparkle_eyes') {
        faceSrc = 'assets/monsters/eyes/sparkle_eyes.png';
      } else if (eyeId === 'eyes-happy' || eyeId === 'happy_eyes') {
        faceSrc = 'assets/monsters/eyes/happy_eyes.png';
      } else if (eyeId === 'eyes-wink' || eyeId === 'wink_eyes') {
        faceSrc = 'assets/monsters/eyes/wink_eyes.png';
      } else if (eyeId === 'eyes-curious' || eyeId === 'curious_eyes') {
        faceSrc = 'assets/monsters/eyes/curious_eyes.png';
      } else {
        faceSrc = 'assets/monsters/eyes/default_eyes.png';
      }
    }

    return `
      <div class="monster-viewport ${animClass}" style="--stage-size:${size}px; width:${size}px; height:${size}px;" data-stage="${stage}" data-color="${colorKey}">
        <img class="monster-layer stage" src="${stageSrc}" alt="Stage Pedestal" />
        <img class="monster-layer body" src="${bodySrc}" alt="Monster Body" />
        <img class="monster-layer horns" src="${hornSrc}" alt="Monster Horns" />
        <img class="monster-layer face" src="${faceSrc}" alt="Monster Face" />
      </div>
    `.trim();
  }

  /**
   * Main Render Entry Point: Defaults to Static Asset Image Viewport
   */
  function renderMonsterSVG(options = {}) {
    if (options && options.rawSvg === true) {
      return renderMonsterSingleSVG(options);
    }
    return renderMonsterImageViewport(options);
  }

  // --- BACKGROUND LAYER ---
  function renderBackgroundLayer(bgId, stage) {
    if (!bgId || bgId === 'none') {
      return `<ellipse cx="100" cy="180" rx="55" ry="12" fill="rgba(15, 23, 42, 0.14)" />`;
    }

    if (bgId === 'bg-meadow') {
      return `
        <!-- Explorer Camp -->
        <rect x="0" y="0" width="200" height="200" rx="16" fill="#f0fdf4" />
        <circle cx="100" cy="195" r="72" fill="#bbf7d0" opacity="0.7" />
        <ellipse cx="100" cy="180" rx="60" ry="12" fill="rgba(22, 101, 52, 0.18)" />
        <circle cx="32" cy="30" r="13" fill="#fef08a" opacity="0.85" />
        <polygon points="152,175 168,145 184,175" fill="#ca8a04" opacity="0.75" />
        <polygon points="160,175 168,155 176,175" fill="#78350f" opacity="0.8" />
      `;
    }

    if (bgId === 'bg-castle') {
      return `
        <!-- Academy Castle -->
        <rect x="0" y="0" width="200" height="200" rx="16" fill="#fef3c7" />
        <rect x="22" y="95" width="28" height="85" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1.5" />
        <polygon points="18,95 36,65 54,95" fill="#ef4444" />
        <line x1="36" y1="65" x2="36" y2="52" stroke="#475569" stroke-width="1.5" />
        <polygon points="36,52 48,56 36,60" fill="#facc15" />
        <rect x="150" y="95" width="28" height="85" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1.5" />
        <polygon points="146,95 164,65 182,95" fill="#ef4444" />
        <line x1="164" y1="65" x2="164" y2="52" stroke="#475569" stroke-width="1.5" />
        <polygon points="164,52 176,56 164,60" fill="#facc15" />
        <rect x="50" y="125" width="100" height="55" fill="#cbd5e1" opacity="0.5" />
        <ellipse cx="100" cy="180" rx="62" ry="12" fill="rgba(120, 53, 15, 0.16)" />
      `;
    }

    if (bgId === 'bg-forest') {
      return `
        <!-- Enchanted Forest -->
        <rect x="0" y="0" width="200" height="200" rx="16" fill="#064e3b" />
        <circle cx="100" cy="195" r="70" fill="#047857" opacity="0.6" />
        <ellipse cx="100" cy="180" rx="60" ry="12" fill="rgba(2, 44, 34, 0.35)" />
        <polygon points="25,175 40,85 55,175" fill="#065f46" opacity="0.85" />
        <polygon points="145,175 165,95 185,175" fill="#065f46" opacity="0.85" />
        <!-- Firefly glow dots -->
        <circle cx="45" cy="65" r="2.5" fill="#86efac" opacity="0.85" filter="url(#mf-glow)" />
        <circle cx="155" cy="60" r="3" fill="#fef08a" opacity="0.85" filter="url(#mf-glow)" />
        <circle cx="170" cy="120" r="2" fill="#86efac" opacity="0.7" filter="url(#mf-glow)" />
        <circle cx="30" cy="125" r="2" fill="#fef08a" opacity="0.7" filter="url(#mf-glow)" />
      `;
    }

    if (bgId === 'bg-volcano') {
      return `
        <!-- Volcano Island -->
        <rect x="0" y="0" width="200" height="200" rx="16" fill="#451a03" />
        <polygon points="30,180 100,65 170,180" fill="#78350f" opacity="0.9" />
        <polygon points="85,65 100,50 115,65" fill="#f97316" filter="url(#mf-glow)" />
        <ellipse cx="100" cy="50" rx="8" ry="4" fill="#fef08a" filter="url(#mf-glow)" />
        <circle cx="85" cy="35" r="5" fill="#9a3412" opacity="0.4" />
        <circle cx="112" cy="30" r="7" fill="#9a3412" opacity="0.4" />
        <ellipse cx="100" cy="180" rx="60" ry="12" fill="rgba(249, 115, 22, 0.25)" />
      `;
    }

    if (bgId === 'bg-beach') {
      return `
        <!-- Adventure Beach -->
        <rect x="0" y="0" width="200" height="200" rx="16" fill="#e0f2fe" />
        <path d="M 0 115 Q 100 100 200 115 L 200 160 Q 100 150 0 160 Z" fill="#38bdf8" opacity="0.75" />
        <rect x="0" y="155" width="200" height="45" fill="#fde68a" />
        <ellipse cx="100" cy="180" rx="60" ry="12" fill="rgba(180, 83, 9, 0.2)" />
        <circle cx="165" cy="35" r="14" fill="#fbbf24" opacity="0.9" />
        <!-- Palm branch on left -->
        <path d="M 0 40 Q 40 50 50 85" stroke="#15803d" stroke-width="4" fill="none" />
        <path d="M 25 50 Q 55 52 45 68" stroke="#16a34a" stroke-width="2.5" fill="none" />
      `;
    }

    if (bgId === 'bg-moonlit') {
      return `
        <!-- Moonlit Kingdom -->
        <rect x="0" y="0" width="200" height="200" rx="16" fill="#0f172a" />
        <!-- Radiant Crescent Moon -->
        <path d="M 160 30 A 16 16 0 0 0 144 58 A 18 18 0 1 1 160 30 Z" fill="#fef08a" filter="url(#mf-glow)" />
        <!-- Stars -->
        <circle cx="35" cy="40" r="1.5" fill="#ffffff" opacity="0.9" />
        <circle cx="60" cy="25" r="1.2" fill="#93c5fd" opacity="0.8" />
        <circle cx="100" cy="45" r="1.8" fill="#ffffff" opacity="0.9" />
        <circle cx="25" cy="90" r="1.5" fill="#ffffff" opacity="0.75" />
        <circle cx="175" cy="100" r="1.3" fill="#ffffff" opacity="0.8" />
        <ellipse cx="100" cy="180" rx="62" ry="12" fill="rgba(56, 189, 248, 0.2)" />
      `;
    }

    if (bgId === 'bg-winter') {
      return `
        <!-- Winter Wonderland -->
        <rect x="0" y="0" width="200" height="200" rx="16" fill="#e0f2fe" />
        <path d="M -10 150 Q 50 130 110 155 Q 160 140 210 160 L 210 200 L -10 200 Z" fill="#ffffff" />
        <!-- Snowy Pines -->
        <polygon points="20,155 32,105 44,155" fill="#0284c7" opacity="0.7" />
        <polygon points="160,155 174,95 188,155" fill="#0284c7" opacity="0.7" />
        <!-- Snowflakes -->
        <circle cx="35" cy="40" r="2.5" fill="#ffffff" opacity="0.85" />
        <circle cx="95" cy="30" r="2" fill="#ffffff" opacity="0.8" />
        <circle cx="150" cy="50" r="2.5" fill="#ffffff" opacity="0.85" />
        <circle cx="70" cy="80" r="1.8" fill="#ffffff" opacity="0.75" />
        <ellipse cx="100" cy="180" rx="60" ry="12" fill="rgba(2, 132, 199, 0.2)" />
      `;
    }

    if (bgId === 'bg-cosmos') {
      return `
        <!-- Space World -->
        <rect x="0" y="0" width="200" height="200" rx="16" fill="#090d16" />
        <circle cx="35" cy="35" r="1.5" fill="#ffffff" opacity="0.9" />
        <circle cx="160" cy="40" r="1.2" fill="#ffffff" opacity="0.8" />
        <circle cx="175" cy="120" r="1.5" fill="#38bdf8" opacity="0.9" />
        <circle cx="25" cy="130" r="1" fill="#f472b6" opacity="0.8" />
        <circle cx="100" cy="25" r="2" fill="#facc15" opacity="0.9" />
        <!-- Ringed Planet -->
        <ellipse cx="40" cy="65" rx="14" ry="14" fill="#8b5cf6" opacity="0.75" />
        <ellipse cx="40" cy="65" rx="22" ry="5" fill="none" stroke="#e9d5ff" stroke-width="2" transform="rotate(-20, 40, 65)" opacity="0.75" />
        <ellipse cx="100" cy="180" rx="60" ry="12" fill="rgba(56, 189, 248, 0.25)" />
      `;
    }

    if (bgId === 'bg-desert') {
      return `
        <!-- Desert Adventure -->
        <rect x="0" y="0" width="200" height="200" rx="16" fill="#fef08a" />
        <circle cx="160" cy="35" r="15" fill="#f97316" opacity="0.9" />
        <path d="M 0 145 Q 60 120 120 150 Q 170 135 200 155 L 200 200 L 0 200 Z" fill="#d97706" opacity="0.85" />
        <path d="M 0 165 Q 80 145 150 170 Q 180 160 200 170 L 200 200 L 0 200 Z" fill="#b45309" opacity="0.8" />
        <ellipse cx="100" cy="180" rx="60" ry="12" fill="rgba(120, 53, 15, 0.22)" />
      `;
    }

    if (bgId === 'bg-underwater') {
      return `
        <!-- Underwater Kingdom -->
        <rect x="0" y="0" width="200" height="200" rx="16" fill="#0e7490" />
        <!-- Shimmering sun rays from top -->
        <polygon points="40,0 70,0 110,120 70,120" fill="#38bdf8" opacity="0.15" />
        <polygon points="120,0 150,0 170,120 135,120" fill="#38bdf8" opacity="0.15" />
        <!-- Bubbles -->
        <circle cx="35" cy="70" r="3" fill="none" stroke="#bae6fd" stroke-width="1.2" opacity="0.7" />
        <circle cx="45" cy="45" r="4.5" fill="none" stroke="#bae6fd" stroke-width="1.2" opacity="0.75" />
        <circle cx="160" cy="80" r="3.5" fill="none" stroke="#bae6fd" stroke-width="1.2" opacity="0.7" />
        <!-- Coral on sea floor -->
        <path d="M 15 180 Q 25 140 35 180" stroke="#f43f5e" stroke-width="4" fill="none" />
        <path d="M 170 180 Q 180 145 190 180" stroke="#f43f5e" stroke-width="4" fill="none" />
        <ellipse cx="100" cy="180" rx="60" ry="12" fill="rgba(8, 51, 68, 0.35)" />
      `;
    }

    if (bgId === 'bg-rainbow') {
      return `
        <!-- Rainbow Valley -->
        <rect x="0" y="0" width="200" height="200" rx="16" fill="#e0f2fe" />
        <!-- Rainbow Arc -->
        <g opacity="0.8" fill="none" stroke-width="3">
          <path d="M 10 140 A 100 80 0 0 1 190 140" stroke="#f43f5e" />
          <path d="M 14 140 A 96 76 0 0 1 186 140" stroke="#f97316" />
          <path d="M 18 140 A 92 72 0 0 1 182 140" stroke="#eab308" />
          <path d="M 22 140 A 88 68 0 0 1 178 140" stroke="#10b981" />
          <path d="M 26 140 A 84 64 0 0 1 174 140" stroke="#06b6d4" />
          <path d="M 30 140 A 80 60 0 0 1 170 140" stroke="#8b5cf6" />
        </g>
        <path d="M 0 150 Q 100 135 200 150 L 200 200 L 0 200 Z" fill="#86efac" />
        <ellipse cx="100" cy="180" rx="60" ry="12" fill="rgba(21, 128, 61, 0.18)" />
      `;
    }

    if (bgId === 'bg-cloud') {
      return `
        <!-- Cloud Kingdom -->
        <rect x="0" y="0" width="200" height="200" rx="16" fill="#fdf4ff" />
        <circle cx="100" cy="40" r="18" fill="#fef08a" opacity="0.8" filter="url(#mf-glow)" />
        <!-- Fluffy Clouds -->
        <g fill="#fce7f3" opacity="0.85">
          <circle cx="35" cy="160" r="28" />
          <circle cx="75" cy="155" r="32" />
          <circle cx="125" cy="155" r="32" />
          <circle cx="165" cy="160" r="28" />
        </g>
        <ellipse cx="100" cy="180" rx="60" ry="12" fill="rgba(190, 24, 93, 0.12)" />
      `;
    }

    if (bgId === 'bg-crystal') {
      return `
        <!-- Crystal Cavern -->
        <rect x="0" y="0" width="200" height="200" rx="16" fill="#082f49" />
        <polygon points="20,180 35,110 50,180" fill="#38bdf8" opacity="0.4" />
        <polygon points="150,180 168,95 186,180" fill="#06b6d4" opacity="0.5" />
        <polygon points="80,180 90,130 100,180" fill="#c084fc" opacity="0.35" />
        <ellipse cx="100" cy="180" rx="62" ry="14" fill="rgba(6, 182, 212, 0.3)" />
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
        <g opacity="0.8" class="monster-aura-anim">
          <circle cx="100" cy="115" r="70" fill="url(#mg-aura-glow)" filter="url(#mf-glow)" />
          <polygon points="40,75 42,80 47,80 43,83 45,88 40,85 35,88 37,83 33,80 38,80" fill="#facc15" filter="url(#mf-glow)" />
          <polygon points="160,65 162,70 167,70 163,73 165,78 160,75 155,78 157,73 153,70 158,70" fill="#facc15" filter="url(#mf-glow)" />
          <polygon points="35,130 37,134 41,134 38,137 39,141 35,139 31,141 32,137 29,134 33,134" fill="#38bdf8" />
          <polygon points="165,135 167,139 171,139 168,142 169,146 165,144 161,146 162,142 159,139 163,139" fill="#f472b6" />
        </g>
      `;
    }

    if (auraId === 'aura-flame') {
      return `
        <!-- Blazing Flame Aura -->
        <g opacity="0.75" filter="url(#mf-glow)" class="monster-aura-anim">
          <path d="M 45 160 Q 55 80 100 50 Q 145 80 155 160 Z" fill="#fb923c" />
          <path d="M 60 160 Q 75 95 100 70 Q 125 95 140 160 Z" fill="#facc15" />
          <path d="M 80 160 Q 90 115 100 95 Q 110 115 120 160 Z" fill="#ffffff" />
        </g>
      `;
    }

    if (auraId === 'aura-ice') {
      return `
        <!-- Frost & Ice Aura -->
        <g opacity="0.8" filter="url(#mf-glow)" class="monster-aura-anim">
          <circle cx="100" cy="110" r="76" fill="none" stroke="#7dd3fc" stroke-width="2" stroke-dasharray="6 8" />
          <!-- Ice crystals -->
          <polygon points="35,70 45,75 40,85 30,80" fill="#38bdf8" />
          <polygon points="165,70 175,80 170,85 160,75" fill="#38bdf8" />
          <polygon points="40,135 48,140 42,148 34,142" fill="#7dd3fc" />
          <polygon points="160,135 168,142 162,148 154,140" fill="#7dd3fc" />
          <circle cx="100" cy="35" r="4" fill="#ffffff" />
        </g>
      `;
    }

    if (auraId === 'aura-rainbow') {
      return `
        <!-- Radiant Rainbow Aura -->
        <g opacity="0.85" filter="url(#mf-glow)" class="monster-aura-anim">
          <circle cx="100" cy="110" r="78" fill="none" stroke="url(#mg-rainbow-aura)" stroke-width="5" opacity="0.85" />
          <circle cx="100" cy="110" r="86" fill="none" stroke="url(#mg-rainbow-aura)" stroke-width="2.5" stroke-dasharray="10 8" opacity="0.75" />
          <polygon points="35,65 37,70 42,70 38,73 40,78 35,75 30,78 32,73 28,70 33,70" fill="#facc15" />
          <polygon points="165,65 167,70 172,70 168,73 170,78 165,75 160,78 162,73 158,70 163,70" fill="#38bdf8" />
        </g>
      `;
    }

    if (auraId === 'aura-cosmic' || auraId === 'aura-galaxy') {
      return `
        <!-- Galaxy Cosmic Aura -->
        <g opacity="0.85" filter="url(#mf-glow)" class="monster-aura-anim">
          <ellipse cx="100" cy="110" rx="82" ry="76" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="8 6" />
          <ellipse cx="100" cy="110" rx="88" ry="84" fill="none" stroke="#c084fc" stroke-width="1.8" stroke-dasharray="14 10" />
          <polygon points="100,20 103,28 111,28 105,33 107,41 100,36 93,41 95,33 89,28 97,28" fill="#facc15" />
          <polygon points="30,70 32,75 37,75 33,78 35,83 30,80 25,83 27,78 23,75 28,75" fill="#38bdf8" />
          <polygon points="170,75 172,80 177,80 173,83 175,88 170,85 165,88 167,83 163,80 168,80" fill="#f472b6" />
        </g>
      `;
    }

    if (auraId === 'aura-lightning') {
      return `
        <!-- Electric Lightning Aura -->
        <g opacity="0.85" filter="url(#mf-glow)" class="monster-aura-anim">
          <path d="M 35 60 L 45 90 L 38 95 L 50 135" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" fill="none" />
          <path d="M 165 55 L 155 85 L 162 90 L 150 130" stroke="#facc15" stroke-width="3" stroke-linecap="round" fill="none" />
          <circle cx="45" cy="90" r="3" fill="#ffffff" />
          <circle cx="155" cy="85" r="3" fill="#ffffff" />
          <circle cx="100" cy="25" r="3.5" fill="#38bdf8" />
        </g>
      `;
    }

    if (auraId === 'aura-blossom') {
      return `
        <!-- Blossom Petal Aura -->
        <g opacity="0.85" filter="url(#mf-glow)" class="monster-aura-anim">
          <!-- Swirling cherry blossom petals -->
          <ellipse cx="38" cy="65" rx="7" ry="4" transform="rotate(25, 38, 65)" fill="#f472b6" />
          <ellipse cx="160" cy="60" rx="7" ry="4" transform="rotate(-30, 160, 60)" fill="#f472b6" />
          <ellipse cx="32" cy="125" rx="6" ry="3.5" transform="rotate(-15, 32, 125)" fill="#fbcfe8" />
          <ellipse cx="168" cy="130" rx="6" ry="3.5" transform="rotate(40, 168, 130)" fill="#fbcfe8" />
          <ellipse cx="100" cy="28" rx="8" ry="4.5" transform="rotate(10, 100, 28)" fill="#ec4899" />
        </g>
      `;
    }

    if (auraId === 'aura-star') {
      return `
        <!-- Dancing Star Aura -->
        <g opacity="0.85" filter="url(#mf-glow)" class="monster-aura-anim">
          <polygon points="100,22 103,29 110,29 104,33 106,40 100,36 94,40 96,33 90,29 97,29" fill="#facc15" />
          <polygon points="32,70 34,75 39,75 35,78 37,83 32,80 27,83 29,78 25,75 30,75" fill="#facc15" />
          <polygon points="168,70 170,75 175,75 171,78 173,83 168,80 163,83 165,78 161,75 166,75" fill="#facc15" />
          <polygon points="38,135 40,139 44,139 41,142 42,146 38,144 34,146 35,142 32,139 36,139" fill="#fde047" />
          <polygon points="162,135 164,139 168,139 165,142 166,146 162,144 158,146 159,142 156,139 160,139" fill="#fde047" />
        </g>
      `;
    }

    if (auraId === 'aura-dragon') {
      return `
        <!-- Dragon Glow Aura -->
        <g opacity="0.85" filter="url(#mf-glow)" class="monster-aura-anim">
          <path d="M 40 160 Q 30 75 90 40 Q 75 80 85 160 Z" fill="#ef4444" opacity="0.75" />
          <path d="M 160 160 Q 170 75 110 40 Q 125 80 115 160 Z" fill="#ef4444" opacity="0.75" />
          <path d="M 55 160 Q 70 85 100 60 Q 130 85 145 160 Z" fill="#f59e0b" opacity="0.85" />
          <circle cx="100" cy="45" r="5" fill="#fef08a" />
        </g>
      `;
    }

    if (auraId === 'aura-royal') {
      return `
        <!-- Sovereign Royal Glow Aura -->
        <g opacity="0.85" filter="url(#mf-glow)" class="monster-aura-anim">
          <circle cx="100" cy="110" r="82" fill="none" stroke="url(#mg-gold-horn)" stroke-width="3.5" />
          <!-- Radiating golden light beams -->
          <line x1="100" y1="18" x2="100" y2="28" stroke="#facc15" stroke-width="3" stroke-linecap="round" />
          <line x1="32" y1="65" x2="40" y2="72" stroke="#facc15" stroke-width="3" stroke-linecap="round" />
          <line x1="168" y1="65" x2="160" y2="72" stroke="#facc15" stroke-width="3" stroke-linecap="round" />
          <line x1="28" y1="125" x2="38" y2="125" stroke="#facc15" stroke-width="3" stroke-linecap="round" />
          <line x1="172" y1="125" x2="162" y2="125" stroke="#facc15" stroke-width="3" stroke-linecap="round" />
        </g>
      `;
    }

    return '';
  }

  // --- EGG 1: MYSTERY EGG ---
  function renderEggWhole(palette, colorKey) {
    return `
      <!-- Level 1: Mystery Egg -->
      <g filter="url(#plush-shadow)" class="monster-egg-whole">
        <!-- Egg Shell Base (Volumetric 11 O'Clock Keylit Shading) -->
        <path d="M 100 42 C 64 42 54 112 58 146 C 62 162 78 168 100 168 C 122 168 138 162 142 146 C 146 112 136 42 100 42 Z"
              fill="url(#plush-egg-${colorKey})" stroke="${palette.shadowDark || palette.shadow}" stroke-width="3.2" stroke-linejoin="round" />

        <!-- Soft Dimensional Speckles -->
        <circle cx="76" cy="92" r="6.5" fill="${palette.primaryLight}" opacity="0.8" />
        <circle cx="124" cy="84" r="8" fill="#e9d5ff" opacity="0.8" />
        <circle cx="94" cy="144" r="9" fill="${palette.primaryLight}" opacity="0.8" />
        <circle cx="68" cy="134" r="5.5" fill="#e9d5ff" opacity="0.75" />
        <circle cx="132" cy="132" r="7" fill="${palette.primaryLight}" opacity="0.8" />
        <circle cx="86" cy="68" r="4.5" fill="${palette.purple || '#c084fc'}" opacity="0.45" />

        <!-- 11 O'Clock Glossy Specular Sheen Arc -->
        <path d="M 74 54 C 66 68 64 88 66 110" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" fill="none" opacity="0.85" />
        <circle cx="80" cy="50" r="2.5" fill="#ffffff" opacity="0.9" />
      </g>
    `;
  }

  // --- EGG 2: CRACKING EGG SHELL (Base Body Layer) ---
  function renderEggCrackingShell(palette, colorKey) {
    return `
      <!-- Level 2: Cracking Egg Shell -->
      <g filter="url(#plush-shadow)" class="monster-egg-cracking">
        <!-- Egg Shell Base (Volumetric 11 O'Clock Keylit Shading) -->
        <path d="M 100 42 C 64 42 54 112 58 146 C 62 162 78 168 100 168 C 122 168 138 162 142 146 C 146 112 136 42 100 42 Z"
              fill="url(#plush-egg-${colorKey})" stroke="${palette.shadowDark || palette.shadow}" stroke-width="3.2" stroke-linejoin="round" />

        <!-- Glowing Fissure Seams -->
        <path d="M 100 42 L 95 62 L 105 76 L 96 95 L 105 106" fill="none" stroke="#fef08a" stroke-width="2.8" filter="url(#plush-glow)" />
        <path d="M 100 42 L 95 62 L 105 76 L 96 95 L 105 106" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
        <path d="M 84 126 L 74 138 L 82 148 L 76 158 L 84 167" fill="none" stroke="#fef08a" stroke-width="2.4" filter="url(#plush-glow)" />
        <path d="M 84 126 L 74 138 L 82 148 L 76 158 L 84 167" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" />
        <path d="M 124 116 L 136 126 L 130 140 L 140 152" fill="none" stroke="#fef08a" stroke-width="2.4" filter="url(#plush-glow)" />
        <path d="M 124 116 L 136 126 L 130 140 L 140 152" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" />

        <!-- Crack Opening Cavity -->
        <polygon points="76,108 92,100 100,107 114,99 126,110 118,126 102,122 88,128 78,122" fill="#020617" />

        <!-- 11 O'Clock Specular Gloss -->
        <path d="M 74 54 C 66 68 64 88 66 110" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" fill="none" opacity="0.85" />
      </g>
    `;
  }

  // --- EGG 2: CRACKING EGG PEEKING FACE (Face Layer) ---
  function renderEggCrackingFace(palette, colorKey) {
    return `
      <!-- Peeking Living Eyes & Blush inside Crack Opening -->
      <g class="monster-egg-peeking-face">
        <!-- Soft Velvet Cheek Blush -->
        <ellipse cx="84" cy="119" rx="6.5" ry="4" fill="${palette.cheek}" opacity="0.88" />
        <ellipse cx="116" cy="119" rx="6.5" ry="4" fill="${palette.cheek}" opacity="0.88" />

        <!-- Living Glass Eyes Peeking Out Through Crack! -->
        <g transform="rotate(-4, 91, 114)">
          <ellipse cx="91" cy="114" rx="8.0" ry="11.0" fill="#020617" stroke="${palette.primary}" stroke-width="1.2" />
          <ellipse cx="91" cy="116" rx="7.0" ry="8.6" fill="url(#plush-eye-iris-${colorKey})" />
          <circle cx="88.5" cy="110.8" r="3.6" fill="#ffffff" />
          <circle cx="93.5" cy="117.2" r="1.8" fill="#ffffff" opacity="0.95" />
        </g>
        <g transform="rotate(4, 109, 114)">
          <ellipse cx="109" cy="114" rx="8.0" ry="11.0" fill="#020617" stroke="${palette.primary}" stroke-width="1.2" />
          <ellipse cx="109" cy="116" rx="7.0" ry="8.6" fill="url(#plush-eye-iris-${colorKey})" />
          <circle cx="106.5" cy="110.8" r="3.6" fill="#ffffff" />
          <circle cx="111.5" cy="117.2" r="1.8" fill="#ffffff" opacity="0.95" />
        </g>
      </g>
    `;
  }

  function renderEggCracking(palette, colorKey) {
    return renderEggCrackingShell(palette, colorKey) + renderEggCrackingFace(palette, colorKey);
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

    if (effectiveWings === 'wings-fairy') {
      return `
        <!-- Fairy Wings -->
        <g class="monster-wings-layer wings-fairy" filter="url(#mf-glow)" opacity="0.85">
          <ellipse cx="50" cy="85" rx="20" ry="34" transform="rotate(-35, 50, 85)" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5" />
          <ellipse cx="56" cy="115" rx="14" ry="22" transform="rotate(-20, 56, 115)" fill="#a7f3d0" stroke="#16a34a" stroke-width="1.5" />
          <ellipse cx="150" cy="85" rx="20" ry="34" transform="rotate(35, 150, 85)" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5" />
          <ellipse cx="144" cy="115" rx="14" ry="22" transform="rotate(20, 144, 115)" fill="#a7f3d0" stroke="#16a34a" stroke-width="1.5" />
        </g>
      `;
    }

    if (effectiveWings === 'wings-bat') {
      return `
        <!-- Shadow Bat Wings -->
        <g class="monster-wings-layer wings-bat" filter="url(#mf-shadow)">
          <path d="M 64 96 C 24 64 12 90 20 122 C 34 114 46 122 52 134 C 58 122 62 118 68 116 Z" fill="#312e81" stroke="#1e1b4b" stroke-width="2" />
          <path d="M 136 96 C 176 64 188 90 180 122 C 166 114 154 122 148 134 C 142 122 138 118 132 116 Z" fill="#312e81" stroke="#1e1b4b" stroke-width="2" />
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

    if (effectiveTail === 'tail-flame') {
      return `
        <!-- Blazing Flame Tail -->
        <g class="monster-tail-layer" filter="url(#mf-glow)">
          <path d="M 132 136 C 158 132 172 118 168 98 C 162 92 154 100 146 114 Z" fill="${palette.primaryDark}" stroke="${palette.shadow}" stroke-width="2.4" />
          <!-- Animated flame cluster on tip -->
          <polygon points="168,98 184,80 174,96" fill="#f97316" />
          <polygon points="174,96 188,72 178,102" fill="#ef4444" />
          <polygon points="168,98 178,85 172,102" fill="#fde047" />
        </g>
      `;
    }

    if (effectiveTail === 'tail-star') {
      return `
        <!-- Star-Tipped Tail -->
        <g class="monster-tail-layer">
          <path d="M 134 134 C 156 128 170 114 166 100 C 160 94 152 100 146 112 Z" fill="${palette.primary}" stroke="${palette.primaryDark}" stroke-width="2.4" />
          <polygon points="166,96 170,102 176,102 172,106 174,112 166,108 158,112 160,106 156,102 162,102" fill="#facc15" stroke="#ca8a04" stroke-width="1.2" filter="url(#mf-glow)" />
        </g>
      `;
    }

    if (effectiveTail === 'tail-celestial') {
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

    if (effBackpack === 'bp-mini-wings') {
      return `
        <!-- Mini Wings Pack -->
        <g filter="url(#mf-shadow)" fill="#38bdf8" stroke="#0284c7" stroke-width="1.8">
          <ellipse cx="54" cy="112" rx="7" ry="14" transform="rotate(-30, 54, 112)" />
          <ellipse cx="50" cy="126" rx="5" ry="10" transform="rotate(-20, 50, 126)" />
        </g>
      `;
    }

    if (effBackpack === 'bp-adv-bag') {
      return `
        <!-- Compact Adventure Bag -->
        <g filter="url(#mf-shadow)">
          <rect x="50" y="108" width="18" height="30" rx="4" fill="#b45309" stroke="#78350f" stroke-width="2" />
          <circle cx="59" cy="122" r="3" fill="#fde047" />
        </g>
      `;
    }

    return '';
  }

  // --- STAGE GEOMETRY PROPORTIONS ---
  function getStageGeometry(stage) {
    if (stage === 'baby') {
      return { topY: 68, botY: 150, cW: 38, bW: 42, cheekY: 104, eyeY: 114, eyeSpacing: 16, earScale: 0.92, pawY: 136, footSpacing: 20 };
    } else if (stage === 'growing') {
      return { topY: 62, botY: 150, cW: 40, bW: 44, cheekY: 100, eyeY: 112, eyeSpacing: 16.5, earScale: 1.0, pawY: 134, footSpacing: 21 };
    } else if (stage === 'adventurer') {
      return { topY: 56, botY: 150, cW: 42, bW: 46, cheekY: 96, eyeY: 110, eyeSpacing: 17, earScale: 1.08, pawY: 132, footSpacing: 22 };
    } else if (stage === 'advanced') {
      return { topY: 50, botY: 150, cW: 43, bW: 47, cheekY: 92, eyeY: 108, eyeSpacing: 17.5, earScale: 1.15, pawY: 130, footSpacing: 23 };
    } else if (stage === 'ultimate') {
      return { topY: 44, botY: 150, cW: 44, bW: 48, cheekY: 88, eyeY: 106, eyeSpacing: 18, earScale: 1.22, pawY: 128, footSpacing: 24 };
    }
    return { topY: 68, botY: 150, cW: 38, bW: 42, cheekY: 104, eyeY: 114, eyeSpacing: 16, earScale: 0.92, pawY: 136, footSpacing: 20 };
  }

  // --- UNDER-BODY LAYER: REAR ACCESSORIES (Depth Stacking: Darker Tint & Parallax) ---
  function renderUnderBodyAccessories(stage, palette, colorKey, equipped, cX, g) {
    const topY = g.topY;
    const cW = g.cW;
    const scale = g.earScale;

    let hornId = equipped.horns;
    if (!hornId || hornId === 'default') {
      if (stage === 'ultimate' || stage === 'advanced') hornId = 'horns-crystal';
      else if (stage === 'adventurer' || stage === 'growing') hornId = 'horns-small';
      else hornId = 'none';
    }

    // Left (Rear) Ear: Layered beneath body with volumetric darker tone
    const rearEarMarkup = `
      <!-- Rear Ear (Depth Stacking: Ambient Occlusion & Volumetric Parallax) -->
      <g filter="url(#plush-shadow)" class="monster-ear-rear">
        <path d="M ${cX - cW * 0.44} ${topY + 12 * scale}
                 C ${cX - cW * 0.90} ${topY + 2 * scale} ${cX - cW * 1.30 * scale} ${topY - 16 * scale} ${cX - cW * 0.92 * scale} ${topY - 28 * scale}
                 C ${cX - cW * 0.65 * scale} ${topY - 34 * scale} ${cX - cW * 0.40 * scale} ${topY - 8 * scale} ${cX - cW * 0.24 * scale} ${topY + 4 * scale}
                 C ${cX - cW * 0.32 * scale} ${topY + 9 * scale} ${cX - cW * 0.38 * scale} ${topY + 11 * scale} ${cX - cW * 0.44} ${topY + 12 * scale} Z"
              fill="url(#plush-rear-ear-${colorKey})" stroke="${palette.shadowDark || palette.shadow}" stroke-width="2.6" stroke-linejoin="round" />
        <!-- Rear Inner Ear Cavity (Darker Shadow Tone) -->
        <path d="M ${cX - cW * 0.48} ${topY + 8 * scale}
                 C ${cX - cW * 0.82} ${topY + 1 * scale} ${cX - cW * 1.08 * scale} ${topY - 14 * scale} ${cX - cW * 0.88 * scale} ${topY - 22 * scale}
                 C ${cX - cW * 0.68 * scale} ${topY - 25 * scale} ${cX - cW * 0.48 * scale} ${topY - 6 * scale} ${cX - cW * 0.34 * scale} ${topY + 3 * scale} Z"
              fill="${palette.shadowDark || palette.shadow}" opacity="0.55" />
      </g>
    `;

    // Rear Horn (if curved or crystal, renders behind skull)
    let rearHornMarkup = '';
    if (hornId === 'horns-curved') {
      rearHornMarkup = `
        <path d="M ${cX - 18} ${topY + 8} C ${cX - 34} ${topY - 10} ${cX - 46} ${topY - 4} ${cX - 40} ${topY + 16} C ${cX - 32} ${topY + 6} ${cX - 24} ${topY - 4} ${cX - 12} ${topY + 8} Z"
              fill="${palette.shadowDark || palette.shadow}" stroke="${palette.shadowDark || palette.shadow}" stroke-width="2.2" opacity="0.85" filter="url(#plush-shadow)" />
      `;
    } else if (hornId === 'horns-crystal') {
      rearHornMarkup = `
        <path d="M ${cX - 18} ${topY + 8} C ${cX - 34} ${topY - 16} ${cX - 42} ${topY - 30} ${cX - 32} ${topY - 38} C ${cX - 22} ${topY - 24} ${cX - 14} ${topY - 6} ${cX - 10} ${topY + 10} Z"
              fill="url(#plush-crystal-horn)" stroke="#4c1d95" stroke-width="2.2" opacity="0.85" filter="url(#plush-shadow)" />
      `;
    }

    return `
      ${rearEarMarkup}
      ${rearHornMarkup}
    `;
  }

  // --- FOREGROUND OVER-BODY ACCESSORIES (Flared Roots & Front Elements) ---
  function renderOverBodyAccessories(stage, palette, colorKey, equipped, cX, g) {
    const topY = g.topY;
    const cW = g.cW;
    const scale = g.earScale;

    let hornId = equipped.horns;
    if (!hornId || hornId === 'default') {
      if (stage === 'ultimate' || stage === 'advanced') hornId = 'horns-crystal';
      else if (stage === 'adventurer' || stage === 'growing') hornId = 'horns-small';
      else hornId = 'none';
    }

    // Right (Front) Ear: Flared root transition blending into skull envelope with keylit velvet gradient and pastel cavity
    const frontEarMarkup = `
      <!-- Front Ear (Flared Root Fillet Transition) -->
      <g filter="url(#plush-shadow)" class="monster-ear-front">
        <path d="M ${cX + cW * 0.24 * scale} ${topY + 5 * scale}
                 C ${cX + cW * 0.40 * scale} ${topY - 8 * scale} ${cX + cW * 0.65 * scale} ${topY - 34 * scale} ${cX + cW * 0.92 * scale} ${topY - 28 * scale}
                 C ${cX + cW * 1.30 * scale} ${topY - 16 * scale} ${cX + cW * 0.90} ${topY + 2 * scale} ${cX + cW * 0.44} ${topY + 12 * scale}
                 C ${cX + cW * 0.38 * scale} ${topY + 11 * scale} ${cX + cW * 0.32 * scale} ${topY + 9 * scale} ${cX + cW * 0.24 * scale} ${topY + 5 * scale} Z"
              fill="url(#plush-front-ear-${colorKey})" stroke="${palette.primaryDark}" stroke-width="2.8" stroke-linejoin="round" />
        <!-- Front Inner Ear Cavity (Velvet Tone) -->
        <path d="M ${cX + cW * 0.34 * scale} ${topY + 3 * scale}
                 C ${cX + cW * 0.48 * scale} ${topY - 6 * scale} ${cX + cW * 0.68 * scale} ${topY - 25 * scale} ${cX + cW * 0.88 * scale} ${topY - 22 * scale}
                 C ${cX + cW * 1.08 * scale} ${topY - 14 * scale} ${cX + cW * 0.82 * scale} ${topY + 1 * scale} ${cX + cW * 0.48 * scale} ${topY + 8 * scale} Z"
              fill="url(#plush-inner-ear-${colorKey})" opacity="0.85" />
        <path d="M ${cX + cW * 0.50 * scale} ${topY - 18 * scale} Q ${cX + cW * 0.62 * scale} ${topY - 28 * scale} ${cX + cW * 0.82 * scale} ${topY - 26 * scale}"
              fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" opacity="0.8" />
      </g>
    `;

    if (hornId === 'none' || hornId === 'horns-none') {
      return frontEarMarkup;
    }

    let hornsMarkup = '';
    if (hornId === 'horns-small' || hornId === 'horns-nub') {
      hornsMarkup = `
        <!-- Small Sprout Horns with Flared Roots -->
        <g filter="url(#plush-shadow)">
          <path d="M ${cX - 22} ${topY + 8} C ${cX - 24} ${topY - 4} ${cX - 20} ${topY - 16} ${cX - 14} ${topY - 14} Q ${cX - 12} ${topY - 4} ${cX - 10} ${topY + 8} Z"
                fill="${palette.primaryLight}" stroke="${palette.primaryDark}" stroke-width="2.0" />
          <path d="M ${cX + 22} ${topY + 8} C ${cX + 24} ${topY - 4} ${cX + 20} ${topY - 16} ${cX + 14} ${topY - 14} Q ${cX + 12} ${topY - 4} ${cX + 10} ${topY + 8} Z"
                fill="${palette.primaryLight}" stroke="${palette.primaryDark}" stroke-width="2.0" />
        </g>
      `;
    } else if (hornId === 'horns-curved') {
      hornsMarkup = `
        <!-- Curved Ram Horns with Sweeping S-Curves and Ribbed Fillets -->
        <g fill="#f97316" stroke="#c2410c" stroke-width="2.4" filter="url(#plush-shadow)">
          <path d="M ${cX + 16} ${topY + 8} C ${cX + 32} ${topY - 10} ${cX + 48} ${topY - 4} ${cX + 42} ${topY + 18} C ${cX + 34} ${topY + 6} ${cX + 26} ${topY - 4} ${cX + 12} ${topY + 8} Z" />
          <path d="M ${cX + 22} ${topY} C ${cX + 26} ${topY + 2} ${cX + 28} ${topY + 6} ${cX + 28} ${topY + 8}" stroke="#ea580c" stroke-width="1.8" fill="none" />
          <path d="M ${cX + 32} ${topY + 2} C ${cX + 36} ${topY + 6} ${cX + 37} ${topY + 10} ${cX + 36} ${topY + 14}" stroke="#ea580c" stroke-width="1.8" fill="none" />
        </g>
      `;
    } else if (hornId === 'horns-crystal') {
      hornsMarkup = `
        <!-- Crystal Horns with Specular Edge Ridge -->
        <g filter="url(#plush-shadow)">
          <path d="M ${cX + 16} ${topY + 8} C ${cX + 32} ${topY - 16} ${cX + 42} ${topY - 30} ${cX + 32} ${topY - 38} C ${cX + 22} ${topY - 24} ${cX + 14} ${topY - 6} ${cX + 10} ${topY + 10} Z"
                fill="url(#plush-crystal-horn)" stroke="#4c1d95" stroke-width="2.2" />
          <path d="M ${cX + 20} ${topY} L ${cX + 28} ${topY - 26}" stroke="#ffffff" stroke-width="2.0" stroke-linecap="round" opacity="0.9" />
        </g>
      `;
    } else if (hornId === 'horns-gold') {
      hornsMarkup = `
        <!-- Gold Sovereign Horns -->
        <g filter="url(#plush-shadow)">
          <path d="M ${cX - 18} ${topY + 8} C ${cX - 30} ${topY - 12} ${cX - 36} ${topY - 26} ${cX - 24} ${topY - 32} C ${cX - 18} ${topY - 18} ${cX - 14} ${topY} ${cX - 10} ${topY + 8} Z"
                fill="url(#mg-gold-horn)" stroke="#a16207" stroke-width="2.2" />
          <path d="M ${cX + 18} ${topY + 8} C ${cX + 30} ${topY - 12} ${cX + 36} ${topY - 26} ${cX + 24} ${topY - 32} C ${cX + 18} ${topY - 18} ${cX + 14} ${topY} ${cX + 10} ${topY + 8} Z"
                fill="url(#mg-gold-horn)" stroke="#a16207" stroke-width="2.2" />
        </g>
      `;
    } else if (hornId === 'horns-nature') {
      hornsMarkup = `
        <!-- Nature Leaf Horns -->
        <g filter="url(#plush-shadow)">
          <path d="M ${cX - 18} ${topY + 8} C ${cX - 32} ${topY - 6} ${cX - 32} ${topY - 26} ${cX - 18} ${topY - 30} C ${cX - 12} ${topY - 16} ${cX - 12} ${topY} ${cX - 10} ${topY + 8} Z"
                fill="url(#mg-nature-horn)" stroke="#166534" stroke-width="2" />
          <path d="M ${cX + 18} ${topY + 8} C ${cX + 32} ${topY - 6} ${cX + 32} ${topY - 26} ${cX + 18} ${topY - 30} C ${cX - 12} ${topY - 16} ${cX - 12} ${topY} ${cX - 10} ${topY + 8} Z"
                fill="url(#mg-nature-horn)" stroke="#166534" stroke-width="2" />
        </g>
      `;
    } else if (hornId === 'horns-ice') {
      hornsMarkup = `
        <!-- Ice Spire Horns -->
        <g filter="url(#plush-shadow)">
          <path d="M ${cX - 20} ${topY + 8} L ${cX - 28} ${topY - 28} L ${cX - 12} ${topY + 8} Z" fill="url(#mg-ice-horn)" stroke="#0284c7" stroke-width="2" />
          <path d="M ${cX + 20} ${topY + 8} L ${cX + 28} ${topY - 28} L ${cX + 12} ${topY + 8} Z" fill="url(#mg-ice-horn)" stroke="#0284c7" stroke-width="2" />
        </g>
      `;
    } else if (hornId === 'horns-flame') {
      hornsMarkup = `
        <!-- Flame Horns -->
        <g filter="url(#plush-shadow)">
          <path d="M ${cX - 20} ${topY + 8} Q ${cX - 32} ${topY - 10} ${cX - 26} ${topY - 30} Q ${cX - 14} ${topY - 14} ${cX - 10} ${topY + 8} Z" fill="url(#mg-flame-horn)" stroke="#991b1b" stroke-width="2" />
          <path d="M ${cX + 20} ${topY + 8} Q ${cX + 32} ${topY - 10} ${cX + 26} ${topY - 30} Q ${cX + 14} ${topY - 14} ${cX + 10} ${topY + 8} Z" fill="url(#mg-flame-horn)" stroke="#991b1b" stroke-width="2" />
        </g>
      `;
    } else if (hornId === 'horns-star') {
      hornsMarkup = `
        <!-- Star Horns -->
        <g filter="url(#plush-shadow)">
          <path d="M ${cX - 18} ${topY + 8} L ${cX - 22} ${topY - 16} L ${cX - 12} ${topY + 8} Z" fill="#facc15" stroke="#ca8a04" stroke-width="2" />
          <polygon points="${cX-22},${topY-24} ${cX-20},${topY-18} ${cX-14},${topY-18} ${cX-19},${topY-14} ${cX-17},${topY-8} ${cX-22},${topY-12} ${cX-27},${topY-8} ${cX-25},${topY-14} ${cX-30},${topY-18} ${cX-24},${topY-18}" fill="#facc15" stroke="#ca8a04" stroke-width="1.2" />
          <path d="M ${cX + 18} ${topY + 8} L ${cX + 22} ${topY - 16} L ${cX + 12} ${topY + 8} Z" fill="#facc15" stroke="#ca8a04" stroke-width="2" />
          <polygon points="${cX+22},${topY-24} ${cX+24},${topY-18} ${cX+30},${topY-18} ${cX+25},${topY-14} ${cX+27},${topY-8} ${cX+22},${topY-12} ${cX+17},${topY-8} ${cX+19},${topY-14} ${cX+14},${topY-18} ${cX+20},${topY-18}" fill="#facc15" stroke="#ca8a04" stroke-width="1.2" />
        </g>
      `;
    }

    return `
      ${frontEarMarkup}
      ${hornsMarkup}
    `;
  }

  // --- ANATOMICALLY GROUNDED FEET (Flattened Floor Plane Contact) ---
  function renderGroundedFeet(palette, colorKey, cX, g) {
    const botY = g.botY;
    const footSpacing = g.footSpacing;

    return `
      <!-- Volumetric 3D Grounded Paws (Resting on Dais Surface) -->
      <g class="plush-feet" filter="url(#plush-shadow)">
        <!-- Left Foot -->
        <path d="M ${cX - footSpacing - 12} ${botY - 4}
                 C ${cX - footSpacing - 14} ${botY + 4} ${cX - footSpacing - 8} ${botY + 6} ${cX - footSpacing} ${botY + 6}
                 C ${cX - footSpacing + 10} ${botY + 6} ${cX - footSpacing + 13} ${botY + 2} ${cX - footSpacing + 11} ${botY - 5}
                 C ${cX - footSpacing + 6} ${botY - 8} ${cX - footSpacing - 8} ${botY - 7} ${cX - footSpacing - 12} ${botY - 4} Z"
              fill="url(#plush-fur-${colorKey})" stroke="${palette.primaryDark}" stroke-width="2.6" stroke-linejoin="round" />
        <ellipse cx="${cX - footSpacing - 4}" cy="${botY + 1}" rx="3.2" ry="2.2" fill="${palette.primaryLight}" opacity="0.65" />
        <ellipse cx="${cX - footSpacing + 4}" cy="${botY + 1}" rx="3.2" ry="2.2" fill="${palette.primaryLight}" opacity="0.65" />
        <line x1="${cX - footSpacing}" y1="${botY - 2}" x2="${cX - footSpacing}" y2="${botY + 4}" stroke="${palette.primaryDark}" stroke-width="1.6" stroke-linecap="round" />

        <!-- Right Foot -->
        <path d="M ${cX + footSpacing - 11} ${botY - 5}
                 C ${cX + footSpacing - 13} ${botY + 2} ${cX + footSpacing - 10} ${botY + 6} ${cX + footSpacing} ${botY + 6}
                 C ${cX + footSpacing + 8} ${botY + 6} ${cX + footSpacing + 14} ${botY + 4} ${cX + footSpacing + 12} ${botY - 4}
                 C ${cX + footSpacing + 8} ${botY - 7} ${cX + footSpacing - 6} ${botY - 8} ${cX + footSpacing - 11} ${botY - 5} Z"
              fill="url(#plush-fur-${colorKey})" stroke="${palette.primaryDark}" stroke-width="2.6" stroke-linejoin="round" />
        <ellipse cx="${cX + footSpacing - 4}" cy="${botY + 1}" rx="3.2" ry="2.2" fill="${palette.primaryLight}" opacity="0.65" />
        <ellipse cx="${cX + footSpacing + 4}" cy="${botY + 1}" rx="3.2" ry="2.2" fill="${palette.primaryLight}" opacity="0.65" />
        <line x1="${cX + footSpacing}" y1="${botY - 2}" x2="${cX + footSpacing}" y2="${botY + 4}" stroke="${palette.primaryDark}" stroke-width="1.6" stroke-linecap="round" />
      </g>
    `;
  }

  // --- ORGANIC PEAR / JELLY-BEAN TORSO WITH VOLUMETRIC VECTOR LIGHTING ---
  function renderChibiTorso(stage, palette, colorKey, cX, g, equipped) {
    const topY = g.topY;
    const botY = g.botY;
    const cW = g.cW;
    const bW = g.bW;
    const cheekY = g.cheekY;

    // Organic Pear / Jelly-Bean Cubic Bezier Silhouette with Lateral Cheek Swells
    const bodyPath = `
      M ${cX} ${topY}
      C ${cX + cW * 0.52} ${topY} ${cX + cW * 0.94} ${topY + (cheekY - topY) * 0.45} ${cX + cW} ${cheekY}
      C ${cX + cW * 1.05} ${cheekY + 14} ${cX + bW * 1.06} ${botY - 24} ${cX + bW} ${botY - 10}
      C ${cX + bW * 0.88} ${botY + 2} ${cX + 16} ${botY + 1} ${cX} ${botY}
      C ${cX - 16} ${botY + 1} ${cX - bW * 0.88} ${botY + 2} ${cX - bW} ${botY - 10}
      C ${cX - bW * 1.06} ${botY - 24} ${cX - cW * 1.05} ${cheekY + 14} ${cX - cW} ${cheekY}
      C ${cX - cW * 0.94} ${topY + (cheekY - topY) * 0.45} ${cX - cW * 0.52} ${topY} ${cX} ${topY}
      Z
    `;

    // Inner Belly / Muzzle Patch (soft pastel tone breaking up monochromatic fills)
    const bellyTop = g.eyeY + 8;
    const bellyW = bW * 0.62;
    const bellyPath = `
      M ${cX} ${bellyTop}
      C ${cX + bellyW * 0.65} ${bellyTop} ${cX + bellyW} ${bellyTop + 14} ${cX + bellyW} ${botY - 14}
      C ${cX + bellyW * 0.90} ${botY} ${cX + 12} ${botY} ${cX} ${botY}
      C ${cX - 12} ${botY} ${cX - bellyW * 0.90} ${botY} ${cX - bellyW} ${botY - 14}
      C ${cX - bellyW} ${bellyTop + 14} ${cX - bellyW * 0.65} ${bellyTop} ${cX} ${bellyTop}
      Z
    `;

    // Ambient Occlusion Crescent along lower-right inner rim
    const aoCrescent = `
      <path d="M ${cX - 10} ${botY}
               C ${cX + 18} ${botY} ${cX + bW * 0.88} ${botY + 2} ${cX + bW} ${botY - 10}
               C ${cX + bW * 1.06} ${botY - 24} ${cX + cW * 1.05} ${cheekY + 14} ${cX + cW} ${cheekY}
               C ${cX + cW - 5} ${cheekY + 14} ${cX + bW - 7} ${botY - 20} ${cX - 10} ${botY} Z"
            fill="${palette.shadowDark || palette.shadow}" opacity="0.26" />
    `;

    // Top Specular Highlight Arc along crown curve
    const specularArc = `
      <path d="M ${cX - cW * 0.45} ${topY + 6}
               C ${cX - cW * 0.20} ${topY + 2} ${cX + cW * 0.20} ${topY + 2} ${cX + cW * 0.45} ${topY + 6}"
            fill="none" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round" opacity="0.75" />
      <circle cx="${cX - cW * 0.28}" cy="${topY + 9}" r="2.2" fill="#ffffff" opacity="0.9" />
    `;

    // Front Arms / Paws
    let armsMarkup = '';
    if (stage === 'baby') {
      // Tiny baby paws curled happily on belly
      armsMarkup = `
        <g filter="url(#plush-shadow)">
          <path d="M ${cX - 16} ${g.pawY - 4} C ${cX - 10} ${g.pawY - 7} ${cX - 6} ${g.pawY} ${cX - 6} ${g.pawY + 6} C ${cX - 8} ${g.pawY + 9} ${cX - 16} ${g.pawY + 8} ${cX - 18} ${g.pawY + 4} Z"
                fill="url(#plush-fur-${colorKey})" stroke="${palette.primaryDark}" stroke-width="2.4" stroke-linejoin="round" />
          <ellipse cx="${cX - 11}" cy="${g.pawY + 2}" rx="3.5" ry="2.5" fill="${palette.primaryLight}" opacity="0.8" />

          <path d="M ${cX + 16} ${g.pawY - 4} C ${cX + 10} ${g.pawY - 7} ${cX + 6} ${g.pawY} ${cX + 6} ${g.pawY + 6} C ${cX + 8} ${g.pawY + 9} ${cX + 16} ${g.pawY + 8} ${cX + 18} ${g.pawY + 4} Z"
                fill="url(#plush-fur-${colorKey})" stroke="${palette.primaryDark}" stroke-width="2.4" stroke-linejoin="round" />
          <ellipse cx="${cX + 11}" cy="${g.pawY + 2}" rx="3.5" ry="2.5" fill="${palette.primaryLight}" opacity="0.8" />
        </g>
      `;
    } else {
      // Growing, Adventurer, Advanced, Ultimate arms
      armsMarkup = `
        <g filter="url(#plush-shadow)">
          <path d="M ${cX - cW + 5} ${g.pawY - 14} C ${cX - cW - 8} ${g.pawY - 8} ${cX - cW - 10} ${g.pawY + 8} ${cX - cW + 4} ${g.pawY + 12} C ${cX - cW + 10} ${g.pawY + 8} ${cX - cW + 8} ${g.pawY - 4} ${cX - cW + 5} ${g.pawY - 14} Z"
                fill="url(#plush-fur-${colorKey})" stroke="${palette.primaryDark}" stroke-width="2.6" stroke-linejoin="round" />
          <circle cx="${cX - cW - 1}" cy="${g.pawY + 6}" r="3.2" fill="${palette.cheek}" opacity="0.85" />

          <path d="M ${cX + cW - 5} ${g.pawY - 14} C ${cX + cW + 8} ${g.pawY - 8} ${cX + cW + 10} ${g.pawY + 8} ${cX + cW - 4} ${g.pawY + 12} C ${cX + cW - 10} ${g.pawY + 8} ${cX + cW - 8} ${g.pawY - 4} ${cX + cW - 5} ${g.pawY - 14} Z"
                fill="url(#plush-fur-${colorKey})" stroke="${palette.primaryDark}" stroke-width="2.6" stroke-linejoin="round" />
          <circle cx="${cX + cW + 1}" cy="${g.pawY + 6}" r="3.2" fill="${palette.cheek}" opacity="0.85" />
        </g>
      `;
    }

    return `
      <!-- Main Organic Torso with Volumetric Shading -->
      <g filter="url(#plush-shadow)">
        <path d="${bodyPath}" fill="url(#plush-fur-${colorKey})" stroke="${palette.primaryDark}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round" />
        <path d="${bellyPath}" fill="url(#plush-belly-${colorKey})" />
        ${aoCrescent}
        ${specularArc}
        ${armsMarkup}
      </g>
    `;
  }

  // --- MAIN MONSTER BODY LAYER (Stages 3 to 7) ---
  function renderMonsterBody(stage, palette, colorKey, equipped) {
    const g = getStageGeometry(stage);
    const cX = 100;
    const cY = (g.topY + g.botY) / 2;
    const rx = g.bW;
    const ry = (g.botY - g.topY) / 2;

    const underBodyMarkup = renderUnderBodyAccessories(stage, palette, colorKey, equipped, cX, g);
    const feetMarkup = renderGroundedFeet(palette, colorKey, cX, g);
    const torsoMarkup = renderChibiTorso(stage, palette, colorKey, cX, g, equipped);
    const overBodyMarkup = renderOverBodyAccessories(stage, palette, colorKey, equipped, cX, g);
    const clothingMarkup = renderClothingLayer(equipped.clothing, cX, cY, rx, ry, palette, stage);
    const faceMarkup = renderFaceElements(stage, palette, colorKey, equipped, cX, g);

    return `
      ${underBodyMarkup}
      ${feetMarkup}
      ${torsoMarkup}
      ${overBodyMarkup}
      ${clothingMarkup}
      ${faceMarkup}
    `;
  }

  // --- CLOTHING LAYER ---
  function renderClothingLayer(clothingId, cX, cY, rx, ry, palette, stage) {
    if (!clothingId || clothingId === 'none' || clothingId === 'clothing-none') return '';

    // Adventure
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
        <!-- Hero Adventure Cape -->
        <g filter="url(#mf-shadow)">
          <path d="M ${cX - 24} ${cY - 12} Q ${cX} ${cY - 6} ${cX + 24} ${cY - 12} L ${cX + 32} ${cY + ry + 10} Q ${cX} ${cY + ry + 2} ${cX - 32} ${cY + ry + 10} Z" fill="#dc2626" stroke="#991b1b" stroke-width="2" opacity="0.9" />
          <circle cx="${cX}" cy="${cY - 8}" r="4" fill="#facc15" stroke="#ca8a04" stroke-width="1.5" />
        </g>
      `;
    }

    if (clothingId === 'clothing-adv-jacket') {
      return `
        <!-- Explorer Aviator Jacket -->
        <g filter="url(#mf-shadow)">
          <path d="M ${cX - rx + 3} ${cY} Q ${cX} ${cY + 8} ${cX + rx - 3} ${cY} L ${cX + rx - 2} ${cY + ry - 2} L ${cX - rx + 2} ${cY + ry - 2} Z" fill="#92400e" stroke="#78350f" stroke-width="2" />
          <!-- Cream fleece collar -->
          <ellipse cx="${cX}" cy="${cY + 2}" rx="${rx * 0.7}" ry="6" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" />
          <line x1="${cX}" y1="${cY + 6}" x2="${cX}" y2="${cY + ry - 2}" stroke="#facc15" stroke-width="2" />
        </g>
      `;
    }

    if (clothingId === 'clothing-travel-coat') {
      return `
        <!-- Explorer Travel Coat -->
        <g filter="url(#mf-shadow)">
          <path d="M ${cX - rx + 3} ${cY} Q ${cX} ${cY + 6} ${cX + rx - 3} ${cY} L ${cX + rx - 2} ${cY + ry - 1} L ${cX - rx + 2} ${cY + ry - 1} Z" fill="#0369a1" stroke="#075985" stroke-width="2" />
          <line x1="${cX}" y1="${cY + 4}" x2="${cX}" y2="${cY + ry - 1}" stroke="#f8fafc" stroke-width="2" />
          <circle cx="${cX - 5}" cy="${cY + 12}" r="1.8" fill="#facc15" />
          <circle cx="${cX - 5}" cy="${cY + 20}" r="1.8" fill="#facc15" />
        </g>
      `;
    }

    if (clothingId === 'clothing-hoodie') {
      return `
        <!-- Casual Student Hoodie -->
        <g filter="url(#mf-shadow)">
          <path d="M ${cX - rx + 4} ${cY + 2} Q ${cX} ${cY + 10} ${cX + rx - 4} ${cY + 2} L ${cX + rx - 3} ${cY + ry - 4} L ${cX - rx + 3} ${cY + ry - 4} Z" fill="#059669" stroke="#047857" stroke-width="2" />
          <ellipse cx="${cX}" cy="${cY + 4}" rx="${rx * 0.6}" ry="5" fill="#10b981" />
          <!-- Pouch pocket -->
          <path d="M ${cX - 14} ${cY + ry - 12} L ${cX + 14} ${cY + ry - 12} L ${cX + 10} ${cY + ry - 4} L ${cX - 10} ${cY + ry - 4} Z" fill="#047857" opacity="0.8" />
        </g>
      `;
    }

    if (clothingId === 'clothing-sweater') {
      return `
        <!-- Cozy Knitted Sweater -->
        <g filter="url(#mf-shadow)">
          <path d="M ${cX - rx + 4} ${cY + 2} Q ${cX} ${cY + 8} ${cX + rx - 4} ${cY + 2} L ${cX + rx - 3} ${cY + ry - 4} L ${cX - rx + 3} ${cY + ry - 4} Z" fill="#dc2626" stroke="#991b1b" stroke-width="2" />
          <line x1="${cX - rx + 4}" y1="${cY + 10}" x2="${cX + rx - 4}" y2="${cY + 10}" stroke="#fca5a5" stroke-width="1.8" stroke-dasharray="3 3" />
          <line x1="${cX - rx + 4}" y1="${cY + 18}" x2="${cX + rx - 4}" y2="${cY + 18}" stroke="#fca5a5" stroke-width="1.8" stroke-dasharray="3 3" />
        </g>
      `;
    }

    if (clothingId === 'clothing-scarf') {
      return `
        <!-- Cozy Winter Scarf -->
        <g filter="url(#mf-shadow)">
          <ellipse cx="${cX}" cy="${cY + 4}" rx="${rx * 0.75}" ry="7" fill="#ef4444" stroke="#b91c1c" stroke-width="2" />
          <path d="M ${cX + 8} ${cY + 8} L ${cX + 18} ${cY + ry + 4} L ${cX + 6} ${cY + ry + 4} Z" fill="#dc2626" stroke="#991b1b" stroke-width="1.5" />
          <!-- Scarf fringe -->
          <line x1="${cX + 7}" y1="${cY + ry + 4}" x2="${cX + 7}" y2="${cY + ry + 8}" stroke="#fef08a" stroke-width="1.5" />
          <line x1="${cX + 12}" y1="${cY + ry + 4}" x2="${cX + 12}" y2="${cY + ry + 8}" stroke="#fef08a" stroke-width="1.5" />
          <line x1="${cX + 17}" y1="${cY + ry + 4}" x2="${cX + 17}" y2="${cY + ry + 8}" stroke="#fef08a" stroke-width="1.5" />
        </g>
      `;
    }

    if (clothingId === 'clothing-pilot') {
      return `
        <!-- Ace Pilot Jumpsuit -->
        <g filter="url(#mf-shadow)">
          <path d="M ${cX - rx + 4} ${cY + 2} Q ${cX} ${cY + 6} ${cX + rx - 4} ${cY + 2} L ${cX + rx - 3} ${cY + ry - 3} L ${cX - rx + 3} ${cY + ry - 3} Z" fill="#ea580c" stroke="#c2410c" stroke-width="2" />
          <line x1="${cX}" y1="${cY + 3}" x2="${cX}" y2="${cY + ry - 3}" stroke="#facc15" stroke-width="2" />
          <!-- Star patch on chest -->
          <polygon points="${cX-10},${cY+12} ${cX-8},${cY+14} ${cX-5},${cY+14} ${cX-7},${cY+16} ${cX-6},${cY+19} ${cX-10},${cY+17} ${cX-14},${cY+19} ${cX-13},${cY+16} ${cX-15},${cY+14} ${cX-12},${cY+14}" fill="#facc15" />
        </g>
      `;
    }

    if (clothingId === 'clothing-tuxedo') {
      return `
        <!-- Formal Evening Tuxedo -->
        <g filter="url(#mf-shadow)">
          <path d="M ${cX - rx + 4} ${cY + 2} Q ${cX} ${cY + 6} ${cX + rx - 4} ${cY + 2} L ${cX + rx - 3} ${cY + ry - 3} L ${cX - rx + 3} ${cY + ry - 3} Z" fill="#0f172a" stroke="#020617" stroke-width="2" />
          <polygon points="${cX},${cY+4} ${cX+10},${cY+ry-3} ${cX-10},${cY+ry-3}" fill="#f8fafc" />
          <!-- Red bow tie -->
          <polygon points="${cX},${cY+6} ${cX-6},${cY+4} ${cX-6},${cY+8}" fill="#ef4444" />
          <polygon points="${cX},${cY+6} ${cX+6},${cY+4} ${cX+6},${cY+8}" fill="#ef4444" />
          <circle cx="${cX}" cy="${cY+6}" r="1.5" fill="#dc2626" />
        </g>
      `;
    }

    if (clothingId === 'clothing-ninja') {
      return `
        <!-- Shadow Ninja Garb -->
        <g filter="url(#mf-shadow)">
          <path d="M ${cX - rx + 3} ${cY} Q ${cX} ${cY + 6} ${cX + rx - 3} ${cY} L ${cX + rx - 2} ${cY + ry - 2} L ${cX - rx + 2} ${cY + ry - 2} Z" fill="#18181b" stroke="#09090b" stroke-width="2" />
          <!-- Red ninja sash -->
          <rect x="${cX - rx + 4}" y="${cY + ry - 10}" width="${rx * 2 - 8}" height="5" fill="#dc2626" stroke="#991b1b" stroke-width="1" />
          <path d="M ${cX + 6} ${cY + ry - 6} L ${cX + 12} ${cY + ry + 8} L ${cX + 4} ${cY + ry + 8} Z" fill="#dc2626" />
        </g>
      `;
    }

    if (clothingId === 'clothing-kimono') {
      return `
        <!-- Elegant Kimono Robe -->
        <g filter="url(#mf-shadow)">
          <path d="M ${cX - rx + 3} ${cY} Q ${cX} ${cY + 6} ${cX + rx - 3} ${cY} L ${cX + rx - 2} ${cY + ry - 2} L ${cX - rx + 2} ${cY + ry - 2} Z" fill="#f43f5e" stroke="#e11d48" stroke-width="2" />
          <!-- Gold Obi sash -->
          <rect x="${cX - rx + 4}" y="${cY + 12}" width="${rx * 2 - 8}" height="7" fill="#facc15" stroke="#ca8a04" stroke-width="1.2" />
          <line x1="${cX - 12}" y1="${cY + 2}" x2="${cX + 4}" y2="${cY + 12}" stroke="#ffffff" stroke-width="2" />
          <line x1="${cX + 12}" y1="${cY + 2}" x2="${cX - 4}" y2="${cY + 12}" stroke="#ffffff" stroke-width="2" />
        </g>
      `;
    }

    if (clothingId === 'clothing-armor') {
      return `
        <!-- Knight Golden Armor Plate -->
        <g filter="url(#mf-shadow)">
          <path d="M ${cX - rx + 4} ${cY + 2} Q ${cX} ${cY + 6} ${cX + rx - 4} ${cY + 2} L ${cX + rx - 5} ${cY + ry - 3} Q ${cX} ${cY + ry + 4} ${cX - rx + 5} ${cY + ry - 3} Z" fill="#eab308" stroke="#ca8a04" stroke-width="2" />
          <circle cx="${cX}" cy="${cY + 14}" r="5" fill="#facc15" stroke="#a16207" stroke-width="1.5" />
          <polygon points="${cX},${cY+11} ${cX+2},${cY+13} ${cX+5},${cY+13} ${cX+3},${cY+15} ${cX+4},${cY+17} ${cX},${cY+16} ${cX-4},${cY+17} ${cX-3},${cY+15} ${cX-5},${cY+13} ${cX-2},${cY+13}" fill="#ca8a04" />
        </g>
      `;
    }

    if (clothingId === 'clothing-magic-robe') {
      return `
        <!-- Magical Robe -->
        <g filter="url(#mf-shadow)">
          <path d="M ${cX - rx + 3} ${cY} Q ${cX} ${cY + 6} ${cX + rx - 3} ${cY} L ${cX + rx + 2} ${cY + ry + 4} L ${cX - rx - 2} ${cY + ry + 4} Z" fill="#a855f7" stroke="#7e22ce" stroke-width="2" />
          <ellipse cx="${cX}" cy="${cY + 16}" rx="${rx * 0.6}" ry="3.5" fill="#facc15" />
          <polygon points="${cX},${cY+6} ${cX+2},${cY+10} ${cX+6},${cY+10} ${cX+3},${cY+13} ${cX+4},${cY+17} ${cX},${cY+14} ${cX-4},${cY+17} ${cX-3},${cY+13} ${cX-6},${cY+10} ${cX-2},${cY+10}" fill="#facc15" />
        </g>
      `;
    }

    return '';
  }

  // --- FACE ELEMENTS (Low Horizon Placement, Chibi Outward Angled Perspective, Big Glints) ---
  function renderFaceElements(stage, palette, colorKey, equipped, cX, g) {
    let eyesId = equipped.eyes || 'eyes-sparkle';
    if (eyesId === 'default') eyesId = 'eyes-sparkle';
    const mouthId = equipped.mouth || 'mouth-smile';

    // Low Horizon Placement (Lower 38%-42% of cranial mass for peak cute chibi appeal)
    const eyeY = g.eyeY;
    const eyeSpacing = g.eyeSpacing;
    const mouthY = eyeY + 13;

    // Warm signature pink blush cheeks nestled directly into the cheek swell
    const cheeks = `
      <!-- Soft Velvet Cheek Blush -->
      <ellipse cx="${cX - eyeSpacing - 10}" cy="${eyeY + 11}" rx="8.5" ry="5.5" fill="${palette.cheek}" opacity="0.78" />
      <ellipse cx="${cX + eyeSpacing + 10}" cy="${eyeY + 11}" rx="8.5" ry="5.5" fill="${palette.cheek}" opacity="0.78" />
    `;

    // 3D Snout & Muzzle Dome with Curved Button Nose
    const snoutDome = `
      <!-- 3D Snout & Muzzle Dome (Volumetric Dimensional Pad) -->
      <ellipse cx="${cX}" cy="${eyeY + 7}" rx="14.5" ry="9.5" fill="url(#plush-snout-${colorKey})" filter="url(#plush-shadow)" />
      <!-- Cute Curved Button Snout Nose with Specular Highlight -->
      <ellipse cx="${cX}" cy="${eyeY + 4.5}" rx="3.2" ry="2.4" fill="#0f172a" />
      <circle cx="${cX - 0.9}" cy="${eyeY + 3.8}" r="1.0" fill="#ffffff" opacity="0.9" />
    `;

    let eyesMarkup = '';
    if (eyesId === 'eyes-wink' || eyesId === 'eyes-curious') {
      eyesMarkup = `
        <!-- Curious Wink Eyes -->
        <g transform="rotate(-4, ${cX - eyeSpacing}, ${eyeY})">
          <path d="M ${cX - eyeSpacing - 8} ${eyeY} Q ${cX - eyeSpacing} ${eyeY - 7} ${cX - eyeSpacing + 8} ${eyeY}" stroke="#0f172a" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        </g>
        <g transform="rotate(4, ${cX + eyeSpacing}, ${eyeY})">
          <ellipse cx="${cX + eyeSpacing}" cy="${eyeY}" rx="9.8" ry="13.0" fill="#020617" stroke="${palette.primaryDark}" stroke-width="1.8" />
          <ellipse cx="${cX + eyeSpacing}" cy="${eyeY + 2}" rx="8.6" ry="10.2" fill="url(#plush-eye-iris-${colorKey})" />
          <ellipse cx="${cX + eyeSpacing}" cy="${eyeY}" rx="5.2" ry="7.0" fill="#090d16" />
          <circle cx="${cX + eyeSpacing - 3.0}" cy="${eyeY - 3.8}" r="4.3" fill="#ffffff" />
          <circle cx="${cX + eyeSpacing + 3.2}" cy="${eyeY + 3.8}" r="2.2" fill="#ffffff" opacity="0.95" />
        </g>
      `;
    } else if (eyesId === 'eyes-happy') {
      eyesMarkup = `
        <!-- Happy Crescent Eyes -->
        <g transform="rotate(-4, ${cX - eyeSpacing}, ${eyeY})">
          <path d="M ${cX - eyeSpacing - 9} ${eyeY + 2} Q ${cX - eyeSpacing} ${eyeY - 10} ${cX - eyeSpacing + 9} ${eyeY + 2}" stroke="#0f172a" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          <circle cx="${cX - eyeSpacing - 2}" cy="${eyeY - 2}" r="1.8" fill="#ffffff" opacity="0.9" />
        </g>
        <g transform="rotate(4, ${cX + eyeSpacing}, ${eyeY})">
          <path d="M ${cX + eyeSpacing - 9} ${eyeY + 2} Q ${cX + eyeSpacing} ${eyeY - 10} ${cX + eyeSpacing + 9} ${eyeY + 2}" stroke="#0f172a" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          <circle cx="${cX + eyeSpacing + 2}" cy="${eyeY - 2}" r="1.8" fill="#ffffff" opacity="0.9" />
        </g>
      `;
    } else if (eyesId === 'eyes-brave') {
      eyesMarkup = `
        <!-- Brave Hero Eyes with angled brows -->
        <line x1="${cX - eyeSpacing - 9}" y1="${eyeY - 14}" x2="${cX - eyeSpacing + 8}" y2="${eyeY - 10}" stroke="#0f172a" stroke-width="3.0" stroke-linecap="round" />
        <line x1="${cX + eyeSpacing + 9}" y1="${eyeY - 14}" x2="${cX + eyeSpacing - 8}" y2="${eyeY - 10}" stroke="#0f172a" stroke-width="3.0" stroke-linecap="round" />
        <g transform="rotate(-3, ${cX - eyeSpacing}, ${eyeY})">
          <ellipse cx="${cX - eyeSpacing}" cy="${eyeY}" rx="9.8" ry="12.4" fill="#020617" stroke="${palette.primaryDark}" stroke-width="1.6" />
          <ellipse cx="${cX - eyeSpacing}" cy="${eyeY + 2}" rx="8.6" ry="9.8" fill="url(#plush-eye-iris-${colorKey})" />
          <ellipse cx="${cX - eyeSpacing}" cy="${eyeY}" rx="5.0" ry="6.8" fill="#090d16" />
          <circle cx="${cX - eyeSpacing - 3.0}" cy="${eyeY - 3.4}" r="4.0" fill="#ffffff" />
          <circle cx="${cX - eyeSpacing + 3.0}" cy="${eyeY + 3.4}" r="2.0" fill="#ffffff" />
        </g>
        <g transform="rotate(3, ${cX + eyeSpacing}, ${eyeY})">
          <ellipse cx="${cX + eyeSpacing}" cy="${eyeY}" rx="9.8" ry="12.4" fill="#020617" stroke="${palette.primaryDark}" stroke-width="1.6" />
          <ellipse cx="${cX + eyeSpacing}" cy="${eyeY + 2}" rx="8.6" ry="9.8" fill="url(#plush-eye-iris-${colorKey})" />
          <ellipse cx="${cX + eyeSpacing}" cy="${eyeY}" rx="5.0" ry="6.8" fill="#090d16" />
          <circle cx="${cX + eyeSpacing - 3.0}" cy="${eyeY - 3.4}" r="4.0" fill="#ffffff" />
          <circle cx="${cX + eyeSpacing + 3.0}" cy="${eyeY + 3.4}" r="2.0" fill="#ffffff" />
        </g>
      `;
    } else if (eyesId === 'eyes-sleepy') {
      eyesMarkup = `
        <!-- Sleepy Eyes with gentle downward arcs -->
        <path d="M ${cX - eyeSpacing - 9} ${eyeY - 2} Q ${cX - eyeSpacing} ${eyeY + 8} ${cX - eyeSpacing + 9} ${eyeY - 2}" stroke="#0f172a" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        <path d="M ${cX + eyeSpacing - 9} ${eyeY - 2} Q ${cX + eyeSpacing} ${eyeY + 8} ${cX + eyeSpacing + 9} ${eyeY - 2}" stroke="#0f172a" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      `;
    } else if (eyesId === 'eyes-star') {
      eyesMarkup = `
        <!-- Starry Eyes -->
        <g transform="rotate(-4, ${cX - eyeSpacing}, ${eyeY})">
          <ellipse cx="${cX - eyeSpacing}" cy="${eyeY}" rx="9.8" ry="13.0" fill="#020617" stroke="${palette.primaryDark}" stroke-width="1.8" />
          <ellipse cx="${cX - eyeSpacing}" cy="${eyeY + 2}" rx="8.6" ry="10.2" fill="url(#plush-eye-iris-${colorKey})" />
          <polygon points="${cX-eyeSpacing},${eyeY-6} ${cX-eyeSpacing+2.4},${eyeY-1.2} ${cX-eyeSpacing+7},${eyeY-1.2} ${cX-eyeSpacing+3.5},${eyeY+2.4} ${cX-eyeSpacing+4.8},${eyeY+7} ${cX-eyeSpacing},${eyeY+3.6} ${cX-eyeSpacing-4.8},${eyeY+7} ${cX-eyeSpacing-3.5},${eyeY+2.4} ${cX-eyeSpacing-7},${eyeY-1.2} ${cX-eyeSpacing-2.4},${eyeY-1.2}" fill="#facc15" />
          <circle cx="${cX - eyeSpacing - 3.0}" cy="${eyeY - 3.8}" r="2.4" fill="#ffffff" />
        </g>
        <g transform="rotate(4, ${cX + eyeSpacing}, ${eyeY})">
          <ellipse cx="${cX + eyeSpacing}" cy="${eyeY}" rx="9.8" ry="13.0" fill="#020617" stroke="${palette.primaryDark}" stroke-width="1.8" />
          <ellipse cx="${cX + eyeSpacing}" cy="${eyeY + 2}" rx="8.6" ry="10.2" fill="url(#plush-eye-iris-${colorKey})" />
          <polygon points="${cX+eyeSpacing},${eyeY-6} ${cX+eyeSpacing+2.4},${eyeY-1.2} ${cX+eyeSpacing+7},${eyeY-1.2} ${cX+eyeSpacing+3.5},${eyeY+2.4} ${cX+eyeSpacing+4.8},${eyeY+7} ${cX+eyeSpacing},${eyeY+3.6} ${cX+eyeSpacing-4.8},${eyeY+7} ${cX+eyeSpacing-3.5},${eyeY+2.4} ${cX+eyeSpacing-7},${eyeY-1.2} ${cX+eyeSpacing-2.4},${eyeY-1.2}" fill="#facc15" />
          <circle cx="${cX + eyeSpacing - 3.0}" cy="${eyeY - 3.8}" r="2.4" fill="#ffffff" />
        </g>
      `;
    } else if (eyesId === 'eyes-dragon') {
      eyesMarkup = `
        <!-- Dragon Golden Eyes with vertical slit pupils -->
        <g transform="rotate(-4, ${cX - eyeSpacing}, ${eyeY})">
          <ellipse cx="${cX - eyeSpacing}" cy="${eyeY}" rx="9.8" ry="13.0" fill="#ca8a04" stroke="#713f12" stroke-width="1.8" />
          <ellipse cx="${cX - eyeSpacing}" cy="${eyeY + 2}" rx="8.6" ry="10.2" fill="#eab308" />
          <ellipse cx="${cX - eyeSpacing}" cy="${eyeY}" rx="2.5" ry="9.5" fill="#020617" />
          <circle cx="${cX - eyeSpacing - 2.8}" cy="${eyeY - 3.8}" r="3.2" fill="#ffffff" />
          <circle cx="${cX - eyeSpacing + 2.8}" cy="${eyeY + 3.8}" r="1.8" fill="#ffffff" opacity="0.9" />
        </g>
        <g transform="rotate(4, ${cX + eyeSpacing}, ${eyeY})">
          <ellipse cx="${cX + eyeSpacing}" cy="${eyeY}" rx="9.8" ry="13.0" fill="#ca8a04" stroke="#713f12" stroke-width="1.8" />
          <ellipse cx="${cX + eyeSpacing}" cy="${eyeY + 2}" rx="8.6" ry="10.2" fill="#eab308" />
          <ellipse cx="${cX + eyeSpacing}" cy="${eyeY}" rx="2.5" ry="9.5" fill="#020617" />
          <circle cx="${cX + eyeSpacing - 2.8}" cy="${eyeY - 3.8}" r="3.2" fill="#ffffff" />
          <circle cx="${cX + eyeSpacing + 2.8}" cy="${eyeY + 3.8}" r="1.8" fill="#ffffff" opacity="0.9" />
        </g>
      `;
    } else if (eyesId === 'eyes-galaxy') {
      eyesMarkup = `
        <!-- Galaxy Cosmic Eyes -->
        <g transform="rotate(-4, ${cX - eyeSpacing}, ${eyeY})">
          <ellipse cx="${cX - eyeSpacing}" cy="${eyeY}" rx="9.8" ry="13.0" fill="#1e1b4b" stroke="#8b5cf6" stroke-width="1.8" />
          <ellipse cx="${cX - eyeSpacing}" cy="${eyeY + 2}" rx="8.6" ry="10.2" fill="#4338ca" />
          <circle cx="${cX - eyeSpacing}" cy="${eyeY}" r="6.2" fill="#c084fc" opacity="0.65" />
          <circle cx="${cX - eyeSpacing - 3.0}" cy="${eyeY - 3.8}" r="4.2" fill="#ffffff" />
          <circle cx="${cX - eyeSpacing + 3.2}" cy="${eyeY + 3.8}" r="2.0" fill="#38bdf8" />
        </g>
        <g transform="rotate(4, ${cX + eyeSpacing}, ${eyeY})">
          <ellipse cx="${cX + eyeSpacing}" cy="${eyeY}" rx="9.8" ry="13.0" fill="#1e1b4b" stroke="#8b5cf6" stroke-width="1.8" />
          <ellipse cx="${cX + eyeSpacing}" cy="${eyeY + 2}" rx="8.6" ry="10.2" fill="#4338ca" />
          <circle cx="${cX + eyeSpacing}" cy="${eyeY}" r="6.2" fill="#c084fc" opacity="0.65" />
          <circle cx="${cX + eyeSpacing - 3.0}" cy="${eyeY - 3.8}" r="4.2" fill="#ffffff" />
          <circle cx="${cX + eyeSpacing + 3.2}" cy="${eyeY + 3.8}" r="2.0" fill="#38bdf8" />
        </g>
      `;
    } else {
      // Default: Living Glossy Eyes (11 O'Clock Keylit Glass Spheres)
      eyesMarkup = `
        <!-- Living Glossy Left Eye -->
        <g transform="rotate(-4, ${cX - eyeSpacing}, ${eyeY})">
          <ellipse cx="${cX - eyeSpacing}" cy="${eyeY}" rx="9.8" ry="13.0" fill="#020617" stroke="${palette.primaryDark}" stroke-width="1.8" />
          <ellipse cx="${cX - eyeSpacing}" cy="${eyeY + 2}" rx="8.6" ry="10.2" fill="url(#plush-eye-iris-${colorKey})" />
          <ellipse cx="${cX - eyeSpacing}" cy="${eyeY}" rx="5.2" ry="7.0" fill="#090d16" />
          <!-- Dominant 11 O'Clock Primary Reflection Dot (Real Glass Sphere) -->
          <circle cx="${cX - eyeSpacing - 3.0}" cy="${eyeY - 3.8}" r="4.3" fill="#ffffff" />
          <circle cx="${cX - eyeSpacing - 3.0}" cy="${eyeY - 3.8}" r="2.2" fill="#ffffff" filter="url(#plush-contact-blur)" opacity="0.8" />
          <!-- Secondary Bounce Light at 5 O'Clock -->
          <circle cx="${cX - eyeSpacing + 3.2}" cy="${eyeY + 3.8}" r="2.2" fill="#ffffff" opacity="0.95" />
          <!-- Tertiary Micro Reflection Spec -->
          <circle cx="${cX - eyeSpacing - 3.6}" cy="${eyeY + 2.8}" r="1.1" fill="#ffffff" opacity="0.85" />
        </g>

        <!-- Living Glossy Right Eye -->
        <g transform="rotate(4, ${cX + eyeSpacing}, ${eyeY})">
          <ellipse cx="${cX + eyeSpacing}" cy="${eyeY}" rx="9.8" ry="13.0" fill="#020617" stroke="${palette.primaryDark}" stroke-width="1.8" />
          <ellipse cx="${cX + eyeSpacing}" cy="${eyeY + 2}" rx="8.6" ry="10.2" fill="url(#plush-eye-iris-${colorKey})" />
          <ellipse cx="${cX + eyeSpacing}" cy="${eyeY}" rx="5.2" ry="7.0" fill="#090d16" />
          <!-- Dominant 11 O'Clock Primary Reflection Dot -->
          <circle cx="${cX + eyeSpacing - 3.0}" cy="${eyeY - 3.8}" r="4.3" fill="#ffffff" />
          <circle cx="${cX + eyeSpacing - 3.0}" cy="${eyeY - 3.8}" r="2.2" fill="#ffffff" filter="url(#plush-contact-blur)" opacity="0.8" />
          <!-- Secondary Bounce Light at 5 O'Clock -->
          <circle cx="${cX + eyeSpacing + 3.2}" cy="${eyeY + 3.8}" r="2.2" fill="#ffffff" opacity="0.95" />
          <!-- Tertiary Micro Reflection Spec -->
          <circle cx="${cX + eyeSpacing - 3.6}" cy="${eyeY + 2.8}" r="1.1" fill="#ffffff" opacity="0.85" />
        </g>
      `;
    }

    let mouthMarkup = '';
    if (mouthId === 'mouth-cheer' || mouthId === 'mouth-open') {
      mouthMarkup = `
        <path d="M ${cX - 9} ${mouthY} Q ${cX} ${mouthY + 14} ${cX + 9} ${mouthY} Z" fill="#e11d48" stroke="#9f1239" stroke-width="2.5" stroke-linejoin="round" />
        <path d="M ${cX - 5} ${mouthY + 8} Q ${cX} ${mouthY + 6} ${cX + 5} ${mouthY + 8}" fill="#fda4af" />
      `;
    } else if (mouthId === 'mouth-toothy') {
      mouthMarkup = `
        <path d="M ${cX - 10} ${mouthY} Q ${cX} ${mouthY + 11} ${cX + 10} ${mouthY}" fill="#0f172a" stroke="#0f172a" stroke-width="2.4" stroke-linejoin="round" />
        <polygon points="${cX - 5},${mouthY} ${cX - 3},${mouthY + 4} ${cX - 1},${mouthY}" fill="#ffffff" />
        <polygon points="${cX + 1},${mouthY} ${cX + 3},${mouthY + 4} ${cX + 5},${mouthY}" fill="#ffffff" />
      `;
    } else if (mouthId === 'mouth-tiny') {
      mouthMarkup = `
        <path d="M ${cX - 5} ${mouthY + 1} Q ${cX} ${mouthY + 5} ${cX + 5} ${mouthY + 1}" fill="none" stroke="#0f172a" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />
      `;
    } else if (mouthId === 'mouth-excited') {
      mouthMarkup = `
        <path d="M ${cX - 10} ${mouthY - 1} Q ${cX} ${mouthY + 15} ${cX + 10} ${mouthY - 1} Z" fill="#f43f5e" stroke="#be123c" stroke-width="2.5" stroke-linejoin="round" />
        <ellipse cx="${cX}" cy="${mouthY + 9}" rx="5.5" ry="3.5" fill="#fbcfe8" />
      `;
    } else if (mouthId === 'mouth-brave') {
      mouthMarkup = `
        <path d="M ${cX - 8} ${mouthY + 2} Q ${cX} ${mouthY} ${cX + 9} ${mouthY - 3}" fill="none" stroke="#0f172a" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />
      `;
    } else if (mouthId === 'mouth-laughing') {
      mouthMarkup = `
        <path d="M ${cX - 9} ${mouthY} Q ${cX} ${mouthY + 12} ${cX + 9} ${mouthY}" fill="#e11d48" stroke="#0f172a" stroke-width="2.6" stroke-linejoin="round" />
      `;
    } else if (mouthId === 'mouth-surprise') {
      mouthMarkup = `
        <ellipse cx="${cX}" cy="${mouthY + 3}" rx="5" ry="6.8" fill="#be123c" stroke="#881337" stroke-width="2.2" />
      `;
    } else {
      // Default: Organic W-Smile Lip Crease (Cuddly Plush Mouth)
      mouthMarkup = `
        <path d="M ${cX - 7.5} ${mouthY} Q ${cX - 3.5} ${mouthY + 5.0} ${cX} ${mouthY + 2.5} Q ${cX + 3.5} ${mouthY + 5.0} ${cX + 7.5} ${mouthY}"
              fill="none" stroke="#0f172a" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
      `;
    }

    return `
      <!-- Living Glossy Chibi Face Elements -->
      <g class="plush-face">
        ${cheeks}
        ${snoutDome}
        ${eyesMarkup}
        ${mouthMarkup}
      </g>
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

    // Hats
    if (hatId === 'hat-crown') {
      hatMarkup = `
        <!-- Sovereign Royal Crown (Volumetric 3D Gold with Jewels) -->
        <g filter="url(#plush-shadow)">
          <polygon points="80,52 86,26 100,40 114,26 120,52" fill="url(#plush-gold-crown)" stroke="#713f12" stroke-width="2" stroke-linejoin="round" />
          <rect x="78" y="50" width="44" height="6" rx="2" fill="#ca8a04" stroke="#713f12" stroke-width="1.2" />
          <circle cx="100" cy="42" r="3.2" fill="#ef4444" stroke="#7f1d1d" stroke-width="0.8" />
          <circle cx="87" cy="34" r="2.4" fill="#3b82f6" stroke="#1e3a8a" stroke-width="0.8" />
          <circle cx="113" cy="34" r="2.4" fill="#10b981" stroke="#064e3b" stroke-width="0.8" />
        </g>
      `;
    } else if (hatId === 'hat-explorer') {
      hatMarkup = `
        <!-- Adventurer Explorer Fedora (11 O'Clock Shading) -->
        <g filter="url(#plush-shadow)">
          <ellipse cx="100" cy="66" rx="38" ry="8" fill="#d97706" stroke="#78350f" stroke-width="2" />
          <path d="M 74 64 C 74 42 126 42 126 64 Z" fill="#b45309" stroke="#78350f" stroke-width="2" />
          <rect x="74" y="60" width="52" height="4.5" fill="#451a03" />
          <circle cx="86" cy="52" r="2.0" fill="#ffffff" opacity="0.8" />
        </g>
      `;
    } else if (hatId === 'hat-wizard') {
      hatMarkup = `
        <!-- Wizard Hat -->
        <g filter="url(#mf-shadow)">
          <ellipse cx="100" cy="74" rx="40" ry="8" fill="#4338ca" stroke="#312e81" stroke-width="2" />
          <path d="M 76 72 Q 100 20 120 18 Q 110 45 124 72 Z" fill="#4f46e5" stroke="#3730a3" stroke-width="2" />
          <polygon points="98,40 100,44 104,44 101,47 102,51 98,48 94,51 95,47 92,44 96,44" fill="#facc15" />
        </g>
      `;
    } else if (hatId === 'hat-scholar') {
      hatMarkup = `
        <!-- Scholar Cap -->
        <g filter="url(#mf-shadow)">
          <polygon points="100,50 140,64 100,74 60,64" fill="#0f172a" stroke="#334155" stroke-width="2" />
          <rect x="80" y="70" width="40" height="10" rx="3" fill="#1e293b" />
          <line x1="100" y1="62" x2="132" y2="78" stroke="#facc15" stroke-width="2" />
          <circle cx="132" cy="79" r="2.5" fill="#facc15" />
        </g>
      `;
    } else if (hatId === 'hat-bow') {
      hatMarkup = `
        <!-- Cute Ribbon Bow -->
        <g filter="url(#mf-shadow)" transform="translate(122, 60) rotate(15)">
          <polygon points="0,0 -12,-8 -12,8" fill="#f472b6" stroke="#db2777" stroke-width="1.5" />
          <polygon points="0,0 12,-8 12,8" fill="#f472b6" stroke="#db2777" stroke-width="1.5" />
          <circle cx="0" cy="0" r="3.5" fill="#fbcfe8" stroke="#db2777" stroke-width="1.5" />
        </g>
      `;
    } else if (hatId === 'hat-star-clip') {
      hatMarkup = `
        <!-- Star Clip -->
        <g filter="url(#mf-shadow)" transform="translate(74, 64)">
          <polygon points="0,-8 2,-2 8,-2 3,2 5,8 0,4 -5,8 -3,2 -8,-2 -2,-2" fill="#facc15" stroke="#ca8a04" stroke-width="1.2" />
        </g>
      `;
    } else if (hatId === 'hat-flower') {
      hatMarkup = `
        <!-- Blossom Flower -->
        <g filter="url(#mf-shadow)" transform="translate(72, 62)">
          <circle cx="0" cy="-6" r="4.5" fill="#fbcfe8" />
          <circle cx="6" cy="-2" r="4.5" fill="#fbcfe8" />
          <circle cx="4" cy="5" r="4.5" fill="#fbcfe8" />
          <circle cx="-4" cy="5" r="4.5" fill="#fbcfe8" />
          <circle cx="-6" cy="-2" r="4.5" fill="#fbcfe8" />
          <circle cx="0" cy="0" r="3" fill="#fde047" stroke="#eab308" stroke-width="1" />
        </g>
      `;
    } else if (hatId === 'hat-headband') {
      hatMarkup = `
        <!-- Hero Headband -->
        <g filter="url(#mf-shadow)">
          <path d="M 68 84 Q 100 76 132 84" stroke="#dc2626" stroke-width="5" stroke-linecap="round" fill="none" />
          <circle cx="100" cy="78" r="3.5" fill="#facc15" stroke="#ca8a04" stroke-width="1" />
        </g>
      `;
    }

    // Glasses
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
        <!-- Detective Goggles -->
        <g filter="url(#mf-shadow)">
          <circle cx="82" cy="116" r="13" fill="#0284c7" stroke="#92400e" stroke-width="4" opacity="0.85" />
          <circle cx="118" cy="116" r="13" fill="#0284c7" stroke="#92400e" stroke-width="4" opacity="0.85" />
          <line x1="95" y1="116" x2="105" y2="116" stroke="#78350f" stroke-width="5" />
          <line x1="58" y1="116" x2="69" y2="116" stroke="#78350f" stroke-width="4" />
          <line x1="131" y1="116" x2="142" y2="116" stroke="#78350f" stroke-width="4" />
        </g>
      `;
    }

    // Handheld & Special Accessories & Neckwear
    if (accId === 'neck-star') {
      accessoryMarkup += `
        <!-- Star Necklace -->
        <g filter="url(#mf-shadow)">
          <path d="M 86 122 Q 100 134 114 122" stroke="#ca8a04" stroke-width="1.8" fill="none" />
          <polygon points="100,132 101.5,136 106,136 102.5,138.5 104,143 100,140 96,143 97.5,138.5 94,136 98.5,136" fill="#facc15" stroke="#ca8a04" stroke-width="0.8" />
        </g>
      `;
    } else if (accId === 'neck-medal') {
      accessoryMarkup += `
        <!-- Adventure Medal -->
        <g filter="url(#mf-shadow)">
          <polygon points="96,122 100,132 104,122" fill="#2563eb" />
          <circle cx="100" cy="136" r="6" fill="#d97706" stroke="#78350f" stroke-width="1.5" />
          <circle cx="100" cy="136" r="3" fill="#facc15" />
        </g>
      `;
    } else if (accId === 'neck-pendant') {
      accessoryMarkup += `
        <!-- Magic Pendant -->
        <g filter="url(#mf-shadow)">
          <path d="M 88 122 Q 100 132 112 122" stroke="#94a3b8" stroke-width="1.8" fill="none" />
          <polygon points="100,130 106,137 100,144 94,137" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5" filter="url(#mf-glow)" />
        </g>
      `;
    } else if (accId === 'neck-badge') {
      accessoryMarkup += `
        <!-- Academy Crest Badge -->
        <g filter="url(#mf-shadow)">
          <polygon points="95,124 105,124 105,132 100,136 95,132" fill="#eab308" stroke="#a16207" stroke-width="1.5" />
        </g>
      `;
    } else if (accId === 'acc-microphone') {
      accessoryMarkup += `
        <!-- Golden Microphone -->
        <g filter="url(#mf-shadow)" transform="translate(138, 122) rotate(-15)">
          <rect x="0" y="14" width="8" height="26" rx="2" fill="#475569" stroke="#1e293b" stroke-width="1.5" />
          <ellipse cx="4" cy="8" rx="7" ry="9" fill="url(#mg-gold-crown)" stroke="#a16207" stroke-width="2" />
          <line x1="-3" y1="8" x2="11" y2="8" stroke="#ca8a04" stroke-width="1.2" />
          <line x1="4" y1="0" x2="4" y2="16" stroke="#ca8a04" stroke-width="1.2" />
        </g>
      `;
    } else if (accId === 'acc-book') {
      accessoryMarkup += `
        <!-- Adventure Spellbook -->
        <g filter="url(#mf-shadow)" transform="translate(42, 130) rotate(15)">
          <rect x="0" y="0" width="22" height="28" rx="3" fill="#dc2626" stroke="#991b1b" stroke-width="2" />
          <rect x="4" y="2" width="16" height="24" rx="2" fill="#fef2f2" />
          <line x1="6" y1="8" x2="18" y2="8" stroke="#b91c1c" stroke-width="1.5" />
          <line x1="6" y1="14" x2="18" y2="14" stroke="#b91c1c" stroke-width="1.5" />
          <line x1="6" y1="20" x2="14" y2="20" stroke="#b91c1c" stroke-width="1.5" />
        </g>
      `;
    } else if (accId === 'acc-wand') {
      accessoryMarkup += `
        <!-- Magic Wand -->
        <g filter="url(#mf-shadow)" transform="translate(142, 116) rotate(-25)">
          <rect x="2" y="10" width="4" height="28" rx="2" fill="#78350f" stroke="#451a03" stroke-width="1" />
          <polygon points="4,2 6,7 11,7 7,10 9,15 4,12 -1,15 1,10 -3,7 2,7" fill="#facc15" stroke="#ca8a04" stroke-width="1" filter="url(#mf-glow)" />
        </g>
      `;
    } else if (accId === 'acc-compass') {
      accessoryMarkup += `
        <!-- Explorer Compass -->
        <g filter="url(#mf-shadow)" transform="translate(40, 135)">
          <circle cx="10" cy="10" r="10" fill="#d97706" stroke="#78350f" stroke-width="1.5" />
          <circle cx="10" cy="10" r="7.5" fill="#fef3c7" />
          <polygon points="10,4 12,10 10,12 8,10" fill="#dc2626" />
          <polygon points="10,16 12,10 10,8 8,10" fill="#475569" />
        </g>
      `;
    } else if (accId === 'acc-trophy') {
      accessoryMarkup += `
        <!-- Golden Trophy -->
        <g filter="url(#mf-shadow)" transform="translate(138, 118)">
          <path d="M 4 2 L 18 2 L 16 14 Q 11 20 6 14 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1.5" />
          <rect x="9" y="16" width="4" height="6" fill="#ca8a04" />
          <rect x="5" y="22" width="12" height="4" rx="1" fill="#78350f" />
        </g>
      `;
    } else if (accId === 'acc-floating-stars') {
      accessoryMarkup += `
        <!-- Floating Stars -->
        <g filter="url(#mf-glow)">
          <polygon points="45,60 46.5,63 50,63 47,65 48,68 45,66 42,68 43,65 40,63 43.5,63" fill="#facc15" />
          <polygon points="155,55 156.5,58 160,58 157,60 158,63 155,61 152,63 153,60 150,58 153.5,58" fill="#facc15" />
          <polygon points="100,20 102,24 107,24 103,27 105,32 100,29 95,32 97,27 93,24 98,24" fill="#fde047" />
        </g>
      `;
    } else if (accId === 'acc-companion') {
      accessoryMarkup += `
        <!-- Tiny Sprite Companion -->
        <g filter="url(#mf-glow)" transform="translate(150, 75)">
          <circle cx="10" cy="10" r="7" fill="#38bdf8" stroke="#0284c7" stroke-width="1.2" />
          <ellipse cx="6" cy="7" rx="6" ry="3" transform="rotate(-30, 6, 7)" fill="#bae6fd" opacity="0.8" />
          <ellipse cx="14" cy="7" rx="6" ry="3" transform="rotate(30, 14, 7)" fill="#bae6fd" opacity="0.8" />
          <circle cx="8" cy="10" r="1.2" fill="#0f172a" />
          <circle cx="12" cy="10" r="1.2" fill="#0f172a" />
          <polygon points="9.5,12 10.5,12 10,13.5" fill="#f97316" />
        </g>
      `;
    } else if (accId === 'acc-confetti') {
      accessoryMarkup += `
        <!-- Celebration Confetti -->
        <g opacity="0.85">
          <rect x="40" y="55" width="4" height="8" transform="rotate(25, 40, 55)" fill="#f43f5e" />
          <rect x="150" y="60" width="4" height="8" transform="rotate(-35, 150, 60)" fill="#3b82f6" />
          <circle cx="48" cy="85" r="2.5" fill="#facc15" />
          <circle cx="158" cy="90" r="2.5" fill="#10b981" />
          <rect x="95" y="24" width="3.5" height="7" transform="rotate(15, 95, 24)" fill="#a855f7" />
        </g>
      `;
    }

    return `
      ${hatMarkup}
      ${glassesMarkup}
      ${accessoryMarkup}
    `;
  }

  /**
   * Generates a high-resolution, crisp SVG thumbnail for an item in the Customizer cards
   * Matches the visual quality in media_1789159508053.png
   * @param {Object} item - Item object from DEFAULT_MONSTER_ITEMS or draft
   * @param {Object} [options] - Rendering options (size, activeColor)
   * @returns {string} SVG HTML string
   */
  function renderMonsterItemThumbnail(item, options = {}) {
    if (!item) return '';
    const size = options.size || 56;
    const colorKey = options.colorKey || 'blue';
    const palette = MONSTER_PALETTES[colorKey] || MONSTER_PALETTES.blue;

    if (item.isNone || item.id.endsWith('-none')) {
      return `
        <svg viewBox="0 0 56 56" width="${size}" height="${size}" class="monster-card-thumb-svg">
          <circle cx="28" cy="28" r="18" fill="none" stroke="#cbd5e1" stroke-width="2.5" />
          <line x1="15" y1="15" x2="41" y2="41" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round" />
        </svg>
      `;
    }

    const cat = item.category || 'features';
    let inner = '';

    if (cat === 'horns') {
      // Pair of horns rendered side-by-side matching media_1789159508053.png!
      if (item.id === 'horns-ears') {
        inner = `
          <ellipse cx="18" cy="28" rx="8" ry="15" transform="rotate(-20, 18, 28)" fill="${palette.primary}" stroke="${palette.primaryDark}" stroke-width="2" />
          <ellipse cx="18" cy="28" rx="4.5" ry="9" transform="rotate(-20, 18, 28)" fill="${palette.purple || '#c084fc'}" opacity="0.75" />
          <ellipse cx="38" cy="28" rx="8" ry="15" transform="rotate(20, 38, 28)" fill="${palette.primary}" stroke="${palette.primaryDark}" stroke-width="2" />
          <ellipse cx="38" cy="28" rx="4.5" ry="9" transform="rotate(20, 38, 28)" fill="${palette.purple || '#c084fc'}" opacity="0.75" />
        `;
      } else if (item.id === 'horns-small' || item.id === 'horns-nub') {
        inner = `
          <path d="M 16 38 Q 12 24 22 14 Q 26 26 24 38 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
          <path d="M 40 38 Q 44 24 34 14 Q 30 26 32 38 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
        `;
      } else if (item.id === 'horns-curved') {
        inner = `
          <path d="M 18 36 C 8 26 6 18 16 16 C 24 22 22 28 24 36 Z" fill="#f97316" stroke="#c2410c" stroke-width="2" />
          <path d="M 38 36 C 48 26 50 18 40 16 C 32 22 34 28 32 36 Z" fill="#f97316" stroke="#c2410c" stroke-width="2" />
        `;
      } else if (item.id === 'horns-crystal') {
        inner = `
          <path d="M 16 38 L 10 14 L 22 20 Z" fill="#c084fc" stroke="#7e22ce" stroke-width="2" />
          <path d="M 40 38 L 46 14 L 34 20 Z" fill="#c084fc" stroke="#7e22ce" stroke-width="2" />
        `;
      } else if (item.id === 'horns-gold') {
        inner = `
          <path d="M 16 38 C 8 20 14 12 22 14 Q 24 26 24 38 Z" fill="#eab308" stroke="#a16207" stroke-width="2" />
          <path d="M 40 38 C 48 20 42 12 34 14 Q 32 26 32 38 Z" fill="#eab308" stroke="#a16207" stroke-width="2" />
        `;
      } else if (item.id === 'horns-nature') {
        inner = `
          <path d="M 16 38 C 10 24 12 16 22 14 C 26 24 24 32 24 38 Z" fill="#22c55e" stroke="#15803d" stroke-width="2" />
          <path d="M 40 38 C 46 24 44 16 34 14 C 30 24 32 32 32 38 Z" fill="#22c55e" stroke="#15803d" stroke-width="2" />
        `;
      } else if (item.id === 'horns-star') {
        inner = `
          <polygon points="18,12 20,18 26,18 21,22 23,28 18,24 13,28 15,22 10,18 16,18" fill="#facc15" stroke="#ca8a04" stroke-width="1.5" />
          <polygon points="38,12 40,18 46,18 41,22 43,28 38,24 33,28 35,22 30,18 36,18" fill="#facc15" stroke="#ca8a04" stroke-width="1.5" />
        `;
      } else if (item.id === 'horns-ice') {
        inner = `
          <path d="M 16 38 L 12 12 L 24 22 Z" fill="#7dd3fc" stroke="#0284c7" stroke-width="2" />
          <path d="M 40 38 L 44 12 L 32 22 Z" fill="#7dd3fc" stroke="#0284c7" stroke-width="2" />
        `;
      } else if (item.id === 'horns-flame') {
        inner = `
          <path d="M 16 38 Q 6 22 16 12 Q 24 22 22 38 Z" fill="#f97316" stroke="#b91c1c" stroke-width="2" />
          <path d="M 40 38 Q 50 22 40 12 Q 32 22 34 38 Z" fill="#f97316" stroke="#b91c1c" stroke-width="2" />
        `;
      }
    } else if (cat === 'eyes') {
      // Two expressive eyes with blush cheeks
      if (item.id === 'eyes-wink' || item.id === 'eyes-curious') {
        inner = `
          <path d="M 12 28 Q 19 21 26 28" stroke="#0f172a" stroke-width="3" stroke-linecap="round" fill="none" />
          <ellipse cx="37" cy="28" rx="8" ry="11" fill="#1e1b4b" />
          <circle cx="35" cy="25" r="3.5" fill="#ffffff" />
          <ellipse cx="14" cy="38" rx="5" ry="3" fill="#f472b6" opacity="0.6" />
          <ellipse cx="42" cy="38" rx="5" ry="3" fill="#f472b6" opacity="0.6" />
        `;
      } else if (item.id === 'eyes-happy') {
        inner = `
          <path d="M 13 28 Q 20 18 27 28" stroke="#0f172a" stroke-width="3.2" stroke-linecap="round" fill="none" />
          <path d="M 31 28 Q 38 18 45 28" stroke="#0f172a" stroke-width="3.2" stroke-linecap="round" fill="none" />
          <ellipse cx="15" cy="37" rx="5" ry="3" fill="#f472b6" opacity="0.6" />
          <ellipse cx="43" cy="37" rx="5" ry="3" fill="#f472b6" opacity="0.6" />
        `;
      } else if (item.id === 'eyes-brave') {
        inner = `
          <line x1="12" y1="18" x2="27" y2="22" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" />
          <line x1="44" y1="18" x2="29" y2="22" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" />
          <ellipse cx="19" cy="29" rx="7" ry="9" fill="#1e1b4b" />
          <circle cx="17" cy="27" r="2.8" fill="#ffffff" />
          <ellipse cx="37" cy="29" rx="7" ry="9" fill="#1e1b4b" />
          <circle cx="35" cy="27" r="2.8" fill="#ffffff" />
        `;
      } else if (item.id === 'eyes-sleepy') {
        inner = `
          <path d="M 13 26 Q 20 34 27 26" stroke="#0f172a" stroke-width="3" stroke-linecap="round" fill="none" />
          <path d="M 31 26 Q 38 34 45 26" stroke="#0f172a" stroke-width="3" stroke-linecap="round" fill="none" />
          <ellipse cx="15" cy="36" rx="5" ry="3" fill="#f472b6" opacity="0.6" />
          <ellipse cx="43" cy="36" rx="5" ry="3" fill="#f472b6" opacity="0.6" />
        `;
      } else if (item.id === 'eyes-star') {
        inner = `
          <ellipse cx="19" cy="28" rx="8" ry="11" fill="#1e1b4b" />
          <polygon points="19,23 20.5,26 24,26 21,28 22,31 19,29 16,31 17,28 14,26 17.5,26" fill="#facc15" />
          <ellipse cx="37" cy="28" rx="8" ry="11" fill="#1e1b4b" />
          <polygon points="37,23 38.5,26 42,26 39,28 40,31 37,29 34,31 35,28 32,26 35.5,26" fill="#facc15" />
        `;
      } else if (item.id === 'eyes-dragon') {
        inner = `
          <ellipse cx="19" cy="28" rx="8" ry="11" fill="#eab308" stroke="#ca8a04" stroke-width="1.2" />
          <ellipse cx="19" cy="28" rx="2" ry="7" fill="#0f172a" />
          <ellipse cx="37" cy="28" rx="8" ry="11" fill="#eab308" stroke="#ca8a04" stroke-width="1.2" />
          <ellipse cx="37" cy="28" rx="2" ry="7" fill="#0f172a" />
        `;
      } else if (item.id === 'eyes-galaxy') {
        inner = `
          <ellipse cx="19" cy="28" rx="8" ry="11" fill="#312e81" stroke="#8b5cf6" stroke-width="1.2" />
          <circle cx="17" cy="25" r="3.2" fill="#ffffff" />
          <circle cx="21" cy="31" r="1.5" fill="#38bdf8" />
          <ellipse cx="37" cy="28" rx="8" ry="11" fill="#312e81" stroke="#8b5cf6" stroke-width="1.2" />
          <circle cx="35" cy="25" r="3.2" fill="#ffffff" />
          <circle cx="39" cy="31" r="1.5" fill="#38bdf8" />
        `;
      } else {
        // Anime Sparkle
        inner = `
          <ellipse cx="19" cy="28" rx="8" ry="11" fill="#1e1b4b" stroke="#38bdf8" stroke-width="0.8" />
          <circle cx="17" cy="25" r="3.5" fill="#ffffff" />
          <circle cx="21" cy="31" r="1.6" fill="#ffffff" />
          <ellipse cx="37" cy="28" rx="8" ry="11" fill="#1e1b4b" stroke="#38bdf8" stroke-width="0.8" />
          <circle cx="35" cy="25" r="3.5" fill="#ffffff" />
          <circle cx="39" cy="31" r="1.6" fill="#ffffff" />
          <ellipse cx="13" cy="38" rx="5" ry="3" fill="#f472b6" opacity="0.6" />
          <ellipse cx="43" cy="38" rx="5" ry="3" fill="#f472b6" opacity="0.6" />
        `;
      }
    } else if (cat === 'mouth') {
      // Cute mouth expressions
      if (item.id === 'mouth-cheer' || item.id === 'mouth-open') {
        inner = `
          <path d="M 18 24 Q 28 42 38 24 Z" fill="#e11d48" stroke="#9f1239" stroke-width="2" />
          <path d="M 23 32 Q 28 30 33 32" stroke="#fda4af" stroke-width="3" stroke-linecap="round" fill="none" />
        `;
      } else if (item.id === 'mouth-toothy') {
        inner = `
          <path d="M 16 26 Q 28 38 40 26" fill="#0f172a" stroke="#0f172a" stroke-width="2" />
          <polygon points="21,26 23,31 25,26" fill="#ffffff" />
          <polygon points="31,26 33,31 35,26" fill="#ffffff" />
        `;
      } else if (item.id === 'mouth-tiny') {
        inner = `
          <path d="M 22 28 Q 28 33 34 28" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" />
        `;
      } else if (item.id === 'mouth-excited') {
        inner = `
          <path d="M 17 23 Q 28 41 39 23 Z" fill="#f43f5e" stroke="#be123c" stroke-width="2" />
          <ellipse cx="28" cy="33" rx="6" ry="4" fill="#fbcfe8" />
        `;
      } else if (item.id === 'mouth-brave') {
        inner = `
          <path d="M 18 30 Q 28 28 38 24" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" />
        `;
      } else if (item.id === 'mouth-laughing') {
        inner = `
          <path d="M 18 26 Q 28 38 38 26" fill="#e11d48" stroke="#0f172a" stroke-width="2.5" />
        `;
      } else if (item.id === 'mouth-surprise') {
        inner = `
          <ellipse cx="28" cy="28" rx="6" ry="8" fill="#be123c" stroke="#881337" stroke-width="2" />
        `;
      } else {
        inner = `
          <path d="M 18 26 Q 28 35 38 26" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" />
        `;
      }
    } else if (cat === 'clothing') {
      // Mini torso outfit
      if (item.id === 'clothing-vest') {
        inner = `
          <rect x="14" y="16" width="28" height="26" rx="4" fill="#78350f" stroke="#451a03" stroke-width="2" />
          <polygon points="28,16 22,24 34,24" fill="#fef3c7" />
          <circle cx="28" cy="30" r="2" fill="#facc15" />
        `;
      } else if (item.id === 'clothing-cape') {
        inner = `
          <path d="M 16 16 Q 28 20 40 16 L 44 42 Q 28 36 12 42 Z" fill="#dc2626" stroke="#991b1b" stroke-width="2" />
          <circle cx="28" cy="18" r="3.5" fill="#facc15" />
        `;
      } else if (item.id === 'clothing-adv-jacket') {
        inner = `
          <rect x="14" y="16" width="28" height="26" rx="4" fill="#92400e" stroke="#78350f" stroke-width="2" />
          <ellipse cx="28" cy="18" rx="12" ry="5" fill="#fef3c7" />
          <line x1="28" y1="22" x2="28" y2="42" stroke="#facc15" stroke-width="2" />
        `;
      } else if (item.id === 'clothing-travel-coat') {
        inner = `
          <path d="M 14 16 L 42 16 L 45 44 L 11 44 Z" fill="#065f46" stroke="#064e3b" stroke-width="2" />
          <circle cx="23" cy="26" r="2" fill="#facc15" />
          <circle cx="33" cy="26" r="2" fill="#facc15" />
          <circle cx="23" cy="34" r="2" fill="#facc15" />
          <circle cx="33" cy="34" r="2" fill="#facc15" />
        `;
      } else if (item.id === 'clothing-scarf') {
        inner = `
          <ellipse cx="28" cy="22" rx="16" ry="6" fill="#2563eb" stroke="#1e40af" stroke-width="2" />
          <path d="M 22 24 L 20 42 L 28 42 L 26 24 Z" fill="#2563eb" stroke="#1e40af" stroke-width="1.5" />
          <rect x="20" y="28" width="7" height="3" fill="#facc15" />
          <rect x="20" y="34" width="7" height="3" fill="#facc15" />
        `;
      } else if (item.id === 'clothing-hoodie') {
        inner = `
          <rect x="14" y="16" width="28" height="26" rx="5" fill="#0d9488" stroke="#115e59" stroke-width="2" />
          <rect x="19" y="28" width="18" height="10" rx="3" fill="#14b8a6" />
        `;
      } else if (item.id === 'clothing-school-jacket') {
        inner = `
          <rect x="14" y="16" width="28" height="26" rx="4" fill="#1e3a8a" stroke="#172554" stroke-width="2" />
          <text x="23" y="32" font-size="14" font-weight="900" fill="#facc15">A</text>
        `;
      } else if (item.id === 'clothing-scholar') {
        inner = `
          <rect x="14" y="16" width="28" height="26" rx="4" fill="#334155" stroke="#1e293b" stroke-width="2" />
          <polygon points="28,16 23,24 33,24" fill="#ffffff" />
          <polygon points="27,24 29,24 30,34 28,36 26,34" fill="#dc2626" />
        `;
      } else if (item.id === 'clothing-royal-robe') {
        inner = `
          <path d="M 13 16 L 43 16 L 46 44 L 10 44 Z" fill="#991b1b" stroke="#7f1d1d" stroke-width="2" />
          <ellipse cx="28" cy="18" rx="14" ry="5" fill="#ffffff" />
          <circle cx="28" cy="24" r="2" fill="#facc15" />
        `;
      } else if (item.id === 'clothing-robe') {
        inner = `
          <path d="M 14 16 L 42 16 L 45 44 L 11 44 Z" fill="#4338ca" stroke="#312e81" stroke-width="2" />
          <polygon points="28,24 29.5,27 33,27 30,29 31,32 28,30 25,32 26,29 23,27 26.5,27" fill="#facc15" />
        `;
      } else if (item.id === 'clothing-space') {
        inner = `
          <rect x="14" y="16" width="28" height="26" rx="5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" />
          <ellipse cx="28" cy="18" rx="10" ry="4" fill="#38bdf8" />
          <rect x="22" y="26" width="12" height="8" rx="2" fill="#0f172a" />
        `;
      } else if (item.id === 'clothing-hero') {
        inner = `
          <rect x="14" y="16" width="28" height="26" rx="4" fill="#2563eb" stroke="#1d4ed8" stroke-width="2" />
          <polygon points="29,20 23,28 28,28 27,36 33,27 28,27" fill="#facc15" />
        `;
      } else if (item.id === 'clothing-winter') {
        inner = `
          <rect x="14" y="16" width="28" height="26" rx="5" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
          <ellipse cx="28" cy="18" rx="12" ry="5" fill="#ffffff" />
          <line x1="16" y1="26" x2="40" y2="26" stroke="#0284c7" stroke-width="1.5" />
          <line x1="16" y1="34" x2="40" y2="34" stroke="#0284c7" stroke-width="1.5" />
        </g>
        `;
      } else if (item.id === 'clothing-dragon-armor') {
        inner = `
          <rect x="14" y="16" width="28" height="26" rx="4" fill="#047857" stroke="#064e3b" stroke-width="2" />
          <polygon points="28,22 34,28 28,34 22,28" fill="#059669" />
          <polygon points="28,25 31,28 28,31 25,28" fill="#ef4444" />
        `;
      } else if (item.id === 'clothing-knight-armor') {
        inner = `
          <rect x="14" y="16" width="28" height="26" rx="4" fill="#94a3b8" stroke="#475569" stroke-width="2" />
          <line x1="28" y1="18" x2="28" y2="40" stroke="#2563eb" stroke-width="3" />
          <line x1="20" y1="26" x2="36" y2="26" stroke="#2563eb" stroke-width="3" />
        `;
      } else if (item.id === 'clothing-magic-robe') {
        inner = `
          <path d="M 14 16 L 42 16 L 45 44 L 11 44 Z" fill="#a855f7" stroke="#7e22ce" stroke-width="2" />
          <ellipse cx="28" cy="30" rx="12" ry="3" fill="#facc15" />
        `;
      } else if (item.id === 'clothing-royal') {
        inner = `
          <rect x="14" y="16" width="28" height="26" rx="4" fill="#6b21a8" stroke="#4c1d95" stroke-width="2" />
          <line x1="16" y1="18" x2="40" y2="40" stroke="#facc15" stroke-width="3" />
          <circle cx="28" cy="29" r="3" fill="#eab308" />
        `;
      }
    } else if (cat === 'wings') {
      if (item.id === 'wings-dragon') {
        inner = `
          <path d="M 18 36 C 6 22 2 32 8 44 C 14 40 20 44 24 48 Z" fill="#6b21a8" stroke="#4c1d95" stroke-width="2" />
          <path d="M 38 36 C 50 22 54 32 48 44 C 42 40 36 44 32 48 Z" fill="#6b21a8" stroke="#4c1d95" stroke-width="2" />
        `;
      } else if (item.id === 'wings-celestial') {
        inner = `
          <path d="M 18 34 C 4 14 2 28 8 44 C 16 40 20 44 24 48 Z" fill="#fde047" stroke="#ca8a04" stroke-width="2" />
          <path d="M 38 34 C 52 14 54 28 48 44 C 40 40 36 44 32 48 Z" fill="#fde047" stroke="#ca8a04" stroke-width="2" />
        `;
      } else if (item.id === 'wings-fairy') {
        inner = `
          <ellipse cx="18" cy="24" rx="8" ry="14" transform="rotate(-30, 18, 24)" fill="#86efac" stroke="#16a34a" stroke-width="1.5" />
          <ellipse cx="38" cy="24" rx="8" ry="14" transform="rotate(30, 38, 24)" fill="#86efac" stroke="#16a34a" stroke-width="1.5" />
        `;
      } else if (item.id === 'wings-bat') {
        inner = `
          <path d="M 18 36 C 6 24 2 34 8 44 C 14 40 20 44 24 48 Z" fill="#312e81" stroke="#1e1b4b" stroke-width="2" />
          <path d="M 38 36 C 50 24 54 34 48 44 C 42 40 36 44 32 48 Z" fill="#312e81" stroke="#1e1b4b" stroke-width="2" />
        `;
      } else {
        // Flutter wings
        inner = `
          <ellipse cx="18" cy="28" rx="7" ry="12" transform="rotate(-25, 18, 28)" fill="#bae6fd" stroke="#0284c7" stroke-width="1.8" />
          <ellipse cx="38" cy="28" rx="7" ry="12" transform="rotate(25, 38, 28)" fill="#bae6fd" stroke="#0284c7" stroke-width="1.8" />
        `;
      }
    } else if (cat === 'tail') {
      if (item.id === 'tail-dragon') {
        inner = `
          <path d="M 18 42 C 28 40 38 34 36 20 C 34 16 30 20 26 26 Z" fill="#047857" stroke="#064e3b" stroke-width="2.5" />
          <polygon points="36,20 40,16 38,24" fill="#10b981" />
        `;
      } else if (item.id === 'tail-flame') {
        inner = `
          <path d="M 20 42 C 28 38 36 30 32 18 Z" fill="#78350f" stroke="#451a03" stroke-width="2" />
          <polygon points="32,18 42,8 36,22" fill="#f97316" />
          <polygon points="36,22 46,14 38,26" fill="#ef4444" />
        `;
      } else if (item.id === 'tail-star') {
        inner = `
          <path d="M 20 42 C 28 38 36 30 32 20 Z" fill="${palette.primary}" stroke="${palette.primaryDark}" stroke-width="2" />
          <polygon points="36,12 38,17 43,17 39,20 41,25 36,22 31,25 33,20 29,17 34,17" fill="#facc15" stroke="#ca8a04" stroke-width="1.2" />
        `;
      } else if (item.id === 'tail-perky') {
        inner = `
          <path d="M 20 42 C 30 38 38 28 36 18 C 32 14 28 18 24 26 Z" fill="${palette.primary}" stroke="${palette.primaryDark}" stroke-width="2.4" />
          <ellipse cx="36" cy="18" rx="4" ry="4" fill="${palette.purple || '#c084fc'}" />
        `;
      } else {
        // Puff tail
        inner = `
          <circle cx="28" cy="28" r="14" fill="#e0f2fe" stroke="#0284c7" stroke-width="2.5" />
        `;
      }
    } else if (cat === 'hat') {
      if (item.id === 'hat-crown') {
        inner = `
          <polygon points="12,38 16,18 28,26 40,18 44,38" fill="#facc15" stroke="#ca8a04" stroke-width="2" />
          <rect x="11" y="36" width="34" height="5" rx="1" fill="#eab308" />
          <circle cx="28" cy="28" r="2.5" fill="#ef4444" />
        `;
      } else if (item.id === 'hat-explorer') {
        inner = `
          <ellipse cx="28" cy="34" rx="22" ry="6" fill="#d97706" stroke="#92400e" stroke-width="2" />
          <path d="M 16 32 C 16 18 40 18 40 32 Z" fill="#b45309" stroke="#78350f" stroke-width="2" />
        `;
      } else if (item.id === 'hat-scholar') {
        inner = `
          <polygon points="28,16 48,25 28,34 8,25" fill="#0f172a" stroke="#334155" stroke-width="2" />
          <rect x="18" y="30" width="20" height="7" rx="2" fill="#1e293b" />
          <line x1="28" y1="24" x2="44" y2="34" stroke="#facc15" stroke-width="1.8" />
        `;
      } else if (item.id === 'hat-wizard') {
        inner = `
          <ellipse cx="28" cy="38" rx="20" ry="5" fill="#4338ca" stroke="#312e81" stroke-width="2" />
          <path d="M 16 36 Q 28 8 38 6 Q 32 22 40 36 Z" fill="#4f46e5" stroke="#3730a3" stroke-width="2" />
        `;
      } else if (item.id === 'hat-bow') {
        inner = `
          <polygon points="28,28 16,20 16,36" fill="#f472b6" stroke="#db2777" stroke-width="1.5" />
          <polygon points="28,28 40,20 40,36" fill="#f472b6" stroke="#db2777" stroke-width="1.5" />
          <circle cx="28" cy="28" r="3.5" fill="#fbcfe8" />
        `;
      } else if (item.id === 'hat-star-clip') {
        inner = `
          <polygon points="28,14 31,21 38,21 32,25 34,32 28,28 22,32 24,25 18,21 25,21" fill="#facc15" stroke="#ca8a04" stroke-width="1.5" />
        `;
      } else if (item.id === 'hat-flower') {
        inner = `
          <circle cx="28" cy="22" r="5" fill="#fbcfe8" />
          <circle cx="34" cy="26" r="5" fill="#fbcfe8" />
          <circle cx="32" cy="33" r="5" fill="#fbcfe8" />
          <circle cx="24" cy="33" r="5" fill="#fbcfe8" />
          <circle cx="22" cy="26" r="5" fill="#fbcfe8" />
          <circle cx="28" cy="28" r="3.5" fill="#fde047" />
        `;
      } else if (item.id === 'hat-headband') {
        inner = `
          <path d="M 10 32 Q 28 24 46 32" stroke="#dc2626" stroke-width="5" stroke-linecap="round" fill="none" />
          <circle cx="28" cy="26" r="3.5" fill="#facc15" />
        `;
      }
    } else if (cat === 'backpack') {
      inner = `
        <rect x="16" y="16" width="24" height="28" rx="4" fill="#92400e" stroke="#78350f" stroke-width="2" />
        <rect x="20" y="24" width="16" height="12" rx="2" fill="#b45309" />
        <circle cx="28" cy="30" r="2.5" fill="#facc15" />
      `;
    } else if (cat === 'aura') {
      // Glow and sparkles
      if (item.id === 'aura-flame') {
        inner = `
          <path d="M 14 44 Q 20 18 28 10 Q 36 18 42 44 Z" fill="#fb923c" opacity="0.85" />
          <path d="M 20 44 Q 24 26 28 18 Q 32 26 36 44 Z" fill="#facc15" />
        `;
      } else if (item.id === 'aura-ice') {
        inner = `
          <circle cx="28" cy="28" r="20" fill="none" stroke="#7dd3fc" stroke-width="2.5" stroke-dasharray="6 4" />
          <polygon points="28,12 32,20 28,28 24,20" fill="#38bdf8" />
        `;
      } else if (item.id === 'aura-rainbow') {
        inner = `
          <circle cx="28" cy="28" r="20" fill="none" stroke="url(#mg-rainbow-aura)" stroke-width="4.5" />
        `;
      } else if (item.id === 'aura-cosmic' || item.id === 'aura-galaxy') {
        inner = `
          <circle cx="28" cy="28" r="20" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="8 6" />
          <polygon points="28,8 30,13 35,13 31,16 33,21 28,18 23,21 25,16 21,13 26,13" fill="#facc15" />
        `;
      } else if (item.id === 'aura-lightning') {
        inner = `
          <path d="M 22 10 L 16 26 L 24 26 L 18 46" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" fill="none" />
          <path d="M 38 12 L 32 28 L 40 28 L 34 46" stroke="#facc15" stroke-width="3" stroke-linecap="round" fill="none" />
        `;
      } else if (item.id === 'aura-blossom') {
        inner = `
          <ellipse cx="18" cy="18" rx="6" ry="3.5" transform="rotate(25, 18, 18)" fill="#f472b6" />
          <ellipse cx="38" cy="18" rx="6" ry="3.5" transform="rotate(-30, 38, 18)" fill="#f472b6" />
          <ellipse cx="28" cy="38" rx="6" ry="3.5" transform="rotate(10, 28, 38)" fill="#ec4899" />
        `;
      } else if (item.id === 'aura-star') {
        inner = `
          <polygon points="28,10 30,16 36,16 31,19 33,25 28,22 23,25 25,19 20,16 26,16" fill="#facc15" />
          <polygon points="16,30 17.5,33 21,33 18,35 19,39 16,37 13,39 14,35 11,33 14.5,33" fill="#facc15" />
          <polygon points="40,30 41.5,33 45,33 42,35 43,39 40,37 37,39 38,35 35,33 38.5,33" fill="#facc15" />
        `;
      } else if (item.id === 'aura-dragon') {
        inner = `
          <path d="M 16 44 Q 12 20 28 10 Q 24 24 26 44 Z" fill="#ef4444" />
          <path d="M 40 44 Q 44 20 28 10 Q 32 24 30 44 Z" fill="#ef4444" />
          <circle cx="28" cy="18" r="4" fill="#facc15" />
        `;
      } else if (item.id === 'aura-royal') {
        inner = `
          <circle cx="28" cy="28" r="20" fill="none" stroke="#eab308" stroke-width="3" />
          <line x1="28" y1="4" x2="28" y2="10" stroke="#facc15" stroke-width="2.5" stroke-linecap="round" />
          <line x1="10" y1="16" x2="14" y2="20" stroke="#facc15" stroke-width="2.5" stroke-linecap="round" />
          <line x1="46" y1="16" x2="42" y2="20" stroke="#facc15" stroke-width="2.5" stroke-linecap="round" />
        `;
      } else {
        inner = `
          <circle cx="28" cy="28" r="20" fill="#fef08a" opacity="0.3" filter="url(#mf-glow)" />
          <polygon points="28,10 30,16 36,16 31,19 33,25 28,22 23,25 25,19 20,16 26,16" fill="#facc15" />
        `;
      }
    } else if (cat === 'background') {
      // Mini landscape window
      if (item.id === 'bg-castle') {
        inner = `
          <rect x="6" y="6" width="44" height="44" rx="8" fill="#fef3c7" />
          <rect x="14" y="24" width="10" height="22" fill="#cbd5e1" />
          <polygon points="12,24 19,14 26,24" fill="#ef4444" />
          <rect x="32" y="24" width="10" height="22" fill="#cbd5e1" />
          <polygon points="30,24 37,14 44,24" fill="#ef4444" />
        `;
      } else if (item.id === 'bg-forest') {
        inner = `
          <rect x="6" y="6" width="44" height="44" rx="8" fill="#064e3b" />
          <polygon points="14,44 22,22 30,44" fill="#047857" />
          <polygon points="26,44 36,26 46,44" fill="#059669" />
          <circle cx="20" cy="18" r="2" fill="#fef08a" />
        `;
      } else if (item.id === 'bg-volcano') {
        inner = `
          <rect x="6" y="6" width="44" height="44" rx="8" fill="#451a03" />
          <polygon points="12,46 28,18 44,46" fill="#78350f" />
          <circle cx="28" cy="16" r="3" fill="#f97316" />
        `;
      } else if (item.id === 'bg-beach') {
        inner = `
          <rect x="6" y="6" width="44" height="44" rx="8" fill="#38bdf8" />
          <rect x="6" y="34" width="44" height="16" fill="#fde68a" />
          <circle cx="38" cy="16" r="4" fill="#fbbf24" />
        `;
      } else if (item.id === 'bg-moonlit') {
        inner = `
          <rect x="6" y="6" width="44" height="44" rx="8" fill="#0f172a" />
          <path d="M 38 14 A 8 8 0 0 0 32 26 A 9 9 0 1 1 38 14 Z" fill="#fef08a" />
          <circle cx="16" cy="18" r="1" fill="#ffffff" />
        `;
      } else if (item.id === 'bg-winter') {
        inner = `
          <rect x="6" y="6" width="44" height="44" rx="8" fill="#e0f2fe" />
          <polygon points="16,42 22,26 28,42" fill="#0284c7" opacity="0.8" />
          <rect x="6" y="38" width="44" height="12" fill="#ffffff" />
        `;
      } else if (item.id === 'bg-cosmos') {
        inner = `
          <rect x="6" y="6" width="44" height="44" rx="8" fill="#090d16" />
          <circle cx="20" cy="24" r="6" fill="#8b5cf6" />
          <ellipse cx="20" cy="24" rx="10" ry="2.5" fill="none" stroke="#e9d5ff" stroke-width="1.2" transform="rotate(-20, 20, 24)" />
          <circle cx="38" cy="16" r="1.5" fill="#ffffff" />
        `;
      } else if (item.id === 'bg-rainbow') {
        inner = `
          <rect x="6" y="6" width="44" height="44" rx="8" fill="#e0f2fe" />
          <path d="M 10 38 A 20 16 0 0 1 46 38" stroke="url(#mg-rainbow-aura)" stroke-width="4" fill="none" />
          <rect x="6" y="36" width="44" height="14" fill="#86efac" />
        `;
      } else if (item.id === 'bg-cloud') {
        inner = `
          <rect x="6" y="6" width="44" height="44" rx="8" fill="#fdf4ff" />
          <circle cx="28" cy="18" r="6" fill="#fde047" />
          <circle cx="18" cy="38" r="9" fill="#fce7f3" />
          <circle cx="28" cy="36" r="10" fill="#fce7f3" />
          <circle cx="38" cy="38" r="9" fill="#fce7f3" />
        `;
      } else {
        inner = `
          <rect x="6" y="6" width="44" height="44" rx="8" fill="#f0fdf4" />
          <circle cx="28" cy="46" r="18" fill="#bbf7d0" />
          <circle cx="16" cy="16" r="4" fill="#fef08a" />
        `;
      }
    } else if (cat === 'body') {
      const swatchColors = {
        'body-blue': '#38bdf8',
        'body-pink': '#f472b6',
        'body-green': '#4ade80',
        'body-orange': '#fb923c',
        'body-purple': '#c084fc',
        'body-gold': '#facc15'
      };
      const fill = swatchColors[item.id] || '#38bdf8';
      inner = `
        <circle cx="28" cy="28" r="18" fill="${fill}" stroke="#ffffff" stroke-width="3" />
        <ellipse cx="28" cy="34" rx="10" ry="7" fill="#ffffff" opacity="0.6" />
      `;
    } else {
      // General accessory fallback: icon or symbol
      inner = `
        <text x="28" y="34" font-size="24" text-anchor="middle" dominant-baseline="middle">${item.icon || '✨'}</text>
      `;
    }

    return `
      <svg viewBox="0 0 56 56" width="${size}" height="${size}" class="monster-card-thumb-svg">
        ${inner}
      </svg>
    `.trim();
  }

  
  const STAGE_IMAGES = {
    egg: 'assets/monsters/stage-1-mystery-egg.png',
    cracking_egg: 'assets/monsters/stage-2-cracking-egg.png',
    baby: 'assets/monsters/stage-3-baby-monster.png',
    growing: 'assets/monsters/stage-4-growing-monster.png',
    adventurer: 'assets/monsters/stage-5-adventurer-monster.png',
    advanced: 'assets/monsters/stage-6-advanced-monster.png',
    ultimate: 'assets/monsters/stage-7-ultimate-monster.png'
  };

  function getMonsterStageImage(stageKey) {
    const key = normalizeStageKey(stageKey);
    return STAGE_IMAGES[key] || STAGE_IMAGES.baby;
  }

  function renderMonsterArtwork(options = {}) {
    const stage = normalizeStageKey(options.stage);
    const imgSrc = getMonsterStageImage(stage);
    const size = options.size || 160;
    const isRound = options.round !== false;
    const animated = options.animated !== false;
    const animClass = animated ? 'eaa-monster-artwork-anim' : '';

    return `
      <div class="eaa-monster-artwork-wrap ${animClass}" style="width:${size}px; height:${size}px; display:inline-flex; align-items:center; justify-content:center; position:relative; border-radius:${isRound ? '18px' : '10px'}; overflow:hidden; box-shadow:0 8px 25px rgba(0,0,0,0.3); background:#0f172a;">
        <img src="${imgSrc}" alt="${stage}" style="width:100%; height:100%; object-fit:cover; display:block;" />
      </div>
    `.trim();
  }

  function renderMonsterEvolutionStagesBanner() {
    const stages = [
      { level: 1, name: 'Mystery Egg', xp: '0 XP', sub: 'A new adventure begins...', stageKey: 'egg' },
      { level: 2, name: 'Cracking Egg', xp: '100 XP', sub: 'Life is waking up!', stageKey: 'cracking_egg' },
      { level: 3, name: 'Baby Monster', xp: '250 XP', sub: 'Small steps, big dreams!', stageKey: 'baby' },
      { level: 4, name: 'Growing Monster', xp: '500 XP', sub: 'Stronger every day!', stageKey: 'growing' },
      { level: 5, name: 'Adventurer Monster', xp: '1,000 XP', sub: 'Ready for bigger quests!', stageKey: 'adventurer' },
      { level: 6, name: 'Advanced Monster', xp: '2,000 XP', sub: 'New powers, new places!', stageKey: 'advanced' },
      { level: 7, name: 'Ultimate Monster', xp: '5,000 XP', sub: 'A true hero!', stageKey: 'ultimate' }
    ];

    return `
      <div class="monster-evolution-upgrade-banner" style="background:linear-gradient(180deg, #071328 0%, #0c1e3d 100%); border-radius:20px; padding:24px; color:#fff; box-shadow:0 12px 36px rgba(0,0,0,0.4); margin-bottom:24px; border:1px solid rgba(56,189,248,0.25);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; flex-wrap:wrap; gap:12px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:14px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:1.4rem;">👾</span>
              <h2 style="font-size:1.35rem; font-weight:900; margin:0; letter-spacing:0.02em; color:#fff;">Monster Evolution Upgrade (Visual Progression)</h2>
            </div>
            <p style="font-size:0.84rem; color:#94a3b8; margin:4px 0 0 0;">A real visual evolution, not just accessories. Monsters grow and change as students earn XP!</p>
          </div>
          <div style="font-size:0.75rem; color:#38bdf8; font-weight:800; letter-spacing:0.05em; text-transform:uppercase;">
            Same Spirit • Greater Growth • More Adventures • A Brighter You!
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:12px; align-items:stretch;">
          ${stages.map((st, idx) => `
            <div class="evolution-stage-card-premium" style="background:rgba(15,23,42,0.85); border:1.5px solid ${idx === 6 ? '#f59e0b' : 'rgba(56,189,248,0.3)'}; border-radius:14px; padding:12px 10px; display:flex; flex-direction:column; align-items:center; text-align:center; transition:transform 0.2s ease, box-shadow 0.2s ease; position:relative;">
              <div style="font-size:0.68rem; font-weight:800; color:#94a3b8; text-transform:uppercase; margin-bottom:2px;">Level ${st.level}</div>
              <div style="font-size:0.82rem; font-weight:900; color:#f8fafc; margin-bottom:8px; line-height:1.2;">${st.name}</div>
              
              <div style="width:100%; aspect-ratio:1; border-radius:10px; overflow:hidden; margin-bottom:8px; background:#020617; border:1px solid rgba(255,255,255,0.1); box-shadow:inset 0 2px 8px rgba(0,0,0,0.6);">
                <img src="${getMonsterStageImage(st.stageKey)}" alt="${st.name}" style="width:100%; height:100%; object-fit:cover; display:block;" />
              </div>

              <div style="font-size:0.78rem; font-weight:900; color:#fbbf24; background:rgba(245,158,11,0.15); border:1px solid rgba(245,158,11,0.4); padding:3px 10px; border-radius:12px; margin-bottom:6px; width:90%;">
                ${st.xp}
              </div>
              <div style="font-size:0.68rem; color:#cbd5e1; line-height:1.3; font-style:italic;">
                "${st.sub}"
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `.trim();
  }

  function getStageInfo(stageKey) {
    return STAGE_META[stageKey] || STAGE_META.baby;
  }

  function getBadgeColors(colorKey) {
    let key = String(colorKey || 'blue').toLowerCase().trim().replace(/^body-/, '');
    if (!MONSTER_PALETTES[key]) key = 'blue';
    const palette = MONSTER_PALETTES[key];
    return {
      glow: palette.primaryLight,
      primary: palette.primary,
      dark: palette.primaryDark,
      belly: palette.belly,
      shadow: palette.shadow,
      themeClass: 'theme-' + key
    };
  }

  root.MonsterRenderer = {
    getMonsterStageImage: getMonsterStageImage,
    renderMonsterArtwork: renderMonsterArtwork,
    renderMonsterEvolutionStagesBanner: renderMonsterEvolutionStagesBanner,
    renderMonsterSVG: renderMonsterSVG,
    renderMonsterViewport: renderMonsterImageViewport,
    renderMonsterImageViewport: renderMonsterImageViewport,
    renderMonsterItemThumbnail: renderMonsterItemThumbnail,
    getStageInfo: getStageInfo,
    getBadgeColors: getBadgeColors,
    palettes: MONSTER_PALETTES,
    stages: STAGE_META
  };

  root.renderMonsterSVG = renderMonsterSVG;
  root.renderMonsterViewport = renderMonsterImageViewport;
  root.renderMonsterImageViewport = renderMonsterImageViewport;
  root.renderMonsterItemThumbnail = renderMonsterItemThumbnail;
  root.getStageInfo = getStageInfo;
  root.getBadgeColors = getBadgeColors;
  root.getMonsterStageImage = getMonsterStageImage;
  root.renderMonsterArtwork = renderMonsterArtwork;
  root.renderMonsterEvolutionStagesBanner = renderMonsterEvolutionStagesBanner;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.MonsterRenderer;
  }

})(typeof window !== 'undefined' ? window : global);

