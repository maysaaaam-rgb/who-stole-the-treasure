/* Game Maker: our Pixar 3D Pupil Avatars represent each class pupil & team across Setup, Team Pods, Questions, and Podium.
   Reads the platform data of THIS browser (nothing is sent anywhere): classes, pupils, and each pupil's 3D avatar. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {};
  var STAGES = ['egg', 'cracking_egg', 'baby', 'growing', 'adventurer', 'advanced', 'ultimate'];
  var COLORS = ['blue', 'pink', 'green', 'orange', 'purple', 'gold'];
  var DEMO_IDS = [
    'demo-boy', 'demo-girl',
    'student-3a-206', 'student-3a-209', 'student-3a-211', 'student-3a-219',
    'student-4b-208', 'student-4b-306'
  ];
  var cache = null;

  function store() {
    if (cache) return cache;
    try { cache = JSON.parse(localStorage.getItem('eaa_master_school_v6') || 'null') || {}; } catch (e) { cache = {}; }
    return cache;
  }

  function classes() {
    var st = store();
    if (!Array.isArray(st.classes)) return [];
    return st.classes
      .filter(function (c) { return c && !c.archived && !/store-sync/.test(c.id) && c.grade !== 'System'; })
      .map(function (c) { return { id: c.id, label: String(c.name || c.id).replace(/^Grade\s*/i, '') }; });
  }

  function levelOf(s, prof) {
    var xp = Number(s.xp) || 0, lv = 1, th = root.EAA_EVOLUTION_XP || [0, 30, 200, 500, 1000, 2000, 3500];
    th.forEach(function (x, i) { if (xp >= x) lv = i + 1; });
    return Math.max(lv, prof && prof.highestUnlockedLevel ? Math.min(prof.highestUnlockedLevel, 7) : 0, 3);
  }

  function pupils(classId) {
    var st = store();
    if (!Array.isArray(st.students)) return [];
    var profs = st.monsterProfiles || {};
    return st.students
      .filter(function (s) { return s && !s.archived && s.classId === classId; })
      .map(function (s, i) {
        var p = s.monsterProfile || profs[s.id] || {}, lv = levelOf(s, p);
        return {
          id: s.id,
          avatarKey: s.id,
          name: String(s.firstName || '').trim() || String(s.name || '').trim().split(/\s+/)[0] || 'Pupil',
          color: p.baseColor || COLORS[i % COLORS.length],
          equipped: p.equipped || {},
          stage: STAGES[lv - 1] || 'baby'
        };
      });
  }

  function groups(classId) {
    var st = store();
    if (!Array.isArray(st.groups)) return [];
    var ids = {};
    pupils(classId).forEach(function (p) { ids[p.id] = 1; });
    return st.groups
      .filter(function (g) { return g && g.classId === classId && Array.isArray(g.studentIds); })
      .map(function (g) {
        return {
          name: String(g.name || 'Group').slice(0, 14),
          color: g.color || '',
          ids: g.studentIds.filter(function (id) { return ids[id]; })
        };
      })
      .filter(function (g) { return g.ids.length; });
  }

  var HAL_HATS = ['cs-witch-hat', 'cs-pumpkin-cap', 'cs-vamp-hair', 'cs-witch-hat', 'cs-pumpkin-cap', 'cs-vamp-hair', 'cs-witch-hat', 'cs-pumpkin-cap'];
  var HAL_CAPES = ['cs-witch-cape', 'none', 'cs-vamp-cape', 'none', 'cs-witch-cape', 'none', 'cs-vamp-cape', 'none'];
  function themeHat(theme, i) { return theme === 'halloween' ? HAL_HATS[i % 8] : 'none'; }

  function defaults(n, theme) {
    var out = [], stages = ['growing', 'adventurer', 'advanced', 'growing', 'adventurer', 'advanced', 'growing', 'adventurer'];
    for (var i = 0; i < n; i++) {
      out.push({
        name: '',
        demoIdx: i,
        avatarKey: DEMO_IDS[i % DEMO_IDS.length],
        color: COLORS[i % COLORS.length],
        stage: stages[i % stages.length],
        equipped: theme === 'halloween' ? { hat: themeHat(theme, i), backpack: HAL_CAPES[i % 8] } : { hat: 'none' }
      });
    }
    return out;
  }

  function avatarSrcFor(m) {
    var PA = root.PupilAvatars;
    if (!PA) return '';
    var theme = (GM.state && GM.state.theme) || 'classic';
    if (m && m.id && PA.pictureFor) {
      return PA.pictureFor(m.id);
    }
    if (PA.demoPictureFor) {
      var idx = (m && typeof m.demoIdx === 'number') ? m.demoIdx : 0;
      var teamHex = (m && m.teamHex) || '';
      return PA.demoPictureFor(idx, teamHex, theme);
    }
    return '';
  }

  function escAttr(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  }

  function svg(m, size) {
    size = size || 90;
    var PA = root.PupilAvatars;
    if (PA) {
      var src = avatarSrcFor(m);
      if (src) {
        var avId = (m && m.id) ? ('id:' + m.id) : ('demo:' + ((m && typeof m.demoIdx === 'number') ? m.demoIdx : 0));
        return '<img class="gm-av-img" data-av-ref="' + escAttr(avId) + '" src="' + escAttr(src) + '" width="' + size + '" height="' + size + '" alt="" style="width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;filter:drop-shadow(0 5px 8px rgba(15,23,42,0.28));">';
      }
    }
    try {
      if (root.MonsterRenderer && typeof root.MonsterRenderer.renderMonsterSVG === 'function' && m) {
        var eq = {}, s0 = m.equipped || {};
        for (var k in s0) if (Object.prototype.hasOwnProperty.call(s0, k)) eq[k] = s0[k];
        eq.background = 'none';
        var s = root.MonsterRenderer.renderMonsterSVG({ stage: m.stage || 'growing', color: m.color || 'blue', equipped: eq, size: size, animated: false });
        if (s) return s.replace(/href="assets\//g, 'href="../assets/');
      }
    } catch (e) { /* fall back */ }
    return '<span style="font-size:' + Math.round(size * 0.7) + 'px;line-height:1">🧒</span>';
  }

  /* Live-upgrade any visible Game Maker avatar <img> tags as soon as PupilAvatars finishes async composition */
  if (root.addEventListener) {
    root.addEventListener('eaa:avatars-ready', function () {
      var PA = root.PupilAvatars;
      if (!PA || typeof document === 'undefined') return;
      var theme = (GM.state && GM.state.theme) || 'classic';
      var imgs = document.querySelectorAll('img.gm-av-img[data-av-ref]');
      for (var i = 0; i < imgs.length; i++) {
        var el = imgs[i];
        var ref = el.getAttribute('data-av-ref') || '';
        var nextSrc = '';
        if (ref.indexOf('id:') === 0 && PA.pictureFor) {
          nextSrc = PA.pictureFor(ref.slice(3));
        } else if (ref.indexOf('demo:') === 0 && PA.demoPictureFor) {
          nextSrc = PA.demoPictureFor(parseInt(ref.slice(5), 10) || 0, '', theme);
        }
        if (nextSrc && el.getAttribute('src') !== nextSrc) {
          el.setAttribute('src', nextSrc);
        }
      }
    });
  }

  /* Kick off PupilAvatars loading right away in Game Maker */
  setTimeout(function () {
    try { if (root.PupilAvatars && root.PupilAvatars.load) root.PupilAvatars.load(); } catch (e) { /* ignore */ }
  }, 60);

  GM.mon = { classes: classes, pupils: pupils, groups: groups, defaults: defaults, svg: svg, DEMO_IDS: DEMO_IDS, COLORS: COLORS };
})(window);
