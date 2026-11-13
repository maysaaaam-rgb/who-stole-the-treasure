/* Treasure Island · Chapter 1 · scene kit shared by the stop adventures (stops 2 to 5).
   A full-screen 16:9 scene with: a background (a painted scene from Gemini when it exists, otherwise a close-up of
   the harbour painting), the child's monster, Benbow, a helper character, speech bubbles, big answer bubbles,
   progress dots, gentle hints after two wrong tries, and the stamp reward. */
(function (root) {
  'use strict';
  var H = root.Harbour;
  if (!H) return;
  var FLAT = 'art/flat/';
  var A = function () { return root.Ch1Audio || {}; };
  var F = function () { return root.Ch1Feedback || {}; };
  var P = function () { return root.Ch1Progress; };

  // Painted scenes from Gemini (art/ch1/<name>.webp). Listed here when they have been added.
  H.ART = H.ART || ['bg_s2_board', 'bg_s3_deck', 'bg_s4_lookout', 'bg_s5_dock', 'o_wheel_big', 'o_dial_lock'];
  // Close-ups of the harbour painting (1376x768) used until then: [left, top, width] in picture pixels
  var ZOOM = {
    board: [0, 300, 560], deck: [880, 120, 480], lookout: [420, 150, 956], dock: [470, 380, 560], harbour: [0, 0, 1376]
  };
  function bgCss(name, zoom) {
    if (H.ART.indexOf(name) !== -1) return 'background:url(art/ch1/' + name + '.webp) center/cover no-repeat;';
    var z = ZOOM[zoom] || ZOOM.harbour, w = z[2], h = w * 9 / 16;
    var size = (1376 / w * 100).toFixed(2) + '% auto';
    var px = 1376 - w > 0 ? (z[0] / (1376 - w) * 100).toFixed(2) + '%' : '50%';
    var py = 768 - h > 0 ? (Math.min(z[1], 768 - h) / (768 - h) * 100).toFixed(2) + '%' : '50%';
    return 'background:url(art/bg_benbow.webp) ' + px + ' ' + py + '/' + size + ' no-repeat;';
  }
  H.hasArt = function (n) { return H.ART.indexOf(n) !== -1; };

  // opts: { stop, cls, bg: [geminiName, zoomKey], npc: {art, name}, rounds }
  H.scene = function (ctx, opts) {
    var S = { tries: 0, hints: 0, missed: [], t0: Date.now(), closed: false, i: 0, n: opts.rounds || 1 };
    var sc = document.createElement('div');
    sc.id = 'hb-scene';
    sc.className = 'hb-scene kit ' + (opts.cls || '');
    var npc = opts.npc || { art: 'c_jim', name: 'Jim' };
    var npcSrc = npc.src || (FLAT + npc.art + '.webp');
    sc.innerHTML =
      '<div class="k-bg" style="' + bgCss(opts.bg[0], opts.bg[1]) + '"></div>' +
      '<div class="k-play" id="k-play"></div>' +
      '<div class="k-npc" id="k-npc"><img src="' + npcSrc + '" alt="' + npc.name + '" draggable="false"></div>' +
      '<div class="k-cat"><img src="' + FLAT + 'c_benbow.webp" alt="" draggable="false"></div>' +
      '<div class="k-hero" id="k-hero"><div class="s1-say" id="k-say"></div>' + ctx.hero(240) + '</div>' +
      '<div class="s1-jimsay k-npcsay" id="k-npcsay"></div>' +
      '<div class="s1-choices k-choices" id="k-choices"></div>' +
      '<div class="hb-scene-top">' +
        '<button type="button" class="hb-btn" id="k-close" aria-label="Back to the harbour">✕</button>' +
        '<div class="hb-dots" id="k-dots"></div>' +
        '<div style="display:flex;gap:8px;align-items:center">' +
          '<button type="button" class="hb-btn" id="k-star" title="Play Star Speaking &amp; Word Order Challenge" style="width:auto;padding:0 12px;font-size:0.85em;background:linear-gradient(180deg,#fbbf24,#d97706);color:#060911">⭐ Star</button>' +
          '<button type="button" class="hb-btn" id="k-again" aria-label="Listen again">🔁</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(sc);
    requestAnimationFrame(function () { sc.classList.add('in'); });
    S.el = sc;
    S.$ = function (q) { return sc.querySelector(q); };
    S.play = S.$('#k-play');
    S.replay = null;   // set by the stop: what 🔁 says again

    S.tap = function () { if (A().sfxTap) A().sfxTap(); };
    S.say = function (t, cb) { if (S.closed) return; if (A().speak) A().speak(t, {}, function () { if (!S.closed && cb) cb(); }); else if (cb) setTimeout(cb, 700); };
    S.sayList = function (list, cb) { var k = 0; (function nx() { if (k >= list.length) { if (cb) cb(); return; } S.say(list[k++], nx); })(); };
    S.slow = function (t) { if (A().speakSlow) A().speakSlow(t); else S.say(t); };
    S.dots = function () {
      var h = '';
      for (var k = 0; k < S.n; k++) h += '<i class="' + (k < S.i ? 'got' : k === S.i ? 'now' : '') + '"></i>';
      S.$('#k-dots').innerHTML = h;
    };
    function pop(el, text) { el.textContent = text; el.classList.remove('on'); void el.offsetWidth; el.classList.add('on'); }
    S.npcSay = function (text) { pop(S.$('#k-npcsay'), text); };
    S.heroSay = function (text) { pop(S.$('#k-say'), text); };
    S.quiet = function () { S.$('#k-npcsay').classList.remove('on'); S.$('#k-say').classList.remove('on'); S.$('#k-choices').innerHTML = ''; };
    S.mood = function (m) { sc.classList.remove('happy', 'puzzled'); void sc.offsetWidth; if (m) sc.classList.add(m); setTimeout(function () { sc.classList.remove(m); }, 900); };
    S.right = function (el) {
      if (A().sfxCorrect) A().sfxCorrect();
      if (el && F().sparkleAt) F().sparkleAt(el, 12);
      S.mood('happy');
    };
    S.wrong = function (el, rightText) {
      S.tries++;
      if (rightText && S.missed.indexOf(rightText) === -1) S.missed.push(rightText);
      if (A().sfxWrong) A().sfxWrong();
      if (el) { el.classList.remove('no'); void el.offsetWidth; el.classList.add('no'); }
      S.mood('puzzled');
    };

    /* Answer bubbles. list: [{t: text, ic: emoji, img: picture, ok: true, say: what is spoken}] */
    S.choices = function (list, onRight, o) {
      o = o || {};
      var box = S.$('#k-choices'), miss = 0, busy = false;
      var shuffled = list.slice().sort(function () { return Math.random() - 0.5; });
      box.className = 's1-choices k-choices' + (o.cls ? ' ' + o.cls : '');
      box.innerHTML = shuffled.map(function (c, k) {
        return '<button type="button" class="s1-choice" style="--d:' + (k * 90) + 'ms" data-k="' + list.indexOf(c) + '">' +
          (c.img ? '<img class="k-cimg" src="' + c.img + '" alt="" draggable="false">' : '<span class="s1-ic">' + (c.ic || '') + '</span>') +
          (c.t ? '<span class="s1-tx">' + c.t + '</span>' : '') + '</button>';
      }).join('');
      var good = list.filter(function (c) { return c.ok; })[0];
      [].forEach.call(box.children, function (b) { H.mark(b, list[Number(b.dataset.k)].ok); });
      [].forEach.call(box.children, function (b) {
        b.onclick = function () {
          if (busy || S.closed) return;
          busy = true;
          S.tap();
          var c = list[Number(b.dataset.k)];
          var spoken = c.say || c.t;
          if (o.heroSays !== false && spoken) S.heroSay(c.t || spoken);
          S.say(spoken, function () {
            if (c.ok) {
              S.right(b); b.classList.add('ok'); box.classList.add('fade');
              setTimeout(function () { box.classList.remove('fade'); onRight(b); }, 450);
            } else {
              S.wrong(b, good && (good.t || good.say));
              miss++;
              setTimeout(function () {
                busy = false;
                if (miss >= 2 && good) {
                  S.hints++;
                  var gb = box.querySelector('[data-k="' + list.indexOf(good) + '"]');
                  if (gb) gb.classList.add('hint');
                  S.slow(good.say || good.t);
                } else S.say('Try again!');
              }, 800);
            }
          });
        };
      });
    };

    /* Tap targets placed on the scene (pictures pinned on a board, things on a crate, hidden things...).
       items: [{id, img|ic, x, y, w (percent), label}] → returns the elements */
    S.things = function (items, cls) {
      return items.map(function (it) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'k-thing ' + (cls || '');
        b.style.left = it.x + '%'; b.style.top = it.y + '%'; b.style.width = (it.w || 12) + '%';
        b.dataset.id = it.id;
        b.setAttribute('aria-label', it.label || it.id);
        b.innerHTML = it.img ? '<img src="' + it.img + '" alt="" draggable="false">' : '<span>' + it.ic + '</span>';
        S.play.appendChild(b);
        return b;
      });
    };

    S.next = function (fn) { S.i++; S.dots(); if (S.i >= S.n) setTimeout(S.win, 600); else setTimeout(fn, 650); };

    S.win = function (line) {
      if (S.closed) return;
      var stars = S.tries === 0 ? 3 : S.tries <= 2 ? 2 : 1;
      try {
        if (P()) P().recordClueResult({ clueId: 'g' + ctx.grade + '_c' + opts.stop, stopNum: opts.stop, grade: ctx.grade, mode: 'easy', stars: stars, tries: S.tries, hintsUsed: S.hints, timeMs: Date.now() - S.t0, missedItems: S.missed });
      } catch (e) { /* best effort */ }
      sc.classList.add('won');
      var w = document.createElement('div');
      w.className = 'hb-win';
      w.innerHTML = '<img src="' + FLAT + 'o_map_stamp.webp" alt="" draggable="false"><div class="hb-win-stars">' + '⭐'.repeat(stars) + '<span>' + '⭐'.repeat(3 - stars) + '</span></div>';
      sc.appendChild(w);
      if (A().sfxFanfare) A().sfxFanfare();
      if (F().sparkleAt) F().sparkleAt(w, 24);
      var names = ['', 'one', 'two', 'three', 'four', 'five'];
      S.say(line || ('Clue ' + names[opts.stop] + '! Well done, Captain!'));
      w.onclick = function () { S.end(true); };
      setTimeout(function () { S.end(true); }, 3800);
    };
    S.end = function (solved) {
      if (S.closed) return;
      S.closed = true;
      if (A().stopVoice) A().stopVoice();
      sc.classList.remove('in');
      setTimeout(function () { if (sc.parentNode) sc.parentNode.removeChild(sc); }, 350);
      ctx.done({ solved: solved });
    };
    S.$('#k-close').onclick = function () { S.tap(); S.end(false); };
    S.$('#k-again').onclick = function () { S.tap(); if (S.replay) S.replay(); };
    if (S.$('#k-star')) {
      S.$('#k-star').onclick = function () {
        S.tap();
        S.end(false);
        if (root.Chapter1 && root.Chapter1.openClue) {
          setTimeout(function () { root.Chapter1.openClue(opts.stop, 'star'); }, 220);
        }
      };
    }
    S.dots();
    return S;
  };

  H.mark = function (el, ok) { if (root.__HB_TEST && el) el.dataset.ok = ok ? '1' : '0'; };
  H.shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
})(typeof window !== 'undefined' ? window : this);
