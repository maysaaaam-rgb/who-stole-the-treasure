/**
 * INVENTOR'S FORGE — REACTIVE GAME APPLICATION CONTROLLER
 * Reactive State Machine (playerSession), Stage Router, Sound & DOM Renderers
 * Pure Vanilla ES6+ | Zero External Dependencies
 */
(function(root) {
  'use strict';

  class InventorForgeApp {
    constructor() {
      this.data = root.INVENTOR_FORGE_DATA;

      // Centralized Reactive State Object
      this.session = {
        playerName: "Apprentice Inventor",
        actionPoints: 3,
        scoreXP: 0,
        insightBuffs: 0,
        currentStage: 1, // 1: Archive Unlock, 2: The Core Loop Workshop, 3: Pitch Arena
        completedQuests: {
          archiveUnlocked: false,
          prototypeBuilt: false,
          pitchDelivered: false
        },
        selectedCombo: {
          obstacle: null,
          relic1: null,
          relic2: null,
          inventionName: "",
          inventionTagline: "",
          inventionFormula: ""
        },
        unlockedInventors: new Set()
      };

      // Pitch Timer State
      this.pitchTimer = null;
      this.pitchTimeRemaining = 60;
      this.isTimerRunning = false;
    }

    init() {
      this.render();

      // First click sound unlock
      const unlockAudio = () => {
        if (root.inventorAudio) root.inventorAudio.init();
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
      };
      window.addEventListener('click', unlockAudio);
      window.addEventListener('keydown', unlockAudio);
      window.addEventListener('touchstart', unlockAudio);
    }

    switchStage(stageNum) {
      if (stageNum === 2 && !this.session.completedQuests.archiveUnlocked) {
        this.showToast("🔒 Complete the Archive Vault first to unlock the Workshop Forge!", "warning");
        if (root.inventorAudio) root.inventorAudio.playTimerTick();
        return;
      }
      if (stageNum === 3 && !this.session.completedQuests.prototypeBuilt) {
        this.showToast("🔒 Forge your Prototype first before entering the Pitch Arena!", "warning");
        if (root.inventorAudio) root.inventorAudio.playTimerTick();
        return;
      }

      this.session.currentStage = stageNum;
      if (root.inventorAudio) root.inventorAudio.playCardSnap();
      this.render();
    }

    // =========================================================================
    // STAGE 1: ARCHIVE VAULT ACTIONS
    // =========================================================================
    inspectInventor(inventorId) {
      const inv = this.data.historicalInventors.find(i => i.id === inventorId);
      if (!inv) return;

      const modal = document.getElementById('forge-modal');
      const content = document.getElementById('modal-content-area');
      if (!modal || !content) return;

      const isAlreadyUnlocked = this.session.unlockedInventors.has(inv.id);

      content.innerHTML = `
        <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 16px;">
          <div style="font-size: 2.8rem; background: rgba(30,41,59,0.8); border: 2px solid var(--brass-amber); border-radius: 50%; width: 68px; height: 68px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px var(--brass-glow);">
            ${inv.icon}
          </div>
          <div>
            <h3 style="font-size: 1.4rem; font-weight: 900; color: #fff;">${inv.name}</h3>
            <span style="font-size: 0.85rem; font-weight: 800; color: var(--blueprint-cyan);">${inv.invention} (${inv.year})</span>
          </div>
        </div>

        <div style="background: rgba(15,23,42,0.85); border: 1px solid var(--glass-border); border-radius: 12px; padding: 14px; margin-bottom: 16px; font-size: 0.9rem; line-height: 1.45;">
          <p style="margin-bottom: 8px;"><strong>🔍 Problem Solved:</strong> ${inv.problemSolved}</p>
          <p style="margin-bottom: 8px; color: #fca5a5;"><strong>⚠️ The Obstacle / Failure:</strong> ${inv.obstacleFaced}</p>
          <p style="color: #86efac;"><strong>🌱 Try-Again Mindset:</strong> "${inv.tryAgainMindset}"</p>
        </div>

        ${!isAlreadyUnlocked ? `
          <div style="margin-bottom: 16px;">
            <p style="font-size: 0.95rem; font-weight: 800; color: #fef08a; margin-bottom: 10px;">
              🧩 Comprehension Check: ${inv.question}
            </p>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${inv.options.map((opt, idx) => `
                <button type="button" 
                  class="stage-tab-btn" 
                  style="border: 1px solid var(--glass-border); background: rgba(30,41,59,0.9); color: #fff; text-align: left; padding: 12px; font-size: 0.9rem;"
                  onclick="window.inventorApp.handleAnswerArchive('${inv.id}', ${idx})">
                  ${idx === 0 ? 'A' : idx === 1 ? 'B' : 'C'}. ${opt}
                </button>
              `).join('')}
            </div>
          </div>
        ` : `
          <div style="background: rgba(16,185,129,0.15); border: 1px solid var(--insight-emerald); padding: 12px; border-radius: 10px; color: #a7f3d0; font-weight: 800; text-align: center;">
            ✓ Archive Dossier Unlocked (+10 Insight XP Awarded)
          </div>
        `}
      `;

      modal.style.display = 'flex';
    }

    handleAnswerArchive(inventorId, selectedIndex) {
      const inv = this.data.historicalInventors.find(i => i.id === inventorId);
      if (!inv) return;

      if (selectedIndex === inv.correctIndex) {
        this.session.unlockedInventors.add(inv.id);
        this.session.insightBuffs++;
        this.session.scoreXP += this.data.meta.insightBuffXP;

        if (root.inventorAudio) root.inventorAudio.playTryAgainBuff();
        this.showToast(`✨ Correct! ${inv.insightBuff}`);

        // Check if all or 3+ unlocked
        if (this.session.unlockedInventors.size >= 3) {
          this.session.completedQuests.archiveUnlocked = true;
          this.session.scoreXP += this.data.meta.stageXP.stage1;
          this.showToast(`🎉 Archive Vault Cleared! +50 XP Awarded. Workshop Forge Unlocked!`);
        }

        this.closeModal();
        this.render();
      } else {
        if (root.inventorAudio) root.inventorAudio.playTimerTick();
        this.showToast("💡 Not quite! Re-read the Try-Again Mindset and try again!", "warning");
      }
    }

    // =========================================================================
    // STAGE 2: WORKSHOP SOCKETING & PROTOTYPE FORGING
    // =========================================================================
    selectObstacle(obsId) {
      const obs = this.data.everydayObstacles.find(o => o.id === obsId);
      if (!obs) return;

      this.session.selectedCombo.obstacle = obs;
      if (root.inventorAudio) root.inventorAudio.playCardSnap();
      this.render();
    }

    selectRelic(relicId) {
      const relic = this.data.modernRelics.find(r => r.id === relicId);
      if (!relic) return;

      // Check if already placed in relic1 or relic2
      if (this.session.selectedCombo.relic1?.id === relic.id) {
        this.session.selectedCombo.relic1 = null;
        if (root.inventorAudio) root.inventorAudio.playCardSnap();
        this.render();
        return;
      }
      if (this.session.selectedCombo.relic2?.id === relic.id) {
        this.session.selectedCombo.relic2 = null;
        if (root.inventorAudio) root.inventorAudio.playCardSnap();
        this.render();
        return;
      }

      // Slot into relic1 first, then relic2
      if (!this.session.selectedCombo.relic1) {
        this.session.selectedCombo.relic1 = relic;
      } else if (!this.session.selectedCombo.relic2) {
        this.session.selectedCombo.relic2 = relic;
      } else {
        // Replace relic2 if both filled
        this.session.selectedCombo.relic2 = relic;
      }

      if (root.inventorAudio) root.inventorAudio.playCardSnap();
      this.render();
    }

    clearSocket(type) {
      if (type === 'obstacle') this.session.selectedCombo.obstacle = null;
      if (type === 'relic1') this.session.selectedCombo.relic1 = null;
      if (type === 'relic2') this.session.selectedCombo.relic2 = null;
      if (root.inventorAudio) root.inventorAudio.playCardSnap();
      this.render();
    }

    forgePrototype() {
      const { obstacle, relic1, relic2 } = this.session.selectedCombo;
      if (!obstacle || !relic1 || !relic2) {
        this.showToast("⚠️ Fill all 3 sockets before striking the forge!", "warning");
        return;
      }

      // Check recipe registry or generate procedural title
      const comboKey1 = `${obstacle.id}+${relic1.id}+${relic2.id}`;
      const comboKey2 = `${obstacle.id}+${relic2.id}+${relic1.id}`;
      const recipe = this.data.recipes[comboKey1] || this.data.recipes[comboKey2];

      if (recipe) {
        this.session.selectedCombo.inventionName = recipe.name;
        this.session.selectedCombo.inventionTagline = recipe.tagline;
        this.session.selectedCombo.inventionFormula = recipe.formula;
      } else {
        // Dynamic procedural synthesis
        const generatedTitle = `The ${relic1.name.split(' ')[0]}-${relic2.name.split(' ')[0]} ${obstacle.title.split(' ')[1] || 'Device'}`;
        this.session.selectedCombo.inventionName = generatedTitle;
        this.session.selectedCombo.inventionTagline = `A custom innovation combining ${relic1.powerType} and ${relic2.powerType}!`;
        this.session.selectedCombo.inventionFormula = `${generatedTitle} fuses a ${relic1.name} and ${relic2.name} to ${relic1.actionVerb} and solve ${obstacle.title}.`;
      }

      this.session.completedQuests.prototypeBuilt = true;
      this.session.scoreXP += this.data.meta.stageXP.stage2;

      if (root.inventorAudio) root.inventorAudio.playInventionForge();
      this.showToast(`🔥 SUCCESS! "${this.session.selectedCombo.inventionName}" forged! (+75 XP)`);
      this.render();
    }

    // =========================================================================
    // STAGE 3: PITCH ARENA ACTIONS & 60-SECOND TIMER
    // =========================================================================
    startPitchTimer() {
      if (this.isTimerRunning) return;
      this.isTimerRunning = true;

      this.pitchTimer = setInterval(() => {
        if (this.pitchTimeRemaining > 0) {
          this.pitchTimeRemaining--;
          if (root.inventorAudio) root.inventorAudio.playTimerTick();
          this.updateTimerDisplay();
        } else {
          this.pausePitchTimer();
          if (root.inventorAudio) root.inventorAudio.playTimerTick();
          this.showToast("⏰ Time is up! Outstanding delivery!", "warning");
        }
      }, 1000);

      this.render();
    }

    pausePitchTimer() {
      clearInterval(this.pitchTimer);
      this.isTimerRunning = false;
      this.render();
    }

    resetPitchTimer() {
      clearInterval(this.pitchTimer);
      this.isTimerRunning = false;
      this.pitchTimeRemaining = 60;
      this.render();
    }

    updateTimerDisplay() {
      const el = document.getElementById('pitch-timer-seconds');
      if (el) {
        el.textContent = `${this.pitchTimeRemaining}s`;
        el.classList.toggle('urgent', this.pitchTimeRemaining <= 10);
      }
    }

    listenToPitchCard(cardId) {
      const card = this.data.pitchDeck.targetFrames.find(c => c.id === cardId);
      if (!card || !root.inventorAudio) return;

      const populatedText = this.interpolatePitchTemplate(card.template);
      root.inventorAudio.speakPrompt(populatedText);
      this.showToast(`🔊 Listening to Step ${card.stepNumber}...`);
    }

    interpolatePitchTemplate(template) {
      const combo = this.session.selectedCombo;
      const obsTitle = combo.obstacle ? combo.obstacle.title : "Everyday Clutter";
      const obsSum = combo.obstacle ? combo.obstacle.problemSummary : "people struggle with disorganization";
      const invName = combo.inventionName || "The Master Prototype";
      const r1Name = combo.relic1 ? combo.relic1.name : "Micro Solar Strip";
      const r2Name = combo.relic2 ? combo.relic2.name : "Flexible LED Ribbon";
      const formula = combo.inventionFormula || "solves real problems through engineering";

      return template
        .replace(/\[OBSTACLE_TITLE\]/g, obsTitle)
        .replace(/\[OBSTACLE_SUMMARY\]/g, obsSum)
        .replace(/\[INVENTION_NAME\]/g, invName)
        .replace(/\[RELIC_1_NAME\]/g, r1Name)
        .replace(/\[RELIC_2_NAME\]/g, r2Name)
        .replace(/\[ACTION_FORMULA\]/g, formula);
    }

    deliverPitch() {
      this.pausePitchTimer();
      this.session.completedQuests.pitchDelivered = true;
      this.session.scoreXP += this.data.meta.stageXP.stage3;

      if (root.inventorAudio) root.inventorAudio.playFanfare();

      const modal = document.getElementById('forge-modal');
      const content = document.getElementById('modal-content-area');
      if (!modal || !content) return;

      content.innerHTML = `
        <div style="text-align: center; padding: 10px;">
          <div style="font-size: 3.5rem; margin-bottom: 10px; animation: gearSpin 6s infinite linear;">👑</div>
          <h2 style="font-size: 1.8rem; font-weight: 900; color: #fef08a; margin-bottom: 6px;">
            GRAND GUILD ACCREDITED!
          </h2>
          <p style="font-size: 1rem; color: var(--blueprint-cyan); font-weight: 700; margin-bottom: 20px;">
            Certified Master Inventor: ${this.session.playerName}
          </p>

          <div style="background: rgba(15,23,42,0.9); border: 2px solid var(--brass-amber); border-radius: 16px; padding: 18px; margin-bottom: 20px; text-align: left;">
            <div style="font-size: 0.8rem; font-weight: 800; color: var(--brass-amber); text-transform: uppercase; margin-bottom: 4px;">Forged Prototype:</div>
            <div style="font-size: 1.25rem; font-weight: 900; color: #fff; margin-bottom: 8px;">${this.session.selectedCombo.inventionName}</div>
            <div style="font-size: 0.9rem; color: #cbd5e1; line-height: 1.45;">"${this.session.selectedCombo.inventionFormula}"</div>
            <div style="margin-top: 14px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--glass-border); padding-top: 10px;">
              <span style="font-weight: 800; color: var(--insight-emerald);">⚡ Total XP: ${this.session.scoreXP} XP</span>
              <span style="font-weight: 800; color: #fef08a;">✨ Insight Buffs: ${this.session.insightBuffs}</span>
            </div>
          </div>

          <div style="display: flex; gap: 12px; justify-content: center;">
            <a href="worksheet.html" target="_blank" class="hud-btn gold" style="min-height: 52px; padding: 0 24px; font-size: 1rem;">
              🖨️ Print Blueprint Diploma
            </a>
            <button class="hud-btn" onclick="window.inventorApp.closeModal(); window.inventorApp.render();" style="min-height: 52px; padding: 0 24px;">
              ✓ Complete Workshop
            </button>
          </div>
        </div>
      `;

      modal.style.display = 'flex';
      this.render();
    }

    closeModal() {
      const modal = document.getElementById('forge-modal');
      if (modal) modal.style.display = 'none';
    }

    showToast(msg, type = 'success') {
      const toast = document.getElementById('forge-toast');
      if (!toast) return;

      toast.textContent = msg;
      toast.className = 'forge-toast show' + (type === 'warning' ? ' warning' : '');

      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 3500);
    }

    // =========================================================================
    // MAIN RENDER DISPATCHER
    // =========================================================================
    render() {
      const container = document.getElementById('forge-viewport');
      if (!container) return;

      // Update Top HUD state values
      const xpVal = document.getElementById('hud-xp-val');
      if (xpVal) xpVal.textContent = `${this.session.scoreXP} XP`;

      const insightVal = document.getElementById('hud-insight-val');
      if (insightVal) insightVal.textContent = `${this.session.insightBuffs}`;

      // Update Stage Tabs
      document.querySelectorAll('.stage-tab-btn').forEach(btn => {
        const stageNum = parseInt(btn.getAttribute('data-stage'), 10);
        btn.classList.toggle('active', stageNum === this.session.currentStage);

        if (stageNum === 2) btn.disabled = !this.session.completedQuests.archiveUnlocked;
        if (stageNum === 3) btn.disabled = !this.session.completedQuests.prototypeBuilt;
      });

      // Render Active Stage View
      switch (this.session.currentStage) {
        case 1:
          container.innerHTML = this.renderStage1HTML();
          break;
        case 2:
          container.innerHTML = this.renderStage2HTML();
          break;
        case 3:
          container.innerHTML = this.renderStage3HTML();
          break;
        default:
          container.innerHTML = this.renderStage1HTML();
      }
    }

    /**
     * Render Stage 1: The Archive Vault
     */
    renderStage1HTML() {
      const unlockedCount = this.session.unlockedInventors.size;
      const isCleared = this.session.completedQuests.archiveUnlocked;

      return `
        <div class="stage-hero-banner">
          <div class="stage-hero-title">
            <h2><span>🏛️</span> Stage 1: The Archive Vault</h2>
            <p>Inspect historical failure logs, adopt the "Try-Again" mindset, and collect Insight XP!</p>
          </div>
          <div class="stage-badge-pill">
            ${unlockedCount} / 4 Archives Unlocked
          </div>
        </div>

        <div class="archive-grid">
          ${this.data.historicalInventors.map(inv => {
            const isUnlocked = this.session.unlockedInventors.has(inv.id);
            return `
              <div class="archive-card ${isUnlocked ? 'unlocked' : ''}">
                <div class="card-top-row">
                  <div class="inventor-avatar-circle">${inv.icon}</div>
                  <span class="archive-year-badge">${inv.year}</span>
                </div>

                <div class="inventor-info">
                  <h3>${inv.name}</h3>
                  <div class="invention-name">⚙️ ${inv.invention}</div>
                </div>

                <div class="failure-log-box">
                  <strong>Obstacle:</strong> ${inv.obstacleFaced}
                  <span class="try-again-quote">"${inv.tryAgainMindset.slice(0, 95)}..."</span>
                </div>

                <button class="inspect-archive-btn ${isUnlocked ? 'completed' : ''}" onclick="window.inventorApp.inspectInventor('${inv.id}')">
                  <span>${isUnlocked ? '✓ Unlocked' : '🔍 Inspect & Unlock (+10 XP)'}</span>
                </button>
              </div>
            `;
          }).join('')}
        </div>

        <div style="margin-top: 30px; display: flex; justify-content: center;">
          <button class="forge-btn" onclick="window.inventorApp.switchStage(2)" ${!isCleared ? 'disabled' : ''}>
            <span>🔨</span> <span>Enter the Workshop Forge ${isCleared ? '➜' : '(Unlock 3 Archives)'}</span>
          </button>
        </div>
      `;
    }

    /**
     * Render Stage 2: The Workshop Forge & Sockets
     */
    renderStage2HTML() {
      const combo = this.session.selectedCombo;
      const canForge = combo.obstacle && combo.relic1 && combo.relic2;
      const isBuilt = this.session.completedQuests.prototypeBuilt;

      return `
        <div class="stage-hero-banner">
          <div class="stage-hero-title">
            <h2><span>⚙️</span> Stage 2: The Core Loop Workshop</h2>
            <p>Socket an everyday classroom obstacle and combine 2 modern relics to forge your prototype!</p>
          </div>
          <div class="stage-badge-pill">
            Formula: Obstacle + Relic A + Relic B
          </div>
        </div>

        <div class="workshop-layout">
          <!-- Left: Everyday Obstacle Picker -->
          <div class="obstacle-picker-column">
            <div class="section-tag">
              <span>🎯</span> <span>1. Select Everyday Obstacle:</span>
            </div>
            ${this.data.everydayObstacles.map(obs => `
              <div class="obstacle-card-btn ${combo.obstacle?.id === obs.id ? 'selected' : ''}" onclick="window.inventorApp.selectObstacle('${obs.id}')">
                <div class="obs-btn-header">
                  <span class="obs-title">${obs.icon} ${obs.title}</span>
                  <span style="font-size: 0.72rem; color: var(--blueprint-cyan); font-weight: 800;">${obs.difficulty}</span>
                </div>
                <div class="obs-summary">${obs.problemSummary}</div>
              </div>
            `).join('')}
          </div>

          <!-- Right: Hydraulic Forge & Modern Relics -->
          <div class="forge-station-column">
            
            <!-- Sockets Dock -->
            <div class="sockets-dock">
              <!-- Obstacle Socket -->
              <div class="socket-slot ${combo.obstacle ? 'filled' : ''}">
                ${combo.obstacle ? `
                  <button class="clear-socket-btn" onclick="window.inventorApp.clearSocket('obstacle')" title="Clear Obstacle">✕</button>
                  <span style="font-size: 2.2rem;">${combo.obstacle.icon}</span>
                  <div class="socket-label">Obstacle Socket</div>
                  <div class="socket-content-title">${combo.obstacle.title}</div>
                ` : `
                  <span class="socket-placeholder-icon">🎒</span>
                  <div class="socket-label">Obstacle Socket</div>
                  <span style="font-size: 0.78rem; color: #64748b;">(Choose from left)</span>
                `}
              </div>

              <!-- Relic 1 Socket -->
              <div class="socket-slot relic ${combo.relic1 ? 'filled' : ''}">
                ${combo.relic1 ? `
                  <button class="clear-socket-btn" onclick="window.inventorApp.clearSocket('relic1')" title="Clear Relic 1">✕</button>
                  <span style="font-size: 2.2rem;">${combo.relic1.icon}</span>
                  <div class="socket-label">Relic 1 Socket</div>
                  <div class="socket-content-title">${combo.relic1.name}</div>
                ` : `
                  <span class="socket-placeholder-icon">☀️</span>
                  <div class="socket-label">Relic 1 Socket</div>
                  <span style="font-size: 0.78rem; color: #64748b;">(Tap relic below)</span>
                `}
              </div>

              <!-- Relic 2 Socket -->
              <div class="socket-slot relic ${combo.relic2 ? 'filled' : ''}">
                ${combo.relic2 ? `
                  <button class="clear-socket-btn" onclick="window.inventorApp.clearSocket('relic2')" title="Clear Relic 2">✕</button>
                  <span style="font-size: 2.2rem;">${combo.relic2.icon}</span>
                  <div class="socket-label">Relic 2 Socket</div>
                  <div class="socket-content-title">${combo.relic2.name}</div>
                ` : `
                  <span class="socket-placeholder-icon">💡</span>
                  <div class="socket-label">Relic 2 Socket</div>
                  <span style="font-size: 0.78rem; color: #64748b;">(Tap relic below)</span>
                `}
              </div>
            </div>

            <!-- Modern Relics Picker -->
            <div class="relics-picker-box">
              <div class="section-tag">
                <span>⚡</span> <span>2. Select 2 Modern Relics:</span>
              </div>
              <div class="relics-grid">
                ${this.data.modernRelics.map(r => {
                  const isSocketed = combo.relic1?.id === r.id || combo.relic2?.id === r.id;
                  return `
                    <div class="relic-card ${isSocketed ? 'socketed' : ''}" onclick="window.inventorApp.selectRelic('${r.id}')">
                      <div class="relic-header">
                        <span class="relic-name">${r.icon} ${r.name}</span>
                        <span style="font-size: 0.7rem; color: ${r.color}; font-weight: 800;">${r.category}</span>
                      </div>
                      <div class="relic-trait">${r.trait}</div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Forge Action Button -->
            <div class="forge-action-bar">
              <button class="forge-btn" onclick="window.inventorApp.forgePrototype()" ${!canForge ? 'disabled' : ''}>
                <span>🔨</span> <span>FORGE PROTOTYPE! (+75 XP)</span>
              </button>
            </div>

            <!-- Prototype Reveal Card (if forged) -->
            ${isBuilt ? `
              <div class="prototype-reveal-card">
                <div class="prototype-title">
                  <span>✨</span> <span>${combo.inventionName}</span>
                </div>
                <p style="font-size: 0.95rem; color: var(--blueprint-cyan); font-weight: 700;">
                  "${combo.inventionTagline}"
                </p>
                <div class="prototype-formula-box">
                  <strong>Language Blueprint:</strong> "${combo.inventionFormula}"
                </div>
                <div style="display: flex; justify-content: flex-end;">
                  <button class="forge-btn" onclick="window.inventorApp.switchStage(3)" style="min-height: 52px; min-width: 220px;">
                    <span>🎤</span> <span>Proceed to Pitch Arena ➜</span>
                  </button>
                </div>
              </div>
            ` : ''}

          </div>
        </div>
      `;
    }

    /**
     * Render Stage 3: The Pitch Arena (60s Timer & Capstone)
     */
    renderStage3HTML() {
      const combo = this.session.selectedCombo;

      return `
        <div class="stage-hero-banner">
          <div class="stage-hero-title">
            <h2><span>🎤</span> Stage 3: The Pitch Arena</h2>
            <p>Deliver your 60-second invention presentation to the Grand Guild of Investors!</p>
          </div>
          <div class="stage-badge-pill">
            Prototype: ${combo.inventionName || 'Apprentice Prototype'}
          </div>
        </div>

        <div class="pitch-layout">
          <!-- Mechanical Pitch Timer Cockpit Bar -->
          <div class="timer-cockpit-bar">
            <div class="timer-display">
              <span style="font-size: 1.6rem;">⏱️</span>
              <div>
                <div style="font-size: 0.75rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">Guild Presentation Clock:</div>
                <span id="pitch-timer-seconds" class="timer-seconds-big ${this.pitchTimeRemaining <= 10 ? 'urgent' : ''}">
                  ${this.pitchTimeRemaining}s
                </span>
              </div>
            </div>

            <div class="timer-controls">
              ${!this.isTimerRunning ? `
                <button class="timer-btn" onclick="window.inventorApp.startPitchTimer()">▶ Start Clock</button>
              ` : `
                <button class="timer-btn" onclick="window.inventorApp.pausePitchTimer()">⏸ Pause</button>
              `}
              <button class="timer-btn" onclick="window.inventorApp.resetPitchTimer()">↺ Reset</button>
            </div>
          </div>

          <!-- 4 Teleprompter Cards Deck -->
          <div class="pitch-cards-deck">
            ${this.data.pitchDeck.targetFrames.map(card => {
              const text = this.interpolatePitchTemplate(card.template);
              return `
                <div class="pitch-card-step">
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                      <span class="pitch-step-num">${card.stepNumber}</span>
                      <span style="font-size: 0.72rem; color: var(--blueprint-cyan); font-weight: 800; text-transform: uppercase;">${card.role}</span>
                    </div>
                    <div class="pitch-card-title">${card.title}</div>
                  </div>

                  <div class="pitch-teleprompter-text">
                    "${text}"
                  </div>

                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.75rem; color: #a7f3d0; font-style: italic;">Cue: ${card.cue}</span>
                    <button class="listen-pitch-btn" onclick="window.inventorApp.listenToPitchCard('${card.id}')" title="Listen to pronunciation">
                      <span>🔊</span> <span>Listen</span>
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Pitch Deliver Button -->
          <div style="display: flex; justify-content: center; margin-top: 10px;">
            <button class="forge-btn" onclick="window.inventorApp.deliverPitch()" style="min-width: 320px;">
              <span>👑</span> <span>DELIVER PITCH & EARN DIPLOMA (+75 XP)</span>
            </button>
          </div>
        </div>
      `;
    }
  }

  // Instantiate Application
  root.inventorApp = new InventorForgeApp();

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => root.inventorApp.init());
  } else {
    root.inventorApp.init();
  }

})(typeof window !== 'undefined' ? window : global);
