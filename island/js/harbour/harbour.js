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

  /* ---------------------------------------------------------------- building the scene */
  function build() {
    var r = document.createElement('div');
    r.id = 'hb-root';
    r.innerHTML =
      '<div class="hb-blur" style="background-image:url(' + BG + ')"></div>' +
      '<div class="hb-stage" id="hb-stage">' +
        '<img class="hb-bg" src="' + BG + '" alt="" draggable="false">' +
        '<div class="hb-water"></div>' +
        '<div class="hb-layer" id="hb-places"></div>' +
        '<div class="hb-actor hb-cat" id="hb-cat"><img src="' + FLAT + 'c_benbow.webp" alt="" draggable="false"></div>' +
        '<div class="hb-actor hb-hero" id="hb-hero"><div class="hb-hero-body">' + heroSvg(170) + '</div><div class="hb-shadow"></div></div>' +
        '<div class="hb-actor hb-flint" id="hb-flint"><img src="' + FLAT + 'c_flint.webp" alt="" draggable="false"></div>' +
        '<button type="button" class="hb-ship" id="hb-ship" aria-label="The ship"></button>' +
      '</div>' +
      '<div class="hb-hud">' +
        '<button type="button" class="hb-btn hb-back" id="hb-back" aria-label="Back">◀</button>' +
        '<div class="hb-stamps" id="hb-stamps" aria-label="Map stamps"></div>' +
        '<button type="button" class="hb-btn hb-sound" id="hb-sound" aria-label="Sound on or off">🔊</button>' +
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
    root.addEventListener('resize', fit);
    fit();
  }
  function pct(v, of) { return (v / of * 100).toFixed(3) + '%'; }

  // The picture keeps its shape: it fills the screen as much as it can, the rest is a soft blur of it
  function fit() {
    var w = root.innerWidth, h = root.innerHeight, k = Math.min(w / IMG_W, h / IMG_H);
    // on wide screens, fill the height and let a little of the sides go
    if (w / h > IMG_W / IMG_H) k = Math.min(w / IMG_W, h / IMG_H * 1.08);
    el.stage.style.width = Math.round(IMG_W * k) + 'px';
    el.stage.style.height = Math.round(IMG_H * k) + 'px';
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
      place(el.hero, hero.x, hero.y);
      // Benbow follows a little behind
      trail.push([hero.x, hero.y]); if (trail.length > 26) { var c = trail.shift(); cat.x = c[0] - 30 * hero.face; cat.y = c[1] + 6; el.cat.style.setProperty('--face', hero.face); place(el.cat, cat.x, cat.y); }
      if (f >= 1) {
        hero.node = nodes[i]; from = { x: hero.x, y: hero.y }; t0 = now; i++;
        if (i >= nodes.length) {
          hero.walking = false; trail = [];
          el.hero.classList.remove('walking'); el.cat.classList.remove('walking');
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
      setTimeout(function () { openStop(p.n); }, 250);
    });
  }

  function openStop(n) {
    var run = Harbour.stops[n];
    var finish = function (result) {
      busy = false;
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
    setTimeout(function () {
      var nn = nextStop();
      say(nn > 5 ? 'Well done, Captain! Every clue is solved!' : (nn === 1 ? 'Ahoy, Captain! Tap the inn door!' : 'Ahoy, Captain! Tap clue ' + nn + '!'));
    }, 900);
  };

  root.Harbour = Harbour;
})(typeof window !== 'undefined' ? window : this);
