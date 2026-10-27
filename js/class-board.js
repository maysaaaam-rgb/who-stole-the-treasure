/* Class Board: a full-screen projector view. Every monster with its points and quick +1/+5/+10,
   a big timer, a class goal bar, a random picker and an absent toggle. Adds the view "board". */
(function (root) {
  'use strict';
  function S() { return root.schoolStore || root.store; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var timer = { total: 300, left: 300, running: false, h: null };
  var absent = {};            // studentId -> true (this session only, does not touch the attendance records)
  var pickedHat = {};         // classId -> { studentId: true } (this session only, fair-pick hat)
  var pickBusy = false;

  function goalKey(cls) { return 'eaa_board_goal_' + cls.id; }
  function loadGoal(cls) {
    // The cloud copy (shared with the Classroom Store save) is the truth; this browser only keeps a fallback.
    try { var cg = root.ClassroomStore && root.ClassroomStore.getBoardGoal(cls.id); if (cg && cg.target) return cg; } catch (e) { /* use fallback */ }
    try { var g = JSON.parse(localStorage.getItem(goalKey(cls))); if (g && g.target) return g; } catch (e) { /* none saved */ }
    return { label: '10 coins for everyone!', target: 300, since: new Date().setHours(0, 0, 0, 0), daily: true, bonus: 10 };
  }
  // daily = the bar starts again every morning; bonus = coins every pupil here gets when the bar is full (default 10)
  function isDaily(g) { return g.daily !== false; }
  function bonusOf(g) { return g.bonus == null ? 10 : (Number(g.bonus) || 0); }
  function todayKey() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function isWon(g) { return isDaily(g) ? g.wonDay === todayKey() : !!g.reachedAt; }
  function isPaid(g) { return isDaily(g) ? g.paidDay === todayKey() : !!g.bonusPaid; }
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
      var prof = st.getMonsterProfile ? st.getMonsterProfile(s.id) : null, img = '', av = '';
      try { img = root.getStudentMonsterAvatarUrl ? root.getStudentMonsterAvatarUrl(s, prof, m) : ''; } catch (e) { img = ''; }
      try { av = (root.MilestoneCeremony && root.MilestoneCeremony.pictureOf) ? root.MilestoneCeremony.pictureOf(s) : (s.avatarUrl || ''); } catch (e) { av = s.avatarUrl || ''; }
      var x = {};
      try { x = (root.ClassroomStore && root.ClassroomStore.cosmetics) ? root.ClassroomStore.cosmetics.equipped(s.id) : {}; } catch (e) { x = {}; }
      return { id: s.id, name: s.firstName || s.name || 'Student', xp: Number(m.totalXP != null ? m.totalXP : s.xp) || 0, img: img, av: av, x: x };
    }).sort(function (a, b) { return b.xp - a.xp; });
  }
  function goalProgress(cls, g) {
    var ids = {}; S().getStudentsByClass(cls.id).forEach(function (s) { ids[s.id] = 1; });
    var sum = 0;
    (S().state.xpTransactions || []).forEach(function (t) {
      if (ids[t.studentId] && t.status !== 'voided' && t.status !== 'reverted') {
        var amt = Number(t.amount) || 0, ts = new Date(t.timestamp).getTime();
        var from = Math.max(isDaily(g) ? new Date().setHours(0, 0, 0, 0) : (g.since || 0), Number(g.resetAt) || 0);
        if (amt > 0 && ts >= from) sum += amt;
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
    '.cb-st{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.24);backdrop-filter:blur(8px);border-radius:24px;padding:10px 8px 12px;text-align:center;position:relative;transition:transform .18s,background .18s;animation:cbCardIn .28s cubic-bezier(.175,.885,.32,1.275) backwards;animation-delay:calc(var(--i,0) * 22ms)}' +
    '@keyframes cbCardIn{from{opacity:0;transform:translateY(10px) scale(.96)}}' +
    '.cb-st:hover{transform:translateY(-5px);background:rgba(255,255,255,.2)}' +
    '.cb-st img.cb-mon{width:100%;aspect-ratio:1;object-fit:contain;filter:drop-shadow(0 10px 8px rgba(0,0,0,.35));cursor:pointer;transition:transform .18s cubic-bezier(.175,.885,.32,1.275)}' +
    '.cb-st img.cb-mon.cb-bounce{animation:cbMonBounce .45s cubic-bezier(.175,.885,.32,1.275)}' +
    '@keyframes cbMonBounce{0%,100%{transform:translateY(0) scale(1)}40%{transform:translateY(-12px) scale(1.08)}75%{transform:translateY(2px) scale(.97)}}' +
    '.cb-st img.cb-av{position:absolute;right:8px;top:38px;width:44px;height:44px;border-radius:50%;object-fit:contain;background:#fff7d6;border:2.5px solid #f59e0b;box-shadow:0 4px 10px rgba(0,0,0,.4);z-index:3;cursor:pointer;transition:transform .15s}' +
    '.cb-st img.cb-av:hover{transform:scale(1.12)}' +
    '.cb-st b.n{display:block;font-weight:600;font-size:1.1rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.cb-pt{position:absolute;top:8px;right:8px;background:#fbbf24;color:#4a2300;border-radius:99px;padding:2px 11px;font-weight:600;font-size:.95rem;font-variant-numeric:tabular-nums}' +
    '.cb-add{display:flex;gap:6px;justify-content:center;margin-top:8px}.cb-add button{border:0;background:rgba(255,255,255,.2);color:#fff;border-radius:99px;padding:9px 14px;min-height:40px;font:600 .95rem Fredoka,sans-serif;cursor:pointer;border-bottom:3px solid rgba(0,0,0,.2)}' +
    '.cb-add button:hover{background:#22c55e}.cb-add button:active{transform:translateY(2px);border-bottom-width:1px}' +
    '.cb-ti{display:block;margin:3px auto 0;max-width:96%;font-size:.74rem;font-weight:600;background:rgba(251,191,36,.95);color:#4a2300;border-radius:99px;padding:1px 9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.cb-an{position:absolute;left:6px;top:42px;width:38px;height:38px;border-radius:50%;background:#fff center/contain no-repeat;border:2px solid rgba(255,255,255,.9);box-shadow:0 3px 8px rgba(0,0,0,.35)}' +
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
    '@keyframes cbFade{from{opacity:0}}.cb-win>div{text-align:center;background:linear-gradient(180deg,#5b34c8,#3b2399);border:2px solid rgba(255,255,255,.3);border-radius:34px;padding:34px 42px;max-width:94vw;box-shadow:0 30px 80px rgba(0,0,0,.6)}' +
    '.cb-win img{width:min(240px,42vw);filter:drop-shadow(0 16px 12px rgba(0,0,0,.4))}.cb-win img.cb-win-av{width:110px;height:110px;border-radius:50%;object-fit:contain;background:#fff7d6;border:4px solid #f59e0b;margin-right:12px}.cb-win h2{font-size:2.6rem;font-weight:600;margin:6px 0 14px}' +
    '.cb-win .cb-wbtns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:10px}' +
    '.cb-win button{border:0;border-radius:16px;background:#22c55e;color:#fff;font:700 1.15rem Fredoka,system-ui,sans-serif;min-height:56px;padding:12px 24px;cursor:pointer;border-bottom:5px solid #15803d;transition:transform .12s cubic-bezier(.175,.885,.32,1.275),border-bottom-width .12s}' +
    '.cb-win button:active{transform:translateY(4px);border-bottom-width:1px}' +
    '.cb-win button.b10{background:#f59e0b;color:#2b1700;border-bottom-color:#b45309}' +
    '.cb-win button.bnext{background:#38bdf8;color:#06101f;border-bottom-color:#0369a1}' +
    '.cb-win .cb-vs{display:flex;align-items:center;justify-content:center;gap:24px;flex-wrap:wrap;margin-bottom:12px}' +
    '.cb-win .cb-fighter{display:flex;flex-direction:column;align-items:center;min-width:180px}' +
    '.cb-win .cb-fighter.f1 img.cb-fmon{transform:scaleX(-1)}' +
    '.cb-win .cb-vs-tag{font-size:2.2rem;font-weight:800;color:#fbbf24;text-shadow:0 4px 12px rgba(0,0,0,.5)}' +
    '.cb-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 0;position:relative}.cb-tabs button{border:0;border-bottom:4px solid rgba(0,0,0,.28);background:rgba(255,255,255,.14);color:#fff;font:500 1rem Fredoka,sans-serif;padding:8px 18px;border-radius:14px;cursor:pointer}.cb-tabs button.on{background:#fbbf24;color:#4a2300;border-bottom-color:#b45309}.cb-tabs button:active{transform:translateY(3px);border-bottom-width:1px}' +
    '.cb-today{margin:12px 0 0;display:flex;gap:8px;flex-wrap:wrap;align-items:center;position:relative}.cb-today .lab{font-weight:600;opacity:.8;margin-right:4px}.cb-today a,.cb-today button{text-decoration:none;color:#fff;background:rgba(34,197,94,.3);border:1px solid #4ade80;border-bottom:4px solid #15803d;border-radius:14px;padding:7px 14px;font:500 .95rem Fredoka,sans-serif;cursor:pointer}.cb-today a em{font-style:normal;color:#fde68a;margin-right:4px}.cb-today button{background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.3);border-bottom-color:rgba(0,0,0,.28)}' +
    '.cb-st .cb-att{position:absolute;left:8px;top:8px;height:28px;padding:0 9px;border:0;border-bottom:3px solid rgba(0,0,0,.35);border-radius:99px;background:rgba(16,185,129,.88);color:#fff;font:700 .78rem/1 Fredoka,sans-serif;cursor:pointer;z-index:2;display:inline-flex;align-items:center;justify-content:center;transition:transform .12s cubic-bezier(.175,.885,.32,1.275)}' +
    '.cb-st .cb-att:active{transform:translateY(2px);border-bottom-width:1px}' +
    '.cb-st.off .cb-att{background:rgba(244,63,94,.9);color:#fff}' +
    '.cb-st .cb-mn{position:absolute;left:44px;top:8px;width:28px;height:28px;padding:0;border:0;border-radius:50%;background:rgba(0,0,0,.32);color:#fff;font:700 .95rem/1 Fredoka,sans-serif;letter-spacing:1px;cursor:pointer;z-index:2}.cb-st.off .cb-mn{left:64px}.cb-st .cb-mn:hover{background:rgba(0,0,0,.55)}' +
    '#cb-pop{position:fixed;z-index:99990;background:#1e1b4b;border:1px solid rgba(255,255,255,.25);border-radius:14px;padding:6px;display:flex;flex-direction:column;gap:2px;min-width:200px;box-shadow:0 18px 50px rgba(0,0,0,.6);font-family:Fredoka,system-ui,sans-serif}#cb-pop b{color:#fde68a;font-weight:600;padding:6px 10px 4px;font-size:.95rem}#cb-pop button{border:0;background:none;color:#fff;font:500 .95rem Fredoka,sans-serif;text-align:left;padding:9px 10px;border-radius:9px;cursor:pointer}#cb-pop button:hover{background:rgba(255,255,255,.14)}' +
    '.cb-grp{position:fixed;inset:0;z-index:99997;background:rgba(10,5,40,.82);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:18px;font-family:Fredoka,system-ui,sans-serif;color:#fff}.cb-grp>div{background:linear-gradient(180deg,#5b34c8,#3b2399);border:2px solid rgba(255,255,255,.3);border-radius:28px;padding:22px 26px;max-width:1100px;width:100%;max-height:90vh;overflow:auto;text-align:center}.cb-grp h2{margin:0 0 12px;font-weight:600}.cb-gg{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;text-align:left}.cb-gg div.g{background:rgba(255,255,255,.14);border-radius:18px;padding:12px 16px;border-top:6px solid var(--c)}.cb-gg b{display:block;font-weight:600;margin-bottom:4px;color:#fde68a}.cb-grp .row{display:flex;gap:10px;justify-content:center;margin-top:14px;flex-wrap:wrap}.cb-grp button{border:0;border-bottom:5px solid rgba(0,0,0,.35);border-radius:14px;background:#22c55e;color:#fff;font:600 1rem Fredoka,sans-serif;min-height:56px;padding:10px 20px;cursor:pointer;transition:transform .12s cubic-bezier(.175,.885,.32,1.275),border-bottom-width .12s}.cb-grp button:active{transform:translateY(4px);border-bottom-width:1px}.cb-grp button.g2{background:rgba(255,255,255,.2)}' +
    '.cb-gnums{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin:14px 0 18px}' +
    '.cb-gnums button.cb-gnum{min-width:78px;min-height:72px;font-size:1.85rem;font-weight:800;border-radius:20px;background:#38bdf8;color:#06101f;border-bottom:5px solid #0369a1}' +
    '.cb-gnums button.cb-gnum.on{background:#f59e0b;color:#2b1700;border-bottom-color:#b45309}' +
    '.cb-hat{font-size:.78rem;font-weight:700;color:#cbd5e1;padding:0 6px;white-space:nowrap;align-self:center}' +
    '.cb-dock{gap:6px;padding:6px 10px;border-radius:20px;flex-wrap:nowrap;max-width:96vw;overflow:visible}.cb-dock button{padding:7px 12px;font-size:.86rem;border-radius:12px;border-bottom-width:3px;white-space:nowrap}.cb-dock button.sm{padding:5px 8px}.cb-dock button.ic{padding:7px 9px;font-size:1rem}.cb-dock .sep{margin:2px 2px}' +
    '.cb-tm-pills{display:inline-flex;gap:3px;background:rgba(0,0,0,.18);padding:3px;border-radius:13px;align-items:center}' +
    '.cb-more-wrap{position:relative;display:inline-flex}' +
    '.cb-more-menu{position:absolute;right:0;bottom:calc(100% + 10px);background:#1e1b4b;border:1px solid rgba(255,255,255,.26);border-radius:18px;padding:8px;display:none;grid-template-columns:repeat(2,minmax(138px,1fr));gap:6px;box-shadow:0 20px 50px rgba(0,0,0,.6);z-index:80;transform-origin:bottom right;animation:cbPopUp .16s cubic-bezier(.16,1,.3,1)}' +
    '.cb-more-menu.open{display:grid}' +
    '@keyframes cbPopUp{from{opacity:0;transform:translateY(6px) scale(.95)}}' +
    '.cb-dock .cb-more-menu button{justify-content:flex-start;width:100%;background:rgba(255,255,255,.12)!important;color:#fff!important;border-bottom:3px solid rgba(0,0,0,.35)!important;font-size:.85rem!important;padding:8px 11px!important;border-radius:11px!important}' +
    '.cb-dock .cb-more-menu button:hover{background:rgba(255,255,255,.22)!important}' +
    '.cb-goal.won{background:linear-gradient(90deg,rgba(251,191,36,.45),rgba(244,63,94,.45));animation:cbPulse 1.6s infinite}' +
    '.cb-gm{position:fixed;inset:0;z-index:99996;background:rgba(10,5,40,.82);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px;font-family:Fredoka,system-ui,sans-serif;color:#fff}' +
    '.cb-gm>div{background:linear-gradient(180deg,#5b34c8,#3b2399);border:2px solid rgba(255,255,255,.3);border-radius:28px;padding:22px 26px;width:min(720px,96vw);max-height:92vh;overflow:auto;box-shadow:0 30px 80px rgba(0,0,0,.6)}' +
    '.cb-gm h2{margin:0 0 6px;font-weight:600;font-size:1.7rem}.cb-gm p{margin:4px 0 12px;opacity:.85}.cb-gm label{display:block;font-weight:600;margin:12px 0 6px}' +
    '.cb-gm .opts{display:flex;flex-wrap:wrap;gap:8px}.cb-gm .opts button{border:2px solid rgba(255,255,255,.25);border-bottom-width:4px;background:rgba(255,255,255,.1);color:#fff;border-radius:14px;padding:8px 13px;font:500 .95rem Fredoka,sans-serif;cursor:pointer}' +
    '.cb-gm .opts button.on{background:#fbbf24;color:#4a2300;border-color:#b45309}.cb-gm input{font:500 1rem Fredoka,sans-serif;padding:9px 12px;border-radius:12px;border:2px solid rgba(255,255,255,.3);background:rgba(0,0,0,.25);color:#fff;width:100%}' +
    '.cb-gm .row{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px;justify-content:flex-end}.cb-gm .row button{border:0;border-bottom:5px solid rgba(0,0,0,.3);border-radius:14px;background:#22c55e;color:#fff;font:600 1.05rem Fredoka,sans-serif;padding:10px 20px;cursor:pointer}.cb-gm .row button.g2{background:rgba(255,255,255,.18)}' +
    '.cb-gm .row button:active,.cb-gm .opts button:active{transform:translateY(3px);border-bottom-width:1px}' +
    '.cb-win2{text-align:center}.cb-win2 .big{font-size:5.5rem;line-height:1;animation:cbPulse 1.2s infinite}.cb-win2 h2{font-size:2.6rem!important;margin:10px 0}.cb-win2 .prize{display:inline-block;background:#fbbf24;color:#4a2300;font-weight:700;font-size:1.6rem;border-radius:18px;padding:10px 22px;margin:6px 0 10px}' +
    '.cb-win2 .todo{background:rgba(0,0,0,.25);border-radius:16px;padding:10px 14px;text-align:left;margin:10px 0;line-height:1.5}.cb-hist{font-size:.85rem;opacity:.8;margin-top:10px}' +
    '.cb-conf{position:fixed;inset:0;pointer-events:none;z-index:99997;overflow:hidden}.cb-conf i{position:absolute;top:-6vh;font-style:normal;animation:cbFall 2.6s linear forwards}@keyframes cbFall{to{transform:translateY(112vh) rotate(540deg)}}' +
    '@media(max-width:1100px){.cb-dock{gap:5px;padding:7px 8px;border-radius:18px}.cb-dock button{padding:7px 10px;font-size:.82rem;border-radius:12px}.cb-dock .sep{display:none}}' +
    '@media(max-width:640px){.cb{padding:14px 12px 120px}.cb-mg{grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px}.cb-hd h1{font-size:1.5rem}.cb-tm div{min-width:76px;padding:6px 10px}.cb-tm b{font-size:1.4rem}}';
  /* Discipline tools (minus points and flags): OFF by default in every new session. When they are ON the flags are visible to everybody who sees the board (also in Class Mode), so switch them off before you project the board if you do not want that. */
  var disc = false; try { disc = sessionStorage.getItem('cb_disc') === '1'; } catch (e) { disc = false; }
  function discOn() { return disc; }
  /* today's stage for a pupil (0 = none, 1-6) and the stage list from the Command Center */
  function flagOf(id) { var t = 0; try { t = root.CommandCenter && root.CommandCenter.ladderTop ? root.CommandCenter.ladderTop(id) : 0; } catch (e) { t = 0; } return t || 0; }
  function stages() { return (root.CommandCenter && root.CommandCenter.stages) || []; }
  function stageBadge(id) { var n = flagOf(id), x = stages()[n - 1]; if (!x) return ''; return '<span class="cb-fl" style="background:' + x.c + ';color:' + x.ink + '" title="Stage ' + n + ' of 6 today">' + n + '<small>' + esc(x.short) + '</small></span>'; }
  function stageStrip() { var L = stages(); if (!L.length) return ''; return '<div class="cb-stages"><b>Our stages</b>' + L.map(function (x) { return '<span style="background:' + x.c + ';color:' + x.ink + '"><i>' + x.s + '</i>' + x.icon + ' ' + esc(x.short) + '</span>'; }).join('<em>➜</em>') + '</div>'; }
  var EXTRA_CSS = '.cb-dsc{font:inherit;font-weight:800;border:0;border-bottom:4px solid rgba(0,0,0,.3);border-radius:12px;padding:6px 12px;cursor:pointer;background:rgba(255,255,255,.7);color:#334155;margin-left:8px}.cb-dsc.on{background:#fecaca;color:#7f1d1d}' +
    '.cb-dis{display:flex;gap:4px;margin-top:4px}.cb-dis button{flex:1;font:inherit;font-weight:800;font-size:.85rem;border:0;border-bottom:3px solid rgba(0,0,0,.3);border-radius:9px;padding:3px 0;cursor:pointer;background:#fecaca;color:#7f1d1d}.cb-dis button.fl{background:#e2e8f0;color:#0f172a}' +
    '.cb-fl{position:absolute;left:6px;top:6px;display:flex;align-items:center;gap:5px;font-weight:900;font-size:1.25rem;line-height:1;padding:4px 9px 4px 7px;border-radius:999px;box-shadow:0 0 0 3px #fff,0 3px 8px rgba(0,0,0,.35);pointer-events:none;z-index:3}.cb-fl small{font-size:.72rem;font-weight:800}' +
    '.cb-stages{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:0 0 14px;padding:8px 12px;border-radius:16px;background:rgba(15,23,42,.82);color:#fff;font-weight:800}.cb-stages b{margin-right:6px}.cb-stages span{display:inline-flex;align-items:center;gap:6px;padding:5px 11px 5px 5px;border-radius:999px;font-size:.9rem}.cb-stages span i{font-style:normal;background:rgba(255,255,255,.9);color:#0f172a;border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center}.cb-stages em{font-style:normal;opacity:.6}' +
    '.cb-flagm{position:fixed;z-index:9600;background:#0f172a;color:#fff;border-radius:14px;padding:8px;display:grid;gap:5px;min-width:300px;max-width:360px;max-height:calc(100vh - 16px);overflow:auto;box-shadow:0 8px 28px rgba(0,0,0,.5);font-family:inherit}.cb-flagm b{font-size:.9rem;padding:2px 6px}' +
    '.cb-flagm button{font:inherit;font-weight:700;text-align:left;border:0;border-radius:9px;padding:7px 10px;cursor:pointer;background:#1e293b;color:#fff}.cb-flagm button:hover{background:#334155}' +
    '.cb-toast{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#2f1519;color:#fecaca;border:1px solid #7f1d1d;border-radius:12px;padding:10px 16px;z-index:9700;display:flex;gap:12px;align-items:center;font-weight:700}.cb-toast button{background:#fecaca;color:#2f1519;border:0;border-radius:8px;padding:4px 10px;font-weight:800;cursor:pointer}';
  function ensureCss() {
    if (document.getElementById('cb-css')) return;
    var el = document.createElement('style'); el.id = 'cb-css'; el.textContent = CSS + EXTRA_CSS + (root.BoardScenes ? root.BoardScenes.css() : ''); document.head.appendChild(el);
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
    var bn = bonusOf(g), what = g.label + (bn && g.label.indexOf('coins') < 0 ? ' + ' + bn + ' coins each' : '');
    el.querySelector('.r').textContent = pct >= 100 ? '🎉 ' + what + ' unlocked! Tap to celebrate' : pct + '% · ' + what;
    el.querySelector('.l').textContent = '🎯 ' + (isDaily(g) ? 'Today\u2019s goal ' : 'Class goal ') + Math.min(got, g.target) + ' / ' + g.target + ' XP';
    el.classList.toggle('won', pct >= 100);
    if (pct >= 100 && !isWon(g)) {
      g.reachedAt = Date.now(); if (isDaily(g)) g.wonDay = todayKey();
      g.history = (g.history || []).concat([{ label: g.label, target: g.target, reachedAt: g.reachedAt }]).slice(-30);
      var n = bn && !isPaid(g) ? payBonus(g) : null;
      saveGoal(viewCls, g); celebrate(g, n);
    }
  }

  var PRIZES = [['🪙', '10 coins for everyone!'], ['🍕', 'Pizza party!'], ['🎬', '10-minute movie'], ['🎮', 'Game day'], ['🎧', 'Class DJ for 5 minutes'], ['⚽', 'Extra play time'], ['🎨', 'Drawing time'], ['🧁', 'Snack party'], ['🎟️', 'No-homework day']];
  function confettiBurst() {
    var w = document.createElement('div'), em = ['🎉', '⭐', '🍕', '🌟', '✨', '🎊', '🏆']; w.className = 'cb-conf';
    for (var k = 0; k < 60; k++) { var i = document.createElement('i'); i.textContent = em[k % em.length]; i.style.left = (Math.random() * 98) + '%'; i.style.fontSize = (2 + Math.random() * 2.6) + 'rem'; i.style.animationDelay = (Math.random() * 1.2) + 's'; w.appendChild(i); }
    document.body.appendChild(w); setTimeout(function () { w.remove(); }, 4200);
  }
  /** Give the bonus coins to every pupil who is here (not marked away). Returns how many got them. */
  function payBonus(g) {
    var bonus = bonusOf(g), n = 0; if (!bonus) return 0;
    S().getStudentsByClass(viewCls.id).filter(function (s) { return !absent[s.id]; }).forEach(function (s) {
      try { if (root.ClassroomStore && root.ClassroomStore.grant) { var r = root.ClassroomStore.grant(s.id, bonus, 'Class goal reached: ' + g.label); if (r && r.success) n++; } } catch (e) { /* skip */ }
    });
    if (isDaily(g)) g.paidDay = todayKey(); else g.bonusPaid = true;
    g.lastPaid = n;
    try { root.classSoundboard && root.classSoundboard.playCoinReward && root.classSoundboard.playCoinReward(); } catch (e) { /* optional */ }
    return n;
  }
  /** The big moment: the class reached its goal. */
  function celebrate(g, justPaid) {
    var old = document.querySelector('.cb-gm'); if (old) old.remove();
    var kids = S().getStudentsByClass(viewCls.id), here = kids.filter(function (s) { return !absent[s.id]; });
    var bonus = bonusOf(g), paid = isPaid(g);
    var m = document.createElement('div'); m.className = 'cb-gm';
    m.innerHTML = '<div class="cb-win2"><div class="big">🏆</div><h2>Class goal reached!</h2><div>' + esc(viewCls.name) + ' earned ' + g.target + ' XP together.</div>' +
      '<div class="prize">' + esc(g.label) + '</div>' +
      '<div class="todo"><b>What happens now:</b><br>' + esc(g.plan || (/coins/i.test(g.label) ? 'Everyone here gets the coins now. Spend them in the Classroom Store!' : 'Tell the class when the prize happens (for example: Friday, last 10 minutes). Everyone who helped is invited!')) + '</div>' +
      (bonus ? '<div class="todo">🪙 <b>+' + bonus + ' coins</b> for every pupil here today' + (paid ? ': <b>given to ' + (justPaid != null ? justPaid : (g.lastPaid || here.length)) + ' pupils ✓</b>' : ' (' + here.length + ' pupils).') + '</div>' : '') +
      (isDaily(g) ? '<div class="todo">🌅 Tomorrow the bar starts again from 0. Can we do it again?</div>' : '') +
      '<div class="row" style="justify-content:center">' + (bonus && !paid ? '<button id="cb-g-pay">🪙 Give +' + bonus + ' coins to everyone here</button>' : '') +
      '<button class="g2" id="cb-g-new">🎯 Set the next goal</button><button class="g2" id="cb-g-rst">↺ Reset the bar to 0</button><button class="g2" id="cb-g-close">Close</button></div>' +
      ((g.history || []).length > 1 ? '<div class="cb-hist">Goals reached so far: ' + g.history.map(function (x) { return esc(x.label); }).join(' · ') + '</div>' : '') + '</div>';
    document.body.appendChild(m);
    confettiBurst();
    try { var sb = root.classSoundboard; if (sb) { (sb.playFanfare || sb.playTaDa || function () {}).call(sb); setTimeout(function () { try { (sb.playApplause || function () {}).call(sb); } catch (e) { /* optional */ } }, 1400); } } catch (e) { /* sound optional */ }
    var pay = m.querySelector('#cb-g-pay');
    if (pay) pay.onclick = function () { var n = payBonus(g); saveGoal(viewCls, g); pay.disabled = true; pay.textContent = '✓ Gave +' + bonus + ' coins to ' + n + ' pupils'; };
    m.querySelector('#cb-g-new').onclick = function () { m.remove(); goalEditor(); };
    m.querySelector('#cb-g-close').onclick = function () { m.remove(); };
    m.querySelector('#cb-g-rst').onclick = function () { resetBar(); m.remove(); };
  }
  /** Start the bar again from 0 now. Coins already paid today are not paid twice. */
  function resetBar() {
    var cur = loadGoal(viewCls); cur.resetAt = Date.now(); delete cur.wonDay; delete cur.reachedAt;
    saveGoal(viewCls, cur); paintGoal();
  }
  /** Choose the prize, how much XP the class needs, and an optional coin bonus. */
  function goalEditor() {
    var g = loadGoal(viewCls), label = g.label, target = g.target, bonus = bonusOf(g), plan = g.plan || '', daily = isDaily(g);
    var old = document.querySelector('.cb-gm'); if (old) old.remove();
    var m = document.createElement('div'); m.className = 'cb-gm';
    function opt(list, cur, attr) { return list.map(function (x) { var v = Array.isArray(x) ? x[1] : x, t = Array.isArray(x) ? x[0] + ' ' + x[1] : x; return '<button type="button" data-' + attr + '="' + esc(v) + '" class="' + (String(v) === String(cur) ? 'on' : '') + '">' + esc(t) + '</button>'; }).join(''); }
    m.innerHTML = '<div><h2>🎯 Class goal for ' + esc(viewCls.name) + '</h2><p>Every point you give on the Class Board fills the bar. When it is full, the board celebrates and shows the prize.</p>' +
      '<label>1. The prize</label><div class="opts" id="cb-g-p">' + opt(PRIZES, label, 'p') + '</div><input id="cb-g-label" value="' + esc(label) + '" maxlength="40" style="margin-top:8px">' +
      '<label>2. Repeat</label><div class="opts" id="cb-g-d">' + opt([['🌅', 'Every day'], ['1️⃣', 'Only once']], daily ? 'Every day' : 'Only once', 'd') + '</div><div style="opacity:.75;font-size:.85rem;margin-top:4px">Every day: the bar starts again from 0 each morning.</div>' +
      '<label>3. How much XP the class needs</label><div class="opts" id="cb-g-t">' + opt([200, 300, 500, 800, 1000], target, 't') + '</div>' +
      '<label>4. Coins for every pupil here when the bar is full (given automatically)</label><div class="opts" id="cb-g-b">' + opt([0, 5, 10, 20], bonus, 'b') + '</div>' +
      '<label>5. When and how (shown on the celebration screen)</label><input id="cb-g-plan" maxlength="120" placeholder="For example: Friday, the last 10 minutes of the lesson" value="' + esc(plan) + '">' +
      '<div class="row"><button class="g2" id="cb-g-reset" style="margin-right:auto">↺ Reset the bar to 0</button><button class="g2" id="cb-g-x">Cancel</button><button id="cb-g-save">Start this goal</button></div></div>';
    document.body.appendChild(m);
    function pick(boxId, attr, fn) { m.querySelector(boxId).addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; [].forEach.call(this.children, function (x) { x.classList.remove('on'); }); b.classList.add('on'); fn(b.getAttribute('data-' + attr)); }); }
    pick('#cb-g-p', 'p', function (v) { m.querySelector('#cb-g-label').value = v; });
    pick('#cb-g-t', 't', function (v) { target = parseInt(v, 10); });
    pick('#cb-g-b', 'b', function (v) { bonus = parseInt(v, 10); });
    pick('#cb-g-d', 'd', function (v) { daily = v === 'Every day'; });
    m.querySelector('#cb-g-x').onclick = function () { m.remove(); };
    // Reset: the bar counts only XP given from now on. Coins already paid today are not paid twice.
    m.querySelector('#cb-g-reset').onclick = function () { resetBar(); m.remove(); };
    m.querySelector('#cb-g-save').onclick = function () {
      var lb = m.querySelector('#cb-g-label').value.trim() || 'Class reward';
      saveGoal(viewCls, { label: lb, target: target || 300, since: Date.now(), bonus: bonus || 0, daily: daily, plan: m.querySelector('#cb-g-plan').value.trim(), history: g.history || [], resetAt: g.resetAt, wonDay: daily && isWon(g) ? g.wonDay : undefined, paidDay: daily ? g.paidDay : undefined });
      m.remove(); paintGoal();
    };
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
  function closeMenus() { var p = document.getElementById('cb-pop'); if (p) p.remove(); var m = document.getElementById('cb-dock-more'); if (m) m.classList.remove('open'); }
  if (typeof document !== 'undefined') document.addEventListener('click', function (e) { if (!e.target.closest || (!e.target.closest('#cb-pop') && !e.target.closest('.cb-mn') && !e.target.closest('.cb-more-wrap'))) closeMenus(); });

  function hatFor(cls) {
    var id = (cls && cls.id) || 'default';
    if (!pickedHat[id]) pickedHat[id] = {};
    return pickedHat[id];
  }
  function paintHat() {
    var el = document.getElementById('cb-hat-info'); if (!el || !viewCls) return;
    var present = S().getStudentsByClass(viewCls.id).filter(function (s) { return !absent[s.id]; });
    var hat = hatFor(viewCls);
    var pickedCount = present.filter(function (s) { return !!hat[s.id]; }).length;
    el.textContent = pickedCount + ' of ' + present.length + ' picked';
  }

  function render(container) {
    ensureCss();
    var cls = S().getActiveClass(); viewCls = cls; loadAbsent(cls);
    var list = students(cls), present = list.filter(function (s) { return !absent[s.id]; }).length;
    var total = list.reduce(function (n, s) { return n + s.xp; }, 0);
    var BS = root.BoardScenes, sceneOn = !!BS && BS.viewMode() === 'scene', theme = BS ? BS.resolve(cls) : 'meadow';
    // Scene view: no ranking. Every pupil keeps a fixed place (A to Z), so nobody moves up or down when points are given.
    if (sceneOn) list = list.slice().sort(function (a, b) { return String(a.name).localeCompare(String(b.name), 'tr'); });
    try { document.body.setAttribute('data-cb-scene', sceneOn ? theme : ''); } catch (e) { /* ignore */ }
    var switcher = BS ? '<span class="cb-sw"><button class="' + (sceneOn ? 'on' : '') + '" onclick="ClassBoard.setView(\'scene\')">🏝️ Scene</button><button class="' + (sceneOn ? '' : 'on') + '" onclick="ClassBoard.setView(\'grid\')">📋 Grid</button>' + (sceneOn ? '<select title="Scene" onchange="ClassBoard.setScene(this.value)"><option value="auto"' + (BS.getPref() === 'auto' ? ' selected' : '') + '>🔄 Auto: ' + esc(BS.THEMES[BS.auto(cls)].name) + '</option>' + Object.keys(BS.THEMES).map(function (k) { return '<option value="' + k + '"' + (BS.getPref() === k ? ' selected' : '') + '>' + BS.THEMES[k].e + ' ' + esc(BS.THEMES[k].name) + '</option>'; }).join('') + '</select>' : '') + '</span>' : '';
    container.innerHTML = '<div class="cb' + (sceneOn ? ' scene-on scene-' + theme : '') + '" id="cb-root">' +
      '<div class="cb-hd"><div><h1>🌟 ' + esc(cls.name) + '</h1><small>' + new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + '</small></div>' +
        '' + switcher + '<button class="cb-dsc' + (discOn() ? ' on' : '') + '" onclick="ClassBoard.disc()" title="Minus points and flags. Flags are visible on the board while this is ON. Off at the start of every session.">🚩 Discipline: ' + (discOn() ? 'On' : 'Off') + '</button><div class="cb-tm"><div class="cb-clock" id="cb-clock"><b>' + fmt(timer.left) + '</b><small>Timer</small></div><div><b id="cb-here">' + present + '</b><small>Here today</small></div><div><b id="cb-total">' + total.toLocaleString('en-US') + '</b><small>Class XP</small></div></div></div>' +
      '<div class="cb-tabs">' + (S().getClasses ? S().getClasses() : []).filter(function (c) { return !c.archived; }).map(function (c) { return '<button class="' + (c.id === cls.id ? 'on' : '') + '" onclick="ClassBoard.switchClass(\'' + esc(c.id) + '\')">' + esc(c.name) + '</button>'; }).join('') + '</div>' +
      '<div class="cb-today"><span class="lab">📅 Today:</span>' + todayChips(cls) + '</div>' +
      '<div class="cb-goal" id="cb-goal" onclick="ClassBoard.setGoal()" title="Click to change the class goal"><b class="l"></b><div class="bar"><i style="width:0"></i></div><b class="r"></b></div>' +
      (discOn() ? stageStrip() : '') + '<div class="cb-mg' + (sceneOn ? ' scene' : '') + '">' + list.map(function (s, idx) {
        var plateCss = !sceneOn && s.x && s.x.plate && s.x.plate.css ? s.x.plate.css : '';
        var stStyle = ' style="--i:' + Math.min(idx, 12) + (plateCss ? ';' + esc(plateCss) : '') + '"';
        var animal = !sceneOn && s.x && s.x.pack && s.x.pack.animal ? '<i class="cb-an" title="' + esc(s.x.pack.name) + '" style="background-image:url(bamboozle/memes/' + esc(s.x.pack.animal) + '_celebrate.webp)"></i>' : '';
        var avBadge = false && s.av ? '<img class="cb-av" src="' + esc(s.av) + '" alt="" title="Click to switch pose" onclick="event.stopPropagation();if(window.MilestoneCeremony){MilestoneCeremony.setAvatar(\'' + esc(s.id) + '\',event);if(window.renderCurrentView)renderCurrentView();}">' : '';
        return '<div class="cb-st ' + (absent[s.id] ? 'off' : '') + (plateCss ? ' plated' : '') + '" id="cb-' + esc(s.id) + '" data-id="' + esc(s.id) + '"' + stStyle + '>' + animal + avBadge + (discOn() ? stageBadge(s.id) : '') +
          '<button type="button" class="cb-att" title="Tap to mark here or away" onclick="ClassBoard.toggleAbsent(\'' + esc(s.id) + '\')">' + (absent[s.id] ? 'Away' : '✓') + '</button>' +
          '<button class="cb-mn" title="More for this pupil" onclick="ClassBoard.menu(\'' + esc(s.id) + '\', event)">⋯</button>' +
          '<span class="cb-pt" id="cb-pt-' + esc(s.id) + '">' + s.xp.toLocaleString('en-US') + '</span>' +
          (sceneOn ? '<div class="cb-pw"><i class="cb-ped"></i>' : '') + '<img class="cb-mon" src="' + esc(s.img) + '" alt="' + esc(s.name) + '" title="Tap monster" onclick="ClassBoard.tapMonster(\'' + esc(s.id) + '\', this)">' + (sceneOn ? '</div>' : '') +
          '<b class="n">' + esc(s.name) + (absent[s.id] ? ' · away' : '') + '</b>' +
          (s.x && s.x.title ? '<span class="cb-ti">' + esc(s.x.title.icon + ' ' + s.x.title.name) + '</span>' : '') +
          '<div class="cb-add"><button onclick="ClassBoard.award(\'' + esc(s.id) + '\',10)">+10</button></div>' +
          (discOn() ? '<div class="cb-dis"><button onclick="ClassBoard.minus(\'' + esc(s.id) + '\',10)" title="Take 10 XP away (Undo is offered)">−10</button><button class="fl" onclick="ClassBoard.flag(\'' + esc(s.id) + '\', event)" title="Move this pupil up one stage (1 to 6)">🪜 Stage' + (flagOf(s.id) ? ' ' + flagOf(s.id) : '') + '</button></div>' : '') + '</div>';
      }).join('') + '</div>' +
      '<div class="cb-dock"><button class="p" id="cb-play" onclick="ClassBoard.play()" title="Start or pause the timer">▶ Start</button>' +
        '<span class="cb-tm-pills"><button class="sm" onclick="ClassBoard.preset(60)" title="1 minute">1m</button><button class="sm" onclick="ClassBoard.preset(180)" title="3 minutes">3m</button><button class="sm" onclick="ClassBoard.preset(300)" title="5 minutes">5m</button><button class="sm" onclick="ClassBoard.preset(600)" title="10 minutes">10m</button><button class="sm" onclick="ClassBoard.reset()" title="Reset the timer">↺</button></span><span class="sep"></span>' +
        '<button onclick="ClassBoard.pick()" title="Pick a student (no repeats until everyone is picked)">🎲 Pick</button>' +
        '<button onclick="ClassBoard.pick2()" title="Pick 2 students head-to-head">⚔️ Pick 2</button>' +
        '<span class="cb-hat" id="cb-hat-info">0 of ' + present + ' picked</span><span class="sep"></span>' +
        '<button onclick="if(window.openGameMaker)openGameMaker();else location.href=\'game-maker/index.html\';" title="Open Game Maker with this class" style="background:linear-gradient(180deg,#ec4899,#db2777);border-bottom-color:#9d174d;font-weight:700">🎮 Game Maker</button>' +
        '<button onclick="if(window.SleepyMonster&&SleepyMonster.open)SleepyMonster.open();else if(window.openSleepyMonster)openSleepyMonster();" title="Sleepy Mio classroom quiet game">😴 Sleepy Mio</button>' +
        '<button onclick="BathroomPass && BathroomPass.open()" title="Bathroom: sign out and back in">🚻 Bathroom</button>' +
        '<button onclick="ClassBoard.karaoke()" title="Karaoke Stage: pupils read one by one">🎤 Karaoke</button>' +
        '<button onclick="openFastAttendanceModal && openFastAttendanceModal()" title="Roll call">✓ Roll call</button>' +
        '<button class="ic" onclick="try{classSoundboard.playAttentionBell()}catch(e){}" title="Bell">🔔</button><button class="ic" onclick="try{classSoundboard.playApplause()}catch(e){}" title="Applause">👏</button><span class="sep"></span>' +
        '<div class="cb-more-wrap"><button type="button" class="cb-more-btn" onclick="var m=document.getElementById(\'cb-dock-more\');if(m)m.classList.toggle(\'open\')" title="More classroom tools">🧰 Tools ▾</button>' +
        '<div class="cb-more-menu" id="cb-dock-more">' +
          '<button onclick="ClassBoard.groups()" title="Make groups">👥 Groups</button>' +
          '<button onclick="VoiceFX.toggle()" title="Voice Changer">🎙️ Voice FX</button>' +
          '<button onclick="ClassBoard.resetHat()" title="Reset the fair-pick hat">↺ Reset hat</button>' +
          '<button onclick="ClassBoard.addStudent()" title="Add a student">➕ Add pupil</button>' +
          '<button onclick="switchView(\'store\')" title="Classroom Store">🛍️ Store</button>' +
          '<button onclick="ClassBoard.full()" title="Full screen">⛶ Full screen</button>' +
          '<button onclick="switchView(\'command\')" title="Exit the board" style="grid-column:1/-1">✕ Exit Class Board</button>' +
        '</div></div></div></div>';
    paintGoal(); paintClock(); paintHat();
    // pull the newest goal from the cloud, then redraw the bar
    try { if (root.ClassroomStore && root.ClassroomStore.cloud) root.ClassroomStore.cloud.pull().then(function () { paintGoal(); }); } catch (e) { /* offline */ }
  }

  function totals() {
    var list = students(viewCls), t = list.reduce(function (n, s) { return n + s.xp; }, 0);
    var el = document.getElementById('cb-total'); if (el) el.textContent = t.toLocaleString('en-US');
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
    /** Open the Karaoke Stage with this class: the same names and monsters as the board, away pupils already marked. */
    karaoke: function () {
      var cls = viewCls || S().getActiveClass(); if (!cls) return;
      var list = students(cls).slice().sort(function (a, b) { return String(a.name).localeCompare(String(b.name), 'tr'); });
      var data = { cls: cls.id, label: cls.name, grade: cls.grade || '', kids: list.map(function (s) { return { id: s.id, name: s.name, img: s.img }; }), away: absent, at: Date.now() };
      try { sessionStorage.setItem('eaa_karaoke_roster', JSON.stringify(data)); }
      catch (e) { data.kids.forEach(function (k) { k.img = ''; }); try { sessionStorage.setItem('eaa_karaoke_roster', JSON.stringify(data)); } catch (e2) { /* the page reads the class list itself */ } }
      location.href = 'karaoke-stage/index.html?cls=' + encodeURIComponent(cls.id);
    },
    setView: function (v) { if (root.BoardScenes) root.BoardScenes.setViewMode(v); if (root.renderCurrentView) root.renderCurrentView(); },
    setScene: function (v) { if (root.BoardScenes) root.BoardScenes.setPref(v); if (root.renderCurrentView) root.renderCurrentView(); },
    switchClass: function (id) { S().setActiveClass(id); stopTimer(); timer.left = timer.total; if (root.renderCurrentView) root.renderCurrentView(); },
    menu: function (id, ev) {
      if (ev) ev.stopPropagation();
      var old = document.getElementById('cb-pop'), same = old && old.dataset.id === id; closeMenus(); if (same) return;
      var st = S().getStudent ? S().getStudent(id) : null, name = st ? (st.firstName || st.name || '') : '';
      var items = [['profile', '👤 Profile'], ['history', '📜 XP history'], ['fix', '✏️ Correct XP'], ['skills', '🎯 Give XP for a skill'], ['monster', '🐾 Customize monster'], ['edit', '⚙️ Edit student'], ['birthday', '🎂 Birthday today']];
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
        else if (what === 'birthday' && root.Birthday) { root.Birthday.setToday(id); root.Birthday.celebrate(id); }
      } catch (e) { if (root.showNotification) root.showNotification('Could not open that. Try the Command Center.', 'error'); }
    },
    addStudent: function () { if (root.openStudentModal) root.openStudentModal(); },
    groups: function (chosenN) {
      var list = S().getStudentsByClass(viewCls.id).filter(function (s) { return !absent[s.id]; });
      if (!list.length) return;
      var colors = ['#f97316', '#8b5cf6', '#06b6d4', '#22c55e', '#f43f5e', '#eab308', '#ec4899', '#14b8a6'], icons = ['🦊', '🦉', '🐻', '🐇', '🐸', '🐧', '🦁', '🐼'];
      var n = chosenN ? Math.min(Math.max(2, parseInt(chosenN, 10) || 2), Math.max(2, list.length)) : null;
      function make(cnt) {
        var a = list.slice(), g = [], i, j, t;
        for (i = a.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; }
        for (i = 0; i < cnt; i++) g.push([]);
        a.forEach(function (s, k) { g[k % cnt].push(s.firstName || s.name); });
        return g;
      }
      function show(cnt) {
        n = cnt;
        var old = document.querySelector('.cb-grp'); if (old) old.remove();
        var w = document.createElement('div'); w.className = 'cb-grp';
        var numBtns = '<div class="cb-gnums">' + [2, 3, 4, 5, 6].map(function (num) {
          return '<button type="button" class="cb-gnum' + (n === num ? ' on' : '') + '" data-gn="' + num + '">' + num + '</button>';
        }).join('') + '</div>';
        if (!n) {
          w.innerHTML = '<div><h2>👥 How many groups?</h2><p style="margin:0 0 8px;opacity:.85">' + list.length + ' pupils here today — tap a number:</p>' + numBtns + '<div class="row"><button class="g2" id="cb-gc">Cancel</button></div></div>';
        } else {
          var g = make(Math.min(n, list.length));
          w.innerHTML = '<div><h2>👥 ' + n + ' groups · ' + list.length + ' pupils here</h2>' + numBtns + '<div class="cb-gg">' + g.map(function (m, k) { return '<div class="g" style="--c:' + colors[k % colors.length] + '"><b>' + icons[k % icons.length] + ' Group ' + (k + 1) + '</b>' + m.map(esc).join('<br>') + '</div>'; }).join('') + '</div><div class="row"><button class="g2" id="cb-gr">🔀 Shuffle again</button><button id="cb-gc">Done</button></div></div>';
        }
        document.body.appendChild(w);
        [].forEach.call(w.querySelectorAll('.cb-gnum'), function (b) {
          b.onclick = function () { show(parseInt(b.getAttribute('data-gn'), 10)); };
        });
        var gr = w.querySelector('#cb-gr'); if (gr) gr.onclick = function () { show(n); };
        w.querySelector('#cb-gc').onclick = function () { w.remove(); };
        w.addEventListener('mousedown', function (e) { if (e.target === w) w.remove(); });
        if (n) { try { root.classSoundboard && root.classSoundboard.playCardFlip && root.classSoundboard.playCardFlip(); } catch (e) { /* optional */ } }
      }
      show(n);
    },
    disc: function () { disc = !discOn(); try { sessionStorage.setItem('cb_disc', disc ? '1' : '0'); } catch (e) { /* ignore */ } if (root.renderCurrentView) root.renderCurrentView(); },
    minus: function (id, n) {
      var st = S(); if (!st.giveXP || !discOn()) return;
      var pupil = st.getStudent && st.getStudent(id), res = st.giveXP(id, -n, 'Needs work (class board)', 'Teacher', { category: 'needs_work', icon: '⚠️' });
      var txId = res && (res.transaction && res.transaction.id || res.id);
      function paint() { var me = totals().filter(function (x) { return x.id === id; })[0], el = document.getElementById('cb-pt-' + id); if (me && el) el.textContent = me.xp.toLocaleString('en-US'); paintGoal(); }
      paint();
      var old = document.querySelector('.cb-toast'); if (old) old.remove();
      var t = document.createElement('div'); t.className = 'cb-toast'; t.innerHTML = '<span>⚠️ ' + esc(pupil && (pupil.firstName || pupil.name) || '') + ': −' + n + ' XP</span><button>Undo</button>';
      t.querySelector('button').onclick = function () { if (txId && st.voidXPTransaction) st.voidXPTransaction(txId, 'Undone right away'); t.remove(); paint(); };
      document.body.appendChild(t); setTimeout(function () { t.remove(); }, 7000);
    },
    flag: function (id, ev) {
      var CC = root.CommandCenter; if (!CC || !CC.ladderPut || !discOn()) return;
      var old = document.querySelector('.cb-flagm'); if (old) old.remove();
      var m = document.createElement('div'); m.className = 'cb-flagm';
      var pupil = S().getStudent && S().getStudent(id);
      var top = flagOf(id), L = stages(), nx = L[top];
      m.innerHTML = '<b>🪜 ' + esc(pupil && (pupil.firstName || pupil.name) || '') + ': ' + (top ? 'stage ' + top + ' of 6 today' : 'no stage today') + '</b>' +
        (nx ? '<button data-s="' + nx.s + '" style="background:' + nx.c + ';color:' + nx.ink + ';font-size:1rem">➜ Next: ' + nx.s + ' · ' + nx.icon + ' ' + esc(nx.short) + '</button>' : '') +
        L.map(function (x) { return '<button data-s="' + x.s + '"' + (top >= x.s ? ' style="opacity:.5"' : '') + '><span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:' + x.c + ';color:' + x.ink + ';text-align:center;line-height:20px;margin-right:6px;font-size:.8rem">' + x.s + '</span>' + x.icon + ' ' + esc(x.t) + (top >= x.s ? ' ✓' : '') + '</button>'; }).join('') +
        '<button data-u="1">↩ Undo the last stage today</button><button data-x="1">Close</button>';
      var r = ev && ev.target && ev.target.getBoundingClientRect ? ev.target.getBoundingClientRect() : { left: 200, top: 200 };
      m.style.left = Math.max(8, Math.min(r.left, window.innerWidth - 370)) + 'px'; m.style.top = Math.max(8, Math.min(r.top - 330, window.innerHeight - 500)) + 'px';
      m.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.dataset.s) CC.ladderPut(id, Number(b.dataset.s)); else if (b.dataset.u) CC.ladderUndo(id);
        m.remove(); if (!b.dataset.x && root.renderCurrentView) root.renderCurrentView();
      });
      document.body.appendChild(m);
      setTimeout(function () { document.addEventListener('mousedown', function h(e) { if (!m.contains(e.target)) { m.remove(); document.removeEventListener('mousedown', h); } }); }, 50);
    },
    award: function (id, n) {
      var st = S(); if (!st.giveXP) return;
      st.giveXP(id, n, 'Quick Classroom Award', 'Teacher', { category: 'positive', icon: '⭐' });
      if (!pupilSound(id)) { try { root.classSoundboard && root.classSoundboard.playCoinReward && root.classSoundboard.playCoinReward(); } catch (e) { /* optional */ } }
      var list = totals(), me = list.filter(function (s) { return s.id === id; })[0];
      var card = document.getElementById('cb-' + id);
      if (me && card) {
        document.getElementById('cb-pt-' + id).textContent = me.xp.toLocaleString('en-US');
        var b = document.createElement('div'); b.className = 'cb-burst'; b.textContent = '+' + n + ' ⭐'; card.appendChild(b); setTimeout(function () { b.remove(); }, 1000);
        var img = card.querySelector('img.cb-mon') || card.querySelector('img'); if (img && me.img && img.getAttribute('src') !== me.img) img.src = me.img;   // monster may have evolved
      }
      paintGoal();
    },
    tapMonster: function (id, imgEl) {
      if (imgEl) {
        imgEl.classList.remove('cb-bounce');
        void imgEl.offsetWidth;
        imgEl.classList.add('cb-bounce');
      }
      if (!pupilSound(id)) {
        try {
          if (root.classSoundboard && root.classSoundboard.playQuietChime) root.classSoundboard.playQuietChime();
          else if (root.classSoundboard && root.classSoundboard.playCardFlip) root.classSoundboard.playCardFlip();
        } catch (e) { /* optional */ }
      }
    },
    toggleAbsent: function (id) {
      if (absent[id]) delete absent[id]; else absent[id] = true;
      saveAbsent(viewCls);
      var c = document.getElementById('cb-' + id); if (c) {
        c.classList.toggle('off', !!absent[id]);
        var attBtn = c.querySelector('.cb-att'); if (attBtn) attBtn.textContent = absent[id] ? 'Away' : '✓';
        var nm = c.querySelector('b.n'); nm.textContent = nm.textContent.replace(' · away', '') + (absent[id] ? ' · away' : '');
      }
      var here = document.getElementById('cb-here'); if (here) here.textContent = S().getStudentsByClass(viewCls.id).filter(function (s) { return !absent[s.id]; }).length;
      paintHat();
    },
    resetHat: function () {
      if (viewCls) pickedHat[viewCls.id] = {};
      paintHat();
      try { root.classSoundboard && root.classSoundboard.playCardFlip && root.classSoundboard.playCardFlip(); } catch (e) { /* optional */ }
    },
    play: function () {
      if (timer.running) { stopTimer(); paintClock(); return; }
      if (timer.left <= 0) timer.left = timer.total;
      timer.running = true; timer.h = setInterval(tick, 1000); paintClock();
    },
    preset: function (sec) { stopTimer(); timer.total = timer.left = sec; paintClock(); api.play(); },
    reset: function () { stopTimer(); timer.left = timer.total; paintClock(); },
    setGoal: function () { var g = loadGoal(viewCls); if (isWon(g)) celebrate(g); else goalEditor(); },
    newGoal: function () { goalEditor(); },
    pick: function () {
      if (pickBusy) return;
      var oldW = document.querySelector('.cb-win'); if (oldW) oldW.remove();
      var cards = [].slice.call(document.querySelectorAll('.cb-st:not(.off)'));
      if (!cards.length) return;
      var hat = hatFor(viewCls);
      var pool = cards.filter(function (c) { return !hat[c.dataset.id]; });
      if (!pool.length) {
        pickedHat[viewCls.id] = {};
        hat = hatFor(viewCls);
        pool = cards.slice();
      }
      var winner = pool[Math.floor(Math.random() * pool.length)];
      hat[winner.dataset.id] = true;
      paintHat();
      pickBusy = true; var n = 0, steps = 14 + Math.floor(Math.random() * 6), prev = null;
      (function step() {
        if (prev) prev.classList.remove('pick');
        var c = (n + 1 >= steps) ? winner : cards[Math.floor(Math.random() * cards.length)];
        if (n + 1 < steps && cards.length > 1 && c === prev) c = cards[(cards.indexOf(c) + 1) % cards.length];
        c.classList.add('pick'); prev = c; n++;
        try { root.classSoundboard && root.classSoundboard.playCardFlip && root.classSoundboard.playCardFlip(); } catch (e) { /* optional */ }
        if (n < steps) return setTimeout(step, 55 + n * 8);
        setTimeout(function () {
          winner.classList.remove('pick'); pickBusy = false;
          var w = document.createElement('div'); w.className = 'cb-win';
          var ti = winner.querySelector('.cb-ti'), pl = winner.getAttribute('style') || '', avEl = winner.querySelector('img.cb-av'), monEl = winner.querySelector('img.cb-mon') || winner.querySelector('img');
          var winId = winner.dataset.id;
          w.innerHTML = '<div' + (pl ? ' style="' + esc(pl) + '"' : '') + '>' +
            (avEl ? '<img class="cb-win-av" src="' + esc(avEl.getAttribute('src')) + '" alt="">' : '') +
            '<img src="' + esc(monEl.getAttribute('src')) + '" alt="">' +
            '<h2>' + esc(winner.querySelector('b.n').textContent.replace(' · away', '')) + '!</h2>' +
            (ti ? '<div class="cb-ti" style="font-size:1.2rem;margin:-4px auto 14px;display:inline-block;padding:3px 16px">' + esc(ti.textContent) + '</div><br>' : '') +
            '<div class="cb-wbtns">' +
              '<button type="button" id="cb-w-5">⭐ +5</button>' +
              '<button type="button" class="b10" id="cb-w-10">🌟 +10</button>' +
              '<button type="button" class="bnext" id="cb-w-next">🔄 Pick another</button>' +
            '</div></div>';
          document.body.appendChild(w);
          if (!pupilSound(winId)) { try { root.classSoundboard && root.classSoundboard.playFanfare && root.classSoundboard.playFanfare(); } catch (e) { /* optional */ } }
          w.querySelector('#cb-w-5').onclick = function () { api.award(winId, 5); w.remove(); };
          w.querySelector('#cb-w-10').onclick = function () { api.award(winId, 10); w.remove(); };
          w.querySelector('#cb-w-next').onclick = function () { w.remove(); api.pick(); };
          w.addEventListener('mousedown', function (e) { if (e.target === w) w.remove(); });
        }, 220);
      })();
    },
    pick2: function () {
      if (pickBusy) return;
      var oldW = document.querySelector('.cb-win'); if (oldW) oldW.remove();
      var cards = [].slice.call(document.querySelectorAll('.cb-st:not(.off)'));
      if (cards.length < 2) { if (cards.length === 1) api.pick(); return; }
      var hat = hatFor(viewCls);
      var pool = cards.filter(function (c) { return !hat[c.dataset.id]; });
      if (!pool.length) {
        pickedHat[viewCls.id] = {};
        hat = hatFor(viewCls);
        pool = cards.slice();
      }
      var first = pool[Math.floor(Math.random() * pool.length)];
      hat[first.dataset.id] = true;
      var pool2 = cards.filter(function (c) { return c !== first && !hat[c.dataset.id]; });
      if (!pool2.length) {
        pickedHat[viewCls.id] = {};
        hat = hatFor(viewCls);
        hat[first.dataset.id] = true;
        pool2 = cards.filter(function (c) { return c !== first; });
      }
      var second = pool2[Math.floor(Math.random() * pool2.length)];
      hat[second.dataset.id] = true;
      paintHat();
      pickBusy = true; var n = 0, steps = 12, prev1 = null, prev2 = null;
      (function step() {
        if (prev1) prev1.classList.remove('pick');
        if (prev2) prev2.classList.remove('pick');
        var c1 = (n + 1 >= steps) ? first : cards[Math.floor(Math.random() * cards.length)];
        var c2 = (n + 1 >= steps) ? second : cards[(cards.indexOf(c1) + 1 + Math.floor(Math.random() * (cards.length - 1))) % cards.length];
        c1.classList.add('pick'); c2.classList.add('pick'); prev1 = c1; prev2 = c2; n++;
        try { root.classSoundboard && root.classSoundboard.playCardFlip && root.classSoundboard.playCardFlip(); } catch (e) { /* optional */ }
        if (n < steps) return setTimeout(step, 60 + n * 8);
        setTimeout(function () {
          first.classList.remove('pick'); second.classList.remove('pick'); pickBusy = false;
          var w = document.createElement('div'); w.className = 'cb-win';
          var m1 = (first.querySelector('img.cb-mon') || first.querySelector('img')).getAttribute('src');
          var m2 = (second.querySelector('img.cb-mon') || second.querySelector('img')).getAttribute('src');
          var n1 = first.querySelector('b.n').textContent.replace(' · away', '');
          var n2 = second.querySelector('b.n').textContent.replace(' · away', '');
          var id1 = first.dataset.id, id2 = second.dataset.id;
          w.innerHTML = '<div>' +
            '<div class="cb-vs">' +
              '<div class="cb-fighter f1"><img class="cb-fmon" src="' + esc(m1) + '" alt=""><h2>' + esc(n1) + '</h2></div>' +
              '<div class="cb-vs-tag">⚔️ VS ⚔️</div>' +
              '<div class="cb-fighter f2"><img class="cb-fmon" src="' + esc(m2) + '" alt=""><h2>' + esc(n2) + '</h2></div>' +
            '</div>' +
            '<div class="cb-wbtns">' +
              '<button type="button" id="cb-w2-5">⭐ Award both +5</button>' +
              '<button type="button" class="b10" id="cb-w2-10">🌟 Award both +10</button>' +
              '<button type="button" class="bnext" id="cb-w2-next">🔄 Pick 2 more</button>' +
            '</div></div>';
          document.body.appendChild(w);
          try { root.classSoundboard && root.classSoundboard.playFanfare && root.classSoundboard.playFanfare(); } catch (e) { /* optional */ }
          w.querySelector('#cb-w2-5').onclick = function () { api.award(id1, 5); api.award(id2, 5); w.remove(); };
          w.querySelector('#cb-w2-10').onclick = function () { api.award(id1, 10); api.award(id2, 10); w.remove(); };
          w.querySelector('#cb-w2-next').onclick = function () { w.remove(); api.pick2(); };
          w.addEventListener('mousedown', function (e) { if (e.target === w) w.remove(); });
        }, 220);
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
