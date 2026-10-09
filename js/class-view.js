/* Class view: one simple smartboard screen for the classroom. Big 3D picture buttons only.
   Today's lesson, scoreboard, timer, games, pick a pupil, rewards, home view, and a small teacher key.
   Adds the view "classview". Uses the existing Class Board, Timetable, Toolkit and Classroom Store. */
(function (root) {
  'use strict';
  function S() { return root.schoolStore || root.store; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var ART = 'platform-art/';
  var panel = null; // which info panel is open: 'lesson' | 'home' | null

  var TILES = [
    { id: 'board', pic: 'm_scoreboard', t: 'Scoreboard', c: '#f59e0b' },
    { id: 'timer', pic: 'm_timer', t: 'Timer', c: '#f43f5e' },
    { id: 'games', pic: 'm_games', t: 'Games', c: '#a855f7' },
    { id: 'pick', pic: 'm_pick', t: 'Pick a pupil', c: '#8b5cf6' },
    { id: 'rewards', pic: 'm_rewards', t: 'Rewards', c: '#10b981' },
    { id: 'home', pic: 'm_home', t: 'Home view', c: '#0ea5e9' }
  ];

  function css() {
    if (document.getElementById('cv-css')) return;
    var st = document.createElement('style'); st.id = 'cv-css';
    st.textContent = '' +
      '.cv{position:relative;min-height:calc(100vh - 110px);border-radius:26px;padding:2.2vh 2.4vw 3vh;color:#fff;font-family:Fredoka,Nunito,system-ui,sans-serif;background:#060911 center/cover no-repeat;overflow:hidden}' +
      '.cv::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 30%,rgba(13,21,39,.55) 0,rgba(6,9,17,.86) 100%);pointer-events:none}' +
      '.cv>*{position:relative}' +
      '.cv-hd{display:flex;align-items:center;gap:2vw;justify-content:space-between;flex-wrap:wrap}' +
      '.cv-hd h1{margin:0;font-size:clamp(1.6rem,3.4vw,2.6rem);font-weight:600}.cv-hd small{display:block;font-size:clamp(.9rem,1.5vw,1.2rem);opacity:.8;font-weight:500}' +
      '.cv-key{width:clamp(48px,6vw,72px);height:clamp(48px,6vw,72px);border-radius:18px;border:0;border-bottom:5px solid rgba(0,0,0,.45);background:rgba(15,23,42,.8);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:6px;backdrop-filter:blur(14px);transition:transform .12s cubic-bezier(.175,.885,.32,1.275)}' +
      '.cv-key:active{transform:translateY(4px);border-bottom-width:1px}.cv-key img{width:100%;height:100%;object-fit:contain}' +
      '.cv-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:2vh 1.6vw;margin-top:2.4vh}' +
      '.cv-tile{flex:0 0 calc(16.66% - 1.4vw);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1vh;min-height:19vh;padding:1.2vh 1vw;border:0;border-bottom:5px solid color-mix(in srgb,var(--c) 45%,#000);border-radius:26px;background:linear-gradient(180deg,color-mix(in srgb,var(--c) 38%,rgba(15,23,42,.92)),rgba(15,23,42,.88));backdrop-filter:blur(14px);box-shadow:0 4px 20px -2px rgba(0,0,0,.4),0 2px 6px -1px rgba(0,0,0,.2);cursor:pointer;color:#fff;font:inherit;transition:transform .12s cubic-bezier(.175,.885,.32,1.275),box-shadow .12s}' +
      '.cv-tile:hover{transform:translateY(-3px)}.cv-tile:active{transform:translateY(4px);border-bottom-width:1px}' +
      '.cv-tile img{height:11vh;width:auto;max-width:90%;object-fit:contain;filter:drop-shadow(0 1vh 1vh rgba(0,0,0,.4));animation:cvBob 3.2s ease-in-out infinite}' +
      '.cv-tile:nth-child(2n) img{animation-delay:.5s}.cv-tile:nth-child(3n) img{animation-delay:1s}' +
      '.cv-tile b{font-size:clamp(1rem,1.7vw,1.5rem);font-weight:600;text-shadow:0 .3vh 0 rgba(0,0,0,.5)}' +
      '@keyframes cvBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-.8vh)}}' +
      '.cv-panel{margin-top:2.4vh;padding:2vh 2vw;border-radius:22px;background:rgba(15,23,42,.8);backdrop-filter:blur(14px);border:2px solid rgba(255,255,255,.14)}' +
      '.cv-panel,.cv-panel h2,.cv-panel b,.cv-panel a{color:#f8fafc}.cv-panel .cv-link{color:#fff}.cv-panel h2{margin:0 0 1vh;font-size:clamp(1.2rem,2.2vw,1.8rem);font-weight:600}' +
      '.cv-panel .lesson-launch{font-size:clamp(1rem,1.8vw,1.4rem)}' +
      '.cv-row{display:flex;gap:1.2vw;flex-wrap:wrap;align-items:center}.cv-link{display:inline-block;padding:1vh 1.4vw;border-radius:16px;border-bottom:5px solid rgba(0,0,0,.4);background:#0ea5e9;color:#fff;text-decoration:none;font-weight:600;font-size:clamp(1rem,1.8vw,1.4rem)}' +
      '.cv-link.g3{background:#f59e0b}.cv-link:active{transform:translateY(4px);border-bottom-width:1px}' +
      '.cv-hint{opacity:.85;font-size:clamp(.9rem,1.5vw,1.15rem);margin-top:1vh}' +
      '.cv-today{margin-top:2.2vh;padding:2vh 2vw 2.2vh;border-radius:28px;background:rgba(255,255,255,.9);border-bottom:6px solid #38bdf8;box-shadow:0 10px 24px -12px rgba(15,42,74,.5);color:#0f2a4a}' +
      '.cv-today h2{margin:0 0 1.2vh;font-size:clamp(1.3rem,2.4vw,2rem);font-weight:700;display:flex;align-items:center;gap:12px}.cv-today h2 img{height:1.6em}' +
      '.cv-lessons{display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:1.2vh 1.2vw}' +
      '.cv-lesson{display:flex;align-items:center;gap:1.2vw;text-decoration:none;color:#0f2a4a;padding:1vh 1.2vw;border-radius:22px;border-bottom:6px solid color-mix(in srgb,var(--c) 70%,#000);background:linear-gradient(135deg,#fff,color-mix(in srgb,var(--c) 28%,#fff));transition:transform .12s cubic-bezier(.175,.885,.32,1.275);box-shadow:0 8px 18px -10px rgba(15,42,74,.5)}' +
      '.cv-lesson:hover{transform:translateY(-3px)}.cv-lesson:active{transform:translateY(4px);border-bottom-width:1px}' +
      '.cv-lesson .ic{font-size:clamp(2.2rem,5vh,3.2rem);line-height:1}.cv-lesson .tx{flex:1;min-width:0}.cv-lesson .tx b{display:block;font-size:clamp(1.05rem,1.7vw,1.4rem);font-weight:700;line-height:1.2}.cv-lesson .tx em{font-style:normal;font-weight:700;opacity:.7;font-size:1.05rem}' +
      '.cv-lesson .go{font-style:normal;font-weight:800;font-size:1.4rem;background:#10b981;color:#fff;border-radius:50%;border-bottom:5px solid #047857;width:2.2em;height:2.2em;display:flex;align-items:center;justify-content:center}' +
      '.cv-none{font-size:clamp(1rem,1.8vw,1.35rem);font-weight:600;margin:0 0 1.2vh;opacity:.85}.cv-set{font:inherit;font-weight:800;font-size:1.05rem;cursor:pointer;border:0;border-bottom:4px solid #475569;border-radius:14px;padding:8px 16px;background:#fff;color:#0f2a4a}' +
      '@media(max-width:900px){.cv-tile{flex:0 0 calc(50% - 1vw)}.cv-tile img{height:12vh}}';
    document.head.appendChild(st);
  }

  function activeClass() { try { return S().getActiveClass && S().getActiveClass(); } catch (e) { return null; } }
  function img(n, alt) { return '<img src="' + ART + n + '.webp" alt="' + (alt || '') + '" draggable="false">'; }

  var COLORS = ['#38bdf8', '#f59e0b', '#10b981', '#a855f7', '#f43f5e', '#0ea5e9'];
  function gradeOf(cls) { var m = /([34])/.exec((cls && cls.name) || ''); return m ? Number(m[1]) : 0; }
  function lessonCard(e, i, tag) {
    var inner = '<span class="ic">' + esc(e.icon) + '</span><span class="tx"><b>' + esc(String(e.title || '').replace(/\s*\((Grade|Week|Unit)[^)]*\)\s*$/i, '')) + '</b>' + (e.time ? '<em>' + esc(e.time) + '</em>' : (tag ? '<em>' + esc(tag) + '</em>' : '')) + '</span><i class="go">▶</i>';
    var st = ' style="--c:' + COLORS[i % COLORS.length] + '"';
    if (e.route) return '<a class="cv-lesson"' + st + ' href="' + esc(e.route) + '">' + inner + '</a>';
    if (e.view) return '<a class="cv-lesson"' + st + ' href="#" onclick="switchView(\'' + esc(e.view) + '\');return false;">' + inner + '</a>';
    return '<div class="cv-lesson"' + st + '>' + inner + '</div>';
  }
  function todayHero(cls) {
    var T = root.Timetable, out = '<div class="cv-today"><h2><img src="' + ART + 'm_lesson.webp" alt="">Today</h2>';
    var t = null; try { t = T && cls ? T.today(cls.id) : null; } catch (e) { t = null; }
    if (t && t.set && t.list.length) return out + '<div class="cv-lessons">' + t.list.map(function (e, i) { return lessonCard(e, i); }).join('') + '</div></div>';
    var g = gradeOf(cls), sug = [];
    try { sug = (T.catalog || []).filter(function (c) { return c.added && c.route && (!c.g || !g || c.g === g); }).sort(function (a, b) { return a.added < b.added ? 1 : (a.added > b.added ? -1 : 0); }).slice(0, 4); } catch (e2) { sug = []; }
    out += '<p class="cv-none">' + (t && t.set ? 'No lesson is set for ' + (t.label === 'Today' ? 'today' : 'Monday') + '. Newest lessons:' : 'No timetable yet. Newest lessons:') + ' <button type="button" class="cv-set" onclick="Timetable.edit()">📅 ' + (t && t.set ? 'Edit' : 'Set') + ' my timetable</button></p>';
    return out + '<div class="cv-lessons">' + sug.map(function (e, i) { return lessonCard(e, i, 'New'); }).join('') + '</div></div>';
  }

  function panelHtml() {
    var cls = activeClass();
    if (panel === 'lesson') {
      var inner = '';
      try { inner = cls && root.Timetable ? root.Timetable.todayHtml(cls) : ''; } catch (e) { inner = ''; }
      var all = '';
      try { all = cls && root.Timetable ? root.Timetable.lessonsHtml(cls) : ''; } catch (e2) { all = ''; }
      return '<div class="cv-panel"><h2>Today\'s lesson' + (cls ? ' for ' + esc(cls.name) : '') + '</h2>' + (inner || '<div class="cv-hint">No lesson is set for today.</div>') +
        '<h2 style="margin-top:2vh">All our lessons</h2>' + all + '</div>';
    }
    if (panel === 'home') {
      var base = location.href.replace(/[#?].*$/, '').replace(/[^/]*$/, '');
      return '<div class="cv-panel"><h2>Home view: homework for pupils</h2><div class="cv-row">' +
        '<a class="cv-link g3" href="home-view/index.html?g=3" target="_blank" rel="noopener">Grade 3 home page</a>' +
        '<a class="cv-link" href="home-view/index.html?g=4" target="_blank" rel="noopener">Grade 4 home page</a></div>' +
        '<div class="cv-hint">Send this link to the parents: ' + esc(base) + 'home-view/index.html?g=3 (Grade 3) or ?g=4 (Grade 4)</div></div>';
    }
    return '';
  }

  function render(container) {
    css();
    var cls = activeClass(), hasBg = true;
    var d = new Date(), label = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    container.innerHTML = '<div class="cv" id="cv-root" style="background-image:url(' + ART + 'bg_class_view.webp)">' +
      '<div class="cv-hd"><div><h1>' + (cls ? esc(cls.name) : 'Class') + '</h1><small>' + esc(label) + '</small></div>' +
      '<button type="button" class="cv-key" title="Teacher area (Command Center)" onclick="ClassView.go(\'teacher\')">' + img('m_teacher_key', 'Teacher area') + '</button></div>' +
      todayHero(cls) + '<div class="cv-grid">' + TILES.map(function (t) { return '<button type="button" class="cv-tile" style="--c:' + t.c + '" onclick="ClassView.go(\'' + t.id + '\')">' + img(t.pic, '') + '<b>' + esc(t.t) + '</b></button>'; }).join('') + '</div>' +
      '<div id="cv-panel">' + panelHtml() + '</div></div>';
  }

  var api = {
    go: function (id) {
      var sw = root.switchView;
      if (id === 'lesson' || id === 'home') { panel = panel === id ? null : id; var p = document.getElementById('cv-panel'); if (p) { p.innerHTML = panelHtml(); if (panel && p.firstChild && p.firstChild.scrollIntoView) p.firstChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } return; }
      panel = null;
      if (id === 'board') { sw && sw('board'); return; }
      if (id === 'games') { sw && sw('shelf'); return; }
      if (id === 'rewards') { sw && sw('rewards'); return; }
      if (id === 'teacher') { sw && sw('command'); return; }
      if (id === 'timer') { if (root.openClassroomToolkitModal) root.openClassroomToolkitModal('timer'); return; }
      if (id === 'pick') { sw && sw('board'); setTimeout(function () { try { root.ClassBoard && root.ClassBoard.pick(); } catch (e) { /* optional */ } }, 500); }
    }
  };
  root.ClassView = api;
  root.renderClassView = render;
})(typeof window !== 'undefined' ? window : this);
