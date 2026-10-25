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
    { id: 'board', pic: 'm_scoreboard', t: 'Scoreboard', c: '#f59e0b', cm: true },
    { id: 'sleepy', pic: 'assets/packs/characters/sleepy-mio/mio-asleep.webp', t: '😴 Sleepy Mio', c: '#6366f1', cm: true },
    { id: 'pick', pic: 'm_pick', t: 'Pick a pupil', c: '#8b5cf6', cm: true },
    { id: 'karaoke', pic: 'h_mic', t: 'Karaoke', c: '#ec4899', cm: true },
    { id: 'home', pic: 'm_home', t: 'Home view', c: '#0ea5e9', cm: true },
    { id: 'timer', pic: 'm_timer', t: 'Timer', c: '#f43f5e' },
    { id: 'games', pic: 'm_games', t: 'Games', c: '#a855f7' },
    { id: 'rewards', pic: 'm_rewards', t: 'Rewards', c: '#10b981' }
  ];

  /* Map lesson routes/IDs to 3D raster artwork so Class View never falls back to flat emojis */
  var LESSON_ART = {
    'unit4-g3-angry-mountain/index.html': 'unit4-g3-angry-mountain/art/o_volcano.webp',
    'unit4-g3-phonics-think/index.html': 'unit4-g3-phonics-think/art/o_wind.webp',
    'review-g3-mountain/index.html': 'unit4-g3-angry-mountain/art/c_family_boat.webp',
    'unit4-g3-lessons/index.html?lesson=1': 'unit4-g3-lessons/art/o_mona_frame.webp',
    'unit4-g3-lessons/index.html?lesson=2': 'unit4-g3-lessons/art/o_newspaper.webp',
    'review-g3-museum/index.html': 'unit4-g3-lessons/art/c_daphne_case.webp',
    'unit4-g4-lessons/index.html': 'unit4-g4-lessons/art/o_basketball.webp',
    'review-g4-teamwork/index.html': 'unit4-g4-lessons/art/o_basketball.webp',
    'review-g4-show/index.html': 'assets/shelf/karaoke-stage.webp',
    'game-maker/index.html': ART + 'm_games.webp',
    'chuseok-moon-song/index.html': 'assets/shelf/chuseok-moon-g3.webp',
    'chuseok-moon-homework/index.html': ART + 'm_home.webp',
    'alice-party-rehearsal/index.html': 'assets/shelf/wonderland-lesson3.webp',
    'alice-party-print/index.html': 'assets/shelf/alice-party-home-4a.webp',
    'alice-party/index.html': 'assets/shelf/alice-party-home-4a.webp',
    'unit3-g3-quiz/index.html': 'unit3-g4-lessons/art/c_polar_bear.webp',
    'unit3-money-mission/quiz-4skills.html': 'unit3-g3-lessons/art/w_jar_saving.webp',
    'lingo-g3-u3-review/index.html': 'lingo-g3-u3-review/cast/bubbles_idle.webp'
  };
  function artForLesson(e) {
    if (e && e.route && LESSON_ART[e.route]) return LESSON_ART[e.route];
    if (e && e.route && /unit3-g4/.test(e.route)) return 'unit3-g4-lessons/art/c_polar_bear.webp';
    if (e && e.route && /unit3-g3|money/.test(e.route)) return 'unit3-g3-lessons/art/s_find_bill.webp';
    if (e && e.route && /unit2-g3|chuseok/.test(e.route)) return 'unit2-g3-cooking/art/songpyeon.webp';
    if (e && e.route && /forest/.test(e.route)) return 'assets/shelf/forest-rangers-g4.webp';
    return ART + 'm_lesson.webp';
  }

  function css() {
    if (document.getElementById('cv-css')) return;
    var st = document.createElement('style'); st.id = 'cv-css';
    st.textContent = '' +
      '.cv{position:relative;min-height:calc(100vh - 110px);border-radius:26px;padding:2.2vh 2.4vw 3vh;color:#fff;font-family:Fredoka,Nunito,system-ui,sans-serif;background:#060911 center/cover no-repeat;overflow:hidden}' +
      '.cv::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 30%,rgba(13,21,39,.55) 0,rgba(6,9,17,.86) 100%);pointer-events:none}' +
      '.cv>*{position:relative}' +
      '.cv-hd{display:flex;align-items:center;gap:1.5vw;justify-content:space-between;flex-wrap:wrap}' +
      '.cv-hd h1{margin:0;font-size:clamp(1.6rem,3.2vw,2.5rem);font-weight:700}.cv-hd small{display:block;font-size:clamp(.9rem,1.4vw,1.15rem);opacity:.82;font-weight:600}' +
      '.cv-kpis{display:flex;gap:10px;flex-wrap:wrap;margin-left:auto;align-items:center}' +
      '.cv-kpi{background:rgba(255,255,255,.88);border:2px solid rgba(56,189,248,.35);border-bottom:4px solid rgba(15,42,74,.22);border-radius:16px;padding:6px 14px;color:#0f2a4a;text-align:center;min-width:92px}' +
      '.cv-kpi b{display:block;font-size:1.35rem;font-weight:800;line-height:1.1;font-variant-numeric:tabular-nums}.cv-kpi span{font-size:.74rem;font-weight:700;opacity:.75;text-transform:uppercase;letter-spacing:.03em}' +
      '.cv-key{width:clamp(48px,5.2vw,64px);height:clamp(48px,5.2vw,64px);border-radius:18px;border:0;border-bottom:5px solid rgba(0,0,0,.45);background:rgba(15,23,42,.8);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:6px;backdrop-filter:blur(14px);transition:transform .12s cubic-bezier(.175,.885,.32,1.275)}' +
      '.cv-key:active{transform:translateY(4px) scale(.97);border-bottom-width:1px}.cv-key img{width:100%;height:100%;object-fit:contain}' +
      '.cv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin-top:2vh}' +
      '.cv-tile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.8vh;min-height:15.5vh;padding:1.2vh 1vw;border:0;border-bottom:5px solid color-mix(in srgb,var(--c) 45%,#000);border-radius:24px;background:linear-gradient(180deg,color-mix(in srgb,var(--c) 38%,rgba(15,23,42,.92)),rgba(15,23,42,.88));backdrop-filter:blur(14px);box-shadow:0 6px 20px -4px rgba(0,0,0,.35);cursor:pointer;color:#fff;font:inherit;transition:transform .14s cubic-bezier(.175,.885,.32,1.275),box-shadow .14s}' +
      '.cv-tile:hover{transform:translateY(-3px)}.cv-tile:active{transform:translateY(4px) scale(.97);border-bottom-width:1px}' +
      '.cv-tile img{height:8.5vh;min-height:54px;width:auto;max-width:88%;object-fit:contain;filter:drop-shadow(0 6px 6px rgba(0,0,0,.35));animation:cvBob 3.2s ease-in-out infinite}' +
      '.cv-tile:nth-child(2n) img{animation-delay:.5s}.cv-tile:nth-child(3n) img{animation-delay:1s}' +
      '.cv-tile b{font-size:clamp(1rem,1.45vw,1.3rem);font-weight:700;text-shadow:0 2px 0 rgba(0,0,0,.45)}' +
      '@keyframes cvBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-.6vh)}}' +
      '.cv-panel{margin-top:2vh;padding:2vh 2vw;border-radius:22px;background:rgba(15,23,42,.8);backdrop-filter:blur(14px);border:2px solid rgba(255,255,255,.14)}' +
      '.cv-panel,.cv-panel h2,.cv-panel b,.cv-panel a{color:#f8fafc}.cv-panel .cv-link{color:#fff}.cv-panel h2{margin:0 0 1vh;font-size:clamp(1.2rem,2.2vw,1.8rem);font-weight:600}' +
      '.cv-panel .lesson-launch{font-size:clamp(1rem,1.8vw,1.4rem)}' +
      '.cv-row{display:flex;gap:1.2vw;flex-wrap:wrap;align-items:center}.cv-link{display:inline-block;padding:1vh 1.4vw;border-radius:16px;border-bottom:5px solid rgba(0,0,0,.4);background:#0ea5e9;color:#fff;text-decoration:none;font-weight:600;font-size:clamp(1rem,1.8vw,1.4rem)}' +
      '.cv-link.g3{background:#f59e0b}.cv-link:active{transform:translateY(4px);border-bottom-width:1px}' +
      '.cv-hint{opacity:.85;font-size:clamp(.9rem,1.5vw,1.15rem);margin-top:1vh}' +
      '.cv-today{margin-top:2vh;padding:2vh 2vw 2.2vh;border-radius:28px;background:rgba(255,255,255,.92);border:2px solid rgba(255,255,255,.95);border-bottom:6px solid #38bdf8;box-shadow:0 12px 28px -12px rgba(15,42,74,.45);color:#0f2a4a}' +
      '.cv-today-hd{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:1.4vh}' +
      '.cv-today h2{margin:0;font-size:clamp(1.3rem,2.2vw,1.85rem);font-weight:800;display:flex;align-items:center;gap:10px}.cv-today h2 img{height:1.5em}' +
      '.cv-sched-pill{display:inline-flex;align-items:center;gap:8px;background:#e0f2fe;color:#0369a1;border:1.5px solid #7dd3fc;border-radius:99px;padding:5px 14px;font-size:.95rem;font-weight:800}' +
      '.cv-lessons{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:14px}' +
      '.cv-lesson{display:flex;align-items:center;gap:14px;text-decoration:none;color:#0f2a4a;padding:12px 16px;border-radius:22px;border:1.5px solid color-mix(in srgb,var(--c) 35%,#fff);border-bottom:6px solid color-mix(in srgb,var(--c) 70%,#000);background:linear-gradient(135deg,#fff 0%,color-mix(in srgb,var(--c) 22%,#fff) 100%);transition:transform .14s cubic-bezier(.175,.885,.32,1.275),box-shadow .14s;box-shadow:0 8px 18px -10px rgba(15,42,74,.45)}' +
      '.cv-lesson:hover{transform:translateY(-3px);box-shadow:0 14px 24px -10px rgba(15,42,74,.55)}.cv-lesson:active{transform:translateY(4px) scale(.98);border-bottom-width:1px}' +
      '.cv-art{position:relative;width:76px;height:76px;flex:0 0 76px;border-radius:18px;background:linear-gradient(160deg,color-mix(in srgb,var(--c) 55%,#fff),color-mix(in srgb,var(--c) 82%,#0f172a));display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 0 rgba(255,255,255,.6)}' +
      '.cv-art::after{content:"";position:absolute;bottom:6px;width:54px;height:10px;border-radius:50%;background:radial-gradient(ellipse at center,rgba(255,255,255,.55) 0%,rgba(15,23,42,.35) 65%,transparent 100%)}' +
      '.cv-art img{position:relative;z-index:1;width:62px;height:62px;object-fit:contain;filter:drop-shadow(0 4px 5px rgba(0,0,0,.35));animation:cvBob 3.2s ease-in-out infinite}' +
      '.cv-lesson .tx{flex:1;min-width:0}.cv-lesson .tx b{display:block;font-size:clamp(1.05rem,1.45vw,1.3rem);font-weight:800;line-height:1.22;color:#0f2a4a;text-wrap:balance}' +
      '.cv-lesson .tx small{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;font-size:.86rem;font-weight:600;color:#475569;margin-top:3px;overflow:hidden}' +
      '.cv-lesson .tx em{display:inline-block;margin-top:5px;font-style:normal;font-weight:800;font-size:.76rem;text-transform:uppercase;letter-spacing:.04em;background:color-mix(in srgb,var(--c) 24%,#fff);color:#0f2a4a;padding:2px 9px;border-radius:99px}' +
      '.cv-lesson .go{flex:0 0 auto;font-style:normal;font-weight:800;font-size:.98rem;background:#10b981;color:#fff;border-radius:14px;border-bottom:4px solid #047857;padding:10px 16px;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}' +
      '.cv-set{font:inherit;font-weight:800;font-size:.92rem;cursor:pointer;border:1.5px solid #cbd5e1;border-bottom:4px solid #64748b;border-radius:14px;padding:7px 14px;background:#fff;color:#0f2a4a;transition:transform .12s}' +
      '.cv-set:active{transform:translateY(3px);border-bottom-width:1px}' +
      '@media(max-width:900px){.cv-lessons{grid-template-columns:1fr}.cv-grid{grid-template-columns:repeat(2,1fr)}}';
    document.head.appendChild(st);
  }

  function activeClass() { try { return S().getActiveClass && S().getActiveClass(); } catch (e) { return null; } }
  function img(n, alt) { return '<img src="' + (n.indexOf('/') >= 0 ? n : ART + n + '.webp') + '" alt="' + (alt || '') + '" decoding="async" draggable="false">'; }

  var COLORS = ['#38bdf8', '#f59e0b', '#10b981', '#a855f7', '#f43f5e', '#0ea5e9'];
  function gradeOf(cls) { var m = /([34])/.exec((cls && cls.name) || ''); return m ? Number(m[1]) : 0; }
  function splitTitle(raw) {
    var s = String(raw || '').replace(/\s*\((Grade|Week|Unit)[^)]*\)\s*$/i, '');
    var idx = s.indexOf(': ');
    if (idx > 0 && idx < 42) return { head: s.slice(0, idx), sub: s.slice(idx + 2) };
    return { head: s, sub: '' };
  }
  function lessonCard(e, i, tag) {
    var parts = splitTitle(e.title), art = artForLesson(e);
    var inner = '<div class="cv-art"><img src="' + esc(art) + '" alt="" loading="lazy" decoding="async" draggable="false"></div>' +
      '<span class="tx"><b>' + esc(parts.head).replace(/(\d)-(\d)/g, '$1‑$2') + '</b>' + (parts.sub ? '<small>' + esc(parts.sub) + '</small>' : '') +
      (e.time ? '<em>🕐 ' + esc(e.time) + '</em>' : (tag ? '<em>✨ ' + esc(tag) + '</em>' : '')) + '</span>' +
      '<i class="go">▶ Start</i>';
    var st = ' style="--c:' + COLORS[i % COLORS.length] + '"';
    if (e.route) return '<a class="cv-lesson"' + st + ' href="' + esc(e.route) + '">' + inner + '</a>';
    if (e.view) return '<a class="cv-lesson"' + st + ' href="#" onclick="switchView(\'' + esc(e.view) + '\');return false;">' + inner + '</a>';
    return '<div class="cv-lesson"' + st + ' onclick="switchView(\'shelf\')" style="cursor:pointer;--c:' + COLORS[i % COLORS.length] + '">' + inner + '</div>';
  }
  function todayHero(cls) {
    var T = root.Timetable, g = gradeOf(cls), sug = [];
    try { sug = (T.catalog || []).filter(function (c) { return c.added && c.route && (!c.g || !g || c.g === g); }).sort(function (a, b) { return a.added < b.added ? 1 : (a.added > b.added ? -1 : 0); }).slice(0, 4); } catch (e2) { sug = []; }
    var t = null; try { t = T && cls ? T.today(cls.id) : null; } catch (e) { t = null; }
    var linked = (t && t.list ? t.list : []).filter(function (e) { return e.route || e.view; });
    var generic = (t && t.list ? t.list : []).filter(function (e) { return !e.route && !e.view; });
    var schedBadge = generic.length ? '<span class="cv-sched-pill">🕐 ' + generic.map(function (e) { return (e.time ? esc(e.time) + ' · ' : '') + esc(e.title); }).join(' | ') + '</span>' : '';
    var cards = linked.length ? linked.map(function (e, i) { return lessonCard(e, i, 'Today'); }) : sug.map(function (e, i) { return lessonCard(e, i, 'This Week'); });
    return '<div class="cv-today"><div class="cv-today-hd"><h2><img src="' + ART + 'm_lesson.webp" alt="" decoding="async">Today’s Lessons</h2>' +
      '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' + schedBadge +
      '<button type="button" class="cv-set" onclick="Timetable.edit()">📅 ' + (t && t.set ? 'Edit timetable' : 'Set timetable') + '</button></div></div>' +
      '<div class="cv-lessons">' + cards.join('') + '</div></div>';
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
        '<a class="cv-link" href="home-view/index.html?g=4" target="_blank" rel="noopener">Grade 4 home page</a>' +
        '<a class="cv-link g3" href="chuseok-cooking/index.html" target="_blank" rel="noopener">Grade 3 Week 2: Chuseok cooking homework</a></div>' +
        '<div class="cv-hint">Send this link to the parents: ' + esc(base) + 'home-view/index.html?g=3 (Grade 3) or ?g=4 (Grade 4). Chuseok cooking homework: chuseok-cooking/index.html</div></div>';
    }
    return '';
  }

  function render(container) {
    css();
    var cls = activeClass(), st = S();
    var kids = []; try { kids = cls && st.getStudentsByClass ? st.getStudentsByClass(cls.id) : []; } catch (e) { kids = []; }
    var totalXp = kids.reduce(function (n, s) { var m = st.calculateMonsterState ? st.calculateMonsterState(s.id) : {}; return n + (Number(m.totalXP != null ? m.totalXP : s.xp) || 0); }, 0);
    var d = new Date(), label = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    container.innerHTML = '<div class="cv" id="cv-root" style="background-image:url(' + ART + 'bg_class_view.webp)">' +
      '<div class="cv-hd"><div><h1>' + (cls ? esc(cls.name) : 'Class') + '</h1><small>' + esc(label) + '</small></div>' +
      '<div class="cv-kpis"><div class="cv-kpi"><b>' + kids.length + '</b><span>Pupils</span></div><div class="cv-kpi"><b>' + totalXp.toLocaleString('en-US') + '</b><span>Class XP</span></div></div>' +
      '<button type="button" class="cv-key" title="Teacher area (Command Center)" onclick="ClassView.go(\'teacher\')">' + img('m_teacher_key', 'Teacher area') + '</button></div>' +
      todayHero(cls) + '<div class="cv-grid">' + TILES.filter(function (t) { return !document.documentElement.classList.contains('class-mode') || t.cm; }).map(function (t) { return '<button type="button" class="cv-tile" data-tile="' + esc(t.id) + '" style="--c:' + t.c + '" onclick="ClassView.go(\'' + t.id + '\')">' + img(t.pic, '') + '<b>' + esc(t.t) + '</b></button>'; }).join('') + '</div>' +
      '<div id="cv-panel">' + panelHtml() + '</div></div>';
  }

  var api = {
    go: function (id) {
      var sw = root.switchView;
      if (id === 'lesson' || id === 'home') { panel = panel === id ? null : id; var p = document.getElementById('cv-panel'); if (p) { p.innerHTML = panelHtml(); if (panel && p.firstChild && p.firstChild.scrollIntoView) p.firstChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } return; }
      panel = null;
      if (id === 'sleepy') { if (root.SleepyMonster && root.SleepyMonster.open) root.SleepyMonster.open(); else if (root.openSleepyMonster) root.openSleepyMonster(); return; }
      if (id === 'karaoke') { if (root.ClassBoard && root.ClassBoard.karaoke) root.ClassBoard.karaoke(); else location.href = 'karaoke-stage/index.html'; return; }
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
