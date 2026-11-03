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
    { id: 'f_bed',       name: 'Cosy Bed',       kind: 'patio',  h: 115, sw: 110, cost: { wood: 2, flower: 1 },            defPos: { x: 1510, y: 590 } },
    { id: 'f_table',     name: 'Round Table',    kind: 'patio',  h: 95,  sw: 85,  cost: { wood: 2 },                       defPos: { x: 1710, y: 690 } },
    { id: 'f_chair',     name: 'Cushion Chair',  kind: 'patio',  h: 95,  sw: 65,  cost: { wood: 1, flower: 1 },            defPos: { x: 1590, y: 700 } },
    { id: 'f_lamp',      name: 'Warm Lamp',      kind: 'patio',  h: 140, sw: 50,  cost: { stone: 1, crystal: 1 },          defPos: { x: 1860, y: 580 } },
    { id: 'f_rug',       name: 'Striped Rug',    kind: 'patio',  h: 85,  sw: 0,   cost: { flower: 2, berry: 1 },           defPos: { x: 1680, y: 765 }, flat: true },
    { id: 'f_plant',     name: 'Potted Plant',   kind: 'patio',  h: 105, sw: 55,  cost: { stone: 1, flower: 2 },           defPos: { x: 1880, y: 790 } },
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
      ownedFurniture: { f_rug: 1, g_flowerbed: 1 },
      placed: [
        { id: 'f_rug', x: 1680, y: 765, flip: false },
        { id: 'g_flowerbed', x: 580, y: 920, flip: false }
      ],
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

  function updateEnergyChip() {
    var el = $('w-energy-val');
    if (el) el.textContent = String(readState().energy);
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
    if (modalRoot()) modalRoot().innerHTML = '';
    document.body.classList.remove('isl-modal-open');
  }

  /* ---------- 2. Floating-Island World Map Modal (m_island_* on t_map_sea) ---------- */
  function openWorldMap() {
    sound('playTap');
    var curZone = (W() && W().S && W().S.zone !== undefined) ? W().S.zone : 1;
    var isOpen = function (z) { return z <= 1 || (W() && W().isOpen && W().isOpen(z)); };
    var islands = [
      { z: 0, name: 'My Home Island',   sub: 'Build · Craft · Garden', img: 'm_island_home',    x: 18, y: 56, open: true },
      { z: 1, name: 'Sunny Meadow',     sub: 'Unit 1 · Grandpa Bolt',  img: 'm_island_meadow',  x: 44, y: 32, open: true },
      { z: 2, name: 'Lighthouse Beach', sub: 'Unit 2 · Lulu',          img: 'm_island_beach',   x: 78, y: 30, open: isOpen(2) },
      { z: 3, name: 'Treehouse Forest', sub: 'Unit 3 · Mr. Nutty',     img: 'm_island_forest',  x: 46, y: 74, open: isOpen(3) },
      { z: 4, name: 'Volcano Peak',     sub: 'Unit 4 · Ember',         img: 'm_island_volcano', x: 80, y: 73, open: isOpen(4) }
    ];
    var nodesHtml = islands.map(function (isl) {
      var here = curZone === isl.z;
      return '<button type="button" class="wg-map-node' + (isl.open ? '' : ' locked') + (here ? ' here' : '') + '" style="left:' + isl.x + '%;top:' + isl.y + '%" onclick="WorldGame.jumpZone(' + isl.z + ')">' +
        '<img src="' + FLAT + isl.img + '.webp" class="wg-map-isl-pic" alt="">' +
        (!isl.open ? '<img src="' + FLAT + 'o_cloud_lock.webp" class="wg-map-lock" alt="">' : '') +
        (here ? '<span class="wg-map-here">📍 You are here</span>' : '') +
        '<span class="wg-map-label"><b>' + esc(isl.name) + '</b><small>' + esc(isl.open ? isl.sub : '🔒 Finish 4 stops in previous zone') + '</small></span>' +
      '</button>';
    }).join('');

    var plazaBtn = '<button type="button" class="wg-map-node" style="left:18%;top:23%" onclick="WorldGame.closeModal(); if(window.IslandWall) IslandWall.open()">' +
      '<img src="' + FLAT + 'm_island_plaza.webp" class="wg-map-isl-pic" alt="">' +
      '<span class="wg-map-label"><b>🌟 Class Plaza</b><small>Friends · Hangout</small></span>' +
    '</button>';

    document.body.classList.add('isl-modal-open');
    modalRoot().innerHTML =
      '<div class="isl-modal-backdrop" id="wg-map-backdrop">' +
        '<div class="isl-card-modal wg-map-modal" style="background-image:url(' + FLAT + 't_map_sea.webp)">' +
          '<div class="isl-mission-top wg-map-top">' +
            '<div style="font-size:1.4rem;font-weight:800;display:flex;align-items:center;gap:8px"><img src="' + FLAT + 'u_map.webp" style="width:36px;height:36px;object-fit:contain" alt=""> Practice Island World Map</div>' +
            '<div style="margin-left:auto;display:flex;gap:8px">' +
              '<button type="button" class="isl-btn cyan" style="min-height:42px;padding:6px 12px;font-size:0.9rem" onclick="WorldGame.goClassicMap()">📋 Classic Map</button>' +
              '<button type="button" class="isl-btn" style="min-height:42px;min-width:44px;padding:6px 12px" onclick="WorldGame.closeModal()">✕</button>' +
            '</div>' +
          '</div>' +
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
    var u = new URLSearchParams(root.location.search);
    u.delete('zone');
    root.location.href = 'index.html?' + u.toString();
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
      var newE = addEnergy(30);
      sound('playFanfare');
      say('Great job! Plus thirty energy!');
      modalRoot().innerHTML =
        '<div class="isl-modal-backdrop" id="wg-energy-backdrop">' +
          '<div class="isl-card-modal" style="max-width:480px;text-align:center">' +
            '<img src="' + FLAT + 'i_energy.webp" style="width:88px;height:88px;object-fit:contain;animation:idleBob 1.2s ease-in-out infinite" alt="">' +
            '<h2 style="margin:6px 0;font-size:1.8rem;color:#fde047">+30 Energy Charged! ⚡</h2>' +
            '<p style="color:#cbd5e1;font-size:1.08rem;margin:0 0 16px">You now have <b style="color:#fde047">⚡ ' + newE + ' Energy</b> to harvest trees, rocks, and explore!</p>' +
            '<button type="button" class="isl-btn emerald" id="wg-energy-done" style="min-width:190px;font-size:1.15rem" onclick="WorldGame.closeModal()">Let\'s Go! 🚀</button>' +
          '</div>' +
        '</div>';
      energyRun = null;
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

  /* ---------- 4. Workshop & My Home Builder (o_workbench, h_*, f_*, g_*) ---------- */
  var workshopTab = 'home';

  function openWorkshop(tab) {
    sound('playTap');
    if (W() && W().closeDecorDock) W().closeDecorDock(true);
    if (tab) workshopTab = tab;
    renderWorkshop();
  }

  function renderWorkshop() {
    var st = readState(), bag = readBag().items || {};
    var curTier = HOUSE_TIERS[Math.max(0, Math.min(HOUSE_TIERS.length - 1, (st.houseTier || 1) - 1))];
    var nextTier = HOUSE_TIERS[st.houseTier || 1] || null;
    var inHome = W() && W().S && W().S.zone === 0;

    var matBar = Object.keys(MAT_ICONS).map(function (k) {
      return '<span class="wg-mat-chip"><img src="' + FLAT + MAT_ICONS[k] + '.webp" alt=""><b>' + (Number(bag[k]) || 0) + '</b><small>' + k + '</small></span>';
    }).join('');

    var bodyHtml = '';
    if (workshopTab === 'home') {
      var canUp = nextTier && hasMaterials(nextTier.cost);
      bodyHtml =
        '<div class="wg-home-upgrade-card">' +
          '<div class="wg-home-pics">' +
            '<div class="wg-home-stage"><img src="' + FLAT + curTier.id + '.webp" alt=""><span>Level ' + curTier.level + ': ' + esc(curTier.name) + '</span></div>' +
            (nextTier ? '<div class="wg-home-arrow">➡</div><div class="wg-home-stage next"><img src="' + FLAT + nextTier.id + '.webp" alt=""><span>Level ' + nextTier.level + ': ' + esc(nextTier.name) + '</span></div>' : '') +
          '</div>' +
          (nextTier
            ? '<div style="margin:12px 0"><div style="font-weight:800;color:#fde68a;margin-bottom:6px">Materials needed to upgrade:</div><div class="wg-cost-row">' + costPillsHtml(nextTier.cost, bag) + '</div></div>' +
              '<button type="button" class="isl-btn ' + (canUp ? 'emerald' : '') + '" id="wg-btn-upgrade-home" ' + (canUp ? 'onclick="WorldGame.upgradeHome()"' : 'disabled aria-disabled="true"') + '>' +
                (canUp ? '🔨 Upgrade Home Now!' : 'Gather more materials in the zones!') +
              '</button>'
            : '<div style="font-size:1.2rem;font-weight:800;color:#6ee7b7;margin-top:10px">🏰 You built the Royal Fairy-Tale Castle!</div>') +
        '</div>';
    } else {
      var cards = RECIPES.map(function (r) {
        var ownedCount = Number((st.ownedFurniture || {})[r.id]) || 0;
        var placedCount = (st.placed || []).filter(function (p) { return p.id === r.id; }).length;
        var canCraft = hasMaterials(r.cost);
        return '<div class="wg-recipe-card">' +
          '<img src="' + FLAT + r.id + '.webp" class="wg-recipe-pic" alt="" onclick="IslandAudio.speak(\'' + esc(r.name) + '\')">' +
          '<div class="wg-recipe-name">' + esc(r.name) + '</div>' +
          '<div class="wg-cost-row">' + costPillsHtml(r.cost, bag) + '</div>' +
          '<div class="wg-recipe-actions">' +
            '<button type="button" class="isl-btn ' + (canCraft ? 'amber' : '') + '" style="min-height:38px;padding:4px 10px;font-size:0.85rem" ' + (canCraft ? 'onclick="WorldGame.craftItem(\'' + r.id + '\')"' : 'disabled') + '>🔨 Craft</button>' +
            (ownedCount > placedCount
              ? '<button type="button" class="isl-btn emerald" style="min-height:38px;padding:4px 10px;font-size:0.85rem" onclick="WorldGame.placeItem(\'' + r.id + '\')">📍 Place (' + (ownedCount - placedCount) + ')</button>'
              : (placedCount > 0 ? '<button type="button" class="isl-btn cyan" style="min-height:38px;padding:4px 10px;font-size:0.85rem" onclick="WorldGame.startMoveMode(\'' + r.id + '\')">✋ Move (' + placedCount + ')</button>' : '')) +
          '</div>' +
        '</div>';
      }).join('');
      bodyHtml = '<div class="wg-recipes-grid">' + cards + '</div>';
    }

    document.body.classList.add('isl-modal-open');
    modalRoot().innerHTML =
      '<div class="isl-modal-backdrop" id="wg-workshop-backdrop">' +
        '<div class="isl-card-modal wg-workshop-modal">' +
          '<div class="isl-mission-top">' +
            '<div style="display:flex;align-items:center;gap:8px;font-size:1.35rem;font-weight:800"><img src="' + FLAT + 'o_workbench.webp" style="width:40px;height:40px;object-fit:contain" alt=""> Island Workshop &amp; Home</div>' +
            '<div style="margin-left:auto;display:flex;gap:8px">' +
              (!inHome
                ? '<button type="button" class="isl-btn emerald" style="min-height:42px;padding:6px 12px;font-size:0.9rem" onclick="WorldGame.jumpZone(0)">🏡 Go to My Home</button>'
                : '<button type="button" class="isl-btn cyan" style="min-height:42px;padding:6px 12px;font-size:0.9rem" onclick="WorldGame.startMoveMode()">🪑 Live Decorate</button>') +
              '<button type="button" class="isl-btn" style="min-height:42px;min-width:44px;padding:6px 12px" onclick="WorldGame.closeModal()">✕</button>' +
            '</div>' +
          '</div>' +
          '<div class="wg-mat-bar">' + matBar + '</div>' +
          '<div style="display:flex;gap:8px;margin-bottom:10px">' +
            '<button type="button" class="isl-btn ' + (workshopTab === 'home' ? 'amber' : '') + '" style="min-height:42px;padding:6px 16px" onclick="WorldGame.openWorkshop(\'home\')">🏰 Upgrade House</button>' +
            '<button type="button" class="isl-btn ' + (workshopTab === 'craft' ? 'amber' : '') + '" style="min-height:42px;padding:6px 16px" onclick="WorldGame.openWorkshop(\'craft\')">🪑 Craft &amp; Decorate (16)</button>' +
          '</div>' +
          bodyHtml +
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
    st.placed.push({ id: id, x: px, y: py, flip: false });
    writeState(st);
    sound('playCorrect');
    say('You crafted a ' + r.name + '!');
    if (W() && W().refreshHome) W().refreshHome(true);
    /* If on Home Island, jump straight into Live Decorator Dock so the pupil can position their new item in the 2D world! */
    if (W() && W().S && W().S.zone === 0 && W().openDecorDock) {
      closeModal();
      W().openDecorDock(id);
    } else {
      renderWorkshop();
    }
  }

  function placeItem(id) {
    var r = RECIPES.filter(function (x) { return x.id === id; })[0];
    if (!r) return;
    var st = readState();
    st.placed = st.placed || [];
    var countSame = st.placed.filter(function (p) { return p.id === id; }).length;
    st.placed.push({ id: id, x: r.defPos.x + countSame * 85, y: r.defPos.y, flip: false });
    writeState(st);
    sound('playTap');
    if (W() && W().refreshHome) W().refreshHome(false);
    if (W() && W().S && W().S.zone === 0 && W().openDecorDock) {
      closeModal();
      W().openDecorDock(id);
    } else {
      renderWorkshop();
    }
  }

  function removePlaced(id) {
    var st = readState();
    st.placed = st.placed || [];
    for (var i = st.placed.length - 1; i >= 0; i--) {
      if (st.placed[i].id === id) { st.placed.splice(i, 1); break; }
    }
    writeState(st);
    sound('playTap');
    if (W() && W().refreshHome) W().refreshHome(false);
    renderWorkshop();
  }

  function startMoveMode(focusId) {
    closeModal();
    if (W() && W().openDecorDock) W().openDecorDock(focusId || null);
    else if (W() && W().setMoveMode) W().setMoveMode(true);
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
      var dropKeys = Object.keys(b.drop || {}).map(function (k) { return '+' + b.drop[k] + ' ' + k; }).join(' · ');
      modalRoot().innerHTML =
        '<div class="isl-modal-backdrop" id="wg-battle-backdrop">' +
          '<div class="isl-card-modal wg-battle-modal" style="background-image:url(' + FLAT + b.bg + '.webp)">' +
            '<div class="wg-battle-stage">' +
              '<div class="wg-b-side"><div class="wg-b-fighter me cheer"><div class="wg-b-ground-shadow"></div>' + monSvg + '</div></div>' +
              '<div class="wg-b-side"><div class="wg-b-fighter foe dizzy"><div class="wg-b-ground-shadow"></div><img src="' + FLAT + b.dizzy + '.webp" alt=""></div></div>' +
            '</div>' +
            '<div class="wg-battle-card" style="text-align:center">' +
              '<h2 style="margin:4px 0;font-size:1.75rem;color:#fde047">🎉 Victory! ' + esc(b.name) + ' is your friend!</h2>' +
              '<div style="color:#6ee7b7;font-size:1.15rem;font-weight:800;margin:6px 0">⚡ +' + b.energy + ' Energy · 🎒 ' + esc(dropKeys) + '</div>' +
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
      var crit = battleRun.firstTry ? 10 : 0;
      var dmg = sp.dmg + crit;
      battleRun.foeHp = Math.max(0, battleRun.foeHp - dmg);
      if (sp.heal) battleRun.myHp = Math.min(battleRun.myMaxHp, battleRun.myHp + sp.heal);
      if (sp.shield) battleRun.shielded = true;

      if (meBox) meBox.classList.add('lunge');
      if (fxBox) {
        fxBox.innerHTML = '<img src="' + FLAT + sp.icon + '.webp" class="wg-spell-fly" alt=""><img src="' + FLAT + 'x_pow.webp" class="wg-spell-pow" alt="">';
      }
      if (foeBox) {
        foeBox.classList.add('hit');
        showDmgPopup(foeBox, '-' + dmg + ' HP' + (crit ? ' ✨CRIT!' : ''), '#fde047');
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
    updateEnergyChip: updateEnergyChip,
    updateJobsBadge: updateJobsBadge,
    hasMaterials: hasMaterials,
    giveMaterials: giveMaterials,
    openWorldMap: openWorldMap,
    jumpZone: jumpZone,
    goClassicMap: goClassicMap,
    openEnergyCharge: openEnergyCharge,
    answerEnergy: answerEnergy,
    openWorkshop: openWorkshop,
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
