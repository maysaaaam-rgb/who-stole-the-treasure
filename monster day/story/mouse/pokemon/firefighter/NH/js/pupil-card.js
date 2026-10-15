/* Pupil trading card, laid out like a real Yu-Gi-Oh monster card: a name banner with an attribute orb, level stars, the monster picture in a framed art box
   (the pupil's own monster artwork on their own equipped background, with their aura), a [Type / Effect] line, a parchment effect box and ATK / DEF at the bottom.
   ATK grows with XP. DEF grows with homework, teamwork (class awards), streak and quiz work. Quiz scores are never printed; only "best at ..." is.
   The frame comes from the MONSTER LEVEL: Common (1-2), Rare (3-4), Epic (5-6), Legendary (7). No hand-drawn characters: the picture is the platform's monster artwork.
   Opens on the student page, from the teacher profile, and as a printable class sheet (9 cards per A4 page, 63 x 88 mm). */
(function (root) {
  'use strict';
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function S() { return root.schoolStore; }

  var RARITY = [
    { key: 'common', name: 'Common', min: 1, frame: 'linear-gradient(145deg,#6b5a46,#b79a74 45%,#5e4c38)', glow: '#c9a27a', band: 'linear-gradient(180deg,#e9d8bd,#b89a6e)', ink: '#2b1d0e' },
    { key: 'rare', name: 'Rare', min: 3, frame: 'linear-gradient(145deg,#3d5fae,#a9c7ff 45%,#2f4a8f)', glow: '#60a5fa', band: 'linear-gradient(180deg,#e8f1ff,#9db9ea)', ink: '#10233f' },
    { key: 'epic', name: 'Epic', min: 5, frame: 'linear-gradient(145deg,#5b21b6,#e0c4ff 45%,#4c1d95)', glow: '#a855f7', band: 'linear-gradient(180deg,#f5ebff,#c4a0f0)', ink: '#2a1050' },
    { key: 'legendary', name: 'Legendary', min: 7, frame: 'linear-gradient(145deg,#d97706,#fde68a 35%,#f43f5e 65%,#38bdf8)', glow: '#fbbf24', band: 'linear-gradient(180deg,#fff6d1,#f2c66a)', ink: '#3b2204' }
  ];
  function rarityOf(level) { var r = RARITY[0]; RARITY.forEach(function (x) { if (level >= x.min) r = x; }); return r; }

  var MOVES = { Listening: 'Echo Ears', Reading: 'Story Radar', Writing: 'Ink Spark', Speaking: 'Brave Voice', 'Ice-bridge stones': 'Story Radar', 'Word match': 'Word Magnet', Snake: 'Maze Dash', '-ng sound': 'Ring Voice', 'Poem table': 'Poem Lens', 'Car table': 'Compare Beam', 'Reading summary': 'Summary Shield' };
  var FLAVOR = ['Grows stronger with every word.', 'Never stops exploring.', 'A true Adventure Academy hero.', 'Learning is its superpower.', 'Brave in every lesson.'];
  var AURA_ICON = { sparkle: '✨', flame: '🔥', ice: '❄️', rainbow: '🌈', cosmic: '🌌', lightning: '⚡', blossom: '🌸', star: '⭐', dragon: '🐉', royal: '👑' };
  var BG_IMG = ['meadow', 'castle', 'forest', 'volcano', 'beach', 'moonlit', 'winter', 'cosmos', 'desert', 'underwater', 'rainbow', 'cloud', 'crystal'];
  var AURA_IMG = ['sparkle', 'flame', 'ice', 'rainbow', 'cosmic', 'lightning', 'blossom', 'star', 'dragon', 'royal'];

  /** The strongest quiz part (or skill) of the pupil: only its NAME is used on the card, never a score. */
  function bestOf(id) {
    try {
      var d = root.QuizResults && root.QuizResults.detailOf ? root.QuizResults.detailOf(id) : null;
      if (d && d.parts.length) { var bp = null; d.parts.forEach(function (p) { var r = p.max ? p.score / p.max : 0; if (!bp || r > bp.r) bp = { r: r, label: p.label }; }); if (bp && bp.r > 0) return bp.label; }
    } catch (e) { /* quiz data is optional */ }
    try {
      var sk = S().getStudentSkills(id) || {}, top = null;
      ['speaking', 'reading', 'writing', 'listening'].forEach(function (k) { var e = sk[k]; if (e && Number(e.score) > 0 && (!top || e.score > top.v)) top = { k: k, v: e.score }; });
      if (top) return top.k.charAt(0).toUpperCase() + top.k.slice(1);
    } catch (e) { /* skills are optional */ }
    return '';
  }
  function r50(n) { return Math.max(0, Math.round(n / 50) * 50); }

  function model(id, onReady) {
    var st = S(), s = st.getStudent(id); if (!s) return null;
    var ms = st.calculateMonsterState(id) || {}, level = ms.currentLevel || 1, xp = Number(ms.totalXP != null ? ms.totalXP : s.xp) || 0;
    var d = null; try { d = root.CommandCenter && root.CommandCenter.profileData ? root.CommandCenter.profileData(id, onReady) : null; } catch (e) { d = null; }
    var streak = 0, hwDone = 0;
    if (d) {
      for (var i = d.days.length - 1; i >= 0; i--) {
        var lab = d.labels[i];
        if (d.days[i] > 0) streak++;
        else if (lab.weekend || (lab.today && streak === 0) || !d.classDays[i]) continue;   // weekends and days nobody in the class had XP never break a streak
        else break;
      }
      hwDone = d.hw.filter(function (h) { return h.k === 'done'; }).length;
    }
    var team = 0; try { (st.getStudentClassroomSkillsTally(id) || []).forEach(function (t) { if (t.category === 'positive' || !t.category) team += Number(t.count) || 0; }); } catch (e) { team = 0; }
    var qpct = 0; try { var q = root.QuizResults && root.QuizResults.scoreOf ? root.QuizResults.scoreOf(id) : null; qpct = q ? q.pct : 0; } catch (e) { qpct = 0; }
    var prof = null; try { prof = st.getMonsterProfile(id); } catch (e) { prof = null; }
    var eq = (prof && prof.equipped) || {};
    var best = bestOf(id);
    var aura = String(eq.aura || '').replace(/^aura-/, ''), bg = String(eq.background || '').replace(/^bg-/, '');
    return {
      id: id, first: s.firstName || s.name || 'Pupil', level: level, stage: (ms.stageName || '').replace(/^Level \d+ [•·-] /, '') || 'Monster',
      atk: Math.min(9950, r50(400 + xp * 2.5)), def: Math.min(9950, r50(300 + hwDone * 350 + team * 25 + streak * 100 + qpct * 8)),
      best: best, move: MOVES[best] || 'Power Up', rarity: rarityOf(level), num: s.studentIdNumber || '',
      cls: (st.getClass && st.getClass(s.classId) ? st.getClass(s.classId).name : '') || s.grade || '',
      flavor: FLAVOR[(parseInt(String(s.studentIdNumber || id).replace(/\D/g, ''), 10) || 0) % FLAVOR.length],
      aura: AURA_IMG.indexOf(aura) !== -1 ? aura : '', bg: BG_IMG.indexOf(bg) !== -1 ? bg : '', orb: AURA_ICON[aura] || '🌟'
    };
  }

  function css() {
    if (document.getElementById('pc-css')) return;
    var s = document.createElement('style'); s.id = 'pc-css';
    var u = function (n) { return 'calc(var(--u) * ' + n + ')'; };
    s.textContent =
      '.pc-card{--u:1px;width:' + u(300) + ';height:' + u(438) + ';position:relative;border-radius:' + u(10) + ';padding:' + u(8) + ';box-sizing:border-box;font-family:Georgia,"Times New Roman",serif;color:var(--pc-ink);box-shadow:0 ' + u(10) + ' ' + u(28) + ' -' + u(6) + ' var(--pc-glow),0 ' + u(4) + ' ' + u(12) + ' rgba(0,0,0,.55);transition:transform .25s cubic-bezier(.175,.885,.32,1.275);overflow:hidden;flex:none}' +
      '.pc-card:hover{transform:translateY(-4px) rotate(-1deg) scale(1.02)}' +
      '.pc-in{position:relative;height:100%;box-sizing:border-box;border:' + u(2) + ' solid rgba(0,0,0,.55);border-radius:' + u(5) + ';background:var(--pc-band);padding:' + u(6) + ';display:flex;flex-direction:column;gap:' + u(4) + ';overflow:hidden}' +
      '.pc-top{display:flex;align-items:center;justify-content:space-between;gap:' + u(6) + ';padding:' + u(3) + ' ' + u(6) + ';border:' + u(1.5) + ' solid rgba(0,0,0,.6);border-radius:' + u(4) + ';background:linear-gradient(180deg,rgba(255,255,255,.75),rgba(255,255,255,.25));box-shadow:inset 0 0 ' + u(5) + ' rgba(0,0,0,.25)}' +
      '.pc-name{font-weight:900;font-size:' + u(19) + ';line-height:1.05;text-shadow:0 1px 0 rgba(255,255,255,.7);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:.01em}' +
      '.pc-orb{flex:none;width:' + u(24) + ';height:' + u(24) + ';border-radius:50%;border:' + u(2) + ' solid #3b2204;background:radial-gradient(circle at 35% 30%,#fff7d6,var(--pc-glow) 60%,#3b2204);display:flex;align-items:center;justify-content:center;font-size:' + u(13) + ';box-shadow:0 1px 3px rgba(0,0,0,.5)}' +
      '.pc-lvs{display:flex;justify-content:flex-end;gap:' + u(2) + ';min-height:' + u(15) + ';margin-top:-' + u(1) + '}.pc-lvs span{width:' + u(13) + ';height:' + u(13) + ';border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff3a8,#f59e0b 65%,#92400e);border:' + u(1) + ' solid #5b3a05;color:#7a1d1d;font-size:' + u(9) + ';line-height:' + u(11.5) + ';text-align:center;font-family:Arial,sans-serif}' +
      '.pc-art{position:relative;height:' + u(206) + ';border:' + u(3) + ' solid #7a6a4f;border-image:linear-gradient(145deg,#f7e7a6,#8b6b2c,#f7e7a6) 1;box-shadow:inset 0 0 ' + u(12) + ' rgba(0,0,0,.7);background:#0a0f1d;display:flex;align-items:flex-end;justify-content:center;overflow:hidden}' +
      '.pc-art .pc-bgd{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.95}.pc-art .pc-aur{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}.pc-art .pc-aur img{width:96%;height:96%;object-fit:contain;opacity:.9;mix-blend-mode:screen}' +
      '.pc-art .pc-mon{position:relative;z-index:2;display:flex;align-items:center;justify-content:center;width:100%;height:100%}.pc-art .pc-mon img,.pc-art .pc-mon svg{max-height:' + u(176) + ';max-width:' + u(176) + ';filter:drop-shadow(0 ' + u(6) + ' ' + u(6) + ' rgba(0,0,0,.55))}' +
      '.pc-set{display:flex;justify-content:space-between;font-size:' + u(8) + ';font-family:Arial,sans-serif;font-weight:700;letter-spacing:.04em;padding:0 ' + u(2) + '}' +
      '.pc-txt{flex:1;border:' + u(1.5) + ' solid rgba(0,0,0,.65);background:linear-gradient(180deg,#f6ecd2,#e8d6a8);padding:' + u(5) + ' ' + u(7) + ';display:flex;flex-direction:column;box-shadow:inset 0 0 ' + u(6) + ' rgba(120,80,20,.35);min-height:0}' +
      '.pc-ty{font-weight:900;font-size:' + u(10.5) + ';border-bottom:' + u(1) + ' solid rgba(0,0,0,.55);padding-bottom:' + u(2) + ';margin-bottom:' + u(3) + '}' +
      '.pc-ef{font-size:' + u(10.2) + ';line-height:1.28;flex:1;overflow:hidden}.pc-ef i{display:block;margin-top:' + u(2) + ';opacity:.85}' +
      '.pc-stat{display:flex;justify-content:flex-end;gap:' + u(12) + ';font-weight:900;font-size:' + u(13) + ';font-family:Arial,sans-serif;border-top:' + u(1) + ' solid rgba(0,0,0,.55);padding-top:' + u(2) + '}' +
      '.pc-shine{position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 28%,rgba(255,255,255,.42) 45%,rgba(120,200,255,.18) 52%,transparent 68%);background-size:250% 100%;mix-blend-mode:overlay;animation:pcShine 4.5s ease-in-out infinite}' +
      '@keyframes pcShine{0%{background-position:150% 0}60%,100%{background-position:-60% 0}}' +
      '.pc-wrap{display:flex;gap:18px;align-items:center;flex-wrap:wrap}.pc-side{flex:1;min-width:220px;color:inherit}.pc-btns{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}' +
      '.pc-btn{border:0;border-bottom:5px solid #1d4ed8;background:#38bdf8;color:#06101f;font-weight:800;border-radius:12px;padding:8px 14px;cursor:pointer;font-family:Inter,system-ui,sans-serif;transition:transform .15s cubic-bezier(.175,.885,.32,1.275)}.pc-btn:active{transform:translateY(4px);border-bottom-width:1px}.pc-btn.o{background:#334155;border-bottom-color:#1e293b;color:#e2e8f0}' +
      '#pc-modal{position:fixed;inset:0;z-index:100000;background:rgba(6,9,17,.95);overflow:auto;padding:18px;color:#e8eefc;font-family:Inter,system-ui,sans-serif}' +
      '.pc-sheet{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;justify-items:center}' +
      '@media print{@page{size:A4;margin:8mm}body>*:not(#pc-modal){display:none!important}#pc-modal{position:static;background:#fff;padding:0;overflow:visible}.pc-noprint{display:none!important}.pc-sheet{display:grid;grid-template-columns:repeat(3,63mm);gap:3mm;justify-content:center}.pc-card{--u:.21mm;box-shadow:none;break-inside:avoid;-webkit-print-color-adjust:exact;print-color-adjust:exact}.pc-card:hover{transform:none}.pc-shine{display:none}}';
    document.head.appendChild(s);
  }

  function cardHtml(m, avatar) {
    var r = m.rarity, lv = ''; for (var i = 0; i < m.level; i++) lv += '<span>★</span>';
    var bgd = m.bg ? '<div class="pc-bgd" style="background-image:url(assets/monsters/bg-art/bg_' + m.bg + '.webp)"></div>' : '<div class="pc-bgd" style="background:radial-gradient(circle at 50% 55%,' + r.glow + '55,#0a0f1d 75%)"></div>';
    var aur = m.aura ? '<div class="pc-aur"><img src="assets/monsters/aura-art/aura_' + m.aura + '.webp" alt=""></div>' : '';
    return '<div class="pc-card" style="--pc-glow:' + r.glow + ';--pc-ink:' + r.ink + ';--pc-band:' + r.band + ';background:' + r.frame + '"><div class="pc-in">' +
      '<div class="pc-top"><div class="pc-name">' + esc(m.first) + '</div><div class="pc-orb">' + m.orb + '</div></div>' +
      '<div class="pc-lvs">' + lv + '</div>' +
      '<div class="pc-art">' + bgd + aur + '<div class="pc-mon">' + (avatar || '') + '</div></div>' +
      '<div class="pc-set"><span>EAA-' + esc(m.num) + '</span><span>' + esc(m.cls) + ' · ' + esc(r.name).toUpperCase() + '</span></div>' +
      '<div class="pc-txt"><div class="pc-ty">[' + esc(m.stage) + ' / Effect]</div><div class="pc-ef">' +
        (m.best ? '<b>' + esc(m.move) + ':</b> this monster is at its best in ' + esc(m.best) + '. ' : 'A rising hero of the Academy. ') + '<i>' + esc(m.flavor) + '</i></div>' +
        '<div class="pc-stat"><span>ATK/ ' + m.atk + '</span><span>DEF/ ' + m.def + '</span></div></div>' +
      (r.key === 'epic' || r.key === 'legendary' ? '<div class="pc-shine"></div>' : '') + '</div></div>';
  }
  function avatarFor(id, size) { try { return root.renderStudentMonsterAvatar ? root.renderStudentMonsterAvatar(id, { size: size || 150, animated: true }) : ''; } catch (e) { return ''; } }

  var PC = root.PupilCard = {
    html: function (id) { css(); var m = model(id); return m ? cardHtml(m, avatarFor(id, 150)) : ''; },
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
      return '<div class="pc-wrap">' + cardHtml(m, avatarFor(id, 150)) +
        '<div class="pc-side"><h3 style="margin:0 0 6px;font-size:1.25rem">🃏 My Monster Card</h3>' +
        '<p style="margin:0;opacity:.85">Your card grows with your monster. It is <b>' + esc(m.rarity.name) + '</b> now' + (nxt ? ', and becomes <b>' + esc(nxt.name) + '</b> at monster level ' + nxt.min + '.' : ': the highest card there is!') + '</p>' +
        '<ul style="margin:10px 0 0 18px;opacity:.9;line-height:1.7"><li>⚔️ <b>ATK</b> goes up with your XP.</li><li>🛡️ <b>DEF</b> goes up with homework, teamwork, your streak and your quiz work.</li><li>🌄 Your card shows your own monster, background and aura. Change them in the Monster Studio!</li></ul>' +
        '<div class="pc-btns"><button class="pc-btn" onclick="PupilCard.open(\'' + esc(id) + '\')">🔍 Big card</button><button class="pc-btn o" onclick="PupilCard.print(\'' + esc(id) + '\')">🖨️ Print my card</button></div></div></div>';
    },
    open: function (id) {
      css(); var m = model(id, function () { var b = document.getElementById('pc-modal'); if (b && b.style.display === 'block' && !b.querySelector('.pc-sheet')) PC.open(id); }); if (!m) return;
      var box = document.getElementById('pc-modal'); if (!box) { box = document.createElement('div'); box.id = 'pc-modal'; document.body.appendChild(box); }
      box.innerHTML = '<div class="pc-noprint" style="display:flex;gap:8px;margin-bottom:14px"><button class="pc-btn" onclick="window.print()">🖨️ Print</button><button class="pc-btn o" style="margin-left:auto" onclick="PupilCard.close()">Close ✕</button></div>' +
        '<div style="display:flex;justify-content:center"><div style="zoom:1.3">' + cardHtml(m, avatarFor(id, 150)) + '</div></div>';
      box.style.display = 'block';
    },
    print: function (id) { PC.open(id); setTimeout(function () { try { window.print(); } catch (e) { /* the pupil can use the Print button */ } }, 250); },
    /** A printable A4 sheet of every card of a class (9 per page, 63 x 88 mm each). */
    openClass: function (classId) {
      css(); var st = S(), list = st.getStudentsByClass ? st.getStudentsByClass(classId) : []; if (!list.length) return;
      model(list[0].id, function () { var b = document.getElementById('pc-modal'); if (b && b.style.display === 'block' && b.querySelector('.pc-sheet')) PC.openClass(classId); });
      var box = document.getElementById('pc-modal'); if (!box) { box = document.createElement('div'); box.id = 'pc-modal'; document.body.appendChild(box); }
      box.innerHTML = '<div class="pc-noprint" style="display:flex;gap:8px;margin-bottom:14px;align-items:center"><h2 style="margin:0;font-size:1.2rem">🃏 Class cards (' + list.length + ')</h2><button class="pc-btn" onclick="window.print()">🖨️ Print the sheet</button><button class="pc-btn o" style="margin-left:auto" onclick="PupilCard.close()">Close ✕</button></div>' +
        '<div class="pc-sheet">' + list.map(function (s) { var m = model(s.id); return m ? cardHtml(m, avatarFor(s.id, 150)) : ''; }).join('') + '</div>';
      box.style.display = 'block';
    },
    close: function () { var b = document.getElementById('pc-modal'); if (b) b.style.display = 'none'; }
  };
})(typeof window !== 'undefined' ? window : this);
