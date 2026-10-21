/* Game Maker: the class monsters become the team mascots. Reads the platform data of THIS browser (nothing is sent anywhere):
   classes, pupils and each pupil's monster (colour, items, level). Falls back to colourful default monsters. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {};
  var STAGES = ['egg', 'cracking_egg', 'baby', 'growing', 'adventurer', 'advanced', 'ultimate'];
  var COLORS = ['blue', 'pink', 'green', 'orange', 'purple', 'gold'];
  var cache = null;
  function store() {
    if (cache) return cache;
    try { cache = JSON.parse(localStorage.getItem('eaa_master_school_v6') || 'null') || {}; } catch (e) { cache = {}; }
    return cache;
  }
  function classes() {
    var st = store(); if (!Array.isArray(st.classes)) return [];
    return st.classes.filter(function (c) { return c && !c.archived && !/store-sync/.test(c.id); }).map(function (c) { return { id: c.id, label: String(c.name || c.id).replace(/^Grade\s*/i, '') }; });
  }
  function levelOf(s, prof) {
    var xp = Number(s.xp) || 0, lv = 1, th = root.EAA_EVOLUTION_XP || [0, 30, 200, 500, 1000, 2000, 3500];
    th.forEach(function (x, i) { if (xp >= x) lv = i + 1; });
    return Math.max(lv, prof && prof.highestUnlockedLevel ? Math.min(prof.highestUnlockedLevel, 7) : 0, 3);
  }
  /* pupils of a class with a drawable monster */
  function pupils(classId) {
    var st = store(); if (!Array.isArray(st.students)) return [];
    var profs = st.monsterProfiles || {};
    return st.students.filter(function (s) { return s && !s.archived && s.classId === classId; }).map(function (s, i) {
      var p = s.monsterProfile || profs[s.id] || {}, lv = levelOf(s, p);
      return { id: s.id, name: String(s.firstName || '').trim() || String(s.name || '').trim().split(/\s+/)[0] || 'Pupil', color: p.baseColor || COLORS[i % COLORS.length], equipped: p.equipped || {}, stage: STAGES[lv - 1] || 'baby' };
    });
  }
  var HAL_HATS = ['cs-witch-hat', 'cs-pumpkin-cap', 'cs-vamp-hair', 'cs-witch-hat', 'cs-pumpkin-cap', 'cs-vamp-hair', 'cs-witch-hat', 'cs-pumpkin-cap'], HAL_CAPES = ['cs-witch-cape', 'none', 'cs-vamp-cape', 'none', 'cs-witch-cape', 'none', 'cs-vamp-cape', 'none'];
  function themeHat(theme, i) { return theme === 'halloween' ? HAL_HATS[i % 8] : 'none'; }
  /* n default monsters, dressed for the theme */
  function defaults(n, theme) {
    var out = [], stages = ['growing', 'adventurer', 'advanced', 'growing', 'adventurer', 'advanced', 'growing', 'adventurer'];
    for (var i = 0; i < n; i++) out.push({ name: '', color: COLORS[i % COLORS.length], stage: stages[i], equipped: theme === 'halloween' ? { hat: themeHat(theme, i), backpack: HAL_CAPES[i % 8] } : { hat: 'none' } });
    return out;
  }
  /* In the games the monsters stand on their own legs: the pedestal is taken away and two short legs with round feet are drawn
     behind the body (the Sky Dragon already has its own feet). */
  var LEG_W = { baby: 11, growing: 12, adventurer: 13, advanced: 14, ultimate: 15 };
  function withLegs(s, m) {
    s = s.replace(/<g class="monster-pedestal-stage">[\s\S]*?<\/g>/, '');
    var eq = m.equipped || {}; if (/dragon/.test(String(eq.creature || '')) || m.stage === 'egg' || m.stage === 'cracking_egg') return s;
    var P = (root.MonsterRenderer && root.MonsterRenderer.palettes && root.MonsterRenderer.palettes[m.color]) || { primary: '#38bdf8', primaryDark: '#0284c7', shadowDark: '#0c4a6e', primaryLight: '#bae6fd' };
    var w = LEG_W[m.stage] || 12, gap = w * 1.25, top = 134, foot = 176, line = P.shadowDark || P.primaryDark, legs = '';
    [-1, 1].forEach(function (k) {
      var x = 100 + k * gap;
      legs += '<g class="gm-leg"><rect x="' + (x - w / 2) + '" y="' + top + '" width="' + w + '" height="' + (foot - top) + '" rx="' + (w / 2) + '" fill="' + P.primary + '" stroke="' + line + '" stroke-width="2"/>' +
        '<ellipse cx="' + (x + k * 2) + '" cy="' + foot + '" rx="' + (w * 0.95) + '" ry="' + (w * 0.55) + '" fill="' + P.primaryDark + '" stroke="' + line + '" stroke-width="2"/>' +
        '<ellipse cx="' + (x + k * 2 - w * 0.25) + '" cy="' + (foot - w * 0.2) + '" rx="' + (w * 0.35) + '" ry="' + (w * 0.18) + '" fill="#ffffff" opacity="0.35"/></g>';
    });
    legs = '<g class="gm-legs">' + legs + '</g>';
    var i = s.indexOf('monster-contact-shadow-group'), j = i >= 0 ? s.indexOf('</g>', i) : -1;
    if (j >= 0) return s.slice(0, j + 4) + legs + s.slice(j + 4);
    var k2 = s.indexOf('>', s.indexOf('<svg')); return s.slice(0, k2 + 1) + legs + s.slice(k2 + 1);
  }
  function svg(m, size) {
    size = size || 90;
    try {
      if (root.MonsterRenderer && typeof root.MonsterRenderer.renderMonsterSVG === 'function' && m) {
        var s = root.MonsterRenderer.renderMonsterSVG({ stage: m.stage || 'growing', color: m.color || 'blue', equipped: m.equipped || {}, size: size, animated: false });
        if (s) return withLegs(s, m).replace(/href="assets\//g, 'href="../assets/');
      }
    } catch (e) { /* fall back to an emoji */ }
    return '<span style="font-size:' + Math.round(size * 0.7) + 'px;line-height:1">👾</span>';
  }
  GM.mon = { classes: classes, pupils: pupils, defaults: defaults, svg: svg, COLORS: COLORS };
})(window);
