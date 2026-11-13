/* Treasure Island · Chapter 1 · Stop 5: Billy Bones's Sea Chest Boss (Global Reading Unit 1 Finale)
   - Grade 3 (Global Readings 2 · Unit 1 "What Does It Do?" Mastery):
     Unlock 4 brass gadget padlocks covering vocabulary, sequence, `cl-` phonics, and nature inventions!
   - Grade 4 (Global Readings 3 · Unit 1 "I Love Reading" Mastery):
     Unlock 4 brass story padlocks covering Alice's adventure, Brain lobes/synapses, `5W1H`, and `-er` words!
   - Opening all 4 locks bursts Billy's Sea Chest open -> Map Piece #1 + +25 Coins + Sail to Chapter 2! */
(function (root) {
  'use strict';
  var H = root.Harbour;
  if (!H || !H.scene) return;
  var FLAT = 'art/flat/';
  var Z1 = 'art/z1/';

  var G3_LOCKS = [
    {
      tag: 'Lock 1 · Purpose',
      q: 'Lock One! What does Clara\'s room-cleaning machine do?',
      ok: { t: 'It cleans up the messy room!', img: Z1 + 's_clara_machine.webp' },
      no: [
        { t: 'It makes a bigger mess.', img: Z1 + 'w_mess.webp' },
        { t: 'It sleeps until noon.', img: Z1 + 'w_sleep.webp' }
      ]
    },
    {
      tag: 'Lock 2 · Inventor Grit',
      q: 'Lock Two! What should an inventor do when a plan does not work the first time?',
      ok: { t: 'Change the plan and try again!', img: Z1 + 's_try_again.webp' },
      no: [
        { t: 'Hide in the corner.', img: Z1 + 'w_hide.webp' },
        { t: 'Stop inventing forever.', img: Z1 + 's_z1_broken.webp' }
      ]
    },
    {
      tag: 'Lock 3 · Nature Idea',
      q: 'Lock Three! Engineers copied a kingfisher bird\'s beak to improve which fast machine?',
      ok: { t: 'A fast, quiet bullet train!', img: Z1 + 'w_wheels.webp' },
      no: [
        { t: 'A wooden bookshelf.', img: Z1 + 'w_shelf.webp' },
        { t: 'A paper pillow.', img: Z1 + 'w_sleep.webp' }
      ]
    },
    {
      tag: 'Lock 4 · cl- Blend',
      q: 'Final Lock! Which pair of words BOTH start with the CL sound?',
      ok: { t: 'Clock and clean!', img: Z1 + 's_tidy_room.webp' },
      no: [
        { t: 'Mirror and mess.', img: Z1 + 'w_mirror.webp' },
        { t: 'Broom and wheel.', img: Z1 + 'w_broom.webp' }
      ]
    }
  ];

  var G4_LOCKS = [
    {
      tag: 'Lock 1 · Alice',
      q: 'Lock One! Why did Alice chase the White Rabbit down the rabbit hole?',
      ok: { t: 'Because she felt curious about his waistcoat watch!', img: Z1 + 's_alice_chase.webp' },
      no: [
        { t: 'Because she wanted to clean shelves.', img: Z1 + 'w_broom.webp' },
        { t: 'Because it was snowing.', Z1: true, img: Z1 + 'w_freeze.webp' }
      ]
    },
    {
      tag: 'Lock 2 · Your Brain',
      q: 'Lock Two! What happens inside your brain lobes when you practice reading?',
      ok: { t: 'Brain cells and fibers connect to send messages!', img: Z1 + 'w_workout.webp' },
      no: [
        { t: 'Brain cells turn into stone.', img: FLAT + 'm_stone.webp' },
        { t: 'Your brain goes to sleep.', img: Z1 + 'w_sleepy.webp' }
      ]
    },
    {
      tag: 'Lock 3 · Visualize',
      q: 'Lock Three! What does it mean to visualize while you read?',
      ok: { t: 'To picture the characters and setting in your mind!', img: Z1 + 's_visualize_read.webp' },
      no: [
        { t: 'To skip every page.', img: Z1 + 'w_run.webp' },
        { t: 'To close your book tightly.', img: FLAT + 'o_book.webp' }
      ]
    },
    {
      tag: 'Lock 4 · -er Words',
      q: 'Final Lock! Which sentence uses TWO -er words accurately?',
      ok: { t: 'A curious reader becomes a stronger thinker!', img: Z1 + 's_love_reading.webp' },
      no: [
        { t: 'A sleepy rabbit fell down.', img: Z1 + 's_alice_fall.webp' },
        { t: 'The shelves are in the corner.', img: Z1 + 'w_shelf.webp' }
      ]
    }
  ];

  function chest(S) {
    S.play.insertAdjacentHTML('beforeend',
      '<div class="s5-chest" id="s5-chest">' +
        '<img class="s5-closed" src="' + FLAT + 'o_billy_chest.webp" alt="" draggable="false">' +
        '<img class="s5-open" src="' + FLAT + 'o_chest_open.webp" alt="" draggable="false">' +
        (H.hasArt('o_dial_lock') ? '<img class="s5-padlock" src="art/ch1/o_dial_lock.webp" alt="" draggable="false">' : '') +
      '</div>');
  }

  function openChest(S, cb) {
    var c = S.$('#s5-chest');
    if (c) c.classList.add('opened');
    if (root.Ch1Audio && root.Ch1Audio.sfxChestOpen) root.Ch1Audio.sfxChestOpen();
    setTimeout(cb, 1150);
  }

  H.stops[5] = function (ctx) {
    var isG4 = ctx.grade === 4;
    var bank = isG4 ? G4_LOCKS : G3_LOCKS;
    var S = H.scene(ctx, { stop: 5, cls: 's5', bg: ['bg_s5_dock', 'dock'], npc: { art: 'c_billy', name: 'Billy Bones' }, rounds: bank.length });
    chest(S);

    var locksHtml = '<div class="s5-locks">';
    bank.forEach(function (d, k) {
      locksHtml += '<div class="s5-lock" data-k="' + k + '"><span>🔒</span><b>' + d.tag + '</b></div>';
    });
    S.play.insertAdjacentHTML('beforeend', locksHtml + '</div>');

    function round() {
      if (S.closed) return;
      S.quiet();
      var d = bank[S.i];
      var lock = S.play.querySelector('.s5-lock[data-k="' + S.i + '"]');
      [].forEach.call(S.play.querySelectorAll('.s5-lock'), function (n) { n.classList.toggle('now', n === lock); });

      S.replay = function () { S.npcSay(d.q); S.say(d.q); };
      S.replay();

      var opts = [{ t: d.ok.t, img: d.ok.img, ok: true, say: d.ok.t }].concat(
        d.no.map(function (o) { return { t: o.t, img: o.img, say: o.t }; })
      );

      setTimeout(function () {
        S.choices(opts, function () {
          if (lock) {
            lock.classList.remove('now');
            lock.classList.add('open');
            lock.querySelector('span').textContent = '🔓';
          }
          if (root.Ch1Audio && root.Ch1Audio.sfxGear) root.Ch1Audio.sfxGear();
          S.npcSay('Click! Lock ' + (S.i + 1) + ' is open!');
          S.say('Click! Lock ' + (S.i + 1) + ' is open!', function () {
            if (S.i + 1 >= S.n) {
              openChest(S, function () { S.next(round); });
            } else {
              S.next(round);
            }
          });
        }, { cls: 'pics-t' });
      }, 520);
    }

    setTimeout(round, 560);
  };
})(typeof window !== 'undefined' ? window : this);
