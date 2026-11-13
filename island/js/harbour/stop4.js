/* Treasure Island · Chapter 1 · Stop 4: Pier Spyglass Lookout (Global Reading Unit 1)
   - Grade 3 (Global Readings 2 · Unit 1 "My Good Ideas Book" & Nature Biomimicry):
     Move the brass spyglass lens across `bg_s4_lookout.webp` to spot 4 great ideas from nature & inventors
     (`hexagon` bee honeycomb, `wheels` bicycle/train, `broom` cleaning tool, `invent` lightbulb/parachute),
     then answer 2 biomimicry questions!
   - Grade 4 (Global Readings 3 · Unit 1 `-er` Suffix Detective & Literacy Review):
     Sweep the spyglass to discover `-er` words & animal survival (`reader`, `creative` writer/thinker, `butterflies` migration, `freeze` rabbit),
     then answer 2 `-er` word-study questions! */
(function (root) {
  'use strict';
  var H = root.Harbour;
  if (!H || !H.scene) return;
  var Z1 = 'art/z1/';

  var G3_FIND = [
    { id: 'hexagon', label: 'hexagon honeycomb', img: Z1 + 'w_hexagon.webp', say: 'Move the spyglass! Find the six-sided bee HEXAGON!' },
    { id: 'invent',  label: 'good idea invention', img: Z1 + 'w_invent.webp', say: 'Look through the spyglass! Find the bright INVENTION idea!' },
    { id: 'wheels',  label: 'spinning wheels', img: Z1 + 'w_wheels.webp', say: 'Scan the pier! Find the fast spinning WHEELS!' },
    { id: 'mirror',  label: 'shiny mirror', img: Z1 + 'w_mirror.webp', say: 'One more! Find the shiny MIRROR!' }
  ];

  var G3_QS = [
    {
      q: 'Bees build strong honeycombs with six sides! What shape is that?',
      c: [
        { t: 'It is a hexagon!', img: Z1 + 'w_hexagon.webp', ok: true },
        { t: 'It is a messy room.', img: Z1 + 'w_mess.webp' },
        { t: 'It is bedtime.', img: Z1 + 'w_sleep.webp' }
      ],
      reply: 'Yes! Six strong sides make a hexagon!'
    },
    {
      q: 'Leonardo da Vinci sketched a sky canopy so people could float safely down! What is it?',
      c: [
        { t: 'A parachute!', img: Z1 + 's_invent_new.webp', ok: true },
        { t: 'A dusty broom.', img: Z1 + 'w_broom.webp' },
        { t: 'A lunch box.', img: Z1 + 'w_lunch.webp' }
      ],
      reply: 'Bravo! Great inventors copy nature and sketch in their Good Ideas Book!'
    }
  ];

  var G4_FIND = [
    { id: 'reader',    label: 'curious reader', img: Z1 + 's_love_reading.webp', say: 'Sweep the spyglass! Spot the person who reads: a READER!' },
    { id: 'thinker',   label: 'creative thinker', img: Z1 + 'w_creative.webp', say: 'Look through the lens! Spot the CREATIVE THINKER!' },
    { id: 'migration', label: 'monarch butterfly migration', img: Z1 + 's_butterflies.webp', say: 'Scan the horizon! Spot the Monarch butterflies on their MIGRATION!' },
    { id: 'freeze',    label: 'rabbit freezing still', img: Z1 + 's_rabbit_freeze.webp', say: 'Spot the wild rabbit that knows how to FREEZE so predators miss it!' }
  ];

  var G4_QS = [
    {
      q: 'Add -er! Someone who writes stories is a writer. Someone who reads books is a...',
      c: [
        { t: 'A reader!', img: Z1 + 's_love_reading.webp', ok: true },
        { t: 'A waistcoat!', img: Z1 + 'w_chase.webp' },
        { t: 'A bookshelf!', img: Z1 + 'w_shelf.webp' }
      ],
      reply: 'Spot on! Read plus E-R makes reader!'
    },
    {
      q: 'Add -er to compare! When your brain cells connect, your thinking gets...',
      c: [
        { t: 'Faster and stronger!', img: Z1 + 'w_workout.webp', ok: true },
        { t: 'Sleepy and slower.', img: Z1 + 'w_sleepy.webp' },
        { t: 'Lost in a corner.', img: Z1 + 'w_hide.webp' }
      ],
      reply: 'Yes! Faster and stronger every single day!'
    }
  ];

  var SPOTS = [[48, 58], [42, 26], [70, 22], [82, 52], [61, 40], [28, 30]];

  H.stops[4] = function (ctx) {
    var isG4 = ctx.grade === 4;
    var findPool = isG4 ? G4_FIND : G3_FIND;
    var qsPool = isG4 ? G4_QS : G3_QS;
    var order = H.shuffle(findPool);
    var S = H.scene(ctx, { stop: 4, cls: 's4', bg: ['bg_s4_lookout', 'lookout'], npc: { art: 'c_jim', name: 'Jim Hawkins' }, rounds: order.length + qsPool.length });
    var spots = H.shuffle(SPOTS);

    var els = S.things(findPool.map(function (f, k) {
      return { id: f.id, img: f.img, x: spots[k][0], y: spots[k][1], w: 9.5, label: f.label };
    }), 's4-hidden');
    S.play.insertAdjacentHTML('beforeend', '<div class="s4-dark" id="s4-dark"></div><div class="s4-rim" id="s4-rim"></div>');
    var dark = S.$('#s4-dark'), rim = S.$('#s4-rim');

    function look(e) {
      var r = S.play.getBoundingClientRect();
      var x = Math.max(8, Math.min(92, (e.clientX - r.left) / r.width * 100));
      var y = Math.max(10, Math.min(90, (e.clientY - r.top) / r.height * 100));
      dark.style.setProperty('--mx', x + '%'); dark.style.setProperty('--my', y + '%');
      rim.style.left = x + '%'; rim.style.top = y + '%';
    }
    S.play.addEventListener('pointermove', look);
    S.play.addEventListener('pointerdown', look);

    var want = null, busy = false, miss = 0;
    els.forEach(function (b, k) { b.onclick = function () { found(findPool[k], b); }; });

    function round() {
      if (S.closed) return;
      S.quiet();
      if (S.i >= order.length) return questions();
      want = order[S.i]; miss = 0;
      els.forEach(function (b, k) { H.mark(b, findPool[k].id === want.id); });
      S.replay = function () { S.npcSay(want.say); S.say(want.say); };
      S.replay();
    }

    function found(f, b) {
      if (busy || !want || S.closed || b.classList.contains('got')) return;
      busy = true;
      S.tap();
      if (f.id === want.id) {
        b.classList.add('got');
        S.right(b);
        S.heroSay('I spotted the ' + f.label + '!');
        S.say('Yes! The ' + f.label + '!', function () { busy = false; want = null; S.next(round); });
      } else {
        S.wrong(b, want.label); miss++;
        S.say('That is the ' + f.label + '. ' + want.say, function () { busy = false; });
        if (miss >= 2) {
          S.hints++;
          var g = S.play.querySelector('.k-thing[data-id="' + want.id + '"]');
          if (g) {
            g.classList.add('hint');
            dark.style.setProperty('--mx', g.style.left);
            dark.style.setProperty('--my', g.style.top);
            rim.style.left = g.style.left;
            rim.style.top = g.style.top;
          }
        }
      }
    }

    function questions() {
      S.play.classList.add('s4-open');
      var q = qsPool[S.i - order.length];
      S.replay = function () { S.npcSay(q.q); S.say(q.q); };
      S.replay();
      setTimeout(function () {
        S.choices(q.c, function () {
          S.npcSay(q.reply);
          S.say(q.reply, function () { S.next(round); });
        });
      }, 480);
    }

    setTimeout(round, 620);
  };
})(typeof window !== 'undefined' ? window : this);
