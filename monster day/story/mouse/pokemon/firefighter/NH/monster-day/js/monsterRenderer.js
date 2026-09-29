/**
 * monsterRenderer.js - Anchor-Based Procedural Vector Character SVG Renderer
 * "Build Your Own Monster!"
 * Features structural anchors for all body types, layered assembly, and zero floating parts.
 */

class MonsterRenderer {
  constructor() {
    this.palettes = {
      purple: { main: '#a855f7', belly: '#f3e8ff', dark: '#6b21a8', stroke: '#3b0764', highlight: '#c084fc' },
      green:  { main: '#22c55e', belly: '#dcfce7', dark: '#15803d', stroke: '#14532d', highlight: '#4ade80' },
      blue:   { main: '#0ea5e9', belly: '#e0f2fe', dark: '#0369a1', stroke: '#0c4a6e', highlight: '#38bdf8' },
      red:    { main: '#f43f5e', belly: '#ffe4e6', dark: '#be123c', stroke: '#881337', highlight: '#fb7185' },
      orange: { main: '#f97316', belly: '#ffedd5', dark: '#c2410c', stroke: '#7c2d12', highlight: '#fb923c' },
      yellow: { main: '#eab308', belly: '#fef9c3', dark: '#a16207', stroke: '#713f12', highlight: '#fde047' },
      pink:   { main: '#ec4899', belly: '#fce7f3', dark: '#be185d', stroke: '#831843', highlight: '#f472b6' },
      black:  { main: '#334155', belly: '#94a3b8', dark: '#0f172a', stroke: '#020617', highlight: '#64748b' },
      white:  { main: '#f8fafc', belly: '#cbd5e1', dark: '#94a3b8', stroke: '#334155', highlight: '#ffffff' }
    };

    this.clothingColors = {
      blue:   '#2563eb',
      red:    '#dc2626',
      green:  '#16a34a',
      yellow: '#eab308',
      purple: '#9333ea',
      orange: '#ea580c',
      pink:   '#db2777',
      black:  '#1e293b',
      white:  '#f8fafc'
    };

    // Predefined Structural Anchors per Body Shape
    this.bodyAnchors = {
      round: {
        face: { cx: 200, eyeY: 146, noseY: 172, mouthY: 208, width: 88 },
        headTop: { x: 200, y: 95 },
        ears: { left: { x: 135, y: 122, rot: -26 }, right: { x: 265, y: 122, rot: 26 } },
        horns: { left: { x: 162, y: 102, rot: -18 }, right: { x: 238, y: 102, rot: 18 } },
        shoulders: { left: { x: 122, y: 224 }, right: { x: 278, y: 224 } },
        legs: [
          [{ x: 200, y: 345 }],
          [{ x: 156, y: 340, rot: -4 }, { x: 244, y: 340, rot: 4 }],
          [{ x: 140, y: 340, rot: -10 }, { x: 200, y: 345, rot: 0 }, { x: 260, y: 340, rot: 10 }],
          [{ x: 128, y: 338, rot: -14 }, { x: 176, y: 345, rot: -4 }, { x: 224, y: 345, rot: 4 }, { x: 272, y: 338, rot: 14 }],
          [{ x: 120, y: 338, rot: -16 }, { x: 160, y: 345, rot: -8 }, { x: 200, y: 348, rot: 0 }, { x: 240, y: 345, rot: 8 }, { x: 280, y: 338, rot: 16 }]
        ],
        cape: { x: 200, y: 212 },
        tail: { x: 135, y: 330 },
        wings: { left: { x: 138, y: 195 }, right: { x: 262, y: 195 } }
      },
      tall: {
        face: { cx: 200, eyeY: 136, noseY: 164, mouthY: 198, width: 80 },
        headTop: { x: 200, y: 76 },
        ears: { left: { x: 142, y: 112, rot: -24 }, right: { x: 258, y: 112, rot: 24 } },
        horns: { left: { x: 166, y: 84, rot: -16 }, right: { x: 234, y: 84, rot: 16 } },
        shoulders: { left: { x: 136, y: 214 }, right: { x: 264, y: 214 } },
        legs: [
          [{ x: 200, y: 355 }],
          [{ x: 165, y: 350, rot: -3 }, { x: 235, y: 350, rot: 3 }],
          [{ x: 152, y: 350, rot: -8 }, { x: 200, y: 355, rot: 0 }, { x: 248, y: 350, rot: 8 }],
          [{ x: 142, y: 348, rot: -12 }, { x: 180, y: 355, rot: -3 }, { x: 220, y: 355, rot: 3 }, { x: 258, y: 348, rot: 12 }],
          [{ x: 135, y: 348, rot: -14 }, { x: 168, y: 355, rot: -7 }, { x: 200, y: 356, rot: 0 }, { x: 232, y: 355, rot: 7 }, { x: 265, y: 348, rot: 14 }]
        ],
        cape: { x: 200, y: 204 },
        tail: { x: 145, y: 340 },
        wings: { left: { x: 142, y: 185 }, right: { x: 258, y: 185 } }
      },
      short: {
        face: { cx: 200, eyeY: 158, noseY: 184, mouthY: 218, width: 92 },
        headTop: { x: 200, y: 118 },
        ears: { left: { x: 128, y: 142, rot: -28 }, right: { x: 272, y: 142, rot: 28 } },
        horns: { left: { x: 156, y: 124, rot: -20 }, right: { x: 244, y: 124, rot: 20 } },
        shoulders: { left: { x: 116, y: 234 }, right: { x: 284, y: 234 } },
        legs: [
          [{ x: 200, y: 335 }],
          [{ x: 150, y: 330, rot: -5 }, { x: 250, y: 330, rot: 5 }],
          [{ x: 135, y: 330, rot: -10 }, { x: 200, y: 335, rot: 0 }, { x: 265, y: 330, rot: 10 }],
          [{ x: 124, y: 328, rot: -14 }, { x: 172, y: 335, rot: -4 }, { x: 228, y: 335, rot: 4 }, { x: 276, y: 328, rot: 14 }],
          [{ x: 116, y: 328, rot: -16 }, { x: 158, y: 335, rot: -8 }, { x: 200, y: 338, rot: 0 }, { x: 242, y: 335, rot: 8 }, { x: 284, y: 328, rot: 16 }]
        ],
        cape: { x: 200, y: 220 },
        tail: { x: 128, y: 320 },
        wings: { left: { x: 126, y: 205 }, right: { x: 274, y: 205 } }
      },
      wide: {
        face: { cx: 200, eyeY: 148, noseY: 175, mouthY: 212, width: 104 },
        headTop: { x: 200, y: 94 },
        ears: { left: { x: 118, y: 130, rot: -32 }, right: { x: 282, y: 130, rot: 32 } },
        horns: { left: { x: 152, y: 100, rot: -22 }, right: { x: 248, y: 100, rot: 22 } },
        shoulders: { left: { x: 104, y: 224 }, right: { x: 296, y: 224 } },
        legs: [
          [{ x: 200, y: 345 }],
          [{ x: 145, y: 342, rot: -5 }, { x: 255, y: 342, rot: 5 }],
          [{ x: 130, y: 340, rot: -10 }, { x: 200, y: 345, rot: 0 }, { x: 270, y: 340, rot: 10 }],
          [{ x: 118, y: 338, rot: -15 }, { x: 170, y: 345, rot: -5 }, { x: 230, y: 345, rot: 5 }, { x: 282, y: 338, rot: 15 }],
          [{ x: 110, y: 338, rot: -18 }, { x: 155, y: 345, rot: -9 }, { x: 200, y: 348, rot: 0 }, { x: 245, y: 345, rot: 9 }, { x: 290, y: 338, rot: 18 }]
        ],
        cape: { x: 200, y: 212 },
        tail: { x: 115, y: 330 },
        wings: { left: { x: 115, y: 195 }, right: { x: 285, y: 195 } }
      },
      thin: {
        face: { cx: 200, eyeY: 138, noseY: 166, mouthY: 200, width: 72 },
        headTop: { x: 200, y: 84 },
        ears: { left: { x: 146, y: 115, rot: -22 }, right: { x: 254, y: 115, rot: 22 } },
        horns: { left: { x: 170, y: 90, rot: -14 }, right: { x: 230, y: 90, rot: 14 } },
        shoulders: { left: { x: 146, y: 215 }, right: { x: 254, y: 215 } },
        legs: [
          [{ x: 200, y: 355 }],
          [{ x: 172, y: 350, rot: -3 }, { x: 228, y: 350, rot: 3 }],
          [{ x: 160, y: 350, rot: -7 }, { x: 200, y: 355, rot: 0 }, { x: 240, y: 350, rot: 7 }],
          [{ x: 150, y: 348, rot: -10 }, { x: 182, y: 355, rot: -3 }, { x: 218, y: 355, rot: 3 }, { x: 250, y: 348, rot: 10 }],
          [{ x: 145, y: 348, rot: -12 }, { x: 172, y: 355, rot: -6 }, { x: 200, y: 356, rot: 0 }, { x: 228, y: 355, rot: 6 }, { x: 255, y: 348, rot: 12 }]
        ],
        cape: { x: 200, y: 205 },
        tail: { x: 150, y: 345 },
        wings: { left: { x: 148, y: 190 }, right: { x: 252, y: 190 } }
      },
      blob: {
        face: { cx: 200, eyeY: 144, noseY: 172, mouthY: 208, width: 90 },
        headTop: { x: 200, y: 90 },
        ears: { left: { x: 132, y: 120, rot: -28 }, right: { x: 268, y: 120, rot: 28 } },
        horns: { left: { x: 160, y: 98, rot: -18 }, right: { x: 240, y: 98, rot: 18 } },
        shoulders: { left: { x: 118, y: 222 }, right: { x: 282, y: 222 } },
        legs: [
          [{ x: 200, y: 345 }],
          [{ x: 154, y: 340, rot: -4 }, { x: 246, y: 340, rot: 4 }],
          [{ x: 138, y: 340, rot: -10 }, { x: 200, y: 345, rot: 0 }, { x: 262, y: 340, rot: 10 }],
          [{ x: 126, y: 338, rot: -14 }, { x: 174, y: 345, rot: -4 }, { x: 226, y: 345, rot: 4 }, { x: 274, y: 338, rot: 14 }],
          [{ x: 118, y: 338, rot: -16 }, { x: 158, y: 345, rot: -8 }, { x: 200, y: 348, rot: 0 }, { x: 242, y: 345, rot: 8 }, { x: 282, y: 338, rot: 16 }]
        ],
        cape: { x: 200, y: 212 },
        tail: { x: 130, y: 330 },
        wings: { left: { x: 130, y: 195 }, right: { x: 270, y: 195 } }
      },
      ghost: {
        face: { cx: 200, eyeY: 148, noseY: 176, mouthY: 212, width: 88 },
        headTop: { x: 200, y: 94 },
        ears: { left: { x: 132, y: 125, rot: -26 }, right: { x: 268, y: 125, rot: 26 } },
        horns: { left: { x: 160, y: 100, rot: -18 }, right: { x: 240, y: 100, rot: 18 } },
        shoulders: { left: { x: 124, y: 228 }, right: { x: 276, y: 228 } },
        legs: [[{ x: 200, y: 350 }]], // ghost floats (no distinct legs)
        cape: { x: 200, y: 216 },
        tail: { x: 132, y: 335 },
        wings: { left: { x: 135, y: 200 }, right: { x: 265, y: 200 } }
      },
      dinosaur: {
        face: { cx: 185, eyeY: 142, noseY: 170, mouthY: 206, width: 86 },
        headTop: { x: 185, y: 92 },
        ears: { left: { x: 128, y: 120, rot: -28 }, right: { x: 254, y: 120, rot: 28 } },
        horns: { left: { x: 150, y: 96, rot: -20 }, right: { x: 228, y: 96, rot: 20 } },
        shoulders: { left: { x: 124, y: 224 }, right: { x: 272, y: 224 } },
        legs: [
          [{ x: 200, y: 345 }],
          [{ x: 154, y: 342, rot: -4 }, { x: 246, y: 342, rot: 4 }],
          [{ x: 138, y: 340, rot: -10 }, { x: 200, y: 345, rot: 0 }, { x: 262, y: 340, rot: 10 }],
          [{ x: 126, y: 338, rot: -14 }, { x: 174, y: 345, rot: -4 }, { x: 226, y: 345, rot: 4 }, { x: 274, y: 338, rot: 14 }],
          [{ x: 118, y: 338, rot: -16 }, { x: 158, y: 345, rot: -8 }, { x: 200, y: 348, rot: 0 }, { x: 242, y: 345, rot: 8 }, { x: 282, y: 338, rot: 16 }]
        ],
        cape: { x: 195, y: 212 },
        tail: { x: 130, y: 330 },
        wings: { left: { x: 130, y: 195 }, right: { x: 265, y: 195 } }
      },
      robot: {
        face: { cx: 200, eyeY: 145, noseY: 172, mouthY: 208, width: 86 },
        headTop: { x: 200, y: 98 },
        ears: { left: { x: 132, y: 124, rot: -24 }, right: { x: 268, y: 124, rot: 24 } },
        horns: { left: { x: 158, y: 102, rot: -16 }, right: { x: 242, y: 102, rot: 16 } },
        shoulders: { left: { x: 120, y: 222 }, right: { x: 280, y: 222 } },
        legs: [
          [{ x: 200, y: 345 }],
          [{ x: 155, y: 340, rot: -4 }, { x: 245, y: 340, rot: 4 }],
          [{ x: 140, y: 340, rot: -10 }, { x: 200, y: 345, rot: 0 }, { x: 260, y: 340, rot: 10 }],
          [{ x: 128, y: 338, rot: -14 }, { x: 175, y: 345, rot: -4 }, { x: 225, y: 345, rot: 4 }, { x: 272, y: 338, rot: 14 }],
          [{ x: 120, y: 338, rot: -16 }, { x: 160, y: 345, rot: -8 }, { x: 200, y: 348, rot: 0 }, { x: 240, y: 345, rot: 8 }, { x: 280, y: 338, rot: 16 }]
        ],
        cape: { x: 200, y: 212 },
        tail: { x: 135, y: 330 },
        wings: { left: { x: 130, y: 195 }, right: { x: 270, y: 195 } }
      }
    };
  }

  getPalette(col) {
    return this.palettes[col] || this.palettes.purple;
  }

  getClothColor(col, fallback = '#2563eb') {
    return this.clothingColors[col] || col || fallback;
  }

  // Universal Monster Adapter to handle both state formats cleanly
  normalize(monster) {
    const m = JSON.parse(JSON.stringify(monster || {}));
    return {
      name: m.name || 'Zippy',
      body: m.body || m.bodyShape || 'round',
      color: m.color || 'purple',
      secondaryColor: m.secondaryColor || m.color || 'yellow',
      pattern: m.pattern || 'none',
      eyes: {
        count: m.eyes?.count !== undefined ? m.eyes.count : (m.eyesCount !== undefined ? m.eyesCount : 2),
        size: m.eyes?.size || m.eyesSize || 'big',
        style: m.eyes?.style || m.eyesStyle || 'round'
      },
      ears: {
        count: m.ears?.count !== undefined ? m.ears.count : (m.earsCount !== undefined ? m.earsCount : 2),
        style: m.ears?.style || m.earsStyle || 'long'
      },
      horns: {
        count: m.horns?.count !== undefined ? m.horns.count : (m.hornsCount !== undefined ? m.hornsCount : 0),
        style: m.horns?.style || m.hornsStyle || 'curly'
      },
      nose: m.nose || m.noseStyle || 'small',
      mouth: m.mouth || m.mouthType || 'big',
      teeth: m.teeth || m.teethType || 'none',
      expression: m.expression || 'happy',
      arms: {
        count: m.arms?.count !== undefined ? m.arms.count : (m.armsCount !== undefined ? m.armsCount : 2),
        length: m.arms?.length || m.armsLength || 'normal'
      },
      hands: m.hands || m.handsStyle || 'normal',
      legs: {
        count: m.legs?.count !== undefined ? m.legs.count : (m.legsCount !== undefined ? m.legsCount : 2)
      },
      feet: m.feet || m.feetStyle || 'normal',
      specialParts: {
        wings: m.specialParts?.wings || m.specialWings || 'none',
        tail: m.specialParts?.tail || m.specialTail || 'none',
        spikes: !!(m.specialParts?.spikes || (Array.isArray(m.specialParts) && m.specialParts.includes('spikes'))),
        fins: !!(m.specialParts?.fins || (Array.isArray(m.specialParts) && m.specialParts.includes('fins'))),
        tentacles: !!(m.specialParts?.tentacles || (Array.isArray(m.specialParts) && m.specialParts.includes('tentacles'))),
        shell: !!(m.specialParts?.shell || (Array.isArray(m.specialParts) && m.specialParts.includes('shell')))
      },
      clothes: {
        outfit: m.clothes?.outfit || m.specialSuit || 'none',
        top: m.clothes?.top || m.clothesTop || 'none',
        topColor: m.clothes?.topColor || m.clothesTopColor || 'blue',
        bottom: m.clothes?.bottom || m.clothesBottom || 'none',
        bottomColor: m.clothes?.bottomColor || m.clothesBottomColor || 'black',
        shoes: m.clothes?.shoes || m.clothesShoes || (m.specialBoots ? 'boots' : 'none'),
        shoesColor: m.clothes?.shoesColor || m.specialBootsColor || 'yellow',
        cape: !!(m.clothes?.cape || m.specialCape),
        capeColor: m.clothes?.capeColor || m.specialCapeColor || 'red'
      },
      accessories: Array.isArray(m.accessories) ? m.accessories : [],
      accessoryColors: m.accessoryColors || {},
      powers: Array.isArray(m.powers) ? m.powers : [],
      personality: Array.isArray(m.personality) ? m.personality : [],
      world: m.world || 'castle',
      food: m.food || 'pizza'
    };
  }

  renderSvg(rawMonster, options = {}) {
    const monster = this.normalize(rawMonster);
    const pal = this.getPalette(monster.color);
    const secPal = this.getPalette(monster.secondaryColor);
    const anchors = this.bodyAnchors[monster.body] || this.bodyAnchors.round;
    const width = options.width || 400;
    const height = options.height || 480;
    const isAnimated = options.animated !== false;

    const isInvisible = monster.powers.includes('invisible');
    const opacityVal = isInvisible ? 0.55 : 1.0;

    const layers = [
      this.renderBackdropShadow(monster),
      this.renderWings(monster, anchors),
      this.renderTail(monster, pal, anchors),
      monster.specialParts.shell ? this.renderShellBack(anchors) : '',
      monster.specialParts.tentacles ? this.renderTentaclesBack(pal, anchors) : '',
      monster.clothes.cape ? this.renderCapeBack(monster, anchors) : '',
      monster.accessories.includes('backpack') ? this.renderBackpackBack(anchors) : '',
      this.renderSpikesAndFinsBack(monster, pal, anchors),
      this.renderEars(monster, pal, anchors),
      this.renderHorns(monster, pal, anchors),
      this.renderLegsAndFeet(monster, pal, anchors),
      this.renderBodyBase(monster, pal, secPal),
      this.renderPatterns(monster, secPal),
      this.renderBottoms(monster),
      this.renderTops(monster),
      this.renderSpecialOutfits(monster),
      this.renderArmsAndHands(monster, pal, anchors),
      this.renderEyes(monster, anchors),
      this.renderGlasses(monster, anchors),
      this.renderNose(monster, pal, anchors),
      this.renderMouthAndTeeth(monster, anchors),
      this.renderNeckAccessories(monster, anchors),
      monster.clothes.cape ? this.renderCapeFront(anchors) : '',
      this.renderHeadAccessories(monster, anchors),
      this.renderPowerAura(monster)
    ];

    return `
      <svg class="monster-svg ${isAnimated ? 'animated-monster' : ''}" 
           viewBox="0 0 400 480" 
           width="${width}" 
           height="${height}" 
           style="opacity: ${opacityVal}; transition: opacity 0.3s ease;"
           xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="mShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="rgba(15,23,42,0.18)"/>
          </filter>
          <linearGradient id="bodyGrad_${monster.color}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${pal.highlight}"/>
            <stop offset="45%" stop-color="${pal.main}"/>
            <stop offset="100%" stop-color="${pal.dark}"/>
          </linearGradient>
          <linearGradient id="secGrad_${monster.secondaryColor}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="100%" stop-color="${secPal.belly}"/>
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="50%" stop-color="#eab308"/>
            <stop offset="100%" stop-color="#a16207"/>
          </linearGradient>
          <linearGradient id="capeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#f43f5e"/>
            <stop offset="100%" stop-color="#9f1239"/>
          </linearGradient>
        </defs>
        ${layers.join('\n')}
      </svg>
    `;
  }

  // 1. Ground Shadow
  renderBackdropShadow(monster) {
    if (monster.body === 'ghost') {
      return `<ellipse cx="200" cy="445" rx="70" ry="12" fill="rgba(15, 23, 42, 0.08)" />`;
    }
    return `<ellipse cx="200" cy="445" rx="105" ry="18" fill="rgba(15, 23, 42, 0.16)" />`;
  }

  // 2. Wings
  renderWings(monster, anchors) {
    const wings = monster.specialParts.wings;
    if (!wings || wings === 'none') return '';
    const l = anchors.wings.left;
    const r = anchors.wings.right;

    if (wings === 'dragon') {
      return `
        <g class="monster-wings-group dragon-wings">
          <path d="M ${l.x},${l.y} Q 60,110 30,150 Q 80,190 40,240 Q 110,230 ${l.x + 5},${l.y + 35} Z" 
                fill="#f97316" stroke="#c2410c" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M ${l.x},${l.y} L 30,150 M ${l.x},${l.y + 15} L 40,240" stroke="#7c2d12" stroke-width="3"/>
          <path d="M ${r.x},${r.y} Q 340,110 370,150 Q 320,190 360,240 Q 290,230 ${r.x - 5},${r.y + 35} Z" 
                fill="#f97316" stroke="#c2410c" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M ${r.x},${r.y} L 370,150 M ${r.x},${r.y + 15} L 360,240" stroke="#7c2d12" stroke-width="3"/>
        </g>
      `;
    } else if (wings === 'butterfly') {
      return `
        <g class="monster-wings-group butterfly-wings">
          <path d="M ${l.x + 5},${l.y + 15} C 60,120 20,200 70,250 C 30,290 80,340 ${l.x + 5},${l.y + 65} Z" 
                fill="#ec4899" stroke="#be185d" stroke-width="4.5" stroke-linejoin="round"/>
          <circle cx="75" cy="205" r="14" fill="#fef08a" opacity="0.8"/>
          <circle cx="85" cy="285" r="10" fill="#38bdf8" opacity="0.8"/>
          <path d="M ${r.x - 5},${r.y + 15} C 340,120 380,200 330,250 C 370,290 320,340 ${r.x - 5},${r.y + 65} Z" 
                fill="#ec4899" stroke="#be185d" stroke-width="4.5" stroke-linejoin="round"/>
          <circle cx="325" cy="205" r="14" fill="#fef08a" opacity="0.8"/>
          <circle cx="315" cy="285" r="10" fill="#38bdf8" opacity="0.8"/>
        </g>
      `;
    } else if (wings === 'bat') {
      return `
        <g class="monster-wings-group bat-wings">
          <path d="M ${l.x},${l.y + 10} Q 60,140 25,185 Q 65,220 50,255 Q 95,255 100,285 Q 130,265 ${l.x + 5},${l.y + 35} Z" 
                fill="#334155" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M ${r.x},${r.y + 10} Q 340,140 375,185 Q 335,220 350,255 Q 305,255 300,285 Q 270,265 ${r.x - 5},${r.y + 35} Z" 
                fill="#334155" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
        </g>
      `;
    }
    return '';
  }

  // 3. Tails
  renderTail(monster, pal, anchors) {
    const tail = monster.specialParts.tail;
    if (!tail || tail === 'none') return '';
    const t = anchors.tail;

    if (tail === 'long') {
      return `
        <g class="monster-tail-group long-tail">
          <path d="M ${t.x},${t.y} C 70,330 30,280 45,230 C 52,205 75,215 65,240 C 55,270 85,310 ${t.x + 10},${t.y + 15} Z" 
                fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
          <circle cx="48" cy="225" r="9" fill="${pal.highlight}"/>
        </g>
      `;
    } else if (tail === 'curly') {
      return `
        <g class="monster-tail-group curly-tail">
          <path d="M ${t.x},${t.y + 5} C 70,350 40,310 65,270 C 85,240 120,270 95,290 C 80,300 70,330 ${t.x + 5},${t.y + 18} Z" 
                fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
        </g>
      `;
    } else if (tail === 'dinosaur') {
      return `
        <g class="monster-tail-group dino-tail">
          <path d="M ${t.x},${t.y - 10} C 60,320 20,380 10,400 C 40,390 90,375 ${t.x + 10},${t.y + 25} Z" 
                fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
          <polygon points="120,324 110,305 102,328" fill="#facc15" stroke="${pal.stroke}" stroke-width="2"/>
          <polygon points="85,338 72,320 68,348" fill="#facc15" stroke="${pal.stroke}" stroke-width="2"/>
          <polygon points="48,362 32,345 35,375" fill="#facc15" stroke="${pal.stroke}" stroke-width="2"/>
        </g>
      `;
    } else if (tail === 'snake') {
      return `
        <g class="monster-tail-group snake-tail">
          <path d="M ${t.x},${t.y + 5} Q 70,360 50,330 Q 30,300 65,260 Q 90,230 75,200 Q 60,180 85,175" 
                fill="none" stroke="${pal.main}" stroke-width="16" stroke-linecap="round"/>
          <path d="M ${t.x},${t.y + 5} Q 70,360 50,330 Q 30,300 65,260 Q 90,230 75,200 Q 60,180 85,175" 
                fill="none" stroke="${pal.stroke}" stroke-width="4.5" stroke-linecap="round"/>
        </g>
      `;
    } else if (tail === 'bunny') {
      return `
        <g class="monster-tail-group bunny-tail">
          <circle cx="${t.x - 17}" cy="${t.y + 5}" r="18" fill="#ffffff" stroke="${pal.stroke}" stroke-width="4"/>
          <circle cx="${t.x - 20}" cy="${t.y + 2}" r="12" fill="#f1f5f9"/>
        </g>
      `;
    }
    return '';
  }

  // 4. Shell Back
  renderShellBack() {
    return `
      <g class="monster-shell-back">
        <ellipse cx="200" cy="275" rx="100" ry="110" fill="#047857" stroke="#064e3b" stroke-width="6"/>
        <path d="M 140,240 L 260,240 M 130,285 L 270,285 M 145,330 L 255,330" stroke="#064e3b" stroke-width="4"/>
        <polygon points="120,210 110,195 128,205" fill="#facc15" stroke="#064e3b" stroke-width="2"/>
        <polygon points="280,210 290,195 272,205" fill="#facc15" stroke="#064e3b" stroke-width="2"/>
      </g>
    `;
  }

  // 5. Tentacles Back
  renderTentaclesBack(pal, anchors) {
    const t = anchors.tail;
    return `
      <g class="monster-tentacles-back">
        <path d="M ${t.x - 10},${t.y - 60} C 60,260 40,320 60,370 C 80,410 40,430 30,440" fill="none" stroke="${pal.main}" stroke-width="16" stroke-linecap="round"/>
        <path d="M ${t.x - 10},${t.y - 60} C 60,260 40,320 60,370 C 80,410 40,430 30,440" fill="none" stroke="${pal.stroke}" stroke-width="4" stroke-linecap="round"/>
        <path d="M ${400 - t.x + 10},${t.y - 60} C 340,260 360,320 340,370 C 320,410 360,430 370,440" fill="none" stroke="${pal.main}" stroke-width="16" stroke-linecap="round"/>
        <path d="M ${400 - t.x + 10},${t.y - 60} C 340,260 360,320 340,370 C 320,410 360,430 370,440" fill="none" stroke="${pal.stroke}" stroke-width="4" stroke-linecap="round"/>
      </g>
    `;
  }

  // 6. Cape Back
  renderCapeBack(monster, anchors) {
    const capeColor = monster.clothes.capeColor || 'red';
    const fill = capeColor === 'red' ? 'url(#capeGrad)' : this.getClothColor(capeColor, '#ef4444');
    const c = anchors.cape;
    return `
      <g class="monster-cape-back">
        <path d="M ${c.x - 70},${c.y - 7} Q 80,330 65,415 Q 200,445 335,415 Q 320,330 ${c.x + 70},${c.y - 7} Z" 
              fill="${fill}" stroke="#881337" stroke-width="4.5" stroke-linejoin="round" />
        <path d="M 95,405 Q 135,385 175,418 Q 225,385 265,418 Q 305,385 325,405" 
              fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="3" stroke-linecap="round"/>
      </g>
    `;
  }

  // 7. Backpack Back
  renderBackpackBack() {
    return `
      <g class="monster-backpack-back">
        <rect x="110" y="215" width="180" height="135" rx="30" fill="#10b981" stroke="#065f46" stroke-width="5"/>
        <path d="M 130,235 L 270,235" stroke="#065f46" stroke-width="4" stroke-linecap="round"/>
        <rect x="140" y="260" width="120" height="65" rx="16" fill="#34d399" stroke="#065f46" stroke-width="4"/>
        <circle cx="200" cy="275" r="5" fill="#065f46"/>
      </g>
    `;
  }

  // 8. Spikes and Fins Back
  renderSpikesAndFinsBack(monster, pal, anchors) {
    let html = '';
    const top = anchors.headTop;

    if (monster.specialParts.spikes) {
      html += `
        <g class="monster-spikes">
          <polygon points="${top.x - 25},${top.y + 5} ${top.x - 40},${top.y - 30} ${top.x - 15},${top.y}" fill="#facc15" stroke="${pal.stroke}" stroke-width="2.5"/>
          <polygon points="${top.x},${top.y} ${top.x},${top.y - 40} ${top.x + 10},${top.y}" fill="#facc15" stroke="${pal.stroke}" stroke-width="2.5"/>
          <polygon points="${top.x + 25},${top.y + 5} ${top.x + 40},${top.y - 30} ${top.x + 15},${top.y}" fill="#facc15" stroke="${pal.stroke}" stroke-width="2.5"/>
        </g>
      `;
    }

    if (monster.specialParts.fins) {
      const e = anchors.ears;
      html += `
        <g class="monster-fins">
          <path d="M ${e.left.x - 10},${e.left.y + 40} Q 80,140 75,180 Q 105,185 ${e.left.x - 10},${e.left.y + 55} Z" fill="#38bdf8" stroke="${pal.stroke}" stroke-width="3"/>
          <path d="M ${e.right.x + 10},${e.right.y + 40} Q 320,140 325,180 Q 295,185 ${e.right.x + 10},${e.right.y + 55} Z" fill="#38bdf8" stroke="${pal.stroke}" stroke-width="3"/>
        </g>
      `;
    }

    return html;
  }

  // 9. Ears
  renderEars(monster, pal, anchors) {
    const count = monster.ears.count;
    if (count === 0) return '';
    const style = monster.ears.style || 'long';
    const e = anchors.ears;

    let configs = [];
    if (count === 1) configs = [{ x: e.left.x, y: e.left.y, rot: e.left.rot, flip: false }];
    else if (count === 2) configs = [
      { x: e.left.x, y: e.left.y, rot: e.left.rot, flip: false },
      { x: e.right.x, y: e.right.y, rot: e.right.rot, flip: true }
    ];
    else if (count === 4) configs = [
      { x: e.left.x + 4, y: e.left.y - 10, rot: e.left.rot - 8, flip: false },
      { x: e.left.x - 4, y: e.left.y + 25, rot: e.left.rot + 10, flip: false },
      { x: e.right.x - 4, y: e.right.y - 10, rot: e.right.rot + 8, flip: true },
      { x: e.right.x + 4, y: e.right.y + 25, rot: e.right.rot - 10, flip: true }
    ];

    return `
      <g class="monster-ears-group">
        ${configs.map(cfg => {
          const sign = cfg.flip ? -1 : 1;
          if (style === 'long' || style === 'floppy') {
            return `
              <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.rot})">
                <path d="M 0,0 C ${-24*sign},-60 ${8*sign},-102 ${18*sign},-98 C ${28*sign},-60 ${18*sign},-15 0,0 Z" 
                      fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
                <path d="M ${4*sign},-14 C ${-8*sign},-52 ${10*sign},-82 ${14*sign},-80 C ${18*sign},-52 ${14*sign},-16 ${4*sign},-14 Z" 
                      fill="${pal.belly}" stroke="${pal.dark}" stroke-width="2"/>
              </g>
            `;
          } else if (style === 'pointy') {
            return `
              <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.rot})">
                <polygon points="0,0 ${-25*sign},-45 ${15*sign},-30" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
                <polygon points="${2*sign},-6 ${-14*sign},-36 ${8*sign},-25" fill="${pal.belly}"/>
              </g>
            `;
          } else if (style === 'animal') {
            return `
              <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.rot})">
                <polygon points="0,0 ${-30*sign},-38 ${10*sign},-36" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
                <polygon points="${-2*sign},-8 ${-20*sign},-30 ${4*sign},-28" fill="#f472b6"/>
              </g>
            `;
          } else if (style === 'small') {
            return `
              <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.rot})">
                <ellipse cx="0" cy="0" rx="14" ry="16" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4"/>
                <ellipse cx="0" cy="0" rx="7" ry="9" fill="${pal.belly}"/>
              </g>
            `;
          } else if (style === 'tiny') {
            return `
              <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.rot})">
                <circle cx="0" cy="0" r="9" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="3.5"/>
              </g>
            `;
          } else { // round
            return `
              <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.rot})">
                <ellipse cx="0" cy="0" rx="22" ry="24" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5"/>
                <ellipse cx="0" cy="0" rx="12" ry="14" fill="${pal.belly}" stroke="${pal.dark}" stroke-width="2"/>
              </g>
            `;
          }
        }).join('')}
      </g>
    `;
  }

  // 10. Horns
  renderHorns(monster, pal, anchors) {
    const count = monster.horns.count;
    if (count === 0) return '';
    const style = monster.horns.style || 'curly';
    const h = anchors.horns;
    const top = anchors.headTop;

    let configs = [];
    if (count === 1) configs = [{ x: top.x, y: top.y, rot: 0, flip: false }];
    else if (count === 2) configs = [
      { x: h.left.x, y: h.left.y, rot: h.left.rot, flip: false },
      { x: h.right.x, y: h.right.y, rot: h.right.rot, flip: true }
    ];
    else if (count === 4) configs = [
      { x: h.left.x - 8, y: h.left.y + 6, rot: h.left.rot - 12, flip: false },
      { x: h.left.x + 15, y: h.left.y - 6, rot: h.left.rot + 6, flip: false },
      { x: h.right.x - 15, y: h.right.y - 6, rot: h.right.rot - 6, flip: true },
      { x: h.right.x + 8, y: h.right.y + 6, rot: h.right.rot + 12, flip: true }
    ];

    return `
      <g class="monster-horns-group">
        ${configs.map(cfg => {
          const sign = cfg.flip ? -1 : 1;
          if (style === 'curly') {
            return `
              <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.rot})">
                <path d="M 0,0 C ${-25*sign},-30 ${-40*sign},-10 ${-25*sign},10 C ${-10*sign},20 ${-20*sign},-15 0,0 Z" 
                      fill="url(#goldGrad)" stroke="#78350f" stroke-width="4" stroke-linejoin="round"/>
              </g>
            `;
          } else if (style === 'spiral') {
            return `
              <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.rot})">
                <polygon points="0,0 ${-12*sign},-60 ${12*sign},-60" fill="url(#goldGrad)" stroke="#78350f" stroke-width="4" stroke-linejoin="round"/>
                <line x1="${-6*sign}" y1="-20" x2="${6*sign}" y2="-25" stroke="#78350f" stroke-width="3"/>
                <line x1="${-8*sign}" y1="-40" x2="${8*sign}" y2="-45" stroke="#78350f" stroke-width="3"/>
              </g>
            `;
          } else if (style === 'tiny') {
            return `
              <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.rot})">
                <polygon points="${-8*sign},0 0,-18 ${8*sign},0" fill="url(#goldGrad)" stroke="#78350f" stroke-width="3"/>
              </g>
            `;
          } else { // pointy, big
            const height = style === 'big' ? 56 : 38;
            return `
              <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.rot})">
                <polygon points="${-12*sign},0 0,${-height} ${12*sign},0" fill="url(#goldGrad)" stroke="#78350f" stroke-width="4" stroke-linejoin="round"/>
              </g>
            `;
          }
        }).join('')}
      </g>
    `;
  }

  // 11. Legs & Feet
  renderLegsAndFeet(monster, pal, anchors) {
    const count = monster.legs.count;
    if (count === 0 || monster.body === 'ghost') return '';

    const shoeType = monster.clothes.shoes || 'none';
    const bootColor = this.getClothColor(monster.clothes.shoesColor || 'yellow', '#eab308');

    let legSlotIndex = 1;
    if (count === 1) legSlotIndex = 0;
    else if (count === 2) legSlotIndex = 1;
    else if (count === 3) legSlotIndex = 2;
    else if (count === 4) legSlotIndex = 3;
    else if (count === 'many' || count >= 5) legSlotIndex = 4;

    const slotConfigs = anchors.legs[legSlotIndex] || anchors.legs[1];
    const feet = monster.feet || 'normal';

    return `
      <g class="monster-legs-group">
        ${slotConfigs.map(cfg => `
          <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.rot || 0})">
            <path d="M -14,0 L -14,75 Q -14,88 0,88 Q 14,88 14,75 L 14,0 Z" 
                  fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
            
            ${shoeType === 'boots' ? `
              <g transform="translate(0, 48)" class="shoe-boots">
                <path d="M -18,0 L 22,0 L 26,38 Q 26,48 10,48 L -20,48 Q -24,48 -22,36 Z" 
                      fill="${bootColor}" stroke="${pal.stroke}" stroke-width="4" stroke-linejoin="round"/>
                <ellipse cx="2" cy="46" rx="24" ry="7" fill="${pal.stroke}"/>
                <rect x="-16" y="0" width="38" height="8" rx="3" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
              </g>
            ` : shoeType === 'sneakers' ? `
              <g transform="translate(0, 56)" class="shoe-sneakers">
                <path d="M -18,0 L 24,0 L 28,32 Q 28,38 12,38 L -20,38 Z" fill="#ef4444" stroke="${pal.stroke}" stroke-width="3.5"/>
                <rect x="-22" y="28" width="52" height="10" rx="4" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
                <line x1="-10" y1="12" x2="14" y2="12" stroke="#ffffff" stroke-width="3"/>
              </g>
            ` : shoeType === 'clown_shoes' ? `
              <g transform="translate(0, 50)" class="shoe-clown-shoes">
                <ellipse cx="8" cy="32" rx="34" ry="16" fill="#facc15" stroke="${pal.stroke}" stroke-width="4"/>
                <circle cx="34" cy="24" r="8" fill="#ef4444"/>
              </g>
            ` : shoeType === 'monster_feet' || feet === 'monster' ? `
              <g transform="translate(0, 76)" class="shoe-monster-feet">
                <ellipse cx="2" cy="6" rx="26" ry="14" fill="#15803d" stroke="${pal.stroke}" stroke-width="4.5"/>
                <polygon points="-16,10 -12,24 -8,10" fill="#a855f7" stroke="${pal.stroke}" stroke-width="1.5"/>
                <polygon points="-2,12 2,26 6,12" fill="#a855f7" stroke="${pal.stroke}" stroke-width="1.5"/>
                <polygon points="12,10 16,24 20,10" fill="#a855f7" stroke="${pal.stroke}" stroke-width="1.5"/>
              </g>
            ` : feet === 'bird' ? `
              <g transform="translate(0, 80)">
                <path d="M -18,12 L 0,0 L 18,12 M 0,0 L 0,16 M 0,0 L -6,-10" stroke="#ca8a04" stroke-width="6" stroke-linecap="round"/>
              </g>
            ` : feet === 'claws' ? `
              <g transform="translate(0, 80)">
                <ellipse cx="2" cy="5" rx="24" ry="12" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5"/>
                <polygon points="-16,10 -12,24 -8,10" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
                <polygon points="-2,12 2,26 6,12" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
                <polygon points="12,10 16,24 20,10" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
              </g>
            ` : feet === 'giant' || feet === 'big' ? `
              <g transform="translate(0, 76)">
                <ellipse cx="4" cy="8" rx="${feet === 'giant' ? 34 : 28}" ry="16" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5"/>
                <circle cx="-16" cy="16" r="6" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
                <circle cx="2" cy="20" r="7" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
                <circle cx="20" cy="16" r="6" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
              </g>
            ` : feet === 'tiny' ? `
              <g transform="translate(0, 82)">
                <ellipse cx="0" cy="2" rx="14" ry="8" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="3"/>
              </g>
            ` : `
              <g transform="translate(0, 80)">
                <ellipse cx="2" cy="5" rx="24" ry="12" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5"/>
                <circle cx="-12" cy="11" r="5" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
                <circle cx="2" cy="14" r="5.5" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
                <circle cx="16" cy="11" r="5" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
              </g>
            `}
          </g>
        `).join('')}
      </g>
    `;
  }

  // 12. Body Base Silhouettes (9 distinct body shapes)
  renderBodyBase(monster, pal, secPal) {
    const shape = monster.body || 'round';
    let bodyPath = '';
    let bellyPath = '';

    if (shape === 'tall') {
      bodyPath = `M 200,75 C 240,75 262,110 262,160 C 262,210 265,310 255,365 C 245,380 155,380 145,365 C 135,310 138,210 138,160 C 138,110 160,75 200,75 Z`;
      bellyPath = `<ellipse cx="200" cy="285" rx="46" ry="75" fill="url(#secGrad_${monster.secondaryColor})" stroke="${pal.dark}" stroke-width="3"/>`;
    } else if (shape === 'short') {
      bodyPath = `M 200,120 C 260,120 285,155 285,210 C 285,280 285,350 200,350 C 115,350 115,280 115,210 C 115,155 140,120 200,120 Z`;
      bellyPath = `<ellipse cx="200" cy="265" rx="65" ry="55" fill="url(#secGrad_${monster.secondaryColor})" stroke="${pal.dark}" stroke-width="3"/>`;
    } else if (shape === 'wide') {
      bodyPath = `M 200,95 C 275,95 305,150 305,230 C 305,320 285,365 200,365 C 115,365 95,320 95,230 C 95,150 125,95 200,95 Z`;
      bellyPath = `<ellipse cx="200" cy="280" rx="76" ry="62" fill="url(#secGrad_${monster.secondaryColor})" stroke="${pal.dark}" stroke-width="3"/>`;
    } else if (shape === 'thin') {
      bodyPath = `M 200,85 C 235,85 248,120 248,180 C 248,250 252,330 242,370 C 235,380 165,380 158,370 C 148,330 152,250 152,180 C 152,120 165,85 200,85 Z`;
      bellyPath = `<ellipse cx="200" cy="290" rx="36" ry="65" fill="url(#secGrad_${monster.secondaryColor})" stroke="${pal.dark}" stroke-width="3"/>`;
    } else if (shape === 'blob') {
      bodyPath = `M 200,90 C 265,80 295,135 275,190 C 315,245 295,340 255,365 C 200,385 150,360 125,345 C 85,300 100,225 125,185 C 105,130 145,85 200,90 Z`;
      bellyPath = `<path d="M 195,240 Q 255,235 245,305 Q 235,355 195,350 Q 150,355 155,295 Z" fill="url(#secGrad_${monster.secondaryColor})" stroke="${pal.dark}" stroke-width="3"/>`;
    } else if (shape === 'ghost') {
      bodyPath = `M 200,95 C 265,95 285,150 285,240 C 285,330 290,400 270,410 C 250,385 230,415 200,395 C 170,415 150,385 130,410 C 110,400 115,330 115,240 C 115,150 135,95 200,95 Z`;
      bellyPath = `<ellipse cx="200" cy="275" rx="55" ry="60" fill="url(#secGrad_${monster.secondaryColor})" opacity="0.6"/>`;
    } else if (shape === 'dinosaur') {
      bodyPath = `M 180,95 C 230,85 265,120 265,170 C 265,220 285,300 275,355 C 255,375 145,375 125,355 C 115,295 130,220 135,170 C 135,120 145,95 180,95 Z`;
      bellyPath = `<path d="M 200,230 C 245,230 258,260 258,310 C 258,355 240,360 200,360 C 160,360 142,355 142,310 C 142,260 155,230 200,230 Z" fill="url(#secGrad_${monster.secondaryColor})" stroke="${pal.dark}" stroke-width="3"/>`;
    } else if (shape === 'robot') {
      bodyPath = `M 135,100 L 265,100 L 265,195 L 285,215 L 285,345 L 115,345 L 115,215 L 135,195 Z`;
      bellyPath = `<rect x="145" y="235" width="110" height="95" rx="14" fill="url(#secGrad_${monster.secondaryColor})" stroke="${pal.dark}" stroke-width="3"/><circle cx="200" cy="282" r="16" fill="#38bdf8"/>`;
    } else { // round (default)
      bodyPath = `M 200,95 C 245,95 272,125 272,165 C 272,192 258,212 278,225 C 300,240 292,305 278,345 C 260,375 140,375 122,345 C 108,305 100,240 122,225 C 142,212 128,192 128,165 C 128,125 155,95 200,95 Z`;
      bellyPath = `<path d="M 200,235 C 238,235 254,260 254,295 C 254,335 235,355 200,355 C 165,355 146,335 146,295 C 146,260 162,235 200,235 Z" fill="url(#secGrad_${monster.secondaryColor})" stroke="${pal.dark}" stroke-width="3" opacity="0.9"/>`;
    }

    return `
      <g class="monster-body-group" filter="url(#mShadow)">
        <path d="${bodyPath}" fill="url(#bodyGrad_${monster.color})" stroke="${pal.stroke}" stroke-width="5" stroke-linejoin="round"/>
        <ellipse cx="148" cy="178" rx="14" ry="9" fill="${pal.dark}" opacity="0.25"/>
        <ellipse cx="252" cy="178" rx="14" ry="9" fill="${pal.dark}" opacity="0.25"/>
        ${bellyPath}
      </g>
    `;
  }

  // 13. Patterns
  renderPatterns(monster, secPal) {
    const pat = monster.pattern;
    if (!pat || pat === 'none') return '';
    const col = secPal.main;

    if (pat === 'spots' || pat === 'dots') {
      const r = pat === 'dots' ? 4 : 9;
      return `
        <g class="monster-patterns" opacity="0.6">
          <circle cx="160" cy="140" r="${r}" fill="${col}"/>
          <circle cx="240" cy="140" r="${r}" fill="${col}"/>
          <circle cx="145" cy="270" r="${r*1.2}" fill="${col}"/>
          <circle cx="255" cy="270" r="${r*1.2}" fill="${col}"/>
          <circle cx="180" cy="330" r="${r}" fill="${col}"/>
          <circle cx="220" cy="330" r="${r}" fill="${col}"/>
        </g>
      `;
    } else if (pat === 'stripes' || pat === 'rainbow') {
      const cols = pat === 'rainbow' ? ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'] : [col, col, col, col, col];
      return `
        <g class="monster-patterns" opacity="0.55">
          <path d="M 130,245 Q 200,260 270,245" stroke="${cols[0]}" stroke-width="8" stroke-linecap="round"/>
          <path d="M 125,275 Q 200,290 275,275" stroke="${cols[1]}" stroke-width="8" stroke-linecap="round"/>
          <path d="M 125,305 Q 200,320 275,305" stroke="${cols[2]}" stroke-width="8" stroke-linecap="round"/>
          <path d="M 130,335 Q 200,350 270,335" stroke="${cols[3]}" stroke-width="8" stroke-linecap="round"/>
        </g>
      `;
    } else if (pat === 'stars') {
      return `
        <g class="monster-patterns" opacity="0.7">
          <polygon points="155,140 157,145 163,146 158,150 160,156 155,153 150,156 152,150 147,146 153,145" fill="${col}"/>
          <polygon points="245,140 247,145 253,146 248,150 250,156 245,153 240,156 242,150 237,146 243,145" fill="${col}"/>
          <polygon points="145,280 147,285 153,286 148,290 150,296 145,293 140,296 142,290 137,286 143,285" fill="${col}"/>
          <polygon points="255,280 257,285 263,286 258,290 260,296 255,293 250,296 252,290 247,286 253,285" fill="${col}"/>
        </g>
      `;
    } else if (pat === 'hearts') {
      return `
        <g class="monster-patterns" opacity="0.7">
          <path d="M 155,140 C 150,135 142,138 142,146 C 142,154 155,162 155,162 C 155,162 168,154 168,146 C 168,138 160,135 155,140 Z" fill="${col}"/>
          <path d="M 245,140 C 240,135 232,138 232,146 C 232,154 245,162 245,162 C 245,162 258,154 258,146 C 258,138 250,135 245,140 Z" fill="${col}"/>
          <path d="M 200,320 C 195,315 187,318 187,326 C 187,334 200,342 200,342 C 200,342 213,334 213,326 C 213,318 205,315 200,320 Z" fill="${col}"/>
        </g>
      `;
    } else if (pat === 'zigzags') {
      return `
        <g class="monster-patterns" opacity="0.6">
          <path d="M 130,260 L 150,250 L 170,260 L 190,250 L 210,260 L 230,250 L 250,260 L 270,250" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round"/>
          <path d="M 130,300 L 150,290 L 170,300 L 190,290 L 210,300 L 230,290 L 250,300 L 270,290" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round"/>
        </g>
      `;
    }
    return '';
  }

  // 14. Bottoms
  renderBottoms(monster) {
    const b = monster.clothes.bottom;
    if (!b || b === 'none' || (monster.clothes.outfit && monster.clothes.outfit !== 'none')) return '';
    const color = this.getClothColor(monster.clothes.bottomColor, '#1e293b');

    if (b === 'trousers') {
      return `
        <g class="monster-clothing-bottoms">
          <path d="M 124,300 C 118,340 128,375 146,375 L 178,375 L 198,328 L 222,375 L 254,375 C 272,375 282,340 276,300 Z" 
                fill="${color}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          <line x1="200" y1="328" x2="200" y2="305" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="188" y="298" width="24" height="7" rx="3" fill="#facc15" stroke="#0f172a" stroke-width="2"/>
        </g>
      `;
    } else if (b === 'shorts') {
      return `
        <g class="monster-clothing-bottoms">
          <path d="M 124,300 C 118,325 130,345 155,345 L 178,345 L 198,320 L 222,345 L 245,345 C 270,345 282,325 276,300 Z" 
                fill="${color}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
        </g>
      `;
    } else if (b === 'skirt') {
      return `
        <g class="monster-clothing-bottoms">
          <path d="M 138,260 Q 90,360 102,372 Q 200,388 298,372 Q 310,360 262,260 Z" 
                fill="${color}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M 112,362 Q 132,348 152,362 Q 172,348 192,362 Q 212,348 232,362 Q 252,348 272,362 Q 292,348 302,362" 
                fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
        </g>
      `;
    }
    return '';
  }

  // 15. Tops
  renderTops(monster) {
    const t = monster.clothes.top;
    if (!t || t === 'none' || (monster.clothes.outfit && monster.clothes.outfit !== 'none')) return '';
    const color = this.getClothColor(monster.clothes.topColor, '#2563eb');

    if (t === 'tshirt') {
      return `
        <g class="monster-clothing-tops">
          <path d="M 142,215 Q 200,230 258,215 L 292,255 L 268,266 L 258,310 L 142,310 L 132,266 L 108,255 Z" 
                fill="${color}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M 174,218 Q 200,235 226,218" fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
          <polygon points="200,248 203,256 212,257 205,263 207,271 200,267 193,271 195,263 188,257 197,256" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
        </g>
      `;
    } else if (t === 'shirt') {
      return `
        <g class="monster-clothing-tops">
          <path d="M 142,215 L 258,215 L 292,255 L 268,266 L 258,310 L 142,310 L 132,266 L 108,255 Z" 
                fill="${color}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          <polygon points="174,215 200,238 188,215" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
          <polygon points="226,215 200,238 212,215" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
          <line x1="200" y1="238" x2="200" y2="310" stroke="#0f172a" stroke-width="3"/>
          <circle cx="200" cy="254" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <circle cx="200" cy="274" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
        </g>
      `;
    } else if (t === 'hoodie' || t === 'sweater') {
      return `
        <g class="monster-clothing-tops">
          <path d="M 140,212 Q 200,225 260,212 L 295,262 L 268,272 L 258,314 L 142,314 L 132,272 L 105,262 Z" 
                fill="${color}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          <rect x="160" y="275" width="80" height="28" rx="8" fill="#ffffff" opacity="0.4"/>
          <line x1="190" y1="225" x2="188" y2="252" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
          <line x1="210" y1="225" x2="212" y2="252" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
        </g>
      `;
    } else if (t === 'jacket') {
      return `
        <g class="monster-clothing-tops">
          <path d="M 138,215 L 262,215 L 296,258 L 270,270 L 260,314 L 140,314 L 130,270 L 104,258 Z" 
                fill="${color}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M 174,215 L 186,314" stroke="#0f172a" stroke-width="4"/>
          <path d="M 226,215 L 214,314" stroke="#0f172a" stroke-width="4"/>
        </g>
      `;
    }
    return '';
  }

  // 16. Outfits
  renderSpecialOutfits(monster) {
    const o = monster.clothes.outfit;
    if (!o || o === 'none') return '';

    if (o === 'dress') {
      return `
        <g class="monster-outfit-dress">
          <path d="M 145,215 Q 200,232 255,215 L 295,372 Q 200,390 105,372 Z" fill="#ec4899" stroke="#0f172a" stroke-width="4.5"/>
          <circle cx="200" cy="245" r="5" fill="#fef08a"/>
          <circle cx="200" cy="275" r="5" fill="#fef08a"/>
          <circle cx="200" cy="305" r="5" fill="#fef08a"/>
        </g>
      `;
    } else if (o === 'superhero') {
      return `
        <g class="monster-suit-superhero">
          <path d="M 138,215 Q 200,230 262,215 L 285,340 L 115,340 Z" fill="#2563eb" stroke="#0f172a" stroke-width="4.5"/>
          <polygon points="200,235 225,255 215,285 185,285 175,255" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
          <text x="200" y="272" font-size="22" font-weight="900" text-anchor="middle" fill="#dc2626">M</text>
        </g>
      `;
    } else if (o === 'astronaut') {
      return `
        <g class="monster-suit-astronaut">
          <path d="M 135,210 L 265,210 L 285,345 L 115,345 Z" fill="#f8fafc" stroke="#0f172a" stroke-width="4.5"/>
          <rect x="175" y="240" width="50" height="40" rx="8" fill="#38bdf8" stroke="#0f172a" stroke-width="2.5"/>
          <circle cx="188" cy="255" r="4" fill="#ef4444"/>
          <circle cx="212" cy="255" r="4" fill="#10b981"/>
        </g>
      `;
    } else if (o === 'wizard') {
      return `
        <g class="monster-suit-wizard">
          <path d="M 140,215 Q 200,235 260,215 L 295,375 L 105,375 Z" fill="#7c3aed" stroke="#0f172a" stroke-width="4.5"/>
          <polygon points="200,248 203,256 212,257 205,263 207,271 200,267 193,271 195,263 188,257 197,256" fill="#facc15"/>
          <polygon points="160,310 162,315 168,316 163,320 165,326 160,323 155,326 157,320 152,316 158,315" fill="#facc15"/>
          <polygon points="240,310 242,315 248,316 243,320 245,326 240,323 235,326 237,320 232,316 238,315" fill="#facc15"/>
        </g>
      `;
    } else if (o === 'pirate') {
      return `
        <g class="monster-suit-pirate">
          <path d="M 140,215 L 260,215 L 285,345 L 115,345 Z" fill="#1e293b" stroke="#0f172a" stroke-width="4.5"/>
          <path d="M 170,215 L 175,345 L 225,345 L 230,215 Z" fill="#dc2626"/>
          <line x1="170" y1="245" x2="230" y2="245" stroke="#ffffff" stroke-width="4"/>
          <line x1="170" y1="275" x2="230" y2="275" stroke="#ffffff" stroke-width="4"/>
          <line x1="170" y1="305" x2="230" y2="305" stroke="#ffffff" stroke-width="4"/>
        </g>
      `;
    } else if (o === 'football') {
      return `
        <g class="monster-suit-football">
          <path d="M 140,215 L 260,215 L 285,325 L 115,325 Z" fill="#16a34a" stroke="#0f172a" stroke-width="4.5"/>
          <text x="200" y="278" font-size="34" font-weight="900" text-anchor="middle" fill="#ffffff">10</text>
        </g>
      `;
    } else if (o === 'royal') {
      return `
        <g class="monster-suit-royal">
          <path d="M 135,215 L 265,215 L 295,370 L 105,370 Z" fill="#991b1b" stroke="#0f172a" stroke-width="4.5"/>
          <path d="M 180,215 L 180,370 L 220,370 L 220,215 Z" fill="#fef08a" stroke="#0f172a" stroke-width="2"/>
        </g>
      `;
    }
    return '';
  }

  // 17. Arms & Hands
  renderArmsAndHands(monster, pal, anchors) {
    const count = monster.arms.count;
    if (count === 0) return '';
    const length = monster.arms.length || 'normal';
    const hasGloves = false;
    const gloveColor = '#16a34a';

    let factor = 1.0;
    if (length === 'tiny') factor = 0.55;
    else if (length === 'short') factor = 0.85;
    else if (length === 'normal') factor = 1.05;
    else if (length === 'long') factor = 1.35;
    else if (length === 'super_long') factor = 1.75;

    const sh = anchors.shoulders;
    let armConfigs = [];
    if (count === 1) armConfigs = [{ side: 'right', shX: sh.right.x, shY: sh.right.y, handX: 62 * factor, handY: -35 * factor, rot: 28, flip: true }];
    else if (count === 2) armConfigs = [
      { side: 'left',  shX: sh.left.x,  shY: sh.left.y,  handX: 62 * factor, handY: 35 * factor,  rot: -28, flip: false },
      { side: 'right', shX: sh.right.x, shY: sh.right.y, handX: 62 * factor, handY: -35 * factor, rot: 28,  flip: true }
    ];
    else if (count === 3) armConfigs = [
      { side: 'left',  shX: sh.left.x,     shY: sh.left.y - 10, handX: 65 * factor, handY: -30 * factor, rot: -42, flip: false },
      { side: 'left',  shX: sh.left.x + 2, shY: sh.left.y + 40, handX: 58 * factor, handY: 35 * factor,  rot: -12, flip: false },
      { side: 'right', shX: sh.right.x,    shY: sh.right.y,      handX: 62 * factor, handY: 35 * factor,  rot: 28,  flip: true }
    ];
    else if (count === 4) {
      armConfigs = [
        { side: 'left',  shX: sh.left.x,     shY: sh.left.y - 14, handX: 64 * factor, handY: -32 * factor, rot: -46, flip: false },
        { side: 'left',  shX: sh.left.x + 2, shY: sh.left.y + 44, handX: 58 * factor, handY: 30 * factor,  rot: -10, flip: false },
        { side: 'right', shX: sh.right.x,    shY: sh.right.y - 14, handX: 64 * factor, handY: -32 * factor, rot: 46,  flip: true },
        { side: 'right', shX: sh.right.x - 2,shY: sh.right.y + 44, handX: 58 * factor, handY: 30 * factor,  rot: 10,  flip: true }
      ];
    } else { // many (6 arms)
      armConfigs = [
        { side: 'left',  shX: sh.left.x,     shY: sh.left.y - 28, handX: 64 * factor, handY: -45 * factor, rot: -55, flip: false },
        { side: 'left',  shX: sh.left.x,     shY: sh.left.y + 12, handX: 60 * factor, handY: 0,            rot: -20, flip: false },
        { side: 'left',  shX: sh.left.x + 2, shY: sh.left.y + 52, handX: 56 * factor, handY: 35 * factor,  rot: 10,  flip: false },
        { side: 'right', shX: sh.right.x,    shY: sh.right.y - 28, handX: 64 * factor, handY: -45 * factor, rot: 55,  flip: true },
        { side: 'right', shX: sh.right.x,    shY: sh.right.y + 12, handX: 60 * factor, handY: 0,            rot: 20,  flip: true },
        { side: 'right', shX: sh.right.x - 2,shY: sh.right.y + 52, handX: 56 * factor, handY: 35 * factor,  rot: -10, flip: true }
      ];
    }

    const hand = monster.hands || 'normal';

    return `
      <g class="monster-arms-group">
        ${armConfigs.map((cfg) => {
          const dir = cfg.flip ? 1 : -1;
          const targetX = cfg.shX + (cfg.handX * dir);
          const targetY = cfg.shY + cfg.handY;
          const midX = (cfg.shX + targetX) / 2;
          const midY = (cfg.shY + targetY) / 2 + (cfg.flip ? -10 : 10);

          return `
            <g class="monster-arm-item">
              <path d="M ${cfg.shX},${cfg.shY} Q ${midX},${midY} ${targetX},${targetY}" 
                    fill="none" stroke="${pal.main}" stroke-width="22" stroke-linecap="round"/>
              <path d="M ${cfg.shX},${cfg.shY} Q ${midX},${midY} ${targetX},${targetY}" 
                    fill="none" stroke="${pal.stroke}" stroke-width="4.5" stroke-linecap="round"/>
              
              <g transform="translate(${targetX}, ${targetY})">
                ${hasGloves ? `
                  <circle cx="0" cy="0" r="16" fill="${gloveColor}" stroke="${pal.stroke}" stroke-width="3.5"/>
                  <circle cx="${dir * 8}" cy="-8" r="6.5" fill="${gloveColor}" stroke="${pal.stroke}" stroke-width="2"/>
                  <rect x="-12" y="6" width="24" height="7" rx="3" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
                ` : hand === 'claws' ? `
                  <circle cx="0" cy="0" r="13" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="3.5"/>
                  <polygon points="${dir * -8},-8 ${dir * -14},-20 ${dir * -2},-10" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
                  <polygon points="0,-10 ${dir * 4},-22 ${dir * 6},-8" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
                  <polygon points="${dir * 8},-6 ${dir * 18},-16 ${dir * 12},-2" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
                ` : hand === 'giant' ? `
                  <circle cx="0" cy="0" r="22" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5"/>
                  <circle cx="${dir * -10}" cy="-12" r="8" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="2"/>
                  <circle cx="${dir * 10}" cy="-12" r="8" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="2"/>
                ` : hand === 'tiny' ? `
                  <circle cx="0" cy="0" r="8" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="3"/>
                ` : hand === 'four_fingers' ? `
                  <circle cx="0" cy="0" r="15" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="3.5"/>
                  <circle cx="${dir * -9}" cy="-8" r="4" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
                  <circle cx="${dir * -3}" cy="-10" r="4" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
                  <circle cx="${dir * 3}" cy="-10" r="4" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
                  <circle cx="${dir * 9}" cy="-8" r="4" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
                ` : `
                  <circle cx="0" cy="0" r="14" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="3.5"/>
                  <circle cx="${dir * -6}" cy="-8" r="5" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
                  <circle cx="${dir * 6}" cy="-8" r="5" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
                `}
              </g>
            </g>
          `;
        }).join('')}
      </g>
    `;
  }

  // 18. Eyes (Predefined balanced face slots)
  renderEyes(monster, anchors) {
    const count = monster.eyes.count;
    const size = monster.eyes.size || 'big';
    const style = monster.eyes.style || 'round';
    const f = anchors.face;

    let rBase = 20;
    if (size === 'tiny') rBase = 9;
    else if (size === 'small') rBase = 14;
    else if (size === 'giant') rBase = 32;

    let eyeConfigs = [];
    if (count === 1) {
      eyeConfigs = [{ cx: f.cx, cy: f.eyeY, r: rBase * 1.3 }];
    } else if (count === 2) {
      eyeConfigs = [
        { cx: f.cx - 32, cy: f.eyeY, r: rBase },
        { cx: f.cx + 32, cy: f.eyeY, r: rBase }
      ];
    } else if (count === 3) {
      eyeConfigs = [
        { cx: f.cx - 54, cy: f.eyeY + 4, r: rBase * 0.85 },
        { cx: f.cx,      cy: f.eyeY - 6, r: rBase * 0.95 },
        { cx: f.cx + 54, cy: f.eyeY + 4, r: rBase * 0.85 }
      ];
    } else if (count === 4) {
      eyeConfigs = [
        { cx: f.cx - 52, cy: f.eyeY - 6, r: rBase * 0.75 },
        { cx: f.cx - 18, cy: f.eyeY - 10, r: rBase * 0.8 },
        { cx: f.cx + 18, cy: f.eyeY - 10, r: rBase * 0.8 },
        { cx: f.cx + 52, cy: f.eyeY - 6, r: rBase * 0.75 }
      ];
    } else { // many (5 eyes)
      eyeConfigs = [
        { cx: f.cx - 58, cy: f.eyeY + 4, r: rBase * 0.7 },
        { cx: f.cx - 28, cy: f.eyeY - 10, r: rBase * 0.75 },
        { cx: f.cx,      cy: f.eyeY + 10, r: rBase * 0.8 },
        { cx: f.cx + 28, cy: f.eyeY - 10, r: rBase * 0.75 },
        { cx: f.cx + 58, cy: f.eyeY + 4, r: rBase * 0.7 }
      ];
    }

    return `
      <g class="monster-eyes-group">
        ${eyeConfigs.map((eye, idx) => {
          let pupilContent = `
            <circle cx="${eye.cx}" cy="${eye.cy + 1.5}" r="${eye.r * 0.58}" fill="#0284c7" />
            <circle cx="${eye.cx}" cy="${eye.cy + 1.5}" r="${eye.r * 0.42}" fill="#0f172a" />
            <circle cx="${eye.cx - eye.r * 0.22}" cy="${eye.cy - eye.r * 0.22}" r="${eye.r * 0.22}" fill="#ffffff" />
            <circle cx="${eye.cx + eye.r * 0.24}" cy="${eye.cy + eye.r * 0.24}" r="${eye.r * 0.11}" fill="#ffffff" />
          `;

          if (style === 'star') {
            pupilContent = `
              <polygon points="${eye.cx},${eye.cy - eye.r*0.6} ${eye.cx + eye.r*0.18},${eye.cy - eye.r*0.18} ${eye.cx + eye.r*0.6},${eye.cy} ${eye.cx + eye.r*0.18},${eye.cy + eye.r*0.18} ${eye.cx},${eye.cy + eye.r*0.6} ${eye.cx - eye.r*0.18},${eye.cy + eye.r*0.18} ${eye.cx - eye.r*0.6},${eye.cy} ${eye.cx - eye.r*0.18},${eye.cy - eye.r*0.18}" fill="#eab308"/>
              <circle cx="${eye.cx}" cy="${eye.cy}" r="${eye.r*0.25}" fill="#0f172a"/>
            `;
          } else if (style === 'heart') {
            pupilContent = `
              <path d="M ${eye.cx},${eye.cy - eye.r*0.2} C ${eye.cx - eye.r*0.5},${eye.cy - eye.r*0.6} ${eye.cx - eye.r*0.7},${eye.cy + eye.r*0.1} ${eye.cx},${eye.cy + eye.r*0.6} C ${eye.cx + eye.r*0.7},${eye.cy + eye.r*0.1} ${eye.cx + eye.r*0.5},${eye.cy - eye.r*0.6} ${eye.cx},${eye.cy - eye.r*0.2} Z" fill="#ec4899"/>
              <circle cx="${eye.cx - eye.r*0.15}" cy="${eye.cy - eye.r*0.1}" r="${eye.r*0.12}" fill="#ffffff"/>
            `;
          } else if (style === 'sleepy') {
            pupilContent = `
              <circle cx="${eye.cx}" cy="${eye.cy + eye.r*0.2}" r="${eye.r * 0.35}" fill="#0f172a"/>
              <path d="M ${eye.cx - eye.r},${eye.cy} Q ${eye.cx},${eye.cy + eye.r*0.3} ${eye.cx + eye.r},${eye.cy}" fill="${monster.color || '#a855f7'}" stroke="#0f172a" stroke-width="2.5"/>
            `;
          } else if (style === 'happy') {
            pupilContent = `
              <path d="M ${eye.cx - eye.r*0.7},${eye.cy + eye.r*0.2} Q ${eye.cx},${eye.cy - eye.r*0.6} ${eye.cx + eye.r*0.7},${eye.cy + eye.r*0.2}" fill="none" stroke="#0f172a" stroke-width="4.5" stroke-linecap="round"/>
            `;
          } else if (style === 'angry') {
            pupilContent = `
              <circle cx="${eye.cx}" cy="${eye.cy + 1.5}" r="${eye.r * 0.42}" fill="#ef4444" />
              <path d="M ${eye.cx - eye.r},${eye.cy - eye.r*0.5} L ${eye.cx + eye.r},${eye.cy - eye.r*0.1}" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
            `;
          } else if (style === 'surprised') {
            pupilContent = `
              <circle cx="${eye.cx}" cy="${eye.cy}" r="${eye.r * 0.28}" fill="#0f172a"/>
              <path d="M ${eye.cx - eye.r*0.6},${eye.cy - eye.r*0.9} Q ${eye.cx},${eye.cy - eye.r*1.2} ${eye.cx + eye.r*0.6},${eye.cy - eye.r*0.9}" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
            `;
          } else if (style === 'funny') {
            pupilContent = `
              <circle cx="${eye.cx + (idx % 2 === 0 ? eye.r*0.3 : -eye.r*0.3)}" cy="${eye.cy + (idx % 2 === 0 ? -eye.r*0.2 : eye.r*0.2)}" r="${eye.r * 0.45}" fill="#10b981"/>
              <circle cx="${eye.cx + (idx % 2 === 0 ? eye.r*0.3 : -eye.r*0.3)}" cy="${eye.cy + (idx % 2 === 0 ? -eye.r*0.2 : eye.r*0.2)}" r="${eye.r * 0.25}" fill="#0f172a"/>
              <circle cx="${eye.cx}" cy="${eye.cy}" r="${eye.r * 0.12}" fill="#ffffff"/>
            `;
          }

          return `
            <g class="monster-single-eye eye-idx-${idx}">
              <ellipse cx="${eye.cx}" cy="${eye.cy}" rx="${eye.r}" ry="${eye.r * 1.05}" fill="#ffffff" stroke="#0f172a" stroke-width="3.5" />
              ${pupilContent}
            </g>
          `;
        }).join('')}
      </g>
    `;
  }

  // 19. Glasses
  renderGlasses(monster, anchors) {
    if (!monster.accessories) return '';
    const hasGlasses = monster.accessories.includes('glasses');
    const hasSunglasses = monster.accessories.includes('sunglasses');
    if (!hasGlasses && !hasSunglasses) return '';

    const f = anchors.face;
    const lensFill = hasSunglasses ? '#0f172a' : 'rgba(255,255,255,0.35)';

    return `
      <g class="accessory-glasses" transform="translate(${f.cx}, ${f.eyeY})">
        <circle cx="-35" cy="0" r="25" fill="${lensFill}" stroke="#0f172a" stroke-width="6"/>
        <circle cx="35" cy="0" r="25" fill="${lensFill}" stroke="#0f172a" stroke-width="6"/>
        <path d="M -10,-2 Q 0,-8 10,-2" fill="none" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
        ${!hasSunglasses ? `
          <line x1="-45" y1="-10" x2="-25" y2="10" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="25" y1="-10" x2="45" y2="10" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
        ` : ''}
      </g>
    `;
  }

  // 20. Nose
  renderNose(monster, pal, anchors) {
    const style = monster.nose;
    if (!style || style === 'none') return '';
    const f = anchors.face;

    if (style === 'long') {
      return `
        <g class="monster-nose-group">
          <path d="M ${f.cx - 6},${f.noseY - 2} Q ${f.cx},${f.noseY + 23} ${f.cx + 15},${f.noseY + 23} Q ${f.cx + 5},${f.noseY - 2} ${f.cx + 2},${f.noseY - 4} Z" fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="3.5"/>
        </g>
      `;
    } else if (style === 'funny') {
      return `
        <g class="monster-nose-group">
          <ellipse cx="${f.cx}" cy="${f.noseY + 2}" rx="20" ry="14" fill="#ef4444" stroke="${pal.stroke}" stroke-width="3.5"/>
          <circle cx="${f.cx - 6}" cy="${f.noseY - 2}" r="5" fill="#ffffff" opacity="0.6"/>
        </g>
      `;
    } else if (style === 'round' || style === 'big') {
      return `
        <g class="monster-nose-group">
          <ellipse cx="${f.cx}" cy="${f.noseY + 2}" rx="16" ry="12" fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="3.5"/>
          <ellipse cx="${f.cx - 5}" cy="${f.noseY - 2}" rx="5" ry="3.5" fill="#ffffff" opacity="0.6"/>
        </g>
      `;
    } else { // tiny, small
      return `
        <g class="monster-nose-group">
          <ellipse cx="${f.cx}" cy="${f.noseY}" rx="${style === 'tiny' ? 5 : 8}" ry="${style === 'tiny' ? 4 : 6}" fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="3"/>
          <circle cx="${f.cx - 2}" cy="${f.noseY - 2}" r="2" fill="#ffffff" opacity="0.6"/>
        </g>
      `;
    }
  }

  // 21. Mouth & Teeth (contained strictly inside mouth cavity)
  renderMouthAndTeeth(monster, anchors) {
    const mouthType = monster.mouth || 'big';
    const teethType = monster.teeth || 'sharp';
    const f = anchors.face;

    let mouthCavity = '';
    let teethItems = '';

    if (mouthType === 'huge' || mouthType === 'big' || mouthType === 'smiling' || mouthType === 'happy') {
      mouthCavity = `
        <path d="M ${f.cx - 48},${f.mouthY - 16} Q ${f.cx},${f.mouthY + 40} ${f.cx + 48},${f.mouthY - 16} Z" fill="#e11d48" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M ${f.cx - 25},${f.mouthY + 16} Q ${f.cx},${f.mouthY - 6} ${f.cx + 25},${f.mouthY + 16} Q ${f.cx},${f.mouthY + 40} ${f.cx - 25},${f.mouthY + 16} Z" fill="#fb7185"/>
      `;

      if (teethType === 'sharp' || teethType === 'vampire') {
        teethItems = `
          <polygon points="${f.cx - 28},${f.mouthY - 16} ${f.cx - 21},${f.mouthY} ${f.cx - 14},${f.mouthY - 16}" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="${f.cx - 7},${f.mouthY - 16} ${f.cx},${f.mouthY + 6} ${f.cx + 7},${f.mouthY - 16}" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="${f.cx + 14},${f.mouthY - 16} ${f.cx + 21},${f.mouthY} ${f.cx + 28},${f.mouthY - 16}" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
        `;
      } else if (teethType === 'giant') {
        teethItems = `
          <rect x="${f.cx - 8}" y="${f.mouthY - 16}" width="16" height="22" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
        `;
      } else if (teethType === 'big') {
        teethItems = `
          <rect x="${f.cx - 11}" y="${f.mouthY - 16}" width="10" height="14" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
          <rect x="${f.cx + 1}" y="${f.mouthY - 16}" width="10" height="14" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
        `;
      } else if (teethType === 'small') {
        teethItems = `
          <circle cx="${f.cx - 24}" cy="${f.mouthY - 13}" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="${f.cx - 14}" cy="${f.mouthY - 13}" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="${f.cx - 4}" cy="${f.mouthY - 13}" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="${f.cx + 4}" cy="${f.mouthY - 13}" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="${f.cx + 14}" cy="${f.mouthY - 13}" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="${f.cx + 24}" cy="${f.mouthY - 13}" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
        `;
      }
    } else if (mouthType === 'scary') {
      mouthCavity = `
        <path d="M ${f.cx - 54},${f.mouthY - 14} Q ${f.cx},${f.mouthY - 26} ${f.cx + 54},${f.mouthY - 14} Q ${f.cx + 42},${f.mouthY + 36} ${f.cx},${f.mouthY + 32} Q ${f.cx - 42},${f.mouthY + 36} ${f.cx - 54},${f.mouthY - 14} Z" 
              fill="#881337" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
      `;

      if (teethType === 'sharp' || teethType === 'vampire') {
        teethItems = `
          <polygon points="${f.cx - 44},${f.mouthY - 14} ${f.cx - 36},${f.mouthY + 7} ${f.cx - 28},${f.mouthY - 15}" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="${f.cx - 22},${f.mouthY - 17} ${f.cx - 13},${f.mouthY + 14} ${f.cx - 4},${f.mouthY - 18}" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="${f.cx + 4},${f.mouthY - 18} ${f.cx + 13},${f.mouthY + 14} ${f.cx + 22},${f.mouthY - 17}" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="${f.cx + 28},${f.mouthY - 15} ${f.cx + 36},${f.mouthY + 7} ${f.cx + 44},${f.mouthY - 14}" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
        `;
      } else if (teethType === 'giant') {
        teethItems = `<rect x="${f.cx - 10}" y="${f.mouthY - 18}" width="20" height="26" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>`;
      } else if (teethType === 'big') {
        teethItems = `
          <rect x="${f.cx - 16}" y="${f.mouthY - 18}" width="14" height="18" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
          <rect x="${f.cx + 2}" y="${f.mouthY - 18}" width="14" height="18" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
        `;
      }
    } else { // tiny, small, surprised
      mouthCavity = `
        <path d="M ${f.cx - 22},${f.mouthY - 12} Q ${f.cx},${f.mouthY + 14} ${f.cx + 22},${f.mouthY - 12} Z" fill="#be123c" stroke="#0f172a" stroke-width="4" stroke-linejoin="round"/>
        <path d="M ${f.cx - 12},${f.mouthY + 4} Q ${f.cx},${f.mouthY - 4} ${f.cx + 12},${f.mouthY + 4} Q ${f.cx},${f.mouthY + 14} ${f.cx - 12},${f.mouthY + 4} Z" fill="#fb7185"/>
      `;

      if (teethType === 'sharp') {
        teethItems = `
          <polygon points="${f.cx - 10},${f.mouthY - 12} ${f.cx - 5},${f.mouthY - 3} ${f.cx},${f.mouthY - 12}" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <polygon points="${f.cx},${f.mouthY - 12} ${f.cx + 5},${f.mouthY - 3} ${f.cx + 10},${f.mouthY - 12}" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
        `;
      }
    }

    return `
      <g class="monster-mouth-group">
        ${mouthCavity}
        ${teethItems}
      </g>
    `;
  }

  // 22. Neck Accessories
  renderNeckAccessories(monster, anchors) {
    if (!monster.accessories || !Array.isArray(monster.accessories)) return '';
    const accColors = monster.accessoryColors || {};
    const c = anchors.cape;
    let html = '';

    if (monster.accessories.includes('scarf')) {
      const scarfColor = this.getClothColor(accColors.scarf || 'red', '#dc2626');
      html += `
        <g class="accessory-scarf" transform="translate(${c.x}, ${c.y + 4})">
          <path d="M -58,-8 Q 0,22 58,-8 Q 0,38 -58,-8 Z" fill="${scarfColor}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M 18,12 L 32,82 L 54,78 L 42,12 Z" fill="${scarfColor}" stroke="#0f172a" stroke-width="4" stroke-linejoin="round"/>
        </g>
      `;
    }

    if (monster.accessories.includes('bow')) {
      const bowColor = this.getClothColor(accColors.bow || 'pink', '#ec4899');
      html += `
        <g class="accessory-bow" transform="translate(${c.x}, ${c.y + 10})">
          <polygon points="0,0 -24,-14 -24,14" fill="${bowColor}" stroke="#0f172a" stroke-width="3.5"/>
          <polygon points="0,0 24,-14 24,14" fill="${bowColor}" stroke="#0f172a" stroke-width="3.5"/>
          <circle cx="0" cy="0" r="7" fill="#facc15" stroke="#0f172a" stroke-width="2.5"/>
        </g>
      `;
    }

    if (monster.accessories.includes('necklace')) {
      html += `
        <g class="accessory-necklace" transform="translate(${c.x}, ${c.y + 12})">
          <path d="M -45,-4 Q 0,32 45,-4" fill="none" stroke="#facc15" stroke-width="4"/>
          <circle cx="0" cy="18" r="7" fill="#ef4444" stroke="#78350f" stroke-width="2"/>
        </g>
      `;
    }

    return html;
  }

  // 23. Cape Clasp
  renderCapeFront(anchors) {
    const c = anchors.cape;
    return `
      <g class="monster-cape-front">
        <path d="M ${c.x - 66},${c.y} Q ${c.x},${c.y + 20} ${c.x + 66},${c.y}" fill="none" stroke="#be123c" stroke-width="7" stroke-linecap="round"/>
        <circle cx="${c.x}" cy="${c.y + 10}" r="8.5" fill="#facc15" stroke="#ca8a04" stroke-width="3"/>
        <polygon points="${c.x},${c.y + 5} ${c.x + 2},${c.y + 9} ${c.x + 6},${c.y + 10} ${c.x + 3},${c.y + 13} ${c.x + 4},${c.y + 17} ${c.x},${c.y + 15} ${c.x - 4},${c.y + 17} ${c.x - 3},${c.y + 13} ${c.x - 6},${c.y + 10} ${c.x - 2},${c.y + 9}" fill="#ffffff" />
      </g>
    `;
  }

  // 24. Head Accessories
  renderHeadAccessories(monster, anchors) {
    if (!monster.accessories || !Array.isArray(monster.accessories)) return '';
    const accColors = monster.accessoryColors || {};
    const top = anchors.headTop;
    const f = anchors.face;
    let html = '';

    if (monster.accessories.includes('earrings')) {
      html += `
        <g class="accessory-earrings">
          <circle cx="${f.cx - 72}" cy="${f.eyeY + 4}" r="8" fill="none" stroke="#facc15" stroke-width="3.5"/>
          <circle cx="${f.cx + 72}" cy="${f.eyeY + 4}" r="8" fill="none" stroke="#facc15" stroke-width="3.5"/>
        </g>
      `;
    }

    if (monster.accessories.includes('crown')) {
      html += `
        <g class="accessory-crown" transform="translate(${top.x}, ${top.y - 1})">
          <polygon points="-42,0 -38,-42 -16,-14 0,-48 16,-14 38,-42 42,0" 
                   fill="url(#goldGrad)" stroke="#78350f" stroke-width="3.5" stroke-linejoin="round"/>
          <rect x="-44" y="-2" width="88" height="11" rx="4" fill="#ca8a04" stroke="#78350f" stroke-width="2"/>
          <circle cx="0" cy="-34" r="5" fill="#ef4444"/>
          <circle cx="-34" cy="-30" r="4.5" fill="#3b82f6"/>
          <circle cx="34" cy="-30" r="4.5" fill="#10b981"/>
        </g>
      `;
    }

    if (monster.accessories.includes('wizard_hat')) {
      html += `
        <g class="accessory-wizard-hat" transform="translate(${top.x}, ${top.y - 1})">
          <ellipse cx="0" cy="6" rx="65" ry="14" fill="#6d28d9" stroke="#0f172a" stroke-width="4"/>
          <path d="M -35,4 Q -10,-80 40,-85 Q 20,-30 35,4 Z" fill="#7c3aed" stroke="#0f172a" stroke-width="4"/>
          <polygon points="12,-45 15,-40 22,-40 17,-35 19,-28 12,-32 5,-28 7,-35 2,-40 9,-40" fill="#facc15"/>
        </g>
      `;
    } else if (monster.accessories.includes('pirate_hat')) {
      html += `
        <g class="accessory-pirate-hat" transform="translate(${top.x}, ${top.y + 3})">
          <path d="M -65,10 Q 0,-45 65,10 Q 0,0 -65,10 Z" fill="#0f172a" stroke="#ffffff" stroke-width="3"/>
          <circle cx="0" cy="-6" r="6" fill="#ffffff"/>
        </g>
      `;
    } else if (monster.accessories.includes('helmet')) {
      html += `
        <g class="accessory-helmet" transform="translate(${top.x}, ${top.y + 5})">
          <path d="M -50,15 C -50,-45 50,-45 50,15 Z" fill="#94a3b8" stroke="#0f172a" stroke-width="4"/>
          <polygon points="0,-45 8,-20 -8,-20" fill="#facc15"/>
        </g>
      `;
    } else if (monster.accessories.includes('hat')) {
      const hatColor = this.getClothColor(accColors.hat || 'yellow', '#eab308');
      html += `
        <g class="accessory-hat" transform="translate(${top.x}, ${top.y + 1})">
          <ellipse cx="0" cy="8" rx="60" ry="11" fill="${hatColor}" stroke="#0f172a" stroke-width="4"/>
          <path d="M -32,8 L -24,-58 L 24,-58 L 32,8 Z" fill="${hatColor}" stroke="#0f172a" stroke-width="4"/>
          <rect x="-32" y="-4" width="64" height="12" fill="#ef4444" stroke="#0f172a" stroke-width="2"/>
        </g>
      `;
    } else if (monster.accessories.includes('cap')) {
      const capColor = this.getClothColor(accColors.cap || 'blue', '#2563eb');
      html += `
        <g class="accessory-cap" transform="translate(${top.x}, ${top.y + 7})">
          <path d="M -42,8 C -42,-32 42,-32 42,8 Z" fill="${capColor}" stroke="#0f172a" stroke-width="4"/>
          <path d="M -42,6 Q -72,16 -66,24 Q -38,20 -14,8 Z" fill="${capColor}" stroke="#0f172a" stroke-width="3.5"/>
          <circle cx="0" cy="-30" r="4" fill="#facc15" stroke="#0f172a" stroke-width="1.5"/>
        </g>
      `;
    }

    return html;
  }

  // 25. Powers FX
  renderPowerAura(monster) {
    if (!monster.powers || monster.powers.length === 0) return '';
    let fx = '';

    if (monster.powers.includes('shoot_lightning')) {
      fx += `
        <g class="monster-power-fx lightning-fx">
          <path d="M 120,180 L 100,210 L 125,215 L 90,255" stroke="#facc15" stroke-width="4.5" fill="none" stroke-linecap="round"/>
          <path d="M 280,180 L 300,210 L 275,215 L 310,255" stroke="#facc15" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        </g>
      `;
    }

    if (monster.powers.includes('breathe_fire')) {
      fx += `
        <g class="monster-power-fx fire-fx">
          <path d="M 200,210 Q 230,230 255,205 Q 240,245 285,235 Q 245,260 200,225 Z" fill="#f97316" opacity="0.85"/>
          <circle cx="230" cy="225" r="8" fill="#fde047"/>
        </g>
      `;
    }

    if (monster.powers.includes('make_ice')) {
      fx += `
        <g class="monster-power-fx ice-fx">
          <polygon points="120,380 130,340 140,380" fill="#38bdf8" opacity="0.8"/>
          <polygon points="260,380 270,335 280,380" fill="#38bdf8" opacity="0.8"/>
        </g>
      `;
    }

    if (monster.powers.includes('magic')) {
      fx += `
        <g class="monster-power-fx magic-fx">
          <polygon points="90,140 94,150 105,150 96,156 99,166 90,160 81,166 84,156 75,150 86,150" fill="#c084fc" opacity="0.85"/>
          <polygon points="310,140 314,150 325,150 316,156 319,166 310,160 301,166 304,156 295,150 306,150" fill="#c084fc" opacity="0.85"/>
        </g>
      `;
    }

    if (monster.powers.includes('fly')) {
      fx += `
        <g class="monster-power-fx fly-fx">
          <path d="M 160,435 Q 200,425 240,435" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" opacity="0.6"/>
          <path d="M 140,445 Q 200,435 260,445" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" opacity="0.4"/>
        </g>
      `;
    }

    if (monster.powers.includes('run_fast')) {
      fx += `
        <g class="monster-power-fx run-fx">
          <circle cx="100" cy="425" r="8" fill="#cbd5e1" opacity="0.7"/>
          <circle cx="85" cy="420" r="5" fill="#cbd5e1" opacity="0.5"/>
        </g>
      `;
    }

    return fx;
  }
}

window.monsterRenderer = new MonsterRenderer();
