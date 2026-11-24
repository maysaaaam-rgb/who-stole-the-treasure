/* Platform layout (9 Nov 2026): six places instead of a long menu.
   ▶️ Today · 📺 Class Board (the pupil shop is inside) · 📖 Library · 🪄 Board & Book · 📅 Plan · ⚙️ More
   Also: Search everywhere (🔍 button, Ctrl+K), the Today page, the Board & Book toolbox, the More page and Old lessons.
   Rules for future work are in .claude/skills/platform-structure/SKILL.md. */
(function (root) {
  'use strict';
  function S() { return root.schoolStore || root.store; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function jsq(s) { return esc(String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")); }

  /* Unified Adventure Park Map (6 clean places matching docs/STYLE_GUIDE.md — zero overlapping hubs) */
  var PLACES = [
    { id: 'home', icon: '🏝️', label: 'Island', tip: '3D Adventure Island — the single map for class pupils, lessons, games & shop', views: ['home'] },
    { id: 'today', icon: '🏰', label: 'Today', tip: 'Your lessons today & Week Plan with one-tap launch', views: ['today', 'dashboard', 'calendar'] },
    { id: 'games', icon: '🎮', label: 'Games', tip: '26 vetted smartboard & phone games — zero duplicates!', views: ['shelf'] },
    { id: 'board', icon: '📺', label: 'Class Board', tip: 'Teams, XP points, timer and picker', views: ['board', 'classview', 'rewards', 'tools'] },
    { id: 'shop', icon: '🛍️', label: 'Shop', tip: 'Pupil avatars, outfits, mystery boxes and prizes', views: ['store-pupil', 'closet', 'monster'] },
    { id: 'library', icon: '📖', label: 'Library', tip: 'Lessons, Magic Book, Smart Board, Story Quests & plans', views: ['library', 'curriculum', 'more'] }
  ];
  var MORE = [
    { v: 'calendar', icon: '📅', label: 'Week Plan', tip: 'Timetable and school calendar' },
    { v: 'tools', icon: '🪄', label: 'Board & Book', tip: 'Smart Board, Magic Book & Speaking Pair Picker' },
    { v: 'command', icon: '🧑‍🏫', label: 'Teacher Hub', tip: 'Pupils, XP, homework, logs' },
    { v: 'store-teacher', icon: '🪙', label: 'Store settings', tip: 'Prices, sales, coins, who bought what' },
    { v: 'island', icon: '⛵', label: 'Harbour Story Quest', tip: 'Practice Island 2D reading quest' },
    { v: 'planet3d', icon: '🌍', label: 'Treasure Planet 3D', tip: 'Chapter 1 3D story globe quest' },
    { v: 'pairpicker', icon: '🟢', label: 'Slime Pair Picker', tip: 'Pick 2 speakers together for dialogues' },
    { v: 'lesson-archive', icon: '📦', label: 'Old lessons', tip: 'Units 1–4 archive' },
    { v: 'settings', icon: '⚙️', label: 'School settings', tip: 'Classes, school, devices' },
    { v: 'archived', icon: '🗄️', label: 'Archived & restore', tip: 'Restore classes, pupils and files' },
    { v: 'backups', icon: '💾', label: 'Backups', tip: 'Daily XP and coins backup' }
  ];
  function placeOf(view) {
    for (var i = 0; i < PLACES.length; i++) if (PLACES[i].views.indexOf(view) >= 0) return PLACES[i].id;
    return 'more';
  }

  /* ---------------------------------------------------------------- actions */
  function sw(v) { if (root.switchView) root.switchView(v); }
  function openUrl(u, tab) { if (tab) root.open(u, tab); else location.href = u; }
  function activeGrade() {
    try { var c = S().getActiveClass && S().getActiveClass(); var m = c && /([34])/.exec((c.name || '') + ' ' + c.id); return m ? Number(m[1]) : 3; } catch (e) { return 3; }
  }
  function go(act, arg) {
    if (root.closeMobileSidebar) root.closeMobileSidebar();
    switch (act) {
      case 'home': sw('home'); return;
      case 'shop': sw('store-pupil'); return;
      case 'games':
      case 'gm':
        if (root.openGameMaker) root.openGameMaker(arg ? { setId: arg } : {});
        else openUrl('game-maker/index.html');
        return;
      case 'island': openUrl('island/index.html?demo=1'); return;
      case 'planet3d': openUrl('island/planet.html?demo=1'); return;
      case 'pairpicker': openUrl('games/pickers/index.html?game=slime'); return;
      case 'plans': sw('library'); setTimeout(function () { if (root.LibraryShelf && root.LibraryShelf.openTab) root.LibraryShelf.openTab('plans'); }, 60); return;
      case 'smartboard': openUrl('smart-board/index.html'); return;
      case 'book': openUrl('magic-book/index.html?grade=' + (arg || activeGrade())); return;
      case 'timer': if (root.openClassroomToolkitModal) root.openClassroomToolkitModal('timer'); return;
      case 'pick': if (root.ClassMode) root.ClassMode.go('pick'); else sw('board'); return;
      case 'groups': sw('board'); setTimeout(function () { try { root.ClassBoard.groups(); } catch (e) { /* optional */ } }, 400); return;
      case 'sleepy': if (root.SleepyMonster && root.SleepyMonster.open) root.SleepyMonster.open(); else if (root.openSleepyMonster) root.openSleepyMonster(); return;
      case 'bathroom': if (root.BathroomPass) root.BathroomPass.open(); return;
      case 'karaoke': if (root.ClassBoard && root.ClassBoard.karaoke) root.ClassBoard.karaoke(); else openUrl('karaoke-stage/index.html', 'karaoke'); return;
      case 'game': if (root.launchGame) root.launchGame(arg); return;
      case 'class': try { S().setActiveClass(arg); } catch (e) { /* optional */ } sw('board'); return;
      case 'url': openUrl(arg); return;
      case 'backups': if (root.DailyBackup) root.DailyBackup.open(); return;
      default: sw(act);
    }
  }

  /* ---------------------------------------------------------------- sidebar */
  function sidebarHtml(view) {
    var cur = placeOf(view);
    var b = function (on, onclick, icon, label, tip, small) {
      return '<li><button class="nav-link-btn' + (on ? ' is-active' : '') + (small ? ' pn-sub' : '') + '" onclick="' + onclick + '" title="' + esc(tip) + '"><span class="nav-item-left"><span class="nav-icon">' + icon + '</span> <span class="nav-label">' + esc(label) + '</span></span></button></li>';
    };
    var html = '<button type="button" class="pn-search-btn" onclick="PlatformNav.search()" title="Find any lesson, game, plan, page, pupil or tool (Ctrl+K)"><span>🔍</span><span class="nav-label">Search</span><kbd>Ctrl K</kbd></button>' +
      '<ul class="sidebar-nav-list pn-places">';
    PLACES.forEach(function (p) {
      html += b(cur === p.id && view !== 'more' && view !== 'calendar' && view !== 'tools', "PlatformNav.go('" + p.id + "')", p.icon, p.label, p.tip);
      if (p.id === 'today') html += b(view === 'calendar', "PlatformNav.go('calendar')", '📅', 'Week Plan', 'Timetable and weekly schedule', true);
      if (p.id === 'library') {
        html += b(false, "PlatformNav.go('plans')", '📋', 'Lesson Plans', 'Word and PDF lesson plans', true);
        html += b(view === 'tools', "PlatformNav.go('tools')", '🪄', 'Board & Book', 'Smart Board, Magic Book & Pair Picker', true);
        html += b(view === 'more', "PlatformNav.go('more')", '⚙️', 'More & Settings', 'Teacher Hub, Story Quests, Settings & Backups', true);
      }
    });
    html += '</ul>' +
      '<div class="sidebar-collapse-wrap" style="padding:14px 4px 6px;margin-top:10px;border-top:1px solid var(--border-light);">' +
        '<button type="button" class="btn-sidebar-collapse" onclick="toggleSidebarCollapse()" title="Toggle Sidebar Width" style="width:100%;display:flex;align-items:center;justify-content:center;gap:8px;background:var(--bg-muted);border:1px solid var(--border-light);border-radius:10px;padding:8px;cursor:pointer;font-weight:700;font-size:.8rem;color:var(--text-muted);">' +
          '<span class="collapse-icon">⇤</span> <span class="collapse-text">Collapse Sidebar</span></button></div>';
    return html;
  }
  /* the picture rail used in Class Mode */
  var RAIL_ART = { home: 'm_home', today: 'h_calendar', games: 'm_games', board: 'm_scoreboard', shop: 'r_chest', library: 'm_lesson', tools: 'm_pick', calendar: 'h_week_path', more: 'm_teacher_key' };
  var RAIL_C = { home: '#2fc58a', today: '#9b7bff', games: '#ff5fa2', board: '#ff5fa2', shop: '#ffb320', library: '#4f9dff', tools: '#ec4899', calendar: '#f59e0b', more: '#64748b' };
  function railHtml(view) {
    var cur = placeOf(view);
    return '<nav class="cm-rail" aria-label="Class menu">' + PLACES.map(function (p) {
      return '<button type="button" class="cm-b' + (cur === p.id ? ' is-on' : '') + '" data-rail="' + p.id + '" style="--c:' + RAIL_C[p.id] + '" onclick="PlatformNav.go(\'' + p.id + '\')" title="' + esc(p.tip) + '">' +
        '<img src="platform-art/' + RAIL_ART[p.id] + '.webp" alt="" decoding="async" draggable="false"><span>' + esc(p.label) + '</span></button>';
    }).join('') + '<button type="button" class="cm-b" style="--c:#0f766e" onclick="PlatformNav.search()" title="Search (Ctrl+K)"><span style="font-size:1.9rem;line-height:1.2">🔍</span><span>Search</span></button></nav>';
  }

  /* ---------------------------------------------------------------- shared bits */
  /* Design: Bright Adventure Park look (docs/STYLE_GUIDE.md) — deep ink on crisp white/cream cards,
     team-colour accents, chunky 5px push-button lips, and clear readability on phones, tablets & smartboards. */
  var CSS = '<style>' +
    '.pn{--void:#fff8ec;--glass:#ffffff;--line:#ead9bf;--ink:#2b1d40;--mute:#5b4a75;--now:#ffb320;--go:#2fc58a;--brand:#9b7bff;--link:#4f9dff;--spring:cubic-bezier(.175,.885,.32,1.275);' +
      'max-width:1180px;margin:0 auto;padding:8px 8px 92px;color:var(--ink);font-family:"Plus Jakarta Sans",system-ui,sans-serif}' +
    '.pn h1{margin:0;font:800 clamp(1.6rem,2.4vw,2.1rem)/1.15 Fraunces,Georgia,serif;letter-spacing:-.01em;color:var(--ink)}.pn .sub{color:var(--mute);font-size:.95rem;font-weight:700;margin-top:4px;max-width:70ch}' +
    '.pn-top{display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap}.pn-top>div{flex:1;min-width:220px}' +
    '.pn-card{background:#ffffff;border:3px solid #cfe6ff;border-bottom:6px solid #a8d2ff;border-radius:24px;padding:16px 18px;margin-top:14px;box-shadow:0 10px 24px -12px rgba(43,29,64,.25);color:var(--ink)}' +
    /* day ribbon */
    '.pn-rib{display:flex;align-items:flex-start;margin:16px 0 0;padding:12px 8px 10px;overflow-x:auto;background:rgba(255,255,255,.86);border:2.5px solid #cfe6ff;border-radius:20px;-webkit-overflow-scrolling:touch;scrollbar-width:none}.pn-rib::-webkit-scrollbar{display:none}' +
    '.pn-st{flex:1;min-width:74px;position:relative;text-align:center;background:none;border:0;color:var(--mute);cursor:pointer;padding:0 2px;font:inherit}' +
    '.pn-st:before{content:"";position:absolute;top:9px;left:0;right:0;height:4px;background:#d8c8ee}.pn-st:first-child:before{left:50%}.pn-st:last-child:before{right:50%}' +
    '.pn-st i{position:relative;display:block;width:22px;height:22px;margin:0 auto 6px;border-radius:50%;background:#fff8ec;border:3px solid #9b7bff}' +
    '.pn-st b{display:block;font-size:.86rem;font-weight:900;color:var(--ink)}.pn-st small{display:block;font-size:.74rem;font-weight:800;color:var(--mute)}' +
    '.pn-st.done{opacity:.52}.pn-st.done i{background:#d8c8ee}.pn-st.on i{background:var(--now);border-color:#c98200;box-shadow:0 0 0 5px rgba(255,179,32,.28)}.pn-st.on b,.pn-st.on small{color:#a85a00}' +
    '.pn-st:focus-visible{outline:3px solid var(--link);outline-offset:3px;border-radius:10px}' +
    /* the lesson card */
    '.pn-now{display:grid;grid-template-columns:auto 1fr auto;gap:8px 24px;align-items:center;padding:20px 22px;border:4px solid #ffb320;border-bottom:7px solid #d18a00;background:linear-gradient(155deg,#fffdf8 0%,#fff4d9 100%)}' +
    '.pn-cls{font:800 clamp(3.4rem,9vw,6.8rem)/.9 Fraunces,Georgia,serif;letter-spacing:-.03em;color:#6f4fe0;text-shadow:0 4px 0 rgba(155,123,255,.22)}' +
    '.pn-when{color:#b56500;font-weight:900;font-size:.98rem}.pn-title{font:800 clamp(1.2rem,2vw,1.55rem)/1.25 "Plus Jakarta Sans",system-ui,sans-serif;margin:4px 0 0;max-width:34ch;color:var(--ink)}' +
    '.pn-art{width:144px;height:144px;position:relative;display:flex;align-items:flex-end;justify-content:center}.pn-art img{position:relative;max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 10px 12px rgba(43,29,64,.25))}' +
    '.pn-art:after{content:"";position:absolute;bottom:-6px;left:12%;right:12%;height:16px;border-radius:50%;background:radial-gradient(ellipse,rgba(155,123,255,.32),transparent 70%)}' +
    '.pn-now .pn-acts{grid-column:1/-1}' +
    '@media(max-width:760px){.pn-now{grid-template-columns:auto 1fr;padding:16px}.pn-art{display:none}.pn-cls{font-size:3rem}}' +
    /* buttons: 5px lip, 4px travel */
    '.pn-acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}' +
    '.pn-a{display:inline-flex;align-items:center;gap:7px;padding:11px 16px;border-radius:16px;font:800 .96rem "Plus Jakarta Sans",system-ui,sans-serif;cursor:pointer;color:var(--ink);background:#fff8ec;border:2.5px solid #ead9bf;border-bottom:5px solid #d1b68e;transition:transform .18s var(--spring),border-bottom-width .18s var(--spring)}' +
    '.pn-a:active{transform:translateY(4px);border-bottom-width:1px}.pn-a:focus-visible{outline:3px solid var(--link);outline-offset:2px}' +
    '.pn-a.p{background:var(--go);color:#fff;border-color:#23a370;border-bottom-color:#167d54}.pn-a.v{background:#9b7bff;color:#fff;border-color:#7857e6;border-bottom-color:#5738c4}' +
    '.pn-a.s{padding:7px 12px;font-size:.84rem;border-radius:12px;border-bottom-width:4px}.pn-a.s:active{transform:translateY(3px);border-bottom-width:1px}' +
    '.pn-pill{display:inline-block;border-radius:10px;padding:3px 10px;font-weight:800;font-size:.84rem;background:#eef6ff;border:2px solid #b7d8ff;color:#1d5fb0}' +
    /* the list */
    '.pn-h{font:800 1.08rem "Plus Jakarta Sans",system-ui,sans-serif;margin:0 0 4px;color:var(--ink)}' +
    '.pn-row{display:grid;grid-template-columns:56px 52px 1fr;gap:6px 12px;align-items:center;padding:12px 0;border-top:2px solid #f2e8d8}.pn-h+.pn-row{border-top:0}' +
    '.pn-row .tx{font-weight:800;color:var(--ink)}.pn-row .bt{grid-column:3;display:flex;gap:6px;flex-wrap:wrap}.pn-row.done{opacity:.52}.pn-row.on .pn-t{color:#b56500}' +
    '.pn-t{font-weight:900;color:#6f4fe0;font-variant-numeric:tabular-nums}.pn-note{padding:8px 0;font-weight:800;color:var(--ink)}' +
    '@media(max-width:600px){.pn-row{grid-template-columns:48px 1fr}.pn-row .pn-pill{grid-column:2;justify-self:start}.pn-row .tx,.pn-row .bt{grid-column:1/-1}}' +
    /* tiles: art on top, caption tray below */
    '.pn-sec{font:800 1.08rem "Plus Jakarta Sans",system-ui,sans-serif;margin:24px 0 0;color:var(--ink)}' +
    '.pn-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:12px;margin-top:12px}' +
    '.pn-tile{display:grid;grid-template-rows:auto 1fr;padding:0;overflow:hidden;text-align:left;border-radius:22px;cursor:pointer;color:var(--ink);font:inherit;background:linear-gradient(180deg,#eef7ff 0%,#ffffff 100%);border:3px solid #cfe6ff;border-bottom:6px solid #96c5f7;box-shadow:0 8px 18px -10px rgba(43,29,64,.25);transition:transform .18s var(--spring),border-color .15s}' +
    '.pn-tile:active{transform:translateY(4px);border-bottom-width:2px}.pn-tile:hover{border-color:#9b7bff}.pn-tile:focus-visible{outline:3px solid var(--link);outline-offset:3px}' +
    '.pn-tile .art{position:relative;display:flex;align-items:center;justify-content:center;padding:12px 12px 6px}.pn-tiles.sm .pn-tile .art img{height:88px}.pn-tile .art img{height:114px;width:auto;max-width:82%;object-fit:contain;filter:drop-shadow(0 8px 10px rgba(43,29,64,.2))}' +
    '.pn-tile .art .e{font-size:3rem}.pn-tile .cap{background:#ffffff;padding:10px 12px 12px;display:flex;flex-direction:column;justify-content:flex-start;gap:2px;border-top:2px solid #edf4ff}' +
    '.pn-tile b{font-size:.98rem;line-height:1.2;color:var(--ink)}.pn-tile small{color:var(--mute);font-size:.78rem;line-height:1.3;font-weight:600}' +
    '.pn-tiles.sm{grid-template-columns:repeat(auto-fill,minmax(142px,1fr))}' +
    '@media(prefers-reduced-motion:reduce){.pn-a,.pn-tile{transition:none}}' +
    '</style>';
  var SIDE_CSS = '' +
    '.pn-search-btn{display:flex;align-items:center;gap:8px;width:100%;margin:2px 0 10px;padding:9px 12px;border-radius:12px;cursor:pointer;background:var(--bg-muted,#fff8ec);border:2px solid var(--border-light,#ead9bf);border-bottom:4px solid #d1b68e;color:var(--text-main,#2b1d40);font-weight:800;font-size:.9rem;transition:transform .12s cubic-bezier(.175,.885,.32,1.275),border-color .14s}' +
    '.pn-search-btn:hover{border-color:#6E56CF}.pn-search-btn:active{transform:translateY(3px);border-bottom-width:1px}' +
    '.pn-search-btn kbd{margin-left:auto;font:700 .7rem system-ui;opacity:.7;border:1px solid currentColor;border-radius:6px;padding:1px 5px}.nav-link-btn.pn-sub{padding-left:30px!important;font-size:.86em;opacity:.92}' +
    '.app-sidebar.is-collapsed .pn-search-btn kbd,.app-sidebar.is-collapsed .pn-search-btn .nav-label{display:none}' +
    'body:has(#app-view-container[data-view="home"]){overflow:hidden!important}' +
    'body:has(#app-view-container[data-view="home"]) .app-header,body:has(#app-view-container[data-view="home"]) .app-sidebar,body:has(#app-view-container[data-view="home"]) .eaa-mobile-tabbar,body:has(#app-view-container[data-view="home"]) .classroom-unified-dock{display:none!important}' +
    '';
  (function () { try { var st = document.createElement('style'); st.id = 'pn-side-css'; st.textContent = SIDE_CSS; document.head.appendChild(st); } catch (e) { /* optional */ } })();
  function card(inner, cls) { return '<div class="pn-card' + (cls ? ' ' + cls : '') + '">' + inner + '</div>'; }
  var ART = 'platform-art/';
  /* "Unit 5 Magic Book · Make Some Noise (pp. 72–87): 3D Pop-Out Scenes, Words…" is too long for a
     board. Show the name; the list after the colon becomes a small second line (or the tooltip). */
  function splitTitle(t) {
    t = String(t || 'English').replace(/^[^A-Za-z0-9]+/, '').trim() || 'English';
    var i = t.indexOf(': ', 12);
    return i > 0 ? { main: t.slice(0, i), rest: t.slice(i + 2) } : { main: t, rest: '' };
  }
  root.EAAShortTitle = function (t) { return splitTitle(t).main; };
  function tile(art, label, small, onclick) {
    var pic = /\.webp$/.test(art) ? '<img src="' + (art.indexOf('/') >= 0 ? art : ART + art) + '" alt="" decoding="async" draggable="false">' : '<span class="e">' + art + '</span>';
    return '<button type="button" class="pn-tile" onclick="' + onclick + '"><span class="art">' + pic + '</span><span class="cap"><b>' + esc(label) + '</b>' + (small ? '<small>' + esc(small) + '</small>' : '') + '</span></button>';
  }

  /* ---------------------------------------------------------------- Today */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function mins(t) { var m = /^(\d{1,2}):(\d{2})/.exec(t || ''); return m ? (+m[1]) * 60 + (+m[2]) : -1; }
  function classes() { try { return S().getClasses() || []; } catch (e) { return []; } }
  function className(id) { var c = classes().filter(function (x) { return x.id === id; })[0]; return c ? (c.name || id) : (id ? id.replace('class-', '').toUpperCase() : ''); }
  function eventsOn(d) {
    var C = root.CalendarView;
    if (!C || !C.eventsFor) return [];
    return C.eventsFor(d).filter(function (e) { return e.type !== 'birthday'; });
  }
  function birthdaysOn(d) { var C = root.CalendarView; return C && C.eventsFor ? C.eventsFor(d).filter(function (e) { return e.type === 'birthday'; }) : []; }
  function gradeOf(e) {
    var m = /grade=([34])/.exec(e.note || '') || /class-([34])/.exec(e.classId || '') || /Grade ?([34])/i.exec((e.title || '') + ' ' + (e.note || ''));
    return m ? Number(m[1]) : 0;
  }
  function firstPage(e) { var m = /pp?\.\s*(\d{1,3})/.exec((e.title || '') + ' ' + (e.note || '')); return m ? Number(m[1]) : 0; }
  /* the one-tap buttons for one lesson */
  function actions(e, big) {
    var C = root.CalendarView, L = C && C.linksOf ? C.linksOf(e) : [], out = [], seen = {}, g = gradeOf(e), pg = firstPage(e);
    var RANK = { p: 0, v: 1 };
    function add(cls, label, onclick) { if (seen[label]) return; seen[label] = 1; out.push({ r: (RANK[cls] != null ? RANK[cls] : /Game/.test(label) ? 2 : /Smart/.test(label) ? 3 : /Plan/.test(label) ? 4 : 5) + out.length / 100, h: '<button type="button" class="pn-a ' + cls + (big ? '' : ' s') + '" onclick="' + onclick + '">' + label + '</button>' }); }
    var hasBook = /magic-book/.test((e.note || '') + ' ' + L.map(function (l) { return l[1]; }).join(' ')) || (e.type === 'unit5' && pg > 0);
    L.forEach(function (l) {
      var u = l[1];
      if (/^magic-book\//.test(u)) return;            /* the Magic Book button below opens the right page */
      if (/^lesson-plans\//.test(u)) { add('', '📋 Plan', "PlatformNav.go('url','" + jsq(u) + "')"); return; }
      add(l[0] === '▶ Open lesson' ? 'p' : '', esc(l[0]), "PlatformNav.go('url','" + jsq(u) + "')");
    });
    if (hasBook && g) add('v', '📖 Magic Book' + (pg ? ' p. ' + pg : ''), "PlatformNav.openBook(" + g + ',' + (pg || 0) + ')');
    add('', '🪄 Smart Board', "PlatformNav.go('smartboard')");
    if (e.type === 'unit5' && g && !seen['🎮 Game']) add('', '🎮 Game', "PlatformNav.go('gm','g" + g + "-u5-" + (/Lesson 5|Revision|Mega/i.test(e.title || '') ? 'mega' : 'vocab') + "')");
    if (e.classId && big) add('', '📺 Class Board ' + esc(shortCls(e.classId)), "PlatformNav.go('class','" + jsq(e.classId) + "')");
    return out.sort(function (x, y) { return x.r - y.r; }).map(function (x) { return x.h; }).join('');
  }
  var TYPE_ICON = { speaking: '🎤', unit5: '📙', book: '📗', lesson: '📖', quiz: '📝', meeting: '👥', task: '✅', other: '📌', unit4: '📘' };
  function shortCls(id) { var n = className(id); var m = /([34]\s*[AB])\s*$/i.exec(n) || /class-(\w+)/.exec(id || ''); return m ? m[1].replace(/\s/g, '').toUpperCase() : n; }
  function artFor(e) {
    var g = gradeOf(e);
    if (e.type === 'unit5') return g === 4 ? 'magic-book/art/o_g4_bigdrum.webp' : 'magic-book/art/o_g3_timebook.webp';
    if (e.type === 'book') return ART + 'h_homework_book.webp';
    if (e.type === 'speaking') return ART + 'h_mic.webp';
    if (e.type === 'quiz') return ART + 'h_tick_stamp.webp';
    return ART + 'm_lesson.webp';
  }
  function dayName(d) { return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }); }
  function renderToday(c) {
    var now = new Date(), day = new Date(now), list = eventsOn(day), tries = 0, finished = false;
    while (!list.some(function (e) { return e.time; }) && tries < 21) { day.setDate(day.getDate() + 1); list = eventsOn(day); tries++; }
    var timed = list.filter(function (e) { return e.time; }), notes = list.filter(function (e) { return !e.time; });
    var nowM = tries ? -1 : now.getHours() * 60 + now.getMinutes(), cur = null, curIsNow = false;
    for (var i = 0; i < timed.length; i++) { var t = mins(timed[i].time); if (t + 40 > nowM) { cur = timed[i]; curIsNow = t <= nowM; break; } }
    if (!cur && timed.length && !tries) {   /* today is finished: get ready for the next school day */
      do { day.setDate(day.getDate() + 1); list = eventsOn(day); tries++; } while (!list.some(function (e) { return e.time; }) && tries < 21);
      timed = list.filter(function (e) { return e.time; }); notes = list.filter(function (e) { return !e.time; }); cur = timed[0] || null; nowM = -1; finished = true;
    }
    var label = tries ? dayName(day) : 'Today';
    var hello = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';
    var sub = finished ? 'Today’s lessons are done. Here is ' + dayName(day) + '.' : tries ? 'No lessons today. Here is ' + dayName(day) + '.' : dayName(now) + ', ' + timed.length + (timed.length === 1 ? ' lesson' : ' lessons');
    var html = CSS + '<div class="pn"><div class="pn-top"><div><h1>' + esc(hello) + '</h1><div class="sub">' + esc(sub) + '</div></div>' +
      '<button type="button" class="pn-a s p" onclick="PlatformNav.go(\'games\')">🎮 All 25 Games</button>' +
      '<button type="button" class="pn-a s v" onclick="PlatformNav.go(\'home\')">🏝️ 3D Island</button>' +
      '<button type="button" class="pn-a s" onclick="PlatformNav.search()">🔍 Search</button>' +
      '<button type="button" class="pn-a s" onclick="PlatformNav.go(\'calendar\')">📅 Whole week</button></div>';
    if (timed.length > 1) {
      html += '<div class="pn-rib" aria-label="Lessons in order">' + timed.map(function (e, k) {
        var done = !tries && mins(e.time) + 40 <= nowM;
        return '<button type="button" class="pn-st' + (e === cur ? ' on' : done ? ' done' : '') + '" onclick="PlatformNav.jump(' + k + ')" title="' + esc(e.title || '') + '"><i></i><b>' + esc(e.time) + '</b><small>' + esc(e.classId ? shortCls(e.classId) : '') + '</small></button>';
      }).join('') + '</div>';
    }
    if (cur) {
      var when = tries ? 'First lesson on ' + dayName(day) + ', ' + cur.time : (curIsNow ? 'Now, since ' : 'Next, at ') + cur.time;
      html += '<div class="pn-card pn-now">' +
        (cur.classId ? '<div class="pn-cls" aria-label="Class">' + esc(shortCls(cur.classId)) + '</div>' : '<div></div>') +
        '<div><div class="pn-when">' + esc(when) + '</div><div class="pn-title">' + esc(splitTitle(cur.title).main) + '</div>' + (splitTitle(cur.title).rest ? '<div style="opacity:.75;font-size:1rem;margin-top:4px">' + esc(splitTitle(cur.title).rest) + '</div>' : '') + '</div>' +
        '<div class="pn-art"><img src="' + artFor(cur) + '" alt="" decoding="async" draggable="false"></div>' +
        '<div class="pn-acts">' + actions(cur, true) + '</div></div>';
    } else {
      html += '<div class="pn-card"><div class="pn-title">The calendar has no lessons for the next three weeks.</div><div class="pn-acts"><button type="button" class="pn-a v" onclick="PlatformNav.go(\'calendar\')">📅 Add lessons in Plan</button></div></div>';
    }
    if (timed.length) {
      html += '<div class="pn-card" id="pn-list"><h2 class="pn-h">' + esc(label) + '</h2>' + timed.map(function (e, k) {
        var done = !tries && mins(e.time) + 40 <= nowM;
        return '<div class="pn-row' + (done ? ' done' : '') + (e === cur ? ' on' : '') + '" id="pn-l' + k + '"><span class="pn-t">' + esc(e.time) + '</span>' +
          '<span class="pn-pill">' + esc(e.classId ? shortCls(e.classId) : '—') + '</span><span class="tx" title="' + esc(e.title || '') + '">' + (TYPE_ICON[e.type] || '📖') + ' ' + esc(splitTitle(e.title).main) + '</span>' +
          (e === cur ? '' : '<span class="bt">' + actions(e, false) + '</span>') + '</div>';
      }).join('') +
      notes.map(function (e) { return '<div class="pn-note">' + (TYPE_ICON[e.type] || '📌') + ' ' + esc(e.title) + '</div>'; }).join('') +
      birthdaysOn(day).map(function (e) { return '<div class="pn-note">🎂 ' + esc(e.title) + '</div>'; }).join('') + '</div>';
    }
    html += '<h2 class="pn-sec">Open</h2><div class="pn-tiles sm">' +
      tile('m_home.webp', '3D Island', 'Castle, theatre, market, games', "PlatformNav.go('home')") +
      tile('m_scoreboard.webp', 'Class Board', 'Points, timer, shop', "PlatformNav.go('board')") +
      tile('m_lesson.webp', 'Library', 'Lessons and games', "PlatformNav.go('library')") +
      tile('h_pencil.webp', 'Smart Board', 'Write, cards, pictures', "PlatformNav.go('smartboard')") +
      tile(activeGrade() === 4 ? 'magic-book/art/o_g4_bigdrum.webp' : 'magic-book/art/o_g3_timebook.webp', 'Magic Book', 'Grade ' + activeGrade() + ', Unit 5', "PlatformNav.go('book')") +
      tile('m_games.webp', 'Game Maker', 'A game from any words', "PlatformNav.go('gm')") +
      '</div></div>';
    c.innerHTML = html;
  }

  /* ---------------------------------------------------------------- 3D Island Home (Front Door) */
  function renderHome(c) {
    var existing = c.querySelector('#pn-home3d-frame');
    if (existing) {
      try {
        var cw = existing.contentWindow;
        if (cw && cw.__home3d && cw.__home3d.refreshGoal) cw.__home3d.refreshGoal();
        var actCls = S() && S().getActiveClass && S().getActiveClass();
        if (actCls && actCls.id && cw && cw.HomeClassroomHub && cw.HomeClassroomHub.setClass) {
          cw.HomeClassroomHub.setClass(actCls.id);
        }
      } catch (e) {}
      return;
    }
    c.innerHTML =
      '<div class="pn-home3d-wrap" style="position:fixed;inset:0;width:100%;height:100%;height:100dvh;z-index:2000;background:#78c4ff">' +
        '<iframe id="pn-home3d-frame" class="pn-home3d-frame" src="home3d/index.html?v=20261124q" title="Adventure Island · English Adventure Academy 3D Front Door" allow="autoplay; fullscreen; microphone" style="width:100%;height:100%;border:0;display:block"></iframe>' +
        '<div class="sr-only" aria-hidden="false" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)">' +
          'English Adventure Academy 3D Island Front Door — Tap the Castle for Today, the Theatre for Class Board, the Market for Shop, the Stadium for Games, or the Library Tower for Library.' +
        '</div>' +
      '</div>';
  }

  /* ---------------------------------------------------------------- Board & Book */
  function renderTools(c) {
    c.innerHTML = CSS + '<div class="pn"><h1>Board, Book &amp; Story Quests</h1><div class="sub">Classroom tools, Magic Book, Smart Board and story adventures.</div>' +
      '<div class="pn-tiles">' +
        tile('h_pencil.webp', 'Smart Board', 'Neat writing, word cards, pictures', "PlatformNav.go('smartboard')") +
        tile('magic-book/art/o_g3_timebook.webp', 'Magic Book, Grade 3', "Unit 5: Let's Go Back", "PlatformNav.go('book',3)") +
        tile('magic-book/art/o_g4_bigdrum.webp', 'Magic Book, Grade 4', 'Unit 5: Make Some Noise', "PlatformNav.go('book',4)") +
        tile('m_games.webp', 'All 26 Games', 'Turn any unit into a team game', "PlatformNav.go('gm')") +
      '</div><h2 class="pn-sec">Classroom tools &amp; Story Quests</h2><div class="pn-tiles sm">' +
        tile('m_timer.webp', 'Timer', 'Count down a task', "PlatformNav.go('timer')") +
        tile('m_pick.webp', 'Pick a pupil', 'Everyone once before repeats', "PlatformNav.go('pick')") +
        tile('🟢', 'Slime Pair Picker', 'Pick 2 speakers for dialogues', "PlatformNav.go('pairpicker')") +
        tile('h_backpack.webp', 'Groups', 'Make teams on the board', "PlatformNav.go('groups')") +
        tile('h_headphones.webp', 'Sleepy Mio', 'The quiet game', "PlatformNav.go('sleepy')") +
        tile('h_mic.webp', 'Karaoke', 'Pupils read one by one', "PlatformNav.go('karaoke')") +
        tile('🌍', 'Treasure Planet 3D', 'Chapter 1 3D reading globe', "PlatformNav.go('planet3d')") +
        tile('⛵', 'Harbour Story Quest', 'Practice Island story adventure', "PlatformNav.go('island')") +
        tile('🚻', 'Bathroom pass', 'Sign out and back in', "PlatformNav.go('bathroom')") +
      '</div></div>';
  }

  /* ---------------------------------------------------------------- More */
  var MORE_ART = { command: 'm_teacher_key.webp', 'store-teacher': 'r_chest.webp', island: 'h_week_path.webp', 'lesson-archive': 'r_stickers.webp', settings: '⚙️', archived: '🗄️' };
  function renderMore(c) {
    c.innerHTML = CSS + '<div class="pn"><h1>More</h1><div class="sub">Things you need now and then.</div><div class="pn-tiles sm">' +
      MORE.map(function (m) { return tile(MORE_ART[m.v] || m.icon, m.label, m.tip, "PlatformNav.go('" + m.v + "')"); }).join('') + '</div></div>';
  }

  /* ---------------------------------------------------------------- Old lessons */
  var arQ = '';
  function renderLessonArchive(c) {
    var LC = root.LibraryCurate, list = LC && LC.archivedList ? LC.archivedList() : [];
    var q = arQ.toLowerCase(), shown = list.filter(function (g) { return !q || (g.title + ' ' + g.id).toLowerCase().indexOf(q) >= 0; });
    c.innerHTML = CSS + '<div class="pn"><h1>Old lessons</h1><div class="sub">Units 1–4, Halloween, Alice and Wonderland. They are kept out of the Library so it stays short. Nothing is deleted, and Search still finds them.</div>' +
      '<input type="search" placeholder="Find an old lesson" value="' + esc(arQ) + '" oninput="PlatformNav.arFilter(this.value)" style="margin-top:12px;width:min(420px,100%);padding:10px 14px;border-radius:14px;border:2.5px solid #b7d8ff;background:#ffffff;color:#2b1d40;font-weight:700">' +
      card(shown.map(function (g) {
        var back = LC.isArchived && !LC.isArchived(g.id);
        return '<div class="pn-row" style="grid-template-columns:1fr auto"><span class="tx">' + esc(g.title) + '</span><span style="display:flex;gap:6px;flex-wrap:wrap">' +
          (g.url ? '<button type="button" class="pn-a s p" onclick="PlatformNav.go(\'url\',\'' + jsq(g.url) + '\')">▶ Open</button>' : '<button type="button" class="pn-a s p" onclick="PlatformNav.go(\'game\',\'' + jsq(g.id) + '\')">▶ Open</button>') +
          (back ? '<button type="button" class="pn-a s" onclick="PlatformNav.arMove(\'' + jsq(g.id) + '\',0)">📦 Archive again</button>' : '<button type="button" class="pn-a s" onclick="PlatformNav.arMove(\'' + jsq(g.id) + '\',1)" title="Show it in the Library again">↩ Back to Library</button>') +
          '</span></div>';
      }).join('') || '<div class="sub">Nothing found.</div>') + '</div>';
  }

  /* ---------------------------------------------------------------- Search everywhere */
  var SETS = [['g3-u5-vocab', "Unit 5 words · Let's Go Back (Grade 3)"], ['g3-u5-timebook', 'The Time Book (Grade 3)'], ['g3-u5-capsules', 'Time capsules (Grade 3)'], ['g3-u5-mega', 'Unit 5 mega mix (Grade 3)'],
    ['g4-u5-vocab', 'Unit 5 words · Make Some Noise (Grade 4)'], ['g4-u5-foley', 'Foley sound studio (Grade 4)'], ['g4-u5-beethoven', 'Beethoven & the concert hall (Grade 4)'], ['g4-u5-mega', 'Unit 5 mega mix (Grade 4)'],
    ['smart-g3', 'Smart mix (Grade 3)'], ['smart-g4', 'Smart mix (Grade 4)'], ['u14-g3', 'Units 1–4 (Grade 3)'], ['u14-g4', 'Units 1–4 (Grade 4)']];
  var TOOLS = [['🪄', 'Smart Board', 'smartboard'], ['📙', 'Magic Book Grade 3', 'book', 3], ['📘', 'Magic Book Grade 4', 'book', 4], ['🎮', 'Game Maker', 'gm'], ['⏱️', 'Timer', 'timer'], ['🎲', 'Pick a pupil', 'pick'], ['👥', 'Groups', 'groups'],
    ['😴', 'Sleepy Mio', 'sleepy'], ['🎤', 'Karaoke', 'karaoke'], ['🚻', 'Bathroom pass', 'bathroom'], ['🛍️', 'Pupil shop', 'store-pupil'], ['🏆', 'Class Podium', 'rewards'], ['🏝️', 'Practice Island', 'island']];
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i'); }
  function index() {
    var out = [];
    PLACES.forEach(function (p) { out.push({ k: 'Places', icon: p.icon, t: p.label, s: p.tip, a: ['go', p.id] }); });
    MORE.forEach(function (m) { out.push({ k: 'Places', icon: m.icon, t: m.label, s: m.tip, a: ['go', m.v] }); });
    TOOLS.forEach(function (t) { out.push({ k: 'Tools', icon: t[0], t: t[1], a: ['go', t[2], t[3]] }); });
    var LC = root.LibraryCurate;
    (root.GAMES_DATA || []).forEach(function (g) {
      if (!g || !g.id) return;
      var old = LC && LC.isArchived && LC.isArchived(g.id);
      out.push({ k: old ? 'Old lessons' : 'Lessons & games', icon: old ? '📦' : '🎲', t: g.title, s: [g.grade, g.category].filter(Boolean).join(' · '), extra: (g.tags || []).join(' ') + ' ' + g.id + ' ' + (g.description || ''), a: ['game', g.id] });
    });
    if (LC && LC.archivedList) LC.archivedList().forEach(function (g) { if (g.url) out.push({ k: 'Old lessons', icon: '📦', t: g.title, a: ['url', g.url] }); });
    SETS.forEach(function (s) { out.push({ k: 'Game Maker', icon: '🎮', t: s[1], extra: s[0], a: ['gm', s[0]] }); });
    (root.LESSON_PLANS || []).forEach(function (p) {
      out.push({ k: 'Lesson plans', icon: '📋', t: p.title, s: p.grade + (p.date ? ' · ' + p.date : ''), extra: p.file, a: ['url', 'lesson-plans/' + p.file + '.pdf'] });
    });
    [3, 4].forEach(function (g) {
      for (var pg = 72; pg <= 87; pg += 2) out.push({ k: 'Magic Book', icon: g === 3 ? '📙' : '📘', t: 'Magic Book Grade ' + g + ' · pages ' + pg + '–' + (pg + 1), s: 'Unit 5', extra: 'page p ' + pg + ' ' + (pg + 1) + ' book textbook unit 5', a: ['page', g, pg] });
    });
    classes().forEach(function (c) { out.push({ k: 'Classes', icon: '🏫', t: c.name || c.id, s: 'Open the Class Board', a: ['go', 'class', c.id] }); });
    try {
      (S().getStudents() || []).forEach(function (s) {
        var n = ((s.firstName || '') + ' ' + (s.lastName || '')).trim() || s.name; if (!n) return;
        out.push({ k: 'Pupils', icon: '🧑‍🎓', t: n, s: className(s.classId), a: ['pupil', s.id] });
      });
    } catch (e) { /* no pupils */ }
    return out;
  }
  function score(r, words) {
    var t = norm(r.t), all = t + ' ' + norm(r.s) + ' ' + norm(r.extra), sc = 0;
    for (var i = 0; i < words.length; i++) {
      var w = words[i]; if (!new RegExp('(^|[^a-z0-9])' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(all)) return 0;
      sc += t.indexOf(w) === 0 ? 6 : (' ' + t).indexOf(' ' + w) >= 0 ? 4 : t.indexOf(w) >= 0 ? 2 : 1;
    }
    if (r.k === 'Places' || r.k === 'Tools') sc += 2;
    if (r.k === 'Old lessons') sc -= 1.5;
    return sc;
  }
  var srch = { el: null, res: [], sel: 0, idx: null };
  function openSearch(q) {
    closeSearch(); srch.idx = index();
    var o = document.createElement('div'); o.id = 'pn-search';
    o.style.cssText = 'position:fixed;inset:0;z-index:100050;background:rgba(43,29,64,.42);backdrop-filter:blur(5px);display:flex;justify-content:center;align-items:flex-start;padding:8vh 12px 12px';
    o.innerHTML = '<div style="width:min(720px,100%);background:#ffffff;border:4px solid #4f9dff;border-radius:24px;box-shadow:0 28px 70px rgba(43,29,64,.35);overflow:hidden;color:#2b1d40;font-family:inherit">' +
      '<div style="display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:2px solid #e6f0ff;background:#fffdf8"><span style="font-size:1.4rem">🔍</span>' +
      '<input id="pn-q" type="search" autocomplete="off" placeholder="Find a lesson, game, plan, book page, pupil or tool…" style="flex:1;background:transparent;border:0;outline:0;color:#2b1d40;font:800 1.08rem inherit">' +
      '<button type="button" data-x style="background:#fff8ec;border:2px solid #ead9bf;border-bottom:4px solid #d1b68e;color:#2b1d40;border-radius:10px;padding:4px 10px;cursor:pointer;font-weight:800">✕</button></div>' +
      '<div id="pn-res" style="max-height:62vh;overflow:auto;padding:6px 8px 10px"></div></div>';
    document.body.appendChild(o); srch.el = o;
    o.addEventListener('click', function (e) { if (e.target === o || e.target.hasAttribute('data-x')) closeSearch(); });
    var inp = o.querySelector('#pn-q');
    inp.value = q || ''; inp.addEventListener('input', function () { srch.sel = 0; paint(inp.value); });
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { srch.sel = Math.min(srch.res.length - 1, srch.sel + 1); paintSel(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { srch.sel = Math.max(0, srch.sel - 1); paintSel(); e.preventDefault(); }
      else if (e.key === 'Enter') { pickResult(srch.sel); e.preventDefault(); }
      else if (e.key === 'Escape') closeSearch();
    });
    paint(inp.value); setTimeout(function () { inp.focus(); }, 30);
  }
  var EMPTY = ['Places', 'Tools'];
  function paint(q) {
    var box = srch.el && srch.el.querySelector('#pn-res'); if (!box) return;
    var words = norm(q).split(/\s+/).filter(Boolean), res;
    if (!words.length) res = srch.idx.filter(function (r) { return EMPTY.indexOf(r.k) >= 0; });
    else res = srch.idx.map(function (r) { return { r: r, s: score(r, words) }; }).filter(function (x) { return x.s > 0; })
      .sort(function (a, b) { return b.s - a.s; }).slice(0, 40).map(function (x) { return x.r; });
    srch.res = res;
    var groups = {}, order = [];
    res.forEach(function (r, i) { r._i = i; if (!groups[r.k]) { groups[r.k] = []; order.push(r.k); } groups[r.k].push(r); });
    box.innerHTML = res.length ? order.map(function (k) {
      return '<div style="font-size:.82rem;font-weight:800;color:#68537d;padding:12px 10px 4px">' + esc(k) + '</div>' + groups[k].map(function (r) {
        return '<button type="button" class="pn-r" data-i="' + r._i + '" style="display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:9px 10px;border-radius:12px;border:0;background:transparent;color:#2b1d40;cursor:pointer;font:inherit">' +
          '<span style="font-size:1.25rem;width:28px;text-align:center">' + r.icon + '</span><span style="flex:1;min-width:0"><b style="display:block;font-size:.95rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(r.t) + '</b>' +
          (r.s ? '<small style="color:#68537d">' + esc(r.s) + '</small>' : '') + '</span></button>';
      }).join('');
    }).join('') : '<div style="padding:24px;text-align:center;color:#68537d">Nothing found. Try one word, for example <b>time</b>, <b>noise</b> or a pupil’s name.</div>';
    [].forEach.call(box.querySelectorAll('.pn-r'), function (b) {
      b.addEventListener('click', function () { pickResult(+b.getAttribute('data-i')); });
      b.addEventListener('mousemove', function () { if (srch.sel !== +b.getAttribute('data-i')) { srch.sel = +b.getAttribute('data-i'); paintSel(); } });
    });
    paintSel();
  }
  function paintSel() {
    if (!srch.el) return;
    [].forEach.call(srch.el.querySelectorAll('.pn-r'), function (b) {
      var on = +b.getAttribute('data-i') === srch.sel; b.style.background = on ? '#eef6ff' : 'transparent';
      if (on && b.scrollIntoView) b.scrollIntoView({ block: 'nearest' });
    });
  }
  function closeSearch() { if (srch.el) { srch.el.remove(); srch.el = null; } }
  function pickResult(i) {
    var r = srch.res[i]; if (!r) return; closeSearch(); var a = r.a;
    if (a[0] === 'go') go(a[1], a[2]);
    else if (a[0] === 'game') go('game', a[1]);
    else if (a[0] === 'gm') go('gm', a[1]);
    else if (a[0] === 'url') go('url', a[1]);
    else if (a[0] === 'page') api.openBook(a[1], a[2]);
    else if (a[0] === 'pupil') {
      if (root.PupilProfile && root.PupilProfile.open) { try { root.PupilProfile.open(a[1]); return; } catch (e) { /* fall through */ } }
      try { var s = S().getStudent(a[1]); if (s && s.classId) S().setActiveClass(s.classId); } catch (e) { /* optional */ }
      sw('board');
    }
  }
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      var role = S() && S().getRole ? S().getRole() : 'teacher'; if (role !== 'teacher') return;
      e.preventDefault(); if (srch.el) closeSearch(); else openSearch();
    }
  });

  var api = {
    PLACES: PLACES, MORE: MORE, placeOf: placeOf, go: go, sidebarHtml: sidebarHtml, railHtml: railHtml, search: openSearch, closeSearch: closeSearch, index: index,
    openBook: function (g, page) { openUrl('magic-book/index.html?grade=' + g + (page ? '&page=' + page : ''), 'magicbook'); },
    jump: function (k) { var el = document.getElementById('pn-l' + k); if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.style.outline = '3px solid #f59e0b'; el.style.borderRadius = '10px'; setTimeout(function () { el.style.outline = ''; }, 1400); } },
    arFilter: function (v) { arQ = String(v || ''); var c = document.getElementById('app-view-container'); if (c) { renderLessonArchive(c); var i = c.querySelector('input[type=search]'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } } },
    arMove: function (id, back) { var LC = root.LibraryCurate; if (!LC) return; if (back) LC.bringBack(id); else LC.sendToArchive(id); if (root.showNotification) root.showNotification(back ? 'It is back in the Library.' : 'Moved to Old lessons.'); var c = document.getElementById('app-view-container'); if (c) renderLessonArchive(c); }
  };
  root.PlatformNav = api;
  root.PlatformViews = { home: renderHome, today: renderToday, tools: renderTools, more: renderMore, 'lesson-archive': renderLessonArchive,
    'store-pupil': function (c) { if (root.renderPupilShopView) root.renderPupilShopView(c); else c.innerHTML = '<div style="padding:40px;text-align:center">The shop is not loaded.</div>'; },
    'store-teacher': function (c) { if (root.renderClassroomStoreView) root.renderClassroomStoreView(c); else c.innerHTML = '<div style="padding:40px;text-align:center">The store is not loaded.</div>'; } };
})(typeof window !== 'undefined' ? window : this);
