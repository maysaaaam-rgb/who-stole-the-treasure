/**
 * THE 20% ENERGY FREEZE GAME: MASTER STATE CONTROLLER & 5-STEP GAME LOOP
 * Grade 2-4 CEFR A1+/A2 | CLIL Human Biology & Muscle vs Brain Energy
 * Pure Vanilla ES6 | Zero External Dependencies
 */

(function(root) {
  'use strict';

  const DATA = window.FREEZE_DATA;
  const AUDIO = window.FreezeAudio;

  // Central Reactive Player Session
  const playerSession = {
    currentRoundIdx: 0,
    gamePhase: 'idle',           // 'idle' | 'dancing' | 'frozen' | 'mind_task' | 'revealed' | 'debrief'
    musclePower: 0,              // 0% to 90%
    brainPower: 20,              // 20% baseline up to 100% burst
    scoreXP: 0,
    autoTimerActive: false,
    autoTimerId: null,
    danceSecondsRemaining: 6,
    selectedPrompt: null,
    activeLobe: 'frontal',
    answeredRounds: new Set(),
    badgesEarned: new Set(['freeze_cadet'])
  };

  /* ==========================================================================
     INIT & DOM BOOTSTRAP
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initHud();
    renderCharacterStage();
    renderCockpit();
    updateDualMeters();
    selectLobe('frontal', false);
  });

  function initHud() {
    const btnSound = document.getElementById('btn-toggle-sound');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        const muted = AUDIO.toggleMute();
        btnSound.innerHTML = muted ? '<span>🔇</span> Unmute' : '<span>🔊</span> Sound';
      });
    }

    const btnTts = document.getElementById('btn-toggle-tts');
    if (btnTts) {
      btnTts.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        const ttsOn = AUDIO.toggleTts();
        btnTts.innerHTML = ttsOn ? '<span>🗣️</span> Voice On' : '<span>🤐</span> Voice Off';
      });
    }

    const btnMode = document.getElementById('btn-toggle-mode');
    if (btnMode) {
      btnMode.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        playerSession.autoTimerActive = !playerSession.autoTimerActive;
        btnMode.innerHTML = playerSession.autoTimerActive
          ? '<span>⏱️</span> Mode: Auto Timer'
          : '<span>🎮</span> Mode: Teacher Manual';
        if (!playerSession.autoTimerActive && playerSession.autoTimerId) {
          clearInterval(playerSession.autoTimerId);
          playerSession.autoTimerId = null;
        }
      });
    }
  }

  /* ==========================================================================
     DUAL ENERGY GAUGES PHYSICS
     ========================================================================== */
  function setMuscleEnergy(pct) {
    playerSession.musclePower = Math.max(0, Math.min(100, pct));
    const fill = document.getElementById('gauge-fill-muscle');
    const text = document.getElementById('meter-muscle-val');
    const note = document.getElementById('meter-muscle-note');

    if (fill) fill.style.width = playerSession.musclePower + '%';
    if (text) text.textContent = playerSession.musclePower + '%';
    if (note) {
      if (playerSession.musclePower > 50) {
        note.textContent = 'Active Movement: High ATP Fuel Burn';
      } else if (playerSession.musclePower === 0) {
        note.textContent = 'Frozen Stillness: 0% Physical Energy';
      } else {
        note.textContent = 'Resting Muscle Baseline';
      }
    }
  }

  function setBrainEnergy(pct) {
    playerSession.brainPower = Math.max(20, Math.min(100, pct));
    const fill = document.getElementById('gauge-fill-brain');
    const text = document.getElementById('meter-brain-val');
    const note = document.getElementById('meter-brain-note');

    if (fill) fill.style.width = playerSession.brainPower + '%';
    if (text) text.textContent = playerSession.brainPower + '%';
    if (note) {
      if (playerSession.brainPower >= 80) {
        note.textContent = 'Synaptic Surge: High Glucose & Oxygen Draw!';
      } else {
        note.textContent = 'Continuous Resting Metabolism: Never Shuts Down';
      }
    }
  }

  function updateDualMeters() {
    setMuscleEnergy(playerSession.musclePower);
    setBrainEnergy(playerSession.brainPower);
  }

  function addXP(pts) {
    playerSession.scoreXP = Math.min(150, playerSession.scoreXP + pts);
    const text = document.getElementById('hud-xp-val');
    if (text) text.textContent = playerSession.scoreXP;

    if (window.schoolStore && typeof window.schoolStore.addStudentXP === 'function') {
      try { window.schoolStore.addStudentXP(pts); } catch(e) {}
    }
  }

  function awardBadge(bId) {
    playerSession.badgesEarned.add(bId);
  }

  /* ==========================================================================
     LEFT HERO VIEWPORT: AVATAR & GLOWING LOBES HOLOGRAM
     ========================================================================== */
  function renderCharacterStage() {
    const stage = document.getElementById('character-hero-viewport');
    if (!stage) return;

    const isDancing = playerSession.gamePhase === 'dancing';
    const isFrozen = playerSession.gamePhase === 'frozen' || playerSession.gamePhase === 'mind_task';

    stage.innerHTML = `
      <div class="viewport-header">
        <h2><span>🧠</span> Human Metabolic Stage</h2>
        <div class="phase-state-badge ${isDancing ? 'state-dance' : 'state-freeze'}" id="phase-state-badge">
          ${isDancing ? '💃 DANCING: 90% MUSCLE' : '❄️ FROZEN: 20% BRAIN CORE'}
        </div>
      </div>

      <!-- Stage Canvas Viewport -->
      <div class="avatar-stage-canvas" id="avatar-stage-canvas">
        <svg viewBox="0 0 600 480" class="neuro-cortex-svg" id="human-metabolic-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="glow-frost" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glow-frontal" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glow-parietal" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glow-occipital" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glow-temporal" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <!-- 1. ISOMETRIC PEDESTAL & DROP SHADOW -->
          <ellipse cx="300" cy="425" rx="200" ry="38" fill="rgba(0, 0, 0, 0.65)"/>
          <ellipse cx="300" cy="418" rx="180" ry="32" fill="rgba(15, 23, 42, 0.9)" stroke="#1e293b" stroke-width="2"/>
          <ellipse cx="300" cy="418" rx="150" ry="24" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="8,6" opacity="0.6"/>

          <!-- 2. CHARACTER AVATAR (Dancing or Frozen Statue) -->
          <g id="character-rig" class="${isDancing ? 'dancing-avatar-rig' : (isFrozen ? 'frozen-statue-rig' : '')}">
            <!-- Physical Body Silhouette -->
            <!-- Torso & Muscles -->
            <polygon points="260,240 340,240 360,330 330,350 270,350 240,330" fill="${isFrozen ? 'rgba(56, 189, 248, 0.25)' : '#0f172a'}" stroke="${isFrozen ? '#38bdf8' : '#f97316'}" stroke-width="${isFrozen ? '3' : '2'}"/>

            <!-- Arms & Legs -->
            <line x1="260" y1="240" x2="210" y2="${isDancing ? '190' : '270'}" stroke="${isFrozen ? '#38bdf8' : '#f97316'}" stroke-width="8" stroke-linecap="round"/>
            <line x1="340" y1="240" x2="390" y2="${isDancing ? '180' : '270'}" stroke="${isFrozen ? '#38bdf8' : '#f97316'}" stroke-width="8" stroke-linecap="round"/>
            <line x1="270" y1="350" x2="250" y2="410" stroke="${isFrozen ? '#38bdf8' : '#334155'}" stroke-width="10" stroke-linecap="round"/>
            <line x1="330" y1="350" x2="350" y2="410" stroke="${isFrozen ? '#38bdf8' : '#334155'}" stroke-width="10" stroke-linecap="round"/>

            <!-- Head & Skull Housing -->
            <circle cx="300" cy="180" r="48" fill="${isFrozen ? 'rgba(15, 23, 42, 0.95)' : '#1e293b'}" stroke="${isFrozen ? '#7dd3fc' : '#475569'}" stroke-width="2.5"/>

            <!-- Frozen Ice Shard Crystals Overlay -->
            ${isFrozen ? `
              <polygon points="250,150 240,130 260,140" fill="#bae6fd" opacity="0.8"/>
              <polygon points="350,150 360,130 340,140" fill="#bae6fd" opacity="0.8"/>
              <polygon points="300,120 305,100 295,105" fill="#bae6fd" opacity="0.8"/>
              <text x="300" y="275" font-size="28" text-anchor="middle" opacity="0.45">❄️</text>
            ` : ''}

            <!-- 3. GLOWING CEREBRAL BRAIN LOBES (The 20% Fuel Core) -->
            <!-- Parietal (Top) -->
            <g class="cortex-lobe-path" id="lobe-svg-parietal" data-lobe="parietal">
              <path d="M 280 150 C 290 140 315 140 325 152 C 320 162 300 165 280 150 Z" fill="rgba(16, 185, 129, 0.35)" stroke="#10b981" stroke-width="2" filter="url(#glow-parietal)"/>
              <circle cx="305" cy="150" r="6" fill="#10b981"/>
            </g>

            <!-- Frontal (Front/Right) -->
            <g class="cortex-lobe-path" id="lobe-svg-frontal" data-lobe="frontal">
              <path d="M 320 155 C 338 160 342 180 332 195 C 320 190 315 170 320 155 Z" fill="rgba(245, 158, 11, 0.35)" stroke="#f59e0b" stroke-width="2" filter="url(#glow-frontal)"/>
              <circle cx="330" cy="175" r="7" fill="#f59e0b"/>
            </g>

            <!-- Occipital (Back/Left) -->
            <g class="cortex-lobe-path" id="lobe-svg-occipital" data-lobe="occipital">
              <path d="M 270 170 C 260 180 262 195 275 200 C 280 185 278 175 270 170 Z" fill="rgba(244, 63, 94, 0.35)" stroke="#f43f5e" stroke-width="2" filter="url(#glow-occipital)"/>
              <circle cx="270" cy="185" r="7" fill="#f43f5e"/>
            </g>

            <!-- Temporal (Middle-Sides) -->
            <g class="cortex-lobe-path" id="lobe-svg-temporal" data-lobe="temporal">
              <path d="M 285 180 C 295 175 315 175 320 190 C 310 200 290 200 285 180 Z" fill="rgba(168, 85, 247, 0.35)" stroke="#a855f7" stroke-width="2" filter="url(#glow-temporal)"/>
              <circle cx="302" cy="188" r="7" fill="#a855f7"/>
            </g>

            <!-- Continuous 20% Base Pulse Ring -->
            <circle cx="300" cy="178" r="28" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.65"/>
          </g>
        </svg>
      </div>

      <!-- 4 Lobe Status Indicators -->
      <div class="lobe-status-indicators">
        <div class="lobe-ind-card" id="card-lobe-frontal" style="color:var(--color-frontal);">
          <span>💡</span> Frontal
        </div>
        <div class="lobe-ind-card" id="card-lobe-occipital" style="color:var(--color-occipital);">
          <span>👁️</span> Occipital
        </div>
        <div class="lobe-ind-card" id="card-lobe-temporal" style="color:var(--color-temporal);">
          <span>🎧</span> Temporal
        </div>
        <div class="lobe-ind-card" id="card-lobe-parietal" style="color:var(--color-neuron);">
          <span>✋</span> Parietal
        </div>
      </div>

      <!-- Science Inspector Panel -->
      <div class="science-inspector-strip" id="science-inspector-strip">
        <!-- Rendered dynamically -->
      </div>
    `;

    bindLobeClickEvents();
  }

  function bindLobeClickEvents() {
    document.querySelectorAll('.cortex-lobe-path').forEach(el => {
      el.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        const lobeId = el.dataset.lobe;
        selectLobe(lobeId, true);
      });
    });
  }

  function selectLobe(lobeKey, speak = false) {
    playerSession.activeLobe = lobeKey;
    const lobeData = DATA.lobes[lobeKey];
    if (!lobeData) return;

    // Toggle active classes on SVG paths
    document.querySelectorAll('.cortex-lobe-path').forEach(p => {
      p.classList.toggle('active-thinking-lobe', p.dataset.lobe === lobeKey);
    });

    // Toggle cards
    document.querySelectorAll('.lobe-ind-card').forEach(c => {
      c.classList.toggle('active', c.id === `card-lobe-${lobeKey}`);
    });

    // Inspector Strip
    const strip = document.getElementById('science-inspector-strip');
    if (strip) {
      strip.style.borderColor = lobeData.color;
      strip.innerHTML = `
        <div class="inspector-top-row">
          <div class="inspector-title" style="color:${lobeData.color};">
            <span>${lobeData.icon}</span> ${lobeData.name} (${lobeData.alias})
          </div>
          <span class="inspector-tag" style="background:${lobeData.color}22; color:${lobeData.color}; border:1px solid ${lobeData.color}66;">
            Active Core
          </span>
        </div>
        <div class="inspector-body">
          <strong>Location:</strong> ${lobeData.locationText} &bull; <strong>Function:</strong> ${lobeData.roleInThinking}
        </div>
      `;
    }

    if (speak) {
      AUDIO.speakPrompt(lobeData.targetFormula);
    }
  }

  function triggerLobeSparkle(lobeKey) {
    const canvas = document.getElementById('avatar-stage-canvas');
    if (!canvas) return;

    const lobe = DATA.lobes[lobeKey];
    const pt = lobe?.coords || { x: '50%', y: '50%' };

    const wave = document.createElement('div');
    wave.className = 'lobe-sparkle-wave';
    wave.style.left = pt.x;
    wave.style.top = pt.y;
    wave.style.borderColor = lobe?.color || '#38bdf8';
    wave.style.boxShadow = `0 0 24px ${lobe?.color || '#38bdf8'}`;

    canvas.appendChild(wave);
    setTimeout(() => wave.remove(), 850);
  }

  /* ==========================================================================
     RIGHT COCKPIT: THE 5-STEP GAMEPLAY CONTROLLER
     ========================================================================== */
  function renderCockpit() {
    const container = document.getElementById('dynamic-freeze-deck');
    if (!container) return;

    const prompt = DATA.prompts[playerSession.currentRoundIdx] || DATA.prompts[0];
    playerSession.selectedPrompt = prompt;

    container.innerHTML = `
      <!-- Dual Energy Dashboard -->
      <section class="dual-energy-dashboard">
        <!-- Muscle Energy Gauge (90% -> 0%) -->
        <div class="energy-meter-card meter-muscle">
          <div class="meter-header-row">
            <span class="meter-name-tag" style="color:var(--color-muscle);">
              <span>🏃</span> MUSCLE ENERGY
            </span>
            <span class="meter-value-big" id="meter-muscle-val">${playerSession.musclePower}%</span>
          </div>
          <div class="gauge-track-shell">
            <div class="gauge-fill-bar gauge-fill-muscle" id="gauge-fill-muscle"></div>
          </div>
          <span class="meter-status-note" id="meter-muscle-note">
            ${playerSession.musclePower > 0 ? 'Active Movement: High ATP Fuel Burn' : 'Frozen Stillness: 0% Physical Energy'}
          </span>
        </div>

        <!-- Brain Fuel Gauge (20% Baseline -> 100% Burst) -->
        <div class="energy-meter-card meter-brain">
          <div class="meter-header-row">
            <span class="meter-name-tag" style="color:var(--color-brain);">
              <span>🧠</span> BRAIN FUEL GAUGE
            </span>
            <span class="meter-value-big" id="meter-brain-val">${playerSession.brainPower}%</span>
          </div>
          <div class="gauge-track-shell">
            <div class="gauge-fill-bar gauge-fill-brain" id="gauge-fill-brain"></div>
          </div>
          <span class="meter-status-note" id="meter-brain-note">
            Continuous Resting Metabolism: Never Shuts Down
          </span>
        </div>
      </section>

      <!-- Interactive Game Cockpit Card -->
      <div class="game-cockpit-card" id="interactive-cockpit-card">
        ${renderPhaseContent(prompt)}
      </div>
    `;

    bindCockpitEvents();
  }

  function renderPhaseContent(prompt) {
    if (playerSession.gamePhase === 'idle') {
      return `
        <div class="stage-trigger-bar">
          <button type="button" class="btn-freeze-action btn-start-dance" id="btn-start-dance">
            <span>🎵</span> Start Movement &amp; Dance!
          </button>
        </div>
        <div style="text-align:center; color:var(--text-muted); font-size:0.95rem; padding:1rem 0;">
          Get ready to dance! When the host calls <strong>FREEZE</strong>, close your eyes and listen to your brain fuel!
        </div>
      `;
    }

    if (playerSession.gamePhase === 'dancing') {
      return `
        <div class="stage-trigger-bar">
          <button type="button" class="btn-freeze-action btn-call-freeze" id="btn-call-freeze">
            <span>❄️</span> FREEZE! Brain Power Check!
          </button>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; color:#f97316; font-weight:800; font-size:1rem; padding:0.5rem;">
          <span>🎶 Dance Music Playing at 120 BPM...</span>
          <span>Muscle Fuel: 90%</span>
        </div>
      `;
    }

    if (playerSession.gamePhase === 'frozen' || playerSession.gamePhase === 'mind_task') {
      return `
        <!-- Closed-Eye Mind Task Banner -->
        <div class="mind-task-banner">
          <div class="mind-task-header">
            <span class="closed-eyes-warning">
              <span>🙈</span> EYES CLOSED &bull; 0% MUSCLE STILLNESS
            </span>
            <span class="target-lobe-indicator">
              <span>⚡</span> 528Hz Neuron Hum Active
            </span>
          </div>

          <div class="mind-task-question">
            "${prompt.taskText}"
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.1); padding-top:0.75rem;">
            <div style="font-size:0.85rem; color:#f59e0b; font-weight:800;">
              Target Lobe: ${DATA.lobes[prompt.targetLobe]?.name || 'Brain Core'}
            </div>
            <button type="button" class="btn-freeze-action" id="btn-trigger-unfreeze" style="min-height:50px; padding:0.5rem 1.5rem; font-size:1rem; background:linear-gradient(135deg, #0284c7, #38bdf8); color:#fff;">
              <span>🔔</span> Unfreeze &amp; Reveal!
            </button>
          </div>
        </div>
      `;
    }

    if (playerSession.gamePhase === 'revealed') {
      return `
        <!-- Unfreeze Action Banner -->
        <div class="unfreeze-action-banner">
          <span>📢 ${prompt.revealActionText}</span>
          <span style="font-size:0.85rem; background:rgba(255,255,255,0.2); padding:0.3rem 0.75rem; border-radius:12px;">+25 XP</span>
        </div>

        <!-- 4 Multiple Choice Answer Options -->
        <div class="reveal-options-grid">
          ${prompt.options.map(opt => `
            <button type="button" class="reveal-option-btn ${opt === prompt.answer ? 'correct-choice' : ''}" data-answer="${opt}">
              ${opt}
            </button>
          `).join('')}
        </div>
      `;
    }

    if (playerSession.gamePhase === 'debrief') {
      return `
        <div class="science-debrief-container">
          <div class="debrief-header">
            <span>🔬</span> Physiological Science Debrief
          </div>

          <div class="debrief-comparison-dial">
            <span class="dial-pill muscle">Muscles: 0% Fuel</span>
            <span style="font-weight:900; color:#fff;">VS</span>
            <span class="dial-pill brain">Brain: 20% Base + 80% Burst</span>
          </div>

          <div class="karaoke-debrief-text">
            ${prompt.scienceDebrief}
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.08); padding-top:0.75rem;">
            <span style="font-size:0.85rem; color:var(--text-muted);">
              Round ${playerSession.currentRoundIdx + 1} of ${DATA.prompts.length} Complete
            </span>
            <button type="button" class="btn-freeze-action btn-start-dance" id="btn-next-round" style="min-height:48px; padding:0.5rem 1.75rem; font-size:1rem;">
              <span>▶</span> Next Freeze Round
            </button>
          </div>
        </div>
      `;
    }

    return '';
  }

  function bindCockpitEvents() {
    // 1. Start Dance
    const btnDance = document.getElementById('btn-start-dance');
    if (btnDance) {
      btnDance.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        startDancing();
      });
    }

    // 2. Call Freeze
    const btnFreeze = document.getElementById('btn-call-freeze');
    if (btnFreeze) {
      btnFreeze.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        triggerFreeze();
      });
    }

    // 3. Trigger Unfreeze
    const btnUnfreeze = document.getElementById('btn-trigger-unfreeze');
    if (btnUnfreeze) {
      btnUnfreeze.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        triggerUnfreeze();
      });
    }

    // 4. Reveal Option Buttons
    document.querySelectorAll('.reveal-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        handleOptionAnswer(btn.dataset.answer);
      });
    });

    // 5. Next Round
    const btnNext = document.getElementById('btn-next-round');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        advanceNextRound();
      });
    }
  }

  /* ==========================================================================
     CORE 5-STEP GAMEPLAY METHODS
     ========================================================================== */

  // STEP 1: Movement Mode ("Body Dancing")
  function startDancing() {
    playerSession.gamePhase = 'dancing';
    renderCharacterStage();
    renderCockpit();

    // Dual Gauges: Muscle = 90%, Brain = 20%
    setMuscleEnergy(90);
    setBrainEnergy(20);

    AUDIO.startDanceMusic();

    // If in auto mode, schedule automatic freeze in 6 seconds
    if (playerSession.autoTimerActive) {
      playerSession.danceSecondsRemaining = 6;
      if (playerSession.autoTimerId) clearInterval(playerSession.autoTimerId);
      playerSession.autoTimerId = setInterval(() => {
        playerSession.danceSecondsRemaining--;
        if (playerSession.danceSecondsRemaining <= 0) {
          clearInterval(playerSession.autoTimerId);
          playerSession.autoTimerId = null;
          triggerFreeze();
        }
      }, 1000);
    }
  }

  // STEP 2: Freeze Call ("Brain Power Check!")
  function triggerFreeze() {
    playerSession.gamePhase = 'frozen';

    // Audio cuts with dramatic tape brake sweep
    AUDIO.triggerFreezeBrake();

    // Dual Gauges: Muscle plunges immediately to 0%, Brain holds at 20%
    setMuscleEnergy(0);
    setBrainEnergy(20);

    renderCharacterStage();
    renderCockpit();

    awardBadge('freeze_master');

    // Auto-advance to Step 3 (Mind Task) after 600ms
    setTimeout(() => {
      activateMindTask();
    }, 600);
  }

  // STEP 3: Mind Task (Neuron Synapse Hum & Lobe Activation)
  function activateMindTask() {
    playerSession.gamePhase = 'mind_task';
    const prompt = DATA.prompts[playerSession.currentRoundIdx];
    playerSession.selectedPrompt = prompt;

    // Start 528Hz clarity neuron hum
    AUDIO.startNeuronHum();

    // Brain Fuel surges toward 90% - 100%
    setBrainEnergy(95);

    // Highlight target lobe on SVG
    selectLobe(prompt.targetLobe, false);
    triggerLobeSparkle(prompt.targetLobe);

    renderCharacterStage();
    renderCockpit();

    // Spoken instructional prompt via TTS
    AUDIO.speakPrompt(prompt.spokenPrompt);
  }

  // STEP 4: Reveal & Action ("Unfreeze!")
  function triggerUnfreeze() {
    AUDIO.stopNeuronHum();
    AUDIO.playUnfreezeChime();

    playerSession.gamePhase = 'revealed';

    // Brain gauge returns to 20% baseline, muscles stay resting at 0%
    setBrainEnergy(20);
    setMuscleEnergy(0);

    renderCharacterStage();
    renderCockpit();

    const prompt = playerSession.selectedPrompt;
    if (prompt) {
      AUDIO.speakPrompt(prompt.revealActionText);
    }
  }

  function handleOptionAnswer(chosenAnswer) {
    const prompt = playerSession.selectedPrompt;
    if (!prompt) return;

    if (chosenAnswer === prompt.answer) {
      addXP(25);
      awardBadge('brain_burner');
      AUDIO.playUnfreezeChime();
      playerSession.answeredRounds.add(playerSession.currentRoundIdx);

      setTimeout(() => {
        showScienceDebrief();
      }, 700);
    } else {
      AUDIO.triggerFreezeBrake();
    }
  }

  // STEP 5: Science Debrief Dial
  function showScienceDebrief() {
    playerSession.gamePhase = 'debrief';
    renderCharacterStage();
    renderCockpit();

    const prompt = playerSession.selectedPrompt;
    if (prompt) {
      AUDIO.speakPrompt(prompt.scienceDebrief);
    }
  }

  function advanceNextRound() {
    if (playerSession.currentRoundIdx < DATA.prompts.length - 1) {
      playerSession.currentRoundIdx++;
      playerSession.gamePhase = 'idle';
      setMuscleEnergy(0);
      setBrainEnergy(20);
      renderCharacterStage();
      renderCockpit();
    } else {
      // Completed all 12 rounds! Award Master Neuro-Diploma
      awardBadge('master_neuro_diploma');
      awardBadge('science_debriefer');
      addXP(50);
      AUDIO.playUnfreezeChime();
      openVictoryModal();
    }
  }

  /* ==========================================================================
     VICTORY MODAL
     ========================================================================== */
  function openVictoryModal() {
    const modal = document.getElementById('victory-modal');
    if (!modal) return;
    modal.classList.add('open');
    AUDIO.playUnfreezeChime();
  }

  root.FreezeApp = {
    playerSession,
    startDancing,
    triggerFreeze,
    triggerUnfreeze,
    openVictoryModal
  };

})(typeof window !== 'undefined' ? window : global);
