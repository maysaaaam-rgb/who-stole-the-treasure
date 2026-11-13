/* Treasure Island · Chapter 1 · Admiral Benbow Harbour (Unity 2.5D Living World)
   - Painted harbour stage (1376x768) with Cinemachine-style follow camera & overview toggle
   - 2.5D Y-depth perspective scaling on Hero & Benbow so characters match Jim's scale at the inn door
   - Stop 4 (o_spyglass) & Stop 3/5 anchored squarely on solid wooden pier planks
   - Click/Tap + Continuous WASD/Arrow walking, surface-aware footsteps, dust puffs, & live outfit re-bake
   - Unified HUD (Sea Chart, Coins/Level, Grade 3/4/Star switcher, 5 Stamps, Videos, Store, Look, Games)
   - Off-screen Golden Wayfinder Compass & Hispaniola voyage to Chapter 2 */
(function (root) {
  'use strict';

  var IMG_W = 1376, IMG_H = 768;
  var BG = 'art/bg_benbow.webp';
  var FLAT = 'art/flat/';
  var KENNEY = 'art/kenney/';

  // Walking path in painting pixels: from the inn door, down the hill, along the sandy beach, onto the wooden pier planks
  var PATH = [
    [352, 372], [356, 396], [330, 410], [280, 425], [222, 452], [172, 492], [150, 528],
    [168, 566], [222, 594], [296, 618], [382, 632], [462, 624], [540, 616], [602, 614],
    [676, 608], [756, 604], [818, 603], [882, 606]
  ];

  // Five landmark stops: Stop 3, 4, 5 stand firmly on the wooden pier planks (never floating on rowboats)
  var PLACES = [
    { n: 1, x: 349, y: 340, node: 0,  img: null,             h: 0,    name: '1. Benbow Inn Parlour' },
    { n: 2, x: 96,  y: 548, node: 6,  img: 'o_notice_board', h: 0.17, name: '2. Inventor & Brain Board' },
    { n: 3, x: 596, y: 608, node: 13, img: 'o_ship_wheel',   h: 0.13, name: '3. Ship Wheel Challenge' },
    { n: 4, x: 758, y: 602, node: 15, img: 'o_spyglass',     h: 0.125, name: '4. Pier Spyglass Lookout' },
    { n: 5, x: 886, y: 606, node: 17, img: 'o_billy_chest',  h: 0.13, name: "5. Billy's Sea Chest" }
  ];

  var Harbour = { stops: {} };
  var el = {}, hero = { node: 0, x: PATH[0][0], y: PATH[0][1], walking: false, face: 1 };
  var cat = { x: PATH[1][0] - 40, y: PATH[1][1] }, trail = [];
  var busy = false, started = false, paused = false;
  var lastKeyStep = 0, lastStepSfx = 0;

  var P = function () { return root.Ch1Progress; };
  var A = function () { return root.Ch1Audio || {}; };
  var F = function () { return root.Ch1Feedback || {}; };
  var UF = function () { return root.UnityFeel || null; };
  var $ = function (id) { return document.getElementById(id); };

  function grade() { return P() ? P().getActiveGrade() : 3; }
  function isDone(n) { try { return !!(P() && P().isClueDone && P().isClueDone(grade(), n)); } catch (e) { return false; } }
  function doneCount() { var c = 0; for (var i = 1; i <= 5; i++) if (isDone(i)) c++; return c; }
  function nextStop() { for (var i = 1; i <= 5; i++) if (!isDone(i)) return i; return 6; }
  function say(t, cb) { if (A().speak) A().speak(t, {}, cb); else if (cb) setTimeout(cb, 600); }
  function tap() { if (A().sfxTap) A().sfxTap(); }

  function surfaceAt(x, y) {
    if (x >= 555 && y >= 575 && y <= 635) return 'wood';
    if (y < 460) return 'stone';
    return 'sand';
  }

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
    } catch (e) { /* leopard fallback */ }
    return '<img src="' + FLAT + 'c_benbow_happy.webp" alt="">';
  }
  Harbour.heroSvg = heroSvg;

  // 21-pose baked monster sprite sheet with live re-baking whenever Dressing Room changes
  var sprite = null;
  function setupSprite() {
    var W = root.IslandWalker;
    if (!W || !W.bakeSheet || !root.MonsterRenderer || !el.hero) return;
    W.bakeSheet(W.look()).then(function (sh) {
      if (!el.hero) return;
      var body = el.hero.querySelector('.hb-hero-body');
      var cv = document.createElement('canvas');
      cv.width = cv.height = sh.frame;
      body.innerHTML = ''; body.appendChild(cv);
      el.hero.classList.add('sprite');
      sprite = { sheet: sh.canvas, cols: sh.cols, frame: sh.frame, ctx: cv.getContext('2d'), dir: 'down' };
      drawPose(W.IDLE_FRAME.down);
    }).catch(function () { /* SVG stays */ });
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
        '<button type="button" class="hb-ship" id="hb-ship" aria-label="Sail on the Hispaniola"></button>' +
      '</div>' +
      '<div class="uf-hud-layer" id="hb-uf-hud"></div>' +
      '<button type="button" class="uf-wayfinder" id="hb-wayfinder" hidden></button>' +
      '<div class="hb-hud" id="hb-legacy-hud" style="display:none">' +
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
    el.hud = $('hb-uf-hud'); el.wayfinder = $('hb-wayfinder');

    var places = $('hb-places');
    PLACES.forEach(function (p) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'hb-place' + (p.img ? '' : ' hb-door');
      b.id = 'hb-place-' + p.n;
      b.setAttribute('aria-label', p.name);
      b.style.left = pct(p.x, IMG_W); b.style.top = pct(p.y, IMG_H);
      if (p.img) b.style.setProperty('--h', (p.h * 100) + '%');
      b.innerHTML = (p.img ? '<img class="hb-prop" src="' + FLAT + p.img + '.webp" alt="" draggable="false">' : '') +
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
      places.appendChild(b);
    });

    $('hb-ship').onclick = function () {
      tap();
      var canSail = doneCount() >= 4 || (root.WorldGame && root.WorldGame.isAllChaptersUnlocked && root.WorldGame.isAllChaptersUnlocked());
      if (canSail && root.SceneDirector) {
        say('All aboard the Hispaniola! Setting sail for Chapter Two: Hispaniola Bay!', function () {
          root.SceneDirector.goZone(2, { sailIntro: true });
        });
      } else if (doneCount() >= 5) {
        say('All aboard! Open the Sea Chart to sail to Hispaniola Bay!');
      } else {
        say('Solve four harbour clues first, Captain, then we set sail on the Hispaniola!');
      }
    };

    if (el.wayfinder) {
      el.wayfinder.onclick = function () {
        tap();
        var nx = Math.min(5, nextStop());
        Harbour.walkToStop(nx);
      };
    }

    el.cat.onclick = petBenbow;
    el.hero.onclick = cheerHero;
    el.stage.addEventListener('click', tapGround);
    buildFinds();
    mountHud();
    if (UF() && UF().onLookChanged) {
      UF().onLookChanged(function () { setupSprite(); });
    }
    root.addEventListener('resize', fit);
    fit();
    setupSprite();
    requestAnimationFrame(camTick);
  }

  function mountHud() {
    if (!UF() || !el.hud) {
      var leg = $('hb-legacy-hud');
      if (leg) leg.style.display = '';
      return;
    }
    UF().mountUnifiedHud(el.hud, {
      chapter: 1,
      title: '⚓ Ch.1 · Benbow Harbour',
      findsMax: FINDS.length,
      getFindsCount: function () { return foundList().length; },
      isOverview: function () { return !!cam.overview; },
      onToggleCam: function () { cam.overview = !cam.overview; },
      onTapFinds: function () {
        var left = FINDS.length - foundList().length;
        say(left > 0 ? ('Spot ' + left + ' more glittering shells and coins along the beach!') : 'You found all five harbour treasures!');
      },
      onSelectStop: function (n) { Harbour.walkToStop(n); },
      onModeChanged: function () { buildFinds(); refresh(); }
    });
  }

  /* ---------------------------------------------------------------- Cinemachine camera + WASD walking */
  var cam = { k: 1, z: 1, tz: 1, x: 0, y: 0, fx: 700, fy: 420, focus: null, overview: true, ready: false };
  function zoomFor() {
    var w = root.innerWidth, h = root.innerHeight;
    return Math.min(w, h * 1.78) > 1500 ? 1.42 : 1.62;
  }
  function camTick(now) {
    requestAnimationFrame(camTick);
    if (paused || !el.stage || el.root.style.display === 'none') return;

    // Continuous keyboard WASD / Arrow movement along the harbour path
    if (!busy && !hero.walking && UF() && UF().getKeyboardInput) {
      var kb = UF().getKeyboardInput();
      if (kb.vx !== 0 || kb.vy !== 0) {
        if (cam.overview) cam.overview = false;
        var stepSpeed = 2.6;
        var nx = Math.max(60, Math.min(930, hero.x + kb.vx * stepSpeed));
        var ny = Math.max(362, Math.min(675, hero.y + kb.vy * stepSpeed));
        // Snap gently toward nearest walkable path ribbon so hero stays on land/pier
        var bestIdx = hero.node, bestDist = 9999;
        for (var pi = 0; pi < PATH.length; pi++) {
          var dd = Math.hypot(PATH[pi][0] - nx, PATH[pi][1] - ny);
          if (dd < bestDist) { bestDist = dd; bestIdx = pi; }
        }
        if (bestDist < 72) {
          hero.x = nx; hero.y = ny; hero.node = bestIdx;
          if (Math.abs(kb.vx) > 0.1) { hero.face = kb.vx > 0 ? 1 : -1; el.hero.style.setProperty('--face', hero.face); }
          el.hero.classList.add('walking'); el.cat.classList.add('walking');
          stepPose(kb.vx, kb.vy, now || performance.now());
          place(el.hero, hero.x, hero.y);
          trail.push([hero.x, hero.y]);
          if (trail.length > 22) {
            var tc = trail.shift();
            cat.x = tc[0] - 32 * hero.face; cat.y = tc[1] + 6;
            el.cat.style.setProperty('--face', hero.face);
            place(el.cat, cat.x, cat.y);
          }
          var tNow = now || performance.now();
          if (tNow - lastKeyStep > 130) {
            lastKeyStep = tNow;
            spawnDust(hero.x, hero.y);
          }
          if (tNow - lastStepSfx > 280) {
            lastStepSfx = tNow;
            if (A().sfxFootstep) A().sfxFootstep(surfaceAt(hero.x, hero.y));
          }
        }
      } else if (el.hero.classList.contains('walking') && !hero.walking) {
        el.hero.classList.remove('walking'); el.cat.classList.remove('walking');
        idlePose();
      }
    }

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

    // Off-screen Golden Wayfinder update
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

  Harbour.zoomTo = function (x, y, done) {
    cam.focus = [x, y]; cam.focusZoom = Math.max(zoomFor(), 1.85);
    setTimeout(function () { if (done) done(); }, 680);
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
    var p = picturePoint(e), best = -1, bestD = 105;
    PATH.forEach(function (q, i) { var d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bestD) { bestD = d; best = i; } });
    if (best < 0 || best === hero.node) return;
    if (cam.overview) { cam.overview = false; if (UF()) UF().refreshAllUnifiedHuds(false); }
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
    { id: 'shell1', img: 'o_shell',    x: 362, y: 662, mat: 'shell' },
    { id: 'coin1',  img: 'u_coin',     x: 186, y: 604, coins: 4 },
    { id: 'star1',  img: 'o_starfish', x: 520, y: 652, mat: 'shell' },
    { id: 'bottle', img: '../o_bottle', x: 452, y: 696, coins: 5 },
    { id: 'coin2',  img: 'u_coin',     x: 102, y: 476, coins: 4 }
  ];
  function findKey() { return 'hb-finds-g' + grade(); }
  function foundList() { try { return JSON.parse(root.localStorage.getItem(findKey()) || '[]'); } catch (e) { return []; } }
  function saveFound(list) { try { root.localStorage.setItem(findKey(), JSON.stringify(list)); } catch (e) { /* memory only */ } }
  function buildFinds() {
    var layer = $('hb-finds-layer');
    if (!layer) return;
    var got = foundList();
    layer.innerHTML = '';
    FINDS.forEach(function (f, i) {
      if (got.indexOf(f.id) !== -1) return;
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'hb-find'; b.setAttribute('aria-label', 'Hidden harbour treasure');
      b.style.left = pct(f.x, IMG_W); b.style.top = pct(f.y, IMG_H); b.style.animationDelay = (i * 0.9) + 's';
      b.innerHTML = '<img src="' + FLAT + f.img + '.webp" alt="" draggable="false">';
      b.onclick = function (e) {
        e.stopPropagation();
        var list = foundList(); if (list.indexOf(f.id) === -1) list.push(f.id); saveFound(list);
        b.classList.add('got');
        if (F().sparkleAt) F().sparkleAt(b, 10);
        if (A().sfxCoin) A().sfxCoin(); else if (A().sfxCorrect) A().sfxCorrect();
        if (root.WorldGame) {
          if (f.coins && root.WorldGame.addBonusCoins) root.WorldGame.addBonusCoins(f.coins);
          if (f.mat && root.WorldGame.giveMaterials) { var mObj = {}; mObj[f.mat] = 1; root.WorldGame.giveMaterials(mObj); }
        }
        var rect = b.getBoundingClientRect();
        if (UF() && UF().flyCoinsToHud) UF().flyCoinsToHud(f.coins || 3, rect.left + rect.width / 2, rect.top);
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
    if (box) {
      box.innerHTML = '<img src="' + FLAT + 'o_shell.webp" alt=""><b>' + n + '/' + FINDS.length + '</b>';
      box.classList.toggle('all', n >= FINDS.length);
      if (bump) { box.classList.remove('bump'); void box.offsetWidth; box.classList.add('bump'); }
    }
    if (UF()) UF().refreshAllUnifiedHuds(false);
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
    } catch (e2) { /* ignore */ }
  }
  function pct(v, of) { return (v / of * 100).toFixed(3) + '%'; }

  function fit() {
    if (!el.stage) return;
    var w = root.innerWidth, h = root.innerHeight, k = Math.min(w / IMG_W, h / IMG_H);
    if (w / h > IMG_W / IMG_H) k = Math.min(w / IMG_W, h / IMG_H * 1.08);
    el.stage.style.width = Math.round(IMG_W * k) + 'px';
    el.stage.style.height = Math.round(IMG_H * k) + 'px';
    cam.k = Math.round(IMG_W * k) / IMG_W;
    if ($('hb-turn')) $('hb-turn').classList.toggle('on', h > w * 1.15);
    place(el.hero, hero.x, hero.y); place(el.cat, cat.x, cat.y);
  }

  // 2.5D Y-perspective depth scaling so Hero & Benbow shrink up at the inn (y=372) and grow on the beach/pier (y=632)
  function place(node, x, y) {
    if (!node) return;
    node.style.left = pct(x, IMG_W);
    node.style.top = pct(y, IMG_H);
    node.style.zIndex = String(10 + Math.round(y));
    var pScale = UF() && UF().perspectiveScale ? UF().perspectiveScale(y, 355, 665, 0.64, 1.02) : (0.64 + Math.max(0, Math.min(1, (y - 355) / 310)) * 0.38);
    node.style.transform = 'translate(-50%, -100%) scale(' + pScale.toFixed(3) + ')';
  }

  /* ---------------------------------------------------------------- state on the map */
  function refresh() {
    if (!started || !el.root) return;
    var nx = nextStop();
    var allOpen = root.WorldGame && root.WorldGame.isAllChaptersUnlocked && root.WorldGame.isAllChaptersUnlocked();
    PLACES.forEach(function (p) {
      var b = $('hb-place-' + p.n);
      if (!b) return;
      var done = isDone(p.n);
      b.classList.toggle('done', done);
      b.classList.toggle('next', p.n === nx);
      b.classList.toggle('later', !allOpen && p.n > nx);
      var starImg = b.querySelector('.hb-star');
      if (starImg) starImg.src = KENNEY + (done ? 'star_gold.webp' : 'star_outline.webp');
    });
    var st = $('hb-stamps');
    if (st) {
      var html = '';
      for (var i = 1; i <= 5; i++) html += '<span class="hb-stamp' + (isDone(i) ? ' got' : '') + '"><img src="' + FLAT + 'o_map_stamp.webp" alt=""><b>' + i + '</b></span>';
      st.innerHTML = html;
    }
    if ($('hb-ship')) $('hb-ship').classList.toggle('ready', doneCount() >= 4 || allOpen);
    if (UF()) UF().refreshAllUnifiedHuds(false);
  }
  Harbour.refresh = refresh;

  /* ---------------------------------------------------------------- walking */
  function pathBetween(a, b) {
    var out = [], step = a <= b ? 1 : -1;
    for (var i = a; i !== b + step; i += step) out.push(i);
    return out;
  }
  function spawnDust(x, y) {
    if (!el.stage) return;
    var d = document.createElement('img');
    d.className = 'hb-dust';
    d.src = KENNEY + (Math.random() < 0.35 ? 'p_spark.webp' : 'p_smoke.webp');
    d.alt = '';
    d.style.left = pct(x + (Math.random() - 0.5) * 20, IMG_W);
    d.style.top = pct(y - 4 + (Math.random() - 0.5) * 10, IMG_H);
    d.style.zIndex = String(9 + Math.round(y));
    el.stage.appendChild(d);
    setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 520);
  }
  function walk(toNode, done) {
    if (hero.walking) return;
    var nodes = pathBetween(hero.node, toNode);
    if (nodes.length <= 1) { hero.node = toNode; hero.x = PATH[toNode][0]; hero.y = PATH[toNode][1]; place(el.hero, hero.x, hero.y); if (done) done(); return; }
    hero.walking = true;
    el.hero.classList.add('walking'); el.cat.classList.add('walking');
    var i = 1, speed = 0.31, lastDust = 0, lastSfx = 0;
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
      if (now - lastDust > 95) {
        lastDust = now;
        spawnDust(hero.x, hero.y);
      }
      if (now - lastSfx > 260) {
        lastSfx = now;
        if (A().sfxFootstep) A().sfxFootstep(surfaceAt(hero.x, hero.y));
      }
      trail.push([hero.x, hero.y]);
      if (trail.length > 24) {
        var c = trail.shift();
        cat.x = c[0] - 30 * hero.face; cat.y = c[1] + 6;
        el.cat.style.setProperty('--face', hero.face);
        place(el.cat, cat.x, cat.y);
      }
      if (f >= 1) {
        hero.node = nodes[i]; from = { x: hero.x, y: hero.y }; t0 = now; i++;
        if (i >= nodes.length) {
          hero.walking = false; trail = [];
          el.hero.classList.remove('walking'); el.cat.classList.remove('walking');
          idlePose();
          cat.x = hero.x - 62 * hero.face; cat.y = hero.y + 8; place(el.cat, cat.x, cat.y);
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
      var b = $('hb-place-' + nx);
      if (b) { b.classList.remove('nudge'); void b.offsetWidth; b.classList.add('nudge'); }
      say(nx === 1 ? 'First, tap Stop One at the inn door!' : 'First, solve Clue ' + nx + '!');
      return;
    }
    if (cam.overview) cam.overview = false;
    busy = true;
    walk(p.node, function () {
      if (Harbour.zoomTo) Harbour.zoomTo(p.x, p.y, function () { openStop(p.n); });
      else setTimeout(function () { openStop(p.n); }, 250);
    });
  }

  Harbour.walkToStop = function (n) {
    var idx = Math.max(1, Math.min(5, Number(n) || 1)) - 1;
    if (PLACES[idx]) goTo(PLACES[idx]);
  };

  function openStop(n) {
    var starPref = P() && P().isStarPreferred ? P().isStarPreferred() : false;
    var run = Harbour.stops[n];
    var finish = function (result) {
      busy = false;
      if (Harbour.zoomOut) Harbour.zoomOut();
      refresh();
      if (result && result.solved) celebrate(n);
    };
    if (starPref && root.Chapter1 && root.Chapter1.openClue) {
      var wasDone = isDone(n);
      root.Chapter1.openClue(n, 'star');
      watchOldClue(function () { finish({ solved: !wasDone && isDone(n) || isDone(n) }); });
    } else if (run) {
      run({ grade: grade(), stop: n, hero: heroSvg, done: finish, say: say });
    } else if (root.Chapter1 && root.Chapter1.openClue) {
      root.Chapter1.openClue(n, 'easy');
      watchOldClue(finish);
    } else {
      busy = false;
    }
  }

  function watchOldClue(finish) {
    var iv = setInterval(function () {
      if (!document.getElementById('ch1-modal-backdrop')) { clearInterval(iv); finish(); }
    }, 500);
  }

  function celebrate(n) {
    var placeBtn = $('hb-place-' + n);
    if (placeBtn && F().sparkleAt) F().sparkleAt(placeBtn, n === 5 ? 26 : 18);
    if (placeBtn && UF() && UF().flyCoinsToHud) {
      var pr = placeBtn.getBoundingClientRect();
      UF().flyCoinsToHud(n === 5 ? 25 : 10, pr.left + pr.width / 2, pr.top);
    }
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

  /* ---------------------------------------------------------------- start / pause / resume */
  Harbour.isActive = function () { return !!(started && !paused); };
  Harbour.openStop = openStop;
  Harbour.PLACES = PLACES;

  Harbour.pause = function () {
    paused = true;
    document.body.classList.remove('hb-on');
    if (el.root) el.root.style.display = 'none';
  };

  Harbour.start = function () {
    paused = false;
    document.body.classList.add('hb-on');
    if (started) {
      if (el.root) el.root.style.display = '';
      setupSprite();
      fit();
      refresh();
      return;
    }
    started = true;
    build();
    var nx = Math.min(5, nextStop());
    var node = PLACES[nx - 1].node;
    hero.node = nx === 1 ? 3 : Math.max(0, node - 1);
    hero.x = PATH[hero.node][0]; hero.y = PATH[hero.node][1];
    cat.x = hero.x - 58; cat.y = hero.y + 8;
    fit();
    refresh();
    setInterval(function () { if (!paused) refresh(); }, 2000);
    cam.overview = true; cam.fx = IMG_W / 2; cam.fy = IMG_H / 2;
    setTimeout(function () { cam.overview = false; if (UF()) UF().refreshAllUnifiedHuds(false); }, 1500);
    setTimeout(function () {
      if (paused) return;
      var nn = nextStop();
      var g = grade();
      var unitWelcome = g === 4
        ? 'Ahoy, Captain! Welcome to Chapter One: I Love Reading!'
        : 'Ahoy, Captain! Welcome to Chapter One: What Does It Do?';
      say(nn > 5 ? 'Well done, Captain! All five clues are solved! Tap the Hispaniola ship to sail to Chapter Two!' : (unitWelcome + ' Tap Stop ' + nn + '!'));
    }, 850);
  };

  root.Harbour = Harbour;
})(typeof window !== 'undefined' ? window : this);
