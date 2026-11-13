/* Treasure Island · Chapter 1 · Stop 1: The Benbow Inn Parlour (Global Reading Unit 1)
   - Grade 3 (Global Readings 2 · Unit 1 "What Does It Do?"):
     Clara Doodle's After-School Invention! Knock on the inn door, inspect the messy room,
     identify `mess`, `plan`, `machine`, `mirror`, and `tidy` as Clara's room-cleaning machine powers up!
   - Grade 4 (Global Readings 3 · Unit 1 "I Love Reading"):
     The Beginning of Alice's Adventures! Knock on the inn door, open the storybook with Alice & Jim,
     and trace `sleepy`, `waistcoat`, `chased`, `fell` (past `shelves`), and Alice's changing feelings (`At first... Then...`). */
(function (root) {
  'use strict';
  var H = root.Harbour;
  if (!H) return;
  var FLAT = 'art/flat/';
  var Z1 = 'art/z1/';
  var A = function () { return root.Ch1Audio || {}; };
  var F = function () { return root.Ch1Feedback || {}; };
  var P = function () { return root.Ch1Progress; };

  var G3 = [
    {
      time: 'afternoon', knock: true, who: 'jim',
      sceneImg: Z1 + 's_mess_room.webp',
      cue: 'Look inside the inn room! Toys and books are everywhere! What is the problem?',
      choices: [
        ['The room is a big mess!', Z1 + 'w_mess.webp', 1],
        ['The room is neat and tidy.', Z1 + 'w_tidy.webp'],
        ['It is a hexagon.', Z1 + 'w_hexagon.webp']
      ],
      reply: 'Yes! A big mess needs a smart solution!'
    },
    {
      time: 'afternoon', who: 'jim',
      sceneImg: Z1 + 's_new_plan.webp',
      cue: 'Clara Doodle wants to invent a helper! What does she draw first?',
      choices: [
        ['First, she draws a plan!', Z1 + 'w_plan.webp', 1],
        ['First, she goes to sleep.', Z1 + 'w_sleep.webp'],
        ['First, she eats lunch.', Z1 + 'w_lunch.webp']
      ],
      reply: 'Brilliant! Every great invention starts with a plan!'
    },
    {
      time: 'evening', who: 'jim',
      sceneImg: Z1 + 's_clara_machine.webp',
      cue: 'Look at Clara\'s new machine! What does it do?',
      choices: [
        ['It cleans the messy room!', Z1 + 's_cleans_floor.webp', 1],
        ['It flies to the moon!', 'art/z2/w_moon.webp'],
        ['It bakes a birthday cake!', FLAT + 'o_cake.webp']
      ],
      reply: 'Whirrr-click! The broom and wheels are spinning!'
    },
    {
      time: 'evening', lightsOn: true, who: 'jim',
      sceneImg: Z1 + 's_try_again.webp',
      cue: 'Uh-oh! The machine bumped the mirror! What does an inventor do?',
      choices: [
        ['Change the plan and try again!', Z1 + 'w_try.webp', 1],
        ['Throw the machine in the sea!', FLAT + 'o_barrel_dock.webp'],
        ['Hide under the bed!', Z1 + 'w_hide.webp']
      ],
      reply: 'That\'s the inventor spirit! Improve it and try again!'
    },
    {
      time: 'night', lightsOn: true, who: 'jim',
      sceneImg: Z1 + 's_tidy_room.webp',
      cue: 'Hooray! Look at the room in the mirror now! How does it look?',
      choices: [
        ['Now the room is clean and tidy!', Z1 + 'w_tidy.webp', 1],
        ['It is still a big mess.', Z1 + 'w_mess.webp'],
        ['It is a parachute.', Z1 + 'w_invent.webp']
      ],
      reply: 'Amazing, Inventor! Clue One is yours!'
    }
  ];

  var G4 = [
    {
      time: 'afternoon', knock: true, door: 'closed', who: 'jim',
      sceneImg: Z1 + 's_alice_sleepy.webp',
      cue: 'Alice sat by the riverbank with a book with no pictures. How did she feel at first?',
      choices: [
        ['At first, she felt sleepy and bored.', Z1 + 'w_sleepy.webp', 1],
        ['At first, she felt scared of sharks.', FLAT + 'o_boat.webp'],
        ['At first, she ran a fast race.', Z1 + 'w_run.webp']
      ],
      reply: 'Yes! At first, Alice felt sleepy on the warm afternoon!', after: 'open'
    },
    {
      time: 'afternoon', who: 'jim',
      sceneImg: Z1 + 's_alice_chase.webp',
      cue: 'Suddenly, a White Rabbit checked a watch in his waistcoat pocket! What did Alice do?',
      choices: [
        ['Then she felt curious and chased him!', Z1 + 'w_chase.webp', 1],
        ['She closed the curtains and slept.', Z1 + 'w_sleep.webp'],
        ['She built a wooden machine.', Z1 + 'w_machine.webp']
      ],
      reply: 'Right! She turned the corner and chased the White Rabbit!'
    },
    {
      time: 'evening', lightsOn: true, who: 'jim',
      sceneImg: Z1 + 's_alice_fall.webp',
      cue: 'Down the rabbit hole Alice fell! What did she pass along the walls?',
      choices: [
        ['She fell slowly past bookshelves and maps!', Z1 + 'w_shelf.webp', 1],
        ['She swam past coral reefs.', 'art/z2/o_fish.webp'],
        ['She rode a bicycle.', Z1 + 's_bicycle.webp']
      ],
      reply: 'Whoa! Cupboards, maps, and bookshelves all the way down!'
    },
    {
      time: 'night', lightsOn: true, flint: true, who: 'jim',
      sceneImg: Z1 + 's_curious_brave.webp',
      cue: 'How did Alice\'s feelings change from the beginning to the rabbit hole?',
      choices: [
        ['From sleepy and bored to curious and brave!', Z1 + 'w_curious.webp', 1],
        ['From hungry to angry.', Z1 + 'w_lunch.webp'],
        ['From cold to freezing.', Z1 + 'w_freeze.webp']
      ],
      reply: 'Super reader! You unlocked Clue One!'
    }
  ];

  H.stops[1] = function (ctx) {
    var g = ctx.grade === 4 ? 4 : 3;
    var rounds = g === 4 ? G4 : G3;
    var i = 0, tries = 0, hints = 0, roundMiss = 0, missed = [], t0 = Date.now(), closed = false;
    var friendArt = g === 4 ? (Z1 + 'c_alice.webp') : (Z1 + 'c_clara.webp');

    var sc = document.createElement('div');
    sc.id = 'hb-scene';
    sc.className = 'hb-scene s1 g' + g;
    sc.innerHTML =
      '<div class="s1-bg"></div>' +
      '<div class="s1-orb"></div><div class="s1-stars"></div>' +
      '<div class="s1-tint"></div><div class="s1-glow"></div><div class="s1-rain"></div>' +
      '<div id="s1-story-frame" style="position:absolute;right:2.5%;top:13%;width:22.5%;aspect-ratio:4/3;z-index:10;border-radius:18px;overflow:hidden;border:3px solid #fbbf24;box-shadow:0 12px 28px rgba(0,0,0,0.65);background:#0f172a;opacity:0;transform:scale(0.88);transition:opacity 0.35s,transform 0.4s cubic-bezier(.17,.89,.32,1.28)">' +
        '<img id="s1-story-img" src="' + rounds[0].sceneImg + '" alt="" style="width:100%;height:100%;object-fit:cover;display:block" draggable="false">' +
      '</div>' +
      '<button type="button" class="s1-door" id="s1-door" aria-label="The inn door"><span class="s1-knock">✊</span></button>' +
      '<div class="s1-jim" id="s1-jim"><img src="' + friendArt + '" onerror="this.src=\'' + FLAT + 'c_jim.webp\'" alt="" draggable="false"></div>' +
      '<div class="s1-flint" id="s1-flint"><img src="' + FLAT + 'c_flint_happy.webp" alt="" draggable="false"></div>' +
      '<div class="s1-cat" id="s1-cat"><img src="' + FLAT + 'c_benbow.webp" alt="" draggable="false"></div>' +
      '<div class="s1-hero" id="s1-hero"><div class="s1-say" id="s1-say"></div>' + ctx.hero(240) + '</div>' +
      '<div class="s1-jimsay" id="s1-jimsay"></div>' +
      '<div class="s1-choices" id="s1-choices"></div>' +
      '<div class="hb-scene-top">' +
        '<button type="button" class="hb-btn" id="s1-close" aria-label="Back to the harbour">✕</button>' +
        '<div class="hb-dots" id="s1-dots"></div>' +
        '<div style="display:flex;gap:8px;align-items:center">' +
          '<button type="button" class="hb-btn" id="s1-star" style="width:auto;padding:0 12px;font-size:0.85em;background:linear-gradient(180deg,#fbbf24,#d97706);color:#060911">⭐ Star</button>' +
          '<button type="button" class="hb-btn" id="s1-again" aria-label="Listen again">🔁</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(sc);
    var $ = function (id) { return document.getElementById(id); };
    requestAnimationFrame(function () { sc.classList.add('in'); });

    $('s1-close').onclick = function () { tap(); end(false); };
    $('s1-again').onclick = function () { tap(); sayCue(rounds[i]); };
    $('s1-star').onclick = function () {
      tap();
      end(false);
      if (root.Chapter1 && root.Chapter1.openClue) {
        setTimeout(function () { root.Chapter1.openClue(1, 'star'); }, 220);
      }
    };

    function tap() { if (A().sfxTap) A().sfxTap(); }
    function say(t, cb) { if (closed) return; if (A().speak) A().speak(t, {}, cb); else if (cb) setTimeout(cb, 700); }
    function dots() {
      var h = '';
      for (var k = 0; k < rounds.length; k++) h += '<i class="' + (k < i ? 'got' : k === i ? 'now' : '') + '"></i>';
      $('s1-dots').innerHTML = h;
    }
    function setTime(r) {
      sc.dataset.time = r.time;
      if (r.lightsOn) sc.classList.add('lit');
      var sf = $('s1-story-frame'), si = $('s1-story-img');
      if (sf && si && r.sceneImg) {
        si.src = r.sceneImg;
      }
    }
    function showStoryCard() {
      var sf = $('s1-story-frame');
      if (sf) { sf.style.opacity = '1'; sf.style.transform = 'scale(1)'; }
    }
    function jimBubble(text) {
      var b = $('s1-jimsay');
      b.textContent = text; b.classList.remove('on'); void b.offsetWidth; b.classList.add('on');
    }
    function heroBubble(text) {
      var b = $('s1-say');
      b.textContent = text; b.classList.remove('on'); void b.offsetWidth; b.classList.add('on');
    }
    function sayCue(r) {
      jimBubble(r.cue);
      say(r.cue);
    }
    function knock() {
      var d = $('s1-door');
      sc.classList.add('knocking');
      d.onclick = function () {
        d.onclick = null;
        sc.classList.remove('knocking');
        knockSound();
        d.classList.add('hit');
        setTimeout(function () {
          openDoor();
          showStoryCard();
          setTimeout(function () { ask(); }, 650);
        }, 700);
      };
      say(g === 4 ? 'Knock on the inn door to meet Alice!' : 'Knock on the inn door to see Clara\'s workshop!');
    }
    function knockSound() {
      try {
        var C = root.AudioContext || root.webkitAudioContext; if (!C) return;
        var ac = knockSound.ac || (knockSound.ac = new C());
        [0, 0.22].forEach(function (dt) {
          [110, 165].forEach(function (f, k) {
            var o = ac.createOscillator(), gn = ac.createGain(), t = ac.currentTime + dt;
            o.type = k ? 'triangle' : 'sine'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 0.6, t + 0.12);
            gn.gain.setValueAtTime(0.0001, t); gn.gain.exponentialRampToValueAtTime(0.35 / (k + 1), t + 0.01); gn.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
            o.connect(gn); gn.connect(ac.destination); o.start(t); o.stop(t + 0.2);
          });
        });
      } catch (e) { /* ignore */ }
    }
    function openDoor() { sc.classList.add('open'); }

    function round() {
      if (closed) return;
      roundMiss = 0;
      var r = rounds[i];
      dots();
      setTime(r);
      $('s1-choices').innerHTML = '';
      $('s1-jimsay').classList.remove('on');
      $('s1-say').classList.remove('on');
      if (r.flint) sc.classList.add('flint-out');
      if (r.knock) { knock(); return; }
      showStoryCard();
      setTimeout(ask, 520);
    }
    function ask() {
      var r = rounds[i];
      sayCue(r);
      setTimeout(function () { showChoices(r); }, 420);
    }
    function showChoices(r) {
      var box = $('s1-choices');
      var list = r.choices.slice().sort(function () { return Math.random() - 0.5; });
      box.innerHTML = list.map(function (c, k) {
        var media = (c[1] && c[1].indexOf('.webp') !== -1)
          ? '<img class="k-cimg" src="' + c[1] + '" alt="" draggable="false">'
          : '<span class="s1-ic">' + (c[1] || '✨') + '</span>';
        return '<button type="button" class="s1-choice" style="--d:' + (k * 90) + 'ms" data-k="' + r.choices.indexOf(c) + '">' +
          media + '<span class="s1-tx">' + c[0] + '</span></button>';
      }).join('');
      [].forEach.call(box.children, function (b) {
        var choiceObj = r.choices[Number(b.dataset.k)];
        if (H.mark) H.mark(b, !!choiceObj[2]);
        b.onclick = function () { pick(r, choiceObj, b); };
      });
    }
    function pick(r, c, btn) {
      if (sc.classList.contains('busy')) return;
      sc.classList.add('busy');
      tap();
      heroBubble(c[0]);
      say(c[0], function () {
        if (c[2]) right(r, btn); else wrong(r, c, btn);
      });
    }
    function right(r, btn) {
      if (A().sfxCorrect) A().sfxCorrect();
      if (A().sfxGear && g === 3) A().sfxGear();
      if (F().sparkleAt) F().sparkleAt(btn, 12);
      btn.classList.add('ok');
      $('s1-choices').classList.add('fade');
      sc.classList.add('happy');
      if (r.after === 'open') openDoor();
      setTimeout(function () {
        jimBubble(r.reply);
        say(r.reply, function () {
          sc.classList.remove('busy', 'happy');
          $('s1-choices').classList.remove('fade');
          i++;
          if (i >= rounds.length) win(); else setTimeout(round, 500);
        });
      }, 260);
    }
    function wrong(r, c, btn) {
      tries++; roundMiss++;
      var good = r.choices.filter(function (x) { return x[2]; })[0][0];
      if (missed.indexOf(good) === -1) missed.push(good);
      if (A().sfxWrong) A().sfxWrong();
      btn.classList.remove('no'); void btn.offsetWidth; btn.classList.add('no');
      sc.classList.add('puzzled');
      setTimeout(function () {
        sc.classList.remove('busy', 'puzzled');
        if (roundMiss >= 2) {
          hints++;
          var gIdx = r.choices.indexOf(r.choices.filter(function (x) { return x[2]; })[0]);
          var gBtn = $('s1-choices').querySelector('[data-k="' + gIdx + '"]');
          if (gBtn) gBtn.classList.add('hint');
          if (A().speakSlow) A().speakSlow(good); else say(good);
        } else {
          say('Almost! Listen and try again!');
        }
      }, 800);
    }

    function win() {
      dots();
      var stars = tries === 0 ? 3 : tries <= 2 ? 2 : 1;
      try {
        if (P()) P().recordClueResult({ clueId: 'g' + g + '_c1', stopNum: 1, grade: g, mode: 'easy', stars: stars, tries: tries, hintsUsed: hints, timeMs: Date.now() - t0, missedItems: missed });
      } catch (e) { /* best effort */ }
      sc.classList.add('won');
      var w = document.createElement('div');
      w.className = 'hb-win';
      w.innerHTML = '<img src="' + FLAT + 'o_map_stamp.webp" alt="" draggable="false"><div class="hb-win-stars">' + '⭐'.repeat(stars) + '<span>' + '⭐'.repeat(3 - stars) + '</span></div>';
      sc.appendChild(w);
      if (A().sfxFanfare) A().sfxFanfare();
      if (F().sparkleAt) F().sparkleAt(w, 24);
      say('Clue one unlocked! Awesome reading, Captain!');
      w.onclick = function () { end(true); };
      setTimeout(function () { end(true); }, 3600);
    }
    function end(solved) {
      if (closed) return;
      closed = true;
      if (A().stopVoice) A().stopVoice();
      sc.classList.remove('in');
      setTimeout(function () { if (sc.parentNode) sc.parentNode.removeChild(sc); }, 350);
      ctx.done({ solved: solved });
    }

    round();
  };
})(typeof window !== 'undefined' ? window : this);
