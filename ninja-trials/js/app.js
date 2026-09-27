/**
 * NINJA TRIALS: CAN YOU DO IT? (HARD MODE)
 * Reactive playerSession State Machine, Stopwatch Timer Arena & Teleprompter Studio
 * Zero external runtime dependencies • Web Audio API & Calibrated Natural TTS
 */

(function(root) {
  'use strict';

  // --- REACTIVE PLAYER SESSION STATE ---
  const playerSession = {
    xp: 0,
    energy: 20,
    streak: 0,
    currentPhase: 1,
    activeCategoryIndex: 0,
    activeTrialIndex: 0,
    completedTrialIds: new Set(),
    scannedCategoryIds: new Set(),
    timerInterval: null,
    timerRemaining: 0,
    isTimerRunning: false,
    activeTeleprompterTemplate: null,
    isSpeaking: false,
    isActionBlocked: false
  };

  // --- ZERO-DEPENDENCY CANVAS CONFETTI CELEBRATION ENGINE ---
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
      const colors = ['#f59e0b', '#38bdf8', '#10b981', '#ef4444', '#a855f7', '#facc15'];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 220,
          y: window.innerHeight * 0.4 + (Math.random() - 0.5) * 120,
          vx: (Math.random() - 0.5) * 18,
          vy: (Math.random() - 1.2) * 16,
          size: Math.random() * 8 + 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 12,
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

  // --- INITIALIZATION ---
  function initGame() {
    const data = root.NINJA_TRIALS_DATA;
    if (!data) {
      console.error('[NinjaTrials] NINJA_TRIALS_DATA not found.');
      return;
    }

    playerSession.activeTeleprompterTemplate = data.teleprompterTemplates[0];

    ConfettiEngine.init();
    renderPhase1Scanner();
    renderPhase2Arena();
    renderPhase3Studio();
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

    // Synchronize to Adventure Academy master school store
    try {
      if (window.AdventureAcademy && typeof window.AdventureAcademy.awardXP === 'function') {
        window.AdventureAcademy.awardXP(amount, 'Ninja Trials');
      } else if (window.parent && window.parent.store && typeof window.parent.store.giveXP === 'function') {
        window.parent.store.giveXP('student-3a-224', amount, 'Ninja Trials');
      }
    } catch (e) {}
  }

  function triggerScoreBurst(parentEl, text = '+15 XP!') {
    if (!parentEl) return;
    const burst = document.createElement('div');
    burst.className = 'floating-xp-burst';
    burst.textContent = text;
    parentEl.appendChild(burst);
    setTimeout(() => {
      if (burst.parentNode) burst.parentNode.removeChild(burst);
    }, 900);
  }

  window.toggleMuteAudio = function() {
    if (!root.NinjaAudio) return;
    const isMuted = root.NinjaAudio.toggleMute();
    const btn = document.getElementById('btnMuteToggle');
    if (btn) {
      btn.textContent = isMuted ? '🔇 Muted' : '🔊 Sound';
      btn.style.color = isMuted ? '#f87171' : '#cbd5e1';
    }
  };

  // --- STAGE NAVIGATION ---
  window.switchPhase = function(phaseNum) {
    if (phaseNum === 2 && playerSession.scannedCategoryIds.size < 2) {
      alert('🔒 Tap to flip and scan at least 2 discipline cards in Phase 1 before entering the Kinetic Arena!');
      return;
    }
    if (phaseNum === 3 && playerSession.completedTrialIds.size < 3) {
      alert('🔒 Complete at least 3 physical trials in Phase 2 before advancing to the Grandmaster Showcase!');
      return;
    }

    // Stop active timer if leaving phase 2
    stopCountdownTimer();

    playerSession.currentPhase = phaseNum;

    // Update Phase Stepper Tabs
    document.querySelectorAll('.step-tab').forEach((tab, idx) => {
      const p = idx + 1;
      tab.classList.toggle('is-active', p === phaseNum);
      if (p < phaseNum) tab.classList.add('is-completed');
    });

    // Toggle Stage Views
    document.querySelectorAll('.stage-view').forEach(view => view.classList.remove('is-visible'));
    const targetView = document.getElementById(`stagePhase${phaseNum}`);
    if (targetView) targetView.classList.add('is-visible');

    if (root.NinjaAudio) root.NinjaAudio.playSnap();
  };

  // =========================================================================
  // PHASE 1: HOLOGRAPHIC DOJO SCANNER (3D FLIPPING TRADING CARDS)
  // =========================================================================
  function renderPhase1Scanner() {
    const container = document.getElementById('scannerCardsGrid');
    if (!container) return;

    const categories = root.NINJA_TRIALS_DATA.categories;
    container.innerHTML = categories.map(cat => {
      const isScanned = playerSession.scannedCategoryIds.has(cat.id);
      return `
        <div class="scanner-card-wrap" id="scanCardWrap-${cat.id}" onclick="handleScanCategory('${cat.id}')">
          <div class="scanner-card-flipper" id="cardFlipper-${cat.id}">

            <!-- FRONT FACE (65% Full-Bleed Artwork Stage) -->
            <div class="card-face-front">
              <div class="card-hero-stage">
                <div class="isometric-pedestal"></div>
                <img src="${cat.mascotImg}" alt="${cat.mascotName}" class="hero-3d-sprite">
              </div>
              <div class="card-caption-tray">
                <span class="belt-rank-tag" style="background:${cat.accentGlow}; color:${cat.accent}; border:1px solid ${cat.accent};">
                  ${cat.icon} ${cat.belt}
                </span>
                <h3 class="scanner-card-title">${cat.title}</h3>
                <p style="font-size:0.8rem; color:#94a3b8; line-height:1.35;">${cat.mascotRole}</p>
                <div class="ability-formula-pill">
                  <span>⚡</span> <span>Formula: <strong>Can you...?</strong></span>
                </div>
                <span style="font-size:0.8rem; color:#f59e0b; display:flex; align-items:center; gap:6px;">
                  🔄 Tap to Scan &amp; Flip
                </span>
              </div>
            </div>

            <!-- BACK FACE (Discipline Drill & Spoken Formula) -->
            <div class="card-face-back">
              <span class="belt-rank-tag" style="background:${cat.accent}; color:#0f172a;">
                ${cat.icon} ${cat.title}
              </span>
              <div class="scanner-revealed-rule">
                &ldquo;Can you do it?&rdquo;
              </div>
              <p style="font-size:0.86rem; color:#cbd5e1; line-height:1.5;">
                ${cat.description}
              </p>
              <div style="background:rgba(15,23,42,0.9); border:1px solid ${cat.accent}; border-radius:12px; padding:10px 14px; width:100%;">
                <div style="font-size:0.75rem; color:#94a3b8; font-weight:800; text-transform:uppercase;">Mastery Declaration:</div>
                <div style="font-size:0.88rem; color:#38bdf8; font-weight:900; margin-top:2px;">
                  &ldquo;${cat.sentenceFrame}&rdquo;
                </div>
              </div>
              <button type="button" class="btn-3d btn-game-cyan" onclick="event.stopPropagation(); replayDisciplineAudio('${cat.id}')" style="padding:10px 20px; font-size:0.9rem;">
                <span>🔊 Hear Drill Formula</span>
              </button>
            </div>

          </div>
        </div>
      `;
    }).join('');
  }

  window.replayDisciplineAudio = function(catId) {
    const cat = root.NINJA_TRIALS_DATA.categories.find(c => c.id === catId);
    if (!cat || !root.NinjaAudio) return;
    root.NinjaAudio.speak(`Can you do it? ${cat.sentenceFrame}`);
  };

  window.handleScanCategory = function(catId) {
    const cat = root.NINJA_TRIALS_DATA.categories.find(c => c.id === catId);
    if (!cat) return;

    const wrapEl = document.getElementById(`scanCardWrap-${catId}`);
    if (wrapEl) wrapEl.classList.toggle('is-flipped');

    if (root.NinjaAudio) {
      root.NinjaAudio.playSnap();
      root.NinjaAudio.speak(`Can you do it? ${cat.title}!`);
    }

    if (!playerSession.scannedCategoryIds.has(catId)) {
      playerSession.scannedCategoryIds.add(catId);
      addXP(10);

      if (root.NinjaAudio) root.NinjaAudio.playXP();
      if (wrapEl) triggerScoreBurst(wrapEl, '+10 Discovery XP!');

      // If at least 3 categories scanned, reveal entry notice
      if (playerSession.scannedCategoryIds.size >= 3) {
        const notice = document.getElementById('phase1SuccessNotice');
        if (notice && notice.style.display !== 'flex') {
          notice.style.display = 'flex';
          ConfettiEngine.burst(80);
          if (root.NinjaAudio) root.NinjaAudio.playFanfare();
        }
      }
    }
  };

  // =========================================================================
  // PHASE 2: THE KINETIC REACTION ARENA (ACTIVE STOPWATCH GAMEPLAY)
  // =========================================================================
  function renderPhase2Arena() {
    renderCategoryRail();
    renderCurrentTrial();
  }

  function renderCategoryRail() {
    const rail = document.getElementById('categoryNavRail');
    if (!rail) return;

    const data = root.NINJA_TRIALS_DATA;
    rail.innerHTML = data.categories.map((cat, idx) => {
      const isActive = playerSession.activeCategoryIndex === idx;
      const countInCat = data.challenges.filter(c => c.categoryId === cat.id).length;
      const completedInCat = data.challenges.filter(c => c.categoryId === cat.id && playerSession.completedTrialIds.has(c.id)).length;

      return `
        <div class="category-rail-btn ${isActive ? 'is-active' : ''}" onclick="selectCategory(${idx})">
          <span style="font-size:1.4rem;">${cat.icon}</span>
          <div style="flex:1; text-align:left;">
            <div style="font-size:0.95rem; font-weight:900;">${cat.title}</div>
            <div style="font-size:0.75rem; color:#94a3b8;">${completedInCat} / ${countInCat} Mastered</div>
          </div>
          <span style="font-size:0.85rem; color:${completedInCat === countInCat ? '#10b981' : '#f59e0b'}; font-weight:900;">
            ${completedInCat === countInCat ? '✓' : '🥋'}
          </span>
        </div>
      `;
    }).join('');
  }

  window.selectCategory = function(index) {
    stopCountdownTimer();
    playerSession.activeCategoryIndex = index;
    playerSession.activeTrialIndex = 0;
    if (root.NinjaAudio) root.NinjaAudio.playSnap();
    renderCategoryRail();
    renderCurrentTrial();
  };

  function getCurrentCategoryChallenges() {
    const cat = root.NINJA_TRIALS_DATA.categories[playerSession.activeCategoryIndex];
    return root.NINJA_TRIALS_DATA.challenges.filter(c => c.categoryId === cat.id);
  }

  function renderCurrentTrial() {
    const stage = document.getElementById('kineticMainStageContainer');
    if (!stage) return;

    const cat = root.NINJA_TRIALS_DATA.categories[playerSession.activeCategoryIndex];
    const trials = getCurrentCategoryChallenges();
    const trial = trials[playerSession.activeTrialIndex];

    if (!trial) return;

    const isTimer = trial.type === 'timer';
    const isFreeze = trial.type === 'freeze';
    const isCount = trial.type === 'count';
    const isMastered = playerSession.completedTrialIds.has(trial.id);

    stage.innerHTML = `
      <div class="kinetic-main-stage" id="activeKineticCard">
        <!-- 65% Hero Stage -->
        <div class="trial-hero-stage">
          <div class="isometric-pedestal"></div>
          <img src="${cat.mascotImg}" alt="${cat.mascotName}" class="hero-3d-sprite" style="width:160px; height:160px;">
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; width:90%; margin-top:14px;">
          <span class="belt-rank-tag" style="background:${cat.accentGlow}; color:${cat.accent}; border:1px solid ${cat.accent};">
            ${cat.icon} ${cat.belt} • Trial ${playerSession.activeTrialIndex + 1} of ${trials.length}
          </span>
          <span style="font-size:0.88rem; font-weight:900; color:#38bdf8;">
            ⭐ +${trial.xp} XP
          </span>
        </div>

        <!-- Question Prompt -->
        <h3 class="trial-question-prompt">
          &ldquo;${trial.question}&rdquo;
        </h3>

        <!-- Digital Stopwatch / Rep Counter -->
        <div class="stopwatch-container">
          <div class="digital-stopwatch" id="stopwatchDisplay">
            ${isTimer ? formatStopwatchTime(trial.timerSeconds) : (isCount ? `REPS: ${trial.repCount}` : 'ACTION')}
          </div>
          ${isTimer ? `
            <button type="button" class="btn-3d btn-game-gold" id="btnStartTimer" onclick="toggleTrialTimer(${trial.timerSeconds})" style="padding:10px 18px; font-size:0.95rem;">
              <span>⏱️ Start Timer</span>
            </button>
          ` : ''}
          ${isFreeze ? `
            <button type="button" class="btn-3d btn-game-crimson" onclick="triggerWhistleFreeze()" style="padding:10px 18px; font-size:0.95rem;">
              <span>📢 Blow Whistle!</span>
            </button>
          ` : ''}
        </div>

        <!-- Step-by-Step Physical Instruction -->
        <div class="trial-instruction-bubble">
          <strong>🥋 Action Cue:</strong> ${trial.instruction}
        </div>

        <!-- Safety Pill -->
        <div class="safety-pill-banner" style="margin-bottom:20px;">
          <span>🛡️</span> <span><strong>Safety Tip:</strong> ${trial.safetyTip}</span>
        </div>

        <!-- Two Giant Tactile 3D Buttons -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; width:90%;">
          <button type="button" class="btn-3d btn-game-emerald" id="btnCompleteTrial" onclick="completeCurrentTrial('${trial.id}')">
            <span style="font-size:1.3rem;">✓</span>
            <span>CHALLENGE MASTERED!</span>
          </button>
          <button type="button" class="btn-3d btn-game-crimson" onclick="softFailCurrentTrial()">
            <span>💡 Soft Reset (Need Practice)</span>
          </button>
        </div>

        <!-- Trial Pagination Bar -->
        <div style="display:flex; justify-content:space-between; width:90%; margin-top:20px; border-top:1px solid #334155; padding-top:12px;">
          <button type="button" class="step-tab" onclick="prevTrial()" ${playerSession.activeTrialIndex === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>
            ← Previous Drill
          </button>
          <span style="font-size:0.85rem; color:#94a3b8; font-weight:800; display:flex; align-items:center;">
            ${isMastered ? '⭐ Mastered' : 'Pending Verification'}
          </span>
          <button type="button" class="step-tab" onclick="nextTrial()" ${playerSession.activeTrialIndex === trials.length - 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>
            Next Drill →
          </button>
        </div>
      </div>
    `;

    // Speak the challenge question with TTS
    if (root.NinjaAudio) {
      root.NinjaAudio.speak(trial.question);
    }
  }

  function formatStopwatchTime(seconds) {
    const s = Math.max(0, Math.floor(seconds));
    return `00:${s < 10 ? '0' : ''}${s}`;
  }

  window.toggleTrialTimer = function(durationSec) {
    if (playerSession.isTimerRunning) {
      stopCountdownTimer();
    } else {
      startCountdownTimer(durationSec);
    }
  };

  function startCountdownTimer(durationSec) {
    stopCountdownTimer();
    playerSession.isTimerRunning = true;
    playerSession.timerRemaining = durationSec;

    const display = document.getElementById('stopwatchDisplay');
    const btn = document.getElementById('btnStartTimer');
    if (btn) btn.innerHTML = '<span>⏸️ Pause</span>';
    if (display) display.classList.add('is-running');

    playerSession.timerInterval = setInterval(() => {
      playerSession.timerRemaining--;
      if (display) display.textContent = formatStopwatchTime(playerSession.timerRemaining);

      if (root.NinjaAudio) root.NinjaAudio.playTick();

      if (playerSession.timerRemaining <= 0) {
        stopCountdownTimer();
        if (display) {
          display.classList.remove('is-running');
          display.classList.add('is-freeze');
        }
        if (root.NinjaAudio) {
          root.NinjaAudio.playWhistle();
          root.NinjaAudio.speak("Time! Freeze like a statue!");
        }
      }
    }, 1000);
  }

  function stopCountdownTimer() {
    if (playerSession.timerInterval) {
      clearInterval(playerSession.timerInterval);
      playerSession.timerInterval = null;
    }
    playerSession.isTimerRunning = false;
    const btn = document.getElementById('btnStartTimer');
    const display = document.getElementById('stopwatchDisplay');
    if (btn) btn.innerHTML = '<span>⏱️ Start Timer</span>';
    if (display) display.classList.remove('is-running');
  }

  window.triggerWhistleFreeze = function() {
    if (root.NinjaAudio) {
      root.NinjaAudio.playWhistle();
      root.NinjaAudio.speak("STOP! Freeze like a shadow ninja!");
    }

    const stage = document.getElementById('activeKineticCard');
    if (stage) {
      const banner = document.createElement('div');
      banner.className = 'whistle-freeze-alert';
      banner.textContent = '📢 FREEZE! DO NOT MOVE!';
      stage.appendChild(banner);
      setTimeout(() => {
        if (banner.parentNode) banner.parentNode.removeChild(banner);
      }, 2500);
    }
  };

  window.completeCurrentTrial = function(trialId) {
    if (playerSession.isActionBlocked) return;
    const trials = getCurrentCategoryChallenges();
    const trial = trials.find(t => t.id === trialId);
    if (!trial) return;

    playerSession.isActionBlocked = true;
    stopCountdownTimer();

    // Sound and Stamp
    if (root.NinjaAudio) {
      root.NinjaAudio.playStampSlam();
      root.NinjaAudio.playXP();
    }

    playerSession.streak++;
    addXP(trial.xp || 15);
    ConfettiEngine.burst(65);

    const card = document.getElementById('activeKineticCard');
    if (card) {
      const stamp = document.createElement('div');
      stamp.className = 'rubber-stamp';
      stamp.innerHTML = 'STAMP: MASTERED! ⭐';
      card.appendChild(stamp);

      triggerScoreBurst(card, `+${trial.xp || 15} XP!`);
    }

    playerSession.completedTrialIds.add(trialId);
    renderCategoryRail();

    // Spoken encouragement
    if (root.NinjaAudio) {
      root.NinjaAudio.speak(trial.responseYes || "Yes, I can do it! Excellent work, Ninja!");
    }

    // Advance to next drill after brief visual impact
    setTimeout(() => {
      playerSession.isActionBlocked = false;
      if (playerSession.activeTrialIndex < trials.length - 1) {
        playerSession.activeTrialIndex++;
        renderCurrentTrial();
      } else {
        // Category complete! Check if next category exists
        if (playerSession.activeCategoryIndex < root.NINJA_TRIALS_DATA.categories.length - 1) {
          playerSession.activeCategoryIndex++;
          playerSession.activeTrialIndex = 0;
          renderCategoryRail();
          renderCurrentTrial();
        } else {
          // All 33 drills complete!
          alert('🏆 All Ninja Trials Mastered! Step onto the Grandmaster Showcase stage!');
          switchPhase(3);
        }
      }
    }, 850);
  };

  window.softFailCurrentTrial = function() {
    stopCountdownTimer();
    playerSession.streak = 0;
    updateHUD();

    if (root.NinjaAudio) root.NinjaAudio.playSoftFail();

    const card = document.getElementById('activeKineticCard');
    if (card) {
      card.classList.remove('wobble-fail');
      void card.offsetWidth;
      card.classList.add('wobble-fail');
    }

    if (root.NinjaAudio) {
      root.NinjaAudio.speak("Take a breath, reset your posture, and try the movement again! You can do it!");
    }
  };

  window.prevTrial = function() {
    if (playerSession.activeTrialIndex > 0) {
      stopCountdownTimer();
      playerSession.activeTrialIndex--;
      if (root.NinjaAudio) root.NinjaAudio.playSnap();
      renderCurrentTrial();
    }
  };

  window.nextTrial = function() {
    const trials = getCurrentCategoryChallenges();
    if (playerSession.activeTrialIndex < trials.length - 1) {
      stopCountdownTimer();
      playerSession.activeTrialIndex++;
      if (root.NinjaAudio) root.NinjaAudio.playSnap();
      renderCurrentTrial();
    }
  };

  // =========================================================================
  // PHASE 3: GRANDMASTER TELEPROMPTER STUDIO (ORAL SHOWCASE & PODIUM)
  // =========================================================================
  function renderPhase3Studio() {
    const listContainer = document.getElementById('teleprompterMemesList');
    if (!listContainer) return;

    const templates = root.NINJA_TRIALS_DATA.teleprompterTemplates;
    listContainer.innerHTML = templates.map(tpl => {
      const isSelected = playerSession.activeTeleprompterTemplate && playerSession.activeTeleprompterTemplate.id === tpl.id;
      return `
        <div class="teleprompter-choice-card ${isSelected ? 'is-selected' : ''}" onclick="selectTeleprompterTemplate('${tpl.id}')">
          <img src="${tpl.mascotImg}" alt="${tpl.title}" style="width:46px; height:46px; border-radius:12px; object-fit:cover; flex-shrink:0;">
          <div style="flex:1;">
            <div style="font-size:0.95rem; font-weight:900; color:#fff;">${tpl.title}</div>
            <div style="font-size:0.75rem; color:#94a3b8; font-weight:600;">3-Sentence Presentation</div>
          </div>
          <span style="font-size:1.3rem;">${isSelected ? '🎙️' : '⚪'}</span>
        </div>
      `;
    }).join('');

    renderTeleprompterScript();
  }

  window.selectTeleprompterTemplate = function(templateId) {
    const tpl = root.NINJA_TRIALS_DATA.teleprompterTemplates.find(t => t.id === templateId);
    if (!tpl) return;

    playerSession.activeTeleprompterTemplate = tpl;
    if (root.NinjaAudio) root.NinjaAudio.playSnap();
    renderPhase3Studio();
  };

  function renderTeleprompterScript() {
    const tpl = playerSession.activeTeleprompterTemplate;
    if (!tpl) return;

    const screenTitle = document.getElementById('teleprompterActiveMemeName');
    if (screenTitle) screenTitle.textContent = tpl.title;

    // Victory Podium Stage
    const podium = document.getElementById('teleprompterPodiumStage');
    if (podium) {
      podium.innerHTML = `
        <div class="isometric-pedestal" style="bottom:22px; width:160px; height:44px;"></div>
        <img src="${tpl.mascotImg}" alt="${tpl.title}" class="hero-3d-sprite" style="width:140px; height:140px;">
      `;
    }

    const line1 = document.getElementById('tpLine1');
    const line2 = document.getElementById('tpLine2');
    const line3 = document.getElementById('tpLine3');

    if (line1) line1.innerHTML = wrapWordsInSpans(tpl.line1, 'l1');
    if (line2) line2.innerHTML = wrapWordsInSpans(tpl.line2, 'l2');
    if (line3) line3.innerHTML = wrapWordsInSpans(tpl.line3, 'l3');
  }

  function wrapWordsInSpans(text, prefix) {
    return text.split(' ').map((word, i) => `<span class="speech-word" id="${prefix}-w-${i}">${word}</span>`).join(' ');
  }

  window.readTeleprompterAloud = function() {
    if (playerSession.isSpeaking) return;
    const tpl = playerSession.activeTeleprompterTemplate;
    if (!tpl || !root.NinjaAudio) return;

    playerSession.isSpeaking = true;
    const btn = document.getElementById('btnReadAloud');
    if (btn) btn.innerHTML = '<span>🔊</span> <span>Speaking Broadcast...</span>';

    const fullText = `${tpl.line1} ${tpl.line2} ${tpl.line3}`;
    const allWords = Array.from(document.querySelectorAll('.speech-word'));
    allWords.forEach(w => w.classList.remove('highlight-karaoke'));

    let currentWordIndex = 0;

    root.NinjaAudio.speak(
      fullText,
      function(charIndex) {
        // Karaoke highlight
        if (currentWordIndex < allWords.length) {
          allWords.forEach(w => w.classList.remove('highlight-karaoke'));
          allWords[currentWordIndex].classList.add('highlight-karaoke');
          currentWordIndex++;
        }
      },
      function() {
        playerSession.isSpeaking = false;
        allWords.forEach(w => w.classList.remove('highlight-karaoke'));
        if (btn) btn.innerHTML = '<span>🎙️</span> <span>Replay Presentation</span>';
        if (root.NinjaAudio) root.NinjaAudio.playXP();
        addXP(30);
      }
    );
  };

  window.finishLessonQuest = function() {
    if (root.NinjaAudio) root.NinjaAudio.playFanfare();
    addXP(150);
    ConfettiEngine.burst(140);

    const modal = document.getElementById('completionModal');
    if (modal) modal.classList.add('is-active');

    const totalXpEl = document.getElementById('diplomaTotalXP');
    if (totalXpEl) totalXpEl.textContent = `⭐ +${playerSession.xp} XP`;
  };

  window.closeCompletionModal = function() {
    const modal = document.getElementById('completionModal');
    if (modal) modal.classList.remove('is-active');
  };

  // Run initialization on load
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initGame);
  }

  root.playerSession = playerSession;

})(typeof window !== 'undefined' ? window : global);
