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
    { id: 'store', pic: 'm_rewards', t: 'Rewards', c: '#10b981', views: ['store'] },
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

  /* ---------- Game Shelf: big picture cards for lessons and games ---------- */
  var shelf = { grade: null, kind: 'all', q: '' };
  function activeGrade() {
    try { var c = S().getActiveClass && S().getActiveClass(); var m = c && /([34])/.exec(c.name || ''); return m ? Number(m[1]) : 0; } catch (e) { return 0; }
  }
  function gradeOfGame(g) {
    var s = (String(g.grade || '') + ' ' + (Array.isArray(g.grades) ? g.grades.join(' ') : String(g.grades || ''))).toLowerCase(), has3 = /\b3\b|grade 3|third/.test(s), has4 = /\b4\b|grade 4|fourth/.test(s);
    return has3 && has4 ? 'both' : (has3 ? 3 : (has4 ? 4 : 'both'));
  }
  function isLesson(g) { return (g.tags || []).indexOf('lesson') >= 0 || /lesson/i.test(g.type || ''); }
  function colorFor(g, i) { return ['#38bdf8', '#f59e0b', '#10b981', '#f43f5e', '#a855f7', '#0ea5e9'][i % 6]; }
  function shelfList() {
    var all = (root.GAMES_DATA || []).filter(function (g) { return g && g.route && g.status !== 'hidden'; });
    var gr = shelf.grade == null ? (activeGrade() || 0) : shelf.grade;
    return all.filter(function (g) {
      if (gr) { var x = gradeOfGame(g); if (x !== 'both' && x !== gr) return false; }
      if (shelf.kind === 'lesson' && !isLesson(g)) return false;
      if (shelf.kind === 'game' && isLesson(g)) return false;
      if (shelf.q) { var hay = (g.title + ' ' + (g.tags || []).join(' ') + ' ' + (g.categoryLabel || '')).toLowerCase(); if (hay.indexOf(shelf.q) < 0) return false; }
      return true;
    }).sort(function (a, b) { return (isLesson(b) ? 1 : 0) - (isLesson(a) ? 1 : 0); });
  }
  function shelfHtml() {
    var gr = shelf.grade == null ? (activeGrade() || 0) : shelf.grade, list = shelfList();
    function chip(label, active, fn) { return '<button type="button" class="cm-chip' + (active ? ' on' : '') + '" onclick="' + fn + '">' + label + '</button>'; }
    return '<div class="cm-shelf"><div class="cm-shelf-hd"><div><h1>Game Shelf</h1><small>' + list.length + ' to play</small></div>' +
      '<div class="cm-chips">' + chip('Grade 3', gr === 3, "ClassMode.shelf('grade',3)") + chip('Grade 4', gr === 4, "ClassMode.shelf('grade',4)") + chip('All', !gr, "ClassMode.shelf('grade',0)") + '<i></i>' +
      chip('Everything', shelf.kind === 'all', "ClassMode.shelf('kind','all')") + chip('Lessons', shelf.kind === 'lesson', "ClassMode.shelf('kind','lesson')") + chip('Games', shelf.kind === 'game', "ClassMode.shelf('kind','game')") + '</div></div>' +
      '<div class="cm-search"><input id="cm-q" type="search" placeholder="Search…" value="' + esc(shelf.q) + '" oninput="ClassMode.shelf(\'q\',this.value)"></div>' +
      '<div class="cm-cards">' + (list.length ? list.map(function (g, i) {
        var c = colorFor(g, i);
        return '<a class="cm-card" style="--c:' + c + '" href="' + esc(g.route) + '"><div class="cm-pic"><span>' + esc(g.thumbnailIcon || '🎮') + '</span>' + (isLesson(g) ? '<em>LESSON</em>' : '') + '</div>' +
          '<b>' + esc(String(g.title || '').replace(/^[^\w(]+/u, '').replace(/\s*\((grade|week)[^)]*\)\s*$/i, '')) + '</b><i class="cm-play">▶ Play</i></a>';
      }).join('') : '<p class="cm-empty">Nothing here. Try another filter.</p>') + '</div></div>';
  }
  function renderShelf(container) { container.innerHTML = shelfHtml(); }

  var api = {
    on: on, rail: rail, renderShelf: renderShelf,
    set: function (v) {
      document.documentElement.classList.toggle('class-mode', !!v); setStored(v ? '1' : '0'); paintToggle();
      if (root.switchView) root.switchView(v ? 'classview' : 'command');
    },
    shelf: function (k, v) {
      if (k === 'grade') shelf.grade = Number(v); else if (k === 'kind') shelf.kind = v; else if (k === 'q') shelf.q = String(v || '').toLowerCase();
      var c = document.getElementById('app-view-container'); if (!c) return;
      if (k === 'q') { var cards = c.querySelector('.cm-cards'), tmp = document.createElement('div'); tmp.innerHTML = shelfHtml(); if (cards) cards.innerHTML = tmp.querySelector('.cm-cards').innerHTML; return; }
      renderShelf(c);
    },
    go: function (id) {
      var sw = root.switchView; if (!sw) return;
      if (id === 'classview' || id === 'board' || id === 'shelf' || id === 'store') { sw(id); return; }
      if (id === 'teacher') { api.set(false); return; }
      if (id === 'timer') { if (root.openClassroomToolkitModal) root.openClassroomToolkitModal('timer'); return; }
      if (id === 'pick') { sw('board'); setTimeout(function () { try { root.ClassBoard && root.ClassBoard.pick(); } catch (e) { /* optional */ } }, 500); return; }
      if (id === 'lesson') { sw('classview'); setTimeout(function () { try { root.ClassView && root.ClassView.go('lesson'); } catch (e) { /* optional */ } }, 200); }
    }
  };
  root.ClassMode = api; root.renderGameShelf = renderShelf;

  if (stored() === '1') document.documentElement.classList.add('class-mode');
  function init() { ensureToggle(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  setTimeout(ensureToggle, 1500);
})(typeof window !== 'undefined' ? window : this);
