/* Treasure Island · Chapter 1 · The Harbour (new world for Chapter 1)
   A painted harbour picture with 5 places. Tap a place: your monster walks there along the path,
   Benbow the leopard follows, and the stop's adventure opens. Very little text: voices and pictures.
   Stops with their own adventure register in Harbour.stops[n]; the others open the older clue window. */
(function (root) {
  'use strict';

  var IMG_W = 1376, IMG_H = 768;            // size of the painted harbour picture (art/bg_benbow.webp)
  var BG = 'art/bg_benbow.webp';
  var FLAT = 'art/flat/';

  // The walking path, in picture pixels: from the inn door, down the hill, along the beach, onto the dock
  var PATH = [
    [352, 372], [356, 396], [330, 410], [280, 425], [222, 452], [172, 492], [150, 528],
    [168, 566], [222, 594], [296, 618], [382, 632], [462, 624], [540, 612], [606, 603],
    [668, 596], [736, 590], [800, 592], [864, 598]
  ];
  // The five places: where the thing stands, and the path point where the hero stops
  var PLACES = [
    { n: 1, x: 349, y: 340, node: 0,  img: null,               h: 0,    name: 'The inn door' },
    { n: 2, x: 92,  y: 548, node: 6,  img: 'o_notice_board',   h: 0.17, name: 'The notice board' },
    { n: 3, x: 578, y: 560, node: 13, img: 'o_ship_wheel',     h: 0.13, name: 'The ship wheel' },
    { n: 4, x: 748, y: 548, node: 15, img: 'o_spyglass',       h: 0.12, name: 'The spyglass' },
    { n: 5, x: 902, y: 572, node: 17, img: 'o_billy_chest',    h: 0.13, name: "Billy's sea chest" }
  ];

  var Harbour = { stops: {} };
  var el = {}, hero = { node: 0, x: PATH[0][0], y: PATH[0][1], walking: false, face: 1 };
  var cat = { x: PATH[1][0] - 40, y: PATH[1][1] }, trail = [];
  var busy = false, started = false;

  var P = function () { return root.Ch1Progress; };
  var A = function () { return root.Ch1Audio || {}; };
  var F = function () { return root.Ch1Feedback || {}; };
  var $ = function (id) { return document.getElementById(id); };

  function grade() { return P() ? P().getActiveGrade() : 3; }
  function isDone(n) { try { return !!(P() && P().isClueDone && P().isClueDone(grade(), n)); } catch (e) { return false; } }
  function doneCount() { var c = 0; for (var i = 1; i <= 5; i++) if (isDone(i)) c++; return c; }
  function nextStop() { for (var i = 1; i <= 5; i++) if (!isDone(i)) return i; return 6; }
  function say(t, cb) { if (A().speak) A().speak(t, {}, cb); else if (cb) setTimeout(cb, 600); }
  function tap() { if (A().sfxTap) A().sfxTap(); }

  function heroSvg(size) {
    try {
      var st = root.IslandApp && root.IslandApp.state ? root.IslandApp.state() : null;
      var s = (st && st.session) || {};
      var prof = (s.student && s.student.monsterProfile) || {};
      if (root.MonsterRenderer && root.MonsterRenderer.renderMonsterSVG) {
        return root.MonsterRenderer.renderMonsterSVG({
          stage: 'growing', color: prof.baseColor || 'blue',
          equipped: Object.assign({}, prof.equipped || {}, (s.doc && s.doc.look) || {}),
          size: size || 160, animated: true, isAvatar: true
        });
      }
    } catch (e) { /* the leopard stands in */ }
    return '<img src="' + FLAT + 'c_benbow_happy.webp" alt="">';
  }
  Harbour.heroSvg = heroSvg;

  // On the map the monster walks like on the old island: the same 21 baked poses (front, 3/4, side, back),
  // so it turns, swings its arms and steps instead of sliding like a picture.
  var sprite = null;   // { sheet, cols, frame, ctx, dir }
  function setupSprite() {
    var W = root.IslandWalker;
    if (!W || !W.bakeSheet || !root.MonsterRenderer) return;
    W.bakeSheet(W.look()).then(function (sh) {
      var body = el.hero.querySelector('.hb-hero-body');
      var cv = document.createElement('canvas');
      cv.width = cv.height = sh.frame;
      body.innerHTML = ''; body.appendChild(cv);
      el.hero.classList.add('sprite');
      sprite = { sheet: sh.canvas, cols: sh.cols, frame: sh.frame, ctx: cv.getContext('2d'), dir: 'down' };
      drawPose(W.IDLE_FRAME.down);
    }).catch(function () { /* the picture stays */ });
  }
  function drawPose(n) {
    if (!sprite) return;
    var f = sprite.frame, col = n % sprite.cols, row = Math.floor(n / sprite.cols);
    sprite.ctx.clearRect(0, 0, f, f);
    sprite.ctx.drawImage(sprite.sheet, col * f, row * f, f, f, 0, 0, f, f);
  }
  function stepPose(dx, dy, now) {
    if (!sprite) return;
    var W = root.IslandWalker, d = W.dirFromVec(dx, dy);
    sprite.dir = d;
    var seq = W.WALK[d];
    drawPose(seq[Math.floor(now / 100) % seq.length]);
    var face = (d === 'down' || d === 'up') ? 1 : (dx < 0 ? -1 : 1);
    el.hero.style.setProperty('--face', face);
  }
  function idlePose() {
    if (!sprite) return;
    var d = sprite.dir === 'up' ? 'diag' : sprite.dir;   // stop facing the children, never with its back to them
    drawPose(root.IslandWalker.IDLE_FRAME[d]);
  }

  /* ---------------------------------------------------------------- building the scene */
  function build() {
    var r = document.createElement('div');
    r.id = 'hb-root';
    r.innerHTML =
      '<div class="hb-blur" style="background-image:url(' + BG + ')"></div>' +
      '<div class="hb-stage" id="hb-stage">' +
        '<img class="hb-bg" src="' + BG + '" alt="" draggable="false">' +
        '<div class="hb-water"></div>' +
        '<div class="hb-layer" id="hb-finds-layer"></div>' +
        '<div class="hb-layer" id="hb-places"></div>' +
        '<div class="hb-actor hb-cat" id="hb-cat"><img src="' + FLAT + 'c_benbow.webp" alt="" draggable="false"></div>' +
        '<div class="hb-actor hb-hero" id="hb-hero"><div class="hb-hero-body">' + heroSvg(170) + '</div><div class="hb-shadow"></div></div>' +
        '<div class="hb-actor hb-flint" id="hb-flint"><img src="' + FLAT + 'c_flint.webp" alt="" draggable="false"></div>' +
        '<button type="button" class="hb-ship" id="hb-ship" aria-label="The ship"></button>' +
      '</div>' +
      '<div class="hb-hud">' +
        '<button type="button" class="hb-btn hb-back" id="hb-back" aria-label="Back">◀</button>' +
        '<div class="hb-stamps" id="hb-stamps" aria-label="Map stamps"></div>' +
        '<div class="hb-hud-right">' +
          '<div class="hb-finds" id="hb-finds" aria-label="Treasures found"></div>' +
          '<button type="button" class="hb-btn hb-view" id="hb-view" aria-label="See the whole harbour">🗺️</button>' +
          '<button type="button" class="hb-btn hb-sound" id="hb-sound" aria-label="Sound on or off">🔊</button>' +
        '</div>' +
      '</div>' +
      '<div class="hb-turn" id="hb-turn"><div>📱↻</div></div>';
    document.body.appendChild(r);
    document.body.classList.add('hb-on');
    el.root = r; el.stage = $('hb-stage'); el.hero = $('hb-hero'); el.cat = $('hb-cat'); el.flint = $('hb-flint');

    var places = $('hb-places');
    PLACES.forEach(function (p) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'hb-place' + (p.img ? '' : ' hb-door');
      b.id = 'hb-place-' + p.n;
      b.setAttribute('aria-label', p.name);
      b.style.left = pct(p.x, IMG_W); b.style.top = pct(p.y, IMG_H);
      if (p.img) b.style.setProperty('--h', (p.h * 100) + '%');
      b.innerHTML = (p.img ? '<img src="' + FLAT + p.img + '.webp" alt="" draggable="false">' : '') +
        '<span class="hb-ring"></span><span class="hb-num">' + p.n + '</span><span class="hb-arrow">⬇</span>';
      b.onclick = function () { goTo(p); };
      places.appendChild(b);
    });

    $('hb-back').onclick = function () {
      tap();
      if (root.WorldGame && root.WorldGame.openWorldMap) root.WorldGame.openWorldMap();
      else root.history.back();
    };
    $('hb-sound').onclick = function () {
      if (A().toggleMute) A().toggleMute();
      $('hb-sound').textContent = A().isMuted && A().isMuted() ? '🔇' : '🔊';
      tap();
    };
    $('hb-ship').onclick = function () {
      tap();
      if (doneCount() >= 5) say('All aboard! The Hispaniola is ready!');
      else say('First, find all five clues!');
    };
    $('hb-view').onclick = function () { tap(); cam.overview = !cam.overview; $('hb-view').textContent = cam.overview ? '🔍' : '🗺️'; };
    el.cat.onclick = petBenbow;
    el.hero.onclick = cheerHero;
    el.stage.addEventListener('click', tapGround);
    buildFinds();
    root.addEventListener('resize', fit);
    fit();
    setupSprite();
    requestAnimationFrame(camTick);
  }

  /* ---------------------------------------------------------------- the camera
     The harbour is shown bigger than the screen and the camera follows the monster, so the children
     travel round the harbour instead of looking at one picture. 🗺️ shows the whole harbour (handy on the board). */
  var cam = { k: 1, z: 1, tz: 1, x: 0, y: 0, fx: 700, fy: 420, focus: null, overview: true, ready: false };
  function zoomFor() {
    var w = root.innerWidth, h = root.innerHeight;
    // big screens (the smartboard) need less zoom than a phone
    return Math.min(w, h * 1.78) > 1500 ? 1.45 : 1.65;
  }
  function camTick() {
    requestAnimationFrame(camTick);
    if (!el.stage) return;
    var vw = root.innerWidth, vh = root.innerHeight;
    var want = cam.focusZoom || (cam.overview ? 1 : zoomFor());
    cam.tz = want;
    cam.z += (cam.tz - cam.z) * 0.08;
    var f = cam.focus || [hero.x + 60 * hero.face, hero.y - 70];
    cam.fx += (f[0] - cam.fx) * 0.08; cam.fy += (f[1] - cam.fy) * 0.08;
    var sw = IMG_W * cam.k * cam.z, sh = IMG_H * cam.k * cam.z;
    var tx = vw / 2 - cam.fx * cam.k * cam.z, ty = vh / 2 - cam.fy * cam.k * cam.z;
    tx = sw > vw ? Math.min(0, Math.max(vw - sw, tx)) : (vw - sw) / 2;
    ty = sh > vh ? Math.min(0, Math.max(vh - sh, ty)) : (vh - sh) / 2;
    if (!cam.ready) { cam.x = tx; cam.y = ty; cam.ready = true; }
    cam.x += (tx - cam.x) * 0.2; cam.y += (ty - cam.y) * 0.2;
    el.stage.style.transform = 'translate3d(' + cam.x.toFixed(1) + 'px,' + cam.y.toFixed(1) + 'px,0) scale(' + cam.z.toFixed(4) + ')';
  }
  // the camera glides in towards a place before its adventure opens, and back out after
  Harbour.zoomTo = function (x, y, done) {
    cam.focus = [x, y]; cam.focusZoom = Math.max(zoomFor(), 1.9);
    setTimeout(function () { if (done) done(); }, 700);
  };
  Harbour.zoomOut = function () { cam.focus = null; cam.focusZoom = 0; };

  /* ---------------------------------------------------------------- tap the path to walk there */
  function picturePoint(e) {
    var r = el.stage.getBoundingClientRect();
    return [(e.clientX - r.left) / r.width * IMG_W, (e.clientY - r.top) / r.height * IMG_H];
  }
  function tapGround(e) {
    if (busy || hero.walking) return;
    if (e.target.closest('button, .hb-find, .hb-actor')) return;
    var p = picturePoint(e), best = -1, bestD = 95;
    PATH.forEach(function (q, i) { var d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bestD) { bestD = d; best = i; } });
    if (best < 0 || best === hero.node) return;
    if (cam.overview) { cam.overview = false; $('hb-view').textContent = '🗺️'; }
    marker(PATH[best]);
    walk(best);
  }
  function marker(q) {
    var m = document.createElement('div');
    m.className = 'hb-goto';
    m.style.left = pct(q[0], IMG_W); m.style.top = pct(q[1], IMG_H);
    el.stage.appendChild(m);
    setTimeout(function () { m.remove(); }, 900);
  }

  /* ---------------------------------------------------------------- little treasures hidden round the harbour */
  var FINDS = [
    { id: 'shell1', img: 'o_shell',    x: 362, y: 662 },
    { id: 'coin1',  img: 'u_coin',     x: 186, y: 604 },
    { id: 'star1',  img: 'o_starfish', x: 584, y: 646 },
    { id: 'bottle', img: '../o_bottle', x: 478, y: 700 },
    { id: 'coin2',  img: 'u_coin',     x: 432, y: 372 }
  ];
  function findKey() { return 'hb-finds-g' + grade(); }
  function foundList() { try { return JSON.parse(root.localStorage.getItem(findKey()) || '[]'); } catch (e) { return []; } }
  function saveFound(list) { try { root.localStorage.setItem(findKey(), JSON.stringify(list)); } catch (e) { /* private mode: just this visit */ } }
  function buildFinds() {
    var layer = $('hb-finds-layer'), got = foundList();
    layer.innerHTML = '';
    FINDS.forEach(function (f, i) {
      if (got.indexOf(f.id) !== -1) return;
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'hb-find'; b.setAttribute('aria-label', 'A little treasure');
      b.style.left = pct(f.x, IMG_W); b.style.top = pct(f.y, IMG_H); b.style.animationDelay = (i * 0.9) + 's';
      b.innerHTML = '<img src="' + FLAT + f.img + '.webp" alt="" draggable="false">';
      b.onclick = function (e) {
        e.stopPropagation();
        var list = foundList(); if (list.indexOf(f.id) === -1) list.push(f.id); saveFound(list);
        b.classList.add('got');
        if (F().sparkleAt) F().sparkleAt(b, 10);
        if (A().sfxCorrect) A().sfxCorrect();
        setTimeout(function () { b.remove(); }, 700);
        showFinds(true);
        if (list.length === FINDS.length) setTimeout(function () { if (A().sfxFanfare) A().sfxFanfare(); }, 500);
      };
      layer.appendChild(b);
    });
    showFinds(false);
  }
  function showFinds(bump) {
    var n = foundList().length, box = $('hb-finds');
    box.innerHTML = '<img src="' + FLAT + 'o_shell.webp" alt=""><b>' + n + '/' + FINDS.length + '</b>';
    box.classList.toggle('all', n >= FINDS.length);
    if (bump) { box.classList.remove('bump'); void box.offsetWidth; box.classList.add('bump'); }
  }

  /* ---------------------------------------------------------------- tap the characters */
  function petBenbow(e) {
    if (e) e.stopPropagation();
    el.cat.classList.remove('pet'); void el.cat.offsetWidth; el.cat.classList.add('pet');
    purr();
  }
  function cheerHero(e) {
    if (e) e.stopPropagation();
    if (hero.walking) return;
    if (sprite) { drawPose(20); setTimeout(idlePose, 700); }
    el.hero.classList.remove('cheer'); void el.hero.offsetWidth; el.hero.classList.add('cheer');
    if (A().sfxTap) A().sfxTap();
  }
  var purrCtx = null;
  function purr() {
    if (A().isMuted && A().isMuted()) return;
    try {
      var C = root.AudioContext || root.webkitAudioContext; if (!C) return;
      purrCtx = purrCtx || new C();
      var t = purrCtx.currentTime, o = purrCtx.createOscillator(), g = purrCtx.createGain(), lfo = purrCtx.createOscillator(), lg = purrCtx.createGain();
      o.type = 'triangle'; o.frequency.value = 58;
      lfo.frequency.value = 22; lg.gain.value = 0.05; lfo.connect(lg); lg.connect(g.gain);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.09, t + 0.1); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
      o.connect(g); g.connect(purrCtx.destination); o.start(t); lfo.start(t); o.stop(t + 1.2); lfo.stop(t + 1.2);
    } catch (e2) { /* no sound */ }
  }
  function pct(v, of) { return (v / of * 100).toFixed(3) + '%'; }

  // The picture keeps its shape: it fills the screen as much as it can, the rest is a soft blur of it
  function fit() {
    var w = root.innerWidth, h = root.innerHeight, k = Math.min(w / IMG_W, h / IMG_H);
    // on wide screens, fill the height and let a little of the sides go
    if (w / h > IMG_W / IMG_H) k = Math.min(w / IMG_W, h / IMG_H * 1.08);
    el.stage.style.width = Math.round(IMG_W * k) + 'px';
    el.stage.style.height = Math.round(IMG_H * k) + 'px';
    cam.k = Math.round(IMG_W * k) / IMG_W;
    $('hb-turn').classList.toggle('on', h > w * 1.15);
    place(el.hero, hero.x, hero.y); place(el.cat, cat.x, cat.y);
  }
  function place(node, x, y) { node.style.left = pct(x, IMG_W); node.style.top = pct(y, IMG_H); node.style.zIndex = String(10 + Math.round(y)); }

  /* ---------------------------------------------------------------- state on the map */
  function refresh() {
    var nx = nextStop();
    PLACES.forEach(function (p) {
      var b = $('hb-place-' + p.n);
      b.classList.toggle('done', isDone(p.n));
      b.classList.toggle('next', p.n === nx);
      b.classList.toggle('later', p.n > nx);
    });
    var st = $('hb-stamps'), html = '';
    for (var i = 1; i <= 5; i++) html += '<span class="hb-stamp' + (isDone(i) ? ' got' : '') + '"><img src="' + FLAT + 'o_map_stamp.webp" alt=""><b>' + i + '</b></span>';
    st.innerHTML = html;
    $('hb-ship').classList.toggle('ready', nx > 5);
  }
  Harbour.refresh = refresh;

  /* ---------------------------------------------------------------- walking */
  function pathBetween(a, b) {
    var out = [], step = a <= b ? 1 : -1;
    for (var i = a; i !== b + step; i += step) out.push(i);
    return out;
  }
  function walk(toNode, done) {
    if (hero.walking) return;
    var nodes = pathBetween(hero.node, toNode);
    if (nodes.length <= 1) { hero.node = toNode; if (done) done(); return; }
    hero.walking = true;
    el.hero.classList.add('walking'); el.cat.classList.add('walking');
    var i = 1, speed = 0.30;   // picture pixels per millisecond
    var from = { x: hero.x, y: hero.y }, t0 = performance.now();
    function frame(now) {
      var to = PATH[nodes[i]];
      var dx = to[0] - from.x, dy = to[1] - from.y, len = Math.max(1, Math.hypot(dx, dy));
      var f = Math.min(1, (now - t0) * speed / len);
      hero.x = from.x + dx * f; hero.y = from.y + dy * f;
      if (Math.abs(dx) > 2) { hero.face = dx > 0 ? 1 : -1; el.hero.style.setProperty('--face', hero.face); }
      stepPose(dx, dy, now);
      place(el.hero, hero.x, hero.y);
      // Benbow follows a little behind
      trail.push([hero.x, hero.y]); if (trail.length > 26) { var c = trail.shift(); cat.x = c[0] - 30 * hero.face; cat.y = c[1] + 6; el.cat.style.setProperty('--face', hero.face); place(el.cat, cat.x, cat.y); }
      if (f >= 1) {
        hero.node = nodes[i]; from = { x: hero.x, y: hero.y }; t0 = now; i++;
        if (i >= nodes.length) {
          hero.walking = false; trail = [];
          el.hero.classList.remove('walking'); el.cat.classList.remove('walking');
          idlePose();
          cat.x = hero.x - 70 * hero.face; cat.y = hero.y + 8; place(el.cat, cat.x, cat.y);
          if (done) done();
          return;
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function goTo(p) {
    if (busy || hero.walking) return;
    tap();
    var nx = nextStop();
    if (p.n > nx) {
      var b = $('hb-place-' + nx);
      if (b) { b.classList.remove('nudge'); void b.offsetWidth; b.classList.add('nudge'); }
      say(nx === 1 ? 'First, the inn door!' : 'First, clue ' + nx + '!');
      return;
    }
    busy = true;
    walk(p.node, function () {
      // the camera glides in towards the place (js/harbour/life.js), then the adventure opens
      if (Harbour.zoomTo) Harbour.zoomTo(p.x, p.y, function () { openStop(p.n); });
      else setTimeout(function () { openStop(p.n); }, 250);
    });
  }

  function openStop(n) {
    var run = Harbour.stops[n];
    var finish = function (result) {
      busy = false;
      if (Harbour.zoomOut) Harbour.zoomOut();
      refresh();
      if (result && result.solved) celebrate(n);
    };
    if (run) {
      run({ grade: grade(), stop: n, hero: heroSvg, done: finish, say: say });
    } else if (root.Chapter1 && root.Chapter1.openClue) {
      root.Chapter1.openClue(n, 'easy');
      watchOldClue(finish);
    } else {
      busy = false;
    }
  }
  // The older clue window: wait until it closes
  function watchOldClue(finish) {
    var iv = setInterval(function () {
      if (!document.getElementById('ch1-modal-backdrop')) { clearInterval(iv); finish(); }
    }, 600);
  }

  function celebrate(n) {
    var st = $('hb-stamps').children[n - 1];
    if (st && F().sparkleAt) F().sparkleAt(st, 14);
    if (A().sfxStamp) A().sfxStamp();
    var nx = nextStop();
    var cueNext = function () {
      var b = $('hb-place-' + nx);
      if (b) { b.classList.remove('nudge'); void b.offsetWidth; b.classList.add('nudge'); }
    };
    if (nx > 5) {
      if (F().playChestFinale && P() && !(P().isChestOpened && P().isChestOpened(grade()))) {
        setTimeout(function () { F().playChestFinale(function () { if (P().markChestOpened) P().markChestOpened(grade()); refresh(); }); }, 900);
      }
    } else {
      setTimeout(cueNext, 900);
    }
  }

  /* ---------------------------------------------------------------- start */
  Harbour.start = function () {
    if (started) return;
    started = true;
    build();
    // stand next to the next place
    var nx = Math.min(5, nextStop());
    var node = PLACES[nx - 1].node;
    hero.node = nx === 1 ? 4 : Math.max(0, node - 1);   // stand a little away, so the next place is easy to see
    hero.x = PATH[hero.node][0]; hero.y = PATH[hero.node][1];
    cat.x = hero.x - 70; cat.y = hero.y + 8;
    fit();
    refresh();
    setInterval(refresh, 1500);
    // start with the whole harbour, then the camera glides down to the monster
    cam.overview = true; cam.fx = IMG_W / 2; cam.fy = IMG_H / 2;
    setTimeout(function () { cam.overview = false; }, 1600);
    setTimeout(function () {
      var nn = nextStop();
      say(nn > 5 ? 'Well done, Captain! Every clue is solved!' : (nn === 1 ? 'Ahoy, Captain! Tap the inn door!' : 'Ahoy, Captain! Tap clue ' + nn + '!'));
    }, 900);
  };

  root.Harbour = Harbour;
})(typeof window !== 'undefined' ? window : this);
