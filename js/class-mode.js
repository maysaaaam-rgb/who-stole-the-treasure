/* Class Mode: a bright, picture-first skin for the whole platform, used on the smartboard.
   A switch in the header turns it on or off (saved on this device). In Class Mode the long text menu becomes a rail of big
   3D picture buttons, the header is simplified, and "Games" opens the new Game Shelf. Teacher Mode is the normal platform. */
(function (root) {
  'use strict';
  var KEY = 'eaa_class_mode', ART = 'platform-art/';
  function S() { return root.schoolStore || root.store; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setStored(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* storage may be blocked */ } }
  function on() { return document.documentElement.classList.contains('class-mode'); }

  /* ---------- the picture rail (replaces the sidebar text menu) ---------- */
  var RAIL = [
    { id: 'classview', pic: 'm_home', t: 'Home', c: '#38bdf8', views: ['classview'] },
    { id: 'lesson', pic: 'm_lesson', t: 'Lesson', c: '#0ea5e9', views: [] },
    { id: 'board', pic: 'm_scoreboard', t: 'Scores', c: '#f59e0b', views: ['board'] },
    { id: 'shelf', pic: 'm_games', t: 'Games', c: '#a855f7', views: ['shelf', 'library'] },
    { id: 'pick', pic: 'm_pick', t: 'Pick', c: '#8b5cf6', views: [] },
    { id: 'timer', pic: 'm_timer', t: 'Timer', c: '#f43f5e', views: [] },
    { id: 'rewards', pic: 'm_rewards', t: 'Rewards', c: '#10b981', views: ['rewards', 'store'] },
    { id: 'teacher', pic: 'm_teacher_key', t: 'Teacher', c: '#64748b', views: [] }
  ];
  function rail(view) {
    return '<nav class="cm-rail" aria-label="Class menu">' + RAIL.map(function (r) {
      var act = r.views.indexOf(view) >= 0;
      return '<button type="button" class="cm-b' + (act ? ' is-on' : '') + '" style="--c:' + r.c + '" onclick="ClassMode.go(\'' + r.id + '\')" title="' + esc(r.t) + '">' +
        '<img src="' + ART + r.pic + '.webp" alt="" draggable="false"><span>' + esc(r.t) + '</span></button>';
    }).join('') + '</nav>';
  }

  /* ---------- the switch in the header ---------- */
  function paintToggle() {
    var b = document.getElementById('cm-toggle'); if (!b) return;
    b.innerHTML = on() ? '<span>🧑‍🏫</span> Teacher Mode' : '<span>🏫</span> Class Mode';
    b.title = on() ? 'Back to the normal teacher platform' : 'Bright smartboard look with big picture buttons';
  }
  function ensureToggle() {
    if (document.getElementById('cm-toggle')) return paintToggle();
    var right = document.querySelector('.app-header .header-right'); if (!right) return;
    var b = document.createElement('button'); b.type = 'button'; b.id = 'cm-toggle'; b.className = 'cm-toggle';
    b.addEventListener('click', function () { api.set(!on()); });
    right.insertBefore(b, right.firstChild); paintToggle();
  }

  /* ---------- class chips in the header (replace the small drop-down in Class Mode) ---------- */
  function shortName(n) { var m = /(\d+\s*[A-Za-z]?)\s*$/.exec(String(n || '')); return m ? m[1].replace(/\s+/g, '') : String(n || '').slice(0, 4); }
  function paintChips() {
    var right = document.querySelector('.app-header .header-right'), box = document.getElementById('cm-classes'); if (!right) return;
    if (!on()) { if (box) box.remove(); return; }
    var st = S(), list = []; try { list = (st.getClasses ? st.getClasses() : []).filter(function (c) { return !c.archived; }); } catch (e) { list = []; }
    var act = null; try { act = st.getActiveClass && st.getActiveClass(); } catch (e2) { act = null; }
    if (!box) { box = document.createElement('div'); box.id = 'cm-classes'; box.className = 'cm-classes'; var sel = document.getElementById('header-class-select'); right.insertBefore(box, sel || right.firstChild); }
    box.innerHTML = list.map(function (c) { return '<button type="button" class="cm-cls' + (act && c.id === act.id ? ' on' : '') + '" onclick="ClassMode.cls(\'' + esc(c.id) + '\')" title="' + esc(c.name) + '">' + esc(shortName(c.name)) + '</button>'; }).join('');
  }
  var origSwitch = null;
  function hookSwitch() {
    if (origSwitch || !root.switchView) return; origSwitch = root.switchView;
    root.switchView = function () { var r = origSwitch.apply(this, arguments); try { setTimeout(paintChips, 0); } catch (e) { /* optional */ } return r; };
  }

  /* ---------- 3D icons on the teacher pages (Command Center buttons, Lesson plans title) ---------- */
  var ICONS = { 'Open Class Board': 'm_scoreboard', 'Take attendance': 'h_tick_stamp', 'Progress Check': 'h_calendar', 'Homework': 'h_homework_book', 'Lessons': 'm_lesson', 'Store': 'm_rewards' };
  function decorate() {
    if (!on()) return; var c = document.getElementById('app-view-container'); if (!c) return;
    [].forEach.call(c.querySelectorAll('.cc-links button'), function (b) {
      if (b.querySelector('img')) return; var t = b.textContent.replace(/^[^A-Za-z]+/, '').trim(), n = ICONS[t];
      if (n) b.innerHTML = '<img src="' + ART + n + '.webp" alt="" draggable="false">' + esc(t);
    });
    [].forEach.call(c.querySelectorAll('.lp-head h2'), function (h) {
      if (h.querySelector('img')) return; var t = h.textContent.replace(/^[^A-Za-z]+/, '').trim();
      h.innerHTML = '<img src="' + ART + 'm_lesson.webp" alt="" draggable="false">' + esc(t);
    });
  }
  function watch() {
    var c = document.getElementById('app-view-container'); if (!c || c.__cmWatch) return; c.__cmWatch = 1;
    try { new MutationObserver(function () { decorate(); }).observe(c, { childList: true, subtree: false }); } catch (e) { /* optional */ }
    decorate();
  }

  /* ---------- Game Shelf: big picture cards for lessons and games ---------- */
  var shelf = { grade: null, kind: 'all', q: '', curate: false, showHidden: false };
  function activeGrade() {
    try { var c = S().getActiveClass && S().getActiveClass(); var m = c && /([34])/.exec(c.name || ''); return m ? Number(m[1]) : 0; } catch (e) { return 0; }
  }
  function gradeOfGame(g) {
    var s = (String(g.grade || '') + ' ' + (Array.isArray(g.grades) ? g.grades.join(' ') : String(g.grades || ''))).toLowerCase(), has3 = /\b3\b|grade 3|third/.test(s), has4 = /\b4\b|grade 4|fourth/.test(s);
    return has3 && has4 ? 'both' : (has3 ? 3 : (has4 ? 4 : 'both'));
  }
  /* Real artwork for the cards that used to show a plain controller emoji (all files are already part of the site). */
  var THUMBS = {
    'alley-fling': 'unit2-throw/art/boss.webp',
    'chuseok-arcade-g3': 'unit2-g3-lessons/art/august_happy.webp',
    'chuseok-cooking-g3': 'unit2-g3-cooking/art/songpyeon.webp',
    'revision-quest-g4-u12': 'unit12-revision-g4/art/coins.webp',
    'worksheet-store-g4-u12': ART + 'h_homework_book.webp',
    'telephone-pictionary': ART + 'h_pencil.webp',
    'arcade-g3-u2': ART + 'r_chest.webp',
    'arcade-g4-u2': ART + 'r_chest.webp'
  };
  function isLesson(g) { return (g.tags || []).indexOf('lesson') >= 0 || /lesson/i.test(g.type || ''); }
  function colorFor(g, i) { return ['#38bdf8', '#f59e0b', '#10b981', '#f43f5e', '#a855f7', '#0ea5e9'][i % 6]; }
  function shelfList() {
    var LC = root.LibraryCurate;
    var all = (root.GAMES_DATA || []).filter(function (g) { return g && g.route && g.status !== 'hidden' && g.status !== 'archived' && (!LC || (shelf.showHidden ? LC.isHidden(g.id) : !LC.isHidden(g.id))); });
    var gr = shelf.grade == null ? (activeGrade() || 0) : shelf.grade;
    return all.filter(function (g) {
      if (gr) { var x = gradeOfGame(g); if (x !== 'both' && x !== gr) return false; }
      if (shelf.kind === 'lesson' && !isLesson(g)) return false;
      if (shelf.kind === 'game' && isLesson(g)) return false;
      if (shelf.q) { var hay = (g.title + ' ' + (g.tags || []).join(' ') + ' ' + (g.categoryLabel || '')).toLowerCase(); if (hay.indexOf(shelf.q) < 0) return false; }
      return true;
    }).sort(function (a, b) { var LC2 = root.LibraryCurate, sa = LC2 && LC2.isStar(a.id) ? 1 : 0, sb = LC2 && LC2.isStar(b.id) ? 1 : 0; return (sb - sa) || ((isLesson(b) ? 1 : 0) - (isLesson(a) ? 1 : 0)); });
  }
  function shelfHtml() {
    var gr = shelf.grade == null ? (activeGrade() || 0) : shelf.grade, list = shelfList();
    function chip(label, active, fn) { return '<button type="button" class="cm-chip' + (active ? ' on' : '') + '" onclick="' + fn + '">' + label + '</button>'; }
    return '<div class="cm-shelf"><div class="cm-shelf-hd"><div><h1>Game Shelf</h1><small>' + list.length + ' to play</small></div>' +
      '<div class="cm-chips">' + chip('Grade 3', gr === 3, "ClassMode.shelf('grade',3)") + chip('Grade 4', gr === 4, "ClassMode.shelf('grade',4)") + chip('All', !gr, "ClassMode.shelf('grade',0)") + '<i></i>' +
      chip('Everything', shelf.kind === 'all', "ClassMode.shelf('kind','all')") + chip('Lessons', shelf.kind === 'lesson', "ClassMode.shelf('kind','lesson')") + chip('Games', shelf.kind === 'game', "ClassMode.shelf('kind','game')") + '<i></i>' + chip('✂ Clean up', shelf.curate, "ClassMode.curate()") + '</div></div>' + curateBar() +
      '<div class="cm-search"><input id="cm-q" type="search" placeholder="Search…" value="' + esc(shelf.q) + '" oninput="ClassMode.shelf(\'q\',this.value)"></div>' +
      '<div class="cm-cards">' + (list.length ? list.map(function (g, i) {
        var c = colorFor(g, i);
        var LC3 = root.LibraryCurate, star = LC3 && LC3.isStar(g.id), hid = LC3 && LC3.isHidden(g.id), ttl = esc(String(g.title || '').replace(/^[^\w(]+/u, '').replace(/\s*\((grade|week)[^)]*\)\s*$/i, ''));
        var pic = '<div class="cm-pic">' + (THUMBS[g.id] ? '<img class="cm-img" src="' + esc(THUMBS[g.id]) + '" alt="" loading="lazy" draggable="false">' : '<span>' + esc(g.thumbnailIcon || '🎮') + '</span>') + (isLesson(g) ? '<em>LESSON</em>' : '') + (star ? '<u class="cm-starmark">⭐</u>' : '') + '</div>';
        if (!shelf.curate) return '<a class="cm-card' + (hid ? ' is-hidden' : '') + '" style="--c:' + c + '" href="' + esc(g.route) + '">' + pic + '<b>' + ttl + '</b><i class="cm-play">▶ Play</i></a>';
        return '<div class="cm-card cur' + (hid ? ' is-hidden' : '') + '" style="--c:' + c + '">' + pic + '<b>' + ttl + '</b><div class="cm-cur"><a class="cm-try" href="' + esc(g.route) + '" target="_blank" rel="noopener">▶ Try</a>' +
          (hid ? '<button type="button" onclick="ClassMode.cur(\'restore\',\'' + esc(g.id) + '\')">↺ Restore</button>' : '<button type="button" class="k' + (star ? ' on' : '') + '" onclick="ClassMode.cur(\'star\',\'' + esc(g.id) + '\')">' + (star ? '⭐ Kept' : '⭐ Keep') + '</button><button type="button" class="h" onclick="ClassMode.cur(\'hide\',\'' + esc(g.id) + '\')">🙈 Hide</button>') + '</div></div>';
      }).join('') : '<p class="cm-empty">Nothing here. Try another filter.</p>') + '</div></div>';
  }
  function curateBar() {
    var LC = root.LibraryCurate; if (!shelf.curate || !LC) return '';
    function b(label, fn, cls) { return '<button type="button" class="cm-chip' + (cls ? ' ' + cls : '') + '" onclick="' + fn + '">' + label + '</button>'; }
    return '<div class="cm-curbar"><span>✂ Clean up: tap <b>Try</b> to look, then <b>Keep</b> the good ones and <b>Hide</b> the rest. Saved on this device.</span><div class="cm-chips">' +
      b((shelf.showHidden ? '← Back to the shelf' : '🙈 Hidden (' + LC.hiddenIds().length + ')'), "ClassMode.curate('hidden')", shelf.showHidden ? 'on' : '') + b('📋 Copy list', 'LibraryCurate.copy()') + b('📥 Load list', "LibraryCurate.openImport(function(){ClassMode.shelf('x')})") + b('↺ Restore all', "ClassMode.cur('clear')") + '</div></div>';
  }
  function renderShelf(container) { container.innerHTML = shelfHtml(); }

  var api = {
    on: on, rail: rail, renderShelf: renderShelf,
    cls: function (id) { try { S().setActiveClass(id); } catch (e) { return; } var v = (location.hash || '#classview').replace(/^#/, '').split('/')[0] || 'classview'; if (root.switchView) root.switchView(v); paintChips(); },
    set: function (v) {
      document.documentElement.classList.toggle('class-mode', !!v); setStored(v ? '1' : '0'); paintToggle(); paintChips(); decorate();
      if (root.switchView) root.switchView(v ? 'classview' : 'command');
    },
    curate: function (v) {
      if (v === true) { if (!on()) { document.documentElement.classList.add('class-mode'); setStored('1'); paintToggle(); paintChips(); } shelf.curate = true; if (root.switchView) root.switchView('shelf'); return; }
      if (v === 'hidden') shelf.showHidden = !shelf.showHidden; else { shelf.curate = !shelf.curate; if (!shelf.curate) shelf.showHidden = false; }
      var c = document.getElementById('app-view-container'); if (c) renderShelf(c);
    },
    cur: function (what, id) {
      var LC = root.LibraryCurate; if (!LC) return;
      if (what === 'hide') LC.hide(id); else if (what === 'restore') LC.restore(id); else if (what === 'star') LC.toggleStar(id);
      else if (what === 'clear') { if (!root.confirm || root.confirm('Restore every hidden lesson and remove all stars on this device?')) LC.clearAll(); else return; }
      var c = document.getElementById('app-view-container'); if (c) { var y = root.scrollY; renderShelf(c); root.scrollTo(0, y); }
    },
    shelf: function (k, v) {
      if (k === 'x') { /* just redraw */ } else if (k === 'grade') shelf.grade = Number(v); else if (k === 'kind') shelf.kind = v; else if (k === 'q') shelf.q = String(v || '').toLowerCase();
      var c = document.getElementById('app-view-container'); if (!c) return;
      if (k === 'q') { var cards = c.querySelector('.cm-cards'), tmp = document.createElement('div'); tmp.innerHTML = shelfHtml(); if (cards) cards.innerHTML = tmp.querySelector('.cm-cards').innerHTML; return; }
      renderShelf(c);
    },
    go: function (id) {
      var sw = root.switchView; if (!sw) return;
      if (id === 'classview' || id === 'board' || id === 'shelf' || id === 'store' || id === 'rewards') { sw(id); return; }
      if (id === 'teacher') { api.set(false); return; }
      if (id === 'timer') { if (root.openClassroomToolkitModal) root.openClassroomToolkitModal('timer'); return; }
      if (id === 'pick') { sw('board'); setTimeout(function () { try { root.ClassBoard && root.ClassBoard.pick(); } catch (e) { /* optional */ } }, 500); return; }
      if (id === 'lesson') { sw('classview'); setTimeout(function () { try { root.ClassView && root.ClassView.go('lesson'); } catch (e) { /* optional */ } }, 200); }
    }
  };
  root.ClassMode = api; root.renderGameShelf = renderShelf;

  if (stored() === '1') document.documentElement.classList.add('class-mode');
  function init() { ensureToggle(); hookSwitch(); paintChips(); watch(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  setTimeout(function () { ensureToggle(); hookSwitch(); paintChips(); watch(); decorate(); }, 1500);
})(typeof window !== 'undefined' ? window : this);
