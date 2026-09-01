/**
 * monsterRenderer.js - Rebuilt Procedural Cartoon Character Rendering System
 * Features:
 * 1. REAL HEAD + REAL BODY parent-child coordinate hierarchy.
 * 2. Strict Relative Positioning: All face features are children of Head; all limbs are children of Body.
 * 3. 9 Distinct Silhouettes with specialized Head & Torso geometry.
 * 4. Zero floating elements; zero mouth-over-clothing collision; zero disconnected limbs.
 * 5. Coordinated Facial Expressions (Happy, Angry, Sleepy, Surprised, Silly, Scary).
 * 6. Clean layer architecture & clothing fitting.
 */

class MonsterRenderer {
  constructor() {
    this.colorPalettes = {
      purple: { main: '#a855f7', belly: '#f3e8ff', dark: '#6b21a8', stroke: '#3b0764', highlight: '#c084fc', blush: '#d8b4fe' },
      green:  { main: '#22c55e', belly: '#dcfce7', dark: '#15803d', stroke: '#14532d', highlight: '#4ade80', blush: '#86efac' },
      blue:   { main: '#0ea5e9', belly: '#e0f2fe', dark: '#0369a1', stroke: '#0c4a6e', highlight: '#38bdf8', blush: '#7dd3fc' },
      red:    { main: '#f43f5e', belly: '#ffe4e6', dark: '#be123c', stroke: '#881337', highlight: '#fb7185', blush: '#fda4af' },
      orange: { main: '#f97316', belly: '#ffedd5', dark: '#c2410c', stroke: '#7c2d12', highlight: '#fb923c', blush: '#fdba74' },
      yellow: { main: '#eab308', belly: '#fef9c3', dark: '#a16207', stroke: '#713f12', highlight: '#fde047', blush: '#fef08a' },
      pink:   { main: '#ec4899', belly: '#fce7f3', dark: '#be185d', stroke: '#831843', highlight: '#f472b6', blush: '#f9a8d4' },
      black:  { main: '#334155', belly: '#94a3b8', dark: '#0f172a', stroke: '#020617', highlight: '#64748b', blush: '#475569' },
      white:  { main: '#f8fafc', belly: '#cbd5e1', dark: '#94a3b8', stroke: '#334155', highlight: '#ffffff', blush: '#e2e8f0' }
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
  }

  getPalette(colorName) {
    return this.colorPalettes[colorName] || this.colorPalettes.purple;
  }

  getClothColor(colorName, fallback = '#2563eb') {
    return this.clothingColors[colorName] || colorName || fallback;
  }

  /**
   * Character Model: Generates precise Head, Torso, Neck, and Joint Anchors
   * based on the chosen body silhouette.
   */
  getCharacterModel(shape = 'round') {
    const cx = 200;

    switch (shape) {
      case 'square':
        return {
          head: {
            cx, cy: 135, rx: 72, ry: 56,
            topY: 79, bottomY: 191, leftX: 128, rightX: 272,
            type: 'square'
          },
          neck: { topY: 180, bottomY: 205, width: 70 },
          body: {
            cx, cy: 285, rx: 80, ry: 75,
            topY: 200, bottomY: 360, leftX: 120, rightX: 280,
            shoulderL: { x: 120, y: 220 },
            shoulderR: { x: 280, y: 220 },
            hipL: { x: 155, y: 350 },
            hipR: { x: 245, y: 350 },
            legsBaseY: 350,
            type: 'square'
          }
        };

      case 'tall':
        return {
          head: {
            cx, cy: 120, rx: 62, ry: 52,
            topY: 68, bottomY: 172, leftX: 138, rightX: 262,
            type: 'tall'
          },
          neck: { topY: 165, bottomY: 195, width: 55 },
          body: {
            cx, cy: 285, rx: 65, ry: 90,
            topY: 190, bottomY: 375, leftX: 135, rightX: 265,
            shoulderL: { x: 135, y: 205 },
            shoulderR: { x: 265, y: 205 },
            hipL: { x: 160, y: 365 },
            hipR: { x: 240, y: 365 },
            legsBaseY: 365,
            type: 'tall'
          }
        };

      case 'short':
        return {
          head: {
            cx, cy: 145, rx: 82, ry: 58,
            topY: 87, bottomY: 203, leftX: 118, rightX: 282,
            type: 'short'
          },
          neck: { topY: 195, bottomY: 215, width: 80 },
          body: {
            cx, cy: 275, rx: 88, ry: 60,
            topY: 210, bottomY: 335, leftX: 112, rightX: 288,
            shoulderL: { x: 112, y: 225 },
            shoulderR: { x: 288, y: 225 },
            hipL: { x: 155, y: 330 },
            hipR: { x: 245, y: 330 },
            legsBaseY: 330,
            type: 'short'
          }
        };

      case 'wide':
        return {
          head: {
            cx, cy: 135, rx: 90, ry: 60,
            topY: 75, bottomY: 195, leftX: 110, rightX: 290,
            type: 'wide'
          },
          neck: { topY: 185, bottomY: 210, width: 95 },
          body: {
            cx, cy: 285, rx: 102, ry: 75,
            topY: 205, bottomY: 360, leftX: 98, rightX: 302,
            shoulderL: { x: 98, y: 220 },
            shoulderR: { x: 302, y: 220 },
            hipL: { x: 150, y: 350 },
            hipR: { x: 250, y: 350 },
            legsBaseY: 350,
            type: 'wide'
          }
        };

      case 'thin':
        return {
          head: {
            cx, cy: 125, rx: 55, ry: 50,
            topY: 75, bottomY: 175, leftX: 145, rightX: 255,
            type: 'thin'
          },
          neck: { topY: 168, bottomY: 195, width: 45 },
          body: {
            cx, cy: 285, rx: 55, ry: 90,
            topY: 190, bottomY: 375, leftX: 145, rightX: 255,
            shoulderL: { x: 145, y: 205 },
            shoulderR: { x: 255, y: 205 },
            hipL: { x: 165, y: 365 },
            hipR: { x: 235, y: 365 },
            legsBaseY: 365,
            type: 'thin'
          }
        };

      case 'blob':
        return {
          head: {
            cx, cy: 135, rx: 78, ry: 58,
            topY: 77, bottomY: 193, leftX: 122, rightX: 278,
            type: 'blob'
          },
          neck: { topY: 185, bottomY: 210, width: 75 },
          body: {
            cx, cy: 285, rx: 88, ry: 75,
            topY: 205, bottomY: 360, leftX: 112, rightX: 288,
            shoulderL: { x: 115, y: 220 },
            shoulderR: { x: 285, y: 220 },
            hipL: { x: 155, y: 350 },
            hipR: { x: 245, y: 350 },
            legsBaseY: 350,
            type: 'blob'
          }
        };

      case 'ghost':
        return {
          head: {
            cx, cy: 135, rx: 75, ry: 58,
            topY: 77, bottomY: 193, leftX: 125, rightX: 275,
            type: 'ghost'
          },
          neck: { topY: 185, bottomY: 210, width: 70 },
          body: {
            cx, cy: 300, rx: 82, ry: 100,
            topY: 200, bottomY: 410, leftX: 118, rightX: 282,
            shoulderL: { x: 120, y: 220 },
            shoulderR: { x: 280, y: 220 },
            hipL: { x: 160, y: 390 },
            hipR: { x: 240, y: 390 },
            legsBaseY: 410,
            type: 'ghost'
          }
        };

      case 'dinosaur':
        return {
          head: {
            cx, cy: 135, rx: 75, ry: 58,
            topY: 77, bottomY: 193, leftX: 125, rightX: 275,
            type: 'dinosaur'
          },
          neck: { topY: 185, bottomY: 210, width: 75 },
          body: {
            cx, cy: 285, rx: 85, ry: 75,
            topY: 205, bottomY: 360, leftX: 115, rightX: 285,
            shoulderL: { x: 118, y: 220 },
            shoulderR: { x: 282, y: 220 },
            hipL: { x: 155, y: 350 },
            hipR: { x: 245, y: 350 },
            legsBaseY: 350,
            type: 'dinosaur'
          }
        };

      case 'robot':
        return {
          head: {
            cx, cy: 130, rx: 70, ry: 52,
            topY: 78, bottomY: 182, leftX: 130, rightX: 270,
            type: 'robot'
          },
          neck: { topY: 178, bottomY: 202, width: 50 },
          body: {
            cx, cy: 285, rx: 80, ry: 75,
            topY: 198, bottomY: 355, leftX: 120, rightX: 280,
            shoulderL: { x: 120, y: 215 },
            shoulderR: { x: 280, y: 215 },
            hipL: { x: 155, y: 345 },
            hipR: { x: 245, y: 345 },
            legsBaseY: 345,
            type: 'robot'
          }
        };

      case 'round':
      default:
        return {
          head: {
            cx, cy: 138, rx: 75, ry: 58,
            topY: 80, bottomY: 196, leftX: 125, rightX: 275,
            type: 'round'
          },
          neck: { topY: 185, bottomY: 210, width: 70 },
          body: {
            cx, cy: 285, rx: 82, ry: 75,
            topY: 205, bottomY: 360, leftX: 118, rightX: 282,
            shoulderL: { x: 120, y: 220 },
            shoulderR: { x: 280, y: 220 },
            hipL: { x: 155, y: 350 },
            hipR: { x: 245, y: 350 },
            legsBaseY: 350,
            type: 'round'
          }
        };
    }
  }

  renderSvg(monster, options = {}) {
    const isAnimated = options.animated !== false;
    const pal = this.getPalette(monster.color);
    const secPal = this.getPalette(monster.secondaryColor || monster.color);
    const width = options.width || 400;
    const height = options.height || 480;
    const model = this.getCharacterModel(monster.bodyShape || 'round');

    // Strict Character Layer Hierarchy
    const layers = [
      // 1. Background elements
      this.renderBackdropShadow(monster, model),
      this.renderWings(monster, model),
      this.renderTail(monster, pal, model),
      this.renderBackExtras(monster, pal, model),
      monster.specialCape ? this.renderCapeBack(monster, model) : '',
      (monster.accessories && monster.accessories.includes('backpack')) ? this.renderBackpackBack(monster, model) : '',

      // 2. Legs & Feet (Attached to bottom of body)
      this.renderLegsAndFeet(monster, pal, model),

      // 3. Torso / Body Base (Real cartoon torso)
      this.renderBodyTorso(monster, pal, secPal, model),

      // 4. Body Pattern
      this.renderBodyPattern(monster, secPal, model),

      // 5. Clothing (Fitted to torso; dress/suit replaces separate tops)
      this.renderClothing(monster, model),

      // 6. Arms & Hands (Attached to body shoulders)
      this.renderArmsAndHands(monster, pal, model),

      // 7. Head Base Shape (Solid cartoon monster head shape)
      this.renderHeadBase(monster, pal, model),

      // 8. Head Pattern
      this.renderHeadPattern(monster, secPal, model),

      // 9. Ears & Horns (Attached to head perimeter)
      this.renderEars(monster, pal, model),
      this.renderHorns(monster, pal, model),

      // 10. Face Features (Positioned relative to Head: Eyes, Eyebrows, Nose, Mouth, Teeth)
      this.renderFaceFeatures(monster, pal, model),

      // 11. Glasses (Over Eyes)
      this.renderGlasses(monster, model),

      // 12. Neck Accessories (Scarf, Bow, Necklace, Cape Front)
      this.renderNeckAccessories(monster, model),
      monster.specialCape ? this.renderCapeFront(monster, model) : '',

      // 13. Head Accessories (Hats, Caps, Crowns, Wizard Hat, Helmets)
      this.renderHeadAccessories(monster, model),

      // 14. Power Effects
      this.renderPowerAura(monster)
    ];

    return `
      <svg class="monster-svg ${isAnimated ? 'animated-monster' : ''}" 
           viewBox="0 0 400 480" 
           width="${width}" 
           height="${height}" 
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
          <linearGradient id="secGrad_${monster.secondaryColor || monster.color}" x1="0%" y1="0%" x2="0%" y2="100%">
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

  // ==========================================
  // 1. BACKDROP & SPECIAL BACK FEATURES
  // ==========================================
  renderBackdropShadow(monster, model) {
    if (monster.bodyShape === 'ghost') {
      return `<ellipse cx="200" cy="445" rx="70" ry="12" fill="rgba(15, 23, 42, 0.08)" />`;
    }
    const rx = model.body.rx * 1.25;
    return `<ellipse cx="200" cy="445" rx="${rx}" ry="18" fill="rgba(15, 23, 42, 0.16)" />`;
  }

  renderWings(monster, model) {
    const wings = monster.specialWings;
    if (!wings || wings === 'none') return '';
    const wy = model.body.topY + 10;

    if (wings === 'dragon') {
      return `
        <g class="monster-wings-group dragon-wings">
          <path d="M 140,${wy} Q 60,${wy - 80} 30,${wy - 40} Q 80,${wy} 40,${wy + 50} Q 110,${wy + 40} 145,${wy + 35} Z" 
                fill="#f97316" stroke="#c2410c" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M 140,${wy} L 30,${wy - 40} M 140,${wy + 15} L 40,${wy + 50}" stroke="#7c2d12" stroke-width="3"/>
          <path d="M 260,${wy} Q 340,${wy - 80} 370,${wy - 40} Q 320,${wy} 360,${wy + 50} Q 290,${wy + 40} 255,${wy + 35} Z" 
                fill="#f97316" stroke="#c2410c" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M 260,${wy} L 370,${wy - 40} M 260,${wy + 15} L 360,${wy + 50}" stroke="#7c2d12" stroke-width="3"/>
        </g>
      `;
    } else if (wings === 'butterfly') {
      return `
        <g class="monster-wings-group butterfly-wings">
          <path d="M 145,${wy + 10} C 60,${wy - 80} 20,${wy} 70,${wy + 50} C 30,${wy + 90} 80,${wy + 140} 145,${wy + 60} Z" 
                fill="#ec4899" stroke="#be185d" stroke-width="4.5" stroke-linejoin="round"/>
          <circle cx="75" cy="${wy + 5}" r="14" fill="#fef08a" opacity="0.8"/>
          <path d="M 255,${wy + 10} C 340,${wy - 80} 380,${wy} 330,${wy + 50} C 370,${wy + 90} 320,${wy + 140} 255,${wy + 60} Z" 
                fill="#ec4899" stroke="#be185d" stroke-width="4.5" stroke-linejoin="round"/>
          <circle cx="325" cy="${wy + 5}" r="14" fill="#fef08a" opacity="0.8"/>
        </g>
      `;
    } else if (wings === 'bat') {
      return `
        <g class="monster-wings-group bat-wings">
          <path d="M 140,${wy + 15} Q 60,${wy - 50} 25,${wy - 5} Q 65,${wy + 30} 50,${wy + 65} Q 95,${wy + 65} 100,${wy + 95} Q 130,${wy + 75} 145,${wy + 40} Z" 
                fill="#334155" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M 260,${wy + 15} Q 340,${wy - 50} 375,${wy - 5} Q 335,${wy + 30} 350,${wy + 65} Q 305,${wy + 65} 300,${wy + 95} Q 270,${wy + 75} 255,${wy + 40} Z" 
                fill="#334155" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
        </g>
      `;
    }
    return '';
  }

  renderTail(monster, pal, model) {
    const tail = monster.specialTail;
    if (!tail || tail === 'none') return '';
    const ty = model.body.bottomY - 25;

    if (tail === 'long') {
      return `
        <g class="monster-tail-group long-tail">
          <path d="M 135,${ty} C 70,${ty} 30,${ty - 50} 45,${ty - 100} C 52,${ty - 125} 75,${ty - 115} 65,${ty - 90} C 55,${ty - 60} 85,${ty - 20} 145,${ty + 15} Z" 
                fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
          <circle cx="48" cy="${ty - 105}" r="9" fill="${pal.highlight}"/>
        </g>
      `;
    } else if (tail === 'curly') {
      return `
        <g class="monster-tail-group curly-tail">
          <path d="M 135,${ty} C 70,${ty + 15} 40,${ty - 25} 65,${ty - 65} C 85,${ty - 95} 120,${ty - 65} 95,${ty - 45} C 80,${ty - 35} 70,${ty - 5} 140,${ty + 13} Z" 
                fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
        </g>
      `;
    } else if (tail === 'dinosaur') {
      return `
        <g class="monster-tail-group dino-tail">
          <path d="M 135,${ty - 10} C 60,${ty - 10} 20,${ty + 50} 10,${ty + 70} C 40,${ty + 60} 90,${ty + 45} 145,${ty + 25} Z" 
                fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
          <polygon points="120,${ty - 6} 110,${ty - 25} 102,${ty - 2}" fill="#facc15" stroke="${pal.stroke}" stroke-width="2"/>
          <polygon points="85,${ty + 8} 72,${ty - 10} 68,${ty + 18}" fill="#facc15" stroke="${pal.stroke}" stroke-width="2"/>
          <polygon points="48,${ty + 32} 32,${ty + 15} 35,${ty + 45}" fill="#facc15" stroke="${pal.stroke}" stroke-width="2"/>
        </g>
      `;
    } else if (tail === 'snake') {
      return `
        <g class="monster-tail-group snake-tail">
          <path d="M 135,${ty} Q 70,${ty + 25} 50,${ty - 5} Q 30,${ty - 35} 65,${ty - 75} Q 90,${ty - 105} 75,${ty - 135}" 
                fill="none" stroke="${pal.main}" stroke-width="16" stroke-linecap="round"/>
          <path d="M 135,${ty} Q 70,${ty + 25} 50,${ty - 5} Q 30,${ty - 35} 65,${ty - 75} Q 90,${ty - 105} 75,${ty - 135}" 
                fill="none" stroke="${pal.stroke}" stroke-width="4.5" stroke-linecap="round"/>
        </g>
      `;
    } else if (tail === 'bunny') {
      return `
        <g class="monster-tail-group bunny-tail">
          <circle cx="118" cy="${ty}" r="18" fill="#ffffff" stroke="${pal.stroke}" stroke-width="4"/>
          <circle cx="115" cy="${ty - 3}" r="12" fill="#f1f5f9"/>
        </g>
      `;
    }
    return '';
  }

  renderBackExtras(monster, pal, model) {
    if (!monster.specialParts || !Array.isArray(monster.specialParts)) return '';
    let html = '';

    if (monster.specialParts.includes('shell')) {
      const by = model.body.cy;
      html += `
        <g class="monster-shell-back">
          <ellipse cx="200" cy="${by}" rx="96" ry="86" fill="#15803d" stroke="#0f172a" stroke-width="5"/>
          <ellipse cx="200" cy="${by}" rx="78" ry="68" fill="#16a34a"/>
          <polygon points="200,${by - 45} 238,${by - 15} 238,${by + 25} 200,${by + 55} 162,${by + 25} 162,${by - 15}" fill="#ca8a04" stroke="#713f12" stroke-width="3"/>
        </g>
      `;
    }

    if (monster.specialParts.includes('tentacles')) {
      const by = model.body.bottomY - 40;
      html += `
        <g class="monster-tentacles-back">
          <path d="M 120,${by} C 70,${by + 10} 40,${by + 70} 65,${by + 120} C 75,${by + 140} 95,${by + 130} 85,${by + 100} C 70,${by + 60} 100,${by + 30} 130,${by + 20} Z" 
                fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M 280,${by} C 330,${by + 10} 360,${by + 70} 335,${by + 120} C 325,${by + 140} 305,${by + 130} 315,${by + 100} C 330,${by + 60} 300,${by + 30} 270,${by + 20} Z" 
                fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
        </g>
      `;
    }

    if (monster.specialParts.includes('spikes')) {
      const hy = model.head.topY;
      html += `
        <g class="monster-spikes">
          <polygon points="175,${hy + 16} 160,${hy - 24} 185,${hy + 11}" fill="#facc15" stroke="${pal.stroke}" stroke-width="2.5"/>
          <polygon points="200,${hy + 11} 200,${hy - 34} 210,${hy + 11}" fill="#facc15" stroke="${pal.stroke}" stroke-width="2.5"/>
          <polygon points="225,${hy + 16} 240,${hy - 24} 215,${hy + 11}" fill="#facc15" stroke="${pal.stroke}" stroke-width="2.5"/>
        </g>
      `;
    }

    if (monster.specialParts.includes('fins')) {
      const by = model.body.cy - 30;
      html += `
        <g class="monster-fins">
          <path d="M 125,${by} Q 75,${by - 25} 70,${by + 15} Q 100,${by + 25} 125,${by + 15} Z" fill="#38bdf8" stroke="${pal.stroke}" stroke-width="3"/>
          <path d="M 275,${by} Q 325,${by - 25} 330,${by + 15} Q 300,${by + 25} 275,${by + 15} Z" fill="#38bdf8" stroke="${pal.stroke}" stroke-width="3"/>
        </g>
      `;
    }

    return html;
  }

  renderCapeBack(monster, model) {
    const capeColor = monster.specialCapeColor || 'red';
    const fill = capeColor === 'red' ? 'url(#capeGrad)' : this.getClothColor(capeColor, '#ef4444');
    const cy = model.body.topY + 5;
    return `
      <g class="monster-cape-back">
        <path d="M 130,${cy} Q 80,330 65,415 Q 200,445 335,415 Q 320,330 270,${cy} Z" 
              fill="${fill}" stroke="#881337" stroke-width="4.5" stroke-linejoin="round" />
      </g>
    `;
  }

  renderBackpackBack(monster, model) {
    const by = model.body.cy - 60;
    return `
      <g class="monster-backpack-back">
        <rect x="110" y="${by}" width="180" height="135" rx="30" fill="#10b981" stroke="#065f46" stroke-width="5"/>
        <path d="M 130,${by + 20} L 270,${by + 20}" stroke="#065f46" stroke-width="4" stroke-linecap="round"/>
      </g>
    `;
  }

  // ==========================================
  // 2. LEGS & FEET
  // ==========================================
  renderLegsAndFeet(monster, pal, model) {
    const count = monster.legsCount !== undefined ? monster.legsCount : 2;
    if (count === 0 || monster.bodyShape === 'ghost') return '';

    const hasBoots = !!monster.specialBoots || monster.clothesShoes === 'boots';
    const shoeType = monster.clothesShoes || (hasBoots ? 'boots' : 'none');
    const bootColor = this.getClothColor(monster.specialBootsColor || 'yellow', '#eab308');
    const baseY = model.body.legsBaseY;

    let legConfigs = [];
    if (count === 1) legConfigs = [{ x: 200, y: baseY, angle: 0 }];
    else if (count === 2) legConfigs = [
      { x: 155, y: baseY - 5, angle: -4 },
      { x: 245, y: baseY - 5, angle: 4 }
    ];
    else if (count === 3) legConfigs = [
      { x: 140, y: baseY - 5, angle: -10 },
      { x: 200, y: baseY, angle: 0 },
      { x: 260, y: baseY - 5, angle: 10 }
    ];
    else { // 4 legs
      legConfigs = [
        { x: 126, y: baseY - 7, angle: -14 },
        { x: 175, y: baseY, angle: -4 },
        { x: 225, y: baseY, angle: 4 },
        { x: 274, y: baseY - 7, angle: 14 }
      ];
    }

    return `
      <g class="monster-legs-group">
        ${legConfigs.map((cfg) => `
          <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.angle})">
            <path d="M -14,0 L -14,75 Q -14,88 0,88 Q 14,88 14,75 L 14,0 Z" 
                  fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
            
            ${shoeType === 'boots' ? `
              <g transform="translate(0, 48)">
                <path d="M -18,0 L 22,0 L 26,38 Q 26,48 10,48 L -20,48 Q -24,48 -22,36 Z" 
                      fill="${bootColor}" stroke="${pal.stroke}" stroke-width="4" stroke-linejoin="round"/>
                <ellipse cx="2" cy="46" rx="24" ry="7" fill="${pal.stroke}"/>
                <rect x="-16" y="0" width="38" height="8" rx="3" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
              </g>
            ` : shoeType === 'sneakers' ? `
              <g transform="translate(0, 56)">
                <path d="M -18,0 L 24,0 L 28,32 Q 28,38 12,38 L -20,38 Z" fill="#ef4444" stroke="${pal.stroke}" stroke-width="3.5"/>
                <rect x="-22" y="28" width="52" height="10" rx="4" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
              </g>
            ` : shoeType === 'clown_shoes' ? `
              <g transform="translate(0, 50)">
                <ellipse cx="8" cy="32" rx="34" ry="16" fill="#facc15" stroke="${pal.stroke}" stroke-width="4"/>
                <circle cx="34" cy="24" r="8" fill="#ef4444"/>
              </g>
            ` : monster.feetStyle === 'bird' ? `
              <g transform="translate(0, 80)">
                <path d="M -18,12 L 0,0 L 18,12 M 0,0 L 0,16 M 0,0 L -6,-10" stroke="#ca8a04" stroke-width="6" stroke-linecap="round"/>
              </g>
            ` : monster.feetStyle === 'claws' ? `
              <g transform="translate(0, 80)">
                <ellipse cx="2" cy="5" rx="24" ry="12" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5"/>
                <polygon points="-16,10 -12,24 -8,10" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
                <polygon points="-2,12 2,26 6,12" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
                <polygon points="12,10 16,24 20,10" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
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

  // ==========================================
  // 3. TORSO / BODY BASE
  // ==========================================
  renderBodyTorso(monster, pal, secPal, model) {
    const b = model.body;
    let bodyPath = '';
    let bellyPath = '';

    if (b.type === 'square') {
      bodyPath = `M ${b.leftX},${b.topY} L ${b.rightX},${b.topY} Q ${b.rightX + 15},${b.topY} ${b.rightX + 15},${b.topY + 20} L ${b.rightX + 15},${b.bottomY - 20} Q ${b.rightX + 15},${b.bottomY} ${b.rightX - 10},${b.bottomY} L ${b.leftX + 10},${b.bottomY} Q ${b.leftX - 15},${b.bottomY} ${b.leftX - 15},${b.bottomY - 20} L ${b.leftX - 15},${b.topY + 20} Q ${b.leftX - 15},${b.topY} ${b.leftX},${b.topY} Z`;
      bellyPath = `<rect x="145" y="${b.cy - 45}" width="110" height="95" rx="20" fill="url(#secGrad_${monster.secondaryColor || monster.color})" stroke="${pal.dark}" stroke-width="3"/>`;
    } else if (b.type === 'tall' || b.type === 'thin') {
      bodyPath = `M 200,${b.topY} C ${b.rightX},${b.topY} ${b.rightX},${b.cy} ${b.rightX - 5},${b.bottomY - 10} C ${b.rightX - 15},${b.bottomY} ${b.leftX + 15},${b.bottomY} ${b.leftX + 5},${b.bottomY - 10} C ${b.leftX},${b.cy} ${b.leftX},${b.topY} 200,${b.topY} Z`;
      bellyPath = `<ellipse cx="200" cy="${b.cy}" rx="${b.rx * 0.58}" ry="${b.ry * 0.72}" fill="url(#secGrad_${monster.secondaryColor || monster.color})" stroke="${pal.dark}" stroke-width="3"/>`;
    } else if (b.type === 'ghost') {
      bodyPath = `M 200,${b.topY} C ${b.rightX + 10},${b.topY} ${b.rightX + 10},${b.cy + 30} ${b.rightX - 10},${b.bottomY} C 250,${b.bottomY - 25} 230,${b.bottomY + 5} 200,${b.bottomY - 15} C 170,${b.bottomY + 5} 150,${b.bottomY - 25} 130,${b.bottomY} C ${b.leftX - 10},${b.cy + 30} ${b.leftX - 10},${b.topY} 200,${b.topY} Z`;
      bellyPath = `<ellipse cx="200" cy="${b.cy}" rx="55" ry="60" fill="url(#secGrad_${monster.secondaryColor || monster.color})" opacity="0.6"/>`;
    } else if (b.type === 'robot') {
      bodyPath = `M ${b.leftX},${b.topY} L ${b.rightX},${b.topY} L ${b.rightX},${b.bottomY} L ${b.leftX},${b.bottomY} Z`;
      bellyPath = `<rect x="145" y="${b.cy - 45}" width="110" height="90" rx="12" fill="url(#secGrad_${monster.secondaryColor || monster.color})" stroke="${pal.dark}" stroke-width="3"/><circle cx="200" cy="${b.cy}" r="16" fill="#38bdf8"/>`;
    } else { // round, blob, wide, short, dinosaur
      bodyPath = `M 200,${b.topY} C ${b.rightX + 10},${b.topY} ${b.rightX + 10},${b.cy} ${b.rightX - 5},${b.bottomY - 10} C ${b.rightX - 20},${b.bottomY} ${b.leftX + 20},${b.bottomY} ${b.leftX + 5},${b.bottomY - 10} C ${b.leftX - 10},${b.cy} ${b.leftX - 10},${b.topY} 200,${b.topY} Z`;
      bellyPath = `<ellipse cx="200" cy="${b.cy}" rx="${b.rx * 0.68}" ry="${b.ry * 0.65}" fill="url(#secGrad_${monster.secondaryColor || monster.color})" stroke="${pal.dark}" stroke-width="3"/>`;
    }

    return `
      <g class="monster-torso-group" filter="url(#mShadow)">
        <path d="${bodyPath}" fill="url(#bodyGrad_${monster.color})" stroke="${pal.stroke}" stroke-width="5" stroke-linejoin="round"/>
        ${bellyPath}
      </g>
    `;
  }

  renderBodyPattern(monster, secPal, model) {
    const pat = monster.pattern;
    if (!pat || pat === 'none') return '';
    const col = secPal.main;
    const by = model.body.cy;

    if (pat === 'spots' || pat === 'dots') {
      const r = pat === 'dots' ? 4 : 8.5;
      return `
        <g class="monster-body-pattern" opacity="0.6">
          <circle cx="150" cy="${by - 30}" r="${r}" fill="${col}"/>
          <circle cx="250" cy="${by - 30}" r="${r}" fill="${col}"/>
          <circle cx="150" cy="${by + 30}" r="${r}" fill="${col}"/>
          <circle cx="250" cy="${by + 30}" r="${r}" fill="${col}"/>
        </g>
      `;
    } else if (pat === 'stripes' || pat === 'rainbow') {
      const cols = pat === 'rainbow' ? ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'] : [col, col, col, col];
      return `
        <g class="monster-body-pattern" opacity="0.55">
          <path d="M 130,${by - 40} Q 200,${by - 25} 270,${by - 40}" stroke="${cols[0]}" stroke-width="8" stroke-linecap="round"/>
          <path d="M 125,${by - 10} Q 200,${by + 5} 275,${by - 10}" stroke="${cols[1]}" stroke-width="8" stroke-linecap="round"/>
          <path d="M 125,${by + 20} Q 200,${by + 35} 275,${by + 20}" stroke="${cols[2]}" stroke-width="8" stroke-linecap="round"/>
          <path d="M 130,${by + 50} Q 200,${by + 65} 270,${by + 50}" stroke="${cols[3]}" stroke-width="8" stroke-linecap="round"/>
        </g>
      `;
    }
    return '';
  }

  // ==========================================
  // 4. CLOTHING LAYER
  // ==========================================
  renderClothing(monster, model) {
    const suit = monster.specialSuit;
    const isFullSuit = suit && suit !== 'none';
    const isDress = monster.clothesBottom === 'dress';
    const b = model.body;

    if (isFullSuit) {
      if (suit === 'superhero') {
        return `
          <g class="monster-clothing-suit">
            <path d="M ${b.leftX + 15},${b.topY} Q 200,${b.topY + 15} ${b.rightX - 15},${b.topY} L ${b.rightX + 5},${b.bottomY - 20} L ${b.leftX - 5},${b.bottomY - 20} Z" fill="#2563eb" stroke="#0f172a" stroke-width="4.5"/>
            <polygon points="200,${b.cy - 40} 225,${b.cy - 20} 215,${b.cy + 10} 185,${b.cy + 10} 175,${b.cy - 20}" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
            <text x="200" y="${b.cy - 3}" font-size="22" font-weight="900" text-anchor="middle" fill="#dc2626">M</text>
          </g>
        `;
      } else if (suit === 'astronaut') {
        return `
          <g class="monster-clothing-suit">
            <path d="M ${b.leftX + 15},${b.topY} L ${b.rightX - 15},${b.topY} L ${b.rightX + 5},${b.bottomY - 15} L ${b.leftX - 5},${b.bottomY - 15} Z" fill="#f8fafc" stroke="#0f172a" stroke-width="4.5"/>
            <rect x="175" y="${b.cy - 35}" width="50" height="40" rx="8" fill="#38bdf8" stroke="#0f172a" stroke-width="2.5"/>
            <circle cx="188" cy="${b.cy - 20}" r="4" fill="#ef4444"/>
            <circle cx="212" cy="${b.cy - 20}" r="4" fill="#10b981"/>
          </g>
        `;
      } else if (suit === 'wizard') {
        return `
          <g class="monster-clothing-suit">
            <path d="M ${b.leftX + 15},${b.topY} Q 200,${b.topY + 15} ${b.rightX - 15},${b.topY} L 305,${b.bottomY + 15} L 95,${b.bottomY + 15} Z" fill="#7c3aed" stroke="#0f172a" stroke-width="4.5"/>
            <polygon points="200,${b.cy - 30} 203,${b.cy - 22} 212,${b.cy - 21} 205,${b.cy - 15} 207,${b.cy - 7} 200,${b.cy - 11} 193,${b.cy - 7} 195,${b.cy - 15} 188,${b.cy - 21} 197,${b.cy - 22}" fill="#facc15"/>
          </g>
        `;
      } else if (suit === 'pirate') {
        return `
          <g class="monster-clothing-suit">
            <path d="M ${b.leftX + 15},${b.topY} L ${b.rightX - 15},${b.topY} L ${b.rightX + 5},${b.bottomY - 15} L ${b.leftX - 5},${b.bottomY - 15} Z" fill="#1e293b" stroke="#0f172a" stroke-width="4.5"/>
            <path d="M 175,${b.topY} L 175,${b.bottomY - 15} L 225,${b.bottomY - 15} L 225,${b.topY} Z" fill="#dc2626"/>
            <line x1="175" y1="${b.cy - 20}" x2="225" y2="${b.cy - 20}" stroke="#ffffff" stroke-width="4"/>
          </g>
        `;
      } else if (suit === 'football') {
        return `
          <g class="monster-clothing-suit">
            <path d="M ${b.leftX + 15},${b.topY} L ${b.rightX - 15},${b.topY} L ${b.rightX + 5},${b.bottomY - 30} L ${b.leftX - 5},${b.bottomY - 30} Z" fill="#16a34a" stroke="#0f172a" stroke-width="4.5"/>
            <text x="200" y="${b.cy + 10}" font-size="34" font-weight="900" text-anchor="middle" fill="#ffffff">10</text>
          </g>
        `;
      } else if (suit === 'royal') {
        return `
          <g class="monster-clothing-suit">
            <path d="M ${b.leftX + 15},${b.topY} L ${b.rightX - 15},${b.topY} L 300,${b.bottomY + 10} L 100,${b.bottomY + 10} Z" fill="#991b1b" stroke="#0f172a" stroke-width="4.5"/>
            <path d="M 180,${b.topY} L 180,${b.bottomY + 10} L 220,${b.bottomY + 10} L 220,${b.topY} Z" fill="#fef08a" stroke="#0f172a" stroke-width="2"/>
          </g>
        `;
      }
    }

    if (isDress) {
      const dressColor = this.getClothColor(monster.clothesBottomColor || 'pink', '#ec4899');
      return `
        <g class="monster-clothing-dress">
          <path d="M ${b.leftX + 25},${b.topY} Q 200,${b.topY + 15} ${b.rightX - 25},${b.topY} L 305,${b.bottomY + 15} Q 200,${b.bottomY + 30} 95,${b.bottomY + 15} Z" 
                fill="${dressColor}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
        </g>
      `;
    }

    let html = '';

    // Bottoms
    if (monster.clothesBottom && monster.clothesBottom !== 'none') {
      const botColor = this.getClothColor(monster.clothesBottomColor, '#1e293b');
      if (monster.clothesBottom === 'trousers') {
        html += `
          <g class="monster-clothing-bottoms">
            <path d="M ${b.leftX + 10},${b.bottomY - 60} C ${b.leftX},${b.bottomY} ${b.leftX + 25},${b.bottomY + 20} 150,${b.bottomY + 20} L 180,${b.bottomY + 20} L 200,${b.bottomY - 30} L 220,${b.bottomY + 20} L 250,${b.bottomY + 20} C ${b.rightX - 25},${b.bottomY + 20} ${b.rightX},${b.bottomY} ${b.rightX - 10},${b.bottomY - 60} Z" 
                  fill="${botColor}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
            <rect x="188" y="${b.bottomY - 62}" width="24" height="7" rx="3" fill="#facc15" stroke="#0f172a" stroke-width="2"/>
          </g>
        `;
      } else if (monster.clothesBottom === 'shorts') {
        html += `
          <g class="monster-clothing-bottoms">
            <path d="M ${b.leftX + 10},${b.bottomY - 60} C ${b.leftX + 5},${b.bottomY - 20} ${b.leftX + 30},${b.bottomY - 10} 155,${b.bottomY - 10} L 180,${b.bottomY - 10} L 200,${b.bottomY - 35} L 220,${b.bottomY - 10} L 245,${b.bottomY - 10} C ${b.rightX - 30},${b.bottomY - 10} ${b.rightX - 5},${b.bottomY - 20} ${b.rightX - 10},${b.bottomY - 60} Z" 
                  fill="${botColor}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          </g>
        `;
      } else if (monster.clothesBottom === 'skirt') {
        html += `
          <g class="monster-clothing-bottoms">
            <path d="M ${b.leftX + 20},${b.bottomY - 60} Q 95,${b.bottomY + 15} 105,${b.bottomY + 22} Q 200,${b.bottomY + 36} 295,${b.bottomY + 22} Q 305,${b.bottomY + 15} ${b.rightX - 20},${b.bottomY - 60} Z" 
                  fill="${botColor}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          </g>
        `;
      }
    }

    // Tops
    if (monster.clothesTop && monster.clothesTop !== 'none') {
      const topColor = this.getClothColor(monster.clothesTopColor, '#2563eb');
      if (monster.clothesTop === 'tshirt') {
        html += `
          <g class="monster-clothing-tops">
            <path d="M ${b.leftX + 20},${b.topY} Q 200,${b.topY + 15} ${b.rightX - 20},${b.topY} L ${b.rightX + 15},${b.topY + 45} L ${b.rightX - 8},${b.topY + 55} L ${b.rightX - 16},${b.bottomY - 50} L ${b.leftX + 16},${b.bottomY - 50} L ${b.leftX + 8},${b.topY + 55} L ${b.leftX - 15},${b.topY + 45} Z" 
                  fill="${topColor}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          </g>
        `;
      } else if (monster.clothesTop === 'shirt') {
        html += `
          <g class="monster-clothing-tops">
            <path d="M ${b.leftX + 20},${b.topY} L ${b.rightX - 20},${b.topY} L ${b.rightX + 15},${b.topY + 45} L ${b.rightX - 8},${b.topY + 55} L ${b.rightX - 16},${b.bottomY - 50} L ${b.leftX + 16},${b.bottomY - 50} L ${b.leftX + 8},${b.topY + 55} L ${b.leftX - 15},${b.topY + 45} Z" 
                  fill="${topColor}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
            <polygon points="174,${b.topY} 200,${b.topY + 24} 188,${b.topY}" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
            <polygon points="226,${b.topY} 200,${b.topY + 24} 212,${b.topY}" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
            <line x1="200" y1="${b.topY + 24}" x2="200" y2="${b.bottomY - 50}" stroke="#0f172a" stroke-width="3"/>
          </g>
        `;
      } else if (monster.clothesTop === 'hoodie') {
        html += `
          <g class="monster-clothing-tops">
            <path d="M ${b.leftX + 18},${b.topY} Q 200,${b.topY + 12} ${b.rightX - 18},${b.topY} L ${b.rightX + 16},${b.topY + 48} L ${b.rightX - 6},${b.topY + 58} L ${b.rightX - 14},${b.bottomY - 45} L ${b.leftX + 14},${b.bottomY - 45} L ${b.leftX + 6},${b.topY + 58} L ${b.leftX - 16},${b.topY + 48} Z" 
                  fill="${topColor}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
            <rect x="160" y="${b.cy - 10}" width="80" height="28" rx="8" fill="#ffffff" opacity="0.4"/>
          </g>
        `;
      } else if (monster.clothesTop === 'jacket') {
        html += `
          <g class="monster-clothing-tops">
            <path d="M ${b.leftX + 18},${b.topY} L ${b.rightX - 18},${b.topY} L ${b.rightX + 18},${b.topY + 48} L ${b.rightX - 6},${b.topY + 58} L ${b.rightX - 14},${b.bottomY - 45} L ${b.leftX + 14},${b.bottomY - 45} L ${b.leftX + 6},${b.topY + 58} L ${b.leftX - 18},${b.topY + 48} Z" 
                  fill="${topColor}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
            <path d="M 174,${b.topY} L 186,${b.bottomY - 45}" stroke="#0f172a" stroke-width="4"/>
            <path d="M 226,${b.topY} L 214,${b.bottomY - 45}" stroke="#0f172a" stroke-width="4"/>
          </g>
        `;
      }
    }

    return html;
  }

  // ==========================================
  // 5. ARMS & HANDS
  // ==========================================
  renderArmsAndHands(monster, pal, model) {
    const count = monster.armsCount !== undefined ? monster.armsCount : 2;
    if (count === 0) return '';
    const length = monster.armsLength || 'short';
    const hasGloves = !!monster.specialGloves;
    const gloveColor = this.getClothColor(monster.specialGlovesColor || 'green', '#16a34a');

    let armFactor = 1.0;
    if (length === 'tiny') armFactor = 0.6;
    else if (length === 'long') armFactor = 1.35;
    else if (length === 'super_long') armFactor = 1.7;

    const shL = model.body.shoulderL;
    const shR = model.body.shoulderR;

    let armConfigs = [];
    if (count === 1) armConfigs = [{ side: 'right', shX: shR.x, shY: shR.y, handX: 62 * armFactor, handY: -35 * armFactor, rot: 28, flip: true }];
    else if (count === 2) armConfigs = [
      { side: 'left',  shX: shL.x, shY: shL.y, handX: 62 * armFactor, handY: 35 * armFactor,  rot: -28, flip: false },
      { side: 'right', shX: shR.x, shY: shR.y, handX: 62 * armFactor, handY: -35 * armFactor, rot: 28,  flip: true }
    ];
    else if (count === 3) armConfigs = [
      { side: 'left',  shX: shL.x, shY: shL.y - 10, handX: 65 * armFactor, handY: -30 * armFactor, rot: -42, flip: false },
      { side: 'left',  shX: shL.x + 2, shY: shL.y + 40, handX: 58 * armFactor, handY: 35 * armFactor, rot: -12, flip: false },
      { side: 'right', shX: shR.x, shY: shR.y, handX: 62 * armFactor, handY: 35 * armFactor,  rot: 28,  flip: true }
    ];
    else { // 4 arms
      armConfigs = [
        { side: 'left',  shX: shL.x, shY: shL.y - 10, handX: 64 * armFactor, handY: -32 * armFactor, rot: -46, flip: false },
        { side: 'left',  shX: shL.x + 2, shY: shL.y + 45, handX: 58 * armFactor, handY: 30 * armFactor, rot: -10, flip: false },
        { side: 'right', shX: shR.x, shY: shR.y - 10, handX: 64 * armFactor, handY: -32 * armFactor, rot: 46,  flip: true },
        { side: 'right', shX: shR.x - 2, shY: shR.y + 45, handX: 58 * armFactor, handY: 30 * armFactor, rot: 10,  flip: true }
      ];
    }

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
                ` : monster.handsStyle === 'claws' ? `
                  <circle cx="0" cy="0" r="13" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="3.5"/>
                  <polygon points="${dir * -8},-8 ${dir * -14},-20 ${dir * -2},-10" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
                  <polygon points="0,-10 ${dir * 4},-22 ${dir * 6},-8" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
                  <polygon points="${dir * 8},-6 ${dir * 18},-16 ${dir * 12},-2" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
                ` : monster.handsStyle === 'giant' ? `
                  <circle cx="0" cy="0" r="22" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5"/>
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

  // ==========================================
  // 6. REAL HEAD BASE SHAPE
  // ==========================================
  renderHeadBase(monster, pal, model) {
    const h = model.head;
    const n = model.neck;
    let headPath = '';

    // Connective Neck Shape under head
    const neckSvg = `
      <path d="M ${200 - n.width/2},${n.topY} L ${200 + n.width/2},${n.topY} L ${200 + n.width/2 + 8},${n.bottomY} L ${200 - n.width/2 - 8},${n.bottomY} Z" 
            fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="4" stroke-linejoin="round"/>
    `;

    if (h.type === 'square') {
      headPath = `M ${h.leftX},${h.topY} L ${h.rightX},${h.topY} Q ${h.rightX + 15},${h.topY} ${h.rightX + 15},${h.topY + 15} L ${h.rightX + 15},${h.bottomY - 15} Q ${h.rightX + 15},${h.bottomY} ${h.rightX},${h.bottomY} L ${h.leftX},${h.bottomY} Q ${h.leftX - 15},${h.bottomY} ${h.leftX - 15},${h.bottomY - 15} L ${h.leftX - 15},${h.topY + 15} Q ${h.leftX - 15},${h.topY} ${h.leftX},${h.topY} Z`;
    } else if (h.type === 'robot') {
      headPath = `M ${h.leftX},${h.topY} L ${h.rightX},${h.topY} L ${h.rightX},${h.bottomY} L ${h.leftX},${h.bottomY} Z`;
    } else if (h.type === 'tall' || h.type === 'thin') {
      headPath = `M 200,${h.topY} C ${h.rightX + 5},${h.topY} ${h.rightX + 5},${h.bottomY} 200,${h.bottomY} C ${h.leftX - 5},${h.bottomY} ${h.leftX - 5},${h.topY} 200,${h.topY} Z`;
    } else { // round, blob, short, wide, dinosaur, ghost
      headPath = `M 200,${h.topY} C ${h.rightX + 10},${h.topY} ${h.rightX + 10},${h.bottomY} 200,${h.bottomY} C ${h.leftX - 10},${h.bottomY} ${h.leftX - 10},${h.topY} 200,${h.topY} Z`;
    }

    const cheekY = h.cy + h.ry * 0.42;
    const cheekOffset = h.rx * 0.65;

    return `
      <g class="monster-head-container" filter="url(#mShadow)">
        ${neckSvg}
        <!-- Real Head Silhouette Shape -->
        <path d="${headPath}" fill="url(#bodyGrad_${monster.color})" stroke="${pal.stroke}" stroke-width="5" stroke-linejoin="round"/>
        <!-- Soft Blush Cheeks on Head -->
        <ellipse cx="${200 - cheekOffset}" cy="${cheekY}" rx="15" ry="10" fill="${pal.blush}" opacity="0.6"/>
        <ellipse cx="${200 + cheekOffset}" cy="${cheekY}" rx="15" ry="10" fill="${pal.blush}" opacity="0.6"/>
      </g>
    `;
  }

  renderHeadPattern(monster, secPal, model) {
    const pat = monster.pattern;
    if (!pat || pat === 'none') return '';
    const col = secPal.main;
    const h = model.head;

    if (pat === 'spots' || pat === 'dots') {
      const r = pat === 'dots' ? 4 : 8;
      return `
        <g class="monster-head-pattern" opacity="0.65">
          <circle cx="${h.cx - h.rx * 0.45}" cy="${h.topY + 22}" r="${r}" fill="${col}"/>
          <circle cx="${h.cx + h.rx * 0.45}" cy="${h.topY + 22}" r="${r}" fill="${col}"/>
        </g>
      `;
    } else if (pat === 'stars') {
      return `
        <g class="monster-head-pattern" opacity="0.75">
          <polygon points="${h.cx - 35},${h.topY + 18} ${h.cx - 33},${h.topY + 23} ${h.cx - 27},${h.topY + 24} ${h.cx - 32},${h.topY + 28} ${h.cx - 30},${h.topY + 34} ${h.cx - 35},${h.topY + 31} ${h.cx - 40},${h.topY + 34} ${h.cx - 38},${h.topY + 28} ${h.cx - 43},${h.topY + 24} ${h.cx - 37},${h.topY + 23}" fill="${col}"/>
          <polygon points="${h.cx + 35},${h.topY + 18} ${h.cx + 37},${h.topY + 23} ${h.cx + 43},${h.topY + 24} ${h.cx + 38},${h.topY + 28} ${h.cx + 40},${h.topY + 34} ${h.cx + 35},${h.topY + 31} ${h.cx + 30},${h.topY + 34} ${h.cx + 32},${h.topY + 28} ${h.cx + 27},${h.topY + 24} ${h.cx + 33},${h.topY + 23}" fill="${col}"/>
        </g>
      `;
    }
    return '';
  }

  // ==========================================
  // 7. EARS & HORNS (ATTACHED TO HEAD PERIMETER)
  // ==========================================
  renderEars(monster, pal, model) {
    const count = monster.earsCount !== undefined ? monster.earsCount : 2;
    if (count === 0) return '';
    const style = monster.earsStyle || 'long';
    const h = model.head;

    let configs = [];
    if (count === 1) configs = [{ x: h.leftX + 2, y: h.cy - 10, rot: -26, flip: false }];
    else if (count === 2) configs = [
      { x: h.leftX + 2, y: h.cy - 10, rot: -26, flip: false },
      { x: h.rightX - 2, y: h.cy - 10, rot: 26, flip: true }
    ];
    else if (count === 4) configs = [
      { x: h.leftX + 4, y: h.cy - 25, rot: -34, flip: false },
      { x: h.leftX - 2, y: h.cy + 15, rot: -16, flip: false },
      { x: h.rightX - 4, y: h.cy - 25, rot: 34, flip: true },
      { x: h.rightX + 2, y: h.cy + 15, rot: 16, flip: true }
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
          } else { // round, small
            const r = style === 'small' ? 16 : 22;
            return `
              <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.rot})">
                <ellipse cx="0" cy="0" rx="${r}" ry="${r*1.1}" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5"/>
                <ellipse cx="0" cy="0" rx="${r*0.55}" ry="${r*0.6}" fill="${pal.belly}" stroke="${pal.dark}" stroke-width="2"/>
              </g>
            `;
          }
        }).join('')}
      </g>
    `;
  }

  renderHorns(monster, pal, model) {
    const count = monster.hornsCount || 0;
    if (count === 0) return '';
    const style = monster.hornsStyle || 'curly';
    const hy = model.head.topY + 6;

    let configs = [];
    if (count === 1) configs = [{ x: 200, y: hy, rot: 0, flip: false }];
    else if (count === 2) configs = [
      { x: 165, y: hy + 4, rot: -22, flip: false },
      { x: 235, y: hy + 4, rot: 22, flip: true }
    ];
    else if (count === 4) configs = [
      { x: 152, y: hy + 10, rot: -30, flip: false },
      { x: 175, y: hy,      rot: -12, flip: false },
      { x: 225, y: hy,      rot: 12, flip: true },
      { x: 248, y: hy + 10, rot: 30, flip: true }
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
          } else { // pointy, big
            const h = style === 'big' ? 55 : 40;
            return `
              <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.rot})">
                <polygon points="${-12*sign},0 0,${-h} ${12*sign},0" fill="url(#goldGrad)" stroke="#78350f" stroke-width="4" stroke-linejoin="round"/>
              </g>
            `;
          }
        }).join('')}
      </g>
    `;
  }

  // ==========================================
  // 8. RELATIVE FACE FEATURES (INSIDE HEAD)
  // ==========================================
  renderFaceFeatures(monster, pal, model) {
    const expr = monster.expression || 'happy';
    const h = model.head;
    const hx = h.cx;
    const hy = h.cy;

    // Face Anchor Heights relative to Head Center
    const eyeY = hy - (h.ry * 0.16);
    const noseY = hy + (h.ry * 0.22);
    const mouthY = hy + (h.ry * 0.58);

    // EYES CALCULATION
    const count = monster.eyesCount !== undefined ? monster.eyesCount : 2;
    const size = monster.eyesSize || 'big';
    const style = monster.eyesStyle || (expr === 'angry' ? 'angry' : (expr === 'sleepy' ? 'sleepy' : (expr === 'surprised' ? 'surprised' : 'round')));

    let rBase = 18;
    if (size === 'tiny') rBase = 9;
    else if (size === 'small') rBase = 13;
    else if (size === 'giant') rBase = 28;

    let eyeConfigs = [];
    if (count === 1) {
      eyeConfigs = [{ cx: hx, cy: eyeY, r: rBase * 1.35 }];
    } else if (count === 2) {
      const spread = h.rx * 0.44;
      eyeConfigs = [
        { cx: hx - spread, cy: eyeY, r: rBase },
        { cx: hx + spread, cy: eyeY, r: rBase }
      ];
    } else if (count === 3) {
      const spread = h.rx * 0.65;
      eyeConfigs = [
        { cx: hx - spread, cy: eyeY + 4, r: rBase * 0.82 },
        { cx: hx,          cy: eyeY - 8, r: rBase * 0.95 },
        { cx: hx + spread, cy: eyeY + 4, r: rBase * 0.82 }
      ];
    } else if (count === 4) {
      eyeConfigs = [
        { cx: hx - 48, cy: eyeY - 6, r: rBase * 0.75 },
        { cx: hx - 16, cy: eyeY - 10, r: rBase * 0.8 },
        { cx: hx + 16, cy: eyeY - 10, r: rBase * 0.8 },
        { cx: hx + 48, cy: eyeY - 6, r: rBase * 0.75 }
      ];
    } else { // many
      eyeConfigs = [
        { cx: hx - 52, cy: eyeY,     r: rBase * 0.7 },
        { cx: hx - 26, cy: eyeY - 10, r: rBase * 0.75 },
        { cx: hx,      cy: eyeY + 2,  r: rBase * 0.8 },
        { cx: hx + 26, cy: eyeY - 10, r: rBase * 0.75 },
        { cx: hx + 52, cy: eyeY,     r: rBase * 0.7 }
      ];
    }

    const eyesSvg = `
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
          } else if (style === 'sleepy' || expr === 'sleepy') {
            pupilContent = `
              <circle cx="${eye.cx}" cy="${eye.cy + eye.r*0.2}" r="${eye.r * 0.35}" fill="#0f172a"/>
              <path d="M ${eye.cx - eye.r},${eye.cy} Q ${eye.cx},${eye.cy + eye.r*0.3} ${eye.cx + eye.r},${eye.cy}" fill="${pal.main}" stroke="#0f172a" stroke-width="2.5"/>
            `;
          } else if (style === 'happy' || expr === 'happy') {
            pupilContent = `
              <path d="M ${eye.cx - eye.r*0.7},${eye.cy + eye.r*0.2} Q ${eye.cx},${eye.cy - eye.r*0.6} ${eye.cx + eye.r*0.7},${eye.cy + eye.r*0.2}" fill="none" stroke="#0f172a" stroke-width="4.5" stroke-linecap="round"/>
            `;
          } else if (style === 'angry' || expr === 'angry') {
            pupilContent = `
              <circle cx="${eye.cx}" cy="${eye.cy + 1.5}" r="${eye.r * 0.45}" fill="#ef4444" />
              <path d="M ${eye.cx - eye.r},${eye.cy - eye.r*0.5} L ${eye.cx + eye.r},${eye.cy - eye.r*0.1}" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
            `;
          } else if (expr === 'silly' && idx % 2 === 1) {
            pupilContent = `
              <path d="M ${eye.cx - eye.r*0.6},${eye.cy} Q ${eye.cx},${eye.cy - eye.r*0.5} ${eye.cx + eye.r*0.6},${eye.cy}" fill="none" stroke="#0f172a" stroke-width="4.5" stroke-linecap="round"/>
            `;
          }

          let browSvg = '';
          if (expr === 'angry') {
            const tilt = eye.cx < hx ? 12 : -12;
            browSvg = `<line x1="${eye.cx - eye.r}" y1="${eye.cy - eye.r - 4}" x2="${eye.cx + eye.r}" y2="${eye.cy - eye.r - 4 + tilt}" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>`;
          } else if (expr === 'surprised') {
            browSvg = `<path d="M ${eye.cx - eye.r*0.8},${eye.cy - eye.r - 8} Q ${eye.cx},${eye.cy - eye.r - 16} ${eye.cx + eye.r*0.8},${eye.cy - eye.r - 8}" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>`;
          }

          return `
            <g class="monster-single-eye eye-idx-${idx}">
              ${browSvg}
              <ellipse cx="${eye.cx}" cy="${eye.cy}" rx="${eye.r}" ry="${eye.r * 1.05}" fill="#ffffff" stroke="#0f172a" stroke-width="3.5" />
              ${pupilContent}
            </g>
          `;
        }).join('')}
      </g>
    `;

    // NOSE (Inside Head between Eyes and Mouth)
    const noseStyle = monster.noseStyle || 'small';
    let noseSvg = '';
    if (noseStyle !== 'none') {
      if (noseStyle === 'long') {
        noseSvg = `<path d="M ${hx - 5},${noseY - 6} Q ${hx},${noseY + 16} ${hx + 12},${noseY + 16} Q ${hx + 4},${noseY - 6} ${hx + 1},${noseY - 8} Z" fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="3.5"/>`;
      } else if (noseStyle === 'funny') {
        noseSvg = `
          <ellipse cx="${hx}" cy="${noseY}" rx="16" ry="11" fill="#ef4444" stroke="${pal.stroke}" stroke-width="3.5"/>
          <circle cx="${hx - 4}" cy="${noseY - 3}" r="3.5" fill="#ffffff" opacity="0.6"/>
        `;
      } else if (noseStyle === 'big' || noseStyle === 'round') {
        noseSvg = `
          <ellipse cx="${hx}" cy="${noseY}" rx="13" ry="9.5" fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="3.5"/>
          <ellipse cx="${hx - 3}" cy="${noseY - 2}" rx="3.5" ry="2" fill="#ffffff" opacity="0.6"/>
        `;
      } else { // small
        noseSvg = `
          <ellipse cx="${hx}" cy="${noseY}" rx="6.5" ry="4.5" fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="2.5"/>
          <circle cx="${hx - 2}" cy="${noseY - 1.5}" r="1.5" fill="#ffffff" opacity="0.6"/>
        `;
      }
    }

    // MOUTH & TEETH (Strictly in Lower Half of Head)
    const mouthType = monster.mouthType || (expr === 'scary' ? 'scary' : (expr === 'surprised' ? 'surprised' : (expr === 'angry' ? 'scary' : 'big')));
    const teethType = monster.teethType || 'sharp';

    let mouthCavity = '';
    let teethItems = '';

    if (expr === 'silly') {
      mouthCavity = `
        <path d="M ${hx - 32},${mouthY} Q ${hx},${mouthY + 30} ${hx + 32},${mouthY} Z" fill="#e11d48" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M ${hx - 10},${mouthY + 10} C ${hx - 12},${mouthY + 30} ${hx + 12},${mouthY + 30} ${hx + 10},${mouthY + 10} Z" fill="#fb7185" stroke="#0f172a" stroke-width="2.5"/>
      `;
    } else if (expr === 'surprised' || mouthType === 'surprised') {
      mouthCavity = `<ellipse cx="${hx}" cy="${mouthY + 4}" rx="16" ry="20" fill="#881337" stroke="#0f172a" stroke-width="4.5"/>`;
    } else if (mouthType === 'huge' || mouthType === 'big' || mouthType === 'smiling') {
      mouthCavity = `
        <path d="M ${hx - 40},${mouthY - 4} Q ${hx},${mouthY + 36} ${hx + 40},${mouthY - 4} Z" fill="#e11d48" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M ${hx - 20},${mouthY + 18} Q ${hx},${mouthY + 4} ${hx + 20},${mouthY + 18} Q ${hx},${mouthY + 36} ${hx - 20},${mouthY + 18} Z" fill="#fb7185"/>
      `;

      if (teethType === 'sharp' || teethType === 'vampire') {
        teethItems = `
          <polygon points="${hx - 24},${mouthY - 4} ${hx - 18},${mouthY + 10} ${hx - 12},${mouthY - 4}" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="${hx - 6},${mouthY - 4} ${hx},${mouthY + 14} ${hx + 6},${mouthY - 4}" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="${hx + 12},${mouthY - 4} ${hx + 18},${mouthY + 10} ${hx + 24},${mouthY - 4}" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
        `;
      } else if (teethType === 'giant') {
        teethItems = `<rect x="${hx - 8}" y="${mouthY - 4}" width="16" height="18" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>`;
      } else if (teethType === 'big') {
        teethItems = `
          <rect x="${hx - 10}" y="${mouthY - 4}" width="9" height="12" rx="2" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
          <rect x="${hx + 1}" y="${mouthY - 4}" width="9" height="12" rx="2" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
        `;
      } else if (teethType === 'small') {
        teethItems = `
          <circle cx="${hx - 20}" y="${mouthY}" r="3" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="${hx - 10}" y="${mouthY}" r="3" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="${hx}" y="${mouthY}" r="3" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="${hx + 10}" y="${mouthY}" r="3" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="${hx + 20}" y="${mouthY}" r="3" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
        `;
      }
    } else if (mouthType === 'scary' || expr === 'scary') {
      mouthCavity = `
        <path d="M ${hx - 44},${mouthY - 2} Q ${hx},${mouthY - 12} ${hx + 44},${mouthY - 2} Q ${hx + 34},${mouthY + 36} ${hx},${mouthY + 32} Q ${hx - 34},${mouthY + 36} ${hx - 44},${mouthY - 2} Z" 
              fill="#881337" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
      `;

      if (teethType === 'sharp' || teethType === 'vampire') {
        teethItems = `
          <polygon points="${hx - 36},${mouthY - 2} ${hx - 30},${mouthY + 14} ${hx - 24},${mouthY - 3}" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="${hx - 18},${mouthY - 5} ${hx - 11},${mouthY + 18} ${hx - 4},${mouthY - 6}" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="${hx + 4},${mouthY - 6} ${hx + 11},${mouthY + 18} ${hx + 18},${mouthY - 5}" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="${hx + 24},${mouthY - 3} ${hx + 30},${mouthY + 14} ${hx + 36},${mouthY - 2}" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
        `;
      } else if (teethType === 'giant') {
        teethItems = `<rect x="${hx - 9}" y="${mouthY - 5}" width="18" height="22" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>`;
      }
    } else { // small
      mouthCavity = `<path d="M ${hx - 18},${mouthY} Q ${hx},${mouthY + 18} ${hx + 18},${mouthY} Z" fill="#be123c" stroke="#0f172a" stroke-width="4" stroke-linejoin="round"/>`;
    }

    return `
      <g class="monster-face-features">
        ${eyesSvg}
        ${noseSvg}
        <g class="monster-mouth-group">
          ${mouthCavity}
          ${teethItems}
        </g>
      </g>
    `;
  }

  // ==========================================
  // 9. GLASSES & ACCESSORIES
  // ==========================================
  renderGlasses(monster, model) {
    if (!monster.accessories) return '';
    const hasGlasses = monster.accessories.includes('glasses');
    const hasSunglasses = monster.accessories.includes('sunglasses');
    if (!hasGlasses && !hasSunglasses) return '';

    const hx = model.head.cx;
    const hy = model.head.cy - (model.head.ry * 0.16);
    const lensFill = hasSunglasses ? '#0f172a' : 'rgba(255,255,255,0.35)';

    return `
      <g class="accessory-glasses" transform="translate(${hx}, ${hy})">
        <circle cx="-32" cy="0" r="23" fill="${lensFill}" stroke="#0f172a" stroke-width="6"/>
        <circle cx="32" cy="0" r="23" fill="${lensFill}" stroke="#0f172a" stroke-width="6"/>
        <path d="M -9,-2 Q 0,-8 9,-2" fill="none" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
      </g>
    `;
  }

  renderNeckAccessories(monster, model) {
    if (!monster.accessories || !Array.isArray(monster.accessories)) return '';
    const accColors = monster.accessoryColors || {};
    const hx = model.head.cx;
    const ny = model.neck.bottomY;
    let html = '';

    if (monster.accessories.includes('scarf')) {
      const scarfColor = this.getClothColor(accColors.scarf || 'red', '#dc2626');
      html += `
        <g class="accessory-scarf" transform="translate(${hx}, ${ny})">
          <path d="M -54,-8 Q 0,20 54,-8 Q 0,36 -54,-8 Z" fill="${scarfColor}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M 16,10 L 28,75 L 50,71 L 38,10 Z" fill="${scarfColor}" stroke="#0f172a" stroke-width="4" stroke-linejoin="round"/>
        </g>
      `;
    }

    if (monster.accessories.includes('bow')) {
      const bowColor = this.getClothColor(accColors.bow || 'pink', '#ec4899');
      html += `
        <g class="accessory-bow" transform="translate(${hx}, ${ny + 4})">
          <polygon points="0,0 -22,-12 -22,12" fill="${bowColor}" stroke="#0f172a" stroke-width="3.5"/>
          <polygon points="0,0 22,-12 22,12" fill="${bowColor}" stroke="#0f172a" stroke-width="3.5"/>
          <circle cx="0" cy="0" r="6.5" fill="#facc15" stroke="#0f172a" stroke-width="2.5"/>
        </g>
      `;
    }

    if (monster.accessories.includes('necklace')) {
      html += `
        <g class="accessory-necklace" transform="translate(${hx}, ${ny + 6})">
          <path d="M -40,-4 Q 0,28 40,-4" fill="none" stroke="#facc15" stroke-width="4"/>
          <circle cx="0" cy="16" r="6.5" fill="#ef4444" stroke="#78350f" stroke-width="2"/>
        </g>
      `;
    }

    return html;
  }

  renderCapeFront(monster, model) {
    const ny = model.neck.bottomY;
    return `
      <g class="monster-cape-front">
        <path d="M 134,${ny - 6} Q 200,${ny + 12} 266,${ny - 6}" fill="none" stroke="#be123c" stroke-width="7" stroke-linecap="round"/>
        <circle cx="200" cy="${ny + 4}" r="8" fill="#facc15" stroke="#ca8a04" stroke-width="3"/>
      </g>
    `;
  }

  renderHeadAccessories(monster, model) {
    if (!monster.accessories || !Array.isArray(monster.accessories)) return '';
    const accColors = monster.accessoryColors || {};
    const hx = model.head.cx;
    const hy = model.head.topY + 4;
    let html = '';

    if (monster.accessories.includes('crown')) {
      html += `
        <g class="accessory-crown" transform="translate(${hx}, ${hy})">
          <polygon points="-40,0 -36,-40 -15,-13 0,-46 15,-13 36,-40 40,0" 
                   fill="url(#goldGrad)" stroke="#78350f" stroke-width="3.5" stroke-linejoin="round"/>
          <rect x="-42" y="-2" width="84" height="10" rx="4" fill="#ca8a04" stroke="#78350f" stroke-width="2"/>
        </g>
      `;
    }

    if (monster.accessories.includes('wizard_hat')) {
      html += `
        <g class="accessory-wizard-hat" transform="translate(${hx}, ${hy})">
          <ellipse cx="0" cy="6" rx="65" ry="14" fill="#6d28d9" stroke="#0f172a" stroke-width="4"/>
          <path d="M -35,4 Q -10,-80 40,-85 Q 20,-30 35,4 Z" fill="#7c3aed" stroke="#0f172a" stroke-width="4"/>
          <polygon points="12,-45 15,-40 22,-40 17,-35 19,-28 12,-32 5,-28 7,-35 2,-40 9,-40" fill="#facc15"/>
        </g>
      `;
    } else if (monster.accessories.includes('pirate_hat')) {
      html += `
        <g class="accessory-pirate-hat" transform="translate(${hx}, ${hy + 4})">
          <path d="M -65,10 Q 0,-45 65,10 Q 0,0 -65,10 Z" fill="#0f172a" stroke="#ffffff" stroke-width="3"/>
          <circle cx="0" cy="-6" r="6" fill="#ffffff"/>
        </g>
      `;
    } else if (monster.accessories.includes('helmet')) {
      html += `
        <g class="accessory-helmet" transform="translate(${hx}, ${hy + 6})">
          <path d="M -50,15 C -50,-45 50,-45 50,15 Z" fill="#94a3b8" stroke="#0f172a" stroke-width="4"/>
          <polygon points="0,-45 8,-20 -8,-20" fill="#facc15"/>
        </g>
      `;
    } else if (monster.accessories.includes('hat')) {
      const hatColor = this.getClothColor(accColors.hat || 'yellow', '#eab308');
      html += `
        <g class="accessory-hat" transform="translate(${hx}, ${hy + 2})">
          <ellipse cx="0" cy="8" rx="58" ry="11" fill="${hatColor}" stroke="#0f172a" stroke-width="4"/>
          <path d="M -30,8 L -22,-56 L 22,-56 L 30,8 Z" fill="${hatColor}" stroke="#0f172a" stroke-width="4"/>
          <rect x="-30" y="-4" width="60" height="12" fill="#ef4444" stroke="#0f172a" stroke-width="2"/>
        </g>
      `;
    } else if (monster.accessories.includes('cap')) {
      const capColor = this.getClothColor(accColors.cap || 'blue', '#2563eb');
      html += `
        <g class="accessory-cap" transform="translate(${hx}, ${hy + 8})">
          <path d="M -42,8 C -42,-32 42,-32 42,8 Z" fill="${capColor}" stroke="#0f172a" stroke-width="4"/>
          <path d="M -42,6 Q -72,16 -66,24 Q -38,20 -14,8 Z" fill="${capColor}" stroke="#0f172a" stroke-width="3.5"/>
        </g>
      `;
    }

    return html;
  }

  // ==========================================
  // 10. POWER EFFECTS
  // ==========================================
  renderPowerAura(monster) {
    if (!monster.powers || monster.powers.length === 0) return '';
    if (monster.powers.includes('shoot_lightning')) {
      return `
        <g class="monster-power-fx">
          <path d="M 120,180 L 100,210 L 125,215 L 90,255" stroke="#facc15" stroke-width="4.5" fill="none" stroke-linecap="round"/>
          <path d="M 280,180 L 300,210 L 275,215 L 310,255" stroke="#facc15" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        </g>
      `;
    } else if (monster.powers.includes('breathe_fire')) {
      return `
        <g class="monster-power-fx">
          <path d="M 200,185 Q 235,200 260,175 Q 245,215 290,205 Q 250,230 200,195 Z" fill="#f97316" opacity="0.85"/>
          <circle cx="235" cy="195" r="7" fill="#fde047"/>
        </g>
      `;
    } else if (monster.powers.includes('make_ice')) {
      return `
        <g class="monster-power-fx">
          <polygon points="120,380 130,340 140,380" fill="#38bdf8" opacity="0.8"/>
          <polygon points="260,380 270,335 280,380" fill="#38bdf8" opacity="0.8"/>
        </g>
      `;
    }
    return '';
  }
}

window.monsterRenderer = new MonsterRenderer();
