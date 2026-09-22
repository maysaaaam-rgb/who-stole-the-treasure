/**
 * CAT VS DOG: PREPOSITION CATAPULT — 60FPS ARCADE CANVAS GAME ENGINE
 * Pseudo-3D Volumetric Rendering • Dynamic Eye Tracking • Realistic Parabolic Physics
 * Dual Modes (1P Solo vs CPU & 2P Smartboard Classroom)
 */
(function() {
  'use strict';

  const DATA = window.CAT_VS_DOG_DATA;
  const AUDIO = window.BattleAudio;

  // DOM Elements
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const arenaViewport = document.getElementById('arenaViewport');
  const combatToast = document.getElementById('combatToast');
  const turnBanner = document.getElementById('turnBanner');

  // HUD Elements
  const catHpBar = document.getElementById('cat-hp-bar');
  const dogHpBar = document.getElementById('dog-hp-bar');
  const catHpText = document.getElementById('cat-hp-text');
  const dogHpText = document.getElementById('dog-hp-text');
  const catAvatar = document.getElementById('cat-avatar');
  const dogAvatar = document.getElementById('dog-avatar');
  const windSpeedText = document.getElementById('wind-speed-text');
  const windDirIcon = document.getElementById('wind-dir-icon');
  const windFill = document.getElementById('wind-fill');
  const btnBgmToggle = document.getElementById('btn-bgm-toggle');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const modeTabs = document.querySelectorAll('.btn-mode-tab');
  const difficultySelect = document.getElementById('difficultySelect');

  // Controls Elements
  const angleSlider = document.getElementById('angleSlider');
  const angleValReadout = document.getElementById('angleValReadout');
  const throwBtn = document.getElementById('throwBtn');
  const powerFill = document.getElementById('powerFill');
  const powerPercent = document.getElementById('powerPercent');
  const weaponChips = document.querySelectorAll('.btn-weapon-chip');

  // Modals
  const prepositionModal = document.getElementById('prepositionModal');
  const challengeIcon = document.getElementById('challengeIcon');
  const challengeText = document.getElementById('challengeText');
  const challengeOptions = document.getElementById('challengeOptions');
  const victoryModal = document.getElementById('victoryModal');
  const winnerTrophy = document.getElementById('winnerTrophy');
  const winnerText = document.getElementById('winnerText');
  const btnPlayAgain = document.getElementById('btnPlayAgain');

  // Virtual Canvas Dimension
  const V_WIDTH = 960;
  const V_HEIGHT = 500;
  const BASE_GRAVITY = 0.32;

  // Game State
  const gameState = {
    gameMode: '1p', // '1p' or '2p'
    difficulty: 'pro',
    currentTurn: 'CAT', // 'CAT' or 'DOG'
    catHp: 100,
    dogHp: 100,
    catAngle: 45,
    dogAngle: 45,
    currentWeaponId: 'fish',
    windSpeed: 6, // -12 to +12
    powerCharging: false,
    currentPower: 0,
    powerDirection: 1,
    activeProjectiles: [],
    particleBursts: [],
    smokeTrails: [],
    impactStars: [],
    isGameOver: false,
    gameLoopRunning: false,
    fenceShieldBonus: 0, // temporary +35px shield
    isDoubleVolley: false,
    isSuperPower: false,
    screenShakeTimer: 0
  };

  // Environmental Entities
  const FENCE = { x: 462, y: 185, width: 36, height: 265 };
  const CAT = { x: 85, y: 300, width: 95, height: 110 };
  const DOG = { x: 775, y: 300, width: 105, height: 110 };

  /* =========================================================================
     INITIALIZATION & HUD CONTROL BINDINGS
     ========================================================================= */
  function initGame() {
    randomizeWind();
    updateHealthHUD();
    updateTurnIndicator();
    bindControls();
    startAnimationLoop();
  }

  function bindControls() {
    // Mode switcher
    modeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        modeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        gameState.gameMode = tab.dataset.mode;
        difficultySelect.style.display = (gameState.gameMode === '1p') ? 'inline-block' : 'none';
        AUDIO.playChime();
        showToast(gameState.gameMode === '1p' ? '1P VS CPU MODE' : '2P SMARTBOARD MODE', '#38bdf8');
      });
    });

    if (difficultySelect) {
      difficultySelect.addEventListener('change', (e) => {
        gameState.difficulty = e.target.value;
        AUDIO.playChime();
      });
    }

    // Audio & BGM toggles
    if (btnBgmToggle) {
      btnBgmToggle.addEventListener('click', () => {
        const isPlaying = AUDIO.toggleBgm();
        btnBgmToggle.classList.toggle('active', isPlaying);
        btnBgmToggle.innerHTML = isPlaying ? '🎵 <span>BGM On</span>' : '🎵 <span>BGM Off</span>';
      });
    }

    if (btnSoundToggle) {
      btnSoundToggle.addEventListener('click', () => {
        const isMuted = AUDIO.toggleMute();
        btnSoundToggle.innerHTML = isMuted ? '🔇' : '🔊';
      });
    }

    // Angle slider
    if (angleSlider) {
      angleSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (gameState.currentTurn === 'CAT') {
          gameState.catAngle = val;
        } else {
          gameState.dogAngle = val;
        }
        angleValReadout.textContent = `${val}°`;
      });
    }

    // Weapon selector
    weaponChips.forEach(chip => {
      chip.addEventListener('click', () => {
        weaponChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        gameState.currentWeaponId = chip.dataset.weapon;
        AUDIO.playWhistle('fish');
        const wp = DATA.weapons[gameState.currentWeaponId];
        showToast(`${wp.name.toUpperCase()} ARMED!`, wp.color);
      });
    });

    // Hold-to-Charge Throw Button
    throwBtn.addEventListener('mousedown', startCharge);
    window.addEventListener('mouseup', releaseCharge);
    throwBtn.addEventListener('touchstart', startCharge, { passive: false });
    window.addEventListener('touchend', releaseCharge, { passive: false });
    window.addEventListener('touchcancel', releaseCharge, { passive: false });

    // Keyboard Spacebar for Charge & Launch
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !e.repeat && canActivePlayerThrow() && !gameState.powerCharging) {
        if (!isAnyModalOpen()) {
          e.preventDefault();
          startCharge(e);
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space' && gameState.powerCharging) {
        e.preventDefault();
        releaseCharge(e);
      }
    });

    // Power-Up 1: Double Volley
    document.getElementById('btnPowerX2').onclick = () => {
      triggerPrepositionGate((success) => {
        if (success) {
          gameState.isDoubleVolley = true;
          document.getElementById('btnPowerX2').classList.add('active');
          showToast('DOUBLE VOLLEY READY! 🎯', '#38bdf8');
        }
      });
    };

    // Power-Up 2: Wind Inverter
    document.getElementById('btnPowerFist').onclick = () => {
      triggerPrepositionGate((success) => {
        if (success) {
          gameState.windSpeed = -gameState.windSpeed;
          updateWindDisplay();
          showToast('WIND INVERTED! ⚡', '#f59e0b');
          AUDIO.playWhistle('fish');
        }
      });
    };

    // Power-Up 3: Fence Extension Shield
    document.getElementById('btnPowerFence').onclick = () => {
      triggerPrepositionGate((success) => {
        if (success) {
          gameState.fenceShieldBonus = 45;
          showToast('FENCE SHIELD RAISED +45px! 🛡️', '#10b981');
          AUDIO.playWoodHit();
        }
      });
    };

    // Power-Up 4: Grammar First-Aid
    document.getElementById('btnPowerHeal').onclick = () => {
      triggerPrepositionGate((success) => {
        if (success) {
          if (gameState.currentTurn === 'CAT') {
            gameState.catHp = Math.min(100, gameState.catHp + 25);
          } else {
            gameState.dogHp = Math.min(100, gameState.dogHp + 25);
          }
          updateHealthHUD();
          AUDIO.playChime();
          showToast('GRAMMAR MEDIC! +25 HP 🩹', '#10b981');
        }
      });
    };

    // Play Again button
    if (btnPlayAgain) {
      btnPlayAgain.onclick = resetMatch;
    }
  }

  function isAnyModalOpen() {
    return prepositionModal.style.display === 'flex' || victoryModal.style.display === 'flex';
  }

  function canActivePlayerThrow() {
    if (gameState.isGameOver || gameState.activeProjectiles.length > 0) return false;
    if (gameState.gameMode === '1p' && gameState.currentTurn === 'DOG') return false;
    return true;
  }

  /* =========================================================================
     LAUNCH CHARGING MECHANICS
     ========================================================================= */
  function startCharge(e) {
    if (!canActivePlayerThrow()) return;
    if (e && e.preventDefault) e.preventDefault();
    AUDIO.init();

    gameState.powerCharging = true;
    gameState.currentPower = 12;
    gameState.powerDirection = 1;
    throwBtn.classList.add('charging');
  }

  function releaseCharge(e) {
    if (!gameState.powerCharging) return;
    if (e && e.preventDefault) e.preventDefault();

    gameState.powerCharging = false;
    throwBtn.classList.remove('charging');
    throwBtn.disabled = true;

    const angle = (gameState.currentTurn === 'CAT') ? gameState.catAngle : gameState.dogAngle;
    const force = gameState.currentPower;
    const weapon = DATA.weapons[gameState.currentWeaponId] || DATA.weapons.fish;

    if (gameState.currentTurn === 'CAT') {
      // Cat throws from left to right (e.g. angle ~ 45 deg)
      launchProjectile(CAT.x + CAT.width - 15, CAT.y + 35, angle, force, weapon, 'CAT');
    } else {
      // Dog throws from right to left (angle inverted to 180 - angle)
      launchProjectile(DOG.x + 15, DOG.y + 35, 180 - angle, force, weapon, 'DOG');
    }

    // Reset power meter
    gameState.currentPower = 0;
    powerFill.style.width = '0%';
    powerPercent.textContent = '0%';
  }

  function launchProjectile(originX, originY, angleDeg, forceVal, weapon, shooter) {
    AUDIO.playWhistle(weapon.id);
    const rad = (angleDeg * Math.PI) / 180;
    const speedMult = weapon.speedMult;

    gameState.activeProjectiles.push({
      x: originX,
      y: originY,
      vx: Math.cos(rad) * (forceVal * speedMult),
      vy: -Math.sin(rad) * (forceVal * speedMult),
      rotation: 0,
      weapon: weapon,
      shooter: shooter,
      bouncesLeft: weapon.bounces,
      lifeTicks: 0
    });

    // Double volley power-up
    if (gameState.isDoubleVolley) {
      setTimeout(() => {
        AUDIO.playWhistle(weapon.id);
        gameState.activeProjectiles.push({
          x: originX,
          y: originY - 18,
          vx: Math.cos(rad + 0.08) * (forceVal * speedMult),
          vy: -Math.sin(rad + 0.08) * (forceVal * speedMult),
          rotation: 0.3,
          weapon: weapon,
          shooter: shooter,
          bouncesLeft: weapon.bounces,
          lifeTicks: 0
        });
      }, 190);
      gameState.isDoubleVolley = false;
      document.getElementById('btnPowerX2').classList.remove('active');
    }
  }

  /* =========================================================================
     WIND ENGINE
     ========================================================================= */
  function randomizeWind() {
    gameState.windSpeed = Math.floor(Math.random() * 25) - 12; // -12 to +12
    updateWindDisplay();
  }

  function updateWindDisplay() {
    const absSpeed = Math.abs(gameState.windSpeed);
    windSpeedText.textContent = `${absSpeed} km/h`;

    if (gameState.windSpeed > 0) {
      windDirIcon.textContent = '➔';
      windDirIcon.style.color = '#38bdf8';
      windFill.style.marginLeft = '50%';
      windFill.style.width = `${(absSpeed / 12) * 50}%`;
    } else if (gameState.windSpeed < 0) {
      windDirIcon.textContent = '⬅';
      windDirIcon.style.color = '#f43f5e';
      windFill.style.marginLeft = `${50 - (absSpeed / 12) * 50}%`;
      windFill.style.width = `${(absSpeed / 12) * 50}%`;
    } else {
      windDirIcon.textContent = '●';
      windDirIcon.style.color = '#facc15';
      windFill.style.marginLeft = '50%';
      windFill.style.width = '0%';
    }
  }

  /* =========================================================================
     HUD UPDATES & TURN SWITCHING
     ========================================================================= */
  function updateHealthHUD() {
    catHpBar.style.width = `${Math.max(0, gameState.catHp)}%`;
    dogHpBar.style.width = `${Math.max(0, gameState.dogHp)}%`;
    catHpText.textContent = `${gameState.catHp} HP`;
    dogHpText.textContent = `${gameState.dogHp} HP`;
  }

  function updateTurnIndicator() {
    const isCat = (gameState.currentTurn === 'CAT');
    catAvatar.classList.toggle('turn-active', isCat);
    dogAvatar.classList.toggle('turn-active', !isCat);

    if (gameState.gameMode === '1p') {
      turnBanner.innerHTML = isCat ? '🎯 <strong>YOUR TURN</strong> (Alley Cat)' : '⏳ <strong>CPU DOG THINKING...</strong>';
    } else {
      turnBanner.innerHTML = isCat ? '🐱 <strong>PLAYER 1: ALLEY CAT</strong>' : '🐶 <strong>PLAYER 2: YARD DOG</strong>';
    }

    // Update angle slider value to reflect active player's stored angle
    const activeAngle = isCat ? gameState.catAngle : gameState.dogAngle;
    if (angleSlider) angleSlider.value = activeAngle;
    if (angleValReadout) angleValReadout.textContent = `${activeAngle}°`;
  }

  function checkTurnEnd() {
    if (gameState.activeProjectiles.length === 0 && !gameState.isGameOver) {
      // Decay fence shield bonus if active
      if (gameState.fenceShieldBonus > 0) {
        gameState.fenceShieldBonus = Math.max(0, gameState.fenceShieldBonus - 20);
      }

      gameState.currentTurn = (gameState.currentTurn === 'CAT') ? 'DOG' : 'CAT';
      randomizeWind();
      updateTurnIndicator();

      if (gameState.gameMode === '1p' && gameState.currentTurn === 'DOG') {
        throwBtn.disabled = true;
        executeAiTurn();
      } else {
        throwBtn.disabled = false;
      }
    }
  }

  /* =========================================================================
     AI DOG ENGINE (ROOKIE, PRO, MASTER TIERS)
     ========================================================================= */
  function executeAiTurn() {
    if (gameState.dogHp <= 0 || gameState.catHp <= 0 || gameState.isGameOver) return;

    const diffCfg = DATA.aiDifficulties[gameState.difficulty] || DATA.aiDifficulties.pro;
    showToast('DOG IS AIMING...', '#ea580c');

    setTimeout(() => {
      if (gameState.isGameOver) return;

      // Base force to reach cat (~700px horizontal span) at 45 degree angle
      const baseForce = 63;
      // Headwind blowing East (+wind) resists throw -> Dog needs MORE force
      // Tailwind blowing West (-wind) assists throw -> Dog needs LESS force
      const windAdj = gameState.windSpeed * (1.5 * diffCfg.windCompensation);
      const variance = (Math.random() * 2 - 1) * diffCfg.errorVariance;
      const targetForce = Math.min(96, Math.max(42, baseForce + windAdj + variance));

      // AI weapon selection
      let aiWeapon = DATA.weapons.fish;
      if (gameState.difficulty === 'master' && Math.random() > 0.4) {
        aiWeapon = DATA.weapons.anvil;
      } else if (Math.random() > 0.6) {
        aiWeapon = DATA.weapons.bouncy;
      }

      gameState.dogAngle = Math.round(42 + (Math.random() * 6 - 3));
      launchProjectile(DOG.x + 15, DOG.y + 35, 180 - gameState.dogAngle, targetForce, aiWeapon, 'DOG');
    }, diffCfg.delayMs);
  }

  /* =========================================================================
     MATCH OVER & VICTORY PRESENTATION
     ========================================================================= */
  function checkMatchOver() {
    if (gameState.catHp <= 0 || gameState.dogHp <= 0) {
      gameState.isGameOver = true;
      AUDIO.playFanfare();

      const isCatWinner = (gameState.catHp > 0);
      winnerTrophy.textContent = isCatWinner ? '🐱🏆' : '🐶🏆';
      winnerText.textContent = isCatWinner ? 'ALLEY CAT WINS!' : 'YARD DOG WINS!';

      const lines = isCatWinner ? [
        `"The cat threw the projectile OVER the tall fence!"`,
        `"The missile splashed directly INTO the dog's yard!"`,
        `"Victory achieved with ${gameState.catHp} HP remaining!"`
      ] : [
        `"The dog hurled the bone ACROSS the wooden barrier!"`,
        `"The bone landed right ON TOP OF the metal bin!"`,
        `"Brilliant effort! Practice prepositions to win next time!"`
      ];

      lines.forEach((txt, idx) => {
        const el = document.getElementById(`line-${idx}`);
        if (el) el.textContent = txt;
      });

      victoryModal.style.display = 'flex';
      AUDIO.speak(isCatWinner ? 'Alley Cat Wins! You mastered your prepositions!' : 'Yard Dog Wins! Good effort!');
      return true;
    }
    return false;
  }

  function resetMatch() {
    victoryModal.style.display = 'none';
    gameState.catHp = 100;
    gameState.dogHp = 100;
    gameState.isGameOver = false;
    gameState.currentTurn = 'CAT';
    gameState.activeProjectiles = [];
    gameState.particleBursts = [];
    gameState.smokeTrails = [];
    gameState.impactStars = [];
    gameState.fenceShieldBonus = 0;
    gameState.isDoubleVolley = false;
    randomizeWind();
    updateHealthHUD();
    updateTurnIndicator();
    throwBtn.disabled = false;
    AUDIO.playChime();
  }

  /* =========================================================================
     PREPOSITION LINGUISTIC GATE MODAL
     ========================================================================= */
  function triggerPrepositionGate(callback) {
    const list = DATA.challenges;
    const q = list[Math.floor(Math.random() * list.length)];

    challengeIcon.textContent = q.icon;
    challengeText.textContent = q.prompt;
    challengeOptions.innerHTML = '';

    AUDIO.speak(q.prompt);

    q.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'btn-opt';
      btn.textContent = optText;
      btn.onclick = () => {
        prepositionModal.style.display = 'none';
        if (idx === q.correct) {
          AUDIO.playChime();
          AUDIO.speak(q.reinforce);
          callback(true);
        } else {
          AUDIO.playWoodHit();
          AUDIO.speak('Not quite! Remember your prepositions and try again!');
          callback(false);
        }
      };
      challengeOptions.appendChild(btn);
    });

    prepositionModal.style.display = 'flex';
  }

  function showToast(text, color = '#f59e0b') {
    combatToast.textContent = text;
    combatToast.style.borderColor = color;
    combatToast.classList.add('show');
    setTimeout(() => combatToast.classList.remove('show'), 1600);
  }

  function triggerScreenShake() {
    arenaViewport.classList.remove('screen-shake');
    // Force reflow
    void arenaViewport.offsetWidth;
    arenaViewport.classList.add('screen-shake');
  }

  /* =========================================================================
     PSEUDO-3D VOLUMETRIC RENDERING ROUTINES
     ========================================================================= */
  function drawSkyAndAlley() {
    // 1. Night sky with moonlight bloom
    const sky = ctx.createRadialGradient(240, 100, 20, 240, 100, 480);
    sky.addColorStop(0, '#1e2952');
    sky.addColorStop(0.4, '#0f172a');
    sky.addColorStop(1, '#050814');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

    // Moonlight Disc
    ctx.fillStyle = 'rgba(254, 240, 138, 0.15)';
    ctx.beginPath();
    ctx.arc(240, 100, 75, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath();
    ctx.arc(240, 100, 36, 0, Math.PI * 2);
    ctx.fill();

    // 2. Layered distant city skyline with warm glowing windows
    ctx.fillStyle = 'rgba(10, 15, 30, 0.85)';
    const buildings = [
      { x: 30, y: 130, w: 90, h: 220 },
      { x: 140, y: 90, w: 105, h: 260 },
      { x: 270, y: 160, w: 80, h: 190 },
      { x: 620, y: 140, w: 95, h: 210 },
      { x: 740, y: 80, w: 115, h: 270 },
      { x: 880, y: 120, w: 90, h: 230 }
    ];
    buildings.forEach(b => {
      ctx.fillRect(b.x, b.y, b.w, b.h);
      // Windows
      ctx.fillStyle = 'rgba(253, 224, 71, 0.45)';
      for (let wx = b.x + 12; wx < b.x + b.w - 15; wx += 22) {
        for (let wy = b.y + 20; wy < b.y + b.h - 40; wy += 32) {
          if (Math.sin(wx * 11 + wy) > -0.2) {
            ctx.fillRect(wx, wy, 10, 14);
          }
        }
      }
      ctx.fillStyle = 'rgba(10, 15, 30, 0.85)';
    });

    // 3. Streetlamp on alley wall casting radial light cone
    ctx.fillStyle = '#334155';
    ctx.fillRect(40, 190, 8, 190); // pole
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(44, 185, 14, 0, Math.PI * 2); // bulb
    ctx.fill();

    // Streetlamp Light Cone
    const lampCone = ctx.createRadialGradient(44, 185, 10, 44, 280, 220);
    lampCone.addColorStop(0, 'rgba(253, 224, 71, 0.28)');
    lampCone.addColorStop(0.7, 'rgba(245, 158, 11, 0.06)');
    lampCone.addColorStop(1, 'transparent');
    ctx.fillStyle = lampCone;
    ctx.beginPath();
    ctx.moveTo(44, 185);
    ctx.lineTo(-40, 450);
    ctx.lineTo(240, 450);
    ctx.closePath();
    ctx.fill();

    // 4. Alley Wall & 3D Trash Can (Cat's Pedestal)
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(0, 170, 160, 250);

    draw3DTrashCan(85, 365, 105, 85);

    // 5. Right Yard Lawn & 3D Dog Bowl
    const lawn = ctx.createLinearGradient(0, 410, 0, V_HEIGHT);
    lawn.addColorStop(0, '#15803d');
    lawn.addColorStop(1, '#052e16');
    ctx.fillStyle = lawn;
    ctx.fillRect(495, 415, 465, 85);

    draw3DDogBowl(815, 435, 46, 20);

    // 6. Ground Cobblestone Pavement
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 440, V_WIDTH, 60);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 440, V_WIDTH, 2);

    // 7. The 3D Wooden Fence with Beveled Planks, Cap & Metallic Nails
    draw3DFence();
  }

  function draw3DTrashCan(x, y, w, h) {
    // 3D Metallic Cylinder
    const metalGrad = ctx.createLinearGradient(x, 0, x + w, 0);
    metalGrad.addColorStop(0, '#475569');
    metalGrad.addColorStop(0.3, '#94a3b8');
    metalGrad.addColorStop(0.7, '#64748b');
    metalGrad.addColorStop(1, '#1e293b');

    // Body
    ctx.fillStyle = metalGrad;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, [6, 6, 2, 2]);
    ctx.fill();

    // Metallic corrugated ribs
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;
    [y + 20, y + 42, y + 64].forEach(ry => {
      ctx.beginPath();
      ctx.moveTo(x + 4, ry);
      ctx.lineTo(x + w - 4, ry);
      ctx.stroke();
    });

    // Lid Rim
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y, w / 2 + 5, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function draw3DDogBowl(x, y, rx, ry) {
    // Ground Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(x, y + 10, rx + 6, ry + 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Red Ceramic Bowl Outer Rim
    const bowlGrad = ctx.createLinearGradient(x - rx, 0, x + rx, 0);
    bowlGrad.addColorStop(0, '#dc2626');
    bowlGrad.addColorStop(0.4, '#f87171');
    bowlGrad.addColorStop(1, '#7f1d1d');
    ctx.fillStyle = bowlGrad;
    ctx.beginPath();
    ctx.ellipse(x, y + 4, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Inner Dish Cavity with Bone Debris
    ctx.fillStyle = '#450a0a';
    ctx.beginPath();
    ctx.ellipse(x, y, rx - 6, ry - 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bone inside bowl
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(x - 14, y - 4, 28, 8, 3);
    ctx.fill();
  }

  function draw3DFence() {
    const fenceTopY = FENCE.y - gameState.fenceShieldBonus;
    const fenceHeight = FENCE.height + gameState.fenceShieldBonus;

    // Ground Shadow for Fence
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.ellipse(FENCE.x + FENCE.width / 2, 445, FENCE.width + 10, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Vertical wooden planks with bevels
    const plankWidth = 18;
    for (let px = FENCE.x; px < FENCE.x + FENCE.width; px += plankWidth) {
      const wood = ctx.createLinearGradient(px, 0, px + plankWidth, 0);
      wood.addColorStop(0, '#92400e');
      wood.addColorStop(0.35, '#d97706');
      wood.addColorStop(0.7, '#b45309');
      wood.addColorStop(1, '#78350f');

      ctx.fillStyle = wood;
      ctx.fillRect(px, fenceTopY, plankWidth - 2, fenceHeight);

      // Wood Grain Texture Highlights
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.2)';
      ctx.lineWidth = 1.2;
      for (let py = fenceTopY + 15; py < fenceTopY + fenceHeight; py += 32) {
        ctx.beginPath();
        ctx.moveTo(px + 3, py);
        ctx.lineTo(px + plankWidth - 5, py);
        ctx.stroke();
      }

      // Metallic Nail Studs
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(px + plankWidth / 2 - 1, fenceTopY + 28, 3, 0, Math.PI * 2);
      ctx.arc(px + plankWidth / 2 - 1, fenceTopY + fenceHeight - 45, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Top Bevel Cap
    ctx.fillStyle = '#b45309';
    ctx.fillRect(FENCE.x - 4, fenceTopY - 6, FENCE.width + 8, 10);
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 2;
    ctx.strokeRect(FENCE.x - 4, fenceTopY - 6, FENCE.width + 8, 10);

    // Glowing Shield Barrier when Power-up is active
    if (gameState.fenceShieldBonus > 0) {
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.85)';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 18;
      ctx.strokeRect(FENCE.x - 8, fenceTopY - 10, FENCE.width + 16, fenceHeight + 12);
      ctx.shadowBlur = 0;
    }
  }

  /* =========================================================================
     VOLUMETRIC CHARACTER RENDERING & EYE TRACKING
     ========================================================================= */
  function drawVolumetricCat(x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Ground Shadow Disk
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(50, 78, 44, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Spherical Volumetric Body
    const bodyGrad = ctx.createRadialGradient(38, 36, 6, 50, 48, 45);
    bodyGrad.addColorStop(0, '#38bdf8');
    bodyGrad.addColorStop(0.55, '#0284c7');
    bodyGrad.addColorStop(1, '#034a75');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.roundRect(20, 16, 58, 54, 18);
    ctx.fill();

    // Cat Ears with depth
    ctx.fillStyle = '#0369a1';
    ctx.beginPath();
    ctx.moveTo(24, 18); ctx.lineTo(12, -8); ctx.lineTo(44, 14); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(74, 18); ctx.lineTo(86, -8); ctx.lineTo(56, 14); ctx.fill();

    // Inner pink ears
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.moveTo(24, 15); ctx.lineTo(16, -2); ctx.lineTo(38, 14); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(74, 15); ctx.lineTo(82, -2); ctx.lineTo(60, 14); ctx.fill();

    // Ambient Specular Highlight on head
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.ellipse(36, 24, 12, 6, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Eyes tracking flying projectile
    const targetPos = getProjectileFocusPos();
    const eyeAngle = Math.atan2(targetPos.y - (y + 38), targetPos.x - (x + 50));
    const pupilDx = Math.cos(eyeAngle) * 3.5;
    const pupilDy = Math.sin(eyeAngle) * 2.5;

    // Eyeballs
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(38, 38, 9, 13, 0, 0, Math.PI * 2);
    ctx.ellipse(62, 38, 9, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dynamic Pupils
    ctx.fillStyle = '#0b0f19';
    ctx.beginPath();
    ctx.arc(38 + pupilDx, 38 + pupilDy, 4.5, 0, Math.PI * 2);
    ctx.arc(62 + pupilDx, 38 + pupilDy, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Eye catch-light glints
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(36 + pupilDx, 36 + pupilDy, 1.8, 0, Math.PI * 2);
    ctx.arc(60 + pupilDx, 36 + pupilDy, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Whiskers
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(18, 44); ctx.lineTo(-6, 40);
    ctx.moveTo(18, 50); ctx.lineTo(-6, 52);
    ctx.moveTo(82, 44); ctx.lineTo(106, 40);
    ctx.moveTo(82, 50); ctx.lineTo(106, 52);
    ctx.stroke();

    // Paw
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(80, 56, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawVolumetricDog(x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Ground Shadow Disk
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(50, 80, 48, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Spherical Volumetric Body
    const bodyGrad = ctx.createRadialGradient(38, 34, 8, 50, 48, 48);
    bodyGrad.addColorStop(0, '#f97316');
    bodyGrad.addColorStop(0.55, '#d97706');
    bodyGrad.addColorStop(1, '#78350f');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.roundRect(18, 16, 64, 60, 20);
    ctx.fill();

    // Floppy 3D Ears
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.ellipse(16, 32, 11, 24, 0.28, 0, Math.PI * 2);
    ctx.ellipse(84, 32, 11, 24, -0.28, 0, Math.PI * 2);
    ctx.fill();

    // Spiked Collar
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(18, 62, 64, 12);
    ctx.fillStyle = '#ffffff';
    for (let sp = 24; sp <= 76; sp += 12) {
      ctx.beginPath();
      ctx.moveTo(sp, 62); ctx.lineTo(sp + 4, 55); ctx.lineTo(sp + 8, 62); ctx.fill();
    }

    // Ambient Specular Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.ellipse(36, 24, 14, 6, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Eye Tracking
    const targetPos = getProjectileFocusPos();
    const eyeAngle = Math.atan2(targetPos.y - (y + 36), targetPos.x - (x + 50));
    const pupilDx = Math.cos(eyeAngle) * 3.5;
    const pupilDy = Math.sin(eyeAngle) * 2.5;

    // Eyes
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(38, 36, 8.5, 12, 0, 0, Math.PI * 2);
    ctx.ellipse(62, 36, 8.5, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#050814';
    ctx.beginPath();
    ctx.arc(38 + pupilDx, 36 + pupilDy, 4.2, 0, Math.PI * 2);
    ctx.arc(62 + pupilDx, 36 + pupilDy, 4.2, 0, Math.PI * 2);
    ctx.fill();

    // Glint
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(36 + pupilDx, 34 + pupilDy, 1.8, 0, Math.PI * 2);
    ctx.arc(60 + pupilDx, 34 + pupilDy, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // 3D Muzzle & Black Snout
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.ellipse(50, 48, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#050814';
    ctx.beginPath();
    ctx.arc(50, 44, 5.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function getProjectileFocusPos() {
    if (gameState.activeProjectiles.length > 0) {
      return { x: gameState.activeProjectiles[0].x, y: gameState.activeProjectiles[0].y };
    }
    // Idle focus: look across fence toward each other
    return (gameState.currentTurn === 'CAT') ? { x: DOG.x + 40, y: DOG.y + 40 } : { x: CAT.x + 40, y: CAT.y + 40 };
  }

  /* =========================================================================
     PROJECTILE RENDERING & PREDICTIVE GUIDELINE
     ========================================================================= */
  function drawProjectile(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    if (p.weapon.id === 'fish') {
      // 3D Stinky Cyan Fish
      ctx.fillStyle = '#e0f2fe';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(14, 0); ctx.lineTo(4, -8); ctx.lineTo(4, 8); ctx.closePath();
      ctx.fill(); ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(4, 0); ctx.lineTo(-18, 0);
      ctx.moveTo(-2, -6); ctx.lineTo(-2, 6);
      ctx.moveTo(-8, -6); ctx.lineTo(-8, 6);
      ctx.moveTo(-14, -6); ctx.lineTo(-14, 6);
      ctx.moveTo(-18, 0); ctx.lineTo(-24, -8);
      ctx.moveTo(-18, 0); ctx.lineTo(-24, 8);
      ctx.stroke();

    } else if (p.weapon.id === 'balloon') {
      // Shaded Water Balloon
      const balGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, 14);
      balGrad.addColorStop(0, '#67e8f9');
      balGrad.addColorStop(0.7, '#06b6d4');
      balGrad.addColorStop(1, '#0e7490');
      ctx.fillStyle = balGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0891b2';
      ctx.fillRect(-17, -2, 4, 4);

    } else if (p.weapon.id === 'anvil') {
      // Heavy Metallic Iron Anvil
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(-18, -12); ctx.lineTo(18, -12); ctx.lineTo(14, -2);
      ctx.lineTo(8, 12); ctx.lineTo(-14, 12); ctx.lineTo(-14, -2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.stroke();

    } else if (p.weapon.id === 'bouncy') {
      // Green Bouncy Ball with highlights
      const ballGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, 12);
      ballGrad.addColorStop(0, '#bef264');
      ballGrad.addColorStop(0.65, '#84cc16');
      ballGrad.addColorStop(1, '#4d7c0f');
      ctx.fillStyle = ballGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawPredictiveArc() {
    if (!canActivePlayerThrow()) return;

    const angle = (gameState.currentTurn === 'CAT') ? gameState.catAngle : gameState.dogAngle;
    const originX = (gameState.currentTurn === 'CAT') ? (CAT.x + CAT.width - 15) : (DOG.x + 15);
    const originY = (gameState.currentTurn === 'CAT') ? (CAT.y + 35) : (DOG.y + 35);
    const rad = ((gameState.currentTurn === 'CAT') ? angle : (180 - angle)) * Math.PI / 180;

    // Use current charging power or default reference force 60 for the dotted line
    const simForce = Math.max(35, gameState.currentPower || 60);
    const weapon = DATA.weapons[gameState.currentWeaponId] || DATA.weapons.fish;

    let sx = originX;
    let sy = originY;
    let svx = Math.cos(rad) * (simForce * weapon.speedMult);
    let svy = -Math.sin(rad) * (simForce * weapon.speedMult);

    ctx.save();
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = (gameState.currentTurn === 'CAT') ? 'rgba(56, 189, 248, 0.5)' : 'rgba(251, 146, 60, 0.5)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);

    // Show first 15 steps (~15% trajectory)
    for (let step = 0; step < 14; step++) {
      svx += gameState.windSpeed * 0.009;
      svy += (BASE_GRAVITY * weapon.gravityMult);
      sx += svx;
      sy += svy;
      ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    ctx.restore();
  }

  /* =========================================================================
     60FPS MASTER ANIMATION & PHYSICS ENGINE
     ========================================================================= */
  function startAnimationLoop() {
    if (!gameState.gameLoopRunning) {
      gameState.gameLoopRunning = true;
      requestAnimationFrame(gameLoop);
    }
  }

  function gameLoop() {
    // 1. Clear & Render Background
    ctx.clearRect(0, 0, V_WIDTH, V_HEIGHT);
    drawSkyAndAlley();

    // 2. Render Characters & Predictive Arc
    drawVolumetricCat(CAT.x, CAT.y);
    drawVolumetricDog(DOG.x, DOG.y);
    drawPredictiveArc();

    // 3. Update & Draw Fading Smoke Trails
    for (let i = gameState.smokeTrails.length - 1; i >= 0; i--) {
      const smk = gameState.smokeTrails[i];
      smk.alpha -= 0.032;
      smk.size += 0.25;
      if (smk.alpha <= 0) {
        gameState.smokeTrails.splice(i, 1);
        continue;
      }
      ctx.fillStyle = smk.color;
      ctx.globalAlpha = smk.alpha;
      ctx.beginPath();
      ctx.arc(smk.x, smk.y, smk.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    // 4. Update & Draw Impact Particle Bursts
    for (let i = gameState.particleBursts.length - 1; i >= 0; i--) {
      const pt = gameState.particleBursts[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life -= 0.038;
      if (pt.life <= 0) {
        gameState.particleBursts.splice(i, 1);
        continue;
      }
      ctx.fillStyle = pt.color;
      ctx.globalAlpha = pt.life;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    // 5. Update & Draw Comic Starburst Decals
    for (let i = gameState.impactStars.length - 1; i >= 0; i--) {
      const star = gameState.impactStars[i];
      star.life -= 0.045;
      star.scale += 0.04;
      if (star.life <= 0) {
        gameState.impactStars.splice(i, 1);
        continue;
      }
      drawComicStarburst(star.x, star.y, star.scale, star.color, star.life);
    }

    // 6. Update Active Projectiles
    for (let i = gameState.activeProjectiles.length - 1; i >= 0; i--) {
      const p = gameState.activeProjectiles[i];

      // Physics acceleration: wind + weapon gravity
      p.vx += (gameState.windSpeed * 0.009);
      p.vy += (BASE_GRAVITY * p.weapon.gravityMult);
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += (p.vx > 0 ? 0.16 : -0.16);
      p.lifeTicks++;

      // Leave smoke trail
      if (p.lifeTicks % 2 === 0) {
        gameState.smokeTrails.push({
          x: p.x,
          y: p.y,
          size: Math.random() * 4 + 3,
          color: p.weapon.trailColor,
          alpha: 0.65
        });
      }

      drawProjectile(p);

      // --- COLLISION: Fence ---
      const fenceTopY = FENCE.y - gameState.fenceShieldBonus;
      const fenceHeight = FENCE.height + gameState.fenceShieldBonus;

      if (p.x >= FENCE.x && p.x <= FENCE.x + FENCE.width && p.y >= fenceTopY && p.y <= fenceTopY + fenceHeight) {
        if (p.weapon.id === 'bouncy' && p.bouncesLeft > 0) {
          // Bouncy ball bounces off fence
          p.bouncesLeft--;
          p.vx = -p.vx * 0.75;
          p.vy = -p.vy * 0.65;
          AUDIO.playBoing();
          spawnParticles(p.x, p.y, '#84cc16', 8);
          showToast('BOUNCED OFF FENCE! 🎾', '#84cc16');
          continue;
        }

        AUDIO.playWoodHit();
        spawnParticles(p.x, p.y, '#b45309', 14);
        showToast('HIT THE FENCE!', '#ef4444');
        AUDIO.speak('Oh no! It hit the fence! Throw higher OVER the fence!');
        gameState.activeProjectiles.splice(i, 1);
        checkTurnEnd();
        continue;
      }

      // --- COLLISION: Hit Dog (Cat threw) ---
      if (p.shooter === 'CAT' && p.x >= DOG.x && p.x <= DOG.x + DOG.width && p.y >= DOG.y && p.y <= DOG.y + DOG.height) {
        handleDirectHit(p, 'DOG');
        gameState.activeProjectiles.splice(i, 1);
        if (checkMatchOver()) return;
        checkTurnEnd();
        continue;
      }

      // --- COLLISION: Hit Cat (Dog threw) ---
      if (p.shooter === 'DOG' && p.x >= CAT.x && p.x <= CAT.x + CAT.width && p.y >= CAT.y && p.y <= CAT.y + CAT.height) {
        handleDirectHit(p, 'CAT');
        gameState.activeProjectiles.splice(i, 1);
        if (checkMatchOver()) return;
        checkTurnEnd();
        continue;
      }

      // --- COLLISION: Ground Lawn / Out of Bounds ---
      if (p.y >= 445) {
        if (p.weapon.id === 'bouncy' && p.bouncesLeft > 0) {
          p.bouncesLeft--;
          p.vy = -Math.abs(p.vy) * 0.7;
          AUDIO.playBoing();
          spawnParticles(p.x, 445, '#84cc16', 8);
          showToast('GROUND BOUNCE! 🎾', '#84cc16');
          continue;
        }

        if (p.weapon.id === 'balloon') {
          AUDIO.playWaterSplash();
          spawnParticles(p.x, 445, '#38bdf8', 18);
          gameState.windSpeed = 0; // Water balloon dampens wind
          updateWindDisplay();
          showToast('SPLASH! WIND CALMED!', '#38bdf8');
        } else {
          AUDIO.playImpact(false);
          spawnParticles(p.x, 445, '#64748b', 10);
        }

        gameState.activeProjectiles.splice(i, 1);
        checkTurnEnd();
        continue;
      }

      if (p.x < -40 || p.x > V_WIDTH + 40 || p.y < -150) {
        gameState.activeProjectiles.splice(i, 1);
        checkTurnEnd();
        continue;
      }
    }

    // 7. Update Hold-to-Charge Power Fill
    if (gameState.powerCharging) {
      gameState.currentPower += gameState.powerDirection * 2.2;
      if (gameState.currentPower >= 100) {
        gameState.currentPower = 100;
        gameState.powerDirection = -1;
      } else if (gameState.currentPower <= 6) {
        gameState.currentPower = 6;
        gameState.powerDirection = 1;
      }
      powerFill.style.width = `${gameState.currentPower}%`;
      powerPercent.textContent = `${Math.round(gameState.currentPower)}%`;
    }

    requestAnimationFrame(gameLoop);
  }

  function handleDirectHit(p, victim) {
    const isAnvil = (p.weapon.id === 'anvil');
    AUDIO.playImpact(isAnvil);

    triggerScreenShake();
    gameState.impactStars.push({
      x: p.x,
      y: p.y,
      scale: 0.4,
      color: isAnvil ? '#94a3b8' : '#facc15',
      life: 1.0
    });

    spawnParticles(p.x, p.y, isAnvil ? '#e2e8f0' : '#facc15', 20);

    const dmg = p.weapon.damage;
    if (victim === 'DOG') {
      gameState.dogHp = Math.max(0, gameState.dogHp - dmg);
      showToast(`DIRECT HIT! -${dmg} HP`, '#10b981');
      AUDIO.speak('Direct hit! The projectile flew OVER the fence!');
    } else {
      gameState.catHp = Math.max(0, gameState.catHp - dmg);
      showToast(`OUCH! CAT HIT! -${dmg} HP`, '#ef4444');
      AUDIO.speak('The bone landed across the fence!');
    }

    updateHealthHUD();
  }

  function drawComicStarburst(x, y, scale, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;

    // 8-point comic starburst polygon
    ctx.beginPath();
    const points = 10;
    const outerR = 34;
    const innerR = 14;
    for (let i = 0; i < points * 2; i++) {
      const r = (i % 2 === 0) ? outerR : innerR;
      const angle = (i * Math.PI) / points;
      const sx = Math.cos(angle) * r;
      const sy = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  function spawnParticles(x, y, colorHex, count = 14) {
    for (let i = 0; i < count; i++) {
      gameState.particleBursts.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 9,
        vy: (Math.random() - 0.5) * 9 - 1,
        size: Math.random() * 5 + 3,
        color: colorHex,
        life: 1.0
      });
    }
  }

  // Auto-boot on load
  window.addEventListener('DOMContentLoaded', initGame);

})(typeof window !== 'undefined' ? window : global);
