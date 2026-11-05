/* Practice Island — World Game Engine (Stages 2–5 Overhaul: Cloud Sync, My Home & Live Decorator, In-World Villager Quests, World Map & Turn-Based Monster Battles).
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
    { id: 'star',   name: 'Star Bolt',    sub: '35 DMG · Fast',    icon: 'x_star',   dmg: 35, heal: 0,  shield: false },
    { id: 'pow',    name: 'Mega Slam',    sub: '45 DMG · Heavy',   icon: 'x_pow',    dmg: 45, heal: 0,  shield: false },
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
    if (coinEl) coinEl.textContent = '🪙 ' + coins;
    if (statusEl) {
      statusEl.title = 'Level ' + lvl + ' (' + xp + (nextCeil ? '/' + nextCeil : '') + ' XP) · ' + coins + ' Coins — Tap to open Store!';
      if (pop) {
        statusEl.classList.remove('pop'); void statusEl.offsetWidth; statusEl.classList.add('pop');
        setTimeout(function () { statusEl.classList.remove('pop'); }, 320);
      }
    }
    if (muteEl && root.IslandAudio && root.IslandAudio.isMuted) {
      muteEl.textContent = root.IslandAudio.isMuted() ? '🔇' : '🔊';
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
      return '🏡 ' + tier.name + ' · ' + ((st.placed && st.placed.length) || 0) + ' items';
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
    if (chestDone) return '🐚 Done! · ★ ' + totalStars + '/15';
    return '⭐ ' + done + '/5 Stops' + (totalStars ? ' · ★ ' + totalStars : '');
  }

  function openWorldMap() {
    sound('playTap');
    var s = ses() || {};
    var g = s.grade || 3;
    var curZone = (W() && W().S && W().S.zone !== undefined) ? W().S.zone : 1;
    var isOpen = function (z) { return z <= 1 || (W() && W().isOpen && W().isOpen(z)); };
    var islands = [
      { z: 0, name: 'My Home Island',   sub: 'Build · Craft · Garden', img: 'm_island_home',    x: 20, y: 74, open: true },
      { z: 1, name: 'Sunny Meadow',     sub: 'Unit 1 · Grandpa Bolt',  img: 'm_island_meadow',  x: 50, y: 27, open: true },
      { z: 2, name: 'Lighthouse Beach', sub: 'Unit 2 · Lulu',          img: 'm_island_beach',   x: 80, y: 27, open: isOpen(2) },
      { z: 3, name: 'Treehouse Forest', sub: 'Unit 3 · Mr. Nutty',     img: 'm_island_forest',  x: 50, y: 74, open: isOpen(3) },
      { z: 4, name: 'Volcano Peak',     sub: 'Unit 4 · Ember',         img: 'm_island_volcano', x: 80, y: 74, open: isOpen(4) }
    ];
    var nodesHtml = islands.map(function (isl) {
      var here = curZone === isl.z;
      var prog = isl.open ? zoneProgressBadge(isl.z) : '';
      return '<button type="button" class="wg-map-node' + (isl.open ? '' : ' locked') + (here ? ' here' : '') + '" style="left:' + isl.x + '%;top:' + isl.y + '%" onclick="WorldGame.jumpZone(' + isl.z + ')">' +
        '<img src="' + FLAT + isl.img + '.webp" class="wg-map-isl-pic" alt="">' +
        (!isl.open ? '<img src="' + FLAT + 'o_cloud_lock.webp" class="wg-map-lock" alt="">' : '') +
        (here ? '<span class="wg-map-here">📍 You are here</span>' : '') +
        '<span class="wg-map-label"><b>' + esc(isl.name) + '</b><small>' + esc(isl.open ? isl.sub : '🔒 Finish 4 stops in Zone ' + (isl.z - 1)) + '</small>' + (prog ? '<em>' + esc(prog) + '</em>' : '') + '</span>' +
      '</button>';
    }).join('');

    var plazaBtn = '<button type="button" class="wg-map-node" style="left:20%;top:27%" onclick="WorldGame.closeModal(); if(window.IslandWall) IslandWall.open()">' +
      '<img src="' + FLAT + 'm_island_plaza.webp" class="wg-map-isl-pic" alt="">' +
      '<span class="wg-map-label"><b>🌟 Class Plaza</b><small>Friends · Hangout</small><em>👋 Visit Classmates</em></span>' +
    '</button>';

    var pipTipObj = (s.doc && s.doc.pipTip) || ((ZONE_GRAMMAR_TIPS[g] || ZONE_GRAMMAR_TIPS[3])[Math.max(1, curZone)] || ZONE_GRAMMAR_TIPS[3][1]);
    var tipSpeak = 'Captain Pip says: Remember, ' + pipTipObj.word + ' — ' + pipTipObj.meaning + '!';
    var pipBannerHtml =
      '<div class="wg-map-tip">' +
        '<span style="font-size:1.45rem">🦜</span>' +
        '<div style="flex:1;min-width:0"><b>💡 Captain Pip\'s Helpful Tip:</b> Remember: <b>"' + esc(pipTipObj.word) + '"</b> — ' + esc(pipTipObj.meaning) + '!</div>' +
        '<button type="button" class="isl-btn cyan" style="min-height:34px;padding:4px 10px;font-size:0.82rem;flex:none" onclick="IslandAudio.speak(\'' + esc(tipSpeak) + '\', null, \'pip\')">🔊 Hear Tip</button>' +
      '</div>';

    var demoBtns = '';
    if (s.isDemo && s.student) {
      var curId = s.student.id;
      demoBtns =
        '<div style="display:flex;gap:4px;align-items:center;background:rgba(2,6,23,.65);padding:3px 6px;border-radius:12px;border:1px solid rgba(255,255,255,.14)">' +
          '<button type="button" class="isl-btn ' + (curId === 'demo-g3' ? 'cyan' : '') + '" style="min-height:34px;padding:3px 9px;font-size:0.8rem" onclick="WorldGame.switchDemoPupil(\'demo-g3\')">G3</button>' +
          '<button type="button" class="isl-btn ' + (curId === 'demo-g4' ? 'cyan' : '') + '" style="min-height:34px;padding:3px 9px;font-size:0.8rem" onclick="WorldGame.switchDemoPupil(\'demo-g4\')">G4</button>' +
          '<button type="button" class="isl-btn ' + (curId === 'demo-star' ? 'amber' : '') + '" style="min-height:34px;padding:3px 9px;font-size:0.8rem" onclick="WorldGame.switchDemoPupil(\'demo-star\')">⭐ Star</button>' +
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
              '<button type="button" class="isl-btn emerald" style="min-height:38px;padding:5px 11px;font-size:0.86rem" onclick="WorldGame.openSportsArena(\'soccer\', \'2v2\')">⚽ Sports Arena</button>' +
              '<button type="button" class="isl-btn amber" style="min-height:38px;padding:5px 11px;font-size:0.86rem" onclick="WorldGame.closeModal(); if(window.IslandRewards) IslandRewards.openStickerBook()">📒 Sticker Book</button>' +
              '<button type="button" class="isl-btn emerald" style="min-height:38px;padding:5px 11px;font-size:0.86rem" onclick="WorldGame.closeModal(); if(window.IslandRewards) IslandRewards.openCorner()">🏖️ Trophy Camp</button>' +
              '<a class="isl-btn cyan" style="min-height:38px;padding:5px 11px;font-size:0.86rem;text-decoration:none;display:inline-flex;align-items:center" href="../index.html">🏫 School Hub</a>' +
              '<button type="button" class="isl-btn" style="min-height:38px;min-width:40px;padding:5px 10px" onclick="WorldGame.closeModal()">✕</button>' +
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

  /* ---------- 3. 3-Question Energy Charge Burst (⚡ Energy for Finishing!) ---------- */
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
            '<h2 style="margin:6px 0;font-size:1.8rem;color:#fde047">+30 Energy Charged! ⚡</h2>' +
            '<p style="color:#cbd5e1;font-size:1.08rem;margin:0 0 16px">You now have <b style="color:#fde047">⚡ ' + newE + ' Energy</b> to harvest trees, build, or play Sports!</p>' +
            '<button type="button" class="isl-btn emerald" id="wg-energy-done" style="min-width:190px;font-size:1.15rem" onclick="WorldGame.closeModal()">Let\'s Go! 🚀</button>' +
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
            '<button type="button" class="isl-btn" style="margin-left:auto;min-height:42px;min-width:44px;padding:6px 12px" onclick="WorldGame.closeModal()">✕</button>' +
          '</div>' +
          '<div style="color:#bae6fd;font-size:0.92rem;font-weight:700;margin-bottom:8px">' + esc(energyRun.reason) + '</div>' +
          '<div class="wg-q-card">' +
            '<button type="button" class="isl-btn amber" style="min-height:44px;padding:6px 14px;margin-bottom:10px" onclick="IslandAudio.speak(\'' + esc(speakText) + '\')">🔊 Listen</button>' +
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

  /* ---------- 4. Full-Screen Home & Crafting Studio (Inside Room, Outside Garden, Furniture Upgrades & Smart Blueprints) ---------- */
  var workshopTab = 'blueprints';
  var craftFilter = 'all';
  var studioView = 'inside'; // 'inside' (Indoor Room) or 'outside' (Outdoor Garden)
  var studioSelectedIdx = -1;

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
      clue: 'Upgrade your home to Level 2 (Straw Hut) and upgrade ANY placed furniture item to Lv.2 Deluxe (★★)!',
      coins: 35, energy: 25, xp: 15,
      checks: [
        { label: 'Upgrade House to Level 2+ (Straw Hut)', test: function (st) { return (Number(st.houseTier) || 1) >= 2; } },
        { label: 'Upgrade any placed item to Lv.2 Deluxe (★★)', test: function (st) { return (st.placed || []).some(function (p) { return (Number(p.lvl) || 1) >= 2; }); } }
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
    sound('playTap');
    var st = readState();
    if (idx >= 0 && st.placed && st.placed[idx]) {
      var rec = RECIPES.filter(function (r) { return r.id === st.placed[idx].id; })[0];
      if (rec) studioView = (rec.kind === 'patio') ? 'inside' : 'outside';
    }
    studioSelectedIdx = (studioSelectedIdx === idx) ? -1 : idx;
    renderWorkshop();
  }

  function tapStudioStage(ev) {
    if (studioSelectedIdx < 0) return;
    var canvas = document.getElementById('wg-studio-canvas');
    if (!canvas) return;
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    var rx = Math.max(0.06, Math.min(0.94, (ev.clientX - rect.left) / rect.width));
    var ry = Math.max(0.14, Math.min(0.92, (ev.clientY - rect.top) / rect.height));
    var st = readState();
    var item = st.placed && st.placed[studioSelectedIdx];
    if (!item) return;
    var rec = RECIPES.filter(function (r) { return r.id === item.id; })[0];
    var wx, wy;
    if (rec && rec.kind === 'patio') {
      wx = Math.round(ROOM_X0 + rx * ROOM_W);
      wy = Math.round(ROOM_Y0 + ry * ROOM_H);
      wx = Math.max(610, Math.min(1790, wx));
      wy = Math.max(585, Math.min(1080, wy));
    } else {
      wx = Math.round(PLOT_X0 + rx * PLOT_W);
      wy = Math.round(PLOT_Y0 + ry * PLOT_H);
      if (wx > 1020 && wx < 1320 && wy > 450 && wy < 735) wy = 785;
    }
    item.x = wx;
    item.y = wy;
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
      reason: '🧠 Smart Builder Boost: Answer 3 English questions to earn +2 Wood, +2 Stone, +2 Flower, +1 Shell, +1 Berry & +1 Crystal!'
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
      return '<span class="wg-mat-chip"><img src="' + FLAT + MAT_ICONS[k] + '.webp" alt=""><b>' + (Number(bag[k]) || 0) + '</b><small>' + k + '</small></span>';
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
      var starsBadge = itemLv > 1 ? '<span class="wg-item-lv-pill">' + '★'.repeat(itemLv) + '</span>' : '';
      return '<button type="button" class="wg-studio-item' + (isSel ? ' selected' : '') + ' lv-' + itemLv + '" style="left:' + leftPct + '%;top:' + topPct + '%;z-index:' + zIdx + '" title="' + esc(rec.name) + ' Lv.' + itemLv + ' (Tap to select, move, or upgrade)" onclick="WorldGame.selectStudioPlaced(' + idx + ', event)">' +
        '<img src="' + FLAT + rec.id + '.webp" alt="" style="height:' + hPx + 'px;' + (p.flip ? 'transform:scaleX(-1)' : '') + '">' +
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
          '<img src="' + FLAT + selRec.id + '.webp" style="width:30px;height:30px;object-fit:contain" alt="">' +
          '<div class="wg-st-txt"><b>' + esc(selRec.name) + ' (' + '★'.repeat(selLv) + ')</b><small>Tap anywhere in the ' + (studioView === 'inside' ? 'Room' : 'Garden') + ' to move it!</small></div>' +
          (selLv < 3
            ? '<button type="button" class="isl-btn ' + (canSelUp ? 'amber' : '') + '" style="min-height:34px;padding:4px 9px;font-size:0.78rem" onclick="WorldGame.upgradeStudioItem(event)" title="Upgrade to Lv.' + (selLv + 1) + ' (' + (selLv === 1 ? '1 Wood + 1 Flower' : '1 Stone + 1 Crystal') + ')">⬆ Lv.' + (selLv + 1) + ' ★</button>'
            : '<span class="wg-job-done-badge" style="font-size:0.75rem">👑 Max Lv.3</span>') +
          '<button type="button" class="isl-btn cyan" style="min-height:34px;padding:4px 9px;font-size:0.78rem" onclick="WorldGame.flipStudioItem(event)">↔ Flip</button>' +
          '<button type="button" class="isl-btn" style="min-height:34px;padding:4px 9px;font-size:0.78rem;background:#e11d48;border-bottom-color:#881337" onclick="WorldGame.storeStudioItem(event)">📥 Bag</button>' +
          '<button type="button" class="isl-btn emerald" style="min-height:34px;padding:4px 9px;font-size:0.78rem" onclick="WorldGame.selectStudioPlaced(-1, event)">✓</button>' +
        '</div>'
      : '<div class="wg-studio-toolbar hint">' +
          '<span>💡 <b>' + (studioView === 'inside' ? '🛋️ Inside Room Preview' : '🌳 Outside Garden Preview') + ':</b> Tap any item to move, flip, or <b>⬆ Upgrade (Lv.1 → Lv.3 ★)</b>!</span>' +
        '</div>';

    var canvasInnerHtml = '';
    if (studioView === 'inside') {
      canvasInnerHtml =
        '<div class="wg-room-wall tier-' + curTier.level + '">' +
          '<div class="wg-room-win left"></div>' +
          '<div class="wg-room-crest">🛋️ Level ' + curTier.level + ' Room · ' + esc(curTier.name) + '</div>' +
          '<div class="wg-room-win right"></div>' +
        '</div>' +
        '<div class="wg-room-floor">' +
          '<span class="wg-room-side-hint left">⬅ Left Side</span>' +
          '<span class="wg-room-side-hint right">Right Side ➡</span>' +
          '<div class="wg-room-doormat">🚪 Front Door (Exit to Garden)</div>' +
        '</div>' +
        stageItemsHtml;
    } else {
      canvasInnerHtml =
        '<div class="wg-studio-path-h"></div>' +
        '<div class="wg-studio-path-v"></div>' +
        '<div class="wg-studio-stone-pad"></div>' +
        '<span class="wg-studio-garden-tag">🌳 Sunny Garden Yard</span>' +
        '<div class="wg-studio-npc" style="left:9.5%;top:34%" title="Grandpa Bolt"><img src="' + FLAT + 'c_bolt_happy.webp" alt=""></div>' +
        '<div class="wg-studio-wb" style="left:21.8%;top:36.4%" title="Crafting Workbench"><img src="' + FLAT + 'o_workbench.webp" alt=""></div>' +
        '<div class="wg-studio-house" style="left:46.7%;top:34.3%;cursor:pointer;pointer-events:auto" onclick="WorldGame.setStudioView(\'inside\')" title="Tap to look Inside your ' + esc(curTier.name) + '!">' +
          '<img src="' + FLAT + curTier.id + '.webp" alt="">' +
          '<span class="wg-studio-house-tag">🚪 ' + esc(curTier.name) + ' (Tap for Inside!)</span>' +
        '</div>' +
        stageItemsHtml;
    }

    var stageHtml =
      '<div class="wg-studio-stage-wrap">' +
        '<div class="wg-studio-stage-head">' +
          '<div class="wg-view-toggle">' +
            '<button type="button" class="isl-btn ' + (studioView === 'inside' ? 'amber' : '') + '" style="min-height:34px;padding:4px 11px;font-size:0.82rem" onclick="WorldGame.setStudioView(\'inside\')">🛋️ Inside Room (' + indoorPlaced.length + ')</button>' +
            '<button type="button" class="isl-btn ' + (studioView === 'outside' ? 'emerald' : '') + '" style="min-height:34px;padding:4px 11px;font-size:0.82rem" onclick="WorldGame.setStudioView(\'outside\')">🌳 Outside Garden (' + gardenPlaced.length + ')</button>' +
          '</div>' +
          '<span class="wg-st-badge">⭐ Architect Score: ' + comfortStars + '</span>' +
        '</div>' +
        '<div class="wg-studio-canvas ' + (studioView === 'inside' ? 'is-room' : 'is-yard') + '" id="wg-studio-canvas" onclick="WorldGame.tapStudioStage(event)">' +
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
          return '<div class="wg-bp-check' + (ok ? ' ok' : '') + '">' + (ok ? '✅ ' : '⬜ ') + esc(c.label) + '</div>';
        }).join('');
        var allReady = !isDone && bp.checks.every(function (c) { return c.test(st); });
        return '<div class="wg-bp-card' + (isDone ? ' done' : (allReady ? ' ready' : '')) + '">' +
          '<div class="wg-bp-head">' +
            '<b>' + esc(bp.title) + '</b>' +
            '<span class="wg-bp-view-pill ' + bp.view + '">' + (bp.view === 'inside' ? '🛋️ Inside Room' : '🌳 Outside Garden') + '</span>' +
          '</div>' +
          '<div class="wg-bp-clue">"' + esc(bp.clue) + '" <button type="button" class="wg-bp-speak" onclick="IslandAudio.speak(\'' + esc(bp.clue) + '\')">🔊</button></div>' +
          '<div class="wg-bp-checks">' + checkRows + '</div>' +
          '<div class="wg-bp-foot">' +
            '<span class="wg-reward-tag">🎁 +' + bp.coins + ' 🪙 · +' + bp.energy + ' ⚡ · +' + bp.xp + ' XP</span>' +
            (isDone
              ? '<span class="wg-job-done-badge">★ Completed!</span>'
              : (allReady
                ? '<button type="button" class="isl-btn emerald" style="min-height:36px;padding:4px 12px;font-size:0.84rem" onclick="WorldGame.claimBlueprint(\'' + bp.id + '\')">🎁 Claim Reward!</button>'
                : '<button type="button" class="isl-btn cyan" style="min-height:34px;padding:4px 10px;font-size:0.8rem" onclick="WorldGame.setStudioView(\'' + bp.view + '\'); WorldGame.openWorkshop(\'craft\')">🔨 Build This</button>')) +
          '</div>' +
        '</div>';
      }).join('');

      rightHtml =
        '<div class="wg-bp-banner">' +
          '<img src="' + FLAT + 'c_bolt_happy.webp" style="width:48px;height:48px;object-fit:contain" alt="">' +
          '<div style="flex:1;min-width:0">' +
            '<b style="color:#fde047;display:block">📜 Grandpa Bolt\'s Smart Blueprints (' + bpDoneCount + '/6 ★)</b>' +
            '<small style="color:#cbd5e1">Read the English clues, craft &amp; upgrade items in your Room or Garden, and claim big rewards!</small>' +
          '</div>' +
          '<button type="button" class="isl-btn amber" style="min-height:38px;padding:5px 11px;font-size:0.82rem" onclick="WorldGame.openSmartBuilderQuiz()">🧠 +Materials Quiz</button>' +
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
          '<em>' + (curr ? '📍 Current' : (done ? '✓ Built' : '🔒 Locked')) + '</em>' +
        '</div>';
      }).join('');

      rightHtml =
        '<div class="wg-home-upgrade-card">' +
          '<div class="wg-home-pics">' +
            '<div class="wg-home-stage"><img src="' + FLAT + curTier.id + '.webp" alt=""><span>Level ' + curTier.level + ': ' + esc(curTier.name) + '</span></div>' +
            (nextTier ? '<div class="wg-home-arrow">➡</div><div class="wg-home-stage next"><img src="' + FLAT + nextTier.id + '.webp" alt=""><span>Level ' + nextTier.level + ': ' + esc(nextTier.name) + '</span></div>' : '') +
          '</div>' +
          (nextTier
            ? '<div style="margin:10px 0"><div style="font-weight:800;color:#fde68a;margin-bottom:6px">Materials needed for Level ' + nextTier.level + ' (' + esc(nextTier.name) + '):</div><div class="wg-cost-row">' + costPillsHtml(nextTier.cost, bag) + '</div></div>' +
              '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">' +
                '<button type="button" class="isl-btn ' + (canUp ? 'emerald' : '') + '" id="wg-btn-upgrade-home" style="min-height:44px;font-size:0.95rem;padding:6px 18px" ' + (canUp ? 'onclick="WorldGame.upgradeHome()"' : 'disabled aria-disabled="true"') + '>' +
                  (canUp ? '🔨 Upgrade to ' + esc(nextTier.name) + '!' : '🔒 Need More Materials') +
                '</button>' +
                (!canUp ? '<button type="button" class="isl-btn amber" style="min-height:44px;font-size:0.9rem;padding:6px 14px" onclick="WorldGame.openSmartBuilderQuiz()">🧠 Earn Materials (Quiz)</button>' : '') +
              '</div>'
            : '<div style="font-size:1.15rem;font-weight:800;color:#6ee7b7;margin-top:10px">🏰 Maximum Level! You built the Royal Fairy-Tale Castle!</div>') +
        '</div>' +
        '<div class="wg-roadmap-wrap">' +
          '<div class="wg-sec-title">🏰 5-Stage Home Evolution Roadmap (Upgrades Both Outside &amp; Inside Room!)</div>' +
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
          '<span class="wg-rec-kind ' + r.kind + '">' + (r.kind === 'patio' ? '🛋️ Inside Room' : '🌳 Outside Garden') + '</span>' +
          '<img src="' + FLAT + r.id + '.webp" class="wg-recipe-pic" alt="" onclick="IslandAudio.speak(\'' + esc(r.name) + '\')">' +
          '<div class="wg-recipe-name">' + esc(r.name) + '</div>' +
          '<div class="wg-rec-counts">Owned: <b>' + ownedCount + '</b> · Placed: <b>' + placedCount + '</b></div>' +
          '<div class="wg-cost-row">' + costPillsHtml(r.cost, bag) + '</div>' +
          '<div class="wg-recipe-actions">' +
            '<button type="button" class="isl-btn ' + (canCraft ? 'amber' : '') + '" style="min-height:36px;padding:4px 10px;font-size:0.82rem" ' + (canCraft ? 'onclick="WorldGame.craftItem(\'' + r.id + '\')"' : 'disabled') + '>🔨 Craft</button>' +
            (inBag > 0
              ? '<button type="button" class="isl-btn emerald" style="min-height:36px;padding:4px 10px;font-size:0.82rem" onclick="WorldGame.placeItem(\'' + r.id + '\')">📍 Place (+' + inBag + ')</button>'
              : '') +
          '</div>' +
        '</div>';
      }).join('');
      rightHtml =
        '<div class="wg-craft-filters">' +
          '<button type="button" class="isl-btn ' + (craftFilter === 'all' ? 'cyan' : '') + '" style="min-height:34px;padding:4px 11px;font-size:0.8rem" onclick="WorldGame.setCraftFilter(\'all\')">All (16)</button>' +
          '<button type="button" class="isl-btn ' + (craftFilter === 'patio' ? 'amber' : '') + '" style="min-height:34px;padding:4px 11px;font-size:0.8rem" onclick="WorldGame.setCraftFilter(\'patio\')">🛋️ Inside Room (6)</button>' +
          '<button type="button" class="isl-btn ' + (craftFilter === 'garden' ? 'emerald' : '') + '" style="min-height:34px;padding:4px 11px;font-size:0.8rem" onclick="WorldGame.setCraftFilter(\'garden\')">🌳 Outside Garden (10)</button>' +
          '<button type="button" class="isl-btn amber" style="margin-left:auto;min-height:34px;padding:4px 10px;font-size:0.78rem" onclick="WorldGame.openSmartBuilderQuiz()">🧠 +Materials</button>' +
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
          '<img src="' + FLAT + r.id + '.webp" style="width:42px;height:42px;object-fit:contain" alt="">' +
          '<div style="flex:1;min-width:0"><b>' + esc(r.name) + '</b><small style="display:block;color:#94a3b8">' + avail + ' in bag · ' + (r.kind === 'patio' ? '🛋️ Inside Room' : '🌳 Outside Garden') + '</small></div>' +
          '<button type="button" class="isl-btn emerald" style="min-height:36px;padding:4px 12px;font-size:0.82rem" onclick="WorldGame.placeItem(\'' + r.id + '\')">📍 Place</button>' +
        '</div>';
      }).join('');

      var placedListHtml = placed.map(function (p, idx) {
        var rec = RECIPES.filter(function (r) { return r.id === p.id; })[0];
        if (!rec) return '';
        var isSel = (idx === studioSelectedIdx);
        var itemLv = Math.max(1, Math.min(3, Number(p.lvl) || 1));
        return '<div class="wg-bag-row' + (isSel ? ' active' : '') + '" onclick="WorldGame.selectStudioPlaced(' + idx + ', event)" style="cursor:pointer">' +
          '<img src="' + FLAT + rec.id + '.webp" style="width:40px;height:40px;object-fit:contain" alt="">' +
          '<div style="flex:1;min-width:0"><b>' + esc(rec.name) + ' <span style="color:#fde047">' + '★'.repeat(itemLv) + '</span></b><small style="display:block;color:#6ee7b7">' + (rec.kind === 'patio' ? '🛋️ Inside Room' : '🌳 Outside Garden') + ' · ' + (isSel ? '✋ Tap preview map to move or ⬆ Upgrade!' : 'Tap to move or upgrade') + '</small></div>' +
          '<button type="button" class="isl-btn cyan" style="min-height:34px;padding:3px 9px;font-size:0.78rem" onclick="WorldGame.selectStudioPlaced(' + idx + ', event)">✋ Edit</button>' +
        '</div>';
      }).join('');

      rightHtml =
        '<div class="wg-decor-lists">' +
          '<div class="wg-sec-title">🎒 Ready in Your Bag (Tap to Place)</div>' +
          (bagItemsHtml || '<div class="wg-empty-note">All your crafted items are placed! Craft more in the <b>🔨 Craft</b> tab.</div>') +
          '<div class="wg-sec-title" style="margin-top:12px">🪑 Placed Items (' + indoorPlaced.length + ' Inside Room · ' + gardenPlaced.length + ' Outside Garden)</div>' +
          (placedListHtml || '<div class="wg-empty-note">Nothing placed yet — tap Place above or craft new items!</div>') +
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
              '<button type="button" class="isl-btn cyan" id="wg-btn-open-sports" style="min-height:38px;padding:4px 10px;font-size:0.82rem" onclick="WorldGame.openSportsArena(\'soccer\', \'2v2\')">⚽ Sports Arena</button>' +
              '<button type="button" class="isl-btn amber" id="wg-btn-enter-room" style="min-height:38px;padding:4px 10px;font-size:0.82rem" onclick="WorldGame.seeHomeInWorld(true)">🚪 Walk Inside Room!</button>' +
              '<button type="button" class="isl-btn emerald" id="wg-btn-see-world" style="min-height:38px;padding:4px 10px;font-size:0.82rem" onclick="WorldGame.seeHomeInWorld(false)">🌳 Walk in Garden!</button>' +
              '<button type="button" class="isl-btn" style="min-height:38px;min-width:40px;padding:4px 9px" onclick="WorldGame.closeModal()">✕</button>' +
            '</div>' +
          '</div>' +
          '<div class="wg-studio-body">' +
            stageHtml +
            '<div class="wg-studio-panel">' +
              '<div class="wg-studio-tabs cols-4">' +
                '<button type="button" class="isl-btn ' + (workshopTab === 'blueprints' ? 'amber' : '') + '" onclick="WorldGame.openWorkshop(\'blueprints\')">📜 Blueprints (' + bpDoneCount + '/6)</button>' +
                '<button type="button" class="isl-btn ' + (workshopTab === 'home' ? 'amber' : '') + '" onclick="WorldGame.openWorkshop(\'home\')">🏰 House</button>' +
                '<button type="button" class="isl-btn ' + (workshopTab === 'craft' ? 'amber' : '') + '" onclick="WorldGame.openWorkshop(\'craft\')">🔨 Craft (16)</button>' +
                '<button type="button" class="isl-btn ' + (workshopTab === 'decorate' ? 'amber' : '') + '" onclick="WorldGame.openWorkshop(\'decorate\')">🎨 Arrange (' + placed.length + ')</button>' +
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
    say('You crafted a ' + r.name + '! Tap the ' + (r.kind === 'patio' ? 'room' : 'garden') + ' preview to move it!');
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
          '<div class="wg-job-title"><b>' + esc(v.name) + '</b> <small>· Zone ' + v.zone + '</small></div>' +
          '<div class="wg-job-line">"' + esc(v.line) + '"</div>' +
          '<div class="wg-cost-row">' + costPillsHtml(v.need, bag) + ' <span class="wg-reward-tag">🎁 ' + esc(rec ? rec.name : v.gift) + ' + ⚡' + v.energy + '</span></div>' +
        '</div>' +
        '<div class="wg-job-act">' +
          (done
            ? '<span class="wg-job-done-badge">✓ Friend!</span>'
            : '<button type="button" class="isl-btn ' + (canGive ? 'emerald' : 'cyan') + '" style="min-height:42px;padding:6px 12px" onclick="WorldGame.trackVillager(\'' + v.id + '\')">' +
                (canGive ? (inSameZone ? '🎁 Walk & Give' : '🎁 Visit & Give') : '📍 Track') +
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
              '<button type="button" class="isl-btn amber" style="min-height:42px;padding:6px 12px;font-size:0.9rem" onclick="WorldGame.closeModal(); if(window.IslandRewards) IslandRewards.openStickerBook()">📒 Sticker Book</button>' +
              '<button type="button" class="isl-btn" style="min-height:42px;min-width:44px;padding:6px 12px" onclick="WorldGame.closeModal()">✕</button>' +
            '</div>' +
          '</div>' +
          '<div style="color:#bae6fd;font-size:0.92rem;font-weight:700;margin-bottom:8px">💡 Walk up to a villager in the world to hand them materials and catch their gift box!</div>' +
          '<div class="wg-jobs-list">' + rows + '</div>' +
        '</div>' +
      '</div>';
  }

  function trackVillager(vid) {
    var v = VILLAGERS.filter(function (x) { return x.id === vid; })[0];
    if (!v) return;
    if (v.zone > 1 && W() && W().isOpen && !W().isOpen(v.zone)) {
      sound('playSoftFail');
      say('Finish four stops in the previous place to unlock Zone ' + v.zone + '!');
      return;
    }
    closeModal();
    if (W() && W().focusVillager) W().focusVillager(v);
  }

  function completeJob(vid, fromBoard) {
    var v = VILLAGERS.filter(function (x) { return x.id === vid; })[0];
    if (!v) return;
    var st = readState();
    if (st.jobsDone && st.jobsDone[vid]) return;
    if (!hasMaterials(v.need)) {
      sound('playSoftFail');
      say(v.line);
      return;
    }
    spendMaterials(v.need);
    st.jobsDone = st.jobsDone || {};
    st.jobsDone[vid] = 1;
    st.ownedFurniture = st.ownedFurniture || {};
    st.ownedFurniture[v.gift] = (Number(st.ownedFurniture[v.gift]) || 0) + 1;
    var rec = RECIPES.filter(function (r) { return r.id === v.gift; })[0];
    if (rec) {
      st.placed = st.placed || [];
      if (!st.placed.some(function (p) { return p.id === v.gift; })) {
        st.placed.push({ id: v.gift, x: rec.defPos.x, y: rec.defPos.y, flip: false });
      }
    }
    writeState(st);
    addEnergy(v.energy || 15);
    addBonusCoins(10);
    if (App() && App().awardIslandXP) App().awardIslandXP(5, 'job_' + vid);
    sound('playFanfare');
    say('Thank you so much! Here is a ' + (rec ? rec.name : 'gift') + ' for your home!');
    if (W() && W().refreshVillagers) W().refreshVillagers(vid, rec);
    if (fromBoard) openJobsBoard();
  }

  /* ---------- 6. Turn-Based RPG Monster Battles (HP Bars, 4 Spells, Enemy Counter-Turns & Grounded Stage) ---------- */
  var battleRun = null;

  function cleanBattleMonsterSvg(prof, eq) {
    if (!root.MonsterRenderer || !root.MonsterRenderer.renderMonsterSVG) return '';
    try {
      var raw = root.MonsterRenderer.renderMonsterSVG({
        stage: 'growing',
        color: prof.baseColor || 'blue',
        equipped: eq,
        size: 155,
        animated: true,
        isAvatar: true
      });
      var doc = new DOMParser().parseFromString(raw, 'image/svg+xml').documentElement;
      ['.monster-pedestal-stage', '.mon-rig-shadow'].forEach(function (sel) {
        var el = doc.querySelector(sel);
        if (el) el.remove();
      });
      return new XMLSerializer().serializeToString(doc);
    } catch (e) {
      return '';
    }
  }

  function openBattle(bid) {
    var b = BATTLES.filter(function (x) { return x.id === bid; })[0] || BATTLES[0];
    sound('playTap');
    var qs = pickQuestions(6, b.zone);
    battleRun = {
      foe: b,
      qs: qs,
      idx: 0,
      myHp: 100,
      myMaxHp: 100,
      foeHp: b.hp || 90,
      foeMaxHp: b.hp || 90,
      spellId: 'star',
      shielded: false,
      firstTry: true,
      combo: 0,
      busy: false,
      won: false
    };
    renderBattle();
  }

  function pickSpell(spId) {
    if (!battleRun || battleRun.busy || battleRun.won) return;
    sound('playTap');
    battleRun.spellId = spId;
    var btns = document.querySelectorAll('.wg-spell-pick');
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('active', btns[i].getAttribute('data-spell') === spId);
    }
  }

  function renderBattle() {
    if (!battleRun) return;
    var b = battleRun.foe;
    var s = ses(), prof = (s && s.student && s.student.monsterProfile) || {};
    var eq = Object.assign({}, prof.equipped || {}, (s && s.doc && s.doc.look) || {});
    delete eq.background;
    var monSvg = cleanBattleMonsterSvg(prof, eq);

    var myPct = Math.max(0, Math.min(100, Math.round(battleRun.myHp / battleRun.myMaxHp * 100)));
    var foePct = Math.max(0, Math.min(100, Math.round(battleRun.foeHp / battleRun.foeMaxHp * 100)));

    document.body.classList.add('isl-modal-open');
    if (battleRun.won) {
      var dropBadges = Object.keys(b.drop || {}).map(function (k) {
        var icon = MAT_ICONS[k] || 'i_wood';
        return '<span class="wg-mat-badge"><img src="' + FLAT + icon + '.webp" alt=""> +' + b.drop[k] + ' ' + esc(k) + '</span>';
      }).join('');
      modalRoot().innerHTML =
        '<div class="isl-modal-backdrop" id="wg-battle-backdrop">' +
          '<div class="isl-card-modal wg-battle-modal" style="background-image:url(' + FLAT + b.bg + '.webp)">' +
            '<div class="wg-battle-stage">' +
              '<div class="wg-b-side"><div class="wg-b-fighter me cheer"><div class="wg-b-ground-shadow"></div>' + monSvg + '</div></div>' +
              '<div class="wg-b-side"><div class="wg-b-fighter foe dizzy"><div class="wg-b-ground-shadow"></div><img src="' + FLAT + b.dizzy + '.webp" alt=""></div></div>' +
            '</div>' +
            '<div class="wg-battle-card" style="text-align:center">' +
              '<h2 style="margin:4px 0;font-size:1.75rem;color:#fde047">🎉 Victory! ' + esc(b.name) + ' is your friend!</h2>' +
              '<div style="color:#6ee7b7;font-size:1.15rem;font-weight:800;margin:6px 0">⚡ +' + b.energy + ' Energy &amp; 🪙 +10 Coins earned!</div>' +
              '<div class="wg-mat-badges" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:8px 0">' + dropBadges + '</div>' +
              '<button type="button" class="isl-btn emerald" id="wg-battle-done" style="min-width:190px;font-size:1.15rem;margin-top:8px" onclick="WorldGame.closeModal()">Awesome! 🚀</button>' +
            '</div>' +
          '</div>' +
        '</div>';
      return;
    }

    var q = battleRun.qs[battleRun.idx % battleRun.qs.length];
    var promptText = q.q || (q.type === 'listen' ? (q.pic ? q.pic + ' ' : '') + 'Listen and cast: "' + (q.word || q.a) + '"' : q.prompt);
    var speakText = q.speak || q.word || q.q || promptText;

    var spellBarHtml = SPELLS.map(function (sp) {
      var act = battleRun.spellId === sp.id;
      return '<button type="button" class="wg-spell-pick' + (act ? ' active' : '') + '" data-spell="' + sp.id + '" onclick="WorldGame.pickSpell(\'' + sp.id + '\')">' +
        '<img src="' + FLAT + sp.icon + '.webp" alt="">' +
        '<div><div>' + esc(sp.name) + '</div><small>' + esc(sp.sub) + '</small></div>' +
      '</button>';
    }).join('');

    var opts = q.options || q.choices || [];
    var choices = opts.map(function (c, idx) {
      var label = typeof c === 'object' ? (c.word || c.text || c.label) : String(c);
      var pic = typeof c === 'object' && c.pic ? '<span style="font-size:1.35rem">' + esc(c.pic) + '</span>' : '';
      return '<button type="button" class="isl-btn wg-choice-btn wg-spell-btn" data-idx="' + idx + '" onclick="WorldGame.castBattleSpell(' + idx + ',this)">' +
        pic + '<span>' + esc(label) + '</span>' +
      '</button>';
    }).join('');

    modalRoot().innerHTML =
      '<div class="isl-modal-backdrop" id="wg-battle-backdrop">' +
        '<div class="isl-card-modal wg-battle-modal" style="background-image:url(' + FLAT + b.bg + '.webp)">' +
          '<div class="isl-mission-top wg-battle-top">' +
            '<div style="font-size:1.2rem;font-weight:800;color:#fff">⚔️ Friendly Duel · ' + esc(b.name) + '</div>' +
            '<div style="margin-left:auto;color:#fde68a;font:700 13px Fredoka,sans-serif">1. Pick a Spell ➔ 2. Answer to Cast!</div>' +
            '<button type="button" class="isl-btn" style="min-height:38px;min-width:40px;padding:4px 10px" onclick="WorldGame.closeModal()">✕</button>' +
          '</div>' +
          '<div class="wg-battle-stage" id="wg-battle-stage">' +
            '<div class="wg-b-side">' +
              '<div class="wg-b-hpbox">' +
                '<div class="wg-b-hpname"><b>My Monster ' + (battleRun.shielded ? '🛡️' : '') + '</b><span id="wg-hp-me-txt">❤️ ' + battleRun.myHp + '/' + battleRun.myMaxHp + '</span></div>' +
                '<div class="wg-b-hpbar"><div class="wg-b-hpfill" id="wg-hp-me-bar" style="width:' + myPct + '%"></div></div>' +
              '</div>' +
              '<div class="wg-b-fighter me" id="wg-b-me"><div class="wg-b-ground-shadow"></div>' + monSvg + '</div>' +
            '</div>' +
            '<div class="wg-b-fx" id="wg-b-fx"></div>' +
            '<div class="wg-b-side">' +
              '<div class="wg-b-hpbox">' +
                '<div class="wg-b-hpname"><b>' + esc(b.name) + '</b><span id="wg-hp-foe-txt">❤️ ' + battleRun.foeHp + '/' + battleRun.foeMaxHp + '</span></div>' +
                '<div class="wg-b-hpbar"><div class="wg-b-hpfill foe" id="wg-hp-foe-bar" style="width:' + foePct + '%"></div></div>' +
              '</div>' +
              '<div class="wg-b-fighter foe" id="wg-b-foe"><div class="wg-b-ground-shadow"></div><img src="' + FLAT + b.art + '.webp" alt=""></div>' +
            '</div>' +
          '</div>' +
          '<div class="wg-battle-card">' +
            '<div class="wg-spell-bar">' + spellBarHtml + '</div>' +
            '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">' +
              '<button type="button" class="isl-btn amber" style="min-height:40px;padding:4px 12px" onclick="IslandAudio.speak(\'' + esc(speakText) + '\')">🔊</button>' +
              '<div style="font-size:1.2rem;font-weight:800;color:#fff">' + esc(promptText) + '</div>' +
            '</div>' +
            '<div class="wg-choices-grid">' + choices + '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    say(speakText);
  }

  function showDmgPopup(targetEl, text, color) {
    if (!targetEl) return;
    var pop = document.createElement('div');
    pop.className = 'wg-b-dmg';
    if (color) pop.style.color = color;
    pop.textContent = text;
    targetEl.appendChild(pop);
    setTimeout(function () { if (pop.parentNode) pop.parentNode.removeChild(pop); }, 850);
  }

  function castBattleSpell(idx, btnEl) {
    if (!battleRun || battleRun.busy) return;
    var q = battleRun.qs[battleRun.idx % battleRun.qs.length];
    var opts = q.options || q.choices || [];
    var chosen = opts[idx];
    var chosenVal = typeof chosen === 'object' ? (chosen.word || chosen.text || chosen.label) : String(chosen);
    var correctVal = q.answer || q.word || q.a;
    var fxBox = $('wg-b-fx'), meBox = $('wg-b-me'), foeBox = $('wg-b-foe');
    var sp = SPELLS.filter(function (s) { return s.id === battleRun.spellId; })[0] || SPELLS[0];

    if (String(chosenVal).trim().toLowerCase() === String(correctVal).trim().toLowerCase()) {
      battleRun.busy = true;
      sound('playCorrect');
      if (battleRun.firstTry) battleRun.combo = (battleRun.combo || 0) + 1;
      else battleRun.combo = 0;
      var crit = battleRun.firstTry ? 10 : 0;
      var comboBonus = (battleRun.combo > 1) ? (battleRun.combo * 5) : 0;
      var dmg = sp.dmg + crit + comboBonus;
      battleRun.foeHp = Math.max(0, battleRun.foeHp - dmg);
      useEnergy(sp.energy || 5);

      var stg = $('wg-battle-stage');
      if (stg) {
        stg.classList.add('wg-shake');
        setTimeout(function () { stg.classList.remove('wg-shake'); }, 300);
      }
      if (sp.heal) battleRun.myHp = Math.min(battleRun.myMaxHp, battleRun.myHp + sp.heal);
      if (sp.shield) battleRun.shielded = true;

      if (meBox) meBox.classList.add('lunge');
      if (fxBox) {
        fxBox.innerHTML = '<img src="' + FLAT + sp.icon + '.webp" class="wg-spell-fly" alt=""><img src="' + FLAT + 'x_pow.webp" class="wg-spell-pow" alt="">';
      }
      if (foeBox) {
        foeBox.classList.add('hit');
        var comboTag = (battleRun.combo > 1) ? ' 🔥x' + battleRun.combo : '';
        showDmgPopup(foeBox, '-' + dmg + ' HP' + (crit ? ' ✨CRIT!' : '') + comboTag, '#fde047');
      }
      if (sp.heal && meBox) showDmgPopup(meBox, '+' + sp.heal + ' HP 💖', '#6ee7b7');
      if (sp.shield && meBox) showDmgPopup(meBox, '🛡️ SHIELD UP!', '#38bdf8');

      var foeBar = $('wg-hp-foe-bar'), foeTxt = $('wg-hp-foe-txt');
      if (foeBar) foeBar.style.width = Math.max(0, Math.round(battleRun.foeHp / battleRun.foeMaxHp * 100)) + '%';
      if (foeTxt) foeTxt.textContent = '❤️ ' + battleRun.foeHp + '/' + battleRun.foeMaxHp;

      setTimeout(function () {
        if (!battleRun) return;
        if (battleRun.foeHp <= 0) {
          battleRun.busy = false;
          battleRun.won = true;
          var b = battleRun.foe, st = readState();
          st.battlesWon = st.battlesWon || {};
          st.battlesWon[b.id] = 1;
          writeState(st);
          giveMaterials(b.drop);
          addEnergy(b.energy || 20);
          addBonusCoins(10);
          if (App() && App().awardIslandXP) App().awardIslandXP(5, 'battle_' + b.id);
          sound('playFanfare');
          say('Hooray! ' + b.name + ' is now your friend!');
          if (W() && W().refreshBattles) W().refreshBattles(b.id);
          renderBattle();
          return;
        }
        /* Enemy Counter-Attack Turn! */
        if (foeBox) { foeBox.classList.remove('hit'); foeBox.classList.add('lunge'); }
        if (battleRun.shielded) {
          battleRun.shielded = false;
          if (fxBox) fxBox.innerHTML = '<img src="' + FLAT + 'x_shield.webp" class="wg-spell-shield" alt="">';
          if (meBox) showDmgPopup(meBox, '🛡️ BLOCKED!', '#38bdf8');
        } else {
          battleRun.myHp = Math.max(25, battleRun.myHp - 15);
          if (meBox) {
            meBox.classList.add('hit');
            showDmgPopup(meBox, '-15 HP (' + (battleRun.foe.move || 'Bonk!') + ')', '#fda4af');
          }
        }
        setTimeout(function () {
          if (!battleRun) return;
          battleRun.busy = false;
          battleRun.idx++;
          battleRun.firstTry = true;
          renderBattle();
        }, 560);
      }, 620);
    } else {
      battleRun.firstTry = false;
      sound('playSoftFail');
      if (fxBox) {
        fxBox.innerHTML = '<img src="' + FLAT + 'x_shield.webp" class="wg-spell-shield" alt="">';
        setTimeout(function () { if (fxBox) fxBox.innerHTML = ''; }, 520);
      }
      if (btnEl) {
        btnEl.classList.remove('wobble'); void btnEl.offsetWidth; btnEl.classList.add('wobble');
        btnEl.style.opacity = '0.45';
      }
      say('Listen again: ' + (q.speak || correctVal));
    }
  }

  /* ---------- 7. Island Sports Arena: ⚽ Football & 🏐 Beach Volleyball (1v1 Duel & 2v2 Team Match!) ---------- */
  var sportsState = null;
  var sportsRaf = 0;

  function stopSportsLoop() {
    if (sportsRaf) { cancelAnimationFrame(sportsRaf); sportsRaf = 0; }
    if (sportsState && sportsState.keyHandler) {
      root.removeEventListener('keydown', sportsState.keyHandler);
      root.removeEventListener('keyup', sportsState.keyUpHandler);
    }
    sportsState = null;
  }

  var sportsImgs = {};
  function getSportImg(name) {
    if (!sportsImgs[name]) {
      var im = new Image();
      im.src = FLAT + name + '.webp';
      sportsImgs[name] = im;
    }
    return sportsImgs[name];
  }

  function openSportsArena(sport, mode) {
    stopSportsLoop();
    sound('playTap');
    var sp = (sport === 'volleyball') ? 'volleyball' : 'soccer';
    var md = (mode === '1v1') ? '1v1' : '2v2';
    var st = readState();
    if ((Number(st.energy) || 0) < 10) {
      energyRun = {
        qs: pickQuestions(3),
        idx: 0,
        afterSport: { sport: sp, mode: md },
        reason: '⚽ Sports Arena Ticket: Answer 3 quick English questions to earn +30 ⚡ Energy and unlock Football & Volleyball!'
      };
      renderEnergyStep();
      return;
    }
    useEnergy(5);
    st = readState();
    var wins = Number(st.sportsWins) || 0;
    var curE = Number(st.energy) || 0;
    ['c_bolt_happy', 'c_lulu_happy', 'c_nutty_happy', 'c_ember_happy', 'o_ball'].forEach(getSportImg);

    document.body.classList.add('isl-modal-open');
    modalRoot().innerHTML =
      '<div class="isl-modal-backdrop" id="wg-sports-backdrop">' +
        '<div class="isl-card-modal wg-sports-modal">' +
          '<div class="isl-mission-top wg-sports-top">' +
            '<div style="display:flex;align-items:center;gap:8px;font-size:1.22rem;font-weight:800"><img src="' + FLAT + 'o_ball.webp" style="width:32px;height:32px;object-fit:contain" alt=""> 🏆 Island Sports Arena</div>' +
            '<div class="wg-sports-tabs">' +
              '<button type="button" class="isl-btn ' + (sp === 'soccer' ? 'emerald' : '') + '" style="min-height:36px;padding:4px 12px;font-size:0.84rem" onclick="WorldGame.openSportsArena(\'soccer\', \'' + md + '\')">⚽ Football</button>' +
              '<button type="button" class="isl-btn ' + (sp === 'volleyball' ? 'amber' : '') + '" style="min-height:36px;padding:4px 12px;font-size:0.84rem" onclick="WorldGame.openSportsArena(\'volleyball\', \'' + md + '\')">🏐 Volleyball</button>' +
              '<button type="button" class="isl-btn ' + (md === '1v1' ? 'cyan' : '') + '" style="min-height:36px;padding:4px 10px;font-size:0.82rem" onclick="WorldGame.openSportsArena(\'' + sp + '\', \'1v1\')">⚡ 1 vs 1</button>' +
              '<button type="button" class="isl-btn ' + (md === '2v2' ? 'cyan' : '') + '" style="min-height:36px;padding:4px 10px;font-size:0.82rem" onclick="WorldGame.openSportsArena(\'' + sp + '\', \'2v2\')">👥 2 vs 2 Team</button>' +
            '</div>' +
            '<div style="margin-left:auto;display:flex;gap:8px;align-items:center">' +
              '<span class="wg-st-badge">🏆 Wins: ' + wins + ' · ⚡ ' + curE + '</span>' +
              '<button type="button" class="isl-btn" style="min-height:38px;min-width:40px;padding:4px 10px" onclick="WorldGame.closeModal()">✕</button>' +
            '</div>' +
          '</div>' +
          '<div class="wg-sports-scorebar">' +
            '<div class="wg-sp-team blue">🔵 ' + (md === '2v2' ? 'Team You + Sky' : 'You') + ': <b id="wg-sp-score-a">0</b></div>' +
            '<div class="wg-sp-status" id="wg-sp-status">' + (sp === 'soccer' ? '⚽ First to 3 Goals Wins! (+25 🪙)' : '🏐 First to 5 Points Wins! (+25 🪙)') + '</div>' +
            '<div class="wg-sp-team red"><b id="wg-sp-score-b">0</b> : ' + (md === '2v2' ? 'Leo + Sunny 🔴' : 'Leo 🔴') + '</div>' +
          '</div>' +
          '<div class="wg-sports-pitch-wrap">' +
            '<canvas id="wg-sports-canvas" width="820" height="420"></canvas>' +
          '</div>' +
          '<div class="wg-sports-controls">' +
            '<span style="color:#cbd5e1;font-size:0.85rem;font-weight:700">🎮 Drag on the pitch or use <b>Arrow Keys / WASD</b> to move!</span>' +
            '<div style="display:flex;gap:8px;align-items:center">' +
              '<button type="button" class="isl-btn amber" style="min-height:40px;padding:6px 16px;font-size:0.9rem" onclick="WorldGame.sportsAction()">' + (sp === 'soccer' ? '⚡ Power Kick!' : '⬆ Jump &amp; Spike!') + '</button>' +
              '<button type="button" class="isl-btn cyan" style="min-height:40px;padding:6px 14px;font-size:0.86rem" onclick="WorldGame.openSportsArena(\'' + sp + '\', \'' + md + '\')">🔄 Restart Match</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    startSportsMatch(sp, md);
  }

  function sportsAction() {
    if (!sportsState) return;
    sportsState.actionPressed = true;
  }

  function startSportsMatch(sp, md) {
    var canvas = document.getElementById('wg-sports-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var Wc = canvas.width, Hc = canvas.height;
    var keys = {};

    var st = {
      sport: sp,
      mode: md,
      scoreA: 0,
      scoreB: 0,
      targetScore: sp === 'soccer' ? 3 : 5,
      finished: false,
      goalCooldown: 0,
      bannerText: sp === 'soccer' ? '⚽ KICK OFF!' : '🏐 SERVE!',
      bannerTimer: 70,
      pointer: null,
      actionPressed: false,
      players: [],
      ball: { x: Wc / 2, y: sp === 'soccer' ? Hc / 2 : 130, vx: sp === 'soccer' ? 0 : 2.8, vy: sp === 'soccer' ? 0 : -4, r: 16 }
    };

    var resetPositions = function (servingSide) {
      if (sp === 'soccer') {
        st.players = [
          { id: 'me',   team: 'A', role: 'fwd', name: 'You',   pic: 'c_bolt_happy',  color: '#38bdf8', x: 245, y: Hc / 2, vx: 0, vy: 0, r: 24 },
          { id: 'opp1', team: 'B', role: 'fwd', name: 'Leo',   pic: 'c_ember_happy', color: '#f43f5e', x: Wc - 245, y: Hc / 2, vx: 0, vy: 0, r: 24 }
        ];
        if (md === '2v2') {
          st.players.push(
            { id: 'ally', team: 'A', role: 'gk', name: 'Sky',   pic: 'c_lulu_happy',  color: '#a855f7', x: 105, y: Hc / 2, vx: 0, vy: 0, r: 22 },
            { id: 'opp2', team: 'B', role: 'gk', name: 'Sunny', pic: 'c_nutty_happy', color: '#f59e0b', x: Wc - 105, y: Hc / 2, vx: 0, vy: 0, r: 22 }
          );
        }
        st.ball.x = Wc / 2;
        st.ball.y = Hc / 2;
        st.ball.vx = (servingSide === 'B' ? -1.5 : 1.5);
        st.ball.vy = (Math.random() - 0.5) * 2;
      } else {
        // Beach Volleyball: ground is y = 365, net at x = Wc/2 (height 125)
        var groundY = 360;
        st.players = [
          { id: 'me',   team: 'A', name: 'You',   pic: 'c_bolt_happy',  color: '#38bdf8', x: 280, y: groundY, vx: 0, vy: 0, r: 24, groundY: groundY },
          { id: 'opp1', team: 'B', name: 'Leo',   pic: 'c_ember_happy', color: '#f43f5e', x: Wc - 280, y: groundY, vx: 0, vy: 0, r: 24, groundY: groundY }
        ];
        if (md === '2v2') {
          st.players.push(
            { id: 'ally', team: 'A', name: 'Sky',   pic: 'c_lulu_happy',  color: '#a855f7', x: 130, y: groundY, vx: 0, vy: 0, r: 22, groundY: groundY },
            { id: 'opp2', team: 'B', name: 'Sunny', pic: 'c_nutty_happy', color: '#f59e0b', x: Wc - 130, y: groundY, vx: 0, vy: 0, r: 22, groundY: groundY }
          );
        }
        st.ball.x = servingSide === 'B' ? (Wc * 0.72) : (Wc * 0.28);
        st.ball.y = 140;
        st.ball.vx = servingSide === 'B' ? -3.4 : 3.4;
        st.ball.vy = -5.5;
      }
    };

    resetPositions('A');

    st.keyHandler = function (e) {
      keys[e.code] = true;
      if (e.code === 'Space') st.actionPressed = true;
    };
    st.keyUpHandler = function (e) {
      keys[e.code] = false;
    };
    root.addEventListener('keydown', st.keyHandler);
    root.addEventListener('keyup', st.keyUpHandler);

    var updatePointer = function (e) {
      var rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      st.pointer = {
        x: ((e.clientX - rect.left) / rect.width) * Wc,
        y: ((e.clientY - rect.top) / rect.height) * Hc
      };
    };
    canvas.addEventListener('pointerdown', function (e) { updatePointer(e); st.actionPressed = true; });
    canvas.addEventListener('pointermove', function (e) { if (e.buttons) updatePointer(e); });
    canvas.addEventListener('pointerup', function () { st.pointer = null; });

    var onScore = function (team) {
      if (st.finished) return;
      if (team === 'A') {
        st.scoreA++;
        sound('playCorrect');
        st.bannerText = (sp === 'soccer' ? '⚽ GOAL FOR YOUR TEAM!' : '🏐 POINT FOR YOUR TEAM!');
      } else {
        st.scoreB++;
        sound('playPop');
        st.bannerText = (sp === 'soccer' ? '⚽ RIVAL GOAL!' : '🏐 RIVAL POINT!');
      }
      st.bannerTimer = 65;
      st.goalCooldown = 45;
      var elA = document.getElementById('wg-sp-score-a');
      var elB = document.getElementById('wg-sp-score-b');
      if (elA) elA.textContent = String(st.scoreA);
      if (elB) elB.textContent = String(st.scoreB);

      if (st.scoreA >= st.targetScore || st.scoreB >= st.targetScore) {
        st.finished = true;
        var won = st.scoreA >= st.targetScore;
        if (won) {
          var wSt = readState();
          wSt.sportsWins = (Number(wSt.sportsWins) || 0) + 1;
          writeState(wSt);
          addBonusCoins(25);
          sound('playFanfare');
          say('Victory! Your team won the match! Plus twenty five coins!');
          st.bannerText = '🏆 VICTORY! +25 🪙 COINS!';
        } else {
          sound('playSoftFail');
          say('Good match! Tap Restart to play again!');
          st.bannerText = '👏 CLOSE MATCH! TRY AGAIN!';
        }
        var stEl = document.getElementById('wg-sp-status');
        if (stEl) stEl.textContent = st.bannerText;
        return;
      }
      resetPositions(team === 'A' ? 'B' : 'A');
    };

    var step = function () {
      if (!document.getElementById('wg-sports-canvas')) { stopSportsLoop(); return; }
      var me = st.players[0];
      var b = st.ball;

      if (!st.finished) {
        if (st.goalCooldown > 0) st.goalCooldown--;
        var dx = ((keys.ArrowRight || keys.KeyD) ? 1 : 0) - ((keys.ArrowLeft || keys.KeyA) ? 1 : 0);
        var dy = ((keys.ArrowDown || keys.KeyS) ? 1 : 0) - ((keys.ArrowUp || keys.KeyW) ? 1 : 0);

        if (sp === 'soccer') {
          if (st.pointer) {
            var pdx = st.pointer.x - me.x, pdy = st.pointer.y - me.y, plen = Math.hypot(pdx, pdy);
            if (plen > 10) { dx = pdx / plen; dy = pdy / plen; }
          }
          me.vx = dx * 4.7;
          me.vy = dy * 4.7;

          // AI Teammates & Opponents for Soccer
          st.players.slice(1).forEach(function (p) {
            var tx = b.x, ty = b.y;
            if (p.role === 'gk') {
              tx = p.team === 'A' ? 88 : (Wc - 88);
              ty = Math.max(135, Math.min(Hc - 135, b.y));
            } else if (p.team === 'B') {
              tx = b.x + 12;
              ty = b.y;
            }
            var adx = tx - p.x, ady = ty - p.y, alen = Math.hypot(adx, ady) || 1;
            var spd = p.role === 'gk' ? 3.2 : 3.4;
            p.vx = (adx / alen) * Math.min(spd, alen);
            p.vy = (ady / alen) * Math.min(spd, alen);
          });

          // Move soccer players & collide with ball
          st.players.forEach(function (p) {
            p.x = Math.max(46, Math.min(Wc - 46, p.x + p.vx));
            p.y = Math.max(46, Math.min(Hc - 46, p.y + p.vy));
            var bdx = b.x - p.x, bdy = b.y - p.y, dist = Math.hypot(bdx, bdy);
            if (dist < p.r + b.r && dist > 0.01) {
              var nx = bdx / dist, ny = bdy / dist;
              b.x = p.x + nx * (p.r + b.r + 2);
              b.y = p.y + ny * (p.r + b.r + 2);
              var kickPower = (p.id === 'me' && st.actionPressed) ? 10.5 : (p.team === 'A' ? 7.2 : 6.6);
              if (p.team === 'B') {
                // Aim toward left goal
                var gdx = 30 - p.x, gdy = (Hc / 2) - p.y, glen = Math.hypot(gdx, gdy) || 1;
                b.vx = (gdx / glen) * kickPower;
                b.vy = (gdy / glen) * kickPower + (Math.random() - 0.5) * 2;
              } else if (p.id === 'ally') {
                // Pass forward toward right goal
                var adx2 = (Wc - 30) - p.x, ady2 = (Hc / 2) - p.y, alen2 = Math.hypot(adx2, ady2) || 1;
                b.vx = (adx2 / alen2) * kickPower;
                b.vy = (ady2 / alen2) * kickPower;
              } else {
                b.vx = nx * kickPower + p.vx * 0.4;
                b.vy = ny * kickPower + p.vy * 0.4;
              }
              sound('playHop');
            }
          });
          st.actionPressed = false;

          // Ball physics on soccer turf
          b.x += b.vx;
          b.y += b.vy;
          b.vx *= 0.982;
          b.vy *= 0.982;

          // Goal mouth is y: 140..280
          var inGoalY = (b.y > 140 && b.y < 280);
          if (b.y < 36 + b.r) { b.y = 36 + b.r; b.vy *= -0.85; }
          if (b.y > Hc - 36 - b.r) { b.y = Hc - 36 - b.r; b.vy *= -0.85; }
          if (b.x < 38 + b.r) {
            if (inGoalY && st.goalCooldown <= 0) onScore('B');
            else { b.x = 38 + b.r; b.vx *= -0.85; }
          }
          if (b.x > Wc - 38 - b.r) {
            if (inGoalY && st.goalCooldown <= 0) onScore('A');
            else { b.x = Wc - 38 - b.r; b.vx *= -0.85; }
          }
        } else {
          // Beach Volleyball physics
          var groundY = 360;
          if (st.pointer) {
            dx = st.pointer.x < me.x - 10 ? -1 : (st.pointer.x > me.x + 10 ? 1 : 0);
          }
          me.vx = dx * 5.2;
          if ((dy < 0 || st.actionPressed) && me.y >= groundY - 1) {
            me.vy = -10.5;
            sound('playHop');
          }
          st.actionPressed = false;

          st.players.slice(1).forEach(function (p) {
            var onMyHalf = (p.team === 'A' && b.x < Wc / 2) || (p.team === 'B' && b.x >= Wc / 2);
            var homeX = p.team === 'A' ? 125 : (p.id === 'opp1' ? Wc - 265 : Wc - 125);
            var targetX = onMyHalf ? (p.team === 'A' ? Math.min(200, b.x) : b.x) : homeX;
            var diff = targetX - p.x;
            p.vx = Math.max(-4.3, Math.min(4.3, diff * 0.12));
            if (onMyHalf && Math.abs(b.x - p.x) < 48 && b.y > 210 && p.y >= groundY - 1) {
              p.vy = -10.0;
            }
          });

          st.players.forEach(function (p) {
            p.x += p.vx;
            if (p.team === 'A') p.x = Math.max(45, Math.min(Wc / 2 - 34, p.x));
            else p.x = Math.max(Wc / 2 + 34, Math.min(Wc - 45, p.x));
            p.vy += 0.48;
            p.y = Math.min(groundY, p.y + p.vy);
            if (p.y >= groundY) p.vy = 0;

            var bdx = b.x - p.x, bdy = b.y - (p.y - 14), dist = Math.hypot(bdx, bdy);
            if (dist < p.r + b.r && dist > 0.01) {
              b.y = p.y - 14 - (p.r + b.r);
              b.vy = -8.6;
              b.vx = (p.team === 'A' ? 4.4 : -4.4) + (bdx * 0.08);
              sound('playPop');
            }
          });

          b.x += b.vx;
          b.y += b.vy;
          b.vy += 0.22; // gravity

          if (b.x < 30 + b.r) { b.x = 30 + b.r; b.vx *= -0.9; }
          if (b.x > Wc - 30 - b.r) { b.x = Wc - 30 - b.r; b.vx *= -0.9; }
          if (b.y < 24 + b.r) { b.y = 24 + b.r; b.vy *= -0.8; }

          // Net collision at x = Wc/2, y: 235..365
          if (Math.abs(b.x - Wc / 2) < b.r + 6 && b.y > 235) {
            if (b.y < 248) { b.y = 235 - b.r; b.vy = -Math.abs(b.vy) * 0.85; }
            else { b.vx *= -0.85; b.x = b.x < Wc / 2 ? (Wc / 2 - b.r - 7) : (Wc / 2 + b.r + 7); }
          }

          // Sand hit = point for the other side!
          if (b.y >= groundY + 6 && st.goalCooldown <= 0) {
            onScore(b.x < Wc / 2 ? 'B' : 'A');
          }
        }
      }

      // Render Frame
      ctx.clearRect(0, 0, Wc, Hc);
      if (sp === 'soccer') {
        // Striped green stadium pitch
        for (var i = 0; i < 10; i++) {
          ctx.fillStyle = i % 2 === 0 ? '#15803d' : '#166534';
          ctx.fillRect(i * (Wc / 10), 0, Wc / 10 + 1, Hc);
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.lineWidth = 3;
        ctx.strokeRect(38, 36, Wc - 76, Hc - 72);
        ctx.beginPath();
        ctx.moveTo(Wc / 2, 36); ctx.lineTo(Wc / 2, Hc - 36);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(Wc / 2, Hc / 2, 54, 0, Math.PI * 2);
        ctx.stroke();
        // Left & Right Goals (y: 140..280)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.fillRect(8, 140, 30, 140);
        ctx.strokeRect(8, 140, 30, 140);
        ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';
        ctx.fillRect(Wc - 38, 140, 30, 140);
        ctx.strokeRect(Wc - 38, 140, 30, 140);
      } else {
        // Sunny Beach Volleyball Court
        var skyG = ctx.createLinearGradient(0, 0, 0, 230);
        skyG.addColorStop(0, '#0284c7');
        skyG.addColorStop(1, '#38bdf8');
        ctx.fillStyle = skyG;
        ctx.fillRect(0, 0, Wc, 230);
        ctx.fillStyle = '#0ea5e9';
        ctx.fillRect(0, 200, Wc, 45);
        var sandG = ctx.createLinearGradient(0, 245, 0, Hc);
        sandG.addColorStop(0, '#fde047');
        sandG.addColorStop(1, '#f59e0b');
        ctx.fillStyle = sandG;
        ctx.fillRect(0, 245, Wc, Hc - 245);
        // Net
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(Wc / 2 - 4, 235, 8, 135);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.strokeRect(Wc / 2 - 4, 235, 8, 135);
      }

      // Draw Players using real transparent 3D character sprites
      st.players.forEach(function (p) {
        ctx.save();
        // Ground reflection pedestal disc
        ctx.fillStyle = p.team === 'A' ? 'rgba(56, 189, 248, 0.38)' : 'rgba(244, 63, 94, 0.38)';
        ctx.beginPath();
        ctx.ellipse(p.x, p.y + p.r - 2, p.r * 1.05, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = p.id === 'me' ? '#fde047' : (p.team === 'A' ? '#38bdf8' : '#f43f5e');
        ctx.stroke();

        var pImg = getSportImg(p.pic || 'c_bolt_happy');
        if (pImg && pImg.complete && pImg.naturalWidth > 0) {
          var sw = 54, sh = 54;
          ctx.drawImage(pImg, p.x - sw / 2, p.y - sh + 14, sw, sh);
        }

        // Nameplate pill
        ctx.font = '700 11px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(p.x - 24, p.y - p.r - 28, 48, 16);
        ctx.fillStyle = p.id === 'me' ? '#fde047' : '#ffffff';
        ctx.fillText(p.name, p.x, p.y - p.r - 16);
        ctx.restore();
      });

      // Draw Ball using real o_ball.webp sprite
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.beginPath();
      ctx.ellipse(b.x, sp === 'soccer' ? (b.y + b.r) : 366, b.r * 0.85, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      var bImg = getSportImg('o_ball');
      if (bImg && bImg.complete && bImg.naturalWidth > 0) {
        ctx.drawImage(bImg, b.x - b.r - 2, b.y - b.r - 2, (b.r + 2) * 2, (b.r + 2) * 2);
      }
      ctx.restore();

      // Banner Overlay
      if (st.bannerTimer > 0 || st.finished) {
        if (st.bannerTimer > 0) st.bannerTimer--;
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
        ctx.fillRect(Wc / 2 - 190, 14, 380, 38);
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 2;
        ctx.strokeRect(Wc / 2 - 190, 14, 380, 38);
        ctx.font = '800 18px Fredoka, sans-serif';
        ctx.fillStyle = '#fde047';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(st.bannerText, Wc / 2, 33);
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
    BLUEPRINTS: BLUEPRINTS,
    openWorkshop: openWorkshop,
    setStudioView: setStudioView,
    setCraftFilter: setCraftFilter,
    selectStudioPlaced: selectStudioPlaced,
    tapStudioStage: tapStudioStage,
    flipStudioItem: flipStudioItem,
    upgradeStudioItem: upgradeStudioItem,
    storeStudioItem: storeStudioItem,
    seeHomeInWorld: seeHomeInWorld,
    claimBlueprint: claimBlueprint,
    openSmartBuilderQuiz: openSmartBuilderQuiz,
    openSportsArena: openSportsArena,
    sportsAction: sportsAction,
    upgradeHome: upgradeHome,
    craftItem: craftItem,
    placeItem: placeItem,
    removePlaced: removePlaced,
    startMoveMode: startMoveMode,
    openJobsBoard: openJobsBoard,
    trackVillager: trackVillager,
    completeJob: completeJob,
    openBattle: openBattle,
    pickSpell: pickSpell,
    castBattleSpell: castBattleSpell,
    closeModal: closeModal
  };
})(typeof window !== 'undefined' ? window : this);
