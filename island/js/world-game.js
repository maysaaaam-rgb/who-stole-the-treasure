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
    var pr = getPlayerRating();
    if (coinEl) coinEl.textContent = '🪙 ' + coins + ' · ⭐' + pr.ratingFixed;
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


  /* ---------- Connected Island Restoration Story & Player Pro Rating System ---------- */
  var STORY_CHAPTERS = [
    { ch: 1, title: 'Chapter 1: Awakening Sunny Meadow', desc: 'Help Grandpa Bolt repair the Meadow Machine, gather wood & flowers, and build your first home furniture!', zone: 1 },
    { ch: 2, title: 'Chapter 2: The Lighthouse Beam', desc: 'Travel to Lighthouse Beach with Lulu, collect sea shells, help Postman Pat & Leo, and relight the Lighthouse!', zone: 2 },
    { ch: 3, title: 'Chapter 3: The Forest Market', desc: 'Cross the river in Treehouse Forest with Mr. Nutty, gather sweet berries for Baker Rosa, and open the Forest Market!', zone: 3 },
    { ch: 4, title: 'Chapter 4: Calming Volcano Peak', desc: 'Climb Volcano Peak with Ember, mine glowing crystals for Nurse Maya, defeat the Crown Rock Giant, and calm the Volcano!', zone: 4 },
    { ch: 5, title: 'Chapter 5: Grand Legend of Practice Island', desc: 'All 4 Island Cores are restored! Upgrade your home to a Fairy-Tale Castle, win Sports Cups, and lead the Class Plaza!', zone: 0 }
  ];

  function getPlayerRating() {
    var s = ses() || {};
    var doc = s.doc || {};
    var st = readState();
    var starsMap = doc.stars || {};
    var totalStars = Object.keys(starsMap).reduce(function (sum, k) { return sum + (Number(starsMap[k]) || 0); }, 0);
    var missionsDone = Object.keys(starsMap).filter(function (k) { return Number(starsMap[k]) > 0; }).length;
    var chestsDone = Object.keys(doc.chests || {}).filter(function (k) { return !!doc.chests[k]; }).length;
    var jobsCount = Object.keys(st.jobsDone || {}).filter(function (k) { return !!st.jobsDone[k]; }).length;
    var bpCount = Object.keys(st.blueprintsDone || {}).filter(function (k) { return !!st.blueprintsDone[k]; }).length;
    var battlesCount = Object.keys(st.battlesWon || {}).filter(function (k) { return !!st.battlesWon[k]; }).length;
    var sportsWins = Number(st.sportsWins) || 0;
    var houseTier = Math.max(1, Math.min(5, Number(st.houseTier) || 1));
    var placedCount = (st.placed && st.placed.length) || 0;
    var landmarksCount = Object.keys(st.landmarksSeen || {}).length;

    // Pro Score calculation (out of 1000+)
    var proScore = (totalStars * 12) + (missionsDone * 15) + (chestsDone * 50) +
                   (jobsCount * 40) + (bpCount * 45) + (battlesCount * 35) +
                   (sportsWins * 30) + ((houseTier - 1) * 60) + (placedCount * 8) + (landmarksCount * 20);

    // 1.0 to 5.0 Star Rating
    var rawRating = 1.2 + Math.min(3.8,
      (Math.min(60, totalStars) / 60) * 1.4 +
      (Math.min(6, jobsCount) / 6) * 0.6 +
      (Math.min(5, bpCount) / 5) * 0.5 +
      (Math.min(6, battlesCount) / 6) * 0.4 +
      ((houseTier - 1) / 4) * 0.5 +
      (Math.min(5, sportsWins) / 5) * 0.4
    );
    var rating = Math.round(rawRating * 10) / 10;

    var rankTitle = '🌱 Island Newcomer';
    if (rating >= 4.6) rankTitle = '👑 Grand Island Legend';
    else if (rating >= 4.0) rankTitle = '🏆 Island Pro Champion';
    else if (rating >= 3.2) rankTitle = '⚒️ Master Builder & Explorer';
    else if (rating >= 2.2) rankTitle = '🧭 Rising Island Adventurer';

    var isOpen = function (z) { return z <= 1 || (W() && W().isOpen && W().isOpen(z)); };
    var chIdx = 0;
    if (doc.chests && doc.chests.z4) chIdx = 4;
    else if (isOpen(4)) chIdx = 3;
    else if (isOpen(3)) chIdx = 2;
    else if (isOpen(2)) chIdx = 1;
    var chapter = STORY_CHAPTERS[chIdx];
    var powerPct = Math.min(100, Math.round(((missionsDone * 3) + (jobsCount * 4) + (bpCount * 4) + (battlesCount * 3) + ((houseTier - 1) * 4)) / 1.1));

    return {
      rating: rating,
      ratingFixed: rating.toFixed(1),
      proScore: proScore,
      rankTitle: rankTitle,
      totalStars: totalStars,
      missionsDone: missionsDone,
      chestsDone: chestsDone,
      jobsCount: jobsCount,
      bpCount: bpCount,
      battlesCount: battlesCount,
      sportsWins: sportsWins,
      houseTier: houseTier,
      placedCount: placedCount,
      landmarksCount: landmarksCount,
      powerPct: powerPct,
      chapter: chapter
    };
  }

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
    var pr = getPlayerRating();
    var pipBannerHtml =
      '<div class="wg-map-story-bar">' +
        '<div class="wg-map-story-left">' +
          '<span class="wg-map-ch-pill">📖 ' + esc(pr.chapter.title) + '</span>' +
          '<span class="wg-map-ch-desc">' + esc(pr.chapter.desc) + '</span>' +
        '</div>' +
        '<div class="wg-map-rating-cluster">' +
          '<span class="wg-map-rate-pill" title="Your Island Pro Rating">⭐ ' + pr.ratingFixed + ' / 5.0 <small>' + esc(pr.rankTitle) + '</small></span>' +
          '<span class="wg-map-score-pill">🏆 ' + pr.proScore + ' pts · 🔋 ' + pr.powerPct + '% Island Power</span>' +
          '<button type="button" class="isl-btn cyan" style="min-height:32px;padding:3px 9px;font-size:0.78rem" onclick="IslandAudio.speak(\'' + esc(tipSpeak) + '\', null, \'pip\')">🦜 Pip Tip</button>' +
        '</div>' +
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
              '<button type="button" class="isl-btn emerald" style="min-height:38px;padding:5px 11px;font-size:0.86rem" onclick="WorldGame.openSportsArena(\'soccer\', \'2v2\')">⚽ Sports Arena</button>' +
              '<button type="button" class="isl-btn amber" style="min-height:38px;padding:5px 11px;font-size:0.86rem" onclick="WorldGame.closeModal(); if(window.IslandRewards) IslandRewards.openStickerBook()">📒 Sticker Book</button>' +
              '<button type="button" class="isl-btn emerald" style="min-height:38px;padding:5px 11px;font-size:0.86rem" onclick="WorldGame.closeModal(); if(window.IslandRewards) IslandRewards.openCorner()">ðŸ–ï¸ Trophy Camp</button>' +
              '<a class="isl-btn cyan" style="min-height:38px;padding:5px 11px;font-size:0.86rem;text-decoration:none;display:inline-flex;align-items:center" href="../index.html">ðŸ« School Hub</a>' +
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
            '<button type="button" class="isl-btn" style="margin-left:auto;min-height:42px;min-width:44px;padding:6px 12px" onclick="WorldGame.closeModal()">✕</button>' +
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
              '<button type="button" class="isl-btn cyan" id="wg-btn-open-sports" style="min-height:38px;padding:4px 10px;font-size:0.82rem" onclick="WorldGame.openSportsArena(\'soccer\', \'2v2\')">⚽ Sports Arena</button>' +
              '<button type="button" class="isl-btn amber" id="wg-btn-enter-room" style="min-height:38px;padding:4px 10px;font-size:0.82rem" onclick="WorldGame.seeHomeInWorld(true)">ðŸšª Walk Inside Room!</button>' +
              '<button type="button" class="isl-btn emerald" id="wg-btn-see-world" style="min-height:38px;padding:4px 10px;font-size:0.82rem" onclick="WorldGame.seeHomeInWorld(false)">ðŸŒ³ Walk in Garden!</button>' +
              '<button type="button" class="isl-btn" style="min-height:38px;min-width:40px;padding:4px 9px" onclick="WorldGame.closeModal()">✕</button>' +
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
              '<button type="button" class="isl-btn amber" style="min-height:42px;padding:6px 12px;font-size:0.9rem" onclick="WorldGame.closeModal(); if(window.IslandRewards) IslandRewards.openStickerBook()">📒 Sticker Book</button>' +
              '<button type="button" class="isl-btn" style="min-height:42px;min-width:44px;padding:6px 12px" onclick="WorldGame.closeModal()">✕</button>' +
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
            '<button type="button" class="isl-btn" style="margin-left:10px;min-height:40px;min-width:42px;padding:4px 10px" onclick="WorldGame.closeModal()">✕</button>' +
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

  /* ---------- 7. 2.5D Island Sports Arena (⚽ Dynamic AI Pro Football & 🏐 4v4 Beach Volleyball) ---------- */
  var sportsRaf = 0;
  var sportsState = null;
  var sportsSport = 'soccer'; // 'soccer' | 'volleyball'
  var sportsMode = '2v2';     // '1v1' | '2v2' | '4v4'
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

  var sportsDiff = 'hard';
  var sportAudioCtx = null;

  function playSportSfx(type) {
    try {
      var st = readState();
      if (st && st.muted) return;
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!sportAudioCtx) sportAudioCtx = new AC();
      if (sportAudioCtx.state === 'suspended') sportAudioCtx.resume();
      var ctx = sportAudioCtx;
      var now = ctx.currentTime;

      if (type === 'kick' || type === 'pass') {
        // Realistic leather football thump (low-pass punch + soft leather transient)
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sine';
        var startF = type === 'pass' ? 165 : 140;
        osc.frequency.setValueAtTime(startF, now);
        osc.frequency.exponentialRampToValueAtTime(42, now + 0.095);
        gain.gain.setValueAtTime(type === 'pass' ? 0.28 : 0.36, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.105);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.11);
      } else if (type === 'power_shot') {
        // Deep cannon strike thud + air whoosh
        var osc1 = ctx.createOscillator();
        var osc2 = ctx.createOscillator();
        var g = ctx.createGain();
        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(175, now);
        osc1.frequency.exponentialRampToValueAtTime(38, now + 0.14);
        osc2.frequency.setValueAtTime(95, now);
        osc2.frequency.exponentialRampToValueAtTime(28, now + 0.14);
        g.gain.setValueAtTime(0.42, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc1.connect(g);
        osc2.connect(g);
        g.connect(ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.155);
        osc2.stop(now + 0.155);
      } else if (type === 'volley_hit') {
        // Realistic hollow volleyball bump/set membrane thump
        var vOsc = ctx.createOscillator();
        var vGain = ctx.createGain();
        vOsc.type = 'sine';
        vOsc.frequency.setValueAtTime(230, now);
        vOsc.frequency.exponentialRampToValueAtTime(92, now + 0.085);
        vGain.gain.setValueAtTime(0.28, now);
        vGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        vOsc.connect(vGain);
        vGain.connect(ctx.destination);
        vOsc.start(now);
        vOsc.stop(now + 0.095);
      } else if (type === 'volley_spike') {
        // Sharp volleyball smash slap + deep resonant boom
        var sOsc = ctx.createOscillator();
        var sOsc2 = ctx.createOscillator();
        var sGain = ctx.createGain();
        sOsc.type = 'triangle';
        sOsc2.type = 'sine';
        sOsc.frequency.setValueAtTime(320, now);
        sOsc.frequency.exponentialRampToValueAtTime(78, now + 0.11);
        sOsc2.frequency.setValueAtTime(150, now);
        sOsc2.frequency.exponentialRampToValueAtTime(48, now + 0.12);
        sGain.gain.setValueAtTime(0.38, now);
        sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.125);
        sOsc.connect(sGain);
        sOsc2.connect(sGain);
        sGain.connect(ctx.destination);
        sOsc.start(now);
        sOsc2.start(now);
        sOsc.stop(now + 0.13);
        sOsc2.stop(now + 0.13);
      } else if (type === 'bounce') {
        var bOsc = ctx.createOscillator();
        var bGain = ctx.createGain();
        bOsc.type = 'sine';
        bOsc.frequency.setValueAtTime(105, now);
        bOsc.frequency.exponentialRampToValueAtTime(46, now + 0.065);
        bGain.gain.setValueAtTime(0.16, now);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        bOsc.connect(bGain);
        bGain.connect(ctx.destination);
        bOsc.start(now);
        bOsc.stop(now + 0.075);
      } else if (type === 'dash') {
        // Subtle athletic footstep/whoosh
        var dOsc = ctx.createOscillator();
        var dGain = ctx.createGain();
        dOsc.type = 'sine';
        dOsc.frequency.setValueAtTime(140, now);
        dOsc.frequency.exponentialRampToValueAtTime(260, now + 0.075);
        dGain.gain.setValueAtTime(0.14, now);
        dGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        dOsc.connect(dGain);
        dGain.connect(ctx.destination);
        dOsc.start(now);
        dOsc.stop(now + 0.085);
      } else if (type === 'whistle') {
        // Authentic referee pea-whistle trill
        var wOsc = ctx.createOscillator();
        var lfo = ctx.createOscillator();
        var lfoGain = ctx.createGain();
        var wGain = ctx.createGain();
        wOsc.type = 'sine';
        wOsc.frequency.setValueAtTime(2780, now);
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(28, now);
        lfoGain.gain.setValueAtTime(110, now);
        lfo.connect(lfoGain);
        lfoGain.connect(wOsc.frequency);
        wGain.gain.setValueAtTime(0.01, now);
        wGain.gain.linearRampToValueAtTime(0.16, now + 0.02);
        wGain.gain.setValueAtTime(0.16, now + 0.18);
        wGain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
        wOsc.connect(wGain);
        wGain.connect(ctx.destination);
        wOsc.start(now);
        lfo.start(now);
        wOsc.stop(now + 0.27);
        lfo.stop(now + 0.27);
      } else if (type === 'goal_cheer') {
        // Warm stadium horn chord (C5-E5-G5-C6) + referee whistle
        playSportSfx('whistle');
        [523.25, 659.25, 783.99, 1046.5].forEach(function (freq, idx) {
          var cOsc = ctx.createOscillator();
          var cGain = ctx.createGain();
          cOsc.type = 'triangle';
          cOsc.frequency.setValueAtTime(freq, now + idx * 0.05);
          cGain.gain.setValueAtTime(0.001, now + idx * 0.05);
          cGain.gain.linearRampToValueAtTime(0.12, now + idx * 0.05 + 0.03);
          cGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.45);
          cOsc.connect(cGain);
          cGain.connect(ctx.destination);
          cOsc.start(now + idx * 0.05);
          cOsc.stop(now + idx * 0.05 + 0.46);
        });
      }
    } catch (e) {}
  }

  function openSportsArena(sport, mode, ctrl, diff) {
    stopSportsLoop();
    if (sport) {
      sportsSport = sport;
      if (sport === 'volleyball' && !mode) sportsMode = '4v4';
      if (sport === 'soccer' && !mode) sportsMode = '2v2';
    }
    if (mode) sportsMode = mode;
    if (ctrl) sportsControl = ctrl;
    if (diff) sportsDiff = diff;
    var st = readState();
    var trophies = Number(st.sportsWins) || 0;
    ['c_bolt_happy', 'c_lulu_happy', 'c_nutty_happy', 'c_ember_happy', 'o_ball'].forEach(getSportImg);

    document.body.classList.add('isl-modal-open');
    modalRoot().innerHTML =
      '<div class="isl-modal-backdrop wg-sp-backdrop-full" id="wg-sports-backdrop">' +
        '<div class="isl-card-modal wg-sports-modal">' +
          '<div class="wg-sp-compact-header">' +
            '<div class="wg-sp-selectors-compact">' +
              '<button type="button" tabindex="-1" class="isl-btn ' + (sportsSport === 'soccer' ? 'emerald' : '') + ' wg-sp-top-btn" onclick="this.blur();WorldGame.openSportsArena(\'soccer\', \'2v2\', \'' + sportsControl + '\')">⚽ Football</button>' +
              '<button type="button" tabindex="-1" class="isl-btn ' + (sportsSport === 'volleyball' ? 'amber' : '') + ' wg-sp-top-btn" onclick="this.blur();WorldGame.openSportsArena(\'volleyball\', \'4v4\', \'' + sportsControl + '\')">🏐 Volleyball</button>' +
              '<span class="wg-sp-sep">|</span>' +
              '<button type="button" tabindex="-1" class="isl-btn ' + (sportsMode === '1v1' ? 'cyan' : '') + ' wg-sp-top-btn" onclick="this.blur();WorldGame.openSportsArena(\'' + sportsSport + '\', \'1v1\', \'' + sportsControl + '\')">1v1</button>' +
              '<button type="button" tabindex="-1" class="isl-btn ' + (sportsMode === '2v2' ? 'cyan' : '') + ' wg-sp-top-btn" onclick="this.blur();WorldGame.openSportsArena(\'' + sportsSport + '\', \'2v2\', \'' + sportsControl + '\')">2v2</button>' +
              '<button type="button" tabindex="-1" class="isl-btn ' + (sportsMode === '4v4' ? 'cyan' : '') + ' wg-sp-top-btn" onclick="this.blur();WorldGame.openSportsArena(\'' + sportsSport + '\', \'4v4\', \'' + sportsControl + '\')">4v4</button>' +
              '<span class="wg-sp-sep">|</span>' +
              '<button type="button" tabindex="-1" class="isl-btn ' + (sportsControl === '1p' && sportsDiff === 'hard' ? 'coral' : '') + ' wg-sp-top-btn" onclick="this.blur();WorldGame.openSportsArena(\'' + sportsSport + '\', \'' + sportsMode + '\', \'1p\', \'hard\')">🔥 Pro AI</button>' +
              '<button type="button" tabindex="-1" class="isl-btn ' + (sportsControl === '1p' && sportsDiff === 'normal' ? 'emerald' : '') + ' wg-sp-top-btn" onclick="this.blur();WorldGame.openSportsArena(\'' + sportsSport + '\', \'' + sportsMode + '\', \'1p\', \'normal\')">⚡ Normal</button>' +
              '<button type="button" tabindex="-1" class="isl-btn ' + (sportsControl === '2p' ? 'amber' : '') + ' wg-sp-top-btn" onclick="this.blur();WorldGame.openSportsArena(\'' + sportsSport + '\', \'' + sportsMode + '\', \'2p\')">👥 2P</button>' +
            '</div>' +
            '<div class="wg-sp-score-pill">' +
              '<span class="wg-sp-side blue">🟦 YOU <b id="wg-sp-score-a">0</b></span>' +
              '<span class="wg-sp-mid-status" id="wg-sp-status">' + (sportsSport === 'soccer' ? '⚽ FIRST TO 3' : '🏐 FIRST TO 5') + '</span>' +
              '<span class="wg-sp-side red"><b id="wg-sp-score-b">0</b> ' + (sportsControl === '2p' ? 'P2' : 'PRO AI') + ' 🟥</span>' +
            '</div>' +
            '<div class="wg-sp-right-compact">' +
              '<span class="wg-st-badge" style="font-size:0.72rem;padding:2px 6px">🏆 <b id="wg-sp-wins">' + trophies + '</b></span>' +
              '<button type="button" tabindex="-1" class="isl-btn wg-sp-top-btn" onclick="this.blur();WorldGame.restartSportsMatch()" title="Restart">🔄</button>' +
              '<button type="button" tabindex="-1" class="isl-btn wg-sp-top-btn" style="background:#ef4444;border-bottom-color:#991b1b" onclick="WorldGame.closeModal()">✕</button>' +
            '</div>' +
          '</div>' +
          '<div class="wg-sports-stage-wrap">' +
            '<canvas id="wg-sports-canvas" width="1360" height="650"></canvas>' +
            '<div class="wg-sports-controls">' +
              '<div class="wg-sp-joy-wrap">' +
                '<div class="wg-sp-joy" id="wg-sp-joy" aria-label="360 Analog Joystick">' +
                  '<div class="wg-sp-joy-ring"></div>' +
                  '<div class="wg-sp-joy-knob" id="wg-sp-knob">🕹️</div>' +
                '</div>' +
                '<div class="wg-sp-joy-hint"><b>Move</b><small>WASD / Arrows / Drag</small></div>' +
              '</div>' +
              '<div class="wg-sp-action-group">' +
                '<button type="button" tabindex="-1" class="isl-btn cyan wg-act-btn" onpointerdown="event.preventDefault();this.blur();WorldGame.sportsAction(\'pass\')" onclick="this.blur();WorldGame.sportsAction(\'pass\')">' + (sportsSport === 'soccer' ? '👟 PASS TO TEAMMATE (E)' : '🙌 SET TO TEAMMATE (E)') + '</button>' +
                '<button type="button" tabindex="-1" class="isl-btn emerald wg-act-btn" onpointerdown="event.preventDefault();this.blur();WorldGame.sportsAction(\'dash\')" onclick="this.blur();WorldGame.sportsAction(\'dash\')">💨 SPEED / FEINT (Shift)</button>' +
                '<button type="button" tabindex="-1" class="isl-btn amber wg-act-btn shoot" onpointerdown="event.preventDefault();this.blur();WorldGame.sportsAction(\'power\')" onclick="this.blur();WorldGame.sportsAction(\'power\')">' + (sportsSport === 'soccer' ? '🔥 POWER SHOOT / TACKLE (Space)' : '🔥 JUMP SPIKE! (Space)') + '</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    startSportsMatch(sportsSport, sportsMode, sportsControl, sportsDiff);
  }

  function restartSportsMatch() {
    openSportsArena(sportsSport, sportsMode, sportsControl, sportsDiff);
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

  var lastSportsActionTime = 0;
  function sportsAction(kind) {
    if (!sportsState) return;
    var now = Date.now();
    if (now - lastSportsActionTime < 65 && sportsState.actionPressed) return;
    lastSportsActionTime = now;
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
    var moving = !isFinished && speed > 0.45;
    var frameIdx = 10;
    if (cheering) {
      frameIdx = 20;
    } else if (moving) {
      var step4 = Math.floor(animTick * 0.26) % 4;
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

    var bounceY = moving ? Math.abs(Math.sin(animTick * 0.38)) * 4.5 : 0;
    var drawY = Math.round(y - z - bounceY);
    var leanAngle = moving ? Math.max(-0.14, Math.min(0.14, vx * 0.018)) : 0;

    ctx.save();
    var shScale = Math.max(0.45, 1 - z / 190);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
    ctx.beginPath();
    ctx.ellipse(Math.round(x), Math.round(y + 15), (isMe ? 20 : 18) * shScale, 6.5 * shScale, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = isMe ? '#fde047' : teamColor;
    ctx.lineWidth = isMe ? 3.2 : 2.0;
    ctx.beginPath();
    ctx.ellipse(Math.round(x), Math.round(y + 15), (isMe ? 22 : 19.5) * shScale, 7.5 * shScale, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.translate(Math.round(x), drawY);
    if (leanAngle) ctx.rotate(leanAngle);
    if (stunned) ctx.globalAlpha = 0.62;
    if (flipX) ctx.scale(-1, 1);

    if (sheet && sheet.width >= 1000) {
      var fSize = Math.round(sheet.width / 7);
      var col = frameIdx % 7;
      var row = Math.floor(frameIdx / 7);
      var size = isMe ? 70 : 64;
      ctx.drawImage(sheet, col * fSize, row * fSize, fSize, fSize, -size / 2, -size + 17, size, size);
    } else {
      var pImg = getSportImg(fallbackPic || 'c_bolt_happy');
      if (pImg && pImg.complete && pImg.naturalWidth > 0) {
        ctx.drawImage(pImg, -25, -32, 50, 50);
      }
    }
    ctx.restore();
  }

  function predictLanding(b, groundZ, Wc, Hc, gVal) {
    var g = gVal || 0.15;
    if (b.z <= groundZ + 2 && Math.abs(b.vz) < 0.5) return { x: b.x, y: b.y, t: 0 };
    var disc = b.vz * b.vz + 2 * g * Math.max(0, b.z - groundZ);
    var t = (b.vz + Math.sqrt(Math.max(0, disc))) / g;
    t = Math.max(0, Math.min(180, t));
    return {
      x: Math.max(42, Math.min((Wc || 1360) - 42, b.x + b.vx * t)),
      y: Math.max(66, Math.min((Hc || 650) - 24, b.y + b.vy * t)),
      t: t
    };
  }

  function startSportsMatch(sp, md, ctrlMode, diffMode) {
    var canvas = document.getElementById('wg-sports-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var Wc = canvas.width, Hc = canvas.height;
    var keys = {};
    var isHard = (diffMode || sportsDiff) !== 'normal';

    var st = {
      sport: sp,
      mode: md,
      ctrl: ctrlMode || '1p',
      diff: isHard ? 'hard' : 'normal',
      scoreA: 0,
      scoreB: 0,
      targetScore: sp === 'soccer' ? 3 : 5,
      finished: false,
      waitingKickoff: false,
      goalCooldown: 0,
      netRippleA: 0,
      netRippleB: 0,
      tick: 0,
      bannerText: sp === 'soccer'
        ? '⚽ GIANT PRO STADIUM! DRIBBLE INTO ATTACKING HALF, PASS (E) & SHOOT (SPACE)!'
        : '🏐 GIANT 4v4 COURT! YOUR AI TEAMMATES DIG & SET — MOVE & PRESS SPACE TO SPIKE!',
      bannerTimer: 90,
      joyX: 0,
      joyY: 0,
      mouseAim: null,
      pointerSteer: null,
      actionPressed: false,
      actionKind: 'power',
      holder: null,
      passTarget: null,
      stealCooldown: 0,
      dribblePhase: 0,
      allyHoldFrames: 0,
      aiHoldFrames: 0,
      lastHitterTeam: null,
      lastHitterId: null,
      teamTouches: 0,
      particles: [],
      ballTrail: [],
      players: [],
      ball: { x: Wc / 2, y: Hc / 2 + 16, z: 0, vx: 0, vy: 0, vz: 0, r: 13.5, spin: 0 }
    };

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
        var maxR = 22;
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
      st.passTarget = null;
      st.stealCooldown = 28;
      st.allyHoldFrames = 0;
      st.aiHoldFrames = 0;
      st.ballTrail = [];
      st.mouseAim = null;
      st.pointerSteer = null;
      st.lastHitterTeam = null;
      st.lastHitterId = null;
      st.teamTouches = 0;
      var midY = 342;

      if (sp === 'soccer') {
        st.players = [
          { id: 'me',     sheet: 'me', pic: 'c_bolt_happy',  team: 'A', role: 'fwd', name: 'YOU',   color: '#38bdf8', x: 520, y: midY, z: 0, vx: 0, vy: 0, vz: 0, dirX: 1, dirY: 0, r: 21, flipX: false, dashTimer: 0, stunTimer: 0, cheerTimer: 0, kickCooldown: 0, aiPhase: 0 },
          { id: 'opp1',   sheet: 'c1', pic: 'c_ember_happy', team: 'B', role: 'fwd', name: st.ctrl === '2p' ? 'P2' : 'Leo', color: '#f43f5e', x: Wc - 500, y: midY, z: 0, vx: 0, vy: 0, vz: 0, dirX: -1, dirY: 0, r: 21, flipX: true, dashTimer: 0, stunTimer: 0, cheerTimer: 0, kickCooldown: 0, aiPhase: 0 },
          { id: 'allyGK', sheet: 'c3', pic: 'c_bolt_happy',  team: 'A', role: 'gk',  name: 'Coco',  color: '#38bdf8', x: 82,  y: midY, z: 0, vx: 0, vy: 0, vz: 0, dirX: 1, dirY: 0, r: 20, flipX: false, dashTimer: 0, stunTimer: 0, cheerTimer: 0, kickCooldown: 0, aiPhase: 0.8 },
          { id: 'oppGK',  sheet: 'c2', pic: 'c_nutty_happy', team: 'B', role: 'gk',  name: 'Sunny', color: '#f43f5e', x: Wc - 82, y: midY, z: 0, vx: 0, vy: 0, vz: 0, dirX: -1, dirY: 0, r: 20, flipX: true, dashTimer: 0, stunTimer: 0, cheerTimer: 0, kickCooldown: 0, aiPhase: 3.0 }
        ];
        if (md === '2v2' || md === '4v4') {
          st.players.push(
            { id: 'ally',  sheet: 'c0', pic: 'c_lulu_happy',  team: 'A', role: 'wing', name: 'Sky',   color: '#38bdf8', x: 390, y: midY - 155, z: 0, vx: 0, vy: 0, vz: 0, dirX: 1, dirY: 0, r: 20, flipX: false, dashTimer: 0, stunTimer: 0, cheerTimer: 0, kickCooldown: 0, aiPhase: 1.5 },
            { id: 'opp3',  sheet: 'c3', pic: 'c_lulu_happy',  team: 'B', role: 'wing', name: 'Ember', color: '#f43f5e', x: Wc - 390, y: midY + 155, z: 0, vx: 0, vy: 0, vz: 0, dirX: -1, dirY: 0, r: 20, flipX: true, dashTimer: 0, stunTimer: 0, cheerTimer: 0, kickCooldown: 0, aiPhase: 1.1 }
          );
        }
        if (md === '4v4') {
          st.players.push(
            { id: 'ally2', sheet: 'c2', pic: 'c_nutty_happy', team: 'A', role: 'wing', name: 'Pip',   color: '#38bdf8', x: 390, y: midY + 155, z: 0, vx: 0, vy: 0, vz: 0, dirX: 1, dirY: 0, r: 20, flipX: false, dashTimer: 0, stunTimer: 0, cheerTimer: 0, kickCooldown: 0, aiPhase: 2.2 },
            { id: 'opp4',  sheet: 'c0', pic: 'c_ember_happy', team: 'B', role: 'wing', name: 'Nutty', color: '#f43f5e', x: Wc - 390, y: midY - 155, z: 0, vx: 0, vy: 0, vz: 0, dirX: -1, dirY: 0, r: 20, flipX: true, dashTimer: 0, stunTimer: 0, cheerTimer: 0, kickCooldown: 0, aiPhase: 4.0 }
          );
        }
        // Place kickoff ball at center spot so both teams contest or you dribble from center!
        if (servingSide === 'B') {
          st.holder = st.players[1];
          st.ball.x = st.players[1].x - 24;
          st.ball.y = midY;
        } else {
          st.holder = st.players[0];
          st.ball.x = st.players[0].x + 24;
          st.ball.y = midY;
        }
        st.ball.z = 0; st.ball.vx = 0; st.ball.vy = 0; st.ball.vz = 0;
        playSportSfx('whistle');
      } else {
        // MASSIVE 1360x650 4v4 VOLLEYBALL COURT POSITIONS
        st.players = [
          { id: 'me',    sheet: 'me', pic: 'c_bolt_happy',  team: 'A', role: 'front', homeX: 480, homeY: 445, name: 'YOU',   color: '#38bdf8', x: 480, y: 445, z: 0, vx: 0, vy: 0, vz: 0, dirX: 1, dirY: 0, r: 22, flipX: false, dashTimer: 0, stunTimer: 0, cheerTimer: 0, hitCooldown: 0, aiPhase: 0 },
          { id: 'ally1', sheet: 'c0', pic: 'c_lulu_happy',  team: 'A', role: 'front', homeX: 480, homeY: 215, name: 'Sky',   color: '#38bdf8', x: 480, y: 215, z: 0, vx: 0, vy: 0, vz: 0, dirX: 1, dirY: 0, r: 21, flipX: false, dashTimer: 0, stunTimer: 0, cheerTimer: 0, hitCooldown: 0, aiPhase: 1.3 },
          { id: 'ally2', sheet: 'c2', pic: 'c_nutty_happy', team: 'A', role: 'back',  homeX: 210, homeY: 215, name: 'Pip',   color: '#38bdf8', x: 210, y: 215, z: 0, vx: 0, vy: 0, vz: 0, dirX: 1, dirY: 0, r: 21, flipX: false, dashTimer: 0, stunTimer: 0, cheerTimer: 0, hitCooldown: 0, aiPhase: 2.5 },
          { id: 'ally3', sheet: 'c3', pic: 'c_bolt_happy',  team: 'A', role: 'back',  homeX: 210, homeY: 460, name: 'Coco',  color: '#38bdf8', x: 210, y: 460, z: 0, vx: 0, vy: 0, vz: 0, dirX: 1, dirY: 0, r: 21, flipX: false, dashTimer: 0, stunTimer: 0, cheerTimer: 0, hitCooldown: 0, aiPhase: 3.8 },

          { id: 'opp1',  sheet: 'c1', pic: 'c_ember_happy', team: 'B', role: 'front', homeX: Wc - 480, homeY: 215, name: st.ctrl === '2p' ? 'P2' : 'Leo', color: '#f43f5e', x: Wc - 480, y: 215, z: 0, vx: 0, vy: 0, vz: 0, dirX: -1, dirY: 0, r: 21, flipX: true, dashTimer: 0, stunTimer: 0, cheerTimer: 0, hitCooldown: 0, aiPhase: 0.7 },
          { id: 'opp2',  sheet: 'c2', pic: 'c_nutty_happy', team: 'B', role: 'front', homeX: Wc - 480, homeY: 445, name: 'Sunny', color: '#f43f5e', x: Wc - 480, y: 445, z: 0, vx: 0, vy: 0, vz: 0, dirX: -1, dirY: 0, r: 21, flipX: true, dashTimer: 0, stunTimer: 0, cheerTimer: 0, hitCooldown: 0, aiPhase: 1.9 },
          { id: 'opp3',  sheet: 'c3', pic: 'c_lulu_happy',  team: 'B', role: 'back',  homeX: Wc - 210, homeY: 215, name: 'Ember', color: '#f43f5e', x: Wc - 210, y: 215, z: 0, vx: 0, vy: 0, vz: 0, dirX: -1, dirY: 0, r: 21, flipX: true, dashTimer: 0, stunTimer: 0, cheerTimer: 0, hitCooldown: 0, aiPhase: 3.1 },
          { id: 'opp4',  sheet: 'c0', pic: 'c_ember_happy', team: 'B', role: 'back',  homeX: Wc - 210, homeY: 460, name: 'Nutty', color: '#f43f5e', x: Wc - 210, y: 460, z: 0, vx: 0, vy: 0, vz: 0, dirX: -1, dirY: 0, r: 21, flipX: true, dashTimer: 0, stunTimer: 0, cheerTimer: 0, hitCooldown: 0, aiPhase: 4.3 }
        ];
        if (md === '1v1') {
          st.players = [st.players[0], st.players[4]];
        } else if (md === '2v2') {
          st.players = [st.players[0], st.players[2], st.players[4], st.players[6]];
        }

        playSportSfx('whistle');
        if (servingSide === 'B') {
          st.ball.x = Wc - 240;
          st.ball.y = 330;
          st.ball.z = 95;
          st.ball.vx = -6.2;
          st.ball.vy = (Math.random() - 0.5) * 3.2;
          st.ball.vz = 5.2;
          st.bannerText = '⚠️ RIVAL SERVE INCOMING! MOVE TO THE RING OR LET TEAMMATE DIG!';
          st.bannerTimer = 65;
        } else {
          // Serve tossed slightly ahead & offset so you or your teammate actively play it!
          st.ball.x = 340;
          st.ball.y = 335;
          st.ball.z = 98;
          st.ball.vx = 1.6;
          st.ball.vy = 0.8;
          st.ball.vz = 4.6;
          st.bannerText = '🏐 SERVE TOSS! MOVE TO THE BALL & PRESS SPACE TO SPIKE SERVE!';
          st.bannerTimer = 75;
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
        if ((st.holder === me || Math.hypot(st.ball.x - me.x, st.ball.y - me.y) < 75) && pt.x > Wc - 210) {
          var adx = pt.x - me.x, ady = pt.y - me.y, alen = Math.hypot(adx, ady) || 1;
          me.dirX = adx / alen;
          me.dirY = ady / alen;
          st.actionKind = 'power';
          st.actionPressed = true;
        } else {
          st.pointerSteer = pt;
        }
      } else {
        st.pointerSteer = { x: Math.min(Wc / 2 - 38, pt.x), y: pt.y };
        st.actionKind = 'power';
        st.actionPressed = true;
      }
    });
    canvas.addEventListener('pointermove', function (e) {
      var pt = getCanvasPt(e);
      if (!pt) return;
      st.mouseAim = pt;
      if (e.buttons && !st.finished) {
        st.pointerSteer = (sp === 'volleyball') ? { x: Math.min(Wc / 2 - 38, pt.x), y: pt.y } : pt;
      }
    });

    var kickSoccerBall = function (kicker, vx, vy, vz, burstColor, targetMate, sfxType) {
      st.holder = null;
      st.stealCooldown = 22;
      st.allyHoldFrames = 0;
      st.aiHoldFrames = 0;
      st.passTarget = targetMate || null;
      kicker.kickCooldown = 22;
      var kLen = Math.hypot(vx, vy) || 1;
      var nx = vx / kLen, ny = vy / kLen;
      st.ball.x = kicker.x + nx * 38;
      st.ball.y = kicker.y + ny * 28;
      st.ball.z = Math.max(4, st.ball.z || 0);
      st.ball.vx = vx;
      st.ball.vy = vy;
      st.ball.vz = vz || 3.2;
      spawnBurst(st.ball.x, st.ball.y, burstColor || '#fde047', 16);
      playSportSfx(sfxType || (kLen > 14 ? 'power_shot' : 'pass'));
    };

    var onScore = function (team) {
      if (st.finished) return;
      st.holder = null;
      st.passTarget = null;
      playSportSfx('goal_cheer');
      if (team === 'A') {
        st.scoreA++;
        st.netRippleB = 34;
        st.bannerText = (sp === 'soccer' ? '⚽ GOAL FOR YOUR SQUAD! 🌟' : '🏐 POINT FOR YOUR SQUAD! 🌟');
        st.players.forEach(function (p) { if (p.team === 'A') p.cheerTimer = 45; });
        spawnBurst(Wc - 60, Hc / 2, '#fde047', 32);
      } else {
        st.scoreB++;
        st.netRippleA = 34;
        st.bannerText = (sp === 'soccer' ? '⚽ PRO AI SCORES! YOUR KICKOFF!' : '🏐 AI POINT! WATCH THEIR SPIKES!');
        st.players.forEach(function (p) { if (p.team === 'B') p.cheerTimer = 45; });
        spawnBurst(60, Hc / 2, '#f43f5e', 24);
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
          say('Tough match against Pro A I! Tap Play Again!');
          st.bannerText = '🔥 PRO AI WON THIS MATCH! CLICK OR PRESS SPACE FOR A REMATCH!';
        }
        var stEl = document.getElementById('wg-sp-status');
        if (stEl) stEl.textContent = won ? '🏆 YOU WON!' : '🔥 REMATCH?';
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
          // PRO 1360x650 FOOTBALL ENGINE: DYNAMIC DRIBBLING + FULL TEAM AI
          // ==================================================================
          var GOAL_TOP = 200, GOAL_BOT = 484, MID_Y = 342;

          if (st.actionPressed && st.actionKind === 'dash' && me) {
            st.actionPressed = false;
            me.dashTimer = 24;
            playSportSfx('dash');
            var dashDirX = (Math.hypot(dx, dy) > 0.05) ? (dx / Math.hypot(dx, dy)) : (me.dirX || 1);
            var dashDirY = (Math.hypot(dx, dy) > 0.05) ? (dy / Math.hypot(dx, dy)) : (me.dirY || 0);
            var frontOpp = st.players.find(function (q) {
              return q.team === 'B' && Math.hypot(q.x - me.x, q.y - me.y) < 145 && q.x > me.x - 20;
            });
            if (frontOpp && Math.abs(dashDirY) < 0.35) {
              dashDirY = (me.y > MID_Y) ? -0.58 : 0.58;
              var dNorm = Math.hypot(dashDirX, dashDirY) || 1;
              dashDirX /= dNorm;
              dashDirY /= dNorm;
            }
            me.dirX = dashDirX;
            me.dirY = dashDirY;
            me.vx = dashDirX * 9.8;
            me.vy = dashDirY * 9.8;
            spawnBurst(me.x, me.y + 12, '#34d399', 14);
            if (st.holder === me) {
              st.players.slice(1).forEach(function (opp) {
                if (opp.team === 'B' && Math.hypot(opp.x - me.x, opp.y - me.y) < 135) {
                  opp.stunTimer = 24;
                  opp.vx = -dashDirX * 3.2;
                  opp.vy = -dashDirY * 4.2;
                }
              });
              st.bannerText = '💨 SKILL FEINT & SPEED BURST!';
              st.bannerTimer = 32;
            } else {
              st.bannerText = '💨 TURBO SPRINT!';
              st.bannerTimer = 26;
            }
          }

          var dashBoost = (me.dashTimer && me.dashTimer > 0) ? 1.56 : 1.0;
          if (me.dashTimer > 0) me.dashTimer--;

          var mag = Math.hypot(dx, dy);
          if (mag > 0.05) {
            var nx = dx / Math.max(1, mag), ny = dy / Math.max(1, mag);
            var targetVx = nx * 6.0 * dashBoost;
            var targetVy = ny * 6.0 * dashBoost;
            me.vx = me.vx * 0.40 + targetVx * 0.60;
            me.vy = me.vy * 0.40 + targetVy * 0.60;
            var newDirX = dx / mag, newDirY = dy / mag;
            var cutDot = me.dirX * newDirX + me.dirY * newDirY;
            if (st.holder === me && cutDot < 0.35 && Math.hypot(me.vx, me.vy) > 2.6) {
              st.players.slice(1).forEach(function (opp) {
                if (opp.team === 'B' && Math.hypot(opp.x - me.x, opp.y - me.y) < 125) {
                  opp.vx = me.dirX * 4.8;
                  opp.vy = me.dirY * 4.8;
                  opp.stunTimer = 22;
                  spawnBurst(me.x, me.y + 10, '#34d399', 10);
                  playSportSfx('dash');
                  st.bannerText = '⚡ ANKLE-BREAKER FEINT!';
                  st.bannerTimer = 28;
                }
              });
            }
            me.dirX = newDirX;
            me.dirY = newDirY;
            if (Math.abs(me.vx) > 0.15) me.flipX = me.vx < 0;
          } else if (me.dashTimer > 12) {
            me.vx *= 0.92;
            me.vy *= 0.92;
          } else {
            me.vx *= 0.72;
            me.vy *= 0.72;
            if (Math.hypot(me.vx, me.vy) < 0.2) { me.vx = 0; me.vy = 0; }
          }

          if ((Math.hypot(me.vx, me.vy) > 3.6 || me.dashTimer > 0) && st.tick % 3 === 0) {
            st.particles.push({ x: me.x, y: me.y + 15, vx: -me.vx * 0.2, vy: -0.4, r: me.dashTimer > 0 ? 5.2 : 3.8, life: 14, maxLife: 14, color: me.dashTimer > 0 ? '#34d399' : 'rgba(255,255,255,0.45)' });
          }

          // Handle Player 1 Shoot / Pass / Call-for-Pass / Slide Tackle Action!
          if (st.actionPressed && me) {
            st.actionPressed = false;
            var myDistToBall = Math.hypot(b.x - me.x, b.y - me.y);

            if (st.holder && st.holder.team === 'A' && st.holder !== me) {
              var holderMate = st.holder;
              if (st.actionKind === 'pass' || holderMate.x < Wc - 380) {
                var leadToMeX = Math.min(Wc - 140, me.x + 45) - holderMate.x;
                var leadToMeY = me.y - holderMate.y;
                var leadLen = Math.hypot(leadToMeX, leadToMeY) || 1;
                kickSoccerBall(holderMate, (leadToMeX / leadLen) * 13.8, (leadToMeY / leadLen) * 13.8, 3.0, '#38bdf8', me, 'pass');
                st.bannerText = '👟 ' + holderMate.name.toUpperCase() + ' PASSES TO YOU!';
                st.bannerTimer = 40;
              } else {
                var mShotX = (Wc - 44) - holderMate.x, mShotY = ((holderMate.y > MID_Y) ? (GOAL_TOP + 34) : (GOAL_BOT - 34)) - holderMate.y, mShotL = Math.hypot(mShotX, mShotY) || 1;
                kickSoccerBall(holderMate, (mShotX / mShotL) * 16.0, (mShotY / mShotL) * 16.0, 3.6, '#fde047', null, 'power_shot');
                st.bannerText = '🔥 ' + holderMate.name.toUpperCase() + ' FIRES A SHOT!';
                st.bannerTimer = 40;
              }
            } else if (st.holder === me || (!st.holder && myDistToBall < 90)) {
              if (st.actionKind === 'pass') {
                var mates = st.players.filter(function (q) { return q.team === 'A' && q.id !== 'me' && q.role !== 'gk'; });
                var mate = mates[0];
                if (mates.length > 1) {
                  mates.sort(function (a, b2) { return Math.abs(a.x - (me.x + 150)) - Math.abs(b2.x - (me.x + 150)); });
                  mate = mates[0];
                }
                if (mate) {
                  var targetMateX = Math.min(Wc - 150, Math.max(mate.x + 30, me.x + 75));
                  var targetMateY = mate.y;
                  var pmx = targetMateX - me.x, pmy = targetMateY - me.y, pml = Math.hypot(pmx, pmy) || 1;
                  kickSoccerBall(me, (pmx / pml) * 14.0, (pmy / pml) * 14.0, 3.2, '#38bdf8', mate, 'pass');
                  st.bannerText = '👟 CRISP PASS TO ' + mate.name.toUpperCase() + '!';
                  st.bannerTimer = 42;
                } else {
                  kickSoccerBall(me, me.dirX * 11.5, me.dirY * 11.5, 6.0, '#38bdf8', null, 'pass');
                  st.bannerText = '👟 CHIP LOB OVER DEFENDER!';
                  st.bannerTimer = 35;
                }
              } else {
                var gkOpp = st.players.find(function (q) { return q.team === 'B' && q.role === 'gk'; });
                var openGY = gkOpp ? ((gkOpp.y > MID_Y) ? (GOAL_TOP + 30) : (GOAL_BOT - 30)) : (MID_Y + dy * 85);
                var gx = (Wc - 42) - me.x;
                var gy = openGY - me.y;
                if (st.mouseAim && st.mouseAim.x > me.x + 60 && st.mouseAim.y > 60 && st.mouseAim.y < Hc - 30) {
                  gx = (Wc - 42) - me.x;
                  gy = Math.max(GOAL_TOP + 20, Math.min(GOAL_BOT - 20, st.mouseAim.y)) - me.y;
                }
                var glen = Math.hypot(gx, gy) || 1;
                var aimX = gx / glen, aimY = gy / glen;
                me.dirX = aimX;
                me.dirY = aimY;
                me.flipX = false;
                // Shots from behind midfield have slightly lower power so you must advance into the attacking half to beat the keeper!
                var shotPower = (me.x > Wc * 0.52) ? 17.2 : 12.6;
                kickSoccerBall(me, aimX * shotPower, aimY * shotPower, 3.6, '#fde047', null, 'power_shot');
                st.bannerText = (me.x > Wc * 0.52) ? '🔥 SUPER POWER SHOT!' : '👟 LONG SHOT! (ADVANCE CLOSER FOR MAX POWER)';
                st.bannerTimer = 40;
              }
            } else {
              var bdx0 = b.x - me.x, bdy0 = b.y - me.y, blen0 = Math.hypot(bdx0, bdy0) || 1;
              me.dirX = bdx0 / blen0;
              me.dirY = bdy0 / blen0;
              me.vx = me.dirX * 9.5;
              me.vy = me.dirY * 9.5;
              me.dashTimer = 15;
              playSportSfx('dash');
              if (blen0 < 62 && st.stealCooldown <= 0) {
                if (st.holder && st.holder.team === 'B') st.holder.stunTimer = 28;
                st.holder = me;
                st.passTarget = null;
                st.stealCooldown = 34;
                spawnBurst(b.x, b.y, '#34d399', 18);
                playSportSfx('kick');
                st.bannerText = '⚡ CLEAN SLIDE TACKLE! YOUR BALL!';
                st.bannerTimer = 40;
              } else {
                st.bannerText = '⚡ LUNGING FOR THE BALL! GET CLOSER TO TACKLE!';
                st.bannerTimer = 25;
              }
            }
          }

          // ==================================================================
          // PRO AI BRAIN FOR BOTH TEAMS (Active Teammate Pressing + Rival Combinations)
          // ==================================================================
          var aiSpeedMult = isHard ? 1.0 : 0.78;
          st.players.slice(1).forEach(function (p) {
            if (p.stunTimer > 0) {
              p.stunTimer--;
              p.vx *= 0.82;
              p.vy *= 0.82;
              if (Math.hypot(p.vx, p.vy) < 0.3) { p.vx = 0; p.vy = 0; }
              return;
            }
            if (p.id === 'opp1' && st.ctrl === '2p') {
              var p2x = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0);
              var p2y = (keys.ArrowDown ? 1 : 0) - (keys.ArrowUp ? 1 : 0);
              var l2 = Math.hypot(p2x, p2y);
              if (l2 > 0.05) {
                p.vx = (p2x / l2) * 5.8;
                p.vy = (p2y / l2) * 5.8;
                p.dirX = p2x / l2;
                p.dirY = p2y / l2;
                p.flipX = p.vx < 0;
              } else { p.vx *= 0.7; p.vy *= 0.7; }
              if (keys.Enter && st.holder === p) {
                var g2x = 44 - p.x, g2y = MID_Y - p.y, g2l = Math.hypot(g2x, g2y) || 1;
                kickSoccerBall(p, (g2x / g2l) * 16.0, (g2y / g2l) * 16.0, 3.6, '#f43f5e', null, 'power_shot');
              }
              return;
            }

            if (p.role === 'gk') {
              var gkX = p.team === 'A' ? 76 : (Wc - 76);
              var targetGKY = Math.max(GOAL_TOP + 28, Math.min(GOAL_BOT - 28, b.y));
              var gkReflex = (p.team === 'B' && isHard) ? 0.12 : 0.09;
              p.vx = (gkX - p.x) * 0.16;
              p.vy = Math.max(-3.5, Math.min(3.5, (targetGKY - p.y) * gkReflex));
              p.flipX = (p.team === 'B');
              if (st.holder === p) {
                if (p.team === 'A') {
                  var toMeX = (me.x + 40) - p.x, toMeY = me.y - p.y, toMeL = Math.hypot(toMeX, toMeY) || 1;
                  kickSoccerBall(p, (toMeX / toMeL) * 12.8, (toMeY / toMeL) * 12.8, 2.6, '#38bdf8', me, 'pass');
                  st.bannerText = '📣 KEEPER COUNTER-PASS TO YOU!';
                  st.bannerTimer = 38;
                } else {
                  var fwdOpp = st.players.find(function (q) { return q.team === 'B' && q.role !== 'gk'; }) || p;
                  var fox = fwdOpp.x - p.x, foy = fwdOpp.y - p.y, fol = Math.hypot(fox, foy) || 1;
                  kickSoccerBall(p, (fox / fol) * 12.8, (foy / fol) * 12.8, 2.8, '#f43f5e', fwdOpp, 'pass');
                  st.bannerText = '🧤 SUNNY SAVES & LAUNCHES COUNTER-ATTACK!';
                  st.bannerTimer = 40;
                }
              }
            } else if (p.team === 'A') {
              // SMART AI TEAMMATE (Sky / Pip):
              // 1) Has the ball -> weaves forward and plays through-ball to YOU (or shoots if right in front of goal!)
              if (st.holder === p) {
                st.allyHoldFrames++;
                var toGoalX = (Wc - 120) - p.x;
                var dodgeY = Math.sin(st.tick * 0.09 + p.aiPhase) * 2.2;
                p.vx = 5.2;
                p.vy = dodgeY;
                p.dirX = 1;
                p.dirY = dodgeY * 0.18;
                p.flipX = false;
                if (p.x > Wc - 240 && Math.abs(p.y - MID_Y) < 120 && st.allyHoldFrames > 18) {
                  var sCornerY = (p.y > MID_Y) ? (GOAL_TOP + 32) : (GOAL_BOT - 32);
                  var sx0 = (Wc - 42) - p.x, sy0 = sCornerY - p.y, sl0 = Math.hypot(sx0, sy0) || 1;
                  kickSoccerBall(p, (sx0 / sl0) * 16.2, (sy0 / sl0) * 16.2, 3.4, '#fde047', null, 'power_shot');
                  st.bannerText = '🔥 ' + p.name.toUpperCase() + ' SHOOTS AT GOAL!';
                  st.bannerTimer = 42;
                } else if (st.allyHoldFrames > 28 || p.x > Wc - 290) {
                  var leadX = Math.min(Wc - 160, Math.max(me.x + 85, p.x + 40));
                  var leadY = me.y;
                  var pmX = leadX - p.x, pmY = leadY - p.y, pmL = Math.hypot(pmX, pmY) || 1;
                  kickSoccerBall(p, (pmX / pmL) * 13.4, (pmY / pmL) * 13.4, 2.6, '#38bdf8', me, 'pass');
                  st.bannerText = '👟 ' + p.name.toUpperCase() + ' THROUGH-BALL TO YOU! SHOOT (SPACE)!';
                  st.bannerTimer = 45;
                }
              } else if (st.passTarget === p && !st.holder) {
                // Sprint to receive pass!
                var rdx = b.x - p.x, rdy = b.y - p.y, rlen = Math.hypot(rdx, rdy) || 1;
                p.vx = (rdx / rlen) * Math.min(6.2, rlen * 0.30);
                p.vy = (rdy / rlen) * Math.min(6.2, rlen * 0.30);
                if (Math.abs(p.vx) > 0.2) p.flipX = p.vx < 0;
              } else if (st.holder && st.holder.team === 'B') {
                // DEFENSIVE AI TEAMMATE: When opponent has the ball, Sky/Pip actively press & help you win it back!
                var oppCarrier = st.holder;
                var defX = (p.id === 'ally') ? (oppCarrier.x - 15) : Math.max(220, oppCarrier.x - 160);
                var defY = (p.id === 'ally') ? oppCarrier.y : MID_Y;
                var ddx = defX - p.x, ddy = defY - p.y, dlen = Math.hypot(ddx, ddy) || 1;
                p.vx = p.vx * 0.75 + ((ddx / dlen) * Math.min(4.8, dlen * 0.20)) * 0.25;
                p.vy = p.vy * 0.75 + ((ddy / dlen) * Math.min(4.8, dlen * 0.20)) * 0.25;
                if (Math.abs(p.vx) > 0.2) p.flipX = p.vx < 0;
              } else if (!st.holder && Math.hypot(b.x - p.x, b.y - p.y) < Math.hypot(b.x - me.x, b.y - me.y) - 30) {
                // Loose ball closer to teammate: teammate sprints to grab it!
                var ldx = b.x - p.x, ldy = b.y - p.y, llen = Math.hypot(ldx, ldy) || 1;
                p.vx = (ldx / llen) * 5.2;
                p.vy = (ldy / llen) * 5.2;
                if (Math.abs(p.vx) > 0.2) p.flipX = p.vx < 0;
              } else {
                // Intelligent overlapping attacking run into open wing space!
                var wingY = (me.y > MID_Y) ? 155 : 520;
                if (p.id === 'ally2') wingY = (me.y > MID_Y) ? 525 : 150;
                var wingX = Math.min(Wc - 220, Math.max(280, me.x + 135 + Math.sin(st.tick * 0.05 + p.aiPhase) * 50));
                p.vx = (wingX - p.x) * 0.11;
                p.vy = (wingY - p.y) * 0.11;
                if (Math.abs(p.vx) > 0.2) p.flipX = p.vx < 0;
              }
            } else if (p.team === 'B') {
              // COMPETITIVE PRO RIVAL AI (Leo / Ember / Nutty):
              if (st.holder === p) {
                st.aiHoldFrames++;
                var rgx = 52 - p.x;
                var weaveOffset = Math.sin(st.tick * 0.09 + p.aiPhase) * 90;
                var distMe = Math.hypot(me.x - p.x, me.y - p.y);
                if (distMe < 220 && me.x < p.x) {
                  var openAIMate = st.players.find(function (q) {
                    return q.team === 'B' && q !== p && q.role !== 'gk' && Math.hypot(q.x - me.x, q.y - me.y) > 125;
                  });
                  if (openAIMate && st.aiHoldFrames > 8 && (isHard || Math.random() < 0.5)) {
                    var apx = Math.max(140, openAIMate.x - 65) - p.x, apy = openAIMate.y - p.y, apl = Math.hypot(apx, apy) || 1;
                    kickSoccerBall(p, (apx / apl) * 14.2, (apy / apl) * 14.2, 2.8, '#f43f5e', openAIMate, 'pass');
                    st.bannerText = '⚠️ AI TACTICAL ONE-TWO PASS!';
                    st.bannerTimer = 38;
                    return;
                  }
                  weaveOffset += (p.y <= me.y ? -165 : 165);
                }
                var rgy = Math.max(95, Math.min(Hc - 45, MID_Y + weaveOffset)) - p.y;
                var rlen = Math.hypot(rgx, rgy) || 1;
                var aiDribSpd = (isHard ? 5.55 : 4.4);
                p.vx = p.vx * 0.68 + (rgx / rlen) * aiDribSpd * 0.32;
                p.vy = p.vy * 0.68 + (rgy / rlen) * aiDribSpd * 0.32;
                p.dirX = p.vx / (Math.hypot(p.vx, p.vy) || 1);
                p.dirY = p.vy / (Math.hypot(p.vx, p.vy) || 1);
                p.flipX = true;
                if ((p.x < 640 && st.aiHoldFrames > 14) || (p.x < 780 && distMe < 115 && st.aiHoldFrames > 10)) {
                  var gkAlly = st.players.find(function (q) { return q.team === 'A' && q.role === 'gk'; });
                  var targetCornerY = (gkAlly && gkAlly.y > MID_Y) ? (GOAL_TOP + 32) : (GOAL_BOT - 32);
                  var shotY = targetCornerY - p.y;
                  var slen = Math.hypot(rgx, shotY) || 1;
                  var aiShotPow = (p.x < 580) ? 16.5 : 14.8;
                  kickSoccerBall(p, (rgx / slen) * aiShotPow, (shotY / slen) * aiShotPow, 3.2, '#f43f5e', null, 'power_shot');
                  st.bannerText = '⚠️ ' + p.name.toUpperCase() + ' BLASTS A PRO CORNER SHOT!';
                  st.bannerTimer = 40;
                }
              } else if (st.passTarget === p && !st.holder) {
                var ardx = b.x - p.x, ardy = b.y - p.y, arlen = Math.hypot(ardx, ardy) || 1;
                p.vx = (ardx / arlen) * 5.4 * aiSpeedMult;
                p.vy = (ardy / arlen) * 5.4 * aiSpeedMult;
                p.flipX = p.vx < 0;
              } else if (st.holder && st.holder.team === 'A') {
                var carrier = st.holder;
                var pressX, pressY, maxDefSpd;
                if (p.id === 'opp1') {
                  pressX = carrier.x + 18;
                  pressY = carrier.y + Math.sin(st.tick * 0.07) * 16;
                  maxDefSpd = 4.85 * aiSpeedMult;
                } else {
                  var markMate = st.players.find(function (q) { return q.team === 'A' && q !== carrier && q.role !== 'gk'; });
                  if (markMate && p.id === 'opp3') {
                    pressX = (markMate.x + carrier.x) * 0.5 + 35;
                    pressY = (markMate.y + MID_Y) * 0.5;
                  } else {
                    pressX = Math.max(Wc - 380, carrier.x + 140);
                    pressY = (p.id === 'opp4') ? 210 : 460;
                  }
                  maxDefSpd = 4.25 * aiSpeedMult;
                }
                var jdx = pressX - p.x, jdy = pressY - p.y, jlen = Math.hypot(jdx, jdy) || 1;
                var tvx = (jdx / jlen) * Math.min(maxDefSpd, jlen * 0.20);
                var tvy = (jdy / jlen) * Math.min(maxDefSpd, jlen * 0.20);
                p.vx = p.vx * 0.76 + tvx * 0.24;
                p.vy = p.vy * 0.76 + tvy * 0.24;
                p.flipX = (carrier.x < p.x);
              } else {
                var targetX = b.x, targetY = b.y;
                if (st.holder && st.holder.team === 'B') {
                  targetX = Math.max(190, st.holder.x - 160);
                  targetY = (st.holder.y > MID_Y) ? 185 : 495;
                }
                var cdx = targetX - p.x, cdy = targetY - p.y, clen = Math.hypot(cdx, cdy) || 1;
                var freeSpd = ((p.id === 'opp1') ? 4.95 : 4.35) * aiSpeedMult;
                p.vx = p.vx * 0.76 + ((cdx / clen) * Math.min(freeSpd, clen)) * 0.24;
                p.vy = p.vy * 0.76 + ((cdy / clen) * Math.min(freeSpd, clen)) * 0.24;
                if (Math.abs(p.vx) > 0.25) p.flipX = p.vx < 0;
              }
            }
          });

          // Move all soccer players & check ball pickup / steals / goalkeeper saves
          st.players.forEach(function (p) {
            p.x = Math.max(46, Math.min(Wc - 46, p.x + p.vx));
            p.y = Math.max(60, Math.min(Hc - 24, p.y + p.vy));
            if (p.cheerTimer > 0) p.cheerTimer--;
            if (p.kickCooldown > 0) p.kickCooldown--;
            if (p.stunTimer > 0) return;
            if (p.kickCooldown > 0) return;

            var distToBall = Math.hypot(b.x - p.x, b.y - p.y);
            var pickupR = (st.passTarget === p) ? (p.r + b.r + 18) : (p.r + b.r + 5);
            if (p.role === 'gk') {
              // Fast corner shots beat the keeper unless hit straight at the keeper's body!
              var ballSpeed = Math.hypot(b.vx, b.vy);
              pickupR = (ballSpeed > 14.2) ? (p.r + b.r - 6) : (p.r + b.r + 5);
            }
            if (distToBall < pickupR && b.z < 46) {
              if (!st.holder) {
                var curBallSpd = Math.hypot(b.vx, b.vy);
                // Outfield players cannot magnet-trap a high-velocity pass or power shot meant for the opposite direction!
                if (p.role !== 'gk' && curBallSpd > 11.8 && st.passTarget !== p) {
                  return;
                }
                st.holder = p;
                st.passTarget = null;
                st.allyHoldFrames = 0;
                st.aiHoldFrames = 0;
                b.vx = 0; b.vy = 0; b.vz = 0; b.z = 0;
                playSportSfx('pass');
              } else if (st.holder !== p && st.holder.team !== p.team && st.stealCooldown <= 0) {
                if (p.team === 'A') {
                  // YOU or YOUR AI TEAMMATE ('Sky'/'Pip') steals the ball from the opponent!
                  st.holder.stunTimer = 36;
                  st.holder = p;
                  st.passTarget = null;
                  st.allyHoldFrames = 0;
                  st.stealCooldown = 34;
                  spawnBurst(b.x, b.y, '#38bdf8', 14);
                  playSportSfx('kick');
                  st.bannerText = (p.id === 'me') ? '⚡ GREAT INTERCEPTION!' : ('⚡ ' + p.name.toUpperCase() + ' WINS THE BALL FOR YOUR TEAM!');
                  st.bannerTimer = 34;
                } else if (p.team === 'B') {
                  if (st.holder === me && me.dashTimer > 6) {
                    p.stunTimer = 26;
                    var awayX = p.x - me.x, awayY = p.y - me.y, awayL = Math.hypot(awayX, awayY) || 1;
                    p.vx = (awayX / awayL) * 4.5;
                    p.vy = (awayY / awayL) * 4.5;
                    spawnBurst(b.x, b.y, '#34d399', 8);
                    playSportSfx('dash');
                  } else if (distToBall < p.r + b.r + 2) {
                    st.holder.stunTimer = 24;
                    st.holder = p;
                    st.passTarget = null;
                    st.aiHoldFrames = 0;
                    st.stealCooldown = 36;
                    spawnBurst(b.x, b.y, '#f43f5e', 12);
                    playSportSfx('kick');
                    st.bannerText = '⚠️ ' + p.name.toUpperCase() + ' STEALS THE BALL! PRESS SPACE TO TACKLE!';
                    st.bannerTimer = 35;
                  }
                }
              }
            }
          });

          // DYNAMIC SOFT-TOUCH BALL DRIBBLING PHYSICS
          if (st.holder) {
            var h = st.holder;
            var hSpd = Math.hypot(h.vx, h.vy);
            if (hSpd > 0.4) st.dribblePhase += 0.24;
            var strideKick = (hSpd > 0.6) ? (22 + Math.sin(st.dribblePhase) * 8 + hSpd * 1.3) : 20;
            var dLen = Math.hypot(h.dirX, h.dirY) || 1;
            var targetBX = h.x + (h.dirX / dLen) * strideKick;
            var targetBY = h.y + (h.dirY / dLen) * (strideKick * 0.72) + 4;
            b.x += (targetBX - b.x) * 0.36;
            b.y += (targetBY - b.y) * 0.36;
            b.z = hSpd > 0.8 ? Math.abs(Math.sin(st.dribblePhase)) * 5.0 : 0;
            b.vx = h.vx;
            b.vy = h.vy;
            b.spin += hSpd * 0.09;
            var inGoalMouth = (b.y > GOAL_TOP && b.y < GOAL_BOT);
            if (inGoalMouth && b.x > Wc - 46 && st.goalCooldown <= 0) onScore('A');
            if (inGoalMouth && b.x < 46 && st.goalCooldown <= 0) onScore('B');
          } else {
            b.x += b.vx;
            b.y += b.vy;
            b.z += b.vz;
            if (b.z > 0 || b.vz !== 0) {
              b.vz -= 0.32;
              if (b.z <= 0) {
                b.z = 0;
                if (Math.abs(b.vz) > 1.2) { b.vz = -b.vz * 0.55; playSportSfx('bounce'); }
                else b.vz = 0;
              }
            }
            b.vx *= (b.z > 2 ? 0.991 : 0.980);
            b.vy *= (b.z > 2 ? 0.991 : 0.980);
            b.spin += Math.hypot(b.vx, b.vy) * 0.06;

            if (Math.hypot(b.vx, b.vy) > 6.5) {
              st.ballTrail.push({ x: b.x, y: b.y, z: b.z, life: 11 });
            }

            var inGoalY = (b.y > GOAL_TOP && b.y < GOAL_BOT && b.z < 72);
            if (b.y < 54 + b.r) { b.y = 54 + b.r; b.vy *= -0.82; playSportSfx('bounce'); }
            if (b.y > Hc - 18 - b.r) { b.y = Hc - 18 - b.r; b.vy *= -0.82; playSportSfx('bounce'); }
            if (b.x < 42 + b.r) {
              if (inGoalY && st.goalCooldown <= 0) onScore('B');
              else { b.x = 42 + b.r; b.vx *= -0.82; playSportSfx('bounce'); }
            }
            if (b.x > Wc - 42 - b.r) {
              if (inGoalY && st.goalCooldown <= 0) onScore('A');
              else { b.x = Wc - 42 - b.r; b.vx *= -0.82; playSportSfx('bounce'); }
            }
          }
        } else {
          // ==================================================================
          // MASSIVE 1360x650 4v4 BEACH VOLLEYBALL ENGINE
          // Active AI Teammates (Dig, Set, Cover & Net Block) + Pro Rival AI!
          // ==================================================================
          var vG = isHard ? 0.15 : 0.12;
          var landing = predictLanding(b, 0, Wc, Hc, vG);
          st.landingSpot = landing;

          if (st.actionPressed && st.actionKind === 'dash' && me) {
            st.actionPressed = false;
            me.dashTimer = 22;
            playSportSfx('dash');
            var vdx = (Math.hypot(dx, dy) > 0.05) ? (dx / Math.hypot(dx, dy)) : ((landing.x < Wc / 2) ? ((landing.x - me.x) / (Math.hypot(landing.x - me.x, landing.y - me.y) || 1)) : 1);
            var vdy = (Math.hypot(dx, dy) > 0.05) ? (dy / Math.hypot(dx, dy)) : ((landing.x < Wc / 2) ? ((landing.y - me.y) / (Math.hypot(landing.x - me.x, landing.y - me.y) || 1)) : 0);
            me.vx = vdx * 9.6;
            me.vy = vdy * 9.6;
            spawnBurst(me.x, me.y + 12, '#34d399', 12);
          }
          var vDash = (me.dashTimer && me.dashTimer > 0) ? 1.56 : 1.0;
          if (me.dashTimer > 0) me.dashTimer--;

          var vMag = Math.hypot(dx, dy);
          if (vMag > 0.05) {
            me.vx = (dx / Math.max(1, vMag)) * 6.4 * vDash;
            me.vy = (dy / Math.max(1, vMag)) * 5.6 * vDash;
            if (Math.abs(me.vx) > 0.15) me.flipX = me.vx < 0;
          } else if (me.dashTimer > 10) {
            me.vx *= 0.90;
            me.vy *= 0.90;
          } else if (landing.x < Wc / 2 && b.vz < 1.2 && Math.hypot(landing.x - me.x, landing.y - me.y) < 88 && Math.hypot(landing.x - me.x, landing.y - me.y) > 8) {
            // Subtle assist only when you are already close to the landing ring
            me.vx = (landing.x - me.x) * 0.14;
            me.vy = (landing.y - me.y) * 0.14;
            me.flipX = false;
          } else {
            me.vx *= 0.68;
            me.vy *= 0.68;
            if (Math.hypot(me.vx, me.vy) < 0.25) { me.vx = 0; me.vy = 0; }
          }

          if (st.actionPressed && me) {
            if (me.z <= 2) {
              me.vz = 9.2;
              playSportSfx('dash');
            }
            if (b.x < Wc / 2 + 25 && Math.hypot(b.x - me.x, b.y - me.y) < 155) {
              me.vx = (b.x - me.x) * 0.22;
              me.vy = (b.y - me.y) * 0.22;
            }
          }

          // ==================================================================
          // SMART VOLLEYBALL AI FOR BOTH YOUR TEAMMATES (TEAM A) & RIVALS (TEAM B)
          // ==================================================================
          // Find closest AI teammate on Team A ('bestAlly') and closest AI player on Team B ('bestOpp')
          var allies = st.players.filter(function (q) { return q.team === 'A' && q.id !== 'me'; });
          var opps   = st.players.filter(function (q) { return q.team === 'B'; });

          var bestAlly = null, bestAllyDist = 99999;
          allies.forEach(function (q) {
            // Prefer player who didn't just hit the ball so teammates alternate touches!
            var penalty = (st.lastHitterId === q.id && st.teamTouches === 1) ? 160 : 0;
            var d = Math.hypot(landing.x - q.x, landing.y - q.y) + penalty;
            if (d < bestAllyDist) { bestAllyDist = d; bestAlly = q; }
          });

          var bestOpp = null, bestOppDist = 99999;
          opps.forEach(function (q) {
            var penalty = (st.lastHitterId === q.id && st.teamTouches === 1) ? 160 : 0;
            var d = Math.hypot(landing.x - q.x, landing.y - q.y) + penalty;
            if (d < bestOppDist) { bestOppDist = d; bestOpp = q; }
          });

          st.players.slice(1).forEach(function (p) {
            if (p.id === 'opp1' && st.ctrl === '2p') {
              var p2x = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0);
              var p2y = (keys.ArrowDown ? 1 : 0) - (keys.ArrowUp ? 1 : 0);
              p.vx = p2x * 6.2;
              p.vy = p2y * 5.4;
              if (keys.Enter && p.z <= 1) p.vz = 9.0;
              return;
            }

            var tx = p.homeX;
            var ty = p.homeY;

            if (p.team === 'A') {
              // YOUR AI TEAMMATES ('Sky', 'Pip', 'Coco') ARE ALWAYS ACTIVE,
              // WHILE LEAVING BALLS IN YOUR ZONE (bottom-front / near YOU) FOR YOU TO CHASE!
              var meDistToLanding = Math.hypot(landing.x - me.x, landing.y - me.y);
              var isMyZoneBall = (st.lastHitterTeam !== 'A' && (landing.y > 355 && landing.x > 250) && meDistToLanding < 290);
              if (landing.x < Wc / 2) {
                if (bestAlly === p && !isMyZoneBall && (meDistToLanding > 48 || st.lastHitterId === 'me')) {
                  // Primary AI Teammate sprints to dig/spike balls in their half of the court!
                  tx = Math.max(52, Math.min(Wc / 2 - 38, landing.x));
                  ty = Math.max(76, Math.min(Hc - 28, landing.y));
                } else {
                  // Support AI Teammates shift dynamically toward the ball & net to be ready for a set or cover!
                  tx = Math.max(60, Math.min(Wc / 2 - 45, p.homeX + (landing.x - 340) * 0.42 + Math.sin(st.tick * 0.05 + p.aiPhase) * 18));
                  ty = Math.max(80, Math.min(Hc - 32, p.homeY + (landing.y - p.homeY) * 0.45 + Math.cos(st.tick * 0.05 + p.aiPhase) * 14));
                }
              } else {
                // Ball is on Opponent's side: Teammates shift into active defensive readiness & front-row blocks at the net!
                tx = p.homeX + Math.sin(st.tick * 0.06 + p.aiPhase) * 22;
                ty = p.homeY + (b.y - 340) * 0.28;
                if (p.role === 'front' && b.x < Wc / 2 + 190 && b.z > 35) {
                  tx = Wc / 2 - 52;
                  ty = Math.max(120, Math.min(Hc - 60, b.y));
                  // Jump to block if opponent spikes near the net!
                  if (b.vx < -3 && b.x < Wc / 2 + 120 && p.z <= 1) {
                    p.vz = 7.8;
                  }
                }
              }
            } else {
              // RIVAL AI TEAM (TEAM B: 'Leo', 'Sunny', 'Ember', 'Nutty')
              if (landing.x >= Wc / 2) {
                if (bestOpp === p) {
                  tx = Math.max(Wc / 2 + 38, Math.min(Wc - 52, landing.x));
                  ty = Math.max(76, Math.min(Hc - 28, landing.y));
                } else {
                  tx = p.homeX + (landing.x - (Wc - 340)) * 0.25 + Math.sin(st.tick * 0.05 + p.aiPhase) * 18;
                  ty = p.homeY + (landing.y - p.homeY) * 0.35;
                }
              } else {
                // Ball on Team A's side: Rival AI shifts formation to track the ball & front-row prepares net block!
                tx = p.homeX + Math.sin(st.tick * 0.06 + p.aiPhase) * 22;
                ty = p.homeY + (b.y - 340) * 0.28;
                if (p.role === 'front' && b.x > Wc / 2 - 190 && b.z > 35) {
                  tx = Wc / 2 + 52;
                  ty = Math.max(120, Math.min(Hc - 60, b.y));
                  if (b.vx > 3 && b.x > Wc / 2 - 120 && p.z <= 1 && isHard) {
                    p.vz = 7.8;
                  }
                }
              }
            }

            var distToTarget = Math.hypot(tx - p.x, ty - p.y);
            var maxAISpd = (p.team === 'A') ? 3.85 : (isHard ? 3.95 : 3.1);
            if (distToTarget < 6) {
              p.vx *= 0.5;
              p.vy *= 0.5;
            } else {
              var desVx = Math.max(-maxAISpd, Math.min(maxAISpd, (tx - p.x) * 0.18));
              var desVy = Math.max(-maxAISpd, Math.min(maxAISpd, (ty - p.y) * 0.18));
              p.vx = p.vx * 0.68 + desVx * 0.32;
              p.vy = p.vy * 0.68 + desVy * 0.32;
            }
            p.flipX = (p.team === 'B');

            // Jump to meet the ball for a high set or spike!
            var isPrimaryReceiver = (p.team === 'A' && bestAlly === p) || (p.team === 'B' && bestOpp === p);
            if (isPrimaryReceiver && Math.hypot(b.x - p.x, b.y - p.y) < 58 && b.z < 68 && b.vz < 0 && p.z <= 1) {
              p.vz = (p.role === 'front' || st.teamTouches >= 1) ? 8.2 : 6.2;
            }
          });

          var launchVolleyBall = function (tx0, ty0, flightT) {
            b.vx = (tx0 - b.x) / flightT;
            b.vy = (ty0 - b.y) / flightT;
            b.vz = vG * (flightT - 1) * 0.5 - b.z / flightT;
          };

          var pickOpenCourtSpot = function (forTeamA) {
            var defs = st.players.filter(function (q) { return q.team === (forTeamA ? 'B' : 'A'); });
            var bestSpot = { x: forTeamA ? (Wc - 180) : 180, y: 95 }, bestMinDist = -1;
            for (var sIdx = 0; sIdx < 10; sIdx++) {
              var candX = forTeamA ? (Wc / 2 + 85 + Math.random() * (Wc / 2 - 140)) : (55 + Math.random() * (Wc / 2 - 140));
              var candY = 78 + Math.random() * (Hc - 108);
              var minD = 99999;
              defs.forEach(function (df) {
                var d0 = Math.hypot(candX - df.x, candY - df.y);
                if (d0 < minD) minD = d0;
              });
              if (minD > bestMinDist) {
                bestMinDist = minD;
                bestSpot = { x: candX, y: candY };
              }
            }
            return bestSpot;
          };

          st.players.forEach(function (p) {
            if (p.hitCooldown > 0) p.hitCooldown--;
            if (p.cheerTimer > 0) p.cheerTimer--;
            p.x += p.vx;
            p.y = Math.max(70, Math.min(Hc - 26, p.y + p.vy));
            if (p.team === 'A') p.x = Math.max(46, Math.min(Wc / 2 - 34, p.x));
            else p.x = Math.max(Wc / 2 + 34, Math.min(Wc - 46, p.x));

            p.z += p.vz;
            if (p.z > 0 || p.vz !== 0) {
              p.vz -= 0.38;
              if (p.z <= 0) { p.z = 0; p.vz = 0; }
            }

            var bdx = b.x - p.x, bdy = b.y - p.y, bdz = b.z - (p.z + 24);
            var dist2d = Math.hypot(bdx, bdy * 0.88);
            var hitRadius = (p.id === 'me') ? (p.r + b.r + 12) : (p.r + b.r + 4);
            if (dist2d < hitRadius && Math.abs(bdz) < 42 && b.z <= p.z + 48 && b.vz <= 0.6 && p.hitCooldown <= 0) {
              // If an AI teammate is right next to 'me' and 'me' is also within hit range on a 2nd-touch set, let 'me' take the spike!
              if (p.team === 'A' && p.id !== 'me' && st.teamTouches === 1 && st.lastHitterId !== 'me' && Math.hypot(b.x - me.x, b.y - me.y) < me.r + b.r + 24 && b.z > 24) {
                return;
              }
              p.hitCooldown = 22;
              b.z = Math.min(72, Math.max(b.z, p.z + 32));

              if (st.lastHitterTeam !== p.team) {
                st.lastHitterTeam = p.team;
                st.teamTouches = 1;
              } else {
                st.teamTouches++;
              }
              st.lastHitterId = p.id;

              if (p.id === 'me') {
                if (st.actionKind === 'pass' && allies.length > 0 && st.teamTouches < 3) {
                  // High set to front-row AI teammate ('Sky') who will jump and spike it!
                  var spikeMate = allies.find(function (q) { return q.role === 'front'; }) || allies[0];
                  launchVolleyBall(Math.min(Wc / 2 - 55, spikeMate.homeX + 20), spikeMate.homeY, 46);
                  spawnBurst(b.x, b.y - b.z, '#38bdf8', 14);
                  playSportSfx('volley_hit');
                  st.bannerText = '🙌 YOU SET TO ' + spikeMate.name.toUpperCase() + ' FOR AN AI SPIKE!';
                  st.bannerTimer = 45;
                } else {
                  var isSpike = (p.z > 5 || st.actionPressed);
                  var openSp = pickOpenCourtSpot(true);
                  var targetRX = openSp.x;
                  var targetRY = openSp.y;
                  if (st.mouseAim && st.mouseAim.x > Wc / 2 + 30) {
                    targetRX = Math.min(Wc - 55, st.mouseAim.x);
                    targetRY = Math.max(78, Math.min(Hc - 30, st.mouseAim.y));
                  } else if (Math.abs(dy) > 0.1) {
                    targetRY = Math.max(78, Math.min(Hc - 30, (Hc / 2) + dy * 250));
                  }
                  launchVolleyBall(targetRX, targetRY, isSpike ? 28 : 48);
                  spawnBurst(b.x, b.y - b.z, isSpike ? '#fde047' : '#38bdf8', isSpike ? 22 : 12);
                  playSportSfx(isSpike ? 'volley_spike' : 'volley_hit');
                  st.bannerText = isSpike ? '🔥 MONSTER POWER SPIKE!' : '🏐 DEEP SEND OVER THE NET!';
                  st.bannerTimer = 45;
                }
              } else if (p.team === 'A') {
                // YOUR AI TEAMMATE ('Sky', 'Pip', 'Coco') HITS THE BALL!
                if (st.teamTouches <= 1 && Math.hypot(me.x - p.x, me.y - p.y) < 360) {
                  // 1st Touch: Teammate digs and sets a golden pass toward YOU (or front row) to spike!
                  var setTargetX = Math.min(Wc / 2 - 65, Math.max(260, me.x + 20));
                  var setTargetY = Math.max(110, Math.min(Hc - 50, me.y));
                  launchVolleyBall(setTargetX, setTargetY, 44);
                  spawnBurst(b.x, b.y - b.z, '#38bdf8', 14);
                  playSportSfx('volley_hit');
                  st.bannerText = '🙌 ' + p.name.toUpperCase() + ' DIGS & SETS TO YOU! PRESS SPACE TO SPIKE!';
                  st.bannerTimer = 55;
                } else {
                  // 2nd/3rd Touch: Teammate jumps and spikes/drives the ball into open corner on Rival's court!
                  var allySpot = pickOpenCourtSpot(true);
                  var isAllySpike = (p.z > 4 || p.role === 'front' || st.teamTouches >= 2);
                  launchVolleyBall(allySpot.x, allySpot.y, isAllySpike ? 30 : 48);
                  spawnBurst(b.x, b.y - b.z, isAllySpike ? '#fde047' : '#38bdf8', isAllySpike ? 18 : 12);
                  playSportSfx(isAllySpike ? 'volley_spike' : 'volley_hit');
                  st.bannerText = isAllySpike ? ('🔥 ' + p.name.toUpperCase() + ' SMASHES A TEAMMATE SPIKE!') : ('🏐 ' + p.name.toUpperCase() + ' SENDS IT OVER!');
                  st.bannerTimer = 42;
                }
              } else {
                // PRO RIVAL AI VOLLEYBALL: 2-Touch Set & Spike!
                var bMates = st.players.filter(function (q) { return q.team === 'B' && q !== p; });
                if (st.teamTouches <= 1 && bMates.length > 0 && isHard && p.role === 'back') {
                  var spiker = bMates.find(function (q) { return q.role === 'front'; }) || bMates[0];
                  launchVolleyBall(spiker.homeX, spiker.homeY, 40);
                  spawnBurst(b.x, b.y - b.z, '#f43f5e', 10);
                  playSportSfx('volley_hit');
                  st.bannerText = '⚠️ AI SETS TO ' + spiker.name.toUpperCase() + ' FOR A POWER SPIKE!';
                  st.bannerTimer = 50;
                } else {
                  var rivalSpot = pickOpenCourtSpot(false);
                  var openX = rivalSpot.x, openY = rivalSpot.y;
                  if (Math.random() < 0.45) {
                    // Target YOUR zone so you must actively move to dig/block!
                    openY = 365 + Math.random() * 225;
                    openX = 270 + Math.random() * 290;
                  }
                  if (!isHard) {
                    openX = 220 + Math.random() * 240;
                    openY = 160 + Math.random() * 300;
                  }
                  var isAISpike = isHard && (p.z > 4 || st.teamTouches >= 2 || p.role === 'front');
                  launchVolleyBall(openX, openY, isAISpike ? 29 : 48);
                  spawnBurst(b.x, b.y - b.z, isAISpike ? '#f43f5e' : '#fda4af', isAISpike ? 20 : 10);
                  playSportSfx(isAISpike ? 'volley_spike' : 'volley_hit');
                  if (isAISpike) {
                    st.bannerText = '🔥 ' + p.name.toUpperCase() + ' SMASHES A PRO SPIKE!';
                    st.bannerTimer = 45;
                  }
                }
              }
            }
          });
          st.actionPressed = false;

          b.x += b.vx;
          b.y += b.vy;
          b.z += b.vz;
          b.vz -= vG;
          b.spin += (b.vx * 0.05);

          if (Math.hypot(b.vx, b.vy) > 4.2 || b.z > 45) {
            st.ballTrail.push({ x: b.x, y: b.y, z: b.z, life: 10 });
          }

          if (b.x < 34) { b.x = 34; b.vx *= -0.85; playSportSfx('bounce'); }
          if (b.x > Wc - 34) { b.x = Wc - 34; b.vx *= -0.85; playSportSfx('bounce'); }
          if (b.y < 66) { b.y = 66; b.vy *= -0.85; playSportSfx('bounce'); }
          if (b.y > Hc - 20) { b.y = Hc - 20; b.vy *= -0.85; playSportSfx('bounce'); }

          if (Math.abs(b.x - Wc / 2) < b.r + 6 && b.z < 54) {
            if (b.z > 30) {
              b.z = 56;
              b.vz = Math.abs(b.vz) * 0.7 + 1.8;
              playSportSfx('bounce');
            } else {
              b.vx *= -0.75;
              b.x = b.x < Wc / 2 ? (Wc / 2 - b.r - 7) : (Wc / 2 + b.r + 7);
              playSportSfx('bounce');
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
      // RENDER MASSIVE FULL-BLEED 1360 x 650 3D-STYLED STADIUM FRAME
      // ======================================================================
      ctx.clearRect(0, 0, Wc, Hc);

      if (sp === 'soccer') {
        var GOAL_TOP2 = 220, GOAL_BOT2 = 464, MID_Y2 = 342;
        var standG = ctx.createLinearGradient(0, 0, 0, 44);
        standG.addColorStop(0, '#060911');
        standG.addColorStop(1, '#1e293b');
        ctx.fillStyle = standG;
        ctx.fillRect(0, 0, Wc, 44);

        // Stadium LED floodlight glow bar
        ctx.fillStyle = '#334155';
        ctx.fillRect(0, 30, Wc, 14);
        for (var cf = 0; cf < 42; cf++) {
          var fx = 18 + cf * 32;
          var fy = 20 + (cf % 2) * 6 - (st.finished ? 0 : Math.abs(Math.sin(st.tick * 0.08 + cf)) * (st.bannerTimer > 0 ? 5 : 1.2));
          ctx.fillStyle = ['#38bdf8', '#fde047', '#f43f5e', '#34d399', '#a855f7'][cf % 5];
          ctx.beginPath();
          ctx.arc(fx, fy, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Rich 3D spotlight grass gradient
        var bgGrass = ctx.createRadialGradient(Wc / 2, MID_Y2, 60, Wc / 2, MID_Y2, Wc * 0.65);
        bgGrass.addColorStop(0, '#16a34a');
        bgGrass.addColorStop(0.6, '#15803d');
        bgGrass.addColorStop(1, '#14532d');
        ctx.fillStyle = bgGrass;
        ctx.fillRect(0, 44, Wc, Hc - 44);

        for (var s = 0; s < 14; s++) {
          if (s % 2 === 0) {
            ctx.fillStyle = 'rgba(74, 222, 128, 0.13)';
            var topX1 = 46 + s * ((Wc - 92) / 14);
            var topX2 = 46 + (s + 1) * ((Wc - 92) / 14);
            var botX1 = 22 + s * ((Wc - 44) / 14);
            var botX2 = 22 + (s + 1) * ((Wc - 44) / 14);
            ctx.beginPath();
            ctx.moveTo(topX1, 50); ctx.lineTo(topX2, 50);
            ctx.lineTo(botX2, Hc - 14); ctx.lineTo(botX1, Hc - 14);
            ctx.closePath(); ctx.fill();
          }
        }

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.90)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(46, 50); ctx.lineTo(Wc - 46, 50);
        ctx.lineTo(Wc - 22, Hc - 14); ctx.lineTo(22, Hc - 14);
        ctx.closePath(); ctx.stroke();

        // Halfway line & center circle + penalty boxes + penalty arcs
        ctx.beginPath();
        ctx.moveTo(Wc / 2, 50); ctx.lineTo(Wc / 2, Hc - 14);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(Wc / 2, MID_Y2, 92, 68, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath();
        ctx.arc(Wc / 2, MID_Y2, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeRect(34, 165, 145, 354);
        ctx.strokeRect(Wc - 179, 165, 145, 354);
        ctx.strokeRect(34, 235, 58, 214);
        ctx.strokeRect(Wc - 92, 235, 58, 214);

        var rA = st.finished ? 0 : Math.sin(st.tick * 0.5) * st.netRippleA;
        var rB = st.finished ? 0 : Math.sin(st.tick * 0.5) * st.netRippleB;

        // 3D Goal Nets with woven mesh lines
        ctx.fillStyle = 'rgba(56, 189, 248, 0.24)';
        ctx.beginPath();
        ctx.moveTo(40, GOAL_TOP2); ctx.lineTo(6 - rA * 0.4, GOAL_TOP2 - 12); ctx.lineTo(6 - rA * 0.4, GOAL_BOT2 - 12); ctx.lineTo(40, GOAL_BOT2);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 4; ctx.stroke();

        ctx.fillStyle = 'rgba(244, 63, 94, 0.28)';
        ctx.beginPath();
        ctx.moveTo(Wc - 40, GOAL_TOP2); ctx.lineTo(Wc - 6 + rB * 0.4, GOAL_TOP2 - 12); ctx.lineTo(Wc - 6 + rB * 0.4, GOAL_BOT2 - 12); ctx.lineTo(Wc - 40, GOAL_BOT2);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 4; ctx.stroke();

        // Highlight open teammate pass ring when YOU have the ball!
        if (!st.finished && st.holder === me && me) {
          var openAlly = st.players.find(function (q) { return q.team === 'A' && q.id !== 'me' && q.role !== 'gk'; });
          if (openAlly) {
            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
            ctx.lineWidth = 2.5;
            ctx.setLineDash([6, 6]);
            ctx.beginPath();
            ctx.moveTo(me.x, me.y + 10);
            ctx.lineTo(openAlly.x, openAlly.y + 10);
            ctx.stroke();
            ctx.restore();
          }

          ctx.save();
          var aX = me.dirX, aY = me.dirY;
          if (st.mouseAim && st.mouseAim.x > me.x + 20) {
            var mdx2 = st.mouseAim.x - me.x, mdy2 = st.mouseAim.y - me.y, ml2 = Math.hypot(mdx2, mdy2) || 1;
            aX = mdx2 / ml2; aY = mdy2 / ml2;
          } else if (aX >= -0.2) {
            var gx3 = (Wc - 42) - me.x, gy3 = (MID_Y2 + dy * 85) - me.y, gl3 = Math.hypot(gx3, gy3) || 1;
            aX = gx3 / gl3; aY = gy3 / gl3;
          }
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.9)';
          ctx.lineWidth = 3.5;
          ctx.setLineDash([8, 6]);
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(b.x + aX * 155, b.y + aY * 155);
          ctx.stroke();
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(b.x + aX * 155, b.y + aY * 155, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      } else {
        // MASSIVE FULL-SCREEN 1360x650 3D-STYLED BEACH VOLLEYBALL ARENA
        var skyG = ctx.createLinearGradient(0, 0, 0, 46);
        skyG.addColorStop(0, '#0284c7');
        skyG.addColorStop(1, '#38bdf8');
        ctx.fillStyle = skyG;
        ctx.fillRect(0, 0, Wc, 46);

        ctx.fillStyle = '#0ea5e9';
        ctx.fillRect(0, 30, Wc, 18);
        ctx.strokeStyle = 'rgba(255,255,255,0.68)';
        ctx.lineWidth = 2;
        var waveOff = st.finished ? 0 : Math.sin(st.tick * 0.05) * 6;
        ctx.beginPath();
        ctx.moveTo(0, 44 + waveOff * 0.3);
        ctx.lineTo(Wc, 44 - waveOff * 0.3);
        ctx.stroke();

        var sandG = ctx.createRadialGradient(Wc / 2, Hc / 2 + 20, 80, Wc / 2, Hc / 2 + 20, Wc * 0.65);
        sandG.addColorStop(0, '#fef08a');
        sandG.addColorStop(0.55, '#fcd34d');
        sandG.addColorStop(1, '#f59e0b');
        ctx.fillStyle = sandG;
        ctx.fillRect(0, 46, Wc, Hc - 46);

        // Subtle inner court shading
        ctx.fillStyle = 'rgba(217, 119, 6, 0.14)';
        ctx.beginPath();
        ctx.moveTo(42, 58); ctx.lineTo(Wc - 42, 58);
        ctx.lineTo(Wc - 20, Hc - 14); ctx.lineTo(20, Hc - 14);
        ctx.closePath(); ctx.fill();

        // Crisp court boundary ribbons
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(42, 58); ctx.lineTo(Wc - 42, 58);
        ctx.lineTo(Wc - 20, Hc - 14); ctx.lineTo(20, Hc - 14);
        ctx.closePath(); ctx.stroke();

        // 3-meter attack lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.48)';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([10, 8]);
        ctx.beginPath();
        ctx.moveTo(Wc / 2 - 220, 58); ctx.lineTo(Wc / 2 - 235, Hc - 14);
        ctx.moveTo(Wc / 2 + 220, 58); ctx.lineTo(Wc / 2 + 235, Hc - 14);
        ctx.stroke();
        ctx.setLineDash([]);

        // Center net ground shadow
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(Wc / 2, 58); ctx.lineTo(Wc / 2, Hc - 14);
        ctx.stroke();

        if (!st.finished && st.landingSpot) {
          var ls = st.landingSpot;
          var pulse = 18 + Math.sin(st.tick * 0.25) * 5;
          ctx.save();
          ctx.strokeStyle = ls.x < Wc / 2 ? '#ef4444' : '#10b981';
          ctx.fillStyle = ls.x < Wc / 2 ? 'rgba(239, 68, 68, 0.24)' : 'rgba(16, 185, 129, 0.22)';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.ellipse(ls.x, ls.y, pulse * 1.4, pulse * 0.72, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(ls.x - 10, ls.y); ctx.lineTo(ls.x + 10, ls.y);
          ctx.moveTo(ls.x, ls.y - 6); ctx.lineTo(ls.x, ls.y + 6);
          ctx.stroke();
          ctx.restore();
        }
      }

      // Ball Ground Shadow
      ctx.save();
      var bShadowScale = Math.max(0.32, 1 - (b.z || 0) / 190);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
      ctx.beginPath();
      ctx.ellipse(b.x, b.y + 10, b.r * 1.15 * bShadowScale, b.r * 0.48 * bShadowScale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

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

        ctx.save();
        ctx.font = (p.id === 'me' ? '900 12.5px ' : '800 11px ') + 'Fredoka, sans-serif';
        ctx.textAlign = 'center';
        var labelY = Math.round(p.y - (p.z || 0) - 50);
        var canSpikeNow = (!st.finished && sp === 'volleyball' && p.id === 'me' && b.x < Wc / 2 + 25 && Math.hypot(b.x - p.x, b.y - p.y) < 115);
        var labelTxt = p.stunTimer > 0
          ? '💫 Stunned!'
          : (p.id === 'me'
              ? (sp === 'soccer'
                  ? (st.holder === p ? '⚽ YOU (E=Pass · Space=Shoot)' : '▼ YOU')
                  : (canSpikeNow ? '🔥 SPACE = SPIKE!' : '▼ YOU'))
              : p.name);
        ctx.strokeStyle = '#060911';
        ctx.lineWidth = 3.8;
        ctx.strokeText(labelTxt, Math.round(p.x), labelY);
        ctx.fillStyle = p.id === 'me' ? '#fde047' : (p.team === 'A' ? '#7dd3fc' : '#fda4af');
        ctx.fillText(labelTxt, Math.round(p.x), labelY);
        ctx.restore();
      });

      if (sp === 'volleyball') {
        ctx.save();
        // Realistic 3D Volleyball Net with posts, top tape & mesh grid
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(Wc / 2 - 5, 44, 10, Hc - 56);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.36)';
        ctx.fillRect(Wc / 2 - 3, 50, 6, Hc - 68);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.lineWidth = 1;
        for (var ny = 58; ny < Hc - 18; ny += 16) {
          ctx.beginPath();
          ctx.moveTo(Wc / 2 - 4, ny);
          ctx.lineTo(Wc / 2 + 4, ny);
          ctx.stroke();
        }
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(Wc / 2 - 6, 42, 12, 10);
        ctx.fillRect(Wc / 2 - 6, Hc - 22, 12, 10);
        ctx.restore();
      }

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
          ctx.fillStyle = 'rgba(6, 9, 17, 0.65)';
          ctx.fillRect(0, Hc / 2 - 48, Wc, 96);
        }
        ctx.font = '800 ' + (st.finished ? '22px' : '16px') + ' Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = '#060911';
        ctx.lineWidth = 4.5;
        ctx.strokeText(st.bannerText, Wc / 2, st.finished ? Hc / 2 : 22);
        ctx.fillStyle = '#fde047';
        ctx.fillText(st.bannerText, Wc / 2, st.finished ? Hc / 2 : 22);
        ctx.restore();
      }

      sportsRaf = requestAnimationFrame(step);
    };

    sportsState = st;
    sportsRaf = requestAnimationFrame(step);
  }

  function wireWorldHud() {
    updateEnergyChip();
    updateJobsBadge();
    updateStatusHud();
  }

  root.WorldGame = {
    HOUSE_TIERS: HOUSE_TIERS,
    RECIPES: RECIPES,
    VILLAGERS: VILLAGERS,
    BATTLES: BATTLES,
    SPELLS: SPELLS,
    readState: readState,
    getPlayerRating: getPlayerRating,
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

