/* Treasure Island (جزيرة الكنز) — The Story Engine:
   Jim Hawkins, Baby Leopard Benbow, Parrot Flint, Long John Silver, Dr. Livesey, Captain Smollett & Ben Gunn!
   Keeps all Grade 3 & Grade 4 textbook missions while framing every stop as an authentic chapter of Treasure Island. */
(function (root) {
  'use strict';

  var CHARS = {
    pip:    { name: 'Parrot Flint',                pic: 'c_pip',    emoji: '🦜', poses: { happy: 'c_pip_happy', cheer: 'c_pip_cheer' } },
    benbow: { name: 'Benbow the Leopard',          pic: 'c_benbow', emoji: '🐆', poses: { happy: 'c_benbow_happy' } },
    1:      { name: 'Jim Hawkins & Benbow',        pic: 'c_bolt',   emoji: '🧭', poses: { happy: 'c_bolt_happy',  worried: 'c_bolt_worried',  idea: 'c_bolt_idea'  } },
    2:      { name: 'Captain Silver',              pic: 'c_lulu',   emoji: '⚓', poses: { happy: 'c_lulu_happy',  worried: 'c_lulu_worried',  idea: 'c_lulu_idea'  } },
    3:      { name: 'Dr. Livesey & Trelawney',     pic: 'c_nutty',  emoji: '📜', poses: { happy: 'c_nutty_happy', worried: 'c_nutty_worried', idea: 'c_nutty_idea' } },
    4:      { name: 'Captain Smollett & Ben Gunn', pic: 'c_ember',  emoji: '🏝️', poses: { happy: 'c_ember_happy', worried: 'c_ember_worried', idea: 'c_ember_idea' } }
  };

  /* One Treasure Island plot per regular mission, in order: listen, match, read, build, say */
  var PLOTS = {
    1: [
      {
        icon: '🗝️',
        pic: 'o_compass',
        title: "Clue 1: Billy Bones's Brass Lock",
        intro: [
          "Welcome to Admiral Benbow Harbour! My leopard cub Benbow and I found Captain Billy Bones's old sea chest!",
          "Listen carefully and pick the right brass gear so we can unlock the first secret!"
        ],
        thanks: "Click! The first brass lock opened! Benbow is purring with joy!"
      },
      {
        icon: '🧭',
        pic: 'z1/o_machine_off',
        title: "Clue 2: Dr. Livesey's Sea Instruments",
        intro: [
          "A sea storm mixed up all the navigation tools at the Admiral Benbow Inn!",
          "Can you match the parts so Dr. Livesey and Squire Trelawney can read our course?"
        ],
        thanks: "Well done, sailor! Our compass and spyglass are ready for the sea!"
      },
      {
        icon: '🗺️',
        pic: 'o_map_scroll',
        title: "Clue 3: Flint's Torn Treasure Map",
        intro: [
          "Look inside the sea chest! It is Captain Flint's ancient Treasure Island Map, but some words are faded!",
          "Read the parchment clue and choose the right English word to restore the map!"
        ],
        thanks: "Amazing! We can see Spyglass Hill and Skull Peak on the map now!"
      },
      {
        icon: '⛵',
        pic: 'o_hispaniola',
        title: "Clue 4: The Hispaniola Ship Log",
        intro: [
          "Our great ship, the Hispaniola, is waiting at the harbour pier!",
          "Put the English words in the right order to write Captain Smollett's sailing orders!"
        ],
        thanks: "Anchors aweigh! The Hispaniola crew is ready to board!"
      },
      {
        icon: '🦜',
        pic: 'z1/o_machine_on',
        title: "Clue 5: Parrot Flint's Sea Call!",
        intro: [
          "Parrot Flint is perched on the mast! We need one brave captain's call to raise the sails!",
          "Say the English words in a loud, clear voice to awaken the harbour beacon!"
        ],
        thanks: "Pieces of eight! You found all 5 Map Clues in Benbow Harbour! Open Billy Bones's Sea Chest!"
      }
    ],
    2: [
      {
        icon: '🐟',
        pic: 'z2/o_fish',
        title: "Clue 1: Silver's Sea Galley",
        intro: [
          "Ahoy, shipmate! I am Long John Silver, the ship's cook aboard the Hispaniola!",
          "Listen and catch the right fish so we can feed the crew before landing on the beach!"
        ],
        thanks: "Shiver me timbers! That is the freshest catch on the seven seas!"
      },
      {
        icon: '🔦',
        pic: 'z2/o_lighthouse_off',
        title: "Clue 2: The Spyglass Shore Beacon",
        intro: [
          "The sea fog is thick around Spyglass Bay! The old shore lantern lost its parts.",
          "Match the pieces carefully so the Hispaniola doesn't hit the coral reef!"
        ],
        thanks: "Aye! You fixed the lantern like a true master mariner!"
      },
      {
        icon: '📜',
        pic: 'z2/w_ocean_boat',
        title: "Clue 3: Signal to the Hispaniola",
        intro: [
          "Jim Hawkins and Benbow are rowing ashore in the jolly-boat!",
          "Read the sea signal and choose the right word to guide them to the sandy cove!"
        ],
        thanks: "They read your signal! Jim and Benbow landed safely on the beach!"
      },
      {
        icon: '🚣',
        pic: 'z2/o_boat',
        title: "Clue 4: Row Through the Surf",
        intro: [
          "The waves are rolling high near Skeleton Inlet!",
          "Put the words in order to steer our boat safely to the harbour dock!"
        ],
        thanks: "Steady on the oars! Our boat is moored at the beach pier!"
      },
      {
        icon: '🌟',
        pic: 'z2/o_lighthouse_on',
        title: "Clue 5: Light the Spyglass Lighthouse!",
        intro: [
          "One final captain's command and the Spyglass Lighthouse will shine across the whole sea!",
          "Say the words nice and loud so every sailor can hear!"
        ],
        thanks: "The Spyglass Beacon is shining! Open Captain Silver's Sea Chest for Map Piece #2!"
      }
    ],
    3: [
      {
        icon: '🪨',
        pic: 'z3/o_stone',
        title: "Clue 1: Crossing the Jungle River",
        intro: [
          "Welcome to Stockade Forest! I am Dr. Livesey, and young Abraham Gray is with me.",
          "Our map clues fell onto the river stones! Listen and hop to the right stone!"
        ],
        thanks: "Splendid work! You crossed the river and kept the map dry!"
      },
      {
        icon: '🧺',
        pic: 'z3/o_basket',
        title: "Clue 2: Provisions for the Log Stockade",
        intro: [
          "Squire Trelawney brought supplies to our wooden Stockade Fort, but they are all mixed up!",
          "Can you match everything so our crew stays strong?"
        ],
        thanks: "Bravo! The Stockade Fort is stocked and ready!"
      },
      {
        icon: '📖',
        pic: 'z3/w_coins',
        title: "Clue 3: Silver's Truce Message",
        intro: [
          "Long John Silver sent a secret note to the Stockade, but some words are missing!",
          "Read carefully and choose the right word to decode his message!"
        ],
        thanks: "Aha! Dr. Livesey decoded the secret route to Spyglass Hill!"
      },
      {
        icon: '🌉',
        pic: 'z3/w_barter',
        title: "Clue 4: Guard the Wooden Bridge",
        intro: [
          "Jim Hawkins and Benbow are crossing the canyon bridge toward the tall pines!",
          "Put the words in order so they can cross safely!"
        ],
        thanks: "Across the bridge! Look, Benbow spotted the trail to Skull Peak!"
      },
      {
        icon: '🚩',
        pic: 'z3/o_market_open',
        title: "Clue 5: Raise the Stockade Flag!",
        intro: [
          "Captain Smollett says it is time to raise our colours over the Stockade!",
          "Speak the words loud and proud so the whole forest hears!"
        ],
        thanks: "Our flag flies high! Open Dr. Livesey's Chest to claim Map Piece #3!"
      }
    ],
    4: [
      {
        icon: '🌋',
        pic: 'z4/o_bubble',
        title: "Clue 1: Ben Gunn's Echo Cavern",
        intro: [
          "Hello, friend! I am Ben Gunn! I have lived on Treasure Island for three years!",
          "The volcano caverns are rumbling! Listen and tap the right bubble to calm the rocks!"
        ],
        thanks: "Hooray! Even Benbow the leopard isn't afraid of the mountain now!"
      },
      {
        icon: '🧭',
        pic: 'z4/o_launcher',
        title: "Clue 2: The Skeleton Compass Pointer",
        intro: [
          "Captain Flint's pointer on Spyglass Ridge shows the way to the gold!",
          "Match these clues with Captain Smollett so we don't lose the trail!"
        ],
        thanks: "Ten paces north by north-east! We are getting close to the treasure!"
      },
      {
        icon: '📜',
        pic: 'z4/w_sunrise',
        title: "Clue 3: The Riddle of the Tall Tree",
        intro: [
          "A spyglass riddle is carved into the rock above Ben Gunn's cave!",
          "Read the riddle and choose the right word to open the stone door!"
        ],
        thanks: "The stone door rumbles open! Look at the torchlight inside!"
      },
      {
        icon: '🐆',
        pic: 'z4/o_rocket',
        title: "Clue 4: Brave Explorers of Skull Peak",
        intro: [
          "Jim Hawkins, Benbow, and your monster are standing before the final vault!",
          "Put the words in order to speak the Captain's code!"
        ],
        thanks: "The golden chains unlocked! Even Long John Silver is cheering for you!"
      },
      {
        icon: '👑',
        pic: 'o_treasure_gold',
        title: "Clue 5: Captain Flint's Great Treasure!",
        intro: [
          "We found it! The legendary Treasure of Captain Flint is right inside Ben Gunn's cave!",
          "Say the final words in a brave captain's voice to open the Golden Vault!"
        ],
        thanks: "Pieces of eight! Gold and jewels everywhere! Open the Grand Treasure Chest!"
      }
    ]
  };

  var PIP_LINES = [
    "Pieces of eight! Let's find Captain Flint's treasure!",
    "Jim Hawkins and baby leopard Benbow are waiting for you!",
    "Ahoy, Captain! Follow the Golden Compass to the next clue!",
    "Tap a numbered Map Stop! Our Hispaniola crew needs your English!",
    "Squawk! Long John Silver says you are the smartest sailor on the island!",
    "Finish 5 Map Clues to open the Sea Chest and set sail!"
  ];

  /* Story pictures and faces for the talking scenes before each mission */
  var STORY_ART = {
    1: {
      1: [{ art: 's_z1_storm', pose: 'worried' }, { art: 'o_compass', pose: 'idea' }],
      2: [{ pose: 'worried' }, { pose: 'idea' }],
      3: [{ art: 'o_map_scroll', pose: 'worried' }, { pose: 'idea' }],
      4: [{ art: 'o_hispaniola', pose: 'idea' }, { pose: 'happy' }],
      5: [{ art: 's_z1_broken', pose: 'worried' }, { art: 'o_treasure_gold', pose: 'idea' }]
    },
    2: {
      1: [{ art: 's_z2_dark', pose: 'worried' }, { art: 's_z2_fish', pose: 'idea' }],
      2: [{ pose: 'worried' }, { pose: 'idea' }],
      3: [{ pose: 'worried' }, { pose: 'idea' }],
      4: [{ art: 'o_hispaniola', pose: 'idea' }, { pose: 'idea' }],
      5: [{ art: 's_z2_dark', pose: 'worried' }, { pose: 'idea' }]
    },
    3: {
      1: [{ art: 's_z3_prices', pose: 'worried' }, { pose: 'idea' }],
      2: [{ art: 's_z3_mixed', pose: 'worried' }, { pose: 'idea' }],
      3: [{ pose: 'worried' }, { pose: 'idea' }],
      4: [{ pose: 'idea' }, { pose: 'idea' }],
      5: [{ art: 's_z3_mixed', pose: 'worried' }, { pose: 'idea' }]
    },
    4: {
      1: [{ art: 's_z4_hiccup', pose: 'worried' }, { art: 's_z4_rockets', pose: 'idea' }],
      2: [{ pose: 'worried' }, { pose: 'idea' }],
      3: [{ pose: 'worried' }, { pose: 'idea' }],
      4: [{ pose: 'idea' }, { pose: 'idea' }],
      5: [{ art: 's_z4_hiccup', pose: 'worried' }, { art: 'o_treasure_gold', pose: 'idea' }]
    }
  };

  var ART = {};
  var ART_DIR = {};
  function loadArt(dir) {
    return fetch('art/' + dir + 'manifest.json?v=6').then(function (r) { return r.json(); }).then(function (list) {
      list.forEach(function (n) { ART[n] = true; ART_DIR[n] = dir; });
    }).catch(function () {});
  }
  var ready = Promise.all([loadArt(''), loadArt('z1/'), loadArt('z2/'), loadArt('z3/'), loadArt('z4/')]);

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function pic(name, emoji, cls, other) {
    if (!ART[name] && other && ART[other]) name = other;
    if (ART[name]) return '<img class="' + (cls || '') + '" src="art/' + (ART_DIR[name] || '') + name + '.webp" alt="">';
    return '<span class="gm-emoji ' + (cls || '') + '">' + emoji + '</span>';
  }

  function charPic(key, cls, pose) {
    var c = CHARS[key] || CHARS.pip;
    var posed = pose && c.poses && c.poses[pose];
    return pic(posed || c.pic, c.emoji, cls, c.pic);
  }

  function parseId(id) {
    var m = /^g[34]-z([1-4])-([ms])(\d+)$/.exec(String(id || ''));
    return m ? { zone: Number(m[1]), isStar: m[2] === 's', num: Number(m[3]) } : null;
  }

  function plotOf(id) {
    var p = parseId(id);
    if (!p || p.isStar) return null;
    return (PLOTS[p.zone] || [])[p.num - 1] || null;
  }

  /* Lines before a mission. A mission played before goes straight to the game. */
  function missionSteps(mission, doc) {
    if (mission.isDaily) return [{ who: 'pip', text: "Ahoy! Parrot Flint brought you Today's Captain Log! Five quick questions. Ready?" }];
    var p = parseId(mission.id);
    if (!p) return [];
    if (doc && doc.stars && doc.stars[mission.id]) return [];
    if (p.isStar) return [{ who: p.zone, text: 'A Golden Compass Star Mission! Answer carefully to earn extra pirate stars!' }];
    var plot = plotOf(mission.id);
    var art = (STORY_ART[p.zone] || {})[p.num] || [];
    return plot ? plot.intro.map(function (t, i) { var a = art[i] || {}; return { who: p.zone, text: t, art: a.art, pose: a.pose }; }) : [];
  }

  function thanks(mission) {
    if (mission.isDaily) return { who: 'pip', text: 'Pieces of eight! Great sailing today! See you tomorrow, Captain!' };
    var p = parseId(mission.id);
    if (!p) return null;
    if (p.isStar) return { who: p.zone, text: 'Shiver me timbers! You mastered the Golden Compass Star Mission!' };
    var plot = plotOf(mission.id);
    return plot ? { who: p.zone, text: plot.thanks } : null;
  }

  function thanksHtml(mission) {
    var t = thanks(mission);
    if (!t) return '';
    var p = parseId(mission.id);
    var fixedPic = p && !p.isStar && p.num === 5 ? 's_z' + p.zone + '_fixed' : '';
    var bigPic = fixedPic && ART[fixedPic] ? pic(fixedPic, '', 'gm-comic') : '';
    return bigPic + '<div class="gm-thanks">' + charPic(t.who, 'gm-thanks-pic', 'happy') + '<div class="gm-bubble gm-bubble-left"><b>' + esc(CHARS[t.who].name) + ':</b> ' + esc(t.text) + '</div></div>';
  }

  /* A short talking scene: one line at a time, read aloud, with a skip for pupils who have seen it. */
  function showScene(opts) {
    var modalRoot = document.getElementById('isl-modal-root');
    if (!modalRoot) { if (opts.onDone) opts.onDone(); return; }
    var steps = opts.steps || [];
    var i = 0;

    function finish() {
      root.IslandStory._scene = null;
      modalRoot.innerHTML = '';
      if (opts.onDone) opts.onDone();
    }

    function draw() {
      var s = steps[i];
      var last = i === steps.length - 1;
      var speaker = CHARS[s.who] || CHARS.pip;
      modalRoot.innerHTML =
        '<div class="isl-modal-backdrop" id="gm-scene-backdrop">' +
          '<div class="isl-card-modal gm-scene-card' + (opts.className ? ' ' + opts.className : '') + '">' +
            (opts.topHtml || '<div style="font-size:0.86rem;font-weight:800;color:#fde047;letter-spacing:0.04em;text-transform:uppercase;margin-bottom:4px">🏴‍☠️ Treasure Island · Story Log (' + (i + 1) + '/' + steps.length + ')</div>') +
            (s.art ? pic(s.art, '', 'gm-comic') : '') +
            '<div class="gm-scene-cast">' + (opts.castHtml || charPic(s.who, 'gm-scene-pic', s.pose)) + '</div>' +
            '<div class="gm-bubble" id="gm-scene-line"><b>' + esc(speaker.name) + ':</b> ' + esc(s.text) + '</div>' +
            '<div class="gm-scene-btns">' +
              '<button type="button" class="isl-btn" id="gm-scene-hear" aria-label="Hear it again">🔊</button>' +
              '<button type="button" class="isl-btn emerald" id="gm-scene-next">' + esc(last ? (opts.lastLabel || "Set Sail! ⛵") : 'Next ▶') + '</button>' +
              (opts.skippable && !last ? '<button type="button" class="isl-btn" id="gm-scene-skip">Skip ⏭</button>' : '') +
            '</div>' +
          '</div>' +
        '</div>';
      root.IslandAudio.speak(s.text, null, s.who);
      document.getElementById('gm-scene-hear').onclick = function () { root.IslandAudio.speak(s.text, null, s.who); };
      document.getElementById('gm-scene-next').onclick = function () {
        root.IslandAudio.playTap();
        i++;
        if (i >= steps.length) finish(); else draw();
      };
      var skip = document.getElementById('gm-scene-skip');
      if (skip) skip.onclick = function () { root.IslandAudio.playTap(); finish(); };
    }

    if (!steps.length) { finish(); return; }
    root.IslandStory._scene = opts;
    draw();
  }

  function playIntro(monsterHtml, onDone) {
    showScene({
      className: 'gm-intro',
      skippable: true,
      lastLabel: "Start Chapter 1! 🧭",
      topHtml: '<div style="font-size:0.95rem;font-weight:800;color:#fde047;margin-bottom:6px">🏴‍☠️ TREASURE ISLAND · PROLOGUE: ADMIRAL BENBOW HARBOUR</div>',
      castHtml:
        '<div class="gm-party" style="display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap">' +
          pic('o_hispaniola', '⛵', 'gm-scene-pic') +
          '<div class="gm-balloon-monster" style="transform:scale(0.92)">' + monsterHtml + '</div>' +
          charPic(1, 'gm-scene-pic', 'happy') +
          pic('c_benbow', '🐆', 'gm-scene-pic') +
          charPic('pip', 'gm-scene-pic', 'happy') +
        '</div>',
      steps: [
        { who: 'pip', text: "Pieces of eight! Welcome to Treasure Island! I am Parrot Flint, and this is young Jim Hawkins and his baby leopard Benbow!", art: 'o_map_scroll' },
        { who: 1, text: "At the Admiral Benbow Inn, we found Captain Billy Bones's old sea chest! Inside is the secret map to Captain Flint's Golden Treasure!", art: 'o_compass' },
        { who: 'benbow', text: "Roar! Our ship, the Hispaniola, is waiting at the harbour pier, and Long John Silver is cooking in the galley!" },
        { who: 1, text: "Chapter 1 starts right here in Benbow Harbour! Complete the 5 Map Clues with your Monster to open Billy Bones's Sea Chest and set sail!" }
      ],
      onDone: onDone
    });
  }

  function playEnding(monsterHtml, onDone) {
    root.IslandAudio.playFanfare();
    showScene({
      className: 'gm-ending',
      lastLabel: 'Hooray, Captain! 👑',
      topHtml: '<div style="font-size:1rem;font-weight:800;color:#fde047;margin-bottom:6px">👑 TREASURE ISLAND · GRAND FINALE: FLINT\'S GOLDEN VAULT</div>',
      castHtml:
        '<div class="gm-party">' +
          pic('o_treasure_gold', '👑', 'gm-party-pic') +
          [1, 2, 3, 4].map(function (k) { return charPic(k, 'gm-party-pic', 'happy'); }).join('') +
          pic('c_benbow_happy', '🐆', 'gm-party-pic') +
          '<div class="gm-party-monster">' + monsterHtml + '</div>' +
          pic('c_pip_cheer', '🦜', 'gm-party-pic', 'c_pip') +
        '</div>',
      steps: [
        { who: 'pip', text: "Pieces of eight! You did it! All four Sea Chests are open and the Treasure Map is complete!" },
        { who: 1, text: "Jim Hawkins, Benbow the Leopard, Dr. Livesey, and Captain Smollett salute your Monster!" },
        { who: 2, text: "Even Long John Silver tips his hat! You are now a Grand Captain of Treasure Island!" }
      ],
      onDone: onDone
    });
  }

  root.IslandStory = {
    CHARS: CHARS,
    PLOTS: PLOTS,
    ready: ready,
    pic: pic,
    charPic: charPic,
    plotOf: plotOf,
    missionSteps: missionSteps,
    thanks: thanks,
    thanksHtml: thanksHtml,
    pipLine: function () { return PIP_LINES[Math.floor(Math.random() * PIP_LINES.length)]; },
    playIntro: playIntro,
    playEnding: playEnding
  };

})(typeof window !== 'undefined' ? window : this);
