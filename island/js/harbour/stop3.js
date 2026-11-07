/* Treasure Island · Chapter 1 · Stop 3: The Ship Wheel
   Grade 3 (months): Flint calls a month; tap it on the wheel and the wheel turns. Last: "What month is it now?"
   Grade 4 ("Flint says", classroom instructions): Flint gives an order; tap the picture, your monster does it. */
(function (root) {
  'use strict';
  var H = root.Harbour;
  if (!H || !H.scene) return;
  var FLAT = 'art/flat/';
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var ORDERS = [
    { say: 'Look at the board, please!', img: FLAT + 'cmd_look_board.webp' },
    { say: 'Open the door, please!', img: FLAT + 'o_door_open.webp' },
    { say: 'Open the window, please!', img: FLAT + 'o_window_open.webp' },
    { say: 'Be quiet, please!', img: FLAT + 'o_quiet_shh.webp' },
    { say: 'Sit down, please!', img: FLAT + 'cmd_sit_down.webp' },
    { say: 'Stand up, please!', img: FLAT + 'cmd_stand_up.webp' },
    { say: 'Open your book, please!', img: FLAT + 'cmd_open_book.webp' },
    { say: 'Raise your hand, please!', img: FLAT + 'cmd_raise_hand.webp' }
  ];

  H.stops[3] = function (ctx) { return ctx.grade === 4 ? flintSays(ctx) : months(ctx); };

  function months(ctx) {
    var picks = H.shuffle(MONTHS.map(function (m, k) { return k; })).slice(0, 4);
    var S = H.scene(ctx, { stop: 3, cls: 's3', bg: ['bg_s3_deck', 'deck'], npc: { art: 'c_flint', name: 'Flint' }, rounds: 5 });
    var wheelImg = H.hasArt('o_wheel_big') ? 'art/ch1/o_wheel_big.webp' : FLAT + 'o_ship_wheel.webp';
    var html = '<div class="s3-wheel" id="s3-wheel"><img src="' + wheelImg + '" alt="" draggable="false"></div><div class="s3-ring" id="s3-ring">';
    MONTHS.forEach(function (m, k) {
      var a = k / 12 * Math.PI * 2 - Math.PI / 2;
      html += '<button type="button" class="s3-month" data-k="' + k + '" style="left:' + (50 + Math.cos(a) * 44).toFixed(1) + '%;top:' + (50 + Math.sin(a) * 44).toFixed(1) + '%">' + m.slice(0, 3) + '</button>';
    });
    html += '</div>';
    S.play.insertAdjacentHTML('beforeend', '<div class="s3-box">' + html + '</div>');
    var turn = 0, busy = false, want = -1, miss = 0;
    [].forEach.call(S.play.querySelectorAll('.s3-month'), function (b) {
      b.onclick = function () { tapMonth(Number(b.dataset.k), b); };
    });
    function round() {
      if (S.closed) return;
      S.quiet();
      if (S.i >= picks.length) return nowMonth();
      want = picks[S.i]; miss = 0;
      [].forEach.call(S.play.querySelectorAll('.s3-month'), function (b) { H.mark(b, Number(b.dataset.k) === want); });
      var line = MONTHS[want] + '! Find ' + MONTHS[want] + '!';
      S.replay = function () { S.npcSay(MONTHS[want] + '!'); S.say(line); };
      S.replay();
    }
    function tapMonth(k, b) {
      if (busy || want < 0 || S.closed) return;
      busy = true;
      S.tap();
      S.heroSay(MONTHS[k]);
      S.say(MONTHS[k], function () {
        if (k === want) {
          b.classList.add('got');
          S.right(b);
          turn += 390;   // a happy spin of the wheel
          var wheel = document.getElementById('s3-wheel');
          if (wheel) wheel.style.transform = 'rotate(' + turn + 'deg)';
          want = -1;
          setTimeout(function () { busy = false; S.next(round); }, 1100);
        } else {
          S.wrong(b, MONTHS[want]); miss++;
          setTimeout(function () {
            busy = false;
            if (miss >= 2) { S.hints++; var g = S.play.querySelector('.s3-month[data-k="' + want + '"]'); if (g) g.classList.add('hint'); S.slow(MONTHS[want]); }
            else S.say(MONTHS[want] + '!');
          }, 700);
        }
      });
    }
    function nowMonth() {
      var m = new Date().getMonth();
      var others = H.shuffle(MONTHS.filter(function (x, k) { return k !== m; })).slice(0, 2);
      var q = 'What month is it now?';
      S.replay = function () { S.npcSay(q); S.say(q); };
      S.replay();
      setTimeout(function () {
        S.choices([
          { t: "It's " + MONTHS[m] + '!', ic: '📅', ok: true },
          { t: "It's " + others[0] + '.', ic: '📅' },
          { t: "It's " + others[1] + '.', ic: '📅' }
        ], function () { S.npcSay('Yes! Squawk!'); S.say('Yes! Well done!', function () { S.next(round); }); });
      }, 500);
    }
    setTimeout(round, 600);
  }

  function flintSays(ctx) {
    var list = H.shuffle(ORDERS).slice(0, 5);
    var S = H.scene(ctx, { stop: 3, cls: 's3 g4', bg: ['bg_s3_deck', 'deck'], npc: { art: 'c_flint', name: 'Flint' }, rounds: list.length });
    S.play.insertAdjacentHTML('beforeend', '<img class="s3-small-wheel" src="' + (H.hasArt('o_wheel_big') ? 'art/ch1/o_wheel_big.webp' : FLAT + 'o_ship_wheel.webp') + '" alt="" draggable="false">');
    function round() {
      if (S.closed) return;
      S.quiet();
      var o = list[S.i];
      var others = H.shuffle(ORDERS.filter(function (x) { return x !== o; })).slice(0, 2);
      S.replay = function () { S.npcSay('Flint says: ' + o.say); S.say('Flint says: ' + o.say); };
      S.replay();
      setTimeout(function () {
        S.choices([{ img: o.img, say: o.say, ok: true }].concat(others.map(function (x) { return { img: x.img, say: x.say }; })), function () {
          S.$('#k-hero').classList.remove('act'); void S.$('#k-hero').offsetWidth; S.$('#k-hero').classList.add('act');
          S.say('Good job!', function () { S.next(round); });
        }, { cls: 'pics' });
      }, 600);
    }
    setTimeout(round, 600);
  }
})(typeof window !== 'undefined' ? window : this);
