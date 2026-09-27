/**
 * TWIN GATES: THE MAGIC DOOR ADVENTURE (A1 MASTER ARC)
 * Reactive State Controller & 5-Chamber Colossal Gate Engine
 * Primary ESL / CEFR A1 | 35-Minute Interactive Arcade Loop • Total XP: 150
 */

(function(root) {
  'use strict';

  // =========================================================================
  // REACTIVE PLAYER SESSION STATE
  // =========================================================================
  const playerSession = {
    currentChamber: 1,
    chosenBranch: 'ice', // 'ice' or 'fire'
    selectedTool: null,   // 'torch' or 'shield'
    inventory: {
      torch: false,
      shield: false,
      berry: false,
      key: false
    },
    xp: 0,
    chamber1Solved: false,
    chamber2Solved: false,
    chamber3Solved: false,
    chamber4Solved: false,
    rockStepIndex: 0,
    isOpeningDoor: false,
    isKaraokeRunning: false
  };

  // =========================================================================
  // CONFETTI CELEBRATION ENGINE
  // =========================================================================
  const ConfettiEngine = {
    canvas: null,
    ctx: null,
    particles: [],
    animId: null,

    init() {
      this.canvas = document.getElementById('confettiCanvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
    },

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    burst(count = 100) {
      if (!this.canvas || !this.ctx) this.init();
      if (!this.canvas || !this.ctx) return;

      const colors = ['#38bdf8', '#f59e0b', '#10b981', '#fbbf24', '#f43f5e', '#a855f7', '#ffffff'];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: this.canvas.width / 2 + (Math.random() * 260 - 130),
          y: this.canvas.height * 0.42 + (Math.random() * 80 - 40),
          vx: (Math.random() - 0.5) * 15,
          vy: Math.random() * -12 - 4,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 10,
          opacity: 1,
          decay: Math.random() * 0.015 + 0.008
        });
      }

      if (!this.animId) {
        this.render();
      }
    },

    render() {
      if (!this.ctx || !this.canvas) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.rotation += p.rotSpeed;
        p.opacity -= p.decay;

        if (p.opacity <= 0 || p.y > this.canvas.height + 20) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = Math.max(0, p.opacity);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        this.animId = requestAnimationFrame(() => this.render());
      } else {
        this.animId = null;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  };

  // =========================================================================
  // HUD & XP HELPERS
  // =========================================================================
  function addXP(amount) {
    playerSession.xp += amount;
    if (playerSession.xp > 150) playerSession.xp = 150;
    updateHUD();

    if (typeof root.AdventureAcademy !== 'undefined' && typeof root.AdventureAcademy.awardXP === 'function') {
      root.AdventureAcademy.awardXP(amount);
    } else if (typeof root.schoolStore !== 'undefined' && typeof root.schoolStore.addXP === 'function') {
      root.schoolStore.addXP(amount);
    }
  }

  function updateHUD() {
    const xpEl = document.getElementById('hudXP');
    if (xpEl) xpEl.textContent = `⭐ +${playerSession.xp} XP`;

    // Chamber tracker dots
    const chamberText = document.getElementById('hudChamberText');
    if (chamberText) chamberText.textContent = `Chamber ${playerSession.currentChamber} of 5`;

    for (let i = 1; i <= 5; i++) {
      const dot = document.getElementById(`dot${i}`);
      if (dot) {
        dot.classList.toggle('is-passed', i < playerSession.currentChamber);
        dot.classList.toggle('is-active', i === playerSession.currentChamber);
      }
    }

    // Inventory Slots
    const slotTorch = document.getElementById('slotTorch');
    const slotShield = document.getElementById('slotShield');
    const slotBerry = document.getElementById('slotBerry');
    const slotKey = document.getElementById('slotKey');

    if (slotTorch) slotTorch.classList.toggle('is-filled', !!playerSession.inventory.torch);
    if (slotShield) slotShield.classList.toggle('is-filled', !!playerSession.inventory.shield);
    if (slotBerry) slotBerry.classList.toggle('is-filled', !!playerSession.inventory.berry);
    if (slotKey) slotKey.classList.toggle('is-filled', !!playerSession.inventory.key);
  }

  function toggleMuteAudio() {
    if (!root.TwinGatesAudio) return;
    const isMuted = root.TwinGatesAudio.toggleMute();
    const btn = document.getElementById('btnMuteToggle');
    if (btn) {
      btn.textContent = isMuted ? '🔇 Muted' : '🔊 Sound';
      btn.style.borderColor = isMuted ? '#ef4444' : '#38bdf8';
    }
  }

  // =========================================================================
  // CHAMBER 1: TOOL SELECTION & DOOR INTERACTION
  // =========================================================================
  function playEntranceClue(type) {
    if (!root.TwinGatesAudio) return;
    const prompter = document.getElementById('karaokeTextChamber1');

    if (type === 'wind') {
      root.TwinGatesAudio.playIceWind();
      if (prompter) prompter.textContent = '❄️ "It is cold ice behind the left door!"';
      root.TwinGatesAudio.speak("It is cold ice behind the left door!");
    } else if (type === 'fire') {
      root.TwinGatesAudio.playFireCrack();
      if (prompter) prompter.textContent = '🔥 "It is hot fire behind the right door!"';
      root.TwinGatesAudio.speak("It is hot fire behind the right door!");
    }
  }

  function selectTool(tool) {
    playerSession.selectedTool = tool;
    const btnTorch = document.getElementById('toolBtnTorch');
    const btnShield = document.getElementById('toolBtnShield');

    if (tool === 'torch') {
      playerSession.inventory.torch = true;
      if (btnTorch) btnTorch.classList.add('is-selected');
      if (btnShield) btnShield.classList.remove('is-selected');
      root.TwinGatesAudio.playSnap();
      root.TwinGatesAudio.speak("Fire torch selected! Torch melts cold ice.");
    } else if (tool === 'shield') {
      playerSession.inventory.shield = true;
      if (btnShield) btnShield.classList.add('is-selected');
      if (btnTorch) btnTorch.classList.remove('is-selected');
      root.TwinGatesAudio.playSnap();
      root.TwinGatesAudio.speak("Fire shield selected! Shield blocks hot fire.");
    }
    updateHUD();
  }

  function chooseDoor(doorSide, chamberNum) {
    if (playerSession.isOpeningDoor) return;

    if (chamberNum === 1) {
      // Validate tool
      if (!playerSession.selectedTool) {
        root.TwinGatesAudio.playSoftFail();
        root.TwinGatesAudio.speak("Pick a tool first! Choose Torch or Shield.");
        return;
      }

      if (doorSide === 'left' && playerSession.selectedTool !== 'torch') {
        root.TwinGatesAudio.playSoftFail();
        root.TwinGatesAudio.speak("It is cold ice! I need a torch to melt the ice.");
        return;
      }

      if (doorSide === 'right' && playerSession.selectedTool !== 'shield') {
        root.TwinGatesAudio.playSoftFail();
        root.TwinGatesAudio.speak("It is hot fire! I need a shield to block the fire.");
        return;
      }

      // Success opening door
      playerSession.isOpeningDoor = true;
      playerSession.chamber1Solved = true;
      playerSession.chosenBranch = doorSide === 'left' ? 'ice' : 'fire';
      addXP(30);

      const card = doorSide === 'left' ? document.getElementById('gateCard1Left') : document.getElementById('gateCard1Right');
      if (card) card.classList.add('opened');

      root.TwinGatesAudio.playDoorCreak();
      setTimeout(() => root.TwinGatesAudio.playXP(), 220);

      setTimeout(() => {
        transitionToChamber(2);
        playerSession.isOpeningDoor = false;
      }, 800);

    } else if (chamberNum === 2) {
      // Chamber 2 dynamic door choice
      playerSession.isOpeningDoor = true;
      const card = document.getElementById(`gateCard2_${doorSide}`);
      if (card) card.classList.add('opened');

      root.TwinGatesAudio.playDoorCreak();
      setTimeout(() => root.TwinGatesAudio.playXP(), 220);

      setTimeout(() => {
        transitionToChamber(3);
        playerSession.isOpeningDoor = false;
      }, 800);

    } else if (chamberNum === 3) {
      // Chamber 3 dynamic door choice
      playerSession.isOpeningDoor = true;
      const card = document.getElementById(`gateCard3_${doorSide}`);
      if (card) card.classList.add('opened');

      root.TwinGatesAudio.playDoorCreak();
      setTimeout(() => root.TwinGatesAudio.playXP(), 220);

      setTimeout(() => {
        transitionToChamber(4);
        playerSession.isOpeningDoor = false;
      }, 800);
    }
  }

  // =========================================================================
  // CHAMBER ROUTING
  // =========================================================================
  function transitionToChamber(nextChamberNum) {
    playerSession.currentChamber = nextChamberNum;

    for (let i = 1; i <= 5; i++) {
      const view = document.getElementById(`chamberPhase${i}`);
      if (view) {
        view.classList.toggle('is-visible', i === nextChamberNum);
      }
    }

    updateHUD();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (nextChamberNum === 2) {
      setupChamber2();
    } else if (nextChamberNum === 3) {
      setupChamber3();
    } else if (nextChamberNum === 4) {
      setupChamber4();
    } else if (nextChamberNum === 5) {
      setupChamber5();
    }
  }

  // =========================================================================
  // CHAMBER 2: CREATURE CAVE (YETI OR BABY DRAGON)
  // =========================================================================
  function setupChamber2() {
    const isIce = playerSession.chosenBranch === 'ice';
    const titleEl = document.getElementById('chamber2Title');
    const descEl = document.getElementById('chamber2Desc');
    const prompterEl = document.getElementById('karaokeTextChamber2');
    const imgEl = document.getElementById('chamber2CreatureImg');
    const nameEl = document.getElementById('chamber2CreatureName');
    const formulaEl = document.getElementById('chamber2Formula');
    const pedestal = document.getElementById('chamber2Pedestal');

    if (isIce) {
      if (titleEl) titleEl.innerHTML = '<span>🐾</span> Chamber 2: The Yeti Cave';
      if (descEl) descEl.textContent = 'A fluffy Yeti is here! Give the yeti a sweet berry (+30 XP)!';
      if (prompterEl) prompterEl.textContent = '"A fluffy Yeti is here! Give the yeti a sweet berry."';
      if (imgEl) imgEl.src = 'assets/yeti_companion.webp';
      if (nameEl) nameEl.textContent = 'Fluffy Yeti';
      if (formulaEl) formulaEl.textContent = '"I need a berry to feed the yeti."';
      if (pedestal) pedestal.style.setProperty('--gate-glow', '#38bdf8');
      root.TwinGatesAudio.speak("A fluffy Yeti is here! Give the yeti a sweet berry.");
    } else {
      if (titleEl) titleEl.innerHTML = '<span>🐉</span> Chamber 2: The Dragon Lair';
      if (descEl) descEl.textContent = 'A cute Baby Dragon is here! Give the dragon a sweet berry (+30 XP)!';
      if (prompterEl) prompterEl.textContent = '"A cute Baby Dragon is here! Give the dragon a sweet berry."';
      if (imgEl) imgEl.src = 'assets/baby_dragon.webp';
      if (nameEl) nameEl.textContent = 'Baby Fire Dragon';
      if (formulaEl) formulaEl.textContent = '"I need a berry to feed the dragon."';
      if (pedestal) pedestal.style.setProperty('--gate-glow', '#f59e0b');
      root.TwinGatesAudio.speak("A cute Baby Dragon is here! Give the dragon a sweet berry.");
    }
  }

  function handleGiveBerry() {
    if (playerSession.chamber2Solved) return;
    playerSession.chamber2Solved = true;
    playerSession.inventory.berry = true;
    addXP(30);

    root.TwinGatesAudio.playSnap();
    setTimeout(() => root.TwinGatesAudio.playXP(), 180);

    const sealBox = document.getElementById('chamber2Seal');
    if (sealBox) {
      sealBox.innerHTML = '<span class="rubber-stamp-seal">❤️ Friend Made!</span>';
    }

    const btn = document.getElementById('btnGiveBerry');
    if (btn) {
      btn.disabled = true;
      btn.style.opacity = '0.6';
      btn.innerHTML = '<span>✓ Magic Berry Given!</span>';
    }

    renderChamber2Doors();
    root.TwinGatesAudio.speak("The creature is happy! Choose the stone gate or cloud gate to go forward.");
  }

  function renderChamber2Doors() {
    const arena = document.getElementById('chamber2DoorsArena');
    if (!arena) return;

    arena.innerHTML = `
      <!-- Left Door: Stone Gate -->
      <div class="gate-card-wrapper left-gate" id="gateCard2_left" onclick="chooseDoor('left', 2)" style="--gate-glow:#10b981;">
        <div class="gate-clue-badge" style="--gate-glow:#10b981;">
          <span class="badge-icon">🪨</span>
          <span class="badge-text" style="color:#10b981;">ROCK</span>
        </div>
        <div class="gate-door-leaf">
          <div class="gate-media-viewport">
            <img src="assets/gate_stone_giant.webp" alt="Stone Gate" class="gate-render-img">
            <div class="pedestal-disc" style="--gate-glow:#10b981;"></div>
          </div>
          <div class="gate-caption-tray">
            <div>
              <div class="gate-title" style="color:#10b981;">Stone Arch</div>
              <div class="gate-cue">Strong rocks ahead!</div>
            </div>
            <button type="button" class="btn-3d btn-emerald" style="width:100%; padding:10px; font-size:0.9rem;">
              <span>🚪 Open Stone Gate</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Door: Cloud Gate -->
      <div class="gate-card-wrapper right-gate" id="gateCard2_right" onclick="chooseDoor('right', 2)" style="--gate-glow:#38bdf8;">
        <div class="gate-clue-badge" style="--gate-glow:#38bdf8;">
          <span class="badge-icon">☁️</span>
          <span class="badge-text" style="color:#38bdf8;">CLOUD</span>
        </div>
        <div class="gate-door-leaf">
          <div class="gate-media-viewport">
            <img src="assets/gate_ice_giant.webp" alt="Cloud Gate" class="gate-render-img">
            <div class="pedestal-disc" style="--gate-glow:#38bdf8;"></div>
          </div>
          <div class="gate-caption-tray">
            <div>
              <div class="gate-title" style="color:#38bdf8;">Cloud Arch</div>
              <div class="gate-cue">Soft white clouds ahead!</div>
            </div>
            <button type="button" class="btn-3d btn-cyan" style="width:100%; padding:10px; font-size:0.9rem;">
              <span>🚪 Open Cloud Gate</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAMBER 3: STEPPING BRIDGE
  // =========================================================================
  function setupChamber3() {
    playerSession.rockStepIndex = 0;
    for (let i = 0; i < 3; i++) {
      const tile = document.getElementById(`rockTile${i}`);
      if (tile) tile.classList.remove('is-stepped');
    }
    const feedback = document.getElementById('bridgeFeedback');
    if (feedback) feedback.textContent = '';

    root.TwinGatesAudio.speak("The bridge is broken! Tap the rock tiles in order: 1, 2, 3!");
  }

  function handleRockStep(index) {
    if (playerSession.chamber3Solved) return;

    if (index === playerSession.rockStepIndex) {
      // Correct step
      const tile = document.getElementById(`rockTile${index}`);
      if (tile) tile.classList.add('is-stepped');
      root.TwinGatesAudio.playSnap();

      playerSession.rockStepIndex++;

      if (playerSession.rockStepIndex === 3) {
        // Bridge complete
        playerSession.chamber3Solved = true;
        addXP(30);
        root.TwinGatesAudio.playXP();

        const feedback = document.getElementById('bridgeFeedback');
        if (feedback) {
          feedback.innerHTML = '🌉 <span style="color:#34d399;">Bridge is safe!</span> The rock path is complete!';
        }

        renderChamber3Doors();
        root.TwinGatesAudio.speak("The rock bridge is safe! Choose the next colossal door!");
      }
    } else {
      // Soft-fail: reset
      root.TwinGatesAudio.playSoftFail();
      playerSession.rockStepIndex = 0;
      for (let i = 0; i < 3; i++) {
        const tile = document.getElementById(`rockTile${i}`);
        if (tile) tile.classList.remove('is-stepped');
      }

      const feedback = document.getElementById('bridgeFeedback');
      if (feedback) {
        feedback.innerHTML = '⚠️ <span style="color:#f87171;">Oops!</span> Tap the rocks in order: Step 1, then Step 2, then Step 3!';
      }
      root.TwinGatesAudio.speak("Tap the rocks in order: 1, then 2, then 3!");
    }
  }

  function renderChamber3Doors() {
    const arena = document.getElementById('chamber3DoorsArena');
    if (!arena) return;

    arena.innerHTML = `
      <!-- Left Door: Rock Gate -->
      <div class="gate-card-wrapper left-gate" id="gateCard3_left" onclick="chooseDoor('left', 3)" style="--gate-glow:#10b981;">
        <div class="gate-clue-badge" style="--gate-glow:#10b981;">
          <span class="badge-icon">🪨</span>
          <span class="badge-text" style="color:#10b981;">ROCKS</span>
        </div>
        <div class="gate-door-leaf">
          <div class="gate-media-viewport">
            <img src="assets/gate_stone_giant.webp" alt="Rock Gate" class="gate-render-img">
            <div class="pedestal-disc" style="--gate-glow:#10b981;"></div>
          </div>
          <div class="gate-caption-tray">
            <div>
              <div class="gate-title" style="color:#10b981;">Safe Rock Gate</div>
              <div class="gate-cue">Leads to the Golden Gate!</div>
            </div>
            <button type="button" class="btn-3d btn-emerald" style="width:100%; padding:10px; font-size:0.9rem;">
              <span>🚪 Open Rock Gate</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Door: Cloud Gate -->
      <div class="gate-card-wrapper right-gate" id="gateCard3_right" onclick="chooseDoor('right', 3)" style="--gate-glow:#38bdf8;">
        <div class="gate-clue-badge" style="--gate-glow:#38bdf8;">
          <span class="badge-icon">☁️</span>
          <span class="badge-text" style="color:#38bdf8;">CLOUDS</span>
        </div>
        <div class="gate-door-leaf">
          <div class="gate-media-viewport">
            <img src="assets/gate_ice_giant.webp" alt="Cloud Gate" class="gate-render-img">
            <div class="pedestal-disc" style="--gate-glow:#38bdf8;"></div>
          </div>
          <div class="gate-caption-tray">
            <div>
              <div class="gate-title" style="color:#38bdf8;">Cloud Gate</div>
              <div class="gate-cue">Leads to the Golden Gate!</div>
            </div>
            <button type="button" class="btn-3d btn-cyan" style="width:100%; padding:10px; font-size:0.9rem;">
              <span>🚪 Open Cloud Gate</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAMBER 4: THE GOLDEN GATE (THE FINAL LOCK)
  // =========================================================================
  function setupChamber4() {
    playerSession.inventory.key = true;
    updateHUD();
    root.TwinGatesAudio.speak("The giant golden door is locked! Find the big gold key!");
  }

  function handleUnlockKey() {
    if (playerSession.chamber4Solved) return;
    playerSession.chamber4Solved = true;
    addXP(30);

    root.TwinGatesAudio.playSnap();
    setTimeout(() => root.TwinGatesAudio.playDoorCreak(), 200);
    setTimeout(() => root.TwinGatesAudio.playXP(), 400);

    const sealBox = document.getElementById('keyholeSeal');
    if (sealBox) {
      sealBox.innerHTML = '<span class="rubber-stamp-seal">🗝️ Gate Unlocked!</span>';
    }

    const btn = document.getElementById('btnUnlockKey');
    if (btn) {
      btn.disabled = true;
      btn.style.opacity = '0.6';
      btn.innerHTML = '<span>✓ Golden Gate Unlocked!</span>';
    }

    root.TwinGatesAudio.speak("The golden gate is unlocked! Welcome to the treasure vault!");

    setTimeout(() => {
      transitionToChamber(5);
    }, 900);
  }

  // =========================================================================
  // CHAMBER 5: TREASURE VAULT & LIVE TELEPROMPTER
  // =========================================================================
  function setupChamber5() {
    root.TwinGatesAudio.speak(
      "You found the magic treasure chest! Speak into the microphone to claim your badge!"
    );
  }

  function startFinalKaraokeBroadcast() {
    if (playerSession.isKaraokeRunning) return;
    playerSession.isKaraokeRunning = true;

    const lines = [
      { id: 'teleLine1', text: "We opened the giant magic door!" },
      { id: 'teleLine2', text: "We saw the friendly creature in the cave." },
      { id: 'teleLine3', text: "We unlocked the golden gate and found the treasure!" }
    ];

    let lineIndex = 0;

    function playNextLine() {
      if (lineIndex >= lines.length) {
        playerSession.isKaraokeRunning = false;
        root.TwinGatesAudio.playXP();
        return;
      }

      const item = lines[lineIndex];
      const el = document.getElementById(item.id);
      if (!el) {
        lineIndex++;
        playNextLine();
        return;
      }

      const words = item.text.split(' ');
      el.innerHTML = words.map(w => `<span class="tp-word">${w}</span>`).join(' ');
      const wordSpans = el.querySelectorAll('.tp-word');

      let wordIdx = 0;
      const wordInterval = setInterval(() => {
        if (wordIdx < wordSpans.length) {
          wordSpans.forEach(s => s.classList.remove('is-active'));
          wordSpans[wordIdx].classList.add('is-active');
          wordSpans[wordIdx].classList.add('is-spoken');
          root.TwinGatesAudio.playSnap();
          wordIdx++;
        } else {
          clearInterval(wordInterval);
        }
      }, 290);

      root.TwinGatesAudio.speak(item.text, () => {
        clearInterval(wordInterval);
        wordSpans.forEach(s => {
          s.classList.remove('is-active');
          s.classList.add('is-spoken');
        });
        lineIndex++;
        setTimeout(playNextLine, 400);
      });
    }

    playNextLine();
  }

  function finishCitadelQuest() {
    addXP(30); // 120 + 30 = 150 Total XP
    root.TwinGatesAudio.playVictoryFanfare();
    ConfettiEngine.burst(130);

    setTimeout(() => {
      const modal = document.getElementById('completionModal');
      if (modal) modal.classList.add('is-open');
    }, 600);
  }

  function closeCompletionModal() {
    const modal = document.getElementById('completionModal');
    if (modal) modal.classList.remove('is-open');
  }

  function replayChamberNarration(chamberNum) {
    if (!root.TwinGatesAudio) return;
    if (chamberNum === 1) {
      root.TwinGatesAudio.speak("Look! Two giant magic doors! Is it cold ice or hot fire?");
    } else if (chamberNum === 2) {
      const isIce = playerSession.chosenBranch === 'ice';
      root.TwinGatesAudio.speak(isIce ? "A fluffy Yeti is here! Give the yeti a sweet berry." : "A cute Baby Dragon is here! Give the dragon a sweet berry.");
    } else if (chamberNum === 3) {
      root.TwinGatesAudio.speak("The bridge is broken! Tap the rock tiles in order: 1, 2, 3!");
    } else if (chamberNum === 4) {
      root.TwinGatesAudio.speak("The giant golden door is locked! Find the big gold key!");
    }
  }

  // =========================================================================
  // BOOTSTRAP INITIALIZATION
  // =========================================================================
  function initApp() {
    ConfettiEngine.init();
    updateHUD();
  }

  window.addEventListener('DOMContentLoaded', initApp);

  // Expose global controller API
  root.playEntranceClue = playEntranceClue;
  root.selectTool = selectTool;
  root.chooseDoor = chooseDoor;
  root.handleGiveBerry = handleGiveBerry;
  root.handleRockStep = handleRockStep;
  root.handleUnlockKey = handleUnlockKey;
  root.startFinalKaraokeBroadcast = startFinalKaraokeBroadcast;
  root.finishCitadelQuest = finishCitadelQuest;
  root.closeCompletionModal = closeCompletionModal;
  root.replayChamberNarration = replayChamberNarration;
  root.toggleMuteAudio = toggleMuteAudio;
  root.twinGatesSession = playerSession;

})(typeof window !== 'undefined' ? window : global);
