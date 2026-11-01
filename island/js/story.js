/* Practice Island 2.0 — the story: Captain Pip, 4 friends in trouble and the 4 magic shells.
   Pictures come from island/art when they exist; until then each character shows its emoji. */
(function (root) {
  'use strict';

  var CHARS = {
    pip: { name: 'Captain Pip', pic: 'c_pip', emoji: '🦜', poses: { happy: 'c_pip_happy' } },
    1: { name: 'Grandpa Bolt', pic: 'c_bolt', emoji: '🐹', poses: { happy: 'c_bolt_happy', worried: 'c_bolt_worried', idea: 'c_bolt_idea' } },
    2: { name: 'Lulu', pic: 'c_lulu', emoji: '🦀', poses: { happy: 'c_lulu_happy', worried: 'c_lulu_worried', idea: 'c_lulu_idea' } },
    3: { name: 'Mr. Nutty', pic: 'c_nutty', emoji: '🐿️', poses: { happy: 'c_nutty_happy', worried: 'c_nutty_worried', idea: 'c_nutty_idea' } },
    4: { name: 'Ember', pic: 'c_ember', emoji: '🐲', poses: { happy: 'c_ember_happy', worried: 'c_ember_worried', idea: 'c_ember_idea' } }
  };

  /* One plot per regular mission, in order: listen, match, read, build, say */
  var PLOTS = {
    1: [
      { icon: '🔧', title: 'The Broken Machine', intro: ['Oh no! The storm broke my machines!', 'Listen and find the right gear for me.'], thanks: 'It works! It makes toast... and socks!' },
      { icon: '🧰', title: 'Mixed-up Parts', intro: ['All my parts are mixed up!', 'Can you match them?'], thanks: 'Thank you! My robot has only one head again!' },
      { icon: '📜', title: 'The Lost Plan', intro: ['The wind took my plan!', 'Read it and choose the right word.'], thanks: 'I can read my plan now. It says: lunch!' },
      { icon: '🤖', title: 'The Funny Robot', intro: ['My robot talks in a funny way.', 'Put the words in order.'], thanks: 'Now it talks! It says hello to my hat.' },
      { icon: '📣', title: 'Wake Up, Machine!', intro: ['My big machine is asleep.', 'Say the words in a loud voice!'], thanks: 'It is awake! Look, the treasure chest is ready!' }
    ],
    2: [
      { icon: '🔥', title: 'Find the Matches', intro: ['Help! The light went out!', 'The ships cannot see. Listen and catch the right fish. It has my matches!'], thanks: 'My matches! The fish was keeping them dry.' },
      { icon: '💡', title: 'Fix the Lamp', intro: ['The lamp has lost its parts.', 'Can you match them?'], thanks: 'Good! I fixed it with my big claws. Snip snip!' },
      { icon: '📯', title: 'Call the Ships', intro: ['I must write to the ships.', 'Read and choose the right word.'], thanks: 'They can read it! One ship says: thank you, Crab!' },
      { icon: '⛵', title: 'Guide the Boat', intro: ['A little boat is lost.', 'Put the words in order, and it can find the way.'], thanks: 'The boat is here! The captain is a very small duck.' },
      { icon: '🌟', title: 'The Light Shines', intro: ['One more thing, and the light is back!', 'Say the words nice and loud!'], thanks: 'The light shines! Look, the treasure chest is ready!' }
    ],
    3: [
      { icon: '🏷️', title: 'Prices in the River', intro: ['Oh dear! My prices fell in the river!', 'Listen and hop to the right stone.'], thanks: 'You found them! They are wet, but they are mine.' },
      { icon: '🌰', title: 'Mixed-up Market', intro: ['The wind mixed up my market.', 'Can you match everything?'], thanks: 'Thank you! I only ate three nuts while you worked.' },
      { icon: '📖', title: 'The Shopping List', intro: ['A customer wrote a list. Some words are gone!', 'Read and choose the right word.'], thanks: 'Now I can read it. She wants ten hats for her cat!' },
      { icon: '🌉', title: 'Cross the River', intro: ['We must cross the river.', 'Hop on the words in the right order.'], thanks: 'You are across! And your feet are almost dry.' },
      { icon: '🛒', title: 'Open the Market', intro: ['The market can open today!', 'Say the words loud, so everyone can hear!'], thanks: 'They are all here! Look, the treasure chest is ready!' }
    ],
    4: [
      { icon: '🌋', title: 'The Big Hiccup', intro: ['Boom! I am scared of the mountain.', 'Pip says it only has hiccups. Listen and hit the right bubble!'], thanks: 'A little water helps! The mountain says: hic... sorry.' },
      { icon: '💧', title: 'Water Rockets', intro: ['We need more water rockets.', 'Can you match these for me?'], thanks: 'Yes! Now I have rockets. I am not so scared.' },
      { icon: '🍵', title: 'A Drink for the Mountain', intro: ['Who gives a mountain a drink?', 'We do! Read and choose the right word.'], thanks: 'Gulp! That was a very big drink.' },
      { icon: '🐉', title: 'Brave Little Dragon', intro: ['I want to be brave like you.', 'Put the words in order for me.'], thanks: 'I said it! I am brave! Well... a little brave.' },
      { icon: '😊', title: 'A Happy Mountain', intro: ['The mountain is almost calm.', 'Say the words in a kind voice.'], thanks: 'No more hiccups! Look, the treasure chest is ready!' }
    ]
  };

  var PIP_LINES = [
    "Let's find the shells!",
    'Your monster looks great today!',
    'I can fly. I can also eat ten crackers!',
    'Tap a pin. My friends need you!',
    'Squawk! That means hello.',
    'Who has the best monster? You do!'
  ];

  /* Story pictures and faces for the talking scenes before each mission (mission number: one entry per line) */
  var STORY_ART = {
    1: {
      1: [{ art: 's_z1_storm', pose: 'worried' }, { art: 's_z1_broken', pose: 'idea' }],
      2: [{ pose: 'worried' }, { pose: 'idea' }],
      3: [{ pose: 'worried' }, { pose: 'idea' }],
      4: [{ pose: 'idea' }, { pose: 'idea' }],
      5: [{ art: 's_z1_broken', pose: 'worried' }, { pose: 'idea' }]
    },
    2: {
      1: [{ art: 's_z2_dark', pose: 'worried' }, { art: 's_z2_fish', pose: 'idea' }],
      2: [{ pose: 'worried' }, { pose: 'idea' }],
      3: [{ pose: 'worried' }, { pose: 'idea' }],
      4: [{ pose: 'idea' }, { pose: 'idea' }],
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
      1: [{ art: 's_z4_hiccup', pose: 'worried' }, { pose: 'idea' }],
      2: [{ art: 's_z4_rockets', pose: 'worried' }, { pose: 'idea' }],
      3: [{ pose: 'worried' }, { pose: 'idea' }],
      4: [{ pose: 'idea' }, { pose: 'idea' }],
      5: [{ art: 's_z4_hiccup', pose: 'worried' }, { pose: 'idea' }]
    }
  };

  var ART = {};
  var ART_DIR = {};
  function loadArt(dir) {
    return fetch('art/' + dir + 'manifest.json?v=3').then(function (r) { return r.json(); }).then(function (list) {
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
    if (mission.isDaily) return [{ who: 'pip', text: 'A gift for you today! Five quick questions. Ready?' }];
    var p = parseId(mission.id);
    if (!p) return [];
    if (doc && doc.stars && doc.stars[mission.id]) return [];
    if (p.isStar) return [{ who: p.zone, text: 'A star mission! This one is extra shiny.' }];
    var plot = plotOf(mission.id);
    var art = (STORY_ART[p.zone] || {})[p.num] || [];
    return plot ? plot.intro.map(function (t, i) { var a = art[i] || {}; return { who: p.zone, text: t, art: a.art, pose: a.pose }; }) : [];
  }

  function thanks(mission) {
    if (mission.isDaily) return { who: 'pip', text: 'Great work! See you tomorrow!' };
    var p = parseId(mission.id);
    if (!p) return null;
    if (p.isStar) return { who: p.zone, text: 'Wow! You are a real star!' };
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
      modalRoot.innerHTML =
        '<div class="isl-modal-backdrop" id="gm-scene-backdrop">' +
          '<div class="isl-card-modal gm-scene-card' + (opts.className ? ' ' + opts.className : '') + '">' +
            (opts.topHtml || '') +
            (s.art ? pic(s.art, '', 'gm-comic') : '') +
            '<div class="gm-scene-cast">' + (opts.castHtml || charPic(s.who, 'gm-scene-pic', s.pose)) + '</div>' +
            '<div class="gm-bubble" id="gm-scene-line"><b>' + esc((CHARS[s.who] || CHARS.pip).name) + ':</b> ' + esc(s.text) + '</div>' +
            '<div class="gm-scene-btns">' +
              '<button type="button" class="isl-btn" id="gm-scene-hear" aria-label="Hear it again">🔊</button>' +
              '<button type="button" class="isl-btn emerald" id="gm-scene-next">' + esc(last ? (opts.lastLabel || "Let's go! 🚀") : 'Next ▶') + '</button>' +
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
      lastLabel: "Let's go! 🚀",
      castHtml:
        '<div class="gm-balloon">' + pic('o_balloon', '🎈', 'gm-balloon-pic') + '<div class="gm-balloon-monster">' + monsterHtml + '</div></div>' +
        charPic('pip', 'gm-scene-pic'),
      steps: [
        { who: 'pip', text: 'Hello! I am Captain Pip! Welcome to my island!' },
        { who: 'pip', text: 'A big storm blew away the 4 magic shells. Now the island is grey and sleepy.' },
        { who: 'pip', text: 'My 4 friends need your English. Help them, and we can find the shells!' }
      ],
      onDone: onDone
    });
  }

  function playEnding(monsterHtml, onDone) {
    root.IslandAudio.playFanfare();
    showScene({
      className: 'gm-ending',
      lastLabel: 'Hooray! 🎉',
      castHtml:
        '<div class="gm-party">' +
          [1, 2, 3, 4].map(function (k) { return charPic(k, 'gm-party-pic'); }).join('') +
          '<div class="gm-party-monster">' + monsterHtml + '</div>' +
          pic('c_pip_cheer', '🦜', 'gm-party-pic', 'c_pip') +
        '</div>',
      steps: [
        { who: 'pip', text: 'You did it! All 4 magic shells are back!' },
        { who: 'pip', text: 'Look at the island! It is bright and happy again. Party time!' },
        { who: 'pip', text: 'You are now an Island Hero!' }
      ],
      onDone: onDone
    });
  }

  root.IslandStory = {
    CHARS: CHARS,
    ready: ready,
    pic: pic,
    charPic: charPic,
    parseId: parseId,
    plotOf: plotOf,
    missionSteps: missionSteps,
    thanksHtml: thanksHtml,
    thanks: thanks,
    showScene: showScene,
    playIntro: playIntro,
    playEnding: playEnding,
    pipLine: function () { return PIP_LINES[Math.floor(Math.random() * PIP_LINES.length)]; }
  };
})(typeof window !== 'undefined' ? window : this);
