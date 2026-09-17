/**
 * =======================================================================
 * 🧠 THE BRAIN HACKERS: MISSION UNLOCK YOUR BRAIN
 * Interactive ESL Science Experience - A1+/A2 Young Learners
 * Built for Smart Interactive Whiteboard & Self-Paced Exploration
 * =======================================================================
 */

(function() {
  'use strict';

  // --- STATE MANAGEMENT ---
  const state = {
    currentMission: 1,
    totalMissions: 8,
    score: 0,
    xpAwarded: 0,
    selectedTeam: 'neuron',
    teams: {
      brain: { name: 'Team Brain', icon: '🧠', score: 0 },
      neuron: { name: 'Team Neuron', icon: '⚡', score: 0 },
      genius: { name: 'Team Genius', icon: '💡', score: 0 },
      explorer: { name: 'Team Explorer', icon: '🚀', score: 0 }
    },
    missionProgress: {
      1: { unlocked: true, completed: false, score: 0 },
      2: { unlocked: false, completed: false, score: 0 },
      3: { unlocked: false, completed: false, score: 0 },
      4: { unlocked: false, completed: false, score: 0 },
      5: { unlocked: false, completed: false, score: 0 },
      6: { unlocked: false, completed: false, score: 0 },
      7: { unlocked: false, completed: false, score: 0 },
      8: { unlocked: false, completed: false, score: 0 }
    },
    teacherHUDOpen: false,
    soundEnabled: true,
    speechRate: 0.9,
    studentName: 'Brain Explorer'
  };

  const DOM = {};

  document.addEventListener('DOMContentLoaded', () => {
    cacheDOM();
    bindEvents();
    renderMissionNav();
    loadMission(state.currentMission);
    if (typeof BrainAudio !== 'undefined') {
      BrainAudio.playTone(440, 'sine', 0.15);
    }
  });

  function cacheDOM() {
    DOM.missionNav = document.getElementById('missionNav');
    DOM.missionContainer = document.getElementById('missionContainer');
    DOM.missionTitle = document.getElementById('missionTitle');
    DOM.missionBadge = document.getElementById('missionBadge');
    DOM.missionDesc = document.getElementById('missionDesc');
    DOM.progressBar = document.getElementById('headerProgressBar');
    DOM.xpCount = document.getElementById('xpCount');
    DOM.teacherHud = document.getElementById('teacherHud');
    DOM.btnToggleHud = document.getElementById('btnToggleHud');
    DOM.btnPrevMission = document.getElementById('btnPrevMission');
    DOM.btnNextMission = document.getElementById('btnNextMission');
    DOM.soundToggle = document.getElementById('soundToggle');
    DOM.teamScoresBar = document.getElementById('teamScoresBar');
  }

  function bindEvents() {
    if (DOM.btnToggleHud) {
      DOM.btnToggleHud.addEventListener('click', () => toggleTeacherHUD());
    }
    if (DOM.btnPrevMission) {
      DOM.btnPrevMission.addEventListener('click', () => {
        if (state.currentMission > 1) loadMission(state.currentMission - 1);
      });
    }
    if (DOM.btnNextMission) {
      DOM.btnNextMission.addEventListener('click', () => {
        if (state.currentMission < state.totalMissions) loadMission(state.currentMission + 1);
      });
    }
    if (DOM.soundToggle) {
      DOM.soundToggle.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        DOM.soundToggle.innerHTML = state.soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'F1' || (e.ctrlKey && e.key.toLowerCase() === 'h')) {
        e.preventDefault();
        toggleTeacherHUD();
      }
    });
  }

  // --- MISSION NAVIGATION & RENDERING ---
  function renderMissionNav() {
    if (!DOM.missionNav || typeof BRAIN_DATA === 'undefined') return;
    DOM.missionNav.innerHTML = '';
    BRAIN_DATA.missions.forEach(m => {
      const btn = document.createElement('button');
      btn.className = 'mission-nav-btn' + (m.id === state.currentMission ? ' active' : '') + (state.missionProgress[m.id].completed ? ' completed' : '');
      btn.title = m.title;
      btn.innerHTML = '<span class="nav-icon">' + m.icon + '</span> <span class="nav-num">M' + m.id + '</span>';
      btn.addEventListener('click', () => {
        loadMission(m.id);
      });
      DOM.missionNav.appendChild(btn);
    });
    updateProgressUI();
  }

  function updateProgressUI() {
    const completedCount = Object.values(state.missionProgress).filter(p => p.completed).length;
    const pct = Math.round((completedCount / state.totalMissions) * 100);
    if (DOM.progressBar) DOM.progressBar.style.width = pct + '%';
    if (DOM.xpCount) DOM.xpCount.textContent = state.score + ' XP';
    renderTeamScores();
  }

  function renderTeamScores() {
    if (!DOM.teamScoresBar) return;
    DOM.teamScoresBar.innerHTML = Object.keys(state.teams).map(tKey => {
      const t = state.teams[tKey];
      return '<div class="team-score-chip ' + (state.selectedTeam === tKey ? 'selected' : '') + '" onclick="window.BrainApp.selectTeam(\'' + tKey + '\')">' +
        '<span class="team-icon">' + t.icon + '</span>' +
        '<span class="team-name">' + t.name + '</span>' +
        '<span class="team-pts">' + t.score + '</span>' +
        '<div class="team-quick-btns">' +
          '<button onclick="event.stopPropagation(); window.BrainApp.addTeamScore(\'' + tKey + '\', 5)" title="+5">+</button>' +
          '<button onclick="event.stopPropagation(); window.BrainApp.addTeamScore(\'' + tKey + '\', -5)" title="-5">-</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function loadMission(missionId) {
    state.currentMission = missionId;
    if (typeof BRAIN_DATA === 'undefined') return;
    const mission = BRAIN_DATA.missions.find(m => m.id === missionId);
    if (!mission) return;

    if (DOM.missionTitle) DOM.missionTitle.innerHTML = mission.icon + ' ' + mission.title;
    if (DOM.missionBadge) DOM.missionBadge.textContent = 'MISSION ' + mission.id + ' OF 8';
    if (DOM.missionDesc) DOM.missionDesc.textContent = mission.subtitle;

    document.querySelectorAll('.mission-nav-btn').forEach((btn, idx) => {
      btn.classList.toggle('active', (idx + 1) === missionId);
    });

    if (state.soundEnabled && typeof BrainAudio !== 'undefined') {
      BrainAudio.playChime();
      BrainAudio.speak('Mission ' + mission.id + ': ' + mission.title + '. ' + mission.subtitle);
    }

    if (!DOM.missionContainer) return;
    DOM.missionContainer.innerHTML = '';

    switch(missionId) {
      case 1: renderMission1(DOM.missionContainer); break;
      case 2: renderMission2(DOM.missionContainer); break;
      case 3: renderMission3(DOM.missionContainer); break;
      case 4: renderMission4(DOM.missionContainer); break;
      case 5: renderMission5(DOM.missionContainer); break;
      case 6: renderMission6(DOM.missionContainer); break;
      case 7: renderMission7(DOM.missionContainer); break;
      case 8: renderMission8(DOM.missionContainer); break;
      default: DOM.missionContainer.innerHTML = '<p>Unknown mission</p>';
    }
  }

  function completeMission(missionId, xpEarned) {
    xpEarned = xpEarned || 25;
    if (!state.missionProgress[missionId].completed) {
      state.missionProgress[missionId].completed = true;
      state.score += xpEarned;
      state.teams[state.selectedTeam].score += xpEarned;
      if (typeof BrainAudio !== 'undefined') BrainAudio.playSuccess();
      showToast('🎉 Mission ' + missionId + ' Complete! +' + xpEarned + ' XP awarded to ' + state.teams[state.selectedTeam].name + '!');
    }
    if (missionId < state.totalMissions) {
      state.missionProgress[missionId + 1].unlocked = true;
    }
    renderMissionNav();
    updateProgressUI();
  }

  // =======================================================================
  // MISSION 1: DETECT THE BRAIN (Lobes & Senses)
  // =======================================================================
  function renderMission1(container) {
    const data = BRAIN_DATA.mission1_detect;

    container.innerHTML = 
      '<div class="m1-grid">' +
        '<div class="m1-left glass-card">' +
          '<div class="scanner-header">' +
            '<h3>🔬 BRAIN PET SCANNER</h3>' +
            '<span class="badge live-badge">ONLINE</span>' +
          '</div>' +
          '<div class="brain-visualizer-box">' +
            '<svg id="brainSvg" viewBox="0 0 500 400" class="interactive-brain-svg">' +
              '<defs>' +
                '<radialGradient id="glowRed" cx="50%" cy="50%" r="50%">' +
                  '<stop offset="0%" stop-color="#ff3366" stop-opacity="0.9" />' +
                  '<stop offset="100%" stop-color="#ff3366" stop-opacity="0" />' +
                '</radialGradient>' +
                '<radialGradient id="glowYellow" cx="50%" cy="50%" r="50%">' +
                  '<stop offset="0%" stop-color="#ffbb00" stop-opacity="0.9" />' +
                  '<stop offset="100%" stop-color="#ffbb00" stop-opacity="0" />' +
                '</radialGradient>' +
                '<radialGradient id="glowGreen" cx="50%" cy="50%" r="50%">' +
                  '<stop offset="0%" stop-color="#00ffaa" stop-opacity="0.9" />' +
                  '<stop offset="100%" stop-color="#00ffaa" stop-opacity="0" />' +
                '</radialGradient>' +
                '<radialGradient id="glowBlue" cx="50%" cy="50%" r="50%">' +
                  '<stop offset="0%" stop-color="#00ccff" stop-opacity="0.9" />' +
                  '<stop offset="100%" stop-color="#00ccff" stop-opacity="0" />' +
                '</radialGradient>' +
                '<filter id="neonFilter" x="-20%" y="-20%" width="140%" height="140%">' +
                  '<feGaussianBlur stdDeviation="6" result="blur" />' +
                  '<feMerge>' +
                    '<feMergeNode in="blur"/>' +
                    '<feMergeNode in="SourceGraphic"/>' +
                  '</feMerge>' +
                '</filter>' +
              '</defs>' +
              '<!-- Base Brain Silhouette -->' +
              '<path class="brain-base" d="M 120 220 C 100 160, 140 70, 250 60 C 350 50, 420 110, 430 180 C 440 240, 390 320, 320 330 C 260 340, 240 310, 200 320 C 150 330, 110 270, 120 220 Z" />' +
              '<!-- Frontal Lobe (Thinking / Planning / Speaking) -->' +
              '<path id="lobe-frontal" class="lobe-region lobe-frontal" d="M 120 220 C 100 160, 140 70, 240 65 C 260 120, 250 180, 230 230 C 180 230, 140 240, 120 220 Z" />' +
              '<text x="160" y="150" class="lobe-label">FRONTAL</text>' +
              '<!-- Parietal Lobe (Movement / Touch) -->' +
              '<path id="lobe-parietal" class="lobe-region lobe-parietal" d="M 240 65 C 320 60, 370 100, 370 160 C 310 160, 270 150, 230 230 C 250 180, 260 120, 240 65 Z" />' +
              '<text x="290" y="110" class="lobe-label">PARIETAL</text>' +
              '<!-- Occipital Lobe (Vision / Seeing) -->' +
              '<path id="lobe-occipital" class="lobe-region lobe-occipital" d="M 370 160 C 420 170, 430 230, 410 280 C 370 270, 350 220, 340 190 C 350 170, 360 165, 370 160 Z" />' +
              '<text x="375" y="225" class="lobe-label">OCCIPITAL</text>' +
              '<!-- Temporal Lobe (Hearing / Memory / Sounds) -->' +
              '<path id="lobe-temporal" class="lobe-region lobe-temporal" d="M 220 235 C 270 200, 340 200, 340 270 C 320 320, 250 310, 210 290 Z" />' +
              '<text x="260" y="270" class="lobe-label">TEMPORAL</text>' +
              '<!-- Cerebellum -->' +
              '<path id="lobe-stem" class="lobe-region lobe-stem" d="M 320 300 C 370 300, 380 340, 340 360 C 300 370, 270 350, 280 320 Z" />' +
              '<text x="310" y="345" class="lobe-label small">CEREBELLUM</text>' +
            '</svg>' +
          '</div>' +
          '<div class="scan-status-banner" id="scanBanner">' +
            '<span class="pulse-dot"></span> <span id="scanStatusText">Select a science clue on the right to scan the brain.</span>' +
          '</div>' +
        '</div>' +

        '<div class="m1-right glass-card">' +
          '<div class="m1-clues-header">' +
            '<h3>🧪 LAB SCENARIOS: WHICH LOBE LIGHTS UP?</h3>' +
            '<p class="subtext">Read the clue. Touch the matching sense and brain lobe!</p>' +
          '</div>' +

          '<div class="scenario-cards-list" id="scenariosList">' +
            data.scenarios.map((sc, i) => 
              '<div class="scenario-card ' + (i === 0 ? 'active' : '') + '" id="scCard_' + i + '" onclick="window.BrainApp.selectM1Scenario(' + i + ')">' +
                '<div class="sc-icon">' + sc.icon + '</div>' +
                '<div class="sc-content">' +
                  '<div class="sc-num">CLUE #' + (i + 1) + '</div>' +
                  '<div class="sc-text">"' + sc.clue + '"</div>' +
                  '<div class="sc-feedback" id="scFeedback_' + i + '"></div>' +
                '</div>' +
              '</div>'
            ).join('') +
          '</div>' +

          '<div class="action-buttons-grid" id="actionBtnsGrid">' +
            data.actions.map(act => 
              '<button class="sense-action-btn" onclick="window.BrainApp.verifyM1Action(\'' + act.id + '\')">' +
                '<span class="act-icon">' + act.icon + '</span>' +
                '<span class="act-name">' + act.name + '</span>' +
                '<span class="act-lobe">(' + act.lobeName + ')</span>' +
              '</button>'
            ).join('') +
          '</div>' +

          '<div class="m1-footer-bar">' +
            '<div class="detected-counter" id="detectedCounter">Lobes Activated: 0 / 4</div>' +
            '<button class="btn-primary" id="btnM1Next" disabled onclick="window.BrainApp.nextMission()">Next Mission: Neurons ➔</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    window.BrainApp.m1Data = {
      activeIndex: 0,
      unlockedLobes: new Set(),
      scenarios: data.scenarios,
      actions: data.actions
    };
  }

  window.BrainApp = window.BrainApp || {};

  window.BrainApp.selectM1Scenario = function(idx) {
    const d = window.BrainApp.m1Data;
    d.activeIndex = idx;
    document.querySelectorAll('.scenario-card').forEach((c, i) => {
      c.classList.toggle('active', i === idx);
    });
    const sc = d.scenarios[idx];
    if (typeof BrainAudio !== 'undefined') {
      BrainAudio.playTone(520, 'sine', 0.1);
      BrainAudio.speak(sc.clue);
    }
    const statusText = document.getElementById('scanStatusText');
    if (statusText) statusText.textContent = 'Investigating Clue #' + (idx + 1) + ': "' + sc.clue + '"';
  };

  window.BrainApp.verifyM1Action = function(actionId) {
    const d = window.BrainApp.m1Data;
    const sc = d.scenarios[d.activeIndex];
    const fb = document.getElementById('scFeedback_' + d.activeIndex);
    const card = document.getElementById('scCard_' + d.activeIndex);

    if (actionId === sc.targetAction) {
      if (typeof BrainAudio !== 'undefined') {
        BrainAudio.playSuccess();
        BrainAudio.speak('Correct! ' + sc.explanation);
      }
      if (card) card.classList.add('correct');
      if (fb) fb.innerHTML = '<span class="success-tag">✓ ' + sc.explanation + '</span>';

      const lobeElem = document.getElementById('lobe-' + sc.targetLobe);
      if (lobeElem) {
        lobeElem.classList.add('glowing', sc.colorClass);
      }

      d.unlockedLobes.add(d.activeIndex);
      const countElem = document.getElementById('detectedCounter');
      if (countElem) countElem.textContent = 'Lobes Activated: ' + d.unlockedLobes.size + ' / 4';

      if (d.unlockedLobes.size >= 4) {
        completeMission(1, 30);
        const nextBtn = document.getElementById('btnM1Next');
        if (nextBtn) nextBtn.disabled = false;
        const statusText = document.getElementById('scanStatusText');
        if (statusText) statusText.textContent = '🎉 ALL 4 LOBES ILLUMINATED! Brain activity scan 100% complete!';
      } else {
        setTimeout(() => {
          for (let i = 0; i < d.scenarios.length; i++) {
            if (!d.unlockedLobes.has(i)) {
              window.BrainApp.selectM1Scenario(i);
              break;
            }
          }
        }, 1200);
      }
    } else {
      if (typeof BrainAudio !== 'undefined') BrainAudio.playError();
      if (fb) fb.innerHTML = '<span class="error-tag">Try again! Think about which sense is used.</span>';
    }
  };

  // =======================================================================
  // MISSION 2: CONNECT THE NEURONS (Neuron Network Assembly)
  // =======================================================================
  function renderMission2(container) {
    const data = BRAIN_DATA.mission2_neurons;

    container.innerHTML = 
      '<div class="m2-grid">' +
        '<div class="m2-left glass-card">' +
          '<div class="m2-header">' +
            '<h3>🔬 HIGH-POWER MICROSCOPE: NEURON SCAN</h3>' +
            '<span class="badge">ZOOM: 10,000X</span>' +
          '</div>' +

          '<div class="neuron-stage-box" id="neuronStageBox">' +
            '<svg id="neuronSvg" viewBox="0 0 700 450" class="neuron-svg">' +
              '<defs>' +
                '<filter id="neuronGlow">' +
                  '<feGaussianBlur stdDeviation="4" result="coloredBlur"/>' +
                  '<feMerge>' +
                    '<feMergeNode in="coloredBlur"/>' +
                    '<feMergeNode in="SourceGraphic"/>' +
                  '</feMerge>' +
                '</filter>' +
              '</defs>' +

              '<!-- Dendrite branches (left) -->' +
              '<g id="svg-dendrites" class="neuron-part-path">' +
                '<path d="M 210 180 C 150 140, 110 110, 60 90 M 110 110 C 80 70, 50 40, 30 20" stroke="#00ccff" stroke-width="6" fill="none" stroke-linecap="round"/>' +
                '<path d="M 200 230 C 130 230, 80 260, 40 290 M 90 245 C 60 270, 30 310, 20 350" stroke="#00ccff" stroke-width="6" fill="none" stroke-linecap="round"/>' +
                '<path d="M 220 270 C 160 300, 120 350, 90 410" stroke="#00ccff" stroke-width="6" fill="none" stroke-linecap="round"/>' +
              '</g>' +

              '<!-- Cell Body / Soma (center-left) -->' +
              '<g id="svg-cellbody" class="neuron-part-path">' +
                '<path d="M 220 180 C 270 140, 310 190, 320 220 C 330 260, 290 300, 240 290 C 190 280, 180 220, 220 180 Z" fill="#0d2b45" stroke="#00ffff" stroke-width="5" filter="url(#neuronGlow)"/>' +
                '<circle cx="260" cy="235" r="32" fill="#ff0077" opacity="0.8" />' +
                '<circle cx="260" cy="235" r="16" fill="#ffff00" />' +
                '<text x="260" y="240" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">NUCLEUS</text>' +
              '</g>' +

              '<!-- Axon Cable (center-right) -->' +
              '<g id="svg-axon" class="neuron-part-path">' +
                '<path id="axonLine" d="M 320 235 C 380 235, 450 230, 520 235" stroke="#3388ff" stroke-width="12" fill="none" stroke-linecap="round"/>' +
                '<rect x="340" y="221" width="45" height="28" rx="8" fill="#1e4d7a" stroke="#00ffff" stroke-width="2"/>' +
                '<rect x="400" y="221" width="45" height="28" rx="8" fill="#1e4d7a" stroke="#00ffff" stroke-width="2"/>' +
                '<rect x="460" y="221" width="45" height="28" rx="8" fill="#1e4d7a" stroke="#00ffff" stroke-width="2"/>' +
                '<circle id="pulseSpark" cx="320" cy="235" r="9" fill="#ffff00" opacity="0"/>' +
              '</g>' +

              '<!-- Synapse / Terminal Branches (far right) -->' +
              '<g id="svg-synapse" class="neuron-part-path">' +
                '<path d="M 520 235 C 570 210, 610 160, 650 140 M 580 205 C 620 200, 655 190, 680 185" stroke="#00e5ff" stroke-width="5" fill="none" stroke-linecap="round"/>' +
                '<path d="M 520 235 C 570 260, 620 300, 660 330 M 580 265 C 620 280, 655 310, 680 340" stroke="#00e5ff" stroke-width="5" fill="none" stroke-linecap="round"/>' +
                '<circle cx="650" cy="140" r="6" fill="#ff00aa"/>' +
                '<circle cx="680" cy="185" r="6" fill="#ff00aa"/>' +
                '<circle cx="660" cy="330" r="6" fill="#ff00aa"/>' +
                '<circle cx="680" cy="340" r="6" fill="#ff00aa"/>' +
              '</g>' +

              '<!-- Drop Target Anchors -->' +
              '<g id="dropTargets">' +
                '<circle cx="260" cy="150" r="22" class="target-node" id="target-cellbody" onclick="window.BrainApp.handleTargetClick(\'cellbody\')"/>' +
                '<text x="260" y="155" text-anchor="middle" class="target-node-text">1</text>' +

                '<circle cx="90" cy="190" r="22" class="target-node" id="target-dendrites" onclick="window.BrainApp.handleTargetClick(\'dendrites\')"/>' +
                '<text x="90" y="195" text-anchor="middle" class="target-node-text">2</text>' +

                '<circle cx="430" cy="180" r="22" class="target-node" id="target-axon" onclick="window.BrainApp.handleTargetClick(\'axon\')"/>' +
                '<text x="430" y="185" text-anchor="middle" class="target-node-text">3</text>' +

                '<circle cx="640" cy="250" r="22" class="target-node" id="target-synapse" onclick="window.BrainApp.handleTargetClick(\'synapse\')"/>' +
                '<text x="640" y="255" text-anchor="middle" class="target-node-text">4</text>' +
              '</g>' +
            '</svg>' +
          '</div>' +

          '<div class="m2-impulse-control">' +
            '<button class="btn-secondary" id="btnFireSignal" onclick="window.BrainApp.fireNeuronSignal()">⚡ Test Electrical Signal</button>' +
            '<span class="signal-readout" id="signalReadout">Neuron status: Assemble all 4 parts to power up!</span>' +
          '</div>' +
        '</div>' +

        '<div class="m2-right glass-card">' +
          '<div class="assembly-instructions">' +
            '<h3>🧩 ASSEMBLE THE NEURON</h3>' +
            '<p class="subtext">Select a part card, then touch the correct numbered circle on the neuron.</p>' +
          '</div>' +

          '<div class="parts-palette" id="partsPalette">' +
            data.parts.map(p => 
              '<div class="neuron-part-card" id="partCard_' + p.id + '" onclick="window.BrainApp.selectNeuronPart(\'' + p.id + '\')">' +
                '<div class="part-header">' +
                  '<span class="part-badge">' + p.name + '</span>' +
                  '<span class="part-status" id="status_' + p.id + '">⚪ Unassigned</span>' +
                '</div>' +
                '<div class="part-desc">' + p.definition + '</div>' +
                '<div class="part-analogy">💡 <em>' + p.analogy + '</em></div>' +
              '</div>'
            ).join('') +
          '</div>' +

          '<div class="scaffold-sentence-box">' +
            '<h4>📖 Science Discovery:</h4>' +
            '<p id="neuronScienceFact">' +
              '"Your brain has over <strong>86 billion</strong> neurons! Neurons are special cells that send and receive <strong>electrical messages</strong>."' +
            '</p>' +
          '</div>' +

          '<div class="m2-footer-bar">' +
            '<div class="m2-progress" id="m2ProgressText">Parts Placed: 0 / 4</div>' +
            '<button class="btn-primary" id="btnM2Next" disabled onclick="window.BrainApp.nextMission()">Next Mission: Message Relay ➔</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    window.BrainApp.m2Data = {
      selectedPartId: null,
      placedParts: {},
      parts: data.parts
    };
  }

  window.BrainApp.selectNeuronPart = function(partId) {
    window.BrainApp.m2Data.selectedPartId = partId;
    document.querySelectorAll('.neuron-part-card').forEach(card => {
      card.classList.toggle('active-selection', card.id === 'partCard_' + partId);
    });
    if (typeof BrainAudio !== 'undefined') {
      BrainAudio.playTone(600, 'triangle', 0.1);
      const p = window.BrainApp.m2Data.parts.find(x => x.id === partId);
      if (p) BrainAudio.speak(p.name + '. ' + p.definition);
    }
  };

  window.BrainApp.handleTargetClick = function(targetId) {
    const d = window.BrainApp.m2Data;
    if (!d.selectedPartId) {
      if (typeof BrainAudio !== 'undefined') BrainAudio.playError();
      showToast('👉 Touch a part card on the right first!');
      return;
    }

    if (d.selectedPartId === targetId) {
      if (typeof BrainAudio !== 'undefined') BrainAudio.playNeuralZap();
      d.placedParts[targetId] = true;

      const card = document.getElementById('partCard_' + targetId);
      if (card) {
        card.classList.remove('active-selection');
        card.classList.add('placed');
        const st = document.getElementById('status_' + targetId);
        if (st) st.innerHTML = '🟢 CONNECTED';
      }

      const targetCircle = document.getElementById('target-' + targetId);
      if (targetCircle) targetCircle.classList.add('completed');

      d.selectedPartId = null;
      const count = Object.keys(d.placedParts).length;
      const prog = document.getElementById('m2ProgressText');
      if (prog) prog.textContent = 'Parts Placed: ' + count + ' / 4';

      if (count >= 4) {
        completeMission(2, 35);
        const nextBtn = document.getElementById('btnM2Next');
        if (nextBtn) nextBtn.disabled = false;
        const readout = document.getElementById('signalReadout');
        if (readout) readout.innerHTML = '✅ NEURON FULLY WIRED! Tap "Test Electrical Signal"!';
        window.BrainApp.fireNeuronSignal();
      }
    } else {
      if (typeof BrainAudio !== 'undefined') BrainAudio.playError();
      showToast('❌ Not quite! Think about what that part does.');
    }
  };

  window.BrainApp.fireNeuronSignal = function() {
    if (typeof BrainAudio !== 'undefined') BrainAudio.playNeuralZap();
    const spark = document.getElementById('pulseSpark');
    if (!spark) return;

    spark.style.opacity = '1';
    let pos = 320;
    const interval = setInterval(() => {
      pos += 12;
      spark.setAttribute('cx', pos);
      if (pos >= 520) {
        clearInterval(interval);
        spark.style.opacity = '0';
        if (typeof BrainAudio !== 'undefined') BrainAudio.playTone(880, 'sine', 0.15);
        const readout = document.getElementById('signalReadout');
        if (readout) readout.textContent = '⚡ Signal transmitted at 250 mph across the synapse!';
      }
    }, 20);
  };

  // =======================================================================
  // MISSION 3: SEND THE MESSAGE (Human Neuron Chain Relay)
  // =======================================================================
  function renderMission3(container) {
    const data = BRAIN_DATA.mission3_chain;

    container.innerHTML = 
      '<div class="m3-grid">' +
        '<div class="m3-main glass-card">' +
          '<div class="m3-header">' +
            '<h3>⚡ HUMAN NEURON RELAY RACE</h3>' +
            '<span class="badge" id="m3LevelBadge">CHAIN 1 OF 3</span>' +
          '</div>' +

          '<div class="relay-track-container">' +
            '<div class="relay-nodes-row" id="relayNodesRow"></div>' +
            '<div class="electrical-cable-line">' +
              '<div class="cable-pulse" id="cablePulse"></div>' +
            '</div>' +
          '</div>' +

          '<div class="target-message-banner">' +
            '<div class="target-label">DESIRED NEURAL MESSAGE:</div>' +
            '<div class="target-sentence" id="targetSentenceText">"DOG RUN FAST"</div>' +
          '</div>' +

          '<div class="signal-packets-rack">' +
            '<div class="rack-title">📦 TAP WORDS IN EXACT NEURAL SEQUENCE:</div>' +
            '<div class="packets-row" id="packetsRow"></div>' +
          '</div>' +

          '<div class="active-chain-display">' +
            '<div class="assembled-label">TRANSMITTING SIGNAL:</div>' +
            '<div class="assembled-slots" id="assembledSlots"></div>' +
          '</div>' +

          '<div class="m3-controls-bar">' +
            '<button class="btn-secondary" onclick="window.BrainApp.resetCurrentChain()">🔄 Reset Signal</button>' +
            '<button class="btn-primary" id="btnM3Next" disabled onclick="window.BrainApp.nextMission()">Next Mission: Imagination ➔</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    window.BrainApp.m3Data = {
      chainIndex: 0,
      chains: data.chains,
      userSequence: []
    };

    window.BrainApp.loadM3Chain(0);
  }

  window.BrainApp.loadM3Chain = function(index) {
    const d = window.BrainApp.m3Data;
    d.chainIndex = index;
    d.userSequence = [];
    const chain = d.chains[index];

    const badge = document.getElementById('m3LevelBadge');
    if (badge) badge.textContent = 'CHAIN ' + (index + 1) + ' OF ' + d.chains.length;
    const tgt = document.getElementById('targetSentenceText');
    if (tgt) tgt.textContent = '"' + chain.targetSentence + '"';

    const nodesRow = document.getElementById('relayNodesRow');
    if (nodesRow) {
      nodesRow.innerHTML = chain.nodes.map((node, i) => 
        '<div class="relay-node" id="relayNode_' + i + '">' +
          '<div class="node-avatar">' + node.icon + '</div>' +
          '<div class="node-role">' + node.role + '</div>' +
          '<div class="node-word" id="nodeWord_' + i + '">---</div>' +
        '</div>'
      ).join('');
    }

    const packetsRow = document.getElementById('packetsRow');
    if (packetsRow) {
      const shuffled = [...chain.tokens].sort(() => Math.random() - 0.5);
      packetsRow.innerHTML = shuffled.map((tok, i) => 
        '<button class="packet-btn" id="pkgBtn_' + i + '" onclick="window.BrainApp.transmitPacket(\'' + tok + '\', this)">' +
          '<span class="pulse-spark">⚡</span> ' + tok +
        '</button>'
      ).join('');
    }

    const slots = document.getElementById('assembledSlots');
    if (slots) {
      slots.innerHTML = chain.tokens.map((_, i) => 
        '<div class="assembled-slot" id="slot_' + i + '">?</div>'
      ).join('');
    }

    if (typeof BrainAudio !== 'undefined') {
      BrainAudio.speak('Send the message: ' + chain.targetSentence);
    }
  };

  window.BrainApp.transmitPacket = function(word, btnElem) {
    const d = window.BrainApp.m3Data;
    const chain = d.chains[d.chainIndex];
    const expectedWord = chain.tokens[d.userSequence.length];

    if (word === expectedWord) {
      btnElem.disabled = true;
      btnElem.classList.add('sent');
      const stepIdx = d.userSequence.length;
      d.userSequence.push(word);

      const nodeWord = document.getElementById('nodeWord_' + stepIdx);
      const nodeElem = document.getElementById('relayNode_' + stepIdx);
      if (nodeWord) nodeWord.textContent = word;
      if (nodeElem) nodeElem.classList.add('energized');

      const slotElem = document.getElementById('slot_' + stepIdx);
      if (slotElem) {
        slotElem.textContent = word;
        slotElem.classList.add('filled');
      }

      if (typeof BrainAudio !== 'undefined') {
        BrainAudio.playNeuralZap();
        BrainAudio.speak(word);
      }

      if (d.userSequence.length === chain.tokens.length) {
        if (typeof BrainAudio !== 'undefined') BrainAudio.playSuccess();
        showToast('⚡ Message Delivered at High Speed! (' + chain.speed + ')');

        setTimeout(() => {
          if (d.chainIndex < d.chains.length - 1) {
            window.BrainApp.loadM3Chain(d.chainIndex + 1);
          } else {
            completeMission(3, 35);
            const nextBtn = document.getElementById('btnM3Next');
            if (nextBtn) nextBtn.disabled = false;
            showToast('🏆 All 3 Neural Chains Mastered!');
          }
        }, 1500);
      }
    } else {
      if (typeof BrainAudio !== 'undefined') BrainAudio.playError();
      showToast('❌ Sequence mismatch! Expected: "' + expectedWord + '"');
    }
  };

  window.BrainApp.resetCurrentChain = function() {
    window.BrainApp.loadM3Chain(window.BrainApp.m3Data.chainIndex);
  };

  // =======================================================================
  // MISSION 4: VISUALIZE THE INVISIBLE (Imagination & Visual Recall)
  // =======================================================================
  function renderMission4(container) {
    container.innerHTML = 
      '<div class="m4-grid">' +
        '<div class="m4-left glass-card">' +
          '<div class="m4-header">' +
            '<h3>👁️ STEP 1: CLOSE YOUR EYES & LISTEN</h3>' +
            '<span class="badge">MENTAL PROJECTION</span>' +
          '</div>' +

          '<div class="narration-player-box">' +
            '<div class="audio-wave-visualizer" id="audioWave">' +
              '<span class="wave-bar"></span><span class="wave-bar"></span><span class="wave-bar"></span><span class="wave-bar"></span><span class="wave-bar"></span>' +
            '</div>' +
            '<p class="narration-script" id="narrationScript">' +
              '"Imagine a <strong>blue house</strong> with a silver triangular roof. It has <strong>two round yellow windows</strong>, and a golden lightning rod on the chimney!"' +
            '</p>' +
            '<button class="btn-primary" onclick="window.BrainApp.playM4Story()">' +
              '🔊 Listen to Story & Visualize' +
            '</button>' +
          '</div>' +

          '<div class="visualize-concept-callout">' +
            '<h4>🧠 What is "Visualizing"?</h4>' +
            '<p>From textbook Unit 1: <em>"To visualize means making a picture in your mind of something you cannot see with your eyes."</em></p>' +
          '</div>' +
        '</div>' +

        '<div class="m4-right glass-card">' +
          '<div class="m4-header">' +
            '<h3>🔍 STEP 2: SPOT THE 4 DIFFERENCES</h3>' +
            '<span class="badge" id="m4DiffBadge">FOUND: 0 / 4</span>' +
          '</div>' +

          '<p class="subtext">Look at this picture. Click the 4 things that do NOT match the story!</p>' +

          '<div class="house-scene-container" id="houseScene">' +
            '<svg viewBox="0 0 500 350" class="house-svg">' +
              '<!-- Sky / Background -->' +
              '<rect width="500" height="350" fill="#081426" />' +
              '<circle cx="430" cy="70" r="40" fill="#ffea75" opacity="0.8" />' +

              '<!-- Ground -->' +
              '<rect y="280" width="500" height="70" fill="#1b4d3e" />' +

              '<!-- House Body (Blue) -->' +
              '<rect x="150" y="140" width="200" height="140" fill="#1e3a8a" stroke="#60a5fa" stroke-width="4"/>' +

              '<!-- Difference 1: RED roof instead of Silver! -->' +
              '<polygon id="diff-roof" class="spot-target" points="130,140 250,50 370,140" fill="#dc2626" onclick="window.BrainApp.spotDifference(\'roof\')"/>' +

              '<!-- Chimney -->' +
              '<rect x="300" y="70" width="35" height="50" fill="#78350f" />' +

              '<!-- Difference 2: Alien antenna instead of Golden Rod! -->' +
              '<circle id="diff-antenna" class="spot-target" cx="317" cy="55" r="14" fill="#a855f7" onclick="window.BrainApp.spotDifference(\'antenna\')"/>' +

              '<!-- Difference 3: Square Window instead of Round! -->' +
              '<rect id="diff-window1" class="spot-target" x="175" y="170" width="45" height="45" fill="#facc15" stroke="#ffffff" stroke-width="3" onclick="window.BrainApp.spotDifference(\'window1\')"/>' +

              '<!-- Window 2 (Round Window) -->' +
              '<circle cx="280" cy="190" r="22" fill="#facc15" stroke="#ffffff" stroke-width="3"/>' +

              '<!-- Difference 4: Door skull symbol -->' +
              '<rect x="225" y="220" width="50" height="60" fill="#475569" />' +
              '<circle id="diff-door" class="spot-target" cx="250" cy="245" r="12" fill="#ef4444" onclick="window.BrainApp.spotDifference(\'door\')"/>' +
            '</svg>' +
          '</div>' +

          '<div class="spot-feedback-list" id="spotFeedbackList">' +
            '<div class="spot-item" id="spotItem_roof">❌ Roof Color: Red (Story: Silver!)</div>' +
            '<div class="spot-item" id="spotItem_antenna">❌ Chimney: Alien Antenna (Story: Golden Lightning Rod!)</div>' +
            '<div class="spot-item" id="spotItem_window1">❌ Left Window: Square (Story: Round!)</div>' +
            '<div class="spot-item" id="spotItem_door">❌ Door Symbol: Red Alarm (Story: Normal Lab!)</div>' +
          '</div>' +

          '<div class="m4-footer-bar">' +
            '<button class="btn-primary" id="btnM4Next" disabled onclick="window.BrainApp.nextMission()">Next Mission: Creativity ➔</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    window.BrainApp.m4Data = {
      foundDifferences: new Set(),
      items: {
        roof: 'Roof is Red instead of Silver!',
        antenna: 'Chimney has an Antenna instead of Golden Rod!',
        window1: 'Left Window is Square instead of Round!',
        door: 'Door has a Red Warning Sign!'
      }
    };
  }

  window.BrainApp.playM4Story = function() {
    if (typeof BrainAudio !== 'undefined') {
      BrainAudio.playChime();
      BrainAudio.speak('Close your eyes and visualize. Imagine a blue house with a silver triangular roof. It has two round yellow windows, and a golden lightning rod on top.');
    }
  };

  window.BrainApp.spotDifference = function(id) {
    const d = window.BrainApp.m4Data;
    if (d.foundDifferences.has(id)) return;

    d.foundDifferences.add(id);
    if (typeof BrainAudio !== 'undefined') {
      BrainAudio.playSuccess();
      BrainAudio.speak(d.items[id]);
    }

    const target = document.getElementById('diff-' + id);
    if (target) target.classList.add('spotted');

    const itemElem = document.getElementById('spotItem_' + id);
    if (itemElem) {
      itemElem.classList.add('found');
      itemElem.innerHTML = '✅ ' + d.items[id];
    }

    const count = d.foundDifferences.size;
    const badge = document.getElementById('m4DiffBadge');
    if (badge) badge.textContent = 'FOUND: ' + count + ' / 4';

    if (count >= 4) {
      completeMission(4, 35);
      const nextBtn = document.getElementById('btnM4Next');
      if (nextBtn) nextBtn.disabled = false;
      showToast('🎉 Excellent visualization! You spotted all 4 differences!');
    }
  };

  // =======================================================================
  // MISSION 5: UNLOCK CREATIVITY (The Invisible Picture)
  // =======================================================================
  function renderMission5(container) {
    container.innerHTML = 
      '<div class="m5-grid">' +
        '<div class="m5-canvas-col glass-card">' +
          '<div class="m5-header">' +
            '<h3>🎨 THE INVISIBLE PICTURE CANVAS</h3>' +
            '<span class="badge">FREE CREATION</span>' +
          '</div>' +

          '<div class="canvas-prompt-banner">' +
            '<span class="prompt-icon">💡</span>' +
            '<span class="prompt-text" id="canvasPrompt">Prompt: "Draw a creature powered by pure brain electricity!"</span>' +
            '<button class="btn-secondary small" onclick="window.BrainApp.cycleCreativePrompt()">Change Prompt</button>' +
          '</div>' +

          '<div class="canvas-wrapper">' +
            '<canvas id="creativeCanvas" width="550" height="340"></canvas>' +
          '</div>' +

          '<div class="canvas-toolbar">' +
            '<div class="color-picker-group">' +
              '<button class="color-btn active" style="background: #00ffff;" onclick="window.BrainApp.setCanvasColor(\'#00ffff\')"></button>' +
              '<button class="color-btn" style="background: #ff007f;" onclick="window.BrainApp.setCanvasColor(\'#ff007f\')"></button>' +
              '<button class="color-btn" style="background: #ffff00;" onclick="window.BrainApp.setCanvasColor(\'#ffff00\')"></button>' +
              '<button class="color-btn" style="background: #00ff88;" onclick="window.BrainApp.setCanvasColor(\'#00ff88\')"></button>' +
              '<button class="color-btn" style="background: #ffffff;" onclick="window.BrainApp.setCanvasColor(\'#ffffff\')"></button>' +
            '</div>' +
            '<div class="brush-size-group">' +
              '<button class="btn-tool" onclick="window.BrainApp.setBrushSize(4)">Thin</button>' +
              '<button class="btn-tool active" onclick="window.BrainApp.setBrushSize(8)">Medium</button>' +
              '<button class="btn-tool" onclick="window.BrainApp.setBrushSize(16)">Thick</button>' +
            '</div>' +
            '<button class="btn-tool" onclick="window.BrainApp.clearCanvas()">🗑️ Clear</button>' +
            '<button class="btn-primary" onclick="window.BrainApp.compareBrains()">🌟 Compare Brains!</button>' +
          '</div>' +
        '</div>' +

        '<div class="m5-gallery-col glass-card">' +
          '<div class="m5-header">' +
            '<h3>🧠 DIFFERENT BRAINS, DIFFERENT IDEAS!</h3>' +
            '<span class="badge">CREATIVITY MATRIX</span>' +
          '</div>' +

          '<div class="gallery-explanation">' +
            '<p>From textbook Unit 1: <em>"When two people listen to the exact same words, their brains imagine completely different pictures!"</em></p>' +
          '</div>' +

          '<div class="gallery-cards-row" id="galleryCardsRow">' +
            '<div class="gallery-card">' +
              '<div class="gal-img-placeholder">🤖⚡</div>' +
              '<div class="gal-title">Scientist Maya (Age 9)</div>' +
              '<div class="gal-caption">"A robot that eats battery smoothies and thinks in lightning code."</div>' +
            '</div>' +
            '<div class="gallery-card">' +
              '<div class="gal-img-placeholder">🐙💡</div>' +
              '<div class="gal-title">Scientist Leo (Age 10)</div>' +
              '<div class="gal-caption">"An electric octopus whose tentacles invent super computers."</div>' +
            '</div>' +
          '</div>' +

          '<div class="creativity-takeaway-box" id="creativityTakeaway" style="display:none;">' +
            '<h4>✨ Big Brain Discovery:</h4>' +
            '<p>"There is NO wrong answer in imagination! Creativity is what makes each human brain unique!"</p>' +
          '</div>' +

          '<div class="m5-footer-bar">' +
            '<button class="btn-primary" id="btnM5Next" disabled onclick="window.BrainApp.nextMission()">Next Mission: Subject Portals ➔</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    setTimeout(initCreativeCanvas, 50);
  }

  let canvasCtx = null;
  let isDrawing = false;
  let brushColor = '#00ffff';
  let brushSize = 8;

  function initCreativeCanvas() {
    const cvs = document.getElementById('creativeCanvas');
    if (!cvs || !cvs.getContext) return;
    canvasCtx = cvs.getContext('2d');
    canvasCtx.fillStyle = '#061325';
    canvasCtx.fillRect(0, 0, cvs.width, cvs.height);

    function getCoords(e) {
      const rect = cvs.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * (cvs.width / rect.width),
        y: (clientY - rect.top) * (cvs.height / rect.height)
      };
    }

    function start(e) {
      e.preventDefault();
      isDrawing = true;
      const pos = getCoords(e);
      canvasCtx.beginPath();
      canvasCtx.moveTo(pos.x, pos.y);
    }

    function move(e) {
      if (!isDrawing) return;
      e.preventDefault();
      const pos = getCoords(e);
      canvasCtx.lineTo(pos.x, pos.y);
      canvasCtx.strokeStyle = brushColor;
      canvasCtx.lineWidth = brushSize;
      canvasCtx.lineCap = 'round';
      canvasCtx.lineJoin = 'round';
      canvasCtx.shadowColor = brushColor;
      canvasCtx.shadowBlur = 8;
      canvasCtx.stroke();
    }

    function end() {
      isDrawing = false;
    }

    cvs.addEventListener('mousedown', start);
    cvs.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);

    cvs.addEventListener('touchstart', start, { passive: false });
    cvs.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);
  }

  window.BrainApp.setCanvasColor = function(color) {
    brushColor = color;
  };
  window.BrainApp.setBrushSize = function(size) {
    brushSize = size;
  };
  window.BrainApp.clearCanvas = function() {
    const cvs = document.getElementById('creativeCanvas');
    if (cvs && canvasCtx) {
      canvasCtx.fillRect(0, 0, cvs.width, cvs.height);
      if (typeof BrainAudio !== 'undefined') BrainAudio.playTone(300, 'sine', 0.1);
    }
  };
  window.BrainApp.cycleCreativePrompt = function() {
    const prompts = [
      'Draw a creature powered by pure brain electricity!',
      'Draw the machine that catches secret ideas!',
      'Draw what your brain looks like when you are happy!',
      'Draw an ESL superpower invention!'
    ];
    const p = prompts[Math.floor(Math.random() * prompts.length)];
    const pElem = document.getElementById('canvasPrompt');
    if (pElem) pElem.textContent = 'Prompt: "' + p + '"';
    if (typeof BrainAudio !== 'undefined') BrainAudio.speak(p);
  };

  window.BrainApp.compareBrains = function() {
    if (typeof BrainAudio !== 'undefined') {
      BrainAudio.playSuccess();
      BrainAudio.speak('Look how different everyone imagines the exact same idea! Creativity is awesome!');
    }
    const box = document.getElementById('creativityTakeaway');
    if (box) box.style.display = 'block';
    completeMission(5, 30);
    const nextBtn = document.getElementById('btnM5Next');
    if (nextBtn) nextBtn.disabled = false;
  };

  // =======================================================================
  // MISSION 6: BRAIN VS BRAIN (Subject Portals & Activity Lobe Heatmap)
  // =======================================================================
  function renderMission6(container) {
    const data = BRAIN_DATA.mission6_subjects;

    container.innerHTML = 
      '<div class="m6-grid">' +
        '<div class="m6-left glass-card">' +
          '<div class="m6-header">' +
            '<h3>🏫 4 SUBJECT PORTALS: WHICH LOBE POWERS UP?</h3>' +
            '<span class="badge">NEURAL HEATMAP</span>' +
          '</div>' +

          '<div class="subject-portals-grid">' +
            data.subjects.map((sub, i) => 
              '<button class="portal-card ' + (i === 0 ? 'active' : '') + '" id="portalBtn_' + sub.id + '" onclick="window.BrainApp.selectSubject(\'' + sub.id + '\')">' +
                '<div class="portal-icon">' + sub.icon + '</div>' +
                '<div class="portal-title">' + sub.name + '</div>' +
                '<div class="portal-lobe">Lobe: ' + sub.activeLobe + '</div>' +
              '</button>'
            ).join('') +
          '</div>' +

          '<div class="subject-mini-game-area" id="subjectGameArea"></div>' +
        '</div>' +

        '<div class="m6-right glass-card">' +
          '<div class="m6-header">' +
            '<h3>🔥 ACTIVE REGION HEATMAP</h3>' +
            '<span class="badge" id="m6HeatmapBadge">FRONTAL MOTOR</span>' +
          '</div>' +

          '<div class="subject-brain-heatmap-box">' +
            '<svg viewBox="0 0 400 300" class="mini-heatmap-svg">' +
              '<defs>' +
                '<radialGradient id="heatGradient">' +
                  '<stop offset="0%" stop-color="#ff0055"/>' +
                  '<stop offset="50%" stop-color="#ffaa00"/>' +
                  '<stop offset="100%" stop-color="#ffaa00" stop-opacity="0"/>' +
                '</radialGradient>' +
              '</defs>' +
              '<path class="brain-base" d="M 90 160 C 80 110, 110 50, 190 40 C 270 30, 330 80, 340 140 C 350 190, 310 250, 250 260 C 200 270, 180 240, 150 250 C 110 260, 80 200, 90 160 Z" />' +
              '<circle id="heatCircle" cx="150" cy="110" r="50" fill="url(#heatGradient)" opacity="0.85"/>' +
            '</svg>' +
          '</div>' +

          '<div class="lobe-science-explanation" id="lobeScienceDesc"></div>' +

          '<div class="m6-footer-bar">' +
            '<div class="completed-subjects-count" id="subCountText">Subjects Tested: 1 / 4</div>' +
            '<button class="btn-primary" id="btnM6Next" disabled onclick="window.BrainApp.nextMission()">Next Mission: Save the Brain ➔</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    window.BrainApp.m6Data = {
      testedSubjects: new Set(['pe']),
      subjects: data.subjects
    };

    window.BrainApp.selectSubject('pe');
  }

  window.BrainApp.selectSubject = function(subId) {
    const d = window.BrainApp.m6Data;
    d.testedSubjects.add(subId);

    document.querySelectorAll('.portal-card').forEach(c => {
      c.classList.toggle('active', c.id === 'portalBtn_' + subId);
    });

    const sub = d.subjects.find(s => s.id === subId);
    if (!sub) return;

    if (typeof BrainAudio !== 'undefined') {
      BrainAudio.playTone(550, 'sine', 0.1);
      BrainAudio.speak(sub.name + '. ' + sub.description);
    }

    const badge = document.getElementById('m6HeatmapBadge');
    if (badge) badge.textContent = sub.activeLobe.toUpperCase();

    const descElem = document.getElementById('lobeScienceDesc');
    if (descElem) {
      descElem.innerHTML = 
        '<h4>' + sub.icon + ' ' + sub.name + ' & Your Brain:</h4>' +
        '<p>' + sub.description + '</p>' +
        '<div class="pathway-tag">💡 Neural Highway: <strong>' + sub.pathway + '</strong></div>';
    }

    const circle = document.getElementById('heatCircle');
    if (circle) {
      if (sub.id === 'pe') { circle.setAttribute('cx', 170); circle.setAttribute('cy', 100); }
      else if (sub.id === 'music') { circle.setAttribute('cx', 200); circle.setAttribute('cy', 180); }
      else if (sub.id === 'math') { circle.setAttribute('cx', 230); circle.setAttribute('cy', 110); }
      else if (sub.id === 'reading') { circle.setAttribute('cx', 280); circle.setAttribute('cy', 160); }
    }

    const gameArea = document.getElementById('subjectGameArea');
    if (gameArea) {
      if (sub.id === 'pe') {
        gameArea.innerHTML = 
          '<div class="reflex-mini-game">' +
            '<p>Tap the reflex lights as they flash!</p>' +
            '<div class="reflex-targets-row">' +
              '<button class="reflex-btn active" onclick="window.BrainApp.hitReflex(1, this)">🔴 1</button>' +
              '<button class="reflex-btn" onclick="window.BrainApp.hitReflex(2, this)">🟡 2</button>' +
              '<button class="reflex-btn" onclick="window.BrainApp.hitReflex(3, this)">🟢 3</button>' +
            '</div>' +
          '</div>';
      } else if (sub.id === 'music') {
        gameArea.innerHTML = 
          '<div class="music-mini-game">' +
            '<p>Listen to the 3-tone neural frequency!</p>' +
            '<div class="music-tones-row">' +
              '<button class="tone-btn" onclick="BrainAudio.playTone(330, \'sine\', 0.3)">🎵 Low (E)</button>' +
              '<button class="tone-btn" onclick="BrainAudio.playTone(440, \'sine\', 0.3)">🎵 Mid (A)</button>' +
              '<button class="tone-btn" onclick="BrainAudio.playTone(660, \'sine\', 0.3)">🎵 High (E)</button>' +
            '</div>' +
          '</div>';
      } else if (sub.id === 'math') {
        gameArea.innerHTML = 
          '<div class="math-mini-game">' +
            '<p>Quick mental math: <strong>8 neurons + 7 neurons = ?</strong></p>' +
            '<div class="math-options-row">' +
              '<button class="math-btn" onclick="BrainAudio.playError(); showToast(\'Try again!\')">14</button>' +
              '<button class="math-btn" onclick="BrainAudio.playSuccess(); showToast(\'Correct! 15 neurons!\')">15</button>' +
              '<button class="math-btn" onclick="BrainAudio.playError(); showToast(\'Try again!\')">16</button>' +
            '</div>' +
          '</div>';
      } else if (sub.id === 'reading') {
        gameArea.innerHTML = 
          '<div class="reading-mini-game">' +
            '<p>Unscramble the word: <strong>B - R - A - I - N</strong></p>' +
            '<button class="btn-secondary" onclick="BrainAudio.playSuccess(); BrainAudio.speak(\'BRAIN!\'); showToast(\'Correct: B-R-A-I-N!\')">✨ Unscramble: BRAIN</button>' +
          '</div>';
      }
    }

    const count = d.testedSubjects.size;
    const subCountText = document.getElementById('subCountText');
    if (subCountText) subCountText.textContent = 'Subjects Tested: ' + count + ' / 4';

    if (count >= 4) {
      completeMission(6, 30);
      const nextBtn = document.getElementById('btnM6Next');
      if (nextBtn) nextBtn.disabled = false;
    }
  };

  window.BrainApp.hitReflex = function(num, btn) {
    if (typeof BrainAudio !== 'undefined') BrainAudio.playNeuralZap();
    btn.classList.add('hit');
    showToast('Reflex #' + num + ' Registered! Sensory-motor loop active!');
  };

  // =======================================================================
  // MISSION 7: SAVE THE BRAIN (Habits & Energy Charging)
  // =======================================================================
  function renderMission7(container) {
    const data = BRAIN_DATA.mission7_habits;

    container.innerHTML = 
      '<div class="m7-grid">' +
        '<div class="m7-left glass-card">' +
          '<div class="m7-header">' +
            '<h3>⚡ BRAIN ENERGY CORE</h3>' +
            '<span class="badge" id="energyPctBadge">CHARGE: 20%</span>' +
          '</div>' +

          '<div class="energy-core-visualizer">' +
            '<div class="energy-cylinder">' +
              '<div class="energy-liquid" id="energyLiquid" style="height: 20%;"></div>' +
            '</div>' +
            '<div class="core-stats">' +
              '<div class="core-heartbeat">' +
                '<span class="pulse-icon">💓</span>' +
                '<span id="heartrateText">50 BPM (LOW ENERGY)</span>' +
              '</div>' +
              '<div class="fuel-readout" id="fuelReadout">' +
                'Status: Brain is exhausted! Provide 4 healthy habits to reach 100%!' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="m7-right glass-card">' +
          '<div class="m7-header">' +
            '<h3>🍎 BRAIN FUEL VS BRAIN DRAINS</h3>' +
            '<span class="badge">DAILY HABITS</span>' +
          '</div>' +

          '<p class="subtext">Tap the healthy habits to recharge your brain cells!</p>' +

          '<div class="habits-rack" id="habitsRack">' +
            data.habits.map((h, i) => 
              '<button class="habit-item-card ' + (h.isHealthy ? 'healthy' : 'drain') + '" id="habitCard_' + i + '" onclick="window.BrainApp.applyHabit(' + i + ')">' +
                '<span class="habit-icon">' + h.icon + '</span>' +
                '<div class="habit-details">' +
                  '<div class="habit-name">' + h.name + '</div>' +
                  '<div class="habit-impact">' + (h.isHealthy ? '+20% Power' : '-10% Drain') + '</div>' +
                '</div>' +
              '</button>'
            ).join('') +
          '</div>' +

          '<div class="m7-footer-bar">' +
            '<button class="btn-primary" id="btnM7Next" disabled onclick="window.BrainApp.nextMission()">Next Mission: Final Graduation ➔</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    window.BrainApp.m7Data = {
      energy: 20,
      appliedHabits: new Set(),
      habits: data.habits
    };
  }

  window.BrainApp.applyHabit = function(idx) {
    const d = window.BrainApp.m7Data;
    const h = d.habits[idx];
    const card = document.getElementById('habitCard_' + idx);

    if (h.isHealthy) {
      if (d.appliedHabits.has(idx)) return;
      d.appliedHabits.add(idx);
      d.energy = Math.min(100, d.energy + 20);

      if (typeof BrainAudio !== 'undefined') {
        BrainAudio.playSuccess();
        BrainAudio.speak(h.name + '! ' + h.reason);
      }
      if (card) card.classList.add('applied');
      showToast('✅ +20% Energy: ' + h.reason);
    } else {
      d.energy = Math.max(10, d.energy - 10);
      if (typeof BrainAudio !== 'undefined') {
        BrainAudio.playError();
        BrainAudio.speak('Watch out! ' + h.reason);
      }
      showToast('⚠️ Brain Drain! ' + h.reason);
    }

    const liquid = document.getElementById('energyLiquid');
    if (liquid) liquid.style.height = d.energy + '%';
    const badge = document.getElementById('energyPctBadge');
    if (badge) badge.textContent = 'CHARGE: ' + d.energy + '%';

    const hrText = document.getElementById('heartrateText');
    if (hrText) {
      if (d.energy >= 80) {
        hrText.textContent = '85 BPM (MAX OPTIMIZED POWER!)';
        hrText.style.color = '#00ff88';
      } else {
        hrText.textContent = '65 BPM (CHARGING)';
      }
    }

    if (d.energy >= 100) {
      completeMission(7, 30);
      const nextBtn = document.getElementById('btnM7Next');
      if (nextBtn) nextBtn.disabled = false;
      const readout = document.getElementById('fuelReadout');
      if (readout) readout.textContent = '🌟 OVERLOAD POWER ACHIEVED! Your brain is ready for any challenge!';
    }
  };

  // =======================================================================
  // MISSION 8: BECOME A BRAIN SCIENTIST (Grand Finale & Discovery)
  // =======================================================================
  function renderMission8(container) {
    container.innerHTML = 
      '<div class="m8-grid">' +
        '<div class="m8-main glass-card">' +
          '<div class="m8-header">' +
            '<h3>🎓 GRADUATION: CERTIFIED BRAIN SCIENTIST</h3>' +
            '<span class="badge gold-badge">ACADEMY HONORS</span>' +
          '</div>' +

          '<div class="scaffold-cloze-card">' +
            '<h4>📜 Complete Your Official Brain Scientist Discovery Statement:</h4>' +
            '<div class="cloze-paragraph">' +
              '"My brain has billions of ' +
              '<select id="cloze_1" class="cloze-select" onchange="window.BrainApp.checkCloze()">' +
                '<option value="">--choose--</option>' +
                '<option value="neurons">neurons</option>' +
                '<option value="bones">bones</option>' +
              '</select>. ' +
              'When I practice English and learn new things, my neurons make new ' +
              '<select id="cloze_2" class="cloze-select" onchange="window.BrainApp.checkCloze()">' +
                '<option value="">--choose--</option>' +
                '<option value="connections">connections</option>' +
                '<option value="pencils">pencils</option>' +
              '</select>. ' +
              'Every time I repeat an activity, the signals travel ' +
              '<select id="cloze_3" class="cloze-select" onchange="window.BrainApp.checkCloze()">' +
                '<option value="">--choose--</option>' +
                '<option value="faster">faster</option>' +
                '<option value="slower">slower</option>' +
              '</select>. ' +
              'My imagination lets me ' +
              '<select id="cloze_4" class="cloze-select" onchange="window.BrainApp.checkCloze()">' +
                '<option value="">--choose--</option>' +
                '<option value="visualize">visualize</option>' +
                '<option value="forget">forget</option>' +
              '</select> ' +
              'invisible ideas. I am a master Brain Hacker!"' +
            '</div>' +
          '</div>' +

          '<div class="certificate-preview-box" id="certificateBox" style="display:none;">' +
            '<div class="cert-border">' +
              '<div class="cert-badge">🏆</div>' +
              '<div class="cert-title">CERTIFIED BRAIN SCIENTIST</div>' +
              '<div class="cert-subtitle">ENGLISH ADVENTURE ACADEMY - SCIENCE DIVISION</div>' +
              '<div class="cert-name" id="certStudentName">' + state.studentName + '</div>' +
              '<div class="cert-statement">Has unlocked the human cerebrum, wired neural pathways, and demonstrated elite scientific creativity!</div>' +
              '<div class="cert-meta">' +
                '<span>XP Earned: <strong>+100 XP</strong></span>' +
                '<span>Division: <strong>Grade 4 / A1+ A2</strong></span>' +
              '</div>' +
            '</div>' +

            '<div class="cert-action-btns">' +
              '<button class="btn-primary" onclick="window.print()">🖨️ Print Official Certificate</button>' +
              '<button class="btn-secondary" onclick="window.BrainApp.saveToPlatformStore()">💾 Save XP to Academy Store</button>' +
              '<a href="../index.html#library" class="btn-tool">🏛️ Return to Resource Library</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    if (typeof BrainAudio !== 'undefined') {
      BrainAudio.playSuccess();
      BrainAudio.speak('Mission 8! Complete your scientific statement to claim your official Brain Scientist certificate!');
    }
  }

  window.BrainApp.checkCloze = function() {
    const c1 = document.getElementById('cloze_1').value;
    const c2 = document.getElementById('cloze_2').value;
    const c3 = document.getElementById('cloze_3').value;
    const c4 = document.getElementById('cloze_4').value;

    if (c1 === 'neurons' && c2 === 'connections' && c3 === 'faster' && c4 === 'visualize') {
      if (typeof BrainAudio !== 'undefined') BrainAudio.playVictoryFanfare();
      const cert = document.getElementById('certificateBox');
      if (cert) cert.style.display = 'block';
      completeMission(8, 50);
      showToast('🎉 CONGRATULATIONS! You are now an official Brain Scientist!');
      if (typeof BrainAudio !== 'undefined') BrainAudio.speak('Congratulations Brain Scientist! You have unlocked your brain!');
    }
  };

  window.BrainApp.saveToPlatformStore = function() {
    try {
      if (window.parent && window.parent.MasterSchoolStore) {
        window.parent.MasterSchoolStore.addXPToActiveStudent(100);
      } else if (window.MasterSchoolStore) {
        window.MasterSchoolStore.addXPToActiveStudent(100);
      }
      if (typeof BrainAudio !== 'undefined') BrainAudio.playSuccess();
      showToast('✅ +100 XP saved to English Adventure Academy student profile!');
    } catch(e) {
      console.warn('Store bridge:', e);
      showToast('✅ XP updated in session profile!');
    }
  };

  // Helper navigation
  window.BrainApp.loadMission = loadMission;
  window.BrainApp.completeCurrentMission = function() {
    completeMission(state.currentMission, 50);
  };
  window.BrainApp.nextMission = function() {
    if (state.currentMission < state.totalMissions) {
      loadMission(state.currentMission + 1);
    }
  };

  window.BrainApp.selectTeam = function(teamKey) {
    state.selectedTeam = teamKey;
    renderTeamScores();
    showToast('Active Team set to: ' + state.teams[teamKey].name);
  };

  window.BrainApp.addTeamScore = function(teamKey, delta) {
    state.teams[teamKey].score = Math.max(0, state.teams[teamKey].score + delta);
    if (typeof BrainAudio !== 'undefined') BrainAudio.playTone(delta > 0 ? 700 : 250, 'sine', 0.1);
    renderTeamScores();
  };

  function toggleTeacherHUD() {
    state.teacherHUDOpen = !state.teacherHUDOpen;
    if (DOM.teacherHud) {
      DOM.teacherHud.classList.toggle('active', state.teacherHUDOpen);
    }
  }

  function showToast(msg) {
    let toast = document.getElementById('brainToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'brainToast';
      toast.className = 'brain-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 3200);
  }

})();
