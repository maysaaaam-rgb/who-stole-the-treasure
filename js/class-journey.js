/* Where we are (teacher only): for each class the last lesson (done or not), what the class still finds hard, the next lesson with what to print,
   and a short "where we stopped" note. A Today tab lists every lesson of the day in order with its buttons.
   Lessons come from the calendar (ClassroomStore calendar entries) and the weekly timetable; hard questions come from the Game Maker
   revision records (eaa_revision_v1, the answer-card counts and exit tickets). Done marks and notes are kept in eaa_journey_v1 and in one
   private cloud row ('class-journey-sync'); nothing here touches XP, coins or pupil data, and nothing is shown on the class board. */
(function (root) {
  'use strict';
  var KEY = 'eaa_journey_v1', REV = 'eaa_revision_v1', CLOUD_ID = 'class-journey-sync';
  /* k12 timetable, used when no weekly timetable is saved (weekday 1 = Monday) */
  var K12 = {
    'class-3a': { 1: ['13:30', '14:15'], 2: ['10:30', '11:15'], 4: ['09:45'], 5: ['10:30', '11:15'] },
    'class-3b': { 1: ['16:05'], 3: ['10:30', '11:15'], 4: ['10:30', '11:15'], 5: ['09:00', '09:45'] },
    'class-4a': { 1: ['10:30', '11:15'], 2: ['15:20'], 3: ['14:15', '15:20'], 4: ['16:05', '16:55'] },
    'class-4b': { 1: ['09:45'], 2: ['09:00', '09:45'], 3: ['12:45', '13:30'], 5: ['14:15', '15:20'] }
  };
  /* school days off, and half days (no lessons from that time) */
  var OFF = { '2026-10-29': 'Republic Day', '2027-01-01': 'New Year’s Day' }, HALF = { '2026-10-28': '12:00' };
  var LESSON_MIN = 40;

  function S() { return root.schoolStore || root.store; }
  function CS() { return root.ClassroomStore; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parse(s) { var p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function mins(t) { var p = String(t || '').split(':'); return p.length > 1 ? (+p[0]) * 60 + (+p[1]) : 0; }
  function nice(dk) { return parse(dk).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); }
  function classes() {
    var all = (S() && S().getClasses ? S().getClasses() : []).filter(function (c) { return !c.archived && K12[c.id]; });
    return all.length ? all : Object.keys(K12).map(function (id) { return { id: id, name: id.replace('class-', '').toUpperCase() }; });
  }
  function shortName(id) { var c = S() && S().getClass ? S().getClass(id) : null; return c ? String(c.name || id).replace(/^Grade\s*/i, '') : String(id).replace('class-', '').toUpperCase(); }

  /* ---- my marks and notes ---- */
  function load() { try { var d = JSON.parse(localStorage.getItem(KEY) || 'null'); if (d && d.v === 1) { d.marks = d.marks || {}; d.notes = d.notes || {}; return d; } } catch (e) { /* new */ } return { v: 1, marks: {}, notes: {} }; }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* not remembered */ } schedulePush(); }
  function keyOf(l) { return l.classId + '|' + l.date + '|' + l.time; }

  /* ---- the lessons of a class (calendar entries first, then plain timetable slots) ---- */
  function calendar() { try { return (CS() && CS().getCalendar && CS().getCalendar()) || []; } catch (e) { return []; } }
  function timetable() { try { return (CS() && CS().getTimetable && CS().getTimetable()) || {}; } catch (e) { return {}; } }
  /* planned lessons on a day off or after a half-day cut-off stay in the list as cancelled (so they are owed); plain timetable slots are dropped */
  function lessonsOn(dk, classId) {
    var d = parse(dk), wd = d.getDay(), out = [], seen = {}, half = HALF[dk] ? mins(HALF[dk]) : 0;
    calendar().forEach(function (e) {
      if (e.date !== dk || !e.time || (classId && e.classId !== classId) || !e.classId || !K12[e.classId] || e.type === 'birthday') return;
      out.push({ classId: e.classId, date: dk, time: e.time, title: e.title || 'English', note: e.note || '', type: e.type || '', planned: true }); seen[e.classId + '|' + e.time] = 1;
    });
    if (wd >= 1 && wd <= 5) {
      var tt = timetable(), hasTT = Object.keys(tt).some(function (k) { return Object.keys(tt[k] || {}).some(function (x) { return (tt[k][x] || []).length; }); });
      Object.keys(K12).forEach(function (cid) {
        if (classId && cid !== classId) return;
        var slots = hasTT && tt[cid] ? (tt[cid][wd] || []).map(function (x) { return { t: x.t || '', x: x.x || 'English' }; }) : (K12[cid][wd] || []).map(function (t) { return { t: t, x: 'English' }; });
        slots.forEach(function (s) { if (s.t && !seen[cid + '|' + s.t]) out.push({ classId: cid, date: dk, time: s.t, title: s.x, note: '', type: 'lesson', planned: false }); });
      });
    }
    out = out.filter(function (l) {
      var off = OFF[dk] || (half && mins(l.time) >= half);
      if (off && l.planned) l.cancelled = OFF[dk] ? OFF[dk] : 'half day';
      return !off || l.planned;
    });
    return out.sort(function (a, b) { return mins(a.time) - mins(b.time); });
  }
  function range(classId, from, days) {
    var out = [], d = parse(from);
    for (var i = 0; i < days; i++) { var x = new Date(d); x.setDate(d.getDate() + i); out = out.concat(lessonsOn(ymd(x), classId)); }
    return out;
  }
  function isPast(l, now) { now = now || new Date(); var dk = ymd(now); return l.date < dk || (l.date === dk && mins(l.time) + LESSON_MIN <= now.getHours() * 60 + now.getMinutes()); }
  function isNow(l, now) { now = now || new Date(); var m = now.getHours() * 60 + now.getMinutes(); return l.date === ymd(now) && mins(l.time) <= m && m < mins(l.time) + LESSON_MIN; }

  /* ---- links written in a calendar note (same idea as the calendar's buttons) ---- */
  function linksOf(l) {
    var txt = (l.title || '') + ' ' + (l.note || ''), out = [], seen = {}, m;
    var re = /(?:^|[\s(:,])((?:lesson-plans\/[A-Za-z0-9_.-]+)|(?:[a-z0-9][a-z0-9-]*\/[A-Za-z0-9_.\/-]*\.(?:html|pdf)(?:\?[A-Za-z0-9_=&.-]*)?))/g;
    while ((m = re.exec(txt))) {
      var u = m[1].replace(/[.,;]+$/, '');
      if (u === 'alice-party-print/index.html') u = 'alice-party/index.html';
      if (/^lesson-plans\//.test(u) && !/\.(pdf|docx)$/.test(u)) u += '.pdf';
      if (seen[u]) continue; seen[u] = 1;
      out.push([/^lesson-plans\//.test(u) ? '📋 Plan' : /\.pdf$/.test(u) ? '🖨️ Print' : /^game-maker\//.test(u) ? '🎮 Game' : '▶ Open', u]);
    }
    var ck = (/class-(\w+)/.exec(l.classId || '') || [])[1];
    if (ck && /Alice rehearsal/i.test(txt) && !seen.al) out.push(['▶ Open', 'alice-party-rehearsal/index.html?class=' + ck + '&lesson=3']);
    var rank = { '▶ Open': 0, '🎮 Game': 1, '🖨️ Print': 2, '📋 Plan': 3 };
    return out.sort(function (a, b) { return rank[a[0]] - rank[b[0]]; });
  }

  /* ---- what the class still finds hard (Game Maker answer cards and exit tickets) ---- */
  function hard(classId) {
    var d = null; try { d = JSON.parse(localStorage.getItem(REV) || 'null'); } catch (e) { d = null; }
    if (!d || d.v !== 1 || !d.cls || !d.items) return [];
    var c = d.cls[classId] || {}, out = [];
    Object.keys(c).forEach(function (k) { var r = c[k]; if (r && r.n && d.items[k]) out.push({ q: d.items[k].q, a: d.items[k].a, pct: Math.round(r.s / r.n * 100), n: r.n, t: r.t || 0 }); });
    return out.filter(function (x) { return x.pct < 70; }).sort(function (a, b) { return a.pct - b.pct || b.t - a.t; });
  }

  /* ---- cloud copy: one private row, merged mark by mark (newest wins) ---- */
  function client() { var A = root.AdventureSupabase; if (!A || !A.isConfigured) return null; try { return A.client || (A._ensureClient && A._ensureClient()) || null; } catch (e) { return null; } }
  function merge(a, b) {
    ['marks', 'notes'].forEach(function (w) { Object.keys((b && b[w]) || {}).forEach(function (k) { var x = a[w][k], y = b[w][k]; if (y && (!x || (y.t || 0) > (x.t || 0))) a[w][k] = y; }); });
    return a;
  }
  var pushTimer = 0, cloudMsg = '';
  async function sync() {
    var c = client(); if (!c) { cloudMsg = '💾 On this computer only'; return false; }
    try {
      var res = await c.from('classes').select('description').eq('id', CLOUD_ID).maybeSingle();
      if (res && res.error) throw res.error;
      var remote = null; try { remote = res && res.data && res.data.description ? JSON.parse(res.data.description) : null; } catch (e) { remote = null; }
      var merged = merge(load(), remote && remote.v === 1 ? remote : {});
      try { localStorage.setItem(KEY, JSON.stringify(merged)); } catch (e) { /* ignore */ }
      var up = await c.from('classes').upsert({ id: CLOUD_ID, name: 'Where We Are Sync', grade: 'System', teacher: 'System', description: JSON.stringify(merged), archived: true, updated_at: new Date().toISOString() }, { onConflict: 'id' });
      if (up && up.error) throw up.error;
      /* the Game Maker records too, so the hard questions from the smartboard reach this computer */
      if (root.RevisionBoard && root.RevisionBoard.sync) { try { await root.RevisionBoard.sync(); } catch (e) { /* later */ } }
      cloudMsg = '☁ Saved in the cloud'; return true;
    } catch (e) { cloudMsg = '⚠ Cloud not reached, kept on this computer'; return false; }
  }
  function schedulePush() { if (pushTimer) clearTimeout(pushTimer); pushTimer = setTimeout(function () { pushTimer = 0; sync().then(redraw); }, 1500); }

  /* ---- drawing ---- */
  var tab = 'today', ovl = null;
  function css() {
    if (document.getElementById('wj-css')) return;
    var st = document.createElement('style'); st.id = 'wj-css';
    st.textContent = '.wj-ovl{position:fixed;inset:0;z-index:9500;background:rgba(2,6,15,.78);backdrop-filter:blur(6px);display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:20px 12px}' +
      '.wj{width:100%;max-width:980px;background:rgba(15,23,42,.96);border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:18px 20px 22px;color:#e5edff;font-family:inherit;box-shadow:0 4px 24px rgba(0,0,0,.5)}' +
      '.wj h2{margin:0;font-size:1.35rem}.wj h3{margin:0 0 8px;font-size:1rem;color:#38bdf8}.wj .dim{opacity:.72;font-size:.86rem}' +
      '.wj-tabs{display:flex;gap:6px;flex-wrap:wrap;margin:12px 0 14px}.wj button,.wj a.b{font:inherit;cursor:pointer;border:0;border-bottom:5px solid rgba(0,0,0,.38);border-radius:12px;padding:8px 14px;background:#334155;color:#e5edff;font-weight:800;text-decoration:none;display:inline-block;margin:2px 4px 2px 0;transition:transform .12s cubic-bezier(.175,.885,.32,1.275)}' +
      '.wj button:active,.wj a.b:active{transform:translateY(4px);border-bottom-width:1px}.wj .on,.wj button.on{background:#f59e0b;color:#1c1100}.wj .g,.wj a.b.g,.wj button.g{background:#10b981;color:#04140d}.wj .c,.wj a.b.c{background:#38bdf8;color:#04121f}.wj .r,.wj button.r{background:#f43f5e;color:#fff}.wj .sm{padding:5px 10px;font-size:.85rem}' +
      '.wj-card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:14px 16px;margin-bottom:12px}' +
      '.wj-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.wj-grid .wj-card{margin:0}' +
      '.wj-row{display:flex;gap:10px;align-items:flex-start;padding:9px 0;border-top:1px solid rgba(255,255,255,.08)}.wj-row:first-of-type{border-top:0}' +
      '.wj-t{flex:none;width:52px;font-weight:900;color:#fbbf24}.wj-cl{flex:none;border-radius:9px;padding:2px 9px;font-weight:900;background:#a855f7;color:#fff}' +
      '.wj-st{flex:none;margin-left:auto;font-weight:800;font-size:.82rem;border-radius:9px;padding:3px 9px;background:rgba(255,255,255,.1)}.wj-st.ok{background:#065f46;color:#a7f3d0}.wj-st.no{background:#7f1d1d;color:#fecaca}.wj-st.now{background:#f59e0b;color:#1c1100}' +
      '.wj-big{font-size:1.15rem;font-weight:900;margin:2px 0 4px}.wj-warn{background:rgba(245,158,11,.16);border:1px solid #f59e0b;border-radius:12px;padding:8px 12px;margin:6px 0;font-weight:700}' +
      '.wj-bar{display:inline-block;height:9px;border-radius:5px;background:#f43f5e;vertical-align:middle;margin-right:6px}.wj-bar.y{background:#f59e0b}' +
      '.wj textarea{width:100%;min-height:70px;background:#0b1220;color:#e5edff;border:1px solid #334155;border-radius:10px;padding:8px;font:inherit;resize:vertical}' +
      '@media(max-width:760px){.wj-grid{grid-template-columns:1fr}.wj{padding:14px}}' +
      '#wj-open{font:inherit;font-weight:800;cursor:pointer;border:0;border-bottom:4px solid #92400e;border-radius:12px;padding:7px 13px;background:#fbbf24;color:#1c1100;margin-right:8px;white-space:nowrap;transition:transform .12s cubic-bezier(.175,.885,.32,1.275)}#wj-open:active{transform:translateY(3px);border-bottom-width:1px}';
    document.head.appendChild(st);
  }
  function btns(l, sm) { return linksOf(l).map(function (x, i) { return '<a class="b ' + (i === 0 ? 'g ' : '') + (sm ? 'sm' : '') + '" href="' + esc(x[1]) + '" target="_blank" rel="noopener">' + esc(x[0]) + '</a>'; }).join(''); }
  function status(l, d, now) {
    var m = d.marks[keyOf(l)];
    if (l.cancelled && !(m && m.s)) return '<span class="wj-st no">No lesson (' + esc(l.cancelled) + ')</span>';
    if (m && m.s === 'done') return '<span class="wj-st ok">✓ Done</span>';
    if (m && m.s === 'skip') return '<span class="wj-st no">✗ Did not happen</span>';
    if (isNow(l, now)) return '<span class="wj-st now">● Now</span>';
    return isPast(l, now) ? '<span class="wj-st">Not marked</span>' : '';
  }
  function markBtns(l) { var k = esc(keyOf(l)); return '<button class="g sm" data-mark="done" data-k="' + k + '">✓ Done</button><button class="r sm" data-mark="skip" data-k="' + k + '">✗ Did not happen</button>'; }
  function title(l) { return l.planned ? esc(l.title) : esc(l.title) + ' <span class="dim">(nothing planned in the calendar)</span>'; }

  function todayHtml() {
    var now = new Date(), d = load(), dk = ymd(now), list = lessonsOn(dk), label = 'Today · ' + nice(dk);
    if (!list.length) {   /* a day off: show the next school day */
      for (var i = 1; i < 14 && !list.length; i++) { var x = new Date(now); x.setDate(now.getDate() + i); dk = ymd(x); list = lessonsOn(dk); }
      label = (OFF[ymd(now)] ? OFF[ymd(now)] + ' today. ' : 'No lessons today. ') + 'Next school day · ' + nice(dk);
    }
    var prints = [];
    list.forEach(function (l) { linksOf(l).forEach(function (x) { if (/Print/.test(x[0]) && !prints.some(function (p) { return p[1] === x[1]; })) prints.push([shortName(l.classId), x[1]]); }); });
    return '<div class="wj-card"><h3>📅 ' + esc(label) + (HALF[dk] ? ' · half day, no lessons from ' + HALF[dk] : '') + '</h3>' +
      (list.length ? list.map(function (l) {
        var past = isPast(l, now) && dk === ymd(now);
        return '<div class="wj-row"><span class="wj-t">' + esc(l.time) + '</span><span class="wj-cl">' + esc(shortName(l.classId)) + '</span><div style="flex:1"><div style="font-weight:800">' + title(l) + '</div><div>' + (l.cancelled ? '' : btns(l, true) + (past ? markBtns(l) : '')) + '</div></div>' + status(l, d, now) + '</div>';
      }).join('') : '<div class="dim">Nothing in the next two weeks.</div>') + '</div>' +
      '<div class="wj-card"><h3>🖨️ Give out / print for this day</h3>' + (prints.length ? prints.map(function (p) { return '<div class="wj-row"><span class="wj-cl">' + esc(p[0]) + '</span><a class="b c sm" href="' + esc(p[1]) + '" target="_blank" rel="noopener">🖨️ ' + esc(p[1].split('/').pop().replace(/\.pdf$/, '').replace(/-/g, ' ')) + '</a></div>'; }).join('') : '<div class="dim">No packs linked in the calendar for this day.</div>') + '</div>';
  }

  function classHtml(cid) {
    var now = new Date(), d = load(), from = new Date(now); from.setDate(now.getDate() - 21);
    var all = range(cid, ymd(from), 21 + 28), past = all.filter(function (l) { return isPast(l, now); }), next = all.filter(function (l) { return !isPast(l, now); });
    var cancelledSoon = next.filter(function (l) { return l.cancelled; });
    next = next.filter(function (l) { return !l.cancelled; });
    var last = past.filter(function (l) { return !l.cancelled || (d.marks[keyOf(l)] || {}).s; }).pop() || null;
    /* owed: planned lessons that did not happen (marked, or cancelled by a day off), not done later and not planned again */
    function gone(l) { var m = d.marks[keyOf(l)]; return m && m.s ? m.s === 'skip' : !!l.cancelled; }
    var owed = past.concat(cancelledSoon).filter(function (l, i, arr) {
      if (!l.planned || !gone(l)) return false;
      if (arr.slice(i + 1).some(function (p) { return p.title === l.title && (d.marks[keyOf(p)] || {}).s === 'done'; })) return false;
      return !next.some(function (n) { return n.title === l.title; });
    }).slice(-3);
    var nx = next[0] || null, H = hard(cid), note = d.notes[cid] || {};
    var unmarked = past.slice(-6).filter(function (l) { return !l.cancelled && !(d.marks[keyOf(l)] || {}).s; });
    return '<div class="wj-grid">' +
      '<div class="wj-card"><h3>⏮ Last lesson</h3>' + (last ? '<div class="dim">' + esc(nice(last.date)) + ' · ' + esc(last.time) + '</div><div class="wj-big">' + title(last) + '</div>' + status(last, d, now) + '<div style="margin-top:6px">' + markBtns(last) + '</div>' : '<div class="dim">No lessons yet.</div>') +
        (unmarked.length > 1 ? '<div class="dim" style="margin-top:8px">' + unmarked.length + ' lessons are not marked yet. Mark them in the list below.</div>' : '') + '</div>' +
      '<div class="wj-card"><h3>⏭ Next lesson</h3>' + (nx ? '<div class="dim">' + esc(nice(nx.date)) + ' · ' + esc(nx.time) + '</div><div class="wj-big">' + title(nx) + '</div>' +
        owed.map(function (o) { return '<div class="wj-warn">↩ First continue: “' + esc(o.title) + '” ' + (isPast(o, now) ? 'did not happen' : 'cannot happen') + ' on ' + esc(nice(o.date)) + (o.cancelled ? ' (' + esc(o.cancelled) + ')' : '') + '.</div>'; }).join('') +
        (H.length ? '<div class="wj-warn" style="border-color:#38bdf8;background:rgba(56,189,248,.12)">🧠 Start with 5 minutes on the hard questions (Remember 5).</div>' : '') +
        '<div style="margin-top:6px">' + owed.map(function (o) { return btns(o); }).join('') + btns(nx) + '<a class="b c" href="game-maker/index.html?class=' + esc(cid) + '&daily=1" target="_blank" rel="noopener">🧠 Remember 5</a></div>' : '<div class="dim">Nothing in the next 4 weeks.</div>') + '</div>' +
      '</div>' +
      '<div class="wj-card" style="margin-top:12px"><h3>🔴 Still hard for ' + esc(shortName(cid)) + '</h3>' +
        (H.length ? H.slice(0, 6).map(function (x) { return '<div class="wj-row"><div style="flex:1"><b>' + esc(x.q) + '</b> <span class="dim">→ ' + esc(x.a) + '</span></div><span style="flex:none;min-width:120px"><span class="wj-bar ' + (x.pct >= 40 ? 'y' : '') + '" style="width:' + Math.max(6, Math.round(x.pct * 0.8)) + 'px"></span>' + x.pct + '% right</span></div>'; }).join('') +
          '<div class="dim" style="margin-top:6px">From the answer-card counts and exit tickets in Game Maker. Play with Answer cards = On to keep this list up to date.</div>'
        : '<div class="dim">No results yet. Play a game in Game Maker with <b>Answer cards = On</b> (and this class chosen): every “cards up” count lands here.</div>') + '</div>' +
      '<div class="wj-card"><h3>📝 Where we stopped (your note)</h3><textarea data-note="' + esc(cid) + '" placeholder="For example: stopped at page 3 of the pack; pairs 4 and 5 still to perform; bring the answer sheets back.">' + esc(note.text || '') + '</textarea>' +
        '<div class="dim">' + (note.t ? 'Saved ' + esc(new Date(note.t).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })) : 'Saved when you click outside the box.') + '</div></div>' +
      '<div class="wj-card"><h3>🗂 The last lessons and what is coming</h3>' +
        past.slice(-5).map(function (l) { return '<div class="wj-row"><span class="wj-t">' + esc(nice(l.date).replace(/ \w+$/, '')) + '</span><div style="flex:1"><div style="font-weight:700">' + esc(l.time) + ' · ' + title(l) + '</div><div>' + markBtns(l) + '</div></div>' + status(l, d, now) + '</div>'; }).join('') +
        next.slice(0, 4).map(function (l) { return '<div class="wj-row" style="opacity:.85"><span class="wj-t">' + esc(nice(l.date).replace(/ \w+$/, '')) + '</span><div style="flex:1"><div style="font-weight:700">' + esc(l.time) + ' · ' + title(l) + '</div><div>' + btns(l, true) + '</div></div><span class="wj-st">coming</span></div>'; }).join('') + '</div>';
  }

  function redraw() {
    if (!ovl || !document.body.contains(ovl)) return;
    var focus = document.activeElement && document.activeElement.dataset && document.activeElement.dataset.note;
    if (focus) return;   /* do not redraw while the teacher is typing a note */
    ovl.innerHTML = '<div class="wj"><div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start"><div><h2>📍 Where we are</h2><div class="dim">For you only. Mark each lesson Done or Did not happen, and the next lesson tells you where to continue. ' + esc(cloudMsg) + '</div></div><button data-close="1">Close ✕</button></div>' +
      '<div class="wj-tabs"><button data-tab="today" class="' + (tab === 'today' ? 'on' : '') + '">📅 Today</button>' + classes().map(function (c) { return '<button data-tab="' + esc(c.id) + '" class="' + (tab === c.id ? 'on' : '') + '">' + esc(shortName(c.id)) + '</button>'; }).join('') + '</div>' +
      (tab === 'today' ? todayHtml() : classHtml(tab)) + '</div>';
  }
  function open(which) {
    css();
    if (which) tab = which;
    var old = document.getElementById('wj-ovl'); if (old) old.remove();
    ovl = document.createElement('div'); ovl.id = 'wj-ovl'; ovl.className = 'wj-ovl';
    ovl.addEventListener('mousedown', function (e) { if (e.target === ovl) ovl.remove(); });
    ovl.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.close) { ovl.remove(); return; }
      if (b.dataset.tab) { tab = b.dataset.tab; redraw(); return; }
      if (b.dataset.mark) { var d = load(), k = b.dataset.k, cur = d.marks[k]; d.marks[k] = cur && cur.s === b.dataset.mark ? { s: '', t: Date.now() } : { s: b.dataset.mark, t: Date.now() }; save(d); redraw(); }
    });
    ovl.addEventListener('focusout', function (e) {
      var t = e.target; if (!t || !t.dataset || !t.dataset.note) return;
      var d = load(), cid = t.dataset.note, txt = t.value.trim();
      if ((d.notes[cid] || {}).text === txt) return;
      d.notes[cid] = { text: txt, t: Date.now() }; save(d); setTimeout(redraw, 0);
    });
    document.body.appendChild(ovl);
    redraw();
    sync().then(redraw);
  }

  /* an item in the header's Create menu (teacher only) */
  function mountButton() {
    var old = document.getElementById('wj-open'); if (old) old.remove();
    var menu = document.getElementById('header-create-menu'); if (!menu || document.getElementById('wj-menu-item')) return;
    var b = document.createElement('button'); b.id = 'wj-menu-item'; b.type = 'button'; b.className = 'dropdown-item-btn';
    b.innerHTML = '<span>📍</span> <span>Where we are</span>'; b.title = 'Each class: last lesson, what is still hard, the next lesson and what to print';
    b.onclick = function () { menu.classList.remove('is-open'); open(); };
    menu.insertBefore(b, menu.firstChild);
  }
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountButton); else mountButton();
  }

  root.ClassJourney = { open: open, lessonsOn: lessonsOn, hard: hard, sync: sync, linksOf: linksOf };
})(typeof window !== 'undefined' ? window : this);
