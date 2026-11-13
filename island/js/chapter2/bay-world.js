/* ═══════════════════════════════════════════════════════════════
   Treasure Island — Chapter 2: Hispaniola Bay & Lighthouse Cove
   (island/js/chapter2/bay-world.js -> `window.BayWorld`)
   - Living 2.5D painted world on `art/ch2/bg_ch2_bay.webp` (1376x768)
   - 5 Global Reading Unit 2 Landmark Stops:
       1. Lantern Beach Pavilion (G3 Chuseok Harvest Feast / G4 Two Forests Biomes)
       2. Moonlight Palm Clearing (G3 Weaving Loom & Thankful / G4 Winter Adaptation)
       3. Hillside Cottage & Twin Forest (G3 Mars First Harvest / G4 Kind Swallow Folktale)
       4. Coral Fishing Pier (G3 `-st` Blend Fishing / G4 `ai` Long-A Sails & Irregulars)
       5. Silver's Coral Chest & Spyglass Lighthouse Finale (Map Piece #2 + Golden Beam!)
   - 21-pose walking Hero + spring-damped Lulu & Benbow companions, 2.5D Y-perspective scale,
     WASD/Arrow + Click/Tap walking, sand/wood/stone footsteps, swooping swallows,
     5 hidden beach pearls, Unified HUD, Golden Compass, and Voyage Cutscene!
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var IMG_W = 1376, IMG_H = 768;
  var BG = 'art/ch2/bg_ch2_bay.webp';
  var FLAT = 'art/flat/';
  var CH2 = 'art/ch2/';
  var Z2 = 'art/z2/';
  var KENNEY = 'art/kenney/';

  // Walkable ribbon from Hillside Cottage (0) -> Palm Clearing (5) -> Pavilion (8) -> Pier (9..12) -> Shoreline Chest (13..15)
  var PATH = [
    [462, 344], [488, 356], [446, 372], [392, 396], [344, 432],
    [248, 502], [238, 562], [308, 608], [452, 594],
    [536, 612], [642, 596], [758, 584], [844, 600],
    [618, 668], [762, 712], [906, 734]
  ];

  // Adjacency graph so branching between Pier (9..12) and Shoreline (13..15) never walks across water
  var GRAPH = {
    0: [1],
    1: [0, 2],
    2: [1, 3],
    3: [2, 4],
    4: [3, 5],
    5: [4, 6],
    6: [5, 7],
    7: [6, 8],
    8: [7, 9],
    9: [8, 10, 13],
    10: [9, 11],
    11: [10, 12],
    12: [11],
    13: [9, 14],
    14: [13, 15],
    15: [14]
  };

  var PLACES = [
    { n: 1, x: 392, y: 552, node: 8,  img: CH2 + 'o_songpyeon.webp',  h: 0.115, name: '1. Harvest & Forest Pavilion' },
    { n: 2, x: 196, y: 504, node: 5,  img: CH2 + 'o_loom.webp',       h: 0.135, name: '2. Moonlight Weaving Clearing' },
    { n: 3, x: 468, y: 408, node: 2,  img: CH2 + 'c_swallow.webp',    h: 0.088, name: '3. Twin Forest Cottage' },
    { n: 4, x: 760, y: 582, node: 11, img: Z2 + 'o_fishing_rod.webp', h: 0.13,  name: '4. Coral Fishing Pier' },
    { n: 5, x: 912, y: 726, node: 15, img: FLAT + 'o_billy_chest.webp', h: 0.135, name: "5. Silver's Coral Chest" }
  ];

  var FINDS = [
    { id: 'ch2_shell1', img: FLAT + 'o_shell.webp',    x: 296, y: 668, mat: 'shell', coins: 4 },
    { id: 'ch2_star1',  img: FLAT + 'o_starfish.webp', x: 502, y: 652, mat: 'shell', coins: 4 },
    { id: 'ch2_coin1',  img: FLAT + 'u_coin.webp',     x: 682, y: 696, coins: 5 },
    { id: 'ch2_crys1',  img: FLAT + 'i_crystal.webp',  x: 152, y: 546, mat: 'crystal', coins: 5 },
    { id: 'ch2_shell2', img: FLAT + 'o_shell.webp',    x: 824, y: 742, mat: 'shell', coins: 4 }
  ];

  var BayWorld = { stops: {} };
  var el = {};
  var hero = { node: 7, x: PATH[7][0], y: PATH[7][1], walking: false, face: 1 };
  var lulu = { x: PATH[7][0] - 46, y: PATH[7][1] + 6 };
  var trail = [];
  var busy = false, started = false, paused = false;
  var sprite = null;
  var lastKeyStep = 0, lastStepSfx = 0;

  var P = function () { return root.Ch2Progress; };
  var A = function () { return root.Ch1Audio || {}; };
  var F = function () { return root.Ch1Feedback || {}; };
  var UF = function () { return root.UnityFeel || null; };
  var $ = function (id) { return document.getElementById(id); };

  function pct(v, of) { return (v / of * 100).toFixed(3) + '%'; }
  function grade() { return P() ? P().getActiveGrade() : 3; }
  function isDone(n) { try { return !!(P() && P().isClueDone && P().isClueDone(grade(), n)); } catch (e) { return false; } }
  function doneCount() { var c = 0; for (var i = 1; i <= 5; i++) if (isDone(i)) c++; return c; }
  function nextStop() { for (var i = 1; i <= 5; i++) if (!isDone(i)) return i; return 6; }
  function say(t, cb) { if (A().speak) A().speak(t, {}, cb); else if (cb) setTimeout(cb, 650); }
  function tap() { if (A().sfxTap) A().sfxTap(); }

  function surfaceAt(x, y) {
    if (x >= 520 && x <= 870 && y >= 565 && y <= 620) return 'wood';
    if (y < 410) return 'stone';
    return 'sand';
  }

  function heroSvg(size) {
    if (root.Harbour && root.Harbour.heroSvg) return root.Harbour.heroSvg(size);
    return '<img src="' + FLAT + 'c_lulu_happy.webp" alt="">';
  }
  BayWorld.heroSvg = heroSvg;

  function setupSprite() {
    var W = root.IslandWalker;
    if (!W || !W.bakeSheet || !root.MonsterRenderer || !el.hero) return;
    W.bakeSheet(W.look()).then(function (sh) {
      if (!el.hero) return;
      var body = el.hero.querySelector('.hb-hero-body');
      var cv = document.createElement('canvas');
      cv.width = cv.height = sh.frame;
      body.innerHTML = '';
      body.appendChild(cv);
      el.hero.classList.add('sprite');
      sprite = { sheet: sh.canvas, cols: sh.cols, frame: sh.frame, ctx: cv.getContext('2d'), dir: 'down' };
      drawPose(W.IDLE_FRAME.down);
    }).catch(function () {});
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
    var d = sprite.dir === 'up' ? 'diag' : sprite.dir;
    drawPose(root.IslandWalker.IDLE_FRAME[d]);
  }

  /* ── Shortest path over GRAPH ── */
  function shortestPath(startNode, goalNode) {
    if (startNode === goalNode) return [startNode];
    var queue = [[startNode]];
    var seen = {};
    seen[startNode] = true;
    while (queue.length) {
      var cur = queue.shift();
      var last = cur[cur.length - 1];
      var nbrs = GRAPH[last] || [];
      for (var i = 0; i < nbrs.length; i++) {
        var nx = nbrs[i];
        if (seen[nx]) continue;
        var nextPath = cur.concat([nx]);
        if (nx === goalNode) return nextPath;
        seen[nx] = true;
        queue.push(nextPath);
      }
    }
    return [startNode, goalNode];
  }

  /* ── Build Scene DOM ── */
  function build() {
    var r = $('ch2-root');
    if (!r) {
      r = document.createElement('div');
      r.id = 'ch2-root';
      document.body.appendChild(r);
    }
    r.innerHTML =
      '<div class="ch2-blur" style="background-image:url(' + BG + ')"></div>' +
      '<div class="ch2-stage" id="ch2-stage">' +
        '<img class="ch2-bg" src="' + BG + '" alt="" draggable="false">' +
        '<div class="ch2-water"></div>' +
        '<div class="ch2-glow-pavilion"></div>' +
        '<div class="ch2-glow-cottage"></div>' +
        '<div class="ch2-lighthouse-beam" id="ch2-beam"></div>' +
        '<div class="ch2-lighthouse-orb"></div>' +
        '<div class="hb-layer" id="ch2-finds-layer"></div>' +
        '<div class="hb-layer" id="ch2-places"></div>' +
        '<button type="button" class="ch2-silver" id="ch2-silver" style="left:' + pct(318, IMG_W) + ';top:' + pct(596, IMG_H) + '" aria-label="Long John Silver">' +
          '<img src="' + FLAT + 'c_silver_happy.webp" alt="Long John Silver" draggable="false">' +
        '</button>' +
        '<div class="hb-actor hb-cat" id="ch2-lulu"><img src="' + FLAT + 'c_lulu_happy.webp" alt="Lulu" draggable="false"></div>' +
        '<div class="hb-actor hb-hero" id="ch2-hero"><div class="hb-hero-body">' + heroSvg(170) + '</div><div class="hb-shadow"></div></div>' +
        '<button type="button" class="ch2-ship-btn" id="ch2-ship" aria-label="The Hispaniola Ship"></button>' +
        '<button type="button" class="ch2-lighthouse-btn" id="ch2-lighthouse-top" aria-label="Spyglass Lighthouse"></button>' +
      '</div>' +
      '<div class="uf-hud-layer" id="ch2-uf-hud"></div>' +
      '<button type="button" class="uf-wayfinder" id="ch2-wayfinder" hidden></button>' +
      '<div class="hb-turn" id="ch2-turn"><div>📱↻</div></div>';

    document.body.classList.add('ch2-on');
    el.root = r;
    el.stage = $('ch2-stage');
    el.hero = $('ch2-hero');
    el.lulu = $('ch2-lulu');
    el.hud = $('ch2-uf-hud');
    el.wayfinder = $('ch2-wayfinder');

    var placesBox = $('ch2-places');
    PLACES.forEach(function (p) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'hb-place';
      b.id = 'ch2-place-' + p.n;
      b.setAttribute('aria-label', p.name);
      b.style.left = pct(p.x, IMG_W);
      b.style.top = pct(p.y, IMG_H);
      b.style.setProperty('--h', (p.h * 100) + '%');
      b.innerHTML =
        '<img class="hb-prop" src="' + p.img + '" alt="" draggable="false">' +
        '<span class="hb-ring"></span>' +
        '<span class="hb-sparkles" aria-hidden="true">' +
          '<img class="hb-sp s1" src="' + KENNEY + 'p_star.webp" alt="">' +
          '<img class="hb-sp s2" src="' + KENNEY + 'p_spark.webp" alt="">' +
          '<img class="hb-sp s3" src="' + KENNEY + 'p_magic.webp" alt="">' +
          '<img class="hb-sp s4" src="' + KENNEY + 'p_star.webp" alt="">' +
        '</span>' +
        '<span class="hb-num"><img class="hb-star" src="' + KENNEY + 'star_outline.webp" alt=""><b>' + p.n + '</b></span>' +
        '<span class="hb-arrow"><img src="' + KENNEY + 'arrow_down.webp" alt="" draggable="false"></span>';
      b.onclick = function () { goTo(p); };
      placesBox.appendChild(b);
    });

    $('ch2-silver').onclick = function (ev) {
      ev.stopPropagation();
      tap();
      var nx = nextStop();
      if (nx > 5) {
        say('Shiver me timbers, Captain! The Spyglass Lighthouse is shining bright! Tap the Hispaniola to sail to Stockade Forest!');
      } else {
        say('Ahoy, matey! Follow Lulu to Stop ' + nx + ' to earn your next golden cove stamp!');
      }
    };

    $('ch2-lighthouse-top').onclick = function (ev) {
      ev.stopPropagation();
      tap();
      if (doneCount() >= 5 || (P() && P().isChestOpened(grade()))) {
        el.root.classList.add('beacon-lit');
        if (A().sfxBeacon) A().sfxBeacon();
        say('The Spyglass Lighthouse beam is shining across Treasure Island!');
      } else {
        BayWorld.walkToStop(5);
      }
    };

    $('ch2-ship').onclick = function (ev) {
      ev.stopPropagation();
      tap();
      if (doneCount() >= 4 || (root.WorldGame && root.WorldGame.isAllChaptersUnlocked && root.WorldGame.isAllChaptersUnlocked())) {
        if (root.WorldGame && root.WorldGame.openWorldMap) root.WorldGame.openWorldMap();
      } else {
        say('Solve four clues in Hispaniola Bay first, Captain, or tap Sea Chart to sail back to Benbow Harbour!');
      }
    };

    if (el.wayfinder) {
      el.wayfinder.onclick = function () {
        tap();
        BayWorld.walkToStop(Math.min(5, nextStop()));
      };
    }

    el.lulu.onclick = function (ev) {
      ev.stopPropagation();
      el.lulu.classList.remove('pet');
      void el.lulu.offsetWidth;
      el.lulu.classList.add('pet');
      if (A().sfxCorrect) A().sfxCorrect();
    };
    el.hero.onclick = function (ev) {
      ev.stopPropagation();
      if (hero.walking) return;
      if (sprite) { drawPose(20); setTimeout(idlePose, 700); }
      el.hero.classList.remove('cheer');
      void el.hero.offsetWidth;
      el.hero.classList.add('cheer');
      tap();
    };

    el.stage.addEventListener('click', tapGround);
    buildFinds();
    mountHud();
    if (UF() && UF().onLookChanged) {
      UF().onLookChanged(function () { setupSprite(); });
    }
    scheduleSwallows();
    root.addEventListener('resize', fit);
    fit();
    setupSprite();
    requestAnimationFrame(camTick);
  }

  function mountHud() {
    if (!UF() || !el.hud) return;
    UF().mountUnifiedHud(el.hud, {
      chapter: 2,
      title: '🌕 Ch.2 · Hispaniola Bay',
      findsMax: FINDS.length,
      getFindsCount: function () { return foundList().length; },
      isOverview: function () { return !!cam.overview; },
      onToggleCam: function () { cam.overview = !cam.overview; },
      onTapFinds: function () {
        var left = FINDS.length - foundList().length;
        say(left > 0 ? ('Find ' + left + ' more pearls, crystals, and shells on the cove sand!') : 'Hooray! You found all five cove treasures!');
      },
      onSelectStop: function (n) { BayWorld.walkToStop(n); },
      onModeChanged: function () { buildFinds(); refresh(); }
    });
  }

  function scheduleSwallows() {
    var fly = function () {
      if (!paused && el.stage && !document.getElementById('ch2-scene') && !document.hidden) {
        var sw = document.createElement('div');
        var rtl = Math.random() < 0.45;
        sw.className = 'ch2-swallow' + (rtl ? ' rtl' : '');
        sw.style.top = pct(70 + Math.random() * 160, IMG_H);
        sw.style.setProperty('--dur', (9 + Math.random() * 4).toFixed(1) + 's');
        sw.innerHTML = '<img src="' + CH2 + 'c_swallow.webp" alt="" draggable="false">';
        el.stage.appendChild(sw);
        setTimeout(function () { if (sw.parentNode) sw.parentNode.removeChild(sw); }, 14000);
      }
      setTimeout(fly, 11000 + Math.random() * 9000);
    };
    setTimeout(fly, 2800);
  }

  /* ── Hidden Pearls & Shells ── */
  function findKey() { return 'ch2-finds-g' + grade(); }
  function foundList() { try { return JSON.parse(root.localStorage.getItem(findKey()) || '[]'); } catch (e) { return []; } }
  function saveFound(list) { try { root.localStorage.setItem(findKey(), JSON.stringify(list)); } catch (e) {} }
  function buildFinds() {
    var layer = $('ch2-finds-layer');
    if (!layer) return;
    var got = foundList();
    layer.innerHTML = '';
    FINDS.forEach(function (f, i) {
      if (got.indexOf(f.id) !== -1) return;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'hb-find';
      b.setAttribute('aria-label', 'Hidden cove pearl');
      b.style.left = pct(f.x, IMG_W);
      b.style.top = pct(f.y, IMG_H);
      b.style.animationDelay = (i * 0.85) + 's';
      b.innerHTML = '<img src="' + f.img + '" alt="" draggable="false">';
      b.onclick = function (e) {
        e.stopPropagation();
        var list = foundList();
        if (list.indexOf(f.id) === -1) list.push(f.id);
        saveFound(list);
        b.classList.add('got');
        if (F().sparkleAt) F().sparkleAt(b, 10);
        if (A().sfxCoin) A().sfxCoin();
        if (root.WorldGame) {
          if (f.coins && root.WorldGame.addBonusCoins) root.WorldGame.addBonusCoins(f.coins);
          if (f.mat && root.WorldGame.giveMaterials) { var m = {}; m[f.mat] = 1; root.WorldGame.giveMaterials(m); }
        }
        var rect = b.getBoundingClientRect();
        if (UF() && UF().flyCoinsToHud) UF().flyCoinsToHud(f.coins || 4, rect.left + rect.width / 2, rect.top);
        setTimeout(function () { b.remove(); }, 700);
        if (UF()) UF().refreshAllUnifiedHuds(false);
      };
      layer.appendChild(b);
    });
  }

  /* ── Camera, 2.5D Perspective & WASD Walking ── */
  var cam = { k: 1, z: 1, tz: 1, x: 0, y: 0, fx: 688, fy: 384, focus: null, overview: true, ready: false };
  function zoomFor() {
    var w = root.innerWidth, h = root.innerHeight;
    return Math.min(w, h * 1.78) > 1500 ? 1.40 : 1.58;
  }

  function fit() {
    if (!el.stage) return;
    var w = root.innerWidth, h = root.innerHeight, k = Math.min(w / IMG_W, h / IMG_H);
    if (w / h > IMG_W / IMG_H) k = Math.min(w / IMG_W, h / IMG_H * 1.08);
    el.stage.style.width = Math.round(IMG_W * k) + 'px';
    el.stage.style.height = Math.round(IMG_H * k) + 'px';
    cam.k = Math.round(IMG_W * k) / IMG_W;
    if ($('ch2-turn')) $('ch2-turn').classList.toggle('on', h > w * 1.15);
    place(el.hero, hero.x, hero.y);
    place(el.lulu, lulu.x, lulu.y);
  }

  function place(node, x, y) {
    if (!node) return;
    node.style.left = pct(x, IMG_W);
    node.style.top = pct(y, IMG_H);
    node.style.zIndex = String(10 + Math.round(y));
    var pScale = UF() && UF().perspectiveScale ? UF().perspectiveScale(y, 315, 735, 0.58, 1.04) : 0.85;
    node.style.transform = 'translate(-50%, -100%) scale(' + pScale.toFixed(3) + ')';
  }

  function camTick(now) {
    requestAnimationFrame(camTick);
    if (paused || !el.stage || el.root.style.display === 'none') return;

    if (!busy && !hero.walking && UF() && UF().getKeyboardInput) {
      var kb = UF().getKeyboardInput();
      if (kb.vx !== 0 || kb.vy !== 0) {
        if (cam.overview) cam.overview = false;
        var nx = Math.max(120, Math.min(960, hero.x + kb.vx * 2.6));
        var ny = Math.max(318, Math.min(752, hero.y + kb.vy * 2.6));
        var bestIdx = hero.node, bestDist = 9999;
        for (var pi = 0; pi < PATH.length; pi++) {
          var dd = Math.hypot(PATH[pi][0] - nx, PATH[pi][1] - ny);
          if (dd < bestDist) { bestDist = dd; bestIdx = pi; }
        }
        if (bestDist < 78) {
          hero.x = nx; hero.y = ny; hero.node = bestIdx;
          if (Math.abs(kb.vx) > 0.1) { hero.face = kb.vx > 0 ? 1 : -1; el.hero.style.setProperty('--face', hero.face); }
          el.hero.classList.add('walking'); el.lulu.classList.add('walking');
          stepPose(kb.vx, kb.vy, now || performance.now());
          place(el.hero, hero.x, hero.y);
          trail.push([hero.x, hero.y]);
          if (trail.length > 22) {
            var tc = trail.shift();
            lulu.x = tc[0] - 34 * hero.face; lulu.y = tc[1] + 6;
            el.lulu.style.setProperty('--face', hero.face);
            place(el.lulu, lulu.x, lulu.y);
          }
          var tNow = now || performance.now();
          if (tNow - lastKeyStep > 135) {
            lastKeyStep = tNow;
            spawnDust(hero.x, hero.y);
          }
          if (tNow - lastStepSfx > 275) {
            lastStepSfx = tNow;
            if (A().sfxFootstep) A().sfxFootstep(surfaceAt(hero.x, hero.y));
          }
        }
      } else if (el.hero.classList.contains('walking') && !hero.walking) {
        el.hero.classList.remove('walking'); el.lulu.classList.remove('walking');
        idlePose();
      }
    }

    var vw = root.innerWidth, vh = root.innerHeight;
    var want = cam.focusZoom || (cam.overview ? 1 : zoomFor());
    cam.tz = want;
    cam.z += (cam.tz - cam.z) * 0.08;
    var f = cam.focus || [hero.x + 55 * hero.face, hero.y - 68];
    cam.fx += (f[0] - cam.fx) * 0.08;
    cam.fy += (f[1] - cam.fy) * 0.08;
    var sw = IMG_W * cam.k * cam.z, sh = IMG_H * cam.k * cam.z;
    var tx = vw / 2 - cam.fx * cam.k * cam.z, ty = vh / 2 - cam.fy * cam.k * cam.z;
    tx = sw > vw ? Math.min(0, Math.max(vw - sw, tx)) : (vw - sw) / 2;
    ty = sh > vh ? Math.min(0, Math.max(vh - sh, ty)) : (vh - sh) / 2;
    if (!cam.ready) { cam.x = tx; cam.y = ty; cam.ready = true; }
    cam.x += (tx - cam.x) * 0.2;
    cam.y += (ty - cam.y) * 0.2;
    el.stage.style.transform = 'translate3d(' + cam.x.toFixed(1) + 'px,' + cam.y.toFixed(1) + 'px,0) scale(' + cam.z.toFixed(4) + ')';

    if (UF() && UF().updateWayfinder && el.wayfinder) {
      var nxStop = nextStop();
      var targetPlace = nxStop <= 5 ? PLACES[nxStop - 1] : null;
      if (targetPlace && !busy) {
        var sx = cam.x + targetPlace.x * cam.k * cam.z;
        var sy = cam.y + (targetPlace.y - 36) * cam.k * cam.z;
        UF().updateWayfinder(el.wayfinder, cam, { screenX: sx, screenY: sy }, 'Stop ' + targetPlace.n);
      } else {
        el.wayfinder.hidden = true;
      }
    }
  }

  BayWorld.zoomTo = function (x, y, done) {
    cam.focus = [x, y];
    cam.focusZoom = Math.max(zoomFor(), 1.82);
    setTimeout(function () { if (done) done(); }, 650);
  };
  BayWorld.zoomOut = function () { cam.focus = null; cam.focusZoom = 0; };

  function tapGround(e) {
    if (busy || hero.walking) return;
    if (e.target.closest('button, .hb-find, .hb-actor')) return;
    var r = el.stage.getBoundingClientRect();
    var p = [(e.clientX - r.left) / r.width * IMG_W, (e.clientY - r.top) / r.height * IMG_H];
    var best = -1, bestD = 110;
    PATH.forEach(function (q, i) {
      var d = Math.hypot(q[0] - p[0], q[1] - p[1]);
      if (d < bestD) { bestD = d; best = i; }
    });
    if (best < 0 || best === hero.node) return;
    if (cam.overview) { cam.overview = false; if (UF()) UF().refreshAllUnifiedHuds(false); }
    var m = document.createElement('div');
    m.className = 'hb-goto';
    m.style.left = pct(PATH[best][0], IMG_W);
    m.style.top = pct(PATH[best][1], IMG_H);
    el.stage.appendChild(m);
    setTimeout(function () { m.remove(); }, 900);
    walk(best);
  }

  function spawnDust(x, y) {
    if (!el.stage) return;
    var d = document.createElement('img');
    d.className = 'hb-dust';
    d.src = KENNEY + (Math.random() < 0.35 ? 'p_spark.webp' : 'p_smoke.webp');
    d.alt = '';
    d.style.left = pct(x + (Math.random() - 0.5) * 18, IMG_W);
    d.style.top = pct(y - 4 + (Math.random() - 0.5) * 8, IMG_H);
    d.style.zIndex = String(9 + Math.round(y));
    el.stage.appendChild(d);
    setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 520);
  }

  function walk(toNode, done) {
    if (hero.walking) return;
    var nodes = shortestPath(hero.node, toNode);
    if (nodes.length <= 1) {
      hero.node = toNode;
      hero.x = PATH[toNode][0]; hero.y = PATH[toNode][1];
      place(el.hero, hero.x, hero.y);
      if (done) done();
      return;
    }
    hero.walking = true;
    el.hero.classList.add('walking'); el.lulu.classList.add('walking');
    var i = 1, speed = 0.32, lastDust = 0, lastSfx = 0;
    var from = { x: hero.x, y: hero.y }, t0 = performance.now();
    function frame(now) {
      if (paused) { hero.walking = false; return; }
      var to = PATH[nodes[i]];
      var dx = to[0] - from.x, dy = to[1] - from.y, len = Math.max(1, Math.hypot(dx, dy));
      var f = Math.min(1, (now - t0) * speed / len);
      hero.x = from.x + dx * f; hero.y = from.y + dy * f;
      if (Math.abs(dx) > 2) { hero.face = dx > 0 ? 1 : -1; el.hero.style.setProperty('--face', hero.face); }
      stepPose(dx, dy, now);
      place(el.hero, hero.x, hero.y);
      if (now - lastDust > 95) { lastDust = now; spawnDust(hero.x, hero.y); }
      if (now - lastSfx > 260) { lastSfx = now; if (A().sfxFootstep) A().sfxFootstep(surfaceAt(hero.x, hero.y)); }
      trail.push([hero.x, hero.y]);
      if (trail.length > 22) {
        var c = trail.shift();
        lulu.x = c[0] - 32 * hero.face; lulu.y = c[1] + 6;
        el.lulu.style.setProperty('--face', hero.face);
        place(el.lulu, lulu.x, lulu.y);
      }
      if (f >= 1) {
        hero.node = nodes[i]; from = { x: hero.x, y: hero.y }; t0 = now; i++;
        if (i >= nodes.length) {
          hero.walking = false; trail = [];
          el.hero.classList.remove('walking'); el.lulu.classList.remove('walking');
          idlePose();
          lulu.x = hero.x - 56 * hero.face; lulu.y = hero.y + 8; place(el.lulu, lulu.x, lulu.y);
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
    var allOpen = root.WorldGame && root.WorldGame.isAllChaptersUnlocked && root.WorldGame.isAllChaptersUnlocked();
    if (!allOpen && p.n > nx) {
      var b = $('ch2-place-' + nx);
      if (b) { b.classList.remove('nudge'); void b.offsetWidth; b.classList.add('nudge'); }
      say('First, visit Stop ' + nx + ' with Lulu!');
      return;
    }
    if (cam.overview) cam.overview = false;
    busy = true;
    walk(p.node, function () {
      BayWorld.zoomTo(p.x, p.y, function () { openStop(p.n); });
    });
  }

  BayWorld.walkToStop = function (n) {
    var idx = Math.max(1, Math.min(5, Number(n) || 1)) - 1;
    if (PLACES[idx]) goTo(PLACES[idx]);
  };

  function openStop(n) {
    var starPref = (P() && P().isStarPreferred) ? P().isStarPreferred() : (root.Ch1Progress && root.Ch1Progress.isStarPreferred ? root.Ch1Progress.isStarPreferred() : false);
    var finish = function (result) {
      busy = false;
      BayWorld.zoomOut();
      refresh();
      if (result && result.solved) celebrate(n);
    };
    if (starPref && root.Chapter2 && root.Chapter2.openClue) {
      root.Chapter2.openClue(n, 'star', finish);
      return;
    }
    var run = BayWorld.stops[n];
    if (run) {
      run({ grade: grade(), stop: n, hero: heroSvg, done: finish, say: say });
    } else if (root.Chapter2 && root.Chapter2.openClue) {
      root.Chapter2.openClue(n, 'easy', finish);
    } else {
      busy = false;
    }
  }

  function celebrate(n) {
    var placeBtn = $('ch2-place-' + n);
    if (placeBtn && F().sparkleAt) F().sparkleAt(placeBtn, n === 5 ? 28 : 18);
    if (placeBtn && UF() && UF().flyCoinsToHud) {
      var pr = placeBtn.getBoundingClientRect();
      UF().flyCoinsToHud(n === 5 ? 25 : 10, pr.left + pr.width / 2, pr.top);
    }
    if (A().sfxStamp) A().sfxStamp();
    var nx = nextStop();
    if (nx > 5) {
      el.root.classList.add('beacon-lit');
      if (A().sfxBeacon) A().sfxBeacon();
      if (P() && !(P().isChestOpened && P().isChestOpened(grade()))) {
        setTimeout(function () { playCh2Finale(function () { if (P().markChestOpened) P().markChestOpened(grade()); refresh(); }); }, 800);
      }
    } else {
      setTimeout(function () {
        var b = $('ch2-place-' + nx);
        if (b) { b.classList.remove('nudge'); void b.offsetWidth; b.classList.add('nudge'); }
      }, 850);
    }
  }

  function playCh2Finale(onDone) {
    if (A().sfxChestOpen) A().sfxChestOpen();
    if (A().sfxBeacon) setTimeout(function () { A().sfxBeacon(); }, 350);
    var overlay = document.createElement('div');
    overlay.id = 'ch2-finale-overlay';
    overlay.className = 'ch1-finale-overlay';
    overlay.style.zIndex = '12200';
    overlay.innerHTML =
      '<div class="ch1-finale-card" role="dialog" aria-label="Chapter 2 Complete!">' +
        '<div class="ch1-finale-rays"></div>' +
        '<div class="ch1-finale-step">' +
          '<div class="ch1-finale-badge">🌕 CHAPTER 2 COMPLETE · SPYGLASS BEACON LIT!</div>' +
          '<h2 class="ch1-finale-title">Silver\'s Coral Chest Bursts Open!</h2>' +
          '<div class="ch1-finale-loot-row">' +
            '<div class="ch1-loot-item">' +
              '<img src="art/z2/o_lighthouse_on.webp" alt="Spyglass Lighthouse Lit">' +
              '<span>🗼 Lighthouse Lit!</span>' +
            '</div>' +
            '<div class="ch1-loot-item highlight">' +
              '<img src="art/ch2/o_map_piece2.webp" onerror="this.src=\'art/flat/o_map_scroll.webp\'" alt="Map Piece #2">' +
              '<span>🗺️ Map Piece #2 Found!</span>' +
            '</div>' +
            '<div class="ch1-loot-item">' +
              '<img src="art/flat/c_lulu_happy.webp" alt="Lulu Sticker">' +
              '<span>🦜 Lulu Sticker + 25 🪙!</span>' +
            '</div>' +
          '</div>' +
          '<p class="ch1-finale-msg">"Incredible reading, Captain! You mastered Unit Two, lit the golden Spyglass Lighthouse beam, and unlocked Captain Flint\'s second treasure map piece!"</p>' +
          '<div class="ch1-finale-actions" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">' +
            '<button type="button" class="ch1-btn gold" id="ch2-fin-sail3">🌲 Sail to Chapter 3: Stockade Forest! ▶</button>' +
            '<button type="button" class="ch1-btn emerald" id="ch2-fin-stay">🎉 Explore Hispaniola Bay ✓</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    if (F().sparkleAt) F().sparkleAt(overlay.querySelector('.ch1-finale-card'), 24);
    say('Hooray! You unlocked Silver\'s Coral Chest, earned Map Piece Number Two, and lit the Spyglass Lighthouse!');

    document.getElementById('ch2-fin-sail3').onclick = function () {
      if (A().sfxFanfare) A().sfxFanfare();
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      if (onDone) onDone();
      if (root.SceneDirector) root.SceneDirector.goZone(3);
    };
    document.getElementById('ch2-fin-stay').onclick = function () {
      tap();
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      if (onDone) onDone();
    };
  }

  function maybePlaySailCutscene(forcePlay, afterFn) {
    var seenKey = 'ch2_sail_seen_v1';
    var already = false;
    try { already = localStorage.getItem(seenKey) === '1'; } catch (e) {}
    if (!forcePlay && already) { if (afterFn) afterFn(); return; }
    try { localStorage.setItem(seenKey, '1'); } catch (e) {}

    var cut = document.createElement('div');
    cut.id = 'ch2-cutscene';
    cut.className = 'ch2-cutscene on';
    cut.innerHTML =
      '<div class="ch2-cutscene-card">' +
        '<video id="ch2-sail-vid" src="videos/vid_ch2_sail.mp4" autoplay playsinline controls></video>' +
        '<div class="ch2-cutscene-bar">' +
          '<div><b>⛵ Voyage of the Hispaniola · Sailing to Lighthouse Cove</b><small style="display:block;color:#cbd5e1">Jim, Lulu, and Benbow drop anchor at Chapter 2!</small></div>' +
          '<button type="button" class="ch1-btn gold sm" id="ch2-skip-sail">⚓ Drop Anchor &amp; Play ▶</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(cut);

    var finishCut = function () {
      var v = document.getElementById('ch2-sail-vid');
      if (v) { try { v.pause(); } catch (e) {} }
      if (cut.parentNode) cut.parentNode.removeChild(cut);
      if (afterFn) afterFn();
    };
    document.getElementById('ch2-skip-sail').onclick = function () { tap(); finishCut(); };
    var vid = document.getElementById('ch2-sail-vid');
    if (vid) {
      vid.onended = finishCut;
      vid.onerror = finishCut;
      var p = vid.play();
      if (p && p.catch) p.catch(function () {});
    }
  }

  function refresh() {
    if (!started || !el.root) return;
    var nx = nextStop();
    var allOpen = root.WorldGame && root.WorldGame.isAllChaptersUnlocked && root.WorldGame.isAllChaptersUnlocked();
    PLACES.forEach(function (p) {
      var b = $('ch2-place-' + p.n);
      if (!b) return;
      var done = isDone(p.n);
      b.classList.toggle('done', done);
      b.classList.toggle('next', p.n === nx);
      b.classList.toggle('later', !allOpen && p.n > nx);
      var starImg = b.querySelector('.hb-star');
      if (starImg) starImg.src = KENNEY + (done ? 'star_gold.webp' : 'star_outline.webp');
    });
    var beaconOn = nx > 5 || (P() && P().isChestOpened && P().isChestOpened(grade()));
    el.root.classList.toggle('beacon-lit', !!beaconOn);
    if ($('ch2-ship')) $('ch2-ship').classList.toggle('ready', doneCount() >= 4 || allOpen);
    if (UF()) UF().refreshAllUnifiedHuds(false);
  }
  BayWorld.refresh = refresh;
  BayWorld.playFinale = playCh2Finale;
  BayWorld.playSailCutscene = maybePlaySailCutscene;
  BayWorld.isActive = function () { return !!(started && !paused); };
  BayWorld.openStop = openStop;
  BayWorld.PLACES = PLACES;

  BayWorld.pause = function () {
    paused = true;
    document.body.classList.remove('ch2-on');
    if (el.root) el.root.style.display = 'none';
  };

  BayWorld.start = function (opts) {
    opts = opts || {};
    paused = false;
    document.body.classList.add('ch2-on');
    if (started) {
      if (el.root) el.root.style.display = '';
      setupSprite();
      fit();
      refresh();
      if (opts.sailIntro) maybePlaySailCutscene(true);
      return;
    }
    started = true;
    build();
    var nx = Math.min(5, nextStop());
    hero.node = PLACES[nx - 1].node;
    hero.x = PATH[hero.node][0];
    hero.y = PATH[hero.node][1];
    lulu.x = hero.x - 52;
    lulu.y = hero.y + 8;
    fit();
    refresh();
    setInterval(function () { if (!paused) refresh(); }, 2200);
    cam.overview = true;
    cam.fx = IMG_W / 2;
    cam.fy = IMG_H / 2;

    var greetAfterArrival = function () {
      setTimeout(function () { cam.overview = false; if (UF()) UF().refreshAllUnifiedHuds(false); }, 1400);
      setTimeout(function () {
        if (paused) return;
        var g = grade();
        var msg = g === 4
          ? 'Welcome to Hispaniola Bay! Unit Two: What Lives Here? Tap Stop ' + Math.min(5, nextStop()) + '!'
          : 'Welcome to Hispaniola Bay! Unit Two: Thank You! Tap Stop ' + Math.min(5, nextStop()) + '!';
        say(msg);
      }, 650);
    };

    if (opts.sailIntro) {
      maybePlaySailCutscene(true, greetAfterArrival);
    } else {
      greetAfterArrival();
    }
  };

  root.BayWorld = BayWorld;
})(typeof window !== 'undefined' ? window : this);
