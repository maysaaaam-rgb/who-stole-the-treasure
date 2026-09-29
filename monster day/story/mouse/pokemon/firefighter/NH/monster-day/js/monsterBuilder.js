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
    // Master Torso Anchor Origin (x0, y0) centered for 300 x 320 viewBox
    this.TORSO_ORIGIN = { x0: 150, y0: 160 };

    // Standardized sockets defined for all 9 body types (300 x 320 coordinate system)
    this.sockets = {
      round: {
        id: 'round',
        torso: { cx: 150, cy: 155, r: 75 },
        headTop: { x: 150, y: 80 },
        faceCenter: { cx: 150, cy: 140, eyeY: 125, noseY: 142, mouthY: 162, width: 72 },
        armLeft:  { x: 78, y: 155, rot: -28 },
        armRight: { x: 222, y: 155, rot: 28 },
        legLeft:  { x: 115, y: 220, rot: 0 },
        legRight: { x: 185, y: 220, rot: 0 },
        ears:     { left: { x: 92, y: 98, rot: -26 }, right: { x: 208, y: 98, rot: 26 } },
        horns:    { left: { x: 122, y: 82, rot: -18 }, right: { x: 178, y: 82, rot: 18 } },
        tail:     { x: 85, y: 215 },
        wings:    { left: { x: 85, y: 140 }, right: { x: 215, y: 140 } },
        cape:     { x: 150, y: 135 },
        legs: [
          [{ x: 150, y: 225 }],
          [{ x: 115, y: 220, rot: 0 }, { x: 185, y: 220, rot: 0 }],
          [{ x: 105, y: 220, rot: -4 }, { x: 150, y: 225, rot: 0 }, { x: 195, y: 220, rot: 4 }],
          [{ x: 95, y: 218, rot: -6 }, { x: 130, y: 224, rot: -2 }, { x: 170, y: 224, rot: 2 }, { x: 205, y: 218, rot: 6 }],
          [{ x: 90, y: 218, rot: -8 }, { x: 120, y: 224, rot: -4 }, { x: 150, y: 226, rot: 0 }, { x: 180, y: 224, rot: 4 }, { x: 210, y: 218, rot: 8 }]
        ]
      },
      tall: {
        id: 'tall',
        torso: { cx: 150, cy: 152, width: 120, height: 145, rx: 58 },
        headTop: { x: 150, y: 80 },
        faceCenter: { cx: 150, cy: 135, eyeY: 120, noseY: 138, mouthY: 158, width: 68 },
        armLeft:  { x: 90, y: 140, rot: -28 },
        armRight: { x: 210, y: 140, rot: 28 },
        legLeft:  { x: 115, y: 215, rot: 0 },
        legRight: { x: 185, y: 215, rot: 0 },
        ears:     { left: { x: 95, y: 100, rot: -24 }, right: { x: 205, y: 100, rot: 24 } },
        horns:    { left: { x: 125, y: 82, rot: -16 }, right: { x: 175, y: 82, rot: 16 } },
        tail:     { x: 95, y: 215 },
        wings:    { left: { x: 95, y: 135 }, right: { x: 205, y: 135 } },
        cape:     { x: 150, y: 130 },
        legs: [
          [{ x: 150, y: 220 }],
          [{ x: 115, y: 215, rot: 0 }, { x: 185, y: 215, rot: 0 }],
          [{ x: 105, y: 215, rot: -4 }, { x: 150, y: 220, rot: 0 }, { x: 195, y: 215, rot: 4 }],
          [{ x: 95, y: 215, rot: -6 }, { x: 130, y: 220, rot: -2 }, { x: 170, y: 220, rot: 2 }, { x: 205, y: 215, rot: 6 }],
          [{ x: 90, y: 215, rot: -8 }, { x: 120, y: 220, rot: -4 }, { x: 150, y: 222, rot: 0 }, { x: 180, y: 220, rot: 4 }, { x: 210, y: 215, rot: 8 }]
        ]
      },
      short: {
        id: 'short',
        torso: { cx: 150, cy: 170, rx: 72, ry: 58 },
        headTop: { x: 150, y: 112 },
        faceCenter: { cx: 150, cy: 150, eyeY: 136, noseY: 152, mouthY: 172, width: 72 },
        armLeft:  { x: 80, y: 168, rot: -28 },
        armRight: { x: 220, y: 168, rot: 28 },
        legLeft:  { x: 115, y: 220, rot: 0 },
        legRight: { x: 185, y: 220, rot: 0 },
        ears:     { left: { x: 92, y: 125, rot: -28 }, right: { x: 208, y: 125, rot: 28 } },
        horns:    { left: { x: 120, y: 114, rot: -20 }, right: { x: 180, y: 114, rot: 20 } },
        tail:     { x: 85, y: 215 },
        wings:    { left: { x: 82, y: 150 }, right: { x: 218, y: 150 } },
        cape:     { x: 150, y: 142 },
        legs: [
          [{ x: 150, y: 225 }],
          [{ x: 115, y: 220, rot: 0 }, { x: 185, y: 220, rot: 0 }],
          [{ x: 105, y: 220, rot: -4 }, { x: 150, y: 225, rot: 0 }, { x: 195, y: 220, rot: 4 }],
          [{ x: 95, y: 218, rot: -6 }, { x: 130, y: 224, rot: -2 }, { x: 170, y: 224, rot: 2 }, { x: 205, y: 218, rot: 6 }],
          [{ x: 90, y: 218, rot: -8 }, { x: 120, y: 224, rot: -4 }, { x: 150, y: 226, rot: 0 }, { x: 180, y: 224, rot: 4 }, { x: 210, y: 218, rot: 8 }]
        ]
      },
      wide: {
        id: 'wide',
        torso: { cx: 150, cy: 162, width: 160, height: 115, rx: 50 },
        headTop: { x: 150, y: 105 },
        faceCenter: { cx: 150, cy: 145, eyeY: 130, noseY: 146, mouthY: 168, width: 80 },
        armLeft:  { x: 72, y: 155, rot: -30 },
        armRight: { x: 228, y: 155, rot: 30 },
        legLeft:  { x: 110, y: 215, rot: 0 },
        legRight: { x: 190, y: 215, rot: 0 },
        ears:     { left: { x: 85, y: 115, rot: -32 }, right: { x: 215, y: 115, rot: 32 } },
        horns:    { left: { x: 118, y: 106, rot: -22 }, right: { x: 182, y: 106, rot: 22 } },
        tail:     { x: 80, y: 210 },
        wings:    { left: { x: 75, y: 140 }, right: { x: 225, y: 140 } },
        cape:     { x: 150, y: 135 },
        legs: [
          [{ x: 150, y: 220 }],
          [{ x: 110, y: 215, rot: 0 }, { x: 190, y: 215, rot: 0 }],
          [{ x: 100, y: 215, rot: -5 }, { x: 150, y: 220, rot: 0 }, { x: 200, y: 215, rot: 5 }],
          [{ x: 90, y: 214, rot: -7 }, { x: 130, y: 218, rot: -2 }, { x: 170, y: 218, rot: 2 }, { x: 210, y: 214, rot: 7 }],
          [{ x: 85, y: 214, rot: -9 }, { x: 118, y: 218, rot: -4 }, { x: 150, y: 220, rot: 0 }, { x: 182, y: 218, rot: 4 }, { x: 215, y: 214, rot: 9 }]
        ]
      },
      thin: {
        id: 'thin',
        torso: { cx: 150, cy: 152, width: 84, height: 155, rx: 42 },
        headTop: { x: 150, y: 75 },
        faceCenter: { cx: 150, cy: 135, eyeY: 118, noseY: 136, mouthY: 156, width: 56 },
        armLeft:  { x: 110, y: 145, rot: -25 },
        armRight: { x: 190, y: 145, rot: 25 },
        legLeft:  { x: 125, y: 222, rot: 0 },
        legRight: { x: 175, y: 222, rot: 0 },
        ears:     { left: { x: 112, y: 95, rot: -22 }, right: { x: 188, y: 95, rot: 22 } },
        horns:    { left: { x: 130, y: 78, rot: -14 }, right: { x: 170, y: 78, rot: 14 } },
        tail:     { x: 112, y: 218 },
        wings:    { left: { x: 112, y: 135 }, right: { x: 188, y: 135 } },
        cape:     { x: 150, y: 128 },
        legs: [
          [{ x: 150, y: 225 }],
          [{ x: 125, y: 222, rot: 0 }, { x: 175, y: 222, rot: 0 }],
          [{ x: 118, y: 222, rot: -3 }, { x: 150, y: 225, rot: 0 }, { x: 182, y: 222, rot: 3 }],
          [{ x: 110, y: 220, rot: -5 }, { x: 135, y: 224, rot: -2 }, { x: 165, y: 224, rot: 2 }, { x: 190, y: 220, rot: 5 }],
          [{ x: 106, y: 220, rot: -6 }, { x: 128, y: 224, rot: -3 }, { x: 150, y: 226, rot: 0 }, { x: 172, y: 224, rot: 3 }, { x: 194, y: 220, rot: 6 }]
        ]
      },
      blob: {
        id: 'blob',
        torso: { cx: 150, cy: 160 },
        headTop: { x: 150, y: 82 },
        faceCenter: { cx: 150, cy: 140, eyeY: 124, noseY: 142, mouthY: 164, width: 70 },
        armLeft:  { x: 88, y: 160, rot: -28 },
        armRight: { x: 212, y: 160, rot: 28 },
        legLeft:  { x: 115, y: 224, rot: 0 },
        legRight: { x: 185, y: 224, rot: 0 },
        ears:     { left: { x: 100, y: 98, rot: -28 }, right: { x: 200, y: 98, rot: 28 } },
        horns:    { left: { x: 124, y: 84, rot: -18 }, right: { x: 176, y: 84, rot: 18 } },
        tail:     { x: 92, y: 220 },
        wings:    { left: { x: 92, y: 145 }, right: { x: 208, y: 145 } },
        cape:     { x: 150, y: 135 },
        legs: [
          [{ x: 150, y: 228 }],
          [{ x: 115, y: 224, rot: 0 }, { x: 185, y: 224, rot: 0 }],
          [{ x: 105, y: 224, rot: -4 }, { x: 150, y: 228, rot: 0 }, { x: 195, y: 224, rot: 4 }],
          [{ x: 95, y: 222, rot: -6 }, { x: 130, y: 226, rot: -2 }, { x: 170, y: 226, rot: 2 }, { x: 205, y: 222, rot: 6 }],
          [{ x: 90, y: 222, rot: -8 }, { x: 120, y: 226, rot: -4 }, { x: 150, y: 228, rot: 0 }, { x: 180, y: 226, rot: 4 }, { x: 210, y: 222, rot: 8 }]
        ]
      },
      ghost: {
        id: 'ghost',
        torso: { cx: 150, cy: 160 },
        headTop: { x: 150, y: 85 },
        faceCenter: { cx: 150, cy: 140, eyeY: 124, noseY: 142, mouthY: 164, width: 70 },
        armLeft:  { x: 90, y: 158, rot: -28 },
        armRight: { x: 210, y: 158, rot: 28 },
        legLeft:  { x: 135, y: 250, rot: 0 },
        legRight: { x: 165, y: 250, rot: 0 },
        ears:     { left: { x: 98, y: 102, rot: -26 }, right: { x: 202, y: 102, rot: 26 } },
        horns:    { left: { x: 124, y: 88, rot: -18 }, right: { x: 176, y: 88, rot: 18 } },
        tail:     { x: 95, y: 225 },
        wings:    { left: { x: 92, y: 145 }, right: { x: 208, y: 145 } },
        cape:     { x: 150, y: 135 },
        legs: [[{ x: 150, y: 250 }]]
      },
      dinosaur: {
        id: 'dinosaur',
        torso: { cx: 142, cy: 160 },
        headTop: { x: 142, y: 84 },
        faceCenter: { cx: 142, cy: 136, eyeY: 120, noseY: 138, mouthY: 158, width: 68 },
        armLeft:  { x: 94, y: 158, rot: -28 },
        armRight: { x: 206, y: 158, rot: 28 },
        legLeft:  { x: 115, y: 224, rot: 0 },
        legRight: { x: 185, y: 224, rot: 0 },
        ears:     { left: { x: 96, y: 98, rot: -28 }, right: { x: 196, y: 98, rot: 28 } },
        horns:    { left: { x: 118, y: 84, rot: -20 }, right: { x: 172, y: 84, rot: 20 } },
        tail:     { x: 95, y: 220 },
        wings:    { left: { x: 95, y: 142 }, right: { x: 205, y: 142 } },
        cape:     { x: 145, y: 132 },
        legs: [
          [{ x: 150, y: 228 }],
          [{ x: 115, y: 224, rot: 0 }, { x: 185, y: 224, rot: 0 }],
          [{ x: 105, y: 224, rot: -4 }, { x: 150, y: 228, rot: 0 }, { x: 195, y: 224, rot: 4 }],
          [{ x: 95, y: 222, rot: -6 }, { x: 130, y: 226, rot: -2 }, { x: 170, y: 226, rot: 2 }, { x: 205, y: 222, rot: 6 }],
          [{ x: 90, y: 222, rot: -8 }, { x: 120, y: 226, rot: -4 }, { x: 150, y: 228, rot: 0 }, { x: 180, y: 226, rot: 4 }, { x: 210, y: 222, rot: 8 }]
        ]
      },
      robot: {
        id: 'robot',
        torso: { cx: 150, cy: 157, width: 110, height: 145, rx: 20 },
        headTop: { x: 150, y: 85 },
        faceCenter: { cx: 150, cy: 125, eyeY: 114, noseY: 128, mouthY: 142, width: 66 },
        armLeft:  { x: 95, y: 150, rot: -25 },
        armRight: { x: 205, y: 150, rot: 25 },
        legLeft:  { x: 118, y: 224, rot: 0 },
        legRight: { x: 182, y: 224, rot: 0 },
        ears:     { left: { x: 95, y: 105, rot: -24 }, right: { x: 205, y: 105, rot: 24 } },
        horns:    { left: { x: 122, y: 85, rot: -16 }, right: { x: 178, y: 85, rot: 16 } },
        tail:     { x: 95, y: 218 },
        wings:    { left: { x: 95, y: 135 }, right: { x: 205, y: 135 } },
        cape:     { x: 150, y: 130 },
        legs: [
          [{ x: 150, y: 228 }],
          [{ x: 118, y: 224, rot: 0 }, { x: 182, y: 224, rot: 0 }],
          [{ x: 108, y: 224, rot: -4 }, { x: 150, y: 228, rot: 0 }, { x: 192, y: 224, rot: 4 }],
          [{ x: 98, y: 222, rot: -6 }, { x: 132, y: 226, rot: -2 }, { x: 168, y: 226, rot: 2 }, { x: 202, y: 222, rot: 6 }],
          [{ x: 92, y: 222, rot: -8 }, { x: 122, y: 226, rot: -4 }, { x: 150, y: 228, rot: 0 }, { x: 178, y: 226, rot: 4 }, { x: 208, y: 222, rot: 8 }]
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

function darkenColor(hex, percent = 20) {
  const colorMap = {
    purple: '#a855f7',
    green:  '#22c55e',
    blue:   '#0ea5e9',
    red:    '#f43f5e',
    orange: '#f97316',
    yellow: '#eab308',
    pink:   '#f472b6',
    black:  '#334155',
    white:  '#f8fafc'
  };
  if (!hex) hex = '#a855f7';
  if (typeof hex === 'string' && colorMap[hex.toLowerCase()]) {
    hex = colorMap[hex.toLowerCase()];
  }
  if (typeof hex === 'string' && hex.length === 4 && hex.startsWith('#')) {
    hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  let num = parseInt(hex.replace("#", ""), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) - amt,
      G = (num >> 8 & 0x00FF) - amt,
      B = (num & 0x0000FF) - amt;
  return "#" + (0x1000000 + (R < 0 ? 0 : R) * 0x10000 + (G < 0 ? 0 : G) * 0x100 + (B < 0 ? 0 : B)).toString(16).slice(1);
}
if (typeof window !== 'undefined') {
  window.darkenColor = darkenColor;
}

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

  darkenColor(col, percent = 20) {
    return darkenColor(col, percent);
  }

  getSvgOutput(currentMonster = {}) {
    const bodyColor = (this.palettes && this.palettes[currentMonster.color]?.main) || currentMonster.color || '#a855f7';
    const bodyColorDark = (this.palettes && this.palettes[currentMonster.color]?.dark) || this.darkenColor(bodyColor, 20);
    const bodyColorShadow = this.darkenColor(bodyColor, 35);
    const darkenColor = (col, percent) => this.darkenColor(col, percent);
    const svgOutput = `
<svg viewBox="0 0 300 320" width="100%" height="100%" style="--monster-body-color: ${bodyColor}; --monster-body-color-dark: ${bodyColorDark}; --monster-body-shadow: ${bodyColorShadow};" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- 3D Volumetric Clay Shader for Body -->
    <radialGradient id="monsterClayGrad" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.65" />
      <stop offset="25%" stop-color="var(--monster-body-color, ${bodyColor})" />
      <stop offset="85%" stop-color="var(--monster-body-color-dark, ${bodyColorDark})" />
      <stop offset="100%" stop-color="var(--monster-body-shadow, ${bodyColorShadow})" />
    </radialGradient>
    <radialGradient id="bellyGrad" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#fffbeb" />
      <stop offset="70%" stop-color="#fef3c7" />
      <stop offset="100%" stop-color="#fde68a" />
    </radialGradient>
    <filter id="clayShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#000000" flood-opacity="0.18" />
    </filter>
    <!-- Dynamic 3D Radial Shader for Body -->
    <radialGradient id="activeBodyClay" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.65" />
      <stop offset="30%" stop-color="${bodyColor}" />
      <stop offset="85%" stop-color="${bodyColor}" />
      <stop offset="100%" stop-color="${darkenColor(bodyColor, 35)}" />
    </radialGradient>
  </defs>

  <!-- 1. PODIUM SHADOW -->
  <ellipse cx="150" cy="265" rx="65" ry="12" fill="#78350f" opacity="0.4" />

  <!-- 2. LEGS & FEET -->
  <rect x="112" y="195" width="24" height="60" rx="12" fill="${bodyColor}" stroke="#1e293b" stroke-width="3" />
  <ellipse cx="124" cy="255" rx="16" ry="8" fill="${darkenColor(bodyColor, 15)}" stroke="#1e293b" stroke-width="3" />

  <rect x="164" y="195" width="24" height="60" rx="12" fill="${bodyColor}" stroke="#1e293b" stroke-width="3" />
  <ellipse cx="176" cy="255" rx="16" ry="8" fill="${darkenColor(bodyColor, 15)}" stroke="#1e293b" stroke-width="3" />

  <!-- 3. SOLID 3D TORSO (MUST BE FILLED) -->
  <circle cx="150" cy="155" r="75" fill="${bodyColor}" stroke="#1e293b" stroke-width="3.5" />
  <circle cx="150" cy="155" r="75" fill="url(#monsterClayGrad)" stroke="#1e293b" stroke-width="3.5" />
  <circle cx="150" cy="155" r="75" fill="url(#activeBodyClay)" stroke="#1e293b" stroke-width="3.5" />

  <!-- 4. EARS & ARMS (Attached at perimeter) -->
  <!-- Left Ear -->
  <path d="M 100 95 Q 80 40 96 35 Q 115 45 110 90 Z" fill="${bodyColor}" stroke="#1e293b" stroke-width="3" />
  <!-- Right Ear -->
  <path d="M 200 95 Q 220 40 204 35 Q 185 45 190 90 Z" fill="${bodyColor}" stroke="#1e293b" stroke-width="3" />

  <!-- 5. EYES & MOUTH -->
  <!-- Left Eye -->
  <circle cx="125" cy="135" r="15" fill="#fff" stroke="#1e293b" stroke-width="3"/>
  <circle cx="128" cy="135" r="7" fill="#38bdf8"/>
  <circle cx="130" cy="134" r="3.5" fill="#000"/>

  <!-- Right Eye -->
  <circle cx="175" cy="135" r="15" fill="#fff" stroke="#1e293b" stroke-width="3"/>
  <circle cx="172" cy="135" r="7" fill="#38bdf8"/>
  <circle cx="170" cy="134" r="3.5" fill="#000"/>

  <!-- Smile -->
  <path d="M 138 165 Q 150 176 162 165" stroke="#1e293b" stroke-width="4" stroke-linecap="round" fill="none" />
</svg>
`;
    return svgOutput;
  }

  // ==========================================
  // MASTER SVG COMPOSER (Strict 9-Layer Architecture)
  // ==========================================
  renderSvg(rawMonster, options = {}) {
    const monster = this.normalize(rawMonster);
    const pal = this.getPalette(monster.color);
    const secPal = this.getPalette(monster.secondaryColor);
    const bodyColor = (pal && pal.main) || (this.palettes && this.palettes[monster.color]?.main) || monster.color || '#a855f7';
    const bodyColorDark = (pal && pal.dark) || this.darkenColor(bodyColor, 20);
    const bodyColorShadow = this.darkenColor(bodyColor, 35);
    const anchors = this.anchorReg.getSockets(monster.body);
    const width = options.width || '100%';
    const height = options.height || '100%';
    const isAnimated = options.animated !== false;

    const action = options.action || this.currentAction;
    let actionAnimClass = '';
    if (action === 'tickle') actionAnimClass = 'anim-tickle';
    else if (action === 'dance') actionAnimClass = 'anim-dance';
    else if (action === 'sleep') actionAnimClass = 'anim-sleep';
    else if (isAnimated) actionAnimClass = 'animated-monster';

    // Unique gradient ID scoped to avoid cross-SVG / display:none caching bugs
    const uid = options.uid || ('m_' + Math.random().toString(36).substring(2, 7));
    const bodyGradId = `clayGrad_${monster.color}_${uid}`;
    const secGradId = `secGrad_${monster.secondaryColor}_${uid}`;
    const goldGradId = `goldAccGrad_${uid}`;

    // Strict 9-Layer Architecture (Back-to-Front Pipeline):
    // 1. Stage background & podium
    // 2. Wings / Tail (behind the body)
    // 3. Monster Torso Base
    // 4. Ears & Horns (anchored behind or on top of the head)
    // 5. Clothes / Armor (aligned strictly below the chin line, e.g., cy > 165)
    // 6. Arms & Limbs
    // 7. Facial Features (Mouth, Nose, Eyes) – must ALWAYS stay on top of clothing
    // 8. Eyewear (Sunglasses / Goggles)
    // 9. Hats & Crowns (placed on top of the head)
    const layers = [
      this.renderBackdrops(monster, anchors, pal),
      this.renderWingsAndTail(monster, pal, anchors),
      this.renderTorsoBase(monster, pal, secPal, anchors, bodyGradId, secGradId),
      this.renderEarsAndHorns(monster, pal, anchors),
      this.renderClothes(monster, pal, anchors),
      this.renderFrontLimbs(monster, pal, anchors, action),
      this.renderFacialFeatures(monster, pal, anchors, action),
      this.renderEyewear(monster, anchors),
      this.renderHatsAndCrowns(monster, anchors)
    ];

    const isInvisible = monster.powers.includes('invisible');
    const opacityVal = isInvisible ? 0.52 : 1.0;

    return `
      <svg class="monster-svg ${actionAnimClass}" 
           viewBox="0 0 300 320" 
           width="${width}" 
           height="${height}" 
           style="opacity: ${opacityVal}; --monster-body-color: ${bodyColor}; --monster-body-color-dark: ${bodyColorDark}; --monster-body-shadow: ${bodyColorShadow};"
           xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="mDropGlow_${uid}" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="rgba(15,23,42,0.18)"/>
          </filter>
          <!-- Foot Contact Blur Filter -->
          <filter id="footBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3"/>
          </filter>

          <!-- Tactile Clay Shadow Filter -->
          <filter id="clayShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#000000" flood-opacity="0.18"/>
          </filter>

          <!-- 3D Volumetric Clay Shader for Body (CSS Variables Enabled) -->
          <radialGradient id="monsterClayGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.65" />
            <stop offset="25%" stop-color="var(--monster-body-color, ${bodyColor})" />
            <stop offset="85%" stop-color="var(--monster-body-color-dark, ${bodyColorDark})" />
            <stop offset="100%" stop-color="var(--monster-body-shadow, ${bodyColorShadow})" />
          </radialGradient>
          <radialGradient id="bellyGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#fffbeb" />
            <stop offset="70%" stop-color="#fef3c7" />
            <stop offset="100%" stop-color="#fde68a" />
          </radialGradient>

          <!-- Dynamic 3D Radial Shader for Body & Compatibility Gradients -->
          <radialGradient id="activeBodyClay" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.65" />
            <stop offset="30%" stop-color="${bodyColor}" />
            <stop offset="85%" stop-color="${bodyColor}" />
            <stop offset="100%" stop-color="${bodyColorShadow}" />
          </radialGradient>
          <radialGradient id="${bodyGradId}" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.65" />
            <stop offset="25%" stop-color="var(--monster-body-color, ${bodyColor})" />
            <stop offset="85%" stop-color="var(--monster-body-color-dark, ${bodyColorDark})" />
            <stop offset="100%" stop-color="var(--monster-body-shadow, ${bodyColorShadow})" />
          </radialGradient>
          <radialGradient id="clayGradient" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.65" />
            <stop offset="30%" stop-color="${bodyColor}" />
            <stop offset="85%" stop-color="${bodyColor}" />
            <stop offset="100%" stop-color="${bodyColorShadow}" />
          </radialGradient>
          <radialGradient id="clayBodyGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.65" />
            <stop offset="30%" stop-color="${bodyColor}" />
            <stop offset="85%" stop-color="${bodyColor}" />
            <stop offset="100%" stop-color="${bodyColorShadow}" />
          </radialGradient>
          <radialGradient id="clayLimbGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stop-color="${pal.highlight}"/>
            <stop offset="55%" stop-color="${pal.main}"/>
            <stop offset="100%" stop-color="${pal.dark}"/>
          </radialGradient>
          <linearGradient id="${secGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="100%" stop-color="${secPal.belly}"/>
          </linearGradient>
          <linearGradient id="secGrad_${monster.secondaryColor}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="100%" stop-color="${secPal.belly}"/>
          </linearGradient>
          <linearGradient id="${goldGradId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="50%" stop-color="#eab308"/>
            <stop offset="100%" stop-color="#b45309"/>
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
  // LAYER 1: BACKDROPS & STAGE PODIUM (with Grounded Back Limbs)
  // -------------------------------------------------------------
  renderBackdrops(monster, anchors, pal) {
    let powerAura = '';
    if (monster.powers.includes('shoot_lightning')) {
      powerAura = `
        <g class="aura-lightning" stroke="#facc15" stroke-width="3" fill="none" opacity="0.8">
          <polyline points="75,80 95,120 85,135 105,170" />
          <polyline points="225,80 205,120 215,135 195,170" />
        </g>
      `;
    } else if (monster.powers.includes('breathe_fire')) {
      powerAura = `
        <g class="aura-fire" opacity="0.65">
          <circle cx="60" cy="155" r="10" fill="#f97316"/>
          <circle cx="240" cy="155" r="10" fill="#f97316"/>
          <circle cx="72" cy="125" r="6" fill="#ef4444"/>
          <circle cx="228" cy="125" r="6" fill="#ef4444"/>
        </g>
      `;
    } else if (monster.powers.includes('magic')) {
      powerAura = `
        <g class="aura-magic" fill="#c084fc" opacity="0.85">
          <polygon points="75,70 78,79 87,79 80,85 83,94 75,88 67,94 70,85 63,79 72,79" />
          <polygon points="225,70 228,79 237,79 230,85 233,94 225,88 217,94 220,85 213,79 222,79" />
        </g>
      `;
    }

    const backLimbs = this.renderBackLimbs(monster, pal || this.getPalette(monster.color), anchors);

    return `
      <g id="layer-backdrop-stage" class="layer-backdrop-stage">
        <!-- Anchored Stage Platform Contact Shadow -->
        <ellipse cx="150" cy="262" rx="65" ry="12" fill="#78350f" opacity="0.35" filter="url(#footBlur)" />
        ${powerAura}
        ${backLimbs}
      </g>
    `;
  }

  // -------------------------------------------------------------
  // LAYER 2: TAIL / WINGS / BACK GEAR (Behind Torso Base)
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
          <path d="M ${wl.x},${wl.y} Q 40,80 15,110 Q 55,140 25,175 Q 75,170 ${wl.x + 5},${wl.y + 25} Z" fill="#f97316" stroke="#c2410c" stroke-width="3"/>
          <path d="M ${wr.x},${wr.y} Q 260,80 285,110 Q 245,140 275,175 Q 225,170 ${wr.x - 5},${wr.y + 25} Z" fill="#f97316" stroke="#c2410c" stroke-width="3"/>
        </g>
      `;
    } else if (w === 'butterfly') {
      out += `
        <g class="monster-wings-group butterfly-wings">
          <path d="M ${wl.x},${wl.y + 5} C 40,80 10,140 45,175 C 15,205 55,240 ${wl.x + 5},${wl.y + 45} Z" fill="#ec4899" stroke="#be185d" stroke-width="3"/>
          <circle cx="50" cy="140" r="9" fill="#fef08a"/>
          <path d="M ${wr.x},${wr.y + 5} C 260,80 290,140 255,175 C 285,205 245,240 ${wr.x - 5},${wr.y + 45} Z" fill="#ec4899" stroke="#be185d" stroke-width="3"/>
          <circle cx="250" cy="140" r="9" fill="#fef08a"/>
        </g>
      `;
    } else if (w === 'bat') {
      out += `
        <g class="monster-wings-group bat-wings">
          <path d="M ${wl.x},${wl.y + 5} Q 40,95 15,130 Q 45,155 30,180 Q 65,180 70,200 ${wl.x + 5},${wl.y + 25} Z" fill="#334155" stroke="#0f172a" stroke-width="3"/>
          <path d="M ${wr.x},${wr.y + 5} Q 260,95 285,130 Q 255,155 270,180 Q 235,180 230,200 ${wr.x - 5},${wr.y + 25} Z" fill="#334155" stroke="#0f172a" stroke-width="3"/>
        </g>
      `;
    }

    // Tails
    const t = anchors.tail;
    const tl = monster.specialParts.tail;
    if (tl === 'long') {
      out += `<path d="M ${t.x},${t.y} C 45,${t.y} 15,180 28,145 C 36,128 52,135 44,155 C 36,178 58,205 ${t.x + 8},${t.y + 10} Z" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="3"/>`;
    } else if (tl === 'curly') {
      out += `<path d="M ${t.x},${t.y + 4} C 45,${t.y + 20} 25,190 42,160 C 58,138 85,160 65,175 C 54,182 45,205 ${t.x + 4},${t.y + 12} Z" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="3"/>`;
    } else if (tl === 'dinosaur') {
      out += `<path d="M ${t.x},${t.y - 8} C 40,${t.y} 12,240 5,255 C 28,248 65,238 ${t.x + 8},${t.y + 18} Z" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="3"/>`;
    } else if (tl === 'snake') {
      out += `<path d="M ${t.x},${t.y} Q 45,${t.y + 15} 30,195 Q 15,170 42,145 Q 60,125 50,105" fill="none" stroke="${pal.main}" stroke-width="11" stroke-linecap="round"/><path d="M ${t.x},${t.y} Q 45,${t.y + 15} 30,195 Q 15,170 42,145 Q 60,125 50,105" fill="none" stroke="${pal.stroke}" stroke-width="3" stroke-linecap="round"/>`;
    } else if (tl === 'bunny') {
      out += `<circle cx="${t.x - 12}" cy="${t.y + 2}" r="12" fill="#ffffff" stroke="${pal.stroke}" stroke-width="3"/>`;
    }

    // Cape Back
    if (monster.clothes.cape) {
      const capeColor = this.getClothColor(monster.clothes.capeColor || 'red', '#dc2626');
      out += `<path class="monster-cape-back" d="M 112,${anchors.cape.y} Q 150,${anchors.cape.y + 10} 188,${anchors.cape.y} L 214,250 Q 150,265 86,250 Z" fill="${capeColor}" stroke="#7f1d1d" stroke-width="3" />`;
    }

    return `<g id="layer-wings-tail" class="layer-wings-tail">${out}</g>`;
  }

  // -------------------------------------------------------------
  // BACK LIMBS HELPER (Legs & Feet behind Torso)
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
      <g id="layer-back-limbs" class="layer-back-limbs">
        ${configs.map(c => `
          <g transform="translate(0, 0)">
            <!-- Foot Ground Contact Shadow Anchoring to Platform -->
            <ellipse cx="${c.x}" cy="259" rx="${feet === 'giant' ? 24 : 18}" ry="6" fill="#0f172a" opacity="0.3" filter="url(#footBlur)"/>
            <!-- Leg Column connecting flush into Torso Base at c.y and extending down to 252 -->
            <path d="M ${c.x - 9},${c.y} L ${c.x - 9},250 Q ${c.x},255 ${c.x + 9},250 L ${c.x + 9},${c.y} Z" 
                  fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="3.5" stroke-linejoin="round"/>
            <!-- Flat Foot on Stage Platform at y=254 -->
            <ellipse cx="${c.x}" cy="254" rx="${feet === 'giant' ? 22 : 16}" ry="8" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="3"/>
            <circle cx="${c.x - 7}" cy="255" r="3" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1"/>
            <circle cx="${c.x}" cy="257" r="3.2" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1"/>
            <circle cx="${c.x + 7}" cy="255" r="3" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1"/>
          </g>
        `).join('')}
      </g>
    `;
  }

  // -------------------------------------------------------------
  // LAYER 3: MONSTER TORSO BASE (Solid 3D Clay Lighting + Belly)
  // -------------------------------------------------------------
  renderTorsoBase(monster, pal, secPal, anchors, bodyGradId = 'clayGradient', secGradId = 'secGrad') {
    const currentMonster = monster || {};
    const shape = currentMonster.body || 'round';
    const bodyColor = (pal && pal.main) || (this.palettes && this.palettes[currentMonster.color]?.main) || currentMonster.color || '#a855f7';

    let bodySvg = '';
    let bellySvg = '';

    if (shape === 'tall') {
      bodySvg = `
        <rect x="90" y="80" width="120" height="145" rx="58" ry="58" fill="${bodyColor}" stroke="#1e293b" stroke-width="3.5" />
        <rect x="90" y="80" width="120" height="145" rx="58" ry="58" fill="url(#monsterClayGrad)" stroke="#1e293b" stroke-width="3.5" />
        <rect x="90" y="80" width="120" height="145" rx="58" ry="58" fill="url(#activeBodyClay)" stroke="#1e293b" stroke-width="3.5" />
      `;
      bellySvg = `<ellipse cx="150" cy="180" rx="36" ry="38" fill="url(#bellyGrad)" stroke="${pal.dark}" stroke-width="2.5" opacity="0.95"/>`;
    } else if (shape === 'round') {
      bodySvg = `
        <circle cx="150" cy="155" r="75" fill="${bodyColor}" stroke="#1e293b" stroke-width="3.5" />
        <circle cx="150" cy="155" r="75" fill="url(#monsterClayGrad)" stroke="#1e293b" stroke-width="3.5" />
        <circle cx="150" cy="155" r="75" fill="url(#activeBodyClay)" stroke="#1e293b" stroke-width="3.5" />
      `;
      bellySvg = `<ellipse cx="150" cy="175" rx="46" ry="42" fill="url(#bellyGrad)" stroke="${pal.dark}" stroke-width="2.5" opacity="0.95"/>`;
    } else if (shape === 'wide') {
      bodySvg = `
        <rect x="70" y="105" width="160" height="115" rx="50" ry="50" fill="${bodyColor}" stroke="#1e293b" stroke-width="3.5" />
        <rect x="70" y="105" width="160" height="115" rx="50" ry="50" fill="url(#monsterClayGrad)" stroke="#1e293b" stroke-width="3.5" />
        <rect x="70" y="105" width="160" height="115" rx="50" ry="50" fill="url(#activeBodyClay)" stroke="#1e293b" stroke-width="3.5" />
      `;
      bellySvg = `<ellipse cx="150" cy="172" rx="55" ry="38" fill="url(#bellyGrad)" stroke="${pal.dark}" stroke-width="2.5" opacity="0.95"/>`;
    } else if (shape === 'short') {
      bodySvg = `
        <ellipse cx="150" cy="170" rx="72" ry="58" fill="${bodyColor}" stroke="#1e293b" stroke-width="3.5" />
        <ellipse cx="150" cy="170" rx="72" ry="58" fill="url(#monsterClayGrad)" stroke="#1e293b" stroke-width="3.5" />
        <ellipse cx="150" cy="170" rx="72" ry="58" fill="url(#activeBodyClay)" stroke="#1e293b" stroke-width="3.5" />
      `;
      bellySvg = `<ellipse cx="150" cy="182" rx="48" ry="36" fill="url(#bellyGrad)" stroke="${pal.dark}" stroke-width="2.5" opacity="0.95"/>`;
    } else if (shape === 'thin') {
      bodySvg = `
        <rect x="108" y="75" width="84" height="155" rx="42" ry="42" fill="${bodyColor}" stroke="#1e293b" stroke-width="3.5" />
        <rect x="108" y="75" width="84" height="155" rx="42" ry="42" fill="url(#monsterClayGrad)" stroke="#1e293b" stroke-width="3.5" />
        <rect x="108" y="75" width="84" height="155" rx="42" ry="42" fill="url(#activeBodyClay)" stroke="#1e293b" stroke-width="3.5" />
      `;
      bellySvg = `<ellipse cx="150" cy="182" rx="26" ry="42" fill="url(#bellyGrad)" stroke="${pal.dark}" stroke-width="2.5" opacity="0.95"/>`;
    } else if (shape === 'blob') {
      bodySvg = `
        <path d="M 150,82 C 190,80 215,115 205,150 C 230,175 228,215 205,230 C 180,240 120,240 95,230 C 72,215 70,175 95,150 C 85,115 110,80 150,82 Z" fill="${bodyColor}" stroke="#1e293b" stroke-width="3.5" />
        <path d="M 150,82 C 190,80 215,115 205,150 C 230,175 228,215 205,230 C 180,240 120,240 95,230 C 72,215 70,175 95,150 C 85,115 110,80 150,82 Z" fill="url(#monsterClayGrad)" stroke="#1e293b" stroke-width="3.5" />
        <path d="M 150,82 C 190,80 215,115 205,150 C 230,175 228,215 205,230 C 180,240 120,240 95,230 C 72,215 70,175 95,150 C 85,115 110,80 150,82 Z" fill="url(#activeBodyClay)" stroke="#1e293b" stroke-width="3.5" />
      `;
      bellySvg = `<ellipse cx="150" cy="184" rx="42" ry="38" fill="url(#bellyGrad)" stroke="${pal.dark}" stroke-width="2.5" opacity="0.95"/>`;
    } else if (shape === 'ghost') {
      bodySvg = `
        <path d="M 150,85 C 195,85 215,120 215,175 C 215,225 218,255 200,260 C 185,245 175,262 150,250 C 125,262 115,245 100,260 C 82,255 85,225 85,175 C 85,120 105,85 150,85 Z" fill="${bodyColor}" stroke="#1e293b" stroke-width="3.5" />
        <path d="M 150,85 C 195,85 215,120 215,175 C 215,225 218,255 200,260 C 185,245 175,262 150,250 C 125,262 115,245 100,260 C 82,255 85,225 85,175 C 85,120 105,85 150,85 Z" fill="url(#monsterClayGrad)" stroke="#1e293b" stroke-width="3.5" />
        <path d="M 150,85 C 195,85 215,120 215,175 C 215,225 218,255 200,260 C 185,245 175,262 150,250 C 125,262 115,245 100,260 C 82,255 85,225 85,175 C 85,120 105,85 150,85 Z" fill="url(#activeBodyClay)" stroke="#1e293b" stroke-width="3.5" />
      `;
      bellySvg = `<ellipse cx="150" cy="180" rx="38" ry="36" fill="url(#bellyGrad)" opacity="0.65"/>`;
    } else if (shape === 'dinosaur') {
      bodySvg = `
        <path d="M 140,84 C 175,76 202,105 200,145 C 200,185 215,220 205,235 C 190,245 110,245 95,235 C 85,220 100,185 100,145 C 100,105 112,85 140,84 Z" fill="${bodyColor}" stroke="#1e293b" stroke-width="3.5" />
        <path d="M 140,84 C 175,76 202,105 200,145 C 200,185 215,220 205,235 C 190,245 110,245 95,235 C 85,220 100,185 100,145 C 100,105 112,85 140,84 Z" fill="url(#monsterClayGrad)" stroke="#1e293b" stroke-width="3.5" />
        <path d="M 140,84 C 175,76 202,105 200,145 C 200,185 215,220 205,235 C 190,245 110,245 95,235 C 85,220 100,185 100,145 C 100,105 112,85 140,84 Z" fill="url(#activeBodyClay)" stroke="#1e293b" stroke-width="3.5" />
      `;
      bellySvg = `<ellipse cx="150" cy="185" rx="38" ry="38" fill="url(#bellyGrad)" stroke="${pal.dark}" stroke-width="2.5" opacity="0.95"/>`;
    } else if (shape === 'robot') {
      bodySvg = `
        <rect x="95" y="85" width="110" height="145" rx="20" ry="20" fill="${bodyColor}" stroke="#1e293b" stroke-width="3.5" />
        <rect x="95" y="85" width="110" height="145" rx="20" ry="20" fill="url(#monsterClayGrad)" stroke="#1e293b" stroke-width="3.5" />
        <rect x="95" y="85" width="110" height="145" rx="20" ry="20" fill="url(#activeBodyClay)" stroke="#1e293b" stroke-width="3.5" />
      `;
      bellySvg = `<rect x="115" y="155" width="70" height="60" rx="10" ry="10" fill="url(#bellyGrad)" stroke="${pal.dark}" stroke-width="2.5"/><circle cx="150" cy="185" r="12" fill="#38bdf8"/>`;
    } else {
      bodySvg = `
        <circle cx="150" cy="155" r="75" fill="${bodyColor}" stroke="#1e293b" stroke-width="3.5" />
        <circle cx="150" cy="155" r="75" fill="url(#monsterClayGrad)" stroke="#1e293b" stroke-width="3.5" />
        <circle cx="150" cy="155" r="75" fill="url(#activeBodyClay)" stroke="#1e293b" stroke-width="3.5" />
      `;
      bellySvg = `<ellipse cx="150" cy="175" rx="46" ry="42" fill="url(#bellyGrad)" stroke="${pal.dark}" stroke-width="2.5" opacity="0.95"/>`;
    }

    // Specular 3D Clay Highlight Pill/Disc on top-left of torso
    const shineX = 132;
    const shineY = anchors.faceCenter.eyeY - 14;
    const shineSvg = `<ellipse cx="${shineX}" cy="${shineY}" rx="20" ry="10" fill="#ffffff" opacity="0.35" transform="rotate(-18 ${shineX} ${shineY})" pointer-events="none" />`;

    return `
      <g id="layer-torso-base" class="layer-torso-base layer-torso-head" filter="url(#clayShadow)">
        <!-- 1. Central Torso Solid Base Fill with 3D Radial Clay Lighting -->
        ${bodySvg}
        <!-- 2. Soft Specular Clay Highlight on Top-Left -->
        ${shineSvg}
        <!-- 3. Creamy Belly Patch -->
        ${bellySvg}
      </g>
    `;
  }

  // -------------------------------------------------------------
  // LAYER 4: EARS & HORNS (Anchored to headTop / ears sockets)
  // -------------------------------------------------------------
  renderEarsAndHorns(monster, pal, anchors) {
    // Horns (Attached firmly to headTop socket)
    let hornsSvg = '';
    const hornCount = monster.horns.count;
    if (hornCount > 0) {
      const h = anchors.horns;
      const top = anchors.headTop;
      let cfgs = [];
      if (hornCount === 1) cfgs = [{ x: top.x, y: top.y, rot: 0 }];
      else cfgs = [
        { x: h.left.x, y: h.left.y, rot: h.left.rot },
        { x: h.right.x, y: h.right.y, rot: h.right.rot }
      ];
      hornsSvg = `
        <g class="monster-horns-group">
          ${cfgs.map(c => `
            <g transform="translate(${c.x}, ${c.y}) rotate(${c.rot})">
              <polygon points="-9,0 0,-34 9,0" fill="#eab308" stroke="#78350f" stroke-width="3" stroke-linejoin="round"/>
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
        { x: e.left.x, y: e.left.y, rot: e.left.rot },
        { x: e.right.x, y: e.right.y, rot: e.right.rot }
      ];
      earsSvg = `
        <g class="monster-ears-group">
          ${ecfgs.map(c => `
            <g transform="translate(${c.x}, ${c.y}) rotate(${c.rot})">
              <ellipse cx="0" cy="-18" rx="13" ry="24" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="3"/>
              <ellipse cx="0" cy="-16" rx="7" ry="15" fill="${pal.belly}"/>
            </g>
          `).join('')}
        </g>
      `;
    }

    return `
      <g id="layer-ears-horns" class="layer-ears-horns">
        ${earsSvg}
        ${hornsSvg}
      </g>
    `;
  }

  // -------------------------------------------------------------
  // LAYER 5: CLOTHES & ARMOR (Aligned Strictly Below Chin Line: cy >= 168)
  // -------------------------------------------------------------
  renderClothes(monster, pal, anchors) {
    let out = '';
    const f = anchors.faceCenter;
    const mouthBottom = (f.mouthY || 154) + 12;
    const chinY = Math.max(168, mouthBottom);

    const t = monster.clothes.top;
    if (t === 'tshirt' || t === 'shirt') {
      const topCol = this.getClothColor(monster.clothes.topColor, '#2563eb');
      const leftArm = anchors.armLeft;
      const rightArm = anchors.armRight;
      const shoulderLeftY = Math.max(chinY, leftArm.y + 10);
      const shoulderRightY = Math.max(chinY, rightArm.y + 10);

      out += `
        <g class="clothing-top clothing-tshirt">
          <!-- Main shirt body anchored strictly below chin line -->
          <path d="M ${leftArm.x},${shoulderLeftY} 
                   Q 150,${chinY + 12} ${rightArm.x},${shoulderRightY} 
                   L ${rightArm.x + 6},${shoulderRightY + 36} 
                   L ${rightArm.x - 12},${shoulderRightY + 40} 
                   L 186,215 
                   L 114,215 
                   L ${leftArm.x + 12},${shoulderLeftY + 40} 
                   L ${leftArm.x - 6},${shoulderLeftY + 36} Z" 
                fill="${topCol}" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <!-- Tactile Collar Ribbing Below Chin -->
          <path d="M ${leftArm.x + 14},${shoulderLeftY} Q 150,${chinY + 14} ${rightArm.x - 14},${shoulderRightY}" 
                fill="none" stroke="${this.darkenColor(topCol, 25)}" stroke-width="4" stroke-linecap="round"/>
          <!-- Star Medal on Chest (Well Below Chin) -->
          <polygon points="150,${chinY + 22} 153,${chinY + 29} 160,${chinY + 30} 154,${chinY + 35} 156,${chinY + 42} 150,${chinY + 38} 144,${chinY + 42} 146,${chinY + 35} 140,${chinY + 30} 147,${chinY + 29}" 
                   fill="#facc15" stroke="#ca8a04" stroke-width="1.2"/>
        </g>
      `;
    } else if (t === 'jacket') {
      const topCol = this.getClothColor(monster.clothes.topColor, '#1e293b');
      const leftArm = anchors.armLeft;
      const rightArm = anchors.armRight;
      const shoulderLeftY = Math.max(chinY, leftArm.y + 10);
      const shoulderRightY = Math.max(chinY, rightArm.y + 10);

      out += `
        <g class="clothing-top clothing-jacket">
          <!-- Jacket Torso -->
          <path d="M ${leftArm.x},${shoulderLeftY} 
                   Q 150,${chinY + 14} ${rightArm.x},${shoulderRightY} 
                   L ${rightArm.x + 6},${shoulderRightY + 38} 
                   L ${rightArm.x - 10},${shoulderRightY + 42} 
                   L 188,216 
                   L 112,216 
                   L ${leftArm.x + 10},${shoulderLeftY + 42} 
                   L ${leftArm.x - 6},${shoulderLeftY + 38} Z" 
                fill="${topCol}" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <!-- Zipper down front center -->
          <line x1="150" y1="${chinY + 14}" x2="150" y2="216" stroke="#94a3b8" stroke-width="3" stroke-dasharray="3,2"/>
          <!-- Jacket Lapels -->
          <path d="M ${leftArm.x + 12},${shoulderLeftY} L 150,${chinY + 24} L ${rightArm.x - 12},${shoulderRightY}" 
                fill="none" stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round"/>
        </g>
      `;
    }

    // Cape front fasteners if cape is active
    if (monster.clothes.cape) {
      out += `
        <g class="clothing-cape-front">
          <ellipse cx="132" cy="${chinY + 6}" rx="5" ry="5" fill="#eab308" stroke="#78350f" stroke-width="1.5"/>
          <ellipse cx="168" cy="${chinY + 6}" rx="5" ry="5" fill="#eab308" stroke="#78350f" stroke-width="1.5"/>
          <path d="M 132,${chinY + 6} Q 150,${chinY + 12} 168,${chinY + 6}" fill="none" stroke="#eab308" stroke-width="2.5"/>
        </g>
      `;
    }

    return `<g id="layer-clothes-armor" class="layer-clothes-armor layer-clothes-accessories">${out}</g>`;
  }

  // -------------------------------------------------------------
  // LAYER 6: FRONT LIMBS (Arms & Hands attached at armLeft/armRight)
  // -------------------------------------------------------------
  renderFrontLimbs(monster, pal, anchors, action) {
    const count = monster.arms.count;
    if (count === 0) return '';
    const length = monster.arms.length || 'normal';

    let factor = 1.0;
    if (length === 'tiny') factor = 0.65;
    else if (length === 'short') factor = 0.85;
    else if (length === 'long') factor = 1.3;

    const shL = anchors.armLeft;
    const shR = anchors.armRight;

    let leftHandOffset = { x: -30 * factor, y: 35 * factor };
    let rightHandOffset = { x: 30 * factor, y: 35 * factor };

    if (action === 'dance') {
      leftHandOffset = { x: -35 * factor, y: -35 * factor };
      rightHandOffset = { x: 35 * factor, y: -35 * factor };
    }

    const leftHand = { x: shL.x + leftHandOffset.x, y: shL.y + leftHandOffset.y };
    const rightHand = { x: shR.x + rightHandOffset.x, y: shR.y + rightHandOffset.y };

    return `
      <g id="layer-front-limbs" class="layer-front-limbs">
        <!-- Left Arm with Rounded Torso Joint -->
        <g class="monster-arm-left">
          <!-- Rounded Joint Socket at Torso Connection -->
          <circle cx="${shL.x}" cy="${shL.y}" r="10" fill="url(#clayLimbGrad)" stroke="${pal.stroke}" stroke-width="3"/>
          <!-- Arm Limb -->
          <path d="M ${shL.x},${shL.y} Q ${shL.x - 18},${shL.y + 16} ${leftHand.x},${leftHand.y}" 
                fill="none" stroke="url(#clayLimbGrad)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M ${shL.x},${shL.y} Q ${shL.x - 18},${shL.y + 16} ${leftHand.x},${leftHand.y}" 
                fill="none" stroke="${pal.stroke}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Hand Paw -->
          <circle cx="${leftHand.x}" cy="${leftHand.y}" r="11" fill="url(#clayLimbGrad)" stroke="${pal.stroke}" stroke-width="2.5"/>
          <circle cx="${leftHand.x - 4}" cy="${leftHand.y - 5}" r="2.5" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1"/>
          <circle cx="${leftHand.x}" cy="${leftHand.y - 7}" r="2.8" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1"/>
          <circle cx="${leftHand.x + 4}" cy="${leftHand.y - 5}" r="2.5" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1"/>
        </g>

        <!-- Right Arm with Rounded Torso Joint -->
        <g class="monster-arm-right">
          <!-- Rounded Joint Socket at Torso Connection -->
          <circle cx="${shR.x}" cy="${shR.y}" r="10" fill="url(#clayLimbGrad)" stroke="${pal.stroke}" stroke-width="3"/>
          <!-- Arm Limb -->
          <path d="M ${shR.x},${shR.y} Q ${shR.x + 18},${shR.y + 16} ${rightHand.x},${rightHand.y}" 
                fill="none" stroke="url(#clayLimbGrad)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M ${shR.x},${shR.y} Q ${shR.x + 18},${shR.y + 16} ${rightHand.x},${rightHand.y}" 
                fill="none" stroke="${pal.stroke}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Hand Paw -->
          <circle cx="${rightHand.x}" cy="${rightHand.y}" r="11" fill="url(#clayLimbGrad)" stroke="${pal.stroke}" stroke-width="2.5"/>
          <circle cx="${rightHand.x - 4}" cy="${rightHand.y - 5}" r="2.5" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1"/>
          <circle cx="${rightHand.x}" cy="${rightHand.y - 7}" r="2.8" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1"/>
          <circle cx="${rightHand.x + 4}" cy="${rightHand.y - 5}" r="2.5" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1"/>
        </g>
      </g>
    `;
  }

  // -------------------------------------------------------------
  // LAYER 7: FACIAL FEATURES (Mouth, Nose, Eyes ALWAYS on Top of Clothing)
  // -------------------------------------------------------------
  renderFacialFeatures(monster, pal, anchors, action) {
    const f = anchors.faceCenter;
    const count = monster.eyes.count;
    const size = monster.eyes.size || 'big';
    let rBase = 16;
    if (size === 'tiny') rBase = 7;
    else if (size === 'small') rBase = 11;
    else if (size === 'giant') rBase = 22;

    let eyeConfigs = [];
    if (count === 1) {
      eyeConfigs = [{ cx: f.cx, cy: f.eyeY, r: rBase * 1.3 }];
    } else if (count === 2) {
      eyeConfigs = [
        { cx: f.cx - 24, cy: f.eyeY, r: rBase },
        { cx: f.cx + 24, cy: f.eyeY, r: rBase }
      ];
    } else if (count === 3) {
      eyeConfigs = [
        { cx: f.cx - 38, cy: f.eyeY + 3, r: rBase * 0.85 },
        { cx: f.cx,      cy: f.eyeY - 4, r: rBase * 0.95 },
        { cx: f.cx + 38, cy: f.eyeY + 3, r: rBase * 0.85 }
      ];
    } else {
      eyeConfigs = [
        { cx: f.cx - 36, cy: f.eyeY - 4, r: rBase * 0.78 },
        { cx: f.cx - 12, cy: f.eyeY - 8, r: rBase * 0.82 },
        { cx: f.cx + 12, cy: f.eyeY - 8, r: rBase * 0.82 },
        { cx: f.cx + 36, cy: f.eyeY - 4, r: rBase * 0.78 }
      ];
    }

    // Eyes (Adapts to action states: sleep = closed arcs, tickle = giggling squints)
    let eyesSvg = '';
    if (action === 'sleep') {
      eyesSvg = eyeConfigs.map(c => `
        <path d="M ${c.cx - c.r},${c.cy + 3} Q ${c.cx},${c.cy + c.r + 5} ${c.cx + c.r},${c.cy + 3}" 
              fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>
      `).join('');
    } else if (action === 'tickle') {
      eyesSvg = eyeConfigs.map(c => `
        <path d="M ${c.cx - c.r * 0.7},${c.cy + 3} Q ${c.cx},${c.cy - c.r * 0.6} ${c.cx + c.r * 0.7},${c.cy + 3}" 
              fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>
      `).join('');
    } else {
      eyesSvg = eyeConfigs.map(c => `
        <g class="monster-eye-item">
          <ellipse cx="${c.cx}" cy="${c.cy}" rx="${c.r}" ry="${c.r * 1.05}" fill="#ffffff" stroke="#0f172a" stroke-width="3"/>
          <circle cx="${c.cx}" cy="${c.cy + 1}" r="${c.r * 0.58}" fill="#0284c7"/>
          <circle cx="${c.cx}" cy="${c.cy + 1}" r="${c.r * 0.38}" fill="#0f172a"/>
          <circle cx="${c.cx - c.r * 0.22}" cy="${c.cy - c.r * 0.22}" r="${c.r * 0.22}" fill="#ffffff"/>
          <circle cx="${c.cx + c.r * 0.24}" cy="${c.cy + c.r * 0.24}" r="${c.r * 0.1}" fill="#ffffff"/>
        </g>
      `).join('');
    }

    // Soft Cheeks Blushes
    const blushY = f.mouthY;
    const blushSvg = `
      <ellipse cx="${f.cx - 36}" cy="${blushY}" rx="10" ry="6" fill="${pal.dark}" opacity="0.25"/>
      <ellipse cx="${f.cx + 36}" cy="${blushY}" rx="10" ry="6" fill="${pal.dark}" opacity="0.25"/>
    `;

    // Nose
    const noseSvg = `<ellipse cx="${f.cx}" cy="${f.noseY}" rx="6" ry="4.5" fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="2.5"/><circle cx="${f.cx - 1.5}" cy="${f.noseY - 1.5}" r="1.5" fill="#ffffff" opacity="0.6"/>`;

    // Mouth (Adapts to eat/tickle actions)
    let mouthSvg = '';
    if (action === 'eat') {
      mouthSvg = `
        <ellipse cx="${f.cx}" cy="${f.mouthY}" rx="18" ry="14" fill="#881337" stroke="#0f172a" stroke-width="3"/>
        <path d="M ${f.cx - 12},${f.mouthY + 6} Q ${f.cx},${f.mouthY + 12} ${f.cx + 12},${f.mouthY + 6}" fill="#f43f5e"/>
      `;
    } else if (action === 'tickle') {
      mouthSvg = `
        <path d="M ${f.cx - 20},${f.mouthY - 4} Q ${f.cx},${f.mouthY + 22} ${f.cx + 20},${f.mouthY - 4} Z" fill="#881337" stroke="#0f172a" stroke-width="3"/>
        <ellipse cx="${f.cx}" cy="${f.mouthY + 10}" rx="9" ry="5" fill="#f43f5e"/>
      `;
    } else {
      mouthSvg = `
        <path d="M ${f.cx - 18},${f.mouthY - 2} Q ${f.cx},${f.mouthY + 14} ${f.cx + 18},${f.mouthY - 2}" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>
      `;
    }

    return `
      <g id="layer-facial-features" class="layer-facial-features layer-eyes-mouth">
        ${blushSvg}
        ${eyesSvg}
        ${noseSvg}
        ${mouthSvg}
      </g>
    `;
  }

  // -------------------------------------------------------------
  // LAYER 8: EYEWEAR (Glasses / Sunglasses)
  // -------------------------------------------------------------
  renderEyewear(monster, anchors) {
    let out = '';
    const f = anchors.faceCenter;

    if (monster.accessories.includes('glasses') || monster.accessories.includes('sunglasses')) {
      const isSun = monster.accessories.includes('sunglasses');
      const lens = isSun ? '#0f172a' : 'rgba(255, 255, 255, 0.45)';
      out += `
        <g class="accessory-glasses" transform="translate(${f.cx}, ${f.eyeY})">
          <circle cx="-24" cy="0" r="17" fill="${lens}" stroke="#0f172a" stroke-width="3.5"/>
          <circle cx="24" cy="0" r="17" fill="${lens}" stroke="#0f172a" stroke-width="3.5"/>
          ${isSun ? '<ellipse cx="-28" cy="-5" rx="6" ry="3" fill="#ffffff" opacity="0.35" transform="rotate(-30 -28 -5)"/>' : ''}
          ${isSun ? '<ellipse cx="20" cy="-5" rx="6" ry="3" fill="#ffffff" opacity="0.35" transform="rotate(-30 20 -5)"/>' : ''}
          <path d="M -7,-1 Q 0,-5 7,-1" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>
        </g>
      `;
    }

    return `<g id="layer-eyewear" class="layer-eyewear">${out}</g>`;
  }

  // -------------------------------------------------------------
  // LAYER 9: HATS & CROWNS (Placed on Top of Head)
  // -------------------------------------------------------------
  renderHatsAndCrowns(monster, anchors) {
    let out = '';
    const top = anchors.headTop;

    if (monster.accessories.includes('hat') || monster.accessories.includes('cap')) {
      out += `
        <g class="accessory-hat" transform="translate(${top.x}, ${top.y - 8})">
          <ellipse cx="0" cy="0" rx="30" ry="9" fill="#eab308" stroke="#713f12" stroke-width="3"/>
          <path d="M -18,0 L -14,-24 Q 0,-30 14,-24 L 18,0 Z" fill="#ca8a04" stroke="#713f12" stroke-width="3"/>
        </g>
      `;
    } else if (monster.accessories.includes('crown')) {
      out += `
        <g class="accessory-crown" transform="translate(${top.x}, ${top.y - 6})">
          <polygon points="-22,0 -26,-20 -12,-10 0,-26 12,-10 26,-20 22,0" fill="url(#goldAccGrad)" stroke="#78350f" stroke-width="3"/>
          <circle cx="0" cy="-26" r="3.2" fill="#ef4444"/>
          <circle cx="-26" cy="-20" r="2.8" fill="#3b82f6"/>
          <circle cx="26" cy="-20" r="2.8" fill="#10b981"/>
        </g>
      `;
    }

    return `<g id="layer-hats-crowns" class="layer-hats-crowns">${out}</g>`;
  }

  // -------------------------------------------------------------
  // BACKWARD COMPATIBILITY DELEGATES
  // -------------------------------------------------------------
  renderTorsoAndHead(monster, pal, secPal, anchors, bodyGradId, secGradId) {
    return `
      ${this.renderTorsoBase(monster, pal, secPal, anchors, bodyGradId, secGradId)}
      ${this.renderEarsAndHorns(monster, pal, anchors)}
    `;
  }

  renderEyesAndMouth(monster, pal, anchors, action) {
    return this.renderFacialFeatures(monster, pal, anchors, action);
  }

  renderClothesAndAccessories(monster, pal, anchors) {
    return `
      ${this.renderClothes(monster, pal, anchors)}
      ${this.renderEyewear(monster, anchors)}
      ${this.renderHatsAndCrowns(monster, anchors)}
    `;
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
