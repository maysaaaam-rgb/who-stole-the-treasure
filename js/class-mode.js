/* Class Mode: a bright, picture-first skin for the whole platform, used on the smartboard.
   A switch in the header turns it on or off (saved on this device). In Class Mode the long text menu becomes a rail of big
   3D picture buttons, the header is simplified, and "Games" opens the dedicated Game Shelf (ONLY true games).
   Lessons, reviews, quizzes, printables, and homework live in Lessons & Library. */
(function (root) {
  'use strict';
  var KEY = 'eaa_class_mode', ART = 'platform-art/';
  function S() { return root.schoolStore || root.store; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setStored(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* storage may be blocked */ } }
  function on() { return document.documentElement.classList.contains('class-mode'); }

  /* ---------- the picture rail (5 Connected Hubs — zero vertical overflow) ---------- */
  var RAIL = [
    { id: 'board', pic: 'm_scoreboard', t: 'Class Board', c: '#6E56CF', views: ['board', 'classview'] },
    { id: 'library', pic: 'm_lesson', t: 'Lessons & Games', c: '#0ea5e9', views: ['library', 'curriculum', 'shelf'] },
    { id: 'store', pic: 'm_rewards', t: 'Store & Podium', c: '#10b981', views: ['store', 'rewards', 'closet', 'monster'] },
    { id: 'calendar', pic: 'h_calendar', t: 'Timetable', c: '#f59e0b', views: ['calendar'] },
    { id: 'command', pic: 'm_teacher_key', t: 'Teacher Hub', c: '#64748b', views: ['command'] }
  ];
  function openGameMaker(opts) {
    opts = opts || {};
    var cls = null;
    try { cls = S().getActiveClass && S().getActiveClass(); } catch (e) { cls = null; }
    var cid = opts.classId || (cls && cls.id) || '';
    var g = opts.grade || activeGrade() || (/4/.test(cid) ? 4 : 3);
    var setId = opts.setId || (g === 4 ? 'u14-g4' : 'u14-g3');
    try {
      var cur = JSON.parse(localStorage.getItem('eaa_gm_v2') || '{}') || {};
      if (cid) cur.classId = cid;
      cur.qGrade = String(g);
      if (opts.setId || !cur.setId) cur.setId = setId;
      if (opts.modeId) cur.modeId = opts.modeId;
      localStorage.setItem('eaa_gm_v2', JSON.stringify(cur));
    } catch (e2) { /* ignore */ }
    var url = 'game-maker/index.html?class=' + encodeURIComponent(cid || 'class-3a') + '&set=' + encodeURIComponent(setId);
    if (opts.modeId) url += '&game=' + encodeURIComponent(opts.modeId);
    location.href = url;
  }
  root.openGameMaker = openGameMaker;
  function rail(view) {
    return '<nav class="cm-rail" aria-label="Class menu">' + RAIL.map(function (r) {
      var act = r.views.indexOf(view) >= 0, src = r.pic.indexOf('/') >= 0 ? r.pic : ART + r.pic + '.webp';
      return '<button type="button" class="cm-b' + (act ? ' is-on' : '') + '" data-rail="' + esc(r.id) + '" style="--c:' + r.c + '" onclick="ClassMode.go(\'' + r.id + '\')" title="' + esc(r.t) + '">' +
        '<img src="' + src + '" alt="" decoding="async" draggable="false"><span>' + esc(r.t) + '</span></button>';
    }).join('') + '</nav>';
  }

  /* ---------- the switch in the header ---------- */
  function paintToggle() {
    var b = document.getElementById('cm-toggle'); if (!b) return;
    b.innerHTML = on() ? '<span>🧑‍🏫</span> Teacher<em class="cm-mode-word" style="font-style:normal"> Hub</em>' : '<span>🏫</span> Smartboard<em class="cm-mode-word" style="font-style:normal"> Rail</em>';
    b.title = on() ? 'Switch sidebar to compact text menu' : 'Switch sidebar to big picture buttons';
  }
  function ensureToggle() {
    var right = document.querySelector('.app-header .header-right'); if (!right) return;
    /* Sleepy Mio is in the Create menu, the Class Board dock and the rail (no header button) */
    var oldSl = document.getElementById('cm-sleepy-btn'); if (oldSl) oldSl.remove();
    if (!document.getElementById('cm-gm-btn')) {
      var gm = document.createElement('button'); gm.type = 'button'; gm.id = 'cm-gm-btn'; gm.className = 'cm-toggle cm-gm-btn';
      gm.innerHTML = '<span>🎮</span> Game Maker';
      gm.title = 'Open Game Maker with the active class and monsters';
      gm.style.cssText = 'background:linear-gradient(180deg,#6E56CF,#4C389E);color:#fff;border:1.5px solid #8D75E6;border-bottom:4px solid #37267A;border-radius:12px;padding:7px 14px;font-weight:800;font-size:.86rem;display:inline-flex;align-items:center;gap:6px;cursor:pointer;box-shadow:0 3px 10px rgba(110,86,207,.28);transition:transform .12s cubic-bezier(.175,.885,.32,1.275)';
      gm.addEventListener('click', function () { openGameMaker(); });
      right.insertBefore(gm, right.firstChild);
    }
    if (document.getElementById('cm-toggle')) return paintToggle();
    var b = document.createElement('button'); b.type = 'button'; b.id = 'cm-toggle'; b.className = 'cm-toggle';
    b.addEventListener('click', function () { api.set(!on()); });
    right.insertBefore(b, right.firstChild); paintToggle();
  }

  /* ---------- class chips in the header (1-tap class switcher across both modes) ---------- */
  function shortName(n) { var m = /(\d+\s*[A-Za-z]?)\s*$/.exec(String(n || '')); return m ? m[1].replace(/\s+/g, '') : String(n || '').slice(0, 4); }
  function paintChips() {
    var right = document.querySelector('.app-header .header-right'), box = document.getElementById('cm-classes'); if (!right) return;
    var st = S(), list = []; try { list = (st.getClasses ? st.getClasses() : []).filter(function (c) { return !c.archived; }); } catch (e) { list = []; }
    var act = null; try { act = st.getActiveClass && st.getActiveClass(); } catch (e2) { act = null; }
    var sel = document.getElementById('header-class-select');
    if (sel) sel.style.display = 'none';
    if (!box) { box = document.createElement('div'); box.id = 'cm-classes'; box.className = 'cm-classes'; right.insertBefore(box, sel || right.firstChild); }
    box.innerHTML = list.map(function (c) { return '<button type="button" class="cm-cls' + (act && c.id === act.id ? ' on' : '') + '" onclick="ClassMode.cls(\'' + esc(c.id) + '\')" title="' + esc(c.name) + '">' + esc(shortName(c.name)) + '</button>'; }).join('');
  }
  var origSwitch = null;
  function hookSwitch() {
    if (origSwitch || !root.switchView) return; origSwitch = root.switchView;
    root.switchView = function () { var r = origSwitch.apply(this, arguments); try { setTimeout(paintChips, 0); } catch (e) { /* optional */ } return r; };
  }

  /* ---------- 3D icons on the teacher pages (Command Center buttons, Lesson plans title) ---------- */
  var ICONS = { 'Open Class Board': 'm_scoreboard', 'Game Maker': 'm_games', 'Take attendance': 'h_tick_stamp', 'Progress Check': 'h_calendar', 'Homework': 'h_homework_book', 'Lessons': 'm_lesson', 'Store': 'm_rewards' };
  function decorate() {
    if (!on()) return; var c = document.getElementById('app-view-container'); if (!c) return;
    [].forEach.call(c.querySelectorAll('.cc-links button'), function (b) {
      if (b.querySelector('img')) return; var t = b.textContent.replace(/^[^A-Za-z]+/, '').trim(), n = ICONS[t];
      if (n) b.innerHTML = '<img src="' + ART + n + '.webp" alt="" decoding="async" draggable="false">' + esc(t);
    });
    [].forEach.call(c.querySelectorAll('.lp-head h2'), function (h) {
      if (h.querySelector('img')) return; var t = h.textContent.replace(/^[^A-Za-z]+/, '').trim();
      h.innerHTML = '<img src="' + ART + 'm_lesson.webp" alt="" decoding="async" draggable="false">' + esc(t);
    });
  }
  function watch() {
    var c = document.getElementById('app-view-container'); if (!c || c.__cmWatch) return; c.__cmWatch = 1;
    try { new MutationObserver(function () { decorate(); }).observe(c, { childList: true, subtree: false }); } catch (e) { /* optional */ }
    decorate();
  }

  /* ---------- Game Shelf: ONLY true games, ordered by gameOrder ---------- */
  var shelf = { grade: null, kind: 'all', q: '', curate: false, showHidden: false };
  function activeGrade() {
    try { var c = S().getActiveClass && S().getActiveClass(); var m = c && /([34])/.exec(c.name || ''); return m ? Number(m[1]) : 0; } catch (e) { return 0; }
  }
  function gradeOfGame(g) {
    var s = (String(g.grade || '') + ' ' + (Array.isArray(g.grades) ? g.grades.join(' ') : String(g.grades || ''))).toLowerCase(), has3 = /\b3\b|grade 3|third/.test(s), has4 = /\b4\b|grade 4|fourth/.test(s);
    return has3 && has4 ? 'both' : (has3 ? 3 : (has4 ? 4 : 'both'));
  }
  /* Real artwork for cards (all files are already part of the site). */
  var THUMBS = {
    'gamemaker-g3': ART + 'm_games.webp',
    'gamemaker-g4': ART + 'm_games.webp',
    'rev-u14-g3': 'assets/shelf/bamboozle-g3-u2.webp',
    'rev-u14-g4': 'assets/shelf/bamboozle-g4-u2.webp',
    'u1-rev': 'assets/shelf/bamboozle-g3-u1.webp',
    'alley-fling': 'unit2-throw/art/boss.webp',
    'chuseok-arcade-g3': 'unit2-g3-lessons/art/august_happy.webp',
    'chuseok-cooking-g3': 'unit2-g3-cooking/art/songpyeon.webp',
    'revision-quest-g4-u12': 'unit12-revision-g4/art/coins.webp',
    'worksheet-store-g4-u12': ART + 'h_homework_book.webp',
    'telephone-pictionary': ART + 'h_pencil.webp',
    'arcade-g3-u2': ART + 'r_chest.webp',
    'arcade-g4-u2': ART + 'r_chest.webp',
    'unit3-g4-money-quiz-4skills': 'unit3-g3-lessons/art/w_jar_saving.webp',
    'unit3-g3-quiz': 'unit3-g4-lessons/art/c_polar_bear.webp',
    'lingo-g3-u3-review': 'lingo-g3-u3-review/cast/bubbles_idle.webp',
    'unit3-money-mission': 'unit3-g3-lessons/art/s_find_bill.webp',
    'unit3-arctic-homework': 'unit3-g4-lessons/art/c_polar_bear.webp',
    'alley-fling-u3': 'unit2-throw/art/boss.webp',
    'chuseok-moon-song': 'assets/shelf/chuseok-moon-g3.webp',
    'arcade-g3-u3': ART + 'r_chest.webp',
    'arcade-g4-u3': ART + 'r_chest.webp',
    'bamboozle-g3-u3': 'assets/shelf/bamboozle-g3-u2.webp',
    'bamboozle-g4-u3': 'assets/shelf/bamboozle-g4-u2.webp',
    'race-g3-u3': 'assets/shelf/race-g3-u2.webp',
    'race-g4-u3': 'assets/shelf/race-g4-u2.webp',
    'shop-counter-g3-u3': 'unit3-g3-lessons/art/c_cashier.webp',
    'cars-l5-g4': 'unit3-g4-lessons/art/car_electric.webp',
    'u3-g3-arctic-words': 'unit3-g4-lessons/art/w_polar_bear.webp',
    'u3-g3-word-city': 'unit3-g4-lessons/art/car_solar.webp',
    'board-u3-g3-bear': 'unit3-g4-lessons/art/c_polar_bear.webp',
    'board-u3-g4-money': 'unit3-g3-lessons/art/w_jar_saving.webp',
    'unit3-g3-quiz-results': ART + 'h_tick_stamp.webp',
    'unit3-g4-quiz-results': ART + 'h_tick_stamp.webp',
    'cat-meme-posters': 'cat-meme-posters/art/it.webp',
    'simon-says-grade3-cooking': 'assets/shelf/simon-says-grade3.webp',
    'unit4-g3-case1': 'unit4-g3-lessons/art/o_mona_frame.webp',
    'unit4-g3-case2': 'unit4-g3-lessons/art/o_newspaper.webp',
    'rev-g3-museum': 'unit4-g3-lessons/art/c_daphne_case.webp',
    'rev-u4-g3': 'unit4-g3-angry-mountain/art/o_volcano.webp',
    'unit4-g4-team-players': 'unit4-g4-lessons/art/o_basketball.webp',
    'rev-g4-teamwork': 'unit4-g4-lessons/art/o_basketball.webp',
    'rev-g4-show': 'assets/shelf/karaoke-stage.webp',
    'rev-u4-g4': 'unit4-g4-lessons/art/o_basketball.webp',
    'u4-g3-l3-mountain': 'unit4-g3-angry-mountain/art/o_volcano.webp',
    'u4-g3-l4-phonics': 'unit4-g3-phonics-think/art/o_wind.webp',
    'rev-g3-mountain': 'unit4-g3-angry-mountain/art/c_family_boat.webp'
  };
  /* One picture per card in assets/shelf/<card id>.webp (transparent 3D stickers); a card without a file keeps its emoji. */
  var SHELF_ART = [
    'advice',
    'alice-cards-4a',
    'alice-cards-4b',
    'alice-homework',
    'alice-party-home-4a',
    'alice-party-home-4b',
    'alice-quest',
    'bamboozle-g3-u1',
    'bamboozle-g3-u2',
    'bamboozle-g4-u1',
    'bamboozle-g4-u2',
    'bear-l2-g4',
    'biome-crafter',
    'brain-explorers',
    'brain-hackers',
    'brain-quit',
    'camp-mystery',
    'cat-vs-dog',
    'changing-l1-g4',
    'chuseok-festival',
    'chuseok-games',
    'chuseok-moon-g3',
    'city-mouse',
    'clara-inventor',
    'clil-lab',
    'creature-cafe',
    'detective-prep',
    'dino-arena',
    'dino-dig',
    'dino-expedition',
    'eco-engineers',
    'expedition',
    'fantasy-creatures',
    'feelings',
    'firefighter',
    'first-harvest-g3',
    'forest-adaptation',
    'forest-rangers-g4',
    'forest-safari',
    'freeze-game',
    'good-ideas-lab',
    'harvest-feast',
    'ice-l3-g4',
    'inventor-forge',
    'inventor-lab',
    'jungle',
    'karaoke-stage',
    'meme-rules',
    'money-l1-g3',
    'money-l2-g3',
    'money-l3-g3',
    'money-l4-g3',
    'monster-day',
    'monster-evolution',
    'monster-lab',
    'monster-studio',
    'nasa-mission',
    'neighbourhood',
    'ninja-trials',
    'ocean-cleaners',
    'phonics-adventure',
    'poem-l4-g4',
    'pokemon',
    'predictions',
    'print-g3-u2',
    'print-g4-u2',
    'quiz-g3-u1-after-school-inventor',
    'race-g3-u2',
    'race-g4-u2',
    'res-global-readings-2',
    'res-global-readings-3',
    'restaurant',
    'robots',
    'room-rescue',
    'simon-says-grade3',
    'simon-says-grade4',
    'smart-farm',
    'solar-system',
    'sound-detective',
    'space-cadet',
    'story',
    'story-engine-alice',
    'story-engine-forest',
    'swallow-gift-g4',
    'treasure',
    'twin-gates',
    'unit-1-diagnostic',
    'watch-answer-bean-g3',
    'week-song-g4',
    'week4-g3-daphne',
    'week4-g4-captain',
    'wildlife-detective',
    'wind-and-sun',
    'wizard-of-oz',
    'wonderland-lesson1',
    'wonderland-lesson2',
    'wonderland-lesson3',
    'wonderland-quiz-briefing',
    'yesterday-detectives',
    'young-inventor'
  ];
  function thumbFor(g) {
    if (THUMBS[g.id]) return THUMBS[g.id];
    return SHELF_ART.indexOf(g.id) >= 0 ? 'assets/shelf/' + g.id + '.webp' : (g.thumbnailUrl || g.coverImage || '');
  }
  function isPureGame(g) { return g && g.type === 'game'; }
  function colorFor(g, i) { return ['#6E56CF', '#f59e0b', '#10b981', '#f43f5e', '#0ea5e9', '#a855f7'][i % 6]; }

  var GAME_KIND_LABEL = {
    team: 'TEAM & BOARD',
    arcade: 'ARCADE',
    speaking: 'SPEAKING & TPR',
    quest: 'QUEST'
  };

  function shelfList() {
    var LC = root.LibraryCurate;
    // ONLY true games (g.type === 'game') appear in the Games section!
    var all = (root.GAMES_DATA || []).filter(function (g) {
      return isPureGame(g) && g.route && g.status !== 'hidden' && g.status !== 'archived' && (!LC || (shelf.showHidden ? LC.isHidden(g.id) : !LC.isHidden(g.id)));
    });
    var gr = shelf.grade == null ? (activeGrade() || 0) : shelf.grade;
    return all.filter(function (g) {
      if (gr) { var x = gradeOfGame(g); if (x !== 'both' && x !== gr) return false; }
      if (shelf.kind && shelf.kind !== 'all') {
        if ((g.gameKind || 'arcade') !== shelf.kind) return false;
      }
      if (shelf.q) {
        var hay = (g.title + ' ' + (g.subtitle || '') + ' ' + (g.tags || []).join(' ') + ' ' + (g.categoryLabel || '')).toLowerCase();
        if (hay.indexOf(shelf.q) < 0) return false;
      }
      return true;
    }).sort(function (a, b) {
      var LC2 = root.LibraryCurate, sa = LC2 && LC2.isStar(a.id) ? 1 : 0, sb = LC2 && LC2.isStar(b.id) ? 1 : 0;
      if (sb !== sa) return sb - sa;
      return (a.gameOrder || 99) - (b.gameOrder || 99);
    });
  }

  function spotlightHtml(gr) {
    if (shelf.q || shelf.curate) return '';
    var ids = gr === 4
      ? ['gamemaker-g4', 'rev-u14-g4', 'board-u3-g4-money']
      : gr === 3
      ? ['gamemaker-g3', 'rev-u14-g3', 'board-u3-g3-bear']
      : ['gamemaker-g3', 'gamemaker-g4', 'unit3-money-mission'];
    var all = root.GAMES_DATA || [], picks = [];
    ids.forEach(function (id) {
      var found = all.filter(function (g) { return g && g.id === id; })[0];
      if (found) picks.push(found);
    });
    if (!picks.length) return '';
    var colors = ['#6E56CF', '#0ea5e9', '#10b981'];
    return '<div class="cm-spotlight">' +
      '<div class="cm-spot-hd"><span>🎮 Featured Smartboard Games</span><small>Team Game Shows, Board Games &amp; Class Battles</small></div>' +
      '<div class="cm-spot-grid">' + picks.map(function (g, i) {
        var raw = String(g.title || '').replace(/^[^\w(]+/u, '');
        if (gr) raw = raw.replace(/\s*\((grade|week)[^)]*\)\s*$/i, '');
        var sub = g.subtitle || 'Smartboard Team Game';
        var gTag = gradeOfGame(g) === 4 ? 'GRADE 4' : (gradeOfGame(g) === 3 ? 'GRADE 3' : 'ALL GRADES');
        var art = thumbFor(g);
        return '<a class="cm-spot-card" style="--sc:' + colors[i % colors.length] + '" href="' + esc(g.route) + '">' +
          '<div class="cm-spot-pic">' + (art ? '<img src="' + esc(art) + '" alt="" loading="lazy" decoding="async">' : '') + '<i></i></div>' +
          '<div class="cm-spot-body"><span class="cm-spot-tag">🎲 ' + gTag + ' · ' + esc(sub) + '</span><b>' + esc(raw) + '</b><span class="cm-spot-cta">▶ Play Game</span></div>' +
        '</a>';
      }).join('') + '</div></div>';
  }

  function shelfHtml(embedded) {
    var gr = shelf.grade == null ? (activeGrade() || 0) : shelf.grade, list = shelfList();
    function chip(label, active, fn) { return '<button type="button" class="cm-chip' + (active ? ' on' : '') + '" onclick="' + fn + '">' + label + '</button>'; }
    return '<div class="cm-shelf">' +
      (embedded ? '' : '<div class="cm-shelf-hd"><div><h1>🎮 Smartboard Games Shelf</h1><small>' + list.length + ' smartboard games ready to play</small></div></div>') +
      '<div class="cm-chips" style="margin-bottom:10px">' +
      chip('Grade 3', gr === 3, "ClassMode.shelf('grade',3)") +
      chip('Grade 4', gr === 4, "ClassMode.shelf('grade',4)") +
      chip('All Grades', !gr, "ClassMode.shelf('grade',0)") + '<i></i>' +
      chip('All Games', shelf.kind === 'all', "ClassMode.shelf('kind','all')") +
      chip('🎲 Team & Board', shelf.kind === 'team', "ClassMode.shelf('kind','team')") +
      chip('🕹️ Arcade & Action', shelf.kind === 'arcade', "ClassMode.shelf('kind','arcade')") +
      chip('🗣️ Speaking & TPR', shelf.kind === 'speaking', "ClassMode.shelf('kind','speaking')") +
      chip('🚀 Quests & RPG', shelf.kind === 'quest', "ClassMode.shelf('kind','quest')") + '<i></i>' +
      (embedded ? '' : chip('📖 All Lessons & Plans →', false, "if(window.switchView)window.switchView('library')")) +
      chip('✂ Clean up', shelf.curate, "ClassMode.curate()") + '</div>' + curateBar() +
      '<div class="cm-search"><input id="cm-q" type="search" placeholder="Search games (Bamboozle, Board, Arcade, Simon Says, Race…)" value="' + esc(shelf.q) + '" oninput="ClassMode.shelf(\'q\',this.value)"></div>' +
      spotlightHtml(gr) +
      '<div class="cm-cards">' + (list.length ? list.map(function (g, i) {
        var c = colorFor(g, i);
        var LC3 = root.LibraryCurate, star = LC3 && LC3.isStar(g.id), hid = LC3 && LC3.isHidden(g.id);
        var cleanTtl = String(g.title || '').replace(/^[^\w(]+/u, '');
        if (gr) cleanTtl = cleanTtl.replace(/\s*\((grade|week)[^)]*\)\s*$/i, '');
        var ttl = esc(cleanTtl);
        var gg = gradeOfGame(g);
        var gPrefix = gg === 3 ? 'G3 · ' : (gg === 4 ? 'G4 · ' : '');
        var badgeText = gPrefix + (GAME_KIND_LABEL[g.gameKind] || 'GAME');
        var pic = '<div class="cm-pic">' + (thumbFor(g) ? '<img class="cm-img" src="' + esc(thumbFor(g)) + '" alt="" loading="lazy" decoding="async" draggable="false">' : '<span>' + esc(g.thumbnailIcon || '🎮') + '</span>') + '<em>' + esc(badgeText) + '</em>' + (star ? '<u class="cm-starmark">⭐</u>' : '') + '</div>';
        if (!shelf.curate) return '<a class="cm-card' + (hid ? ' is-hidden' : '') + '" style="--c:' + c + '" href="' + esc(g.route) + '">' + pic + '<b>' + ttl + '</b><i class="cm-play">▶ Play</i></a>';
        return '<div class="cm-card cur' + (hid ? ' is-hidden' : '') + '" style="--c:' + c + '">' + pic + '<b>' + ttl + '</b><div class="cm-cur"><a class="cm-try" href="' + esc(g.route) + '" target="_blank" rel="noopener">▶ Try</a>' +
          (hid ? '<button type="button" onclick="ClassMode.cur(\'restore\',\'' + esc(g.id) + '\')">↺ Restore</button>' : '<button type="button" class="k' + (star ? ' on' : '') + '" onclick="ClassMode.cur(\'star\',\'' + esc(g.id) + '\')">' + (star ? '⭐ Kept' : '⭐ Keep') + '</button><button type="button" class="h" onclick="ClassMode.cur(\'hide\',\'' + esc(g.id) + '\')">🙈 Hide</button>') + '</div></div>';
      }).join('') : '<p class="cm-empty">No games match this filter. Try another category.</p>') + '</div></div>';
  }
  function curateBar() {
    var LC = root.LibraryCurate; if (!shelf.curate || !LC) return '';
    function b(label, fn, cls) { return '<button type="button" class="cm-chip' + (cls ? ' ' + cls : '') + '" onclick="' + fn + '">' + label + '</button>'; }
    return '<div class="cm-curbar"><span>✂ Clean up: tap <b>Try</b> to look, then <b>Keep</b> the good ones and <b>Hide</b> the rest. Saved on this device.</span><div class="cm-chips">' +
      b((shelf.showHidden ? '← Back to the shelf' : '🙈 Hidden (' + LC.hiddenIds().length + ')'), "ClassMode.curate('hidden')", shelf.showHidden ? 'on' : '') + b('📋 Copy list', 'LibraryCurate.copy()') + b('📥 Load list', "LibraryCurate.openImport(function(){ClassMode.shelf('x')})") + b('↺ Restore all', "ClassMode.cur('clear')") + '</div></div>';
  }
  function renderShelf(container, embedded) {
    container.innerHTML = shelfHtml(embedded);
  }

  function currentShelfHost() {
    return document.getElementById('ls-games-host') || document.getElementById('app-view-container');
  }

  var api = {
    on: on, rail: rail, renderShelf: renderShelf, shelfHtml: shelfHtml, shelfCount: function () { return shelfList().length; },
    cls: function (id) { try { S().setActiveClass(id); } catch (e) { return; } var v = (location.hash || '#board').replace(/^#/, '').split('/')[0] || 'board'; if (v === 'classview') v = 'board'; if (root.switchView) root.switchView(v); paintChips(); },
    set: function (v) {
      document.documentElement.classList.toggle('class-mode', !!v); setStored(v ? '1' : '0'); paintToggle(); paintChips(); decorate();
      if (root.switchView) root.switchView(v ? 'board' : 'command');
    },
    curate: function (v) {
      if (v === true) { if (!on()) { document.documentElement.classList.add('class-mode'); setStored('1'); paintToggle(); paintChips(); } shelf.curate = true; if (root.switchView) root.switchView('shelf'); return; }
      if (v === 'hidden') shelf.showHidden = !shelf.showHidden; else { shelf.curate = !shelf.curate; if (!shelf.curate) shelf.showHidden = false; }
      var c = currentShelfHost(); if (c) renderShelf(c, c.id === 'ls-games-host');
    },
    cur: function (what, id) {
      var LC = root.LibraryCurate; if (!LC) return;
      if (what === 'hide') LC.hide(id); else if (what === 'restore') LC.restore(id); else if (what === 'star') LC.toggleStar(id);
      else if (what === 'clear') { if (!root.confirm || root.confirm('Restore every hidden game and remove all stars on this device?')) LC.clearAll(); else return; }
      var c = currentShelfHost(); if (c) { var y = root.scrollY; renderShelf(c, c.id === 'ls-games-host'); root.scrollTo(0, y); }
    },
    shelf: function (k, v) {
      if (k === 'x') { /* just redraw */ } else if (k === 'grade') shelf.grade = Number(v); else if (k === 'kind') shelf.kind = v; else if (k === 'q') shelf.q = String(v || '').toLowerCase();
      var c = currentShelfHost(); if (!c) return;
      var emb = c.id === 'ls-games-host';
      if (k === 'q') { var cards = c.querySelector('.cm-cards'), tmp = document.createElement('div'); tmp.innerHTML = shelfHtml(emb); if (cards) cards.innerHTML = tmp.querySelector('.cm-cards').innerHTML; return; }
      renderShelf(c, emb);
    },
    go: function (id) {
      if (root.closeMobileSidebar) root.closeMobileSidebar();
      if (id === 'gamemaker') { openGameMaker(); return; }
      if (id === 'sleepy') { if (root.SleepyMonster && root.SleepyMonster.open) root.SleepyMonster.open(); else if (root.openSleepyMonster) root.openSleepyMonster(); return; }
      var sw = root.switchView; if (!sw) return;
      if (id === 'classview') { sw('board'); return; }
      if (id === 'board' || id === 'library' || id === 'store' || id === 'calendar' || id === 'command' || id === 'shelf' || id === 'rewards') { sw(id); return; }
      if (id === 'teacher') { api.set(false); return; }
      if (id === 'timer') { if (root.openClassroomToolkitModal) root.openClassroomToolkitModal('timer'); return; }
      if (id === 'pick') { sw('board'); setTimeout(function () { try { root.ClassBoard && root.ClassBoard.pick(); } catch (e) { /* optional */ } }, 500); return; }
      if (id === 'lesson') { sw('library'); }
    }
  };
  root.ClassMode = api; root.renderGameShelf = renderShelf;

  if (stored() === '1') document.documentElement.classList.add('class-mode');
  function init() { ensureToggle(); hookSwitch(); paintChips(); watch(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  setTimeout(function () { ensureToggle(); hookSwitch(); paintChips(); watch(); decorate(); }, 1500);
})(typeof window !== 'undefined' ? window : this);
