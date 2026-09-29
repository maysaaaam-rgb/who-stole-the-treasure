/**
 * monsterBuilder.js - Master Engine for "Build Your Own Monster!"
 * Features:
 *  1. MonsterAnchorRegistry: Master anchor (x0, y0) & socket positioning for 9 body types.
 *  2. MonsterRenderer: Layered vector engine conforming strictly to:
 *     Backdrops -> Tail/Wings -> Back Limbs -> Torso/Head Base -> Eyes/Mouth -> Front Limbs -> Clothes/Accessories.
 *  3. SoundEngine: Procedural Web Audio API polyphonic chords & TTS voice.
 *  4. MonsterActions: 4 interactive triggers (Tickle/Laugh, Feed/Eat, Dance, Sleep).
 *  5. MonsterPhaseWizard: 3-Phase grouped hierarchy with sub-step indicators.
 *  6. MonsterPassportEngine: Step 12 exportable Monster Passport / ID Card with PNG Canvas download and Print.
 */

// =============================================================================
// 1. HIERARCHICAL ANCHOR REGISTRY & SOCKET SYSTEM
// =============================================================================
class MonsterAnchorRegistry {
  constructor() {
    // Master Torso Anchor Origin (x0, y0)
    this.TORSO_ORIGIN = { x0: 200, y0: 240 };

    // Standardized sockets defined for all 9 body types
    this.sockets = {
      round: {
        id: 'round',
        torso: { cx: 200, cy: 235, rx: 78, ry: 74 },
        headTop: { x: 200, y: 95 },
        faceCenter: { cx: 200, cy: 175, eyeY: 148, noseY: 175, mouthY: 210, width: 88 },
        armLeft:  { x: 122, y: 224, rot: -28 },
        armRight: { x: 278, y: 224, rot: 28 },
        legLeft:  { x: 156, y: 340, rot: -4 },
        legRight: { x: 244, y: 340, rot: 4 },
        ears:     { left: { x: 135, y: 122, rot: -26 }, right: { x: 265, y: 122, rot: 26 } },
        horns:    { left: { x: 162, y: 102, rot: -18 }, right: { x: 238, y: 102, rot: 18 } },
        tail:     { x: 135, y: 330 },
        wings:    { left: { x: 138, y: 195 }, right: { x: 262, y: 195 } },
        cape:     { x: 200, y: 212 },
        legs: [
          [{ x: 200, y: 345 }],
          [{ x: 156, y: 340, rot: -4 }, { x: 244, y: 340, rot: 4 }],
          [{ x: 140, y: 340, rot: -10 }, { x: 200, y: 345, rot: 0 }, { x: 260, y: 340, rot: 10 }],
          [{ x: 128, y: 338, rot: -14 }, { x: 176, y: 345, rot: -4 }, { x: 224, y: 345, rot: 4 }, { x: 272, y: 338, rot: 14 }],
          [{ x: 120, y: 338, rot: -16 }, { x: 160, y: 345, rot: -8 }, { x: 200, y: 348, rot: 0 }, { x: 240, y: 345, rot: 8 }, { x: 280, y: 338, rot: 16 }]
        ]
      },
      tall: {
        id: 'tall',
        torso: { cx: 200, cy: 220, rx: 62, ry: 135 },
        headTop: { x: 200, y: 75 },
        faceCenter: { cx: 200, cy: 165, eyeY: 136, noseY: 164, mouthY: 198, width: 80 },
        armLeft:  { x: 136, y: 214, rot: -28 },
        armRight: { x: 264, y: 214, rot: 28 },
        legLeft:  { x: 165, y: 350, rot: -3 },
        legRight: { x: 235, y: 350, rot: 3 },
        ears:     { left: { x: 142, y: 112, rot: -24 }, right: { x: 258, y: 112, rot: 24 } },
        horns:    { left: { x: 166, y: 84, rot: -16 }, right: { x: 234, y: 84, rot: 16 } },
        tail:     { x: 145, y: 340 },
        wings:    { left: { x: 142, y: 185 }, right: { x: 258, y: 185 } },
        cape:     { x: 200, y: 204 },
        legs: [
          [{ x: 200, y: 355 }],
          [{ x: 165, y: 350, rot: -3 }, { x: 235, y: 350, rot: 3 }],
          [{ x: 152, y: 350, rot: -8 }, { x: 200, y: 355, rot: 0 }, { x: 248, y: 350, rot: 8 }],
          [{ x: 142, y: 348, rot: -12 }, { x: 180, y: 355, rot: -3 }, { x: 220, y: 355, rot: 3 }, { x: 258, y: 348, rot: 12 }],
          [{ x: 135, y: 348, rot: -14 }, { x: 168, y: 355, rot: -7 }, { x: 200, y: 356, rot: 0 }, { x: 232, y: 355, rot: 7 }, { x: 265, y: 348, rot: 14 }]
        ]
      },
      short: {
        id: 'short',
        torso: { cx: 200, cy: 240, rx: 85, ry: 65 },
        headTop: { x: 200, y: 118 },
        faceCenter: { cx: 200, cy: 185, eyeY: 158, noseY: 184, mouthY: 218, width: 92 },
        armLeft:  { x: 116, y: 234, rot: -28 },
        armRight: { x: 284, y: 234, rot: 28 },
        legLeft:  { x: 150, y: 330, rot: -5 },
        legRight: { x: 250, y: 330, rot: 5 },
        ears:     { left: { x: 128, y: 142, rot: -28 }, right: { x: 272, y: 142, rot: 28 } },
        horns:    { left: { x: 156, y: 124, rot: -20 }, right: { x: 244, y: 124, rot: 20 } },
        tail:     { x: 128, y: 320 },
        wings:    { left: { x: 126, y: 205 }, right: { x: 274, y: 205 } },
        cape:     { x: 200, y: 220 },
        legs: [
          [{ x: 200, y: 335 }],
          [{ x: 150, y: 330, rot: -5 }, { x: 250, y: 330, rot: 5 }],
          [{ x: 135, y: 330, rot: -10 }, { x: 200, y: 335, rot: 0 }, { x: 265, y: 330, rot: 10 }],
          [{ x: 124, y: 328, rot: -14 }, { x: 172, y: 335, rot: -4 }, { x: 228, y: 335, rot: 4 }, { x: 276, y: 328, rot: 14 }],
          [{ x: 116, y: 328, rot: -16 }, { x: 158, y: 335, rot: -8 }, { x: 200, y: 338, rot: 0 }, { x: 242, y: 335, rot: 8 }, { x: 284, y: 328, rot: 16 }]
        ]
      },
      wide: {
        id: 'wide',
        torso: { cx: 200, cy: 230, rx: 105, ry: 75 },
        headTop: { x: 200, y: 94 },
        faceCenter: { cx: 200, cy: 178, eyeY: 148, noseY: 175, mouthY: 212, width: 104 },
        armLeft:  { x: 104, y: 224, rot: -30 },
        armRight: { x: 296, y: 224, rot: 30 },
        legLeft:  { x: 145, y: 342, rot: -5 },
        legRight: { x: 255, y: 342, rot: 5 },
        ears:     { left: { x: 118, y: 130, rot: -32 }, right: { x: 282, y: 130, rot: 32 } },
        horns:    { left: { x: 152, y: 100, rot: -22 }, right: { x: 248, y: 100, rot: 22 } },
        tail:     { x: 115, y: 330 },
        wings:    { left: { x: 115, y: 195 }, right: { x: 285, y: 195 } },
        cape:     { x: 200, y: 212 },
        legs: [
          [{ x: 200, y: 345 }],
          [{ x: 145, y: 342, rot: -5 }, { x: 255, y: 342, rot: 5 }],
          [{ x: 130, y: 340, rot: -10 }, { x: 200, y: 345, rot: 0 }, { x: 270, y: 340, rot: 10 }],
          [{ x: 118, y: 338, rot: -15 }, { x: 170, y: 345, rot: -5 }, { x: 230, y: 345, rot: 5 }, { x: 282, y: 338, rot: 15 }],
          [{ x: 110, y: 338, rot: -18 }, { x: 155, y: 345, rot: -9 }, { x: 200, y: 348, rot: 0 }, { x: 245, y: 345, rot: 9 }, { x: 290, y: 338, rot: 18 }]
        ]
      },
      thin: {
        id: 'thin',
        torso: { cx: 200, cy: 230, rx: 48, ry: 130 },
        headTop: { x: 200, y: 84 },
        faceCenter: { cx: 200, cy: 168, eyeY: 138, noseY: 166, mouthY: 200, width: 72 },
        armLeft:  { x: 146, y: 215, rot: -25 },
        armRight: { x: 254, y: 215, rot: 25 },
        legLeft:  { x: 172, y: 350, rot: -3 },
        legRight: { x: 228, y: 350, rot: 3 },
        ears:     { left: { x: 146, y: 115, rot: -22 }, right: { x: 254, y: 115, rot: 22 } },
        horns:    { left: { x: 170, y: 90, rot: -14 }, right: { x: 230, y: 90, rot: 14 } },
        tail:     { x: 150, y: 345 },
        wings:    { left: { x: 148, y: 190 }, right: { x: 252, y: 190 } },
        cape:     { x: 200, y: 205 },
        legs: [
          [{ x: 200, y: 355 }],
          [{ x: 172, y: 350, rot: -3 }, { x: 228, y: 350, rot: 3 }],
          [{ x: 160, y: 350, rot: -7 }, { x: 200, y: 355, rot: 0 }, { x: 240, y: 350, rot: 7 }],
          [{ x: 150, y: 348, rot: -10 }, { x: 182, y: 355, rot: -3 }, { x: 218, y: 355, rot: 3 }, { x: 250, y: 348, rot: 10 }],
          [{ x: 145, y: 348, rot: -12 }, { x: 172, y: 355, rot: -6 }, { x: 200, y: 356, rot: 0 }, { x: 228, y: 355, rot: 6 }, { x: 255, y: 348, rot: 12 }]
        ]
      },
      blob: {
        id: 'blob',
        torso: { cx: 200, cy: 235, rx: 88, ry: 80 },
        headTop: { x: 200, y: 90 },
        faceCenter: { cx: 200, cy: 174, eyeY: 144, noseY: 172, mouthY: 208, width: 90 },
        armLeft:  { x: 118, y: 222, rot: -28 },
        armRight: { x: 282, y: 222, rot: 28 },
        legLeft:  { x: 154, y: 340, rot: -4 },
        legRight: { x: 246, y: 340, rot: 4 },
        ears:     { left: { x: 132, y: 120, rot: -28 }, right: { x: 268, y: 120, rot: 28 } },
        horns:    { left: { x: 160, y: 98, rot: -18 }, right: { x: 240, y: 98, rot: 18 } },
        tail:     { x: 130, y: 330 },
        wings:    { left: { x: 130, y: 195 }, right: { x: 270, y: 195 } },
        cape:     { x: 200, y: 212 },
        legs: [
          [{ x: 200, y: 345 }],
          [{ x: 154, y: 340, rot: -4 }, { x: 246, y: 340, rot: 4 }],
          [{ x: 138, y: 340, rot: -10 }, { x: 200, y: 345, rot: 0 }, { x: 262, y: 340, rot: 10 }],
          [{ x: 126, y: 338, rot: -14 }, { x: 174, y: 345, rot: -4 }, { x: 226, y: 345, rot: 4 }, { x: 274, y: 338, rot: 14 }],
          [{ x: 118, y: 338, rot: -16 }, { x: 158, y: 345, rot: -8 }, { x: 200, y: 348, rot: 0 }, { x: 242, y: 345, rot: 8 }, { x: 282, y: 338, rot: 16 }]
        ]
      },
      ghost: {
        id: 'ghost',
        torso: { cx: 200, cy: 240, rx: 85, ry: 95 },
        headTop: { x: 200, y: 94 },
        faceCenter: { cx: 200, cy: 178, eyeY: 148, noseY: 176, mouthY: 212, width: 88 },
        armLeft:  { x: 124, y: 228, rot: -28 },
        armRight: { x: 276, y: 228, rot: 28 },
        legLeft:  { x: 180, y: 370, rot: 0 },
        legRight: { x: 220, y: 370, rot: 0 },
        ears:     { left: { x: 132, y: 125, rot: -26 }, right: { x: 268, y: 125, rot: 26 } },
        horns:    { left: { x: 160, y: 100, rot: -18 }, right: { x: 240, y: 100, rot: 18 } },
        tail:     { x: 132, y: 335 },
        wings:    { left: { x: 135, y: 200 }, right: { x: 265, y: 200 } },
        cape:     { x: 200, y: 216 },
        legs: [[{ x: 200, y: 350 }]]
      },
      dinosaur: {
        id: 'dinosaur',
        torso: { cx: 195, cy: 235, rx: 80, ry: 85 },
        headTop: { x: 185, y: 92 },
        faceCenter: { cx: 185, cy: 172, eyeY: 142, noseY: 170, mouthY: 206, width: 86 },
        armLeft:  { x: 124, y: 224, rot: -28 },
        armRight: { x: 272, y: 224, rot: 28 },
        legLeft:  { x: 154, y: 342, rot: -4 },
        legRight: { x: 246, y: 342, rot: 4 },
        ears:     { left: { x: 128, y: 120, rot: -28 }, right: { x: 254, y: 120, rot: 28 } },
        horns:    { left: { x: 150, y: 96, rot: -20 }, right: { x: 228, y: 96, rot: 20 } },
        tail:     { x: 130, y: 330 },
        wings:    { left: { x: 130, y: 195 }, right: { x: 265, y: 195 } },
        cape:     { x: 195, y: 212 },
        legs: [
          [{ x: 200, y: 345 }],
          [{ x: 154, y: 342, rot: -4 }, { x: 246, y: 342, rot: 4 }],
          [{ x: 138, y: 340, rot: -10 }, { x: 200, y: 345, rot: 0 }, { x: 262, y: 340, rot: 10 }],
          [{ x: 126, y: 338, rot: -14 }, { x: 174, y: 345, rot: -4 }, { x: 226, y: 345, rot: 4 }, { x: 274, y: 338, rot: 14 }],
          [{ x: 118, y: 338, rot: -16 }, { x: 158, y: 345, rot: -8 }, { x: 200, y: 348, rot: 0 }, { x: 242, y: 345, rot: 8 }, { x: 282, y: 338, rot: 16 }]
        ]
      },
      robot: {
        id: 'robot',
        torso: { cx: 200, cy: 235, rx: 75, ry: 75 },
        headTop: { x: 200, y: 98 },
        faceCenter: { cx: 200, cy: 174, eyeY: 145, noseY: 172, mouthY: 208, width: 86 },
        armLeft:  { x: 120, y: 222, rot: -25 },
        armRight: { x: 280, y: 222, rot: 25 },
        legLeft:  { x: 155, y: 340, rot: -4 },
        legRight: { x: 245, y: 340, rot: 4 },
        ears:     { left: { x: 132, y: 124, rot: -24 }, right: { x: 268, y: 124, rot: 24 } },
        horns:    { left: { x: 158, y: 102, rot: -16 }, right: { x: 242, y: 102, rot: 16 } },
        tail:     { x: 135, y: 330 },
        wings:    { left: { x: 130, y: 195 }, right: { x: 270, y: 195 } },
        cape:     { x: 200, y: 212 },
        legs: [
          [{ x: 200, y: 345 }],
          [{ x: 155, y: 340, rot: -4 }, { x: 245, y: 340, rot: 4 }],
          [{ x: 140, y: 340, rot: -10 }, { x: 200, y: 345, rot: 0 }, { x: 260, y: 340, rot: 10 }],
          [{ x: 128, y: 338, rot: -14 }, { x: 175, y: 345, rot: -4 }, { x: 225, y: 345, rot: 4 }, { x: 272, y: 338, rot: 14 }],
          [{ x: 120, y: 338, rot: -16 }, { x: 160, y: 345, rot: -8 }, { x: 200, y: 348, rot: 0 }, { x: 240, y: 345, rot: 8 }, { x: 280, y: 338, rot: 16 }]
        ]
      }
    };
  }

  getSockets(bodyType) {
    const key = (bodyType || 'round').toLowerCase();
    return this.sockets[key] || this.sockets.round;
  }
}

// Global Registry Singleton
window.monsterAnchorRegistry = new MonsterAnchorRegistry();


// =============================================================================
// 2. ENHANCED PROCEDURAL VECTOR MONSTER RENDERER
// Strict Layering Order:
// Backdrops -> Tail/Wings -> Back Limbs -> Torso/Head Base -> Eyes/Mouth -> Front Limbs -> Clothes/Accessories
// =============================================================================
class MonsterRenderer {
  constructor() {
    this.anchorReg = window.monsterAnchorRegistry;
    this.palettes = {
      purple: { main: '#a855f7', belly: '#f3e8ff', dark: '#6b21a8', stroke: '#3b0764', highlight: '#c084fc' },
      green:  { main: '#22c55e', belly: '#dcfce7', dark: '#15803d', stroke: '#14532d', highlight: '#4ade80' },
      blue:   { main: '#0ea5e9', belly: '#e0f2fe', dark: '#0369a1', stroke: '#0c4a6e', highlight: '#38bdf8' },
      red:    { main: '#f43f5e', belly: '#ffe4e6', dark: '#be123c', stroke: '#881337', highlight: '#fb7185' },
      orange: { main: '#f97316', belly: '#ffedd5', dark: '#c2410c', stroke: '#7c2d12', highlight: '#fb923c' },
      yellow: { main: '#eab308', belly: '#fef9c3', dark: '#a16207', stroke: '#713f12', highlight: '#fde047' },
      pink:   { main: '#f472b6', belly: '#fce7f3', dark: '#db2777', stroke: '#831843', highlight: '#f9a8d4' },
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

    // Active Action Mode ('tickle', 'eat', 'dance', 'sleep', or null)
    this.currentAction = null;
  }

  normalize(raw) {
    const m = JSON.parse(JSON.stringify(raw || {}));
    return {
      name: m.name || 'Zippy',
      body: m.body || m.bodyShape || 'round',
      color: m.color || 'purple',
      secondaryColor: m.secondaryColor || m.color || 'yellow',
      pattern: m.pattern || 'none',
      eyes: {
        count: m.eyes?.count !== undefined ? m.eyes.count : 2,
        size: m.eyes?.size || 'big',
        style: m.eyes?.style || 'round'
      },
      ears: {
        count: m.ears?.count !== undefined ? m.ears.count : 2,
        style: m.ears?.style || 'long'
      },
      horns: {
        count: m.horns?.count !== undefined ? m.horns.count : 0,
        style: m.horns?.style || 'curly'
      },
      nose: m.nose || 'small',
      mouth: m.mouth || 'big',
      teeth: m.teeth || 'none',
      expression: m.expression || 'happy',
      arms: {
        count: m.arms?.count !== undefined ? m.arms.count : 2,
        length: m.arms?.length || 'normal'
      },
      hands: m.hands || 'normal',
      legs: {
        count: m.legs?.count !== undefined ? m.legs.count : 2
      },
      feet: m.feet || 'normal',
      specialParts: {
        wings: m.specialParts?.wings || 'none',
        tail: m.specialParts?.tail || 'none',
        spikes: !!m.specialParts?.spikes,
        fins: !!m.specialParts?.fins,
        tentacles: !!m.specialParts?.tentacles,
        shell: !!m.specialParts?.shell
      },
      clothes: {
        outfit: m.clothes?.outfit || 'none',
        top: m.clothes?.top || 'none',
        topColor: m.clothes?.topColor || 'blue',
        bottom: m.clothes?.bottom || 'none',
        bottomColor: m.clothes?.bottomColor || 'black',
        shoes: m.clothes?.shoes || 'none',
        shoesColor: m.clothes?.shoesColor || 'yellow',
        cape: !!m.clothes?.cape,
        capeColor: m.clothes?.capeColor || 'red'
      },
      accessories: Array.isArray(m.accessories) ? m.accessories : [],
      accessoryColors: m.accessoryColors || {},
      powers: Array.isArray(m.powers) ? m.powers : [],
      personality: Array.isArray(m.personality) ? m.personality : [],
      world: m.world || 'castle',
      food: m.food || 'pizza'
    };
  }

  getPalette(color) {
    return this.palettes[color] || this.palettes.purple;
  }

  getClothColor(col, fallback = '#2563eb') {
    return this.clothingColors[col] || col || fallback;
  }

  // ==========================================
  // MASTER SVG COMPOSER (Strict Layer Architecture)
  // ==========================================
  renderSvg(rawMonster, options = {}) {
    const monster = this.normalize(rawMonster);
    const pal = this.getPalette(monster.color);
    const secPal = this.getPalette(monster.secondaryColor);
    const anchors = this.anchorReg.getSockets(monster.body);
    const width = options.width || 400;
    const height = options.height || 480;
    const isAnimated = options.animated !== false;

    const action = options.action || this.currentAction;
    let actionAnimClass = '';
    if (action === 'tickle') actionAnimClass = 'anim-tickle';
    else if (action === 'dance') actionAnimClass = 'anim-dance';
    else if (action === 'sleep') actionAnimClass = 'anim-sleep';
    else if (isAnimated) actionAnimClass = 'animated-monster';

    // Strict Layer Sequence:
    // 1. Backdrops & Aura
    // 2. Tail / Wings / Back Gear
    // 3. Back Limbs (Legs/Feet behind body)
    // 4. Torso / Head Base (Body mesh, belly, patterns, horns & ears attached to headTop)
    // 5. Eyes / Mouth (Positioned strictly at faceCenter)
    // 6. Front Limbs (Arms & Hands attached at armLeft & armRight)
    // 7. Clothes & Accessories (Tops, bottoms, outfits, glasses, hats, cape)
    const layers = [
      this.renderBackdrops(monster, anchors),
      this.renderWingsAndTail(monster, pal, anchors),
      this.renderBackLimbs(monster, pal, anchors),
      this.renderTorsoAndHead(monster, pal, secPal, anchors),
      this.renderEyesAndMouth(monster, pal, anchors, action),
      this.renderFrontLimbs(monster, pal, anchors, action),
      this.renderClothesAndAccessories(monster, pal, anchors)
    ];

    const isInvisible = monster.powers.includes('invisible');
    const opacityVal = isInvisible ? 0.52 : 1.0;

    return `
      <svg class="monster-svg ${actionAnimClass}" 
           viewBox="0 0 400 480" 
           width="${width}" 
           height="${height}" 
           style="opacity: ${opacityVal};"
           xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="mDropGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="rgba(15,23,42,0.18)"/>
          </filter>
          <!-- Soft Inset Ambient Occlusion & Squish Filter -->
          <filter id="claySquish" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(15,23,42,0.22)"/>
          </filter>
          <!-- Foot Contact Blur Filter -->
          <filter id="footBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4"/>
          </filter>
          <!-- 3D Clay Radial Gradient Highlight on top-left to simulate rounded volume -->
          <radialGradient id="clayShine" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.45)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.18)"/>
          </radialGradient>
          <linearGradient id="bodyGrad_${monster.color}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${pal.highlight}"/>
            <stop offset="50%" stop-color="${pal.main}"/>
            <stop offset="100%" stop-color="${pal.dark}"/>
          </linearGradient>
          <linearGradient id="secGrad_${monster.secondaryColor}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="100%" stop-color="${secPal.belly}"/>
          </linearGradient>
          <linearGradient id="goldAccGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="50%" stop-color="#eab308"/>
            <stop offset="100%" stop-color="#b45309"/>
          </linearGradient>
        </defs>
        ${layers.join('\n')}
      </svg>
    `;
  }

  // -------------------------------------------------------------
  // LAYER 1: BACKDROPS & AURA
  // -------------------------------------------------------------
  renderBackdrops(monster, anchors) {
    let powerAura = '';
    if (monster.powers.includes('shoot_lightning')) {
      powerAura = `
        <g class="aura-lightning" stroke="#facc15" stroke-width="4" fill="none" opacity="0.8">
          <polyline points="100,120 130,170 115,190 145,240" />
          <polyline points="295,120 270,170 285,190 255,240" />
        </g>
      `;
    } else if (monster.powers.includes('breathe_fire')) {
      powerAura = `
        <g class="aura-fire" opacity="0.6">
          <circle cx="80" cy="220" r="14" fill="#f97316"/>
          <circle cx="320" cy="220" r="14" fill="#f97316"/>
          <circle cx="95" cy="180" r="8" fill="#ef4444"/>
          <circle cx="305" cy="180" r="8" fill="#ef4444"/>
        </g>
      `;
    } else if (monster.powers.includes('magic')) {
      powerAura = `
        <g class="aura-magic" fill="#c084fc" opacity="0.85">
          <polygon points="100,100 104,112 116,112 106,120 110,132 100,124 90,132 94,120 84,112 96,112" />
          <polygon points="300,100 304,112 316,112 306,120 310,132 300,124 290,132 294,120 284,112 296,112" />
        </g>
      `;
    }

    return `
      <g id="layer-backdrop-stage">
        <!-- Anchored Stage Platform Contact Shadow -->
        <ellipse cx="200" cy="430" rx="90" ry="14" fill="#0f172a" opacity="0.35" filter="url(#footBlur)" />
        ${powerAura}
      </g>
    `;
  }

  // -------------------------------------------------------------
  // LAYER 2: TAIL / WINGS / BACK GEAR
  // -------------------------------------------------------------
  renderWingsAndTail(monster, pal, anchors) {
    let out = '';
    const w = monster.specialParts.wings;
    const wl = anchors.wings.left;
    const wr = anchors.wings.right;

    // Wings
    if (w === 'dragon') {
      out += `
        <g class="monster-wings-group dragon-wings">
          <path d="M ${wl.x},${wl.y} Q 50,110 20,150 Q 70,190 30,240 Q 100,230 ${wl.x + 5},${wl.y + 35} Z" fill="#f97316" stroke="#c2410c" stroke-width="4"/>
          <path d="M ${wr.x},${wr.y} Q 350,110 380,150 Q 330,190 370,240 Q 300,230 ${wr.x - 5},${wr.y + 35} Z" fill="#f97316" stroke="#c2410c" stroke-width="4"/>
        </g>
      `;
    } else if (w === 'butterfly') {
      out += `
        <g class="monster-wings-group butterfly-wings">
          <path d="M ${wl.x},${wl.y + 10} C 50,110 10,190 60,240 C 20,280 70,330 ${wl.x + 5},${wl.y + 60} Z" fill="#ec4899" stroke="#be185d" stroke-width="4"/>
          <circle cx="65" cy="195" r="12" fill="#fef08a"/>
          <path d="M ${wr.x},${wr.y + 10} C 350,110 390,190 340,240 C 380,280 330,330 ${wr.x - 5},${wr.y + 60} Z" fill="#ec4899" stroke="#be185d" stroke-width="4"/>
          <circle cx="335" cy="195" r="12" fill="#fef08a"/>
        </g>
      `;
    } else if (w === 'bat') {
      out += `
        <g class="monster-wings-group bat-wings">
          <path d="M ${wl.x},${wl.y + 5} Q 50,130 15,175 Q 55,210 40,245 Q 85,245 90,275 ${wl.x + 5},${wl.y + 35} Z" fill="#334155" stroke="#0f172a" stroke-width="4"/>
          <path d="M ${wr.x},${wr.y + 5} Q 350,130 385,175 Q 345,210 360,245 Q 315,245 310,275 ${wr.x - 5},${wr.y + 35} Z" fill="#334155" stroke="#0f172a" stroke-width="4"/>
        </g>
      `;
    }

    // Tails
    const t = anchors.tail;
    const tl = monster.specialParts.tail;
    if (tl === 'long') {
      out += `<path d="M ${t.x},${t.y} C 60,330 20,280 35,230 C 45,205 68,215 58,240 C 48,270 78,310 ${t.x + 10},${t.y + 15} Z" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4"/>`;
    } else if (tl === 'curly') {
      out += `<path d="M ${t.x},${t.y + 5} C 60,350 30,310 55,270 C 75,240 110,270 85,290 C 70,300 60,330 ${t.x + 5},${t.y + 18} Z" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4"/>`;
    } else if (tl === 'dinosaur') {
      out += `<path d="M ${t.x},${t.y - 10} C 50,320 15,380 5,400 C 35,390 85,375 ${t.x + 10},${t.y + 25} Z" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4"/>`;
    } else if (tl === 'snake') {
      out += `<path d="M ${t.x},${t.y + 5} Q 60,360 40,330 Q 20,300 55,260 Q 80,230 65,200" fill="none" stroke="${pal.main}" stroke-width="14" stroke-linecap="round"/><path d="M ${t.x},${t.y + 5} Q 60,360 40,330 Q 20,300 55,260 Q 80,230 65,200" fill="none" stroke="${pal.stroke}" stroke-width="4" stroke-linecap="round"/>`;
    } else if (tl === 'bunny') {
      out += `<circle cx="${t.x - 16}" cy="${t.y + 5}" r="16" fill="#ffffff" stroke="${pal.stroke}" stroke-width="4"/>`;
    }

    // Cape Back
    if (monster.clothes.cape) {
      const capeColor = this.getClothColor(monster.clothes.capeColor || 'red', '#dc2626');
      out += `<path class="monster-cape-back" d="M 150,215 Q 200,230 250,215 L 285,390 Q 200,410 115,390 Z" fill="${capeColor}" stroke="#7f1d1d" stroke-width="4" />`;
    }

    return `<g id="layer-wings-tail">${out}</g>`;
  }

  // -------------------------------------------------------------
  // LAYER 3: BACK LIMBS (Legs & Feet behind torso)
  // -------------------------------------------------------------
  renderBackLimbs(monster, pal, anchors) {
    const count = monster.legs.count;
    if (count === 0 || monster.body === 'ghost') return '';

    let slotIdx = 1;
    if (count === 1) slotIdx = 0;
    else if (count === 2) slotIdx = 1;
    else if (count === 3) slotIdx = 2;
    else if (count === 4) slotIdx = 3;
    else if (count >= 5) slotIdx = 4;

    const configs = anchors.legs[slotIdx] || anchors.legs[1];
    const feet = monster.feet || 'normal';

    return `
      <g id="layer-back-limbs">
        ${configs.map(c => `
          <g transform="translate(${c.x}, ${c.y}) rotate(${c.rot || 0})">
            <!-- Foot Ground Contact Shadow Anchoring to Platform -->
            <ellipse cx="2" cy="86" rx="${feet === 'giant' ? 36 : 28}" ry="9" fill="#0f172a" opacity="0.35" filter="url(#footBlur)"/>
            <!-- Leg Column -->
            <path d="M -14,0 L -14,75 Q -14,88 0,88 Q 14,88 14,75 L 14,0 Z" fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
            <!-- Flat Foot on Stage Platform -->
            <ellipse cx="2" cy="80" rx="${feet === 'giant' ? 32 : 24}" ry="12" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5"/>
            <circle cx="-12" cy="86" r="4.5" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
            <circle cx="2" cy="89" r="5" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
            <circle cx="16" cy="86" r="4.5" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
          </g>
        `).join('')}
      </g>
    `;
  }

  // -------------------------------------------------------------
  // LAYER 4: TORSO / HEAD BASE (Master Anchor + Horns/Ears Attached)
  // -------------------------------------------------------------
  renderTorsoAndHead(monster, pal, secPal, anchors) {
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
    } else { // round default
      bodyPath = `M 200,95 C 245,95 272,125 272,165 C 272,192 258,212 278,225 C 300,240 292,305 278,345 C 260,375 140,375 122,345 C 108,305 100,240 122,225 C 142,212 128,192 128,165 C 128,125 155,95 200,95 Z`;
      bellyPath = `<path d="M 200,235 C 238,235 254,260 254,295 C 254,335 235,355 200,355 C 165,355 146,335 146,295 C 146,260 162,235 200,235 Z" fill="url(#secGrad_${monster.secondaryColor})" stroke="${pal.dark}" stroke-width="3" opacity="0.9"/>`;
    }

    // Horns (Attached firmly to headTop socket)
    let hornsSvg = '';
    const hornCount = monster.horns.count;
    if (hornCount > 0) {
      const h = anchors.horns;
      const top = anchors.headTop;
      let cfgs = [];
      if (hornCount === 1) cfgs = [{ x: top.x, y: top.y, rot: 0, flip: false }];
      else cfgs = [
        { x: h.left.x, y: h.left.y, rot: h.left.rot, flip: false },
        { x: h.right.x, y: h.right.y, rot: h.right.rot, flip: true }
      ];
      hornsSvg = `
        <g class="monster-horns-group">
          ${cfgs.map(c => `
            <g transform="translate(${c.x}, ${c.y}) rotate(${c.rot})">
              <polygon points="-12,0 0,-44 12,0" fill="url(#goldAccGrad)" stroke="#78350f" stroke-width="4" stroke-linejoin="round"/>
            </g>
          `).join('')}
        </g>
      `;
    }

    // Ears (Attached firmly to ears socket on head)
    let earsSvg = '';
    const earCount = monster.ears.count;
    if (earCount > 0) {
      const e = anchors.ears;
      let ecfgs = [
        { x: e.left.x, y: e.left.y, rot: e.left.rot, flip: false },
        { x: e.right.x, y: e.right.y, rot: e.right.rot, flip: true }
      ];
      earsSvg = `
        <g class="monster-ears-group">
          ${ecfgs.map(c => `
            <g transform="translate(${c.x}, ${c.y}) rotate(${c.rot})">
              <ellipse cx="0" cy="-22" rx="16" ry="28" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4"/>
              <ellipse cx="0" cy="-20" rx="9" ry="18" fill="${pal.belly}"/>
            </g>
          `).join('')}
        </g>
      `;
    }

    return `
      <g id="layer-torso-head" filter="url(#claySquish)">
        ${earsSvg}
        ${hornsSvg}
        <!-- 1. Central Torso Solid Base Fill -->
        <path d="${bodyPath}" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="5" stroke-linejoin="round"/>
        <!-- 2. Radial 3D Clay Lighting Mesh Highlight -->
        <path d="${bodyPath}" fill="url(#clayShine)" style="mix-blend-mode: overlay; pointer-events: none;"/>
        <!-- 3. Soft Ambient Shadow Gradient Underlay -->
        <path d="${bodyPath}" fill="url(#bodyGrad_${monster.color})" opacity="0.3" style="mix-blend-mode: multiply; pointer-events: none;"/>
        <!-- Soft Blush Cheeks -->
        <ellipse cx="146" cy="182" rx="14" ry="9" fill="${pal.dark}" opacity="0.25"/>
        <ellipse cx="254" cy="182" rx="14" ry="9" fill="${pal.dark}" opacity="0.25"/>
        ${bellyPath}
      </g>
    `;
  }

  // -------------------------------------------------------------
  // LAYER 5: EYES & MOUTH (Anchored to faceCenter)
  // -------------------------------------------------------------
  renderEyesAndMouth(monster, pal, anchors, action) {
    const f = anchors.faceCenter;
    const count = monster.eyes.count;
    const size = monster.eyes.size || 'big';
    let rBase = 20;
    if (size === 'tiny') rBase = 9;
    else if (size === 'small') rBase = 14;
    else if (size === 'giant') rBase = 30;

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
        { cx: f.cx - 52, cy: f.eyeY + 4, r: rBase * 0.85 },
        { cx: f.cx,      cy: f.eyeY - 6, r: rBase * 0.95 },
        { cx: f.cx + 52, cy: f.eyeY + 4, r: rBase * 0.85 }
      ];
    } else {
      eyeConfigs = [
        { cx: f.cx - 48, cy: f.eyeY - 6, r: rBase * 0.78 },
        { cx: f.cx - 16, cy: f.eyeY - 10, r: rBase * 0.82 },
        { cx: f.cx + 16, cy: f.eyeY - 10, r: rBase * 0.82 },
        { cx: f.cx + 48, cy: f.eyeY - 6, r: rBase * 0.78 }
      ];
    }

    // Render Eyes according to action state (e.g., tickle = squint, sleep = closed)
    let eyesSvg = '';
    if (action === 'sleep') {
      // Peaceful closed arcs
      eyesSvg = eyeConfigs.map(c => `
        <path d="M ${c.cx - c.r},${c.cy + 4} Q ${c.cx},${c.cy + c.r + 6} ${c.cx + c.r},${c.cy + 4}" 
              fill="none" stroke="#0f172a" stroke-width="4.5" stroke-linecap="round"/>
      `).join('');
    } else if (action === 'tickle') {
      // Giggling squints (> <)
      eyesSvg = eyeConfigs.map(c => `
        <path d="M ${c.cx - c.r * 0.7},${c.cy + 4} Q ${c.cx},${c.cy - c.r * 0.6} ${c.cx + c.r * 0.7},${c.cy + 4}" 
              fill="none" stroke="#0f172a" stroke-width="4.5" stroke-linecap="round"/>
      `).join('');
    } else {
      // Normal Big Glossy Eyes
      eyesSvg = eyeConfigs.map(c => `
        <g class="monster-eye-item">
          <ellipse cx="${c.cx}" cy="${c.cy}" rx="${c.r}" ry="${c.r * 1.05}" fill="#ffffff" stroke="#0f172a" stroke-width="3.5"/>
          <circle cx="${c.cx}" cy="${c.cy + 1}" r="${c.r * 0.58}" fill="#0284c7"/>
          <circle cx="${c.cx}" cy="${c.cy + 1}" r="${c.r * 0.4}" fill="#0f172a"/>
          <circle cx="${c.cx - c.r * 0.22}" cy="${c.cy - c.r * 0.22}" r="${c.r * 0.22}" fill="#ffffff"/>
          <circle cx="${c.cx + c.r * 0.24}" cy="${c.cy + c.r * 0.24}" r="${c.r * 0.1}" fill="#ffffff"/>
        </g>
      `).join('');
    }

    // Nose
    const noseSvg = `<ellipse cx="${f.cx}" cy="${f.noseY}" rx="8" ry="6" fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="3"/><circle cx="${f.cx - 2}" cy="${f.noseY - 2}" r="2" fill="#ffffff" opacity="0.6"/>`;

    // Mouth (Adapts to eat/tickle actions)
    let mouthSvg = '';
    if (action === 'eat') {
      // Mouth wide open to catch snack
      mouthSvg = `
        <ellipse cx="${f.cx}" cy="${f.mouthY}" rx="24" ry="18" fill="#881337" stroke="#0f172a" stroke-width="4"/>
        <path d="M ${f.cx - 16},${f.mouthY + 8} Q ${f.cx},${f.mouthY + 16} ${f.cx + 16},${f.mouthY + 8}" fill="#f43f5e"/>
      `;
    } else if (action === 'tickle') {
      // Big laughing open mouth
      mouthSvg = `
        <path d="M ${f.cx - 28},${f.mouthY - 6} Q ${f.cx},${f.mouthY + 28} ${f.cx + 28},${f.mouthY - 6} Z" fill="#881337" stroke="#0f172a" stroke-width="4"/>
        <ellipse cx="${f.cx}" cy="${f.mouthY + 12}" rx="12" ry="7" fill="#f43f5e"/>
      `;
    } else {
      // Friendly smile with teeth option
      mouthSvg = `
        <path d="M ${f.cx - 24},${f.mouthY - 2} Q ${f.cx},${f.mouthY + 18} ${f.cx + 24},${f.mouthY - 2}" fill="none" stroke="#0f172a" stroke-width="4.5" stroke-linecap="round"/>
      `;
    }

    return `
      <g id="layer-eyes-mouth">
        ${eyesSvg}
        ${noseSvg}
        ${mouthSvg}
      </g>
    `;
  }

  // -------------------------------------------------------------
  // LAYER 6: FRONT LIMBS (Arms & Hands attached at armLeft/armRight)
  // -------------------------------------------------------------
  renderFrontLimbs(monster, pal, anchors, action) {
    const count = monster.arms.count;
    if (count === 0) return '';
    const length = monster.arms.length || 'normal';

    let factor = 1.0;
    if (length === 'tiny') factor = 0.6;
    else if (length === 'short') factor = 0.85;
    else if (length === 'long') factor = 1.35;

    const shL = anchors.armLeft;
    const shR = anchors.armRight;

    // Adjust arm target when dancing or eating
    let leftHandOffset = { x: -55 * factor, y: 35 * factor };
    let rightHandOffset = { x: 55 * factor, y: -35 * factor };

    if (action === 'dance') {
      leftHandOffset = { x: -65 * factor, y: -45 * factor };
      rightHandOffset = { x: 65 * factor, y: -45 * factor };
    }

    return `
      <g id="layer-front-limbs">
        <!-- Left Arm with Rounded Torso Joint -->
        <g class="monster-arm-left">
          <!-- Rounded Joint Socket at Torso Connection -->
          <circle cx="${shL.x}" cy="${shL.y}" r="13" fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="4"/>
          <!-- Arm Limb -->
          <path d="M ${shL.x},${shL.y} Q ${shL.x - 25},${shL.y + 15} ${shL.x + leftHandOffset.x},${shL.y + leftHandOffset.y}" 
                fill="none" stroke="${pal.main}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M ${shL.x},${shL.y} Q ${shL.x - 25},${shL.y + 15} ${shL.x + leftHandOffset.x},${shL.y + leftHandOffset.y}" 
                fill="none" stroke="${pal.stroke}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="${shL.x + leftHandOffset.x}" cy="${shL.y + leftHandOffset.y}" r="14" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="3.5"/>
        </g>

        <!-- Right Arm with Rounded Torso Joint -->
        <g class="monster-arm-right">
          <!-- Rounded Joint Socket at Torso Connection -->
          <circle cx="${shR.x}" cy="${shR.y}" r="13" fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="4"/>
          <!-- Arm Limb -->
          <path d="M ${shR.x},${shR.y} Q ${shR.x + 25},${shR.y - 15} ${shR.x + rightHandOffset.x},${shR.y + rightHandOffset.y}" 
                fill="none" stroke="${pal.main}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M ${shR.x},${shR.y} Q ${shR.x + 25},${shR.y - 15} ${shR.x + rightHandOffset.x},${shR.y + rightHandOffset.y}" 
                fill="none" stroke="${pal.stroke}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="${shR.x + rightHandOffset.x}" cy="${shR.y + rightHandOffset.y}" r="14" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="3.5"/>
        </g>
      </g>
    `;
  }

  // -------------------------------------------------------------
  // LAYER 7: CLOTHES & ACCESSORIES (Glasses, Outfits, Hats)
  // -------------------------------------------------------------
  renderClothesAndAccessories(monster, pal, anchors) {
    let out = '';
    const f = anchors.faceCenter;
    const top = anchors.headTop;

    // Glasses
    if (monster.accessories.includes('glasses') || monster.accessories.includes('sunglasses')) {
      const isSun = monster.accessories.includes('sunglasses');
      const lens = isSun ? '#0f172a' : 'rgba(255, 255, 255, 0.4)';
      out += `
        <g class="accessory-glasses" transform="translate(${f.cx}, ${f.eyeY})">
          <circle cx="-34" cy="0" r="24" fill="${lens}" stroke="#0f172a" stroke-width="5"/>
          <circle cx="34" cy="0" r="24" fill="${lens}" stroke="#0f172a" stroke-width="5"/>
          <path d="M -10,-2 Q 0,-8 10,-2" fill="none" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>
        </g>
      `;
    }

    // Clothes (T-shirt / Jacket)
    const t = monster.clothes.top;
    if (t === 'tshirt' || t === 'shirt') {
      const topCol = this.getClothColor(monster.clothes.topColor, '#2563eb');
      out += `
        <g class="clothing-top">
          <path d="M 142,215 Q 200,230 258,215 L 292,255 L 268,266 L 258,310 L 142,310 L 132,266 L 108,255 Z" fill="${topCol}" stroke="#0f172a" stroke-width="4.5"/>
          <polygon points="200,248 203,256 212,257 205,263 207,271 200,267 193,271 195,263 188,257 197,256" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
        </g>
      `;
    }

    // Headwear / Hats (Attached to headTop)
    if (monster.accessories.includes('hat') || monster.accessories.includes('cap')) {
      out += `
        <g class="accessory-hat" transform="translate(${top.x}, ${top.y - 10})">
          <ellipse cx="0" cy="0" rx="38" ry="12" fill="#eab308" stroke="#713f12" stroke-width="3.5"/>
          <path d="M -24,0 L -18,-30 Q 0,-38 18,-30 L 24,0 Z" fill="#ca8a04" stroke="#713f12" stroke-width="3.5"/>
        </g>
      `;
    } else if (monster.accessories.includes('crown')) {
      out += `
        <g class="accessory-crown" transform="translate(${top.x}, ${top.y - 8})">
          <polygon points="-28,0 -34,-26 -16,-12 0,-34 16,-12 34,-26 28,0" fill="url(#goldAccGrad)" stroke="#78350f" stroke-width="3.5"/>
          <circle cx="0" cy="-34" r="4" fill="#ef4444"/>
          <circle cx="-34" cy="-26" r="3.5" fill="#3b82f6"/>
          <circle cx="34" cy="-26" r="3.5" fill="#10b981"/>
        </g>
      `;
    }

    return `<g id="layer-clothes-accessories">${out}</g>`;
  }
}

// Global Renderer Singleton
window.monsterRenderer = new MonsterRenderer();


// =============================================================================
// 3. SOUND EFFECTS & SPEECH SYNTHESIS ENGINE
// =============================================================================
class SoundEngine {
  constructor() {
    this.sfxEnabled = true;
    this.ttsEnabled = true;
    this.speechRate = 0.88;
    this.audioCtx = null;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    return this.sfxEnabled;
  }

  toggleTts() {
    this.ttsEnabled = !this.ttsEnabled;
    if (!this.ttsEnabled) this.stopSpeech();
    return this.ttsEnabled;
  }

  // 1. POP
  playPop() {
    if (!this.sfxEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  }

  // 2. TICKLE (Playful Ascending Giggle Flutter)
  playTickle() {
    if (!this.sfxEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const notes = [380, 520, 680, 560, 720, 840];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (idx + 1) * 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + (idx + 1) * 0.08);
      });
    } catch (e) {}
  }

  // 3. CRUNCH (Snappy Apple Bite)
  playCrunch() {
    if (!this.sfxEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      // Noise burst for crunch texture
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.Q.setValueAtTime(3.0, ctx.currentTime);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  }

  // 4. DANCE (4-Note Upbeat Rhythmic Chime)
  playDance() {
    if (!this.sfxEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const chords = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      chords.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.12 + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.22);
      });
    } catch (e) {}
  }

  // 5. LULLABY (432Hz Warm Chime Descending)
  playLullaby() {
    if (!this.sfxEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const notes = [783.99, 659.25, 523.25, 392.00]; // G5 -> E5 -> C5 -> G4
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.25);
        gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.25);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + idx * 0.25 + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.25);
        osc.stop(ctx.currentTime + idx * 0.25 + 0.55);
      });
    } catch (e) {}
  }

  // Speech TTS
  speak(text, callback = null) {
    if (!this.ttsEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = this.speechRate;
      utter.pitch = 1.05;
      utter.lang = 'en-US';
      if (callback) utter.onend = callback;
      window.speechSynthesis.speak(utter);
    } catch (e) {}
  }

  stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

// Global SoundEngine Singleton
window.soundEngine = new SoundEngine();


// =============================================================================
// 4. INTERACTIVE ACTION TRIGGERS CONTROLLER
// =============================================================================
class MonsterActionDock {
  constructor() {
    this.activeActionTimeout = null;
  }

  triggerTickle() {
    window.soundEngine.playTickle();
    window.soundEngine.speak("The monster laughs!");
    this.applyActionState('tickle', '😂 Verb: Laugh — "The monster laughs!"', 2800);
  }

  triggerFeed() {
    window.soundEngine.playCrunch();
    window.soundEngine.speak("It eats an apple! Yummy!");
    
    // Spawn Flying Snack
    const box = document.getElementById('create-monster-preview');
    if (box) {
      const apple = document.createElement('div');
      apple.className = 'flying-snack-apple';
      apple.innerText = '🍎';
      box.appendChild(apple);
      setTimeout(() => apple.remove(), 900);
    }

    this.applyActionState('eat', '🍎 Verb: Eat — "It eats an apple! Yummy!"', 2400);
  }

  triggerDance() {
    window.soundEngine.playDance();
    window.soundEngine.speak("Look! It is dancing!");
    this.applyActionState('dance', '💃 Verb: Dance — "Look! It is dancing!"', 3200);
  }

  triggerSleep() {
    window.soundEngine.playLullaby();
    window.soundEngine.speak("Shh... it is sleeping.");

    // Spawn Floating Zzz Cluster
    const box = document.getElementById('create-monster-preview');
    if (box) {
      const zzz = document.createElement('div');
      zzz.className = 'floating-zzz-cluster';
      zzz.innerHTML = `
        <span class="floating-zzz-item">z</span>
        <span class="floating-zzz-item">Z</span>
        <span class="floating-zzz-item">Z</span>
      `;
      box.appendChild(zzz);
      setTimeout(() => zzz.remove(), 3500);
    }

    this.applyActionState('sleep', '💤 Verb: Sleep — "Shh... it is sleeping."', 3600);
  }

  applyActionState(actionName, feedbackText, durationMs) {
    if (this.activeActionTimeout) clearTimeout(this.activeActionTimeout);

    window.monsterRenderer.currentAction = actionName;
    if (window.app && typeof window.app.updateAllPreviews === 'function') {
      window.app.updateAllPreviews();
    }

    const banner = document.getElementById('action-feedback-banner');
    if (banner) {
      banner.innerText = feedbackText;
      banner.classList.add('active-action');
    }

    this.activeActionTimeout = setTimeout(() => {
      window.monsterRenderer.currentAction = null;
      if (window.app && typeof window.app.updateAllPreviews === 'function') {
        window.app.updateAllPreviews();
      }
      if (banner) {
        banner.innerText = '👆 Tap an action to play with your monster!';
        banner.classList.remove('active-action');
      }
    }, durationMs);
  }
}

// Global Action Dock Singleton
window.monsterActionDock = new MonsterActionDock();


// =============================================================================
// 5. GAMIFICATION: STEP 12 MONSTER PASSPORT & ID CARD EXPORTER
// =============================================================================
class MonsterPassportEngine {
  constructor() {
    this.titles = [
      'The Cosmic Wonder', 'The Friendly Giant', 'The Spark Dynamo',
      'The Magic Explorer', 'The Brave Adventurer', 'The Gentle Giant'
    ];
  }

  getRandomTitle() {
    return this.titles[Math.floor(Math.random() * this.titles.length)];
  }

  generatePassportHtml(monster) {
    const name = (monster.name || 'Zippy').toUpperCase();
    const title = this.getRandomTitle();
    const bodyShape = (monster.body || 'round').toUpperCase();
    const eyeCount = monster.eyes.count || 2;
    const power = (monster.powers[0] || 'jump high').replace('_', ' ');

    // Grammar Sentence
    const sentence = `${name} has a ${monster.body} body, ${eyeCount} ${monster.eyes.size || 'big'} eyes, and can ${power}!`;

    return `
      <div class="passport-card-shell" id="monster-id-passport">
        <!-- Official Gold Seal Header -->
        <div class="passport-gold-header">
          <div class="passport-seal-box">
            <span class="passport-seal-icon">🎖️</span>
            <div>
              <div class="passport-seal-title">OFFICIAL MONSTER PASSPORT</div>
              <small style="color: #64748b; font-weight: 700;">ENGLISH ADVENTURE ACADEMY · CLIL REGISTRY</small>
            </div>
          </div>
          <div class="passport-id-badge">ID: MST-${Math.floor(1000 + Math.random() * 9000)}</div>
        </div>

        <!-- Passport Body Grid -->
        <div class="passport-body-grid">
          <!-- Snapshot Column -->
          <div class="passport-snapshot-box" id="passport-snapshot-viewport">
            ${window.monsterRenderer.renderSvg(monster, { width: 220, height: 260, animated: false })}
          </div>

          <!-- Metadata & Traits Column -->
          <div class="passport-info-column">
            <div class="passport-name-row">
              <span class="passport-monster-name" id="passport-name-field">${name}</span>
              <span class="passport-title-tag">${title}</span>
            </div>

            <div class="passport-trait-pills">
              <span class="trait-chip">🧸 ${bodyShape} BODY</span>
              <span class="trait-chip">👀 ${eyeCount} EYES</span>
              <span class="trait-chip">🎨 ${monster.color.toUpperCase()}</span>
              <span class="trait-chip">⚡ ${power.toUpperCase()}</span>
              <span class="trait-chip">🍕 ${monster.food.toUpperCase()}</span>
            </div>

            <!-- Pedagogical Spoken Sentence -->
            <div class="passport-sentence-box">
              <p class="passport-sentence-text">"${sentence}"</p>
            </div>

            <!-- Export & Action Buttons -->
            <div class="passport-actions-row">
              <button class="btn-3d btn-primary" onclick="window.monsterPassportEngine.downloadPassportAsPng()">
                <span>📸 DOWNLOAD ID CARD</span>
              </button>
              <button class="btn-3d btn-secondary" onclick="window.print()">
                <span>🖨️ PRINT PASSPORT</span>
              </button>
              <button class="btn-3d btn-accent" onclick="window.soundEngine.speak('${sentence}')">
                <span>🔊 READ ALOUD</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  downloadPassportAsPng() {
    window.soundEngine.playPop();
    const monster = window.monsterStore ? window.monsterStore.get() : { name: 'Zippy' };
    const name = monster.name || 'Monster';

    // High Resolution Canvas Rendering
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 540;
    const ctx = canvas.getContext('2d');

    // Card Background
    ctx.fillStyle = '#ffffff';
    ctx.roundRect(10, 10, 880, 520, 24);
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#3b82f6';
    ctx.stroke();

    // Top Header Banner
    ctx.fillStyle = '#eff6ff';
    ctx.beginPath();
    ctx.roundRect(10, 10, 880, 90, [24, 24, 0, 0]);
    ctx.fill();

    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('🎖️ OFFICIAL MONSTER PASSPORT', 40, 55);

    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('ENGLISH ADVENTURE ACADEMY · MONSTER ID REGISTRY', 40, 82);

    // Monster Details
    ctx.fillStyle = '#6d28d9';
    ctx.font = '900 46px sans-serif';
    ctx.fillText(name.toUpperCase(), 340, 175);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`Body: ${monster.body}   |   Eyes: ${monster.eyes.count}   |   Color: ${monster.color}`, 340, 230);
    ctx.fillText(`Power: ${(monster.powers[0] || 'Fly').replace('_', ' ')}   |   Home: ${monster.world}`, 340, 275);

    // Sentence Card
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(340, 320, 510, 90);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#cbd5e1';
    ctx.strokeRect(340, 320, 510, 90);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'italic bold 20px sans-serif';
    const sentence = `"${name} has a ${monster.body} body and loves ${monster.food}!"`;
    ctx.fillText(sentence, 360, 372);

    // Draw SVG onto Canvas
    const svgStr = window.monsterRenderer.renderSvg(monster, { width: 280, height: 320, animated: false });
    const img = new Image();
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 40, 130, 260, 320);
      URL.revokeObjectURL(url);

      // Trigger PNG Download
      const link = document.createElement('a');
      link.download = `${name.toLowerCase()}-passport.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = url;
  }
}

// Global Passport Singleton
window.monsterPassportEngine = new MonsterPassportEngine();


// =============================================================================
// 6. AMBIENT PARTICLES SYSTEM FOR CIRCULAR PODIUM STAGE
// =============================================================================
class StageAmbientParticles {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animId = null;
  }

  mount(canvasId = 'stage-ambient-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.initParticles();
    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.offsetWidth || 440;
    this.canvas.height = this.canvas.offsetHeight || 480;
  }

  initParticles() {
    this.particles = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * (this.canvas.width || 440),
        y: Math.random() * (this.canvas.height || 480),
        r: Math.random() * 2.8 + 1.2,
        speedY: -(Math.random() * 0.4 + 0.15),
        alpha: Math.random() * 0.6 + 0.2,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  animate() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(p => {
      p.y += p.speedY;
      p.phase += 0.03;
      const curAlpha = p.alpha + Math.sin(p.phase) * 0.2;

      if (p.y < 0) {
        p.y = this.canvas.height;
        p.x = Math.random() * this.canvas.width;
      }

      this.ctx.fillStyle = `rgba(168, 85, 247, ${Math.max(0.1, curAlpha)})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.animId = requestAnimationFrame(() => this.animate());
  }
}

window.stageAmbientParticles = new StageAmbientParticles();


// =============================================================================
// 7. 3-PHASE STREAMLINED STEP WIZARD ORCHESTRATOR
// =============================================================================
class MonsterApp {
  constructor() {
    this.currentScreen = 'screen-start';
    this.currentStep = 1;
    this.totalSteps = 12;

    // 3-Phase Grouped Hierarchy Definition
    this.phases = [
      {
        id: 1,
        title: 'Basics',
        icon: '🧸',
        steps: [
          { num: 1, title: 'CHOOSE YOUR BODY 🧸', label: '1. Body', cheer: 'Awesome shape! ⭐' },
          { num: 2, title: 'CHOOSE YOUR EYES 👁️', label: '2. Eyes', cheer: 'Look at those eyes! 👀' },
          { num: 3, title: 'EARS & HORNS 🦄', label: '3. Ears & Horns', cheer: 'Cool horns and ears! 👂' },
          { num: 4, title: 'MAKE THE FACE 👄', label: '4. Face/Mouth', cheer: 'What a funny smile! 😃' },
          { num: 5, title: 'ARMS & LEGS 👐', label: '5. Arms & Legs', cheer: 'Ready to dance! 🦵' },
          { num: 6, title: 'CHOOSE COLORS 🎨', label: '6. Colors', cheer: 'So colorful! 🌈' }
        ]
      },
      {
        id: 2,
        title: 'Style & Gear',
        icon: '🎽',
        steps: [
          { num: 7, title: 'SPECIAL FEATURES 🐉', label: '7. Special', cheer: 'Wings and tails unlocked! ✨' },
          { num: 8, title: 'DRESS YOUR MONSTER! 👕', label: '8. Clothes', cheer: 'Looking stylish! 👗' },
          { num: 9, title: 'ADD ACCESSORIES! 🧢', label: '9. Items', cheer: 'Awesome gear! 👑' },
          { num: 10, title: 'WHAT IS YOUR POWER? ⚡', label: '10. Powers', cheer: 'Super powers active! 💥' }
        ]
      },
      {
        id: 3,
        title: 'Identity',
        icon: '🆔',
        steps: [
          { num: 11, title: 'WHERE DOES IT LIVE? 🏠', label: '11. World & Food', cheer: 'Yummy favorite food! 🍕' },
          { num: 12, title: 'NAME & MONSTER ID CARD 📛', label: '12. Monster Passport', cheer: 'Your monster is complete! 🎉' }
        ]
      }
    ];

    this.randomNames = ['Zippy', 'Bobo', 'Gorgor', 'Pip', 'Cosmo', 'Barnaby', 'Sparky', 'Momo'];

    if (typeof document !== 'undefined') {
      this.init();
    }
  }

  init() {
    // 1. Subscribe to central state
    if (window.monsterStore) {
      window.monsterStore.subscribe(() => {
        this.updateAllPreviews();
        this.updatePhraseBadge();
      });
    }

    // 2. Initial Setup
    this.setStep(1);
    this.updateAllPreviews();
    window.stageAmbientParticles.mount('stage-ambient-canvas');
  }

  // Phase & Step Queries
  getPhaseForStep(stepNum) {
    if (stepNum <= 6) return this.phases[0];
    if (stepNum <= 10) return this.phases[1];
    return this.phases[2];
  }

  getStepMeta(stepNum) {
    const phase = this.getPhaseForStep(stepNum);
    return phase.steps.find(s => s.num === stepNum) || phase.steps[0];
  }

  // Step Switcher
  setStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > this.totalSteps) return;
    this.currentStep = stepNumber;
    window.soundEngine.playPop();

    const phase = this.getPhaseForStep(stepNumber);
    const meta = this.getStepMeta(stepNumber);

    // 1. Update Phase Navigation Bar Highlight
    document.querySelectorAll('.phase-group-pill, .phase-card').forEach(card => {
      const pId = parseInt(card.getAttribute('data-phase-id'), 10);
      card.classList.remove('active', 'completed');
      if (pId === phase.id) card.classList.add('active');
      else if (pId < phase.id) card.classList.add('completed');
    });

    // 2. Update Phase Header & Sub-step Title
    const subIdx = phase.steps.findIndex(s => s.num === stepNumber) + 1;
    const badgeEl = document.getElementById('phase-indicator-pill');
    const titleEl = document.getElementById('phase-step-title');
    const cheerEl = document.getElementById('phase-cheer-badge');

    if (badgeEl) badgeEl.innerText = `Phase ${phase.id}: Step ${subIdx} of ${phase.steps.length}`;
    if (titleEl) titleEl.innerText = meta.title;
    if (cheerEl) cheerEl.innerText = meta.cheer;

    // 3. Render Sub-step pills / Horizontal Connected Milestone Checkpoints
    const trackEl = document.getElementById('milestone-checkpoints-row') || document.getElementById('phase-substep-track');
    if (trackEl) {
      trackEl.innerHTML = phase.steps.map(s => {
        const isCurrent = s.num === stepNumber ? 'active' : (s.num < stepNumber ? 'completed' : '');
        return `
          <button class="milestone-checkpoint-pill substep-pill ${isCurrent}" onclick="app.setStep(${s.num})" title="${s.title}">
            <span>${s.label}</span>
          </button>
        `;
      }).join('');
    }

    // 4. Inject Active Step HTML into Options Viewport
    const contentEl = document.getElementById('wizard-step-content');
    if (contentEl) {
      contentEl.innerHTML = this.getStepHtml(stepNumber);
      this.bindStepEvents(contentEl);
      this.syncStepSelections(contentEl);
    }

    // 5. Update Navigation Buttons
    const backBtn = document.getElementById('wizard-back-btn');
    const nextBtn = document.getElementById('wizard-next-btn');
    if (backBtn) {
      backBtn.style.visibility = stepNumber === 1 ? 'hidden' : 'visible';
    }
    if (nextBtn) {
      nextBtn.innerText = stepNumber === this.totalSteps ? 'FINISH & VIEW CARD 🎉' : 'NEXT →';
    }

    this.updatePhraseBadge();
    this.updateAllPreviews();
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.setStep(this.currentStep + 1);
    } else {
      this.goToScreen('screen-final');
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.setStep(this.currentStep - 1);
    }
  }

  goToScreen(screenId) {
    window.soundEngine.playPop();
    document.querySelectorAll('.screen-view').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');
    this.currentScreen = screenId;

    if (screenId === 'screen-final') {
      const monster = window.monsterStore.get();
      const mount = document.getElementById('final-passport-mount');
      if (mount) {
        mount.innerHTML = window.monsterPassportEngine.generatePassportHtml(monster);
      }
      if (window.teacherMode) {
        window.teacherMode.addPoints(3, 'Monster Complete!');
      }
    }
    this.updateAllPreviews();
  }

  startCreation() {
    this.setStep(1);
    this.goToScreen('screen-create');
  }

  // ==========================================
  // OPTIONS HTML GENERATOR FOR EACH STEP
  // ==========================================
  getStepHtml(stepNum) {
    const m = window.monsterStore ? window.monsterStore.get() : {};

    switch (stepNum) {
      case 1: // BODY
        return `
          <div class="options-instruction-title">🧸 Choose Your Monster's Body Shape:</div>
          <div class="tactile-opt-grid">
            <button class="tactile-opt-card" data-body="round"><span class="opt-emoji">⚽</span><span>Round</span></button>
            <button class="tactile-opt-card" data-body="tall"><span class="opt-emoji">🦒</span><span>Tall</span></button>
            <button class="tactile-opt-card" data-body="short"><span class="opt-emoji">🍄</span><span>Short</span></button>
            <button class="tactile-opt-card" data-body="wide"><span class="opt-emoji">🥪</span><span>Wide</span></button>
            <button class="tactile-opt-card" data-body="thin"><span class="opt-emoji">🥢</span><span>Thin</span></button>
            <button class="tactile-opt-card" data-body="blob"><span class="opt-emoji">🍮</span><span>Blob</span></button>
            <button class="tactile-opt-card" data-body="ghost"><span class="opt-emoji">👻</span><span>Ghost</span></button>
            <button class="tactile-opt-card" data-body="dinosaur"><span class="opt-emoji">🦖</span><span>Dinosaur</span></button>
            <button class="tactile-opt-card" data-body="robot"><span class="opt-emoji">🤖</span><span>Robot</span></button>
          </div>
        `;

      case 2: // EYES
        return `
          <div class="options-instruction-title">👁️ How many eyes does it have?</div>
          <div class="subgroup-wrapper">
            <span class="subgroup-label">Number of Eyes:</span>
            <div class="tactile-opt-grid">
              <button class="tactile-opt-card" data-eye-count="1"><span class="opt-emoji">👁️</span><span>1 Eye</span></button>
              <button class="tactile-opt-card" data-eye-count="2"><span class="opt-emoji">👀</span><span>2 Eyes</span></button>
              <button class="tactile-opt-card" data-eye-count="3"><span class="opt-emoji">✨</span><span>3 Eyes</span></button>
              <button class="tactile-opt-card" data-eye-count="4"><span class="opt-emoji">🕷️</span><span>4 Eyes</span></button>
            </div>
          </div>
          <div class="subgroup-wrapper" style="margin-top: 14px;">
            <span class="subgroup-label">Eye Size:</span>
            <div class="tactile-opt-grid">
              <button class="tactile-opt-card" data-eye-size="tiny"><span>Tiny</span></button>
              <button class="tactile-opt-card" data-eye-size="small"><span>Small</span></button>
              <button class="tactile-opt-card" data-eye-size="big"><span>Big</span></button>
              <button class="tactile-opt-card" data-eye-size="giant"><span>Giant</span></button>
            </div>
          </div>
        `;

      case 3: // EARS & HORNS
        return `
          <div class="options-instruction-title">🦄 Add Ears and Horns:</div>
          <div class="subgroup-wrapper">
            <span class="subgroup-label">Ears:</span>
            <div class="tactile-opt-grid">
              <button class="tactile-opt-card" data-ear-count="0"><span>No Ears</span></button>
              <button class="tactile-opt-card" data-ear-count="2"><span class="opt-emoji">👂</span><span>2 Ears</span></button>
            </div>
          </div>
          <div class="subgroup-wrapper" style="margin-top: 14px;">
            <span class="subgroup-label">Horns:</span>
            <div class="tactile-opt-grid">
              <button class="tactile-opt-card" data-horn-count="0"><span>No Horns</span></button>
              <button class="tactile-opt-card" data-horn-count="1"><span class="opt-emoji">🦄</span><span>1 Horn</span></button>
              <button class="tactile-opt-card" data-horn-count="2"><span class="opt-emoji">⚡</span><span>2 Horns</span></button>
            </div>
          </div>
        `;

      case 4: // FACE / MOUTH
        return `
          <div class="options-instruction-title">👄 Make the Face:</div>
          <div class="subgroup-wrapper">
            <span class="subgroup-label">Mouth & Smile:</span>
            <div class="tactile-opt-grid">
              <button class="tactile-opt-card" data-mouth="big"><span class="opt-emoji">😃</span><span>Big Smile</span></button>
              <button class="tactile-opt-card" data-mouth="smiling"><span class="opt-emoji">😊</span><span>Happy</span></button>
              <button class="tactile-opt-card" data-mouth="huge"><span class="opt-emoji">😄</span><span>Huge Laugh</span></button>
            </div>
          </div>
        `;

      case 5: // ARMS & LEGS
        return `
          <div class="options-instruction-title">👐 Choose Arms and Legs:</div>
          <div class="subgroup-wrapper">
            <span class="subgroup-label">Number of Arms:</span>
            <div class="tactile-opt-grid">
              <button class="tactile-opt-card" data-arm-count="0"><span>No Arms</span></button>
              <button class="tactile-opt-card" data-arm-count="2"><span class="opt-emoji">👐</span><span>2 Arms</span></button>
              <button class="tactile-opt-card" data-arm-count="4"><span class="opt-emoji">💪</span><span>4 Arms</span></button>
            </div>
          </div>
          <div class="subgroup-wrapper" style="margin-top: 14px;">
            <span class="subgroup-label">Number of Legs:</span>
            <div class="tactile-opt-grid">
              <button class="tactile-opt-card" data-leg-count="1"><span class="opt-emoji">🦿</span><span>1 Leg</span></button>
              <button class="tactile-opt-card" data-leg-count="2"><span class="opt-emoji">🦵</span><span>2 Legs</span></button>
              <button class="tactile-opt-card" data-leg-count="4"><span class="opt-emoji">🐾</span><span>4 Legs</span></button>
            </div>
          </div>
        `;

      case 6: // COLORS
        return `
          <div class="options-instruction-title">🎨 Pick Monster Colors:</div>
          <div class="subgroup-wrapper">
            <span class="subgroup-label">Body Color:</span>
            <div class="color-swatch-cluster">
              <button class="swatch-disc-3d swatch-purple" data-color="purple"></button>
              <button class="swatch-disc-3d swatch-green" data-color="green"></button>
              <button class="swatch-disc-3d swatch-blue" data-color="blue"></button>
              <button class="swatch-disc-3d swatch-red" data-color="red"></button>
              <button class="swatch-disc-3d swatch-orange" data-color="orange"></button>
              <button class="swatch-disc-3d swatch-yellow" data-color="yellow"></button>
              <button class="swatch-disc-3d swatch-pink" data-color="pink"></button>
              <button class="swatch-disc-3d swatch-black" data-color="black"></button>
              <button class="swatch-disc-3d swatch-white" data-color="white"></button>
            </div>
          </div>
        `;

      case 7: // SPECIAL FEATURES
        return `
          <div class="options-instruction-title">🐉 Add Wings and Tails:</div>
          <div class="subgroup-wrapper">
            <span class="subgroup-label">Wings:</span>
            <div class="tactile-opt-grid">
              <button class="tactile-opt-card" data-wings="none"><span>No Wings</span></button>
              <button class="tactile-opt-card" data-wings="dragon"><span class="opt-emoji">🐉</span><span>Dragon</span></button>
              <button class="tactile-opt-card" data-wings="butterfly"><span class="opt-emoji">🦋</span><span>Butterfly</span></button>
              <button class="tactile-opt-card" data-wings="bat"><span class="opt-emoji">🦇</span><span>Bat</span></button>
            </div>
          </div>
          <div class="subgroup-wrapper" style="margin-top: 14px;">
            <span class="subgroup-label">Tail:</span>
            <div class="tactile-opt-grid">
              <button class="tactile-opt-card" data-tail="none"><span>No Tail</span></button>
              <button class="tactile-opt-card" data-tail="long"><span class="opt-emoji">🐒</span><span>Long Tail</span></button>
              <button class="tactile-opt-card" data-tail="dinosaur"><span class="opt-emoji">🦕</span><span>Dino Tail</span></button>
            </div>
          </div>
        `;

      case 8: // CLOTHES
        return `
          <div class="options-instruction-title">👕 Dress Your Monster:</div>
          <div class="subgroup-wrapper">
            <span class="subgroup-label">Tops:</span>
            <div class="tactile-opt-grid">
              <button class="tactile-opt-card" data-top="none"><span>None</span></button>
              <button class="tactile-opt-card" data-top="tshirt"><span class="opt-emoji">👕</span><span>T-Shirt</span></button>
              <button class="tactile-opt-card" data-top="jacket"><span class="opt-emoji">🧥</span><span>Jacket</span></button>
            </div>
          </div>
          <div class="subgroup-wrapper" style="margin-top: 14px;">
            <span class="subgroup-label">Superhero Cape:</span>
            <div class="tactile-opt-grid">
              <button class="tactile-opt-card" data-cape="false"><span>No Cape</span></button>
              <button class="tactile-opt-card" data-cape="true"><span class="opt-emoji">🦸</span><span>Red Cape!</span></button>
            </div>
          </div>
        `;

      case 9: // ACCESSORIES
        return `
          <div class="options-instruction-title">🧢 Cool Items & Accessories:</div>
          <div class="tactile-opt-grid">
            <button class="tactile-opt-card" data-acc="hat"><span class="opt-emoji">🤠</span><span>Hat</span></button>
            <button class="tactile-opt-card" data-acc="crown"><span class="opt-emoji">👑</span><span>Crown</span></button>
            <button class="tactile-opt-card" data-acc="glasses"><span class="opt-emoji">👓</span><span>Glasses</span></button>
            <button class="tactile-opt-card" data-acc="sunglasses"><span class="opt-emoji">🕶️</span><span>Sunglasses</span></button>
          </div>
        `;

      case 10: // POWERS
        return `
          <div class="options-instruction-title">⚡ Super Powers:</div>
          <div class="tactile-opt-grid">
            <button class="tactile-opt-card" data-power="fly"><span class="opt-emoji">🦅</span><span>Can Fly</span></button>
            <button class="tactile-opt-card" data-power="breathe_fire"><span class="opt-emoji">🔥</span><span>Breathe Fire</span></button>
            <button class="tactile-opt-card" data-power="shoot_lightning"><span class="opt-emoji">⚡</span><span>Lightning</span></button>
            <button class="tactile-opt-card" data-power="invisible"><span class="opt-emoji">👻</span><span>Invisible</span></button>
            <button class="tactile-opt-card" data-power="magic"><span class="opt-emoji">✨</span><span>Magic</span></button>
          </div>
        `;

      case 11: // WORLD & FOOD
        return `
          <div class="options-instruction-title">🏠 Where does it live & what does it eat?</div>
          <div class="subgroup-wrapper">
            <span class="subgroup-label">Home World:</span>
            <div class="tactile-opt-grid">
              <button class="tactile-opt-card" data-world="castle"><span class="opt-emoji">🏰</span><span>Castle</span></button>
              <button class="tactile-opt-card" data-world="forest"><span class="opt-emoji">🌲</span><span>Forest</span></button>
              <button class="tactile-opt-card" data-world="volcano"><span class="opt-emoji">🌋</span><span>Volcano</span></button>
              <button class="tactile-opt-card" data-world="space"><span class="opt-emoji">🚀</span><span>Space</span></button>
            </div>
          </div>
          <div class="subgroup-wrapper" style="margin-top: 14px;">
            <span class="subgroup-label">Favorite Food:</span>
            <div class="tactile-opt-grid">
              <button class="tactile-opt-card" data-food="pizza"><span class="opt-emoji">🍕</span><span>Pizza</span></button>
              <button class="tactile-opt-card" data-food="burgers"><span class="opt-emoji">🍔</span><span>Burgers</span></button>
              <button class="tactile-opt-card" data-food="ice cream"><span class="opt-emoji">🍦</span><span>Ice Cream</span></button>
              <button class="tactile-opt-card" data-food="apples"><span class="opt-emoji">🍎</span><span>Apples</span></button>
            </div>
          </div>
        `;

      case 12: // NAME & MONSTER ID CARD
        return `
          <div class="options-instruction-title">📛 Name Your Monster & View Passport:</div>
          <div style="background:#f8fafc; border:3px solid #e2e8f0; border-radius:16px; padding:18px; margin-bottom:14px;">
            <div style="display:flex; gap:10px; align-items:center;">
              <input type="text" id="monster-name-input" value="${m.name || 'Zippy'}" 
                     style="flex:1; padding:12px; font-size:1.2rem; font-weight:800; border-radius:12px; border:3px solid #cbd5e1;" 
                     oninput="app.setMonsterName(this.value)" placeholder="Type monster name...">
              <button class="btn-clay btn-jelly-accent" onclick="app.pickRandomName()">🎲 RANDOM</button>
            </div>
          </div>
          ${window.monsterPassportEngine.generatePassportHtml(m)}
        `;

      default:
        return '';
    }
  }

  // ==========================================
  // EVENT BINDINGS FOR OPTIONS
  // ==========================================
  bindStepEvents(container) {
    // Body
    container.querySelectorAll('[data-body]').forEach(b => {
      b.onclick = () => {
        window.monsterStore.update(m => { m.body = b.getAttribute('data-body'); });
        this.syncStepSelections(container);
      };
    });

    // Eyes
    container.querySelectorAll('[data-eye-count]').forEach(b => {
      b.onclick = () => {
        window.monsterStore.update(m => { m.eyes.count = parseInt(b.getAttribute('data-eye-count'), 10); });
        this.syncStepSelections(container);
      };
    });
    container.querySelectorAll('[data-eye-size]').forEach(b => {
      b.onclick = () => {
        window.monsterStore.update(m => { m.eyes.size = b.getAttribute('data-eye-size'); });
        this.syncStepSelections(container);
      };
    });

    // Ears / Horns
    container.querySelectorAll('[data-ear-count]').forEach(b => {
      b.onclick = () => {
        window.monsterStore.update(m => { m.ears.count = parseInt(b.getAttribute('data-ear-count'), 10); });
        this.syncStepSelections(container);
      };
    });
    container.querySelectorAll('[data-horn-count]').forEach(b => {
      b.onclick = () => {
        window.monsterStore.update(m => { m.horns.count = parseInt(b.getAttribute('data-horn-count'), 10); });
        this.syncStepSelections(container);
      };
    });

    // Mouth
    container.querySelectorAll('[data-mouth]').forEach(b => {
      b.onclick = () => {
        window.monsterStore.update(m => { m.mouth = b.getAttribute('data-mouth'); });
        this.syncStepSelections(container);
      };
    });

    // Arms & Legs
    container.querySelectorAll('[data-arm-count]').forEach(b => {
      b.onclick = () => {
        window.monsterStore.update(m => { m.arms.count = parseInt(b.getAttribute('data-arm-count'), 10); });
        this.syncStepSelections(container);
      };
    });
    container.querySelectorAll('[data-leg-count]').forEach(b => {
      b.onclick = () => {
        window.monsterStore.update(m => { m.legs.count = parseInt(b.getAttribute('data-leg-count'), 10); });
        this.syncStepSelections(container);
      };
    });

    // Colors
    container.querySelectorAll('[data-color]').forEach(b => {
      b.onclick = () => {
        window.monsterStore.update(m => { m.color = b.getAttribute('data-color'); });
        this.syncStepSelections(container);
      };
    });

    // Wings & Tail
    container.querySelectorAll('[data-wings]').forEach(b => {
      b.onclick = () => {
        window.monsterStore.update(m => { m.specialParts.wings = b.getAttribute('data-wings'); });
        this.syncStepSelections(container);
      };
    });
    container.querySelectorAll('[data-tail]').forEach(b => {
      b.onclick = () => {
        window.monsterStore.update(m => { m.specialParts.tail = b.getAttribute('data-tail'); });
        this.syncStepSelections(container);
      };
    });

    // Clothes
    container.querySelectorAll('[data-top]').forEach(b => {
      b.onclick = () => {
        window.monsterStore.update(m => { m.clothes.top = b.getAttribute('data-top'); });
        this.syncStepSelections(container);
      };
    });
    container.querySelectorAll('[data-cape]').forEach(b => {
      b.onclick = () => {
        window.monsterStore.update(m => { m.clothes.cape = b.getAttribute('data-cape') === 'true'; });
        this.syncStepSelections(container);
      };
    });

    // Accessories
    container.querySelectorAll('[data-acc]').forEach(b => {
      b.onclick = () => {
        const item = b.getAttribute('data-acc');
        window.monsterStore.update(m => {
          if (m.accessories.includes(item)) m.accessories = m.accessories.filter(a => a !== item);
          else m.accessories.push(item);
        });
        this.syncStepSelections(container);
      };
    });

    // Powers
    container.querySelectorAll('[data-power]').forEach(b => {
      b.onclick = () => {
        const p = b.getAttribute('data-power');
        window.monsterStore.update(m => {
          if (m.powers.includes(p)) m.powers = m.powers.filter(x => x !== p);
          else m.powers.push(p);
        });
        this.syncStepSelections(container);
      };
    });

    // World & Food
    container.querySelectorAll('[data-world]').forEach(b => {
      b.onclick = () => {
        window.monsterStore.update(m => { m.world = b.getAttribute('data-world'); });
        this.syncStepSelections(container);
      };
    });
    container.querySelectorAll('[data-food]').forEach(b => {
      b.onclick = () => {
        window.monsterStore.update(m => { m.food = b.getAttribute('data-food'); });
        this.syncStepSelections(container);
      };
    });
  }

  syncStepSelections(container) {
    if (!container || !window.monsterStore) return;
    const m = window.monsterStore.get();

    // Body
    container.querySelectorAll('[data-body]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-body') === m.body);
    });
    // Eyes
    container.querySelectorAll('[data-eye-count]').forEach(b => {
      b.classList.toggle('active', parseInt(b.getAttribute('data-eye-count'), 10) === m.eyes.count);
    });
    container.querySelectorAll('[data-eye-size]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-eye-size') === m.eyes.size);
    });
    // Ears / Horns
    container.querySelectorAll('[data-ear-count]').forEach(b => {
      b.classList.toggle('active', parseInt(b.getAttribute('data-ear-count'), 10) === m.ears.count);
    });
    container.querySelectorAll('[data-horn-count]').forEach(b => {
      b.classList.toggle('active', parseInt(b.getAttribute('data-horn-count'), 10) === m.horns.count);
    });
    // Colors
    container.querySelectorAll('[data-color]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-color') === m.color);
    });
    // Wings / Tail
    container.querySelectorAll('[data-wings]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-wings') === m.specialParts.wings);
    });
    container.querySelectorAll('[data-tail]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tail') === m.specialParts.tail);
    });
    // Clothes
    container.querySelectorAll('[data-top]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-top') === m.clothes.top);
    });
    container.querySelectorAll('[data-cape]').forEach(b => {
      b.classList.toggle('active', (b.getAttribute('data-cape') === 'true') === m.clothes.cape);
    });
    // Accessories
    container.querySelectorAll('[data-acc]').forEach(b => {
      b.classList.toggle('active', m.accessories.includes(b.getAttribute('data-acc')));
    });
    // Powers
    container.querySelectorAll('[data-power]').forEach(b => {
      b.classList.toggle('active', m.powers.includes(b.getAttribute('data-power')));
    });
    // World / Food
    container.querySelectorAll('[data-world]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-world') === m.world);
    });
    container.querySelectorAll('[data-food]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-food') === m.food);
    });
  }

  // Previews
  updateAllPreviews() {
    if (!window.monsterStore) return;
    const monster = window.monsterStore.get();
    const svgHtml = window.monsterRenderer.renderSvg(monster);

    ['create-monster-preview', 'start-monster-preview'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = svgHtml;
    });

    const passportSnap = document.getElementById('passport-snapshot-viewport');
    if (passportSnap) {
      passportSnap.innerHTML = window.monsterRenderer.renderSvg(monster, { width: 220, height: 260, animated: false });
    }
  }

  updatePhraseBadge() {
    if (!window.monsterStore) return;
    const m = window.monsterStore.get();
    let text = `${m.color.toUpperCase()} ${m.body.toUpperCase()} BODY`;
    const el = document.getElementById('active-phrase-text');
    if (el) el.innerText = text;
  }

  speakActivePhrase() {
    const el = document.getElementById('active-phrase-text');
    if (el) window.soundEngine.speak(el.innerText);
  }

  setMonsterName(name) {
    if (!window.monsterStore) return;
    window.monsterStore.update(m => { m.name = name; });
    const nameEl = document.getElementById('passport-name-field');
    if (nameEl) nameEl.innerText = name.toUpperCase();
  }

  pickRandomName() {
    const r = this.randomNames[Math.floor(Math.random() * this.randomNames.length)];
    this.setMonsterName(r);
    const input = document.getElementById('monster-name-input');
    if (input) input.value = r;
  }

  makeItWeird() {
    window.soundEngine.playPop();
    const bodies = ['round', 'tall', 'short', 'wide', 'thin', 'blob', 'ghost', 'dinosaur', 'robot'];
    const colors = ['purple', 'green', 'blue', 'red', 'orange', 'yellow', 'pink'];
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];

    window.monsterStore.update(m => {
      m.body = pick(bodies);
      m.color = pick(colors);
      m.eyes.count = pick([1, 2, 3, 4]);
      m.horns.count = pick([0, 1, 2]);
      m.specialParts.wings = pick(['none', 'dragon', 'butterfly', 'bat']);
      m.specialParts.tail = pick(['none', 'long', 'dinosaur']);
      m.name = pick(this.randomNames);
    });

    this.updateAllPreviews();
  }

  toggleSfx() {
    const on = window.soundEngine.toggleSfx();
    const btn = document.getElementById('sfx-toggle-btn');
    if (btn) btn.innerText = on ? '🔊 SFX: ON' : '🔇 SFX: OFF';
  }

  toggleTts() {
    const on = window.soundEngine.toggleTts();
    const btn = document.getElementById('tts-toggle-btn');
    if (btn) btn.innerText = on ? '🗣️ Voice: ON' : '🤐 Voice: OFF';
  }

  openFindMonsterGame() {
    window.soundEngine.playPop();
    const modal = document.getElementById('find-monster-modal');
    if (modal) modal.classList.add('active');
  }

  closeFindMonsterGame() {
    const modal = document.getElementById('find-monster-modal');
    if (modal) modal.classList.remove('active');
  }

  showResetModal() {
    const modal = document.getElementById('reset-confirm-modal');
    if (modal) modal.classList.add('active');
  }

  closeResetModal() {
    const modal = document.getElementById('reset-confirm-modal');
    if (modal) modal.classList.remove('active');
  }

  confirmReset() {
    if (window.monsterStore) window.monsterStore.reset();
    this.closeResetModal();
    this.setStep(1);
    this.goToScreen('screen-create');
  }

  // ==========================================
  // SPEAKING TELEPROMPTER MODE
  // ==========================================
  startSpeakingMode() {
    window.soundEngine.playPop();
    const monster = window.monsterStore.get();
    if (window.grammarEngine) {
      this.speakingSteps = window.grammarEngine.getSpeakingSentences(monster);
    } else {
      this.speakingSteps = [{ icon: '🧸', starter: 'My monster has', text: `My monster has a ${monster.body} body.` }];
    }
    this.speakingStepIndex = 0;

    const modal = document.getElementById('speaking-teleprompter-modal');
    if (modal) {
      modal.classList.add('active');
      this.renderSpeakingStep();
    }
  }

  renderSpeakingStep() {
    if (!this.speakingSteps || this.speakingSteps.length === 0) return;
    const step = this.speakingSteps[this.speakingStepIndex];
    const total = this.speakingSteps.length;

    const countEl = document.getElementById('speaking-step-counter');
    const iconEl = document.getElementById('speaking-icon-badge');
    const promptEl = document.getElementById('speaking-starter-prompt');
    const sentEl = document.getElementById('speaking-main-sentence');

    if (countEl) countEl.innerText = `Sentence ${this.speakingStepIndex + 1} of ${total}`;
    if (iconEl) iconEl.innerText = step.icon || '🎤';
    if (promptEl) promptEl.innerText = `🗣️ SAY: "${step.starter || ''}"`;
    if (sentEl) sentEl.innerHTML = `<strong>${step.text}</strong>`;

    window.soundEngine.speak(step.text);
  }

  nextSpeakingStep() {
    if (this.speakingSteps && this.speakingStepIndex < this.speakingSteps.length - 1) {
      this.speakingStepIndex++;
      window.soundEngine.playPop();
      this.renderSpeakingStep();
    } else {
      if (window.teacherMode) {
        window.teacherMode.stats.speakingCompletedCount++;
        window.teacherMode.addPoints(3, 'Speaking Star!');
      }
      this.closeSpeakingModal();
    }
  }

  prevSpeakingStep() {
    if (this.speakingStepIndex > 0) {
      this.speakingStepIndex--;
      window.soundEngine.playPop();
      this.renderSpeakingStep();
    }
  }

  closeSpeakingModal() {
    const modal = document.getElementById('speaking-teleprompter-modal');
    if (modal) modal.classList.remove('active');
    window.soundEngine.stopSpeech();
  }

  // ==========================================
  // PRESENTATION MODE
  // ==========================================
  openPresentationMode() {
    window.soundEngine.playPop();
    const modal = document.getElementById('presentation-mode-modal');
    if (!modal) return;
    const monster = window.monsterStore.get();
    modal.classList.add('active');

    const nameEl = document.getElementById('pres-monster-name');
    if (nameEl) nameEl.innerText = monster.name.toUpperCase();

    const bulletsList = document.getElementById('pres-bullets-list');
    if (bulletsList && window.grammarEngine) {
      const summary = window.grammarEngine.getMonsterSummary(monster);
      const items = [
        `🎨 ${summary.colorDesc}`,
        `👁️ ${window.grammarEngine.getEyesPhrase(monster)}`,
        monster.horns.count > 0 ? `🦄 ${window.grammarEngine.getHornsPhrase(monster)}` : null,
        `👄 ${window.grammarEngine.getMouthPhrase(monster)}`,
        `👐 ${window.grammarEngine.getArmsPhrase(monster)}`,
        `🦵 ${window.grammarEngine.getLegsPhrase(monster)}`,
        summary.powers ? `✨ Can ${summary.powers}` : null,
        summary.world ? `🏠 Lives in ${summary.world}` : null,
        summary.food ? `🍕 Likes ${summary.food}` : null
      ].filter(Boolean);

      bulletsList.innerHTML = items.map(it => `
        <div class="pres-bullet-card" onclick="window.soundEngine.speak('${it.replace(/[^a-zA-Z0-9 ]/g, '')}')">
          <span>${it}</span>
          <button class="pres-speak-chip">🔊</button>
        </div>
      `).join('');
    }
    this.updateAllPreviews();
  }

  closePresentationMode() {
    const modal = document.getElementById('presentation-mode-modal');
    if (modal) modal.classList.remove('active');
    window.soundEngine.stopSpeech();
  }

  speakFullDescription() {
    if (window.grammarEngine && window.monsterStore) {
      const desc = window.grammarEngine.getFullDescription(window.monsterStore.get());
      window.soundEngine.speak(desc);
    }
  }

  downloadMonsterCard() {
    window.monsterPassportEngine.downloadPassportAsPng();
  }

  // ==========================================
  // CHALLENGES, LISTENING & SECRET MONSTER
  // ==========================================
  setupChallengeView() {
    if (!window.challengeEngine) return;
    const quest = window.challengeEngine.getCurrentQuest();
    const t = document.getElementById('challenge-quest-title');
    const i = document.getElementById('challenge-quest-instruction');
    const h = document.getElementById('challenge-quest-hint');
    const b = document.getElementById('challenge-feedback-banner');

    if (t) t.innerText = `Mission: ${quest.title}`;
    if (i) i.innerText = `👉 ${quest.instruction}`;
    if (h) h.innerText = `💡 ${quest.hint}`;
    if (b) b.className = 'feedback-banner hidden';

    window.soundEngine.speak(quest.instruction);
    this.updateAllPreviews();
  }

  checkChallenge() {
    if (!window.challengeEngine) return;
    const quest = window.challengeEngine.getCurrentQuest();
    const monster = window.monsterStore.get();
    const isCorrect = quest.check(monster);
    const banner = document.getElementById('challenge-feedback-banner');

    if (isCorrect) {
      window.soundEngine.playPop();
      if (window.teacherMode) {
        window.teacherMode.stats.challengesSolved++;
        window.teacherMode.addPoints(2, 'Mission Complete');
        window.teacherMode.triggerConfetti();
      }
      if (banner) {
        banner.className = 'feedback-banner success';
        banner.innerHTML = `<h3>⭐ GREAT JOB! ⭐</h3><p>You built: <strong>${quest.instruction}</strong></p><button class="btn btn-primary" onclick="app.advanceChallenge()">NEXT MISSION ➔</button>`;
      }
    } else {
      if (banner) {
        banner.className = 'feedback-banner error';
        banner.innerHTML = `<h3>💪 KEEP TRYING!</h3><p>${quest.hint}</p><button class="btn btn-secondary" onclick="app.startCreation('challenge')">🛠️ Open Creator & Fix</button>`;
      }
    }
  }

  advanceChallenge() {
    if (window.challengeEngine) {
      window.challengeEngine.nextQuest();
      this.setupChallengeView();
    }
  }

  setupListeningView() {
    if (!window.challengeEngine) return;
    const task = window.challengeEngine.getCurrentListening();
    const diff = window.challengeEngine.listeningDifficulty;
    const card = document.getElementById('listening-instruction-card');

    if (card) {
      if (diff === 'hard') {
        card.innerHTML = `<div class="quest-mission-title">👂 Audio Clue Active!</div><p>Listen carefully and build what you hear!</p>`;
      } else {
        card.innerHTML = `<div class="quest-mission-title">👂 Spoken Clue:</div><p>👉 ${task.easyText}</p>`;
      }
    }

    const b = document.getElementById('listening-feedback-banner');
    if (b) b.className = 'feedback-banner hidden';
    window.soundEngine.speak(task.audioText);
    this.updateAllPreviews();
  }

  playListeningAudio() {
    if (window.challengeEngine) {
      const task = window.challengeEngine.getCurrentListening();
      window.soundEngine.speak(task.audioText);
    }
  }

  setListeningDifficulty(diff) {
    if (window.challengeEngine) {
      window.challengeEngine.listeningDifficulty = diff;
      document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.diff === diff);
      });
      this.setupListeningView();
    }
  }

  checkListening() {
    if (!window.challengeEngine) return;
    const task = window.challengeEngine.getCurrentListening();
    const monster = window.monsterStore.get();
    const isCorrect = task.check(monster);
    const banner = document.getElementById('listening-feedback-banner');

    if (isCorrect) {
      window.soundEngine.playPop();
      if (window.teacherMode) {
        window.teacherMode.addPoints(2, 'Listening Star');
        window.teacherMode.triggerConfetti();
      }
      if (banner) {
        banner.className = 'feedback-banner success';
        banner.innerHTML = `<h3>⭐ FANTASTIC LISTENING! ⭐</h3><p>You built: <strong>${task.audioText}</strong></p><button class="btn btn-primary" onclick="app.advanceListening()">NEXT LISTENING CLUE ➔</button>`;
      }
    } else {
      if (banner) {
        banner.className = 'feedback-banner error';
        banner.innerHTML = `<h3>💪 LISTEN AGAIN!</h3><button class="btn btn-accent" onclick="app.playListeningAudio()">🔊 Replay Audio</button><button class="btn btn-secondary" onclick="app.startCreation('listening')">🛠️ Open Creator & Fix</button>`;
      }
    }
  }

  advanceListening() {
    if (window.challengeEngine) {
      window.challengeEngine.nextListening();
      this.setupListeningView();
    }
  }

  updateCreatorQuestBanner() {
    const banner = document.getElementById('creator-mode-banner');
    const textEl = document.getElementById('banner-quest-text');
    const replayBtn = document.getElementById('banner-audio-replay-btn');

    if (this.currentMode === 'challenge' && window.challengeEngine) {
      const quest = window.challengeEngine.getCurrentQuest();
      if (textEl) textEl.innerText = `Mission: ${quest.instruction}`;
      if (replayBtn) replayBtn.style.display = 'none';
    } else if (this.currentMode === 'listening' && window.challengeEngine) {
      const task = window.challengeEngine.getCurrentListening();
      if (textEl) textEl.innerText = `Clue: ${task.easyText}`;
      if (replayBtn) replayBtn.style.display = 'inline-block';
    }
  }

  checkCurrentModeMission() {
    if (this.currentMode === 'challenge') {
      this.goToScreen('screen-challenge');
      this.checkChallenge();
    } else if (this.currentMode === 'listening') {
      this.goToScreen('screen-listening');
      this.checkListening();
    }
  }

  returnToModeScreen() {
    if (this.currentMode === 'challenge') this.goToScreen('screen-challenge');
    else if (this.currentMode === 'listening') this.goToScreen('screen-listening');
    else if (this.currentMode === 'secret') this.goToScreen('screen-secret');
    else this.goToScreen('screen-modes-hub');
  }

  setupSecretMonsterView() {
    if (!window.challengeEngine) return;
    const secret = window.challengeEngine.generateSecretMonster();
    const s1 = document.getElementById('secret-step-1');
    const s2 = document.getElementById('secret-step-2');
    if (s1) s1.classList.add('active');
    if (s2) s2.classList.remove('active');

    const cluesList = document.getElementById('secret-card-features');
    if (cluesList) {
      cluesList.innerHTML = `
        <div class="secret-clue-pill">🎨 Color: ${secret.color.toUpperCase()}</div>
        <div class="secret-clue-pill">👁️ Eyes: ${secret.eyes.count} EYES</div>
        <div class="secret-clue-pill">👂 Ears: ${secret.ears.count} EARS</div>
        <div class="secret-clue-pill">🦄 Horns: ${secret.horns.count > 0 ? `${secret.horns.count} HORNS` : 'NO HORNS'}</div>
        <div class="secret-clue-pill">👐 Arms: ${secret.arms.count} ARMS</div>
        <div class="secret-clue-pill">🦵 Legs: ${secret.legs.count} LEGS</div>
      `;
    }
    this.updateAllPreviews();
  }

  compareSecretMonster() {
    if (!window.challengeEngine) return;
    window.soundEngine.playPop();
    const monster = window.monsterStore.get();
    const result = window.challengeEngine.compareMonsters(monster);

    const s1 = document.getElementById('secret-step-1');
    const s2 = document.getElementById('secret-step-2');
    if (s1) s1.classList.remove('active');
    if (s2) s2.classList.add('active');

    const secretSvg = window.monsterRenderer.renderSvg(window.challengeEngine.secretMonsterTarget, { animated: false });
    const playerSvg = window.monsterRenderer.renderSvg(monster, { animated: false });

    const revSec = document.getElementById('secret-monster-reveal-preview');
    const revPlay = document.getElementById('player-monster-reveal-preview');
    if (revSec) revSec.innerHTML = secretSvg;
    if (revPlay) revPlay.innerHTML = playerSvg;

    const banner = document.getElementById('secret-score-banner');
    if (banner) {
      banner.innerHTML = `<h2>⭐ ${result.correct} / ${result.total} CORRECT! ⭐</h2>`;
    }

    if (window.teacherMode) {
      window.teacherMode.addPoints(result.correct, 'Secret Monster');
      window.teacherMode.triggerConfetti();
    }
  }
}

// Global MonsterApp Singleton
window.app = new MonsterApp();
