/* Game Maker: MONSTER CANNON — Real Mobile Game Rebuild (Wave 4 / Real-3).
   Full-screen 3-screen-wide living meadow (Classic sunny day / Halloween moonlit pumpkin field)
   with 5 parallax layers, separate rotating/recoiling cannon barrel & wheels, fizzing spark fuse,
   big 25%-height animated monsters (idle, wind-up, launch, flight, haystack/dizzy landing, celebrate,
   nice-try shrug), cheering buddy monster & ambient crowd, slow-motion bullseyes, and smooth camera follow. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {};
  GM.modes = GM.modes || {};
  var U = function () { return GM.u; };
  var A = function () { return GM.audio; };
  var J = function () { return GM.juice; };

  var VIEW_W = 1600, VIEW_H = 900, WORLD_W = 4200, GROUND = 715, G = 880;
  var CX = 355, CY = 585, MUZZLE = 148, MR = 58;
  var VALUES = [
    [10, 82, '#2aa8ff'],
    [20, 74, '#2ecc71'],
    [30, 66, '#ffb21a'],
    [50, 58, '#ff5d73']
  ];
  var WEIGHTS = [0.34, 0.30, 0.22, 0.14];
  var LEVELS = {
    easy:   { size: 1.05, dots: 14, wind: 0,   bob: 14, drift: 0,  count: 14 },
    normal: { size: 0.86, dots: 7,  wind: 105, bob: 38, drift: 18, count: 14 },
    hard:   { size: 0.72, dots: 3,  wind: 180, bob: 62, drift: 48, count: 12 }
  };

  function pickValue() {
    var r = Math.random(), k;
    for (k = 0; k < 4; k++) {
      r -= WEIGHTS[k];
      if (r <= 0) return VALUES[k];
    }
    return VALUES[0];
  }

  function loadImg(src) {
    var im = new Image();
    im.src = src;
    return im;
  }

  function imgReady(im) {
    return !!(im && im.complete && im.naturalWidth > 0);
  }

  function monImage(m) {
    var img = new Image();
    var svg = (GM.mon && GM.mon.svg) ? GM.mon.svg(m, 260) : '';
    if (!svg || svg.indexOf('<svg') < 0) return null;
    if (svg.indexOf('xmlns=') < 0) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    return img;
  }

  function drawOutlinedText(g, text, x, y, size, fill, stroke, align) {
    g.save();
    g.font = '900 ' + Math.round(size) + 'px Fredoka, "Baloo 2", sans-serif';
    g.textAlign = align || 'center';
    g.textBaseline = 'middle';
    g.lineJoin = 'round';
    g.lineWidth = Math.max(5, Math.round(size * 0.22));
    g.strokeStyle = stroke || '#0f172a';
    g.strokeText(text, x, y);
    g.fillStyle = fill || '#ffffff';
    g.fillText(text, x, y);
    g.restore();
  }

  function drawShadow(g, x, groundY, rx, ry, alpha) {
    if (alpha <= 0.02 || rx <= 1) return;
    g.save();
    g.fillStyle = 'rgba(15, 23, 42, ' + Math.min(0.55, Math.max(0, alpha)).toFixed(3) + ')';
    g.beginPath();
    g.ellipse(x, groundY, Math.max(2, rx), Math.max(2, ry), 0, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }

  function spawnWorldFloat(screenPt, text, cls) {
    if (!screenPt) return;
    var fakeEl = {
      getBoundingClientRect: function () {
        return { left: screenPt.x, top: screenPt.y, width: 0, height: 0 };
      }
    };
    U().floatText(text, fakeEl, cls || 'good');
  }

  function flyScoreToPod(screenPt, teamIdx, pts, onArrive) {
    var pod = document.querySelector('#gm-team-' + teamIdx + ' .gm-score') || document.getElementById('gm-team-' + teamIdx);
    var layer = document.getElementById('gm-fx');
    if (!pod || !layer || !screenPt) {
      if (onArrive) onArrive();
      return;
    }
    var r = pod.getBoundingClientRect();
    var tx = r.left + r.width / 2;
    var ty = r.top + r.height / 2;
    var orb = U().h('div', { class: 'gm-score-orb', text: '+' + pts });
    orb.style.left = Math.round(screenPt.x) + 'px';
    orb.style.top = Math.round(screenPt.y) + 'px';
    layer.appendChild(orb);
    setTimeout(function () {
      orb.style.left = Math.round(tx) + 'px';
      orb.style.top = Math.round(ty) + 'px';
      orb.style.transform = 'translate(-50%, -50%) scale(0.75)';
    }, 24);
    setTimeout(function () {
      if (orb.parentNode) orb.parentNode.removeChild(orb);
      if (onArrive) onArrive();
    }, 640);
  }

  GM.modes.cannon = {
    id: 'cannon',
    name: 'Monster Cannon',
    e: '🎯',
    desc: 'Answer right: your monster hops into the big cannon! Drag back to aim angle & power, launch across the meadow, pop balloons and land in the haystack!',
    fields: [
      { key: 'level', label: 'Difficulty', opts: [['easy', 'Easy', 'Big balloons'], ['normal', 'Normal', 'Wind, moving balloons'], ['hard', 'Hard', 'Small, fast, strong wind']], def: 'normal' },
      { key: 'shots', label: 'Shots for each team', opts: [[2, '2'], [3, '3'], [4, '4'], [5, '5']], def: 3 }
    ],
    start: function (ctx) {
      var st = GM.state, T = st.teams, nt = T.length;
      var totalShots = (+ctx.cfg.shots || 3) * nt;
      var shot = 0, turn = 0;
      var hal = st.theme === 'halloween';
      var L = LEVELS[ctx.cfg.level] || LEVELS.normal;
      var alive = true, ended = false, raf = 0;

      try { A().musicStart(hal ? 'halloween' : 'cannon'); } catch (e) { /* ignore */ }

      var rootEl = ctx.root;
      rootEl.innerHTML = '';

      var scene = U().h('div', { class: 'gm-real3-scene gm-cannonbox' });
      var cv = U().h('canvas', { class: 'gm-real3-cv gm-cannon-cv', width: VIEW_W, height: VIEW_H });
      var banner = U().h('div', { class: 'gm-real3-banner' });
      var dock = U().h('div', { class: 'gm-real3-dock' });
      scene.appendChild(cv);
      var wrap = U().h('div', { class: 'gm-boardwrap' }, [scene, banner, dock]);
      rootEl.appendChild(wrap);

      /* Preload all art with fallbacks */
      var artBgClassic  = loadImg('art/bg_cannon_wide.webp');
      var artBgHal      = loadImg('art/bg_cannon_wide_hal.webp');
      var artBgFallback = loadImg('art/bg_classic_cannon.webp');
      var artBarrel     = loadImg('art/o_cannon_barrel.webp');
      var artWheels     = loadImg('art/o_cannon_wheels.webp');
      var artCannonOld  = loadImg('art/o_cannon.webp');
      var artHaystack   = loadImg('art/o_haystack.webp');
      var artTarget     = loadImg('art/o_target.webp');
      var artStarCoin   = loadImg('art/o_star_coin.webp');
      var artLantern    = loadImg('art/o_candle_lantern.webp');
      var balImgs = {
        10: loadImg('art/o_balloon_blue.webp'),
        20: loadImg('art/o_balloon_green.webp'),
        30: loadImg('art/o_balloon_yellow.webp'),
        50: loadImg('art/o_balloon_red.webp')
      };
      var monImgs = T.map(function (t) { return monImage(t.mon); });

      var g = cv.getContext('2d');
      var dpr = Math.min(1.5, root.devicePixelRatio || 1);

      function fitCanvas() {
        var bw = scene.clientWidth || root.innerWidth || 1366;
        var bh = scene.clientHeight || root.innerHeight || 768;
        VIEW_H = 900;
        VIEW_W = Math.round(Math.max(1200, Math.min(2100, VIEW_H * (bw / Math.max(1, bh)))));
        cv.width = Math.round(VIEW_W * dpr);
        cv.height = Math.round(VIEW_H * dpr);
      }
      fitCanvas();
      var ro = root.ResizeObserver ? new ResizeObserver(fitCanvas) : null;
      if (ro) ro.observe(scene);

      /* World entities & state machine */
      /* mode: 'wait' | 'shrug' | 'load' | 'aim' | 'fuse' | 'fly' | 'land' | 'finale' */
      var mode = 'wait';
      var phaseT = 0;
      var aim = null;
      var queuedLaunch = null;
      var ball = null;
      var trail = [];
      var parts = [];
      var targets = [];
      var starCoins = [];
      var haystacks = [
        { x: 1440, y: GROUND, r: 96, wobble: 0 },
        { x: 2220, y: GROUND, r: 98, wobble: 0 },
        { x: 2980, y: GROUND, r: 96, wobble: 0 },
        { x: 3720, y: GROUND, r: 98, wobble: 0 }
      ];
      var bullseye = { x: 3420, y: GROUND - 135, r: 84, hit: 0, wobble: 0 };
      var clouds = [];
      var flyers = [];
      var crowd = [];
      var fgTufts = [];

      var hitThisShot = 0;
      var recoil = 0;
      var barrelSquash = 0;
      var wind = 0;
      var restA = -0.58;
      var peek = 0;
      var crowdCheerT = 0;
      var slowMoT = 0;
      var shockwaves = [];
      var cam = { x: 0, y: 0, zoom: 1, tx: 0, ty: 0, tzoom: 1, shakeT: 0, shakeMag: 0 };
      var landInfo = { type: 'grass', x: CX, y: GROUND, t: 0, bonus: 0 };

      for (var ck = 0; ck < 11; ck++) {
        clouds.push({
          x: ck * 390 + Math.random() * 180,
          y: 65 + (ck % 3) * 62 + Math.random() * 30,
          s: 0.62 + (ck % 4) * 0.2,
          v: 12 + (ck % 3) * 7
        });
      }
      for (var fk = 0; fk < 7; fk++) {
        flyers.push({
          x: 300 + fk * 520 + Math.random() * 200,
          y: 120 + (fk % 3) * 65,
          v: 38 + (fk % 3) * 16,
          ph: fk * 1.3
        });
      }
      for (var cr = 0; cr < 5; cr++) {
        crowd.push({
          x: 75 + cr * 42,
          y: CY + 46 - (cr % 2) * 10,
          c: ['#38bdf8', '#f59e0b', '#10b981', '#f43f5e', '#a855f7'][cr % 5],
          ph: cr * 0.9
        });
      }
      for (var fg = 0; fg < 24; fg++) {
        fgTufts.push({
          x: fg * 210 + (fg % 3) * 35,
          s: 0.75 + (fg % 3) * 0.2,
          type: fg % 4
        });
      }

      function addPart(p) {
        if (parts.length >= 150) parts.shift();
        parts.push(p);
      }

      function triggerShake(mag, dur) {
        cam.shakeMag = Math.min(6, mag || 4);
        cam.shakeT = Math.min(0.28, dur || 0.22);
      }

      function spawnTargets() {
        targets = targets.filter(function (t) { return !t.pop; });
        var tries = 0;
        while (targets.length < L.count && tries++ < 500) {
          var v = pickValue();
          var r = Math.round(v[1] * L.size);
          var x = 880 + Math.random() * (WORLD_W - 1280);
          var y = 165 + Math.random() * 410;
          var ok = true;
          targets.forEach(function (o) {
            if (Math.hypot(o.x - x, o.y - y) < o.r + r + 50) ok = false;
          });
          if (ok) {
            targets.push({
              x: x, y: y, bx: x, r: r, v: v[0], c: v[2],
              ph: Math.random() * 6.28,
              sp: 0.7 + Math.random() * 0.7 + v[0] / 70,
              pop: 0
            });
          }
        }
        starCoins = [
          { x: 1320, y: 265, r: 42, hit: 0, ph: 0.4 },
          { x: 2100, y: 220, r: 42, hit: 0, ph: 1.9 },
          { x: 2840, y: 255, r: 42, hit: 0, ph: 3.4 }
        ];
        bullseye.hit = 0;
      }

      function newWind() {
        wind = L.wind ? Math.round((Math.random() * 2 - 1) * L.wind) : 0;
      }

      spawnTargets();

      function screenToWorld(clientX, clientY) {
        var r = cv.getBoundingClientRect();
        var sx = (clientX - r.left) / Math.max(1, r.width) * VIEW_W;
        var sy = (clientY - r.top) / Math.max(1, r.height) * VIEW_H;
        var wx = (sx - VIEW_W * 0.5) / cam.zoom + VIEW_W * 0.5 + cam.x;
        var wy = (sy - VIEW_H * 0.5) / cam.zoom + VIEW_H * 0.5 + cam.y;
        return { x: wx, y: wy };
      }

      function worldToScreen(wx, wy) {
        var r = cv.getBoundingClientRect();
        var sx = ((wx - cam.x - VIEW_W * 0.5) * cam.zoom + VIEW_W * 0.5) / VIEW_W * r.width + r.left;
        var sy = ((wy - cam.y - VIEW_H * 0.5) * cam.zoom + VIEW_H * 0.5) / VIEW_H * r.height + r.top;
        return { x: sx, y: sy };
      }

      function launchVec(p) {
        /* Support both slingshot pull-back (left of cannon) AND direct drag/point (right of cannon) */
        var dx, dy;
        if (p.x < CX + 10) {
          dx = CX - p.x;
          dy = CY - p.y;
        } else {
          dx = (p.x - CX) * 0.45;
          dy = (p.y - CY) * 0.45;
        }
        var d = Math.min(340, Math.max(55, Math.hypot(dx, dy)));
        var a = Math.atan2(dy, dx);
        a = Math.max(-1.35, Math.min(-0.22, a));
        var speed = d * 4.85;
        return {
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
          pull: d,
          a: a
        };
      }

      function barrelAngle(now) {
        if (mode === 'fuse' && queuedLaunch) return queuedLaunch.a;
        if (mode === 'aim' && aim) return launchVec(aim).a;
        return restA + Math.sin(now / 750) * 0.035;
      }

      function puff(x, y, n, cols, upBias) {
        for (var k = 0; k < n; k++) {
          var a = Math.random() * Math.PI * 2;
          var s = 90 + Math.random() * 340;
          addPart({
            x: x, y: y,
            vx: Math.cos(a) * s,
            vy: Math.sin(a) * s - (upBias != null ? upBias : 110),
            life: 0.55 + Math.random() * 0.45,
            t: 0,
            c: cols[k % cols.length],
            r: 6 + Math.random() * 10
          });
        }
      }

      function updateBanner(title, sub, compact) {
        var t = T[turn] || T[0];
        banner.style.setProperty('--c', t.color || '#38bdf8');
        banner.innerHTML = '';
        banner.appendChild(U().monFace(t.mon, 44));
        banner.appendChild(U().h('b', { text: title }));
        if (sub) banner.appendChild(U().h('span', { class: 'gm-real3-sub', text: sub }));
        banner.className = 'gm-real3-banner in' + (compact ? ' compact' : '');
      }

      function beginFuseAndFire(vec) {
        if (mode !== 'aim') return;
        queuedLaunch = vec;
        restA = vec.a;
        aim = null;
        mode = 'fuse';
        phaseT = 0;
        dock.innerHTML = '';
        updateBanner('🔥 Fuse lit! Ready... BOOM!', 'Hold on!', true);
        A().play('fuse_fizz');
        A().play('crowd_ooh');
      }

      function fireCannonNow() {
        var v = queuedLaunch || { a: -0.68, vx: 1020, vy: -820, pull: 275 };
        mode = 'fly';
        phaseT = 0;
        var mx = CX + Math.cos(v.a) * MUZZLE;
        var my = CY + Math.sin(v.a) * MUZZLE;
        ball = {
          x: mx,
          y: my,
          vx: v.vx,
          vy: v.vy,
          rot: 0,
          t: 0,
          bounces: 0
        };
        trail = [];
        hitThisShot = 0;
        recoil = 1;
        barrelSquash = -0.35;
        triggerShake(6, 0.25);
        puff(mx, my, 24, ['#ffffff', '#fde047', '#fb923c', '#94a3b8'], 80);
        shockwaves.push({ x: mx, y: my, r: 20, maxR: 135, t: 0, c: '#fde047' });
        A().play('cannon_boom');
        A().play('cannon_fly');
      }

      function quickShot() {
        if (mode !== 'aim') return;
        var targetBal = targets.filter(function (b) { return !b.pop; })[0];
        var ang = -0.66 - Math.random() * 0.16;
        var pull = 275 + Math.random() * 45;
        if (targetBal) {
          var dist = Math.max(600, Math.min(2800, targetBal.x - CX));
          pull = Math.max(215, Math.min(330, 175 + dist * 0.052));
        }
        var speed = pull * 4.85;
        beginFuseAndFire({
          a: ang,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          pull: pull
        });
      }

      /* Pointer & keyboard controls */
      function onDown(e) {
        if (mode !== 'aim') return;
        e.preventDefault();
        aim = screenToWorld(e.clientX, e.clientY);
        A().play('cannon_stretch');
      }
      function onMove(e) {
        if (mode === 'aim' && aim) {
          aim = screenToWorld(e.clientX, e.clientY);
        }
      }
      function onUp() {
        if (mode !== 'aim' || !aim) return;
        var v = launchVec(aim);
        beginFuseAndFire(v);
      }
      function onKey(e) {
        if (!alive) return;
        if (e.code === 'Space' || e.key === ' ') {
          if (document.querySelector('.gm-over')) return;
          if (mode === 'wait' && !asking) {
            e.preventDefault();
            askQuestion();
          }
        }
      }

      cv.addEventListener('pointerdown', onDown);
      cv.addEventListener('pointermove', onMove);
      root.addEventListener('pointerup', onUp);
      root.addEventListener('keydown', onKey);

      ctx.onEnd(function () {
        alive = false;
        cancelAnimationFrame(raf);
        if (ro) ro.disconnect();
        root.removeEventListener('pointerup', onUp);
        root.removeEventListener('keydown', onKey);
      });

      function popBalloon(t) {
        t.pop = 1;
        hitThisShot += t.v;
        crowdCheerT = 1.1;
        puff(t.x, t.ry || t.y, 22, [t.c, '#ffffff', '#fde047', '#38bdf8'], 120);
        shockwaves.push({ x: t.x, y: t.ry || t.y, r: 16, maxR: t.v >= 50 ? 150 : 95, t: 0, c: t.c });
        A().play('balloon_pop');
        A().play('coin_collect');
        if (t.v >= 30) A().play('sparkle');
        if (t.v >= 50) {
          slowMoT = 0.62;
          A().play('crowd_roar_big');
          triggerShake(6, 0.25);
        } else {
          triggerShake(4, 0.16);
        }
        var sp = worldToScreen(t.x, t.ry || t.y);
        spawnWorldFloat(sp, '+' + t.v, 'good');
      }

      function hitStarCoin(sc) {
        sc.hit = 1;
        hitThisShot += 15;
        crowdCheerT = 0.9;
        puff(sc.x, sc.ry || sc.y, 18, ['#fde047', '#ffffff', '#f59e0b'], 100);
        A().play('star_pickup');
        A().play('coin_collect');
        var sp = worldToScreen(sc.x, sc.ry || sc.y);
        spawnWorldFloat(sp, '⭐ +15', 'good');
      }

      function hitBullseyeStand() {
        if (bullseye.hit) return;
        bullseye.hit = 1;
        bullseye.wobble = 1.0;
        hitThisShot += 50;
        crowdCheerT = 1.5;
        slowMoT = 0.68;
        puff(bullseye.x, bullseye.y, 28, ['#ff5d73', '#fde047', '#ffffff', '#38bdf8'], 150);
        shockwaves.push({ x: bullseye.x, y: bullseye.y, r: 20, maxR: 180, t: 0, c: '#fde047' });
        A().play('crowd_roar_big');
        A().play('sparkle');
        A().play('slot_high');
        triggerShake(6, 0.26);
        var sp = worldToScreen(bullseye.x, bullseye.y - 20);
        spawnWorldFloat(sp, '🎯 BULLSEYE +50!', 'good');
      }

      function finishLanding(inHay, hayObj) {
        var lx = ball ? ball.x : CX + 800;
        if (inHay && hayObj) {
          hayObj.wobble = 1.0;
          lx = hayObj.x;
          hitThisShot += 15;
          landInfo = { type: 'haystack', x: lx, y: GROUND, t: 0, bonus: 15 };
          puff(lx, GROUND - 40, 26, hal ? ['#f97316', '#eab308', '#dc2626', '#fde047'] : ['#fde047', '#f59e0b', '#fef08a', '#ffffff'], 160);
          A().play('haystack_poof');
        } else {
          landInfo = { type: 'grass', x: lx, y: GROUND, t: 0, bonus: 0 };
          puff(lx, GROUND - 10, 16, ['#86efac', '#ffffff', '#fde047'], 90);
          A().play('ground_bounce');
        }

        mode = 'land';
        phaseT = 0;
        ball = null;
        crowdCheerT = 1.4;

        var totalPts = Math.max(5, hitThisShot);
        var activeTurn = turn;
        var sp = worldToScreen(lx, GROUND - 90);

        if (inHay) {
          spawnWorldFloat({ x: sp.x, y: sp.y - 38 }, (hal ? '🍂 Leaf Pile +15!' : '🌾 Haystack +15!'), 'good');
        } else if (hitThisShot === 0) {
          spawnWorldFloat({ x: sp.x, y: sp.y - 28 }, 'Nice flight! +5', 'good');
        }

        if (totalPts >= 50) {
          A().play('crowd_roar_big');
          A().play('cheer_kids');
          U().confetti(32);
        } else if (totalPts >= 20) {
          A().play('crowd_cheer_small');
        } else {
          A().play('crowd_ooh');
        }

        updateBanner('🎉 ' + T[activeTurn].name + ' scores +' + totalPts + '!', inHay ? 'Soft landing!' : 'Great jump!', false);

        flyScoreToPod(sp, activeTurn, totalPts, function () {
          if (!alive) return;
          U().addScore(activeTurn, totalPts);
        });

        shot++;
        setTimeout(function () {
          if (!alive) return;
          if (shot >= totalShots) {
            startFinale();
            return;
          }
          spawnTargets();
          turn = (turn + 1) % nt;
          showTurn();
        }, 2100);
      }

      function startFinale() {
        if (ended) return;
        mode = 'finale';
        phaseT = 0;
        dock.innerHTML = '';
        updateBanner('🏆 Amazing Flying Show!', 'Everyone celebrates!', false);
        A().play('crowd_roar_big');
        A().play('win_fanfare');
        U().confetti(45);
        setTimeout(function () {
          if (!alive || ended) return;
          ended = true;
          ctx.end();
        }, 1750);
      }

      function showTurn() {
        var t = T[turn];
        mode = 'wait';
        phaseT = 0;
        peek = 0;
        aim = null;
        U().teamBar(T, turn);
        updateBanner(t.name + "\u2019s Turn!", 'Shot ' + (shot + 1) + ' of ' + totalShots, false);
        dock.innerHTML = '';
        var askBtn = U().h('button', {
          type: 'button',
          class: 'gm-real3-btn amber pulse',
          text: '❓ Ask & Load Cannon! (Space)'
        });
        askBtn.addEventListener('click', function () {
          A().play('tap');
          askQuestion();
        });
        dock.appendChild(askBtn);
      }

      var asking = false;
      async function askQuestion() {
        if (asking || mode !== 'wait') return;
        asking = true;
        dock.innerHTML = '';
        var t = T[turn];
        var res = await U().ask(ctx.nextItem(), t, {
          timer: +ctx.cfg.timer || 0,
          label: 'Shot ' + (shot + 1) + ' of ' + totalShots
        });
        asking = false;
        if (!alive) return;

        if (!res || !res.ok) {
          mode = 'shrug';
          phaseT = 0;
          A().play('crowd_aww_soft');
          var sp = worldToScreen(CX - 150, CY - 25);
          spawnWorldFloat(sp, 'Nice try! 😊', 'soft');
          updateBanner('😊 Nice try, ' + t.name + '!', 'Next team is up!', false);
          shot++;
          setTimeout(function () {
            if (!alive) return;
            if (shot >= totalShots) {
              startFinale();
              return;
            }
            turn = (turn + 1) % nt;
            showTurn();
          }, 1400);
          return;
        }

        mode = 'load';
        phaseT = 0;
        restA = -0.58;
        peek = 0;
        newWind();
        A().play('cannon_load');
        A().play('hunt_step');
        updateBanner('🏃 ' + t.name + ' hops into the cannon!', 'Get ready to aim!', true);
      }

      function enterAimMode() {
        mode = 'aim';
        phaseT = 0;
        peek = 0;
        A().play('round_start');
        updateBanner('🎯 Drag back from the cannon & release to launch!', wind ? ('Wind ' + (wind > 0 ? '→ ' : '← ') + Math.abs(wind)) : 'Calm sky', true);
        dock.innerHTML = '';
      }

      /* ---- Drawing Helpers ---- */
      function drawMonsterPose(img, x, y, size, stateName, now, teamColor, watchTargetX) {
        g.save();
        g.translate(x, y);
        var sx = 1, sy = 1, rot = 0, bobY = 0;

        if (stateName === 'idle') {
          sx = 1 + Math.sin(now / 260) * 0.045;
          sy = 1 - Math.sin(now / 260) * 0.045;
          bobY = -Math.abs(Math.sin(now / 320)) * 8;
          rot = Math.sin(now / 520) * 0.04;
        } else if (stateName === 'watch') {
          var lookDir = (watchTargetX != null && watchTargetX > x) ? 1 : -1;
          sx = 1 + Math.sin(now / 220) * 0.05;
          sy = 1 - Math.sin(now / 220) * 0.05;
          bobY = crowdCheerT > 0 ? -Math.abs(Math.sin(now / 110)) * 22 : -Math.abs(Math.sin(now / 300)) * 6;
          rot = lookDir * 0.09 + (crowdCheerT > 0 ? Math.sin(now / 90) * 0.12 : 0);
        } else if (stateName === 'shrug') {
          bobY = -Math.sin(Math.min(1, phaseT * 2.5) * Math.PI) * 14;
          rot = Math.sin(now / 140) * 0.14;
          sx = 1.06;
          sy = 0.94;
        } else if (stateName === 'celebrate') {
          bobY = -Math.abs(Math.sin(now / 125)) * 34;
          rot = Math.sin(now / 160) * 0.15;
          sx = 1 + Math.sin(now / 125) * 0.08;
          sy = 1 - Math.sin(now / 125) * 0.08;
        }

        /* Ground contact shadow + glowing team pedestal ring under feet */
        drawShadow(g, 0, size * 0.44, size * 0.36 * (1 - Math.min(0.45, -bobY / 90)), size * 0.11, 0.38);
        if (teamColor) {
          g.strokeStyle = teamColor;
          g.lineWidth = 4;
          g.beginPath();
          g.ellipse(0, size * 0.44, size * 0.32, size * 0.09, 0, 0, Math.PI * 2);
          g.stroke();
        }

        g.translate(0, bobY);
        g.rotate(rot);
        g.scale(sx, sy);

        if (imgReady(img)) {
          g.drawImage(img, -size / 2, -size / 2, size, size);
        } else {
          g.fillStyle = teamColor || '#38bdf8';
          g.strokeStyle = '#ffffff';
          g.lineWidth = 5;
          g.beginPath();
          g.arc(0, 0, size * 0.38, 0, Math.PI * 2);
          g.fill();
          g.stroke();
        }

        if (stateName === 'shrug') {
          drawOutlinedText(g, '😊', size * 0.36, -size * 0.38, 36, '#fde047', '#0f172a');
        }
        g.restore();
      }

      function drawParallaxWorld(now) {
        /* 0. Far Sky Layer */
        var skyGr = g.createLinearGradient(0, 0, 0, VIEW_H);
        if (hal) {
          skyGr.addColorStop(0, '#1a0938');
          skyGr.addColorStop(0.55, '#3b1578');
          skyGr.addColorStop(1, '#25104a');
        } else {
          skyGr.addColorStop(0, '#38bdf8');
          skyGr.addColorStop(0.58, '#93e1ff');
          skyGr.addColorStop(1, '#4ade80');
        }
        g.fillStyle = skyGr;
        g.fillRect(cam.x - 400, cam.y - 300, VIEW_W + 800, VIEW_H + 600);

        /* 1. Wide 3D Panoramic Background Art (stretched across the 4200px world, keeping the lush 3D grass & hill!) */
        var chosenBg = hal ? (imgReady(artBgHal) ? artBgHal : artBgClassic) : (imgReady(artBgClassic) ? artBgClassic : artBgFallback);
        if (imgReady(chosenBg)) {
          var tileW = 2300;
          var x0 = -120;
          var seam1 = x0 + tileW;
          g.drawImage(chosenBg, x0, -20, tileW, VIEW_H + 40);
          g.save();
          g.translate(seam1 + tileW, 0);
          g.scale(-1, 1);
          g.drawImage(chosenBg, 0, -20, tileW, VIEW_H + 40);
          g.restore();
          if (hal && chosenBg !== artBgHal) {
            g.fillStyle = 'rgba(30, 12, 68, 0.52)';
            g.fillRect(-120, 0, WORLD_W + 400, VIEW_H);
          }
        } else {
          /* Fallback meadow if image is missing */
          g.fillStyle = hal ? '#31135e' : '#4ade80';
          g.fillRect(-200, GROUND - 40, WORLD_W + 600, VIEW_H - GROUND + 180);
        }

        /* Drifting clouds in upper sky (0.35x parallax) */
        clouds.forEach(function (c) {
          var cx = c.x - cam.x * 0.55 + cam.x;
          var cy = c.y;
          var s = c.s;
          g.fillStyle = hal ? 'rgba(196, 181, 253, 0.14)' : 'rgba(255, 255, 255, 0.55)';
          g.beginPath();
          g.ellipse(cx, cy, 82 * s, 28 * s, 0, 0, Math.PI * 2);
          g.ellipse(cx + 50 * s, cy - 12 * s, 54 * s, 24 * s, 0, 0, Math.PI * 2);
          g.ellipse(cx - 48 * s, cy - 7 * s, 44 * s, 20 * s, 0, 0, Math.PI * 2);
          g.fill();
        });

        /* Ambient flyers: birds (Classic) or cute purple bats (Halloween) */
        flyers.forEach(function (fl) {
          var fx = fl.x;
          var fy = fl.y + Math.sin(now / 320 + fl.ph) * 14;
          var wing = Math.sin(now / 95 + fl.ph) * 12;
          g.save();
          g.translate(fx, fy);
          g.strokeStyle = hal ? '#e9d5ff' : '#1e293b';
          g.lineWidth = 4;
          g.lineCap = 'round';
          g.beginPath();
          g.moveTo(-16, wing);
          g.quadraticCurveTo(-7, -8, 0, 0);
          g.quadraticCurveTo(7, -8, 16, wing);
          g.stroke();
          g.restore();
        });

        /* Distance signposts along the 3D meadow path */
        [1050, 1850, 2650, 3450].forEach(function (dx, idx) {
          var meters = (idx + 1) * 100;
          g.save();
          g.translate(dx, GROUND);
          drawShadow(g, 0, 6, 28, 8, 0.32);
          g.fillStyle = '#78350f';
          g.strokeStyle = '#1f2a44';
          g.lineWidth = 4;
          g.fillRect(-6, -52, 12, 52);
          g.strokeRect(-6, -52, 12, 52);
          g.fillStyle = hal ? '#fef08a' : '#ffffff';
          g.beginPath();
          g.roundRect(-48, -84, 96, 36, 10);
          g.fill();
          g.stroke();
          drawOutlinedText(g, meters + 'm', 0, -66, 24, '#ffffff', '#1f2a44');
          g.restore();
        });

        /* Ambient cheering mini-crowd on the hill */
        crowd.forEach(function (c) {
          var jump = crowdCheerT > 0 ? Math.abs(Math.sin(now / 95 + c.ph)) * 22 : Math.abs(Math.sin(now / 360 + c.ph)) * 5;
          g.save();
          g.translate(c.x, c.y - jump);
          drawShadow(g, 0, jump + 4, 14, 5, 0.28);
          g.fillStyle = c.c;
          g.strokeStyle = '#1f2a44';
          g.lineWidth = 3.5;
          g.beginPath();
          g.arc(0, -14, 14, 0, Math.PI * 2);
          g.fill();
          g.stroke();
          g.fillStyle = '#ffffff';
          g.beginPath();
          g.arc(-4.5, -16, 3.2, 0, Math.PI * 2);
          g.arc(4.5, -16, 3.2, 0, Math.PI * 2);
          g.fill();
          g.restore();
        });

        /* Waiting team's monster cheering / watching on the hilltop */
        if (nt > 1 && mode !== 'finale') {
          var waitIdx = (turn + 1) % nt;
          var watchX = ball ? ball.x : (mode === 'land' ? landInfo.x : CX + 200);
          drawMonsterPose(
            monImgs[waitIdx],
            125,
            CY - 8,
            162,
            crowdCheerT > 0 ? 'celebrate' : 'watch',
            now,
            T[waitIdx].color,
            watchX
          );
        }

        /* Haystacks along the meadow */
        haystacks.forEach(function (hs) {
          var wob = hs.wobble > 0 ? Math.sin(now / 45) * hs.wobble * 0.14 : 0;
          var scX = 1 + (hs.wobble > 0 ? Math.sin(now / 45) * hs.wobble * 0.12 : 0);
          var scY = 1 - (hs.wobble > 0 ? Math.sin(now / 45) * hs.wobble * 0.10 : 0);
          g.save();
          g.translate(hs.x, hs.y);
          drawShadow(g, 0, 10, 96, 22, 0.38);
          g.rotate(wob);
          g.scale(scX, scY);
          if (imgReady(artHaystack)) {
            g.drawImage(artHaystack, -108, -162, 216, 176);
          } else {
            g.fillStyle = hal ? '#ea580c' : '#eab308';
            g.strokeStyle = '#1f2a44';
            g.lineWidth = 6;
            g.beginPath();
            g.arc(0, -20, 88, Math.PI, 0);
            g.closePath();
            g.fill();
            g.stroke();
          }
          if (hal && imgReady(artLantern)) {
            g.drawImage(artLantern, 74, -68, 56, 68);
          }
          g.restore();
        });

        /* Far 50-point Bullseye Target Stand (o_target) */
        g.save();
        g.translate(bullseye.x, bullseye.y);
        drawShadow(g, 0, GROUND - bullseye.y + 8, 72, 18, 0.38);
        var bWob = bullseye.wobble > 0 ? Math.sin(now / 40) * bullseye.wobble * 0.18 : Math.sin(now / 600) * 0.03;
        g.rotate(bWob);
        if (imgReady(artTarget)) {
          g.drawImage(artTarget, -86, -86, 172, 172);
        } else {
          g.fillStyle = '#ef4444';
          g.strokeStyle = '#ffffff';
          g.lineWidth = 6;
          g.beginPath(); g.arc(0, 0, 72, 0, Math.PI * 2); g.fill(); g.stroke();
        }
        drawOutlinedText(g, '+50', 0, -98, 30, '#fde047', '#0f172a');
        g.restore();

        /* Floating Star Coins (+15) */
        starCoins.forEach(function (sc) {
          if (sc.hit) return;
          var sy = sc.y + Math.sin(now / 380 + sc.ph) * 16;
          sc.ry = sy;
          drawShadow(g, sc.x, GROUND + 4, 24, 7, 0.18);
          g.save();
          g.translate(sc.x, sy);
          g.scale(1 + Math.sin(now / 260 + sc.ph) * 0.06, 1);
          if (imgReady(artStarCoin)) {
            g.drawImage(artStarCoin, -44, -44, 88, 88);
          } else {
            g.fillStyle = '#fde047';
            g.strokeStyle = '#b45309';
            g.lineWidth = 4;
            g.beginPath(); g.arc(0, 0, 34, 0, Math.PI * 2); g.fill(); g.stroke();
          }
          drawOutlinedText(g, '+15', 0, 48, 24, '#fde047', '#0f172a');
          g.restore();
        });
      }

      function drawBalloons(now) {
        targets.forEach(function (t) {
          if (t.pop) return;
          var y = t.y + Math.sin(now / 650 * t.sp + t.ph) * L.bob;
          if (L.drift) t.x = t.bx + Math.sin(now / 1050 * t.sp + t.ph * 2) * L.drift;
          t.ry = y;

          var altFactor = Math.max(0.12, 1 - (GROUND - y) / 680);
          drawShadow(g, t.x, GROUND + 6, t.r * 0.55 * altFactor, t.r * 0.14 * altFactor, 0.24 * altFactor);

          var sway = Math.sin(now / 420 + t.ph) * 14;
          g.strokeStyle = hal ? 'rgba(255, 255, 255, 0.72)' : 'rgba(31, 42, 68, 0.65)';
          g.lineWidth = 3.5;
          g.beginPath();
          g.moveTo(t.x, y + t.r * 0.92);
          g.quadraticCurveTo(t.x + sway, y + t.r + 36, t.x + sway * 0.4, y + t.r + 74);
          g.stroke();

          var bIm = balImgs[t.v];
          if (imgReady(bIm)) {
            g.drawImage(bIm, t.x - t.r * 1.18, y - t.r * 1.18, t.r * 2.36, t.r * 2.36);
          } else {
            var gr = g.createRadialGradient(t.x - t.r * 0.35, y - t.r * 0.4, t.r * 0.1, t.x, y, t.r);
            gr.addColorStop(0, '#ffffff');
            gr.addColorStop(0.25, t.c);
            gr.addColorStop(1, t.c);
            g.fillStyle = gr;
            g.strokeStyle = '#1f2a44';
            g.lineWidth = 5;
            g.beginPath();
            g.ellipse(t.x, y, t.r * 0.9, t.r, 0, 0, Math.PI * 2);
            g.fill();
            g.stroke();
          }
          drawOutlinedText(g, String(t.v), t.x, y + 2, Math.max(24, t.r * 0.64), '#ffffff', '#0f172a');
        });
      }

      function drawCannonAndActors(now) {
        var a = barrelAngle(now);
        var back = recoil * 34;
        var sqX = 1 + barrelSquash * 0.22;
        var sqY = 1 - barrelSquash * 0.18;

        /* Ground shadow under cannon on the 3D hill */
        drawShadow(g, CX, CY + 64, 130, 26, 0.45);

        /* Acting monster standing in 'wait' or 'shrug' beside the cannon */
        if (mode === 'wait' || mode === 'shrug') {
          drawMonsterPose(
            monImgs[turn],
            CX - 135,
            CY - 22,
            212,
            mode === 'shrug' ? 'shrug' : 'idle',
            now,
            T[turn].color
          );
        }

        /* Acting monster running & hopping into the barrel ('load' state) */
        if (mode === 'load') {
          var lt = phaseT;
          var mx = CX + Math.cos(restA) * (MUZZLE - 10);
          var my = CY + Math.sin(restA) * (MUZZLE - 10);
          var x, y, sc = 1, rot = 0;
          if (lt < 0.6) {
            var k = lt / 0.6;
            x = (CX - 135) + 45 * k;
            y = (CY - 22) - Math.abs(Math.sin(k * Math.PI * 3)) * 28;
          } else if (lt < 1.15) {
            var k2 = (lt - 0.6) / 0.55;
            var sx0 = CX - 90, sy0 = CY - 22;
            x = sx0 + (mx - sx0) * k2;
            y = sy0 + (my - sy0) * k2 - Math.sin(k2 * Math.PI) * 230;
            sc = 1 - k2 * 0.32;
            rot = k2 * Math.PI * 1.6;
          } else {
            puff(mx, my, 16, ['#ffffff', '#fde047', T[turn].color || '#38bdf8'], 60);
            triggerShake(4, 0.15);
            enterAimMode();
            return;
          }
          var mImg = monImgs[turn];
          if (imgReady(mImg)) {
            g.save();
            g.translate(x, y);
            g.rotate(rot);
            g.scale(sc, sc);
            g.drawImage(mImg, -105, -105, 210, 210);
            g.restore();
          }
        }

        /* Monster peeking out of the cannon muzzle during 'aim' or 'fuse' */
        if ((mode === 'aim' || mode === 'fuse') && monImgs[turn] && imgReady(monImgs[turn])) {
          var s = 148;
          var cx = MUZZLE - s * 0.22 + peek * s * 0.42 + (mode === 'fuse' ? -14 : Math.sin(now / 190) * 5);
          g.save();
          g.translate(CX, CY);
          g.rotate(a);
          g.translate(-back, 0);
          g.beginPath();
          g.rect(MUZZLE - 18, -s, s * 2.2, s * 2);
          g.clip();
          g.translate(cx, 0);
          g.rotate(Math.PI / 2);
          g.drawImage(monImgs[turn], -s / 2, -s / 2, s, s);
          g.strokeStyle = T[turn].color || '#fde047';
          g.lineWidth = 8;
          g.beginPath();
          g.arc(0, -14, s * 0.34, Math.PI * 1.15, Math.PI * 1.85);
          g.stroke();
          g.restore();
        }

        /* Rotating & recoiling Cannon Barrel (o_cannon_barrel) */
        g.save();
        g.translate(CX, CY);
        g.rotate(a);
        g.translate(-back, 0);
        g.scale(sqX, sqY);
        if (imgReady(artBarrel)) {
          g.drawImage(artBarrel, -82, -68, 256, 136);
        } else if (imgReady(artCannonOld)) {
          g.rotate(0.55);
          g.drawImage(artCannonOld, -130, -140, 260, 260);
        } else {
          g.fillStyle = '#3b4a6b';
          g.strokeStyle = '#1f2a44';
          g.lineWidth = 6;
          g.beginPath(); g.roundRect(-50, -46, 195, 92, 28); g.fill(); g.stroke();
          g.fillStyle = '#f59e0b';
          g.beginPath(); g.roundRect(126, -54, 34, 108, 14); g.fill(); g.stroke();
        }

        /* Fizzing fuse + sparks at rear of barrel during 'aim' and 'fuse' */
        if (mode === 'aim' || mode === 'fuse') {
          var fuseProgress = mode === 'fuse' ? Math.min(1, phaseT / 0.42) : 0.15;
          var fx0 = -72, fy0 = -10;
          var fx1 = -108 + fuseProgress * 28, fy1 = -34 + Math.sin(now / 60) * 6;
          g.strokeStyle = '#d97706';
          g.lineWidth = 5;
          g.lineCap = 'round';
          g.beginPath();
          g.moveTo(fx0, fy0);
          g.quadraticCurveTo(-95, -28, fx1, fy1);
          g.stroke();
          var spR = (mode === 'fuse' ? 16 : 9) + Math.sin(now / 35) * 4;
          g.fillStyle = '#fde047';
          g.beginPath(); g.arc(fx1, fy1, spR, 0, Math.PI * 2); g.fill();
          g.fillStyle = '#ffffff';
          g.beginPath(); g.arc(fx1, fy1, spR * 0.5, 0, Math.PI * 2); g.fill();
        }
        g.restore();

        /* Stationary/recoiling Wooden Carriage & Wheels (o_cannon_wheels) */
        g.save();
        g.translate(CX - back * 0.35, CY + 28);
        if (imgReady(artWheels)) {
          g.drawImage(artWheels, -108, -48, 216, 128);
        } else {
          g.fillStyle = '#ef4444';
          g.strokeStyle = '#1f2a44';
          g.lineWidth = 6;
          g.beginPath(); g.arc(-10, 22, 48, 0, Math.PI * 2); g.fill(); g.stroke();
          g.fillStyle = '#fde047';
          g.beginPath(); g.arc(-10, 22, 16, 0, Math.PI * 2); g.fill(); g.stroke();
        }
        g.restore();

        /* Flying monster in the air ('fly' state) */
        if (ball && monImgs[turn] && imgReady(monImgs[turn])) {
          var heightAboveGround = Math.max(0, GROUND - ball.y);
          var shScale = Math.max(0.18, 1 - heightAboveGround / 680);
          drawShadow(g, ball.x, GROUND + 8, 66 * shScale, 18 * shScale, 0.42 * shScale);

          var spdAngle = Math.atan2(ball.vy, ball.vx);
          g.save();
          g.translate(ball.x, ball.y);
          g.rotate(spdAngle);
          g.strokeStyle = 'rgba(255, 255, 255, 0.72)';
          g.lineWidth = 4;
          g.lineCap = 'round';
          for (var sl = -1; sl <= 1; sl++) {
            var ly = sl * 34;
            var llen = 48 + Math.sin(now / 60 + sl) * 18;
            g.beginPath();
            g.moveTo(-64, ly);
            g.lineTo(-64 - llen, ly);
            g.stroke();
          }
          g.restore();

          g.save();
          g.translate(ball.x, ball.y);
          g.rotate(ball.rot);
          var mSize = 186;
          g.drawImage(monImgs[turn], -mSize / 2, -mSize / 2, mSize, mSize);
          g.restore();
        }

        /* Landed monster reaction ('land' state: haystack pop-out or dizzy -> wave) */
        if (mode === 'land' && monImgs[turn] && imgReady(monImgs[turn])) {
          var lt2 = landInfo.t;
          var lx = landInfo.x;
          if (landInfo.type === 'haystack') {
            var popUp = Math.min(1, lt2 * 3.2);
            var bob = Math.sin(now / 120) * 10;
            g.save();
            g.translate(lx, GROUND - 115 * popUp + bob);
            g.rotate(Math.sin(now / 150) * 0.14);
            g.drawImage(monImgs[turn], -98, -98, 196, 196);
            g.restore();
          } else {
            var isDizzy = lt2 < 0.55;
            drawMonsterPose(
              monImgs[turn],
              lx,
              GROUND - 88,
              204,
              isDizzy ? 'idle' : 'celebrate',
              now,
              T[turn].color
            );
            if (isDizzy) {
              for (var stIdx = 0; stIdx < 3; stIdx++) {
                var sa = now / 160 + stIdx * (Math.PI * 2 / 3);
                var sx2 = lx + Math.cos(sa) * 58;
                var sy2 = GROUND - 175 + Math.sin(sa) * 16;
                drawOutlinedText(g, '⭐', sx2, sy2, 28, '#fde047', '#0f172a');
              }
            }
          }
        }

        /* Finale celebration: all teams' monsters celebrate together! */
        if (mode === 'finale') {
          T.forEach(function (tm, idx) {
            var fx = CX + 140 + idx * 185;
            drawMonsterPose(monImgs[idx], fx, GROUND - 88, 210, 'celebrate', now + idx * 180, tm.color);
          });
        }
      }

      function drawForegroundParallax(now) {
        fgTufts.forEach(function (ft) {
          var fx = ft.x - cam.x * 0.24;
          var fy = VIEW_H - 8;
          var sway = Math.sin(now / 480 + ft.x) * 5;
          g.save();
          g.translate(fx, fy);
          g.scale(ft.s, ft.s);
          g.fillStyle = hal ? 'rgba(30, 11, 59, 0.78)' : 'rgba(20, 83, 45, 0.72)';
          g.beginPath();
          g.moveTo(-22, 20);
          g.quadraticCurveTo(-14 + sway, -24, -6 + sway, -34);
          g.quadraticCurveTo(-2, -6, 0, 20);
          g.moveTo(-2, 20);
          g.quadraticCurveTo(6 + sway, -30, 14 + sway, -38);
          g.quadraticCurveTo(12, -6, 16, 20);
          g.fill();
          if (ft.type === 0) {
            g.fillStyle = hal ? '#fb923c' : '#fde047';
            g.beginPath();
            g.arc(12 + sway, -36, 5.5, 0, Math.PI * 2);
            g.fill();
          }
          g.restore();
        });
      }

      function drawAimGuide() {
        if (mode !== 'aim' || !aim) return;
        var v = launchVec(aim);
        var x = CX + Math.cos(v.a) * MUZZLE;
        var y = CY + Math.sin(v.a) * MUZZLE;
        var vx = v.vx, vy = v.vy;

        g.strokeStyle = '#fde047';
        g.lineWidth = 6;
        g.setLineDash([10, 8]);
        g.beginPath();
        g.moveTo(CX, CY);
        g.lineTo(aim.x, aim.y);
        g.stroke();
        g.setLineDash([]);

        for (var k = 0; k < L.dots; k++) {
          for (var s = 0; s < 4; s++) {
            vy += G * 0.02;
            vx += wind * 0.02;
            x += vx * 0.02;
            y += vy * 0.02;
          }
          g.fillStyle = 'rgba(255, 255, 255, ' + (0.95 - k * 0.055) + ')';
          g.strokeStyle = '#0f172a';
          g.lineWidth = 3.5;
          g.beginPath();
          g.arc(x, y, Math.max(5, 11 - k * 0.45), 0, Math.PI * 2);
          g.fill();
          g.stroke();
        }
        var pct = Math.min(100, Math.round(v.pull / 3.4));
        drawOutlinedText(g, 'Power ' + pct + '%', CX + 20, CY - 155, 34, '#fde047', '#0f172a');
      }

      function drawWindHud(now) {
        if (!L.wind) return;
        var x = VIEW_W - 155, y = 112;
        var dir = wind >= 0 ? 1 : -1;
        var len = 36 + Math.abs(wind) / Math.max(1, L.wind) * 62;
        var wave = Math.sin(now / 150) * 5;
        g.save();
        g.fillStyle = 'rgba(15, 23, 42, 0.78)';
        g.strokeStyle = '#ffffff';
        g.lineWidth = 3.5;
        g.beginPath();
        g.roundRect(x - 115, y - 38, 230, 82, 20);
        g.fill();
        g.stroke();
        drawOutlinedText(g, wind === 0 ? 'Calm Wind' : ('Wind ' + Math.abs(wind)), x, y - 14, 24, '#fde047', '#0f172a');
        if (wind !== 0) {
          g.strokeStyle = '#38bdf8';
          g.fillStyle = '#38bdf8';
          g.lineWidth = 8;
          g.lineCap = 'round';
          g.beginPath();
          g.moveTo(x - dir * len / 2, y + 18 + wave * 0.2);
          g.lineTo(x + dir * len / 2, y + 18);
          g.stroke();
          g.beginPath();
          g.moveTo(x + dir * (len / 2 + 14), y + 18);
          g.lineTo(x + dir * (len / 2 - 6), y + 6);
          g.lineTo(x + dir * (len / 2 - 6), y + 30);
          g.fill();
        }
        g.restore();
      }

      /* ---- Main 60fps Delta-Time Loop ---- */
      var last = performance.now();
      function frame(now) {
        if (!alive) return;
        var rawDt = Math.min(0.033, Math.max(0.001, (now - last) / 1000));
        last = now;

        var timeScale = 1.0;
        if (slowMoT > 0) {
          slowMoT = Math.max(0, slowMoT - rawDt);
          timeScale = 0.38;
        }
        var dt = rawDt * timeScale;
        phaseT += rawDt;

        recoil = Math.max(0, recoil - rawDt * 3.8);
        if (barrelSquash < 0) barrelSquash = Math.min(0, barrelSquash + rawDt * 2.8);
        if (crowdCheerT > 0) crowdCheerT = Math.max(0, crowdCheerT - rawDt);
        if (bullseye.wobble > 0) bullseye.wobble = Math.max(0, bullseye.wobble - rawDt * 1.8);
        haystacks.forEach(function (hs) {
          if (hs.wobble > 0) hs.wobble = Math.max(0, hs.wobble - rawDt * 1.8);
        });

        if (mode === 'aim') {
          peek = Math.min(1, peek + rawDt * 3.2);
        } else if (mode === 'fuse') {
          barrelSquash = 0.85 * Math.sin((phaseT / 0.42) * Math.PI * 0.5);
          if (Math.random() < 0.65) {
            var fa = barrelAngle(now);
            addPart({
              x: CX - Math.cos(fa) * 85,
              y: CY - Math.sin(fa) * 85 - 16,
              vx: (Math.random() - 0.5) * 180,
              vy: -80 - Math.random() * 140,
              life: 0.28,
              t: 0,
              c: Math.random() < 0.5 ? '#fde047' : '#fb923c',
              r: 4 + Math.random() * 4
            });
          }
          if (phaseT >= 0.42) {
            fireCannonNow();
          }
        } else if (mode === 'land') {
          landInfo.t += rawDt;
        } else if (mode === 'finale') {
          if (Math.random() < 0.14) {
            var fwx = cam.x + 250 + Math.random() * (VIEW_W - 500);
            var fwy = 140 + Math.random() * 240;
            puff(fwx, fwy, 18, ['#fde047', '#38bdf8', '#f43f5e', '#4ade80', '#a855f7'], 40);
          }
        }

        clouds.forEach(function (c) {
          c.x += (c.v + wind * 0.06) * rawDt;
          if (c.x > WORLD_W + 300) c.x = -300;
          if (c.x < -300) c.x = WORLD_W + 300;
        });
        flyers.forEach(function (fl) {
          fl.x += fl.v * rawDt;
          if (fl.x > WORLD_W + 200) fl.x = -200;
        });

        if (ball) {
          var steps = 3, sd = dt / steps;
          for (var s = 0; s < steps && ball; s++) {
            ball.vy += G * sd;
            ball.vx += wind * sd;
            ball.x += ball.vx * sd;
            ball.y += ball.vy * sd;
            ball.rot += sd * 8.5;
            ball.t += sd;

            targets.forEach(function (t) {
              if (!t.pop && Math.hypot(t.x - ball.x, (t.ry || t.y) - ball.y) < t.r + MR * 0.9) {
                popBalloon(t);
              }
            });

            starCoins.forEach(function (sc) {
              if (!sc.hit && Math.hypot(sc.x - ball.x, (sc.ry || sc.y) - ball.y) < sc.r + MR * 0.85) {
                hitStarCoin(sc);
              }
            });

            if (!bullseye.hit && Math.hypot(bullseye.x - ball.x, bullseye.y - ball.y) < bullseye.r + MR * 0.85) {
              hitBullseyeStand();
            }

            if (ball.vy > 0 && ball.y >= GROUND - 115) {
              var hitHay = null;
              haystacks.forEach(function (hs) {
                if (Math.abs(ball.x - hs.x) < hs.r + 34) hitHay = hs;
              });
              if (hitHay) {
                finishLanding(true, hitHay);
                break;
              }
            }

            if (ball && ball.y > GROUND - MR) {
              ball.y = GROUND - MR;
              if (Math.abs(ball.vy) > 250 && ball.bounces < 2) {
                ball.vy *= -0.45;
                ball.vx *= 0.72;
                ball.bounces++;
                A().play('ground_bounce');
                puff(ball.x, GROUND, 10, ['#86efac', '#fde68a', '#ffffff'], 70);
                triggerShake(4, 0.14);
              } else {
                finishLanding(false, null);
                break;
              }
            }
            if (ball && (ball.x > WORLD_W - 80 || ball.x < -120 || ball.t > 7.5)) {
              finishLanding(false, null);
              break;
            }
          }
          if (ball) {
            trail.push({ x: ball.x, y: ball.y });
            if (trail.length > 26) trail.shift();
          }
        }

        if (mode === 'fly' && ball) {
          cam.tx = Math.max(0, Math.min(WORLD_W - VIEW_W, ball.x - VIEW_W * 0.34));
          var alt = Math.max(0, GROUND - ball.y);
          cam.tzoom = alt > 260 ? 0.88 : 1.04;
          cam.ty = Math.max(-90, Math.min(40, (ball.y - 450) * 0.18));
        } else if (mode === 'land') {
          cam.tx = Math.max(0, Math.min(WORLD_W - VIEW_W, landInfo.x - VIEW_W * 0.46));
          cam.tzoom = 1.12;
          cam.ty = 24;
        } else if (mode === 'aim') {
          cam.tx = aim ? Math.min(420, Math.max(0, (CX - aim.x) * 0.9)) : 80;
          cam.tzoom = 0.96;
          cam.ty = 0;
        } else {
          cam.tx = 0;
          cam.tzoom = 1.0;
          cam.ty = 0;
        }

        var camEase = Math.min(1, rawDt * 4.8);
        cam.x += (cam.tx - cam.x) * camEase;
        cam.y += (cam.ty - cam.y) * camEase;
        cam.zoom += (cam.tzoom - cam.zoom) * camEase;

        var shakeX = 0, shakeY = 0;
        if (cam.shakeT > 0) {
          cam.shakeT = Math.max(0, cam.shakeT - rawDt);
          shakeX = (Math.random() * 2 - 1) * cam.shakeMag;
          shakeY = (Math.random() * 2 - 1) * cam.shakeMag;
        }

        parts = parts.filter(function (p) {
          p.t += dt;
          p.vy += 760 * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          return p.t < p.life;
        });
        shockwaves = shockwaves.filter(function (sw) {
          sw.t += rawDt * 2.6;
          sw.r = 18 + (sw.maxR - 18) * sw.t;
          return sw.t < 1;
        });

        g.save();
        g.scale(dpr, dpr);
        g.clearRect(0, 0, VIEW_W, VIEW_H);

        g.save();
        g.translate(VIEW_W * 0.5 + shakeX, VIEW_H * 0.5 + shakeY);
        g.scale(cam.zoom, cam.zoom);
        g.translate(-VIEW_W * 0.5 - cam.x, -VIEW_H * 0.5 - cam.y);

        drawParallaxWorld(now);
        drawBalloons(now);

        trail.forEach(function (p, k) {
          var alpha = (k / Math.max(1, trail.length)) * 0.72;
          g.fillStyle = 'rgba(253, 224, 71, ' + alpha.toFixed(3) + ')';
          g.beginPath();
          g.arc(p.x, p.y, 5 + k * 0.85, 0, Math.PI * 2);
          g.fill();
        });

        drawCannonAndActors(now);

        shockwaves.forEach(function (sw) {
          g.save();
          g.globalAlpha = Math.max(0, 1 - sw.t);
          g.strokeStyle = sw.c;
          g.lineWidth = 7 * (1 - sw.t * 0.6);
          g.beginPath();
          g.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
          g.stroke();
          g.restore();
        });

        parts.forEach(function (p) {
          g.globalAlpha = Math.max(0, 1 - p.t / p.life);
          g.fillStyle = p.c;
          g.beginPath();
          g.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          g.fill();
        });
        g.globalAlpha = 1;

        drawAimGuide();
        drawForegroundParallax(now);

        g.restore();

        drawWindHud(now);

        g.restore();

        raf = requestAnimationFrame(frame);
      }

      raf = requestAnimationFrame(frame);
      showTurn();
    }
  };
})(window);
