/* Library shelf: the Library opens on the lessons, reviews, quizzes, printables, songs, and homework we made,
   sorted logically by Unit (Unit 4 -> Unit 3 -> Unit 2 -> Unit 1 -> Classroom & Songs) and within each unit
   in strict teaching sequence (Lesson 1 -> Lesson 2 -> Lesson 3 -> Lesson 4 -> Lesson 5 -> Review -> Quiz/Printable/Homework).
   Standalone games live exclusively in the Games section (#shelf). */
(function (root) {
  'use strict';
  var KEY = 'eaa_lib_shelf';
  var TABS = [
    ['week', '📌 Current Unit (Unit 4)'],
    ['g3', '🎒 Grade 3 Lessons'],
    ['g4', '🎓 Grade 4 Lessons'],
    ['alice', '🫖 Alice & Drama'],
    ['else', '📚 Full Curriculum Library']
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
    // Exclude standalone games ('game') from Library — games belong in the Games section (#shelf)
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
    lesson:    { label: 'LESSON',    bg: '#0284c7', fg: '#fff' },
    review:    { label: 'REVIEW',    bg: '#f59e0b', fg: '#06101f' },
    quiz:      { label: 'QUIZ',      bg: '#a855f7', fg: '#fff' },
    printable: { label: 'PRINTABLE', bg: '#10b981', fg: '#06101f' },
    homework:  { label: 'HOMEWORK',  bg: '#ec4899', fg: '#fff' },
    song:      { label: 'SONG',      bg: '#6366f1', fg: '#fff' }
  };

  function card(c) {
    var fresh = Date.now() - new Date(addedOf(c)).getTime() < 8 * 86400000;
    var g = c.g ? '<span class="ls-g">Grade ' + c.g + '</span>' : '<span class="ls-g">All Grades</span>';
    var u = unitOf(c);
    var uPill = u ? '<span class="ls-u">Unit ' + u + '</span>' : '';
    var kb = KIND_BADGE[c.kind || 'lesson'] || KIND_BADGE.lesson;
    var kindPill = '<span class="ls-k" style="background:' + kb.bg + ';color:' + kb.fg + '">' + kb.label + '</span>';
    return '<a class="ls-card" href="' + esc(c.route) + '">' +
      '<span class="ls-ic">' + esc(c.icon || '📖') + '</span>' +
      '<span class="ls-tx"><b>' + esc(c.title) + '</b>' +
      '<small class="ls-meta">' + g + uPill + kindPill + '</small></span>' +
      (fresh ? '<em>NEW</em>' : '') +
      '<i>▶</i></a>';
  }

  function body() {
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

  var CSS = '.ls{max-width:1220px;margin:0 auto;padding:4px 4px 90px;color:#e6e8ee}' +
    '.ls-top{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:8px}' +
    '.ls h1{margin:0 0 2px;font-size:1.55rem}.ls .ls-sub{color:#94a3b8;margin:0;font-size:.92rem}' +
    '.ls-goto-games{border:0;border-bottom:5px solid #581c87;background:linear-gradient(135deg,#a855f7,#7e22ce);color:#fff;font:800 .92rem inherit;border-radius:14px;padding:10px 18px;cursor:pointer;transition:transform .15s cubic-bezier(.175,.885,.32,1.275)}' +
    '.ls-goto-games:active{transform:translateY(4px);border-bottom-width:1px}' +
    '.ls-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}' +
    '.ls-tab{border:0;border-bottom:5px solid #1e293b;background:#334155;color:#fff;font:800 .96rem inherit;border-radius:14px;padding:10px 16px;cursor:pointer;transition:transform .15s cubic-bezier(.175,.885,.32,1.275)}' +
    '.ls-tab:active{transform:translateY(4px);border-bottom-width:1px}.ls-tab.on{background:#f59e0b;border-bottom-color:#92400e;color:#1c1203}.ls-tab span{opacity:.75;font-weight:700;margin-left:4px}' +
    '.ls-bar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:8px 0 14px}' +
    '.ls-kinds{display:flex;gap:6px;flex-wrap:wrap}' +
    '.ls-kbtn{border:1px solid rgba(255,255,255,.14);border-bottom:4px solid #0f172a;background:rgba(15,23,42,.85);color:#cbd5e1;font:700 .84rem inherit;border-radius:12px;padding:7px 13px;cursor:pointer;transition:transform .12s}' +
    '.ls-kbtn:active{transform:translateY(3px);border-bottom-width:1px}.ls-kbtn.on{background:#0284c7;border-color:#38bdf8;border-bottom-color:#075985;color:#fff}' +
    '.ls-q{width:min(360px,100%);background:rgba(15,23,42,.85);border:1px solid #334155;border-radius:12px;color:#e6e8ee;padding:8px 12px;font:inherit;margin-left:auto}' +
    '.ls-h{margin:22px 0 10px;font-size:1.12rem;color:#38bdf8;display:flex;align-items:center;gap:8px}.ls-h span{background:rgba(56,189,248,.15);color:#7dd3fc;border-radius:99px;padding:1px 9px;font-weight:800;font-size:.78rem}' +
    '.ls-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px}' +
    '.ls-card{position:relative;display:flex;align-items:center;gap:12px;background:rgba(15,23,42,.88);border:1px solid rgba(255,255,255,.1);border-bottom:5px solid #090d16;border-radius:16px;padding:14px;text-decoration:none;color:#e6e8ee;box-shadow:0 4px 20px -2px rgba(0,0,0,.4);transition:transform .14s cubic-bezier(.175,.885,.32,1.275),border-color .14s}' +
    '.ls-card:hover{border-color:#38bdf8;transform:translateY(-2px)}.ls-card:active{transform:translateY(3px);border-bottom-width:2px}' +
    '.ls-ic{font-size:2.1rem;flex:none}.ls-tx{flex:1;min-width:0}.ls-tx b{display:block;font-size:.96rem;line-height:1.3;margin-bottom:5px}' +
    '.ls-meta{display:flex;gap:6px;flex-wrap:wrap;align-items:center}' +
    '.ls-g{background:#0369a1;color:#fff;border-radius:6px;padding:1px 7px;font-weight:800;font-size:.68rem}' +
    '.ls-u{background:rgba(255,255,255,.1);color:#cbd5e1;border-radius:6px;padding:1px 7px;font-weight:800;font-size:.68rem}' +
    '.ls-k{border-radius:6px;padding:1px 7px;font-weight:900;font-size:.65rem;letter-spacing:.03em}' +
    '.ls-card em{position:absolute;top:8px;right:10px;background:#10b981;color:#06101f;border-radius:8px;font-style:normal;font-weight:800;font-size:.66rem;padding:1px 7px}.ls-card i{font-style:normal;color:#38bdf8;font-size:1.15rem}' +
    '.ls-empty{padding:40px;text-align:center;color:#8b93a7}' +
    '@media(max-width:768px){.ls-top{gap:8px}.ls h1{font-size:1.22rem}.ls .ls-sub{font-size:.8rem}.ls-goto-games{width:100%;text-align:center;padding:8px 14px;font-size:.84rem}.ls-tabs{flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;gap:6px;margin:6px 0;padding-bottom:3px}.ls-tabs::-webkit-scrollbar{display:none}.ls-tab{flex:0 0 auto;white-space:nowrap;padding:8px 12px;font-size:.82rem}.ls-bar{gap:6px;margin:4px 0 10px}.ls-kinds{flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;width:100%;padding-bottom:2px}.ls-kinds::-webkit-scrollbar{display:none}.ls-kbtn{flex:0 0 auto;white-space:nowrap;padding:6px 10px;font-size:.78rem}.ls-q{width:100%;margin-left:0;padding:7px 10px;font-size:.86rem}.ls-grid{grid-template-columns:1fr;gap:9px}.ls-card{padding:11px 12px}.ls-ic{font-size:1.75rem}}';

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
    container.innerHTML = '<div class="ls">' +
      '<div class="ls-top"><div><h1>📖 Lessons & Curriculum Library</h1><p class="ls-sub">Interactive lessons, unit reviews, quizzes, printables & homework — ordered by Unit & Lesson sequence. Pure games are in the Games Shelf.</p></div>' +
      '<button type="button" class="ls-goto-games" onclick="if(window.switchView)window.switchView(\'shelf\')">🎮 Go to Games Shelf →</button></div>' +
      '<div class="ls-tabs">' + tabs + '</div>' +
      (tab === 'else' ? '' : '<div class="ls-bar"><div class="ls-kinds">' + kinds + '</div><input class="ls-q" id="ls-q" type="search" placeholder="Search lessons, reviews, quizzes..." value="' + esc(q) + '"></div>') +
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
  root.LibraryShelf = { setTab: function (t) { tab = t; }, install: install };
})(window);
