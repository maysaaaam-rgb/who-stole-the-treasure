/**
 * YOUNG INVENTOR ACADEMY — SCENE RENDERERS (10 MISSIONS + HOME + EXPO)
 * High-Resolution Vector Visuals & Smart Board Touch Interactions
 */

(function(root) {
  'use strict';

  class YoungInventorScenes {
    constructor(app) {
      this.app = app;
      this.data = root.YOUNG_INVENTOR_DATA;
    }

    // =========================================================================
    // HOME SCREEN (CINEMATIC OPENING)
    // =========================================================================
    renderHome(container) {
      const completedCount = this.app.state.completedMissions.size;
      const d = this.data.meta;

      container.innerHTML = `
        <div class="yi-scene-wrap">
          <div class="scene-title-box">
            <h1 class="scene-main-title">🚀 ${d.title.toUpperCase()}</h1>
            <p class="scene-subtitle">"${d.subtitle}"</p>
          </div>

          <!-- Futuristic Lab Hero Vector Illustration -->
          <div style="width:100%; max-width:680px; height:260px; margin:0 auto 24px auto;">
            <svg viewBox="0 0 500 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="labBg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#0f172a"/>
                  <stop offset="50%" stop-color="#1e293b"/>
                  <stop offset="100%" stop-color="#0b1329"/>
                </linearGradient>
                <linearGradient id="beamGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.8"/>
                  <stop offset="100%" stop-color="#06b6d4" stop-opacity="0"/>
                </linearGradient>
              </defs>

              <!-- Lab Floor & Blueprint Grid -->
              <rect width="500" height="220" rx="16" fill="url(#labBg)" stroke="#06b6d4" stroke-width="2"/>
              <line x1="0" y1="180" x2="500" y2="180" stroke="#334155" stroke-width="2"/>
              <line x1="50" y1="180" x2="0" y2="220" stroke="#334155" stroke-width="1.5"/>
              <line x1="150" y1="180" x2="120" y2="220" stroke="#334155" stroke-width="1.5"/>
              <line x1="250" y1="180" x2="250" y2="220" stroke="#334155" stroke-width="1.5"/>
              <line x1="350" y1="180" x2="380" y2="220" stroke="#334155" stroke-width="1.5"/>
              <line x1="450" y1="180" x2="500" y2="220" stroke="#334155" stroke-width="1.5"/>

              <!-- Hologram Light Beam -->
              <polygon points="250,20 180,180 320,180" fill="url(#beamGlow)" opacity="0.35"/>

              <!-- Central Floating Lightbulb Idea Hologram -->
              <circle cx="250" cy="80" r="32" fill="#f59e0b" opacity="0.2"/>
              <text x="250" y="94" font-size="44" text-anchor="middle">💡</text>

              <!-- Left Robotic Arm -->
              <rect x="70" y="110" width="24" height="70" rx="6" fill="#334155"/>
              <circle cx="82" cy="110" r="10" fill="#06b6d4"/>
              <line x1="82" y1="110" x2="130" y2="80" stroke="#06b6d4" stroke-width="4"/>
              <circle cx="130" cy="80" r="6" fill="#38bdf8"/>
              <line x1="130" y1="80" x2="170" y2="110" stroke="#06b6d4" stroke-width="4"/>
              <text x="180" y="125" font-size="24">🦾</text>

              <!-- Right Computer Workbench & Robo-Idea Character -->
              <rect x="360" y="100" width="90" height="80" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
              <rect x="375" y="115" width="60" height="40" rx="4" fill="#0284c7" opacity="0.4"/>
              <text x="405" y="142" font-size="20" text-anchor="middle">⚙️</text>
              <text x="320" y="170" font-size="50">🤖</text>
            </svg>
          </div>

          <!-- Robo-Idea Greeting -->
          <div class="robo-assistant-box">
            <div class="robo-avatar">🤖</div>
            <div class="robo-speech">
              "Hello young inventors! I'm <strong>Robo-Idea</strong>! Are you ready to find real problems, design incredible solutions, build working prototypes, and present at the <strong>Young Inventor Expo</strong>?"
            </div>
          </div>

          <!-- Main Launch Controls -->
          <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap; margin-bottom:24px;">
            <button type="button" class="yi-btn-giant" onclick="window.youngInventorApp.startAdventure()">
              <span>▶ START ADVENTURE</span>
            </button>
            <button type="button" class="hud-btn" style="padding:16px 28px; font-size:1.15rem;" onclick="window.youngInventorApp.renderMissionMap()">
              🗺️ <span>Lesson Map</span>
            </button>
            <button type="button" class="hud-btn teacher" style="padding:16px 28px; font-size:1.15rem;" onclick="window.youngInventorApp.openTeacherDrawer()">
              🧑‍🏫 <span>Teacher Mode (T)</span>
            </button>
          </div>

          <!-- Progress Pill -->
          <div class="hud-pill hud-mission-pill">
            <span>Progress: <strong>${completedCount} / 10 Missions Completed</strong></span>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // MISSION MAP OVERVIEW
    // =========================================================================
    renderMissionMap(container) {
      const completed = this.app.state.completedMissions;

      container.innerHTML = `
        <div class="yi-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">🗺️ INVENTOR MISSION MAP</h2>
            <p class="scene-subtitle">10 Steps from Problem to Young Inventor Expo!</p>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:14px; width:100%; max-width:1100px; margin-bottom:28px;">
            ${this.data.missionMap.map(m => {
              const isDone = completed.has(m.id);
              const isCurrent = (this.app.currentMission === m.id);
              return `
                <div style="background:var(--yi-bg-card); border:2.5px solid ${isDone ? '#10b981' : isCurrent ? '#06b6d4' : 'rgba(255,255,255,0.15)'}; border-radius:var(--yi-radius-md); padding:18px; text-align:center; cursor:pointer; transition:all 0.2s ease; position:relative;"
                     onclick="window.youngInventorApp.goToMission(${m.id})">
                  <div style="font-size:0.8rem; font-weight:800; color:${isDone ? '#10b981' : '#38bdf8'}; margin-bottom:6px;">
                    MISSION ${m.id} ${isDone ? '✓ DONE' : ''}
                  </div>
                  <div style="font-size:2.6rem; margin-bottom:6px;">${m.icon}</div>
                  <div style="font-size:1.05rem; font-weight:900; color:#ffffff; margin-bottom:4px;">${m.name}</div>
                  <div style="font-size:0.8rem; color:var(--yi-text-muted);">${m.desc}</div>
                </div>
              `;
            }).join('')}
          </div>

          <button type="button" class="hud-btn primary" onclick="window.youngInventorApp.goToMission(${this.app.currentMission})">
            <span>Continue Mission ${this.app.currentMission} ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // MISSION 1: INVENTOR DETECTIVES (Find the Problem)
    // =========================================================================
    renderMission1(container) {
      const d = this.data.mission1;
      const qIdx = this.app.state.mission1Index || 0;
      const currentScene = d.scenes[qIdx] || d.scenes[0];

      container.innerHTML = `
        <div class="yi-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">🔍 MISSION 1: ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <div class="robo-assistant-box">
            <div class="robo-avatar">🤖</div>
            <div class="robo-speech">
              "<strong>Problem = Something we need to fix!</strong> What is wrong in this classroom? Tap the correct problem sentence!"
            </div>
          </div>

          <!-- Problem Scenario Card -->
          <div style="background:var(--yi-bg-card); border:3px solid var(--yi-cyan); border-radius:var(--yi-radius-lg); padding:28px; width:100%; max-width:850px; text-align:center; box-shadow:var(--yi-shadow-glow); margin-bottom:20px;">
            <div style="font-size:0.85rem; font-weight:800; color:#38bdf8; text-transform:uppercase; margin-bottom:8px;">
              Scenario ${qIdx + 1} of ${d.scenes.length}
            </div>

            <div style="font-size:5rem; margin-bottom:12px;">${currentScene.icon}</div>

            <div style="font-family:var(--yi-font-display); font-size:1.8rem; font-weight:900; color:#ffffff; margin-bottom:8px;">
              ${currentScene.title}
            </div>

            <div style="font-size:1.15rem; color:#cbd5e1; margin-bottom:16px;">
              "${currentScene.prompt}"
            </div>

            <button type="button" class="hud-btn" style="padding:6px 16px; margin-bottom:20px;" onclick="window.youngInventorApp.speak('${currentScene.audioClue}')">
              🔊 Hear Clue
            </button>

            <!-- 3 Options -->
            <div class="problem-options-list">
              ${currentScene.options.map((opt, idx) => `
                <button type="button" class="problem-opt-btn" onclick="window.youngInventorApp.answerMission1(${idx})">
                  <span style="font-size:1.2rem; margin-right:8px;">🔘</span>
                  <span>${opt.text}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div style="display:flex; gap:12px;">
            <button type="button" class="hud-btn" onclick="window.youngInventorApp.renderMissionMap()">🗺️ Map</button>
            <button type="button" class="yi-btn-giant" onclick="window.youngInventorApp.goToMission(2)">
              <span>MISSION 2: IDEA LAB ➔</span>
            </button>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // MISSION 2: IDEA LAB (Find a Solution)
    // =========================================================================
    renderMission2(container) {
      const d = this.data.mission2;
      const matched = this.app.state.mission2Matched || [];

      container.innerHTML = `
        <div class="yi-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">💡 MISSION 2: ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <div class="robo-assistant-box">
            <div class="robo-avatar">🤖</div>
            <div class="robo-speech">
              "<strong>Solution = An idea that fixes a problem.</strong> Thomas Edison filled hundreds of notebooks with ideas. Connect each problem to its invention solution!"
            </div>
          </div>

          <!-- Matching Columns -->
          <div class="match-columns-grid">
            <!-- Left: Problems -->
            <div style="display:flex; flex-direction:column; gap:12px;">
              <h3 style="font-size:1.15rem; color:#f87171; font-weight:900; margin-bottom:4px;">⚠️ PROBLEMS:</h3>
              ${d.matchingPairs.map(pair => {
                const isMatched = matched.includes(pair.id);
                const isSelected = (this.app.state.selectedProblemId === pair.id);
                return `
                  <div class="match-item-card ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''}"
                       onclick="window.youngInventorApp.selectProblemMatch('${pair.id}')">
                    <span style="font-size:2rem;">${pair.problemIcon}</span>
                    <span>${pair.problemText}</span>
                    ${isMatched ? '<span style="margin-left:auto; color:#10b981; font-weight:900;">✓ FIXED</span>' : ''}
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Right: Solutions -->
            <div style="display:flex; flex-direction:column; gap:12px;">
              <h3 style="font-size:1.15rem; color:#34d399; font-weight:900; margin-bottom:4px;">💡 INVENTIONS:</h3>
              ${d.matchingPairs.map(pair => {
                const isMatched = matched.includes(pair.id);
                return `
                  <div class="match-item-card ${isMatched ? 'matched' : ''}"
                       onclick="window.youngInventorApp.selectSolutionMatch('${pair.id}')">
                    <span style="font-size:2rem;">${pair.solutionIcon}</span>
                    <span>${pair.solutionText}</span>
                    ${isMatched ? '<span style="margin-left:auto; color:#10b981; font-weight:900;">✓ SOLVED</span>' : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <button type="button" class="yi-btn-giant" onclick="window.youngInventorApp.goToMission(3)">
            <span>MISSION 3: IDEA HUNTERS ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // MISSION 3: IDEA HUNTERS (Nature & Old Things)
    // =========================================================================
    renderMission3(container) {
      const d = this.data.mission3;

      container.innerHTML = `
        <div class="yi-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">🌱 MISSION 3: ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <div class="robo-assistant-box">
            <div class="robo-avatar">🤖</div>
            <div class="robo-speech">
              "<strong>Biomimicry!</strong> Nature is the world's oldest inventor. Click on each card to see how animals, plants, and recycled materials inspire world-famous inventions!"
            </div>
          </div>

          <!-- Nature Cards Grid -->
          <div class="nature-cards-grid">
            ${d.natureExamples.map(item => `
              <div class="nature-flow-card">
                <div>
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                    <span style="font-size:1.1rem; font-weight:900; color:#38bdf8;">${item.sourceName}</span>
                    <span style="font-size:2.4rem;">${item.sourceIcon}</span>
                  </div>
                  <p style="font-size:0.9rem; color:#cbd5e1; line-height:1.4;">${item.sourceDesc}</p>
                </div>

                <div class="nature-arrow-row">
                  <span>⬇️ INSPIRES ⬇️</span>
                </div>

                <div style="background:rgba(15,23,42,0.85); border:1.5px solid #f59e0b; border-radius:var(--yi-radius-md); padding:14px;">
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
                    <span style="font-size:1.1rem; font-weight:900; color:#fef08a;">${item.inventionName}</span>
                    <span style="font-size:2.4rem;">${item.inventionIcon}</span>
                  </div>
                  <p style="font-size:0.85rem; color:#e2e8f0; line-height:1.4;">${item.inventionDesc}</p>
                  <div style="font-size:0.95rem; font-weight:900; color:#10b981; margin-top:8px;">
                    "${item.keySentence}"
                  </div>
                  <button type="button" class="hud-btn" style="padding:4px 10px; font-size:0.8rem; margin-top:8px;"
                          onclick="window.youngInventorApp.speak('${item.keySentence}')">
                    🔊 Hear Sentence
                  </button>
                </div>
              </div>
            `).join('')}
          </div>

          <button type="button" class="yi-btn-giant" onclick="window.youngInventorApp.goToMission(4)">
            <span>MISSION 4: INVENTOR WORKSHOP ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // MISSION 4: INVENTOR WORKSHOP (Design & Draw)
    // =========================================================================
    renderMission4(container) {
      const d = this.data.mission4;
      const currentProblem = this.app.state.chosenProblem || d.problemPresets[0];
      const invName = this.app.state.inventionName || currentProblem.defaultInvention;

      container.innerHTML = `
        <div class="yi-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">🎨 MISSION 4: ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <div class="robo-assistant-box">
            <div class="robo-avatar">🤖</div>
            <div class="robo-speech">
              "Choose your problem, name your invention, and sketch your blueprint on the touch drawing board!"
            </div>
          </div>

          <!-- Problem Chooser & Name Input -->
          <div style="background:var(--yi-bg-card); border:2px solid rgba(255,255,255,0.15); border-radius:var(--yi-radius-lg); padding:20px; width:100%; max-width:860px; margin-bottom:20px;">
            <div style="font-size:0.95rem; font-weight:800; color:#38bdf8; margin-bottom:10px;">
              1. CHOOSE A PROBLEM TO SOLVE:
            </div>
            <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px;">
              ${d.problemPresets.map(p => `
                <button type="button" class="hud-btn ${p.id === currentProblem.id ? 'primary' : ''}"
                        onclick="window.youngInventorApp.selectProblemPreset('${p.id}')">
                  <span>${p.icon}</span>
                  <span>${p.name}</span>
                </button>
              `).join('')}
            </div>

            <div style="font-size:0.95rem; font-weight:800; color:#f59e0b; margin-bottom:8px;">
              2. NAME YOUR INVENTION:
            </div>
            <input type="text" id="input-invention-name" value="${invName}"
                   style="background:rgba(30,41,59,0.9); border:2px solid var(--yi-cyan); border-radius:var(--yi-radius-md); color:#fff; font-size:1.2rem; font-weight:900; padding:12px 18px; width:100%; max-width:500px;"
                   oninput="window.youngInventorApp.setInventionName(this.value)" />
          </div>

          <!-- Digital Touch Blueprint Canvas -->
          <div class="canvas-wrapper-box">
            <div style="display:flex; justify-content:space-between; width:100%; margin-bottom:8px;">
              <span style="font-size:0.85rem; font-weight:800; color:var(--yi-cyan);">📐 BLUEPRINT SKETCH BOARD</span>
              <span style="font-size:0.85rem; color:#94a3b8;">Draw with finger or stylus</span>
            </div>

            <canvas id="blueprint-canvas" width="600" height="320"></canvas>

            <div class="canvas-toolbar">
              <span style="font-size:0.85rem; font-weight:800; color:#cbd5e1;">Colors:</span>
              ${d.canvasColors.map((color, idx) => `
                <div class="color-swatch ${idx === 0 ? 'active' : ''}" style="background:${color};"
                     onclick="window.youngInventorApp.setCanvasColor('${color}', this)"></div>
              `).join('')}

              <button type="button" class="hud-btn" style="padding:6px 14px; font-size:0.85rem;" onclick="window.youngInventorApp.clearCanvas()">
                🗑️ Clear
              </button>
              <button type="button" class="hud-btn" style="padding:6px 14px; font-size:0.85rem;" onclick="window.youngInventorApp.undoCanvas()">
                ↩️ Undo
              </button>
            </div>
          </div>

          <button type="button" class="yi-btn-giant" onclick="window.youngInventorApp.goToMission(5)">
            <span>MISSION 5: BUILD PROTOTYPE ➔</span>
          </button>
        </div>
      `;

      // Init canvas after DOM mount
      setTimeout(() => this.app.initDrawingCanvas(), 50);
    }

    // =========================================================================
    // MISSION 5: INVENTION BUILDER (Build the Prototype)
    // =========================================================================
    renderMission5(container) {
      const d = this.data.mission5;
      const equipped = this.app.state.equippedComponents || [];

      container.innerHTML = `
        <div class="yi-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">⚙️ MISSION 5: ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <div class="robo-assistant-box">
            <div class="robo-avatar">🤖</div>
            <div class="robo-speech">
              "Tap components from the parts shelf to snap them into your prototype pod! Notice how your machine description generates automatically!"
            </div>
          </div>

          <div class="builder-layout-grid">
            <!-- Left: Parts Shelf -->
            <div class="components-shelf">
              <h3 style="font-size:1.05rem; font-weight:900; color:var(--yi-cyan); margin-bottom:6px;">🧰 PARTS SHELF:</h3>
              ${d.components.map(comp => `
                <div class="comp-item-pill" onclick="window.youngInventorApp.toggleComponent('${comp.id}')">
                  <span style="font-size:1.8rem;">${comp.icon}</span>
                  <span>${comp.name}</span>
                </div>
              `).join('')}
            </div>

            <!-- Right: Assembly Pod -->
            <div class="assembly-pod-box">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid rgba(255,255,255,0.15); padding-bottom:10px;">
                  <h3 style="font-size:1.25rem; font-weight:900; color:#fef08a;">
                    🔬 PROTOTYPE POD: ${this.app.state.inventionName || 'My Invention'}
                  </h3>
                  <span style="font-size:0.85rem; color:#38bdf8; font-weight:800;">${equipped.length} Parts Installed</span>
                </div>

                <div class="equipped-components-grid">
                  ${equipped.length === 0 ? `
                    <div style="grid-column: 1 / -1; padding:40px; color:#94a3b8; font-weight:700; text-align:center;">
                      Tap components on the left to install them into your prototype!
                    </div>
                  ` : equipped.map(cId => {
                    const comp = d.components.find(c => c.id === cId);
                    if (!comp) return '';
                    return `
                      <div class="equipped-comp-card">
                        <button class="remove-comp-btn" onclick="window.youngInventorApp.toggleComponent('${comp.id}')">✕</button>
                        <div style="font-size:2.2rem; margin-bottom:4px;">${comp.icon}</div>
                        <div style="font-size:0.85rem; font-weight:800; color:#fff;">${comp.name}</div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>

              <!-- Auto-Generated Sentences -->
              <div class="auto-sentences-box">
                <div style="font-size:0.85rem; color:#38bdf8; margin-bottom:4px;">GENERATED DESCRIPTION (IT HAS...):</div>
                ${equipped.length === 0 ? 'It has...' : equipped.map(cId => {
                  const comp = d.components.find(c => c.id === cId);
                  return comp ? '• ' + comp.sentence : '';
                }).filter(Boolean).join('<br>')}
              </div>
            </div>
          </div>

          <button type="button" class="yi-btn-giant" onclick="window.youngInventorApp.goToMission(6)">
            <span>MISSION 6: WHAT CAN IT DO? ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // MISSION 6: WHAT CAN IT DO? (CAN / CAN'T)
    // =========================================================================
    renderMission6(container) {
      const d = this.data.mission6;
      const chosenVerbs = this.app.state.chosenVerbs || [];
      const chosenCant = this.app.state.chosenCant || d.cantOptions[0];

      container.innerHTML = `
        <div class="yi-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">🚀 MISSION 6: ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <div class="robo-assistant-box">
            <div class="robo-avatar">🤖</div>
            <div class="robo-speech">
              "<strong>IT CAN + VERB!</strong> Select 3 super abilities that your invention CAN do, and 1 funny thing it CAN'T do!"
            </div>
          </div>

          <!-- Action Verbs Grid -->
          <div class="verb-selection-grid">
            ${d.actionVerbs.map(v => {
              const isSelected = chosenVerbs.includes(v.id);
              return `
                <div class="verb-chip-btn ${isSelected ? 'active' : ''}" onclick="window.youngInventorApp.toggleVerb('${v.id}')">
                  <span style="font-size:1.8rem;">${v.icon}</span>
                  <span>CAN ${v.verb.toUpperCase()}</span>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Generated Abilities Card -->
          <div style="background:var(--yi-bg-card); border:2.5px solid #10b981; border-radius:var(--yi-radius-lg); padding:24px; width:100%; max-width:950px; margin-bottom:24px;">
            <h3 style="font-size:1.2rem; font-weight:900; color:#a7f3d0; margin-bottom:12px;">
              🌟 INVENTOR ABILITY SUMMARY:
            </h3>

            <div style="font-size:1.15rem; font-weight:800; color:#ffffff; line-height:1.6; margin-bottom:14px;">
              ${chosenVerbs.length === 0 ? 'Select up to 3 action verbs above...' : chosenVerbs.map(vId => {
                const v = d.actionVerbs.find(item => item.id === vId);
                return '• My invention <strong>can ' + v.verb + '</strong> ' + v.exampleObject + '.';
              }).join('<br>')}
              <br>
              • But ${chosenCant.text} ${chosenCant.icon}
            </div>

            <button type="button" class="hud-btn" onclick="window.youngInventorApp.readAbilities()">
              🔊 Read Abilities Aloud
            </button>
          </div>

          <button type="button" class="yi-btn-giant" onclick="window.youngInventorApp.goToMission(7)">
            <span>MISSION 7: HOW DOES IT WORK? ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // MISSION 7: HOW DOES IT WORK? (Simple Instructions)
    // =========================================================================
    renderMission7(container) {
      const d = this.data.mission7;
      const steps = d.presets.smartBag;

      container.innerHTML = `
        <div class="yi-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">📋 MISSION 7: ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <div class="robo-assistant-box">
            <div class="robo-avatar">🤖</div>
            <div class="robo-speech">
              "Clear instructions make your invention easy to use! Read the 3 steps: <strong>FIRST... THEN... FINALLY!</strong>"
            </div>
          </div>

          <!-- 3 Sequential Steps -->
          <div class="sequence-slots-strip">
            ${steps.map(step => `
              <div class="sequence-slot-box filled">
                <div style="font-size:1rem; font-weight:900; color:#38bdf8;">${step.step}</div>
                <div style="font-size:3.5rem; margin:10px 0;">${step.icon}</div>
                <div style="font-size:1.2rem; font-weight:900; color:#fef08a;">"${step.text}"</div>
                <button type="button" class="hud-btn" style="padding:6px 12px; font-size:0.85rem; margin-top:8px;"
                        onclick="window.youngInventorApp.speak('${step.step}, ${step.text}')">
                  🔊 Listen
                </button>
              </div>
            `).join('')}
          </div>

          <button type="button" class="yi-btn-giant" onclick="window.youngInventorApp.goToMission(8)">
            <span>MISSION 8: TEST LAB ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // MISSION 8: TEST LAB (Test the Prototype)
    // =========================================================================
    renderMission8(container) {
      const d = this.data.mission8;
      const isTesting = this.app.state.isTestingActive;
      const testResult = this.app.state.testResult;

      container.innerHTML = `
        <div class="yi-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">🧪 MISSION 8: ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <div class="robo-assistant-box">
            <div class="robo-avatar">🤖</div>
            <div class="robo-speech">
              "Karl Benz tested his first motorcar many times before it was ready. Press <strong>START STRESS TEST</strong> to run your prototype through the lab chamber!"
            </div>
          </div>

          <!-- Test Chamber Box -->
          <div class="test-chamber-box">
            <div class="test-lamp-strip">
              <div class="test-lamp ${testResult ? 'active-green' : isTesting ? 'active-red' : ''}"></div>
              <div class="test-lamp ${testResult ? 'active-green' : isTesting ? 'active-red' : ''}"></div>
              <div class="test-lamp ${testResult ? 'active-green' : isTesting ? 'active-red' : ''}"></div>
            </div>

            <div style="font-size:5rem; margin-bottom:12px;">${isTesting ? '⚡🌪️⚙️' : '🔬📦'}</div>

            <div style="font-family:var(--yi-font-display); font-size:2rem; font-weight:900; color:#ffffff; margin-bottom:10px;">
              ${isTesting ? 'TESTING IN PROGRESS...' : testResult ? 'TEST PASSED WITH FLYING COLORS!' : 'CHAMBER READY: 10-BOOK WEIGHT CHALLENGE'}
            </div>

            <div style="font-size:1.15rem; color:#cbd5e1; margin-bottom:20px;">
              ${testResult ? 'Your invention carried the load safely! But can we make it even lighter and faster?' : 'Can your prototype carry 10 heavy dictionaries without breaking?'}
            </div>

            ${!isTesting && !testResult ? `
              <button type="button" class="yi-btn-giant" onclick="window.youngInventorApp.runStressTest()">
                <span>⚡ START STRESS TEST</span>
              </button>
            ` : ''}

            ${testResult ? `
              <div style="background:rgba(16,185,129,0.2); border:2px solid #10b981; border-radius:var(--yi-radius-md); padding:16px; margin-bottom:20px;">
                <span style="font-size:1.2rem; font-weight:900; color:#a7f3d0;">
                  🌟 ${d.growthMindsetQuote}
                </span>
              </div>
            ` : ''}
          </div>

          <button type="button" class="yi-btn-giant" onclick="window.youngInventorApp.goToMission(9)">
            <span>MISSION 9: MAKE IT BETTER ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // MISSION 9: MAKE IT BETTER! (Improve & Upgrade)
    // =========================================================================
    renderMission9(container) {
      const d = this.data.mission9;
      const chosenUpgrade = this.app.state.chosenUpgrade || d.upgrades[0];

      container.innerHTML = `
        <div class="yi-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">🔧 MISSION 9: ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <div class="robo-assistant-box">
            <div class="robo-avatar">🤖</div>
            <div class="robo-speech">
              "Great inventors always improve their designs! Choose an upgrade module to make your machine faster, lighter, or smarter!"
            </div>
          </div>

          <!-- Upgrades Grid -->
          <div class="upgrades-grid">
            ${d.upgrades.map(up => {
              const isChosen = (chosenUpgrade.id === up.id);
              return `
                <div class="upgrade-card ${isChosen ? 'chosen' : ''}" onclick="window.youngInventorApp.selectUpgrade('${up.id}')">
                  <div style="font-size:2.8rem;">${up.icon}</div>
                  <div>
                    <div style="font-size:1.1rem; font-weight:900; color:#fff; margin-bottom:4px;">${up.title}</div>
                    <div style="font-size:0.85rem; color:#cbd5e1; margin-bottom:6px;">${up.desc}</div>
                    <div style="font-size:0.95rem; font-weight:800; color:#10b981;">"${up.benefit}"</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Improved Speech Frame -->
          <div style="background:rgba(15,23,42,0.9); border:2px solid #f59e0b; border-radius:var(--yi-radius-lg); padding:20px; width:100%; max-width:900px; text-align:center; margin-bottom:24px;">
            <div style="font-size:1.3rem; font-weight:900; color:#fef08a;">
              "I improved my idea. ${chosenUpgrade.benefit}"
            </div>
          </div>

          <button type="button" class="yi-btn-giant" onclick="window.youngInventorApp.goToMission(10)">
            <span>MISSION 10: PRESENTATION &amp; EXPO ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // MISSION 10: PRESENTATION LAB & YOUNG INVENTOR EXPO
    // =========================================================================
    renderMission10(container) {
      const d = this.data.mission10;
      const timerVal = this.app.state.timerSeconds || 300;
      const minutes = Math.floor(timerVal / 60);
      const seconds = timerVal % 60;
      const formattedTimer = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;

      const invName = this.app.state.inventionName || "Super Bag 3000";

      container.innerHTML = `
        <div class="yi-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">🏆 MISSION 10: ${d.title}</h2>
            <p class="scene-subtitle">Step onto the stage and present your invention!</p>
          </div>

          <!-- Visual 5:00 Expo Timer -->
          <div style="text-align:center; margin-bottom:16px;">
            <div class="timer-box-hero" id="expo-timer-display">
              ⏱️ ${formattedTimer}
            </div>
            <div style="display:flex; gap:10px; justify-content:center;">
              <button type="button" class="hud-btn" onclick="window.youngInventorApp.toggleTimer()">
                ${this.app.state.isTimerRunning ? '⏸️ Pause Timer' : '▶️ Start 5:00 Timer'}
              </button>
              <button type="button" class="hud-btn" onclick="window.youngInventorApp.resetTimer()">
                🔄 Reset Timer
              </button>
              <button type="button" class="hud-btn primary" onclick="window.youngInventorApp.playApplause()">
                👏 Audience Applause!
              </button>
            </div>
          </div>

          <!-- 9 Speaking Cards Carousel -->
          <div style="font-size:1.15rem; font-weight:900; color:#38bdf8; margin-bottom:12px;">
            🎤 9 EXPO PRESENTATION CARDS:
          </div>
          <div class="speech-cards-carousel">
            ${d.speechCards.map(card => {
              let text = card.template
                .replace('[NAME]', 'Inventor')
                .replace('[PROBLEM]', 'the school bag is too heavy')
                .replace('[INVENTION NAME]', invName)
                .replace('[COMPONENTS]', 'wheels and wings')
                .replace('[ADJECTIVE]', 'fast and strong')
                .replace('[CAN 1]', 'carry books')
                .replace('[CAN 2]', 'fly')
                .replace('[CAN\'T]', 'swim in water')
                .replace('[STEP 1]', 'put books inside')
                .replace('[STEP 2]', 'press the button')
                .replace('[STEP 3]', 'it follows you')
                .replace('[IMPROVEMENT]', 'move on stairs');

              return `
                <div class="speech-prompt-card">
                  <div>
                    <div style="font-size:0.85rem; font-weight:900; color:#f59e0b; margin-bottom:4px;">${card.tag}</div>
                    <div style="font-size:1.05rem; font-weight:800; color:#ffffff; line-height:1.4;">"${text}"</div>
                  </div>
                  <button type="button" class="hud-btn" style="padding:6px 12px; font-size:0.8rem; align-self:flex-start;"
                          onclick="window.youngInventorApp.speak('${text.replace(/'/g, "\\'")}')">
                    🔊 Hear Card
                  </button>
                </div>
              `;
            }).join('')}
          </div>

          <div style="display:flex; gap:14px; justify-content:center; flex-wrap:wrap;">
            <button type="button" class="hud-btn amber" style="padding:14px 24px; font-size:1.1rem;" onclick="window.youngInventorApp.openAudienceCardModal()">
              🔎 Audience Detective Review Card
            </button>
            <button type="button" class="yi-btn-giant" onclick="window.youngInventorApp.renderCelebration()">
              <span>CLAIM YOUNG INVENTOR BADGE 🏆</span>
            </button>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // GRAND CELEBRATION & BADGE REWARD
    // =========================================================================
    renderCelebration(container) {
      container.innerHTML = `
        <div class="yi-scene-wrap">
          <div style="background:radial-gradient(circle at center, #1e293b, #070b14); border:3.5px solid #f59e0b; border-radius:var(--yi-radius-lg); padding:44px 36px; max-width:880px; width:100%; text-align:center; box-shadow:var(--yi-shadow-amber);">
            <div style="font-size:6rem; margin-bottom:12px; filter:drop-shadow(0 0 30px rgba(245,158,11,0.7));">
              🏆
            </div>

            <h1 style="font-family:var(--yi-font-display); font-size:2.8rem; font-weight:900; color:#fef08a; margin-bottom:6px;">
              YOUNG INVENTOR MASTER!
            </h1>

            <p style="font-size:1.35rem; font-weight:800; color:#ffffff; margin-bottom:20px;">
              "You solved problems, created an original invention, and presented to the world!"
            </p>

            <div style="display:inline-flex; align-items:center; gap:10px; background:rgba(245,158,11,0.2); border:2px solid #f59e0b; border-radius:30px; padding:8px 24px; font-size:1.4rem; font-weight:900; color:#fef08a; margin-bottom:24px;">
              ⭐ +100 INVENTOR XP &amp; BADGE UNLOCKED!
            </div>

            <!-- 4 Star Trophies -->
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:14px; max-width:750px; margin:0 auto 28px auto;">
              <div style="background:rgba(15,23,42,0.9); border:1.5px solid #38bdf8; border-radius:10px; padding:14px;">
                <div style="font-size:2.2rem;">🔍</div>
                <div style="font-size:0.95rem; font-weight:900; color:#fff;">Problem Solver</div>
              </div>
              <div style="background:rgba(15,23,42,0.9); border:1.5px solid #f59e0b; border-radius:10px; padding:14px;">
                <div style="font-size:2.2rem;">💡</div>
                <div style="font-size:0.95rem; font-weight:900; color:#fff;">Idea Creator</div>
              </div>
              <div style="background:rgba(15,23,42,0.9); border:1.5px solid #10b981; border-radius:10px; padding:14px;">
                <div style="font-size:2.2rem;">⚙️</div>
                <div style="font-size:0.95rem; font-weight:900; color:#fff;">Prototype Builder</div>
              </div>
              <div style="background:rgba(15,23,42,0.9); border:1.5px solid #a855f7; border-radius:10px; padding:14px;">
                <div style="font-size:2.2rem;">🎤</div>
                <div style="font-size:0.95rem; font-weight:900; color:#fff;">Expo Presenter</div>
              </div>
            </div>

            <div style="display:flex; gap:14px; justify-content:center; flex-wrap:wrap;">
              <a href="worksheet.html" target="_blank" class="hud-btn" style="padding:14px 28px; font-size:1.15rem; background:#166534; border-color:#22c55e;">
                🖨️ Print Official Certificate &amp; Dossier
              </a>
              <a href="../index.html#library" class="hud-btn" style="padding:14px 28px; font-size:1.15rem;">
                📚 Library Shelf
              </a>
              <button type="button" class="yi-btn-giant" onclick="window.youngInventorApp.restartLesson()">
                <span>🔄 Restart Academy</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // TEACHER OBSERVATION MODAL & 12-POINT RUBRIC
    // =========================================================================
    renderTeacherModal(container) {
      const rubric = this.app.state.rubric || {};
      const guides = this.data.teacherGuides;

      container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid #f59e0b; padding-bottom:10px;">
          <div>
            <h3 style="font-size:1.4rem; color:#f59e0b; font-weight:900; margin:0;">
              🧑‍🏫 Teacher Guide &amp; 12-Point Rubric
            </h3>
            <span style="font-size:0.85rem; color:#38bdf8; font-weight:700;">Young Inventor Academy • Grade 4 A1+</span>
          </div>
          <button type="button" class="hud-btn" onclick="window.youngInventorApp.closeTeacherDrawer()">✕ Close</button>
        </div>

        <!-- Fast Mission Jumps (M1 to M10) -->
        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:18px;">
          ${Array.from({ length: 10 }).map((_, i) => {
            const num = i + 1;
            return `
              <button type="button" class="hud-btn ${num === this.app.currentMission ? 'primary' : ''}" style="padding:6px 12px; font-size:0.85rem;"
                      onclick="window.youngInventorApp.goToMission(${num}); window.youngInventorApp.openTeacherDrawer();">
                M${num}
              </button>
            `;
          }).join('')}
        </div>

        <!-- 12-Point Rubric -->
        <div style="background:rgba(15,23,42,0.9); border:2px solid rgba(255,255,255,0.15); border-radius:var(--yi-radius-md); padding:18px; margin-bottom:20px;">
          <h4 style="font-size:1.1rem; color:#fef08a; font-weight:900; margin-bottom:10px;">
            📋 12-Point Presentation Assessment Rubric
          </h4>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">
            ${this.data.mission10.rubric.map(item => `
              <div style="background:rgba(30,41,59,0.8); padding:10px; border-radius:8px;">
                <div style="font-weight:900; font-size:0.88rem; color:#38bdf8;">${item.category}</div>
                <div style="font-size:0.78rem; color:#cbd5e1; margin:4px 0 8px 0;">${item.desc}</div>
                <div style="display:flex; gap:6px;">
                  ${[1, 2, 3].map(score => `
                    <button type="button" class="hud-btn ${rubric[item.id] === score ? 'primary' : ''}" style="padding:4px 10px; font-size:0.8rem;"
                            onclick="window.youngInventorApp.setRubricScore('${item.id}', ${score})">
                      ${score}★
                    </button>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Lesson Flow Notes -->
        <div style="font-size:0.9rem; color:#cbd5e1; line-height:1.5;">
          <strong style="color:#f59e0b;">Classroom Flow Tip:</strong>
          Lesson 1 covers Missions 1–4 (Problem, Nature &amp; Blueprint). Lesson 2 covers Missions 5–7 (Building, CAN/CAN'T &amp; Instructions). Lesson 3 covers Missions 8–10 (Testing, Improving &amp; Expo Presentation).
        </div>
      `;
    }
  }

  root.YoungInventorScenes = YoungInventorScenes;

})(typeof window !== 'undefined' ? window : global);
