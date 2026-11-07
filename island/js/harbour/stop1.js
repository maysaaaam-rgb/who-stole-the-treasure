/* Treasure Island · Chapter 1 · Stop 1: The Inn Door
   Grade 3 (greetings): the sky moves from morning to night; greet Jim the right way for the time of day.
   Grade 4 (permission): knock, ask to come in, to go out in the rain, to turn on the light, to open the window.
   Children listen and tap a speech bubble; their monster says it. Pictures and voices, very few words. */
(function (root) {
  'use strict';
  var H = root.Harbour;
  if (!H) return;
  var FLAT = 'art/flat/';
  var A = function () { return root.Ch1Audio || {}; };
  var F = function () { return root.Ch1Feedback || {}; };
  var P = function () { return root.Ch1Progress; };

  var G3 = [
    { time: 'morning', knock: true, cue: 'Look at the sky! What do we say?',
      choices: [['Good morning!', '🌅', 1], ['Good night!', '🌙'], ['Good evening!', '🌆']],
      reply: 'Good morning! How are you?' },
    { time: 'morning', cue: 'How are you?', who: 'jim',
      choices: [["I'm good, thanks!", '😊', 1], ['In the gym.', '🏀'], ['It is a candle.', '🕯️']],
      reply: 'Great! Look, the sun is high now!' },
    { time: 'afternoon', cue: 'Look at the sky! What do we say?',
      choices: [['Good afternoon!', '☀️', 1], ['Good morning!', '🌅'], ['Good night!', '🌙']],
      reply: 'Good afternoon! Nice to meet you!' },
    { time: 'evening', cue: 'Look at the sky! What do we say?',
      choices: [['Good evening!', '🌆', 1], ['Good afternoon!', '☀️'], ['Good morning!', '🌅']],
      reply: 'Good evening! The lanterns are on!' },
    { time: 'night', cue: 'Look at the sky! What do we say?',
      choices: [['Good night!', '🌙', 1], ['Good morning!', '🌅'], ['Good evening!', '🌆']],
      reply: 'Good night! Here is our first clue!' }
  ];
  var G4 = [
    { time: 'afternoon', knock: true, door: 'closed', cue: 'Who is it?', who: 'jim',
      choices: [['Can I come in?', '🚪', 1], ['Close your book.', '📕'], ['Fifty barrels!', '🛢️']],
      reply: 'Yes, you can! Come in!', after: 'open' },
    { time: 'afternoon', rain: true, cue: 'Benbow wants to go out.', pic: 'c_benbow',
      choices: [['Can I go out?', '🌧️', 1], ['Here you are.', '🎁'], ['Look at the board.', '📋']],
      reply: "Sorry, not right now. It's raining!", after: 'stopRain' },
    { time: 'dark', cue: 'Oh no! It is dark!',
      choices: [['Can I turn on the light?', '💡', 1], ['Give me the pencil.', '✏️'], ['Twenty-four gulls.', '🐦']],
      reply: 'Yes, you can!', after: 'lights' },
    { time: 'evening', lightsOn: true, flint: true, cue: 'Look! Flint is at the window!',
      choices: [['Can I open the window?', '🪟', 1], ['Be quiet, please.', '🤫'], ['Sit down, please.', '🪑']],
      reply: 'Sure! Here you are!', after: 'flint' }
  ];

  H.stops[1] = function (ctx) {
    var g = ctx.grade === 4 ? 4 : 3;
    var rounds = g === 4 ? G4 : G3;
    var i = 0, tries = 0, hints = 0, roundMiss = 0, missed = [], t0 = Date.now(), closed = false;

    var sc = document.createElement('div');
    sc.id = 'hb-scene';
    sc.className = 'hb-scene s1 g' + g;
    sc.innerHTML =
      '<div class="s1-bg"></div>' +
      '<div class="s1-orb"></div><div class="s1-stars"></div>' +
      '<div class="s1-tint"></div><div class="s1-glow"></div><div class="s1-rain"></div>' +
      '<button type="button" class="s1-door" id="s1-door" aria-label="The inn door"><span class="s1-knock">✊</span></button>' +
      '<div class="s1-jim" id="s1-jim"><img src="' + FLAT + 'c_jim.webp" alt="Jim" draggable="false"></div>' +
      '<div class="s1-flint" id="s1-flint"><img src="' + FLAT + 'c_flint_happy.webp" alt="" draggable="false"></div>' +
      '<div class="s1-cat" id="s1-cat"><img src="' + FLAT + 'c_benbow.webp" alt="" draggable="false"></div>' +
      '<div class="s1-hero" id="s1-hero"><div class="s1-say" id="s1-say"></div>' + ctx.hero(240) + '</div>' +
      '<div class="s1-jimsay" id="s1-jimsay"></div>' +
      '<div class="s1-choices" id="s1-choices"></div>' +
      '<div class="hb-scene-top">' +
        '<button type="button" class="hb-btn" id="s1-close" aria-label="Back to the harbour">✕</button>' +
        '<div class="hb-dots" id="s1-dots"></div>' +
        '<button type="button" class="hb-btn" id="s1-again" aria-label="Listen again">🔁</button>' +
      '</div>';
    document.body.appendChild(sc);
    var $ = function (id) { return document.getElementById(id); };
    requestAnimationFrame(function () { sc.classList.add('in'); });

    $('s1-close').onclick = function () { tap(); end(false); };
    $('s1-again').onclick = function () { tap(); sayCue(rounds[i]); };

    function tap() { if (A().sfxTap) A().sfxTap(); }
    function say(t, cb) { if (closed) return; if (A().speak) A().speak(t, {}, cb); else if (cb) setTimeout(cb, 700); }
    function dots() {
      var h = '';
      for (var k = 0; k < rounds.length; k++) h += '<i class="' + (k < i ? 'got' : k === i ? 'now' : '') + '"></i>';
      $('s1-dots').innerHTML = h;
    }
    function setTime(r) {
      sc.dataset.time = r.time;
      sc.classList.toggle('raining', !!r.rain);
      if (r.lightsOn) sc.classList.add('lit');
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
      if (r.who === 'jim') jimBubble(r.cue);
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
          if (g === 3) { openDoor(); setTimeout(function () { ask(); }, 700); }
          else ask();   // Grade 4: Jim answers from behind the closed door
        }, 900);
      };
      say('Knock on the door!');
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
      } catch (e) { /* the knock is a bonus */ }
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
      setTimeout(ask, r.time !== (rounds[i - 1] || {}).time ? 1300 : 500);
    }
    function ask() {
      var r = rounds[i];
      sayCue(r);
      setTimeout(function () { showChoices(r); }, 450);
    }
    function showChoices(r) {
      var box = $('s1-choices');
      var list = r.choices.slice().sort(function () { return Math.random() - 0.5; });
      box.innerHTML = list.map(function (c, k) {
        return '<button type="button" class="s1-choice" style="--d:' + (k * 90) + 'ms" data-k="' + r.choices.indexOf(c) + '">' +
          '<span class="s1-ic">' + c[1] + '</span><span class="s1-tx">' + c[0] + '</span></button>';
      }).join('');
      [].forEach.call(box.children, function (b) {
        b.onclick = function () { pick(r, r.choices[Number(b.dataset.k)], b); };
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
      if (F().sparkleAt) F().sparkleAt(btn, 12);
      btn.classList.add('ok');
      $('s1-choices').classList.add('fade');
      sc.classList.add('happy');
      if (r.after === 'open') openDoor();
      if (r.after === 'lights') sc.classList.add('lit');
      setTimeout(function () {
        jimBubble(r.reply);
        say(r.reply, function () {
          if (r.after === 'stopRain') sc.classList.remove('raining');
          if (r.after === 'flint') sc.classList.add('flint-in');
          sc.classList.remove('busy', 'happy');
          $('s1-choices').classList.remove('fade');
          i++;
          if (i >= rounds.length) setTimeout(win, r.after === 'flint' ? 1400 : 500);
          else setTimeout(round, 600);
        });
      }, 350);
    }
    function wrong(r, c, btn) {
      tries++; roundMiss++;
      if (missed.indexOf(r.choices.filter(function (x) { return x[2]; })[0][0]) === -1) missed.push(r.choices.filter(function (x) { return x[2]; })[0][0]);
      if (A().sfxWrong) A().sfxWrong();
      btn.classList.add('no');
      sc.classList.add('puzzled');
      setTimeout(function () {
        btn.classList.remove('no');
        sc.classList.remove('puzzled', 'busy');
        if (roundMiss >= 2) {
          hints++;
          var good = $('s1-choices').querySelector('[data-k="' + r.choices.findIndex(function (x) { return x[2]; }) + '"]');
          if (good) good.classList.add('hint');
          var right = r.choices.filter(function (x) { return x[2]; })[0][0];
          if (A().speakSlow) A().speakSlow(right); else say(right);
        } else {
          say('Hmm? Try again!');
        }
      }, 900);
    }
    function win() {
      var stars = tries === 0 ? 3 : tries <= 2 ? 2 : 1;
      try {
        if (P()) P().recordClueResult({ clueId: 'g' + g + '_c1', stopNum: 1, grade: g, mode: 'easy', stars: stars, tries: tries, hintsUsed: hints, timeMs: Date.now() - t0, missedItems: missed });
      } catch (e) { /* progress is best effort */ }
      dots();
      sc.classList.add('won');
      var w = document.createElement('div');
      w.className = 'hb-win';
      w.innerHTML = '<img src="' + FLAT + 'o_map_stamp.webp" alt="" draggable="false"><div class="hb-win-stars">' +
        '⭐'.repeat(stars) + '<span>' + '⭐'.repeat(3 - stars) + '</span></div>';
      sc.appendChild(w);
      if (A().sfxFanfare) A().sfxFanfare();
      if (F().sparkleAt) F().sparkleAt(w, 24);
      say('Clue one! Well done, Captain!');
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

    setTimeout(round, 500);
  };
})(typeof window !== 'undefined' ? window : this);
