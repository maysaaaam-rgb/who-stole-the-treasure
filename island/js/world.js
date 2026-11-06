/* Practice Island — the walking world, built on Phaser (island/lib).
   Each zone is a place to walk around. Walking up to a stop opens the same mission as the map, through IslandApp, so stars, XP limits and saving are unchanged.
   URL: ?demo=1 or ?p=CODE, plus ?zone=2  ?crowd=8 (extra monsters, demo only, to test speed)  ?fps=1 */
(function (root) {
  'use strict';

  var Q = new URLSearchParams(root.location.search);
  var W = 2400, H = 1500, CELL = 40, SPEED = 205, FRAME = 256, SHALLOW = 110;
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
      npc: { art: FLAT + 'c_bolt', worried: FLAT + 'c_bolt', happy: FLAT + 'c_bolt_happy', x: 540, y: 700 },
      blocked: function (x, y) {
        if (S.inHouse) return x < 575 || x > 1825 || y < 565 || y > 1155;
        return y < 215 || edgeOf(x, y);
      },
      stops: [],
      chest: null,
      decor: [
        { art: FLAT + 'o_tree_round', x: 260, y: 450, h: 360, sw: 60, sway: true },
        { art: FLAT + 'o_tree_pine', x: 520, y: 390, h: 330, sw: 55, sway: true },
        { art: FLAT + 'o_tree_round', x: 860, y: 410, h: 340, sw: 55, sway: true },
        { art: FLAT + 'o_tree_pine', x: 1540, y: 410, h: 340, sw: 55, sway: true },
        { art: FLAT + 'o_tree_round', x: 1860, y: 430, h: 350, sw: 60, sway: true },
        { art: FLAT + 'o_tree_pine', x: 2140, y: 450, h: 350, sw: 60, sway: true },
        { art: FLAT + 'o_tree_round', x: 2190, y: 1280, h: 360, sw: 60, sway: true },
        { art: FLAT + 'o_tree_pine', x: 240, y: 1320, h: 340, sw: 60, sway: true },
        { art: FLAT + 'o_well', x: 1780, y: 690, h: 195, sw: 95 },
        { art: FLAT + 'o_sign', x: 1420, y: 720, h: 115, sw: 35 },
        { art: FLAT + 'o_campfire', x: 420, y: 740, h: 110, sw: 70 },
        { art: FLAT + 'o_log', x: 330, y: 760, h: 55, sw: 80 },
        { art: FLAT + 'o_lamp', x: 980, y: 730, h: 165, sw: 28 },
        { art: FLAT + 'o_lamp', x: 1360, y: 730, h: 165, sw: 28 },
        { art: FLAT + 'o_fence', x: 640, y: 580, h: 88, sw: 88 },
        { art: FLAT + 'o_fence', x: 750, y: 580, h: 88, sw: 88 },
        { art: FLAT + 'o_fence', x: 1580, y: 580, h: 88, sw: 88 },
        { art: FLAT + 'o_fence', x: 1690, y: 580, h: 88, sw: 88 },
        { art: FLAT + 'o_rock', x: 310, y: 980, h: 78, sw: 68 },
        { art: FLAT + 'o_rock', x: 2040, y: 920, h: 82, sw: 70 },
        { art: FLAT + 'o_mushroom', x: 360, y: 540, h: 74, sw: 40 },
        { art: FLAT + 'o_mushroom', x: 1980, y: 620, h: 76, sw: 40 },
        { art: FLAT + 'o_bush', x: 420, y: 480, h: 105, sw: 80 },
        { art: FLAT + 'o_bush', x: 2040, y: 1290, h: 110, sw: 80 },
        { art: FLAT + 'o_bush', x: 1940, y: 540, h: 100, sw: 75 },
        { art: FLAT + 'o_flowers_pink', x: 700, y: 980, h: 54, flat: true },
        { art: FLAT + 'o_flowers_pink', x: 1260, y: 1120, h: 54, flat: true },
        { art: FLAT + 'o_flowers_pink', x: 1680, y: 840, h: 54, flat: true },
        { art: FLAT + 'o_flowers_pink', x: 520, y: 1120, h: 54, flat: true }
      ],
      ground2: { flowers: [FLAT + 'o_flowers'], count: 36 },
      paths: [[[420, 775], [540, 775], [760, 775], [1170, 775], [1480, 775], [1780, 750]], [[1170, 725], [1170, 1120]]],
      edge: { top: [FLAT + 'o_tree_round', FLAT + 'o_tree_pine'], topH: [340, 430], bottom: [FLAT + 'o_bush'], bottomH: [130, 170] },
      gather: [
        { art: FLAT + 'i_wood', word: 'wood', h: 58, x: 290, y: 610 },
        { art: FLAT + 'i_wood', word: 'wood', h: 58, x: 1980, y: 1350 },
        { art: FLAT + 'i_stone', word: 'stone', h: 50, x: 340, y: 1280 },
        { art: FLAT + 'i_stone', word: 'stone', h: 50, x: 2060, y: 780 },
        { art: FLAT + 'i_flower', word: 'flower', h: 56, x: 840, y: 1320 },
        { art: FLAT + 'i_flower', word: 'flower', h: 56, x: 1890, y: 1080 }
      ],
      crate: { x: 460, y: 1180 }, ball: { x: 1150, y: 1140 }, shells: [{ x: 460, y: 1195, under: true }, { x: 2100, y: 420 }]
    },
    1: {
      ground: 'meadow',
      look: { base: '#6bc453', tile: 't_grass', alpha: .26, patch: 'rgba(244,228,174,.32)', edge: '#b98f4a', fill: '#f3dd9c', speck: ['#dfbe78', '#c7a463'], extra: ['t_sand', 't_water'] },
      npc: { art: FLAT + 'c_jim', worried: FLAT + 'c_jim', happy: FLAT + 'c_jim_happy', x: 640, y: 630, h: 195 },
      blocked: function (x, y) { return y < 220 || y > 1470 || x < 65 || x > W - 65; },
      stops: [
        { x: 420,  y: 1020, art: FLAT + 'o_compass',     done: FLAT + 'o_compass',     h: 135 },
        { x: 850,  y: 1220, art: FLAT + 'o_map_scroll',  done: FLAT + 'o_map_scroll',  h: 135 },
        { x: 1280, y: 960,  art: FLAT + 'o_spyglass',    done: FLAT + 'o_spyglass',    h: 175 },
        { x: 1660, y: 1200, art: FLAT + 'o_ship_wheel',  done: FLAT + 'o_ship_wheel',  h: 175 },
        { x: 1980, y: 930,  art: FLAT + 'o_barrel_dock', done: FLAT + 'o_hispaniola',  h: 165 }
      ],
      chest: { x: 2130, y: 1120, art: FLAT + 'o_billy_chest' },
      decor: [
        { art: FLAT + 'o_benbow_inn',  x: 470,  y: 590,  h: 360, sw: 240 },
        { art: FLAT + 'o_lamp',        x: 720,  y: 610,  h: 165, sw: 28 },
        { art: FLAT + 'o_campfire',    x: 310,  y: 660,  h: 110, sw: 70 },
        { art: FLAT + 'o_barrel_dock', x: 1910, y: 690,  h: 135, sw: 95 },
        { art: FLAT + 'o_palm_a',      x: 1640, y: 540,  h: 350, sw: 46, sway: true },
        { art: FLAT + 'o_palm_b',      x: 2040, y: 490,  h: 340, sw: 46, sway: true },
        { art: FLAT + 'o_palm_a',      x: 2220, y: 1320, h: 360, sw: 46, sway: true },
        { art: FLAT + 'o_tree_pine',   x: 210,  y: 460,  h: 350, sw: 60, sway: true },
        { art: FLAT + 'o_tree_round',  x: 920,  y: 450,  h: 350, sw: 60, sway: true },
        { art: FLAT + 'o_tree_pine',   x: 1380, y: 460,  h: 340, sw: 60, sway: true },
        { art: FLAT + 'o_rock',        x: 1470, y: 760,  h: 82,  sw: 70 },
        { art: FLAT + 'o_rock',        x: 620,  y: 1360, h: 78,  sw: 66 },
        { art: FLAT + 'o_starfish',    x: 1840, y: 1080, h: 46,  flat: true },
        { art: FLAT + 'o_starfish',    x: 2040, y: 1240, h: 44,  flat: true }
      ],
      ground2: { flowers: [FLAT + 'o_flowers'], count: 14 },
      paths: [
        [[470, 650], [640, 680], [420, 1060], [850, 1260], [1280, 1000], [1660, 1240], [1980, 970], [2130, 1140]],
        [[1980, 970], [2120, 760], [2310, 760]]
      ],
      edge: { top: [FLAT + 'o_tree_round', FLAT + 'o_tree_pine'], topH: [340, 420], bottom: [FLAT + 'o_bush'], bottomH: [120, 155] },
      gather: [],
      crate: null,
      ball: { x: 1060, y: 820 },
      shells: []
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
  var ART = [FLAT + 'o_gift', FLAT + 'o_star_path', FLAT + 'o_chest', FLAT + 'o_chest_open', FLAT + 'o_billy_chest', FLAT + 'o_treasure_gold', FLAT + 'o_hispaniola', FLAT + 'o_boat', FLAT + 'o_compass', FLAT + 'o_map_scroll', FLAT + 'o_pirate_hat', FLAT + 'o_benbow_inn', FLAT + 'o_spyglass', FLAT + 'o_ship_wheel', FLAT + 'o_barrel_dock', FLAT + 'c_jim', FLAT + 'c_jim_happy', FLAT + 'c_billy', FLAT + 'c_silver', FLAT + 'c_livesey', FLAT + 'c_benbow', FLAT + 'c_benbow_happy', FLAT + 'c_pip', FLAT + 'c_pip_happy', FLAT + 'o_ball', FLAT + 'o_crate', FLAT + 'o_shell', FLAT + 'o_coconut', FLAT + 'o_butterfly', FLAT + 'o_bird', FLAT + 'o_duck', FLAT + 'o_frog', FLAT + 'v_mark'];
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
    if (root.WorldGame && root.WorldGame.isAllChaptersUnlocked && root.WorldGame.isAllChaptersUnlocked()) return true;
    if (Q.get('all')) return true;
    var prev = missions(z - 1).regular.filter(function (m) { return starsOf(m.id) > 0; }).length;
    return prev >= 4;
  }
  function chestOpened(z) { var d = ses().doc || {}; return !!(d.chests && d.chests['z' + z]); }
  function zoneName(z) {
    if (z === 0) return "Captain's Cabin";
    var s = ses(), zz = root.IslandData.ZONES[z - 1];
    return (zz.titles[s.grade || 3] || zz.titles[3]).name;
  }
  var SHELL_KEY = function () { return 'eaa_world_shells_' + ((ses().student && ses().student.id) || 'x'); };
  function foundShells() { try { return JSON.parse(localStorage.getItem(SHELL_KEY())) || {}; } catch (e) { return {}; } }
  function saveShell(k) { var f = foundShells(); f[k] = 1; try { localStorage.setItem(SHELL_KEY(), JSON.stringify(f)); } catch (e) { /* just for now */ } }

  /* ---------- the ground: Gemini's picture for each zone ---------- */
  // the flat cartoon ground: drawn sharp in code, so it never goes blurry
  function paintIndoorRoom(sc) {
    var st = (S.visitingFriend && S.visitingFriend.world) ? S.visitingFriend.world : (root.WorldGame ? root.WorldGame.readState() : { houseTier: 1 });
    var tierLv = Math.max(1, Math.min(5, Number(st.houseTier) || 1));
    var key = 'flat0_room_' + tierLv;
    if (!sc.textures.exists(key)) {
      var tex = sc.textures.createCanvas(key, W, H), c = tex.context;
      var tile = function (name) { return c.createPattern(sc.textures.get(FLAT + name).getSourceImage(), 'repeat'); };
      c.fillStyle = '#070b14';
      c.fillRect(0, 0, W, H);
      var rx = 520, ry = 340, rw = 1360, rh = 840, wallH = 210;
      c.fillStyle = 'rgba(56, 189, 248, 0.08)';
      c.fillRect(rx - 18, ry - 18, rw + 36, rh + 36);
      var wallColors = {
        1: { top: '#d97706', bot: '#b45309', trim: '#78350f' },
        2: { top: '#b45309', bot: '#92400e', trim: '#451a03' },
        3: { top: '#fbcfe8', bot: '#f472b6', trim: '#831843' },
        4: { top: '#93c5fd', bot: '#3b82f6', trim: '#1e3a8a' },
        5: { top: '#ddd6fe', bot: '#8b5cf6', trim: '#4c1d95' }
      }[tierLv];
      var wg = c.createLinearGradient(0, ry, 0, ry + wallH);
      wg.addColorStop(0, wallColors.top);
      wg.addColorStop(1, wallColors.bot);
      c.fillStyle = wg;
      c.fillRect(rx, ry, rw, wallH);
      c.fillStyle = 'rgba(255,255,255,0.08)';
      for (var sx = rx + 40; sx < rx + rw; sx += 80) {
        c.fillRect(sx, ry, 28, wallH);
      }
      [860, 1540].forEach(function (wx) {
        c.fillStyle = '#38bdf8';
        c.fillRect(wx - 70, ry + 36, 140, 110);
        c.fillStyle = '#bae6fd';
        c.fillRect(wx - 62, ry + 44, 124, 50);
        c.strokeStyle = '#fef08a';
        c.lineWidth = 8;
        c.strokeRect(wx - 70, ry + 36, 140, 110);
        c.beginPath();
        c.moveTo(wx, ry + 36); c.lineTo(wx, ry + 146);
        c.moveTo(wx - 70, ry + 91); c.lineTo(wx + 70, ry + 91);
        c.stroke();
      });
      c.fillStyle = wallColors.trim;
      c.fillRect(rx, ry + wallH - 14, rw, 18);
      c.save();
      c.beginPath();
      c.rect(rx, ry + wallH, rw, rh - wallH);
      c.fillStyle = '#c8924b';
      c.fill();
      c.clip();
      c.globalAlpha = 0.88;
      c.fillStyle = tile('t_floor');
      c.fillRect(rx, ry + wallH, rw, rh - wallH);
      c.restore();
      c.lineWidth = 14;
      c.strokeStyle = '#5c340e';
      c.strokeRect(rx, ry, rw, rh);
      c.fillStyle = '#991b1b';
      c.fillRect(1100, 1112, 200, 58);
      c.strokeStyle = '#fde047';
      c.lineWidth = 5;
      c.strokeRect(1100, 1112, 200, 58);
      tex.refresh();
    }
    sc.add.image(0, 0, key).setOrigin(0).setDepth(-20);
  }
  function paintFlat(sc, z) {
    if (z === 0 && S.inHouse) { paintIndoorRoom(sc); return; }
    var key = 'flat' + z, zone = ZONES[z], look = zone.look;
    if (!sc.textures.exists(key)) {
      var tex = sc.textures.createCanvas(key, W, H), c = tex.context, i, x, y;
      var tile = function (name) { return c.createPattern(sc.textures.get(FLAT + name).getSourceImage(), 'repeat'); };
      c.fillStyle = look.base; c.fillRect(0, 0, W, H);
      c.globalAlpha = look.alpha; c.fillStyle = tile(look.tile); c.fillRect(0, 0, W, H); c.globalAlpha = 1;
      for (i = 0; i < 14; i++) { c.fillStyle = look.patch; c.beginPath(); c.ellipse(seeded(i + 200) * W, seeded(i + 230) * H, 150 + seeded(i + 260) * 220, 80 + seeded(i + 290) * 110, 0, 0, 7); c.fill(); }
      var oval = function (cx, cy, rx, ry, fill, line, lw) { c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, 7); c.fillStyle = fill; c.fill(); if (line) { c.lineWidth = lw; c.strokeStyle = line; c.stroke(); } };
      if (z === 0) {
        /* Clean Stone & Wood Porch Foundation directly under the House (x: 1170, y: 665) — no side deck! */
        c.save();
        c.fillStyle = 'rgba(30, 41, 59, 0.25)';
        c.beginPath();
        c.ellipse(1170, 672, 178, 86, 0, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = '#d6c7b2';
        c.beginPath();
        c.ellipse(1170, 665, 170, 80, 0, 0, Math.PI * 2);
        c.fill();
        c.lineWidth = 6;
        c.strokeStyle = '#78716c';
        c.stroke();
        /* Front wooden welcome step at the House door */
        c.fillStyle = '#c8924b';
        c.strokeStyle = '#6f4316';
        c.lineWidth = 4;
        c.fillRect(1106, 704, 128, 24);
        c.strokeRect(1106, 704, 128, 24);
        c.restore();
      }
      if (z === 1) {
        /* Golden Sandy Beach Shoreline along the Eastern Harbour */
        oval(2180, 820, 540, 680, '#f3dd9c', '#c7a463', 6);
        /* Deep Turquoise Admiral Benbow Sea Cove */
        oval(2390, 780, 390, 520, '#38bdf8', '#0284c7', 8);
        oval(2410, 780, 320, 440, '#0ea5e9');
        oval(2430, 780, 240, 350, '#0369a1');
        c.strokeStyle = '#e0f2fe'; c.lineWidth = 6; c.lineCap = 'round';
        [[2120, 560, 90], [2160, 660, 110], [2150, 890, 100], [2190, 990, 95]].forEach(function (w) {
          c.beginPath(); c.moveTo(w[0], w[1]); c.quadraticCurveTo(w[0] + w[2] / 2, w[1] - 14, w[0] + w[2], w[1]); c.stroke();
        });
        /* Stone Cobble Courtyard under the Admiral Benbow Inn */
        oval(540, 620, 290, 130, '#e2cd8f', '#a18048', 5);
        /* Sturdy Wooden Harbour Boarding Pier out to the Hispaniola */
        c.fillStyle = 'rgba(15, 23, 42, 0.35)';
        c.fillRect(1980, 722, 350, 98);
        for (var px = 1980, pi2 = 0; px < 2320; px += 34, pi2++) {
          c.fillStyle = pi2 % 2 ? '#b9823f' : '#c8924b';
          c.fillRect(px, 708, 34, 98);
          c.strokeStyle = '#5c340e'; c.lineWidth = 3;
          c.strokeRect(px, 708, 34, 98);
        }
        c.fillStyle = '#5c340e';
        c.fillRect(1976, 700, 352, 12);
        c.fillRect(1976, 800, 352, 12);
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
      var bx = 260 + seeded(i + 307) * (W - 520), by = 320 + seeded(i + 319) * 860, fl = sc.add.image(bx, by, flyerKey).setDepth(4150);
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
    var matActionIcon = { wood: '🪓', stone: '⛏️', crystal: '💎', flower: '🌸', shell: '🐚', berry: '🫐' };
    (zone.gather || []).forEach(function (g, i) {
      var id = 'z' + S.zone + '_' + i; if (b.taken[id]) return;
      var im = sc.add.image(g.x, g.y, g.art).setOrigin(.5, .9).setDepth(g.y); im.setScale((g.h * 1.12) / im.height);
      var shade = sc.add.image(g.x, g.y, 'shadow').setScale(.78).setDepth(-6);
      var glow = sc.add.image(g.x, g.y - g.h * .4, 'dot').setScale(4.2).setAlpha(.34).setTint(0xfff3a8).setDepth(g.y - 1);
      sc.tweens.add({ targets: glow, alpha: .08, scale: 5.2, duration: 900 + i * 40, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      var isSturdy = (g.word === 'wood' || g.word === 'stone' || g.word === 'crystal');
      var maxH = isSturdy ? 2 : 1;
      var tag = null;
      sc.gather.push({
        kind: 'gather',
        id: id,
        word: g.word,
        art: g.art,
        img: im,
        shade: shade,
        glow: glow,
        tag: tag,
        hitsLeft: maxH,
        maxHits: maxH,
        x: g.x,
        y: g.y,
        def: { h: g.h || 56, sw: 68 }
      });
    });
    drawBag();
  }
  function takeGather(sc, g) {
    if (!g || g.harvested) return false;
    if (root.WorldGame && root.WorldGame.getEnergy() < 5) {
      panel(FLAT + 'i_energy', 'Low Energy!', 'Answer 3 quick English questions for +30 ⚡ Energy!', 'Charge ⚡', function () { root.WorldGame.openEnergyCharge('Charge +30 ⚡ Energy to keep gathering!'); });
      say('Charge your energy first!');
      return false;
    }
    var matEmojis = { wood: '🪵', stone: '🪨', flower: '🌸', shell: '🐚', berry: '🫐', crystal: '💎' };
    var capWord = g.word.charAt(0).toUpperCase() + g.word.slice(1);
    if (g.hitsLeft > 1) {
      g.hitsLeft--;
      sound('playPop');
      if (sc.dust) sc.dust.explode(14, g.x, g.y - 12);
      if (sc.fx) sc.fx.explode(8, g.x, g.y - 20);
      if (sc.player) cheer(sc.player, 320);
      sc.tweens.add({ targets: g.img, angle: { from: -15, to: 15 }, duration: 65, yoyo: true, repeat: 2, onComplete: function () { if (g.img && g.img.active) g.img.angle = 0; } });
      if (g.tag && g.tag.active) g.tag.setText('⚡ ' + capWord + ' (1 left!)').setColor('#38bdf8');
      showWorldFloat(sc, g.x, g.y - 45, '⛏️ Good strike! 1 more tap to harvest ' + capWord + '!', '#38bdf8');
      say('One more strike!');
      setTimeout(function () {
        if (!g.harvested) openThing(g);
      }, 160);
      return false;
    }
    g.harvested = true;
    var idx = sc.gather ? sc.gather.indexOf(g) : -1;
    if (idx >= 0) sc.gather.splice(idx, 1);
    if (root.WorldGame) root.WorldGame.useEnergy(5);
    var bonusQty = (g.maxHits > 1 && Math.random() < 0.35) ? 2 : 1;
    var b = readBag(); b.items[g.word] = (Number(b.items[g.word]) || 0) + bonusQty; b.taken[g.id] = 1; writeBag(b);
    if (root.WorldGame && root.WorldGame.writeBag) root.WorldGame.writeBag(b);
    if (bonusQty > 1 && root.WorldGame && root.WorldGame.addBonusCoins) {
      root.WorldGame.addBonusCoins(3);
    }
    sound('playCorrect'); say(g.word); if (sc.player) cheer(sc.player, 420);
    var floatMsg = '+' + bonusQty + ' ' + capWord + ' ' + (matEmojis[g.word] || '✨') + (bonusQty > 1 ? ' (Lucky +3 🪙!)' : '');
    showWorldFloat(sc, g.x, g.y - 34, floatMsg, '#fde047');
    sc.fx.explode(16, g.x, g.y - 20);
    if (g.glow) g.glow.destroy();
    if (g.shade) g.shade.destroy();
    if (g.tag) g.tag.destroy();
    sc.tweens.add({ targets: g.img, angle: { from: -12, to: 12 }, duration: 70, yoyo: true, repeat: 2, onComplete: function () { if (g.img) g.img.destroy(); } });
    var cam = sc.cameras.main, slot = document.querySelector('.w-bag-item[data-word="' + g.word + '"]'), fly = document.createElement('img');
    fly.src = artUrl(g.art); fly.className = 'w-fly';
    fly.style.left = (g.x - cam.worldView.x) * cam.zoom + 'px'; fly.style.top = (g.y - 40 - cam.worldView.y) * cam.zoom + 'px';
    document.body.appendChild(fly);
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (slot) { var r = slot.getBoundingClientRect(); fly.style.left = r.left + 'px'; fly.style.top = r.top + 'px'; fly.style.transform = 'scale(.5)'; } }); });
    setTimeout(function () { fly.remove(); drawBag(); var s2 = document.querySelector('.w-bag-item[data-word="' + g.word + '"]'); if (s2) { s2.classList.add('pop'); setTimeout(function () { s2.classList.remove('pop'); }, 300); } }, 620);
    return true;
  }

  /* ---------- Connected Treasure Island Story Landmarks & Companions ---------- */
  var ZONE_LANDMARKS = {
    0: [
      { id: 'lm_z0_chronicle', x: 1420, y: 720, label: '📜 Captain\'s Logbook', icon: 'o_map_scroll',
        title: '📜 The Treasure Island Logbook (Treasure Island Log)',
        story: 'Jim Hawkins and his baby leopard cub Benbow discovered Captain Flint\'s torn sea map at the Admiral Benbow Inn! Solve the English clues across all 4 chapters to board the Hispaniola and claim the Great Treasure!' },
      { id: 'lm_z0_well', x: 1780, y: 690, label: '🧭 Mariner\'s Well', icon: 'o_compass',
        title: '🧭 Ancient Mariner\'s Compass Well',
        story: 'Sailors who upgrade their Captain\'s Cabin, craft furniture, and play Crew Football & Volleyball earn bonus gold coins and energy for the voyage!' }
    ],
    1: [
      { id: 'lm_z1_sign', x: 1090, y: 700, label: '🪧 Admiral Benbow Sign', icon: 'o_map_scroll',
        title: '🪧 Chapter 1: Admiral Benbow Harbour',
        story: 'Welcome to Benbow Harbour! Help Jim Hawkins, Benbow the baby leopard, and Parrot Flint solve all 5 Map Clues to open Billy Bones\'s Sea Chest and unlock the Hispaniola ship at the eastern pier!' },
      { id: 'lm_z1_well', x: 1270, y: 720, label: '⛲ Harbour Spring', icon: 'o_compass',
        title: '⛲ Hispaniola Supply Spring',
        story: 'Squire Trelawney and the crew fill the Hispaniola\'s water barrels here before setting sail across the sea to Hispaniola Bay!' }
    ],
    2: [
      { id: 'lm_z2_hut', x: 760, y: 770, label: '🛖 Silver\'s Galley Hut', icon: 'o_hut',
        title: '🛖 Chapter 2: Long John Silver\'s Beach Galley',
        story: 'Long John Silver and Parrot Flint welcome you ashore at Hispaniola Bay! Gather sea shells, help First Mate Arrow & Cabin Boy Tom, and light the tall Spyglass Beacon at Stop 5!' }
    ],
    3: [
      { id: 'lm_z3_treehouse', x: 450, y: 480, label: '🏰 Stockade Watchtower', icon: 'o_treehouse',
        title: '🏰 Chapter 3: Dr. Livesey\'s Stockade Overlook',
        story: 'From high in the Stockade Watchtower, Dr. Livesey, Squire Trelawney, and Abraham Gray guard the map! Cross the river bridge and unlock the Stockade Fort!' }
    ],
    4: [
      { id: 'lm_z4_crystal', x: 600, y: 620, label: '🧭 Flint\'s Pointer Spire', icon: 'o_compass',
        title: '🧭 Chapter 4: Captain Flint\'s Compass Spire',
        story: 'Captain Smollett and Ben Gunn found Captain Flint\'s glowing pointer spire! Follow it to Stop 5 to open the Golden Treasure Vault!' }
    ]
  };

  var ZONE_COMPANIONS = {
    1: [
      { id: 'comp_benbow', x: 780, y: 650, h: 135, art: 'c_benbow', happy: 'c_benbow_happy', label: '🐆 Benbow',
        title: '🐆 Benbow the Baby Leopard',
        line: 'Purr-roar! I am Jim Hawkins\'s brave leopard cub Benbow! Walk along the sandy trail to solve all 5 Map Clues!' },
      { id: 'comp_billy', x: 1150, y: 640, h: 185, art: 'c_billy', happy: 'c_billy_happy', label: '🏴‍☠️ Billy Bones',
        title: '🏴‍☠️ Captain Billy Bones',
        line: 'Ahoy, young sailor! Keep a sharp eye on the sea with my brass spyglass! Solve all 5 clues to unlock my heavy Sea Chest!' },
      { id: 'comp_flint', x: 1830, y: 660, h: 125, art: 'c_pip', happy: 'c_pip_happy', label: '🦜 Parrot Flint',
        title: '🦜 Parrot Captain Flint',
        line: 'Squawk! Pieces of eight! The Hispaniola ship is anchored right here at the pier! Finish the 5 clues to set sail!', isFlint: true }
    ],
    2: [
      { id: 'comp_flint_z2', x: 1690, y: 715, h: 115, art: 'c_pip', happy: 'c_pip_happy', label: '🦜 Parrot Flint',
        title: '🦜 Parrot Captain Flint',
        line: 'Squawk! Captain Silver is waiting by the bay! Light the Spyglass Beacon at Clue 5!', isFlint: true }
    ]
  };

  function buildCompanions(sc) {
    sc.companions = [];
    if (S.inHouse) return;
    var list = ZONE_COMPANIONS[S.zone] || [];
    list.forEach(function (cp) {
      var img = sc.add.image(cp.x, cp.y, FLAT + cp.art).setOrigin(.5, .92).setDepth(cp.y);
      img.setScale((cp.h || 120) / img.height);
      sc.add.image(cp.x, cp.y, 'shadow').setScale(1.25).setDepth(-6);
      sc.tweens.add({ targets: img, y: cp.y - 8, duration: 820, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      var tag = makeWorldLabel(sc, cp.x, cp.y - (cp.h || 120) - 14, cp.label, '#fde047');
      sc.companions.push({
        kind: 'companion',
        cp: cp,
        img: img,
        tag: tag,
        x: cp.x,
        y: cp.y,
        def: { h: cp.h || 120, sw: 85 }
      });
    });
  }

  function buildLandmarks(sc) {
    sc.landmarks = [];
    if (S.inHouse) return;
    var list = ZONE_LANDMARKS[S.zone] || [];
    var st = root.WorldGame ? root.WorldGame.readState() : {};
    var seen = st.landmarksSeen || {};
    list.forEach(function (lm) {
      var done = !!seen[lm.id];
      var tag = makeWorldLabel(sc, lm.x, lm.y - 140, (done ? '✨ ' : '🔍 ') + lm.label, done ? '#a7f3d0' : '#38bdf8');
      sc.tweens.add({ targets: tag, y: lm.y - 148, duration: 850, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      sc.landmarks.push({
        kind: 'landmark',
        lm: lm,
        tag: tag,
        x: lm.x,
        y: lm.y,
        def: { h: 140, sw: 95 }
      });
    });
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
  var IDLE_FRAME = { down: 0, diag: 5, side: 10, up: 15 };
  var CHEER_FRAME = 20;
  function dirFromVec(vx, vy) {
    var ax = Math.abs(vx), ay = Math.abs(vy);
    if (vy < 0 && ay > ax * 0.68) return 'up';
    if (vy > 0 && ay > ax * 1.45) return 'down';
    if (vy > 0 && ay > ax * 0.34) return 'diag';
    return 'side';
  }
  function stepWalkerAnim(w, vx, vy) {
    var moving = !!(vx || vy);
    if (moving && !w.cheering) {
      var d = dirFromVec(vx, vy);
      w.facingDir = d;
      var animKey = w.monKey + '-walk-' + d;
      if (!w.anims.isPlaying || !w.anims.currentAnim || w.anims.currentAnim.key !== animKey) {
        w.play(animKey, true);
      }
      if (d === 'down') {
        w.setFlipX(false);
      } else if (Math.abs(vx) > 0.06) {
        w.setFlipX(vx < 0);
      }
    } else if (!w.cheering && w.anims.isPlaying) {
      w.anims.stop();
      w.setFrame(IDLE_FRAME[w.facingDir || 'down'] || 0);
    }
  }
  // the monster keeps its glossy 3D shading with a crisp dark cel outline so it pops against the ground
  function drawCartoon(c, img, x0, y0) {
    y0 = y0 || 0;
    var fc = document.createElement('canvas'); fc.width = fc.height = FRAME;
    var fx = fc.getContext('2d'); fx.drawImage(img, 0, 0, FRAME, FRAME);
    var sil = document.createElement('canvas'); sil.width = sil.height = FRAME;
    var sx = sil.getContext('2d'); sx.drawImage(fc, 0, 0); sx.globalCompositeOperation = 'source-in'; sx.fillStyle = '#1e1b4b'; sx.fillRect(0, 0, FRAME, FRAME);
    c.save();
    c.beginPath(); c.rect(x0 + 3, y0 + 2, FRAME - 6, FRAME - 4); c.clip();
    for (var a = 0; a < 12; a++) c.drawImage(sil, x0 + Math.cos(a / 12 * 6.283) * 3.2, y0 + Math.sin(a / 12 * 6.283) * 3.2);
    c.drawImage(fc, x0, y0);
    c.restore();
  }
  async function bakeMonster(sc, key, opts) {
    var eq = Object.assign({}, opts.equipped || {}); delete eq.background; delete eq.aura; delete eq.pet;
    var markup = root.MonsterRenderer.renderMonsterSVG({ stage: opts.stage, color: opts.color, equipped: eq, size: FRAME, animated: false, isAvatar: true });
    var base = new DOMParser().parseFromString(markup, 'image/svg+xml').documentElement;
    ['.monster-pedestal-stage', '.mon-rig-shadow'].forEach(function (q) { var el = base.querySelector(q); if (el) el.remove(); });
    var NS = 'http://www.w3.org/2000/svg';
    var splitPair = function (parent, clsL, clsR) {
      if (!parent || parent.children.length < 2 || parent.children.length % 2 !== 0) return;
      var kids = [].slice.call(parent.children), half = kids.length / 2, l = document.createElementNS(NS, 'g'), r = document.createElementNS(NS, 'g');
      l.setAttribute('class', clsL); r.setAttribute('class', clsR);
      kids.forEach(function (k, i) { (i < half ? l : r).appendChild(k); });
      parent.appendChild(l); parent.appendChild(r);
    };
    var feet = base.querySelector('.plush-feet');
    if (feet && !feet.querySelector('.foot-l')) splitPair(feet, 'foot-l', 'foot-r');

    // 21-frame all-sides sprite sheet:
    // 0..4: DOWN (Front View: 0=idle, 1..4=walk)
    // 5..9: DIAG (3/4 Front-Side View: 5=idle, 6..9=walk)
    // 10..14: SIDE (True 90° Side Profile: 10=idle, 11..14=walk)
    // 15..19: UP (True Back View: 15=idle, 16..19=walk)
    // 20: CHEER (Jump Cheer Pose)
    var poses = [
      // DOWN (Front View)
      { view: 'down', bob: 0, tilt: 0, lx: 0, ly: 0, lr: 0, rx: 0, ry: 0, rr: 0, armL: 0, armR: 0, ear: 0, tail: 0 },
      { view: 'down', bob: -4.5, tilt: -2.8, lx: -2, ly: -11, lr: 10, rx: 2, ry: 3, rr: -4, armL: 28, armR: -28, ear: 9, tail: -14, walk: true },
      { view: 'down', bob: 1.5, tilt: -1.0, lx: -1, ly: -3, lr: 4, rx: 1, ry: -2, rr: -2, armL: 10, armR: -10, ear: 4, tail: -6, walk: true },
      { view: 'down', bob: -4.5, tilt: 2.8, lx: -2, ly: 3, lr: -4, rx: 2, ry: -11, rr: -10, armL: -28, armR: 28, ear: -9, tail: 14, walk: true },
      { view: 'down', bob: 1.5, tilt: 1.0, lx: -1, ly: -2, lr: -2, rx: 1, ry: -3, rr: 4, armL: -10, armR: 10, ear: -4, tail: 6, walk: true },
      // DIAG (3/4 Front-Side View)
      { view: 'diag', bob: 0, tilt: 0, lx: 4, ly: 0, lr: 0, rx: -4, ry: 0, rr: 0, armL: 0, armR: 0, ear: 0, tail: 0 },
      { view: 'diag', bob: -5.0, tilt: 3.5, lx: 20, ly: -9, lr: -18, rx: -18, ry: 1, rr: 16, armL: -32, armR: 26, ear: -10, tail: -16, walk: true },
      { view: 'diag', bob: 1.5, tilt: 1.5, lx: 8, ly: 1, lr: 4, rx: -6, ry: -4, rr: -6, armL: -10, armR: 8, ear: 4, tail: -6, walk: true },
      { view: 'diag', bob: -5.0, tilt: 3.5, lx: -12, ly: 1, lr: 16, rx: 14, ry: -9, rr: -18, armL: 28, armR: -24, ear: 10, tail: 16, walk: true },
      { view: 'diag', bob: 1.5, tilt: 1.5, lx: -2, ly: -4, lr: -6, rx: 4, ry: 1, rr: 4, armL: 10, armR: -8, ear: -4, tail: 6, walk: true },
      // SIDE (True 90° Side Profile)
      { view: 'side', bob: 0, tilt: 0, lx: 6, ly: 0, lr: 0, rx: -6, ry: 0, rr: 0, armL: 0, armR: 0, ear: 0, tail: 0 },
      { view: 'side', bob: -5.5, tilt: 4.2, lx: 26, ly: -10, lr: -22, rx: -24, ry: -2, rr: 20, armL: -36, armR: 28, ear: -12, tail: -18, walk: true },
      { view: 'side', bob: 1.5, tilt: 1.5, lx: 10, ly: 1, lr: 4, rx: -8, ry: -5, rr: -8, armL: -12, armR: 10, ear: 4, tail: -6, walk: true },
      { view: 'side', bob: -5.5, tilt: 4.2, lx: -14, ly: -2, lr: 20, rx: 14, ry: -10, rr: -22, armL: 34, armR: -28, ear: 12, tail: 18, walk: true },
      { view: 'side', bob: 1.5, tilt: 1.5, lx: -2, ly: -5, lr: -8, rx: 2, ry: 1, rr: 4, armL: 12, armR: -10, ear: -4, tail: 6, walk: true },
      // UP (True Back View)
      { view: 'up', bob: 0, tilt: 0, lx: 0, ly: 0, lr: 0, rx: 0, ry: 0, rr: 0, armL: 0, armR: 0, ear: 0, tail: 0 },
      { view: 'up', bob: -4.5, tilt: 2.8, lx: -2, ly: -12, lr: 10, rx: 2, ry: 2, rr: -4, armL: -26, armR: 26, ear: -9, tail: -18, walk: true },
      { view: 'up', bob: 1.5, tilt: 1.0, lx: -1, ly: -3, lr: 4, rx: 1, ry: -2, rr: -2, armL: -10, armR: 10, ear: -4, tail: -6, walk: true },
      { view: 'up', bob: -4.5, tilt: -2.8, lx: -2, ly: 2, lr: -4, rx: 2, ry: -12, rr: -10, armL: 26, armR: -26, ear: 9, tail: 18, walk: true },
      { view: 'up', bob: 1.5, tilt: -1.0, lx: -1, ly: -2, lr: -2, rx: 1, ry: -3, rr: 4, armL: 10, armR: -10, ear: 4, tail: 6, walk: true },
      // CHEER
      { view: 'down', bob: -7, tilt: 0, lx: -5, ly: -8, lr: 16, rx: 5, ry: -8, rr: -16, armL: 145, armR: -145, ear: 14, tail: 18, cheer: true }
    ];
    var COLS = 7, ROWS = Math.ceil(poses.length / COLS);
    var canvas = document.createElement('canvas'); canvas.width = FRAME * COLS; canvas.height = FRAME * ROWS;
    var c = canvas.getContext('2d'), ser = new XMLSerializer();
    var imgs = await Promise.all(poses.map(async function (p) {
      var svg = base.cloneNode(true);
      var setSvg = function (q, tr) { [].forEach.call(svg.querySelectorAll(q), function (el) { el.setAttribute('transform', tr); }); };
      var prependSvg = function (q, tr) {
        [].forEach.call(svg.querySelectorAll(q), function (el) {
          var prev = el.getAttribute('transform') || '';
          el.setAttribute('transform', tr + (prev ? ' ' + prev : ''));
        });
      };
      var setCss = function (q, tr) { [].forEach.call(svg.querySelectorAll(q), function (el) { el.style.transform = tr; }); };
      var clipEl = svg.querySelector('clipPath[id^="mon-clip-"]');
      var clipUrl = clipEl ? 'url(#' + clipEl.id + ')' : '';
      setSvg('.monster-bob-group', 'translate(0 ' + p.bob + ') rotate(' + (p.tilt || 0) + ' 100 146)');

      if (p.view === 'side') {
        // TRUE 90° SIDE PROFILE (facing right; mirrored when walking left)
        [].forEach.call(svg.querySelectorAll('.mon-body-breathe'), function (el) {
          if (!el.querySelector('.mon-arm')) el.setAttribute('transform', 'translate(104 0) scale(0.85 1) translate(-104 0)');
        });
        [].forEach.call(svg.querySelectorAll('[fill^="url(#plush-belly-"], .mon-belly-mark'), function (el) {
          el.setAttribute('transform', 'translate(26 0) translate(100 136) scale(0.72 1) translate(-100 -136)');
          if (clipUrl) el.setAttribute('clip-path', clipUrl);
        });
        [].forEach.call(svg.querySelectorAll('.monster-bob-group > g[transform^="translate(0 "]'), function (el) {
          var prevC = el.getAttribute('transform') || '';
          el.setAttribute('transform', 'translate(104 0) scale(0.85 1) translate(-100 0) ' + prevC);
          [].forEach.call(el.querySelectorAll('path[fill="#dc2626"], line[stroke="#fef08a"]'), function (tailPart) {
            tailPart.setAttribute('transform', 'translate(200 0) scale(-1 1)');
          });
        });
        [].forEach.call(svg.querySelectorAll('path[fill^="url(#mon-fin-"]'), function (el) {
          var d = el.getAttribute('d') || '';
          if (/^M\s*1[1-9]\d/.test(d)) el.setAttribute('display', 'none');
          else el.setAttribute('transform', 'translate(9 1) rotate(-5 65 90)');
        });
        [].forEach.call(svg.querySelectorAll('.monster-ear-front, .mon-ear-r'), function (el) { el.setAttribute('display', 'none'); });
        [].forEach.call(svg.querySelectorAll('.monster-ear-rear'), function (el) { el.setAttribute('transform', 'translate(12 2)'); });
        var eyes = svg.querySelectorAll('.plush-face .mon-eye');
        if (eyes.length >= 2) {
          eyes[1].setAttribute('display', 'none');
          var prevE0 = eyes[0].getAttribute('transform') || '';
          eyes[0].setAttribute('transform', 'translate(29 -1) translate(84 114) scale(0.82 1) translate(-84 -114) ' + prevE0);
          [].forEach.call(eyes[0].querySelectorAll('ellipse, circle'), function (el) {
            var fill = el.getAttribute('fill') || '';
            var r = Number(el.getAttribute('r') || 0);
            if (fill === '#090d16') el.setAttribute('transform', 'translate(5.4 0)');
            else if (fill === '#ffffff') el.setAttribute('transform', r >= 2.2 ? 'translate(8.2 0.4)' : 'translate(4.5 0)');
            else if (fill.indexOf('url(#plush-eye-iris-') === 0) el.setAttribute('transform', 'translate(2.4 0)');
          });
        }
        [].forEach.call(svg.querySelectorAll('.plush-face > ellipse, .plush-face > circle'), function (el) {
          var fill = el.getAttribute('fill') || '';
          var cx = Number(el.getAttribute('cx') || 0);
          if (fill.indexOf('url(#plush-snout-') === 0) el.setAttribute('transform', 'translate(27 -1) translate(100 121) scale(0.68 0.9) translate(-100 -121)');
          else if (fill === '#0f172a') el.setAttribute('transform', 'translate(33 -1)');
          else if (cx >= 98 && cx <= 101 && fill === '#ffffff') el.setAttribute('transform', 'translate(33 -1)');
          else if (cx > 110) el.setAttribute('display', 'none');
          else if (cx < 90) el.setAttribute('transform', 'translate(25 1)');
        });
        var mouthG = svg.querySelector('.plush-face .mon-mouth');
        if (mouthG) {
          var my = Number(mouthG.getAttribute('data-my') || 127);
          mouthG.innerHTML =
            '<path d="M 116 ' + (my + 1.5) + ' Q 124 ' + (my + 5.5) + ' 131 ' + (my - 0.5) + '" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" />' +
            '<path d="M 114.5 ' + (my - 0.5) + ' q 1.2 1.6 2 3" fill="none" stroke="#0f172a" stroke-width="1.4" stroke-linecap="round" opacity="0.6" />';
        }
        prependSvg('.monster-eyewear', 'translate(20 -1) translate(100 112) scale(0.75 1) translate(-100 -112)');
        prependSvg('.monster-hat', 'translate(-22 1) rotate(-14 100 65)');
        prependSvg('.monster-tail-layer', 'translate(190 0) scale(-1 1)');
        setCss('.mon-ear-l', 'translate(10px, -2px) rotate(' + (p.ear || 0) + 'deg)');
        [].forEach.call(svg.querySelectorAll('.mon-arm-l'), function (el) { el.setAttribute('display', 'none'); });
        setCss('.mon-arm-r', 'translate(-35px, 2px) rotate(' + (p.armL || 0) + 'deg)');
      } else if (p.view === 'diag') {
        // 3/4 DIAGONAL VIEW (turned 45° toward the walking direction; both eyes visible with perspective foreshortening)
        [].forEach.call(svg.querySelectorAll('.mon-body-breathe'), function (el) {
          if (!el.querySelector('.mon-arm')) el.setAttribute('transform', 'translate(102 0) scale(0.93 1) translate(-102 0)');
        });
        [].forEach.call(svg.querySelectorAll('[fill^="url(#plush-belly-"], .mon-belly-mark'), function (el) {
          el.setAttribute('transform', 'translate(14 0) translate(100 136) scale(0.84 1) translate(-100 -136)');
          if (clipUrl) el.setAttribute('clip-path', clipUrl);
        });
        prependSvg('.plush-face', 'translate(15 0)');
        var dEyes = svg.querySelectorAll('.plush-face .mon-eye');
        if (dEyes.length >= 2) {
          var pe0 = dEyes[0].getAttribute('transform') || '';
          dEyes[0].setAttribute('transform', 'translate(3 0) ' + pe0);
          var pe1 = dEyes[1].getAttribute('transform') || '';
          dEyes[1].setAttribute('transform', 'translate(-5 0) translate(116 114) scale(0.70 0.96) translate(-116 -114) ' + pe1);
        }
        [].forEach.call(svg.querySelectorAll('.plush-face .mon-eye > ellipse, .plush-face .mon-eye > circle'), function (el) {
          var fill = el.getAttribute('fill') || '';
          if (fill === '#090d16' || fill === '#ffffff' || fill.indexOf('url(#plush-eye-iris-') === 0) {
            var dpx = fill === '#090d16' || fill === '#ffffff' ? 3.2 : 1.6;
            el.setAttribute('transform', 'translate(' + dpx + ' 0.6)');
          }
        });
        [].forEach.call(svg.querySelectorAll('.plush-face > ellipse'), function (el) {
          var cx = Number(el.getAttribute('cx') || 0);
          if (cx > 115) el.setAttribute('opacity', '0.18');
          else if (cx < 85 && cx > 60) el.setAttribute('transform', 'translate(5 0)');
        });
        [].forEach.call(svg.querySelectorAll('path[fill^="url(#mon-fin-"]'), function (el) {
          var d = el.getAttribute('d') || '';
          if (/^M\s*1[1-9]\d/.test(d)) el.setAttribute('transform', 'translate(-12 0) translate(136 90) scale(0.42 0.9) translate(-136 -90)');
          else el.setAttribute('transform', 'translate(2 0) rotate(-4 65 90)');
        });
        prependSvg('.monster-eyewear', 'translate(14 0)');
        prependSvg('.monster-hat', 'translate(-6 0) rotate(-4 100 65)');
        prependSvg('.monster-tail-layer', 'translate(194 0) scale(-1 1)');
        setCss('.mon-ear-l', 'translate(7px, 0px) rotate(' + (p.ear || 0) + 'deg)');
        setCss('.mon-ear-r', 'translate(-4px, -1px) scale(0.86, 0.95) rotate(' + (-(p.ear || 0)) + 'deg)');
        setCss('.mon-arm-l', 'translate(16px, -1px) rotate(' + (p.armL || 0) + 'deg)');
        setCss('.mon-arm-r', 'translate(-8px, 1px) scale(0.84, 0.92) rotate(' + (p.armR || 0) + 'deg)');
      } else if (p.view === 'up') {
        // TRUE BACK VIEW (walking away from camera / North): hide face, eyewear, and front belly; show back seam, collar back, and centered wagging tail on lower back
        [].forEach.call(svg.querySelectorAll('.plush-face, .monster-eyewear, [fill^="url(#plush-belly-"], .mon-belly-mark'), function (el) {
          el.setAttribute('display', 'none');
        });
        // Hide front-only scarf hanging triangle/tassels so only the wrap-around back collar shows
        [].forEach.call(svg.querySelectorAll('.monster-bob-group > g[transform^="translate(0 "] path[fill="#dc2626"], .monster-bob-group > g[transform^="translate(0 "] line[stroke="#fef08a"]'), function (el) {
          el.setAttribute('display', 'none');
        });
        // Add subtle plush back-seam & lower-back shading inside the torso group
        var torsoG = svg.querySelector('.mon-body-breathe');
        if (torsoG) {
          var seam = svg.ownerDocument.createElementNS(NS, 'path');
          seam.setAttribute('d', 'M 100 76 Q 99 108 100 138');
          seam.setAttribute('fill', 'none');
          seam.setAttribute('stroke', '#ffffff');
          seam.setAttribute('stroke-width', '1.8');
          seam.setAttribute('stroke-dasharray', '4 4');
          seam.setAttribute('stroke-linecap', 'round');
          seam.setAttribute('opacity', '0.28');
          torsoG.appendChild(seam);
        }
        // Move tail to the foreground of `.monster-bob-group` and center it on the lower back so it wags in front of the camera
        var bobG = svg.querySelector('.monster-bob-group');
        var tailLayer = svg.querySelector('.monster-tail-layer');
        if (bobG && tailLayer) {
          bobG.appendChild(tailLayer);
        }
        prependSvg('.monster-tail-layer', 'translate(-28 2)');
        setCss('.mon-ear-l', 'rotate(' + (p.ear || 0) + 'deg)');
        setCss('.mon-ear-r', 'rotate(' + (-(p.ear || 0)) + 'deg)');
        setCss('.mon-arm-l', 'translate(0px, ' + (p.armL ? (p.armL > 0 ? -4 : 3) : 0) + 'px) rotate(' + (p.armL || 0) + 'deg)');
        setCss('.mon-arm-r', 'translate(0px, ' + (p.armR ? (p.armR < 0 ? -4 : 3) : 0) + 'px) rotate(' + (p.armR || 0) + 'deg)');
      } else {
        // DOWN (Front View: idle, walking toward camera, or cheer)
        if (p.walk) {
          prependSvg('.plush-face', 'translate(0 1.5)');
          [].forEach.call(svg.querySelectorAll('.plush-face .mon-eye > ellipse, .plush-face .mon-eye > circle'), function (el) {
            var fill = el.getAttribute('fill') || '';
            if (fill === '#090d16' || fill === '#ffffff') el.setAttribute('transform', 'translate(0 1.8)');
          });
        }
        if (p.armL) setCss('.mon-arm-l', 'translate(0px, ' + (p.armL > 0 && !p.cheer ? -3 : 2) + 'px) rotate(' + p.armL + 'deg)');
        if (p.armR) setCss('.mon-arm-r', 'translate(0px, ' + (p.armR < 0 && !p.cheer ? -3 : 2) + 'px) rotate(' + p.armR + 'deg)');
        if (p.ear) {
          setCss('.mon-ear-l', 'rotate(' + p.ear + 'deg)');
          setCss('.mon-ear-r', 'rotate(' + (-p.ear) + 'deg)');
        }
      }
      if (p.lx || p.ly || p.lr) setSvg('.foot-l', 'translate(' + (p.lx || 0) + ' ' + (p.ly || 0) + ') rotate(' + (p.lr || 0) + ' 80 156)');
      if (p.rx || p.ry || p.rr) setSvg('.foot-r', 'translate(' + (p.rx || 0) + ' ' + (p.ry || 0) + ') rotate(' + (p.rr || 0) + ' 120 156)');
      if (p.tail) setCss('.mon-tail-wag', 'rotate(' + p.tail + 'deg)');
      if (p.cheer && root.MonsterRenderer && root.MonsterRenderer.setMouth) {
        root.MonsterRenderer.setMouth(svg, 'mouth-cheer');
      }
      svg.setAttribute('width', FRAME); svg.setAttribute('height', FRAME);
      var url = URL.createObjectURL(new Blob([ser.serializeToString(svg)], { type: 'image/svg+xml' }));
      var img = await loadImg(url);
      URL.revokeObjectURL(url);
      return img;
    }));
    imgs.forEach(function (img, i) {
      var col = i % COLS, row = Math.floor(i / COLS);
      drawCartoon(c, img, FRAME * col, FRAME * row);
    });
    var animDirs = { down: [1, 2, 3, 4], diag: [6, 7, 8, 9], side: [11, 12, 13, 14], up: [16, 17, 18, 19] };
    if (sc.textures.exists(key)) {
      ['-walk', '-walk-down', '-walk-diag', '-walk-side', '-walk-up'].forEach(function (suf) {
        if (sc.anims.exists(key + suf)) sc.anims.remove(key + suf);
      });
      sc.textures.remove(key);
    }
    var tex = sc.textures.addCanvas(key, canvas);
    poses.forEach(function (_, n) {
      var col = n % COLS, row = Math.floor(n / COLS);
      tex.add(n, 0, FRAME * col, FRAME * row, FRAME, FRAME);
    });
    Object.keys(animDirs).forEach(function (d) {
      sc.anims.create({
        key: key + '-walk-' + d,
        frames: animDirs[d].map(function (f) { return { key: key, frame: f }; }),
        frameRate: 10,
        repeat: -1
      });
    });
    sc.anims.create({
      key: key + '-walk',
      frames: animDirs.side.map(function (f) { return { key: key, frame: f }; }),
      frameRate: 10,
      repeat: -1
    });
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
      if (!m.ride) m.ride = sc.add.image(m.x, m.y, rid).setOrigin(.5, .78);
      else m.ride.setTexture(rid).setVisible(true);
      m.ride.setScale(148 / m.ride.height);
    };
    if (sc.textures.exists(rid)) apply();
    else { sc.load.image(rid, artUrl(rid)); sc.load.once('complete', apply); sc.load.start(); }
  }
  function syncPet(sc, m) {
    if (!m || m.monKey !== 'me') return;
    var eq = monsterLook().equipped || {}, pid = eq.pet || null;
    if (!pid || !root.MonsterPets || typeof root.MonsterPets.getDataUri !== 'function') {
      if (m.pet) m.pet.setVisible(false);
      if (m.petShadow) m.petShadow.setVisible(false);
      return;
    }
    var uri = root.MonsterPets.getDataUri(pid);
    if (!uri) {
      if (m.pet) m.pet.setVisible(false);
      if (m.petShadow) m.petShadow.setVisible(false);
      return;
    }
    var texKey = 'pet_' + pid;
    var apply = function () {
      if (!m.active || !sc.textures.exists(texKey)) return;
      if (!m.petShadow) m.petShadow = sc.add.image(m.x - 56, m.y + 8, 'shadow').setScale(0.52).setAlpha(0.35).setDepth(-5);
      else m.petShadow.setVisible(true);
      if (!m.pet) {
        m.pet = sc.add.image(m.x - 56, m.y + 6, texKey).setOrigin(0.5, 0.9);
        m.petX = m.x - 56;
        m.petY = m.y + 8;
        m.petPhase = 0;
      } else {
        m.pet.setTexture(texKey).setVisible(true);
      }
      m.pet.setScale(62 / Math.max(1, m.pet.height));
    };
    if (sc.textures.exists(texKey)) apply();
    else loadImg(uri).then(function (img) { if (!sc.textures.exists(texKey)) sc.textures.addImage(texKey, img); apply(); }).catch(function () {});
  }
  function makeWalker(sc, key, x, y, scale) {
    var shadow = sc.add.image(x, y, 'shadow').setScale(scale * 1.18).setAlpha(0.42).setDepth(-5);
    var m = sc.physics.add.sprite(x, y, key, 0).setOrigin(.5, .84).setScale(scale).setVisible(false);
    m.body.setCircle(44, FRAME / 2 - 44, FRAME * .84 - 44);
    m.setCollideWorldBounds(true); m.monKey = key; m.shadow = shadow; m.baseScale = scale;
    // what you see is this copy: the body underneath does the physics, so hopping never changes where the monster really is
    m.skin = sc.add.sprite(x, y, key, 0).setOrigin(.5, .84).setScale(scale);
    m.walkPhase = Math.random() * 6; m.turn = 1; m.turnVel = 0; m.pace = 0;
    m.launchPop = 0; m.landSquash = 0; m.stepImpact = 0; m.cheerHop = 0; m.prevSin = 0; m.wasMoving = false;
    if (key === 'me') { syncRide(sc, m); syncPet(sc, m); }
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
    var sk = m.skin, vx = m.body.velocity.x, vy = m.body.velocity.y, v = Math.sqrt(vx * vx + vy * vy), target = Math.min(1.25, v / 195);
    var isMovingNow = v > 28;
    if (isMovingNow && !m.wasMoving) {
      m.launchPop = Math.max(m.launchPop || 0, 0.9);
      m.walkPhase = 0.35;
    } else if (!isMovingNow && m.wasMoving) {
      m.landSquash = 1.0;
    }
    m.wasMoving = isMovingNow;

    m.pace += (target - m.pace) * Math.min(1, delta * (isMovingNow ? .022 : .028));
    m.walkPhase += delta * .0048 * (.38 + v / 76);
    if (m.anims && m.anims.isPlaying) {
      m.anims.timeScale = 0.85 + Math.min(1.45, v / 185) * 0.55;
    }

    // Spring-damped 3D horizontal turn flip
    var targetTurn = m.flipX ? -1 : 1;
    var dtNorm = Math.min(2.5, delta / 16.67);
    m.turnVel = ((m.turnVel || 0) + (targetTurn - m.turn) * 0.28 * dtNorm) * Math.pow(0.76, dtNorm);
    m.turn += m.turnVel * dtNorm;
    if (Math.abs(targetTurn - m.turn) < 0.01 && Math.abs(m.turnVel) < 0.01) { m.turn = targetTurn; m.turnVel = 0; }

    // Decay transient impulses (launch pop, footstrike impact, landing squash)
    m.launchPop = Math.max(0, (m.launchPop || 0) - delta * 0.0055);
    m.stepImpact = Math.max(0, (m.stepImpact || 0) - delta * 0.0075);
    m.landSquash = Math.max(0, (m.landSquash || 0) - delta * 0.0038);

    var sSin = Math.sin(m.walkPhase), absS = Math.abs(sSin);
    if (m.pace > 0.32 && ((m.prevSin || 0) * sSin <= 0) && Math.abs(sSin - (m.prevSin || 0)) > 0.04) {
      m.stepImpact = 1.0;
      if (m.monKey === 'me' && scene && scene.dust) {
        var zone = ZONES[S.zone], wet = zone && zone.shallows ? zone.shallows(m.x, m.y) : false;
        var footX = m.x + (sSin >= 0 ? -12 : 12) * (m.flipX ? -1 : 1);
        (wet ? scene.waterFx : scene.dust).explode(wet ? 5 : 3, footX, m.y + 4);
      }
    }
    m.prevSin = sSin;

    var strideArc = Math.pow(absS, 0.72);
    var hop = strideArc * 21 * Math.min(1.15, m.pace) + (m.launchPop || 0) * 8 + (m.cheerHop || 0);
    var apexStretch = Math.max(0, strideArc - 0.45) * 0.14 * m.pace + (m.launchPop || 0) * 0.08;
    var impactSquash = (m.stepImpact || 0) * 0.085 * Math.min(1, m.pace) + Math.sin((m.landSquash || 0) * Math.PI) * 0.135;
    var breathe = Math.sin(time * .0032 + m.walkPhase) * .022 * Math.max(0, 1 - m.pace);

    if (sk.texture !== m.texture) sk.setTexture(m.texture.key, m.frame.name); else if (sk.frame.name !== m.frame.name) sk.setFrame(m.frame.name);
    var onRide = !!(m.ride && m.ride.visible);
    if (v > 25) m.sitting = false;
    var sitLift = m.sitting ? 24 : 0;
    var riderScale = onRide ? m.baseScale * 0.74 : m.baseScale;
    var sxFactor = 1 - apexStretch * 0.58 + impactSquash * 0.78 - breathe * 0.6;
    var syFactor = 1 + apexStretch - impactSquash * 0.85 + breathe;
    var turnMag = Math.max(0.18, Math.min(1.08, Math.abs(m.turn)));

    sk.setPosition(m.x, m.y - hop - (onRide ? 38 : sitLift));
    sk.setScale(riderScale * sxFactor * turnMag, riderScale * syFactor);
    sk.setFlipX(m.turn < 0);
    sk.rotation = (sSin * .115 * Math.min(1.1, m.pace)) + (vx / 230) * .095;
    sk.setDepth(m.y + 2);
    if (onRide) {
      m.ride.setPosition(m.x, m.y - hop * .58 + 6);
      m.ride.setFlipX(m.turn < 0);
      m.ride.rotation = (vx / 260) * 0.06;
      m.ride.setDepth(m.y + 1);
    }
    var shScale = m.baseScale * (onRide ? 1.45 : 1.18) * (1 - hop * .014 + impactSquash * .42);
    m.shadow.setPosition(m.x, m.y + 3);
    m.shadow.setScale(shScale, shScale * 0.9);
    m.shadow.setAlpha(Math.max(0.16, Math.min(0.52, 0.42 - hop * 0.0065 + impactSquash * 0.22)));
    if (m.pet && m.pet.visible) {
      var trailSide = (m.turn < 0) ? 56 : -56;
      var targetPX = m.x + trailSide;
      var targetPY = m.y + 8;
      var followLerp = Math.min(1, delta * 0.009);
      var dxP = targetPX - (m.petX !== undefined ? m.petX : targetPX);
      var dyP = targetPY - (m.petY !== undefined ? m.petY : targetPY);
      m.petX = (m.petX !== undefined ? m.petX : targetPX) + dxP * followLerp;
      m.petY = (m.petY !== undefined ? m.petY : targetPY) + dyP * followLerp;
      var petDist = Math.hypot(dxP, dyP);
      m.petPhase = (m.petPhase || 0) + delta * (petDist > 6 || isMovingNow ? 0.015 : 0.004);
      var petHop = (petDist > 6 || isMovingNow) ? Math.abs(Math.sin(m.petPhase)) * 11 : (Math.sin(m.petPhase) + 1) * 2;
      m.pet.setPosition(m.petX, m.petY - petHop);
      if (Math.abs(dxP) > 3.5) m.pet.setFlipX(dxP < 0);
      else m.pet.setFlipX(m.turn < 0);
      m.pet.rotation = (petDist > 6 || isMovingNow) ? Math.sin(m.petPhase) * 0.09 : 0;
      m.pet.setDepth(m.petY + 1);
      if (m.petShadow && m.petShadow.visible) {
        m.petShadow.setPosition(m.petX, m.petY + 2);
        m.petShadow.setScale(0.52 * (1 - Math.max(0, petHop) * 0.015));
        m.petShadow.setDepth(-5);
      }
    }
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
  function hasLineOfSight(G, x0, y0, x1, y1) {
    var dx = x1 - x0, dy = y1 - y0, dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 8) return true;
    var steps = Math.ceil(dist / 16);
    for (var i = 1; i <= steps; i++) {
      var t = i / steps, px = x0 + dx * t, py = y0 + dy * t;
      var c = Math.floor(px / CELL), r = Math.floor(py / CELL);
      if (!G.g[r] || G.g[r][c] !== 0) return false;
    }
    return true;
  }
  function findPath(G, sx, sy, tx, ty) {
    var cc = function (v) { return Math.max(0, Math.min(G.cols - 1, Math.floor(v / CELL))); }, cr = function (v) { return Math.max(0, Math.min(G.rows - 1, Math.floor(v / CELL))); };
    if (hasLineOfSight(G, sx, sy, tx, ty)) return [{ x: tx, y: ty }];
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
        if (cost[nid] === undefined || n < cost[nid]) { cost[nid] = n; came[nid] = cid; open.push([n + Math.hypot(nc - b[0], nr - b[1]), nc, nr]); }
      }
    }
    if (cost[goal] === undefined) return [];
    var out = [], step = goal;
    while (step !== start) { out.unshift({ x: (step % G.cols) * CELL + CELL / 2, y: Math.floor(step / G.cols) * CELL + CELL / 2 }); step = came[step]; }
    if (out.length && G.g[cr(ty)] && G.g[cr(ty)][cc(tx)] === 0) {
      out[out.length - 1] = { x: tx, y: ty };
    }
    // String-pulling path smoothing so movement never zig-zags along grid cells
    var smooth = [], curPt = { x: sx, y: sy }, idx = 0;
    while (idx < out.length) {
      var furthest = idx;
      for (var j = out.length - 1; j > idx; j--) {
        if (hasLineOfSight(G, curPt.x, curPt.y, out[j].x, out[j].y)) { furthest = j; break; }
      }
      smooth.push(out[furthest]);
      curPt = out[furthest];
      idx = furthest + 1;
    }
    return smooth;
  }
  function spawnTapRipple(sc, x, y, isTarget) {
    if (!sc || !sc.add) return;
    var col = isTarget ? 0xfde047 : 0x38bdf8;
    var ring1 = sc.add.ellipse(x, y, 18, 10).setStrokeStyle(3.5, col, 0.95).setDepth(y - 1);
    var ring2 = sc.add.ellipse(x, y, 10, 6).setFillStyle(col, 0.45).setDepth(y - 1);
    sc.tweens.add({ targets: ring1, scaleX: 3.4, scaleY: 3.1, alpha: 0, duration: 480, ease: 'Cubic.Out', onComplete: function () { ring1.destroy(); } });
    sc.tweens.add({ targets: ring2, scaleX: 2.1, scaleY: 1.9, alpha: 0, duration: 340, ease: 'Quad.Out', onComplete: function () { ring2.destroy(); } });
  }
  function stopWalking() { S.path = []; S.onArrive = null; if (scene && scene.player && scene.player.body) scene.player.setVelocity(0); }
  function walkTo(x, y, onArrive) {
    var sc = scene, m = sc.player;
    S.path = findPath(sc.grid, m.x, m.y, x, y); S.onArrive = onArrive || null; S.stuck = 0;
    if (S.path.length && m) {
      var first = S.path[0];
      if (Math.abs(first.x - m.x) > 4) m.setFlipX(first.x < m.x);
      m.launchPop = 0.85;
    }
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
      $('w-goal').innerHTML = '✋ Decorate Mode<small>Tap an item in the tray or yard, then tap where to place it!</small>';
      return;
    }
    var visiting = (z === 0 && S.visitingFriend) ? S.visitingFriend : null;
    if ($('w-decor')) {
      $('w-decor').style.display = (z === 0 && !visiting) ? '' : 'none';
      $('w-decor').innerHTML = '<img src="art/flat/o_workbench.webp" alt=""><span>' + (S.moveMode ? 'Done' : 'Move') + '</span>';
    }
    if ($('w-home')) $('w-home').innerHTML = '<img src="art/flat/u_build.webp" alt=""><span>' + (visiting ? 'My Home' : 'Home Studio') + '</span>';
    if (z === 0) {
      var st = visiting && visiting.world ? visiting.world : (root.WorldGame ? root.WorldGame.readState() : { houseTier: 1, placed: [] });
      var tier = (root.WorldGame && root.WorldGame.HOUSE_TIERS[(st.houseTier || 1) - 1]) || { name: 'Cosy Tent' };
      if (S.inHouse) {
        $('w-goal').innerHTML = '🛋️ Inside ' + (visiting ? esc(visiting.first_name) + '\'s ' : 'My ') + tier.name + '<small>Drag any furniture to move it, tap to rest, or walk to the bottom door to go outside!</small>';
      } else if (visiting) {
        $('w-goal').innerHTML = '🏡 ' + esc(visiting.first_name) + '\'s Home Island · ' + tier.name + '<small>Tap the House to walk inside, or tap 🏠 My Home to return!</small>';
      } else {
        $('w-goal').innerHTML = '🏡 My Home Island · ' + tier.name + '<small>Walk into your House door, drag any furniture to move it, or tap Workbench!</small>';
      }
      return;
    }
    var ms = missions(z).regular, done = ms.filter(function (m) { return starsOf(m.id) > 0; }).length, total = ms.reduce(function (a, m) { return a + starsOf(m.id); }, 0);
    var tip = done < 5 ? ('Clue ' + (done + 1) + ' of 5 · Walk to the glowing clue!') : (chestOpened(z) ? 'Board the Hispaniola at the pier!' : 'Unlock Billy Bones\'s Sea Chest!');
    $('w-goal').innerHTML = '🏴‍☠️ ' + zoneName(z) + ' · ⭐ ' + total + '<small>' + tip + '</small>';
  }

  function makeWorldLabel(sc, x, y, text, color) {
    return sc.add.text(x, y, text, {
      fontFamily: 'Fredoka, sans-serif',
      fontSize: '20px',
      fontStyle: '700',
      color: color || '#ffffff',
      stroke: '#060911',
      strokeThickness: 5,
      shadow: { offsetX: 0, offsetY: 2, color: 'rgba(0,0,0,0.75)', blur: 4, stroke: true, fill: true }
    }).setOrigin(0.5).setDepth(4502);
  }

  /* ---------- Home Island (Zone 0): House, Workbench & Interactive Furniture ---------- */
  function buildHome(sc) {
    sc.homeObjs = [];
    sc.placedSprites = [];
    if (S.zone !== 0 || !root.WorldGame) return;
    var visiting = S.visitingFriend;
    var st = (visiting && visiting.world) ? visiting.world : root.WorldGame.readState();
    var tier = root.WorldGame.HOUSE_TIERS[Math.max(0, Math.min(root.WorldGame.HOUSE_TIERS.length - 1, (st.houseTier || 1) - 1))];

    if (S.inHouse) {
      // Inside Walkable 2D Room: Blueprint Desk + Exit Door Mat
      var wbIn = sc.add.image(660, 600, FLAT + 'o_workbench').setOrigin(.5, .96).setDepth(600);
      wbIn.setScale(135 / wbIn.height);
      sc.add.image(660, 600, 'shadow').setScale(1.4).setDepth(-6);
      solid(sc, 660, 585, 100, 36);
      var wbInLbl = makeWorldLabel(sc, 660, 622, '📜 Blueprints & Studio', '#38bdf8');
      sc.workbenchSpot = { kind: 'workbench', img: wbIn, label: wbInLbl, x: 660, y: 600, def: { h: 135, sw: 110 } };

      var doorLbl = makeWorldLabel(sc, 1200, 1142, '🚪 Walk Outside to Garden ▼', '#fde047');
      sc.doorOutSpot = { kind: 'door_out', label: doorLbl, x: 1200, y: 1140, def: { h: 70, sw: 140 } };
      sc.homeObjs.push(sc.workbenchSpot, sc.doorOutSpot);
    } else {
      // Outdoor Home Island: Grounded House on Stone Foundation + Workbench
      var hImg = sc.add.image(1170, 700, FLAT + tier.id).setOrigin(.5, .96).setDepth(700);
      hImg.setScale(320 / hImg.height);
      var hShadow = sc.add.image(1170, 700, 'shadow').setScale(2.6, 1.7).setDepth(-6);
      solid(sc, 1170, 670, 230, 66);
      var hLabel = makeWorldLabel(sc, 1170, 734, visiting ? ('🚪 Walk Inside ' + (visiting.first_name || 'Friend') + "'s House") : '🚪 My House (Walk Inside!)', '#fde047');
      sc.houseSpot = { kind: 'house', img: hImg, shadow: hShadow, label: hLabel, x: 1170, y: 700, def: { h: 320, sw: 230 } };

      var wbImg = sc.add.image(760, 720, FLAT + 'o_workbench').setOrigin(.5, .96).setDepth(720);
      wbImg.setScale(150 / wbImg.height);
      sc.add.image(760, 720, 'shadow').setScale(1.6).setDepth(-6);
      solid(sc, 760, 700, 110, 40);
      var wbLabel = makeWorldLabel(sc, 760, 744, '📜 Blueprints & Craft', '#38bdf8');
      sc.workbenchSpot = { kind: 'workbench', img: wbImg, label: wbLabel, x: 760, y: 720, def: { h: 150, sw: 120 } };

      var spImg = sc.add.image(1150, 1140, FLAT + 'o_ball').setOrigin(.5, .9).setDepth(1140);
      spImg.setScale(72 / spImg.height);
      var spLabel = makeWorldLabel(sc, 1150, 1068, '⚽ 3D Sports Stadium (4v4)', '#34d399');
      sc.sportsSpot = { kind: 'sports', img: spImg, label: spLabel, x: 1150, y: 1140, def: { h: 90, sw: 110 } };
      sc.homeObjs.push(sc.houseSpot, sc.workbenchSpot, sc.sportsSpot);
    }

    if (visiting) {
      var fKey = 'friend_host_' + (visiting.id || 'pal');
      var fx = S.inHouse ? 1020 : 1580, fy = 760;
      var spawnFriendHost = function () {
        if (!sc.scene || !sc.scene.isActive()) return;
        var fWalker = makeWalker(sc, fKey, fx, fy, .52);
        var fTag = makeWorldLabel(sc, fx, fy - 110, '👋 ' + (visiting.first_name || 'Friend'), '#fde047').setDepth(4505);
        sc.tweens.add({ targets: fTag, y: fy - 118, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
        sc.homeObjs.push({ kind: 'friend_host', friend: visiting, walker: fWalker, tag: fTag, x: fx, y: fy, def: { h: 140, sw: 90 } });
      };
      var fStage = STAGES[Math.max(0, Math.min(6, (visiting.level || 3) - 1))];
      bakeMonster(sc, fKey, { stage: fStage, color: visiting.color || 'pink', equipped: visiting.equipped || {} }).then(spawnFriendHost);
    }

    renderPlacedFurniture(sc);
  }
  function renderPlacedFurniture(sc) {
    if (!sc || S.zone !== 0 || !root.WorldGame) return;
    (sc.placedSprites || []).forEach(function (o) {
      if (o.img) o.img.destroy();
      if (o.shadow) o.shadow.destroy();
      if (o.glow) o.glow.destroy();
    });
    (sc.placedSolids || []).forEach(function (z) {
      if (sc.solidGroup) sc.solidGroup.remove(z, true, true);
      var idx = sc.solids ? sc.solids.indexOf(z) : -1;
      if (idx >= 0) sc.solids.splice(idx, 1);
    });
    sc.placedSprites = [];
    sc.placedSolids = [];
    var st = (S.visitingFriend && S.visitingFriend.world) ? S.visitingFriend.world : root.WorldGame.readState();
    (st.placed || []).forEach(function (p, idx) {
      var rec = root.WorldGame.RECIPES.filter(function (r) { return r.id === p.id; })[0];
      if (!rec) return;
      if (S.inHouse && rec.kind !== 'patio') return;
      if (!S.inHouse && rec.kind !== 'garden') return;
      var artKey = FLAT + rec.id;
      var itemLv = Math.max(1, Math.min(3, Number(p.lvl) || 1));
      var lvScale = 1 + (itemLv - 1) * 0.12;
      var buildOne = function () {
        var im = sc.add.image(p.x, p.y, artKey).setOrigin(.5, .95).setDepth(rec.flat ? -4 : p.y);
        im.setScale(((rec.h || 110) * lvScale) / im.height);
        im.setFlipX(!!p.flip);
        var sh = !rec.flat ? sc.add.image(p.x, p.y, 'shadow').setScale(Math.max(0.9, Math.min(1.6, (rec.h || 110) / 95))).setDepth(-6) : null;
        var isSeatOrRug = /chair|bed|bench|swing|rug/.test(rec.id);
        if (!rec.flat && !isSeatOrRug && !S.moveMode && sc.solidGroup) {
          var sz = solid(sc, p.x, p.y - 16, Math.min(110, (rec.h || 100) * 0.65), 26);
          sc.placedSolids.push(sz);
        }
        var isLight = /lamp|fireplace/.test(rec.id);
        var lit = isLight ? (p.lit !== false) : false;
        var glow = null;
        if (lit) {
          glow = sc.add.circle(p.x, p.y - (rec.h || 110) * 0.52, 68, 0xfde047, 0.26).setDepth(p.y - 1);
          sc.tweens.add({ targets: glow, scale: 1.15, alpha: 0.14, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
        }
        sc.placedSprites.push({
          kind: 'furniture', idx: idx, id: p.id, name: rec.name, lvl: itemLv, img: im, shadow: sh, glow: glow, lit: lit,
          x: p.x, y: p.y, h: rec.h || 110, flat: !!rec.flat, flip: !!p.flip,
          def: { h: rec.h || 110, sw: isSeatOrRug ? 60 : 80 }
        });
      };
      if (sc.textures.exists(artKey)) buildOne();
      else { sc.load.image(artKey, artUrl(artKey)); sc.load.once('complete', buildOne); sc.load.start(); }
    });
  }
  function interactFurniture(sc, ps) {
    if (!sc || !ps || !sc.player) return;
    var id = ps.id;
    if (/chair|bed|bench|swing/.test(id)) {
      sc.player.x = ps.x;
      sc.player.y = ps.y + 4;
      sc.player.sitting = true;
      cheer(sc.player, 1100);
      sound('playCorrect');
      sc.fx.explode(14, ps.x, ps.y - 34);
      var now = Date.now();
      var restGain = 5 * (ps.lvl || 1);
      if (!S.lastRestAt || now - S.lastRestAt > 10000) {
        S.lastRestAt = now;
        if (root.WorldGame && root.WorldGame.addEnergy) root.WorldGame.addEnergy(restGain);
        showWorldFloat(sc, ps.x, ps.y - 60, '🛋️ Lv.' + (ps.lvl || 1) + ' Comfy Rest! +' + restGain + ' ⚡', '#34d399');
      } else {
        showWorldFloat(sc, ps.x, ps.y - 60, '🛋️ So cosy on the Lv.' + (ps.lvl || 1) + ' ' + ps.name + '!', '#fde047');
      }
      say('Sitting on the ' + ps.name.toLowerCase() + '!');
      return;
    }
    if (/lamp|fireplace/.test(id)) {
      ps.lit = !ps.lit;
      if (!S.visitingFriend && root.WorldGame) {
        var st = root.WorldGame.readState();
        if (st.placed && st.placed[ps.idx]) { st.placed[ps.idx].lit = ps.lit; root.WorldGame.writeState(st); }
      }
      if (ps.lit) {
        if (!ps.glow) {
          ps.glow = sc.add.circle(ps.x, ps.y - (ps.h || 110) * 0.52, 68, 0xfde047, 0.26).setDepth(ps.y - 1);
          sc.tweens.add({ targets: ps.glow, scale: 1.15, alpha: 0.14, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
        } else ps.glow.setVisible(true);
        showWorldFloat(sc, ps.x, ps.y - 65, '💡 Cozy Light On! ✨', '#fde047');
        say('Cozy light on!');
      } else {
        if (ps.glow) ps.glow.setVisible(false);
        showWorldFloat(sc, ps.x, ps.y - 65, '🌙 Light Off!', '#93c5fd');
        say('Light off!');
      }
      sound('playPop');
      sc.fx.explode(16, ps.x, ps.y - 45);
      return;
    }
    var lines = {
      f_table: ['🪵 A sturdy wooden table!', 'Ready for tea time at the table!'],
      f_rug: ['🧶 Soft woven rug!', 'The striped rug feels so soft!'],
      f_plant: ['🪴 Fresh green leaves!', 'The potted plant is growing tall!'],
      g_mailbox: ['📬 Checking the mailbox!', 'Any letters from our friends today?'],
      g_flowerbed: ['🌷 Sweet smelling flowers!', 'These garden flowers are so pretty!'],
      g_fence: ['🏡 Neat white garden fence!', 'A lovely white fence around the garden!'],
      g_pethouse: ['🐶 Cozy Pet House!', 'Woof! A little house for a pet!'],
      g_tree: ['🍎 Juicy red apples!', 'The apple tree is full of fruit!'],
      g_pond: ['🐸 Ribbit! Cool lily pond!', 'Look at the water lilies on the pond!'],
      g_fountain: ['⛲ Splash! Sparkling fountain!', 'The stone fountain is sparkling!']
    };
    var pair = lines[id] || ['✨ ' + ps.name + '!', 'Look at the ' + ps.name.toLowerCase() + '!'];
    sound('playCorrect');
    sc.fx.explode(14, ps.x, ps.y - 40);
    if (ps.img) {
      var sy = ps.img.scaleY;
      sc.tweens.add({ targets: ps.img, scaleY: sy * 1.16, duration: 130, yoyo: true, repeat: 1 });
    }
    showWorldFloat(sc, ps.x, ps.y - 60, pair[0], '#fde047');
    say(pair[1]);
  }
  function refreshHome(celebrate) {
    var sc = scene;
    if (!sc || S.zone !== 0 || !root.WorldGame) return;
    var st = root.WorldGame.readState();
    var tier = root.WorldGame.HOUSE_TIERS[Math.max(0, Math.min(root.WorldGame.HOUSE_TIERS.length - 1, (st.houseTier || 1) - 1))];
    if (sc.houseSpot && sc.houseSpot.img) {
      sc.houseSpot.img.setTexture(FLAT + tier.id);
      sc.houseSpot.img.setScale(320 / sc.houseSpot.img.height);
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
    var wantKind = S.inHouse ? 'patio' : 'garden';
    var cards = root.WorldGame.RECIPES.filter(function (r) { return r.kind === wantKind; }).map(function (r) {
      var owned = Number((st.ownedFurniture || {})[r.id]) || 0;
      var placed = (st.placed || []).filter(function (p) { return p.id === r.id; }).length;
      var avail = Math.max(0, owned - placed);
      if (owned === 0 && placed === 0) return '';
      var isAct = (activeId === r.id) || (S.movingIdx >= 0 && st.placed[S.movingIdx] && st.placed[S.movingIdx].id === r.id);
      return '<button type="button" class="w-dd-card' + (isAct ? ' active' : '') + '" data-id="' + r.id + '" onclick="WORLD.selectDecorCard(\'' + r.id + '\')">' +
        '<img src="' + artUrl(FLAT + r.id) + '" alt="">' +
        '<span>' + esc(r.name) + '</span>' +
        '<em>' + (avail > 0 ? '+' + avail + ' in bag' : '✋ move (' + placed + ')') + '</em>' +
      '</button>';
    }).join('');
    tray.innerHTML = cards || '<div style="color:#94a3b8;font-size:13px;padding:8px">Tap [🔨 Craft More] to build items for your ' + (S.inHouse ? 'Inside Room' : 'Garden') + '!</div>';
  }

  function selectDecorCard(id) {
    sound('playTap');
    var st = root.WorldGame.readState();
    var rec = root.WorldGame.RECIPES.filter(function (r) { return r.id === id; })[0];
    if (rec && rec.kind === 'patio' && !S.inHouse) {
      enterHouse();
      return;
    }
    var owned = Number((st.ownedFurniture || {})[id]) || 0;
    var placedIndices = [];
    (st.placed || []).forEach(function (p, idx) { if (p.id === id) placedIndices.push(idx); });
    if (owned > placedIndices.length) {
      var newPos = rec ? rec.defPos : { x: 1200, y: 800 };
      st.placed.push({ id: id, x: newPos.x, y: newPos.y, flip: false, lvl: 1 });
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
    $('w-goal').innerHTML = '✋ Tap or drag anywhere on the ' + (S.inHouse ? 'room floor' : 'garden') + ' to move it!<small>Use [↔ Flip] or [📥 Put in Bag] below</small>';
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
      var vTag = makeWorldLabel(sc, v.x, v.y - 156, (done ? '✓ ' : '🎁 ') + v.name, done ? '#6ee7b7' : '#fde047');
      sc.villagers.push({ kind: 'villager', v: v, img: img, mark: mark, tag: vTag, x: v.x, y: v.y, def: { h: 165, sw: 90 } });
    });
  }
  function refreshVillagers(vid, rec) {
    var sc = scene; if (!sc || !sc.villagers || !root.WorldGame) return;
    var st = root.WorldGame.readState();
    sc.villagers.forEach(function (vo) {
      var done = !!(st.jobsDone && st.jobsDone[vo.v.id]);
      vo.img.setTexture(FLAT + (done ? vo.v.happy : vo.v.art));
      vo.mark.setVisible(!done);
      if (vo.tag) { vo.tag.setText((done ? '✓ ' : '🎁 ') + vo.v.name); vo.tag.setColor(done ? '#6ee7b7' : '#fde047'); }
      if (vid === vo.v.id && done) {
        partyAt(vo.x, vo.y - 80);
        var gBox = sc.add.image(vo.x, vo.y - 140, FLAT + 'o_gift').setDepth(4800);
        gBox.setScale(85 / gBox.height);
        sc.tweens.add({
          targets: gBox, y: vo.y + 24, duration: 620, ease: 'Bounce.out',
          onComplete: function () {
            sc.party.explode(30, gBox.x, gBox.y - 20);
            showWorldFloat(sc, gBox.x, gBox.y - 50, '🎁 +' + (rec ? rec.name : 'Gift') + '!', '#fde047');
            sc.tweens.add({ targets: gBox, scale: 0, alpha: 0, delay: 450, duration: 280, onComplete: function () { gBox.destroy(); } });
          }
        });
      }
    });
  }
  function buildBattles(sc) {
    sc.battles = [];
    if (!root.WorldGame) return;
    var st = root.WorldGame.readState();
    root.WorldGame.BATTLES.forEach(function (b) {
      if (b.zone !== S.zone) return;
      var won = !!(st.battlesWon && st.battlesWon[b.id]);
      var ring = sc.add.circle(b.x, b.y - 6, 52, won ? 0x10b981 : 0xf43f5e, .28).setDepth(-6);
      var img = sc.add.image(b.x, b.y, FLAT + b.art).setOrigin(.5, .94).setDepth(b.y);
      img.setScale((b.h || 140) / img.height);
      var sh = sc.add.image(b.x, b.y, 'shadow').setScale(1.5).setDepth(-6);
      var bTag = makeWorldLabel(sc, b.x, b.y - (b.h || 140) - 18, (won ? '💚 ' : '⚔️ ') + b.name, won ? '#6ee7b7' : '#fda4af');
      var bo = { kind: 'battle', b: b, img: img, ring: ring, shadow: sh, tag: bTag, x: b.x, y: b.y, def: { h: b.h || 140, sw: 100 } };
      sc.tweens.add({ targets: img, y: b.y - 10, duration: 750, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      var range = 55;
      sc.tweens.add({
        targets: img, x: { from: b.x - range, to: b.x + range }, duration: 2600 + (b.x % 700), yoyo: true, repeat: -1, ease: 'Sine.inOut',
        onYoyo: function () { img.setFlipX(true); },
        onRepeat: function () { img.setFlipX(false); },
        onUpdate: function () { bo.x = img.x; ring.x = img.x; sh.x = img.x; if (bTag) bTag.x = img.x; }
      });
      sc.battles.push(bo);
    });
  }
  function refreshBattles(bid) {
    var sc = scene; if (!sc || !sc.battles || !root.WorldGame) return;
    var st = root.WorldGame.readState();
    sc.battles.forEach(function (bo) {
      var won = !!(st.battlesWon && st.battlesWon[bo.b.id]);
      bo.ring.setFillStyle(won ? 0x10b981 : 0xf43f5e, .28);
      if (bo.tag) { bo.tag.setText((won ? '💚 ' : '⚔️ ') + bo.b.name); bo.tag.setColor(won ? '#6ee7b7' : '#fda4af'); }
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
      var badgeY = Math.max(145, d.y - d.h - 38);
      var disc = sc.add.image(d.x, badgeY, 'disc').setDepth(4500).setScale(.8);
      var num = sc.add.text(d.x, badgeY, String(i + 1), { fontFamily: 'Fredoka, sans-serif', fontSize: '30px', fontStyle: '700', color: '#fff' }).setOrigin(.5).setDepth(4501);
      var st = sc.add.text(d.x, badgeY + 40, '', { fontFamily: 'Fredoka, sans-serif', fontSize: '22px', color: '#fde047', stroke: '#1e293b', strokeThickness: 4 }).setOrigin(.5).setDepth(4501);
      return { kind: 'mission', mission: m, plot: plot, def: d, img: img, disc: disc, num: num, starsText: st, x: d.x, y: d.y };
    });
    if (zone.chest) {
      var cd = zone.chest;
      var chest = sc.add.image(cd.x, cd.y, chestOpened(S.zone) ? FLAT + 'o_treasure_gold' : (cd.art || FLAT + 'o_chest')).setOrigin(.5, .96).setDepth(cd.y);
      chest.setScale(150 / chest.height); sc.add.image(cd.x, cd.y, 'shadow').setScale(1.6).setDepth(-6);
      sc.chest = { kind: 'chest', img: chest, x: cd.x, y: cd.y };
    } else {
      sc.chest = null;
    }
    sc.gift = null;
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
      if (S.visitingFriend) {
        sc.arrow.setVisible(true).setPosition(1580, 580);
        sc.ring.setVisible(true).setPosition(1580, 760);
      } else {
        sc.arrow.setVisible(true).setPosition(780, 520);
        sc.ring.setVisible(true).setPosition(780, 720);
      }
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
    if (sc.chest) sc.chest.img.setTexture(chestOpened(S.zone) ? FLAT + 'o_treasure_gold' : (ZONES[S.zone].chest.art || FLAT + 'o_chest'));
    (sc.stones || []).forEach(function (st) { var sn = starsOf(st.mission.id); if (st.starsText) st.starsText.setText(sn ? '★'.repeat(sn) : ''); });
    var t = next || (chestReady ? sc.chest : null);
    S.target = t;
    if (t) { var top = Math.max(115, t.def ? t.def.y - t.def.h - 102 : t.y - 200); sc.arrow.setVisible(true).setPosition(t.x, top); sc.ring.setVisible(true).setPosition(t.x, t.y); }
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
    m.anims.stop(); m.setFlipX(false); m.setFrame(CHEER_FRAME); m.cheering = true;
    m.cheerHop = 0;
    if (scene && scene.tweens) {
      scene.tweens.add({
        targets: m,
        cheerHop: 28,
        duration: 210,
        yoyo: true,
        repeat: 1,
        ease: 'Quad.Out',
        onComplete: function () { m.cheerHop = 0; m.landSquash = 0.9; }
      });
    }
    scene.time.delayedCall(ms || 900, function () { if (m.active) { m.cheering = false; m.cheerHop = 0; m.setFrame(IDLE_FRAME[m.facingDir || 'down'] || 0); } });
  }

  /* What the pupil can do where they are standing */
  function interactables(sc) {
    var list = (sc.stops || []).concat([sc.gift, sc.npcSpot], sc.stones || [], sc.homeObjs || [], sc.villagers || [], sc.battles || [], sc.gather || [], sc.landmarks || [], sc.companions || []);
    if (sc.chest) list.push(sc.chest);
    if (sc.gateL) list.push(sc.gateL);
    if (sc.gateR) list.push(sc.gateR);
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
    } else if (t.kind === 'companion') {
      var cp = t.cp;
      if (t.img) t.img.setTexture(FLAT + (cp.happy || cp.art));
      if (cp.isFlint) {
        panel(FLAT + (cp.happy || cp.art), cp.title, cp.line, '🎬 Watch Story Intro ▶', function () {
          if (root.WorldGame && root.WorldGame.replayStoryIntro) root.WorldGame.replayStoryIntro();
        });
      } else {
        panel(FLAT + (cp.happy || cp.art), cp.title, cp.line, '🐾 Pet Benbow (+5 ⚡)', function () {
          partyAt(t.x, t.y - 50);
          if (!S.benbowPetted && root.WorldGame && root.WorldGame.addEnergy) {
            S.benbowPetted = true;
            root.WorldGame.addEnergy(5);
            showWorldFloat(scene, t.x, t.y - 85, '🐆 Benbow Purrs! +5 ⚡ Energy!', '#34d399');
          } else {
            showWorldFloat(scene, t.x, t.y - 85, '🐆 Brave Benbow! ✨', '#fde047');
          }
          say('Benbow is ready for the treasure hunt!');
        });
      }
      say(cp.line);
    } else if (t.kind === 'chest') {
      if (chestOpened(z)) panel(FLAT + 'o_treasure_gold', '🏴‍☠️ Captain Flint\'s Sea Chest', 'You unlocked this Chapter\'s Sea Chest and Map Piece!', '🗺️ Sea Chart', function () { if (root.WorldGame) root.WorldGame.openWorldMap(); });
      else if (S.target === scene.chest) panel(FLAT + 'o_treasure_gold', '🏴‍☠️ Unlock the Sea Chest!', 'All 5 Map Clues solved! Open the Sea Chest to claim your Map Piece & Pirate Reward!', 'Open Chest 🗝️', function () { App().tapChest(z); refreshStops(true); });
      else panel(FLAT + 'o_chest', '🔒 Locked Sea Chest', 'Solve all 5 Map Clues in this Chapter first to unlock the Sea Chest!', 'OK', function () {});
    } else if (t.kind === 'gift') {
      panel(FLAT + 'o_gift', "Today's quest", 'Five quick questions!', 'Play ▶', function () { App().startDailyQuest(); });
    } else if (t.kind === 'friend_host') {
      var fr = t.friend || { first_name: 'Friend' };
      panel(FLAT + 'c_bolt_happy', fr.first_name + '\'s Home Island', 'Welcome to my Home Island! Do you like my house and garden?', '👋 High-Five! (+5 ⚡)', function () {
        partyAt(t.x, t.y - 60);
        if (!S.hi5FriendSent && root.WorldGame && root.WorldGame.addEnergy) {
          S.hi5FriendSent = true;
          root.WorldGame.addEnergy(5);
          showWorldFloat(scene, t.x, t.y - 90, '👋 High-Five! +5 ⚡', '#34d399');
        } else {
          showWorldFloat(scene, t.x, t.y - 90, '👋 Awesome High-Five! ✨', '#fde047');
        }
        say('High five! Thank you for visiting my island!');
      });
      say('Welcome to ' + fr.first_name + 's Home Island!');
    } else if (t.kind === 'sports') {
      panel(FLAT + 'o_ball', '🏆 3D Island Sports Stadium', 'Ready to enter the Giant Stadium? Play competitive 2v2 or 4v4 Football ⚽ & Beach Volleyball 🏐 with smart AI teammates!', '⚽ Enter Stadium ▶', function () {
        if (root.WorldGame && root.WorldGame.openSportsArena) root.WorldGame.openSportsArena('soccer', '2v2');
      });
      say('Tap Enter Stadium when you are ready to play football or volleyball!');
    } else if (t.kind === 'door_out') {
      panel(FLAT + 'u_map', '🚪 Front Door to Garden', 'Would you like to step outside into your sunny island garden?', '🚪 Go Outside ▶', function () {
        exitHouse();
      });
      say('Tap Go Outside to walk into the garden!');
    } else if (t.kind === 'house') {
      var hTitle = S.visitingFriend ? (S.visitingFriend.first_name + '\'s House') : '🏡 My Island House';
      panel(FLAT + 'u_build', hTitle, 'Would you like to walk inside the house to rest and decorate the indoor room?', '🚪 Enter House ▶', function () {
        enterHouse();
      });
      say('Tap Enter House to walk inside!');
    } else if (t.kind === 'workbench') {
      if (S.visitingFriend) {
        panel(FLAT + 'o_workbench', S.visitingFriend.first_name + '\'s Workbench', 'This is where ' + S.visitingFriend.first_name + ' crafts furniture!', '🏠 My Home', function () { leaveFriendHome(); });
      } else {
        panel(FLAT + 'o_workbench', '📜 Smart Blueprints & Crafting Studio', 'Complete Grandpa Bolt\'s Smart Blueprints, craft 16 items, or upgrade your house!', '🔨 Open Studio ▶', function () { if (root.WorldGame) root.WorldGame.openWorkshop('blueprints'); });
        say('Tap Open Studio to craft or check blueprints!');
      }
    } else if (t.kind === 'gather') {
      if (t.harvested) return;
      var capW = t.word.charAt(0).toUpperCase() + t.word.slice(1);
      var verb = t.word === 'wood' ? '🪓 Chop ' : (t.word === 'stone' ? '⛏️ Mine ' : (t.word === 'crystal' ? '💎 Mine ' : '🌸 Gather '));
      var subLine = t.maxHits > 1
        ? ('Requires ' + t.hitsLeft + ' more strike' + (t.hitsLeft > 1 ? 's' : '') + ' (5 ⚡ Energy on harvest · chance for +2x & bonus coins!)')
        : ('Harvest fresh ' + t.word + ' for villager quests & crafting (5 ⚡ Energy)!');
      panel(t.art, capW + ' Resource', subLine, verb + capW + ' (' + t.hitsLeft + '/' + t.maxHits + ') ▶', function () {
        takeGather(scene, t);
      });
      say(capW);
    } else if (t.kind === 'landmark') {
      var lm = t.lm;
      var st0 = root.WorldGame ? root.WorldGame.readState() : {};
      st0.landmarksSeen = st0.landmarksSeen || {};
      var firstTime = !st0.landmarksSeen[lm.id];
      var btnTxt = firstTime ? '✨ Claim +15 ⚡ & +10 🪙' : '📖 Story Map';
      panel(FLAT + (lm.icon || 'o_sign'), lm.title, lm.story, btnTxt, function () {
        if (firstTime && root.WorldGame) {
          st0.landmarksSeen[lm.id] = 1;
          root.WorldGame.writeState(st0);
          root.WorldGame.addEnergy(15);
          root.WorldGame.addBonusCoins(10);
          if (t.tag && t.tag.active) t.tag.setText('✨ ' + lm.label).setColor('#a7f3d0');
          partyAt(t.x, t.y - 60);
          showWorldFloat(scene, t.x, t.y - 90, '📜 Story Discovered! +15 ⚡ & +10 🪙', '#fde047');
        } else if (root.WorldGame && root.WorldGame.openWorldMap) {
          root.WorldGame.openWorldMap();
        }
      });
      say(lm.title);
    } else if (t.kind === 'gate') {
      if (isOpen(t.to)) {
        var shipArt = t.dir > 0 ? (FLAT + 'o_hispaniola') : (FLAT + 'o_boat');
        panel(shipArt, '⛵ Sail to ' + zoneName(t.to), 'All hands on deck! Board the Hispaniola ship to sail across the sea to ' + zoneName(t.to) + '!', '⛵ Set Sail ▶', function () {
          goZone(t.to, t.dir);
        });
        say('All hands on deck! Sail to ' + zoneName(t.to) + '!');
      } else {
        panel(FLAT + 'o_cloud_lock', '🔒 ' + zoneName(t.to) + ' (Sea Route Locked)', 'Solve 4 Map Clues in ' + zoneName(S.zone) + ' first to prepare the Hispaniola for this voyage! (Or unlock all chapters in the Sea Chart).', '🗺️ Sea Chart', function () {
          if (root.WorldGame && root.WorldGame.openWorldMap) root.WorldGame.openWorldMap();
        });
        say('Solve four map clues here first to set sail!');
      }
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
        panel(FLAT + 'c_bolt_happy', 'Grandpa Bolt', 'Hello Smart Builder! Check my Smart Blueprints to earn Coins, Energy, and Stars!', '📜 Blueprints', function () { if (root.WorldGame) root.WorldGame.openWorkshop('blueprints'); });
        say('Check my Smart Blueprints to earn rewards!');
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
          if (root.WorldGame) {
            if (root.WorldGame.addEnergy) root.WorldGame.addEnergy(15);
            if (root.WorldGame.addBonusCoins) root.WorldGame.addBonusCoins(10);
          }
          if (App() && App().awardIslandXP) App().awardIslandXP(5, 'npc_gift_z' + z);
          partyAt(t.x, t.y - 60);
          showWorldFloat(scene, t.x, t.y - 95, '🎁 +15 ⚡ Energy & +10 🪙!', '#fde047');
          say('Thank you so much! Here is energy and coins for you!');
        });
        say(giftLine);
        return;
      }
      var line = next && next.plot && next.plot.intro ? next.plot.intro[0] : (next ? 'Open the treasure!' : 'Thank you, friend!');
      panel(helperArt(), name, line, 'OK', function () {});
      say(line);
    }
  }
  function clampFurnCoord(x, y) {
    if (S.inHouse) {
      return {
        x: Math.round(Math.max(610, Math.min(1790, x))),
        y: Math.round(Math.max(585, Math.min(1080, y)))
      };
    }
    return {
      x: Math.round(Math.max(220, Math.min(W - 220, x))),
      y: Math.round(Math.max(380, Math.min(H - 140, y)))
    };
  }
  function onPointerMove(ptr) {
    var sc = scene; if (!sc || !S.dragFurn || S.modal) return;
    if (!ptr.isDown) { onPointerUp(ptr); return; }
    var x = ptr.worldX, y = ptr.worldY;
    var dist = Math.hypot(x - S.dragFurn.startX, y - S.dragFurn.startY);
    if (!S.dragFurn.moved && dist > 10) {
      S.dragFurn.moved = true;
      S.movingIdx = S.dragFurn.ps.idx;
      stopWalking();
      hidePanel();
      sound('playTap');
    }
    if (S.dragFurn.moved) {
      var pos = clampFurnCoord(x, y);
      var ps = S.dragFurn.ps;
      ps.x = pos.x; ps.y = pos.y;
      if (ps.img) { ps.img.setPosition(pos.x, pos.y); ps.img.setDepth(ps.flat ? -4 : pos.y); }
      if (ps.shadow) ps.shadow.setPosition(pos.x, pos.y);
      if (ps.glow) ps.glow.setPosition(pos.x, pos.y - (ps.h || 110) * 0.52);
      $('w-goal').innerHTML = '✋ Dragging <b>' + esc(ps.name) + '</b><small>Release to drop it right here!</small>';
    }
  }
  function onPointerUp(ptr) {
    var sc = scene; if (!S.dragFurn) return;
    var df = S.dragFurn;
    S.dragFurn = null;
    if (df.moved && root.WorldGame) {
      var st = root.WorldGame.readState();
      if (st.placed && st.placed[df.ps.idx]) {
        st.placed[df.ps.idx].x = df.ps.x;
        st.placed[df.ps.idx].y = df.ps.y;
        root.WorldGame.writeState(st);
        sound('playCorrect');
        if (sc && sc.dust) sc.dust.explode(12, df.ps.x, df.ps.y);
        if (sc) showWorldFloat(sc, df.ps.x, df.ps.y - 60, '✓ Moved ' + df.ps.name + '!', '#34d399');
        if (sc) renderPlacedFurniture(sc);
        if (S.moveMode) renderDecorTray(st.placed[df.ps.idx].id);
        else setGoal();
      }
      return;
    }
    if (!S.moveMode && sc && df.ps) {
      hidePanel();
      spawnTapRipple(sc, df.ps.x, df.ps.y + 10, true);
      walkTo(df.ps.x, df.ps.y + 20, function () { interactFurniture(sc, df.ps); });
    }
  }
  function onTap(ptr) {
    var sc = scene; if (!sc || !sc.player || S.modal) return;
    var x = ptr.worldX, y = ptr.worldY;
    if (S.zone === 0 && sc.placedSprites && sc.placedSprites.length) {
      var fHit = null, fBest = 1e9;
      sc.placedSprites.forEach(function (ps) {
        if (Math.abs(x - ps.x) < 78 && y <= ps.y + 26 && y >= ps.y - ps.h - 26) {
          var fd = Math.abs(x - ps.x) + Math.abs(y - ps.y);
          if (fd < fBest) { fBest = fd; fHit = ps; }
        }
      });
      if (fHit) {
        if (!S.visitingFriend && root.WorldGame) {
          S.dragFurn = { ps: fHit, startX: x, startY: y, moved: false };
          if (S.moveMode) {
            S.movingIdx = fHit.idx;
            sound('playTap');
            var st0 = root.WorldGame.readState();
            var it0 = st0.placed && st0.placed[fHit.idx];
            renderDecorTray(it0 ? it0.id : null);
            $('w-goal').innerHTML = '✋ Moving ' + esc(fHit.name) + '<small>Drag it or tap anywhere on the ' + (S.inHouse ? 'room floor' : 'garden') + ' to place it!</small>';
          }
          return;
        }
        hidePanel();
        spawnTapRipple(sc, fHit.x, fHit.y + 10, true);
        walkTo(fHit.x, fHit.y + 20, function () { interactFurniture(sc, fHit); });
        return;
      }
    }
    if (S.moveMode && S.zone === 0 && root.WorldGame && S.movingIdx >= 0) {
      var st = root.WorldGame.readState();
      if (st.placed && st.placed[S.movingIdx]) {
        var cPos = clampFurnCoord(x, y);
        st.placed[S.movingIdx].x = cPos.x;
        st.placed[S.movingIdx].y = cPos.y;
        root.WorldGame.writeState(st);
        sound('playCorrect');
        sc.dust.explode(10, cPos.x, cPos.y);
        renderPlacedFurniture(sc);
        renderDecorTray(st.placed[S.movingIdx].id);
      }
      $('w-goal').innerHTML = '✓ Item placed!<small>Tap or drag another item, or tap Done</small>';
      return;
    }
    var list = interactables(sc), hit = null, best = 1e9;
    list.forEach(function (t) {
      var h = t.def ? t.def.h : 120, w = t.def ? Math.max(80, t.def.h * .55) : 70;
      if (Math.abs(x - t.x) < w && y < t.y + 30 && y > t.y - h - 60) { var d = Math.abs(x - t.x) + Math.abs(y - t.y); if (d < best) { best = d; hit = t; } }
    });
    if (hit) {
      hidePanel(); S.near = hit;
      spawnTapRipple(sc, hit.x, hit.y + 28, true);
      walkTo(hit.x, hit.y + 42, function () {
        openThing(hit);
      });
      return;
    }
    hidePanel(); S.near = null;
    spawnTapRipple(sc, x, y, false);
    walkTo(x, y);
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

  /* ---------- Harbour Ship & Boat Docks to Sail Between Islands ---------- */
  function makeGate(sc, dir) {
    var to = S.zone + dir;
    if (to < 1 || to > 4) return null;
    var x = dir > 0 ? W - 95 : 90, y = 760;
    var shipTex = dir > 0 ? (FLAT + 'o_hispaniola') : (FLAT + 'o_boat');
    var shipH = dir > 0 ? 195 : 135;
    var sign = sc.add.text(x + (dir > 0 ? -20 : 20), y - shipH - 18, '', { fontFamily: 'Fredoka, sans-serif', fontSize: '22px', fontStyle: '700', color: '#fef08a', stroke: '#060911', strokeThickness: 5, shadow: { offsetX: 0, offsetY: 2, color: 'rgba(0,0,0,0.8)', blur: 4, stroke: true, fill: true }, align: 'center' }).setOrigin(dir > 0 ? 1 : 0, .5).setDepth(4405);
    var pic = sc.add.image(x, y, shipTex).setOrigin(.5, .85).setDepth(4400); pic.setScale(shipH / pic.height);
    var lockBadge = sc.add.image(x, y - shipH * 0.55, FLAT + 'o_cloud_lock').setOrigin(.5).setDepth(4406);
    lockBadge.setScale(76 / lockBadge.height);
    sc.tweens.add({ targets: pic, y: y - 8, angle: { from: -1.5, to: 1.5 }, duration: 1350, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    var g = { kind: 'gate', x: x, y: y, dir: dir, to: to, def: { h: shipH, sw: 135 }, sign: sign, pic: pic, lockBadge: lockBadge, setLock: function () {
      var open = isOpen(to);
      sign.setText((open ? '⛵ Sail: ' : '🔒 ') + zoneName(to));
      sign.setColor(open ? '#fde047' : '#cbd5e1');
      lockBadge.setVisible(!open);
      pic.setAlpha(open ? 1 : 0.72);
    } };
    g.setLock();
    return g;
  }
  function goZone(to, fromDir, inHouseFlag) {
    var sc = scene; if (S.leaving) return;
    S.leaving = true; S.moveMode = false; S.movingIdx = -1; sound('playHop'); hidePanel(); stopWalking();
    $('w-fade').classList.add('on');
    setTimeout(function () { S.leaving = false; S.near = null; S.ready = false; sc.scene.restart({ zone: to, fromDir: fromDir || 0, inHouse: !!inHouseFlag }); }, 280);
  }
  function enterHouse() {
    if (S.zone === 0 && S.inHouse) return;
    say('Welcome inside your home!');
    goZone(0, 0, true);
  }
  function exitHouse() {
    if (!S.inHouse) return;
    var sc = scene; if (S.leaving) return;
    S.leaving = true; S.moveMode = false; S.movingIdx = -1; sound('playHop'); hidePanel(); stopWalking();
    $('w-fade').classList.add('on');
    setTimeout(function () { S.leaving = false; S.near = null; S.ready = false; sc.scene.restart({ zone: 0, fromDir: 0, inHouse: false, fromHouse: true }); }, 280);
  }

  /* ---------- the scene ---------- */
  var WorldScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function WorldScene() { Phaser.Scene.call(this, { key: 'world' }); },
    init: function (data) {
      if (data && data.zone !== undefined) S.zone = data.zone;
      S.fromDir = (data && data.fromDir) || 0;
      S.inHouse = !!(data && data.inHouse && S.zone === 0);
      S.fromHouse = !!(data && data.fromHouse);
    },
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

      if (!S.inHouse) {
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
        var npcName = S.zone === 0 ? 'Quartermaster Hawkins' : ((root.IslandStory && root.IslandStory.CHARS && root.IslandStory.CHARS[S.zone] && root.IslandStory.CHARS[S.zone].name) || 'Crew');
        var npcLabel = makeWorldLabel(sc, n.x, S.zone === 0 ? (n.y + 24) : (n.y - (n.h || 190) - 14), '💬 ' + npcName, '#fde047');
        sc.npcSpot = { kind: 'npc', img: npc, label: npcLabel, x: n.x, y: n.y };
      } else {
        sc.npcSpot = null;
      }
      buildStops(sc, zone);
      buildHome(sc);
      if (!S.inHouse) {
        sc.villagers = [];
        sc.battles = [];
        sc.gather = [];
        sc.landmarks = [];
        addLife(sc, zone);
        buildCompanions(sc);

        sc.crate = null;
        sc.crateShadow = null;
        if (zone.ball) {
          sc.ball = sc.physics.add.image(zone.ball.x, zone.ball.y, FLAT + 'o_ball').setDepth(zone.ball.y); sc.ball.setScale(84 / sc.ball.height);
          sc.ball.body.setCircle(sc.ball.width / 2); sc.ball.setDrag(170).setBounce(.8).setCollideWorldBounds(true).setMass(.4);
          sc.ballShadow = sc.add.image(zone.ball.x, zone.ball.y, 'shadow').setDepth(-6);
        }

        // hidden shells: a little something to find (kept on this device for now, no XP)
        var found = foundShells();
        zone.shells.forEach(function (sd, i) {
          var k = 'z' + S.zone + '_' + i; if (found[k]) return;
          var s = sc.add.image(sd.x, sd.y, FLAT + 'o_shell').setScale(.17).setDepth(sd.wet ? -12 : (sd.under ? sd.y - 100 : sd.y)); s.under = !!sd.under; s.key2 = k; sc.shells.push(s);
        });
        sc.palmShellKey = 'z' + S.zone + '_palm';
        if (found[sc.palmShellKey]) sc.palms.forEach(function (p) { p.hasShell = false; });
      } else {
        sc.villagers = []; sc.battles = []; sc.gather = []; sc.landmarks = []; sc.companions = []; sc.crate = null; sc.ball = null;
      }

      sc.fx = sc.add.particles(0, 0, 'dot', { speed: { min: 60, max: 240 }, lifespan: 600, scale: { start: .8, end: 0 }, tint: [0xfde047, 0xffffff, 0xf472b6], emitting: false }).setDepth(5000);
      sc.party = sc.add.particles(0, 0, 'dot', { speed: { min: 140, max: 520 }, angle: { min: 200, max: 340 }, gravityY: 420, lifespan: 1500, scale: { start: 1, end: .2 }, tint: [0xfde047, 0x38bdf8, 0xf43f5e, 0x10b981, 0xa855f7], emitting: false }).setDepth(5000);
      sc.dust = sc.add.particles(0, 0, 'dot', { speed: { min: 8, max: 34 }, angle: { min: 200, max: 340 }, lifespan: 420, scale: { start: .55, end: 0 }, alpha: { start: .55, end: 0 }, tint: zone.ground === 'beach' ? 0xe6c88e : (zone.ground === 'volcano' ? 0x8c5430 : 0xd9f99d), emitting: false }).setDepth(-4);
      sc.waterFx = sc.add.particles(0, 0, 'dot', { speed: { min: 30, max: 120 }, angle: { min: 210, max: 330 }, gravityY: 240, lifespan: 480, scale: { start: .6, end: 0 }, tint: [0xffffff, 0xa5f3fc], emitting: false }).setDepth(-3);

      sc.gateL = S.inHouse ? null : makeGate(sc, -1); sc.gateR = S.inHouse ? null : makeGate(sc, 1);
      sc.grid = buildGrid(sc, zone);
      sc.keys = sc.input.keyboard ? sc.input.keyboard.createCursorKeys() : null;
      sc.shiftKey = sc.keys ? sc.keys.shift : null;
      sc.wasd = sc.input.keyboard ? sc.input.keyboard.addKeys('W,A,S,D') : null;
      sc.input.on('pointerdown', onTap);
      sc.input.on('pointermove', onPointerMove);
      sc.input.on('pointerup', onPointerUp);
      sc.walkers = [];

      (async function () {
        var look = monsterLook();
        if (!sc.textures.exists('me') || S.lookStamp !== JSON.stringify(look)) await bakeMonster(sc, 'me', look);
        var crowd = Math.max(0, Math.min(30, Number(Q.get('crowd') !== null ? Q.get('crowd') : 0))), colors = ['pink', 'gold', 'green', 'purple', 'orange'], palNames = ['Sky', 'River', 'Sunny', 'Robin', 'Leo'];
        for (var i = 0; i < Math.min(crowd, colors.length); i++) if (!sc.textures.exists('c' + i)) await bakeMonster(sc, 'c' + i, { stage: ['baby', 'growing', 'adventurer', 'advanced', 'ultimate'][i % 5], color: colors[i] });
        var sx = S.inHouse ? 1200 : (S.fromHouse ? 1170 : (S.fromDir < 0 ? W - 260 : (S.fromDir > 0 ? 240 : (S.zone === 0 ? 960 : 560))));
        var sy = S.inHouse ? 1020 : (S.fromHouse ? 775 : (S.fromDir ? 820 : (S.zone === 0 ? 830 : 760)));
        var free = nearestFree(sc.grid, Math.floor(sx / CELL), Math.floor(sy / CELL)) || [5, 20];
        sc.player = makeWalker(sc, 'me', free[0] * CELL + 20, free[1] * CELL + 20, .54);
        sc.cameras.main.setBounds(0, 0, W, H);
        sc.cameras.main.startFollow(sc.player, true, .1, .1);
        var fit = function () { if (!sc.cameras || !sc.cameras.main) return; var w = sc.scale.width, h = sc.scale.height; sc.cameras.main.setZoom(Math.max(w / W, h / H, .7, Math.min(1, Math.min(w / 1050, h / 640)))); };
        fit(); sc.scale.off('resize'); sc.scale.on('resize', fit);
        sc.physics.add.collider(sc.player, sc.solidGroup);
        if (sc.ball) {
          sc.physics.add.collider(sc.ball, sc.solidGroup);
          sc.physics.add.collider(sc.player, sc.ball, function () {
            var dx = sc.ball.x - sc.player.x, dy = sc.ball.y - sc.player.y, len = Math.sqrt(dx * dx + dy * dy) || 1;
            sc.ball.setVelocity(dx / len * 520, dy / len * 520); sound('playHop');
          });
        }
        var crowdCount = S.inHouse ? 0 : crowd;
        for (var k = 0; k < crowdCount; k++) {
          var dry = nearestFree(sc.grid, Math.floor((300 + Math.random() * 1800) / CELL), Math.floor((800 + Math.random() * 550) / CELL)) || [10, 25];
          var w = makeWalker(sc, 'c' + (k % Math.min(crowd, colors.length)), dry[0] * CELL + 20, dry[1] * CELL + 20, .46);
          w.palName = palNames[k % palNames.length];
          w.nameTag = makeWorldLabel(sc, w.x, w.y - 96, '🟢 ' + w.palName, '#a7f3d0');
          w.wander = { x: w.x, y: w.y, wait: Math.random() * 2000 };
          sc.physics.add.collider(w, sc.solidGroup);
          if (sc.ball) sc.physics.add.collider(w, sc.ball);
          sc.walkers.push(w);
        }
        refreshStops(false);
        if (root.WorldGame) root.WorldGame.updateEnergyChip();
        $('w-load').classList.remove('on');
        $('w-fade').classList.remove('on');
        S.cooldown = 500;
        S.ready = true;
        if (!S.introChecked && !Q.get('nostory') && !Q.get('fps')) {
          S.introChecked = true;
          var introSeen = false;
          try { introSeen = localStorage.getItem('eaa_treasure_intro_v2') === '1'; } catch (e) {}
          if (!introSeen && root.IslandStory && root.IslandStory.playIntro) {
            try { localStorage.setItem('eaa_treasure_intro_v2', '1'); } catch (e) {}
            var mHtml = (App() && App().monsterHtml) ? App().monsterHtml(92) : '';
            setTimeout(function () { root.IslandStory.playIntro(mHtml, function () {}); }, 250);
          }
        }
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
          if (root.WorldGame && root.WorldGame.updateStatusHud) root.WorldGame.updateStatusHud();
          var look = monsterLook();
          if (S.lookStamp !== JSON.stringify(look)) { var fr = m; bakeMonster(sc, 'me', look).then(function () { if (fr.active) { fr.setTexture('me', 0); syncRide(sc, fr); syncPet(sc, fr); } }); }
          else { syncRide(sc, m); syncPet(sc, m); }
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
          if (d < 22) {
            S.path.shift(); S.stuck = 0;
            if (!S.path.length) {
              m.landSquash = 1.0;
              if (S.onArrive) { var cb = S.onArrive; S.onArrive = null; cb(); }
            }
          } else {
            vx = dx / d; vy = dy / d;
            if (Math.abs(m.body.velocity.x) + Math.abs(m.body.velocity.y) < 30) S.stuck = (S.stuck || 0) + delta; else S.stuck = 0;
            if (S.stuck > 900) { S.path = []; S.onArrive = null; S.stuck = 0; vx = vy = 0; }
          }
        }
      }
      var isSprinting = !!(sc.shiftKey && sc.shiftKey.isDown) || (S.joy && Math.sqrt(S.joy.x * S.joy.x + S.joy.y * S.joy.y) > 0.85);
      var sprintBoost = isSprinting ? 1.24 : 1.0;
      var wet = zone.shallows ? zone.shallows(m.x, m.y) : false, hasRide = !!(m.ride && m.ride.visible), speed = SPEED * (wet ? .68 : 1) * (hasRide ? 1.15 : 1) * sprintBoost;
      var ease = Math.min(1, delta * ((vx || vy) ? .019 : .026));   // responsive acceleration & crisp landing stop
      m.setVelocity(m.body.velocity.x + (vx * speed - m.body.velocity.x) * ease, m.body.velocity.y + (vy * speed - m.body.velocity.y) * ease);
      pushOut(m, zone);
      stepWalkerAnim(m, vx, vy);
      moveSkin(m, delta, time);
      dropTrail(sc, m, delta);

      sc.walkers.forEach(function (w) {
        var a = w.wander;
        if (a.wait > 0) { a.wait -= delta; w.setVelocity(0); stepWalkerAnim(w, 0, 0); }
        else {
          var ddx = a.x - w.x, ddy = a.y - w.y, dd = Math.sqrt(ddx * ddx + ddy * ddy); a.life = (a.life || 0) + delta;
          if (dd < 20 || a.life > 6000) { a.wait = 800 + Math.random() * 2600; a.life = 0; a.x = 150 + Math.random() * 2100; a.y = 780 + Math.random() * 620; }
          else { var wvx = ddx / dd, wvy = ddy / dd; w.setVelocity(wvx * 120, wvy * 120); stepWalkerAnim(w, wvx, wvy); }
        }
        pushOut(w, zone); moveSkin(w, delta, time);
        if (w.nameTag) { w.nameTag.setPosition(w.x, w.y - 98); w.nameTag.setDepth(w.y + 5); }
      });
      if (sc.ball) {
        pushOut(sc.ball, zone);
        sc.ball.setDepth(sc.ball.y + 40); sc.ball.rotation += sc.ball.body.velocity.x * delta * .00002; sc.ballShadow.setPosition(sc.ball.x, sc.ball.y + 42);
      }

      updateCompass(sc);
      if (S.modal || S.leaving) return;
      if (S.cooldown > 0) { S.cooldown -= delta; return; }
      // secret shells (hidden under crates or palm trees)
      for (var i = sc.shells.length - 1; i >= 0; i--) {
        var sh = sc.shells[i];
        if (sh.under && Phaser.Math.Distance.Between(sc.crate.x, sc.crate.y, sh.x, sh.y) < 92) continue;
        if (Phaser.Math.Distance.Between(m.x, m.y, sh.x, sh.y) < 66) {
          sc.shells.splice(i, 1); saveShell(sh.key2); sound('playCorrect'); say('Secret shell!'); cheer(m); sc.fx.explode(16, sh.x, sh.y);
          if (root.WorldGame) {
            if (root.WorldGame.giveMaterials) root.WorldGame.giveMaterials({ shell: 1 });
            if (root.WorldGame.addEnergy) root.WorldGame.addEnergy(10);
            if (root.WorldGame.addBonusCoins) root.WorldGame.addBonusCoins(5);
          }
          showWorldFloat(sc, sh.x, sh.y - 36, '🐚 Secret Shell! +1 Shell & +10 ⚡', '#fde047');
          sc.tweens.add({ targets: sh, y: sh.y - 90, alpha: 0, duration: 650, onComplete: function (tw, t) { t[0].destroy(); } });
        }
      }
      // the palm trees shake when you walk into them
      var isMoving = !!(vx || vy || (m.body && (Math.abs(m.body.velocity.x) + Math.abs(m.body.velocity.y) > 20)));
      sc.palms.forEach(function (p) {
        if (!p.shaking && Phaser.Math.Distance.Between(m.x, m.y, p.x, p.y) < 74 && isMoving) shakePalm(p);
      });
      // what is here? the panel opens when you walk up to something, and closes when you walk away
      var here = null, best = 110;
      interactables(sc).forEach(function (t) { var ty = t.y + (t.def && t.def.sw ? 24 : 0), lim = t.def && t.def.sw ? Math.max(115, t.def.sw * .58) : 110, dd2 = Phaser.Math.Distance.Between(m.x, m.y, t.x, ty); if (dd2 < lim && dd2 < best) { best = dd2; here = t; } });
      if (here && here !== S.near && !S.path.length) { S.near = here; openThing(here); }
      else if (!here && S.near && !S.path.length) { S.near = null; hidePanel(); }
    }
  });
  function pushOut(o, zone) {
    if (!o) return;
    if (!zone.blocked(o.x, o.y)) { o.lastX = o.x; o.lastY = o.y; return; }
    if (o.lastX !== undefined && o.lastY !== undefined && !isNaN(o.lastX) && !isNaN(o.lastY)) {
      o.x = o.lastX;
      o.y = o.lastY;
    } else {
      o.x = Math.max(90, Math.min(W - 90, Number(o.x) || 960));
      o.y = Math.max(240, Math.min(H - 90, Number(o.y) || 820));
      o.lastX = o.x;
      o.lastY = o.y;
    }
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
    var visitId = Q.get('visit');
    if (visitId) {
      S.visitingFriend = buildFriendWorldData(visitId);
    }
    var rawZ = Q.get('zone');
    var want = visitId ? 0 : ((rawZ !== null && rawZ !== '') ? Number(rawZ) : 1);
    var z = want === 0 ? 0 : 1;
    for (var i = 1; i <= 4; i++) if (i <= want && isOpen(i)) z = i;
    S.zone = z;
    document.body.classList.add('w-on');
    $('w-load').classList.add('on');
    setupJoystick();
    if ($('w-back')) $('w-back').onclick = function () { sound('playTap'); if (root.WorldGame) root.WorldGame.openWorldMap(); else { var u = new URLSearchParams(root.location.search); u.delete('zone'); root.location.href = 'index.html?' + u.toString(); } };
    if ($('w-energy')) $('w-energy').onclick = function () { sound('playTap'); if (root.WorldGame) root.WorldGame.openEnergyCharge(); };
    if ($('w-home')) $('w-home').onclick = function () { sound('playTap'); if (S.visitingFriend) { leaveFriendHome(); } else if (root.WorldGame) { root.WorldGame.openWorkshop('home'); } };
    if ($('w-decor')) $('w-decor').onclick = function () { sound('playTap'); if (S.moveMode) closeDecorDock(); else openDecorDock(); };
    if ($('w-jobs')) $('w-jobs').onclick = function () { sound('playTap'); if (root.WorldGame) root.WorldGame.openJobsBoard(); };
    if ($('w-wall')) $('w-wall').onclick = function () { sound('playTap'); if (root.IslandWall) root.IslandWall.open(); };
    if ($('w-book')) $('w-book').onclick = function () { sound('playTap'); if (root.IslandRewards) root.IslandRewards.openStickerBook(); };
    if ($('w-story')) $('w-story').onclick = function () { sound('playTap'); if (root.WorldGame && root.WorldGame.replayStoryIntro) root.WorldGame.replayStoryIntro(); };
    if ($('w-sports')) $('w-sports').onclick = function () { sound('playTap'); if (root.WorldGame && root.WorldGame.openSportsArena) root.WorldGame.openSportsArena('soccer', '2v2'); };
    if ($('w-dress')) $('w-dress').onclick = function () { sound('playTap'); App().openDressingRoom(); };
    if ($('w-shop')) $('w-shop').onclick = function () { sound('playTap'); root.IslandShop.open(); };
    if ($('w-status')) $('w-status').onclick = function () { sound('playTap'); if (root.IslandShop) root.IslandShop.open(); };
    if ($('w-mute')) $('w-mute').onclick = function () { sound('playTap'); if (root.WorldGame && root.WorldGame.toggleWorldMute) root.WorldGame.toggleWorldMute(); };
    if ($('w-goal')) $('w-goal').onclick = function () { sound('playTap'); walkToActiveGoal(); };
    if ($('w-compass')) $('w-compass').onclick = function () { sound('playTap'); walkToActiveGoal(); };
    if (root.WorldGame) {
      root.WorldGame.updateEnergyChip();
      if (root.WorldGame.updateStatusHud) root.WorldGame.updateStatusHud();
    }
    if (Q.get('fps') && $('w-fps')) $('w-fps').style.display = 'block';
    root.WORLD.game = new Phaser.Game({
      type: Phaser.AUTO, parent: 'world', backgroundColor: '#0f6fb0',
      scale: { mode: Phaser.Scale.RESIZE, width: root.innerWidth, height: root.innerHeight },
      physics: { default: 'arcade', arcade: { debug: !!Q.get('debug') } },
      render: { antialias: true }, scene: [WorldScene]
    });
  }
  function walkToActiveGoal() {
    var sc = scene;
    if (S.zone === 0) {
      if (S.visitingFriend) leaveFriendHome();
      else if (root.WorldGame) root.WorldGame.openWorkshop('home');
      return;
    }
    if (!sc || !sc.player) return;
    if (S.target) {
      var t = S.target;
      hidePanel(); S.near = t;
      spawnTapRipple(sc, t.x, t.y + 28, true);
      walkTo(t.x, t.y + 54, function () { openThing(t); });
      return;
    }
    if (sc.gateR && isOpen(sc.gateR.to)) {
      walkTo(sc.gateR.x, sc.gateR.y);
      return;
    }
    if (root.WorldGame) root.WorldGame.openWorldMap();
  }
  function updateCompass(sc) {
    var el = $('w-compass');
    if (!el) return;
    if (S.modal || S.leaving || S.zone === 0 || !S.target || !sc || !sc.cameras || !sc.cameras.main) {
      el.hidden = true;
      return;
    }
    var cam = sc.cameras.main, t = S.target;
    var sx = (t.x - cam.worldView.x) * cam.zoom;
    var sy = (t.y - 60 - cam.worldView.y) * cam.zoom;
    var vw = root.innerWidth, vh = root.innerHeight;
    var offScreen = (sx < 36 || sx > vw - 36 || sy < 86 || sy > vh - 36);
    if (!offScreen) {
      el.hidden = true;
      return;
    }
    var cx = Math.max(92, Math.min(vw - 92, sx));
    var cy = Math.max(108, Math.min(vh - 54, sy));
    var stopIdx = sc.stops ? sc.stops.indexOf(t) : -1;
    var lbl = stopIdx >= 0 ? ('📍 Stop ' + (stopIdx + 1)) : '🎁 Treasure';
    var arrow = sx > vw - 36 ? ' ➔' : (sx < 36 ? '⬅ ' : (sy < 86 ? '⬆ ' : '⬇ '));
    el.textContent = sx < 36 ? (arrow + lbl) : (lbl + arrow);
    el.style.left = Math.round(cx) + 'px';
    el.style.top = Math.round(cy) + 'px';
    el.hidden = false;
  }
  function onSessionChanged() {
    var sc = scene;
    if (!sc || !sc.player) return;
    var look = monsterLook();
    bakeMonster(sc, 'me', look).then(function () {
      if (sc.player && sc.player.active) {
        sc.player.setTexture('me', 0);
        syncRide(sc, sc.player);
        syncPet(sc, sc.player);
      }
    });
    refreshStops(false);
    drawBag();
    if (S.zone === 0) refreshHome(false);
    refreshVillagers();
    refreshBattles();
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

  var FRIEND_PRESETS = {
    'demo-a': {
      id: 'demo-a', first_name: 'Sky', color: 'pink', level: 3, equipped: { hat: 'hat-crown', glasses: 'glasses-star' },
      world: {
        houseTier: 3,
        placed: [
          { id: 'f_bed', x: 1510, y: 590, flip: false },
          { id: 'f_chair', x: 1620, y: 700, flip: false },
          { id: 'f_table', x: 1750, y: 700, flip: false },
          { id: 'f_lamp', x: 1860, y: 580, lit: true },
          { id: 'f_rug', x: 1680, y: 765, flip: false },
          { id: 'g_fountain', x: 1020, y: 980, flip: false },
          { id: 'g_flowerbed', x: 740, y: 940, flip: false },
          { id: 'g_swing', x: 560, y: 1080, flip: false },
          { id: 'g_lamp', x: 1260, y: 720, lit: true }
        ]
      }
    },
    'demo-b': {
      id: 'demo-b', first_name: 'River', color: 'blue', level: 2, equipped: { hat: 'hat-cap' },
      world: {
        houseTier: 2,
        placed: [
          { id: 'f_chair', x: 1540, y: 700, flip: false },
          { id: 'f_plant', x: 1840, y: 760, flip: false },
          { id: 'g_bench', x: 940, y: 980, flip: false },
          { id: 'g_pond', x: 1280, y: 1040, flip: false },
          { id: 'g_mailbox', x: 960, y: 700, flip: false }
        ]
      }
    },
    'demo-c': {
      id: 'demo-c', first_name: 'Sunny', color: 'gold', level: 4, equipped: { hat: 'hat-wizard', glasses: 'glasses-round' },
      world: {
        houseTier: 4,
        placed: [
          { id: 'f_bed', x: 1510, y: 590, flip: false },
          { id: 'f_table', x: 1730, y: 690, flip: false },
          { id: 'f_chair', x: 1610, y: 700, flip: false },
          { id: 'f_lamp', x: 1860, y: 580, lit: true },
          { id: 'g_fountain', x: 960, y: 980, flip: false },
          { id: 'g_tree', x: 1380, y: 980, flip: false },
          { id: 'g_pethouse', x: 680, y: 980, flip: false }
        ]
      }
    },
    'demo-d': {
      id: 'demo-d', first_name: 'Robin', color: 'green', level: 1, equipped: {},
      world: {
        houseTier: 2,
        placed: [
          { id: 'f_chair', x: 1560, y: 700, flip: false },
          { id: 'g_flowerbed', x: 980, y: 940, flip: false },
          { id: 'f_lamp', x: 1460, y: 620, lit: true }
        ]
      }
    }
  };

  function buildFriendWorldData(friendOrId) {
    if (!friendOrId) return null;
    var id = typeof friendOrId === 'string' ? friendOrId : (friendOrId.id || 'demo-a');
    var preset = FRIEND_PRESETS[id];
    var base = typeof friendOrId === 'object' ? friendOrId : (preset || { id: id, first_name: 'Sky', color: 'pink', level: 3, equipped: {} });
    return {
      id: base.id || id,
      first_name: base.first_name || (preset && preset.first_name) || 'Friend',
      color: base.color || (preset && preset.color) || 'pink',
      level: base.level || (preset && preset.level) || 3,
      equipped: base.equipped || (preset && preset.equipped) || {},
      world: base.world || (preset && preset.world) || FRIEND_PRESETS['demo-a'].world
    };
  }

  function visitFriendHome(friendOrId) {
    var fData = buildFriendWorldData(friendOrId);
    if (!fData) return;
    if ($('isl-modal-root')) $('isl-modal-root').innerHTML = '';
    document.documentElement.classList.remove('adv-on');
    S.visitingFriend = fData;
    S.hi5FriendSent = false;
    S.moveMode = false;
    if (scene && S.ready) {
      S.leaving = false;
      goZone(0, 0);
    }
  }

  function leaveFriendHome() {
    if (!S.visitingFriend) return;
    S.visitingFriend = null;
    S.hi5FriendSent = false;
    if (scene && S.ready) {
      S.leaving = false;
      goZone(0, 0);
    }
  }

  function onMissionComplete(missionId, starsEarned) {
    var sc = scene;
    if (!sc || !S.ready) return;
    refreshStops(true);
    var all = (sc.stops || []).concat(sc.stones || []);
    var hit = all.filter(function (s) { return s.mission && s.mission.id === missionId; })[0];
    if (!hit) return;
    var isBossStop = sc.stops && sc.stops[4] === hit;
    if (sc.cameras && sc.cameras.main) {
      sc.cameras.main.pan(hit.x, hit.y - 40, 550, 'Power2');
    }
    var aura = sc.add.circle(hit.x, hit.y - 12, isBossStop ? 95 : 64, 0xfde047, 0.42).setDepth((hit.y || 800) - 2);
    sc.tweens.add({
      targets: aura, scale: isBossStop ? 2.1 : 1.6, alpha: 0, duration: isBossStop ? 1500 : 1000,
      onComplete: function () { aura.destroy(); }
    });
    if (hit.img) {
      var sx = hit.img.scaleX, sy = hit.img.scaleY;
      sc.tweens.add({ targets: hit.img, scaleX: sx * 1.22, scaleY: sy * 1.22, duration: 180, yoyo: true, repeat: isBossStop ? 3 : 2 });
    }
    sc.party.explode(isBossStop ? 75 : 45, hit.x, hit.y - 70);
    sc.fx.explode(isBossStop ? 36 : 20, hit.x, hit.y - 50);
    if (isBossStop) {
      var bossNames = { 1: '⚓ Hispaniola Ready to Sail!', 2: '🗼 Spyglass Beacon Shining!', 3: '🏰 Stockade Fort Secured!', 4: '👑 Flint\'s Treasure Vault Open!' };
      showWorldFloat(sc, hit.x, hit.y - 120, bossNames[S.zone] || '⚡ Zone Boss Complete!', '#fde047');
      setTimeout(function () { if (sc && sc.party) sc.party.explode(60, hit.x, hit.y - 100); }, 380);
    } else {
      showWorldFloat(sc, hit.x, hit.y - 90, '🌟 Stop Complete! +' + (starsEarned || 3) + ' ⭐', '#34d399');
    }
  }

  root.WORLD = {
    S: S,
    scene: function () { return scene; },
    walkTo: walkTo,
    goZone: goZone,
    enterHouse: enterHouse,
    exitHouse: exitHouse,
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
    nextMission: nextMission,
    visitFriendHome: visitFriendHome,
    leaveFriendHome: leaveFriendHome,
    onMissionComplete: onMissionComplete,
    interactFurniture: interactFurniture,
    walkToActiveGoal: walkToActiveGoal,
    onSessionChanged: onSessionChanged,
    getMonsterSheet: function (key) {
      if (!scene || !scene.textures || !scene.textures.exists(key)) return null;
      return scene.textures.get(key).getSourceImage();
    }
  };
  var tries = 0;
  (function waitForPupil() {
    var s = ses();
    if (s && s.status === 'ok') { startWorld(); return; }
    if (tries++ < 400) setTimeout(waitForPupil, 150);   // no pupil yet: the normal code screen is showing underneath
  })();
})(typeof window !== 'undefined' ? window : this);
