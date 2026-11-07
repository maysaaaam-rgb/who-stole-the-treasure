/* Treasure Island · Chapter 1 · Stop 2: The Notice Board
   Grade 3 (school people and places): Jim asks "Who's this?" / "Where is Benbow?"; tap the right photo on the board.
   Grade 4 (polite requests): Jim asks "Give me the ruler, please"; tap the thing in the crate, it flies to him.
   At the end the child asks for the map themselves. */
(function (root) {
  'use strict';
  var H = root.Harbour;
  if (!H || !H.scene) return;
  var FLAT = 'art/flat/';

  var G3 = [
    { ask: "Who's this? She helps us find books.", ok: 'This is the librarian.', okImg: 'art/z1/s_love_reading.webp',
      no: [['This is the caretaker.', 'art/z1/s_cleans_floor.webp'], ['This is the school nurse.', FLAT + 'v_nurse_happy.webp']] },
    { ask: 'Where is Benbow? Listen! Piano and drums!', ok: "He's in the music room.", okImg: FLAT + 'subj_music.webp',
      no: [["He's in the art room.", FLAT + 'subj_art.webp'], ["He's in the gym.", 'art/z1/w_workout.webp']] },
    { ask: "Who's this? She helps us when we are sick.", ok: 'This is the school nurse.', okImg: FLAT + 'v_nurse_happy.webp',
      no: [['This is the librarian.', 'art/z1/s_love_reading.webp'], ['This is my classmate.', FLAT + 'v_boy_happy.webp']] },
    { ask: 'Where is she? She is painting a picture.', ok: "She's in the art room.", okImg: FLAT + 'subj_art.webp',
      no: [["She's in the music room.", FLAT + 'subj_music.webp'], ["She's in the gym.", 'art/z1/w_workout.webp']] },
    { ask: "Who's this? He cleans our school.", ok: 'This is the caretaker.', okImg: 'art/z1/s_cleans_floor.webp',
      no: [['This is the school nurse.', FLAT + 'v_nurse_happy.webp'], ['This is the librarian.', 'art/z1/s_love_reading.webp']] }
  ];
  var G4_ITEMS = [
    { id: 'map', img: FLAT + 'o_map_scroll.webp', ask: 'Give me the map, please.' },
    { id: 'book', img: FLAT + 'o_book.webp', ask: 'Give me the book, please.' },
    { id: 'ruler', img: FLAT + 'o_ruler.webp', ask: 'Pass the ruler, please.' },
    { id: 'pencil', img: FLAT + 'cmd_take_pencil.webp', ask: 'Give me the pencil, please.' }
  ];

  H.stops[2] = function (ctx) {
    if (ctx.grade === 4) return grade4(ctx);
    var rounds = H.shuffle(G3);
    var S = H.scene(ctx, { stop: 2, cls: 's2', bg: ['bg_s2_board', 'board'], npc: { art: 'c_jim', name: 'Jim' }, rounds: rounds.length });
    // the board itself (Gemini's painted board, or the notice board picture)
    if (!H.hasArt('bg_s2_board')) S.play.insertAdjacentHTML('beforeend', '<img class="s2-board" src="' + FLAT + 'o_notice_board.webp" alt="" draggable="false">');
    var pins = ['📍', '📌', '📍'];
    function round() {
      if (S.closed) return;
      S.quiet();
      [].forEach.call(S.play.querySelectorAll('.k-thing'), function (n) { n.remove(); });
      var r = rounds[S.i];
      var cards = H.shuffle([{ t: r.ok, img: r.okImg, ok: true }].concat(r.no.map(function (n) { return { t: n[0], img: n[1] }; })));
      var els = S.things(cards.map(function (c, k) {
        return { id: String(k), img: c.img, x: 30 + k * 20, y: 30 + (k % 2) * 6, w: 17, label: c.t };
      }), 's2-photo');
      els.forEach(function (b, k) {
        b.insertAdjacentHTML('beforeend', '<i class="s2-pin">' + pins[k] + '</i>');
        b.onclick = function () { pick(cards[k], b, r); };
        H.mark(b, cards[k].ok);
      });
      S.replay = function () { S.npcSay(r.ask); S.say(r.ask); };
      S.replay();
    }
    var busy = false;
    function pick(c, b, r) {
      if (busy || S.closed) return;
      busy = true;
      S.tap();
      S.heroSay(c.t);
      S.say(c.t, function () {
        if (c.ok) {
          S.right(b); b.classList.add('ok');
          setTimeout(function () { busy = false; S.next(round); }, 900);
        } else {
          S.wrong(b, r.ok);
          setTimeout(function () {
            busy = false;
            if (S.tries && b.parentNode) {
              var wrongHere = S.play.querySelectorAll('.k-thing.no').length;
              if (wrongHere >= 2) { var g = [].filter.call(S.play.querySelectorAll('.k-thing'), function (n) { return n.getAttribute('aria-label') === r.ok; })[0]; if (g) g.classList.add('hint'); S.hints++; S.slow(r.ok); return; }
            }
            S.say('Try again!');
          }, 800);
        }
      });
    }
    setTimeout(round, 600);
  };

  function grade4(ctx) {
    var order = H.shuffle(G4_ITEMS);
    var S = H.scene(ctx, { stop: 2, cls: 's2 g4', bg: ['bg_s2_board', 'board'], npc: { art: 'c_jim', name: 'Jim' }, rounds: order.length + 1 });
    S.play.insertAdjacentHTML('beforeend', '<img class="s2-crate" src="' + FLAT + 'o_crate.webp" alt="" draggable="false">');
    var els = S.things(G4_ITEMS.map(function (it, k) {
      return { id: it.id, img: it.img, x: 56 + (k % 2) * 13, y: 48 + Math.floor(k / 2) * 17, w: 12, label: it.id };
    }), 's2-item');
    var busy = false, want = null, miss = 0;
    els.forEach(function (b, k) { b.onclick = function () { give(G4_ITEMS[k], b); }; });
    function round() {
      if (S.closed) return;
      S.quiet();
      if (S.i >= order.length) return askForMap();
      want = order[S.i]; miss = 0;
      els.forEach(function (b, k) { H.mark(b, G4_ITEMS[k].id === want.id); });
      S.replay = function () { S.npcSay(want.ask); S.say(want.ask); };
      S.replay();
    }
    function give(it, b) {
      if (busy || !want || S.closed || b.classList.contains('given')) return;
      busy = true;
      S.tap();
      if (it.id === want.id) {
        S.heroSay('Here you are!');
        b.classList.add('given', 'fly');
        S.right(b);
        S.say('Here you are!', function () {
          S.npcSay('Thank you!');
          S.say('Thank you!', function () { busy = false; want = null; S.next(round); });
        });
      } else {
        S.wrong(b, want.ask);
        miss++;
        setTimeout(function () {
          busy = false;
          if (miss >= 2) { S.hints++; var g = S.play.querySelector('.k-thing[data-id="' + want.id + '"]'); if (g) g.classList.add('hint'); S.slow(want.ask); }
          else S.say(want.ask);
        }, 700);
      }
    }
    function askForMap() {
      // Jim holds the map now: the child asks for it
      S.$('#k-npc').insertAdjacentHTML('beforeend', '<img class="s2-held" src="' + FLAT + 'o_map_scroll.webp" alt="" draggable="false">');
      var q = 'Now you ask me for the map!';
      S.replay = function () { S.npcSay(q); S.say(q); };
      S.replay();
      setTimeout(function () {
        S.choices([
          { t: 'Give me the map, please.', ic: '🗺️', ok: true },
          { t: 'Sit down, please.', ic: '🪑' },
          { t: 'Good night!', ic: '🌙' }
        ], function () {
          var held = S.$('.s2-held'); if (held) held.classList.add('fly-back');
          S.npcSay('Here you are!');
          S.say('Here you are!', function () { S.next(round); });
        });
      }, 500);
    }
    setTimeout(round, 600);
  }
})(typeof window !== 'undefined' ? window : this);
