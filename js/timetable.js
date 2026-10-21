/* Weekly timetable: the teacher sets it once (per class, Monday to Friday) and the dashboard and the Class Board
   show TODAY's lessons automatically, each with a launch button. Saved with the Classroom Store settings (synced to the cloud). */
(function (root) {
  'use strict';
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var CATALOG = [
    { id: 'u3-g3-quiz', icon: '📄', title: 'Unit 3 Paper Quiz: It Keeps Changing (Forms A and B, 100 points)', route: 'unit3-g3-quiz/index.html', g: 3, added: '2026-10-15' },
    { id: 'u3-money-quiz-4skills', icon: '🪙', title: 'Unit 3 4-Skills Paper Game Quiz: How Much Is It? (25 Min • 2 Pages)', route: 'unit3-money-mission/quiz-4skills.html', g: 4, added: '2026-10-14' },
    { id: 'lingo-g3-u3-review', icon: '🐲', title: 'It Keeps Changing: Monster Cast Journey Review (Unit 3)', route: 'lingo-g3-u3-review/index.html', g: 3, added: '2026-10-14' },
    { id: 'u3-arctic-hw', icon: '🏔️', title: 'Unit 3 Homework: The Arctic Rescue (no-fail story adventure)', route: 'unit3-arctic-homework/index.html', g: 0, added: '2026-10-13' },
    { id: 'u3-money-mission', icon: '🚀', title: 'Unit 3 Smartboard Mission: How Much Is It? (Among Us + 2P Tug-of-War)', route: 'unit3-money-mission/index.html', g: 0, added: '2026-10-13' },
    { id: 'watch-bean-g3', icon: '🎬', title: 'Mr Bean: Super Trolley (watch and answer)', route: 'watch-answer/index.html', g: 3, added: '2026-10-07' },
    { id: 'weeksong-g4', icon: '🎵', title: 'Week Song: learn, move, sing', route: 'week-song-g4/index.html', g: 4, added: '2026-10-07' },
    { id: 'karaoke-g4', icon: '🎤', title: 'Karaoke Stage (read one by one)', route: 'karaoke-stage/index.html', g: 4, added: '2026-10-07' },
    { id: 'karaoke-g3', icon: '🎤', title: 'Karaoke Stage (read one by one)', route: 'karaoke-stage/index.html', g: 3, added: '2026-10-07' },
    { id: 'g3-cook1', icon: '🍡', title: 'Chuseok Treats Kitchen (Week 2, L1)', route: 'unit2-g3-cooking/index.html?lesson=1', g: 3, added: '2026-10-07' },
    { id: 'g3-cook2', icon: '📺', title: 'Junior Chef Show (Week 2, L2)', route: 'unit2-g3-cooking/index.html?lesson=2', g: 3, added: '2026-10-07' },
    { id: 'g3-show', icon: '🎬', title: 'Cooking Show presentations', route: 'unit2-g3-cooking/show.html', g: 3, added: '2026-10-07' },
    { id: 'g4-rev', icon: '🧠', title: 'Revision Quest (Units 1 and 2)', route: 'unit12-revision-g4/index.html', g: 4, added: '2026-10-06' },
    { id: 'g4-ws', icon: '📝', title: 'Worksheet and Class Store', route: 'unit12-worksheet-g4/index.html', g: 4, added: '2026-10-06' },
    { id: 'g3-arcade', icon: '🎮', title: 'Chuseok Games Arcade Day', route: 'unit2-g3-lessons/index.html?lesson=3', g: 3, added: '2026-10-05' },
    { id: 'g4-forest', icon: '🌲', title: 'Forest Rangers', route: 'unit2-forest-lessons/index.html?lesson=1', g: 4, added: '2026-10-05' },
    { id: 'g4-swallow', icon: '🕊️', title: 'The Swallow’s Gift', route: 'unit2-forest-lessons/index.html?lesson=2', g: 4, added: '2026-10-05' },
    { id: 'g3-moon', icon: '🌕', title: 'Chuseok Moon Feast', route: 'unit2-g3-lessons/index.html?lesson=1', g: 3, added: '2026-10-05' },
    { id: 'g3-arctic', icon: '🐻‍❄️', title: 'Arctic Words (Unit 3, The Bear and I)', route: 'unit3-g3-arctic-words/index.html', g: 3, added: '2026-10-12' },
    { id: 'g3-wordcity', icon: '🏙️', title: 'Word City (Unit 3)', route: 'unit3-g3-word-city/index.html', g: 3, added: '2026-10-12' },
    { id: 'g3-board', icon: '🎲', title: 'Arctic Board Game (Unit 3, The Bear and I)', route: 'unit3-board-game/index.html?grade=3', g: 3, added: '2026-10-12' },
    { id: 'g4-board', icon: '🎲', title: 'Money Board Game (Unit 3, How Much Is It?)', route: 'unit3-board-game/index.html?grade=4', g: 4, added: '2026-10-12' },
    { id: 'rev-g4-teamwork', icon: '🏀', title: 'Grade 4 Review: Teamwork (book pp. 56-61): quiz, word shoot, put it in order', route: 'review-g4-teamwork/index.html', g: 4, added: '2026-10-19' },
    { id: 'rev-g4-show', icon: '🎭', title: 'Grade 4 Review: Late for the Show (book pp. 62-70): curtain up, get Harry to the stage, spotlight, excuse round', route: 'review-g4-show/index.html', g: 4, added: '2026-10-20' },
    { id: 'u4-g3-l3-mountain', icon: '🌋', title: 'Unit 4 Lesson 3: The Angry Mountain (pp. 65-69): volcano words, cause & effect gears, story theater, sail to the rescue ship', route: 'unit4-g3-angry-mountain/index.html', g: 3, added: '2026-10-21' },
    { id: 'u4-g3-l4-phonics', icon: '🔤', title: 'Unit 4 Lesson 4: Phonics -nd & Think Together (pp. 70-71): reading check, 4 feeling corners, -nd letter factory, balloon pop, story train', route: 'unit4-g3-phonics-think/index.html', g: 3, added: '2026-10-21' },
    { id: 'rev-g3-mountain', icon: '🌋', title: 'Grade 3 Reading 2: The Angry Mountain (book pp. 64-71): volcano words, cause & effect, sail to safety, -nd blends & think together', route: 'review-g3-mountain/index.html', g: 3, added: '2026-10-21' },
    { id: 'gamemaker-g3', icon: '🎮', title: 'Game Maker: play any question list as a game (tile board, Plink-oh, Pumpkin Hunt) with the class monsters', route: 'game-maker/index.html', g: 3, added: '2026-10-20' },
    { id: 'gamemaker-g4', icon: '🎮', title: 'Game Maker: play any question list as a game (tile board, Plink-oh, Pumpkin Hunt) with the class monsters', route: 'game-maker/index.html', g: 4, added: '2026-10-20' },
    { id: 'rev-g3-museum', icon: '🔍', title: 'Grade 3 Review: The Mona Lisa Mystery (book pp. 56-59): look say act, sneak, Painting Race jigsaw (2 teams), story order bonus', route: 'review-g3-museum/index.html', g: 3, added: '2026-10-19' },
    { id: 'moon-song-g3', icon: '🌕', title: 'Chuseok Moon Song: learn the video song, sing it in circles, sing and move (folk song festival)', route: 'chuseok-moon-song/index.html', g: 3, added: '2026-10-18' },
    { id: 'moon-hw-g3', icon: '🏠', title: 'Moon Song Homework (5 minutes, link for the pupils)', route: 'chuseok-moon-homework/index.html', g: 3, added: '2026-10-18' },
    { id: 'u4-g3-l1', icon: '🕵️', title: 'Unit 4 Case File 1: A Picture on the Wall (What Happened?, lesson 1)', route: 'unit4-g3-lessons/index.html?lesson=1', g: 3, added: '2026-10-19' },
    { id: 'u4-g3-l2', icon: '🖼️', title: 'Unit 4 Case File 2: Where Is She? (What Happened?, lesson 2)', route: 'unit4-g3-lessons/index.html?lesson=2', g: 3, added: '2026-10-19' },
    { id: 'u4-g4-l1', icon: '🏀', title: 'Unit 4 Team Players (We Can Do It, lesson 1)', route: 'unit4-g4-lessons/index.html', g: 4, added: '2026-10-19' },
    { id: 'g4-captain', icon: '🐧', title: 'Captain Quiet’s Space Mission (Classroom Rules, Week 4)', route: 'week4-g4-captain-quiet/index.html', g: 4, added: '2026-10-09' },
    { id: 'g3-daphne', icon: '🕵️', title: 'Daphne the School Detective (School Life, Week 4)', route: 'week4-g3-daphne/index.html', g: 3, added: '2026-10-09' },
    { id: 'g4-ice3', icon: '💥', title: 'The Ice Cracks (Unit 3, Lesson 3)', route: 'unit3-g4-lessons/index.html?lesson=3', g: 3, added: '2026-10-09' },
    { id: 'g4-poem4', icon: '🎤', title: 'Explore the Poem (Unit 3, Lesson 4)', route: 'unit3-g4-lessons/index.html?lesson=4', g: 3, added: '2026-10-09' },
    { id: 'g3-money3', icon: '🚂', title: 'Money Changes (Unit 3, Lesson 3)', route: 'unit3-g3-lessons/index.html?lesson=3', g: 4, added: '2026-10-09' },
    { id: 'g3-money4', icon: '🎰', title: 'Design the Next Money (Unit 3, Lesson 4)', route: 'unit3-g3-lessons/index.html?lesson=4', g: 4, added: '2026-10-09' },
    { id: 'g4-change1', icon: '🧊', title: 'It Keeps Changing (Unit 3, Lesson 1)', route: 'unit3-g4-lessons/index.html?lesson=1', g: 3, added: '2026-10-08' },
    { id: 'g4-bear2', icon: '🐻‍❄️', title: 'The Bear and I, part 1 (Unit 3, Lesson 2)', route: 'unit3-g4-lessons/index.html?lesson=2', g: 3, added: '2026-10-08' },
    { id: 'g3-money1', icon: '💰', title: 'How Much Is It? (Unit 3, Lesson 1)', route: 'unit3-g3-lessons/index.html?lesson=1', g: 4, added: '2026-10-08' },
    { id: 'g3-money2', icon: '⏳', title: 'Before Money Was Money (Unit 3, Lesson 2)', route: 'unit3-g3-lessons/index.html?lesson=2', g: 4, added: '2026-10-08' },
    { id: 'g3-harvest', icon: '🌱', title: 'First Harvest', route: 'unit2-g3-lessons/index.html?lesson=2', g: 3, added: '2026-10-05' },
    { id: 'u1-rev', icon: '🎯', title: 'Unit 1 Revision Game', route: 'unit1-revision/index.html', g: 0, added: '2026-10-04' },
    { id: 'alice', icon: '🫖', title: 'Alice Tea Party practice', route: 'alice-party-home/party.html', g: 4, added: '2026-10-03' },
    { id: 'alice-rehearsal', icon: '🎭', title: 'Alice Tea Party: rehearsal lessons', route: 'alice-party-rehearsal/index.html', g: 4, added: '2026-10-17' },
    { id: 'alice-hub', icon: '🧺', title: 'Tea Party week: print and plan', route: 'alice-party-print/index.html', g: 4, added: '2026-10-17' },
    { id: 'library', icon: '🎮', title: 'Resource Library', view: 'library', g: 0 }
  ];
  function S() { return root.schoolStore || root.store; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function find(id) { return CATALOG.filter(function (c) { return c.id === id; })[0] || null; }
  function all() { try { return (root.ClassroomStore && root.ClassroomStore.getTimetable && root.ClassroomStore.getTimetable()) || {}; } catch (e) { return {}; } }
  function gradeOf(cls) { return /4/.test((cls && cls.name) || '') ? 4 : (/3/.test((cls && cls.name) || '') ? 3 : 0); }
  function sortEntries(a) { return a.slice().sort(function (x, y) { return String(x.t || '').localeCompare(String(y.t || '')); }); }

  /** Lessons for a class today (or the next school day when it is a weekend). */
  function today(clsId) {
    var d = new Date(), wd = d.getDay(), label = 'Today';
    if (wd === 0 || wd === 6) { wd = 1; label = 'Monday'; }
    var tt = all()[clsId] || {}, list = sortEntries(tt[wd] || []).map(function (e) {
      var c = e.l ? find(e.l) : null;
      return { time: e.t || '', icon: c ? c.icon : '📖', title: c ? c.title : (e.x || 'Lesson'), route: c ? c.route : null, view: c ? c.view : null };
    });
    return { label: label, day: DAYS[wd], list: list, set: Object.keys(tt).some(function (k) { return (tt[k] || []).length; }) };
  }
  function launchHtml(e) {
    var inner = '<span>' + e.icon + '</span><b>' + (e.time ? '<em>' + esc(e.time) + '</em> ' : '') + esc(e.title) + '</b><i>' + (e.route || e.view ? '▶' : '') + '</i>';
    if (e.route) return '<a class="lesson-launch" href="' + esc(e.route) + '">' + inner + '</a>';
    if (e.view) return '<a class="lesson-launch" href="#" onclick="switchView(\'' + esc(e.view) + '\'); return false;">' + inner + '</a>';
    return '<div class="lesson-launch plain">' + inner + '</div>';
  }
  /** Small HTML block with today's lessons for a class (used by the dashboard and the Class Board). */
  function todayHtml(cls) {
    var t = today(cls.id);
    if (!t.set) return '<div class="tt-empty">No timetable yet.<br><button type="button" class="tt-btn" onclick="Timetable.edit()">📅 Set my weekly timetable</button></div>';
    if (!t.list.length) return '<div class="tt-empty">No lessons for ' + esc(cls.name) + ' ' + (t.label === 'Today' ? 'today' : 'on Monday') + '.<br><button type="button" class="tt-btn" onclick="Timetable.edit()">📅 Edit timetable</button></div>';
    return '<div class="lesson-launch-list">' + t.list.map(launchHtml).join('') + '</div><button type="button" class="tt-btn small" onclick="Timetable.edit()">📅 Edit timetable</button>';
  }

  /** Every lesson we have made for this class's grade, newest first (shown on the Classic Dashboard). */
  function lessonsHtml(cls) {
    var g = gradeOf(cls), now = Date.now();
    var list = CATALOG.filter(function (c) { return c.added && (!c.g || !g || c.g === g); }).sort(function (a, b) { return a.added < b.added ? 1 : (a.added > b.added ? -1 : CATALOG.indexOf(a) - CATALOG.indexOf(b)); });
    return '<div class="our-lessons">' + list.map(function (c) {
      var isNew = now - new Date(c.added).getTime() < 7 * 86400000;
      return '<a class="ol-card" href="' + esc(c.route) + '"><span class="ol-ic">' + c.icon + '</span><b>' + esc(c.title) + '</b>' + (isNew ? '<em>NEW</em>' : '') + '<i>▶</i></a>';
    }).join('') + '</div>';
  }

  // ------------------------------------------------------------------ editor
  var ed = null;
  function classes() { return (S().getClasses ? S().getClasses() : []).filter(function (c) { return !c.archived; }); }
  function modal() {
    var m = document.getElementById('tt-modal');
    if (!m) { m = document.createElement('div'); m.id = 'tt-modal'; document.body.appendChild(m); }
    return m;
  }
  function paint() {
    var m = modal(), cl = classes(), cur = ed.classId, tt = ed.tt[cur] || (ed.tt[cur] = {});
    var cls = cl.filter(function (c) { return c.id === cur; })[0], g = gradeOf(cls);
    var opts = CATALOG.filter(function (c) { return !c.g || !g || c.g === g; });
    function sel(v) { return '<option value="">Other (type below)</option>' + opts.map(function (c) { return '<option value="' + c.id + '"' + (v === c.id ? ' selected' : '') + '>' + c.icon + ' ' + esc(c.title) + '</option>'; }).join(''); }
    var cols = [1, 2, 3, 4, 5].map(function (d) {
      var rows = (tt[d] || []).map(function (e, i) {
        return '<div class="tt-row"><input type="text" class="tt-time" value="' + esc(e.t || '') + '" placeholder="08:30" onchange="Timetable.set(' + d + ',' + i + ',\'t\',this.value)">' +
          '<select onchange="Timetable.set(' + d + ',' + i + ',\'l\',this.value);Timetable.repaint()">' + sel(e.l || '') + '</select>' +
          (e.l ? '' : '<input type="text" class="tt-x" value="' + esc(e.x || '') + '" placeholder="What is the lesson?" onchange="Timetable.set(' + d + ',' + i + ',\'x\',this.value)">') +
          '<button type="button" class="tt-del" title="Remove" onclick="Timetable.del(' + d + ',' + i + ')">✕</button></div>';
      }).join('');
      return '<div class="tt-col"><div class="tt-day">' + DAYS[d] + '</div>' + rows + '<button type="button" class="tt-add" onclick="Timetable.add(' + d + ')">+ Add lesson</button></div>';
    }).join('');
    m.innerHTML = '<div class="tt-back" onclick="if(event.target===this)Timetable.close()"><div class="tt-box"><div class="tt-head"><h2>📅 My weekly timetable</h2><button type="button" class="tt-x-btn" onclick="Timetable.close()">✕</button></div>' +
      '<p class="tt-hint">Set it once. The dashboard and the Class Board then show today’s lessons for each class with a start button. Add one row per lesson.</p>' +
      '<div class="tt-tabs">' + cl.map(function (c) { return '<button type="button" class="' + (c.id === cur ? 'on' : '') + '" onclick="Timetable.tab(\'' + esc(c.id) + '\')">' + esc(c.name) + '</button>'; }).join('') + '</div>' +
      '<div class="tt-grid">' + cols + '</div>' +
      '<div class="tt-foot"><button type="button" class="tt-save" onclick="Timetable.save()">💾 Save timetable</button><button type="button" class="tt-copy" onclick="Timetable.copyTo()">Copy this class to the other classes of the same grade</button></div></div></div>';
  }
  function injectCss() {
    if (document.getElementById('tt-css')) return;
    var st = document.createElement('style'); st.id = 'tt-css';
    st.textContent = '' +
      '.tt-empty{color:#cbd5e1;font-size:.88rem;line-height:1.5;margin-top:8px}.tt-btn{font:inherit;font-weight:800;font-size:.82rem;margin-top:8px;padding:8px 14px;border-radius:12px;cursor:pointer;color:#fff;background:#2563eb;border:0;border-bottom:4px solid #1e3a8a;transition:transform .15s cubic-bezier(.175,.885,.32,1.275)}.tt-btn:active{transform:translateY(3px);border-bottom-width:1px}.tt-btn.small{background:rgba(255,255,255,.1);border-bottom-color:rgba(0,0,0,.35);margin-top:10px;font-size:.75rem}' +
      '.lesson-launch em{font-style:normal;color:#7dd3fc;font-weight:900;margin-right:4px}.lesson-launch.plain{cursor:default}' +
      '#tt-modal .tt-back{position:fixed;inset:0;z-index:100000;background:rgba(2,6,23,.75);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:14px}' +
      '#tt-modal .tt-box{background:#0f172a;color:#f8fafc;border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:20px;max-width:1280px;width:100%;max-height:92vh;overflow:auto;box-shadow:0 30px 80px rgba(0,0,0,.6)}' +
      '#tt-modal .tt-head{display:flex;justify-content:space-between;align-items:center}#tt-modal h2{margin:0;font-size:1.3rem}.tt-x-btn{background:none;border:0;color:#cbd5e1;font-size:1.3rem;cursor:pointer}.tt-hint{color:#94a3b8;font-size:.85rem;margin:6px 0 12px}' +
      '.tt-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}.tt-tabs button{font:inherit;font-weight:800;padding:8px 16px;border-radius:12px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:#f8fafc;cursor:pointer}.tt-tabs button.on{background:#2563eb;border-color:#60a5fa}' +
      '.tt-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}.tt-col{background:rgba(255,255,255,.05);border-radius:14px;padding:10px;display:flex;flex-direction:column;gap:8px}.tt-day{font-weight:900;color:#7dd3fc}' +
      '.tt-row{display:flex;flex-direction:column;gap:5px;background:rgba(0,0,0,.25);padding:8px;border-radius:10px;position:relative}.tt-row input,.tt-row select{font:inherit;font-size:.82rem;padding:6px 8px;border-radius:8px;border:1px solid rgba(255,255,255,.2);background:#1e293b;color:#f8fafc;width:100%}.tt-time{max-width:90px}' +
      '.tt-del{position:absolute;right:6px;top:6px;border:0;background:none;color:#fda4af;cursor:pointer;font-size:.9rem}.tt-add{font:inherit;font-weight:800;font-size:.8rem;padding:7px;border-radius:10px;border:1px dashed rgba(255,255,255,.3);background:none;color:#cbd5e1;cursor:pointer}' +
      '.tt-foot{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.tt-save{font:inherit;font-weight:900;padding:10px 20px;border-radius:12px;border:0;border-bottom:5px solid #166534;background:#16a34a;color:#fff;cursor:pointer}.tt-copy{font:inherit;font-weight:700;padding:10px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.2);background:none;color:#cbd5e1;cursor:pointer}' +
      '@media(max-width:900px){.tt-grid{grid-template-columns:1fr}}';
    document.head.appendChild(st);
  }
  var api = {
    catalog: CATALOG, today: today, todayHtml: todayHtml, lessonsHtml: lessonsHtml,
    edit: function () {
      injectCss();
      var cl = classes(), act = S().getActiveClass ? S().getActiveClass() : cl[0];
      ed = { classId: (act && act.id) || (cl[0] && cl[0].id), tt: JSON.parse(JSON.stringify(all())) };
      paint();
    },
    repaint: function () { if (ed) paint(); },
    close: function () { var m = document.getElementById('tt-modal'); if (m) m.innerHTML = ''; ed = null; },
    tab: function (id) { ed.classId = id; paint(); },
    add: function (d) { var t = ed.tt[ed.classId] || (ed.tt[ed.classId] = {}); (t[d] = t[d] || []).push({ t: '', l: '' }); paint(); },
    del: function (d, i) { ed.tt[ed.classId][d].splice(i, 1); paint(); },
    set: function (d, i, f, v) { ed.tt[ed.classId][d][i][f] = v; },
    copyTo: function () {
      var cl = classes(), src = cl.filter(function (c) { return c.id === ed.classId; })[0], g = gradeOf(src), n = 0;
      cl.forEach(function (c) { if (c.id !== ed.classId && g && gradeOf(c) === g) { ed.tt[c.id] = JSON.parse(JSON.stringify(ed.tt[ed.classId] || {})); n++; } });
      root.alert ? root.alert(n ? 'Copied to ' + n + ' other class(es) of the same grade. Press Save.' : 'No other class of the same grade found.') : 0;
    },
    save: function () {
      try { root.ClassroomStore.setTimetable(ed.tt); } catch (e) { root.alert && root.alert('Could not save the timetable.'); return; }
      api.close(); if (root.showNotification) root.showNotification('Timetable saved.', 'success');
      if (root.renderCurrentView) root.renderCurrentView();
    }
  };
  api.titleOf = function (id) { var c = find(id); return c ? c.icon + ' ' + c.title : ''; };
  root.Timetable = api;
})(typeof window !== 'undefined' ? window : this);
