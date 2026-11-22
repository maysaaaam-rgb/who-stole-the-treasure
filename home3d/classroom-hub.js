/* ═══════════════════════════════════════════════════════════════════════════
   Classroom Hub for 3D Home Island (home3d/classroom-hub.js)
   - Live Class Switcher (3A · 3B · 4A · 4B) + 4 Team Monster Score Pills
   - Spawns ALL real class pupils walking in 3D (privacy-guarded per AGENTS.md §8)
   - Interactive 3D Pupil & Team Monster Popovers (+1/+3/+5 XP, Hall Pass, Shop)
   - Wires all 9 physical 3D Classroom Tool Props + 1–7 Soundboard Hotkeys
   - Instant #h3-live-overlay iframe frame (keeps 3D Home Island alive underneath,
     pauses WebGL loop for 60fps child performance, 0ms resume + Bridge growth!)
   ═══════════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var HOST = null, K = null, T3 = null;
  var activeClassId = 'class-3a';
  var classesCache = [];
  var rosterCache = [];
  var hallPass = null; // { id, name, startedAt }
  var hallPassTimer = null;
  var popEl = null, overlayEl = null, overlayFrame = null, overlayBody = null, overlayTabs = null, overlayTitleEl = null, hallEl = null, topBarEl = null;

  var DEFAULT_TEAM_META = [
    { idx: 0, id: null, name: 'Emberwing', color: '#ff5fa2', dark: '#c93d7d', hex: 0xff5fa2, icon: '🔥' },
    { idx: 1, id: null, name: 'Aquafind',  color: '#4f9dff', dark: '#2d76d4', hex: 0x4f9dff, icon: '💧' },
    { idx: 2, id: null, name: 'Sparktail', color: '#ffb320', dark: '#c98200', hex: 0xffb320, icon: '⚡' },
    { idx: 3, id: null, name: 'Florasprout', color: '#2fc58a', dark: '#1e9666', hex: 0x2fc58a, icon: '🌿' }
  ];
  var TEAM_META = DEFAULT_TEAM_META.map(function (t) { return Object.assign({}, t); });
  var studentTeamMap = {};

  function getParentStore() {
    try {
      if (root.parent && root.parent !== root && root.parent.schoolStore && root.parent.schoolStore.state) {
        return root.parent.schoolStore;
      }
    } catch (e) {}
    return null;
  }

  function goPlatformView(viewId) {
    closePop();
    closeOverlay();
    try {
      if (root.parent && root.parent !== root && typeof root.parent.switchView === 'function') {
        root.parent.switchView(viewId);
        return true;
      }
    } catch (e) {}
    location.href = '../index.html#' + viewId;
    return false;
  }

  function colorToHexNum(c, fallback) {
    var m = /^#([0-9a-f]{6})$/i.exec(String(c || '').trim());
    return m ? parseInt(m[1], 16) : fallback;
  }

  function iconForTeamColor(color, idx) {
    var c = String(color || '').toLowerCase();
    if (/e11|f43|ef4|ec4|ff5|pink|red|rose|ruby/.test(c)) return '🔥';
    if (/38b|256|3b8|4f9|0ea|blue|aqua|ocean|cyan/.test(c)) return '💧';
    if (/eab|f59|ffb|fbbf|yellow|gold|amber|sun/.test(c)) return '⚡';
    if (/10b|22c|2fc|16a|green|emerald|forest|flora/.test(c)) return '🌿';
    return DEFAULT_TEAM_META[idx % 4].icon;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function isTeacherUnlocked() {
    if (K && K.DEMO) return false;
    try {
      if (sessionStorage.getItem('eaa_auth_unlocked') === 'true') return true;
      if (localStorage.getItem('eaa_device_trust_v2') === 'trusted' && localStorage.getItem('eaa_explicit_locked_v2') !== '1') return true;
    } catch (e) {}
    return false;
  }

  /* ── Polyphonic C-Major Pentatonic XP Chord (AGENTS.md §1.3) ── */
  var _xpCtx = null;
  function playXpChord(big) {
    try {
      if (root.classSoundboard && typeof root.classSoundboard.playCoinReward === 'function' && !big) {
        root.classSoundboard.playCoinReward();
        return;
      }
      var AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) return;
      if (!_xpCtx) _xpCtx = new AC();
      if (_xpCtx.state === 'suspended') _xpCtx.resume().catch(function () {});
      var notes = big ? [523.25, 659.25, 783.99, 1046.50, 1318.51] : [523.25, 659.25, 783.99, 1046.50];
      notes.forEach(function (freq, idx) {
        var t0 = _xpCtx.currentTime + idx * 0.055;
        ['sine', 'triangle'].forEach(function (type, ti) {
          var o = _xpCtx.createOscillator(), g = _xpCtx.createGain();
          o.type = type;
          o.frequency.setValueAtTime(freq * (ti ? 1.002 : 1), t0);
          g.gain.setValueAtTime(0.0001, t0);
          g.gain.linearRampToValueAtTime(ti ? 0.06 : 0.11, t0 + 0.018);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.36);
          o.connect(g); g.connect(_xpCtx.destination);
          o.start(t0); o.stop(t0 + 0.4);
        });
      });
    } catch (e) {}
  }

  /* ── Classes & Privacy-Safe Roster Resolution (prefers live window.parent.schoolStore) ── */
  function readStore() {
    var ps = getParentStore();
    if (ps && ps.state) return ps.state;
    try {
      return JSON.parse(localStorage.getItem('eaa_master_school_v6') || 'null');
    } catch (e) { return null; }
  }

  function syncTeamsFromStore(st) {
    TEAM_META = DEFAULT_TEAM_META.map(function (t) { return Object.assign({}, t); });
    studentTeamMap = {};
    var ps = getParentStore();
    var groups = null;
    if (ps && typeof ps.getGroups === 'function') {
      groups = ps.getGroups(activeClassId);
    } else if (st && Array.isArray(st.groups)) {
      groups = st.groups.filter(function (g) { return g && g.classId === activeClassId; });
    }
    if (Array.isArray(groups) && groups.length) {
      TEAM_META = groups.slice(0, 4).map(function (g, idx) {
        var fb = DEFAULT_TEAM_META[idx % 4];
        var col = g.color || fb.color;
        (g.studentIds || []).forEach(function (sid) { studentTeamMap[sid] = idx; });
        return {
          idx: idx,
          id: g.id || null,
          name: String(g.name || fb.name).trim(),
          color: col,
          dark: fb.dark,
          hex: colorToHexNum(col, fb.hex),
          icon: iconForTeamColor(col, idx)
        };
      });
      while (TEAM_META.length < 4) {
        TEAM_META.push(Object.assign({}, DEFAULT_TEAM_META[TEAM_META.length]));
      }
    }
  }

  function loadClassesAndRoster() {
    var unlocked = isTeacherUnlocked();
    var st = unlocked ? readStore() : null;
    if (st && Array.isArray(st.classes) && st.classes.length) {
      classesCache = st.classes.filter(function (c) {
        return c && !c.archived && !/sync/i.test(c.id) && c.grade !== 'System';
      }).map(function (c) {
        var g = /4/.test(String(c.grade || c.name || c.id || '')) ? 4 : 3;
        var shortLbl = String(c.name || c.id).replace(/^Grade\s*/i, '').replace(/^Class\s*/i, '').trim().slice(0, 4) || c.id;
        return { id: c.id, name: c.name || shortLbl, short: shortLbl.toUpperCase(), grade: g };
      });
    }
    if (!classesCache.length) {
      classesCache = [
        { id: 'class-3a', name: 'Class 3A', short: '3A', grade: 3 },
        { id: 'class-3b', name: 'Class 3B', short: '3B', grade: 3 },
        { id: 'class-4a', name: 'Class 4A', short: '4A', grade: 4 },
        { id: 'class-4b', name: 'Class 4B', short: '4B', grade: 4 }
      ];
    }

    try {
      var ps0 = getParentStore();
      var pCls = ps0 && typeof ps0.getActiveClass === 'function' ? ps0.getActiveClass() : null;
      var prefs = JSON.parse(localStorage.getItem('eaa_games_prefs') || '{}') || {};
      if (pCls && pCls.id && classesCache.some(function (c) { return c.id === pCls.id; })) {
        activeClassId = pCls.id;
      } else if (prefs.classId && classesCache.some(function (c) { return c.id === prefs.classId; })) {
        activeClassId = prefs.classId;
      } else if (!classesCache.some(function (c) { return c.id === activeClassId; })) {
        activeClassId = classesCache[0].id;
      }
    } catch (e) {
      activeClassId = classesCache[0].id;
    }

    syncTeamsFromStore(st);

    if (st && Array.isArray(st.students)) {
      var list = st.students.filter(function (s) { return s && !s.archived && s.classId === activeClassId; });
      if (list.length) {
        rosterCache = list.map(function (s, idx) {
          var tIdx = studentTeamMap[s.id] != null ? studentTeamMap[s.id] : teamIndexOfStudent(s, idx);
          var rawName = String(s.name || ((s.firstName || '') + ' ' + (s.lastName || '')).trim() || ('Pupil ' + (idx + 1))).trim();
          var nParts = rawName.split(/\s+/);
          var disp = (nParts.length >= 2 && !/^Pupil$/i.test(nParts[0]))
            ? (nParts[0] + ' ' + nParts[nParts.length - 1].charAt(0).toUpperCase() + '.')
            : rawName;
          return {
            id: s.id,
            name: disp,
            team: tIdx,
            xp: Number(s.totalXP) || 0,
            coins: Number(s.coins) || 0,
            real: true
          };
        });
        return;
      }
    }

    // Privacy-safe demo placeholders when locked (never hardcodes real pupil names!)
    var clsObj = getActiveClass();
    rosterCache = [];
    for (var i = 1; i <= 24; i++) {
      var pid = 'demo-' + clsObj.short.toLowerCase() + '-' + i;
      rosterCache.push({
        id: pid,
        name: 'Pupil ' + i,
        team: (i - 1) % 4,
        xp: 120 + ((25 - i) * 5),
        coins: 50,
        real: false
      });
    }
  }

  function teamIndexOfStudent(s, fallbackIdx) {
    var col = String((s && (s.team || (s.monsterProfile && s.monsterProfile.baseColor))) || '').toLowerCase();
    if (/pink|red|ember|0/.test(col)) return 0;
    if (/blue|aqua|cyan|1/.test(col)) return 1;
    if (/yellow|amber|gold|spark|2/.test(col)) return 2;
    if (/green|verdant|flora|emerald|3/.test(col)) return 3;
    return fallbackIdx % 4;
  }

  function getActiveClass() {
    return classesCache.filter(function (c) { return c.id === activeClassId; })[0] || classesCache[0] || { id: 'class-3a', name: 'Class 3A', short: '3A', grade: 3 };
  }

  function getTeamTotals() {
    var totals = [0, 0, 0, 0];
    rosterCache.forEach(function (p) {
      totals[p.team % 4] += (Number(p.xp) || 0);
    });
    return totals;
  }

  function setClass(clsId) {
    if (!clsId || clsId === activeClassId) return;
    activeClassId = clsId;
    var clsObj = getActiveClass();
    // Sync active class straight back to parent platform schoolStore so Today, Shop & Class Board stay 100% aligned!
    try {
      var ps = getParentStore();
      if (ps && typeof ps.setActiveClass === 'function') ps.setActiveClass(clsId);
    } catch (e) {}
    try {
      var prefs = JSON.parse(localStorage.getItem('eaa_games_prefs') || '{}') || {};
      prefs.classId = clsId;
      prefs.packId = 'g' + clsObj.grade + '-u5-vocab';
      localStorage.setItem('eaa_games_prefs', JSON.stringify(prefs));
    } catch (e) {}
    closePop();
    loadClassesAndRoster();
    renderTopBar();
    if (HOST && HOST.updateGoalUI) HOST.updateGoalUI(false);
    if (HOST && HOST.respawnClassPupils) HOST.respawnClassPupils(rosterCache);
    if (K && K.ui && K.ui.toast) K.ui.toast('🎒 Switched to ' + clsObj.name + ' (' + rosterCache.length + ' pupils on island)', 1.8, '#4f9dff');
  }

  /* ── Award XP Strictly Through window.parent.schoolStore.giveXP() (Never Direct localStorage Writes!) ── */
  function awardPupilXP(pupil, amount, reason, worldPos) {
    var amt = Math.max(1, Math.round(Number(amount) || 1));
    var unlocked = isTeacherUnlocked();
    var pStore = getParentStore();
    if (unlocked && pupil.real && pStore && typeof pStore.giveXP === 'function') {
      try {
        pStore.giveXP(pupil.id, amt, reason || 'Classroom Star', 'Home Island');
        var updated = (pStore.state && Array.isArray(pStore.state.students))
          ? pStore.state.students.filter(function (s) { return s && s.id === pupil.id; })[0]
          : null;
        if (updated) {
          pupil.xp = Number(updated.totalXP) || 0;
          pupil.coins = Number(updated.coins) || 0;
        }
      } catch (e) {}
    } else {
      // Standalone / demo mode: visual celebration only, save nothing to storage!
      pupil.xp = (Number(pupil.xp) || 0) + amt;
    }

    playXpChord(amt >= 5);
    if (root.__home3d && root.__home3d.highlightPupil) {
      root.__home3d.highlightPupil(pupil.id);
    }
    if (K && K.fx && K.fx.confetti && worldPos) {
      K.fx.confetti(worldPos.clone().add(new T3.Vector3(0, 2.8, 0)), amt >= 5 ? 55 : 28);
    }
    renderTopBar();
    if (HOST && HOST.updateGoalUI) HOST.updateGoalUI(true);
    if (K && K.ui && K.ui.toast) {
      K.ui.toast('⭐ +' + amt + ' XP for ' + pupil.name + '!', 1.8, TEAM_META[pupil.team % 4].color);
    }
  }

  function awardTeamXP(teamIdx, amount) {
    if (!isTeacherUnlocked()) return;
    var tMeta = TEAM_META[teamIdx % 4];
    var members = rosterCache.filter(function (p) { return (p.team % 4) === (teamIdx % 4); });
    members.forEach(function (m) {
      awardPupilXP(m, amount, 'Team ' + tMeta.name + ' Bonus', null);
    });
    playXpChord(true);
    var hm = HOST && HOST.homes && HOST.homes[teamIdx];
    if (hm && hm.mon && K && K.fx && K.fx.confetti) {
      K.fx.confetti(hm.mon.clone().add(new T3.Vector3(0, 4.2, 0)), 80);
    }
    if (HOST && HOST.mons && HOST.mons[teamIdx]) {
      HOST.mons[teamIdx].setState('hop');
      K.after(1.6, function () { if (HOST.mons[teamIdx]) HOST.mons[teamIdx].setState('idle'); });
    }
    if (K && K.ui && K.ui.toast) {
      K.ui.toast(tMeta.icon + ' +' + amount + ' XP to every pupil on ' + tMeta.name + '!', 2.2, tMeta.color);
    }
  }

  /* ── Compact Top-Left Class Bar (Teacher-Only!) + Optional ?shapes=1 Dev Switch ── */
  function buildTopBar() {
    topBarEl = document.createElement('div');
    topBarEl.className = 'h3-cls-bar';
    document.body.appendChild(topBarEl);

    hallEl = document.createElement('div');
    hallEl.className = 'h3-hall-pill hidden';
    document.body.appendChild(hallEl);

    // Show the test shape-switch bar ONLY when ?shapes=1 is explicitly in the URL!
    var qs = new URLSearchParams(location.search);
    if (qs.get('shapes') === '1') {
      var curShape = qs.get('shape') || '1';
      var shapeBar = document.createElement('div');
      shapeBar.className = 'h3-shape-bar';
      var shapeOpts = [
        ['1', '1️⃣ Terraced Arc'],
        ['2', '2️⃣ Twin-Wing Acropolis'],
        ['3', '3️⃣ 5-Isle Star Archipelago']
      ];
      shapeBar.innerHTML = '<span class="h3-shape-lbl">🏝️ Shape:</span>' + shapeOpts.map(function (so) {
        var act = curShape === so[0] ? ' active' : '';
        return '<button type="button" class="h3-shape-btn' + act + '" data-shape="' + so[0] + '">' + so[1] + '</button>';
      }).join('');
      shapeBar.querySelectorAll('[data-shape]').forEach(function (btn) {
        btn.onclick = function () {
          var n = btn.getAttribute('data-shape');
          if (n === curShape) return;
          var u = new URL(location.href);
          u.searchParams.set('shape', n);
          location.href = u.pathname + u.search + u.hash;
        };
      });
      document.body.appendChild(shapeBar);
    }

    // Floating "← Full Archipelago" pill whenever zoomed into Games Island or focused on the Colosseum!
    var backPill = document.createElement('button');
    backPill.type = 'button';
    backPill.className = 'h3-arch-pill hidden';
    backPill.innerHTML = '🗺️ ← Full Archipelago';
    backPill.onclick = function () {
      if (K) K.sfx('tap');
      if (root.__home3d && root.__home3d.switchIsland) root.__home3d.switchIsland('both', false);
    };
    document.body.appendChild(backPill);
    setInterval(function () {
      var h3 = root.__home3d;
      var zoomedGames = h3 && h3.activeIsland && h3.activeIsland() === 'games';
      var zBadge = document.querySelector('.h3-zpct');
      var pct = zBadge ? parseInt(zBadge.textContent, 10) : 100;
      backPill.classList.toggle('hidden', !(zoomedGames || pct >= 180));
    }, 280);

    renderTopBar();
  }

  function renderTopBar() {
    if (!topBarEl) return;
    // Teacher-only controls: when locked (pupil view), hide class pills, team scores, and teacher controls!
    if (!isTeacherUnlocked()) {
      topBarEl.style.display = 'none';
      topBarEl.innerHTML = '';
      return;
    }
    topBarEl.style.display = '';
    var totals = getTeamTotals();
    var clsHtml = classesCache.map(function (c) {
      var on = c.id === activeClassId ? ' active' : '';
      return '<button type="button" class="h3-cls-pill' + on + '" data-cid="' + esc(c.id) + '">' + esc(c.short) + '</button>';
    }).join('');

    var teamsHtml = TEAM_META.map(function (tm, i) {
      return '<button type="button" class="h3-tm-chip" data-tidx="' + i + '" style="--tc:' + tm.color + '" title="Tap to reward ' + esc(tm.name) + '">' +
        '<span>' + tm.icon + '</span><b>' + totals[i] + '</b></button>';
    }).join('');

    var namesOn = !!root.__home3dForceNames;
    var utilHtml =
      '<button type="button" class="h3-util-chip" id="h3FocusColBtn" title="Zoom to seated students in the Colosseum">🏛️ Class</button>' +
      '<button type="button" class="h3-util-chip' + (namesOn ? ' on' : '') + '" id="h3NamesBtn" title="Show or hide all student name tags">🏷️ Names</button>';

    topBarEl.innerHTML =
      '<div class="h3-cls-group">' + clsHtml + '</div>' +
      '<div class="h3-tm-group">' + teamsHtml + '</div>' +
      '<div class="h3-util-group">' + utilHtml + '</div>';

    topBarEl.querySelectorAll('[data-cid]').forEach(function (btn) {
      btn.onclick = function () {
        if (K) K.sfx('tap');
        setClass(btn.getAttribute('data-cid'));
      };
    });
    topBarEl.querySelectorAll('[data-tidx]').forEach(function (btn) {
      btn.onclick = function (ev) {
        if (K) K.sfx('tap');
        var idx = Number(btn.getAttribute('data-tidx')) || 0;
        var hm = HOST && HOST.homes && HOST.homes[idx];
        onTapTeamHome(hm || { teamIdx: idx }, ev.clientX, ev.clientY + 18);
      };
    });
    var fBtn = topBarEl.querySelector('#h3FocusColBtn');
    if (fBtn) fBtn.onclick = function () {
      if (K) K.sfx('tap');
      if (root.__home3d && root.__home3d.focusColosseum) root.__home3d.focusColosseum();
    };
    var nBtn = topBarEl.querySelector('#h3NamesBtn');
    if (nBtn) nBtn.onclick = function () {
      if (K) K.sfx('tap');
      root.__home3dForceNames = !root.__home3dForceNames;
      renderTopBar();
    };
  }

  /* ── Hall Pass Live Timer Badge ── */
  function startHallPass(pupil) {
    hallPass = { id: pupil.id, name: pupil.name, startedAt: Date.now() };
    closePop();
    updateHallPassUI();
    if (!hallPassTimer) hallPassTimer = setInterval(updateHallPassUI, 1000);
    if (K && K.ui && K.ui.toast) K.ui.toast('🚻 Hall Pass started for ' + pupil.name, 2.0, '#2fc58a');
  }

  function endHallPass() {
    hallPass = null;
    if (hallPassTimer) { clearInterval(hallPassTimer); hallPassTimer = null; }
    if (hallEl) hallEl.className = 'h3-hall-pill hidden';
  }

  function updateHallPassUI() {
    if (!hallEl || !hallPass) return;
    var sec = Math.max(0, Math.floor((Date.now() - hallPass.startedAt) / 1000));
    var mm = ('0' + Math.floor(sec / 60)).slice(-2);
    var ss = ('0' + (sec % 60)).slice(-2);
    hallEl.className = 'h3-hall-pill';
    hallEl.innerHTML = '<span>🚻 <b>' + esc(hallPass.name) + '</b> · ' + mm + ':' + ss + '</span>' +
      '<button type="button" class="h3-hall-done">✓ Back</button>';
    var btn = hallEl.querySelector('.h3-hall-done');
    if (btn) btn.onclick = function () { if (K) K.sfx('tap'); endHallPass(); };
  }

  /* ── 3D Pupil, Team Monster & Tool Popover Card (#h3-pop-card) ── */
  function ensurePop() {
    if (popEl) return popEl;
    popEl = document.createElement('div');
    popEl.id = 'h3-pop-card';
    popEl.className = 'h3-pop-card hidden';
    document.body.appendChild(popEl);
    document.addEventListener('pointerdown', function (e) {
      if (!popEl || popEl.classList.contains('hidden')) return;
      if (popEl.contains(e.target)) return;
      if (e.target && e.target.closest && e.target.closest('.h3-cls-bar')) return;
      closePop();
    });
    return popEl;
  }

  function closePop() {
    if (popEl) popEl.classList.add('hidden');
  }

  function placePopAt(cx, cy) {
    var el = ensurePop();
    el.classList.remove('hidden');
    var w = Math.min(340, innerWidth - 24);
    var x = Math.max(12, Math.min(innerWidth - w - 12, (cx || innerWidth / 2) - w / 2));
    var y = Math.max(68, Math.min(innerHeight - 250, (cy || innerHeight / 2) - 40));
    el.style.left = Math.round(x) + 'px';
    el.style.top = Math.round(y) + 'px';
  }

  function onTapPupil(npc, cx, cy) {
    // Teacher-only +1/+3/+5 XP popover: pupils only see a friendly wave/cheer!
    if (!isTeacherUnlocked()) {
      if (npc && npc.k) npc.k.setState('sitWave');
      return;
    }
    var pupil = (npc && npc.pupil) || rosterCache[(npc ? npc.idx : 0) % Math.max(1, rosterCache.length)];
    if (!pupil) return;
    var tm = TEAM_META[pupil.team % 4];
    var lvl = Math.max(1, Math.floor((Number(pupil.xp) || 0) / 100) + 1);
    var el = ensurePop();
    el.style.setProperty('--pc', tm.color);
    el.innerHTML =
      '<div class="h3-pop-head">' +
        '<span class="h3-pop-badge" style="background:' + tm.color + '">' + tm.icon + '</span>' +
        '<div class="h3-pop-meta"><b>' + esc(pupil.name) + '</b><small>' + esc(tm.name) + ' · Lv.' + lvl + ' · ⭐ ' + (pupil.xp || 0) + ' XP</small></div>' +
        '<button type="button" class="h3-pop-x" aria-label="Close">✕</button>' +
      '</div>' +
      '<div class="h3-pop-xp-row">' +
        '<button type="button" class="h3-xp-btn green" data-xp="1">⭐ +1 XP</button>' +
        '<button type="button" class="h3-xp-btn blue" data-xp="3">🌟 +3 XP</button>' +
        '<button type="button" class="h3-xp-btn gold" data-xp="5">🏆 +5 XP</button>' +
      '</div>' +
      '<div class="h3-pop-sub-row">' +
        '<button type="button" class="h3-sub-btn" data-act="pass">🚻 Hall Pass</button>' +
        '<button type="button" class="h3-sub-btn" data-act="shop">👕 Shop &amp; Look</button>' +
      '</div>';
    placePopAt(cx, cy);

    el.querySelector('.h3-pop-x').onclick = closePop;
    el.querySelectorAll('[data-xp]').forEach(function (b) {
      b.onclick = function () {
        var amt = Number(b.getAttribute('data-xp')) || 1;
        var pos = npc && npc.k && npc.k.root ? npc.k.root.position : null;
        if (npc && npc.k) npc.k.setState('sitCheer');
        awardPupilXP(pupil, amt, 'Classroom Star', pos);
        closePop();
      };
    });
    el.querySelector('[data-act="pass"]').onclick = function () { startHallPass(pupil); };
    el.querySelector('[data-act="shop"]').onclick = function () {
      goPlatformView('store-pupil');
    };
  }

  function onTapTeamHome(homeObj, cx, cy) {
    if (!isTeacherUnlocked()) {
      var ti0 = (homeObj && homeObj.teamIdx != null) ? homeObj.teamIdx : 0;
      if (HOST && HOST.mons && HOST.mons[ti0]) {
        HOST.mons[ti0].setState('wave');
        K.after(1.4, function () { if (HOST.mons[ti0]) HOST.mons[ti0].setState('idle'); });
      }
      return;
    }
    var tIdx = (homeObj && homeObj.teamIdx != null) ? homeObj.teamIdx : 0;
    var tm = TEAM_META[tIdx % 4];
    var totals = getTeamTotals();
    var el = ensurePop();
    el.style.setProperty('--pc', tm.color);
    el.innerHTML =
      '<div class="h3-pop-head">' +
        '<span class="h3-pop-badge" style="background:' + tm.color + '">' + tm.icon + '</span>' +
        '<div class="h3-pop-meta"><b>' + esc(tm.name) + '</b><small>Total Score: ⭐ ' + totals[tIdx % 4] + ' XP</small></div>' +
        '<button type="button" class="h3-pop-x" aria-label="Close">✕</button>' +
      '</div>' +
      '<div class="h3-pop-xp-row">' +
        '<button type="button" class="h3-xp-btn green" data-txp="1">⭐ +1 Team</button>' +
        '<button type="button" class="h3-xp-btn blue" data-txp="3">🌟 +3 Team</button>' +
        '<button type="button" class="h3-xp-btn gold" data-txp="5">🏆 +5 Team</button>' +
      '</div>';
    placePopAt(cx, cy);
    el.querySelector('.h3-pop-x').onclick = closePop;
    el.querySelectorAll('[data-txp]').forEach(function (b) {
      b.onclick = function () {
        awardTeamXP(tIdx, Number(b.getAttribute('data-txp')) || 1);
        closePop();
      };
    });
  }

  /* ── Physical 3D Tool Prop Dispatcher ── */
  function onTapToolProp(p) {
    var IT = root.IslandTools;
    var tid = p.toolId;
    closePop();
    if (tid === 'ufo') {
      if (IT && IT.openPicker) {
        var st = IT.getState ? IT.getState() : {};
        if (!st.pickerOpen) IT.openPicker();
        else if (!st.active && IT.pick) IT.pick();
      }
      return;
    }
    if (tid === 'timer' && IT && IT.timer) { IT.timer.open(); return; }
    if (tid === 'freeze' && IT && IT.freeze) { IT.freeze.toggle(); return; }
    if (tid === 'dice' && IT && IT.dice) { IT.dice.open(); return; }
    if (tid === 'prize' && IT && IT.prize) { IT.prize.open(); return; }
    if (tid === 'groups') {
      var elG = ensurePop();
      elG.style.setProperty('--pc', '#4f9dff');
      elG.innerHTML =
        '<div class="h3-pop-head"><span class="h3-pop-badge" style="background:#4f9dff">👫</span><div class="h3-pop-meta"><b>Teams &amp; Line-Up</b><small>' + esc(getActiveClass().name) + '</small></div><button type="button" class="h3-pop-x">✕</button></div>' +
        '<div class="h3-pop-sub-row">' +
          '<button type="button" class="h3-xp-btn blue" id="h3GoGroups">👫 Make Groups</button>' +
          '<button type="button" class="h3-xp-btn green" id="h3GoLineup">🚶 Line-Up</button>' +
        '</div>';
      placePopAt(innerWidth * 0.36, innerHeight * 0.45);
      elG.querySelector('.h3-pop-x').onclick = closePop;
      elG.querySelector('#h3GoGroups').onclick = function () { closePop(); if (IT && IT.groups) IT.groups.open(); };
      elG.querySelector('#h3GoLineup').onclick = function () { closePop(); if (IT && IT.lineup) IT.lineup.open(); };
      return;
    }
    if (tid === 'party') {
      var elP = ensurePop();
      elP.style.setProperty('--pc', '#ff5fa2');
      elP.innerHTML =
        '<div class="h3-pop-head"><span class="h3-pop-badge" style="background:#ff5fa2">🎂</span><div class="h3-pop-meta"><b>Celebrations</b><small>Stars of the Week &amp; Birthdays</small></div><button type="button" class="h3-pop-x">✕</button></div>' +
        '<div class="h3-pop-sub-row">' +
          '<button type="button" class="h3-xp-btn gold" id="h3GoStars">⭐ Two Stars</button>' +
          '<button type="button" class="h3-xp-btn blue" id="h3GoBday">🎂 Birthday Party</button>' +
        '</div>';
      placePopAt(innerWidth * 0.56, innerHeight * 0.36);
      elP.querySelector('.h3-pop-x').onclick = closePop;
      elP.querySelector('#h3GoStars').onclick = function () { closePop(); if (IT && IT.stars) IT.stars.open(); };
      elP.querySelector('#h3GoBday').onclick = function () { closePop(); if (IT && IT.birthday) IT.birthday.open(); };
      return;
    }
    if (tid === 'bell') {
      if (root.classSoundboard && root.classSoundboard.playAttentionBell) root.classSoundboard.playAttentionBell();
      openSoundboardPop();
      return;
    }
    if (tid === 'pass') {
      openHallPassPickerPop();
    }
  }

  function openSoundboardPop() {
    var el = ensurePop();
    el.style.setProperty('--pc', '#ffb320');
    var sfx = [
      ['1', '🎉 Horn', 'playPartyHorn'],
      ['2', '🔔 Bell', 'playAttentionBell'],
      ['3', '🥣 Quiet', 'playQuietChime'],
      ['4', '⏰ Buzzer', 'playCountdownBuzzer'],
      ['5', '👏 Clap', 'playApplause'],
      ['6', '🪙 Point', 'playCoinReward'],
      ['7', '🎺 Fanfare', 'playFanfare']
    ];
    var quickTools = [
      ['🛸 UFO Picker', 'ufo'],
      ['⏱️ Sun Timer', 'timer'],
      ['👫 Groups / Line', 'groups'],
      ['🎲 Dice & Wheel', 'dice'],
      ['🎁 Prize Drop', 'prize'],
      ['❄️ Freeze (F)', 'freeze'],
      ['🎂 Stars & Bday', 'party'],
      ['🚻 Hall Pass', 'pass']
    ];
    el.innerHTML =
      '<div class="h3-pop-head"><span class="h3-pop-badge" style="background:#ffb320">🔔</span><div class="h3-pop-meta"><b>Plaza Classroom Toolkit</b><small>All 3D Island Tools + Soundboard (1–7)</small></div><button type="button" class="h3-pop-x">✕</button></div>' +
      '<div class="h3-sfx-grid" style="margin-bottom:10px">' +
        quickTools.map(function (qt) {
          return '<button type="button" class="h3-sfx-btn" data-tool="' + qt[1] + '" style="border-color:#cfe4ff;border-bottom-color:#8ebaf5">' + qt[0] + '</button>';
        }).join('') +
      '</div>' +
      '<div class="h3-sfx-grid">' +
        sfx.map(function (s) {
          return '<button type="button" class="h3-sfx-btn" data-fn="' + s[2] + '"><em>' + s[0] + '</em>' + s[1] + '</button>';
        }).join('') +
      '</div>';
    placePopAt(innerWidth * 0.50, innerHeight * 0.44);
    el.querySelector('.h3-pop-x').onclick = closePop;
    el.querySelectorAll('[data-tool]').forEach(function (b) {
      b.onclick = function () {
        var tid = b.getAttribute('data-tool');
        closePop();
        onTapToolProp({ toolId: tid });
      };
    });
    el.querySelectorAll('[data-fn]').forEach(function (b) {
      b.onclick = function () {
        var fn = b.getAttribute('data-fn');
        if (root.classSoundboard && typeof root.classSoundboard[fn] === 'function') root.classSoundboard[fn]();
      };
    });
  }

  function openHallPassPickerPop() {
    var el = ensurePop();
    el.style.setProperty('--pc', '#2fc58a');
    el.innerHTML =
      '<div class="h3-pop-head"><span class="h3-pop-badge" style="background:#2fc58a">🚻</span><div class="h3-pop-meta"><b>Hall / Bathroom Pass</b><small>Tap a pupil to start pass timer</small></div><button type="button" class="h3-pop-x">✕</button></div>' +
      '<div class="h3-pass-grid">' +
        rosterCache.map(function (p, idx) {
          return '<button type="button" class="h3-pass-kid" data-pidx="' + idx + '">' + esc(p.name) + '</button>';
        }).join('') +
      '</div>';
    placePopAt(innerWidth * 0.46, innerHeight * 0.52);
    el.querySelector('.h3-pop-x').onclick = closePop;
    el.querySelectorAll('[data-pidx]').forEach(function (b) {
      b.onclick = function () {
        var p = rosterCache[Number(b.getAttribute('data-pidx')) || 0];
        if (p) startHallPass(p);
      };
    });
  }

  /* ── Keep 3D Home Island Alive Underneath: Instant Live Overlay Frame (#h3-live-overlay) ── */
  function ensureOverlay() {
    if (overlayEl) return overlayEl;
    overlayEl = document.createElement('div');
    overlayEl.id = 'h3-live-overlay';
    overlayEl.className = 'h3-live-overlay hidden';
    overlayEl.innerHTML =
      '<div class="h3-ov-card">' +
        '<div class="h3-ov-bar">' +
          '<button type="button" class="h3-ov-back" id="h3OvBack">🏝️ ← Back to Island</button>' +
          '<div class="h3-ov-title" id="h3OvTitle">🏰 Today\'s Lesson</div>' +
          '<div class="h3-ov-tabs" id="h3OvTabs"></div>' +
          '<a class="h3-ov-ext" id="h3OvExt" href="#" target="_blank" rel="noopener" title="Open in separate tab">↗</a>' +
        '</div>' +
        '<div class="h3-ov-body" id="h3OvBody">' +
          '<iframe id="h3OvFrame" class="h3-ov-frame" allow="microphone; autoplay; fullscreen"></iframe>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlayEl);
    overlayTitleEl = overlayEl.querySelector('#h3OvTitle');
    overlayTabs = overlayEl.querySelector('#h3OvTabs');
    overlayBody = overlayEl.querySelector('#h3OvBody');
    overlayFrame = overlayEl.querySelector('#h3OvFrame');
    overlayEl.querySelector('#h3OvBack').onclick = closeOverlay;

    // Intercept return-to-home3d navigations inside child games so clicking "Back to Games Island / Grow Bridge" closes smoothly!
    overlayFrame.addEventListener('load', function () {
      try {
        var cw = overlayFrame.contentWindow;
        if (!cw || overlayEl.classList.contains('hidden')) return;
        var pth = cw.location && cw.location.pathname || '';
        if (/\/home3d\/index\.html$/i.test(pth)) {
          var qs = new URLSearchParams(cw.location.search || '');
          var retGame = qs.get('returned') || '';
          var wantIsl = qs.get('island') || '';
          closeOverlay();
          if (wantIsl === 'games' && HOST && HOST.switchIsland) HOST.switchIsland('games', false);
          else if (wantIsl === 'home' && HOST && HOST.switchIsland) HOST.switchIsland('both', false);
          if (retGame && K && K.ui && K.ui.toast) {
            K.ui.toast('🏆 Adventure complete! 🌉 Treasure Bridge updated!', 3.0, '#2fc58a');
          }
        }
      } catch (e) {}
    });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlayEl && !overlayEl.classList.contains('hidden')) {
        closeOverlay();
      }
    });
    return overlayEl;
  }

  var _lastOverlaySnap = '';
  function _outfitSnapshot() {
    try {
      var u = sessionStorage.getItem('eaa_auth_unlocked') || '';
      var st = localStorage.getItem('eaa_master_school_v6') || '';
      return u + ':' + st.length + ':' + rosterCache.map(function (r) { return r.id + '=' + r.name; }).join(',');
    } catch (e) { return ''; }
  }

  function openOverlay(url, title, opts) {
    opts = opts || {};
    // Hard guard: NEVER nest ../index.html inside the island iframe! Route platform views to window.parent.switchView().
    if (!opts.todayHub && url && /(^|\/)index\.html(#([a-z0-9-]+))?$/i.test(url)) {
      var mm = /#([a-z0-9-]+)$/i.exec(url);
      goPlatformView(mm ? mm[1] : 'today');
      return;
    }
    closePop();
    ensureOverlay();
    _lastOverlaySnap = _outfitSnapshot();
    overlayEl.classList.remove('hidden');
    if (HOST && HOST.setCameraLock) HOST.setCameraLock(true);
    if (K) K.paused = true; // Pause 3D island WebGL loop so child app runs at 100% 60fps!
    if (root.QuietIsland && root.QuietIsland.setOverlayPaused) root.QuietIsland.setOverlayPaused(true); // Auto-pause Quiet Island noise mic during lessons/games!
    overlayTitleEl.textContent = title || 'English Adventure Academy';
    var ext = overlayEl.querySelector('#h3OvExt');
    if (ext) ext.href = url || '../index.html';

    var customPane = overlayBody.querySelector('.h3-today-pane');
    if (customPane) customPane.remove();

    if (opts.todayHub) {
      overlayFrame.style.display = 'none';
      overlayFrame.src = 'about:blank';
      renderTodayHubPane();
    } else {
      overlayFrame.style.display = 'block';
      overlayFrame.src = url;
    }
    renderOverlayTabs(opts.activeTab || '');
  }

  function renderOverlayTabs(activeKey) {
    if (!overlayTabs) return;
    var cls = getActiveClass();
    var g = cls.grade || 3;
    // Never load ../index.html inside an iframe — platform routes use window.parent.switchView()!
    var tabs = [
      { k: 'today', lbl: '🏰 Today (' + cls.short + ')', act: function () { openOverlay('', '🏰 Today\'s Lesson · ' + cls.name, { todayHub: true, activeTab: 'today' }); } },
      { k: 'magic', lbl: '📖 Magic Book G' + g, act: function () { openOverlay('../magic-book/index.html?grade=' + g, '📖 Unit 5 Magic Book · Grade ' + g, { activeTab: 'magic' }); } },
      { k: 'smart', lbl: '🎨 Smart Board', act: function () { openOverlay('../smart-board/index.html', '🎨 AI Smart Board Studio', { activeTab: 'smart' }); } },
      { k: 'board', lbl: '📺 Class Board', act: function () { goPlatformView('board'); } },
      { k: 'shop',  lbl: '🛍️ Shop', act: function () { goPlatformView('store-pupil'); } },
      { k: 'lib',   lbl: '📚 All Lessons', act: function () { goPlatformView('library'); } }
    ];
    overlayTabs.innerHTML = '';
    tabs.forEach(function (tb) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'h3-ov-tab' + (tb.k === activeKey ? ' active' : '');
      b.textContent = tb.lbl;
      b.onclick = function () { if (K) K.sfx('tap'); tb.act(); };
      overlayTabs.appendChild(b);
    });
  }

  function renderTodayHubPane() {
    var cls = getActiveClass();
    var g = cls.grade || 3;
    var pane = document.createElement('div');
    pane.className = 'h3-today-pane';

    var cat = (root.Timetable && Array.isArray(root.Timetable.catalog || root.Timetable.CATALOG)) ? (root.Timetable.catalog || root.Timetable.CATALOG) : [];
    var sched = (root.Timetable && typeof root.Timetable.today === 'function') ? root.Timetable.today(cls.id) : { list: [] };
    var featured = cat.filter(function (c) { return c.route && (!c.g || c.g === g) && (c.unit === 5 || c.unit === 4); }).slice(0, 10);

    var schedHtml = '';
    if (sched && sched.list && sched.list.length) {
      schedHtml = '<div class="h3-td-sec"><h3>📅 Scheduled for ' + esc(cls.name) + ' (' + esc(sched.day || 'Today') + ')</h3><div class="h3-td-grid">' +
        sched.list.map(function (it) {
          var rt = it.route ? ('../' + it.route.replace(/^\.\.\//, '')) : '';
          return '<button type="button" class="h3-td-card hero" data-url="' + esc(rt) + '" data-ttl="' + esc(it.title) + '">' +
            '<span class="h3-td-ic">' + (it.icon || '▶️') + '</span>' +
            '<div class="h3-td-txt">' + (it.time ? '<em>' + esc(it.time) + '</em>' : '') + '<b>' + esc(it.title) + '</b></div>' +
            '<i class="h3-td-go">▶ Start</i></button>';
        }).join('') + '</div></div>';
    }

    var unitHtml = '<div class="h3-td-sec"><h3>🚀 Ready-to-Teach Grade ' + g + ' Lessons &amp; Reviews (1-Tap Launch)</h3><div class="h3-td-grid">' +
      featured.map(function (c) {
        return '<button type="button" class="h3-td-card" data-url="' + esc('../' + c.route) + '" data-ttl="' + esc(c.title) + '">' +
          '<span class="h3-td-ic">' + (c.icon || '📘') + '</span>' +
          '<div class="h3-td-txt"><em>Unit ' + (c.unit || '') + ' · Grade ' + g + '</em><b>' + esc(c.title) + '</b></div>' +
          '<i class="h3-td-go">▶</i></button>';
      }).join('') + '</div></div>';

    pane.innerHTML =
      '<div class="h3-td-top">' +
        '<div><h2>🏰 ' + esc(cls.name) + ' — Today\'s Classroom Hub</h2><p>Pick a lesson below — 3D Home Island stays alive underneath so you can jump back in 1 tap!</p></div>' +
        '<div class="h3-td-cls-switch">' +
          classesCache.map(function (cc) {
            return '<button type="button" class="h3-cls-pill' + (cc.id === activeClassId ? ' active' : '') + '" data-tcid="' + esc(cc.id) + '">' + esc(cc.short) + '</button>';
          }).join('') +
        '</div>' +
      '</div>' +
      schedHtml +
      unitHtml;

    overlayBody.appendChild(pane);

    pane.querySelectorAll('[data-tcid]').forEach(function (b) {
      b.onclick = function () {
        setClass(b.getAttribute('data-tcid'));
        openOverlay('', '🏰 Today\'s Lesson · ' + getActiveClass().name, { todayHub: true, activeTab: 'today' });
      };
    });
    pane.querySelectorAll('[data-url]').forEach(function (b) {
      b.onclick = function () {
        if (K) K.sfx('tap');
        openOverlay(b.getAttribute('data-url'), b.getAttribute('data-ttl'));
      };
    });
  }

  function closeOverlay() {
    if (!overlayEl || overlayEl.classList.contains('hidden')) return;
    overlayEl.classList.add('hidden');
    if (overlayFrame) overlayFrame.src = 'about:blank';
    if (HOST && HOST.setCameraLock) HOST.setCameraLock(false);
    if (K) K.paused = false;
    if (root.QuietIsland && root.QuietIsland.setOverlayPaused) root.QuietIsland.setOverlayPaused(false);
    loadClassesAndRoster();
    renderTopBar();
    if (HOST && HOST.updateGoalUI) HOST.updateGoalUI(true);
    // Live-refresh 3D student outfits/hats & real names if teacher unlocked or shop purchases happened!
    if (_outfitSnapshot() !== _lastOverlaySnap && HOST && HOST.respawnClassPupils) {
      HOST.respawnClassPupils(rosterCache);
    }
  }

  function openPlace(p, decoratedHref) {
    if (!p) return;
    var cls = getActiveClass();
    var g = cls.grade || 3;
    if (p.id === 'today') {
      openOverlay('', '🏰 Today\'s Lesson · ' + cls.name, { todayHub: true, activeTab: 'today' });
      return;
    }
    if (p.id === 'smartboard') {
      openOverlay('../smart-board/index.html', '🎨 AI Smart Board & Whiteboard Studio', { activeTab: 'smart' });
      return;
    }
    if (p.id === 'library') {
      openOverlay('../magic-book/index.html?grade=' + g, '📖 Unit 5 Magic Book · Grade ' + g, { activeTab: 'magic' });
      return;
    }
    if (p.id === 'shop') {
      goPlatformView('store-pupil');
      return;
    }
    if (p.id === 'board') {
      goPlatformView('board');
      return;
    }
    var href = decoratedHref || p.link || '';
    var mIdx = /index\.html#([a-z0-9-]+)/i.exec(href);
    if (mIdx) {
      goPlatformView(mIdx[1]);
      return;
    }
    if (href) {
      openOverlay(href, (p.signTitle || p.title || 'Adventure'));
    }
  }

  /* ── Global 1–7 Classroom Soundboard Hotkeys on Home Island ── */
  function installSoundboardHotkeys() {
    var map = {
      '1': 'playPartyHorn',
      '2': 'playAttentionBell',
      '3': 'playQuietChime',
      '4': 'playCountdownBuzzer',
      '5': 'playApplause',
      '6': 'playCoinReward',
      '7': 'playFanfare'
    };
    root.addEventListener('keydown', function (e) {
      if (overlayEl && !overlayEl.classList.contains('hidden')) return;
      if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
      var fn = map[e.key];
      if (fn && root.classSoundboard && typeof root.classSoundboard[fn] === 'function') {
        root.classSoundboard[fn]();
      }
    });
  }

  function initHub() {
    HOST = root.__home3dQuietHost;
    if (!HOST) return;
    K = HOST.K; T3 = HOST.T3;

    loadClassesAndRoster();
    buildTopBar();
    installSoundboardHotkeys();

    // Sync IslandTools (UFO Picker, Groups, Line-up, Stars, Birthday) to our active class roster!
    function bindIslandToolsRoster() {
      if (root.IslandTools) {
        root.IslandTools.getRoster = function () { return rosterCache.slice(); };
      }
    }
    bindIslandToolsRoster();
    root.addEventListener('islandtools:ready', bindIslandToolsRoster);

    // Spawn ALL active class pupils walking across Home Island!
    if (HOST.respawnClassPupils) {
      HOST.respawnClassPupils(rosterCache);
    }
  }

  root.ClassroomHub = {
    openPlace: openPlace,
    openOverlay: openOverlay,
    closeOverlay: closeOverlay,
    goPlatformView: goPlatformView,
    onTapPupil: onTapPupil,
    onTapTeamHome: onTapTeamHome,
    onTapToolProp: onTapToolProp,
    setClass: setClass,
    getActiveClass: getActiveClass,
    getRoster: function () { return rosterCache.slice(); },
    getTeams: function () {
      return TEAM_META.map(function (t) {
        return { id: t.idx, name: t.name, c: t.color, d: t.dark, icon: t.icon };
      });
    },
    isTeacherUnlocked: isTeacherUnlocked,
    awardPupilXP: awardPupilXP
  };

  if (root.__home3dQuietHost) initHub();
  else root.addEventListener('home3d:ready', initHub, { once: true });
})(window);
