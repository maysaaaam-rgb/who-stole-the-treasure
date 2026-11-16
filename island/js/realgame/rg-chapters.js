/* ═══════════════════════════════════════════════════════════════
   Practice Island · World 1 (4x3 Scrolling Island) & Chapter 2 Data
   (island/js/realgame/rg-chapters.js -> window.RG_CHAPTERS)

   Stage 1 Big World (4 cols x 3 rows, 1376 x 768 per tile = 5504 x 2304):
   - 12 painted 2752x1536 tiles drawn at 1376x768 (half size for crisp zoom)
   - Row A: a1 Lighthouse | a2 Forest     | a3 Waterfall | a4 Lookout
   - Row B: b1 Benbow Inn | b2 Village    | b3 Farm      | b4 Cave
   - Row C: c1 Harbour    | c2 Beach      | c3 Palm Cove | c4 The Bay
   - Free walking everywhere except explicit per-tile blocked rectangles/polygons
     and the sea (with walkable overrides for the pier, stone dock & footbridge)
   - 2.5D depth occluders for roofs, tree canopies & ship masts
   - 5 Treasure Island stops placed at their matching island landmarks
   - 24 collectible coins (2 per tile, several tucked behind roofs/trees/masts)
   - Scuttling beach crabs across Row C (c1..c4)
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var TILE_W = 1376, TILE_H = 768;

  var TILE_INDEX = {
    a1: [0, 0], a2: [1, 0], a3: [2, 0], a4: [3, 0],
    b1: [0, 1], b2: [1, 1], b3: [2, 1], b4: [3, 1],
    c1: [0, 2], c2: [1, 2], c3: [2, 2], c4: [3, 2]
  };

  function pt(tid, lx, ly) {
    var rc = TILE_INDEX[tid] || [0, 0];
    return [rc[0] * TILE_W + lx, rc[1] * TILE_H + ly];
  }
  function xy(tid, lx, ly, extra) {
    var p = pt(tid, lx, ly);
    var out = { x: p[0], y: p[1], tile: tid };
    if (extra) {
      Object.keys(extra).forEach(function (k) { out[k] = extra[k]; });
    }
    return out;
  }

  /* ── Stage 1: 4 x 3 Scrolling Island ──
     All shapes inside each tile's `blocked`, `sea`, `walkable`, `surfaces`,
     and `occluders` are written in local tile coordinates (0..1376, 0..768):
     - Rectangle: [x, y, width, height]
     - Polygon:   [[x1, y1], [x2, y2], ...] */
  var WORLD1_TILES = [
    /* ═══════════════ ROW A (y: 0 .. 768) ═══════════════ */
    {
      id: 'a1', col: 0, row: 0, name: 'Lighthouse',
      img: 'art/world1/bg_w1_a1_lighthouse.webp',
      blocked: [
        // Dense northern tree wall
        [0, 0, 1376, 178],
        // Western rocky sea-cliff & bushes
        [[0, 0], [288, 0], [262, 165], [286, 262], [198, 336], [208, 458], [248, 528], [214, 688], [198, 768], [0, 768]],
        // White stone lighthouse base + keeper's cottage walls
        [342, 182, 114, 148],
        [452, 178, 202, 118],
        // Wooden notice post beside cottage
        [662, 260, 66, 42]
      ],
      surfaces: [
        { type: 'stone', rect: [310, 290, 1066, 110] },
        { type: 'stone', rect: [640, 390, 96, 378] }
      ],
      occluders: [
        { base: 326, rect: [334, 38, 132, 224] },
        { base: 292, rect: [446, 70, 214, 182] },
        { base: 268, rect: [150, 95, 165, 150] }
      ]
    },
    {
      id: 'a2', col: 1, row: 0, name: 'Forest',
      img: 'art/world1/bg_w1_a2_forest.webp',
      blocked: [
        // Dense northern tree wall
        [0, 0, 1376, 146],
        // Left big oak trunk & bush base (canopy above is walkable behind!)
        [105, 254, 150, 62],
        // Right pine/oak trunks
        [992, 152, 76, 86],
        [1112, 256, 144, 60],
        // Mossy fallen hollow log
        [[414, 266], [552, 198], [574, 238], [436, 304]],
        // Upper carved stump sign
        [856, 248, 106, 48],
        // Lower carved stump board (Stop 2 landmark)
        [824, 488, 108, 54]
      ],
      surfaces: [
        { type: 'stone', rect: [0, 326, 1376, 68] },
        { type: 'stone', rect: [646, 394, 86, 374] }
      ],
      occluders: [
        { base: 306, rect: [90, 58, 238, 216] },
        { base: 308, rect: [1028, 78, 258, 206] }
      ]
    },
    {
      id: 'a3', col: 2, row: 0, name: 'Waterfall',
      img: 'art/world1/bg_w1_a3_waterfall.webp',
      blocked: [
        // Northern rock cliff face, waterfall & pine trees
        [0, 0, 1376, 224],
        [0, 196, 248, 66],
        [1126, 196, 250, 64],
        // Plunge pond north of the wooden footbridge
        [[580, 196], [798, 196], [804, 276], [734, 332], [640, 332], [576, 276]],
        // Arched bridge top & bottom wooden railings (walkway y: 340..388 stays open!)
        [624, 322, 130, 18],
        [624, 388, 130, 16],
        // Babbling stream & stepping-stone brook south of the footbridge
        [[640, 400], [736, 400], [762, 468], [826, 528], [812, 560], [748, 554], [642, 470]]
      ],
      walkable: [
        // Arched wooden footbridge deck across the stream
        [612, 340, 154, 48]
      ],
      surfaces: [
        { type: 'wood', rect: [616, 336, 146, 54] },
        { type: 'stone', rect: [0, 326, 616, 68] },
        { type: 'stone', rect: [762, 326, 614, 68] },
        { type: 'stone', rect: [652, 566, 74, 202] }
      ],
      occluders: []
    },
    {
      id: 'a4', col: 3, row: 0, name: 'Lookout',
      img: 'art/world1/bg_w1_a4_lookout.webp',
      blocked: [
        // Northern tree wall & NW corner trees
        [0, 0, 1376, 148],
        [0, 148, 122, 132],
        // Eastern sea-cliff boulders
        [[1155, 0], [1376, 0], [1376, 768], [1135, 768], [1160, 560], [1222, 425], [1208, 260], [1145, 148]],
        // Circular stone watchtower wall (leaving 68-unit SW gate open!)
        [[836, 294], [850, 218], [935, 190], [1048, 194], [1096, 238], [1060, 254], [952, 220], [882, 246], [866, 298]],
        [[922, 344], [998, 356], [1098, 306], [1102, 238], [1068, 244], [1064, 294], [992, 324], [924, 318]],
        // Brass spyglass & raised timber stand inside lookout
        [942, 214, 116, 68]
      ],
      surfaces: [
        { type: 'wood', rect: [915, 220, 155, 92] },
        { type: 'stone', rect: [845, 205, 250, 150] }
      ],
      occluders: [
        { base: 268, rect: [1032, 62, 82, 168] }
      ]
    },

    /* ═══════════════ ROW B (y: 768 .. 1536) ═══════════════ */
    {
      id: 'b1', col: 0, row: 1, name: 'Benbow Inn',
      img: 'art/world1/bg_w1_b1_inn.webp',
      blocked: [
        // Western rocky cliff wall
        [0, 0, 204, 768],
        // Stone courtyard well
        [256, 262, 74, 56],
        // Admiral Benbow Inn walls, barrels & bench (front steps at ~536, 250 are open!)
        [[286, 136], [596, 108], [608, 220], [566, 242], [524, 216], [488, 268], [408, 304], [288, 212]]
      ],
      surfaces: [
        { type: 'stone', rect: [518, 228, 220, 175] },
        { type: 'stone', rect: [648, 0, 82, 768] },
        { type: 'stone', rect: [530, 324, 846, 72] }
      ],
      occluders: [
        { base: 218, rect: [276, 4, 330, 192] }
      ]
    },
    {
      id: 'b2', col: 1, row: 1, name: 'Village',
      img: 'art/world1/bg_w1_b2_village.webp',
      blocked: [
        // NW L-shaped cottage walls
        [306, 145, 250, 142],
        // NE cottage walls (grass north of y=164 stays open behind roof!)
        [860, 164, 224, 110],
        // Central cobblestone fountain
        [638, 344, 102, 68],
        // Market stalls around the square (wide cobblestone lanes stay open!)
        [510, 226, 128, 84],
        [744, 226, 132, 84],
        [442, 394, 98, 78],
        [514, 464, 114, 76],
        [850, 398, 94, 76],
        [770, 464, 108, 76]
      ],
      surfaces: [
        { type: 'stone', rect: [425, 220, 530, 380] },
        { type: 'stone', rect: [0, 326, 1376, 68] },
        { type: 'stone', rect: [648, 0, 82, 768] }
      ],
      occluders: [
        { base: 278, rect: [298, 8, 266, 196] },
        { base: 266, rect: [848, 12, 248, 192] }
      ]
    },
    {
      id: 'b3', col: 2, row: 1, name: 'Farm',
      img: 'art/world1/bg_w1_b3_farm.webp',
      blocked: [
        // Wooden windmill base
        [388, 134, 118, 116],
        // Red wooden barn walls (grass north of y=112 stays open behind barn roof!)
        [884, 112, 192, 132],
        // Golden hay bales & wooden cart
        [1124, 422, 102, 96],
        [1136, 558, 92, 62],
        // Six apple orchard tree trunks
        [798, 474, 38, 28],
        [918, 474, 38, 28],
        [1040, 474, 38, 28],
        [798, 600, 38, 28],
        [920, 600, 38, 28],
        [1042, 600, 38, 28]
      ],
      surfaces: [
        { type: 'stone', rect: [435, 220, 495, 345] },
        { type: 'stone', rect: [0, 326, 1376, 68] },
        { type: 'stone', rect: [648, 0, 82, 768] }
      ],
      occluders: [
        { base: 238, rect: [374, 14, 172, 182] },
        { base: 232, rect: [872, 24, 218, 154] },
        { base: 496, rect: [762, 376, 334, 104] },
        { base: 622, rect: [762, 506, 336, 104] }
      ]
    },
    {
      id: 'b4', col: 3, row: 1, name: 'Cave',
      img: 'art/world1/bg_w1_b4_cave.webp',
      blocked: [
        // Cave cliff arch (leaving glowing cave mouth courtyard at ~975, 202 open!)
        [[756, 0], [1376, 0], [1376, 256], [1058, 252], [1036, 166], [944, 166], [894, 198], [818, 148]],
        // Eastern cliff boulders south of cave
        [[1066, 250], [1376, 250], [1376, 768], [1165, 768], [1185, 550], [1155, 410], [1188, 305]],
        // Wooden minecart & supply crates
        [826, 246, 82, 70],
        [936, 266, 100, 72]
      ],
      surfaces: [
        { type: 'stone', rect: [0, 326, 830, 68] },
        { type: 'stone', rect: [648, 0, 82, 768] },
        { type: 'stone', rect: [730, 180, 310, 190] }
      ],
      occluders: [
        { base: 186, rect: [814, 0, 332, 166] }
      ]
    },

    /* ═══════════════ ROW C (y: 1536 .. 2304) ═══════════════ */
    {
      id: 'c1', col: 0, row: 2, name: 'Harbour',
      img: 'art/world1/bg_w1_c1_harbour.webp',
      sea: [0, 455, 1376, 313],
      walkable: [
        // Solid wooden harbour pier extending out over the sea
        [648, 378, 88, 274]
      ],
      blocked: [
        // Western coastal rocks
        [[0, 0], [196, 0], [198, 215], [184, 315], [226, 425], [226, 768], [0, 768]],
        // Harbour boat shed walls (grass north of y=174 stays open behind roof!)
        [344, 174, 132, 96],
        // Hanging fishing net racks
        [248, 248, 96, 64],
        [504, 218, 104, 52]
      ],
      surfaces: [
        { type: 'wood', rect: [644, 378, 96, 280] },
        { type: 'sand', rect: [195, 255, 1181, 200] }
      ],
      occluders: [
        { base: 258, rect: [336, 116, 150, 110] }
      ]
    },
    {
      id: 'c2', col: 1, row: 2, name: 'Beach',
      img: 'art/world1/bg_w1_c2_beach.webp',
      sea: [0, 455, 1376, 313],
      blocked: [
        // Striped wooden beach hut walls (path north of y=216 stays open behind roof!)
        [348, 216, 120, 108],
        // Driftwood bench log & stone firepit ring
        [806, 292, 110, 40],
        [796, 355, 64, 42]
      ],
      surfaces: [
        { type: 'sand', rect: [0, 255, 1376, 200] }
      ],
      occluders: [
        { base: 308, rect: [338, 156, 142, 112] }
      ]
    },
    {
      id: 'c3', col: 2, row: 2, name: 'Palm Cove',
      img: 'art/world1/bg_w1_c3_cove.webp',
      sea: [0, 455, 1376, 313],
      blocked: [
        // Palm tree trunk bases
        [168, 252, 34, 34],
        [474, 232, 34, 34],
        [582, 198, 34, 34],
        [808, 204, 34, 34],
        [962, 168, 34, 34],
        [1192, 262, 34, 34],
        [1218, 238, 34, 34],
        // Smooth cove boulders
        [542, 268, 56, 34],
        [918, 348, 68, 42],
        // Half-buried flower-draped shipwreck hull & sea chest
        [[618, 455], [652, 382], [855, 265], [918, 295], [895, 392], [755, 488], [625, 488]],
        [622, 338, 54, 42]
      ],
      surfaces: [
        { type: 'sand', rect: [0, 255, 1376, 200] }
      ],
      occluders: [
        { base: 280, rect: [95, 124, 138, 132] },
        { base: 252, rect: [418, 82, 230, 152] },
        { base: 226, rect: [738, 92, 136, 116] },
        { base: 188, rect: [938, 58, 136, 118] },
        { base: 282, rect: [1114, 132, 172, 132] }
      ]
    },
    {
      id: 'c4', col: 3, row: 2, name: 'The Bay',
      img: 'art/world1/bg_w1_c4_bay.webp',
      sea: [0, 455, 1376, 313],
      walkable: [
        // Wide stone-and-wood bay dock (pupil may walk along the stone quay, no further onto the ship or sea!)
        [722, 404, 514, 64]
      ],
      blocked: [
        // Eastern rocky headland
        [[1212, 0], [1376, 0], [1376, 768], [1225, 768], [1248, 415], [1238, 280], [1225, 110]],
        // Cargo crates & wooden crane on the stone dock
        [736, 410, 42, 34],
        [804, 396, 40, 34],
        [1012, 355, 224, 70],
        // Moored two-masted sailing ship hull in the bay
        [695, 470, 490, 230]
      ],
      surfaces: [
        { type: 'stone', rect: [720, 404, 518, 66] },
        { type: 'sand', rect: [0, 255, 1220, 200] }
      ],
      occluders: [
        // Sailing ship masts, rigging & pennant rising above the stone dock
        { base: 565, poly: [[752, 404], [822, 404], [835, 535], [746, 535]] },
        { base: 565, poly: [[860, 376], [966, 376], [960, 535], [854, 535]] },
        { base: 565, poly: [[994, 396], [1066, 396], [1076, 535], [988, 535]] }
      ]
    }
  ];

  root.RG_CHAPTERS = {
    /* ───────────────────── CHAPTER 1 · STAGE 1 BIG WORLD (4x3) ───────────────────── */
    ch1: {
      chapter: 1,
      key: 'world1',
      title: 'Practice Island · Admiral Benbow & The Bay',
      tiled: true,
      anyOrder: true,
      cols: 4,
      rows: 3,
      tileW: TILE_W,
      tileH: TILE_H,
      worldW: TILE_W * 4,        // 5504
      worldH: TILE_H * 3,        // 2304
      tiles: WORLD1_TILES,

      // Top-down RPG consistent character scale across all 3 rows
      persp: { y0: 0, y1: TILE_H * 3, h0: 90, h1: 90 },

      // Spawn right on the sunny road in front of the Benbow Inn steps (b1)
      spawn: xy('b1', 555, 352),
      spawnFromSea: xy('c4', 880, 438),

      // Five Treasure Island stops placed at their matching island landmarks
      stops: [
        xy('b1', 536, 258, { n: 1, name: 'Benbow Inn Door', ring: pt('b1', 536, 260), top: 768 + 148 }),
        xy('a2', 878, 558, { n: 2, name: 'Inventor & Brain Board', ring: pt('a2', 878, 560), top: 448 }),
        xy('c1', 692, 548, { n: 3, name: 'Ship Wheel Challenge', prop: 'art/flat/o_ship_wheel.webp', propAt: pt('c1', 692, 532), ring: pt('c1', 692, 552), h: 62 }),
        xy('a4', 912, 292, { n: 4, name: 'Pier Spyglass Lookout', ring: pt('a4', 912, 294), top: 185 }),
        xy('c3', 600, 374, { n: 5, name: "Billy's Sea Chest", ring: pt('c3', 600, 376), top: 1536 + 298 })
      ],

      // Boarding the Hispaniola at the Stone Dock in The Bay (c4)
      board: xy('c4', 945, 448, { r: 68 }),
      boardLines: {
        locked: 'Explore the island stops to gather clues for the Hispaniola voyage!',
        ready: 'All hands on deck! Let us sail the Hispaniola!'
      },

      // Friendly islanders across the 4x3 world
      npcs: [
        xy('b1', 636, 292, {
          id: 'jim', name: 'Jim Hawkins',
          img: 'art/flat/c_jim.webp', happy: 'art/flat/c_jim_happy.webp', hMul: 1.0,
          lines: {
            g3: 'Welcome to Practice Island! Explore all 12 areas, check the Benbow Inn door, or head north to the Forest notice board!',
            g4: 'Welcome, Explorer! Walk anywhere across our island — visit the Lighthouse, Waterfall bridge, Village market, and the Bay dock!',
            done: 'You solved all five island clues! Head to the Stone Dock in The Bay when you are ready to sail!'
          }
        }),
        xy('a1', 615, 336, {
          id: 'livesey', name: 'Dr. Livesey',
          img: 'art/flat/c_livesey.webp', happy: 'art/flat/c_livesey_happy.webp', hMul: 1.0,
          lines: {
            g3: 'From the Lighthouse cliff you can walk east through the Forest and across the Waterfall footbridge!',
            g4: 'Keep a sharp eye behind tree tops and cottage roofs — 24 gold coins are hidden across the 12 map areas!',
            done: 'Splendid work, Captain! The Lighthouse lamp shines bright for your voyage!'
          }
        }),
        xy('b2', 608, 326, {
          id: 'baker', name: 'Village Baker',
          img: 'art/flat/v_baker.webp', happy: 'art/flat/v_baker_happy.webp', hMul: 0.98,
          lines: {
            g3: 'Fresh warm bread in the Village Square! Have you peeked behind the cottage roofs for shiny coins?',
            g4: 'Welcome to the Village! Follow the south road to reach the sunny Beach, or go east to the Windmill Farm!',
            done: 'Hooray for our island hero! Take a warm loaf for the sea voyage!'
          }
        }),
        xy('b3', 622, 315, {
          id: 'farmer', name: 'Friendly Farmer',
          img: 'art/flat/v_farmer.webp', happy: 'art/flat/v_farmer_happy.webp', hMul: 0.98,
          lines: {
            g3: 'Our cabbages, carrots, and red apples are growing fast! Try walking under the apple tree tops!',
            g4: 'East of the Farm lies the glowing Cave, and north-east up the hill stands the Spyglass Lookout!',
            done: 'Thank you for visiting the Farm, Captain!'
          }
        }),
        xy('c1', 465, 316, {
          id: 'billy', name: 'Captain Billy',
          img: 'art/flat/c_billy.webp', happy: 'art/flat/c_billy_happy.webp', hMul: 1.02,
          lines: {
            g3: 'Ahoy! Walk out onto the wooden Harbour pier to spin the Ship Wheel, and watch the crabs on the sand!',
            g4: 'My old sea chest rests beside the shipwreck in Palm Cove to the east! Follow the sandy beach!',
            done: 'Shiver me timbers, you found every clue on the coast!'
          }
        }),
        xy('c4', 678, 382, {
          id: 'silver', name: 'Long John Silver',
          img: 'art/flat/c_silver.webp', happy: 'art/flat/c_silver_happy.webp', hMul: 1.04,
          lines: {
            g3: 'Welcome to The Bay! Step onto the wide stone dock right behind our ship\'s tall masts!',
            g4: 'The Hispaniola is moored right here at the stone quay! Walk along the dock to inspect the rigging!',
            done: 'Anchors aweigh, shipmate! Step up to the gangplank on the stone dock to set sail!'
          }
        })
      ],

      companion: {
        name: 'Benbow', kind: 'cat',
        img: 'art/flat/c_benbow.webp', happy: 'art/flat/c_benbow_happy.webp',
        walk1: 'art/ch1/c_benbow_walk1.webp', walk2: 'art/ch1/c_benbow_walk2.webp', sit: 'art/ch1/c_benbow_sit.webp',
        hMul: 0.48, line: 'Purrr! Let us explore every corner of the island!'
      },

      // 24 collectible coins: exactly 2 in each of the 12 tiles (a1..c4)
      findsKey: 'eaa_rg_w1_coins_v1_',
      finds: [
        // Row A (a1..a4)
        xy('a1', 298, 224, { id: 'w1_c01', img: 'art/flat/u_coin.webp', coins: 5 }),
        xy('a1', 1180, 214, { id: 'w1_c02', img: 'art/flat/u_coin.webp', coins: 5 }),
        xy('a2', 215, 212, { id: 'w1_c03', img: 'art/flat/u_coin.webp', coins: 5 }),
        xy('a2', 1150, 610, { id: 'w1_c04', img: 'art/flat/u_coin.webp', coins: 5 }),
        xy('a3', 465, 272, { id: 'w1_c05', img: 'art/flat/u_coin.webp', coins: 5 }),
        xy('a3', 915, 515, { id: 'w1_c06', img: 'art/flat/u_coin.webp', coins: 5 }),
        xy('a4', 260, 212, { id: 'w1_c07', img: 'art/flat/u_coin.webp', coins: 5 }),
        xy('a4', 1012, 298, { id: 'w1_c08', img: 'art/flat/u_coin.webp', coins: 5 }),
        // Row B (b1..b4)
        xy('b1', 248, 240, { id: 'w1_c09', img: 'art/flat/u_coin.webp', coins: 5 }),
        xy('b1', 1140, 610, { id: 'w1_c10', img: 'art/flat/u_coin.webp', coins: 5 }),
        xy('b2', 972, 124, { id: 'w1_c11', img: 'art/flat/u_coin.webp', coins: 5 }),
        xy('b2', 220, 615, { id: 'w1_c12', img: 'art/flat/u_coin.webp', coins: 5 }),
        xy('b3', 980, 72,  { id: 'w1_c13', img: 'art/flat/u_coin.webp', coins: 5 }),
        xy('b3', 978, 546, { id: 'w1_c14', img: 'art/flat/u_coin.webp', coins: 5 }),
        xy('b4', 975, 202, { id: 'w1_c15', img: 'art/flat/u_coin.webp', coins: 5 }),
        xy('b4', 260, 620, { id: 'w1_c16', img: 'art/flat/u_coin.webp', coins: 5 }),
        // Row C (c1..c4)
        xy('c1', 410, 142, { id: 'w1_c17', img: 'art/flat/u_coin.webp', coins: 5 }),
        xy('c1', 692, 628, { id: 'w1_c18', img: 'art/flat/u_coin.webp', coins: 5 }),
        xy('c2', 408, 182, { id: 'w1_c19', img: 'art/flat/u_coin.webp', coins: 5 }),
        xy('c2', 1140, 385, { id: 'w1_c20', img: 'art/flat/u_coin.webp', coins: 5 }),
        xy('c3', 528, 166, { id: 'w1_c21', img: 'art/flat/u_coin.webp', coins: 5 }),
        xy('c3', 1065, 380, { id: 'w1_c22', img: 'art/flat/u_coin.webp', coins: 5 }),
        xy('c4', 280, 380, { id: 'w1_c23', img: 'art/flat/u_coin.webp', coins: 5 }),
        xy('c4', 905, 444, { id: 'w1_c24', img: 'art/flat/u_coin.webp', coins: 5 })
      ],

      // Kickable beach ball + goal posts on the central Beach (c2) & crabs across all 4 beach tiles (c1..c4)
      ball: xy('c2', 560, 355),
      goal: { x: TILE_W * 1 + 680, y1: TILE_H * 2 + 318, y2: TILE_H * 2 + 398 },
      crabs: [
        xy('c1', 350, 392), xy('c1', 960, 398),
        xy('c2', 250, 395), xy('c2', 980, 392),
        xy('c3', 310, 392), xy('c3', 1120, 395),
        xy('c4', 360, 392), xy('c4', 585, 395)
      ],

      // Warm glows, chimney smoke & lighthouse lamp
      glows: [
        xy('b1', 525, 165, { r: 72 }),
        xy('b1', 428, 205, { r: 64 }),
        xy('b4', 975, 155, { r: 110, lantern: true }),
        xy('b4', 828, 240, { r: 58, lantern: true })
      ],
      smoke: xy('b1', 376, 36),
      lighthouse: xy('a1', 398, 92),
      fireflies: { n: 22, x0: 1450, x1: 2700, y0: 150, y1: 680 },
      flint: true,

      greet: {
        g3: 'Welcome to Practice Island! Walk freely across all 12 map areas, hold Shift or Run to sprint, and press E at any stop!',
        g4: 'Welcome to Practice Island! Explore from the Lighthouse to The Bay, hunt for all 24 coins, and visit any stop!'
      }
    },

    /* ───────────────────── CHAPTER 2 · HISPANIOLA BAY ───────────────────── */
    ch2: {
      chapter: 2,
      key: 'bay',
      title: 'Chapter 2 · Hispaniola Bay & Lighthouse Cove',
      bg: 'art/ch2/bg_ch2_bay.webp',
      persp: { y0: 195, y1: 690, h0: 84, h1: 196 },
      spawn: { x: 432, y: 632 },
      spawnFromSea: { x: 648, y: 540 },

      walk: {
        areas: [
          [[270, 588], [552, 578], [768, 594], [992, 608], [1166, 622], [1182, 666], [968, 662], [728, 650], [492, 646], [282, 648]],
          [[618, 496], [680, 496], [686, 602], [612, 602]]
        ],
        ribbons: [
          [[648, 520, 26], [648, 598, 28], [534, 604, 30], [420, 614, 32], [326, 600, 28], [262, 560, 22], [238, 510, 20], [278, 472, 20], [344, 456, 20], [398, 444, 22]],
          [[648, 598, 28], [786, 606, 30], [928, 612, 30], [1062, 602, 28], [1148, 566, 22], [1170, 514, 20], [1132, 472, 18], [1072, 434, 18], [1038, 392, 16], [1048, 336, 15], [1082, 280, 15], [1124, 232, 15], [1148, 202, 18]]
        ],
        holes: [
          [[292, 330], [500, 330], [500, 438], [292, 438]]
        ]
      },

      surfaces: [
        { type: 'wood',  poly: [[606, 490], [692, 490], [696, 606], [602, 606]] },
        { type: 'stone', poly: [[1000, 180], [1220, 180], [1220, 530], [1000, 530]] },
        { type: 'stone', poly: [[210, 420], [430, 420], [430, 540], [210, 540]] }
      ],

      occluders: [
        { base: 438, poly: [[288, 290], [508, 290], [508, 436], [288, 436]] },
        { base: 520, poly: [[602, 478], [625, 478], [625, 520], [602, 520]] },
        { base: 520, poly: [[671, 478], [694, 478], [694, 520], [671, 520]] }
      ],

      sea: [[430, 405], [1010, 398], [1028, 588], [760, 584], [552, 572], [356, 568]],
      seaAvoid: [[604, 488], [694, 488], [698, 604], [600, 604]],

      boats: [
        { img: 'art/ch1/o_rowboat_2.webp', x: 540, y: 548, w: 96, flip: false, d: 0 },
        { img: 'art/ch1/o_rowboat_1.webp', x: 878, y: 556, w: 88, flip: true,  d: 1 }
      ],

      glows: [
        { x: 398, y: 392, r: 95 },
        { x: 614, y: 486, r: 44, lantern: true },
        { x: 682, y: 486, r: 44, lantern: true }
      ],
      lighthouse: { x: 1148, y: 98 },

      stops: [
        { n: 1, name: "Silver's Galley Kitchen", x: 332, y: 604, prop: 'art/ch2/o_songpyeon.webp', h: 74, solid: 24 },
        { n: 2, name: 'Harvest Moon Pavilion',   x: 398, y: 444, prop: 'art/ch2/o_loom.webp', propAt: [452, 444], h: 68, solid: 22 },
        { n: 3, name: 'Two-Forests Trail',       x: 1094, y: 556, prop: 'art/flat/o_acorn.webp', h: 62, solid: 20 },
        { n: 4, name: 'Swallow Cove Pier',       x: 648, y: 530, prop: 'art/ch2/c_swallow.webp', propAt: [680, 514], h: 58 },
        { n: 5, name: 'Spyglass Lighthouse',     x: 1148, y: 202, prop: 'art/ch2/o_map_piece2.webp', h: 50 }
      ],
      board: { x: 778, y: 536, r: 100 },
      boardLines: {
        locked: 'Look! The Hispaniola is anchored in the cove. Tap Sea Chart to sail anywhere!',
        ready:  'Opening Captain Flint\'s Grand Sea Chart!'
      },

      npcs: [
        {
          id: 'silver', name: 'Long John Silver', x: 274, y: 616,
          img: 'art/flat/c_silver.webp', happy: 'art/flat/c_silver_happy.webp', hMul: 1.04,
          lines: {
            g3: 'Ahoy, shipmate! Step up to my galley pot — we are making sweet harvest rice cakes!',
            g4: 'Welcome to Lighthouse Cove! Walk the golden forest trail and spot the two kinds of trees!',
            done: 'Shiver me timbers, you lit the Spyglass Lighthouse! Map Piece Two is yours!'
          }
        },
        {
          id: 'livesey', name: 'Dr. Livesey', x: 966, y: 616,
          img: 'art/flat/c_livesey.webp', happy: 'art/flat/c_livesey_happy.webp', hMul: 0.98,
          lines: {
            g3: 'Remember to say thank you to everyone who helps on the island! Kind words open every door.',
            g4: 'Look closely at the leaves: broad leaves fall in autumn, while pine needles stay green all winter!',
            done: 'Splendid work, young explorer! Both forest and cove are thriving thanks to you.'
          }
        }
      ],

      companion: {
        name: 'Lulu', kind: 'crab',
        img: 'art/flat/c_lulu.webp', happy: 'art/flat/c_lulu_happy.webp',
        hMul: 0.44, line: 'Snip-snap! Follow the lantern path up to the lighthouse!'
      },

      findsKey: 'eaa_rg_finds_ch2_',
      finds: [
        { id: 'c2_f1', x: 242,  y: 520, img: 'art/flat/o_shell.webp',     coins: 5, mat: 'shell' },
        { id: 'c2_f2', x: 520,  y: 634, img: 'art/flat/u_coin.webp',      coins: 5 },
        { id: 'c2_f3', x: 834,  y: 636, img: 'art/flat/o_pearl.webp',     coins: 8, mat: 'crystal' },
        { id: 'c2_f4', x: 1164, y: 522, img: 'art/flat/o_acorn.webp',     coins: 5, mat: 'wood' },
        { id: 'c2_f5', x: 1054, y: 344, img: 'art/flat/o_star_gem.webp',  coins: 10, mat: 'crystal' },
        { id: 'c2_f6', x: 320,  y: 462, img: 'art/flat/o_pine_cone.webp', coins: 6, mat: 'wood' }
      ],

      ball: { x: 742, y: 626 },
      goal: { x: 892, y1: 604, y2: 650 },
      crabs: [{ x: 468, y: 636 }, { x: 924, y: 638 }],
      leaves: { n: 18, x0: 960, x1: 1360, y0: -20, y1: 260, floor: 580 },
      fireflies: { n: 12, x0: 200, x1: 540, y0: 320, y1: 520 },
      swallows: true,

      greet: {
        g3: 'Welcome to Lighthouse Cove! Walk anywhere on the beach, up to the Moon Pavilion, or climb the Lighthouse cliff!',
        g4: 'Welcome to Hispaniola Bay! Explore the beach, the Two-Forests trail, and climb all the way to the Lighthouse!'
      }
    }
  };
})(typeof window !== 'undefined' ? window : this);
