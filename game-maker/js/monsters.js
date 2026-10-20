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
  function themeHat(theme, i) { return theme === 'halloween' ? ['hat-wizard', 'none', 'hat-party', 'none'][i % 4] : 'none'; }
  /* n default monsters, dressed for the theme */
  function defaults(n, theme) {
    var out = [], stages = ['growing', 'adventurer', 'advanced', 'growing', 'adventurer', 'advanced', 'growing', 'adventurer'];
    for (var i = 0; i < n; i++) out.push({ name: '', color: COLORS[i % COLORS.length], stage: stages[i], equipped: { hat: themeHat(theme, i) } });
    return out;
  }
  function svg(m, size) {
    size = size || 90;
    try {
      if (root.MonsterRenderer && typeof root.MonsterRenderer.renderMonsterSVG === 'function' && m) {
        var s = root.MonsterRenderer.renderMonsterSVG({ stage: m.stage || 'growing', color: m.color || 'blue', equipped: m.equipped || {}, size: size, animated: false });
        if (s) return s.replace(/href="assets\//g, 'href="../assets/');
      }
    } catch (e) { /* fall back to an emoji */ }
    return '<span style="font-size:' + Math.round(size * 0.7) + 'px;line-height:1">👾</span>';
  }
  GM.mon = { classes: classes, pupils: pupils, defaults: defaults, svg: svg, COLORS: COLORS };
})(window);
