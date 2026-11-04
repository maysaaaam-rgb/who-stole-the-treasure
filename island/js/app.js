/* Practice Island — Main Pupil Gameplay & UI Controller (island/js/app.js)
   Handles Map, 4 Zones, 5 Mission Types, Star Path, Daily Quest, Streak, Monster Hop, Level-Up & Dressing Room. */
(function (root) {
  'use strict';

  var STAGE_KEYS = ['egg', 'cracking_egg', 'baby', 'growing', 'adventurer', 'advanced', 'ultimate'];
  var STAGE_NAMES = ['Mystery Egg', 'Cracking Egg', 'Baby Monster', 'Growing Buddy', 'Adventurer', 'Advanced Hero', 'Ultimate Legend'];

  var state = {
    session: null,
    activeModal: null,
    missionRun: null,
    dressDraft: null,
    dressTab: 'hat',
    monsterPos: { left: '11%', top: '42%' }
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function getThresholds() {
    return Array.isArray(root.EAA_EVOLUTION_XP) ? root.EAA_EVOLUTION_XP : [0, 30, 200, 500, 1000, 2000, 3500];
  }

  function calcMonsterLevel(xp) {
    var val = Math.max(0, Number(xp) || 0);
    var th = getThresholds();
    var lvl = 1;
    for (var i = 0; i < th.length; i++) {
      if (val >= th[i]) lvl = i + 1;
    }
    lvl = Math.max(1, Math.min(STAGE_KEYS.length, lvl));
    var curFloor = th[lvl - 1] || 0;
    var nextCeil = th[lvl] || null;
    var pct = 100;
    if (nextCeil && nextCeil > curFloor) {
      pct = Math.max(0, Math.min(100, Math.round(((val - curFloor) / (nextCeil - curFloor)) * 100)));
    }
    return {
      level: lvl,
      stageKey: STAGE_KEYS[lvl - 1] || 'baby',
      stageName: STAGE_NAMES[lvl - 1] || 'Monster',
      nextXP: nextCeil,
      pctToNext: pct
    };
  }

  function getTotalIslandXP(doc) {
    if (!doc || !doc.days) return 0;
    return Object.keys(doc.days).reduce(function (sum, d) {
      return sum + (Number(doc.days[d] && doc.days[d].xp) || 0);
    }, 0);
  }

  function getEffectiveXP() {
    if (!state.session) return 0;
    var baseXP = Number(state.session.student && state.session.student.totalXP) || 0;
    if (root.IslandSync && typeof root.IslandSync.calcUnappliedIslandXP === 'function') {
      return baseXP + root.IslandSync.calcUnappliedIslandXP(state.session.doc, state.session.appliedDays);
    }
    var islXP = getTotalIslandXP(state.session.doc);
    var applied = Number(state.session.appliedSum) || 0;
    var unapplied = Math.max(0, islXP - applied);
    return baseXP + unapplied;
  }

  function getTodayXP() {
    if (!state.session || !state.session.doc || !state.session.doc.days) return 0;
    var t = root.IslandSync.todayStr();
    return Number(state.session.doc.days[t] && state.session.doc.days[t].xp) || 0;
  }

  function isZoneUnlocked(zoneNum) {
    if (zoneNum <= 1) return true;
    if (!state.session || !state.session.doc) return false;
    if (state.session.isDemo) return true;
    var g = state.session.grade || 3;
    var prevPrefix = 'g' + g + '-z' + (zoneNum - 1) + '-m';
    var stars = state.session.doc.stars || {};
    var doneCount = 0;
    for (var m = 1; m <= 5; m++) {
      if ((Number(stars[prevPrefix + m]) || 0) >= 1) doneCount++;
    }
    return doneCount >= 4;
  }

  function getUnlockedZonesCount() {
    var count = 1;
    for (var z = 2; z <= 4; z++) {
      if (isZoneUnlocked(z)) count = z;
    }
    return count;
  }

  function isZoneChestReady(zoneNum) {
    if (!state.session || !state.session.doc) return false;
    var g = state.session.grade || 3;
    var prefix = 'g' + g + '-z' + zoneNum + '-m';
    var stars = state.session.doc.stars || {};
    for (var m = 1; m <= 5; m++) {
      if ((Number(stars[prefix + m]) || 0) < 1) return false;
    }
    return true;
  }

  var monsterSvgCache = {};
  function renderMonsterHtml(size, extraEquipped, plain) {
    if (!state.session || !state.session.student) return '🐣';
    var prof = state.session.student.monsterProfile || {};
    var eq = Object.assign({}, prof.equipped || {}, (state.session.doc && state.session.doc.look) || {}, extraEquipped || {});
    var mInfo = calcMonsterLevel(getEffectiveXP());
    var color = prof.baseColor || 'blue';
    var s = size || 96;
    var cacheKey = mInfo.stageKey + '_' + color + '_' + s + '_' + (plain ? 'p_' : '') + JSON.stringify(eq);
    if (monsterSvgCache[cacheKey]) return monsterSvgCache[cacheKey];

    if (root.MonsterRenderer && typeof root.MonsterRenderer.renderMonsterSVG === 'function') {
      var svg = root.MonsterRenderer.renderMonsterSVG({
        stage: mInfo.stageKey,
        color: color,
        equipped: eq,
        size: s,
        animated: true,
        isAvatar: !!plain
      });
      monsterSvgCache[cacheKey] = svg;
      return svg;
    }
    return '<div style="font-size:3rem">🐣</div>';
  }

  /* Award XP within today's daily cap & check streak + level-up */
  function awardIslandXP(rawAmount, missionId) {
    var ses = state.session;
    if (!ses || !ses.doc) return { added: 0, capped: false, leveledUp: false, streakBonus: 0 };
    var doc = ses.doc;
    var today = root.IslandSync.todayStr();
    var yesterday = root.IslandSync.yesterdayStr(today);
    var beforeInfo = calcMonsterLevel(getEffectiveXP());

    if (!doc.days) doc.days = {};
    if (!doc.days[today]) doc.days[today] = { xp: 0, missions: [] };

    /* Update streak on first activity today */
    var streakBonus = 0;
    if (doc.lastDay !== today) {
      if (doc.lastDay === yesterday) {
        doc.streak = (Number(doc.streak) || 0) + 1;
      } else {
        doc.streak = 1;
      }
      doc.lastDay = today;

      if (!doc.streakBonuses) doc.streakBonuses = {};
      if (doc.streak === 3 && !doc.streakBonuses['s3_' + today]) {
        doc.streakBonuses['s3_' + today] = true;
        streakBonus = 3;
      } else if (doc.streak >= 7 && doc.streak % 7 === 0 && !doc.streakBonuses['s7_' + today]) {
        doc.streakBonuses['s7_' + today] = true;
        streakBonus = 5;
      }
    }

    var cap = Number(ses.cap) || (ses.star ? 45 : 30);
    var currentToday = Number(doc.days[today].xp) || 0;
    var room = Math.max(0, cap - currentToday);
    var totalWanted = Math.max(0, (Number(rawAmount) || 0) + streakBonus);
    var added = Math.min(room, totalWanted);

    doc.days[today].xp = currentToday + added;
    if (missionId && doc.days[today].missions.indexOf(missionId) === -1) {
      doc.days[today].missions.push(missionId);
    }

    var afterInfo = calcMonsterLevel(getEffectiveXP());
    var leveledUp = afterInfo.level > beforeInfo.level;

    root.IslandSync.saveIslandDoc(ses);
    return {
      added: added,
      capped: added < totalWanted || doc.days[today].xp >= cap,
      leveledUp: leveledUp,
      newLevelInfo: afterInfo,
      streakBonus: streakBonus
    };
  }

  /* Render Top Bar */
  function renderTopBar() {
    var bar = document.getElementById('isl-topbar');
    if (!bar) return;
    if (!state.session || state.session.status !== 'ok') {
      bar.innerHTML = '<div class="isl-pupil-chip"><span class="isl-pupil-name">🏝️ Practice Island</span></div>';
      return;
    }

    var ses = state.session;
    var xp = getEffectiveXP();
    var mInfo = calcMonsterLevel(xp);
    var todayXP = getTodayXP();
    var cap = Number(ses.cap) || (ses.star ? 45 : 30);
    var streak = Number(ses.doc && ses.doc.streak) || 0;
    var muted = root.IslandAudio && root.IslandAudio.isMuted();

    var demoSwitcher = '';
    if (ses.isDemo) {
      var curId = ses.student.id;
      demoSwitcher =
        '<div class="isl-stats-row" data-testid="demo-switcher">' +
          '<button type="button" class="isl-btn ' + (curId === 'demo-g3' ? 'cyan' : '') + '" style="min-height:38px;padding:4px 10px;font-size:0.84rem" onclick="IslandApp.switchDemo(\'demo-g3\')">G3</button>' +
          '<button type="button" class="isl-btn ' + (curId === 'demo-g4' ? 'cyan' : '') + '" style="min-height:38px;padding:4px 10px;font-size:0.84rem" onclick="IslandApp.switchDemo(\'demo-g4\')">G4</button>' +
          '<button type="button" class="isl-btn ' + (curId === 'demo-star' ? 'amber' : '') + '" style="min-height:38px;padding:4px 10px;font-size:0.84rem" onclick="IslandApp.switchDemo(\'demo-star\')">⭐ Star</button>' +
        '</div>';
    }

    bar.innerHTML =
      '<div class="isl-pupil-chip">' +
        '<div class="isl-avatar-mini">' + renderMonsterHtml(40) + '</div>' +
        '<div class="isl-pupil-meta">' +
          '<span class="isl-pupil-name">' + esc(ses.student.firstName || ses.student.name) + '</span>' +
          '<span class="isl-pupil-lvl">Lv.' + mInfo.level + ' · ' + esc(mInfo.stageName) + ' (' + xp + (mInfo.nextXP ? '/' + mInfo.nextXP : '') + ' XP)</span>' +
          '<div class="isl-lvl-bar" style="width:115px;height:5px;background:rgba(15,23,42,0.9);border-radius:99px;overflow:hidden;margin-top:2px">' +
            '<div class="isl-lvl-bar-fill" style="height:100%;width:' + mInfo.pctToNext + '%;background:linear-gradient(90deg,#38bdf8,#10b981)"></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      demoSwitcher +
      '<div class="isl-stats-row">' +
        (ses.star ? '<div class="isl-pill star-badge" id="isl-star-pill"><img src="art/o_star_path.webp" alt=""><span>✨ Star Path</span></div>' : '') +
        (!navigator.onLine ? '<div class="isl-pill" id="isl-offline-pill" style="background:rgba(234,88,12,0.25);border-color:#fb923c;color:#fdba74"><span>📶 Offline</span></div>' : '') +
        '<div class="isl-pill streak" id="isl-streak-pill"><img src="art/o_flame.webp" alt=""><span>' + streak + 'd</span></div>' +
        '<div class="isl-pill xp-cap" id="isl-xp-pill"><span>⚡ ' + todayXP + '/' + cap + ' XP</span></div>' +
      '</div>' +
      '<div class="isl-actions-row">' +
        '<button type="button" class="isl-btn cyan" id="isl-btn-world" onclick="location.href=\'world.html\' + (location.search || \'?demo=1\')" title="Explore 2D Island World">🌍 World</button>' +
        (ses.wallOff || !root.IslandWall ? '' : '<button type="button" class="isl-btn wall-btn" id="isl-btn-wall" onclick="IslandWall.open()" title="Class Plaza">🌟 Plaza</button>') +
        '<button type="button" class="isl-btn amber" id="isl-btn-book" onclick="IslandRewards.openStickerBook()" title="Sticker Book">📒 Book</button>' +
        '<button type="button" class="isl-btn emerald" id="isl-btn-corner" onclick="IslandRewards.openCorner()" title="My Beach Camp">🏖️ Camp</button>' +
        '<button type="button" class="isl-btn violet" id="isl-btn-dress" onclick="IslandApp.openDressingRoom()">👕 Dress</button>' +
        '<button type="button" class="isl-btn" id="isl-btn-mute" onclick="IslandApp.toggleMute()" title="Sound On/Off">' + (muted ? '🔇' : '🔊') + '</button>' +
        '<button type="button" class="isl-btn" id="isl-btn-home" onclick="IslandApp.goHome()" title="Platform Home">🏠</button>' +
      '</div>';
  }

  /* Render Main Island Map */
  /* ---------- the map: 1. the island with four big places + Social World Hub ---------- */
  var MAP_PLACES = { 1: { x: 22, y: 33 }, 2: { x: 78, y: 31 }, 3: { x: 22, y: 72 }, 4: { x: 78, y: 72 } };
  var ZONE_MAP_PROP = { 1: 'z1/o_robot', 2: 'z2/o_lighthouse_on', 3: 'z3/o_market_open', 4: 'z4/o_rocket' };
  var FRIEND_SPOTS = [{ x: 40, y: 36 }, { x: 60, y: 36 }, { x: 50, y: 25 }];

  function regularMissions(zoneNum) {
    return root.IslandData.getZoneMissions(state.session.grade || 3, zoneNum, false).regular;
  }
  function doneCount(missions) {
    var stars = (state.session.doc && state.session.doc.stars) || {};
    return missions.filter(function (m) { return (Number(stars[m.id]) || 0) > 0; }).length;
  }
  /* the place to play next: the first open zone with a mission or chest still to do */
  function currentZone() {
    var chests = (state.session.doc && state.session.doc.chests) || {};
    for (var z = 4; z >= 1; z--) {
      if (isZoneUnlocked(z)) {
        for (var k = 1; k <= z; k++) {
          if (doneCount(regularMissions(k)) < 5 || !chests['z' + k]) return k;
        }
        return z;
      }
    }
    return 1;
  }

  /* Glowing stepping-stone trail dots inside a Zone (never floating paw emojis across the main island sky/ocean). */
  function layPaws() {
    var wrap = document.getElementById('isl-map-wrap');
    if (!wrap) return;
    [].forEach.call(wrap.querySelectorAll('.mp-paw'), function (p) { p.remove(); });
    var zone = wrap.classList.contains('mp-zone');
    if (!zone) return;
    var stops = [].slice.call(wrap.querySelectorAll('.mp-stop'));
    var box = wrap.getBoundingClientRect();
    var rel = function (r) { return { l: r.left - box.left, t: r.top - box.top, r: r.right - box.left, b: r.bottom - box.top }; };
    var blocks = [].map.call(wrap.querySelectorAll('.mp-stop-disc,.mp-stop-title,.mp-stop-stars,.mp-friend,.mp-starpath,.mp-back,.mp-zone-name'), function (e) { return rel(e.getBoundingClientRect()); });
    var size = Math.max(10, Math.min(14, box.width * 0.009));
    var step = size * 2.2, html = '';
    var blocked = function (x, y) {
      var m = size * 0.4;
      return blocks.some(function (r) { return x > r.l - m && x < r.r + m && y > r.t - m && y < r.b + m; });
    };
    for (var i = 0; i < stops.length - 1; i++) {
      var A = stops[i].querySelector('.mp-stop-disc').getBoundingClientRect();
      var B = stops[i + 1].querySelector('.mp-stop-disc').getBoundingClientRect();
      var ax = A.left + A.width / 2 - box.left, ay = A.top + A.height / 2 - box.top, bx = B.left + B.width / 2 - box.left, by = B.top + B.height / 2 - box.top;
      var dx = bx - ax, dy = by - ay, len = Math.sqrt(dx * dx + dy * dy);
      if (!len) continue;
      var count = Math.floor(len / step);
      var walked = stops[i].classList.contains('done');
      for (var k = 1; k < count; k++) {
        var t = k / count;
        var arc = Math.sin(t * Math.PI) * 10 * (i % 2 ? 1 : -1);
        var x = ax + dx * t, y = ay + dy * t + arc;
        if (blocked(x, y)) continue;
        html += '<span class="mp-paw' + (walked ? ' walked' : '') + '" style="left:' + x.toFixed(0) + 'px;top:' + y.toFixed(0) + 'px;width:' + size.toFixed(0) + 'px;height:' + size.toFixed(0) + 'px"></span>';
      }
    }
    wrap.insertAdjacentHTML('afterbegin', html);
  }
  var pawTimer = 0;
  root.addEventListener('resize', function () { clearTimeout(pawTimer); pawTimer = setTimeout(layPaws, 150); });

  function walkMap(ev) {
    if (!ev || ev.target.closest('button') || ev.target.closest('.isl-shore-bottle') || ev.target.closest('a')) return;
    var wrap = document.getElementById('isl-map-wrap');
    var mon = document.getElementById('isl-map-monster');
    if (!wrap || !mon || wrap.classList.contains('mp-zone')) return;
    var r = wrap.getBoundingClientRect();
    var x = Math.round(((ev.clientX - r.left) / r.width) * 100);
    var y = Math.round(((ev.clientY - r.top) / r.height) * 100);
    x = Math.max(14, Math.min(86, x));
    y = Math.max(22, Math.min(86, y));
    var prev = state.walkPos || { x: 50, y: 64 };
    var dir = (x < prev.x - 1) ? -1 : ((x > prev.x + 1) ? 1 : (state.walkDir || 1));
    state.walkDir = dir;
    state.walkPos = { x: x, y: y };
    mon.style.setProperty('--x', x);
    mon.style.setProperty('--y', y);
    mon.style.setProperty('--dir', dir);
    mon.classList.remove('mon-hop');
    void mon.offsetWidth;
    mon.classList.add('mon-hop');
    var svgEl = mon.querySelector('svg');
    if (svgEl && root.MonsterRenderer && root.MonsterRenderer.play) {
      root.MonsterRenderer.play(svgEl, 'cheer', { stay: true, speed: 1.35 });
    }
    var ring = document.createElement('span');
    ring.className = 'mp-tap-ring';
    ring.style.left = x + '%';
    ring.style.top = y + '%';
    wrap.appendChild(ring);
    setTimeout(function () { if (ring && ring.parentNode) ring.parentNode.removeChild(ring); }, 520);
    root.IslandAudio.playHop();
    var b = document.getElementById('isl-map-mon-bubble');
    if (b) {
      var cheers = ['✨ Wheee!', "🌴 Let's explore!", '👋 Hi friends!', '⭐ Adventure!'];
      b.textContent = cheers[Math.floor(Math.random() * cheers.length)];
      b.style.display = 'block';
      clearTimeout(state._walkBubbleTimer);
      state._walkBubbleTimer = setTimeout(function () { if (b) b.style.display = 'none'; }, 1400);
    }
  }

  function islandScreenHtml(dailyBannerHtml, pipTipHtml, today) {
    var ses = state.session, g = ses.grade || 3, cur = currentZone();
    var chests = (ses.doc && ses.doc.chests) || {};
    var placesHtml = root.IslandData.ZONES.map(function (z) {
      var open = isZoneUnlocked(z.num), t = z.titles[g] || z.titles[3], p = MAP_PLACES[z.num];
      var done = doneCount(regularMissions(z.num)), finished = !!chests['z' + z.num];
      var status = !open ? '🔒 Finish 4 in ' + esc((root.IslandData.ZONES[z.num - 2].titles[g] || {}).name || 'Zone ' + (z.num - 1))
        : finished ? '🐚 Done!' : '⭐ ' + done + ' / 5';
      var propImg = ZONE_MAP_PROP[z.num] || z.badge;
      return '<button type="button" class="mp-place' + (open ? '' : ' locked') + (open && z.num === cur ? ' next' : '') + (finished ? ' finished' : '') + '" id="zone-' + z.num + '" ' +
        'style="--x:' + p.x + ';--y:' + p.y + '" onclick="event.stopPropagation(); IslandApp.' + (open ? 'openZone' : 'tapLockedZone') + '(' + z.num + ')">' +
          '<span class="mp-place-pic"><img src="art/' + propImg + '.webp" alt="">' +
            '<span class="mp-place-friend">' + root.IslandStory.charPic(z.num) + '</span></span>' +
          '<span class="mp-place-label"><b>' + esc(t.name) + '</b><small>' + esc(t.sub) + '</small><em>' + status + '</em></span>' +
        '</button>';
    }).join('');

    /* Social World Hub: Class Plaza + Live Classmates on the Map + My Beach Camp */
    var socialHtml = '';
    if (!ses.wallOff && root.IslandWall) {
      var friends = (root.IslandWall.peekFriends && root.IslandWall.peekFriends()) || [];
      var hasGifts = !!(root.IslandWall.hasGifts && root.IslandWall.hasGifts());
      var friendsHtml = friends.map(function (f, idx) {
        var sp = FRIEND_SPOTS[idx] || { x: 50, y: 25 };
        return '<button type="button" class="mp-classmate" id="map-friend-' + esc(f.id) + '" style="--x:' + sp.x + ';--y:' + sp.y + '" ' +
          'onclick="event.stopPropagation(); IslandWall.openFriend(\'' + esc(f.id) + '\')" title="Visit ' + esc(f.first_name) + '\'s Beach Camp">' +
            '<span class="mp-classmate-mon">' + f.picHtml + '</span>' +
            '<span class="mp-classmate-tag">👋 ' + esc(f.first_name) + '</span>' +
          '</button>';
      }).join('');
      socialHtml +=
        friendsHtml +
        '<button type="button" class="mp-hub mp-hub-plaza" id="isl-hub-plaza" style="--x:50;--y:45" onclick="event.stopPropagation(); IslandWall.open()">' +
          '<span class="mp-hub-pic"><img src="art/d_flag.webp" alt="">' +
            (hasGifts ? '<span class="mp-hub-badge">🎁 Gift!</span>' : '') +
          '</span>' +
          '<span class="mp-hub-label"><b>🌟 Class Plaza</b><small>Hangout · Board · Teams</small></span>' +
        '</button>';
    }

    var cornerCount = ((ses.doc && ses.doc.world && ses.doc.world.placed) || (ses.doc && ses.doc.corner && ses.doc.corner.items) || []).length || 4, campSearch = root.location.search ? (root.location.search + '&zone=0') : '?demo=1&zone=0';
    var campHtml =
      '<button type="button" class="mp-hub mp-hub-camp" id="isl-hub-camp" style="--x:50;--y:70" onclick="event.stopPropagation(); location.href=\'world.html\' + ' + JSON.stringify(campSearch).replace(/"/g, "'") + '">' +
        '<span class="mp-hub-pic"><img src="art/d_hut.webp" alt=""></span>' +
        '<span class="mp-hub-label"><b>🏡 My Home Island</b><small>2D House · Craft · Decorate (' + cornerCount + ' 🌴)</small></span>' +
      '</button>';

    var cp = state.walkPos || { x: (MAP_PLACES[cur].x < 50 ? MAP_PLACES[cur].x + 11 : MAP_PLACES[cur].x - 11), y: MAP_PLACES[cur].y + 4 };
    state.monsterPos = { left: cp.x + '%', top: cp.y + '%' };
    var monsterHtml =
      '<div class="isl-map-monster mp-monster" id="isl-map-monster" style="--x:' + cp.x + ';--y:' + cp.y + '" onclick="event.stopPropagation(); IslandApp.pokeMonster()">' +
        '<div class="isl-map-mon-bubble" id="isl-map-mon-bubble" style="display:none"></div>' +
        '<div class="isl-map-monster-sprite">' + renderMonsterHtml(86, null, true) + '</div>' +
      '</div>';
    var bottleHtml = (!ses.doc.bottleSeen || !ses.doc.bottleSeen[today])
      ? '<div class="isl-shore-bottle mp-bottle" id="isl-shore-bottle" onclick="event.stopPropagation(); IslandRewards.openBottleModal()"><img src="art/o_bottle.webp" alt="Message in a Bottle"><span class="isl-bottle-tag">Pip\'s Note!</span></div>'
      : '';
    return '<div class="isl-map-wrap mp-wrap" id="isl-map-wrap" onclick="IslandApp.walkMap(event)">' +
      pipTipHtml + dailyBannerHtml + placesHtml + socialHtml + campHtml + monsterHtml + bottleHtml +
      '<div class="gm-map-pip mp-pip"><button type="button" class="gm-map-pip-btn" id="gm-pip" onclick="event.stopPropagation(); IslandApp.tapPip()" aria-label="Captain Pip">' + root.IslandStory.charPic('pip') + '</button><div class="gm-bubble gm-bubble-mini" id="gm-pip-line" style="display:none"></div></div>' +
      shellsHtml() +
    '</div>';
  }

  /* ---------- the map: 2. one place, with a clear grounded trail ---------- */
  var TRAIL = [{ x: 11, y: 72, px: 22, py: 82 }, { x: 26, y: 52, px: 76, py: 71 }, { x: 42, y: 70, px: 24, py: 60 }, { x: 58, y: 52, px: 76, py: 49 }, { x: 74, y: 68, px: 24, py: 38 }, { x: 89, y: 50, px: 76, py: 26 }];
  var ZONE_BG = { 1: 'art/z1/bg_factory.webp', 2: 'art/z2/bg_beach.webp', 3: 'art/z3/bg_river.webp', 4: 'art/z4/bg_volcano.webp' };
  var ZONE_FOCUS = { 2: '82% 28%', 3: '20% 72%', 4: '76% 66%' };

  function zoneScreenHtml(zoneNum) {
    var ses = state.session, g = ses.grade || 3, z = root.IslandData.ZONES[zoneNum - 1], t = z.titles[g] || z.titles[3];
    var zm = root.IslandData.getZoneMissions(g, zoneNum, ses.star);
    var stars = (ses.doc && ses.doc.stars) || {}, chests = (ses.doc && ses.doc.chests) || {};
    var nextIdx = -1;
    zm.regular.some(function (m, i) { if (!(Number(stars[m.id]) || 0)) { nextIdx = i; return true; } return false; });
    var stopsHtml = zm.regular.map(function (m, i) {
      var n = Number(stars[m.id]) || 0, plot = root.IslandStory.plotOf(m.id) || m, p = TRAIL[i];
      var iconHtml = plot.pic ? '<img src="art/' + esc(plot.pic) + '.webp" alt="">' : esc(plot.icon);
      return '<button type="button" class="mp-stop' + (n ? ' done' : '') + (i === nextIdx ? ' next' : '') + '" id="pin-' + esc(m.id) + '" ' +
        'style="--x:' + p.x + ';--y:' + p.y + ';--px:' + p.px + ';--py:' + p.py + '" onclick="IslandApp.tapPin(\'' + esc(m.id) + '\',' + zoneNum + ',false,this)">' +
          '<span class="mp-stop-disc"><span class="mp-stop-icon">' + iconHtml + '</span><i>' + (i + 1) + '</i></span>' +
          '<span class="mp-stop-title">' + esc(plot.title) + '</span>' +
          '<span class="mp-stop-stars">' + (n ? '★'.repeat(n) + '☆'.repeat(3 - n) : '') + '</span>' +
        '</button>';
    }).join('');
    var opened = !!chests['z' + zoneNum], ready = !opened && isZoneChestReady(zoneNum), cp = TRAIL[5];
    var chestHtml = '<button type="button" class="mp-stop mp-chest' + (ready ? ' next' : '') + (opened ? ' done' : '') + '" id="chest-z' + zoneNum + '" style="--x:' + cp.x + ';--y:' + cp.y + ';--px:' + cp.px + ';--py:' + cp.py + '" onclick="IslandApp.tapChest(' + zoneNum + ')">' +
      '<span class="mp-stop-disc"><img src="art/' + (opened ? 'o_chest_open' : 'o_chest') + '.webp" alt=""></span><span class="mp-stop-title">Treasure</span></button>';
    var at = TRAIL[nextIdx >= 0 ? nextIdx : 5];
    var monsterHtml = '<div class="mp-walker" style="--x:' + at.x + ';--y:' + at.y + ';--px:' + at.px + ';--py:' + at.py + '" onclick="IslandApp.pokeMonster()">' + renderMonsterHtml(86, null, true) + '</div>';
    var starHtml = '';
    if (ses.star) {
      starHtml = '<div class="mp-starpath"><b>✨</b>' + zm.star.map(function (sm) {
        var n = Number(stars[sm.id]) || 0;
        return '<button type="button" class="mp-stone' + (n ? ' done' : '') + '" id="pin-' + esc(sm.id) + '" onclick="IslandApp.tapPin(\'' + esc(sm.id) + '\',' + zoneNum + ',true,this)" title="' + esc(sm.title) + '">' + sm.num + '<small>' + (n ? '★'.repeat(n) : '') + '</small></button>';
      }).join('') + '</div>';
    }
    var bgStyle = ZONE_BG[zoneNum] ? 'background-image:url(' + ZONE_BG[zoneNum] + ')' : 'background-image:url(art/bg_island.webp);background-size:260%;background-position:' + (ZONE_FOCUS[zoneNum] || 'center');
    var tip = nextIdx >= 0 ? 'Tap the glowing stop!' : (ready ? 'Open the treasure!' : (opened ? 'Thank you, friend!' : 'Well done!'));
    return '<div class="isl-map-wrap mp-wrap mp-zone" id="isl-map-wrap" style="' + bgStyle + '">' +
      '<header class="mp-zone-top"><button type="button" class="mp-back" onclick="IslandApp.closeZone()">◀ 🏝️</button><div class="mp-zone-name"><b>' + esc(t.name) + '</b><small>' + esc(t.sub) + '</small></div></header>' +
      stopsHtml + chestHtml + monsterHtml +
      '<div class="mp-friend"><div class="gm-bubble gm-bubble-mini">' + esc(tip) + '</div><button type="button" class="gm-map-pip-btn" onclick="IslandApp.tapZoneFriend(' + zoneNum + ')" aria-label="' + esc(root.IslandStory.CHARS[zoneNum].name) + '">' + root.IslandStory.charPic(zoneNum, '', nextIdx >= 0 ? 'idea' : 'happy') + '</button></div>' +
      starHtml +
    '</div>';
  }
  function openZone(zoneNum) { root.IslandAudio.playHop(); state.openZone = zoneNum; renderMap(); }
  function closeZone() { root.IslandAudio.playTap(); state.openZone = 0; renderMap(); }

  function renderMap() {
    var main = document.getElementById('isl-main');
    if (!main) return;
    if (!state.session || state.session.status !== 'ok') {
      renderCodeEntry(main);
      return;
    }
    if (document.body && document.body.classList.contains('w-page')) {
      main.innerHTML = '';
      return;
    }

    var ses = state.session;
    var g = ses.grade || 3;
    var starsMap = (ses.doc && ses.doc.stars) || {};
    var chestsMap = (ses.doc && ses.doc.chests) || {};
    var today = root.IslandSync.todayStr();
    var dailyDone = !!(ses.doc && ses.doc.dailyDone && ses.doc.dailyDone[today]);
    var todayXP = getTodayXP();
    var cap = Number(ses.cap) || (ses.star ? 45 : 30);

    var dailyBannerHtml =
      '<button type="button" class="isl-daily-card' + (dailyDone ? ' done' : '') + '" id="isl-daily-btn" onclick="IslandApp.startDailyQuest()">' +
        '<img src="art/o_gift.webp" alt="">' +
        '<div style="text-align:left">' +
          '<div style="font-size:1.05rem;font-weight:800;color:#fef08a">' + (dailyDone ? '✓ Come back tomorrow for a new gift' : '🎁 Today\'s Island Quest (+5 XP)') + '</div>' +
          '<div style="font-size:0.84rem;color:#cbd5e1">' + (todayXP >= cap ? 'Great work! Your monster is full of XP today. Come back tomorrow!' : (dailyDone ? 'You finished today\'s gift quest!' : '5 quick questions from your unlocked zones')) + '</div>' +
        '</div>' +
      '</button>';

    var pipTipHtml = (root.IslandRewards && root.IslandRewards.renderPipTipBanner) ? root.IslandRewards.renderPipTipBanner(ses.doc) : '';
    main.innerHTML = state.openZone && isZoneUnlocked(state.openZone)
      ? zoneScreenHtml(state.openZone)
      : islandScreenHtml(dailyBannerHtml, pipTipHtml, today);
    layPaws();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layPaws);
    preloadOpenZoneImages();
  }

  function preloadOpenZoneImages() {
    var maxZ = getUnlockedZonesCount();
    for (var i = 1; i <= maxZ; i++) {
      var z = root.IslandData.ZONES[i - 1];
      if (z && z.badge) {
        var img = new Image();
        img.src = 'art/' + z.badge + '.webp';
      }
    }
  }

  /* Friendly 6-Letter Code Entry Screen */
  function renderCodeEntry(container) {
    var errMsg = (state.session && state.session.status === 'invalid_code')
      ? '<p style="color:#fda4af;font-weight:700;margin:8px 0">Code "' + esc(state.session.code) + '" not found. Ask your teacher for your island link 🏝️</p>'
      : (state.session && state.session.message ? '<p style="color:#fde68a;font-weight:700">' + esc(state.session.message) + '</p>' : '');

    container.innerHTML =
      '<div class="isl-card-modal" id="isl-code-entry-card" style="max-width:520px;margin:40px auto;text-align:center">' +
        '<img src="art/z_meadow.webp" alt="" style="width:110px;height:110px;object-fit:contain">' +
        '<h1 style="margin:8px 0 6px;font-size:1.85rem">Ask your teacher for your island link 🏝️</h1>' +
        '<p style="color:#cbd5e1;font-size:1.05rem;margin:0 0 18px">Or type your 6-letter island code from your teacher card:</p>' +
        errMsg +
        '<form onsubmit="IslandApp.submitCode(event)" style="display:flex;flex-direction:column;gap:14px;align-items:center">' +
          '<input id="isl-code-input" type="text" maxlength="8" placeholder="K7P2QX" autocomplete="off" ' +
            'style="width:240px;text-align:center;font:800 1.8rem Fredoka,sans-serif;letter-spacing:4px;text-transform:uppercase;padding:12px 16px;border-radius:18px;border:3px solid #38bdf8;background:#0f172a;color:#fff">' +
          '<button type="submit" class="isl-btn emerald" style="width:240px;font-size:1.25rem">Go! 🚀</button>' +
        '</form>' +
      '</div>';
  }

  function submitCode(arg) {
    if (arg && arg.preventDefault) arg.preventDefault();
    var code = typeof arg === 'string' ? arg.trim().toUpperCase() : '';
    if (!code) {
      var inp = document.getElementById('isl-code-input');
      code = inp ? String(inp.value || '').trim().toUpperCase() : '';
    }
    if (!code) return Promise.resolve(null);
    root.IslandAudio.playTap();
    return root.IslandSync.loadLiveSession(code).then(function (ses) {
      state.session = ses;
      renderTopBar();
      renderMap();
      return ses;
    });
  }

  function pokeMonster() {
    root.IslandAudio.playCorrect();
    var lines = [
      'Let us practice English together!',
      'Tap a glowing pin to start a mission!',
      'You are doing an awesome job!'
    ];
    var pick = lines[Math.floor(Math.random() * lines.length)];
    root.IslandAudio.speak(pick);
  }

  function tapLockedZone(zoneNum) {
    root.IslandAudio.playSoftFail();
    root.IslandAudio.speak('Finish four missions in Zone ' + (zoneNum - 1) + ' to unlock this island zone!');
  }

  function tapChest(zoneNum) {
    if (!state.session || !state.session.doc) return;
    var key = 'z' + zoneNum;
    if (state.session.doc.chests && state.session.doc.chests[key]) {
      root.IslandAudio.playTap();
      root.IslandAudio.speak('You already opened this treasure chest!');
      return;
    }
    if (!isZoneChestReady(zoneNum)) {
      root.IslandAudio.playSoftFail();
      root.IslandAudio.speak('Complete all five missions in this zone to open the treasure chest!');
      return;
    }
    state.session.doc.chests = state.session.doc.chests || {};
    state.session.doc.chests[key] = true;
    var res = awardIslandXP(10, 'chest-' + key);
    if (root.IslandWall) root.IslandWall.news('zone', zoneNum);
    root.IslandAudio.playChest();
    root.IslandAudio.speak('Treasure chest opened! Plus ten XP!');
    if (res.leveledUp && root.IslandRewards && root.IslandRewards.launchFireworks) {
      root.IslandRewards.launchFireworks();
    }
    renderTopBar();
    renderMap();
    if (root.IslandRewards && root.IslandRewards.playZoneCutScene) {
      root.IslandRewards.playZoneCutScene(zoneNum, function () {
        showRewardModal({
          title: '🎉 Zone ' + zoneNum + ' Treasure Opened!',
          stars: 3,
          xpAdded: res.added,
          capped: res.capped,
          leveledUp: res.leveledUp,
          newLevelInfo: res.newLevelInfo,
          isChest: true
        });
      });
    } else {
      showRewardModal({
        title: '🎉 Zone ' + zoneNum + ' Treasure Opened!',
        stars: 3,
        xpAdded: res.added,
        capped: res.capped,
        leveledUp: res.leveledUp,
        newLevelInfo: res.newLevelInfo,
        isChest: true
      });
    }
  }

  /* Hop Monster to Pin & Open Mission */
  function tapPin(missionId, zoneNum, isStar, btnEl) {
    if (!state.session) return;
    root.IslandAudio.playHop();

    var zoneCfg = root.IslandData.ZONES[zoneNum - 1];
    if (zoneCfg) {
      var baseLeft = parseFloat(zoneCfg.pos.left) || 22;
      var baseTop = parseFloat(zoneCfg.pos.top) || 26;
      state.monsterPos = { left: Math.max(8, baseLeft - 10) + '%', top: (baseTop + 14) + '%' };
      var mEl = document.getElementById('isl-map-monster');
      if (mEl) {
        mEl.style.left = state.monsterPos.left;
        mEl.style.top = state.monsterPos.top;
      }
    }

    var g = state.session.grade || 3;
    var zMissions = root.IslandData.getZoneMissions(g, zoneNum, !!isStar);
    var pool = isStar ? zMissions.star : zMissions.regular;
    var mission = pool.filter(function (m) { return m.id === missionId; })[0];
    if (!mission) return;

    setTimeout(function () {
      startMission(mission);
    }, 220);
  }

  function startDailyQuest() {
    if (!state.session) return;
    var today = root.IslandSync.todayStr();
    if (state.session.doc && state.session.doc.dailyDone && state.session.doc.dailyDone[today]) {
      root.IslandAudio.playTap();
      root.IslandAudio.speak('Come back tomorrow for a new gift!');
      return;
    }
    root.IslandAudio.playTap();
    var wq = (state.session.doc && state.session.doc.wrongQueue) || [];
    var dq = root.IslandData.getDailyQuest(state.session.grade || 3, today, getUnlockedZonesCount(), wq);
    startMission(dq);
  }

  function recordWrongQuestion(q) {
    if (!state.session || !state.session.doc || !q) return;
    if (!Array.isArray(state.session.doc.wrongQueue)) state.session.doc.wrongQueue = [];
    if (q.type === 'read' || q.type === 'listen') {
      state.session.doc.wrongQueue.push(q);
      if (state.session.doc.wrongQueue.length > 15) {
        state.session.doc.wrongQueue = state.session.doc.wrongQueue.slice(-15);
      }
    }
    if (root.IslandRewards && root.IslandRewards.recordWrongWord) {
      var word = q.a || q.word || '';
      var meaning = q.prompt || q.def || q.meaning || 'the answer';
      if (word) {
        root.IslandRewards.recordWrongWord(state.session.doc, word, meaning);
      }
    }
  }

  /* Start a Mission (Regular, Star Path, or Daily Quest) */
  function startMission(mission) {
    var totalSteps = mission.questions ? mission.questions.length : 6;
    state.missionRun = {
      mission: mission,
      qIndex: 0,
      total: totalSteps,
      firstTryCorrect: 0,
      hadWrongOnCurrent: false,
      buildPlaced: [],
      buildBank: [],
      matchSelectedLeft: null,
      matchDonePairs: {},
      sayUnlocked: false,
      sayHeardText: ''
    };
    var run = state.missionRun;
    run.zone = root.IslandGames.zoneOf(mission, getUnlockedZonesCount());
    var steps = noStory() ? [] : root.IslandStory.missionSteps(mission, state.session && state.session.doc);
    root.IslandStory.showScene({
      steps: steps,
      lastLabel: "Let's play! 🎮",
      onDone: function () {
        if (state.missionRun !== run) return;
        root.IslandAudio.startAmbient(run.zone);
        prepareCurrentStep();
        renderMissionModal();
      }
    });
  }

  function noStory() {
    return new URLSearchParams(root.location.search).get('nostory') === '1';
  }

  function advOn(run) { return !!(root.IslandAdventure && root.IslandAdventure.handles(run)); }

  function prepareCurrentStep() {
    var run = state.missionRun;
    if (!run) return;
    run.hadWrongOnCurrent = false;
    run.sayUnlocked = false;
    run.sayHeardText = '';
    run.locked = false;

    var m = run.mission;
    var q = m.questions[run.qIndex];
    if (!q) return;

    var qType = q.type || m.type;
    if (qType === 'build') {
      var words = (q.order || []).slice();
      if (q.starterFirstWord && words.length >= 2) {
        run.buildPlaced = [words[0]];
        var rest = words.slice(1);
        run.buildBank = shuffleArray(rest);
      } else {
        run.buildPlaced = [];
        run.buildBank = shuffleArray(words);
      }
    }

    if ((qType === 'listen' || q.autoSpeak) && !advOn(run)) {
      setTimeout(function () {
        if (state.missionRun === run) {
          root.IslandAudio.speak(q.speak || q.word || q.q || q.text);
        }
      }, 150);
    }
  }

  function shuffleArray(arr) {
    var out = arr.slice();
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = out[i]; out[i] = out[j]; out[j] = tmp;
    }
    if (out.length > 1 && out.join(' ') === arr.join(' ')) {
      var t = out[0]; out[0] = out[1]; out[1] = t;
    }
    return out;
  }

  function renderMissionModal() {
    var modalRoot = document.getElementById('isl-modal-root');
    if (!modalRoot) return;
    var run = state.missionRun;
    if (!run) {
      modalRoot.innerHTML = '';
      return;
    }

    var m = run.mission;
    var q = m.questions[run.qIndex];
    var qType = (q && q.type) || m.type;
    if (advOn(run)) { root.IslandAdventure.render(run, q, qType, renderMonsterHtml(220, null, true)); return; }
    var pct = Math.round(((run.qIndex + 1) / run.total) * 100);

    var bodyHtml = '';
    if (qType === 'listen') {
      var opts = q.options || [q.a];
      bodyHtml =
        '<div class="isl-q-box">' +
          '<div class="isl-q-pic">' + esc(q.pic || '🎧') + '</div>' +
          '<div class="isl-q-text">' + esc(q.prompt || 'Listen and tap the matching word!') + '</div>' +
          '<button type="button" class="isl-btn cyan" id="isl-listen-btn" onclick="IslandApp.replayMissionAudio()">🔊 Listen Again</button>' +
        '</div>' +
        '<div class="isl-opts-grid">' +
          opts.map(function (opt, idx) {
            var audioIcon = m.isStar ? '<span class="isl-opt-speaker" onclick="event.stopPropagation(); IslandApp.speakText(\'' + esc(opt) + '\')">🔊</span> ' : '';
            return '<button type="button" class="isl-btn isl-opt-btn" data-opt="' + esc(opt) + '" onclick="IslandApp.pickOption(' + idx + ',this)">' + audioIcon + esc(opt) + '</button>';
          }).join('') +
        '</div>';
    } else if (qType === 'read') {
      var rOpts = q.options || [q.a];
      bodyHtml =
        '<div class="isl-q-box">' +
          '<div class="isl-q-pic">' + esc(q.pic || '📖') + '</div>' +
          '<div class="isl-q-text">' + esc(q.q) + '</div>' +
          '<button type="button" class="isl-btn" style="min-height:44px;padding:6px 14px;font-size:0.92rem" onclick="IslandApp.replayMissionAudio()">🔊 Hear Sentence</button>' +
        '</div>' +
        '<div class="isl-opts-grid">' +
          rOpts.map(function (opt, idx) {
            var audioIcon = m.isStar ? '<span class="isl-opt-speaker" onclick="event.stopPropagation(); IslandApp.speakText(\'' + esc(opt) + '\')">🔊</span> ' : '';
            return '<button type="button" class="isl-btn isl-opt-btn" data-opt="' + esc(opt) + '" onclick="IslandApp.pickOption(' + idx + ',this)">' + audioIcon + esc(opt) + '</button>';
          }).join('') +
        '</div>';
    } else if (qType === 'match') {
      /* Show 4 pairs on screen (or all pairs if 4) */
      var allPairs = m.pairs || m.questions || [];
      var boardPairs = allPairs.slice(0, Math.min(4, allPairs.length));
      if (run.qIndex >= 4 && allPairs.length > 4) {
        boardPairs = allPairs.slice(2, 6);
      }
      var rightOrder = boardPairs.slice().sort(function (a, b) { return a.word.localeCompare(b.word); });
      bodyHtml =
        '<div class="isl-q-box">' +
          '<div class="isl-q-text" style="margin:2px 0">Tap a word on the left, then tap its meaning on the right!</div>' +
        '</div>' +
        '<div class="isl-match-cols">' +
          '<div class="isl-match-col">' +
            boardPairs.map(function (p) {
              var done = !!run.matchDonePairs[p.word];
              var sel = run.matchSelectedLeft === p.word;
              return '<button type="button" class="isl-btn isl-match-tile' + (done ? ' matched' : (sel ? ' selected' : '')) + '" ' +
                'data-word="' + esc(p.word) + '" onclick="IslandApp.tapMatchLeft(\'' + esc(p.word) + '\')">🔊 ' + esc(p.word) + '</button>';
            }).join('') +
          '</div>' +
          '<div class="isl-match-col">' +
            rightOrder.map(function (p) {
              var done = !!run.matchDonePairs[p.word];
              return '<button type="button" class="isl-btn isl-match-tile' + (done ? ' matched' : '') + '" ' +
                'data-match="' + esc(p.word) + '" onclick="IslandApp.tapMatchRight(\'' + esc(p.word) + '\',this)">' + esc(p.meaning) + '</button>';
            }).join('') +
          '</div>' +
        '</div>';
    } else if (qType === 'build') {
      bodyHtml =
        '<div class="isl-q-box">' +
          '<div class="isl-q-pic">' + esc(q.pic || '🧩') + '</div>' +
          '<div class="isl-q-text">Tap the words in order to build the sentence!</div>' +
          '<button type="button" class="isl-btn" style="min-height:44px;padding:6px 14px;font-size:0.92rem" onclick="IslandApp.replayMissionAudio()">🔊 Hear Clue</button>' +
        '</div>' +
        '<div class="isl-sentence-tray" id="isl-build-tray">' +
          (run.buildPlaced.length === 0
            ? '<span style="color:#94a3b8;font-weight:600">Tap words below to place them here…</span>'
            : run.buildPlaced.map(function (w, idx) {
                return '<button type="button" class="isl-btn cyan isl-word-chip" onclick="IslandApp.unplaceBuildWord(' + idx + ')">' + esc(w) + '</button>';
              }).join('')) +
        '</div>' +
        '<div class="isl-word-bank" id="isl-build-bank">' +
          run.buildBank.map(function (w, idx) {
            return '<button type="button" class="isl-btn isl-word-chip" data-word="' + esc(w) + '" onclick="IslandApp.placeBuildWord(' + idx + ',this)">' + esc(w) + '</button>';
          }).join('') +
        '</div>';
    } else if (qType === 'say') {
      bodyHtml =
        '<div class="isl-q-box">' +
          '<div class="isl-q-pic">' + esc(q.pic || '🎤') + '</div>' +
          '<div class="isl-q-text">“' + esc(q.text) + '”</div>' +
          '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:14px">' +
            '<button type="button" class="isl-btn cyan" id="isl-say-listen-btn" onclick="IslandApp.listenForSay()">🔊 1. Listen</button>' +
            '<button type="button" class="isl-btn emerald' + (run.sayUnlocked ? '' : ' disabled') + '" id="isl-say-done-btn" ' +
              (run.sayUnlocked ? '' : 'disabled ') + 'onclick="IslandApp.completeSayStep()">🎤 2. I said it ✓</button>' +
          '</div>' +
          (run.sayHeardText ? '<div style="margin-top:10px;color:#6ee7b7;font-weight:700">' + esc(run.sayHeardText) + '</div>' : '<div style="margin-top:10px;color:#cbd5e1;font-size:0.95rem">Tap Listen first, then say the sentence aloud!</div>') +
        '</div>';
    }

    bodyHtml = root.IslandGames.render(run, q, qType, renderMonsterHtml(100), bodyHtml, getUnlockedZonesCount());

    modalRoot.innerHTML =
      '<div class="isl-modal-backdrop" id="isl-mission-backdrop">' +
        '<div class="isl-card-modal mission-bg gm-card">' +
          '<div class="isl-mission-top">' +
            '<div style="font-size:1.2rem;font-weight:800">' + esc(m.icon || '🌟') + ' ' + esc(m.title) + '</div>' +
            '<div class="isl-progress-track"><div class="isl-progress-fill" style="width:' + pct + '%"></div></div>' +
            '<div class="isl-progress-label" id="isl-step-counter">' + (run.qIndex + 1) + ' / ' + run.total + '</div>' +
            '<button type="button" class="isl-btn" style="min-height:44px;min-width:44px;padding:6px 12px" onclick="IslandApp.closeModal()">✕</button>' +
          '</div>' +
          bodyHtml +
        '</div>' +
      '</div>';

    if (root.IslandRewards && root.IslandRewards.maybeSpawnGoldenFish) {
      var card = modalRoot.querySelector('.isl-card-modal');
      if (card) root.IslandRewards.maybeSpawnGoldenFish(card);
    }
  }

  function replayMissionAudio() {
    var run = state.missionRun;
    if (!run) return;
    var q = run.mission.questions[run.qIndex];
    if (!q) return;
    if (advOn(run)) { root.IslandAudio.speak(root.IslandAdventure.hearText(q, q.type || run.mission.type)); return; }
    root.IslandAudio.speak(q.speak || q.word || q.q || q.text);
  }

  /* Option handler for Listen & Read */
  function pickOption(optIdx, btnEl) {
    var run = state.missionRun;
    if (!run) return;
    var q = run.mission.questions[run.qIndex];
    if (!q) return;
    var opts = q.options || [q.a];
    var picked = opts[optIdx];
    if (run.locked) return;

    if (picked === q.a) {
      run.locked = true;
      if (btnEl) btnEl.classList.add('correct');
      root.IslandAudio.playCorrect();
      if (!run.hadWrongOnCurrent) run.firstTryCorrect++;
      if (advOn(run)) {
        root.IslandAdventure.onRight(btnEl, run, q, function () { if (state.missionRun === run) advanceMissionStep(); });
        return;
      }
      root.IslandGames.onRight(run.zone, btnEl, run);
      setTimeout(function () {
        if (state.missionRun === run) advanceMissionStep();
      }, 980);
    } else {
      run.hadWrongOnCurrent = true;
      recordWrongQuestion(q);
      if (advOn(run)) {
        root.IslandAudio.playSoftFail();
        root.IslandAdventure.onWrong(btnEl);
        if (run.mission && run.mission.isStar) {
          var starBtn = document.querySelector('.isl-opt-btn[data-opt="' + esc(q.a) + '"]');
          if (starBtn) starBtn.classList.add('adv-hint');
        }
        return;
      }
      if (btnEl) {
        btnEl.classList.remove('wobble');
        void btnEl.offsetWidth;
        btnEl.classList.add('wobble');
      }
      root.IslandAudio.playSoftFail();
      root.IslandGames.onWrong(run.zone, btnEl, run);
      if (run.mission && run.mission.isStar) {
        var correctBtn = document.querySelector('.isl-opt-btn[data-opt="' + esc(q.a) + '"]');
        if (correctBtn) {
          correctBtn.classList.remove('wobble');
          correctBtn.classList.add('hint-correct');
        }
        root.IslandAudio.speak('Here is the right one: ' + q.a + '. Tap it to continue!');
      } else {
        root.IslandAudio.speak('Listen closely and try again!');
      }
    }
  }

  /* Handlers for Type 2: Word Match */
  function tapMatchLeft(word) {
    var run = state.missionRun;
    if (!run || run.matchDonePairs[word]) return;
    run.matchSelectedLeft = word;
    root.IslandAudio.playTap();
    root.IslandAudio.speak(word);
    renderMissionModal();
  }

  function tapMatchRight(targetWord, btnEl) {
    var run = state.missionRun;
    if (!run || !run.matchSelectedLeft) {
      root.IslandAudio.playSoftFail();
      if (advOn(run)) { root.IslandAdventure.firstWord(); return; }
      root.IslandAudio.speak('Tap a word on the left first!');
      return;
    }
    if (run.matchSelectedLeft === targetWord) {
      run.matchDonePairs[targetWord] = true;
      run.matchSelectedLeft = null;
      root.IslandAudio.playCorrect();
      if (!run.hadWrongOnCurrent) run.firstTryCorrect++;
      var matchFinished = run.qIndex + 1 >= run.total || Object.keys(run.matchDonePairs).length >= run.total;
      if (advOn(run)) {
        root.IslandAdventure.onMatchRight(run, targetWord, matchFinished, function () {
          if (state.missionRun !== run) return;
          if (matchFinished) { run.qIndex = run.total - 1; finishMission(); return; }
          run.qIndex++;
          run.hadWrongOnCurrent = false;
          renderMissionModal();
        });
        return;
      }
      if (matchFinished) {
        run.qIndex = run.total - 1;
        setTimeout(finishMission, 320);
      } else {
        run.qIndex++;
        run.hadWrongOnCurrent = false;
        renderMissionModal();
      }
    } else {
      run.hadWrongOnCurrent = true;
      if (advOn(run)) {
        root.IslandAudio.playSoftFail();
        root.IslandAdventure.onWrong(btnEl);
        if (run.mission && run.mission.isStar) {
          var starRight = document.querySelector('.adv-card[data-match="' + esc(run.matchSelectedLeft) + '"]');
          if (starRight) starRight.classList.add('adv-hint');
        }
        return;
      }
      if (btnEl) {
        btnEl.classList.remove('wobble');
        void btnEl.offsetWidth;
        btnEl.classList.add('wobble');
      }
      root.IslandAudio.playSoftFail();
      root.IslandGames.onWrong(run.zone, null, run);
      if (run.mission && run.mission.isStar) {
        var correctRight = document.querySelector('.isl-match-tile[data-match="' + esc(run.matchSelectedLeft) + '"]');
        if (correctRight) {
          correctRight.classList.remove('wobble');
          correctRight.classList.add('hint-correct');
        }
        root.IslandAudio.speak('Look for the right match!');
      }
    }
  }

  /* Handlers for Type 4: Build Sentence */
  function placeBuildWord(bankIdx, btnEl) {
    var run = state.missionRun;
    if (!run) return;
    var q = run.mission.questions[run.qIndex];
    if (!q) return;
    var chosen = run.buildBank[bankIdx];
    var expectedNext = q.order[run.buildPlaced.length];

    if (chosen === expectedNext) {
      run.buildPlaced.push(chosen);
      run.buildBank.splice(bankIdx, 1);
      root.IslandAudio.playTap();
      if (advOn(run)) root.IslandAdventure.placed();
      root.IslandAudio.speak(chosen);
      renderMissionModal();

      if (run.buildPlaced.length === q.order.length) {
        root.IslandAudio.playCorrect();
        if (!run.hadWrongOnCurrent) run.firstTryCorrect++;
        if (advOn(run)) {
          root.IslandAdventure.onBuildDone(run, q, function () { if (state.missionRun === run) advanceMissionStep(); });
        } else {
          setTimeout(advanceMissionStep, 420);
        }
      }
    } else {
      run.hadWrongOnCurrent = true;
      recordWrongQuestion(q);
      if (advOn(run)) {
        root.IslandAudio.playSoftFail();
        root.IslandAdventure.onWrong(btnEl);
        if (run.mission && run.mission.isStar) {
          var starNext = document.querySelector('#isl-build-bank [data-word="' + esc(expectedNext) + '"]');
          if (starNext) starNext.classList.add('adv-hint');
        }
        return;
      }
      if (btnEl) {
        btnEl.classList.remove('wobble');
        void btnEl.offsetWidth;
        btnEl.classList.add('wobble');
      }
      root.IslandAudio.playSoftFail();
      root.IslandGames.onWrong(run.zone, null, run);
      if (run.mission && run.mission.isStar) {
        var expectedBtn = document.querySelector('#isl-build-bank [data-word="' + esc(expectedNext) + '"]');
        if (expectedBtn) {
          expectedBtn.classList.remove('wobble');
          expectedBtn.classList.add('hint-correct');
        }
        root.IslandAudio.speak('Look for ' + expectedNext + ' next!');
      }
    }
  }

  function unplaceBuildWord(placedIdx) {
    var run = state.missionRun;
    if (!run) return;
    var q = run.mission.questions[run.qIndex];
    if (q && q.starterFirstWord && placedIdx === 0) return;
    var w = run.buildPlaced.splice(placedIdx, 1)[0];
    if (w) run.buildBank.push(w);
    root.IslandAudio.playTap();
    renderMissionModal();
  }

  /* Handlers for Type 5: Say It Aloud */
  function listenForSay() {
    var run = state.missionRun;
    if (!run) return;
    var q = run.mission.questions[run.qIndex];
    if (!q) return;
    root.IslandAudio.speak(q.speak || q.text);

    setTimeout(function () {
      if (state.missionRun === run) {
        run.sayUnlocked = true;
        renderMissionModal();
      }
    }, 650);
  }

  /* The Adventure screen says the speaking step is done (the words were heard, or the pupil had a good try). */
  function sayPassed(line) {
    var run = state.missionRun;
    if (!run || run.locked) return;
    run.sayUnlocked = true;
    completeSayStep(line);
  }

  function completeSayStep(line) {
    var run = state.missionRun;
    if (!run || !run.sayUnlocked || run.locked) return;
    run.locked = true;
    root.IslandAudio.playCorrect();
    run.firstTryCorrect++;
    if (advOn(run)) {
      root.IslandAdventure.onSayDone(run, function () { if (state.missionRun === run) advanceMissionStep(); }, typeof line === 'string' ? line : '');
      return;
    }
    var sayQ = run.mission.questions[run.qIndex];
    root.IslandGames.echo(sayQ && sayQ.text);
    setTimeout(function () {
      if (state.missionRun === run) advanceMissionStep();
    }, 1250);
  }

  function advanceMissionStep() {
    var run = state.missionRun;
    if (!run) return;
    if (run.qIndex + 1 < run.total) {
      run.qIndex++;
      prepareCurrentStep();
      renderMissionModal();
    } else {
      finishMission();
    }
  }

  function finishMission() {
    var run = state.missionRun;
    if (!run || !state.session) return;
    var m = run.mission;
    var ses = state.session;
    var doc = ses.doc;

    var stars = 1;
    if (run.firstTryCorrect >= run.total) {
      stars = 3;
    } else if (run.total >= 6 ? run.firstTryCorrect >= 4 : run.firstTryCorrect >= Math.ceil(run.total * 0.65)) {
      stars = 2;
    }

    var starsBefore = (doc.stars && doc.stars[m.id]) || 0;
    var rawXP = 0;
    if (m.isDaily) {
      var today = root.IslandSync.todayStr();
      if (!doc.dailyDone) doc.dailyDone = {};
      var alreadyDaily = !!doc.dailyDone[today];
      doc.dailyDone[today] = true;
      rawXP = alreadyDaily ? 2 : 5;
    } else {
      if (!doc.stars) doc.stars = {};
      var prevStars = Number(doc.stars[m.id]) || 0;
      var isFirstTime = prevStars === 0;
      doc.stars[m.id] = Math.max(prevStars, stars);
      if (isFirstTime) {
        rawXP = m.isStar ? 8 : (5 + stars);
      } else {
        rawXP = 2;
      }
    }

    if (root.IslandAdventure) root.IslandAdventure.close();
    var wasThreeStars = Number(starsBefore) >= 3;
    var nextTarget = findNextMissionTarget(m.id, !!m.isStar);
    var stickerReward = (root.IslandRewards && root.IslandRewards.awardMissionSticker) ? root.IslandRewards.awardMissionSticker(doc, m.id, stars) : null;
    var res = awardIslandXP(rawXP, m.id);
    if (root.WorldGame && root.WorldGame.addEnergy) root.WorldGame.addEnergy(30);
    if (root.IslandWall) {
      if (stars === 3 && !m.isStar && !m.isDaily && !wasThreeStars) root.IslandWall.news('stars');
      if (res.leveledUp && res.newLevelInfo) root.IslandWall.news('level', res.newLevelInfo.level);
    }
    state.lastCompletedMission = { id: m.id, stars: stars };
    state.missionRun = null;
    root.IslandAudio.stopAmbient();
    if (res.leveledUp) {
      root.IslandAudio.playLevelUp();
      if (root.IslandRewards && root.IslandRewards.launchFireworks) {
        root.IslandRewards.launchFireworks();
      }
    } else if (res.streakBonus > 0) {
      root.IslandAudio.playStreak();
    } else {
      root.IslandAudio.playFanfare();
    }
    renderTopBar();
    renderMap();
    showRewardModal({
      title: m.title + ' Complete!',
      stars: stars,
      xpAdded: res.added,
      capped: res.capped,
      leveledUp: res.leveledUp,
      newLevelInfo: res.newLevelInfo,
      streakBonus: res.streakBonus,
      nextTarget: nextTarget,
      stickerReward: stickerReward,
      mission: m
    });
    var said = root.IslandStory.thanks(m);
    if (said) root.IslandAudio.speak(said.text, null, said.who);
  }

  function findNextMissionTarget(currentMissionId, isStar) {
    var match = /^g([34])-z([1-4])-([ms])(\d+)$/.exec(String(currentMissionId || ''));
    if (!match) return null;
    var g = Number(match[1]);
    var z = Number(match[2]);
    var kind = match[3];
    var num = Number(match[4]);
    var maxNum = kind === 's' ? 6 : 5;
    if (num < maxNum) {
      return { id: 'g' + g + '-z' + z + '-' + kind + (num + 1), zoneNum: z, isStar: kind === 's' };
    }
    if (z < 4 && isZoneUnlocked(z + 1)) {
      return { id: 'g' + g + '-z' + (z + 1) + '-' + kind + '1', zoneNum: z + 1, isStar: kind === 's' };
    }
    return null;
  }

  function startNextMission(missionId, zoneNum, isStar) {
    closeModal();
    if (root.WORLD && root.WORLD.nextMission) { root.WORLD.nextMission(missionId, zoneNum, isStar); return; }
    tapPin(missionId, zoneNum, isStar);
  }

  function showRewardModal(info) {
    var modalRoot = document.getElementById('isl-modal-root');
    if (!modalRoot) return;
    var starIcons = '⭐'.repeat(info.stars || 3);
    var lvlHtml = '';
    if (info.leveledUp && info.newLevelInfo) {
      lvlHtml =
        '<div id="isl-levelup-banner" style="margin:14px 0;padding:14px;border-radius:20px;background:rgba(245,158,11,0.22);border:2px solid #fbbf24">' +
          '<div style="font-size:1.5rem;letter-spacing:4px">🎊 ✨ 🎉 ✨ 🎊</div>' +
          '<div style="font-size:1.35rem;font-weight:800;color:#fde047">🎉 Monster Level Up! Level ' + info.newLevelInfo.level + ' · ' + esc(info.newLevelInfo.stageName) + '!</div>' +
          '<div style="width:120px;height:120px;margin:8px auto">' + renderMonsterHtml(120) + '</div>' +
        '</div>';
    }

    var nextBtnHtml = '';
    if (info.nextTarget) {
      nextBtnHtml =
        '<button type="button" class="isl-btn cyan" id="isl-reward-next" style="min-width:190px;margin-top:10px" ' +
          'onclick="IslandApp.startNextMission(\'' + esc(info.nextTarget.id) + '\',' + info.nextTarget.zoneNum + ',' + (info.nextTarget.isStar ? 'true' : 'false') + ')">▶ Next mission</button>';
    }

    var stickerHtml = '';
    if (info.stickerReward && info.stickerReward.sticker) {
      var st = info.stickerReward.sticker;
      var isShiny = info.stickerReward.isShiny;
      stickerHtml =
        '<div id="isl-sticker-reward-banner" style="margin:12px 0;padding:12px;border-radius:18px;background:rgba(56,189,248,0.18);border:2px solid ' + (isShiny ? '#fde047' : '#38bdf8') + ';display:flex;align-items:center;gap:12px;text-align:left">' +
          '<img src="art/' + esc(st.pic) + '.webp" style="width:58px;height:58px;object-fit:contain;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.4))" alt="">' +
          '<div>' +
            '<div style="font-size:0.8rem;font-weight:800;color:' + (isShiny ? '#fde047' : '#38bdf8') + '">' + (isShiny ? '✨ NEW SHINY STICKER!' : '📒 NEW STICKER UNLOCKED!') + '</div>' +
            '<div style="font-size:1.1rem;font-weight:800;color:#f8fafc">' + esc(st.name) + '</div>' +
            '<div style="font-size:0.82rem;color:#cbd5e1">' + esc(st.desc) + '</div>' +
          '</div>' +
        '</div>';
    }

    modalRoot.innerHTML =
      '<div class="isl-modal-backdrop" id="isl-reward-backdrop">' +
        '<div class="isl-card-modal" style="max-width:520px;text-align:center">' +
          (info.mission ? root.IslandStory.thanksHtml(info.mission) : '') +
          '<div style="font-size:3rem;margin-bottom:6px;animation:idleBob 1.4s ease-in-out infinite">' + starIcons + '</div>' +
          '<h2 style="margin:4px 0 8px;font-size:1.85rem">' + esc(info.title) + '</h2>' +
          '<div style="font-size:1.45rem;font-weight:800;color:#34d399;margin-bottom:8px" id="isl-reward-xp">+' + info.xpAdded + ' XP Earned!</div>' +
          (info.streakBonus ? '<div style="color:#fde68a;font-weight:700;margin-bottom:8px">🔥 Streak Bonus +' + info.streakBonus + ' XP!</div>' : '') +
          (info.capped ? '<div style="color:#bae6fd;font-size:0.98rem;font-weight:700;margin-bottom:10px" id="isl-cap-msg">Great work! Your monster is full of XP today. Come back tomorrow!</div>' : '') +
          lvlHtml +
          stickerHtml +
          '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">' +
            nextBtnHtml +
            '<button type="button" class="isl-btn emerald" id="isl-reward-continue" style="min-width:170px;margin-top:10px" onclick="IslandApp.closeModal()">Continue 🚀</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /* Monster Dressing Room (👕) */
  function openDressingRoom() {
    if (!state.session || !state.session.student) return;
    root.IslandAudio.playTap();
    var prof = state.session.student.monsterProfile || {};
    var currentEq = Object.assign({}, prof.equipped || {}, (state.session.doc && state.session.doc.look) || {});
    state.dressDraft = currentEq;
    state.dressTab = state.dressTab || 'hat';
    state.dressSavedNotice = '';
    renderDressingRoom();
  }

  function isStoreItemOwnedByPupil(item) {
    if (!item || item.unlockType !== 'store') return true;
    var prof = (state.session && state.session.student && state.session.student.monsterProfile) || {};
    var owned = Array.isArray(prof.unlockedItems) ? prof.unlockedItems : [];
    return owned.indexOf(item.id) !== -1;
  }

  function isItemUnlockedForPupil(item, pupilLevel) {
    if (!item) return false;
    if (!isStoreItemOwnedByPupil(item)) return false;
    var reqLvl = Number(item.unlockLevel) || 1;
    if (reqLvl > pupilLevel) return false;
    return true;
  }

  function renderDressingRoom() {
    var modalRoot = document.getElementById('isl-modal-root');
    if (!modalRoot || !state.session) return;
    var mInfo = calcMonsterLevel(getEffectiveXP());
    var cats = root.IslandData.MONSTER_CATEGORIES;
    var allItems = root.IslandData.getAllMonsterItems();
    var activeCat = cats.filter(function (c) { return c.id === state.dressTab; })[0] || cats[0];
    /* Hide store items the pupil does not own ("Items the pupil doesn't own are not shown (no shop here)") */
    var catItems = allItems.filter(function (it) {
      return it.category === activeCat.id && isStoreItemOwnedByPupil(it);
    });
    var prof = state.session.student.monsterProfile || {};
    var colorKey = prof.baseColor || 'blue';

    var tabsHtml = cats.map(function (c) {
      return '<button type="button" class="isl-btn ' + (c.id === activeCat.id ? 'amber' : '') + '" ' +
        'style="min-height:46px;padding:6px 14px;font-size:0.95rem" onclick="IslandApp.setDressTab(\'' + c.id + '\')">' +
        c.icon + ' ' + esc(c.label) + '</button>';
    }).join('');

    var noneSelected = !state.dressDraft[activeCat.slot] || state.dressDraft[activeCat.slot] === 'none';
    var cardsHtml =
      '<button type="button" class="isl-item-card' + (noneSelected ? ' equipped' : '') + '" id="isl-dress-takeoff" onclick="IslandApp.selectDressItem(\'' + activeCat.slot + '\',\'none\')">' +
        '<div style="font-size:2rem">✕</div>' +
        '<span>Take it off</span>' +
      '</button>';

    catItems.forEach(function (it) {
      var reqLvl = Number(it.unlockLevel) || 1;
      var unlocked = isItemUnlockedForPupil(it, mInfo.level);
      var isEquipped = state.dressDraft[activeCat.slot] === it.id;
      var thumbHtml = '<div style="font-size:2.1rem">' + esc(it.icon || '✨') + '</div>';
      if (it.imageSrc && /^art\/flat\/r_/.test(it.imageSrc)) {
        thumbHtml = '<img src="' + esc(it.imageSrc) + '" style="width:58px;height:58px;object-fit:contain" alt="">';
      } else if (root.MonsterRenderer && typeof root.MonsterRenderer.renderMonsterItemThumbnail === 'function') {
        var svgThumb = root.MonsterRenderer.renderMonsterItemThumbnail(it, { size: 54, colorKey: colorKey });
        if (svgThumb && /<(path|circle|rect|ellipse|polygon|image)/i.test(svgThumb)) {
          thumbHtml = svgThumb;
        }
      }

      var lockPill = '';
      if (!unlocked) {
        lockPill = '<span class="monster-item-lock-pill">🔒 Level ' + reqLvl + '</span>';
      }

      cardsHtml +=
        '<button type="button" class="isl-item-card' + (isEquipped ? ' equipped' : '') + (unlocked ? '' : ' locked') + '" ' +
          'data-item-id="' + esc(it.id) + '" ' +
          (unlocked ? 'onclick="IslandApp.selectDressItem(\'' + activeCat.slot + '\',\'' + esc(it.id) + '\')"' : 'disabled aria-disabled="true"') + '>' +
          thumbHtml +
          '<span>' + esc(it.name) + '</span>' +
          lockPill +
        '</button>';
    });

    modalRoot.innerHTML =
      '<div class="isl-modal-backdrop" id="isl-dress-backdrop">' +
        '<div class="isl-card-modal dressing-bg">' +
          '<div class="isl-mission-top">' +
            '<div style="font-size:1.35rem;font-weight:800">👕 Monster Dressing Room</div>' +
            '<button type="button" class="isl-btn" style="min-height:44px;min-width:44px;padding:6px 12px" onclick="IslandApp.closeModal()">✕</button>' +
          '</div>' +
          '<div class="isl-dress-grid">' +
            '<div class="isl-dress-preview">' +
              '<div class="isl-dress-stage' + (state.dressDraft && state.dressDraft.ride && state.dressDraft.ride !== 'none' ? ' has-ride' : '') + '" id="isl-dress-stage" style="position:relative">' + (state.dressDraft && state.dressDraft.ride && state.dressDraft.ride !== 'none' ? '<img class="isl-dress-ride" src="art/flat/' + esc(state.dressDraft.ride) + '.webp" style="position:absolute;bottom:6px;left:50%;transform:translateX(-50%);width:150px;height:105px;object-fit:contain;pointer-events:none;z-index:1" alt="">' : '') + '<div style="position:relative;z-index:2;width:100%;height:100%;transform:' + (state.dressDraft && state.dressDraft.ride && state.dressDraft.ride !== 'none' ? 'translateY(-22px) scale(0.76)' : 'none') + '">' + renderMonsterHtml(210, state.dressDraft) + '</div></div>' +
              '<div style="font-size:1.25rem;font-weight:800;margin-top:8px">' + esc(state.session.student.firstName) + '\'s Monster</div>' +
              '<div style="color:#38bdf8;font-weight:700;font-size:0.95rem;margin-bottom:10px">Level ' + mInfo.level + ' · ' + esc(mInfo.stageName) + '</div>' +
              (state.dressSavedNotice ? '<div id="isl-dress-notice" style="color:#fde68a;font-size:0.88rem;font-weight:700;margin-bottom:10px">' + esc(state.dressSavedNotice) + '</div>' : '') +
              '<button type="button" class="isl-btn emerald" id="isl-dress-save" style="width:100%" onclick="IslandApp.saveDressLook()">Done ✓</button>' +
            '</div>' +
            '<div>' +
              '<div class="isl-cat-tabs">' + tabsHtml + '</div>' +
              '<div class="isl-items-grid" id="isl-dress-items">' + cardsHtml + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function setDressTab(tabId) {
    state.dressTab = tabId;
    root.IslandAudio.playTap();
    renderDressingRoom();
  }

  function persistCurrentDressDraft() {
    if (!state.session || !state.dressDraft) return;
    var cleanLook = {};
    Object.keys(state.dressDraft).forEach(function (k) {
      cleanLook[k] = state.dressDraft[k] || '';
    });
    state.session.doc.look = cleanLook;
    state.session.doc.lookAt = new Date().toISOString();
    if (state.session.student.monsterProfile) {
      state.session.student.monsterProfile.equipped = Object.assign({}, state.session.student.monsterProfile.equipped, cleanLook);
    }
    root.IslandSync.saveIslandDoc(state.session);
    renderTopBar();
    renderMap();
  }

  /* Strict Controller Guard against locked items (AGENTS.md Section 3.4) */
  function selectDressItem(slot, itemId) {
    if (!state.session || !state.dressDraft) return;
    if (itemId !== 'none') {
      var mInfo = calcMonsterLevel(getEffectiveXP());
      var allItems = root.IslandData.getAllMonsterItems();
      var found = allItems.filter(function (x) { return x.id === itemId; })[0];
      if (!found || !isItemUnlockedForPupil(found, mInfo.level)) {
        root.IslandAudio.playSoftFail();
        return;
      }
    }
    state.dressDraft[slot] = itemId === 'none' ? '' : itemId;
    state.dressSavedNotice = 'Your new look will appear in class soon ✨';
    persistCurrentDressDraft();
    root.IslandAudio.playTap();
    renderDressingRoom();
  }

  function saveDressLook() {
    persistCurrentDressDraft();
    root.IslandAudio.playFanfare();
    closeModal();
  }

  function closeModal() {
    if (root.IslandAdventure) root.IslandAdventure.close();
    state.missionRun = null;
    root.IslandAudio.stopAmbient();
    var modalRoot = document.getElementById('isl-modal-root');
    if (modalRoot) modalRoot.innerHTML = '';
    if (state.lastCompletedMission) {
      var done = state.lastCompletedMission;
      state.lastCompletedMission = null;
      if (root.WORLD && root.WORLD.onMissionComplete) {
        setTimeout(function () { root.WORLD.onMissionComplete(done.id, done.stars); }, 120);
      }
    }
    maybePlayEnding();
  }

  function shellCount() {
    var chests = (state.session && state.session.doc && state.session.doc.chests) || {};
    return [1, 2, 3, 4].filter(function (n) { return chests['z' + n]; }).length;
  }

  function maybePlayEnding() {
    var doc = state.session && state.session.doc;
    if (!doc || shellCount() < 4 || (doc.story && doc.story.ending)) return;
    doc.story = doc.story || {};
    doc.story.ending = true;
    doc.story.title = 'Island Hero';
    root.IslandSync.saveIslandDoc(state.session);
    root.IslandStory.playEnding(renderMonsterHtml(110), function () {
      renderMap();
    });
  }

  function tapZoneFriend(zoneNum) {
    var c = root.IslandStory.CHARS[zoneNum];
    var done = !!(state.session && state.session.doc && state.session.doc.chests && state.session.doc.chests['z' + zoneNum]);
    root.IslandAudio.playTap();
    root.IslandAudio.speak(done ? 'Thank you for my magic shell!' : 'Hello! I am ' + c.name + '. Please help me!', null, zoneNum);
  }

  function tapPip() {
    var line = root.IslandStory.pipLine();
    var el = document.getElementById('gm-pip-line');
    root.IslandAudio.playTap();
    root.IslandAudio.speak(line, null, 'pip');
    if (!el) return;
    el.textContent = line;
    el.style.display = 'block';
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
  }

  function zoneSleep(zoneNum, missions) {
    var doc = state.session.doc || {};
    if (doc.chests && doc.chests['z' + zoneNum]) return 0;
    if (!isZoneUnlocked(zoneNum)) return 1;
    var done = missions.filter(function (m) { return doc.stars && doc.stars[m.id]; }).length;
    return Math.round((1 - done / missions.length * 0.8) * 100) / 100;
  }

  function shellsHtml() {
    var n = shellCount(), title = state.session.doc.story && state.session.doc.story.title;
    var out = '';
    for (var i = 0; i < 4; i++) out += '<span class="gm-shell' + (i < n ? ' on' : '') + '">' + root.IslandStory.pic('o_shell', '🐚') + '</span>';
    return '<div class="gm-shells" id="gm-shells" aria-label="' + n + ' of 4 magic shells">' + out + (title ? ' 🏅 ' + esc(title) : ' ' + n + ' / 4') + '</div>';
  }

  function toggleMute() {
    root.IslandAudio.toggleMute();
    renderTopBar();
  }

  function goHome() {
    if (state.missionRun || (document.getElementById('isl-modal-root') && document.getElementById('isl-modal-root').innerHTML !== '')) {
      closeModal();
      return;
    }
    root.location.href = '../index.html';
  }

  function goToPassport() {
    var ses = state.session;
    if (ses && ses.isDemo) {
      var curId = ses.student && ses.student.id;
      var passDemo = 'demo-p3';
      if (curId === 'demo-g4') passDemo = 'demo-p4';
      if (curId === 'demo-star') passDemo = 'demo-p5';
      root.location.href = '../passport/index.html?demo=' + passDemo;
    } else if (ses && ses.code) {
      root.location.href = '../passport/index.html?p=' + encodeURIComponent(ses.code);
    } else {
      root.location.href = '../passport/index.html';
    }
  }

  function switchDemo(demoPupilId) {
    closeModal();
    root.IslandSync.loadDemoSession(demoPupilId).then(function (ses) {
      state.session = ses;
      renderTopBar();
      renderMap();
    });
  }

  /* 3-Step First-Visit Welcome Card */
  function maybeShowWelcome() {
    if (document.body && document.body.classList.contains('w-page')) return;
    if (!state.session || state.session.status !== 'ok') return;
    var params = new URLSearchParams(root.location.search);
    if (params.get('nowelcome') === '1') return;
    var seen = false;
    try { seen = localStorage.getItem('eaa_island_welcomed') === '1'; } catch (e) {}
    if (seen) { maybePlayIntro(); return; }
    if (!state.session.isDemo) { dismissWelcome(); return; }

    var modalRoot = document.getElementById('isl-modal-root');
    if (!modalRoot) return;
    var demoPickHtml = '';
    if (state.session.isDemo) {
      var curId = state.session.student.id;
      demoPickHtml =
        '<div style="margin:10px 0 14px">' +
          '<div style="font-size:0.95rem;color:#bae6fd;font-weight:700;margin-bottom:8px">Choose a Demo Pupil:</div>' +
          '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">' +
            '<button type="button" class="isl-btn ' + (curId === 'demo-g3' ? 'cyan' : '') + '" id="isl-start-g3" onclick="IslandApp.switchDemo(\'demo-g3\');IslandApp.dismissWelcome()">👦 Test Pupil 3 (Grade 3)</button>' +
            '<button type="button" class="isl-btn ' + (curId === 'demo-g4' ? 'cyan' : '') + '" id="isl-start-g4" onclick="IslandApp.switchDemo(\'demo-g4\');IslandApp.dismissWelcome()">👧 Test Pupil 4 (Grade 4)</button>' +
            '<button type="button" class="isl-btn ' + (curId === 'demo-star' ? 'amber' : '') + '" id="isl-start-star" onclick="IslandApp.switchDemo(\'demo-star\');IslandApp.dismissWelcome()">⭐ Test Pupil Star</button>' +
          '</div>' +
        '</div>';
    }

    modalRoot.innerHTML =
      '<div class="isl-modal-backdrop" id="isl-welcome-backdrop">' +
        '<div class="isl-card-modal" style="max-width:560px;text-align:center">' +
          '<div style="width:110px;height:110px;margin:0 auto 8px">' + renderMonsterHtml(110) + '</div>' +
          '<h2 style="margin:4px 0 10px;font-size:1.85rem">👋 Welcome, ' + esc(state.session.student.firstName) + '!</h2>' +
          demoPickHtml +
          '<div style="display:grid;gap:10px;text-align:left;margin:14px 0 18px">' +
            '<div style="padding:10px 14px;border-radius:16px;background:rgba(30,41,59,0.85);font-size:1.02rem"><b>1. 🏝️ This is your island</b> — explore sunny meadows, beaches and forests!</div>' +
            '<div style="padding:10px 14px;border-radius:16px;background:rgba(30,41,59,0.85);font-size:1.02rem"><b>2. 📍 Tap a pin to play</b> — answer quick questions to earn stars and level up!</div>' +
            '<div style="padding:10px 14px;border-radius:16px;background:rgba(30,41,59,0.85);font-size:1.02rem"><b>3. 👕 Dress your monster</b> — unlock cool hats, glasses and outfits!</div>' +
          '</div>' +
          '<button type="button" class="isl-btn emerald" id="isl-welcome-go" style="width:220px" onclick="IslandApp.dismissWelcome()">Let\'s Play! 🚀</button>' +
        '</div>' +
      '</div>';
  }

  function dismissWelcome() {
    try { localStorage.setItem('eaa_island_welcomed', '1'); } catch (e) {}
    root.IslandAudio.playTap();
    closeModal();
    maybePlayIntro();
  }

  function maybePlayIntro() {
    var doc = state.session && state.session.doc;
    if (!doc || (doc.story && doc.story.intro) || noStory()) return;
    doc.story = doc.story || {};
    doc.story.intro = true;
    if (!state.session.isDemo) root.IslandSync.saveIslandDoc(state.session);
    root.IslandStory.playIntro(renderMonsterHtml(92), function () { renderMap(); });
  }

  function init() {
    var params = new URLSearchParams(root.location.search);
    var isDemo = params.get('demo') === '1';
    var demoPupil = params.get('pupil') || 'demo-g3';
    var code = params.get('p') || '';

    var loader = isDemo
      ? root.IslandSync.loadDemoSession(demoPupil)
      : root.IslandSync.loadLiveSession(code);

    root.IslandStory.ready.then(function () { return loader; }).then(function (ses) {
      state.session = ses;
      renderTopBar();
      renderMap();
      maybeShowWelcome();
    });
  }

  root.IslandApp = {
    init: init,
    state: function () { return state; },
    getTodayXP: getTodayXP,
    getEffectiveXP: getEffectiveXP,
    renderMap: renderMap,
    renderTopBar: renderTopBar,
    switchDemo: switchDemo,
    submitCode: submitCode,
    tapPin: tapPin,
    monsterHtml: renderMonsterHtml,
    tapChest: tapChest,
    tapLockedZone: tapLockedZone,
    tapZoneFriend: tapZoneFriend,
    tapPip: tapPip,
    startDailyQuest: startDailyQuest,
    awardIslandXP: awardIslandXP,
    pokeMonster: pokeMonster,
    walkMap: walkMap,
    replayMissionAudio: replayMissionAudio,
    speakText: function (text) { root.IslandAudio.speak(text); },
    sayPassed: sayPassed,
    openZone: openZone,
    closeZone: closeZone,
    pickOption: pickOption,
    tapMatchLeft: tapMatchLeft,
    tapMatchRight: tapMatchRight,
    placeBuildWord: placeBuildWord,
    unplaceBuildWord: unplaceBuildWord,
    listenForSay: listenForSay,
    completeSayStep: completeSayStep,
    openDressingRoom: openDressingRoom,
    setDressTab: setDressTab,
    selectDressItem: selectDressItem,
    saveDressLook: saveDressLook,
    startNextMission: startNextMission,
    closeModal: closeModal,
    dismissWelcome: dismissWelcome,
    toggleMute: toggleMute,
    goHome: goHome,
    goToPassport: goToPassport
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(typeof window !== 'undefined' ? window : this);
