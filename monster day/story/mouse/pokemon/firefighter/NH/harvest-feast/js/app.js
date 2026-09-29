/**
 * harvest-feast/js/app.js
 * Primary Controller & Game Loop for Smartboard Interactive Learning
 * Story Settings & The Chuseok Harvest Feast
 */

if (typeof require !== 'undefined') {
  if (typeof HarvestAudioEngine === 'undefined') {
    try { HarvestAudioEngine = require('./audio.js'); } catch (e) {}
  }
  if (typeof HARVEST_DATA === 'undefined') {
    try { HARVEST_DATA = require('./data.js'); } catch (e) {}
  }
}

class HarvestFeastApp {
  constructor() {
    this.audio = typeof HarvestAudioEngine !== 'undefined' ? new HarvestAudioEngine() : null;
    this.currentStage = 1;
    this.harvestEnergy = 0; // 0 - 100%

    // Stage 1 State
    this.stage1Solved = {
      "panel-climbing": false,
      "panel-laughing": false,
      "panel-crying": false
    };
    this.selectedAction = {};
    this.selectedEmotion = {};

    // Stage 2 State
    this.vennPlaced = {}; // token.id -> zone
    this.activeSelectedToken = null; // for tap-to-place fallback

    // Stage 3 State
    this.songpyeonStatus = {}; // cake.id -> { unlocked: boolean, completed: boolean }
    this.activeQuizCake = null;

    // Stage 4 State
    this.selectedFrameOptions = {
      "frame-1": null,
      "frame-2": null
    };
    this.launchedLanterns = [];

    // DOM Elements
    this.dom = {};
  }

  init() {
    this.cacheDom();
    this.initSongpyeonState();
    this.renderStage1();
    this.renderStage2();
    this.renderStage3();
    this.renderStage4();
    this.bindGlobalEvents();
    this.switchStage(1);
    this.updateHarvestBar(10);
  }

  cacheDom() {
    this.dom.stageViews = document.querySelectorAll('.stage-view');
    this.dom.stageTabs = document.querySelectorAll('.stage-tab-btn');
    this.dom.harvestBarFill = document.getElementById('harvest-bar-fill');
    this.dom.harvestPercentText = document.getElementById('harvest-percent-text');
    this.dom.btnFullscreen = document.getElementById('btn-fullscreen');
    this.dom.btnReset = document.getElementById('btn-reset');
    this.dom.btnSoundscape = document.getElementById('btn-soundscape');
    this.dom.btnSfx = document.getElementById('btn-sfx');

    // Modals
    this.dom.quizModal = document.getElementById('quiz-modal');
    this.dom.quizModalContent = document.getElementById('quiz-modal-content');
    this.dom.victoryModal = document.getElementById('victory-modal');
  }

  initSongpyeonState() {
    HARVEST_DATA.songpyeonCakes.forEach((cake, index) => {
      this.songpyeonStatus[cake.id] = {
        unlocked: index === 0, // Cake 1 unlocked by default
        completed: false
      };
    });
  }

  // =========================================================================
  // HUD CONTROLS & STAGE NAVIGATION
  // =========================================================================

  bindGlobalEvents() {
    // Stage stepper clicks
    this.dom.stageTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const stageNum = parseInt(tab.dataset.stage, 10);
        this.audio.playWoodClick();
        this.switchStage(stageNum);
      });
    });

    // Fullscreen toggle
    if (this.dom.btnFullscreen) {
      this.dom.btnFullscreen.addEventListener('click', () => {
        this.audio.playWoodClick();
        this.toggleFullscreen();
      });
    }

    // Reset button
    if (this.dom.btnReset) {
      this.dom.btnReset.addEventListener('click', () => {
        this.audio.playWoodClick();
        if (confirm("Reset current lesson progress?")) {
          window.location.reload();
        }
      });
    }

    // Soundscape button toggle
    if (this.dom.btnSoundscape) {
      this.dom.btnSoundscape.addEventListener('click', () => {
        this.audio.playWoodClick();
        this.cycleAmbientSoundscape();
      });
    }

    // SFX toggle
    if (this.dom.btnSfx) {
      this.dom.btnSfx.addEventListener('click', () => {
        this.audio.playWoodClick();
        this.audio.sfxMuted = !this.audio.sfxMuted;
        this.dom.btnSfx.classList.toggle('muted', this.audio.sfxMuted);
        this.dom.btnSfx.innerHTML = this.audio.sfxMuted ? '🔇 SFX Off' : '🔊 SFX On';
      });
    }

    // Keyboard Shortcuts (Smartboard / Teacher Clicker)
    window.addEventListener('keydown', (e) => {
      if (e.key >= '1' && e.key <= '4') {
        this.switchStage(parseInt(e.key, 10));
      } else if (e.key.toLowerCase() === 'f') {
        this.toggleFullscreen();
      }
    });

    // Modal Close Corner handlers
    document.querySelectorAll('.modal-close-corner').forEach(btn => {
      btn.addEventListener('click', () => {
        this.audio.playWoodClick();
        this.closeAllModals();
      });
    });
  }

  cycleAmbientSoundscape() {
    const modes = ['farm', 'kitchen', 'chuseok', 'off'];
    const current = this.audio.currentAmbientMode || (this.audio.ambientMuted ? 'off' : 'off');
    let nextIndex = (modes.indexOf(current) + 1) % modes.length;
    const nextMode = modes[nextIndex];

    if (nextMode === 'off') {
      this.audio.ambientMuted = true;
      this.audio.stopAmbient();
      if (this.dom.btnSoundscape) this.dom.btnSoundscape.innerHTML = '🎵 Ambiance: Off';
    } else {
      this.audio.ambientMuted = false;
      this.audio.playAmbient(nextMode);
      if (this.dom.btnSoundscape) {
        const labels = { farm: '🌾 Farm Ambiance', kitchen: '🍳 Kitchen Ambiance', chuseok: '🏮 Chuseok Music' };
        this.dom.btnSoundscape.innerHTML = `🎵 ${labels[nextMode] || 'Ambiance'}`;
      }
    }
  }

  switchStage(stageNum) {
    this.currentStage = stageNum;

    // Update Stepper Tabs
    this.dom.stageTabs.forEach(tab => {
      const s = parseInt(tab.dataset.stage, 10);
      tab.classList.toggle('active', s === stageNum);
    });

    // Update Views
    this.dom.stageViews.forEach(view => {
      const s = parseInt(view.dataset.stage, 10);
      view.classList.toggle('active', s === stageNum);
    });

    // Auto-align ambient soundscape to stage
    if (!this.audio.ambientMuted) {
      if (stageNum === 1) this.audio.playAmbient('farm');
      else if (stageNum === 2) this.audio.playAmbient('kitchen');
      else if (stageNum === 3 || stageNum === 4) this.audio.playAmbient('chuseok');
    }
  }

  updateHarvestBar(targetPercent) {
    this.harvestEnergy = Math.min(100, Math.max(0, targetPercent));
    if (this.dom.harvestBarFill) {
      this.dom.harvestBarFill.style.width = `${this.harvestEnergy}%`;
    }
    if (this.dom.harvestPercentText) {
      this.dom.harvestPercentText.textContent = `${this.harvestEnergy}%`;
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }

  closeAllModals() {
    if (this.dom.quizModal) this.dom.quizModal.classList.remove('active');
    if (this.dom.victoryModal) this.dom.victoryModal.classList.remove('active');
  }

  // =========================================================================
  // STAGE 1: SETTING & EMOTION DECODER
  // =========================================================================

  renderStage1() {
    const container = document.getElementById('stage-1-panels-grid');
    if (!container) return;
    container.innerHTML = '';

    HARVEST_DATA.claraPanels.forEach(panel => {
      const card = document.createElement('div');
      card.className = 'clara-panel-card';
      card.id = `card-${panel.id}`;

      card.innerHTML = `
        <div class="panel-viewport-header">
          ${this.getClaraSceneSvg(panel)}
        </div>
        <div class="panel-meta-info">
          <span class="panel-setting-tag">${panel.settingText}</span>
          <h3 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 900; margin-bottom: 6px; color: #ffffff;">${panel.title}</h3>
          <p class="panel-desc-text">${panel.description}</p>
        </div>
        <div class="selectors-wheel-container">
          <div class="selector-group-row">
            <span class="selector-label">Clara is... (Action):</span>
            <div class="choice-pills-cluster" id="actions-${panel.id}">
              ${panel.actions.map(act => `
                <button type="button" class="choice-chip-btn" data-panel="${panel.id}" data-type="action" data-val="${act}">${act}</button>
              `).join('')}
            </div>
          </div>
          <div class="selector-group-row">
            <span class="selector-label">Clara feels... (Emotion):</span>
            <div class="choice-pills-cluster" id="emotions-${panel.id}">
              ${panel.emotions.map(emo => `
                <button type="button" class="choice-chip-btn" data-panel="${panel.id}" data-type="emotion" data-val="${emo}">${emo}</button>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    // Bind choice buttons
    container.querySelectorAll('.choice-chip-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const { panel, type, val } = btn.dataset;
        this.handleStage1Choice(panel, type, val);
      });
    });
  }

  handleStage1Choice(panelId, type, value) {
    this.audio.playWoodClick();
    const panel = HARVEST_DATA.claraPanels.find(p => p.id === panelId);
    if (!panel) return;

    if (type === 'action') {
      this.selectedAction[panelId] = value;
      // update active styles
      const actionBtns = document.querySelectorAll(`#actions-${panelId} .choice-chip-btn`);
      actionBtns.forEach(b => b.classList.toggle('selected', b.dataset.val === value));
    } else {
      this.selectedEmotion[panelId] = value;
      const emotionBtns = document.querySelectorAll(`#emotions-${panelId} .choice-chip-btn`);
      emotionBtns.forEach(b => b.classList.toggle('selected', b.dataset.val === value));
    }

    // Check if both answered for this panel
    const curAction = this.selectedAction[panelId];
    const curEmotion = this.selectedEmotion[panelId];

    if (curAction && curEmotion) {
      if (curAction === panel.correctAction && curEmotion === panel.correctEmotion) {
        // Correct match!
        if (!this.stage1Solved[panelId]) {
          this.stage1Solved[panelId] = true;
          this.audio.playHarmonicFanfare();
          this.audio.speak(panel.voiceLine);

          const card = document.getElementById(`card-${panelId}`);
          if (card) {
            card.classList.add('solved');
            const actionBtn = card.querySelector(`[data-type="action"][data-val="${curAction}"]`);
            const emotionBtn = card.querySelector(`[data-type="emotion"][data-val="${curEmotion}"]`);
            if (actionBtn) actionBtn.classList.add('correct');
            if (emotionBtn) emotionBtn.classList.add('correct');
          }

          // Advance energy bar
          const solvedCount = Object.values(this.stage1Solved).filter(Boolean).length;
          this.updateHarvestBar(10 + solvedCount * 10);

          // Check if all 3 are solved
          if (solvedCount === 3) {
            this.showStage1PortalUnlock();
          }
        }
      } else {
        // Soft fail
        this.audio.playSoftThud();
        const card = document.getElementById(`card-${panelId}`);
        if (card) {
          card.classList.add('shake-horizontal');
          setTimeout(() => card.classList.remove('shake-horizontal'), 400);
        }
      }
    }
  }

  showStage1PortalUnlock() {
    const portalBox = document.getElementById('stage-1-portal-box');
    if (portalBox) {
      portalBox.style.display = 'block';
      portalBox.innerHTML = `
        <div class="portal-unlock-banner">
          <div style="display: flex; align-items: center; gap: 18px;">
            <div style="font-size: 3rem; line-height: 1;">🌟</div>
            <div>
              <h3 style="font-family: var(--font-display); font-size: 1.6rem; font-weight: 900; color: #ffffff; margin-bottom: 4px;">Setting Portal Unlocked!</h3>
              <p style="color: #cbd5e1; font-size: 1.05rem;">"The setting is the time and place in the story." Great job decoding Clara's harvest world!</p>
            </div>
          </div>
          <button class="btn-tactile-3d btn-emerald" id="btn-portal-stage2" style="font-size: 1.15rem; padding: 14px 28px;">
            Enter Stage 2: Venn Diagram Relay ➡️
          </button>
        </div>
      `;

      const nextBtn = document.getElementById('btn-portal-stage2');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          this.audio.playWoodClick();
          this.switchStage(2);
        });
      }
    }
  }

  getClaraSceneSvg(panel) {
    if (panel.id === 'panel-climbing') {
      return `
        <svg viewBox="0 0 380 240" class="panel-bg-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="skyGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#38bdf8"/>
              <stop offset="70%" stop-color="#bae6fd"/>
              <stop offset="100%" stop-color="#fef08a"/>
            </linearGradient>
            <radialGradient id="sunGlow1" cx="20%" cy="20%" r="50%">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="40%" stop-color="#fef08a"/>
              <stop offset="100%" stop-color="rgba(254, 240, 138, 0)"/>
            </radialGradient>
          </defs>
          <rect width="380" height="240" fill="url(#skyGrad1)"/>
          <circle cx="60" cy="50" r="45" fill="url(#sunGlow1)"/>
          <!-- Orchard Tree Trunk & Branches -->
          <path d="M 0 240 Q 60 160 110 130 T 260 90 T 380 70" fill="none" stroke="#78350f" stroke-width="26" stroke-linecap="round"/>
          <path d="M 120 130 Q 150 180 180 240" fill="none" stroke="#78350f" stroke-width="20" stroke-linecap="round"/>
          <!-- Foliage -->
          <circle cx="80" cy="90" r="55" fill="#15803d" opacity="0.9"/>
          <circle cx="150" cy="65" r="60" fill="#16a34a" opacity="0.95"/>
          <circle cx="230" cy="70" r="55" fill="#22c55e" opacity="0.9"/>
          <!-- Red Apples -->
          <circle cx="70" cy="80" r="12" fill="#ef4444"/><circle cx="160" cy="55" r="13" fill="#dc2626"/><circle cx="210" cy="85" r="11" fill="#ef4444"/>
          <!-- Clara Character on Branch (Surprised Climbing) -->
          <g class="clara-character-rig" transform="translate(140, 75)">
            <ellipse cx="25" cy="50" rx="14" ry="20" fill="#f43f5e"/> <!-- Dress -->
            <circle cx="25" cy="22" r="16" fill="#fed7aa"/> <!-- Face -->
            <!-- Hair -->
            <path d="M 9 22 Q 25 2 41 22 Q 35 10 25 10 Q 15 10 9 22 Z" fill="#92400e"/>
            <!-- Surprised Eyes -->
            <circle cx="20" cy="20" r="3" fill="#0f172a"/><circle cx="30" cy="20" r="3" fill="#0f172a"/>
            <!-- Surprised 'O' Mouth -->
            <circle cx="25" cy="28" r="3" fill="#be123c"/>
            <!-- Arms Climbing onto Branch -->
            <path d="M 15 40 Q 5 28 -5 32" stroke="#fed7aa" stroke-width="6" stroke-linecap="round" fill="none"/>
            <path d="M 35 40 Q 45 28 55 25" stroke="#fed7aa" stroke-width="6" stroke-linecap="round" fill="none"/>
            <!-- Legs reaching -->
            <path d="M 20 68 L 18 85" stroke="#fed7aa" stroke-width="6" stroke-linecap="round"/>
            <path d="M 30 68 L 36 82" stroke="#fed7aa" stroke-width="6" stroke-linecap="round"/>
          </g>
        </svg>
      `;
    } else if (panel.id === 'panel-laughing') {
      return `
        <svg viewBox="0 0 380 240" class="panel-bg-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="skyGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#60a5fa"/>
              <stop offset="60%" stop-color="#bae6fd"/>
              <stop offset="100%" stop-color="#fed7aa"/>
            </linearGradient>
            <linearGradient id="grassGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#4ade80"/>
              <stop offset="100%" stop-color="#15803d"/>
            </linearGradient>
          </defs>
          <rect width="380" height="240" fill="url(#skyGrad2)"/>
          <ellipse cx="190" cy="250" rx="240" ry="90" fill="url(#grassGrad2)"/>
          <!-- Pumpkins & Harvest Baskets -->
          <ellipse cx="90" cy="210" rx="30" ry="22" fill="#ea580c"/>
          <ellipse cx="90" cy="206" rx="20" ry="18" fill="#f97316"/>
          <ellipse cx="290" cy="215" rx="24" ry="18" fill="#ea580c"/>
          <!-- Clara Character with Big Laugh -->
          <g class="clara-character-rig" transform="translate(165, 80)">
            <ellipse cx="25" cy="55" rx="16" ry="22" fill="#38bdf8"/> <!-- Cyan Top -->
            <circle cx="25" cy="22" r="16" fill="#fed7aa"/> <!-- Face -->
            <!-- Hair with braids -->
            <path d="M 9 22 Q 25 2 41 22 Q 35 10 25 10 Q 15 10 9 22 Z" fill="#92400e"/>
            <path d="M 9 25 Q -2 40 4 52" stroke="#92400e" stroke-width="4" fill="none" stroke-linecap="round"/>
            <path d="M 41 25 Q 52 40 46 52" stroke="#92400e" stroke-width="4" fill="none" stroke-linecap="round"/>
            <!-- Joyful squinting laughing eyes -->
            <path d="M 18 19 Q 21 15 24 19" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <path d="M 28 19 Q 31 15 34 19" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <!-- Wide laughing smile -->
            <path d="M 19 26 Q 26 36 33 26 Z" fill="#be123c"/>
            <!-- Hands holding big yellow harvest melon -->
            <ellipse cx="26" cy="62" rx="18" ry="13" fill="#eab308"/>
            <path d="M 14 55 Q 18 64 22 65" stroke="#fed7aa" stroke-width="5" stroke-linecap="round" fill="none"/>
            <path d="M 38 55 Q 34 64 30 65" stroke="#fed7aa" stroke-width="5" stroke-linecap="round" fill="none"/>
            <!-- Legs -->
            <path d="M 20 75 L 18 96" stroke="#fed7aa" stroke-width="6" stroke-linecap="round"/>
            <path d="M 32 75 L 34 96" stroke="#fed7aa" stroke-width="6" stroke-linecap="round"/>
          </g>
        </svg>
      `;
    } else {
      // panel-crying
      return `
        <svg viewBox="0 0 380 240" class="panel-bg-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="twilightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1e1b4b"/>
              <stop offset="50%" stop-color="#4c1d95"/>
              <stop offset="85%" stop-color="#c2410c"/>
              <stop offset="100%" stop-color="#78350f"/>
            </linearGradient>
          </defs>
          <rect width="380" height="240" fill="url(#twilightGrad)"/>
          <!-- Tall Swirling Wheat Stalks -->
          <g stroke="#d97706" stroke-width="3" stroke-linecap="round" opacity="0.85">
            <path d="M 20 240 Q 30 140 10 90"/>
            <path d="M 50 240 Q 70 130 50 70"/>
            <path d="M 80 240 Q 60 120 90 60"/>
            <path d="M 280 240 Q 300 120 270 50"/>
            <path d="M 320 240 Q 340 140 310 80"/>
            <path d="M 350 240 Q 360 130 370 70"/>
          </g>
          <!-- Clara Character (Lost & Crying in Wheat) -->
          <g class="clara-character-rig" transform="translate(165, 95)">
            <ellipse cx="25" cy="55" rx="16" ry="22" fill="#a855f7"/>
            <circle cx="25" cy="22" r="16" fill="#fed7aa"/>
            <path d="M 9 22 Q 25 2 41 22 Q 35 10 25 10 Q 15 10 9 22 Z" fill="#92400e"/>
            <!-- Sad/Crying Eyes with Teardrops -->
            <path d="M 18 20 Q 21 24 24 20" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <path d="M 28 20 Q 31 24 34 20" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <!-- Blue Teardrops -->
            <circle cx="16" cy="27" r="3" fill="#38bdf8"/>
            <circle cx="34" cy="27" r="3" fill="#38bdf8"/>
            <!-- Downward Sad Mouth -->
            <path d="M 21 31 Q 25 26 29 31" stroke="#991b1b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <!-- Hands rubbing eyes -->
            <circle cx="17" cy="24" r="5" fill="#fed7aa"/>
            <circle cx="33" cy="24" r="5" fill="#fed7aa"/>
            <!-- Legs shivering -->
            <path d="M 20 75 L 19 96" stroke="#fed7aa" stroke-width="6" stroke-linecap="round"/>
            <path d="M 31 75 L 32 96" stroke="#fed7aa" stroke-width="6" stroke-linecap="round"/>
          </g>
        </svg>
      `;
    }
  }

  // =========================================================================
  // STAGE 2: DUAL-ZONE VENN DIAGRAM RELAY
  // =========================================================================

  renderStage2() {
    const bottomShelf = document.getElementById('venn-tokens-shelf');
    if (!bottomShelf) return;
    bottomShelf.innerHTML = '';

    HARVEST_DATA.vennDiagram.tokens.forEach(token => {
      const btn = document.createElement('div');
      btn.className = 'word-token-draggable';
      btn.id = `token-${token.id}`;
      btn.dataset.tokenId = token.id;
      btn.setAttribute('draggable', 'true');
      btn.innerHTML = `<span>${token.icon}</span> <span>${token.label}</span>`;

      // HTML5 Drag Events
      btn.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', token.id);
        btn.classList.add('dragging');
      });

      btn.addEventListener('dragend', () => {
        btn.classList.remove('dragging');
      });

      // Tap-to-place fallback for touchscreens
      btn.addEventListener('click', () => {
        this.handleTokenTapSelect(token.id);
      });

      bottomShelf.appendChild(btn);
    });

    // Wire Up Drop Zones
    const zones = [
      { element: document.getElementById('zone-kitchen'), id: 'kitchen' },
      { element: document.getElementById('zone-both'), id: 'both' },
      { element: document.getElementById('zone-farm'), id: 'farm' }
    ];

    zones.forEach(({ element, id }) => {
      if (!element) return;

      element.addEventListener('dragover', (e) => {
        e.preventDefault();
        element.classList.add('drag-over');
      });

      element.addEventListener('dragleave', () => {
        element.classList.remove('drag-over');
      });

      element.addEventListener('drop', (e) => {
        e.preventDefault();
        element.classList.remove('drag-over');
        const tokenId = e.dataTransfer.getData('text/plain');
        if (tokenId) {
          this.handleTokenDropInZone(tokenId, id);
        }
      });

      // Click to place if a token is tap-selected
      element.addEventListener('click', () => {
        if (this.activeSelectedToken) {
          this.handleTokenDropInZone(this.activeSelectedToken, id);
        }
      });
    });
  }

  handleTokenTapSelect(tokenId) {
    this.audio.playWoodClick();
    if (this.activeSelectedToken === tokenId) {
      this.activeSelectedToken = null;
      document.querySelectorAll('.word-token-draggable').forEach(t => t.style.outline = 'none');
    } else {
      this.activeSelectedToken = tokenId;
      document.querySelectorAll('.word-token-draggable').forEach(t => {
        t.style.outline = t.dataset.tokenId === tokenId ? '3px solid #38bdf8' : 'none';
      });
    }
  }

  handleTokenDropInZone(tokenId, targetZone) {
    const token = HARVEST_DATA.vennDiagram.tokens.find(t => t.id === tokenId);
    if (!token) return;

    if (token.zone === targetZone) {
      // Correct Zone Match!
      this.vennPlaced[tokenId] = targetZone;
      this.audio.playHarmonicFanfare();
      this.triggerZoneSplash(targetZone, token.splashType);

      // Add to Zone Tray
      const trayId = `tray-${targetZone}`;
      const tray = document.getElementById(trayId);
      if (tray) {
        const snapped = document.createElement('div');
        snapped.className = 'word-token-snapped';
        snapped.innerHTML = `<span>${token.icon}</span> <span>${token.label}</span> ✓`;
        tray.appendChild(snapped);
      }

      // Mark shelf token as ghosted checked
      const shelfToken = document.getElementById(`token-${tokenId}`);
      if (shelfToken) {
        shelfToken.classList.add('ghosted-checked');
        shelfToken.innerHTML = `<span>${token.icon}</span> <span>${token.label}</span> <span style="color:#10b981;">✓</span>`;
        shelfToken.setAttribute('draggable', 'false');
      }

      this.activeSelectedToken = null;
      document.querySelectorAll('.word-token-draggable').forEach(t => t.style.outline = 'none');

      // Update energy bar (+10% per token)
      const placedCount = Object.keys(this.vennPlaced).length;
      this.updateHarvestBar(40 + placedCount * 8);

      // Check if all 7 tokens sorted
      if (placedCount === HARVEST_DATA.vennDiagram.tokens.length) {
        this.showStage2VictoryBanner();
      }
    } else {
      // Soft Fail
      this.audio.playSoftThud();
      const zoneEl = document.getElementById(`zone-${targetZone}`);
      if (zoneEl) {
        zoneEl.classList.add('shake-horizontal');
        setTimeout(() => zoneEl.classList.remove('shake-horizontal'), 400);
      }
      this.audio.speak(`Think again! Does ${token.label} belong ${targetZone === 'kitchen' ? 'in the kitchen' : targetZone === 'farm' ? 'on the farm' : 'in both places'}?`);
    }
  }

  triggerZoneSplash(zoneId, splashType) {
    const zoneEl = document.getElementById(`zone-${zoneId}`);
    if (!zoneEl) return;

    const splash = document.createElement('div');
    splash.className = 'splash-particle-burst';
    const icons = {
      soup: '🥣 🍲 ✨',
      hearth: '🔥 🪵 ✨',
      wheat: '🌾 🌾 ✨',
      wind: '🍃 🌤️ ✨',
      fruit: '🍎 🍏 🍐 ✨',
      veggie: '🥕 🥬 🌽 ✨',
      family: '❤️ 👨‍👩‍👧‍👦 ✨'
    };
    splash.innerHTML = icons[splashType] || '✨ 🌟 ✨';
    splash.style.position = 'absolute';
    splash.style.fontSize = '2.2rem';
    splash.style.animation = 'splashRise 1s ease-out forwards';
    splash.style.pointerEvents = 'none';
    splash.style.zIndex = '30';

    zoneEl.appendChild(splash);
    setTimeout(() => splash.remove(), 1000);
  }

  showStage2VictoryBanner() {
    const bannerBox = document.getElementById('stage-2-banner-box');
    if (bannerBox) {
      bannerBox.style.display = 'block';
      bannerBox.innerHTML = `
        <div class="portal-unlock-banner">
          <div style="display: flex; align-items: center; gap: 18px;">
            <div style="font-size: 3rem; line-height: 1;">🎉</div>
            <div>
              <h3 style="font-family: var(--font-display); font-size: 1.6rem; font-weight: 900; color: #ffffff; margin-bottom: 4px;">Harvest Relay Complete!</h3>
              <p style="color: #cbd5e1; font-size: 1.05rem;">All crops, tools, and family activities are correctly sorted between the kitchen and farm.</p>
            </div>
          </div>
          <button class="btn-tactile-3d btn-gold" id="btn-portal-stage3" style="font-size: 1.15rem; padding: 14px 28px;">
            Enter Stage 3: The Songpyeon Feast ➡️
          </button>
        </div>
      `;

      const nextBtn = document.getElementById('btn-portal-stage3');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          this.audio.playWoodClick();
          this.switchStage(3);
        });
      }
    }
  }

  // =========================================================================
  // STAGE 3: THE CHUSEOK SONGPYEON FEAST
  // =========================================================================

  renderStage3() {
    const cakesRow = document.getElementById('songpyeon-cakes-row');
    if (!cakesRow) return;
    cakesRow.innerHTML = '';

    HARVEST_DATA.songpyeonCakes.forEach(cake => {
      const card = document.createElement('div');
      card.className = `songpyeon-card ${this.songpyeonStatus[cake.id].unlocked ? 'unlocked' : 'locked'}`;
      card.id = `songpyeon-card-${cake.id}`;

      card.innerHTML = `
        <div class="cake-number-pill">#${cake.number}</div>
        <div class="songpyeon-3d-visual">
          ${this.getSongpyeonCakeSvg(cake)}
          ${!this.songpyeonStatus[cake.id].completed ? `<div class="steam-cloud-overlay" id="steam-${cake.id}">♨️</div>` : ''}
        </div>
        <h4 class="cake-title-text">${cake.title}</h4>
        <span class="cake-tradition-tag">${cake.koreanTradition}</span>
      `;

      card.addEventListener('click', () => {
        this.handleSongpyeonClick(cake);
      });

      cakesRow.appendChild(card);
    });
  }

  getSongpyeonCakeSvg(cake) {
    return `
      <svg viewBox="0 0 100 80" width="90" height="70" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="grad-${cake.id}" cx="40%" cy="30%" r="65%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85"/>
            <stop offset="45%" stop-color="${cake.colorHex}"/>
            <stop offset="100%" stop-color="${cake.accentHex}"/>
          </radialGradient>
        </defs>
        <!-- Shadow -->
        <ellipse cx="50" cy="72" rx="36" ry="7" fill="#000000" opacity="0.35"/>
        <!-- Half Moon Crescent Rice Cake Body -->
        <path d="M 12 55 Q 50 10 88 55 Q 50 42 12 55 Z" fill="url(#grad-${cake.id})" stroke="${cake.accentHex}" stroke-width="2.5"/>
        <!-- Steaming sesame sheen -->
        <ellipse cx="46" cy="36" rx="14" ry="4" fill="#ffffff" opacity="0.4" transform="rotate(-10, 46, 36)"/>
      </svg>
    `;
  }

  handleSongpyeonClick(cake) {
    this.audio.playWoodClick();
    const status = this.songpyeonStatus[cake.id];

    if (!status.unlocked) {
      this.audio.playSoftThud();
      this.audio.speak("This delicious Songpyeon is still steaming! Unlock the earlier traditions first.");
      return;
    }

    if (status.completed) {
      this.audio.speak(cake.culturalFact);
      return;
    }

    // Open Quiz Modal
    this.activeQuizCake = cake;
    this.openSongpyeonQuizModal(cake);
  }

  openSongpyeonQuizModal(cake) {
    if (!this.dom.quizModal || !this.dom.quizModalContent) return;

    this.dom.quizModalContent.innerHTML = `
      <div style="font-size: 3rem; margin-bottom: 8px;">🥟</div>
      <div style="color: var(--accent-gold); font-size: 0.95rem; font-weight: 900; text-transform: uppercase;">
        Songpyeon #${cake.number}: ${cake.colorName}
      </div>
      <h3 style="font-family: var(--font-display); font-size: 1.55rem; font-weight: 900; color: #ffffff; margin: 12px 0 20px;">
        ${cake.promptQuestion}
      </h3>
      <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
        ${cake.options.map((opt, idx) => `
          <button class="choice-chip-btn modal-quiz-opt" data-opt-index="${idx}" style="padding: 16px 20px; font-size: 1.15rem; text-align: left;">
            ${String.fromCharCode(65 + idx)}. ${opt}
          </button>
        `).join('')}
      </div>
      <p style="color: #94a3b8; font-size: 0.9rem; font-style: italic;">
        Clue: ${cake.clue}
      </p>
    `;

    this.dom.quizModalContent.querySelectorAll('.modal-quiz-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const optIndex = parseInt(btn.dataset.optIndex, 10);
        this.verifyQuizAnswer(cake, optIndex);
      });
    });

    this.dom.quizModal.classList.add('active');
  }

  verifyQuizAnswer(cake, selectedIndex) {
    if (selectedIndex === cake.correctIndex) {
      // Correct! Ceremonial Gong + Steam Release
      this.audio.playGongAndSteam();
      this.songpyeonStatus[cake.id].completed = true;

      // Unlock next cake
      const nextCake = HARVEST_DATA.songpyeonCakes.find(c => c.number === cake.number + 1);
      if (nextCake) {
        this.songpyeonStatus[nextCake.id].unlocked = true;
      }

      // Re-render stage 3
      this.renderStage3();

      // Show Cultural Fact in Modal
      if (this.dom.quizModalContent) {
        this.dom.quizModalContent.innerHTML = `
          <div style="font-size: 4rem; margin-bottom: 8px;">✨ 🥮 ✨</div>
          <h3 style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 900; color: #34d399; margin-bottom: 12px;">
            Correct! Steam Released!
          </h3>
          <p style="color: #f8fafc; font-size: 1.15rem; line-height: 1.5; margin-bottom: 24px;">
            ${cake.culturalFact}
          </p>
          <button class="btn-tactile-3d btn-emerald" id="btn-quiz-continue" style="font-size: 1.1rem; padding: 12px 28px;">
            Enjoy the Feast & Continue ➡️
          </button>
        `;

        this.audio.speak(cake.culturalFact);

        const continueBtn = document.getElementById('btn-quiz-continue');
        if (continueBtn) {
          continueBtn.addEventListener('click', () => {
            this.audio.playWoodClick();
            this.closeAllModals();
            this.checkAllSongpyeonCompleted();
          });
        }
      }

      // Energy bar advance
      const compCount = Object.values(this.songpyeonStatus).filter(s => s.completed).length;
      this.updateHarvestBar(70 + compCount * 4);

    } else {
      // Soft-fail
      this.audio.playSoftThud();
      this.audio.speak("Not quite! Try another choice to release the fragrant pine steam.");
    }
  }

  checkAllSongpyeonCompleted() {
    const allDone = Object.values(this.songpyeonStatus).every(s => s.completed);
    if (allDone) {
      const banner = document.getElementById('stage-3-banner-box');
      if (banner) {
        banner.style.display = 'block';
        banner.innerHTML = `
          <div class="portal-unlock-banner">
            <div style="display: flex; align-items: center; gap: 18px;">
              <div style="font-size: 3rem; line-height: 1;">🥮</div>
              <div>
                <h3 style="font-family: var(--font-display); font-size: 1.6rem; font-weight: 900; color: #ffffff; margin-bottom: 4px;">All 5 Songpyeon Unlocked!</h3>
                <p style="color: #cbd5e1; font-size: 1.05rem;">The Chuseok banquet is ready. Now share what you and Clara's family are thankful for!</p>
              </div>
            </div>
            <button class="btn-tactile-3d btn-gold" id="btn-portal-stage4" style="font-size: 1.15rem; padding: 14px 28px;">
              Enter Stage 4: Gratitude Finale ➡️
            </button>
          </div>
        `;

        const nextBtn = document.getElementById('btn-portal-stage4');
        if (nextBtn) {
          nextBtn.addEventListener('click', () => {
            this.audio.playWoodClick();
            this.switchStage(4);
          });
        }
      }
    }
  }

  // =========================================================================
  // STAGE 4: GRATITUDE SENTENCE BUILDER & LANTERN FINALE
  // =========================================================================

  renderStage4() {
    const frameContainer = document.getElementById('sentence-frames-container');
    if (!frameContainer) return;
    frameContainer.innerHTML = '';

    HARVEST_DATA.sentenceFrames.forEach(frame => {
      const box = document.createElement('div');
      box.className = 'frame-box';
      box.id = `box-${frame.id}`;

      box.innerHTML = `
        <div class="frame-starter-text">${frame.starter} ...</div>
        <div class="frame-options-cluster" id="cluster-${frame.id}">
          ${frame.options.map(opt => `
            <button type="button" class="frame-choice-btn" data-frame-id="${frame.id}" data-opt="${opt}">
              ${opt}
            </button>
          `).join('')}
        </div>
        <div class="completed-sentence-result" id="res-${frame.id}" style="display: none; margin-top: 10px; font-size: 1.1rem; font-weight: 800; color: #34d399;">
          ${frame.full} ✓
        </div>
      `;

      frameContainer.appendChild(box);
    });

    frameContainer.querySelectorAll('.frame-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const { frameId, opt } = btn.dataset;
        this.handleSentenceFrameChoice(frameId, opt);
      });
    });

    // Preset gratitude selector pills
    const presetsContainer = document.getElementById('preset-gratitude-pills');
    if (presetsContainer) {
      presetsContainer.innerHTML = '';
      HARVEST_DATA.presetGratitudeOptions.forEach(text => {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'choice-chip-btn';
        pill.style.fontSize = '0.92rem';
        pill.style.padding = '8px 14px';
        pill.textContent = text;

        pill.addEventListener('click', () => {
          this.audio.playWoodClick();
          const input = document.getElementById('input-custom-gratitude');
          if (input) input.value = text;
        });

        presetsContainer.appendChild(pill);
      });
    }

    // Launch Lantern Button
    const btnLaunch = document.getElementById('btn-launch-lantern');
    if (btnLaunch) {
      btnLaunch.addEventListener('click', () => {
        this.handleLaunchLantern();
      });
    }

    // Finish Lesson Celebration Button
    const btnFinish = document.getElementById('btn-finish-lesson');
    if (btnFinish) {
      btnFinish.addEventListener('click', () => {
        this.audio.playClassVictory();
        this.showClassVictoryModal();
      });
    }
  }

  handleSentenceFrameChoice(frameId, option) {
    this.audio.playWoodClick();
    const frame = HARVEST_DATA.sentenceFrames.find(f => f.id === frameId);
    if (!frame) return;

    this.selectedFrameOptions[frameId] = option;

    const cluster = document.getElementById(`cluster-${frameId}`);
    if (cluster) {
      cluster.querySelectorAll('.frame-choice-btn').forEach(b => {
        b.classList.toggle('selected', b.dataset.opt === option);
      });
    }

    if (option === frame.correct) {
      this.audio.playHarmonicFanfare();
      const res = document.getElementById(`res-${frameId}`);
      if (res) res.style.display = 'block';
      this.audio.speak(frame.full);
      this.updateHarvestBar(Math.max(this.harvestEnergy, 95));
    } else {
      this.audio.playSoftThud();
    }
  }

  handleLaunchLantern() {
    const inputName = document.getElementById('input-student-name');
    const inputGratitude = document.getElementById('input-custom-gratitude');
    const name = inputName && inputName.value.trim() ? inputName.value.trim() : "Classroom Explorer";
    const gratitude = inputGratitude && inputGratitude.value.trim() ? inputGratitude.value.trim() : "delicious harvest food";

    this.audio.playLanternAscend();

    const stage = document.getElementById('lanterns-float-stage');
    if (!stage) return;

    const lantern = document.createElement('div');
    lantern.className = 'floating-sky-lantern';
    // Randomize initial horizontal position
    const leftPercent = 15 + Math.random() * 60;
    lantern.style.left = `${leftPercent}%`;
    lantern.style.bottom = '-180px';
    lantern.style.animationDuration = `${14 + Math.random() * 8}s`;

    lantern.innerHTML = `
      <div style="font-size: 1.4rem; line-height: 1; margin-bottom: 4px;">🏮</div>
      <div style="color: #451a03; font-weight: 900; font-size: 0.85rem; margin-bottom: 2px;">${name}</div>
      <div style="color: #7c2d12; font-size: 0.78rem; font-weight: 800; line-height: 1.2;">
        "${gratitude}"
      </div>
    `;

    stage.appendChild(lantern);
    this.launchedLanterns.push({ name, gratitude });

    // Speak gratitude
    this.audio.speak(`${name} is thankful for ${gratitude}.`);

    // Clear input
    if (inputGratitude) inputGratitude.value = '';

    // Update Class Harvest Energy to 100%!
    this.updateHarvestBar(100);
  }

  showClassVictoryModal() {
    if (!this.dom.victoryModal) return;
    this.dom.victoryModal.classList.add('active');
  }
}

// Global initialization upon DOM ready
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    window.harvestApp = new HarvestFeastApp();
    window.harvestApp.init();
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = HarvestFeastApp;
}
