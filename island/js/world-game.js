/* Practice Island â€” World Game Engine (Stages 2â€“5 Overhaul: Cloud Sync, My Home & Live Decorator, In-World Villager Quests, World Map & Turn-Based Monster Battles).
   Works alongside island/js/world.js, island/js/sync.js, and island/js/app.js. */
(function (root) {
  'use strict';

  var FLAT = 'art/flat/';
  var $ = function (id) { return document.getElementById(id); };
  var App = function () { return root.IslandApp; };
  var W = function () { return root.WORLD; };
  var A = function () { return root.IslandAudio || {}; };
  var ses = function () { var st = App() && App().state && App().state(); return st && st.session; };
  function sound(n) { if (A()[n]) { try { A()[n](); } catch (e) { /* ignore */ } } }
  function say(t) { if (A().speak) A().speak(t); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- 1. Persistent World State + Cloud Sync (ses().doc.world via IslandSync) ---------- */
  var STATE_KEY = function () { var s = ses(); return 'eaa_world_game_' + ((s && s.student && s.student.id) || 'demo'); };
  var BAG_KEY = function () { var s = ses(); return 'eaa_world_bag_' + ((s && s.student && s.student.id) || 'x'); };
  var syncTimer = null;

  var HOUSE_TIERS = [
    { level: 1, id: 'h_tent',    name: 'Cosy Tent',         cost: {} },
    { level: 2, id: 'h_hut',     name: 'Straw Hut',         cost: { wood: 3, stone: 2 } },
    { level: 3, id: 'h_cottage', name: 'Red-Roof Cottage',  cost: { wood: 5, stone: 4, flower: 2 } },
    { level: 4, id: 'h_house',   name: 'Two-Floor House',   cost: { wood: 8, stone: 6, shell: 3 } },
    { level: 5, id: 'h_castle',  name: 'Fairy-Tale Castle', cost: { wood: 10, stone: 8, berry: 4, crystal: 4 } }
  ];

  /* Default positions placed neatly on the Veranda Deck (x: 1420..1920, y: 520..820) or Fenced Garden Lawn (x: 420..1920, y: 880..1280) */
  var RECIPES = [
    { id: 'f_bed',       name: 'Cosy Bed',       kind: 'patio',  h: 125, sw: 110, cost: { wood: 2, flower: 1 },            defPos: { x: 820,  y: 700 } },
    { id: 'f_table',     name: 'Round Table',    kind: 'patio',  h: 100, sw: 85,  cost: { wood: 2 },                       defPos: { x: 1480, y: 760 } },
    { id: 'f_chair',     name: 'Cushion Chair',  kind: 'patio',  h: 100, sw: 65,  cost: { wood: 1, flower: 1 },            defPos: { x: 1350, y: 775 } },
    { id: 'f_lamp',      name: 'Warm Lamp',      kind: 'patio',  h: 145, sw: 50,  cost: { stone: 1, crystal: 1 },          defPos: { x: 1640, y: 650 } },
    { id: 'f_rug',       name: 'Striped Rug',    kind: 'patio',  h: 95,  sw: 0,   cost: { flower: 2, berry: 1 },           defPos: { x: 1200, y: 830 }, flat: true },
    { id: 'f_plant',     name: 'Potted Plant',   kind: 'patio',  h: 110, sw: 55,  cost: { stone: 1, flower: 2 },           defPos: { x: 1020, y: 640 } },
    { id: 'g_mailbox',   name: 'Red Mailbox',    kind: 'garden', h: 120, sw: 55,  cost: { wood: 1, stone: 1 },             defPos: { x: 960,  y: 690 } },
    { id: 'g_flowerbed', name: 'Flowerbed',      kind: 'garden', h: 85,  sw: 0,   cost: { flower: 2 },                     defPos: { x: 580,  y: 920 }, flat: true },
    { id: 'g_fence',     name: 'White Fence',    kind: 'garden', h: 90,  sw: 95,  cost: { wood: 1 },                       defPos: { x: 740,  y: 920 } },
    { id: 'g_bench',     name: 'Garden Bench',   kind: 'garden', h: 105, sw: 105, cost: { wood: 2, stone: 1 },             defPos: { x: 920,  y: 1020 } },
    { id: 'g_pethouse',  name: 'Pet House',      kind: 'garden', h: 140, sw: 105, cost: { wood: 3, shell: 2 },             defPos: { x: 1360, y: 1020 } },
    { id: 'g_lamp',      name: 'Garden Lamp',    kind: 'garden', h: 170, sw: 50,  cost: { stone: 2, crystal: 1 },          defPos: { x: 1260, y: 700 } },
    { id: 'g_swing',     name: 'Wooden Swing',   kind: 'garden', h: 190, sw: 125, cost: { wood: 3, flower: 1 },            defPos: { x: 520,  y: 1140 } },
    { id: 'g_tree',      name: 'Apple Tree',     kind: 'garden', h: 260, sw: 85,  cost: { wood: 2, berry: 2 },             defPos: { x: 1940, y: 1100 } },
    { id: 'g_pond',      name: 'Lily Pond',      kind: 'garden', h: 135, sw: 140, cost: { stone: 3, shell: 2 },            defPos: { x: 820,  y: 1220 }, flat: true },
    { id: 'g_fountain',  name: 'Stone Fountain', kind: 'garden', h: 190, sw: 140, cost: { stone: 4, shell: 2, crystal: 1 }, defPos: { x: 1560, y: 1160 } }
  ];

  var VILLAGERS = [
    { id: 'v_farmer',  zone: 1, x: 540,  y: 740, name: 'Farmer Ben',  art: 'v_farmer',  happy: 'v_farmer_happy',  line: 'Can you bring me 2 wood and 1 flower for my farm?',            need: { wood: 2, flower: 1 },    gift: 'g_flowerbed', energy: 15 },
    { id: 'v_girl',    zone: 1, x: 1310, y: 830, name: 'Mia',         art: 'v_girl',    happy: 'v_girl_happy',    line: 'I love bright flowers! Can you find 2 flowers for me?',        need: { flower: 2 },             gift: 'f_plant',     energy: 15 },
    { id: 'v_postman', zone: 2, x: 580,  y: 920, name: 'Postman Pat', art: 'v_postman', happy: 'v_postman_happy', line: 'Hello! Can you find 2 shells and 1 wood on the beach?',         need: { shell: 2, wood: 1 },     gift: 'g_mailbox',   energy: 15 },
    { id: 'v_boy',     zone: 2, x: 1230, y: 920, name: 'Leo',         art: 'v_boy',     happy: 'v_boy_happy',     line: 'Let us build a bench! Can you bring 2 stones and 1 shell?',     need: { stone: 2, shell: 1 },    gift: 'g_bench',     energy: 15 },
    { id: 'v_baker',   zone: 3, x: 1470, y: 660, name: 'Baker Rosa',  art: 'v_baker',   happy: 'v_baker_happy',   line: 'I am baking berry pie! Can you bring me 2 berries and 1 wood?', need: { berry: 2, wood: 1 },     gift: 'f_table',     energy: 15 },
    { id: 'v_nurse',   zone: 4, x: 910,  y: 940, name: 'Nurse Maya',  art: 'v_nurse',   happy: 'v_nurse_happy',   line: 'My clinic needs light! Can you find 2 crystals and 1 stone?',   need: { crystal: 2, stone: 1 },  gift: 'f_lamp',      energy: 15 }
  ];

  /* Wild Monsters with patrol ranges & e_word_goblin included! */
  var BATTLES = [
    { id: 'e_sleepy_cloud', zone: 1, x: 1480, y: 730, patrol: 120, h: 140, hp: 90,  move: 'Rain Drop Tickle',  name: 'Sleepy Cloud',     art: 'e_sleepy_cloud', dizzy: 'e_sleepy_cloud_dizzy', bg: 'b_meadow',  drop: { wood: 2, flower: 2 },   energy: 20 },
    { id: 'e_word_goblin',  zone: 1, x: 1960, y: 1160, patrol: 110, h: 135, hp: 90,  move: 'Book Boogie',       name: 'Word Goblin',      art: 'e_word_goblin',  dizzy: 'e_word_goblin',        bg: 'b_meadow',  drop: { wood: 2, stone: 2 },    energy: 20 },
    { id: 'e_sand_crab',    zone: 2, x: 1620, y: 880, patrol: 130, h: 130, hp: 90,  move: 'Bubble Pinch',      name: 'Cheeky Sand Crab', art: 'e_sand_crab',    dizzy: 'e_sand_crab',          bg: 'b_beach',   drop: { shell: 2, stone: 2 },   energy: 20 },
    { id: 'e_pine_bear',    zone: 3, x: 520,  y: 800, patrol: 115, h: 155, hp: 100, move: 'Pinecone Roll',     name: 'Pine Cone Bear',   art: 'e_pine_bear',    dizzy: 'e_pine_bear',          bg: 'b_forest',  drop: { berry: 2, wood: 2 },    energy: 20 },
    { id: 'e_lava_pup',     zone: 4, x: 820,  y: 780, patrol: 125, h: 135, hp: 100, move: 'Warm Pebble Hop',   name: 'Lava Pup',         art: 'e_lava_pup',     dizzy: 'e_lava_pup',           bg: 'b_volcano', drop: { crystal: 2, stone: 2 }, energy: 20 },
    { id: 'e_big_boss',     zone: 4, x: 1680, y: 970, patrol: 95,  h: 195, hp: 120, move: 'Boulder Bounce',    name: 'Crown Rock Giant', art: 'e_big_boss',     dizzy: 'e_big_boss_dizzy',     bg: 'b_volcano', drop: { crystal: 3, stone: 3 }, energy: 25 }
  ];

  var SPELLS = [
    { id: 'star',   name: 'Star Bolt',    sub: '35 DMG Â· Fast',    icon: 'x_star',   dmg: 35, heal: 0,  shield: false },
    { id: 'pow',    name: 'Mega Slam',    sub: '45 DMG Â· Heavy',   icon: 'x_pow',    dmg: 45, heal: 0,  shield: false },
    { id: 'shield', name: 'Magic Shield', sub: '30 DMG + Block',   icon: 'x_shield', dmg: 30, heal: 0,  shield: true  },
    { id: 'hearts', name: 'Heart Heal',   sub: '25 DMG + 30 HP',   icon: 'x_hearts', dmg: 25, heal: 30, shield: false }
  ];

  var MAT_ICONS = { wood: 'i_wood', stone: 'i_stone', flower: 'i_flower', shell: 'i_shell', berry: 'i_berry', crystal: 'i_crystal' };

  function scheduleCloudSync() {
    var s = ses();
    if (!s || !s.doc || !root.IslandSync || typeof root.IslandSync.saveIslandDoc !== 'function') return;
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(function () {
      try { root.IslandSync.saveIslandDoc(s); } catch (e) { /* ignore */ }
    }, 650);
  }

  function readState() {
    var def = {
      energy: 35,
      maxEnergy: 100,
      houseTier: 1,
      bonusCoins: 0,
      ownedFurniture: { f_rug: 1, g_flowerbed: 1 },
      placed: [
        { id: 'f_rug', x: 1200, y: 830, flip: false, lvl: 1 },
        { id: 'g_flowerbed', x: 580, y: 920, flip: false, lvl: 1 }
      ],
      blueprintsDone: {},
      sportsWins: 0,
      jobsDone: {},
      battlesWon: {},
      day: ''
    };
    try {
      var s = ses();
      var docWorld = (s && s.doc && s.doc.world) ? s.doc.world : null;
      var raw = JSON.parse(localStorage.getItem(STATE_KEY()));
      var merged = Object.assign({}, def, docWorld || {}, raw || {});
      if (docWorld && raw) {
        merged.houseTier = Math.max(Number(docWorld.houseTier) || 1, Number(raw.houseTier) || 1);
        merged.bonusCoins = Math.max(Number(docWorld.bonusCoins) || 0, Number(raw.bonusCoins) || 0);
        merged.ownedFurniture = Object.assign({}, def.ownedFurniture, docWorld.ownedFurniture || {}, raw.ownedFurniture || {});
        merged.jobsDone = Object.assign({}, docWorld.jobsDone || {}, raw.jobsDone || {});
        merged.battlesWon = Object.assign({}, docWorld.battlesWon || {}, raw.battlesWon || {});
      }
      var today = new Date().toISOString().slice(0, 10);
      if (merged.day !== today) {
        merged.day = today;
        merged.energy = Math.max(Number(merged.energy) || 0, 35);
      }
      return merged;
    } catch (e) { return def; }
  }

  function writeState(st) {
    try {
      st.day = new Date().toISOString().slice(0, 10);
      localStorage.setItem(STATE_KEY(), JSON.stringify(st));
      var s = ses();
      if (s && s.doc) {
        var b = readBag();
        s.doc.world = Object.assign({}, s.doc.world || {}, st, { bag: b.items || {} });
        scheduleCloudSync();
      }
    } catch (e) { /* local only */ }
    updateEnergyChip();
    updateJobsBadge();
    updateStatusHud();
  }

  function getEnergy() { return readState().energy; }
  function addEnergy(n) {
    var st = readState();
    st.energy = Math.max(0, Math.min(st.maxEnergy || 100, (Number(st.energy) || 0) + n));
    writeState(st);
    var chip = $('w-energy');
    if (chip && n > 0) { chip.classList.remove('pop'); void chip.offsetWidth; chip.classList.add('pop'); }
    return st.energy;
  }
  function useEnergy(n) {
    var st = readState();
    if ((Number(st.energy) || 0) < n) return false;
    st.energy = Math.max(0, Number(st.energy) - n);
    writeState(st);
    return true;
  }

  function addBonusCoins(n) {
    var st = readState();
    st.bonusCoins = (Number(st.bonusCoins) || 0) + (Number(n) || 0);
    writeState(st);
    if (root.IslandShop && root.IslandShop.refresh) root.IslandShop.refresh();
    updateStatusHud(true);
  }

  function updateEnergyChip() {
    var el = $('w-energy-val');
    if (el) el.textContent = String(readState().energy);
  }

  function updateStatusHud(pop) {
    var thr = root.EAA_EVOLUTION_XP || [0, 30, 200, 500, 1000, 2000, 3500];
    var xp = 0;
    try { xp = App() && App().getEffectiveXP ? App().getEffectiveXP() : 0; } catch (e) { xp = 0; }
    var lvl = 1;
    for (var i = 0; i < thr.length; i++) {
      if (xp >= thr[i]) lvl = i + 1;
    }
    var curFloor = thr[lvl - 1] || 0;
    var nextCeil = thr[lvl] || null;
    var pct = 100;
    if (nextCeil && nextCeil > curFloor) {
      pct = Math.max(0, Math.min(100, Math.round(((xp - curFloor) / (nextCeil - curFloor)) * 100)));
    }
    var coins = (root.IslandShop && root.IslandShop.getCoins) ? root.IslandShop.getCoins() : 130;
    var lvlEl = $('w-lvl-txt'), xpEl = $('w-xp-fill'), coinEl = $('w-coin-txt'), statusEl = $('w-status'), muteEl = $('w-mute');
    if (lvlEl) lvlEl.textContent = 'Lv.' + lvl;
    if (xpEl) xpEl.style.width = pct + '%';
    if (coinEl) coinEl.textContent = 'ðŸª™ ' + coins;
    if (statusEl) {
      statusEl.title = 'Level ' + lvl + ' (' + xp + (nextCeil ? '/' + nextCeil : '') + ' XP) Â· ' + coins + ' Coins â€” Tap to open Store!';
      if (pop) {
        statusEl.classList.remove('pop'); void statusEl.offsetWidth; statusEl.classList.add('pop');
        setTimeout(function () { statusEl.classList.remove('pop'); }, 320);
      }
    }
    if (muteEl && root.IslandAudio && root.IslandAudio.isMuted) {
      muteEl.textContent = root.IslandAudio.isMuted() ? 'ðŸ”‡' : 'ðŸ”Š';
    }
  }

  function toggleWorldMute() {
    if (root.IslandAudio && root.IslandAudio.toggleMute) root.IslandAudio.toggleMute();
    if (App() && App().renderTopBar) App().renderTopBar();
    updateStatusHud();
  }

  function switchDemoPupil(pid) {
    if (!App() || !App().switchDemo) return;
    var mapWasOpen = !!$('wg-map-backdrop');
    App().switchDemo(pid);
    setTimeout(function () {
      if (root.IslandShop && root.IslandShop.refresh) root.IslandShop.refresh();
      updateEnergyChip();
      updateJobsBadge();
      updateStatusHud();
      if (W() && W().onSessionChanged) W().onSessionChanged();
      if (mapWasOpen) openWorldMap();
    }, 80);
  }

  /* Read/write materials bag shared with world.js + synced to ses().doc.world.bag */
  function readBag() {
    try {
      var raw = JSON.parse(localStorage.getItem(BAG_KEY())) || { items: {}, day: '', taken: {} };
      var s = ses();
      if (s && s.doc && s.doc.world && s.doc.world.bag) {
        raw.items = raw.items || {};
        Object.keys(s.doc.world.bag).forEach(function (k) {
          if (raw.items[k] === undefined) raw.items[k] = Number(s.doc.world.bag[k]) || 0;
        });
      }
      return raw;
    } catch (e) { return { items: {}, day: '', taken: {} }; }
  }
  function writeBag(b) {
    try {
      localStorage.setItem(BAG_KEY(), JSON.stringify(b));
      var s = ses();
      if (s && s.doc) {
        s.doc.world = Object.assign({}, s.doc.world || {}, readState(), { bag: b.items || {} });
        scheduleCloudSync();
      }
    } catch (e) { /* ignore */ }
    if (W() && W().drawBag) W().drawBag();
    updateJobsBadge();
    if (W() && W().refreshVillagers) W().refreshVillagers();
  }

  function hasMaterials(cost) {
    var b = readBag().items || {};
    return Object.keys(cost || {}).every(function (k) { return (Number(b[k]) || 0) >= cost[k]; });
  }
  function spendMaterials(cost) {
    var b = readBag(); b.items = b.items || {};
    Object.keys(cost || {}).forEach(function (k) { b.items[k] = Math.max(0, (Number(b.items[k]) || 0) - cost[k]); });
    writeBag(b);
  }
  function giveMaterials(drop) {
    var b = readBag(); b.items = b.items || {};
    Object.keys(drop || {}).forEach(function (k) { b.items[k] = (Number(b.items[k]) || 0) + drop[k]; });
    writeBag(b);
  }

  function updateJobsBadge() {
    var badge = $('w-jobs-badge');
    if (!badge) return;
    var st = readState();
    var readyCount = VILLAGERS.filter(function (v) {
      return !(st.jobsDone && st.jobsDone[v.id]) && hasMaterials(v.need);
    }).length;
    if (readyCount > 0) {
      badge.textContent = String(readyCount);
      badge.hidden = false;
    } else {
      badge.hidden = true;
    }
  }

  function costPillsHtml(cost, items) {
    var keys = Object.keys(cost || {});
    if (!keys.length) return '<span class="wg-cost-pill ok">Free!</span>';
    return keys.map(function (k) {
      var have = Number((items || {})[k]) || 0, need = cost[k], ok = have >= need;
      return '<span class="wg-cost-pill ' + (ok ? 'ok' : 'short') + '"><img src="' + FLAT + (MAT_ICONS[k] || 'i_wood') + '.webp" alt="">' + have + '/' + need + ' ' + esc(k) + '</span>';
    }).join('');
  }

  function modalRoot() { return $('isl-modal-root'); }
  function closeModal() {
    sound('playTap');
    stopSportsLoop();
    if (modalRoot()) modalRoot().innerHTML = '';
    document.body.classList.remove('isl-modal-open');
  }

  /* ---------- 2. Floating-Island World Map Modal (m_island_* on t_map_sea) ---------- */
  var ZONE_GRAMMAR_TIPS = {
    3: {
      1: { word: 'It cleans the floor.', meaning: 'what a machine or helper does (Unit 1)' },
      2: { word: 'I am thankful for my family.', meaning: 'how we say thank you (Unit 2)' },
      3: { word: 'How much is it? It is ten riyals.', meaning: 'asking and telling the price (Unit 3)' },
      4: { word: 'First, we mixed the water.', meaning: 'telling what happened in order (Unit 4)' }
    },
    4: {
      1: { word: 'I like adventure books because they are exciting.', meaning: 'talking about books we love (Unit 1)' },
      2: { word: 'Camels live in the desert.', meaning: 'animal habitats and where they live (Unit 2)' },
      3: { word: 'Can I have a sandwich, please?', meaning: 'ordering food politely (Unit 3)' },
      4: { word: 'Yesterday, I visited the museum.', meaning: 'talking about past events (Unit 4)' }
    }
  };

  function zoneProgressBadge(z) {
    var s = ses();
    if (!s || !s.doc) return '';
    if (z === 0) {
      var st = readState();
      var tier = HOUSE_TIERS[Math.max(0, Math.min(HOUSE_TIERS.length - 1, (st.houseTier || 1) - 1))];
      return 'ðŸ¡ ' + tier.name + ' Â· ' + ((st.placed && st.placed.length) || 0) + ' items';
    }
    var g = s.grade || 3;
    var zm = root.IslandData.getZoneMissions(g, z, false);
    var stars = (s.doc && s.doc.stars) || {};
    var done = 0, totalStars = 0;
    (zm.regular || []).forEach(function (m) {
      var n = Number(stars[m.id]) || 0;
      if (n > 0) done++;
      totalStars += n;
    });
    var chestDone = !!(s.doc.chests && s.doc.chests['z' + z]);
    if (chestDone) return 'ðŸš Done! Â· â˜… ' + totalStars + '/15';
    return 'â­ ' + done + '/5 Stops' + (totalStars ? ' Â· â˜… ' + totalStars : '');
  }

  function openWorldMap() {
    sound('playTap');
    var s = ses() || {};
    var g = s.grade || 3;
    var curZone = (W() && W().S && W().S.zone !== undefined) ? W().S.zone : 1;
    var isOpen = function (z) { return z <= 1 || (W() && W().isOpen && W().isOpen(z)); };
    var islands = [
      { z: 0, name: 'My Home Island',   sub: 'Build Â· Craft Â· Garden', img: 'm_island_home',    x: 20, y: 74, open: true },
      { z: 1, name: 'Sunny Meadow',     sub: 'Unit 1 Â· Grandpa Bolt',  img: 'm_island_meadow',  x: 50, y: 27, open: true },
      { z: 2, name: 'Lighthouse Beach', sub: 'Unit 2 Â· Lulu',          img: 'm_island_beach',   x: 80, y: 27, open: isOpen(2) },
      { z: 3, name: 'Treehouse Forest', sub: 'Unit 3 Â· Mr. Nutty',     img: 'm_island_forest',  x: 50, y: 74, open: isOpen(3) },
      { z: 4, name: 'Volcano Peak',     sub: 'Unit 4 Â· Ember',         img: 'm_island_volcano', x: 80, y: 74, open: isOpen(4) }
    ];
    var nodesHtml = islands.map(function (isl) {
      var here = curZone === isl.z;
      var prog = isl.open ? zoneProgressBadge(isl.z) : '';
      return '<button type="button" class="wg-map-node' + (isl.open ? '' : ' locked') + (here ? ' here' : '') + '" style="left:' + isl.x + '%;top:' + isl.y + '%" onclick="WorldGame.jumpZone(' + isl.z + ')">' +
        '<img src="' + FLAT + isl.img + '.webp" class="wg-map-isl-pic" alt="">' +
        (!isl.open ? '<img src="' + FLAT + 'o_cloud_lock.webp" class="wg-map-lock" alt="">' : '') +
        (here ? '<span class="wg-map-here">ðŸ“ You are here</span>' : '') +
        '<span class="wg-map-label"><b>' + esc(isl.name) + '</b><small>' + esc(isl.open ? isl.sub : 'ðŸ”’ Finish 4 stops in Zone ' + (isl.z - 1)) + '</small>' + (prog ? '<em>' + esc(prog) + '</em>' : '') + '</span>' +
      '</button>';
    }).join('');

    var plazaBtn = '<button type="button" class="wg-map-node" style="left:20%;top:27%" onclick="WorldGame.closeModal(); if(window.IslandWall) IslandWall.open()">' +
      '<img src="' + FLAT + 'm_island_plaza.webp" class="wg-map-isl-pic" alt="">' +
      '<span class="wg-map-label"><b>ðŸŒŸ Class Plaza</b><small>Friends Â· Hangout</small><em>ðŸ‘‹ Visit Classmates</em></span>' +
    '</button>';

    var pipTipObj = (s.doc && s.doc.pipTip) || ((ZONE_GRAMMAR_TIPS[g] || ZONE_GRAMMAR_TIPS[3])[Math.max(1, curZone)] || ZONE_GRAMMAR_TIPS[3][1]);
    var tipSpeak = 'Captain Pip says: Remember, ' + pipTipObj.word + ' â€” ' + pipTipObj.meaning + '!';
    var pipBannerHtml =
      '<div class="wg-map-tip">' +
        '<span style="font-size:1.45rem">ðŸ¦œ</span>' +
        '<div style="flex:1;min-width:0"><b>ðŸ’¡ Captain Pip\'s Helpful Tip:</b> Remember: <b>"' + esc(pipTipObj.word) + '"</b> â€” ' + esc(pipTipObj.meaning) + '!</div>' +
        '<button type="button" class="isl-btn cyan" style="min-height:34px;padding:4px 10px;font-size:0.82rem;flex:none" onclick="IslandAudio.speak(\'' + esc(tipSpeak) + '\', null, \'pip\')">ðŸ”Š Hear Tip</button>' +
      '</div>';

    var demoBtns = '';
    if (s.isDemo && s.student) {
      var curId = s.student.id;
      demoBtns =
        '<div style="display:flex;gap:4px;align-items:center;background:rgba(2,6,23,.65);padding:3px 6px;border-radius:12px;border:1px solid rgba(255,255,255,.14)">' +
          '<button type="button" class="isl-btn ' + (curId === 'demo-g3' ? 'cyan' : '') + '" style="min-height:34px;padding:3px 9px;font-size:0.8rem" onclick="WorldGame.switchDemoPupil(\'demo-g3\')">G3</button>' +
          '<button type="button" class="isl-btn ' + (curId === 'demo-g4' ? 'cyan' : '') + '" style="min-height:34px;padding:3px 9px;font-size:0.8rem" onclick="WorldGame.switchDemoPupil(\'demo-g4\')">G4</button>' +
          '<button type="button" class="isl-btn ' + (curId === 'demo-star' ? 'amber' : '') + '" style="min-height:34px;padding:3px 9px;font-size:0.8rem" onclick="WorldGame.switchDemoPupil(\'demo-star\')">â­ Star</button>' +
        '</div>';
    }

    document.body.classList.add('isl-modal-open');
    modalRoot().innerHTML =
      '<div class="isl-modal-backdrop" id="wg-map-backdrop">' +
        '<div class="isl-card-modal wg-map-modal" style="background-image:url(' + FLAT + 't_map_sea.webp)">' +
          '<div class="isl-mission-top wg-map-top">' +
            '<div style="font-size:1.3rem;font-weight:800;display:flex;align-items:center;gap:8px"><img src="' + FLAT + 'u_map.webp" style="width:34px;height:34px;object-fit:contain" alt=""> Practice Island World Map</div>' +
            demoBtns +
            '<div style="margin-left:auto;display:flex;gap:6px;flex-wrap:wrap;align-items:center">' +
              '<button type="button" class="isl-btn emerald" style="min-height:38px;padding:5px 11px;font-size:0.86rem" onclick="WorldGame.openSportsArena(\'soccer\', \'4v4\')">âš½ Sports Arena</button>' +
              '<button type="button" class="isl-btn amber" style="min-height:38px;padding:5px 11px;font-size:0.86rem" onclick="WorldGame.closeModal(); if(window.IslandRewards) IslandRewards.openStickerBook()">ðŸ“’ Sticker Book</button>' +
              '<button type="button" class="isl-btn emerald" style="min-height:38px;padding:5px 11px;font-size:0.86rem" onclick="WorldGame.closeModal(); if(window.IslandRewards) IslandRewards.openCorner()">ðŸ–ï¸ Trophy Camp</button>' +
              '<a class="isl-btn cyan" style="min-height:38px;padding:5px 11px;font-size:0.86rem;text-decoration:none;display:inline-flex;align-items:center" href="../index.html">ðŸ« School Hub</a>' +
              '<button type="button" class="isl-btn" style="min-height:38px;min-width:40px;padding:5px 10px" onclick="WorldGame.closeModal()">âœ•</button>' +
            '</div>' +
          '</div>' +
          pipBannerHtml +
          '<div class="wg-map-canvas">' + plazaBtn + nodesHtml + '</div>' +
        '</div>' +
      '</div>';
  }

  function jumpZone(z) {
    if (z > 1 && W() && W().isOpen && !W().isOpen(z)) {
      sound('playSoftFail');
      say('Finish four stops in the previous place first!');
      return;
    }
    closeModal();
    if (W() && W().goZone) W().goZone(z, 0);
  }

  function goClassicMap() {
    root.location.href = '../index.html';
  }

  /* ---------- 3. 3-Question Energy Charge Burst (âš¡ Energy for Finishing!) ---------- */
  var energyRun = null;

  function pickQuestions(count, zoneNum) {
    var s = ses(), g = (s && s.grade) || 3, z = Math.max(1, Math.min(4, zoneNum || (W() && W().S && W().S.zone) || 1));
    var zm = root.IslandData.getZoneMissions(g, z, false);
    var pool = [];
    (zm.regular || []).forEach(function (m) {
      (m.questions || []).forEach(function (q) {
        if ((q.type === 'listen' || q.type === 'read') && Array.isArray(q.options) && q.options.length) pool.push(q);
      });
    });
    var out = [], start = Math.floor(Math.random() * Math.max(1, pool.length));
    for (var i = 0; i < count && pool.length; i++) {
      out.push(pool[(start + i * 3) % pool.length]);
    }
    return out;
  }

  function openEnergyCharge(reasonText) {
    sound('playTap');
    var qs = pickQuestions(3);
    energyRun = { qs: qs, idx: 0, reason: reasonText || 'Answer 3 quick English questions to get +30 Energy!' };
    renderEnergyStep();
  }

  function renderEnergyStep() {
    if (!energyRun) return;
    document.body.classList.add('isl-modal-open');
    if (energyRun.idx >= energyRun.qs.length) {
      var wasBoost = !!energyRun.isBuilderBoost;
      var afterSport = energyRun.afterSport || null;
      energyRun = null;
      if (wasBoost) {
        giveMaterials({ wood: 2, stone: 2, flower: 2, shell: 1, berry: 1, crystal: 1 });
        addEnergy(15);
        sound('playFanfare');
        say('Smart Builder Boost complete! You earned building materials and fifteen energy!');
        openWorkshop(workshopTab || 'blueprints');
        return;
      }
      var newE = addEnergy(30);
      sound('playFanfare');
      say('Great job! Plus thirty energy!');
      if (afterSport) {
        openSportsArena(afterSport.sport, afterSport.mode);
        return;
      }
      modalRoot().innerHTML =
        '<div class="isl-modal-backdrop" id="wg-energy-backdrop">' +
          '<div class="isl-card-modal" style="max-width:480px;text-align:center">' +
            '<img src="' + FLAT + 'i_energy.webp" style="width:88px;height:88px;object-fit:contain;animation:idleBob 1.2s ease-in-out infinite" alt="">' +
            '<h2 style="margin:6px 0;font-size:1.8rem;color:#fde047">+30 Energy Charged! âš¡</h2>' +
            '<p style="color:#cbd5e1;font-size:1.08rem;margin:0 0 16px">You now have <b style="color:#fde047">âš¡ ' + newE + ' Energy</b> to harvest trees, build, or play Sports!</p>' +
            '<button type="button" class="isl-btn emerald" id="wg-energy-done" style="min-width:190px;font-size:1.15rem" onclick="WorldGame.closeModal()">Let\'s Go! ðŸš€</button>' +
          '</div>' +
        '</div>';
      return;
    }
    var q = energyRun.qs[energyRun.idx];
    var promptText = q.q || (q.type === 'listen' ? (q.pic ? q.pic + ' ' : '') + 'Listen and tap: "' + (q.word || q.a) + '"' : q.prompt);
    var speakText = q.speak || q.word || q.q || promptText;
    var opts = q.options || q.choices || [];
    var choices = opts.map(function (c, idx) {
      var label = typeof c === 'object' ? (c.word || c.text || c.label) : String(c);
      var pic = typeof c === 'object' && c.pic ? '<span style="font-size:1.5rem;margin-right:6px">' + esc(c.pic) + '</span>' : '';
      return '<button type="button" class="isl-btn wg-choice-btn" data-idx="' + idx + '" onclick="WorldGame.answerEnergy(' + idx + ',this)">' + pic + '<span>' + esc(label) + '</span></button>';
    }).join('');

    modalRoot().innerHTML =
      '<div class="isl-modal-backdrop" id="wg-energy-backdrop">' +
        '<div class="isl-card-modal" style="max-width:540px">' +
          '<div class="isl-mission-top">' +
            '<div style="display:flex;align-items:center;gap:8px;font-size:1.25rem;font-weight:800;color:#fde047"><img src="' + FLAT + 'i_energy.webp" style="width:34px;height:34px;object-fit:contain" alt=""> Energy Charge (' + (energyRun.idx + 1) + ' / ' + energyRun.qs.length + ')</div>' +
            '<button type="button" class="isl-btn" style="margin-left:auto;min-height:42px;min-width:44px;padding:6px 12px" onclick="WorldGame.closeModal()">âœ•</button>' +
          '</div>' +
          '<div style="color:#bae6fd;font-size:0.92rem;font-weight:700;margin-bottom:8px">' + esc(energyRun.reason) + '</div>' +
          '<div class="wg-q-card">' +
            '<button type="button" class="isl-btn amber" style="min-height:44px;padding:6px 14px;margin-bottom:10px" onclick="IslandAudio.speak(\'' + esc(speakText) + '\')">ðŸ”Š Listen</button>' +
            '<div style="font-size:1.35rem;font-weight:800;color:#fff;margin-bottom:14px">' + esc(promptText) + '</div>' +
            '<div class="wg-choices-grid">' + choices + '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    say(speakText);
  }

  function answerEnergy(idx, btnEl) {
    if (!energyRun) return;
    var q = energyRun.qs[energyRun.idx];
    var opts = q.options || q.choices || [];
    var chosen = opts[idx];
    var chosenVal = typeof chosen === 'object' ? (chosen.word || chosen.text || chosen.label) : String(chosen);
    var correctVal = q.answer || q.word || q.a;
    if (String(chosenVal).trim().toLowerCase() === String(correctVal).trim().toLowerCase()) {
      sound('playCorrect');
      energyRun.idx++;
      renderEnergyStep();
    } else {
      sound('playSoftFail');
      if (btnEl) {
        btnEl.classList.remove('wobble'); void btnEl.offsetWidth; btnEl.classList.add('wobble');
        btnEl.style.opacity = '0.45';
      }
      say('Listen again: ' + (q.speak || correctVal));
    }
  }

  /* ---------- 4. Full-Screen Home & Crafting Studio (Inside Room, Outside Garden, Live Drag-and-Drop, Furniture Upgrades & Smart Blueprints) ---------- */
  var workshopTab = 'blueprints';
  var craftFilter = 'all';
  var studioView = 'inside'; // 'inside' (Indoor Room) or 'outside' (Outdoor Garden)
  var studioSelectedIdx = -1;
  var studioDragState = null;

  var PLOT_X0 = 400, PLOT_W = 1650, PLOT_Y0 = 360, PLOT_H = 990;
  var ROOM_X0 = 520, ROOM_W = 1360, ROOM_Y0 = 340, ROOM_H = 840;

  /* Grandpa Bolt's 6 Smart English Design Blueprints */
  var BLUEPRINTS = [
    {
      id: 'bp_bedroom',
      title: '1. The Cosy Bedroom',
      view: 'inside',
      clue: 'Inside your room, put a Cosy Bed on the LEFT side and a Striped Rug in the MIDDLE or RIGHT!',
      coins: 25, energy: 20, xp: 10,
      checks: [
        { label: 'Place a Cosy Bed inside on the left', test: function (st) { return (st.placed || []).some(function (p) { return p.id === 'f_bed' && p.x < 1200; }); } },
        { label: 'Place a Striped Rug in the middle/right', test: function (st) { return (st.placed || []).some(function (p) { return p.id === 'f_rug' && p.x >= 1050; }); } }
      ]
    },
    {
      id: 'bp_study',
      title: '2. Study & Reading Corner',
      view: 'inside',
      clue: 'Every smart student needs a study spot! Place a Round Table, a Cushion Chair, and a Warm Lamp inside your room.',
      coins: 30, energy: 25, xp: 15,
      checks: [
        { label: 'Place a Round Table inside', test: function (st) { return (st.placed || []).some(function (p) { return p.id === 'f_table'; }); } },
        { label: 'Place a Cushion Chair inside', test: function (st) { return (st.placed || []).some(function (p) { return p.id === 'f_chair'; }); } },
        { label: 'Place a Warm Lamp inside', test: function (st) { return (st.placed || []).some(function (p) { return p.id === 'f_lamp'; }); } }
      ]
    },
    {
      id: 'bp_hut',
      title: '3. The Builder\'s Hut & Star Upgrade',
      view: 'inside',
      clue: 'Upgrade your home to Level 2 (Straw Hut) and upgrade ANY placed furniture item to Lv.2 Deluxe (â˜…â˜…)!',
      coins: 35, energy: 25, xp: 15,
      checks: [
        { label: 'Upgrade House to Level 2+ (Straw Hut)', test: function (st) { return (Number(st.houseTier) || 1) >= 2; } },
        { label: 'Upgrade any placed item to Lv.2 Deluxe (â˜…â˜…)', test: function (st) { return (st.placed || []).some(function (p) { return (Number(p.lvl) || 1) >= 2; }); } }
      ]
    },
    {
      id: 'bp_garden',
      title: '4. Sunny Welcome Garden',
      view: 'outside',
      clue: 'Let us decorate outside! Place a Red Mailbox, a Flowerbed, and a Garden Bench in your outdoor yard.',
      coins: 35, energy: 30, xp: 15,
      checks: [
        { label: 'Place a Red Mailbox outside', test: function (st) { return (st.placed || []).some(function (p) { return p.id === 'g_mailbox'; }); } },
        { label: 'Place a Flowerbed outside', test: function (st) { return (st.placed || []).some(function (p) { return p.id === 'g_flowerbed'; }); } },
        { label: 'Place a Garden Bench outside', test: function (st) { return (st.placed || []).some(function (p) { return p.id === 'g_bench'; }); } }
      ]
    },
    {
      id: 'bp_park',
      title: '5. Playground & Pet Park',
      view: 'outside',
      clue: 'Make a fun yard for your pet companion! Place a Pet House, a Wooden Swing, and an Apple Tree outside.',
      coins: 45, energy: 35, xp: 20,
      checks: [
        { label: 'Place a Pet House outside', test: function (st) { return (st.placed || []).some(function (p) { return p.id === 'g_pethouse'; }); } },
        { label: 'Place a Wooden Swing outside', test: function (st) { return (st.placed || []).some(function (p) { return p.id === 'g_swing'; }); } },
        { label: 'Place an Apple Tree outside', test: function (st) { return (st.placed || []).some(function (p) { return p.id === 'g_tree'; }); } }
      ]
    },
    {
      id: 'bp_master',
      title: '6. Royal Master Architect',
      view: 'outside',
      clue: 'Upgrade your home to Level 3+ (Cottage, House, or Castle) and build a Lily Pond or Stone Fountain outside!',
      coins: 60, energy: 50, xp: 25,
      checks: [
        { label: 'Upgrade House to Level 3+ (Red-Roof Cottage)', test: function (st) { return (Number(st.houseTier) || 1) >= 3; } },
        { label: 'Place a Lily Pond or Stone Fountain outside', test: function (st) { return (st.placed || []).some(function (p) { return p.id === 'g_pond' || p.id === 'g_fountain'; }); } }
      ]
    }
  ];

  var SMART_BUILDER_QS = [
    { q: 'Where do we sleep at night inside our house?', speak: 'Where do we sleep at night inside our house?', a: 'On the cosy bed', options: ['On the cosy bed', 'In the mailbox', 'Under the pond', 'On the fence'] },
    { q: 'What gives warm light when the room is dark?', speak: 'What gives warm light when the room is dark?', a: 'A warm lamp', options: ['A warm lamp', 'A stone', 'A wooden swing', 'A flowerbed'] },
    { q: 'Where do we put chairs so we can eat or read?', speak: 'Where do we put chairs so we can eat or read?', a: 'Next to the round table', options: ['Next to the round table', 'On the roof', 'Inside the mailbox', 'Under the tree'] },
    { q: 'What grows red fruit outside in the sunny garden?', speak: 'What grows red fruit outside in the sunny garden?', a: 'An apple tree', options: ['An apple tree', 'A striped rug', 'A cushion chair', 'A warm lamp'] },
    { q: 'Where does your pet sleep in the garden?', speak: 'Where does your pet sleep in the garden?', a: 'In the pet house', options: ['In the pet house', 'On the lamp', 'In the mailbox', 'On the fence'] },
    { q: 'What is soft and colourful on the wooden floor?', speak: 'What is soft and colourful on the wooden floor?', a: 'A striped rug', options: ['A striped rug', 'A stone fountain', 'A white fence', 'A mailbox'] }
  ];

  function openWorkshop(tab) {
    sound('playTap');
    stopSportsLoop();
    if (W() && W().closeDecorDock) W().closeDecorDock(true);
    if (tab) workshopTab = tab;
    if (W() && W().S && W().S.zone === 0 && !tab) {
      studioView = W().S.inHouse ? 'inside' : studioView;
    }
    var st = readState();
    if (studioSelectedIdx >= (st.placed || []).length) studioSelectedIdx = -1;
    renderWorkshop();
  }

  function setStudioView(v) {
    sound('playTap');
    studioView = (v === 'outside') ? 'outside' : 'inside';
    studioSelectedIdx = -1;
    renderWorkshop();
  }

  function setCraftFilter(f) {
    sound('playTap');
    craftFilter = f || 'all';
    if (f === 'patio') studioView = 'inside';
    else if (f === 'garden') studioView = 'outside';
    renderWorkshop();
  }

  function selectStudioPlaced(idx, ev) {
    if (ev && ev.stopPropagation) ev.stopPropagation();
    if (studioDragState && studioDragState.moved) return;
    sound('playTap');
    var st = readState();
    if (idx >= 0 && st.placed && st.placed[idx]) {
      var rec = RECIPES.filter(function (r) { return r.id === st.placed[idx].id; })[0];
      if (rec) studioView = (rec.kind === 'patio') ? 'inside' : 'outside';
    }
    studioSelectedIdx = (studioSelectedIdx === idx) ? -1 : idx;
    renderWorkshop();
  }

  function focusPlacedItem(id) {
    sound('playTap');
    var st = readState();
    var foundIdx = -1;
    (st.placed || []).forEach(function (p, i) { if (p.id === id && foundIdx === -1) foundIdx = i; });
    if (foundIdx >= 0) {
      var rec = RECIPES.filter(function (r) { return r.id === id; })[0];
      if (rec) studioView = (rec.kind === 'patio') ? 'inside' : 'outside';
      studioSelectedIdx = foundIdx;
      renderWorkshop();
    }
  }

  function clientToWorldCoords(clientX, clientY, isIndoor) {
    var canvas = document.getElementById('wg-studio-canvas');
    if (!canvas) return null;
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    var rx = Math.max(0.06, Math.min(0.94, (clientX - rect.left) / rect.width));
    var ry = Math.max(0.16, Math.min(0.92, (clientY - rect.top) / rect.height));
    var wx, wy;
    if (isIndoor) {
      wx = Math.round(ROOM_X0 + rx * ROOM_W);
      wy = Math.round(ROOM_Y0 + ry * ROOM_H);
      wx = Math.max(610, Math.min(1790, wx));
      wy = Math.max(585, Math.min(1080, wy));
    } else {
      wx = Math.round(PLOT_X0 + rx * PLOT_W);
      wy = Math.round(PLOT_Y0 + ry * PLOT_H);
      if (wx > 1020 && wx < 1320 && wy > 450 && wy < 735) wy = 785;
    }
    return { wx: wx, wy: wy, leftPct: (rx * 100).toFixed(1), topPct: (ry * 100).toFixed(1) };
  }

  function startStudioDrag(idx, ev) {
    if (ev && ev.stopPropagation) ev.stopPropagation();
    var st = readState();
    if (!st.placed || !st.placed[idx]) return;
    var item = st.placed[idx];
    var rec = RECIPES.filter(function (r) { return r.id === item.id; })[0];
    var btnEl = ev.currentTarget || (ev.target && ev.target.closest ? ev.target.closest('.wg-studio-item') : null);
    studioSelectedIdx = idx;
    studioDragState = {
      idx: idx,
      isIndoor: !!(rec && rec.kind === 'patio'),
      startX: ev.clientX,
      startY: ev.clientY,
      moved: false,
      wx: item.x,
      wy: item.y,
      el: btnEl
    };
    if (btnEl && btnEl.setPointerCapture && ev.pointerId !== undefined) {
      try { btnEl.setPointerCapture(ev.pointerId); } catch (e) {}
    }
  }

  function moveStudioDrag(ev) {
    if (!studioDragState) return;
    var dist = Math.hypot(ev.clientX - studioDragState.startX, ev.clientY - studioDragState.startY);
    if (!studioDragState.moved && dist > 5) {
      studioDragState.moved = true;
      if (studioDragState.el) studioDragState.el.classList.add('selected', 'dragging');
    }
    if (studioDragState.moved) {
      var mapped = clientToWorldCoords(ev.clientX, ev.clientY, studioDragState.isIndoor);
      if (!mapped) return;
      studioDragState.wx = mapped.wx;
      studioDragState.wy = mapped.wy;
      if (studioDragState.el) {
        studioDragState.el.style.left = mapped.leftPct + '%';
        studioDragState.el.style.top = mapped.topPct + '%';
        studioDragState.el.style.zIndex = '99';
      }
    }
  }

  function endStudioDrag(ev) {
    if (!studioDragState) return;
    var ds = studioDragState;
    if (ds.moved) {
      var st = readState();
      if (st.placed && st.placed[ds.idx]) {
        st.placed[ds.idx].x = ds.wx;
        st.placed[ds.idx].y = ds.wy;
        writeState(st);
        sound('playPop');
        if (W() && W().refreshHome) W().refreshHome(false);
      }
      setTimeout(function () { studioDragState = null; }, 40);
      renderWorkshop();
    } else {
      studioDragState = null;
    }
  }

  function tapStudioStage(ev) {
    if (studioDragState && studioDragState.moved) return;
    if (studioSelectedIdx < 0) return;
    var st = readState();
    var item = st.placed && st.placed[studioSelectedIdx];
    if (!item) return;
    var rec = RECIPES.filter(function (r) { return r.id === item.id; })[0];
    var mapped = clientToWorldCoords(ev.clientX, ev.clientY, !!(rec && rec.kind === 'patio'));
    if (!mapped) return;
    item.x = mapped.wx;
    item.y = mapped.wy;
    writeState(st);
    sound('playPop');
    if (W() && W().refreshHome) W().refreshHome(false);
    renderWorkshop();
  }

  function nudgeStudioItem(dx, dy, ev) {
    if (ev && ev.stopPropagation) ev.stopPropagation();
    var st = readState();
    if (studioSelectedIdx < 0 || !st.placed || !st.placed[studioSelectedIdx]) return;
    var item = st.placed[studioSelectedIdx];
    var rec = RECIPES.filter(function (r) { return r.id === item.id; })[0];
    var isIndoor = !!(rec && rec.kind === 'patio');
    var nx = item.x + dx;
    var ny = item.y + dy;
    if (isIndoor) {
      nx = Math.max(610, Math.min(1790, nx));
      ny = Math.max(585, Math.min(1080, ny));
    } else {
      nx = Math.max(420, Math.min(2000, nx));
      ny = Math.max(400, Math.min(1320, ny));
    }
    item.x = Math.round(nx);
    item.y = Math.round(ny);
    writeState(st);
    sound('playPop');
    if (W() && W().refreshHome) W().refreshHome(false);
    renderWorkshop();
  }

  function flipStudioItem(ev) {
    if (ev && ev.stopPropagation) ev.stopPropagation();
    var st = readState();
    if (studioSelectedIdx >= 0 && st.placed && st.placed[studioSelectedIdx]) {
      st.placed[studioSelectedIdx].flip = !st.placed[studioSelectedIdx].flip;
      writeState(st);
      sound('playPop');
      if (W() && W().refreshHome) W().refreshHome(false);
      renderWorkshop();
    }
  }

  function upgradeStudioItem(ev) {
    if (ev && ev.stopPropagation) ev.stopPropagation();
    var st = readState();
    if (studioSelectedIdx < 0 || !st.placed || !st.placed[studioSelectedIdx]) return;
    var item = st.placed[studioSelectedIdx];
    var curLv = Math.max(1, Math.min(3, Number(item.lvl) || 1));
    if (curLv >= 3) return;
    var upCost = curLv === 1 ? { wood: 1, flower: 1 } : { stone: 1, crystal: 1 };
    if (!hasMaterials(upCost)) {
      sound('playSoftFail');
      say('Need more materials! Try the Smart Builder Quiz!');
      return;
    }
    spendMaterials(upCost);
    item.lvl = curLv + 1;
    writeState(st);
    addEnergy(10);
    sound('playFanfare');
    var rec = RECIPES.filter(function (r) { return r.id === item.id; })[0];
    say('Awesome! Upgraded ' + (rec ? rec.name : 'furniture') + ' to Level ' + item.lvl + '!');
    if (W() && W().refreshHome) W().refreshHome(true);
    renderWorkshop();
  }

  function storeStudioItem(ev) {
    if (ev && ev.stopPropagation) ev.stopPropagation();
    var st = readState();
    if (studioSelectedIdx >= 0 && st.placed && st.placed[studioSelectedIdx]) {
      st.placed.splice(studioSelectedIdx, 1);
      studioSelectedIdx = -1;
      writeState(st);
      sound('playCorrect');
      say('Stored in your bag!');
      if (W() && W().refreshHome) W().refreshHome(false);
      renderWorkshop();
    }
  }

  function seeHomeInWorld(insideRoom) {
    var wantInside = (insideRoom !== undefined) ? !!insideRoom : (studioView === 'inside');
    sound('playFanfare');
    closeModal();
    if (W()) {
      if (W().S && W().S.zone === 0 && !!W().S.inHouse === wantInside) {
        if (W().refreshHome) W().refreshHome(true);
      } else if (W().goZone) {
        W().goZone(0, 0, wantInside);
      }
    }
  }

  function claimBlueprint(bpId) {
    var st = readState();
    st.blueprintsDone = st.blueprintsDone || {};
    if (st.blueprintsDone[bpId]) return;
    var bp = BLUEPRINTS.filter(function (b) { return b.id === bpId; })[0];
    if (!bp) return;
    var allOk = bp.checks.every(function (c) { return c.test(st); });
    if (!allOk) return;
    st.blueprintsDone[bpId] = 1;
    writeState(st);
    addBonusCoins(bp.coins);
    addEnergy(bp.energy);
    if (App() && App().awardIslandXP) App().awardIslandXP(bp.xp, 'blueprint_' + bpId);
    updateStatusHud();
    sound('playFanfare');
    say('Awesome job, Smart Architect! You completed ' + bp.title + '!');
    renderWorkshop();
  }

  function openSmartBuilderQuiz() {
    sound('playTap');
    var pool = SMART_BUILDER_QS.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 3);
    energyRun = {
      qs: pool,
      idx: 0,
      isBuilderBoost: true,
      reason: 'ðŸ§  Smart Builder Boost: Answer 3 English questions to earn +2 Wood, +2 Stone, +2 Flower, +1 Shell, +1 Berry & +1 Crystal!'
    };
    document.body.classList.add('isl-modal-open');
    renderEnergyStep();
  }

  function renderWorkshop() {
    var st = readState(), bag = readBag().items || {};
    st.blueprintsDone = st.blueprintsDone || {};
    var curTier = HOUSE_TIERS[Math.max(0, Math.min(HOUSE_TIERS.length - 1, (st.houseTier || 1) - 1))];
    var nextTier = HOUSE_TIERS[st.houseTier || 1] || null;
    var placed = st.placed || [];
    var indoorPlaced = placed.filter(function (p) { var r = RECIPES.filter(function (x) { return x.id === p.id; })[0]; return r && r.kind === 'patio'; });
    var gardenPlaced = placed.filter(function (p) { var r = RECIPES.filter(function (x) { return x.id === p.id; })[0]; return r && r.kind === 'garden'; });
    var bpDoneCount = BLUEPRINTS.filter(function (b) { return !!st.blueprintsDone[b.id]; }).length;
    var starUpgrades = placed.reduce(function (acc, p) { return acc + ((Number(p.lvl) || 1) - 1) * 2; }, 0);
    var comfortStars = (curTier.level * 2) + placed.length + starUpgrades + (bpDoneCount * 3);

    var matBar = Object.keys(MAT_ICONS).map(function (k) {
      return '<span class="wg-mat-chip"><img src="' + FLAT + MAT_ICONS[k] + '.webp" alt="" draggable="false"><b>' + (Number(bag[k]) || 0) + '</b><small>' + k + '</small></span>';
    }).join('');

    var stageItemsHtml = placed.map(function (p, idx) {
      var rec = RECIPES.filter(function (r) { return r.id === p.id; })[0];
      if (!rec) return '';
      if (studioView === 'inside' && rec.kind !== 'patio') return '';
      if (studioView === 'outside' && rec.kind !== 'garden') return '';
      var x0 = (studioView === 'inside') ? ROOM_X0 : PLOT_X0;
      var wSpan = (studioView === 'inside') ? ROOM_W : PLOT_W;
      var y0 = (studioView === 'inside') ? ROOM_Y0 : PLOT_Y0;
      var hSpan = (studioView === 'inside') ? ROOM_H : PLOT_H;
      var leftPct = Math.max(5, Math.min(95, ((p.x - x0) / wSpan) * 100)).toFixed(1);
      var topPct = Math.max(14, Math.min(92, ((p.y - y0) / hSpan) * 100)).toFixed(1);
      var itemLv = Math.max(1, Math.min(3, Number(p.lvl) || 1));
      var lvScale = 1 + (itemLv - 1) * 0.12;
      var hPx = Math.round((rec.h || 110) * (studioView === 'inside' ? 0.44 : 0.36) * lvScale);
      var isSel = (idx === studioSelectedIdx);
      var zIdx = rec.flat ? 4 : Math.round(topPct);
      var starsBadge = itemLv > 1 ? '<span class="wg-item-lv-pill">' + 'â˜…'.repeat(itemLv) + '</span>' : '';
      return '<button type="button" class="wg-studio-item' + (isSel ? ' selected' : '') + ' lv-' + itemLv + '" style="left:' + leftPct + '%;top:' + topPct + '%;z-index:' + zIdx + '" title="Drag or tap to move ' + esc(rec.name) + ' Lv.' + itemLv + '" onpointerdown="WorldGame.startStudioDrag(' + idx + ', event)" onpointermove="WorldGame.moveStudioDrag(event)" onpointerup="WorldGame.endStudioDrag(event)" onpointercancel="WorldGame.endStudioDrag(event)" onclick="WorldGame.selectStudioPlaced(' + idx + ', event)">' +
        '<img src="' + FLAT + rec.id + '.webp" alt="" draggable="false" style="height:' + hPx + 'px;' + (p.flip ? 'transform:scaleX(-1)' : '') + '">' +
        starsBadge +
        (isSel ? '<span class="wg-studio-sel-tag">' + esc(rec.name) + ' Lv.' + itemLv + '</span>' : '') +
      '</button>';
    }).join('');

    var selObj = (studioSelectedIdx >= 0 && placed[studioSelectedIdx]) ? placed[studioSelectedIdx] : null;
    var selRec = selObj ? RECIPES.filter(function (r) { return r.id === selObj.id; })[0] : null;
    var selLv = selObj ? Math.max(1, Math.min(3, Number(selObj.lvl) || 1)) : 1;
    var selUpCost = selLv === 1 ? { wood: 1, flower: 1 } : { stone: 1, crystal: 1 };
    var canSelUp = selObj && selLv < 3 && hasMaterials(selUpCost);

    var stageToolbarHtml = selRec
      ? '<div class="wg-studio-toolbar">' +
          '<img src="' + FLAT + selRec.id + '.webp" style="width:28px;height:28px;object-fit:contain" alt="" draggable="false">' +
          '<div class="wg-st-txt"><b>' + esc(selRec.name) + ' (' + 'â˜…'.repeat(selLv) + ')</b><small>Drag it, tap floor, or use arrows:</small></div>' +
          '<div style="display:flex;gap:3px">' +
            '<button type="button" class="isl-btn cyan" style="min-height:32px;padding:3px 7px;font-size:0.75rem" onclick="WorldGame.nudgeStudioItem(-65, 0, event)" title="Move Left">â—€</button>' +
            '<button type="button" class="isl-btn cyan" style="min-height:32px;padding:3px 7px;font-size:0.75rem" onclick="WorldGame.nudgeStudioItem(0, -55, event)" title="Move Up">â–²</button>' +
            '<button type="button" class="isl-btn cyan" style="min-height:32px;padding:3px 7px;font-size:0.75rem" onclick="WorldGame.nudgeStudioItem(0, 55, event)" title="Move Down">â–¼</button>' +
            '<button type="button" class="isl-btn cyan" style="min-height:32px;padding:3px 7px;font-size:0.75rem" onclick="WorldGame.nudgeStudioItem(65, 0, event)" title="Move Right">â–¶</button>' +
          '</div>' +
          (selLv < 3
            ? '<button type="button" class="isl-btn ' + (canSelUp ? 'amber' : '') + '" style="min-height:32px;padding:3px 8px;font-size:0.76rem" onclick="WorldGame.upgradeStudioItem(event)" title="Upgrade to Lv.' + (selLv + 1) + '">â¬† Lv.' + (selLv + 1) + ' â˜…</button>'
            : '<span class="wg-job-done-badge" style="font-size:0.72rem">ðŸ‘‘ Max</span>') +
          '<button type="button" class="isl-btn cyan" style="min-height:32px;padding:3px 8px;font-size:0.76rem" onclick="WorldGame.flipStudioItem(event)">â†”</button>' +
          '<button type="button" class="isl-btn" style="min-height:32px;padding:3px 8px;font-size:0.76rem;background:#e11d48;border-bottom-color:#881337" onclick="WorldGame.storeStudioItem(event)">ðŸ“¥</button>' +
          '<button type="button" class="isl-btn emerald" style="min-height:32px;padding:3px 8px;font-size:0.76rem" onclick="WorldGame.selectStudioPlaced(-1, event)">âœ“</button>' +
        '</div>'
      : '<div class="wg-studio-toolbar hint">' +
          '<span>âœ‹ <b>' + (studioView === 'inside' ? 'ðŸ›‹ï¸ Inside Room' : 'ðŸŒ³ Outside Garden') + ':</b> Drag any item with your mouse/finger, or tap an item then tap where to put it!</span>' +
        '</div>';

    var canvasInnerHtml = '';
    if (studioView === 'inside') {
      canvasInnerHtml =
        '<div class="wg-room-wall tier-' + curTier.level + '">' +
          '<div class="wg-room-win left"></div>' +
          '<div class="wg-room-crest">ðŸ›‹ï¸ Level ' + curTier.level + ' Room Â· ' + esc(curTier.name) + '</div>' +
          '<div class="wg-room-win right"></div>' +
        '</div>' +
        '<div class="wg-room-floor">' +
          '<span class="wg-room-side-hint left">â¬… Left Side</span>' +
          '<span class="wg-room-side-hint right">Right Side âž¡</span>' +
          '<div class="wg-room-doormat">ðŸšª Front Door</div>' +
        '</div>' +
        stageItemsHtml;
    } else {
      canvasInnerHtml =
        '<div class="wg-studio-path-h"></div>' +
        '<div class="wg-studio-path-v"></div>' +
        '<div class="wg-studio-stone-pad"></div>' +
        '<span class="wg-studio-garden-tag">ðŸŒ³ Sunny Garden Yard</span>' +
        '<div class="wg-studio-npc" style="left:9.5%;top:34%" title="Grandpa Bolt"><img src="' + FLAT + 'c_bolt_happy.webp" alt="" draggable="false"></div>' +
        '<div class="wg-studio-wb" style="left:21.8%;top:36.4%" title="Crafting Workbench"><img src="' + FLAT + 'o_workbench.webp" alt="" draggable="false"></div>' +
        '<div class="wg-studio-house" style="left:46.7%;top:34.3%;cursor:pointer;pointer-events:auto" onclick="WorldGame.setStudioView(\'inside\')" title="Tap to look Inside your ' + esc(curTier.name) + '!">' +
          '<img src="' + FLAT + curTier.id + '.webp" alt="" draggable="false">' +
          '<span class="wg-studio-house-tag">ðŸšª ' + esc(curTier.name) + '</span>' +
        '</div>' +
        stageItemsHtml;
    }

    var stageHtml =
      '<div class="wg-studio-stage-wrap">' +
        '<div class="wg-studio-stage-head">' +
          '<div class="wg-view-toggle">' +
            '<button type="button" class="isl-btn ' + (studioView === 'inside' ? 'amber' : '') + '" style="min-height:34px;padding:4px 11px;font-size:0.82rem" onclick="WorldGame.setStudioView(\'inside\')">ðŸ›‹ï¸ Inside Room (' + indoorPlaced.length + ')</button>' +
            '<button type="button" class="isl-btn ' + (studioView === 'outside' ? 'emerald' : '') + '" style="min-height:34px;padding:4px 11px;font-size:0.82rem" onclick="WorldGame.setStudioView(\'outside\')">ðŸŒ³ Outside Garden (' + gardenPlaced.length + ')</button>' +
          '</div>' +
          '<span class="wg-st-badge">â­ Architect Score: ' + comfortStars + '</span>' +
        '</div>' +
        '<div class="wg-studio-canvas ' + (studioView === 'inside' ? 'is-room' : 'is-yard') + '" id="wg-studio-canvas" onpointermove="WorldGame.moveStudioDrag(event)" onpointerup="WorldGame.endStudioDrag(event)" onpointercancel="WorldGame.endStudioDrag(event)" onclick="WorldGame.tapStudioStage(event)">' +
          canvasInnerHtml +
        '</div>' +
        stageToolbarHtml +
      '</div>';

    var rightHtml = '';
    if (workshopTab === 'blueprints') {
      var bpCards = BLUEPRINTS.map(function (bp) {
        var isDone = !!st.blueprintsDone[bp.id];
        var checkRows = bp.checks.map(function (c) {
          var ok = c.test(st);
          return '<div class="wg-bp-check' + (ok ? ' ok' : '') + '">' + (ok ? 'âœ… ' : 'â¬œ ') + esc(c.label) + '</div>';
        }).join('');
        var allReady = !isDone && bp.checks.every(function (c) { return c.test(st); });
        return '<div class="wg-bp-card' + (isDone ? ' done' : (allReady ? ' ready' : '')) + '">' +
          '<div class="wg-bp-head">' +
            '<b>' + esc(bp.title) + '</b>' +
            '<span class="wg-bp-view-pill ' + bp.view + '">' + (bp.view === 'inside' ? 'ðŸ›‹ï¸ Inside Room' : 'ðŸŒ³ Outside Garden') + '</span>' +
          '</div>' +
          '<div class="wg-bp-clue">"' + esc(bp.clue) + '" <button type="button" class="wg-bp-speak" onclick="IslandAudio.speak(\'' + esc(bp.clue) + '\')">ðŸ”Š</button></div>' +
          '<div class="wg-bp-checks">' + checkRows + '</div>' +
          '<div class="wg-bp-foot">' +
            '<span class="wg-reward-tag">ðŸŽ +' + bp.coins + ' ðŸª™ Â· +' + bp.energy + ' âš¡ Â· +' + bp.xp + ' XP</span>' +
            (isDone
              ? '<span class="wg-job-done-badge">â˜… Completed!</span>'
              : (allReady
                ? '<button type="button" class="isl-btn emerald" style="min-height:36px;padding:4px 12px;font-size:0.84rem" onclick="WorldGame.claimBlueprint(\'' + bp.id + '\')">ðŸŽ Claim Reward!</button>'
                : '<button type="button" class="isl-btn cyan" style="min-height:34px;padding:4px 10px;font-size:0.8rem" onclick="WorldGame.setStudioView(\'' + bp.view + '\'); WorldGame.openWorkshop(\'craft\')">ðŸ”¨ Build This</button>')) +
          '</div>' +
        '</div>';
      }).join('');

      rightHtml =
        '<div class="wg-bp-banner">' +
          '<img src="' + FLAT + 'c_bolt_happy.webp" style="width:48px;height:48px;object-fit:contain" alt="">' +
          '<div style="flex:1;min-width:0">' +
            '<b style="color:#fde047;display:block">ðŸ“œ Grandpa Bolt\'s Smart Blueprints (' + bpDoneCount + '/6 â˜…)</b>' +
            '<small style="color:#cbd5e1">Read the English clues, craft &amp; drag items in your Room or Garden, and claim rewards!</small>' +
          '</div>' +
          '<button type="button" class="isl-btn amber" style="min-height:38px;padding:5px 11px;font-size:0.82rem" onclick="WorldGame.openSmartBuilderQuiz()">ðŸ§  +Materials Quiz</button>' +
        '</div>' +
        '<div class="wg-bp-list">' + bpCards + '</div>';
    } else if (workshopTab === 'home') {
      var canUp = nextTier && hasMaterials(nextTier.cost);
      var roadmapHtml = HOUSE_TIERS.map(function (t) {
        var done = t.level < curTier.level;
        var curr = t.level === curTier.level;
        return '<div class="wg-tier-step' + (curr ? ' current' : (done ? ' done' : '')) + '">' +
          '<img src="' + FLAT + t.id + '.webp" alt="">' +
          '<b>Lv.' + t.level + ' ' + esc(t.name) + '</b>' +
          '<em>' + (curr ? 'ðŸ“ Current' : (done ? 'âœ“ Built' : 'ðŸ”’ Locked')) + '</em>' +
        '</div>';
      }).join('');

      rightHtml =
        '<div class="wg-home-upgrade-card">' +
          '<div class="wg-home-pics">' +
            '<div class="wg-home-stage"><img src="' + FLAT + curTier.id + '.webp" alt=""><span>Level ' + curTier.level + ': ' + esc(curTier.name) + '</span></div>' +
            (nextTier ? '<div class="wg-home-arrow">âž¡</div><div class="wg-home-stage next"><img src="' + FLAT + nextTier.id + '.webp" alt=""><span>Level ' + nextTier.level + ': ' + esc(nextTier.name) + '</span></div>' : '') +
          '</div>' +
          (nextTier
            ? '<div style="margin:10px 0"><div style="font-weight:800;color:#fde68a;margin-bottom:6px">Materials needed for Level ' + nextTier.level + ' (' + esc(nextTier.name) + '):</div><div class="wg-cost-row">' + costPillsHtml(nextTier.cost, bag) + '</div></div>' +
              '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">' +
                '<button type="button" class="isl-btn ' + (canUp ? 'emerald' : '') + '" id="wg-btn-upgrade-home" style="min-height:44px;font-size:0.95rem;padding:6px 18px" ' + (canUp ? 'onclick="WorldGame.upgradeHome()"' : 'disabled aria-disabled="true"') + '>' +
                  (canUp ? 'ðŸ”¨ Upgrade to ' + esc(nextTier.name) + '!' : 'ðŸ”’ Need More Materials') +
                '</button>' +
                (!canUp ? '<button type="button" class="isl-btn amber" style="min-height:44px;font-size:0.9rem;padding:6px 14px" onclick="WorldGame.openSmartBuilderQuiz()">ðŸ§  Earn Materials (Quiz)</button>' : '') +
              '</div>'
            : '<div style="font-size:1.15rem;font-weight:800;color:#6ee7b7;margin-top:10px">ðŸ° Maximum Level! You built the Royal Fairy-Tale Castle!</div>') +
        '</div>' +
        '<div class="wg-roadmap-wrap">' +
          '<div class="wg-sec-title">ðŸ° 5-Stage Home Evolution Roadmap (Upgrades Both Outside &amp; Inside Room!)</div>' +
          '<div class="wg-tier-roadmap">' + roadmapHtml + '</div>' +
        '</div>';
    } else if (workshopTab === 'craft') {
      var filtered = RECIPES.filter(function (r) {
        if (craftFilter === 'patio') return r.kind === 'patio';
        if (craftFilter === 'garden') return r.kind === 'garden';
        return true;
      });
      var cards = filtered.map(function (r) {
        var ownedCount = Number((st.ownedFurniture || {})[r.id]) || 0;
        var placedCount = placed.filter(function (p) { return p.id === r.id; }).length;
        var inBag = Math.max(0, ownedCount - placedCount);
        var canCraft = hasMaterials(r.cost);
        return '<div class="wg-recipe-card">' +
          '<span class="wg-rec-kind ' + r.kind + '">' + (r.kind === 'patio' ? 'ðŸ›‹ï¸ Inside Room' : 'ðŸŒ³ Outside Garden') + '</span>' +
          '<img src="' + FLAT + r.id + '.webp" class="wg-recipe-pic" alt="" draggable="false" onclick="IslandAudio.speak(\'' + esc(r.name) + '\')">' +
          '<div class="wg-recipe-name">' + esc(r.name) + '</div>' +
          '<div class="wg-rec-counts">Owned: <b>' + ownedCount + '</b> Â· Placed: <b>' + placedCount + '</b></div>' +
          '<div class="wg-cost-row">' + costPillsHtml(r.cost, bag) + '</div>' +
          '<div class="wg-recipe-actions">' +
            '<button type="button" class="isl-btn ' + (canCraft ? 'amber' : '') + '" style="min-height:36px;padding:4px 9px;font-size:0.8rem" ' + (canCraft ? 'onclick="WorldGame.craftItem(\'' + r.id + '\')"' : 'disabled') + '>ðŸ”¨ Craft</button>' +
            (inBag > 0
              ? '<button type="button" class="isl-btn emerald" style="min-height:36px;padding:4px 9px;font-size:0.8rem" onclick="WorldGame.placeItem(\'' + r.id + '\')">ðŸ“ Place (+' + inBag + ')</button>'
              : (placedCount > 0
                ? '<button type="button" class="isl-btn cyan" style="min-height:36px;padding:4px 9px;font-size:0.8rem" onclick="WorldGame.focusPlacedItem(\'' + r.id + '\')">âœ‹ Move</button>'
                : '')) +
          '</div>' +
        '</div>';
      }).join('');
      rightHtml =
        '<div class="wg-craft-filters">' +
          '<button type="button" class="isl-btn ' + (craftFilter === 'all' ? 'cyan' : '') + '" style="min-height:34px;padding:4px 11px;font-size:0.8rem" onclick="WorldGame.setCraftFilter(\'all\')">All (16)</button>' +
          '<button type="button" class="isl-btn ' + (craftFilter === 'patio' ? 'amber' : '') + '" style="min-height:34px;padding:4px 11px;font-size:0.8rem" onclick="WorldGame.setCraftFilter(\'patio\')">ðŸ›‹ï¸ Inside Room (6)</button>' +
          '<button type="button" class="isl-btn ' + (craftFilter === 'garden' ? 'emerald' : '') + '" style="min-height:34px;padding:4px 11px;font-size:0.8rem" onclick="WorldGame.setCraftFilter(\'garden\')">ðŸŒ³ Outside Garden (10)</button>' +
          '<button type="button" class="isl-btn amber" style="margin-left:auto;min-height:34px;padding:4px 10px;font-size:0.78rem" onclick="WorldGame.openSmartBuilderQuiz()">ðŸ§  +Materials</button>' +
        '</div>' +
        '<div class="wg-recipes-grid">' + cards + '</div>';
    } else {
      // Tab 4: Arrange & Upgrade
      var bagItemsHtml = RECIPES.map(function (r) {
        var ownedCount = Number((st.ownedFurniture || {})[r.id]) || 0;
        var placedCount = placed.filter(function (p) { return p.id === r.id; }).length;
        var avail = Math.max(0, ownedCount - placedCount);
        if (avail <= 0) return '';
        return '<div class="wg-bag-row">' +
          '<img src="' + FLAT + r.id + '.webp" style="width:42px;height:42px;object-fit:contain" alt="" draggable="false">' +
          '<div style="flex:1;min-width:0"><b>' + esc(r.name) + '</b><small style="display:block;color:#94a3b8">' + avail + ' in bag Â· ' + (r.kind === 'patio' ? 'ðŸ›‹ï¸ Inside Room' : 'ðŸŒ³ Outside Garden') + '</small></div>' +
          '<button type="button" class="isl-btn emerald" style="min-height:36px;padding:4px 12px;font-size:0.82rem" onclick="WorldGame.placeItem(\'' + r.id + '\')">ðŸ“ Place</button>' +
        '</div>';
      }).join('');

      var placedListHtml = placed.map(function (p, idx) {
        var rec = RECIPES.filter(function (r) { return r.id === p.id; })[0];
        if (!rec) return '';
        var isSel = (idx === studioSelectedIdx);
        var itemLv = Math.max(1, Math.min(3, Number(p.lvl) || 1));
        return '<div class="wg-bag-row' + (isSel ? ' active' : '') + '" onclick="WorldGame.selectStudioPlaced(' + idx + ', event)" style="cursor:pointer">' +
          '<img src="' + FLAT + rec.id + '.webp" style="width:40px;height:40px;object-fit:contain" alt="" draggable="false">' +
          '<div style="flex:1;min-width:0"><b>' + esc(rec.name) + ' <span style="color:#fde047">' + 'â˜…'.repeat(itemLv) + '</span></b><small style="display:block;color:#6ee7b7">' + (rec.kind === 'patio' ? 'ðŸ›‹ï¸ Inside Room' : 'ðŸŒ³ Outside Garden') + ' Â· ' + (isSel ? 'âœ‹ Drag on preview map or use â—€ â–² â–¼ â–¶!' : 'Tap to move or upgrade') + '</small></div>' +
          '<button type="button" class="isl-btn cyan" style="min-height:34px;padding:3px 9px;font-size:0.78rem" onclick="WorldGame.selectStudioPlaced(' + idx + ', event)">âœ‹ Move</button>' +
        '</div>';
      }).join('');

      rightHtml =
        '<div class="wg-decor-lists">' +
          '<div class="wg-sec-title">ðŸŽ’ Ready in Your Bag (Tap to Place)</div>' +
          (bagItemsHtml || '<div class="wg-empty-note">All your crafted items are placed! Drag any item on the left preview to move it.</div>') +
          '<div class="wg-sec-title" style="margin-top:12px">ðŸª‘ Placed Items (' + indoorPlaced.length + ' Inside Room Â· ' + gardenPlaced.length + ' Outside Garden)</div>' +
          (placedListHtml || '<div class="wg-empty-note">Nothing placed yet â€” tap Place above or craft new items!</div>') +
        '</div>';
    }

    document.body.classList.add('isl-modal-open');
    modalRoot().innerHTML =
      '<div class="isl-modal-backdrop" id="wg-workshop-backdrop">' +
        '<div class="isl-card-modal wg-studio-modal">' +
          '<div class="isl-mission-top wg-studio-top">' +
            '<div style="display:flex;align-items:center;gap:8px;font-size:1.18rem;font-weight:800"><img src="' + FLAT + 'o_workbench.webp" style="width:32px;height:32px;object-fit:contain" alt=""> Home &amp; Crafting Studio</div>' +
            '<div class="wg-studio-mats">' + matBar + '</div>' +
            '<div style="margin-left:auto;display:flex;gap:5px;align-items:center;flex-wrap:wrap">' +
              '<button type="button" class="isl-btn cyan" id="wg-btn-open-sports" style="min-height:38px;padding:4px 10px;font-size:0.82rem" onclick="WorldGame.openSportsArena(\'soccer\', \'4v4\')">âš½ Sports Arena</button>' +
              '<button type="button" class="isl-btn amber" id="wg-btn-enter-room" style="min-height:38px;padding:4px 10px;font-size:0.82rem" onclick="WorldGame.seeHomeInWorld(true)">ðŸšª Walk Inside Room!</button>' +
              '<button type="button" class="isl-btn emerald" id="wg-btn-see-world" style="min-height:38px;padding:4px 10px;font-size:0.82rem" onclick="WorldGame.seeHomeInWorld(false)">ðŸŒ³ Walk in Garden!</button>' +
              '<button type="button" class="isl-btn" style="min-height:38px;min-width:40px;padding:4px 9px" onclick="WorldGame.closeModal()">âœ•</button>' +
            '</div>' +
          '</div>' +
          '<div class="wg-studio-body">' +
            stageHtml +
            '<div class="wg-studio-panel">' +
              '<div class="wg-studio-tabs cols-4">' +
                '<button type="button" class="isl-btn ' + (workshopTab === 'blueprints' ? 'amber' : '') + '" onclick="WorldGame.openWorkshop(\'blueprints\')">ðŸ“œ Blueprints (' + bpDoneCount + '/6)</button>' +
                '<button type="button" class="isl-btn ' + (workshopTab === 'home' ? 'amber' : '') + '" onclick="WorldGame.openWorkshop(\'home\')">ðŸ° House</button>' +
                '<button type="button" class="isl-btn ' + (workshopTab === 'craft' ? 'amber' : '') + '" onclick="WorldGame.openWorkshop(\'craft\')">ðŸ”¨ Craft (16)</button>' +
                '<button type="button" class="isl-btn ' + (workshopTab === 'decorate' ? 'amber' : '') + '" onclick="WorldGame.openWorkshop(\'decorate\')">ðŸŽ¨ Arrange (' + placed.length + ')</button>' +
              '</div>' +
              '<div class="wg-studio-tab-content">' + rightHtml + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function upgradeHome() {
    var st = readState(), nextTier = HOUSE_TIERS[st.houseTier || 1];
    if (!nextTier || !hasMaterials(nextTier.cost)) return;
    spendMaterials(nextTier.cost);
    st.houseTier = nextTier.level;
    writeState(st);
    sound('playFanfare');
    say('Hooray! You built the ' + nextTier.name + '!');
    if (W() && W().refreshHome) W().refreshHome(true);
    renderWorkshop();
  }

  function craftItem(id) {
    var r = RECIPES.filter(function (x) { return x.id === id; })[0];
    if (!r || !hasMaterials(r.cost)) return;
    spendMaterials(r.cost);
    var st = readState();
    st.ownedFurniture = st.ownedFurniture || {};
    st.ownedFurniture[id] = (Number(st.ownedFurniture[id]) || 0) + 1;
    st.placed = st.placed || [];
    var countSame = st.placed.filter(function (p) { return p.id === id; }).length;
    var px = r.defPos.x + (countSame ? (countSame * 90) % 240 : 0);
    var py = r.defPos.y + (countSame ? Math.floor(countSame / 3) * 75 : 0);
    st.placed.push({ id: id, x: px, y: py, flip: false, lvl: 1 });
    studioView = (r.kind === 'patio') ? 'inside' : 'outside';
    studioSelectedIdx = st.placed.length - 1;
    writeState(st);
    sound('playCorrect');
    say('You crafted a ' + r.name + '! Drag it on the preview map to move it!');
    if (W() && W().refreshHome) W().refreshHome(true);
    renderWorkshop();
  }

  function placeItem(id) {
    var r = RECIPES.filter(function (x) { return x.id === id; })[0];
    if (!r) return;
    var st = readState();
    st.placed = st.placed || [];
    var countSame = st.placed.filter(function (p) { return p.id === id; }).length;
    st.placed.push({ id: id, x: r.defPos.x + countSame * 85, y: r.defPos.y, flip: false, lvl: 1 });
    studioView = (r.kind === 'patio') ? 'inside' : 'outside';
    studioSelectedIdx = st.placed.length - 1;
    writeState(st);
    sound('playTap');
    if (W() && W().refreshHome) W().refreshHome(false);
    renderWorkshop();
  }

  function removePlaced(id) {
    var st = readState();
    st.placed = st.placed || [];
    for (var i = st.placed.length - 1; i >= 0; i--) {
      if (st.placed[i].id === id) { st.placed.splice(i, 1); break; }
    }
    studioSelectedIdx = -1;
    writeState(st);
    sound('playTap');
    if (W() && W().refreshHome) W().refreshHome(false);
    renderWorkshop();
  }

  function startMoveMode(focusId) {
    openWorkshop('decorate');
  }

  /* ---------- 5. Villager Quests Compass & In-World Gift Drops (v_*) ---------- */
  function openJobsBoard() {
    sound('playTap');
    var st = readState(), bag = readBag().items || {};
    var curZone = (W() && W().S && W().S.zone !== undefined) ? W().S.zone : 1;
    var rows = VILLAGERS.map(function (v) {
      var done = !!(st.jobsDone && st.jobsDone[v.id]);
      var canGive = !done && hasMaterials(v.need);
      var rec = RECIPES.filter(function (r) { return r.id === v.gift; })[0];
      var inSameZone = curZone === v.zone;
      return '<div class="wg-job-card' + (done ? ' done' : '') + '">' +
        '<img src="' + FLAT + (done ? v.happy : v.art) + '.webp" class="wg-job-pic" alt="">' +
        '<div class="wg-job-main">' +
          '<div class="wg-job-title"><b>' + esc(v.name) + '</b> <small>Â· Zone ' + v.zone + '</small></div>' +
          '<div class="wg-job-line">"' + esc(v.line) + '"</div>' +
          '<div class="wg-cost-row">' + costPillsHtml(v.need, bag) + ' <span class="wg-reward-tag">ðŸŽ ' + esc(rec ? rec.name : v.gift) + ' + âš¡' + v.energy + '</span></div>' +
        '</div>' +
        '<div class="wg-job-act">' +
          (done
            ? '<span class="wg-job-done-badge">âœ“ Friend!</span>'
            : '<button type="button" class="isl-btn ' + (canGive ? 'emerald' : 'cyan') + '" style="min-height:42px;padding:6px 12px" onclick="WorldGame.trackVillager(\'' + v.id + '\')">' +
                (canGive ? (inSameZone ? 'ðŸŽ Walk & Give' : 'ðŸŽ Visit & Give') : 'ðŸ“ Track') +
              '</button>') +
        '</div>' +
      '</div>';
    }).join('');

    document.body.classList.add('isl-modal-open');
    modalRoot().innerHTML =
      '<div class="isl-modal-backdrop" id="wg-jobs-backdrop">' +
        '<div class="isl-card-modal wg-workshop-modal">' +
          '<div class="isl-mission-top">' +
            '<div style="display:flex;align-items:center;gap:8px;font-size:1.35rem;font-weight:800"><img src="' + FLAT + 'u_jobs.webp" style="width:38px;height:38px;object-fit:contain" alt=""> Island Villager Quests</div>' +
            '<div style="margin-left:auto;display:flex;gap:8px">' +
              '<button type="button" class="isl-btn amber" style="min-height:42px;padding:6px 12px;font-size:0.9rem" onclick="WorldGame.closeModal(); if(window.IslandRewards) IslandRewards.openStickerBook()">ðŸ“’ Sticker Book</button>' +
              '<button type="button" class="isl-btn" style="min-height:42px;min-width:44px;padding:6px 12px" onclick="WorldGame.closeModal()">âœ•</button>' +
            '</div>' +
          '</div>' +
          '<div style="color:#bae6fd;font-size:0.92rem;font-weight:700;margin-bottom:8px">ðŸ’¡ Walk up to a villager in the world to hand them materials and catch their gift box!</div>' +
          '<div class="wg-jobs-list">' + rows + '</div>' +
        '</div>' +
      '</div>';
  }

  function trackVillager(vid) {
    var v = VILLAGERS.filter(function (x) { return x.id === vid; })[0];
    if (!v) return;
    sound('playTap');
    closeModal();
    if (W() && W().focusVillager) W().focusVillager(v);
  }

  function completeJob(vid, fromModal) {
    var v = VILLAGERS.filter(function (x) { return x.id === vid; })[0];
    if (!v) return;
    var st = readState();
    if (st.jobsDone && st.jobsDone[vid]) return;
    if (!hasMaterials(v.need)) return;
    spendMaterials(v.need);
    st.jobsDone = st.jobsDone || {};
    st.jobsDone[vid] = 1;
    st.ownedFurniture = st.ownedFurniture || {};
    st.ownedFurniture[v.gift] = (Number(st.ownedFurniture[v.gift]) || 0) + 1;
    var rec = RECIPES.filter(function (r) { return r.id === v.gift; })[0];
    if (rec && !(st.placed || []).some(function (p) { return p.id === rec.id; })) {
      st.placed = st.placed || [];
      st.placed.push({ id: rec.id, x: rec.defPos.x, y: rec.defPos.y, flip: false, lvl: 1 });
    }
    writeState(st);
    addEnergy(v.energy);
    if (App() && App().awardIslandXP) App().awardIslandXP(5, 'villager_' + vid);
    if (root.IslandRewards && root.IslandRewards.unlockVillagerSticker) {
      root.IslandRewards.unlockVillagerSticker(vid, v.name, FLAT + v.happy + '.webp');
    }
    sound('playFanfare');
    say('Thank you! Here is a ' + (rec ? rec.name : 'gift') + ' for your home!');
    updateJobsBadge();
    if (W() && W().refreshVillagers) W().refreshVillagers(vid, rec);
    if (W() && W().refreshHome) W().refreshHome(false);
    if (fromModal) openJobsBoard();
  }

  /* ---------- 6. Friendly Monster Battles (b_*) ---------- */
  var battleRun = null;

  function openBattle(bid) {
    var b = BATTLES.filter(function (x) { return x.id === bid; })[0];
    if (!b) return;
    if (getEnergy() < 10) {
      openEnergyCharge('âš¡ Charge your monster energy (+30) to start the friendly battle with ' + b.name + '!', function () {
        openBattle(bid);
      });
      return;
    }
    useEnergy(10);
    var pool = SPELLS.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 3);
    battleRun = { b: b, qs: pool, idx: 0, hp: 3, maxHp: 3 };
    document.body.classList.add('isl-modal-open');
    renderBattleStep();
  }

  function renderBattleStep() {
    if (!battleRun) return;
    var b = battleRun.b;
    if (battleRun.hp <= 0 || battleRun.idx >= battleRun.qs.length) {
      var st = readState();
      var firstWin = !(st.battlesWon && st.battlesWon[b.id]);
      st.battlesWon = st.battlesWon || {};
      st.battlesWon[b.id] = 1;
      writeState(st);
      giveMaterials(b.loot);
      addBonusCoins(b.coins);
      if (firstWin && App() && App().awardIslandXP) App().awardIslandXP(5, 'battle_' + b.id);
      if (root.IslandRewards && root.IslandRewards.unlockBattleSticker) {
        root.IslandRewards.unlockBattleSticker(b.id, b.name, FLAT + b.art + '.webp');
      }
      sound('playFanfare');
      say('Victory! ' + b.name + ' is your friend now!');
      if (W() && W().refreshBattles) W().refreshBattles(b.id);
      var lootTxt = Object.keys(b.loot).map(function (k) {
        return '<span class="wg-cost-pill ok"><img src="' + FLAT + MAT_ICONS[k] + '.webp" alt="">+' + b.loot[k] + ' ' + k + '</span>';
      }).join(' ');
      modalRoot().innerHTML =
        '<div class="isl-modal-backdrop" id="wg-battle-win">' +
          '<div class="isl-card-modal" style="max-width:520px;text-align:center">' +
            '<img src="' + FLAT + b.art + '.webp" style="width:130px;height:130px;object-fit:contain;margin:0 auto" alt="">' +
            '<h2 style="font-size:1.75rem;margin:8px 0;color:#6ee7b7">ðŸŽ‰ Friendly Victory!</h2>' +
            '<p style="color:#e2e8f0;font-weight:700;margin-bottom:12px">' + esc(b.name) + ' cheered for your English spells and shared treasure with you!</p>' +
            '<div class="wg-cost-row" style="justify-content:center;margin-bottom:14px">' + lootTxt + ' <span class="wg-reward-tag">ðŸª™ +' + b.coins + ' Coins</span></div>' +
            '<div style="display:flex;gap:10px;justify-content:center">' +
              '<button type="button" class="isl-btn amber" onclick="WorldGame.closeModal(); WorldGame.openWorkshop(\'blueprints\')">ðŸ“œ Open Blueprints</button>' +
              '<button type="button" class="isl-btn emerald" onclick="WorldGame.closeModal()">Continue â–¶</button>' +
            '</div>' +
          '</div>' +
        '</div>';
      return;
    }

    var q = battleRun.qs[battleRun.idx];
    var hearts = 'â¤ï¸'.repeat(battleRun.hp) + 'ðŸ–¤'.repeat(battleRun.maxHp - battleRun.hp);
    var opts = q.options.map(function (o, i) {
      return '<button type="button" class="isl-btn wg-choice-btn" onclick="WorldGame.answerBattle(' + i + ', this)">âœ¨ ' + esc(o) + '</button>';
    }).join('');

    modalRoot().innerHTML =
      '<div class="isl-modal-backdrop" id="wg-battle-backdrop">' +
        '<div class="isl-card-modal" style="max-width:660px">' +
          '<div class="isl-mission-top">' +
            '<div style="font-size:1.25rem;font-weight:800;color:#fda4af">âš”ï¸ Friendly Battle: ' + esc(b.name) + '</div>' +
            '<div style="margin-left:auto;font-size:1.2rem">' + hearts + '</div>' +
            '<button type="button" class="isl-btn" style="margin-left:10px;min-height:40px;min-width:42px;padding:4px 10px" onclick="WorldGame.closeModal()">âœ•</button>' +
          '</div>' +
          '<div class="wg-battle-arena">' +
            '<div class="wg-fighter"><img src="' + FLAT + b.art + '.webp" id="wg-boss-img" alt=""><span>' + esc(b.name) + '</span></div>' +
          '</div>' +
          '<div class="wg-q-card">' +
            '<button type="button" class="isl-btn amber" style="min-height:42px;padding:6px 14px;margin-bottom:8px" onclick="IslandAudio.speak(\'' + esc(q.speak) + '\')">ðŸ”Š Hear Spell</button>' +
            '<div style="font-size:1.3rem;font-weight:800;color:#fff;margin-bottom:12px">' + esc(q.q) + '</div>' +
            '<div class="wg-choices-grid">' + opts + '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    say(q.speak);
  }

  function answerBattle(idx, btnEl) {
    if (!battleRun) return;
    var q = battleRun.qs[battleRun.idx];
    var chosen = q.options[idx];
    if (chosen === q.a) {
      sound('playCorrect');
      battleRun.hp--;
      battleRun.idx++;
      var bossImg = document.getElementById('wg-boss-img');
      if (bossImg) { bossImg.style.transform = 'scale(0.82) rotate(8deg)'; }
      setTimeout(renderBattleStep, 260);
    } else {
      sound('playSoftFail');
      if (btnEl) {
        btnEl.classList.remove('wobble'); void btnEl.offsetWidth; btnEl.classList.add('wobble');
        btnEl.style.opacity = '0.45';
      }
      say('Try again! ' + q.speak);
    }
  }

  function closeModal() {
    sound('playTap');
    battleRun = null;
    energyRun = null;
    stopSportsLoop();
    document.body.classList.remove('isl-modal-open');
    if (modalRoot()) modalRoot().innerHTML = '';
    updateStatusHud();
  }

  /* ---------- 7. 2.5D Island Sports Arena (⚽ 3D Pro Stadium Football & 🏐 3D 4v4 Beach Volleyball) ---------- */
  var sportsRaf = 0;
  var sportsState = null;
  var sportsSport = 'soccer'; // 'soccer' | 'volleyball'
  var sportsMode = '4v4';     // '1v1' | '2v2' | '4v4' (4 players per side default!)
  var sportsControl = '1p';   // '1p' (vs AI) | '2p' (2-Player Local Same Screen)
  var sportImgs = {};

  function getSportImg(name) {
    if (!sportImgs[name]) {
      var im = new Image();
      im.src = FLAT + (name.indexOf('.') > 0 ? name : (name + '.webp'));
      sportImgs[name] = im;
    }
    return sportImgs[name];
  }

  function stopSportsLoop() {
    if (sportsRaf) {
      cancelAnimationFrame(sportsRaf);
      sportsRaf = 0;
    }
    if (sportsState && sportsState.keyHandler) {
      root.removeEventListener('keydown', sportsState.keyHandler, true);
      root.removeEventListener('keyup', sportsState.keyUpHandler, true);
    }
    sportsState = null;
  }

  function openSportsArena(sport, mode, ctrl) {
    stopSportsLoop();
    sound('playTap');
    if (sport) sportsSport = sport;
    if (mode) sportsMode = mode;
    if (!sportsMode) sportsMode = '4v4';
    if (ctrl) sportsControl = ctrl;
    var eNow = getEnergy();
    var st = readState();
    var trophies = Number(st.sportsWins) || 0;
    // Preload 3D JPEG stadium backgrounds & monster sprites
    ['stadium_soccer_3d.jpg', 'stadium_volleyball_3d.jpg', 'c_bolt_happy', 'c_lulu_happy', 'c_nutty_happy', 'c_ember_happy', 'o_ball'].forEach(getSportImg);

    document.body.classList.add('isl-modal-open');
    modalRoot().innerHTML =
      '<div class="isl-modal-backdrop" id="wg-sports-backdrop">' +
        '<div class="isl-card-modal wg-sports-modal">' +
          '<div class="isl-mission-top wg-sports-top">' +
            '<div style="display:flex;align-items:center;gap:8px;font-size:1.12rem;font-weight:800;color:#fde047">' +
              '<img src="' + FLAT + 'o_ball.webp" style="width:28px;height:28px;object-fit:contain" alt=""> 🏆 3D Island Champions Stadium' +
            '</div>' +
            '<div class="wg-sports-selectors">' +
              '<button type="button" tabindex="-1" class="isl-btn ' + (sportsSport === 'soccer' ? 'emerald' : '') + '" style="min-height:34px;padding:4px 10px;font-size:0.8rem" onclick="this.blur();WorldGame.openSportsArena(\'soccer\', \'' + sportsMode + '\', \'' + sportsControl + '\')">⚽ 3D Football (4v4)</button>' +
              '<button type="button" tabindex="-1" class="isl-btn ' + (sportsSport === 'volleyball' ? 'amber' : '') + '" style="min-height:34px;padding:4px 10px;font-size:0.8rem" onclick="this.blur();WorldGame.openSportsArena(\'volleyball\', \'' + sportsMode + '\', \'' + sportsControl + '\')">🏐 3D Volleyball (4v4)</button>' +
              '<button type="button" tabindex="-1" class="isl-btn ' + (sportsMode === '1v1' ? 'cyan' : '') + '" style="min-height:34px;padding:4px 9px;font-size:0.78rem" onclick="this.blur();WorldGame.openSportsArena(\'' + sportsSport + '\', \'1v1\', \'' + sportsControl + '\')">1 vs 1</button>' +
              '<button type="button" tabindex="-1" class="isl-btn ' + (sportsMode === '2v2' ? 'cyan' : '') + '" style="min-height:34px;padding:4px 9px;font-size:0.78rem" onclick="this.blur();WorldGame.openSportsArena(\'' + sportsSport + '\', \'2v2\', \'' + sportsControl + '\')">2 vs 2</button>' +
              '<button type="button" tabindex="-1" class="isl-btn ' + (sportsMode === '4v4' ? 'cyan' : '') + '" style="min-height:34px;padding:4px 9px;font-size:0.78rem" onclick="this.blur();WorldGame.openSportsArena(\'' + sportsSport + '\', \'4v4\', \'' + sportsControl + '\')">4 vs 4 Squad</button>' +
              '<button type="button" tabindex="-1" class="isl-btn ' + (sportsControl === '2p' ? 'amber' : '') + '" style="min-height:34px;padding:4px 9px;font-size:0.78rem" onclick="this.blur();WorldGame.openSportsArena(\'' + sportsSport + '\', \'' + sportsMode + '\', \'' + (sportsControl === '2p' ? '1p' : '2p') + '\')">' + (sportsControl === '2p' ? '👥 2P Same Screen' : '🤖 1P vs AI') + '</button>' +
            '</div>' +
            '<div style="margin-left:auto;display:flex;gap:6px;align-items:center">' +
              '<span class="wg-st-badge">🏆 Wins: <b id="wg-sp-wins">' + trophies + '</b></span>' +
              '<span class="wg-st-badge" style="color:#fde047">⚡ <b id="wg-sp-energy">' + eNow + '</b></span>' +
              '<button type="button" tabindex="-1" class="isl-btn" style="min-height:36px;min-width:38px;padding:4px 9px" onclick="WorldGame.closeModal()">✕</button>' +
            '</div>' +
          '</div>' +
          '<div class="wg-sports-scoreboard">' +
            '<div class="wg-sp-team blue"><span>🟦 ' + (sportsMode === '4v4' ? 'YOUR 4v4 SQUAD' : (sportsMode === '2v2' ? 'YOU + SKY' : 'YOU (BLUE)')) + '</span><b id="wg-sp-score-a">0</b></div>' +
            '<div class="wg-sp-vs">' +
              '<span id="wg-sp-status">' + (sportsSport === 'soccer' ? '⚽ 3D Champions Pitch! Dribble, Pass (E) &amp; Shoot (Space)! First to 3 Goals Wins +25 🪙!' : '🏐 3D Beach Championship! Move to Target Ring &amp; Press SPACE to Spike!') + '</span>' +
              '<small>' + (sportsSport === 'soccer' ? '🕹️ Move: WASD / Arrows / Click / Stick · 👟 E = Pass to Teammates · 🔥 Space or Click Goal = Power Shot!' : '🕹️ Slow Floaty Ball · Teammates Set to YOU · Move (WASD/Arrows/Click) &amp; Press SPACE to Spike!') + '</small>' +
            '</div>' +
            '<div class="wg-sp-team red"><b id="wg-sp-score-b">0</b><span>' + (sportsControl === '2p' ? 'P2 (ARROWS+ENTER)' : (sportsMode === '4v4' ? 'RIVAL 4v4 SQUAD' : 'LEO &amp; SUNNY')) + ' 🟥</span></div>' +
          '</div>' +
          '<div class="wg-sports-stage-wrap">' +
            '<canvas id="wg-sports-canvas" width="1280" height="600"></canvas>' +
            '<div class="wg-sports-controls">' +
              '<div class="wg-sp-joy-wrap">' +
                '<div class="wg-sp-joy" id="wg-sp-joy" aria-label="360 Analog Joystick">' +
                  '<div class="wg-sp-joy-ring"></div>' +
                  '<div class="wg-sp-joy-knob" id="wg-sp-knob">🕹️</div>' +
                '</div>' +
                '<div class="wg-sp-joy-hint"><b>360° Stick</b><small>or WASD / Arrows / Click</small></div>' +
              '</div>' +
              '<div class="wg-sp-action-group">' +
                '<button type="button" tabindex="-1" class="isl-btn cyan wg-act-btn" onpointerdown="this.blur();WorldGame.sportsAction(\'pass\')">' + (sportsSport === 'soccer' ? '👟 PASS TO TEAMMATE (E)' : '🙌 HIGH SET (E)') + '</button>' +
                '<button type="button" tabindex="-1" class="isl-btn emerald wg-act-btn" onpointerdown="this.blur();WorldGame.sportsAction(\'dash\')">💨 SPRINT BOOST (Shift)</button>' +
                '<button type="button" tabindex="-1" class="isl-btn amber wg-act-btn shoot" onpointerdown="this.blur();WorldGame.sportsAction(\'power\')">' + (sportsSport === 'soccer' ? '🔥 SHOOT / STEAL! (Space)' : '🔥 JUMP SPIKE! (Space)') + '</button>' +
              '</div>' +
              '<div style="display:flex;gap:5px;margin-left:auto">' +
                '<button type="button" tabindex="-1" class="isl-btn" style="min-height:38px;padding:4px 10px;font-size:0.8rem" onclick="this.blur();WorldGame.restartSportsMatch()">🔄 Play Again</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    startSportsMatch(sportsSport, sportsMode, sportsControl);
  }

  function restartSportsMatch() {
    openSportsArena(sportsSport, sportsMode, sportsControl);
  }

  function setSportDir(dx, dy, isDown) {
    if (!sportsState) return;
    if (isDown) {
      sportsState.joyX = dx;
      sportsState.joyY = dy;
    } else {
      sportsState.joyX = 0;
      sportsState.joyY = 0;
    }
  }

  function sportsAction(kind) {
    if (!sportsState) return;
    if (sportsState.finished) {
      restartSportsMatch();
      return;
    }
    sportsState.waitingKickoff = false;
    sportsState.actionKind = kind || 'power';
    sportsState.actionPressed = true;
  }

  function drawMonsterSpriteFrame(ctx, sheetKey, fallbackPic, x, y, z, vx, vy, flipX, animTick, cheering, stunned, teamColor, isMe, isFinished) {
    var sheet = (W() && W().getMonsterSheet) ? W().getMonsterSheet(sheetKey) : null;
    var speed = isFinished ? 0 : Math.hypot(vx, vy);
    var moving = !isFinished && speed > 0.85;
    var frameIdx = 10;
    if (cheering) {
      frameIdx = 20;
    } else if (moving) {
      var step4 = Math.floor(animTick * 0.22) % 4;
      if (Math.abs(vx) > Math.abs(vy) * 1.15) {
        frameIdx = 11 + step4;
      } else if (vy < -0.5 && Math.abs(vx) < 0.6) {
        frameIdx = 16 + step4;
      } else if (Math.abs(vx) > 0.3 && Math.abs(vy) > 0.3) {
        frameIdx = 6 + step4;
      } else {
        frameIdx = 1 + step4;
      }
    } else {
      frameIdx = 10;
    }

    // True 2.5D perspective depth scale: players closer to bottom camera (higher y) are slightly larger!
    var depthScale = Math.max(0.76, Math.min(1.12, 0.78 + (y - 250) / 820));
    var bounceY = moving ? Math.abs(Math.sin(animTick * 0.28)) * 4.0 : 0;
    var drawY = Math.round(y - z - bounceY);

    ctx.save();
    // 1. 3D Contact Shadow on turf/sand
    var shScale = Math.max(0.45, 1 - z / 180) * depthScale;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
    ctx.beginPath();
    ctx.ellipse(Math.round(x), Math.round(y + 15 * depthScale), (isMe ? 24 : 20) * shScale, 7.5 * shScale, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Glowing 3D Stadium Tactical Ring under feet
    ctx.strokeStyle = isMe ? '#fde047' : teamColor;
    ctx.lineWidth = isMe ? 3.8 : 2.4;
    ctx.beginPath();
    ctx.ellipse(Math.round(x), Math.round(y + 15 * depthScale), (isMe ? 26 : 22) * shScale, 8.5 * shScale, 0, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Draw 7-col 3D Monster Spritesheet frame with 2.5D depth scaling
    ctx.translate(Math.round(x), drawY);
    if (stunned) ctx.globalAlpha = 0.58;
    if (flipX) ctx.scale(-1, 1);

    var baseSize = isMe ? 76 : 68;
    var size = Math.round(baseSize * depthScale);
    if (sheet && sheet.width >= 1000) {
      var fSize = Math.round(sheet.width / 7);
      var col = frameIdx % 7;
      var row = Math.floor(frameIdx / 7);
      ctx.drawImage(sheet, col * fSize, row * fSize, fSize, fSize, -size / 2, -size + 18, size, size);
    } else {
      var pImg = getSportImg(fallbackPic || 'c_bolt_happy');
      if (pImg && pImg.complete && pImg.naturalWidth > 0) {
        ctx.drawImage(pImg, -size * 0.42, -size * 0.55, size * 0.84, size * 0.84);
      }
    }
    ctx.restore();
  }

  function predictLanding(b, groundZ, Wc, Hc) {
    if (b.z <= groundZ + 2 && Math.abs(b.vz) < 0.5) return { x: b.x, y: b.y, t: 0 };
    var g = 0.105;
    var disc = b.vz * b.vz + 2 * g * Math.max(0, b.z - groundZ);
    var t = (b.vz + Math.sqrt(Math.max(0, disc))) / g;
    t = Math.max(0, Math.min(180, t));
    return {
      x: Math.max(135, Math.min((Wc || 1280) - 135, b.x + b.vx * t)),
      y: Math.max(275, Math.min(485, b.y + b.vy * t)),
      t: t
    };
  }

  function startSportsMatch(sp, md, ctrlMode) {
    var canvas = document.getElementById('wg-sports-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var Wc = canvas.width, Hc = canvas.height;
    var keys = {};

    // Calibrated 2.5D Field Coordinates matching the 3D JPEG Stadium Perspective!
    // Soccer 3D Pitch: y: 265..552, Left Goal at x=122 (y: 300..425), Right Goal at x=1158 (y: 300..425), Center=(640, 385)
    // Volleyball 3D Court: y: 270..488, Left Half x: 130..612, Right Half x: 668..1150, Net at x=640
    var PITCH_TOP = sp === 'soccer' ? 265 : 272;
    var PITCH_BOT = sp === 'soccer' ? 550 : 488;
    var PITCH_MID_Y = sp === 'soccer' ? 388 : 378;
    var GOAL_TOP_Y = 298;
    var GOAL_BOT_Y = 432;
    var GOAL_LEFT_X = 128;
    var GOAL_RIGHT_X = Wc - 128;

    var st = {
      sport: sp,
      mode: md || '4v4',
      ctrl: ctrlMode || '1p',
      scoreA: 0,
      scoreB: 0,
      targetScore: sp === 'soccer' ? 3 : 5,
      finished: false,
      waitingKickoff: false,
      goalCooldown: 0,
      netRippleA: 0,
      netRippleB: 0,
      tick: 0,
      bannerText: sp === 'soccer' ? '⚽ 4v4 3D STADIUM! DRIBBLE, PASS (E) OR SHOOT (SPACE)!' : '🏐 4v4 3D BEACH COURT! MOVE TO THE RING & PRESS SPACE TO SPIKE!',
      bannerTimer: 100,
      joyX: 0,
      joyY: 0,
      mouseAim: null,
      pointerSteer: null,
      actionPressed: false,
      actionKind: 'power',
      holder: null,
      stealCooldown: 0,
      idleFrames: 0,
      allyHoldFrames: 0,
      lastHitterTeam: null,
      teamTouches: 0,
      particles: [],
      ballTrail: [],
      players: [],
      ball: { x: Wc / 2, y: PITCH_MID_Y, z: 0, vx: 0, vy: 0, vz: 0, r: 14, spin: 0 }
    };

    // Wire 360° Virtual Analog Thumbstick (#wg-sp-joy)
    var joyEl = document.getElementById('wg-sp-joy');
    var knobEl = document.getElementById('wg-sp-knob');
    if (joyEl && knobEl) {
      var joyActiveId = null;
      var updateJoy = function (e) {
        st.waitingKickoff = false;
        st.pointerSteer = null;
        var r = joyEl.getBoundingClientRect();
        var cx = r.left + r.width / 2;
        var cy = r.top + r.height / 2;
        var dx = e.clientX - cx;
        var dy = e.clientY - cy;
        var maxR = 28;
        var dist = Math.hypot(dx, dy) || 1;
        var k = Math.min(1, dist / maxR);
        st.joyX = (dx / dist) * k;
        st.joyY = (dy / dist) * k;
        knobEl.style.transform = 'translate(' + Math.round(st.joyX * maxR) + 'px,' + Math.round(st.joyY * maxR) + 'px)';
      };
      var endJoy = function () {
        joyActiveId = null;
        st.joyX = 0;
        st.joyY = 0;
        knobEl.style.transform = 'translate(0px,0px)';
      };
      joyEl.addEventListener('pointerdown', function (e) {
        e.preventDefault(); e.stopPropagation();
        joyActiveId = e.pointerId;
        if (joyEl.setPointerCapture) { try { joyEl.setPointerCapture(e.pointerId); } catch (err) {} }
        updateJoy(e);
      });
      joyEl.addEventListener('pointermove', function (e) {
        if (joyActiveId === e.pointerId) updateJoy(e);
      });
      joyEl.addEventListener('pointerup', endJoy);
      joyEl.addEventListener('pointercancel', endJoy);
    }

    var spawnBurst = function (x, y, color, count) {
      for (var i = 0; i < (count || 14); i++) {
        var ang = Math.random() * Math.PI * 2;
        var spd = 1.5 + Math.random() * 4.5;
        st.particles.push({
          x: x, y: y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 1.2,
          r: 2.5 + Math.random() * 3.5,
          life: 18 + Math.random() * 14,
          maxLife: 32,
          color: color || '#fde047'
        });
      }
    };

    var stopAllMotion = function () {
      st.pointerSteer = null;
      st.joyX = 0;
      st.joyY = 0;
      st.ball.vx = 0;
      st.ball.vy = 0;
      st.ball.vz = 0;
      st.ball.z = 0;
      st.players.forEach(function (p) {
        p.vx = 0;
        p.vy = 0;
        p.vz = 0;
        p.z = 0;
        p.dashTimer = 0;
        p.stunTimer = 0;
      });
    };

    var resetPositions = function (servingSide) {
      st.waitingKickoff = false;
      st.holder = null;
      st.stealCooldown = 45;
      st.idleFrames = 0;
      st.allyHoldFrames = 0;
      st.ballTrail = [];
      st.mouseAim = null;
      st.pointerSteer = null;
      st.lastHitterTeam = null;
      st.teamTouches = 0;

      if (sp === 'soccer') {
        // 4v4 3D Football Formation on the 1280x600 3D Pitch
        st.players = [
          { id: 'me',   sheet: 'me', pic: 'c_bolt_happy',  team: 'A', role: 'fwd', name: 'YOU',   color: '#38bdf8', x: 460, y: PITCH_MID_Y, z: 0, vx: 0, vy: 0, vz: 0, dirX: 1, dirY: 0, r: 20, flipX: false, dashTimer: 0, stunTimer: 0, cheerTimer: 0 },
          { id: 'opp1', sheet: 'c1', pic: 'c_ember_happy', team: 'B', role: 'fwd', name: st.ctrl === '2p' ? 'P2' : 'Leo', color: '#f43f5e', x: 840, y: PITCH_MID_Y - 65, z: 0, vx: 0, vy: 0, vz: 0, dirX: -1, dirY: 0, r: 20, flipX: true, dashTimer: 0, stunTimer: 0, cheerTimer: 0 }
        ];
        if (st.mode === '2v2' || st.mode === '4v4') {
          st.players.push(
            { id: 'ally', sheet: 'c0', pic: 'c_lulu_happy',  team: 'A', role: 'gk', name: 'Sky',   color: '#38bdf8', x: GOAL_LEFT_X + 24, y: PITCH_MID_Y - 18, z: 0, vx: 0, vy: 0, vz: 0, dirX: 1, dirY: 0, r: 19, flipX: false, dashTimer: 0, stunTimer: 0, cheerTimer: 0 },
            { id: 'opp2', sheet: 'c2', pic: 'c_nutty_happy', team: 'B', role: 'gk', name: 'Sunny', color: '#f43f5e', x: GOAL_RIGHT_X - 24, y: PITCH_MID_Y - 18, z: 0, vx: 0, vy: 0, vz: 0, dirX: -1, dirY: 0, r: 19, flipX: true, dashTimer: 0, stunTimer: 0, cheerTimer: 0 }
          );
        }
        if (st.mode === '4v4') {
          st.players.push(
            { id: 'ally2', sheet: 'c2', pic: 'c_nutty_happy', team: 'A', role: 'wing', name: 'Pip',   color: '#38bdf8', x: 350, y: 305, z: 0, vx: 0, vy: 0, vz: 0, dirX: 1, dirY: 0, r: 19, flipX: false, dashTimer: 0, stunTimer: 0, cheerTimer: 0 },
            { id: 'ally3', sheet: 'c3', pic: 'c_bolt_happy',  team: 'A', role: 'wing', name: 'Coco',  color: '#38bdf8', x: 340, y: 485, z: 0, vx: 0, vy: 0, vz: 0, dirX: 1, dirY: 0, r: 19, flipX: false, dashTimer: 0, stunTimer: 0, cheerTimer: 0 },
            { id: 'opp3',  sheet: 'c3', pic: 'c_lulu_happy',  team: 'B', role: 'wing', name: 'Ember', color: '#f43f5e', x: 920, y: 310, z: 0, vx: 0, vy: 0, vz: 0, dirX: -1, dirY: 0, r: 19, flipX: true, dashTimer: 0, stunTimer: 0, cheerTimer: 0 },
            { id: 'opp4',  sheet: 'c0', pic: 'c_ember_happy', team: 'B', role: 'wing', name: 'Nutty', color: '#f43f5e', x: 910, y: 485, z: 0, vx: 0, vy: 0, vz: 0, dirX: -1, dirY: 0, r: 19, flipX: true, dashTimer: 0, stunTimer: 0, cheerTimer: 0 }
          );
        }
        st.holder = st.players[0];
        st.ball.x = st.players[0].x + 22;
        st.ball.y = PITCH_MID_Y + 4;
        st.ball.z = 0;
        st.ball.vx = 0;
        st.ball.vy = 0;
        st.ball.vz = 0;
      } else {
        // ====================================================================
        // GIANT 4v4 3D BEACH VOLLEYBALL COURT (4 Players on Each Side!)
        // ====================================================================
        st.players = [
          // Team A (Left Court - 4 Players in 2x2 Quadrant Formation)
          { id: 'me',    sheet: 'me', pic: 'c_bolt_happy',  team: 'A', homeX: 485, homeY: 420, name: 'YOU',   color: '#38bdf8', x: 485, y: 420, z: 0, vx: 0, vy: 0, vz: 0, dirX: 1, dirY: 0, r: 24, flipX: false, dashTimer: 0, stunTimer: 0, cheerTimer: 0, hitCooldown: 0 },
          { id: 'ally1', sheet: 'c0', pic: 'c_lulu_happy',  team: 'A', homeX: 495, homeY: 310, name: 'Sky',   color: '#38bdf8', x: 495, y: 310, z: 0, vx: 0, vy: 0, vz: 0, dirX: 1, dirY: 0, r: 21, flipX: false, dashTimer: 0, stunTimer: 0, cheerTimer: 0, hitCooldown: 0 },
          { id: 'ally2', sheet: 'c2', pic: 'c_nutty_happy', team: 'A', homeX: 275, homeY: 315, name: 'Pip',   color: '#38bdf8', x: 275, y: 315, z: 0, vx: 0, vy: 0, vz: 0, dirX: 1, dirY: 0, r: 21, flipX: false, dashTimer: 0, stunTimer: 0, cheerTimer: 0, hitCooldown: 0 },
          { id: 'ally3', sheet: 'c3', pic: 'c_bolt_happy',  team: 'A', homeX: 245, homeY: 435, name: 'Coco',  color: '#38bdf8', x: 245, y: 435, z: 0, vx: 0, vy: 0, vz: 0, dirX: 1, dirY: 0, r: 21, flipX: false, dashTimer: 0, stunTimer: 0, cheerTimer: 0, hitCooldown: 0 },

          // Team B (Right Court - 4 Players in 2x2 Quadrant Formation)
          { id: 'opp1',  sheet: 'c1', pic: 'c_ember_happy', team: 'B', homeX: Wc - 495, homeY: 310, name: st.ctrl === '2p' ? 'P2' : 'Leo', color: '#f43f5e', x: Wc - 495, y: 310, z: 0, vx: 0, vy: 0, vz: 0, dirX: -1, dirY: 0, r: 21, flipX: true, dashTimer: 0, stunTimer: 0, cheerTimer: 0, hitCooldown: 0 },
          { id: 'opp2',  sheet: 'c2', pic: 'c_nutty_happy', team: 'B', homeX: Wc - 485, homeY: 420, name: 'Sunny', color: '#f43f5e', x: Wc - 485, y: 420, z: 0, vx: 0, vy: 0, vz: 0, dirX: -1, dirY: 0, r: 21, flipX: true, dashTimer: 0, stunTimer: 0, cheerTimer: 0, hitCooldown: 0 },
          { id: 'opp3',  sheet: 'c3', pic: 'c_lulu_happy',  team: 'B', homeX: Wc - 275, homeY: 315, name: 'Ember', color: '#f43f5e', x: Wc - 275, y: 315, z: 0, vx: 0, vy: 0, vz: 0, dirX: -1, dirY: 0, r: 21, flipX: true, dashTimer: 0, stunTimer: 0, cheerTimer: 0, hitCooldown: 0 },
          { id: 'opp4',  sheet: 'c0', pic: 'c_ember_happy', team: 'B', homeX: Wc - 245, homeY: 435, name: 'Nutty', color: '#f43f5e', x: Wc - 245, y: 435, z: 0, vx: 0, vy: 0, vz: 0, dirX: -1, dirY: 0, r: 21, flipX: true, dashTimer: 0, stunTimer: 0, cheerTimer: 0, hitCooldown: 0 }
        ];
        if (st.mode === '1v1') {
          st.players = [st.players[0], st.players[4]];
        } else if (st.mode === '2v2') {
          st.players = [st.players[0], st.players[2], st.players[4], st.players[6]];
        }

        if (servingSide === 'B') {
          st.ball.x = Wc - 380;
          st.ball.y = 370;
          st.ball.z = 95;
          st.ball.vx = -3.2;
          st.ball.vy = 0.3;
          st.ball.vz = 4.8;
        } else {
          st.ball.x = 465;
          st.ball.y = 410;
          st.ball.z = 98;
          st.ball.vx = 0.25;
          st.ball.vy = 0;
          st.ball.vz = 3.9;
          st.bannerText = '🏐 BALL TOSSED TO YOU! PRESS SPACE OR CLICK TO SPIKE!';
          st.bannerTimer = 85;
        }
      }
    };

    resetPositions('A');

    st.keyHandler = function (e) {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE', 'ShiftLeft', 'ShiftRight', 'Enter'].indexOf(e.code) >= 0) {
        e.preventDefault();
        e.stopPropagation();
        if (st.finished && (e.code === 'Space' || e.code === 'Enter')) {
          restartSportsMatch();
          return;
        }
        st.waitingKickoff = false;
        if (e.code !== 'Space' && e.code !== 'KeyE' && e.code !== 'ShiftLeft' && e.code !== 'ShiftRight') {
          st.pointerSteer = null;
        }
        if (document.activeElement && document.activeElement !== document.body && document.activeElement.blur) {
          document.activeElement.blur();
        }
      }
      keys[e.code] = true;
      if (e.code === 'Space') {
        st.actionKind = 'power';
        st.actionPressed = true;
      } else if (e.code === 'KeyE') {
        st.actionKind = 'pass';
        st.actionPressed = true;
      } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        st.actionKind = 'dash';
        st.actionPressed = true;
      }
    };
    st.keyUpHandler = function (e) {
      keys[e.code] = false;
    };
    root.addEventListener('keydown', st.keyHandler, true);
    root.addEventListener('keyup', st.keyUpHandler, true);

    var getCanvasPt = function (e) {
      var rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      return {
        x: ((e.clientX - rect.left) / rect.width) * Wc,
        y: ((e.clientY - rect.top) / rect.height) * Hc
      };
    };
    canvas.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      if (st.finished) {
        restartSportsMatch();
        return;
      }
      var pt = getCanvasPt(e);
      if (!pt) return;
      st.waitingKickoff = false;
      st.mouseAim = pt;
      var me = st.players[0];
      if (sp === 'soccer' && me) {
        if ((st.holder === me || Math.hypot(st.ball.x - me.x, st.ball.y - me.y) < 75) && pt.x > GOAL_RIGHT_X - 160) {
          var adx = pt.x - me.x, ady = pt.y - me.y, alen = Math.hypot(adx, ady) || 1;
          me.dirX = adx / alen;
          me.dirY = ady / alen;
          st.actionKind = 'power';
          st.actionPressed = true;
        } else {
          st.pointerSteer = { x: pt.x, y: Math.max(PITCH_TOP, Math.min(PITCH_BOT, pt.y)) };
        }
      } else {
        st.pointerSteer = { x: Math.min(Wc / 2 - 36, pt.x), y: Math.max(PITCH_TOP, Math.min(PITCH_BOT, pt.y)) };
        st.actionKind = 'power';
        st.actionPressed = true;
      }
    });
    canvas.addEventListener('pointermove', function (e) {
      var pt = getCanvasPt(e);
      if (!pt) return;
      st.mouseAim = pt;
      if (e.buttons && !st.finished) {
        st.pointerSteer = (sp === 'volleyball')
          ? { x: Math.min(Wc / 2 - 36, pt.x), y: Math.max(PITCH_TOP, Math.min(PITCH_BOT, pt.y)) }
          : { x: pt.x, y: Math.max(PITCH_TOP, Math.min(PITCH_BOT, pt.y)) };
      }
    });

    var kickSoccerBall = function (kicker, vx, vy, vz, burstColor) {
      st.holder = null;
      st.stealCooldown = 22;
      st.allyHoldFrames = 0;
      st.ball.x = kicker.x + (vx / (Math.hypot(vx, vy) || 1)) * 24;
      st.ball.y = kicker.y + (vy / (Math.hypot(vx, vy) || 1)) * 16;
      st.ball.vx = vx;
      st.ball.vy = vy;
      st.ball.vz = vz || 2.5;
      spawnBurst(st.ball.x, st.ball.y, burstColor || '#fde047', 16);
      sound('playCorrect');
    };

    var onScore = function (team) {
      if (st.finished) return;
      st.holder = null;
      if (team === 'A') {
        st.scoreA++;
        st.netRippleB = 32;
        sound('playFanfare');
        st.bannerText = (sp === 'soccer' ? '⚽ GOAL FOR YOUR SQUAD! 🌟' : '🏐 ACE POINT FOR YOUR SQUAD! 🌟');
        st.players.forEach(function (p) { if (p.team === 'A') p.cheerTimer = 45; });
        spawnBurst(GOAL_RIGHT_X, (GOAL_TOP_Y + GOAL_BOT_Y) / 2, '#fde047', 35);
      } else {
        st.scoreB++;
        st.netRippleA = 32;
        sound('playPop');
        st.bannerText = (sp === 'soccer' ? '⚽ RIVAL GOAL! YOUR BALL NOW!' : '🏐 RIVAL POINT! YOUR SERVE!');
        st.players.forEach(function (p) { if (p.team === 'B') p.cheerTimer = 45; });
        spawnBurst(GOAL_LEFT_X, (GOAL_TOP_Y + GOAL_BOT_Y) / 2, '#f43f5e', 24);
      }
      st.bannerTimer = 75;
      st.goalCooldown = 45;
      var elA = document.getElementById('wg-sp-score-a');
      var elB = document.getElementById('wg-sp-score-b');
      if (elA) elA.textContent = String(st.scoreA);
      if (elB) elB.textContent = String(st.scoreB);

      if (st.scoreA >= st.targetScore || st.scoreB >= st.targetScore) {
        st.finished = true;
        stopAllMotion();
        var won = st.scoreA >= st.targetScore;
        if (won) {
          var wSt = readState();
          wSt.sportsWins = (Number(wSt.sportsWins) || 0) + 1;
          writeState(wSt);
          addBonusCoins(25);
          sound('playFanfare');
          say('Championship victory! Your team won the match! Plus twenty five coins!');
          st.bannerText = '🏆 VICTORY! +25 🪙 COINS! (CLICK OR PRESS SPACE TO PLAY AGAIN)';
          var wEl = document.getElementById('wg-sp-wins');
          if (wEl) wEl.textContent = String(wSt.sportsWins);
        } else {
          sound('playSoftFail');
          say('Close match! Tap Play Again!');
          st.bannerText = '👏 CLOSE MATCH! CLICK OR PRESS SPACE TO PLAY AGAIN!';
        }
        var stEl = document.getElementById('wg-sp-status');
        if (stEl) stEl.textContent = st.bannerText;
        return;
      }
      resetPositions(team === 'A' ? 'B' : 'A');
    };

    var step = function () {
      if (!document.getElementById('wg-sports-canvas')) { stopSportsLoop(); return; }
      if (!st.finished) st.tick++;
      var me = st.players[0];
      var b = st.ball;

      var useArrowsP1 = (st.ctrl !== '2p');
      var kx = ((keys.KeyD || (useArrowsP1 && keys.ArrowRight)) ? 1 : 0) -
               ((keys.KeyA || (useArrowsP1 && keys.ArrowLeft))  ? 1 : 0);
      var ky = ((keys.KeyS || (useArrowsP1 && keys.ArrowDown))  ? 1 : 0) -
               ((keys.KeyW || (useArrowsP1 && keys.ArrowUp))    ? 1 : 0);

      var dx = kx || st.joyX;
      var dy = ky || st.joyY;

      if (!dx && !dy && st.pointerSteer && me && !st.finished) {
        var psx = st.pointerSteer.x - me.x, psy = st.pointerSteer.y - me.y, pslen = Math.hypot(psx, psy);
        if (pslen > 14) {
          dx = psx / pslen;
          dy = psy / pslen;
        } else {
          st.pointerSteer = null;
        }
      }

      if (!st.finished && !st.waitingKickoff) {
        if (st.goalCooldown > 0) st.goalCooldown--;
        if (st.stealCooldown > 0) st.stealCooldown--;
        if (st.netRippleA > 0) st.netRippleA *= 0.88;
        if (st.netRippleB > 0) st.netRippleB *= 0.88;

        if (sp === 'soccer') {
          // ==================================================================
          // 3D PRO STADIUM SOCCER ENGINE (4v4 Team Passing, Dribble Shield & Power Shot)
          // ==================================================================
          if (st.actionPressed && st.actionKind === 'dash' && me) {
            me.dashTimer = 20;
            sound('playHop');
            st.actionPressed = false;
          }

          var dashBoost = (me.dashTimer && me.dashTimer > 0) ? 1.52 : 1.0;
          if (me.dashTimer > 0) me.dashTimer--;

          var mag = Math.hypot(dx, dy);
          if (mag > 0.05) {
            var nx = dx / Math.max(1, mag), ny = dy / Math.max(1, mag);
            me.vx = nx * 6.4 * dashBoost;
            me.vy = ny * 5.6 * dashBoost;
            me.dirX = dx / mag;
            me.dirY = dy / mag;
            if (Math.abs(me.vx) > 0.15) me.flipX = me.vx < 0;
            st.idleFrames = 0;
          } else {
            me.vx = 0;
            me.vy = 0;
            st.idleFrames++;
          }

          if (Math.hypot(me.vx, me.vy) > 4.0 && st.tick % 4 === 0) {
            st.particles.push({ x: me.x, y: me.y + 14, vx: -me.vx * 0.2, vy: -0.4, r: 4, life: 12, maxLife: 12, color: 'rgba(255,255,255,0.45)' });
          }

          var goalMidY = (GOAL_TOP_Y + GOAL_BOT_Y) / 2;

          // Handle Player 1 Shoot / Pass / Slide Tackle Action!
          if (st.actionPressed && me) {
            st.actionPressed = false;
            if (st.holder === me || Math.hypot(b.x - me.x, b.y - me.y) < 72) {
              if (st.actionKind === 'pass') {
                // Find open winger teammate (Pip or Coco) to pass to!
                var wingers = st.players.filter(function (q) { return q.team === 'A' && q.id !== 'me' && q.role !== 'gk'; });
                var bestWing = wingers[0] || st.players[2];
                if (bestWing) {
                  var pwx = bestWing.x + 65 - me.x, pwy = bestWing.y - me.y, pwl = Math.hypot(pwx, pwy) || 1;
                  kickSoccerBall(me, (pwx / pwl) * 11.5, (pwy / pwl) * 11.5, 3.2, '#38bdf8');
                  st.bannerText = '👟 PASS TO ' + bestWing.name.toUpperCase() + '!';
                  st.bannerTimer = 35;
                }
              } else {
                // GUIDED POWER SHOT TOWARD OPEN CORNER OF RIGHT 3D GOAL!
                var gkOpp = st.players.find(function (q) { return q.team === 'B' && q.role === 'gk'; });
                var openGoalY = goalMidY;
                if (gkOpp) {
                  openGoalY = (gkOpp.y > goalMidY) ? (GOAL_TOP_Y + 24) : (GOAL_BOT_Y - 24);
                } else if (Math.abs(dy) > 0.1) {
                  openGoalY = goalMidY + dy * 48;
                }
                var targetX = GOAL_RIGHT_X + 18;
                var targetY = openGoalY;
                if (st.mouseAim && st.mouseAim.x > me.x + 40 && st.mouseAim.y >= GOAL_TOP_Y - 30 && st.mouseAim.y <= GOAL_BOT_Y + 30) {
                  targetX = GOAL_RIGHT_X + 18;
                  targetY = Math.max(GOAL_TOP_Y + 12, Math.min(GOAL_BOT_Y - 12, st.mouseAim.y));
                }
                var gx = targetX - me.x, gy = targetY - me.y, glen = Math.hypot(gx, gy) || 1;
                kickSoccerBall(me, (gx / glen) * 16.5, (gy / glen) * 16.5, 3.2, '#fde047');
                st.bannerText = '🔥 SUPER POWER SHOT!';
                st.bannerTimer = 35;
              }
            } else {
              // INSTANT SLIDE TACKLE STEAL!
              var bdx0 = b.x - me.x, bdy0 = b.y - me.y, blen0 = Math.hypot(bdx0, bdy0) || 1;
              me.dirX = bdx0 / blen0;
              me.dirY = bdy0 / blen0;
              me.vx = me.dirX * 10.0;
              me.vy = me.dirY * 10.0;
              me.dashTimer = 18;
              sound('playHop');
              if (blen0 < 135) {
                if (st.holder && st.holder.team === 'B') st.holder.stunTimer = 65;
                st.holder = me;
                st.stealCooldown = 45;
                spawnBurst(b.x, b.y, '#34d399', 18);
                st.bannerText = '⚡ CLEAN TACKLE! YOUR BALL!';
                st.bannerTimer = 40;
                sound('playCorrect');
              }
            }
          }

          // Update AI Teammate & Opponents
          st.players.slice(1).forEach(function (p) {
            if (p.stunTimer > 0) {
              p.stunTimer--;
              p.vx *= 0.7;
              p.vy *= 0.7;
              if (Math.hypot(p.vx, p.vy) < 0.4) { p.vx = 0; p.vy = 0; }
              return;
            }
            if (p.id === 'opp1' && st.ctrl === '2p') {
              var p2x = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0);
              var p2y = (keys.ArrowDown ? 1 : 0) - (keys.ArrowUp ? 1 : 0);
              var l2 = Math.hypot(p2x, p2y);
              if (l2 > 0.05) {
                p.vx = (p2x / l2) * 5.4;
                p.vy = (p2y / l2) * 5.4;
                p.dirX = p2x / l2;
                p.dirY = p2y / l2;
                p.flipX = p.vx < 0;
              } else { p.vx = 0; p.vy = 0; }
              if (keys.Enter && st.holder === p) {
                var g2x = GOAL_LEFT_X - p.x, g2y = goalMidY - p.y, g2l = Math.hypot(g2x, g2y) || 1;
                kickSoccerBall(p, (g2x / g2l) * 15.0, (g2y / g2l) * 15.0, 3.2, '#f43f5e');
              }
              return;
            }

            if (p.role === 'gk') {
              var gkX = p.team === 'A' ? (GOAL_LEFT_X + 22) : (GOAL_RIGHT_X - 22);
              var gkY = (p.team === 'A')
                ? Math.max(GOAL_TOP_Y + 10, Math.min(GOAL_BOT_Y - 10, b.y))
                : (goalMidY + Math.sin(st.tick * 0.038) * 52);
              var gdx = gkX - p.x, gdy = gkY - p.y;
              p.vx = Math.abs(gdx) > 6 ? gdx * 0.12 : 0;
              p.vy = Math.abs(gdy) > 6 ? gdy * 0.10 : 0;
              p.flipX = (p.team === 'B');
              if (st.holder === p) {
                if (p.team === 'A') {
                  var toMeX = me.x - p.x, toMeY = me.y - p.y, toMeL = Math.hypot(toMeX, toMeY) || 1;
                  kickSoccerBall(p, (toMeX / toMeL) * 10.5, (toMeY / toMeL) * 10.5, 2.2, '#38bdf8');
                  st.bannerText = '📣 SKY PASSES TO YOU!';
                  st.bannerTimer = 40;
                } else {
                  kickSoccerBall(p, -7.8, (Math.random() - 0.5) * 3.5, 2.8, '#f43f5e');
                }
              }
            } else if (p.team === 'A') {
              // Friendly Wingers (Pip & Coco): Run up the wings with you, or dribble forward & cross back to YOU!
              if (st.holder === p) {
                st.allyHoldFrames++;
                p.vx = 4.2;
                p.vy = (goalMidY - p.y) * 0.04;
                p.dirX = 1;
                p.dirY = 0;
                p.flipX = false;
                if (st.allyHoldFrames > 32 || p.x > GOAL_RIGHT_X - 210) {
                  var pmX = (me.x + 35) - p.x, pmY = me.y - p.y, pmL = Math.hypot(pmX, pmY) || 1;
                  kickSoccerBall(p, (pmX / pmL) * 10.5, (pmY / pmL) * 10.5, 2.4, '#38bdf8');
                  st.bannerText = '👟 ' + p.name.toUpperCase() + ' CROSSES TO YOU! PRESS SPACE!';
                  st.bannerTimer = 45;
                }
              } else {
                var suppX = Math.min(GOAL_RIGHT_X - 180, Math.max(260, me.x + 40));
                var suppY = (p.id === 'ally2') ? 300 : 495;
                var sdx = suppX - p.x, sdy = suppY - p.y;
                p.vx = Math.abs(sdx) > 12 ? sdx * 0.065 : 0;
                p.vy = Math.abs(sdy) > 12 ? sdy * 0.065 : 0;
                p.flipX = false;
              }
            } else if (p.team === 'B') {
              // Rival Defenders (Leo, Ember, Nutty): Slower & zoned so the pitch feels open and tactical!
              if (st.holder === p) {
                var rgx = GOAL_LEFT_X - p.x, rgy = goalMidY - p.y, rlen = Math.hypot(rgx, rgy) || 1;
                p.vx = (rgx / rlen) * 2.15;
                p.vy = (rgy / rlen) * 2.15;
                p.dirX = rgx / rlen;
                p.dirY = rgy / rlen;
                p.flipX = true;
                if (p.x < 350 && st.tick % 35 === 0) {
                  kickSoccerBall(p, (rgx / rlen) * 10.2, (rgy / rlen) * 10.2 + (Math.random() - 0.5) * 2.2, 3.0, '#f43f5e');
                }
              } else {
                // Keep wings in their lanes so all 3 rivals don't bunch up on the ball!
                var targetBX = b.x;
                var targetBY = b.y;
                if (p.id === 'opp3') { targetBX = Math.max(580, b.x + 80); targetBY = Math.min(370, b.y - 45); }
                if (p.id === 'opp4') { targetBX = Math.max(580, b.x + 80); targetBY = Math.max(410, b.y + 45); }
                var cdx = targetBX - p.x, cdy = targetBY - p.y, clen = Math.hypot(cdx, cdy) || 1;
                var maxSpd = (p.id === 'opp1') ? 2.0 : 1.65;
                var tvx = clen > 12 ? (cdx / clen) * Math.min(maxSpd, clen) : 0;
                var tvy = clen > 12 ? (cdy / clen) * Math.min(maxSpd, clen) : 0;
                p.vx = p.vx * 0.93 + tvx * 0.07;
                p.vy = p.vy * 0.93 + tvy * 0.07;
                if (Math.hypot(p.vx, p.vy) < 0.35) { p.vx = 0; p.vy = 0; }
                if (Math.abs(p.vx) > 0.25) p.flipX = p.vx < 0;
              }
            }
          });

          // Move all soccer players & check ball pickup / Dribble Shield!
          st.players.forEach(function (p) {
            p.x = Math.max(GOAL_LEFT_X - 10, Math.min(GOAL_RIGHT_X + 10, p.x + p.vx));
            p.y = Math.max(PITCH_TOP, Math.min(PITCH_BOT, p.y + p.vy));
            if (p.cheerTimer > 0) p.cheerTimer--;
            if (p.stunTimer > 0) return;

            var distToBall = Math.hypot(b.x - p.x, b.y - p.y);
            if (distToBall < p.r + b.r + 6 && b.z < 36) {
              if (!st.holder) {
                if (p.team === 'B' && p.role === 'gk' && Math.hypot(b.vx, b.vy) > 10.5) {
                  return;
                }
                st.holder = p;
                st.allyHoldFrames = 0;
                b.vx = 0; b.vy = 0; b.vz = 0; b.z = 0;
                sound('playPop');
              } else if (st.holder !== p && st.holder.team !== p.team && st.stealCooldown <= 0) {
                if (p.id === 'me') {
                  st.holder.stunTimer = 60;
                  st.holder = me;
                  st.stealCooldown = 45;
                  spawnBurst(b.x, b.y, '#38bdf8', 14);
                  st.bannerText = '⚡ BALL STOLEN! GO SCORE!';
                  st.bannerTimer = 35;
                  sound('playHop');
                } else if (st.holder === me) {
                  // DRIBBLE SHIELD: While YOU are moving/dribbling, AI CANNOT steal the ball off your feet!
                  if (st.idleFrames < 140) {
                    p.stunTimer = 45;
                    var pushDx = p.x - me.x, pushDy = p.y - me.y, pushL = Math.hypot(pushDx, pushDy) || 1;
                    p.vx = (pushDx / pushL) * 6.5;
                    p.vy = (pushDy / pushL) * 6.5;
                    p.x += p.vx * 2;
                    p.y += p.vy * 2;
                    spawnBurst(p.x, p.y, '#34d399', 12);
                    st.bannerText = '💨 SMOOTH DRIBBLE PAST ' + p.name.toUpperCase() + '!';
                    st.bannerTimer = 35;
                    sound('playHop');
                  } else {
                    st.holder = p;
                    st.stealCooldown = 45;
                    st.idleFrames = 0;
                  }
                }
              }
            }
          });

          // Update Ball Position
          if (st.holder) {
            var h = st.holder;
            var dLen = Math.hypot(h.dirX, h.dirY) || 1;
            var targetBX = h.x + (h.dirX / dLen) * 22;
            var targetBY = h.y + (h.dirY / dLen) * 14 + 4;
            b.x += (targetBX - b.x) * 0.6;
            b.y += (targetBY - b.y) * 0.6;
            b.z = Math.hypot(h.vx, h.vy) > 0.8 ? Math.abs(Math.sin(st.tick * 0.35)) * 4 : 0;
            b.vx = h.vx;
            b.vy = h.vy;
            b.spin += Math.hypot(h.vx, h.vy) * 0.08;
            var inGoalWalk = (b.y >= GOAL_TOP_Y - 12 && b.y <= GOAL_BOT_Y + 12);
            if (inGoalWalk && b.x >= GOAL_RIGHT_X - 18 && st.goalCooldown <= 0) onScore('A');
            if (inGoalWalk && b.x <= GOAL_LEFT_X + 18 && st.goalCooldown <= 0) onScore('B');
          } else {
            b.x += b.vx;
            b.y += b.vy;
            b.z += b.vz;
            if (b.z > 0 || b.vz !== 0) {
              b.vz -= 0.32;
              if (b.z <= 0) {
                b.z = 0;
                if (Math.abs(b.vz) > 1.2) { b.vz = -b.vz * 0.55; sound('playPop'); }
                else b.vz = 0;
              }
            }
            b.vx *= (b.z > 2 ? 0.992 : 0.982);
            b.vy *= (b.z > 2 ? 0.992 : 0.982);
            b.spin += Math.hypot(b.vx, b.vy) * 0.06;

            if (Math.hypot(b.vx, b.vy) > 6.5) {
              st.ballTrail.push({ x: b.x, y: b.y, z: b.z, life: 11 });
            }

            var inGoalY = (b.y >= GOAL_TOP_Y - 10 && b.y <= GOAL_BOT_Y + 10 && b.z < 68);
            if (b.y < PITCH_TOP + b.r) { b.y = PITCH_TOP + b.r; b.vy *= -0.82; }
            if (b.y > PITCH_BOT - b.r) { b.y = PITCH_BOT - b.r; b.vy *= -0.82; }
            if (b.x <= GOAL_LEFT_X + b.r) {
              if (inGoalY && st.goalCooldown <= 0) onScore('B');
              else { b.x = GOAL_LEFT_X + b.r; b.vx *= -0.82; }
            }
            if (b.x >= GOAL_RIGHT_X - b.r) {
              if (inGoalY && st.goalCooldown <= 0) onScore('A');
              else { b.x = GOAL_RIGHT_X - b.r; b.vx *= -0.82; }
            }
          }
        } else {
          // ==================================================================
          // GIANT 4v4 3D BEACH VOLLEYBALL ENGINE (Slow Floaty Ball + Teammate Set to YOU!)
          // ==================================================================
          var landing = predictLanding(b, 0, Wc, Hc);
          st.landingSpot = landing;

          if (st.actionPressed && st.actionKind === 'dash' && me) {
            me.dashTimer = 18;
            sound('playHop');
            st.actionPressed = false;
          }
          var vDash = (me.dashTimer && me.dashTimer > 0) ? 1.55 : 1.0;
          if (me.dashTimer > 0) me.dashTimer--;

          var vMag = Math.hypot(dx, dy);
          if (vMag > 0.05) {
            me.vx = (dx / Math.max(1, vMag)) * 5.8 * vDash;
            me.vy = (dy / Math.max(1, vMag)) * 4.8 * vDash;
            if (Math.abs(me.vx) > 0.15) me.flipX = me.vx < 0;
          } else if (landing.x < Wc / 2 && b.vz < 1.5 && Math.hypot(landing.x - me.x, landing.y - me.y) < 145 && Math.hypot(landing.x - me.x, landing.y - me.y) > 10) {
            me.vx = (landing.x - me.x) * 0.14;
            me.vy = (landing.y - me.y) * 0.14;
            me.flipX = false;
          } else {
            me.vx = 0;
            me.vy = 0;
          }

          if (st.actionPressed && me) {
            if (me.z <= 2) {
              me.vz = 8.6;
              sound('playHop');
            }
            if (b.x < Wc / 2 + 20 && Math.hypot(b.x - me.x, b.y - me.y) < 165) {
              me.vx = (b.x - me.x) * 0.22;
              me.vy = (b.y - me.y) * 0.22;
            }
          }

          var sidePlayers = st.players.filter(function (q) {
            return (landing.x < Wc / 2) ? (q.team === 'A') : (q.team === 'B');
          });
          var closestReceiver = sidePlayers[0];
          var bestDist = 99999;
          sidePlayers.forEach(function (q) {
            var d = Math.hypot(landing.x - q.homeX, landing.y - q.homeY) + (q.id === 'me' ? -50 : 0);
            if (d < bestDist) { bestDist = d; closestReceiver = q; }
          });

          st.players.slice(1).forEach(function (p) {
            if (p.id === 'opp1' && st.ctrl === '2p') {
              var p2x = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0);
              var p2y = (keys.ArrowDown ? 1 : 0) - (keys.ArrowUp ? 1 : 0);
              p.vx = p2x * 5.4;
              p.vy = p2y * 4.4;
              if (keys.Enter && p.z <= 1) p.vz = 8.4;
              return;
            }
            var tx = p.homeX;
            var ty = p.homeY;
            if (closestReceiver === p) {
              tx = (p.team === 'A') ? Math.max(135, Math.min(Wc / 2 - 42, landing.x)) : Math.max(Wc / 2 + 42, Math.min(Wc - 135, landing.x));
              ty = Math.max(PITCH_TOP, Math.min(PITCH_BOT, landing.y));
            }
            var distToTarget = Math.hypot(tx - p.x, ty - p.y);
            if (distToTarget < 10) {
              p.vx = 0;
              p.vy = 0;
            } else {
              var maxAISpd = (p.team === 'A') ? 3.8 : 3.2;
              p.vx = Math.max(-maxAISpd, Math.min(maxAISpd, (tx - p.x) * 0.12));
              p.vy = Math.max(-maxAISpd, Math.min(maxAISpd, (ty - p.y) * 0.12));
            }
            p.flipX = (p.team === 'B');

            if (closestReceiver === p && Math.hypot(b.x - p.x, b.y - p.y) < 52 && b.z < 58 && b.vz < 0 && p.z <= 1) {
              p.vz = 6.8;
            }
          });

          st.players.forEach(function (p) {
            if (p.hitCooldown > 0) p.hitCooldown--;
            if (p.cheerTimer > 0) p.cheerTimer--;
            p.x += p.vx;
            p.y = Math.max(PITCH_TOP, Math.min(PITCH_BOT, p.y + p.vy));
            if (p.team === 'A') p.x = Math.max(125, Math.min(Wc / 2 - 36, p.x));
            else p.x = Math.max(Wc / 2 + 36, Math.min(Wc - 125, p.x));

            p.z += p.vz;
            if (p.z > 0 || p.vz !== 0) {
              p.vz -= 0.36;
              if (p.z <= 0) { p.z = 0; p.vz = 0; }
            }

            var bdx = b.x - p.x, bdy = b.y - p.y, bdz = b.z - (p.z + 28);
            var dist2d = Math.hypot(bdx, bdy * 0.85);
            var hitRadius = (p.id === 'me') ? (p.r + b.r + 30) : (p.r + b.r + 12);
            if (dist2d < hitRadius && Math.abs(bdz) < 62 && b.vz <= 2.2 && p.hitCooldown <= 0) {
              p.hitCooldown = 22;
              b.z = Math.max(b.z, p.z + 38);

              if (st.lastHitterTeam !== p.team) {
                st.lastHitterTeam = p.team;
                st.teamTouches = 1;
              } else {
                st.teamTouches++;
              }

              if (p.id === 'me') {
                var isSpike = (p.z > 8 || st.actionPressed) && st.actionKind !== 'pass';
                var targetRX = Wc / 2 + 160 + Math.random() * 280;
                var targetRY = PITCH_TOP + 25 + Math.random() * (PITCH_BOT - PITCH_TOP - 50);
                if (st.mouseAim && st.mouseAim.x > Wc / 2 + 30) {
                  targetRX = Math.min(Wc - 140, st.mouseAim.x);
                  targetRY = Math.max(PITCH_TOP + 15, Math.min(PITCH_BOT - 15, st.mouseAim.y));
                } else if (Math.abs(dy) > 0.1) {
                  targetRY = Math.max(PITCH_TOP + 15, Math.min(PITCH_BOT - 15, PITCH_MID_Y + dy * 90));
                }
                var flightT = isSpike ? 92 : 122;
                b.vx = (targetRX - b.x) / flightT;
                b.vy = (targetRY - b.y) / flightT;
                b.vz = isSpike ? 4.6 : 6.4;
                spawnBurst(b.x, b.y - b.z, isSpike ? '#fde047' : '#38bdf8', isSpike ? 22 : 12);
                st.bannerText = isSpike ? '🔥 MONSTER POWER SPIKE!' : '🏐 NICE OVERHEAD SEND!';
                st.bannerTimer = 45;
                sound(isSpike ? 'playCorrect' : 'playPop');
              } else if (p.team === 'A') {
                if (st.teamTouches <= 1) {
                  var setT = 95;
                  b.vx = (me.x + 15 - b.x) / setT;
                  b.vy = (me.y - b.y) / setT;
                  b.vz = 5.8;
                  spawnBurst(b.x, b.y - b.z, '#38bdf8', 12);
                  st.bannerText = '🙌 ' + p.name.toUpperCase() + ' SETS TO YOU! PRESS SPACE TO SPIKE!';
                  st.bannerTimer = 60;
                  sound('playPop');
                } else {
                  var overX = Wc / 2 + 160 + Math.random() * 260;
                  var overY = PITCH_TOP + 25 + Math.random() * (PITCH_BOT - PITCH_TOP - 50);
                  b.vx = (overX - b.x) / 120;
                  b.vy = (overY - b.y) / 120;
                  b.vz = 6.3;
                  sound('playPop');
                }
              } else {
                var toAX = 220 + Math.random() * 340;
                var toAY = PITCH_TOP + 25 + Math.random() * (PITCH_BOT - PITCH_TOP - 50);
                if (Math.random() < 0.65 && me) {
                  toAX = Math.max(150, Math.min(Wc / 2 - 65, me.x + (Math.random() - 0.5) * 90));
                  toAY = Math.max(PITCH_TOP + 15, Math.min(PITCH_BOT - 15, me.y + (Math.random() - 0.5) * 80));
                }
                var rivalT = 124;
                b.vx = (toAX - b.x) / rivalT;
                b.vy = (toAY - b.y) / rivalT;
                b.vz = 6.5;
                sound('playPop');
              }
            }
          });
          st.actionPressed = false;

          b.x += b.vx;
          b.y += b.vy;
          b.z += b.vz;
          b.vz -= 0.105;
          b.spin += b.vx * 0.04;

          if (Math.hypot(b.vx, b.vy) > 3.2 && st.tick % 2 === 0) {
            st.ballTrail.push({ x: b.x, y: b.y, z: b.z, life: 12 });
          }

          if (b.x < 120 + b.r) { b.x = 120 + b.r; b.vx *= -0.85; }
          if (b.x > Wc - 120 - b.r) { b.x = Wc - 120 - b.r; b.vx *= -0.85; }
          if (b.y < PITCH_TOP) { b.y = PITCH_TOP; b.vy *= -0.85; }
          if (b.y > PITCH_BOT) { b.y = PITCH_BOT; b.vy *= -0.85; }

          if (Math.abs(b.x - Wc / 2) < b.r + 6 && b.z < 52) {
            if (b.z > 28) {
              b.z = 54;
              b.vz = Math.abs(b.vz) * 0.7 + 1.8;
            } else {
              b.vx *= -0.75;
              b.x = b.x < Wc / 2 ? (Wc / 2 - b.r - 7) : (Wc / 2 + b.r + 7);
            }
          }

          if (b.z <= 0 && st.goalCooldown <= 0) {
            b.z = 0;
            spawnBurst(b.x, b.y, '#fde047', 22);
            onScore(b.x < Wc / 2 ? 'B' : 'A');
          }
        }
      }

      // ======================================================================
      // RENDER HIGH-RES 3D STADIUM JPEG BACKGROUND & 2.5D ACTORS (1280 x 600)
      // ======================================================================
      ctx.clearRect(0, 0, Wc, Hc);

      var bgKey = (sp === 'soccer') ? 'stadium_soccer_3d.jpg' : 'stadium_volleyball_3d.jpg';
      var bgImg = getSportImg(bgKey);
      if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
        ctx.drawImage(bgImg, 0, 0, Wc, Hc);
      } else {
        ctx.fillStyle = sp === 'soccer' ? '#15803d' : '#f59e0b';
        ctx.fillRect(0, 0, Wc, Hc);
      }

      if (sp === 'soccer') {
        // Subtle glowing goal-mouth indicator & Live Golden Shot Aiming Arrow
        if (!st.finished && st.holder === me && me) {
          ctx.save();
          var gkOpp2 = st.players.find(function (q) { return q.team === 'B' && q.role === 'gk'; });
          var gMidY = (GOAL_TOP_Y + GOAL_BOT_Y) / 2;
          var openGY = gkOpp2 ? ((gkOpp2.y > gMidY) ? (GOAL_TOP_Y + 24) : (GOAL_BOT_Y - 24)) : gMidY;
          var tx2 = GOAL_RIGHT_X + 15, ty2 = openGY;
          if (st.mouseAim && st.mouseAim.x > me.x + 40 && st.mouseAim.y >= GOAL_TOP_Y - 30 && st.mouseAim.y <= GOAL_BOT_Y + 30) {
            tx2 = GOAL_RIGHT_X + 15; ty2 = st.mouseAim.y;
          }
          var adx2 = tx2 - b.x, ady2 = ty2 - b.y, al2 = Math.hypot(adx2, ady2) || 1;
          var aX = adx2 / al2, aY = ady2 / al2;
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.92)';
          ctx.lineWidth = 4;
          ctx.setLineDash([9, 7]);
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(b.x + aX * 165, b.y + aY * 165);
          ctx.stroke();
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(b.x + aX * 165, b.y + aY * 165, 7.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      } else {
        // 3D Volleyball Target Landing Ring & Flight Guide Line on Sand
        if (!st.finished && st.landingSpot) {
          ctx.save();
          var isOurSide = st.landingSpot.x < Wc / 2;
          ctx.strokeStyle = isOurSide ? '#0284c7' : '#e11d48';
          ctx.fillStyle = isOurSide ? 'rgba(56, 189, 248, 0.38)' : 'rgba(244, 63, 94, 0.30)';
          ctx.lineWidth = 3.5;
          var pulseR = 28 + Math.sin(st.tick * 0.22) * 5;
          ctx.beginPath();
          ctx.ellipse(st.landingSpot.x, st.landingSpot.y, pulseR, 12, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.setLineDash([6, 6]);
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(st.landingSpot.x, st.landingSpot.y);
          ctx.stroke();
          ctx.restore();
        }
      }

      // Draw 3D Ball Shadow on the ground at (b.x, b.y)
      ctx.save();
      var bShScale = Math.max(0.35, 1 - b.z / 200);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
      ctx.beginPath();
      ctx.ellipse(b.x, b.y + 10, b.r * 1.1 * bShScale, 6 * bShScale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Depth-sort Players by y coordinate for true 2.5D overlap
      var sortedPlayers = st.players.slice().sort(function (a, b2) { return a.y - b2.y; });
      sortedPlayers.forEach(function (p) {
        drawMonsterSpriteFrame(
          ctx,
          p.sheet,
          p.pic,
          p.x, p.y, p.z || 0,
          p.vx, p.vy,
          !!p.flipX,
          st.tick,
          p.cheerTimer > 0,
          p.stunTimer > 0,
          p.color,
          p.id === 'me',
          st.finished
        );

        // Clean Transparent Nameplate (NO black rectangle box!)
        ctx.save();
        ctx.font = (p.id === 'me' ? '900 14px ' : '800 12.5px ') + 'Fredoka, sans-serif';
        ctx.textAlign = 'center';
        var labelY = Math.round(p.y - (p.z || 0) - 58);
        var canSpikeNow = (!st.finished && sp === 'volleyball' && p.id === 'me' && b.x < Wc / 2 + 20 && Math.hypot(b.x - p.x, b.y - p.y) < 120);
        var labelTxt = p.stunTimer > 0
          ? '💫 Dizzied!'
          : (p.id === 'me'
              ? (sp === 'soccer'
                  ? (st.holder === p ? '⚽ YOU (SPACE = SHOOT!)' : '▼ YOU')
                  : (canSpikeNow ? '🔥 SPACE = SPIKE!' : '▼ YOU'))
              : p.name);
        ctx.strokeStyle = '#060911';
        ctx.lineWidth = 4.5;
        ctx.strokeText(labelTxt, Math.round(p.x), labelY);
        ctx.fillStyle = p.id === 'me' ? '#fde047' : (p.team === 'A' ? '#7dd3fc' : '#fda4af');
        ctx.fillText(labelTxt, Math.round(p.x), labelY);
        ctx.restore();
      });

      // Draw Ball Comet Trail
      for (var ti = st.ballTrail.length - 1; ti >= 0; ti--) {
        var tr = st.ballTrail[ti];
        tr.life--;
        if (tr.life <= 0) { st.ballTrail.splice(ti, 1); continue; }
        ctx.save();
        ctx.fillStyle = 'rgba(253, 224, 71, ' + (tr.life / 16) + ')';
        ctx.beginPath();
        ctx.arc(tr.x, tr.y - tr.z, b.r * (tr.life / 12), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw 3D Ball at (b.x, b.y - b.z)
      ctx.save();
      var bScale = 1 + (b.z || 0) / 210;
      var drawR = (b.r + 3) * bScale;
      ctx.translate(b.x, b.y - (b.z || 0));
      ctx.rotate(b.spin || 0);
      var bImg = getSportImg('o_ball');
      if (bImg && bImg.complete && bImg.naturalWidth > 0) {
        ctx.drawImage(bImg, -drawR, -drawR, drawR * 2, drawR * 2);
      }
      ctx.restore();

      // Update & Draw Burst Particles
      for (var pi = st.particles.length - 1; pi >= 0; pi--) {
        var pt = st.particles[pi];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;
        if (pt.life <= 0) { st.particles.splice(pi, 1); continue; }
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (st.bannerTimer > 0 || st.finished) {
        if (st.bannerTimer > 0) st.bannerTimer--;
        ctx.save();
        if (st.finished) {
          ctx.fillStyle = 'rgba(6, 9, 17, 0.62)';
          ctx.fillRect(0, Hc / 2 - 48, Wc, 96);
        }
        ctx.font = '800 ' + (st.finished ? '22px' : '18px') + ' Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = '#060911';
        ctx.lineWidth = 5;
        ctx.strokeText(st.bannerText, Wc / 2, st.finished ? Hc / 2 : 30);
        ctx.fillStyle = '#fde047';
        ctx.fillText(st.bannerText, Wc / 2, st.finished ? Hc / 2 : 30);
        ctx.restore();
      }

      sportsRaf = requestAnimationFrame(step);
    };

    sportsState = st;
    sportsRaf = requestAnimationFrame(step);
  }

  root.WorldGame = {
    HOUSE_TIERS: HOUSE_TIERS,
    RECIPES: RECIPES,
    VILLAGERS: VILLAGERS,
    BATTLES: BATTLES,
    SPELLS: SPELLS,
    readState: readState,
    writeState: writeState,
    readBag: readBag,
    writeBag: writeBag,
    getEnergy: getEnergy,
    addEnergy: addEnergy,
    useEnergy: useEnergy,
    addBonusCoins: addBonusCoins,
    updateEnergyChip: updateEnergyChip,
    updateStatusHud: updateStatusHud,
    toggleWorldMute: toggleWorldMute,
    switchDemoPupil: switchDemoPupil,
    updateJobsBadge: updateJobsBadge,
    hasMaterials: hasMaterials,
    giveMaterials: giveMaterials,
    openWorldMap: openWorldMap,
    jumpZone: jumpZone,
    goClassicMap: goClassicMap,
    openEnergyCharge: openEnergyCharge,
    answerEnergy: answerEnergy,
    openWorkshop: openWorkshop,
    setStudioView: setStudioView,
    setCraftFilter: setCraftFilter,
    selectStudioPlaced: selectStudioPlaced,
    focusPlacedItem: focusPlacedItem,
    startStudioDrag: startStudioDrag,
    moveStudioDrag: moveStudioDrag,
    endStudioDrag: endStudioDrag,
    tapStudioStage: tapStudioStage,
    nudgeStudioItem: nudgeStudioItem,
    flipStudioItem: flipStudioItem,
    upgradeStudioItem: upgradeStudioItem,
    storeStudioItem: storeStudioItem,
    seeHomeInWorld: seeHomeInWorld,
    claimBlueprint: claimBlueprint,
    openSmartBuilderQuiz: openSmartBuilderQuiz,
    upgradeHome: upgradeHome,
    craftItem: craftItem,
    placeItem: placeItem,
    removePlaced: removePlaced,
    startMoveMode: startMoveMode,
    openJobsBoard: openJobsBoard,
    trackVillager: trackVillager,
    completeJob: completeJob,
    openBattle: openBattle,
    answerBattle: answerBattle,
    openSportsArena: openSportsArena,
    restartSportsMatch: restartSportsMatch,
    setSportDir: setSportDir,
    sportsAction: sportsAction,
    closeModal: closeModal
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireWorldHud);
  } else {
    wireWorldHud();
  }
})(typeof window !== 'undefined' ? window : this);

