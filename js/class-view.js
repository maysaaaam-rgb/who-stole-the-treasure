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
    { id: 'lesson', pic: 'm_lesson', t: "Today's lesson", c: '#38bdf8' },
    { id: 'board', pic: 'm_scoreboard', t: 'Scoreboard', c: '#f59e0b' },
    { id: 'timer', pic: 'm_timer', t: 'Timer', c: '#f43f5e' },
    { id: 'games', pic: 'm_games', t: 'Games', c: '#a855f7' },
    { id: 'pick', pic: 'm_pick', t: 'Pick a pupil', c: '#8b5cf6' },
    { id: 'rewards', pic: 'm_rewards', t: 'Rewards', c: '#10b981' },
    { id: 'home', pic: 'm_home', t: 'Home view', c: '#f59e0b' }
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
      '.cv-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:2.2vh 1.8vw;margin-top:3vh}' +
      '.cv-tile{flex:0 0 calc(25% - 1.4vw);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1vh;min-height:24vh;padding:1.6vh 1vw;border:0;border-bottom:5px solid color-mix(in srgb,var(--c) 45%,#000);border-radius:26px;background:linear-gradient(180deg,color-mix(in srgb,var(--c) 38%,rgba(15,23,42,.92)),rgba(15,23,42,.88));backdrop-filter:blur(14px);box-shadow:0 4px 20px -2px rgba(0,0,0,.4),0 2px 6px -1px rgba(0,0,0,.2);cursor:pointer;color:#fff;font:inherit;transition:transform .12s cubic-bezier(.175,.885,.32,1.275),box-shadow .12s}' +
      '.cv-tile:hover{transform:translateY(-3px)}.cv-tile:active{transform:translateY(4px);border-bottom-width:1px}' +
      '.cv-tile img{height:15vh;width:auto;max-width:90%;object-fit:contain;filter:drop-shadow(0 1vh 1vh rgba(0,0,0,.4));animation:cvBob 3.2s ease-in-out infinite}' +
      '.cv-tile:nth-child(2n) img{animation-delay:.5s}.cv-tile:nth-child(3n) img{animation-delay:1s}' +
      '.cv-tile b{font-size:clamp(1.2rem,2.4vw,2rem);font-weight:600;text-shadow:0 .3vh 0 rgba(0,0,0,.5)}' +
      '@keyframes cvBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-.8vh)}}' +
      '.cv-panel{margin-top:2.4vh;padding:2vh 2vw;border-radius:22px;background:rgba(15,23,42,.8);backdrop-filter:blur(14px);border:2px solid rgba(255,255,255,.14)}' +
      '.cv-panel,.cv-panel h2,.cv-panel b,.cv-panel a{color:#f8fafc}.cv-panel .cv-link{color:#fff}.cv-panel h2{margin:0 0 1vh;font-size:clamp(1.2rem,2.2vw,1.8rem);font-weight:600}' +
      '.cv-panel .lesson-launch{font-size:clamp(1rem,1.8vw,1.4rem)}' +
      '.cv-row{display:flex;gap:1.2vw;flex-wrap:wrap;align-items:center}.cv-link{display:inline-block;padding:1vh 1.4vw;border-radius:16px;border-bottom:5px solid rgba(0,0,0,.4);background:#0ea5e9;color:#fff;text-decoration:none;font-weight:600;font-size:clamp(1rem,1.8vw,1.4rem)}' +
      '.cv-link.g3{background:#f59e0b}.cv-link:active{transform:translateY(4px);border-bottom-width:1px}' +
      '.cv-hint{opacity:.85;font-size:clamp(.9rem,1.5vw,1.15rem);margin-top:1vh}' +
      '@media(max-width:900px){.cv-tile{flex:0 0 calc(50% - 1vw)}.cv-tile img{height:12vh}}';
    document.head.appendChild(st);
  }

  function activeClass() { try { return S().getActiveClass && S().getActiveClass(); } catch (e) { return null; } }
  function img(n, alt) { return '<img src="' + ART + n + '.webp" alt="' + (alt || '') + '" draggable="false">'; }

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
      '<div class="cv-grid">' + TILES.map(function (t) { return '<button type="button" class="cv-tile" style="--c:' + t.c + '" onclick="ClassView.go(\'' + t.id + '\')">' + img(t.pic, '') + '<b>' + esc(t.t) + '</b></button>'; }).join('') + '</div>' +
      '<div id="cv-panel">' + panelHtml() + '</div></div>';
  }

  var api = {
    go: function (id) {
      var sw = root.switchView;
      if (id === 'lesson' || id === 'home') { panel = panel === id ? null : id; var p = document.getElementById('cv-panel'); if (p) { p.innerHTML = panelHtml(); if (panel && p.firstChild && p.firstChild.scrollIntoView) p.firstChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } return; }
      panel = null;
      if (id === 'board') { sw && sw('board'); return; }
      if (id === 'games') { sw && sw('library'); return; }
      if (id === 'rewards') { sw && sw('store'); return; }
      if (id === 'teacher') { sw && sw('command'); return; }
      if (id === 'timer') { if (root.openClassroomToolkitModal) root.openClassroomToolkitModal('timer'); return; }
      if (id === 'pick') { sw && sw('board'); setTimeout(function () { try { root.ClassBoard && root.ClassBoard.pick(); } catch (e) { /* optional */ } }, 500); }
    }
  };
  root.ClassView = api;
  root.renderClassView = render;
})(typeof window !== 'undefined' ? window : this);
