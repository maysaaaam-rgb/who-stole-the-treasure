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
      var starsBadge = itemLv > 1 ? '<span class="wg-item-lv-pill">' + '★'.repeat(itemLv) + '</span>' : '';
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
          '<div class="wg-st-txt"><b>' + esc(selRec.name) + ' (' + '★'.repeat(selLv) + ')</b><small>Drag it, tap floor, or use arrows:</small></div>' +
          '<div style="display:flex;gap:3px">' +
            '<button type="button" class="isl-btn cyan" style="min-height:32px;padding:3px 7px;font-size:0.75rem" onclick="WorldGame.nudgeStudioItem(-65, 0, event)" title="Move Left">◀</button>' +
            '<button type="button" class="isl-btn cyan" style="min-height:32px;padding:3px 7px;font-size:0.75rem" onclick="WorldGame.nudgeStudioItem(0, -55, event)" title="Move Up">▲</button>' +
            '<button type="button" class="isl-btn cyan" style="min-height:32px;padding:3px 7px;font-size:0.75rem" onclick="WorldGame.nudgeStudioItem(0, 55, event)" title="Move Down">▼</button>' +
            '<button type="button" class="isl-btn cyan" style="min-height:32px;padding:3px 7px;font-size:0.75rem" onclick="WorldGame.nudgeStudioItem(65, 0, event)" title="Move Right">▶</button>' +
          '</div>' +
          (selLv < 3
            ? '<button type="button" class="isl-btn ' + (canSelUp ? 'amber' : '') + '" style="min-height:32px;padding:3px 8px;font-size:0.76rem" onclick="WorldGame.upgradeStudioItem(event)" title="Upgrade to Lv.' + (selLv + 1) + '">⬆ Lv.' + (selLv + 1) + ' ★</button>'
            : '<span class="wg-job-done-badge" style="font-size:0.72rem">👑 Max</span>') +
          '<button type="button" class="isl-btn cyan" style="min-height:32px;padding:3px 8px;font-size:0.76rem" onclick="WorldGame.flipStudioItem(event)">↔</button>' +
          '<button type="button" class="isl-btn" style="min-height:32px;padding:3px 8px;font-size:0.76rem;background:#e11d48;border-bottom-color:#881337" onclick="WorldGame.storeStudioItem(event)">📥</button>' +
          '<button type="button" class="isl-btn emerald" style="min-height:32px;padding:3px 8px;font-size:0.76rem" onclick="WorldGame.selectStudioPlaced(-1, event)">✓</button>' +
        '</div>'
      : '<div class="wg-studio-toolbar hint">' +
          '<span>✋ <b>' + (studioView === 'inside' ? '🛋️ Inside Room' : '🌳 Outside Garden') + ':</b> Drag any item with your mouse/finger, or tap an item then tap where to put it!</span>' +
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
          '<div class="wg-room-doormat">🚪 Front Door</div>' +
        '</div>' +
        stageItemsHtml;
    } else {
      canvasInnerHtml =
        '<div class="wg-studio-path-h"></div>' +
        '<div class="wg-studio-path-v"></div>' +
        '<div class="wg-studio-stone-pad"></div>' +
        '<span class="wg-studio-garden-tag">🌳 Sunny Garden Yard</span>' +
        '<div class="wg-studio-npc" style="left:9.5%;top:34%" title="Grandpa Bolt"><img src="' + FLAT + 'c_bolt_happy.webp" alt="" draggable="false"></div>' +
        '<div class="wg-studio-wb" style="left:21.8%;top:36.4%" title="Crafting Workbench"><img src="' + FLAT + 'o_workbench.webp" alt="" draggable="false"></div>' +
        '<div class="wg-studio-house" style="left:46.7%;top:34.3%;cursor:pointer;pointer-events:auto" onclick="WorldGame.setStudioView(\'inside\')" title="Tap to look Inside your ' + esc(curTier.name) + '!">' +
          '<img src="' + FLAT + curTier.id + '.webp" alt="" draggable="false">' +
          '<span class="wg-studio-house-tag">🚪 ' + esc(curTier.name) + '</span>' +
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
            '<small style="color:#cbd5e1">Read the English clues, craft &amp; drag items in your Room or Garden, and claim rewards!</small>' +
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
          '<img src="' + FLAT + r.id + '.webp" class="wg-recipe-pic" alt="" draggable="false" onclick="IslandAudio.speak(\'' + esc(r.name) + '\')">' +
          '<div class="wg-recipe-name">' + esc(r.name) + '</div>' +
          '<div class="wg-rec-counts">Owned: <b>' + ownedCount + '</b> · Placed: <b>' + placedCount + '</b></div>' +
          '<div class="wg-cost-row">' + costPillsHtml(r.cost, bag) + '</div>' +
          '<div class="wg-recipe-actions">' +
            '<button type="button" class="isl-btn ' + (canCraft ? 'amber' : '') + '" style="min-height:36px;padding:4px 9px;font-size:0.8rem" ' + (canCraft ? 'onclick="WorldGame.craftItem(\'' + r.id + '\')"' : 'disabled') + '>🔨 Craft</button>' +
            (inBag > 0
              ? '<button type="button" class="isl-btn emerald" style="min-height:36px;padding:4px 9px;font-size:0.8rem" onclick="WorldGame.placeItem(\'' + r.id + '\')">📍 Place (+' + inBag + ')</button>'
              : (placedCount > 0
                ? '<button type="button" class="isl-btn cyan" style="min-height:36px;padding:4px 9px;font-size:0.8rem" onclick="WorldGame.focusPlacedItem(\'' + r.id + '\')">✋ Move</button>'
                : '')) +
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
          '<img src="' + FLAT + r.id + '.webp" style="width:42px;height:42px;object-fit:contain" alt="" draggable="false">' +
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
          '<img src="' + FLAT + rec.id + '.webp" style="width:40px;height:40px;object-fit:contain" alt="" draggable="false">' +
          '<div style="flex:1;min-width:0"><b>' + esc(rec.name) + ' <span style="color:#fde047">' + '★'.repeat(itemLv) + '</span></b><small style="display:block;color:#6ee7b7">' + (rec.kind === 'patio' ? '🛋️ Inside Room' : '🌳 Outside Garden') + ' · ' + (isSel ? '✋ Drag on preview map or use ◀ ▲ ▼ ▶!' : 'Tap to move or upgrade') + '</small></div>' +
          '<button type="button" class="isl-btn cyan" style="min-height:34px;padding:3px 9px;font-size:0.78rem" onclick="WorldGame.selectStudioPlaced(' + idx + ', event)">✋ Move</button>' +
        '</div>';
      }).join('');

      rightHtml =
        '<div class="wg-decor-lists">' +
          '<div class="wg-sec-title">🎒 Ready in Your Bag (Tap to Place)</div>' +
          (bagItemsHtml || '<div class="wg-empty-note">All your crafted items are placed! Drag any item on the left preview to move it.</div>') +
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
      openEnergyCharge('⚡ Charge your monster energy (+30) to start the friendly battle with ' + b.name + '!', function () {
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
            '<h2 style="font-size:1.75rem;margin:8px 0;color:#6ee7b7">🎉 Friendly Victory!</h2>' +
            '<p style="color:#e2e8f0;font-weight:700;margin-bottom:12px">' + esc(b.name) + ' cheered for your English spells and shared treasure with you!</p>' +
            '<div class="wg-cost-row" style="justify-content:center;margin-bottom:14px">' + lootTxt + ' <span class="wg-reward-tag">🪙 +' + b.coins + ' Coins</span></div>' +
            '<div style="display:flex;gap:10px;justify-content:center">' +
              '<button type="button" class="isl-btn amber" onclick="WorldGame.closeModal(); WorldGame.openWorkshop(\'blueprints\')">📜 Open Blueprints</button>' +
              '<button type="button" class="isl-btn emerald" onclick="WorldGame.closeModal()">Continue ▶</button>' +
            '</div>' +
          '</div>' +
        '</div>';
      return;
    }

    var q = battleRun.qs[battleRun.idx];
    var hearts = '❤️'.repeat(battleRun.hp) + '🖤'.repeat(battleRun.maxHp - battleRun.hp);
    var opts = q.options.map(function (o, i) {
      return '<button type="button" class="isl-btn wg-choice-btn" onclick="WorldGame.answerBattle(' + i + ', this)">✨ ' + esc(o) + '</button>';
    }).join('');

    modalRoot().innerHTML =
      '<div class="isl-modal-backdrop" id="wg-battle-backdrop">' +
        '<div class="isl-card-modal" style="max-width:660px">' +
          '<div class="isl-mission-top">' +
            '<div style="font-size:1.25rem;font-weight:800;color:#fda4af">⚔️ Friendly Battle: ' + esc(b.name) + '</div>' +
            '<div style="margin-left:auto;font-size:1.2rem">' + hearts + '</div>' +
            '<button type="button" class="isl-btn" style="margin-left:10px;min-height:40px;min-width:42px;padding:4px 10px" onclick="WorldGame.closeModal()">✕</button>' +
          '</div>' +
          '<div class="wg-battle-arena">' +
            '<div class="wg-fighter"><img src="' + FLAT + b.art + '.webp" id="wg-boss-img" alt=""><span>' + esc(b.name) + '</span></div>' +
          '</div>' +
          '<div class="wg-q-card">' +
            '<button type="button" class="isl-btn amber" style="min-height:42px;padding:6px 14px;margin-bottom:8px" onclick="IslandAudio.speak(\'' + esc(q.speak) + '\')">🔊 Hear Spell</button>' +
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

  /* ---------- 7. 2.5D Island Sports Arena (⚽ Football & 🏐 Beach Volleyball — Animated 3D Monsters, 3D Ball Arc & Full Player Control) ---------- */
  var sportsRaf = 0;
  var sportsState = null;
  var sportsSport = 'soccer'; // 'soccer' | 'volleyball'
  var sportsMode = '2v2';     // '1v1' | '2v2'
  var sportsControl = '1p';   // '1p' (vs AI) | '2p' (2-Player Local Same Screen)
  var sportImgs = {};

  function getSportImg(name) {
    if (!sportImgs[name]) {
      var im = new Image();
      im.src = FLAT + name + '.webp';
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
      root.removeEventListener('keydown', sportsState.keyHandler);
      root.removeEventListener('keyup', sportsState.keyUpHandler);
    }
    sportsState = null;
  }

  function openSportsArena(sport, mode, ctrl) {
    stopSportsLoop();
    sound('playTap');
    if (sport) sportsSport = sport;
    if (mode) sportsMode = mode;
    if (ctrl) sportsControl = ctrl;
    var eNow = getEnergy();
    var st = readState();
    var trophies = Number(st.sportsWins) || 0;
    ['c_bolt_happy', 'c_lulu_happy', 'c_nutty_happy', 'c_ember_happy', 'o_ball'].forEach(getSportImg);

    document.body.classList.add('isl-modal-open');
    modalRoot().innerHTML =
      '<div class="isl-modal-backdrop" id="wg-sports-backdrop">' +
        '<div class="isl-card-modal wg-sports-modal">' +
          '<div class="isl-mission-top wg-sports-top">' +
            '<div style="display:flex;align-items:center;gap:8px;font-size:1.15rem;font-weight:800;color:#fde047">' +
              '<img src="' + FLAT + 'o_ball.webp" style="width:30px;height:30px;object-fit:contain" alt=""> 🏆 2.5D Island Sports Stadium' +
            '</div>' +
            '<div class="wg-sports-selectors">' +
              '<button type="button" class="isl-btn ' + (sportsSport === 'soccer' ? 'emerald' : '') + '" style="min-height:34px;padding:4px 10px;font-size:0.8rem" onclick="WorldGame.openSportsArena(\'soccer\', \'' + sportsMode + '\', \'' + sportsControl + '\')">⚽ Football</button>' +
              '<button type="button" class="isl-btn ' + (sportsSport === 'volleyball' ? 'amber' : '') + '" style="min-height:34px;padding:4px 10px;font-size:0.8rem" onclick="WorldGame.openSportsArena(\'volleyball\', \'' + sportsMode + '\', \'' + sportsControl + '\')">🏐 Volleyball</button>' +
              '<button type="button" class="isl-btn ' + (sportsMode === '1v1' ? 'cyan' : '') + '" style="min-height:34px;padding:4px 9px;font-size:0.78rem" onclick="WorldGame.openSportsArena(\'' + sportsSport + '\', \'1v1\', \'' + sportsControl + '\')">1 vs 1</button>' +
              '<button type="button" class="isl-btn ' + (sportsMode === '2v2' ? 'cyan' : '') + '" style="min-height:34px;padding:4px 9px;font-size:0.78rem" onclick="WorldGame.openSportsArena(\'' + sportsSport + '\', \'2v2\', \'' + sportsControl + '\')">2 vs 2 Team</button>' +
              '<button type="button" class="isl-btn ' + (sportsControl === '2p' ? 'amber' : '') + '" style="min-height:34px;padding:4px 9px;font-size:0.78rem" onclick="WorldGame.openSportsArena(\'' + sportsSport + '\', \'' + sportsMode + '\', \'' + (sportsControl === '2p' ? '1p' : '2p') + '\')">' + (sportsControl === '2p' ? '👥 2P Local (WASD vs Arrows)' : '🤖 1P vs AI') + '</button>' +
            '</div>' +
            '<div style="margin-left:auto;display:flex;gap:6px;align-items:center">' +
              '<span class="wg-st-badge">🏆 Wins: <b id="wg-sp-wins">' + trophies + '</b></span>' +
              '<span class="wg-st-badge" style="color:#fde047">⚡ <b id="wg-sp-energy">' + eNow + '</b></span>' +
              '<button type="button" class="isl-btn" style="min-height:36px;min-width:38px;padding:4px 9px" onclick="WorldGame.closeModal()">✕</button>' +
            '</div>' +
          '</div>' +
          '<div class="wg-sports-scoreboard">' +
            '<div class="wg-sp-team blue"><span>🟦 ' + (sportsMode === '2v2' ? 'YOU + SKY' : 'YOU (P1)') + '</span><b id="wg-sp-score-a">0</b></div>' +
            '<div class="wg-sp-vs">' +
              '<span id="wg-sp-status">' + (sportsSport === 'soccer' ? '⚽ First to 3 Goals Wins +25 🪙!' : '🏐 First to 5 Points Wins +25 🪙!') + '</span>' +
              '<small>⚡ Earned by your English effort! You control your monster — tap field, use D-Pad, or WASD/Arrows!</small>' +
            '</div>' +
            '<div class="wg-sp-team red"><b id="wg-sp-score-b">0</b><span>' + (sportsControl === '2p' ? 'PLAYER 2 (ARROWS)' : (sportsMode === '2v2' ? 'LEO &amp; SUNNY' : 'LEO (RIVAL)')) + ' 🟥</span></div>' +
          '</div>' +
          '<div class="wg-sports-stage-wrap">' +
            '<canvas id="wg-sports-canvas" width="820" height="430"></canvas>' +
            '<div class="wg-sports-controls">' +
              '<div class="wg-sp-dpad" aria-label="Directional Pad">' +
                '<button type="button" class="isl-btn cyan wg-dpad-btn" onpointerdown="WorldGame.setSportDir(-1,0,true)" onpointerup="WorldGame.setSportDir(-1,0,false)" onpointerleave="WorldGame.setSportDir(-1,0,false)">◀</button>' +
                '<button type="button" class="isl-btn cyan wg-dpad-btn" onpointerdown="WorldGame.setSportDir(0,-1,true)" onpointerup="WorldGame.setSportDir(0,-1,false)" onpointerleave="WorldGame.setSportDir(0,-1,false)">▲</button>' +
                '<button type="button" class="isl-btn cyan wg-dpad-btn" onpointerdown="WorldGame.setSportDir(0,1,true)" onpointerup="WorldGame.setSportDir(0,1,false)" onpointerleave="WorldGame.setSportDir(0,1,false)">▼</button>' +
                '<button type="button" class="isl-btn cyan wg-dpad-btn" onpointerdown="WorldGame.setSportDir(1,0,true)" onpointerup="WorldGame.setSportDir(1,0,false)" onpointerleave="WorldGame.setSportDir(1,0,false)">▶</button>' +
              '</div>' +
              '<div class="wg-sp-action-group">' +
                '<button type="button" class="isl-btn cyan" style="min-height:40px;padding:5px 12px;font-size:0.84rem" onclick="WorldGame.sportsAction(\'lob\')">' + (sportsSport === 'soccer' ? '🚀 Lob / Pass' : '🙌 High Set') + '</button>' +
                '<button type="button" class="isl-btn emerald" style="min-height:40px;padding:5px 12px;font-size:0.84rem" onclick="WorldGame.sportsAction(\'dash\')">💨 Turbo Dash</button>' +
                '<button type="button" class="isl-btn amber" style="min-height:40px;padding:5px 14px;font-size:0.88rem" onclick="WorldGame.sportsAction(\'power\')">' + (sportsSport === 'soccer' ? '🔥 SUPER SHOT! (Space)' : '🔥 JUMP SPIKE! (Space)') + '</button>' +
              '</div>' +
              '<div style="display:flex;gap:5px;margin-left:auto">' +
                '<button type="button" class="isl-btn amber" style="min-height:38px;padding:4px 10px;font-size:0.8rem" onclick="WorldGame.openEnergyCharge(\'⚡ Answer 3 English questions to boost +30 Energy!\', function(){ WorldGame.openSportsArena(\'' + sportsSport + '\', \'' + sportsMode + '\', \'' + sportsControl + '\'); })">⚡ +Energy</button>' +
                '<button type="button" class="isl-btn" style="min-height:38px;padding:4px 10px;font-size:0.8rem" onclick="WorldGame.restartSportsMatch()">🔄 Kick Off</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    startSportsMatch(sportsSport, sportsMode, sportsControl);
  }

  function restartSportsMatch() {
    if (getEnergy() < 10) {
      openEnergyCharge('⚡ Charge +30 Energy with 3 quick English questions to play another match!', function () {
        openSportsArena(sportsSport, sportsMode, sportsControl);
      });
      return;
    }
    useEnergy(10);
    openSportsArena(sportsSport, sportsMode, sportsControl);
  }

  function setSportDir(dx, dy, isDown) {
    if (!sportsState) return;
    if (isDown) sportsState.waitingKickoff = false;
    if (dx < 0) sportsState.pad.left = isDown;
    if (dx > 0) sportsState.pad.right = isDown;
    if (dy < 0) sportsState.pad.up = isDown;
    if (dy > 0) sportsState.pad.down = isDown;
  }

  function sportsAction(kind) {
    if (!sportsState) return;
    sportsState.waitingKickoff = false;
    var me = sportsState.players[0];
    if (!me) return;
    if (kind === 'dash') {
      me.dashTimer = 18;
      sound('playHop');
      return;
    }
    sportsState.actionKind = kind || 'power';
    sportsState.actionPressed = true;
  }

  function drawMonsterSpriteFrame(ctx, sheetKey, fallbackPic, x, y, z, vx, vy, flipX, animTick, cheering, teamColor, isMe) {
    var sheet = (W() && W().getMonsterSheet) ? W().getMonsterSheet(sheetKey) : null;
    var speed = Math.hypot(vx, vy);
    var moving = speed > 0.25;
    var frameIdx = 0;
    if (cheering) {
      frameIdx = 20;
    } else if (moving) {
      var step4 = Math.floor(animTick * 0.25) % 4;
      if (Math.abs(vx) > Math.abs(vy) * 1.35) {
        frameIdx = 11 + step4; // Side profile run cycle
      } else if (vy < -0.5 && Math.abs(vx) < 0.6) {
        frameIdx = 16 + step4; // Up/back run cycle
      } else if (Math.abs(vx) > 0.35 && Math.abs(vy) > 0.35) {
        frameIdx = 6 + step4;  // 3/4 diagonal run cycle
      } else {
        frameIdx = 1 + step4;  // Front run cycle
      }
    } else {
      frameIdx = 10; // Side profile athletic ready stance
    }

    var bounceY = moving ? Math.abs(Math.sin(animTick * 0.42)) * 6 : Math.sin(animTick * 0.08) * 2;
    var drawY = y - z - bounceY;
    var squashX = moving ? (1 + Math.sin(animTick * 0.42) * 0.06) : 1;
    var squashY = moving ? (1 - Math.sin(animTick * 0.42) * 0.06) : 1;

    ctx.save();
    // 1. Ground shadow on the turf/sand (shrinks as player jumps higher in z)
    var shScale = Math.max(0.45, 1 - z / 160);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.36)';
    ctx.beginPath();
    ctx.ellipse(x, y + 18, 24 * shScale, 8 * shScale, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Glowing 3D Stadium Pedestal Ring under player
    ctx.strokeStyle = isMe ? '#fde047' : teamColor;
    ctx.lineWidth = isMe ? 3.2 : 2.2;
    ctx.beginPath();
    ctx.ellipse(x, y + 18, 26 * shScale, 9 * shScale, 0, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Draw 25-frame 3D-shaded Monster Spritesheet frame (or fallback raster)
    ctx.translate(x, drawY);
    if (flipX) ctx.scale(-1, 1);
    ctx.scale(squashX, squashY);

    if (sheet && sheet.width >= 1000) {
      var fSize = Math.round(sheet.width / 7);
      var col = frameIdx % 7;
      var row = Math.floor(frameIdx / 7);
      var size = 88;
      ctx.drawImage(sheet, col * fSize, row * fSize, fSize, fSize, -size / 2, -size + 22, size, size);
    } else {
      var pImg = getSportImg(fallbackPic || 'c_bolt_happy');
      if (pImg && pImg.complete && pImg.naturalWidth > 0) {
        ctx.drawImage(pImg, -30, -38, 60, 60);
      }
    }
    ctx.restore();
  }

  function startSportsMatch(sp, md, ctrlMode) {
    var canvas = document.getElementById('wg-sports-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var Wc = canvas.width, Hc = canvas.height;
    var keys = {};

    var st = {
      sport: sp,
      mode: md,
      ctrl: ctrlMode || '1p',
      scoreA: 0,
      scoreB: 0,
      targetScore: sp === 'soccer' ? 3 : 5,
      finished: false,
      waitingKickoff: true,
      goalCooldown: 0,
      netRippleA: 0,
      netRippleB: 0,
      tick: 0,
      bannerText: sp === 'soccer' ? '⚡ TAP FIELD OR PRESS ARROW / WASD TO KICK OFF!' : '⚡ TAP COURT OR PRESS SPACE / ARROW TO SERVE!',
      bannerTimer: 120,
      targetPos: null,
      pad: { left: false, right: false, up: false, down: false },
      actionPressed: false,
      actionKind: 'power',
      particles: [],
      ballTrail: [],
      players: [],
      ball: { x: Wc / 2, y: Hc / 2 + 15, z: 0, vx: 0, vy: 0, vz: 0, r: 15, spin: 0 }
    };

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

    var resetPositions = function (servingSide) {
      st.waitingKickoff = true;
      st.targetPos = null;
      st.ballTrail = [];
      if (sp === 'soccer') {
        var midY = Hc / 2 + 18;
        st.players = [
          { id: 'me',   sheet: 'me', pic: 'c_bolt_happy',  team: 'A', role: 'fwd', name: 'YOU',   color: '#38bdf8', x: 255, y: midY, z: 0, vx: 0, vy: 0, vz: 0, r: 24, flipX: false, dashTimer: 0, cheerTimer: 0 },
          { id: 'opp1', sheet: 'c1', pic: 'c_ember_happy', team: 'B', role: 'fwd', name: st.ctrl === '2p' ? 'P2' : 'Leo', color: '#f43f5e', x: Wc - 255, y: midY, z: 0, vx: 0, vy: 0, vz: 0, r: 24, flipX: true, dashTimer: 0, cheerTimer: 0 }
        ];
        if (md === '2v2') {
          st.players.push(
            { id: 'ally', sheet: 'c0', pic: 'c_lulu_happy',  team: 'A', role: 'gk', name: 'Sky',   color: '#38bdf8', x: 112, y: midY, z: 0, vx: 0, vy: 0, vz: 0, r: 22, flipX: false, dashTimer: 0, cheerTimer: 0 },
            { id: 'opp2', sheet: 'c2', pic: 'c_nutty_happy', team: 'B', role: 'gk', name: 'Sunny', color: '#f43f5e', x: Wc - 112, y: midY, z: 0, vx: 0, vy: 0, vz: 0, r: 22, flipX: true, dashTimer: 0, cheerTimer: 0 }
          );
        }
        st.ball.x = Wc / 2;
        st.ball.y = midY;
        st.ball.z = 0;
        st.ball.vx = 0;
        st.ball.vy = 0;
        st.ball.vz = 0;
      } else {
        // 2.5D Beach Volleyball Court (players move in x and depth y: 265..385, jump in z)
        var baseY = 330;
        st.players = [
          { id: 'me',   sheet: 'me', pic: 'c_bolt_happy',  team: 'A', name: 'YOU',   color: '#38bdf8', x: 270, y: baseY, z: 0, vx: 0, vy: 0, vz: 0, r: 25, flipX: false, dashTimer: 0, cheerTimer: 0 },
          { id: 'opp1', sheet: 'c1', pic: 'c_ember_happy', team: 'B', name: st.ctrl === '2p' ? 'P2' : 'Leo', color: '#f43f5e', x: Wc - 270, y: baseY, z: 0, vx: 0, vy: 0, vz: 0, r: 25, flipX: true, dashTimer: 0, cheerTimer: 0 }
        ];
        if (md === '2v2') {
          st.players.push(
            { id: 'ally', sheet: 'c0', pic: 'c_lulu_happy',  team: 'A', name: 'Sky',   color: '#38bdf8', x: 145, y: baseY + 28, z: 0, vx: 0, vy: 0, vz: 0, r: 23, flipX: false, dashTimer: 0, cheerTimer: 0 },
            { id: 'opp2', sheet: 'c2', pic: 'c_nutty_happy', team: 'B', name: 'Sunny', color: '#f43f5e', x: Wc - 145, y: baseY + 28, z: 0, vx: 0, vy: 0, vz: 0, r: 23, flipX: true, dashTimer: 0, cheerTimer: 0 }
          );
        }
        st.ball.x = servingSide === 'B' ? (Wc - 270) : 270;
        st.ball.y = baseY;
        st.ball.z = 48;
        st.ball.vx = 0;
        st.ball.vy = 0;
        st.ball.vz = 0;
        st.servingSide = servingSide || 'A';
      }
    };

    resetPositions('A');

    st.keyHandler = function (e) {
      keys[e.code] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'].indexOf(e.code) >= 0) {
        if (st.waitingKickoff) {
          st.waitingKickoff = false;
          if (sp === 'volleyball' && st.ball.vx === 0 && st.ball.vz === 0) {
            st.ball.vx = st.servingSide === 'B' ? -4.8 : 4.8;
            st.ball.vy = (Math.random() - 0.5) * 1.2;
            st.ball.vz = 7.8;
            sound('playHop');
          }
        }
      }
      if (e.code === 'Space') {
        st.actionKind = 'power';
        st.actionPressed = true;
      } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyE') {
        if (st.players[0]) { st.players[0].dashTimer = 16; sound('playHop'); }
      }
    };
    st.keyUpHandler = function (e) {
      keys[e.code] = false;
    };
    root.addEventListener('keydown', st.keyHandler);
    root.addEventListener('keyup', st.keyUpHandler);

    var setPointerTarget = function (e, isTap) {
      var rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var px = ((e.clientX - rect.left) / rect.width) * Wc;
      var py = ((e.clientY - rect.top) / rect.height) * Hc;
      if (st.waitingKickoff) {
        st.waitingKickoff = false;
        if (sp === 'volleyball' && st.ball.vx === 0 && st.ball.vz === 0) {
          st.ball.vx = st.servingSide === 'B' ? -4.8 : 4.8;
          st.ball.vy = (Math.random() - 0.5) * 1.2;
          st.ball.vz = 7.8;
          sound('playHop');
        }
      }
      st.targetPos = { x: px, y: py };
      if (isTap) {
        var me = st.players[0];
        if (me && Math.hypot(px - st.ball.x, py - st.ball.y) < 75) {
          st.actionKind = 'power';
          st.actionPressed = true;
        }
      }
    };
    canvas.addEventListener('pointerdown', function (e) { setPointerTarget(e, true); });
    canvas.addEventListener('pointermove', function (e) { if (e.buttons) setPointerTarget(e, false); });

    var onScore = function (team) {
      if (st.finished) return;
      if (team === 'A') {
        st.scoreA++;
        st.netRippleB = 26;
        sound('playFanfare');
        st.bannerText = (sp === 'soccer' ? '⚽ GOAL FOR YOUR TEAM! 🌟' : '🏐 ACE POINT FOR YOUR TEAM! 🌟');
        st.players.forEach(function (p) { if (p.team === 'A') p.cheerTimer = 55; });
        spawnBurst(Wc - 60, Hc / 2, '#fde047', 28);
      } else {
        st.scoreB++;
        st.netRippleA = 26;
        sound('playPop');
        st.bannerText = (sp === 'soccer' ? '⚽ RIVAL GOAL! TAP TO KICK OFF!' : '🏐 RIVAL POINT! TAP TO SERVE!');
        st.players.forEach(function (p) { if (p.team === 'B') p.cheerTimer = 55; });
        spawnBurst(60, Hc / 2, '#f43f5e', 22);
      }
      st.bannerTimer = 75;
      st.goalCooldown = 50;
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
          say('Championship victory! Your team won the match! Plus twenty five coins!');
          st.bannerText = '🏆 CHAMPIONSHIP VICTORY! +25 🪙 COINS!';
          var wEl = document.getElementById('wg-sp-wins');
          if (wEl) wEl.textContent = String(wSt.sportsWins);
        } else {
          sound('playSoftFail');
          say('Close match! Tap Kick Off to play again!');
          st.bannerText = '👏 CLOSE MATCH! TAP KICK OFF TO REMATCH!';
        }
        var stEl = document.getElementById('wg-sp-status');
        if (stEl) stEl.textContent = st.bannerText;
        return;
      }
      resetPositions(team === 'A' ? 'B' : 'A');
    };

    var step = function () {
      if (!document.getElementById('wg-sports-canvas')) { stopSportsLoop(); return; }
      st.tick++;
      var me = st.players[0];
      var b = st.ball;

      // Read Player 1 input (WASD + On-screen D-Pad + Arrows if 1P mode)
      var useArrowsForP1 = (st.ctrl !== '2p');
      var dx = ((keys.KeyD || st.pad.right || (useArrowsForP1 && keys.ArrowRight)) ? 1 : 0) -
               ((keys.KeyA || st.pad.left  || (useArrowsForP1 && keys.ArrowLeft))  ? 1 : 0);
      var dy = ((keys.KeyS || st.pad.down  || (useArrowsForP1 && keys.ArrowDown))  ? 1 : 0) -
               ((keys.KeyW || st.pad.up    || (useArrowsForP1 && keys.ArrowUp))    ? 1 : 0);

      if (dx || dy) {
        st.targetPos = null;
        if (st.waitingKickoff) {
          st.waitingKickoff = false;
          if (sp === 'volleyball' && b.vx === 0 && b.vz === 0) {
            b.vx = st.servingSide === 'B' ? -4.8 : 4.8;
            b.vy = (Math.random() - 0.5) * 1.2;
            b.vz = 7.8;
          }
        }
      } else if (st.targetPos && me) {
        var tdx = st.targetPos.x - me.x;
        var tdy = st.targetPos.y - me.y;
        var tdist = Math.hypot(tdx, tdy);
        if (tdist > 10) {
          dx = tdx / tdist;
          dy = tdy / tdist;
        } else {
          st.targetPos = null;
        }
      }

      if (!st.finished && !st.waitingKickoff) {
        if (st.goalCooldown > 0) st.goalCooldown--;
        if (st.netRippleA > 0) st.netRippleA *= 0.88;
        if (st.netRippleB > 0) st.netRippleB *= 0.88;

        var dashBoost = (me.dashTimer && me.dashTimer > 0) ? 1.55 : 1.0;
        if (me.dashTimer > 0) me.dashTimer--;

        if (sp === 'soccer') {
          var len1 = Math.hypot(dx, dy) || 1;
          if (dx || dy) { dx /= len1; dy /= len1; }
          me.vx = dx * 5.2 * dashBoost;
          me.vy = dy * 5.2 * dashBoost;
          if (Math.abs(me.vx) > 0.2) me.flipX = me.vx < 0;

          // Dust particles when sprinting
          if (Math.hypot(me.vx, me.vy) > 3.5 && st.tick % 4 === 0) {
            st.particles.push({ x: me.x, y: me.y + 16, vx: -me.vx * 0.2, vy: -0.4, r: 4, life: 12, maxLife: 12, color: 'rgba(255,255,255,0.45)' });
          }

          // Teammate & Opponents
          st.players.slice(1).forEach(function (p) {
            if (p.id === 'opp1' && st.ctrl === '2p') {
              // Human Player 2 on Arrow Keys!
              var p2x = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0);
              var p2y = (keys.ArrowDown ? 1 : 0) - (keys.ArrowUp ? 1 : 0);
              var l2 = Math.hypot(p2x, p2y) || 1;
              p.vx = (p2x / l2) * 5.2;
              p.vy = (p2y / l2) * 5.2;
              if (Math.abs(p.vx) > 0.2) p.flipX = p.vx < 0;
              return;
            }
            var tx = b.x, ty = b.y;
            if (p.role === 'gk') {
              tx = p.team === 'A' ? 104 : (Wc - 104);
              ty = Math.max(150, Math.min(Hc - 120, b.y));
            } else if (p.team === 'B') {
              // Fair AI rival: approaches ball to challenge
              tx = b.x + 14;
              ty = b.y;
            }
            var adx = tx - p.x, ady = ty - p.y, alen = Math.hypot(adx, ady) || 1;
            var spd = p.role === 'gk' ? 2.7 : 2.95;
            p.vx = (adx / alen) * Math.min(spd, alen);
            p.vy = (ady / alen) * Math.min(spd, alen);
            if (Math.abs(p.vx) > 0.2) p.flipX = p.vx < 0;
          });

          // Move soccer players & 3D ball collision
          st.players.forEach(function (p) {
            p.x = Math.max(58, Math.min(Wc - 58, p.x + p.vx));
            p.y = Math.max(88, Math.min(Hc - 38, p.y + p.vy));
            if (p.cheerTimer > 0) p.cheerTimer--;

            var bdx = b.x - p.x, bdy = b.y - p.y, dist = Math.hypot(bdx, bdy);
            if (dist < p.r + b.r && b.z < 38 && dist > 0.01) {
              var nx = bdx / dist, ny = bdy / dist;
              b.x = p.x + nx * (p.r + b.r + 3);
              b.y = p.y + ny * (p.r + b.r + 3);

              if (p.id === 'me') {
                if (st.actionPressed) {
                  // Aim toward right goal with blazing 3D arc!
                  var gx = Wc - 42 - p.x, gy = (Hc / 2 + 18) - p.y + (dy * 55), glen = Math.hypot(gx, gy) || 1;
                  var pwr = st.actionKind === 'lob' ? 8.5 : 12.2;
                  b.vx = (gx / glen) * pwr;
                  b.vy = (gy / glen) * pwr;
                  b.vz = st.actionKind === 'lob' ? 7.8 : 4.2;
                  spawnBurst(b.x, b.y, '#38bdf8', 12);
                  sound('playCorrect');
                } else {
                  // Controlled dribble / push forward
                  b.vx = nx * 6.8 + p.vx * 0.55;
                  b.vy = ny * 6.8 + p.vy * 0.55;
                  b.vz = Math.max(b.vz, 1.8);
                  sound('playHop');
                }
              } else if (p.id === 'ally') {
                // Sky passes straight to YOU!
                var pdx = (me.x + 40) - p.x, pdy = me.y - p.y, plen = Math.hypot(pdx, pdy) || 1;
                b.vx = (pdx / plen) * 8.2;
                b.vy = (pdy / plen) * 8.2;
                b.vz = 3.6;
                st.bannerText = '📣 SKY PASSES TO YOU! SHOOT!';
                st.bannerTimer = 40;
                sound('playHop');
              } else {
                // Rival kick toward left goal
                var rgx = 42 - p.x, rgy = (Hc / 2 + 18) - p.y + (Math.random() - 0.5) * 70, rlen = Math.hypot(rgx, rgy) || 1;
                b.vx = (rgx / rlen) * 7.2;
                b.vy = (rgy / rlen) * 7.2;
                b.vz = 2.6;
                sound('playHop');
              }
            }
          });

          // If Player pressed Super Shot / Lob within 68px of ball even without direct overlap
          if (st.actionPressed && me && Math.hypot(b.x - me.x, b.y - me.y) < 68 && b.z < 46) {
            var gx2 = Wc - 42 - me.x, gy2 = (Hc / 2 + 18) - me.y + (dy * 55), glen2 = Math.hypot(gx2, gy2) || 1;
            var pwr2 = st.actionKind === 'lob' ? 8.8 : 12.6;
            b.vx = (gx2 / glen2) * pwr2;
            b.vy = (gy2 / glen2) * pwr2;
            b.vz = st.actionKind === 'lob' ? 8.2 : 4.5;
            spawnBurst(b.x, b.y, '#fde047', 16);
            sound('playCorrect');
          }
          st.actionPressed = false;

          // 3D Ball Physics on Soccer Pitch
          b.x += b.vx;
          b.y += b.vy;
          b.z += b.vz;
          if (b.z > 0 || b.vz !== 0) {
            b.vz -= 0.36; // 3D Gravity
            if (b.z <= 0) {
              b.z = 0;
              if (Math.abs(b.vz) > 1.2) {
                b.vz = -b.vz * 0.58;
                sound('playPop');
              } else {
                b.vz = 0;
              }
            }
          }
          b.vx *= (b.z > 2 ? 0.992 : 0.978);
          b.vy *= (b.z > 2 ? 0.992 : 0.978);
          b.spin += Math.hypot(b.vx, b.vy) * 0.06;

          if (Math.hypot(b.vx, b.vy) > 6.5) {
            st.ballTrail.push({ x: b.x, y: b.y, z: b.z, life: 10 });
          }

          // Goal mouth y: 165..315
          var inGoalY = (b.y > 165 && b.y < 315 && b.z < 55);
          if (b.y < 84 + b.r) { b.y = 84 + b.r; b.vy *= -0.85; }
          if (b.y > Hc - 30 - b.r) { b.y = Hc - 30 - b.r; b.vy *= -0.85; }
          if (b.x < 52 + b.r) {
            if (inGoalY && st.goalCooldown <= 0) onScore('B');
            else { b.x = 52 + b.r; b.vx *= -0.85; }
          }
          if (b.x > Wc - 52 - b.r) {
            if (inGoalY && st.goalCooldown <= 0) onScore('A');
            else { b.x = Wc - 52 - b.r; b.vx *= -0.85; }
          }
        } else {
          // 2.5D Beach Volleyball Physics (x: court width, y: depth 245..390, z: jump height)
          var lenV = Math.hypot(dx, dy) || 1;
          if (dx || dy) { dx /= lenV; dy /= lenV; }
          me.vx = dx * 5.0 * dashBoost;
          me.vy = dy * 3.8 * dashBoost;
          if (Math.abs(me.vx) > 0.2) me.flipX = me.vx < 0;

          if (st.actionPressed && me.z <= 1) {
            me.vz = 9.2; // High Jump for Spike/Block!
            sound('playHop');
          }

          st.players.slice(1).forEach(function (p) {
            if (p.id === 'opp1' && st.ctrl === '2p') {
              var p2x = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0);
              var p2y = (keys.ArrowDown ? 1 : 0) - (keys.ArrowUp ? 1 : 0);
              p.vx = p2x * 5.0;
              p.vy = p2y * 3.8;
              if (keys.Enter && p.z <= 1) p.vz = 9.0;
              return;
            }
            var onMyHalf = (p.team === 'A' && b.x < Wc / 2) || (p.team === 'B' && b.x >= Wc / 2);
            var homeX = p.team === 'A' ? 140 : (p.id === 'opp1' ? Wc - 260 : Wc - 135);
            var homeY = p.id === 'ally' || p.id === 'opp2' ? 355 : 315;
            var targetX = onMyHalf ? (p.team === 'A' ? Math.min(220, b.x) : b.x) : homeX;
            var targetY = onMyHalf ? b.y : homeY;
            p.vx = Math.max(-3.8, Math.min(3.8, (targetX - p.x) * 0.12));
            p.vy = Math.max(-2.8, Math.min(2.8, (targetY - p.y) * 0.12));
            if (onMyHalf && Math.hypot(b.x - p.x, b.y - p.y) < 48 && b.z < 55 && b.vz < 0 && p.z <= 1) {
              p.vz = 8.4;
            }
          });

          st.players.forEach(function (p) {
            p.x += p.vx;
            p.y = Math.max(255, Math.min(390, p.y + p.vy));
            if (p.team === 'A') p.x = Math.max(55, Math.min(Wc / 2 - 34, p.x));
            else p.x = Math.max(Wc / 2 + 34, Math.min(Wc - 55, p.x));

            p.z += p.vz;
            if (p.z > 0 || p.vz !== 0) {
              p.vz -= 0.46;
              if (p.z <= 0) { p.z = 0; p.vz = 0; }
            }

            var bdx = b.x - p.x, bdy = b.y - p.y, bdz = b.z - (p.z + 28);
            var dist3d = Math.hypot(bdx, bdy, bdz * 0.7);
            if (dist3d < p.r + b.r + 6 && b.vz <= 2) {
              b.z = Math.max(b.z, p.z + 36);
              var isSpike = (p.id === 'me' && (p.z > 18 || st.actionPressed) && st.actionKind === 'power');
              if (p.id === 'ally') {
                // Teammate sets the ball high to YOU!
                b.vx = (me.x + 25 - b.x) * 0.045;
                b.vy = (me.y - b.y) * 0.045;
                b.vz = 8.8;
                st.bannerText = '🙌 HIGH SET TO YOU! JUMP & SPIKE!';
                st.bannerTimer = 45;
              } else if (isSpike) {
                b.vx = 7.4;
                b.vy = (dx ? dy * 2.2 : (Math.random() - 0.5) * 2.4);
                b.vz = 5.4;
                spawnBurst(b.x, b.y - b.z, '#fde047', 18);
                st.bannerText = '🔥 MONSTER POWER SPIKE!';
                st.bannerTimer = 40;
              } else {
                b.vx = (p.team === 'A' ? 5.0 : -5.0) + (bdx * 0.05);
                b.vy = Math.max(-2.2, Math.min(2.2, bdy * 0.08));
                b.vz = 8.4;
              }
              sound('playPop');
            }
          });
          st.actionPressed = false;

          b.x += b.vx;
          b.y += b.vy;
          b.z += b.vz;
          b.vz -= 0.22; // Volleyball float gravity
          b.spin += b.vx * 0.05;

          if (b.x < 45 + b.r) { b.x = 45 + b.r; b.vx *= -0.85; }
          if (b.x > Wc - 45 - b.r) { b.x = Wc - 45 - b.r; b.vx *= -0.85; }
          if (b.y < 250) { b.y = 250; b.vy *= -0.85; }
          if (b.y > 392) { b.y = 392; b.vy *= -0.85; }

          // 3D Net collision at x = Wc/2 (net height = 56 in z)
          if (Math.abs(b.x - Wc / 2) < b.r + 6 && b.z < 56) {
            if (b.z > 42) {
              b.z = 57;
              b.vz = Math.abs(b.vz) * 0.75 + 2;
            } else {
              b.vx *= -0.8;
              b.x = b.x < Wc / 2 ? (Wc / 2 - b.r - 7) : (Wc / 2 + b.r + 7);
            }
          }

          // Ball hits the sand (z <= 0) -> Point!
          if (b.z <= 0 && st.goalCooldown <= 0) {
            b.z = 0;
            spawnBurst(b.x, b.y, '#fde047', 16);
            onScore(b.x < Wc / 2 ? 'B' : 'A');
          }
        }
      }

      // ======================================================================
      // RENDER 2.5D STADIUM FRAME
      // ======================================================================
      ctx.clearRect(0, 0, Wc, Hc);

      if (sp === 'soccer') {
        // 1. 3D Stadium Crowd Stands & Night Sky Header (y: 0..76)
        var standG = ctx.createLinearGradient(0, 0, 0, 78);
        standG.addColorStop(0, '#090d16');
        standG.addColorStop(1, '#1e293b');
        ctx.fillStyle = standG;
        ctx.fillRect(0, 0, Wc, 78);

        // Stadium crowd rows & animated cheering fans
        ctx.fillStyle = '#334155';
        ctx.fillRect(0, 56, Wc, 22);
        for (var cf = 0; cf < 26; cf++) {
          var fx = 24 + cf * 31;
          var fy = 38 + (cf % 2) * 10 - Math.abs(Math.sin(st.tick * 0.08 + cf)) * (st.bannerTimer > 0 ? 7 : 2);
          ctx.fillStyle = ['#38bdf8', '#fde047', '#f43f5e', '#34d399', '#a855f7'][cf % 5];
          ctx.beginPath();
          ctx.arc(fx, fy, 6.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // 2. 2.5D Perspective Turf Pitch (y: 78..Hc)
        var bgGrass = ctx.createLinearGradient(0, 78, 0, Hc);
        bgGrass.addColorStop(0, '#14532d');
        bgGrass.addColorStop(1, '#166534');
        ctx.fillStyle = bgGrass;
        ctx.fillRect(0, 78, Wc, Hc - 78);

        // Perspective mowed grass stripes
        for (var s = 0; s < 10; s++) {
          if (s % 2 === 0) {
            ctx.fillStyle = 'rgba(34, 197, 94, 0.16)';
            var topX1 = 70 + s * ((Wc - 140) / 10);
            var topX2 = 70 + (s + 1) * ((Wc - 140) / 10);
            var botX1 = 28 + s * ((Wc - 56) / 10);
            var botX2 = 28 + (s + 1) * ((Wc - 56) / 10);
            ctx.beginPath();
            ctx.moveTo(topX1, 84);
            ctx.lineTo(topX2, 84);
            ctx.lineTo(botX2, Hc - 22);
            ctx.lineTo(botX1, Hc - 22);
            ctx.closePath();
            ctx.fill();
          }
        }

        // Perspective pitch boundary trapezoid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.88)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(68, 84);
        ctx.lineTo(Wc - 68, 84);
        ctx.lineTo(Wc - 34, Hc - 24);
        ctx.lineTo(34, Hc - 24);
        ctx.closePath();
        ctx.stroke();

        // Halfway line & perspective center ellipse
        ctx.beginPath();
        ctx.moveTo(Wc / 2, 84);
        ctx.lineTo(Wc / 2, Hc - 24);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(Wc / 2, Hc / 2 + 18, 62, 44, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Penalty boxes
        ctx.strokeRect(48, 138, 86, 200);
        ctx.strokeRect(Wc - 134, 138, 86, 200);

        // 3. 3D Goal Cages with Dynamic Net Ripple (y: 165..315)
        var rA = Math.sin(st.tick * 0.5) * st.netRippleA;
        var rB = Math.sin(st.tick * 0.5) * st.netRippleB;

        // Left Goal (Your Team A Goal)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
        ctx.beginPath();
        ctx.moveTo(52, 165); ctx.lineTo(14 - rA * 0.4, 152); ctx.lineTo(14 - rA * 0.4, 302); ctx.lineTo(52, 315);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3.5; ctx.stroke();

        // Right Goal (Rival Team B Goal)
        ctx.fillStyle = 'rgba(244, 63, 94, 0.22)';
        ctx.beginPath();
        ctx.moveTo(Wc - 52, 165); ctx.lineTo(Wc - 14 + rB * 0.4, 152); ctx.lineTo(Wc - 14 + rB * 0.4, 302); ctx.lineTo(Wc - 52, 315);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 3.5; ctx.stroke();
      } else {
        // 2.5D Sunny Tropical Beach Volleyball Court
        var skyG = ctx.createLinearGradient(0, 0, 0, 195);
        skyG.addColorStop(0, '#0284c7');
        skyG.addColorStop(1, '#7dd3fc');
        ctx.fillStyle = skyG;
        ctx.fillRect(0, 0, Wc, 195);

        // Animated rolling ocean waves
        ctx.fillStyle = '#0ea5e9';
        ctx.fillRect(0, 175, Wc, 45);
        ctx.strokeStyle = 'rgba(255,255,255,0.65)';
        ctx.lineWidth = 2.5;
        var waveOff = Math.sin(st.tick * 0.05) * 8;
        ctx.beginPath();
        ctx.moveTo(0, 212 + waveOff * 0.3);
        ctx.lineTo(Wc, 212 - waveOff * 0.3);
        ctx.stroke();

        // Golden Beach Sand
        var sandG = ctx.createLinearGradient(0, 218, 0, Hc);
        sandG.addColorStop(0, '#fde68a');
        sandG.addColorStop(1, '#f59e0b');
        ctx.fillStyle = sandG;
        ctx.fillRect(0, 218, Wc, Hc - 218);

        // 2.5D Perspective Sand Court Lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(85, 245);
        ctx.lineTo(Wc - 85, 245);
        ctx.lineTo(Wc - 42, 398);
        ctx.lineTo(42, 398);
        ctx.closePath();
        ctx.stroke();

        // Pulsing Ball Landing Shadow Target on Sand
        ctx.strokeStyle = b.x < Wc / 2 ? '#38bdf8' : '#fde047';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(b.x, b.y, 18 + Math.sin(st.tick * 0.2) * 3, 7, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Target click ring for Player 1
      if (st.targetPos) {
        ctx.save();
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(st.targetPos.x, st.targetPos.y, 18, 8, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Draw 3D Ball Shadow on the ground at (b.x, b.y)
      ctx.save();
      var bShScale = Math.max(0.35, 1 - b.z / 180);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.34)';
      ctx.beginPath();
      ctx.ellipse(b.x, b.y + 10, b.r * 0.95 * bShScale, 5.5 * bShScale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Depth-sort Players & Net & Ball by y coordinate for true 2.5D overlap!
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
          p.color,
          p.id === 'me'
        );

        // Clean Transparent Nameplate (NO black rectangle box!)
        ctx.save();
        ctx.font = '800 13px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        var labelY = p.y - (p.z || 0) - 62;
        var labelTxt = p.id === 'me' ? '▼ YOU' : p.name;
        ctx.strokeStyle = '#060911';
        ctx.lineWidth = 4.5;
        ctx.strokeText(labelTxt, p.x, labelY);
        ctx.fillStyle = p.id === 'me' ? '#fde047' : (p.team === 'A' ? '#7dd3fc' : '#fda4af');
        ctx.fillText(labelTxt, p.x, labelY);
        ctx.restore();
      });

      // Draw 3D Volleyball Net in the middle of the court
      if (sp === 'volleyball') {
        ctx.save();
        // Net posts in perspective
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(Wc / 2 - 4, 192, 8, 208);
        // Net mesh band
        ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
        ctx.fillRect(Wc / 2 - 3, 200, 6, 155);
        // Top white net tape
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(Wc / 2 - 5, 195, 10, 12);
        ctx.restore();
      }

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

      // Draw 3D Ball at (b.x, b.y - b.z) scaled by height z
      ctx.save();
      var bScale = 1 + (b.z || 0) / 220;
      var drawR = (b.r + 2) * bScale;
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

      // Kickoff / Banner Overlay (Clean translucent text banner)
      if (st.waitingKickoff || st.bannerTimer > 0 || st.finished) {
        if (st.bannerTimer > 0 && !st.waitingKickoff) st.bannerTimer--;
        ctx.save();
        var msg = st.waitingKickoff
          ? (sp === 'soccer' ? '⚡ READY! TAP FIELD, D-PAD, OR PRESS WASD / ARROWS TO KICK OFF!' : '⚡ READY! TAP COURT OR PRESS SPACE / ARROWS TO SERVE!')
          : st.bannerText;
        ctx.font = '800 17px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = '#060911';
        ctx.lineWidth = 5;
        ctx.strokeText(msg, Wc / 2, 32);
        ctx.fillStyle = '#fde047';
        ctx.fillText(msg, Wc / 2, 32);
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
