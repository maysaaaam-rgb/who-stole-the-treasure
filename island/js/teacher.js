/* Practice Island — Teacher Studio Controller (island/js/teacher.js)
   Manages 6-char personal pupil codes, private Star Path ticks, daily XP limits (10-60),
   k12 class list copy (Name: link), 8-per-A4 printable link cards, and This Week view.
   Writes ONLY to classes row id = "class-island-sync". */
(function (root) {
  'use strict';

  var CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var DEMO_SYNC_KEY = 'eaa_island_demo_sync';
  var TEST_SYNC_KEY = 'eaa_island_test_sync';
  var LIVE_BASE_URL = 'https://maysaaid-hash.github.io/who-stole-the-treasure/island/';

  var state = {
    isDemo: false,
    loaded: false,
    loadingPromise: null,
    activeClass: '3A',
    classes: ['3A', '3B', '4A', '4B'],
    studentsByClass: { '3A': [], '3B': [], '4A': [], '4B': [] },
    islandDocs: {},
    lastCopiedText: '',
    syncDoc: {
      codes: {},
      star: {},
      cap: 30,
      starCap: 45,
      applied: {},
      updatedAt: ''
    }
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function client() {
    return root.AdventureSupabase && root.AdventureSupabase.client ? root.AdventureSupabase.client : null;
  }

  function parseJsonSafe(raw, fallback) {
    if (!raw) return fallback;
    if (typeof raw === 'object') return raw;
    try { return JSON.parse(raw); } catch (e) { return fallback; }
  }

  function toast(msg) {
    var el = document.getElementById('tch-toast');
    if (el) el.textContent = msg || '';
  }

  function isLocked() {
    return document.documentElement.classList.contains('platform-locked');
  }

  /* Merge two class-island-sync documents by updatedAt */
  function mergeSyncDocs(olderDoc, newerDoc) {
    var a = olderDoc || {};
    var b = newerDoc || {};
    var aNewer = String(a.updatedAt || '') > String(b.updatedAt || '');
    var pri = aNewer ? a : b;
    var sec = aNewer ? b : a;

    var mergedCodes = Object.assign({}, sec.codes || {}, pri.codes || {});
    var mergedStar = Object.assign({}, pri.star || {});
    var mergedApplied = Object.assign({}, sec.applied || {});
    Object.keys(pri.applied || {}).forEach(function (sid) {
      mergedApplied[sid] = Object.assign({}, mergedApplied[sid] || {}, pri.applied[sid] || {});
    });

    var out = {
      codes: mergedCodes,
      star: mergedStar,
      cap: Math.max(10, Math.min(60, Number(pri.cap != null ? pri.cap : sec.cap) || 30)),
      starCap: Math.max(10, Math.min(60, Number(pri.starCap != null ? pri.starCap : sec.starCap) || 45)),
      applied: mergedApplied,
      updatedAt: new Date().toISOString()
    };
    if (pri.lookApplied || sec.lookApplied) {
      out.lookApplied = Object.assign({}, sec.lookApplied || {}, pri.lookApplied || {});
    }
    return out;
  }

  function studentCodeMap() {
    var rev = {};
    var codes = (state.syncDoc && state.syncDoc.codes) || {};
    Object.keys(codes).forEach(function (code) {
      var sid = codes[code];
      if (sid && !rev[sid]) rev[sid] = code;
    });
    return rev;
  }

  function generateOneCode(usedCodes) {
    for (var tries = 0; tries < 300; tries++) {
      var out = '';
      for (var i = 0; i < 6; i++) {
        out += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
      }
      if (!usedCodes[out]) {
        usedCodes[out] = true;
        return out;
      }
    }
    return 'K7P2QX';
  }

  function loadDemoRoster() {
    state.studentsByClass = {
      '3A': [
        { id: 'demo-3a-1', name: 'Ada Lovelace', className: '3A' },
        { id: 'demo-g3',   name: 'Test Pupil 3', className: '3A' },
        { id: 'demo-3a-3', name: 'Zeynep Kaya',  className: '3A' }
      ],
      '3B': [
        { id: 'demo-3b-1', name: 'Emir Demir',      className: '3B' },
        { id: 'demo-star', name: 'Test Pupil Star', className: '3B' }
      ],
      '4A': [
        { id: 'demo-4a-1', name: 'Defne Yilmaz', className: '4A' },
        { id: 'demo-g4',   name: 'Test Pupil 4', className: '4A' }
      ],
      '4B': [
        { id: 'demo-4b-1', name: 'Kerem Arslan', className: '4B' }
      ]
    };

    var savedSync = null;
    try { savedSync = parseJsonSafe(localStorage.getItem(DEMO_SYNC_KEY), null); } catch (e) {}
    if (savedSync && savedSync.codes) {
      state.syncDoc = mergeSyncDocs(state.syncDoc, savedSync);
    } else {
      state.syncDoc.codes = { 'DEM3AX': 'demo-g3', 'DEM4AX': 'demo-g4', 'STR3BX': 'demo-star' };
      state.syncDoc.star = { 'demo-star': true };
    }

    ['demo-g3', 'demo-g4', 'demo-star'].forEach(function (id) {
      try {
        var d = parseJsonSafe(localStorage.getItem('eaa_island_demo_doc_' + id), null);
        if (d) state.islandDocs[id] = d;
      } catch (e) {}
    });
  }

  function detectClassBucket(rawStr, classIdMap) {
    var s = String(rawStr || '').trim();
    if (classIdMap && classIdMap[s]) return classIdMap[s];
    var up = s.toUpperCase();
    for (var i = 0; i < state.classes.length; i++) {
      var k = state.classes[i];
      if (up.indexOf(k) !== -1) return k;
    }
    return null;
  }

  async function loadLiveRoster() {
    var byClass = { '3A': [], '3B': [], '4A': [], '4B': [] };
    var classIdMap = {
      'class-3a': '3A',
      'class-3b': '3B',
      'class-4a': '4A',
      'class-4b': '4B'
    };

    var sb = client();
    if (sb) {
      try {
        /* 1. Read classes table (skipping archived and System rows, plus reading class-island-sync & island-* rows) */
        var clsRes = await sb.from('classes').select('*');
        var clsRows = (clsRes && Array.isArray(clsRes.data)) ? clsRes.data : [];
        clsRows.forEach(function (r) {
          if (!r || !r.id) return;
          if (r.id === 'class-island-sync') {
            var cloudSync = parseJsonSafe(r.description, null);
            if (cloudSync) {
              state.syncDoc = mergeSyncDocs(state.syncDoc, cloudSync);
            }
            return;
          }
          if (String(r.id).indexOf('island-') === 0) {
            var pDoc = parseJsonSafe(r.description, null);
            var sid = (pDoc && pDoc.studentId) || String(r.id).replace(/^island-/, '');
            if (sid && pDoc) state.islandDocs[sid] = pDoc;
            return;
          }
          if (r.archived === true || String(r.grade || '').toLowerCase() === 'system') return;
          var bucket = detectClassBucket(r.name || r.id, null);
          if (bucket) classIdMap[r.id] = bucket;
        });

        /* 2. Read students table (skipping archived and System rows) */
        var stuRes = await sb.from('students').select('*');
        var stuRows = (stuRes && Array.isArray(stuRes.data)) ? stuRes.data : [];
        stuRows.forEach(function (s) {
          if (!s || !s.id) return;
          if (s.archived === true || (s.extra_data && s.extra_data.archived === true)) return;
          if (String(s.grade || '').toLowerCase() === 'system') return;
          var bucket = detectClassBucket(s.class_id || s.classId || s.id, classIdMap);
          if (!bucket) return;
          var fullName = String(
            s.name ||
            ((s.first_name || s.firstName || '') + ' ' + (s.last_name || s.lastName || '')).trim() ||
            s.id
          ).trim();
          byClass[bucket].push({
            id: String(s.id),
            name: fullName,
            firstName: String(s.first_name || s.firstName || fullName).trim().split(/\s+/)[0],
            className: bucket
          });
        });
      } catch (e) {}
    }

    /* Check optional test stub in localStorage if present */
    try {
      var testSync = parseJsonSafe(localStorage.getItem(TEST_SYNC_KEY), null);
      if (testSync) state.syncDoc = mergeSyncDocs(state.syncDoc, testSync);
    } catch (e) {}

    var totalLoaded = Object.keys(byClass).reduce(function (s, k) { return s + byClass[k].length; }, 0);
    if (totalLoaded === 0) {
      loadDemoRoster();
    } else {
      state.studentsByClass = byClass;
    }
  }

  /* Return last 7 days (oldest to today) for This Week view */
  function getWeekDays() {
    var now = new Date();
    var out = [];
    var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (var i = 6; i >= 0; i--) {
      var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      var key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      out.push({
        key: key,
        label: dayNames[d.getDay()] + ' ' + String(d.getDate()).padStart(2, '0')
      });
    }
    return out;
  }

  function calcWeeklyXP(doc) {
    if (!doc || !doc.days) return 0;
    return getWeekDays().reduce(function (sum, d) {
      return sum + (Number(doc.days[d.key] && doc.days[d.key].xp) || 0);
    }, 0);
  }

  function renderAll() {
    var grid = document.getElementById('tch-roster-grid');
    var weekHead = document.getElementById('tch-week-head');
    var weekBody = document.getElementById('tch-week-body');
    var tabsEl = document.getElementById('tch-class-tabs');

    /* Show nothing about pupils before unlock */
    if (isLocked()) {
      if (grid) grid.innerHTML = '';
      if (weekHead) weekHead.innerHTML = '';
      if (weekBody) weekBody.innerHTML = '';
      if (tabsEl) tabsEl.innerHTML = '';
      return;
    }

    if (tabsEl) {
      tabsEl.innerHTML = state.classes.map(function (c) {
        var count = (state.studentsByClass[c] || []).length;
        return '<button type="button" class="isl-btn ' + (c === state.activeClass ? 'cyan' : '') + '" ' +
          'id="tch-tab-' + c + '" onclick="IslandTeacher.selectClass(\'' + c + '\')">' + c + ' (' + count + ')</button>';
      }).join('');
    }

    var capInp = document.getElementById('tch-cap-input');
    var starCapInp = document.getElementById('tch-star-cap-input');
    if (capInp) capInp.value = Math.max(10, Math.min(60, Number(state.syncDoc.cap) || 30));
    if (starCapInp) starCapInp.value = Math.max(10, Math.min(60, Number(state.syncDoc.starCap) || 45));

    var heading = document.getElementById('tch-class-heading');
    if (heading) heading.textContent = 'Class ' + state.activeClass + ' Roster (Sorted by Name)';

    var list = (state.studentsByClass[state.activeClass] || []).slice().sort(function (a, b) {
      return String(a.name || '').localeCompare(String(b.name || ''));
    });

    var revCodes = studentCodeMap();
    if (!grid) return;

    if (!list.length) {
      grid.innerHTML = '<div style="padding:20px;color:#94a3b8">No pupils found in Class ' + esc(state.activeClass) + '.</div>';
      if (weekBody) weekBody.innerHTML = '';
      return;
    }

    grid.innerHTML = list.map(function (stu) {
      var code = revCodes[stu.id] || '';
      var isStar = !!(state.syncDoc.star && state.syncDoc.star[stu.id]);
      var pDoc = state.islandDocs[stu.id] || {};
      var streak = Number(pDoc.streak) || 0;
      var lastDay = pDoc.lastDay || '—';
      var weekXP = calcWeeklyXP(pDoc);

      return (
        '<div class="tch-pupil-card" data-student-id="' + esc(stu.id) + '">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px">' +
            '<div style="font-size:1.12rem;font-weight:800;color:#fff">' + esc(stu.name) + '</div>' +
            '<label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-weight:600;color:#cbd5e1;font-size:0.9rem">' +
              '<input type="checkbox" class="tch-star-check" data-student-id="' + esc(stu.id) + '" ' + (isStar ? 'checked ' : '') +
                'onchange="IslandTeacher.toggleStarPath(\'' + esc(stu.id) + '\',this.checked)" style="width:18px;height:18px">' +
              '⭐ Star Path' +
            '</label>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
            '<span class="tch-code-badge" data-code-for="' + esc(stu.id) + '">' + (code ? esc(code) : '— NO CODE —') + '</span>' +
            (code
              ? '<button type="button" class="isl-btn tch-btn-copy-one" data-copy-for="' + esc(stu.id) + '" style="min-height:38px;padding:6px 12px;font-size:0.84rem" onclick="IslandTeacher.copyPupilLink(\'' + esc(stu.id) + '\')">📋 Copy link</button>'
              : '') +
            '<button type="button" class="isl-btn tch-btn-new-code" data-newcode-for="' + esc(stu.id) + '" style="min-height:38px;padding:6px 12px;font-size:0.84rem" onclick="IslandTeacher.makeNewCodeForPupil(\'' + esc(stu.id) + '\')">🔄 New code</button>' +
          '</div>' +
          '<div class="tch-stat-strip">' +
            '<span class="tch-stat-pill">🔥 ' + streak + 'd streak</span>' +
            '<span class="tch-stat-pill">🗓️ Last: ' + esc(lastDay) + '</span>' +
            '<span class="tch-stat-pill">⚡ ' + weekXP + ' XP this week</span>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    renderWeekTable(list);
    renderPrintSheet(list, revCodes);
  }

  /* Render "This week" table: per pupil, island XP per day, streak and last day played, sorted by name */
  function renderWeekTable(list) {
    var weekHead = document.getElementById('tch-week-head');
    var weekBody = document.getElementById('tch-week-body');
    if (!weekHead || !weekBody) return;
    var days = getWeekDays();

    weekHead.innerHTML =
      '<tr>' +
        '<th>Pupil (A–Z)</th>' +
        days.map(function (d) { return '<th>' + esc(d.label) + '</th>'; }).join('') +
        '<th>Streak</th>' +
        '<th>Last day played</th>' +
      '</tr>';

    weekBody.innerHTML = list.map(function (stu) {
      var pDoc = state.islandDocs[stu.id] || {};
      var pDays = pDoc.days || {};
      var streak = Number(pDoc.streak) || 0;
      var lastDay = pDoc.lastDay || '—';

      return (
        '<tr data-week-student="' + esc(stu.id) + '">' +
          '<td>' + esc(stu.name) + '</td>' +
          days.map(function (d) {
            var xp = Number(pDays[d.key] && pDays[d.key].xp) || 0;
            return '<td data-day="' + esc(d.key) + '">' + xp + ' XP</td>';
          }).join('') +
          '<td data-streak="' + streak + '">' + streak + 'd</td>' +
          '<td data-lastday="' + esc(lastDay) + '">' + esc(lastDay) + '</td>' +
        '</tr>'
      );
    }).join('');
  }

  /* Printable 8-per-A4 cards (plain text links, no QR codes from the internet, no Star Path info) */
  function renderPrintSheet(list, revCodes) {
    var printArea = document.getElementById('tch-print-area');
    if (!printArea) return;
    printArea.innerHTML = list.map(function (stu) {
      var code = revCodes[stu.id] || '------';
      var url = LIVE_BASE_URL + '?p=' + code;
      return (
        '<div class="print-card">' +
          '<div style="font-size:1.1rem;font-weight:800;margin-bottom:4px">🏝️ Practice Island · Class ' + esc(state.activeClass) + '</div>' +
          '<div style="font-size:1.25rem;font-weight:800;margin-bottom:6px">' + esc(stu.name) + '</div>' +
          '<div style="font-size:1rem;margin-bottom:6px">Code: <b style="font-family:monospace;font-size:1.2rem;letter-spacing:2px">' + esc(code) + '</b></div>' +
          '<div style="font-size:0.82rem;word-break:break-all;color:#334155">' + esc(url) + '</div>' +
        '</div>'
      );
    }).join('');
  }

  function selectClass(cls) {
    state.activeClass = cls;
    renderAll();
  }

  /* Make codes ONLY for pupils without one; never change existing codes */
  function makeCodesForClass() {
    if (!state.syncDoc.codes) state.syncDoc.codes = {};
    var used = {};
    Object.keys(state.syncDoc.codes).forEach(function (c) { used[c] = true; });
    var rev = studentCodeMap();
    var created = 0;

    var list = state.studentsByClass[state.activeClass] || [];
    list.forEach(function (stu) {
      if (!rev[stu.id]) {
        var newCode = generateOneCode(used);
        state.syncDoc.codes[newCode] = stu.id;
        rev[stu.id] = newCode;
        created++;
      }
    });

    renderAll();
    saveSyncDoc();
    toast('🔑 Generated ' + created + ' new code(s) for Class ' + state.activeClass + '. Existing codes kept unchanged.');
    return created;
  }

  /* Explicitly replace code for ONE pupil when teacher presses "New code" */
  function makeNewCodeForPupil(studentId) {
    if (!studentId) return '';
    if (!state.syncDoc.codes) state.syncDoc.codes = {};
    var used = {};
    Object.keys(state.syncDoc.codes).forEach(function (c) {
      used[c] = true;
      if (state.syncDoc.codes[c] === studentId) {
        delete state.syncDoc.codes[c];
      }
    });
    var freshCode = generateOneCode(used);
    state.syncDoc.codes[freshCode] = studentId;
    renderAll();
    saveSyncDoc();
    toast('🔄 Created new code ' + freshCode + ' for pupil.');
    return freshCode;
  }

  function toggleStarPath(studentId, enabled) {
    if (!state.syncDoc.star) state.syncDoc.star = {};
    if (enabled) {
      state.syncDoc.star[studentId] = true;
    } else {
      delete state.syncDoc.star[studentId];
    }
    renderAll();
    saveSyncDoc();
  }

  function updateCaps() {
    var capInp = document.getElementById('tch-cap-input');
    var starCapInp = document.getElementById('tch-star-cap-input');
    var cVal = Number(capInp && capInp.value);
    var sVal = Number(starCapInp && starCapInp.value);
    state.syncDoc.cap = Math.max(10, Math.min(60, isNaN(cVal) ? 30 : cVal));
    state.syncDoc.starCap = Math.max(10, Math.min(60, isNaN(sVal) ? 45 : sVal));
    if (capInp) capInp.value = state.syncDoc.cap;
    if (starCapInp) starCapInp.value = state.syncDoc.starCap;
    saveSyncDoc();
  }

  async function saveSyncDoc() {
    state.syncDoc.updatedAt = new Date().toISOString();
    if (state.isDemo) {
      try { localStorage.setItem(DEMO_SYNC_KEY, JSON.stringify(state.syncDoc)); } catch (e) {}
      toast('✓ Saved settings in Demo Mode.');
      return { ok: true, isDemo: true };
    }

    var sb = client();
    if (!sb) {
      toast('Saved locally (offline).');
      return { ok: false };
    }
    try {
      /* The teacher page changes only codes, Star Path and limits. The record of XP already added (applied, lookApplied)
         always comes from the newest cloud copy, and the save only goes through if nobody saved in between (else try again). */
      for (var attempt = 0; attempt < 3; attempt++) {
        var cur = await sb.from('classes').select('description,updated_at').eq('id', 'class-island-sync').maybeSingle();
        if (cur && cur.error) break;
        var cloudDoc = parseJsonSafe(cur && cur.data && cur.data.description, null) || {};
        var nowIso = new Date().toISOString();
        var doc = {
          codes: Object.assign({}, cloudDoc.codes || {}, state.syncDoc.codes || {}),
          star: Object.assign({}, state.syncDoc.star || {}),
          cap: state.syncDoc.cap, starCap: state.syncDoc.starCap,
          applied: cloudDoc.applied || {}, lookApplied: cloudDoc.lookApplied || {},
          updatedAt: nowIso
        };
        var row = { description: JSON.stringify(doc), updated_at: nowIso };
        var res = cur && cur.data
          ? await sb.from('classes').update(row).eq('id', 'class-island-sync').eq('updated_at', cur.data.updated_at).select('id')
          : await sb.from('classes').insert(Object.assign({ id: 'class-island-sync', name: 'Island Sync', grade: 'System', teacher: 'System', archived: true }, row)).select('id');
        if (res && !res.error && Array.isArray(res.data) && res.data.length) {
          state.syncDoc = doc;
          toast('✓ Saved Practice Island settings to cloud.');
          return { ok: true };
        }
      }
      toast('Could not save to cloud. Please try again.');
      return { ok: false };
    } catch (e) {
      toast('Could not save to cloud.');
      return { ok: false };
    }
  }

  function copyPupilLink(studentId) {
    var rev = studentCodeMap();
    var code = rev[studentId];
    if (!code) return '';
    var url = LIVE_BASE_URL + '?p=' + code;
    state.lastCopiedText = url;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).catch(function () {});
    }
    toast('📋 Copied link: ' + url);
    return url;
  }

  function copyClassListForK12() {
    var list = (state.studentsByClass[state.activeClass] || []).slice().sort(function (a, b) {
      return String(a.name || '').localeCompare(String(b.name || ''));
    });
    var rev = studentCodeMap();
    var lines = list.map(function (stu) {
      var code = rev[stu.id] || 'NOCODE';
      return stu.name + ': ' + LIVE_BASE_URL + '?p=' + code;
    });
    var text = lines.join('\n');
    state.lastCopiedText = text;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function () {});
    }
    toast('📋 Copied ' + lines.length + ' pupil links for Class ' + state.activeClass + '!');
    return text;
  }

  function printClassCards() {
    var list = (state.studentsByClass[state.activeClass] || []).slice().sort(function (a, b) {
      return String(a.name || '').localeCompare(String(b.name || ''));
    });
    renderPrintSheet(list, studentCodeMap());
    root.print();
  }

  function ensureLoadedAndRender() {
    if (isLocked()) {
      renderAll();
      return Promise.resolve();
    }
    if (state.loaded) {
      renderAll();
      return Promise.resolve();
    }
    if (state.loadingPromise) return state.loadingPromise;

    if (state.isDemo) {
      loadDemoRoster();
      state.loaded = true;
      renderAll();
      return Promise.resolve();
    }

    state.loadingPromise = loadLiveRoster().then(function () {
      state.loaded = true;
      state.loadingPromise = null;
      renderAll();
    });
    return state.loadingPromise;
  }

  function watchLockState() {
    if (typeof MutationObserver === 'function') {
      var obs = new MutationObserver(function () {
        if (!document.getElementById('platform-lock-screen') && document.documentElement.classList.contains('platform-locked')) {
          document.documentElement.classList.remove('platform-locked');
        }
        if (!isLocked()) {
          ensureLoadedAndRender();
        }
      });
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      if (document.body) {
        obs.observe(document.body, { childList: true });
      }
    }
  }

  function init() {
    var params = new URLSearchParams(root.location.search);
    state.isDemo = params.get('demo') === '1';
    watchLockState();
    ensureLoadedAndRender();
  }

  root.IslandTeacher = {
    init: init,
    state: function () { return state; },
    ensureLoadedAndRender: ensureLoadedAndRender,
    selectClass: selectClass,
    makeCodesForClass: makeCodesForClass,
    makeNewCodeForPupil: makeNewCodeForPupil,
    toggleStarPath: toggleStarPath,
    updateCaps: updateCaps,
    saveSyncDoc: saveSyncDoc,
    copyPupilLink: copyPupilLink,
    copyClassListForK12: copyClassListForK12,
    printClassCards: printClassCards
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(typeof window !== 'undefined' ? window : this);
