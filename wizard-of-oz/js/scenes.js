/**
 * SCENE VISUAL RENDERER
 * Generates rich, scalable SVG storybook illustrations with subtle CSS animation hooks
 */

export const SceneRenderer = {
  /**
   * Render full interactive visual stage for a given scene id or visual key
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

  // --- 1. KANSAS FARM (Scene 1) ---
  renderKansasFarm(scene) {
    return `
      <div class="scene-stage kansas-stage">
        <svg viewBox="0 0 1200 675" class="stage-svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="skyStorm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#475569" />
              <stop offset="60%" stop-color="#94a3b8" />
              <stop offset="100%" stop-color="#cbd5e1" />
            </linearGradient>
            <linearGradient id="farmGrass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#eab308" />
              <stop offset="100%" stop-color="#ca8a04" />
            </linearGradient>
          </defs>

          <!-- Stormy Sky -->
          <rect width="1200" height="675" fill="url(#skyStorm)" />

          <!-- Dark Gathering Clouds -->
          <g class="anim-cloud-slow">
            <path d="M 100,120 Q 150,60 220,90 Q 290,50 360,100 Q 420,70 480,120 Q 520,170 440,200 L 120,200 Z" fill="#334155" opacity="0.85" />
            <path d="M 600,80 Q 670,30 750,70 Q 830,30 910,80 Q 980,50 1040,110 Q 1080,160 1000,190 L 620,190 Z" fill="#1e293b" opacity="0.9" />
          </g>

          <!-- Rolling Prairie Fields -->
          <path d="M 0,420 Q 300,380 600,430 T 1200,410 L 1200,675 L 0,675 Z" fill="#d97706" opacity="0.7" />
          <path d="M 0,470 Q 350,440 700,480 T 1200,460 L 1200,675 L 0,675 Z" fill="url(#farmGrass)" />

          <!-- Kansas Farmhouse & Windmill -->
          <g transform="translate(140, 310)">
            <!-- House Body -->
            <rect x="0" y="70" width="180" height="120" fill="#f8fafc" stroke="#334155" stroke-width="4" rx="4" />
            <!-- Roof -->
            <polygon points="-20,70 90,-10 200,70" fill="#b91c1c" stroke="#7f1d1d" stroke-width="4" />
            <!-- Door -->
            <rect x="65" y="110" width="45" height="80" fill="#78350f" stroke="#451a03" stroke-width="3" rx="2" />
            <!-- Windows -->
            <rect x="20" y="95" width="30" height="35" fill="#bae6fd" stroke="#0284c7" stroke-width="2" />
            <rect x="125" y="95" width="30" height="35" fill="#bae6fd" stroke="#0284c7" stroke-width="2" />
            <circle cx="100" cy="150" r="4" fill="#fbbf24" />
            <!-- Fence -->
            <path d="M -60,160 L 250,160 M -40,140 L -40,180 M 0,140 L 0,180 M 210,140 L 210,180 M 240,140 L 240,180" stroke="#f1f5f9" stroke-width="4" />
          </g>

          <!-- Windmill in distance -->
          <g transform="translate(420, 290)">
            <polygon points="10,160 30,160 25,60 15,60" fill="#64748b" />
            <g class="anim-spin-slow" style="transform-origin: 20px 60px;">
              <line x1="20" y1="60" x2="20" y2="10" stroke="#475569" stroke-width="3" />
              <line x1="20" y1="60" x2="20" y2="110" stroke="#475569" stroke-width="3" />
              <line x1="20" y1="60" x2="-30" y2="60" stroke="#475569" stroke-width="3" />
              <line x1="20" y1="60" x2="70" y2="60" stroke="#475569" stroke-width="3" />
            </g>
            <circle cx="20" cy="60" r="5" fill="#0f172a" />
          </g>

          <!-- Wind Streaks Animation -->
          <g class="anim-wind-gusts">
            <path d="M 100,240 Q 300,220 500,250 T 900,230" stroke="#ffffff" stroke-width="3" stroke-dasharray="15,10" fill="none" opacity="0.6" />
            <path d="M 200,320 Q 500,300 800,340 T 1150,310" stroke="#ffffff" stroke-width="4" stroke-dasharray="25,12" fill="none" opacity="0.7" />
          </g>

          <!-- Dorothy Character -->
          <g class="character-actor anim-breath" transform="translate(720, 370)">
            ${this.svgDorothyLookingSky()}
          </g>

          <!-- Toto Character -->
          <g class="character-actor anim-bounce-quick" transform="translate(630, 480)">
            ${this.svgToto()}
          </g>
        </svg>
      </div>
    `;
  },

  // --- 2. THE TORNADO (Scene 2) ---
  renderTornadoSky(scene) {
    return `
      <div class="scene-stage tornado-stage">
        <svg viewBox="0 0 1200 675" class="stage-svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="tornadoGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#1e293b" />
              <stop offset="70%" stop-color="#0f172a" />
              <stop offset="100%" stop-color="#020617" />
            </radialGradient>
          </defs>

          <!-- Dark Sky Background -->
          <rect width="1200" height="675" fill="url(#tornadoGrad)" />

          <!-- Swirling Tornado Funnel -->
          <g class="anim-tornado-funnel" transform="translate(600, 320)">
            <ellipse cx="0" cy="-220" rx="360" ry="45" fill="#475569" opacity="0.7" />
            <ellipse cx="0" cy="-140" rx="280" ry="35" fill="#334155" opacity="0.8" />
            <ellipse cx="0" cy="-60" rx="200" ry="28" fill="#1e293b" opacity="0.85" />
            <ellipse cx="0" cy="20" rx="140" ry="22" fill="#334155" opacity="0.9" />
            <ellipse cx="0" cy="100" rx="90" ry="18" fill="#475569" opacity="0.9" />
            <ellipse cx="0" cy="180" rx="50" ry="14" fill="#64748b" opacity="0.95" />
            <ellipse cx="0" cy="260" rx="20" ry="8" fill="#94a3b8" opacity="0.9" />
          </g>

          <!-- Flying House in the Sky -->
          <g class="anim-house-floating" transform="translate(320, 240) rotate(-15)">
            <!-- House -->
            <rect x="0" y="40" width="140" height="90" fill="#f8fafc" stroke="#1e293b" stroke-width="4" rx="3" />
            <polygon points="-15,40 70,-20 155,40" fill="#dc2626" stroke="#991b1b" stroke-width="4" />
            <rect x="45" y="65" width="40" height="65" fill="#92400e" />
            <rect x="15" y="55" width="22" height="25" fill="#fef08a" stroke="#ca8a04" stroke-width="2" />
            <rect x="95" y="55" width="22" height="25" fill="#fef08a" stroke="#ca8a04" stroke-width="2" />
            <!-- Dorothy in window -->
            <circle cx="26" cy="67" r="7" fill="#fbcfe8" />
            <!-- Flying Toto -->
            <g transform="translate(180, 20) scale(0.6)">
              ${this.svgToto()}
            </g>
          </g>

          <!-- Flying Leaves & Debris -->
          <g class="anim-debris">
            <circle cx="200" cy="150" r="8" fill="#f59e0b" opacity="0.8" />
            <circle cx="850" cy="180" r="10" fill="#ca8a04" opacity="0.8" />
            <circle cx="920" cy="380" r="6" fill="#fbbf24" opacity="0.7" />
            <path d="M 400,450 Q 420,430 440,460 Z" fill="#65a30d" />
            <path d="M 750,220 Q 770,200 790,230 Z" fill="#65a30d" />
          </g>
        </svg>
      </div>
    `;
  },

  // --- 3. A STRANGE PLACE (Scene 3) ---
  renderStrangeLand(scene) {
    return `
      <div class="scene-stage munchkin-stage">
        <svg viewBox="0 0 1200 675" class="stage-svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="munchkinSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#38bdf8" />
              <stop offset="60%" stop-color="#bae6fd" />
              <stop offset="100%" stop-color="#f0fdf4" />
            </linearGradient>
            <linearGradient id="emeraldHills" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#4ade80" />
              <stop offset="100%" stop-color="#16a34a" />
            </linearGradient>
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="100%" stop-color="#facc15" stop-opacity="0" />
            </radialGradient>
          </defs>

          <!-- Blue Sky & Sun -->
          <rect width="1200" height="675" fill="url(#munchkinSky)" />
          <circle cx="950" cy="130" r="90" fill="url(#sunGlow)" />
          <circle cx="950" cy="130" r="45" fill="#fef08a" />

          <!-- Fluffy Happy Clouds -->
          <g class="anim-cloud-slow">
            <path d="M 120,100 Q 160,60 210,80 Q 260,50 310,90 Q 350,70 380,110 Q 370,140 320,150 L 140,150 Z" fill="#ffffff" opacity="0.9" />
            <path d="M 550,70 Q 590,30 640,50 Q 690,20 740,60 Q 770,40 800,80 Q 790,110 740,120 L 570,120 Z" fill="#ffffff" opacity="0.85" />
          </g>

          <!-- Magical Rolling Emerald Hills -->
          <path d="M 0,380 Q 300,320 600,360 T 1200,340 L 1200,675 L 0,675 Z" fill="#22c55e" opacity="0.6" />
          <path d="M 0,440 Q 350,390 750,430 T 1200,410 L 1200,675 L 0,675 Z" fill="url(#emeraldHills)" />

          <!-- Landed Kansas House with Fallen Wicked Witch Boots -->
          <g transform="translate(180, 360)">
            <!-- House -->
            <rect x="0" y="30" width="130" height="85" fill="#fef2f2" stroke="#7f1d1d" stroke-width="3" rx="2" />
            <polygon points="-10,30 65,-20 140,30" fill="#dc2626" stroke="#991b1b" stroke-width="3" />
            <rect x="45" y="55" width="35" height="60" fill="#78350f" />
            <!-- Witch Striped Stockings & Ruby Slippers poking out -->
            <g transform="translate(30, 110)">
              <rect x="0" y="0" width="14" height="20" fill="#000" />
              <rect x="0" y="5" width="14" height="5" fill="#fff" />
              <rect x="0" y="15" width="14" height="5" fill="#fff" />
              <path d="M -5,18 Q 10,18 16,24 Q 8,28 -5,24 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="1.5" />

              <rect x="25" y="0" width="14" height="20" fill="#000" />
              <rect x="25" y="5" width="14" height="5" fill="#fff" />
              <rect x="25" y="15" width="14" height="5" fill="#fff" />
              <path d="M 20,18 Q 35,18 41,24 Q 33,28 20,24 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="1.5" />
            </g>
          </g>

          <!-- Giant Colorful Fantasy Flowers -->
          ${this.svgFantasyFlowers()}

          <!-- Dorothy Looking in Awe -->
          <g class="character-actor anim-breath" transform="translate(680, 360)">
            ${this.svgDorothyFull()}
          </g>

          <!-- Toto Wagging Tail -->
          <g class="character-actor anim-bounce-quick" transform="translate(600, 480)">
            ${this.svgToto()}
          </g>
        </svg>
      </div>
    `;
  },

  // --- 4. THE SCARECROW (Scene 4) ---
  renderScarecrowScene(scene) {
    return `
      <div class="scene-stage scarecrow-stage">
        <svg viewBox="0 0 1200 675" class="stage-svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="skyScarecrow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#60a5fa" />
              <stop offset="100%" stop-color="#dbeafe" />
            </linearGradient>
            <linearGradient id="yellowRoad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#eab308" />
              <stop offset="50%" stop-color="#facc15" />
              <stop offset="100%" stop-color="#ca8a04" />
            </linearGradient>
          </defs>

          <!-- Sky & Hills -->
          <rect width="1200" height="675" fill="url(#skyScarecrow)" />
          <path d="M 0,320 Q 300,280 600,310 T 1200,290 L 1200,675 L 0,675 Z" fill="#84cc16" />

          <!-- Cornfield on Left -->
          ${this.svgCornField(50, 220)}

          <!-- Yellow Brick Road Perspective -->
          <path d="M 600,290 L 660,290 L 1100,675 L 300,675 Z" fill="url(#yellowRoad)" stroke="#a16207" stroke-width="3" />
          <!-- Brick Details on Road -->
          ${this.svgRoadBricks()}

          <!-- Scarecrow on Wooden Post -->
          <g class="character-actor anim-wobble" transform="translate(380, 260)">
            ${this.svgScarecrow()}
          </g>

          <!-- Dorothy & Toto on Road -->
          <g class="character-actor anim-breath" transform="translate(740, 360)">
            ${this.svgDorothyFull()}
          </g>
          <g class="character-actor anim-bounce-quick" transform="translate(860, 480)">
            ${this.svgToto()}
          </g>
        </svg>
      </div>
    `;
  },

  // --- 5. THE TIN MAN (Scene 5) ---
  renderTinManScene(scene) {
    return `
      <div class="scene-stage tinman-stage">
        <svg viewBox="0 0 1200 675" class="stage-svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="forestSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#14532d" />
              <stop offset="100%" stop-color="#166534" />
            </linearGradient>
          </defs>

          <!-- Deep Forest Sky & Trees -->
          <rect width="1200" height="675" fill="url(#forestSky)" />
          ${this.svgForestTrees()}

          <!-- Yellow Brick Path through Forest -->
          <path d="M 500,340 L 560,340 L 900,675 L 200,675 Z" fill="#eab308" stroke="#a16207" stroke-width="2" />

          <!-- Tin Man Standing Rusty & Stiff -->
          <g id="tinman-character" class="character-actor anim-stiff" transform="translate(480, 260)">
            ${this.svgTinMan()}
          </g>

          <!-- Interactive Oil Can Tool Trigger (Large & Prominent) -->
          <g id="oil-can-interactive" class="interactive-object anim-pulse" transform="translate(680, 420)" style="cursor: pointer;">
            <circle cx="45" cy="45" r="50" fill="#fef08a" stroke="#ca8a04" stroke-width="4" opacity="0.95" />
            <!-- Oil Can SVG -->
            <path d="M 25,60 L 65,60 L 58,35 L 32,35 Z" fill="#94a3b8" stroke="#334155" stroke-width="3" />
            <path d="M 45,35 L 45,15 L 75,5" stroke="#475569" stroke-width="4" fill="none" stroke-linecap="round" />
            <circle cx="75" cy="5" r="4" fill="#0284c7" />
            <text x="45" y="82" font-size="14" font-weight="bold" fill="#78350f" text-anchor="middle">CLICK OIL!</text>
          </g>

          <!-- Dorothy & Scarecrow Watching -->
          <g class="character-actor" transform="translate(800, 360)">
            ${this.svgDorothyFull()}
          </g>
          <g class="character-actor" transform="translate(930, 340) scale(0.9)">
            ${this.svgScarecrow()}
          </g>
        </svg>
      </div>
    `;
  },

  // --- 6. THE LION (Scene 6) ---
  renderLionScene(scene) {
    return `
      <div class="scene-stage lion-stage">
        <svg viewBox="0 0 1200 675" class="stage-svg" preserveAspectRatio="xMidYMid slice">
          <!-- Forest Backdrop -->
          <rect width="1200" height="675" fill="#14532d" />
          ${this.svgForestTrees()}

          <!-- Yellow Brick Road -->
          <path d="M 450,330 L 520,330 L 800,675 L 100,675 Z" fill="#eab308" stroke="#a16207" stroke-width="2" />

          <!-- Cowardly Lion Character -->
          <g class="character-actor anim-lion-roar" transform="translate(640, 260)">
            ${this.svgLion()}
          </g>

          <!-- The Friends Standing Together -->
          <g transform="translate(200, 340)">
            <!-- Scarecrow -->
            <g transform="translate(0, -20) scale(0.85)">${this.svgScarecrow()}</g>
            <!-- Dorothy -->
            <g transform="translate(100, 20)">${this.svgDorothyFull()}</g>
            <!-- Tin Man -->
            <g transform="translate(200, -10) scale(0.9)">${this.svgTinMan()}</g>
            <!-- Toto -->
            <g transform="translate(80, 140) scale(0.9)">${this.svgToto()}</g>
          </g>
        </svg>
      </div>
    `;
  },

  // --- 7. THE EMERALD CITY GATES (Scene 7) ---
  renderEmeraldCityGates(scene) {
    return `
      <div class="scene-stage emerald-stage">
        <svg viewBox="0 0 1200 675" class="stage-svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="emeraldSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#059669" />
              <stop offset="60%" stop-color="#34d399" />
              <stop offset="100%" stop-color="#a7f3d0" />
            </linearGradient>
            <radialGradient id="emeraldGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#6ee7b7" />
              <stop offset="100%" stop-color="#047857" stop-opacity="0" />
            </radialGradient>
          </defs>

          <!-- Glowing Emerald Sky -->
          <rect width="1200" height="675" fill="url(#emeraldSky)" />

          <!-- Emerald City Skyline Towers -->
          <g transform="translate(420, 100)" class="anim-glow">
            <!-- Central Giant Spire -->
            <polygon points="180,0 210,180 150,180" fill="#10b981" stroke="#065f46" stroke-width="4" />
            <polygon points="100,60 125,220 75,220" fill="#059669" stroke="#065f46" stroke-width="3" />
            <polygon points="260,60 285,220 235,220" fill="#059669" stroke="#065f46" stroke-width="3" />
            <!-- City Walls & Battlements -->
            <rect x="50" y="180" width="260" height="160" fill="#047857" stroke="#064e3b" stroke-width="4" rx="6" />
            <!-- Spire Jewels -->
            <circle cx="180" cy="5" r="12" fill="#a7f3d0" />
            <circle cx="100" cy="65" r="8" fill="#a7f3d0" />
            <circle cx="260" cy="65" r="8" fill="#a7f3d0" />
          </g>

          <!-- Giant City Gate -->
          <g transform="translate(510, 320)">
            <path d="M 0,160 L 0,60 Q 90,0 180,60 L 180,160 Z" fill="#064e3b" stroke="#34d399" stroke-width="6" />
            <circle cx="50" cy="90" r="14" fill="#fbbf24" stroke="#78350f" stroke-width="3" />
            <circle cx="130" cy="90" r="14" fill="#fbbf24" stroke="#78350f" stroke-width="3" />
            <text x="90" y="50" font-size="16" font-weight="bold" fill="#a7f3d0" text-anchor="middle">KNOCK KNOCK</text>
          </g>

          <!-- Yellow Brick Road leading to Gate -->
          <path d="M 540,480 L 660,480 L 1050,675 L 150,675 Z" fill="#eab308" stroke="#ca8a04" stroke-width="4" />

          <!-- Four Friends Approaching -->
          <g transform="translate(480, 470) scale(0.85)">
            <g transform="translate(-140, 0)">${this.svgScarecrow()}</g>
            <g transform="translate(-30, 20)">${this.svgDorothyFull()}</g>
            <g transform="translate(80, 0)">${this.svgTinMan()}</g>
            <g transform="translate(200, 10)">${this.svgLion()}</g>
          </g>
        </svg>
      </div>
    `;
  },

  // --- 8. THE WIZARD THRONE ROOM (Scene 8) ---
  renderWizardThrone(scene) {
    return `
      <div class="scene-stage wizard-stage">
        <svg viewBox="0 0 1200 675" class="stage-svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="throneBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#022c22" />
              <stop offset="100%" stop-color="#064e3b" />
            </linearGradient>
            <radialGradient id="wizardHeadGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#34d399" />
              <stop offset="70%" stop-color="#059669" />
              <stop offset="100%" stop-color="#022c22" stop-opacity="0" />
            </radialGradient>
          </defs>

          <!-- Castle Interior -->
          <rect width="1200" height="675" fill="url(#throneBg)" />

          <!-- Castle Pillars -->
          <rect x="80" y="0" width="80" height="675" fill="#047857" stroke="#065f46" stroke-width="4" />
          <rect x="1040" y="0" width="80" height="675" fill="#047857" stroke="#065f46" stroke-width="4" />

          <!-- Wizard's Throne & Glowing Floating Face/Hat -->
          <g transform="translate(600, 220)" class="anim-float">
            <circle cx="0" cy="0" r="140" fill="url(#wizardHeadGlow)" />
            <!-- Wizard Character -->
            <g transform="translate(-60, -90) scale(1.2)">
              ${this.svgWizard()}
            </g>
            <!-- Green Magic Smoke -->
            <ellipse cx="0" cy="120" rx="180" ry="30" fill="#10b981" opacity="0.4" class="anim-pulse" />
          </g>

          <!-- Friends Looking Up in Awe -->
          <g transform="translate(260, 430) scale(0.8)">
            <g transform="translate(0, 0)">${this.svgDorothyFull()}</g>
            <g transform="translate(130, -20)">${this.svgScarecrow()}</g>
            <g transform="translate(260, -10)">${this.svgTinMan()}</g>
            <g transform="translate(390, 10)">${this.svgLion()}</g>
          </g>
        </svg>
      </div>
    `;
  },

  // --- 9. THE WITCH IN DARK FOREST (Scene 9) ---
  renderWitchScene(scene) {
    return `
      <div class="scene-stage witch-stage">
        <svg viewBox="0 0 1200 675" class="stage-svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="witchSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#2e1065" />
              <stop offset="70%" stop-color="#3b0764" />
              <stop offset="100%" stop-color="#09090b" />
            </linearGradient>
          </defs>

          <!-- Spooky Night Sky -->
          <rect width="1200" height="675" fill="url(#witchSky)" />
          <!-- Full Spooky Moon -->
          <circle cx="200" cy="120" r="60" fill="#fef08a" opacity="0.85" />
          <circle cx="225" cy="110" r="50" fill="#2e1065" opacity="0.8" />

          <!-- Twisted Spooky Trees -->
          ${this.svgSpookyTrees()}

          <!-- Wicked Witch on Broom Flying / Hovering -->
          <g class="character-actor anim-wobble" transform="translate(820, 180)">
            ${this.svgWitch()}
          </g>

          <!-- Brave Friends Standing Together -->
          <g transform="translate(240, 390) scale(0.85)">
            <g transform="translate(0, 0)">${this.svgDorothyFull()}</g>
            <g transform="translate(110, -20)">${this.svgScarecrow()}</g>
            <g transform="translate(220, -10)">${this.svgTinMan()}</g>
            <g transform="translate(340, 10)">${this.svgLion()}</g>
          </g>
        </svg>
      </div>
    `;
  },

  // --- 10. CELEBRATION & INNER STRENGTH (Scene 10) ---
  renderCelebrationScene(scene) {
    return `
      <div class="scene-stage celebration-stage">
        <svg viewBox="0 0 1200 675" class="stage-svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="celebSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="40%" stop-color="#a7f3d0" />
              <stop offset="100%" stop-color="#34d399" />
            </linearGradient>
          </defs>

          <!-- Bright Golden Emerald Hall -->
          <rect width="1200" height="675" fill="url(#celebSky)" />

          <!-- Sparkles & Confetti Background -->
          ${this.svgConfettiSparkles()}

          <!-- Wizard Presenting Medals & Qualities -->
          <g transform="translate(600, 180) scale(0.95)">
            ${this.svgWizard()}
          </g>

          <!-- 4 Friends Celebrating Shoulder to Shoulder -->
          <g transform="translate(180, 360)">
            <!-- Scarecrow (Clever!) -->
            <g transform="translate(0, 0)">
              ${this.svgScarecrow()}
              <rect x="15" y="-30" width="70" height="24" rx="12" fill="#d97706" />
              <text x="50" y="-14" font-size="12" font-weight="bold" fill="#fff" text-anchor="middle">🧠 CLEVER</text>
            </g>

            <!-- Tin Man (Kind!) -->
            <g transform="translate(190, 10)">
              ${this.svgTinMan()}
              <rect x="25" y="-30" width="70" height="24" rx="12" fill="#dc2626" />
              <text x="60" y="-14" font-size="12" font-weight="bold" fill="#fff" text-anchor="middle">❤️ KIND</text>
            </g>

            <!-- Dorothy (Home bound!) -->
            <g transform="translate(380, 30)">
              ${this.svgDorothyFull()}
              <rect x="10" y="-30" width="80" height="24" rx="12" fill="#2563eb" />
              <text x="50" y="-14" font-size="12" font-weight="bold" fill="#fff" text-anchor="middle">✨ FRIEND</text>
            </g>

            <!-- Lion (Brave!) -->
            <g transform="translate(560, 20)">
              ${this.svgLion()}
              <rect x="35" y="-30" width="70" height="24" rx="12" fill="#ea580c" />
              <text x="70" y="-14" font-size="12" font-weight="bold" fill="#fff" text-anchor="middle">💪 BRAVE</text>
            </g>
          </g>
        </svg>
      </div>
    `;
  },

  // --- 11. HOME SAFE IN KANSAS (Scene 11) ---
  renderHomeSafeScene(scene) {
    return `
      <div class="scene-stage home-safe-stage">
        <svg viewBox="0 0 1200 675" class="stage-svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="warmSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#60a5fa" />
              <stop offset="50%" stop-color="#fed7aa" />
              <stop offset="100%" stop-color="#fef08a" />
            </linearGradient>
          </defs>

          <!-- Warm Sunny Sky -->
          <rect width="1200" height="675" fill="url(#warmSky)" />

          <!-- Beautiful Rainbow -->
          <g transform="translate(600, 350)" opacity="0.65">
            <path d="M -500,0 A 500,500 0 0,1 500,0" stroke="#ef4444" stroke-width="12" fill="none" />
            <path d="M -488,0 A 488,488 0 0,1 488,0" stroke="#f97316" stroke-width="12" fill="none" />
            <path d="M -476,0 A 476,476 0 0,1 476,0" stroke="#eab308" stroke-width="12" fill="none" />
            <path d="M -464,0 A 464,464 0 0,1 464,0" stroke="#22c55e" stroke-width="12" fill="none" />
            <path d="M -452,0 A 452,452 0 0,1 452,0" stroke="#3b82f6" stroke-width="12" fill="none" />
            <path d="M -440,0 A 440,440 0 0,1 440,0" stroke="#a855f7" stroke-width="12" fill="none" />
          </g>

          <!-- Cozy Kansas Farmhouse -->
          <g transform="translate(240, 290)">
            <rect x="0" y="60" width="220" height="150" fill="#ffffff" stroke="#334155" stroke-width="4" rx="4" />
            <polygon points="-25,60 110,-30 245,60" fill="#dc2626" stroke="#991b1b" stroke-width="4" />
            <rect x="85" y="110" width="50" height="100" fill="#92400e" />
            <rect x="25" y="90" width="40" height="45" fill="#bae6fd" stroke="#0284c7" stroke-width="2" />
            <rect x="155" y="90" width="40" height="45" fill="#bae6fd" stroke="#0284c7" stroke-width="2" />
          </g>

          <!-- Dorothy Hugging Toto Warmly -->
          <g class="character-actor anim-breath" transform="translate(680, 360)">
            ${this.svgDorothyFull()}
          </g>
          <g class="character-actor anim-bounce-quick" transform="translate(600, 470)">
            ${this.svgToto()}
          </g>

          <!-- Golden Grass -->
          <path d="M 0,510 Q 300,480 600,510 T 1200,490 L 1200,675 L 0,675 Z" fill="#ca8a04" opacity="0.85" />
        </svg>
      </div>
    `;
  },

  // --- STORY STOP VISUAL CONTAINER ---
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
          <g transform="translate(180, 140)">
            <ellipse cx="0" cy="0" rx="90" ry="20" fill="#334155" />
            <g transform="translate(-30, -50) scale(0.9)">${this.svgDorothyLookingSky()}</g>
          </g>
        </svg>
      `;
    } else if (stopNum === 2) {
      return `
        <svg viewBox="0 0 400 300" class="stop-svg">
          <rect width="400" height="300" fill="#14532d" rx="16" />
          <g transform="translate(140, 110)">
            <g transform="translate(0, 0)">${this.svgLion()}</g>
          </g>
        </svg>
      `;
    } else {
      return `
        <svg viewBox="0 0 400 300" class="stop-svg">
          <rect width="400" height="300" fill="#3b0764" rx="16" />
          <g transform="translate(100, 100) scale(0.75)">
            <g transform="translate(0, 0)">${this.svgDorothyFull()}</g>
            <g transform="translate(80, -20)">${this.svgScarecrow()}</g>
            <g transform="translate(160, -10)">${this.svgTinMan()}</g>
            <g transform="translate(240, 10)">${this.svgLion()}</g>
          </g>
        </svg>
      `;
    }
  },

  // ==========================================
  // SVG CHARACTER ATOM COMPONENTS
  // ==========================================

  svgDorothyFull() {
    return `
      <g class="svg-dorothy">
        <!-- Shadow -->
        <ellipse cx="40" cy="185" rx="35" ry="10" fill="#0f172a" opacity="0.3" />
        <!-- Legs & White Socks -->
        <rect x="26" y="140" width="10" height="35" fill="#fde047" />
        <rect x="44" y="140" width="10" height="35" fill="#fde047" />
        <rect x="26" y="165" width="10" height="10" fill="#ffffff" />
        <rect x="44" y="165" width="10" height="10" fill="#ffffff" />
        <!-- Red Ruby Slippers (Sparkling) -->
        <path d="M 22,175 Q 36,175 40,183 Q 28,187 20,183 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="1.5" />
        <path d="M 44,175 Q 58,175 62,183 Q 50,187 42,183 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="1.5" />
        <!-- Blue Gingham Pinafore Dress -->
        <path d="M 18,70 L 62,70 L 75,145 L 5,145 Z" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2" rx="4" />
        <!-- White Blouse Sleeves -->
        <circle cx="15" cy="72" r="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
        <circle cx="65" cy="72" r="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
        <!-- Arms -->
        <rect x="8" y="75" width="8" height="30" fill="#fed7aa" rx="4" />
        <rect x="64" y="75" width="8" height="30" fill="#fed7aa" rx="4" />
        <!-- Head & Pigtails -->
        <!-- Brown Pigtails with Blue Bows -->
        <path d="M 8,30 Q -6,45 2,65" stroke="#78350f" stroke-width="10" stroke-linecap="round" fill="none" />
        <path d="M 72,30 Q 86,45 78,65" stroke="#78350f" stroke-width="10" stroke-linecap="round" fill="none" />
        <circle cx="2" cy="62" r="6" fill="#3b82f6" />
        <circle cx="78" cy="62" r="6" fill="#3b82f6" />
        <!-- Face -->
        <circle cx="40" cy="38" r="22" fill="#fed7aa" stroke="#fbcfe8" stroke-width="1" />
        <!-- Hair Bangs -->
        <path d="M 18,34 Q 40,16 62,34 Q 40,24 18,34 Z" fill="#78350f" />
        <!-- Eyes & Rosy Cheeks -->
        <circle cx="32" cy="36" r="3.5" fill="#1e293b" />
        <circle cx="48" cy="36" r="3.5" fill="#1e293b" />
        <circle cx="33" cy="34" r="1.2" fill="#ffffff" />
        <circle cx="49" cy="34" r="1.2" fill="#ffffff" />
        <ellipse cx="26" cy="42" rx="4" ry="2.5" fill="#f43f5e" opacity="0.5" />
        <ellipse cx="54" cy="42" rx="4" ry="2.5" fill="#f43f5e" opacity="0.5" />
        <!-- Smile -->
        <path d="M 34,44 Q 40,50 46,44" stroke="#991b1b" stroke-width="2" fill="none" stroke-linecap="round" />
      </g>
    `;
  },

  svgDorothyLookingSky() {
    return `
      <g class="svg-dorothy-storm">
        <g transform="rotate(-10, 40, 100)">
          ${this.svgDorothyFull()}
        </g>
      </g>
    `;
  },

  svgToto() {
    return `
      <g class="svg-toto">
        <!-- Shadow -->
        <ellipse cx="30" cy="48" rx="24" ry="6" fill="#0f172a" opacity="0.3" />
        <!-- Body -->
        <ellipse cx="28" cy="32" rx="20" ry="14" fill="#78350f" stroke="#451a03" stroke-width="1.5" />
        <!-- Little Legs -->
        <rect x="14" y="38" width="6" height="12" fill="#78350f" rx="3" />
        <rect x="36" y="38" width="6" height="12" fill="#78350f" rx="3" />
        <!-- Tail (Wagging) -->
        <path d="M 46,30 Q 58,16 52,8" stroke="#78350f" stroke-width="5" stroke-linecap="round" fill="none" class="anim-wag" />
        <!-- Head -->
        <circle cx="16" cy="20" r="12" fill="#78350f" stroke="#451a03" stroke-width="1.5" />
        <!-- Floppy Ears -->
        <ellipse cx="8" cy="14" rx="4" ry="8" fill="#451a03" transform="rotate(-20, 8, 14)" />
        <ellipse cx="22" cy="14" rx="4" ry="8" fill="#451a03" transform="rotate(20, 22, 14)" />
        <!-- Snout, Nose & Eye -->
        <ellipse cx="11" cy="23" rx="5" ry="4" fill="#a16207" />
        <circle cx="9" cy="22" r="2.5" fill="#000000" />
        <circle cx="16" cy="17" r="2.5" fill="#000000" />
        <circle cx="17" cy="16" r="0.8" fill="#ffffff" />
        <!-- Red Collar -->
        <path d="M 12,28 Q 18,31 24,28" stroke="#dc2626" stroke-width="3" fill="none" />
      </g>
    `;
  },

  svgScarecrow() {
    return `
      <g class="svg-scarecrow">
        <!-- Shadow -->
        <ellipse cx="50" cy="210" rx="40" ry="10" fill="#0f172a" opacity="0.3" />
        <!-- Wooden Pole behind him -->
        <rect x="46" y="20" width="8" height="195" fill="#78350f" rx="2" />
        <rect x="10" y="80" width="80" height="8" fill="#78350f" rx="2" />
        <!-- Pants / Patchwork -->
        <path d="M 28,125 L 46,190 L 54,190 L 72,125 Z" fill="#1e3a8a" stroke="#172554" stroke-width="2" />
        <!-- Straw feet -->
        <path d="M 40,190 L 35,205 M 46,190 L 46,208 M 58,190 L 62,205" stroke="#facc15" stroke-width="3" />
        <!-- Green/Brown Patch Coat -->
        <path d="M 20,70 L 80,70 L 76,130 L 24,130 Z" fill="#65a30d" stroke="#365314" stroke-width="2" />
        <rect x="35" y="90" width="16" height="16" fill="#ea580f" stroke="#9a3412" stroke-width="1.5" />
        <!-- Rope Belt -->
        <rect x="24" y="115" width="52" height="6" fill="#facc15" />
        <!-- Straw Hands -->
        <path d="M 12,78 L -5,95 M 88,78 L 105,95" stroke="#facc15" stroke-width="4" stroke-linecap="round" />
        <!-- Burlap Head -->
        <circle cx="50" cy="42" r="22" fill="#fde047" stroke="#ca8a04" stroke-width="2" />
        <!-- Stitched Smile & Button Eyes -->
        <circle cx="42" cy="38" r="3" fill="#78350f" />
        <circle cx="58" cy="38" r="3" fill="#78350f" />
        <path d="M 38,50 Q 50,58 62,50" stroke="#78350f" stroke-width="2.5" stroke-dasharray="3,2" fill="none" />
        <!-- Straw Hat -->
        <polygon points="15,30 85,30 65,-10 35,-10" fill="#78350f" stroke="#451a03" stroke-width="2" />
        <ellipse cx="50" cy="30" rx="42" ry="8" fill="#92400e" stroke="#451a03" stroke-width="2" />
      </g>
    `;
  },

  svgTinMan() {
    return `
      <g class="svg-tinman">
        <!-- Shadow -->
        <ellipse cx="60" cy="210" rx="42" ry="10" fill="#0f172a" opacity="0.3" />
        <!-- Legs -->
        <rect x="38" y="135" width="18" height="65" fill="#94a3b8" stroke="#475569" stroke-width="2.5" rx="4" />
        <rect x="64" y="135" width="18" height="65" fill="#94a3b8" stroke="#475569" stroke-width="2.5" rx="4" />
        <!-- Metal Body Barrel -->
        <rect x="25" y="65" width="70" height="75" fill="#cbd5e1" stroke="#475569" stroke-width="3" rx="8" />
        <!-- Shiny Rivets & Red Clockwork Heart -->
        <circle cx="35" cy="78" r="3" fill="#475569" />
        <circle cx="85" cy="78" r="3" fill="#475569" />
        <circle cx="35" cy="125" r="3" fill="#475569" />
        <circle cx="85" cy="125" r="3" fill="#475569" />
        <path d="M 60,95 Q 52,85 45,95 Q 45,108 60,118 Q 75,108 75,95 Q 68,85 60,95 Z" fill="#ef4444" stroke="#991b1b" stroke-width="2" />
        <!-- Arms with Hinges -->
        <g id="tin-left-arm" class="anim-tin-arm">
          <rect x="5" y="70" width="16" height="48" fill="#94a3b8" stroke="#475569" stroke-width="2" rx="4" transform="rotate(15, 12, 70)" />
        </g>
        <g id="tin-right-arm" class="anim-tin-arm">
          <rect x="99" y="70" width="16" height="48" fill="#94a3b8" stroke="#475569" stroke-width="2" rx="4" transform="rotate(-15, 107, 70)" />
        </g>
        <!-- Cylinder Head -->
        <rect x="38" y="24" width="44" height="40" fill="#cbd5e1" stroke="#475569" stroke-width="2.5" rx="6" />
        <!-- Screws Eyes & Nose -->
        <circle cx="48" cy="38" r="4" fill="#334155" />
        <circle cx="72" cy="38" r="4" fill="#334155" />
        <polygon points="60,42 55,50 65,50" fill="#64748b" />
        <!-- Metallic Smile -->
        <rect x="50" y="54" width="20" height="4" fill="#334155" rx="2" />
        <!-- Funnel Hat -->
        <polygon points="34,24 86,24 64,-15 56,-15" fill="#94a3b8" stroke="#475569" stroke-width="2.5" />
        <rect x="56" y="-30" width="8" height="16" fill="#64748b" />
      </g>
    `;
  },

  svgLion() {
    return `
      <g class="svg-lion">
        <!-- Shadow -->
        <ellipse cx="70" cy="205" rx="55" ry="12" fill="#0f172a" opacity="0.3" />
        <!-- Lion Furry Tail with Tuft -->
        <path d="M 120,130 Q 160,110 145,170" stroke="#d97706" stroke-width="8" fill="none" stroke-linecap="round" />
        <circle cx="145" cy="170" r="12" fill="#92400e" />
        <!-- Body & Paws -->
        <ellipse cx="70" cy="135" rx="45" ry="40" fill="#f59e0b" stroke="#b45309" stroke-width="3" />
        <ellipse cx="45" cy="185" rx="16" ry="14" fill="#d97706" stroke="#b45309" stroke-width="2" />
        <ellipse cx="95" cy="185" rx="16" ry="14" fill="#d97706" stroke="#b45309" stroke-width="2" />
        <!-- Big Fluffy Mane -->
        <circle cx="70" cy="65" r="54" fill="#92400e" stroke="#78350f" stroke-width="3" />
        <circle cx="35" cy="45" r="18" fill="#b45309" />
        <circle cx="105" cy="45" r="18" fill="#b45309" />
        <circle cx="35" cy="85" r="18" fill="#b45309" />
        <circle cx="105" cy="85" r="18" fill="#b45309" />
        <!-- Lion Face -->
        <circle cx="70" cy="68" r="32" fill="#fbbf24" stroke="#d97706" stroke-width="2" />
        <!-- Big Round Timid Eyes -->
        <circle cx="58" cy="60" r="7" fill="#ffffff" stroke="#78350f" stroke-width="1.5" />
        <circle cx="82" cy="60" r="7" fill="#ffffff" stroke="#78350f" stroke-width="1.5" />
        <circle cx="58" cy="61" r="4.5" fill="#1e293b" />
        <circle cx="82" cy="61" r="4.5" fill="#1e293b" />
        <circle cx="60" cy="59" r="1.5" fill="#ffffff" />
        <circle cx="84" cy="59" r="1.5" fill="#ffffff" />
        <!-- Cute Pink/Brown Nose & Whiskers -->
        <polygon points="70,72 63,80 77,80" fill="#ea580c" />
        <path d="M 40,78 L 15,74 M 40,84 L 15,86 M 100,78 L 125,74 M 100,84 L 125,86" stroke="#78350f" stroke-width="2" />
        <!-- Surprised / Timid Mouth -->
        <ellipse cx="70" cy="88" rx="6" ry="7" fill="#78350f" />
        <!-- Courage Medal Ribbon -->
        <g transform="translate(60, 115)">
          <polygon points="10,0 0,22 10,16 20,22" fill="#dc2626" />
          <circle cx="10" cy="22" r="8" fill="#facc15" stroke="#ca8a04" stroke-width="2" />
        </g>
      </g>
    `;
  },

  svgWizard() {
    return `
      <g class="svg-wizard">
        <!-- Magic Robes -->
        <path d="M 20,80 L 100,80 L 115,190 L 5,190 Z" fill="#047857" stroke="#065f46" stroke-width="3" rx="6" />
        <path d="M 50,80 L 70,80 L 65,190 L 55,190 Z" fill="#facc15" />
        <!-- Face & Long Wise Beard -->
        <circle cx="60" cy="50" r="22" fill="#fed7aa" />
        <path d="M 40,55 Q 60,110 80,55 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" />
        <circle cx="52" cy="46" r="3" fill="#1e293b" />
        <circle cx="68" cy="46" r="3" fill="#1e293b" />
        <!-- Wizard Green Top Hat -->
        <polygon points="30,35 90,35 80,-20 40,-20" fill="#059669" stroke="#064e3b" stroke-width="2.5" />
        <ellipse cx="60" cy="35" rx="42" ry="9" fill="#047857" stroke="#064e3b" stroke-width="2" />
        <circle cx="60" cy="5" r="6" fill="#fbbf24" />
      </g>
    `;
  },

  svgWitch() {
    return `
      <g class="svg-witch">
        <!-- Broomstick -->
        <rect x="-80" y="75" width="220" height="8" fill="#78350f" rx="3" transform="rotate(-15, 30, 80)" />
        <polygon points="-80,60 -50,75 -80,95 -105,80" fill="#ca8a04" transform="rotate(-15, 30, 80)" />
        <!-- Black Witch Robe -->
        <path d="M 20,45 L 80,45 L 95,140 L 5,140 Z" fill="#1e1b4b" stroke="#09090b" stroke-width="2" />
        <!-- Green Witch Skin Face -->
        <circle cx="50" cy="25" r="20" fill="#84cc16" stroke="#4d7c0f" stroke-width="1.5" />
        <!-- Pointy Nose & Cackling Mouth -->
        <polygon points="50,22 68,26 50,30" fill="#65a30d" />
        <circle cx="42" cy="18" r="3" fill="#000000" />
        <path d="M 38,32 Q 50,42 60,32" stroke="#000000" stroke-width="2.5" fill="none" />
        <!-- Tall Pointy Witch Hat -->
        <polygon points="15,10 85,10 50,-45" fill="#09090b" stroke="#3b0764" stroke-width="2.5" />
        <ellipse cx="50" cy="10" rx="45" ry="8" fill="#18181b" stroke="#3b0764" stroke-width="2" />
        <rect x="25" y="4" width="50" height="6" fill="#9333ea" />
      </g>
    `;
  },

  // ==========================================
  // SVG BACKGROUND ENVIRONMENT HELPERS
  // ==========================================

  svgFantasyFlowers() {
    return `
      <g class="fantasy-flowers" transform="translate(0, 480)">
        <!-- Giant Pink Flower -->
        <g transform="translate(100, 20)">
          <path d="M 20,90 Q 25,40 20,0" stroke="#16a34a" stroke-width="6" fill="none" />
          <circle cx="5" cy="-10" r="16" fill="#f43f5e" />
          <circle cx="35" cy="-10" r="16" fill="#f43f5e" />
          <circle cx="20" cy="-25" r="16" fill="#f43f5e" />
          <circle cx="20" cy="5" r="16" fill="#f43f5e" />
          <circle cx="20" cy="-10" r="12" fill="#fbbf24" />
        </g>
        <!-- Blue Fantasy Bell Flower -->
        <g transform="translate(420, 40)">
          <path d="M 20,80 Q 15,30 20,0" stroke="#16a34a" stroke-width="6" fill="none" />
          <circle cx="20" cy="-5" r="22" fill="#38bdf8" />
          <circle cx="20" cy="-5" r="10" fill="#fef08a" />
        </g>
        <!-- Purple Giant Sunflower -->
        <g transform="translate(1020, 10)">
          <path d="M 20,100 Q 30,50 20,0" stroke="#16a34a" stroke-width="6" fill="none" />
          <circle cx="20" cy="-10" r="30" fill="#c084fc" />
          <circle cx="20" cy="-10" r="16" fill="#fbbf24" />
        </g>
      </g>
    `;
  },

  svgCornField(x, y) {
    return `
      <g transform="translate(${x}, ${y})">
        <path d="M 0,200 L 0,60 Q 20,30 40,50 M 0,110 Q -25,80 -40,100 M 0,140 Q 30,120 50,135" stroke="#65a30d" stroke-width="6" fill="none" />
        <ellipse cx="20" cy="80" rx="8" ry="18" fill="#facc15" stroke="#ca8a04" stroke-width="1.5" />
        <path d="M 80,200 L 80,40 Q 100,10 120,30 M 80,90 Q 55,60 40,80 M 80,120 Q 110,100 130,115" stroke="#65a30d" stroke-width="6" fill="none" />
        <ellipse cx="100" cy="60" rx="8" ry="18" fill="#facc15" stroke="#ca8a04" stroke-width="1.5" />
        <path d="M 160,200 L 160,50 Q 180,20 200,40 M 160,100 Q 135,70 120,90" stroke="#65a30d" stroke-width="6" fill="none" />
        <ellipse cx="180" cy="70" rx="8" ry="18" fill="#facc15" stroke="#ca8a04" stroke-width="1.5" />
      </g>
    `;
  },

  svgRoadBricks() {
    return `
      <g stroke="#ca8a04" stroke-width="1.5" opacity="0.6">
        <line x1="560" y1="360" x2="680" y2="360" />
        <line x1="500" y1="430" x2="750" y2="430" />
        <line x1="420" y1="510" x2="840" y2="510" />
        <line x1="320" y1="600" x2="960" y2="600" />
        <!-- Vertical Bricks -->
        <line x1="620" y1="290" x2="620" y2="360" />
        <line x1="580" y1="360" x2="570" y2="430" />
        <line x1="670" y1="360" x2="680" y2="430" />
        <line x1="520" y1="430" x2="500" y2="510" />
        <line x1="640" y1="430" x2="640" y2="510" />
        <line x1="760" y1="430" x2="780" y2="510" />
      </g>
    `;
  },

  svgForestTrees() {
    return `
      <g>
        <!-- Background Forest Canopy -->
        <ellipse cx="200" cy="180" rx="180" ry="140" fill="#15803d" />
        <ellipse cx="500" cy="140" rx="220" ry="150" fill="#166534" />
        <ellipse cx="850" cy="170" rx="200" ry="140" fill="#14532d" />
        <ellipse cx="1100" cy="150" rx="190" ry="140" fill="#15803d" />
        <!-- Tree Trunks -->
        <rect x="80" y="240" width="45" height="435" fill="#78350f" rx="6" />
        <rect x="340" y="260" width="55" height="415" fill="#451a03" rx="8" />
        <rect x="980" y="220" width="60" height="455" fill="#78350f" rx="8" />
        <rect x="1140" y="240" width="45" height="435" fill="#451a03" rx="6" />
      </g>
    `;
  },

  svgSpookyTrees() {
    return `
      <g stroke="#18181b" stroke-linecap="round" fill="none">
        <!-- Twisted Tree Left -->
        <path d="M 120,675 L 120,380 Q 90,260 40,200 M 120,340 Q 160,280 180,220 M 180,220 Q 220,190 240,230" stroke-width="32" />
        <!-- Twisted Tree Right -->
        <path d="M 1080,675 L 1080,360 Q 1120,240 1170,180 M 1080,320 Q 1020,240 980,190 M 980,190 Q 940,160 920,200" stroke-width="36" />
      </g>
    `;
  },

  svgConfettiSparkles() {
    return `
      <g class="anim-sparkle">
        <circle cx="150" cy="120" r="8" fill="#f43f5e" />
        <polygon points="300,90 305,105 320,105 308,115 312,130 300,120 288,130 292,115 280,105 295,105" fill="#facc15" />
        <circle cx="450" cy="80" r="10" fill="#3b82f6" />
        <polygon points="750,100 755,115 770,115 758,125 762,140 750,130 738,140 742,125 730,115 745,115" fill="#a855f7" />
        <circle cx="900" cy="110" r="9" fill="#10b981" />
        <circle cx="1050" cy="70" r="12" fill="#fb923c" />
      </g>
    `;
  }
};
