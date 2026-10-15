/* Pupil trading card (Yu-Gi-Oh style). The frame comes from the MONSTER LEVEL (Common / Rare / Epic / Legendary); the numbers come from the pupil's real work:
   four skill stars (speaking, reading, writing, listening), and four effort numbers (XP, streak, homework, teamwork).
   Quiz scores are NEVER printed on the card: only "Best at ..." (the strongest part) is shown. Skill stars never go below 1, so no pupil gets a "failing" card.
   The monster picture is the platform's real monster artwork (no hand-drawn characters). Opens on the student page, from the teacher profile, and as a printable class sheet. */
(function (root) {
  'use strict';
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function S() { return root.schoolStore; }

  var RARITY = [
    { key: 'common', name: 'Common', min: 1, frame: 'linear-gradient(145deg,#8a6a4a,#c9a27a 45%,#7a5a3c)', glow: '#c9a27a', ink: '#f3e6d6' },
    { key: 'rare', name: 'Rare', min: 3, frame: 'linear-gradient(145deg,#4f7bd9,#9cc3ff 45%,#3e5fb0)', glow: '#60a5fa', ink: '#e6f0ff' },
    { key: 'epic', name: 'Epic', min: 5, frame: 'linear-gradient(145deg,#7c3aed,#d8b4fe 45%,#5b21b6)', glow: '#a855f7', ink: '#f3e8ff' },
    { key: 'legendary', name: 'Legendary', min: 7, frame: 'linear-gradient(145deg,#f59e0b,#fde68a 40%,#f43f5e 70%,#38bdf8)', glow: '#fbbf24', ink: '#fff7d6' }
  ];
  function rarityOf(level) { var r = RARITY[0]; RARITY.forEach(function (x) { if (level >= x.min) r = x; }); return r; }

  var MOVES = { Listening: 'Echo Ears', Reading: 'Story Radar', Writing: 'Ink Spark', Speaking: 'Brave Voice', 'Ice-bridge stones': 'Story Radar', 'Word match': 'Word Magnet', Snake: 'Maze Dash', '-ng sound': 'Ring Voice', 'Poem table': 'Poem Lens', 'Car table': 'Compare Beam', 'Reading summary': 'Summary Shield' };
  var FLAVOR = ['Grows stronger with every word.', 'Never stops exploring.', 'A true Adventure Academy hero.', 'Learning is its superpower.', 'Brave in every lesson.'];

  function stars(pct) { return pct >= 80 ? 5 : pct >= 60 ? 4 : pct >= 40 ? 3 : pct >= 20 ? 2 : 1; }
  /** Skill stars from the quiz parts (Grade 3 and Grade 4 map to the same four skills), else from the teacher's skill data, else unknown (null). */
  function skillModel(id) {
    var out = { Speaking: null, Reading: null, Writing: null, Listening: null }, best = '';
    try {
      var d = root.QuizResults && root.QuizResults.detailOf ? root.QuizResults.detailOf(id) : null;
      if (d && d.parts.length) {
        var by = {}; d.parts.forEach(function (p) { by[p.label] = p; });
        var pc = function (labels) { var sc = 0, mx = 0; labels.forEach(function (l) { if (by[l]) { sc += by[l].score; mx += by[l].max; } }); return mx ? Math.round(sc / mx * 100) : null; };
        var grade4 = d.title.indexOf('money') >= 0;
        var L = grade4 ? pc(['Listening']) : pc(['Listening']), R = grade4 ? pc(['Reading']) : pc(['Ice-bridge stones', 'Poem table']), W = grade4 ? pc(['Writing']) : pc(['Car table', 'Reading summary']), Sp = grade4 ? null : pc(['-ng sound']);
        if (L != null) out.Listening = stars(L); if (R != null) out.Reading = stars(R); if (W != null) out.Writing = stars(W); if (Sp != null) out.Speaking = stars(Sp);
        var bp = null; d.parts.forEach(function (p) { var r = p.max ? p.score / p.max : 0; if (!bp || r > bp.r) bp = { r: r, label: p.label }; });
        if (bp) best = bp.label;
      }
    } catch (e) { /* quiz data is optional */ }
    try {
      var sk = S().getStudentSkills(id) || {};
      Object.keys(out).forEach(function (k) { if (out[k] == null) { var e = sk[k.toLowerCase()]; if (e && e.hasData !== false && Number(e.score) > 0) out[k] = stars(Number(e.score)); } });
    } catch (e) { /* skills are optional */ }
    return { stars: out, best: best };
  }

  function model(id, onReady) {
    var st = S(), s = st.getStudent(id); if (!s) return null;
    var ms = st.calculateMonsterState(id) || {}, level = ms.currentLevel || 1, xp = Number(ms.totalXP != null ? ms.totalXP : s.xp) || 0;
    var d = null; try { d = root.CommandCenter && root.CommandCenter.profileData ? root.CommandCenter.profileData(id, onReady) : null; } catch (e) { d = null; }
    var sk = skillModel(id), streak = 0;
    if (d) {
      for (var i = d.days.length - 1; i >= 0; i--) {
        var lab = d.labels[i];
        if (d.days[i] > 0) streak++;
        else if (lab.weekend || (lab.today && streak === 0) || !d.classDays[i]) continue;   // weekends, and days when nobody in the class had XP (no lesson), never break a streak
        else break;
      }
    }
    var tally = 0; try { (st.getStudentClassroomSkillsTally(id) || []).forEach(function (t) { if (t.category === 'positive' || !t.category) tally += Number(t.count) || 0; }); } catch (e) { tally = 0; }
    var hwTxt = '–';
    if (d && d.hwReady && d.hw.length) hwTxt = d.hw.filter(function (h) { return h.k === 'done'; }).length + '/' + d.hw.length;
    var best = sk.best || ''; var bestSkill = '';
    if (!best) { var top = null; Object.keys(sk.stars).forEach(function (k) { if (sk.stars[k] != null && (!top || sk.stars[k] > top.v)) top = { k: k, v: sk.stars[k] }; }); if (top) best = top.k; }
    return {
      id: id, first: s.firstName || s.name || 'Pupil', last: s.lastName || '', level: level, stage: (ms.stageName || '').replace(/^Level \d+ [•·-] /, '') || 'Monster',
      prog: ms.progressPct || 0, toNext: ms.xpToNext > 0 ? ms.xpToNext : 0, xp: xp, streak: streak, hw: hwTxt, team: tally, skills: sk.stars, best: best, move: MOVES[best] || 'Power Up', rarity: rarityOf(level),
      num: s.studentIdNumber || '', cls: (st.getClass && st.getClass(s.classId) ? st.getClass(s.classId).name : '') || s.grade || '',
      flavor: FLAVOR[(parseInt(String(s.studentIdNumber || id).replace(/\D/g, ''), 10) || 0) % FLAVOR.length], hasQuiz: !!(root.QuizResults && root.QuizResults.detailOf && root.QuizResults.detailOf(id))
    };
  }

  function css() {
    if (document.getElementById('pc-css')) return;
    var s = document.createElement('style'); s.id = 'pc-css';
    var u = function (n) { return 'calc(var(--u) * ' + n + ')'; };
    s.textContent =
      '.pc-card{--u:1px;width:calc(var(--u)*300);height:calc(var(--u)*420);position:relative;border-radius:' + u(16) + ';padding:' + u(9) + ';box-sizing:border-box;font-family:Inter,system-ui,sans-serif;color:#fff;box-shadow:0 ' + u(10) + ' ' + u(30) + ' -' + u(6) + ' var(--pc-glow),0 ' + u(4) + ' ' + u(12) + ' rgba(0,0,0,.5);transition:transform .25s cubic-bezier(.175,.885,.32,1.275);overflow:hidden;flex:none}' +
      '.pc-card:hover{transform:translateY(-4px) rotate(-1deg) scale(1.02)}' +
      '.pc-in{position:relative;height:100%;border-radius:' + u(10) + ';background:radial-gradient(circle at 50% 28%,#14203d 0%,#060911 100%);display:flex;flex-direction:column;padding:' + u(8) + ' ' + u(9) + ';box-sizing:border-box;overflow:hidden}' +
      '.pc-top{display:flex;justify-content:space-between;align-items:center;gap:' + u(6) + '}.pc-name{font-weight:900;font-size:' + u(17) + ';line-height:1.05;color:var(--pc-ink);text-shadow:0 1px 0 rgba(0,0,0,.6);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.pc-lv{font-size:' + u(11) + ';font-weight:800;color:#fde68a;white-space:nowrap}' +
      '.pc-art{margin:' + u(6) + ' 0;height:' + u(150) + ';border-radius:' + u(8) + ';border:' + u(2) + ' solid var(--pc-glow);background:radial-gradient(circle at 50% 60%,rgba(255,255,255,.14),rgba(6,9,17,.95) 70%);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}' +
      '.pc-art img,.pc-art svg{max-height:' + u(138) + ';max-width:' + u(150) + '}.pc-art .pc-ped{position:absolute;bottom:' + u(8) + ';width:' + u(110) + ';height:' + u(16) + ';border-radius:50%;background:radial-gradient(ellipse,var(--pc-glow),transparent 70%);opacity:.7}' +
      '.pc-type{font-size:' + u(9.5) + ';font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--pc-ink);opacity:.85;text-align:center}' +
      '.pc-box{margin-top:' + u(5) + ';background:rgba(15,23,42,.8);border:' + u(1) + ' solid rgba(255,255,255,.14);border-radius:' + u(8) + ';padding:' + u(6) + ' ' + u(8) + '}' +
      '.pc-sk{display:grid;grid-template-columns:1fr 1fr;gap:' + u(3) + ' ' + u(8) + '}.pc-sk div{display:flex;justify-content:space-between;align-items:center;font-size:' + u(10) + ';font-weight:700}.pc-sk b{letter-spacing:' + u(1) + ';color:#fbbf24;font-size:' + u(9.5) + '}.pc-sk b.no{color:#475569}' +
      '.pc-ef{display:grid;grid-template-columns:repeat(4,1fr);gap:' + u(4) + ';margin-top:' + u(5) + '}.pc-ef div{background:rgba(255,255,255,.07);border-radius:' + u(6) + ';text-align:center;padding:' + u(3) + ' 0}.pc-ef small{display:block;font-size:' + u(7.5) + ';text-transform:uppercase;color:#94a3b8;font-weight:700}.pc-ef b{font-size:' + u(12.5) + ';font-weight:900;color:#fff}' +
      '.pc-move{margin-top:' + u(5) + ';font-size:' + u(9.5) + ';line-height:1.25;color:#cbd5e1}.pc-move b{color:var(--pc-ink)}.pc-foot{margin-top:auto;display:flex;justify-content:space-between;font-size:' + u(7.5) + ';color:#7c8aa5;font-weight:700;padding-top:' + u(3) + '}' +
      '.pc-prog{margin-top:' + u(8) + ';height:' + u(7) + ';border-radius:' + u(4) + ';background:rgba(255,255,255,.12);overflow:hidden}.pc-prog i{display:block;height:100%;background:linear-gradient(90deg,#38bdf8,#a855f7)}.pc-progt{font-size:' + u(8) + ';color:#94a3b8;text-align:center;margin-top:' + u(3) + '}' +
      '.pc-shine{position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.35) 45%,rgba(255,255,255,.08) 55%,transparent 70%);background-size:250% 100%;mix-blend-mode:overlay;animation:pcShine 4.5s ease-in-out infinite}' +
      '@keyframes pcShine{0%{background-position:150% 0}60%,100%{background-position:-60% 0}}' +
      '.pc-wrap{display:flex;gap:18px;align-items:center;flex-wrap:wrap}.pc-side{flex:1;min-width:220px;color:inherit}.pc-btns{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}' +
      '.pc-btn{border:0;border-bottom:5px solid #1d4ed8;background:#38bdf8;color:#06101f;font-weight:800;border-radius:12px;padding:8px 14px;cursor:pointer;transition:transform .15s cubic-bezier(.175,.885,.32,1.275)}.pc-btn:active{transform:translateY(4px);border-bottom-width:1px}.pc-btn.o{background:#334155;border-bottom-color:#1e293b;color:#e2e8f0}' +
      '#pc-modal{position:fixed;inset:0;z-index:100000;background:rgba(6,9,17,.95);overflow:auto;padding:18px;color:#e8eefc;font-family:Inter,system-ui,sans-serif}' +
      '.pc-sheet{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;justify-items:center}' +
      '@media print{@page{size:A4;margin:8mm}body>*:not(#pc-modal){display:none!important}#pc-modal{position:static;background:#fff;padding:0;overflow:visible}.pc-noprint{display:none!important}.pc-sheet{display:grid;grid-template-columns:repeat(3,63mm);gap:3mm;justify-content:center}.pc-card{--u:.21mm;box-shadow:none;break-inside:avoid;-webkit-print-color-adjust:exact;print-color-adjust:exact}.pc-card:hover{transform:none}.pc-shine{display:none}}';
    document.head.appendChild(s);
  }

  function cardHtml(m, avatar) {
    var r = m.rarity, lv = ''; for (var i = 0; i < m.level; i++) lv += '★';
    function sk(label) { var v = m.skills[label]; return '<div><span>' + label + '</span><b class="' + (v == null ? 'no' : '') + '">' + (v == null ? '–' : new Array(v + 1).join('★') + new Array(6 - v).join('☆')) + '</b></div>'; }
    return '<div class="pc-card" style="--pc-glow:' + r.glow + ';--pc-ink:' + r.ink + ';background:' + r.frame + '"><div class="pc-in">' +
      '<div class="pc-top"><div class="pc-name">' + esc(m.first) + '</div><div class="pc-lv">' + lv + '</div></div>' +
      '<div class="pc-art"><span class="pc-ped"></span>' + (avatar || '') + '</div>' +
      '<div class="pc-type">[' + esc(r.name) + ' · ' + esc(m.stage) + ']</div>' +
      '<div class="pc-box"><div class="pc-sk">' + sk('Speaking') + sk('Reading') + sk('Writing') + sk('Listening') + '</div>' +
      '<div class="pc-ef"><div><small>XP</small><b>' + m.xp.toLocaleString('en-US') + '</b></div><div><small>Streak</small><b>' + m.streak + '</b></div><div><small>Homework</small><b>' + esc(m.hw) + '</b></div><div><small>Teamwork</small><b>' + m.team + '</b></div></div></div>' +
      '<div class="pc-move">' + (m.best ? '<b>' + esc(m.move) + '</b>: best at ' + esc(m.best) + '. ' : '') + '<i>' + esc(m.flavor) + '</i></div>' +
      '<div class="pc-prog"><i style="width:' + Math.max(3, m.prog) + '%"></i></div><div class="pc-progt">' + (m.toNext ? m.toNext.toLocaleString('en-US') + ' XP to the next level' : 'Top level reached') + '</div>' +
      '<div class="pc-foot"><span>EAA-' + esc(m.num) + ' · ' + esc(m.cls) + '</span><span>' + esc(r.name).toUpperCase() + '</span></div>' +
      (r.key === 'epic' || r.key === 'legendary' ? '<div class="pc-shine"></div>' : '') + '</div></div>';
  }
  function avatarFor(id, size) { try { return root.renderStudentMonsterAvatar ? root.renderStudentMonsterAvatar(id, { size: size || 128, animated: true }) : ''; } catch (e) { return ''; } }

  var PC = root.PupilCard = {
    /** The card as HTML (for the student page and the profile). */
    html: function (id) { css(); var m = model(id); return m ? cardHtml(m, avatarFor(id, 128)) : ''; },
    /** A panel with the card and a short explanation: for the student page. */
    panel: function (id) {
      css();
      var m = model(id, function () { var el = document.getElementById('pc-panel-' + id); if (el) el.innerHTML = PC.panelInner(id); });
      if (!m) return '';
      return '<div id="pc-panel-' + esc(id) + '">' + PC.panelInner(id) + '</div>';
    },
    panelInner: function (id) {
      var m = model(id); if (!m) return '';
      var nxt = RARITY.filter(function (x) { return x.min > m.level; })[0];
      return '<div class="pc-wrap">' + cardHtml(m, avatarFor(id, 128)) +
        '<div class="pc-side"><h3 style="margin:0 0 6px;font-size:1.25rem">🃏 My Monster Card</h3>' +
        '<p style="margin:0;opacity:.85">Your card grows with your monster. It is <b>' + esc(m.rarity.name) + '</b> now' + (nxt ? ', and becomes <b>' + esc(nxt.name) + '</b> at monster level ' + nxt.min + '.' : ': the highest card there is!') + '</p>' +
        '<ul style="margin:10px 0 0 18px;opacity:.9;line-height:1.6"><li>⭐ Skill stars grow when you do well in class and quizzes.</li><li>🔥 Streak: lessons in a row where you earned XP.</li><li>📚 Homework: how many you did.</li><li>🤝 Teamwork: class awards you earned.</li></ul>' +
        '<div class="pc-btns"><button class="pc-btn" onclick="PupilCard.open(\'' + esc(id) + '\')">🔍 Big card</button><button class="pc-btn o" onclick="PupilCard.print(\'' + esc(id) + '\')">🖨️ Print my card</button></div></div></div>';
    },
    open: function (id) {
      css(); var m = model(id, function () { var b = document.getElementById('pc-modal'); if (b && b.style.display === 'block') PC.open(id); }); if (!m) return;
      var box = document.getElementById('pc-modal'); if (!box) { box = document.createElement('div'); box.id = 'pc-modal'; document.body.appendChild(box); }
      box.innerHTML = '<div class="pc-noprint" style="display:flex;gap:8px;margin-bottom:14px"><button class="pc-btn" onclick="window.print()">🖨️ Print</button><button class="pc-btn o" style="margin-left:auto" onclick="PupilCard.close()">Close ✕</button></div>' +
        '<div style="display:flex;justify-content:center"><div style="zoom:1.35">' + cardHtml(m, avatarFor(id, 128)) + '</div></div>';
      box.style.display = 'block';
    },
    print: function (id) { PC.open(id); setTimeout(function () { try { window.print(); } catch (e) { /* the pupil can use the Print button */ } }, 250); },
    /** A printable A4 sheet of every card of a class (9 per page, 63 x 88 mm each). */
    openClass: function (classId) {
      css(); var st = S(), list = st.getStudentsByClass ? st.getStudentsByClass(classId) : []; if (!list.length) return;
      model(list[0].id, function () { var b = document.getElementById('pc-modal'); if (b && b.style.display === 'block' && b.querySelector('.pc-sheet')) PC.openClass(classId); });
      var box = document.getElementById('pc-modal'); if (!box) { box = document.createElement('div'); box.id = 'pc-modal'; document.body.appendChild(box); }
      box.innerHTML = '<div class="pc-noprint" style="display:flex;gap:8px;margin-bottom:14px;align-items:center"><h2 style="margin:0;font-size:1.2rem">🃏 Class cards (' + list.length + ')</h2><button class="pc-btn" onclick="window.print()">🖨️ Print the sheet</button><button class="pc-btn o" style="margin-left:auto" onclick="PupilCard.close()">Close ✕</button></div>' +
        '<div class="pc-sheet">' + list.map(function (s) { var m = model(s.id); return m ? cardHtml(m, avatarFor(s.id, 128)) : ''; }).join('') + '</div>';
      box.style.display = 'block';
    },
    close: function () { var b = document.getElementById('pc-modal'); if (b) b.style.display = 'none'; }
  };
})(typeof window !== 'undefined' ? window : this);
