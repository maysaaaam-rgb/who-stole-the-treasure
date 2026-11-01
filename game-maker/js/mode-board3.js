/* ============================================================================
   Game Maker: STAR LOOP BOARD — Speaking Monopoly & Trade Edition
   (js/mode-board3.js, id: 'boardgame')
   ----------------------------------------------------------------------------
   24-Square Interactive Monopoly-Style Classroom Board Game:
   - Dynamic Lesson Properties: Populates the 16 property squares directly from
     the active lesson pack (`ctx.nextItem()`) with pictures, vocabulary titles,
     and scaffolded English speaking prompts!
   - 8 Color Districts (2 properties per color set):
     * Claiming a square builds a Level 1 Star (⭐).
     * Owning both squares of a Color District triggers a COLOR MONOPOLY and
       automatically upgrades both squares to Cozy Houses (🏠🏠, 2x Rent!).
     * Landing on your own property or upgrading builds a Golden Castle (🏰, 3x!).
   - Live Smartboard "Deal Maker" (🤝 Monopoly Trading):
     * Teams can propose a trade on their turn or on Trading squares.
     * Displays a 2-team English Negotiation Teleprompter ("Can we trade our X
       for your Y?" -> "Yes, it's a deal!" / "No, thank you!") with 🔊 Listen.
   - 4 Corners & 4 Mini-Event Squares:
     * 🏁 START (+25 Lap Bonus)
     * 🎡 Lucky Spin Wheel (interactive spinning prize wheel!)
     * 🎤 Super Stage Karaoke (whole-team choral speaking challenge!)
     * 🚂 Express Star Train (tap any square on the board to ride there!)
     * 🔨 Live 10-Second Class Auction (all teams bid in English!)
     * ❓ Mystery Chance & Acting Cards
   - Smooth Floating Full-Body Monster Tokens that physically hop tile-to-tile
     along the 24-square perimeter with parabolic arcs and star dust puffs!
   ============================================================================ */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {};
  GM.modes = GM.modes || {};
  var U = function () { return GM.u; };
  var A = function () { return GM.audio; };
  var J = function () { return GM.juice; };

  var N = 24;

  /* 8 Distinct Monopoly Color Districts (2 properties per district = 16 properties) */
  var DISTRICTS = [
    { id: 'sky',     name: 'Sky District',      col: '#0284c7', light: '#e0f2fe' },
    { id: 'amber',   name: 'Amber District',    col: '#d97706', light: '#fef3c7' },
    { id: 'emerald', name: 'Emerald District',  col: '#059669', light: '#d1fae5' },
    { id: 'violet',  name: 'Royal District',    col: '#7c3aed', light: '#ede9fe' },
    { id: 'coral',   name: 'Coral District',    col: '#e11d48', light: '#ffe4e6' },
    { id: 'lagoon',  name: 'Lagoon District',   col: '#0891b2', light: '#cffafe' },
    { id: 'sunset',  name: 'Sunset District',   col: '#ea580c', light: '#ffedd5' },
    { id: 'indigo',  name: 'Starlight District',col: '#4f46e5', light: '#e0e7ff' }
  ];

  var THEMES = {
    classic: {
      words: [
        'Star Meadow', 'Cloud Bridge', 'Sunny Bell', 'Rainbow Gate',
        'Golden Key', 'Magic Book', 'Crystal Pond', 'Rocket Hill',
        'Music Box', 'Crown Tower', 'Diamond Cave', 'Candy Lane',
        'Feather Nest', 'Moon Harbor', 'Emerald Tree', 'Victory Arch'
      ],
      icons: [
        '⭐', '🌈', '🔔', '⛩️',
        '🗝️', '📖', '💎', '🚀',
        '🎵', '👑', '🔮', '🍭',
        '🪺', '🌙', '🌳', '🏆'
      ],
      frames: [
        'We would like to buy Star Meadow, please!',
        'Let us cross the Cloud Bridge together!',
        'Can you hear the Sunny Bell ringing?',
        'Open the Rainbow Gate for our team!',
        'We found the Golden Key to the castle!',
        'I love reading this Magic Book every day!',
        'Look at the clear water in Crystal Pond!',
        'Three, two, one, blast off from Rocket Hill!',
        'Listen to the happy song from the Music Box!',
        'Our monster is climbing up Crown Tower!',
        'There are bright gems inside Diamond Cave!',
        'Let us walk down sweet Candy Lane!',
        'The little bird sleeps in the Feather Nest!',
        'The boat is sailing into Moon Harbor!',
        'The tall Emerald Tree has green leaves!',
        'We marched through the Victory Arch!'
      ]
    },
    arctic: {
      words: [
        'Ice Cave', 'Snow Bridge', 'Glacier Peak', 'Polar Bear',
        'Igloo Camp', 'Husky Sled', 'Frozen Lake', 'Snowy Owl',
        'Arctic Fox', 'Seal Rock', 'Crystal Ice', 'Northern Star',
        'Warm Mittens', 'Pine Forest', 'Whale Bay', 'Aurora Sky'
      ],
      icons: [
        '🧊', '❄️', '🏔️', '🐻‍❄️',
        '⛺', '🛷', '⛸️', '🦉',
        '🦊', '🦭', '💎', '🌟',
        '🧤', '🌲', '🐋', '🌌'
      ],
      frames: [
        'The polar bear is sleeping in the Ice Cave!',
        'Walk carefully across the Snow Bridge!',
        'We climbed to the top of Glacier Peak!',
        'The big white Polar Bear can swim fast!',
        'Our team is warm inside the Igloo Camp!',
        'The Husky Sled rides over the deep snow!',
        'We can skate on the shiny Frozen Lake!',
        'The Snowy Owl flies quietly at night!',
        'The clever Arctic Fox has a fluffy tail!',
        'Three happy seals are resting on Seal Rock!',
        'The Crystal Ice sparkles in the sun!',
        'Follow the bright Northern Star home!',
        'Put on your Warm Mittens before going out!',
        'Tall green trees grow in the Pine Forest!',
        'A giant blue whale jumped in Whale Bay!',
        'Look at the green lights in the Aurora Sky!'
      ]
    },
    market: {
      words: [
        'Bakery Shop', 'Toy Store', 'Book Corner', 'Fruit Stand',
        'Flower Cart', 'Music Shop', 'Shoe Boutique', 'Pet Palace',
        'Candy Kiosk', 'Clock Tower', 'Art Studio', 'Pizza Cafe',
        'Juice Bar', 'Hat Emporium', 'Gem Jeweler', 'Grand Bank'
      ],
      icons: [
        '🥐', '🧸', '📚', '🍎',
        '💐', '🎸', '👟', '🐶',
        '🍬', '🕰️', '🎨', '🍕',
        '🧃', '🎩', '💍', '🏦'
      ],
      frames: [
        'Can I buy warm bread at the Bakery Shop?',
        'How much is the teddy bear in the Toy Store?',
        'I want to choose a story at Book Corner!',
        'These red apples at the Fruit Stand are fresh!',
        'We bought yellow roses from the Flower Cart!',
        'She plays the guitar in the Music Shop!',
        'Try on these fast runners at the Shoe Boutique!',
        'The friendly puppy waves from Pet Palace!',
        'May we share a treat from the Candy Kiosk?',
        'Meet our team under the big Clock Tower!',
        'We painted a rainbow picture in the Art Studio!',
        'Let us order warm cheese slices at Pizza Cafe!',
        'One cold orange drink from the Juice Bar, please!',
        'This tall wizard hat is from the Hat Emporium!',
        'The diamond ring shines at the Gem Jeweler!',
        'We save our golden coins inside the Grand Bank!'
      ]
    }
  };

  var CHANCE_CARDS = [
    {
      e: '🤖',
      t: 'Robot Voice Challenge!',
      d: 'Say the sentence in your funniest ROBOT voice to win +25 bonus points!',
      act: '🤖 Speak like a Robot!',
      pts: 25,
      hop: 0
    },
    {
      e: '🚀',
      t: 'Rocket Boost!',
      d: 'Say "Three, two, one, BLAST OFF!" together and hop 3 extra squares forward (+20 pts)!',
      act: '🚀 Chant together!',
      pts: 20,
      hop: 3
    },
    {
      e: '🦁',
      t: 'Whisper & Roar!',
      d: 'Whisper the sentence softly, then say it LOUD and proud for +25 points!',
      act: '🤫 Whisper -> 🦁 Loud!',
      pts: 25,
      hop: 0
    },
    {
      e: '🎁',
      t: 'Friendly Neighborhood!',
      d: 'Say "Have a wonderful day, everyone!" — you get +25 pts and every other team gets +10 pts!',
      act: '👋 Wave to the class!',
      pts: 25,
      allBonus: 10,
      hop: 0
    },
    {
      e: '🏠',
      t: 'Master Builder!',
      d: 'Say the sentence aloud to get +20 points AND upgrade one of your properties for free!',
      act: '🔨 Build a House!',
      pts: 20,
      freeUpgrade: true,
      hop: 0
    }
  ];

  var WHEEL_SLICES = [
    { label: '🌟 +30 PTS',      col: '#f59e0b', pts: 30, kind: 'pts',     desc: 'Jackpot Star Bonus! +30 points!' },
    { label: '🏠 FREE UPGRADE', col: '#10b981', pts: 20, kind: 'upgrade', desc: '+20 points AND a free property upgrade!' },
    { label: '🚀 HOP +3',       col: '#38bdf8', pts: 15, kind: 'hop3',    desc: '+15 points AND hop 3 extra squares forward!' },
    { label: '🎉 CLASS +15',    col: '#a855f7', pts: 25, kind: 'all',     desc: '+25 points for you and +15 for every team!' },
    { label: '👑 CLAIM STAR',   col: '#ec4899', pts: 20, kind: 'claim',   desc: '+20 points AND claim a random unowned property!' },
    { label: '💎 +35 GEMS',     col: '#06b6d4', pts: 35, kind: 'pts',     desc: 'Diamond Treasure Chest! +35 points!' }
  ];

  /* 24-square perimeter coordinates on an 8 columns x 6 rows CSS grid:
     Top row (col 1..8, row 1): indices 0..7
     Right col (col 8, row 2..5): indices 8..11
     Bottom row (col 8..1, row 6): indices 12..19
     Left col (col 1, row 5..2): indices 20..23 */
  function gridPos(i) {
    if (i <= 7) return { c: i + 1, r: 1 };
    if (i <= 11) return { c: 8, r: i - 6 };
    if (i <= 19) return { c: 8 - (i - 12), r: 6 };
    return { c: 1, r: 6 - (i - 19) };
  }

  /* Clean helper to extract a short title and full speaking sentence from a lesson item */
  function extractLessonProperty(item, fallbackWord, fallbackIcon, fallbackFrame) {
    if (!item) {
      return {
        title: fallbackWord,
        icon: fallbackIcon,
        pic: fallbackIcon,
        sentence: fallbackFrame,
        qPrompt: 'Say a complete sentence with "' + fallbackWord + '"!',
        rawItem: null
      };
    }

    /* Short property title: use content vocabulary words when descriptive, or the Monopoly landmark name when the answer is a grammar/function word */
    var rawA = String(item.a || '').trim();
    var isFunctionWord = /^(yes|no|true|false|are|is|am|was|were|be|been|do|does|did|have|has|had|can|could|will|would|shall|should|may|might|must|but|so|and|or|because|if|when|where|who|what|why|how|which|whose|in|on|at|to|from|by|with|for|of|about|into|onto|up|down|out|off|over|under|again|once|twice|one|two|three|four|five|six|seven|eight|nine|ten|gave|went|saw|took|made|came|got|said|told|knew|thought|found|left|felt|put|kept|let|began|seemed|helped|talked|turned|started|showed|heard|played|ran|moved|liked|lived|believed|held|brought|happened|wrote|provided|sat|stood|lost|paid|met|included|continued|set|learned|changed|led|understood|watched|followed|stopped|created|spoke|read|allowed|added|spent|grew|opened|walked|won|offered|remembered|loved|considered|appeared|bought|waited|served|died|sent|expected|built|stayed|fell|cut|reached|killed|remained|suggested|raised|passed|sold|required|reported|decided|pulled)$/i.test(rawA);
    var title = fallbackWord;
    if (rawA && rawA.length >= 4 && rawA.length <= 14 && rawA.indexOf(' ') < 0 && !/[.?!,]/.test(rawA) && !isFunctionWord && !/^\d+$/.test(rawA)) {
      var capA = rawA.charAt(0).toUpperCase() + rawA.slice(1);
      if (fallbackWord.indexOf(' ') > 0) {
        var suffix = fallbackWord.split(' ').pop();
        title = capA + ' ' + suffix;
      } else {
        title = capA;
      }
    }

    /* Speaking sentence */
    var sentence = '';
    if (item.speak) {
      sentence = String(item.speak).trim();
    } else if (item.frame) {
      sentence = String(item.frame).replace(/^🗣️\s*/, '').trim();
      if (item.tpl && Array.isArray(item.words) && item.words.length) {
        var w0 = String(item.words[0]).replace(/^[^\wA-Za-z0-9']+\s*/, '').trim();
        sentence = item.tpl.replace('{w}', w0);
      }
    } else if (item.q && rawA && /_{2,}/.test(item.q)) {
      sentence = String(item.q).replace(/_{2,}/g, rawA);
    } else if (item.q && rawA) {
      sentence = String(item.q).trim() + ' ' + rawA + '.';
    } else {
      sentence = fallbackFrame;
    }

    var picVal = item.pic || fallbackIcon;
    return {
      title: title,
      icon: fallbackIcon,
      pic: picVal,
      sentence: sentence,
      qPrompt: item.q ? String(item.q).replace(/_{2,}/g, '___') : ('Speak about ' + title + '!'),
      rawItem: item
    };
  }

  GM.modes.boardgame = {
    id: 'boardgame',
    name: 'Star Loop Board',
    sub: 'Speaking Monopoly & Trade',
    e: '🎲',
    desc: 'Roll the 3D dice, hop your monster around the 24-square Monopoly island, speak English to claim & upgrade properties, complete Color Sets, and trade with rival teams!',
    fields: [
      {
        key: 'laps',
        label: 'Laps to finish',
        opts: [
          [1, '1 lap', 'Quick (10–12m)'],
          [2, '2 laps', 'Standard (15–20m)'],
          [3, '3 laps', 'Championship']
        ],
        def: 2
      },
      {
        key: 'world',
        label: 'Board world',
        opts: [
          ['classic', '🏝️ Star Island'],
          ['arctic', '🐻‍❄️ Arctic Expedition'],
          ['market', '🪙 Golden Market']
        ],
        def: 'classic'
      },
      {
        key: 'rentMode',
        label: 'Rival Square Rules',
        opts: [
          ['friendly', '🤝 Friendly Bonus', 'Visitor & Owner both win points!'],
          ['steal', '🎩 Monopoly Rent Steal', 'Owner collects rent from visitor!']
        ],
        def: 'friendly'
      }
    ],

    start: function (ctx) {
      var st = GM.state;
      var T = st.teams;
      var nt = T.length;
      var targetLaps = +ctx.cfg.laps || 2;
      var worldKey = ctx.cfg.world || 'classic';
      var rentMode = ctx.cfg.rentMode || 'friendly';
      var WDATA = THEMES[worldKey] || THEMES.classic;

      var rootEl = ctx.root;
      rootEl.innerHTML = '';
      var alive = true;
      var busy = false;
      var turn = 0;
      var trainSelectMode = false;

      ctx.onEnd(function () {
        alive = false;
      });

      var pos = T.map(function () { return 0; });
      var laps = T.map(function () { return 0; });

      /* Property Ownership & Building Level State:
         props[sqIdx] = { owner: teamIdx | null, level: 0..3 }
         level 1 = ⭐ Star (+15 base rent)
         level 2 = 🏠🏠 Cozy Houses (+30 rent, automatic on Color Monopoly or upgrade!)
         level 3 = 🏰 Golden Castle (+45 rent!) */
      var props = {};

      /* Build the 24-Square Board Layout:
         - 4 Corners (0, 7, 12, 19):
           0:  🏁 START / GO (+25 pts)
           7:  🎡 Lucky Spin Wheel
           12: 🎤 Super Stage Karaoke (+30 pts)
           19: 🚂 Express Star Train (Ride to any square!)
         - 4 Event Squares (4, 10, 16, 22):
           4:  🔨 Live Class Auction
           10: ❓ Mystery Chance
           16: 🔨 Live Class Auction
           22: ❓ Mystery Chance
         - 16 Property Squares (8 Color Districts x 2 squares each) */
      var CORNER_DEFS = {
        0:  { cType: 'start', t: 'START / GO!',   e: '🏁', art: 'i_start', pts: 25, desc: 'Pass or land on START for +25 bonus points!' },
        7:  { cType: 'wheel', t: 'Lucky Wheel',   e: '🎡', art: 'o_target', pts: 25, desc: 'Spin the Lucky Prize Wheel for huge rewards!' },
        12: { cType: 'stage', t: 'Super Stage',   e: '🎤', art: 'i_bonus', pts: 30, desc: 'Whole-team Super Stage Speaking Chant for +30 pts!' },
        19: { cType: 'train', t: 'Star Train',    e: '🚂', art: 'pu_rocket', pts: 20, desc: 'All aboard! Tap ANY square on the board to ride there!' }
      };
      var AUCTION_SQS = [4, 16];
      var CHANCE_SQS = [10, 22];

      var squares = [];
      var propCounter = 0;

      for (var i = 0; i < N; i++) {
        if (CORNER_DEFS[i]) {
          var cd = CORNER_DEFS[i];
          squares.push({
            i: i,
            type: 'corner',
            cType: cd.cType,
            title: cd.t,
            e: cd.e,
            art: cd.art,
            pts: cd.pts,
            desc: cd.desc
          });
        } else if (AUCTION_SQS.indexOf(i) >= 0) {
          squares.push({
            i: i,
            type: 'auction',
            title: 'Live Auction',
            e: '🔨',
            art: 'pu_gold',
            pts: 25
          });
        } else if (CHANCE_SQS.indexOf(i) >= 0) {
          squares.push({
            i: i,
            type: 'chance',
            title: 'Chance Card',
            e: '❓',
            art: 'i_chance',
            pts: 25
          });
        } else {
          var distIdx = Math.floor(propCounter / 2) % DISTRICTS.length;
          var dist = DISTRICTS[distIdx];
          var rawLessonItem = ctx.nextItem ? ctx.nextItem() : null;
          var propData = extractLessonProperty(
            rawLessonItem,
            WDATA.words[propCounter % WDATA.words.length],
            WDATA.icons[propCounter % WDATA.icons.length],
            WDATA.frames[propCounter % WDATA.frames.length]
          );
          squares.push({
            i: i,
            type: 'star',
            propIdx: propCounter,
            districtId: dist.id,
            districtName: dist.name,
            band: dist.col,
            bandLight: dist.light,
            title: propData.title,
            e: propData.icon,
            pic: propData.pic,
            sentence: propData.sentence,
            qPrompt: propData.qPrompt,
            rawItem: propData.rawItem,
            price: 20,
            baseRent: 15
          });
          props[i] = { owner: null, level: 0 };
          propCounter++;
        }
      }

      /* Build Stage DOM */
      var info = U().h('div', { class: 'gm-info gm-b3-topbar' });
      var board = U().h('div', { class: 'gm-b3-board gm-b3-' + worldKey });
      var center = U().h('div', { class: 'gm-b3-center' });
      var tokenLayer = U().h('div', { class: 'gm-b3-token-layer' });

      var wrap = U().h('div', { class: 'gm-boardwrap gm-b3-wrap' }, [info, board]);
      rootEl.appendChild(wrap);

      var sqEls = [];
      squares.forEach(function (sq) {
        var gp = gridPos(sq.i);
        var cls = 'gm-b3-sq gm-b3-' + sq.type + (sq.cType ? ' gm-b3-corner-' + sq.cType : '');
        var el = U().h('div', { class: cls, id: 'gm-b3-sq-' + sq.i });
        el.style.gridColumn = String(gp.c);
        el.style.gridRow = String(gp.r);

        if (sq.band) {
          el.style.setProperty('--band', sq.band);
          el.style.setProperty('--band-light', sq.bandLight);
          var bBar = U().h('div', { class: 'gm-b3-band' }, [
            U().h('span', { class: 'gm-b3-buildings', id: 'gm-b3-bld-' + sq.i })
          ]);
          bBar.style.background = sq.band;
          el.appendChild(bBar);
        } else {
          var cBar = U().h('div', { class: 'gm-b3-band gm-b3-band-special' });
          el.appendChild(cBar);
        }

        var numBadge = U().h('span', { class: 'gm-b3-num', text: String(sq.i + 1) });

        var ic = U().h('div', { class: 'gm-b3-ic' });
        if (sq.art) {
          ic.appendChild(U().art(sq.art, sq.e, 'gm-b3-art'));
        } else if (sq.pic && typeof U().pic === 'function') {
          ic.innerHTML = U().pic(sq.pic);
        } else {
          ic.appendChild(U().h('span', { text: sq.e }));
        }

        var nm = U().h('div', { class: 'gm-b3-nm', text: sq.title });

        var footBadge = U().h('div', {
          class: 'gm-b3-footbadge',
          id: 'gm-b3-foot-' + sq.i,
          text: sq.type === 'star' ? '⭐ +20' : (sq.pts ? '+' + sq.pts + ' pts' : 'EVENT')
        });

        el.appendChild(numBadge);
        el.appendChild(ic);
        el.appendChild(nm);
        el.appendChild(footBadge);

        /* Clicking a tile during Express Train mode or clicking to inspect/speak */
        el.addEventListener('click', function () {
          if (!alive) return;
          if (trainSelectMode && sq.i !== pos[turn]) {
            trainSelectMode = false;
            clearTrainHighlights();
            rideTrainTo(sq.i);
            return;
          }
          if (!busy && sq.sentence) {
            A().play('tap');
            try { A().speak(sq.sentence); } catch (e) { /* ignore */ }
            U().wobble(el);
          }
        });

        board.appendChild(el);
        sqEls.push(el);
      });

      board.appendChild(center);
      board.appendChild(tokenLayer);

      /* Create Floating Full-Body Monster Token Elements for Smooth Tile-to-Tile Hopping */
      var floatingToks = T.map(function (t, ti) {
        var tok = U().h('div', {
          class: 'gm-b3-float-tok' + (ti === 0 ? ' cur' : ''),
          id: 'gm-b3-ftok-' + ti
        }, [
          U().h('div', { class: 'gm-b3-ftok-shadow' }),
          U().h('div', { class: 'gm-b3-ftok-body' }, [U().monFull(t.mon, 68)]),
          U().h('span', { class: 'gm-b3-ftok-tag', text: t.name })
        ]);
        tok.style.setProperty('--c', t.color);
        tokenLayer.appendChild(tok);
        return tok;
      });

      /* Compute Pixel Center of Square `sqIdx` relative to `board` */
      function getSquareCoords(sqIdx, teamIdx) {
        var sqEl = sqEls[sqIdx];
        if (!sqEl || !board) return { x: 60, y: 60 };
        var bRect = board.getBoundingClientRect();
        var sRect = sqEl.getBoundingClientRect();
        if (!bRect.width || !sRect.width) return { x: 60, y: 60 };

        /* Position tokens neatly on the right/upper-right of the tile so the property icon & title stay 100% readable */
        var sameSqTeams = [];
        for (var i = 0; i < nt; i++) {
          if (pos[i] === sqIdx) sameSqTeams.push(i);
        }
        var slotIdx = Math.max(0, sameSqTeams.indexOf(teamIdx));
        var count = sameSqTeams.length;
        var baseX = count > 1 ? sRect.width * 0.50 : sRect.width * 0.76;
        var offsetX = count > 1 ? ((slotIdx - (count - 1) / 2) * 38) : 0;
        var offsetY = count > 1 ? ((slotIdx % 2 === 0 ? -4 : 4)) : 0;

        return {
          x: (sRect.left - bRect.left) + baseX + offsetX,
          y: (sRect.top - bRect.top) + sRect.height * 0.54 + offsetY
        };
      }

      function positionAllTokens(jumpingTeamIdx) {
        T.forEach(function (t, ti) {
          var ft = floatingToks[ti];
          if (!ft) return;
          ft.classList.toggle('cur', ti === turn);
          var pt = getSquareCoords(pos[ti] || 0, ti);
          ft.style.left = Math.round(pt.x) + 'px';
          ft.style.top = Math.round(pt.y) + 'px';
          if (ti === jumpingTeamIdx) {
            ft.classList.remove('hop-arc');
            void ft.offsetWidth;
            ft.classList.add('hop-arc');
          }
        });
      }

      root.addEventListener('resize', function () {
        if (alive) positionAllTokens(-1);
      });

      /* Check and Upgrade Color District Monopolies!
         Returns array of square indices that were newly upgraded to Level 2 Monopoly Houses */
      function checkColorMonopolies(teamIdx) {
        var newlyCompleted = [];
        DISTRICTS.forEach(function (dist) {
          var distSquares = squares.filter(function (s) { return s.type === 'star' && s.districtId === dist.id; });
          if (distSquares.length < 2) return;
          var allOwned = distSquares.every(function (s) { return props[s.i] && props[s.i].owner === teamIdx; });
          if (allOwned) {
            distSquares.forEach(function (s) {
              if (props[s.i].level < 2) {
                props[s.i].level = 2;
                newlyCompleted.push(s.i);
              }
            });
          }
        });
        return newlyCompleted;
      }

      function getSquareRent(sqIdx) {
        var p = props[sqIdx];
        if (!p || p.owner == null) return 15;
        if (p.level >= 3) return 45;
        if (p.level === 2) return 30;
        return 15;
      }

      function getBuildingBadge(level) {
        if (level >= 3) return '🏰 CASTLE';
        if (level === 2) return '🏠🏠 HOUSES';
        if (level === 1) return '⭐ STAR';
        return '';
      }

      /* Sync Board Tile Borders, Building Badges & Rent Labels */
      function renderBoardState(hopTeamIdx) {
        sqEls.forEach(function (el, idx) {
          var sq = squares[idx];
          el.classList.toggle('active-sq', pos[turn] === idx);
          if (sq.type !== 'star') return;

          var p = props[idx];
          var bldEl = document.getElementById('gm-b3-bld-' + idx);
          var footEl = document.getElementById('gm-b3-foot-' + idx);

          if (p && p.owner != null && T[p.owner]) {
            var ownerTeam = T[p.owner];
            el.classList.add('is-owned');
            el.classList.toggle('is-monopoly', p.level >= 2);
            el.style.setProperty('--owner-c', ownerTeam.color);
            if (bldEl) {
              bldEl.textContent = p.level >= 3 ? '🏰' : (p.level === 2 ? '🏠🏠' : '⭐');
            }
            if (footEl) {
              var rentVal = getSquareRent(idx);
              footEl.textContent = ownerTeam.name + ' · +' + rentVal;
              footEl.style.background = ownerTeam.color;
              footEl.style.color = '#ffffff';
            }
          } else {
            el.classList.remove('is-owned', 'is-monopoly');
            el.style.removeProperty('--owner-c');
            if (bldEl) bldEl.textContent = '';
            if (footEl) {
              footEl.textContent = '⭐ Claim +20';
              footEl.style.background = '';
              footEl.style.color = '';
            }
          }
        });
        requestAnimationFrame(function () {
          positionAllTokens(hopTeamIdx);
        });
      }

      /* Render Top Bar & Team Property Portfolio Strip */
      function renderTopHud() {
        var t = T[turn];
        info.innerHTML = '';
        info.style.setProperty('--c', t.color);

        var leftCluster = U().h('div', { class: 'gm-b3-hud-left' }, [
          U().monFace(t.mon, 42),
          U().h('div', { class: 'gm-b3-hud-txt' }, [
            U().h('b', { text: t.name + '\u2019s Turn · Lap ' + (laps[turn] + 1) + ' of ' + targetLaps }),
            U().h('small', { text: 'Square ' + (pos[turn] + 1) + ': ' + squares[pos[turn]].title })
          ])
        ]);

        /* Mini Property Deed Counter per Team */
        var deedsRow = U().h('div', { class: 'gm-b3-deeds-strip' });
        T.forEach(function (tm, ti) {
          var ownedSqs = Object.keys(props).filter(function (k) { return props[k].owner === ti; });
          var monopolies = DISTRICTS.filter(function (d) {
            var ds = squares.filter(function (s) { return s.type === 'star' && s.districtId === d.id; });
            return ds.length >= 2 && ds.every(function (s) { return props[s.i] && props[s.i].owner === ti; });
          }).length;

          var dots = U().h('div', { class: 'gm-b3-deed-dots' });
          ownedSqs.forEach(function (k) {
            var sq = squares[+k];
            var dot = U().h('span', {
              class: 'gm-b3-deed-pip',
              title: sq.title,
              text: props[k].level >= 3 ? '🏰' : (props[k].level === 2 ? '🏠' : '⭐')
            });
            dot.style.background = sq.band || tm.color;
            dots.appendChild(dot);
          });
          if (!ownedSqs.length) {
            dots.appendChild(U().h('span', { class: 'gm-b3-deed-empty', text: '0 stars' }));
          }

          var pill = U().h('div', { class: 'gm-b3-deed-pill' + (ti === turn ? ' on' : '') }, [
            U().h('b', { text: tm.name + (monopolies > 0 ? ' 👑×' + monopolies : '') }),
            dots
          ]);
          pill.style.setProperty('--c', tm.color);
          deedsRow.appendChild(pill);
        });

        /* Live Rent Mode Toggle Button for Teacher Flexibility */
        var rentBtn = U().h('button', {
          type: 'button',
          class: 'gm-b3-mode-pill',
          text: rentMode === 'steal' ? '🎩 Rent: Steal' : '🤝 Rent: Friendly'
        });
        rentBtn.addEventListener('click', function () {
          A().play('tap');
          rentMode = rentMode === 'steal' ? 'friendly' : 'steal';
          renderTopHud();
        });

        info.appendChild(leftCluster);
        info.appendChild(deedsRow);
        info.appendChild(rentBtn);
      }

      /* ======================================================================
         CENTER COMMAND STAGE: ROLL, SPEAK, UPGRADE & LIVE MONOPOLY TRADE!
         ====================================================================== */
      function showCenterPrompt() {
        if (!alive) return;
        busy = false;
        trainSelectMode = false;
        clearTrainHighlights();

        var t = T[turn];
        var curSq = squares[pos[turn]];
        U().teamBar(T, turn);
        renderTopHud();
        renderBoardState(-1);

        center.innerHTML = '';

        /* Count properties for Trade & Upgrade buttons */
        var myProps = Object.keys(props).filter(function (k) { return props[k].owner === turn; }).map(Number);
        var rivalProps = Object.keys(props).filter(function (k) { return props[k].owner != null && props[k].owner !== turn; }).map(Number);

        var card = U().h('div', { class: 'gm-b3-stagecard gm-b3-cmd-card' }, [
          U().h('div', { class: 'gm-b3-who', style: '--c:' + t.color }, [
            U().monFull(t.mon, 96),
            U().h('div', { class: 'gm-b3-who-info' }, [
              U().h('span', { class: 'gm-b3-turn-tag', text: '🎲 ' + t.name.toUpperCase() + '\u2019S TURN' }),
              U().h('h3', { text: 'On Square #' + (pos[turn] + 1) + ': ' + curSq.title }),
              U().h('small', { text: 'Roll the dice to hop & speak — or propose a Monopoly Trade!' })
            ])
          ]),

          U().h('div', { class: 'gm-b3-dice-row' }, [
            U().h('div', { class: 'gm-b3-die', id: 'gm-b3-die' }, [U().art('o_dice', '🎲', 'gm-b3-die-art')])
          ]),

          U().h('div', { class: 'gm-b3-btn-row' }, [
            U().btn('🎲 Roll Dice & Hop!', 'huge green gm-b3-main-btn', function () {
              if (busy || !alive) return;
              busy = true;
              rollAndMove();
            }),
            U().btn('🤝 Propose Trade!', 'big amber', function () {
              if (busy || !alive) return;
              openTradeModal();
            }),
            U().btn('❓ Quiz + Roll (+10)', 'big cyan', function () {
              if (busy || !alive) return;
              busy = true;
              askQuizThenRoll();
            })
          ])
        ]);

        /* If the team owns properties, show a quick upgrade button if any property is < level 3 */
        if (myProps.length > 0 && myProps.some(function (idx) { return props[idx].level < 3; })) {
          var upRow = U().h('div', { class: 'gm-b3-sub-row' }, [
            U().btn('🏠 Speak to Upgrade a Property (' + myProps.length + ' owned)', 'sm ghost', function () {
              if (busy || !alive) return;
              openUpgradePicker(myProps);
            })
          ]);
          card.appendChild(upRow);
        } else if (rivalProps.length === 0 && myProps.length === 0) {
          card.appendChild(U().h('div', {
            class: 'gm-b3-tip-line',
            text: '💡 Tip: Claim properties around the board, then tap 🤝 Propose Trade to complete Color Sets!'
          }));
        }

        center.appendChild(card);
      }

      async function askQuizThenRoll() {
        var t = T[turn];
        var item = ctx.nextItem ? ctx.nextItem() : null;
        var res = await U().ask(item, t, { timer: +ctx.cfg.timer || 0, label: t.name + ' · Bonus Roll Quiz' });
        if (!alive) return;
        if (res && res.ok) {
          U().addScore(turn, 10);
          U().floatText('+10 Quiz Bonus!', center, 'good');
          await rollAndMove();
        } else {
          busy = false;
          showCenterPrompt();
        }
      }

      async function rollAndMove() {
        var dieEl = document.getElementById('gm-b3-die');
        var faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        var rollVal = U().rand(1, 6);
        A().play('flip');
        A().play('drum_roll_short');
        if (dieEl) {
          dieEl.classList.add('rolling');
          for (var k = 0; k < 8; k++) {
            dieEl.textContent = faces[U().rand(0, 5)];
            await U().sleep(70);
          }
          dieEl.classList.remove('rolling');
          dieEl.textContent = faces[rollVal - 1] + ' ' + rollVal;
        }
        A().play('pu_good');
        A().play('wood_knock');
        await U().sleep(340);
        await hopSteps(rollVal);
      }

      async function hopSteps(steps) {
        for (var s = 0; s < steps; s++) {
          if (!alive) return;
          pos[turn] = (pos[turn] + 1) % N;
          A().play('hunt_step');
          renderBoardState(turn);
          J().sparks(sqEls[pos[turn]], 8, [T[turn].color, '#fde047', '#ffffff'], 5);

          /* Check Passing or Landing on START (Square 0) */
          if (pos[turn] === 0) {
            laps[turn]++;
            A().play('pu_gold');
            A().play('coin_collect');
            U().confetti(22);
            U().floatText('🏁 Lap Bonus +25!', sqEls[0], 'good');
            U().addScore(turn, 25);
            renderTopHud();
            if (laps[turn] >= targetLaps) {
              await U().sleep(950);
              if (alive) {
                A().play('cheer_kids');
                ctx.end();
              }
              return;
            }
          }
          await U().sleep(260);
        }
        if (!alive) return;
        renderTopHud();
        await resolveLanding(squares[pos[turn]]);
      }

      /* ======================================================================
         RESOLVE LANDING ON ANY OF THE 24 SQUARES
         ====================================================================== */
      async function resolveLanding(sq) {
        if (!alive) return;
        var sqEl = sqEls[sq.i];
        J().shockwave(sqEl, sq.band || T[turn].color, 115, 420);

        if (sq.type === 'corner') {
          if (sq.cType === 'wheel') {
            await showSpinWheelEvent();
          } else if (sq.cType === 'train') {
            await showExpressTrainEvent();
            return; /* rideTrainTo handles advancing turn */
          } else if (sq.cType === 'stage') {
            await showSuperStageEvent(sq);
          } else {
            /* START / GO Corner */
            A().play('pu_star');
            U().addScore(turn, sq.pts);
            await showSimpleEventCard(sq.e, sq.title, sq.desc, '+' + sq.pts + ' Points!');
          }
        } else if (sq.type === 'auction') {
          await showLiveAuctionEvent();
        } else if (sq.type === 'chance') {
          await showChanceCardEvent();
        } else if (sq.type === 'star') {
          await showPropertySpeakingEvent(sq);
        }

        if (!alive) return;
        advanceTurn();
      }

      function advanceTurn() {
        if (!alive) return;
        turn = (turn + 1) % nt;
        showCenterPrompt();
      }

      /* ======================================================================
         1. PROPERTY SQUARE SPEAKING TELEPROMPTER (Claim, Upgrade, or Visit/Rent!)
         ====================================================================== */
      function showPropertySpeakingEvent(sq) {
        return new Promise(function (resolve) {
          var t = T[turn];
          var p = props[sq.i];
          var sqEl = sqEls[sq.i];
          var isUnowned = (p.owner == null);
          var isMine = (p.owner === turn);
          var ownerTeam = (!isUnowned && T[p.owner]) ? T[p.owner] : null;

          A().play('page_slide');
          center.innerHTML = '';

          var modeBadgeText = isUnowned
            ? ('🌟 UNOWNED · ' + sq.districtName.toUpperCase())
            : (isMine ? ('🏠 YOUR PROPERTY · UPGRADE!') : ('🎩 OWNED BY ' + ownerTeam.name.toUpperCase()));

          var monopolySentence = isUnowned
            ? ('"We want to claim ' + sq.title + '!"')
            : (isMine
              ? ('"Let\u2019s upgrade ' + sq.title + ' with more stars!"')
              : ('"Hello ' + ownerTeam.name + '! Thank you for welcoming us to ' + sq.title + '!"'));

          var lessonSentence = sq.sentence || ('We love visiting ' + sq.title + '!');

          var headerRow = U().h('div', { class: 'gm-b3-prop-head', style: '--band:' + (sq.band || t.color) }, [
            U().h('div', { class: 'gm-b3-prop-icon' }, [
              sq.pic && typeof U().pic === 'function' ? U().h('div', { html: U().pic(sq.pic) }) : U().h('span', { text: sq.e })
            ]),
            U().h('div', { class: 'gm-b3-prop-titles' }, [
              U().h('span', { class: 'gm-b3-prop-dist', text: modeBadgeText }),
              U().h('h3', { text: sq.title }),
              U().h('small', { text: sq.qPrompt || 'Speak the English sentence aloud with your team!' })
            ]),
            U().btn('🔊 Listen', 'sm amber', function () {
              A().speak(lessonSentence);
            })
          ]);

          /* Teleprompter Box with Both Lesson Sentence & Monopoly Sentence */
          var teleBox = U().h('div', { class: 'gm-b3-telebox' }, [
            U().h('div', { class: 'gm-b3-tele-label', text: '🗣️ SAY ALOUD WITH YOUR TEAM:' }),
            U().h('div', { class: 'gm-b3-tele-main', text: '“' + lessonSentence + '”' }),
            U().h('div', { class: 'gm-b3-tele-sub', text: '🎩 Monopoly Phrase: ' + monopolySentence })
          ]);

          var actRow = U().h('div', { class: 'gm-b3-btn-row' });

          function completePropertyAction(ptsEarned, spokenWell) {
            if (isUnowned) {
              p.owner = turn;
              p.level = 1;
              var totalPts = ptsEarned;
              var upgradedSqs = checkColorMonopolies(turn);
              if (upgradedSqs.length > 0) {
                totalPts += 35;
                A().play('fanfare');
                U().confetti(35);
                U().floatText('👑 COLOR MONOPOLY! +35!', sqEl, 'good');
              } else {
                A().play('pu_star');
                U().floatText('⭐ Claimed +' + ptsEarned + '!', sqEl, 'good');
              }
              J().sparks(sqEl, 18, [t.color, '#fde047', '#ffffff'], 7);
              U().addScore(turn, totalPts);
            } else if (isMine) {
              p.level = Math.min(3, p.level + 1);
              A().play('pu_gold');
              J().sparks(sqEl, 20, [t.color, '#fde047'], 8);
              U().floatText(getBuildingBadge(p.level) + ' +' + ptsEarned + '!', sqEl, 'good');
              U().addScore(turn, ptsEarned);
            } else if (ownerTeam) {
              var rentAmt = getSquareRent(sq.i);
              if (rentMode === 'steal') {
                /* Classic Monopoly Rent Steal: Speaking Loud & Clear cuts rent in half + gives speaker +10! */
                var stealAmt = spokenWell ? Math.ceil(rentAmt * 0.5) : rentAmt;
                U().setScore(turn, Math.max(0, t.score - stealAmt));
                U().addScore(p.owner, rentAmt + (spokenWell ? 5 : 10));
                if (spokenWell) {
                  U().addScore(turn, 10);
                  U().floatText('🗣️ VIP Discount! Owner +' + (rentAmt + 5), sqEl, 'good');
                } else {
                  U().floatText('🎩 Rent Paid: ' + rentAmt + ' pts!', sqEl, 'good');
                }
              } else {
                /* Friendly Landlord Mode: Visitor earns speaking points AND Owner gets Landlord Rent Bonus! */
                U().addScore(turn, ptsEarned);
                U().addScore(p.owner, rentAmt);
                U().floatText('+' + ptsEarned + ' Visitor / +' + rentAmt + ' Owner!', sqEl, 'good');
              }
              A().play('coin_collect');
            }
            renderBoardState(-1);
            renderTopHud();
            resolve();
          }

          var btnLoudLabel = isUnowned
            ? '🌟 Spoke Loud & Clear! (Claim ⭐ +25)'
            : (isMine
              ? '🏰 Spoke Loud & Clear! (Upgrade +30)'
              : (rentMode === 'steal' ? '🗣️ Spoke VIP Pass! (Half Rent +10)' : '🌟 Spoke Loud & Clear! (+20 / Owner +' + getSquareRent(sq.i) + ')'));

          var btnTryLabel = isUnowned
            ? '👍 Good Try! (Claim ⭐ +15)'
            : (isMine
              ? '👍 Good Try! (Upgrade +20)'
              : (rentMode === 'steal' ? '🎩 Pay Full Rent (' + getSquareRent(sq.i) + ' pts)' : '👍 Good Try! (+10 / Owner +' + getSquareRent(sq.i) + ')'));

          actRow.appendChild(U().btn(btnLoudLabel, 'huge green', function () {
            completePropertyAction(isMine ? 30 : 25, true);
          }));
          actRow.appendChild(U().btn(btnTryLabel, 'big amber', function () {
            completePropertyAction(isMine ? 20 : 15, false);
          }));

          if (sq.rawItem) {
            actRow.appendChild(U().btn('❓ Quiz Card', 'sm cyan', async function () {
              var qRes = await U().ask(sq.rawItem, t, { timer: +ctx.cfg.timer || 0, label: sq.title });
              if (!alive) return;
              completePropertyAction(qRes && qRes.ok ? 25 : 15, !!(qRes && qRes.ok));
            }));
          }

          var card = U().h('div', { class: 'gm-b3-stagecard gm-b3-prop-card' }, [
            headerRow,
            teleBox,
            actRow
          ]);
          center.appendChild(card);
        });
      }

      /* ======================================================================
         2. LIVE SMARTBOARD "DEAL MAKER" (🤝 MONOPOLY TRADING BETWEEN TEAMS!)
         ====================================================================== */
      function openTradeModal() {
        var t = T[turn];
        A().play('page_slide');
        center.innerHTML = '';

        var myProps = Object.keys(props).filter(function (k) { return props[k].owner === turn; }).map(Number);
        var rivalProps = Object.keys(props).filter(function (k) { return props[k].owner != null && props[k].owner !== turn; }).map(Number);

        /* Also allow claiming/trading with the Bank if no rival owns a property yet! */
        var bankProps = Object.keys(props).filter(function (k) { return props[k].owner == null; }).map(Number).slice(0, 4);
        var targetPool = rivalProps.length > 0 ? rivalProps : bankProps;

        var selectedMySq = myProps.length > 0 ? myProps[0] : -1; /* -1 means "15 Bonus Points Offer" */
        var selectedTheirSq = targetPool.length > 0 ? targetPool[0] : null;

        function renderDealStep1() {
          center.innerHTML = '';

          /* Left picker: What our team offers */
          var myList = U().h('div', { class: 'gm-b3-trade-list' });
          myProps.forEach(function (sqIdx) {
            var sq = squares[sqIdx];
            var b = U().h('button', {
              type: 'button',
              class: 'gm-b3-trade-chip' + (selectedMySq === sqIdx ? ' sel' : '')
            }, [
              U().h('span', { class: 'gm-b3-trade-dot', style: 'background:' + sq.band }),
              U().h('b', { text: sq.e + ' ' + sq.title })
            ]);
            b.addEventListener('click', function () {
              A().play('tap');
              selectedMySq = sqIdx;
              renderDealStep1();
            });
            myList.appendChild(b);
          });

          /* Always include a "🎁 +15 Points Gift" option so teams can trade even before owning 2+ properties */
          var ptsBtn = U().h('button', {
            type: 'button',
            class: 'gm-b3-trade-chip' + (selectedMySq === -1 ? ' sel' : '')
          }, [
            U().h('span', { class: 'gm-b3-trade-dot', style: 'background:#f59e0b' }),
            U().h('b', { text: '🪙 +15 Bonus Points Gift' })
          ]);
          ptsBtn.addEventListener('click', function () {
            A().play('tap');
            selectedMySq = -1;
            renderDealStep1();
          });
          myList.appendChild(ptsBtn);

          /* Right picker: Rival (or Bank) property we want */
          var theirList = U().h('div', { class: 'gm-b3-trade-list' });
          targetPool.forEach(function (sqIdx) {
            var sq = squares[sqIdx];
            var ownerIdx = props[sqIdx].owner;
            var ownerName = ownerIdx != null && T[ownerIdx] ? T[ownerIdx].name : 'Star Bank';
            /* Check if getting this square completes a Color Set for `turn`! */
            var completesSet = squares.some(function (other) {
              return other.type === 'star' && other.i !== sqIdx && other.districtId === sq.districtId && props[other.i] && props[other.i].owner === turn;
            });

            var b = U().h('button', {
              type: 'button',
              class: 'gm-b3-trade-chip' + (selectedTheirSq === sqIdx ? ' sel' : '') + (completesSet ? ' hot-set' : '')
            }, [
              U().h('span', { class: 'gm-b3-trade-dot', style: 'background:' + sq.band }),
              U().h('b', { text: sq.e + ' ' + sq.title + ' (' + ownerName + ')' + (completesSet ? ' 👑 SET!' : '') })
            ]);
            b.addEventListener('click', function () {
              A().play('tap');
              selectedTheirSq = sqIdx;
              renderDealStep1();
            });
            theirList.appendChild(b);
          });

          var myOfferTitle = selectedMySq >= 0 ? squares[selectedMySq].title : '15 Bonus Points';
          var theirTargetSq = selectedTheirSq != null ? squares[selectedTheirSq] : null;
          var partnerIdx = (theirTargetSq && props[theirTargetSq.i].owner != null) ? props[theirTargetSq.i].owner : ((turn + 1) % nt);
          var partnerTeam = T[partnerIdx] || T[0];

          var askScript = '“Hello ' + partnerTeam.name + '! Can we trade our ' + myOfferTitle + ' for your ' + (theirTargetSq ? theirTargetSq.title : 'property') + ', please?”';

          var card = U().h('div', { class: 'gm-b3-stagecard gm-b3-trade-card' }, [
            U().h('div', { class: 'gm-b3-trade-head' }, [
              U().h('h3', { text: '🤝 Monopoly Deal Maker — Speak & Trade!' }),
              U().btn('🔊 Listen to Trade Offer', 'sm amber', function () {
                A().speak(askScript.replace(/[“”]/g, ''));
              })
            ]),
            U().h('div', { class: 'gm-b3-trade-cols' }, [
              U().h('div', { class: 'gm-b3-trade-col' }, [
                U().h('small', { text: '1. ' + t.name + ' Offers:' }),
                myList
              ]),
              U().h('div', { class: 'gm-b3-trade-swap-ic', text: '⇄' }),
              U().h('div', { class: 'gm-b3-trade-col' }, [
                U().h('small', { text: '2. For Property:' }),
                theirList
              ])
            ]),
            U().h('div', { class: 'gm-b3-telebox gm-b3-trade-tele' }, [
              U().h('div', { class: 'gm-b3-tele-main', text: '🗣️ ' + t.name + ': ' + askScript }),
              U().h('div', { class: 'gm-b3-tele-sub', text: '🗣️ ' + partnerTeam.name + ' replies: “Yes, it\u2019s a deal!”  or  “No, thank you!”' })
            ]),
            U().h('div', { class: 'gm-b3-btn-row' }, [
              U().btn('🤝 "Yes, it\u2019s a deal!" (+15 Both!)', 'huge green', function () {
                if (!theirTargetSq) return;
                var prevOwner = props[theirTargetSq.i].owner;
                if (selectedMySq >= 0) {
                  props[selectedMySq].owner = prevOwner != null ? prevOwner : partnerIdx;
                } else {
                  U().addScore(partnerIdx, 15);
                }
                props[theirTargetSq.i].owner = turn;
                if (props[theirTargetSq.i].level < 1) props[theirTargetSq.i].level = 1;

                /* Both teams earn +15 Speaking Negotiation Bonus! */
                U().addScore(turn, 15);
                if (partnerIdx !== turn) U().addScore(partnerIdx, 15);

                /* Check if either team just completed a Color District Monopoly! */
                var m1 = checkColorMonopolies(turn);
                var m2 = checkColorMonopolies(partnerIdx);
                if (m1.length > 0) U().addScore(turn, 35);
                if (m2.length > 0) U().addScore(partnerIdx, 35);

                A().play('fanfare');
                U().confetti(32);
                U().floatText('🤝 DEAL COMPLETE! +15!', sqEls[theirTargetSq.i], 'good');
                renderBoardState(-1);
                renderTopHud();
                showCenterPrompt();
              }),
              U().btn('🙅 "No, thank you!" (+5 Polite Bonus)', 'big amber', function () {
                A().play('pu_good');
                U().addScore(turn, 5);
                if (partnerIdx !== turn) U().addScore(partnerIdx, 5);
                U().floatText('🗣️ Polite English +5!', center, 'good');
                showCenterPrompt();
              }),
              U().btn('↩ Back', 'sm ghost', function () {
                A().play('tap');
                showCenterPrompt();
              })
            ])
          ]);

          center.appendChild(card);
        }

        renderDealStep1();
      }

      /* Quick Upgrade Modal when player taps "Speak to Upgrade a Property" */
      function openUpgradePicker(myProps) {
        var t = T[turn];
        var targetIdx = myProps.find(function (idx) { return props[idx].level < 3; }) || myProps[0];
        var sq = squares[targetIdx];
        busy = true;
        showPropertySpeakingEvent(sq).then(function () {
          busy = false;
          showCenterPrompt();
        });
      }

      /* ======================================================================
         3. SPECIAL BOARD EVENTS: LUCKY WHEEL, LIVE AUCTION, TRAIN, STAGE & CHANCE
         ====================================================================== */
      function showSpinWheelEvent() {
        return new Promise(function (resolve) {
          center.innerHTML = '';
          A().play('page_slide');

          var wheelCv = U().h('canvas', { width: '220', height: '220', class: 'gm-b3-wheel-cv' });
          var wg = wheelCv.getContext('2d');
          var angle = 0;
          var spinning = false;

          function drawWheel(rot) {
            wg.clearRect(0, 0, 220, 220);
            var cx = 110, cy = 110, r = 98;
            var arc = (Math.PI * 2) / WHEEL_SLICES.length;
            WHEEL_SLICES.forEach(function (sl, idx) {
              var a0 = rot + idx * arc;
              var a1 = a0 + arc;
              wg.beginPath();
              wg.moveTo(cx, cy);
              wg.arc(cx, cy, r, a0, a1);
              wg.closePath();
              wg.fillStyle = sl.col;
              wg.fill();
              wg.lineWidth = 3;
              wg.strokeStyle = '#ffffff';
              wg.stroke();

              wg.save();
              wg.translate(cx, cy);
              wg.rotate(a0 + arc / 2);
              wg.fillStyle = '#ffffff';
              wg.font = '900 12px Fredoka, sans-serif';
              wg.textAlign = 'right';
              wg.textBaseline = 'middle';
              wg.fillText(sl.label, r - 10, 0);
              wg.restore();
            });
            /* Center hub & top pointer */
            wg.beginPath();
            wg.arc(cx, cy, 20, 0, Math.PI * 2);
            wg.fillStyle = '#1e293b';
            wg.fill();
            wg.lineWidth = 4;
            wg.strokeStyle = '#fde047';
            wg.stroke();

            wg.beginPath();
            wg.moveTo(cx - 12, 4);
            wg.lineTo(cx + 12, 4);
            wg.lineTo(cx, 26);
            wg.closePath();
            wg.fillStyle = '#fde047';
            wg.fill();
            wg.strokeStyle = '#0f172a';
            wg.lineWidth = 2.5;
            wg.stroke();
          }
          drawWheel(0);

          var statusEl = U().h('p', { text: 'Say "Spin the big wheel, please!" and tap SPIN!' });
          var spinBtn = U().btn('🎡 SPIN THE LUCKY WHEEL!', 'huge amber', function () {
            if (spinning) return;
            spinning = true;
            A().play('drum_roll_short');
            var winIdx = U().rand(0, WHEEL_SLICES.length - 1);
            var sliceArc = (Math.PI * 2) / WHEEL_SLICES.length;
            /* Target angle so slice `winIdx` lands at top (-PI/2) */
            var targetRot = (Math.PI * 2 * 5) - (winIdx * sliceArc + sliceArc / 2) - Math.PI / 2;
            var t0 = performance.now();
            var dur = 1650;

            function stepWheel(now) {
              var p = Math.min(1, (now - t0) / dur);
              var ease = 1 - Math.pow(1 - p, 3);
              angle = targetRot * ease;
              drawWheel(angle);
              if (p < 1) {
                requestAnimationFrame(stepWheel);
              } else {
                var prize = WHEEL_SLICES[winIdx];
                A().play('fanfare');
                U().confetti(28);
                statusEl.textContent = '🎉 ' + prize.desc;
                U().addScore(turn, prize.pts);

                if (prize.kind === 'all') {
                  T.forEach(function (ot, idx) { if (idx !== turn) U().addScore(idx, 15); });
                } else if (prize.kind === 'upgrade') {
                  var mySqs = Object.keys(props).filter(function (k) { return props[k].owner === turn; });
                  if (mySqs.length > 0) {
                    var uSq = +mySqs[0];
                    props[uSq].level = Math.min(3, props[uSq].level + 1);
                  }
                } else if (prize.kind === 'claim') {
                  var freeSqs = Object.keys(props).filter(function (k) { return props[k].owner == null; });
                  if (freeSqs.length > 0) {
                    var cSq = +freeSqs[U().rand(0, freeSqs.length - 1)];
                    props[cSq].owner = turn;
                    props[cSq].level = 1;
                    checkColorMonopolies(turn);
                  }
                }
                renderBoardState(-1);
                renderTopHud();
                spinBtn.textContent = 'Continue ▶';
                spinBtn.onclick = function () {
                  resolve();
                };
              }
            }
            requestAnimationFrame(stepWheel);
          });

          var card = U().h('div', { class: 'gm-b3-stagecard gm-b3-event' }, [
            U().h('h3', { text: '🎡 Lucky Monopoly Spin Wheel!' }),
            wheelCv,
            statusEl,
            spinBtn
          ]);
          center.appendChild(card);
        });
      }

      function showLiveAuctionEvent() {
        return new Promise(function (resolve) {
          A().play('fanfare');
          center.innerHTML = '';

          /* Pick an unowned property to auction (or a Golden Villa bonus if all are owned) */
          var freeProps = Object.keys(props).filter(function (k) { return props[k].owner == null; }).map(Number);
          var auctionSqIdx = freeProps.length > 0 ? freeProps[U().rand(0, freeProps.length - 1)] : null;
          var auctionSq = auctionSqIdx != null ? squares[auctionSqIdx] : null;
          var prizeName = auctionSq ? (auctionSq.e + ' ' + auctionSq.title) : '🏰 Golden Star Villa';

          var teamBtns = U().h('div', { class: 'gm-b3-btn-row' });
          T.forEach(function (tm, ti) {
            var b = U().btn('🔨 Sold to ' + tm.name + '! (+25)', ti === turn ? 'big amber' : 'big cyan', function () {
              A().play('pu_gold');
              U().confetti(25);
              if (auctionSqIdx != null) {
                props[auctionSqIdx].owner = ti;
                props[auctionSqIdx].level = 1;
                var m = checkColorMonopolies(ti);
                if (m.length > 0) U().addScore(ti, 35);
                U().floatText('🔨 Won by ' + tm.name + '!', sqEls[auctionSqIdx], 'good');
              }
              U().addScore(ti, 25);
              renderBoardState(-1);
              renderTopHud();
              resolve();
            });
            teamBtns.appendChild(b);
          });

          var bidSentence = auctionSq && auctionSq.sentence
            ? auctionSq.sentence
            : ('We bid twenty points for ' + (auctionSq ? auctionSq.title : 'the Golden Villa') + '!');

          var card = U().h('div', { class: 'gm-b3-stagecard gm-b3-event' }, [
            U().h('div', { class: 'gm-b3-trade-head' }, [
              U().h('h3', { text: '🔨 LIVE CLASSROOM AUCTION: ' + prizeName }),
              U().btn('🔊 Listen', 'sm amber', function () { A().speak(bidSentence); })
            ]),
            U().h('div', { class: 'gm-b3-telebox' }, [
              U().h('div', { class: 'gm-b3-tele-label', text: '🗣️ ALL TEAMS! RAISE YOUR HAND & SHOUT YOUR BID IN ENGLISH:' }),
              U().h('div', { class: 'gm-b3-tele-main', text: '“' + bidSentence + '”' }),
              U().h('div', { class: 'gm-b3-tele-sub', text: 'Teacher taps the team that spoke the clearest English sentence!' })
            ]),
            teamBtns
          ]);
          center.appendChild(card);
        });
      }

      function clearTrainHighlights() {
        sqEls.forEach(function (el) { el.classList.remove('train-target'); });
      }

      function showExpressTrainEvent() {
        return new Promise(function (resolve) {
          A().play('pu_good');
          trainSelectMode = true;
          sqEls.forEach(function (el, idx) {
            if (idx !== pos[turn]) el.classList.add('train-target');
          });

          center.innerHTML = '';
          var card = U().h('div', { class: 'gm-b3-stagecard gm-b3-event' }, [
            U().h('div', { class: 'gm-b3-ev-ic', text: '🚂' }),
            U().h('h3', { text: '🚂 Express Star Train! (+20 pts)' }),
            U().h('p', { text: 'Say “Take us to [Square Name], please!” and tap ANY glowing square on the board to ride there!' }),
            U().btn('🎲 Or Ride to Best Unowned Square!', 'huge green', function () {
              trainSelectMode = false;
              clearTrainHighlights();
              var freeProps = Object.keys(props).filter(function (k) { return props[k].owner == null; }).map(Number);
              var dest = freeProps.length > 0 ? freeProps[0] : ((pos[turn] + 6) % N);
              rideTrainTo(dest);
              resolve();
            })
          ]);
          center.appendChild(card);
        });
      }

      async function rideTrainTo(destIdx) {
        busy = true;
        A().play('whoosh');
        U().addScore(turn, 20);
        pos[turn] = destIdx;
        renderBoardState(turn);
        renderTopHud();
        await U().sleep(480);
        if (!alive) return;
        await resolveLanding(squares[destIdx]);
      }

      function showSuperStageEvent(sq) {
        return new Promise(function (resolve) {
          var t = T[turn];
          var item = ctx.nextItem ? ctx.nextItem() : null;
          var pData = extractLessonProperty(item, 'Super Star', '🎤', 'We are speaking English loud and clear on the Super Stage!');
          A().play('fanfare');
          center.innerHTML = '';

          var card = U().h('div', { class: 'gm-b3-stagecard gm-b3-event' }, [
            U().h('div', { class: 'gm-b3-trade-head' }, [
              U().h('h3', { text: '🎤 Super Stage Whole-Team Chant!' }),
              U().btn('🔊 Listen', 'sm amber', function () { A().speak(pData.sentence); })
            ]),
            U().h('div', { class: 'gm-b3-telebox' }, [
              U().h('div', { class: 'gm-b3-tele-label', text: '🌟 EVERYONE IN ' + t.name.toUpperCase() + ' CHANTS TOGETHER:' }),
              U().h('div', { class: 'gm-b3-tele-main', text: '“' + pData.sentence + '”' })
            ]),
            U().h('div', { class: 'gm-b3-btn-row' }, [
              U().btn('🎤 Whole Team Chanted! (+30 pts)', 'huge green', function () {
                U().confetti(30);
                U().addScore(turn, 30);
                resolve();
              }),
              U().btn('👍 Good Try! (+20 pts)', 'big amber', function () {
                U().addScore(turn, 20);
                resolve();
              })
            ])
          ]);
          center.appendChild(card);
        });
      }

      function showChanceCardEvent() {
        return new Promise(function (resolve) {
          var ch = CHANCE_CARDS[U().rand(0, CHANCE_CARDS.length - 1)];
          var item = ctx.nextItem ? ctx.nextItem() : null;
          var pData = extractLessonProperty(item, 'Lucky Star', ch.e, 'We found a lucky star on the board!');
          A().play('pu_good');
          center.innerHTML = '';

          var card = U().h('div', { class: 'gm-b3-stagecard gm-b3-event' }, [
            U().h('div', { class: 'gm-b3-trade-head' }, [
              U().h('h3', { text: ch.e + ' Chance Card: ' + ch.t }),
              U().btn('🔊 Listen', 'sm amber', function () { A().speak(pData.sentence); })
            ]),
            U().h('p', { text: ch.d }),
            U().h('div', { class: 'gm-b3-telebox' }, [
              U().h('div', { class: 'gm-b3-tele-label', text: ch.act + ' — SAY ALOUD:' }),
              U().h('div', { class: 'gm-b3-tele-main', text: '“' + pData.sentence + '”' })
            ]),
            U().h('div', { class: 'gm-b3-btn-row' }, [
              U().btn('🌟 Nailed It! (+' + ch.pts + ' pts)', 'huge green', async function () {
                U().addScore(turn, ch.pts);
                if (ch.allBonus) {
                  T.forEach(function (ot, idx) { if (idx !== turn) U().addScore(idx, ch.allBonus); });
                }
                if (ch.freeUpgrade) {
                  var mySqs = Object.keys(props).filter(function (k) { return props[k].owner === turn; });
                  if (mySqs.length > 0) {
                    props[+mySqs[0]].level = Math.min(3, props[+mySqs[0]].level + 1);
                  }
                }
                renderBoardState(-1);
                renderTopHud();
                resolve();
              })
            ])
          ]);
          center.appendChild(card);
        });
      }

      function showSimpleEventCard(emoji, title, desc, badgeText) {
        return new Promise(function (resolve) {
          A().play('page_slide');
          center.innerHTML = '';
          var card = U().h('div', { class: 'gm-b3-stagecard gm-b3-event' }, [
            U().h('div', { class: 'gm-b3-ev-ic', text: emoji }),
            U().h('h3', { text: title }),
            U().h('p', { text: desc }),
            U().h('div', { class: 'gm-b3-ev-pts', text: badgeText }),
            U().btn('Continue ▶', 'huge green', function () {
              resolve();
            })
          ]);
          center.appendChild(card);
        });
      }

      showCenterPrompt();
    }
  };
})(window);
