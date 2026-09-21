/**
 * ADVENTURE ACADEMY ENGINE: MASTER STATE CONTROLLER & GRAPHIC PIPELINE
 * Grade 3-5 CEFR A1+/A2 | CLIL Science & Eco-Rover Expedition
 * Pure Vanilla ES6 | Zero External Dependencies
 */

(function() {
  'use strict';

  const DATA = window.ADVENTURE_DATA;
  const AUDIO = window.AdventureAudio;

  // Centralized Reactive Player Session
  const playerSession = {
    phase: 'alignment',           // 'alignment' | 'relay' | 'broadcast'
    energy: 20,                   // 20% metabolic baseline to 100%
    xp: 0,
    selectedSubsystem: 'solar',

    // Phase 1: Subsystem Calibration
    alignment: {
      currentModuleIndex: 0,
      slottedModules: new Set(),
      streak: 0
    },

    // Phase 2: Hazard Speed Relay
    relay: {
      activeRoundIdx: 0,
      activeStepIdx: 0,
      isRunning: false,
      elapsedMs: 0,
      timerInterval: null,
      completedRounds: new Set()
    },

    // Phase 3: Teleprompter Broadcast
    broadcast: {
      currentLineIdx: 0,
      isBroadcasting: false,
      activeWordIdx: -1,
      broadcastInterval: null
    },

    badgesEarned: new Set(['explorer_cadet'])
  };

  /* ==========================================================================
     INITIALIZATION & BOOTSTRAP
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHudControls();
    renderPersistentRoverHologram();
    renderCurrentPhase();
    updateEnergyMeter();
    selectSubsystem('solar', false);
  });

  function initNavigation() {
    document.querySelectorAll('.phase-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        AUDIO.playPulse(680);
        const targetPhase = btn.dataset.phase;
        switchPhase(targetPhase);
      });
    });
  }

  function initHudControls() {
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
  }

  function switchPhase(phaseKey) {
    playerSession.phase = phaseKey;

    document.querySelectorAll('.phase-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.phase === phaseKey);
    });

    renderCurrentPhase();
    updateHologramForPhase(phaseKey);
  }

  function addEnergy(delta) {
    playerSession.energy = Math.min(100, Math.max(20, playerSession.energy + delta));
    updateEnergyMeter();

    if (playerSession.energy >= 100) {
      awardBadge('energy_overcharge');
    }
  }

  function addXP(points) {
    playerSession.xp = Math.min(150, playerSession.xp + points);
    // Sync with Adventure Academy School Store if running inside platform
    if (window.schoolStore && typeof window.schoolStore.addStudentXP === 'function') {
      try { window.schoolStore.addStudentXP(points); } catch(e) {}
    }
  }

  function awardBadge(badgeId) {
    playerSession.badgesEarned.add(badgeId);
  }

  function updateEnergyMeter() {
    const fill = document.getElementById('energy-fill');
    const text = document.getElementById('energy-pct');
    if (fill) fill.style.width = playerSession.energy + '%';
    if (text) text.textContent = playerSession.energy + '%';
  }

  /* ==========================================================================
     PERSISTENT HOLOGRAPHIC ROVER & QUANTUM CORE VIEWPORT
     ========================================================================== */
  function renderPersistentRoverHologram() {
    const stage = document.getElementById('rover-hero-viewport');
    if (!stage) return;

    stage.innerHTML = `
      <div class="viewport-header">
        <h2><span>⚡</span> Eco-Rover Cyber-Core</h2>
        <div class="core-status-chip" id="core-status-chip">
          <span>🔋</span> CORE STABLE &bull; 20%
        </div>
      </div>

      <!-- Persistent Hologram Stage Viewport -->
      <div class="hologram-stage-canvas" id="rover-svg-canvas">
        <svg viewBox="0 0 600 480" class="neuro-cortex-svg" id="eco-rover-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <!-- Neon Glow Filters -->
            <filter id="glow-solar" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glow-radar" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glow-kinetic" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glow-shield" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glow-core" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <!-- 1. ISOMETRIC GROUNDING PEDESTAL & DROP SHADOW -->
          <ellipse cx="300" cy="420" rx="220" ry="42" fill="rgba(0, 0, 0, 0.6)" class="pedestal-shadow"/>
          <ellipse cx="300" cy="415" rx="200" ry="36" fill="rgba(15, 23, 42, 0.85)" stroke="#1e293b" stroke-width="2"/>
          <ellipse cx="300" cy="415" rx="170" ry="28" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="8,6" opacity="0.6"/>

          <!-- 2. ANIMATED ROVER RIG (60fps idleBob) -->
          <g class="idle-rover-rig">
            <!-- ROVER MAIN CHASSIS BODY -->
            <polygon points="200,310 400,310 440,230 390,180 210,180 160,230" fill="#0f172a" stroke="#334155" stroke-width="3"/>
            <polygon points="220,300 380,300 415,235 375,195 225,195 185,235" fill="rgba(30, 41, 59, 0.6)" stroke="#1e293b" stroke-width="1.5"/>

            <!-- CENTRAL QUANTUM CORE -->
            <g id="quantum-core-group">
              <circle cx="300" cy="240" r="38" fill="rgba(6, 182, 212, 0.2)" stroke="#06b6d4" stroke-width="2" filter="url(#glow-core)"/>
              <circle cx="300" cy="240" r="22" fill="#0284c7" opacity="0.85"/>
              <text x="300" y="246" font-size="18" text-anchor="middle" fill="#ffffff">⚡</text>
              <!-- Rotating Core Energy Ring -->
              <circle cx="300" cy="240" r="48" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="14,10" class="quantum-ring-spin"/>
            </g>

            <!-- 1. SOLAR CANOPY WINGS (Top Deck) -->
            <g class="rover-subsystem-node" id="subsystem-solar" data-subsystem="solar">
              <!-- Solar Panel Left Wing -->
              <polygon class="node-fill" points="200,170 120,135 150,110 230,145" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" stroke-width="2.5" filter="url(#glow-solar)"/>
              <!-- Solar Panel Right Wing -->
              <polygon class="node-fill" points="400,170 480,135 450,110 370,145" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" stroke-width="2.5" filter="url(#glow-solar)"/>
              <circle cx="300" cy="125" r="18" fill="#f59e0b" opacity="0.9"/>
              <text x="300" y="131" font-size="16" text-anchor="middle">☀️</text>
            </g>

            <!-- 2. KINETIC TREADS (Bottom Track Drives) -->
            <g class="rover-subsystem-node" id="subsystem-kinetic" data-subsystem="kinetic">
              <!-- Left Tread -->
              <rect class="node-fill" x="140" y="325" width="130" height="42" rx="14" fill="rgba(16, 185, 129, 0.22)" stroke="#10b981" stroke-width="3" filter="url(#glow-kinetic)"/>
              <!-- Right Tread -->
              <rect class="node-fill" x="330" y="325" width="130" height="42" rx="14" fill="rgba(16, 185, 129, 0.22)" stroke="#10b981" stroke-width="3" filter="url(#glow-kinetic)"/>
              <!-- Tread Gearing Wheels -->
              <circle cx="165" cy="346" r="10" fill="#10b981" opacity="0.8"/>
              <circle cx="205" cy="346" r="10" fill="#10b981" opacity="0.8"/>
              <circle cx="245" cy="346" r="10" fill="#10b981" opacity="0.8"/>
              <circle cx="355" cy="346" r="10" fill="#10b981" opacity="0.8"/>
              <circle cx="395" cy="346" r="10" fill="#10b981" opacity="0.8"/>
              <circle cx="435" cy="346" r="10" fill="#10b981" opacity="0.8"/>
              <circle cx="300" cy="355" r="16" fill="#10b981" opacity="0.9"/>
              <text x="300" y="361" font-size="16" text-anchor="middle">⚙️</text>
            </g>

            <!-- 3. SYNAPSE RADAR DISH (Upper Right Mast) -->
            <g class="rover-subsystem-node" id="subsystem-radar" data-subsystem="radar">
              <!-- Radar Antenna Mast -->
              <line x1="390" y1="180" x2="435" y2="135" stroke="#64748b" stroke-width="3"/>
              <!-- Parabolic Radar Dish -->
              <ellipse class="node-fill" cx="445" cy="125" rx="28" ry="16" transform="rotate(-30 445 125)" fill="rgba(56, 189, 248, 0.22)" stroke="#38bdf8" stroke-width="2.5" filter="url(#glow-radar)"/>
              <circle cx="445" cy="125" r="16" fill="#0284c7" opacity="0.9"/>
              <text x="445" y="131" font-size="16" text-anchor="middle">📡</text>
            </g>

            <!-- 4. PLASMA SHIELD MATRIX (Protective Canopy Arc) -->
            <g class="rover-subsystem-node" id="subsystem-shield" data-subsystem="shield">
              <!-- Plasma Dome Shield Arc -->
              <path class="node-fill" d="M 170 310 C 140 180 460 180 430 310" fill="none" stroke="#f43f5e" stroke-width="3.5" stroke-dasharray="10,6" filter="url(#glow-shield)"/>
              <circle cx="410" cy="275" r="16" fill="#f43f5e" opacity="0.9"/>
              <text x="410" y="281" font-size="16" text-anchor="middle">🛡️</text>
            </g>

            <!-- 5. DYNAMIC POWER CONDUIT ARCS -->
            <g class="power-circuits-layer" style="pointer-events: none;">
              <!-- Solar -> Quantum Core -->
              <path id="conduit-solar-core" class="power-conduit-arc" d="M 300 143 L 300 202" stroke="#f59e0b" stroke-width="3.5"/>
              <!-- Core -> Radar -->
              <path id="conduit-core-radar" class="power-conduit-arc" d="M 338 240 Q 390 200 429 135" stroke="#38bdf8" stroke-width="3.5"/>
              <!-- Core -> Shield -->
              <path id="conduit-core-shield" class="power-conduit-arc" d="M 335 255 Q 370 270 394 275" stroke="#f43f5e" stroke-width="3.5"/>
              <!-- Core -> Kinetic Treads -->
              <path id="conduit-core-treads" class="power-conduit-arc" d="M 300 278 L 300 339" stroke="#10b981" stroke-width="3.5"/>
            </g>
          </g>
        </svg>
      </div>

      <!-- Quick Subsystem Selector Tabs -->
      <div class="subsystem-quick-pills">
        <button type="button" class="subsystem-pill" data-subsystem="solar" style="color:var(--color-solar);">
          <span>☀️</span> Solar
        </button>
        <button type="button" class="subsystem-pill" data-subsystem="radar" style="color:var(--color-cyan);">
          <span>📡</span> Radar
        </button>
        <button type="button" class="subsystem-pill" data-subsystem="kinetic" style="color:var(--color-emerald);">
          <span>⚙️</span> Treads
        </button>
        <button type="button" class="subsystem-pill" data-subsystem="shield" style="color:var(--color-coral);">
          <span>🛡️</span> Shield
        </button>
      </div>

      <!-- Live Subsystem Inspector Panel -->
      <div class="subsystem-inspector-panel" id="subsystem-inspector-panel">
        <!-- Rendered dynamically by selectSubsystem -->
      </div>
    `;

    bindHologramEvents();
  }

  function bindHologramEvents() {
    // Click on SVG rover subsystem nodes
    document.querySelectorAll('.rover-subsystem-node').forEach(node => {
      const subId = node.dataset.subsystem;
      node.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        AUDIO.playPulse(580);
        selectSubsystem(subId, true);

        if (playerSession.phase === 'alignment') {
          handleModuleAlignment(subId);
        } else if (playerSession.phase === 'relay') {
          handleRelayNodeTrigger(subId);
        }
      });

      // Drag and Drop
      node.addEventListener('dragover', (e) => {
        e.preventDefault();
        node.classList.add('drag-target-hover');
      });

      node.addEventListener('dragleave', () => {
        node.classList.remove('drag-target-hover');
      });

      node.addEventListener('drop', (e) => {
        e.preventDefault();
        node.classList.remove('drag-target-hover');
        handleModuleAlignment(subId);
      });
    });

    // Quick selector pills
    document.querySelectorAll('.subsystem-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        AUDIO.playPulse(620);
        selectSubsystem(pill.dataset.subsystem, true);
      });
    });
  }

  function selectSubsystem(subId, speakFact = false) {
    playerSession.selectedSubsystem = subId;
    const subData = DATA.subsystems[subId];
    if (!subData) return;

    // Toggle active highlights on SVG nodes
    document.querySelectorAll('.rover-subsystem-node').forEach(node => {
      const isTarget = node.dataset.subsystem === subId;
      node.classList.toggle('active-target', isTarget);
    });

    // Toggle pills
    document.querySelectorAll('.subsystem-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.subsystem === subId);
    });

    // Render Inspector Panel
    const inspector = document.getElementById('subsystem-inspector-panel');
    if (inspector) {
      inspector.style.borderColor = subData.color;
      inspector.innerHTML = `
        <div class="inspector-top-row">
          <div class="inspector-title" style="color:${subData.color};">
            <span>${subData.icon}</span> ${subData.name}
          </div>
          <div class="inspector-badge" style="background:${subData.color}22; color:${subData.color}; border:1px solid ${subData.color}66;">
            ${playerSession.alignment.slottedModules.has(subId) ? 'ONLINE ✓' : 'OFFLINE'}
          </div>
        </div>
        <div class="inspector-formula">
          <strong>Language Formula:</strong> "${subData.primaryFormula}"
        </div>
        <div class="inspector-detail">
          <strong>Role in Expedition:</strong> ${subData.roleInExpedition}
        </div>
      `;
    }

    if (speakFact) {
      AUDIO.speak(subData.primaryFormula);
    }
  }

  function triggerEnergyPulse(subId) {
    const canvas = document.getElementById('rover-svg-canvas');
    if (!canvas) return;

    const sub = DATA.subsystems[subId];
    const pt = sub?.coords || { x: '50%', y: '50%' };

    const wave = document.createElement('div');
    wave.className = 'energy-pulse-wave';
    wave.style.left = pt.x;
    wave.style.top = pt.y;
    wave.style.borderColor = sub?.color || '#38bdf8';
    wave.style.boxShadow = `0 0 24px ${sub?.color || '#38bdf8'}`;

    canvas.appendChild(wave);
    setTimeout(() => wave.remove(), 850);
  }

  function updateHologramForPhase(phaseKey) {
    const chip = document.getElementById('core-status-chip');
    const cSolar = document.getElementById('conduit-solar-core');
    const cRadar = document.getElementById('conduit-core-radar');
    const cShield = document.getElementById('conduit-core-shield');
    const cTreads = document.getElementById('conduit-core-treads');

    [cSolar, cRadar, cShield, cTreads].forEach(c => {
      if (c) {
        c.classList.remove('active-circuit', 'synapse-firing');
        c.style.opacity = '0';
      }
    });

    if (phaseKey === 'alignment') {
      if (chip) chip.innerHTML = `<span>🧭</span> SUBSYSTEM ALIGNMENT &bull; ${playerSession.energy}%`;
    } else if (phaseKey === 'relay') {
      if (chip) chip.innerHTML = `<span>⚡</span> SPEED HAZARD RELAY &bull; ${playerSession.energy}%`;
      if (cSolar) { cSolar.classList.add('active-circuit', 'synapse-firing'); cSolar.style.opacity = '1'; }
      if (cRadar) { cRadar.classList.add('active-circuit', 'synapse-firing'); cRadar.style.opacity = '1'; }
    } else if (phaseKey === 'broadcast') {
      if (chip) chip.innerHTML = `<span>🎙️</span> ON-AIR TELEPROMPTER &bull; ${playerSession.energy}%`;
      [cSolar, cRadar, cShield, cTreads].forEach(c => {
        if (c) {
          c.classList.add('active-circuit', 'synapse-firing');
          c.style.opacity = '1';
        }
      });
    }
  }

  /* ==========================================================================
     PHASE ROUTER
     ========================================================================== */
  function renderCurrentPhase() {
    const container = document.getElementById('dynamic-cockpit-stage');
    if (!container) return;

    if (playerSession.phase === 'alignment') {
      renderPhase1Alignment(container);
    } else if (playerSession.phase === 'relay') {
      renderPhase2Relay(container);
    } else if (playerSession.phase === 'broadcast') {
      renderPhase3Broadcast(container);
    }
  }

  /* ==========================================================================
     PHASE 1: SUBSYSTEM ALIGNMENT (LAND / INPUT)
     ========================================================================== */
  function renderPhase1Alignment(container) {
    const alignData = DATA.phase1_alignment;
    const modules = alignData.modules;
    const currentMod = modules[playerSession.alignment.currentModuleIndex] || modules[modules.length - 1];
    const isFinished = playerSession.alignment.slottedModules.size >= modules.length;

    container.innerHTML = `
      <div class="cockpit-banner">
        <div class="banner-info">
          <h2><span>🧭</span> ${alignData.title}</h2>
          <p>${alignData.subtitle}</p>
        </div>
        <div class="pedagogy-pill">
          ${alignData.targetFormula}
        </div>
      </div>

      <div class="cockpit-card">
        ${isFinished ? `
          <div style="text-align:center; padding:2rem; display:flex; flex-direction:column; align-items:center; gap:1rem;">
            <div style="font-size:3.5rem;">🎉</div>
            <h3 style="font-size:1.6rem; font-weight:900; color:var(--color-cyan);">All 4 Subsystems Online & Calibrated!</h3>
            <p style="color:var(--text-muted); max-width:480px; font-size:0.95rem;">
              The Eco-Rover is energized, the quantum core is stable, and our planetary sensors are primed for extreme terrain.
            </p>
            <button type="button" class="btn-primary-action" id="btn-goto-relay" style="margin-top:0.5rem;">
              <span>⚡</span> Launch Phase 2: Hazard Speed Relay
            </button>
          </div>
        ` : `
          <!-- Active Module Spotlight Deck -->
          <div class="active-module-spotlight" id="active-module-spotlight" draggable="true">
            <div class="spotlight-left">
              <div class="spotlight-icon-box" style="border-color:${currentMod.color};">
                ${currentMod.icon}
              </div>
              <div class="spotlight-info">
                <span style="font-size:0.72rem; font-weight:900; color:${currentMod.color}; text-transform:uppercase;">
                  ENERGY MODULE ${playerSession.alignment.currentModuleIndex + 1} OF ${modules.length}
                </span>
                <h3>${currentMod.name}</h3>
                <p>${currentMod.description}</p>
              </div>
            </div>
            <div>
              <button type="button" class="btn-audio-clue" id="btn-listen-clue">
                <span>🔊</span> Listen Clue
              </button>
            </div>
          </div>

          <!-- 4 Target Subsystem Cards (Touch-first >= 64px) -->
          <div class="subsystem-targets-grid">
            ${Object.values(DATA.subsystems).map(sub => {
              const isSlotted = playerSession.alignment.slottedModules.has(sub.id);
              return `
                <div class="target-slot-card ${isSlotted ? 'completed' : ''}" data-target-sub="${sub.id}" style="color:${sub.color};">
                  <div class="target-card-header">
                    <div class="target-subsystem-label">
                      <span>${sub.icon}</span> ${sub.name}
                    </div>
                    <span style="font-size:0.75rem; font-weight:900; color:${isSlotted ? 'var(--color-emerald)' : 'var(--text-muted)'};">
                      ${isSlotted ? 'CONNECTED ✓' : 'EMPTY SLOT'}
                    </span>
                  </div>
                  <div class="target-slot-formula">
                    "${sub.primaryFormula}"
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Alignment Status Footer -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.5rem; font-size:0.85rem; color:var(--text-muted); border-top:1px solid rgba(255,255,255,0.08); padding-top:1rem;">
            <div>🔥 Alignment Streak: <strong>${playerSession.alignment.streak}x</strong></div>
            <div>Click a subsystem slot or drop the energy module onto the rover hologram!</div>
          </div>
        `}
      </div>
    `;

    bindPhase1Events();
  }

  function bindPhase1Events() {
    const btnClue = document.getElementById('btn-listen-clue');
    const modules = DATA.phase1_alignment.modules;
    const currentMod = modules[playerSession.alignment.currentModuleIndex];

    if (btnClue && currentMod) {
      btnClue.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        AUDIO.playPulse(720);
        AUDIO.speak(currentMod.audioPrompt);
      });
    }

    // Drag-and-drop on spotlight module
    const spotlight = document.getElementById('active-module-spotlight');
    if (spotlight && currentMod) {
      spotlight.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', currentMod.id);
      });
    }

    // Click on target slot cards
    document.querySelectorAll('.target-slot-card').forEach(card => {
      card.addEventListener('click', () => {
        const subId = card.dataset.targetSub;
        handleModuleAlignment(subId);
      });
    });

    const btnGotoRelay = document.getElementById('btn-goto-relay');
    if (btnGotoRelay) {
      btnGotoRelay.addEventListener('click', () => {
        switchPhase('relay');
      });
    }
  }

  function handleModuleAlignment(chosenSub) {
    const modules = DATA.phase1_alignment.modules;
    const currentMod = modules[playerSession.alignment.currentModuleIndex];
    if (!currentMod) return;

    AUDIO.ensureUnlocked();

    if (chosenSub === currentMod.targetSubsystem) {
      // SUCCESS!
      playerSession.alignment.slottedModules.add(chosenSub);
      playerSession.alignment.streak++;
      addEnergy(20);
      addXP(25);

      // Light up rover SVG element
      const svgNode = document.getElementById(`subsystem-${chosenSub}`);
      if (svgNode) svgNode.classList.add('online');

      triggerEnergyPulse(chosenSub);
      selectSubsystem(chosenSub, false);
      AUDIO.playNodeSnap();
      AUDIO.playRisingChime();
      AUDIO.speak(currentMod.spokenFact);

      playerSession.alignment.currentModuleIndex++;
      if (playerSession.alignment.currentModuleIndex >= modules.length) {
        awardBadge('core_calibrated');
        AUDIO.playVictoryFanfare();
      }

      setTimeout(() => {
        renderCurrentPhase();
      }, 550);

    } else {
      // NON-PUNITIVE SOFT FAIL (Gentle Wobble + Helpful Voice Hint)
      playerSession.alignment.streak = 0;
      AUDIO.playSoftFail();
      AUDIO.speak(currentMod.softFailClue);

      const spotlight = document.getElementById('active-module-spotlight');
      if (spotlight) {
        spotlight.classList.remove('soft-fail-shake');
        void spotlight.offsetWidth; // Reflow
        spotlight.classList.add('soft-fail-shake');
      }
    }
  }

  /* ==========================================================================
     PHASE 2: HAZARD SPEED RELAY (INTERACTIVE CHALLENGE)
     ========================================================================== */
  function renderPhase2Relay(container) {
    const relayData = DATA.phase2_relay;
    const rounds = relayData.rounds;
    const currentRound = rounds[playerSession.relay.activeRoundIdx] || rounds[0];

    container.innerHTML = `
      <div class="cockpit-banner">
        <div class="banner-info">
          <h2><span>⚡</span> ${relayData.title}</h2>
          <p>${relayData.subtitle}</p>
        </div>
        <div class="pedagogy-pill">
          ${relayData.teamworkMotto}
        </div>
      </div>

      <div class="cockpit-card">
        <div class="relay-stage-layout">
          <!-- 3 Progressive Terrain Rounds -->
          <div class="relay-rounds-bar">
            ${rounds.map((rnd, idx) => `
              <button type="button" class="round-btn-pill ${idx === playerSession.relay.activeRoundIdx ? 'active' : ''} ${playerSession.relay.completedRounds.has(idx) ? 'completed' : ''}" data-round-idx="${idx}">
                <span>Sector ${idx + 1}: ${rnd.hazardName}</span>
                <span>${playerSession.relay.completedRounds.has(idx) ? '✓' : rnd.icon}</span>
              </button>
            `).join('')}
          </div>

          <!-- High-Precision Digital Stopwatch -->
          <div class="speed-stopwatch-display">
            <div class="stopwatch-digits-box">
              <span class="stopwatch-label">HAZARD REACTION TIMER</span>
              <span class="stopwatch-digits-val" id="relay-stopwatch-digits">
                ${(playerSession.relay.elapsedMs / 1000).toFixed(2)}s
              </span>
            </div>
            <div class="hazard-alert-box">
              <div class="hazard-title-text">${currentRound.icon} ${currentRound.hazardName}</div>
              <div class="hazard-desc-text">${currentRound.situation}</div>
            </div>
          </div>

          <!-- 3 Interactive Action Nodes Chain -->
          <div class="relay-nodes-chain">
            ${currentRound.steps.map((step, idx) => {
              const isWaiting = idx === playerSession.relay.activeStepIdx && playerSession.relay.isRunning;
              const isActivated = idx < playerSession.relay.activeStepIdx;
              const isLocked = idx > playerSession.relay.activeStepIdx;
              const subData = DATA.subsystems[step.subsystemId];

              return `
                <div class="relay-node-card ${isWaiting ? 'waiting-trigger' : ''} ${isActivated ? 'activated' : ''} ${isLocked ? 'locked' : ''}"
                     data-node-sub="${step.subsystemId}" data-step-idx="${idx}" style="color:${step.color};">
                  <div class="node-step-pill">STEP ${idx + 1}</div>
                  <div class="node-icon-circle">${subData ? subData.icon : '⚡'}</div>
                  <div style="font-size:1rem; font-weight:900;">${step.name}</div>
                  <div class="node-action-text">${step.actionLabel}</div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Action Controls Footer -->
          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.08); padding-top:1rem;">
            <button type="button" class="btn-primary-action" id="btn-toggle-relay">
              <span>${playerSession.relay.isRunning ? '⏹️ Reset Run' : '⚡ Start Hazard Sequence'}</span>
            </button>
            <div style="font-size:0.85rem; color:var(--text-muted);">
              Target: Trigger all 3 subsystems in under <strong>${currentRound.targetTimeSeconds.toFixed(2)}s</strong>!
            </div>
          </div>
        </div>
      </div>
    `;

    bindPhase2Events();
  }

  function bindPhase2Events() {
    // Round pill selectors
    document.querySelectorAll('.round-btn-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        AUDIO.playPulse(600);
        playerSession.relay.activeRoundIdx = parseInt(btn.dataset.roundIdx, 10);
        resetRelayTimer();
        renderCurrentPhase();
      });
    });

    // Start/Reset Relay button
    const btnToggle = document.getElementById('btn-toggle-relay');
    if (btnToggle) {
      btnToggle.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        if (playerSession.relay.isRunning) {
          resetRelayTimer();
          renderCurrentPhase();
        } else {
          startSpeedRelay();
        }
      });
    }

    // Node trigger clicks
    document.querySelectorAll('.relay-node-card').forEach(card => {
      card.addEventListener('click', () => {
        const subId = card.dataset.nodeSub;
        handleRelayNodeTrigger(subId);
      });
    });
  }

  function startSpeedRelay() {
    playerSession.relay.isRunning = true;
    playerSession.relay.activeStepIdx = 0;
    playerSession.relay.elapsedMs = 0;

    AUDIO.playPulse(880);

    const rounds = DATA.phase2_relay.rounds;
    const currentRound = rounds[playerSession.relay.activeRoundIdx];
    const firstStep = currentRound.steps[0];
    if (firstStep) {
      selectSubsystem(firstStep.subsystemId, false);
    }

    const startTime = performance.now();
    clearInterval(playerSession.relay.timerInterval);

    playerSession.relay.timerInterval = setInterval(() => {
      playerSession.relay.elapsedMs = Math.round(performance.now() - startTime);
      const digits = document.getElementById('relay-stopwatch-digits');
      if (digits) {
        digits.textContent = (playerSession.relay.elapsedMs / 1000).toFixed(2) + 's';
      }
    }, 15);

    renderCurrentPhase();
  }

  function resetRelayTimer() {
    playerSession.relay.isRunning = false;
    clearInterval(playerSession.relay.timerInterval);
    playerSession.relay.activeStepIdx = 0;
    playerSession.relay.elapsedMs = 0;
  }

  function handleRelayNodeTrigger(clickedSub) {
    if (!playerSession.relay.isRunning) return;

    const rounds = DATA.phase2_relay.rounds;
    const currentRound = rounds[playerSession.relay.activeRoundIdx];
    const targetStep = currentRound.steps[playerSession.relay.activeStepIdx];
    if (!targetStep) return;

    if (clickedSub === targetStep.subsystemId) {
      // Step matched!
      playerSession.relay.activeStepIdx++;
      triggerEnergyPulse(clickedSub);
      AUDIO.playRelayStep(playerSession.relay.activeStepIdx);

      const nextStep = currentRound.steps[playerSession.relay.activeStepIdx];
      if (nextStep) {
        selectSubsystem(nextStep.subsystemId, false);
      }

      if (playerSession.relay.activeStepIdx >= currentRound.steps.length) {
        // ROUND CLEARED!
        clearInterval(playerSession.relay.timerInterval);
        playerSession.relay.isRunning = false;
        playerSession.relay.completedRounds.add(playerSession.relay.activeRoundIdx);

        addEnergy(20);
        addXP(35);
        AUDIO.playRisingChime();
        AUDIO.playVictoryFanfare();

        const digits = document.getElementById('relay-stopwatch-digits');
        if (digits) digits.classList.add('success-flash');

        AUDIO.speak(`Sector clear! Response time was ${(playerSession.relay.elapsedMs / 1000).toFixed(2)} seconds! Superb teamwork!`);

        if (playerSession.relay.completedRounds.size >= rounds.length) {
          awardBadge('speed_navigator');
        }

        setTimeout(() => {
          renderCurrentPhase();
        }, 1200);
      } else {
        renderCurrentPhase();
      }
    } else {
      // Non-punitive soft fail tone
      AUDIO.playSoftFail();
    }
  }

  /* ==========================================================================
     PHASE 3: LIVE TELEPROMPTER BROADCAST (SYNTHESIS & GLOWING KARAOKE)
     ========================================================================== */
  function renderPhase3Broadcast(container) {
    const broadcastData = DATA.phase3_broadcast;
    const lines = broadcastData.lines;
    const currentLine = lines[playerSession.broadcast.currentLineIdx] || lines[0];

    const words = currentLine.text.split(' ');

    container.innerHTML = `
      <div class="cockpit-banner">
        <div class="banner-info">
          <h2><span>🎙️</span> ${broadcastData.title}</h2>
          <p>${broadcastData.subtitle}</p>
        </div>
        <div class="on-air-studio-badge">
          <span>🔴</span> ON-AIR TELEPROMPTER
        </div>
      </div>

      <div class="cockpit-card">
        <div class="teleprompter-stage-layout">
          <!-- Glass Teleprompter Screen -->
          <div class="teleprompter-glass-screen">
            <div class="teleprompter-speaker-tag">
              SPEAKER ${playerSession.broadcast.currentLineIdx + 1} OF ${lines.length}: ${currentLine.speaker}
            </div>

            <!-- Streaming Karaoke Words -->
            <div class="teleprompter-text-stream" id="teleprompter-text-stream">
              ${words.map((w, i) => {
                const isActive = i === playerSession.broadcast.activeWordIdx;
                const isPast = i < playerSession.broadcast.activeWordIdx;
                return `<span class="karaoke-word ${isActive ? 'active-word' : ''} ${isPast ? 'past-word' : ''}">${w}</span>`;
              }).join(' ')}
            </div>

            <div class="teleprompter-scaffold-formula">
              <strong>Scaffold Formula:</strong> ${currentLine.scaffoldFormula}
            </div>
          </div>

          <!-- Controls Bar -->
          <div class="teleprompter-controls-bar">
            <button type="button" class="btn-primary-action" id="btn-broadcast-voice">
              <span>${playerSession.broadcast.isBroadcasting ? '⏹️ Stop Broadcast' : '🎙️ Broadcast Live Teleprompter'}</span>
            </button>
            <div style="display:flex; gap:0.5rem;">
              <button type="button" class="hud-action-btn" id="btn-teleprompter-prev" ${playerSession.broadcast.currentLineIdx === 0 ? 'disabled' : ''}>
                <span>◀</span> Previous
              </button>
              <button type="button" class="hud-action-btn" id="btn-teleprompter-next">
                <span>Next</span> <span>▶</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    bindPhase3Events();
  }

  function bindPhase3Events() {
    const btnVoice = document.getElementById('btn-broadcast-voice');
    if (btnVoice) {
      btnVoice.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        if (playerSession.broadcast.isBroadcasting) {
          stopTeleprompterBroadcast();
        } else {
          startTeleprompterBroadcast();
        }
      });
    }

    const btnNext = document.getElementById('btn-teleprompter-next');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        stopTeleprompterBroadcast();
        const lines = DATA.phase3_broadcast.lines;
        if (playerSession.broadcast.currentLineIdx < lines.length - 1) {
          playerSession.broadcast.currentLineIdx++;
          renderCurrentPhase();
        } else {
          // Completed all 4 broadcast lines -> Trigger Master Diploma Modal!
          awardBadge('broadcast_orator');
          awardBadge('master_explorer');
          addEnergy(100);
          addXP(40);
          AUDIO.playVictoryFanfare();
          openVictoryModal();
        }
      });
    }

    const btnPrev = document.getElementById('btn-teleprompter-prev');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        stopTeleprompterBroadcast();
        if (playerSession.broadcast.currentLineIdx > 0) {
          playerSession.broadcast.currentLineIdx--;
          renderCurrentPhase();
        }
      });
    }
  }

  function startTeleprompterBroadcast() {
    playerSession.broadcast.isBroadcasting = true;
    const lines = DATA.phase3_broadcast.lines;
    const currentLine = lines[playerSession.broadcast.currentLineIdx];
    if (!currentLine) return;

    AUDIO.playPulse(740);

    const words = currentLine.text.split(' ');
    playerSession.broadcast.activeWordIdx = 0;
    renderCurrentPhase();

    // Spoken synthesis with live word boundary tracking
    AUDIO.speak(
      currentLine.text,
      (charIndex) => {
        // Calculate which word is currently spoken
        const textUpToChar = currentLine.text.substring(0, charIndex).trim();
        const wordCount = textUpToChar ? textUpToChar.split(/\s+/).length : 0;
        playerSession.broadcast.activeWordIdx = wordCount;

        const stream = document.getElementById('teleprompter-text-stream');
        if (stream) {
          const spans = stream.querySelectorAll('.karaoke-word');
          spans.forEach((s, idx) => {
            s.classList.toggle('active-word', idx === wordCount);
            s.classList.toggle('past-word', idx < wordCount);
          });
        }
      },
      () => {
        // Line speech complete
        playerSession.broadcast.isBroadcasting = false;
        playerSession.broadcast.activeWordIdx = words.length;
        AUDIO.playRisingChime();

        setTimeout(() => {
          if (playerSession.broadcast.currentLineIdx < lines.length - 1) {
            playerSession.broadcast.currentLineIdx++;
            renderCurrentPhase();
          } else {
            awardBadge('broadcast_orator');
            awardBadge('master_explorer');
            openVictoryModal();
          }
        }, 1000);
      }
    );
  }

  function stopTeleprompterBroadcast() {
    playerSession.broadcast.isBroadcasting = false;
    playerSession.broadcast.activeWordIdx = -1;
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  /* ==========================================================================
     VICTORY DIPLOMA MODAL CONTROLLER
     ========================================================================== */
  function openVictoryModal() {
    const modal = document.getElementById('victory-modal');
    if (!modal) return;

    modal.classList.add('open');
    AUDIO.playVictoryFanfare();
  }

  root.AdventureApp = {
    playerSession,
    switchPhase,
    selectSubsystem,
    openVictoryModal
  };

})(typeof window !== 'undefined' ? window : global);
