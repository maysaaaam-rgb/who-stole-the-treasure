/* Library shelf: Unified Hub 2 ("Lessons & Games").
   Connects interactive lessons, unit reviews, quizzes, printables, Smartboard Games & Game Maker,
   and downloadable Word/PDF Lesson Plans in one clean Tines Bento hub. */
(function (root) {
  'use strict';
  var KEY = 'eaa_lib_shelf';
  var TABS = [
    ['week', '📌 Current Unit (Unit 4)'],
    ['games', '🎮 Smartboard Games'],
    ['plans', '📋 Lesson Plans (Word & PDF)'],
    ['g3', '🎒 Grade 3 Lessons'],
    ['g4', '🎓 Grade 4 Lessons'],
    ['alice', '🫖 Alice & Drama'],
    ['else', '📚 Textbook Anthology']
  ];
  var KINDS = [
    ['all', 'All Items'],
    ['lessons', '📖 Lessons & Reviews'],
    ['quizzes', '📝 Quizzes & Printables'],
    ['homework', '🏠 Homework & Songs']
  ];
  var tab = 'week', kindFilter = 'all', q = '';
  try {
    var s = localStorage.getItem(KEY);
    if (s && TABS.some(function (t) { return t[0] === s; })) tab = s;
  } catch (e) { /* storage may be blocked */ }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function catalog() { return (root.Timetable && root.Timetable.catalog) || []; }
  function plansList() { return root.LESSON_PLANS || []; }
  function isAlice(c) { return /alice|tea party/i.test(c.id + ' ' + c.title); }
  function unitOf(c) {
    if (c && c.unit != null) return Number(c.unit);
    var m = /Unit\s*(\d)/i.exec((c && c.title) || '');
    return m ? +m[1] : 0;
  }
  function addedOf(c) { return c.added || '2000-01-01'; }

  function matchKind(c, kf) {
    if (!kf || kf === 'all') return true;
    var k = c.kind || 'lesson';
    if (kf === 'lessons') return k === 'lesson' || k === 'review';
    if (kf === 'quizzes') return k === 'quiz' || k === 'printable';
    if (kf === 'homework') return k === 'homework' || k === 'song';
    return true;
  }

  function items(ignoreKind) {
    var list = catalog().filter(function (c) {
      return c && c.route && c.kind !== 'game' && c.kind !== 'nav';
    });
    if (!ignoreKind && kindFilter !== 'all') {
      list = list.filter(function (c) { return matchKind(c, kindFilter); });
    }
    var needle = q.trim().toLowerCase();
    if (needle) {
      list = list.filter(function (c) {
        return (c.title + ' ' + c.id + ' ' + (c.kind || '')).toLowerCase().indexOf(needle) >= 0;
      });
    }
    return list;
  }

  function forTab(t, ignoreKind) {
    if (t === 'games') {
      return root.ClassMode && root.ClassMode.shelfCount ? { length: root.ClassMode.shelfCount() } : [];
    }
    if (t === 'plans') {
      return plansList();
    }
    var list = items(ignoreKind);
    if (t === 'week') {
      var weekAgo = new Date(Date.now() - 10 * 86400000).toISOString().slice(0, 10);
      return list.filter(function (c) { return unitOf(c) === 4 || addedOf(c) >= weekAgo; });
    }
    if (t === 'alice') return list.filter(isAlice);
    var g = t === 'g3' ? 3 : 4;
    return list.filter(function (c) { return !isAlice(c) && (!c.g || c.g === g); });
  }

  function teachingSequence(a, b) {
    var uA = unitOf(a), uB = unitOf(b);
    if (uA !== uB) return uB - uA;
    var gA = a.g || 9, gB = b.g || 9;
    if (gA !== gB) return gA - gB;
    return (a.order || 99) - (b.order || 99);
  }

  var KIND_BADGE = {
    lesson:    { label: 'LESSON',    bg: 'rgba(168, 85, 247, 0.22)', fg: '#e9d5ff' },
    review:    { label: 'REVIEW',    bg: 'rgba(245, 158, 11, 0.22)', fg: '#fde68a' },
    quiz:      { label: 'QUIZ',      bg: 'rgba(244, 63, 94, 0.22)', fg: '#fecdd3' },
    printable: { label: 'PRINTABLE', bg: 'rgba(16, 185, 129, 0.22)', fg: '#a7f3d0' },
    homework:  { label: 'HOMEWORK',  bg: 'rgba(56, 189, 248, 0.22)', fg: '#bae6fd' },
    song:      { label: 'SONG',      bg: 'rgba(139, 92, 246, 0.22)', fg: '#ddd6fe' }
  };

  function matchingPlan(route) {
    if (!route) return null;
    var clean = String(route).split('?')[0];
    var list = plansList();
    for (var i = 0; i < list.length; i++) {
      if (list[i].launch && (list[i].launch === route || String(list[i].launch).split('?')[0] === clean)) {
        return list[i];
      }
    }
    return null;
  }

  function card(c) {
    var fresh = Date.now() - new Date(addedOf(c)).getTime() < 8 * 86400000;
    var g = c.g ? '<span class="ls-g">Grade ' + c.g + '</span>' : '<span class="ls-g">All Grades</span>';
    var u = unitOf(c);
    var uPill = u ? '<span class="ls-u">Unit ' + u + '</span>' : '';
    var kb = KIND_BADGE[c.kind || 'lesson'] || KIND_BADGE.lesson;
    var kindPill = '<span class="ls-k" style="background:' + kb.bg + ';color:' + kb.fg + '">' + kb.label + '</span>';
    var plan = matchingPlan(c.route);
    var planPill = plan ? '<span class="ls-k" style="background:rgba(232, 166, 48, 0.18);color:#e5edff;border:1px solid #26324a" onclick="event.preventDefault();event.stopPropagation();window.open(\'lesson-plans/' + esc(plan.file) + '.pdf\',\'_blank\')" title="Open PDF Lesson Plan">📄 Plan PDF</span>' : '';
    return '<a class="ls-card" href="' + esc(c.route) + '">' +
      '<span class="ls-ic">' + esc(c.icon || '📖') + '</span>' +
      '<span class="ls-tx"><b>' + esc(c.title) + '</b>' +
      '<small class="ls-meta">' + g + uPill + kindPill + planPill + '</small></span>' +
      (fresh ? '<em>NEW</em>' : '') +
      '<i>▶</i></a>';
  }

  function renderPlansBody() {
    var list = plansList();
    var needle = q.trim().toLowerCase();
    if (needle) {
      list = list.filter(function (p) {
        return (p.title + ' ' + p.grade + ' ' + p.file).toLowerCase().indexOf(needle) >= 0;
      });
    }
    var now = Date.now();
    if (!list.length) return '<div class="ls-empty">No lesson plans match your search.</div>';
    return '<div class="lp-section">' +
      '<div class="lp-head" style="margin-bottom:14px"><h2 style="margin:0 0 4px;font-size:1.25rem">📋 Official Lesson Plans (PDF &amp; Word)</h2><span style="font-size:.88rem">Ready to print or send to the headteacher, linked directly to each interactive smartboard lesson.</span></div>' +
      '<div class="lp-grid">' + list.map(function (p) {
        var isNew = now - new Date(p.date).getTime() < 7 * 86400000;
        return '<div class="lp-card"><div class="lp-top" style="display:flex;gap:6px;align-items:center"><span class="ls-g">' + esc(p.grade) + '</span>' + (p.kind ? '<span class="ls-u">' + esc(p.kind) + '</span>' : '') + (isNew ? '<span class="ls-k" style="background:rgba(48, 232, 112, 0.18);color:#94f9bb;margin-left:auto">NEW</span>' : '') + '</div>' +
          '<b>' + esc(p.title) + '</b><small>' + new Date(p.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + '</small>' +
          '<div class="lp-btns" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:auto;padding-top:6px"><a class="tines-tab-btn" style="text-decoration:none;padding:6px 12px;font-size:.8rem" href="lesson-plans/' + esc(p.file) + '.pdf" target="_blank" rel="noopener">📄 PDF</a>' +
          (p.word ? '<a class="tines-tab-btn" style="text-decoration:none;padding:6px 12px;font-size:.8rem" href="lesson-plans/' + esc(p.file) + '.docx" download>📝 Word</a>' : '') +
          (p.launch ? '<a class="tines-tab-btn is-active" style="text-decoration:none;padding:6px 12px;font-size:.8rem" href="' + esc(p.launch) + '">▶ Open Lesson</a>' : '') + '</div></div>';
      }).join('') + '</div></div>';
  }

  function body() {
    if (tab === 'games') {
      return '<div id="ls-games-host">' + (root.ClassMode && root.ClassMode.shelfHtml ? root.ClassMode.shelfHtml(true) : '<div class="ls-empty">Games Shelf is loading…</div>') + '</div>';
    }
    if (tab === 'plans') {
      return renderPlansBody();
    }
    var list = forTab(tab, false);
    if (!list.length) return '<div class="ls-empty">No lessons or resources match' + (q ? ' “' + esc(q) + '”' : ' this filter') + '.</div>';
    if (tab === 'alice') {
      return '<div class="ls-grid">' + list.slice().sort(teachingSequence).map(card).join('') + '</div>';
    }
    if (tab === 'week') {
      var g3List = list.filter(function (c) { return c.g === 3; }).sort(teachingSequence);
      var g4List = list.filter(function (c) { return c.g === 4; }).sort(teachingSequence);
      var allList = list.filter(function (c) { return !c.g; }).sort(teachingSequence);
      var out = '';
      if (g3List.length) out += '<h3 class="ls-h">🎒 Grade 3 — Unit 4 Lessons & Reviews (In Teaching Order) <span>' + g3List.length + '</span></h3><div class="ls-grid">' + g3List.map(card).join('') + '</div>';
      if (g4List.length) out += '<h3 class="ls-h">🎓 Grade 4 — Unit 4 Lessons, Reviews & Assessments (In Teaching Order) <span>' + g4List.length + '</span></h3><div class="ls-grid">' + g4List.map(card).join('') + '</div>';
      if (allList.length) out += '<h3 class="ls-h">🌟 All Grades — Classroom Reset & Promises <span>' + allList.length + '</span></h3><div class="ls-grid">' + allList.map(card).join('') + '</div>';
      return out;
    }
    var groups = {};
    list.forEach(function (c) {
      var u = unitOf(c);
      (groups[u] = groups[u] || []).push(c);
    });
    var unitTitles = {
      4: '📘 Unit 4 — Current Unit (Lessons 1 → Review)',
      3: '📘 Unit 3 — Complete Unit (Lessons 1 → 5 → Review → Quiz)',
      2: '📘 Unit 2 — Complete Unit (Lessons 1 → 3 → Review & Song)',
      1: '📘 Unit 1 — Complete Unit (Lessons 1 → 4)',
      0: '🌟 Classroom Reset, Karaoke & Extras'
    };
    return Object.keys(groups).map(Number).sort(function (a, b) {
      return (b || -1) - (a || -1);
    }).map(function (u) {
      var sorted = groups[u].slice().sort(teachingSequence);
      return '<h3 class="ls-h">' + (unitTitles[u] || ('📘 Unit ' + u)) + ' <span>' + sorted.length + '</span></h3>' +
        '<div class="ls-grid">' + sorted.map(card).join('') + '</div>';
    }).join('');
  }

  var CSS = '.ls{max-width:1240px;margin:0 auto;padding:6px 8px 90px;color:#e5edff}' +
    '.ls-top{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:10px}' +
    '.ls h1{margin:0 0 2px;font-size:1.65rem}.ls .ls-sub{color:#cbd5e1;margin:0;font-size:.92rem}' +
    '.ls-goto-games{border:1.5px solid #4C389E;border-bottom:4px solid #37267A;background:linear-gradient(180deg,#6E56CF,#4C389E);color:#fff;font:800 .9rem inherit;border-radius:13px;padding:10px 18px;cursor:pointer;transition:transform .15s cubic-bezier(.175,.885,.32,1.275)}' +
    '.ls-goto-games:active{transform:translateY(3px);border-bottom-width:1px}' +
    '.ls-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 14px}' +
    '.ls-tab{border:1.5px solid #26324a;border-bottom:4px solid #26324a;background:rgba(15, 23, 42, 0.86);color:#cbd5e1;font:800 .9rem inherit;border-radius:13px;padding:9px 15px;cursor:pointer;transition:transform .15s cubic-bezier(.175,.885,.32,1.275)}' +
    '.ls-tab:active{transform:translateY(3px);border-bottom-width:1px}.ls-tab.on{background:#6E56CF;border-color:#4C389E;border-bottom-color:#37267A;color:#FFFFFF}.ls-tab span{opacity:.85;font-weight:700;margin-left:4px}' +
    '.ls-bar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:8px 0 14px}' +
    '.ls-kinds{display:flex;gap:6px;flex-wrap:wrap}' +
    '.ls-kbtn{border:1.5px solid #26324a;border-bottom:3px solid #26324a;background:rgba(15, 23, 42, 0.86);color:#cbd5e1;font:700 .84rem inherit;border-radius:11px;padding:7px 13px;cursor:pointer;transition:transform .12s}' +
    '.ls-kbtn:active{transform:translateY(2px);border-bottom-width:1px}.ls-kbtn.on{background:rgba(101, 48, 232, 0.18);border-color:#6E56CF;border-bottom-color:#4C389E;color:#a894f9;font-weight:800}' +
    '.ls-q{width:min(360px,100%);background:rgba(15, 23, 42, 0.86);border:1.5px solid #26324a;border-radius:12px;color:#e5edff;padding:8px 12px;font:inherit;margin-left:auto}' +
    '.ls-h{margin:22px 0 10px;font-size:1.15rem;color:#e5edff;display:flex;align-items:center;gap:8px}.ls-h span{background:rgba(101, 48, 232, 0.18);color:#a894f9;border-radius:99px;padding:2px 10px;font-weight:800;font-size:.78rem}' +
    '.ls-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px}' +
    '.ls-card{position:relative;display:flex;align-items:center;gap:12px;background:rgba(15, 23, 42, 0.86);border:1.5px solid #26324a;border-bottom:4px solid #26324a;border-radius:16px;padding:14px;text-decoration:none;color:#e5edff;box-shadow:0 3px 12px rgba(37,36,43,.05);transition:transform .14s cubic-bezier(.175,.885,.32,1.275),border-color .14s}' +
    '.ls-card:hover{border-color:#6E56CF;transform:translateY(-2px)}.ls-card:active{transform:translateY(3px);border-bottom-width:2px}' +
    '.ls-ic{font-size:2.1rem;flex:none;width:48px;height:48px;border-radius:12px;background:rgba(232, 153, 48, 0.18);border:1px solid #26324a;display:flex;align-items:center;justify-content:center}.ls-tx{flex:1;min-width:0}.ls-tx b{display:block;font-size:.96rem;line-height:1.3;margin-bottom:5px;color:#e5edff}' +
    '.ls-meta{display:flex;gap:6px;flex-wrap:wrap;align-items:center}' +
    '.ls-g{background:rgba(101, 48, 232, 0.18);color:#a894f9;border-radius:6px;padding:2px 7px;font-weight:800;font-size:.68rem}' +
    '.ls-u{background:rgba(232, 166, 48, 0.18);color:#cbd5e1;border-radius:6px;padding:2px 7px;font-weight:800;font-size:.68rem}' +
    '.ls-k{border-radius:6px;padding:2px 7px;font-weight:800;font-size:.66rem;letter-spacing:.02em}' +
    '.ls-card em{position:absolute;top:8px;right:10px;background:#10b981;color:#fff;border-radius:8px;font-style:normal;font-weight:800;font-size:.66rem;padding:1px 7px}.ls-card i{font-style:normal;color:#a894f9;font-size:1.15rem;font-weight:800}' +
    '.ls-empty{padding:40px;text-align:center;color:#94a3b8;background:rgba(15, 23, 42, 0.86);border:1.5px solid #26324a;border-radius:16px}' +
    '@media(max-width:768px){.ls-top{gap:8px}.ls h1{font-size:1.22rem}.ls .ls-sub{font-size:.8rem}.ls-goto-games{width:100%;text-align:center;padding:8px 14px;font-size:.84rem}.ls-tabs{flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;gap:6px;margin:6px 0;padding-bottom:3px}.ls-tabs::-webkit-scrollbar{display:none}.ls-tab{flex:0 0 auto;white-space:nowrap;padding:8px 12px;font-size:.82rem}.ls-bar{gap:6px;margin:4px 0 10px}.ls-kinds{flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;width:100%;padding-bottom:2px}.ls-kinds::-webkit-scrollbar{display:none}.ls-kbtn{flex:0 0 auto;white-space:nowrap;padding:6px 10px;font-size:.78rem}.ls-q{width:100%;margin-left:0;padding:7px 10px;font-size:.86rem}.ls-grid{grid-template-columns:1fr;gap:9px}.ls-card{padding:11px 12px}.ls-ic{font-size:1.65rem;width:42px;height:42px}}';

  function ensureCss() {
    if (!document.getElementById('ls-css')) {
      var st = document.createElement('style');
      st.id = 'ls-css';
      st.textContent = CSS;
      document.head.appendChild(st);
    }
  }

  function paint(container) {
    ensureCss();
    var tabs = TABS.map(function (t) {
      var n = t[0] === 'else' ? '' : ' <span>' + forTab(t[0], true).length + '</span>';
      return '<button type="button" class="ls-tab' + (t[0] === tab ? ' on' : '') + '" data-t="' + t[0] + '">' + t[1] + n + '</button>';
    }).join('');
    var kinds = KINDS.map(function (k) {
      return '<button type="button" class="ls-kbtn' + (k[0] === kindFilter ? ' on' : '') + '" data-k="' + k[0] + '">' + k[1] + '</button>';
    }).join('');
    var showLessonBar = tab !== 'else' && tab !== 'games' && tab !== 'plans';
    var showPlansSearch = tab === 'plans';
    container.innerHTML = '<div class="ls">' +
      '<div class="ls-top"><div><h1>📖 Lessons, Games &amp; Curriculum Plans</h1><p class="ls-sub">Interactive smartboard lessons, unit reviews, team games, and printable Word/PDF lesson plans — connected in one place.</p></div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
        '<button type="button" class="ls-goto-games" onclick="if(window.openGameMaker)openGameMaker();else location.href=\'game-maker/index.html\'">🎮 Launch Game Maker →</button>' +
      '</div></div>' +
      '<div class="ls-tabs">' + tabs + '</div>' +
      (showLessonBar ? '<div class="ls-bar"><div class="ls-kinds">' + kinds + '</div><input class="ls-q" id="ls-q" type="search" placeholder="Search lessons, reviews, quizzes..." value="' + esc(q) + '"></div>' : '') +
      (showPlansSearch ? '<div class="ls-bar"><input class="ls-q" id="ls-q" type="search" style="margin-left:0" placeholder="Search lesson plans by unit, grade or title..." value="' + esc(q) + '"></div>' : '') +
      '<div id="ls-body">' + (tab === 'else' ? '' : body()) + '</div></div>';
    [].forEach.call(container.querySelectorAll('.ls-tab'), function (b) {
      b.addEventListener('click', function () {
        tab = b.getAttribute('data-t');
        try { localStorage.setItem(KEY, tab); } catch (e) { /* ignore */ }
        render(container);
      });
    });
    [].forEach.call(container.querySelectorAll('.ls-kbtn'), function (b) {
      b.addEventListener('click', function () {
        kindFilter = b.getAttribute('data-k') || 'all';
        render(container);
      });
    });
    var qi = container.querySelector('#ls-q');
    if (qi) {
      qi.addEventListener('input', function () {
        q = qi.value;
        var bd = container.querySelector('#ls-body');
        if (bd) bd.innerHTML = body();
      });
    }
  }

  var orig = null;
  function render(container) {
    if (tab !== 'else') { paint(container); return; }
    paint(container);
    var host = document.createElement('div');
    container.querySelector('#ls-body').appendChild(host);
    if (orig) orig(host);
  }
  function install() {
    var lc = root.LibraryController;
    if (!lc || lc.__shelf) return !!(lc && lc.__shelf);
    orig = lc.render.bind(lc);
    lc.render = render;
    lc.__shelf = true;
    return true;
  }
  if (!install()) {
    var n = 0, iv = setInterval(function () { if (install() || ++n > 40) clearInterval(iv); }, 250);
  }
  root.LibraryShelf = {
    setTab: function (t) { tab = t; try { localStorage.setItem(KEY, tab); } catch (e) { /* ignore */ } },
    openTab: function (t) {
      tab = t;
      try { localStorage.setItem(KEY, tab); } catch (e) { /* ignore */ }
      if (root.switchView) root.switchView('library');
    },
    install: install
  };
})(window);
