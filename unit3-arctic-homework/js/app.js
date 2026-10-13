/**
 * UNIT 3 HOMEWORK ASSIGNMENT CONTROLLER — "THE ARCTIC RESCUE"
 * - Integrates with schoolStore (Classes 3A, 3B, 4A, 4B), monster-renderer.js,
 *   MilestoneCeremony.pictureOf, and AdventureSupabase live XP + homework sync.
 * - Non-linear 3-zone Arctic Hub Map + Strict No-Fail "Snowy Dead End" hints.
 */

(function () {
  const STORAGE_KEY = 'eaa_unit3_arctic_hw_v1';
  const DATA = window.UNIT3_HOMEWORK_DATA;

  const state = {
    screen: 'opening', // 'opening' | 'hub' | 'zone1' | 'zone2' | 'zone3' | 'finale'
    classId: '3A',
    studentId: null,
    perspective: 'explorer', // 'explorer' | 'polarBear'
    trackFilter: 'all', // 'all' | 'grade3' | 'grade4'
    sessionXP: 0,
    zoneProgress: {
      zone1: { stepIndex: 0, completed: false, solvedIds: {} },
      zone2: { stepIndex: 0, completed: false, solvedIds: {}, bearEnergy: 25 },
      zone3: {
        part: 'sort', // 'sort' | 'situations'
        sortIndex: 0,
        sitIndex: 0,
        completed: false,
        solvedSortIds: {},
        solvedSitIds: {}
      }
    },
    inventory: [], // array of tool IDs unlocked
    feedbackState: null, // { type: 'deadEnd' | 'success', title, message, canAdvance }
    finaleAwarded: false
  };

  /* ==========================================================================
     INITIALIZATION & STATE PERSISTENCE
     ========================================================================== */
  function loadSavedProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          if (parsed.classId) state.classId = parsed.classId;
          if (parsed.studentId) state.studentId = parsed.studentId;
          if (parsed.perspective) state.perspective = parsed.perspective;
          if (parsed.trackFilter) state.trackFilter = parsed.trackFilter;
          if (typeof parsed.sessionXP === 'number') state.sessionXP = parsed.sessionXP;
          if (parsed.zoneProgress) {
            state.zoneProgress = Object.assign(state.zoneProgress, parsed.zoneProgress);
          }
          if (Array.isArray(parsed.inventory)) state.inventory = parsed.inventory;
          if (parsed.finaleAwarded) state.finaleAwarded = !!parsed.finaleAwarded;
        }
      }
    } catch (e) {}

    // URL query overrides
    const params = new URLSearchParams(window.location.search);
    const qClass = params.get('classId') || params.get('class');
    const qStudent = params.get('studentId') || params.get('student');
    if (qClass) {
      const norm = qClass.toUpperCase().replace(/^CLASS-?/, '');
      if (['3A', '3B', '4A', '4B'].includes(norm)) {
        state.classId = norm;
      }
    }
    const qTrack = params.get('track') || params.get('grade');
    if (qTrack === 'money' || qTrack === 'grade3') state.trackFilter = 'grade3';
    if (qTrack === 'bear' || qTrack === 'grade4') state.trackFilter = 'grade4';
    if (qStudent) {
      state.studentId = qStudent;
    }
    const qZone = params.get('zone');
    if (qZone && ['hub', 'zone1', 'zone2', 'zone3'].includes(qZone)) {
      state.screen = qZone;
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          classId: state.classId,
          studentId: state.studentId,
          perspective: state.perspective,
          trackFilter: state.trackFilter,
          sessionXP: state.sessionXP,
          zoneProgress: state.zoneProgress,
          inventory: state.inventory,
          finaleAwarded: state.finaleAwarded
        })
      );
    } catch (e) {}
  }

  /* ==========================================================================
     ROSTER, MONSTER & AVATAR HELPERS
     ========================================================================== */
  function getStore() {
    return window.schoolStore || window.store || null;
  }

  // UI label '3A' -> store id 'class-3a'
  function storeClassId(label) {
    return 'class-' + String(label || '3A').toLowerCase();
  }

  function studentXP(s) {
    return Math.max(0, Number(s && s.xp) || 0);
  }

  function studentLevel(s) {
    const st = getStore();
    try {
      if (st && s && typeof st.getStudentMonsterState === 'function') {
        const m = st.getStudentMonsterState(s.id);
        if (m && m.level) return m.level;
      }
    } catch (e) {}
    return 1;
  }

  function monsterNameOf(s) {
    return (s && s.monsterProfile && s.monsterProfile.name) || (s && s.monsterName) || 'Monster Companion';
  }

  function getStudentsForClass(classId) {
    const st = getStore();
    if (!st) return [];
    let list = [];
    if (typeof st.getStudentsByClass === 'function') {
      try { list = st.getStudentsByClass(storeClassId(classId)) || []; } catch (e) { list = []; }
    }
    if (!list.length && st.state && Array.isArray(st.state.students)) {
      list = st.state.students.filter((s) => s && !s.archived && String(s.classId) === storeClassId(classId));
    }
    return list;
  }

  function getActiveStudent() {
    const list = getStudentsForClass(state.classId);
    if (!list.length) return null;
    let found = list.find((s) => s.id === state.studentId);
    if (!found) {
      found = list[0];
      state.studentId = found.id;
    }
    return found;
  }

  function studentName(s) {
    if (!s) return 'Explorer';
    return s.name || [s.firstName, s.lastName].filter(Boolean).join(' ') || 'Explorer';
  }

  function renderStudentAvatarHTML(student, size = 38) {
    if (!student) return `<span>🧑‍🚀</span>`;
    let pic = student.avatarUrl || (student.extraData && student.extraData.avatarUrl) || null;
    if (!pic && window.MilestoneCeremony && typeof window.MilestoneCeremony.pictureOf === 'function') {
      try { pic = window.MilestoneCeremony.pictureOf(student); } catch (e) { pic = null; }
    }
    if (pic && typeof pic === 'string') {
      const src = /^(https?:|data:|\.\.\/|\/)/.test(pic) ? pic : '../' + pic;
      return `<img src="${escapeHtml(src)}" alt="${escapeHtml(studentName(student))}" onerror="this.style.display='none'" />`;
    }
    return `<span style="font-weight:900;font-size:${Math.round(size * 0.44)}px;color:#38bdf8;">${escapeHtml(studentName(student).charAt(0))}</span>`;
  }

  function renderMonsterThumbHTML(student, size = 44) {
    const st = getStore();
    if (student && window.MonsterRenderer && typeof window.MonsterRenderer.renderMonsterSVG === 'function') {
      try {
        const mState = st && typeof st.getStudentMonsterState === 'function' ? st.getStudentMonsterState(student.id) : null;
        const profile = student.monsterProfile || {};
        const stageKey = mState && mState.stageKey && mState.stageKey !== 'egg' && mState.stageKey !== 'cracking_egg'
          ? mState.stageKey
          : 'baby';
        let svg = window.MonsterRenderer.renderMonsterSVG({
          stage: stageKey,
          color: profile.baseColor || student.element || 'blue',
          equipped: profile.equipped || {},
          size: size,
          animated: true
        });
        if (svg) return svg.replace(/href="assets\//g, 'href="../assets/');
      } catch (e) {}
    }
    return `<span style="font-size:${Math.round(size * 0.55)}px;">🐲</span>`;
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ==========================================================================
     XP & SUPABASE HOMEWORK SYNC
     ========================================================================== */
  function pushStudentToCloud(student) {
    if (!student) return;
    try {
      if (window.schoolCloudSync && typeof window.schoolCloudSync.saveStudent === 'function') {
        Promise.resolve(window.schoolCloudSync.saveStudent(student)).catch(() => {});
      } else if (window.AdventureSupabase && typeof window.AdventureSupabase.saveStudent === 'function') {
        Promise.resolve(window.AdventureSupabase.saveStudent(student)).catch(() => {});
      }
    } catch (e) {}
  }

  function awardStudentXP(amount, reasonText) {
    const pts = Number(amount) || 0;
    if (pts <= 0) return;
    state.sessionXP += pts;

    const st = getStore();
    const student = getActiveStudent();
    if (student && st && typeof st.giveXP === 'function') {
      try {
        st.giveXP(student.id, pts, reasonText || 'Unit 3 Homework: The Arctic Rescue', 'Homework');
      } catch (e) {}
      pushStudentToCloud(student);
    }
    saveProgress();
    renderHUD();
  }

  function syncHomeworkCompletionToCloud() {
    const st = getStore();
    const student = getActiveStudent();
    if (!student || !st) return;
    try {
      if (!Array.isArray(student.badges)) student.badges = [];
      if (!student.badges.includes(DATA.meta.badgeTitle)) student.badges.push(DATA.meta.badgeTitle);
      if (!student.extraData || typeof student.extraData !== 'object') student.extraData = {};
      if (!student.extraData.homeworkCompleted) student.extraData.homeworkCompleted = {};
      student.extraData.homeworkCompleted['unit3-arctic-homework'] = {
        completed: true,
        perspective: state.perspective,
        xpEarned: state.sessionXP,
        completedAt: new Date().toISOString()
      };
      if (typeof st.save === 'function') st.save();
      pushStudentToCloud(student);
    } catch (e) {}
  }

  function unlockZoneRewards(zoneId) {
    const zone = DATA.zones.find((z) => z.id === zoneId);
    if (!zone || !Array.isArray(zone.rewards)) return;
    let addedNew = false;
    zone.rewards.forEach((toolId) => {
      if (!state.inventory.includes(toolId)) {
        state.inventory.push(toolId);
        addedNew = true;
      }
    });
    if (addedNew && window.arcticAudio) {
      window.arcticAudio.playToolUnlock();
    }
    saveProgress();
    renderInventoryBar();
  }

  function areAllZonesCompleted() {
    return (
      state.zoneProgress.zone1.completed &&
      state.zoneProgress.zone2.completed &&
      state.zoneProgress.zone3.completed
    );
  }

  function updateAuroraBodyClass() {
    if (areAllZonesCompleted() || state.screen === 'finale') {
      document.body.classList.add('aurora-sky-active');
    } else {
      document.body.classList.remove('aurora-sky-active');
    }
  }

  /* ==========================================================================
     FILTERED STEPS BY TRACK
     ========================================================================== */
  function getStepsForZone(zoneKey) {
    const raw = zoneKey === 'zone1' ? DATA.zone1Steps : DATA.zone2Steps;
    if (state.trackFilter === 'all') return raw;
    return raw.filter((item) => item.gradeTag === 'both' || item.gradeTag === state.trackFilter);
  }

  function getZone3SortItems() {
    if (state.trackFilter === 'all') return DATA.zone3SortingItems;
    return DATA.zone3SortingItems.filter((item) => item.gradeTag === 'both' || item.gradeTag === state.trackFilter);
  }

  function getZone3Situations() {
    if (state.trackFilter === 'all') return DATA.zone3Situations;
    return DATA.zone3Situations.filter((item) => item.gradeTag === 'both' || item.gradeTag === state.trackFilter);
  }

  /* ==========================================================================
     RENDER TOP HUD & PERSISTENT BOTTOM INVENTORY BAR
     ========================================================================== */
  function renderHUD() {
    const hudEl = document.getElementById('arctic-hud');
    if (!hudEl) return;

    const student = getActiveStudent();
    const persp = DATA.perspectives[state.perspective] || DATA.perspectives.explorer;
    const monsterName = monsterNameOf(student);
    const sName = student ? studentName(student) : 'Select Explorer';
    const totalXP = studentXP(student);

    const trackLabel =
      state.trackFilter === 'grade3'
        ? '💰 How Much Is It? only'
        : state.trackFilter === 'grade4'
        ? '🐻‍❄️ The Bear and I only'
        : '📚 Both Unit 3 Books';

    hudEl.innerHTML = `
      <div class="hud-brand">
        <a href="../index.html" class="btn-3d btn-3d-glass" style="padding:8px 13px;font-size:0.84rem;" title="Back to English Adventure Academy">
          🏫 Hub
        </a>
        <div class="hud-title-group">
          <h1>🏔️ Unit 3 Homework: The Arctic Rescue</h1>
          <p>${escapeHtml(persp.shortName)} • No-Fail Story Adventure</p>
        </div>
      </div>

      <div class="hud-companion-pill" id="hud-switch-student-btn" title="Click to switch Student or Perspective">
        <div class="hud-avatar-duo">
          <div class="hud-student-avatar">${renderStudentAvatarHTML(student, 38)}</div>
          <div class="hud-monster-avatar">${renderMonsterThumbHTML(student, 38)}</div>
        </div>
        <div class="hud-companion-meta">
          <span class="hud-companion-name">${escapeHtml(sName)} <span style="color:#fbbf24;">(${escapeHtml(state.classId)})</span></span>
          <span class="hud-companion-sub">🐲 ${escapeHtml(monsterName)} • 🤝 ${escapeHtml(persp.shortName)}</span>
        </div>
        <span class="hud-xp-badge">⭐ ${totalXP} XP (+${state.sessionXP})</span>
      </div>

      <div class="hud-controls">
        <button type="button" class="btn-3d btn-3d-glass" id="hud-track-btn" style="padding:8px 12px;font-size:0.82rem;">
          ${trackLabel}
        </button>
        ${
          state.screen !== 'opening'
            ? `<button type="button" class="btn-3d" id="hud-map-btn" style="padding:8px 14px;font-size:0.84rem;">
                 🗺️ Arctic Hub Map
               </button>`
            : ''
        }
        <a href="./worksheet.html" target="_blank" class="btn-3d btn-3d-amber" style="padding:8px 12px;font-size:0.82rem;">
          🖨️ Worksheet
        </a>
        <button type="button" class="btn-3d btn-3d-glass" id="hud-mute-btn" style="padding:8px 12px;font-size:0.84rem;">
          ${window.arcticAudio && window.arcticAudio.muted ? '🔇 Muted' : '🔊 Audio'}
        </button>
      </div>
    `;

    const switchBtn = document.getElementById('hud-switch-student-btn');
    if (switchBtn) {
      switchBtn.addEventListener('pointerdown', () => {
        if (window.arcticAudio) window.arcticAudio.playCardFlip();
        state.screen = 'opening';
        state.feedbackState = null;
        renderMain();
      });
    }

    const mapBtn = document.getElementById('hud-map-btn');
    if (mapBtn) {
      mapBtn.addEventListener('pointerdown', () => {
        if (window.arcticAudio) window.arcticAudio.playCardFlip();
        state.screen = 'hub';
        state.feedbackState = null;
        renderMain();
      });
    }

    const trackBtn = document.getElementById('hud-track-btn');
    if (trackBtn) {
      trackBtn.addEventListener('pointerdown', () => {
        const order = ['all', 'grade3', 'grade4'];
        const nextIdx = (order.indexOf(state.trackFilter) + 1) % order.length;
        state.trackFilter = order[nextIdx];
        state.zoneProgress.zone1.stepIndex = 0;
        state.zoneProgress.zone2.stepIndex = 0;
        state.zoneProgress.zone3.sortIndex = 0;
        state.zoneProgress.zone3.sitIndex = 0;
        state.feedbackState = null;
        saveProgress();
        renderHUD();
        renderMain();
      });
    }

    const muteBtn = document.getElementById('hud-mute-btn');
    if (muteBtn) {
      muteBtn.addEventListener('pointerdown', () => {
        if (window.arcticAudio) window.arcticAudio.toggleMute();
        renderHUD();
      });
    }
  }

  function renderInventoryBar() {
    const dockEl = document.getElementById('explorer-inventory-dock');
    if (!dockEl) return;

    const slotsHtml = DATA.inventoryTools
      .map((tool) => {
        const isCollected = state.inventory.includes(tool.id);
        return `
          <div class="inventory-slot ${isCollected ? 'collected' : ''}" data-tool-id="${tool.id}" title="${escapeHtml(tool.desc)}">
            <span class="slot-icon">${isCollected ? tool.icon : '🔒'}</span>
            <span>${escapeHtml(tool.name)}</span>
          </div>
        `;
      })
      .join('');

    dockEl.innerHTML = `
      <div class="inventory-dock-inner">
        <div class="inventory-label">
          <span>🎒 Explorer Inventory (${state.inventory.length}/${DATA.inventoryTools.length})</span>
        </div>
        <div class="inventory-slots">
          ${slotsHtml}
        </div>
      </div>
    `;

    dockEl.querySelectorAll('.inventory-slot.collected').forEach((slotEl) => {
      slotEl.addEventListener('pointerdown', () => {
        const toolId = slotEl.getAttribute('data-tool-id');
        const tool = DATA.inventoryTools.find((t) => t.id === toolId);
        if (tool && window.arcticAudio) {
          window.arcticAudio.playCardFlip();
          window.arcticAudio.speak(`${tool.name}. ${tool.desc}`);
        }
      });
    });
  }

  /* ==========================================================================
     MAIN SCREEN ROUTER
     ========================================================================== */
  function renderMain() {
    updateAuroraBodyClass();
    renderHUD();
    renderInventoryBar();

    const mainEl = document.getElementById('arctic-main');
    if (!mainEl) return;

    if (state.screen === 'opening') {
      renderOpeningScreen(mainEl);
    } else if (state.screen === 'hub') {
      renderHubScreen(mainEl);
    } else if (state.screen === 'zone1') {
      renderZone1Or2Screen(mainEl, 'zone1');
    } else if (state.screen === 'zone2') {
      renderZone1Or2Screen(mainEl, 'zone2');
    } else if (state.screen === 'zone3') {
      renderZone3Screen(mainEl);
    } else if (state.screen === 'finale') {
      renderFinaleScreen(mainEl);
    }
  }

  /* ==========================================================================
     SCREEN 1: OPENING SNOWSTORM, STUDENT LOGIN & PERSPECTIVE CHOICE
     ========================================================================== */
  function renderOpeningScreen(container) {
    const students = getStudentsForClass(state.classId);
    const activeStudent = getActiveStudent();
    const activePersp = DATA.perspectives[state.perspective] || DATA.perspectives.explorer;

    const classButtonsHtml = ['3A', '3B', '4A', '4B']
      .map(
        (cid) => `
          <button type="button" class="class-tab-btn ${state.classId === cid ? 'active' : ''}" data-class-id="${cid}">
            Class ${cid}
          </button>
        `
      )
      .join('');

    const rosterHtml = students
      .map((s) => {
        const isSelected = activeStudent && activeStudent.id === s.id;
        return `
          <button type="button" class="student-select-card ${isSelected ? 'selected' : ''}" data-student-id="${s.id}">
            <div class="student-select-thumb">
              ${renderStudentAvatarHTML(s, 40)}
            </div>
            <div style="overflow:hidden;">
              <div style="font-weight:900;font-size:0.9rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                ${escapeHtml(studentName(s))}
              </div>
              <div style="font-size:0.74rem;color:#fbbf24;font-weight:800;">
                ⭐ ${studentXP(s)} XP • Lv.${studentLevel(s)}
              </div>
            </div>
          </button>
        `;
      })
      .join('');

    const perspectivesHtml = Object.values(DATA.perspectives)
      .map((p) => {
        const isSel = state.perspective === p.id;
        return `
          <button type="button" class="perspective-card ${isSel ? 'selected' : ''}" data-persp-id="${p.id}">
            <div class="perspective-card-art">
              <img class="bg-crop" src="${p.cardImg}" alt="${escapeHtml(p.name)}" />
              <img class="hero-sticker" src="${p.sprite}" alt="${escapeHtml(p.shortName)}" />
            </div>
            <div class="perspective-card-caption">
              <h4>${isSel ? '✅ ' : '🧭 '}${escapeHtml(p.name)}</h4>
              <p>${escapeHtml(p.tagline)}</p>
            </div>
          </button>
        `;
      })
      .join('');

    container.innerHTML = `
      <div class="opening-grid">
        <!-- Left: Story Opening Scene & Monster Companion Stage -->
        <section class="glass-card story-storm-banner">
          <div>
            <span class="storm-alert-pill">🌨️ Arctic Snowstorm Alert • Unit 3 Story Mission</span>
            <h2 style="font-size:1.75rem;font-weight:900;margin:12px 0 8px;line-height:1.2;">
              The Explorer & The Polar Bear Are Separated in the Storm!
            </h2>
            <p style="font-size:0.98rem;color:#e2e8f0;line-height:1.55;margin:0;">
              A fierce Arctic snowstorm has swept across the sea ice, separating the <strong>Explorer (the Man)</strong> and the <strong>Polar Bear</strong> and blocking the mountain pass to the <strong>Safe Place</strong>!
            </p>
          </div>

          <div class="opening-duo-stage">
            <div class="pedestal-character-wrap">
              <img class="floating-sprite" src="../assets/unit3-arctic/c_man.png" alt="The Explorer" />
              <div class="pedestal-disc"></div>
              <span style="font-weight:900;font-size:0.84rem;color:#38bdf8;margin-top:4px;">🎣 The Explorer</span>
            </div>

            <div class="pedestal-character-wrap">
              <div class="floating-sprite" style="display:flex;align-items:center;justify-content:center;">
                ${renderMonsterThumbHTML(activeStudent, 108)}
              </div>
              <div class="pedestal-disc" style="background:radial-gradient(ellipse at center, rgba(245,158,11,0.6) 0%, transparent 75%);"></div>
              <span style="font-weight:900;font-size:0.84rem;color:#fbbf24;margin-top:4px;">
                🐲 ${escapeHtml(monsterNameOf(activeStudent))}
              </span>
            </div>

            <div class="pedestal-character-wrap">
              <img class="floating-sprite" src="../assets/unit3-arctic/c_bear.png" alt="The Polar Bear" />
              <div class="pedestal-disc"></div>
              <span style="font-weight:900;font-size:0.84rem;color:#34d399;margin-top:4px;">🐻‍❄️ The Polar Bear</span>
            </div>
          </div>

          <div style="padding:14px 16px;border-radius:16px;background:rgba(15,23,42,0.88);border:1px solid rgba(56,189,248,0.35);">
            <div style="font-weight:900;color:#7dd3fc;font-size:0.88rem;margin-bottom:4px;">
              🛡️ STRICT NO-FAIL EXPLORATION RULE:
            </div>
            <div style="font-size:0.86rem;color:#cbd5e1;line-height:1.45;">
              Explore the <strong>3 Arctic Zones</strong> in any order you choose! You can never lose or get a "Game Over" — if a trail leads to a <em>Snowy Dead End</em>, just turn back and try another path until you reach the <strong>Safe Place & Treasure Gate</strong>!
            </div>
          </div>
        </section>

        <!-- Right: Student Login & Perspective Choice -->
        <section class="glass-card login-panel">
          <div>
            <h3 style="margin:0 0 8px;font-size:1.15rem;font-weight:900;color:#38bdf8;">
              1️⃣ Step 1: Select Your Class & Student Name
            </h3>
            <div class="class-tabs">
              ${classButtonsHtml}
            </div>
          </div>

          <div class="student-roster-grid">
            ${rosterHtml}
          </div>

          <div>
            <h3 style="margin:0 0 8px;font-size:1.15rem;font-weight:900;color:#34d399;">
              2️⃣ Step 2: Choose Your Perspective for the Rescue
            </h3>
            <div class="perspective-grid">
              ${perspectivesHtml}
            </div>
          </div>

          <button type="button" class="btn-3d btn-3d-emerald" id="start-arctic-mission-btn" style="width:100%;padding:15px 20px;font-size:1.08rem;">
            🚀 Enter the Arctic Hub Map as ${escapeHtml(studentName(activeStudent))} (${escapeHtml(activePersp.shortName)})
          </button>
        </section>
      </div>
    `;

    // Bind Class Tabs
    container.querySelectorAll('[data-class-id]').forEach((btn) => {
      btn.addEventListener('pointerdown', () => {
        const cid = btn.getAttribute('data-class-id');
        state.classId = cid;
        const list = getStudentsForClass(cid);
        state.studentId = list.length ? list[0].id : null;
        if (window.arcticAudio) window.arcticAudio.playCardFlip();
        saveProgress();
        renderMain();
      });
    });

    // Bind Student Cards
    container.querySelectorAll('[data-student-id]').forEach((btn) => {
      btn.addEventListener('pointerdown', () => {
        state.studentId = btn.getAttribute('data-student-id');
        if (window.arcticAudio) window.arcticAudio.playCardFlip();
        saveProgress();
        renderMain();
      });
    });

    // Bind Perspective Cards
    container.querySelectorAll('[data-persp-id]').forEach((btn) => {
      btn.addEventListener('pointerdown', () => {
        const pid = btn.getAttribute('data-persp-id');
        state.perspective = pid;
        const pObj = DATA.perspectives[pid];
        if (window.arcticAudio) {
          window.arcticAudio.playCardFlip();
          if (pObj) window.arcticAudio.speak(pObj.introSpeech);
        }
        saveProgress();
        renderMain();
      });
    });

    // Bind Start Button
    const startBtn = document.getElementById('start-arctic-mission-btn');
    if (startBtn) {
      startBtn.addEventListener('pointerdown', () => {
        if (window.arcticAudio) {
          window.arcticAudio.playCorrect();
        }
        state.screen = 'hub';
        saveProgress();
        renderMain();
      });
    }
  }

  /* ==========================================================================
     SCREEN 2: ARCTIC HUB MAP (3 OPEN NON-LINEAR EXPLORATION ZONES)
     ========================================================================== */
  function renderHubScreen(container) {
    const student = getActiveStudent();
    const persp = DATA.perspectives[state.perspective] || DATA.perspectives.explorer;
    const allDone = areAllZonesCompleted();

    const zoneCardsHtml = DATA.zones
      .map((z) => {
        const zProg = state.zoneProgress[z.id];
        const isDone = zProg && zProg.completed;

        let progressLabel = '🧭 Ready to Explore';
        if (z.id === 'zone1' || z.id === 'zone2') {
          const steps = getStepsForZone(z.id);
          const solvedCount = steps.filter((st) => zProg.solvedIds[st.id]).length;
          progressLabel = isDone
            ? `✅ Zone Completed (${solvedCount}/${steps.length})`
            : `🐾 Progress: ${solvedCount}/${steps.length} Clues`;
        } else if (z.id === 'zone3') {
          const sortItems = getZone3SortItems();
          const sitItems = getZone3Situations();
          const solvedSorts = sortItems.filter((it) => zProg.solvedSortIds[it.id]).length;
          const solvedSits = sitItems.filter((it) => zProg.solvedSitIds[it.id]).length;
          progressLabel = isDone
            ? `✅ Zone Completed (${solvedSorts + solvedSits}/${sortItems.length + sitItems.length})`
            : `⛰️ Sorted: ${solvedSorts}/${sortItems.length} • Decisions: ${solvedSits}/${sitItems.length}`;
        }

        const rewardChips = z.rewards
          .map((rId) => {
            const tool = DATA.inventoryTools.find((t) => t.id === rId);
            if (!tool) return '';
            const hasIt = state.inventory.includes(rId);
            return `<span class="zone-reward-chip">${hasIt ? '✅' : tool.icon} ${escapeHtml(tool.name)}</span>`;
          })
          .join('');

        return `
          <article class="zone-hub-card ${isDone ? 'zone-completed' : ''}" data-open-zone="${z.id}">
            <div class="zone-card-viewport">
              <img class="zone-banner-jpg" src="${z.bannerImg}" alt="${escapeHtml(z.title)}" />
              <img class="zone-floating-sticker" src="${z.spriteImg}" alt="${escapeHtml(z.shortTitle)}" />
              <span class="zone-status-pill">${progressLabel}</span>
            </div>
            <div class="zone-card-tray">
              <div>
                <h3>${z.icon} ${escapeHtml(z.title)}</h3>
                <p>${escapeHtml(z.introText)}</p>
              </div>
              <div class="zone-reward-chips">
                ${rewardChips}
              </div>
              <button type="button" class="btn-3d ${isDone ? 'btn-3d-emerald' : ''}" style="width:100%;">
                ${isDone ? '🔄 Revisit Zone & Review Clues' : `🧭 Explore ${escapeHtml(z.shortTitle)}`}
              </button>
            </div>
          </article>
        `;
      })
      .join('');

    container.innerHTML = `
      <!-- Top Hub Companion Banner -->
      <section class="glass-card hub-header-banner">
        <div class="hub-companion-stage">
          <div class="hub-hero-pair">
            <img class="hub-hero-sprite" src="${persp.sprite}" alt="${escapeHtml(persp.shortName)}" />
            <div style="width:68px;height:68px;display:flex;align-items:center;justify-content:center;">
              ${renderMonsterThumbHTML(student, 66)}
            </div>
          </div>
          <div>
            <span style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(56,189,248,0.18);border:1px solid rgba(56,189,248,0.45);color:#7dd3fc;font-size:0.76rem;font-weight:900;">
              🧭 NON-LINEAR ARCTIC HUB MAP • CHOOSE ANY ZONE IN ANY ORDER
            </span>
            <h2 style="margin:6px 0 4px;font-size:1.38rem;font-weight:900;">
              Welcome to the Arctic Trail, ${escapeHtml(studentName(student))}!
            </h2>
            <p style="margin:0;font-size:0.9rem;color:#cbd5e1;">
              Playing as <strong>${escapeHtml(persp.shortName)}</strong> with <strong>${escapeHtml(monsterNameOf(student))}</strong>. Solve all 3 zones to reunite at the <strong>Safe Place & Treasure Gate</strong>!
            </p>
          </div>
        </div>

        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button type="button" class="btn-3d btn-3d-glass" id="hub-switch-persp-btn">
            🔄 Switch Perspective (${state.perspective === 'explorer' ? '🐻‍❄️ Polar Bear' : '🎣 Explorer'})
          </button>
        </div>
      </section>

      <!-- 3 Non-Linear Exploration Zone Cards -->
      <section class="hub-zones-grid">
        ${zoneCardsHtml}
      </section>

      <!-- Finale Safe Place & Treasure Gate Banner -->
      <section class="glass-card safe-place-hub-card ${allDone ? 'unlocked' : ''}">
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
          <img src="../assets/unit3-arctic/o_gate.png" alt="Treasure Gate" style="width:84px;height:84px;object-fit:contain;animation:idleBob 3s ease-in-out infinite;" />
          <div>
            <h3 style="margin:0 0 4px;font-size:1.25rem;font-weight:900;color:${allDone ? '#6ee7b7' : '#e9d5ff'};">
              ${allDone ? '🌌 THE SAFE PLACE & TREASURE GATE IS OPEN!' : '🔒 The Safe Place & Treasure Gate (Finale)'}
            </h3>
            <p style="margin:0;font-size:0.9rem;color:#e2e8f0;">
              ${
                allDone
                  ? 'All 3 Arctic zones are solved and all 6 survival tools are in your Explorer Inventory! Click to reunite the Man and the Polar Bear under the Aurora sky!'
                  : `Complete all 3 Exploration Zones above to calm the snowstorm into an Aurora sky and unlock the "🏔️ Arctic Explorer" badge (+${DATA.meta.completionXP} Bonus XP)!`
              }
            </p>
          </div>
        </div>
        <button type="button" class="btn-3d ${allDone ? 'btn-3d-amber' : 'btn-3d-violet'}" id="hub-open-finale-btn">
          ${allDone ? '🏆 Enter the Safe Place & Open Treasure Gate!' : '🔍 Check Safe Place Requirements'}
        </button>
      </section>
    `;

    // Bind Zone Cards
    container.querySelectorAll('[data-open-zone]').forEach((card) => {
      card.addEventListener('pointerdown', () => {
        const zId = card.getAttribute('data-open-zone');
        if (window.arcticAudio) window.arcticAudio.playCardFlip();
        state.screen = zId;
        state.feedbackState = null;
        renderMain();
      });
    });

    // Bind Switch Perspective button
    const switchPerspBtn = document.getElementById('hub-switch-persp-btn');
    if (switchPerspBtn) {
      switchPerspBtn.addEventListener('pointerdown', () => {
        state.perspective = state.perspective === 'explorer' ? 'polarBear' : 'explorer';
        if (window.arcticAudio) window.arcticAudio.playCardFlip();
        saveProgress();
        renderMain();
      });
    }

    // Bind Finale Gate button
    const finaleBtn = document.getElementById('hub-open-finale-btn');
    if (finaleBtn) {
      finaleBtn.addEventListener('pointerdown', () => {
        if (allDone) {
          if (window.arcticAudio) window.arcticAudio.playAuroraFanfare();
          state.screen = 'finale';
          renderMain();
        } else {
          if (window.arcticAudio) {
            window.arcticAudio.playSoftFail();
            window.arcticAudio.speak('Explore all three Arctic zones and collect the six survival tools in your inventory bar to open the Safe Place and Treasure Gate!');
          }
        }
      });
    }
  }

  /* ==========================================================================
     SCREEN 3A: ZONE 1 (FOOTPRINTS & ARTIFACTS) & ZONE 2 (FROZEN LAGOON)
     ========================================================================== */
  function renderZone1Or2Screen(container, zoneKey) {
    const zoneMeta = DATA.zones.find((z) => z.id === zoneKey);
    const steps = getStepsForZone(zoneKey);
    const zProg = state.zoneProgress[zoneKey];

    if (zProg.stepIndex >= steps.length) {
      zProg.stepIndex = 0;
    }
    const step = steps[zProg.stepIndex];
    const student = getActiveStudent();

    // Progress dots
    const dotsHtml = steps
      .map((st, idx) => {
        const isDone = !!zProg.solvedIds[st.id];
        const isCurr = idx === zProg.stepIndex;
        return `<span class="step-dot ${isDone ? 'done' : ''} ${isCurr ? 'current' : ''}" data-jump-idx="${idx}" style="cursor:pointer;" title="Clue ${idx + 1}"></span>`;
      })
      .join('');

    // Polar bear hunger widget for Zone 2
    let bearWidgetHtml = '';
    if (zoneKey === 'zone2') {
      const solvedCount = steps.filter((st) => zProg.solvedIds[st.id]).length;
      const pct = Math.min(100, Math.round(25 + (solvedCount / Math.max(1, steps.length)) * 75));
      const bearSprite = pct >= 75 ? '../assets/unit3-arctic/c_bear_full.png' : '../assets/unit3-arctic/c_bear_hungry.png';
      bearWidgetHtml = `
        <div class="bear-energy-widget">
          <img src="${bearSprite}" alt="Polar Bear" />
          <div style="flex:1;">
            <div style="display:flex;justify-content:space-between;font-size:0.82rem;font-weight:900;margin-bottom:4px;">
              <span style="color:#6ee7b7;">🐻‍❄️ Polar Bear Fish & Warmth Meter</span>
              <span style="color:#fbbf24;">${pct}% Energy</span>
            </div>
            <div class="bear-meter-track">
              <div class="bear-meter-fill" style="width:${pct}%;"></div>
            </div>
          </div>
        </div>
      `;
    }

    // Options or No-Fail Snowy Dead End / Success Box
    let interactionBottomHtml = '';
    if (state.feedbackState && state.feedbackState.type === 'deadEnd') {
      interactionBottomHtml = `
        <div class="snowy-dead-end-box">
          <h4>❄️ ${escapeHtml(state.feedbackState.title || 'Snowy Dead End!')}</h4>
          <p>${escapeHtml(state.feedbackState.message)}</p>
          <button type="button" class="btn-3d" id="turn-back-retry-btn" style="width:100%;">
            ↩️ Turn Back & Try Another Trail
          </button>
        </div>
      `;
    } else if (state.feedbackState && state.feedbackState.type === 'success') {
      const isLastStep = zProg.stepIndex >= steps.length - 1;
      interactionBottomHtml = `
        <div class="trail-success-box">
          <h4>🌟 Trail Unlocked! (+5 XP)</h4>
          <p>${escapeHtml(state.feedbackState.message)}</p>
          <button type="button" class="btn-3d btn-3d-emerald" id="advance-next-trail-btn" style="width:100%;">
            ${isLastStep ? `🎉 Complete ${escapeHtml(zoneMeta.shortTitle)} & Claim Tools!` : '➡️ Follow the Open Trail to the Next Clue'}
          </button>
        </div>
      `;
    } else {
      const optionsHtml = step.options
        .map(
          (opt) => `
            <button type="button" class="trail-option-btn" data-opt-id="${opt.id}">
              ${escapeHtml(opt.label)}
            </button>
          `
        )
        .join('');
      interactionBottomHtml = `
        <div class="trail-options-list">
          ${optionsHtml}
        </div>
      `;
    }

    container.innerHTML = `
      <div class="zone-stage-topbar">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          <button type="button" class="btn-3d btn-3d-glass" id="zone-back-hub-btn">
            🗺️ Back to Arctic Hub Map
          </button>
          <h2 style="margin:0;font-size:1.22rem;font-weight:900;color:#38bdf8;">
            ${zoneMeta.icon} ${escapeHtml(zoneMeta.title)}
          </h2>
        </div>
        <div class="zone-progress-pills">
          ${dotsHtml}
        </div>
      </div>

      <div class="zone-workbench-grid">
        <!-- Left: Framed High-Res JPEG Textbook Artwork Card -->
        <section class="glass-card clue-media-card">
          <div class="clue-badge-row">
            <span class="stage-pill">${escapeHtml(step.stageLabel)}</span>
            <button type="button" class="btn-3d btn-3d-glass" id="speak-clue-btn" style="padding:6px 12px;font-size:0.8rem;">
              🔊 Read Clue Aloud
            </button>
          </div>

          <div class="framed-jpeg-viewport">
            <img src="${step.image}" alt="${escapeHtml(step.clueTitle)}" />
          </div>

          ${bearWidgetHtml}

          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-radius:16px;background:rgba(6,9,17,0.65);border:1px solid rgba(148,163,184,0.2);">
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:46px;height:46px;display:flex;align-items:center;justify-content:center;">
                ${renderMonsterThumbHTML(student, 44)}
              </div>
              <div style="font-size:0.84rem;color:#cbd5e1;">
                <strong style="color:#fbbf24;">${escapeHtml(monsterNameOf(student))}:</strong>
                "Take your time! Every trail is safe to test!"
              </div>
            </div>
          </div>
        </section>

        <!-- Right: Clue Prompt & Interactive Trail Options -->
        <section class="glass-card clue-interaction-card">
          <div class="clue-prompt-box">
            <h2>🔍 ${escapeHtml(step.clueTitle)}</h2>
            <p>${escapeHtml(step.prompt)}</p>
          </div>

          ${interactionBottomHtml}
        </section>
      </div>
    `;

    // Bind Back to Hub
    const backBtn = document.getElementById('zone-back-hub-btn');
    if (backBtn) {
      backBtn.addEventListener('pointerdown', () => {
        if (window.arcticAudio) window.arcticAudio.playCardFlip();
        state.screen = 'hub';
        state.feedbackState = null;
        renderMain();
      });
    }

    // Bind Step Dots
    container.querySelectorAll('[data-jump-idx]').forEach((dot) => {
      dot.addEventListener('pointerdown', () => {
        const idx = Number(dot.getAttribute('data-jump-idx'));
        if (!Number.isNaN(idx)) {
          zProg.stepIndex = idx;
          state.feedbackState = null;
          if (window.arcticAudio) window.arcticAudio.playCardFlip();
          renderMain();
        }
      });
    });

    // Bind Read Aloud
    const speakBtn = document.getElementById('speak-clue-btn');
    if (speakBtn) {
      speakBtn.addEventListener('pointerdown', () => {
        if (window.arcticAudio) {
          window.arcticAudio.speak(step.speakText || step.prompt);
        }
      });
    }

    // Bind Trail Options
    container.querySelectorAll('[data-opt-id]').forEach((btn) => {
      btn.addEventListener('pointerdown', () => {
        const optId = btn.getAttribute('data-opt-id');
        const chosen = step.options.find((o) => o.id === optId);
        if (!chosen) return;

        if (chosen.isCorrect) {
          if (window.arcticAudio) {
            window.arcticAudio.playCorrect();
            window.arcticAudio.speak(chosen.feedback);
          }
          if (!zProg.solvedIds[step.id]) {
            zProg.solvedIds[step.id] = true;
            awardStudentXP(5, `Solved ${step.clueTitle}`);
          }
          state.feedbackState = {
            type: 'success',
            message: chosen.feedback
          };
          saveProgress();
          renderMain();
        } else {
          // Strict No-Fail: Gentle Snowy Dead End + Hint!
          if (window.arcticAudio) {
            window.arcticAudio.playSoftFail();
            window.arcticAudio.speak(`${chosen.deadEndTitle || 'Snowy Dead End'}. ${chosen.deadEndHint}`);
          }
          state.feedbackState = {
            type: 'deadEnd',
            title: chosen.deadEndTitle || 'Snowy Dead End!',
            message: chosen.deadEndHint
          };
          renderMain();
        }
      });
    });

    // Bind Turn Back Retry
    const retryBtn = document.getElementById('turn-back-retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('pointerdown', () => {
        if (window.arcticAudio) window.arcticAudio.playCardFlip();
        state.feedbackState = null;
        renderMain();
      });
    }

    // Bind Advance Next
    const nextBtn = document.getElementById('advance-next-trail-btn');
    if (nextBtn) {
      nextBtn.addEventListener('pointerdown', () => {
        if (window.arcticAudio) window.arcticAudio.playCardFlip();
        state.feedbackState = null;
        if (zProg.stepIndex < steps.length - 1) {
          zProg.stepIndex += 1;
          saveProgress();
          renderMain();
        } else {
          // Zone Complete!
          if (!zProg.completed) {
            zProg.completed = true;
            awardStudentXP(DATA.meta.zoneXP, `Completed ${zoneMeta.title}`);
          }
          unlockZoneRewards(zoneKey);
          state.screen = 'hub';
          saveProgress();
          renderMain();
        }
      });
    }
  }

  /* ==========================================================================
     SCREEN 3B: ZONE 3 — PART A (USEFUL VS. USELESS SORTING) & PART B (SITUATIONS)
     ========================================================================== */
  function renderZone3Screen(container) {
    const zProg = state.zoneProgress.zone3;
    const sortItems = getZone3SortItems();
    const sitItems = getZone3Situations();
    const student = getActiveStudent();

    // Sub-mode switcher header
    const topSubTabsHtml = `
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button type="button" class="btn-3d ${zProg.part === 'sort' ? '' : 'btn-3d-glass'}" id="z3-tab-sort" style="padding:8px 14px;font-size:0.84rem;">
          🎒 Part A: Useful vs. Useless Sorting (${Object.keys(zProg.solvedSortIds).length}/${sortItems.length})
        </button>
        <button type="button" class="btn-3d ${zProg.part === 'situations' ? 'btn-3d-amber' : 'btn-3d-glass'}" id="z3-tab-sit" style="padding:8px 14px;font-size:0.84rem;">
          📖 Part B: Poem & Story Situations (${Object.keys(zProg.solvedSitIds).length}/${sitItems.length})
        </button>
      </div>
    `;

    if (zProg.part === 'sort') {
      if (zProg.sortIndex >= sortItems.length) zProg.sortIndex = 0;
      const item = sortItems[zProg.sortIndex];

      let actionAreaHtml = '';
      if (state.feedbackState && state.feedbackState.type === 'deadEnd') {
        actionAreaHtml = `
          <div class="snowy-dead-end-box">
            <h4>❄️ ${escapeHtml(state.feedbackState.title)}</h4>
            <p>${escapeHtml(state.feedbackState.message)}</p>
            <button type="button" class="btn-3d" id="z3-retry-btn" style="width:100%;">
              ↩️ Turn Back & Sort into the Other Bucket
            </button>
          </div>
        `;
      } else if (state.feedbackState && state.feedbackState.type === 'success') {
        const isLastSort = zProg.sortIndex >= sortItems.length - 1;
        actionAreaHtml = `
          <div class="trail-success-box">
            <h4>🌟 Correctly Sorted! (+5 XP)</h4>
            <p>${escapeHtml(state.feedbackState.message)}</p>
            <button type="button" class="btn-3d btn-3d-emerald" id="z3-next-sort-btn" style="width:100%;">
              ${isLastSort ? '➡️ Proceed to Part B: Poem & Story Situations!' : '➡️ Sort Next Mountain Pass Object'}
            </button>
          </div>
        `;
      } else {
        actionAreaHtml = `
          <div class="sorting-buckets-row">
            <button type="button" class="sort-bucket-btn sort-bucket-useful" data-sort-choice="useful">
              <span style="font-size:1.8rem;">✅</span>
              <span>USEFUL / REAL MONEY / HELPFUL</span>
              <span style="font-size:0.78rem;opacity:0.85;">Helps survive the storm or solves problems wisely</span>
            </button>
            <button type="button" class="sort-bucket-btn sort-bucket-useless" data-sort-choice="useless">
              <span style="font-size:1.8rem;">❄️</span>
              <span>USELESS / NOT MONEY / HARMFUL</span>
              <span style="font-size:0.78rem;opacity:0.85;">Distraction, trick item, or dangerous for the Arctic</span>
            </button>
          </div>
        `;
      }

      container.innerHTML = `
        <div class="zone-stage-topbar">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
            <button type="button" class="btn-3d btn-3d-glass" id="z3-back-hub-btn">
              🗺️ Back to Arctic Hub Map
            </button>
            <h2 style="margin:0;font-size:1.2rem;font-weight:900;color:#fbbf24;">
              ⛰️ Zone 3: The Mountain Obstacle Pass
            </h2>
          </div>
          ${topSubTabsHtml}
        </div>

        <div class="zone-workbench-grid">
          <section class="glass-card clue-media-card">
            <div class="clue-badge-row">
              <span class="stage-pill">Part A • Survival & Unit 3 Sorting (${zProg.sortIndex + 1}/${sortItems.length})</span>
              <button type="button" class="btn-3d btn-3d-glass" id="z3-speak-btn" style="padding:6px 12px;font-size:0.8rem;">
                🔊 Listen
              </button>
            </div>
            <div class="framed-jpeg-viewport">
              <img src="${item.img}" alt="${escapeHtml(item.name)}" />
            </div>
          </section>

          <section class="glass-card clue-interaction-card">
            <div class="clue-prompt-box">
              <h2>${item.icon} ${escapeHtml(item.name)}</h2>
              <p>
                You found this along the blocked mountain pass! Will it <strong>help the Explorer and the Polar Bear survive / represent real Unit 3 money & responsible choices</strong>, or is it <strong>useless / harmful</strong>?
              </p>
            </div>
            ${actionAreaHtml}
          </section>
        </div>
      `;

      bindZone3CommonButtons(sortItems, sitItems);

      const speakBtn = document.getElementById('z3-speak-btn');
      if (speakBtn) {
        speakBtn.addEventListener('pointerdown', () => {
          if (window.arcticAudio) window.arcticAudio.speak(item.name);
        });
      }

      container.querySelectorAll('[data-sort-choice]').forEach((btn) => {
        btn.addEventListener('pointerdown', () => {
          const picked = btn.getAttribute('data-sort-choice');
          if (picked === item.category) {
            if (window.arcticAudio) {
              window.arcticAudio.playCorrect();
              window.arcticAudio.speak(item.reason);
            }
            if (!zProg.solvedSortIds[item.id]) {
              zProg.solvedSortIds[item.id] = true;
              awardStudentXP(5, `Sorted ${item.name}`);
            }
            state.feedbackState = {
              type: 'success',
              message: item.reason
            };
            saveProgress();
            renderMain();
          } else {
            if (window.arcticAudio) {
              window.arcticAudio.playSoftFail();
              window.arcticAudio.speak(`Snowy Dead End! ${item.reason}`);
            }
            state.feedbackState = {
              type: 'deadEnd',
              title: 'Snowy Dead End: Check This Item Again!',
              message: item.reason
            };
            renderMain();
          }
        });
      });

      const retryBtn = document.getElementById('z3-retry-btn');
      if (retryBtn) {
        retryBtn.addEventListener('pointerdown', () => {
          state.feedbackState = null;
          renderMain();
        });
      }

      const nextSortBtn = document.getElementById('z3-next-sort-btn');
      if (nextSortBtn) {
        nextSortBtn.addEventListener('pointerdown', () => {
          state.feedbackState = null;
          if (zProg.sortIndex < sortItems.length - 1) {
            zProg.sortIndex += 1;
          } else {
            zProg.part = 'situations';
            zProg.sitIndex = 0;
          }
          saveProgress();
          renderMain();
        });
      }
      return;
    }

    // PART B: POEM & STORY SITUATIONS
    if (zProg.sitIndex >= sitItems.length) zProg.sitIndex = 0;
    const sit = sitItems[zProg.sitIndex];

    let sitBottomHtml = '';
    if (state.feedbackState && state.feedbackState.type === 'deadEnd') {
      sitBottomHtml = `
        <div class="snowy-dead-end-box">
          <h4>❄️ ${escapeHtml(state.feedbackState.title)}</h4>
          <p>${escapeHtml(state.feedbackState.message)}</p>
          <button type="button" class="btn-3d" id="z3-sit-retry-btn" style="width:100%;">
            ↩️ Turn Back & Try a Better Decision
          </button>
        </div>
      `;
    } else if (state.feedbackState && state.feedbackState.type === 'success') {
      const isLastSit = zProg.sitIndex >= sitItems.length - 1;
      sitBottomHtml = `
        <div class="trail-success-box">
          <h4>🌟 Wise Decision! Obstacle Cleared! (+5 XP)</h4>
          <p>${escapeHtml(state.feedbackState.message)}</p>
          <button type="button" class="btn-3d btn-3d-emerald" id="z3-sit-next-btn" style="width:100%;">
            ${isLastSit ? '🗝️ Unlock Treasure Gate Key & Complete Zone 3!' : '➡️ Continue Up the Mountain Pass'}
          </button>
        </div>
      `;
    } else {
      sitBottomHtml = `
        <div class="trail-options-list">
          ${sit.options
            .map(
              (o) => `
                <button type="button" class="trail-option-btn" data-sit-opt="${o.id}">
                  ${escapeHtml(o.label)}
                </button>
              `
            )
            .join('')}
        </div>
      `;
    }

    container.innerHTML = `
      <div class="zone-stage-topbar">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          <button type="button" class="btn-3d btn-3d-glass" id="z3-back-hub-btn">
            🗺️ Back to Arctic Hub Map
          </button>
          <h2 style="margin:0;font-size:1.2rem;font-weight:900;color:#fbbf24;">
            ⛰️ Zone 3: Poem & Story Situations
          </h2>
        </div>
        ${topSubTabsHtml}
      </div>

      <div class="zone-workbench-grid">
        <section class="glass-card clue-media-card">
          <div class="clue-badge-row">
            <span class="stage-pill">${escapeHtml(sit.stageLabel)}</span>
            <button type="button" class="btn-3d btn-3d-glass" id="z3-sit-speak-btn" style="padding:6px 12px;font-size:0.8rem;">
              🔊 Read Situation Aloud
            </button>
          </div>
          <div class="framed-jpeg-viewport">
            <img src="${sit.image}" alt="${escapeHtml(sit.title)}" />
          </div>
          <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:16px;background:rgba(6,9,17,0.65);border:1px solid rgba(148,163,184,0.2);">
            <div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;">
              ${renderMonsterThumbHTML(student, 42)}
            </div>
            <div style="font-size:0.84rem;color:#cbd5e1;">
              Need more survival tools? You can click <strong>🗺️ Back to Arctic Hub Map</strong> at any time!
            </div>
          </div>
        </section>

        <section class="glass-card clue-interaction-card">
          <div class="clue-prompt-box">
            <h2>📖 ${escapeHtml(sit.title)}</h2>
            <p>${escapeHtml(sit.storyText)}</p>
          </div>
          ${sitBottomHtml}
        </section>
      </div>
    `;

    bindZone3CommonButtons(sortItems, sitItems);

    const sitSpeakBtn = document.getElementById('z3-sit-speak-btn');
    if (sitSpeakBtn) {
      sitSpeakBtn.addEventListener('pointerdown', () => {
        if (window.arcticAudio) window.arcticAudio.speak(sit.speakText || sit.storyText);
      });
    }

    container.querySelectorAll('[data-sit-opt]').forEach((btn) => {
      btn.addEventListener('pointerdown', () => {
        const optId = btn.getAttribute('data-sit-opt');
        const chosen = sit.options.find((o) => o.id === optId);
        if (!chosen) return;

        if (chosen.isCorrect) {
          if (window.arcticAudio) {
            window.arcticAudio.playCorrect();
            window.arcticAudio.speak(chosen.feedback);
          }
          if (!zProg.solvedSitIds[sit.id]) {
            zProg.solvedSitIds[sit.id] = true;
            awardStudentXP(5, `Resolved ${sit.title}`);
          }
          state.feedbackState = {
            type: 'success',
            message: chosen.feedback
          };
          saveProgress();
          renderMain();
        } else {
          if (window.arcticAudio) {
            window.arcticAudio.playSoftFail();
            window.arcticAudio.speak(`${chosen.deadEndTitle}. ${chosen.deadEndHint}`);
          }
          state.feedbackState = {
            type: 'deadEnd',
            title: chosen.deadEndTitle || 'Snowy Dead End!',
            message: chosen.deadEndHint
          };
          renderMain();
        }
      });
    });

    const sitRetryBtn = document.getElementById('z3-sit-retry-btn');
    if (sitRetryBtn) {
      sitRetryBtn.addEventListener('pointerdown', () => {
        state.feedbackState = null;
        renderMain();
      });
    }

    const sitNextBtn = document.getElementById('z3-sit-next-btn');
    if (sitNextBtn) {
      sitNextBtn.addEventListener('pointerdown', () => {
        state.feedbackState = null;
        if (zProg.sitIndex < sitItems.length - 1) {
          zProg.sitIndex += 1;
          saveProgress();
          renderMain();
        } else {
          if (!zProg.completed) {
            zProg.completed = true;
            awardStudentXP(DATA.meta.zoneXP, 'Completed Zone 3: The Mountain Obstacle Pass');
          }
          unlockZoneRewards('zone3');
          state.screen = areAllZonesCompleted() ? 'finale' : 'hub';
          if (state.screen === 'finale' && window.arcticAudio) {
            window.arcticAudio.playAuroraFanfare();
          }
          saveProgress();
          renderMain();
        }
      });
    }
  }

  function bindZone3CommonButtons() {
    const backBtn = document.getElementById('z3-back-hub-btn');
    if (backBtn) {
      backBtn.addEventListener('pointerdown', () => {
        if (window.arcticAudio) window.arcticAudio.playCardFlip();
        state.screen = 'hub';
        state.feedbackState = null;
        renderMain();
      });
    }
    const tabSort = document.getElementById('z3-tab-sort');
    if (tabSort) {
      tabSort.addEventListener('pointerdown', () => {
        state.zoneProgress.zone3.part = 'sort';
        state.feedbackState = null;
        if (window.arcticAudio) window.arcticAudio.playCardFlip();
        renderMain();
      });
    }
    const tabSit = document.getElementById('z3-tab-sit');
    if (tabSit) {
      tabSit.addEventListener('pointerdown', () => {
        state.zoneProgress.zone3.part = 'situations';
        state.feedbackState = null;
        if (window.arcticAudio) window.arcticAudio.playCardFlip();
        renderMain();
      });
    }
  }

  /* ==========================================================================
     SCREEN 4: THE FINALE — THE SAFE PLACE & THE TREASURE GATE
     ========================================================================== */
  function renderFinaleScreen(container) {
    const student = getActiveStudent();

    if (!state.finaleAwarded) {
      state.finaleAwarded = true;
      // Ensure all 6 tools are unlocked
      DATA.inventoryTools.forEach((t) => {
        if (!state.inventory.includes(t.id)) state.inventory.push(t.id);
      });
      awardStudentXP(DATA.meta.completionXP, 'Unlocked the Safe Place & Arctic Explorer Badge!');
      syncHomeworkCompletionToCloud();
      saveProgress();
    }

    const sName = studentName(student);
    const monsterName = monsterNameOf(student);

    container.innerHTML = `
      <section class="glass-card finale-ceremony-card">
        <div class="arctic-badge-medal">
          <span>🏆</span>
          <span>NEW TITLE UNLOCKED: ${escapeHtml(DATA.meta.badgeTitle)}</span>
        </div>

        <h2 style="margin:0 0 8px;font-size:2rem;font-weight:900;background:linear-gradient(90deg,#6ee7b7,#38bdf8,#fde68a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
          🌌 The Safe Place & The Treasure Gate Is Open!
        </h2>
        <p style="max-width:740px;margin:0 auto;font-size:1.05rem;color:#e2e8f0;line-height:1.55;">
          The fierce Arctic snowstorm has calmed into a glowing <strong>Aurora Borealis</strong> sky! Thanks to <strong>${escapeHtml(sName)}</strong> and <strong>${escapeHtml(monsterName)}</strong>, the <strong>Explorer (the Man)</strong> and the <strong>Polar Bear</strong> are safely reunited at the Treasure Gate!
        </p>

        <div class="finale-reunion-stage">
          <div class="pedestal-character-wrap">
            <img class="floating-sprite" src="../assets/unit3-arctic/c_man.png" alt="The Explorer" />
            <div class="pedestal-disc"></div>
            <span style="font-weight:900;color:#38bdf8;margin-top:6px;">🎣 The Explorer</span>
          </div>

          <div class="pedestal-character-wrap">
            <img class="floating-sprite" src="../assets/unit3-arctic/o_gate.png" alt="The Treasure Gate" style="width:136px;height:136px;" />
            <div class="pedestal-disc" style="background:radial-gradient(ellipse at center, rgba(251,191,36,0.7) 0%, transparent 75%);"></div>
            <span style="font-weight:900;color:#fbbf24;margin-top:6px;">🗝️ Safe Place Treasure Gate</span>
          </div>

          <div class="pedestal-character-wrap">
            <div class="floating-sprite" style="display:flex;align-items:center;justify-content:center;">
              ${renderMonsterThumbHTML(student, 118)}
            </div>
            <div class="pedestal-disc" style="background:radial-gradient(ellipse at center, rgba(168,85,247,0.65) 0%, transparent 75%);"></div>
            <span style="font-weight:900;color:#e9d5ff;margin-top:6px;">🐲 ${escapeHtml(monsterName)}</span>
          </div>

          <div class="pedestal-character-wrap">
            <img class="floating-sprite" src="../assets/unit3-arctic/c_bear_full.png" alt="The Polar Bear" />
            <div class="pedestal-disc"></div>
            <span style="font-weight:900;color:#34d399;margin-top:6px;">🐻‍❄️ Happy Polar Bear</span>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;max-width:880px;margin:0 auto 24px;text-align:left;">
          <div style="padding:14px 16px;border-radius:16px;background:rgba(15,23,42,0.88);border:1px solid rgba(52,211,153,0.4);">
            <div style="font-weight:900;color:#6ee7b7;font-size:0.86rem;">⭐ HOMEWORK XP SYNCED</div>
            <div style="font-size:1.35rem;font-weight:900;color:#f8fafc;margin-top:4px;">+${state.sessionXP} XP Earned</div>
            <div style="font-size:0.78rem;color:#94a3b8;">Synced to ${escapeHtml(sName)} (${escapeHtml(state.classId)}) on Supabase</div>
          </div>
          <div style="padding:14px 16px;border-radius:16px;background:rgba(15,23,42,0.88);border:1px solid rgba(56,189,248,0.4);">
            <div style="font-weight:900;color:#7dd3fc;font-size:0.86rem;">🎒 SURVIVAL TOOLS COLLECTED</div>
            <div style="font-size:1.35rem;font-weight:900;color:#f8fafc;margin-top:4px;">6 / 6 Artifacts</div>
            <div style="font-size:0.78rem;color:#94a3b8;">Rope, Lydia Coin, Fish, Lantern, Ice Pick & Gate Key</div>
          </div>
          <div style="padding:14px 16px;border-radius:16px;background:rgba(15,23,42,0.88);border:1px solid rgba(251,191,36,0.4);">
            <div style="font-weight:900;color:#fde68a;font-size:0.86rem;">📖 UNIT 3 MASTERED</div>
            <div style="font-size:1.1rem;font-weight:900;color:#f8fafc;margin-top:4px;">The Bear & I + History of Money</div>
            <div style="font-size:0.78rem;color:#94a3b8;">All 3 Arctic Exploration Zones Completed!</div>
          </div>
        </div>

        <div style="display:flex;justify-content:center;gap:14px;flex-wrap:wrap;">
          <button type="button" class="btn-3d btn-3d-amber" id="finale-replay-btn">
            🔄 Explore Again / Play Other Perspective
          </button>
          <button type="button" class="btn-3d" id="finale-hub-btn">
            🗺️ Return to Arctic Hub Map
          </button>
          <a href="../index.html" class="btn-3d btn-3d-emerald">
            🏫 Back to English Adventure Academy
          </a>
        </div>
      </section>
    `;

    const replayBtn = document.getElementById('finale-replay-btn');
    if (replayBtn) {
      replayBtn.addEventListener('pointerdown', () => {
        state.perspective = state.perspective === 'explorer' ? 'polarBear' : 'explorer';
        state.zoneProgress = {
          zone1: { stepIndex: 0, completed: false, solvedIds: {} },
          zone2: { stepIndex: 0, completed: false, solvedIds: {}, bearEnergy: 25 },
          zone3: { part: 'sort', sortIndex: 0, sitIndex: 0, completed: false, solvedSortIds: {}, solvedSitIds: {} }
        };
        state.screen = 'hub';
        state.feedbackState = null;
        saveProgress();
        renderMain();
      });
    }

    const hubBtn = document.getElementById('finale-hub-btn');
    if (hubBtn) {
      hubBtn.addEventListener('pointerdown', () => {
        state.screen = 'hub';
        renderMain();
      });
    }
  }

  /* ==========================================================================
     BOOT ON DOM READY & LISTEN FOR SUPABASE LIVE ROSTER UPDATES
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    loadSavedProgress();
    renderMain();

    if (window.schoolStore && typeof window.schoolStore.subscribe === 'function') {
      window.schoolStore.subscribe(() => {
        renderHUD();
        if (state.screen === 'opening') {
          const mainEl = document.getElementById('arctic-main');
          if (mainEl) renderOpeningScreen(mainEl);
        }
      });
    }
  });
})();
