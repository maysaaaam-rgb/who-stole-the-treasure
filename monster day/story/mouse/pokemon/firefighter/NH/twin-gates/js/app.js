/**
 * MYSTERY OF THE TWIN GATES: THE CRYSTAL CITADEL
 * Reactive State Controller & Interactive Story Engine
 * Grade 3–4 | CEFR A1–A1+ | 45-Minute Interactive Arcade Loop
 */

(function(root) {
  'use strict';

  // =========================================================================
  // REACTIVE PLAYER SESSION STATE
  // =========================================================================
  const playerSession = {
    currentChamber: 1,
    pathTaken: [], // e.g. ['frost', 'glacier', 'gears', 'skydock']
    inventory: {
      shield: false,
      torch: false,
      gear: false,
      crystal: false
    },
    xp: 0,
    chamber1Solved: false,
    chamber2Solved: false,
    chamber3Solved: false,
    chamber4Solved: false,
    bridgeStepIndex: 0,
    isSpeaking: false,
    isDoorOpening: false,
    isKaraokeRunning: false
  };

  // Stepping stone sequence for Chamber 3: Left Frost (0) -> Right Ember (2) -> Center Sun (1)
  const RUNE_SEQUENCE = [0, 2, 1];

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

    burst(count = 90) {
      if (!this.canvas || !this.ctx) this.init();
      if (!this.canvas || !this.ctx) return;

      const colors = ['#38bdf8', '#f59e0b', '#10b981', '#f43f5e', '#a855f7', '#fbbf24', '#ffffff'];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: this.canvas.width / 2 + (Math.random() * 200 - 100),
          y: this.canvas.height * 0.45 + (Math.random() * 80 - 40),
          vx: (Math.random() - 0.5) * 14,
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
        p.vy += 0.35; // gravity
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
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
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
    if (playerSession.xp > 200) playerSession.xp = 200;
    updateHUD();

    // Cross-module platform event / store dispatch
    if (typeof root.AdventureAcademy !== 'undefined' && typeof root.AdventureAcademy.awardXP === 'function') {
      root.AdventureAcademy.awardXP(amount);
    } else if (typeof root.schoolStore !== 'undefined' && typeof root.schoolStore.addXP === 'function') {
      root.schoolStore.addXP(amount);
    }
  }

  function updateHUD() {
    const xpEl = document.getElementById('hudXP');
    if (xpEl) {
      xpEl.textContent = `⭐ +${playerSession.xp} XP`;
    }

    // Inventory Slots
    const slotShield = document.getElementById('hudSlotShield');
    const slotTorch = document.getElementById('hudSlotTorch');
    const slotGear = document.getElementById('hudSlotGear');
    const slotCrystal = document.getElementById('hudSlotCrystal');

    if (slotShield) slotShield.classList.toggle('is-filled', !!playerSession.inventory.shield);
    if (slotTorch) slotTorch.classList.toggle('is-filled', !!playerSession.inventory.torch);
    if (slotGear) slotGear.classList.toggle('is-filled', !!playerSession.inventory.gear);
    if (slotCrystal) slotCrystal.classList.toggle('is-filled', !!playerSession.inventory.crystal);

    // Breadcrumbs
    for (let i = 1; i <= 5; i++) {
      const crumb = document.getElementById(`crumbNode${i}`);
      if (crumb) {
        crumb.classList.toggle('is-passed', i < playerSession.currentChamber);
        crumb.classList.toggle('is-active', i === playerSession.currentChamber);
      }
    }
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
  // CHAMBER 1: ENTRANCE GATES & CLUES
  // =========================================================================
  function playEntranceClue(type) {
    if (!root.TwinGatesAudio) return;
    const prompter = document.getElementById('karaokeTextChamber1');

    if (type === 'wind') {
      root.TwinGatesAudio.playIceWind();
      if (prompter) {
        prompter.textContent = '❄️ "I hear howling cold ice wind behind the Left Gate!"';
      }
      root.TwinGatesAudio.narrateStory("I hear howling cold ice wind behind the Left Gate!");
    } else if (type === 'fire') {
      root.TwinGatesAudio.playFireCrack();
      if (prompter) {
        prompter.textContent = '🔥 "I hear crackling hot magma embers behind the Right Gate!"';
      }
      root.TwinGatesAudio.narrateStory("I hear crackling hot magma embers behind the Right Gate!");
    }
  }

  function handleChamber1Choice(choice) {
    if (playerSession.chamber1Solved) return;

    const optShield = document.getElementById('optFrostShield');
    const optKite = document.getElementById('optPaperKite');
    const feedback = document.getElementById('chamber1Feedback');

    if (choice === 'frost_shield') {
      playerSession.chamber1Solved = true;
      playerSession.inventory.shield = true;
      addXP(30);

      if (optShield) optShield.classList.add('is-correct');
      if (optKite) optKite.classList.remove('is-wrong');

      if (feedback) {
        feedback.innerHTML = '🛡️ <span style="color:#34d399;">Great choice!</span> The Frost Shield will deflect freezing winds and ember sparks. Now choose your gate!';
      }

      root.TwinGatesAudio.playSnap();
      setTimeout(() => root.TwinGatesAudio.playXP(), 150);
      root.TwinGatesAudio.narrateStory("Frost Crystal Shield equipped! Choose the left or right gate to enter the Citadel.");
      updateHUD();
    } else {
      if (optKite) optKite.classList.add('is-wrong');
      if (feedback) {
        feedback.innerHTML = '⚠️ <span style="color:#f87171;">Too fragile!</span> A paper kite will blow away in the blizzard. Choose the protective Frost Shield!';
      }
      root.TwinGatesAudio.playSoftFail();
      root.TwinGatesAudio.narrateStory("The paper kite is too fragile. Choose the Frost Shield!");
    }
  }

  // =========================================================================
  // 3D DOOR SELECTION & TRANSITION ENGINE
  // =========================================================================
  function chooseTwinDoor(doorSide, chamberNum) {
    if (playerSession.isDoorOpening) return;

    // Chamber 1 guard: must equip shield first
    if (chamberNum === 1 && !playerSession.chamber1Solved) {
      root.TwinGatesAudio.playSoftFail();
      const feedback = document.getElementById('chamber1Feedback');
      if (feedback) {
        feedback.innerHTML = '🔒 <span style="color:#f59e0b;">Hold on!</span> Equip your Frost Shield in Step 1 before stepping through the gate!';
      }
      root.TwinGatesAudio.narrateStory("Equip your Frost Shield first before stepping through the gate!");
      return;
    }

    playerSession.isDoorOpening = true;

    // Find the clicked gate card
    let card = null;
    if (chamberNum === 1) {
      card = doorSide === 'left' ? document.getElementById('doorCardLeftChamber1') : document.getElementById('doorCardRightChamber1');
    } else {
      card = document.getElementById(`doorCard_${chamberNum}_${doorSide}`);
    }

    // Play physical sound effects
    root.TwinGatesAudio.playDoorCreak();
    setTimeout(() => root.TwinGatesAudio.playXP(), 220);

    // Apply 3D perspective swing class
    if (card) {
      if (doorSide === 'left') {
        card.classList.add('is-open-left');
      } else {
        card.classList.add('is-open-right');
      }
    }

    // Record decision in player path history
    if (chamberNum === 1) {
      playerSession.pathTaken.push(doorSide === 'left' ? 'frost' : 'magma');
    } else if (chamberNum === 2) {
      playerSession.pathTaken.push(doorSide === 'left' ? 'glacier' : 'tunnel');
    } else if (chamberNum === 3) {
      playerSession.pathTaken.push(doorSide === 'left' ? 'gears' : 'vault');
    } else if (chamberNum === 4) {
      playerSession.pathTaken.push(doorSide === 'left' ? 'skydock' : 'engine');
    }

    // Transition smoothly to next chamber after 3D swing completes
    setTimeout(() => {
      transitionToChamber(chamberNum + 1);
      playerSession.isDoorOpening = false;
    }, 750);
  }

  function transitionToChamber(nextChamberNum) {
    playerSession.currentChamber = nextChamberNum;

    // Hide all chamber views, show target chamber
    for (let i = 1; i <= 5; i++) {
      const view = document.getElementById(`chamberPhase${i}`);
      if (view) {
        view.classList.toggle('is-visible', i === nextChamberNum);
      }
    }

    updateHUD();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Initialize specific chamber mechanics
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
  // CHAMBER 2: CREATURE DEN SETUP & OFFERING
  // =========================================================================
  function setupChamber2() {
    const isFrostPath = playerSession.pathTaken[0] === 'frost';
    const titleEl = document.getElementById('chamber2BannerTitle');
    const descEl = document.getElementById('chamber2BannerDesc');
    const prompterEl = document.getElementById('karaokeTextChamber2');
    const imgEl = document.getElementById('chamber2CreatureImg');
    const nameEl = document.getElementById('chamber2CreatureName');
    const formulaEl = document.getElementById('chamber2CreatureFormula');
    const btnAction = document.getElementById('btnChamber2Action');

    if (isFrostPath) {
      if (titleEl) titleEl.innerHTML = '<span>🐾</span> Chamber 2: The Frost Yeti Den';
      if (descEl) descEl.textContent = 'You stepped into the glacier cavern! A shivering Yeti looks cold. Offer a blazing torch (+25 XP)!';
      if (imgEl) imgEl.src = 'assets/yeti_companion.webp';
      if (nameEl) nameEl.textContent = 'Friendly Yeti Companion';
      if (formulaEl) formulaEl.textContent = '"I need a torch to melt the ice for the Yeti."';
      if (btnAction) {
        btnAction.className = 'btn-3d btn-amber';
        btnAction.innerHTML = '<span>🕯️ Offer Blazing Torch (+25 XP)</span>';
      }
      if (prompterEl) prompterEl.textContent = 'Look! A friendly Yeti is shivering behind the ice. Offer a blazing torch to melt the ice!';
      root.TwinGatesAudio.narrateStory("Look! A friendly Yeti is shivering behind the ice. Offer a blazing torch to melt the ice!");
    } else {
      if (titleEl) titleEl.innerHTML = '<span>🐉</span> Chamber 2: The Baby Dragon Lair';
      if (descEl) descEl.textContent = 'You entered the warm magma cavern! A cute baby dragon wants a mineral treat. Offer a crystal gem (+25 XP)!';
      if (imgEl) imgEl.src = 'assets/baby_dragon.webp';
      if (nameEl) nameEl.textContent = 'Baby Fire Dragon Guardian';
      if (formulaEl) formulaEl.textContent = '"I need a glowing crystal gem to feed the baby dragon."';
      if (btnAction) {
        btnAction.className = 'btn-3d btn-cyan';
        btnAction.innerHTML = '<span>💎 Offer Crystal Gem (+25 XP)</span>';
      }
      if (prompterEl) prompterEl.textContent = 'Look! A cute baby dragon is playing under the volcanic rock. Offer a crystal gem to make peace!';
      root.TwinGatesAudio.narrateStory("Look! A cute baby dragon is playing under the volcanic rock. Offer a crystal gem to make peace!");
    }
  }

  function handleChamber2Offering() {
    if (playerSession.chamber2Solved) return;
    playerSession.chamber2Solved = true;

    const isFrostPath = playerSession.pathTaken[0] === 'frost';
    if (isFrostPath) {
      playerSession.inventory.torch = true;
    } else {
      playerSession.inventory.crystal = true;
    }

    addXP(40);
    root.TwinGatesAudio.playSnap();
    setTimeout(() => root.TwinGatesAudio.playXP(), 180);

    const sealBox = document.getElementById('chamber2OfferingSeal');
    if (sealBox) {
      sealBox.innerHTML = '<span class="rubber-stamp-seal">🤝 Companion Befriended!</span>';
    }

    const btnAction = document.getElementById('btnChamber2Action');
    if (btnAction) {
      btnAction.disabled = true;
      btnAction.style.opacity = '0.6';
      btnAction.style.pointerEvents = 'none';
      btnAction.innerHTML = '<span>✓ Companion Trust Earned!</span>';
    }

    renderChamber2Doors();

    const voiceLine = isFrostPath
      ? "The Yeti smiles and shares its warm path! The next twin gates are unlocked!"
      : "The Baby Dragon roars happily! The next twin gates are unlocked!";
    root.TwinGatesAudio.narrateStory(voiceLine);
  }

  function renderChamber2Doors() {
    const arena = document.getElementById('chamber2DoorsArena');
    if (!arena) return;

    const isFrostPath = playerSession.pathTaken[0] === 'frost';
    const leftTitle = isFrostPath ? 'Upper Glacier Arch' : 'Upper Volcanic Ridge';
    const leftCue = isFrostPath ? 'Go up through the icy glacier archway!' : 'Go up toward the cool mountain ridge!';
    const rightTitle = isFrostPath ? 'Deep Crystal Tunnel' : 'Deep Magma Conduit';
    const rightCue = isFrostPath ? 'Go down through the warm cavern tunnel!' : 'Go down through the glowing magma conduit!';

    arena.innerHTML = `
      <div class="gate-portal-column">
        <div class="gate-card-3d glow-left" id="doorCard_2_left" onclick="chooseTwinDoor('left', 2)">
          <div class="gate-media-viewport">
            <span class="hud-tag" style="position:absolute; top:12px; left:12px; z-index:5;">LEFT GATE</span>
            <div class="gate-render-wrapper">
              <img src="assets/gate_frost_left.webp" alt="${leftTitle}" class="gate-render-img">
              <div class="pedestal-disc" style="background:radial-gradient(ellipse at center, rgba(56,189,248,0.5) 0%, transparent 72%);"></div>
            </div>
          </div>
          <div class="gate-caption-tray">
            <div>
              <div class="gate-title" style="color:#38bdf8;">${leftTitle}</div>
              <div class="gate-cue">${leftCue}</div>
            </div>
            <button type="button" class="btn-3d btn-cyan" style="width:100%; padding:10px; font-size:0.9rem;">
              <span>🚪 Enter Left Door</span>
            </button>
          </div>
        </div>
      </div>

      <div class="gate-portal-column">
        <div class="gate-card-3d glow-right" id="doorCard_2_right" onclick="chooseTwinDoor('right', 2)">
          <div class="gate-media-viewport">
            <span class="hud-tag" style="position:absolute; top:12px; left:12px; z-index:5; background:rgba(245,158,11,0.2); border-color:#f59e0b; color:#f59e0b;">RIGHT GATE</span>
            <div class="gate-render-wrapper">
              <img src="assets/gate_magma_right.webp" alt="${rightTitle}" class="gate-render-img">
              <div class="pedestal-disc" style="background:radial-gradient(ellipse at center, rgba(245,158,11,0.5) 0%, transparent 72%);"></div>
            </div>
          </div>
          <div class="gate-caption-tray">
            <div>
              <div class="gate-title" style="color:#f59e0b;">${rightTitle}</div>
              <div class="gate-cue">${rightCue}</div>
            </div>
            <button type="button" class="btn-3d btn-amber" style="width:100%; padding:10px; font-size:0.9rem;">
              <span>🚪 Enter Right Door</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAMBER 3: RUNE RHYTHM STEPPING STONES
  // =========================================================================
  function setupChamber3() {
    playerSession.bridgeStepIndex = 0;
    for (let i = 0; i < 3; i++) {
      const tile = document.getElementById(`runeTile${i}`);
      if (tile) tile.classList.remove('is-stepped');
    }
    const feedback = document.getElementById('bridgeFeedback');
    if (feedback) feedback.textContent = '';

    root.TwinGatesAudio.narrateStory("Follow the rune chime: Left Frost, then Right Ember, then Center Sun!");
  }

  function handleRuneStep(index) {
    if (playerSession.chamber3Solved) return;

    const expectedIndex = RUNE_SEQUENCE[playerSession.bridgeStepIndex];
    const feedback = document.getElementById('bridgeFeedback');

    if (index === expectedIndex) {
      // Correct step
      const tile = document.getElementById(`runeTile${index}`);
      if (tile) tile.classList.add('is-stepped');
      root.TwinGatesAudio.playSnap();

      playerSession.bridgeStepIndex++;

      if (playerSession.bridgeStepIndex === RUNE_SEQUENCE.length) {
        // Complete bridge
        playerSession.chamber3Solved = true;
        addXP(40);
        root.TwinGatesAudio.playXP();

        if (feedback) {
          feedback.innerHTML = '🌉 <span style="color:#34d399;">Bridge Formed!</span> You stepped on the runes in perfect harmony!';
        }

        renderChamber3Doors();
        root.TwinGatesAudio.narrateStory("The chasm bridge has connected! Choose the Clockwork Gear Gate or the Gold Vault Portal.");
      }
    } else {
      // Soft-fail: reset rhythm
      root.TwinGatesAudio.playSoftFail();
      playerSession.bridgeStepIndex = 0;
      for (let i = 0; i < 3; i++) {
        const tile = document.getElementById(`runeTile${i}`);
        if (tile) tile.classList.remove('is-stepped');
      }

      if (feedback) {
        feedback.innerHTML = '⚠️ <span style="color:#f87171;">The rune vanished!</span> Follow the order: Left Frost (1) ➔ Right Ember (2) ➔ Center Sun (3)!';
      }
      root.TwinGatesAudio.narrateStory("Listen carefully: Left Frost, then Right Ember, then Center Sun!");
    }
  }

  function renderChamber3Doors() {
    const arena = document.getElementById('chamber3DoorsArena');
    if (!arena) return;

    arena.innerHTML = `
      <div class="gate-portal-column">
        <div class="gate-card-3d glow-left" id="doorCard_3_left" onclick="chooseTwinDoor('left', 3)">
          <div class="gate-media-viewport">
            <span class="hud-tag" style="position:absolute; top:12px; left:12px; z-index:5;">LEFT GATE</span>
            <div class="gate-render-wrapper">
              <img src="assets/gate_clockwork.webp" alt="Clockwork Gate" class="gate-render-img">
              <div class="pedestal-disc" style="background:radial-gradient(ellipse at center, rgba(245,158,11,0.5) 0%, transparent 72%);"></div>
            </div>
          </div>
          <div class="gate-caption-tray">
            <div>
              <div class="gate-title" style="color:#f59e0b;">Clockwork Gear Gate</div>
              <div class="gate-cue">I hear heavy bronze gears turning behind the Left Door!</div>
            </div>
            <button type="button" class="btn-3d btn-amber" style="width:100%; padding:10px; font-size:0.9rem;">
              <span>🚪 Enter Left Door</span>
            </button>
          </div>
        </div>
      </div>

      <div class="gate-portal-column">
        <div class="gate-card-3d glow-right" id="doorCard_3_right" onclick="chooseTwinDoor('right', 3)">
          <div class="gate-media-viewport">
            <span class="hud-tag" style="position:absolute; top:12px; left:12px; z-index:5; background:rgba(56,189,248,0.2); border-color:#38bdf8; color:#38bdf8;">RIGHT GATE</span>
            <div class="gate-render-wrapper">
              <img src="assets/gate_vault_gold.webp" alt="Citadel Vault Portal" class="gate-render-img">
              <div class="pedestal-disc" style="background:radial-gradient(ellipse at center, rgba(56,189,248,0.5) 0%, transparent 72%);"></div>
            </div>
          </div>
          <div class="gate-caption-tray">
            <div>
              <div class="gate-title" style="color:#38bdf8;">Citadel Vault Portal</div>
              <div class="gate-cue">I see radiant starlight gleaming behind the Right Door!</div>
            </div>
            <button type="button" class="btn-3d btn-cyan" style="width:100%; padding:10px; font-size:0.9rem;">
              <span>🚪 Enter Right Door</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAMBER 4: CLOCKWORK GUARDIAN & GEAR
  // =========================================================================
  function setupChamber4() {
    root.TwinGatesAudio.narrateStory("The Clockwork Guardian asks: What has twenty teeth, spins in circles, and powers the machines?");
  }

  function handleSnapGear() {
    if (playerSession.chamber4Solved) return;
    playerSession.chamber4Solved = true;
    playerSession.inventory.gear = true;
    addXP(40);

    root.TwinGatesAudio.playSnap();
    setTimeout(() => root.TwinGatesAudio.playXP(), 200);

    const sealBox = document.getElementById('gearSnapSeal');
    if (sealBox) {
      sealBox.innerHTML = '<span class="rubber-stamp-seal">⚙️ Lift Powered!</span>';
    }

    const btnSnap = document.getElementById('btnSnapGear');
    if (btnSnap) {
      btnSnap.disabled = true;
      btnSnap.style.opacity = '0.6';
      btnSnap.style.pointerEvents = 'none';
      btnSnap.innerHTML = '<span>✓ Bronze Gear Calibrated!</span>';
    }

    renderChamber4Doors();
    root.TwinGatesAudio.narrateStory("The bronze gear locks in place! The summit lift activates. Step through to the flight deck!");
  }

  function renderChamber4Doors() {
    const arena = document.getElementById('chamber4DoorsArena');
    if (!arena) return;

    arena.innerHTML = `
      <div class="gate-portal-column">
        <div class="gate-card-3d glow-left" id="doorCard_4_left" onclick="chooseTwinDoor('left', 4)">
          <div class="gate-media-viewport">
            <span class="hud-tag" style="position:absolute; top:12px; left:12px; z-index:5;">LEFT GATE</span>
            <div class="gate-render-wrapper">
              <img src="assets/gate_vault_gold.webp" alt="Sky Dock Portal" class="gate-render-img">
              <div class="pedestal-disc" style="background:radial-gradient(ellipse at center, rgba(245,158,11,0.5) 0%, transparent 72%);"></div>
            </div>
          </div>
          <div class="gate-caption-tray">
            <div>
              <div class="gate-title" style="color:#f59e0b;">Sky Dock Portal</div>
              <div class="gate-cue">The sky dock leads directly to the Golden Airship!</div>
            </div>
            <button type="button" class="btn-3d btn-amber" style="width:100%; padding:10px; font-size:0.9rem;">
              <span>🚪 Enter Sky Dock</span>
            </button>
          </div>
        </div>
      </div>

      <div class="gate-portal-column">
        <div class="gate-card-3d glow-right" id="doorCard_4_right" onclick="chooseTwinDoor('right', 4)">
          <div class="gate-media-viewport">
            <span class="hud-tag" style="position:absolute; top:12px; left:12px; z-index:5; background:rgba(56,189,248,0.2); border-color:#38bdf8; color:#38bdf8;">RIGHT GATE</span>
            <div class="gate-render-wrapper">
              <img src="assets/gate_clockwork.webp" alt="Engine Lift" class="gate-render-img">
              <div class="pedestal-disc" style="background:radial-gradient(ellipse at center, rgba(56,189,248,0.5) 0%, transparent 72%);"></div>
            </div>
          </div>
          <div class="gate-caption-tray">
            <div>
              <div class="gate-title" style="color:#38bdf8;">Core Engine Gate</div>
              <div class="gate-cue">The steam lift ascends right up to the flight deck!</div>
            </div>
            <button type="button" class="btn-3d btn-cyan" style="width:100%; padding:10px; font-size:0.9rem;">
              <span>🚪 Enter Steam Lift</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAMBER 5: AIRSHIP LAUNCH & KARAOKE BROADCAST
  // =========================================================================
  function setupChamber5() {
    // Fill all relics for the grand finale
    playerSession.inventory.shield = true;
    playerSession.inventory.gear = true;
    playerSession.inventory.crystal = true;
    playerSession.inventory.torch = true;
    updateHUD();

    root.TwinGatesAudio.narrateStory(
      "The Golden Airship awaits! Deliver your three-sentence graduation broadcast, then launch into the sunrise!"
    );
  }

  function startFinalKaraokeBroadcast() {
    if (playerSession.isKaraokeRunning) return;
    playerSession.isKaraokeRunning = true;

    const lines = [
      { id: 'teleprompterLine1', text: "We explored the Crystal Citadel and unlocked the magic gates!" },
      { id: 'teleprompterLine2', text: "We solved the ancient riddles and passed the creatures safely!" },
      { id: 'teleprompterLine3', text: "We launched the Golden Airship — mission complete!" }
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

      // Calibrate speech pace ~ 280ms per word
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

      root.TwinGatesAudio.narrateStory(item.text, () => {
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
    addXP(50);
    root.TwinGatesAudio.playVictoryFanfare();
    ConfettiEngine.burst(120);

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
      root.TwinGatesAudio.narrateStory("Listen carefully to the wind and the crackling fire! Choose your shield, then pick a door!");
    } else if (chamberNum === 2) {
      const isFrost = playerSession.pathTaken[0] === 'frost';
      const text = isFrost
        ? "Look! A friendly Yeti is shivering behind the ice. Offer a blazing torch to become companions!"
        : "Look! A cute baby dragon is playing under the volcanic rock. Offer a crystal gem to make peace!";
      root.TwinGatesAudio.narrateStory(text);
    } else if (chamberNum === 3) {
      root.TwinGatesAudio.narrateStory("Follow the rune chime: Left Frost, then Right Ember, then Center Sun!");
    } else if (chamberNum === 4) {
      root.TwinGatesAudio.narrateStory("What has twenty teeth, spins in circles, and powers the machines?");
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
  root.handleChamber1Choice = handleChamber1Choice;
  root.chooseTwinDoor = chooseTwinDoor;
  root.handleChamber2Offering = handleChamber2Offering;
  root.handleRuneStep = handleRuneStep;
  root.handleSnapGear = handleSnapGear;
  root.startFinalKaraokeBroadcast = startFinalKaraokeBroadcast;
  root.finishCitadelQuest = finishCitadelQuest;
  root.closeCompletionModal = closeCompletionModal;
  root.replayChamberNarration = replayChamberNarration;
  root.toggleMuteAudio = toggleMuteAudio;
  root.twinGatesSession = playerSession;

})(typeof window !== 'undefined' ? window : global);
