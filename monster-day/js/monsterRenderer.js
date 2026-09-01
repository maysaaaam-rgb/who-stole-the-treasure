/**
 * monsterRenderer.js - Procedural Vector SVG Engine for "Build Your Own Monster!"
 * Renders layered cartoon monster illustrations dynamically with live animation support.
 */

class MonsterRenderer {
  constructor() {
    this.colorPalettes = {
      purple: { main: '#a855f7', belly: '#e9d5ff', dark: '#7e22ce', highlight: '#c084fc' },
      green:  { main: '#22c55e', belly: '#bbf7d0', dark: '#15803d', highlight: '#4ade80' },
      blue:   { main: '#38bdf8', belly: '#bae6fd', dark: '#0284c7', highlight: '#7dd3fc' },
      red:    { main: '#f43f5e', belly: '#fecdd3', dark: '#be123c', highlight: '#fb7185' },
      orange: { main: '#fb923c', belly: '#ffedd5', dark: '#c2410c', highlight: '#fdba74' },
      yellow: { main: '#eab308', belly: '#fef9c3', dark: '#a16207', highlight: '#fde047' },
      pink:   { main: '#ec4899', belly: '#fce7f3', dark: '#be185d', highlight: '#f472b6' }
    };

    this.clothingColors = {
      blue:   '#3b82f6',
      red:    '#ef4444',
      green:  '#10b981',
      yellow: '#f59e0b',
      purple: '#8b5cf6',
      orange: '#f97316',
      pink:   '#ec4899',
      black:  '#334155',
      white:  '#f8fafc'
    };
  }

  getPalette(colorName) {
    return this.colorPalettes[colorName] || this.colorPalettes.purple;
  }

  getClothColor(colorName, fallback = '#3b82f6') {
    return this.clothingColors[colorName] || colorName || fallback;
  }

  /**
   * Render complete SVG string from monster state
   */
  renderSvg(monster, options = {}) {
    const isAnimated = options.animated !== false;
    const pal = this.getPalette(monster.color);
    const width = options.width || 400;
    const height = options.height || 480;

    const layers = [
      this.renderBackdropShadow(),
      monster.specialCape ? this.renderCapeBack(monster) : '',
      (monster.accessories && monster.accessories.includes('backpack')) ? this.renderBackpackBack(monster) : '',
      this.renderLegs(monster, pal),
      this.renderBody(monster, pal),
      this.renderBottoms(monster),
      this.renderTops(monster),
      this.renderEars(monster, pal),
      this.renderArms(monster, pal),
      this.renderFace(monster, pal),
      this.renderAccessories(monster),
      monster.specialCape ? this.renderCapeFront(monster) : ''
    ];

    return `
      <svg class="monster-svg ${isAnimated ? 'animated-monster' : ''}" 
           viewBox="0 0 400 480" 
           width="${width}" 
           height="${height}" 
           xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="monster-shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="rgba(0,0,0,0.18)"/>
          </filter>
          <linearGradient id="bodyGrad_${monster.color}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${pal.highlight}"/>
            <stop offset="60%" stop-color="${pal.main}"/>
            <stop offset="100%" stop-color="${pal.dark}"/>
          </linearGradient>
          <linearGradient id="bellyGrad_${monster.color}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="100%" stop-color="${pal.belly}"/>
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fde047"/>
            <stop offset="50%" stop-color="#eab308"/>
            <stop offset="100%" stop-color="#ca8a04"/>
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

  renderBackdropShadow() {
    return `<ellipse cx="200" cy="445" rx="100" ry="18" fill="rgba(15, 23, 42, 0.14)" />`;
  }

  // ==========================================
  // CAPE & BACKPACK
  // ==========================================
  renderCapeBack(monster) {
    const capeColor = monster.specialCapeColor || 'red';
    const fill = capeColor === 'red' ? 'url(#capeGrad)' : this.getClothColor(capeColor, '#ef4444');
    return `
      <g class="monster-cape-back">
        <path d="M 140,190 Q 90,320 70,410 Q 200,435 330,410 Q 310,320 260,190 Z" 
              fill="${fill}" stroke="#881337" stroke-width="4" stroke-linejoin="round" />
        <path d="M 100,400 Q 140,380 180,415 Q 220,380 260,415 Q 300,380 320,400" 
              fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="3" />
      </g>
    `;
  }

  renderCapeFront(monster) {
    return `
      <g class="monster-cape-front">
        <path d="M 136,190 Q 200,215 264,190" fill="none" stroke="#be123c" stroke-width="8" stroke-linecap="round"/>
        <circle cx="200" cy="204" r="9" fill="#facc15" stroke="#ca8a04" stroke-width="3"/>
        <polygon points="200,198 202,203 207,204 203,207 205,212 200,209 195,212 197,207 193,204 198,203" fill="#ffffff" />
      </g>
    `;
  }

  renderBackpackBack(monster) {
    return `
      <g class="monster-backpack-back">
        <rect x="110" y="210" width="180" height="150" rx="35" fill="#10b981" stroke="#047857" stroke-width="5"/>
        <path d="M 130,230 L 270,230" stroke="#065f46" stroke-width="4" stroke-linecap="round"/>
        <rect x="135" y="260" width="130" height="70" rx="16" fill="#34d399" stroke="#047857" stroke-width="4"/>
        <circle cx="200" cy="275" r="5" fill="#047857"/>
      </g>
    `;
  }

  // ==========================================
  // LEGS & BOOTS
  // ==========================================
  renderLegs(monster, pal) {
    const count = monster.legsCount || 2;
    const hasBoots = !!monster.specialBoots;
    const bootColor = this.getClothColor(monster.specialBootsColor || 'yellow', '#f59e0b');

    let legConfigs = [];
    if (count === 2) {
      legConfigs = [
        { x: 155, y: 310, angle: -6 },
        { x: 245, y: 310, angle: 6 }
      ];
    } else if (count === 3) {
      legConfigs = [
        { x: 140, y: 305, angle: -14 },
        { x: 200, y: 315, angle: 0 },
        { x: 260, y: 305, angle: 14 }
      ];
    } else { // 4 legs
      legConfigs = [
        { x: 125, y: 305, angle: -18 },
        { x: 175, y: 315, angle: -6 },
        { x: 225, y: 315, angle: 6 },
        { x: 275, y: 305, angle: 18 }
      ];
    }

    return `
      <g class="monster-legs-group">
        ${legConfigs.map((cfg, idx) => `
          <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.angle})">
            <!-- Leg stem -->
            <rect x="-14" y="0" width="28" height="95" rx="14" fill="${pal.dark}" stroke="#1e293b" stroke-width="4"/>
            ${hasBoots ? `
              <!-- Special Boots -->
              <path d="M -18,60 L 22,60 L 26,85 Q 28,105 18,105 L -22,105 Q -26,95 -18,60 Z" 
                    fill="${bootColor}" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
              <ellipse cx="2" cy="100" rx="22" ry="9" fill="#1e293b"/>
              <rect x="-16" y="60" width="36" height="8" rx="3" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
            ` : `
              <!-- Monster Foot -->
              <ellipse cx="2" cy="92" rx="22" ry="12" fill="${pal.main}" stroke="#1e293b" stroke-width="4"/>
              <!-- Claws/Toes -->
              <circle cx="-10" cy="98" r="4" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
              <circle cx="2" cy="101" r="4" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
              <circle cx="14" cy="98" r="4" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
            `}
          </g>
        `).join('')}
      </g>
    `;
  }

  // ==========================================
  // BODY
  // ==========================================
  renderBody(monster, pal) {
    return `
      <g class="monster-body-group" filter="url(#monster-shadow)">
        <!-- Main Torso Blob -->
        <path d="M 130,160 C 100,210 90,300 120,345 C 150,380 250,380 280,345 C 310,300 300,210 270,160 C 240,115 160,115 130,160 Z" 
              fill="url(#bodyGrad_${monster.color})" 
              stroke="#1e293b" 
              stroke-width="5" 
              stroke-linejoin="round" />

        <!-- Cute Monster Belly Oval -->
        <ellipse cx="200" cy="275" rx="55" ry="60" 
                 fill="url(#bellyGrad_${monster.color})" 
                 stroke="${pal.dark}" 
                 stroke-width="3" 
                 opacity="0.9" />

        <!-- Cute belly spots / scales -->
        <circle cx="185" cy="245" r="5" fill="${pal.dark}" opacity="0.35"/>
        <circle cx="215" cy="255" r="4" fill="${pal.dark}" opacity="0.35"/>
        <circle cx="195" cy="285" r="6" fill="${pal.dark}" opacity="0.35"/>
      </g>
    `;
  }

  // ==========================================
  // CLOTHES: TOPS & BOTTOMS
  // ==========================================
  renderBottoms(monster) {
    if (!monster.clothesBottom || monster.clothesBottom === 'none') return '';
    const color = this.getClothColor(monster.clothesBottomColor, '#334155');

    if (monster.clothesBottom === 'trousers') {
      return `
        <g class="monster-clothing-bottoms">
          <path d="M 125,290 C 115,335 125,370 145,370 L 175,370 L 195,320 L 215,370 L 245,370 C 265,370 275,335 265,290 Z" 
                fill="${color}" stroke="#0f172a" stroke-width="4" stroke-linejoin="round"/>
          <line x1="195" y1="320" x2="195" y2="295" stroke="#0f172a" stroke-width="3"/>
          <rect x="185" y="287" width="20" height="6" fill="#facc15" stroke="#0f172a" stroke-width="2" rx="2"/>
        </g>
      `;
    } else if (monster.clothesBottom === 'shorts') {
      return `
        <g class="monster-clothing-bottoms">
          <path d="M 125,290 C 115,320 130,340 155,340 L 175,340 L 195,310 L 215,340 L 235,340 C 260,340 275,320 265,290 Z" 
                fill="${color}" stroke="#0f172a" stroke-width="4" stroke-linejoin="round"/>
          <circle cx="150" cy="315" r="3" fill="#ffffff" opacity="0.4"/>
          <circle cx="240" cy="315" r="3" fill="#ffffff" opacity="0.4"/>
        </g>
      `;
    } else if (monster.clothesBottom === 'dress') {
      return `
        <g class="monster-clothing-bottoms">
          <path d="M 140,240 Q 95,355 105,365 Q 200,380 295,365 Q 305,355 260,240 Z" 
                fill="${color}" stroke="#0f172a" stroke-width="4" stroke-linejoin="round"/>
          <path d="M 115,355 Q 135,340 155,355 Q 175,340 195,355 Q 215,340 235,355 Q 255,340 275,355" 
                fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
          <ellipse cx="200" cy="245" rx="55" ry="8" fill="#ffffff" opacity="0.5"/>
        </g>
      `;
    }
    return '';
  }

  renderTops(monster) {
    if (!monster.clothesTop || monster.clothesTop === 'none') return '';
    const color = this.getClothColor(monster.clothesTopColor, '#3b82f6');

    if (monster.clothesTop === 'tshirt') {
      return `
        <g class="monster-clothing-tops">
          <path d="M 140,195 Q 200,215 260,195 L 290,245 L 265,255 L 255,300 L 145,300 L 135,255 L 110,245 Z" 
                fill="${color}" stroke="#0f172a" stroke-width="4" stroke-linejoin="round"/>
          <path d="M 175,198 Q 200,220 225,198" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
          <!-- Star emblem on chest -->
          <polygon points="200,232 203,240 211,241 205,246 207,254 200,250 193,254 195,246 189,241 197,240" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
        </g>
      `;
    } else if (monster.clothesTop === 'shirt') {
      return `
        <g class="monster-clothing-tops">
          <path d="M 140,195 L 260,195 L 290,245 L 265,255 L 255,300 L 145,300 L 135,255 L 110,245 Z" 
                fill="${color}" stroke="#0f172a" stroke-width="4" stroke-linejoin="round"/>
          <!-- Collar -->
          <polygon points="175,195 200,218 190,195" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
          <polygon points="225,195 200,218 210,195" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
          <line x1="200" y1="218" x2="200" y2="300" stroke="#0f172a" stroke-width="3"/>
          <circle cx="200" cy="235" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <circle cx="200" cy="255" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <circle cx="200" cy="275" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
        </g>
      `;
    } else if (monster.clothesTop === 'jacket') {
      return `
        <g class="monster-clothing-tops">
          <path d="M 135,195 L 265,195 L 295,250 L 268,260 L 258,305 L 142,305 L 132,260 L 105,250 Z" 
                fill="${color}" stroke="#0f172a" stroke-width="4" stroke-linejoin="round"/>
          <!-- Open zipper lining -->
          <path d="M 175,195 L 188,305" stroke="#0f172a" stroke-width="4"/>
          <path d="M 225,195 L 212,305" stroke="#0f172a" stroke-width="4"/>
          <polygon points="175,195 188,235 160,205" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
          <polygon points="225,195 212,235 240,205" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
          <!-- Pockets -->
          <rect x="145" y="270" width="22" height="15" rx="3" fill="none" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="233" y="270" width="22" height="15" rx="3" fill="none" stroke="#0f172a" stroke-width="2.5"/>
        </g>
      `;
    }
    return '';
  }

  // ==========================================
  // EARS
  // ==========================================
  renderEars(monster, pal) {
    const count = monster.earsCount || 2;
    const length = monster.earsLength || 'long';

    if (length === 'long') {
      // Tall floppy / bunny monster ears
      if (count === 1) {
        return `
          <g class="monster-ears-group">
            <g transform="translate(135, 135) rotate(-25)">
              <path d="M 0,0 C -25,-60 15,-100 20,-95 C 25,-60 20,-20 0,0 Z" 
                    fill="${pal.main}" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
              <path d="M 5,-15 C -8,-50 12,-75 14,-75 C 16,-50 15,-20 5,-15 Z" 
                    fill="${pal.belly}" stroke="${pal.dark}" stroke-width="2"/>
            </g>
          </g>
        `;
      } else {
        return `
          <g class="monster-ears-group">
            <!-- Left Long Ear -->
            <g transform="translate(135, 135) rotate(-28)">
              <path d="M 0,0 C -25,-65 15,-105 20,-100 C 25,-65 20,-20 0,0 Z" 
                    fill="${pal.main}" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
              <path d="M 5,-15 C -8,-55 12,-80 14,-80 C 16,-55 15,-20 5,-15 Z" 
                    fill="${pal.belly}" stroke="${pal.dark}" stroke-width="2"/>
            </g>
            <!-- Right Long Ear -->
            <g transform="translate(265, 135) rotate(28)">
              <path d="M 0,0 C 25,-65 -15,-105 -20,-100 C -25,-65 -20,-20 0,0 Z" 
                    fill="${pal.main}" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
              <path d="M -5,-15 C 8,-55 -12,-80 -14,-80 C -16,-55 -15,-20 -5,-15 Z" 
                    fill="${pal.belly}" stroke="${pal.dark}" stroke-width="2"/>
            </g>
          </g>
        `;
      }
    } else {
      // Short cute bear/horn monster ears
      if (count === 1) {
        return `
          <g class="monster-ears-group">
            <ellipse cx="130" cy="140" rx="20" ry="24" transform="rotate(-30 130 140)" 
                     fill="${pal.main}" stroke="#1e293b" stroke-width="4"/>
            <ellipse cx="130" cy="140" rx="10" ry="12" transform="rotate(-30 130 140)" 
                     fill="${pal.belly}"/>
          </g>
        `;
      } else {
        return `
          <g class="monster-ears-group">
            <!-- Left Short Ear -->
            <ellipse cx="130" cy="140" rx="20" ry="24" transform="rotate(-30 130 140)" 
                     fill="${pal.main}" stroke="#1e293b" stroke-width="4"/>
            <ellipse cx="130" cy="140" rx="10" ry="12" transform="rotate(-30 130 140)" 
                     fill="${pal.belly}"/>
            <!-- Right Short Ear -->
            <ellipse cx="270" cy="140" rx="20" ry="24" transform="rotate(30 270 140)" 
                     fill="${pal.main}" stroke="#1e293b" stroke-width="4"/>
            <ellipse cx="270" cy="140" rx="10" ry="12" transform="rotate(30 270 140)" 
                     fill="${pal.belly}"/>
          </g>
        `;
      }
    }
  }

  // ==========================================
  // ARMS & GLOVES
  // ==========================================
  renderArms(monster, pal) {
    const count = monster.armsCount || 2; // 2, 3, 'many' (4)
    const length = monster.armsLength || 'short';
    const hasGloves = !!monster.specialGloves;
    const gloveColor = this.getClothColor(monster.specialGlovesColor || 'green', '#10b981');

    const armLen = length === 'long' ? 1.4 : 1.0;

    let armConfigs = [];
    if (count === 2) {
      armConfigs = [
        { side: 'left',  x: 120, y: 225, rot: -30, flip: false },
        { side: 'right', x: 280, y: 225, rot: 30,  flip: true }
      ];
    } else if (count === 3) {
      armConfigs = [
        { side: 'left',  x: 120, y: 205, rot: -45, flip: false },
        { side: 'left',  x: 125, y: 260, rot: -15, flip: false },
        { side: 'right', x: 280, y: 225, rot: 35,  flip: true }
      ];
    } else { // 'many' (4 arms)
      armConfigs = [
        { side: 'left',  x: 120, y: 195, rot: -50, flip: false },
        { side: 'left',  x: 125, y: 265, rot: -10, flip: false },
        { side: 'right', x: 280, y: 195, rot: 50,  flip: true },
        { side: 'right', x: 275, y: 265, rot: 10,  flip: true }
      ];
    }

    return `
      <g class="monster-arms-group">
        ${armConfigs.map((cfg) => {
          const dir = cfg.flip ? -1 : 1;
          const hX = cfg.flip ? 65 * armLen : -65 * armLen;
          const hY = -30 * armLen;
          return `
            <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.rot})">
              <!-- Arm limb -->
              <path d="M 0,0 Q ${hX * 0.5},${hY + 15} ${hX},${hY}" 
                    fill="none" stroke="${pal.main}" stroke-width="22" stroke-linecap="round"/>
              <path d="M 0,0 Q ${hX * 0.5},${hY + 15} ${hX},${hY}" 
                    fill="none" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
              
              <!-- Hand / Glove -->
              <g transform="translate(${hX}, ${hY})">
                ${hasGloves ? `
                  <circle cx="0" cy="0" r="16" fill="${gloveColor}" stroke="#1e293b" stroke-width="3.5"/>
                  <circle cx="${dir * -6}" cy="-10" r="7" fill="${gloveColor}" stroke="#1e293b" stroke-width="2"/>
                  <rect x="-12" y="8" width="24" height="6" rx="3" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
                ` : `
                  <circle cx="0" cy="0" r="14" fill="${pal.main}" stroke="#1e293b" stroke-width="3.5"/>
                  <circle cx="${dir * -5}" cy="-8" r="5" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
                  <circle cx="${dir * 5}" cy="-8" r="5" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
                `}
              </g>
            </g>
          `;
        }).join('')}
      </g>
    `;
  }

  // ==========================================
  // FACE (EYES, NOSE, MOUTH, TEETH)
  // ==========================================
  renderFace(monster, pal) {
    return `
      <g class="monster-face-group">
        ${this.renderEyes(monster)}
        ${this.renderNose(monster, pal)}
        ${this.renderMouthAndTeeth(monster)}
      </g>
    `;
  }

  renderEyes(monster) {
    const count = monster.eyesCount || 2; // 1, 2, 3
    const size = monster.eyesSize || 'big'; // 'big', 'small'
    const r = size === 'big' ? 24 : 15;
    const pupilR = size === 'big' ? 12 : 7;
    const sparkleR = size === 'big' ? 4.5 : 2.5;

    let eyePositions = [];
    if (count === 1) {
      eyePositions = [{ cx: 200, cy: 175, r: size === 'big' ? 30 : 18 }];
    } else if (count === 2) {
      eyePositions = [
        { cx: 165, cy: 175, r: r },
        { cx: 235, cy: 175, r: r }
      ];
    } else { // 3 eyes
      eyePositions = [
        { cx: 150, cy: 182, r: r * 0.9 },
        { cx: 200, cy: 158, r: r * 0.95 },
        { cx: 250, cy: 182, r: r * 0.9 }
      ];
    }

    return `
      <g class="monster-eyes-group">
        ${eyePositions.map((eye, idx) => `
          <g class="monster-single-eye eye-idx-${idx}">
            <!-- Sclera (Eye white) -->
            <ellipse cx="${eye.cx}" cy="${eye.cy}" rx="${eye.r}" ry="${eye.r * 1.05}" 
                     fill="#ffffff" stroke="#1e293b" stroke-width="3.5" />
            <!-- Iris & Pupil -->
            <circle cx="${eye.cx}" cy="${eye.cy + 2}" r="${eye.r * 0.55}" fill="#0284c7" />
            <circle cx="${eye.cx}" cy="${eye.cy + 2}" r="${eye.r * 0.4}" fill="#0f172a" />
            <!-- Glossy sparkle highlights -->
            <circle cx="${eye.cx - eye.r * 0.2}" cy="${eye.cy - eye.r * 0.2}" r="${eye.r * 0.2}" fill="#ffffff" />
            <circle cx="${eye.cx + eye.r * 0.22}" cy="${eye.cy + eye.r * 0.22}" r="${eye.r * 0.1}" fill="#ffffff" />
            <!-- Eyelid / brow detail -->
            <path d="M ${eye.cx - eye.r},${eye.cy - eye.r * 0.8} Q ${eye.cx},${eye.cy - eye.r * 1.3} ${eye.cx + eye.r},${eye.cy - eye.r * 0.8}" 
                  fill="none" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
          </g>
        `).join('')}
      </g>
    `;
  }

  renderNose(monster, pal) {
    const size = monster.noseSize || 'small';
    if (size === 'big') {
      return `
        <g class="monster-nose-group">
          <!-- Big round cheerful schnoz -->
          <ellipse cx="200" cy="214" rx="20" ry="15" fill="${pal.dark}" stroke="#1e293b" stroke-width="3.5"/>
          <ellipse cx="194" cy="210" rx="6" ry="4" fill="#ffffff" opacity="0.6"/>
        </g>
      `;
    } else {
      return `
        <g class="monster-nose-group">
          <!-- Small cute button nose -->
          <ellipse cx="200" cy="208" rx="8" ry="6" fill="${pal.dark}" stroke="#1e293b" stroke-width="3"/>
          <circle cx="198" cy="206" r="2" fill="#ffffff" opacity="0.6"/>
        </g>
      `;
    }
  }

  renderMouthAndTeeth(monster) {
    const mouthType = monster.mouthType || 'big'; // 'big', 'small', 'scary'
    const teethType = monster.teethType || 'sharp'; // 'sharp', 'big', 'small', 'none'

    let mouthPath = '';
    let mouthInside = '';
    let teethContent = '';

    if (mouthType === 'big') {
      mouthPath = 'M 150,230 Q 200,285 250,230 Z';
      mouthInside = `
        <path d="${mouthPath}" fill="#e11d48" stroke="#1e293b" stroke-width="4"/>
        <!-- Big pink tongue -->
        <path d="M 175,260 Q 200,235 225,260 Q 200,285 175,260 Z" fill="#fb7185"/>
      `;
      if (teethType === 'sharp') {
        teethContent = `
          <!-- Top sharp teeth -->
          <polygon points="170,230 178,245 186,230" fill="#ffffff" stroke="#1e293b" stroke-width="1.5"/>
          <polygon points="192,230 200,248 208,230" fill="#ffffff" stroke="#1e293b" stroke-width="1.5"/>
          <polygon points="214,230 222,245 230,230" fill="#ffffff" stroke="#1e293b" stroke-width="1.5"/>
          <!-- Bottom sharp fangs -->
          <polygon points="180,265 188,252 196,265" fill="#ffffff" stroke="#1e293b" stroke-width="1.5"/>
          <polygon points="204,265 212,252 220,265" fill="#ffffff" stroke="#1e293b" stroke-width="1.5"/>
        `;
      } else if (teethType === 'big') {
        teethContent = `
          <!-- Big buck teeth -->
          <rect x="187" y="230" width="12" height="15" rx="3" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
          <rect x="201" y="230" width="12" height="15" rx="3" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
        `;
      } else if (teethType === 'small') {
        teethContent = `
          <!-- Row of small cute teeth -->
          <circle cx="175" cy="233" r="4" fill="#ffffff" stroke="#1e293b" stroke-width="1"/>
          <circle cx="185" cy="233" r="4" fill="#ffffff" stroke="#1e293b" stroke-width="1"/>
          <circle cx="195" cy="233" r="4" fill="#ffffff" stroke="#1e293b" stroke-width="1"/>
          <circle cx="205" cy="233" r="4" fill="#ffffff" stroke="#1e293b" stroke-width="1"/>
          <circle cx="215" cy="233" r="4" fill="#ffffff" stroke="#1e293b" stroke-width="1"/>
          <circle cx="225" cy="233" r="4" fill="#ffffff" stroke="#1e293b" stroke-width="1"/>
        `;
      }
    } else if (mouthType === 'small') {
      mouthPath = 'M 175,235 Q 200,260 225,235 Z';
      mouthInside = `
        <path d="${mouthPath}" fill="#be123c" stroke="#1e293b" stroke-width="3.5"/>
        <path d="M 188,248 Q 200,240 212,248 Q 200,258 188,248 Z" fill="#fb7185"/>
      `;
      if (teethType === 'sharp') {
        teethContent = `
          <polygon points="190,235 195,244 200,235" fill="#ffffff" stroke="#1e293b" stroke-width="1"/>
          <polygon points="200,235 205,244 210,235" fill="#ffffff" stroke="#1e293b" stroke-width="1"/>
        `;
      } else if (teethType === 'big') {
        teethContent = `
          <rect x="194" y="235" width="6" height="8" rx="2" fill="#ffffff" stroke="#1e293b" stroke-width="1"/>
          <rect x="200" y="235" width="6" height="8" rx="2" fill="#ffffff" stroke="#1e293b" stroke-width="1"/>
        `;
      } else if (teethType === 'small') {
        teethContent = `
          <circle cx="193" cy="237" r="2.5" fill="#ffffff" stroke="#1e293b" stroke-width="1"/>
          <circle cx="200" cy="237" r="2.5" fill="#ffffff" stroke="#1e293b" stroke-width="1"/>
          <circle cx="207" cy="237" r="2.5" fill="#ffffff" stroke="#1e293b" stroke-width="1"/>
        `;
      }
    } else { // 'scary'
      mouthPath = 'M 140,235 Q 200,220 260,235 Q 240,285 200,280 Q 160,285 140,235 Z';
      mouthInside = `
        <path d="${mouthPath}" fill="#881337" stroke="#1e293b" stroke-width="4.5"/>
      `;
      if (teethType === 'sharp') {
        teethContent = `
          <!-- Menacing sharp fangs -->
          <polygon points="150,233 160,255 170,232" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
          <polygon points="175,230 185,260 195,229" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
          <polygon points="205,229 215,260 225,230" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
          <polygon points="230,232 240,255 250,233" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
          <!-- Bottom row fangs -->
          <polygon points="160,270 170,248 180,270" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
          <polygon points="190,273 200,245 210,273" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
          <polygon points="220,270 230,248 240,270" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
        `;
      } else if (teethType === 'big') {
        teethContent = `
          <rect x="180" y="230" width="18" height="22" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
          <rect x="202" y="230" width="18" height="22" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
        `;
      } else if (teethType === 'small') {
        teethContent = `
          <polygon points="152,234 158,245 164,234" fill="#ffffff" stroke="#1e293b" stroke-width="1.5"/>
          <polygon points="168,232 174,245 180,232" fill="#ffffff" stroke="#1e293b" stroke-width="1.5"/>
          <polygon points="184,230 190,245 196,230" fill="#ffffff" stroke="#1e293b" stroke-width="1.5"/>
          <polygon points="204,230 210,245 216,230" fill="#ffffff" stroke="#1e293b" stroke-width="1.5"/>
          <polygon points="220,232 226,245 232,232" fill="#ffffff" stroke="#1e293b" stroke-width="1.5"/>
          <polygon points="236,234 242,245 248,234" fill="#ffffff" stroke="#1e293b" stroke-width="1.5"/>
        `;
      }
    }

    return `
      <g class="monster-mouth-group">
        ${mouthInside}
        ${teethContent}
      </g>
    `;
  }

  // ==========================================
  // ACCESSORIES (HATS, CROWNS, GLASSES, SCARF, BOW)
  // ==========================================
  renderAccessories(monster) {
    if (!monster.accessories || !Array.isArray(monster.accessories)) return '';

    return `
      <g class="monster-accessories-group">
        ${monster.accessories.map(acc => this.renderSingleAccessory(acc, monster)).join('\n')}
      </g>
    `;
  }

  renderSingleAccessory(accName, monster) {
    const accColors = monster.accessoryColors || {};

    switch (accName) {
      case 'crown':
        return `
          <g class="accessory-crown" transform="translate(200, 115)">
            <polygon points="-45,0 -40,-45 -18,-15 0,-50 18,-15 40,-45 45,0" 
                     fill="url(#goldGrad)" stroke="#78350f" stroke-width="3.5" stroke-linejoin="round"/>
            <rect x="-48" y="-2" width="96" height="12" rx="4" fill="#ca8a04" stroke="#78350f" stroke-width="2"/>
            <!-- Crown jewels -->
            <circle cx="0" cy="-35" r="5" fill="#ef4444" stroke="#78350f" stroke-width="1.5"/>
            <circle cx="-35" cy="-32" r="4.5" fill="#3b82f6" stroke="#78350f" stroke-width="1.5"/>
            <circle cx="35" cy="-32" r="4.5" fill="#10b981" stroke="#78350f" stroke-width="1.5"/>
          </g>
        `;

      case 'hat':
        const hatColor = this.getClothColor(accColors.hat || 'yellow', '#facc15');
        return `
          <g class="accessory-hat" transform="translate(200, 110)">
            <ellipse cx="0" cy="15" rx="65" ry="12" fill="${hatColor}" stroke="#1e293b" stroke-width="4"/>
            <path d="M -35,12 L -25,-60 L 25,-60 L 35,12 Z" fill="${hatColor}" stroke="#1e293b" stroke-width="4"/>
            <rect x="-35" y="0" width="70" height="14" fill="#ef4444" stroke="#1e293b" stroke-width="2"/>
          </g>
        `;

      case 'cap':
        const capColor = this.getClothColor(accColors.cap || 'blue', '#3b82f6');
        return `
          <g class="accessory-cap" transform="translate(200, 120)">
            <!-- Cap Dome -->
            <path d="M -45,10 C -45,-35 45,-35 45,10 Z" fill="${capColor}" stroke="#1e293b" stroke-width="4"/>
            <!-- Cap Visor / Bill -->
            <path d="M -45,8 Q -75,18 -70,28 Q -40,24 -15,10 Z" fill="${capColor}" stroke="#1e293b" stroke-width="3.5"/>
            <circle cx="0" cy="-32" r="4" fill="#facc15" stroke="#1e293b" stroke-width="1.5"/>
          </g>
        `;

      case 'glasses':
        return `
          <g class="accessory-glasses" transform="translate(200, 175)">
            <!-- Left Frame -->
            <circle cx="-35" cy="0" r="24" fill="rgba(255,255,255,0.4)" stroke="#0f172a" stroke-width="6"/>
            <!-- Right Frame -->
            <circle cx="35" cy="0" r="24" fill="rgba(255,255,255,0.4)" stroke="#0f172a" stroke-width="6"/>
            <!-- Bridge -->
            <path d="M -11,-2 Q 0,-8 11,-2" fill="none" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
            <!-- Lens Glare -->
            <line x1="-45" y1="-10" x2="-25" y2="10" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="25" y1="-10" x2="45" y2="10" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
          </g>
        `;

      case 'scarf':
        const scarfColor = this.getClothColor(accColors.scarf || 'red', '#ef4444');
        return `
          <g class="accessory-scarf" transform="translate(200, 205)">
            <!-- Cozy loop around neck -->
            <path d="M -60,-10 Q 0,25 60,-10 Q 0,40 -60,-10 Z" 
                  fill="${scarfColor}" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
            <!-- Scarf tail hanging down -->
            <path d="M 20,15 L 35,90 L 58,85 L 45,15 Z" 
                  fill="${scarfColor}" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
            <!-- Stripes -->
            <line x1="25" y1="35" x2="48" y2="35" stroke="#ffffff" stroke-width="5"/>
            <line x1="28" y1="55" x2="52" y2="55" stroke="#ffffff" stroke-width="5"/>
            <line x1="32" y1="75" x2="55" y2="75" stroke="#ffffff" stroke-width="5"/>
          </g>
        `;

      case 'bow':
        const bowColor = this.getClothColor(accColors.bow || 'pink', '#ec4899');
        return `
          <g class="accessory-bow" transform="translate(200, 210)">
            <!-- Left Wing -->
            <polygon points="0,0 -26,-15 -26,15" fill="${bowColor}" stroke="#1e293b" stroke-width="3.5"/>
            <!-- Right Wing -->
            <polygon points="0,0 26,-15 26,15" fill="${bowColor}" stroke="#1e293b" stroke-width="3.5"/>
            <!-- Center Knot -->
            <circle cx="0" cy="0" r="7" fill="#facc15" stroke="#1e293b" stroke-width="2.5"/>
          </g>
        `;

      default:
        return '';
    }
  }
}

window.monsterRenderer = new MonsterRenderer();
