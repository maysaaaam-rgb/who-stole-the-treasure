/**
 * monsterRenderer.js - High-Fidelity Procedural Vector SVG Engine
 * "Build Your Own Monster!"
 * Supports 10 Body Shapes, Wings, Tails, Horns, 8 Eye Styles, Patterns,
 * Clothes, Accessories, Powers, and Anatomically Integrated Layering.
 */

class MonsterRenderer {
  constructor() {
    this.colorPalettes = {
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
  }

  getPalette(colorName) {
    return this.colorPalettes[colorName] || this.colorPalettes.purple;
  }

  getClothColor(colorName, fallback = '#2563eb') {
    return this.clothingColors[colorName] || colorName || fallback;
  }

  renderSvg(monster, options = {}) {
    const isAnimated = options.animated !== false;
    const pal = this.getPalette(monster.color);
    const secPal = this.getPalette(monster.secondaryColor || monster.color);
    const width = options.width || 400;
    const height = options.height || 480;

    const layers = [
      this.renderBackdropShadow(monster),
      this.renderSpecialWings(monster),
      this.renderSpecialTail(monster, pal),
      monster.specialCape ? this.renderCapeBack(monster) : '',
      (monster.accessories && monster.accessories.includes('backpack')) ? this.renderBackpackBack(monster) : '',
      this.renderSpecialExtrasBack(monster, pal),
      this.renderEars(monster, pal),
      this.renderHorns(monster, pal),
      this.renderLegsAndFeet(monster, pal),
      this.renderBodyBase(monster, pal, secPal),
      this.renderPatternOverlay(monster, secPal),
      this.renderBottoms(monster),
      this.renderTops(monster),
      this.renderSpecialSuits(monster),
      this.renderArmsAndHands(monster, pal),
      this.renderEyes(monster),
      this.renderGlasses(monster),
      this.renderNose(monster, pal),
      this.renderMouthAndTeeth(monster),
      this.renderNeckAccessories(monster),
      monster.specialCape ? this.renderCapeFront(monster) : '',
      this.renderHeadAccessories(monster),
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
          <radialGradient id="powerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8"/>
            <stop offset="60%" stop-color="#818cf8" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#c084fc" stop-opacity="0"/>
          </radialGradient>
        </defs>
        ${layers.join('\n')}
      </svg>
    `;
  }

  // 1. Shadow Base
  renderBackdropShadow(monster) {
    if (monster.bodyShape === 'ghost') {
      return `<ellipse cx="200" cy="445" rx="70" ry="12" fill="rgba(15, 23, 42, 0.08)" />`;
    }
    return `<ellipse cx="200" cy="445" rx="105" ry="18" fill="rgba(15, 23, 42, 0.16)" />`;
  }

  // 2. Wings (Behind character body)
  renderSpecialWings(monster) {
    const wings = monster.specialWings;
    if (!wings || wings === 'none') return '';

    if (wings === 'dragon') {
      return `
        <g class="monster-wings-group dragon-wings">
          <!-- Left Dragon Wing -->
          <path d="M 140,190 Q 60,110 30,150 Q 80,190 40,240 Q 110,230 145,225 Z" 
                fill="#f97316" stroke="#c2410c" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M 140,190 L 30,150 M 140,205 L 40,240" stroke="#7c2d12" stroke-width="3"/>
          <!-- Right Dragon Wing -->
          <path d="M 260,190 Q 340,110 370,150 Q 320,190 360,240 Q 290,230 255,225 Z" 
                fill="#f97316" stroke="#c2410c" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M 260,190 L 370,150 M 260,205 L 360,240" stroke="#7c2d12" stroke-width="3"/>
        </g>
      `;
    } else if (wings === 'butterfly') {
      return `
        <g class="monster-wings-group butterfly-wings">
          <!-- Left Butterfly Wing -->
          <path d="M 145,210 C 60,120 20,200 70,250 C 30,290 80,340 145,260 Z" 
                fill="#ec4899" stroke="#be185d" stroke-width="4.5" stroke-linejoin="round"/>
          <circle cx="75" cy="205" r="14" fill="#fef08a" opacity="0.8"/>
          <circle cx="85" cy="285" r="10" fill="#38bdf8" opacity="0.8"/>
          <!-- Right Butterfly Wing -->
          <path d="M 255,210 C 340,120 380,200 330,250 C 370,290 320,340 255,260 Z" 
                fill="#ec4899" stroke="#be185d" stroke-width="4.5" stroke-linejoin="round"/>
          <circle cx="325" cy="205" r="14" fill="#fef08a" opacity="0.8"/>
          <circle cx="315" cy="285" r="10" fill="#38bdf8" opacity="0.8"/>
        </g>
      `;
    } else if (wings === 'bat') {
      return `
        <g class="monster-wings-group bat-wings">
          <!-- Left Bat Wing -->
          <path d="M 140,205 Q 60,140 25,185 Q 65,220 50,255 Q 95,255 100,285 Q 130,265 145,230 Z" 
                fill="#334155" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          <!-- Right Bat Wing -->
          <path d="M 260,205 Q 340,140 375,185 Q 335,220 350,255 Q 305,255 300,285 Q 270,265 255,230 Z" 
                fill="#334155" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
        </g>
      `;
    }
    return '';
  }

  // 3. Tails
  renderSpecialTail(monster, pal) {
    const tail = monster.specialTail;
    if (!tail || tail === 'none') return '';

    if (tail === 'long') {
      return `
        <g class="monster-tail-group long-tail">
          <path d="M 135,330 C 70,330 30,280 45,230 C 52,205 75,215 65,240 C 55,270 85,310 145,345 Z" 
                fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
          <circle cx="48" cy="225" r="9" fill="${pal.highlight}"/>
        </g>
      `;
    } else if (tail === 'curly') {
      return `
        <g class="monster-tail-group curly-tail">
          <path d="M 135,335 C 70,350 40,310 65,270 C 85,240 120,270 95,290 C 80,300 70,330 140,348 Z" 
                fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
        </g>
      `;
    } else if (tail === 'dinosaur') {
      return `
        <g class="monster-tail-group dino-tail">
          <path d="M 135,320 C 60,320 20,380 10,400 C 40,390 90,375 145,355 Z" 
                fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
          <!-- Dorsal Spikes -->
          <polygon points="120,324 110,305 102,328" fill="#facc15" stroke="${pal.stroke}" stroke-width="2"/>
          <polygon points="85,338 72,320 68,348" fill="#facc15" stroke="${pal.stroke}" stroke-width="2"/>
          <polygon points="48,362 32,345 35,375" fill="#facc15" stroke="${pal.stroke}" stroke-width="2"/>
        </g>
      `;
    } else if (tail === 'snake') {
      return `
        <g class="monster-tail-group snake-tail">
          <path d="M 135,335 Q 70,360 50,330 Q 30,300 65,260 Q 90,230 75,200 Q 60,180 85,175" 
                fill="none" stroke="${pal.main}" stroke-width="16" stroke-linecap="round"/>
          <path d="M 135,335 Q 70,360 50,330 Q 30,300 65,260 Q 90,230 75,200 Q 60,180 85,175" 
                fill="none" stroke="${pal.stroke}" stroke-width="4.5" stroke-linecap="round"/>
        </g>
      `;
    } else if (tail === 'bunny') {
      return `
        <g class="monster-tail-group bunny-tail">
          <circle cx="118" cy="335" r="18" fill="#ffffff" stroke="${pal.stroke}" stroke-width="4"/>
          <circle cx="115" cy="332" r="12" fill="#f1f5f9"/>
        </g>
      `;
    }
    return '';
  }

  // 4. Cape Back
  renderCapeBack(monster) {
    const capeColor = monster.specialCapeColor || 'red';
    const fill = capeColor === 'red' ? 'url(#capeGrad)' : this.getClothColor(capeColor, '#ef4444');
    return `
      <g class="monster-cape-back">
        <path d="M 130,205 Q 80,330 65,415 Q 200,445 335,415 Q 320,330 270,205 Z" 
              fill="${fill}" stroke="#881337" stroke-width="4.5" stroke-linejoin="round" />
        <path d="M 95,405 Q 135,385 175,418 Q 225,385 265,418 Q 305,385 325,405" 
              fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="3" stroke-linecap="round"/>
      </g>
    `;
  }

  // 5. Backpack Back
  renderBackpackBack(monster) {
    return `
      <g class="monster-backpack-back">
        <rect x="110" y="215" width="180" height="135" rx="30" fill="#10b981" stroke="#065f46" stroke-width="5"/>
        <path d="M 130,235 L 270,235" stroke="#065f46" stroke-width="4" stroke-linecap="round"/>
        <rect x="140" y="260" width="120" height="65" rx="16" fill="#34d399" stroke="#065f46" stroke-width="4"/>
        <circle cx="200" cy="275" r="5" fill="#065f46"/>
      </g>
    `;
  }

  // 6. Special Extras (Spikes, Shell, Fins, Tentacles)
  renderSpecialExtrasBack(monster, pal) {
    if (!monster.specialParts || !Array.isArray(monster.specialParts)) return '';
    let html = '';

    if (monster.specialParts.includes('spikes')) {
      html += `
        <g class="monster-spikes">
          <polygon points="175,100 160,65 185,95" fill="#facc15" stroke="${pal.stroke}" stroke-width="2.5"/>
          <polygon points="200,95 200,55 210,95" fill="#facc15" stroke="${pal.stroke}" stroke-width="2.5"/>
          <polygon points="225,100 240,65 215,95" fill="#facc15" stroke="${pal.stroke}" stroke-width="2.5"/>
        </g>
      `;
    }

    if (monster.specialParts.includes('fins')) {
      html += `
        <g class="monster-fins">
          <path d="M 125,160 Q 80,140 75,180 Q 105,185 125,175 Z" fill="#38bdf8" stroke="${pal.stroke}" stroke-width="3"/>
          <path d="M 275,160 Q 320,140 325,180 Q 295,185 275,175 Z" fill="#38bdf8" stroke="${pal.stroke}" stroke-width="3"/>
        </g>
      `;
    }

    return html;
  }

  // 7. Ears (0, 1, 2, 4 × tiny, small, long, floppy, pointy, round, animal)
  renderEars(monster, pal) {
    const count = monster.earsCount !== undefined ? monster.earsCount : 2;
    if (count === 0) return '';
    const style = monster.earsStyle || 'long';

    let configs = [];
    if (count === 1) configs = [{ x: 138, y: 120, rot: -26, flip: false }];
    else if (count === 2) configs = [
      { x: 138, y: 120, rot: -26, flip: false },
      { x: 262, y: 120, rot: 26, flip: true }
    ];
    else if (count === 4) configs = [
      { x: 142, y: 110, rot: -34, flip: false },
      { x: 134, y: 145, rot: -16, flip: false },
      { x: 258, y: 110, rot: 34, flip: true },
      { x: 266, y: 145, rot: 16, flip: true }
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
          } else if (style === 'pointy' || style === 'animal') {
            return `
              <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.rot})">
                <polygon points="0,0 ${-25*sign},-45 ${15*sign},-30" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
                <polygon points="${2*sign},-6 ${-14*sign},-36 ${8*sign},-25" fill="${pal.belly}"/>
              </g>
            `;
          } else { // round, tiny, small
            const r = style === 'tiny' ? 14 : 22;
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

  // 8. Horns (0, 1, 2, 4 × tiny, big, curly, pointy, spiral)
  renderHorns(monster, pal) {
    const count = monster.hornsCount || 0;
    if (count === 0) return '';
    const style = monster.hornsStyle || 'curly';

    let configs = [];
    if (count === 1) configs = [{ x: 200, y: 92, rot: 0, flip: false }];
    else if (count === 2) configs = [
      { x: 160, y: 102, rot: -22, flip: false },
      { x: 240, y: 102, rot: 22, flip: true }
    ];
    else if (count === 4) configs = [
      { x: 152, y: 108, rot: -30, flip: false },
      { x: 175, y: 96, rot: -12, flip: false },
      { x: 225, y: 96, rot: 12, flip: true },
      { x: 248, y: 108, rot: 30, flip: true }
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
          } else { // pointy, tiny, big
            const h = style === 'tiny' ? 25 : (style === 'big' ? 55 : 40);
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

  // 9. Legs & Feet (0, 1, 2, 3, 4, many; claws, bird, monster, boots, sneakers, clown shoes)
  renderLegsAndFeet(monster, pal) {
    const count = monster.legsCount !== undefined ? monster.legsCount : 2;
    if (count === 0 || monster.bodyShape === 'ghost') return '';

    const hasBoots = !!monster.specialBoots || monster.clothesShoes === 'boots';
    const shoeType = monster.clothesShoes || (hasBoots ? 'boots' : 'none');
    const bootColor = this.getClothColor(monster.specialBootsColor || 'yellow', '#eab308');

    let legConfigs = [];
    if (count === 1) legConfigs = [{ x: 200, y: 345, angle: 0 }];
    else if (count === 2) legConfigs = [
      { x: 155, y: 340, angle: -4 },
      { x: 245, y: 340, angle: 4 }
    ];
    else if (count === 3) legConfigs = [
      { x: 140, y: 340, angle: -10 },
      { x: 200, y: 345, angle: 0 },
      { x: 260, y: 340, angle: 10 }
    ];
    else { // 4 or many
      legConfigs = [
        { x: 126, y: 338, angle: -14 },
        { x: 175, y: 345, angle: -4 },
        { x: 225, y: 345, angle: 4 },
        { x: 274, y: 338, angle: 14 }
      ];
    }

    return `
      <g class="monster-legs-group">
        ${legConfigs.map((cfg) => `
          <g transform="translate(${cfg.x}, ${cfg.y}) rotate(${cfg.angle})">
            <path d="M -14,0 L -14,75 Q -14,88 0,88 Q 14,88 14,75 L 14,0 Z" 
                  fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
            
            ${shoeType === 'boots' ? `
              <!-- Superhero Boots -->
              <g transform="translate(0, 48)">
                <path d="M -18,0 L 22,0 L 26,38 Q 26,48 10,48 L -20,48 Q -24,48 -22,36 Z" 
                      fill="${bootColor}" stroke="${pal.stroke}" stroke-width="4" stroke-linejoin="round"/>
                <ellipse cx="2" cy="46" rx="24" ry="7" fill="${pal.stroke}"/>
                <rect x="-16" y="0" width="38" height="8" rx="3" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
              </g>
            ` : shoeType === 'sneakers' ? `
              <!-- Sporty Sneakers -->
              <g transform="translate(0, 56)">
                <path d="M -18,0 L 24,0 L 28,32 Q 28,38 12,38 L -20,38 Z" fill="#ef4444" stroke="${pal.stroke}" stroke-width="3.5"/>
                <rect x="-22" y="28" width="52" height="10" rx="4" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
                <line x1="-10" y1="12" x2="14" y2="12" stroke="#ffffff" stroke-width="3"/>
              </g>
            ` : shoeType === 'clown_shoes' ? `
              <!-- Huge Clown Shoes -->
              <g transform="translate(0, 50)">
                <ellipse cx="8" cy="32" rx="34" ry="16" fill="#facc15" stroke="${pal.stroke}" stroke-width="4"/>
                <circle cx="34" cy="24" r="8" fill="#ef4444"/>
              </g>
            ` : monster.feetStyle === 'bird' ? `
              <!-- Bird Talons -->
              <g transform="translate(0, 80)">
                <path d="M -18,12 L 0,0 L 18,12 M 0,0 L 0,16 M 0,0 L -6,-10" stroke="#ca8a04" stroke-width="6" stroke-linecap="round"/>
              </g>
            ` : monster.feetStyle === 'claws' ? `
              <!-- Sharp Dragon Claws -->
              <g transform="translate(0, 80)">
                <ellipse cx="2" cy="5" rx="24" ry="12" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5"/>
                <polygon points="-16,10 -12,24 -8,10" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
                <polygon points="-2,12 2,26 6,12" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
                <polygon points="12,10 16,24 20,10" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
              </g>
            ` : `
              <!-- Cute Monster Foot -->
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

  // 10. Body Base (10 Distinct Shapes: round, square, tall, short, wide, thin, blob, ghost, dinosaur, robot)
  renderBodyBase(monster, pal, secPal) {
    const shape = monster.bodyShape || 'round';
    let bodyPath = '';
    let bellyPath = '';

    if (shape === 'square') {
      bodyPath = `M 130,100 L 270,100 Q 285,100 285,120 L 285,340 Q 285,365 260,365 L 140,365 Q 115,365 115,340 L 115,120 Q 115,100 130,100 Z`;
      bellyPath = `<rect x="145" y="240" width="110" height="100" rx="24" fill="url(#secGrad_${monster.secondaryColor || monster.color})" stroke="${pal.dark}" stroke-width="3"/>`;
    } else if (shape === 'tall') {
      bodyPath = `M 200,75 C 240,75 262,110 262,160 C 262,210 265,310 255,365 C 245,380 155,380 145,365 C 135,310 138,210 138,160 C 138,110 160,75 200,75 Z`;
      bellyPath = `<ellipse cx="200" cy="285" rx="46" ry="75" fill="url(#secGrad_${monster.secondaryColor || monster.color})" stroke="${pal.dark}" stroke-width="3"/>`;
    } else if (shape === 'short') {
      bodyPath = `M 200,120 C 260,120 285,155 285,210 C 285,280 285,350 200,350 C 115,350 115,280 115,210 C 115,155 140,120 200,120 Z`;
      bellyPath = `<ellipse cx="200" cy="265" rx="65" ry="55" fill="url(#secGrad_${monster.secondaryColor || monster.color})" stroke="${pal.dark}" stroke-width="3"/>`;
    } else if (shape === 'wide') {
      bodyPath = `M 200,95 C 275,95 305,150 305,230 C 305,320 285,365 200,365 C 115,365 95,320 95,230 C 95,150 125,95 200,95 Z`;
      bellyPath = `<ellipse cx="200" cy="280" rx="76" ry="62" fill="url(#secGrad_${monster.secondaryColor || monster.color})" stroke="${pal.dark}" stroke-width="3"/>`;
    } else if (shape === 'thin') {
      bodyPath = `M 200,85 C 235,85 248,120 248,180 C 248,250 252,330 242,370 C 235,380 165,380 158,370 C 148,330 152,250 152,180 C 152,120 165,85 200,85 Z`;
      bellyPath = `<ellipse cx="200" cy="290" rx="36" ry="65" fill="url(#secGrad_${monster.secondaryColor || monster.color})" stroke="${pal.dark}" stroke-width="3"/>`;
    } else if (shape === 'blob') {
      bodyPath = `M 200,90 C 265,80 295,135 275,190 C 315,245 295,340 255,365 C 200,385 150,360 125,345 C 85,300 100,225 125,185 C 105,130 145,85 200,90 Z`;
      bellyPath = `<path d="M 195,240 Q 255,235 245,305 Q 235,355 195,350 Q 150,355 155,295 Z" fill="url(#secGrad_${monster.secondaryColor || monster.color})" stroke="${pal.dark}" stroke-width="3"/>`;
    } else if (shape === 'ghost') {
      bodyPath = `M 200,95 C 265,95 285,150 285,240 C 285,330 290,400 270,410 C 250,385 230,415 200,395 C 170,415 150,385 130,410 C 110,400 115,330 115,240 C 115,150 135,95 200,95 Z`;
      bellyPath = `<ellipse cx="200" cy="275" rx="55" ry="60" fill="url(#secGrad_${monster.secondaryColor || monster.color})" opacity="0.6"/>`;
    } else if (shape === 'dinosaur') {
      bodyPath = `M 180,95 C 230,85 265,120 265,170 C 265,220 285,300 275,355 C 255,375 145,375 125,355 C 115,295 130,220 135,170 C 135,120 145,95 180,95 Z`;
      bellyPath = `<path d="M 200,230 C 245,230 258,260 258,310 C 258,355 240,360 200,360 C 160,360 142,355 142,310 C 142,260 155,230 200,230 Z" fill="url(#secGrad_${monster.secondaryColor || monster.color})" stroke="${pal.dark}" stroke-width="3"/>`;
    } else if (shape === 'robot') {
      bodyPath = `M 135,100 L 265,100 L 265,195 L 285,215 L 285,345 L 115,345 L 115,215 L 135,195 Z`;
      bellyPath = `<rect x="145" y="235" width="110" height="95" rx="14" fill="url(#secGrad_${monster.secondaryColor || monster.color})" stroke="${pal.dark}" stroke-width="3"/><circle cx="200" cy="282" r="16" fill="#38bdf8"/>`;
    } else { // round (default)
      bodyPath = `M 200,95 C 245,95 272,125 272,165 C 272,192 258,212 278,225 C 300,240 292,305 278,345 C 260,375 140,375 122,345 C 108,305 100,240 122,225 C 142,212 128,192 128,165 C 128,125 155,95 200,95 Z`;
      bellyPath = `<path d="M 200,235 C 238,235 254,260 254,295 C 254,335 235,355 200,355 C 165,355 146,335 146,295 C 146,260 162,235 200,235 Z" fill="url(#secGrad_${monster.secondaryColor || monster.color})" stroke="${pal.dark}" stroke-width="3" opacity="0.9"/>`;
    }

    return `
      <g class="monster-body-group" filter="url(#mShadow)">
        <path d="${bodyPath}" fill="url(#bodyGrad_${monster.color})" stroke="${pal.stroke}" stroke-width="5" stroke-linejoin="round"/>
        <!-- Soft Cheeks -->
        <ellipse cx="148" cy="178" rx="14" ry="9" fill="${pal.dark}" opacity="0.25"/>
        <ellipse cx="252" cy="178" rx="14" ry="9" fill="${pal.dark}" opacity="0.25"/>
        <!-- Belly -->
        ${bellyPath}
      </g>
    `;
  }

  // 11. Pattern Overlay (spots, stripes, stars, hearts, dots, zigzags, rainbow)
  renderPatternOverlay(monster, secPal) {
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

  // 12. Bottoms (Trousers, Shorts, Skirt, Dress)
  renderBottoms(monster) {
    if (!monster.clothesBottom || monster.clothesBottom === 'none' || (monster.specialSuit && monster.specialSuit !== 'none')) return '';
    const color = this.getClothColor(monster.clothesBottomColor, '#1e293b');

    if (monster.clothesBottom === 'trousers') {
      return `
        <g class="monster-clothing-bottoms">
          <path d="M 124,300 C 118,340 128,375 146,375 L 178,375 L 198,328 L 222,375 L 254,375 C 272,375 282,340 276,300 Z" 
                fill="${color}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          <line x1="200" y1="328" x2="200" y2="305" stroke="#0f172a" stroke-width="3.5"/>
          <rect x="188" y="298" width="24" height="7" rx="3" fill="#facc15" stroke="#0f172a" stroke-width="2"/>
        </g>
      `;
    } else if (monster.clothesBottom === 'shorts') {
      return `
        <g class="monster-clothing-bottoms">
          <path d="M 124,300 C 118,325 130,345 155,345 L 178,345 L 198,320 L 222,345 L 245,345 C 270,345 282,325 276,300 Z" 
                fill="${color}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
        </g>
      `;
    } else if (monster.clothesBottom === 'skirt' || monster.clothesBottom === 'dress') {
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

  // 13. Tops (T-shirt, Shirt, Jacket, Hoodie, Sweater)
  renderTops(monster) {
    if (!monster.clothesTop || monster.clothesTop === 'none' || (monster.specialSuit && monster.specialSuit !== 'none')) return '';
    const color = this.getClothColor(monster.clothesTopColor, '#2563eb');

    if (monster.clothesTop === 'tshirt') {
      return `
        <g class="monster-clothing-tops">
          <path d="M 142,215 Q 200,230 258,215 L 292,255 L 268,266 L 258,310 L 142,310 L 132,266 L 108,255 Z" 
                fill="${color}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M 174,218 Q 200,235 226,218" fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
          <polygon points="200,248 203,256 212,257 205,263 207,271 200,267 193,271 195,263 188,257 197,256" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
        </g>
      `;
    } else if (monster.clothesTop === 'shirt') {
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
    } else if (monster.clothesTop === 'hoodie' || monster.clothesTop === 'sweater') {
      return `
        <g class="monster-clothing-tops">
          <path d="M 140,212 Q 200,225 260,212 L 295,262 L 268,272 L 258,314 L 142,314 L 132,272 L 105,262 Z" 
                fill="${color}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          <!-- Front Pocket -->
          <rect x="160" y="275" width="80" height="28" rx="8" fill="#ffffff" opacity="0.4"/>
          <!-- Drawstrings -->
          <line x1="190" y1="225" x2="188" y2="252" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
          <line x1="210" y1="225" x2="212" y2="252" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
        </g>
      `;
    } else if (monster.clothesTop === 'jacket') {
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

  // 14. Special Suits (Superhero, Astronaut, Pirate, Wizard, Royal, Football)
  renderSpecialSuits(monster) {
    const suit = monster.specialSuit;
    if (!suit || suit === 'none') return '';

    if (suit === 'superhero') {
      return `
        <g class="monster-suit-superhero">
          <path d="M 138,215 Q 200,230 262,215 L 285,340 L 115,340 Z" fill="#2563eb" stroke="#0f172a" stroke-width="4.5"/>
          <polygon points="200,235 225,255 215,285 185,285 175,255" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
          <text x="200" y="272" font-size="22" font-weight="900" text-anchor="middle" fill="#dc2626">M</text>
        </g>
      `;
    } else if (suit === 'astronaut') {
      return `
        <g class="monster-suit-astronaut">
          <path d="M 135,210 L 265,210 L 285,345 L 115,345 Z" fill="#f8fafc" stroke="#0f172a" stroke-width="4.5"/>
          <rect x="175" y="240" width="50" height="40" rx="8" fill="#38bdf8" stroke="#0f172a" stroke-width="2.5"/>
          <circle cx="188" cy="255" r="4" fill="#ef4444"/>
          <circle cx="212" cy="255" r="4" fill="#10b981"/>
        </g>
      `;
    } else if (suit === 'wizard') {
      return `
        <g class="monster-suit-wizard">
          <path d="M 140,215 Q 200,235 260,215 L 295,375 L 105,375 Z" fill="#7c3aed" stroke="#0f172a" stroke-width="4.5"/>
          <polygon points="200,248 203,256 212,257 205,263 207,271 200,267 193,271 195,263 188,257 197,256" fill="#facc15"/>
          <polygon points="160,310 162,315 168,316 163,320 165,326 160,323 155,326 157,320 152,316 158,315" fill="#facc15"/>
          <polygon points="240,310 242,315 248,316 243,320 245,326 240,323 235,326 237,320 232,316 238,315" fill="#facc15"/>
        </g>
      `;
    } else if (suit === 'pirate') {
      return `
        <g class="monster-suit-pirate">
          <path d="M 140,215 L 260,215 L 285,345 L 115,345 Z" fill="#1e293b" stroke="#0f172a" stroke-width="4.5"/>
          <path d="M 170,215 L 175,345 L 225,345 L 230,215 Z" fill="#dc2626"/>
          <line x1="170" y1="245" x2="230" y2="245" stroke="#ffffff" stroke-width="4"/>
          <line x1="170" y1="275" x2="230" y2="275" stroke="#ffffff" stroke-width="4"/>
          <line x1="170" y1="305" x2="230" y2="305" stroke="#ffffff" stroke-width="4"/>
        </g>
      `;
    } else if (suit === 'football') {
      return `
        <g class="monster-suit-football">
          <path d="M 140,215 L 260,215 L 285,325 L 115,325 Z" fill="#16a34a" stroke="#0f172a" stroke-width="4.5"/>
          <text x="200" y="278" font-size="34" font-weight="900" text-anchor="middle" fill="#ffffff">10</text>
        </g>
      `;
    } else if (suit === 'royal') {
      return `
        <g class="monster-suit-royal">
          <path d="M 135,215 L 265,215 L 295,370 L 105,370 Z" fill="#991b1b" stroke="#0f172a" stroke-width="4.5"/>
          <path d="M 180,215 L 180,370 L 220,370 L 220,215 Z" fill="#fef08a" stroke="#0f172a" stroke-width="2"/>
        </g>
      `;
    }
    return '';
  }

  // 15. Arms & Hands (0, 1, 2, 3, 4, many; claws, giant, 3/4 fingers, tentacles)
  renderArmsAndHands(monster, pal) {
    const count = monster.armsCount !== undefined ? monster.armsCount : 2;
    if (count === 0) return '';
    const length = monster.armsLength || 'short';
    const hasGloves = !!monster.specialGloves;
    const gloveColor = this.getClothColor(monster.specialGlovesColor || 'green', '#16a34a');

    let armFactor = 1.0;
    if (length === 'tiny') armFactor = 0.6;
    else if (length === 'long') armFactor = 1.35;
    else if (length === 'super_long') armFactor = 1.7;

    let armConfigs = [];
    if (count === 1) armConfigs = [{ side: 'right', shX: 278, shY: 224, handX: 62 * armFactor, handY: -35 * armFactor, rot: 28, flip: true }];
    else if (count === 2) armConfigs = [
      { side: 'left',  shX: 122, shY: 224, handX: 62 * armFactor, handY: 35 * armFactor,  rot: -28, flip: false },
      { side: 'right', shX: 278, shY: 224, handX: 62 * armFactor, handY: -35 * armFactor, rot: 28,  flip: true }
    ];
    else if (count === 3) armConfigs = [
      { side: 'left',  shX: 122, shY: 215, handX: 65 * armFactor, handY: -30 * armFactor, rot: -42, flip: false },
      { side: 'left',  shX: 124, shY: 265, handX: 58 * armFactor, handY: 35 * armFactor,  rot: -12, flip: false },
      { side: 'right', shX: 278, shY: 224, handX: 62 * armFactor, handY: 35 * armFactor,  rot: 28,  flip: true }
    ];
    else { // 4 or many
      armConfigs = [
        { side: 'left',  shX: 122, shY: 210, handX: 64 * armFactor, handY: -32 * armFactor, rot: -46, flip: false },
        { side: 'left',  shX: 124, shY: 268, handX: 58 * armFactor, handY: 30 * armFactor,  rot: -10, flip: false },
        { side: 'right', shX: 278, shY: 210, handX: 64 * armFactor, handY: -32 * armFactor, rot: 46,  flip: true },
        { side: 'right', shX: 276, shY: 268, handX: 58 * armFactor, handY: 30 * armFactor,  rot: 10,  flip: true }
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
                  <rect x="-12" y="6" width="24" height="7" rx="3" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
                ` : monster.handsStyle === 'claws' ? `
                  <circle cx="0" cy="0" r="13" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="3.5"/>
                  <polygon points="${dir * -8},-8 ${dir * -14},-20 ${dir * -2},-10" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
                  <polygon points="0,-10 ${dir * 4},-22 ${dir * 6},-8" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
                  <polygon points="${dir * 8},-6 ${dir * 18},-16 ${dir * 12},-2" fill="#ffffff" stroke="${pal.stroke}" stroke-width="1.5"/>
                ` : monster.handsStyle === 'giant' ? `
                  <circle cx="0" cy="0" r="22" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5"/>
                  <circle cx="${dir * -10}" cy="-12" r="8" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="2"/>
                  <circle cx="${dir * 10}" cy="-12" r="8" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="2"/>
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

  // 16. Eyes (1, 2, 3, 4, many × tiny, small, big, giant × round, sleepy, angry, happy, surprised, funny, star, heart)
  renderEyes(monster) {
    const count = monster.eyesCount !== undefined ? monster.eyesCount : 2;
    const size = monster.eyesSize || 'big';
    const style = monster.eyesStyle || 'round';

    let rBase = 20;
    if (size === 'tiny') rBase = 9;
    else if (size === 'small') rBase = 14;
    else if (size === 'giant') rBase = 32;

    let eyeConfigs = [];
    if (count === 1) {
      eyeConfigs = [{ cx: 200, cy: 144, r: rBase * 1.3 }];
    } else if (count === 2) {
      eyeConfigs = [
        { cx: 168, cy: 144, r: rBase },
        { cx: 232, cy: 144, r: rBase }
      ];
    } else if (count === 3) {
      eyeConfigs = [
        { cx: 146, cy: 148, r: rBase * 0.85 },
        { cx: 200, cy: 138, r: rBase * 0.95 },
        { cx: 254, cy: 148, r: rBase * 0.85 }
      ];
    } else if (count === 4) {
      eyeConfigs = [
        { cx: 148, cy: 138, r: rBase * 0.75 },
        { cx: 182, cy: 134, r: rBase * 0.8 },
        { cx: 218, cy: 134, r: rBase * 0.8 },
        { cx: 252, cy: 138, r: rBase * 0.75 }
      ];
    } else { // many (5 eyes)
      eyeConfigs = [
        { cx: 142, cy: 148, r: rBase * 0.7 },
        { cx: 172, cy: 134, r: rBase * 0.75 },
        { cx: 200, cy: 154, r: rBase * 0.8 },
        { cx: 228, cy: 134, r: rBase * 0.75 },
        { cx: 258, cy: 148, r: rBase * 0.7 }
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

  // 17. Glasses & Sunglasses
  renderGlasses(monster) {
    if (!monster.accessories) return '';
    const hasGlasses = monster.accessories.includes('glasses');
    const hasSunglasses = monster.accessories.includes('sunglasses');
    if (!hasGlasses && !hasSunglasses) return '';

    const lensFill = hasSunglasses ? '#0f172a' : 'rgba(255,255,255,0.35)';

    return `
      <g class="accessory-glasses" transform="translate(200, 144)">
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

  // 18. Nose (none, tiny, small, big, long, round, funny)
  renderNose(monster, pal) {
    const style = monster.noseStyle;
    if (!style || style === 'none') return '';

    if (style === 'long') {
      return `
        <g class="monster-nose-group">
          <path d="M 194,170 Q 200,195 215,195 Q 205,170 202,168 Z" fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="3.5"/>
        </g>
      `;
    } else if (style === 'funny') {
      return `
        <g class="monster-nose-group">
          <ellipse cx="200" cy="174" rx="20" ry="14" fill="#ef4444" stroke="${pal.stroke}" stroke-width="3.5"/>
          <circle cx="194" cy="170" r="5" fill="#ffffff" opacity="0.6"/>
        </g>
      `;
    } else if (style === 'big' || style === 'round') {
      return `
        <g class="monster-nose-group">
          <ellipse cx="200" cy="174" rx="16" ry="12" fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="3.5"/>
          <ellipse cx="195" cy="170" rx="5" ry="3.5" fill="#ffffff" opacity="0.6"/>
        </g>
      `;
    } else { // tiny, small
      return `
        <g class="monster-nose-group">
          <ellipse cx="200" cy="172" rx="7.5" ry="5.5" fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="3"/>
          <circle cx="198" cy="170" r="2" fill="#ffffff" opacity="0.6"/>
        </g>
      `;
    }
  }

  // 19. Mouth & Teeth (Contained naturally inside mouth)
  renderMouthAndTeeth(monster) {
    const mouthType = monster.mouthType || 'big';
    const teethType = monster.teethType || 'sharp';

    let mouthCavity = '';
    let teethItems = '';

    if (mouthType === 'huge' || mouthType === 'big' || mouthType === 'smiling') {
      mouthCavity = `
        <path d="M 152,192 Q 200,248 248,192 Z" fill="#e11d48" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M 175,224 Q 200,202 225,224 Q 200,248 175,224 Z" fill="#fb7185"/>
      `;

      if (teethType === 'sharp' || teethType === 'vampire') {
        teethItems = `
          <polygon points="172,192 179,208 186,192" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="193,192 200,214 207,192" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="214,192 221,208 228,192" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
        `;
      } else if (teethType === 'giant') {
        teethItems = `
          <rect x="192" y="192" width="16" height="22" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
        `;
      } else if (teethType === 'big') {
        teethItems = `
          <rect x="189" y="192" width="10" height="14" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
          <rect x="201" y="192" width="10" height="14" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
        `;
      } else if (teethType === 'small') {
        teethItems = `
          <circle cx="176" cy="195" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="186" cy="195" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="196" cy="195" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="204" cy="195" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="214" cy="195" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="224" cy="195" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
        `;
      }
    } else if (mouthType === 'scary') {
      mouthCavity = `
        <path d="M 146,194 Q 200,182 254,194 Q 242,244 200,240 Q 158,244 146,194 Z" 
              fill="#881337" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
      `;

      if (teethType === 'sharp' || teethType === 'vampire') {
        teethItems = `
          <polygon points="156,194 164,215 172,193" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="178,191 187,222 196,190" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="204,190 213,222 222,191" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="228,193 236,215 244,194" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
        `;
      } else if (teethType === 'giant') {
        teethItems = `<rect x="190" y="190" width="20" height="26" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>`;
      }
    } else { // tiny, small, happy, surprised
      mouthCavity = `
        <path d="M 178,196 Q 200,222 222,196 Z" fill="#be123c" stroke="#0f172a" stroke-width="4" stroke-linejoin="round"/>
        <path d="M 188,212 Q 200,204 212,212 Q 200,222 188,212 Z" fill="#fb7185"/>
      `;

      if (teethType === 'sharp') {
        teethItems = `
          <polygon points="190,196 195,205 200,196" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <polygon points="200,196 205,205 210,196" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
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

  // 20. Neck Accessories (Scarf, Bow, Necklace)
  renderNeckAccessories(monster) {
    if (!monster.accessories || !Array.isArray(monster.accessories)) return '';
    const accColors = monster.accessoryColors || {};
    let html = '';

    if (monster.accessories.includes('scarf')) {
      const scarfColor = this.getClothColor(accColors.scarf || 'red', '#dc2626');
      html += `
        <g class="accessory-scarf" transform="translate(200, 216)">
          <path d="M -58,-8 Q 0,22 58,-8 Q 0,38 -58,-8 Z" fill="${scarfColor}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M 18,12 L 32,82 L 54,78 L 42,12 Z" fill="${scarfColor}" stroke="#0f172a" stroke-width="4" stroke-linejoin="round"/>
        </g>
      `;
    }

    if (monster.accessories.includes('bow')) {
      const bowColor = this.getClothColor(accColors.bow || 'pink', '#ec4899');
      html += `
        <g class="accessory-bow" transform="translate(200, 222)">
          <polygon points="0,0 -24,-14 -24,14" fill="${bowColor}" stroke="#0f172a" stroke-width="3.5"/>
          <polygon points="0,0 24,-14 24,14" fill="${bowColor}" stroke="#0f172a" stroke-width="3.5"/>
          <circle cx="0" cy="0" r="7" fill="#facc15" stroke="#0f172a" stroke-width="2.5"/>
        </g>
      `;
    }

    if (monster.accessories.includes('necklace')) {
      html += `
        <g class="accessory-necklace" transform="translate(200, 224)">
          <path d="M -45,-4 Q 0,32 45,-4" fill="none" stroke="#facc15" stroke-width="4"/>
          <circle cx="0" cy="18" r="7" fill="#ef4444" stroke="#78350f" stroke-width="2"/>
        </g>
      `;
    }

    return html;
  }

  // 21. Cape Front Clasp
  renderCapeFront(monster) {
    return `
      <g class="monster-cape-front">
        <path d="M 134,212 Q 200,232 266,212" fill="none" stroke="#be123c" stroke-width="7" stroke-linecap="round"/>
        <circle cx="200" cy="222" r="8.5" fill="#facc15" stroke="#ca8a04" stroke-width="3"/>
        <polygon points="200,217 202,221 206,222 203,225 204,229 200,227 196,229 197,225 194,222 198,221" fill="#ffffff" />
      </g>
    `;
  }

  // 22. Head Accessories (Hats, Caps, Crowns, Wizard, Pirate, Helmets)
  renderHeadAccessories(monster) {
    if (!monster.accessories || !Array.isArray(monster.accessories)) return '';
    const accColors = monster.accessoryColors || {};
    let html = '';

    if (monster.accessories.includes('crown')) {
      html += `
        <g class="accessory-crown" transform="translate(200, 94)">
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
        <g class="accessory-wizard-hat" transform="translate(200, 94)">
          <ellipse cx="0" cy="6" rx="65" ry="14" fill="#6d28d9" stroke="#0f172a" stroke-width="4"/>
          <path d="M -35,4 Q -10,-80 40,-85 Q 20,-30 35,4 Z" fill="#7c3aed" stroke="#0f172a" stroke-width="4"/>
          <polygon points="12,-45 15,-40 22,-40 17,-35 19,-28 12,-32 5,-28 7,-35 2,-40 9,-40" fill="#facc15"/>
        </g>
      `;
    } else if (monster.accessories.includes('pirate_hat')) {
      html += `
        <g class="accessory-pirate-hat" transform="translate(200, 98)">
          <path d="M -65,10 Q 0,-45 65,10 Q 0,0 -65,10 Z" fill="#0f172a" stroke="#ffffff" stroke-width="3"/>
          <circle cx="0" cy="-6" r="6" fill="#ffffff"/>
        </g>
      `;
    } else if (monster.accessories.includes('helmet')) {
      html += `
        <g class="accessory-helmet" transform="translate(200, 100)">
          <path d="M -50,15 C -50,-45 50,-45 50,15 Z" fill="#94a3b8" stroke="#0f172a" stroke-width="4"/>
          <polygon points="0,-45 8,-20 -8,-20" fill="#facc15"/>
        </g>
      `;
    } else if (monster.accessories.includes('hat')) {
      const hatColor = this.getClothColor(accColors.hat || 'yellow', '#eab308');
      html += `
        <g class="accessory-hat" transform="translate(200, 96)">
          <ellipse cx="0" cy="8" rx="60" ry="11" fill="${hatColor}" stroke="#0f172a" stroke-width="4"/>
          <path d="M -32,8 L -24,-58 L 24,-58 L 32,8 Z" fill="${hatColor}" stroke="#0f172a" stroke-width="4"/>
          <rect x="-32" y="-4" width="64" height="12" fill="#ef4444" stroke="#0f172a" stroke-width="2"/>
        </g>
      `;
    } else if (monster.accessories.includes('cap')) {
      const capColor = this.getClothColor(accColors.cap || 'blue', '#2563eb');
      html += `
        <g class="accessory-cap" transform="translate(200, 102)">
          <path d="M -42,8 C -42,-32 42,-32 42,8 Z" fill="${capColor}" stroke="#0f172a" stroke-width="4"/>
          <path d="M -42,6 Q -72,16 -66,24 Q -38,20 -14,8 Z" fill="${capColor}" stroke="#0f172a" stroke-width="3.5"/>
          <circle cx="0" cy="-30" r="4" fill="#facc15" stroke="#0f172a" stroke-width="1.5"/>
        </g>
      `;
    }

    return html;
  }

  // 23. Power Aura
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
          <path d="M 200,210 Q 230,230 255,205 Q 240,245 285,235 Q 245,260 200,225 Z" fill="#f97316" opacity="0.85"/>
          <circle cx="230" cy="225" r="8" fill="#fde047"/>
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
