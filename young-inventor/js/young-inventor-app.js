/**
 * YOUNG INVENTORS — APPLICATION CONTROLLER
 * 8 Missions: Discover → Problem → Purpose → Blueprint → Test → Improve → Present → Battle
 * Grade 4 A1+ | Global Readings 3 Unit 1: Inventions
 * English Adventure Academy
 */

(function(root) {
  'use strict';

  // Get data and audio from window
  const D = root.YOUNG_INVENTOR_DATA || {};
  const Audio = root.youngInventorAudio || null;

  // ============================================================
  // GLOBAL PUBLIC API (accessible from HTML onclick handlers)
  // ============================================================
  const YoungInventors = {};
  root.YoungInventors = YoungInventors;

  // ============================================================
  // STATE
  // ============================================================
  const state = {
    currentMission: 0,          // 0 = hero, 1-8 = missions
    soundEnabled: true,
    completedMissions: new Set(),
    xp: 0,

    // Team scores
    teams: {
      brain:   { name: '🧠 Brain',   pts: 0 },
      neuron:  { name: '⚡ Neuron',  pts: 0 },
      genius:  { name: '💡 Genius',  pts: 0 },
      explorer:{ name: '🚀 Explorer', pts: 0 }
    },

    // M1: Discover
    discoveredInventions: new Set(),
    selectedInvention: null,

    // M2: Problem matching
    currentProblemRound: 0,
    problemScore: 0,
    problemAnswered: false,

    // M3: Purpose (TO + VERB)
    currentSentenceIdx: 0,
    sentenceScore: 0,
    chosenBuilder: [],
    builderTarget: null,

    // M4: Blueprint
    selectedDesign: null,    // 'dart' | 'glider' | 'delta'
    selectedParts: new Set(),
    selectedChallenge: 'airplane', // 'airplane' | 'pinwheel'

    // M5: Test
    airplaneChoice: null,
    prediction: '',
    test1Result: '',
    test2Result: '',
    pinwheelPrediction: '',
    pinwheelTest1: '',
    pinwheelTest2: '',

    // M6: Improve
    selectedProblem: null,
    selectedImprovements: new Set(),
    improveChallenge: 'airplane',

    // M7: Present
    rubric: { English: 5, Creativity: 4, ProblemSolving: 3, Testing: 3, Improvement: 3, Teamwork: 2 },
    presentationDone: false,

    // M8: Battle
    battleScores: { brain: 0, neuron: 0, genius: 0, explorer: 0 },
    answeredTiles: new Set(),
    currentBattleQuestion: null,
    selectedBattleTeam: 'brain',
    battleAnswered: false
  };

  // ============================================================
  // DOM CACHE
  // ============================================================
  let DOM = {};

  function cacheDOM() {
    DOM = {
      heroScreen:      document.getElementById('yiHeroScreen'),
      stageContainer:  document.getElementById('yiStageContainer'),
      missionContent:  document.getElementById('yiMissionContentStage'),
      missionTitle:    document.getElementById('yiCurrentMissionTitle'),
      missionDesc:     document.getElementById('yiCurrentMissionDesc'),
      missionBadge:    document.getElementById('yiCurrentMissionBadge'),
      xpDisplay:       document.getElementById('yiXpDisplay'),
      progressDisplay: document.getElementById('yiProgressDisplay'),
      progressFill:    document.getElementById('yiOverallProgress'),
      teamsStrip:      document.getElementById('yiTeamsStrip'),
      timeline:        document.getElementById('yiMissionTimeline'),
      heroGrid:        document.getElementById('yiHeroMissionsGrid'),
      btnPrev:         document.getElementById('yiBtnPrev'),
      btnNext:         document.getElementById('yiBtnNext'),
      btnSound:        document.getElementById('yiSoundBtn'),
      toast:           document.getElementById('yiToast'),
      teacherModal:    document.getElementById('yiTeacherModal'),
      dossierModal:    document.getElementById('yiDossierModal')
    };
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================
  function init() {
    cacheDOM();
    renderTeamsStrip();
    renderTimeline();
    renderHeroGrid();
    YoungInventors.showHero();
    bindKeyboard();
  }

  function bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.key === 'F1' || e.key === 't' || e.key === 'T') {
        openTeacherModal();
      } else if (e.key === 'Escape') {
        closeModals();
      } else if (e.key === 'ArrowRight') {
        nextMission();
      } else if (e.key === 'ArrowLeft') {
        prevMission();
      }
    });
  }

  // ============================================================
  // NAVIGATION
  // ============================================================
  YoungInventors.showHero = function() {
    state.currentMission = 0;
    if (DOM.heroScreen) DOM.heroScreen.style.display = 'flex';
    if (DOM.stageContainer) DOM.stageContainer.style.display = 'none';
    updateTimeline();
    updateHUD();
  };

  YoungInventors.startMissions = function() {
    playSound('click');
    loadMission(1);
  };

  YoungInventors.loadMission = function(num) {
    loadMission(num);
    closeModals();
  };

  function loadMission(num) {
    if (num < 1) num = 1;
    if (num > 8) {
      showCelebration();
      return;
    }

    state.currentMission = num;
    if (DOM.heroScreen) DOM.heroScreen.style.display = 'none';
    if (DOM.stageContainer) DOM.stageContainer.style.display = 'flex';

    updateHUD();
    updateTimeline();

    // Update stage header
    const mission = D.missions ? D.missions[num - 1] : { icon: '', title: 'Mission ' + num, subtitle: '' };
    if (DOM.missionBadge) DOM.missionBadge.textContent = `MISSION ${String(num).padStart(2, '0')} OF 08`;
    if (DOM.missionTitle) DOM.missionTitle.textContent = `${mission.icon} ${String(num).padStart(2, '0')}. ${mission.title}`;
    if (DOM.missionDesc) DOM.missionDesc.textContent = mission.subtitle;

    // Prev/Next buttons
    if (DOM.btnPrev) DOM.btnPrev.disabled = (num <= 1);
    if (DOM.btnNext) DOM.btnNext.textContent = num >= 8 ? '🏆 Final Battle!' : 'Next →';

    // Scroll top
    if (DOM.missionContent) DOM.missionContent.scrollTop = 0;

    // Render scene
    renderMission(num);
  }

  YoungInventors.nextMission = function() {
    const next = state.currentMission + 1;
    if (next > 8) {
      showCelebration();
    } else {
      playSound('click');
      loadMission(next);
    }
  };

  YoungInventors.prevMission = function() {
    if (state.currentMission > 1) {
      playSound('click');
      loadMission(state.currentMission - 1);
    } else {
      YoungInventors.showHero();
    }
  };

  YoungInventors.speakMissionIntro = function() {
    const mission = D.missions ? D.missions[state.currentMission - 1] : null;
    if (mission) speak(mission.title + '. ' + mission.subtitle);
  };

  // ============================================================
  // MISSION ROUTER
  // ============================================================
  function renderMission(num) {
    if (!DOM.missionContent) return;
    switch (num) {
      case 1: renderM1(); break;
      case 2: renderM2(); break;
      case 3: renderM3(); break;
      case 4: renderM4(); break;
      case 5: renderM5(); break;
      case 6: renderM6(); break;
      case 7: renderM7(); break;
      case 8: renderM8(); break;
    }
  }

  // ============================================================
  // MISSION 1: DISCOVER INVENTIONS
  // ============================================================
  function renderM1() {
    const d = D.mission1_discover || {};
    const inventions = d.inventions || [];

    DOM.missionContent.innerHTML = `
      <div class="yi-robo-guide">
        <div class="yi-robo-avatar">🤖</div>
        <div class="yi-robo-speech">
          <strong>Look around the Inventor Lab!</strong> Tap each invention to discover what problem it solved. Find all ${inventions.length} inventions to unlock Mission 2!
        </div>
      </div>

      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
        <h3 style="font-size:1.05rem; font-weight:800; color:var(--yi-amber);">🔍 THE INVENTOR LAB</h3>
        <span style="font-size:0.8rem; color:#94a3b8; font-weight:700;" id="m1DiscoveredCount">${state.discoveredInventions.size} / ${inventions.length} discovered</span>
      </div>

      <div class="yi-invention-grid" id="m1InventionGrid">
        ${inventions.map(inv => `
          <div class="yi-invention-card ${state.discoveredInventions.has(inv.id) ? 'discovered' : ''} ${state.selectedInvention === inv.id ? 'selected' : ''}"
               onclick="window.YoungInventors.selectInvention('${inv.id}')">
            <span class="yi-invention-icon">${inv.emoji}</span>
            <div class="yi-invention-name">${inv.name}</div>
            <div class="yi-invention-year">${inv.year || ''}</div>
            ${state.discoveredInventions.has(inv.id) ? '<div style="position:absolute;top:6px;right:8px;font-size:0.9rem;">✅</div>' : ''}
          </div>
        `).join('')}
      </div>

      <div id="m1InfoBox" style="display:${state.selectedInvention ? 'block' : 'none'};">
        ${state.selectedInvention ? renderInventionInfo(inventions.find(i => i.id === state.selectedInvention)) : ''}
      </div>

      <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:8px;">
        <button type="button" class="yi-full-width-btn" style="flex:1;" onclick="window.YoungInventors.nextMission()">
          ${state.discoveredInventions.size >= inventions.length ? '✅ All Found! Go to Mission 2 →' : '➔ Go to Mission 2: Find the Problem →'}
        </button>
      </div>
    `;
  }

  function renderInventionInfo(inv) {
    if (!inv) return '';
    return `
      <div class="yi-invention-info-box" style="margin-top:12px;">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
          <span style="font-size:2.5rem;">${inv.emoji}</span>
          <div>
            <div style="font-size:1.2rem; font-weight:900; color:#fff;">${inv.name}</div>
            <div style="font-size:0.78rem; color:#94a3b8; font-family:monospace;">${inv.inventor || ''} · ${inv.year || ''}</div>
          </div>
        </div>
        <div style="font-size:0.9rem; color:#e2e8f0; margin-bottom:10px; line-height:1.6;">${inv.description}</div>
        <div style="background:rgba(6,182,212,0.1); border:1.5px solid rgba(6,182,212,0.3); border-radius:8px; padding:10px 14px;">
          <span style="font-size:0.75rem; font-weight:800; color:#67e8f9; text-transform:uppercase; display:block; margin-bottom:4px;">🧩 Problem It Solved:</span>
          <span style="font-size:0.9rem; color:#e2e8f0;">${inv.problem}</span>
        </div>
        <button type="button" class="yi-btn-hud" style="margin-top:10px;" onclick="window.YoungInventors.speakInvention('${inv.id}')">
          🔊 Hear Description
        </button>
      </div>
    `;
  }

  YoungInventors.selectInvention = function(id) {
    state.selectedInvention = (state.selectedInvention === id) ? null : id;
    if (id) state.discoveredInventions.add(id);

    // Award XP for new discovery
    if (id) {
      awardXP(5, `Discovered: ${id}! +5 XP ⭐`);
      playSound('ding');
    }

    // Check if all discovered
    const inventions = (D.mission1_discover || {}).inventions || [];
    if (state.discoveredInventions.size >= inventions.length && !state.completedMissions.has(1)) {
      markMissionComplete(1, 20, '🔍 Mission 1 Complete! All inventions discovered!');
    }

    renderM1();
  };

  YoungInventors.speakInvention = function(id) {
    const inventions = (D.mission1_discover || {}).inventions || [];
    const inv = inventions.find(i => i.id === id);
    if (inv) speak(`${inv.name}. ${inv.description}. Problem it solved: ${inv.problem}`);
  };

  // ============================================================
  // MISSION 2: FIND THE PROBLEM
  // ============================================================
  function renderM2() {
    const d = D.mission2_problem || {};
    const rounds = d.rounds || [];
    const currentRound = rounds[state.currentProblemRound] || rounds[0];

    if (!currentRound) {
      DOM.missionContent.innerHTML = '<div style="padding:40px; text-align:center; color:#94a3b8;">No problem data found.</div>';
      return;
    }

    const allOptions = shuffle([currentRound.correctProblem, ...(currentRound.distractors || [])]);

    DOM.missionContent.innerHTML = `
      <div class="yi-robo-guide">
        <div class="yi-robo-avatar">🤖</div>
        <div class="yi-robo-speech">
          <strong>Every invention solves a PROBLEM!</strong> Match each invention to the problem it solved. Round ${state.currentProblemRound + 1} of ${rounds.length}.
        </div>
      </div>

      <div style="background:var(--yi-bg-card); border:2px solid rgba(245,158,11,0.3); border-radius:var(--yi-radius-lg); padding:24px; text-align:center; margin-bottom:16px;">
        <div style="font-size:0.8rem; font-weight:800; color:#94a3b8; margin-bottom:8px; text-transform:uppercase; font-family:monospace;">
          Round ${state.currentProblemRound + 1} of ${rounds.length} · Score: ${state.problemScore}/${state.currentProblemRound}
        </div>
        <div style="font-size:5rem; margin-bottom:12px;">${currentRound.emoji}</div>
        <h3 style="font-size:1.7rem; font-weight:900; color:#fff; margin-bottom:8px;">${currentRound.invention}</h3>
        <p style="font-size:1rem; color:var(--yi-amber); font-weight:700; margin-bottom:20px;">Which problem did this invention solve?</p>

        <div class="yi-options-list" id="m2Options">
          ${allOptions.map((opt, idx) => `
            <button type="button" class="yi-option-btn" id="m2opt${idx}" onclick="window.YoungInventors.answerProblem('${escapeJS(opt)}', '${escapeJS(currentRound.correctProblem)}', ${idx})">
              <span style="font-size:1.3rem; flex-shrink:0;">${idx === 0 ? '🅐' : idx === 1 ? '🅑' : '🅒'}</span>
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>

        ${state.problemAnswered ? `
          <div style="margin-top:14px;">
            <button type="button" class="yi-full-width-btn" onclick="window.YoungInventors.nextProblemRound()">
              ${state.currentProblemRound + 1 >= rounds.length ? '🏆 See Results!' : 'Next Problem →'}
            </button>
          </div>
        ` : ''}
      </div>

      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <button type="button" class="yi-btn-nav" onclick="window.YoungInventors.speakProblemClue('${escapeJS(currentRound.invention)}')">
          🔊 Hear Clue
        </button>
        <button type="button" class="yi-btn-nav primary" onclick="window.YoungInventors.nextMission()">
          ➔ Skip to Mission 3
        </button>
      </div>
    `;
    state.problemAnswered = false;
  }

  YoungInventors.answerProblem = function(chosen, correct, btnIdx) {
    if (state.problemAnswered) return;
    state.problemAnswered = true;

    const isCorrect = (chosen === correct);
    const buttons = DOM.missionContent.querySelectorAll('.yi-option-btn');
    buttons.forEach((btn, i) => {
      const btnOpt = btn.querySelector('span:last-child').textContent;
      if (btnOpt === correct) {
        btn.classList.add('correct');
      } else if (i === btnIdx && !isCorrect) {
        btn.classList.add('incorrect');
      }
      btn.disabled = true;
    });

    if (isCorrect) {
      state.problemScore++;
      playSound('success');
      showToast('✅ Correct! Great thinking!');
      awardXP(10, 'Correct Answer! +10 XP');
    } else {
      playSound('error');
      showToast(`❌ Not quite. The problem was: "${correct}"`);
    }

    // Show next button
    setTimeout(() => {
      const nextBtn = document.createElement('div');
      nextBtn.style.marginTop = '14px';
      nextBtn.innerHTML = `<button type="button" class="yi-full-width-btn" onclick="window.YoungInventors.nextProblemRound()">${(state.currentProblemRound + 1) >= ((D.mission2_problem || {}).rounds || []).length ? '🏆 See Results!' : 'Next Problem →'}</button>`;
      DOM.missionContent.querySelector('#m2Options').after(nextBtn);
    }, 600);
  };

  YoungInventors.nextProblemRound = function() {
    const rounds = (D.mission2_problem || {}).rounds || [];
    state.currentProblemRound++;
    state.problemAnswered = false;

    if (state.currentProblemRound >= rounds.length) {
      // All rounds done
      markMissionComplete(2, 20, `🧩 Mission 2 Complete! Score: ${state.problemScore}/${rounds.length}`);
      DOM.missionContent.innerHTML = `
        <div style="text-align:center; padding:30px;">
          <div style="font-size:4rem; margin-bottom:16px;">🧩✅</div>
          <h3 style="font-size:1.8rem; font-weight:900; color:#10b981; margin-bottom:8px;">PROBLEM SOLVER!</h3>
          <p style="color:#94a3b8; margin-bottom:20px;">You matched ${state.problemScore} out of ${rounds.length} problems correctly!</p>
          <button type="button" class="yi-full-width-btn" onclick="window.YoungInventors.loadMission(3)">
            🎯 Mission 3: Unlock the Purpose →
          </button>
        </div>
      `;
      state.currentProblemRound = 0;
      return;
    }

    renderM2();
  };

  YoungInventors.speakProblemClue = function(inventionName) {
    speak(`The invention is: ${inventionName}. Which problem did this invention solve?`);
  };

  // ============================================================
  // MISSION 3: UNLOCK THE PURPOSE (TO + VERB)
  // ============================================================
  function renderM3() {
    const d = D.mission3_purpose || {};
    const sentences = d.sentences || [];
    const current = sentences[state.currentSentenceIdx] || sentences[0];

    DOM.missionContent.innerHTML = `
      <div class="yi-robo-guide">
        <div class="yi-robo-avatar">🤖</div>
        <div class="yi-robo-speech">
          <strong>TO + VERB = PURPOSE!</strong> When we explain why something was invented, we use <strong style="color:var(--yi-amber);">TO</strong> + a verb.
          "People invented cars <strong style="color:var(--yi-amber);">TO</strong> travel quickly."
        </div>
      </div>

      <!-- Grammar Discovery Box -->
      <div style="background:linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.08)); border:2px solid rgba(245,158,11,0.45); border-radius:var(--yi-radius-lg); padding:20px; text-align:center; margin-bottom:16px;">
        <div style="font-size:0.8rem; font-weight:800; color:#94a3b8; text-transform:uppercase; margin-bottom:10px; letter-spacing:0.06em;">Grammar Structure</div>
        <div style="font-size:1.4rem; font-weight:900; color:#fff; margin-bottom:8px;">
          [SUBJECT] + <span style="color:var(--yi-amber);">invented</span> + [OBJECT] + <span style="color:var(--yi-cyan); font-size:1.6rem; font-weight:900;">TO</span> + [VERB]
        </div>
        <div style="font-size:0.9rem; color:#94a3b8; font-style:italic;">People invented cars <span style="color:var(--yi-amber); font-weight:800;">to</span> travel quickly.</div>
      </div>

      <!-- Sentence Fill-in -->
      <div style="background:var(--yi-bg-card); border:2px solid rgba(6,182,212,0.3); border-radius:var(--yi-radius-lg); padding:22px;">
        <div style="font-size:0.78rem; font-weight:800; color:#67e8f9; text-transform:uppercase; margin-bottom:14px; font-family:monospace;">
          Sentence ${state.currentSentenceIdx + 1} of ${sentences.length} · Score: ${state.sentenceScore}/${state.currentSentenceIdx}
        </div>

        <div style="font-size:1.3rem; font-weight:800; color:#fff; margin-bottom:18px; line-height:1.5; text-align:center;">
          "${current.base} <span style="color:#64748b; text-decoration:underline; text-decoration-color:var(--yi-amber);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> ${current.completion}"
        </div>

        <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-bottom:16px;">
          ${(current.options || ['TO', 'FOR', 'BECAUSE']).map((opt) => `
            <button type="button" class="yi-token ${opt === 'TO' ? 'to-token' : ''}"
                    onclick="window.YoungInventors.answerSentence('${opt}', '${current.correct}')"
                    id="sopt_${opt}">
              ${opt}
            </button>
          `).join('')}
        </div>

        <div id="m3Feedback" style="display:none; text-align:center; padding:10px;"></div>
      </div>

      <!-- Sentence Builder Section -->
      ${D.mission3_purpose && D.mission3_purpose.sentenceBuilder ? `
        <div style="margin-top:16px;">
          <h3 style="font-size:0.95rem; font-weight:800; color:var(--yi-amber); margin-bottom:10px; text-transform:uppercase;">✏️ BONUS: Sentence Builder</h3>
          ${renderSentenceBuilderWidget()}
        </div>
      ` : ''}

      <div style="margin-top:16px;">
        <button type="button" class="yi-full-width-btn" onclick="window.YoungInventors.loadMission(4)">
          📐 Mission 4: Design the Blueprint →
        </button>
      </div>
    `;
  }

  function renderSentenceBuilderWidget() {
    const builders = (D.mission3_purpose || {}).sentenceBuilder || [];
    if (!state.builderTarget || !builders.find(b => b.correctOrder === state.builderTarget)) {
      state.builderTarget = builders[0] ? builders[0].correctOrder : null;
      state.chosenBuilder = [];
    }
    const target = builders.find(b => b.correctOrder === state.builderTarget) || builders[0];
    if (!target) return '';

    const remaining = (target.words || []).filter(w => !state.chosenBuilder.includes(w));

    return `
      <div style="background:rgba(168,85,247,0.07); border:1.5px solid rgba(168,85,247,0.25); border-radius:var(--yi-radius-md); padding:16px;">
        <div style="font-size:0.78rem; color:#d8b4fe; font-weight:800; margin-bottom:10px; text-transform:uppercase;">Put the words in order:</div>

        <div class="yi-sentence-builder" style="margin-bottom:12px; min-height:50px;">
          ${state.chosenBuilder.map((w, i) => `
            <span class="yi-token selected" onclick="window.YoungInventors.removeBuilderWord(${i})" style="cursor:pointer;">${w}</span>
          `).join('')}
          ${state.chosenBuilder.length === 0 ? '<span style="color:#64748b; font-size:0.85rem;">Tap words below to build the sentence...</span>' : ''}
        </div>

        <div class="yi-word-bank">
          ${remaining.map(w => `
            <span class="yi-token" onclick="window.YoungInventors.addBuilderWord('${escapeJS(w)}')">${w}</span>
          `).join('')}
        </div>

        <div style="display:flex; gap:8px; margin-top:10px;">
          <button type="button" class="yi-btn-hud" onclick="window.YoungInventors.checkBuilder()">✅ Check Sentence</button>
          <button type="button" class="yi-btn-hud" onclick="window.YoungInventors.clearBuilder()">🔄 Reset</button>
        </div>
      </div>
    `;
  }

  YoungInventors.answerSentence = function(chosen, correct) {
    const feedbackEl = DOM.missionContent.querySelector('#m3Feedback');
    const isCorrect = (chosen === correct);

    // Highlight buttons
    ['TO', 'FOR', 'BECAUSE'].forEach(opt => {
      const btn = DOM.missionContent.querySelector(`#sopt_${opt}`);
      if (!btn) return;
      if (opt === correct) {
        btn.style.background = 'rgba(16,185,129,0.25)';
        btn.style.borderColor = '#10b981';
        btn.style.color = '#6ee7b7';
      } else if (opt === chosen && !isCorrect) {
        btn.style.background = 'rgba(239,68,68,0.2)';
        btn.style.borderColor = '#ef4444';
        btn.style.color = '#fca5a5';
      }
      btn.disabled = true;
    });

    if (feedbackEl) {
      feedbackEl.style.display = 'block';
      feedbackEl.innerHTML = isCorrect
        ? '<span style="color:#10b981; font-weight:800;">✅ Correct! TO + VERB shows purpose!</span>'
        : `<span style="color:#ef4444; font-weight:800;">❌ Use TO! "...TO ${(D.mission3_purpose && D.mission3_purpose.sentences && D.mission3_purpose.sentences[state.currentSentenceIdx]) ? D.mission3_purpose.sentences[state.currentSentenceIdx].completion : '...'}"</span>`;
    }

    if (isCorrect) {
      state.sentenceScore++;
      playSound('success');
      awardXP(10, 'Purpose Mastered! +10 XP 🎯');
    } else {
      playSound('error');
    }

    // Auto advance
    setTimeout(() => {
      const sentences = (D.mission3_purpose || {}).sentences || [];
      state.currentSentenceIdx = (state.currentSentenceIdx + 1) % sentences.length;

      if (state.currentSentenceIdx === 0 && !state.completedMissions.has(3)) {
        markMissionComplete(3, 20, '🎯 Mission 3 Complete! Purpose unlocked!');
      }

      renderM3();
    }, 1200);
  };

  YoungInventors.addBuilderWord = function(word) {
    state.chosenBuilder.push(word);
    const builders = (D.mission3_purpose || {}).sentenceBuilder || [];
    const container = DOM.missionContent.querySelector('.yi-word-bank');
    if (container) {
      const remaining = ((builders.find(b => b.correctOrder === state.builderTarget) || {}).words || []).filter(w => !state.chosenBuilder.includes(w));
      // Re-render builder widget inline
      const bWidget = DOM.missionContent.querySelector('.yi-sentence-builder').parentNode;
      if (bWidget) bWidget.outerHTML = renderSentenceBuilderWidget();
    }
    // Full re-render
    const m3Container = DOM.missionContent;
    if (m3Container) {
      const sentenceBuilderSection = m3Container.querySelector('[data-builder-section]');
      // Just update the inner part
    }
    renderM3();
  };

  YoungInventors.removeBuilderWord = function(idx) {
    state.chosenBuilder.splice(idx, 1);
    renderM3();
  };

  YoungInventors.clearBuilder = function() {
    state.chosenBuilder = [];
    renderM3();
  };

  YoungInventors.checkBuilder = function() {
    const builders = (D.mission3_purpose || {}).sentenceBuilder || [];
    const target = builders.find(b => b.correctOrder === state.builderTarget) || builders[0];
    if (!target) return;

    const built = state.chosenBuilder.join(' ');
    const correct = target.correctOrder;

    if (built === correct) {
      playSound('success');
      showToast('✅ Perfect sentence! +5 XP');
      awardXP(5, 'Sentence Builder Complete!');
      state.chosenBuilder = [];

      // Move to next builder
      const idx = builders.findIndex(b => b.correctOrder === state.builderTarget);
      if (idx >= 0 && idx + 1 < builders.length) {
        state.builderTarget = builders[idx + 1].correctOrder;
      }
    } else {
      playSound('error');
      showToast(`❌ Not quite! Try: "${correct}"`);
    }

    renderM3();
  };

  // ============================================================
  // MISSION 4: DESIGN THE BLUEPRINT
  // ============================================================
  function renderM4() {
    const d = D.mission4_blueprint || {};
    const challenges = d.challenges || [];
    const currentChallenge = challenges.find(c => c.id === state.selectedChallenge) || challenges[0];

    DOM.missionContent.innerHTML = `
      <div class="yi-robo-guide">
        <div class="yi-robo-avatar">🤖</div>
        <div class="yi-robo-speech">
          <strong>Real inventors make a plan FIRST!</strong> Choose your engineering challenge, pick a design, and identify all the parts of your invention.
        </div>
      </div>

      <!-- Challenge Selector -->
      <div style="display:flex; gap:10px; margin-bottom:14px;">
        ${challenges.map(ch => `
          <button type="button" class="yi-btn-hud ${state.selectedChallenge === ch.id ? 'primary' : ''}"
                  style="flex:1; padding:12px 16px; min-height:52px; font-size:1rem; font-weight:800;"
                  onclick="window.YoungInventors.selectChallenge('${ch.id}')">
            ${ch.emoji} ${ch.name}
          </button>
        `).join('')}
      </div>

      ${currentChallenge ? renderBlueprintChallenge(currentChallenge) : '<p style="color:#94a3b8;">No challenge data found.</p>'}

      <div style="margin-top:16px;">
        <button type="button" class="yi-full-width-btn" onclick="window.YoungInventors.completeBlueprintAndNext()">
          🧪 Mission 5: Build, Test & Measure →
        </button>
      </div>
    `;
  }

  function renderBlueprintChallenge(ch) {
    const designs = ch.designs || [];
    const parts = ch.parts || [];

    return `
      <div class="yi-layout-grid">
        <!-- Blueprint Card: Choose Design -->
        <div class="yi-blueprint-card">
          <div style="font-size:0.78rem; font-weight:800; color:var(--yi-amber); text-transform:uppercase; margin-bottom:12px; position:relative; z-index:1; letter-spacing:0.06em;">
            📐 Step 1: Choose Your Blueprint Design
          </div>
          <div class="yi-design-options">
            ${designs.map(design => `
              <div class="yi-design-card ${state.selectedDesign === design.id ? 'selected' : ''}"
                   onclick="window.YoungInventors.selectDesign('${design.id}')"
                   style="position:relative; z-index:1;">
                <div style="font-size:1.1rem; font-weight:900; color:${state.selectedDesign === design.id ? 'var(--yi-amber)' : '#fff'}; margin-bottom:4px;">${design.name}</div>
                <div style="font-size:0.72rem; color:var(--yi-amber); font-weight:700; margin-bottom:6px;">${design.purpose}</div>
                <div style="font-size:0.78rem; color:#94a3b8; line-height:1.4;">${design.description}</div>
                ${state.selectedDesign === design.id ? '<div style="position:absolute; top:4px; right:6px; font-size:1rem;">✅</div>' : ''}
              </div>
            `).join('')}
          </div>

          ${state.selectedDesign ? `
            <div style="margin-top:12px; padding:10px 12px; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.35); border-radius:8px; position:relative; z-index:1;">
              <span style="font-size:0.82rem; color:#6ee7b7;">✅ Design chosen! <strong>${designs.find(d => d.id === state.selectedDesign)?.language || 'We designed it to fly farther.'}</strong></span>
            </div>
          ` : ''}
        </div>

        <!-- Parts Identification -->
        <div class="yi-panel cyan-border">
          <div class="yi-panel-header">
            <span>🔩</span>
            <span class="yi-panel-title">Step 2: Identify the Parts</span>
          </div>
          <div class="yi-panel-body">
            <div class="yi-parts-grid">
              ${parts.map(part => `
                <div class="yi-part-card ${state.selectedParts.has(part.id) ? 'selected' : ''}"
                     onclick="window.YoungInventors.togglePart('${part.id}')">
                  <span style="font-size:1.8rem;">${part.emoji}</span>
                  <div>
                    <div style="font-size:0.82rem; font-weight:900; color:${state.selectedParts.has(part.id) ? 'var(--yi-cyan)' : '#fff'};">${part.label}</div>
                    <div style="font-size:0.72rem; color:#94a3b8; line-height:1.3;">${part.description}</div>
                  </div>
                  ${state.selectedParts.has(part.id) ? '<span style="margin-left:auto; color:var(--yi-cyan); flex-shrink:0;">✓</span>' : ''}
                </div>
              `).join('')}
            </div>
            <div style="margin-top:12px; font-size:0.82rem; color:#94a3b8;">
              <span id="m4PartsCount">${state.selectedParts.size} / ${parts.length} parts identified</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Language Output -->
      <div style="background:rgba(168,85,247,0.08); border:1.5px solid rgba(168,85,247,0.3); border-radius:var(--yi-radius-md); padding:14px 18px;">
        <div style="font-size:0.75rem; font-weight:800; color:#d8b4fe; text-transform:uppercase; margin-bottom:8px;">🗣️ INVENTOR LANGUAGE:</div>
        <div style="font-size:1rem; color:#e2e8f0; font-weight:700;">
          "We designed <strong>${state.selectedChallenge === 'airplane' ? 'a paper airplane' : 'a pinwheel'}</strong> 
          ${state.selectedDesign ? `<strong style="color:var(--yi-amber);">to ${designs.find(d => d.id === state.selectedDesign)?.designGoal || '...'}</strong>` : '<em style="color:#64748b;">to ___.</em>'}"
        </div>
      </div>
    `;
  }

  YoungInventors.selectChallenge = function(id) {
    state.selectedChallenge = id;
    state.selectedDesign = null;
    state.selectedParts = new Set();
    renderM4();
  };

  YoungInventors.selectDesign = function(id) {
    state.selectedDesign = id;
    playSound('click');
    renderM4();
  };

  YoungInventors.togglePart = function(id) {
    if (state.selectedParts.has(id)) {
      state.selectedParts.delete(id);
    } else {
      state.selectedParts.add(id);
      playSound('ding');
    }
    renderM4();
  };

  YoungInventors.completeBlueprintAndNext = function() {
    if (!state.completedMissions.has(4)) {
      markMissionComplete(4, 20, '📐 Mission 4 Complete! Blueprint designed!');
    }
    loadMission(5);
  };

  // ============================================================
  // MISSION 5: BUILD • TEST • MEASURE
  // ============================================================
  function renderM5() {
    const d = D.mission5_test || {};
    const isAirplane = state.selectedChallenge !== 'pinwheel';
    const steps = isAirplane ? (d.airplaneSteps || []) : (d.pinwheelSteps || []);

    DOM.missionContent.innerHTML = `
      <div class="yi-robo-guide">
        <div class="yi-robo-avatar">🤖</div>
        <div class="yi-robo-speech">
          <strong>Engineering time!</strong> Follow the step-by-step instructions to build your ${isAirplane ? 'paper airplane' : 'pinwheel'}. Then test it and record your results!
        </div>
      </div>

      <!-- Challenge Toggle -->
      <div style="display:flex; gap:8px; margin-bottom:14px;">
        <button type="button" class="yi-btn-hud ${state.selectedChallenge !== 'pinwheel' ? 'primary' : ''}"
                onclick="window.YoungInventors.setTestChallenge('airplane')">
          ✈️ Paper Airplane
        </button>
        <button type="button" class="yi-btn-hud ${state.selectedChallenge === 'pinwheel' ? 'primary' : ''}"
                onclick="window.YoungInventors.setTestChallenge('pinwheel')">
          🌀 Pinwheel
        </button>
      </div>

      <div class="yi-layout-grid">
        <!-- Build Instructions -->
        <div class="yi-panel amber-border">
          <div class="yi-panel-header">
            <span>🔨</span>
            <span class="yi-panel-title">Building Instructions</span>
            <span class="yi-badge" style="margin-left:auto;">${steps.length} Steps</span>
          </div>
          <div class="yi-panel-body">
            <div class="yi-step-instructions">
              ${steps.map(step => `
                <div class="yi-step-card">
                  <div class="yi-step-num-badge">${step.step}</div>
                  <div>
                    <div style="font-size:0.92rem; font-weight:800; color:#fff; margin-bottom:3px;">${step.emoji} ${step.title}</div>
                    <div style="font-size:0.82rem; color:#94a3b8; line-height:1.5;">${step.instruction}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Test Station -->
        <div class="yi-panel cyan-border">
          <div class="yi-panel-header">
            <span>🧪</span>
            <span class="yi-panel-title">${isAirplane ? 'Flight' : 'Wind'} Test Station</span>
          </div>
          <div class="yi-panel-body">

            <!-- Runway / Test Area Visual -->
            <div class="yi-runway" style="margin-bottom:14px;">
              <div class="yi-runway-marks">
                ${[0,1,2,3,4,5,6,7,8].map(n => `
                  <div class="yi-runway-tick">
                    <div class="tick-line"></div>
                    <div class="tick-label">${n}m</div>
                  </div>
                `).join('')}
              </div>
              <div style="position:absolute; top:50%; left:${Math.min(95, (parseFloat(state.test1Result || '0') / 8) * 100)}%; transform:translateY(-50%); font-size:1.5rem; transition:left 0.5s ease;">
                ${isAirplane ? '✈️' : '🌀'}
              </div>
            </div>

            <!-- Measurement inputs -->
            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:14px;">
              <div class="yi-measurement-card">
                <div class="yi-measurement-label">🔮 Prediction</div>
                <input type="number" class="yi-measurement-input" id="predictionInput" value="${isAirplane ? state.prediction : state.pinwheelPrediction}"
                       placeholder="?" min="0" max="99" step="0.1"
                       onchange="window.YoungInventors.saveMeasurement('prediction', this.value)"
                       style="user-select:text;" inputmode="decimal">
                <div style="font-size:0.68rem; color:#94a3b8;">${isAirplane ? 'meters' : 'spins/10s'}</div>
              </div>
              <div class="yi-measurement-card">
                <div class="yi-measurement-label">🧪 Test 1</div>
                <input type="number" class="yi-measurement-input" id="test1Input" value="${isAirplane ? state.test1Result : state.pinwheelTest1}"
                       placeholder="?" min="0" max="99" step="0.1"
                       onchange="window.YoungInventors.saveMeasurement('test1', this.value)"
                       style="user-select:text;" inputmode="decimal">
                <div style="font-size:0.68rem; color:#94a3b8;">${isAirplane ? 'meters' : 'spins/10s'}</div>
              </div>
              <div class="yi-measurement-card">
                <div class="yi-measurement-label">🔬 Test 2</div>
                <input type="number" class="yi-measurement-input" id="test2Input" value="${isAirplane ? state.test2Result : state.pinwheelTest2}"
                       placeholder="?" min="0" max="99" step="0.1"
                       onchange="window.YoungInventors.saveMeasurement('test2', this.value)"
                       style="user-select:text;" inputmode="decimal">
                <div style="font-size:0.68rem; color:#94a3b8;">${isAirplane ? 'meters' : 'spins/10s'}</div>
              </div>
            </div>

            <!-- Prediction sentence -->
            <div style="background:rgba(168,85,247,0.08); border:1px solid rgba(168,85,247,0.25); border-radius:8px; padding:12px; margin-bottom:10px;">
              <div style="font-size:0.72rem; color:#d8b4fe; font-weight:800; text-transform:uppercase; margin-bottom:6px;">🗣️ Say it:</div>
              <div style="font-size:0.88rem; color:#e2e8f0; line-height:1.5;">
                "We predicted it would ${isAirplane ? 'fly' : 'spin'} 
                <strong style="color:var(--yi-cyan);">${isAirplane ? state.prediction || '___' : state.pinwheelPrediction || '___'}</strong>
                ${isAirplane ? 'meters' : 'spins in 10 seconds'}."
              </div>
            </div>

            <button type="button" class="yi-full-width-btn secondary" onclick="window.YoungInventors.completeTestStation()">
              ✅ Tests Complete! Save Results
            </button>
          </div>
        </div>
      </div>

      <div style="margin-top:12px;">
        <button type="button" class="yi-full-width-btn" onclick="window.YoungInventors.loadMission(6)">
          🔧 Mission 6: Improve the Design →
        </button>
      </div>
    `;
  }

  YoungInventors.setTestChallenge = function(ch) {
    state.selectedChallenge = ch;
    renderM5();
  };

  YoungInventors.saveMeasurement = function(type, value) {
    const isAirplane = state.selectedChallenge !== 'pinwheel';
    if (isAirplane) {
      if (type === 'prediction') state.prediction = value;
      else if (type === 'test1') state.test1Result = value;
      else if (type === 'test2') state.test2Result = value;
    } else {
      if (type === 'prediction') state.pinwheelPrediction = value;
      else if (type === 'test1') state.pinwheelTest1 = value;
      else if (type === 'test2') state.pinwheelTest2 = value;
    }
  };

  YoungInventors.completeTestStation = function() {
    playSound('success');
    showToast('✅ Results recorded! Great engineer!');
    if (!state.completedMissions.has(5)) {
      markMissionComplete(5, 25, '🧪 Mission 5 Complete! Tests recorded!');
    }
    // Update runway display
    renderM5();
  };

  // ============================================================
  // MISSION 6: IMPROVE THE DESIGN
  // ============================================================
  function renderM6() {
    const d = D.mission6_improve || {};
    const isAirplane = state.improveChallenge !== 'pinwheel';
    const problems = isAirplane ? (d.airplaneProblems || []) : (d.pinwheelProblems || []);

    DOM.missionContent.innerHTML = `
      <div style="background:linear-gradient(135deg, rgba(239,68,68,0.12), rgba(245,158,11,0.08)); border:2px solid rgba(239,68,68,0.3); border-radius:var(--yi-radius-lg); padding:20px; text-align:center; margin-bottom:16px;">
        <div style="font-size:2.5rem; margin-bottom:8px;">🔧</div>
        <h2 style="font-size:1.4rem; font-weight:900; color:#fff; margin-bottom:6px;">REAL INVENTORS NEVER GIVE UP!</h2>
        <p style="font-size:0.95rem; color:#94a3b8; line-height:1.5;">${d.coreMessage || 'Test → Find the Problem → Improve → Test Again!'}</p>
      </div>

      <!-- Engineer Cycle -->
      <div style="display:flex; align-items:center; justify-content:center; gap:6px; flex-wrap:wrap; margin-bottom:18px; padding:14px; background:rgba(255,255,255,0.04); border-radius:var(--yi-radius-md);">
        ${['VERSION 1', 'PROBLEM', 'CHANGE', 'VERSION 2'].map((step, i, arr) => `
          <div style="text-align:center; padding:8px 14px; background:rgba(245,158,11,0.1); border:1.5px solid rgba(245,158,11,0.35); border-radius:8px; font-size:0.82rem; font-weight:800; color:var(--yi-amber);">${step}</div>
          ${i < arr.length - 1 ? '<div style="font-size:1.2rem; color:#f59e0b;">→</div>' : ''}
        `).join('')}
      </div>

      <!-- Challenge Toggle -->
      <div style="display:flex; gap:8px; margin-bottom:14px;">
        <button type="button" class="yi-btn-hud ${!isAirplane ? '' : 'primary'}" onclick="window.YoungInventors.setImproveChallenge('airplane')">
          ✈️ Paper Airplane
        </button>
        <button type="button" class="yi-btn-hud ${isAirplane ? '' : 'primary'}" onclick="window.YoungInventors.setImproveChallenge('pinwheel')">
          🌀 Pinwheel
        </button>
      </div>

      <div class="yi-layout-grid">
        <!-- Step 1: Identify Problem -->
        <div class="yi-panel" style="border-color:rgba(239,68,68,0.3);">
          <div class="yi-panel-header">
            <span>⚠️</span>
            <span class="yi-panel-title">Step 1: Find the Problem</span>
          </div>
          <div class="yi-panel-body">
            <p style="font-size:0.85rem; color:#94a3b8; margin-bottom:12px;">What went wrong in your test?</p>
            <div class="yi-problem-selector">
              ${problems.map(prob => `
                <div class="yi-problem-card ${state.selectedProblem === prob.id ? 'selected' : ''}"
                     onclick="window.YoungInventors.selectProblem('${prob.id}')">
                  <div style="font-size:0.88rem; font-weight:800; color:#fff; line-height:1.4;">${prob.text}</div>
                  ${state.selectedProblem === prob.id ? '<div style="color:#ef4444; margin-top:6px; font-size:0.8rem;">⚠️ SELECTED</div>' : ''}
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Step 2: Choose Improvement -->
        <div class="yi-panel cyan-border">
          <div class="yi-panel-header">
            <span>🔧</span>
            <span class="yi-panel-title">Step 2: Make an Improvement</span>
          </div>
          <div class="yi-panel-body">
            ${state.selectedProblem ? (() => {
              const prob = problems.find(p => p.id === state.selectedProblem);
              if (!prob) return '<p style="color:#64748b; font-size:0.85rem;">Select a problem first.</p>';
              return `
                <p style="font-size:0.82rem; color:#94a3b8; margin-bottom:10px;">Choose how to fix the problem:</p>
                <div class="yi-improvement-chips">
                  ${prob.improvements.map(imp => `
                    <div class="yi-chip ${state.selectedImprovements.has(imp) ? 'selected' : ''}"
                         onclick="window.YoungInventors.toggleImprovement('${escapeJS(imp)}')">
                      ${imp}
                    </div>
                  `).join('')}
                </div>
                ${state.selectedImprovements.size > 0 ? `
                  <div style="margin-top:12px; padding:10px 12px; background:rgba(168,85,247,0.08); border:1px solid rgba(168,85,247,0.25); border-radius:8px;">
                    <div style="font-size:0.72rem; color:#d8b4fe; font-weight:800; text-transform:uppercase; margin-bottom:4px;">🗣️ Say it:</div>
                    <div style="font-size:0.88rem; color:#e2e8f0; line-height:1.5;">
                      "We changed the ${[...state.selectedImprovements][0].toLowerCase()} <strong style="color:var(--yi-amber);">because</strong> ${prob.text.toLowerCase()}"
                    </div>
                  </div>
                ` : ''}
              `;
            })() : '<p style="color:#64748b; font-size:0.85rem;">← Select a problem first!</p>'}
          </div>
        </div>
      </div>

      <div style="margin-top:16px;">
        <button type="button" class="yi-full-width-btn" onclick="window.YoungInventors.completeImprove()">
          🎤 Mission 7: Present the Result →
        </button>
      </div>
    `;
  }

  YoungInventors.setImproveChallenge = function(ch) {
    state.improveChallenge = ch;
    state.selectedProblem = null;
    state.selectedImprovements = new Set();
    renderM6();
  };

  YoungInventors.selectProblem = function(id) {
    state.selectedProblem = id;
    state.selectedImprovements = new Set();
    playSound('click');
    renderM6();
  };

  YoungInventors.toggleImprovement = function(imp) {
    if (state.selectedImprovements.has(imp)) {
      state.selectedImprovements.delete(imp);
    } else {
      state.selectedImprovements.add(imp);
      playSound('ding');
    }
    renderM6();
  };

  YoungInventors.completeImprove = function() {
    if (!state.completedMissions.has(6)) {
      markMissionComplete(6, 20, '🔧 Mission 6 Complete! Design improved!');
    }
    loadMission(7);
  };

  // ============================================================
  // MISSION 7: PRESENT THE RESULT
  // ============================================================
  function renderM7() {
    const d = D.mission7_present || {};
    const frames = d.sentenceFrames || [];
    const criteria = d.scoringCriteria || [];
    const awards = D.awards || [];

    const isAirplane = state.selectedChallenge !== 'pinwheel';
    const inventionName = isAirplane ? 'a paper airplane' : 'a pinwheel';

    DOM.missionContent.innerHTML = `
      <div class="yi-robo-guide">
        <div class="yi-robo-avatar">🤖</div>
        <div class="yi-robo-speech">
          <strong>Presentation time!</strong> Use these sentence frames to present your invention like a real inventor!
          Stand up, speak clearly, and be proud of your work! 🎤
        </div>
      </div>

      <div class="yi-layout-grid">
        <!-- Sentence Frames -->
        <div class="yi-panel" style="border-color:rgba(168,85,247,0.3);">
          <div class="yi-panel-header">
            <span>🗣️</span>
            <span class="yi-panel-title">Inventor Presentation Frames</span>
          </div>
          <div class="yi-panel-body">
            <div class="yi-sentence-frames-list">
              ${frames.map(frame => `
                <div class="yi-frame-card">
                  <div class="yi-frame-label">${frame.label}...</div>
                  <div class="yi-frame-example">"${frame.example}"</div>
                </div>
              `).join('')}
            </div>
            <button type="button" class="yi-btn-hud" style="margin-top:12px; width:100%;" onclick="window.YoungInventors.speakPresentation()">
              🔊 Hear Model Presentation
            </button>
          </div>
        </div>

        <!-- Scoring Rubric -->
        <div class="yi-panel amber-border">
          <div class="yi-panel-header">
            <span>⭐</span>
            <span class="yi-panel-title">Teacher Assessment Rubric</span>
          </div>
          <div class="yi-panel-body">
            <div class="yi-rubric-table">
              ${criteria.map(c => `
                <div class="yi-rubric-row">
                  <span class="yi-rubric-criterion">${c.criterion}</span>
                  <div class="yi-rubric-stars">
                    ${Array.from({length: c.maxPoints}, (_, idx) => `
                      <span class="yi-star ${idx < (state.rubric[c.criterion.replace(/\s+/g, '')] || 0) ? 'active' : ''}"
                            onclick="window.YoungInventors.setRubric('${c.criterion.replace(/\s+/g, '')}', ${idx + 1})">⭐</span>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
            <div style="margin-top:12px; font-size:0.8rem; color:#94a3b8; text-align:center;">
              Total: ${Object.values(state.rubric).reduce((a, b) => a + b, 0)} / ${criteria.reduce((a, c) => a + c.maxPoints, 0)} points
            </div>
          </div>
        </div>
      </div>

      <!-- Awards Section -->
      <div style="margin-top:20px;">
        <h3 style="font-size:1rem; font-weight:900; color:var(--yi-neon-gold); margin-bottom:12px; text-transform:uppercase; letter-spacing:0.06em;">🏆 INVENTOR AWARDS — Click to Award!</h3>
        <div class="yi-award-wall" style="grid-template-columns:repeat(4, 1fr);">
          ${awards.map(award => `
            <div class="yi-award-badge" onclick="window.YoungInventors.giveAward('${award.id}', '${award.name}')">
              <div class="award-icon">${award.emoji}</div>
              <div class="award-name">${award.name}</div>
              <div class="award-desc">${award.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-top:20px;">
        <button type="button" class="yi-full-width-btn" onclick="window.YoungInventors.completePresent()">
          🏆 Mission 8: FINAL INVENTOR BATTLE! →
        </button>
      </div>
    `;
  }

  YoungInventors.setRubric = function(key, val) {
    state.rubric[key] = val;
    renderM7();
  };

  YoungInventors.speakPresentation = function() {
    const isAirplane = state.selectedChallenge !== 'pinwheel';
    const text = `Our invention is ${isAirplane ? 'a paper airplane' : 'a pinwheel'}. We designed it to ${isAirplane ? 'fly farther' : 'spin faster'}. We predicted ${isAirplane ? state.prediction || 'three' : state.pinwheelPrediction || 'twenty'} ${isAirplane ? 'meters' : 'spins'}. We changed the design because it ${state.selectedProblem ? state.selectedProblem.replace('-', ' ') : 'needed improvement'}.`;
    speak(text);
  };

  YoungInventors.giveAward = function(id, name) {
    playSound('success');
    showToast(`🏆 ${name} awarded!`);
    awardXP(10, `Award: ${name} +10 XP`);
  };

  YoungInventors.completePresent = function() {
    if (!state.completedMissions.has(7)) {
      markMissionComplete(7, 20, '🎤 Mission 7 Complete! Presentation done!');
    }
    loadMission(8);
  };

  // ============================================================
  // MISSION 8: INVENTOR BATTLE (Bamboozle-Style)
  // ============================================================
  function renderM8() {
    const d = D.mission8_battle || {};
    const categories = d.categories || [];
    const questions = d.questions || [];

    DOM.missionContent.innerHTML = `
      <!-- Battle Header -->
      <div class="yi-battle-header">
        <div style="font-size:0.85rem; font-weight:800; color:var(--yi-amber); text-transform:uppercase; margin-bottom:6px;">⚡ FINAL CHALLENGE</div>
        <h2 style="font-size:2rem; font-weight:900; color:#fff; margin-bottom:4px;">INVENTOR BATTLE!</h2>
        <p style="color:#94a3b8; font-size:0.9rem;">Teams take turns choosing a category. Answer correctly to score points!</p>
      </div>

      <!-- Team Battle Scores -->
      <div class="yi-battle-teams" style="margin-bottom:16px;">
        ${Object.entries(state.battleScores).map(([teamKey, pts]) => `
          <div class="yi-battle-team-card" onclick="window.YoungInventors.selectBattleTeam('${teamKey}')"
               style="${state.selectedBattleTeam === teamKey ? 'border-color:var(--yi-amber); background:rgba(245,158,11,0.12);' : ''}">
            <div style="font-size:1.4rem; margin-bottom:4px;">${state.teams[teamKey].name}</div>
            <div style="font-size:1.6rem; font-weight:900; color:var(--yi-amber);">${pts}</div>
            <div style="font-size:0.68rem; color:#94a3b8; margin-top:2px;">pts</div>
          </div>
        `).join('')}
      </div>

      <!-- Question Board -->
      <div class="yi-battle-board" id="yiBattleBoard">
        ${categories.map(cat => {
          const catQuestions = questions.filter(q => q.category === cat.id);
          return catQuestions.map((q, qIdx) => {
            const isAnswered = state.answeredTiles.has(q.id);
            const tileColor = cat.color || 'var(--yi-amber)';
            return `
              <div class="yi-battle-tile ${q.tileType || 'normal'} ${isAnswered ? 'answered' : ''}"
                   onclick="${isAnswered ? '' : `window.YoungInventors.openBattleQuestion('${q.id}')`}"
                   style="border-color:${isAnswered ? 'rgba(255,255,255,0.1)' : 'rgba(' + hexToRgb(cat.color || '#f59e0b') + ',0.4)'}; background:${isAnswered ? 'rgba(255,255,255,0.03)' : `rgba(${hexToRgb(cat.color || '#f59e0b')},0.1)`};"
                   title="${q.question.substring(0, 50)}">
                <div class="tile-cat-icon" style="${isAnswered ? 'opacity:0.3;' : ''}">${cat.emoji}</div>
                <div class="tile-cat-name" style="${isAnswered ? 'color:rgba(255,255,255,0.2);' : `color:${cat.color || 'var(--yi-amber)'};`}">
                  ${cat.name.split(' ')[0]}
                </div>
                ${q.tileType !== 'normal' ? `
                  <div class="tile-special-badge" style="background:${tileSpecialBg(q.tileType)}; color:#fff; font-size:0.5rem; padding:2px;">
                    ${tileSpecialLabel(q.tileType)}
                  </div>
                ` : ''}
                ${isAnswered ? '<div style="position:absolute;top:4px;right:4px;font-size:0.7rem;opacity:0.5;">✓</div>' : ''}
              </div>
            `;
          }).join('');
        }).join('')}
      </div>

      <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:8px;">
        <div style="font-size:0.82rem; color:#94a3b8; padding:8px;">
          ${state.answeredTiles.size} / ${questions.length} questions answered
        </div>
        <button type="button" class="yi-full-width-btn" style="flex:1;" onclick="window.YoungInventors.finishBattle()">
          🏆 Finish & See Winners!
        </button>
      </div>
    `;
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '245, 158, 11';
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
  }

  function tileSpecialBg(type) {
    const map = { bonus: '#f59e0b', double: '#3b82f6', steal: '#ef4444', expert: '#a855f7', challenge: '#10b981', speed: '#06b6d4' };
    return map[type] || '#64748b';
  }

  function tileSpecialLabel(type) {
    const map = { bonus: '+2X', double: 'DBL', steal: '💀', expert: 'PRO', challenge: '🎙️', speed: '⚡' };
    return map[type] || '★';
  }

  YoungInventors.selectBattleTeam = function(teamKey) {
    state.selectedBattleTeam = teamKey;
    renderM8();
  };

  YoungInventors.openBattleQuestion = function(questionId) {
    const d = D.mission8_battle || {};
    const questions = d.questions || [];
    const q = questions.find(x => x.id === questionId);
    if (!q) return;

    state.currentBattleQuestion = q;
    state.battleAnswered = false;

    const overlay = document.createElement('div');
    overlay.className = 'yi-battle-question-overlay';
    overlay.id = 'battleQuestionOverlay';

    const isOptions = q.type === 'multiple_choice';
    const isTF = q.type === 'true_false';
    const isSpeaking = q.type === 'speaking';
    const isSentOrder = q.type === 'sentence_order';

    overlay.innerHTML = `
      <div class="yi-battle-question-card">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:16px;">
          <span class="yi-badge active-mission">QUESTION</span>
          ${q.tileType !== 'normal' ? `<span class="yi-badge" style="background:${tileSpecialBg(q.tileType)}44; border-color:${tileSpecialBg(q.tileType)}; color:#fff;">${tileSpecialLabel(q.tileType)} ${(q.tileType||'').toUpperCase()}</span>` : ''}
          <button type="button" class="yi-btn-close-modal" style="margin-left:auto;" onclick="window.YoungInventors.closeBattleQuestion()">✕</button>
        </div>

        <div style="font-size:1.3rem; font-weight:800; color:#fff; margin-bottom:20px; text-align:center; line-height:1.4;">${q.question}</div>

        ${isSpeaking ? `
          <div style="background:rgba(16,185,129,0.1); border:1.5px solid rgba(16,185,129,0.35); border-radius:12px; padding:20px; text-align:center; margin-bottom:16px;">
            <div style="font-size:2rem; margin-bottom:8px;">🎙️</div>
            <p style="color:#6ee7b7; font-size:0.95rem; line-height:1.6;">This is a speaking challenge! The team must answer in English.</p>
          </div>
          <div style="display:flex; gap:8px;">
            <button type="button" class="yi-full-width-btn" onclick="window.YoungInventors.awardBattlePoints(true)" style="flex:1;">✅ Great Answer! Award Points</button>
            <button type="button" class="yi-full-width-btn secondary" onclick="window.YoungInventors.closeBattleQuestion()" style="flex:1;">⬅ Skip</button>
          </div>
        ` : isTF ? `
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
            <button type="button" class="yi-option-btn" onclick="window.YoungInventors.answerBattle(true, ${q.correct})">
              ✅ TRUE
            </button>
            <button type="button" class="yi-option-btn" onclick="window.YoungInventors.answerBattle(false, ${q.correct})">
              ❌ FALSE
            </button>
          </div>
        ` : isSentOrder ? `
          <div style="background:rgba(168,85,247,0.1); border:1.5px solid rgba(168,85,247,0.3); border-radius:10px; padding:16px; margin-bottom:16px;">
            <div style="font-size:0.78rem; color:#d8b4fe; margin-bottom:8px; font-weight:800; text-transform:uppercase;">Put in order. Correct answer:</div>
            <div style="font-size:1.05rem; color:#e2e8f0; font-weight:700;">"${q.correct}"</div>
          </div>
          <div style="display:flex; gap:8px;">
            <button type="button" class="yi-full-width-btn" onclick="window.YoungInventors.awardBattlePoints(true)" style="flex:1;">✅ Correct! Award Points</button>
            <button type="button" class="yi-full-width-btn secondary" onclick="window.YoungInventors.awardBattlePoints(false)" style="flex:1;">❌ Wrong</button>
          </div>
        ` : `
          <div class="yi-options-list">
            ${(q.options || []).map((opt, i) => `
              <button type="button" class="yi-option-btn" onclick="window.YoungInventors.answerBattle(${i}, ${q.correct})">
                <span style="font-size:1.1rem; flex-shrink:0;">${['🅐','🅑','🅒','🅓'][i]}</span>
                <span>${opt}</span>
              </button>
            `).join('')}
          </div>
        `}
      </div>
    `;

    document.body.appendChild(overlay);
    playSound('ding');
  };

  YoungInventors.answerBattle = function(chosen, correct) {
    if (state.battleAnswered) return;
    state.battleAnswered = true;
    const isCorrect = (chosen === correct || chosen === true || (typeof chosen === 'boolean' && chosen === correct));
    const actualCorrect = (chosen === correct);
    YoungInventors.awardBattlePoints(actualCorrect);
  };

  YoungInventors.awardBattlePoints = function(isCorrect) {
    const q = state.currentBattleQuestion;
    if (!q) return;

    state.answeredTiles.add(q.id);

    if (isCorrect) {
      const team = state.selectedBattleTeam;
      let pts = 10;
      if (q.tileType === 'bonus' || q.tileType === 'double') pts = 20;
      if (q.tileType === 'expert') pts = 15;
      if (q.tileType === 'speed') pts = 12;

      state.battleScores[team] = (state.battleScores[team] || 0) + pts;
      playSound('success');
      showToast(`✅ ${state.teams[team].name} earns +${pts} points!`);
    } else {
      playSound('error');
      showToast('❌ Incorrect! No points.');
    }

    YoungInventors.closeBattleQuestion();

    if (!state.completedMissions.has(8)) {
      if (state.answeredTiles.size >= 10) {
        markMissionComplete(8, 30, '🏆 Mission 8 Complete! Battle finished!');
      }
    }

    renderM8();
  };

  YoungInventors.closeBattleQuestion = function() {
    const overlay = document.getElementById('battleQuestionOverlay');
    if (overlay) overlay.remove();
  };

  YoungInventors.finishBattle = function() {
    if (!state.completedMissions.has(8)) {
      markMissionComplete(8, 30, '🏆 Battle Complete! Young Inventors!');
    }
    showCelebration();
  };

  // ============================================================
  // CELEBRATION SCREEN
  // ============================================================
  function showCelebration() {
    state.currentMission = 9;
    if (DOM.heroScreen) DOM.heroScreen.style.display = 'none';
    if (DOM.stageContainer) DOM.stageContainer.style.display = 'flex';

    if (DOM.missionBadge) DOM.missionBadge.textContent = '🏆 MISSION COMPLETE!';
    if (DOM.missionTitle) DOM.missionTitle.textContent = '🏆 YOUNG INVENTOR CERTIFIED!';
    if (DOM.missionDesc) DOM.missionDesc.textContent = 'Congratulations! You completed all 8 missions!';
    if (DOM.btnPrev) DOM.btnPrev.disabled = true;
    if (DOM.btnNext) DOM.btnNext.disabled = true;

    // Determine top battle team
    let topTeam = 'brain', topPts = 0;
    Object.entries(state.battleScores).forEach(([k, v]) => { if (v > topPts) { topPts = v; topTeam = k; } });

    DOM.missionContent.innerHTML = `
      <div class="yi-diploma-card">
        <div style="font-size:4rem; margin-bottom:12px;">🏆✈️🌟</div>
        <div style="font-size:0.85rem; font-weight:800; color:#94a3b8; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:8px;">English Adventure Academy</div>
        <div class="yi-diploma-title">YOUNG INVENTOR CERTIFIED!</div>
        <p style="font-size:1.1rem; color:#94a3b8; margin-bottom:20px; line-height:1.6;">
          This is to certify that you have successfully completed all 8 missions of the Young Inventors challenge.
          You discovered inventions, solved problems, designed blueprints, built and tested prototypes, and presented your results!
        </p>

        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; margin-bottom:24px;">
          ${Object.entries(state.battleScores).map(([key, pts]) => `
            <div style="padding:14px; background:rgba(255,255,255,0.06); border:1.5px solid ${key === topTeam ? '#fde047' : 'rgba(255,255,255,0.15)'}; border-radius:10px; text-align:center;">
              <div style="font-size:1.3rem; margin-bottom:4px;">${state.teams[key].name}</div>
              <div style="font-size:1.6rem; font-weight:900; color:${key === topTeam ? '#fde047' : '#fff'};">${pts}</div>
              <div style="font-size:0.68rem; color:#94a3b8;">points</div>
              ${key === topTeam ? '<div style="font-size:0.75rem; font-weight:800; color:#fde047; margin-top:4px;">🏆 WINNER!</div>' : ''}
            </div>
          `).join('')}
        </div>

        <div style="font-size:1.2rem; font-weight:800; color:#fbbf24; margin-bottom:8px;">⭐ ${state.xp} XP Earned</div>
        <div style="font-size:0.9rem; color:#94a3b8; margin-bottom:20px;">${state.completedMissions.size} / 8 missions completed</div>

        <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
          <button type="button" class="yi-full-width-btn" style="max-width:220px;" onclick="window.YoungInventors.showHero()">
            🔄 Play Again
          </button>
          <a href="worksheet.html" target="_blank" class="yi-full-width-btn secondary" style="max-width:220px; text-decoration:none;">
            🖨️ Print Certificate
          </a>
          <a href="../index.html#library" class="yi-full-width-btn secondary" style="max-width:220px; text-decoration:none;">
            🏛️ Return to Library
          </a>
        </div>
      </div>
    `;

    playSound('victory');
    updateHUD();
  }

  // ============================================================
  // HUD & TIMELINE UPDATES
  // ============================================================
  function updateHUD() {
    if (DOM.xpDisplay) DOM.xpDisplay.textContent = `${state.xp} XP`;
    if (DOM.progressDisplay) DOM.progressDisplay.textContent = `${state.completedMissions.size} / 8`;

    const pct = state.currentMission <= 0 ? 12 : Math.round((state.currentMission / 8) * 100);
    if (DOM.progressFill) DOM.progressFill.style.width = pct + '%';

    // Update teacher checklist
    const checklist = document.getElementById('teacherMissionChecklist');
    if (checklist && D.missions) {
      checklist.innerHTML = D.missions.map(m => `
        <div style="display:flex; align-items:center; gap:8px; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
          <span style="font-size:1rem;">${state.completedMissions.has(m.id) ? '✅' : '⭕'}</span>
          <span style="font-size:0.82rem; color:${state.completedMissions.has(m.id) ? '#6ee7b7' : '#94a3b8'}; font-weight:700;">${m.icon} ${m.title}</span>
          <span style="margin-left:auto; font-size:0.7rem; color:#64748b; font-family:monospace;">${state.completedMissions.has(m.id) ? 'DONE' : '--'}</span>
        </div>
      `).join('');
    }

    // Dossier modal
    const dossierXp = document.getElementById('dossierXpDisplay');
    if (dossierXp) dossierXp.textContent = state.xp + ' XP';
    const dossierMissions = document.getElementById('dossierMissionsCount');
    if (dossierMissions) dossierMissions.textContent = `${state.completedMissions.size} / 8`;
  }

  function updateTimeline() {
    if (!DOM.timeline || !D.missions) return;
    DOM.timeline.innerHTML = D.missions.map(m => `
      <div class="yi-timeline-step ${state.currentMission === m.id ? 'active' : ''} ${state.completedMissions.has(m.id) ? 'completed' : ''}"
           onclick="window.YoungInventors.loadMission(${m.id})">
        <span class="yi-step-num">${String(m.id).padStart(2,'0')}</span>
        <span>${m.icon}</span>
        <span>${m.title}</span>
      </div>
    `).join('');
  }

  function renderTimeline() {
    if (!DOM.timeline || !D.missions) return;
    DOM.timeline.innerHTML = D.missions.map(m => `
      <div class="yi-timeline-node ${state.currentMission === m.id ? 'active' : ''} ${state.completedMissions.has(m.id) ? 'completed' : ''}"
           onclick="window.YoungInventors.loadMission(${m.id})" title="${m.title}">
        <span>${m.icon}</span>
        <span class="node-num">${m.id}</span>
      </div>
    `).join('');
  }

  function updateTimeline() {
    renderTimeline();
  }

  function renderTeamsStrip() {
    if (!DOM.teamsStrip) return;
    const teams = [
      { key: 'brain',    icon: '🧠', name: 'Team Brain' },
      { key: 'neuron',   icon: '⚡', name: 'Team Neuron' },
      { key: 'genius',   icon: '💡', name: 'Team Genius' },
      { key: 'explorer', icon: '🚀', name: 'Team Explorer' }
    ];

    DOM.teamsStrip.innerHTML = teams.map(t => `
      <div class="yi-team-card">
        <span class="yi-team-icon">${t.icon}</span>
        <div class="yi-team-info">
          <div class="yi-team-title">${t.name}</div>
          <div class="yi-team-pts" id="team-pts-${t.key}">${state.teams[t.key].pts}</div>
        </div>
        <div class="yi-team-btn-group">
          <button class="yi-team-btn plus" onclick="window.YoungInventors.addTeamScore('${t.key}', 10)" title="+10 Points">+10</button>
          <button class="yi-team-btn minus" onclick="window.YoungInventors.addTeamScore('${t.key}', -5)" title="-5 Points">-5</button>
        </div>
      </div>
    `).join('');
  }

  function renderHeroGrid() {
    if (!DOM.heroGrid || !D.missions) return;
    DOM.heroGrid.innerHTML = D.missions.map(m => `
      <div class="yi-hero-mission-card ${state.completedMissions.has(m.id) ? 'completed' : ''}"
           onclick="window.YoungInventors.loadMission(${m.id})" title="${m.title}: ${m.subtitle}">
        <div class="mission-num">MISSION ${String(m.id).padStart(2,'0')}</div>
        <div class="mission-icon">${m.icon}</div>
        <div class="mission-title">${m.title}</div>
      </div>
    `).join('');
  }

  // ============================================================
  // XP, SCORING & TEAMS
  // ============================================================
  function awardXP(pts, reason) {
    state.xp += pts;
    updateHUD();

    // Float bubble
    const bubble = document.createElement('div');
    bubble.className = 'float-xp-bubble';
    bubble.textContent = `+${pts} XP`;
    bubble.style.top = '80px';
    bubble.style.left = '50%';
    document.body.appendChild(bubble);
    setTimeout(() => bubble.remove(), 1600);
  }

  function markMissionComplete(missionId, xpReward, message) {
    if (state.completedMissions.has(missionId)) return;
    state.completedMissions.add(missionId);
    awardXP(xpReward, message);
    playSound('success');
    showToast(message);
    updateTimeline();
    renderTeamsStrip();
    renderHeroGrid();
    updateHUD();
  }

  YoungInventors.addTeamScore = function(teamKey, delta) {
    state.teams[teamKey].pts = Math.max(0, (state.teams[teamKey].pts || 0) + delta);
    state.battleScores[teamKey] = (state.battleScores[teamKey] || 0) + (delta > 0 ? delta : 0);
    const el = document.getElementById('team-pts-' + teamKey);
    if (el) el.textContent = state.teams[teamKey].pts;
    if (delta > 0) playSound('ding');

    showToast(`${state.teams[teamKey].name}: ${delta > 0 ? '+' : ''}${delta} points → ${state.teams[teamKey].pts} total`);
  };

  YoungInventors.awardBonusXP = function() {
    awardXP(10, 'Teacher bonus XP +10');
    showToast('⭐ Teacher awarded +10 Bonus XP!');
  };

  YoungInventors.autoRevealMission = function() {
    closeModals();
    if (state.currentMission >= 1) renderMission(state.currentMission);
  };

  // ============================================================
  // MODALS
  // ============================================================
  YoungInventors.openTeacherModal = function() {
    const el = DOM.teacherModal;
    if (el) { el.style.display = 'flex'; el.classList.add('active'); }
    updateHUD();
  };

  YoungInventors.openDossierModal = function() {
    const el = DOM.dossierModal;
    if (el) { el.style.display = 'flex'; el.classList.add('active'); }
    updateHUD();
  };

  YoungInventors.closeModals = function() {
    [DOM.teacherModal, DOM.dossierModal].forEach(el => {
      if (el) { el.style.display = 'none'; el.classList.remove('active'); }
    });
  };

  // ============================================================
  // SOUND & SPEECH
  // ============================================================
  function playSound(type) {
    if (!state.soundEnabled || !Audio) return;
    try {
      switch (type) {
        case 'click':   if (Audio.playClick) Audio.playClick(); break;
        case 'success': if (Audio.playSuccess || Audio.playCorrect) (Audio.playSuccess || Audio.playCorrect)(); break;
        case 'error':   if (Audio.playError || Audio.playWrong) (Audio.playError || Audio.playWrong)(); break;
        case 'ding':    if (Audio.playIdeaDing || Audio.playChime) (Audio.playIdeaDing || Audio.playChime)(); break;
        case 'victory': if (Audio.playApplause || Audio.playVictoryFanfare) (Audio.playApplause || Audio.playVictoryFanfare)(); break;
      }
    } catch (e) {}
  }

  function speak(text) {
    if (!state.soundEnabled) return;
    try {
      if (Audio && Audio.speak) { Audio.speak(text); return; }
      if (root.speechSynthesis) {
        root.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate = 0.88;
        utt.pitch = 1;
        root.speechSynthesis.speak(utt);
      }
    } catch (e) {}
  }

  YoungInventors.toggleSound = function() {
    state.soundEnabled = !state.soundEnabled;
    if (DOM.btnSound) DOM.btnSound.innerHTML = `${state.soundEnabled ? '🔊' : '🔇'} <span>Sound: ${state.soundEnabled ? 'ON' : 'OFF'}</span>`;
    showToast(state.soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF');
  };

  // ============================================================
  // TOAST
  // ============================================================
  let toastTimer = null;
  function showToast(msg) {
    if (!DOM.toast) return;
    DOM.toast.textContent = msg;
    DOM.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => DOM.toast.classList.remove('show'), 2800);
  }

  // ============================================================
  // UTILITIES
  // ============================================================
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function escapeJS(str) {
    return String(str || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');
  }

  // ============================================================
  // BLUEPRINT CANVAS BACKGROUND
  // ============================================================
  function initBlueprintCanvas() {
    const canvas = document.getElementById('yiBlueprintCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function draw() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gridSize = 40;
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.12)';
      ctx.lineWidth = 0.5;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Major grid lines
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.22)';
      ctx.lineWidth = 1;
      const majorGridSize = 200;
      for (let x = 0; x < canvas.width; x += majorGridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += majorGridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Cross marks at intersections
      ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
      for (let x = majorGridSize; x < canvas.width; x += majorGridSize) {
        for (let y = majorGridSize; y < canvas.height; y += majorGridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    draw();
    window.addEventListener('resize', draw);
  }

  // ============================================================
  // BOOTSTRAP
  // ============================================================
  document.addEventListener('DOMContentLoaded', () => {
    init();
    initBlueprintCanvas();
  });

  // Export public API
  root.YoungInventors = YoungInventors;

})(window);
