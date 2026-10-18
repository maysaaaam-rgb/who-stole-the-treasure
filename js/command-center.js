/* Command Center: a dense, calm teacher overview (class stats, the XP each pupil earned day by day, homework of the last two weeks from the Google Sheets, activity feed, Ctrl+K jump bar).
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
  var RANGE = 7;   // days shown in the table: 7, 14 or 30
  var NDAYS = 30;  // days of XP kept for every pupil
  /* Days a class is left out when pupils are judged (no lessons, XP not entered). The day boxes show them hatched, and nobody is marked
     "needs help" or "less XP than last week" because of them. 3B: 6 to 14 October 2026. */
  var PAUSED = {};   // 3B's dead week (6 to 14 Oct 2026) was taken out on 15 Oct 2026 at the teacher's request: every day counts. Example entry: { 'class-3b': { from: '2026-10-06', to: '2026-10-14', note: 'no lessons' } }
  var pausedKeys = {}, pausedClass = null;
  function dayKey(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function setPaused(classId) {
    pausedKeys = {}; pausedClass = null; var p = PAUSED[classId]; if (!p) return;
    pausedClass = p; var a = new Date(p.from + 'T12:00:00'), b = new Date(p.to + 'T12:00:00');
    for (var d = a; d <= b; d.setDate(d.getDate() + 1)) pausedKeys[dayKey(d)] = p.note;
  }
  /* XP the pupil EARNED day by day (30 days). Repairs ("Lost XP restored from the award history") are not XP earned that day, so they are left out. */
  function analyse(student) {
    var now = Date.now(), today = dayStart(now), days = [], prev = 0, last = 0, lastTs = 0, arctic = { n: 0, xp: 0 }, byAgo = {}, nw = { n: 0, list: [] };
    for (var i = 0; i < NDAYS; i++) days.push(0);
    txOf(student.id).forEach(function (t) {
      var amt = Number(t.amount != null ? t.amount : (t.points != null ? t.points : t.xp)) || 0;
      var ts = new Date(t.timestamp || t.date || 0).getTime();
      if (t.category === 'needs_work' && amt < 0 && ts && !isNaN(ts) && Math.floor((today - dayStart(ts)) / DAY) < 14) { nw.n++; nw.list.push({ ts: ts, reason: t.reason || 'Needs work', amt: amt }); }   // discipline: the last 14 days
      if (!ts || isNaN(ts) || amt <= 0 || t.category === 'correction') return;
      if (ts > lastTs) lastTs = ts;
      var ago = Math.floor((today - dayStart(ts)) / DAY);       // 0 = today
      if (ago >= 0 && ago < 60) byAgo[ago] = (byAgo[ago] || 0) + amt;
      if (ago >= 0 && ago < NDAYS) { days[NDAYS - 1 - ago] += amt; if (ago < 14 && t.source === 'Homework') { arctic.n++; arctic.xp += amt; } }
      if (ago >= 0 && ago < 7) last += amt; else if (ago >= 7 && ago < 14) prev += amt;
    });
    var since = lastTs ? Math.floor((today - dayStart(lastTs)) / DAY) : 999;
    // the numbers behind the status words skip the paused days of the class: "the last 7 lesson days" against "the 7 before"
    var sLast = 0, sPrev = 0, sSince = null, taken = 0;
    for (var k = 0; k < 60; k++) {
      var dd = new Date(today); dd.setDate(dd.getDate() - k);
      if (pausedKeys[dayKey(dd)]) continue;
      taken++; var v = byAgo[k] || 0;
      if (v > 0 && sSince === null) sSince = taken - 1;
      if (taken <= 7) sLast += v; else if (taken <= 14) sPrev += v;
    }
    if (sSince === null) sSince = since >= 60 ? since : 999;
    var status = 'ok';
    if (sSince >= 7) status = 'help';
    else if (sPrev > 0 && sLast < sPrev * 0.5) status = 'slow';
    return { days: days, last: last, prev: prev, since: since, sSince: sSince, sLast: sLast, sPrev: sPrev, status: status, arctic: arctic, nw: nw };
  }

  /* ---- homework of the last two weeks. Tea Party and Chuseok cooking come straight from the Google Sheets (read only, checked every time the page opens);
     (The Arctic Rescue game was taken out of this list on 15 Oct 2026: the teacher does not want it in the Command Center.) */
  var HW = [
    { id: 'tea1', label: 'Tea Party 1', title: 'Alice Tea Party: Home Practice, Week 1', grade: 4, steps: 5, due: 'Oct 10', kind: 'sheet' },
    { id: 'tea2', label: 'Tea Party 2', title: 'Alice Tea Party: Home Practice, Week 2 (with a recording)', grade: 4, steps: 3, due: 'Oct 15', kind: 'sheet' },
    { id: 'cook', label: 'Cooking', title: 'Chuseok cooking project', grade: 3, steps: 1, due: 'Oct 15', kind: 'sheet' }
  ];
  var sheetLoading = false, sheet = { data: null, error: '' }, classGrade = 0, classQuiet = 0;   // classQuiet: days since ANY pupil of the class got XP (only when that is 7 or more)
  function gradeOfClass(cls) { var m = /([34])/.exec((cls && cls.name) || ''); return m ? Number(m[1]) : 0; }
  function hwList() { return HW.filter(function (h) { return !h.grade || h.grade === classGrade; }); }
  /** One pupil, one homework: { k: done | part | open | none | wait, txt (short, for the table), say (full words) } */
  /* Pupils who sent the homework on the school's k12 site (attachment + update date, checked by the teacher on 16 Oct 2026) and not through the Google Sheet. Keyed by school number. */
  var K12_DONE = { cook: { '224': 'k12', '205': 'k12', '352': 'k12', '201': 'teacher' }, tea2: { '345': 'k12' } };   // 201 = Begüm: her parent sent the work another way (WhatsApp); the teacher counted it on 16 Oct 2026
  var TEACHER_PART = { cook: { '217': 1 } };   // marked "partially did" by the teacher (16 Oct 2026): Ece Aras opened the page and tried
  function hwState(r, h) {
    var mnum = /(\d+)$/.exec(String(r.id)); if (mnum && K12_DONE[h.id] && K12_DONE[h.id][mnum[1]]) return { k: 'done', txt: '✓', say: (K12_DONE[h.id][mnum[1]] === 'teacher' ? 'counted as done by the teacher' : 'sent on the k12 site (counted as done)') };
    if (mnum && TEACHER_PART[h.id] && TEACHER_PART[h.id][mnum[1]] && !(K12_DONE[h.id] && K12_DONE[h.id][mnum[1]])) return { k: 'part', txt: '½', say: 'partly done (marked by the teacher)' };
    if (h.kind === 'xp') {
      var a = r.a.arctic;
      return a.n ? { k: 'part', txt: '+' + a.xp, say: 'played the game: ' + a.n + ' awards, ' + a.xp + ' XP' } : { k: 'none', txt: '–', say: 'has not played yet' };
    }
    if (!sheet.data) return { k: 'wait', txt: sheet.error ? '?' : '…', say: sheet.error ? 'the Google Sheet could not be read' : 'reading the Google Sheet' };
    var v = (sheet.data.pupils[r.id] || {})[h.id];
    if (!v) return { k: 'none', txt: '–', say: 'not started' };
    if (v.finished) return { k: 'done', txt: '✓', say: 'finished' };
    // opened the link AND did something (a step or a recording) counts as done: some pupils had technical trouble and could not finish
    if (v.steps > 0) return { k: 'done', txt: v.steps + '/' + h.steps, say: v.steps + ' of ' + h.steps + ' steps done (counted as done)' };
    if (v.rec) return { k: 'done', txt: '🎤', say: 'sent a recording (counted as done)' };
    return { k: 'open', txt: '👀', say: 'opened the page, not started' };
  }
  function recOf(r, h) { var v = sheet.data && (sheet.data.pupils[r.id] || {})[h.id]; return v && v.rec ? v.rec : null; }
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
  /** One status from what really happened: XP over the days and the homework from the sheets. (The old English Progress Check scores are no longer used.) */
  /** A homework only counts as missing once its due day is over (due 'Oct 15' counts from 16 Oct). */
  function overdue(h) {
    if (!h.due) return true;
    var d = new Date(h.due + ' ' + new Date().getFullYear() + ' 23:59:59');
    return isNaN(d.getTime()) || Date.now() > d.getTime();
  }
  function diagnose(r) {
    var why = [], status = 'ok', missing = [], sheetHw = hwList().filter(function (h) { return h.kind === 'sheet'; });
    if (r.a.sSince >= 7 && classQuiet) { status = 'quiet'; why.push('The whole class has had no XP for ' + classQuiet + ' lesson days'); }
    else if (r.a.sSince >= 7) { status = 'help'; why.push(r.a.sSince >= 999 ? 'No XP yet' : 'No XP for ' + r.a.sSince + ' lesson days'); }
    else if (r.xpSlow) { status = 'slow'; why.push('Much less XP than the class this week (' + r.a.sLast + ' against ' + classMedXp + ')'); }
    if (sheet.data) sheetHw.forEach(function (h) { if (hwState(r, h).k !== 'done') missing.push(h); });
    if (status === 'ok' && sheet.data && sheetHw.length && !missing.length && r.a.last > 0) { status = 'star'; why.push('All homework done and active this week'); }
    // XP, homework and the quiz are weighed together: one weak thing = Watch, two = Needs help (a pupil with no XP for 7 lesson days is already Needs help)
    var weak = [];
    if (r.xpSlow) weak.push('XP');
    if (sheet.data && sheetHw.length >= 2 && missing.length === sheetHw.length && missing.every(overdue)) weak.push('homework');   // one homework alone (3B: Cooking) is shown but never makes a pupil Watch
    if (r.a.nw && r.a.nw.n >= NW_WEAK) { weak.push('discipline'); why.push(r.a.nw.n + ' "Needs work" awards in the last 2 weeks'); }
    if (r.qWeak) { weak.push('quiz'); why.push('Quiz ' + r.q.pct + '% (' + r.q.text + '), class average ' + quizAvg + '%'); }
    if (status === 'ok' || status === 'star' || status === 'slow') {
      if (weak.length >= 2) { status = 'help'; why.unshift('Weak in ' + weak.join(' and ')); }
      else if (weak.length === 1) { status = 'slow'; if (weak[0] !== 'quiz' && weak[0] !== 'XP') why.unshift('Weak in ' + weak[0]); }
      else if (r.q && r.q.pct >= 70 && status === 'ok' && sheet.data && !missing.length && r.a.last > 0) { status = 'star'; }
    }
    if (status === 'star' && r.q && r.q.pct < 70) status = 'ok';
    if (!why.length) why.push('Active and on track');
    if (missing.length) why.push('Homework not finished: ' + missing.map(function (h) { return h.label; }).join(', '));
    return { status: status, why: why, missing: missing };
  }
  /** The Unit 3 paper quiz of this pupil (from quiz-results.js), or null. Under 40% counts as weak. */
  // ---- support plan: a private flag and note per pupil, kept ONLY in this browser (never in the cloud, never in reports or parent pages). No diagnosis is typed anywhere.
  var SUPPORT_KEY = 'eaa_support_v1';
  function supportAll() { try { var o = JSON.parse(localStorage.getItem(SUPPORT_KEY) || '{}'); return o && typeof o === 'object' ? o : {}; } catch (e) { return {}; } }
  function supportOn(id) { var o = supportAll()[id]; return !!(o && o.on); }
  function supportGet(id) { var o = supportAll()[id] || {}; return { on: !!o.on, note: String(o.note || '') }; }
  function supportSet(id, patch) {
    var all = supportAll(), o = all[id] || { on: false, note: '' };
    if (patch && 'on' in patch) o.on = !!patch.on;
    if (patch && 'note' in patch) o.note = String(patch.note || '').slice(0, 4000);
    all[id] = o; try { localStorage.setItem(SUPPORT_KEY, JSON.stringify(all)); } catch (e) { /* not remembered */ }
    return o;
  }
  var NW_WEAK = 3;   // 3 or more 'Needs work' awards in 14 days = weak discipline
  var QUIZ_GAP = 20, quizAvg = 0, classMedXp = 0;   // a quiz is weak when it is 20 points or more under the class average (so one hard quiz does not flag half the class)
  function quizOf(id) { try { return root.QuizResults && root.QuizResults.scoreOf ? root.QuizResults.scoreOf(id) : null; } catch (e) { return null; } }
  function rowsFor(cls) {
    var st = S(), mism = {}, dup = duplicatesMap();
    classGrade = gradeOfClass(cls); setPaused(cls.id);
    try { reconPlan(cls).rows.forEach(function (x) { if (x.diff !== 0) mism[x.id] = x; }); } catch (e) { /* optional */ }
    var rows = st.getStudentsByClass(cls.id).map(function (s) {
      var m = st.calculateMonsterState ? st.calculateMonsterState(s.id) : {};
      var prof = st.getMonsterProfile ? st.getMonsterProfile(s.id) : null;
      var a = analyse(s);
      var img = ''; try { img = root.getStudentMonsterAvatarUrl ? root.getStudentMonsterAvatarUrl(s, prof, m) : ''; } catch (e) { img = ''; }
      return {
        id: s.id, first: s.firstName || s.name || 'Student', name: ((s.firstName || '') + ' ' + (s.lastName || '')).trim() || s.name || 'Student',
        xp: Number(m.totalXP != null ? m.totalXP : (s.xp || 0)) || 0, level: m.currentLevel || s.level || 1,
        pct: m.progressPct || 0, img: img, a: a, q: quizOf(s.id), att: st.getStudentAttendanceRate ? st.getStudentAttendanceRate(s.id) : null,
        ws: worksheetsOf(s.id), mism: mism[s.id] || null, dup: dup[s.id] || null
      };
    });
    var newest = rows.length ? Math.min.apply(null, rows.map(function (r) { return r.a.sSince; })) : 0;
    classQuiet = rows.length && newest >= 7 && newest < 999 ? newest : 0;
    // XP is judged against the class (the 7 lesson days): a week nobody had XP, or a class with few lessons, hurts nobody. Weak = under half of the class median.
    var lasts = rows.map(function (r) { return r.a.sLast; }).sort(function (a, b) { return a - b; });
    classMedXp = lasts.length ? (lasts.length % 2 ? lasts[(lasts.length - 1) / 2] : Math.round((lasts[lasts.length / 2 - 1] + lasts[lasts.length / 2]) / 2)) : 0;
    rows.forEach(function (r) { r.xpSlow = classMedXp > 0 && r.a.sLast < classMedXp * 0.5; });
    var qs = rows.filter(function (r) { return r.q; });
    quizAvg = qs.length ? Math.round(qs.reduce(function (a, r) { return a + r.q.pct; }, 0) / qs.length) : 0;
    rows.forEach(function (r) { r.qWeak = !!(r.q && r.q.pct <= quizAvg - QUIZ_GAP); });
    rows.forEach(function (r) { r.d = diagnose(r); if (supportOn(r.id) && (r.d.status === 'help' || r.d.status === 'slow' || r.d.status === 'quiet')) { r.d.status = 'build'; r.d.why = ['Working at their own pace (support plan)']; } });
    return rows;
  }

  // ------------------------------------------------------------- pieces
  var STATUS = { build: ['🌱 Building', 'cc-t1'], star: ['⭐ Doing great', 'cc-t0'], ok: ['On track', 'cc-t1'], slow: ['Watch', 'cc-t2'], help: ['Needs help', 'cc-t3'], quiet: ['No XP lately', 'cc-t4'] };
  var STATUS_ORDER = { help: 0, slow: 1, quiet: 2, ok: 3, star: 4 };
  function ago(ts) {
    var d = Math.floor((dayStart(Date.now()) - dayStart(ts)) / DAY);
    return d <= 0 ? 'today' : d === 1 ? 'yesterday' : d + ' days ago';
  }
  function feedFor(cls) {
    var st = S(), names = {};
    st.getStudentsByClass(cls.id).forEach(function (s) { names[s.id] = s.firstName || s.name || 'Student'; });
    return (st.state.xpTransactions || []).filter(function (t) { return names[t.studentId] && Number(t.amount) > 0 && t.category !== 'correction' && t.status !== 'voided'; })
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
      return '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:#2e2410;border:1px solid #6b4e12;color:#fde68a;border-radius:12px;padding:12px 16px;margin-bottom:14px"><span>⚠️ <b>' + plan.off.length + (plan.off.length === 1 ? ' student</b> has <b>' : ' students</b> have <b>') + 'less XP than their own award history shows</b> (it can be lost when two devices save at the same moment).</span><button class="cc-plus" style="margin-left:auto;padding:7px 14px" onclick="CommandCenter.restoreXp()">Review &amp; restore lost XP</button></div>';
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
    '.cc-t0{background:#1d2450;color:#a5b4fc}.cc-t4{background:#1b1e2a;color:#9aa3b8}.cc-dim{color:#7c8498;font-size:12px}.cc-why{color:#7c8498;font-size:11px;margin-top:3px;max-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
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
    '.cc-drg{display:grid;grid-template-columns:repeat(auto-fit,minmax(86px,1fr));gap:8px}.cc-dbars{gap:2px}.cc-drg div{background:#14161d;border:1px solid #1d2029;border-radius:9px;padding:8px}.cc-drg small{color:#7c8498;display:block}.cc-drg b{font-size:14px}' +
    '.cc-tips{margin:0;padding-left:18px;line-height:1.5;color:#cbd2e1}.cc-warn{background:#2e2410;color:#fde68a;border-radius:9px;padding:8px 10px;margin-top:8px}' +
    '.cc-dra{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}.cc-dra .cc-plus{padding:7px 11px}.cc-plus.pri{background:#232850;border-color:#4b52c4;color:#fff}' +
    '@media(max-width:1100px){.cc-grid{grid-template-columns:minmax(0,1fr)}.cc-kp5{grid-template-columns:repeat(3,minmax(0,1fr))}}' +
    '@media(max-width:900px){.cc-grid{grid-template-columns:minmax(0,1fr)}.cc-kp{grid-template-columns:repeat(2,minmax(0,1fr))}.cc-kp div:nth-child(2){border-right:0}.cc-kp div:nth-child(-n+2){border-bottom:1px solid var(--l)}.cc-cmd{min-width:0;flex:1}}';
  /* XP-per-day table, homework columns and the lower panels (added when the English Progress Check "skills" and old "home practice" were removed) */
  var CSS2 = '' +
    '.cc table{min-width:0}.cc-rng{margin-left:auto}.cc-rng+.cc-chips{margin-left:8px!important}' +
    '.cc th.cc-d,.cc td.cc-d{text-align:center;padding-left:2px!important;padding-right:2px!important;width:36px;min-width:34px}' +
    '.cc th.cc-d small{display:block;font-weight:500;color:#5b6377;margin-top:1px}.cc th.cc-d.today{color:#a5b4fc}.cc th.cc-d.today small{color:#a5b4fc}.cc th.cc-d.we,.cc td.cc-d.we{opacity:.7}' +
    '.cc-xp{display:inline-block;min-width:30px;padding:3px 0;border-radius:7px;font-weight:700;font-size:12px;color:#fff}.cc-dot{color:#2c3140}' +
    '.cc td.cc-tt{font-weight:700;color:#a5b4fc;white-space:nowrap}' +
    '.cc th.cc-hh{text-align:center;font-size:10.5px;line-height:1.15;max-width:64px;white-space:normal}.cc td.cc-h{text-align:center;white-space:nowrap}' +
    '.cc-hw{display:inline-block;min-width:34px;padding:3px 8px;border-radius:99px;font-size:11px;font-weight:700;white-space:nowrap}' +
    '.cc-hw-ok{background:#10291f;color:#34d399}.cc-hw-mid{background:#2e2410;color:#fbbf24}.cc-hw-no{background:#14161d;color:#5b6377}.cc-hw-wait{color:#5b6377}' +
    '.cc tfoot td{border-top:1px solid #2a2f3d;font-weight:700;background:#0f1117!important;cursor:default;color:#cbd2e1}.cc tfoot td.cc-d{text-align:center;font-size:12px}' +
    '.cc-grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:16px}' +
    '.cc-hwi{padding:12px 14px;border-bottom:1px dashed var(--l);line-height:1.45;color:#cbd2e1}.cc-hwi:last-child{border:0}.cc-hwi .t{display:flex;justify-content:space-between;gap:10px;align-items:baseline}.cc-hwi .t b{color:#e6e8ee}' +
    '.cc-hwi .b{height:8px;background:#1d2029;border-radius:9px;overflow:hidden;margin:7px 0}.cc-hwi .b i{display:block;height:100%;background:#818cf8;border-radius:9px}' +
    '.cc-bars{display:flex;align-items:flex-end;gap:5px;height:190px;padding:20px 14px 6px}.cc-bars>div{flex:1;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:3px;min-width:0}' +
    '.cc-bars b{font-size:10px;color:#aab1c3;font-weight:700;height:14px}.cc-bars i{display:block;width:100%;border-radius:5px 5px 0 0;background:linear-gradient(180deg,#818cf8,#4f46e5)}.cc-bars i.we{opacity:.55}' +
    '.cc-bars small,.cc-dbars small{font-size:9.5px;color:#6b7387;text-align:center;line-height:1.15;height:22px}.cc-bars small.today,.cc-dbars small.today{color:#a5b4fc;font-weight:700}' +
    '.cc-dbars{display:flex;align-items:flex-end;gap:3px;height:120px}.cc-dbars>div{flex:1;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:2px;min-width:0}' +
    '.cc-dbars b{font-size:9px;color:#aab1c3;height:12px}.cc-dbars i{display:block;width:100%;border-radius:4px 4px 0 0;background:linear-gradient(180deg,#818cf8,#4f46e5)}.cc-dbars i.we{opacity:.55}' +
    '.cc-dhw{display:flex;justify-content:space-between;gap:10px;align-items:center;padding:6px 0;border-bottom:1px dashed var(--l)}.cc-dhw:last-child{border:0}.cc-dhw b.cc-hw{white-space:normal;text-align:right}' +
    '.cc-t14 th.cc-d,.cc-t14 td.cc-d{width:29px;min-width:27px}.cc-t14 .cc-xp{min-width:25px;font-size:10.5px;padding:3px 0;border-radius:6px}.cc-t14 .cc-why{display:none}.cc-t14 .cc-nm{min-width:0;gap:7px}.cc-t14 .cc-nm img{width:26px;height:26px}' +
    '.cc-t14 .cc-lvl .cc-bar{width:36px}.cc-t14 td,.cc-t14 th{padding-left:6px!important;padding-right:6px!important}.cc-t14 th.cc-d,.cc-t14 td.cc-d{padding-left:1px!important;padding-right:1px!important}.cc-t14 .cc-hw{min-width:0;padding:3px 6px}.cc-t14 .cc-plus{padding:3px 5px}' +
    '.cc td.cc-pz,.cc th.cc-pz{background:repeating-linear-gradient(135deg,#12141b,#12141b 3px,#1b1f2c 3px,#1b1f2c 6px)!important}.cc-bars i.pz{background:repeating-linear-gradient(135deg,#232838,#232838 3px,#2e3448 3px,#2e3448 6px);opacity:.9}' +
    '.cc-t30 th.cc-d,.cc-t30 td.cc-d{width:21px;min-width:19px;padding-left:0!important;padding-right:0!important}.cc-t30 .cc-xp{min-width:19px;font-size:9px;padding:3px 0;border-radius:5px}.cc-t30 th.cc-d{font-size:9px}.cc-t30 .cc-why{display:none}.cc-t30 .cc-nm{min-width:0;gap:6px}.cc-t30 .cc-nm img{width:24px;height:24px}' +
    '.cc-t30 .cc-lvl{display:none}.cc-t30 td,.cc-t30 th{padding-left:5px!important;padding-right:5px!important}.cc-t30 .cc-hw{min-width:0;padding:3px 5px}.cc-t30 .cc-plus{padding:3px 4px;font-size:10px}.cc-bars30{gap:2px}.cc-bars30 b{font-size:8px}.cc-bars30 small{font-size:8px}' +
    '.cc-nwb{color:#fbbf24!important}.cc-nwb sup{font-size:8px;margin-left:1px}.cc-mini.on{background:#4f46e5;color:#fff}.cc-nwl{display:grid;gap:6px}.cc-nwr{background:#14161d;border:1px solid #2a2f3d;color:#e6e8ee;border-radius:9px;padding:9px 12px;text-align:left;cursor:pointer;font-size:13px}.cc-nwr:hover{background:#1d2030;border-color:#f59e0b}' +
    '@media(max-width:1100px){.cc-grid3{grid-template-columns:minmax(0,1fr)}}';

  function ensureCss() {
    if (document.getElementById('cc-css')) return;
    var el = document.createElement('style'); el.id = 'cc-css'; el.textContent = CSS + CSS2; document.head.appendChild(el);
  }

  // ------------------------------------------------------------- view
  var current = [];
  function sum(a) { return a.reduce(function (n, v) { return n + v; }, 0); }
  function dayLabels(n) {
    var today = dayStart(Date.now()), out = [];
    for (var i = n - 1; i >= 0; i--) { var d = new Date(today); d.setDate(d.getDate() - i); out.push({ paused: pausedKeys[dayKey(d)] || '', wd: d.toLocaleDateString('en-GB', { weekday: 'short' }), n: d.getDate(), mon: d.toLocaleDateString('en-GB', { month: 'short' }), today: i === 0, weekend: d.getDay() === 0 || d.getDay() === 6 }); }
    return out;
  }
  function xpCell(v, d) {
    if (!v && d.paused) return '<td class="cc-d cc-pz" title="' + esc(d.wd + ' ' + d.n + ' ' + d.mon + ': ' + d.paused) + '"><span class="cc-dot">·</span></td>';
    if (!v) return '<td class="cc-d' + (d.weekend ? ' we' : '') + '"><span class="cc-dot">·</span></td>';
    var a = Math.min(0.85, 0.2 + v / 80 * 0.65);
    return '<td class="cc-d"><span class="cc-xp" style="background:rgba(99,102,241,' + a.toFixed(2) + ')" title="' + v + ' XP on ' + d.wd + ' ' + d.n + ' ' + d.mon + '">' + v + '</span></td>';
  }
  function hwCell(r, h) {
    var s = hwState(r, h), cl = { done: 'ok', part: 'mid', open: 'mid', none: 'no', wait: 'wait' }[s.k], rec = recOf(r, h);
    return '<td class="cc-h"><span class="cc-hw cc-hw-' + cl + '" title="' + esc(h.title + ': ' + s.say + (rec ? ' · sent ' + (rec.count > 1 ? rec.count + ' recordings' : 'a recording') + (rec.last ? ' (' + rec.last + ')' : '') : '')) + '">' + s.txt + (rec ? ' 🎤' : '') + '</span></td>';
  }
  function tableHtml() {
    var rows = current.slice(), labels = dayLabels(RANGE), hws = hwList();
    if (filterKey !== 'all') rows = rows.filter(function (r) { return r.d.status === filterKey; });
    if (query) { var q = query.toLowerCase(); rows = rows.filter(function (r) { return r.name.toLowerCase().indexOf(q) !== -1; }); }
    function tot(r) { return sum(r.a.days.slice(NDAYS - RANGE)); }
    rows.sort(function (a, b) {
      var x, y;
      if (sortKey === 'name') { return sortDir * a.name.localeCompare(b.name); }
      if (sortKey === 'status') { x = STATUS_ORDER[a.d.status]; y = STATUS_ORDER[b.d.status]; }
      else if (sortKey === 'week') { x = tot(a); y = tot(b); }
      else if (sortKey === 'level') { x = a.level; y = b.level; }
      else { x = a.xp; y = b.xp; }
      return sortDir * (x - y) || a.name.localeCompare(b.name);
    });
    if (!rows.length) return '<div class="cc-empty">No students match.</div>';
    function th(k, label, tip) { return '<th onclick="CommandCenter.sort(\'' + k + '\')"' + (tip ? ' title="' + tip + '"' : '') + '>' + label + (sortKey === k ? (sortDir < 0 ? ' ↓' : ' ↑') : '') + '</th>'; }
    var head = '<tr>' + th('name', 'Student') + th('xp', 'XP', 'All the XP the pupil has') +
      labels.map(function (d) { return '<th class="cc-d' + (d.today ? ' today' : '') + (d.weekend ? ' we' : '') + (d.paused ? ' cc-pz' : '') + '" style="cursor:default" title="' + d.wd + ' ' + d.n + ' ' + d.mon + '">' + d.wd.slice(0, 3) + '<small>' + d.n + '</small></th>'; }).join('') +
      th('week', 'Total', 'XP earned in these ' + RANGE + ' days') +
      hws.map(function (h) { return '<th class="cc-hh" style="cursor:default" title="' + esc(h.title + (h.due ? ' · due ' + h.due : '')) + '">' + esc(h.label) + '</th>'; }).join('') +
      '<th class="cc-hh" style="cursor:default" title="Unit 3 paper quiz (percent). Weak = ' + QUIZ_GAP + ' points or more under the class average (' + quizAvg + '%).">Quiz</th>' + th('status', 'Status') + '<th style="cursor:default"></th></tr>';
    var body = rows.map(function (r) {
      var s = STATUS[r.d.status];
      var flag = (r.mism && Math.abs(r.mism.diff) >= 50 ? '<span class="cc-flag" title="XP shown (' + r.mism.shown + ') is lower than the award history (' + r.mism.target + ')">⚠</span>' : '') + (r.dup ? '<span class="cc-flag" title="This name exists ' + r.dup.length + ' times: ' + esc(r.dup.join(', ')) + '">⧉</span>' : '');
      var t = tot(r);
      return '<tr onclick="CommandCenter.open(\'' + esc(r.id) + '\')"><td><div class="cc-nm">' + (r.img ? '<img src="' + esc(r.img) + '" alt="" loading="lazy">' : '') + '<span>' + esc(r.name) + flag + '<small class="cc-lvl">Lvl ' + r.level + '<span class="cc-bar"><i style="width:' + Math.max(2, Math.min(100, r.pct)) + '%"></i></span></small></span></div></td>' +
        '<td>' + r.xp.toLocaleString('en-US') + '</td>' + r.a.days.slice(NDAYS - RANGE).map(function (v, i) { return xpCell(v, labels[i]); }).join('') +
        '<td class="cc-tt">' + (t ? '+' + t : '<span class="cc-dim">0</span>') + '</td>' + hws.map(function (h) { return hwCell(r, h); }).join('') +
        '<td class="cc-h">' + (r.q ? '<span class="cc-hw cc-hw-' + (r.qWeak ? 'no' : r.q.pct >= 70 ? 'ok' : 'mid') + '" title="Unit 3 quiz ' + esc(r.q.text) + '">' + r.q.pct + '%</span>' : '<span class="cc-dim">–</span>') + '</td>' +
        '<td><span class="cc-t ' + s[1] + '" title="' + esc(r.d.why.join(' · ')) + '">' + s[0] + '</span><div class="cc-why">' + esc(r.d.why[0]) + '</div></td>' +
        '<td onclick="event.stopPropagation()"><button class="cc-plus" onclick="CommandCenter.award(\'' + esc(r.id) + '\',5)">+5</button> <button class="cc-plus" onclick="CommandCenter.award(\'' + esc(r.id) + '\',10)">+10</button> <button class="cc-plus cc-nwb" title="Needs work (discipline)" onclick="CommandCenter.needsWork(\'' + esc(r.id) + '\')">⚠' + (r.a.nw && r.a.nw.n ? '<sup>' + r.a.nw.n + '</sup>' : '') + '</button></td></tr>';
    }).join('');
    var foot = '<tr><td>Class total</td><td>' + sum(rows.map(function (r) { return r.xp; })).toLocaleString('en-US') + '</td>' +
      labels.map(function (d, i) { var v = sum(rows.map(function (r) { return r.a.days[NDAYS - RANGE + i]; })); return '<td class="cc-d">' + (v || '<span class="cc-dot">·</span>') + '</td>'; }).join('') +
      '<td class="cc-tt">+' + sum(rows.map(tot)) + '</td><td colspan="' + (hws.length + 3) + '"></td></tr>';
    return '<div class="cc-wrap"><table' + (RANGE === 14 ? ' class="cc-t14"' : RANGE === 30 ? ' class="cc-t30"' : '') + '><thead>' + head + '</thead><tbody>' + body + '</tbody><tfoot>' + foot + '</tfoot></table></div>';
  }
  function refreshTable() { var el = document.getElementById('cc-table'); if (el) el.innerHTML = tableHtml(); var c = document.getElementById('cc-count'); if (c) c.textContent = current.length; }

  /** Homework of the last two weeks for this class: how many finished, halfway, not started. */
  function homeworkHtml() {
    var n = current.length, hws = hwList();
    var note = !sheet.data && !sheet.error ? '<div class="cc-dim" style="padding:10px 14px">Reading the Google Sheets…</div>'
      : sheet.error ? '<div class="cc-warn" style="margin:10px 14px">Could not read the Google Sheet (' + esc(sheet.error) + '). Check the internet and open the page again.</div>' : '';
    return note + hws.map(function (h) {
      var groups = { done: [], part: [], open: [], none: [], wait: [] }, rec = 0;
      current.forEach(function (r) { groups[hwState(r, h).k].push(r); if (recOf(r, h)) rec++; });
      var isXp = h.kind === 'xp', did = isXp ? groups.part.length : groups.done.length;
      var line = isXp ? '<b>' + did + ' of ' + n + '</b> played'
        : '<b>' + did + ' of ' + n + '</b> did it (finished, or opened and did something)' + (groups.open.length ? ' · ' + groups.open.length + ' opened only' : '') + (rec ? ' · 🎤 ' + rec + ' sent a recording' : '');
      var todo = isXp ? groups.none : groups.none.concat(groups.open);
      return '<div class="cc-hwi"><div class="t"><b>' + esc(h.title) + '</b>' + (h.due ? '<span class="cc-dim">due ' + esc(h.due) + '</span>' : '') + '</div>' +
        '<div class="b"><i style="width:' + Math.round(did / (n || 1) * 100) + '%"></i></div><div>' + line + '</div>' +
        (sheet.data || isXp ? (todo.length ? '<div class="cc-dim" style="margin-top:4px">' + (isXp ? 'Not yet: ' : 'Not started: ') + esc(todo.map(function (r) { return r.first; }).join(', ')) + '</div>' : '<div class="cc-dim" style="margin-top:4px">Everyone has started 🎉</div>') : '') + '</div>';
    }).join('');
  }
  /** Class XP for each of the last 14 days (bars). */
  function perDayHtml() {
    var n = Math.max(RANGE, 14), labels = dayLabels(n), tot = labels.map(function (d, i) { return sum(current.map(function (r) { return r.a.days[NDAYS - n + i]; })); }), max = Math.max.apply(null, tot.concat([1]));
    return '<div class="cc-bars' + (n > 14 ? ' cc-bars30' : '') + '">' + labels.map(function (d, i) {
      return '<div title="' + d.wd + ' ' + d.n + ' ' + d.mon + ': ' + tot[i] + ' XP' + (d.paused && !tot[i] ? ' (' + esc(d.paused) + ')' : '') + '"><b>' + (tot[i] || '') + '</b><i style="height:' + Math.max(tot[i] ? 6 : 1, Math.round(tot[i] / max * 100)) + '%"' + (d.paused ? ' class="pz"' : d.weekend ? ' class="we"' : '') + '></i><small' + (d.today ? ' class="today"' : '') + '>' + d.wd.slice(0, 2) + '<br>' + d.n + '</small></div>';
    }).join('') + '</div><div class="cc-dim" style="padding:0 14px 12px">XP given to this class each day. Repairs of lost XP are not counted.' + (pausedClass ? ' Hatched days are left out: ' + esc(pausedClass.note) + '.' : '') + '</div>';
  }

  function dataChecksHtml() {
    var mism = current.filter(function (r) { return r.mism; }), dup = current.filter(function (r) { return r.dup; }), badQ = badQuizTx(S().getActiveClass());
    var pend = pendingRedate(), lost = lostGroups(S().getActiveClass());
    var rdup = rawDuplicates().filter(function (p) { var ac = S().getActiveClass(); return ac && (p.keep.classId === ac.id || p.drop.classId === ac.id); });
    if (!mism.length && !dup.length && !badQ.length && !pend.length && !lost.length && !rdup.length) return '';
    return '<div class="cc-pn" style="margin-top:16px"><h3>⚠️ Data checks</h3><div class="cc-dc">' +
      (mism.length ? '<div><b>XP is lower than the award history</b> for ' + mism.length + ' pupil' + (mism.length > 1 ? 's' : '') + ': ' + mism.map(function (r) { return esc(r.first) + ' (' + r.mism.shown + ' shown, ' + r.mism.target + ' in history)'; }).join(', ') + '. <button class="cc-mini" onclick="CommandCenter.restoreXp()">Review</button></div>' : '') +
      (lost.length ? '<div><b>' + lost.reduce(function (a, g) { return a + g.items.length; }, 0) + ' awards are on the wrong day (2, 13 or 14 Oct) and look like they belong to 6 to 12 Oct</b> (3B\'s lost week; the school computer clock was wrong). <button class="cc-mini" onclick="CommandCenter.moveLostWeek()">Move them to the right days</button></div>' : '') +
      (pend.length ? '<div><b>' + pend.length + ' quiz XP awards were fixed on this computer but are not saved to the cloud yet.</b> <button class="cc-mini" id="cc-rp-btn" onclick="CommandCenter.saveRedatePending()">Save to the cloud</button></div>' : '') +
      (badQ.length ? '<div><b>' + badQ.length + ' quiz XP awards have an impossible date</b> (before the quiz existed, for example ' + esc(new Date(badQ[0].timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })) + '). The computer that gave them probably has the wrong clock. <button class="cc-mini" onclick="CommandCenter.redateQuizXp()">Fix the dates</button></div>' : '') +
      (rdup.length ? '<div><b>' + rdup.map(function (p) { return esc((p.keep.firstName || '') + ' ' + (p.keep.lastName || '')); }).join(', ') + ' is entered twice</b> (one record may be archived and hidden). <button class="cc-mini" onclick="CommandCenter.mergeDuplicates()">Merge them</button></div>' : '') +
      (dup.length ? '<div><b>Same name twice:</b> ' + dup.map(function (r) { return esc(r.name) + ' (' + esc(r.dup.join(' + ')) + ')'; }).join(', ') + '. One may be an old copy: check it in the pupil\u2019s profile.</div>' : '') +
      '</div></div>';
  }

  function drawer(id) {
    var r = current.filter(function (x) { return x.id === id; })[0]; if (!r) return;
    var old = document.getElementById('cc-drawer'); if (old) old.remove();
    var st = STATUS[r.d.status], labels = dayLabels(30), days14 = r.a.days.slice(NDAYS - 30), max = Math.max.apply(null, days14.concat([1]));
    var bars = '<div class="cc-dbars">' + days14.map(function (v, i) {
      var d = labels[i];
      return '<div title="' + d.wd + ' ' + d.n + ' ' + d.mon + ': ' + v + ' XP"><b>' + (v || '') + '</b><i style="height:' + Math.max(v ? 8 : 2, Math.round(v / max * 100)) + '%"' + (d.weekend ? ' class="we"' : '') + '></i><small' + (d.today ? ' class="today"' : '') + '>' + d.n + '</small></div>';
    }).join('') + '</div>';
    var hw = hwList().map(function (h) {
      var s = hwState(r, h), cl = { done: 'ok', part: 'mid', open: 'mid', none: 'no', wait: 'wait' }[s.k], rec = recOf(r, h);
      return '<div class="cc-dhw"><span>' + esc(h.label) + (h.due ? ' <small class="cc-dim">due ' + esc(h.due) + '</small>' : '') + '</span><b class="cc-hw cc-hw-' + cl + '">' + esc(s.say.charAt(0).toUpperCase() + s.say.slice(1)) + (rec ? ' · 🎤 sent a recording' + (rec.last ? ' (' + esc(rec.last) + ')' : '') : '') + '</b></div>';
    }).join('');
    var ws = r.ws.length ? r.ws.map(function (w) { return esc(w.name) + ': <b>' + w.score + '/10</b>'; }).join('<br>') : '<span class="cc-dim">No worksheet score entered yet.</span>';
    var tally = []; try { tally = (S().getStudentClassroomSkillsTally(r.id) || []).filter(function (t) { return t.category === 'positive' || !t.category; }).sort(function (a, b) { return b.count - a.count; }).slice(0, 3); } catch (e) { tally = []; }
    var tips = [];
    if (r.a.sSince >= 7 && classQuiet) tips.push('<b>The whole class has had no XP for ' + classQuiet + ' lesson days:</b> enter the XP for your last lessons, or check the pupil again after the next lesson.');
    else if (r.a.sSince >= 7) tips.push('<b>No XP for ' + (r.a.sSince >= 999 ? 'a long time' : r.a.sSince + ' lesson days') + ':</b> have a quick friendly chat and give an easy win today (a speaking turn with a point).');
    else if (r.xpSlow) tips.push('<b>Much less XP than the rest of the class:</b> set one small goal for the next lesson and praise it.');
    if (r.qWeak) tips.push('<b>Unit 3 quiz ' + r.q.pct + '%:</b> go through the questions they missed (see the quiz results board) and give a short re-do.');
    r.d.missing.forEach(function (h) { tips.push('<b>Remind about ' + esc(h.label) + '</b>' + (h.due ? ' (due ' + esc(h.due) + ')' : '') + '.'); });
    if (!tips.length) tips.push('Keep going: give a stretch task (a longer answer, or helping a friend).');
    var ovl = document.createElement('div'); ovl.id = 'cc-drawer'; ovl.className = 'cc-ovl cc-dr';
    ovl.innerHTML = '<div class="cc-drp"><div class="cc-drh">' + (r.img ? '<img src="' + esc(r.img) + '" alt="">' : '') + '<div><h2>' + esc(r.name) + '</h2><div class="cc-dim">Level ' + r.level + ' · ' + r.xp.toLocaleString('en-US') + ' XP</div></div><button class="cc-x" onclick="document.getElementById(\'cc-drawer\').remove()">✕</button></div>' +
      '<div class="cc-drs"><span class="cc-t ' + st[1] + '">' + st[0] + '</span> <span class="cc-dim">' + esc(r.d.why.join(' · ')) + '</span></div>' +
      (r.mism ? '<div class="cc-warn">⚠ XP shown (' + r.mism.shown + ') is lower than the award history (' + r.mism.target + '). <button class="cc-mini" onclick="CommandCenter.restoreXp()">Review</button></div>' : '') +
      (r.dup ? '<div class="cc-warn">⧉ This name exists ' + r.dup.length + ' times (' + esc(r.dup.join(', ')) + '). One may be an old copy.</div>' : '') +
      '<h4>XP earned each day (30 days)</h4>' + bars +
      '<h4>Activity</h4><div class="cc-drg"><div><small>Last 7 days</small><b>' + (r.a.last ? '+' + r.a.last : '0') + ' XP</b></div><div><small>Week before</small><b>' + (r.a.prev ? '+' + r.a.prev : '0') + ' XP</b></div><div><small>Last XP</small><b>' + (r.a.since >= 999 ? 'never' : r.a.since === 0 ? 'today' : r.a.since + ' d ago') + '</b></div><div><small>Active days</small><b>' + days14.filter(function (v) { return v > 0; }).length + ' of 30</b></div><div><small>Last 30 days</small><b>+' + sum(days14) + ' XP</b></div></div>' +
      (tally.length ? '<div class="cc-dim" style="margin-top:6px">Most XP for: ' + tally.map(function (t) { return esc(t.name) + ' ×' + t.count; }).join(', ') + '</div>' : '') +
      (r.q ? '<h4>Unit 3 quiz</h4><div class="cc-dim" style="padding:0 0 8px"><b>' + r.q.pct + '%</b> (' + esc(r.q.text) + (r.q.speaking ? ', with speaking' : ', speaking not added yet') + ')</div>' : '') + '<h4>Homework (last two weeks)</h4>' + hw +
      '<h4>Worksheets</h4><div>' + ws + '</div>' +
      '<h4>What to do next</h4><ul class="cc-tips">' + tips.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' +
      '<div class="cc-dra"><button class="cc-plus" onclick="CommandCenter.award(\'' + esc(r.id) + '\',5)">+5 XP</button><button class="cc-plus" onclick="CommandCenter.award(\'' + esc(r.id) + '\',10)">+10 XP</button><button class="cc-plus" onclick="openGiveXPSkillsModal && openGiveXPSkillsModal(\'student\',\'' + esc(r.id) + '\')">🎯 XP for a skill</button><button class="cc-plus pri" onclick="document.getElementById(\'cc-drawer\').remove(); openStudentDetail(\'' + esc(r.id) + '\')">Open full profile</button></div></div>';
    document.body.appendChild(ovl);
    ovl.addEventListener('mousedown', function (e) { if (e.target === ovl) ovl.remove(); });
  }

  /** When NO pupil of the class got XP for a week, say it once for the class instead of marking every pupil "needs help". */
  function quietBanner(cls) {
    if (!classQuiet) return '';
    var last = new Date(dayStart(Date.now()) - classQuiet * DAY).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
    return '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:#14182b;border:1px solid #2a3057;color:#c7cdf5;border-radius:12px;padding:12px 16px;margin-bottom:14px"><span>⏸ <b>' + esc(cls.name) + ' has had no XP for ' + classQuiet + ' days</b> (the last award was on ' + last + '). Pupils are shown as "No XP lately" instead of "Needs help". If you gave points since then and cannot see them here, they were not saved to the cloud.</span></div>';
  }
  function kpiHtml() {
    var cls = S().getActiveClass(), attRecs = S().getAttendanceRecords ? (S().getAttendanceRecords(cls.id) || []) : [];
    var att = S().getClassAttendanceRate ? S().getClassAttendanceRate(cls.id) : 0;
    var active = current.filter(function (r) { return r.a.last > 0; }).length;
    var wk = sum(current.map(function (r) { return r.a.last; })), pv = sum(current.map(function (r) { return r.a.prev; }));
    var helpN = current.filter(function (r) { return r.d.status === 'help'; }).length, slowN = current.filter(function (r) { return r.d.status === 'slow'; }).length, starN = current.filter(function (r) { return r.d.status === 'star'; }).length;
    var sheetHw = hwList().filter(function (h) { return h.kind === 'sheet'; }), latest = sheetHw[sheetHw.length - 1], hwTxt = '–<em>reading the sheet…</em>';
    if (latest && sheet.data) hwTxt = current.filter(function (r) { return hwState(r, latest).k === 'done'; }).length + '<em>of ' + current.length + ' · ' + esc(latest.label) + '</em>';
    else if (latest && sheet.error) hwTxt = '–<em>sheet not available</em>';
    return '<div><small>Attendance</small><b>' + (attRecs.length ? att + '%' : '–') + '<em>' + (attRecs.length ? 'all days' : 'no roll call yet') + '</em></b></div>' +
      '<div><small>Active this week</small><b>' + active + '<em>of ' + current.length + '</em></b></div>' +
      '<div><small>XP this week</small><b>+' + wk.toLocaleString('en-US') + '<em>' + (pv ? 'week before +' + pv.toLocaleString('en-US') : 'last 7 days') + '</em></b></div>' +
      '<div><small>Homework finished</small><b>' + hwTxt + '</b></div>' +
      '<div><small>Need help · watch</small><b><span style="color:#f87171">' + helpN + '</span><em>·</em><span style="color:#fbbf24">' + slowN + '</span><em>' + starN + ' doing great</em></b></div>';
  }
  function panelsHtml() {
    var cls = S().getActiveClass();
    return '<div class="cc-pn"><h3>📚 Homework · last two weeks</h3><div id="cc-hwp">' + homeworkHtml() + '</div></div>' +
      '<div class="cc-pn"><h3>📈 Class XP each day</h3>' + perDayHtml() + '</div>' +
      '<div class="cc-pn"><h3>Recent activity</h3><div class="cc-feed">' + feedFor(cls) + '</div></div>';
  }
  /** After the Google Sheets answered (or failed): the homework columns, the status words and the numbers are filled in. */
  function refreshAll() {
    refreshTable();
    var k = document.getElementById('cc-kp'); if (k) k.innerHTML = kpiHtml();
    var p = document.getElementById('cc-hwp'); if (p) p.innerHTML = homeworkHtml();
  }
  function loadSheet() {
    if (!root.SheetSync || !root.SheetSync.snapshot) { sheet.error = 'sheet link not loaded'; refreshAll(); return; }
    root.SheetSync.snapshot().then(function (d) { sheet.data = d; sheet.error = ''; }, function (e) { sheet.data = null; sheet.error = (e && e.message) || 'no answer'; })
      .then(function () { if (!document.getElementById('cc-table')) return; current.forEach(function (r) { r.d = diagnose(r); }); refreshAll(); });
  }

  function render(container) {
    ensureCss();
    var st = S(), cls = st.getActiveClass(), now = new Date();
    current = rowsFor(cls);
    var hour = now.getHours(), greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    var who = (st.getSchoolSettings && st.getSchoolSettings().teacherName) || 'Mr. Maysam';
    function chip(k, label) { return '<button class="' + (filterKey === k ? 'on' : '') + '" onclick="CommandCenter.filter(\'' + k + '\')">' + label + '</button>'; }
    function rng(n) { return '<button class="' + (RANGE === n ? 'on' : '') + '" onclick="CommandCenter.range(' + n + ')">' + n + ' days</button>'; }
    container.innerHTML = '<div class="cc">' +
      '<div class="cc-top"><div><h1>' + greet + ', ' + esc(who) + '</h1><p class="cc-sub">' + esc(cls.name) + ' · <span id="cc-count">' + current.length + '</span> learners · ' + now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + '</p></div>' +
        '<button class="cc-cmd" onclick="CommandCenter.palette()">🔍 Search or jump to…<kbd>Ctrl K</kbd></button></div>' +
      (xpBanner(cls)) + quietBanner(cls) +
      '<div class="cc-links"><button onclick="switchView(\'board\')">📺 Open Class Board</button><button onclick="PupilCard.openClass(schoolStore.getActiveClass().id)">🃏 Class cards</button><button onclick="DailyReport.open()">📰 Daily report</button><button onclick="Birthday.manage()">🎂 Birthdays</button><button onclick="CommandCenter.mergeDuplicates()">🧩 Same pupil twice</button><button onclick="openFastAttendanceModal && openFastAttendanceModal()">✓ Take attendance</button><button onclick="switchView(\'homework\')">✍️ Homework</button><button onclick="switchView(\'assignments\')">📝 Assignments</button><button onclick="switchView(\'curriculum\')">📘 Lessons</button><button onclick="switchView(\'store\')">🛍️ Store</button></div>' +
      '<div class="cc-kp cc-kp5" id="cc-kp">' + kpiHtml() + '</div>' +
      '<div class="cc-pn"><h3>Students · XP earned each day' +
        '<input class="cc-find" placeholder="Filter…" value="' + esc(query) + '" oninput="CommandCenter.find(this.value)">' +
        '<span class="cc-chips cc-rng">' + rng(7) + rng(14) + rng(30) + '</span>' +
        '<span class="cc-chips" style="margin-left:0">' + chip('all', 'All') + chip('help', 'Needs help') + chip('slow', 'Watch') + (classQuiet ? chip('quiet', 'No XP lately') : '') + chip('star', 'Doing great') + '</span></h3>' +
        '<div id="cc-table">' + tableHtml() + '</div><div class="cc-dim" style="padding:8px 14px">Numbers in the day boxes are the XP the pupil earned that day. Homework columns come from the Google Sheets: ✓ finished · 2/5 steps done (counts as done, some pupils had technical trouble) · 🎤 sent a recording · 👀 opened only (does not count). Click a pupil for the full picture.' + (pausedClass ? '<br>⏸ ' + esc(cls.name) + ': ' + new Date(pausedClass.from + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' to ' + new Date(pausedClass.to + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' is left out (' + esc(pausedClass.note) + '): the hatched days do not count against any pupil.' : '') + '</div></div>' +
      '<div class="cc-grid3">' + panelsHtml() + '</div>' + dataChecksHtml() + '</div>';
    loadSheet();
  }

  // ------------------------------------------------------------- actions
  var api = {
    sort: function (k) { if (sortKey === k) sortDir = -sortDir; else { sortKey = k; sortDir = k === 'name' ? 1 : -1; } refreshTable(); },
    filter: function (f) { filterKey = f; if (root.renderCurrentView) root.renderCurrentView(); },
    find: function (v) { query = v || ''; refreshTable(); },
    open: function (id) { drawer(id); },
    range: function (n) { RANGE = n === 30 ? 30 : n === 14 ? 14 : 7; if (root.renderCurrentView) root.renderCurrentView(); },
    award: function (id, n) {
      var st = S(); if (!st.giveXP) return;
      st.giveXP(id, n, 'Quick Classroom Award', 'Teacher', { category: 'positive', icon: '⭐' });
      try { root.classSoundboard && root.classSoundboard.playCoinReward && root.classSoundboard.playCoinReward(); } catch (e) { /* sound is optional */ }
      var cls = st.getActiveClass(); current = rowsFor(cls); refreshAll();
      var dr = document.getElementById('cc-drawer'); if (dr) drawer(id);
    },
    /** Everything the pupil profile (js/pupil-profile.js) needs about one pupil, built with the SAME rules as the table: status + reason, 30 days of XP, quiz, homework, advice. */
    profileData: function (id, onSheet) {
      var st = S(), pupil = st.getStudent && st.getStudent(id); if (!pupil) return null;
      var cls = st.getClass ? st.getClass(pupil.classId) : null; if (!cls) return null;
      if (!sheet.data && !sheet.error && !sheetLoading && root.SheetSync && root.SheetSync.snapshot) {
        sheetLoading = true;
        root.SheetSync.snapshot().then(function (d) { sheet.data = d; sheet.error = ''; }, function (e) { sheet.data = null; sheet.error = (e && e.message) || 'no answer'; }).then(function () { sheetLoading = false; if (onSheet) onSheet(); });
      }
      var keep = { g: classGrade, q: classQuiet, pk: pausedKeys, pc: pausedClass, qa: quizAvg, mx: classMedXp };
      try {
        var rowsAll = rowsFor(cls), r = rowsAll.filter(function (x) { return x.id === id; })[0]; if (!r) return null;
        var labels = dayLabels(30), days = r.a.days.slice(NDAYS - 30);
        var hw = hwList().map(function (h) {
          var hs = hwState(r, h), rec = recOf(r, h);
          return { label: h.label, due: h.due || '', k: hs.k, say: hs.say, rec: rec ? (rec.last || 'sent') : '' };
        });
        var tally = []; try { tally = (S().getStudentClassroomSkillsTally(r.id) || []).filter(function (t) { return t.category === 'positive' || !t.category; }).sort(function (a, b) { return b.count - a.count; }).slice(0, 3); } catch (e) { tally = []; }
        var tips = [];
        if (r.a.sSince >= 7 && classQuiet) tips.push('The whole class has had no XP for ' + classQuiet + ' lesson days: enter the XP for your last lessons, then check this pupil again.');
        else if (r.a.sSince >= 7) tips.push('No XP for ' + (r.a.sSince >= 999 ? 'a long time' : r.a.sSince + ' lesson days') + ': have a quick friendly chat and give an easy win today (a speaking turn with a point).');
        else if (r.xpSlow) tips.push('Much less XP than the rest of the class: set one small goal for the next lesson and praise it.');
        if (r.qWeak) tips.push('Unit 3 quiz ' + r.q.pct + '% (class ' + quizAvg + '%): go through the questions they missed and give a short re-do.');
        r.d.missing.forEach(function (h) { if (overdue(h)) tips.push('Remind about ' + h.label + (h.due ? ' (due ' + h.due + ')' : '') + '.'); });
        if (!tips.length) tips.push('Keep going: give a stretch task (a longer answer, or helping a friend).');
        var classDays = []; for (var di = 0; di < 30; di++) classDays.push(sum(rowsAll.map(function (x) { return x.a.days[NDAYS - 30 + di]; })));
        return {
          classDays: classDays, id: r.id, name: r.name, img: r.img, xpSlow: !!r.xpSlow, nw: r.a.nw, level: r.level, xp: r.xp, statusKey: r.d.status, status: STATUS[r.d.status][0], statusCls: STATUS[r.d.status][1], why: r.d.why.slice(),
          days: days, labels: labels, last: r.a.last, prev: r.a.prev, since: r.a.since, sSince: r.a.sSince, active: days.filter(function (v) { return v > 0; }).length, month: sum(days),
          q: r.q, qWeak: !!r.qWeak, quizAvg: quizAvg, hw: hw, hwReady: !!sheet.data || !!sheet.error, tally: tally, tips: tips, ws: r.ws, mism: r.mism, dup: r.dup, classMedXp: classMedXp
        };
      } finally { classGrade = keep.g; classQuiet = keep.q; pausedKeys = keep.pk; pausedClass = keep.pc; quizAvg = keep.qa; classMedXp = keep.mx; }
    },
    /** One 'Needs work' award with a reason (negative XP, category needs_work). Undo voids it. */
    needsWork: function (id) {
      var st = S(), pupil = st.getStudent && st.getStudent(id); if (!pupil) return;
      var old = document.getElementById('cc-nw'); if (old) old.remove();
      var skills = []; try { skills = (st.getXPSkills ? st.getXPSkills('needs_work') : []) || []; } catch (e) { skills = []; }
      var reasons = skills.map(function (k) { return { name: k.name, icon: k.icon || '⚠️', skill: k.id }; });
      ['No homework', 'Not listening', 'Disturbing others', 'Unkind words'].forEach(function (n) { if (!reasons.some(function (x) { return x.name === n; })) reasons.push({ name: n, icon: '⚠️', skill: '' }); });
      var ovl = document.createElement('div'); ovl.id = 'cc-nw'; ovl.className = 'cc-ovl';
      var amt = 5;
      ovl.innerHTML = '<div class="cc-pal" style="padding:16px;max-width:420px"><div style="font-weight:800;font-size:15px;margin-bottom:4px">⚠️ Needs work: ' + esc(pupil.firstName || pupil.name) + '</div>' +
        '<div class="cc-dim" style="margin-bottom:10px">Pick the reason. It takes XP away and shows in the discipline count (last 2 weeks).</div>' +
        '<div style="display:flex;gap:6px;margin-bottom:10px"><button class="cc-mini" data-a="1">−1 XP</button><button class="cc-mini on" data-a="5">−5 XP</button><button class="cc-mini" data-a="10">−10 XP</button></div>' +
        '<div class="cc-nwl">' + reasons.map(function (x, i) { return '<button class="cc-nwr" data-i="' + i + '">' + esc(x.icon) + ' ' + esc(x.name) + '</button>'; }).join('') + '</div>' +
        '<input class="cc-nwi" placeholder="Or type your own reason and press Enter" style="width:100%;margin-top:10px;background:#0b0d13;border:1px solid #2a2f3d;color:#e6e8ee;border-radius:8px;padding:8px"></div>';
      document.body.appendChild(ovl);
      function give(reason, skillId) {
        var res = st.giveXP(id, -amt, reason, 'Teacher', { category: 'needs_work', skillId: skillId || null, icon: '⚠️' });
        var txId = res && (res.transaction && res.transaction.id || res.id);
        ovl.remove();
        var cls = st.getActiveClass(); current = rowsFor(cls); refreshAll();
        var dr = document.getElementById('cc-drawer'); if (dr) drawer(id);
        var toast = document.createElement('div'); toast.style.cssText = 'position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#2f1519;color:#fecaca;border:1px solid #7f1d1d;border-radius:12px;padding:10px 16px;z-index:100001;font:13px Inter,system-ui,sans-serif;display:flex;gap:12px;align-items:center';
        toast.innerHTML = '<span>⚠️ ' + esc(pupil.firstName || '') + ': −' + amt + ' XP, ' + esc(reason) + '</span><button style="background:#fecaca;color:#2f1519;border:0;border-radius:8px;padding:4px 10px;font-weight:800;cursor:pointer">Undo</button>';
        toast.querySelector('button').onclick = function () { if (txId && st.voidXPTransaction) st.voidXPTransaction(txId, 'Undone right away'); toast.remove(); var c2 = st.getActiveClass(); current = rowsFor(c2); refreshAll(); };
        document.body.appendChild(toast); setTimeout(function () { toast.remove(); }, 7000);
      }
      ovl.addEventListener('mousedown', function (e) { if (e.target === ovl) ovl.remove(); });
      ovl.addEventListener('click', function (e) {
        var a = e.target.closest('[data-a]'); if (a) { amt = Number(a.dataset.a); [].forEach.call(ovl.querySelectorAll('[data-a]'), function (b) { b.classList.toggle('on', b === a); }); return; }
        var r = e.target.closest('.cc-nwr'); if (r) { var x = reasons[Number(r.dataset.i)]; give(x.name, x.skill); }
      });
      ovl.querySelector('.cc-nwi').addEventListener('keydown', function (e) { if (e.key === 'Enter' && this.value.trim()) give(this.value.trim().slice(0, 60), ''); });
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
  // ------------------------------------------------------------- re-date quiz XP that was saved with a wrong computer clock
  // The Unit 3 quiz did not exist before 15 Oct 2026, so a quiz award dated earlier has the wrong date. Only those awards are touched, only their date; the XP amount never changes.
  var QUIZ_FIRST_DAY = '2026-10-15', QUIZ_REDATE_TO = '2026-10-16';
  function badQuizTx(cls) {
    var st = S(), ids = {}; if (!cls) return [];
    st.getStudentsByClass(cls.id).forEach(function (p) { ids[p.id] = p; });
    return (st.state.xpTransactions || []).filter(function (t) { return ids[t.studentId] && t.status !== 'voided' && /^Unit 3 paper quiz/.test(t.reason || '') && String(t.timestamp || '').slice(0, 10) < QUIZ_FIRST_DAY; });
  }
  function redateModal() {
    var st = S(), cls = st.getActiveClass(), list = badQuizTx(cls); ensureCss();
    var old = document.getElementById('cc-redate'); if (old) old.remove();
    if (!list.length) return;
    var ovl = document.createElement('div'); ovl.id = 'cc-redate'; ovl.className = 'cc-ovl'; ovl.style.alignItems = 'center';
    function fmt(ts) { return new Date(ts).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); }
    ovl.innerHTML = '<div class="cc-pal" style="width:min(640px,94vw);padding:20px;max-height:86vh;overflow:auto"><h2 style="font-size:18px;margin:0 0 6px">Fix the dates of the quiz XP · ' + esc(cls.name) + '</h2>' +
      '<p style="color:#8b93a7;margin:0 0 12px">These ' + list.length + ' awards are dated before the quiz existed. Pressing the button moves each one to <b>16 Oct 2026</b> (same time of day). <b>The XP amounts do not change</b>, no pupil gets or loses a point. A backup file of the old dates is downloaded first.</p>' +
      '<table style="width:100%;border-collapse:collapse;font-size:13px"><tr style="color:#7c8498;text-align:left"><th style="padding:5px 8px">Pupil</th><th>XP</th><th>Now</th><th>Will be</th></tr>' +
      list.map(function (t) { var p = st.getStudent(t.studentId) || {}, nts = QUIZ_REDATE_TO + String(t.timestamp).slice(10); return '<tr style="border-top:1px solid #1d2029"><td style="padding:6px 8px">' + esc((p.firstName || '') + ' ' + (p.lastName || '')) + '</td><td>' + esc(t.amount) + '</td><td>' + fmt(t.timestamp) + '</td><td><b>' + fmt(nts) + '</b></td></tr>'; }).join('') + '</table>' +
      '<div style="color:#fbbf24;font-size:12px;margin-top:10px">Tip: fix the clock of the computer first (Windows date and time), or new points will get the wrong date again. Do this on the computer that gave the points.</div>' +
      '<div style="display:flex;gap:10px;margin-top:16px;justify-content:flex-end"><button class="cc-plus" id="cc-d-no" style="padding:9px 16px">Not now</button><button class="cc-plus" id="cc-d-go" style="padding:9px 16px;background:#10b981;color:#06101f;font-weight:800">Fix ' + list.length + ' dates</button></div><div id="cc-d-msg" class="cc-dim" style="margin-top:10px"></div></div>';
    document.body.appendChild(ovl);
    ovl.querySelector('#cc-d-no').onclick = function () { ovl.remove(); };
    ovl.querySelector('#cc-d-go').onclick = function () { applyRedate(list, ovl); };
    ovl.addEventListener('mousedown', function (e) { if (e.target === ovl) ovl.remove(); });
  }
  /** Writes ONLY these awards (their id, amount and new date) to the cloud table of XP awards. */
  function saveRedateToCloud(list) {
    var A = root.AdventureSupabase;
    if (!A || !A.saveXPTransactions) return Promise.reject(new Error('the cloud service is not loaded'));
    return Promise.resolve(A.saveXPTransactions(list)).then(function () {
      try { localStorage.removeItem('eaa_redate_pending'); var done = JSON.parse(localStorage.getItem('eaa_redate_saved') || '[]') || []; list.forEach(function (t) { if (done.indexOf(t.id) < 0) done.push(t.id); }); localStorage.setItem('eaa_redate_saved', JSON.stringify(done)); } catch (e) { /* ignore */ }
    });
  }
  function pendingRedate() {
    var ids = []; try { ids = JSON.parse(localStorage.getItem('eaa_redate_pending') || '[]') || []; } catch (e) { ids = []; }
    if (!ids.length) {   // an earlier version fixed the dates here but never saved them: its backup copy in this browser lists those awards
      try {
        var saved = JSON.parse(localStorage.getItem('eaa_redate_saved') || '[]') || [];
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i); if (!k || k.indexOf('eaa_redate_backup_') !== 0) continue;
          (JSON.parse(localStorage.getItem(k) || '[]') || []).forEach(function (b) { if (b && b.id && saved.indexOf(b.id) < 0 && ids.indexOf(b.id) < 0) ids.push(b.id); });
        }
      } catch (e) { ids = []; }
    }
    var want = {}; ids.forEach(function (i) { want[i] = 1; });
    return ids.length ? (S().state.xpTransactions || []).filter(function (t) { return want[t.id]; }) : [];
  }
  api.saveRedatePending = function () {
    var list = pendingRedate(), btn = document.getElementById('cc-rp-btn'); if (!list.length) return;
    if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }
    saveRedateToCloud(list).then(function () { if (root.renderCurrentView) root.renderCurrentView(); },
      function (e) { if (btn) { btn.disabled = false; btn.textContent = 'Could not save (' + ((e && e.message) || 'no answer') + '). Try again'; } });
  };
  function applyRedate(list, ovl) {
    var st = S(), msg = ovl.querySelector('#cc-d-msg'), go = ovl.querySelector('#cc-d-go');
    go.disabled = true;
    var backup = list.map(function (t) { return { id: t.id, studentId: t.studentId, amount: t.amount, reason: t.reason, timestamp: t.timestamp, date: t.date }; });
    try { localStorage.setItem('eaa_redate_backup_' + Date.now(), JSON.stringify(backup)); } catch (e) { /* the downloaded file is the main backup */ }
    try {
      var blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }), a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'quiz-xp-old-dates-' + Date.now() + '.json'; document.body.appendChild(a); a.click(); a.remove();
    } catch (e) { /* no download: the browser copy above is kept */ }
    var byId = {}; list.forEach(function (t) { byId[t.id] = true; });
    list.forEach(function (t) {
      var nts = QUIZ_REDATE_TO + String(t.timestamp).slice(10), nd = new Date(nts);
      t.timestamp = nts; t.date = nd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      var p = st.getStudent(t.studentId);
      if (p && Array.isArray(p.xpHistory)) p.xpHistory.forEach(function (h) { if (h && h.id === t.id) { h.timestamp = nts; h.date = nd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); } });
    });
    st.saveState(); if (st.notify) st.notify();
    try { localStorage.setItem('eaa_redate_pending', JSON.stringify(list.map(function (t) { return t.id; }))); } catch (e) { /* the banner just will not come back */ }
    msg.textContent = 'Dates fixed on this computer. Saving to the cloud…';
    saveRedateToCloud(list).then(function () { msg.textContent = '✓ Fixed and saved to the cloud (' + list.length + ' awards).'; setTimeout(function () { ovl.remove(); if (root.renderCurrentView) root.renderCurrentView(); }, 1800); },
      function (e) { msg.innerHTML = '<span style="color:#fbbf24">Fixed on this computer, but the cloud did not save it (' + esc((e && e.message) || 'no answer') + '). Close this window: a yellow note in Data checks will let you save it to the cloud again.</span>'; });
  }
  api.redateQuizXp = redateModal;

  // ------------------------------------------------------------- 3B's lost week: awards given on 12-14 Oct with the school computer's wrong clock (stamped 2 Oct)
  // The four sittings were stamped 2 Oct, then moved on 17 Oct to 13/14 Oct as a first guess; the teacher says they belong to 6-12 Oct, so awards on any of these three days are offered again (nothing else is touched).
  var LOST = { 'class-3b': { stamped: ['2026-10-02', '2026-10-13', '2026-10-14'], afterUtcMin: 12 * 60 + 40, choices: ['2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09', '2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15'], defaults: ['2026-10-06', '2026-10-07', '2026-10-08', '2026-10-12'] } };
  function lostGroups(cls) {
    var cfg = cls && LOST[cls.id]; if (!cfg) return [];
    var st = S(), ids = {}; st.getStudentsByClass(cls.id).forEach(function (p) { ids[p.id] = 1; });
    var list = (st.state.xpTransactions || []).filter(function (t) {
      if (!ids[t.studentId] || t.status === 'voided' || t.category === 'correction' || cfg.stamped.indexOf(String(t.timestamp || '').slice(0, 10)) < 0) return false;
      var h = new Date(t.timestamp), m = h.getUTCHours() * 60 + h.getUTCMinutes();
      return m >= cfg.afterUtcMin && !/^Unit 3 paper quiz/.test(t.reason || '');
    }).sort(function (a, b) { return new Date(a.timestamp) - new Date(b.timestamp); });
    var groups = [], last = -1;
    list.forEach(function (t) {
      var ms = new Date(t.timestamp).getTime();
      if (!groups.length || ms - last > 10 * 60000) groups.push({ items: [] });
      groups[groups.length - 1].items.push(t); last = ms;
    });
    return groups;
  }
  function lostModal() {
    var st = S(), cls = st.getActiveClass(), cfg = LOST[cls.id], groups = lostGroups(cls); ensureCss();
    var old = document.getElementById('cc-lost'); if (old) old.remove();
    if (!cfg || !groups.length) return;
    var ovl = document.createElement('div'); ovl.id = 'cc-lost'; ovl.className = 'cc-ovl'; ovl.style.alignItems = 'center';
    function tm(ts) { return new Date(ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); }
    function fd(d) { return new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); }
    var rows = groups.map(function (g, i) {
      var xp = g.items.reduce(function (a, t) { return a + (Number(t.amount) || 0); }, 0), def = cfg.defaults[Math.min(i, cfg.defaults.length - 1)];
      return '<tr style="border-top:1px solid #1d2029"><td style="padding:7px 8px"><b>Group ' + (i + 1) + '</b><br><span class="cc-dim">' + tm(g.items[0].timestamp) + ' to ' + tm(g.items[g.items.length - 1].timestamp) + '</span></td><td>' + g.items.length + ' awards<br><span class="cc-dim">' + xp + ' XP</span></td><td><select data-g="' + i + '" style="background:#0b0d13;color:#e6e8ee;border:1px solid #2a2f3d;border-radius:8px;padding:6px">' + cfg.choices.map(function (d) { return '<option value="' + d + '"' + (d === def ? ' selected' : '') + '>' + fd(d) + '</option>'; }).join('') + '<option value="keep">keep as it is now</option></select></td></tr>';
    }).join('');
    ovl.innerHTML = '<div class="cc-pal" style="width:min(640px,94vw);padding:20px;max-height:86vh;overflow:auto"><h2 style="font-size:18px;margin:0 0 6px">3B\'s lost week · move the awards to the right days</h2>' +
      '<p style="color:#8b93a7;margin:0 0 12px">These ' + groups.reduce(function (a, g) { return a + g.items.length; }, 0) + ' awards sit on 2, 13 or 14 Oct, but they were given while the school computer had the wrong date. For each group pick the day it was really given (the time of day stays). <b>No XP amount changes.</b> A backup file of the old dates is downloaded first.</p>' +
      '<table style="width:100%;border-collapse:collapse;font-size:13px"><tr style="color:#7c8498;text-align:left"><th style="padding:5px 8px">Group</th><th>Awards</th><th>Real day</th></tr>' + rows + '</table>' +
      '<div style="display:flex;gap:10px;margin-top:16px;justify-content:flex-end"><button class="cc-plus" id="cc-l-no" style="padding:9px 16px">Not now</button><button class="cc-plus" id="cc-l-go" style="padding:9px 16px;background:#10b981;color:#06101f;font-weight:800">Move the awards</button></div><div id="cc-l-msg" class="cc-dim" style="margin-top:10px"></div></div>';
    document.body.appendChild(ovl);
    ovl.querySelector('#cc-l-no').onclick = function () { ovl.remove(); };
    ovl.addEventListener('mousedown', function (e) { if (e.target === ovl) ovl.remove(); });
    ovl.querySelector('#cc-l-go').onclick = function () {
      var go = this, msg = ovl.querySelector('#cc-l-msg'), moved = [];
      [].forEach.call(ovl.querySelectorAll('select[data-g]'), function (sel) {
        var g = groups[Number(sel.dataset.g)]; if (!g || sel.value === 'keep') return;
        g.items.forEach(function (t) { moved.push({ t: t, to: sel.value }); });
      });
      if (!moved.length) { msg.textContent = 'Nothing to move: every group is set to keep its date.'; return; }
      go.disabled = true;
      var backup = moved.map(function (m) { return { id: m.t.id, studentId: m.t.studentId, amount: m.t.amount, reason: m.t.reason, timestamp: m.t.timestamp, date: m.t.date }; });
      try { localStorage.setItem('eaa_redate_backup_' + Date.now(), JSON.stringify(backup)); } catch (e) { /* the file below is the main backup */ }
      try { var blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }), a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = '3b-lost-week-old-dates-' + Date.now() + '.json'; document.body.appendChild(a); a.click(); a.remove(); } catch (e) { /* no download */ }
      moved.forEach(function (m) {
        var t = m.t, nts = m.to + String(t.timestamp).slice(10), nd = new Date(nts);
        t.timestamp = nts; t.date = nd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        var p = st.getStudent(t.studentId);
        if (p && Array.isArray(p.xpHistory)) p.xpHistory.forEach(function (h) { if (h && h.id === t.id) { h.timestamp = nts; h.date = nd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); } });
      });
      var list = moved.map(function (m) { return m.t; });
      try { var ids = JSON.parse(localStorage.getItem('eaa_redate_pending') || '[]') || []; list.forEach(function (t) { if (ids.indexOf(t.id) < 0) ids.push(t.id); }); localStorage.setItem('eaa_redate_pending', JSON.stringify(ids)); } catch (e) { /* the banner just will not come back */ }
      st.saveState(); if (st.notify) st.notify();
      msg.textContent = 'Moved ' + list.length + ' awards on this computer. Saving to the cloud…';
      saveRedateToCloud(list).then(function () { msg.textContent = '✓ Moved and saved to the cloud (' + list.length + ' awards).'; setTimeout(function () { ovl.remove(); if (root.renderCurrentView) root.renderCurrentView(); }, 1800); },
        function (e) { msg.innerHTML = '<span style="color:#fbbf24">Moved on this computer, but the cloud did not save it (' + esc((e && e.message) || 'no answer') + '). Close this window: a yellow note in Data checks will let you save it again.</span>'; });
    };
  }
  api.moveLostWeek = lostModal;

  // ------------------------------------------------------------- the same pupil entered twice (also finds the archived one that the table hides)
  function normName(x) { return String(x || '').toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i').replace(/\s+/g, ' ').trim(); }
  function txOf(id) { return (S().state.xpTransactions || []).filter(function (t) { return t.studentId === id; }); }
  function rawDuplicates() {
    var groups = {};
    (S().state.students || []).forEach(function (s) { var k = normName((s.firstName || '') + ' ' + (s.lastName || '')); if (k) (groups[k] = groups[k] || []).push(s); });
    return Object.keys(groups).filter(function (k) { return groups[k].length === 2; }).map(function (k) {
      var g = groups[k], std = g.filter(function (x) { return /^student-[a-z0-9]+-\d{1,4}$/i.test(String(x.id)); });
      var keep = std.length === 1 ? std[0] : g.slice().sort(function (a, b) { return txOf(b.id).length - txOf(a.id).length; })[0];
      return { keep: keep, drop: g.filter(function (x) { return x !== keep; })[0] };
    });
  }
  function recInfo(s) {
    var l = txOf(s.id).filter(function (t) { return t.status !== 'voided'; }), last = l.length ? String(l.map(function (t) { return t.timestamp; }).sort().pop()).slice(0, 10) : 'never';
    var cls = S().getClass ? S().getClass(s.classId) : null;
    return '<div class="cc-dim" style="line-height:1.55"><b style="color:#e6e8ee;font-size:1rem">' + esc((s.firstName || '') + ' ' + (s.lastName || '')) + '</b><br>id ' + esc(s.id) + '<br>class ' + esc(cls ? cls.name : s.classId) + ' · school no. ' + esc(s.studentIdNumber || '–') + '<br>' + (s.archived ? '<span style="color:#fbbf24">archived (hidden)</span>' : 'active') + '<br><b style="color:#e6e8ee">' + (Number(s.xp) || 0) + ' XP</b> · ' + l.length + ' awards · last ' + esc(last) + '<br>' + esc(s.grade || '') + ', age ' + esc(s.age || '–') + '</div>';
  }
  function mergeModal() {
    ensureCss(); var old = document.getElementById('cc-merge'); if (old) old.remove();
    var pairs = rawDuplicates(), ovl = document.createElement('div'); ovl.id = 'cc-merge'; ovl.className = 'cc-ovl'; ovl.style.alignItems = 'center';
    ovl.innerHTML = '<div class="cc-pal" style="width:min(780px,96vw);padding:20px;max-height:88vh;overflow:auto"><h2 style="font-size:18px;margin:0 0 6px">🧩 The same pupil entered twice</h2>' +
      (pairs.length ? '<p style="color:#8b93a7;margin:0 0 12px">Each pupil should exist once. The record <b>kept</b> is the one with the school-number id (it matches k12). The other record is removed after its awards are moved. <b>A backup file is downloaded first</b> and nothing is lost: old awards are only marked as voided.</p>' : '<p style="color:#34d399">No pupil is entered twice. 👍</p>') +
      pairs.map(function (pr, i) {
        var pre = pr.keep.archived && !pr.drop.archived ? 'copy' : 'keep';
        return '<div style="border-top:1px solid #1d2029;padding:12px 0" data-i="' + i + '"><div style="display:grid;grid-template-columns:1fr 1fr;gap:14px"><div><div style="color:#34d399;font-weight:800;margin-bottom:4px">KEEP</div>' + recInfo(pr.keep) + '</div><div><div style="color:#f87171;font-weight:800;margin-bottom:4px">REMOVE</div>' + recInfo(pr.drop) + '</div></div>' +
          '<div style="margin-top:10px;font-weight:700">Which XP should she/he have?</div>' +
          ['keep|' + (Number(pr.keep.xp) || 0) + ' XP of the KEEP record (its awards stay, the other record\'s awards are voided)', 'copy|' + (Number(pr.drop.xp) || 0) + ' XP of the REMOVE record (the awards of the KEEP record are voided, this record\'s awards move over)', 'sum|' + ((Number(pr.keep.xp) || 0) + (Number(pr.drop.xp) || 0)) + ' XP (both added together)'].map(function (o) {
            var v = o.split('|'); return '<label style="display:flex;gap:8px;align-items:center;margin:4px 0;font-size:13px"><input type="radio" name="mx' + i + '" value="' + v[0] + '"' + (v[0] === pre ? ' checked' : '') + '> ' + esc(v[1]) + '</label>'; }).join('') +
          '<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px"><button class="cc-plus cc-do" data-i="' + i + '" style="padding:9px 16px;background:#10b981;color:#06101f;font-weight:800">Merge and remove the copy</button></div><div class="cc-dim cc-m" id="cc-m' + i + '"></div></div>';
      }).join('') + '<div style="display:flex;justify-content:flex-end;margin-top:8px"><button class="cc-plus" id="cc-m-close" style="padding:9px 16px">Close</button></div></div>';
    document.body.appendChild(ovl);
    ovl.querySelector('#cc-m-close').onclick = function () { ovl.remove(); };
    [].forEach.call(ovl.querySelectorAll('.cc-do'), function (b) { b.onclick = function () { var i = +b.dataset.i, ch = (ovl.querySelector('input[name="mx' + i + '"]:checked') || {}).value || 'keep'; b.disabled = true; applyMerge(pairs[i], ch, ovl.querySelector('#cc-m' + i), ovl); }; });
  }
  function applyMerge(pr, choice, msg, ovl) {
    var st = S(), keep = pr.keep, drop = pr.drop, all = st.state.xpTransactions || [], now = new Date().toISOString(), note = 'Pupil entered twice: merged on ' + now.slice(0, 10);
    var keepTx = all.filter(function (t) { return t.studentId === keep.id; }), dropTx = all.filter(function (t) { return t.studentId === drop.id; });
    var chosen = choice === 'copy' ? (Number(drop.xp) || 0) : choice === 'sum' ? (Number(keep.xp) || 0) + (Number(drop.xp) || 0) : (Number(keep.xp) || 0);
    // 1. backup (a file and this browser)
    var backup = { at: now, choice: choice, keep: JSON.parse(JSON.stringify(keep)), drop: JSON.parse(JSON.stringify(drop)), keepTx: JSON.parse(JSON.stringify(keepTx)), dropTx: JSON.parse(JSON.stringify(dropTx)) };
    try { localStorage.setItem('eaa_merge_backup_' + Date.now(), JSON.stringify(backup)); } catch (e) { /* the file below is the main backup */ }
    try { var blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }), a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'merge-backup-' + normName(keep.firstName + ' ' + keep.lastName).replace(/ /g, '-') + '-' + Date.now() + '.json'; document.body.appendChild(a); a.click(); a.remove(); } catch (e) { /* no download */ }
    // 2. which awards stop counting, which move over
    var toVoid = (choice === 'copy' ? keepTx : choice === 'keep' ? dropTx : []).filter(function (t) { return t.status !== 'voided'; }), changed = [];
    toVoid.forEach(function (t) { t.status = 'voided'; t.isVoided = true; t.voidReason = note; t.voidedAt = now; changed.push(t); });
    dropTx.forEach(function (t) { t.studentId = keep.id; changed.indexOf(t) < 0 && changed.push(t); });
    var hist = {}; (keep.xpHistory || []).forEach(function (h) { hist[h.id] = 1; });
    var moved = (drop.xpHistory || []).filter(function (h) { return !hist[h.id]; }).map(function (h) { if (choice === 'keep') { h.status = 'voided'; h.isVoided = true; h.voidReason = note; } return h; });
    keep.xpHistory = (keep.xpHistory || []).concat(moved);
    if (choice === 'copy') (keep.xpHistory || []).forEach(function (h) { if (toVoid.some(function (t) { return t.id === h.id; })) { h.status = 'voided'; h.isVoided = true; h.voidReason = note; } });
    // 3. the kept record: active, the right school number, and the chosen XP (a small correction award lines the award history up with it)
    keep.archived = false;
    var mnum = /-(\d+)$/.exec(String(keep.id)); if (mnum) keep.studentIdNumber = mnum[1];
    var ledger = all.filter(function (t) { return t.studentId === keep.id && t.status !== 'voided'; }).reduce(function (sum, t) { return sum + (Number(t.amount) || 0); }, 0);
    keep.xp = Math.max(0, ledger); keep.totalXP = keep.xp;
    var before = all.length; st.setStudentXP(keep.id, chosen, 'Merge of the same pupil entered twice');
    all.slice(before).forEach(function (t) { changed.push(t); });
    st.saveState();
    // 4. the cloud: awards first, then the pupil, then the removal of the copy (the copy is only removed if the cloud accepted the awards)
    try { localStorage.setItem('eaa_redate_pending', JSON.stringify(changed.map(function (t) { return t.id; }))); } catch (e) { /* the banner just will not come back */ }
    msg.textContent = 'Saving ' + changed.length + ' awards to the cloud…';
    saveRedateToCloud(changed).then(function () {
      var A = root.AdventureSupabase; return A && A.saveStudent ? A.saveStudent(keep) : null;
    }).then(function () {
      st.deleteStudent(drop.id);
      msg.innerHTML = '<span style="color:#34d399">✓ Merged. ' + esc(keep.firstName) + ' now has ' + (Number(keep.xp) || 0) + ' XP and exists once. The copy is removed.</span>';
      setTimeout(function () { ovl.remove(); if (root.renderCurrentView) root.renderCurrentView(); }, 2200);
    }, function (e) {
      msg.innerHTML = '<span style="color:#fbbf24">Merged on this computer, but the cloud did not answer (' + esc((e && e.message) || 'no answer') + '). The copy was NOT removed yet. Check the internet and press the button again.</span>';
    });
  }
  api.mergeDuplicates = mergeModal;

  api.supportGet = supportGet;
  api.supportSet = function (id, patch) { var o = supportSet(id, patch); if (patch && 'on' in patch) { try { current = rowsFor(S().getActiveClass()); refreshAll(); } catch (e) { /* the table updates next time */ } } return o; };
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
