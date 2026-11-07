/* Treasure Island · Chapter 1 · Stop 4: The Spyglass
   Grade 3 (birthdays): look through the spyglass (move your finger) and find the cake, candles, balloon and gift;
   then answer "How old are you?" and "When's your birthday?".
   Grade 4 (numbers to 50): count barrels, gulls, lanterns and coins in rows of ten; tap the right number. */
(function (root) {
  'use strict';
  var H = root.Harbour;
  if (!H || !H.scene) return;
  var FLAT = 'art/flat/';

  var FIND = [
    { id: 'cake', img: FLAT + 'o_cake.webp', say: 'Find the cake!' },
    { id: 'candle', img: FLAT + 'o_candle.webp', say: 'Find the candle!' },
    { id: 'balloon', img: FLAT + 'o_balloon.webp', say: 'Find the balloon!' },
    { id: 'gift', img: FLAT + 'o_gift.webp', say: 'Find the gift!' }
  ];
  var SPOTS = [[50, 62], [44, 26], [70, 20], [84, 52], [62, 40], [26, 28]];
  var COUNT = [
    { n: 24, img: FLAT + 'o_barrel_dock.webp', noun: 'barrels', q: 'How many barrels?', no: [42, 14] },
    { n: 35, img: FLAT + 'o_bird.webp', noun: 'sea gulls', q: 'How many sea gulls?', no: [53, 25] },
    { n: 48, img: FLAT + 'o_lantern.webp', noun: 'lanterns', q: 'How many lanterns?', no: [38, 44] },
    { n: 50, img: FLAT + 'u_coin.webp', noun: 'gold coins', q: 'How many gold coins?', no: [15, 40] }
  ];
  var WORDS = { 4: 'four', 5: 'five', 8: 'eight', 10: 'ten', 14: 'fourteen', 15: 'fifteen', 20: 'twenty', 24: 'twenty-four', 25: 'twenty-five', 30: 'thirty', 35: 'thirty-five', 38: 'thirty-eight', 40: 'forty', 42: 'forty-two', 44: 'forty-four', 48: 'forty-eight', 50: 'fifty', 53: 'fifty-three' };

  H.stops[4] = function (ctx) { return ctx.grade === 4 ? counting(ctx) : spyglass(ctx); };

  function spyglass(ctx) {
    var order = H.shuffle(FIND);
    var S = H.scene(ctx, { stop: 4, cls: 's4', bg: ['bg_s4_lookout', 'lookout'], npc: { art: 'c_jim', name: 'Jim' }, rounds: order.length + 2 });
    var spots = H.shuffle(SPOTS);
    // hidden things, then a dark layer with a round spyglass hole that follows the finger
    var els = S.things(FIND.map(function (f, k) { return { id: f.id, img: f.img, x: spots[k][0], y: spots[k][1], w: 8, label: f.id }; }), 's4-hidden');
    S.play.insertAdjacentHTML('beforeend', '<div class="s4-dark" id="s4-dark"></div><div class="s4-rim" id="s4-rim"></div>');
    var dark = S.$('#s4-dark'), rim = S.$('#s4-rim');
    function look(e) {
      var r = S.play.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width * 100), y = ((e.clientY - r.top) / r.height * 100);
      dark.style.setProperty('--mx', x + '%'); dark.style.setProperty('--my', y + '%');
      rim.style.left = x + '%'; rim.style.top = y + '%';
    }
    S.play.addEventListener('pointermove', look);
    S.play.addEventListener('pointerdown', look);
    var want = null, busy = false, miss = 0;
    els.forEach(function (b, k) { b.onclick = function () { found(FIND[k], b); }; });
    function round() {
      if (S.closed) return;
      S.quiet();
      if (S.i >= order.length) return questions();
      want = order[S.i]; miss = 0;
      els.forEach(function (b, k) { H.mark(b, FIND[k].id === want.id); });
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
        S.heroSay('The ' + f.id + '!');
        S.say('Yes! The ' + f.id + '!', function () { busy = false; want = null; S.next(round); });
      } else {
        S.wrong(b, want.say); miss++;
        S.say("That's the " + f.id + '. ' + want.say, function () { busy = false; });
        if (miss >= 2) { S.hints++; var g = S.play.querySelector('.k-thing[data-id="' + want.id + '"]'); if (g) g.classList.add('hint'); }
      }
    }
    function questions() {
      S.play.classList.add('s4-open');
      var qs = [
        { q: 'How old are you?', c: [{ t: "I'm eight.", ic: '🎂', ok: true }, { t: "It's in July.", ic: '☀️' }, { t: 'Good morning!', ic: '🌅' }], reply: 'Happy birthday!' },
        { q: "When's your birthday?", c: [{ t: "It's in July.", ic: '☀️', ok: true, say: "It's in July." }, { t: "I'm eight.", ic: '🎂' }, { t: 'This is the nurse.', ic: '👩‍⚕️' }], reply: 'In July! Hooray!' }
      ];
      var q = qs[S.i - order.length];
      S.replay = function () { S.npcSay(q.q); S.say(q.q); };
      S.replay();
      setTimeout(function () {
        S.choices(q.c, function () { S.npcSay(q.reply); S.say(q.reply, function () { S.next(round); }); });
      }, 500);
    }
    setTimeout(round, 700);
  }

  function counting(ctx) {
    var S = H.scene(ctx, { stop: 4, cls: 's4 g4', bg: ['bg_s4_lookout', 'lookout'], npc: { art: 'c_jim', name: 'Jim' }, rounds: COUNT.length });
    function round() {
      if (S.closed) return;
      S.quiet();
      S.play.innerHTML = '';
      var c = COUNT[S.i];
      var rows = '<div class="s4-count">';
      var tens = Math.floor(c.n / 10), ones = c.n % 10;
      for (var r = 0; r < tens; r++) {
        rows += '<div class="s4-row" style="--d:' + (r * 160) + 'ms"><b>10</b>';
        for (var k = 0; k < 10; k++) rows += '<img src="' + c.img + '" alt="" draggable="false">';
        rows += '</div>';
      }
      if (ones) {
        rows += '<div class="s4-row ones" style="--d:' + (tens * 160) + 'ms"><b>' + ones + '</b>';
        for (var j = 0; j < ones; j++) rows += '<img src="' + c.img + '" alt="" draggable="false">';
        rows += '</div>';
      }
      S.play.insertAdjacentHTML('beforeend', rows + '</div>');
      S.replay = function () { S.npcSay(c.q + ' Count!'); S.say(c.q + ' Count in tens!'); };
      S.replay();
      setTimeout(function () {
        S.choices([c.n].concat(c.no).map(function (n) {
          return { t: String(n), ic: '', say: (WORDS[n] || String(n)) + ' ' + c.noun + '!', ok: n === c.n };
        }), function () {
          S.npcSay((WORDS[c.n] || c.n) + '! Yes!');
          S.say('Yes! ' + (WORDS[c.n] || c.n) + ' ' + c.noun + '!', function () { S.next(round); });
        }, { cls: 'nums', heroSays: true });
      }, 900);
    }
    setTimeout(round, 600);
  }
})(typeof window !== 'undefined' ? window : this);
