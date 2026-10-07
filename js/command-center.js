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
  var SKILLS = [['reading', 'R', 'Reading'], ['listening', 'L', 'Listening'], ['writing', 'W', 'Writing'], ['speaking', 'S', 'Speaking']];
  var TIPS = {
    reading: 'Read a short text together and ask Who / Where / Why. Match pictures to sentences.',
    listening: 'Listen-and-point or listen-and-draw. Simon Says. Dictate 3 key words.',
    writing: 'Give sentence frames (I can… / It has…). Copy and complete, then 3 sentences with a word bank.',
    speaking: 'Pair dialogues with frames, Hot Seat, and give this pupil speaking turns with points.'
  };
  /** Latest English Progress Check for a pupil: { pct, total, max, date, title, skills: {reading: 0-10, …} } or null. */
  function checkOf(studentId) {
    var st = S(); if (!st.getProgressCheckSubmissions) return null;
    var list = (st.getProgressCheckSubmissions(null, studentId) || []).filter(function (x) { return x && x.scores; });
    if (!list.length) return null;
    list.sort(function (a, b) { return String(b.updatedAt || b.date || '').localeCompare(String(a.updatedAt || a.date || '')); });
    // a skill with 0 points is treated as "not entered" (many checks only have the speaking part filled in)
    var x = list[0], sk = {}, got = 0, max = 0, missing = [];
    SKILLS.forEach(function (k) { var v = x.scores[k[0]]; if (v && v.total && Number(v.correct) > 0) { sk[k[0]] = Math.round((v.correct / v.total) * 10); got += Number(v.correct); max += Number(v.total); } else missing.push(k[2]); });
    if (!max) return null;
    return { pct: Math.round(got / max * 100), total: got, max: max, date: x.date || '', title: x.unitTitle || 'Progress Check', skills: sk, missing: missing };
  }
  /** Home practice = XP you gave for homework / home tasks in the last 14 days. */
  function homeOf(studentId) {
    var n = 0, now = Date.now();
    txOf(studentId).forEach(function (t) {
      var ts = new Date(t.timestamp || t.date || 0).getTime(), amt = Number(t.amount) || 0;
      if (amt > 0 && now - ts <= 14 * DAY && /home|ödev|odev|tea party|alice/i.test(String(t.reason || '') + ' ' + String(t.category || ''))) n++;
    });
    return n;
  }
  function worksheetsOf(studentId) {
    var out = [];
    try { var w = root.ClassroomStore && root.ClassroomStore.data().worksheets || {}; Object.keys(w).forEach(function (k) { var sc = w[k].scores && w[k].scores[studentId]; if (sc != null) out.push({ name: w[k].name, score: sc }); }); } catch (e) { /* no worksheets */ }
    return out;
  }
  /** Same first + last name more than once among active pupils (for example a pupil added twice). */
  function duplicatesMap() {
    var st = S(), seen = {}, out = {};
    (st.getStudents ? st.getStudents() : []).forEach(function (s) {
      var k = ((s.firstName || '') + ' ' + (s.lastName || '')).trim().toLowerCase(); if (!k) return;
      (seen[k] = seen[k] || []).push(s);
    });
    Object.keys(seen).forEach(function (k) { if (seen[k].length > 1) seen[k].forEach(function (s) { out[s.id] = seen[k].map(function (x) { var c = st.getClass ? st.getClass(x.classId) : null; return (c && c.name) || x.classId || '?'; }); }); });
    return out;
  }
  /** Combine activity, test scores and home practice into one status with plain reasons. */
  function diagnose(r, classHasHome) {
    var why = [], needs = [], status = 'ok';
    if (r.a.since >= 7) { status = 'help'; why.push(r.a.since >= 999 ? 'No XP yet' : 'No XP for ' + r.a.since + ' days'); }
    if (r.check && r.check.pct < 50) { status = 'help'; why.push('Progress Check ' + r.check.total + '/' + r.check.max); }
    var weak = SKILLS.filter(function (k) { return r.check && r.check.skills[k[0]] != null && r.check.skills[k[0]] <= 4; });
    weak.forEach(function (k) { needs.push(k[0]); });
    if (status !== 'help') {
      if (r.a.status === 'slow') { status = 'slow'; why.push('Less XP than last week'); }
      if (weak.length) { status = 'slow'; why.push('Weak ' + weak.map(function (k) { return k[2].toLowerCase(); }).join(', ')); }
    }
    if (status === 'ok' && r.check && r.check.pct >= 85 && r.a.last > 0) { status = 'star'; why.push('Strong test and active this week'); }
    if (!why.length) why.push('Active and on track');
    if (classHasHome && !r.home) why.push('No home practice in 14 days');
    if (r.check) { var low = SKILLS.filter(function (k) { return r.check.skills[k[0]] != null; }).sort(function (a, b) { return r.check.skills[a[0]] - r.check.skills[b[0]]; })[0]; if (low && needs.indexOf(low[0]) < 0 && r.check.skills[low[0]] <= 6) needs.push(low[0]); }
    return { status: status, why: why, needs: needs };
  }
  function rowsFor(cls) {
    var st = S(), mism = {}, dup = duplicatesMap();
    try { reconPlan(cls).rows.forEach(function (x) { if (x.diff !== 0) mism[x.id] = x; }); } catch (e) { /* optional */ }
    var rows = st.getStudentsByClass(cls.id).map(function (s) {
      var m = st.calculateMonsterState ? st.calculateMonsterState(s.id) : {};
      var prof = st.getMonsterProfile ? st.getMonsterProfile(s.id) : null;
      var a = analyse(s);
      var img = ''; try { img = root.getStudentMonsterAvatarUrl ? root.getStudentMonsterAvatarUrl(s, prof, m) : ''; } catch (e) { img = ''; }
      return {
        id: s.id, first: s.firstName || s.name || 'Student', name: ((s.firstName || '') + ' ' + (s.lastName || '')).trim() || s.name || 'Student',
        xp: Number(m.totalXP != null ? m.totalXP : (s.xp || 0)) || 0, level: m.currentLevel || s.level || 1,
        pct: m.progressPct || 0, img: img, a: a, att: st.getStudentAttendanceRate ? st.getStudentAttendanceRate(s.id) : null,
        check: checkOf(s.id), home: homeOf(s.id), ws: worksheetsOf(s.id), mism: mism[s.id] || null, dup: dup[s.id] || null
      };
    });
    var classHasHome = rows.some(function (r) { return r.home > 0; });
    rows.forEach(function (r) { r.d = diagnose(r, classHasHome); });
    rows.classHasHome = classHasHome;
    return rows;
  }

  // ------------------------------------------------------------- pieces
  var STATUS = { star: ['⭐ Doing great', 'cc-t0'], ok: ['On track', 'cc-t1'], slow: ['Watch', 'cc-t2'], help: ['Needs help', 'cc-t3'] };
  var STATUS_ORDER = { help: 0, slow: 1, ok: 2, star: 3 };
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
      if (localStorage.getItem('eaa_xp_rescue_hidden_v2')) return '';
      var plan = reconPlan(cls);
      if (plan.off.length < 1) return '';
      return '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:#2e2410;border:1px solid #6b4e12;color:#fde68a;border-radius:12px;padding:12px 16px;margin-bottom:14px"><span>⚠️ <b>' + plan.off.length + ' students</b> have <b>less XP than their own award history shows</b> (it can be lost when two devices save at the same moment).</span><button class="cc-plus" style="margin-left:auto;padding:7px 14px" onclick="CommandCenter.restoreXp()">Review &amp; restore lost XP</button></div>';
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
    '.cc-t0{background:#1d2450;color:#a5b4fc}.cc-dim{color:#7c8498;font-size:12px}.cc-why{color:#7c8498;font-size:11px;margin-top:3px;max-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.cc-nm{min-width:170px}.cc td,.cc th{padding-left:9px!important;padding-right:9px!important}.cc-grid{grid-template-columns:minmax(0,2.3fr) minmax(0,1fr)!important}.cc-lvl{white-space:nowrap}.cc-why{max-width:120px}' +
    '.cc-lvl{display:flex;align-items:center;gap:6px;font-weight:500;font-size:11px;color:#7c8498;margin-top:3px}.cc-lvl .cc-bar{display:inline-block;margin:0;width:60px}.cc-bar i{display:block}' +
    '.cc-flag{margin-left:6px;color:#fbbf24;font-size:12px;cursor:help}.cc-nm span{min-width:0}' +
    '.cc-sk{display:flex;align-items:flex-end;gap:3px;height:30px}.cc-sk span{width:14px;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;position:relative}.cc-sk span i{display:block;width:10px;border-radius:3px 3px 0 0;margin-bottom:12px}.cc-sk span b{position:absolute;bottom:0;font-size:9px;color:#7c8498}.cc-sk em{font-style:normal;font-weight:700;font-size:11px;color:#cbd2e1;margin-left:4px;align-self:center}' +
    '.cc-kp5{grid-template-columns:repeat(5,minmax(0,1fr))}' +
    '.cc-cs{padding:10px 14px 4px;display:flex;flex-direction:column;gap:8px}.cc-mini{white-space:nowrap}.cc-csr{display:grid;grid-template-columns:76px 1fr 34px auto;align-items:center;gap:8px}.cc-csr .l{color:#cbd2e1;font-weight:600}.cc-csr.weak .l{color:#f87171}' +
    '.cc-csr .b,.cc-hp .b,.cc-dsk .b{height:8px;background:#1d2029;border-radius:9px;overflow:hidden}.cc-csr .b i,.cc-hp .b i,.cc-dsk .b i{display:block;height:100%;border-radius:9px}.cc-hp .b i{background:#818cf8}' +
    '.cc-mini{border:1px solid #4b2a2a;background:#2f1519;color:#fca5a5;border-radius:99px;padding:2px 8px;font:700 10px Inter,system-ui,sans-serif;cursor:pointer;text-align:center}.cc-mini.ok{border-color:#1f3d31;background:#10291f;color:#34d399;cursor:default}' +
    '.cc-tip{margin:6px 14px 10px;background:#161a2e;border:1px solid #2a3057;border-radius:10px;padding:9px 11px;color:#c7cdf5;line-height:1.45}' +
    '.cc-hp{padding:12px 14px 8px;display:grid;grid-template-columns:1fr auto;gap:6px 10px;align-items:center}.cc-hp .b{grid-column:1/-1}' +
    '.cc-dc{padding:10px 14px;display:flex;flex-direction:column;gap:8px;color:#cbd2e1;line-height:1.45}' +
    '.cc-dr{justify-content:flex-end;align-items:stretch;padding:0}.cc-drp{width:min(440px,96vw);height:100%;overflow:auto;background:#0f1117;border-left:1px solid #2a2f3d;padding:18px;font-family:Inter,system-ui,sans-serif;color:#e6e8ee;font-size:13px;animation:ccIn .2s ease-out}' +
    '@keyframes ccIn{from{transform:translateX(30px);opacity:0}}' +
    '.cc-drh{display:flex;align-items:center;gap:12px}.cc-drh img{width:58px;height:58px;object-fit:contain;background:#171a23;border-radius:12px}.cc-drh h2{margin:0;font-size:18px}.cc-x{margin-left:auto;background:none;border:0;color:#8b93a7;font-size:18px;cursor:pointer}' +
    '.cc-drs{margin:12px 0 6px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}.cc-drp h4{margin:16px 0 8px;font-size:12px;color:#aab1c3;text-transform:uppercase;letter-spacing:.06em}' +
    '.cc-dsk{display:grid;grid-template-columns:80px 1fr 44px;gap:8px;align-items:center;margin-bottom:7px}' +
    '.cc-drg{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.cc-drg div{background:#14161d;border:1px solid #1d2029;border-radius:9px;padding:8px}.cc-drg small{color:#7c8498;display:block}.cc-drg b{font-size:14px}' +
    '.cc-tips{margin:0;padding-left:18px;line-height:1.5;color:#cbd2e1}.cc-warn{background:#2e2410;color:#fde68a;border-radius:9px;padding:8px 10px;margin-top:8px}' +
    '.cc-dra{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}.cc-dra .cc-plus{padding:7px 11px}.cc-plus.pri{background:#232850;border-color:#4b52c4;color:#fff}' +
    '@media(max-width:1100px){.cc-grid{grid-template-columns:minmax(0,1fr)}.cc-kp5{grid-template-columns:repeat(3,minmax(0,1fr))}}' +
    '@media(max-width:900px){.cc-grid{grid-template-columns:minmax(0,1fr)}.cc-kp{grid-template-columns:repeat(2,minmax(0,1fr))}.cc-kp div:nth-child(2){border-right:0}.cc-kp div:nth-child(-n+2){border-bottom:1px solid var(--l)}.cc-cmd{min-width:0;flex:1}}';
  function ensureCss() {
    if (document.getElementById('cc-css')) return;
    var el = document.createElement('style'); el.id = 'cc-css'; el.textContent = CSS; document.head.appendChild(el);
  }

  // ------------------------------------------------------------- view
  var current = [], skillFilter = '';
  function skillBars(c) {
    if (!c) return '<span class="cc-dim" title="No Progress Check yet">not tested</span>';
    return '<div class="cc-sk" title="' + esc(c.title + ': ' + c.total + '/' + c.max) + '">' + SKILLS.map(function (k) {
      var v = c.skills[k[0]]; if (v == null) return '<span title="' + k[2] + ': not entered"><i style="height:8%;background:#2a2f3d"></i><b>' + k[1] + '</b></span>';
      var col = v >= 8 ? '#34d399' : v >= 5 ? '#fbbf24' : '#f87171';
      return '<span><i style="height:' + Math.max(8, v * 10) + '%;background:' + col + '"></i><b>' + k[1] + '</b></span>';
    }).join('') + '<em>' + c.pct + '%</em></div>';
  }
  function tableHtml() {
    var rows = current.slice();
    if (filterKey !== 'all') rows = rows.filter(function (r) { return r.d.status === filterKey; });
    if (skillFilter) rows = rows.filter(function (r) { return r.check && r.check.skills[skillFilter] != null && r.check.skills[skillFilter] <= 6; });
    if (query) { var q = query.toLowerCase(); rows = rows.filter(function (r) { return r.name.toLowerCase().indexOf(q) !== -1; }); }
    rows.sort(function (a, b) {
      var x, y;
      if (sortKey === 'name') { return sortDir * a.name.localeCompare(b.name); }
      if (sortKey === 'status') { x = STATUS_ORDER[a.d.status]; y = STATUS_ORDER[b.d.status]; }
      else if (sortKey === 'week') { x = a.a.last; y = b.a.last; }
      else if (sortKey === 'level') { x = a.level; y = b.level; }
      else if (sortKey === 'check') { x = a.check ? a.check.pct : -1; y = b.check ? b.check.pct : -1; }
      else if (sortKey === 'home') { x = a.home; y = b.home; }
      else { x = a.xp; y = b.xp; }
      return sortDir * (x - y) || a.name.localeCompare(b.name);
    });
    if (!rows.length) return '<div class="cc-empty">No students match.</div>';
    function th(k, label, tip) { return '<th onclick="CommandCenter.sort(\'' + k + '\')"' + (tip ? ' title="' + tip + '"' : '') + '>' + label + (sortKey === k ? (sortDir < 0 ? ' ↓' : ' ↑') : '') + '</th>'; }
    return '<div class="cc-wrap"><table><thead><tr>' + th('name', 'Student') + th('xp', 'XP') + th('week', 'This week') + '<th style="cursor:default">7-day trend</th>' +
      th('check', 'Skills (test)', 'Latest English Progress Check: R reading, L listening, W writing, S speaking (out of 10)') + th('home', 'Home', 'Homework / home practice awards in the last 14 days') + th('status', 'Status') + '<th style="cursor:default"></th></tr></thead><tbody>' +
      rows.map(function (r) {
        var s = STATUS[r.d.status];
        var flag = (r.mism && Math.abs(r.mism.diff) >= 50 ? '<span class="cc-flag" title="XP shown (' + r.mism.shown + ') is lower than the award history (' + r.mism.target + ')">⚠</span>' : '') + (r.dup ? '<span class="cc-flag" title="This name exists ' + r.dup.length + ' times: ' + esc(r.dup.join(', ')) + '">⧉</span>' : '');
        return '<tr onclick="CommandCenter.open(\'' + esc(r.id) + '\')"><td><div class="cc-nm">' + (r.img ? '<img src="' + esc(r.img) + '" alt="" loading="lazy">' : '') + '<span>' + esc(r.name) + flag + '<small class="cc-lvl">Lvl ' + r.level + '<span class="cc-bar"><i style="width:' + Math.max(2, Math.min(100, r.pct)) + '%"></i></span></small></span></div></td>' +
          '<td>' + r.xp.toLocaleString() + '</td><td>' + (r.a.last ? '+' + r.a.last : '–') + '</td><td>' + spark(r.a.days, r.d.status === 'star' ? 'ok' : r.d.status) + '</td>' +
          '<td>' + skillBars(r.check) + '</td><td>' + (current.classHasHome ? (r.home ? '🏠 ' + r.home : '<span class="cc-dim">0</span>') : '<span class="cc-dim">–</span>') + '</td>' +
          '<td><span class="cc-t ' + s[1] + '" title="' + esc(r.d.why.join(' · ')) + '">' + s[0] + '</span><div class="cc-why">' + esc(r.d.why[0]) + '</div></td>' +
          '<td onclick="event.stopPropagation()"><button class="cc-plus" onclick="CommandCenter.award(\'' + esc(r.id) + '\',5)">+5</button> <button class="cc-plus" onclick="CommandCenter.award(\'' + esc(r.id) + '\',10)">+10</button></td></tr>';
      }).join('') + '</tbody></table></div>';
  }
  function refreshTable() { var el = document.getElementById('cc-table'); if (el) el.innerHTML = tableHtml(); var c = document.getElementById('cc-count'); if (c) c.textContent = current.length; }

  /** Class-level diagnosis from the latest Progress Check of every pupil. */
  function classSkillsHtml() {
    var tested = current.filter(function (r) { return r.check; });
    if (!tested.length) return '<div class="cc-empty">No English Progress Check results for this class yet.<br><button class="cc-plus" style="margin-top:8px" onclick="switchView(\'progress-check\')">Open English Progress Check</button></div>';
    var avg = SKILLS.map(function (k) {
      var vals = tested.map(function (r) { return r.check.skills[k[0]]; }).filter(function (v) { return v != null; });
      var a = vals.length ? vals.reduce(function (n, v) { return n + v; }, 0) / vals.length : null;
      var low = tested.filter(function (r) { return r.check.skills[k[0]] != null && r.check.skills[k[0]] <= 4; });
      return { k: k, avg: a, low: low, n: vals.length };
    });
    var weakest = avg.filter(function (x) { return x.avg != null; }).sort(function (a, b) { return a.avg - b.avg; })[0];
    return '<div class="cc-cs">' + avg.map(function (x) {
      if (x.avg == null) return '<div class="cc-csr"><span class="l">' + x.k[2] + '</span><div class="b"></div><b>–</b><span class="cc-mini ok" style="background:#1d2029;border-color:#2a2f3d;color:#7c8498">not entered</span></div>';
      var col = x.avg >= 8 ? '#34d399' : x.avg >= 5 ? '#fbbf24' : '#f87171';
      return '<div class="cc-csr' + (x === weakest ? ' weak' : '') + '"><span class="l">' + x.k[2] + '</span><div class="b" title="' + x.n + ' pupils have a ' + x.k[2].toLowerCase() + ' score"><i style="width:' + Math.round(x.avg * 10) + '%;background:' + col + '"></i></div><b>' + x.avg.toFixed(1) + '</b>' +
        (x.low.length ? '<button class="cc-mini" onclick="CommandCenter.skill(\'' + x.k[0] + '\')" title="Show pupils with ' + x.k[2].toLowerCase() + ' 6/10 or lower">' + x.low.length + ' weak</button>' : '<span class="cc-mini ok">ok</span>') + '</div>';
    }).join('') + '</div>' +
      (weakest ? '<div class="cc-tip"><b>Class focus: ' + weakest.k[2] + '</b> (average ' + weakest.avg.toFixed(1) + '/10). ' + esc(TIPS[weakest.k[0]]) + '</div>' : '') +
      '<div class="cc-dim" style="padding:0 14px 12px">' + tested.length + ' of ' + current.length + ' pupils tested' + (tested.length < current.length ? ' · not tested: ' + esc(current.filter(function (r) { return !r.check; }).map(function (r) { return r.first; }).join(', ')) : '') + '</div>';
  }
  function homePanelHtml() {
    if (!current.classHasHome) return '<div class="cc-empty">No homework or home-practice XP in the last 14 days. When you give XP with the reason "homework" or "home", it shows here.</div>';
    var none = current.filter(function (r) { return !r.home; });
    var did = current.length - none.length;
    return '<div class="cc-hp"><div class="b"><i style="width:' + Math.round(did / current.length * 100) + '%"></i></div><b>' + did + ' of ' + current.length + '</b> practised at home (14 days)</div>' +
      (none.length ? '<div class="cc-dim" style="padding:0 14px 12px">Not yet: ' + esc(none.map(function (r) { return r.first; }).join(', ')) + '</div>' : '<div class="cc-dim" style="padding:0 14px 12px">Everyone practised at home. 🎉</div>');
  }
  function dataChecksHtml() {
    var mism = current.filter(function (r) { return r.mism; }), dup = current.filter(function (r) { return r.dup; });
    if (!mism.length && !dup.length) return '';
    return '<div class="cc-pn" style="margin-top:16px"><h3>⚠️ Data checks</h3><div class="cc-dc">' +
      (mism.length ? '<div><b>XP is lower than the award history</b> for ' + mism.length + ' pupil' + (mism.length > 1 ? 's' : '') + ': ' + mism.map(function (r) { return esc(r.first) + ' (' + r.mism.shown + ' shown, ' + r.mism.target + ' in history)'; }).join(', ') + '. <button class="cc-mini" onclick="CommandCenter.restoreXp()">Review</button></div>' : '') +
      (dup.length ? '<div><b>Same name twice:</b> ' + dup.map(function (r) { return esc(r.name) + ' (' + esc(r.dup.join(' + ')) + ')'; }).join(', ') + '. One may be an old copy: check it in the pupil\u2019s profile.</div>' : '') +
      '</div></div>';
  }

  // ---- one pupil: the diagnosis card
  function drawer(id) {
    var r = current.filter(function (x) { return x.id === id; })[0]; if (!r) return;
    var old = document.getElementById('cc-drawer'); if (old) old.remove();
    var st = STATUS[r.d.status], c = r.check;
    var skills = c ? SKILLS.map(function (k) { var v = c.skills[k[0]]; if (v == null) return ''; var col = v >= 8 ? '#34d399' : v >= 5 ? '#fbbf24' : '#f87171'; return '<div class="cc-dsk"><span>' + k[2] + '</span><div class="b"><i style="width:' + v * 10 + '%;background:' + col + '"></i></div><b>' + v + '/10</b></div>'; }).join('') + '<div class="cc-dim">' + esc(c.title) + ' · ' + c.total + '/' + c.max + ' in the parts entered' + (c.date ? ' · ' + esc(c.date) : '') + (c.missing.length ? '<br>Not entered: ' + esc(c.missing.join(', ')) : '') + '</div>'
      : '<div class="cc-dim">No English Progress Check yet.</div>';
    var tips = r.d.needs.length ? r.d.needs.map(function (k) { return '<li><b>' + k.charAt(0).toUpperCase() + k.slice(1) + ':</b> ' + esc(TIPS[k]) + '</li>'; }).join('') : '<li>Keep going: give a stretch task (a longer answer, or helping a friend).</li>';
    var ws = r.ws.length ? r.ws.map(function (w) { return esc(w.name) + ': <b>' + w.score + '/10</b>'; }).join('<br>') : '<span class="cc-dim">No worksheet score entered yet.</span>';
    var tally = []; try { tally = (S().getStudentClassroomSkillsTally(r.id) || []).filter(function (t) { return t.category === 'positive' || !t.category; }).sort(function (a, b) { return b.count - a.count; }).slice(0, 3); } catch (e) { tally = []; }
    var ovl = document.createElement('div'); ovl.id = 'cc-drawer'; ovl.className = 'cc-ovl cc-dr';
    ovl.innerHTML = '<div class="cc-drp"><div class="cc-drh">' + (r.img ? '<img src="' + esc(r.img) + '" alt="">' : '') + '<div><h2>' + esc(r.name) + '</h2><div class="cc-dim">Level ' + r.level + ' · ' + r.xp.toLocaleString() + ' XP</div></div><button class="cc-x" onclick="document.getElementById(\'cc-drawer\').remove()">✕</button></div>' +
      '<div class="cc-drs"><span class="cc-t ' + st[1] + '">' + st[0] + '</span> <span class="cc-dim">' + esc(r.d.why.join(' · ')) + '</span></div>' +
      (r.mism ? '<div class="cc-warn">⚠ XP shown (' + r.mism.shown + ') is lower than the award history (' + r.mism.target + '). <button class="cc-mini" onclick="CommandCenter.restoreXp()">Review</button></div>' : '') +
      (r.dup ? '<div class="cc-warn">⧉ This name exists ' + r.dup.length + ' times (' + esc(r.dup.join(', ')) + '). One may be an old copy.</div>' : '') +
      '<h4>Skills (latest test)</h4>' + skills +
      '<h4>Activity</h4><div class="cc-drg"><div><small>This week</small><b>' + (r.a.last ? '+' + r.a.last : '0') + ' XP</b></div><div><small>Last week</small><b>' + (r.a.prev ? '+' + r.a.prev : '0') + ' XP</b></div><div><small>Last XP</small><b>' + (r.a.since >= 999 ? 'never' : r.a.since === 0 ? 'today' : r.a.since + ' d ago') + '</b></div><div><small>Home (14 d)</small><b>' + r.home + '</b></div></div>' +
      (tally.length ? '<div class="cc-dim" style="margin-top:6px">Most XP for: ' + tally.map(function (t) { return esc(t.name) + ' ×' + t.count; }).join(', ') + '</div>' : '') +
      '<h4>Worksheets</h4><div>' + ws + '</div>' +
      '<h4>What to do next</h4><ul class="cc-tips">' + tips + '</ul>' +
      '<div class="cc-dra"><button class="cc-plus" onclick="CommandCenter.award(\'' + esc(r.id) + '\',5)">+5 XP</button><button class="cc-plus" onclick="CommandCenter.award(\'' + esc(r.id) + '\',10)">+10 XP</button><button class="cc-plus" onclick="openGiveXPSkillsModal && openGiveXPSkillsModal(\'student\',\'' + esc(r.id) + '\')">🎯 XP for a skill</button><button class="cc-plus pri" onclick="document.getElementById(\'cc-drawer\').remove(); openStudentDetail(\'' + esc(r.id) + '\')">Open full profile</button></div></div>';
    document.body.appendChild(ovl);
    ovl.addEventListener('mousedown', function (e) { if (e.target === ovl) ovl.remove(); });
  }

  function render(container) {
    ensureCss();
    var st = S(), cls = st.getActiveClass(), now = new Date();
    current = rowsFor(cls);
    var attRecs = st.getAttendanceRecords ? (st.getAttendanceRecords(cls.id) || []) : [];
    var att = st.getClassAttendanceRate ? st.getClassAttendanceRate(cls.id) : 0;
    var active = current.filter(function (r) { return r.a.last > 0; }).length;
    var tested = current.filter(function (r) { return r.check; });
    var testAvg = tested.length ? Math.round(tested.reduce(function (n, r) { return n + r.check.pct; }, 0) / tested.length) : null;
    var homeN = current.filter(function (r) { return r.home > 0; }).length;
    var helpN = current.filter(function (r) { return r.d.status === 'help'; }).length;
    var slowN = current.filter(function (r) { return r.d.status === 'slow'; }).length;
    var starN = current.filter(function (r) { return r.d.status === 'star'; }).length;
    var hour = now.getHours(), greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    var who = (st.getSchoolSettings && st.getSchoolSettings().teacherName) || 'Mr. Maysam';
    function chip(k, label) { return '<button class="' + (filterKey === k ? 'on' : '') + '" onclick="CommandCenter.filter(\'' + k + '\')">' + label + '</button>'; }
    container.innerHTML = '<div class="cc">' +
      '<div class="cc-top"><div><h1>' + greet + ', ' + esc(who) + '</h1><p class="cc-sub">' + esc(cls.name) + ' · <span id="cc-count">' + current.length + '</span> learners · ' + now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' }) + '</p></div>' +
        '<button class="cc-cmd" onclick="CommandCenter.palette()">🔍 Search or jump to…<kbd>Ctrl K</kbd></button></div>' +
      (xpBanner(cls)) +
      '<div class="cc-links"><button onclick="switchView(\'board\')">📺 Open Class Board</button><button onclick="openFastAttendanceModal && openFastAttendanceModal()">✓ Take attendance</button><button onclick="switchView(\'progress-check\')">📊 Progress Check</button><button onclick="switchView(\'homework\')">✍️ Homework</button><button onclick="switchView(\'curriculum\')">📚 Lessons</button><button onclick="switchView(\'store\')">🛍️ Store</button></div>' +
      '<div class="cc-kp cc-kp5">' +
        '<div><small>Attendance</small><b>' + (attRecs.length ? att + '%' : '–') + '<em>' + (attRecs.length ? 'all days' : 'no roll call yet') + '</em></b></div>' +
        '<div><small>Active this week</small><b>' + active + '<em>of ' + current.length + '</em></b></div>' +
        '<div><small>Progress Check average</small><b>' + (testAvg != null ? testAvg + '%' : '–') + '<em>' + tested.length + ' tested</em></b></div>' +
        '<div><small>Home practice (14 days)</small><b>' + (current.classHasHome ? homeN + '<em>of ' + current.length + '</em>' : '–<em>none recorded</em>') + '</b></div>' +
        '<div><small>Need help · watch</small><b><span style="color:#f87171">' + helpN + '</span><em>·</em><span style="color:#fbbf24">' + slowN + '</span><em>' + starN + ' doing great</em></b></div></div>' +
      '<div class="cc-grid"><div class="cc-pn"><h3>Students' +
        '<input class="cc-find" placeholder="Filter…" value="' + esc(query) + '" oninput="CommandCenter.find(this.value)">' +
        '<select class="cc-find" style="width:auto" onchange="CommandCenter.skill(this.value)"><option value="">All skills</option>' + SKILLS.map(function (k) { return '<option value="' + k[0] + '"' + (skillFilter === k[0] ? ' selected' : '') + '>Weak in ' + k[2].toLowerCase() + '</option>'; }).join('') + '</select>' +
        '<span class="cc-chips">' + chip('all', 'All') + chip('help', 'Needs help') + chip('slow', 'Watch') + chip('star', 'Doing great') + '</span></h3>' +
        '<div id="cc-table">' + tableHtml() + '</div><div class="cc-dim" style="padding:8px 14px">Click a pupil for the full diagnosis. Hover a status to see why.</div></div>' +
        '<div><div class="cc-pn"><h3>📊 Class skills (latest Progress Check)</h3>' + classSkillsHtml() + '</div>' +
          '<div class="cc-pn" style="margin-top:16px"><h3>🏠 Home practice</h3>' + homePanelHtml() + '</div>' +
          dataChecksHtml() +
          '<div class="cc-pn" style="margin-top:16px"><h3>Recent activity</h3><div class="cc-feed">' + feedFor(cls) + '</div></div></div></div></div>';
  }

  // ------------------------------------------------------------- actions
  var api = {
    sort: function (k) { if (sortKey === k) sortDir = -sortDir; else { sortKey = k; sortDir = k === 'name' ? 1 : -1; } refreshTable(); },
    filter: function (f) { filterKey = f; if (root.renderCurrentView) root.renderCurrentView(); },
    find: function (v) { query = v || ''; refreshTable(); },
    open: function (id) { drawer(id); },
    skill: function (k) { skillFilter = k || ''; var sel = document.querySelector('.cc select.cc-find'); if (sel) sel.value = skillFilter; refreshTable(); },
    award: function (id, n) {
      var st = S(); if (!st.giveXP) return;
      st.giveXP(id, n, 'Quick Classroom Award', 'Teacher', { category: 'positive', icon: '⭐' });
      try { root.classSoundboard && root.classSoundboard.playCoinReward && root.classSoundboard.playCoinReward(); } catch (e) { /* sound is optional */ }
      var cls = st.getActiveClass(); current = rowsFor(cls); refreshTable();
      var dr = document.getElementById('cc-drawer'); if (dr) drawer(id);
    },
    palette: function () { openPalette(); }
  };
  root.CommandCenter = api;

  // ------------------------------------------------------------- XP restore (history vs shown totals)
  // The shown XP can drift away from the award history (e.g. after a reset). This previews the fix and applies it on request.
  // The newest balance written in the pupil's OWN award history (voided awards left out).
  // The list of awards in the cloud is not a safe source: pupils also have XP from before the list existed, and a device
  // that has not loaded all of it adds up too little. The history balance is what the teacher saw after the last award.
  function histBalance(s) {
    var h = Array.isArray(s.xpHistory) ? s.xpHistory : [], best = null, bt = -1;
    h.forEach(function (e) {
      if (!e || e.status === 'voided' || e.isVoided) return;
      var b = Number(e.balanceAfter); if (isNaN(b)) return;
      var t = Date.parse(e.timestamp || '') || 0;
      if (t > bt) { bt = t; best = b; }
    });
    return best;
  }
  // Only ever RAISES a pupil's XP, to the balance their own history shows. Never lowers anything.
  function reconPlan(cls) {
    var rows = [];
    S().getStudentsByClass(cls.id).forEach(function (s) {
      var shown = Number(s.xp) || 0, hb = histBalance(s), target = hb == null ? shown : Math.max(shown, Math.round(hb));
      rows.push({ id: s.id, name: ((s.firstName || '') + ' ' + (s.lastName || '')).trim(), shown: shown, target: target, diff: target - shown });
    });
    return { rows: rows, dupes: [], off: rows.filter(function (r) { return r.diff > 0; }) };
  }
  function reconModal() {
    var st = S(), cls = st.getActiveClass(), plan = reconPlan(cls);
    ensureCss();
    var old = document.getElementById('cc-recon'); if (old) old.remove();
    var ovl = document.createElement('div'); ovl.id = 'cc-recon'; ovl.className = 'cc-ovl'; ovl.style.alignItems = 'center';
    var names = {}; st.getStudentsByClass(cls.id).forEach(function (s) { names[s.id] = s.firstName; });
    ovl.innerHTML = '<div class="cc-pal" style="width:min(640px,94vw);padding:20px;max-height:86vh;overflow:auto">' +
      '<h2 style="font-size:18px;margin:0 0 6px">Restore lost XP · ' + esc(cls.name) + '</h2>' +
      '<p style="color:#8b93a7;margin:0 0 12px">These pupils have <b>less XP than their own award history shows</b>. This can happen when two devices save at the same moment. Pressing the button <b>raises</b> each one to the balance in their history. It never lowers anyone. A backup of today\'s numbers is saved first.</p>' +
      '<table style="width:100%;border-collapse:collapse;font-size:13px"><tr style="color:#7c8498;text-align:left"><th style="padding:5px 8px">Student</th><th>Shown now</th><th>Will become</th><th>Change</th></tr>' +
      plan.rows.filter(function (r) { return r.diff > 0; }).map(function (r) { return '<tr style="border-top:1px solid #1d2029"><td style="padding:6px 8px">' + esc(r.name) + '</td><td>' + r.shown + '</td><td><b>' + r.target + '</b></td><td style="color:' + (r.diff > 0 ? '#34d399' : r.diff < 0 ? '#f87171' : '#8b93a7') + '">' + (r.diff > 0 ? '+' : '') + r.diff + '</td></tr>'; }).join('') + '</table>' +
      '<div style="display:flex;gap:10px;margin-top:16px;justify-content:flex-end"><button class="cc-plus" id="cc-r-no" style="padding:9px 16px">Not now</button><button class="cc-plus" id="cc-r-hide" style="padding:9px 16px">Don\'t ask again</button><button id="cc-r-go" style="background:#4f46e5;color:#fff;border:0;border-radius:8px;padding:9px 18px;font:700 13px Inter,system-ui,sans-serif;cursor:pointer">Restore these totals</button></div></div>';
    document.body.appendChild(ovl);
    ovl.querySelector('#cc-r-no').onclick = function () { ovl.remove(); };
    ovl.querySelector('#cc-r-hide').onclick = function () { try { localStorage.setItem('eaa_xp_rescue_hidden_v2', '1'); } catch (e) { /* ignore */ } ovl.remove(); if (root.renderCurrentView) root.renderCurrentView(); };
    ovl.querySelector('#cc-r-go').onclick = function () { applyRecon(plan); ovl.remove(); };
    ovl.addEventListener('mousedown', function (e) { if (e.target === ovl) ovl.remove(); });
  }
  function applyRecon(plan) {
    var st = S(), backup = {};
    plan.rows.forEach(function (r) { backup[r.id] = r.shown; });
    try { localStorage.setItem('eaa_xp_backup_' + Date.now(), JSON.stringify(backup)); } catch (e) { /* ignore */ }
    // each pupil gets an ordinary "+N" award, so the cloud adds it to its own number and it shows in the XP history
    plan.rows.forEach(function (r) {
      if (!(r.diff > 0) || !st.getStudent(r.id)) return;
      st.adjustStudentXP(r.id, { delta: r.diff, reason: 'Lost XP restored from the award history', teacher: 'Teacher', category: 'correction', icon: '🛟' });
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
