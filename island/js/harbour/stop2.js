/* Treasure Island · Chapter 1 · Stop 2: Inventor's Blueprint Board & Brain Workout Lab (Global Reading Unit 1)
   - Grade 3 (Global Readings 2 · Unit 1 "What Does It Do?"):
     Grandpa Bolt & Jim pin invention sequence & purpose cards on `bg_s2_board.webp` (`First`, `Second`, `Third`, `Last`, `to + verb`, `problem -> solution`).
   - Grade 4 (Global Readings 3 · Unit 1 "I Love Reading" — "Learning and Your Brain"):
     Dr. Livesey's Brain Workout Board! Connect `lobes`, `workout`, `cells`, `fibers`, `messages`, `connecting`, `creative`, and `visualize`! */
(function (root) {
  'use strict';
  var H = root.Harbour;
  if (!H || !H.scene) return;
  var FLAT = 'art/flat/';
  var Z1 = 'art/z1/';

  var G3 = [
    {
      ask: 'Step 1 of inventing! What do we do FIRST when we spot a problem?',
      ok: 'First, draw a clear plan!', okImg: Z1 + 'w_plan.webp',
      no: [['Last, sleep all day.', Z1 + 'w_sleep.webp'], ['Hide the broken parts.', Z1 + 'w_hide.webp']]
    },
    {
      ask: 'Step 2! After we draw our plan, what do we do SECOND?',
      ok: 'Second, build the new machine!', okImg: Z1 + 'w_machine.webp',
      no: [['Forget the problem.', Z1 + 'w_mess.webp'], ['Eat lunch in the dark.', Z1 + 'w_lunch.webp']]
    },
    {
      ask: 'Step 3! What do we do THIRD to check our invention?',
      ok: 'Third, test what it does!', okImg: Z1 + 's_what_machine.webp',
      no: [['Run away from it.', Z1 + 'w_run.webp'], ['Freeze like a rabbit.', Z1 + 'w_freeze.webp']]
    },
    {
      ask: 'Step 4! What do we do LAST if our machine makes a mistake?',
      ok: 'Last, improve it and try again!', okImg: Z1 + 's_try_again.webp',
      no: [['Give up forever.', Z1 + 's_z1_broken.webp'], ['Make a bigger mess.', Z1 + 'w_mess.webp']]
    },
    {
      ask: 'Why did Clara build her machine? Choose the purpose with TO!',
      ok: 'She built it to clean her room!', okImg: Z1 + 's_cleans_floor.webp',
      no: [['She built it to make a mess.', Z1 + 'w_mess.webp'], ['She built it to chase rabbits.', Z1 + 'w_chase.webp']]
    }
  ];

  var G4 = [
    {
      ask: 'Reading and learning give your brain a strong exercise! What is that called?',
      ok: 'Reading gives your brain a workout!', okImg: Z1 + 'w_workout.webp',
      no: [['Reading makes your brain sleepy.', Z1 + 'w_sleepy.webp'], ['Reading freezes your brain.', Z1 + 'w_freeze.webp']]
    },
    {
      ask: 'Tiny brain cells send fast messages along thin threads! What happens when you learn?',
      ok: 'Brain cells and fibers start connecting!', okImg: Z1 + 's_invent_new.webp',
      no: [['Brain lobes fall asleep.', Z1 + 'w_sleep.webp'], ['Bookshelves disappear.', Z1 + 'w_shelf.webp']]
    },
    {
      ask: 'When you read a story with no pictures, you paint a movie in your mind! What is that word?',
      ok: 'Good readers visualize the story!', okImg: Z1 + 's_visualize_read.webp',
      no: [['Good readers hide the book.', Z1 + 'w_hide.webp'], ['Good readers break the clock.', Z1 + 's_z1_broken.webp']]
    },
    {
      ask: 'Different lobes of your brain work together to help you imagine new ideas! That makes you...',
      ok: 'Reading makes you creative!', okImg: Z1 + 'w_creative.webp',
      no: [['Reading makes you bored.', Z1 + 'w_sleepy.webp'], ['Reading makes a messy room.', Z1 + 'w_mess.webp']]
    },
    {
      ask: 'Why do we practice a new skill again and again?',
      ok: 'Practice makes brain pathways stronger!', okImg: Z1 + 's_love_reading.webp',
      no: [['Practice erases all messages.', Z1 + 'w_mess.webp'], ['Practice stops your lobes.', Z1 + 'w_freeze.webp']]
    }
  ];

  H.stops[2] = function (ctx) {
    var isG4 = ctx.grade === 4;
    var rounds = isG4 ? G4.slice() : G3.slice(); // keep sequence order for G3 First->Second->Third->Last!
    if (isG4) rounds = H.shuffle(rounds);
    var npc = isG4 ? { art: 'c_livesey', name: 'Dr. Livesey' } : { art: 'c_bolt_happy', name: 'Grandpa Bolt' };
    var S = H.scene(ctx, { stop: 2, cls: 's2', bg: ['bg_s2_board', 'board'], npc: npc, rounds: rounds.length });
    if (!H.hasArt('bg_s2_board')) S.play.insertAdjacentHTML('beforeend', '<img class="s2-board" src="' + FLAT + 'o_notice_board.webp" alt="" draggable="false">');
    var pins = ['📍', '📌', '📍'];
    var busy = false;

    function round() {
      if (S.closed) return;
      S.quiet();
      [].forEach.call(S.play.querySelectorAll('.k-thing'), function (n) { n.remove(); });
      var r = rounds[S.i];
      var cards = H.shuffle([{ t: r.ok, img: r.okImg, ok: true }].concat(r.no.map(function (n) { return { t: n[0], img: n[1] }; })));
      var els = S.things(cards.map(function (c, k) {
        return { id: String(k), img: c.img, x: 28 + k * 21, y: 27 + (k % 2) * 5, w: 18, label: c.t };
      }), 's2-photo');
      els.forEach(function (b, k) {
        b.insertAdjacentHTML('beforeend',
          '<i class="s2-pin">' + pins[k] + '</i>' +
          '<span style="display:block;margin-top:4px;padding:3px 6px;border-radius:8px;background:rgba(6,9,17,0.86);color:#f8fafc;font-size:0.56em;font-weight:800;line-height:1.18">' + cards[k].t + '</span>'
        );
        b.onclick = function () { pick(cards[k], b, r); };
        H.mark(b, cards[k].ok);
      });
      S.replay = function () { S.npcSay(r.ask); S.say(r.ask); };
      S.replay();
    }

    function pick(c, b, r) {
      if (busy || S.closed) return;
      busy = true;
      S.tap();
      S.heroSay(c.t);
      S.say(c.t, function () {
        if (c.ok) {
          S.right(b); b.classList.add('ok');
          if (root.Ch1Audio && root.Ch1Audio.sfxGear) root.Ch1Audio.sfxGear();
          setTimeout(function () { busy = false; S.next(round); }, 850);
        } else {
          S.wrong(b, r.ok);
          setTimeout(function () {
            busy = false;
            var wrongHere = S.play.querySelectorAll('.k-thing.no').length;
            if (wrongHere >= 2) {
              var g = [].filter.call(S.play.querySelectorAll('.k-thing'), function (n) { return n.getAttribute('aria-label') === r.ok; })[0];
              if (g) g.classList.add('hint');
              S.hints++;
              S.slow(r.ok);
              return;
            }
            S.say('Almost! Look closely at the blueprint cards and try again!');
          }, 750);
        }
      });
    }

    setTimeout(round, 550);
  };
})(typeof window !== 'undefined' ? window : this);
