/**
 * NINJA TRIALS: BODY, BRAIN & SONIC CHALLENGES (HARD MODE)
 * Comprehensive 7-Stage State Machine, Web Audio Oscilloscope & Teleprompter Studio
 * Zero external runtime dependencies • Web Audio API & Calibrated Natural TTS
 */

(function(root) {
  'use strict';

  // --- REACTIVE PLAYER SESSION STATE ---
  const playerSession = {
    xp: 0,
    energy: 20,
    streak: 0,
    currentStage: 1,

    // Stage 1: Holographic Scanner
    scannedCategories: new Set(),

    // Stage 2: Kinetic Reaction Arena
    activeCategoryIndex: 0,
    activeTrialIndex: 0,
    completedTrialIds: new Set(),
    timerInterval: null,
    timerRemaining: 0,
    isTimerRunning: false,

    // Stage 3: Brain + Body Combinations
    activeBrainBodyIndex: 0,
    completedBrainBodyIds: new Set(),

    // Stage 4: Sound Mimic Echo Chamber
    activeSonicId: 'roar',
    masteredSonicIds: new Set(),

    // Stage 5: Decibel Stealth Radar
    currentDecibels: 18,
    isStealthTesting: false,
    masteredDecibelIds: new Set(),

    // Stage 6: Rapid Tongue Twisters
    activeTwisterIndex: 0,
    twisterInterval: null,
    twisterRemaining: 15.0,
    isTwisterRunning: false,
    masteredTwisterIds: new Set(),

    // Stage 7: Teleprompter Studio
    activeTeleprompterTemplate: null,
    isSpeaking: false,
    isActionBlocked: false
  };

  // --- ZERO-DEPENDENCY CANVAS CONFETTI ENGINE ---
  const ConfettiEngine = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,

    init: function() {
      this.canvas = document.getElementById('confettiCanvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
    },

    resize: function() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    burst: function(count = 70) {
      if (!this.canvas || !this.ctx) return;
      const colors = ['#f59e0b', '#38bdf8', '#10b981', '#ef4444', '#a855f7', '#ec4899', '#facc15'];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 260,
          y: window.innerHeight * 0.4 + (Math.random() - 0.5) * 160,
          vx: (Math.random() - 0.5) * 20,
          vy: (Math.random() - 1.2) * 18,
          size: Math.random() * 8 + 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 14,
          opacity: 1,
          gravity: 0.45
        });
      }

      if (!this.animationId) {
        this.render();
      }
    },

    render: function() {
      const self = ConfettiEngine;
      if (!self.ctx || !self.canvas) return;

      self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

      for (let i = self.particles.length - 1; i >= 0; i--) {
        const p = self.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.012;

        if (p.opacity <= 0 || p.y > self.canvas.height) {
          self.particles.splice(i, 1);
          continue;
        }

        self.ctx.save();
        self.ctx.translate(p.x, p.y);
        self.ctx.rotate((p.rotation * Math.PI) / 180);
        self.ctx.fillStyle = p.color;
        self.ctx.globalAlpha = Math.max(0, p.opacity);
        self.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        self.ctx.restore();
      }

      if (self.particles.length > 0) {
        self.animationId = requestAnimationFrame(() => self.render());
      } else {
        self.animationId = null;
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
      }
    }
  };

  // --- OSCILLOSCOPE CANVAS ENGINE (STAGE 4) ---
  const OscilloscopeEngine = {
    canvas: null,
    ctx: null,
    phase: 0,
    amplitude: 8,
    frequency: 0.03,
    targetAmplitude: 8,
    targetFrequency: 0.03,
    surgeEnergy: 0,
    animationId: null,

    init: function() {
      this.canvas = document.getElementById('oscilloscopeCanvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.start();
    },

    start: function() {
      if (this.animationId) return;
      const loop = () => {
        this.draw();
        this.animationId = requestAnimationFrame(loop);
      };
      this.animationId = requestAnimationFrame(loop);
    },

    stop: function() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    },

    triggerSurge: function(type = 'roar') {
      const label = document.getElementById('oscWaveformLabel');
      if (type === 'roar') {
        this.targetAmplitude = 45;
        this.targetFrequency = 0.018;
        this.surgeEnergy = 1.0;
        if (label) label.textContent = 'Acoustic Signature: Tiger Roar (Low Resonance)';
      } else if (type === 'hiss') {
        this.targetAmplitude = 22;
        this.targetFrequency = 0.09;
        this.surgeEnergy = 0.9;
        if (label) label.textContent = 'Acoustic Signature: Viper Hiss (High Noise)';
      } else if (type === 'kiai') {
        this.targetAmplitude = 55;
        this.targetFrequency = 0.04;
        this.surgeEnergy = 1.2;
        if (label) label.textContent = 'Acoustic Signature: Lightning Kiai (Explosive Peak)';
      }
    },

    draw: function() {
      if (!this.ctx || !this.canvas) return;
      const w = this.canvas.width;
      const h = this.canvas.height;
      const ctx = this.ctx;

      // Dark obsidian background with grid
      ctx.fillStyle = '#060911';
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Smooth interpolation
      this.amplitude += (this.targetAmplitude - this.amplitude) * 0.08;
      this.frequency += (this.targetFrequency - this.frequency) * 0.08;
      if (this.surgeEnergy > 0) {
        this.surgeEnergy -= 0.015;
        if (this.surgeEnergy <= 0) {
          this.targetAmplitude = 8;
          this.targetFrequency = 0.03;
          const label = document.getElementById('oscWaveformLabel');
          if (label) label.textContent = 'Status: Ready';
        }
      }

      // Draw primary glowing waveform
      const midY = h / 2;
      this.phase += 0.06;

      ctx.beginPath();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;

      for (let x = 0; x < w; x++) {
        const noise = (Math.random() - 0.5) * (this.surgeEnergy * 6);
        const y = midY + Math.sin(x * this.frequency + this.phase) * this.amplitude
                       + Math.sin(x * (this.frequency * 2.1) - this.phase * 0.5) * (this.amplitude * 0.35)
                       + noise;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset
    }
  };

  // --- INITIALIZATION ---
  function initGame() {
    const data = root.NINJA_TRIALS_DATA;
    if (!data) {
      console.error('[NinjaTrials] NINJA_TRIALS_DATA not found.');
      return;
    }

    playerSession.activeTeleprompterTemplate = data.teleprompterTemplates[0];

    ConfettiEngine.init();
    OscilloscopeEngine.init();

    renderStage1Scanner();
    renderStage2Arena();
    renderStage3BrainBody();
    renderStage4Echo();
    renderStage5Stealth();
    renderStage6Twisters();
    renderStage7Studio();

    updateHUD();
  }

  // --- HUD CONTROLLER ---
  function updateHUD() {
    const xpEl = document.getElementById('hudXP');
    if (xpEl) xpEl.textContent = `⭐ +${playerSession.xp} XP`;

    const streakEl = document.getElementById('hudStreak');
    if (streakEl) streakEl.textContent = `🔥 ${playerSession.streak} Streak`;

    const fillEl = document.getElementById('hudEnergyFill');
    if (fillEl) fillEl.style.width = `${Math.min(100, Math.max(10, playerSession.energy))}%`;

    const meterNumEl = document.getElementById('hudEnergyNumber');
    if (meterNumEl) meterNumEl.textContent = `${Math.round(playerSession.energy)}%`;
  }

  function addXP(amount) {
    playerSession.xp += amount;
    playerSession.energy = Math.min(100, playerSession.energy + (amount * 0.5));
    updateHUD();

    const xpEl = document.getElementById('hudXP');
    if (xpEl) {
      xpEl.classList.remove('bounce');
      void xpEl.offsetWidth;
      xpEl.classList.add('bounce');
    }

    if (root.NinjaAudio) {
      root.NinjaAudio.playXP();
    }

    if (window.AdventureAcademy && typeof window.AdventureAcademy.awardXP === 'function') {
      try {
        window.AdventureAcademy.awardXP(amount);
      } catch (err) {
        console.warn('[NinjaTrials] AdventureAcademy.awardXP err:', err);
      }
    }
  }

  // --- STAGE ROUTER CONTROLLER (1 TO 7) ---
  function switchStage(stageNum) {
    if (stageNum < 1 || stageNum > 7) return;
    playerSession.currentStage = stageNum;

    if (root.NinjaAudio) {
      root.NinjaAudio.playSnap();
    }

    // Update Stage Stepper Tabs
    for (let i = 1; i <= 7; i++) {
      const tab = document.getElementById(`tabStage${i}`);
      const view = document.getElementById(`stagePhase${i}`);
      if (tab) {
        if (i === stageNum) {
          tab.classList.add('is-active');
        } else {
          tab.classList.remove('is-active');
        }
      }
      if (view) {
        if (i === stageNum) {
          view.classList.add('is-visible');
        } else {
          view.classList.remove('is-visible');
        }
      }
    }

    // Hook stage-specific engines
    if (stageNum === 4) {
      OscilloscopeEngine.start();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // =========================================================================
  // STAGE 1: HOLOGRAPHIC DOJO SCANNER (Discovery & Modeling)
  // =========================================================================
  function renderStage1Scanner() {
    const data = root.NINJA_TRIALS_DATA;
    const grid = document.getElementById('scannerCardsGrid');
    if (!grid || !data) return;

    grid.innerHTML = data.categories.map((cat, idx) => {
      const isScanned = playerSession.scannedCategories.has(cat.id);
      return `
        <div class="scanner-card-outer" id="scannerCard-${cat.id}" onclick="handleScanCard('${cat.id}')">
          <div class="scanner-card-inner ${isScanned ? 'is-flipped' : ''}">
            
            <!-- FRONT VIEWPORT (65% Full-Bleed Mascot Media + 35% Glass Tray) -->
            <div class="scanner-card-front" style="border-color:${cat.accent};">
              <div class="card-media-viewport">
                <span class="discipline-badge-pill" style="border-color:${cat.accent}; color:${cat.accent};">
                  ${cat.icon} Discipline 0${idx + 1}
                </span>
                
                <!-- 3D Mascot Raster Asset on Isometric Pedestal -->
                <div class="hero-character-box">
                  <img src="${cat.mascotImg}" alt="${cat.mascotName}" class="hero-character-sprite" loading="lazy">
                  <div class="pedestal-disc" style="background: radial-gradient(ellipse at center, ${cat.accentGlow} 0%, transparent 72%);"></div>
                </div>
              </div>

              <div class="card-caption-tray">
                <div class="caption-title" style="color:#ffffff;">${cat.title}</div>
                <div class="caption-mascot">${cat.mascotName} • <span style="color:${cat.accent};">${cat.belt}</span></div>
                <button type="button" class="btn-3d btn-game-gold" style="width:100%; padding:10px 14px; font-size:0.92rem; margin-top:6px;" onclick="event.stopPropagation(); handleScanCard('${cat.id}')">
                  <span>🔍</span> <span>Scan Discipline</span>
                </button>
              </div>
            </div>

            <!-- BACK VIEWPORT (Acoustic & Linguistic Drill Details) -->
            <div class="scanner-card-back" style="border-color:${cat.accent};">
              <span class="discipline-badge-pill" style="border-color:${cat.accent}; color:${cat.accent};">
                ${cat.icon} Mastered Scan
              </span>

              <div class="back-formula-box">
                <div style="font-size:0.75rem; font-weight:900; color:${cat.accent}; text-transform:uppercase;">
                  Target Linguistic Formula:
                </div>
                <div class="back-formula-text">
                  "${cat.sentenceFrame}"
                </div>
              </div>

              <p style="font-size:0.86rem; color:#cbd5e1; line-height:1.45;">
                ${cat.description}
              </p>

              <div style="display:flex; flex-direction:column; gap:8px; width:100%; margin-top:auto;">
                <button type="button" class="btn-3d btn-game-cyan" style="padding:10px 14px; font-size:0.92rem;" onclick="event.stopPropagation(); speakCardFormula('${cat.id}')">
                  <span>🔊</span> <span>Hear Formula</span>
                </button>
                <div style="font-size:0.78rem; text-align:center; color:#94a3b8; font-weight:800;">
                  Tap anywhere to flip back
                </div>
              </div>
            </div>

          </div>
        </div>
      `;
    }).join('');
  }

  function handleScanCard(categoryId) {
    const cardEl = document.getElementById(`scannerCard-${categoryId}`);
    if (!cardEl) return;

    const inner = cardEl.querySelector('.scanner-card-inner');
    if (!inner) return;

    inner.classList.toggle('is-flipped');
    if (root.NinjaAudio) {
      root.NinjaAudio.playCardFlip();
    }

    if (!playerSession.scannedCategories.has(categoryId)) {
      playerSession.scannedCategories.add(categoryId);
      addXP(5); // +5 XP per scanned discipline, up to 35 XP

      const data = root.NINJA_TRIALS_DATA;
      if (data && playerSession.scannedCategories.size === data.categories.length) {
        const notice = document.getElementById('stage1SuccessNotice');
        if (notice) {
          notice.style.display = 'flex';
          ConfettiEngine.burst(50);
          if (root.NinjaAudio) root.NinjaAudio.playFanfare();
        }
      }
    }
  }

  function speakCardFormula(categoryId) {
    const data = root.NINJA_TRIALS_DATA;
    if (!data) return;
    const cat = data.categories.find(c => c.id === categoryId);
    if (!cat) return;

    if (root.NinjaAudio) {
      root.NinjaAudio.speak(cat.sentenceFrame);
    }
  }

  // =========================================================================
  // STAGE 2: THE KINETIC REACTION ARENA (Active Stopwatch Drills)
  // =========================================================================
  function renderStage2Arena() {
    renderCategoryRail();
    renderKineticMainStage();
  }

  function renderCategoryRail() {
    const rail = document.getElementById('categoryNavRail');
    const data = root.NINJA_TRIALS_DATA;
    if (!rail || !data) return;

    // Categories 1 to 4 are kinetic physical categories
    const physicalCats = data.categories.slice(0, 4);

    rail.innerHTML = physicalCats.map((cat, idx) => {
      const isSelected = (idx === playerSession.activeCategoryIndex);
      const catChallenges = data.challenges.filter(c => c.categoryId === cat.id);
      const completedCount = catChallenges.filter(c => playerSession.completedTrialIds.has(c.id)).length;
      const isAllDone = (catChallenges.length > 0 && completedCount === catChallenges.length);

      return `
        <button type="button" class="category-rail-btn ${isSelected ? 'is-selected' : ''}" onclick="selectKineticCategory(${idx})" style="border-left: 5px solid ${cat.accent};">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:1.05rem; font-weight:900; color:#ffffff;">
              ${cat.icon} ${cat.title}
            </span>
            ${isAllDone ? '<span class="status-badge is-done">✓ DONE</span>' : ''}
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; color:#94a3b8; font-weight:800;">
            <span>${cat.belt}</span>
            <span>${completedCount}/${catChallenges.length} Trials</span>
          </div>
        </button>
      `;
    }).join('');
  }

  function selectKineticCategory(idx) {
    playerSession.activeCategoryIndex = idx;
    playerSession.activeTrialIndex = 0;
    resetStopwatch();
    if (root.NinjaAudio) root.NinjaAudio.playSnap();
    renderCategoryRail();
    renderKineticMainStage();
  }

  function renderKineticMainStage() {
    const container = document.getElementById('kineticMainStageContainer');
    const data = root.NINJA_TRIALS_DATA;
    if (!container || !data) return;

    const physicalCats = data.categories.slice(0, 4);
    const currentCat = physicalCats[playerSession.activeCategoryIndex] || physicalCats[0];
    const catChallenges = data.challenges.filter(c => c.categoryId === currentCat.id);
    const activeTrial = catChallenges[playerSession.activeTrialIndex] || catChallenges[0];

    const isMastered = playerSession.completedTrialIds.has(activeTrial.id);

    container.innerHTML = `
      <div class="active-kinetic-stage">
        
        <!-- Trial Navigation Header & Stepper -->
        <div class="trial-selector-bar">
          <div>
            <span class="hud-tag" style="background:${currentCat.accentGlow}; border-color:${currentCat.accent}; color:#ffffff;">
              Trial 0${playerSession.activeTrialIndex + 1} of 0${catChallenges.length}
            </span>
            <h3 style="font-size:1.35rem; font-weight:900; color:#ffffff; margin-top:6px;">
              ${activeTrial.title}
            </h3>
          </div>
          <div class="trial-arrow-nav">
            <button type="button" class="btn-arrow" onclick="prevKineticTrial()" ${playerSession.activeTrialIndex === 0 ? 'disabled' : ''}>
              ←
            </button>
            <button type="button" class="btn-arrow" onclick="nextKineticTrial()" ${playerSession.activeTrialIndex === catChallenges.length - 1 ? 'disabled' : ''}>
              →
            </button>
          </div>
        </div>

        <!-- Hero Viewport with 3D Character on Isometric Pedestal -->
        <div class="hero-character-box" style="margin: 0 auto; height: 180px;">
          <img src="${currentCat.mascotImg}" alt="${currentCat.mascotName}" class="hero-character-sprite" style="max-height:160px;">
          <div class="pedestal-disc" style="background: radial-gradient(ellipse at center, ${currentCat.accentGlow} 0%, transparent 72%);"></div>
        </div>

        <!-- Modal Ability Question Card -->
        <div class="inquiry-bubble">
          <div style="font-size:0.8rem; font-weight:900; color:${currentCat.accent}; text-transform:uppercase;">
            🥋 Question of Ability:
          </div>
          <div class="inquiry-question">
            "${activeTrial.question}"
          </div>
          <button type="button" class="btn-3d btn-game-cyan" style="align-self:flex-start; padding:8px 16px; font-size:0.88rem;" onclick="speakActiveTrialQuestion()">
            <span>🔊</span> <span>Hear Question</span>
          </button>
        </div>

        <!-- Instructional Guidance -->
        <div style="background:rgba(15,23,42,0.85); border:2px solid #334155; border-radius:18px; padding:18px 22px; width:100%;">
          <div style="font-size:0.85rem; font-weight:900; color:#94a3b8; text-transform:uppercase; margin-bottom:4px;">
            Execution Directives:
          </div>
          <p style="font-size:1.02rem; color:#f1f5f9; line-height:1.5;">
            ${activeTrial.instruction}
          </p>
          <div style="display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;">
            <span class="hud-tag" style="background:rgba(56,189,248,0.15); border-color:#0284c7; color:#38bdf8;">
              Target: ${activeTrial.manner}
            </span>
            <span class="hud-tag" style="background:rgba(245,158,11,0.15); border-color:#b45309; color:#f59e0b;">
              🛡️ ${activeTrial.safetyTip}
            </span>
          </div>
        </div>

        <!-- Interactive Stopwatch Control Box -->
        <div class="stopwatch-container">
          <div style="font-size:0.85rem; font-weight:900; color:#94a3b8; text-transform:uppercase; letter-spacing:1px;">
            Digital Dojo Stopwatch
          </div>
          <div class="digital-stopwatch-readout" id="stopwatchDisplay">
            ${activeTrial.timerSeconds ? String(activeTrial.timerSeconds).padStart(2, '0') + ':00' : 'ACTIVE'}
          </div>
          <div class="stopwatch-controls">
            <button type="button" class="btn-3d btn-game-amber" id="btnStartStopwatch" onclick="startStopwatch(${activeTrial.timerSeconds || 15})">
              <span>▶</span> <span>Start Timer</span>
            </button>
            <button type="button" class="btn-3d btn-game-crimson" onclick="stopStopwatch()">
              <span>⏹</span> <span>Stop &amp; Whistle</span>
            </button>
            <button type="button" class="btn-3d btn-game-cyan" onclick="resetStopwatch(${activeTrial.timerSeconds || 15})">
              <span>↺</span> <span>Reset</span>
            </button>
          </div>
        </div>

        <!-- Rubber Stamp Affirmation CTA -->
        <div style="position:relative; width:100%; display:flex; justify-content:center; margin-top:8px;">
          <div class="rubber-stamp-seal ${isMastered ? 'is-stamped' : ''}" id="trialStampSeal">
            I CAN DO IT!
          </div>
          <button type="button" class="btn-3d btn-game-emerald" id="btnStampTrial" onclick="stampTrialMastery('${activeTrial.id}', ${activeTrial.xp})" style="font-size:1.25rem; padding:18px 36px;">
            <span>✓</span> <span>I Completed It! "YES, I CAN!" (+${activeTrial.xp} XP)</span>
          </button>
        </div>

      </div>
    `;
  }

  function prevKineticTrial() {
    if (playerSession.activeTrialIndex > 0) {
      playerSession.activeTrialIndex--;
      resetStopwatch();
      renderKineticMainStage();
    }
  }

  function nextKineticTrial() {
    const data = root.NINJA_TRIALS_DATA;
    const physicalCats = data.categories.slice(0, 4);
    const currentCat = physicalCats[playerSession.activeCategoryIndex];
    const catChallenges = data.challenges.filter(c => c.categoryId === currentCat.id);

    if (playerSession.activeTrialIndex < catChallenges.length - 1) {
      playerSession.activeTrialIndex++;
      resetStopwatch();
      renderKineticMainStage();
    }
  }

  function speakActiveTrialQuestion() {
    const data = root.NINJA_TRIALS_DATA;
    const physicalCats = data.categories.slice(0, 4);
    const currentCat = physicalCats[playerSession.activeCategoryIndex];
    const catChallenges = data.challenges.filter(c => c.categoryId === currentCat.id);
    const activeTrial = catChallenges[playerSession.activeTrialIndex];

    if (root.NinjaAudio && activeTrial) {
      root.NinjaAudio.speak(activeTrial.question);
    }
  }

  function startStopwatch(seconds = 15) {
    if (playerSession.isTimerRunning) return;
    playerSession.isTimerRunning = true;
    playerSession.timerRemaining = seconds;

    const display = document.getElementById('stopwatchDisplay');
    const startBtn = document.getElementById('btnStartStopwatch');
    if (startBtn) startBtn.classList.add('is-pressed');

    if (root.NinjaAudio) root.NinjaAudio.playSnap();

    clearInterval(playerSession.timerInterval);
    playerSession.timerInterval = setInterval(() => {
      playerSession.timerRemaining--;

      if (display) {
        display.textContent = `00:${String(playerSession.timerRemaining).padStart(2, '0')}`;
      }

      if (root.NinjaAudio) {
        root.NinjaAudio.playTimerTick();
      }

      if (playerSession.timerRemaining <= 0) {
        clearInterval(playerSession.timerInterval);
        playerSession.isTimerRunning = false;
        if (startBtn) startBtn.classList.remove('is-pressed');
        if (display) display.textContent = 'FREEZE!';
        if (root.NinjaAudio) {
          root.NinjaAudio.playWhistle();
        }
      }
    }, 1000);
  }

  function stopStopwatch() {
    if (playerSession.timerInterval) {
      clearInterval(playerSession.timerInterval);
      playerSession.timerInterval = null;
    }
    playerSession.isTimerRunning = false;
    const startBtn = document.getElementById('btnStartStopwatch');
    if (startBtn) startBtn.classList.remove('is-pressed');

    const display = document.getElementById('stopwatchDisplay');
    if (display) display.textContent = 'STOP!';

    if (root.NinjaAudio) {
      root.NinjaAudio.playWhistle();
    }
  }

  function resetStopwatch(seconds = 15) {
    if (playerSession.timerInterval) {
      clearInterval(playerSession.timerInterval);
      playerSession.timerInterval = null;
    }
    playerSession.isTimerRunning = false;
    playerSession.timerRemaining = seconds;

    const startBtn = document.getElementById('btnStartStopwatch');
    if (startBtn) startBtn.classList.remove('is-pressed');

    const display = document.getElementById('stopwatchDisplay');
    if (display) {
      display.textContent = `00:${String(seconds).padStart(2, '0')}`;
    }
  }

  function stampTrialMastery(trialId, xpAmount = 10) {
    const seal = document.getElementById('trialStampSeal');
    if (seal) {
      seal.classList.add('is-stamped');
    }

    if (root.NinjaAudio) {
      root.NinjaAudio.playStampSlam();
    }

    if (!playerSession.completedTrialIds.has(trialId)) {
      playerSession.completedTrialIds.add(trialId);
      playerSession.streak++;
      addXP(xpAmount);
      ConfettiEngine.burst(40);
    }

    renderCategoryRail();
  }

  // =========================================================================
  // STAGE 3: BRAIN + BODY COMBINATIONS (Super Hard Multi-Action Chains)
  // =========================================================================
  function renderStage3BrainBody() {
    renderBrainBodyRail();
    renderBrainBodyMainStage();
  }

  function renderBrainBodyRail() {
    const rail = document.getElementById('brainBodyNavRail');
    const data = root.NINJA_TRIALS_DATA;
    if (!rail || !data) return;

    const combos = data.challenges.filter(c => c.categoryId === 'brain_body');

    rail.innerHTML = combos.map((combo, idx) => {
      const isSelected = (idx === playerSession.activeBrainBodyIndex);
      const isDone = playerSession.completedBrainBodyIds.has(combo.id);

      return `
        <button type="button" class="category-rail-btn ${isSelected ? 'is-selected' : ''}" onclick="selectBrainBodyCombo(${idx})" style="border-left: 5px solid #f59e0b;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:1.02rem; font-weight:900; color:#ffffff;">
              Combo 0${idx + 1}
            </span>
            ${isDone ? '<span class="status-badge is-done">✓ DONE</span>' : ''}
          </div>
          <div style="font-size:0.8rem; color:#94a3b8; font-weight:800; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${combo.title}
          </div>
        </button>
      `;
    }).join('');
  }

  function selectBrainBodyCombo(idx) {
    playerSession.activeBrainBodyIndex = idx;
    if (root.NinjaAudio) root.NinjaAudio.playSnap();
    renderBrainBodyRail();
    renderBrainBodyMainStage();
  }

  function renderBrainBodyMainStage() {
    const container = document.getElementById('brainBodyMainStageContainer');
    const data = root.NINJA_TRIALS_DATA;
    if (!container || !data) return;

    const combos = data.challenges.filter(c => c.categoryId === 'brain_body');
    const activeCombo = combos[playerSession.activeBrainBodyIndex] || combos[0];
    const isDone = playerSession.completedBrainBodyIds.has(activeCombo.id);

    // Parse verbs into sequential badges
    const actionBadgesHTML = (activeCombo.verbs || []).map((verb, vIdx) => `
      <div style="background:#1e293b; border:2px solid #f59e0b; border-bottom:4px solid #b45309; border-radius:14px; padding:12px 18px; display:flex; align-items:center; gap:8px;">
        <span style="background:#f59e0b; color:#0f172a; width:26px; height:26px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-weight:900; font-size:0.85rem;">
          ${vIdx + 1}
        </span>
        <span style="font-size:1.05rem; font-weight:900; color:#fef08a; text-transform:uppercase;">
          ${verb}
        </span>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="active-kinetic-stage">
        
        <div class="trial-selector-bar">
          <div>
            <span class="hud-tag" style="background:rgba(245,158,11,0.25); border-color:#f59e0b; color:#fef08a;">
              🧠 Brain + Body Combination 0${playerSession.activeBrainBodyIndex + 1} of 0${combos.length}
            </span>
            <h3 style="font-size:1.35rem; font-weight:900; color:#ffffff; margin-top:6px;">
              ${activeCombo.title}
            </h3>
          </div>
          <div class="trial-arrow-nav">
            <button type="button" class="btn-arrow" onclick="prevBrainBodyCombo()" ${playerSession.activeBrainBodyIndex === 0 ? 'disabled' : ''}>←</button>
            <button type="button" class="btn-arrow" onclick="nextBrainBodyCombo()" ${playerSession.activeBrainBodyIndex === combos.length - 1 ? 'disabled' : ''}>→</button>
          </div>
        </div>

        <!-- Mascot Hero Viewport -->
        <div class="hero-character-box" style="margin: 0 auto; height: 180px;">
          <img src="assets/characters/sensei_ninja.jpg" alt="Sensei Tanuki" class="hero-character-sprite" style="max-height:160px;">
          <div class="pedestal-disc" style="background: radial-gradient(ellipse at center, rgba(245,158,11,0.45) 0%, transparent 72%);"></div>
        </div>

        <!-- Action Badges Flow -->
        <div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center; width:100%;">
          ${actionBadgesHTML}
        </div>

        <!-- Inquiry Question -->
        <div class="inquiry-bubble">
          <div style="font-size:0.8rem; font-weight:900; color:#f59e0b; text-transform:uppercase;">
            Sequential Memory Challenge:
          </div>
          <div class="inquiry-question">
            "${activeCombo.question}"
          </div>
          <button type="button" class="btn-3d btn-game-cyan" style="align-self:flex-start; padding:8px 16px; font-size:0.88rem;" onclick="speakBrainBodyQuestion()">
            <span>🔊</span> <span>Hear Question</span>
          </button>
        </div>

        <!-- Instruction & Sequential Sentence Frame -->
        <div style="background:rgba(15,23,42,0.85); border:2px solid #334155; border-radius:18px; padding:18px 22px; width:100%;">
          <div style="font-size:0.85rem; font-weight:900; color:#94a3b8; text-transform:uppercase; margin-bottom:4px;">
            Cadet Declaration Frame:
          </div>
          <p style="font-size:1.15rem; color:#fef08a; font-weight:800; line-height:1.5;">
            "First I ${activeCombo.verbs[0] || 'start'}, then I ${activeCombo.verbs[1] || 'move'}, and finally I ${activeCombo.verbs[2] || 'freeze'}!"
          </p>
        </div>

        <!-- Affirmation CTA -->
        <div style="position:relative; width:100%; display:flex; justify-content:center; margin-top:8px;">
          <div class="rubber-stamp-seal ${isDone ? 'is-stamped' : ''}" id="brainBodyStampSeal">
            CHAIN MASTERED
          </div>
          <button type="button" class="btn-3d btn-game-gold" onclick="stampBrainBodyMastery('${activeCombo.id}', ${activeCombo.xp})" style="font-size:1.25rem; padding:18px 36px;">
            <span>🧠</span> <span>Mastered Chain! "YES, I CAN!" (+${activeCombo.xp} XP)</span>
          </button>
        </div>

      </div>
    `;
  }

  function prevBrainBodyCombo() {
    if (playerSession.activeBrainBodyIndex > 0) {
      playerSession.activeBrainBodyIndex--;
      renderBrainBodyMainStage();
      renderBrainBodyRail();
    }
  }

  function nextBrainBodyCombo() {
    const data = root.NINJA_TRIALS_DATA;
    const combos = data.challenges.filter(c => c.categoryId === 'brain_body');
    if (playerSession.activeBrainBodyIndex < combos.length - 1) {
      playerSession.activeBrainBodyIndex++;
      renderBrainBodyMainStage();
      renderBrainBodyRail();
    }
  }

  function speakBrainBodyQuestion() {
    const data = root.NINJA_TRIALS_DATA;
    const combos = data.challenges.filter(c => c.categoryId === 'brain_body');
    const activeCombo = combos[playerSession.activeBrainBodyIndex];
    if (root.NinjaAudio && activeCombo) {
      root.NinjaAudio.speak(activeCombo.question);
    }
  }

  function stampBrainBodyMastery(comboId, xpAmount = 20) {
    const seal = document.getElementById('brainBodyStampSeal');
    if (seal) seal.classList.add('is-stamped');

    if (root.NinjaAudio) root.NinjaAudio.playStampSlam();

    if (!playerSession.completedBrainBodyIds.has(comboId)) {
      playerSession.completedBrainBodyIds.add(comboId);
      playerSession.streak++;
      addXP(xpAmount);
      ConfettiEngine.burst(40);
    }

    renderBrainBodyRail();
  }

  // =========================================================================
  // STAGE 4: SOUND MIMIC ECHO CHAMBER (Web Audio Oscilloscope)
  // =========================================================================
  function renderStage4Echo() {
    const grid = document.getElementById('sonicCardsGrid');
    if (!grid) return;

    const sonicDrills = [
      { id: 'roar', name: 'Tiger Roar (Acoustic Low Resonance)', icon: '🐯', trigger: 'roar', desc: 'Drop your pitch, breathe deep from the diaphragm, and produce a rumbling guttural roar!' },
      { id: 'hiss', name: 'Viper Hiss (Filtered High Articulation)', icon: '🐍', trigger: 'hiss', desc: 'Hold your tongue behind your top front teeth and release a sharp, steady /s/ stream without pausing!' },
      { id: 'kiai', name: 'Lightning Kiai (Explosive Martial Shout)', icon: '⚡', trigger: 'kiai', desc: 'Step forward into a front stance, push your fist forward, and shout an explosive "KIAI!" on the strike!' }
    ];

    grid.innerHTML = sonicDrills.map((s, idx) => {
      const isMastered = playerSession.masteredSonicIds.has(s.id);
      return `
        <div class="sonic-card ${isMastered ? 'is-active' : ''}" id="sonicCard-${s.id}">
          <div style="font-size:3.2rem;">${s.icon}</div>
          <h4 style="font-size:1.15rem; font-weight:900; color:#ffffff;">${s.name}</h4>
          <p style="font-size:0.88rem; color:#94a3b8; line-height:1.45;">${s.desc}</p>
          <div style="display:flex; flex-direction:column; gap:8px; width:100%; margin-top:auto;">
            <button type="button" class="btn-3d btn-game-cyan" style="width:100%; padding:10px 14px; font-size:0.92rem;" onclick="testSonicWave('${s.trigger}')">
              <span>🔊</span> <span>Sample &amp; Wave Surge</span>
            </button>
            <button type="button" class="btn-3d btn-game-emerald" style="width:100%; padding:10px 14px; font-size:0.92rem;" onclick="passSonicDrill('${s.id}')">
              <span>✓</span> <span>Mastered Echo (+10 XP)</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function testSonicWave(triggerType) {
    if (OscilloscopeEngine) {
      OscilloscopeEngine.triggerSurge(triggerType);
    }

    if (root.NinjaAudio) {
      if (triggerType === 'roar') root.NinjaAudio.playTigerRoar();
      else if (triggerType === 'hiss') root.NinjaAudio.playViperHiss();
      else if (triggerType === 'kiai') root.NinjaAudio.playKiai();
    }
  }

  function passSonicDrill(drillId) {
    if (!playerSession.masteredSonicIds.has(drillId)) {
      playerSession.masteredSonicIds.add(drillId);
      addXP(10);
      ConfettiEngine.burst(35);
    }
    renderStage4Echo();
  }

  // =========================================================================
  // STAGE 5: DECIBEL STEALTH RADAR (Whisper vs. Battle Cry)
  // =========================================================================
  function renderStage5Stealth() {
    const container = document.getElementById('decibelTrialsContainer');
    if (!container) return;

    container.innerHTML = `
      <!-- Trial 1: Stealth Whisper Threshold -->
      <div style="background:#0f172a; border:2.5px solid #10b981; border-bottom:6px solid #047857; border-radius:22px; padding:22px; display:flex; flex-direction:column; gap:14px; align-items:center; text-align:center;">
        <span class="hud-tag" style="background:rgba(16,185,129,0.25); border-color:#10b981; color:#34d399;">
          🟢 Trial 01: Stealth Whisper
        </span>
        <h4 style="font-size:1.25rem; font-weight:900; color:#ffffff;">Stealth Whisper (&le; 30 dB)</h4>
        <p style="font-size:0.9rem; color:#94a3b8; line-height:1.45;">
          Creep across the floor on tiptoes. Whisper softly: <em>"I can move silently, I am a shadow ninja."</em> Keep the needle strictly in the green zone!
        </p>
        <button type="button" class="btn-3d btn-game-emerald" onclick="simulateStealthCheck()" style="width:100%; padding:14px 20px;">
          <span>🤫</span> <span>Simulate Stealth Walk (&le; 30 dB)</span>
        </button>
        <button type="button" class="btn-3d btn-game-gold" onclick="passDecibelTrial('stealth-1', 15)" style="width:100%; padding:12px 18px;">
          <span>✓</span> <span>Class Passed Stealth Check (+15 XP)</span>
        </button>
      </div>

      <!-- Trial 2: Ninja Battle Cry Surge -->
      <div style="background:#0f172a; border:2.5px solid #ec4899; border-bottom:6px solid #be185d; border-radius:22px; padding:22px; display:flex; flex-direction:column; gap:14px; align-items:center; text-align:center;">
        <span class="hud-tag" style="background:rgba(236,72,153,0.25); border-color:#ec4899; color:#f472b6;">
          🔴 Trial 02: Battle Cry Surge
        </span>
        <h4 style="font-size:1.25rem; font-weight:900; color:#ffffff;">Battle Cry Surge (100 dB)</h4>
        <p style="font-size:0.9rem; color:#94a3b8; line-height:1.45;">
          Drop into a wide warrior stance! On count of 3, shout together with your class: <strong>"I CAN DO IT!"</strong> Surge the volume meter to 100%!
        </p>
        <button type="button" class="btn-3d btn-game-crimson" onclick="simulateBattleCrySurge()" style="width:100%; padding:14px 20px;">
          <span>💥</span> <span>UNLEASH BATTLE CRY (100 dB Surge)</span>
        </button>
        <button type="button" class="btn-3d btn-game-gold" onclick="passDecibelTrial('stealth-2', 15)" style="width:100%; padding:12px 18px;">
          <span>✓</span> <span>Class Passed Surge (+15 XP)</span>
        </button>
      </div>
    `;
  }

  function simulateStealthCheck() {
    const numEl = document.getElementById('decibelNumber');
    const fillEl = document.getElementById('decibelFillBar');

    let current = 15;
    const interval = setInterval(() => {
      current = 18 + Math.floor(Math.random() * 8);
      if (numEl) numEl.textContent = `${current} dB`;
      if (fillEl) fillEl.style.width = `${current}%`;
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      if (root.NinjaAudio) root.NinjaAudio.speak('Quiet shadow stealth confirmed.');
    }, 2500);
  }

  function simulateBattleCrySurge() {
    const numEl = document.getElementById('decibelNumber');
    const fillEl = document.getElementById('decibelFillBar');

    if (numEl) numEl.textContent = '100 dB';
    if (fillEl) fillEl.style.width = '100%';

    if (root.NinjaAudio) {
      root.NinjaAudio.playKiai();
      root.NinjaAudio.playFanfare();
    }
    ConfettiEngine.burst(50);

    setTimeout(() => {
      if (numEl) numEl.textContent = '18 dB';
      if (fillEl) fillEl.style.width = '18%';
    }, 3000);
  }

  function passDecibelTrial(trialId, xpAmount = 15) {
    if (!playerSession.masteredDecibelIds.has(trialId)) {
      playerSession.masteredDecibelIds.add(trialId);
      addXP(xpAmount);
      ConfettiEngine.burst(30);
    }
  }

  // =========================================================================
  // STAGE 6: RAPID TONGUE TWISTER SPEED RUN (Phonics Sprints)
  // =========================================================================
  function renderStage6Twisters() {
    const data = root.NINJA_TRIALS_DATA;
    if (!data) return;

    const twisters = data.challenges.filter(c => c.type === 'tongue_twister');
    const tabs = document.getElementById('twisterTabsContainer');
    if (!tabs) return;

    tabs.innerHTML = twisters.map((t, idx) => {
      const isSelected = (idx === playerSession.activeTwisterIndex);
      return `
        <button type="button" class="btn-3d ${isSelected ? 'btn-game-purple' : 'btn-game-cyan'}" style="padding:10px 18px; font-size:0.92rem;" onclick="selectTwister(${idx})">
          <span>Sprint 0${idx + 1}: ${t.phonicsSound}</span>
        </button>
      `;
    }).join('');

    const active = twisters[playerSession.activeTwisterIndex] || twisters[0];
    const badge = document.getElementById('twisterSoundBadge');
    if (badge) badge.textContent = `Target Sounds: ${active.phonicsSound} • ${active.manner}`;

    const phraseBox = document.getElementById('twisterPhraseBox');
    if (phraseBox) phraseBox.textContent = `"${active.phrase}"`;
  }

  function selectTwister(idx) {
    playerSession.activeTwisterIndex = idx;
    stopTwisterTimer();
    renderStage6Twisters();
    if (root.NinjaAudio) root.NinjaAudio.playSnap();
  }

  function startTwisterTimer() {
    if (playerSession.isTwisterRunning) return;
    playerSession.isTwisterRunning = true;
    playerSession.twisterRemaining = 15.0;

    const timerText = document.getElementById('twisterTimerText');
    const timerFill = document.getElementById('twisterTimerFill');
    const btn = document.getElementById('btnStartTwisterTimer');
    if (btn) btn.classList.add('is-pressed');

    if (root.NinjaAudio) root.NinjaAudio.playSnap();

    clearInterval(playerSession.twisterInterval);
    const startTime = Date.now();
    const totalDuration = 15000;

    playerSession.twisterInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingMs = Math.max(0, totalDuration - elapsed);
      const remainingSec = (remainingMs / 1000).toFixed(1);

      if (timerText) timerText.textContent = `${remainingSec}s`;
      if (timerFill) timerFill.style.width = `${(remainingMs / totalDuration) * 100}%`;

      if (remainingMs <= 0) {
        clearInterval(playerSession.twisterInterval);
        playerSession.isTwisterRunning = false;
        if (btn) btn.classList.remove('is-pressed');
        if (timerText) timerText.textContent = 'TIME UP!';
        if (root.NinjaAudio) root.NinjaAudio.playWhistle();
      }
    }, 100);
  }

  function stopTwisterTimer() {
    if (playerSession.twisterInterval) {
      clearInterval(playerSession.twisterInterval);
      playerSession.twisterInterval = null;
    }
    playerSession.isTwisterRunning = false;
    const btn = document.getElementById('btnStartTwisterTimer');
    if (btn) btn.classList.remove('is-pressed');

    const timerText = document.getElementById('twisterTimerText');
    if (timerText) timerText.textContent = '15.0s';
    const timerFill = document.getElementById('twisterTimerFill');
    if (timerFill) timerFill.style.width = '100%';
  }

  function speakTwisterPhrase() {
    const data = root.NINJA_TRIALS_DATA;
    const twisters = data.challenges.filter(c => c.type === 'tongue_twister');
    const active = twisters[playerSession.activeTwisterIndex];
    if (root.NinjaAudio && active) {
      root.NinjaAudio.speak(active.phrase);
    }
  }

  function passTwister() {
    const data = root.NINJA_TRIALS_DATA;
    const twisters = data.challenges.filter(c => c.type === 'tongue_twister');
    const active = twisters[playerSession.activeTwisterIndex];

    if (!playerSession.masteredTwisterIds.has(active.id)) {
      playerSession.masteredTwisterIds.add(active.id);
      addXP(25);
      ConfettiEngine.burst(40);
    }
    stopTwisterTimer();
  }

  // =========================================================================
  // STAGE 7: GRANDMASTER TELEPROMPTER STUDIO
  // =========================================================================
  function renderStage7Studio() {
    const data = root.NINJA_TRIALS_DATA;
    const list = document.getElementById('teleprompterMemesList');
    if (!list || !data) return;

    list.innerHTML = data.teleprompterTemplates.map((tp, idx) => {
      const isSelected = (playerSession.activeTeleprompterTemplate && playerSession.activeTeleprompterTemplate.id === tp.id);
      return `
        <button type="button" class="teleprompter-choice-card ${isSelected ? 'is-selected' : ''}" onclick="selectTeleprompterTemplate('${tp.id}')">
          <div style="font-size:1.02rem; font-weight:900; color:#ffffff;">
            ${tp.title}
          </div>
          <div style="font-size:0.8rem; color:#94a3b8; font-weight:800; margin-top:4px;">
            3-Sentence Debrief
          </div>
        </button>
      `;
    }).join('');

    updateTeleprompterScreen();
  }

  function selectTeleprompterTemplate(templateId) {
    const data = root.NINJA_TRIALS_DATA;
    if (!data) return;
    const found = data.teleprompterTemplates.find(t => t.id === templateId);
    if (found) {
      playerSession.activeTeleprompterTemplate = found;
      if (root.NinjaAudio) root.NinjaAudio.playSnap();
      renderStage7Studio();
    }
  }

  function updateTeleprompterScreen() {
    const tp = playerSession.activeTeleprompterTemplate;
    if (!tp) return;

    const titleEl = document.getElementById('teleprompterActiveMemeName');
    if (titleEl) titleEl.textContent = tp.title;

    const line1 = document.getElementById('tpLine1');
    const line2 = document.getElementById('tpLine2');
    const line3 = document.getElementById('tpLine3');

    if (line1) line1.textContent = tp.line1;
    if (line2) line2.textContent = tp.line2;
    if (line3) line3.textContent = tp.line3;

    // Victory Mascot Podium
    const podium = document.getElementById('teleprompterPodiumStage');
    if (podium) {
      podium.innerHTML = `
        <div class="hero-character-box" style="margin: 0 auto; height: 180px;">
          <img src="${tp.mascotImg}" alt="Ninja Grandmaster Mascot" class="hero-character-sprite" style="max-height:160px;">
          <div class="pedestal-disc" style="background: radial-gradient(ellipse at center, rgba(245,158,11,0.45) 0%, transparent 72%);"></div>
        </div>
      `;
    }
  }

  function readTeleprompterAloud() {
    const tp = playerSession.activeTeleprompterTemplate;
    if (!tp || playerSession.isSpeaking) return;

    playerSession.isSpeaking = true;
    const btn = document.getElementById('btnReadAloud');
    if (btn) btn.classList.add('is-pressed');

    const lines = [
      { el: document.getElementById('tpLine1'), text: tp.line1 },
      { el: document.getElementById('tpLine2'), text: tp.line2 },
      { el: document.getElementById('tpLine3'), text: tp.line3 }
    ];

    let currentLine = 0;

    function speakNext() {
      if (currentLine >= lines.length) {
        playerSession.isSpeaking = false;
        if (btn) btn.classList.remove('is-pressed');
        lines.forEach(l => { if (l.el) l.el.classList.remove('is-active-line'); });
        if (lines[0].el) lines[0].el.classList.add('is-active-line');
        return;
      }

      lines.forEach((l, idx) => {
        if (l.el) {
          if (idx === currentLine) l.el.classList.add('is-active-line');
          else l.el.classList.remove('is-active-line');
        }
      });

      if (root.NinjaAudio) {
        root.NinjaAudio.speak(lines[currentLine].text, () => {
          currentLine++;
          setTimeout(speakNext, 350);
        });
      } else {
        currentLine++;
        setTimeout(speakNext, 1200);
      }
    }

    speakNext();
  }

  function finishLessonQuest() {
    // Award completion XP up to 200 total
    const neededXP = Math.max(0, 200 - playerSession.xp);
    if (neededXP > 0) {
      addXP(neededXP);
    }

    if (root.NinjaAudio) {
      root.NinjaAudio.playFanfare();
      root.NinjaAudio.playGong();
    }

    ConfettiEngine.burst(90);

    const diplomaXP = document.getElementById('diplomaTotalXP');
    if (diplomaXP) diplomaXP.textContent = `⭐ +${playerSession.xp} XP`;

    const modal = document.getElementById('completionModal');
    if (modal) modal.classList.add('is-open');
  }

  function closeCompletionModal() {
    const modal = document.getElementById('completionModal');
    if (modal) modal.classList.remove('is-open');
  }

  function toggleMuteAudio() {
    if (root.NinjaAudio) {
      const isMuted = root.NinjaAudio.toggleMute();
      const btn = document.getElementById('btnMuteToggle');
      if (btn) {
        btn.textContent = isMuted ? '🔇 Muted' : '🔊 Sound';
      }
    }
  }

  // --- EXPOSE GLOBALS TO ROOT ---
  root.switchStage = switchStage;
  root.handleScanCard = handleScanCard;
  root.speakCardFormula = speakCardFormula;

  root.selectKineticCategory = selectKineticCategory;
  root.prevKineticTrial = prevKineticTrial;
  root.nextKineticTrial = nextKineticTrial;
  root.speakActiveTrialQuestion = speakActiveTrialQuestion;
  root.startStopwatch = startStopwatch;
  root.stopStopwatch = stopStopwatch;
  root.resetStopwatch = resetStopwatch;
  root.stampTrialMastery = stampTrialMastery;

  root.selectBrainBodyCombo = selectBrainBodyCombo;
  root.prevBrainBodyCombo = prevBrainBodyCombo;
  root.nextBrainBodyCombo = nextBrainBodyCombo;
  root.speakBrainBodyQuestion = speakBrainBodyQuestion;
  root.stampBrainBodyMastery = stampBrainBodyMastery;

  root.testSonicWave = testSonicWave;
  root.passSonicDrill = passSonicDrill;

  root.simulateStealthCheck = simulateStealthCheck;
  root.simulateBattleCrySurge = simulateBattleCrySurge;
  root.passDecibelTrial = passDecibelTrial;

  root.selectTwister = selectTwister;
  root.startTwisterTimer = startTwisterTimer;
  root.stopTwisterTimer = stopTwisterTimer;
  root.speakTwisterPhrase = speakTwisterPhrase;
  root.passTwister = passTwister;

  root.selectTeleprompterTemplate = selectTeleprompterTemplate;
  root.readTeleprompterAloud = readTeleprompterAloud;
  root.finishLessonQuest = finishLessonQuest;
  root.closeCompletionModal = closeCompletionModal;
  root.toggleMuteAudio = toggleMuteAudio;

  // Boot on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
  } else {
    initGame();
  }

})(typeof window !== 'undefined' ? window : global);
