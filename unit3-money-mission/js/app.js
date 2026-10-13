/**
 * UNIT 3 ("HOW MUCH IS IT?") SMARTBOARD REVISION MISSION — CONTROLLER
 * Among Us Story Mission Flow (Tasks 1–3) + 2-Player Monster Bridge Tug-of-War Finale
 * Integrated with school-store.js, monster-renderer.js, and live +1/+5/+10 XP buttons.
 */

(function(root) {
  'use strict';

  const DATA = root.UNIT3_MISSION_DATA;
  const AUDIO = root.missionAudio;

  const CLASS_LIST = [
    { id: 'class-3a', label: '3A' },
    { id: 'class-3b', label: '3B' },
    { id: 'class-4a', label: '4A' },
    { id: 'class-4b', label: '4B' }
  ];

  const state = {
    activeClassId: 'class-3a',
    stage: 1, // 1 = Wires, 2 = Asteroids, 3 = Reactor, 4 = Boss Tug-of-War
    crewProgress: 0, // 0..100
    activeStudentId: null,
    pickedHistory: [],

    // Task 1: Electrical Wires (3 rounds x 4 wires = 12 connections)
    wireRoundIdx: 0,
    selectedWireId: null,
    matchedWireIds: [],
    shuffledTargets: [],

    // Task 2: Clear Asteroids (7 rounds)
    asteroidIdx: 0,
    asteroidOptions: [],
    asteroidLocked: false,

    // Task 3: Reactor Sequence (6 rounds)
    reactorIdx: 0,
    reactorPlaced: [],
    reactorPool: [],
    reactorLocked: false,

    // Stage 4: 2-Player Monster Bridge Tug-of-War
    p1StudentId: null,
    p2StudentId: null,
    ropePosition: 0, // -3 (P1 Left Island wins) .. 0 .. +3 (P2 Right Island wins)
    towOrder: [],
    towCursor: 0,
    towLocked: false,
    p1Options: [],
    p2Options: []
  };

  function getStore() {
    return root.schoolStore || root.store || null;
  }

  function detectInitialClass() {
    try {
      const saved = localStorage.getItem('eaa_active_class_id') || localStorage.getItem('activeClassId');
      if (saved && CLASS_LIST.some(c => c.id === saved)) {
        return saved;
      }
      const st = getStore();
      if (st && st.state && st.state.activeClassId && CLASS_LIST.some(c => c.id === st.state.activeClassId)) {
        return st.state.activeClassId;
      }
    } catch (e) {}
    return 'class-3a';
  }

  function getClassStudents(classId) {
    const st = getStore();
    if (!st || !st.state || !Array.isArray(st.state.students)) return [];
    const target = classId || state.activeClassId;
    const list = st.state.students.filter(s => s && !s.archived && String(s.classId) === String(target));
    if (list.length > 0) return list;
    return st.state.students.filter(s => s && !s.archived);
  }

  function getStudentById(studentId) {
    const st = getStore();
    if (!st || !studentId) return null;
    if (typeof st.getStudent === 'function') return st.getStudent(studentId);
    if (st.state && Array.isArray(st.state.students)) {
      return st.state.students.find(s => String(s.id) === String(studentId)) || null;
    }
    return null;
  }

  function getStudentDisplayName(student) {
    if (!student) return 'Crewmate';
    const first = student.firstName || (student.name ? student.name.split(' ')[0] : 'Crewmate');
    const last = student.lastName || '';
    return last ? `${first} ${last.charAt(0)}.` : first;
  }

  function getStudentAvatarUrl(student) {
    if (!student) return null;
    let url = student.avatarUrl || (student.extraData && student.extraData.avatarUrl) || null;
    if (!url && root.MilestoneCeremony && typeof root.MilestoneCeremony.pictureOf === 'function') {
      url = root.MilestoneCeremony.pictureOf(student);
    }
    if (url && url.startsWith('assets/')) {
      return '../' + url;
    }
    return url;
  }

  function renderStudentMonsterSvg(student, size = 76) {
    const st = getStore();
    if (root.MonsterRenderer && typeof root.MonsterRenderer.renderMonsterSVG === 'function') {
      const mState = (st && student && typeof st.getStudentMonsterState === 'function')
        ? st.getStudentMonsterState(student.id)
        : null;
      const profile = (student && student.monsterProfile) || {};
      const baseColor = profile.baseColor || (student && student.element) || 'blue';
      const equipped = profile.equipped || {};
      const stageKey = (mState && mState.stageKey && mState.stageKey !== 'egg' && mState.stageKey !== 'cracking_egg')
        ? mState.stageKey
        : 'baby';
      const lifeXP = (Number(student && student.xp) || 0) + (Number(student && (student.archivedXP || 0)) || 0);
      const nearEvolve = !!(stageKey === 'growing' && lifeXP >= 750);

      try {
        let svg = root.MonsterRenderer.renderMonsterSVG({
          stage: stageKey,
          color: baseColor || 'blue',
          equipped: equipped,
          size: size,
          animated: true,
          nearEvolve: nearEvolve
        });
        if (svg) {
          // Rewrite relative asset paths inside subdir
          svg = svg.replace(/href="assets\//g, 'href="../assets/');
          return svg;
        }
      } catch (e) {
        console.warn('[Unit3Mission] MonsterRenderer fallback:', e);
      }
    }
    return `<img src="../assets/monsters/pets/pet-crew-red-captain.png" style="width:${size}px;height:${size}px;object-fit:contain;" alt="Crewmate">`;
  }

  function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  // ===========================================================================
  // XP AWARDING & ROSTER SYNC
  // ===========================================================================
  function awardStudentXP(studentId, amount, reasonLabel) {
    const st = getStore();
    const student = getStudentById(studentId);
    if (!student || !st) {
      showToast(`⭐ +${amount} XP Awarded!`);
      if (AUDIO) AUDIO.playCorrect();
      return;
    }

    const reason = reasonLabel || 'Unit 3 Smartboard Revision Mission ("How Much Is It?")';
    if (typeof st.awardXP === 'function') {
      st.awardXP(student.id, amount, 'participation', reason);
    } else if (typeof st.giveXP === 'function') {
      st.giveXP(student.id, amount, reason, 'Teacher');
    } else {
      student.xp = (Number(student.xp) || 0) + Number(amount);
    }

    // Also trigger cloud sync if configured
    const updated = getStudentById(student.id) || student;
    if (root.schoolCloudSync && typeof root.schoolCloudSync.saveStudent === 'function') {
      root.schoolCloudSync.saveStudent(updated).catch(() => {});
    } else if (root.AdventureSupabase && typeof root.AdventureSupabase.saveStudent === 'function') {
      root.AdventureSupabase.saveStudent(updated).catch(() => {});
    }

    if (AUDIO) AUDIO.playCorrect();
    showToast(`🌟 +${amount} XP → ${getStudentDisplayName(updated)} (Total: ${updated.xp || 0} XP)`);
    renderCrewmateBadge();
    if (state.stage === 4) {
      renderTugHeaderNames();
    }
  }

  function showToast(msg) {
    const el = document.getElementById('xp-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => {
      el.classList.remove('show');
    }, 2400);
  }

  // ===========================================================================
  // STUDENT PICKER (1 CREWMATE FOR TASKS 1-3, 2 CHALLENGERS FOR TUG-OF-WAR)
  // ===========================================================================
  function pickNextCrewmate(speakName = true) {
    const roster = getClassStudents(state.activeClassId);
    if (!roster.length) return;

    let pool = roster.filter(s => !state.pickedHistory.includes(s.id));
    if (!pool.length) {
      state.pickedHistory = [];
      pool = roster.slice();
    }
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    state.activeStudentId = chosen.id;
    state.pickedHistory.push(chosen.id);

    if (AUDIO) {
      AUDIO.playCardFlip();
      if (speakName) {
        AUDIO.speak(`${chosen.firstName || chosen.name}, step up to the Smartboard!`);
      }
    }
    renderCrewmateBadge();
  }

  function pickTwoChallengers(speakNames = true) {
    const roster = getClassStudents(state.activeClassId);
    if (!roster.length) return;
    const shuffled = shuffleArray(roster);
    const p1 = shuffled[0];
    const p2 = shuffled[1] || shuffled[0];
    state.p1StudentId = p1.id;
    state.p2StudentId = p2.id;
    state.ropePosition = 0;

    if (AUDIO) {
      AUDIO.playCardFlip();
      if (speakNames) {
        AUDIO.speak(`${p1.firstName || p1.name} versus ${p2.firstName || p2.name}! Ready, set, pull!`);
      }
    }
    if (state.stage === 4) {
      renderStage4TugOfWar();
    }
  }

  // ===========================================================================
  // HUD & CREW BAR RENDERERS
  // ===========================================================================
  function updateCrewProgress() {
    // 12 wires (33%) + 7 asteroids (33%) + 6 reactor sentences (34%)
    const wireScore = (state.wireRoundIdx * 4 + state.matchedWireIds.length) / 12;
    const astScore = state.asteroidIdx / DATA.task2Asteroids.length;
    const reactScore = state.reactorIdx / DATA.task3Reactor.length;

    let pct = 0;
    if (state.stage === 1) {
      pct = Math.round(wireScore * 33);
    } else if (state.stage === 2) {
      pct = 33 + Math.round(astScore * 33);
    } else if (state.stage === 3) {
      pct = 66 + Math.round(reactScore * 34);
    } else if (state.stage === 4) {
      pct = 100;
    }
    state.crewProgress = Math.max(state.crewProgress, Math.min(100, pct));

    const fillEl = document.getElementById('crew-bar-fill');
    const pctEl = document.getElementById('crew-bar-pct');
    if (fillEl) fillEl.style.width = `${state.crewProgress}%`;
    if (pctEl) pctEl.textContent = `${state.crewProgress}%`;

    document.querySelectorAll('.stage-tab-btn').forEach(btn => {
      const stg = Number(btn.getAttribute('data-stage'));
      btn.classList.toggle('active', stg === state.stage);
    });
  }

  function renderClassSwitcher() {
    const container = document.getElementById('class-pills-box');
    if (!container) return;
    container.innerHTML = CLASS_LIST.map(c => `
      <button type="button" class="class-pill ${c.id === state.activeClassId ? 'active' : ''}" data-class="${c.id}">
        ${c.label}
      </button>
    `).join('');

    container.querySelectorAll('.class-pill').forEach(btn => {
      btn.addEventListener('pointerdown', () => {
        const cid = btn.getAttribute('data-class');
        if (!cid) return;
        state.activeClassId = cid;
        state.pickedHistory = [];
        try { localStorage.setItem('eaa_active_class_id', cid); } catch (e) {}
        renderClassSwitcher();
        pickNextCrewmate(false);
        if (state.stage === 4) {
          pickTwoChallengers(false);
        }
      });
    });
  }

  function renderCrewmateBadge() {
    const box = document.getElementById('crewmate-roster-card');
    if (!box) return;
    const roster = getClassStudents(state.activeClassId);
    if (!state.activeStudentId && roster.length) {
      state.activeStudentId = roster[0].id;
    }
    const student = getStudentById(state.activeStudentId) || roster[0] || null;
    const displayName = getStudentDisplayName(student);
    const xpVal = student ? (Number(student.xp) || 0) : 0;
    const monsterSvg = renderStudentMonsterSvg(student, 74);
    const avatarUrl = getStudentAvatarUrl(student);

    const optionsHtml = roster.map(s => `
      <option value="${s.id}" ${student && s.id === student.id ? 'selected' : ''}>
        ${getStudentDisplayName(s)} (${Number(s.xp) || 0} XP)
      </option>
    `).join('');

    box.innerHTML = `
      <div class="crewmate-top-row">
        <div class="crewmate-monster-stage">
          <div class="crewmate-monster-sprite">${monsterSvg}</div>
          <div class="pedestal-disc"></div>
          ${avatarUrl ? `<img src="${avatarUrl}" class="crewmate-student-avatar" alt="">` : ''}
        </div>
        <div class="crewmate-info">
          <div class="crewmate-role-tag">🧑‍🚀 Active Crewmate</div>
          <div class="crewmate-name" title="${displayName}">${displayName}</div>
          <div class="crewmate-xp-line">⭐ ${xpVal} XP</div>
        </div>
        <button type="button" class="btn-3d btn-amber" id="btn-pick-crewmate" title="Pick Next Student from Class" style="padding:8px 10px; font-size:0.78rem;">
          🎲 Pick Next
        </button>
      </div>
      <div style="display:flex; gap:6px; align-items:center;">
        <select id="crewmate-manual-select" style="flex:1; background:#0f172a; color:#e2e8f0; border:1px solid rgba(148,163,184,0.35); border-radius:8px; padding:4px 8px; font-family:inherit; font-size:0.75rem; font-weight:700;">
          ${optionsHtml}
        </select>
      </div>
      <div class="xp-quick-bar">
        <button type="button" class="btn-3d btn-emerald btn-xp" data-award="1">+1 XP</button>
        <button type="button" class="btn-3d btn-cyan btn-xp" data-award="5">+5 XP</button>
        <button type="button" class="btn-3d btn-violet btn-xp" data-award="10">+10 XP</button>
      </div>
    `;

    const pickBtn = box.querySelector('#btn-pick-crewmate');
    if (pickBtn) {
      pickBtn.addEventListener('pointerdown', () => pickNextCrewmate(true));
    }

    const selectEl = box.querySelector('#crewmate-manual-select');
    if (selectEl) {
      selectEl.addEventListener('change', (e) => {
        state.activeStudentId = e.target.value;
        renderCrewmateBadge();
      });
    }

    box.querySelectorAll('[data-award]').forEach(btn => {
      btn.addEventListener('pointerdown', () => {
        const amt = Number(btn.getAttribute('data-award')) || 1;
        if (student) {
          awardStudentXP(student.id, amt, `Unit 3 Task ${state.stage} Crewmate Reward`);
        }
      });
    });
  }

  // ===========================================================================
  // STAGE ROUTER (1: WIRES -> 2: ASTEROIDS -> 3: REACTOR -> 4: TUG-OF-WAR)
  // ===========================================================================
  function switchStage(stageNum) {
    state.stage = stageNum;
    if (stageNum === 1) {
      initWireRound(state.wireRoundIdx);
    } else if (stageNum === 2) {
      state.crewProgress = Math.max(state.crewProgress, 33);
      initAsteroidRound(state.asteroidIdx);
    } else if (stageNum === 3) {
      state.crewProgress = Math.max(state.crewProgress, 66);
      initReactorRound(state.reactorIdx);
    } else if (stageNum === 4) {
      state.crewProgress = 100;
      initTugOfWar();
    }
    updateCrewProgress();
  }

  function renderUpperShowcaseCard(badgeText, headlineHtml, subtextHtml, imgUrl, captionText, speakText) {
    const topMount = document.getElementById('upper-stage-mount');
    if (!topMount) return;

    topMount.innerHTML = `
      <div class="upper-showcase-grid">
        <div class="visual-clue-stage glass-panel">
          <div class="framed-jpg-card">
            <div class="framed-jpg-viewport">
              <img id="showcase-main-img" src="${imgUrl}" alt="${captionText}">
            </div>
            <div class="framed-jpg-caption" id="showcase-main-caption">${captionText}</div>
          </div>
          <div class="prompt-narrative-box">
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <span class="task-badge-pill">${badgeText}</span>
              <button type="button" class="btn-3d btn-cyan" id="btn-speak-prompt" style="padding:4px 10px; font-size:0.74rem;">
                🔊 Read Aloud
              </button>
            </div>
            <div class="prompt-headline" id="showcase-headline">${headlineHtml}</div>
            <div class="prompt-subtext" id="showcase-subtext">${subtextHtml}</div>
          </div>
        </div>
        <div class="crewmate-roster-card glass-panel" id="crewmate-roster-card"></div>
      </div>
    `;

    renderCrewmateBadge();

    const speakBtn = document.getElementById('btn-speak-prompt');
    if (speakBtn && speakText) {
      speakBtn.addEventListener('pointerdown', () => {
        if (AUDIO) AUDIO.speak(speakText);
      });
    }
  }

  // ===========================================================================
  // TASK 1: ELECTRICAL WIRES (0% -> 33%)
  // ===========================================================================
  function initWireRound(roundIdx) {
    const rounds = DATA.task1Wires;
    state.wireRoundIdx = ((roundIdx % rounds.length) + rounds.length) % rounds.length;
    const round = rounds[state.wireRoundIdx];
    state.selectedWireId = round.wires[0].id;
    state.matchedWireIds = [];
    state.shuffledTargets = shuffleArray(round.wires);

    const firstWire = round.wires[0];
    renderUpperShowcaseCard(
      `⚡ Task 1 · Electrical Wires (${state.wireRoundIdx + 1}/${rounds.length})`,
      round.title,
      round.subtitle,
      firstWire.img,
      firstWire.caption,
      `${round.title}. ${round.subtitle}`
    );

    renderWiresWorkbench();
    updateCrewProgress();
  }

  function renderWiresWorkbench() {
    const bottomMount = document.getElementById('bottom-stage-mount');
    if (!bottomMount) return;
    const round = DATA.task1Wires[state.wireRoundIdx];

    const leftHtml = round.wires.map(w => {
      const isSelected = state.selectedWireId === w.id;
      const isMatched = state.matchedWireIds.includes(w.id);
      return `
        <button type="button"
          class="wire-terminal-btn ${isSelected ? 'selected' : ''} ${isMatched ? 'matched' : ''}"
          style="--wire-color: ${w.color};"
          data-wire-left="${w.id}">
          <span>${w.term}</span>
          <span class="wire-socket-dot" id="socket-left-${w.id}"></span>
        </button>
      `;
    }).join('');

    const rightHtml = state.shuffledTargets.map(t => {
      const isMatched = state.matchedWireIds.includes(t.id);
      return `
        <button type="button"
          class="wire-target-card ${isMatched ? 'matched' : ''}"
          style="${isMatched ? `border-color:${t.color};` : ''}"
          data-wire-right="${t.id}">
          <span class="wire-socket-dot" id="socket-right-${t.id}" style="--wire-color:${isMatched ? t.color : '#64748b'};"></span>
          <img src="${t.img}" class="wire-target-thumb" alt="${t.caption}">
          <span class="wire-target-meaning">${t.meaning}</span>
        </button>
      `;
    }).join('');

    bottomMount.innerHTML = `
      <div class="wires-workbench" id="wires-workbench">
        <div class="wire-column-left">${leftHtml}</div>
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; pointer-events:none;">
          <div style="font-size:0.78rem; font-weight:800; color:#94a3b8; text-transform:uppercase; letter-spacing:1px;">
            Tap Left Wire → Tap Matching Picture Card
          </div>
        </div>
        <div class="wire-column-right">${rightHtml}</div>
        <svg class="wires-svg-layer" id="wires-svg-layer"></svg>
      </div>
    `;

    bottomMount.querySelectorAll('[data-wire-left]').forEach(btn => {
      btn.addEventListener('pointerdown', () => {
        const wid = btn.getAttribute('data-wire-left');
        if (state.matchedWireIds.includes(wid)) return;
        state.selectedWireId = wid;
        const wObj = round.wires.find(x => x.id === wid);
        if (wObj) {
          const mainImg = document.getElementById('showcase-main-img');
          const mainCap = document.getElementById('showcase-main-caption');
          if (mainImg) mainImg.src = wObj.img;
          if (mainCap) mainCap.textContent = wObj.caption;
          if (AUDIO) {
            AUDIO.playCardFlip();
            AUDIO.speak(wObj.term);
          }
        }
        renderWiresWorkbench();
      });
    });

    bottomMount.querySelectorAll('[data-wire-right]').forEach(card => {
      card.addEventListener('pointerdown', () => {
        const targetId = card.getAttribute('data-wire-right');
        if (state.matchedWireIds.includes(targetId)) return;
        if (!state.selectedWireId) {
          // Auto-select first unmatched wire if none selected
          const nextUnmatched = round.wires.find(w => !state.matchedWireIds.includes(w.id));
          if (nextUnmatched) state.selectedWireId = nextUnmatched.id;
        }

        if (state.selectedWireId === targetId) {
          // Correct wire connection!
          state.matchedWireIds.push(targetId);
          const matchedWire = round.wires.find(w => w.id === targetId);
          if (matchedWire) {
            const mainImg = document.getElementById('showcase-main-img');
            const mainCap = document.getElementById('showcase-main-caption');
            const subEl = document.getElementById('showcase-subtext');
            if (mainImg) mainImg.src = matchedWire.img;
            if (mainCap) mainCap.textContent = matchedWire.caption;
            if (subEl) subEl.innerHTML = `✅ <strong style="color:#34d399;">${matchedWire.term}</strong> — ${matchedWire.meaning}`;
            if (AUDIO) {
              AUDIO.playCorrect();
              AUDIO.speak(matchedWire.pronounce);
            }
          }
          // Auto-select next unmatched wire
          const nextW = round.wires.find(w => !state.matchedWireIds.includes(w.id));
          state.selectedWireId = nextW ? nextW.id : null;
          renderWiresWorkbench();
          updateCrewProgress();

          if (state.matchedWireIds.length === round.wires.length) {
            setTimeout(() => {
              if (state.wireRoundIdx < DATA.task1Wires.length - 1) {
                showTaskStepModal(
                  `⚡ Wire Panel ${round.roundId} Connected!`,
                  `Awesome job wiring Round ${round.roundId}! Award XP or pick the next crewmate for Round ${DATA.task1Wires[state.wireRoundIdx + 1].roundId}.`,
                  () => initWireRound(state.wireRoundIdx + 1)
                );
              } else {
                showTaskStepModal(
                  '⚡ Task 1 Complete: Electrical Systems Online!',
                  'Crew Task Bar is now at 33%! Ready for Task 2: Clear Asteroids.',
                  () => switchStage(2)
                );
              }
            }, 650);
          }
        } else {
          // Soft-fail elastic wobble + supportive audio hint
          card.classList.remove('soft-wobble');
          void card.offsetWidth;
          card.classList.add('soft-wobble');
          const activeWire = round.wires.find(w => w.id === state.selectedWireId);
          if (AUDIO) {
            AUDIO.playSoftFail();
            if (activeWire) {
              AUDIO.speak(`Look for the picture that matches ${activeWire.term}.`);
            }
          }
        }
      });
    });

    requestAnimationFrame(drawConnectedWireLines);
  }

  function drawConnectedWireLines() {
    const svg = document.getElementById('wires-svg-layer');
    const bench = document.getElementById('wires-workbench');
    if (!svg || !bench) return;

    const benchRect = bench.getBoundingClientRect();
    const round = DATA.task1Wires[state.wireRoundIdx];
    let pathsHtml = '';

    state.matchedWireIds.forEach(wid => {
      const wire = round.wires.find(w => w.id === wid);
      const leftDot = document.getElementById(`socket-left-${wid}`);
      const rightDot = document.getElementById(`socket-right-${wid}`);
      if (!wire || !leftDot || !rightDot) return;

      const r1 = leftDot.getBoundingClientRect();
      const r2 = rightDot.getBoundingClientRect();
      const x1 = r1.left + r1.width / 2 - benchRect.left;
      const y1 = r1.top + r1.height / 2 - benchRect.top;
      const x2 = r2.left + r2.width / 2 - benchRect.left;
      const y2 = r2.top + r2.height / 2 - benchRect.top;
      const cx1 = x1 + (x2 - x1) * 0.42;
      const cx2 = x1 + (x2 - x1) * 0.58;

      pathsHtml += `
        <path d="M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}"
              stroke="rgba(0,0,0,0.55)" stroke-width="14" fill="none" stroke-linecap="round"/>
        <path d="M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}"
              stroke="${wire.color}" stroke-width="9" fill="none" stroke-linecap="round"/>
        <path d="M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}"
              stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.6" fill="none" stroke-linecap="round"/>
      `;
    });

    svg.innerHTML = pathsHtml;
  }

  // ===========================================================================
  // TASK 2: CLEAR ASTEROIDS (33% -> 66%)
  // ===========================================================================
  function initAsteroidRound(idx) {
    const list = DATA.task2Asteroids;
    state.asteroidIdx = ((idx % list.length) + list.length) % list.length;
    state.asteroidLocked = false;
    const item = list[state.asteroidIdx];
    state.asteroidOptions = shuffleArray(item.options);

    const formattedPrompt = item.sentence.replace('___', '<span class="blank-slot" id="ast-blank-slot">?</span>');

    renderUpperShowcaseCard(
      `☄️ Task 2 · Clear Asteroids (${state.asteroidIdx + 1}/${list.length})`,
      formattedPrompt,
      `Tap the asteroid with the <strong>correct spelling</strong> to fire the ship's lasers!`,
      item.img,
      item.caption,
      item.fullSentence
    );

    renderAsteroidsField();
    updateCrewProgress();
  }

  function renderAsteroidsField() {
    const bottomMount = document.getElementById('bottom-stage-mount');
    if (!bottomMount) return;
    const item = DATA.task2Asteroids[state.asteroidIdx];

    const rocksHtml = state.asteroidOptions.map(opt => `
      <button type="button" class="asteroid-btn" data-asteroid="${opt}">
        <span>☄️</span>
        <span>${opt}</span>
      </button>
    `).join('');

    bottomMount.innerHTML = `
      <div class="asteroids-field" id="asteroids-field">
        <div class="reticle-crosshair">
          <div class="reticle-ring"></div>
        </div>
        ${rocksHtml}
        <svg class="wires-svg-layer" id="laser-svg-layer"></svg>
      </div>
    `;

    bottomMount.querySelectorAll('[data-asteroid]').forEach(btn => {
      btn.addEventListener('pointerdown', () => {
        if (state.asteroidLocked) return;
        const chosen = btn.getAttribute('data-asteroid');
        if (chosen === item.answer) {
          state.asteroidLocked = true;
          btn.classList.add('blasted');
          fireLaserBeamAt(btn);

          const slotEl = document.getElementById('ast-blank-slot');
          if (slotEl) {
            slotEl.textContent = item.answer;
            slotEl.style.color = '#34d399';
            slotEl.style.borderBottomColor = '#34d399';
          }
          const subEl = document.getElementById('showcase-subtext');
          if (subEl) {
            subEl.innerHTML = `🎯 <strong style="color:#34d399;">Direct Hit!</strong> "${item.fullSentence}"`;
          }

          if (AUDIO) {
            AUDIO.playLaserHit();
            AUDIO.speak(`${item.answer}! ${item.fullSentence}`);
          }

          setTimeout(() => {
            if (state.asteroidIdx < DATA.task2Asteroids.length - 1) {
              initAsteroidRound(state.asteroidIdx + 1);
            } else {
              state.crewProgress = Math.max(state.crewProgress, 66);
              updateCrewProgress();
              showTaskStepModal(
                '☄️ Task 2 Complete: Asteroid Field Cleared!',
                'Crew Task Bar is now at 66%! Ready for Task 3: Reactor Sequence.',
                () => switchStage(3)
              );
            }
          }, 1250);
        } else {
          btn.classList.remove('soft-wobble');
          void btn.offsetWidth;
          btn.classList.add('soft-wobble');
          const subEl = document.getElementById('showcase-subtext');
          if (subEl) {
            subEl.innerHTML = `💡 <strong style="color:#fbbf24;">Hint:</strong> ${item.hint}`;
          }
          if (AUDIO) {
            AUDIO.playSoftFail();
            AUDIO.speak(item.hint);
          }
        }
      });
    });
  }

  function fireLaserBeamAt(targetBtn) {
    const svg = document.getElementById('laser-svg-layer');
    const field = document.getElementById('asteroids-field');
    if (!svg || !field || !targetBtn) return;

    const fRect = field.getBoundingClientRect();
    const tRect = targetBtn.getBoundingClientRect();
    const tx = tRect.left + tRect.width / 2 - fRect.left;
    const ty = tRect.top + tRect.height / 2 - fRect.top;

    svg.innerHTML = `
      <line x1="40" y1="${fRect.height}" x2="${tx}" y2="${ty}" stroke="#10b981" stroke-width="8" stroke-linecap="round"/>
      <line x1="${fRect.width - 40}" y1="${fRect.height}" x2="${tx}" y2="${ty}" stroke="#38bdf8" stroke-width="8" stroke-linecap="round"/>
      <circle cx="${tx}" cy="${ty}" r="28" fill="rgba(52, 211, 153, 0.55)" stroke="#ffffff" stroke-width="4"/>
    `;
  }

  // ===========================================================================
  // TASK 3: REACTOR SEQUENCE (66% -> 100%)
  // ===========================================================================
  function initReactorRound(idx) {
    const list = DATA.task3Reactor;
    state.reactorIdx = ((idx % list.length) + list.length) % list.length;
    state.reactorLocked = false;
    const item = list[state.reactorIdx];
    state.reactorPlaced = [];
    state.reactorPool = shuffleArray(item.tokens.map((word, i) => ({ index: i, word })));

    renderUpperShowcaseCard(
      `⚛️ Task 3 · Reactor Sequence (${state.reactorIdx + 1}/${list.length})`,
      item.clue,
      `Tap the glowing word cells in order to build the sentence and stabilize the reactor!`,
      item.img,
      item.caption,
      item.clue
    );

    renderReactorWorkbench();
    updateCrewProgress();
  }

  function renderReactorWorkbench() {
    const bottomMount = document.getElementById('bottom-stage-mount');
    if (!bottomMount) return;
    const item = DATA.task3Reactor[state.reactorIdx];

    const placedHtml = state.reactorPlaced.length
      ? state.reactorPlaced.map((p, idx) => `
          <button type="button" class="reactor-cell-btn placed" data-placed-idx="${idx}">
            ${p.word}
          </button>
        `).join('')
      : `<span style="color:#64748b; font-weight:800; font-size:1.05rem;">Tap words below in order (${item.tokens.length} words)...</span>`;

    const poolHtml = state.reactorPool.map(cell => {
      const isUsed = state.reactorPlaced.some(p => p.index === cell.index);
      return `
        <button type="button" class="reactor-cell-btn ${isUsed ? 'used' : ''}" data-pool-idx="${cell.index}">
          ${cell.word}
        </button>
      `;
    }).join('');

    bottomMount.innerHTML = `
      <div class="reactor-workbench glass-panel" style="padding:14px 18px;">
        <div class="reactor-output-tray" id="reactor-output-tray">
          ${placedHtml}
        </div>
        <div class="reactor-word-pool">
          ${poolHtml}
        </div>
      </div>
    `;

    bottomMount.querySelectorAll('[data-pool-idx]').forEach(btn => {
      btn.addEventListener('pointerdown', () => {
        if (state.reactorLocked) return;
        const tokenIndex = Number(btn.getAttribute('data-pool-idx'));
        const expectedWord = item.tokens[state.reactorPlaced.length];
        const tappedObj = state.reactorPool.find(c => c.index === tokenIndex);
        if (!tappedObj) return;

        // Accept if the word matches the next expected word in the sentence
        if (tappedObj.word === expectedWord) {
          state.reactorPlaced.push(tappedObj);
          if (AUDIO) {
            AUDIO.playCardFlip();
            AUDIO.speak(tappedObj.word);
          }
          renderReactorWorkbench();

          if (state.reactorPlaced.length === item.tokens.length) {
            state.reactorLocked = true;
            const fullSent = item.tokens.join(' ');
            const subEl = document.getElementById('showcase-subtext');
            if (subEl) {
              subEl.innerHTML = `⚛️ <strong style="color:#34d399;">Reactor Stabilized!</strong> "${fullSent}"`;
            }
            if (AUDIO) {
              AUDIO.playCorrect();
              AUDIO.speak(fullSent);
            }
            setTimeout(() => {
              if (state.reactorIdx < DATA.task3Reactor.length - 1) {
                initReactorRound(state.reactorIdx + 1);
              } else {
                state.crewProgress = 100;
                updateCrewProgress();
                if (AUDIO) AUDIO.playFanfare();
                showTaskStepModal(
                  '🚨 CREW BAR 100% — BOSS FINALE UNLOCKED!',
                  'All 3 ship tasks are complete! Get ready for the 2-Player Monster Bridge Tug-of-War!',
                  () => switchStage(4)
                );
              }
            }, 1350);
          }
        } else {
          // Soft-fail wobble + hint of which word comes next
          btn.classList.remove('soft-wobble');
          void btn.offsetWidth;
          btn.classList.add('soft-wobble');
          const subEl = document.getElementById('showcase-subtext');
          if (subEl) {
            subEl.innerHTML = `💡 <strong style="color:#fbbf24;">Hint:</strong> Look for the word <strong>"${expectedWord}"</strong> next!`;
          }
          if (AUDIO) {
            AUDIO.playSoftFail();
            AUDIO.speak(`Try ${expectedWord} next!`);
          }
        }
      });
    });

    bottomMount.querySelectorAll('[data-placed-idx]').forEach(btn => {
      btn.addEventListener('pointerdown', () => {
        if (state.reactorLocked) return;
        const idx = Number(btn.getAttribute('data-placed-idx'));
        state.reactorPlaced = state.reactorPlaced.slice(0, idx);
        renderReactorWorkbench();
      });
    });
  }

  // ===========================================================================
  // STEP 3: UNLOCKED BOSS FINALE — 2-PLAYER MONSTER BRIDGE TUG-OF-WAR
  // ===========================================================================
  function initTugOfWar() {
    const roster = getClassStudents(state.activeClassId);
    if ((!state.p1StudentId || !state.p2StudentId) && roster.length) {
      const shuf = shuffleArray(roster);
      state.p1StudentId = shuf[0].id;
      state.p2StudentId = (shuf[1] || shuf[0]).id;
    }
    state.ropePosition = 0;
    state.towOrder = shuffleArray(DATA.tugOfWarQuestions.map((_, i) => i));
    state.towCursor = 0;
    state.towLocked = false;

    prepareCurrentTowQuestion();
    renderStage4TugOfWar();
  }

  function getCurrentTowQuestion() {
    const idx = state.towOrder[state.towCursor % state.towOrder.length] || 0;
    return DATA.tugOfWarQuestions[idx];
  }

  function prepareCurrentTowQuestion() {
    const qObj = getCurrentTowQuestion();
    state.p1Options = shuffleArray(qObj.options);
    state.p2Options = shuffleArray(qObj.options);
    state.towLocked = false;
  }

  function renderStage4TugOfWar() {
    const topMount = document.getElementById('upper-stage-mount');
    const bottomMount = document.getElementById('bottom-stage-mount');
    if (!topMount || !bottomMount) return;

    const p1 = getStudentById(state.p1StudentId);
    const p2 = getStudentById(state.p2StudentId);
    const p1Name = getStudentDisplayName(p1);
    const p2Name = getStudentDisplayName(p2);
    const p1Svg = renderStudentMonsterSvg(p1, 90);
    const p2Svg = renderStudentMonsterSvg(p2, 90);
    const qObj = getCurrentTowQuestion();

    const offsetPx = state.ropePosition * 52; // -3..+3 -> -156px .. +156px

    const dotsHtml = [-3, -2, -1, 0, 1, 2, 3].map(step => `
      <span class="step-marker ${step === state.ropePosition ? 'active-knot' : ''}" title="Step ${step}"></span>
    `).join('');

    topMount.innerHTML = `
      <div class="tug-top-arena">
        <!-- Left: 2-Player Monster Bridge Tug-of-War Arena -->
        <div class="bridge-stage-card glass-panel">
          <div class="bridge-fighters-header">
            <div class="fighter-pill p1" id="tug-p1-pill">
              <span>🔵 ${p1Name}</span>
              <span style="font-size:0.76rem; color:#6ee7b7;">(${Number(p1 && p1.xp) || 0} XP)</span>
            </div>
            <div style="display:flex; gap:6px; align-items:center;">
              <button type="button" class="btn-3d btn-amber" id="btn-pick-challengers" style="padding:6px 12px; font-size:0.78rem;">
                🎲 Pick 2 Challengers
              </button>
              <button type="button" class="btn-3d btn-emerald" id="btn-finish-tow" style="padding:6px 10px; font-size:0.76rem;">
                🏆 Award XP
              </button>
            </div>
            <div class="fighter-pill p2" id="tug-p2-pill">
              <span>🟠 ${p2Name}</span>
              <span style="font-size:0.76rem; color:#6ee7b7;">(${Number(p2 && p2.xp) || 0} XP)</span>
            </div>
          </div>

          <div class="bridge-scene">
            <div class="island-cliff"></div>
            <div class="rope-track"></div>
            <div class="tug-fighters-carriage" id="tug-fighters-carriage" style="transform: translateX(${offsetPx}px);">
              <div class="tug-monster-box">
                <div class="tug-monster-svg">${p1Svg}</div>
              </div>
              <div class="tug-knot-flag">🪢</div>
              <div class="tug-monster-box p2-flip">
                <div class="tug-monster-svg">${p2Svg}</div>
              </div>
            </div>
            <div class="rope-steps-dots">${dotsHtml}</div>
            <div class="island-cliff"></div>
          </div>
        </div>

        <!-- Right: High-Res JPEG Question Card -->
        <div class="visual-clue-stage glass-panel" style="grid-template-columns: 165px 1fr; padding:10px;">
          <div class="framed-jpg-card" style="max-height:215px;">
            <div class="framed-jpg-viewport">
              <img src="${qObj.img}" alt="${qObj.caption}">
            </div>
            <div class="framed-jpg-caption">${qObj.caption}</div>
          </div>
          <div class="prompt-narrative-box" style="gap:6px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="task-badge-pill">🌉 Q${(state.towCursor % DATA.tugOfWarQuestions.length) + 1}/15</span>
              <button type="button" class="btn-3d btn-cyan" id="btn-tow-speak" style="padding:4px 8px; font-size:0.72rem;">🔊</button>
            </div>
            <div class="prompt-headline" style="font-size:clamp(0.95rem, 1.45vw, 1.22rem);">${qObj.q}</div>
            <div class="prompt-subtext" id="tow-status-line" style="font-size:0.8rem; color:#fde047;">
              First player to tap the right answer pulls the rope 1 step!
            </div>
          </div>
        </div>
      </div>
    `;

    bottomMount.innerHTML = `
      <div class="tug-split-controls">
        <!-- Player 1 (Blue Left Pad) -->
        <div class="player-pad p1-pad">
          <div class="pad-header" style="color:#93c5fd;">
            <span>🔵 PLAYER 1: ${p1Name}</span>
            <span>Pull to -3 to Win!</span>
          </div>
          <div class="pad-grid">
            ${state.p1Options.map(opt => `
              <button type="button" class="tug-opt-btn blue-opt" data-player="1" data-opt="${opt.replace(/"/g, '&quot;')}">
                ${opt}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Player 2 (Orange Right Pad) -->
        <div class="player-pad p2-pad">
          <div class="pad-header" style="color:#fdba74;">
            <span>🟠 PLAYER 2: ${p2Name}</span>
            <span>Pull to +3 to Win!</span>
          </div>
          <div class="pad-grid">
            ${state.p2Options.map(opt => `
              <button type="button" class="tug-opt-btn orange-opt" data-player="2" data-opt="${opt.replace(/"/g, '&quot;')}">
                ${opt}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const pickChallengersBtn = document.getElementById('btn-pick-challengers');
    if (pickChallengersBtn) {
      pickChallengersBtn.addEventListener('pointerdown', () => pickTwoChallengers(true));
    }

    const finishTowBtn = document.getElementById('btn-finish-tow');
    if (finishTowBtn) {
      finishTowBtn.addEventListener('pointerdown', () => showTugVictoryModal());
    }

    const speakBtn = document.getElementById('btn-tow-speak');
    if (speakBtn) {
      speakBtn.addEventListener('pointerdown', () => {
        if (AUDIO) AUDIO.speak(qObj.q);
      });
    }

    bottomMount.querySelectorAll('.tug-opt-btn').forEach(btn => {
      btn.addEventListener('pointerdown', () => {
        if (state.towLocked || btn.disabled) return;
        const playerNum = Number(btn.getAttribute('data-player'));
        const chosen = btn.getAttribute('data-opt');

        if (chosen === qObj.answer) {
          state.towLocked = true;
          btn.classList.add('correct-flash');
          if (playerNum === 1) {
            state.ropePosition = Math.max(-3, state.ropePosition - 1);
          } else {
            state.ropePosition = Math.min(3, state.ropePosition + 1);
          }

          const winnerStudent = playerNum === 1 ? p1 : p2;
          const statusEl = document.getElementById('tow-status-line');
          if (statusEl) {
            statusEl.innerHTML = `⚡ <strong style="color:#34d399;">${getStudentDisplayName(winnerStudent)} pulled the rope!</strong> Answer: ${qObj.answer}`;
          }

          const carriage = document.getElementById('tug-fighters-carriage');
          if (carriage) {
            carriage.style.transform = `translateX(${state.ropePosition * 52}px)`;
          }

          if (AUDIO) {
            AUDIO.playCorrect();
            AUDIO.speak(`${getStudentDisplayName(winnerStudent)} pulls the rope! ${qObj.answer}`);
          }

          setTimeout(() => {
            if (state.ropePosition <= -3 || state.ropePosition >= 3) {
              if (AUDIO) AUDIO.playFanfare();
              showTugVictoryModal();
            } else {
              state.towCursor++;
              prepareCurrentTowQuestion();
              renderStage4TugOfWar();
            }
          }, 1150);
        } else {
          // Individual wrong button wobble + brief cooldown so the other player can still answer!
          btn.disabled = true;
          btn.classList.add('soft-wobble');
          if (AUDIO) AUDIO.playSoftFail();
          setTimeout(() => {
            btn.disabled = false;
            btn.classList.remove('soft-wobble');
          }, 1000);
        }
      });
    });
  }

  function renderTugHeaderNames() {
    const p1 = getStudentById(state.p1StudentId);
    const p2 = getStudentById(state.p2StudentId);
    const p1El = document.getElementById('tug-p1-pill');
    const p2El = document.getElementById('tug-p2-pill');
    if (p1El && p1) {
      p1El.innerHTML = `<span>🔵 ${getStudentDisplayName(p1)}</span> <span style="font-size:0.76rem; color:#6ee7b7;">(${Number(p1.xp) || 0} XP)</span>`;
    }
    if (p2El && p2) {
      p2El.innerHTML = `<span>🟠 ${getStudentDisplayName(p2)}</span> <span style="font-size:0.76rem; color:#6ee7b7;">(${Number(p2.xp) || 0} XP)</span>`;
    }
  }

  // ===========================================================================
  // CELEBRATION & XP MODALS
  // ===========================================================================
  function showTaskStepModal(title, message, onContinue) {
    const modal = document.getElementById('mission-modal');
    const body = document.getElementById('mission-modal-body');
    if (!modal || !body) return;

    const student = getStudentById(state.activeStudentId);
    const sName = getStudentDisplayName(student);
    const monsterSvg = renderStudentMonsterSvg(student, 110);

    body.innerHTML = `
      <div style="width:115px; height:115px; margin:0 auto;">${monsterSvg}</div>
      <h2 style="font-size:1.55rem; font-weight:900; color:#f8fafc;">${title}</h2>
      <p style="font-size:0.95rem; color:#cbd5e1; font-weight:600;">${message}</p>
      <div style="background:rgba(2,6,23,0.65); border:1px solid rgba(56,189,248,0.35); border-radius:14px; padding:12px; width:100%;">
        <div style="font-size:0.82rem; font-weight:800; color:#38bdf8; margin-bottom:8px;">
          ⭐ Award XP to ${sName}:
        </div>
        <div style="display:flex; justify-content:center; gap:10px;">
          <button type="button" class="btn-3d btn-emerald" data-modal-xp="1">+1 XP</button>
          <button type="button" class="btn-3d btn-cyan" data-modal-xp="5">+5 XP</button>
          <button type="button" class="btn-3d btn-violet" data-modal-xp="10">+10 XP</button>
        </div>
      </div>
      <div style="display:flex; gap:10px; justify-content:center; width:100%; margin-top:4px;">
        <button type="button" class="btn-3d btn-amber" id="modal-pick-next">🎲 Pick Next Crewmate & Continue</button>
        <button type="button" class="btn-3d btn-cyan" id="modal-continue-btn">Continue ▶</button>
      </div>
    `;

    modal.classList.add('open');

    body.querySelectorAll('[data-modal-xp]').forEach(btn => {
      btn.addEventListener('pointerdown', () => {
        const amt = Number(btn.getAttribute('data-modal-xp')) || 5;
        if (student) awardStudentXP(student.id, amt, title);
      });
    });

    const pickNextBtn = document.getElementById('modal-pick-next');
    if (pickNextBtn) {
      pickNextBtn.addEventListener('pointerdown', () => {
        modal.classList.remove('open');
        pickNextCrewmate(true);
        if (typeof onContinue === 'function') onContinue();
      });
    }

    const contBtn = document.getElementById('modal-continue-btn');
    if (contBtn) {
      contBtn.addEventListener('pointerdown', () => {
        modal.classList.remove('open');
        if (typeof onContinue === 'function') onContinue();
      });
    }
  }

  function showTugVictoryModal() {
    const modal = document.getElementById('mission-modal');
    const body = document.getElementById('mission-modal-body');
    if (!modal || !body) return;

    const p1 = getStudentById(state.p1StudentId);
    const p2 = getStudentById(state.p2StudentId);
    const p1Name = getStudentDisplayName(p1);
    const p2Name = getStudentDisplayName(p2);
    const winner = state.ropePosition < 0 ? p1 : (state.ropePosition > 0 ? p2 : p1);
    const winnerName = state.ropePosition === 0 ? `${p1Name} & ${p2Name}` : getStudentDisplayName(winner);

    body.innerHTML = `
      <div style="display:flex; gap:20px; align-items:center; justify-content:center;">
        <div style="text-align:center;">
          <div style="width:92px; height:92px; margin:0 auto;">${renderStudentMonsterSvg(p1, 90)}</div>
          <div style="font-weight:900; font-size:0.9rem; color:#93c5fd; margin-top:4px;">🔵 ${p1Name}</div>
          <div style="display:flex; gap:5px; margin-top:6px; justify-content:center;">
            <button type="button" class="btn-3d btn-emerald" style="padding:5px 8px; font-size:0.75rem;" data-p1-xp="1">+1</button>
            <button type="button" class="btn-3d btn-cyan" style="padding:5px 8px; font-size:0.75rem;" data-p1-xp="5">+5</button>
            <button type="button" class="btn-3d btn-violet" style="padding:5px 8px; font-size:0.75rem;" data-p1-xp="10">+10</button>
          </div>
        </div>
        <div style="font-size:2rem;">🏆</div>
        <div style="text-align:center;">
          <div style="width:92px; height:92px; margin:0 auto;">${renderStudentMonsterSvg(p2, 90)}</div>
          <div style="font-weight:900; font-size:0.9rem; color:#fdba74; margin-top:4px;">🟠 ${p2Name}</div>
          <div style="display:flex; gap:5px; margin-top:6px; justify-content:center;">
            <button type="button" class="btn-3d btn-emerald" style="padding:5px 8px; font-size:0.75rem;" data-p2-xp="1">+1</button>
            <button type="button" class="btn-3d btn-cyan" style="padding:5px 8px; font-size:0.75rem;" data-p2-xp="5">+5</button>
            <button type="button" class="btn-3d btn-violet" style="padding:5px 8px; font-size:0.75rem;" data-p2-xp="10">+10</button>
          </div>
        </div>
      </div>
      <h2 style="font-size:1.5rem; font-weight:900; color:#fde047; margin-top:6px;">
        🎉 Bridge Tug-of-War Champion: ${winnerName}!
      </h2>
      <p style="font-size:0.9rem; color:#cbd5e1;">Tap the +1 / +5 / +10 XP buttons above for each player, then start a new match!</p>
      <div style="display:flex; gap:10px; justify-content:center; width:100%;">
        <button type="button" class="btn-3d btn-amber" id="tow-new-challengers">🎲 Pick 2 New Challengers</button>
        <button type="button" class="btn-3d btn-cyan" id="tow-rematch">🔄 Rematch</button>
      </div>
    `;

    modal.classList.add('open');

    body.querySelectorAll('[data-p1-xp]').forEach(btn => {
      btn.addEventListener('pointerdown', () => {
        const amt = Number(btn.getAttribute('data-p1-xp')) || 5;
        if (p1) awardStudentXP(p1.id, amt, 'Unit 3 Tug-of-War Finale');
      });
    });

    body.querySelectorAll('[data-p2-xp]').forEach(btn => {
      btn.addEventListener('pointerdown', () => {
        const amt = Number(btn.getAttribute('data-p2-xp')) || 5;
        if (p2) awardStudentXP(p2.id, amt, 'Unit 3 Tug-of-War Finale');
      });
    });

    const newBtn = document.getElementById('tow-new-challengers');
    if (newBtn) {
      newBtn.addEventListener('pointerdown', () => {
        modal.classList.remove('open');
        pickTwoChallengers(true);
      });
    }

    const rematchBtn = document.getElementById('tow-rematch');
    if (rematchBtn) {
      rematchBtn.addEventListener('pointerdown', () => {
        modal.classList.remove('open');
        state.ropePosition = 0;
        state.towCursor++;
        prepareCurrentTowQuestion();
        renderStage4TugOfWar();
      });
    }
  }

  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================
  function initApp() {
    state.activeClassId = detectInitialClass();
    renderClassSwitcher();

    const roster = getClassStudents(state.activeClassId);
    if (roster.length) {
      state.activeStudentId = roster[0].id;
    }

    document.querySelectorAll('.stage-tab-btn').forEach(btn => {
      btn.addEventListener('pointerdown', () => {
        const stg = Number(btn.getAttribute('data-stage')) || 1;
        switchStage(stg);
      });
    });

    const muteBtn = document.getElementById('btn-mute-audio');
    if (muteBtn) {
      muteBtn.addEventListener('pointerdown', () => {
        if (!AUDIO) return;
        const isMuted = AUDIO.toggleMute();
        muteBtn.textContent = isMuted ? '🔇' : '🔊';
      });
    }

    const fsBtn = document.getElementById('btn-fullscreen');
    if (fsBtn) {
      fsBtn.addEventListener('pointerdown', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }

    window.addEventListener('resize', () => {
      if (state.stage === 1) {
        requestAnimationFrame(drawConnectedWireLines);
      }
    });

    switchStage(1);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})(typeof window !== 'undefined' ? window : this);
