/**
 * LEARNING AND YOUR BRAIN — INTERACTIVE APPLICATION ENGINE
 * Reactive state machine (playerSession) & 3-phase DOM renderers.
 */

(function() {
  'use strict';

  const DATA = window.BRAIN_DATA;
  const AUDIO = window.BrainAudio;

  // Reactive Game State
  const playerSession = {
    phase: 'atlas',            // 'atlas' | 'reading' | 'energy'
    energy: 20,                // Brain consumes 20% base energy
    selectedTokenId: null,
    matchedTokens: new Set(),
    activeLobeId: 'frontal',
    discoveredLobes: new Set(['frontal']),
    readingStep: 0,
    readingCompleted: false,
    appliedHabits: new Set(),
    practiceCount: 0,
    cableThickness: 2,
    badgesEarned: new Set(['atlas_explorer'])
  };

  /* ==========================================================================
     INIT & BOOTSTRAP
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initPhaseNavigation();
    initAudioButtons();
    renderCurrentPhase();
    updateEnergyMeter();
  });

  function initPhaseNavigation() {
    document.querySelectorAll('.phase-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        AUDIO.ensureUnlocked();
        AUDIO.playSynapticPulse(720);
        const phase = btn.dataset.phase;
        switchPhase(phase);
      });
    });
  }

  function initAudioButtons() {
    const btnMute = document.getElementById('btn-toggle-sound');
    if (btnMute) {
      btnMute.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        const isMuted = AUDIO.toggleMute();
        btnMute.innerHTML = isMuted ? '<span>🔇</span> Unmute' : '<span>🔊</span> Sound';
      });
    }

    const btnTts = document.getElementById('btn-toggle-tts');
    if (btnTts) {
      btnTts.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        const isTts = AUDIO.toggleTts();
        btnTts.innerHTML = isTts ? '<span>🗣️</span> Voice On' : '<span>🤐</span> Voice Off';
      });
    }
  }

  function switchPhase(phase) {
    playerSession.phase = phase;
    document.querySelectorAll('.phase-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.phase === phase);
    });
    renderCurrentPhase();
  }

  function addEnergy(amount) {
    playerSession.energy = Math.min(100, Math.max(0, playerSession.energy + amount));
    updateEnergyMeter();

    if (playerSession.energy >= 100 && !playerSession.badgesEarned.has('licensed_neuroscientist')) {
      awardBadge('battery_master');
      awardBadge('licensed_neuroscientist');
      setTimeout(showVictoryModal, 600);
    }
  }

  function awardBadge(badgeId) {
    playerSession.badgesEarned.add(badgeId);
  }

  function updateEnergyMeter() {
    const fillEl = document.getElementById('battery-fill');
    const textEl = document.getElementById('battery-pct');
    if (fillEl) fillEl.style.width = playerSession.energy + '%';
    if (textEl) textEl.textContent = playerSession.energy + '%';
  }

  function renderCurrentPhase() {
    const container = document.getElementById('phase-workspace-container');
    if (!container) return;

    if (playerSession.phase === 'atlas') {
      renderPhase1Atlas(container);
    } else if (playerSession.phase === 'reading') {
      renderPhase2Reading(container);
    } else if (playerSession.phase === 'energy') {
      renderPhase3Energy(container);
    } else if (playerSession.phase === 'broadcast') {
      renderPhase4Broadcast(container);
    }
  }

  /* ==========================================================================
     PHASE 1: NEURO-ATLAS (LOBE DISCOVERY & SENSORY MAPPING)
     ========================================================================== */
  function renderPhase1Atlas(container) {
    container.innerHTML = `
      <div class="stage-header-banner">
        <div>
          <h2><span>🧭</span> Phase 1: The Neuro-Atlas</h2>
          <p>Match sensory discovery tokens to their brain lobe. Touch a lobe to inspect its power!</p>
        </div>
        <div class="pedagogical-formula-pill">
          Formula: "The [Lobe] helps us [Verb]."
        </div>
      </div>

      <div class="atlas-grid">
        <!-- 1. LEFT: Sensory Tokens Tray -->
        <div class="tokens-tray-card">
          <div class="tray-header">
            <h3>Sensory Tokens</h3>
            <span class="token-count-badge" id="tray-matched-count">
              ${playerSession.matchedTokens.size} / ${DATA.sensoryTokens.length} Matched
            </span>
          </div>
          <div class="tokens-list" id="sensory-tokens-list">
            <!-- Rendered dynamically -->
          </div>
        </div>

        <!-- 2. CENTER: Interactive SVG Brain Rig -->
        <div class="brain-viewport-card">
          <div class="brain-stage-title-hud">
            <span class="stage-status-pill">● LATERAL NEURO-MAP (LEFT HEMISPHERE)</span>
            <span style="font-size:0.75rem; color:#94a3b8; font-weight:800;">Touch any lobe to inspect</span>
          </div>

          <div class="svg-brain-container" id="svg-brain-stage">
            ${generateBrainSvgMarkup()}
          </div>

          <div class="brain-instruction-banner" id="atlas-instruction-banner">
            <span>👇</span>
            <span id="instruction-text">Select a sensory token on the left, then touch its matching lobe!</span>
          </div>
        </div>

        <!-- 3. RIGHT: Lobe Inspector & Formula Card -->
        <div class="lobe-inspector-card" id="lobe-inspector-container">
          <!-- Rendered dynamically -->
        </div>
      </div>
    `;

    renderSensoryTokensList();
    bindBrainSvgEvents();
    renderLobeInspector(playerSession.activeLobeId);
  }

  function generateBrainSvgMarkup() {
    const lobes = DATA.lobes;
    return `
      <svg class="interactive-brain-svg" viewBox="50 30 280 230" id="main-brain-svg">
        <defs>
          <filter id="neuroGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Brain Stem & Cerebellum Backing -->
        <path d="M 120 220 C 130 245 155 255 175 255 C 190 255 200 240 195 220 Z" fill="#334155" stroke="#1e293b" stroke-width="2" />
        <ellipse cx="105" cy="225" rx="28" ry="18" fill="#1e293b" stroke="#475569" stroke-width="2.5" />
        <text x="92" y="229" fill="#94a3b8" font-size="9" font-weight="900">Cerebellum</text>

        <!-- 1. Occipital Lobe (Red / Vision) -->
        <path id="svg-lobe-occipital" class="lobe-interactive-path ${playerSession.activeLobeId === 'occipital' ? 'active' : ''}"
              data-lobe="occipital"
              style="--lobe-color: ${lobes.occipital.color};"
              d="${lobes.occipital.svgPath}"
              fill="${lobes.occipital.color}"
              stroke="${lobes.occipital.borderColor}" />

        <!-- 2. Temporal Lobe (Purple / Hearing) -->
        <path id="svg-lobe-temporal" class="lobe-interactive-path ${playerSession.activeLobeId === 'temporal' ? 'active' : ''}"
              data-lobe="temporal"
              style="--lobe-color: ${lobes.temporal.color};"
              d="${lobes.temporal.svgPath}"
              fill="${lobes.temporal.color}"
              stroke="${lobes.temporal.borderColor}" />

        <!-- 3. Parietal Lobe (Green / Touch & Space) -->
        <path id="svg-lobe-parietal" class="lobe-interactive-path ${playerSession.activeLobeId === 'parietal' ? 'active' : ''}"
              data-lobe="parietal"
              style="--lobe-color: ${lobes.parietal.color};"
              d="${lobes.parietal.contourPath}"
              fill="${lobes.parietal.color}"
              stroke="${lobes.parietal.borderColor}" />

        <!-- 4. Frontal Lobe (Amber / Thinking & Speech) -->
        <path id="svg-lobe-frontal" class="lobe-interactive-path ${playerSession.activeLobeId === 'frontal' ? 'active' : ''}"
              data-lobe="frontal"
              style="--lobe-color: ${lobes.frontal.color};"
              d="${lobes.frontal.svgPath}"
              fill="${lobes.frontal.color}"
              stroke="${lobes.frontal.borderColor}" />

        <!-- Center Interactive Pin Nodes with Icons -->
        <g class="lobe-pin-target" data-lobe="frontal" transform="translate(235, 150)">
          <circle r="16" fill="rgba(15,23,42,0.85)" stroke="${lobes.frontal.color}" stroke-width="2.5" />
          <text text-anchor="middle" dy="5" font-size="14">${lobes.frontal.icon}</text>
        </g>
        <g class="lobe-pin-target" data-lobe="parietal" transform="translate(210, 95)">
          <circle r="16" fill="rgba(15,23,42,0.85)" stroke="${lobes.parietal.color}" stroke-width="2.5" />
          <text text-anchor="middle" dy="5" font-size="14">${lobes.parietal.icon}</text>
        </g>
        <g class="lobe-pin-target" data-lobe="occipital" transform="translate(115, 170)">
          <circle r="16" fill="rgba(15,23,42,0.85)" stroke="${lobes.occipital.color}" stroke-width="2.5" />
          <text text-anchor="middle" dy="5" font-size="14">${lobes.occipital.icon}</text>
        </g>
        <g class="lobe-pin-target" data-lobe="temporal" transform="translate(170, 205)">
          <circle r="16" fill="rgba(15,23,42,0.85)" stroke="${lobes.temporal.color}" stroke-width="2.5" />
          <text text-anchor="middle" dy="5" font-size="14">${lobes.temporal.icon}</text>
        </g>
      </svg>
    `;
  }

  function renderSensoryTokensList() {
    const listEl = document.getElementById('sensory-tokens-list');
    if (!listEl) return;

    listEl.innerHTML = DATA.sensoryTokens.map(token => {
      const isMatched = playerSession.matchedTokens.has(token.id);
      const isSelected = playerSession.selectedTokenId === token.id;

      return `
        <div class="sensory-token ${isSelected ? 'is-selected' : ''} ${isMatched ? 'is-matched' : ''}"
             data-token-id="${token.id}">
          <div class="token-icon-box">${token.icon}</div>
          <div class="token-info">
            <div class="token-name">${token.name}</div>
            <div class="token-clue">🔍 ${token.clue}</div>
          </div>
          <div class="token-status-icon">✓</div>
        </div>
      `;
    }).join('');

    // Bind token selection events
    listEl.querySelectorAll('.sensory-token').forEach(card => {
      card.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        const tokenId = card.dataset.tokenId;
        handleSelectToken(tokenId);
      });
    });
  }

  function handleSelectToken(tokenId) {
    if (playerSession.matchedTokens.has(tokenId)) {
      AUDIO.playSynapticPulse(540);
      return;
    }

    AUDIO.playNodeConnect(600);
    playerSession.selectedTokenId = tokenId;
    renderSensoryTokensList();

    const token = DATA.sensoryTokens.find(t => t.id === tokenId);
    if (token) {
      updateInstructionBanner(`Selected "${token.name}". Which lobe helps with: ${token.clue}? Touch the brain!`);
      AUDIO.speak(token.description);
    }
  }

  function bindBrainSvgEvents() {
    const svgStage = document.getElementById('svg-brain-stage');
    if (!svgStage) return;

    const lobeElements = svgStage.querySelectorAll('.lobe-interactive-path, .lobe-pin-target');
    lobeElements.forEach(el => {
      el.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        const lobeId = el.dataset.lobe;
        handleLobeClick(lobeId);
      });
    });
  }

  function handleLobeClick(lobeId) {
    playerSession.activeLobeId = lobeId;
    playerSession.discoveredLobes.add(lobeId);

    // Update active highlight in SVG
    document.querySelectorAll('.lobe-interactive-path').forEach(p => {
      p.classList.toggle('active', p.dataset.lobe === lobeId);
    });

    renderLobeInspector(lobeId);

    // If a token is currently selected, check for match!
    if (playerSession.selectedTokenId) {
      const token = DATA.sensoryTokens.find(t => t.id === playerSession.selectedTokenId);
      if (token) {
        if (token.targetLobe === lobeId) {
          // SUCCESS MATCH!
          AUDIO.playSuccessArpeggio();
          playerSession.matchedTokens.add(token.id);
          playerSession.selectedTokenId = null;
          addEnergy(10);

          updateInstructionBanner(`🎉 MATCH! ${token.spokenFormula}`);
          AUDIO.speak(token.spokenFormula);

          renderSensoryTokensList();

          const matchCountEl = document.getElementById('tray-matched-count');
          if (matchCountEl) {
            matchCountEl.textContent = `${playerSession.matchedTokens.size} / ${DATA.sensoryTokens.length} Matched`;
          }

          // Check if all tokens are matched
          if (playerSession.matchedTokens.size === DATA.sensoryTokens.length) {
            setTimeout(() => {
              AUDIO.playPowerUpSweep();
              updateInstructionBanner(`🌟 EXCELLENT! All sensory tokens matched. Ready for Phase 2: Reading Teamwork!`);
              AUDIO.speak("Fantastic exploration! Now let's see how reading is a whole-team effort!");
            }, 1200);
          }
        } else {
          // SOFT FAIL / RETRY
          AUDIO.playSoftFail();
          const targetLobeData = DATA.lobes[token.targetLobe];
          updateInstructionBanner(`🤔 Not quite! ${token.name} is used for ${token.clue}. Try the ${targetLobeData.name}!`);
          AUDIO.speak(`Not quite. Try the ${targetLobeData.name}!`);
        }
        return;
      }
    }

    // Otherwise just inspecting the lobe
    AUDIO.playSynapticPulse(680);
    const lobeData = DATA.lobes[lobeId];
    if (lobeData) {
      updateInstructionBanner(`Inspecting ${lobeData.name}: ${lobeData.formulaSentence}`);
      AUDIO.speak(lobeData.formulaSentence);
    }
  }

  function renderLobeInspector(lobeId) {
    const container = document.getElementById('lobe-inspector-container');
    if (!container) return;

    const lobe = DATA.lobes[lobeId];
    if (!lobe) return;

    container.innerHTML = `
      <div class="inspector-top">
        <div class="inspector-lobe-badge">
          <div class="lobe-color-avatar" style="background:${lobe.color};">
            ${lobe.icon}
          </div>
          <div>
            <h3>${lobe.name}</h3>
            <span>${lobe.shortRole}</span>
          </div>
        </div>

        <div class="inspector-section">
          <div class="inspector-section-label">Core ESL Formula</div>
          <div class="inspector-formula-box" style="border-left: 4px solid ${lobe.color};">
            "${lobe.formulaSentence}"
          </div>
        </div>

        <div class="inspector-section">
          <div class="inspector-section-label">What It Does</div>
          <div class="inspector-esl-cue">
            ${lobe.eslPrompt}
          </div>
        </div>

        <div class="inspector-section">
          <div class="inspector-section-label">Reading Teamwork Role</div>
          <p style="font-size:0.8rem; color:#94a3b8; line-height:1.4;">
            <strong>Step ${lobe.readingStepNumber}:</strong> ${lobe.readingRole}
          </p>
        </div>
      </div>

      <button class="inspector-btn-action" id="btn-speak-lobe-formula">
        <span>🔊</span> Listen &amp; Repeat Formula
      </button>
    `;

    const speakBtn = document.getElementById('btn-speak-lobe-formula');
    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        AUDIO.speak(lobe.formulaSentence);
      });
    }
  }

  function updateInstructionBanner(text) {
    const bannerText = document.getElementById('instruction-text');
    if (bannerText) {
      bannerText.textContent = text;
    }
  }

  /* ==========================================================================
     PHASE 2: READING TEAMWORK PATHWAY BUILDER
     ========================================================================== */
  function renderPhase2Reading(container) {
    const rData = DATA.readingJourney;

    container.innerHTML = `
      <div class="stage-header-banner">
        <div>
          <h2><span>⚡</span> Phase 2: Reading Teamwork Pathway</h2>
          <p>Watch how all 4 lobes connect in 0.3 seconds to read a word aloud!</p>
        </div>
        <div class="pedagogical-formula-pill" style="border-color:var(--neon-amber); color:var(--neon-amber);">
          ${rData.teamworkMotto}
        </div>
      </div>

      <div class="reading-stage-layout">
        <!-- 1. LEFT: Interactive Pathway Board -->
        <div class="reading-interactive-board">
          <!-- Word Hero Card -->
          <div class="reading-word-hero">
            <div class="word-hero-left">
              <div class="word-emoji-box">${rData.imageIcon}</div>
              <div>
                <div class="word-letters-text">${rData.word}</div>
                <div class="word-phonemes-tag">Phonemes: ${rData.wordPronunciation}</div>
              </div>
            </div>
            <button class="hud-btn" id="btn-listen-word" style="background:#090d16;">
              <span>🔊</span> Hear Word
            </button>
          </div>

          <!-- 4-Step Teamwork Relay Grid -->
          <div class="teamwork-relay-grid" id="teamwork-relay-container">
            ${rData.steps.map(s => `
              <div class="relay-step-card ${playerSession.readingStep >= s.step ? 'completed' : ''} ${playerSession.readingStep === s.step - 1 ? 'active' : ''}"
                   id="relay-card-${s.step}"
                   style="--card-color:${s.color}; --card-color-glow:${s.color}66;">
                <div class="relay-step-badge" style="background:${s.color};">
                  Step ${s.step}
                </div>
                <div class="relay-lobe-title">${s.lobeName}</div>
                <div class="relay-action-text">${s.detail}</div>
                <div class="relay-time-pill">⏱ ~0.0${s.step * 7}s</div>
              </div>
            `).join('')}
          </div>

          <!-- Action & Trigger Bar -->
          <div class="reading-action-bar">
            <div class="motto-banner">
              <span>🤝</span>
              <span>"Reading is a whole-team effort!"</span>
            </div>
            <button class="btn-trigger-circuit" id="btn-run-reading-relay">
              <span>⚡</span> Trigger 0.3s Neural Relay!
            </button>
          </div>
        </div>

        <!-- 2. RIGHT: Synaptic Circuit Visualizer SVG -->
        <div class="reading-side-canvas">
          <div style="width:100%; display:flex; justify-content:space-between; align-items:center;">
            <span class="stage-status-pill">SYNAPTIC RELAY CIRCUIT</span>
            <span id="relay-status-text" style="font-size:0.75rem; font-weight:800; color:#fbbf24;">Ready to fire</span>
          </div>

          <div style="width:100%; height:320px; display:flex; align-items:center; justify-content:center;">
            ${generateCircuitSvgMarkup()}
          </div>

          <div style="background:#090d16; border:1px solid #334155; padding:0.6rem 1rem; border-radius:10px; width:100%; text-align:center;">
            <span style="font-size:0.8rem; font-weight:800; color:#94a3b8;" id="circuit-live-caption">
              Click "Trigger 0.3s Neural Relay" to watch the electrical spark connect all 4 lobes!
            </span>
          </div>
        </div>
      </div>
    `;

    bindReadingEvents();
  }

  function generateCircuitSvgMarkup() {
    const lobes = DATA.lobes;
    return `
      <svg viewBox="60 40 260 210" width="100%" height="100%" id="circuit-svg">
        <!-- Connecting Synaptic Cable Lines -->
        <!-- Step 1 to 2: Occipital -> Temporal -->
        <line id="cable-1-2" x1="115" y1="170" x2="170" y2="205"
              stroke="#475569" stroke-width="4" stroke-linecap="round" />
        <!-- Step 2 to 3: Temporal -> Parietal -->
        <line id="cable-2-3" x1="170" y1="205" x2="210" y2="95"
              stroke="#475569" stroke-width="4" stroke-linecap="round" />
        <!-- Step 3 to 4: Parietal -> Frontal -->
        <line id="cable-3-4" x1="210" y1="95" x2="235" y2="150"
              stroke="#475569" stroke-width="4" stroke-linecap="round" />

        <!-- 4 Lobe Relay Nodes -->
        <!-- 1. Occipital -->
        <g id="circuit-node-occipital" transform="translate(115, 170)">
          <circle r="22" fill="#0f172a" stroke="${lobes.occipital.color}" stroke-width="3" />
          <text text-anchor="middle" dy="6" font-size="16">${lobes.occipital.icon}</text>
          <text text-anchor="middle" dy="34" fill="#ef4444" font-size="9" font-weight="900">1. Occipital</text>
        </g>

        <!-- 2. Temporal -->
        <g id="circuit-node-temporal" transform="translate(170, 205)">
          <circle r="22" fill="#0f172a" stroke="${lobes.temporal.color}" stroke-width="3" />
          <text text-anchor="middle" dy="6" font-size="16">${lobes.temporal.icon}</text>
          <text text-anchor="middle" dy="34" fill="#a855f7" font-size="9" font-weight="900">2. Temporal</text>
        </g>

        <!-- 3. Parietal -->
        <g id="circuit-node-parietal" transform="translate(210, 95)">
          <circle r="22" fill="#0f172a" stroke="${lobes.parietal.color}" stroke-width="3" />
          <text text-anchor="middle" dy="6" font-size="16">${lobes.parietal.icon}</text>
          <text text-anchor="middle" dy="-26" fill="#10b981" font-size="9" font-weight="900">3. Parietal</text>
        </g>

        <!-- 4. Frontal -->
        <g id="circuit-node-frontal" transform="translate(235, 150)">
          <circle r="22" fill="#0f172a" stroke="${lobes.frontal.color}" stroke-width="3" />
          <text text-anchor="middle" dy="6" font-size="16">${lobes.frontal.icon}</text>
          <text text-anchor="middle" dy="34" fill="#f59e0b" font-size="9" font-weight="900">4. Frontal</text>
        </g>
      </svg>
    `;
  }

  function bindReadingEvents() {
    const btnHear = document.getElementById('btn-listen-word');
    if (btnHear) {
      btnHear.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        AUDIO.speak('Cat! C, A, T. Cat!');
      });
    }

    const btnRelay = document.getElementById('btn-run-reading-relay');
    if (btnRelay) {
      btnRelay.addEventListener('click', runReadingRelaySequence);
    }
  }

  function runReadingRelaySequence() {
    AUDIO.ensureUnlocked();
    const btn = document.getElementById('btn-run-reading-relay');
    if (btn) btn.disabled = true;

    const captionEl = document.getElementById('circuit-live-caption');
    const statusEl = document.getElementById('relay-status-text');

    const steps = DATA.readingJourney.steps;
    let curStepIndex = 0;

    function executeNextStep() {
      if (curStepIndex >= steps.length) {
        // Complete relay!
        AUDIO.playSuccessArpeggio();
        if (captionEl) captionEl.innerHTML = '🎉 <strong>WHOLE-TEAM EFFORT COMPLETE!</strong> All 4 lobes fired in 0.3s!';
        if (statusEl) statusEl.textContent = 'Circuit Locked & Active!';
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<span>⚡</span> Replay Relay!';
        }

        if (!playerSession.readingCompleted) {
          playerSession.readingCompleted = true;
          awardBadge('teamwork_champion');
          addEnergy(15);
        }

        AUDIO.speak('Reading is a whole-team effort! Cat!');
        return;
      }

      const s = steps[curStepIndex];
      playerSession.readingStep = s.step;

      // Update Relay Card UI
      document.querySelectorAll('.relay-step-card').forEach((card, idx) => {
        card.classList.toggle('active', idx === curStepIndex);
        card.classList.toggle('completed', idx < curStepIndex);
      });

      // Highlight cable & node
      if (curStepIndex === 0) {
        AUDIO.playSynapticPulse(520);
        highlightCircuitNode('occipital', s.color);
      } else if (curStepIndex === 1) {
        AUDIO.playSynapticPulse(650);
        highlightCircuitCable('cable-1-2', s.color);
        highlightCircuitNode('temporal', s.color);
      } else if (curStepIndex === 2) {
        AUDIO.playSynapticPulse(780);
        highlightCircuitCable('cable-2-3', s.color);
        highlightCircuitNode('parietal', s.color);
      } else if (curStepIndex === 3) {
        AUDIO.playSynapticPulse(1040);
        highlightCircuitCable('cable-3-4', s.color);
        highlightCircuitNode('frontal', s.color);
      }

      if (captionEl) {
        captionEl.innerHTML = `<strong>Step ${s.step}:</strong> ${s.action} (${s.lobeName})`;
      }

      AUDIO.speak(s.voicePrompt, () => {
        curStepIndex++;
        setTimeout(executeNextStep, 350);
      });
    }

    executeNextStep();
  }

  function highlightCircuitNode(lobeId, color) {
    const node = document.getElementById(`circuit-node-${lobeId}`);
    if (node) {
      const circle = node.querySelector('circle');
      if (circle) {
        circle.setAttribute('fill', color);
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('filter', 'url(#neuroGlow)');
      }
    }
  }

  function highlightCircuitCable(cableId, color) {
    const cable = document.getElementById(cableId);
    if (cable) {
      cable.setAttribute('stroke', color);
      cable.setAttribute('stroke-width', '6');
      cable.classList.add('synaptic-cable-line');
    }
  }

  /* ==========================================================================
     PHASE 3: NEURO-ENERGY CHALLENGE & NEUROPLASTICITY
     ========================================================================== */
  function renderPhase3Energy(container) {
    container.innerHTML = `
      <div class="stage-header-banner">
        <div>
          <h2><span>🔋</span> Phase 3: Power Your Brain!</h2>
          <p>Your brain uses 20% of your body's energy. Practice makes your neural pathways stronger!</p>
        </div>
        <div class="pedagogical-formula-pill" style="border-color:var(--neon-green); color:var(--neon-green);">
          ⚡ Target: Charge Brain Battery to 100%!
        </div>
      </div>

      <div class="energy-stage-layout">
        <!-- 1. LEFT: Interactive Habits Grid -->
        <div class="habits-pane-card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3 style="font-size:1.1rem; font-weight:900; color:#fff;">Brain Habits &amp; Energy Boosters</h3>
            <span style="font-size:0.8rem; color:#94a3b8; font-weight:800;">Choose healthy habits to charge up</span>
          </div>

          <div class="habits-grid">
            ${DATA.energyHabits.map(h => {
              const isApplied = playerSession.appliedHabits.has(h.id);
              return `
                <div class="habit-interactive-card ${isApplied ? 'applied' : ''}" data-habit-id="${h.id}">
                  <div class="habit-icon-badge">${h.icon}</div>
                  <div class="habit-content">
                    <h4>${h.name}</h4>
                    <p class="habit-fact-text">${h.scienceFact}</p>
                    <span class="energy-tag ${h.isBooster ? 'plus' : 'minus'}">
                      ${h.isBooster ? '+' : ''}${h.energyChange}% Energy
                    </span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 2. RIGHT: Neuroplasticity Synaptic Cable Simulator -->
        <div class="neuroplasticity-pane-card">
          <div>
            <h3 style="font-size:1.1rem; font-weight:900; color:#fff; margin-bottom:4px;">Neuroplasticity Cable</h3>
            <p style="font-size:0.78rem; color:#94a3b8;">"The more we practice, the stronger neurons connect!"</p>
          </div>

          <div class="cable-visualizer-box">
            <svg viewBox="0 0 240 140" width="100%" height="100%">
              <!-- Left Neuron Node -->
              <circle cx="40" cy="70" r="20" fill="#0f172a" stroke="#38bdf8" stroke-width="3" />
              <text x="40" y="75" text-anchor="middle" font-size="14">🧠</text>

              <!-- Axon Cable Pathway -->
              <line id="plasticity-axon" x1="60" y1="70" x2="180" y2="70"
                    stroke="#38bdf8" stroke-width="${playerSession.cableThickness}"
                    stroke-linecap="round" stroke-dasharray="${playerSession.cableThickness < 6 ? '6,6' : 'none'}" />

              <!-- Right Neuron Node -->
              <circle cx="200" cy="70" r="20" fill="#0f172a" stroke="#10b981" stroke-width="3" />
              <text x="200" y="75" text-anchor="middle" font-size="14">💡</text>
            </svg>
          </div>

          <div class="cable-thickness-badge" id="cable-strength-text">
            Pathway Strength: ${playerSession.practiceCount === 0 ? 'Normal (Practice to strengthen!)' : 'Supercharged ' + playerSession.practiceCount + 'x!'}
          </div>

          <button class="inspector-btn-action" id="btn-practice-neuroplasticity" style="width:100%; margin-top:1rem; background:linear-gradient(135deg, #10b981, #059669);">
            <span>📖</span> Practice Reading (+Thicken Pathway)
          </button>
        </div>
      </div>
    `;

    bindEnergyEvents();
  }

  function bindEnergyEvents() {
    document.querySelectorAll('.habit-interactive-card').forEach(card => {
      card.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        const habitId = card.dataset.habitId;
        handleApplyHabit(habitId);
      });
    });

    const btnPractice = document.getElementById('btn-practice-neuroplasticity');
    if (btnPractice) {
      btnPractice.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        handlePracticeNeuroplasticity();
      });
    }
  }

  function handleApplyHabit(habitId) {
    if (playerSession.appliedHabits.has(habitId)) return;

    const habit = DATA.energyHabits.find(h => h.id === habitId);
    if (!habit) return;

    playerSession.appliedHabits.add(habitId);

    if (habit.isBooster) {
      AUDIO.playPowerUpSweep();
      addEnergy(habit.energyChange);
    } else {
      AUDIO.playSoftFail();
      addEnergy(habit.energyChange);
    }

    AUDIO.speak(habit.speech);

    const card = document.querySelector(`.habit-interactive-card[data-habit-id="${habitId}"]`);
    if (card) card.classList.add('applied');
  }

  function handlePracticeNeuroplasticity() {
    playerSession.practiceCount++;
    playerSession.cableThickness = Math.min(14, playerSession.cableThickness + 2.5);

    AUDIO.playSuccessArpeggio();
    addEnergy(15);

    const axon = document.getElementById('plasticity-axon');
    if (axon) {
      axon.setAttribute('stroke-width', playerSession.cableThickness);
      if (playerSession.cableThickness >= 6) {
        axon.setAttribute('stroke-dasharray', 'none');
        axon.setAttribute('stroke', '#10b981');
      }
    }

    const badge = document.getElementById('cable-strength-text');
    if (badge) {
      badge.textContent = `Pathway Strength: Supercharged ${playerSession.practiceCount}x!`;
      badge.style.borderColor = '#10b981';
      badge.style.color = '#10b981';
    }

    AUDIO.speak("Practice strengthens your neural pathways! The more you read, the faster you get!");
  }

  /* ==========================================================================
     PHASE 4: LIVE TELEPROMPTER BROADCAST STUDIO
     ========================================================================== */
  const broadcastState = {
    activeLineIdx: -1,
    isPlaying: false,
    timerId: null,
    speedMs: 4500
  };

  function renderPhase4Broadcast(container) {
    const data = DATA.teleprompter;
    const lines = data.teleprompterLines;

    container.innerHTML = `
      <div class="stage-header-banner">
        <div>
          <h2><span>🎙️</span> Phase 4: Live Teleprompter Broadcast</h2>
          <p>${data.subtitle}</p>
        </div>
        <div class="pedagogical-formula-pill">
          Formula: "The [Lobe] helps us [Verb]." &bull; "We use our [Lobe] to [Verb]."
        </div>
      </div>

      <div class="broadcast-stage-layout">
        <!-- Main Teleprompter Monitor & Controls -->
        <div class="broadcast-main-shell">
          <div class="broadcast-studio-header">
            <div class="studio-title-box">
              <h2><span>📺</span> ${data.headline}</h2>
              <p>${data.instruction}</p>
            </div>
            <div class="on-air-badge" id="on-air-badge">
              <span>●</span> STANDBY
            </div>
          </div>

          <!-- Scrolling Monitor Screen -->
          <div class="teleprompter-monitor" id="teleprompter-monitor">
            ${lines.map((item, idx) => `
              <div class="prompter-line-card" id="prompter-line-${idx}" data-line-index="${idx}">
                <div class="prompter-line-left">
                  <span class="prompter-speaker-tag" style="background:${item.color}22; color:${item.color}; border:1px solid ${item.color}66;">
                    ${item.icon} ${item.speaker}
                  </span>
                  <div class="prompter-line-text">
                    ${item.text}
                  </div>
                </div>
                <button type="button" class="prompter-listen-btn" title="Listen to model speech" data-listen-idx="${idx}">
                  🔊
                </button>
              </div>
            `).join('')}
          </div>

          <!-- Progress Bar for active line -->
          <div class="teleprompter-progress-track">
            <div class="teleprompter-progress-fill" id="teleprompter-progress-fill"></div>
          </div>

          <!-- Studio Control Deck -->
          <div class="broadcast-control-deck">
            <div style="display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap;">
              <button type="button" class="deck-btn-primary" id="btn-start-broadcast">
                <span>🎙️</span> START LIVE BROADCAST
              </button>
              <button type="button" class="action-btn-secondary" id="btn-reset-broadcast" style="background:#1e293b; color:#fff; border:1px solid #334155; padding:0.85rem 1.2rem; border-radius:10px; font-weight:800; cursor:pointer;">
                ⏹️ Reset
              </button>
            </div>

            <div class="deck-speed-group">
              <span>Speed:</span>
              <button type="button" class="speed-chip ${broadcastState.speedMs === 6000 ? 'active' : ''}" data-speed="6000">Slow (6s)</button>
              <button type="button" class="speed-chip ${broadcastState.speedMs === 4500 ? 'active' : ''}" data-speed="4500">Normal (4.5s)</button>
              <button type="button" class="speed-chip ${broadcastState.speedMs === 3000 ? 'active' : ''}" data-speed="3000">Fast (3s)</button>
            </div>
          </div>
        </div>

        <!-- Right Side: News Anchor Avatar & Target Sentence Frames -->
        <div class="broadcast-side-panel">
          <div class="side-anchor-card">
            <h3><span>🧑‍🔬</span> On-Camera Anchor</h3>
            <div class="anchor-avatar-box">
              <span class="anchor-avatar-icon">🎙️</span>
              <p style="font-size:0.88rem; font-weight:800; margin-top:0.5rem; color:#38bdf8;">Junior Neuroscientist</p>
              <p style="font-size:0.75rem; color:var(--text-muted);">Broadcasting from the Adventure Academy Neuro-Lab!</p>
            </div>
          </div>

          <div class="side-formula-card">
            <h3><span>📋</span> Speaking Target Formulas</h3>
            <div class="formula-pill-item">
              <span>The <strong>[lobe]</strong> helps us <strong>[verb]</strong>.</span><br>
              <em style="color:#94a3b8; font-size:0.75rem;">"The Occipital Lobe helps us see letters."</em>
            </div>
            <div class="formula-pill-item">
              <span>We use our <strong>[lobe]</strong> to <strong>[verb]</strong>.</span><br>
              <em style="color:#94a3b8; font-size:0.75rem;">"We use our Frontal Lobe to understand meaning."</em>
            </div>
            <div class="formula-pill-item" style="border-left-color:var(--neon-amber);">
              <strong>Reading is a whole-team effort!</strong><br>
              <em style="color:#94a3b8; font-size:0.75rem;">All 4 lobes connect in 0.3 seconds!</em>
            </div>
          </div>
        </div>
      </div>
    `;

    bindBroadcastEvents();
  }

  function bindBroadcastEvents() {
    const lines = DATA.teleprompter.teleprompterLines;

    // Per-line listen buttons
    document.querySelectorAll('.prompter-listen-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        AUDIO.ensureUnlocked();
        const idx = parseInt(btn.dataset.listenIdx, 10);
        if (lines[idx]) {
          AUDIO.playSynapticPulse(640);
          AUDIO.speak(lines[idx].text);
          highlightPrompterLine(idx);
        }
      });
    });

    // Per-line card click to jump/speak
    document.querySelectorAll('.prompter-line-card').forEach(card => {
      card.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        const idx = parseInt(card.dataset.lineIndex, 10);
        if (lines[idx]) {
          highlightPrompterLine(idx);
          AUDIO.speak(lines[idx].text);
        }
      });
    });

    // Start / Pause broadcast button
    const btnStart = document.getElementById('btn-start-broadcast');
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        AUDIO.ensureUnlocked();
        if (broadcastState.isPlaying) {
          pauseTeleprompterBroadcast();
        } else {
          startTeleprompterBroadcast();
        }
      });
    }

    // Reset button
    const btnReset = document.getElementById('btn-reset-broadcast');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        resetTeleprompterBroadcast();
      });
    }

    // Speed chips
    document.querySelectorAll('.speed-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const spd = parseInt(chip.dataset.speed, 10);
        broadcastState.speedMs = spd;
        document.querySelectorAll('.speed-chip').forEach(c => c.classList.toggle('active', c === chip));
        AUDIO.playSynapticPulse(800);
      });
    });
  }

  function startTeleprompterBroadcast() {
    broadcastState.isPlaying = true;
    const btnStart = document.getElementById('btn-start-broadcast');
    if (btnStart) {
      btnStart.innerHTML = '<span>⏸️</span> PAUSE BROADCAST';
      btnStart.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
    }

    const onAir = document.getElementById('on-air-badge');
    if (onAir) {
      onAir.classList.add('live');
      onAir.innerHTML = '<span>🔴</span> ON AIR';
    }

    AUDIO.playSuccessArpeggio();

    const lines = DATA.teleprompter.teleprompterLines;
    if (broadcastState.activeLineIdx < 0 || broadcastState.activeLineIdx >= lines.length - 1) {
      broadcastState.activeLineIdx = 0;
    }

    runBroadcastStep();
  }

  function pauseTeleprompterBroadcast() {
    broadcastState.isPlaying = false;
    clearTimeout(broadcastState.timerId);

    const btnStart = document.getElementById('btn-start-broadcast');
    if (btnStart) {
      btnStart.innerHTML = '<span>▶️</span> RESUME BROADCAST';
      btnStart.style.background = 'linear-gradient(135deg, #0284c7, #3b82f6)';
    }

    const onAir = document.getElementById('on-air-badge');
    if (onAir) {
      onAir.classList.remove('live');
      onAir.innerHTML = '<span>⏸️</span> PAUSED';
    }
  }

  function resetTeleprompterBroadcast() {
    broadcastState.isPlaying = false;
    clearTimeout(broadcastState.timerId);
    broadcastState.activeLineIdx = -1;

    document.querySelectorAll('.prompter-line-card').forEach(card => card.classList.remove('active-reading'));

    const btnStart = document.getElementById('btn-start-broadcast');
    if (btnStart) {
      btnStart.innerHTML = '<span>🎙️</span> START LIVE BROADCAST';
      btnStart.style.background = 'linear-gradient(135deg, #0284c7, #3b82f6)';
    }

    const onAir = document.getElementById('on-air-badge');
    if (onAir) {
      onAir.classList.remove('live');
      onAir.innerHTML = '<span>●</span> STANDBY';
    }

    const progFill = document.getElementById('teleprompter-progress-fill');
    if (progFill) progFill.style.width = '0%';
  }

  function highlightPrompterLine(idx) {
    document.querySelectorAll('.prompter-line-card').forEach((card, i) => {
      card.classList.toggle('active-reading', i === idx);
      if (i === idx) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    const lines = DATA.teleprompter.teleprompterLines;
    const progFill = document.getElementById('teleprompter-progress-fill');
    if (progFill && lines.length > 0) {
      const pct = Math.round(((idx + 1) / lines.length) * 100);
      progFill.style.width = pct + '%';
    }
  }

  function runBroadcastStep() {
    if (!broadcastState.isPlaying) return;

    const lines = DATA.teleprompter.teleprompterLines;
    const idx = broadcastState.activeLineIdx;

    if (idx >= lines.length) {
      finishTeleprompterBroadcast();
      return;
    }

    const line = lines[idx];
    highlightPrompterLine(idx);
    AUDIO.playNodeConnect();

    AUDIO.speak(line.text);

    broadcastState.timerId = setTimeout(() => {
      if (!broadcastState.isPlaying) return;
      broadcastState.activeLineIdx++;
      runBroadcastStep();
    }, broadcastState.speedMs);
  }

  function finishTeleprompterBroadcast() {
    broadcastState.isPlaying = false;
    clearTimeout(broadcastState.timerId);

    const onAir = document.getElementById('on-air-badge');
    if (onAir) {
      onAir.classList.remove('live');
      onAir.innerHTML = '<span>🏆</span> BROADCAST COMPLETE';
      onAir.style.background = 'rgba(16, 185, 129, 0.2)';
      onAir.style.borderColor = '#10b981';
      onAir.style.color = '#10b981';
    }

    const btnStart = document.getElementById('btn-start-broadcast');
    if (btnStart) {
      btnStart.innerHTML = '<span>🔄</span> BROADCAST AGAIN';
      btnStart.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    }

    awardBadge('teleprompter_broadcaster');
    addEnergy(25);
    AUDIO.playVictoryFanfare();
    setTimeout(showVictoryModal, 1000);
  }

  /* ==========================================================================
     VICTORY & DIPLOMA CELEBRATION MODAL
     ========================================================================== */
  function showVictoryModal() {
    AUDIO.playVictoryFanfare();

    const overlay = document.getElementById('victory-modal');
    if (!overlay) return;

    overlay.classList.add('open');

    AUDIO.speak("Congratulations! Your brain is now 100% supercharged! You are an official Junior Neuro-Explorer!");
  }

  // Global window exports
  window.BrainApp = {
    playerSession,
    switchPhase,
    addEnergy,
    showVictoryModal
  };

})();
