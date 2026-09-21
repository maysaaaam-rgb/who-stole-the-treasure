/**
 * BRAIN EXPLORERS: MASTER GAME ARCHITECTURE & STATE MACHINE
 * Grade 3-4 CEFR A1+ | CLIL Human Biology & Neuroscience
 * Production-Grade Cyber-Biology Engine
 */

(function() {
  'use strict';

  const DATA = window.BRAIN_DATA;
  const AUDIO = window.BrainAudio;

  // Reactive Session State
  const playerSession = {
    phase: 'atlas',             // 'atlas' | 'relay' | 'gym' | 'broadcast'
    energy: 20,                 // Metabolic baseline: ~20% of resting energy
    xp: 0,
    selectedLobe: 'occipital',

    // Phase 1: Neuro-Atlas Sorting
    atlas: {
      currentChipIndex: 0,
      sortedChips: new Set(),
      streak: 0
    },

    // Phase 2: Synaptic Speed Relay
    relay: {
      activeRoundIdx: 0,
      activeStepIdx: 0,        // 0: Occipital, 1: Temporal, 2: Frontal
      isRunning: false,
      elapsedMs: 0,
      timerInterval: null,
      completedRounds: new Set()
    },

    // Phase 3: Neuro-Gym & Battery
    gym: {
      appliedHabits: new Set(),
      myelinLevel: 1           // 1 to 5 thickness
    },

    // Phase 4: Live Teleprompter Broadcast
    broadcast: {
      currentLineIdx: 0,
      isBroadcasting: false,
      activeWordIdx: -1,
      broadcastInterval: null
    },

    badgesEarned: new Set(['atlas_explorer'])
  };

  /* ==========================================================================
     INIT & BOOTSTRAP
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initTopNavigation();
    initHudControls();
    renderPersistentCortexHologram();
    renderCurrentPhase();
    updateEnergyMeter();
    selectLobe('occipital', false);
  });

  function initTopNavigation() {
    document.querySelectorAll('.phase-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        AUDIO.playSynapticPulse(720);
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

    document.querySelectorAll('.phase-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.phase === phaseKey);
    });

    renderCurrentPhase();
    updateCortexForPhase(phaseKey);
  }

  function addEnergy(delta) {
    playerSession.energy = Math.min(100, Math.max(20, playerSession.energy + delta));
    updateEnergyMeter();

    if (playerSession.energy >= 100) {
      awardBadge('battery_overcharge');
    }
  }

  function addXP(points) {
    playerSession.xp = Math.min(100, playerSession.xp + points);
    // Sync with school platform store if present
    if (window.schoolStore && typeof window.schoolStore.addStudentXP === 'function') {
      try { window.schoolStore.addStudentXP(points); } catch(e) {}
    }
  }

  function awardBadge(badgeId) {
    playerSession.badgesEarned.add(badgeId);
  }

  function updateEnergyMeter() {
    const fill = document.getElementById('battery-fill');
    const text = document.getElementById('battery-pct');
    if (fill) fill.style.width = playerSession.energy + '%';
    if (text) text.textContent = playerSession.energy + '%';
  }

  /* ==========================================================================
     PERSISTENT HOLOGRAPHIC CORTEX (LEFT HERO STAGE)
     ========================================================================== */
  function renderPersistentCortexHologram() {
    const stage = document.getElementById('cortex-hero-stage');
    if (!stage) return;

    stage.innerHTML = `
      <div class="cortex-hero-header">
        <h2><span>🧠</span> Human Cortex Hologram</h2>
        <div class="cortex-status-chip" id="cortex-status-chip">
          <span>⚡</span> 86B NEURONS ACTIVE
        </div>
      </div>

      <!-- Organic Lateral Human Brain SVG -->
      <div class="cortex-svg-viewport" id="cortex-svg-viewport">
        <svg viewBox="0 0 600 480">
          <defs>
            <!-- Drop Shadow & Glow Filters -->
            <filter id="glow-frontal" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#f59e0b" flood-opacity="0.6"/>
            </filter>
            <filter id="glow-parietal" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#10b981" flood-opacity="0.6"/>
            </filter>
            <filter id="glow-occipital" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#f43f5e" flood-opacity="0.6"/>
            </filter>
            <filter id="glow-temporal" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#a855f7" flood-opacity="0.6"/>
            </filter>

            <!-- Radial Background Glow -->
            <radialGradient id="holo-ambient-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#0284c7" stop-opacity="0.18"/>
              <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
            </radialGradient>
          </defs>

          <!-- Ambient Holographic Aura -->
          <circle cx="300" cy="230" r="210" fill="url(#holo-ambient-glow)"/>

          <!-- 1. BRAINSTEM (Pons & Medulla) -->
          <g id="holo-brainstem" opacity="0.85">
            <path d="M 285 340 C 285 380 290 420 300 460 L 325 460 C 335 420 330 380 325 340 Z" 
                  fill="#475569" stroke="#64748b" stroke-width="2"/>
            <path d="M 280 370 Q 308 385 332 370" fill="none" stroke="#94a3b8" stroke-width="2" opacity="0.6"/>
            <path d="M 288 405 Q 310 415 328 405" fill="none" stroke="#94a3b8" stroke-width="1.5" opacity="0.6"/>
          </g>

          <!-- 2. CEREBELLUM (Balance & Motor Striations) -->
          <g id="holo-cerebellum" opacity="0.9">
            <path d="M 370 330 C 350 360 360 415 400 430 C 440 440 485 425 500 380 C 510 345 480 330 440 325 Z" 
                  fill="#334155" stroke="#64748b" stroke-width="2.5"/>
            <!-- Cerebellar Folia (Horizontal Striation Waves) -->
            <path d="M 380 355 Q 435 345 480 350" fill="none" stroke="#94a3b8" stroke-width="1.8" opacity="0.75"/>
            <path d="M 375 375 Q 440 368 490 372" fill="none" stroke="#94a3b8" stroke-width="1.8" opacity="0.75"/>
            <path d="M 385 395 Q 440 390 480 398" fill="none" stroke="#94a3b8" stroke-width="1.8" opacity="0.75"/>
            <path d="M 400 415 Q 440 412 465 418" fill="none" stroke="#94a3b8" stroke-width="1.5" opacity="0.65"/>
          </g>

          <!-- 3. TEMPORAL LOBE (Electric Violet) -->
          <g id="lobe-temporal-group" class="lobe-path-group" data-lobe="temporal">
            <path class="lobe-fill" 
                  d="M 180 270 C 235 240 310 240 380 250 C 410 255 425 285 410 315 C 390 355 330 365 240 355 C 190 350 160 310 180 270 Z" 
                  fill="#a855f7" fill-opacity="0.32" stroke="#a855f7" stroke-width="2.5"/>
            <!-- Superior & Inferior Temporal Gyri Folds -->
            <path d="M 210 285 Q 295 275 375 285" class="cortex-sulcus-line"/>
            <path d="M 220 315 Q 305 310 370 320" class="cortex-sulcus-line"/>
            <!-- Hotspot Node Pin -->
            <circle cx="300" cy="300" r="6" fill="#a855f7" filter="url(#glow-temporal)"/>
            <circle cx="300" cy="300" r="16" fill="none" stroke="#a855f7" stroke-width="1.5" opacity="0.6"/>
            <text x="300" y="304" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">👂</text>
          </g>

          <!-- 4. OCCIPITAL LOBE (Neon Coral / Crimson) -->
          <g id="lobe-occipital-group" class="lobe-path-group" data-lobe="occipital">
            <path class="lobe-fill" 
                  d="M 445 155 C 490 180 540 215 540 275 C 540 315 500 345 440 325 C 420 280 430 210 445 155 Z" 
                  fill="#f43f5e" fill-opacity="0.32" stroke="#f43f5e" stroke-width="2.5"/>
            <!-- Visual Cortex / Calcarine Sulcus Folds -->
            <path d="M 455 210 Q 500 230 525 250" class="cortex-sulcus-line"/>
            <path d="M 450 255 Q 490 275 515 295" class="cortex-sulcus-line"/>
            <!-- Hotspot Node Pin -->
            <circle cx="485" cy="250" r="6" fill="#f43f5e" filter="url(#glow-occipital)"/>
            <circle cx="485" cy="250" r="16" fill="none" stroke="#f43f5e" stroke-width="1.5" opacity="0.6"/>
            <text x="485" y="254" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">👁️</text>
          </g>

          <!-- 5. PARIETAL LOBE (Vivid Emerald) -->
          <g id="lobe-parietal-group" class="lobe-path-group" data-lobe="parietal">
            <path class="lobe-fill" 
                  d="M 270 52 C 345 52 425 90 445 155 C 430 210 380 250 310 240 C 275 190 270 110 270 52 Z" 
                  fill="#10b981" fill-opacity="0.32" stroke="#10b981" stroke-width="2.5"/>
            <!-- Postcentral & Intraparietal Sulci -->
            <path d="M 315 75 Q 365 130 385 195" class="cortex-sulcus-line"/>
            <path d="M 360 90 Q 405 135 415 175" class="cortex-sulcus-line"/>
            <!-- Hotspot Node Pin -->
            <circle cx="360" cy="145" r="6" fill="#10b981" filter="url(#glow-parietal)"/>
            <circle cx="360" cy="145" r="16" fill="none" stroke="#10b981" stroke-width="1.5" opacity="0.6"/>
            <text x="360" y="149" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">🖐️</text>
          </g>

          <!-- 6. FRONTAL LOBE (Solar Amber) -->
          <g id="lobe-frontal-group" class="lobe-path-group" data-lobe="frontal">
            <path class="lobe-fill" 
                  d="M 80 230 C 70 140 140 60 270 52 C 270 110 275 190 310 240 C 265 245 210 265 180 270 C 130 280 90 270 80 230 Z" 
                  fill="#f59e0b" fill-opacity="0.32" stroke="#f59e0b" stroke-width="2.5"/>
            <!-- Superior Frontal & Precentral Sulci -->
            <path d="M 125 180 Q 185 130 240 100" class="cortex-sulcus-line"/>
            <path d="M 115 220 Q 190 190 260 160" class="cortex-sulcus-line"/>
            <path d="M 155 245 Q 220 230 265 205" class="cortex-sulcus-line"/>
            <!-- Hotspot Node Pin -->
            <circle cx="180" cy="160" r="6" fill="#f59e0b" filter="url(#glow-frontal)"/>
            <circle cx="180" cy="160" r="16" fill="none" stroke="#f59e0b" stroke-width="1.5" opacity="0.6"/>
            <text x="180" y="164" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">💡</text>
          </g>

          <!-- DYNAMIC SYNAPTIC FLOW ARCS (Occipital -> Temporal -> Frontal) -->
          <!-- Arc 1: Vision to Sound (Occipital -> Temporal) -->
          <path id="arc-vision-sound" class="synaptic-flow-arc" 
                d="M 485 250 C 440 300 370 320 300 300" 
                stroke="#38bdf8" stroke-width="4"/>

          <!-- Arc 2: Sound to Speech (Temporal -> Frontal) -->
          <path id="arc-sound-speech" class="synaptic-flow-arc" 
                d="M 300 300 C 240 280 210 220 180 160" 
                stroke="#fbbf24" stroke-width="4"/>

          <!-- Arc 3: Spatial Tracking (Parietal connector) -->
          <path id="arc-spatial-relay" class="synaptic-flow-arc" 
                d="M 360 145 Q 270 140 180 160" 
                stroke="#10b981" stroke-width="3"/>
        </svg>
      </div>

      <!-- Quick Lobe Selector Tabs -->
      <div class="cortex-quick-tabs">
        <button class="quick-lobe-pill" data-lobe="frontal" style="color:var(--color-frontal);">Frontal 💡</button>
        <button class="quick-lobe-pill" data-lobe="parietal" style="color:var(--color-parietal);">Parietal 🖐️</button>
        <button class="quick-lobe-pill" data-lobe="temporal" style="color:var(--color-temporal);">Temporal 👂</button>
        <button class="quick-lobe-pill" data-lobe="occipital" style="color:var(--color-occipital);">Occipital 👁️</button>
      </div>

      <!-- Live Lobe Inspector Strip -->
      <div class="cortex-inspector-strip" id="cortex-inspector-strip">
        <!-- Rendered dynamically by selectLobe -->
      </div>
    `;

    bindCortexEvents();
  }

  function bindCortexEvents() {
    // Click on SVG lobe groups
    document.querySelectorAll('.lobe-path-group').forEach(group => {
      const lobeKey = group.dataset.lobe;
      group.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        AUDIO.playSynapticPulse(560);
        selectLobe(lobeKey, true);

        // If in Phase 1 and dragging/waiting for a chip, check placement
        if (playerSession.phase === 'atlas') {
          handleAtlasLobePlacement(lobeKey);
        } else if (playerSession.phase === 'relay') {
          handleRelayNodeClick(lobeKey);
        }
      });

      // Drag and Drop support
      group.addEventListener('dragover', (e) => {
        e.preventDefault();
        group.classList.add('drag-target-hover');
      });

      group.addEventListener('dragleave', () => {
        group.classList.remove('drag-target-hover');
      });

      group.addEventListener('drop', (e) => {
        e.preventDefault();
        group.classList.remove('drag-target-hover');
        handleAtlasLobePlacement(lobeKey);
      });
    });

    // Quick bottom buttons
    document.querySelectorAll('.quick-lobe-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        AUDIO.playSynapticPulse(600);
        selectLobe(pill.dataset.lobe, true);
      });
    });
  }

  function selectLobe(lobeKey, speakPrompt = false) {
    playerSession.selectedLobe = lobeKey;
    const lobeData = DATA.lobes[lobeKey];
    if (!lobeData) return;

    // Update active highlight classes on SVG groups
    document.querySelectorAll('.lobe-path-group').forEach(grp => {
      grp.classList.toggle('active', grp.dataset.lobe === lobeKey);
    });

    // Update quick pill tabs
    document.querySelectorAll('.quick-lobe-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.lobe === lobeKey);
    });

    // Render Inspector Strip
    const strip = document.getElementById('cortex-inspector-strip');
    if (strip) {
      strip.style.borderColor = lobeData.color;
      strip.innerHTML = `
        <div class="inspector-top-row">
          <div class="inspector-lobe-name" style="color:${lobeData.color};">
            <span>${lobeData.icon}</span> ${lobeData.name}
          </div>
          <div class="inspector-formula-badge" style="background:${lobeData.color}22; color:${lobeData.color}; border:1px solid ${lobeData.color}66;">
            ${lobeData.alias}
          </div>
        </div>
        <div class="inspector-body-text">
          <strong>Language Formula:</strong> "${lobeData.primaryFormula}"
        </div>
        <div class="inspector-body-text" style="font-size:0.78rem; color:#cbd5e1;">
          <strong>Role in Reading:</strong> ${lobeData.roleInReading}
        </div>
      `;
    }

    if (speakPrompt) {
      AUDIO.speak(lobeData.primaryFormula);
    }
  }

  function triggerLobePulseEffect(lobeKey) {
    const viewport = document.getElementById('cortex-svg-viewport');
    if (!viewport) return;

    const coords = {
      frontal: { x: '30%', y: '35%' },
      parietal: { x: '60%', y: '30%' },
      occipital: { x: '80%', y: '52%' },
      temporal: { x: '50%', y: '62%' }
    };

    const pt = coords[lobeKey] || { x: '50%', y: '50%' };
    const wave = document.createElement('div');
    wave.className = 'electrical-pulse-wave';
    wave.style.left = pt.x;
    wave.style.top = pt.y;
    wave.style.borderColor = DATA.lobes[lobeKey]?.color || '#38bdf8';
    wave.style.boxShadow = `0 0 20px ${DATA.lobes[lobeKey]?.color || '#38bdf8'}`;

    viewport.appendChild(wave);
    setTimeout(() => wave.remove(), 900);
  }

  function updateCortexForPhase(phaseKey) {
    const statusChip = document.getElementById('cortex-status-chip');
    const arc1 = document.getElementById('arc-vision-sound');
    const arc2 = document.getElementById('arc-sound-speech');
    const arc3 = document.getElementById('arc-spatial-relay');

    if (arc1) arc1.classList.remove('active-circuit');
    if (arc2) arc2.classList.remove('active-circuit');
    if (arc3) arc3.classList.remove('active-circuit');

    if (phaseKey === 'atlas') {
      if (statusChip) statusChip.innerHTML = '<span>🧭</span> SENSORY SORTING MODE';
    } else if (phaseKey === 'relay') {
      if (statusChip) statusChip.innerHTML = '<span>⚡</span> 0.3s SPEED RELAY ACTIVE';
      if (arc1) arc1.classList.add('active-circuit');
      if (arc2) arc2.classList.add('active-circuit');
    } else if (phaseKey === 'gym') {
      if (statusChip) statusChip.innerHTML = '<span>🔋</span> NEURO-METABOLIC OVERCHARGE';
      if (arc3) arc3.classList.add('active-circuit');
    } else if (phaseKey === 'broadcast') {
      if (statusChip) statusChip.innerHTML = '<span>🎙️</span> ON-AIR TELEPROMPTER';
      if (arc1) arc1.classList.add('active-circuit');
      if (arc2) arc2.classList.add('active-circuit');
      if (arc3) arc3.classList.add('active-circuit');
    }
  }

  /* ==========================================================================
     PHASE ROUTER
     ========================================================================== */
  function renderCurrentPhase() {
    const container = document.getElementById('phase-cockpit-stage');
    if (!container) return;

    if (playerSession.phase === 'atlas') {
      renderPhase1Atlas(container);
    } else if (playerSession.phase === 'relay') {
      renderPhase2Relay(container);
    } else if (playerSession.phase === 'gym') {
      renderPhase3Gym(container);
    } else if (playerSession.phase === 'broadcast') {
      renderPhase4Broadcast(container);
    }
  }

  /* ==========================================================================
     PHASE 1: SENSORY SORTING ARCADE
     ========================================================================== */
  function renderPhase1Atlas(container) {
    const atlasData = DATA.phase1_atlas;
    const chips = atlasData.chips;
    const currentChip = chips[playerSession.atlas.currentChipIndex] || chips[chips.length - 1];
    const isFinished = playerSession.atlas.sortedChips.size >= chips.length;

    container.innerHTML = `
      <div class="cockpit-banner">
        <div class="banner-title-box">
          <h2><span>🧭</span> ${atlasData.title}</h2>
          <p>${atlasData.subtitle}</p>
        </div>
        <div class="pedagogy-pill">
          ${atlasData.targetFormula}
        </div>
      </div>

      <div class="cockpit-card">
        ${isFinished ? `
          <div style="text-align:center; padding:2rem; display:flex; flex-direction:column; align-items:center; gap:1rem;">
            <div style="font-size:3.5rem;">🎉</div>
            <h3 style="font-size:1.6rem; font-weight:900; color:#38bdf8;">All 6 Sensory Signals Sorted!</h3>
            <p style="color:var(--text-muted); max-width:480px;">
              You have mastered the human neuro-atlas! The cortex is fully connected and ready for high-speed reading.
            </p>
            <button type="button" class="btn-broadcast-action" id="btn-goto-relay" style="margin-top:0.5rem;">
              <span>⚡</span> Launch Phase 2: Synaptic Relay
            </button>
          </div>
        ` : `
          <div class="sorting-arcade-layout">
            <!-- Active Chip Spotlight -->
            <div class="current-chip-spotlight" id="current-chip-spotlight" draggable="true">
              <div class="spotlight-left">
                <div class="spotlight-icon-box" style="border-color:${currentChip.color};">
                  ${currentChip.icon}
                </div>
                <div class="spotlight-info">
                  <span style="font-size:0.72rem; font-weight:900; color:${currentChip.color}; text-transform:uppercase;">
                    SIGNAL ${playerSession.atlas.currentChipIndex + 1} OF ${chips.length}
                  </span>
                  <h3>${currentChip.name}</h3>
                  <p>${currentChip.description}</p>
                </div>
              </div>
              <div class="spotlight-actions">
                <button type="button" class="btn-chip-clue" id="btn-audio-clue">
                  <span>🔊</span> Listen Clue
                </button>
              </div>
            </div>

            <!-- 4 Interactive Lobe Drop Cards -->
            <div class="lobe-target-grid">
              ${Object.values(DATA.lobes).map(lobe => {
                const matchedForLobe = chips.filter(c => playerSession.atlas.sortedChips.has(c.id) && c.targetLobe === lobe.id);
                return `
                  <div class="lobe-target-card" data-target-lobe="${lobe.id}" style="color:${lobe.color};">
                    <div class="target-card-header">
                      <div class="target-lobe-label">
                        <span>${lobe.icon}</span> ${lobe.name}
                      </div>
                      <span class="target-badge-mini">${matchedForLobe.length} matched</span>
                    </div>
                    <div class="target-formula-preview">
                      "${lobe.primaryFormula}"
                    </div>
                    <div class="target-matched-chips">
                      ${matchedForLobe.map(c => `
                        <span class="matched-chip-pill" style="background:${lobe.color}22; border-color:${lobe.color}66; color:#fff;">
                          ${c.icon} ${c.name}
                        </span>
                      `).join('')}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Arcade Score & Streak Footer -->
            <div class="arcade-status-row">
              <div class="streak-counter">
                <span>🔥</span> Streak: ${playerSession.atlas.streak}x
              </div>
              <div>
                Click a lobe card or drop the signal chip onto the cortex hologram!
              </div>
            </div>
          </div>
        `}
      </div>
    `;

    bindAtlasEvents();
  }

  function bindAtlasEvents() {
    const btnClue = document.getElementById('btn-audio-clue');
    const chips = DATA.phase1_atlas.chips;
    const currentChip = chips[playerSession.atlas.currentChipIndex];

    if (btnClue && currentChip) {
      btnClue.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        AUDIO.playSynapticPulse(700);
        AUDIO.speak(currentChip.audioPrompt);
      });
    }

    // Drag-and-drop on spotlight chip
    const spotlight = document.getElementById('current-chip-spotlight');
    if (spotlight && currentChip) {
      spotlight.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', currentChip.id);
      });
    }

    // Click on lobe target cards
    document.querySelectorAll('.lobe-target-card').forEach(card => {
      const targetLobe = card.dataset.targetLobe;
      card.addEventListener('click', () => {
        handleAtlasLobePlacement(targetLobe);
      });
    });

    // Advance button when finished
    const btnGotoRelay = document.getElementById('btn-goto-relay');
    if (btnGotoRelay) {
      btnGotoRelay.addEventListener('click', () => {
        switchPhase('relay');
      });
    }
  }

  function handleAtlasLobePlacement(chosenLobe) {
    const chips = DATA.phase1_atlas.chips;
    const currentChip = chips[playerSession.atlas.currentChipIndex];
    if (!currentChip) return;

    AUDIO.ensureUnlocked();

    if (chosenLobe === currentChip.targetLobe) {
      // SUCCESS!
      playerSession.atlas.sortedChips.add(currentChip.id);
      playerSession.atlas.streak++;
      addEnergy(12);
      addXP(15);

      triggerLobePulseEffect(chosenLobe);
      selectLobe(chosenLobe, false);
      AUDIO.playMajorThirdChime();
      AUDIO.speak(currentChip.spokenFact);

      playerSession.atlas.currentChipIndex++;
      if (playerSession.atlas.currentChipIndex >= chips.length) {
        awardBadge('atlas_explorer');
        AUDIO.playVictoryFanfare();
      }

      setTimeout(() => {
        renderCurrentPhase();
      }, 500);

    } else {
      // SOFT-FAIL
      playerSession.atlas.streak = 0;
      AUDIO.playSoftFail();
      AUDIO.speak(currentChip.softFailClue);

      const spotlight = document.getElementById('current-chip-spotlight');
      if (spotlight) {
        spotlight.classList.remove('soft-fail-shake');
        void spotlight.offsetWidth; // CSS reflow
        spotlight.classList.add('soft-fail-shake');
      }
    }
  }

  /* ==========================================================================
     PHASE 2: SYNAPTIC SPEED RELAY (Under 0.30s Simulation)
     ========================================================================== */
  function renderPhase2Relay(container) {
    const relayData = DATA.phase2_relay;
    const rounds = relayData.rounds;
    const currentRound = rounds[playerSession.relay.activeRoundIdx] || rounds[0];

    container.innerHTML = `
      <div class="cockpit-banner">
        <div class="banner-title-box">
          <h2><span>⚡</span> ${relayData.title}</h2>
          <p>${relayData.subtitle}</p>
        </div>
        <div class="pedagogy-pill">
          ${relayData.teamworkMotto}
        </div>
      </div>

      <div class="cockpit-card">
        <div class="relay-stage-layout">
          <!-- 3 Progressive Rounds Selector -->
          <div class="relay-rounds-row">
            ${rounds.map((rnd, idx) => `
              <button type="button" class="round-pill-btn ${idx === playerSession.relay.activeRoundIdx ? 'active' : ''} ${playerSession.relay.completedRounds.has(idx) ? 'completed' : ''}" data-round-idx="${idx}">
                <span>Round ${idx + 1}: ${rnd.word}</span>
                <span>${playerSession.relay.completedRounds.has(idx) ? '✓' : rnd.icon}</span>
              </button>
            `).join('')}
          </div>

          <!-- Digital Milliseconds Stopwatch -->
          <div class="speed-stopwatch-display">
            <div class="timer-digits-box">
              <span class="timer-digits-label">SYNAPTIC TRANSMISSION TIME</span>
              <span class="timer-digits-val" id="relay-stopwatch-digits">
                ${(playerSession.relay.elapsedMs / 1000).toFixed(2)}s
              </span>
            </div>
            <div class="word-hero-box">
              <div class="word-hero-letters">${currentRound.word}</div>
              <div class="word-hero-phonics">${currentRound.pronunciation} &bull; ${currentRound.meaning}</div>
            </div>
          </div>

          <!-- Interactive 3-Station Synaptic Nodes -->
          <div class="relay-nodes-chain">
            ${currentRound.steps.map((step, idx) => {
              const isWaiting = idx === playerSession.relay.activeStepIdx && playerSession.relay.isRunning;
              const isActivated = idx < playerSession.relay.activeStepIdx;
              const isLocked = idx > playerSession.relay.activeStepIdx;

              return `
                <div class="relay-node-card ${isWaiting ? 'waiting-activation' : ''} ${isActivated ? 'activated' : ''} ${isLocked ? 'locked' : ''}" 
                     data-node-lobe="${step.lobeId}" data-step-idx="${idx}" style="color:${step.color};">
                  <div class="node-step-badge">STEP ${idx + 1}</div>
                  <div class="node-icon-circle">
                    ${step.lobeId === 'occipital' ? '👁️' : step.lobeId === 'temporal' ? '👂' : '💡'}
                  </div>
                  <div class="node-title">${step.name}</div>
                  <div class="node-desc">${step.actionLabel}</div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Relay Action Controls -->
          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.08); padding-top:1rem;">
            <button type="button" class="btn-broadcast-action" id="btn-start-relay">
              <span>${playerSession.relay.isRunning ? '⏹️ Reset Run' : '⚡ Start Reading Relay'}</span>
            </button>
            <div style="font-size:0.85rem; color:var(--text-muted);">
              Goal: Fire all 3 nodes before the <strong>${currentRound.targetTimeSeconds.toFixed(2)}s</strong> timer expires!
            </div>
          </div>
        </div>
      </div>
    `;

    bindRelayEvents();
  }

  function bindRelayEvents() {
    // Round selector buttons
    document.querySelectorAll('.round-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        AUDIO.playSynapticPulse(600);
        playerSession.relay.activeRoundIdx = parseInt(btn.dataset.roundIdx, 10);
        resetRelayTimer();
        renderCurrentPhase();
      });
    });

    // Start / Reset Relay button
    const btnStart = document.getElementById('btn-start-relay');
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        if (playerSession.relay.isRunning) {
          resetRelayTimer();
          renderCurrentPhase();
        } else {
          startSpeedRelay();
        }
      });
    }

    // Node click
    document.querySelectorAll('.relay-node-card').forEach(card => {
      card.addEventListener('click', () => {
        const lobeId = card.dataset.nodeLobe;
        handleRelayNodeClick(lobeId);
      });
    });
  }

  function startSpeedRelay() {
    playerSession.relay.isRunning = true;
    playerSession.relay.activeStepIdx = 0;
    playerSession.relay.elapsedMs = 0;

    AUDIO.playStudioCueBeep();

    const rounds = DATA.phase2_relay.rounds;
    const currentRound = rounds[playerSession.relay.activeRoundIdx];

    // Highlight Occipital Lobe on Hologram
    selectLobe('occipital', false);

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

  function handleRelayNodeClick(clickedLobe) {
    if (!playerSession.relay.isRunning) return;

    const rounds = DATA.phase2_relay.rounds;
    const currentRound = rounds[playerSession.relay.activeRoundIdx];
    const targetStep = currentRound.steps[playerSession.relay.activeStepIdx];

    if (!targetStep) return;

    if (clickedLobe === targetStep.lobeId) {
      // Activated node in sequence
      playerSession.relay.activeStepIdx++;
      triggerLobePulseEffect(clickedLobe);
      AUDIO.playSpeedRelayZap(playerSession.relay.activeStepIdx);

      if (playerSession.relay.activeStepIdx === 1) {
        selectLobe('temporal', false);
      } else if (playerSession.relay.activeStepIdx === 2) {
        selectLobe('frontal', false);
      }

      if (playerSession.relay.activeStepIdx >= currentRound.steps.length) {
        // ROUND COMPLETED!
        clearInterval(playerSession.relay.timerInterval);
        playerSession.relay.isRunning = false;
        playerSession.relay.completedRounds.add(playerSession.relay.activeRoundIdx);

        addEnergy(15);
        addXP(25);
        AUDIO.playMajorThirdChime();
        AUDIO.playVictoryFanfare();

        const digits = document.getElementById('relay-stopwatch-digits');
        if (digits) digits.classList.add('speed-success');

        AUDIO.speak(`Success! Reading ${currentRound.word} took only ${(playerSession.relay.elapsedMs / 1000).toFixed(2)} seconds! Reading is a whole-team effort!`);

        if (playerSession.relay.completedRounds.size >= rounds.length) {
          awardBadge('synaptic_racer');
        }

        setTimeout(() => {
          renderCurrentPhase();
        }, 1200);
      } else {
        renderCurrentPhase();
      }
    } else {
      // Clicked wrong node out of sequence
      AUDIO.playSoftFail();
    }
  }

  /* ==========================================================================
     PHASE 3: NEURO-GYM & METABOLIC OVERCHARGE (20% -> 100%)
     ========================================================================== */
  function renderPhase3Gym(container) {
    const gymData = DATA.phase3_gym;
    const habits = gymData.habits;

    container.innerHTML = `
      <div class="cockpit-banner">
        <div class="banner-title-box">
          <h2><span>🔋</span> ${gymData.title}</h2>
          <p>${gymData.subtitle}</p>
        </div>
        <div class="pedagogy-pill">
          ${gymData.instructions}
        </div>
      </div>

      <div class="cockpit-card">
        <div class="gym-stage-layout">
          <!-- Left: Live Pulsing Neuron Cell Schematic -->
          <div class="neuron-schematic-card">
            <div class="neuron-viewport" id="neuron-viewport">
              <svg viewBox="0 0 500 240">
                <!-- Dendrites (Inputs) -->
                <path d="M 80 120 Q 30 70 20 40" stroke="#06b6d4" stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M 80 120 Q 25 120 10 130" stroke="#06b6d4" stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M 80 120 Q 40 170 25 210" stroke="#06b6d4" stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M 50 95 Q 20 100 5 90" stroke="#38bdf8" stroke-width="2" fill="none"/>
                <path d="M 55 145 Q 25 155 10 170" stroke="#38bdf8" stroke-width="2" fill="none"/>

                <!-- Soma (Cell Body) & Nucleus -->
                <circle cx="100" cy="120" r="32" fill="#0284c7" opacity="0.85"/>
                <circle cx="100" cy="120" r="14" fill="#38bdf8"/>
                <text x="100" y="124" font-size="10" font-weight="900" fill="#0f172a" text-anchor="middle">DNA</text>

                <!-- Axon (Transmission Cable) -->
                <line id="neuron-axon-core" x1="132" y1="120" x2="400" y2="120" 
                      stroke="#fbbf24" stroke-width="${3 + playerSession.gym.myelinLevel * 2.5}" stroke-linecap="round"/>

                <!-- Myelin Sheath Insulators (Expand with level) -->
                <rect x="155" y="${110 - playerSession.gym.myelinLevel * 1.5}" width="50" height="${20 + playerSession.gym.myelinLevel * 3}" rx="6" fill="#10b981" opacity="0.85"/>
                <rect x="220" y="${110 - playerSession.gym.myelinLevel * 1.5}" width="50" height="${20 + playerSession.gym.myelinLevel * 3}" rx="6" fill="#10b981" opacity="0.85"/>
                <rect x="285" y="${110 - playerSession.gym.myelinLevel * 1.5}" width="50" height="${20 + playerSession.gym.myelinLevel * 3}" rx="6" fill="#10b981" opacity="0.85"/>
                <rect x="350" y="${110 - playerSession.gym.myelinLevel * 1.5}" width="40" height="${20 + playerSession.gym.myelinLevel * 3}" rx="6" fill="#10b981" opacity="0.85"/>

                <!-- Synaptic Terminals (Outputs) -->
                <path d="M 400 120 Q 450 80 480 60" stroke="#f59e0b" stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M 400 120 Q 460 120 490 120" stroke="#f59e0b" stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M 400 120 Q 450 160 480 180" stroke="#f59e0b" stroke-width="3" fill="none" stroke-linecap="round"/>

                <!-- Terminal Buttons -->
                <circle cx="480" cy="60" r="5" fill="#f59e0b"/>
                <circle cx="490" cy="120" r="5" fill="#f59e0b"/>
                <circle cx="480" cy="180" r="5" fill="#f59e0b"/>
              </svg>
            </div>

            <div class="myelin-sheath-indicator">
              <span style="font-size:0.84rem; font-weight:800; color:#10b981;">
                🛡️ Myelin Insulation: Level ${playerSession.gym.myelinLevel} / 5
              </span>
              <span style="font-size:0.78rem; color:var(--text-muted);">
                Transmission Speed: ${(120 + playerSession.gym.myelinLevel * 30)} m/s
              </span>
            </div>
          </div>

          <!-- Right: Brain Habit Booster Cards -->
          <div class="habits-selector-panel">
            ${habits.map(habit => {
              const isApplied = playerSession.gym.appliedHabits.has(habit.id);
              return `
                <div class="habit-choice-card ${isApplied ? 'applied' : ''}" data-habit-id="${habit.id}">
                  <div class="habit-left">
                    <span class="habit-icon">${habit.icon}</span>
                    <div>
                      <div class="habit-name">${habit.name}</div>
                      <div class="habit-sub">${habit.scienceFact}</div>
                    </div>
                  </div>
                  <div class="habit-boost-badge">
                    ${isApplied ? '✓ Added' : (habit.energyDelta > 0 ? `+${habit.energyDelta}%` : `${habit.energyDelta}%`)}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    bindGymEvents();
  }

  function bindGymEvents() {
    document.querySelectorAll('.habit-choice-card').forEach(card => {
      card.addEventListener('click', () => {
        const habitId = card.dataset.habitId;
        const habit = DATA.phase3_gym.habits.find(h => h.id === habitId);
        if (!habit || playerSession.gym.appliedHabits.has(habitId)) return;

        AUDIO.ensureUnlocked();

        if (habit.type === 'booster') {
          playerSession.gym.appliedHabits.add(habitId);
          playerSession.gym.myelinLevel = Math.min(5, playerSession.gym.myelinLevel + 1);
          addEnergy(habit.energyDelta);
          addXP(20);

          AUDIO.playPowerUpSweep();
          AUDIO.speak(habit.spokenFact);

          renderCurrentPhase();
        } else {
          // Distractor drainer
          AUDIO.playSoftFail();
          AUDIO.speak(habit.spokenFact);
        }
      });
    });
  }

  /* ==========================================================================
     PHASE 4: LIVE TELEPROMPTER & NEURO-BROADCAST (Karaoke Studio)
     ========================================================================== */
  function renderPhase4Broadcast(container) {
    const bData = DATA.phase4_broadcast;
    const lines = bData.scriptLines;
    const currentLine = lines[playerSession.broadcast.currentLineIdx] || lines[0];

    container.innerHTML = `
      <div class="cockpit-banner">
        <div class="banner-title-box">
          <h2><span>🎙️</span> ${bData.title}</h2>
          <p>${bData.subtitle}</p>
        </div>
        <div class="pedagogy-pill">
          ${bData.instructions}
        </div>
      </div>

      <div class="cockpit-card">
        <div class="broadcast-stage-layout">
          <div class="broadcast-studio-frame">
            <!-- Newsroom Header -->
            <div class="broadcast-header-row">
              <div class="broadcast-title-group">
                <h3><span>📡</span> BRAIN EXPLORER NEWSROOM</h3>
                <p>Broadcasting Live: How Your Brain Reads</p>
              </div>
              <div class="on-air-pill ${playerSession.broadcast.isBroadcasting ? 'live' : ''}" id="on-air-pill">
                <span>●</span> ${playerSession.broadcast.isBroadcasting ? 'LIVE ON AIR' : 'STANDBY'}
              </div>
            </div>

            <!-- Karaoke-Style Teleprompter Monitor -->
            <div class="karaoke-prompter-screen" id="karaoke-prompter-screen">
              <div class="prompter-speaker-badge" style="background:${currentLine.color}22; color:${currentLine.color}; border:1.5px solid ${currentLine.color};">
                ${currentLine.speaker} &bull; ${currentLine.formulaType}
              </div>

              <div class="prompter-karaoke-line" id="prompter-karaoke-line">
                ${currentLine.words.map((w, wIdx) => `
                  <span class="karaoke-word ${wIdx <= playerSession.broadcast.activeWordIdx ? 'spoken' : ''} ${wIdx === playerSession.broadcast.activeWordIdx ? 'active-word' : ''}">
                    ${w}
                  </span>
                `).join('')}
              </div>

              <!-- Animated Sound Wave Visualizer -->
              <div class="sound-wave-visualizer" id="sound-wave-visualizer">
                <div class="wave-bar ${playerSession.broadcast.isBroadcasting ? 'animated' : ''}" style="animation-delay:0.1s;"></div>
                <div class="wave-bar ${playerSession.broadcast.isBroadcasting ? 'animated' : ''}" style="animation-delay:0.3s;"></div>
                <div class="wave-bar ${playerSession.broadcast.isBroadcasting ? 'animated' : ''}" style="animation-delay:0.2s;"></div>
                <div class="wave-bar ${playerSession.broadcast.isBroadcasting ? 'animated' : ''}" style="animation-delay:0.4s;"></div>
                <div class="wave-bar ${playerSession.broadcast.isBroadcasting ? 'animated' : ''}" style="animation-delay:0.15s;"></div>
              </div>

              <div style="font-size:0.8rem; color:var(--text-muted); font-style:italic;">
                ${currentLine.clue}
              </div>
            </div>

            <!-- Control Bar -->
            <div class="prompter-controls-deck">
              <div style="display:flex; gap:0.75rem; align-items:center;">
                <button type="button" class="btn-broadcast-action" id="btn-run-broadcast">
                  <span>${playerSession.broadcast.isBroadcasting ? '⏸️ Pause Teleprompter' : '🎙️ Start Broadcast'}</span>
                </button>
                <button type="button" class="btn-close-modal" id="btn-next-line">
                  <span>⏭️ Next Line</span>
                </button>
              </div>

              <button type="button" class="btn-open-diploma" id="btn-finish-broadcast" style="padding:0.75rem 1.4rem;">
                <span>🎓</span> Finish &amp; Claim Diploma
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    bindBroadcastEvents();
  }

  function bindBroadcastEvents() {
    const btnRun = document.getElementById('btn-run-broadcast');
    if (btnRun) {
      btnRun.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        if (playerSession.broadcast.isBroadcasting) {
          pauseBroadcast();
        } else {
          startLiveBroadcast();
        }
      });
    }

    const btnNext = document.getElementById('btn-next-line');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        advanceBroadcastLine();
      });
    }

    const btnFinish = document.getElementById('btn-finish-broadcast');
    if (btnFinish) {
      btnFinish.addEventListener('click', () => {
        finishAndOpenDiploma();
      });
    }
  }

  function startLiveBroadcast() {
    playerSession.broadcast.isBroadcasting = true;
    AUDIO.playStudioCueBeep();

    const lines = DATA.phase4_broadcast.scriptLines;
    const line = lines[playerSession.broadcast.currentLineIdx];

    if (line && line.lobe) {
      selectLobe(line.lobe, false);
      triggerLobePulseEffect(line.lobe);
    }

    AUDIO.speakKaraoke(line.text, line.words, (wIdx) => {
      playerSession.broadcast.activeWordIdx = wIdx;
      updateKaraokeWordsDOM();
    }, () => {
      // Completed line
      setTimeout(() => {
        if (playerSession.broadcast.isBroadcasting) {
          advanceBroadcastLine();
        }
      }, 1000);
    });

    renderCurrentPhase();
  }

  function pauseBroadcast() {
    playerSession.broadcast.isBroadcasting = false;
    AUDIO.stopSpeaking();
    renderCurrentPhase();
  }

  function advanceBroadcastLine() {
    const lines = DATA.phase4_broadcast.scriptLines;
    playerSession.broadcast.currentLineIdx = (playerSession.broadcast.currentLineIdx + 1) % lines.length;
    playerSession.broadcast.activeWordIdx = -1;

    if (playerSession.broadcast.isBroadcasting) {
      startLiveBroadcast();
    } else {
      renderCurrentPhase();
    }
  }

  function updateKaraokeWordsDOM() {
    const lineEl = document.getElementById('prompter-karaoke-line');
    if (!lineEl) return;

    const words = lineEl.querySelectorAll('.karaoke-word');
    words.forEach((w, idx) => {
      w.classList.toggle('spoken', idx <= playerSession.broadcast.activeWordIdx);
      w.classList.toggle('active-word', idx === playerSession.broadcast.activeWordIdx);
    });
  }

  function finishAndOpenDiploma() {
    pauseBroadcast();
    awardBadge('broadcaster_license');
    awardBadge('licensed_neuroscientist');
    addXP(100);
    AUDIO.playVictoryFanfare();

    const modal = document.getElementById('victory-modal');
    if (modal) {
      modal.classList.add('open');
    }
  }

  /* ==========================================================================
     GLOBAL EXPORTS
     ========================================================================== */
  window.BrainApp = {
    playerSession,
    switchPhase,
    selectLobe,
    addEnergy,
    finishAndOpenDiploma
  };

})();
