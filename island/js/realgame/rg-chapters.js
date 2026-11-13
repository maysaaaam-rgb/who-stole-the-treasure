/* ═══════════════════════════════════════════════════════════════
   Practice Island · Real Game · Chapter World Data
   (island/js/realgame/rg-chapters.js -> window.RG_CHAPTERS)

   Every number is a painting pixel on the 1376 x 768 chapter art.
   - walk.areas    : polygons the hero can stand on (sand, grass, pier planks)
   - walk.ribbons  : winding paths as [x, y, halfWidth] centre points
   - walk.holes    : places inside an area that are solid (the pavilion floor)
   - occluders     : parts of the painting cut out and drawn IN FRONT of the hero
                     whenever the hero's feet are above `base` (walk behind posts,
                     flowers and the pavilion like in a real 2.5D game)
   - stops         : the five Global Readings lesson stops (they open the existing
                     Harbour / BayWorld stop adventures, so every lesson is unchanged)
   - npcs          : talkable characters (English only, Global Readings themed lines)
   - finds         : hidden treasures (same ids + storage keys as the classic worlds)
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var FLAT = 'art/flat/';
  var CH1 = 'art/ch1/';
  var CH2 = 'art/ch2/';
  var Z2 = 'art/z2/';

  function post(x0, x1, y0, base) {
    return { base: base, poly: [[x0, y0], [x1, y0], [x1, base], [x0, base]] };
  }

  root.RG_CHAPTERS = {
    /* ─────────────────────────────── Chapter 1 · Admiral Benbow Harbour ─────────────────────────────── */
    ch1: {
      chapter: 1,
      key: 'ch1',
      title: '⚓ Ch.1 · Benbow Harbour',
      bg: CH1 + 'bg_benbow_empty.webp',
      bg2x: 'art/real/bg_ch1_2x.webp',
      findsKey: 'hb-finds-g',
      persp: { y0: 356, y1: 768, h0: 52, h1: 96 },
      spawn: { x: 362, y: 394 },
      spawnFromSea: { x: 872, y: 606 },
      companion: {
        id: 'benbow', name: 'Benbow', kind: 'cat',
        img: FLAT + 'c_benbow.webp', walk1: CH1 + 'c_benbow_walk1.webp', walk2: CH1 + 'c_benbow_walk2.webp',
        sit: CH1 + 'c_benbow_sit.webp', happy: FLAT + 'c_benbow_happy.webp', hMul: 0.62,
        line: 'Purr! Benbow loves exploring with you!'
      },
      walk: {
        ribbons: [
          [[374, 378, 16], [322, 390, 18], [266, 402, 20], [214, 420, 20], [172, 446, 20], [152, 476, 20], [152, 506, 20], [172, 532, 20], [206, 550, 18], [230, 556, 16]],
          [[226, 552, 14], [268, 566, 14], [310, 583, 14], [350, 598, 15]]
        ],
        areas: [
          [[336, 356], [400, 356], [406, 384], [338, 390]],
          [[398, 364], [452, 366], [482, 392], [446, 410], [398, 402]],
          [[344, 592], [420, 597], [480, 600], [522, 597], [528, 628], [517, 634], [483, 631], [450, 638], [413, 651], [383, 673], [352, 700], [338, 733], [338, 768], [193, 768], [200, 740], [217, 713], [250, 688], [285, 673], [318, 660], [352, 645], [378, 636], [368, 618], [350, 604]],
          [[520, 598], [614, 586], [705, 579], [795, 572], [905, 589], [906, 615], [800, 612], [700, 616], [641, 621], [523, 628]],
          [[526, 628], [575, 627], [610, 634], [622, 652], [600, 664], [560, 660], [540, 646]]
        ],
        holes: []
      },
      surfaces: [
        { type: 'wood', poly: [[520, 598], [614, 586], [705, 579], [795, 572], [905, 589], [906, 615], [800, 612], [700, 616], [641, 621], [523, 628]] },
        { type: 'stone', poly: [[336, 356], [400, 356], [406, 384], [338, 390]] },
        { type: 'wood', poly: [[222, 545], [268, 558], [356, 590], [350, 606], [262, 576], [218, 560]] }
      ],
      sea: [[735, 338], [1236, 330], [1236, 420], [1376, 424], [1376, 610], [1150, 636], [1150, 768], [930, 768], [912, 612], [735, 566]],
      seaAvoid: null,
      ship: { img: CH1 + 'o_ship.webp', x: 1112, y: 548, w: 425, oy: 0.92 },
      boats: [
        { img: CH1 + 'o_rowboat_3.webp', x: 690, y: 556, w: 84, flip: false, d: 0 },
        { img: CH1 + 'o_rowboat_2.webp', x: 796, y: 644, w: 74, flip: true, d: 0.7 },
        { img: CH1 + 'o_rowboat_1.webp', x: 630, y: 656, w: 78, flip: false, d: 1.4 },
        { img: CH1 + 'o_rowboat_2.webp', x: 698, y: 694, w: 86, flip: false, d: 2.1 },
        { img: CH1 + 'o_rowboat_1.webp', x: 877, y: 724, w: 80, flip: true, d: 2.8 }
      ],
      occluders: [
        post(553, 569, 604, 646), post(634, 648, 598, 633), post(670, 682, 590, 626), post(720, 731, 583, 624),
        post(815, 827, 590, 640), post(852, 865, 599, 642), post(901, 914, 588, 633),
        { base: 768, poly: [[413, 651], [450, 637], [495, 632], [518, 645], [541, 664], [586, 686], [641, 705], [677, 705], [723, 723], [768, 732], [814, 741], [842, 768], [338, 768], [338, 733], [352, 700], [383, 673]] },
        { base: 768, poly: [[0, 585], [60, 580], [130, 600], [176, 640], [204, 700], [196, 768], [0, 768]] }
      ],
      glows: [
        { x: 148, y: 238, r: 26 }, { x: 240, y: 256, r: 20 }, { x: 352, y: 240, r: 26 }, { x: 134, y: 318, r: 30 },
        { x: 245, y: 318, r: 24 }, { x: 410, y: 314, r: 28 }, { x: 318, y: 318, r: 18 }, { x: 377, y: 318, r: 16 }
      ],
      smoke: { x: 233, y: 128 },
      fireflies: { x0: 20, y0: 330, x1: 480, y1: 600, n: 14 },
      leaves: null,
      flint: true,
      swallows: false,
      ball: null,
      crabs: [{ x: 590, y: 650 }],
      board: { x: 902, y: 606, r: 34 },
      stops: [
        { n: 1, x: 366, y: 366, ring: [366, 376], prop: null, name: 'Benbow Inn Door' },
        { n: 2, x: 112, y: 524, prop: FLAT + 'o_notice_board.webp', h: 84, solid: 16, name: 'Inventor & Brain Board' },
        { n: 3, x: 600, y: 589, prop: FLAT + 'o_ship_wheel.webp', h: 50, solid: 9, name: 'Ship Wheel Challenge' },
        { n: 4, x: 758, y: 582, prop: FLAT + 'o_spyglass.webp', h: 62, solid: 8, name: 'Pier Spyglass Lookout' },
        { n: 5, x: 884, y: 597, prop: FLAT + 'o_billy_chest.webp', h: 42, solid: 9, name: "Billy's Sea Chest" }
      ],
      npcs: [
        {
          id: 'jim', name: 'Jim Hawkins', img: FLAT + 'c_jim.webp', happy: CH1 + 'c_jim_wave.webp', x: 434, y: 386, hMul: 1.0,
          lines: {
            g3: 'Ahoy, Captain! Clara Doodle invents clever machines. Knock on the Benbow Inn door to start!',
            g4: 'Ahoy, Captain! Alice fell down a rabbit hole full of books. Knock on the inn door to start!',
            done: 'You solved all five clues! Walk to the end of the pier and board the Hispaniola!'
          }
        },
        {
          id: 'livesey', name: 'Dr. Livesey', img: FLAT + 'c_livesey.webp', happy: FLAT + 'c_livesey_happy.webp', x: 196, y: 404, hMul: 1.12,
          lines: {
            g3: 'First, make a plan. Second, build it. If it does not work, change it and try again!',
            g4: 'Reading is a workout for your brain! Picture the story in your mind as you read.',
            done: 'Splendid work, Captain! Your brain is getting stronger every day.'
          }
        },
        {
          id: 'billy', name: 'Billy Bones', img: FLAT + 'c_billy.webp', happy: FLAT + 'c_billy_happy.webp', x: 470, y: 612, hMul: 1.1,
          lines: {
            g3: 'Ahoy, matey! An invention solves a problem. My sea chest waits at the end of the pier!',
            g4: 'Ahoy, matey! Good readers ask who, what, where, when, why and how. My sea chest waits on the pier!',
            done: 'Ha! You opened my sea chest. The Hispaniola is ready to sail!'
          }
        }
      ],
      finds: [
        { id: 'shell1', img: FLAT + 'o_shell.webp', x: 362, y: 662, mat: 'shell', coins: 3 },
        { id: 'coin1', img: FLAT + 'u_coin.webp', x: 158, y: 498, coins: 4 },
        { id: 'star1', img: FLAT + 'o_starfish.webp', x: 578, y: 650, mat: 'shell', coins: 3 },
        { id: 'bottle', img: 'art/o_bottle.webp', x: 272, y: 734, coins: 5 },
        { id: 'coin2', img: FLAT + 'u_coin.webp', x: 444, y: 390, coins: 4 }
      ],
      greet: {
        g3: 'Welcome to Benbow Harbour! Walk with the arrow keys, or drag to move. Press E to talk.',
        g4: 'Welcome to Benbow Harbour! Walk with the arrow keys, or drag to move. Press E to talk.'
      },
      boardLines: {
        ready: 'All aboard the Hispaniola! Setting sail for Chapter Two: Hispaniola Bay!',
        locked: 'Solve four harbour clues first, Captain, then we set sail on the Hispaniola!'
      }
    },

    /* ─────────────────────────────── Chapter 2 · Hispaniola Bay & Lighthouse Cove ─────────────────────────────── */
    ch2: {
      chapter: 2,
      key: 'ch2',
      title: '🗼 Ch.2 · Hispaniola Bay',
      bg: CH2 + 'bg_ch2_bay.webp',
      bg2x: 'art/real/bg_ch2_2x.webp',
      findsKey: 'ch2-finds-g',
      persp: { y0: 316, y1: 768, h0: 44, h1: 96 },
      spawn: { x: 520, y: 618 },
      spawnFromSea: { x: 560, y: 614 },
      companion: {
        id: 'lulu', name: 'Lulu', kind: 'crab',
        img: FLAT + 'c_lulu_happy.webp', happy: FLAT + 'c_lulu_happy.webp', hMul: 0.5,
        line: 'Snip snap! Lulu is so happy to explore the bay with you!'
      },
      walk: {
        ribbons: [
          [[563, 326, 14], [520, 338, 14], [489, 348, 14], [458, 358, 14], [410, 377, 15], [368, 397, 15], [350, 420, 15], [343, 450, 15], [340, 480, 16], [338, 500, 17]]
        ],
        areas: [
          [[470, 362], [520, 346], [580, 330], [628, 344], [620, 368], [560, 392], [470, 410], [420, 412], [402, 398]],
          [[152, 497], [250, 492], [304, 498], [340, 512], [352, 545], [352, 590], [372, 628], [362, 650], [338, 650], [345, 610], [318, 575], [290, 560], [240, 558], [170, 557], [152, 530]],
          [[330, 498], [535, 496], [560, 512], [545, 532], [345, 538]],
          [[345, 590], [452, 600], [509, 600], [536, 578], [545, 534], [565, 522], [590, 560], [600, 575], [545, 598], [542, 628], [600, 632], [640, 617], [700, 613], [722, 628], [745, 650], [800, 673], [886, 684], [971, 707], [1057, 730], [1160, 760], [1160, 768], [870, 768], [857, 726], [800, 718], [700, 708], [632, 692], [620, 662], [573, 655], [535, 643], [496, 632], [458, 635], [427, 651], [396, 668], [375, 710], [340, 768], [200, 768], [214, 712], [250, 670], [340, 654], [372, 630]],
          [[540, 600], [640, 587], [800, 571], [855, 580], [908, 594], [908, 619], [800, 608], [700, 613], [640, 617], [540, 627]]
        ],
        holes: [
          [[345, 536], [532, 532], [537, 576], [509, 598], [452, 599], [350, 592]]
        ]
      },
      surfaces: [
        { type: 'wood', poly: [[540, 600], [640, 587], [800, 571], [855, 580], [908, 594], [908, 619], [800, 608], [700, 613], [640, 617], [540, 627]] },
        { type: 'stone', poly: [[470, 362], [520, 346], [580, 330], [628, 344], [620, 368], [560, 392], [470, 410], [420, 412], [402, 398]] }
      ],
      sea: [[640, 345], [895, 345], [895, 560], [1285, 560], [1285, 345], [1376, 345], [1376, 610], [1262, 628], [1250, 700], [1376, 742], [1376, 768], [1180, 768], [1057, 730], [971, 707], [886, 684], [800, 673], [745, 650], [722, 632], [915, 632], [915, 560], [640, 580], [592, 570], [570, 535], [600, 508], [690, 505], [782, 448], [700, 400], [650, 380]],
      ship: null,
      boats: [],
      occluders: [
        { base: 590, poly: [[318, 470], [326, 452], [400, 428], [432, 434], [432, 600], [350, 593], [330, 560]] },
        { base: 578, poly: [[432, 434], [470, 440], [536, 462], [541, 474], [538, 577], [510, 600], [432, 600]] },
        post(636, 647, 598, 625), post(670, 681, 593, 628), post(720, 730, 584, 622), post(781, 791, 577, 614),
        post(815, 827, 590, 628), post(853, 864, 598, 642), post(902, 912, 587, 634),
        { base: 768, poly: [[396, 668], [427, 651], [458, 635], [496, 632], [535, 643], [573, 655], [620, 662], [632, 692], [700, 708], [800, 718], [857, 726], [872, 768], [340, 768], [375, 710]] },
        { base: 768, poly: [[0, 566], [80, 575], [158, 600], [200, 650], [214, 712], [200, 768], [0, 768]] }
      ],
      glows: [
        { x: 331, y: 503, r: 24, lantern: true }, { x: 436, y: 522, r: 24, lantern: true }, { x: 527, y: 507, r: 24, lantern: true },
        { x: 452, y: 292, r: 12 }, { x: 466, y: 273, r: 10 }, { x: 540, y: 273, r: 10 }, { x: 553, y: 296, r: 12 }
      ],
      smoke: { x: 496, y: 210 },
      fireflies: { x0: 120, y0: 360, x1: 420, y1: 560, n: 10 },
      leaves: { x0: 0, y0: 30, x1: 430, y1: 300, floor: 560, n: 12 },
      flint: false,
      swallows: true,
      lighthouse: { x: 1281, y: 112 },
      ball: { x: 742, y: 664 },
      crabs: [{ x: 790, y: 696 }, { x: 990, y: 738 }, { x: 640, y: 642 }],
      board: { x: 902, y: 606, r: 34 },
      stops: [
        { n: 1, x: 480, y: 606, prop: null, name: 'Harvest & Forest Pavilion' },
        { n: 2, x: 202, y: 514, prop: CH2 + 'o_loom.webp', h: 64, solid: 16, name: 'Moonlight Weaving Clearing' },
        { n: 3, x: 548, y: 332, prop: CH2 + 'c_swallow.webp', propAt: [592, 330], h: 30, name: 'Twin Forest Cottage' },
        { n: 4, x: 762, y: 578, prop: Z2 + 'o_fishing_rod.webp', h: 52, solid: 7, name: 'Coral Fishing Pier' },
        { n: 5, x: 940, y: 738, prop: FLAT + 'o_billy_chest.webp', h: 46, solid: 13, name: "Silver's Coral Chest" }
      ],
      npcs: [
        {
          id: 'silver', name: 'Long John Silver', img: FLAT + 'c_silver.webp', happy: FLAT + 'c_silver_happy.webp', x: 574, y: 574, hMul: 1.14,
          lines: {
            g3: 'Welcome to Hispaniola Bay! At Chuseok, families share a harvest feast. I am thankful for good friends!',
            g4: 'Welcome to Hispaniola Bay! Coniferous trees keep their needles all year, so they can survive the snow!',
            done: 'You lit the lighthouse! Open the Sea Chart and sail on to Chapter Three!'
          }
        },
        {
          id: 'jim2', name: 'Jim Hawkins', img: FLAT + 'c_jim.webp', happy: FLAT + 'c_jim_happy.webp', x: 664, y: 660, hMul: 0.98,
          lines: {
            g3: 'Look at the pavilion! The families are getting ready for the harvest festival.',
            g4: 'Look at the two forests! Deciduous trees lose their leaves in autumn.',
            done: 'Captain Flint\'s second map piece is ours! What an adventure!'
          }
        },
        {
          id: 'livesey2', name: 'Dr. Livesey', img: FLAT + 'c_livesey.webp', happy: FLAT + 'c_livesey_happy.webp', x: 470, y: 392, hMul: 1.1,
          lines: {
            g3: 'In the story First Harvest, a family grows potatoes on Mars. There are many potatoes!',
            g4: 'In the folktale, Go Ne helped a hurt swallow. Kind actions come back to you!',
            done: 'Wonderful reading, Captain! The whole bay is proud of you.'
          }
        }
      ],
      finds: [
        { id: 'ch2_shell1', img: FLAT + 'o_shell.webp', x: 300, y: 690, mat: 'shell', coins: 4 },
        { id: 'ch2_star1', img: FLAT + 'o_starfish.webp', x: 522, y: 628, mat: 'shell', coins: 4 },
        { id: 'ch2_coin1', img: FLAT + 'u_coin.webp', x: 690, y: 680, coins: 5 },
        { id: 'ch2_crys1', img: FLAT + 'i_crystal.webp', x: 172, y: 540, mat: 'crystal', coins: 5 },
        { id: 'ch2_shell2', img: FLAT + 'o_shell.webp', x: 902, y: 748, mat: 'shell', coins: 4 }
      ],
      greet: {
        g3: 'Welcome to Hispaniola Bay! Unit Two: Thank You! Walk to the glowing stop to begin.',
        g4: 'Welcome to Hispaniola Bay! Unit Two: What Lives Here? Walk to the glowing stop to begin.'
      },
      boardLines: {
        ready: 'Open the Sea Chart to choose your next island, Captain!',
        locked: 'Open the Sea Chart to choose your next island, Captain!'
      }
    }
  };
})(typeof window !== 'undefined' ? window : this);
