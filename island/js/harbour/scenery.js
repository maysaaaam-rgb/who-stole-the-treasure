/* Treasure Island · Chapter 1 · The harbour in pieces
   The painting is split into an empty harbour (art/ch1/bg_benbow_empty.webp) with the ship and the rowing boats
   on top as separate pictures, so the ship rocks, the boats bob and the sea gently moves.
   The characters get extra poses: Benbow steps, sits and purrs; Flint the parrot flies past; Jim waves from the
   inn and points the way to the next clue.
   If a picture does not load, the old single painting stays, so the harbour never breaks. */
(function (root) {
  'use strict';

  var H = root.Harbour;
  if (!H) return;
  var IMG_W = 1376, IMG_H = 768;
  var CH1 = 'art/ch1/', FLAT = 'art/flat/';

  var calm = false;
  try { calm = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* ignore */ }

  // Ship and boats in picture pixels: centre x, waterline y, width (they sit where the painting had them)
  var SHIP = { x: 1112, y: 548, w: 425 };
  var BOATS = [
    { img: 'o_rowboat_3', x: 737, y: 584, w: 90, flip: false, d: 0 },
    { img: 'o_rowboat_2', x: 796, y: 640, w: 74,  flip: true,  d: 0.7 },
    { img: 'o_rowboat_1', x: 630, y: 656, w: 78,  flip: false, d: 1.4 },
    { img: 'o_rowboat_2', x: 698, y: 694, w: 86, flip: false, d: 2.1 },
    { img: 'o_rowboat_1', x: 877, y: 724, w: 80,  flip: true,  d: 2.8 }
  ];
  // Where the open sea gently waves (the dock, rocks and cliffs stay still)
  var WAVE = [[735, 338], [1236, 330], [1236, 420], [1376, 424], [1376, 610], [1150, 636], [1150, 768], [930, 768], [912, 612], [735, 566]];
  var JIM = { x: 424, y: 372, w: 6.4 };

  var stage, el = {}, sea = null, ready = false;

  function $(id) { return document.getElementById(id); }
  function px(v, of) { return (v / of * 100).toFixed(3) + '%'; }
  function sceneOpen() { return !!document.getElementById('hb-scene'); }
  function A() { return root.Ch1Audio || {}; }
  function load(src) {
    return new Promise(function (ok, no) { var i = new Image(); i.onload = function () { ok(i); }; i.onerror = no; i.src = src; });
  }

  /* ---------------------------------------------------------------- ship, boats and the moving sea */
  function buildSea(empty) {
    var bg = stage.querySelector('.hb-bg');
    bg.src = empty.src;
    var blur = document.querySelector('#hb-root .hb-blur');
    if (blur) blur.style.backgroundImage = 'url(' + empty.src + ')';

    // the sea: rows of the picture shift a little from side to side, like small waves
    if (!calm) {
      var cv = document.createElement('canvas');
      cv.className = 'hs-sea';
      bg.insertAdjacentElement('afterend', cv);
      sea = { cv: cv, ctx: cv.getContext('2d'), img: empty, last: 0, k: 1 };
      sizeSea();
      root.addEventListener('resize', function () { setTimeout(sizeSea, 60); });
    }

    var wrap = document.createElement('div');
    wrap.className = 'hs-boats';
    (sea ? sea.cv : bg).insertAdjacentElement('afterend', wrap);
    BOATS.forEach(function (b) {
      var d = document.createElement('div');
      d.className = 'hs-boat';
      d.style.left = px(b.x, IMG_W); d.style.top = px(b.y, IMG_H); d.style.width = px(b.w, IMG_W);
      d.style.animationDelay = (-b.d) + 's';
      d.innerHTML = '<img src="' + CH1 + b.img + '.webp" alt="" draggable="false"' + (b.flip ? ' class="flip"' : '') + '>';
      wrap.appendChild(d);
    });
    var ship = document.createElement('button');
    ship.type = 'button';
    ship.className = 'hs-ship';
    ship.setAttribute('aria-label', 'The ship');
    ship.style.left = px(SHIP.x, IMG_W); ship.style.top = px(SHIP.y, IMG_H); ship.style.width = px(SHIP.w, IMG_W);
    ship.innerHTML = '<img class="hs-ship-body" src="' + CH1 + 'o_ship.webp" alt="" draggable="false">' +
      '<img class="hs-ship-mirror" src="' + CH1 + 'o_ship.webp" alt="" draggable="false">';
    wrap.appendChild(ship);
    // the old invisible ship button keeps working: the ship picture passes taps to it
    var old = $('hb-ship');
    ship.onclick = function () { if (old) old.click(); ship.classList.remove('sway'); void ship.offsetWidth; ship.classList.add('sway'); };
    if (old) { old.classList.add('hs-moved'); new MutationObserver(function () { ship.classList.toggle('ready', old.classList.contains('ready')); }).observe(old, { attributes: true, attributeFilter: ['class'] }); }
  }
  function sizeSea() {
    if (!sea) return;
    var w = stage.offsetWidth, h = stage.offsetHeight, d = Math.min(1.6, root.devicePixelRatio || 1);
    sea.cv.width = Math.round(w * d); sea.cv.height = Math.round(h * d);
    sea.k = sea.cv.width / IMG_W;
  }
  function drawSea(now) {
    if (!sea || sceneOpen() || document.hidden || now - sea.last < 50) return;
    sea.last = now;
    var c = sea.ctx, t = now / 1000, iw = sea.img.naturalWidth / IMG_W;
    c.setTransform(sea.k, 0, 0, sea.k, 0, 0);
    c.clearRect(0, 0, IMG_W, IMG_H);
    c.save();
    c.beginPath();
    WAVE.forEach(function (p, i) { if (i) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); });
    c.closePath(); c.clip();
    for (var y = 330; y < IMG_H; y += 3) {
      var deep = (y - 330) / (IMG_H - 330);
      var dx = Math.sin(y * 0.075 + t * 1.7) * (0.5 + deep * 1.9) + Math.sin(y * 0.021 - t * 0.9) * 0.6;
      c.drawImage(sea.img, 0, y * iw, IMG_W * iw, 3 * iw, dx, y, IMG_W, 3);
    }
    c.restore();
  }

  /* ---------------------------------------------------------------- Benbow: steps, sits and purrs */
  var cat = { frames: {}, step: 0, lastStep: 0, still: 0, mode: '' };
  function setCat(name) {
    if (cat.mode === name || !cat.frames[name]) return;
    cat.mode = name;
    el.catImg.src = cat.frames[name];
  }
  function tickCat(now) {
    if (!el.catImg || !cat.frames.walk1) return;
    var c = $('hb-cat');
    if (c.classList.contains('pet')) { setCat('purr'); cat.still = now; return; }
    if (c.classList.contains('walking')) {
      cat.still = now;
      if (now - cat.lastStep > 170) { cat.step = 1 - cat.step; cat.lastStep = now; setCat(cat.step ? 'walk2' : 'walk1'); }
      return;
    }
    // stands a moment, then sits down
    setCat(now - cat.still > 1600 ? 'sit' : 'walk1');
  }

  /* ---------------------------------------------------------------- Flint flies past now and then */
  function flintFlight() {
    if (calm) return;
    var go = function () {
      if (!stage) return;
      if (!sceneOpen() && !document.hidden) {
        var f = document.createElement('button');
        var back = Math.random() < 0.5;
        f.type = 'button';
        f.className = 'hs-flint' + (back ? ' back' : '');
        f.setAttribute('aria-label', 'Flint the parrot');
        f.style.top = px(90 + Math.random() * 130, IMG_H);
        f.style.setProperty('--dur', (8 + Math.random() * 3).toFixed(1) + 's');
        f.innerHTML = '<img src="' + CH1 + 'c_flint_fly1.webp" alt="" draggable="false">';
        var img = f.firstChild, up = true;
        var flap = setInterval(function () { up = !up; img.src = CH1 + (up ? 'c_flint_fly1' : 'c_flint_fly2') + '.webp'; }, 150);
        f.onclick = function (e) {
          e.stopPropagation();
          f.classList.add('zoom');
          squawk();
        };
        stage.appendChild(f);
        setTimeout(function () { clearInterval(flap); f.remove(); }, 12000);
      }
      setTimeout(go, 18000 + Math.random() * 14000);
    };
    setTimeout(go, 6000);
  }
  var sq = null;
  function squawk() {
    if (A().isMuted && A().isMuted()) return;
    try {
      var C = root.AudioContext || root.webkitAudioContext; if (!C) return;
      sq = sq || new C();
      var t = sq.currentTime;
      [0, 0.18].forEach(function (off) {
        var o = sq.createOscillator(), g = sq.createGain();
        o.type = 'sawtooth'; o.frequency.setValueAtTime(1300, t + off); o.frequency.exponentialRampToValueAtTime(700, t + off + 0.14);
        var lp = sq.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400;
        g.gain.setValueAtTime(0.0001, t + off); g.gain.exponentialRampToValueAtTime(0.06, t + off + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + off + 0.16);
        o.connect(lp); lp.connect(g); g.connect(sq.destination); o.start(t + off); o.stop(t + off + 0.2);
      });
    } catch (e) { /* no sound */ }
  }

  /* ---------------------------------------------------------------- Jim waves from the inn and points the way */
  function buildJim() {
    var j = document.createElement('button');
    j.type = 'button';
    j.className = 'hb-actor hs-jim';
    j.id = 'hs-jim';
    j.setAttribute('aria-label', 'Jim');
    j.style.left = px(JIM.x, IMG_W); j.style.top = px(JIM.y, IMG_H); j.style.width = JIM.w + '%';
    j.style.zIndex = String(10 + JIM.y);
    j.innerHTML = '<img src="' + FLAT + 'c_jim.webp" alt="" draggable="false">';
    $('hb-places').insertAdjacentElement('beforebegin', j);
    el.jim = j; el.jimImg = j.firstChild;
    j.onclick = function (e) { e.stopPropagation(); jimDo('wave', 1800); if (A().sfxTap) A().sfxTap(); };
    setTimeout(function () { jimDo('wave', 2200); }, 1800);
    setInterval(function () {
      if (sceneOpen() || document.hidden) return;
      jimDo(Math.random() < 0.6 ? 'point' : 'wave', 2000);
    }, 9000);
  }
  var jimTimer = null;
  function jimDo(pose, ms) {
    if (!el.jimImg) return;
    var next = document.querySelector('.hb-place.next');
    // Jim faces the next clue when he points: clue 2 is down to the left, the others are to the right
    var left = next && next.id === 'hb-place-2';
    el.jim.classList.toggle('left', pose === 'point' && left);
    el.jimImg.src = CH1 + 'c_jim_' + pose + '.webp';
    el.jim.classList.remove('pop'); void el.jim.offsetWidth; el.jim.classList.add('pop');
    clearTimeout(jimTimer);
    jimTimer = setTimeout(function () { el.jimImg.src = FLAT + 'c_jim.webp'; el.jim.classList.remove('left'); }, ms);
  }

  /* ---------------------------------------------------------------- start */
  function loop(now) {
    requestAnimationFrame(loop);
    drawSea(now);
    tickCat(now);
  }
  function boot() {
    stage = $('hb-stage');
    if (!stage || ready) return;
    ready = true;
    var names = ['bg_benbow_empty', 'o_ship', 'o_rowboat_1', 'o_rowboat_2', 'o_rowboat_3'];
    Promise.all(names.map(function (n) { return load(CH1 + n + '.webp'); })).then(function (imgs) {
      buildSea(imgs[0]);
      stage.classList.add('hs-split');
    }).catch(function () { /* the single painting stays */ });
    // Benbow's poses
    var poses = { walk1: 'c_benbow_walk1', walk2: 'c_benbow_walk2', sit: 'c_benbow_sit', purr: 'c_benbow_purr' };
    Promise.all(Object.keys(poses).map(function (k) { return load(CH1 + poses[k] + '.webp').then(function (i) { cat.frames[k] = i.src; }); })).then(function () {
      el.catImg = document.querySelector('#hb-cat img');
      cat.still = performance.now();
    }).catch(function () { cat.frames = {}; });
    load(CH1 + 'c_jim_wave.webp').then(buildJim).catch(function () { /* no Jim */ });
    flintFlight();
    requestAnimationFrame(loop);
  }

  var startOld = H.start;
  H.start = function () {
    startOld.apply(H, arguments);
    boot();
  };
})(typeof window !== 'undefined' ? window : this);
