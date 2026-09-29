/**
 * forest-adaptation/js/app.js
 * Primary Controller & Game Loop for Smartboard Interactive Learning
 * Nature's Armor & The Detective's Lens
 */

if (typeof require !== 'undefined') {
  if (typeof ForestAdaptationAudio === 'undefined') {
    try { ForestAdaptationAudio = require('./audio.js'); } catch (e) {}
  }
  if (typeof FOREST_ADAPTATION_DATA === 'undefined') {
    try { FOREST_ADAPTATION_DATA = require('./data.js'); } catch (e) {}
  }
}

class ForestAdaptationApp {
  constructor() {
    this.audio = typeof ForestAdaptationAudio !== 'undefined' ? new ForestAdaptationAudio() : null;
    this.currentStage = 1;
    this.energyScore = 0; // 0 - 100%

    // Stage 1 State: Biome Statements
    this.stage1Solved = {}; // stmtId -> true

    // Stage 2 State: Survival Match
    this.selectedOrganism = null;
    this.stage2Matched = {}; // orgId -> targetId

    // Stage 3 State: 4-Season Matrix
    this.seasonPlacements = {}; // itemId -> seasonId
    this.activeSelectedSeasonItem = null;

    // Stage 4 State: Alice Purpose
    this.aliceSolved = false;

    // Stage 5 State: Story Case File
    this.storyVerdictAnswers = {}; // qId -> boolean
    this.storyKaraokeInterval = null;
    this.synthesisPicked = []; // selected purpose tokens

    // Stage 6 State: Author Studio
    this.studioFormat = "a poem";
    this.studioPurpose = "entertain";
    this.studioRecipient = "my best friend";
    this.launchedAirplanes = [];

    // DOM Elements Cache
    this.dom = {};
  }

  init() {
    this.cacheDom();
    this.renderStage1();
    this.renderStage2();
    this.renderStage3();
    this.renderStage4();
    this.renderStage5();
    this.renderStage6();
    this.bindGlobalEvents();
    this.switchStage(1);
    this.updateEnergy(10);
  }

  cacheDom() {
    this.dom.stageViews = document.querySelectorAll('.stage-view');
    this.dom.stageTabs = document.querySelectorAll('.stage-tab-btn');
    this.dom.energyBarFill = document.getElementById('energy-bar-fill');
    this.dom.energyPercentText = document.getElementById('energy-percent-text');
    this.dom.btnFullscreen = document.getElementById('btn-fullscreen');
    this.dom.btnReset = document.getElementById('btn-reset');
    this.dom.btnSoundscape = document.getElementById('btn-soundscape');
    this.dom.btnSfx = document.getElementById('btn-sfx');

    // Modals
    this.dom.goldenRuleModal = document.getElementById('golden-rule-modal');
    this.dom.victoryModal = document.getElementById('victory-modal');
  }

  bindGlobalEvents() {
    // Stage stepper tab clicks
    this.dom.stageTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const s = parseInt(tab.dataset.stage, 10);
        if (this.audio) this.audio.playWoodTileTap();
        this.switchStage(s);
      });
    });

    // Fullscreen toggle
    if (this.dom.btnFullscreen) {
      this.dom.btnFullscreen.addEventListener('click', () => {
        if (this.audio) this.audio.playWoodTileTap();
        this.toggleFullscreen();
      });
    }

    // Reset button
    if (this.dom.btnReset) {
      this.dom.btnReset.addEventListener('click', () => {
        if (this.audio) this.audio.playWoodTileTap();
        if (confirm("Reset current lesson progress?")) {
          window.location.reload();
        }
      });
    }

    // Soundscape switcher
    if (this.dom.btnSoundscape) {
      this.dom.btnSoundscape.addEventListener('click', () => {
        if (this.audio) this.audio.playWoodTileTap();
        this.cycleAmbientSoundscape();
      });
    }

    // SFX toggle
    if (this.dom.btnSfx) {
      this.dom.btnSfx.addEventListener('click', () => {
        if (this.audio) {
          this.audio.playWoodTileTap();
          this.audio.sfxMuted = !this.audio.sfxMuted;
          this.dom.btnSfx.classList.toggle('muted', this.audio.sfxMuted);
          this.dom.btnSfx.innerHTML = this.audio.sfxMuted ? '🔇 SFX Off' : '🔊 SFX On';
        }
      });
    }

    // Modal Close Corner handlers
    document.querySelectorAll('.modal-close-corner').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.audio) this.audio.playWoodTileTap();
        this.closeAllModals();
      });
    });

    // Keyboard Shortcuts (1-6 for stages, F for fullscreen)
    window.addEventListener('keydown', (e) => {
      if (e.key >= '1' && e.key <= '6') {
        this.switchStage(parseInt(e.key, 10));
      } else if (e.key.toLowerCase() === 'f') {
        this.toggleFullscreen();
      }
    });
  }

  cycleAmbientSoundscape() {
    if (!this.audio) return;
    const modes = ['forest-autumn', 'forest-winter', 'story-acoustic', 'off'];
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
        const labels = {
          'forest-autumn': '🍂 Autumn Forest',
          'forest-winter': '❄️ Winter Forest',
          'story-acoustic': '🕊️ Story Folk'
        };
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

    // Sync ambient channel to module
    if (this.audio && !this.audio.ambientMuted) {
      if (stageNum === 1 || stageNum === 2) {
        this.audio.playAmbient('forest-autumn');
      } else if (stageNum === 3) {
        this.audio.playAmbient('forest-winter');
      } else if (stageNum >= 4) {
        this.audio.playAmbient('story-acoustic');
      }
    }
  }

  updateEnergy(percent) {
    this.energyScore = Math.min(100, Math.max(0, percent));
    if (this.dom.energyBarFill) {
      this.dom.energyBarFill.style.width = `${this.energyScore}%`;
    }
    if (this.dom.energyPercentText) {
      this.dom.energyPercentText.textContent = `${this.energyScore}%`;
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
    if (this.dom.goldenRuleModal) this.dom.goldenRuleModal.classList.remove('active');
    if (this.dom.victoryModal) this.dom.victoryModal.classList.remove('active');
  }

  // =========================================================================
  // STAGE 1: BIOME SCANNER & TRUE/FALSE ARENA (Activity A)
  // =========================================================================

  renderStage1() {
    const grid = document.getElementById('stage-1-statements-grid');
    if (!grid) return;
    grid.innerHTML = '';

    FOREST_ADAPTATION_DATA.biomeStatements.forEach(stmt => {
      const card = document.createElement('div');
      card.className = 'statement-arena-card';
      card.id = `stmt-card-${stmt.id}`;

      card.innerHTML = `
        <div class="statement-text-row">
          <span class="statement-num-pill">#${stmt.number}</span>
          <p class="statement-prompt-text">${stmt.text}</p>
        </div>
        <div class="biome-choice-buttons-row">
          <button type="button" class="biome-tap-btn" data-stmt-id="${stmt.id}" data-biome="deciduous">
            <span>🍁</span> Deciduous Forests
          </button>
          <button type="button" class="biome-tap-btn" data-stmt-id="${stmt.id}" data-biome="coniferous">
            <span>🌲</span> Coniferous Forests
          </button>
        </div>
      `;

      grid.appendChild(card);
    });

    grid.querySelectorAll('.biome-tap-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const { stmtId, biome } = btn.dataset;
        this.handleBiomeChoice(stmtId, biome, btn);
      });
    });
  }

  handleBiomeChoice(stmtId, selectedBiome, btnElement) {
    const stmt = FOREST_ADAPTATION_DATA.biomeStatements.find(s => s.id === stmtId);
    if (!stmt) return;

    if (selectedBiome === stmt.correctBiome) {
      // Correct!
      if (this.audio) {
        this.audio.playCorrectMatch();
        this.audio.speak(stmt.explanation);
      }

      this.stage1Solved[stmtId] = true;
      const card = document.getElementById(`stmt-card-${stmtId}`);
      if (card) card.classList.add('solved');

      // Highlight button
      btnElement.classList.add('selected-correct');
      btnElement.innerHTML = `<span>✓</span> ${selectedBiome === 'deciduous' ? 'Deciduous' : 'Coniferous'} (${selectedBiome === 'deciduous' ? '🍁' : '🌲'})`;

      // Update energy bar
      const solvedCount = Object.keys(this.stage1Solved).length;
      this.updateEnergy(10 + solvedCount * 5);

      if (solvedCount === FOREST_ADAPTATION_DATA.biomeStatements.length) {
        this.showStage1UnlockBanner();
      }
    } else {
      // Soft-fail
      if (this.audio) {
        this.audio.playSoftWobble();
        this.audio.speak(`Not quite! Remember: ${selectedBiome === 'deciduous' ? 'Deciduous' : 'Coniferous'} trees have different leaves and seasons.`);
      }
      const card = document.getElementById(`stmt-card-${stmtId}`);
      if (card) {
        card.classList.add('shake-wobble');
        setTimeout(() => card.classList.remove('shake-wobble'), 400);
      }
    }
  }

  showStage1UnlockBanner() {
    const bannerBox = document.getElementById('stage-1-unlock-box');
    if (!bannerBox) return;
    bannerBox.style.display = 'block';
    bannerBox.innerHTML = `
      <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(56, 189, 248, 0.25)); border: 3px solid #10b981; border-radius: var(--radius-lg); padding: 20px 32px; display: flex; align-items: center; justify-content: space-between; margin-top: 20px; box-shadow: 0 0 35px rgba(16, 185, 129, 0.35);">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="font-size: 3rem;">🌲 🍁</div>
          <div>
            <h3 style="font-family: var(--font-display); font-size: 1.55rem; font-weight: 900; color: #ffffff; margin-bottom: 4px;">Biome Scanner Completed!</h3>
            <p style="color: #cbd5e1; font-size: 1.05rem;">You successfully analyzed the cold-adaptation strategies of both forests!</p>
          </div>
        </div>
        <button class="btn-tactile-3d btn-emerald" id="btn-next-stage2" style="font-size: 1.1rem; padding: 14px 28px;">
          Proceed to Winter Survival Match ➡️
        </button>
      </div>
    `;

    const nextBtn = document.getElementById('btn-next-stage2');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.audio) this.audio.playWoodTileTap();
        this.switchStage(2);
      });
    }
  }

  // =========================================================================
  // STAGE 2: WINTER SURVIVAL MATCH (Activity B)
  // =========================================================================

  renderStage2() {
    const orgCol = document.getElementById('survival-orgs-col');
    const targetCol = document.getElementById('survival-targets-col');
    if (!orgCol || !targetCol) return;

    orgCol.innerHTML = '';
    targetCol.innerHTML = '';

    FOREST_ADAPTATION_DATA.survivalOrganisms.forEach(org => {
      const card = document.createElement('div');
      card.className = 'survival-org-card';
      card.id = `org-${org.id}`;
      card.dataset.orgId = org.id;

      card.innerHTML = `
        <div class="survival-org-avatar" id="avatar-${org.id}">${org.icon}</div>
        <div>
          <h4 style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 900; color: #ffffff;">${org.name}</h4>
          <span style="font-size: 0.88rem; color: #94a3b8;">Tap to select organism</span>
        </div>
      `;

      card.addEventListener('click', () => {
        this.handleOrganismSelect(org.id);
      });

      orgCol.appendChild(card);
    });

    FOREST_ADAPTATION_DATA.survivalTargets.forEach(tgt => {
      const card = document.createElement('div');
      card.className = 'survival-target-card';
      card.id = `target-${tgt.id}`;
      card.dataset.targetId = tgt.id;

      card.innerHTML = `
        <div class="target-letter-circle">${tgt.letter}</div>
        <div style="font-size: 1.15rem; font-weight: 800; color: #f8fafc; line-height: 1.4;">
          ... ${tgt.text}
        </div>
      `;

      card.addEventListener('click', () => {
        this.handleTargetSelect(tgt.id);
      });

      targetCol.appendChild(card);
    });
  }

  handleOrganismSelect(orgId) {
    if (this.stage2Matched[orgId]) return; // already matched

    if (this.audio) this.audio.playWoodTileTap();
    this.selectedOrganism = orgId;

    document.querySelectorAll('.survival-org-card').forEach(c => {
      c.classList.toggle('selected', c.dataset.orgId === orgId);
    });
  }

  handleTargetSelect(targetId) {
    if (!this.selectedOrganism) {
      if (this.audio) this.audio.playSoftWobble();
      if (this.audio) this.audio.speak("Select an organism on the left first!");
      return;
    }

    const org = FOREST_ADAPTATION_DATA.survivalOrganisms.find(o => o.id === this.selectedOrganism);
    const target = FOREST_ADAPTATION_DATA.survivalTargets.find(t => t.id === targetId);
    if (!org || !target) return;

    if (org.targetId === targetId) {
      // Correct match!
      this.stage2Matched[org.id] = targetId;

      // Play special animal SFX
      if (this.audio) {
        if (org.id === 'org-bears') {
          this.audio.playBearSnore();
        } else if (org.id === 'org-hares') {
          this.audio.playHareMorph();
        } else {
          this.audio.playCorrectMatch();
        }
        this.audio.speak(org.actionFeedback);
      }

      // Visual updates
      const orgCard = document.getElementById(`org-${org.id}`);
      const targetCard = document.getElementById(`target-${targetId}`);
      if (orgCard) {
        orgCard.classList.remove('selected');
        orgCard.classList.add('matched');
      }
      if (targetCard) {
        targetCard.classList.add('matched');
      }

      // Animal sprite animations
      if (org.id === 'org-bears') {
        const avatar = document.getElementById('avatar-org-bears');
        if (avatar) avatar.innerHTML = '💤 🐻';
      } else if (org.id === 'org-hares') {
        const avatar = document.getElementById('avatar-org-hares');
        if (avatar) avatar.innerHTML = '❄️ 🐇'; // white winter hare
      }

      this.selectedOrganism = null;

      // Update energy
      const matchCount = Object.keys(this.stage2Matched).length;
      this.updateEnergy(40 + matchCount * 8);

      if (matchCount === FOREST_ADAPTATION_DATA.survivalOrganisms.length) {
        this.showStage2UnlockBanner();
      }
    } else {
      // Soft fail
      if (this.audio) {
        this.audio.playSoftWobble();
        this.audio.speak(`Does ${org.name} really ${target.text}? Think about its winter armor!`);
      }
      const targetCard = document.getElementById(`target-${targetId}`);
      if (targetCard) {
        targetCard.classList.add('shake-wobble');
        setTimeout(() => targetCard.classList.remove('shake-wobble'), 400);
      }
    }
  }

  showStage2UnlockBanner() {
    const bannerBox = document.getElementById('stage-2-unlock-box');
    if (!bannerBox) return;
    bannerBox.style.display = 'block';
    bannerBox.innerHTML = `
      <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(16, 185, 129, 0.25)); border: 3px solid #f59e0b; border-radius: var(--radius-lg); padding: 20px 32px; display: flex; align-items: center; justify-content: space-between; margin-top: 20px; box-shadow: 0 0 35px rgba(245, 158, 11, 0.35);">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="font-size: 3rem;">🐻 🐇</div>
          <div>
            <h3 style="font-family: var(--font-display); font-size: 1.55rem; font-weight: 900; color: #ffffff; margin-bottom: 4px;">Winter Survival Mastery!</h3>
            <p style="color: #cbd5e1; font-size: 1.05rem;">Bears are snoozing, hares are snow-white, and conifers stand tall in winter.</p>
          </div>
        </div>
        <button class="btn-tactile-3d btn-gold" id="btn-next-stage3" style="font-size: 1.1rem; padding: 14px 28px;">
          Enter 4-Season Human Adaptation Grid ➡️
        </button>
      </div>
    `;

    const nextBtn = document.getElementById('btn-next-stage3');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.audio) this.audio.playWoodTileTap();
        this.switchStage(3);
      });
    }
  }

  // =========================================================================
  // STAGE 3: THE 4-SEASON HUMAN ADAPTATION MATRIX (Activity C)
  // =========================================================================

  renderStage3() {
    const shelf = document.getElementById('adaptation-items-shelf');
    if (!shelf) return;
    shelf.innerHTML = '';

    FOREST_ADAPTATION_DATA.seasonalAdaptations.items.forEach(item => {
      const chip = document.createElement('div');
      chip.className = 'item-draggable-chip';
      chip.id = `item-chip-${item.id}`;
      chip.dataset.itemId = item.id;
      chip.setAttribute('draggable', 'true');
      chip.innerHTML = `<span>${item.icon}</span> <span>${item.name}</span>`;

      chip.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', item.id);
      });

      chip.addEventListener('click', () => {
        this.handleSeasonItemTapSelect(item.id);
      });

      shelf.appendChild(chip);
    });

    // Wire Up 4 Season Quadrants
    FOREST_ADAPTATION_DATA.seasonalAdaptations.seasons.forEach(season => {
      const box = document.getElementById(`quadrant-${season.id}`);
      if (!box) return;

      box.addEventListener('dragover', (e) => {
        e.preventDefault();
        box.classList.add('drag-over');
      });

      box.addEventListener('dragleave', () => {
        box.classList.remove('drag-over');
      });

      box.addEventListener('drop', (e) => {
        e.preventDefault();
        box.classList.remove('drag-over');
        const itemId = e.dataTransfer.getData('text/plain');
        if (itemId) this.handleSeasonItemDrop(itemId, season.id);
      });

      box.addEventListener('click', () => {
        if (this.activeSelectedSeasonItem) {
          this.handleSeasonItemDrop(this.activeSelectedSeasonItem, season.id);
        }
      });
    });
  }

  handleSeasonItemTapSelect(itemId) {
    if (this.audio) this.audio.playWoodTileTap();
    if (this.activeSelectedSeasonItem === itemId) {
      this.activeSelectedSeasonItem = null;
      document.querySelectorAll('.item-draggable-chip').forEach(c => c.style.outline = 'none');
    } else {
      this.activeSelectedSeasonItem = itemId;
      document.querySelectorAll('.item-draggable-chip').forEach(c => {
        c.style.outline = c.dataset.itemId === itemId ? '3px solid #38bdf8' : 'none';
      });
    }
  }

  handleSeasonItemDrop(itemId, targetSeasonId) {
    const item = FOREST_ADAPTATION_DATA.seasonalAdaptations.items.find(i => i.id === itemId);
    if (!item) return;

    if (item.season === targetSeasonId) {
      // Correct!
      this.seasonPlacements[itemId] = targetSeasonId;
      if (this.audio) {
        this.audio.playCorrectMatch();
        this.audio.speak(`In ${targetSeasonId}, I adapt by using ${item.name}!`);
      }

      // Add to quadrant tray
      const tray = document.getElementById(`tray-${targetSeasonId}`);
      if (tray) {
        const placed = document.createElement('div');
        placed.style.background = 'rgba(255, 255, 255, 0.12)';
        placed.style.padding = '6px 14px';
        placed.style.borderRadius = 'var(--radius-pill)';
        placed.style.fontSize = '0.95rem';
        placed.style.fontWeight = '800';
        placed.style.display = 'inline-flex';
        placed.style.alignItems = 'center';
        placed.style.gap = '6px';
        placed.innerHTML = `<span>${item.icon}</span> <span>${item.name}</span> ✓`;
        tray.appendChild(placed);
      }

      // Mark chip as placed
      const chip = document.getElementById(`item-chip-${itemId}`);
      if (chip) {
        chip.classList.add('placed');
        chip.setAttribute('draggable', 'false');
      }

      this.activeSelectedSeasonItem = null;
      document.querySelectorAll('.item-draggable-chip').forEach(c => c.style.outline = 'none');

      // Update spoken sentence frame display
      const frameResult = document.getElementById('season-sentence-live');
      if (frameResult) {
        frameResult.textContent = `"In ${targetSeasonId}, I adapt by using ${item.name}."`;
      }

      const placedTotal = Object.keys(this.seasonPlacements).length;
      this.updateEnergy(70 + Math.floor((placedTotal / FOREST_ADAPTATION_DATA.seasonalAdaptations.items.length) * 15));

      if (placedTotal === FOREST_ADAPTATION_DATA.seasonalAdaptations.items.length) {
        this.showStage3UnlockBanner();
      }
    } else {
      // Soft-fail
      if (this.audio) {
        this.audio.playSoftWobble();
        this.audio.speak(`Do we use ${item.name} in ${targetSeasonId}? Think about the weather!`);
      }
      const box = document.getElementById(`quadrant-${targetSeasonId}`);
      if (box) {
        box.classList.add('shake-wobble');
        setTimeout(() => box.classList.remove('shake-wobble'), 400);
      }
    }
  }

  showStage3UnlockBanner() {
    const bannerBox = document.getElementById('stage-3-unlock-box');
    if (!bannerBox) return;
    bannerBox.style.display = 'block';
    bannerBox.innerHTML = `
      <div style="background: linear-gradient(135deg, rgba(236, 72, 153, 0.25), rgba(56, 189, 248, 0.25)); border: 3px solid #ec4899; border-radius: var(--radius-lg); padding: 20px 32px; display: flex; align-items: center; justify-content: space-between; margin-top: 20px; box-shadow: 0 0 35px rgba(236, 72, 153, 0.35);">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="font-size: 3rem;">🌟 📖</div>
          <div>
            <h3 style="font-family: var(--font-display); font-size: 1.55rem; font-weight: 900; color: #ffffff; margin-bottom: 4px;">Module 1 Complete! Enter Module 2</h3>
            <p style="color: #cbd5e1; font-size: 1.05rem;">Next: The Detective's Lens — Decoding Author's Purpose!</p>
          </div>
        </div>
        <button class="btn-tactile-3d btn-pink" id="btn-next-stage4" style="font-size: 1.1rem; padding: 14px 28px;">
          Enter Alice's Portal & Purpose Wheel ➡️
        </button>
      </div>
    `;

    const nextBtn = document.getElementById('btn-next-stage4');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.audio) this.audio.playWoodTileTap();
        this.switchStage(4);
      });
    }
  }

  // =========================================================================
  // STAGE 4: ALICE'S PORTAL & PURPOSE WHEEL (Activity A)
  // =========================================================================

  renderStage4() {
    const optsContainer = document.getElementById('alice-options-cluster');
    if (!optsContainer) return;
    optsContainer.innerHTML = '';

    FOREST_ADAPTATION_DATA.aliceWarmup.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-tactile-3d btn-ghost';
      btn.style.width = '100%';
      btn.style.padding = '14px 20px';
      btn.style.fontSize = '1.15rem';
      btn.style.textAlign = 'left';
      btn.style.justifyContent = 'flex-start';
      btn.dataset.optId = opt.id;
      btn.innerHTML = `<span>✨</span> ${opt.text}`;

      btn.addEventListener('click', () => {
        this.handleAliceChoice(opt);
      });

      optsContainer.appendChild(btn);
    });

    // Golden Rule Button
    const btnShowRule = document.getElementById('btn-view-golden-rule');
    if (btnShowRule) {
      btnShowRule.addEventListener('click', () => {
        if (this.audio) this.audio.playWoodTileTap();
        this.openGoldenRuleModal();
      });
    }
  }

  handleAliceChoice(option) {
    if (option.correct) {
      if (this.audio) {
        this.audio.playCorrectMatch();
        this.audio.speak("Correct! Lewis Carroll wrote Alice's Adventures to entertain and help readers have fun!");
      }
      this.aliceSolved = true;
      this.openGoldenRuleModal();
      this.showStage4UnlockBanner();
    } else {
      if (this.audio) {
        this.audio.playSoftWobble();
        this.audio.speak("Think again! Is Alice's Adventures a science textbook, or a fun story?");
      }
    }
  }

  openGoldenRuleModal() {
    if (!this.dom.goldenRuleModal) return;
    this.dom.goldenRuleModal.classList.add('active');
  }

  showStage4UnlockBanner() {
    const bannerBox = document.getElementById('stage-4-unlock-box');
    if (!bannerBox) return;
    bannerBox.style.display = 'block';
    bannerBox.innerHTML = `
      <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(56, 189, 248, 0.25)); border: 3px solid #10b981; border-radius: var(--radius-lg); padding: 18px 28px; display: flex; align-items: center; justify-content: space-between; margin-top: 18px;">
        <div>
          <h3 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 900; color: #ffffff;">Golden Rule Unlocked!</h3>
          <p style="color: #cbd5e1; font-size: 0.95rem;">"Authors write to TEACH, PERSUADE, or ENTERTAIN."</p>
        </div>
        <button class="btn-tactile-3d btn-emerald" id="btn-next-stage5" style="padding: 12px 24px;">
          Next: 'A New Friend' Case File ➡️
        </button>
      </div>
    `;

    const nextBtn = document.getElementById('btn-next-stage5');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.audio) this.audio.playWoodTileTap();
        this.closeAllModals();
        this.switchStage(5);
      });
    }
  }

  // =========================================================================
  // STAGE 5: "A NEW FRIEND" STORY TEASER & CASE FILE (Activity B)
  // =========================================================================

  renderStage5() {
    // Render Karaoke Words
    const textBox = document.getElementById('story-karaoke-text');
    if (textBox) {
      textBox.innerHTML = FOREST_ADAPTATION_DATA.storyTeaser.audioWords.map((w, idx) => `
        <span class="karaoke-word" id="word-${idx}">${w}</span>
      `).join(' ');
    }

    // Audio Read-Aloud Button
    const btnReadAloud = document.getElementById('btn-story-read-aloud');
    if (btnReadAloud) {
      btnReadAloud.addEventListener('click', () => {
        this.playKaraokeReadAloud();
      });
    }

    // Render Verdict Questions
    const questionsContainer = document.getElementById('verdict-questions-container');
    if (questionsContainer) {
      questionsContainer.innerHTML = '';
      FOREST_ADAPTATION_DATA.storyTeaser.verdictQuestions.forEach(q => {
        const qBox = document.createElement('div');
        qBox.className = 'verdict-question-box';
        qBox.id = `q-box-${q.id}`;

        qBox.innerHTML = `
          <p style="font-size: 1.05rem; font-weight: 800; color: #ffffff; margin-bottom: 8px;">${q.prompt}</p>
          <div class="yes-no-toggle-pair">
            <button type="button" class="toggle-choice-btn" data-q-id="${q.id}" data-val="yes">YES</button>
            <button type="button" class="toggle-choice-btn" data-q-id="${q.id}" data-val="no">NO</button>
          </div>
          <div class="verdict-feedback-text" id="fb-${q.id}" style="display: none; margin-top: 8px; font-size: 0.88rem; color: #34d399; font-weight: 700;"></div>
        `;

        questionsContainer.appendChild(qBox);
      });

      questionsContainer.querySelectorAll('.toggle-choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const { qId, val } = btn.dataset;
          this.handleVerdictAnswer(qId, val === 'yes');
        });
      });
    }

    // Synthesis Token Buttons
    const tokensContainer = document.getElementById('synthesis-tokens-cluster');
    if (tokensContainer) {
      tokensContainer.innerHTML = '';
      FOREST_ADAPTATION_DATA.storyTeaser.synthesisFrame.availableTokens.forEach(tok => {
        const tBtn = document.createElement('button');
        tBtn.type = 'button';
        tBtn.className = 'btn-tactile-3d btn-ghost';
        tBtn.style.padding = '8px 16px';
        tBtn.style.fontSize = '0.95rem';
        tBtn.textContent = tok;

        tBtn.addEventListener('click', () => {
          this.handleSynthesisTokenClick(tok, tBtn);
        });

        tokensContainer.appendChild(tBtn);
      });
    }
  }

  playKaraokeReadAloud() {
    if (this.audio) {
      this.audio.playWingFlap();
      this.audio.speak(FOREST_ADAPTATION_DATA.storyTeaser.textFull);
    }

    // Simulated word-by-word karaoke highlight
    if (this.storyKaraokeInterval) clearInterval(this.storyKaraokeInterval);
    const words = FOREST_ADAPTATION_DATA.storyTeaser.audioWords;
    let currentIdx = 0;

    document.querySelectorAll('.karaoke-word').forEach(w => w.classList.remove('highlighted'));

    this.storyKaraokeInterval = setInterval(() => {
      if (currentIdx >= words.length) {
        clearInterval(this.storyKaraokeInterval);
        return;
      }
      document.querySelectorAll('.karaoke-word').forEach(w => w.classList.remove('highlighted'));
      const activeWord = document.getElementById(`word-${currentIdx}`);
      if (activeWord) activeWord.classList.add('highlighted');
      currentIdx++;
    }, 280);
  }

  handleVerdictAnswer(qId, isYes) {
    if (this.audio) this.audio.playWoodTileTap();
    const q = FOREST_ADAPTATION_DATA.storyTeaser.verdictQuestions.find(item => item.id === qId);
    if (!q) return;

    const qBox = document.getElementById(`q-box-${qId}`);
    if (!qBox) return;

    const yesBtn = qBox.querySelector('[data-val="yes"]');
    const noBtn = qBox.querySelector('[data-val="no"]');
    if (yesBtn) yesBtn.classList.toggle('selected-yes', isYes);
    if (noBtn) noBtn.classList.toggle('selected-no', !isYes);

    if (isYes === q.correctYes) {
      // Correct verdict!
      if (this.audio) {
        this.audio.playCorrectMatch();
        this.audio.speak(q.feedback);
      }
      this.storyVerdictAnswers[qId] = true;

      const fb = document.getElementById(`fb-${qId}`);
      if (fb) {
        fb.style.display = 'block';
        fb.textContent = q.feedback;
      }

      this.checkStage5Completion();
    } else {
      if (this.audio) {
        this.audio.playSoftWobble();
        this.audio.speak("Think about the story! Is the author doing that, or something else?");
      }
    }
  }

  handleSynthesisTokenClick(token, btn) {
    if (this.audio) this.audio.playWoodTileTap();
    if (!this.synthesisPicked.includes(token)) {
      this.synthesisPicked.push(token);
      btn.style.borderColor = '#10b981';
      btn.style.color = '#34d399';
    }

    const slot1 = document.getElementById('synth-slot-1');
    const slot2 = document.getElementById('synth-slot-2');
    if (slot1 && this.synthesisPicked[0]) slot1.textContent = this.synthesisPicked[0];
    if (slot2 && this.synthesisPicked[1]) slot2.textContent = this.synthesisPicked[1];

    if (this.synthesisPicked.includes('entertain') && this.synthesisPicked.includes('teach')) {
      if (this.audio) {
        this.audio.playCorrectMatch();
        this.audio.speak("I think the author's purpose is to entertain and teach! Outstanding analysis!");
      }
      this.checkStage5Completion();
    }
  }

  checkStage5Completion() {
    const verdictAllDone = Object.keys(this.storyVerdictAnswers).length === 3;
    const synthDone = this.synthesisPicked.includes('entertain') && this.synthesisPicked.includes('teach');

    if (verdictAllDone && synthDone) {
      this.updateEnergy(90);
      const banner = document.getElementById('stage-5-unlock-box');
      if (banner) {
        banner.style.display = 'block';
        banner.innerHTML = `
          <div style="background: linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(16, 185, 129, 0.25)); border: 3px solid #38bdf8; border-radius: var(--radius-lg); padding: 18px 28px; display: flex; align-items: center; justify-content: space-between; margin-top: 18px;">
            <div>
              <h3 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 900; color: #ffffff;">Detective Case Solved!</h3>
              <p style="color: #cbd5e1; font-size: 0.95rem;">You decoded the author's dual purpose: To Entertain &amp; To Teach!</p>
            </div>
            <button class="btn-tactile-3d btn-cyan" id="btn-next-stage6" style="padding: 12px 24px;">
              Enter Young Author's Speech Studio ➡️
            </button>
          </div>
        `;

        const nextBtn = document.getElementById('btn-next-stage6');
        if (nextBtn) {
          nextBtn.addEventListener('click', () => {
            if (this.audio) this.audio.playWoodTileTap();
            this.switchStage(6);
          });
        }
      }
    }
  }

  // =========================================================================
  // STAGE 6: THE YOUNG AUTHOR'S SPEECH STUDIO (Activity C)
  // =========================================================================

  renderStage6() {
    // Format Chips
    const formatsContainer = document.getElementById('studio-formats-cluster');
    if (formatsContainer) {
      formatsContainer.innerHTML = '';
      FOREST_ADAPTATION_DATA.authorStudio.formats.forEach(fmt => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn-tactile-3d btn-ghost';
        b.style.padding = '8px 16px';
        b.style.fontSize = '0.95rem';
        b.textContent = fmt;
        b.addEventListener('click', () => {
          if (this.audio) this.audio.playWoodTileTap();
          this.studioFormat = fmt;
          formatsContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('active-choice'));
          b.classList.add('active-choice');
          this.updateStudioSentenceLive();
        });
        formatsContainer.appendChild(b);
      });
    }

    // Purpose Chips
    const purposesContainer = document.getElementById('studio-purposes-cluster');
    if (purposesContainer) {
      purposesContainer.innerHTML = '';
      FOREST_ADAPTATION_DATA.authorStudio.purposes.forEach(purp => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn-tactile-3d btn-ghost';
        b.style.padding = '8px 16px';
        b.style.fontSize = '0.95rem';
        b.innerHTML = `<span>${purp.icon}</span> ${purp.value}`;
        b.addEventListener('click', () => {
          if (this.audio) this.audio.playWoodTileTap();
          this.studioPurpose = purp.value;
          purposesContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('active-choice'));
          b.classList.add('active-choice');
          this.updateStudioSentenceLive();
        });
        purposesContainer.appendChild(b);
      });
    }

    // Recipient Chips
    const recipientsContainer = document.getElementById('studio-recipients-cluster');
    if (recipientsContainer) {
      recipientsContainer.innerHTML = '';
      FOREST_ADAPTATION_DATA.authorStudio.recipients.forEach(rec => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn-tactile-3d btn-ghost';
        b.style.padding = '8px 16px';
        b.style.fontSize = '0.95rem';
        b.textContent = rec;
        b.addEventListener('click', () => {
          if (this.audio) this.audio.playWoodTileTap();
          this.studioRecipient = rec;
          recipientsContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('active-choice'));
          b.classList.add('active-choice');
          this.updateStudioSentenceLive();
        });
        recipientsContainer.appendChild(b);
      });
    }

    // Launch Paper Airplane Button
    const btnLaunch = document.getElementById('btn-launch-airplane');
    if (btnLaunch) {
      btnLaunch.addEventListener('click', () => {
        this.launchPaperAirplane();
      });
    }

    // Class Celebration Button
    const btnCelebration = document.getElementById('btn-class-celebrate');
    if (btnCelebration) {
      btnCelebration.addEventListener('click', () => {
        if (this.audio) this.audio.playClassVictory();
        if (this.dom.victoryModal) this.dom.victoryModal.classList.add('active');
      });
    }

    this.updateStudioSentenceLive();
  }

  updateStudioSentenceLive() {
    const liveBox = document.getElementById('studio-sentence-live');
    if (liveBox) {
      liveBox.textContent = `"I wrote ${this.studioFormat} to ${this.studioPurpose} ${this.studioRecipient}."`;
    }
  }

  launchPaperAirplane() {
    if (this.audio) {
      this.audio.playAirplaneWhoosh();
      this.audio.speak(`I wrote ${this.studioFormat} to ${this.studioPurpose} ${this.studioRecipient}!`);
    }

    const vault = document.getElementById('airplane-vault-stage');
    if (!vault) return;

    const plane = document.createElement('div');
    plane.className = 'flying-airplane';
    plane.innerHTML = `✈️ ${this.studioFormat}`;
    vault.appendChild(plane);

    setTimeout(() => plane.remove(), 5500);

    // Add badge into the Vault Board
    const board = document.getElementById('authors-vault-badges');
    if (board) {
      const badge = document.createElement('div');
      badge.style.background = 'rgba(255, 255, 255, 0.12)';
      badge.style.border = '1.5px solid rgba(255, 255, 255, 0.25)';
      badge.style.borderRadius = 'var(--radius-pill)';
      badge.style.padding = '8px 16px';
      badge.style.fontSize = '0.9rem';
      badge.style.fontWeight = '800';
      badge.style.color = '#fbbf24';
      badge.innerHTML = `<span>✈️</span> Wrote <em>${this.studioFormat}</em> to <strong>${this.studioPurpose}</strong> ${this.studioRecipient}!`;
      board.prepend(badge);
    }

    this.updateEnergy(100);
  }
}

// Global initialization upon DOM ready
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    window.forestApp = new ForestAdaptationApp();
    window.forestApp.init();
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ForestAdaptationApp;
}
