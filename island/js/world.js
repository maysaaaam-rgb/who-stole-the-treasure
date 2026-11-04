/* Practice Island — the walking world, built on Phaser (island/lib).
   Each zone is a place to walk around. Walking up to a stop opens the same mission as the map, through IslandApp, so stars, XP limits and saving are unchanged.
   URL: ?demo=1 or ?p=CODE, plus ?zone=2  ?crowd=8 (extra monsters, demo only, to test speed)  ?fps=1 */
(function (root) {
  'use strict';

  var Q = new URLSearchParams(root.location.search);
  var W = 2400, H = 1500, CELL = 40, SPEED = 250, FRAME = 256, SHALLOW = 110;
  var STAGES = ['baby', 'baby', 'baby', 'growing', 'adventurer', 'advanced', 'ultimate'];   // eggs cannot walk, so a level 1 or 2 pupil walks as a baby here

  var BEACH = 'world/beach/', FLAT = 'flat/';
  // where the sand starts on the beach, every 120 across
  var SHORE = [635, 697, 721, 702, 701, 667, 644, 655, 690, 700, 658, 586, 560, 501, 497, 493, 511, 553, 576, 547, 494];
  function shore(x) { var t = Math.max(0, Math.min(SHORE.length - 1.001, x / 120)), i = Math.floor(t), k = (1 - Math.cos((t - i) * Math.PI)) / 2; return SHORE[i] + (SHORE[i + 1] - SHORE[i]) * k; }
  function edgeOf(x, y) { return y > 1480 || x < 60 || x > W - 60; }   // the wall of trees around each place
  // the river's two edges, every 100 down
  var RIVER_L = [1110, 1042, 974, 984, 1049, 1109, 1109, 1065, 1020, 975, 975, 994, 1032, 1031, 1015, 964];
  var RIVER_R = [1369, 1306, 1245, 1278, 1358, 1419, 1431, 1407, 1382, 1358, 1358, 1401, 1429, 1466, 1470, 1455];
  function inRiver(x, y) { var t = Math.max(0, Math.min(RIVER_L.length - 1.001, y / 100)), i = Math.floor(t), k = t - i; return x > RIVER_L[i] + (RIVER_L[i + 1] - RIVER_L[i]) * k - 14 && x < RIVER_R[i] + (RIVER_R[i + 1] - RIVER_R[i]) * k + 14; }
  var BRIDGE = { y0: 645, y1: 865 };

  /* Each stop: where it stands (x, y = feet), its picture and how tall. "done" swaps the picture when that mission is finished. */
  var ZONES = {
    0: {
      ground: 'meadow', look: { base: '#8fd14f', tile: 't_grass', alpha: .3, patch: 'rgba(190,232,110,.3)', edge: '#c7a463', fill: '#f4e4ae', speck: ['#e2cd8f', '#d6bd7c'], extra: ['t_floor'] },
      npc: { art: FLAT + 'c_bolt', worried: FLAT + 'c_bolt', happy: FLAT + 'c_bolt_happy', x: 560, y: 610 },
      blocked: function (x, y) { return y < 215 || edgeOf(x, y); },
      stops: [],
      chest: null,
      decor: [
        { art: FLAT + 'o_tree_round', x: 260, y: 450, h: 360, sw: 60, sway: true },
        { art: FLAT + 'o_tree_pine', x: 2140, y: 450, h: 350, sw: 60, sway: true },
        { art: FLAT + 'o_tree_round', x: 2190, y: 1280, h: 360, sw: 60, sway: true },
        { art: FLAT + 'o_tree_pine', x: 240, y: 1320, h: 340, sw: 60, sway: true },
        { art: FLAT + 'o_bush', x: 420, y: 480, h: 105, sw: 80 },
        { art: FLAT + 'o_bush', x: 2040, y: 1290, h: 110, sw: 80 },
        { art: FLAT + 'o_flowers_pink', x: 700, y: 980, h: 54, flat: true },
        { art: FLAT + 'o_flowers_pink', x: 1260, y: 1120, h: 54, flat: true }
      ],
      ground2: { flowers: [FLAT + 'o_flowers'], count: 26 },
      paths: [[[560, 680], [820, 700], [1120, 700], [1370, 700]]],
      edge: { top: [FLAT + 'o_tree_round', FLAT + 'o_tree_pine'], topH: [340, 430], bottom: [FLAT + 'o_bush'], bottomH: [130, 170] },
      gather: [
        { art: FLAT + 'i_wood', word: 'wood', h: 58, x: 420, y: 920 },
        { art: FLAT + 'i_wood', word: 'wood', h: 58, x: 1240, y: 1260 },
        { art: FLAT + 'i_stone', word: 'stone', h: 50, x: 680, y: 1160 },
        { art: FLAT + 'i_stone', word: 'stone', h: 50, x: 1780, y: 1180 },
        { art: FLAT + 'i_flower', word: 'flower', h: 56, x: 980, y: 1120 },
        { art: FLAT + 'i_flower', word: 'flower', h: 56, x: 1520, y: 1020 }
      ],
      crate: { x: 460, y: 1180 }, ball: { x: 1150, y: 1140 }, shells: [{ x: 460, y: 1195, under: true }, { x: 2100, y: 420 }]
    },
    1: {
      ground: 'meadow', look: { base: '#8fd14f', tile: 't_grass', alpha: .3, patch: 'rgba(190,232,110,.3)', edge: '#c7a463', fill: '#f4e4ae', speck: ['#e2cd8f', '#d6bd7c'] }, npc: { art: FLAT + 'c_bolt', worried: FLAT + 'c_bolt_worried', happy: FLAT + 'c_bolt_happy', x: 640, y: 620 }, blocked: function (x, y) { return y < 215 || y > 1480 || x < 60 || x > W - 60 || Math.pow((x - 1762) / 381, 2) + Math.pow((y - 476) / 227, 2) < 1; },
      stops: [{ x: 300, y: 1050, art: FLAT + 'o_machine_off', done: FLAT + 'o_machine_on', h: 210 }, { x: 700, y: 1250, art: FLAT + 'o_gear', h: 110 }, { x: 1120, y: 1040, art: FLAT + 'o_book', h: 110 }, { x: 1520, y: 1240, art: FLAT + 'o_robot', h: 190 }, { x: 1880, y: 980, art: FLAT + 'o_engine', h: 150 }],
      chest: { x: 2150, y: 1000, art: FLAT + 'o_chest' },
      decor: [{ art: FLAT + 'o_house', x: 930, y: 560, h: 340, sw: 230 }, { art: FLAT + 'o_well', x: 1270, y: 720, h: 200, sw: 100 }, { art: FLAT + 'o_sign', x: 1090, y: 700, h: 110, sw: 30 },
        { art: FLAT + 'o_tree_round', x: 1160, y: 440, h: 370, sw: 60, sway: true }, { art: FLAT + 'o_tree_round', x: 2230, y: 1270, h: 380, sw: 60, sway: true }, { art: FLAT + 'o_tree_pine', x: 1860, y: 1440, h: 340, sw: 60, sway: true }, { art: FLAT + 'o_tree_pine', x: 220, y: 440, h: 340, sw: 60, sway: true }, { art: FLAT + 'o_tree_round', x: 470, y: 470, h: 330, sw: 60, sway: true },
        { art: FLAT + 'o_bush', x: 600, y: 1430, h: 110, sw: 90 }, { art: FLAT + 'o_bush', x: 2050, y: 1260, h: 110, sw: 90 }, { art: FLAT + 'o_bush', x: 400, y: 760, h: 100, sw: 80 }, { art: FLAT + 'o_rock', x: 1450, y: 900, h: 80, sw: 70 }, { art: FLAT + 'o_campfire', x: 380, y: 640, h: 110, sw: 70 }, { art: FLAT + 'o_tent', x: 250, y: 600, h: 140, sw: 110 }, { art: FLAT + 'o_lamp', x: 780, y: 640, h: 170, sw: 26 }, { art: FLAT + 'o_mushroom', x: 1560, y: 1380, h: 80, sw: 40 }, { art: FLAT + 'o_flowers_pink', x: 700, y: 1010, h: 54, flat: true }, { art: FLAT + 'o_flowers_pink', x: 1640, y: 1180, h: 54, flat: true }, { art: FLAT + 'o_fence', x: 480, y: 910, h: 90, sw: 90 }, { art: FLAT + 'o_fence', x: 590, y: 910, h: 90, sw: 90 }, { art: FLAT + 'o_fence', x: 1660, y: 820, h: 90, sw: 90 }, { art: FLAT + 'o_fence', x: 1770, y: 820, h: 90, sw: 90 }],
      ground2: { flowers: [FLAT + 'o_flowers'], count: 30 },
      paths: [[[70, 760], [300, 1110], [700, 1310], [1120, 1100], [1520, 1300], [1880, 1040], [2150, 1060], [2330, 760]], [[1120, 1100], [1190, 800], [1000, 610]]],
      edge: { top: [FLAT + 'o_tree_round', FLAT + 'o_tree_pine'], topH: [340, 430], bottom: [FLAT + 'o_bush'], bottomH: [130, 170] },
      gather: [{ art: FLAT + 'i_wood', word: 'wood', h: 58, x: 840, y: 1010 }, { art: FLAT + 'i_wood', word: 'wood', h: 58, x: 1990, y: 1100 }, { art: FLAT + 'i_wood', word: 'wood', h: 58, x: 420, y: 1370 }, { art: FLAT + 'i_wood', word: 'wood', h: 58, x: 1420, y: 620 },
        { art: FLAT + 'i_stone', word: 'stone', h: 50, x: 930, y: 1190 }, { art: FLAT + 'i_stone', word: 'stone', h: 50, x: 1600, y: 1120 }, { art: FLAT + 'i_stone', word: 'stone', h: 50, x: 620, y: 780 },
        { art: FLAT + 'i_flower', word: 'flower', h: 56, x: 1330, y: 1010 }, { art: FLAT + 'i_flower', word: 'flower', h: 56, x: 240, y: 800 }, { art: FLAT + 'i_flower', word: 'flower', h: 56, x: 2070, y: 800 }, { art: FLAT + 'i_flower', word: 'flower', h: 56, x: 880, y: 1400 }],
      crate: { x: 1360, y: 1180 }, ball: { x: 760, y: 950 }, shells: [{ x: 1360, y: 1195, under: true }, { x: 1352, y: 480 }, { x: 240, y: 1400 }]
    },
    2: {
      ground: 'beach', look: { base: '#f2cf6b', tile: 't_sand', alpha: .4, patch: 'rgba(255,236,170,.14)', extra: ['t_water'] }, npc: { art: FLAT + 'c_lulu', worried: FLAT + 'c_lulu_worried', happy: FLAT + 'c_lulu_happy', x: 1810, y: 700, h: 130 },
      blocked: function (x, y) { return edgeOf(x, y) || y < shore(x) - SHALLOW; }, shallows: function (x, y) { return y < shore(x) - 6 && y >= shore(x) - SHALLOW; },
      stops: [{ x: 400, y: 665, art: FLAT + 'o_fish', h: 110 }, { x: 720, y: 980, art: FLAT + 'o_lantern', h: 130 }, { x: 1120, y: 1240, art: FLAT + 'o_fishing_rod', h: 150 }, { x: 1540, y: 1000, art: FLAT + 'o_boat', h: 170 }, { x: 2040, y: 590, art: FLAT + 'o_lighthouse_off', done: FLAT + 'o_lighthouse_on', h: 440, sw: 110 }],
      chest: { x: 2190, y: 1050, art: FLAT + 'o_chest' },
      decor: [{ art: FLAT + 'o_palm_a', x: 170, y: 1000, h: 370, sw: 46, shake: true }, { art: FLAT + 'o_palm_b', x: 640, y: 1330, h: 340, sw: 46, shake: true }, { art: FLAT + 'o_palm_a', x: 1190, y: 740, h: 370, sw: 46, shake: true, shell: true }, { art: FLAT + 'o_palm_b', x: 1920, y: 1390, h: 340, sw: 46, shake: true }, { art: FLAT + 'o_palm_a', x: 2290, y: 1300, h: 370, sw: 46, shake: true },
        { art: FLAT + 'o_hut', x: 760, y: 770, h: 300, sw: 180 }, { art: FLAT + 'o_umbrella', x: 1320, y: 1060, h: 240, sw: 26 }, { art: FLAT + 'o_umbrella', x: 2000, y: 830, h: 200, sw: 26 },
        { art: FLAT + 'o_rock', x: 1000, y: 840, h: 90, sw: 80 }, { art: FLAT + 'o_rock', x: 480, y: 830, h: 70, sw: 60 }, { art: FLAT + 'o_rock', x: 1700, y: 1230, h: 70, sw: 60 }, { art: FLAT + 'o_driftwood', x: 1420, y: 730, h: 44, flat: true }, { art: FLAT + 'o_sandcastle', x: 1040, y: 980, h: 110, sw: 70 }, { art: FLAT + 'o_starfish', x: 880, y: 1140, h: 46, flat: true }, { art: FLAT + 'o_starfish', x: 1480, y: 1270, h: 40, flat: true },
        { art: FLAT + 'o_bush', x: 430, y: 1440, h: 120, sw: 100 }, { art: FLAT + 'o_bush', x: 1640, y: 1440, h: 120, sw: 100 }],
      edge: { noTop: true, top: [FLAT + 'o_palm_a', FLAT + 'o_palm_b'], topH: [320, 400], bottom: [FLAT + 'o_bush'], bottomH: [120, 160] },
      gather: [{ art: FLAT + 'i_shell', word: 'shell', h: 48, x: 900, y: 930 }, { art: FLAT + 'i_shell', word: 'shell', h: 48, x: 1450, y: 1300 }, { art: FLAT + 'i_shell', word: 'shell', h: 48, x: 300, y: 1250 }, { art: FLAT + 'i_shell', word: 'shell', h: 48, x: 2000, y: 1150 },
        { art: FLAT + 'i_wood', word: 'wood', h: 58, x: 1320, y: 860 }, { art: FLAT + 'i_wood', word: 'wood', h: 58, x: 560, y: 1180 }, { art: FLAT + 'i_wood', word: 'wood', h: 58, x: 2240, y: 900 },
        { art: FLAT + 'i_stone', word: 'stone', h: 50, x: 1000, y: 1320 }, { art: FLAT + 'i_stone', word: 'stone', h: 50, x: 1640, y: 1150 }, { art: FLAT + 'i_stone', word: 'stone', h: 50, x: 380, y: 900 }],
      crate: { x: 1740, y: 990 }, ball: { x: 960, y: 1100 }, shells: [{ x: 1740, y: 1005, under: true }, { x: 610, y: shore(610) - 62, wet: true }]
    },
    3: {
      ground: 'forest', look: { base: '#5aa646', tile: 't_forest', alpha: .16, patch: 'rgba(120,190,80,.3)', edge: '#8a6a3c', fill: '#d9bd84', speck: ['#c4a56b', '#b8975c'] }, npc: { art: FLAT + 'c_nutty', worried: FLAT + 'c_nutty_worried', happy: FLAT + 'c_nutty_happy', x: 860, y: 480 },
      blocked: function (x, y) { return y < 215 || edgeOf(x, y) || (inRiver(x, y) && !(y > BRIDGE.y0 && y < BRIDGE.y1)); },
      stops: [{ x: 300, y: 620, art: FLAT + 'o_stepping_stone', h: 90 }, { x: 640, y: 1080, art: FLAT + 'o_basket', h: 130 }, { x: 690, y: 830, art: FLAT + 'o_book', h: 100 }, { x: 1560, y: 1040, art: FLAT + 'o_stepping_stone', h: 90 }, { x: 1900, y: 690, art: FLAT + 'o_market_closed', done: FLAT + 'o_market_open', h: 280, sw: 190 }],
      chest: { x: 2130, y: 1040, art: FLAT + 'o_chest' },
      decor: [{ art: FLAT + 'o_treehouse', x: 450, y: 480, h: 380, sw: 110 }, { art: FLAT + 'v_shop', x: 1360, y: 560, h: 220, sw: 140 }, { art: FLAT + 'o_sign', x: 1520, y: 560, h: 110, sw: 30 },
        { art: FLAT + 'o_forest_tree', x: 1720, y: 420, h: 340, sw: 70, sway: true }, { art: FLAT + 'o_forest_tree', x: 2310, y: 1410, h: 320, sw: 70, sway: true }, { art: FLAT + 'o_forest_tree', x: 140, y: 500, h: 320, sw: 70, sway: true }, { art: FLAT + 'o_forest_pine', x: 2230, y: 560, h: 300, sw: 60, sway: true }, { art: FLAT + 'o_forest_pine', x: 400, y: 900, h: 300, sw: 60, sway: true }, { art: FLAT + 'o_forest_pine', x: 1950, y: 1400, h: 300, sw: 60, sway: true }, { art: FLAT + 'o_forest_pine', x: 1850, y: 960, h: 300, sw: 60, sway: true },
        { art: FLAT + 'o_campfire', x: 1560, y: 1340, h: 110, sw: 70 }, { art: FLAT + 'o_stump', x: 800, y: 1250, h: 80, sw: 80 }, { art: FLAT + 'o_stump', x: 2110, y: 1260, h: 80, sw: 80 }, { art: FLAT + 'o_mushrooms', x: 250, y: 980, h: 90, sw: 60 }, { art: FLAT + 'o_mushrooms', x: 1630, y: 720, h: 100, sw: 60 }, { art: FLAT + 'o_mushrooms', x: 840, y: 1420, h: 80, sw: 60 }, { art: FLAT + 'o_log', x: 2090, y: 620, h: 60, sw: 90 }, { art: FLAT + 'o_rock', x: 1640, y: 950, h: 70, sw: 60 }, { art: FLAT + 'o_rock', x: 540, y: 1150, h: 60, sw: 60 }, { art: FLAT + 'o_bush', x: 2000, y: 760, h: 100, sw: 80 }, { art: FLAT + 'o_bush', x: 820, y: 1060, h: 100, sw: 80 },
        { art: FLAT + 'o_fern', x: 700, y: 300, h: 70, flat: true }, { art: FLAT + 'o_fern', x: 1650, y: 1440, h: 70, flat: true }, { art: FLAT + 'o_fern', x: 210, y: 660, h: 60, flat: true }],
      paths: [[[70, 760], [300, 690], [640, 1140], [690, 890], [840, 760], [1000, 755]], [[1420, 755], [1640, 770], [1560, 1100], [1900, 690], [2130, 1100], [2330, 760]]],
      edge: { top: [FLAT + 'o_forest_tree', FLAT + 'o_forest_pine'], topH: [340, 430], bottom: [FLAT + 'o_fern'], bottomH: [110, 150] },
      gather: [{ art: FLAT + 'i_berry', word: 'berry', h: 50, x: 500, y: 1000 }, { art: FLAT + 'i_berry', word: 'berry', h: 50, x: 1700, y: 830 }, { art: FLAT + 'i_berry', word: 'berry', h: 50, x: 2080, y: 1170 }, { art: FLAT + 'i_berry', word: 'berry', h: 50, x: 300, y: 1300 },
        { art: FLAT + 'i_wood', word: 'wood', h: 58, x: 830, y: 760 }, { art: FLAT + 'i_wood', word: 'wood', h: 58, x: 1500, y: 1200 }, { art: FLAT + 'i_wood', word: 'wood', h: 58, x: 2200, y: 760 },
        { art: FLAT + 'i_flower', word: 'flower', h: 56, x: 160, y: 800 }, { art: FLAT + 'i_flower', word: 'flower', h: 56, x: 1620, y: 560 }, { art: FLAT + 'i_flower', word: 'flower', h: 56, x: 900, y: 1320 }],
      stoneX: 180, crate: { x: 1700, y: 1250 }, ball: { x: 500, y: 1300 }, shells: [{ x: 1700, y: 1265, under: true }, { x: 2200, y: 300 }, { x: 780, y: 1460 }]
    },
    4: {
      ground: 'volcano', look: { base: '#d08a4a', tile: 't_rock', alpha: .35, patch: 'rgba(235,170,100,.25)', extra: ['t_lava_rock'], edge: '#7c4f2a', fill: '#b9794a', speck: ['#a56a3e', '#94603a'] }, npc: { art: FLAT + 'c_ember', worried: FLAT + 'c_ember_worried', happy: FLAT + 'c_ember_happy', x: 760, y: 560, h: 170 },
      blocked: function (x, y) { return y < 215 || edgeOf(x, y) || (x > 594 && x < 1800 && y < 400); },
      stops: [{ x: 420, y: 720, art: FLAT + 'o_bubble', h: 120 }, { x: 640, y: 1100, art: FLAT + 'o_rocket', h: 170 }, { x: 1120, y: 780, art: FLAT + 'o_launcher', h: 140 }, { x: 1560, y: 1120, art: FLAT + 'o_flag', h: 170 }, { x: 1950, y: 690, art: FLAT + 'o_volcano_angry', done: FLAT + 'o_volcano_calm', h: 300, sw: 190 }],
      chest: { x: 2180, y: 1120, art: FLAT + 'o_chest' },
      decor: [{ art: FLAT + 'o_dark_rock', x: 2100, y: 340, h: 110, sw: 100 }, { art: FLAT + 'o_dark_rock', x: 1700, y: 700, h: 90, sw: 80 }, { art: FLAT + 'o_dark_rock', x: 110, y: 1320, h: 100, sw: 90 }, { art: FLAT + 'o_dark_rock', x: 200, y: 930, h: 80, sw: 80 }, { art: FLAT + 'o_dark_rock', x: 1850, y: 1350, h: 80, sw: 80 }, { art: FLAT + 'o_dark_rock', x: 330, y: 400, h: 130, sw: 120 },
        { art: FLAT + 'o_crystal_orange', x: 2280, y: 480, h: 110, sw: 70 }, { art: FLAT + 'o_crystal_orange', x: 1560, y: 1440, h: 100, sw: 70 }, { art: FLAT + 'o_crystal_purple', x: 600, y: 620, h: 120, sw: 70 }, { art: FLAT + 'o_crystal_purple', x: 2050, y: 930, h: 100, sw: 60 }, { art: FLAT + 'o_vent', x: 1450, y: 550, h: 130, sw: 70 }, { art: FLAT + 'o_vent', x: 820, y: 1200, h: 120, sw: 70 }, { art: FLAT + 'o_vent', x: 360, y: 1020, h: 100, sw: 60 }],
      paths: [[[70, 760], [420, 790], [640, 1160], [1120, 840], [1560, 1180], [1950, 690], [2180, 1180], [2330, 760]]],
      edge: { still: true, top: [FLAT + 'o_dark_rock'], topH: [130, 190], bottom: [FLAT + 'o_dark_rock'], bottomH: [100, 140] },
      gather: [{ art: FLAT + 'i_stone', word: 'stone', h: 50, x: 560, y: 900 }, { art: FLAT + 'i_stone', word: 'stone', h: 50, x: 1280, y: 1250 }, { art: FLAT + 'i_stone', word: 'stone', h: 50, x: 1760, y: 840 }, { art: FLAT + 'i_stone', word: 'stone', h: 50, x: 2000, y: 1100 },
        { art: FLAT + 'i_crystal', word: 'crystal', h: 58, x: 1480, y: 650 }, { art: FLAT + 'i_crystal', word: 'crystal', h: 58, x: 240, y: 1250 }, { art: FLAT + 'i_crystal', word: 'crystal', h: 58, x: 2230, y: 1000 },
        { art: FLAT + 'i_wood', word: 'wood', h: 58, x: 1010, y: 1130 }, { art: FLAT + 'i_wood', word: 'wood', h: 58, x: 1900, y: 800 }, { art: FLAT + 'i_wood', word: 'wood', h: 58, x: 1000, y: 620 }],
      crate: { x: 1300, y: 1000 }, ball: { x: 400, y: 1280 }, shells: [{ x: 1300, y: 1015, under: true }, { x: 2260, y: 280 }, { x: 700, y: 1460 }]
    }
  };
  var ART = [FLAT + 'o_gift', FLAT + 'o_star_path', FLAT + 'o_chest', FLAT + 'o_chest_open', FLAT + 'o_ball', FLAT + 'o_crate', FLAT + 'o_shell', FLAT + 'o_coconut', FLAT + 'o_butterfly', FLAT + 'o_bird', FLAT + 'o_duck', FLAT + 'o_frog', FLAT + 'v_mark'];
  // only the zone you are in is loaded, so phones wait less
  function artUrl(n) { return (n.indexOf(FLAT) === 0 ? 'art/' : 'art/clean/') + n + '.webp'; }
  function zoneArt(z) {
    var seen = {}, Z = ZONES[z], n = Z.npc, list = [n.art, n.worried, n.happy, FLAT + Z.look.tile, FLAT + 'o_gate_arrow', FLAT + 'o_cloud_lock'];
    (Z.look.extra || []).forEach(function (t) { list.push(FLAT + t); });
    Z.decor.forEach(function (d) { list.push(d.art); });
    Z.stops.forEach(function (d) { list.push(d.art); if (d.done) list.push(d.done); });
    (Z.gather || []).forEach(function (d) { list.push(d.art); });
    if (Z.ground2) list = list.concat(Z.ground2.flowers);
    if (Z.edge) list = list.concat(Z.edge.top, Z.edge.bottom);
    if (z === 0 && root.WorldGame) {
      list.push(FLAT + 'o_workbench');
      root.WorldGame.HOUSE_TIERS.forEach(function (h) { list.push(FLAT + h.id); });
      root.WorldGame.RECIPES.forEach(function (r) { list.push(FLAT + r.id); });
    }
    if (root.WorldGame) {
      root.WorldGame.VILLAGERS.forEach(function (v) { if (v.zone === z) { list.push(FLAT + v.art, FLAT + v.happy); } });
      root.WorldGame.BATTLES.forEach(function (b) { if (b.zone === z) { list.push(FLAT + b.art, FLAT + b.dizzy); } });
    }
    try {
      var eq = monsterLook().equipped || {};
      if (eq.ride && String(eq.ride).indexOf('r_') === 0) list.push(FLAT + eq.ride);
    } catch (e) { /* ignore */ }
    return list.filter(function (a) { if (seen[a]) return false; seen[a] = 1; return true; });
  }

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var App = function () { return root.IslandApp; };
  var ses = function () { var st = App() && App().state(); return st && st.session; };
  var A = function () { return root.IslandAudio || {}; };
  function sound(n) { if (A()[n]) { try { A()[n](); } catch (e) { /* no sound */ } } }
  function say(t) { if (A().speak) A().speak(t); }

  var S = { joy: { x: 0, y: 0 }, path: [], onArrive: null, near: null, modal: false, ready: false, zone: 1, moveMode: false, movingIdx: -1 };
  var scene = null;

  /* ---------- progress, always read from the pupil's real saved game ---------- */
  function missions(z) {
    if (z === 0) return { regular: [], star: [] };
    var s = ses();
    return root.IslandData.getZoneMissions(s.grade || 3, z, !!s.star);
  }
  function starsOf(id) { var d = ses().doc || {}; return Number((d.stars || {})[id]) || 0; }
  function isOpen(z) {
    if (z <= 1) return true;
    if (Q.get('all') || (Q.get('demo') && Q.get('zone'))) return true;
    var prev = missions(z - 1).regular.filter(function (m) { return starsOf(m.id) > 0; }).length;
    return prev >= 4;
  }
  function chestOpened(z) { var d = ses().doc || {}; return !!(d.chests && d.chests['z' + z]); }
  function zoneName(z) {
    if (z === 0) return 'My Home Island';
    var s = ses(), zz = root.IslandData.ZONES[z - 1];
    return (zz.titles[s.grade || 3] || zz.titles[3]).name;
  }
  var SHELL_KEY = function () { return 'eaa_world_shells_' + ((ses().student && ses().student.id) || 'x'); };
  function foundShells() { try { return JSON.parse(localStorage.getItem(SHELL_KEY())) || {}; } catch (e) { return {}; } }
  function saveShell(k) { var f = foundShells(); f[k] = 1; try { localStorage.setItem(SHELL_KEY(), JSON.stringify(f)); } catch (e) { /* just for now */ } }

  /* ---------- the ground: Gemini's picture for each zone ---------- */
  // the flat cartoon ground: drawn sharp in code, so it never goes blurry
  function paintFlat(sc, z) {
    var key = 'flat' + z, zone = ZONES[z], look = zone.look;
    if (!sc.textures.exists(key)) {
      var tex = sc.textures.createCanvas(key, W, H), c = tex.context, i, x, y;
      var tile = function (name) { return c.createPattern(sc.textures.get(FLAT + name).getSourceImage(), 'repeat'); };
      c.fillStyle = look.base; c.fillRect(0, 0, W, H);
      c.globalAlpha = look.alpha; c.fillStyle = tile(look.tile); c.fillRect(0, 0, W, H); c.globalAlpha = 1;
      for (i = 0; i < 14; i++) { c.fillStyle = look.patch; c.beginPath(); c.ellipse(seeded(i + 200) * W, seeded(i + 230) * H, 150 + seeded(i + 260) * 220, 80 + seeded(i + 290) * 110, 0, 0, 7); c.fill(); }
      var oval = function (cx, cy, rx, ry, fill, line, lw) { c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, 7); c.fillStyle = fill; c.fill(); if (line) { c.lineWidth = lw; c.strokeStyle = line; c.stroke(); } };
      if (z === 0) {
        /* Warm wooden patio deck for furniture (f_*) next to the house */
        var px = 1380, py = 460, pw = 560, ph = 390, pr = 28;
        c.save();
        c.beginPath();
        c.moveTo(px + pr, py); c.lineTo(px + pw - pr, py); c.quadraticCurveTo(px + pw, py, px + pw, py + pr);
        c.lineTo(px + pw, py + ph - pr); c.quadraticCurveTo(px + pw, py + ph, px + pw - pr, py + ph);
        c.lineTo(px + pr, py + ph); c.quadraticCurveTo(px, py + ph, px, py + ph - pr);
        c.lineTo(px, py + pr); c.quadraticCurveTo(px, py, px + pr, py); c.closePath();
        c.fillStyle = '#c8924b'; c.fill();
        c.clip();
        c.globalAlpha = .82; c.fillStyle = tile('t_floor'); c.fillRect(px, py, pw, ph);
        c.restore();
        c.lineWidth = 8; c.strokeStyle = '#6f4316'; c.stroke();
      }
      if (z === 1) {
        oval(1762, 476, 425, 262, '#f3dd9c', '#b98f4a', 5);
        oval(1762, 476, 385, 228, '#3fb5e2', '#1f7fae', 6);
        oval(1740, 500, 330, 180, '#63cbee');
        c.strokeStyle = '#d6f5ff'; c.lineWidth = 6; c.lineCap = 'round';
        [[1500, 420, 110], [1720, 360, 140], [1900, 470, 120], [1620, 560, 130], [1840, 600, 100]].forEach(function (w) { c.beginPath(); c.moveTo(w[0], w[1]); c.quadraticCurveTo(w[0] + w[2] / 2, w[1] - 16, w[0] + w[2], w[1]); c.stroke(); });
      }
      if (z === 2) {
        var sea = function (off) { c.beginPath(); c.moveTo(0, 0); for (x = 0; x <= W; x += 12) c.lineTo(x, shore(x) + off); c.lineTo(W, 0); c.closePath(); };
        sea(26); c.fillStyle = '#d9ad58'; c.fill();
        sea(0); c.fillStyle = '#5fd6df'; c.fill();
        c.save(); c.clip(); c.globalAlpha = .45; c.fillStyle = tile('t_water'); c.fillRect(0, 0, W, H); c.restore();
        sea(-SHALLOW); c.fillStyle = '#23a5d6'; c.fill();
        c.save(); c.clip(); c.globalAlpha = .4; c.fillStyle = tile('t_water'); c.fillRect(0, 0, W, H); c.restore();
        sea(-SHALLOW - 170); c.fillStyle = '#1680bb'; c.fill();
        c.strokeStyle = '#fff'; c.lineWidth = 16; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); for (x = 0; x <= W; x += 12) { if (x) c.lineTo(x, shore(x) - 2); else c.moveTo(x, shore(x) - 2); } c.stroke();
      }
      if (z === 3) {
        var bank = function (k, pad) { var v = k === 'L' ? RIVER_L : RIVER_R; return v.map(function (n, r) { return [n + (k === 'L' ? -pad : pad), r * 100]; }); };
        var river = function (pad) { c.beginPath(); bank('L', pad).forEach(function (q, n) { if (n) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); }); bank('R', pad).reverse().forEach(function (q) { c.lineTo(q[0], q[1]); }); c.closePath(); };
        c.lineJoin = 'round';
        river(34); c.fillStyle = '#e8cf8f'; c.fill(); c.lineWidth = 5; c.strokeStyle = '#a98a4e'; c.stroke();
        river(0); c.fillStyle = '#3fb5e2'; c.fill(); c.lineWidth = 6; c.strokeStyle = '#1f7fae'; c.stroke();
        c.strokeStyle = '#bfeeff'; c.lineWidth = 6; c.lineCap = 'round';
        for (i = 0; i < 16; i++) { y = 60 + i * 92; x = (RIVER_L[Math.floor(y / 100)] + RIVER_R[Math.floor(y / 100)]) / 2 + (seeded(i + 40) - .5) * 120; c.beginPath(); c.moveTo(x - 36, y); c.quadraticCurveTo(x, y - 14, x + 36, y); c.stroke(); }
        var bx0 = 950, bx1 = 1480, by0 = BRIDGE.y0, by1 = BRIDGE.y1;
        c.fillStyle = 'rgba(15,60,90,.3)'; c.fillRect(bx0, by1, bx1 - bx0, 18);
        for (x = bx0, i = 0; x < bx1; x += 53, i++) { c.fillStyle = i % 2 ? '#b9823f' : '#c8924b'; c.fillRect(x, by0, 53, by1 - by0); c.strokeStyle = '#6f4316'; c.lineWidth = 3; c.strokeRect(x, by0, 53, by1 - by0); }
        c.fillStyle = '#6f4316'; c.fillRect(bx0 - 6, by0 - 10, bx1 - bx0 + 12, 12); c.fillRect(bx0 - 6, by1 - 2, bx1 - bx0 + 12, 12);
      }
      if (z === 4) {
        var fx0 = 594, fx1 = 1800, fy = 400, r = 50;
        c.beginPath(); c.moveTo(fx0, 0); c.lineTo(fx0, fy - r); c.quadraticCurveTo(fx0, fy, fx0 + r, fy); c.lineTo(fx1 - r, fy); c.quadraticCurveTo(fx1, fy, fx1, fy - r); c.lineTo(fx1, 0); c.closePath();
        c.fillStyle = '#4a3f3a'; c.fill(); c.lineWidth = 7; c.strokeStyle = '#2b211c'; c.stroke();
        c.save(); c.clip(); c.globalAlpha = .85; c.fillStyle = tile('t_lava_rock'); c.fillRect(0, 0, W, H); c.restore();
      }
      if (zone.paths) {
        c.lineCap = 'round'; c.lineJoin = 'round';
        [[92, look.edge], [78, look.fill]].forEach(function (st) {
          zone.paths.forEach(function (pts) {
            var line = new Phaser.Curves.Spline(pts.map(function (q) { return new Phaser.Math.Vector2(q[0], q[1]); })).getPoints(pts.length * 22);
            c.strokeStyle = st[1]; c.lineWidth = st[0]; c.beginPath(); line.forEach(function (q, n) { if (n) c.lineTo(q.x, q.y); else c.moveTo(q.x, q.y); }); c.stroke();
          });
        });
        zone.paths.forEach(function (pts, pi) {
          var line = new Phaser.Curves.Spline(pts.map(function (q) { return new Phaser.Math.Vector2(q[0], q[1]); })).getPoints(pts.length * 8);
          line.forEach(function (q, n) { c.fillStyle = look.speck[n % 3 ? 0 : 1]; c.beginPath(); c.ellipse(q.x + (seeded(n + pi * 50) - .5) * 52, q.y + (seeded(n + pi * 50 + 7) - .5) * 52, 5 + seeded(n) * 8, 3 + seeded(n + 3) * 4, 0, 0, 7); c.fill(); });
        });
      }
      tex.refresh();
    }
    sc.add.image(0, 0, key).setOrigin(0).setDepth(-20);
  }
  function paintGround(sc, z) {
    paintFlat(sc, z);
    if (ZONES[z].ground !== 'beach') return;
    if (!sc.textures.exists('foam')) {   // the waves come and go on the beach
      var fT = sc.textures.createCanvas('foam', W / 2, 500), f2 = fT.context, xx;
      f2.strokeStyle = 'rgba(255,255,255,.9)'; f2.lineWidth = 6; f2.lineCap = 'round'; f2.beginPath();
      for (xx = 0; xx <= W / 2; xx += 4) { var fy = (shore(xx * 2) - 16) / 2; if (!xx) f2.moveTo(xx, fy); else f2.lineTo(xx, fy); } f2.stroke(); fT.refresh();
    }
    var foam = sc.add.image(0, 0, 'foam').setOrigin(0).setScale(2).setDepth(-19);
    foam.setAlpha(.1); sc.tweens.add({ targets: foam, y: -22, alpha: .85, duration: 2100, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }
  function seeded(n) { var v = Math.sin(n * 12.9898 + 4.1) * 43758.5453; return v - Math.floor(v); }
  // flowers underfoot, a wall of trees around the place, clouds and drifting pollen
  function addLife(sc, zone) {
    var g2 = zone.ground2, ed = zone.edge, i, im;
    if (g2) for (i = 0; i < g2.count; i++) {
      var fx = 80 + seeded(i + 1) * (W - 160), fy = 240 + seeded(i + 60) * (H - 300);
      if (zone.blocked(fx, fy)) continue;
      im = sc.add.image(fx, fy, g2.flowers[i % g2.flowers.length]).setOrigin(.5, .9).setDepth(-5); im.setScale((26 + seeded(i + 90) * 22) / im.height);
    }
    if (ed) {
      var tree = function (x, y, n) {
        var art = ed.top[n % ed.top.length], t = sc.add.image(x, y, art).setOrigin(.5, 1).setDepth(y); t.setScale((ed.topH[0] + seeded(n + 5) * (ed.topH[1] - ed.topH[0])) / t.height);
        if (n % 2) t.setFlipX(true);
        if (!ed.still) sc.tweens.add({ targets: t, angle: { from: -.9, to: .9 }, duration: 1900 + seeded(n) * 1500, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      };
      if (!ed.noTop) for (i = 0; i < 17; i++) { tree(i * 150 + seeded(i) * 40, 110 + seeded(i + 30) * 30, i); tree(i * 150 + 70 + seeded(i + 9) * 40, 205 + seeded(i + 40) * 22, i + 50); }
      for (i = 0; i < 9; i++) { var y = 300 + i * 135 + seeded(i + 70) * 40; if ((y > 590 && y < 930) || zone.blocked(120, y)) continue; tree(-14 - seeded(i + 2) * 20, y, i + 3); tree(W + 14 + seeded(i + 4) * 20, y, i + 8); }
      for (i = 0; i < 22; i++) { im = sc.add.image(i * 115 + seeded(i + 80) * 50, 1560, ed.bottom[0]).setOrigin(.5, 1).setDepth(1560); im.setScale((ed.bottomH[0] + seeded(i + 20) * (ed.bottomH[1] - ed.bottomH[0])) / im.height); }
    }
    for (i = 0; i < 4; i++) {
      var cl = sc.add.image(seeded(i + 11) * W, 200 + seeded(i + 12) * 1100, 'dot').setDepth(4300).setTint(0x1e293b).setAlpha(.1); cl.setScale(26 + seeded(i + 13) * 14, 13 + seeded(i + 14) * 8);
      sc.tweens.add({ targets: cl, x: cl.x + 900, duration: 42000 + i * 9000, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    }
    var zoneTints = {
      0: [0xfffbe0, 0xfef08a, 0xffffff],
      1: [0xfffbe0, 0x86efac, 0xfde68a],
      2: [0xbae6fd, 0xe0f2fe, 0xffffff],
      3: [0x86efac, 0x4ade80, 0xa7f3d0],
      4: [0xf87171, 0xfb923c, 0xfde047]
    };
    var isVolcano = S.zone === 4;
    sc.add.particles(0, 0, 'dot', {
      x: { min: 0, max: W }, y: { min: 100, max: H },
      lifespan: isVolcano ? 3800 : 5400,
      frequency: isVolcano ? 160 : 240,
      speedX: { min: -16, max: 24 },
      speedY: isVolcano ? { min: -48, max: -18 } : { min: -22, max: -4 },
      scale: { start: isVolcano ? .08 : .05, end: .36 },
      alpha: { start: .85, end: 0 },
      tint: zoneTints[S.zone] || [0xfffbe0, 0xffffff]
    }).setDepth(4200);
    // ambient flat wildlife so each place feels alive
    var flyerKey = (S.zone === 2 || S.zone === 4) ? FLAT + 'o_bird' : FLAT + 'o_butterfly';
    for (i = 0; i < 4; i++) {
      var bx = 260 + seeded(i + 301) * (W - 520), by = 320 + seeded(i + 311) * 860, fl = sc.add.image(bx, by, flyerKey).setDepth(4150);
      fl.setScale((flyerKey === FLAT + 'o_bird' ? 48 : 40) / fl.height);
      sc.tweens.add({ targets: fl, x: bx + (i % 2 ? 180 : -180), y: by + (i % 2 ? -65 : 65), duration: 3600 + i * 700, yoyo: true, repeat: -1, ease: 'Sine.inOut', onYoyo: function (tw, t) { t.setFlipX(!t.flipX); }, onRepeat: function (tw, t) { t.setFlipX(!t.flipX); } });
    }
    if (S.zone === 1) {
      var dk1 = sc.add.image(1680, 480, FLAT + 'o_duck').setDepth(480); dk1.setScale(52 / dk1.height);
      sc.tweens.add({ targets: dk1, x: 1830, duration: 4800, yoyo: true, repeat: -1, ease: 'Sine.inOut', onYoyo: function () { dk1.setFlipX(true); }, onRepeat: function () { dk1.setFlipX(false); } });
      var fg1 = sc.add.image(1410, 560, FLAT + 'o_frog').setOrigin(.5, .95).setDepth(560); fg1.setScale(44 / fg1.height);
      sc.tweens.add({ targets: fg1, y: 544, duration: 420, yoyo: true, hold: 1800, repeat: -1, ease: 'Quad.out' });
    } else if (S.zone === 3) {
      var dk3 = sc.add.image(1180, 520, FLAT + 'o_duck').setDepth(520); dk3.setScale(52 / dk3.height);
      sc.tweens.add({ targets: dk3, y: 600, duration: 4400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      var fg3 = sc.add.image(960, 960, FLAT + 'o_frog').setOrigin(.5, .95).setDepth(960); fg3.setScale(44 / fg3.height);
      sc.tweens.add({ targets: fg3, y: 944, duration: 420, yoyo: true, hold: 1900, repeat: -1, ease: 'Quad.out' });
    }
  }
  /* ---------- gathering: things to pick up on the way, each one says its word ---------- */
  var BAG_KEY = function () { return 'eaa_world_bag_' + ((ses().student && ses().student.id) || 'x'); };
  function readBag() { try { return JSON.parse(localStorage.getItem(BAG_KEY())) || { items: {}, day: '', taken: {} }; } catch (e) { return { items: {}, day: '', taken: {} }; } }
  function writeBag(b) { try { localStorage.setItem(BAG_KEY(), JSON.stringify(b)); } catch (e) { /* just for now */ } }
  function drawBag() {
    var b = readBag(), box = $('w-bag'), zone = ZONES[S.zone], seen = {}, html = '';
    (zone.gather || []).forEach(function (g) { if (seen[g.word]) return; seen[g.word] = 1; html += '<button type="button" class="w-bag-item" data-word="' + g.word + '" onclick="WORLD.tapBag(\'' + g.word + '\',this)"><img src="' + artUrl(g.art) + '" alt=""><b>' + (Number(b.items[g.word]) || 0) + '</b></button>'; });
    box.innerHTML = html; box.classList.toggle('on', !!html);
  }
  function buildGather(sc, zone) {
    sc.gather = [];
    var b = readBag(), today = new Date().toISOString().slice(0, 10);
    if (b.day !== today) { b.day = today; b.taken = {}; writeBag(b); }
    (zone.gather || []).forEach(function (g, i) {
      var id = 'z' + S.zone + '_' + i; if (b.taken[id]) return;
      var im = sc.add.image(g.x, g.y, g.art).setOrigin(.5, .9).setDepth(g.y); im.setScale(g.h / im.height);
      var shade = sc.add.image(g.x, g.y, 'shadow').setScale(.7).setDepth(-6);
      var glow = sc.add.image(g.x, g.y - g.h * .4, 'dot').setScale(4).setAlpha(.32).setTint(0xfff3a8).setDepth(g.y - 1);
      sc.tweens.add({ targets: glow, alpha: .08, scale: 5, duration: 900 + i * 40, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      sc.gather.push({ id: id, word: g.word, art: g.art, img: im, shade: shade, glow: glow, x: g.x, y: g.y });
    });
    drawBag();
  }
  function takeGather(sc, g) {
    if (root.WorldGame && root.WorldGame.getEnergy() < 5) {
      panel(FLAT + 'i_energy', 'Low Energy!', 'Answer 3 quick English questions for +30 ⚡ Energy!', 'Charge ⚡', function () { root.WorldGame.openEnergyCharge('Charge +30 ⚡ Energy to keep gathering!'); });
      say('Charge your energy first!');
      return false;
    }
    if (root.WorldGame) root.WorldGame.useEnergy(5);
    var b = readBag(); b.items[g.word] = (Number(b.items[g.word]) || 0) + 1; b.taken[g.id] = 1; writeBag(b);
    sound('playCorrect'); say(g.word); cheer(sc.player, 420);
    var matEmojis = { wood: '🪵', stone: '🪨', flower: '🌸', shell: '🐚', berry: '🫐', crystal: '💎' };
    showWorldFloat(sc, g.x, g.y - 30, '+1 ' + (g.word.charAt(0).toUpperCase() + g.word.slice(1)) + ' ' + (matEmojis[g.word] || '✨'), '#fde047'); sc.fx.explode(12, g.x, g.y - 20); g.glow.destroy(); g.shade.destroy();
    sc.tweens.add({ targets: g.img, angle: { from: -12, to: 12 }, duration: 70, yoyo: true, repeat: 2, onComplete: function () { g.img.destroy(); } });
    var cam = sc.cameras.main, slot = document.querySelector('.w-bag-item[data-word="' + g.word + '"]'), fly = document.createElement('img');
    fly.src = artUrl(g.art); fly.className = 'w-fly';
    fly.style.left = (g.x - cam.worldView.x) * cam.zoom + 'px'; fly.style.top = (g.y - 40 - cam.worldView.y) * cam.zoom + 'px';
    document.body.appendChild(fly);
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (slot) { var r = slot.getBoundingClientRect(); fly.style.left = r.left + 'px'; fly.style.top = r.top + 'px'; fly.style.transform = 'scale(.5)'; } }); });
    setTimeout(function () { fly.remove(); drawBag(); var s2 = document.querySelector('.w-bag-item[data-word="' + g.word + '"]'); if (s2) { s2.classList.add('pop'); setTimeout(function () { s2.classList.remove('pop'); }, 300); } }, 620);
    return true;
  }
  function showWorldFloat(sc, x, y, text, color) {
    var cam = sc && sc.cameras ? sc.cameras.main : null;
    if (!cam) return;
    var pop = document.createElement('div');
    pop.className = 'w-world-float';
    if (color) pop.style.color = color;
    pop.textContent = text;
    pop.style.left = Math.round((x - cam.worldView.x) * cam.zoom) + 'px';
    pop.style.top = Math.round((y - cam.worldView.y) * cam.zoom) + 'px';
    document.body.appendChild(pop);
    setTimeout(function () { if (pop.parentNode) pop.parentNode.removeChild(pop); }, 900);
  }

  function makeSmallTextures(sc) {
    if (sc.textures.exists('dot')) return;
    var t = sc.textures.createCanvas('dot', 24, 24), c = t.context, g = c.createRadialGradient(12, 12, 1, 12, 12, 12);
    g.addColorStop(0, '#fff'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, 24, 24); t.refresh();
    var s = sc.textures.createCanvas('shadow', 100, 40); c = s.context;
    c.fillStyle = 'rgba(35,70,20,.3)'; c.beginPath(); c.ellipse(50, 20, 46, 17, 0, 0, 7); c.fill(); s.refresh();
    var ar = sc.textures.createCanvas('arrow', 64, 64), ax = ar.context; ax.lineJoin = 'round'; ax.lineCap = 'round'; ax.beginPath(); ax.moveTo(22, 8); ax.lineTo(42, 8); ax.lineTo(42, 30); ax.lineTo(54, 30); ax.lineTo(32, 56); ax.lineTo(10, 30); ax.lineTo(22, 30); ax.closePath(); ax.fillStyle = '#fde047'; ax.fill(); ax.lineWidth = 5; ax.strokeStyle = '#2b2140'; ax.stroke(); ax.beginPath(); ax.moveTo(26, 13); ax.lineTo(38, 13); ax.lineTo(38, 32); ax.lineTo(45, 32); ax.lineTo(32, 48); ax.lineTo(19, 32); ax.lineTo(26, 32); ax.closePath(); ax.fillStyle = '#f59e0b'; ax.fill(); ar.refresh();
    [['disc', '#334155'], ['disc_done', '#10b981'], ['disc_next', '#f59e0b']].forEach(function (d) {
      var b = sc.textures.createCanvas(d[0], 76, 76), x = b.context;
      x.fillStyle = '#fff'; x.beginPath(); x.arc(38, 38, 36, 0, 7); x.fill(); x.fillStyle = d[1]; x.beginPath(); x.arc(38, 38, 30, 0, 7); x.fill(); b.refresh();
    });
  }

  /* ---------- the pupil's own monster as ready-made pictures ---------- */
  function monsterLook() {
    var s = ses(), prof = (s.student && s.student.monsterProfile) || {}, thr = root.EAA_EVOLUTION_XP || [0, 30, 200, 500, 1000, 2000, 3500], xp = 0;
    try { xp = App().getEffectiveXP(); } catch (e) { xp = Number(s.student && s.student.xp) || 0; }
    var lvl = 1; thr.forEach(function (t, i) { if (xp >= t) lvl = i + 1; });
    return { stage: STAGES[Math.max(0, Math.min(6, lvl - 1))], color: prof.baseColor || 'blue', equipped: Object.assign({}, prof.equipped || {}, (s.doc && s.doc.look) || {}) };
  }
  function loadImg(url) { return new Promise(function (ok, no) { var i = new Image(); i.onload = function () { ok(i); }; i.onerror = no; i.src = url; }); }
  // the monster keeps its own look, but gets the flat cartoon treatment: fewer shades and a dark outline
  function drawCartoon(c, img, x0) {
    var fc = document.createElement('canvas'); fc.width = fc.height = FRAME;
    var fx = fc.getContext('2d'); fx.drawImage(img, 0, 0, FRAME, FRAME);
    try {
      var d = fx.getImageData(0, 0, FRAME, FRAME), px = d.data, L = 8;
      for (var i = 0; i < px.length; i += 4) {
        if (!px[i + 3]) continue;
        var v = Math.max(px[i], px[i + 1], px[i + 2]); if (!v) continue;
        var k = Math.min(255, Math.round(v / 255 * L + .15) / L * 255) / v;
        px[i] = Math.min(255, px[i] * k); px[i + 1] = Math.min(255, px[i + 1] * k); px[i + 2] = Math.min(255, px[i + 2] * k);
      }
      fx.putImageData(d, 0, 0);
    } catch (e) { /* this browser will not let us read the picture: keep the shading as it is */ }
    var sil = document.createElement('canvas'); sil.width = sil.height = FRAME;
    var sx = sil.getContext('2d'); sx.drawImage(fc, 0, 0); sx.globalCompositeOperation = 'source-in'; sx.fillStyle = '#2b2140'; sx.fillRect(0, 0, FRAME, FRAME);
    for (var a = 0; a < 12; a++) c.drawImage(sil, x0 + Math.cos(a / 12 * 6.283) * 3.4, Math.sin(a / 12 * 6.283) * 3.4);
    c.drawImage(fc, x0, 0);
  }
  async function bakeMonster(sc, key, opts) {
    var eq = Object.assign({}, opts.equipped || {}); delete eq.background; delete eq.aura;
    var markup = root.MonsterRenderer.renderMonsterSVG({ stage: opts.stage, color: opts.color, equipped: eq, size: FRAME, animated: false, isAvatar: true });
    var base = new DOMParser().parseFromString(markup, 'image/svg+xml').documentElement;
    ['.monster-pedestal-stage', '.mon-rig-shadow'].forEach(function (q) { var el = base.querySelector(q); if (el) el.remove(); });
    var feet = base.querySelector('.plush-feet');
    if (feet && feet.children.length >= 10) {
      var kids = [].slice.call(feet.children), half = kids.length / 2, NS = 'http://www.w3.org/2000/svg', l = document.createElementNS(NS, 'g'), r = document.createElementNS(NS, 'g');
      l.setAttribute('class', 'foot-l'); r.setAttribute('class', 'foot-r');
      kids.forEach(function (k, i) { (i < half ? l : r).appendChild(k); });
      feet.appendChild(l); feet.appendChild(r);
    }
    var poses = [{ bob: 0 }, { bob: -3, l: -7, armL: 14, armR: 14 }, { bob: 0 }, { bob: -3, r: -7, armL: -14, armR: -14 }, { bob: 0 }, { bob: -2, armL: 150, armR: -150 }];
    var canvas = document.createElement('canvas'); canvas.width = FRAME * poses.length; canvas.height = FRAME;
    var c = canvas.getContext('2d'), ser = new XMLSerializer();
    for (var i = 0; i < poses.length; i++) {
      var p = poses[i], svg = base.cloneNode(true);
      var set = function (q, tr, css) { [].forEach.call(svg.querySelectorAll(q), function (el) { if (css) el.style.transform = tr; else el.setAttribute('transform', tr); }); };
      set('.monster-bob-group', 'translate(0 ' + p.bob + ')');
      if (p.l) set('.foot-l', 'translate(0 ' + p.l + ')');
      if (p.r) set('.foot-r', 'translate(0 ' + p.r + ')');
      if (p.armL) set('.mon-arm-l', 'rotate(' + p.armL + 'deg)', true);
      if (p.armR) set('.mon-arm-r', 'rotate(' + p.armR + 'deg)', true);
      svg.setAttribute('width', FRAME); svg.setAttribute('height', FRAME);
      var url = URL.createObjectURL(new Blob([ser.serializeToString(svg)], { type: 'image/svg+xml' }));
      var img = await loadImg(url);
      drawCartoon(c, img, FRAME * i);
      URL.revokeObjectURL(url);
    }
    if (sc.textures.exists(key)) { sc.anims.remove(key + '-walk'); sc.textures.remove(key); }
    var tex = sc.textures.addCanvas(key, canvas);
    poses.forEach(function (_, n) { tex.add(n, 0, FRAME * n, 0, FRAME, FRAME); });
    sc.anims.create({ key: key + '-walk', frames: [1, 2, 3, 4].map(function (f) { return { key: key, frame: f }; }), frameRate: 9, repeat: -1 });
    if (key === 'me') S.lookStamp = JSON.stringify(opts);
  }
  function syncRide(sc, m) {
    if (!m || m.monKey !== 'me') return;
    var eq = monsterLook().equipped || {}, rid = eq.ride && String(eq.ride).indexOf('r_') === 0 ? FLAT + eq.ride : null;
    if (!rid) {
      if (m.ride) m.ride.setVisible(false);
      return;
    }
    var apply = function () {
      if (!m.active) return;
      if (!m.ride) m.ride = sc.add.image(m.x, m.y, rid).setOrigin(.5, .82);
      else m.ride.setTexture(rid).setVisible(true);
      m.ride.setScale(125 / m.ride.height);
    };
    if (sc.textures.exists(rid)) apply();
    else { sc.load.image(rid, artUrl(rid)); sc.load.once('complete', apply); sc.load.start(); }
  }
  function makeWalker(sc, key, x, y, scale) {
    var shadow = sc.add.image(x, y, 'shadow').setScale(scale * 1.15).setDepth(-5);
    var m = sc.physics.add.sprite(x, y, key, 0).setOrigin(.5, .84).setScale(scale).setVisible(false);
    m.body.setCircle(44, FRAME / 2 - 44, FRAME * .84 - 44);
    m.setCollideWorldBounds(true); m.monKey = key; m.shadow = shadow; m.baseScale = scale;
    // what you see is this copy: the body underneath does the physics, so hopping never changes where the monster really is
    m.skin = sc.add.sprite(x, y, key, 0).setOrigin(.5, .84).setScale(scale); m.walkPhase = Math.random() * 6; m.turn = 1; m.pace = 0;
    if (key === 'me') syncRide(sc, m);
    return m;
  }
  // a trail follows the monster while it walks (cosmetic only; it gives no XP or advantage)
  var TRAILS = { 'cs-tr-sparkle': ['✨', 180, .5], 'cs-tr-hearts': ['💖', 200, .5], 'cs-tr-bubbles': ['🫧', 170, .6], 'cs-tr-flames': ['🔥', 110, .7], 'cs-tr-rainbow': ['🌈', 150, .8], 'cs-tr-comet': ['☄️', 90, .8] };
  function trailKey(sc, emoji) {
    var key = 'trail_' + emoji;
    if (!sc.textures.exists(key)) { var t = sc.textures.createCanvas(key, 64, 64), c = t.context; c.font = '48px serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(emoji, 32, 34); t.refresh(); }
    return key;
  }
  function dropTrail(sc, m, delta) {
    var eq = monsterLook().equipped || {}, tr = TRAILS[eq.trail];
    if (!tr || !m.body) return;
    S.trailAt = (S.trailAt || 0) + delta;
    if (S.trailAt < tr[1] || (Math.abs(m.body.velocity.x) + Math.abs(m.body.velocity.y)) < 60) return;
    S.trailAt = 0;
    var p = sc.add.image(m.x + (Math.random() - .5) * 34, m.y - 6 - Math.random() * 26, trailKey(sc, tr[0])).setDepth(m.y - 2).setScale(tr[2]).setAlpha(.95);
    sc.tweens.add({ targets: p, y: p.y - 34, alpha: 0, scale: tr[2] * .45, angle: (Math.random() - .5) * 60, duration: 900, onComplete: function () { p.destroy(); } });
  }
  function moveSkin(m, delta, time) {
    var sk = m.skin, vx = m.body.velocity.x, vy = m.body.velocity.y, v = Math.sqrt(vx * vx + vy * vy), target = Math.min(1, v / 200);
    m.pace += (target - m.pace) * Math.min(1, delta * .012);
    m.walkPhase += delta * .0035 * (.4 + v / 90);
    m.turn += ((m.flipX ? -1 : 1) - m.turn) * Math.min(1, delta * .016);
    var hop = Math.abs(Math.sin(m.walkPhase)) * 15 * m.pace, sq = Math.cos(m.walkPhase * 2) * .055 * m.pace, breathe = Math.sin(time * .0026 + m.walkPhase) * .016 * (1 - m.pace);
    if (sk.texture !== m.texture) sk.setTexture(m.texture.key, m.frame.name); else if (sk.frame.name !== m.frame.name) sk.setFrame(m.frame.name);
    var onRide = !!(m.ride && m.ride.visible);
    sk.setPosition(m.x, m.y - hop - (onRide ? 24 : 0));
    sk.setScale(m.baseScale * (1 - sq * .6 - breathe) * (Math.abs(m.turn) < .18 ? .18 : Math.abs(m.turn)), m.baseScale * (1 + sq + breathe));
    sk.setFlipX(m.turn < 0);
    sk.rotation = (Math.sin(m.walkPhase) * .085 * m.pace) + (vx / 250) * .07;
    sk.setDepth(m.y + 1);
    if (onRide) {
      m.ride.setPosition(m.x, m.y - hop * .55 + 8);
      m.ride.setFlipX(m.turn < 0);
      m.ride.setDepth(m.y);
    }
    m.shadow.setPosition(m.x, m.y + 2); m.shadow.setScale(m.baseScale * (onRide ? 1.45 : 1.15) * (1 - hop * .014), m.baseScale * 1.15 * (1 - hop * .014));
  }

  /* ---------- finding the way ---------- */
  function buildGrid(sc, zone) {
    var cols = Math.ceil(W / CELL), rows = Math.ceil(H / CELL), g = [], r, c;
    for (r = 0; r < rows; r++) { g[r] = []; for (c = 0; c < cols; c++) { var cx = c * CELL + CELL / 2, cy = r * CELL + CELL / 2; g[r][c] = zone.blocked(cx, cy) || zone.blocked(cx - 18, cy) || zone.blocked(cx + 18, cy) || zone.blocked(cx, cy - 18) || zone.blocked(cx, cy + 18) ? 1 : 0; } }
    sc.solids.forEach(function (z) {
      var pad = 26, x0 = Math.floor((z.x - z.width / 2 - pad) / CELL), x1 = Math.floor((z.x + z.width / 2 + pad) / CELL), y0 = Math.floor((z.y - z.height / 2 - pad) / CELL), y1 = Math.floor((z.y + z.height / 2 + pad) / CELL);
      for (var a = Math.max(0, y0); a <= Math.min(rows - 1, y1); a++) for (var b = Math.max(0, x0); b <= Math.min(cols - 1, x1); b++) g[a][b] = 1;
    });
    return { g: g, cols: cols, rows: rows };
  }
  function nearestFree(G, c, r) {
    if (G.g[r] && G.g[r][c] === 0) return [c, r];
    for (var d = 1; d < 16; d++) for (var dy = -d; dy <= d; dy++) for (var dx = -d; dx <= d; dx++) { if (G.g[r + dy] && G.g[r + dy][c + dx] === 0) return [c + dx, r + dy]; }
    return null;
  }
  function findPath(G, sx, sy, tx, ty) {
    var cc = function (v) { return Math.max(0, Math.min(G.cols - 1, Math.floor(v / CELL))); }, cr = function (v) { return Math.max(0, Math.min(G.rows - 1, Math.floor(v / CELL))); };
    var a = nearestFree(G, cc(sx), cr(sy)), b = nearestFree(G, cc(tx), cr(ty));
    if (!a || !b) return [];
    var id = function (c, r) { return r * G.cols + c; }, came = {}, cost = {}, open = [[0, a[0], a[1]]], start = id(a[0], a[1]), goal = id(b[0], b[1]);
    cost[start] = 0;
    while (open.length) {
      var best = 0; for (var o = 1; o < open.length; o++) if (open[o][0] < open[best][0]) best = o;
      var cur = open.splice(best, 1)[0], cid = id(cur[1], cur[2]);
      if (cid === goal) break;
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        var nc = cur[1] + dx, nr = cur[2] + dy;
        if (!G.g[nr] || G.g[nr][nc] !== 0) continue;
        if (dx && dy && (G.g[cur[2]][nc] !== 0 || G.g[nr][cur[1]] !== 0)) continue;
        var nid = id(nc, nr), n = cost[cid] + (dx && dy ? 1.414 : 1);
        if (cost[nid] === undefined || n < cost[nid]) { cost[nid] = n; came[nid] = cid; open.push([n + Math.abs(nc - b[0]) + Math.abs(nr - b[1]), nc, nr]); }
      }
    }
    if (cost[goal] === undefined) return [];
    var out = [], step = goal;
    while (step !== start) { out.unshift({ x: (step % G.cols) * CELL + CELL / 2, y: Math.floor(step / G.cols) * CELL + CELL / 2 }); step = came[step]; }
    return out.filter(function (_, i) { return i % 2 === 1 || i === out.length - 1; });
  }
  function stopWalking() { S.path = []; S.onArrive = null; if (scene && scene.player && scene.player.body) scene.player.setVelocity(0); }
  function walkTo(x, y, onArrive) {
    var sc = scene, m = sc.player;
    S.path = findPath(sc.grid, m.x, m.y, x, y); S.onArrive = onArrive || null; S.stuck = 0;
    if (!S.path.length && onArrive) { S.onArrive = null; onArrive(); }
  }

  /* ---------- the panel: what can be done here ---------- */
  function panel(face, title, line, label, act) {
    $('w-face').src = 'art/' + face + '.webp';
    $('w-line').innerHTML = (title ? '<b>' + title + '</b>' : '') + line;
    $('w-next').textContent = label; $('w-next').onclick = function () { sound('playTap'); hidePanel(); act(); };
    $('w-talk').classList.add('on'); document.body.classList.add('w-talking');
  }
  function hidePanel() { $('w-talk').classList.remove('on'); document.body.classList.remove('w-talking'); }
  function setGoal() {
    var z = S.zone;
    if (S.moveMode && z === 0) {
      $('w-goal').innerHTML = '✋ Move Items Mode<small>Tap a furniture item, then tap where to place it!</small>';
      return;
    }
    if ($('w-decor')) $('w-decor').style.display = (z === 0) ? 'inline-flex' : 'none';
    if (z === 0) {
      var st = root.WorldGame ? root.WorldGame.readState() : { houseTier: 1, placed: [] };
      var tier = (root.WorldGame && root.WorldGame.HOUSE_TIERS[(st.houseTier || 1) - 1]) || { name: 'Cosy Tent' };
      $('w-goal').innerHTML = '🏡 My Home Island · ' + tier.name + '<small>Tap Decorate or the Workbench to build!</small>';
      return;
    }
    var ms = missions(z).regular, done = ms.filter(function (m) { return starsOf(m.id) > 0; }).length, total = ms.reduce(function (a, m) { return a + starsOf(m.id); }, 0);
    var tip = done < 5 ? 'Walk to the glowing stop!' : (chestOpened(z) ? 'Next place: follow the arrow!' : 'Open the treasure!');
    $('w-goal').innerHTML = zoneName(z) + ' · ⭐ ' + total + '<small>' + tip + '</small>';
  }

  /* ---------- Home Island (Zone 0): House, Workbench & Placeable Furniture ---------- */
  function buildHome(sc) {
    sc.homeObjs = [];
    sc.placedSprites = [];
    if (S.zone !== 0 || !root.WorldGame) return;
    var st = root.WorldGame.readState();
    var tier = root.WorldGame.HOUSE_TIERS[Math.max(0, Math.min(root.WorldGame.HOUSE_TIERS.length - 1, (st.houseTier || 1) - 1))];
    var hImg = sc.add.image(1120, 580, FLAT + tier.id).setOrigin(.5, .96).setDepth(580);
    hImg.setScale(370 / hImg.height);
    var hShadow = sc.add.image(1120, 580, 'shadow').setScale(2.8, 1.8).setDepth(-6);
    sc.houseSpot = { kind: 'house', img: hImg, shadow: hShadow, x: 1120, y: 580, def: { h: 370, sw: 240 } };

    var wbImg = sc.add.image(800, 640, FLAT + 'o_workbench').setOrigin(.5, .96).setDepth(640);
    wbImg.setScale(155 / wbImg.height);
    sc.add.image(800, 640, 'shadow').setScale(1.6).setDepth(-6);
    sc.workbenchSpot = { kind: 'workbench', img: wbImg, x: 800, y: 640, def: { h: 155, sw: 120 } };
    sc.homeObjs.push(sc.houseSpot, sc.workbenchSpot);
    renderPlacedFurniture(sc);
  }
  function renderPlacedFurniture(sc) {
    if (!sc || S.zone !== 0 || !root.WorldGame) return;
    (sc.placedSprites || []).forEach(function (o) { if (o.img) o.img.destroy(); if (o.shadow) o.shadow.destroy(); });
    sc.placedSprites = [];
    var st = root.WorldGame.readState();
    (st.placed || []).forEach(function (p, idx) {
      var rec = root.WorldGame.RECIPES.filter(function (r) { return r.id === p.id; })[0];
      if (!rec) return;
      var artKey = FLAT + rec.id;
      var buildOne = function () {
        var im = sc.add.image(p.x, p.y, artKey).setOrigin(.5, .95).setDepth(rec.flat ? -4 : p.y);
        im.setScale((rec.h || 110) / im.height);
        var sh = !rec.flat ? sc.add.image(p.x, p.y, 'shadow').setScale(1.1).setDepth(-6) : null;
        sc.placedSprites.push({ idx: idx, id: p.id, name: rec.name, img: im, shadow: sh, x: p.x, y: p.y, h: rec.h || 110 });
      };
      if (sc.textures.exists(artKey)) buildOne();
      else { sc.load.image(artKey, artUrl(artKey)); sc.load.once('complete', buildOne); sc.load.start(); }
    });
  }
  function refreshHome(celebrate) {
    var sc = scene;
    if (!sc || S.zone !== 0 || !root.WorldGame) return;
    var st = root.WorldGame.readState();
    var tier = root.WorldGame.HOUSE_TIERS[Math.max(0, Math.min(root.WorldGame.HOUSE_TIERS.length - 1, (st.houseTier || 1) - 1))];
    if (sc.houseSpot && sc.houseSpot.img) {
      sc.houseSpot.img.setTexture(FLAT + tier.id);
      sc.houseSpot.img.setScale(370 / sc.houseSpot.img.height);
      if (celebrate) partyAt(sc.houseSpot.x, sc.houseSpot.y - 160);
    }
    renderPlacedFurniture(sc);
    setGoal();
  }
  function openDecorDock(focusId) {
    if (S.zone !== 0 || !root.WorldGame) return;
    S.moveMode = true;
    S.movingIdx = -1;
    var dock = $('w-decor-dock'), tray = $('w-dd-tray');
    if (!dock || !tray) return;
    dock.classList.add('on');
    setGoal();
    renderDecorTray(focusId);
    say('Tap an item to place or move it!');
  }

  function closeDecorDock(noSound) {
    var dock = $('w-decor-dock');
    if (dock) dock.classList.remove('on');
    S.moveMode = false;
    S.movingIdx = -1;
    if (!noSound) sound('playTap');
    setGoal();
    if (scene) {
      if (scene.ghostDecor) { scene.ghostDecor.destroy(); scene.ghostDecor = null; }
      renderPlacedFurniture(scene);
    }
  }

  function renderDecorTray(activeId) {
    var tray = $('w-dd-tray'); if (!tray || !root.WorldGame) return;
    var st = root.WorldGame.readState();
    var cards = root.WorldGame.RECIPES.map(function (r) {
      var owned = Number((st.ownedFurniture || {})[r.id]) || 0;
      var placed = (st.placed || []).filter(function (p) { return p.id === r.id; }).length;
      var avail = Math.max(0, owned - placed);
      if (owned === 0 && placed === 0) return '';
      var isAct = (activeId === r.id) || (S.movingIdx >= 0 && st.placed[S.movingIdx] && st.placed[S.movingIdx].id === r.id);
      return '<button type="button" class="w-dd-card' + (isAct ? ' active' : '') + '" data-id="' + r.id + '" onclick="WORLD.selectDecorCard(\'' + r.id + '\')">' +
        '<img src="' + FLAT + r.id + '.webp" alt="">' +
        '<span>' + esc(r.name) + '</span>' +
        '<em>' + (avail > 0 ? '+' + avail + ' in bag' : '✓ placed (' + placed + ')') + '</em>' +
      '</button>';
    }).join('');
    tray.innerHTML = cards || '<div style="color:#94a3b8;font-size:13px;padding:8px">Craft furniture in the Workshop first!</div>';
  }

  function selectDecorCard(id) {
    sound('playTap');
    var st = root.WorldGame.readState();
    var owned = Number((st.ownedFurniture || {})[id]) || 0;
    var placedIndices = [];
    (st.placed || []).forEach(function (p, idx) { if (p.id === id) placedIndices.push(idx); });
    if (owned > placedIndices.length) {
      var rec = root.WorldGame.RECIPES.filter(function (r) { return r.id === id; })[0];
      var newPos = rec ? rec.defPos : { x: 1200, y: 800 };
      st.placed.push({ id: id, x: newPos.x, y: newPos.y, flip: false });
      root.WorldGame.writeState(st);
      S.movingIdx = st.placed.length - 1;
      renderPlacedFurniture(scene);
    } else if (placedIndices.length > 0) {
      S.movingIdx = placedIndices[0];
    }
    renderDecorTray(id);
    var target = st.placed[S.movingIdx];
    if (target && scene && scene.cameras && scene.cameras.main) {
      scene.cameras.main.pan(target.x, target.y, 350, 'Power2');
    }
    $('w-goal').innerHTML = '✋ Tap on the yard or veranda to drop it!<small>Use [↔ Flip] or [📥 Put in Bag] below</small>';
  }

  function flipDecor() {
    if (S.movingIdx < 0 || !root.WorldGame) return;
    var st = root.WorldGame.readState();
    if (st.placed && st.placed[S.movingIdx]) {
      st.placed[S.movingIdx].flip = !st.placed[S.movingIdx].flip;
      root.WorldGame.writeState(st);
      sound('playPop');
      renderPlacedFurniture(scene);
    }
  }

  function putAwayDecor() {
    if (S.movingIdx < 0 || !root.WorldGame) return;
    var st = root.WorldGame.readState();
    if (st.placed && st.placed[S.movingIdx]) {
      var item = st.placed.splice(S.movingIdx, 1)[0];
      root.WorldGame.writeState(st);
      sound('playCorrect');
      say('Stored in bag!');
      S.movingIdx = -1;
      renderPlacedFurniture(scene);
      renderDecorTray(item.id);
      $('w-goal').innerHTML = '🏡 My Home Island<small>Tap an item to decorate!</small>';
    }
  }

  function setMoveMode(on) {
    if (on) openDecorDock();
    else closeDecorDock();
  }

  /* ---------- Villagers & Friendly Battles (Zones 1–4) ---------- */
  function buildVillagers(sc) {
    sc.villagers = [];
    if (!root.WorldGame) return;
    var st = root.WorldGame.readState();
    root.WorldGame.VILLAGERS.forEach(function (v) {
      if (v.zone !== S.zone) return;
      var done = !!(st.jobsDone && st.jobsDone[v.id]);
      var img = sc.add.image(v.x, v.y, FLAT + (done ? v.happy : v.art)).setOrigin(.5, .95).setDepth(v.y);
      img.setScale(165 / img.height);
      sc.add.image(v.x, v.y, 'shadow').setScale(1.4).setDepth(-6);
      var mark = sc.add.image(v.x, v.y - 185, FLAT + 'v_mark').setOrigin(.5).setDepth(4505);
      mark.setScale(52 / mark.height).setVisible(!done);
      sc.tweens.add({ targets: mark, y: v.y - 198, duration: 520, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      sc.villagers.push({ kind: 'villager', v: v, img: img, mark: mark, x: v.x, y: v.y, def: { h: 165, sw: 90 } });
    });
  }
  function refreshVillagers(vid) {
    var sc = scene; if (!sc || !sc.villagers || !root.WorldGame) return;
    var st = root.WorldGame.readState();
    sc.villagers.forEach(function (vo) {
      var done = !!(st.jobsDone && st.jobsDone[vo.v.id]);
      vo.img.setTexture(FLAT + (done ? vo.v.happy : vo.v.art));
      vo.mark.setVisible(!done);
      if (vid === vo.v.id && done) partyAt(vo.x, vo.y - 80);
    });
  }
  function buildBattles(sc) {
    sc.battles = [];
    if (!root.WorldGame) return;
    var st = root.WorldGame.readState();
    root.WorldGame.BATTLES.forEach(function (b) {
      if (b.zone !== S.zone) return;
      var won = !!(st.battlesWon && st.battlesWon[b.id]);
      var ring = sc.add.circle(b.x, b.y - 6, 48, won ? 0x10b981 : 0xf43f5e, .28).setDepth(-6);
      var img = sc.add.image(b.x, b.y, FLAT + b.art).setOrigin(.5, .94).setDepth(b.y);
      img.setScale((b.h || 140) / img.height);
      sc.add.image(b.x, b.y, 'shadow').setScale(1.5).setDepth(-6);
      sc.tweens.add({ targets: img, y: b.y - 10, duration: 850, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      sc.battles.push({ kind: 'battle', b: b, img: img, ring: ring, x: b.x, y: b.y, def: { h: b.h || 140, sw: 100 } });
    });
  }
  function refreshBattles(bid) {
    var sc = scene; if (!sc || !sc.battles || !root.WorldGame) return;
    var st = root.WorldGame.readState();
    sc.battles.forEach(function (bo) {
      var won = !!(st.battlesWon && st.battlesWon[bo.b.id]);
      bo.ring.setFillStyle(won ? 0x10b981 : 0xf43f5e, .28);
      if (bid === bo.b.id && won) partyAt(bo.x, bo.y - 70);
    });
  }

  /* ---------- stops ---------- */
  function solid(sc, x, y, w, h) { var z = sc.add.zone(x, y, w, h); sc.physics.add.existing(z, true); sc.solidGroup.add(z); sc.solids.push(z); return z; }
  function buildStops(sc, zone) {
    var ms = missions(S.zone);
    sc.stops = ms.regular.map(function (m, i) {
      var d = zone.stops[i], plot = root.IslandStory.plotOf(m.id) || m;
      var img = sc.add.image(d.x, d.y, d.art).setOrigin(.5, .96);
      img.setScale(d.h / img.height).setDepth(d.y);
      sc.add.image(d.x, d.y, 'shadow').setScale(Math.max(1, d.h / 110)).setDepth(-6);
      if (d.sw) solid(sc, d.x, d.y - 26, d.sw, 30);
      var badgeY = d.y - d.h - 38;
      var disc = sc.add.image(d.x, badgeY, 'disc').setDepth(4500).setScale(.8);
      var num = sc.add.text(d.x, badgeY, String(i + 1), { fontFamily: 'Fredoka, sans-serif', fontSize: '30px', fontStyle: '700', color: '#fff' }).setOrigin(.5).setDepth(4501);
      var st = sc.add.text(d.x, badgeY + 40, '', { fontFamily: 'Fredoka, sans-serif', fontSize: '22px', color: '#fde047', stroke: '#1e293b', strokeThickness: 4 }).setOrigin(.5).setDepth(4501);
      return { kind: 'mission', mission: m, plot: plot, def: d, img: img, disc: disc, num: num, starsText: st, x: d.x, y: d.y };
    });
    if (zone.chest) {
      var cd = zone.chest;
      var chest = sc.add.image(cd.x, cd.y, chestOpened(S.zone) ? FLAT + 'o_chest_open' : (cd.art || FLAT + 'o_chest')).setOrigin(.5, .96).setDepth(cd.y);
      chest.setScale(150 / chest.height); sc.add.image(cd.x, cd.y, 'shadow').setScale(1.6).setDepth(-6);
      sc.chest = { kind: 'chest', img: chest, x: cd.x, y: cd.y };
    } else {
      sc.chest = null;
    }
    // the daily gift, near where a pupil comes in
    var gift = sc.add.image(170, 1120, FLAT + 'o_gift').setOrigin(.5, .96).setDepth(1120); gift.setScale(100 / gift.height);
    sc.gift = { kind: 'gift', img: gift, x: 170, y: 1120 };
    sc.tweens.add({ targets: gift, y: 1110, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    // Star Path stones: only ever built for a pupil on the Star Path
    sc.stones = [];
    (ms.star || []).forEach(function (sm, i) {
      var x = (zone.stoneX || 780) + i * 105, y = zone.stoneY || 1340, st = sc.add.image(x, y, FLAT + 'o_star_path').setOrigin(.5, .9).setDepth(2100); st.setScale(74 / st.height);
      sc.add.text(x, y - 28, String(sm.num), { fontFamily: 'Fredoka, sans-serif', fontSize: '22px', fontStyle: '700', color: '#451a03' }).setOrigin(.5).setDepth(2101);
      var sst = sc.add.text(x, y + 6, '', { fontFamily: 'Fredoka, sans-serif', fontSize: '16px', color: '#fde047', stroke: '#1e293b', strokeThickness: 3 }).setOrigin(.5).setDepth(2101);
      sc.stones.push({ kind: 'star', mission: sm, img: st, starsText: sst, x: x, y: y });
    });
    sc.arrow = sc.add.image(0, 0, 'arrow').setOrigin(.5).setDepth(4600);
    sc.ring = sc.add.circle(0, 0, 44, 0xfde047, .32).setDepth(-7);
    sc.tweens.add({ targets: sc.arrow, scale: 1.2, duration: 450, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    sc.tweens.add({ targets: sc.ring, scale: 1.7, alpha: .1, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }
  function refreshStops(celebrate) {
    var sc = scene; if (!sc || !sc.stops) return;
    if (S.zone === 0) {
      sc.arrow.setVisible(true).setPosition(800, 430);
      sc.ring.setVisible(true).setPosition(800, 640);
      if (sc.gateR) sc.gateR.setLock();
      setGoal();
      return;
    }
    var next = null;
    sc.stops.forEach(function (s) {
      var n = starsOf(s.mission.id);
      if (!n && !next) next = s;
      s.disc.setTexture(n ? 'disc_done' : (next === s ? 'disc_next' : 'disc'));
      s.disc.setVisible(next === s); s.num.setVisible(next === s);
      s.starsText.setText(n ? '★'.repeat(n) + '☆'.repeat(3 - n) : '');
      if (n && s.def.done && s.img.texture.key !== s.def.done) { s.img.setTexture(s.def.done); if (celebrate) partyAt(s.x, s.y - s.def.h / 2); }
    });
    var chestReady = !next && sc.chest && !chestOpened(S.zone);
    if (sc.chest) sc.chest.img.setTexture(chestOpened(S.zone) ? FLAT + 'o_chest_open' : (ZONES[S.zone].chest.art || FLAT + 'o_chest'));
    (sc.stones || []).forEach(function (st) { var sn = starsOf(st.mission.id); if (st.starsText) st.starsText.setText(sn ? '★'.repeat(sn) : ''); });
    var t = next || (chestReady ? sc.chest : null);
    S.target = t;
    if (t) { var top = t.def ? t.def.y - t.def.h - 110 : t.y - 210; sc.arrow.setVisible(true).setPosition(t.x, top); sc.ring.setVisible(true).setPosition(t.x, t.y); }
    else { sc.arrow.setVisible(false); sc.ring.setVisible(false); }
    setHelperMood(sc, next);
    if (sc.gateR) sc.gateR.setLock();
    setGoal();
  }
  function helperArt() { return (scene && scene.npcSpot && scene.npcSpot.art) || ZONES[S.zone].npc.art; }
  function setHelperMood(sc, next) {
    var n = ZONES[S.zone].npc; if (!n.worried) return;
    var art = !next ? n.happy : (next === sc.stops[0] ? n.worried : n.art);
    if (sc.npcSpot.art !== art) { sc.npcSpot.art = art; sc.npcSpot.img.setTexture(art); }
  }
  function partyAt(x, y) { var sc = scene; sc.party.explode(60, x, y); sc.cameras.main.shake(220, .004); sound('playFanfare'); if (sc.player) cheer(sc.player, 1400); }
  function cheer(m, ms) {
    m.anims.stop(); m.setFrame(5); m.cheering = true;
    scene.time.delayedCall(ms || 900, function () { if (m.active) { m.cheering = false; m.setFrame(0); } });
  }

  /* What the pupil can do where they are standing */
  function interactables(sc) {
    var list = (sc.stops || []).concat([sc.gift, sc.npcSpot], sc.stones || [], sc.homeObjs || [], sc.villagers || [], sc.battles || []);
    if (sc.chest) list.push(sc.chest);
    return list.filter(Boolean);
  }
  function openThing(t) {
    var z = S.zone;
    if (t.kind === 'mission') {
      var n = starsOf(t.mission.id);
      panel(helperArt(), t.plot.title, n ? '★'.repeat(n) + ' Play again?' : 'Can you help me?', 'Play ▶', function () { App().tapPin(t.mission.id, z, false, null); });
      say(t.plot.title);
    } else if (t.kind === 'star') {
      panel(FLAT + 'o_star_path', t.mission.title, 'A star mission!', 'Play ▶', function () { App().tapPin(t.mission.id, z, true, null); });
    } else if (t.kind === 'chest') {
      if (chestOpened(z)) panel(FLAT + 'o_chest_open', 'Treasure', 'You opened this one!', 'OK', function () {});
      else if (S.target === scene.chest) panel(FLAT + 'o_chest', 'Treasure', 'Open the treasure!', 'Open 🎁', function () { App().tapChest(z); refreshStops(true); });
      else panel(FLAT + 'o_chest', 'Treasure', 'Finish all 5 stops first!', 'OK', function () {});
    } else if (t.kind === 'gift') {
      panel(FLAT + 'o_gift', "Today's quest", 'Five quick questions!', 'Play ▶', function () { App().startDailyQuest(); });
    } else if (t.kind === 'house') {
      panel(FLAT + 'o_workbench', 'My Home', 'Upgrade your house or craft furniture for your garden!', 'Build 🏰', function () { if (root.WorldGame) root.WorldGame.openWorkshop('home'); });
      say('Let us build your home!');
    } else if (t.kind === 'workbench') {
      panel(FLAT + 'o_workbench', 'Crafting Workbench', 'Use wood, stones, flowers and shells to craft 16 items!', 'Craft 🔨', function () { if (root.WorldGame) root.WorldGame.openWorkshop('craft'); });
      say('What would you like to craft?');
    } else if (t.kind === 'villager') {
      var v = t.v, st = root.WorldGame ? root.WorldGame.readState() : {};
      var done = !!(st.jobsDone && st.jobsDone[v.id]);
      if (done) {
        panel(FLAT + v.happy, v.name, 'Thank you for helping me, friend!', 'Jobs 📋', function () { root.WorldGame.openJobsBoard(); });
        say('Thank you for helping me!');
      } else if (root.WorldGame && root.WorldGame.hasMaterials(v.need)) {
        panel(FLAT + v.happy, v.name, 'You have what I need! Thank you!', 'Give 🎁', function () { root.WorldGame.completeJob(v.id, false); });
        say('You have what I need! Thank you!');
      } else {
        panel(FLAT + v.art, v.name, v.line, 'Jobs 📋', function () { if (root.WorldGame) root.WorldGame.openJobsBoard(); });
        say(v.line);
      }
    } else if (t.kind === 'battle') {
      var b = t.b;
      panel(FLAT + b.art, b.name, 'A friendly monster wants to play! Cast 3 English spells!', 'Battle ⚡', function () { if (root.WorldGame) root.WorldGame.openBattle(b.id); });
      say('A friendly battle with ' + b.name + '!');
    } else if (t.kind === 'npc') {
      if (z === 0) {
        panel(FLAT + 'c_bolt_happy', 'Grandpa Bolt', 'Welcome to your Home Island! Gather wood and stones or tap the Workbench to build!', 'Build 🔨', function () { if (root.WorldGame) root.WorldGame.openWorkshop('craft'); });
        say('Welcome to your Home Island!');
        return;
      }
      var name = root.IslandStory.CHARS[z].name, next = S.target, bag = readBag(), zoneWords = {};
      (ZONES[z].gather || []).forEach(function (g) { zoneWords[g.word] = 1; });
      var countHere = Object.keys(zoneWords).reduce(function (sum, w) { return sum + (Number(bag.items[w]) || 0); }, 0);
      bag.gifted = bag.gifted || {};
      if (countHere >= 3 && !bag.gifted['z' + z]) {
        var giftLine = 'Ooh! You found ' + countHere + ' things for me! Thank you!';
        panel(ZONES[z].npc.happy || helperArt(), name, giftLine, 'Give 🎁', function () {
          bag.gifted['z' + z] = 1; writeBag(bag);
          partyAt(t.x, t.y - 60); say('Thank you so much!');
        });
        say(giftLine);
        return;
      }
      var line = next && next.plot && next.plot.intro ? next.plot.intro[0] : (next ? 'Open the treasure!' : 'Thank you, friend!');
      panel(helperArt(), name, line, 'OK', function () {});
      say(line);
    }
  }
  function onTap(ptr) {
    var sc = scene; if (!sc || !sc.player || S.modal) return;
    var x = ptr.worldX, y = ptr.worldY;
    if (S.moveMode && S.zone === 0 && root.WorldGame) {
      var picked = -1;
      (sc.placedSprites || []).forEach(function (ps) {
        if (Math.abs(x - ps.x) < 70 && y <= ps.y + 16 && y >= ps.y - ps.h - 20) picked = ps.idx;
      });
      if (picked >= 0) {
        S.movingIdx = picked;
        sound('playTap');
        var st = root.WorldGame.readState();
        var item = st.placed && st.placed[picked];
        renderDecorTray(item ? item.id : null);
        $('w-goal').innerHTML = '✋ Moving ' + (item ? item.id : 'item') + '<small>Tap anywhere on the yard or veranda to place it!</small>';
        return;
      }
      if (S.movingIdx >= 0) {
        var st = root.WorldGame.readState();
        if (st.placed && st.placed[S.movingIdx]) {
          st.placed[S.movingIdx].x = Math.round(Math.max(220, Math.min(W - 220, x)));
          st.placed[S.movingIdx].y = Math.round(Math.max(380, Math.min(H - 140, y)));
          root.WorldGame.writeState(st);
          sound('playCorrect');
          sc.dust.explode(10, x, y);
          renderPlacedFurniture(sc);
          renderDecorTray(st.placed[S.movingIdx].id);
        }
        $('w-goal').innerHTML = '✓ Item placed!<small>Tap another item to move, or tap Done</small>';
        return;
      }
    }
    var list = interactables(sc), hit = null, best = 1e9;
    list.forEach(function (t) {
      var h = t.def ? t.def.h : 120, w = t.def ? Math.max(80, t.def.h * .55) : 70;
      if (Math.abs(x - t.x) < w && y < t.y + 30 && y > t.y - h - 60) { var d = Math.abs(x - t.x) + Math.abs(y - t.y); if (d < best) { best = d; hit = t; } }
    });
    if (hit) { hidePanel(); S.near = hit; walkTo(hit.x, hit.y + 54, function () { openThing(hit); }); return; }
    hidePanel(); S.near = null; walkTo(x, y);
  }

  function setupJoystick() {
    if (!(('ontouchstart' in root) || navigator.maxTouchPoints > 0)) return;
    document.body.classList.add('w-touch');
    var pad = $('w-joy'), knob = $('w-knob'), R = 48, active = null;
    var move = function (e) {
      var r = pad.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), len = Math.sqrt(dx * dx + dy * dy) || 1, k = Math.min(1, len / R);
      S.joy.x = dx / len * k; S.joy.y = dy / len * k;
      knob.style.transform = 'translate(' + S.joy.x * R + 'px,' + S.joy.y * R + 'px)';
    };
    pad.addEventListener('pointerdown', function (e) { e.preventDefault(); e.stopPropagation(); active = e.pointerId; pad.setPointerCapture(e.pointerId); stopWalking(); move(e); });
    pad.addEventListener('pointermove', function (e) { if (e.pointerId === active) move(e); });
    var end = function () { active = null; S.joy.x = S.joy.y = 0; knob.style.transform = ''; };
    pad.addEventListener('pointerup', end); pad.addEventListener('pointercancel', end);
  }

  /* ---------- gates to the next place ---------- */
  function makeGate(sc, dir) {
    var to = S.zone + dir;
    if (to < 0 || to > 4) return null;
    var x = dir > 0 ? W - 70 : 70, y = 760;
    var sign = sc.add.text(x + (dir > 0 ? -40 : 40), y - 80, '', { fontFamily: 'Fredoka, sans-serif', fontSize: '26px', fontStyle: '700', color: '#fff', backgroundColor: '#0f172aee', padding: { x: 12, y: 6 }, align: 'center' }).setOrigin(dir > 0 ? 1 : 0, .5).setDepth(4400);
    var pic = sc.add.image(x, y, FLAT + 'o_gate_arrow').setOrigin(.5, .8).setDepth(4400); pic.setScale(130 / pic.height); pic.setFlipX(dir < 0);
    sc.tweens.add({ targets: pic, x: x + dir * 12, duration: 500, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    var g = { x: x, y: y, dir: dir, to: to, sign: sign, pic: pic, setLock: function () {
      var open = isOpen(to);
      sign.setText((open ? '' : '🔒 ') + zoneName(to));
      pic.setTexture(open ? FLAT + 'o_gate_arrow' : FLAT + 'o_cloud_lock'); pic.setScale((open ? 130 : 110) / pic.height); pic.setFlipX(open && dir < 0);
    } };
    g.setLock();
    return g;
  }
  function goZone(to, fromDir) {
    var sc = scene; if (S.leaving) return;
    S.leaving = true; S.moveMode = false; S.movingIdx = -1; sound('playHop'); hidePanel(); stopWalking();
    $('w-fade').classList.add('on');
    setTimeout(function () { S.leaving = false; S.near = null; S.ready = false; sc.scene.restart({ zone: to, fromDir: fromDir }); }, 280);
  }

  /* ---------- the scene ---------- */
  var WorldScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function WorldScene() { Phaser.Scene.call(this, { key: 'world' }); },
    init: function (data) { if (data && data.zone !== undefined) S.zone = data.zone; S.fromDir = (data && data.fromDir) || 0; },
    preload: function () { var sc = this; ART.concat(zoneArt(S.zone)).forEach(function (n) { if (!sc.textures.exists(n)) sc.load.image(n, artUrl(n)); }); },
    create: function () {
      var sc = this; scene = sc;
      var zone = ZONES[S.zone];
      sc.player = null;
      sc.physics.world.setBounds(0, 0, W, H);
      makeSmallTextures(sc);
      paintGround(sc, S.zone);
      sc.solids = []; sc.solidGroup = sc.physics.add.staticGroup();
      sc.palms = []; sc.shells = []; sc.palmShellKey = null;

      zone.decor.forEach(function (d) {
        var img = sc.add.image(d.x, d.y, d.art).setOrigin(.5, .96); img.setScale(d.h / img.height); img.setDepth(d.flat ? -5 : d.y);
        if (!d.flat) sc.add.image(d.x, d.y, 'shadow').setScale(Math.max(.7, img.displayWidth / 120), Math.max(.7, img.displayWidth / 190)).setDepth(-6);
        if (d.sway) { img.setOrigin(.5, 1); sc.tweens.add({ targets: img, angle: { from: -1, to: 1 }, duration: 2100 + d.x % 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' }); }
        if (d.sw) solid(sc, d.x, d.y - 4, d.sw, 30);
        if (d.shake) { img.hasShell = !!d.shell; sc.palms.push(img); }
      });
      var n = zone.npc, npc = sc.add.image(n.x, n.y, n.art).setOrigin(.5, .92); npc.setScale((n.h || 190) / npc.height).setDepth(n.y);
      sc.add.image(n.x, n.y, 'shadow').setScale(1.8).setDepth(-6); solid(sc, n.x, n.y - 4, 90, 34);
      sc.tweens.add({ targets: npc, scaleY: npc.scaleY * 1.05, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      sc.npcSpot = { kind: 'npc', img: npc, x: n.x, y: n.y };
      buildStops(sc, zone);
      buildHome(sc);
      buildVillagers(sc);
      buildBattles(sc);
      addLife(sc, zone);
      buildGather(sc, zone);

      sc.crate = sc.physics.add.image(zone.crate.x, zone.crate.y, FLAT + 'o_crate').setDepth(zone.crate.y); sc.crate.setScale(112 / sc.crate.height);
      sc.crate.body.setSize(sc.crate.width * .85, sc.crate.height * .8); sc.crate.setDrag(1400).setCollideWorldBounds(true).setMass(3).setBounce(.1);
      sc.ball = sc.physics.add.image(zone.ball.x, zone.ball.y, FLAT + 'o_ball').setDepth(zone.ball.y); sc.ball.setScale(84 / sc.ball.height);
      sc.ball.body.setCircle(sc.ball.width / 2); sc.ball.setDrag(170).setBounce(.8).setCollideWorldBounds(true).setMass(.4);
      sc.ballShadow = sc.add.image(zone.ball.x, zone.ball.y, 'shadow').setDepth(-6);
      sc.crateShadow = sc.add.image(zone.crate.x, zone.crate.y + 55, 'shadow').setScale(2.3).setDepth(-6);

      // hidden shells: a little something to find (kept on this device for now, no XP)
      var found = foundShells();
      zone.shells.forEach(function (sd, i) {
        var k = 'z' + S.zone + '_' + i; if (found[k]) return;
        var s = sc.add.image(sd.x, sd.y, FLAT + 'o_shell').setScale(.17).setDepth(sd.wet ? -12 : (sd.under ? sd.y - 100 : sd.y)); s.under = !!sd.under; s.key2 = k; sc.shells.push(s);
      });
      sc.palmShellKey = 'z' + S.zone + '_palm';
      if (found[sc.palmShellKey]) sc.palms.forEach(function (p) { p.hasShell = false; });

      sc.fx = sc.add.particles(0, 0, 'dot', { speed: { min: 60, max: 240 }, lifespan: 600, scale: { start: .8, end: 0 }, tint: [0xfde047, 0xffffff, 0xf472b6], emitting: false }).setDepth(5000);
      sc.party = sc.add.particles(0, 0, 'dot', { speed: { min: 140, max: 520 }, angle: { min: 200, max: 340 }, gravityY: 420, lifespan: 1500, scale: { start: 1, end: .2 }, tint: [0xfde047, 0x38bdf8, 0xf43f5e, 0x10b981, 0xa855f7], emitting: false }).setDepth(5000);
      sc.dust = sc.add.particles(0, 0, 'dot', { speed: { min: 8, max: 34 }, angle: { min: 200, max: 340 }, lifespan: 420, scale: { start: .55, end: 0 }, alpha: { start: .55, end: 0 }, tint: zone.ground === 'beach' ? 0xe6c88e : (zone.ground === 'volcano' ? 0x8c5430 : 0xd9f99d), emitting: false }).setDepth(-4);
      sc.waterFx = sc.add.particles(0, 0, 'dot', { speed: { min: 30, max: 120 }, angle: { min: 210, max: 330 }, gravityY: 240, lifespan: 480, scale: { start: .6, end: 0 }, tint: [0xffffff, 0xa5f3fc], emitting: false }).setDepth(-3);

      sc.gateL = makeGate(sc, -1); sc.gateR = makeGate(sc, 1);
      sc.grid = buildGrid(sc, zone);
      sc.keys = sc.input.keyboard ? sc.input.keyboard.createCursorKeys() : null;
      sc.wasd = sc.input.keyboard ? sc.input.keyboard.addKeys('W,A,S,D') : null;
      sc.input.on('pointerdown', onTap);
      sc.walkers = [];

      (async function () {
        var look = monsterLook();
        if (!sc.textures.exists('me') || S.lookStamp !== JSON.stringify(look)) await bakeMonster(sc, 'me', look);
        var isDemo = !!ses().isDemo, crowd = isDemo ? Math.max(0, Math.min(30, Number(Q.get('crowd') || 2))) : 0, colors = ['pink', 'gold', 'green', 'purple', 'orange'];
        for (var i = 0; i < Math.min(crowd, colors.length); i++) if (!sc.textures.exists('c' + i)) await bakeMonster(sc, 'c' + i, { stage: ['baby', 'growing', 'adventurer', 'advanced', 'ultimate'][i % 5], color: colors[i] });
        var sx = S.fromDir < 0 ? W - 220 : (S.fromDir > 0 ? 220 : (S.zone === 0 ? 960 : 300)), sy = S.fromDir ? 880 : (S.zone === 0 ? 780 : 1200);
        var free = nearestFree(sc.grid, Math.floor(sx / CELL), Math.floor(sy / CELL)) || [5, 20];
        sc.player = makeWalker(sc, 'me', free[0] * CELL + 20, free[1] * CELL + 20, .54);
        sc.cameras.main.setBounds(0, 0, W, H);
        sc.cameras.main.startFollow(sc.player, true, .1, .1);
        var fit = function () { if (!sc.cameras || !sc.cameras.main) return; var w = sc.scale.width, h = sc.scale.height; sc.cameras.main.setZoom(Math.max(w / W, h / H, .7, Math.min(1, Math.min(w / 1050, h / 640)))); };
        fit(); sc.scale.off('resize'); sc.scale.on('resize', fit);
        sc.physics.add.collider(sc.player, sc.solidGroup);
        sc.physics.add.collider(sc.player, sc.crate);
        sc.physics.add.collider(sc.crate, sc.solidGroup);
        sc.physics.add.collider(sc.ball, sc.solidGroup);
        sc.physics.add.collider(sc.ball, sc.crate);
        sc.physics.add.collider(sc.player, sc.ball, function () {
          var dx = sc.ball.x - sc.player.x, dy = sc.ball.y - sc.player.y, len = Math.sqrt(dx * dx + dy * dy) || 1;
          sc.ball.setVelocity(dx / len * 620, dy / len * 620); sound('playHop');
        });
        for (var k = 0; k < crowd; k++) {
          var dry = nearestFree(sc.grid, Math.floor((300 + Math.random() * 1800) / CELL), Math.floor((800 + Math.random() * 550) / CELL)) || [10, 25];
          var w = makeWalker(sc, 'c' + (k % Math.min(crowd, colors.length)), dry[0] * CELL + 20, dry[1] * CELL + 20, .46);
          w.wander = { x: w.x, y: w.y, wait: Math.random() * 2000 };
          sc.physics.add.collider(w, sc.solidGroup); sc.physics.add.collider(w, sc.ball);
          sc.walkers.push(w);
        }
        refreshStops(false);
        if (root.WorldGame) root.WorldGame.updateEnergyChip();
        $('w-load').classList.remove('on');
        $('w-fade').classList.remove('on');
        S.cooldown = 500;
        S.ready = true;
      })().catch(function (e) { $('w-load').innerHTML = '😢 The monster could not load.<small>' + String(e && e.message || e).slice(0, 120) + '</small>'; S.error = String(e); });
    },
    update: function (time, delta) {
      var sc = this, m = sc.player;
      if (Q.get('fps') && time % 500 < delta) $('w-fps').textContent = Math.round(sc.game.loop.actualFps) + ' fps';
      if (!m || !m.body) return;

      // a mission, story or menu is open: the world waits; when it closes, read the new stars and look
      var modalNow = !!($('isl-modal-root') && $('isl-modal-root').children.length);
      if (modalNow !== S.modal) {
        S.modal = modalNow;
        if (modalNow) { hidePanel(); stopWalking(); }
        else {
          refreshStops(true);
          var look = monsterLook();
          if (S.lookStamp !== JSON.stringify(look)) { var fr = m; bakeMonster(sc, 'me', look).then(function () { if (fr.active) { fr.setTexture('me', 0); syncRide(sc, fr); } }); }
          else syncRide(sc, m);
          S.near = null; S.cooldown = 600;
        }
      }
      var zone = ZONES[S.zone], vx = 0, vy = 0, K = sc.keys, Wk = sc.wasd;
      if (!S.modal && !S.leaving) {
        if (S.joy.x || S.joy.y) { vx = S.joy.x; vy = S.joy.y; }
        else if (K && Wk) {
          vx = ((K.right.isDown || Wk.D.isDown) ? 1 : 0) - ((K.left.isDown || Wk.A.isDown) ? 1 : 0);
          vy = ((K.down.isDown || Wk.S.isDown) ? 1 : 0) - ((K.up.isDown || Wk.W.isDown) ? 1 : 0);
          if (vx || vy) { var l0 = Math.sqrt(vx * vx + vy * vy); vx /= l0; vy /= l0; S.path = []; S.onArrive = null; }
        }
        if (!vx && !vy && S.path.length) {
          var nx = S.path[0], dx = nx.x - m.x, dy = nx.y - m.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 24) { S.path.shift(); S.stuck = 0; if (!S.path.length && S.onArrive) { var cb = S.onArrive; S.onArrive = null; cb(); } }
          else {
            vx = dx / d; vy = dy / d;
            if (Math.abs(m.body.velocity.x) + Math.abs(m.body.velocity.y) < 30) S.stuck = (S.stuck || 0) + delta; else S.stuck = 0;
            if (S.stuck > 900) { S.path = []; S.onArrive = null; S.stuck = 0; vx = vy = 0; }
          }
        }
      }
      var isSprinting = !!(sc.shiftKey && sc.shiftKey.isDown) || (S.joy && Math.sqrt(S.joy.x * S.joy.x + S.joy.y * S.joy.y) > 0.85);
      var sprintBoost = isSprinting ? 1.42 : 1.0;
      var wet = zone.shallows ? zone.shallows(m.x, m.y) : false, hasRide = !!(m.ride && m.ride.visible), speed = SPEED * (wet ? .68 : 1) * (hasRide ? 1.22 : 1) * sprintBoost;
      var ease = Math.min(1, delta * ((vx || vy) ? .011 : .018));   // speeds up and slows down instead of starting and stopping dead
      m.setVelocity(m.body.velocity.x + (vx * speed - m.body.velocity.x) * ease, m.body.velocity.y + (vy * speed - m.body.velocity.y) * ease);
      pushOut(m, zone);
      var moving = !!(vx || vy);
      if (moving && !m.cheering) {
        if (!m.anims.isPlaying) m.play('me-walk');
        if (vx) m.setFlipX(vx < 0);
        S.dustAt = (S.dustAt || 0) + delta;
        if (S.dustAt > (wet ? 150 : 190)) { S.dustAt = 0; (wet ? sc.waterFx : sc.dust).explode(wet ? 5 : 2, m.x, m.y + 4); }
      } else if (!m.cheering && m.anims.isPlaying) { m.anims.stop(); m.setFrame(0); }
      moveSkin(m, delta, time);
      dropTrail(sc, m, delta);

      sc.walkers.forEach(function (w) {
        var a = w.wander;
        if (a.wait > 0) { a.wait -= delta; w.setVelocity(0); if (w.anims.isPlaying) { w.anims.stop(); w.setFrame(0); } }
        else {
          var ddx = a.x - w.x, ddy = a.y - w.y, dd = Math.sqrt(ddx * ddx + ddy * ddy); a.life = (a.life || 0) + delta;
          if (dd < 20 || a.life > 6000) { a.wait = 800 + Math.random() * 2600; a.life = 0; a.x = 150 + Math.random() * 2100; a.y = 780 + Math.random() * 620; }
          else { w.setVelocity(ddx / dd * 120, ddy / dd * 120); w.setFlipX(ddx < 0); if (!w.anims.isPlaying) w.play(w.monKey + '-walk'); }
        }
        pushOut(w, zone); moveSkin(w, delta, time);
      });
      pushOut(sc.crate, zone); pushOut(sc.ball, zone);
      sc.crate.setDepth(sc.crate.y + 54); sc.crateShadow.setPosition(sc.crate.x, sc.crate.y + 54);
      sc.ball.setDepth(sc.ball.y + 40); sc.ball.rotation += sc.ball.body.velocity.x * delta * .00002; sc.ballShadow.setPosition(sc.ball.x, sc.ball.y + 42);

      if (S.modal || S.leaving) return;
      if (S.cooldown > 0) { S.cooldown -= delta; return; }

      // things to gather
      for (var gi = sc.gather.length - 1; gi >= 0; gi--) {
        var ga = sc.gather[gi];
        if (Phaser.Math.Distance.Between(m.x, m.y, ga.x, ga.y) < 62) {
          if (takeGather(sc, ga)) sc.gather.splice(gi, 1);
          else S.cooldown = 1100;
        }
      }
      // shells
      for (var i = sc.shells.length - 1; i >= 0; i--) {
        var sh = sc.shells[i];
        if (sh.under && Phaser.Math.Distance.Between(sc.crate.x, sc.crate.y, sh.x, sh.y) < 92) continue;
        if (Phaser.Math.Distance.Between(m.x, m.y, sh.x, sh.y) < 66) {
          sc.shells.splice(i, 1); saveShell(sh.key2); sound('playCorrect'); say('A shell!'); cheer(m); sc.fx.explode(14, sh.x, sh.y);
          sc.tweens.add({ targets: sh, y: sh.y - 90, alpha: 0, duration: 650, onComplete: function (tw, t) { t[0].destroy(); } });
        }
      }
      // the palm trees shake when you walk into them
      sc.palms.forEach(function (p) {
        if (!p.shaking && Phaser.Math.Distance.Between(m.x, m.y, p.x, p.y) < 74 && moving) shakePalm(p);
      });
      // gates
      [sc.gateL, sc.gateR].forEach(function (g) {
        if (!g) return;
        if (Phaser.Math.Distance.Between(m.x, m.y, g.x, g.y) < 90) {
          if (isOpen(g.to)) goZone(g.to, g.dir);
          else if (!g.told) { g.told = true; panel(FLAT + 'o_cloud_lock', zoneName(g.to), 'Finish 4 stops here first!', 'OK', function () {}); say('Finish four stops here first!'); }
        } else g.told = false;
      });
      // what is here? the panel opens when you walk up to something, and closes when you walk away
      var here = null, best = 110;
      interactables(sc).forEach(function (t) { var ty = t.y + (t.def && t.def.sw ? 24 : 0), lim = t.def && t.def.sw ? Math.max(115, t.def.sw * .58) : 110, dd2 = Phaser.Math.Distance.Between(m.x, m.y, t.x, ty); if (dd2 < lim && dd2 < best) { best = dd2; here = t; } });
      if (here && here !== S.near && !S.path.length) { S.near = here; openThing(here); }
      else if (!here && S.near && !S.path.length) { S.near = null; hidePanel(); }
    }
  });
  function pushOut(o, zone) {
    if (!zone.blocked(o.x, o.y)) { o.lastX = o.x; o.lastY = o.lastY; return; }
    if (o.lastX !== undefined) { o.x = o.lastX; o.y = o.lastY; }
    if (o.body) { o.body.velocity.x *= -.4; o.body.velocity.y *= -.4; }
  }
  function shakePalm(p) {
    var sc = scene; p.shaking = true; sound('playPop');
    sc.tweens.add({ targets: p, angle: { from: -6, to: 6 }, duration: 90, yoyo: true, repeat: 3, onComplete: function () { p.angle = 0; sc.time.delayedCall(1200, function () { p.shaking = false; }); } });
    var drop = function (key, scale, tx, ty, then) {
      var d = sc.add.image(p.x + (tx > p.x ? 26 : -26), p.y - 280, key).setScale(scale).setDepth(ty + 1);
      sc.tweens.add({ targets: d, x: tx, duration: 750 });
      sc.tweens.add({ targets: d, y: ty, duration: 750, ease: 'Bounce.out', onComplete: function () { if (then) then(d); } });
    };
    if (p.hasShell) {
      p.hasShell = false;
      drop(FLAT + 'o_shell', .17, p.x + 150, p.y + 42, function (d) { d.under = false; d.key2 = sc.palmShellKey; sc.shells.push(d); });
    } else {
      drop(FLAT + 'o_coconut', .11, p.x - 70 + Math.random() * 140, p.y + 40, function (d) { sc.tweens.add({ targets: d, alpha: 0, delay: 1500, duration: 400, onComplete: function () { d.destroy(); } }); });
    }
  }

  /* ---------- start, once the pupil is known ---------- */
  function startWorld() {
    var rawZ = Q.get('zone');
    var want = (rawZ !== null && rawZ !== '') ? Number(rawZ) : 1;
    var z = want === 0 ? 0 : 1;
    for (var i = 1; i <= 4; i++) if (i <= want && isOpen(i)) z = i;
    S.zone = z;
    document.body.classList.add('w-on');
    $('w-load').classList.add('on');
    setupJoystick();
    if ($('w-back')) $('w-back').onclick = function () { sound('playTap'); if (root.WorldGame) root.WorldGame.openWorldMap(); else { var u = new URLSearchParams(root.location.search); u.delete('zone'); root.location.href = 'index.html?' + u.toString(); } };
    if ($('w-energy')) $('w-energy').onclick = function () { sound('playTap'); if (root.WorldGame) root.WorldGame.openEnergyCharge(); };
    if ($('w-home')) $('w-home').onclick = function () { sound('playTap'); if (root.WorldGame) root.WorldGame.openWorkshop('home'); };
    if ($('w-decor')) $('w-decor').onclick = function () { sound('playTap'); if (S.moveMode) closeDecorDock(); else openDecorDock(); };
    if ($('w-jobs')) $('w-jobs').onclick = function () { sound('playTap'); if (root.WorldGame) root.WorldGame.openJobsBoard(); };
    if ($('w-wall')) $('w-wall').onclick = function () { sound('playTap'); if (root.IslandWall) root.IslandWall.open(); };
    if ($('w-book')) $('w-book').onclick = function () { sound('playTap'); if (root.IslandRewards) root.IslandRewards.openStickerBook(); };
    if ($('w-dress')) $('w-dress').onclick = function () { sound('playTap'); App().openDressingRoom(); };
    if ($('w-shop')) $('w-shop').onclick = function () { sound('playTap'); root.IslandShop.open(); };
    if ($('w-goal')) $('w-goal').onclick = function () { sound('playTap'); if (S.zone === 0) { if (root.WorldGame) root.WorldGame.openWorkshop('home'); } else { if (root.WorldGame) root.WorldGame.openJobsBoard(); } };
    if (root.WorldGame) root.WorldGame.updateEnergyChip();
    if (Q.get('fps') && $('w-fps')) $('w-fps').style.display = 'block';
    root.WORLD.game = new Phaser.Game({
      type: Phaser.AUTO, parent: 'world', backgroundColor: '#0f6fb0',
      scale: { mode: Phaser.Scale.RESIZE, width: root.innerWidth, height: root.innerHeight },
      physics: { default: 'arcade', arcade: { debug: !!Q.get('debug') } },
      render: { antialias: true }, scene: [WorldScene]
    });
  }
  function tapBag(word, el) {
    sound('playTap'); say(word);
    if (el) { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); setTimeout(function () { el.classList.remove('pop'); }, 300); }
  }
  function nextMission(missionId, zoneNum, isStar) {
    var sc = scene;
    if (!sc || !S.ready) { App().tapPin(missionId, zoneNum, isStar); return; }
    if (zoneNum && zoneNum !== S.zone && isOpen(zoneNum)) {
      goZone(zoneNum, zoneNum > S.zone ? 1 : -1);
      return;
    }
    var list = (isStar ? sc.stones : sc.stops) || [];
    var hit = list.filter(function (s) { return s.mission && s.mission.id === missionId; })[0];
    if (hit) {
      hidePanel(); S.near = hit;
      walkTo(hit.x, hit.y + 54, function () { openThing(hit); });
    } else if (S.target === sc.chest) {
      hidePanel(); S.near = sc.chest;
      walkTo(sc.chest.x, sc.chest.y + 54, function () { openThing(sc.chest); });
    }
  }
  function focusVillager(v) {
    if (v.zone !== S.zone) {
      goZone(v.zone, v.zone > S.zone ? 1 : -1);
      setTimeout(function () { focusVillager(v); }, 450);
      return;
    }
    var sc = scene;
    if (!sc || !sc.player) return;
    walkTo(v.x, v.y + 54, function () {
      var vo = (sc.villagers || []).filter(function (it) { return it.v && it.v.id === v.id; })[0];
      if (vo) openThing(vo);
    });
  }

  root.WORLD = {
    S: S,
    scene: function () { return scene; },
    walkTo: walkTo,
    goZone: goZone,
    isOpen: isOpen,
    drawBag: drawBag,
    refresh: refreshStops,
    refreshHome: refreshHome,
    refreshVillagers: refreshVillagers,
    refreshBattles: refreshBattles,
    setMoveMode: setMoveMode,
    openDecorDock: openDecorDock,
    closeDecorDock: closeDecorDock,
    selectDecorCard: selectDecorCard,
    flipDecor: flipDecor,
    putAwayDecor: putAwayDecor,
    focusVillager: focusVillager,
    open: openThing,
    tapBag: tapBag,
    nextMission: nextMission
  };
  var tries = 0;
  (function waitForPupil() {
    var s = ses();
    if (s && s.status === 'ok') { startWorld(); return; }
    if (tries++ < 400) setTimeout(waitForPupil, 150);   // no pupil yet: the normal code screen is showing underneath
  })();
})(typeof window !== 'undefined' ? window : this);
