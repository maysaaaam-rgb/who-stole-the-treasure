/* Command Center: a dense, calm teacher overview (class stats, student table with 7-day trend, activity feed, Ctrl+K jump bar).
   Reads live data from the school store. Adds the view "command". */
(function (root) {
  'use strict';
  var store = root.schoolStore || root.store;
  var DAY = 86400000;

  var sortKey = 'xp', sortDir = -1, filterKey = 'all', query = '';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function S() { return root.schoolStore || root.store || store; }

  // ------------------------------------------------------------- data
  function dayStart(t) { var d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); }
  function txOf(studentId) {
    var st = S(), out = [];
    (st.state.xpTransactions || []).forEach(function (t) { if (t.studentId === studentId && t.status !== 'voided' && t.status !== 'reverted') out.push(t); });
    if (!out.length) {
      var s = st.getStudent && st.getStudent(studentId);
      ((s && (s.xpHistory || s.xp_history)) || []).forEach(function (t) { out.push(t); });
    }
    return out;
  }
  function analyse(student) {
    var now = Date.now(), today = dayStart(now), days = [0, 0, 0, 0, 0, 0, 0], prev = 0, last = 0, lastTs = 0;
    txOf(student.id).forEach(function (t) {
      var amt = Number(t.amount != null ? t.amount : (t.points != null ? t.points : t.xp)) || 0;
      var ts = new Date(t.timestamp || t.date || 0).getTime();
      if (!ts || isNaN(ts) || amt <= 0) return;
      if (ts > lastTs) lastTs = ts;
      var ago = Math.floor((today - dayStart(ts)) / DAY);       // 0 = today
      if (ago >= 0 && ago < 7) { days[6 - ago] += amt; last += amt; }
      else if (ago >= 7 && ago < 14) prev += amt;
    });
    var since = lastTs ? Math.floor((today - dayStart(lastTs)) / DAY) : 999;
    var status = 'ok';
    if (since >= 7) status = 'help';
    else if (prev > 0 && last < prev * 0.5) status = 'slow';
    return { days: days, last: last, prev: prev, since: since, status: status };
  }
  function rowsFor(cls) {
    var st = S();
    return st.getStudentsByClass(cls.id).map(function (s) {
      var m = st.calculateMonsterState ? st.calculateMonsterState(s.id) : {};
      var prof = st.getMonsterProfile ? st.getMonsterProfile(s.id) : null;
      var a = analyse(s);
      var img = ''; try { img = root.getStudentMonsterAvatarUrl ? root.getStudentMonsterAvatarUrl(s, prof, m) : ''; } catch (e) { img = ''; }
      return {
        id: s.id, name: ((s.firstName || '') + ' ' + (s.lastName || '')).trim() || s.name || 'Student',
        xp: Number(m.totalXP != null ? m.totalXP : (s.xp || 0)) || 0, level: m.currentLevel || s.level || 1,
        pct: m.progressPct || 0, img: img, a: a, att: st.getStudentAttendanceRate ? st.getStudentAttendanceRate(s.id) : null
      };
    });
  }

  // ------------------------------------------------------------- pieces
  var STATUS = { ok: ['On track', 'cc-t1'], slow: ['Slowing', 'cc-t2'], help: ['Needs a nudge', 'cc-t3'] };
  var STATUS_ORDER = { help: 0, slow: 1, ok: 2 };
  function spark(days, status) {
    var max = Math.max.apply(null, days.concat([1])), w = 72, h = 22;
    var pts = days.map(function (v, i) { return (i * (w / 6)).toFixed(1) + ',' + (h - 2 - (v / max) * (h - 5)).toFixed(1); }).join(' ');
    var col = status === 'ok' ? '#34d399' : status === 'slow' ? '#fbbf24' : '#f87171';
    return '<svg width="72" height="22" viewBox="0 0 72 22" aria-hidden="true"><polyline fill="none" stroke="' + col + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" points="' + pts + '"/></svg>';
  }
  function ago(ts) {
    var d = Math.floor((dayStart(Date.now()) - dayStart(ts)) / DAY);
    return d <= 0 ? 'today' : d === 1 ? 'yesterday' : d + ' days ago';
  }
  function feedFor(cls) {
    var st = S(), names = {};
    st.getStudentsByClass(cls.id).forEach(function (s) { names[s.id] = s.firstName || s.name || 'Student'; });
    return (st.state.xpTransactions || []).filter(function (t) { return names[t.studentId] && Number(t.amount) > 0; })
      .sort(function (a, b) { return new Date(b.timestamp) - new Date(a.timestamp); }).slice(0, 8)
      .map(function (t) {
        var why = String(t.reason || 'XP award').replace(/\s*\(\+\d+ XP\)\s*$/, '');
        if (why.length > 52) why = why.slice(0, 50) + '…';
        return '<div class="cc-feed-i"><i>' + esc(t.icon || '⭐') + '</i><span><b>' + esc(names[t.studentId]) + '</b> +' + (Number(t.amount) || 0) + ' XP · ' + esc(why) + '<small>' + ago(new Date(t.timestamp).getTime()) + '</small></span></div>';
      }).join('') || '<div class="cc-empty">No XP awarded yet.</div>';
  }

  function xpBanner(cls) {
    try {
      if (localStorage.getItem('eaa_xp_recon_hidden')) return '';
      var plan = reconPlan(cls);
      if (plan.off.length < 3) return '';
      return '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:#2e2410;border:1px solid #6b4e12;color:#fde68a;border-radius:12px;padding:12px 16px;margin-bottom:14px"><span>⚠️ <b>' + plan.off.length + ' students</b> have XP totals that do not match their award history.</span><button class="cc-plus" style="margin-left:auto;padding:7px 14px" onclick="CommandCenter.restoreXp()">Review &amp; restore</button></div>';
    } catch (e) { return ''; }
  }

  var CSS = '' +
    '.cc{--bg:#0a0b0f;--p:#0d0e13;--l:#1d2029;--t:#e6e8ee;--m:#8b93a7;color:var(--t);font-family:Inter,system-ui,sans-serif;font-size:13px;max-width:1240px;margin:0 auto;padding:6px 0 80px}' +
    '.cc *{box-sizing:border-box}.cc h1{font-size:22px;font-weight:700;letter-spacing:-.02em;margin:0}.cc .cc-sub{color:var(--m);margin:2px 0 0}' +
    '.cc-top{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:16px}' +
    '.cc-cmd{margin-left:auto;display:flex;align-items:center;gap:10px;background:#14161d;border:1px solid #262a36;color:var(--m);border-radius:10px;padding:8px 12px;min-width:250px;cursor:pointer;font:inherit}' +
    '.cc-cmd kbd,.cc-pal kbd{margin-left:auto;font:600 10px Inter,system-ui,sans-serif;border:1px solid #2c3140;border-radius:4px;padding:1px 6px;color:var(--m)}' +
    '.cc-kp{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border:1px solid var(--l);border-radius:12px;background:var(--p);margin-bottom:16px;overflow:hidden}' +
    '.cc-kp div{padding:14px 16px;border-right:1px solid var(--l)}.cc-kp div:last-child{border:0}.cc-kp small{color:var(--m);font-weight:600}' +
    '.cc-kp b{display:flex;align-items:baseline;gap:8px;font-size:26px;font-weight:700;margin-top:4px;letter-spacing:-.02em}.cc-kp em{font:600 11px Inter,system-ui,sans-serif;font-style:normal;color:var(--m)}' +
    '.cc-grid{display:grid;grid-template-columns:minmax(0,1.8fr) minmax(0,1fr);gap:16px}' +
    '.cc-pn{border:1px solid var(--l);border-radius:12px;background:var(--p);overflow:hidden;min-width:0}' +
    '.cc-pn>h3{font-size:12px;font-weight:700;color:#aab1c3;padding:12px 14px;border-bottom:1px solid var(--l);display:flex;align-items:center;gap:8px;margin:0;flex-wrap:wrap}' +
    '.cc-chips{display:flex;gap:4px;margin-left:auto}.cc-chips button{border:1px solid #262a36;background:transparent;color:var(--m);border-radius:99px;padding:3px 10px;font:600 11px Inter,system-ui,sans-serif;cursor:pointer}' +
    '.cc-chips button.on{background:#232850;border-color:#4b52c4;color:#fff}' +
    '.cc-find{background:#14161d;border:1px solid #262a36;border-radius:8px;color:var(--t);padding:5px 9px;font:500 12px Inter,system-ui,sans-serif;width:150px}' +
    '.cc-wrap{overflow-x:auto}.cc table{width:100%;border-collapse:collapse;min-width:560px}' +
    '.cc th{text-align:left;font-size:11px;color:#7c8498;font-weight:600;padding:8px 14px;border-bottom:1px solid var(--l);cursor:pointer;white-space:nowrap;user-select:none}' +
    '.cc th:hover{color:#fff}.cc td{padding:8px 14px;border-bottom:1px solid #14161d;vertical-align:middle}.cc tbody tr{cursor:pointer}.cc tbody tr:hover td{background:#12141b}' +
    '.cc-nm{display:flex;align-items:center;gap:10px;font-weight:600}.cc-nm img{width:32px;height:32px;object-fit:contain;background:#171a23;border-radius:8px;flex:none}' +
    '.cc-lv{color:var(--m)}.cc-bar{height:4px;background:#1d2029;border-radius:9px;margin-top:5px;width:90px;overflow:hidden}.cc-bar i{display:block;height:100%;background:#818cf8}' +
    '.cc-t{display:inline-block;padding:2px 9px;border-radius:99px;font-size:11px;font-weight:700;white-space:nowrap}' +
    '.cc-t1{background:#10291f;color:#34d399}.cc-t2{background:#2e2410;color:#fbbf24}.cc-t3{background:#2f1519;color:#f87171}' +
    '.cc-plus{border:1px solid #262a36;background:#14161d;color:#cbd2e1;border-radius:7px;padding:3px 8px;font:700 11px Inter,system-ui,sans-serif;cursor:pointer}.cc-plus:hover{background:#232850;border-color:#4b52c4}' +
    '.cc-feed{padding:4px 14px 10px}.cc-feed-i{display:flex;gap:10px;padding:9px 0;border-bottom:1px dashed var(--l);color:#aab1c3}.cc-feed-i:last-child{border:0}' +
    '.cc-feed-i i{font-style:normal;width:22px;text-align:center;flex:none}.cc-feed-i b{color:var(--t)}.cc-feed-i small{display:block;color:#6b7387;margin-top:1px}' +
    '.cc-empty{padding:26px;text-align:center;color:var(--m)}' +
    '.cc-links{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}.cc-links button{background:#14161d;border:1px solid #262a36;color:#cbd2e1;border-radius:10px;padding:8px 13px;font:600 12px Inter,system-ui,sans-serif;cursor:pointer}.cc-links button:hover{background:#1a1d27;color:#fff}' +
    '.cc-ovl{position:fixed;inset:0;background:rgba(5,6,10,.65);backdrop-filter:blur(4px);z-index:99999;display:flex;align-items:flex-start;justify-content:center;padding-top:14vh}' +
    '.cc-pal{width:min(560px,92vw);background:#0f1117;border:1px solid #2a2f3d;border-radius:14px;box-shadow:0 30px 80px rgba(0,0,0,.6);overflow:hidden;font-family:Inter,system-ui,sans-serif;color:#e6e8ee}' +
    '.cc-pal input{width:100%;background:transparent;border:0;border-bottom:1px solid #1d2029;padding:16px 18px;color:#fff;font:500 15px Inter,system-ui,sans-serif;outline:none}' +
    '.cc-pal ul{list-style:none;margin:0;padding:6px;max-height:340px;overflow:auto}.cc-pal li{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;cursor:pointer;color:#aab1c3;font-weight:500}' +
    '.cc-pal li.on{background:#1a1d2e;color:#fff}.cc-pal li small{margin-left:auto;color:#6b7387}' +
    '.cc td,.cc th,.cc table,.cc tbody tr{color:var(--t);background:transparent}.cc th{color:#7c8498}.cc button,.cc input{font-family:Inter,system-ui,sans-serif}.cc-lv{color:#8b93a7!important}' +
    '@media(max-width:1100px){.cc-grid{grid-template-columns:minmax(0,1fr)}}' +
    '@media(max-width:900px){.cc-grid{grid-template-columns:minmax(0,1fr)}.cc-kp{grid-template-columns:repeat(2,minmax(0,1fr))}.cc-kp div:nth-child(2){border-right:0}.cc-kp div:nth-child(-n+2){border-bottom:1px solid var(--l)}.cc-cmd{min-width:0;flex:1}}';
  function ensureCss() {
    if (document.getElementById('cc-css')) return;
    var el = document.createElement('style'); el.id = 'cc-css'; el.textContent = CSS; document.head.appendChild(el);
  }

  // ------------------------------------------------------------- view
  var current = [];
  function tableHtml() {
    var rows = current.slice();
    if (filterKey !== 'all') rows = rows.filter(function (r) { return r.a.status === filterKey; });
    if (query) { var q = query.toLowerCase(); rows = rows.filter(function (r) { return r.name.toLowerCase().indexOf(q) !== -1; }); }
    rows.sort(function (a, b) {
      var x, y;
      if (sortKey === 'name') { return sortDir * a.name.localeCompare(b.name); }
      if (sortKey === 'status') { x = STATUS_ORDER[a.a.status]; y = STATUS_ORDER[b.a.status]; }
      else if (sortKey === 'week') { x = a.a.last; y = b.a.last; }
      else if (sortKey === 'level') { x = a.level; y = b.level; }
      else { x = a.xp; y = b.xp; }
      return sortDir * (x - y) || a.name.localeCompare(b.name);
    });
    if (!rows.length) return '<div class="cc-empty">No students match.</div>';
    function th(k, label) { return '<th onclick="CommandCenter.sort(\'' + k + '\')">' + label + (sortKey === k ? (sortDir < 0 ? ' ↓' : ' ↑') : '') + '</th>'; }
    return '<div class="cc-wrap"><table><thead><tr>' + th('name', 'Student') + th('level', 'Level') + th('xp', 'XP') + th('week', 'This week') + '<th style="cursor:default">7-day trend</th>' + th('status', 'Status') + '<th style="cursor:default"></th></tr></thead><tbody>' +
      rows.map(function (r) {
        var s = STATUS[r.a.status];
        var note = r.a.status === 'help' ? (r.a.since >= 999 ? 'no XP yet' : r.a.since + ' days quiet') : '';
        return '<tr onclick="CommandCenter.open(\'' + esc(r.id) + '\')"><td><div class="cc-nm">' + (r.img ? '<img src="' + esc(r.img) + '" alt="" loading="lazy">' : '') + esc(r.name) + '</div></td>' +
          '<td><span class="cc-lv">Lvl ' + r.level + '</span><div class="cc-bar"><i style="width:' + Math.max(2, Math.min(100, r.pct)) + '%"></i></div></td>' +
          '<td>' + r.xp.toLocaleString() + '</td><td>' + (r.a.last ? '+' + r.a.last : '–') + '</td><td>' + spark(r.a.days, r.a.status) + '</td>' +
          '<td><span class="cc-t ' + s[1] + '" title="' + esc(note) + '">' + s[0] + '</span></td>' +
          '<td onclick="event.stopPropagation()"><button class="cc-plus" onclick="CommandCenter.award(\'' + esc(r.id) + '\',5)">+5</button> <button class="cc-plus" onclick="CommandCenter.award(\'' + esc(r.id) + '\',10)">+10</button></td></tr>';
      }).join('') + '</tbody></table></div>';
  }
  function refreshTable() { var el = document.getElementById('cc-table'); if (el) el.innerHTML = tableHtml(); var c = document.getElementById('cc-count'); if (c) c.textContent = current.length; }

  function render(container) {
    ensureCss();
    var st = S(), cls = st.getActiveClass(), now = new Date();
    current = rowsFor(cls);
    var att = st.getClassAttendanceRate ? st.getClassAttendanceRate(cls.id) : 0;
    var active = current.filter(function (r) { return r.a.last > 0; }).length;
    var avg = current.length ? Math.round(current.reduce(function (n, r) { return n + r.xp; }, 0) / current.length) : 0;
    var near = current.filter(function (r) { return r.pct >= 75 && r.level < 7; }).length;
    var weekXp = current.reduce(function (n, r) { return n + r.a.last; }, 0);
    var helpN = current.filter(function (r) { return r.a.status === 'help'; }).length;
    var slowN = current.filter(function (r) { return r.a.status === 'slow'; }).length;
    var hour = now.getHours(), greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    var who = (st.getSchoolSettings && st.getSchoolSettings().teacherName) || 'Mr. Maysam';
    container.innerHTML = '<div class="cc">' +
      '<div class="cc-top"><div><h1>' + greet + ', ' + esc(who) + '</h1><p class="cc-sub">' + esc(cls.name) + ' · <span id="cc-count">' + current.length + '</span> learners · ' + now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' }) + '</p></div>' +
        '<button class="cc-cmd" onclick="CommandCenter.palette()">🔍 Search or jump to…<kbd>Ctrl K</kbd></button></div>' +
      (xpBanner(cls)) +
      '<div class="cc-links"><button onclick="switchView(\'board\')">📺 Open Class Board</button><button onclick="window.open(\'unit1-revision/index.html\',\'_blank\')">🎯 Unit 1 Revision Game</button><button onclick="openFastAttendanceModal && openFastAttendanceModal()">📋 Take attendance</button><button onclick="switchView(\'homework\')">📝 Homework</button><button onclick="switchView(\'curriculum\')">📚 Lessons</button><button onclick="switchView(\'store\')">🛍️ Store</button></div>' +
      '<div class="cc-kp"><div><small>Attendance</small><b>' + att + '%</b></div><div><small>Active this week</small><b>' + active + '<em>of ' + current.length + '</em></b></div>' +
        '<div><small>XP earned this week</small><b>' + weekXp.toLocaleString() + '<em>avg ' + avg + ' total</em></b></div><div><small>Near evolving</small><b>' + near + '<em>students</em></b></div></div>' +
      '<div class="cc-grid"><div class="cc-pn"><h3>Students' + (helpN || slowN ? ' · <span style="color:#f87171">' + helpN + ' need a nudge</span>' + (slowN ? ', <span style="color:#fbbf24">' + slowN + ' slowing</span>' : '') : '') +
        '<input class="cc-find" placeholder="Filter…" value="' + esc(query) + '" oninput="CommandCenter.find(this.value)">' +
        '<span class="cc-chips"><button data-f="all" class="' + (filterKey === 'all' ? 'on' : '') + '" onclick="CommandCenter.filter(\'all\')">All</button><button class="' + (filterKey === 'help' ? 'on' : '') + '" onclick="CommandCenter.filter(\'help\')">Needs a nudge</button><button class="' + (filterKey === 'slow' ? 'on' : '') + '" onclick="CommandCenter.filter(\'slow\')">Slowing</button></span></h3>' +
        '<div id="cc-table">' + tableHtml() + '</div></div>' +
        '<div class="cc-pn"><h3>Recent activity</h3><div class="cc-feed">' + feedFor(cls) + '</div></div></div></div>';
  }

  // ------------------------------------------------------------- actions
  var api = {
    sort: function (k) { if (sortKey === k) sortDir = -sortDir; else { sortKey = k; sortDir = k === 'name' ? 1 : -1; } refreshTable(); },
    filter: function (f) { filterKey = f; if (root.renderCurrentView) root.renderCurrentView(); },
    find: function (v) { query = v || ''; refreshTable(); },
    open: function (id) { if (root.openStudentDetail) root.openStudentDetail(id); },
    award: function (id, n) {
      var st = S(); if (!st.giveXP) return;
      st.giveXP(id, n, 'Quick Classroom Award', 'Teacher', { category: 'positive', icon: '⭐' });
      try { root.classSoundboard && root.classSoundboard.playCoinReward && root.classSoundboard.playCoinReward(); } catch (e) { /* sound is optional */ }
      var cls = st.getActiveClass(); current = rowsFor(cls); refreshTable();
    },
    palette: function () { openPalette(); }
  };
  root.CommandCenter = api;

  // ------------------------------------------------------------- XP restore (history vs shown totals)
  // The shown XP can drift away from the award history (e.g. after a reset). This previews the fix and applies it on request.
  function activeTx(studentId) {
    return (S().state.xpTransactions || []).filter(function (t) { return t.studentId === studentId && t.status !== 'voided' && t.status !== 'reverted' && !t.isVoided; });
  }
  function reconPlan(cls) {
    var st = S(), seen = {}, dupes = [], rows = [];
    st.getStudentsByClass(cls.id).forEach(function (s) {
      var groups = {};
      activeTx(s.id).forEach(function (t) {
        var amt = Number(t.amount) || 0;
        if (amt > -500) return;
        var k = [amt, t.reason, String(t.timestamp || '').slice(0, 10)].join('|');
        (groups[k] = groups[k] || []).push(t);
      });
      Object.keys(groups).forEach(function (k) { if (groups[k].length >= 2) groups[k].forEach(function (t) { dupes.push(t); seen[t.id] = true; }); });
    });
    st.getStudentsByClass(cls.id).forEach(function (s) {
      var target = activeTx(s.id).reduce(function (n, t) { return seen[t.id] ? n : n + (Number(t.amount) || 0); }, 0);
      target = Math.max(0, Math.round(target));
      var shown = Number(s.xp) || 0;
      rows.push({ id: s.id, name: ((s.firstName || '') + ' ' + (s.lastName || '')).trim(), shown: shown, target: target, diff: target - shown });
    });
    return { rows: rows, dupes: dupes, off: rows.filter(function (r) { return r.diff !== 0; }) };
  }
  function reconModal() {
    var st = S(), cls = st.getActiveClass(), plan = reconPlan(cls);
    ensureCss();
    var old = document.getElementById('cc-recon'); if (old) old.remove();
    var ovl = document.createElement('div'); ovl.id = 'cc-recon'; ovl.className = 'cc-ovl'; ovl.style.alignItems = 'center';
    var names = {}; st.getStudentsByClass(cls.id).forEach(function (s) { names[s.id] = s.firstName; });
    ovl.innerHTML = '<div class="cc-pal" style="width:min(640px,94vw);padding:20px;max-height:86vh;overflow:auto">' +
      '<h2 style="font-size:18px;margin:0 0 6px">Restore XP from the award history · ' + esc(cls.name) + '</h2>' +
      '<p style="color:#8b93a7;margin:0 0 12px">The totals students see do not match the history of awards you gave. This sets each student\'s XP to what the history adds up to. A backup of today\'s numbers is saved first.</p>' +
      (plan.dupes.length ? '<p style="background:#2e2410;color:#fbbf24;border-radius:8px;padding:8px 10px;margin:0 0 12px">' + plan.dupes.length + ' duplicate large corrections will be removed (' + plan.dupes.map(function (t) { return esc(names[t.studentId] || '') + ' ' + t.amount; }).join(', ') + ').</p>' : '') +
      '<table style="width:100%;border-collapse:collapse;font-size:13px"><tr style="color:#7c8498;text-align:left"><th style="padding:5px 8px">Student</th><th>Shown now</th><th>Will become</th><th>Change</th></tr>' +
      plan.rows.map(function (r) { return '<tr style="border-top:1px solid #1d2029"><td style="padding:6px 8px">' + esc(r.name) + '</td><td>' + r.shown + '</td><td><b>' + r.target + '</b></td><td style="color:' + (r.diff > 0 ? '#34d399' : r.diff < 0 ? '#f87171' : '#8b93a7') + '">' + (r.diff > 0 ? '+' : '') + r.diff + '</td></tr>'; }).join('') + '</table>' +
      '<div style="display:flex;gap:10px;margin-top:16px;justify-content:flex-end"><button class="cc-plus" id="cc-r-no" style="padding:9px 16px">Not now</button><button class="cc-plus" id="cc-r-hide" style="padding:9px 16px">Don\'t ask again</button><button id="cc-r-go" style="background:#4f46e5;color:#fff;border:0;border-radius:8px;padding:9px 18px;font:700 13px Inter,system-ui,sans-serif;cursor:pointer">Restore these totals</button></div></div>';
    document.body.appendChild(ovl);
    ovl.querySelector('#cc-r-no').onclick = function () { ovl.remove(); };
    ovl.querySelector('#cc-r-hide').onclick = function () { try { localStorage.setItem('eaa_xp_recon_hidden', '1'); } catch (e) { /* ignore */ } ovl.remove(); if (root.renderCurrentView) root.renderCurrentView(); };
    ovl.querySelector('#cc-r-go').onclick = function () { applyRecon(plan); ovl.remove(); };
    ovl.addEventListener('mousedown', function (e) { if (e.target === ovl) ovl.remove(); });
  }
  function applyRecon(plan) {
    var st = S(), backup = {};
    plan.rows.forEach(function (r) { backup[r.id] = r.shown; });
    try { localStorage.setItem('eaa_xp_backup_' + Date.now(), JSON.stringify(backup)); } catch (e) { /* ignore */ }
    plan.dupes.forEach(function (t) { st.voidXPTransaction(t.id, 'Duplicate correction removed during XP restore'); });
    plan.rows.forEach(function (r) {
      var stu = st.getStudent(r.id); if (!stu) return;
      st.updateStudent(r.id, { xp: r.target, totalXP: r.target, xpUpdatedAt: new Date().toISOString() });
      if (st.evaluateMonsterStage) st.evaluateMonsterStage(stu);
      if (st.updateStudent) st.updateStudent(r.id, { level: stu.level, stageName: stu.stageName, levelName: stu.levelName });
    });
    st.saveState(); if (st.notify) st.notify();
    if (root.renderCurrentView) root.renderCurrentView();
  }
  api.restoreXp = reconModal;

  // ------------------------------------------------------------- Ctrl+K palette
  var VIEWS = [['dashboard', '🏠 Dashboard'], ['command', '🧭 Command Center'], ['board', '📺 Class Board'], ['students', '🧒 Students'], ['attendance', '📋 Attendance'], ['curriculum', '📚 Curriculum'], ['library', '📖 Library'], ['homework', '📝 Homework'], ['assignments', '🗂️ Assignments'], ['progress', '📈 Progress'], ['leaderboard', '🏆 Leaderboard'], ['store', '🛍️ Classroom Store'], ['monster', '🐾 Monsters'], ['settings', '⚙️ Settings']];
  function openPalette() {
    if (document.getElementById('cc-palette')) return;
    ensureCss();
    var st = S(), items = VIEWS.map(function (v) { return { label: v[1], hint: 'Go to page', run: function () { root.switchView(v[0]); } }; });
    st.getStudentsByClass(st.getActiveClass().id).forEach(function (s) {
      var nm = ((s.firstName || '') + ' ' + (s.lastName || '')).trim();
      items.push({ label: '🧒 ' + nm, hint: 'Open profile', key: nm.toLowerCase(), run: function () { root.openStudentDetail(s.id); } });
    });
    var ovl = document.createElement('div'); ovl.id = 'cc-palette'; ovl.className = 'cc-ovl';
    ovl.innerHTML = '<div class="cc-pal"><input placeholder="Jump to a page or a student…" autocomplete="off"><ul></ul></div>';
    document.body.appendChild(ovl);
    var input = ovl.querySelector('input'), ul = ovl.querySelector('ul'), sel = 0, shown = [];
    function paint() {
      var q = input.value.trim().toLowerCase();
      shown = items.filter(function (i) { return !q || (i.key || i.label.toLowerCase()).indexOf(q) !== -1 || i.label.toLowerCase().indexOf(q) !== -1; }).slice(0, 12);
      if (sel >= shown.length) sel = Math.max(0, shown.length - 1);
      ul.innerHTML = shown.map(function (i, n) { return '<li class="' + (n === sel ? 'on' : '') + '" data-n="' + n + '">' + esc(i.label) + '<small>' + i.hint + '</small></li>'; }).join('') || '<li>No results</li>';
    }
    function close() { ovl.remove(); }
    function go(n) { var it = shown[n]; if (!it) return; close(); it.run(); }
    input.addEventListener('input', function () { sel = 0; paint(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowDown') { sel = Math.min(shown.length - 1, sel + 1); paint(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); paint(); e.preventDefault(); }
      else if (e.key === 'Enter') go(sel);
    });
    ul.addEventListener('click', function (e) { var li = e.target.closest('li[data-n]'); if (li) go(Number(li.dataset.n)); });
    ovl.addEventListener('mousedown', function (e) { if (e.target === ovl) close(); });
    paint(); input.focus();
  }
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && String(e.key).toLowerCase() === 'k') {
      var role = S().getRole ? S().getRole() : 'teacher';
      if (role !== 'teacher') return;
      e.preventDefault(); openPalette();
    }
  });

  root.renderCommandCenterView = render;
})(typeof window !== 'undefined' ? window : this);
