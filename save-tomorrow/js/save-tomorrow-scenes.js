/**
 * THE INVENTION THAT MUST SAVE TOMORROW — MODULAR SCENE RENDERERS
 * 15 Distinct Phases + Future Machine Energy Visual State Engine
 */

(function(root) {
  'use strict';

  class SaveTomorrowScenes {
    constructor(app) {
      this.app = app;
      this.data = root.SAVE_TOMORROW_DATA;
    }

    // =========================================================================
    // SVG FUTURE MACHINE ENGINE (Powers up over 10 stages)
    // =========================================================================
    renderFutureMachineSvg(stageNum = 1, isEmergency = false) {
      const activeStage = Math.max(1, Math.min(10, stageNum));
      const glowColor = isEmergency ? "#ef4444" : "#06b6d4";
      const conduitColors = [
        "#06b6d4", "#0ea5e9", "#38bdf8", "#60a5fa", "#818cf8",
        "#a78bfa", "#c084fc", "#e879f9", "#f43f5e", "#10b981"
      ];

      return `
        <div style="width:100%; max-width:680px; height:220px; margin:0 auto 16px auto;">
          <svg viewBox="0 0 500 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="fmBg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#090e1a"/>
                <stop offset="50%" stop-color="#1e293b"/>
                <stop offset="100%" stop-color="#050811"/>
              </linearGradient>
              <linearGradient id="coreGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="${glowColor}" stop-opacity="0.9"/>
                <stop offset="100%" stop-color="${glowColor}" stop-opacity="0.1"/>
              </linearGradient>
            </defs>

            <!-- Base Machine Housing -->
            <rect width="500" height="200" rx="16" fill="url(#fmBg)" stroke="${glowColor}" stroke-width="2.5"/>
            
            <!-- Floor grid lines -->
            <line x1="0" y1="160" x2="500" y2="160" stroke="#334155" stroke-width="1.5"/>
            <line x1="100" y1="160" x2="60" y2="200" stroke="#334155" stroke-width="1.5"/>
            <line x1="200" y1="160" x2="180" y2="200" stroke="#334155" stroke-width="1.5"/>
            <line x1="300" y1="160" x2="320" y2="200" stroke="#334155" stroke-width="1.5"/>
            <line x1="400" y1="160" x2="440" y2="200" stroke="#334155" stroke-width="1.5"/>

            <!-- Central Energy Core Spheres -->
            <circle cx="250" cy="85" r="44" fill="none" stroke="${glowColor}" stroke-width="3" stroke-dasharray="8,5"/>
            <circle cx="250" cy="85" r="32" fill="url(#coreGlow)"/>
            <text x="250" y="96" font-size="34" text-anchor="middle">${isEmergency ? '🚨' : activeStage >= 10 ? '⚡' : '🌍'}</text>

            <!-- 10 Energy Conduits / Tubes -->
            ${Array.from({ length: 10 }).map((_, i) => {
              const xPos = 40 + i * 44;
              const isLit = (i + 1) <= activeStage;
              const color = isLit ? conduitColors[i] : "#334155";
              return `
                <rect x="${xPos}" y="145" width="28" height="10" rx="3" fill="${color}" opacity="${isLit ? '0.95' : '0.4'}"/>
                <line x1="${xPos + 14}" y1="145" x2="250" y2="125" stroke="${color}" stroke-width="${isLit ? '2.5' : '1'}" opacity="${isLit ? '0.85' : '0.2'}"/>
              `;
            }).join('')}

            <!-- Status Display Badge -->
            <rect x="150" y="12" width="200" height="24" rx="12" fill="#0f172a" stroke="${glowColor}" stroke-width="1.5"/>
            <text x="250" y="28" font-family="sans-serif" font-weight="900" font-size="11" fill="${glowColor}" text-anchor="middle" letter-spacing="1">
              ${isEmergency ? 'STATUS: EMERGENCY OFFLINE' : `FUTURE MACHINE: ${activeStage * 10}% POWER`}
            </text>
          </svg>
        </div>
      `;
    }

    // =========================================================================
    // PHASE 1: THE EMERGENCY (0–5 MIN)
    // =========================================================================
    renderPhase1(container) {
      const p = this.data.phase1;
      container.innerHTML = `
        <div class="stm-scene-container">
          ${this.renderFutureMachineSvg(1, true)}

          <div class="character-speech-box" style="border-color:#ef4444; box-shadow:0 0 20px rgba(239,68,68,0.4);">
            <div class="char-avatar">🤖</div>
            <div class="char-text">
              <strong>EDI (Robot Assistant):</strong> "Oh no! Beep-boop! <strong>${p.alertText}</strong> The Future Machine has stopped!"
            </div>
          </div>

          <div class="character-speech-box">
            <div class="char-avatar">🧑‍🔬</div>
            <div class="char-text">
              <strong>Nova:</strong> "${p.storyText} Can you help us save the future? First, let's test: <strong>${p.question}</strong>"
            </div>
          </div>

          <div class="stm-cards-grid" style="max-width:850px;">
            ${p.options.map(opt => `
              <div class="stm-select-card" onclick="window.saveTomorrowApp.selectPhase1Answer('${opt.id}')">
                <span style="font-size:1.15rem;">${opt.text}</span>
              </div>
            `).join('')}
          </div>

          <button type="button" class="stm-btn-giant primary" onclick="window.saveTomorrowApp.goToPhase(2)">
            <span>START MISSION: WHAT IS A PROBLEM? ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // PHASE 2: WHAT IS A PROBLEM? (5–10 MIN)
    // =========================================================================
    renderPhase2(container) {
      const p = this.data.phase2;
      container.innerHTML = `
        <div class="stm-scene-container">
          <div class="character-speech-box">
            <div class="char-avatar">🧑‍🔬</div>
            <div class="char-text">
              <strong>Nova:</strong> "Before we invent anything, we must understand: <strong>What is a PROBLEM?</strong> A problem is <strong>something difficult that needs fixing!</strong>"
            </div>
          </div>

          <!-- TPR Movement Reminder Banner -->
          <div style="background:rgba(245,158,11,0.15); border:2px solid #f59e0b; border-radius:var(--stm-radius-md); padding:12px 20px; width:100%; max-width:900px; display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <span style="font-size:2rem;">🧠</span>
              <span style="font-size:1.05rem; font-weight:800; color:#fef08a;">TPR ACTION: When you hear <em>PROBLEM</em>, touch your head! When you hear <em>SOLUTION</em>, give thumbs up! 👍</span>
            </div>
            <button type="button" class="hud-btn" onclick="window.saveTomorrowApp.audio.speak('Problem: touch your head! Solution: thumbs up!')">🔊 Audio</button>
          </div>

          <!-- 6 Everyday Situations Grid -->
          <h3 style="color:#38bdf8; font-size:1.2rem; font-weight:900; margin-bottom:12px; align-self:flex-start;">
            🔍 TAP EVERYDAY SITUATIONS:
          </h3>
          <div class="stm-cards-grid">
            ${p.everydaySituations.map(sit => `
              <div class="stm-select-card" onclick="window.saveTomorrowApp.audio.speak('${sit.name}. ${sit.text}')">
                <span style="font-size:2.4rem;">${sit.icon}</span>
                <div>
                  <div style="color:#ffffff; font-size:1.1rem; font-weight:900;">${sit.name}</div>
                  <div style="color:var(--stm-text-muted); font-size:0.85rem;">${sit.text}</div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Mini Scenarios YES/NO -->
          <div style="background:rgba(15,23,42,0.9); border:2px solid var(--stm-cyan); border-radius:var(--stm-radius-lg); padding:20px; width:100%; max-width:900px; margin-bottom:22px;">
            <h4 style="font-size:1.1rem; font-weight:900; color:#fef08a; margin-bottom:8px;">💡 MINI PROBLEM CHECK:</h4>
            <p style="font-size:1.1rem; color:#ffffff; margin-bottom:14px;">"My pencils always fall on the floor and break. Is this a problem?"</p>
            <div style="display:flex; gap:14px;">
              <button type="button" class="hud-btn primary" style="flex:1; justify-content:center; font-size:1.1rem; padding:12px;" onclick="window.saveTomorrowApp.checkProblemYesNo(true)">
                👍 YES! It is a problem
              </button>
              <button type="button" class="hud-btn" style="flex:1; justify-content:center; font-size:1.1rem; padding:12px;" onclick="window.saveTomorrowApp.checkProblemYesNo(false)">
                👎 NO! It is not
              </button>
            </div>
          </div>

          <button type="button" class="stm-btn-giant primary" onclick="window.saveTomorrowApp.goToPhase(3)">
            <span>PHASE 3: GET AN IDEA ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // PHASE 3: GET AN IDEA (10–15 MIN)
    // =========================================================================
    renderPhase3(container) {
      const p = this.data.phase3;
      container.innerHTML = `
        <div class="stm-scene-container">
          <div class="character-speech-box">
            <div class="char-avatar">🤖</div>
            <div class="char-text">
              <strong>EDI:</strong> "Beep! <strong>Thomas Edison's Golden Rule:</strong> When you have an idea, write it down! Let's open our Digital Notebook."
            </div>
          </div>

          <!-- Chain Flow Diagram -->
          <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-bottom:20px; width:100%; max-width:900px;">
            ${p.edisonConcept.chain.map(step => `
              <div style="background:rgba(30,41,59,0.9); border:1.5px solid var(--stm-cyan); border-radius:12px; padding:10px 16px; font-weight:900; color:#38bdf8; font-size:0.95rem;">
                ${step}
              </div>
            `).join('')}
          </div>

          <!-- Notebook Challenge Card -->
          <div style="background:#1e293b; border:3px solid #f59e0b; border-radius:var(--stm-radius-lg); padding:24px; width:100%; max-width:900px; margin-bottom:22px; box-shadow:0 0 20px var(--stm-amber-glow);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <h3 style="color:#fef08a; font-size:1.25rem; font-weight:900; margin:0;">
                📓 THE INVENTOR'S NOTEBOOK
              </h3>
              <button type="button" class="hud-btn amber" onclick="window.saveTomorrowApp.startThinkTimer(10)">
                ⏱️ Think Time (10s)
              </button>
            </div>

            <p style="font-size:1.1rem; color:#cbd5e1; margin-bottom:16px;">
              Problem: <strong>"I always lose my pencils at my desk."</strong> Which ideas should we put in the notebook?
            </p>

            <div class="stm-cards-grid">
              ${p.notebookChallenge[0].ideas.map(idea => `
                <div class="stm-select-card" onclick="window.saveTomorrowApp.selectNotebookIdea('${idea.id}', ${idea.correct})">
                  <span style="font-size:2rem;">${idea.icon}</span>
                  <span>${idea.text}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <button type="button" class="stm-btn-giant primary" onclick="window.saveTomorrowApp.goToPhase(4)">
            <span>PHASE 4: IDEAS FROM NATURE ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // PHASE 4: IDEAS FROM NATURE (BIOMIMICRY) (15–21 MIN)
    // =========================================================================
    renderPhase4(container) {
      const p = this.data.phase4;
      container.innerHTML = `
        <div class="stm-scene-container">
          <div class="character-speech-box" style="border-color:#10b981; box-shadow:0 0 18px rgba(16,185,129,0.3);">
            <div class="char-avatar">🌱</div>
            <div class="char-text">
              <strong>Nova:</strong> "Welcome to the Eco-Forest! Inventors don't only look at screens. <strong>Nature is the world's oldest inventor!</strong>"
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:20px; width:100%; max-width:980px; margin-bottom:24px;">
            ${p.biomimicryCases.map(bCase => `
              <div style="background:var(--stm-bg-card); border:2px solid #10b981; border-radius:var(--stm-radius-lg); padding:20px; display:flex; flex-direction:column; justify-content:space-between; gap:14px;">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:1.2rem; font-weight:900; color:#a7f3d0;">${bCase.natureName}</span>
                    <span style="font-size:2.6rem;">${bCase.natureIcon}</span>
                  </div>
                  <p style="color:#cbd5e1; font-size:0.95rem; margin:8px 0;">${bCase.natureFeature}</p>
                </div>

                <div style="text-align:center; font-weight:900; color:#f59e0b; font-size:1rem;">
                  ⬇️ INSPIRES INVENTIONS ⬇️
                </div>

                <div style="background:rgba(30,41,59,0.9); border:1.5px solid #38bdf8; border-radius:12px; padding:14px;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:1.2rem; font-weight:900; color:#67e8f9;">${bCase.inventionName}</span>
                    <span style="font-size:2.6rem;">${bCase.inventionIcon}</span>
                  </div>
                  <p style="color:#e2e8f0; font-size:0.92rem; margin:8px 0;">${bCase.inventionFeature}</p>
                  <button type="button" class="hud-btn" style="padding:6px 12px; font-size:0.85rem;" onclick="window.saveTomorrowApp.audio.speak('${bCase.keySentence}')">
                    🔊 Hear: "${bCase.keySentence}"
                  </button>
                </div>
              </div>
            `).join('')}
          </div>

          <button type="button" class="stm-btn-giant primary" onclick="window.saveTomorrowApp.goToPhase(5)">
            <span>PHASE 5: NATURE CHALLENGE ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // PHASE 5: NATURE INVENTOR CHALLENGE (21–26 MIN)
    // =========================================================================
    renderPhase5(container) {
      const p = this.data.phase5;
      container.innerHTML = `
        <div class="stm-scene-container">
          <div class="character-speech-box">
            <div class="char-avatar">🧑‍🔬</div>
            <div class="char-text">
              <strong>Nova:</strong> "Now you become Nature Inventors! Look at each creature's special ability. What human machine can it inspire?"
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:16px; width:100%; max-width:900px; margin-bottom:24px;">
            ${p.creatures.map((c, idx) => `
              <div style="background:var(--stm-bg-card); border:2px solid rgba(255,255,255,0.15); border-radius:var(--stm-radius-md); padding:18px; display:flex; flex-direction:column; gap:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:1.25rem; font-weight:900; color:#fef08a;">${c.animal}</span>
                  <span style="font-size:1.05rem; color:#38bdf8; font-weight:800;">Ability: ${c.ability}</span>
                </div>
                <div style="font-size:1rem; color:#ffffff;"><strong>${c.question}</strong></div>
                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                  ${c.options.map(opt => `
                    <button type="button" class="hud-btn ${opt === c.correct ? 'primary' : ''}" onclick="window.saveTomorrowApp.checkCreatureMatch(${idx}, '${opt}')">
                      ${opt}
                    </button>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>

          <button type="button" class="stm-btn-giant primary" onclick="window.saveTomorrowApp.goToPhase(6)">
            <span>PHASE 6: OLD + OLD = NEW ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // PHASE 6: OLD + OLD = NEW (26–31 MIN)
    // =========================================================================
    renderPhase6(container) {
      const p = this.data.phase6;
      const selected = this.app.state.mixerSelected || [];

      container.innerHTML = `
        <div class="stm-scene-container">
          <div class="character-speech-box" style="border-color:#f59e0b;">
            <div class="char-avatar">🧪</div>
            <div class="char-text">
              <strong>Nova:</strong> "You don't need expensive new materials! <strong>Use old things to make something new!</strong> Select 3 recyclable items and press <strong>MIX!</strong>"
            </div>
          </div>

          <!-- 3 Mixer Slots -->
          <div style="display:flex; justify-content:center; gap:16px; margin-bottom:20px; width:100%; max-width:800px;">
            ${[0, 1, 2].map(slotIdx => {
              const item = selected[slotIdx];
              return `
                <div style="flex:1; min-height:100px; background:rgba(30,41,59,0.9); border:2.5px dashed ${item ? '#10b981' : 'rgba(255,255,255,0.3)'}; border-radius:14px; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:10px;">
                  <span style="font-size:2.6rem;">${item ? item.icon : '❓'}</span>
                  <span style="font-size:0.92rem; font-weight:800; color:#f8fafc; margin-top:4px;">${item ? item.name : `Slot ${slotIdx + 1}`}</span>
                </div>
              `;
            }).join('')}
          </div>

          <div style="margin-bottom:20px;">
            <button type="button" class="stm-btn-giant amber" onclick="window.saveTomorrowApp.mixObjects()">
              ⚡ MIX TO CREATE AN INVENTION!
            </button>
          </div>

          <!-- Items Palette -->
          <h4 style="color:#38bdf8; font-size:1.1rem; font-weight:900; margin-bottom:10px;">📦 CHOOSE 3 OBJECTS:</h4>
          <div class="stm-cards-grid" style="max-width:850px; margin-bottom:22px;">
            ${p.mixerItems.map(item => `
              <div class="stm-select-card" onclick="window.saveTomorrowApp.toggleMixerItem('${item.id}')">
                <span style="font-size:2.2rem;">${item.icon}</span>
                <span>${item.name}</span>
              </div>
            `).join('')}
          </div>

          <button type="button" class="stm-btn-giant primary" onclick="window.saveTomorrowApp.goToPhase(7)">
            <span>PHASE 7: LEONARDO'S ROOM ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // PHASE 7: LEONARDO'S INVENTION ROOM (31–35 MIN)
    // =========================================================================
    renderPhase7(container) {
      const p = this.data.phase7;
      container.innerHTML = `
        <div class="stm-scene-container">
          <div class="character-speech-box" style="border-color:#d97706; background:rgba(30,20,10,0.9);">
            <div class="char-avatar">📜</div>
            <div class="char-text">
              <strong>Nova:</strong> "Welcome to Italy, 500 years ago! Leonardo da Vinci filled notebooks with amazing sketches. <strong>${p.renaissanceSetting.intro}</strong>"
            </div>
          </div>

          <div style="background:#1e1b18; border:3px solid #b45309; border-radius:var(--stm-radius-lg); padding:24px; width:100%; max-width:900px; margin-bottom:24px;">
            <h3 style="color:#fef08a; font-size:1.3rem; font-weight:900; margin-bottom:14px; text-align:center;">
              ✨ GOLDEN RULE: "DRAWING HELPS YOU SEE YOUR IDEA."
            </h3>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px; margin-bottom:18px;">
              ${p.renaissanceSetting.sketches.map(sk => `
                <div style="background:rgba(0,0,0,0.5); border:1.5px solid #d97706; border-radius:12px; padding:16px;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="font-size:1.15rem; font-weight:900; color:#fed7aa;">${sk.name}</span>
                    <span style="font-size:2.8rem;">${sk.icon}</span>
                  </div>
                  <p style="color:#e2e8f0; font-size:0.92rem; line-height:1.4;">${sk.text}</p>
                </div>
              `).join('')}
            </div>

            <div style="background:rgba(245,158,11,0.15); border-radius:10px; padding:14px; text-align:center;">
              <span style="font-size:1.1rem; font-weight:900; color:#fde68a;">
                Question: What did Leonardo do with his ideas?
              </span>
              <div style="display:flex; justify-content:center; gap:12px; margin-top:10px;">
                <button type="button" class="hud-btn primary" onclick="window.saveTomorrowApp.audio.playCorrect(); window.saveTomorrowApp.showToast('Correct! He drew his ideas!');">
                  ✏️ He drew them!
                </button>
                <button type="button" class="hud-btn" onclick="window.saveTomorrowApp.audio.playTryAgain(); window.saveTomorrowApp.showToast('No, he never forgot them!');">
                  😴 He forgot them
                </button>
              </div>
            </div>
          </div>

          <button type="button" class="stm-btn-giant primary" onclick="window.saveTomorrowApp.goToPhase(8)">
            <span>PHASE 8: DRAW BLUEPRINT ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // PHASE 8: DRAW YOUR BLUEPRINT (35–40 MIN)
    // =========================================================================
    renderPhase8(container) {
      const p = this.data.phase8;
      const invName = this.app.state.inventionName || "Aero-Roller 2045";

      container.innerHTML = `
        <div class="stm-scene-container">
          <div class="character-speech-box">
            <div class="char-avatar">📐</div>
            <div class="char-text">
              <strong>Nova:</strong> "Now it is your turn to draw like Leonardo! Pick your problem, choose components, and draw your blueprint!"
            </div>
          </div>

          <!-- Problem Chooser & Name Input -->
          <div style="background:var(--stm-bg-card); border:2px solid rgba(255,255,255,0.15); border-radius:var(--stm-radius-lg); padding:20px; width:100%; max-width:850px; margin-bottom:20px;">
            <div style="font-size:0.95rem; font-weight:800; color:#38bdf8; margin-bottom:10px;">1. SELECT PROBLEM:</div>
            <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:14px;">
              ${p.problemChoices.map(pr => `
                <button type="button" class="hud-btn" onclick="window.saveTomorrowApp.setProblemPreset('${pr.id}', '${pr.defaultName}')">
                  <span>${pr.icon}</span> <span>${pr.name}</span>
                </button>
              `).join('')}
            </div>

            <div style="font-size:0.95rem; font-weight:800; color:#f59e0b; margin-bottom:8px;">2. NAME YOUR INVENTION:</div>
            <input type="text" id="stm-input-name" value="${invName}"
                   style="background:#0f172a; border:2px solid var(--stm-cyan); border-radius:8px; color:#fff; font-size:1.15rem; font-weight:900; padding:10px 16px; width:100%; max-width:450px;"
                   oninput="window.saveTomorrowApp.setInventionName(this.value)" />
          </div>

          <!-- Smart Board Touch Drawing Board -->
          <div class="stm-canvas-box">
            <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
              <span style="font-weight:900; color:var(--stm-cyan);">✏️ TOUCH BLUEPRINT BOARD</span>
              <button type="button" class="hud-btn amber" onclick="window.saveTomorrowApp.startThinkTimer(60)">⏱️ Draw Time (60s)</button>
            </div>

            <canvas id="stm-blueprint-canvas" width="620" height="300"></canvas>

            <div class="canvas-toolbar">
              ${p.paletteColors.map((col, idx) => `
                <div class="color-dot ${idx === 0 ? 'active' : ''}" style="background:${col};" onclick="window.saveTomorrowApp.setCanvasColor('${col}', this)"></div>
              `).join('')}
              <button type="button" class="hud-btn" onclick="window.saveTomorrowApp.clearCanvas()">🗑️ Clear</button>
              <button type="button" class="hud-btn" onclick="window.saveTomorrowApp.undoCanvas()">↩️ Undo</button>
            </div>
          </div>

          <button type="button" class="stm-btn-giant primary" onclick="window.saveTomorrowApp.goToPhase(9)">
            <span>PHASE 9: TEST LAB ➔</span>
          </button>
        </div>
      `;

      setTimeout(() => this.app.initCanvas(), 50);
    }

    // =========================================================================
    // PHASE 9: TEST LAB (40–45 MIN)
    // =========================================================================
    renderPhase9(container) {
      const p = this.data.phase9;
      const isTesting = this.app.state.isStressTesting;
      const failed = this.app.state.testFailed;

      container.innerHTML = `
        <div class="stm-scene-container">
          <div class="character-speech-box">
            <div class="char-avatar">🧪</div>
            <div class="char-text">
              <strong>Nova:</strong> "An invention on paper is only a dream. Real inventors must <strong>TEST</strong> their ideas in the lab!"
            </div>
          </div>

          <div class="chamber-box ${isTesting ? 'testing' : ''}">
            <div style="font-size:1.15rem; font-weight:900; color:${failed ? '#ef4444' : '#38bdf8'}; margin-bottom:10px;">
              ${failed ? '🚨 STATUS: PROBLEM FOUND IN WIND TUNNEL!' : 'CHAMBER READY: 100 KM/H WIND & 15 KG WEIGHT TEST'}
            </div>

            <div style="font-size:5rem; margin:16px 0;">${isTesting ? '💨🌪️⚙️' : failed ? '💥⚠️' : '📦🔬'}</div>

            <p style="font-size:1.15rem; color:#e2e8f0; margin-bottom:18px;">
              ${failed ? p.testChamber.simulatedProblem : 'Will our prototype stay strong under high wind? Press START TEST to find out!'}
            </p>

            ${!isTesting && !failed ? `
              <button type="button" class="stm-btn-giant amber" onclick="window.saveTomorrowApp.runChamberTest()">
                ⚡ START WIND TUNNEL TEST
              </button>
            ` : ''}

            ${failed ? `
              <div style="background:rgba(239,68,68,0.2); border:2px solid #ef4444; border-radius:12px; padding:16px; margin-top:14px;">
                <h4 style="color:#fca5a5; font-size:1.2rem; font-weight:900; margin-bottom:6px;">NOVA'S ADVICE:</h4>
                <p style="color:#ffffff; font-size:1.05rem;">"${p.testChamber.novaAdvice}"</p>
              </div>
            ` : ''}
          </div>

          <button type="button" class="stm-btn-giant primary" onclick="window.saveTomorrowApp.goToPhase(10)">
            <span>PHASE 10: IMPROVE YOUR IDEA ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // PHASE 10: IMPROVE YOUR IDEA (45–50 MIN)
    // =========================================================================
    renderPhase10(container) {
      const p = this.data.phase10;
      container.innerHTML = `
        <div class="stm-scene-container">
          <div class="character-speech-box">
            <div class="char-avatar">🚗</div>
            <div class="char-text">
              <strong>Nova:</strong> "In 1885, <strong>Karl Benz</strong> built the first motorcar. It was not perfect at the beginning! It broke down often. But he improved it every year!"
            </div>
          </div>

          <h3 style="color:#fef08a; font-size:1.3rem; font-weight:900; margin-bottom:14px;">
            🔧 HOW WILL YOU IMPROVE YOUR INVENTION?
          </h3>

          <div class="stm-cards-grid" style="max-width:900px; margin-bottom:24px;">
            ${p.improvementOptions.map(imp => `
              <div class="stm-select-card" onclick="window.saveTomorrowApp.selectImprovement('${imp.id}', '${imp.text}')">
                <div>
                  <div style="font-size:1.15rem; font-weight:900; color:#38bdf8; margin-bottom:4px;">${imp.text}</div>
                  <div style="font-size:0.9rem; color:#cbd5e1;">${imp.benefit}</div>
                </div>
              </div>
            `).join('')}
          </div>

          <button type="button" class="stm-btn-giant primary" onclick="window.saveTomorrowApp.goToPhase(11)">
            <span>PHASE 11: TRY AGAIN! ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // PHASE 11: TRY AGAIN! (50–54 MIN)
    // =========================================================================
    renderPhase11(container) {
      const p = this.data.phase11;
      const retryCount = this.app.state.retryCount || 0;
      const isComplete = retryCount >= 3;

      container.innerHTML = `
        <div class="stm-scene-container">
          <div class="character-speech-box" style="border-color:${isComplete ? '#10b981' : '#f59e0b'};">
            <div class="char-avatar">🤖</div>
            <div class="char-text">
              <strong>EDI:</strong> ${isComplete ? '"✨ SUCCESS! All joints calibrated and balanced! You did not give up!"' : '"Oh no! It wobbled! Click TRY AGAIN to fix the joints!"'}
            </div>
          </div>

          <div style="text-align:center; margin:24px 0;">
            <div style="font-size:6rem; margin-bottom:12px;">${isComplete ? '🌟🏆✨' : '🛠️'}</div>
            ${!isComplete ? `
              <button type="button" class="stm-btn-giant amber" style="font-size:1.6rem; padding:20px 48px;" onclick="window.saveTomorrowApp.clickTryAgain()">
                💪 TRY AGAIN! (Click ${retryCount + 1}/3)
              </button>
            ` : `
              <div style="background:rgba(16,185,129,0.2); border:2.5px solid #10b981; border-radius:var(--stm-radius-md); padding:16px 28px; display:inline-block; font-size:1.3rem; font-weight:900; color:#a7f3d0;">
                ✓ UPGRADES INSTALLED SUCCESSFULLY!
              </div>
            `}
          </div>

          <!-- Pronunciation Repeat Section -->
          <div style="background:rgba(15,23,42,0.9); border:2px solid var(--stm-cyan); border-radius:14px; padding:18px; width:100%; max-width:800px; text-align:center; margin-bottom:24px;">
            <h4 style="color:#38bdf8; font-size:1.1rem; font-weight:900; margin-bottom:8px;">🗣️ SAY IT WITH THE CLASS:</h4>
            <div style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap;">
              ${p.speechPractice.map(sp => `
                <button type="button" class="hud-btn" onclick="window.saveTomorrowApp.audio.speak('${sp.phrase}')">
                  <span>${sp.icon}</span> <span>"${sp.phrase}"</span>
                </button>
              `).join('')}
            </div>
          </div>

          <button type="button" class="stm-btn-giant primary" onclick="window.saveTomorrowApp.goToPhase(12)">
            <span>PHASE 12: SAVE THE FUTURE MISSION ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // PHASE 12: FINAL INVENTOR MISSION (54–59 MIN)
    // =========================================================================
    renderPhase12(container) {
      const p = this.data.phase12;
      const invName = this.app.state.inventionName || "Aero-Roller 2045";

      container.innerHTML = `
        <div class="stm-scene-container">
          <div class="character-speech-box">
            <div class="char-avatar">🚀</div>
            <div class="char-text">
              <strong>Nova:</strong> "This is it! Complete our <strong>5 Magic Inventor Sentences</strong> to power up the final system!"
            </div>
          </div>

          <div style="background:var(--stm-bg-card); border:2.5px solid var(--stm-cyan); border-radius:var(--stm-radius-lg); padding:24px; width:100%; max-width:900px; margin-bottom:24px;">
            <h3 style="color:#fef08a; font-size:1.25rem; font-weight:900; margin-bottom:16px;">
              📝 5 MAGIC INVENTOR SENTENCES:
            </h3>

            <div style="display:flex; flex-direction:column; gap:14px; font-size:1.15rem; color:#fff; line-height:1.6;">
              <div>1. <strong>My problem is</strong> heavy school books.</div>
              <div>2. <strong>My idea is</strong> a rolling bag with solar wings.</div>
              <div>3. <strong>My invention is called</strong> <span style="color:#38bdf8;">${invName}</span>.</div>
              <div>4. <strong>It can</strong> carry books and roll on stairs.</div>
              <div>5. <strong>I can improve it by</strong> making it lighter and stronger.</div>
            </div>

            <div style="margin-top:18px;">
              <button type="button" class="hud-btn primary" onclick="window.saveTomorrowApp.readFinalSentences()">
                🔊 Read All 5 Sentences Aloud
              </button>
            </div>
          </div>

          <button type="button" class="stm-btn-giant primary" onclick="window.saveTomorrowApp.goToPhase(13)">
            <span>PHASE 13: PRESENTATION STAGE ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // PHASE 13: INVENTOR PRESENTATION (59–62 MIN)
    // =========================================================================
    renderPhase13(container) {
      const p = this.data.phase13;
      const timerSec = this.app.state.presentationSeconds || 30;

      container.innerHTML = `
        <div class="stm-scene-container">
          <div class="character-speech-box">
            <div class="char-avatar">🎤</div>
            <div class="char-text">
              <strong>Nova:</strong> "Welcome to the <strong>Future Inventor Presentation Stage!</strong> Present your invention in 30 seconds!"
            </div>
          </div>

          <div style="text-align:center; margin-bottom:20px;">
            <div class="stm-timer-hero" id="stm-presentation-timer">
              ⏱️ 0:${timerSec < 10 ? '0' : ''}${timerSec}
            </div>
            <div style="display:flex; justify-content:center; gap:12px;">
              <button type="button" class="hud-btn" onclick="window.saveTomorrowApp.togglePresentationTimer()">
                ▶️ Start / Pause 30s Timer
              </button>
              <button type="button" class="hud-btn primary" onclick="window.saveTomorrowApp.audio.playApplause()">
                👏 Audience Cheer!
              </button>
            </div>
          </div>

          <button type="button" class="stm-btn-giant amber" onclick="window.saveTomorrowApp.goToPhase(14)">
            <span>SAVE THE FUTURE MACHINE! 🏆</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // PHASE 14: FINAL CELEBRATION (62–64 MIN)
    // =========================================================================
    renderPhase14(container) {
      const p = this.data.phase14;
      container.innerHTML = `
        <div class="stm-scene-container">
          ${this.renderFutureMachineSvg(10, false)}

          <div style="background:radial-gradient(circle at center, #1e293b, #090e1a); border:3.5px solid #f59e0b; border-radius:var(--stm-radius-lg); padding:36px; width:100%; max-width:850px; text-align:center; box-shadow:0 0 35px var(--stm-amber-glow); margin-bottom:24px;">
            <div style="font-size:6rem; margin-bottom:12px; filter:drop-shadow(0 0 25px #f59e0b);">🏆</div>
            <h1 style="font-family:var(--stm-font-display); font-size:2.6rem; font-weight:900; color:#fef08a; margin-bottom:8px;">
              ${p.badgeTitle}
            </h1>
            <p style="font-size:1.35rem; font-weight:800; color:#ffffff; margin-bottom:18px;">
              "You found problems, designed solutions, and restarted The Future Machine!"
            </p>

            <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(245,158,11,0.2); border:2px solid #f59e0b; border-radius:30px; padding:8px 24px; font-size:1.3rem; font-weight:900; color:#fef08a; margin-bottom:22px;">
              ⭐ +${p.awardXP} XP UNLOCKED!
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-bottom:20px;">
              ${p.skillsSummary.map(sk => `
                <div style="background:rgba(15,23,42,0.9); border:1px solid #38bdf8; border-radius:8px; padding:10px; font-weight:800; font-size:0.95rem; color:#fff;">
                  ${sk}
                </div>
              `).join('')}
            </div>

            <div style="display:flex; justify-content:center; gap:12px;">
              <a href="worksheet.html" target="_blank" class="hud-btn primary" style="text-decoration:none; padding:12px 24px; font-size:1.05rem;">
                🖨️ Print Official Certificate &amp; Dossier
              </a>
            </div>
          </div>

          <button type="button" class="stm-btn-giant primary" onclick="window.saveTomorrowApp.goToPhase(15)">
            <span>PHASE 15: EXIT TICKET ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // PHASE 15: EXIT TICKET (64–65 MIN)
    // =========================================================================
    renderPhase15(container) {
      const p = this.data.phase15;
      container.innerHTML = `
        <div class="stm-scene-container">
          <div class="character-speech-box">
            <div class="char-avatar">📓</div>
            <div class="char-text">
              <strong>Nova:</strong> "Last step: Quick 3-question Digital Exit Ticket before leaving the lab today!"
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:16px; width:100%; max-width:850px; margin-bottom:24px;">
            ${p.questions.map((q, idx) => `
              <div style="background:var(--stm-bg-card); border:2px solid rgba(255,255,255,0.15); border-radius:12px; padding:18px;">
                <div style="font-weight:900; font-size:1.1rem; color:#fef08a; margin-bottom:10px;">${q.q}</div>
                <div style="display:flex; gap:12px; flex-wrap:wrap;">
                  ${q.options.map(opt => `
                    <button type="button" class="hud-btn ${opt.correct ? 'primary' : ''}" onclick="window.saveTomorrowApp.audio.playCorrect(); window.saveTomorrowApp.showToast('Excellent answer! ⭐');">
                      ${opt.text}
                    </button>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>

          <div style="background:rgba(6,182,212,0.15); border:2px solid var(--stm-cyan); border-radius:14px; padding:18px; text-align:center; max-width:850px; margin-bottom:24px;">
            <div style="font-size:1.25rem; font-weight:900; color:#67e8f9;">
              ${p.finalTakeaway}
            </div>
          </div>

          <button type="button" class="stm-btn-giant primary" onclick="window.saveTomorrowApp.restartAdventure()">
            <span>🔄 RESTART ADVENTURE</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // TEACHER DRAWER / GUIDANCE OVERLAY
    // =========================================================================
    renderTeacherDrawer(container, phaseNum = 1) {
      const phaseKey = 'phase' + phaseNum;
      const phaseData = this.data[phaseKey];
      const p = phaseData ? phaseData.teacherPrompt : null;

      container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #6366f1; padding-bottom:12px; margin-bottom:16px;">
          <h3 style="font-size:1.25rem; font-weight:900; color:#a5b4fc; margin:0;">
            🧑‍🏫 TEACHER GUIDANCE (PHASE ${phaseNum})
          </h3>
          <button type="button" class="hud-btn" onclick="window.saveTomorrowApp.closeTeacherDrawer()">✕</button>
        </div>

        ${p ? `
          <div class="teacher-guide-card">
            <h4>🗣️ WHAT TO SAY</h4>
            <p>"${p.whatToSay}"</p>
          </div>

          <div class="teacher-guide-card">
            <h4>✅ EXPECTED STUDENT ANSWER</h4>
            <p>"${p.expectedAnswer}"</p>
          </div>

          <div class="teacher-guide-card">
            <h4>🟢 SIMPLER ALTERNATIVE ANSWER</h4>
            <p>"${p.simplerAnswer}"</p>
          </div>

          <div class="teacher-guide-card">
            <h4>👥 PAIR DISCUSSION PROMPT</h4>
            <p>"${p.pairDiscussion}"</p>
          </div>

          <div class="teacher-guide-card">
            <h4>📢 WHOLE CLASS SYNTHESIS</h4>
            <p>"${p.wholeClass}"</p>
          </div>
        ` : `
          <div class="teacher-guide-card">
            <p>Guide students through this milestone encouraging confidence and creativity.</p>
          </div>
        `}
      `;
    }
  }

  root.SaveTomorrowScenes = SaveTomorrowScenes;
})(typeof window !== 'undefined' ? window : global);
