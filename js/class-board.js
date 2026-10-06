/* Class Board: a full-screen projector view. Every monster with its points and quick +1/+5/+10,
   a big timer, a class goal bar, a random picker and an absent toggle. Adds the view "board". */
(function (root) {
  'use strict';
  function S() { return root.schoolStore || root.store; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var timer = { total: 300, left: 300, running: false, h: null };
  var absent = {};            // studentId -> true (this session only, does not touch the attendance records)
  var pickBusy = false;

  function goalKey(cls) { return 'eaa_board_goal_' + cls.id; }
  function loadGoal(cls) {
    // The cloud copy (shared with the Classroom Store save) is the truth; this browser only keeps a fallback.
    try { var cg = root.ClassroomStore && root.ClassroomStore.getBoardGoal(cls.id); if (cg && cg.target) return cg; } catch (e) { /* use fallback */ }
    try { var g = JSON.parse(localStorage.getItem(goalKey(cls))); if (g && g.target) return g; } catch (e) { /* none saved */ }
    return { label: 'Pizza party!', target: 500, since: new Date().setHours(0, 0, 0, 0) };
  }
  function saveGoal(cls, g) {
    try { localStorage.setItem(goalKey(cls), JSON.stringify(g)); } catch (e) { /* private mode */ }
    try { if (root.ClassroomStore) root.ClassroomStore.setBoardGoal(cls.id, g); } catch (e) { /* local copy still saved */ }
  }
  function loadAbsent(cls) {
    absent = {};
    try { var d = JSON.parse(sessionStorage.getItem('eaa_board_absent_' + cls.id) || '{}'); absent = d || {}; } catch (e) { absent = {}; }
  }
  function saveAbsent(cls) { try { sessionStorage.setItem('eaa_board_absent_' + cls.id, JSON.stringify(absent)); } catch (e) { /* ignore */ } }

  function students(cls) {
    var st = S();
    return st.getStudentsByClass(cls.id).map(function (s) {
      var m = st.calculateMonsterState ? st.calculateMonsterState(s.id) : {};
      var prof = st.getMonsterProfile ? st.getMonsterProfile(s.id) : null, img = '';
      try { img = root.getStudentMonsterAvatarUrl ? root.getStudentMonsterAvatarUrl(s, prof, m) : ''; } catch (e) { img = ''; }
      var x = {};
      try { x = (root.ClassroomStore && root.ClassroomStore.cosmetics) ? root.ClassroomStore.cosmetics.equipped(s.id) : {}; } catch (e) { x = {}; }
      return { id: s.id, name: s.firstName || s.name || 'Student', xp: Number(m.totalXP != null ? m.totalXP : s.xp) || 0, img: img, x: x };
    }).sort(function (a, b) { return b.xp - a.xp; });
  }
  function goalProgress(cls, g) {
    var ids = {}; S().getStudentsByClass(cls.id).forEach(function (s) { ids[s.id] = 1; });
    var sum = 0;
    (S().state.xpTransactions || []).forEach(function (t) {
      if (ids[t.studentId] && t.status !== 'voided' && t.status !== 'reverted') {
        var amt = Number(t.amount) || 0, ts = new Date(t.timestamp).getTime();
        if (amt > 0 && ts >= g.since) sum += amt;
      }
    });
    return sum;
  }

  var CSS = '' +
    '.cb{font-family:Fredoka,Nunito,system-ui,sans-serif;color:#fff;border-radius:26px;padding:20px 24px 110px;min-height:calc(100vh - 110px);position:relative;overflow:hidden;' +
      'background:radial-gradient(circle at 12% 8%,rgba(255,255,255,.16),transparent 38%),radial-gradient(circle at 92% 28%,rgba(255,200,80,.2),transparent 34%),linear-gradient(180deg,#2b1b6e 0%,#4a2bb0 48%,#6d3fd1 100%)}' +
    '.cb:fullscreen{border-radius:0;overflow:auto}.cb *{box-sizing:border-box}' +
    '.cb-hd{display:flex;align-items:center;gap:16px;flex-wrap:wrap;position:relative}.cb-hd h1{font-size:2rem;font-weight:600;margin:0;color:#fff}.cb-hd small{display:block;font-size:.95rem;opacity:.75;font-weight:500}' +
    '.cb-tm{margin-left:auto;display:flex;gap:10px;flex-wrap:wrap}.cb-tm div{background:rgba(255,255,255,.14);backdrop-filter:blur(8px);border-radius:18px;padding:8px 18px;text-align:center;border:1px solid rgba(255,255,255,.22);min-width:96px}' +
    '.cb-tm b{font-size:1.9rem;font-weight:600;display:block;line-height:1.1;font-variant-numeric:tabular-nums}.cb-tm small{font-size:.75rem;opacity:.8}' +
    '.cb-tm .cb-clock.run{background:rgba(34,197,94,.3);border-color:#4ade80}.cb-tm .cb-clock.low b{color:#fbbf24}.cb-tm .cb-clock.end{background:rgba(244,63,94,.4);border-color:#fb7185;animation:cbPulse .8s infinite}' +
    '@keyframes cbPulse{50%{transform:scale(1.05)}}' +
    '.cb-goal{margin:16px 0 18px;background:rgba(0,0,0,.26);border-radius:20px;padding:12px 18px;display:flex;align-items:center;gap:16px;position:relative;cursor:pointer}' +
    '.cb-goal .bar{flex:1;height:22px;border-radius:99px;background:rgba(255,255,255,.18);overflow:hidden}.cb-goal .bar i{display:block;height:100%;background:linear-gradient(90deg,#fbbf24,#fb7185);border-radius:99px;box-shadow:0 0 18px #fbbf24;transition:width .5s}' +
    '.cb-goal b{font-size:1.1rem;font-weight:600;white-space:nowrap}' +
    '.cb-mg{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px;position:relative}' +
    '.cb-st{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.24);backdrop-filter:blur(8px);border-radius:24px;padding:10px 8px 12px;text-align:center;position:relative;transition:transform .18s,background .18s}' +
    '.cb-st:hover{transform:translateY(-5px);background:rgba(255,255,255,.2)}' +
    '.cb-st img{width:100%;aspect-ratio:1;object-fit:contain;filter:drop-shadow(0 10px 8px rgba(0,0,0,.35));cursor:pointer}' +
    '.cb-st b.n{display:block;font-weight:600;font-size:1.1rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.cb-pt{position:absolute;top:8px;right:8px;background:#fbbf24;color:#4a2300;border-radius:99px;padding:2px 11px;font-weight:600;font-size:.95rem;font-variant-numeric:tabular-nums}' +
    '.cb-add{display:flex;gap:6px;justify-content:center;margin-top:8px}.cb-add button{border:0;background:rgba(255,255,255,.2);color:#fff;border-radius:99px;padding:5px 11px;font:500 .9rem Fredoka,sans-serif;cursor:pointer;border-bottom:3px solid rgba(0,0,0,.2)}' +
    '.cb-add button:hover{background:#22c55e}.cb-add button:active{transform:translateY(2px);border-bottom-width:1px}' +
    '.cb-ti{display:block;margin:3px auto 0;max-width:96%;font-size:.74rem;font-weight:600;background:rgba(251,191,36,.95);color:#4a2300;border-radius:99px;padding:1px 9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.cb-an{position:absolute;left:6px;top:6px;width:38px;height:38px;border-radius:50%;background:#fff center/contain no-repeat;border:2px solid rgba(255,255,255,.9);box-shadow:0 3px 8px rgba(0,0,0,.35)}' +
    '.cb-st.plated .cb-pt{box-shadow:0 2px 6px rgba(0,0,0,.35)}' +
    '.cb-st.plated .cb-add button{background:rgba(38,33,92,.78);color:#fff}.cb-st.plated .cb-add button:hover{background:#16a34a}' +
    '.cb-st.off{opacity:.42;filter:grayscale(.7)}.cb-st.off .cb-add{visibility:hidden}.cb-st.pick{animation:cbPick .25s infinite alternate;background:rgba(251,191,36,.45);border-color:#fbbf24}' +
    '@keyframes cbPick{to{transform:scale(1.06)}}' +
    '.cb-burst{position:absolute;left:50%;top:30%;transform:translateX(-50%);font-weight:600;font-size:1.5rem;color:#fde68a;text-shadow:0 2px 8px rgba(0,0,0,.5);pointer-events:none;animation:cbUp 1s forwards}' +
    '@keyframes cbUp{to{transform:translate(-50%,-70px);opacity:0}}' +
    '.cb-dock{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);display:flex;gap:8px;flex-wrap:wrap;justify-content:center;max-width:94vw;background:rgba(15,10,50,.82);backdrop-filter:blur(14px);padding:10px 12px;border-radius:24px;border:1px solid rgba(255,255,255,.22);box-shadow:0 10px 30px rgba(0,0,0,.5);z-index:50}' +
    '.cb-dock button{border:0;border-radius:16px;background:rgba(255,255,255,.13);color:#fff;font:500 .95rem Fredoka,sans-serif;padding:10px 14px;cursor:pointer;display:flex;gap:6px;align-items:center;border-bottom:4px solid rgba(0,0,0,.25);white-space:nowrap}' +
    '.cb-dock button:hover{background:rgba(255,255,255,.22)}.cb-dock button:active{transform:translateY(3px);border-bottom-width:1px}.cb-dock button.p{background:#22c55e;border-bottom-color:#15803d}.cb-dock .sep{width:1px;background:rgba(255,255,255,.2);margin:4px 2px}' +
    '.cb-win{position:fixed;inset:0;z-index:99998;background:rgba(10,5,40,.78);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;font-family:Fredoka,system-ui,sans-serif;color:#fff;animation:cbFade .2s}' +
    '@keyframes cbFade{from{opacity:0}}.cb-win>div{text-align:center;background:linear-gradient(180deg,#5b34c8,#3b2399);border:2px solid rgba(255,255,255,.3);border-radius:34px;padding:34px 52px;box-shadow:0 30px 80px rgba(0,0,0,.6)}' +
    '.cb-win img{width:min(260px,50vw);filter:drop-shadow(0 16px 12px rgba(0,0,0,.4))}.cb-win h2{font-size:3rem;font-weight:600;margin:6px 0 14px}.cb-win button{border:0;border-radius:16px;background:#22c55e;color:#fff;font:600 1.1rem Fredoka,system-ui,sans-serif;padding:11px 26px;cursor:pointer;border-bottom:4px solid #15803d}' +
    '.cb-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 0;position:relative}.cb-tabs button{border:0;border-bottom:4px solid rgba(0,0,0,.28);background:rgba(255,255,255,.14);color:#fff;font:500 1rem Fredoka,sans-serif;padding:8px 18px;border-radius:14px;cursor:pointer}.cb-tabs button.on{background:#fbbf24;color:#4a2300;border-bottom-color:#b45309}.cb-tabs button:active{transform:translateY(3px);border-bottom-width:1px}' +
    '.cb-today{margin:12px 0 0;display:flex;gap:8px;flex-wrap:wrap;align-items:center;position:relative}.cb-today .lab{font-weight:600;opacity:.8;margin-right:4px}.cb-today a,.cb-today button{text-decoration:none;color:#fff;background:rgba(34,197,94,.3);border:1px solid #4ade80;border-bottom:4px solid #15803d;border-radius:14px;padding:7px 14px;font:500 .95rem Fredoka,sans-serif;cursor:pointer}.cb-today a em{font-style:normal;color:#fde68a;margin-right:4px}.cb-today button{background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.3);border-bottom-color:rgba(0,0,0,.28)}' +
    '.cb-st .cb-mn{position:absolute;left:8px;top:8px;width:30px;height:30px;padding:0;border:0;border-radius:50%;background:rgba(0,0,0,.32);color:#fff;font:700 1rem/1 Fredoka,sans-serif;letter-spacing:1px;cursor:pointer;z-index:2}.cb-st .cb-mn:hover{background:rgba(0,0,0,.55)}.cb-st .cb-an{top:42px}' +
    '#cb-pop{position:fixed;z-index:99990;background:#1e1b4b;border:1px solid rgba(255,255,255,.25);border-radius:14px;padding:6px;display:flex;flex-direction:column;gap:2px;min-width:200px;box-shadow:0 18px 50px rgba(0,0,0,.6);font-family:Fredoka,system-ui,sans-serif}#cb-pop b{color:#fde68a;font-weight:600;padding:6px 10px 4px;font-size:.95rem}#cb-pop button{border:0;background:none;color:#fff;font:500 .95rem Fredoka,sans-serif;text-align:left;padding:9px 10px;border-radius:9px;cursor:pointer}#cb-pop button:hover{background:rgba(255,255,255,.14)}' +
    '.cb-grp{position:fixed;inset:0;z-index:99997;background:rgba(10,5,40,.82);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:18px;font-family:Fredoka,system-ui,sans-serif;color:#fff}.cb-grp>div{background:linear-gradient(180deg,#5b34c8,#3b2399);border:2px solid rgba(255,255,255,.3);border-radius:28px;padding:22px 26px;max-width:1100px;width:100%;max-height:90vh;overflow:auto;text-align:center}.cb-grp h2{margin:0 0 12px;font-weight:600}.cb-gg{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;text-align:left}.cb-gg div.g{background:rgba(255,255,255,.14);border-radius:18px;padding:12px 16px;border-top:6px solid var(--c)}.cb-gg b{display:block;font-weight:600;margin-bottom:4px;color:#fde68a}.cb-grp .row{display:flex;gap:10px;justify-content:center;margin-top:14px;flex-wrap:wrap}.cb-grp button{border:0;border-bottom:4px solid rgba(0,0,0,.3);border-radius:14px;background:#22c55e;color:#fff;font:500 1rem Fredoka,sans-serif;padding:9px 18px;cursor:pointer}.cb-grp button.g2{background:rgba(255,255,255,.2)}' +
    '@media(max-width:1100px){.cb-dock{gap:5px;padding:7px 8px;border-radius:18px}.cb-dock button{padding:7px 10px;font-size:.82rem;border-radius:12px}.cb-dock .sep{display:none}}' +
    '@media(max-width:640px){.cb{padding:14px 12px 120px}.cb-mg{grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px}.cb-hd h1{font-size:1.5rem}.cb-tm div{min-width:76px;padding:6px 10px}.cb-tm b{font-size:1.4rem}}';
  function ensureCss() {
    if (document.getElementById('cb-css')) return;
    var el = document.createElement('style'); el.id = 'cb-css'; el.textContent = CSS; document.head.appendChild(el);
  }

  function fmt(sec) { sec = Math.max(0, Math.round(sec)); return String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0'); }
  function paintClock() {
    var el = document.getElementById('cb-clock'); if (!el) { stopTimer(); return; }
    el.querySelector('b').textContent = fmt(timer.left);
    el.classList.toggle('run', timer.running); el.classList.toggle('low', timer.left <= 30 && timer.left > 0); el.classList.toggle('end', timer.left === 0);
    var pb = document.getElementById('cb-play'); if (pb) pb.textContent = timer.running ? '⏸ Pause' : '▶ Start';
  }
  function stopTimer() { timer.running = false; if (timer.h) { clearInterval(timer.h); timer.h = null; } }
  function tick() {
    timer.left -= 1;
    if (timer.left <= 0) {
      timer.left = 0; stopTimer();
      try { root.classSoundboard && (root.classSoundboard.playAttentionBell ? root.classSoundboard.playAttentionBell() : root.classSoundboard.playFanfare && root.classSoundboard.playFanfare()); } catch (e) { /* sound optional */ }
    }
    paintClock();
  }

  var viewCls = null;
  function paintGoal() {
    var g = loadGoal(viewCls), got = goalProgress(viewCls, g), pct = Math.min(100, Math.round(got / g.target * 100));
    var el = document.getElementById('cb-goal'); if (!el) return;
    el.querySelector('i').style.width = pct + '%';
    el.querySelector('.r').textContent = pct >= 100 ? '🎉 ' + g.label + ' unlocked!' : pct + '% · ' + g.label;
    el.querySelector('.l').textContent = '🎯 Class goal ' + got + ' / ' + g.target + ' XP';
  }

  function todayChips(cls) {
    var T = root.Timetable; if (!T) return '';
    var t = T.today(cls.id);
    if (!t.set) return '<button onclick="Timetable.edit()">Set my weekly timetable</button>';
    if (!t.list.length) return '<span style="opacity:.8">no lessons ' + (t.label === 'Today' ? 'today' : 'on Monday') + '</span><button onclick="Timetable.edit()">📅 Edit</button>';
    return t.list.map(function (e) {
      var inner = e.icon + ' ' + (e.time ? '<em>' + esc(e.time) + '</em> ' : '') + esc(e.title);
      return e.route ? '<a href="' + esc(e.route) + '">' + inner + ' ▶</a>' : (e.view ? '<a href="#" onclick="switchView(\'' + esc(e.view) + '\');return false;">' + inner + ' ▶</a>' : '<button style="cursor:default">' + inner + '</button>');
    }).join('') + '<button onclick="Timetable.edit()">📅</button>';
  }
  function closeMenus() { var p = document.getElementById('cb-pop'); if (p) p.remove(); }
  if (typeof document !== 'undefined') document.addEventListener('click', function (e) { if (!e.target.closest || (!e.target.closest('#cb-pop') && !e.target.closest('.cb-mn'))) closeMenus(); });

  function render(container) {
    ensureCss();
    var cls = S().getActiveClass(); viewCls = cls; loadAbsent(cls);
    var list = students(cls), present = list.filter(function (s) { return !absent[s.id]; }).length;
    var total = list.reduce(function (n, s) { return n + s.xp; }, 0);
    container.innerHTML = '<div class="cb" id="cb-root">' +
      '<div class="cb-hd"><div><h1>🌟 ' + esc(cls.name) + '</h1><small>' + new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' }) + '</small></div>' +
        '<div class="cb-tm"><div class="cb-clock" id="cb-clock"><b>' + fmt(timer.left) + '</b><small>Timer</small></div><div><b id="cb-here">' + present + '</b><small>Here today</small></div><div><b id="cb-total">' + total.toLocaleString() + '</b><small>Class XP</small></div></div></div>' +
      '<div class="cb-tabs">' + (S().getClasses ? S().getClasses() : []).filter(function (c) { return !c.archived; }).map(function (c) { return '<button class="' + (c.id === cls.id ? 'on' : '') + '" onclick="ClassBoard.switchClass(\'' + esc(c.id) + '\')">' + esc(c.name) + '</button>'; }).join('') + '</div>' +
      '<div class="cb-today"><span class="lab">📅 Today:</span>' + todayChips(cls) + '</div>' +
      '<div class="cb-goal" id="cb-goal" onclick="ClassBoard.setGoal()" title="Click to change the class goal"><b class="l"></b><div class="bar"><i style="width:0"></i></div><b class="r"></b></div>' +
      '<div class="cb-mg">' + list.map(function (s) {
        var plate = s.x && s.x.plate && s.x.plate.css ? ' style="' + esc(s.x.plate.css) + '"' : '';
        var animal = s.x && s.x.pack && s.x.pack.animal ? '<i class="cb-an" title="' + esc(s.x.pack.name) + '" style="background-image:url(bamboozle/memes/' + esc(s.x.pack.animal) + '_celebrate.webp)"></i>' : '';
        return '<div class="cb-st ' + (absent[s.id] ? 'off' : '') + (plate ? ' plated' : '') + '" id="cb-' + esc(s.id) + '" data-id="' + esc(s.id) + '"' + plate + '>' + animal +
          '<button class="cb-mn" title="More for this pupil" onclick="ClassBoard.menu(\'' + esc(s.id) + '\', event)">⋯</button>' +
          '<span class="cb-pt" id="cb-pt-' + esc(s.id) + '">' + s.xp.toLocaleString() + '</span>' +
          '<img src="' + esc(s.img) + '" alt="' + esc(s.name) + '" title="Click to mark here / absent" onclick="ClassBoard.toggleAbsent(\'' + esc(s.id) + '\')">' +
          '<b class="n">' + esc(s.name) + (absent[s.id] ? ' · away' : '') + '</b>' +
          (s.x && s.x.title ? '<span class="cb-ti">' + esc(s.x.title.icon + ' ' + s.x.title.name) + '</span>' : '') +
          '<div class="cb-add"><button onclick="ClassBoard.award(\'' + esc(s.id) + '\',1)">+1</button><button onclick="ClassBoard.award(\'' + esc(s.id) + '\',5)">+5</button><button onclick="ClassBoard.award(\'' + esc(s.id) + '\',10)">+10</button></div></div>';
      }).join('') + '</div>' +
      '<div class="cb-dock"><button class="p" id="cb-play" onclick="ClassBoard.play()">▶ Start</button>' +
        '<button onclick="ClassBoard.preset(60)">1 min</button><button onclick="ClassBoard.preset(180)">3 min</button><button onclick="ClassBoard.preset(300)">5 min</button><button onclick="ClassBoard.preset(600)">10 min</button><button onclick="ClassBoard.reset()">↺</button><span class="sep"></span>' +
        '<button onclick="ClassBoard.pick()">🎲 Pick a student</button><button onclick="ClassBoard.groups()">👥 Groups</button><button onclick="openFastAttendanceModal && openFastAttendanceModal()">✓ Roll call</button>' +
        '<button onclick="try{classSoundboard.playAttentionBell()}catch(e){}">🔔 Bell</button><button onclick="try{classSoundboard.playApplause()}catch(e){}">👏</button><span class="sep"></span>' +
        '<button onclick="ClassBoard.addStudent()">➕ Student</button><button onclick="switchView(\'store\')">🛍️ Store</button><button onclick="ClassBoard.full()">⛶ Full screen</button><button onclick="switchView(\'dashboard\')">✕ Exit</button></div></div>';
    paintGoal(); paintClock();
    // pull the newest goal from the cloud, then redraw the bar
    try { if (root.ClassroomStore && root.ClassroomStore.cloud) root.ClassroomStore.cloud.pull().then(function () { paintGoal(); }); } catch (e) { /* offline */ }
  }

  function totals() {
    var list = students(viewCls), t = list.reduce(function (n, s) { return n + s.xp; }, 0);
    var el = document.getElementById('cb-total'); if (el) el.textContent = t.toLocaleString();
    return list;
  }
  /** Play the victory sound this pupil bought (if any). Returns true when one played. */
  function pupilSound(id) {
    try {
      var e = root.ClassroomStore && root.ClassroomStore.cosmetics ? root.ClassroomStore.cosmetics.equipped(id) : {};
      if (e.sound && root.ClassroomCosmetics) return !!root.ClassroomCosmetics.playSound(e.sound.id);
    } catch (x) { /* optional */ }
    return false;
  }
  var api = {
    switchClass: function (id) { S().setActiveClass(id); stopTimer(); timer.left = timer.total; if (root.renderCurrentView) root.renderCurrentView(); },
    menu: function (id, ev) {
      if (ev) ev.stopPropagation();
      var old = document.getElementById('cb-pop'), same = old && old.dataset.id === id; closeMenus(); if (same) return;
      var st = S().getStudent ? S().getStudent(id) : null, name = st ? (st.firstName || st.name || '') : '';
      var items = [['profile', '👤 Profile'], ['history', '📜 XP history'], ['fix', '✏️ Correct XP'], ['skills', '🎯 Give XP for a skill'], ['monster', '🐾 Customize monster'], ['edit', '⚙️ Edit student']];
      var p = document.createElement('div'); p.id = 'cb-pop'; p.dataset.id = id;
      p.innerHTML = '<b>' + esc(name) + '</b>' + items.map(function (it) { return '<button data-a="' + it[0] + '">' + it[1] + '</button>'; }).join('');
      p.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) api.act(b.dataset.a, id); });
      document.body.appendChild(p);
      var r = ev && ev.currentTarget ? ev.currentTarget.getBoundingClientRect() : { left: innerWidth / 2, bottom: innerHeight / 2, top: innerHeight / 2 };
      var w = p.offsetWidth, hgt = p.offsetHeight, x = Math.min(Math.max(8, r.left - w + 40), innerWidth - w - 8), y = r.bottom + 6;
      if (y + hgt > innerHeight - 8) y = Math.max(8, r.top - hgt - 6);
      p.style.left = x + 'px'; p.style.top = y + 'px';
    },
    act: function (what, id) {
      closeMenus();
      try {
        if (what === 'profile' && root.openStudentDetail) root.openStudentDetail(id, 'overview');
        else if (what === 'history' && root.openStudentXPHistoryModal) root.openStudentXPHistoryModal(id);
        else if (what === 'fix' && root.openDirectXPEdit) root.openDirectXPEdit(id);
        else if (what === 'skills' && root.openGiveXPSkillsModal) root.openGiveXPSkillsModal('student', id);
        else if (what === 'monster' && root.openMonsterCreator) root.openMonsterCreator(id);
        else if (what === 'edit' && root.openStudentModal) root.openStudentModal(id);
      } catch (e) { if (root.showNotification) root.showNotification('Could not open that. Try the Command Center.', 'error'); }
    },
    addStudent: function () { if (root.openStudentModal) root.openStudentModal(); },
    groups: function () {
      var list = S().getStudentsByClass(viewCls.id).filter(function (s) { return !absent[s.id]; });
      if (!list.length) return;
      var n = parseInt(root.prompt('How many groups?', String(Math.max(2, Math.round(list.length / 4)))), 10);
      if (!n || n < 2) return; n = Math.min(n, list.length);
      var colors = ['#f97316', '#8b5cf6', '#06b6d4', '#22c55e', '#f43f5e', '#eab308', '#ec4899', '#14b8a6'], icons = ['🦊', '🦉', '🐻', '🐇', '🐸', '🐧', '🦁', '🐼'];
      function make() {
        var a = list.slice(), g = [], i, j, t;
        for (i = a.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; }
        for (i = 0; i < n; i++) g.push([]);
        a.forEach(function (s, k) { g[k % n].push(s.firstName || s.name); });
        return g;
      }
      function show() {
        var old = document.querySelector('.cb-grp'); if (old) old.remove();
        var g = make(), w = document.createElement('div'); w.className = 'cb-grp';
        w.innerHTML = '<div><h2>👥 ' + n + ' groups · ' + list.length + ' pupils here</h2><div class="cb-gg">' + g.map(function (m, k) { return '<div class="g" style="--c:' + colors[k % colors.length] + '"><b>' + icons[k % icons.length] + ' Group ' + (k + 1) + '</b>' + m.map(esc).join('<br>') + '</div>'; }).join('') + '</div><div class="row"><button class="g2" id="cb-gr">🔀 Shuffle again</button><button id="cb-gc">Done</button></div></div>';
        document.body.appendChild(w);
        w.querySelector('#cb-gr').onclick = show; w.querySelector('#cb-gc').onclick = function () { w.remove(); };
        w.addEventListener('mousedown', function (e) { if (e.target === w) w.remove(); });
        try { root.classSoundboard && root.classSoundboard.playCardFlip && root.classSoundboard.playCardFlip(); } catch (e) { /* optional */ }
      }
      show();
    },
    award: function (id, n) {
      var st = S(); if (!st.giveXP) return;
      st.giveXP(id, n, 'Quick Classroom Award', 'Teacher', { category: 'positive', icon: '⭐' });
      if (!pupilSound(id)) { try { root.classSoundboard && root.classSoundboard.playCoinReward && root.classSoundboard.playCoinReward(); } catch (e) { /* optional */ } }
      var list = totals(), me = list.filter(function (s) { return s.id === id; })[0];
      var card = document.getElementById('cb-' + id);
      if (me && card) {
        document.getElementById('cb-pt-' + id).textContent = me.xp.toLocaleString();
        var b = document.createElement('div'); b.className = 'cb-burst'; b.textContent = '+' + n + ' ⭐'; card.appendChild(b); setTimeout(function () { b.remove(); }, 1000);
        var img = card.querySelector('img'); if (img && me.img && img.getAttribute('src') !== me.img) img.src = me.img;   // monster may have evolved
      }
      paintGoal();
    },
    toggleAbsent: function (id) {
      if (absent[id]) delete absent[id]; else absent[id] = true;
      saveAbsent(viewCls);
      var c = document.getElementById('cb-' + id); if (c) {
        c.classList.toggle('off', !!absent[id]);
        var nm = c.querySelector('b.n'); nm.textContent = nm.textContent.replace(' · away', '') + (absent[id] ? ' · away' : '');
      }
      var here = document.getElementById('cb-here'); if (here) here.textContent = S().getStudentsByClass(viewCls.id).filter(function (s) { return !absent[s.id]; }).length;
    },
    play: function () {
      if (timer.running) { stopTimer(); paintClock(); return; }
      if (timer.left <= 0) timer.left = timer.total;
      timer.running = true; timer.h = setInterval(tick, 1000); paintClock();
    },
    preset: function (sec) { stopTimer(); timer.total = timer.left = sec; paintClock(); api.play(); },
    reset: function () { stopTimer(); timer.left = timer.total; paintClock(); },
    setGoal: function () {
      var g = loadGoal(viewCls);
      var label = root.prompt('What is the class reward?', g.label); if (label === null) return;
      var target = parseInt(root.prompt('How many class XP to earn it (starting now)?', g.target), 10);
      if (!target || target < 1) return;
      saveGoal(viewCls, { label: label.trim() || 'Reward', target: target, since: Date.now() }); paintGoal();
    },
    pick: function () {
      if (pickBusy) return;
      var cards = [].slice.call(document.querySelectorAll('.cb-st:not(.off)'));
      if (!cards.length) return;
      pickBusy = true; var n = 0, steps = 18 + Math.floor(Math.random() * 10), prev = null;
      (function step() {
        if (prev) prev.classList.remove('pick');
        var c = cards[Math.floor(Math.random() * cards.length)]; if (cards.length > 1 && c === prev) c = cards[(cards.indexOf(c) + 1) % cards.length];
        c.classList.add('pick'); prev = c; n++;
        try { root.classSoundboard && root.classSoundboard.playCardFlip && root.classSoundboard.playCardFlip(); } catch (e) { /* optional */ }
        if (n < steps) return setTimeout(step, 60 + n * 9);
        setTimeout(function () {
          c.classList.remove('pick'); pickBusy = false;
          var w = document.createElement('div'); w.className = 'cb-win';
          var ti = c.querySelector('.cb-ti'), pl = c.getAttribute('style') || '';
          w.innerHTML = '<div' + (pl ? ' style="' + esc(pl) + '"' : '') + '><img src="' + esc(c.querySelector('img').getAttribute('src')) + '" alt=""><h2>' + c.querySelector('b.n').textContent.replace(' · away', '') + '!</h2>' + (ti ? '<div class="cb-ti" style="font-size:1.2rem;margin:-4px auto 14px;display:inline-block;padding:3px 16px">' + ti.textContent + '</div><br>' : '') + '<button>Give +5 and close</button></div>';
          document.body.appendChild(w);
          if (!pupilSound(c.dataset.id)) { try { root.classSoundboard && root.classSoundboard.playFanfare && root.classSoundboard.playFanfare(); } catch (e) { /* optional */ } }
          w.querySelector('button').onclick = function () { api.award(c.dataset.id, 5); w.remove(); };
          w.addEventListener('mousedown', function (e) { if (e.target === w) w.remove(); });
        }, 250);
      })();
    },
    full: function () {
      var el = document.getElementById('cb-root'); if (!el) return;
      if (document.fullscreenElement) document.exitFullscreen(); else if (el.requestFullscreen) el.requestFullscreen();
    }
  };
  root.ClassBoard = api;
  root.renderClassBoardView = render;
})(typeof window !== 'undefined' ? window : this);
