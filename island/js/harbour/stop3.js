/* Treasure Island · Chapter 1 · Stop 3: The Ship Wheel (Global Reading Unit 1)
   - Grade 3 (Global Readings 2 · Unit 1 Phonics `cl-` & "What does it do?"):
     Spin the brass ship wheel to match `cl-` blend words (`Clara`, `clock`, `clean`, `classroom`, `climb`, `cloud`),
     then answer `"What does a clock do?"`!
   - Grade 4 (Global Readings 3 · Unit 1 `5W1H` Question Compass Wheel):
     Spin the 6-spoke `Who / What / Where / When / Why / How` wheel to match Alice & Brain questions! */
(function (root) {
  'use strict';
  var H = root.Harbour;
  if (!H || !H.scene) return;
  var FLAT = 'art/flat/';
  var Z1 = 'art/z1/';

  var G3_SPOKES = [
    { word: 'clock',     clue: 'cl-ock! Find CLOCK! It tells us the time!' },
    { word: 'clean',     clue: 'cl-ean! Find CLEAN! Clara\'s machine makes the floor clean!' },
    { word: 'Clara',     clue: 'Cl-ara! Find CLARA, the after-school inventor!' },
    { word: 'classroom', clue: 'cl-assroom! Find CLASSROOM, where we learn together!' },
    { word: 'climb',     clue: 'cl-imb! Find CLIMB! Climb up the ship\'s mast!' },
    { word: 'cloud',     clue: 'cl-oud! Find CLOUD, floating high in the sky!' }
  ];

  var G4_SPOKES = [
    { word: 'Who',   clue: 'Question word for a PERSON: blank chased the White Rabbit? Tap WHO!' },
    { word: 'Where', clue: 'Question word for a PLACE: blank did Alice fall? Down the rabbit hole! Tap WHERE!' },
    { word: 'When',  clue: 'Question word for TIME: blank did Alice feel sleepy? In the afternoon! Tap WHEN!' },
    { word: 'Why',   clue: 'Question word for a REASON: blank did Alice follow him? Because she was curious! Tap WHY!' },
    { word: 'What',  clue: 'Question word for a THING: blank was in the rabbit\'s waistcoat? A watch! Tap WHAT!' },
    { word: 'How',   clue: 'Question word for a WAY: blank do brain cells connect? By practicing! Tap HOW!' }
  ];

  H.stops[3] = function (ctx) {
    var isG4 = ctx.grade === 4;
    var spokes = isG4 ? G4_SPOKES : G3_SPOKES;
    var picks = H.shuffle([0, 1, 2, 3, 4, 5]).slice(0, 4);
    var S = H.scene(ctx, { stop: 3, cls: 's3', bg: ['bg_s3_deck', 'deck'], npc: { art: 'c_flint', name: 'Captain Flint' }, rounds: 5 });
    var wheelImg = H.hasArt('o_wheel_big') ? 'art/ch1/o_wheel_big.webp' : FLAT + 'o_ship_wheel.webp';

    var html = '<div class="s3-wheel" id="s3-wheel"><img src="' + wheelImg + '" alt="" draggable="false"></div><div class="s3-ring" id="s3-ring">';
    spokes.forEach(function (sp, k) {
      var a = (k / spokes.length) * Math.PI * 2 - Math.PI / 2;
      html += '<button type="button" class="s3-month" data-k="' + k + '" style="left:' + (50 + Math.cos(a) * 43).toFixed(1) + '%;top:' + (50 + Math.sin(a) * 43).toFixed(1) + '%;min-width:4.2em;padding:0.3em 0.55em;font-size:0.86em">' + sp.word + '</button>';
    });
    html += '</div>';
    S.play.insertAdjacentHTML('beforeend', '<div class="s3-box">' + html + '</div>');

    var turn = 0, busy = false, want = -1, miss = 0;
    [].forEach.call(S.play.querySelectorAll('.s3-month'), function (b) {
      b.onclick = function () { tapSpoke(Number(b.dataset.k), b); };
    });

    function round() {
      if (S.closed) return;
      S.quiet();
      if (S.i >= picks.length) return bonusRound();
      want = picks[S.i]; miss = 0;
      [].forEach.call(S.play.querySelectorAll('.s3-month'), function (b) { H.mark(b, Number(b.dataset.k) === want); });
      var sp = spokes[want];
      S.replay = function () { S.npcSay(sp.clue); S.say(sp.clue); };
      S.replay();
    }

    function tapSpoke(k, b) {
      if (busy || want < 0 || S.closed) return;
      busy = true;
      S.tap();
      var word = spokes[k].word;
      S.heroSay(word + '!');
      S.say(word, function () {
        if (k === want) {
          b.classList.add('got');
          S.right(b);
          if (root.Ch1Audio && root.Ch1Audio.sfxGear) root.Ch1Audio.sfxGear();
          turn += 360 + 60;
          var wheel = document.getElementById('s3-wheel');
          if (wheel) wheel.style.transform = 'rotate(' + turn + 'deg)';
          want = -1;
          setTimeout(function () { busy = false; S.next(round); }, 950);
        } else {
          S.wrong(b, spokes[want].word); miss++;
          setTimeout(function () {
            busy = false;
            if (miss >= 2) {
              S.hints++;
              var g = S.play.querySelector('.s3-month[data-k="' + want + '"]');
              if (g) g.classList.add('hint');
              S.slow(spokes[want].word);
            } else {
              S.say('Listen for ' + spokes[want].word + '!');
            }
          }, 700);
        }
      });
    }

    function bonusRound() {
      var box = S.play.querySelector('.s3-box');
      if (box) box.style.opacity = '0.28';
      var q = isG4
        ? 'Final Wheel Clue! How do we picture a story in our imagination?'
        : 'Final Wheel Clue! What does an eraser do?';
      var opts = isG4
        ? [
            { t: 'We visualize scenes in our mind!', img: Z1 + 'w_visualize.webp', ok: true },
            { t: 'We freeze like a statue.', img: Z1 + 'w_freeze.webp' },
            { t: 'We sweep with a broom.', img: Z1 + 'w_broom.webp' }
          ]
        : [
            { t: 'It rubs out pencil mistakes!', img: Z1 + 'w_try.webp', ok: true },
            { t: 'It climbs up a cloud.', img: Z1 + 'w_invent.webp' },
            { t: 'It sleeps on a pillow.', img: Z1 + 'w_sleep.webp' }
          ];
      S.replay = function () { S.npcSay(q); S.say(q); };
      S.replay();
      setTimeout(function () {
        S.choices(opts, function () {
          S.npcSay('Squawk! Full speed ahead!');
          S.say('Squawk! Full speed ahead!', function () { S.next(round); });
        });
      }, 480);
    }

    setTimeout(round, 550);
  };
})(typeof window !== 'undefined' ? window : this);
