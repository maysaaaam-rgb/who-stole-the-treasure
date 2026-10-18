/* Teacher calendar (sidebar: 📅 Calendar). Month and Week views of: the lessons of every class (from the weekly timetable, or the k12 timetable until it is set),
   the plan of the week (Unit 4, Alice, quizzes), birthdays (first names only), meetings and anything the teacher adds.
   Events are kept in the Classroom Store settings, so they sync to the cloud like the timetable. No pupil names are stored in events. */
(function (root) {
  'use strict';
  var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var TYPES = {
    lesson: ['📖', 'Lesson', '#94a3b8'], unit4: ['📘', 'Unit 4', '#38bdf8'], alice: ['🫖', 'Alice', '#f472b6'], quiz: ['📝', 'Quiz', '#f59e0b'],
    birthday: ['🎂', 'Birthday', '#34d399'], meeting: ['👥', 'Meeting', '#a78bfa'], task: ['✅', 'To do', '#fb923c'], other: ['📌', 'Other', '#cbd5e1']
  };
  // k12 timetable (19-23 Oct 2026; the same every week): classId -> weekday (1=Mon) -> start times
  var K12 = {
    'class-3a': { 1: ['13:30', '14:15'], 2: ['10:30', '11:15'], 4: ['09:45'], 5: ['10:30', '11:15'] },
    'class-3b': { 1: ['16:05'], 3: ['10:30', '11:15'], 4: ['10:30', '11:15'], 5: ['09:00', '09:45'] },
    'class-4a': { 1: ['10:30', '11:15'], 2: ['15:20'], 3: ['14:15', '15:20'], 4: ['16:05', '16:55'] },
    'class-4b': { 1: ['09:45'], 2: ['09:00', '09:45'], 3: ['12:45', '13:30'], 5: ['14:15', '15:20'] }
  };
  // the plan of the week 19-23 Oct (added once to the calendar; every entry can be edited or deleted)
  var SEED = [
    ['2026-10-19', '13:30', 'class-3a', 'unit4', 'Unit 4 · lesson 1'], ['2026-10-19', '14:15', 'class-3a', 'unit4', 'Unit 4 · lesson 2'], ['2026-10-20', '10:30', 'class-3a', 'unit4', 'Unit 4 · lesson 3'], ['2026-10-20', '11:15', 'class-3a', 'unit4', 'Unit 4 · lesson 4'],
    ['2026-10-22', '09:45', 'class-3a', 'unit4', 'Unit 4 · lesson 5'], ['2026-10-23', '10:30', 'class-3a', 'unit4', 'Unit 4 · review game'], ['2026-10-23', '11:15', 'class-3a', 'quiz', 'Unit 4 QUIZ (print the sheets)'],
    ['2026-10-19', '16:05', 'class-3b', 'unit4', 'Unit 4 · lesson 1'], ['2026-10-21', '10:30', 'class-3b', 'unit4', 'Unit 4 · lesson 2'], ['2026-10-21', '11:15', 'class-3b', 'unit4', 'Unit 4 · lesson 3'], ['2026-10-22', '10:30', 'class-3b', 'unit4', 'Unit 4 · lesson 4'],
    ['2026-10-22', '11:15', 'class-3b', 'unit4', 'Unit 4 · lesson 5'], ['2026-10-23', '09:00', 'class-3b', 'unit4', 'Unit 4 · review game'], ['2026-10-23', '09:45', 'class-3b', 'quiz', 'Unit 4 QUIZ (print the sheets)'],
    ['2026-10-19', '10:30', 'class-4a', 'unit4', 'U4-1 Team Players: Think-Pair-Share, sports words, Sparks story (book pp. 56-61)'], ['2026-10-19', '11:15', 'class-4a', 'alice', 'Alice 1 · phrases'], ['2026-10-20', '15:20', 'class-4a', 'unit4', 'U4-2 Reading 1: Teamwork Makes the Dream Work + spelling or (pp. 58-60)'], ['2026-10-21', '14:15', 'class-4a', 'alice', 'Alice 2 · pairs by heart'],
    ['2026-10-21', '15:20', 'class-4a', 'unit4', 'U4-3 Reading 2: Late for the Show, the play (pp. 61-70)'], ['2026-10-22', '16:05', 'class-4a', 'alice', 'Alice 3 · dress rehearsal'], ['2026-10-22', '16:55', 'class-4a', 'quiz', 'U4-4 Think Together (p. 71) + review + QUIZ'],
    ['2026-10-19', '09:45', 'class-4b', 'alice', 'Alice 1 · phrases'], ['2026-10-20', '09:00', 'class-4b', 'unit4', 'U4-1 Team Players: Think-Pair-Share, sports words, Sparks story (book pp. 56-61)'], ['2026-10-20', '09:45', 'class-4b', 'unit4', 'U4-2 Reading 1: Teamwork Makes the Dream Work + spelling or (pp. 58-60)'], ['2026-10-21', '12:45', 'class-4b', 'alice', 'Alice 2 · pairs by heart'],
    ['2026-10-21', '13:30', 'class-4b', 'unit4', 'U4-3 Reading 2: Late for the Show, the play (pp. 61-70)'], ['2026-10-23', '14:15', 'class-4b', 'alice', 'Alice 3 · dress rehearsal'], ['2026-10-23', '15:20', 'class-4b', 'quiz', 'U4-4 Think Together (p. 71) + review + QUIZ'],
    ['2026-10-19', '', '', 'task', 'Post Alice practice 3 on k12 and print the parent note'], ['2026-10-24', '', '', 'meeting', 'English parent meeting (individual, 10 minutes each)'], ['2026-10-25', '', '', 'alice', 'Alice Tea Party (date to be confirmed)']
  ];
  var st = { y: 0, m: 0, mode: 'month', cls: 'all', sel: '', wk: '' };
  function S() { return root.schoolStore || root.store; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parse(s) { var p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function monday(d) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; }
  function classes() { return (S().getClasses ? S().getClasses() : []).filter(function (c) { return !c.archived; }); }
  function shortName(id) { var c = (S().getClass ? S().getClass(id) : null); return c ? String(c.name || id).replace(/^Grade\s*/i, '') : String(id).replace('class-', '').toUpperCase(); }

  // ---------------------------------------------------------------- data
  function store() { return root.ClassroomStore; }
  function customEvents() { try { return (store() && store().getCalendar && store().getCalendar()) || []; } catch (e) { return []; } }
  function saveEvents(list) { try { store().setCalendar(list); } catch (e) { alert('Could not save the calendar.'); } }
  function seedOnce() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed1')) return;
      var list = customEvents().slice();
      SEED.forEach(function (r, i) { list.push({ id: 'seed1-' + i, date: r[0], time: r[1], classId: r[2], type: r[3], title: r[4], note: '' }); });
      saveEvents(list); store().setCalendarFlag('seed1');
    } catch (e) { /* the calendar still works without the seed */ }
  }
  function retitleOnce() {
    try {
      if (!store() || !store().getCalendarFlag || store().getCalendarFlag('seed2')) return;
      var M = {'class-4a|2026-10-19|10:30': 'U4-1 Team Players: Think-Pair-Share, sports words, Sparks story (book pp. 56-61)', 'class-4a|2026-10-20|15:20': 'U4-2 Reading 1: Teamwork Makes the Dream Work + spelling or (pp. 58-60)', 'class-4a|2026-10-21|15:20': 'U4-3 Reading 2: Late for the Show, the play (pp. 61-70)', 'class-4a|2026-10-22|16:55': 'U4-4 Think Together (p. 71) + review + QUIZ', 'class-4b|2026-10-20|09:00': 'U4-1 Team Players: Think-Pair-Share, sports words, Sparks story (book pp. 56-61)', 'class-4b|2026-10-20|09:45': 'U4-2 Reading 1: Teamwork Makes the Dream Work + spelling or (pp. 58-60)', 'class-4b|2026-10-21|13:30': 'U4-3 Reading 2: Late for the Show, the play (pp. 61-70)', 'class-4b|2026-10-23|15:20': 'U4-4 Think Together (p. 71) + review + QUIZ'}, list = customEvents().slice(), n = 0;
      list.forEach(function (e) { var k = e.classId + '|' + e.date + '|' + e.time; if (/^seed1-/.test(e.id) && M[k] && /^Unit 4 /.test(e.title)) { e.title = M[k]; n++; } });
      if (n) saveEvents(list); store().setCalendarFlag('seed2');
    } catch (e) { /* ignore */ }
  }
  function lessonsOn(date, classId) {
    var wd = date.getDay(); if (wd < 1 || wd > 5) return [];
    var out = [], tt = (store() && store().getTimetable && store().getTimetable()) || {}, hasTT = Object.keys(tt).some(function (k) { return Object.keys(tt[k] || {}).some(function (d) { return (tt[k][d] || []).length; }); });
    classes().forEach(function (c) {
      if (classId !== 'all' && c.id !== classId) return;
      if (hasTT && tt[c.id]) (tt[c.id][wd] || []).forEach(function (e) { out.push({ type: 'lesson', time: e.t || '', classId: c.id, title: (e.x || (e.l && root.Timetable && root.Timetable.titleOf ? root.Timetable.titleOf(e.l) : '') || 'English') }); });
      else (K12[c.id] && K12[c.id][wd] || []).forEach(function (t) { out.push({ type: 'lesson', time: t, classId: c.id, title: 'English' }); });
    });
    return out;
  }
  function eventsOn(date) {
    var key = ymd(date), out = [], seen = {};
    customEvents().forEach(function (e) { if (e.date === key && (st.cls === 'all' || !e.classId || e.classId === st.cls)) { out.push(e); if (e.classId && e.time) seen[e.classId + '|' + e.time] = 1; } });
    lessonsOn(date, st.cls).forEach(function (l) { if (!seen[l.classId + '|' + l.time]) out.push(l); });
    try {
      if (root.Birthday && root.Birthday.known) root.Birthday.known().forEach(function (x) {
        var p = String(x.md).split('-'); if (+p[0] === date.getMonth() + 1 && +p[1] === date.getDate() && (st.cls === 'all' || x.s.classId === st.cls)) out.push({ type: 'birthday', time: '', classId: x.s.classId, title: (x.s.firstName || x.s.name || 'Pupil') + '’s birthday' });
      });
    } catch (e) { /* no birthdays */ }
    return out.sort(function (a, b) { return String(a.time || '99').localeCompare(String(b.time || '99')) || String(a.title).localeCompare(String(b.title)); });
  }

  // ---------------------------------------------------------------- drawing
  var CSS = '' +
    '.cal{color:#e6e8ee;max-width:1180px;margin:0 auto;padding:6px 4px 90px}.cal h1{margin:0;font-size:1.5rem}.cal .sub{color:#8b93a7;font-size:.9rem}' +
    '.cal-top{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:8px 0 12px}.cal-b{border:0;border-bottom:4px solid #0c4a6e;background:#0369a1;color:#fff;font:700 .9rem inherit;border-radius:12px;padding:8px 14px;cursor:pointer}.cal-b:active{transform:translateY(3px);border-bottom-width:1px}' +
    '.cal-b.g{background:#334155;border-bottom-color:#1e293b}.cal-b.on{background:#f59e0b;border-bottom-color:#92400e;color:#1c1203}.cal-b.ok{background:#10b981;border-bottom-color:#065f46;color:#06101f}' +
    '.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}.cal-dow{color:#8b93a7;font-weight:800;font-size:.8rem;text-align:center;padding:4px}' +
    '.cal-cell{min-height:104px;background:rgba(15,23,42,.8);border:1px solid #232a3b;border-radius:12px;padding:6px;cursor:pointer;overflow:hidden}.cal-cell:hover{border-color:#38bdf8}' +
    '.cal-cell.off{opacity:.45}.cal-cell.today{border-color:#f59e0b;box-shadow:0 0 0 2px rgba(245,158,11,.25)}.cal-cell.sel{border-color:#a78bfa;background:rgba(76,29,149,.25)}.cal-cell b{font-size:.85rem}' +
    '.cal-ev{display:block;font-size:.72rem;line-height:1.25;border-radius:6px;padding:2px 5px;margin-top:3px;color:#0b0d13;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cal-more{font-size:.7rem;color:#8b93a7;margin-top:3px}' +
    '.cal-side{background:rgba(15,23,42,.85);border:1px solid #232a3b;border-radius:16px;padding:14px;margin-top:14px}.cal-row{display:flex;gap:10px;align-items:flex-start;padding:7px 0;border-bottom:1px solid #1d2433;font-size:.92rem}' +
    '.cal-tag{flex:none;border-radius:8px;padding:1px 8px;font-size:.75rem;font-weight:800;color:#0b0d13}.cal-t{flex:none;width:48px;color:#38bdf8;font-weight:800}.cal-x{margin-left:auto;background:none;border:0;color:#8b93a7;cursor:pointer;font-size:1rem}' +
    '.cal-wk{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.cal-wk .cal-cell{min-height:260px}.cal-wk .cal-ev{white-space:normal;font-size:.76rem}' +
    '.cal-legend{display:flex;gap:10px;flex-wrap:wrap;font-size:.78rem;color:#cbd5e1;margin:6px 0 12px}.cal-legend span i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:4px}' +
    '.cal-form{display:grid;gap:8px;grid-template-columns:1fr 1fr}.cal-form label{font-size:.8rem;color:#8b93a7;display:block}.cal-form input,.cal-form select,.cal-form textarea{width:100%;background:#0b0d13;color:#e6e8ee;border:1px solid #2a2f3d;border-radius:10px;padding:8px;font:inherit}' +
    '@media(max-width:800px){.cal-grid{gap:3px}.cal-cell{min-height:70px;padding:3px}.cal-ev{font-size:.62rem}.cal-wk{grid-template-columns:1fr}}';
  function css() { if (!document.getElementById('cal-css')) { var s = document.createElement('style'); s.id = 'cal-css'; s.textContent = CSS; document.head.appendChild(s); } }
  function evHtml(e) {
    var T = TYPES[e.type] || TYPES.other, cl = e.classId ? shortName(e.classId) + ' ' : '';
    return '<span class="cal-ev" style="background:' + T[2] + '" title="' + esc((e.time ? e.time + ' ' : '') + cl + e.title) + '">' + T[0] + ' ' + (e.time ? esc(e.time) + ' ' : '') + esc(cl) + esc(e.title) + '</span>';
  }
  function head(box) {
    var cl = classes();
    var label = st.mode === 'month' ? MON[st.m] + ' ' + st.y : (function () { var a = parse(st.wk), b = new Date(a); b.setDate(b.getDate() + 4); return a.getDate() + ' ' + MON[a.getMonth()].slice(0, 3) + ' – ' + b.getDate() + ' ' + MON[b.getMonth()].slice(0, 3) + ' ' + b.getFullYear(); })();
    return '<h1>📅 Calendar</h1><div class="sub">Your lessons, the plan of the week, quizzes, birthdays and meetings in one place.</div>' +
      '<div class="cal-top"><button class="cal-b g" onclick="CalendarView.step(-1)">◀</button><b style="font-size:1.15rem;min-width:170px;text-align:center">' + label + '</b><button class="cal-b g" onclick="CalendarView.step(1)">▶</button>' +
      '<button class="cal-b g" onclick="CalendarView.today()">Today</button>' +
      '<button class="cal-b ' + (st.mode === 'month' ? 'on' : 'g') + '" onclick="CalendarView.mode(\'month\')">Month</button><button class="cal-b ' + (st.mode === 'week' ? 'on' : 'g') + '" onclick="CalendarView.mode(\'week\')">Week</button>' +
      '<span style="flex:1"></span><button class="cal-b ok" onclick="CalendarView.edit(\'\')">+ Add event</button></div>' +
      '<div class="cal-top" style="margin-top:0"><button class="cal-b ' + (st.cls === 'all' ? 'on' : 'g') + '" onclick="CalendarView.cls(\'all\')">All classes</button>' +
      cl.map(function (c) { return '<button class="cal-b ' + (st.cls === c.id ? 'on' : 'g') + '" onclick="CalendarView.cls(\'' + esc(c.id) + '\')">' + esc(shortName(c.id)) + '</button>'; }).join('') + '</div>' +
      '<div class="cal-legend">' + Object.keys(TYPES).map(function (k) { return '<span><i style="background:' + TYPES[k][2] + '"></i>' + TYPES[k][1] + '</span>'; }).join('') + '</div>';
  }
  function monthHtml() {
    var first = new Date(st.y, st.m, 1), start = monday(first), todayKey = ymd(new Date()), cells = '';
    for (var i = 0; i < 42; i++) {
      var d = new Date(start); d.setDate(start.getDate() + i);
      if (i >= 35 && d.getMonth() !== st.m) break;
      var evs = eventsOn(d), key = ymd(d);
      cells += '<div class="cal-cell' + (d.getMonth() !== st.m ? ' off' : '') + (key === todayKey ? ' today' : '') + (key === st.sel ? ' sel' : '') + '" onclick="CalendarView.pick(\'' + key + '\')"><b>' + d.getDate() + '</b>' + evs.slice(0, 3).map(evHtml).join('') + (evs.length > 3 ? '<div class="cal-more">+' + (evs.length - 3) + ' more</div>' : '') + '</div>';
    }
    return '<div class="cal-grid">' + DOW.map(function (x) { return '<div class="cal-dow">' + x + '</div>'; }).join('') + cells + '</div>';
  }
  function weekHtml() {
    var a = parse(st.wk), todayKey = ymd(new Date()), cells = '';
    for (var i = 0; i < 5; i++) {
      var d = new Date(a); d.setDate(a.getDate() + i); var key = ymd(d);
      cells += '<div class="cal-cell' + (key === todayKey ? ' today' : '') + (key === st.sel ? ' sel' : '') + '" onclick="CalendarView.pick(\'' + key + '\')"><b>' + DOW[i] + ' ' + d.getDate() + '</b>' + eventsOn(d).map(evHtml).join('') + '</div>';
    }
    return '<div class="cal-wk">' + cells + '</div>';
  }
  function sideHtml() {
    if (!st.sel) return '<div class="cal-side" style="color:#8b93a7">Tap a day to see everything on it, add an event, or open a lesson.</div>';
    var d = parse(st.sel), evs = eventsOn(d);
    return '<div class="cal-side"><div style="display:flex;align-items:center;gap:10px"><b style="font-size:1.05rem">' + d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + '</b><span style="flex:1"></span><button class="cal-b ok" onclick="CalendarView.edit(\'\',\'' + st.sel + '\')">+ Add event</button></div>' +
      (evs.length ? evs.map(function (e) {
        var T = TYPES[e.type] || TYPES.other, mine = !!e.id;
        return '<div class="cal-row"><span class="cal-t">' + esc(e.time || '') + '</span><span class="cal-tag" style="background:' + T[2] + '">' + T[0] + ' ' + T[1] + '</span><span><b>' + (e.classId ? esc(shortName(e.classId)) + ' · ' : '') + esc(e.title) + '</b>' + (e.note ? '<div style="color:#8b93a7;font-size:.82rem">' + esc(e.note) + '</div>' : '') + '</span>' +
          (mine ? '<button class="cal-x" title="Edit" onclick="CalendarView.edit(\'' + esc(e.id) + '\')">✏️</button><button class="cal-x" style="margin-left:0" title="Delete" onclick="CalendarView.del(\'' + esc(e.id) + '\')">🗑️</button>' : '') + '</div>';
      }).join('') : '<div style="color:#8b93a7;padding:10px 0">Nothing on this day.</div>') + '</div>';
  }
  function draw() {
    var box = document.getElementById('cal-root'); if (!box) return;
    var noTT = !(store() && store().getTimetable && Object.keys(store().getTimetable() || {}).some(function (k) { return Object.keys(store().getTimetable()[k] || {}).some(function (d) { return (store().getTimetable()[k][d] || []).length; }); }));
    box.innerHTML = head() + (noTT ? '<div class="cal-side" style="margin:0 0 10px;color:#fde68a">Your lessons come from the k12 timetable. <button class="cal-b" onclick="CalendarView.saveTimetable()">Save it as my weekly timetable</button> <span style="color:#8b93a7;font-size:.85rem">(the Class Board and the dashboard then show today’s lessons)</span></div>' : '') +
      (st.mode === 'month' ? monthHtml() : weekHtml()) + sideHtml();
  }

  // ---------------------------------------------------------------- actions
  function edit(id, date) {
    var list = customEvents(), e = id ? list.filter(function (x) { return x.id === id; })[0] : null; e = e || { date: date || st.sel || ymd(new Date()), time: '', classId: st.cls === 'all' ? '' : st.cls, type: 'task', title: '', note: '' };
    var old = document.getElementById('cal-modal'); if (old) old.remove();
    var m = document.createElement('div'); m.id = 'cal-modal'; m.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(2,6,23,.7);display:flex;align-items:center;justify-content:center;padding:14px';
    m.innerHTML = '<div class="cal" style="background:#0f172a;border:1px solid #334155;border-radius:18px;padding:18px;width:min(560px,96vw);max-height:92vh;overflow:auto"><h2 style="margin:0 0 10px;font-size:1.2rem">' + (id ? 'Edit event' : 'New event') + '</h2><div class="cal-form">' +
      '<div style="grid-column:1/3"><label>What</label><input id="cal-f-title" value="' + esc(e.title) + '" placeholder="Quiz for 4/A, parent meeting, bring props…"></div>' +
      '<div><label>Day</label><input id="cal-f-date" type="date" value="' + esc(e.date) + '"></div><div><label>Time (optional)</label><input id="cal-f-time" type="time" value="' + esc(e.time) + '"></div>' +
      '<div><label>Class</label><select id="cal-f-cls"><option value="">All / none</option>' + classes().map(function (c) { return '<option value="' + esc(c.id) + '"' + (e.classId === c.id ? ' selected' : '') + '>' + esc(shortName(c.id)) + '</option>'; }).join('') + '</select></div>' +
      '<div><label>Type</label><select id="cal-f-type">' + Object.keys(TYPES).filter(function (k) { return k !== 'birthday'; }).map(function (k) { return '<option value="' + k + '"' + (e.type === k ? ' selected' : '') + '>' + TYPES[k][0] + ' ' + TYPES[k][1] + '</option>'; }).join('') + '</select></div>' +
      '<div style="grid-column:1/3"><label>Note (optional)</label><textarea id="cal-f-note" rows="3">' + esc(e.note) + '</textarea></div></div>' +
      '<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:12px"><button class="cal-b g" id="cal-f-no">Cancel</button><button class="cal-b ok" id="cal-f-ok">Save</button></div></div>';
    document.body.appendChild(m);
    m.querySelector('#cal-f-no').onclick = function () { m.remove(); };
    m.querySelector('#cal-f-ok').onclick = function () {
      var t = m.querySelector('#cal-f-title').value.trim(), dt = m.querySelector('#cal-f-date').value; if (!t || !dt) { m.querySelector('#cal-f-title').style.borderColor = '#f87171'; return; }
      var rec = { id: e.id || ('ev-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6)), date: dt, time: m.querySelector('#cal-f-time').value, classId: m.querySelector('#cal-f-cls').value, type: m.querySelector('#cal-f-type').value, title: t, note: m.querySelector('#cal-f-note').value.trim() };
      var all = customEvents().filter(function (x) { return x.id !== rec.id; }); all.push(rec); saveEvents(all); st.sel = dt; m.remove(); draw();
    };
  }
  function del(id) { if (!confirm('Delete this event?')) return; saveEvents(customEvents().filter(function (x) { return x.id !== id; })); draw(); }
  function saveTimetable() {
    try {
      var tt = {}; classes().forEach(function (c) { if (!K12[c.id]) return; tt[c.id] = {}; Object.keys(K12[c.id]).forEach(function (d) { tt[c.id][d] = K12[c.id][d].map(function (t) { return { t: t, x: 'English' }; }); }); });
      store().setTimetable(tt); draw();
    } catch (e) { alert('Could not save the timetable.'); }
  }
  function render(container) {
    css(); var now = new Date(); if (!st.y) { st.y = now.getFullYear(); st.m = now.getMonth(); st.wk = ymd(monday(now)); st.sel = ymd(now); }
    seedOnce(); retitleOnce();
    container.innerHTML = '<div class="cal" id="cal-root"></div>'; draw();
  }
  root.renderCalendarView = render;
  root.CalendarView = {
    step: function (n) { if (st.mode === 'month') { var d = new Date(st.y, st.m + n, 1); st.y = d.getFullYear(); st.m = d.getMonth(); } else { var w = parse(st.wk); w.setDate(w.getDate() + 7 * n); st.wk = ymd(w); } draw(); },
    today: function () { var n = new Date(); st.y = n.getFullYear(); st.m = n.getMonth(); st.wk = ymd(monday(n)); st.sel = ymd(n); draw(); },
    mode: function (m) { st.mode = m; if (m === 'week' && st.sel) st.wk = ymd(monday(parse(st.sel))); draw(); },
    cls: function (c) { st.cls = c; draw(); },
    pick: function (k) { st.sel = k; draw(); },
    edit: edit, del: del, saveTimetable: saveTimetable
  };
})(typeof window !== 'undefined' ? window : this);
