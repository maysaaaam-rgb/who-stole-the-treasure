/**
 * monsterRenderer.js - Procedural Vector SVG Engine for "Build Your Own Monster!"
 * Creates a cohesive, professional, adorable cartoon monster character with
 * anatomically integrated head, body, face, arms, legs, and fitted clothing.
 */

class MonsterRenderer {
  constructor() {
    this.colorPalettes = {
      purple: { main: '#a855f7', belly: '#f3e8ff', dark: '#6b21a8', stroke: '#3b0764', highlight: '#c084fc', face: '#c084fc' },
      green:  { main: '#22c55e', belly: '#dcfce7', dark: '#15803d', stroke: '#14532d', highlight: '#4ade80', face: '#4ade80' },
      blue:   { main: '#0ea5e9', belly: '#e0f2fe', dark: '#0369a1', stroke: '#0c4a6e', highlight: '#38bdf8', face: '#38bdf8' },
      red:    { main: '#f43f5e', belly: '#ffe4e6', dark: '#be123c', stroke: '#881337', highlight: '#fb7185', face: '#fb7185' },
      orange: { main: '#f97316', belly: '#ffedd5', dark: '#c2410c', stroke: '#7c2d12', highlight: '#fb923c', face: '#fb923c' },
      yellow: { main: '#eab308', belly: '#fef9c3', dark: '#a16207', stroke: '#713f12', highlight: '#fde047', face: '#fde047' },
      pink:   { main: '#ec4899', belly: '#fce7f3', dark: '#be185d', stroke: '#831843', highlight: '#f472b6', face: '#f472b6' }
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
   * Render complete SVG markup for a monster
   */
  renderSvg(monster, options = {}) {
    const isAnimated = options.animated !== false;
    const pal = this.getPalette(monster.color);
    const width = options.width || 400;
    const height = options.height || 480;

    // Layering Order:
    // 1. Shadow Base
    // 2. Cape Back & Backpack Back
    // 3. Ears (attached to head back/sides)
    // 4. Legs & Boots (connected to base of body)
    // 5. Unified Monster Body (Head + Torso + Belly)
    // 6. Bottoms (Trousers/Shorts/Dress)
    // 7. Tops (T-shirt/Shirt/Jacket)
    // 8. Arms & Gloves (connected to shoulders)
    // 9. Facial Features: Eyes
    // 10. Glasses (sits over eyes)
    // 11. Nose (centered between eyes and mouth)
    // 12. Mouth & Teeth (contained inside mouth cavity)
    // 13. Scarf & Bow & Cape Clasp
    // 14. Hat & Crown (sits on top of head)

    const layers = [
      this.renderBackdropShadow(),
      monster.specialCape ? this.renderCapeBack(monster) : '',
      (monster.accessories && monster.accessories.includes('backpack')) ? this.renderBackpackBack(monster) : '',
      this.renderEars(monster, pal),
      this.renderLegs(monster, pal),
      this.renderUnifiedBody(monster, pal),
      this.renderBottoms(monster),
      this.renderTops(monster),
      this.renderArms(monster, pal),
      this.renderEyes(monster),
      this.renderGlasses(monster),
      this.renderNose(monster, pal),
      this.renderMouthAndTeeth(monster),
      this.renderNeckAccessories(monster),
      monster.specialCape ? this.renderCapeFront(monster) : '',
      this.renderHeadAccessories(monster)
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
          <linearGradient id="bellyGrad_${monster.color}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="100%" stop-color="${pal.belly}"/>
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
  renderBackdropShadow() {
    return `<ellipse cx="200" cy="445" rx="105" ry="18" fill="rgba(15, 23, 42, 0.16)" />`;
  }

  // 2. Cape Back
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

  // 3. Backpack Back
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

  // 4. Ears (Attached to Head Sides)
  renderEars(monster, pal) {
    const count = monster.earsCount || 2;
    const length = monster.earsLength || 'long';

    if (length === 'long') {
      // Long tall bunny/alien cartoon ears firmly anchored to head
      if (count === 1) {
        return `
          <g class="monster-ears-group">
            <g transform="translate(138, 120) rotate(-24)">
              <path d="M 0,0 C -22,-55 8,-98 18,-94 C 28,-55 18,-15 0,0 Z" 
                    fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
              <path d="M 4,-12 C -6,-48 10,-78 14,-76 C 18,-48 14,-15 4,-12 Z" 
                    fill="${pal.belly}" stroke="${pal.dark}" stroke-width="2"/>
            </g>
          </g>
        `;
      } else {
        return `
          <g class="monster-ears-group">
            <!-- Left Ear -->
            <g transform="translate(138, 120) rotate(-26)">
              <path d="M 0,0 C -24,-60 8,-102 18,-98 C 28,-60 18,-15 0,0 Z" 
                    fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
              <path d="M 4,-14 C -8,-52 10,-82 14,-80 C 18,-52 14,-16 4,-14 Z" 
                    fill="${pal.belly}" stroke="${pal.dark}" stroke-width="2"/>
            </g>
            <!-- Right Ear -->
            <g transform="translate(262, 120) rotate(26)">
              <path d="M 0,0 C 24,-60 -8,-102 -18,-98 C -28,-60 -18,-15 0,0 Z" 
                    fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
              <path d="M -4,-14 C 8,-52 -10,-82 -14,-80 C -18,-52 -14,-16 -4,-14 Z" 
                    fill="${pal.belly}" stroke="${pal.dark}" stroke-width="2"/>
            </g>
          </g>
        `;
      }
    } else {
      // Short rounded bear/monster ears seamlessly rooted on head sides
      if (count === 1) {
        return `
          <g class="monster-ears-group">
            <g transform="translate(134, 124) rotate(-30)">
              <ellipse cx="0" cy="0" rx="22" ry="24" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5"/>
              <ellipse cx="0" cy="0" rx="12" ry="13" fill="${pal.belly}" stroke="${pal.dark}" stroke-width="2"/>
            </g>
          </g>
        `;
      } else {
        return `
          <g class="monster-ears-group">
            <!-- Left Short Ear -->
            <g transform="translate(134, 124) rotate(-30)">
              <ellipse cx="0" cy="0" rx="22" ry="24" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5"/>
              <ellipse cx="0" cy="0" rx="12" ry="13" fill="${pal.belly}" stroke="${pal.dark}" stroke-width="2"/>
            </g>
            <!-- Right Short Ear -->
            <g transform="translate(266, 124) rotate(30)">
              <ellipse cx="0" cy="0" rx="22" ry="24" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5"/>
              <ellipse cx="0" cy="0" rx="12" ry="13" fill="${pal.belly}" stroke="${pal.dark}" stroke-width="2"/>
            </g>
          </g>
        `;
      }
    }
  }

  // 5. Legs & Boots (Connected cleanly to base of body)
  renderLegs(monster, pal) {
    const count = monster.legsCount || 2;
    const hasBoots = !!monster.specialBoots;
    const bootColor = this.getClothColor(monster.specialBootsColor || 'yellow', '#eab308');

    let legConfigs = [];
    if (count === 2) {
      legConfigs = [
        { x: 155, y: 340, angle: -4 },
        { x: 245, y: 340, angle: 4 }
      ];
    } else if (count === 3) {
      legConfigs = [
        { x: 140, y: 340, angle: -10 },
        { x: 200, y: 345, angle: 0 },
        { x: 260, y: 340, angle: 10 }
      ];
    } else { // 4 legs
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
            <!-- Chunky Leg Column -->
            <path d="M -14,0 L -14,75 Q -14,88 0,88 Q 14,88 14,75 L 14,0 Z" 
                  fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="4.5" stroke-linejoin="round"/>
            
            ${hasBoots ? `
              <!-- Fitted Superhero Boots -->
              <g transform="translate(0, 48)">
                <path d="M -18,0 L 22,0 L 26,38 Q 26,48 10,48 L -20,48 Q -24,48 -22,36 Z" 
                      fill="${bootColor}" stroke="${pal.stroke}" stroke-width="4" stroke-linejoin="round"/>
                <ellipse cx="2" cy="46" rx="24" ry="7" fill="${pal.stroke}"/>
                <rect x="-16" y="0" width="38" height="8" rx="3" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
              </g>
            ` : `
              <!-- Cute Monster Foot with Toes -->
              <g transform="translate(0, 80)">
                <ellipse cx="2" cy="5" rx="24" ry="12" fill="${pal.main}" stroke="${pal.stroke}" stroke-width="4.5"/>
                <!-- 3 Cute Toes/Claws -->
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

  // 6. Unified Cute Monster Body (Head + Shoulders + Torso + Belly as ONE character)
  renderUnifiedBody(monster, pal) {
    return `
      <g class="monster-body-group" filter="url(#mShadow)">
        <!-- Single Connected Organic Cartoon Body Silhouette (Head smoothly merging into Shoulders and Torso) -->
        <path d="
          M 200,95
          C 245,95 272,125 272,165
          C 272,192 258,212 278,225
          C 300,240 292,305 278,345
          C 260,375 140,375 122,345
          C 108,305 100,240 122,225
          C 142,212 128,192 128,165
          C 128,125 155,95 200,95
          Z" 
          fill="url(#bodyGrad_${monster.color})" 
          stroke="${pal.stroke}" 
          stroke-width="5" 
          stroke-linejoin="round" />

        <!-- Soft Cheek Blushes -->
        <ellipse cx="148" cy="178" rx="14" ry="9" fill="${pal.dark}" opacity="0.3" />
        <ellipse cx="252" cy="178" rx="14" ry="9" fill="${pal.dark}" opacity="0.3" />

        <!-- Cute Belly Patch on Torso -->
        <path d="M 200,235 C 238,235 254,260 254,295 C 254,335 235,355 200,355 C 165,355 146,335 146,295 C 146,260 162,235 200,235 Z"
              fill="url(#bellyGrad_${monster.color})" 
              stroke="${pal.dark}" 
              stroke-width="3" 
              opacity="0.9" />

        <!-- Cute Belly Freckles / Spots -->
        <circle cx="188" cy="275" r="4.5" fill="${pal.dark}" opacity="0.35"/>
        <circle cx="212" cy="285" r="4" fill="${pal.dark}" opacity="0.35"/>
        <circle cx="196" cy="315" r="5" fill="${pal.dark}" opacity="0.35"/>
      </g>
    `;
  }

  // 7. Bottoms (Trousers, Shorts, Dress fitted to lower torso)
  renderBottoms(monster) {
    if (!monster.clothesBottom || monster.clothesBottom === 'none') return '';
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
          <circle cx="152" cy="324" r="3.5" fill="#ffffff" opacity="0.5"/>
          <circle cx="248" cy="324" r="3.5" fill="#ffffff" opacity="0.5"/>
        </g>
      `;
    } else if (monster.clothesBottom === 'dress') {
      return `
        <g class="monster-clothing-bottoms">
          <path d="M 138,245 Q 90,360 102,372 Q 200,388 298,372 Q 310,360 262,245 Z" 
                fill="${color}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          <!-- Ruffle waves at hem -->
          <path d="M 112,362 Q 132,348 152,362 Q 172,348 192,362 Q 212,348 232,362 Q 252,348 272,362 Q 292,348 302,362" 
                fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
          <ellipse cx="200" cy="250" rx="58" ry="8" fill="#ffffff" opacity="0.4"/>
        </g>
      `;
    }
    return '';
  }

  // 8. Tops (T-shirt, Shirt, Jacket fitted to torso)
  renderTops(monster) {
    if (!monster.clothesTop || monster.clothesTop === 'none') return '';
    const color = this.getClothColor(monster.clothesTopColor, '#2563eb');

    if (monster.clothesTop === 'tshirt') {
      return `
        <g class="monster-clothing-tops">
          <path d="M 142,215 Q 200,230 258,215 L 292,255 L 268,266 L 258,310 L 142,310 L 132,266 L 108,255 Z" 
                fill="${color}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          <!-- Collar ribbing -->
          <path d="M 174,218 Q 200,235 226,218" fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
          <!-- Gold Star Emblem -->
          <polygon points="200,248 203,256 212,257 205,263 207,271 200,267 193,271 195,263 188,257 197,256" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
        </g>
      `;
    } else if (monster.clothesTop === 'shirt') {
      return `
        <g class="monster-clothing-tops">
          <path d="M 142,215 L 258,215 L 292,255 L 268,266 L 258,310 L 142,310 L 132,266 L 108,255 Z" 
                fill="${color}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          <!-- Pointed Collar -->
          <polygon points="174,215 200,238 188,215" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
          <polygon points="226,215 200,238 212,215" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
          <line x1="200" y1="238" x2="200" y2="310" stroke="#0f172a" stroke-width="3"/>
          <circle cx="200" cy="254" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <circle cx="200" cy="274" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <circle cx="200" cy="294" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
        </g>
      `;
    } else if (monster.clothesTop === 'jacket') {
      return `
        <g class="monster-clothing-tops">
          <path d="M 138,215 L 262,215 L 296,258 L 270,270 L 260,314 L 140,314 L 130,270 L 104,258 Z" 
                fill="${color}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          <!-- Open Lapels & Zipper Track -->
          <path d="M 174,215 L 186,314" stroke="#0f172a" stroke-width="4"/>
          <path d="M 226,215 L 214,314" stroke="#0f172a" stroke-width="4"/>
          <polygon points="174,215 186,250 162,225" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
          <polygon points="226,215 214,250 238,225" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
          <rect x="146" y="278" width="22" height="15" rx="3" fill="none" stroke="#0f172a" stroke-width="2.5"/>
          <rect x="232" y="278" width="22" height="15" rx="3" fill="none" stroke="#0f172a" stroke-width="2.5"/>
        </g>
      `;
    }
    return '';
  }

  // 9. Arms & Gloves (Physically connected to shoulders)
  renderArms(monster, pal) {
    const count = monster.armsCount || 2; // 2, 3, 'many'
    const length = monster.armsLength || 'short';
    const hasGloves = !!monster.specialGloves;
    const gloveColor = this.getClothColor(monster.specialGlovesColor || 'green', '#16a34a');

    // Arm Reach Factors
    const armFactor = length === 'long' ? 1.35 : 1.0;

    let armConfigs = [];
    if (count === 2) {
      armConfigs = [
        { side: 'left',  shX: 122, shY: 224, handX: 62 * armFactor,  handY: 35 * armFactor, rot: -28, flip: false },
        { side: 'right', shX: 278, shY: 224, handX: 62 * armFactor,  handY: -35 * armFactor, rot: 28, flip: true }
      ];
    } else if (count === 3) {
      armConfigs = [
        { side: 'left',  shX: 122, shY: 215, handX: 65 * armFactor, handY: -30 * armFactor, rot: -42, flip: false },
        { side: 'left',  shX: 124, shY: 265, handX: 58 * armFactor, handY: 35 * armFactor,  rot: -12, flip: false },
        { side: 'right', shX: 278, shY: 224, handX: 62 * armFactor, handY: 35 * armFactor,  rot: 28,  flip: true }
      ];
    } else { // 'many' (4 well-organized arms)
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
              <!-- Arm Limb -->
              <path d="M ${cfg.shX},${cfg.shY} Q ${midX},${midY} ${targetX},${targetY}" 
                    fill="none" stroke="${pal.main}" stroke-width="22" stroke-linecap="round"/>
              <path d="M ${cfg.shX},${cfg.shY} Q ${midX},${midY} ${targetX},${targetY}" 
                    fill="none" stroke="${pal.stroke}" stroke-width="4.5" stroke-linecap="round"/>
              
              <!-- Hand / Paws / Gloves -->
              <g transform="translate(${targetX}, ${targetY})">
                ${hasGloves ? `
                  <circle cx="0" cy="0" r="16" fill="${gloveColor}" stroke="${pal.stroke}" stroke-width="3.5"/>
                  <circle cx="${dir * 8}" cy="-8" r="6.5" fill="${gloveColor}" stroke="${pal.stroke}" stroke-width="2"/>
                  <rect x="-12" y="6" width="24" height="7" rx="3" fill="#ffffff" stroke="${pal.stroke}" stroke-width="2"/>
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

  // 10. Eyes (Placed naturally inside the head)
  renderEyes(monster) {
    const count = monster.eyesCount || 2; // 1, 2, 3
    const size = monster.eyesSize || 'big'; // 'big', 'small'
    
    let eyeConfigs = [];

    if (count === 1) {
      // One large centered eye
      const r = size === 'big' ? 28 : 19;
      eyeConfigs = [{ cx: 200, cy: 144, r: r }];
    } else if (count === 2) {
      // Two symmetrical natural eyes
      const r = size === 'big' ? 21 : 14.5;
      eyeConfigs = [
        { cx: 168, cy: 144, r: r },
        { cx: 232, cy: 144, r: r }
      ];
    } else { // 3 eyes arranged across the forehead naturally
      const r = size === 'big' ? 17.5 : 12.5;
      eyeConfigs = [
        { cx: 146, cy: 148, r: r },
        { cx: 200, cy: 138, r: r * 1.05 },
        { cx: 254, cy: 148, r: r }
      ];
    }

    return `
      <g class="monster-eyes-group">
        ${eyeConfigs.map((eye, idx) => `
          <g class="monster-single-eye eye-idx-${idx}">
            <!-- White Sclera -->
            <ellipse cx="${eye.cx}" cy="${eye.cy}" rx="${eye.r}" ry="${eye.r * 1.05}" 
                     fill="#ffffff" stroke="#0f172a" stroke-width="3.5" />
            <!-- Iris (Deep cartoon cyan/blue) -->
            <circle cx="${eye.cx}" cy="${eye.cy + 1.5}" r="${eye.r * 0.58}" fill="#0284c7" />
            <!-- Pupil (Jet Black) -->
            <circle cx="${eye.cx}" cy="${eye.cy + 1.5}" r="${eye.r * 0.42}" fill="#0f172a" />
            <!-- Glossy Light Highlights -->
            <circle cx="${eye.cx - eye.r * 0.22}" cy="${eye.cy - eye.r * 0.22}" r="${eye.r * 0.22}" fill="#ffffff" />
            <circle cx="${eye.cx + eye.r * 0.24}" cy="${eye.cy + eye.r * 0.24}" r="${eye.r * 0.11}" fill="#ffffff" />
            <!-- Eyelid / Brow Arch -->
            <path d="M ${eye.cx - eye.r * 0.95},${eye.cy - eye.r * 0.75} Q ${eye.cx},${eye.cy - eye.r * 1.25} ${eye.cx + eye.r * 0.95},${eye.cy - eye.r * 0.75}" 
                  fill="none" stroke="#0f172a" stroke-width="3.2" stroke-linecap="round"/>
          </g>
        `).join('')}
      </g>
    `;
  }

  // 11. Glasses (Fits cleanly across the eyes)
  renderGlasses(monster) {
    if (!monster.accessories || !monster.accessories.includes('glasses')) return '';
    return `
      <g class="accessory-glasses" transform="translate(200, 144)">
        <!-- Left Frame -->
        <circle cx="-35" cy="0" r="25" fill="rgba(255,255,255,0.35)" stroke="#0f172a" stroke-width="6"/>
        <!-- Right Frame -->
        <circle cx="35" cy="0" r="25" fill="rgba(255,255,255,0.35)" stroke="#0f172a" stroke-width="6"/>
        <!-- Bridge -->
        <path d="M -10,-2 Q 0,-8 10,-2" fill="none" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
        <!-- Lens Glare -->
        <line x1="-45" y1="-10" x2="-25" y2="10" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="25" y1="-10" x2="45" y2="10" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
      </g>
    `;
  }

  // 12. Nose (Always centered between eyes and mouth)
  renderNose(monster, pal) {
    const size = monster.noseSize || 'small';
    if (size === 'big') {
      return `
        <g class="monster-nose-group">
          <!-- Big round cheerful schnoz -->
          <ellipse cx="200" cy="174" rx="16" ry="12" fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="3.5"/>
          <ellipse cx="195" cy="170" rx="5" ry="3.5" fill="#ffffff" opacity="0.6"/>
        </g>
      `;
    } else {
      return `
        <g class="monster-nose-group">
          <!-- Small cute button nose -->
          <ellipse cx="200" cy="172" rx="7.5" ry="5.5" fill="${pal.dark}" stroke="${pal.stroke}" stroke-width="3"/>
          <circle cx="198" cy="170" r="2" fill="#ffffff" opacity="0.6"/>
        </g>
      `;
    }
  }

  // 13. Mouth & Teeth (Mouth positioned naturally below nose, Teeth fully contained inside)
  renderMouthAndTeeth(monster) {
    const mouthType = monster.mouthType || 'big'; // 'big', 'small', 'scary'
    const teethType = monster.teethType || 'sharp'; // 'sharp', 'big', 'small', 'none'

    let mouthCavity = '';
    let teethItems = '';

    if (mouthType === 'big') {
      // Big happy open cartoon mouth
      mouthCavity = `
        <path d="M 155,194 Q 200,246 245,194 Z" fill="#e11d48" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
        <!-- Big Pink Tongue -->
        <path d="M 175,224 Q 200,202 225,224 Q 200,246 175,224 Z" fill="#fb7185"/>
      `;

      if (teethType === 'sharp') {
        teethItems = `
          <!-- Top fangs -->
          <polygon points="172,194 179,208 186,194" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="193,194 200,211 207,194" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="214,194 221,208 228,194" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <!-- Bottom fangs -->
          <polygon points="182,232 189,220 196,232" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="204,232 211,220 218,232" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
        `;
      } else if (teethType === 'big') {
        teethItems = `
          <!-- Big top buck teeth -->
          <rect x="189" y="194" width="10" height="14" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
          <rect x="201" y="194" width="10" height="14" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
        `;
      } else if (teethType === 'small') {
        teethItems = `
          <!-- Row of small neat white teeth beads -->
          <circle cx="176" cy="197" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="186" cy="197" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="196" cy="197" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="204" cy="197" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="214" cy="197" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="224" cy="197" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
        `;
      }
    } else if (mouthType === 'small') {
      // Small cute smile
      mouthCavity = `
        <path d="M 176,196 Q 200,222 224,196 Z" fill="#be123c" stroke="#0f172a" stroke-width="4" stroke-linejoin="round"/>
        <path d="M 188,212 Q 200,204 212,212 Q 200,222 188,212 Z" fill="#fb7185"/>
      `;

      if (teethType === 'sharp') {
        teethItems = `
          <polygon points="190,196 195,205 200,196" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <polygon points="200,196 205,205 210,196" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
        `;
      } else if (teethType === 'big') {
        teethItems = `
          <rect x="194" y="196" width="6" height="8" rx="2" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <rect x="200" y="196" width="6" height="8" rx="2" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
        `;
      } else if (teethType === 'small') {
        teethItems = `
          <circle cx="193" cy="198" r="2.5" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="200" cy="198" r="2.5" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <circle cx="207" cy="198" r="2.5" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
        `;
      }
    } else { // 'scary'
      // Expressive scary monster maw
      mouthCavity = `
        <path d="M 148,194 Q 200,185 252,194 Q 242,242 200,238 Q 158,242 148,194 Z" 
              fill="#881337" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
      `;

      if (teethType === 'sharp') {
        teethItems = `
          <!-- Menacing triangular fangs -->
          <polygon points="156,194 164,212 172,193" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="178,191 187,218 196,190" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="204,190 213,218 222,191" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="228,193 236,212 244,194" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <!-- Bottom fangs -->
          <polygon points="166,232 175,214 184,233" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="192,236 200,212 208,236" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="216,233 225,214 234,232" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
        `;
      } else if (teethType === 'big') {
        teethItems = `
          <rect x="184" y="190" width="14" height="18" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
          <rect x="202" y="190" width="14" height="18" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
        `;
      } else if (teethType === 'small') {
        teethItems = `
          <polygon points="158,194 164,204 170,193" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <polygon points="174,192 180,204 186,191" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <polygon points="190,190 196,204 202,190" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <polygon points="206,190 212,204 218,191" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <polygon points="222,192 228,204 234,193" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
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

  // 14. Neck Accessories (Scarf, Bow)
  renderNeckAccessories(monster) {
    if (!monster.accessories || !Array.isArray(monster.accessories)) return '';
    const accColors = monster.accessoryColors || {};

    let html = '';
    if (monster.accessories.includes('scarf')) {
      const scarfColor = this.getClothColor(accColors.scarf || 'red', '#dc2626');
      html += `
        <g class="accessory-scarf" transform="translate(200, 216)">
          <path d="M -58,-8 Q 0,22 58,-8 Q 0,38 -58,-8 Z" 
                fill="${scarfColor}" stroke="#0f172a" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M 18,12 L 32,82 L 54,78 L 42,12 Z" 
                fill="${scarfColor}" stroke="#0f172a" stroke-width="4" stroke-linejoin="round"/>
          <line x1="22" y1="32" x2="44" y2="32" stroke="#ffffff" stroke-width="4"/>
          <line x1="25" y1="50" x2="48" y2="50" stroke="#ffffff" stroke-width="4"/>
          <line x1="28" y1="68" x2="51" y2="68" stroke="#ffffff" stroke-width="4"/>
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

    return html;
  }

  // 15. Cape Front Clasp
  renderCapeFront(monster) {
    return `
      <g class="monster-cape-front">
        <path d="M 134,212 Q 200,232 266,212" fill="none" stroke="#be123c" stroke-width="7" stroke-linecap="round"/>
        <circle cx="200" cy="222" r="8.5" fill="#facc15" stroke="#ca8a04" stroke-width="3"/>
        <polygon points="200,217 202,221 206,222 203,225 204,229 200,227 196,229 197,225 194,222 198,221" fill="#ffffff" />
      </g>
    `;
  }

  // 16. Head Accessories (Crown, Hat, Cap positioned on top of head)
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
          <circle cx="0" cy="-34" r="5" fill="#ef4444" stroke="#78350f" stroke-width="1.5"/>
          <circle cx="-34" cy="-30" r="4.5" fill="#3b82f6" stroke="#78350f" stroke-width="1.5"/>
          <circle cx="34" cy="-30" r="4.5" fill="#10b981" stroke="#78350f" stroke-width="1.5"/>
        </g>
      `;
    }

    if (monster.accessories.includes('hat')) {
      const hatColor = this.getClothColor(accColors.hat || 'yellow', '#eab308');
      html += `
        <g class="accessory-hat" transform="translate(200, 96)">
          <ellipse cx="0" cy="8" rx="60" ry="11" fill="${hatColor}" stroke="#0f172a" stroke-width="4"/>
          <path d="M -32,8 L -24,-58 L 24,-58 L 32,8 Z" fill="${hatColor}" stroke="#0f172a" stroke-width="4"/>
          <rect x="-32" y="-4" width="64" height="12" fill="#ef4444" stroke="#0f172a" stroke-width="2"/>
        </g>
      `;
    }

    if (monster.accessories.includes('cap')) {
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
}

window.monsterRenderer = new MonsterRenderer();
