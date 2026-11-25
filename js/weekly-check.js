/* js/weekly-check.js — 5-minute Weekly Check (teacher request, 25 Nov 2026)
 * Same format every week: the class does 5 quick questions (on paper, mini whiteboards or out loud),
 * the teacher taps each pupil's score 0–5. Saved per class + week + skill, on this device and in one
 * hidden cloud row (classes table, id 'class-weekly-checks-sync', same pattern as the shop sync).
 * A small chart shows the class average week by week so the teacher can see what works.
 * Uses pupil ids only; names come from the store on screen.
 */
(function (root) {
  'use strict';

  var LS_KEY = 'eaa_weekly_checks_v1';
  var CLOUD_ID = 'class-weekly-checks-sync';
  var SKILLS = [
    { k: 'words', e: '🔤', t: 'New words' }, { k: 'speaking', e: '🗣️', t: 'Speaking' },
    { k: 'listening', e: '👂', t: 'Listening' }, { k: 'reading', e: '📖', t: 'Reading' },
    { k: 'writing', e: '✏️', t: 'Writing' }, { k: 'grammar', e: '🧩', t: 'Grammar' }
  ];

  function S() { return root.schoolStore || {}; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ISO week like 2026-W48 */
  function weekKey(d) {
    d = d ? new Date(d) : new Date();
    var t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    var day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day);
    var y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    var wk = Math.ceil(((t - y0) / 86400000 + 1) / 7);
    return t.getUTCFullYear() + '-W' + (wk < 10 ? '0' : '') + wk;
  }

  /* ---------- data ---------- */
  function load() {
    try { var d = JSON.parse(localStorage.getItem(LS_KEY) || '{}'); if (d && d.checks) return d; } catch (e) { /* ignore */ }
    return { v: 1, checks: {} };
  }
  function save(d) { try { localStorage.setItem(LS_KEY, JSON.stringify(d)); } catch (e) { /* ignore */ } }
  function checkId(classId, week, skill) { return classId + '|' + week + '|' + skill; }
  function merge(into, other) {
    var changed = false;
    Object.keys((other && other.checks) || {}).forEach(function (id) {
      var r = other.checks[id], l = into.checks[id];
      if (r && (!l || (r.updatedAt || 0) > (l.updatedAt || 0))) { into.checks[id] = r; changed = true; }
    });
    return changed;
  }

  /* ---------- cloud (teacher device only; never blocks the screen) ---------- */
  function client() {
    var A = root.AdventureSupabase;
    if (!A || !A.isConfigured) return null;
    try {
      if (A._canWriteTeacherCloud && !A._canWriteTeacherCloud()) return null;
      return A.client || (A._ensureClient && A._ensureClient()) || null;
    } catch (e) { return null; }
  }
  function parseRow(row) { try { return row && row.description ? JSON.parse(row.description) : null; } catch (e) { return null; } }
  var cloudMsg = '';
  function pull() {
    var c = client(); if (!c) return Promise.resolve(false);
    return c.from('classes').select('description').eq('id', CLOUD_ID).maybeSingle().then(function (res) {
      var d = load(); var ch = merge(d, parseRow(res && res.data)); if (ch) save(d); return ch;
    }).catch(function () { return false; });
  }
  function push() {
    var c = client(); if (!c) { cloudMsg = '💾 Saved on this device'; return Promise.resolve(false); }
    cloudMsg = '☁️ Saving…';
    return c.from('classes').select('description').eq('id', CLOUD_ID).maybeSingle().then(function (res) {
      var remote = parseRow(res && res.data) || { v: 1, checks: {} };
      if (!remote.checks) remote.checks = {};
      merge(remote, load());
      return c.from('classes').upsert({ id: CLOUD_ID, name: 'Weekly Checks Sync', grade: 'System', teacher: 'System', description: JSON.stringify(remote), archived: true, updated_at: new Date().toISOString() }, { onConflict: 'id' });
    }).then(function (up) {
      if (up && up.error) throw up.error;
      cloudMsg = '☁️ Saved to the cloud'; return true;
    }).catch(function () { cloudMsg = '⚠️ Cloud save failed, kept on this device'; return false; });
  }

  /* ---------- pupils of a class ---------- */
  function pupils(cls) {
    var st = S(), list = [];
    try { list = (st.getStudentsByClass ? st.getStudentsByClass(cls.id) : (st.state && st.state.students || []).filter(function (s) { return s.classId === cls.id; })) || []; } catch (e) { list = []; }
    return list.filter(function (s) { return s && !s.archived; }).map(function (s) {
      return { id: s.id, name: s.firstName || s.name || s.id };
    }).sort(function (a, b) { return String(a.name).localeCompare(String(b.name), 'tr'); });
  }

  /* ---------- UI ---------- */
  var CSS = '.wc-ov{position:fixed;inset:0;z-index:100000;background:rgba(120,196,255,.55);display:flex;align-items:center;justify-content:center;padding:14px;font-family:Nunito,"Trebuchet MS",system-ui,sans-serif;color:#2b1d40}' +
    '.wc-box{background:#fff8ec;border:6px solid #ffb320;border-radius:28px;width:min(1180px,100%);max-height:96vh;display:flex;flex-direction:column;overflow:hidden}' +
    '.wc-hd{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:12px 16px;background:#fff;border-bottom:3px solid #f1dfb8}' +
    '.wc-hd h2{margin:0 8px 0 0;font-size:1.6rem;font-weight:900}' +
    '.wc-b{font:inherit;font-weight:800;font-size:.95rem;min-height:42px;padding:0 13px;border-radius:999px;border:2px solid #f1dfb8;border-bottom:4px solid #e3c98f;background:#fff;color:#2b1d40;cursor:pointer;transition:transform .15s cubic-bezier(.175,.885,.32,1.275)}' +
    '.wc-b:active{transform:translateY(3px)}.wc-b.on{background:#2fc58a;border-color:#1d8f62;color:#fff}' +
    '.wc-b.go{background:#4f9dff;border-color:#2f6fc2;color:#fff;min-height:50px;font-size:1.1rem}.wc-b.x{margin-left:auto}' +
    '.wc-body{overflow:auto;padding:12px 16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:8px}' +
    '.wc-p{background:#fff;border:3px solid #e8eef8;border-radius:18px;padding:6px 8px;display:flex;align-items:center;gap:6px}' +
    '.wc-p.done{border-color:#2fc58a}.wc-p b{flex:1;min-width:84px;font-weight:900;font-size:1rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.wc-n{font:inherit;font-weight:900;width:32px;height:36px;border-radius:10px;border:2px solid #e3e8f2;border-bottom:4px solid #cfd8e6;background:#fff;cursor:pointer;color:#2b1d40;font-size:1rem}' +
    '.wc-n.on{background:#ffb320;border-color:#c4860e;color:#2b1d40}.wc-n.away{width:auto;padding:0 6px;font-size:.8rem}.wc-n.away.on{background:#d9dde6;border-color:#a9b0be}' +
    '.wc-ft{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:10px 16px;background:#fff;border-top:3px solid #f1dfb8}' +
    '.wc-avg{font-weight:900;font-size:1.2rem}.wc-msg{font-weight:700;opacity:.75}' +
    '.wc-chart{display:flex;align-items:flex-end;gap:6px;height:70px;padding:0 6px}' +
    '.wc-bar{width:34px;background:#4f9dff;border-radius:8px 8px 0 0;position:relative;min-height:4px}' +
    '.wc-bar span{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);font-size:.75rem;font-weight:900}' +
    '.wc-bar i{position:absolute;top:100%;left:50%;transform:translateX(-50%);font-size:.66rem;font-style:normal;white-space:nowrap;opacity:.7}';
  function ensureCss() {
    if (document.getElementById('wc-css')) return;
    var el = document.createElement('style'); el.id = 'wc-css'; el.textContent = CSS; document.head.appendChild(el);
  }

  var ui = { cls: null, skill: 'words', week: weekKey(), draft: {} };

  function historyFor(classId, skill) {
    var d = load(), rows = [];
    Object.keys(d.checks).forEach(function (id) {
      var c = d.checks[id];
      if (c.classId !== classId || (skill && c.skill !== skill)) return;
      var vals = Object.keys(c.scores || {}).map(function (k) { return c.scores[k]; }).filter(function (v) { return typeof v === 'number'; });
      if (!vals.length) return;
      rows.push({ week: c.week, skill: c.skill, avg: vals.reduce(function (a, b) { return a + b; }, 0) / vals.length, n: vals.length });
    });
    return rows.sort(function (a, b) { return a.week < b.week ? -1 : 1; }).slice(-8);
  }

  function draw(ov) {
    var cls = ui.cls, list = pupils(cls), d = load();
    var saved = d.checks[checkId(cls.id, ui.week, ui.skill)];
    if (!ui.loadedFor || ui.loadedFor !== checkId(cls.id, ui.week, ui.skill)) {
      ui.draft = saved ? JSON.parse(JSON.stringify(saved.scores || {})) : {};
      ui.loadedFor = checkId(cls.id, ui.week, ui.skill);
    }
    var classes = (S().getClasses ? S().getClasses() : []).filter(function (c) { return !c.archived; });
    var vals = Object.keys(ui.draft).map(function (k) { return ui.draft[k]; }).filter(function (v) { return typeof v === 'number'; });
    var avg = vals.length ? (vals.reduce(function (a, b) { return a + b; }, 0) / vals.length) : null;
    var hist = historyFor(cls.id, ui.skill);
    ov.innerHTML = '<div class="wc-box">' +
      '<div class="wc-hd"><h2>📝 Weekly Check</h2>' +
        classes.map(function (c) { return '<button class="wc-b' + (c.id === cls.id ? ' on' : '') + '" data-cls="' + esc(c.id) + '">' + esc(c.name) + '</button>'; }).join('') +
        '<span style="font-weight:800;opacity:.7;margin-left:6px">Week ' + esc(ui.week.split('-W')[1]) + '</span>' +
        '<button class="wc-b x" data-close="1">✕ Close</button></div>' +
      '<div class="wc-hd" style="border-bottom-width:2px">' + '<span style="font-weight:900">This week we checked:</span>' +
        SKILLS.map(function (s) { return '<button class="wc-b' + (s.k === ui.skill ? ' on' : '') + '" data-skill="' + s.k + '">' + s.e + ' ' + s.t + '</button>'; }).join('') +
        '<span style="opacity:.7;font-weight:700">Score = right answers out of 5</span></div>' +
      '<div class="wc-body">' + (list.length ? list.map(function (p) {
        var v = ui.draft[p.id];
        return '<div class="wc-p' + (v !== undefined ? ' done' : '') + '"><b title="' + esc(p.name) + '">' + esc(p.name) + '</b>' +
          [0, 1, 2, 3, 4, 5].map(function (n) { return '<button class="wc-n' + (v === n ? ' on' : '') + '" data-p="' + esc(p.id) + '" data-v="' + n + '">' + n + '</button>'; }).join('') +
          '<button class="wc-n away' + (v === 'away' ? ' on' : '') + '" data-p="' + esc(p.id) + '" data-v="away" title="Not here">away</button></div>';
      }).join('') : '<p>No pupils in this class.</p>') + '</div>' +
      '<div class="wc-ft"><span class="wc-avg">Class average: ' + (avg === null ? '–' : avg.toFixed(1) + ' / 5') + ' · ' + vals.length + ' of ' + list.length + ' done</span>' +
        '<div class="wc-chart" title="Class average, last weeks (' + esc(ui.skill) + ')">' + hist.map(function (h) {
          return '<div class="wc-bar" style="height:' + Math.max(4, Math.round(h.avg / 5 * 60)) + 'px"><span>' + h.avg.toFixed(1) + '</span><i>W' + esc(h.week.split('-W')[1]) + '</i></div>';
        }).join('') + '</div>' +
        '<span class="wc-msg" id="wc-msg">' + esc(cloudMsg) + '</span>' +
        '<button class="wc-b go" data-save="1" style="margin-left:auto">💾 Save this week</button></div></div>';
  }

  function open(classId) {
    ensureCss();
    var st = S();
    var cls = (classId && st.getClass && st.getClass(classId)) || (st.getActiveClass && st.getActiveClass());
    if (!cls) return;
    ui.cls = cls; ui.week = weekKey(); ui.loadedFor = '';
    var old = document.getElementById('wc-ov'); if (old) old.remove();
    var ov = document.createElement('div'); ov.className = 'wc-ov'; ov.id = 'wc-ov';
    document.body.appendChild(ov);
    draw(ov);
    pull().then(function (ch) { if (ch && document.getElementById('wc-ov')) { ui.loadedFor = ''; draw(ov); } });
    ov.addEventListener('click', function (e) {
      if (e.target === ov) { ov.remove(); return; }
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.close) { ov.remove(); return; }
      if (b.dataset.cls) { ui.cls = (st.getClass && st.getClass(b.dataset.cls)) || ui.cls; ui.loadedFor = ''; draw(ov); return; }
      if (b.dataset.skill) { ui.skill = b.dataset.skill; ui.loadedFor = ''; draw(ov); return; }
      if (b.dataset.p) {
        var v = b.dataset.v === 'away' ? 'away' : Number(b.dataset.v);
        if (ui.draft[b.dataset.p] === v) delete ui.draft[b.dataset.p]; else ui.draft[b.dataset.p] = v;
        draw(ov); return;
      }
      if (b.dataset.save) {
        var d = load(), id = checkId(ui.cls.id, ui.week, ui.skill);
        d.checks[id] = { id: id, classId: ui.cls.id, week: ui.week, skill: ui.skill, date: new Date().toISOString().slice(0, 10), scores: JSON.parse(JSON.stringify(ui.draft)), updatedAt: Date.now() };
        save(d);
        cloudMsg = '💾 Saved on this device';
        draw(ov);
        try { root.classSoundboard && root.classSoundboard.playCoinReward && root.classSoundboard.playCoinReward(); } catch (x) { /* optional */ }
        push().then(function () { var m = document.getElementById('wc-msg'); if (m) m.textContent = cloudMsg; });
      }
    });
  }

  root.WeeklyCheck = { open: open, weekKey: weekKey, history: historyFor, _load: load };
})(window);
