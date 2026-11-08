/* The Magic Book — 3D pop-up scenes.
   Tap ✨ on a real page: the book tips back, the picture rises off the paper in layers like a pop-up book,
   characters step out and move, and the class can turn the scene, tap things for words, solve the page's
   exercises on a sign inside the scene, and play two mini games. 📖 folds it back into the real page.
   Art is Gemini's original art (public, in magic-book/art). Textbook pages stay private. */
(function () {
  'use strict';

  var ART = 'art/';
  // Each scene covers a run of pages. x, y = where the character stands on the open book (% of width / height).
  // h = height of the character (% of page height). Bigger y = nearer the front.
  var SCENES = {
    g3: [
      {
        pages: [72, 73, 74, 75], bg: 'bg_g3_bedroom', title: "Jannah's bedroom",
        actors: [
          { id: 'jannah', img: 'c_g3_jannah', x: 34, y: 84, h: 58, word: 'Jannah', line: "Hi! I'm Jannah. I love reading!", anim: 'breathe', hero: true },
          { id: 'book', img: 'o_g3_timebook', x: 70, y: 90, h: 30, word: 'book', line: 'What is this strange old book?', anim: 'glow' }
        ]
      },
      {
        pages: [76, 77, 78, 79, 80, 81], bg: 'bg_g3_egypt_street', title: 'An ancient city',
        actors: [
          { id: 'chariot', img: 'o_g3_chariot', x: 30, y: 64, h: 40, word: 'chariot', line: 'Look! The pharaoh is in his chariot!', anim: 'roll' },
          { id: 'woman', img: 'c_g3_oldwoman', x: 68, y: 82, h: 54, word: 'old woman', line: "I can't see very well.", anim: 'squint' },
          { id: 'jannah', img: 'c_g3_jannah', x: 42, y: 95, h: 52, word: 'Jannah', line: 'Try my glasses!', anim: 'breathe', hero: true }
        ]
      },
      {
        pages: [82, 83, 84, 85, 86, 87], bg: 'bg_g3_garden_dig', title: 'A time capsule',
        actors: [
          { id: 'capsule', img: 'o_g3_timecapsule', x: 56, y: 80, h: 34, word: 'time capsule', line: 'A present from the past!', anim: 'glow' },
          { id: 'jannah', img: 'c_g3_jannah', x: 24, y: 95, h: 52, word: 'Jannah', line: "Let's dig and find it!", anim: 'breathe', hero: true }
        ]
      }
    ],
    g4: [
      {
        pages: [72, 73, 74, 75, 76, 77, 78, 79, 80, 81], bg: 'bg_g4_studio', title: 'A movie sound studio',
        actors: [
          { id: 'maya', img: 'c_g4_maya', x: 36, y: 92, h: 58, word: 'sound artist', line: 'I make sounds for movies!', anim: 'breathe', hero: true },
          { id: 'props', img: 'o_g4_soundprops', x: 70, y: 86, h: 32, word: 'objects', line: 'Boots, keys and paper make great sounds!', anim: 'shake' }
        ]
      },
      {
        pages: [82, 83, 84, 85, 86, 87], bg: 'bg_g4_stage', title: 'The concert stage',
        actors: [
          { id: 'drum', img: 'o_g4_bigdrum', x: 66, y: 82, h: 38, word: 'drum', line: 'Boom! Boom! Can you feel it?', anim: 'pulse' },
          { id: 'lina', img: 'c_g4_lina', x: 36, y: 94, h: 58, word: 'drummer', line: 'I feel the music with my feet!', anim: 'breathe', hero: true }
        ]
      }
    ]
  };

  var POSE = { rx: 54, ry: 0, up: 54 };   // book tilt in the scene, and how far the layers stand up
  var MB, S, cur = null, pop = null, layers = [], timers = [], game = null, orbit = null;
  var $ = function (id) { return document.getElementById(id); };
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function norm(s) { return String(s).replace(/\s+/g, ' ').trim().toLowerCase(); }

  function sceneFor() {
    var list = (SCENES[S.g] || []), vis = MB.visiblePages().map(function (p) { return p.page; });
    return list.find(function (sc) { return vis.some(function (n) { return sc.pages.indexOf(n) >= 0; }); }) || null;
  }

  /* ---------------- UI pieces ---------------- */
  function buildUI() {
    var rr = document.querySelector('#ribbon .rb-right');
    var life = el('button', 'rb-btn life-btn', '✨ Bring to life'); life.id = 'btn-life';
    life.onclick = function () { open(); };
    rr.insertBefore(life, rr.firstChild);

    var badge = el('button', 'life-badge', '✨<span>Tap to bring the page to life!</span>'); badge.id = 'life-badge';
    badge.onclick = function () { open(); };
    $('stage').appendChild(badge);

    var bar = el('div', 'scene-bar'); bar.id = 'scene-bar'; bar.hidden = true;
    bar.innerHTML =
      '<button class="sb-btn back" id="sb-back">📖 Back to the page</button>' +
      '<span class="sb-title" id="sb-title"></span>' +
      '<button class="sb-btn" id="sb-ex">✍️ Exercises</button>' +
      '<button class="sb-btn" id="sb-listen">🎧 Listen &amp; tap</button>' +
      '<button class="sb-btn" id="sb-stars">⭐ Find the stars</button>';
    $('book-view').appendChild(bar);
    $('sb-back').onclick = function () { close(); };
    $('sb-ex').onclick = function () { startExercises(); };
    $('sb-listen').onclick = function () { startListen(); };
    $('sb-stars').onclick = function () { startStars(); };

    var task = el('div', 'scene-task'); task.id = 'scene-task'; task.hidden = true;
    $('book-view').appendChild(task);
    var bub = el('div', 'scene-bubble'); bub.id = 'scene-bubble'; bub.hidden = true;
    $('book-view').appendChild(bub);

    // turn the scene by dragging
    var st = $('stage');
    st.addEventListener('pointerdown', function (e) {
      if (!S.scene || e.target.closest('.chip,.life-badge,.turn-arrow')) return;
      orbit = { x: e.clientX, y: e.clientY, rx: POSE.rx, ry: POSE.ry, moved: false };
    });
    addEventListener('pointermove', function (e) {
      if (!orbit) return;
      var dx = e.clientX - orbit.x, dy = e.clientY - orbit.y;
      if (!orbit.moved && Math.abs(dx) + Math.abs(dy) < 8) return;
      orbit.moved = true;
      POSE.ry = Math.max(-38, Math.min(38, orbit.ry + dx * .12));
      POSE.rx = Math.max(32, Math.min(68, orbit.rx - dy * .1));
      applyPose(false);
      hideBubble();
    });
    addEventListener('pointerup', function () { if (orbit) { var m = orbit.moved; setTimeout(function () { orbit = null; }, 0); if (m) orbit.justMoved = true; } });

    // preload the art
    Object.keys(SCENES).forEach(function (g) {
      SCENES[g].forEach(function (sc) { [sc.bg].concat(sc.actors.map(function (a) { return a.img; })).forEach(function (n) { var i = new Image(); i.src = ART + n + '.webp'; }); });
    });
  }

  function onSpread() {
    if (!MB) return;
    var has = !!sceneFor() && !S.scene;
    var b = $('btn-life'), g = $('life-badge');
    if (b) b.classList.toggle('empty', !has);
    if (g) g.hidden = !has || S.busy;
  }

  /* ---------------- the 3D pose of the book ---------------- */
  function bookBox() { var b = $('book'); return { w: b.offsetWidth, h: b.offsetHeight }; }
  function applyPose(slow) {
    var b = $('book'), bx = bookBox();
    b.style.transition = slow ? 'transform 1.1s cubic-bezier(.3,.8,.3,1)' : 'transform .08s linear';
    var drop = bx.h * .22;
    b.style.transform = 'translateY(' + drop + 'px) scale(.74) rotateX(' + POSE.rx + 'deg) rotateY(' + POSE.ry + 'deg)';
    // the cut-outs keep facing the class while the book turns underneath them
    if (pop) [].forEach.call(pop.querySelectorAll('.lyr.up'), function (L) { if (!L.classList.contains('got')) stand(L, POSE.rx); });
  }

  /* ---------------- build the pop-up layers ---------------- */
  function layer(cls, x, y, hPct, inner) {
    var bx = bookBox();
    var L = el('div', 'lyr ' + cls);
    L.style.left = (x / 100 * bx.w) + 'px';
    L.style.top = (y / 100 * bx.h) + 'px';
    L.style.height = (hPct / 100 * bx.h) + 'px';
    if (inner) L.appendChild(inner);
    L.style.transform = 'translate(-50%,-100%) rotateX(0deg)';
    pop.appendChild(L);
    return L;
  }
  function stand(L, deg) { L.style.transform = 'translate(-50%,-100%) rotateX(' + (-(deg == null ? POSE.rx : deg)) + 'deg)'; }

  function build(sc) {
    pop = el('div', 'popup'); pop.id = 'popup';
    $('book').appendChild(pop);
    layers = [];
    var bx = bookBox();
    // the backdrop: a big painted card at the back edge of the book
    var bg = el('div', 'bgcard'); bg.style.backgroundImage = 'url("' + ART + sc.bg + '.webp")';
    var B = layer('lyr-bg', 50, 10, 86, bg);
    B.style.width = (bx.w * 1.02) + 'px';
    layers.push({ el: B, deg: POSE.up, delay: 0 });
    // little ground details so it feels like paper scenery
    sc.actors.forEach(function (a, i) {
      var img = el('img', 'act anim-' + (a.anim || 'breathe')); img.src = ART + a.img + '.webp'; img.alt = a.word; img.draggable = false;
      img.style.animationDelay = (-Math.random() * 3).toFixed(2) + 's';
      var L = layer('lyr-act', a.x, a.y, a.h, img);
      L.dataset.id = a.id;
      L.addEventListener('click', function (e) {
        if (orbit && orbit.justMoved) return;
        e.stopPropagation(); tapActor(a, L);
      });
      a._el = L; a._img = img;
      layers.push({ el: L, deg: POSE.up, delay: 380 + i * 260, actor: a });
    });
  }

  /* ---------------- open / close ---------------- */
  function open() {
    if (S.scene || S.busy) return;
    var sc = sceneFor(); if (!sc) return;
    MB.stopRead(); MB.setTool(null); MB.resetZoom();
    cur = sc; S.scene = true; game = null;
    POSE.rx = 54; POSE.ry = 0;
    $('book-view').classList.add('scene-on');
    $('scene-bar').hidden = false; $('life-badge').hidden = true;
    $('sb-title').textContent = sc.title;
    build(sc);
    applyPose(true);
    MB.swish();
    layers.forEach(function (Lr, i) {
      later(function () {
        Lr.el.classList.add('up'); stand(Lr.el);
        popSound(i);
      }, 520 + Lr.delay);
    });
    var hero = sc.actors.find(function (a) { return a.hero; }) || sc.actors[0];
    later(function () { comeOut(hero); }, 520 + 380 + sc.actors.length * 260 + 700);
  }

  function comeOut(a) {
    if (!a || !a._el) return;
    var bx = bookBox();
    a._el.classList.add('walk');
    a._el.style.top = (Math.min(99, a.y + 6) / 100 * bx.h) + 'px';
    later(function () { a._el.classList.remove('walk'); hop(a); talk(a, a.line); }, 900);
  }

  function close(instant) {
    if (!S.scene) return;
    clearTimers(); endGame(); hideBubble();
    var b = $('book');
    var finish = function () {
      if (pop) pop.remove(); pop = null; layers = []; cur = null;
      S.scene = false;
      $('book-view').classList.remove('scene-on');
      $('scene-bar').hidden = true; $('scene-task').hidden = true;
      b.style.transition = 'transform .9s cubic-bezier(.3,.8,.3,1)';
      MB.composeBook();
      setTimeout(function () { b.style.transition = ''; onSpread(); }, 950);
    };
    if (instant) { finish(); return; }
    layers.slice().reverse().forEach(function (Lr, i) {
      setTimeout(function () { Lr.el.classList.remove('up'); Lr.el.style.transform = 'translate(-50%,-100%) rotateX(0deg)'; }, i * 120);
    });
    MB.swish();
    setTimeout(finish, layers.length * 120 + 650);
  }

  /* ---------------- characters ---------------- */
  function hop(a) {
    if (!a._img) return;
    a._img.classList.remove('hop'); void a._img.offsetWidth; a._img.classList.add('hop');
  }
  function talk(a, text) {
    showBubble(a._el, text);
    MB.say(text, { rate: .9, end: function () { later(hideBubble, 900); } });
  }
  function tapActor(a, L) {
    if (game && game.kind === 'listen') return game.pick(a);
    hop(a); MB.chime(true);
    showBubble(L, '<b class="bw">' + MB.esc(a.word) + '</b>');
    MB.say(a.word, { rate: .75, end: function () { later(function () { talk(a, a.line); }, 250); } });
  }
  function showBubble(target, html) {
    var r = target.getBoundingClientRect(), bub = $('scene-bubble');
    bub.innerHTML = html; bub.hidden = false;
    var bw = bub.offsetWidth;
    bub.style.left = Math.max(8, Math.min(innerWidth - bw - 8, r.left + r.width / 2 - bw / 2)) + 'px';
    bub.style.top = Math.max(60, r.top - bub.offsetHeight - 10) + 'px';
  }
  function hideBubble() { $('scene-bubble').hidden = true; }

  function popSound(i) {
    try {
      var ac = (window.__mbAC = window.__mbAC || new (window.AudioContext || window.webkitAudioContext)());
      var o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
      o.type = 'triangle'; o.frequency.setValueAtTime(392 * Math.pow(1.26, i), t);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.12, t + .02); g.gain.exponentialRampToValueAtTime(.001, t + .3);
      o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + .32);
    } catch (e) { /* no sound */ }
  }

  /* ---------------- task banner + chips ---------------- */
  function task(html) { var t = $('scene-task'); t.innerHTML = html; t.hidden = !html; }
  function endGame() {
    if (game && game.cleanup) game.cleanup();
    game = null; task('');
    ['sb-ex', 'sb-listen', 'sb-stars'].forEach(function (id) { $(id).classList.remove('on'); });
  }
  function celebrate(msg) {
    MB.chime(true); MB.toast(msg);
    var bx = bookBox();
    for (var i = 0; i < 14; i++) {
      var s = el('div', 'spark', ['⭐', '✨', '🌟'][i % 3]);
      s.style.left = (20 + Math.random() * 60) + '%'; s.style.top = (30 + Math.random() * 30) + '%';
      s.style.setProperty('--dx', ((Math.random() - .5) * 400).toFixed(0) + 'px');
      s.style.setProperty('--dy', (-120 - Math.random() * 260).toFixed(0) + 'px');
      $('stage').appendChild(s); (function (n) { setTimeout(function () { n.remove(); }, 1400); })(s);
    }
  }

  /* ---------- 1. the page's exercises on a sign inside the scene ---------- */
  function startExercises() {
    endGame();
    var items = MB.exItems();
    if (!items.length) { MB.toast('No exercises on these pages'); return; }
    $('sb-ex').classList.add('on');
    var sign = el('div', 'sign', '<div class="sign-q"></div><div class="sign-slot">Drop the answer here</div>');
    var L = layer('lyr-sign', 50, 93, 26, sign);
    L.style.width = (bookBox().w * .6) + 'px';
    setTimeout(function () { L.classList.add('up'); stand(L); }, 30);
    var i = items.findIndex(function (it) { return !S.solved[it.solveId]; }); if (i < 0) i = 0;
    var dragging = null;
    game = {
      kind: 'ex',
      cleanup: function () { L.classList.remove('up'); L.style.transform = 'translate(-50%,-100%) rotateX(0deg)'; setTimeout(function () { L.remove(); }, 600); if (dragging) dragging.ghost.remove(); }
    };
    function show() {
      var it = items[i];
      sign.querySelector('.sign-q').textContent = it.prompt;
      var slot = sign.querySelector('.sign-slot'); slot.textContent = 'Drop the answer here'; slot.className = 'sign-slot';
      var opts = it.opts.length ? shuffle(it.opts) : [it.correct];
      task('<span class="tk-num">' + (i + 1) + '/' + items.length + '</span>' +
        opts.map(function (o) { return '<button class="chip">' + MB.esc(o) + '</button>'; }).join('') +
        '<button class="tk-say" title="Read the question">🔊</button>');
      $('scene-task').querySelector('.tk-say').onclick = function () { MB.say(it.prompt); };
      [].forEach.call($('scene-task').querySelectorAll('.chip'), function (c) {
        c.addEventListener('pointerdown', function (e) { startDrag(e, c, it); });
      });
      MB.say(it.prompt);
    }
    function startDrag(e, chip, it) {
      e.preventDefault();
      var r = chip.getBoundingClientRect();
      var ghost = chip.cloneNode(true); ghost.classList.add('ghost');
      ghost.style.left = r.left + 'px'; ghost.style.top = r.top + 'px'; ghost.style.width = r.width + 'px';
      document.body.appendChild(ghost);
      dragging = { ghost: ghost, chip: chip, it: it, ox: e.clientX - r.left, oy: e.clientY - r.top, x0: e.clientX, y0: e.clientY };
      chip.style.visibility = 'hidden';
      var mv = function (ev) { ghost.style.left = (ev.clientX - dragging.ox) + 'px'; ghost.style.top = (ev.clientY - dragging.oy) + 'px'; };
      var up = function (ev) {
        removeEventListener('pointermove', mv); removeEventListener('pointerup', up);
        var sr = sign.getBoundingClientRect();
        var onSign = ev.clientX > sr.left && ev.clientX < sr.right && ev.clientY > sr.top - 30 && ev.clientY < sr.bottom + 30;
        var tapped = Math.abs(ev.clientX - dragging.x0) + Math.abs(ev.clientY - dragging.y0) < 8;
        ghost.remove(); chip.style.visibility = ''; dragging = null;
        if (onSign || tapped) check(chip, it);
      };
      addEventListener('pointermove', mv); addEventListener('pointerup', up);
    }
    function check(chip, it) {
      var slot = sign.querySelector('.sign-slot');
      if (norm(chip.textContent) === norm(it.correct)) {
        slot.textContent = it.correct; slot.className = 'sign-slot ok';
        chip.classList.add('right');
        if (!S.solved[it.solveId]) { S.solved[it.solveId] = 1; MB.store('mb-solved-' + S.g + '-' + S.cls, S.solved); MB.drawMarks(); MB.updateExCount(); }
        celebrate('⭐ Great job!');
        MB.say(it.correct, { rate: .9 });
        later(function () {
          if (!game || game.kind !== 'ex') return;
          if (i < items.length - 1) { i++; show(); }
          else { task('<span class="tk-done">🎉 All the exercises are done!</span>'); }
        }, 2000);
      } else {
        chip.classList.remove('wrong'); void chip.offsetWidth; chip.classList.add('wrong');
        MB.chime(false);
        slot.textContent = it.hint ? '💡 ' + it.hint : 'Try again!'; slot.className = 'sign-slot hint';
      }
    }
    show();
  }

  /* ---------- 2. Listen & tap ---------- */
  function startListen() {
    endGame();
    var acts = cur.actors.slice();
    if (acts.length < 2) return;
    $('sb-listen').classList.add('on');
    var rounds = shuffle(acts.concat(acts).concat(acts)).slice(0, 5), r = 0, score = 0, target = null, locked = false;
    function ask() {
      target = rounds[r]; locked = false;
      task('<span class="tk-ear">🎧</span><span class="tk-txt">Listen… and tap it!</span>' +
        '<button class="tk-say">🔊 Again</button><span class="tk-num">' + (r + 1) + '/' + rounds.length + '</span>');
      $('scene-task').querySelector('.tk-say').onclick = function () { MB.say('Find the ' + target.word + '!'); };
      MB.say('Find the ' + target.word + '!');
    }
    game = {
      kind: 'listen',
      pick: function (a) {
        if (locked) return;
        if (a === target) {
          locked = true; score++; hop(a); MB.chime(true);
          showBubble(a._el, '✅ <b class="bw">' + MB.esc(a.word) + '</b>');
          later(function () {
            hideBubble(); r++;
            if (r < rounds.length) ask();
            else { task('<span class="tk-done">🎉 ' + score + ' / ' + rounds.length + ' — super listening!</span>'); celebrate('🎧 Super listening!'); game = { kind: 'done' }; }
          }, 1300);
        } else {
          a._img.classList.remove('nope'); void a._img.offsetWidth; a._img.classList.add('nope');
          MB.chime(false); MB.say(a.word + '? No. Find the ' + target.word + '!');
        }
      }
    };
    ask();
  }

  /* ---------- 3. Find the 5 hidden stars ---------- */
  function startStars() {
    endGame();
    $('sb-stars').classList.add('on');
    var found = 0, made = [];
    var spots = cur.actors.map(function (a) { return [a.x + (Math.random() < .5 ? -1 : 1) * a.h * .22, a.y - 4]; })
      .concat([[12, 40], [88, 44], [50, 30], [20, 70], [80, 72], [62, 52]]);
    spots = shuffle(spots).slice(0, 5);
    spots.forEach(function (p, k) {
      var s = el('div', 'starbit', '⭐');
      var L = layer('lyr-star', p[0], p[1], 7, s);
      L.addEventListener('click', function (e) {
        e.stopPropagation(); if (L.classList.contains('got')) return;
        L.classList.add('got'); found++; MB.chime(true);
        task('<span class="tk-txt">⭐ Find the hidden stars!</span><span class="tk-num">' + found + ' / 5</span>');
        if (found === 5) { celebrate('🌟 You found all the stars!'); task('<span class="tk-done">🌟 You found all 5 stars!</span>'); }
      });
      later(function () { L.classList.add('up'); stand(L); }, 80 * k);
      made.push(L);
    });
    task('<span class="tk-txt">⭐ Find the hidden stars! Turn the scene to look behind things.</span><span class="tk-num">0 / 5</span>');
    MB.say('Find the five hidden stars!');
    game = { kind: 'stars', cleanup: function () { made.forEach(function (L) { L.remove(); }); } };
  }

  function init() {
    MB = window.MagicBook; S = MB.state;
    buildUI(); onSpread();
    addEventListener('resize', function () { if (S.scene) close(true); });
  }

  window.MagicScene = { init: init, open: open, close: close, onSpread: onSpread, scenes: SCENES };
})();
