/**
 * "AMAZING ROBOTS AROUND THE WORLD" — Stage Scenes Renderer
 * 9 Complete Interactive Pages with High-Tech Vector SVGs,
 * Prediction Workspaces, WH Matching, Presentation Builder, and Real-World Reveal.
 */

const RobotsScenes = {

  // =========================================================================
  // VECTOR ROBOT ILLUSTRATIONS (High-detail, scalable, authentic science)
  // =========================================================================
  getRobotSvg(id, isMystery = false) {
    const svgs = {
      fish: `
        <svg viewBox="0 0 500 320" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="waterBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0284c7" />
              <stop offset="100%" stop-color="#082f49" />
            </linearGradient>
            <linearGradient id="fishBody" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#38bdf8" />
              <stop offset="50%" stop-color="#f8fafc" />
              <stop offset="100%" stop-color="#94a3b8" />
            </linearGradient>
          </defs>
          <rect width="500" height="320" fill="url(#waterBg)" />
          <!-- Water Bubbles & Caustic Light -->
          <circle cx="80" cy="90" r="10" fill="#ffffff" opacity="0.2" />
          <circle cx="120" cy="60" r="6" fill="#ffffff" opacity="0.25" />
          <circle cx="420" cy="110" r="14" fill="#ffffff" opacity="0.15" />
          <circle cx="390" cy="70" r="8" fill="#ffffff" opacity="0.2" />
          <!-- Small live schooling fish following behind -->
          <path d="M 60 210 Q 75 200 90 210 Q 75 220 60 210 Z" fill="#facc15" opacity="0.8" /><polygon points="52,205 60,210 52,215" fill="#facc15" opacity="0.8" />
          <path d="M 90 240 Q 105 230 120 240 Q 105 250 90 240 Z" fill="#facc15" opacity="0.8" /><polygon points="82,235 90,240 82,245" fill="#facc15" opacity="0.8" />
          <path d="M 70 170 Q 85 160 100 170 Q 85 180 70 170 Z" fill="#facc15" opacity="0.8" /><polygon points="62,165 70,170 62,175" fill="#facc15" opacity="0.8" />
          
          <!-- ROBOT FISH BODY -->
          <!-- Flexible Silicone Tail Fin (Wagging motion) -->
          <path d="M 130 155 Q 80 120 70 145 Q 95 155 70 165 Q 80 190 130 155 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
          <!-- Jointed Segment 3 -->
          <path d="M 160 155 L 130 145 L 130 165 Z" fill="#64748b" />
          <ellipse cx="160" cy="155" rx="20" ry="24" fill="#94a3b8" stroke="#475569" stroke-width="2" />
          <!-- Jointed Segment 2 -->
          <ellipse cx="205" cy="155" rx="32" ry="36" fill="#cbd5e1" stroke="#475569" stroke-width="2" />
          <!-- Main Torso with Circuit Plates -->
          <path d="M 205 120 Q 310 105 350 155 Q 310 205 205 190 Z" fill="url(#fishBody)" stroke="#0284c7" stroke-width="3" />
          <!-- Metallic Scales & Circuit Pattern -->
          <line x1="240" y1="130" x2="240" y2="180" stroke="#0284c7" stroke-width="2" opacity="0.6" />
          <line x1="275" y1="125" x2="275" y2="185" stroke="#0284c7" stroke-width="2" opacity="0.6" />
          <line x1="310" y1="130" x2="310" y2="180" stroke="#0284c7" stroke-width="2" opacity="0.6" />
          <!-- Pectoral Fin -->
          <polygon points="260,170 290,195 250,190" fill="#38bdf8" opacity="0.9" />
          <!-- Dorsal Fin -->
          <polygon points="250,120 280,95 295,120" fill="#38bdf8" opacity="0.9" />
          <!-- Head Dome with Glowing Optical Sensor -->
          <circle cx="335" cy="150" r="10" fill="#0284c7" />
          <circle cx="335" cy="150" r="6" fill="#38bdf8" />
          <circle cx="335" cy="150" r="2.5" fill="#ffffff" />
          <!-- Hydro dam barrier in far background -->
          <line x1="450" y1="40" x2="450" y2="280" stroke="#475569" stroke-width="12" opacity="0.5" />
          <text x="350" y="270" font-size="12" font-weight="900" fill="#38bdf8">NYU Biomimetic Swimmer</text>
        </svg>`,

      jellyfish: `
        <svg viewBox="0 0 500 320" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="reefGlow" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stop-color="#0c4a6e" />
              <stop offset="100%" stop-color="#021f36" />
            </radialGradient>
            <linearGradient id="jellyBell" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#a5f3fc" stop-opacity="0.85" />
              <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.4" />
            </linearGradient>
          </defs>
          <rect width="500" height="320" fill="url(#reefGlow)" />
          <!-- Coral reef on ocean floor -->
          <path d="M 20 320 Q 50 250 80 320 Q 120 230 160 320 Q 200 270 240 320" fill="#f43f5e" opacity="0.7" />
          <path d="M 320 320 Q 360 260 400 320 Q 440 240 480 320" fill="#f59e0b" opacity="0.7" />
          <!-- Sea Anemone -->
          <circle cx="100" cy="270" r="14" fill="#ec4899" opacity="0.6" />
          
          <!-- ROBOT JELLYFISH -->
          <!-- Soft Silicone Pulsating Bell Dome -->
          <path d="M 180 140 C 180 60 320 60 320 140 C 290 155 270 145 250 155 C 230 145 210 155 180 140 Z" fill="url(#jellyBell)" stroke="#38bdf8" stroke-width="3" />
          <!-- Internal Electronic Core & Micro-Cameras -->
          <ellipse cx="250" cy="115" rx="34" ry="24" fill="#0f172a" stroke="#0284c7" stroke-width="2" />
          <circle cx="238" cy="115" r="7" fill="#38bdf8" /><circle cx="238" cy="115" r="3" fill="#ffffff" />
          <circle cx="262" cy="115" r="7" fill="#38bdf8" /><circle cx="262" cy="115" r="3" fill="#ffffff" />
          <!-- Soft Rubber Tentacles (No blades!) -->
          <path d="M 205 145 Q 195 190 205 240 Q 215 270 200 290" fill="none" stroke="#67e8f9" stroke-width="4" stroke-linecap="round" />
          <path d="M 225 150 Q 240 195 225 245 Q 215 275 230 295" fill="none" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" />
          <path d="M 250 152 Q 250 200 250 250 Q 250 275 250 300" fill="none" stroke="#bae6fd" stroke-width="4" stroke-linecap="round" />
          <path d="M 275 150 Q 260 195 275 245 Q 285 275 270 295" fill="none" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" />
          <path d="M 295 145 Q 305 190 295 240 Q 285 270 300 290" fill="none" stroke="#67e8f9" stroke-width="4" stroke-linecap="round" />
          <!-- Safe Contact Pulse Wave -->
          <circle cx="250" cy="130" r="85" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.4" />
          <text x="320" y="50" font-size="12" font-weight="900" fill="#67e8f9">FAU / Max Planck Soft Explorer</text>
        </svg>`,

      bee: `
        <svg viewBox="0 0 500 320" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="labBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#1e1e24" />
              <stop offset="100%" stop-color="#111827" />
            </linearGradient>
            <linearGradient id="wingGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
              <stop offset="100%" stop-color="#93c5fd" stop-opacity="0.2" />
            </linearGradient>
          </defs>
          <rect width="500" height="320" fill="url(#labBg)" />
          <!-- Lab Grid Lines -->
          <line x1="50" y1="0" x2="50" y2="320" stroke="#334155" stroke-width="1" opacity="0.4" />
          <line x1="150" y1="0" x2="150" y2="320" stroke="#334155" stroke-width="1" opacity="0.4" />
          <line x1="250" y1="0" x2="250" y2="320" stroke="#334155" stroke-width="1" opacity="0.4" />
          <line x1="350" y1="0" x2="350" y2="320" stroke="#334155" stroke-width="1" opacity="0.4" />
          <line x1="450" y1="0" x2="450" y2="320" stroke="#334155" stroke-width="1" opacity="0.4" />
          <!-- Coin Scale Comparison on side -->
          <circle cx="100" cy="240" r="38" fill="#d97706" stroke="#b45309" stroke-width="3" />
          <text x="100" y="246" text-anchor="middle" font-size="14" font-weight="900" fill="#fef3c7">PENNY</text>
          <text x="100" y="295" text-anchor="middle" font-size="11" font-weight="800" fill="#94a3b8">Scale Comparison</text>
          
          <!-- ROBOT BEE (Hovering in air) -->
          <!-- Motion Blur Wings (120 Hz Flapping!) -->
          <ellipse cx="200" cy="95" rx="55" ry="24" fill="url(#wingGlow)" stroke="#38bdf8" stroke-width="2" transform="rotate(-25 200 95)" />
          <ellipse cx="300" cy="95" rx="55" ry="24" fill="url(#wingGlow)" stroke="#38bdf8" stroke-width="2" transform="rotate(25 300 95)" />
          <path d="M 180 85 L 240 130" stroke="#0284c7" stroke-width="1.5" />
          <path d="M 320 85 L 260 130" stroke="#0284c7" stroke-width="1.5" />
          <!-- Thorax & Piezoelectric Ceramic Actuator -->
          <rect x="235" y="115" width="30" height="42" rx="4" fill="#0f172a" stroke="#f59e0b" stroke-width="2.5" />
          <rect x="240" y="122" width="20" height="8" fill="#f59e0b" />
          <rect x="240" y="136" width="20" height="8" fill="#f59e0b" />
          <!-- Head with Optical Sensor -->
          <circle cx="250" cy="100" r="14" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
          <circle cx="244" cy="97" r="4" fill="#38bdf8" />
          <circle cx="256" cy="97" r="4" fill="#38bdf8" />
          <!-- Carbon Fiber Wire Legs -->
          <line x1="240" y1="155" x2="225" y2="185" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round" />
          <line x1="260" y1="155" x2="275" y2="185" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round" />
          <!-- Tether Wire -->
          <path d="M 250 157 Q 250 200 290 230" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4 2" />
          <!-- Speed Indicator -->
          <text x="350" y="165" font-size="14" font-weight="900" fill="#38bdf8">120 FLAPS / SEC ⚡</text>
          <text x="350" y="185" font-size="11" font-weight="800" fill="#94a3b8">Weight: &lt; 0.1 grams</text>
        </svg>`,

      snake: `
        <svg viewBox="0 0 500 320" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="rubbleBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#334155" />
              <stop offset="100%" stop-color="#0f172a" />
            </linearGradient>
          </defs>
          <rect width="500" height="320" fill="url(#rubbleBg)" />
          <!-- Collapsed Building Concrete Rubble & Broken Pipes -->
          <polygon points="40,320 90,210 180,260 210,320" fill="#475569" stroke="#1e293b" stroke-width="3" />
          <polygon points="280,320 340,230 460,250 490,320" fill="#64748b" stroke="#1e293b" stroke-width="3" />
          <!-- Broken Iron Pipe -->
          <ellipse cx="140" cy="180" rx="30" ry="18" fill="#1e293b" stroke="#94a3b8" stroke-width="4" />
          
          <!-- MODULAR SNAKE ROBOT (Slithering through gap) -->
          <!-- Tail Segments -->
          <circle cx="80" cy="270" r="12" fill="#e2e8f0" stroke="#0f172a" stroke-width="2" />
          <circle cx="102" cy="262" r="13" fill="#facc15" stroke="#0f172a" stroke-width="2" />
          <circle cx="126" cy="250" r="14" fill="#e2e8f0" stroke="#0f172a" stroke-width="2" />
          <!-- Middle Wave -->
          <circle cx="152" cy="235" r="15" fill="#facc15" stroke="#0f172a" stroke-width="2" />
          <circle cx="180" cy="220" r="16" fill="#e2e8f0" stroke="#0f172a" stroke-width="2" />
          <circle cx="210" cy="210" r="16" fill="#facc15" stroke="#0f172a" stroke-width="2" />
          <circle cx="242" cy="205" r="17" fill="#e2e8f0" stroke="#0f172a" stroke-width="2" />
          <!-- Rising Arch -->
          <circle cx="275" cy="195" r="18" fill="#facc15" stroke="#0f172a" stroke-width="2" />
          <circle cx="308" cy="180" r="18" fill="#e2e8f0" stroke="#0f172a" stroke-width="2" />
          <circle cx="338" cy="160" r="19" fill="#facc15" stroke="#0f172a" stroke-width="2" />
          <!-- Head Section (Raised up with Spotlight) -->
          <path d="M 360 145 L 390 125 L 415 135 L 385 155 Z" fill="#0f172a" stroke="#facc15" stroke-width="3" />
          <!-- Search Spotlight Beam -->
          <polygon points="415,135 490,80 490,190" fill="#fef08a" opacity="0.35" />
          <!-- Camera Eye & Mic -->
          <circle cx="400" cy="133" r="5" fill="#38bdf8" /><circle cx="400" cy="133" r="2" fill="#ffffff" />
          <!-- Rescue Badge -->
          <rect x="362" y="142" width="10" height="10" fill="#ef4444" />
          <text x="320" y="60" font-size="12" font-weight="900" fill="#facc15">CMU Search &amp; Rescue Snake</text>
        </svg>`,

      dog: `
        <svg viewBox="0 0 500 320" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="plantBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1e293b" />
              <stop offset="100%" stop-color="#0f172a" />
            </linearGradient>
            <linearGradient id="spotYellow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#facc15" />
              <stop offset="100%" stop-color="#eab308" />
            </linearGradient>
          </defs>
          <rect width="500" height="320" fill="url(#plantBg)" />
          <!-- Industrial Stairs / Rubble Terrain -->
          <polygon points="0,290 100,290 100,260 220,260 220,230 360,230 360,200 500,200 500,320 0,320" fill="#334155" stroke="#475569" stroke-width="3" />
          <!-- Caution Hazard Stripes -->
          <line x1="360" y1="210" x2="380" y2="230" stroke="#facc15" stroke-width="4" />
          <line x1="390" y1="210" x2="410" y2="230" stroke="#facc15" stroke-width="4" />
          <line x1="420" y1="210" x2="440" y2="230" stroke="#facc15" stroke-width="4" />
          
          <!-- ROBOT DOG (QUADRUPED) -->
          <!-- Back Left Leg -->
          <line x1="160" y1="130" x2="140" y2="190" stroke="#0f172a" stroke-width="9" stroke-linecap="round" />
          <line x1="140" y1="190" x2="155" y2="260" stroke="#475569" stroke-width="7" stroke-linecap="round" />
          <circle cx="155" cy="260" r="6" fill="#0f172a" />
          <!-- Back Right Leg (Stepping forward) -->
          <line x1="180" y1="130" x2="195" y2="180" stroke="#0f172a" stroke-width="9" stroke-linecap="round" />
          <line x1="195" y1="180" x2="175" y2="245" stroke="#475569" stroke-width="7" stroke-linecap="round" />
          <circle cx="175" cy="245" r="6" fill="#0f172a" />
          <!-- Main Chassis Body (Iconic Yellow Angular Frame) -->
          <polygon points="150,115 310,115 330,145 140,145" fill="url(#spotYellow)" stroke="#0f172a" stroke-width="3.5" />
          <!-- 360 Lidar Dome & Sensor Turret -->
          <rect x="230" y="102" width="36" height="14" rx="4" fill="#0f172a" stroke="#64748b" stroke-width="1.5" />
          <circle cx="248" cy="109" r="4" fill="#38bdf8" />
          <!-- Front Left Leg (Positioned on higher step) -->
          <line x1="290" y1="130" x2="310" y2="175" stroke="#0f172a" stroke-width="9" stroke-linecap="round" />
          <line x1="310" y1="175" x2="285" y2="230" stroke="#475569" stroke-width="7" stroke-linecap="round" />
          <circle cx="285" cy="230" r="6" fill="#0f172a" />
          <!-- Front Right Leg (Climbing high step!) -->
          <line x1="310" y1="130" x2="340" y2="160" stroke="#0f172a" stroke-width="9" stroke-linecap="round" />
          <line x1="340" y1="160" x2="375" y2="200" stroke="#475569" stroke-width="7" stroke-linecap="round" />
          <circle cx="375" cy="200" r="6" fill="#0f172a" />
          <!-- Head / Vision Camera Face -->
          <polygon points="325,120 365,125 355,145 325,140" fill="#0f172a" stroke="#eab308" stroke-width="2" />
          <circle cx="352" cy="132" r="4" fill="#38bdf8" /><circle cx="352" cy="132" r="1.5" fill="#ffffff" />
          <text x="30" y="50" font-size="12" font-weight="900" fill="#facc15">Boston Dynamics / ANYbotics Quadruped</text>
        </svg>`
    };

    return svgs[id] || svgs.dog;
  },

  // =========================================================================
  // PAGE 1: WELCOME & MISSIONS 🚀
  // =========================================================================
  renderPage1(state) {
    const robots = window.ROBOTS_DATA.robots;

    return `
      <div class="scene-wrapper">
        <div class="welcome-layout">
          <div class="welcome-hero-banner">
            <h1>🤖 AMAZING ROBOTS AROUND THE WORLD!</h1>
            <p>"Can you discover what these strange robots really do?"</p>
            <div style="font-size: 13px; color: #bae6fd; font-weight: 800; margin-top: 8px;">
              Mission Protocol: Work with your team. Look carefully, make guesses, read, discover the truth, and present your robot to the class.
            </div>
          </div>

          <div style="font-size: 14px; font-weight: 900; color: #0369a1; text-transform: uppercase; letter-spacing: 0.8px;">
            🕵️ Select Your Group's Mystery Robot:
          </div>

          <!-- 5 Robot Selection Cards -->
          <div class="robot-mystery-cards-row">
            ${robots.map(r => `
              <div class="robot-mystery-card ${state.activeRobotId === r.id ? 'is-active' : ''}" 
                onclick="window.robotsApp.setActiveRobot('${r.id}')">
                <div class="m-icon">${r.icon}</div>
                <div class="m-tag">Group ${r.groupNum}</div>
                <div class="m-desc">${r.shortTitle}</div>
                <div style="font-size: 10px; color: #64748b; font-weight: 700; margin-top: 4px;">
                  ${r.tagline}
                </div>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; gap: 12px; margin-top: 6px;">
            <button class="hud-btn primary" style="padding: 12px 28px; font-size: 16px;" onclick="window.robotsApp.startMission()">
              🚀 START THE MISSION ➔
            </button>
            <a href="worksheet.html" target="_blank" class="hud-btn" style="padding: 12px 18px; font-size: 14px;">
              🖨️ Open Paper Worksheets
            </a>
          </div>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // PAGE 2: MYSTERY ROBOT GUESSING 🤔 (No Name Shown!)
  // =========================================================================
  renderPage2(state) {
    const robot = window.ROBOTS_DATA.robots.find(r => r.id === state.activeRobotId) || window.ROBOTS_DATA.robots[0];
    const guesses = (state.predictions && state.predictions[robot.id]) || {};
    const isSaved = !!state.predictionsSaved;

    return `
      <div class="scene-wrapper">
        <div class="scene-top-bar">
          <div class="scene-title-group">
            <div class="scene-title-badge">
              <span class="title-icon">🤔</span>
              <div>
                <h2>Page 2: Mystery Robot Guessing</h2>
                <span class="subtitle">Group ${robot.groupNum} Mission · Make your team predictions!</span>
              </div>
            </div>
          </div>
          <div class="wh-target-pill">
            <span>❓ Target:</span> <strong>6 WH-Predictions</strong>
          </div>
        </div>

        <div class="guessing-layout">
          <!-- Left: Big Visual WITHOUT Robot Name -->
          <div class="mystery-photo-box">
            <div class="mystery-svg-wrap">
              <div class="classified-banner">🔒 CLASSIFIED FILE #${robot.groupNum}</div>
              ${this.getRobotSvg(robot.id, true)}
            </div>
            <div style="padding: 12px 16px; background: #ffffff; border-top: 2px solid #e2e8f0; font-size: 14px; font-weight: 800; color: #475569;">
              💡 <strong>Observation Clue:</strong> ${robot.mysteryClue}
            </div>
          </div>

          <!-- Right: 6 Prediction Question Input Boxes -->
          <div style="display: flex; flex-direction: column; justify-content: space-between;">
            <div class="questions-grid-container">
              <!-- 1. WHAT -->
              <div class="prediction-q-card">
                <div class="prediction-q-header"><span>🤔 1. WHAT</span> is it?</div>
                <input type="text" class="prediction-input" id="guess-what" placeholder="e.g. A swimming robot, toy..." value="${guesses.what || ''}" />
              </div>

              <!-- 2. WHERE -->
              <div class="prediction-q-card">
                <div class="prediction-q-header"><span>📍 2. WHERE</span> do you think it is used?</div>
                <input type="text" class="prediction-input" id="guess-where" placeholder="e.g. In the ocean, factories, space..." value="${guesses.where || ''}" />
              </div>

              <!-- 3. WHEN -->
              <div class="prediction-q-card">
                <div class="prediction-q-header"><span>📅 3. WHEN</span> do you think people created it?</div>
                <input type="text" class="prediction-input" id="guess-when" placeholder="e.g. In 2012, recently, 1990..." value="${guesses.when || ''}" />
              </div>

              <!-- 4. WHO -->
              <div class="prediction-q-card">
                <div class="prediction-q-header"><span>👤 4. WHO</span> do you think uses it?</div>
                <input type="text" class="prediction-input" id="guess-who" placeholder="e.g. Scientists, firefighters, divers..." value="${guesses.who || ''}" />
              </div>

              <!-- 5. WHY -->
              <div class="prediction-q-card">
                <div class="prediction-q-header"><span>❓ 5. WHY</span> do you think people made it?</div>
                <input type="text" class="prediction-input" id="guess-why" placeholder="e.g. To save animals, inspect places..." value="${guesses.why || ''}" />
              </div>

              <!-- 6. HOW -->
              <div class="prediction-q-card">
                <div class="prediction-q-header"><span>⚙️ 6. HOW</span> do you think it works?</div>
                <input type="text" class="prediction-input" id="guess-how" placeholder="e.g. With batteries, soft rubber, motors..." value="${guesses.how || ''}" />
              </div>
            </div>

            <!-- Action / Save Button -->
            <div style="margin-top: 10px; display: flex; gap: 8px; align-items: center;">
              <button class="hud-btn accent" style="flex: 1; justify-content: center; padding: 10px;" onclick="window.robotsApp.saveGuesses()">
                🔮 SAVE OUR GUESSES
              </button>

              ${isSaved ? `
                <button class="hud-btn primary animate-pop" style="flex: 1; justify-content: center; padding: 10px;" onclick="window.robotsApp.renderPage(3)">
                  Next: WH Detective 🔎 ➔
                </button>
              ` : ''}
            </div>

            ${isSaved ? `
              <div class="animate-pop" style="font-size: 13px; font-weight: 800; color: #0284c7; background: #e0f2fe; padding: 8px 12px; border-radius: 10px; margin-top: 6px; text-align: center;">
                "Interesting guesses! 🕵️ Now let's investigate the real files..."
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // PAGE 3: WH QUESTION DETECTIVE 🔎
  // =========================================================================
  renderPage3(state) {
    const pairs = window.ROBOTS_DATA.whMatchingPairs;
    const matchedSet = state.whMatchedSet || new Set();
    const selectedWh = state.selectedWhWord;

    return `
      <div class="scene-wrapper">
        <div class="scene-top-bar">
          <div class="scene-title-group">
            <div class="scene-title-badge">
              <span class="title-icon">🔎</span>
              <div>
                <h2>Page 3: WH Question Detective</h2>
                <span class="subtitle">Match the WH-Word to what it asks for (${matchedSet.size}/6 matched)</span>
              </div>
            </div>
          </div>
          <button class="hud-btn primary" onclick="window.robotsApp.renderPage(4)">
            Next: Read Robot File 📖 ➔
          </button>
        </div>

        <!-- Detective Rule Banner -->
        <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 14px; padding: 10px 18px; display: flex; justify-content: space-around; align-items: center; margin-bottom: 12px;">
          <span style="font-weight: 900; color: #0284c7;">WHAT ➔ Thing</span>
          <span style="color: #cbd5e1;">·</span>
          <span style="font-weight: 900; color: #0284c7;">WHERE ➔ Place</span>
          <span style="color: #cbd5e1;">·</span>
          <span style="font-weight: 900; color: #0284c7;">WHEN ➔ Time</span>
          <span style="color: #cbd5e1;">·</span>
          <span style="font-weight: 900; color: #0284c7;">WHO ➔ Person</span>
          <span style="color: #cbd5e1;">·</span>
          <span style="font-weight: 900; color: #0284c7;">WHY ➔ Reason</span>
          <span style="color: #cbd5e1;">·</span>
          <span style="font-weight: 900; color: #0284c7;">HOW ➔ Way it works</span>
        </div>

        <div class="wh-detective-layout">
          <!-- Left Column: WH-Question Words -->
          <div class="wh-match-column">
            ${pairs.map(p => {
              const isMatched = matchedSet.has(p.id);
              const isSelected = selectedWh === p.id;
              return `
                <div class="wh-match-item ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''}"
                  onclick="${isMatched ? '' : `window.robotsApp.selectWhWord('${p.id}')`}">
                  <span style="font-size: 20px;">❓</span>
                  <div style="flex: 1;">
                    <div style="font-size: 15px; font-weight: 900; color: #0f172a;">${p.word}</div>
                    <div style="font-size: 12px; color: #64748b; font-weight: 700;">${p.prompt}</div>
                  </div>
                  ${isMatched ? '<span style="color: #10b981; font-weight: 900;">✓</span>' : ''}
                </div>
              `;
            }).join('')}
          </div>

          <!-- Right Column: Meanings -->
          <div class="wh-match-column">
            ${[...pairs].reverse().map(p => {
              const isMatched = matchedSet.has(p.id);
              return `
                <div class="wh-match-item ${isMatched ? 'matched' : ''}"
                  onclick="${isMatched ? '' : `window.robotsApp.selectWhMeaning('${p.id}')`}">
                  <span style="font-size: 20px;">🔎</span>
                  <div style="flex: 1;">
                    <div style="font-size: 14px; font-weight: 900; color: #1e3a8a;">asks for ${p.meaning}</div>
                    <div style="font-size: 11px; color: #64748b; font-weight: 700;">e.g. "${p.example}"</div>
                  </div>
                  ${isMatched ? '<span style="color: #10b981; font-weight: 900;">✓</span>' : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Detective Feedback Strip -->
        <div style="background: #ffffff; border: 2px solid #cbd5e1; border-radius: 12px; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
          <div style="font-size: 14px; font-weight: 800; color: #334155;" id="wh-feedback-text">
            ${matchedSet.size === 6 ? '🎉 Great detective! 🔎 All 6 WH-Questions mastered!' : '👉 Click a WH-Word on the left, then click its meaning on the right!'}
          </div>
          <button class="hud-btn" onclick="window.robotsApp.resetWhMatching()">🔄 Reset</button>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // PAGE 4: ROBOT READING FILE 📖
  // =========================================================================
  renderPage4(state) {
    const robot = window.ROBOTS_DATA.robots.find(r => r.id === state.activeRobotId) || window.ROBOTS_DATA.robots[0];

    return `
      <div class="scene-wrapper">
        <div class="scene-top-bar">
          <div class="scene-title-group">
            <div class="scene-title-badge">
              <span class="title-icon">📖</span>
              <div>
                <h2>Page 4: Official Robot Dossier</h2>
                <span class="subtitle">Group ${robot.groupNum} Mission File: ${robot.name}</span>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="hud-btn" onclick="window.robotsSound.speak('${robot.reading.text.replace(/<[^>]*>/g, '').replace(/'/g, "\\'")}')">
              🔊 Read Aloud
            </button>
            <button class="hud-btn primary" onclick="window.robotsApp.renderPage(5)">
              Next: Find Answers 🔎 ➔
            </button>
          </div>
        </div>

        <div class="reading-file-layout">
          <!-- Left: The Reading Article (100–140 words, verified real science) -->
          <div class="reading-article-box">
            <div>
              <div class="reading-title-row">
                <div>
                  <h3 style="font-size: 20px; font-weight: 900; color: #0284c7;">${robot.reading.title}</h3>
                  <div style="font-size: 12px; font-weight: 800; color: #64748b;">${robot.field}</div>
                </div>
                <div style="font-size: 32px;">${robot.icon}</div>
              </div>

              <div class="reading-body-text">
                ${robot.reading.text}
              </div>
            </div>

            <!-- Amazing Fact Card -->
            <div class="amazing-fact-box">
              <span class="fact-icon">🤯</span>
              <div class="fact-text">
                <strong>AMAZING FACT:</strong> ${robot.reading.amazingFact}
              </div>
            </div>
          </div>

          <!-- Right: Visual & Clue Finder Helper -->
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="height: 240px; border-radius: 18px; overflow: hidden; border: 3px solid #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
              ${this.getRobotSvg(robot.id, false)}
            </div>

            <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 6px; flex: 1;">
              <div style="font-size: 13px; font-weight: 900; color: #0369a1; text-transform: uppercase;">
                🔎 Detective Checklist:
              </div>
              <div style="font-size: 12px; font-weight: 800; color: #475569; line-height: 1.4;">
                Read carefully with your teammates! Can you find:<br>
                • <strong>WHAT</strong> the robot is?<br>
                • <strong>WHERE</strong> it is used?<br>
                • <strong>WHEN</strong> it was made?<br>
                • <strong>WHO</strong> created it?<br>
                • <strong>WHY</strong> people made it?<br>
                • <strong>HOW</strong> it moves or works?
              </div>
              <div style="margin-top: auto;">
                <button class="hud-btn primary" style="width: 100%; justify-content: center;" onclick="window.robotsApp.renderPage(5)">
                  Ready? Answer the 6 Questions ➔
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // PAGE 5: FIND THE ANSWERS 🔎
  // =========================================================================
  renderPage5(state) {
    const robot = window.ROBOTS_DATA.robots.find(r => r.id === state.activeRobotId) || window.ROBOTS_DATA.robots[0];
    const answers = (state.comprehensionAnswers && state.comprehensionAnswers[robot.id]) || {};
    const checked = state.answersChecked || false;

    return `
      <div class="scene-wrapper">
        <div class="scene-top-bar">
          <div class="scene-title-group">
            <div class="scene-title-badge">
              <span class="title-icon">🔎</span>
              <div>
                <h2>Page 5: Find the Answers (Comprehension Check)</h2>
                <span class="subtitle">Based ONLY on the reading text for ${robot.name}</span>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="hud-btn" onclick="window.robotsApp.toggleReadingPeek()">
              📖 ${state.showReadingPeek ? 'Hide Reading' : 'Peek at Reading File'}
            </button>
            <button class="hud-btn primary" onclick="window.robotsApp.renderPage(6)">
              Next: Fact or Guess? ✅ ➔
            </button>
          </div>
        </div>

        <div class="answers-layout">
          <!-- 6 WH Comprehension Questions -->
          <div class="qa-card-list">
            ${robot.comprehension.map((item, qIdx) => {
              const userChoice = answers[qIdx];
              return `
                <div class="qa-card">
                  <div class="qa-q-text">${qIdx + 1}. [${item.wh}] ${item.q}</div>
                  <div class="qa-options-row">
                    ${item.options.map(opt => {
                      let statusClass = '';
                      if (userChoice === opt) statusClass = 'is-selected';
                      if (checked) {
                        if (opt === item.answer) statusClass = 'is-correct';
                        else if (userChoice === opt) statusClass = 'is-wrong';
                      }
                      return `
                        <button class="qa-opt-chip ${statusClass}" 
                          onclick="window.robotsApp.selectComprehensionAnswer(${qIdx}, '${opt.replace(/'/g, "\\'")}')">
                          ${opt}
                        </button>
                      `;
                    }).join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Right Column: Reading Peek or Check Feedback -->
          <div style="display: flex; flex-direction: column; justify-content: space-between;">
            ${state.showReadingPeek ? `
              <div style="background: #ffffff; border: 2px solid #cbd5e1; border-radius: 16px; padding: 18px; overflow-y: auto; flex: 1; margin-bottom: 12px;">
                <h4 style="font-size: 15px; font-weight: 900; color: #0284c7; margin-bottom: 6px;">📖 Reading Reference:</h4>
                <div style="font-size: 13px; line-height: 1.5; color: #334155; font-weight: 700;">
                  ${robot.reading.text}
                </div>
              </div>
            ` : `
              <div style="background: #ffffff; border: 3px solid #cbd5e1; border-radius: 20px; padding: 24px; text-align: center; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 12px;">
                <div style="font-size: 48px; margin-bottom: 10px;">${robot.icon}</div>
                <h3 style="font-size: 18px; font-weight: 900; color: #0f172a;">${robot.name}</h3>
                <p style="font-size: 13px; color: #64748b; font-weight: 700; margin-top: 4px; max-width: 380px;">
                  Look back at the reading text anytime by clicking the <strong>"Peek at Reading File"</strong> button above!
                </p>
                <div style="margin-top: 16px; font-size: 14px; font-weight: 800; color: #0284c7; background: #e0f2fe; padding: 6px 16px; border-radius: 12px;">
                  Answer all 6 questions, then check!
                </div>
              </div>
            `}

            <!-- Check Button Strip -->
            <div style="display: flex; gap: 8px;">
              <button class="hud-btn accent" style="flex: 1; justify-content: center; padding: 10px;" onclick="window.robotsApp.checkAnswers()">
                🔎 CHECK MY ANSWERS
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // PAGE 6: FACT OR GUESS? ✅❌
  // =========================================================================
  renderPage6(state) {
    const robot = window.ROBOTS_DATA.robots.find(r => r.id === state.activeRobotId) || window.ROBOTS_DATA.robots[0];
    const votes = (state.factGuessVotes && state.factGuessVotes[robot.id]) || {};

    return `
      <div class="scene-wrapper">
        <div class="scene-top-bar">
          <div class="scene-title-group">
            <div class="scene-title-badge">
              <span class="title-icon">⚡</span>
              <div>
                <h2>Page 6: Fact or Guess?</h2>
                <span class="subtitle">Is it REAL science or a funny GUESS?</span>
              </div>
            </div>
          </div>
          <button class="hud-btn primary" onclick="window.robotsApp.renderPage(7)">
            Next: Presentation Prep 🎤 ➔
          </button>
        </div>

        <div class="fact-guess-list">
          ${robot.factOrGuess.map((item, idx) => {
            const userChoice = votes[idx];
            let rowClass = '';
            if (userChoice !== undefined) {
              rowClass = (userChoice === item.isReal) ? 'answered-correct' : 'answered-wrong';
            }

            return `
              <div class="fact-guess-row ${rowClass}">
                <div>
                  <div class="fact-statement-text">"${item.text}"</div>
                  ${userChoice !== undefined ? `
                    <div style="font-size: 12px; font-weight: 900; margin-top: 4px; color: ${userChoice === item.isReal ? '#15803d' : '#b91c1c'};">
                      ${item.feedback}
                    </div>
                  ` : ''}
                </div>

                <div class="btn-choice-group">
                  <button class="btn-choice-pill real" onclick="window.robotsApp.voteFactOrGuess(${idx}, true)">
                    ✅ REAL
                  </button>
                  <button class="btn-choice-pill guess" onclick="window.robotsApp.voteFactOrGuess(${idx}, false)">
                    ❌ GUESS
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  // =========================================================================
  // PAGE 7: PRESENTATION PREP 🎤
  // =========================================================================
  renderPage7(state) {
    const robot = window.ROBOTS_DATA.robots.find(r => r.id === state.activeRobotId) || window.ROBOTS_DATA.robots[0];
    const p = robot.presentation;

    return `
      <div class="scene-wrapper">
        <div class="scene-top-bar">
          <div class="scene-title-group">
            <div class="scene-title-badge">
              <span class="title-icon">🎤</span>
              <div>
                <h2>Page 7: Presentation Prep</h2>
                <span class="subtitle">Prepare to present your robot to the whole class!</span>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <a href="worksheet.html" target="_blank" class="hud-btn">🖨️ Printable Notes</a>
            <button class="hud-btn primary" onclick="window.robotsApp.renderPage(8)">
              Next: Real World Reveal 🌍 ➔
            </button>
          </div>
        </div>

        <div class="presentation-card-wrap">
          <div style="border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-size: 18px; font-weight: 900; color: #0284c7;">
              🎤 OUR GROUP PRESENTATION (Group ${robot.groupNum})
            </h3>
            <button class="hud-btn" onclick="window.robotsSound.speak('${p.intro} ${p.where} ${p.who} ${p.why} ${p.how} ${p.amazing}')">
              🔊 Hear Full Speech Model
            </button>
          </div>

          <div class="presentation-sentence-line">
            <span>1. Our robot is called</span> <strong>"${robot.name}"</strong>.
          </div>

          <div class="presentation-sentence-line">
            <span>2. It is used in</span> <strong>"${robot.reading.text.match(/used in <strong>(.*?)<\/strong>/)?.[1] || 'special environments'}"</strong>.
          </div>

          <div class="presentation-sentence-line">
            <span>3. It was created / developed by</span> <strong>"${robot.field}"</strong>.
          </div>

          <div class="presentation-sentence-line">
            <span>4. It was developed around</span> <strong>"${robot.reading.text.match(/around <strong>(.*?)<\/strong>/)?.[1] || 'recent years'}"</strong>.
          </div>

          <div class="presentation-sentence-line">
            <span>5. It was made because</span> <strong>"${p.why.replace('It was made ', '')}"</strong>.
          </div>

          <div class="presentation-sentence-line">
            <span>6. It works by</span> <strong>"${p.how.replace('It works ', '')}"</strong>.
          </div>

          <div class="presentation-sentence-line">
            <span>7. The most amazing thing is:</span> <strong style="color: #d97706;">"${robot.reading.amazingFact}"</strong>
          </div>

          <!-- Personal opinion query -->
          <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 12px 16px; margin-top: 6px;">
            <div style="font-size: 14px; font-weight: 900; color: #1e3a8a;">
              ❓ Would your team use this robot?
            </div>
            <div style="display: flex; gap: 10px; margin-top: 8px;">
              <button class="hud-btn" onclick="window.robotsApp.setTeamUseChoice('YES'); window.robotsSound.speak('Yes, we would use it because it helps our world!')">
                👍 YES
              </button>
              <button class="hud-btn" onclick="window.robotsApp.setTeamUseChoice('NO'); window.robotsSound.speak('No, we would not use it.')">
                👎 NO
              </button>
              <button class="hud-btn" onclick="window.robotsApp.setTeamUseChoice('MAYBE'); window.robotsSound.speak('Maybe, in the future!')">
                🤔 MAYBE
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // PAGE 8: REAL WORLD REVEAL 🌍 (Non-competitive discovery)
  // =========================================================================
  renderPage8(state) {
    const robot = window.ROBOTS_DATA.robots.find(r => r.id === state.activeRobotId) || window.ROBOTS_DATA.robots[0];
    const opinion = (state.revealOpinions && state.revealOpinions[robot.id]);

    return `
      <div class="scene-wrapper">
        <div class="scene-top-bar">
          <div class="scene-title-group">
            <div class="scene-title-badge">
              <span class="title-icon">🌍</span>
              <div>
                <h2>Page 8: Real World Reveal!</h2>
                <span class="subtitle">Discovering authentic science and real jobs</span>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="hud-btn" onclick="window.robotsApp.cycleRobotReveal()">
              Next Robot (${robot.groupNum}/5) ➔
            </button>
            <button class="hud-btn primary" onclick="window.robotsApp.renderPage(9)">
              Next: Final Reflection 💭 ➔
            </button>
          </div>
        </div>

        <div class="reveal-stage-layout">
          <!-- Left: Real Robot Action Canvas -->
          <div class="reveal-visual-box">
            <div class="reveal-visual-canvas">
              ${this.getRobotSvg(robot.id, false)}
            </div>
            <div style="padding: 10px 16px; background: #ffffff; border-top: 2px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 900; font-size: 13px; color: #0f172a;">${robot.name}</span>
              <span style="font-size: 11px; font-weight: 800; color: #15803d; background: #dcfce7; padding: 2px 8px; border-radius: 6px;">
                ${robot.reveal.jobBadge}
              </span>
            </div>
          </div>

          <!-- Right: 4-Step Discovery Card -->
          <div class="reveal-info-box">
            <div>
              <div class="reveal-step-pill">STEP 1 &amp; 2: THE REAL USE REVEALED 🔓</div>
              <h3 style="font-size: 20px; font-weight: 900; color: #0284c7; margin-top: 4px;">
                ${robot.reveal.headline}
              </h3>
              <p style="font-size: 14px; line-height: 1.5; color: #334155; font-weight: 700; margin-top: 8px;">
                ${robot.reveal.explanation}
              </p>
            </div>

            <!-- Step 4: Comparison to Prediction -->
            <div style="border-top: 2px solid #f1f5f9; padding-top: 10px;">
              <div class="reveal-step-pill">STEP 4: REFLECTION ON YOUR GUESS</div>
              <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-top: 4px;">
                Is the real use different from what your group guessed on Page 2?
              </div>
              <div class="reveal-feedback-btns">
                <button class="btn-reveal-opinion ${opinion === 'yes' ? 'selected' : ''}" 
                  onclick="window.robotsApp.setRevealOpinion('yes'); window.robotsSound.speak('Yes, the real use was completely different!');">
                  😮 YES!
                </button>
                <button class="btn-reveal-opinion ${opinion === 'little' ? 'selected' : ''}" 
                  onclick="window.robotsApp.setRevealOpinion('little'); window.robotsSound.speak('A little bit different!');">
                  🙂 A LITTLE
                </button>
                <button class="btn-reveal-opinion ${opinion === 'right' ? 'selected' : ''}" 
                  onclick="window.robotsApp.setRevealOpinion('right'); window.robotsSound.speak('No, we were right!');">
                  😎 NO, WE WERE RIGHT!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // PAGE 9: FINAL REFLECTION 💭
  // =========================================================================
  renderPage9(state) {
    const robots = window.ROBOTS_DATA.robots;
    const selectedUseful = state.mostUsefulRobot || 'dog';
    const selectedSurprise = state.mostSurprisingRobot || 'fish';

    return `
      <div class="scene-wrapper">
        <div class="scene-top-bar">
          <div class="scene-title-group">
            <div class="scene-title-badge">
              <span class="title-icon">💭</span>
              <div>
                <h2>Page 9: Final Reflection &amp; Award</h2>
                <span class="subtitle">Class Discussion: Utility, Surprise, and Scientific Wonder</span>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <a href="worksheet.html" target="_blank" class="hud-btn">🖨️ Print Worksheets</a>
            <button class="hud-btn primary" onclick="window.robotsApp.renderPage(1)">🔄 Mission Home</button>
          </div>
        </div>

        <div class="reflection-layout">
          <!-- Left: Voting & Sentence Scaffolding -->
          <div class="reflection-poll-card">
            <h3 style="font-size: 16px; font-weight: 900; color: #0284c7;">
              1. Which robot do you think is MOST USEFUL?
            </h3>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              ${robots.map(r => `
                <button class="hud-btn ${selectedUseful === r.id ? 'primary' : ''}" onclick="window.robotsApp.setMostUseful('${r.id}')">
                  <span>${r.icon}</span> <span>${r.shortTitle}</span>
                </button>
              `).join('')}
            </div>
            <div style="background: #f0f9ff; border: 1.5px solid #bae6fd; border-radius: 10px; padding: 8px 12px; font-size: 13px; font-weight: 800; color: #0369a1;">
              🗣️ Say: <em>"I think the <strong>${robots.find(r => r.id === selectedUseful)?.shortTitle}</strong> is useful because it protects people and nature!"</em>
            </div>

            <h3 style="font-size: 16px; font-weight: 900; color: #d97706; margin-top: 10px;">
              2. Which robot SURPRISED you the most?
            </h3>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              ${robots.map(r => `
                <button class="hud-btn ${selectedSurprise === r.id ? 'accent' : ''}" onclick="window.robotsApp.setMostSurprising('${r.id}')">
                  <span>${r.icon}</span> <span>${r.shortTitle}</span>
                </button>
              `).join('')}
            </div>
            <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 10px; padding: 8px 12px; font-size: 13px; font-weight: 800; color: #b45309;">
              🗣️ Say: <em>"I was surprised by the <strong>${robots.find(r => r.id === selectedSurprise)?.shortTitle}</strong> because it can do something I never imagined!"</em>
            </div>
          </div>

          <!-- Right: Junior Roboticist Award Certificate -->
          <div class="reflection-award-box">
            <span style="font-size: 44px;">🎖️</span>
            <div>
              <h4 style="font-size: 17px; font-weight: 900; color: #92400e;">JUNIOR ROBOTICIST DISCOVERY AWARD</h4>
              <p style="font-size: 12px; font-weight: 700; color: #b45309; margin-top: 3px;">
                Awarded to the detective teams who investigated WH-questions and discovered real-world robotics!
              </p>
            </div>
            <button class="hud-btn primary" onclick="window.robotsSound.playFanfare(); window.robotsApp.showToast('🎉 CONGRATULATIONS DETECTIVES! MISSION COMPLETE!');">
              🏆 Award Mission Badges
            </button>
          </div>
        </div>
      </div>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.RobotsScenes = RobotsScenes;
}
