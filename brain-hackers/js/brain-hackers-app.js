/**
 * =======================================================================
 * 🧠 THE BRAIN HACKERS: MISSION UNLOCK YOUR BRAIN
 * Comprehensive Interactive ESL Science Experience
 * Smart Board Optimized Touch Architecture & Academy Game Engine
 * =======================================================================
 */

(function(window) {
  'use strict';

  const BrainApp = window.BrainApp || {};
  window.BrainApp = BrainApp;
  const BRAIN_DATA = window.BRAIN_DATA || (typeof global !== 'undefined' ? global.BRAIN_DATA : null);
  const BrainAudio = window.BrainAudio || (typeof global !== 'undefined' ? global.BrainAudio : null);

  // --- STATE MACHINE ---
  const state = {
    currentMission: 1,
    totalMissions: 8,
    isHeroActive: true,
    score: 0,
    energy: 100,
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
    soundEnabled: true,
    studentName: 'Explorer Maya'
  };

  const DOM = {};

  document.addEventListener('DOMContentLoaded', () => {
    cacheDOM();
    initNeuralCanvas();
    bindGlobalEvents();
    renderTeams();
    renderTimeline();
    renderHeroGrid();
    updateHeaderStats();
  });

  function cacheDOM() {
    DOM.wrapper = document.getElementById('bhAppWrapper');
    DOM.heroScreen = document.getElementById('bhHeroScreen');
    DOM.stageContainer = document.getElementById('bhStageContainer');
    DOM.missionContent = document.getElementById('bhMissionContentStage');
    DOM.missionTitle = document.getElementById('bhCurrentMissionTitle');
    DOM.missionBadge = document.getElementById('bhCurrentMissionBadge');
    DOM.missionDesc = document.getElementById('bhCurrentMissionDesc');
    DOM.overallProgress = document.getElementById('bhOverallProgress');
    DOM.teamsStrip = document.getElementById('bhTeamsStrip');
    DOM.timeline = document.getElementById('bhMissionTimeline');
    DOM.heroGrid = document.getElementById('bhHeroMissionsGrid');
    DOM.xpDisplay = document.getElementById('hudXpDisplay');
    DOM.energyDisplay = document.getElementById('hudEnergyDisplay');
    DOM.soundBtn = document.getElementById('hudSoundBtn');
    DOM.prevBtn = document.getElementById('btnPrevStage');
    DOM.nextBtn = document.getElementById('btnNextStage');
    DOM.toast = document.getElementById('bhToast');
    DOM.dossierModal = document.getElementById('dossierModal');
    DOM.teacherModal = document.getElementById('teacherModal');
  }

  function bindGlobalEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'F1' || (e.ctrlKey && e.key.toLowerCase() === 'h')) {
        e.preventDefault();
        window.BrainApp.openTeacherModal();
      } else if (e.key === 'Escape') {
        window.BrainApp.closeModals();
      }
    });
  }

  // --- BACKGROUND NEURAL SIMULATION CANVAS ---
  function initNeuralCanvas() {
    const cvs = document.getElementById('neuralBgCanvas');
    if (!cvs || !cvs.getContext) return;
    const ctx = cvs.getContext('2d');

    let width = (cvs.width = window.innerWidth);
    let height = (cvs.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = cvs.width = window.innerWidth;
      height = cvs.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(45, Math.floor((width * height) / 25000));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2.5 + 1.5,
        color: i % 3 === 0 ? '#00f0ff' : i % 3 === 1 ? '#c084fc' : '#ff2d87'
      });
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(0, 240, 255, ' + (1 - dist / 140) * 0.22 + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(draw);
    }
    draw();
  }

  // --- TOP HUD & STATS UPDATE ---
  function updateHeaderStats() {
    if (DOM.xpDisplay) DOM.xpDisplay.textContent = state.score + ' XP';
    if (DOM.energyDisplay) DOM.energyDisplay.textContent = state.energy + '%';

    const completed = Object.values(state.missionProgress).filter(m => m.completed).length;
    const pct = Math.max(12, Math.round((completed / state.totalMissions) * 100));
    if (DOM.overallProgress) DOM.overallProgress.style.width = pct + '%';
  }

  // --- TEAM COUNTERS STRIP (CLEAN LAYOUT, NO CONCATENATION) ---
  function renderTeams() {
    if (!DOM.teamsStrip) return;
    DOM.teamsStrip.innerHTML = Object.keys(state.teams).map(key => {
      const t = state.teams[key];
      const isSel = state.selectedTeam === key;
      return (
        '<div class="bh-team-card ' + (isSel ? 'selected' : '') + '" onclick="window.BrainApp.selectTeam(\'' + key + '\')" title="Click to set active answering team">' +
          '<span class="bh-team-icon">' + t.icon + '</span>' +
          '<div class="bh-team-info">' +
            '<span class="bh-team-title">' + t.name + '</span>' +
            '<span class="bh-team-pts">XP ' + t.score + '</span>' +
          '</div>' +
          '<div class="bh-team-btn-group">' +
            '<button type="button" onclick="event.stopPropagation(); window.BrainApp.addTeamScore(\'' + key + '\', 10, this)" title="Award 10 XP to team">+10</button>' +
            '<button type="button" onclick="event.stopPropagation(); window.BrainApp.addTeamScore(\'' + key + '\', -5, this)" title="Subtract 5 XP">-5</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  // --- VISUAL MISSION TIMELINE ---
  function renderTimeline() {
    if (!DOM.timeline || typeof BRAIN_DATA === 'undefined') return;
    DOM.timeline.innerHTML = BRAIN_DATA.missions.map(m => {
      const prog = state.missionProgress[m.id] || { unlocked: false, completed: false };
      const isActive = !state.isHeroActive && state.currentMission === m.id;
      let statusIcon = prog.completed ? '🟢 ✓' : (prog.unlocked ? '🔓' : '🔒');

      return (
        '<div class="bh-timeline-step ' + (isActive ? 'active' : '') + ' ' + (prog.completed ? 'completed' : '') + '" onclick="window.BrainApp.loadMission(' + m.id + ')">' +
          '<span class="bh-step-num">0' + m.id + '</span>' +
          '<span class="bh-step-icon">' + m.icon + '</span>' +
          '<span class="bh-step-label">' + m.title.toUpperCase() + '</span>' +
          '<span class="bh-step-status">' + statusIcon + '</span>' +
        '</div>'
      );
    }).join('');
  }

  // --- HERO FAST JUMP GRID ---
  function renderHeroGrid() {
    if (!DOM.heroGrid || typeof BRAIN_DATA === 'undefined') return;
    DOM.heroGrid.innerHTML = BRAIN_DATA.missions.map(m => (
      '<div class="bh-hero-mission-card" onclick="window.BrainApp.loadMission(' + m.id + ')">' +
        '<div style="font-size:1.8rem;">' + m.icon + '</div>' +
        '<div>' +
          '<div style="font-size:0.75rem; color:var(--neon-cyan); font-weight:800; font-family:var(--font-mono);">MISSION 0' + m.id + '</div>' +
          '<div style="font-size:0.95rem; font-weight:900; color:#fff;">' + m.title + '</div>' +
        '</div>' +
      '</div>'
    )).join('');
  }

  // --- MISSION NAVIGATION & LIFECYCLE ---
  function loadMission(missionId) {
    state.isHeroActive = false;
    state.currentMission = missionId;

    if (DOM.heroScreen) DOM.heroScreen.style.display = 'none';
    if (DOM.stageContainer) DOM.stageContainer.style.display = 'flex';

    const mission = BRAIN_DATA.missions.find(m => m.id === missionId);
    if (!mission) return;

    if (DOM.missionTitle) DOM.missionTitle.innerHTML = mission.icon + ' 0' + mission.id + '. ' + mission.title;
    if (DOM.missionBadge) DOM.missionBadge.textContent = 'MISSION 0' + mission.id + ' OF 08';
    if (DOM.missionDesc) DOM.missionDesc.textContent = mission.subtitle;

    if (DOM.prevBtn) DOM.prevBtn.disabled = missionId <= 1;
    if (DOM.nextBtn) DOM.nextBtn.disabled = missionId >= state.totalMissions;

    renderTimeline();

    if (state.soundEnabled && typeof BrainAudio !== 'undefined') {
      BrainAudio.playChime(missionId);
      BrainAudio.speak('Mission ' + mission.id + ': ' + mission.title + '. ' + mission.subtitle);
    }

    if (!DOM.missionContent) return;
    DOM.missionContent.innerHTML = '';

    switch (missionId) {
      case 1: renderMission1(DOM.missionContent); break;
      case 2: renderMission2(DOM.missionContent); break;
      case 3: renderMission3(DOM.missionContent); break;
      case 4: renderMission4(DOM.missionContent); break;
      case 5: renderMission5(DOM.missionContent); break;
      case 6: renderMission6(DOM.missionContent); break;
      case 7: renderMission7(DOM.missionContent); break;
      case 8: renderMission8(DOM.missionContent); break;
      default: DOM.missionContent.innerHTML = '<p>Mission loading...</p>';
    }

    if (typeof window.scrollTo === 'function') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function completeMission(missionId, xpEarned = 25) {
    if (!state.missionProgress[missionId].completed) {
      state.missionProgress[missionId].completed = true;
      state.score += xpEarned;
      state.teams[state.selectedTeam].score += xpEarned;

      if (typeof BrainAudio !== 'undefined') BrainAudio.playSuccess();
      showToast('🎉 Mission 0' + missionId + ' Cleared! +' + xpEarned + ' XP to ' + state.teams[state.selectedTeam].name + '!');
    }
    if (missionId < state.totalMissions) {
      state.missionProgress[missionId + 1].unlocked = true;
    }
    renderTeams();
    renderTimeline();
    updateHeaderStats();
  }

  // =======================================================================
  // MISSION 1: DETECT THE BRAIN (PET Lobes & Smart Board Actions)
  // =======================================================================
  function renderMission1(container) {
    const data = BRAIN_DATA.mission1_detect;

    container.innerHTML = 
      '<div class="bh-layout-grid">' +
        '<!-- Left Panel: Brain PET Scanner Visual -->' +
        '<div class="bh-panel">' +
          '<div class="bh-panel-header">' +
            '<div class="bh-panel-title">🔬 CEREBRUM PET SCANNER</div>' +
            '<span class="bh-badge active-mission">LIVE SENSOR</span>' +
          '</div>' +

          '<div class="bh-scanner-stage">' +
            '<svg id="bhBrainSvg" viewBox="0 0 500 400" class="bh-brain-svg">' +
              '<defs>' +
                '<radialGradient id="gradFrontal" cx="40%" cy="40%" r="60%">' +
                  '<stop offset="0%" stop-color="#ff3366"/>' +
                  '<stop offset="100%" stop-color="#990033"/>' +
                '</radialGradient>' +
                '<radialGradient id="gradParietal" cx="50%" cy="40%" r="60%">' +
                  '<stop offset="0%" stop-color="#fbbf24"/>' +
                  '<stop offset="100%" stop-color="#b45309"/>' +
                '</radialGradient>' +
                '<radialGradient id="gradOccipital" cx="50%" cy="50%" r="60%">' +
                  '<stop offset="0%" stop-color="#34d399"/>' +
                  '<stop offset="100%" stop-color="#065f46"/>' +
                '</radialGradient>' +
                '<radialGradient id="gradTemporal" cx="50%" cy="50%" r="60%">' +
                  '<stop offset="0%" stop-color="#38bdf8"/>' +
                  '<stop offset="100%" stop-color="#1e3a8a"/>' +
                '</radialGradient>' +
              '</defs>' +

              '<!-- Brain Base Silhouette -->' +
              '<path d="M 120 220 C 100 160, 140 70, 250 60 C 350 50, 420 110, 430 180 C 440 240, 390 320, 320 330 C 260 340, 240 310, 200 320 C 150 330, 110 270, 120 220 Z" fill="#070e24" stroke="rgba(56,189,248,0.3)" stroke-width="4"/>' +

              '<!-- Frontal Lobe (Thinking, Speaking) -->' +
              '<path id="lobe-frontal" class="bh-lobe-path" d="M 120 220 C 100 160, 140 70, 240 65 C 260 120, 250 180, 230 230 C 180 230, 140 240, 120 220 Z" onclick="window.BrainApp.handleLobeClick(\'frontal\')"/>' +
              '<text x="160" y="150" fill="#fff" font-weight="900" font-size="14" letter-spacing="1">FRONTAL</text>' +

              '<!-- Parietal Lobe (Touch, Movement) -->' +
              '<path id="lobe-parietal" class="bh-lobe-path" d="M 240 65 C 320 60, 370 100, 370 160 C 310 160, 270 150, 230 230 C 250 180, 260 120, 240 65 Z" onclick="window.BrainApp.handleLobeClick(\'parietal\')"/>' +
              '<text x="285" y="110" fill="#fff" font-weight="900" font-size="14" letter-spacing="1">PARIETAL</text>' +

              '<!-- Occipital Lobe (Seeing) -->' +
              '<path id="lobe-occipital" class="bh-lobe-path" d="M 370 160 C 420 170, 430 230, 410 280 C 370 270, 350 220, 340 190 C 350 170, 360 165, 370 160 Z" onclick="window.BrainApp.handleLobeClick(\'occipital\')"/>' +
              '<text x="365" y="225" fill="#fff" font-weight="900" font-size="13" letter-spacing="1">OCCIPITAL</text>' +

              '<!-- Temporal Lobe (Hearing) -->' +
              '<path id="lobe-temporal" class="bh-lobe-path" d="M 220 235 C 270 200, 340 200, 340 270 C 320 320, 250 310, 210 290 Z" onclick="window.BrainApp.handleLobeClick(\'temporal\')"/>' +
              '<text x="250" y="270" fill="#fff" font-weight="900" font-size="14" letter-spacing="1">TEMPORAL</text>' +

              '<!-- Cerebellum -->' +
              '<path id="lobe-cerebellum" class="bh-lobe-path" d="M 320 300 C 370 300, 380 340, 340 360 C 300 370, 270 350, 280 320 Z"/>' +
              '<text x="300" y="345" fill="#94a3b8" font-weight="700" font-size="11">CEREBELLUM</text>' +
            '</svg>' +
          '</div>' +

          '<div style="background:rgba(15,23,42,0.8); border:1px solid var(--border-subtle); padding:12px 18px; border-radius:12px; display:flex; align-items:center; gap:10px;">' +
            '<span style="font-size:1.3rem;">💡</span>' +
            '<span style="font-size:0.88rem; color:#cbd5e1;" id="m1StatusBanner">Select Clue #1 below, then touch the matching brain action!</span>' +
          '</div>' +
        '</div>' +

        '<!-- Right Panel: Classroom Scenarios & 70px Touch Actions -->' +
        '<div class="bh-panel">' +
          '<div class="bh-panel-header">' +
            '<div class="bh-panel-title">🧪 LAB SCENARIOS &amp; SENSES</div>' +
            '<span class="bh-badge" id="m1CounterBadge">ACTIVATED: 0 / 4</span>' +
          '</div>' +

          '<div style="display:flex; flex-direction:column; gap:10px;" id="m1ScenariosList">' +
            data.scenarios.map((sc, i) => 
              '<div class="bh-part-card ' + (i === 0 ? 'active-selection' : '') + '" id="m1Card_' + i + '" onclick="window.BrainApp.selectM1Scenario(' + i + ')">' +
                '<div style="display:flex; justify-content:space-between; align-items:center;">' +
                  '<span style="font-size:0.75rem; color:var(--neon-cyan); font-weight:800; font-family:var(--font-mono);">CLUE #0' + (i + 1) + '</span>' +
                  '<span style="font-size:1.2rem;">' + sc.icon + '</span>' +
                '</div>' +
                '<div style="font-size:0.95rem; font-weight:800; color:#fff; margin-top:4px;">"' + sc.clue + '"</div>' +
                '<div style="font-size:0.8rem; color:#34d399; font-weight:700; margin-top:4px;" id="m1Feedback_' + i + '"></div>' +
              '</div>'
            ).join('') +
          '</div>' +

          '<div style="margin-top:16px;">' +
            '<div style="font-size:0.82rem; color:var(--neon-gold); font-weight:800; text-transform:uppercase; margin-bottom:8px;">' +
              '👉 Touch matching sense for Smart Board:' +
            '</div>' +
            '<div class="bh-action-grid">' +
              data.actions.map(act => 
                '<button type="button" class="bh-btn-sense-action" onclick="window.BrainApp.verifyM1Action(\'' + act.id + '\')">' +
                  '<span class="bh-sense-icon">' + act.icon + '</span>' +
                  '<div class="bh-sense-info">' +
                    '<div class="bh-sense-name">' + act.name + '</div>' +
                    '<div class="bh-sense-lobe">' + act.lobeName + '</div>' +
                  '</div>' +
                '</button>'
              ).join('') +
            '</div>' +
          '</div>' +

          '<div style="display:flex; justify-content:flex-end; margin-top:20px;">' +
            '<button type="button" class="bh-btn-nav primary" id="btnM1Next" disabled onclick="window.BrainApp.nextMission()">' +
              'Next Mission: Neuron Network ➔' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    window.BrainApp.m1Data = {
      activeIndex: 0,
      unlocked: new Set(),
      scenarios: data.scenarios
    };
  }

  window.BrainApp.selectM1Scenario = function(idx) {
    const d = window.BrainApp.m1Data;
    d.activeIndex = idx;
    document.querySelectorAll('#m1ScenariosList .bh-part-card').forEach((c, i) => {
      c.classList.toggle('active-selection', i === idx);
    });
    const sc = d.scenarios[idx];
    if (typeof BrainAudio !== 'undefined') {
      BrainAudio.playTone(520, 'sine', 0.1);
      BrainAudio.speak(sc.clue);
    }
    const banner = document.getElementById('m1StatusBanner');
    if (banner) banner.textContent = 'Investigating Clue #0' + (idx + 1) + ': "' + sc.clue + '"';
  };

  window.BrainApp.verifyM1Action = function(actionId) {
    const d = window.BrainApp.m1Data;
    const sc = d.scenarios[d.activeIndex];
    const fb = document.getElementById('m1Feedback_' + d.activeIndex);
    const card = document.getElementById('m1Card_' + d.activeIndex);

    if (actionId === sc.targetAction) {
      if (typeof BrainAudio !== 'undefined') {
        BrainAudio.playSuccess();
        BrainAudio.speak('Correct! ' + sc.explanation);
      }
      if (card) {
        card.classList.remove('active-selection');
        card.classList.add('placed');
      }
      if (fb) fb.textContent = '✓ ' + sc.explanation;

      const lobe = document.getElementById('lobe-' + sc.targetLobe);
      if (lobe) lobe.classList.add('glowing', sc.colorClass);

      d.unlocked.add(d.activeIndex);
      const countBadge = document.getElementById('m1CounterBadge');
      if (countBadge) countBadge.textContent = 'ACTIVATED: ' + d.unlocked.size + ' / 4';

      if (d.unlocked.size >= 4) {
        completeMission(1, 30);
        const nextBtn = document.getElementById('btnM1Next');
        if (nextBtn) nextBtn.disabled = false;
        const banner = document.getElementById('m1StatusBanner');
        if (banner) banner.textContent = '🎉 CEREBRUM SCAN 100% COMPLETE! All 4 lobes active!';
      } else {
        setTimeout(() => {
          for (let i = 0; i < d.scenarios.length; i++) {
            if (!d.unlocked.has(i)) {
              window.BrainApp.selectM1Scenario(i);
              break;
            }
          }
        }, 1200);
      }
    } else {
      if (typeof BrainAudio !== 'undefined') BrainAudio.playError();
      showToast('❌ Not that lobe! Think about what that sense does.');
    }
  };

  window.BrainApp.handleLobeClick = function(lobeKey) {
    const d = window.BrainApp.m1Data;
    if (!d || !d.scenarios) return;
    const sc = d.scenarios[d.activeIndex];
    if (sc && sc.targetLobe === lobeKey) {
      window.BrainApp.verifyM1Action(sc.targetAction);
    } else {
      if (typeof BrainAudio !== 'undefined') BrainAudio.playTone(300, 'sawtooth', 0.15);
      showToast('That is the ' + lobeKey.toUpperCase() + ' lobe. Try checking the active clue!');
    }
  };

  // =======================================================================
  // MISSION 2: NEURON NETWORK
  // =======================================================================
  function renderMission2(container) {
    const data = BRAIN_DATA.mission2_neurons;

    container.innerHTML = 
      '<div class="bh-layout-grid">' +
        '<div class="bh-panel">' +
          '<div class="bh-panel-header">' +
            '<div class="bh-panel-title">🔬 MICROSCOPE: NEURON STRUCTURE</div>' +
            '<span class="bh-badge">ZOOM: 10,000X</span>' +
          '</div>' +

          '<div style="text-align:center; padding:10px 0;">' +
            '<svg id="neuronSvg" viewBox="0 0 700 420" class="bh-neuron-svg">' +
              '<!-- Dendrites branches -->' +
              '<g stroke="#00f0ff" stroke-width="6" stroke-linecap="round" fill="none">' +
                '<path d="M 210 180 C 150 140, 110 110, 60 90 M 110 110 C 80 70, 50 40, 30 20"/>' +
                '<path d="M 200 230 C 130 230, 80 260, 40 290 M 90 245 C 60 270, 30 310, 20 350"/>' +
                '<path d="M 220 270 C 160 300, 120 350, 90 410"/>' +
              '</g>' +

              '<!-- Cell Body / Soma -->' +
              '<path d="M 220 180 C 270 140, 310 190, 320 220 C 330 260, 290 300, 240 290 C 190 280, 180 220, 220 180 Z" fill="#0e1e38" stroke="#00f0ff" stroke-width="5"/>' +
              '<circle cx="260" cy="235" r="30" fill="#ff007f" opacity="0.85"/>' +
              '<circle cx="260" cy="235" r="14" fill="#fbbf24"/>' +
              '<text x="260" y="240" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">NUCLEUS</text>' +

              '<!-- Axon Cable -->' +
              '<path d="M 320 235 L 520 235" stroke="#3b82f6" stroke-width="12" stroke-linecap="round"/>' +
              '<rect x="340" y="221" width="45" height="28" rx="8" fill="#1e3a8a" stroke="#38bdf8" stroke-width="2"/>' +
              '<rect x="400" y="221" width="45" height="28" rx="8" fill="#1e3a8a" stroke="#38bdf8" stroke-width="2"/>' +
              '<rect x="460" y="221" width="45" height="28" rx="8" fill="#1e3a8a" stroke="#38bdf8" stroke-width="2"/>' +

              '<!-- Synapse Branches -->' +
              '<g stroke="#00f0ff" stroke-width="5" stroke-linecap="round" fill="none">' +
                '<path d="M 520 235 C 570 210, 610 160, 650 140 M 580 205 C 620 200, 655 190, 680 185"/>' +
                '<path d="M 520 235 C 570 260, 620 300, 660 330 M 580 265 C 620 280, 655 310, 680 340"/>' +
              '</g>' +

              '<!-- Pulse Spark Particle -->' +
              '<circle id="axonSpark" cx="320" cy="235" r="10" fill="#fde047" opacity="0"/>' +

              '<!-- 4 Touch Target Anchors -->' +
              '<circle id="anchor-cellbody" cx="260" cy="150" r="24" class="bh-target-node" onclick="window.BrainApp.handleNeuronAnchor(\'cellbody\')"/>' +
              '<text x="260" y="156" text-anchor="middle" fill="#fff" font-weight="bold">1</text>' +

              '<circle id="anchor-dendrites" cx="90" cy="190" r="24" class="bh-target-node" onclick="window.BrainApp.handleNeuronAnchor(\'dendrites\')"/>' +
              '<text x="90" y="196" text-anchor="middle" fill="#fff" font-weight="bold">2</text>' +

              '<circle id="anchor-axon" cx="430" cy="180" r="24" class="bh-target-node" onclick="window.BrainApp.handleNeuronAnchor(\'axon\')"/>' +
              '<text x="430" y="186" text-anchor="middle" fill="#fff" font-weight="bold">3</text>' +

              '<circle id="anchor-synapse" cx="640" cy="250" r="24" class="bh-target-node" onclick="window.BrainApp.handleNeuronAnchor(\'synapse\')"/>' +
              '<text x="640" y="256" text-anchor="middle" fill="#fff" font-weight="bold">4</text>' +
            '</svg>' +
          '</div>' +

          '<div style="display:flex; justify-content:space-between; align-items:center; background:rgba(15,23,42,0.8); border:1px solid var(--border-subtle); padding:12px 18px; border-radius:12px;">' +
            '<button type="button" class="bh-btn-hud primary" onclick="window.BrainApp.fireNeuronSignal()">' +
              '⚡ Test Electrical Signal' +
            '</button>' +
            '<span style="font-size:0.88rem; color:#cbd5e1;" id="neuronReadoutText">Status: Wire all 4 parts to ignite signal!</span>' +
          '</div>' +
        '</div>' +

        '<div class="bh-panel">' +
          '<div class="bh-panel-header">' +
            '<div class="bh-panel-title">🧩 ASSEMBLE 4 NEURON PARTS</div>' +
            '<span class="bh-badge" id="m2CounterBadge">WIRED: 0 / 4</span>' +
          '</div>' +

          '<div style="display:flex; flex-direction:column; gap:10px;">' +
            data.parts.map(p => 
              '<div class="bh-part-card" id="partCard_' + p.id + '" onclick="window.BrainApp.selectNeuronPart(\'' + p.id + '\')">' +
                '<div style="display:flex; justify-content:space-between; align-items:center;">' +
                  '<strong style="font-size:1.05rem; color:#ffffff;">' + p.name + '</strong>' +
                  '<span style="font-size:0.75rem; color:#94a3b8; font-weight:700;" id="statusPart_' + p.id + '">⚪ UNWIRED</span>' +
                '</div>' +
                '<div style="font-size:0.85rem; color:#cbd5e1; margin-top:4px;">' + p.definition + '</div>' +
                '<div style="font-size:0.8rem; color:var(--neon-gold); font-style:italic; margin-top:4px;">💡 ' + p.analogy + '</div>' +
              '</div>'
            ).join('') +
          '</div>' +

          '<div style="display:flex; justify-content:flex-end; margin-top:20px;">' +
            '<button type="button" class="bh-btn-nav primary" id="btnM2Next" disabled onclick="window.BrainApp.nextMission()">' +
              'Next Mission: Relay Race ➔' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    window.BrainApp.m2Data = {
      selectedPart: null,
      placed: new Set(),
      parts: data.parts
    };
  }

  window.BrainApp.selectNeuronPart = function(partId) {
    window.BrainApp.m2Data.selectedPart = partId;
    document.querySelectorAll('.bh-part-card').forEach(c => {
      c.classList.toggle('active-selection', c.id === 'partCard_' + partId);
    });
    const p = window.BrainApp.m2Data.parts.find(x => x.id === partId);
    if (p && typeof BrainAudio !== 'undefined') {
      BrainAudio.playTone(600, 'triangle', 0.1);
      BrainAudio.speak(p.name + '. ' + p.definition);
    }
  };

  window.BrainApp.handleNeuronAnchor = function(anchorId) {
    const d = window.BrainApp.m2Data;
    if (!d) return;

    if (!d.selectedPart) {
      if (d.parts && d.parts.some(p => p.id === anchorId)) {
        d.selectedPart = anchorId;
      } else {
        if (typeof BrainAudio !== 'undefined') BrainAudio.playError();
        showToast('👉 Touch a part card on the right first!');
        return;
      }
    }

    if (d.selectedPart === anchorId) {
      if (typeof BrainAudio !== 'undefined') BrainAudio.playNeuralZap();
      d.placed.add(anchorId);

      const card = document.getElementById('partCard_' + anchorId);
      if (card) {
        card.classList.remove('active-selection');
        card.classList.add('placed');
        const st = document.getElementById('statusPart_' + anchorId);
        if (st) st.innerHTML = '<span style="color:#10b981;">🟢 CONNECTED</span>';
      }

      const anchor = document.getElementById('anchor-' + anchorId);
      if (anchor) anchor.classList.add('completed');

      d.selectedPart = null;
      const badge = document.getElementById('m2CounterBadge');
      if (badge) badge.textContent = 'WIRED: ' + d.placed.size + ' / 4';

      if (d.placed.size >= 4) {
        completeMission(2, 35);
        const nextBtn = document.getElementById('btnM2Next');
        if (nextBtn) nextBtn.disabled = false;
        const readout = document.getElementById('neuronReadoutText');
        if (readout) readout.textContent = '✅ NEURON 100% WIRED! Firing electric test...';
        window.BrainApp.fireNeuronSignal();
      }
    } else {
      if (typeof BrainAudio !== 'undefined') BrainAudio.playError();
      showToast('❌ Not that part! Think about where signals flow.');
    }
  };

  window.BrainApp.handleTargetClick = function(anchorId) {
    return window.BrainApp.handleNeuronAnchor(anchorId);
  };

  window.BrainApp.fireNeuronSignal = function() {
    if (typeof BrainAudio !== 'undefined') BrainAudio.playNeuralZap();
    const spark = document.getElementById('axonSpark');
    if (!spark) return;

    spark.style.opacity = '1';
    let pos = 320;
    const interval = setInterval(() => {
      pos += 15;
      spark.setAttribute('cx', pos);
      if (pos >= 520) {
        clearInterval(interval);
        spark.style.opacity = '0';
        if (typeof BrainAudio !== 'undefined') BrainAudio.playTone(880, 'sine', 0.15);
        const readout = document.getElementById('neuronReadoutText');
        if (readout) readout.textContent = '⚡ Signal transmitted at 250 mph across the synapse gap!';
      }
    }, 20);
  };

  // =======================================================================
  // MISSION 3: SEND THE MESSAGE
  // =======================================================================
  function renderMission3(container) {
    const data = BRAIN_DATA.mission3_chain;

    container.innerHTML = 
      '<div class="bh-panel">' +
        '<div class="bh-panel-header">' +
          '<div class="bh-panel-title">⚡ HUMAN NEURON RELAY RACE</div>' +
          '<span class="bh-badge" id="m3Badge">CHAIN 1 OF 3</span>' +
        '</div>' +

        '<div style="text-align:center; padding:20px 0;">' +
          '<div style="font-size:0.85rem; color:var(--text-secondary); font-weight:800; text-transform:uppercase; letter-spacing:1px;">Target Neural Message:</div>' +
          '<div style="font-size:2rem; font-weight:900; color:var(--neon-gold); margin:8px 0;" id="m3TargetSentence">"DOG RUN FAST"</div>' +
        '</div>' +

        '<div style="display:flex; justify-content:center; gap:20px; margin:20px 0; flex-wrap:wrap;" id="m3NodesRow"></div>' +

        '<div style="background:rgba(15,23,42,0.85); border:1px solid var(--border-subtle); padding:20px; border-radius:var(--radius-md); text-align:center;">' +
          '<div style="font-size:0.9rem; font-weight:800; color:#38bdf8; margin-bottom:12px;">📦 TOUCH WORDS IN EXACT SEQUENCE:</div>' +
          '<div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;" id="m3PacketsRow"></div>' +
        '</div>' +

        '<div style="display:flex; justify-content:space-between; align-items:center; margin-top:24px;">' +
          '<button type="button" class="bh-btn-nav" onclick="window.BrainApp.resetM3Chain()">🔄 Reset Signal</button>' +
          '<button type="button" class="bh-btn-nav primary" id="btnM3Next" disabled onclick="window.BrainApp.nextMission()">Next Mission: Visualization ➔</button>' +
        '</div>' +
      '</div>';

    window.BrainApp.m3Data = {
      chainIdx: 0,
      chains: data.chains,
      currentSequence: []
    };

    window.BrainApp.loadM3Chain(0);
  }

  window.BrainApp.loadM3Chain = function(index) {
    const d = window.BrainApp.m3Data;
    d.chainIdx = index;
    d.currentSequence = [];
    const chain = d.chains[index];

    const badge = document.getElementById('m3Badge');
    if (badge) badge.textContent = 'CHAIN 0' + (index + 1) + ' OF 03 • ' + chain.speed;

    const tgt = document.getElementById('m3TargetSentence');
    if (tgt) tgt.textContent = '"' + chain.targetSentence + '"';

    const nodesRow = document.getElementById('m3NodesRow');
    if (nodesRow) {
      nodesRow.innerHTML = chain.nodes.map((n, i) => (
        '<div style="background:rgba(17,29,58,0.9); border:2px solid var(--border-subtle); border-radius:14px; padding:16px 20px; text-align:center; min-width:140px;" id="nodeBox_' + i + '">' +
          '<div style="font-size:2.2rem;">' + n.icon + '</div>' +
          '<div style="font-size:0.75rem; color:#94a3b8; font-weight:700; margin-top:4px;">' + n.role + '</div>' +
          '<div style="font-size:1.15rem; font-weight:900; color:var(--neon-cyan); margin-top:6px;" id="nodeWord_' + i + '">---</div>' +
        '</div>'
      )).join('');
    }

    const packetsRow = document.getElementById('m3PacketsRow');
    if (packetsRow) {
      const shuffled = [...chain.tokens].sort(() => Math.random() - 0.5);
      packetsRow.innerHTML = shuffled.map(tok => (
        '<button type="button" class="bh-btn-nav" style="font-size:1.2rem; padding:14px 28px; min-height:64px;" onclick="window.BrainApp.sendPacket(\'' + tok + '\', this)">' +
          '⚡ ' + tok +
        '</button>'
      )).join('');
    }

    if (typeof BrainAudio !== 'undefined') {
      BrainAudio.speak('Send message: ' + chain.targetSentence);
    }
  };

  window.BrainApp.sendPacket = function(word, btn) {
    const d = window.BrainApp.m3Data;
    const chain = d.chains[d.chainIdx];
    const expected = chain.tokens[d.currentSequence.length];

    if (word === expected) {
      btn.disabled = true;
      btn.style.opacity = '0.3';
      const step = d.currentSequence.length;
      d.currentSequence.push(word);

      const nodeWord = document.getElementById('nodeWord_' + step);
      if (nodeWord) nodeWord.textContent = word;
      const nodeBox = document.getElementById('nodeBox_' + step);
      if (nodeBox) {
        nodeBox.style.borderColor = 'var(--neon-cyan)';
        nodeBox.style.boxShadow = '0 0 20px rgba(0,240,255,0.4)';
      }

      if (typeof BrainAudio !== 'undefined') {
        BrainAudio.playNeuralZap();
        BrainAudio.speak(word);
      }

      if (d.currentSequence.length === chain.tokens.length) {
        if (typeof BrainAudio !== 'undefined') BrainAudio.playSuccess();
        showToast('⚡ Signal Delivered at High Speed! (' + chain.speed + ')');

        setTimeout(() => {
          if (d.chainIdx < d.chains.length - 1) {
            window.BrainApp.loadM3Chain(d.chainIdx + 1);
          } else {
            completeMission(3, 35);
            const nextBtn = document.getElementById('btnM3Next');
            if (nextBtn) nextBtn.disabled = false;
          }
        }, 1500);
      }
    } else {
      if (typeof BrainAudio !== 'undefined') BrainAudio.playError();
      showToast('❌ Sequence mismatch! Expected: "' + expected + '"');
    }
  };

  window.BrainApp.resetM3Chain = function() {
    window.BrainApp.loadM3Chain(window.BrainApp.m3Data.chainIdx);
  };

  // =======================================================================
  // MISSION 4: VISUALIZE THE INVISIBLE
  // =======================================================================
  function renderMission4(container) {
    container.innerHTML = 
      '<div class="bh-layout-grid">' +
        '<div class="bh-panel">' +
          '<div class="bh-panel-header">' +
            '<div class="bh-panel-title">👁️ CLOSE YOUR EYES &amp; VISUALIZE</div>' +
            '<span class="bh-badge">MENTAL PICTURE</span>' +
          '</div>' +

          '<div style="text-align:center; padding:20px 0;">' +
            '<p style="font-size:1.15rem; color:#cbd5e1; line-height:1.6; max-width:500px; margin:0 auto 20px auto;">' +
              '"Imagine a <strong>blue house</strong> with a <strong>silver triangular roof</strong>. It has <strong>two round yellow windows</strong>, and a <strong>golden lightning rod</strong> on the chimney!"' +
            '</p>' +
            '<button type="button" class="bh-btn-nav primary" onclick="window.BrainApp.playM4Story()">' +
              '🔊 Listen &amp; Visualize' +
            '</button>' +
          '</div>' +

          '<div style="background:rgba(15,23,42,0.8); border-left:4px solid var(--neon-cyan); padding:14px 18px; border-radius:8px;">' +
            '<strong style="color:#ffffff;">📖 Textbook Definition (Unit 1):</strong>' +
            '<p style="font-size:0.85rem; color:#94a3b8; margin-top:4px;">' +
              '<em>"To visualize means making a picture in your mind of something you cannot see with your eyes."</em>' +
            '</p>' +
          '</div>' +
        '</div>' +

        '<div class="bh-panel">' +
          '<div class="bh-panel-header">' +
            '<div class="bh-panel-title">🔍 SPOT THE 4 DIFFERENCES</div>' +
            '<span class="bh-badge" id="m4DiffBadge">FOUND: 0 / 4</span>' +
          '</div>' +

          '<div style="text-align:center;">' +
            '<svg viewBox="0 0 500 320" style="width:100%; max-width:480px; border-radius:12px; border:2px solid var(--border-subtle); background:#060f22;">' +
              '<!-- Sky & Stars -->' +
              '<rect width="500" height="320" fill="#07132a"/>' +
              '<circle cx="430" cy="60" r="35" fill="#fde047" opacity="0.85"/>' +

              '<!-- Ground -->' +
              '<rect y="250" width="500" height="70" fill="#0f3324"/>' +

              '<!-- House Body (Blue) -->' +
              '<rect x="150" y="120" width="200" height="130" fill="#1e3a8a" stroke="#60a5fa" stroke-width="4"/>' +

              '<!-- Diff 1: Red Roof instead of Silver -->' +
              '<polygon id="diff-roof" points="130,120 250,40 370,120" fill="#dc2626" stroke="#f87171" stroke-width="3" style="cursor:pointer;" onclick="window.BrainApp.spotDiff(\'roof\')"/>' +

              '<!-- Chimney -->' +
              '<rect x="300" y="55" width="35" height="45" fill="#78350f"/>' +

              '<!-- Diff 2: Antenna instead of Golden Rod -->' +
              '<circle id="diff-antenna" cx="317" cy="42" r="14" fill="#c084fc" stroke="#fff" stroke-width="2" style="cursor:pointer;" onclick="window.BrainApp.spotDiff(\'antenna\')"/>' +

              '<!-- Diff 3: Square window instead of round -->' +
              '<rect id="diff-window" x="175" y="150" width="45" height="45" fill="#facc15" stroke="#ffffff" stroke-width="3" style="cursor:pointer;" onclick="window.BrainApp.spotDiff(\'window\')"/>' +

              '<!-- Correct round window -->' +
              '<circle cx="280" cy="170" r="22" fill="#facc15" stroke="#ffffff" stroke-width="3"/>' +

              '<!-- Diff 4: Door red alarm skull -->' +
              '<rect x="225" y="195" width="50" height="55" fill="#334155"/>' +
              '<circle id="diff-door" cx="250" cy="220" r="12" fill="#ef4444" stroke="#fff" stroke-width="2" style="cursor:pointer;" onclick="window.BrainApp.spotDiff(\'door\')"/>' +
            '</svg>' +
          '</div>' +

          '<div style="display:flex; justify-content:flex-end; margin-top:16px;">' +
            '<button type="button" class="bh-btn-nav primary" id="btnM4Next" disabled onclick="window.BrainApp.nextMission()">' +
              'Next Mission: Creativity ➔' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    window.BrainApp.m4Data = {
      found: new Set(),
      items: {
        roof: 'Roof is Red instead of Silver!',
        antenna: 'Antenna on chimney instead of Golden Rod!',
        window: 'Left window is Square instead of Round!',
        door: 'Door has red alarm symbol!'
      }
    };
  }

  window.BrainApp.playM4Story = function() {
    if (typeof BrainAudio !== 'undefined') {
      BrainAudio.playChime(4);
      BrainAudio.speak('Close your eyes and visualize. Imagine a blue house with a silver triangular roof. It has two round yellow windows, and a golden lightning rod on the chimney!');
    }
  };

  window.BrainApp.spotDiff = function(id) {
    const d = window.BrainApp.m4Data;
    if (d.found.has(id)) return;

    d.found.add(id);
    if (typeof BrainAudio !== 'undefined') {
      BrainAudio.playSuccess();
      BrainAudio.speak(d.items[id]);
    }

    const elem = document.getElementById('diff-' + id);
    if (elem) {
      elem.style.stroke = '#00f0ff';
      elem.style.strokeWidth = '6';
    }

    const badge = document.getElementById('m4DiffBadge');
    if (badge) badge.textContent = 'FOUND: ' + d.found.size + ' / 4';
    showToast('✓ ' + d.items[id]);

    if (d.found.size >= 4) {
      completeMission(4, 35);
      const nextBtn = document.getElementById('btnM4Next');
      if (nextBtn) nextBtn.disabled = false;
    }
  };

  window.BrainApp.spotDifference = function(id) {
    return window.BrainApp.spotDiff(id);
  };

  // =======================================================================
  // MISSION 5: UNLOCK CREATIVITY (Drawing Canvas)
  // =======================================================================
  function renderMission5(container) {
    container.innerHTML = 
      '<div class="bh-layout-grid">' +
        '<div class="bh-panel">' +
          '<div class="bh-panel-header">' +
            '<div class="bh-panel-title">🎨 THE INVISIBLE PICTURE CANVAS</div>' +
            '<button type="button" class="bh-btn-hud" onclick="window.BrainApp.clearCanvas()">🗑️ Clear</button>' +
          '</div>' +

          '<div style="text-align:center;">' +
            '<canvas id="creativeCanvas" width="520" height="320" style="border:2px solid var(--border-subtle); border-radius:12px; background:#060d1f; touch-action:none;"></canvas>' +
          '</div>' +

          '<div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px; flex-wrap:wrap; gap:10px;">' +
            '<div style="display:flex; gap:8px;">' +
              '<button type="button" style="width:36px; height:36px; border-radius:50%; background:#00f0ff; border:2px solid #fff;" onclick="window.BrainApp.setCanvasColor(\'#00f0ff\')"></button>' +
              '<button type="button" style="width:36px; height:36px; border-radius:50%; background:#ff2d87; border:2px solid #fff;" onclick="window.BrainApp.setCanvasColor(\'#ff2d87\')"></button>' +
              '<button type="button" style="width:36px; height:36px; border-radius:50%; background:#fde047; border:2px solid #fff;" onclick="window.BrainApp.setCanvasColor(\'#fde047\')"></button>' +
              '<button type="button" style="width:36px; height:36px; border-radius:50%; background:#10b981; border:2px solid #fff;" onclick="window.BrainApp.setCanvasColor(\'#10b981\')"></button>' +
              '<button type="button" style="width:36px; height:36px; border-radius:50%; background:#ffffff; border:2px solid #fff;" onclick="window.BrainApp.setCanvasColor(\'#ffffff\')"></button>' +
            '</div>' +

            '<button type="button" class="bh-btn-nav primary" onclick="window.BrainApp.compareBrains()">' +
              '🌟 Compare Brains!' +
            '</button>' +
          '</div>' +
        '</div>' +

        '<div class="bh-panel">' +
          '<div class="bh-panel-header">' +
            '<div class="bh-panel-title">🧠 DIFFERENT BRAINS, DIFFERENT IDEAS!</div>' +
            '<span class="bh-badge">CREATIVITY PRINCIPLE</span>' +
          '</div>' +

          '<div style="display:flex; flex-direction:column; gap:14px;" id="m5GalleryRow">' +
            '<div style="background:rgba(15,23,42,0.85); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:14px; display:flex; gap:14px; align-items:center;">' +
              '<span style="font-size:2.4rem;">🤖⚡</span>' +
              '<div>' +
                '<strong style="color:#fff;">Scientist Leo (Age 9):</strong>' +
                '<div style="font-size:0.85rem; color:#cbd5e1;">"A robot that charges by eating lightning bolts!"</div>' +
              '</div>' +
            '</div>' +
            '<div style="background:rgba(15,23,42,0.85); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:14px; display:flex; gap:14px; align-items:center;">' +
              '<span style="font-size:2.4rem;">🐙💡</span>' +
              '<div>' +
                '<strong style="color:#fff;">Scientist Maya (Age 10):</strong>' +
                '<div style="font-size:0.85rem; color:#cbd5e1;">"An octopus that types 100 story books every minute!"</div>' +
              '</div>' +
            '</div>' +
          '</div>' +

          '<div id="m5TakeawayBox" style="display:none; background:rgba(16,185,129,0.12); border-left:4px solid #10b981; padding:14px; border-radius:8px; margin-top:16px;">' +
            '<strong style="color:#34d399;">✨ Big Discovery (Unit 1):</strong>' +
            '<p style="font-size:0.85rem; color:#cbd5e1; margin-top:4px;">' +
              'Every human brain imagines completely different pictures from the same words. That is the superpower of creativity!' +
            '</p>' +
          '</div>' +

          '<div style="display:flex; justify-content:flex-end; margin-top:auto;">' +
            '<button type="button" class="bh-btn-nav primary" id="btnM5Next" disabled onclick="window.BrainApp.nextMission()">' +
              'Next Mission: Subject Portals ➔' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    setTimeout(initCanvasLogic, 50);
  }

  let canvasCtx = null;
  let isPainting = false;
  let paintColor = '#00f0ff';

  function initCanvasLogic() {
    const cvs = document.getElementById('creativeCanvas');
    if (!cvs || !cvs.getContext) return;
    canvasCtx = cvs.getContext('2d');
    canvasCtx.fillStyle = '#060d1f';
    canvasCtx.fillRect(0, 0, cvs.width, cvs.height);

    function getCoords(e) {
      const rect = cvs.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (cx - rect.left) * (cvs.width / rect.width),
        y: (cy - rect.top) * (cvs.height / rect.height)
      };
    }

    function start(e) {
      e.preventDefault();
      isPainting = true;
      const pos = getCoords(e);
      canvasCtx.beginPath();
      canvasCtx.moveTo(pos.x, pos.y);
    }
    function move(e) {
      if (!isPainting) return;
      e.preventDefault();
      const pos = getCoords(e);
      canvasCtx.lineTo(pos.x, pos.y);
      canvasCtx.strokeStyle = paintColor;
      canvasCtx.lineWidth = 6;
      canvasCtx.lineCap = 'round';
      canvasCtx.stroke();
    }
    function stop() { isPainting = false; }

    cvs.addEventListener('mousedown', start);
    cvs.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);
    cvs.addEventListener('touchstart', start, { passive: false });
    cvs.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', stop);
  }

  window.BrainApp.setCanvasColor = function(c) { paintColor = c; };
  window.BrainApp.clearCanvas = function() {
    const cvs = document.getElementById('creativeCanvas');
    if (cvs && canvasCtx) {
      canvasCtx.fillRect(0, 0, cvs.width, cvs.height);
      if (typeof BrainAudio !== 'undefined') BrainAudio.playTone(300, 'sine', 0.1);
    }
  };
  window.BrainApp.compareBrains = function() {
    if (typeof BrainAudio !== 'undefined') {
      BrainAudio.playSuccess();
      BrainAudio.speak('Look how unique everyone draws the same idea! Creativity is awesome!');
    }
    const box = document.getElementById('m5TakeawayBox');
    if (box) box.style.display = 'block';
    completeMission(5, 30);
    const nextBtn = document.getElementById('btnM5Next');
    if (nextBtn) nextBtn.disabled = false;
  };

  // =======================================================================
  // MISSION 6: BRAIN VS BRAIN (Subject Portals)
  // =======================================================================
  function renderMission6(container) {
    const data = BRAIN_DATA.mission6_subjects;

    container.innerHTML = 
      '<div class="bh-layout-grid">' +
        '<div class="bh-panel">' +
          '<div class="bh-panel-header">' +
            '<div class="bh-panel-title">🏫 4 SUBJECT PORTALS</div>' +
            '<span class="bh-badge" id="m6Badge">TESTED: 1 / 4</span>' +
          '</div>' +

          '<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">' +
            data.subjects.map((sub, i) => (
              '<button type="button" class="bh-btn-sense-action ' + (i === 0 ? 'active' : '') + '" id="portalBtn_' + sub.id + '" onclick="window.BrainApp.selectSubject(\'' + sub.id + '\')">' +
                '<span class="bh-sense-icon">' + sub.icon + '</span>' +
                '<div class="bh-sense-info">' +
                  '<div class="bh-sense-name">' + sub.name + '</div>' +
                  '<div class="bh-sense-lobe">' + sub.activeLobe + '</div>' +
                '</div>' +
              '</button>'
            )).join('') +
          '</div>' +

          '<div id="m6SubjectChallengeBox" style="background:rgba(15,23,42,0.9); border:1px solid var(--border-subtle); padding:16px; border-radius:12px; margin-top:16px;"></div>' +
        '</div>' +

        '<div class="bh-panel">' +
          '<div class="bh-panel-header">' +
            '<div class="bh-panel-title">🔥 ACTIVE REGION HEATMAP</div>' +
            '<span class="bh-badge" id="m6HeatLobeName">FRONTAL MOTOR</span>' +
          '</div>' +

          '<div style="text-align:center;">' +
            '<svg viewBox="0 0 400 280" style="width:100%; max-width:400px;">' +
              '<path d="M 90 150 C 80 100, 110 50, 190 40 C 270 30, 330 80, 340 140 C 350 190, 310 240, 250 250 C 200 260, 180 230, 150 240 C 110 250, 80 190, 90 150 Z" fill="#0c1630" stroke="#38bdf8" stroke-width="3"/>' +
              '<circle id="m6HeatDot" cx="160" cy="110" r="45" fill="#f59e0b" opacity="0.8"/>' +
            '</svg>' +
          '</div>' +

          '<div id="m6ScienceDesc" style="font-size:0.9rem; color:#cbd5e1; line-height:1.5;"></div>' +

          '<div style="display:flex; justify-content:flex-end; margin-top:auto;">' +
            '<button type="button" class="bh-btn-nav primary" id="btnM6Next" disabled onclick="window.BrainApp.nextMission()">' +
              'Next Mission: Save the Brain ➔' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    window.BrainApp.m6Data = {
      tested: new Set(['pe']),
      subjects: data.subjects
    };

    window.BrainApp.selectSubject('pe');
  }

  window.BrainApp.selectSubject = function(id) {
    const d = window.BrainApp.m6Data;
    d.tested.add(id);

    document.querySelectorAll('[id^="portalBtn_"]').forEach(b => {
      b.classList.toggle('active', b.id === 'portalBtn_' + id);
    });

    const sub = d.subjects.find(s => s.id === id);
    if (!sub) return;

    if (typeof BrainAudio !== 'undefined') {
      BrainAudio.playTone(550, 'sine', 0.1);
      BrainAudio.speak(sub.name + '. ' + sub.description);
    }

    const heatName = document.getElementById('m6HeatLobeName');
    if (heatName) heatName.textContent = sub.activeLobe.toUpperCase();

    const desc = document.getElementById('m6ScienceDesc');
    if (desc) {
      desc.innerHTML = 
        '<strong>' + sub.icon + ' ' + sub.name + ':</strong> ' + sub.description +
        '<div style="color:var(--neon-cyan); margin-top:4px;">Pathway: ' + sub.pathway + '</div>';
    }

    const dot = document.getElementById('m6HeatDot');
    if (dot) {
      if (id === 'pe') { dot.setAttribute('cx', 160); dot.setAttribute('cy', 100); dot.setAttribute('fill', '#ef4444'); }
      else if (id === 'music') { dot.setAttribute('cx', 200); dot.setAttribute('cy', 170); dot.setAttribute('fill', '#38bdf8'); }
      else if (id === 'math') { dot.setAttribute('cx', 230); dot.setAttribute('cy', 105); dot.setAttribute('fill', '#fbbf24'); }
      else if (id === 'reading') { dot.setAttribute('cx', 270); dot.setAttribute('cy', 150); dot.setAttribute('fill', '#10b981'); }
    }

    const challenge = document.getElementById('m6SubjectChallengeBox');
    if (challenge) {
      if (id === 'pe') {
        challenge.innerHTML = '<p style="color:#fff; font-weight:800;">Tap the reflex target!</p><button class="bh-btn-nav primary" onclick="if(typeof BrainAudio!==\'undefined\')BrainAudio.playSuccess(); showToast(\'Reflex recorded!\')">🔴 Reflex 1</button>';
      } else if (id === 'music') {
        challenge.innerHTML = '<p style="color:#fff; font-weight:800;">Listen to frequency tones:</p><button class="bh-btn-nav" onclick="if(typeof BrainAudio!==\'undefined\')BrainAudio.playTone(440,\'sine\',0.3)">🎵 Play 440 Hz</button>';
      } else if (id === 'math') {
        challenge.innerHTML = '<p style="color:#fff; font-weight:800;">Mental Math: 8 + 7 = ?</p><button class="bh-btn-nav primary" onclick="if(typeof BrainAudio!==\'undefined\')BrainAudio.playSuccess(); showToast(\'Correct: 15!\')">15</button>';
      } else if (id === 'reading') {
        challenge.innerHTML = '<p style="color:#fff; font-weight:800;">Unscramble: B-R-A-I-N</p><button class="bh-btn-nav primary" onclick="if(typeof BrainAudio!==\'undefined\')BrainAudio.playSuccess(); showToast(\'BRAIN!\')">✨ Unscramble</button>';
      }
    }

    const badge = document.getElementById('m6Badge');
    if (badge) badge.textContent = 'TESTED: ' + d.tested.size + ' / 4';

    if (d.tested.size >= 4) {
      completeMission(6, 30);
      const nextBtn = document.getElementById('btnM6Next');
      if (nextBtn) nextBtn.disabled = false;
    }
  };

  // =======================================================================
  // MISSION 7: SAVE THE BRAIN (Energy Core)
  // =======================================================================
  function renderMission7(container) {
    const data = BRAIN_DATA.mission7_habits;

    container.innerHTML = 
      '<div class="bh-layout-grid">' +
        '<div class="bh-panel">' +
          '<div class="bh-panel-header">' +
            '<div class="bh-panel-title">🔋 BRAIN ENERGY CORE</div>' +
            '<span class="bh-badge" id="m7ChargeBadge">CHARGE: 20%</span>' +
          '</div>' +

          '<div style="text-align:center; padding:20px 0;">' +
            '<div style="width:120px; height:240px; border:4px solid var(--border-bright); border-radius:24px; margin:0 auto; background:rgba(0,0,0,0.5); position:relative; overflow:hidden;">' +
              '<div id="m7Liquid" style="position:absolute; bottom:0; left:0; width:100%; height:20%; background:linear-gradient(180deg, #00f0ff, #0284c7); transition:height 0.4s ease;"></div>' +
            '</div>' +
            '<div style="font-size:1.1rem; font-weight:900; color:#34d399; margin-top:14px;" id="m7BpmText">💓 50 BPM (LOW POWER)</div>' +
          '</div>' +
        '</div>' +

        '<div class="bh-panel">' +
          '<div class="bh-panel-header">' +
            '<div class="bh-panel-title">🍎 SUPER-FUELS VS BRAIN DRAINS</div>' +
            '<span class="bh-badge">HABIT MATRIX</span>' +
          '</div>' +

          '<div style="display:flex; flex-direction:column; gap:8px;">' +
            data.habits.map((h, i) => (
              '<button type="button" class="bh-part-card" id="habitCard_' + i + '" onclick="window.BrainApp.applyHabit(' + i + ')">' +
                '<div style="display:flex; justify-content:space-between; align-items:center;">' +
                  '<strong style="color:#fff;">' + h.icon + ' ' + h.name + '</strong>' +
                  '<span style="font-size:0.8rem; font-weight:800; color:' + (h.isHealthy ? '#34d399' : '#ef4444') + ';">' +
                    (h.isHealthy ? '+20% Power' : '-10% Drain') +
                  '</span>' +
                '</div>' +
                '<div style="font-size:0.8rem; color:#94a3b8; margin-top:2px;">' + h.reason + '</div>' +
              '</button>'
            )).join('') +
          '</div>' +

          '<div style="display:flex; justify-content:flex-end; margin-top:auto;">' +
            '<button type="button" class="bh-btn-nav primary" id="btnM7Next" disabled onclick="window.BrainApp.nextMission()">' +
              'Next Mission: Graduation ➔' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    window.BrainApp.m7Data = {
      energy: 20,
      applied: new Set(),
      habits: data.habits
    };
  }

  window.BrainApp.applyHabit = function(idx) {
    const d = window.BrainApp.m7Data;
    const h = d.habits[idx];
    const card = document.getElementById('habitCard_' + idx);

    if (h.isHealthy) {
      if (d.applied.has(idx)) return;
      d.applied.add(idx);
      d.energy = Math.min(100, d.energy + 20);

      if (typeof BrainAudio !== 'undefined') {
        BrainAudio.playSuccess();
        BrainAudio.speak(h.name + '! ' + h.reason);
      }
      if (card) card.classList.add('placed');
      showToast('✅ +20% Energy: ' + h.reason);
    } else {
      d.energy = Math.max(10, d.energy - 10);
      if (typeof BrainAudio !== 'undefined') {
        BrainAudio.playError();
        BrainAudio.speak('Watch out! ' + h.reason);
      }
      showToast('⚠️ Brain Drain! ' + h.reason);
    }

    state.energy = d.energy;
    updateHeaderStats();

    const liquid = document.getElementById('m7Liquid');
    if (liquid) liquid.style.height = d.energy + '%';

    const chargeBadge = document.getElementById('m7ChargeBadge');
    if (chargeBadge) chargeBadge.textContent = 'CHARGE: ' + d.energy + '%';

    const bpm = document.getElementById('m7BpmText');
    if (bpm) {
      bpm.textContent = d.energy >= 80 ? '💓 85 BPM (MAX POWER!)' : '💓 65 BPM (CHARGING)';
    }

    if (d.energy >= 100) {
      completeMission(7, 30);
      const nextBtn = document.getElementById('btnM7Next');
      if (nextBtn) nextBtn.disabled = false;
    }
  };

  // =======================================================================
  // MISSION 8: BECOME A BRAIN SCIENTIST (Diploma)
  // =======================================================================
  function renderMission8(container) {
    container.innerHTML = 
      '<div class="bh-panel" style="max-width:850px; margin:0 auto;">' +
        '<div class="bh-panel-header">' +
          '<div class="bh-panel-title">🎓 GRADUATION: CERTIFIED BRAIN SCIENTIST</div>' +
          '<span class="bh-badge" style="background:#f59e0b; color:#050914; font-weight:900;">ACADEMY HONORS</span>' +
        '</div>' +

        '<div style="background:rgba(15,23,42,0.85); border:1px solid var(--border-subtle); padding:20px; border-radius:14px; font-size:1.1rem; line-height:2.2;">' +
          'Complete the Discovery Statement:<br>' +
          '"My cerebrum has billions of ' +
          '<select id="cloze1" style="background:#1e3a8a; color:#fff; font-weight:900; padding:4px 10px; border-radius:6px; font-size:1rem;" onchange="window.BrainApp.checkCloze()">' +
            '<option value="">--choose--</option>' +
            '<option value="neurons">neurons</option>' +
            '<option value="bones">bones</option>' +
          '</select>. ' +
          'When I practice and learn, my neurons make new ' +
          '<select id="cloze2" style="background:#1e3a8a; color:#fff; font-weight:900; padding:4px 10px; border-radius:6px; font-size:1rem;" onchange="window.BrainApp.checkCloze()">' +
            '<option value="">--choose--</option>' +
            '<option value="connections">connections</option>' +
            '<option value="pencils">pencils</option>' +
          '</select>. ' +
          'Signals travel ' +
          '<select id="cloze3" style="background:#1e3a8a; color:#fff; font-weight:900; padding:4px 10px; border-radius:6px; font-size:1rem;" onchange="window.BrainApp.checkCloze()">' +
            '<option value="">--choose--</option>' +
            '<option value="faster">faster</option>' +
            '<option value="slower">slower</option>' +
          '</select> ' +
          'with practice. I can ' +
          '<select id="cloze4" style="background:#1e3a8a; color:#fff; font-weight:900; padding:4px 10px; border-radius:6px; font-size:1rem;" onchange="window.BrainApp.checkCloze()">' +
            '<option value="">--choose--</option>' +
            '<option value="visualize">visualize</option>' +
            '<option value="forget">forget</option>' +
          '</select> ' +
          'new ideas. I am a Certified Brain Hacker!"' +
        '</div>' +

        '<div id="diplomaCard" style="display:none; margin-top:24px; border:4px double #f59e0b; padding:28px; border-radius:16px; background:#0b1428; text-align:center;">' +
          '<div style="font-size:3rem;">🏆</div>' +
          '<h3 style="font-size:1.8rem; font-weight:900; color:#fde047; letter-spacing:1px; margin-top:6px;">CERTIFIED BRAIN SCIENTIST</h3>' +
          '<div style="font-size:0.85rem; color:#94a3b8; font-weight:800;">ENGLISH ADVENTURE ACADEMY • SCIENCE DIVISION</div>' +
          '<div style="font-size:1.5rem; font-weight:900; color:#ffffff; margin:16px 0;" id="diplomaName">' + state.studentName + '</div>' +
          '<p style="font-size:0.95rem; color:#cbd5e1; max-width:600px; margin:0 auto 20px auto;">' +
            'Has successfully decoded the cerebrum, assembled biological neurons, accelerated message chains, and unlocked elite scientific creativity!' +
          '</p>' +
          '<div style="display:flex; justify-content:center; gap:12px;">' +
            '<button class="bh-btn-nav primary" onclick="window.print()">🖨️ Print Certificate</button>' +
            '<a href="../index.html#library" class="bh-btn-nav" style="text-decoration:none;">🏛️ Return to Library</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    if (typeof BrainAudio !== 'undefined') {
      BrainAudio.playSuccess();
      BrainAudio.speak('Mission 8! Complete your scientific statement to claim your honors diploma!');
    }
  }

  window.BrainApp.checkCloze = function() {
    const c1 = document.getElementById('cloze1')?.value;
    const c2 = document.getElementById('cloze2')?.value;
    const c3 = document.getElementById('cloze3')?.value;
    const c4 = document.getElementById('cloze4')?.value;

    if (c1 === 'neurons' && c2 === 'connections' && c3 === 'faster' && c4 === 'visualize') {
      if (typeof BrainAudio !== 'undefined') BrainAudio.playVictoryFanfare();
      const dip = document.getElementById('diplomaCard');
      if (dip) dip.style.display = 'block';
      completeMission(8, 50);
      showToast('🎉 CONGRATULATIONS! You are now an official Brain Scientist!');
    }
  };

  // --- ACTIONS & CONTROLS ---
  window.BrainApp.startMissions = function() {
    loadMission(1);
  };
  window.BrainApp.showHero = function() {
    state.isHeroActive = true;
    if (DOM.stageContainer) DOM.stageContainer.style.display = 'none';
    if (DOM.heroScreen) DOM.heroScreen.style.display = 'flex';
    renderTimeline();
    if (typeof window.scrollTo === 'function') window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  window.BrainApp.prevMission = function() {
    if (state.currentMission > 1) loadMission(state.currentMission - 1);
  };
  window.BrainApp.nextMission = function() {
    if (state.currentMission < state.totalMissions) loadMission(state.currentMission + 1);
  };
  window.BrainApp.loadMission = loadMission;

  window.BrainApp.selectTeam = function(key) {
    state.selectedTeam = key;
    renderTeams();
    showToast('Active Team set to: ' + state.teams[key].name);
  };

  window.BrainApp.addTeamScore = function(key, delta, btnElem) {
    state.teams[key].score = Math.max(0, state.teams[key].score + delta);
    if (typeof BrainAudio !== 'undefined') BrainAudio.playTone(delta > 0 ? 700 : 260, 'sine', 0.1);
    renderTeams();

    if (delta > 0 && btnElem) {
      const bubble = document.createElement('div');
      bubble.className = 'float-xp-bubble';
      bubble.textContent = '+' + delta + ' XP';
      btnElem.style.position = 'relative';
      btnElem.appendChild(bubble);
      setTimeout(() => bubble.remove(), 1000);
    }
  };

  window.BrainApp.toggleSound = function() {
    state.soundEnabled = !state.soundEnabled;
    if (DOM.soundBtn) {
      DOM.soundBtn.innerHTML = state.soundEnabled ? '🔊 <span>Sound: ON</span>' : '🔇 <span>Sound: OFF</span>';
    }
    if (typeof BrainAudio !== 'undefined' && BrainAudio.toggleMute) {
      BrainAudio.toggleMute();
    }
  };

  window.BrainApp.openDossierModal = function() {
    const dCount = document.getElementById('dossierMissionsCount');
    if (dCount) dCount.textContent = Object.values(state.missionProgress).filter(p => p.completed).length + ' / 8';
    const dXp = document.getElementById('dossierXpDisplay');
    if (dXp) dXp.textContent = state.score + ' XP';
    if (DOM.dossierModal) DOM.dossierModal.classList.add('active');
  };

  window.BrainApp.openTeacherModal = function() {
    if (DOM.teacherModal) DOM.teacherModal.classList.add('active');
  };

  window.BrainApp.closeModals = function() {
    document.querySelectorAll('.bh-modal-overlay').forEach(m => m.classList.remove('active'));
  };

  window.BrainApp.autoSolveCurrentMission = function() {
    completeMission(state.currentMission, 40);
    window.BrainApp.closeModals();
    showToast('✨ Mission 0' + state.currentMission + ' auto-completed for classroom review!');
  };

  window.BrainApp.speakMissionIntro = function() {
    const m = BRAIN_DATA.missions.find(x => x.id === state.currentMission);
    if (m && typeof BrainAudio !== 'undefined') {
      BrainAudio.speak('Mission ' + m.id + ': ' + m.title + '. ' + m.subtitle);
    }
  };

  function showToast(msg) {
    if (!DOM.toast) return;
    DOM.toast.textContent = msg;
    DOM.toast.classList.add('visible');
    setTimeout(() => {
      DOM.toast.classList.remove('visible');
    }, 3200);
  }

})(typeof window !== 'undefined' ? window : global);
