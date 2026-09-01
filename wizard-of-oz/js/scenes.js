/**
 * MASTER STORYBOOK SCENE & CHARACTER ILLUSTRATION ENGINE
 * High-Fidelity Children's Picture Book Art Pipeline
 * Complete Layered Environments (Background, Midground, Foreground, Characters & Atmosphere)
 */

export const SceneRenderer = {
  /**
   * Render complete high-quality illustrated story scene
   */
  renderScene(sceneData) {
    if (sceneData.isStoryStop) {
      return this.renderStoryStopVisual(sceneData);
    }

    const visualKey = sceneData.visualElements ? sceneData.visualElements.bg : 'kansas_farm';
    switch (visualKey) {
      case 'kansas_farm':
        return this.renderKansasFarm(sceneData);
      case 'tornado_sky':
        return this.renderTornadoSky(sceneData);
      case 'strange_land':
        return this.renderStrangeLand(sceneData);
      case 'yellow_road_scarecrow':
        return this.renderScarecrowScene(sceneData);
      case 'forest_tinman':
        return this.renderTinManScene(sceneData);
      case 'forest_lion':
        return this.renderLionScene(sceneData);
      case 'emerald_city_gates':
        return this.renderEmeraldCityGates(sceneData);
      case 'wizard_throne':
        return this.renderWizardThrone(sceneData);
      case 'dark_forest_witch':
        return this.renderWitchScene(sceneData);
      case 'friends_celebration':
        return this.renderCelebrationScene(sceneData);
      case 'kansas_home_safe':
        return this.renderHomeSafeScene(sceneData);
      default:
        return this.renderKansasFarm(sceneData);
    }
  },

  // =========================================================================
  // 1. SCENE 1: KANSAS FARM (DOROTHY'S HOME & GATHERING STORM)
  // =========================================================================
  renderKansasFarm(scene) {
    return `
      <div class="scene-stage kansas-stage">
        <svg viewBox="0 0 1200 675" class="stage-svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="ks_skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1e293b" />
              <stop offset="40%" stop-color="#475569" />
              <stop offset="75%" stop-color="#64748b" />
              <stop offset="100%" stop-color="#94a3b8" />
            </linearGradient>
            <linearGradient id="ks_cloudGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#0f172a" stop-opacity="0.95" />
              <stop offset="100%" stop-color="#334155" stop-opacity="0.8" />
            </linearGradient>
            <linearGradient id="ks_prairieGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#b45309" />
              <stop offset="100%" stop-color="#78350f" />
            </linearGradient>
            <linearGradient id="ks_prairieGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#d97706" />
              <stop offset="100%" stop-color="#92400e" />
            </linearGradient>
            <linearGradient id="ks_houseWall" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#f8fafc" />
              <stop offset="100%" stop-color="#cbd5e1" />
            </linearGradient>
            <linearGradient id="ks_roofGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#991b1b" />
              <stop offset="100%" stop-color="#450a0a" />
            </linearGradient>
            <filter id="ks_shadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="8" flood-color="#000" flood-opacity="0.4" />
            </filter>
          </defs>

          <!-- Sky Background -->
          <rect width="1200" height="675" fill="url(#ks_skyGrad)" />

          <!-- Distant Storm Lightning Glow -->
          <path d="M 850,60 L 820,160 L 860,180 L 810,290" stroke="#fef08a" stroke-width="3" fill="none" opacity="0.4" class="anim-lightning" />

          <!-- Layered Ominous Clouds -->
          <g class="anim-cloud-slow">
            <!-- Back Cloud Layer -->
            <path d="M -50,140 Q 100,50 250,90 Q 400,30 550,80 Q 700,40 850,90 Q 1000,30 1150,80 Q 1250,110 1300,160 L 1300,260 L -50,260 Z" fill="#0f172a" opacity="0.85" />
            <!-- Heavy Storm Cloud Front -->
            <path d="M 50,180 Q 200,80 380,130 Q 560,70 720,120 Q 900,80 1080,140 Q 1200,160 1250,230 L 1250,320 L -20,320 Z" fill="url(#ks_cloudGrad)" />
          </g>

          <!-- Distant Rolling Prairie Hills -->
          <path d="M 0,380 Q 300,330 650,370 T 1200,350 L 1200,675 L 0,675 Z" fill="url(#ks_prairieGrad1)" opacity="0.9" />
          <path d="M 0,440 Q 380,390 780,430 T 1200,410 L 1200,675 L 0,675 Z" fill="url(#ks_prairieGrad2)" />

          <!-- Distant Windmill (Blades spinning fast in storm) -->
          <g transform="translate(380, 260)">
            <polygon points="18,170 38,170 32,60 24,60" fill="#475569" stroke="#1e293b" stroke-width="2" />
            <circle cx="28" cy="60" r="6" fill="#0f172a" />
            <g class="anim-spin-fast" style="transform-origin: 28px 60px;">
              <line x1="28" y1="60" x2="28" y2="0" stroke="#334155" stroke-width="3.5" />
              <line x1="28" y1="60" x2="28" y2="120" stroke="#334155" stroke-width="3.5" />
              <line x1="28" y1="60" x2="-32" y2="60" stroke="#334155" stroke-width="3.5" />
              <line x1="28" y1="60" x2="88" y2="60" stroke="#334155" stroke-width="3.5" />
              <polygon points="28,0 36,30 20,30" fill="#64748b" />
              <polygon points="28,120 36,90 20,90" fill="#64748b" />
              <polygon points="-32,60 -2,68 -2,52" fill="#64748b" />
              <polygon points="88,60 58,68 58,52" fill="#64748b" />
            </g>
          </g>

          <!-- Kansas Farmhouse (Detailed with Porch, Chimney, Windows) -->
          <g transform="translate(80, 260)" filter="url(#ks_shadow)">
            <!-- Stone Chimney -->
            <rect x="25" y="10" width="30" height="70" fill="#78350f" stroke="#451a03" stroke-width="2" rx="2" />
            <!-- Main House Structure -->
            <rect x="0" y="80" width="260" height="170" fill="url(#ks_houseWall)" stroke="#334155" stroke-width="4" rx="4" />
            <!-- Planks horizontal lines -->
            <line x1="0" y1="115" x2="260" y2="115" stroke="#cbd5e1" stroke-width="2" />
            <line x1="0" y1="150" x2="260" y2="150" stroke="#cbd5e1" stroke-width="2" />
            <line x1="0" y1="185" x2="260" y2="185" stroke="#cbd5e1" stroke-width="2" />
            <line x1="0" y1="220" x2="260" y2="220" stroke="#cbd5e1" stroke-width="2" />

            <!-- Pitched Roof with Shingles -->
            <polygon points="-25,80 130,-25 285,80" fill="url(#ks_roofGrad)" stroke="#450a0a" stroke-width="4" />
            <!-- Porch Roof & Posts -->
            <polygon points="-10,165 140,140 140,155 -10,180" fill="#991b1b" stroke="#450a0a" stroke-width="2" />
            <rect x="5" y="175" width="8" height="75" fill="#f8fafc" stroke="#334155" stroke-width="2" />
            <rect x="65" y="170" width="8" height="80" fill="#f8fafc" stroke="#334155" stroke-width="2" />
            <rect x="125" y="165" width="8" height="85" fill="#f8fafc" stroke="#334155" stroke-width="2" />

            <!-- Wooden Door -->
            <rect x="80" y="160" width="45" height="90" fill="#78350f" stroke="#451a03" stroke-width="3" rx="2" />
            <circle cx="118" cy="205" r="4" fill="#fbbf24" stroke="#b45309" stroke-width="1" />

            <!-- Windows with Warm Lamp Light / Storm Reflection -->
            <g transform="translate(25, 120)">
              <rect width="36" height="42" fill="#fef08a" stroke="#0284c7" stroke-width="3" rx="2" />
              <line x1="18" y1="0" x2="18" y2="42" stroke="#0284c7" stroke-width="2" />
              <line x1="0" y1="21" x2="36" y2="21" stroke="#0284c7" stroke-width="2" />
            </g>
            <g transform="translate(190, 120)">
              <rect width="36" height="42" fill="#fef08a" stroke="#0284c7" stroke-width="3" rx="2" />
              <line x1="18" y1="0" x2="18" y2="42" stroke="#0284c7" stroke-width="2" />
              <line x1="0" y1="21" x2="36" y2="21" stroke="#0284c7" stroke-width="2" />
            </g>
          </g>

          <!-- Rustic Fence Blowing in Gale -->
          <g stroke="#f1f5f9" stroke-width="4" stroke-linecap="round" opacity="0.8">
            <line x1="0" y1="520" x2="480" y2="510" />
            <line x1="0" y1="545" x2="480" y2="535" />
            <line x1="40" y1="490" x2="35" y2="560" stroke-width="6" />
            <line x1="120" y1="485" x2="115" y2="560" stroke-width="6" />
            <line x1="200" y1="480" x2="192" y2="560" stroke-width="6" />
            <line x1="280" y1="475" x2="270" y2="560" stroke-width="6" />
            <line x1="360" y1="470" x2="350" y2="560" stroke-width="6" />
            <line x1="440" y1="465" x2="430" y2="560" stroke-width="6" />
          </g>

          <!-- Dynamic Wind Streaks & Blowing Grass Particles -->
          <g class="anim-wind-gusts">
            <path d="M 200,220 Q 500,180 800,230 T 1250,200" stroke="#ffffff" stroke-width="3.5" stroke-dasharray="25,15" fill="none" opacity="0.6" />
            <path d="M 50,340 Q 400,280 750,330 T 1200,300" stroke="#e2e8f0" stroke-width="4" stroke-dasharray="35,18" fill="none" opacity="0.75" />
            <path d="M 300,460 Q 650,420 950,470 T 1250,440" stroke="#ffffff" stroke-width="4.5" stroke-dasharray="40,20" fill="none" opacity="0.7" />
          </g>

          <!-- MAIN FOCAL CHARACTERS: DOROTHY & TOTO IN WIND -->
          <!-- Dorothy Looking at Sky in Fear / Holding Hair -->
          <g class="character-actor anim-breath" transform="translate(740, 310) scale(1.15)">
            ${this.renderDorothyScaredInStorm()}
          </g>

          <!-- Toto Clinging Close / Barking in Wind -->
          <g class="character-actor anim-shake-wind" transform="translate(640, 480) scale(1.1)">
            ${this.renderTotoScaredInStorm()}
          </g>
        </svg>
      </div>
    `;
  },

  // =========================================================================
  // 2. SCENE 2: THE TORNADO (HOUSE FLYING IN TEMPEST)
  // =========================================================================
  renderTornadoSky(scene) {
    return `
      <div class="scene-stage tornado-stage">
        <svg viewBox="0 0 1200 675" class="stage-svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="tor_vortexGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#020617" />
              <stop offset="50%" stop-color="#0f172a" />
              <stop offset="85%" stop-color="#1e293b" />
              <stop offset="100%" stop-color="#334155" />
            </radialGradient>
            <linearGradient id="tor_funnelBody" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#1e293b" stop-opacity="0.95" />
              <stop offset="30%" stop-color="#475569" stop-opacity="0.9" />
              <stop offset="70%" stop-color="#334155" stop-opacity="0.9" />
              <stop offset="100%" stop-color="#0f172a" stop-opacity="0.95" />
            </linearGradient>
            <filter id="tor_glow">
              <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <!-- Dark Tempest Sky -->
          <rect width="1200" height="675" fill="url(#tor_vortexGrad)" />

          <!-- Distant Cloud Vortex Rings -->
          <g class="anim-spin-slow" style="transform-origin: 600px 300px;">
            <circle cx="600" cy="300" r="450" stroke="#334155" stroke-width="40" stroke-dasharray="120,60" fill="none" opacity="0.3" />
            <circle cx="600" cy="300" r="350" stroke="#475569" stroke-width="50" stroke-dasharray="100,50" fill="none" opacity="0.4" />
            <circle cx="600" cy="300" r="250" stroke="#64748b" stroke-width="60" stroke-dasharray="80,40" fill="none" opacity="0.5" />
          </g>

          <!-- Giant Colossal Tornado Funnel in Center -->
          <g class="anim-tornado-funnel" transform="translate(600, 320)">
            <!-- Outer Funnel Swirls -->
            <path d="M -450,-340 Q 0,-310 450,-340 L 180,320 Q 0,335 -180,320 Z" fill="url(#tor_funnelBody)" opacity="0.85" />
            <ellipse cx="0" cy="-280" rx="380" ry="55" fill="#334155" opacity="0.8" />
            <ellipse cx="0" cy="-180" rx="300" ry="42" fill="#1e293b" opacity="0.85" />
            <ellipse cx="0" cy="-80" rx="220" ry="32" fill="#334155" opacity="0.9" />
            <ellipse cx="0" cy="20" rx="160" ry="25" fill="#1e293b" opacity="0.95" />
            <ellipse cx="0" cy="120" rx="110" ry="18" fill="#475569" opacity="0.95" />
            <ellipse cx="0" cy="220" rx="65" ry="12" fill="#64748b" opacity="0.98" />
            <ellipse cx="0" cy="300" rx="25" ry="8" fill="#cbd5e1" />
          </g>

          <!-- Swirling Whirlwind Lightning Flashes -->
          <path d="M 450,100 L 520,220 L 480,250 L 560,380" stroke="#bae6fd" stroke-width="4" fill="none" opacity="0.7" class="anim-lightning" />
          <path d="M 780,80 L 710,190 L 740,210 L 680,320" stroke="#bae6fd" stroke-width="4" fill="none" opacity="0.6" class="anim-lightning" />

          <!-- CINEMATIC TILTED FLYING FARMHOUSE WITH DOROTHY & TOTO CLINGING -->
          <g class="anim-house-floating" transform="translate(380, 200) rotate(-18)">
            <!-- Motion Blur Shadow -->
            <ellipse cx="100" cy="180" rx="120" ry="25" fill="#020617" opacity="0.5" />

            <!-- House Body -->
            <rect x="0" y="40" width="180" height="120" fill="#f8fafc" stroke="#1e293b" stroke-width="5" rx="4" />
            <!-- Roof -->
            <polygon points="-20,40 90,-35 200,40" fill="#dc2626" stroke="#991b1b" stroke-width="5" />
            <!-- Chimney with Smoke Trail -->
            <rect x="25" y="-15" width="24" height="45" fill="#78350f" stroke="#451a03" stroke-width="2" />
            <!-- Front Door -->
            <rect x="65" y="85" width="50" height="75" fill="#78350f" stroke="#451a03" stroke-width="3" />

            <!-- Open Window with Dorothy & Toto Clinging inside -->
            <rect x="15" y="65" width="45" height="50" fill="#0f172a" stroke="#0284c7" stroke-width="3" rx="2" />
            <!-- Dorothy Inside Window (Terrified, screaming "HELP!", holding Toto) -->
            <g transform="translate(18, 68) scale(0.65)">
              ${this.renderDorothyWindowClinging()}
            </g>
          </g>

          <!-- Flying Debris in Vortex (Barn Boards, Fence Posts, Hay Bales, Trees) -->
          <g class="anim-debris">
            <!-- Flying Wooden Fence -->
            <g transform="translate(850, 160) rotate(45) scale(0.9)">
              <line x1="0" y1="0" x2="100" y2="0" stroke="#f1f5f9" stroke-width="5" />
              <line x1="20" y1="-20" x2="20" y2="20" stroke="#f1f5f9" stroke-width="5" />
              <line x1="80" y1="-20" x2="80" y2="20" stroke="#f1f5f9" stroke-width="5" />
            </g>
            <!-- Flying Hay Bale -->
            <rect x="220" y="380" width="60" height="40" fill="#eab308" stroke="#a16207" stroke-width="3" rx="6" transform="rotate(-30, 250, 400)" />
            <!-- Flying Tree Branch -->
            <path d="M 820,420 Q 860,390 910,430 M 860,390 L 870,360" stroke="#78350f" stroke-width="6" stroke-linecap="round" fill="none" transform="rotate(25, 860, 400)" />
          </g>
        </svg>
      </div>
    `;
  },

  // =========================================================================
  // 3. SCENE 3: A STRANGE PLACE (BEAUTIFUL MUNCHKINLAND WONDER)
  // =========================================================================
  renderStrangeLand(scene) {
    return `
      <div class="scene-stage munchkin-stage">
        <svg viewBox="0 0 1200 675" class="stage-svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="ml_skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0284c7" />
              <stop offset="45%" stop-color="#38bdf8" />
              <stop offset="75%" stop-color="#bae6fd" />
              <stop offset="100%" stop-color="#f0fdf4" />
            </linearGradient>
            <linearGradient id="ml_hillGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#4ade80" />
              <stop offset="100%" stop-color="#16a34a" />
            </linearGradient>
            <linearGradient id="ml_hillGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#22c55e" />
              <stop offset="100%" stop-color="#15803d" />
            </linearGradient>
            <linearGradient id="ml_yellowRoad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#f59e0b" />
              <stop offset="50%" stop-color="#fde047" />
              <stop offset="100%" stop-color="#d97706" />
            </linearGradient>
            <radialGradient id="ml_sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="60%" stop-color="#facc15" stop-opacity="0.8" />
              <stop offset="100%" stop-color="#facc15" stop-opacity="0" />
            </radialGradient>
          </defs>

          <!-- Bright Azure Magical Sky -->
          <rect width="1200" height="675" fill="url(#ml_skyGrad)" />

          <!-- Radiant Golden Sun & Sunbeams -->
          <circle cx="1020" cy="110" r="140" fill="url(#ml_sunGlow)" />
          <circle cx="1020" cy="110" r="55" fill="#fef08a" />

          <!-- Fluffy Storybook Clouds -->
          <g class="anim-cloud-slow">
            <path d="M 80,100 Q 130,50 200,70 Q 270,40 340,80 Q 400,60 450,110 Q 420,150 350,160 L 100,160 Z" fill="#ffffff" opacity="0.95" />
            <path d="M 580,70 Q 630,30 690,50 Q 750,20 810,60 Q 860,40 900,90 Q 880,130 810,130 L 600,130 Z" fill="#ffffff" opacity="0.9" />
          </g>

          <!-- Distant Purple Fantasy Mountain Peaks -->
          <polygon points="300,320 420,160 540,320" fill="#a855f7" opacity="0.4" />
          <polygon points="460,320 580,180 700,320" fill="#c084fc" opacity="0.35" />
          <polygon points="180,320 300,190 420,320" fill="#9333ea" opacity="0.3" />

          <!-- Rolling Emerald & Lime Fantasy Hills -->
          <path d="M 0,330 Q 300,260 650,310 T 1200,280 L 1200,675 L 0,675 Z" fill="url(#ml_hillGrad1)" opacity="0.8" />
          <path d="M 0,390 Q 350,330 750,380 T 1200,350 L 1200,675 L 0,675 Z" fill="url(#ml_hillGrad2)" />

          <!-- Landed Kansas House with Witch's Feet & Ruby Slippers -->
          <g transform="translate(150, 310)" class="anim-breath">
            <!-- House Body -->
            <rect x="0" y="40" width="160" height="110" fill="#fff1f2" stroke="#991b1b" stroke-width="4" rx="3" />
            <polygon points="-15,40 80,-30 175,40" fill="#dc2626" stroke="#7f1d1d" stroke-width="4" />
            <rect x="55" y="80" width="45" height="70" fill="#78350f" stroke="#451a03" stroke-width="2" />
            <!-- Two Striped Legs & Sparkling Ruby Slippers Poking Out -->
            <g transform="translate(30, 145)">
              <!-- Left Leg -->
              <rect x="0" y="0" width="16" height="25" fill="#000000" />
              <rect x="0" y="6" width="16" height="6" fill="#ffffff" />
              <rect x="0" y="18" width="16" height="6" fill="#ffffff" />
              <path d="M -8,22 Q 10,22 18,30 Q 8,36 -8,30 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="2" />
              <circle cx="5" cy="26" r="3" fill="#fef08a" class="anim-sparkle" />
              <!-- Right Leg -->
              <rect x="30" y="0" width="16" height="25" fill="#000000" />
              <rect x="30" y="6" width="16" height="6" fill="#ffffff" />
              <rect x="30" y="18" width="16" height="6" fill="#ffffff" />
              <path d="M 22,22 Q 40,22 48,30 Q 38,36 22,30 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="2" />
              <circle cx="35" cy="26" r="3" fill="#fef08a" class="anim-sparkle" />
            </g>
          </g>

          <!-- Beginning of the Yellow Brick Road (Curving from front to hills) -->
          <path d="M 520,380 Q 560,450 680,675 L 380,675 Q 480,480 490,380 Z" fill="url(#ml_yellowRoad)" stroke="#ca8a04" stroke-width="3" />

          <!-- Giant Magical Fantasy Flowers (Foreground Left & Right) -->
          ${this.renderFantasyFlora()}

          <!-- MAIN FOCAL CHARACTERS: DOROTHY WIDE-EYED IN WONDER & TOTO SNIFFING FLOWERS -->
          <!-- Dorothy in Wonder (Curious, amazed smile, hands spread open) -->
          <g class="character-actor anim-breath" transform="translate(680, 310) scale(1.15)">
            ${this.renderDorothyWonder()}
          </g>

          <!-- Happy Toto Wagging Tail beside Dorothy -->
          <g class="character-actor anim-wag" transform="translate(850, 450) scale(1.1)">
            ${this.renderTotoHappy()}
          </g>
        </svg>
      </div>
    `;
  },

  // =========================================================================
  // 4. SCENE 4: THE SCARECROW (CORNFIELD & YELLOW BRICK ROAD)
  // =========================================================================
  renderScarecrowScene(scene) {
    return `
      <div class="scene-stage scarecrow-stage">
        <svg viewBox="0 0 1200 675" class="stage-svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="sc_sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#38bdf8" />
              <stop offset="100%" stop-color="#dbeafe" />
            </linearGradient>
            <linearGradient id="sc_road" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#eab308" />
              <stop offset="50%" stop-color="#fef08a" />
              <stop offset="100%" stop-color="#ca8a04" />
            </linearGradient>
          </defs>

          <!-- Sky & Sunlit Farmland -->
          <rect width="1200" height="675" fill="url(#sc_sky)" />
          <path d="M 0,280 Q 300,230 650,270 T 1200,240 L 1200,675 L 0,675 Z" fill="#84cc16" />

          <!-- Rich Golden Cornfield (Midground Left) -->
          ${this.renderDenseCornfield(40, 160)}

          <!-- Yellow Brick Road Perspective (Winding to the right) -->
          <path d="M 620,260 L 680,260 L 1150,675 L 320,675 Z" fill="url(#sc_road)" stroke="#a16207" stroke-width="4" />
          <!-- Road Brick Patterns -->
          ${this.renderRoadBrickDetail()}

          <!-- Wooden Rail Fence behind Scarecrow -->
          <g stroke="#78350f" stroke-width="5" stroke-linecap="round" opacity="0.9">
            <line x1="80" y1="360" x2="480" y2="340" />
            <line x1="80" y1="400" x2="480" y2="380" />
            <line x1="120" y1="320" x2="120" y2="430" stroke-width="8" />
            <line x1="280" y1="310" x2="280" y2="430" stroke-width="8" />
            <line x1="440" y1="300" x2="440" y2="430" stroke-width="8" />
          </g>

          <!-- SCARECROW ON POLE (Looking stuck, head tilted, straw hands waving for help) -->
          <g class="character-actor anim-wobble" transform="translate(320, 200) scale(1.15)">
            ${this.renderScarecrowOnPole()}
          </g>

          <!-- DOROTHY & TOTO APPROACHING (Dorothy smiling warmly, reaching hand out) -->
          <g class="character-actor anim-breath" transform="translate(750, 310) scale(1.15)">
            ${this.renderDorothyFriendly()}
          </g>
          <g class="character-actor anim-wag" transform="translate(900, 460) scale(1.05)">
            ${this.renderTotoCurious()}
          </g>
        </svg>
      </div>
    `;
  },

  // =========================================================================
  // 5. SCENE 5: THE TIN MAN (RUSTED IN DEEP GREEN FOREST + OIL CAN)
  // =========================================================================
  renderTinManScene(scene) {
    return `
      <div class="scene-stage tinman-stage">
        <svg viewBox="0 0 1200 675" class="stage-svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="tm_forestDusk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#052e16" />
              <stop offset="50%" stop-color="#14532d" />
              <stop offset="100%" stop-color="#166534" />
            </linearGradient>
          </defs>

          <!-- Deep Emerald Forest Background -->
          <rect width="1200" height="675" fill="url(#tm_forestDusk)" />
          ${this.renderDeepForestCanopy()}

          <!-- Dappled Sunlight Shafts Through Trees -->
          <g opacity="0.25">
            <polygon points="200,0 280,0 450,675 320,675" fill="#fef08a" />
            <polygon points="650,0 720,0 900,675 780,675" fill="#fef08a" />
          </g>

          <!-- Yellow Brick Path Through Forest -->
          <path d="M 500,320 L 560,320 L 920,675 L 180,675 Z" fill="#eab308" stroke="#a16207" stroke-width="3" />

          <!-- TIN MAN (RUSTED STIFF: Arm raised in air holding axe, mouth open in "Help!") -->
          <g id="tinman-character" class="character-actor anim-stiff" transform="translate(440, 200) scale(1.2)">
            ${this.renderTinManRusted()}
          </g>

          <!-- INTERACTIVE PROMINENT OIL CAN ON TREE STUMP (Glow & Pulse) -->
          <g id="oil-can-interactive" class="interactive-object anim-pulse" transform="translate(680, 400)" style="cursor: pointer;">
            <circle cx="50" cy="50" r="55" fill="#fef08a" stroke="#ca8a04" stroke-width="4" opacity="0.95" />
            <!-- Metallic Oil Can -->
            <path d="M 28,68 L 72,68 L 64,40 L 36,40 Z" fill="#94a3b8" stroke="#334155" stroke-width="3" />
            <path d="M 50,40 L 50,18 L 84,6" stroke="#475569" stroke-width="5" fill="none" stroke-linecap="round" />
            <!-- Oil Droplet -->
            <circle cx="84" cy="6" r="5" fill="#0284c7" />
            <text x="50" y="92" font-size="14" font-weight="900" fill="#78350f" text-anchor="middle">TAP TO OIL!</text>
          </g>

          <!-- DOROTHY & SCARECROW WATCHING WITH COMPASSION -->
          <g class="character-actor anim-breath" transform="translate(800, 310) scale(1.1)">
            ${this.renderDorothyFriendly()}
          </g>
          <g class="character-actor anim-breath" transform="translate(940, 290) scale(1.05)">
            ${this.renderScarecrowWalking()}
          </g>
        </svg>
      </div>
    `;
  },

  // =========================================================================
  // 6. SCENE 6: THE COWARDLY LION (FOREST JUMP / SCARY TO TIMID)
  // =========================================================================
  renderLionScene(scene) {
    return `
      <div class="scene-stage lion-stage">
        <svg viewBox="0 0 1200 675" class="stage-svg" preserveAspectRatio="xMidYMid slice">
          <!-- Forest Environment Backdrop -->
          <rect width="1200" height="675" fill="#14532d" />
          ${this.renderDeepForestCanopy()}

          <!-- Yellow Brick Road -->
          <path d="M 440,320 L 520,320 L 820,675 L 80,675 Z" fill="#eab308" stroke="#a16207" stroke-width="3" />

          <!-- COWARDLY LION (Large, expressive, comic fright pose: paws up, big mane, timid eyes) -->
          <g class="character-actor anim-lion-roar" transform="translate(680, 190) scale(1.25)">
            ${this.renderLionCharacterExpressive()}
          </g>

          <!-- THE THREE FRIENDS REACTING (Scarecrow wobbly, Dorothy smiling, Tin Man holding axe) -->
          <g transform="translate(140, 290) scale(1.05)">
            <!-- Scarecrow -->
            <g transform="translate(0, -20)">${this.renderScarecrowWalking()}</g>
            <!-- Dorothy -->
            <g transform="translate(130, 20)">${this.renderDorothyFriendly()}</g>
            <!-- Tin Man (Mobile & Smiling) -->
            <g transform="translate(250, -10)">${this.renderTinManMobile()}</g>
            <!-- Toto -->
            <g transform="translate(100, 160)">${this.renderTotoCurious()}</g>
          </g>
        </svg>
      </div>
    `;
  },

  // =========================================================================
  // 7. SCENE 7: THE EMERALD CITY (MAJESTIC GREEN SPIRES & GATES)
  // =========================================================================
  renderEmeraldCityGates(scene) {
    return `
      <div class="scene-stage emerald-stage">
        <svg viewBox="0 0 1200 675" class="stage-svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="em_sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#022c22" />
              <stop offset="40%" stop-color="#065f46" />
              <stop offset="80%" stop-color="#10b981" />
              <stop offset="100%" stop-color="#a7f3d0" />
            </linearGradient>
            <radialGradient id="em_beaconGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#6ee7b7" />
              <stop offset="60%" stop-color="#10b981" stop-opacity="0.8" />
              <stop offset="100%" stop-color="#047857" stop-opacity="0" />
            </radialGradient>
          </defs>

          <!-- Glowing Green Sky -->
          <rect width="1200" height="675" fill="url(#em_sky)" />

          <!-- Radiant Emerald City Spires & Crystal Architecture -->
          <g transform="translate(420, 60)" class="anim-glow">
            <!-- Central Giant Crystal Spire -->
            <polygon points="180,-20 220,200 140,200" fill="#34d399" stroke="#065f46" stroke-width="4" />
            <polygon points="100,40 135,230 65,230" fill="#10b981" stroke="#065f46" stroke-width="3" />
            <polygon points="260,40 295,230 225,230" fill="#10b981" stroke="#065f46" stroke-width="3" />
            <polygon points="20,100 50,250 0,250" fill="#059669" stroke="#065f46" stroke-width="3" />
            <polygon points="340,100 370,250 320,250" fill="#059669" stroke="#065f46" stroke-width="3" />

            <!-- City Walls & Battlements -->
            <rect x="30" y="190" width="300" height="150" fill="#047857" stroke="#064e3b" stroke-width="5" rx="6" />
            <!-- Spires Top Crystal Jewels (Pulsing) -->
            <circle cx="180" cy="-20" r="16" fill="#a7f3d0" class="anim-sparkle" />
            <circle cx="100" cy="40" r="10" fill="#a7f3d0" class="anim-sparkle" />
            <circle cx="260" cy="40" r="10" fill="#a7f3d0" class="anim-sparkle" />
          </g>

          <!-- Massive Glowing Golden Gates with Lion Knockers -->
          <g transform="translate(500, 310)">
            <path d="M 0,170 L 0,70 Q 100,0 200,70 L 200,170 Z" fill="#064e3b" stroke="#34d399" stroke-width="7" />
            <!-- Golden Door Plates -->
            <rect x="15" y="60" width="75" height="100" fill="#047857" stroke="#fbbf24" stroke-width="2" />
            <rect x="110" y="60" width="75" height="100" fill="#047857" stroke="#fbbf24" stroke-width="2" />
            <!-- Golden Door Knockers -->
            <circle cx="52" cy="110" r="16" fill="#fbbf24" stroke="#78350f" stroke-width="3" />
            <circle cx="148" cy="110" r="16" fill="#fbbf24" stroke="#78350f" stroke-width="3" />
            <text x="100" y="45" font-size="16" font-weight="900" fill="#a7f3d0" text-anchor="middle" letter-spacing="1">KNOCK KNOCK</text>
          </g>

          <!-- Yellow Brick Road Leading Directly to Gate -->
          <path d="M 520,480 L 680,480 L 1100,675 L 100,675 Z" fill="#eab308" stroke="#ca8a04" stroke-width="4" />

          <!-- THE FOUR FRIENDS STANDING IN FOREGROUND GAZING IN AWE -->
          <g transform="translate(380, 430) scale(0.95)">
            <g transform="translate(-160, 0)">${this.renderScarecrowWalking()}</g>
            <g transform="translate(-40, 20)">${this.renderDorothyWonder()}</g>
            <g transform="translate(90, 0)">${this.renderTinManMobile()}</g>
            <g transform="translate(230, 10)">${this.renderLionBrave()}</g>
          </g>
        </svg>
      </div>
    `;
  },

  // =========================================================================
  // 8. SCENE 8: THE WIZARD'S THRONE (MAGICAL INNER CHAMBER)
  // =========================================================================
  renderWizardThrone(scene) {
    return `
      <div class="scene-stage wizard-stage">
        <svg viewBox="0 0 1200 675" class="stage-svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="wz_throne" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#022c22" />
              <stop offset="100%" stop-color="#064e3b" />
            </linearGradient>
            <radialGradient id="wz_magicAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#6ee7b7" />
              <stop offset="50%" stop-color="#10b981" stop-opacity="0.8" />
              <stop offset="100%" stop-color="#022c22" stop-opacity="0" />
            </radialGradient>
          </defs>

          <!-- Palatial Jade Chamber -->
          <rect width="1200" height="675" fill="url(#wz_throne)" />

          <!-- Colossal Fluted Jade Columns -->
          <rect x="60" y="0" width="90" height="675" fill="#047857" stroke="#065f46" stroke-width="5" />
          <rect x="1050" y="0" width="90" height="675" fill="#047857" stroke="#065f46" stroke-width="5" />

          <!-- Raised Dais & Grand Wizard Throne -->
          <g transform="translate(600, 200)" class="anim-float">
            <!-- Magic Aura Glow -->
            <circle cx="0" cy="0" r="160" fill="url(#wz_magicAura)" />
            <!-- The Great Wizard Figure (Expressive wise face, green wizard robes, top hat) -->
            <g transform="translate(-70, -100) scale(1.35)">
              ${this.renderWizardExpressive()}
            </g>
            <!-- Billowing Magic Emerald Smoke -->
            <ellipse cx="0" cy="140" rx="200" ry="35" fill="#34d399" opacity="0.45" class="anim-pulse" />
          </g>

          <!-- THE FOUR FRIENDS FACING THE WIZARD RESPECTFULLY -->
          <g transform="translate(240, 400) scale(0.9)">
            <g transform="translate(0, 0)">${this.renderDorothyFriendly()}</g>
            <g transform="translate(140, -20)">${this.renderScarecrowWalking()}</g>
            <g transform="translate(280, -10)">${this.renderTinManMobile()}</g>
            <g transform="translate(420, 10)">${this.renderLionBrave()}</g>
          </g>
        </svg>
      </div>
    `;
  },

  // =========================================================================
  // 9. SCENE 9: THE WITCH (DARK SPOOKY FOREST & BRAVE FRIENDS UNITED)
  // =========================================================================
  renderWitchScene(scene) {
    return `
      <div class="scene-stage witch-stage">
        <svg viewBox="0 0 1200 675" class="stage-svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="wt_sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1e1b4b" />
              <stop offset="50%" stop-color="#3b0764" />
              <stop offset="100%" stop-color="#09090b" />
            </linearGradient>
          </defs>

          <!-- Spooky Twilight Sky & Glowing Full Moon -->
          <rect width="1200" height="675" fill="url(#wt_sky)" />
          <circle cx="220" cy="120" r="70" fill="#fef08a" opacity="0.9" />
          <circle cx="255" cy="105" r="60" fill="#1e1b4b" opacity="0.85" />

          <!-- Twisted Gnarly Spooky Trees -->
          ${this.renderSpookyTreesDetailed()}

          <!-- WICKED WITCH HOVERING ON BROOM (Cackling, pointing, purple robes, tall hat) -->
          <g class="character-actor anim-wobble" transform="translate(820, 160) scale(1.2)">
            ${this.renderWitchExpressive()}
          </g>

          <!-- THE FOUR FRIENDS STANDING BRAVE & UNITED TOGETHER -->
          <g transform="translate(200, 360) scale(0.95)">
            <g transform="translate(0, 20)">${this.renderDorothyBrave()}</g>
            <g transform="translate(120, 0)">${this.renderScarecrowWalking()}</g>
            <g transform="translate(240, 10)">${this.renderTinManMobile()}</g>
            <g transform="translate(370, 25)">${this.renderLionBrave()}</g>
          </g>
        </svg>
      </div>
    `;
  },

  // =========================================================================
  // 10. SCENE 10: FRIENDS WORK TOGETHER (TRIUMPHANT CELEBRATION)
  // =========================================================================
  renderCelebrationScene(scene) {
    return `
      <div class="scene-stage celebration-stage">
        <svg viewBox="0 0 1200 675" class="stage-svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="cl_bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="40%" stop-color="#6ee7b7" />
              <stop offset="100%" stop-color="#059669" />
            </linearGradient>
          </defs>

          <!-- Golden Radiant Light -->
          <rect width="1200" height="675" fill="url(#cl_bg)" />
          ${this.renderConfettiSparkleLayers()}

          <!-- Wizard Presenting Inner Qualities -->
          <g transform="translate(600, 170) scale(1.1)">
            ${this.renderWizardExpressive()}
          </g>

          <!-- 4 HEROES PROUD & CELEBRATING SHOULDER TO SHOULDER -->
          <g transform="translate(160, 340) scale(1.05)">
            <!-- Scarecrow (Clever!) -->
            <g transform="translate(0, 0)">
              ${this.renderScarecrowWalking()}
              <rect x="15" y="-35" width="80" height="28" rx="14" fill="#d97706" stroke="#fff" stroke-width="2" />
              <text x="55" y="-17" font-size="13" font-weight="900" fill="#fff" text-anchor="middle">🧠 CLEVER</text>
            </g>

            <!-- Tin Man (Kind!) -->
            <g transform="translate(200, 10)">
              ${this.renderTinManMobile()}
              <rect x="25" y="-35" width="80" height="28" rx="14" fill="#dc2626" stroke="#fff" stroke-width="2" />
              <text x="65" y="-17" font-size="13" font-weight="900" fill="#fff" text-anchor="middle">❤️ KIND</text>
            </g>

            <!-- Dorothy (Friendship!) -->
            <g transform="translate(400, 30)">
              ${this.renderDorothyFriendly()}
              <rect x="10" y="-35" width="90" height="28" rx="14" fill="#2563eb" stroke="#fff" stroke-width="2" />
              <text x="55" y="-17" font-size="13" font-weight="900" fill="#fff" text-anchor="middle">✨ FRIEND</text>
            </g>

            <!-- Lion (Brave!) -->
            <g transform="translate(600, 20)">
              ${this.renderLionBrave()}
              <rect x="35" y="-35" width="80" height="28" rx="14" fill="#ea580c" stroke="#fff" stroke-width="2" />
              <text x="75" y="-17" font-size="13" font-weight="900" fill="#fff" text-anchor="middle">💪 BRAVE</text>
            </g>
          </g>
        </svg>
      </div>
    `;
  },

  // =========================================================================
  // 11. SCENE 11: HOME SAFE IN KANSAS (WARM REUNION & RAINBOW)
  // =========================================================================
  renderHomeSafeScene(scene) {
    return `
      <div class="scene-stage home-safe-stage">
        <svg viewBox="0 0 1200 675" class="stage-svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="hm_sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#60a5fa" />
              <stop offset="50%" stop-color="#fed7aa" />
              <stop offset="100%" stop-color="#fef08a" />
            </linearGradient>
          </defs>

          <!-- Warm Sunny Sky -->
          <rect width="1200" height="675" fill="url(#hm_sky)" />

          <!-- Gentle Beautiful Rainbow Over Prairie -->
          <g transform="translate(600, 340)" opacity="0.75">
            <path d="M -540,0 A 540,540 0 0,1 540,0" stroke="#ef4444" stroke-width="14" fill="none" />
            <path d="M -526,0 A 526,526 0 0,1 526,0" stroke="#f97316" stroke-width="14" fill="none" />
            <path d="M -512,0 A 512,512 0 0,1 512,0" stroke="#eab308" stroke-width="14" fill="none" />
            <path d="M -498,0 A 498,498 0 0,1 498,0" stroke="#22c55e" stroke-width="14" fill="none" />
            <path d="M -484,0 A 484,484 0 0,1 484,0" stroke="#3b82f6" stroke-width="14" fill="none" />
            <path d="M -470,0 A 470,470 0 0,1 470,0" stroke="#a855f7" stroke-width="14" fill="none" />
          </g>

          <!-- Cozy Kansas Farmhouse & Porch -->
          <g transform="translate(200, 260)">
            <rect x="0" y="70" width="240" height="170" fill="#ffffff" stroke="#334155" stroke-width="5" rx="4" />
            <polygon points="-25,70 120,-30 265,70" fill="#dc2626" stroke="#991b1b" stroke-width="5" />
            <rect x="90" y="125" width="55" height="115" fill="#78350f" stroke="#451a03" stroke-width="3" />
            <rect x="25" y="105" width="45" height="50" fill="#bae6fd" stroke="#0284c7" stroke-width="3" />
            <rect x="170" y="105" width="45" height="50" fill="#bae6fd" stroke="#0284c7" stroke-width="3" />
          </g>

          <!-- DOROTHY HUGGING TOTO WARMLY IN RELIEF & JOY -->
          <g class="character-actor anim-breath" transform="translate(700, 290) scale(1.25)">
            ${this.renderDorothyHuggingTotoHome()}
          </g>

          <!-- Golden Prairie Grass -->
          <path d="M 0,510 Q 300,470 650,510 T 1200,480 L 1200,675 L 0,675 Z" fill="#ca8a04" opacity="0.9" />
        </svg>
      </div>
    `;
  },

  // =========================================================================
  // CHARACTER RENDERERS: HIGH QUALITY EXPRESSIVE VECTOR ART
  // =========================================================================

  /**
   * Dorothy - Scared in Storm (Kansas Farm)
   */
  renderDorothyScaredInStorm() {
    return `
      <g class="svg-char-dorothy">
        <!-- Soft Shadow -->
        <ellipse cx="40" cy="185" rx="36" ry="12" fill="#020617" opacity="0.35" />
        <!-- Legs & Ruby Slippers -->
        <rect x="26" y="140" width="11" height="35" fill="#fed7aa" />
        <rect x="44" y="140" width="11" height="35" fill="#fed7aa" />
        <rect x="26" y="165" width="11" height="10" fill="#ffffff" />
        <rect x="44" y="165" width="11" height="10" fill="#ffffff" />
        <path d="M 20,175 Q 36,175 42,184 Q 28,188 18,184 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="2" />
        <path d="M 44,175 Q 60,175 66,184 Q 52,188 42,184 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="2" />

        <!-- Blue Gingham Dress Skirt (Blowing in wind to the right) -->
        <path d="M 18,75 L 62,75 L 85,145 L 8,145 Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="3" rx="4" />
        <!-- White Puffy Blouse Sleeves -->
        <circle cx="15" cy="74" r="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
        <circle cx="65" cy="74" r="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />

        <!-- Arms (Hands raised near cheeks in worry) -->
        <path d="M 14,78 Q 6,105 24,100" stroke="#fed7aa" stroke-width="8" stroke-linecap="round" fill="none" />
        <path d="M 66,78 Q 74,105 56,100" stroke="#fed7aa" stroke-width="8" stroke-linecap="round" fill="none" />

        <!-- Head & Pigtails (Hair streaming in wind) -->
        <path d="M 8,30 Q -12,45 8,70" stroke="#78350f" stroke-width="12" stroke-linecap="round" fill="none" />
        <path d="M 72,30 Q 95,40 105,65" stroke="#78350f" stroke-width="12" stroke-linecap="round" fill="none" />
        <circle cx="4" cy="65" r="7" fill="#3b82f6" />
        <circle cx="102" cy="62" r="7" fill="#3b82f6" />

        <!-- Expressive Scared Face -->
        <circle cx="40" cy="40" r="25" fill="#fed7aa" stroke="#fbcfe8" stroke-width="1.5" />
        <!-- Hair Bangs -->
        <path d="M 16,35 Q 40,16 64,35 Q 40,24 16,35 Z" fill="#78350f" />

        <!-- Big Expressive Worried Eyes (Looking Up at Sky) -->
        <circle cx="32" cy="36" r="6" fill="#ffffff" stroke="#1e293b" stroke-width="1.5" />
        <circle cx="48" cy="36" r="6" fill="#ffffff" stroke="#1e293b" stroke-width="1.5" />
        <circle cx="33" cy="34" r="3.5" fill="#1e293b" />
        <circle cx="49" cy="34" r="3.5" fill="#1e293b" />
        <circle cx="34" cy="32" r="1.5" fill="#ffffff" />
        <circle cx="50" cy="32" r="1.5" fill="#ffffff" />
        <!-- Worried Eyebrows -->
        <path d="M 27,27 Q 33,31 38,28" stroke="#78350f" stroke-width="2.5" fill="none" />
        <path d="M 43,28 Q 48,31 54,27" stroke="#78350f" stroke-width="2.5" fill="none" />
        <!-- Rosy Cheeks -->
        <ellipse cx="26" cy="45" rx="5" ry="3" fill="#f43f5e" opacity="0.6" />
        <ellipse cx="54" cy="45" rx="5" ry="3" fill="#f43f5e" opacity="0.6" />
        <!-- Scared / Gasping Mouth -->
        <ellipse cx="40" cy="50" rx="4.5" ry="6" fill="#991b1b" stroke="#78350f" stroke-width="1.5" />
      </g>
    `;
  },

  /**
   * Dorothy - Window Clinging (Tornado Scene)
   */
  renderDorothyWindowClinging() {
    return `
      <g>
        <!-- Head & Scared Face -->
        <circle cx="40" cy="40" r="24" fill="#fed7aa" />
        <!-- Hair -->
        <path d="M 16,35 Q 40,16 64,35 Z" fill="#78350f" />
        <!-- Eyes wide open -->
        <circle cx="32" cy="36" r="6" fill="#fff" />
        <circle cx="48" cy="36" r="6" fill="#fff" />
        <circle cx="32" cy="36" r="3.5" fill="#000" />
        <circle cx="48" cy="36" r="3.5" fill="#000" />
        <!-- Open Mouth Screaming "Help!" -->
        <ellipse cx="40" cy="52" rx="7" ry="8" fill="#991b1b" />
        <!-- Hands Clinging to Sill Holding Toto -->
        <rect x="15" y="60" width="12" height="12" fill="#fed7aa" rx="4" />
        <rect x="52" y="60" width="12" height="12" fill="#fed7aa" rx="4" />
      </g>
    `;
  },

  /**
   * Dorothy - Wonder & Curiosity (Strange Land)
   */
  renderDorothyWonder() {
    return `
      <g class="svg-char-dorothy">
        <ellipse cx="40" cy="185" rx="36" ry="12" fill="#020617" opacity="0.3" />
        <rect x="26" y="140" width="11" height="35" fill="#fed7aa" />
        <rect x="44" y="140" width="11" height="35" fill="#fed7aa" />
        <path d="M 20,175 Q 36,175 42,184 Q 28,188 18,184 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="2" />
        <path d="M 44,175 Q 60,175 66,184 Q 52,188 42,184 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="2" />
        <path d="M 18,75 L 62,75 L 78,145 L 2,145 Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="3" rx="4" />
        <circle cx="15" cy="74" r="14" fill="#ffffff" />
        <circle cx="65" cy="74" r="14" fill="#ffffff" />
        <!-- Arms spread open in wonder -->
        <path d="M 14,78 Q -10,95 0,115" stroke="#fed7aa" stroke-width="8" stroke-linecap="round" fill="none" />
        <path d="M 66,78 Q 90,95 80,115" stroke="#fed7aa" stroke-width="8" stroke-linecap="round" fill="none" />

        <path d="M 8,30 Q -6,50 2,70" stroke="#78350f" stroke-width="12" stroke-linecap="round" fill="none" />
        <path d="M 72,30 Q 86,50 78,70" stroke="#78350f" stroke-width="12" stroke-linecap="round" fill="none" />
        <circle cx="2" cy="68" r="7" fill="#3b82f6" />
        <circle cx="78" cy="68" r="7" fill="#3b82f6" />

        <circle cx="40" cy="40" r="25" fill="#fed7aa" />
        <path d="M 16,35 Q 40,16 64,35 Z" fill="#78350f" />
        <!-- Big Smiling Eyes in Wonder -->
        <circle cx="32" cy="38" r="6" fill="#fff" />
        <circle cx="48" cy="38" r="6" fill="#fff" />
        <circle cx="32" cy="38" r="3.5" fill="#1e293b" />
        <circle cx="48" cy="38" r="3.5" fill="#1e293b" />
        <circle cx="33" cy="36" r="1.5" fill="#fff" />
        <circle cx="49" cy="36" r="1.5" fill="#fff" />
        <!-- Happy Smile -->
        <path d="M 33,48 Q 40,58 47,48" stroke="#991b1b" stroke-width="3" fill="none" stroke-linecap="round" />
      </g>
    `;
  },

  /**
   * Dorothy - Friendly & Inviting (Meeting Friends)
   */
  renderDorothyFriendly() {
    return this.renderDorothyWonder();
  },

  /**
   * Dorothy - Brave (Facing Witch)
   */
  renderDorothyBrave() {
    return `
      <g class="svg-char-dorothy">
        <ellipse cx="40" cy="185" rx="36" ry="12" fill="#020617" opacity="0.3" />
        <rect x="26" y="140" width="11" height="35" fill="#fed7aa" />
        <rect x="44" y="140" width="11" height="35" fill="#fed7aa" />
        <path d="M 20,175 Q 36,175 42,184 Q 28,188 18,184 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="2" />
        <path d="M 44,175 Q 60,175 66,184 Q 52,188 42,184 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="2" />
        <path d="M 18,75 L 62,75 L 75,145 L 5,145 Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="3" rx="4" />
        <circle cx="15" cy="74" r="14" fill="#ffffff" />
        <circle cx="65" cy="74" r="14" fill="#ffffff" />
        <!-- Hands on hips in brave stance -->
        <path d="M 14,78 L 0,100 L 18,110" stroke="#fed7aa" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        <path d="M 66,78 L 80,100 L 62,110" stroke="#fed7aa" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none" />

        <path d="M 8,30 Q -6,50 2,70" stroke="#78350f" stroke-width="12" stroke-linecap="round" fill="none" />
        <path d="M 72,30 Q 86,50 78,70" stroke="#78350f" stroke-width="12" stroke-linecap="round" fill="none" />
        <circle cx="2" cy="68" r="7" fill="#3b82f6" />
        <circle cx="78" cy="68" r="7" fill="#3b82f6" />

        <circle cx="40" cy="40" r="25" fill="#fed7aa" />
        <path d="M 16,35 Q 40,16 64,35 Z" fill="#78350f" />
        <!-- Determined Eyebrows & Resolute Smile -->
        <path d="M 26,30 L 37,33" stroke="#78350f" stroke-width="2.5" />
        <path d="M 54,30 L 43,33" stroke="#78350f" stroke-width="2.5" />
        <circle cx="32" cy="38" r="4" fill="#1e293b" />
        <circle cx="48" cy="38" r="4" fill="#1e293b" />
        <path d="M 34,48 Q 40,54 46,48" stroke="#991b1b" stroke-width="3" fill="none" stroke-linecap="round" />
      </g>
    `;
  },

  /**
   * Dorothy Hugging Toto (Home safe)
   */
  renderDorothyHuggingTotoHome() {
    return `
      <g>
        <ellipse cx="50" cy="180" rx="45" ry="14" fill="#020617" opacity="0.3" />
        <!-- Dorothy Sitting/Kneeling Holding Toto in Arms -->
        <path d="M 20,80 L 80,80 L 95,160 L 5,160 Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="3" rx="6" />
        <circle cx="50" cy="45" r="26" fill="#fed7aa" />
        <path d="M 24,40 Q 50,20 76,40 Z" fill="#78350f" />
        <!-- Beaming Happy Eyes (Curved happy slits) -->
        <path d="M 38,44 Q 44,38 50,44" stroke="#78350f" stroke-width="3" fill="none" />
        <path d="M 54,44 Q 60,38 66,44" stroke="#78350f" stroke-width="3" fill="none" />
        <path d="M 42,54 Q 52,64 62,54" stroke="#991b1b" stroke-width="3.5" fill="none" stroke-linecap="round" />

        <!-- Toto in Her Arms (Happy Face, Tongue Out) -->
        <g transform="translate(35, 80) scale(0.9)">
          <ellipse cx="28" cy="30" rx="20" ry="14" fill="#78350f" stroke="#451a03" stroke-width="2" />
          <circle cx="16" cy="18" r="14" fill="#78350f" />
          <ellipse cx="8" cy="12" rx="5" ry="9" fill="#451a03" />
          <ellipse cx="24" cy="12" rx="5" ry="9" fill="#451a03" />
          <circle cx="12" cy="16" r="2.5" fill="#000" />
          <circle cx="20" cy="16" r="2.5" fill="#000" />
          <!-- Tongue -->
          <ellipse cx="16" cy="25" rx="3" ry="5" fill="#f43f5e" />
        </g>
      </g>
    `;
  },

  /**
   * Toto - Scared in Storm
   */
  renderTotoScaredInStorm() {
    return `
      <g>
        <ellipse cx="28" cy="48" rx="24" ry="6" fill="#020617" opacity="0.35" />
        <ellipse cx="26" cy="34" rx="20" ry="14" fill="#78350f" stroke="#451a03" stroke-width="2" />
        <rect x="12" y="40" width="7" height="12" fill="#78350f" rx="3" />
        <rect x="34" y="40" width="7" height="12" fill="#78350f" rx="3" />
        <!-- Tail between legs (scared) -->
        <path d="M 44,36 Q 48,46 42,48" stroke="#78350f" stroke-width="5" stroke-linecap="round" fill="none" />
        <circle cx="14" cy="22" r="13" fill="#78350f" stroke="#451a03" stroke-width="2" />
        <!-- Flattened Ears -->
        <ellipse cx="6" cy="18" rx="7" ry="4" fill="#451a03" />
        <ellipse cx="22" cy="18" rx="7" ry="4" fill="#451a03" />
        <!-- Big Scared Eyes -->
        <circle cx="10" cy="20" r="3" fill="#fff" />
        <circle cx="18" cy="20" r="3" fill="#fff" />
        <circle cx="10" cy="20" r="2" fill="#000" />
        <circle cx="18" cy="20" r="2" fill="#000" />
        <circle cx="14" cy="26" r="3" fill="#000" />
      </g>
    `;
  },

  /**
   * Toto - Happy / Wagging
   */
  renderTotoHappy() {
    return `
      <g>
        <ellipse cx="28" cy="48" rx="24" ry="6" fill="#020617" opacity="0.3" />
        <ellipse cx="26" cy="32" rx="20" ry="14" fill="#78350f" stroke="#451a03" stroke-width="2" />
        <rect x="12" y="38" width="7" height="12" fill="#78350f" rx="3" />
        <rect x="34" y="38" width="7" height="12" fill="#78350f" rx="3" />
        <!-- Tail Wagging High -->
        <path d="M 44,28 Q 58,12 50,4" stroke="#78350f" stroke-width="6" stroke-linecap="round" fill="none" class="anim-wag" />
        <circle cx="14" cy="18" r="13" fill="#78350f" stroke="#451a03" stroke-width="2" />
        <ellipse cx="6" cy="12" rx="5" ry="9" fill="#451a03" />
        <ellipse cx="22" cy="12" rx="5" ry="9" fill="#451a03" />
        <circle cx="10" cy="16" r="2.5" fill="#000" />
        <circle cx="18" cy="16" r="2.5" fill="#000" />
        <ellipse cx="14" cy="23" rx="4" ry="3" fill="#a16207" />
        <circle cx="14" cy="22" r="2" fill="#000" />
      </g>
    `;
  },

  renderTotoCurious() {
    return this.renderTotoHappy();
  },

  /**
   * Scarecrow - Stuck on Pole (Scene 4)
   */
  renderScarecrowOnPole() {
    return `
      <g class="svg-char-scarecrow">
        <ellipse cx="50" cy="215" rx="42" ry="12" fill="#020617" opacity="0.35" />
        <!-- Weathered Wooden Pole & Crossbar -->
        <rect x="45" y="10" width="10" height="210" fill="#78350f" stroke="#451a03" stroke-width="2" rx="3" />
        <rect x="5" y="70" width="90" height="10" fill="#78350f" stroke="#451a03" stroke-width="2" rx="3" />
        <!-- Patchwork Pants -->
        <path d="M 28,125 L 46,190 L 54,190 L 72,125 Z" fill="#1e3a8a" stroke="#172554" stroke-width="2.5" />
        <rect x="34" y="145" width="14" height="14" fill="#ea580c" stroke="#9a3412" stroke-width="1.5" />
        <!-- Straw feet dangling -->
        <path d="M 40,190 L 35,210 M 46,190 L 46,212 M 58,190 L 62,210" stroke="#facc15" stroke-width="4" stroke-linecap="round" />
        <!-- Green Coat with Rope Tie -->
        <path d="M 18,65 L 82,65 L 78,130 L 22,130 Z" fill="#65a30d" stroke="#365314" stroke-width="3" rx="4" />
        <rect x="22" y="115" width="56" height="8" fill="#facc15" />
        <!-- Straw Arms tied to crossbar -->
        <path d="M 12,75 L -8,90 M 88,75 L 108,90" stroke="#facc15" stroke-width="6" stroke-linecap="round" />

        <!-- Burlap Stitched Head (Tilted in need of help) -->
        <circle cx="50" cy="40" r="24" fill="#fde047" stroke="#ca8a04" stroke-width="2.5" />
        <circle cx="42" cy="36" r="4" fill="#78350f" />
        <circle cx="58" cy="36" r="4" fill="#78350f" />
        <!-- Friendly Stitched Smile -->
        <path d="M 38,48 Q 50,58 62,48" stroke="#78350f" stroke-width="3" stroke-dasharray="4,2" fill="none" />
        <!-- Straw Hat -->
        <polygon points="12,28 88,28 68,-15 32,-15" fill="#78350f" stroke="#451a03" stroke-width="2.5" />
        <ellipse cx="50" cy="28" rx="45" ry="9" fill="#92400e" stroke="#451a03" stroke-width="2" />
      </g>
    `;
  },

  /**
   * Scarecrow - Walking Proudly with Friends
   */
  renderScarecrowWalking() {
    return `
      <g class="svg-char-scarecrow">
        <ellipse cx="50" cy="210" rx="38" ry="10" fill="#020617" opacity="0.3" />
        <path d="M 28,125 L 40,195 L 50,195 L 72,125 Z" fill="#1e3a8a" stroke="#172554" stroke-width="2.5" />
        <path d="M 18,65 L 82,65 L 78,130 L 22,130 Z" fill="#65a30d" stroke="#365314" stroke-width="3" rx="4" />
        <circle cx="50" cy="40" r="24" fill="#fde047" stroke="#ca8a04" stroke-width="2.5" />
        <circle cx="42" cy="36" r="4" fill="#78350f" />
        <circle cx="58" cy="36" r="4" fill="#78350f" />
        <path d="M 38,48 Q 50,58 62,48" stroke="#78350f" stroke-width="3" stroke-dasharray="4,2" fill="none" />
        <polygon points="12,28 88,28 68,-15 32,-15" fill="#78350f" stroke="#451a03" stroke-width="2.5" />
        <ellipse cx="50" cy="28" rx="45" ry="9" fill="#92400e" stroke="#451a03" stroke-width="2" />
      </g>
    `;
  },

  /**
   * Tin Man - Rusted & Frozen (Scene 5)
   */
  renderTinManRusted() {
    return `
      <g class="svg-char-tinman">
        <ellipse cx="60" cy="215" rx="46" ry="12" fill="#020617" opacity="0.35" />
        <!-- Stiff Legs -->
        <rect x="36" y="135" width="20" height="70" fill="#64748b" stroke="#334155" stroke-width="3" rx="4" />
        <rect x="64" y="135" width="20" height="70" fill="#64748b" stroke="#334155" stroke-width="3" rx="4" />
        <!-- Rusted Metal Barrel Body -->
        <rect x="22" y="60" width="76" height="80" fill="#94a3b8" stroke="#475569" stroke-width="3.5" rx="8" />
        <!-- Clockwork Heart -->
        <path d="M 60,90 Q 52,80 44,90 Q 44,104 60,115 Q 76,104 76,90 Q 68,80 60,90 Z" fill="#dc2626" stroke="#991b1b" stroke-width="2" />
        <!-- Right Arm Frozen Stiff in Air with Axe -->
        <g id="tin-left-arm">
          <rect x="95" y="65" width="18" height="55" fill="#64748b" stroke="#334155" stroke-width="3" rx="4" transform="rotate(-65, 95, 65)" />
          <!-- Axe in hand -->
          <rect x="135" y="-10" width="8" height="85" fill="#78350f" stroke="#451a03" stroke-width="2" transform="rotate(-25, 135, 20)" />
          <polygon points="120,5 155,-15 140,25" fill="#cbd5e1" stroke="#475569" stroke-width="2" transform="rotate(-25, 135, 20)" />
        </g>
        <!-- Cylinder Head -->
        <rect x="36" y="18" width="48" height="44" fill="#94a3b8" stroke="#475569" stroke-width="3" rx="6" />
        <!-- Screws Eyes & Frozen O-mouth ("Help!") -->
        <circle cx="48" cy="34" r="4.5" fill="#1e293b" />
        <circle cx="72" cy="34" r="4.5" fill="#1e293b" />
        <ellipse cx="60" cy="48" rx="6" ry="8" fill="#1e293b" />
        <!-- Funnel Hat -->
        <polygon points="30,18 90,18 66,-20 54,-20" fill="#64748b" stroke="#334155" stroke-width="3" />
        <rect x="56" y="-35" width="8" height="16" fill="#475569" />
      </g>
    `;
  },

  /**
   * Tin Man - Mobile & Smiling (After Oiling)
   */
  renderTinManMobile() {
    return `
      <g class="svg-char-tinman">
        <ellipse cx="60" cy="210" rx="44" ry="10" fill="#020617" opacity="0.3" />
        <rect x="36" y="135" width="20" height="70" fill="#cbd5e1" stroke="#475569" stroke-width="3" rx="4" />
        <rect x="64" y="135" width="20" height="70" fill="#cbd5e1" stroke="#475569" stroke-width="3" rx="4" />
        <rect x="22" y="60" width="76" height="80" fill="#cbd5e1" stroke="#475569" stroke-width="3.5" rx="8" />
        <path d="M 60,90 Q 52,80 44,90 Q 44,104 60,115 Q 76,104 76,90 Q 68,80 60,90 Z" fill="#ef4444" stroke="#991b1b" stroke-width="2" />
        <!-- Arms relaxed / mobile -->
        <rect x="2" y="65" width="18" height="55" fill="#cbd5e1" stroke="#475569" stroke-width="3" rx="4" />
        <rect x="100" y="65" width="18" height="55" fill="#cbd5e1" stroke="#475569" stroke-width="3" rx="4" />
        <rect x="36" y="18" width="48" height="44" fill="#cbd5e1" stroke="#475569" stroke-width="3" rx="6" />
        <circle cx="48" cy="34" r="4.5" fill="#1e293b" />
        <circle cx="72" cy="34" r="4.5" fill="#1e293b" />
        <!-- Happy Smile -->
        <path d="M 48,48 Q 60,58 72,48" stroke="#1e293b" stroke-width="3" fill="none" stroke-linecap="round" />
        <polygon points="30,18 90,18 66,-20 54,-20" fill="#94a3b8" stroke="#475569" stroke-width="3" />
        <rect x="56" y="-35" width="8" height="16" fill="#64748b" />
      </g>
    `;
  },

  /**
   * Cowardly Lion - Comic Fright & Roar Pose (Scene 6)
   */
  renderLionCharacterExpressive() {
    return `
      <g class="svg-char-lion">
        <ellipse cx="70" cy="215" rx="60" ry="14" fill="#020617" opacity="0.35" />
        <!-- Fluffy Tail -->
        <path d="M 125,130 Q 170,105 150,175" stroke="#d97706" stroke-width="10" fill="none" stroke-linecap="round" />
        <circle cx="150" cy="175" r="14" fill="#92400e" />
        <!-- Body & Paws -->
        <ellipse cx="70" cy="140" rx="50" ry="45" fill="#f59e0b" stroke="#b45309" stroke-width="3.5" />
        <ellipse cx="40" cy="190" rx="18" ry="16" fill="#d97706" stroke="#b45309" stroke-width="2.5" />
        <ellipse cx="100" cy="190" rx="18" ry="16" fill="#d97706" stroke="#b45309" stroke-width="2.5" />
        <!-- Big Lush Golden-Amber Mane -->
        <circle cx="70" cy="65" r="60" fill="#92400e" stroke="#78350f" stroke-width="4" />
        <circle cx="30" cy="40" r="20" fill="#b45309" />
        <circle cx="110" cy="40" r="20" fill="#b45309" />
        <circle cx="30" cy="90" r="20" fill="#b45309" />
        <circle cx="110" cy="90" r="20" fill="#b45309" />
        <!-- Lion Face -->
        <circle cx="70" cy="68" r="36" fill="#fbbf24" stroke="#d97706" stroke-width="2.5" />
        <!-- Large Timid Round Eyes -->
        <circle cx="56" cy="58" r="8" fill="#ffffff" stroke="#78350f" stroke-width="2" />
        <circle cx="84" cy="58" r="8" fill="#ffffff" stroke="#78350f" stroke-width="2" />
        <circle cx="56" cy="60" r="5" fill="#1e293b" />
        <circle cx="84" cy="60" r="5" fill="#1e293b" />
        <circle cx="58" cy="58" r="1.8" fill="#ffffff" />
        <circle cx="86" cy="58" r="1.8" fill="#ffffff" />
        <!-- Cute Pink Nose & Whiskers -->
        <polygon points="70,72 62,82 78,82" fill="#ea580c" />
        <path d="M 35,78 L 10,74 M 35,85 L 10,87 M 105,78 L 130,74 M 105,85 L 130,87" stroke="#78350f" stroke-width="2.5" />
        <!-- Surprised & Scared O-Mouth -->
        <ellipse cx="70" cy="92" rx="7" ry="9" fill="#78350f" />
        <!-- Paws covering ears/cheeks in fright -->
        <ellipse cx="28" cy="65" rx="12" ry="10" fill="#d97706" stroke="#78350f" stroke-width="2" />
        <ellipse cx="112" cy="65" rx="12" ry="10" fill="#d97706" stroke="#78350f" stroke-width="2" />
      </g>
    `;
  },

  /**
   * Cowardly Lion - Standing Proud & Brave
   */
  renderLionBrave() {
    return `
      <g class="svg-char-lion">
        <ellipse cx="70" cy="210" rx="55" ry="12" fill="#020617" opacity="0.3" />
        <path d="M 125,130 Q 170,105 150,175" stroke="#d97706" stroke-width="10" fill="none" stroke-linecap="round" />
        <circle cx="150" cy="175" r="14" fill="#92400e" />
        <ellipse cx="70" cy="140" rx="50" ry="45" fill="#f59e0b" stroke="#b45309" stroke-width="3.5" />
        <circle cx="70" cy="65" r="60" fill="#92400e" stroke="#78350f" stroke-width="4" />
        <circle cx="70" cy="68" r="36" fill="#fbbf24" stroke="#d97706" stroke-width="2.5" />
        <circle cx="56" cy="58" r="8" fill="#ffffff" stroke="#78350f" stroke-width="2" />
        <circle cx="84" cy="58" r="8" fill="#ffffff" stroke="#78350f" stroke-width="2" />
        <circle cx="56" cy="60" r="5" fill="#1e293b" />
        <circle cx="84" cy="60" r="5" fill="#1e293b" />
        <!-- Proud Smile -->
        <path d="M 58,90 Q 70,98 82,90" stroke="#78350f" stroke-width="3.5" fill="none" stroke-linecap="round" />
        <!-- Courage Medal Ribbon -->
        <g transform="translate(60, 115)">
          <polygon points="10,0 0,25 10,18 20,25" fill="#dc2626" />
          <circle cx="10" cy="25" r="9" fill="#facc15" stroke="#ca8a04" stroke-width="2" />
        </g>
      </g>
    `;
  },

  /**
   * Wizard - Grand & Expressive
   */
  renderWizardExpressive() {
    return `
      <g class="svg-char-wizard">
        <!-- Magic Green Robes -->
        <path d="M 20,80 L 100,80 L 120,195 L 0,195 Z" fill="#047857" stroke="#065f46" stroke-width="4" rx="8" />
        <path d="M 50,80 L 70,80 L 66,195 L 54,195 Z" fill="#facc15" />
        <!-- Face & Long Wise Beard -->
        <circle cx="60" cy="50" r="25" fill="#fed7aa" />
        <path d="M 38,55 Q 60,120 82,55 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3" />
        <circle cx="50" cy="46" r="3.5" fill="#1e293b" />
        <circle cx="70" cy="46" r="3.5" fill="#1e293b" />
        <!-- Emerald Top Hat -->
        <polygon points="28,35 92,35 82,-25 38,-25" fill="#059669" stroke="#064e3b" stroke-width="3" />
        <ellipse cx="60" cy="35" rx="46" ry="10" fill="#047857" stroke="#064e3b" stroke-width="2.5" />
        <circle cx="60" cy="5" r="7" fill="#fbbf24" />
      </g>
    `;
  },

  /**
   * Wicked Witch - Child-Friendly & Expressive
   */
  renderWitchExpressive() {
    return `
      <g class="svg-char-witch">
        <!-- Broomstick -->
        <rect x="-80" y="75" width="240" height="9" fill="#78350f" rx="4" transform="rotate(-15, 30, 80)" />
        <polygon points="-80,55 -45,75 -80,100 -110,80" fill="#ca8a04" transform="rotate(-15, 30, 80)" />
        <!-- Purple & Black Cape -->
        <path d="M 18,45 L 82,45 L 100,145 L 0,145 Z" fill="#2e1065" stroke="#09090b" stroke-width="3" />
        <!-- Green Skin Face -->
        <circle cx="50" cy="25" r="22" fill="#84cc16" stroke="#4d7c0f" stroke-width="2" />
        <!-- Pointy Nose & Cackling Smile -->
        <polygon points="50,22 72,26 50,32" fill="#65a30d" />
        <circle cx="42" cy="18" r="3.5" fill="#000000" />
        <path d="M 38,34 Q 52,44 64,34" stroke="#000000" stroke-width="3" fill="none" />
        <!-- Tall Pointy Hat -->
        <polygon points="12,10 88,10 50,-50" fill="#09090b" stroke="#3b0764" stroke-width="3" />
        <ellipse cx="50" cy="10" rx="48" ry="9" fill="#18181b" stroke="#3b0764" stroke-width="2" />
        <rect x="22" y="4" width="56" height="7" fill="#9333ea" />
      </g>
    `;
  },

  // =========================================================================
  // ENVIRONMENT DETAILS: FLORA, TREES & CANOPY
  // =========================================================================

  renderFantasyFlora() {
    return `
      <g class="fantasy-flowers" transform="translate(0, 470)">
        <!-- Giant Pink Swirl Tulip -->
        <g transform="translate(90, 20)">
          <path d="M 20,110 Q 25,50 20,0" stroke="#16a34a" stroke-width="8" fill="none" />
          <circle cx="5" cy="-10" r="20" fill="#f43f5e" />
          <circle cx="35" cy="-10" r="20" fill="#f43f5e" />
          <circle cx="20" cy="-30" r="20" fill="#f43f5e" />
          <circle cx="20" cy="8" r="20" fill="#f43f5e" />
          <circle cx="20" cy="-10" r="14" fill="#facc15" />
        </g>
        <!-- Blue Fantasy Bell Flower -->
        <g transform="translate(1000, 10)">
          <path d="M 20,120 Q 30,60 20,0" stroke="#16a34a" stroke-width="8" fill="none" />
          <circle cx="20" cy="-10" r="36" fill="#c084fc" />
          <circle cx="20" cy="-10" r="18" fill="#fef08a" />
        </g>
      </g>
    `;
  },

  renderDenseCornfield(x, y) {
    return `
      <g transform="translate(${x}, ${y})">
        <path d="M 0,240 L 0,60 Q 25,25 50,50 M 0,120 Q -30,80 -50,110 M 0,160 Q 35,130 60,150" stroke="#65a30d" stroke-width="8" fill="none" />
        <ellipse cx="25" cy="90" rx="10" ry="22" fill="#facc15" stroke="#ca8a04" stroke-width="2" />
        <path d="M 90,240 L 90,40 Q 115,10 140,30 M 90,100 Q 60,60 45,90 M 90,140 Q 125,110 150,130" stroke="#65a30d" stroke-width="8" fill="none" />
        <ellipse cx="115" cy="70" rx="10" ry="22" fill="#facc15" stroke="#ca8a04" stroke-width="2" />
        <path d="M 180,240 L 180,50 Q 205,20 230,40 M 180,110 Q 150,80 135,100" stroke="#65a30d" stroke-width="8" fill="none" />
        <ellipse cx="205" cy="80" rx="10" ry="22" fill="#facc15" stroke="#ca8a04" stroke-width="2" />
      </g>
    `;
  },

  renderRoadBrickDetail() {
    return `
      <g stroke="#ca8a04" stroke-width="2" opacity="0.65">
        <line x1="560" y1="360" x2="700" y2="360" />
        <line x1="490" y1="440" x2="780" y2="440" />
        <line x1="400" y1="530" x2="880" y2="530" />
        <line x1="300" y1="625" x2="1020" y2="625" />
      </g>
    `;
  },

  renderDeepForestCanopy() {
    return `
      <g>
        <ellipse cx="180" cy="160" rx="200" ry="150" fill="#15803d" />
        <ellipse cx="520" cy="120" rx="240" ry="160" fill="#166534" />
        <ellipse cx="880" cy="150" rx="220" ry="150" fill="#14532d" />
        <ellipse cx="1120" cy="140" rx="200" ry="150" fill="#15803d" />
        <!-- Thick Tree Trunks -->
        <rect x="60" y="220" width="55" height="455" fill="#78350f" rx="8" />
        <rect x="320" y="240" width="65" height="435" fill="#451a03" rx="10" />
        <rect x="1000" y="200" width="70" height="475" fill="#78350f" rx="10" />
        <rect x="1150" y="220" width="55" height="455" fill="#451a03" rx="8" />
      </g>
    `;
  },

  renderSpookyTreesDetailed() {
    return `
      <g stroke="#18181b" stroke-linecap="round" fill="none">
        <path d="M 120,675 L 120,360 Q 80,240 30,170 M 120,310 Q 170,250 190,190 M 190,190 Q 230,160 250,200" stroke-width="36" />
        <path d="M 1080,675 L 1080,340 Q 1130,220 1180,160 M 1080,290 Q 1010,210 970,160" stroke-width="40" />
      </g>
    `;
  },

  renderConfettiSparkleLayers() {
    return `
      <g class="anim-sparkle">
        <circle cx="150" cy="100" r="10" fill="#f43f5e" />
        <polygon points="300,70 306,88 325,88 310,100 315,118 300,106 285,118 290,100 275,88 294,88" fill="#facc15" />
        <circle cx="480" cy="60" r="12" fill="#3b82f6" />
        <polygon points="760,80 766,98 785,98 770,110 775,128 760,116 745,128 750,110 735,98 754,98" fill="#a855f7" />
        <circle cx="920" cy="90" r="11" fill="#10b981" />
        <circle cx="1070" cy="50" r="14" fill="#fb923c" />
      </g>
    `;
  },

  // =========================================================================
  // STORY STOP CONTAINER & MINIATURES
  // =========================================================================
  renderStoryStopVisual(stopData) {
    return `
      <div class="story-stop-banner-wrapper">
        <div class="story-stop-card">
          <div class="stop-badge">🛑 STORY STOP #${stopData.stopNumber}</div>
          <h2 class="stop-title">${stopData.title}</h2>
          <div class="stop-content-grid">
            <div class="stop-visual-area">
              ${this.getStopHeroVisual(stopData.stopNumber)}
            </div>
            <div class="stop-interaction-area">
              <div class="partner-talk-bubble">
                <span class="bubble-icon">🗣️</span>
                <span class="bubble-text"><strong>Talk to your partner:</strong> "${stopData.step1.question}"</span>
              </div>
              <div class="stop-options-grid" id="stop-options-container">
                ${stopData.step1.options.map(opt => `
                  <button class="choice-card-btn" data-correct="${opt.correct}" onclick="window.StoryApp.handleStoryStopChoice(this, ${opt.correct})">
                    <span class="choice-icon">${opt.icon}</span>
                    <span class="choice-label">${opt.label}</span>
                  </button>
                `).join('')}
              </div>
              <div class="sentence-frame-box">
                <div class="frame-tag">SENTENCE SUPPORT</div>
                <div class="frame-text" id="stop-sentence-frame">${stopData.step1.frame}</div>
              </div>
              <button class="reveal-btn" onclick="window.StoryApp.revealStoryStopAnswer(${stopData.stopNumber})">
                ✨ REVEAL ANSWER
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  getStopHeroVisual(stopNum) {
    if (stopNum === 1) {
      return `
        <svg viewBox="0 0 400 300" class="stop-svg">
          <rect width="400" height="300" fill="#0f172a" rx="16" />
          <g transform="translate(160, 40) scale(0.9)">
            ${this.renderDorothyScaredInStorm()}
          </g>
        </svg>
      `;
    } else if (stopNum === 2) {
      return `
        <svg viewBox="0 0 400 300" class="stop-svg">
          <rect width="400" height="300" fill="#14532d" rx="16" />
          <g transform="translate(130, 40) scale(0.95)">
            ${this.renderLionCharacterExpressive()}
          </g>
        </svg>
      `;
    } else {
      return `
        <svg viewBox="0 0 400 300" class="stop-svg">
          <rect width="400" height="300" fill="#3b0764" rx="16" />
          <g transform="translate(50, 50) scale(0.7)">
            <g transform="translate(0, 0)">${this.renderDorothyBrave()}</g>
            <g transform="translate(90, -20)">${this.renderScarecrowWalking()}</g>
            <g transform="translate(180, -10)">${this.renderTinManMobile()}</g>
            <g transform="translate(280, 10)">${this.renderLionBrave()}</g>
          </g>
        </svg>
      `;
    }
  },

  /**
   * 8 Rich Miniature Illustrations for Story Memory Event Cards
   */
  getMemoryCardSvg(cardId) {
    switch (cardId) {
      case 1: // Tornado
        return `
          <svg viewBox="0 0 160 110" class="card-thumb-svg">
            <rect width="160" height="110" fill="#0f172a" rx="8" />
            <!-- Funnel -->
            <path d="M 40,10 Q 80,30 120,10 L 90,95 Q 80,100 70,95 Z" fill="#334155" />
            <!-- Flying House -->
            <g transform="translate(65, 30) rotate(-15) scale(0.35)">
              <rect x="0" y="30" width="80" height="60" fill="#f8fafc" stroke="#000" stroke-width="3" />
              <polygon points="-10,30 40,-15 90,30" fill="#dc2626" />
            </g>
          </svg>
        `;
      case 2: // Strange Land
        return `
          <svg viewBox="0 0 160 110" class="card-thumb-svg">
            <rect width="160" height="110" fill="#38bdf8" rx="8" />
            <path d="M 0,60 Q 80,45 160,55 L 160,110 L 0,110 Z" fill="#22c55e" />
            <!-- Giant Flower -->
            <circle cx="40" cy="70" r="14" fill="#f43f5e" />
            <circle cx="40" cy="70" r="6" fill="#fef08a" />
            <!-- Yellow Road -->
            <path d="M 70,60 L 90,60 L 120,110 L 60,110 Z" fill="#eab308" />
            <!-- Ruby Slippers -->
            <circle cx="125" cy="80" r="5" fill="#dc2626" />
          </svg>
        `;
      case 3: // Scarecrow
        return `
          <svg viewBox="0 0 160 110" class="card-thumb-svg">
            <rect width="160" height="110" fill="#60a5fa" rx="8" />
            <path d="M 0,55 Q 80,45 160,50 L 160,110 L 0,110 Z" fill="#84cc16" />
            <!-- Corn stalks -->
            <rect x="15" y="30" width="4" height="40" fill="#65a30d" />
            <rect x="25" y="25" width="4" height="45" fill="#65a30d" />
            <!-- Yellow Road -->
            <path d="M 100,55 L 160,110 L 70,110 Z" fill="#eab308" />
            <!-- Scarecrow on pole -->
            <g transform="translate(60, 25) scale(0.35)">
              ${this.renderScarecrowOnPole()}
            </g>
          </svg>
        `;
      case 4: // Tin Man
        return `
          <svg viewBox="0 0 160 110" class="card-thumb-svg">
            <rect width="160" height="110" fill="#14532d" rx="8" />
            <!-- Tree Trunks -->
            <rect x="10" y="20" width="16" height="90" fill="#78350f" />
            <rect x="135" y="15" width="18" height="95" fill="#451a03" />
            <!-- Path -->
            <path d="M 60,60 L 100,110 L 40,110 Z" fill="#eab308" />
            <!-- Tin Man & Oil Can -->
            <g transform="translate(65, 15) scale(0.38)">
              ${this.renderTinManRusted()}
            </g>
            <circle cx="115" cy="85" r="8" fill="#facc15" />
          </svg>
        `;
      case 5: // Lion
        return `
          <svg viewBox="0 0 160 110" class="card-thumb-svg">
            <rect width="160" height="110" fill="#166534" rx="8" />
            <!-- Foliage & Path -->
            <ellipse cx="30" cy="40" rx="40" ry="30" fill="#15803d" />
            <path d="M 50,55 L 110,110 L 20,110 Z" fill="#eab308" />
            <!-- Roaring Lion -->
            <g transform="translate(75, 12) scale(0.38)">
              ${this.renderLionCharacterExpressive()}
            </g>
          </svg>
        `;
      case 6: // Emerald City
        return `
          <svg viewBox="0 0 160 110" class="card-thumb-svg">
            <rect width="160" height="110" fill="#047857" rx="8" />
            <!-- Glowing Spires -->
            <polygon points="80,10 95,70 65,70" fill="#34d399" />
            <polygon points="50,25 62,75 38,75" fill="#10b981" />
            <polygon points="110,25 122,75 98,75" fill="#10b981" />
            <rect x="30" y="65" width="100" height="35" fill="#065f46" />
            <circle cx="80" cy="10" r="5" fill="#a7f3d0" />
            <!-- Road -->
            <path d="M 70,85 L 90,85 L 120,110 L 40,110 Z" fill="#eab308" />
          </svg>
        `;
      case 7: // Wicked Witch
        return `
          <svg viewBox="0 0 160 110" class="card-thumb-svg">
            <rect width="160" height="110" fill="#2e1065" rx="8" />
            <!-- Moon -->
            <circle cx="130" cy="30" r="18" fill="#fef08a" />
            <circle cx="136" cy="26" r="16" fill="#2e1065" />
            <!-- Witch on Broom -->
            <g transform="translate(60, 20) scale(0.45)">
              ${this.renderWitchExpressive()}
            </g>
          </svg>
        `;
      case 8: // Home
        return `
          <svg viewBox="0 0 160 110" class="card-thumb-svg">
            <rect width="160" height="110" fill="#fed7aa" rx="8" />
            <!-- Mini Rainbow -->
            <circle cx="80" cy="90" r="60" stroke="#f43f5e" stroke-width="4" fill="none" opacity="0.6" />
            <circle cx="80" cy="90" r="54" stroke="#facc15" stroke-width="4" fill="none" opacity="0.6" />
            <circle cx="80" cy="90" r="48" stroke="#3b82f6" stroke-width="4" fill="none" opacity="0.6" />
            <!-- Farmhouse -->
            <rect x="15" y="55" width="40" height="35" fill="#fff" stroke="#334155" stroke-width="2" />
            <polygon points="10,55 35,35 60,55" fill="#dc2626" />
            <!-- Dorothy & Toto hugging -->
            <g transform="translate(90, 30) scale(0.38)">
              ${this.renderDorothyHuggingTotoHome()}
            </g>
          </svg>
        `;
      default:
        return `<div class="thumb-placeholder">⭐</div>`;
    }
  }
};
