/* Game Maker: ALLEY FLING — Cat vs Dog Backyard Throw (mode-fling.js).
   Classic "Cat vs Dog" backyard battle! Team 1 (Cat side, left yard) flings balls of yarn
   and Team 2 (Dog side, right yard) flings bones in a high arc over the middle wooden fence
   to HIT the opposing character!
   - Direct Head Bonk on opposing Cat/Dog = +30 pts (slow-mo impact, dizzy stars, HP bar drop!)
   - Body Hit on opposing Cat/Dog = +20 pts (elastic knockback + dizzy wobble!)
   - Near Splash next to opponent = +10 pts
   - Floating Star Coin above the fence = +15 bonus pts! */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {};
  GM.modes = GM.modes || {};
  var U = function () { return GM.u; };
  var A = function () { return GM.audio; };
  var J = function () { return GM.juice; };

  var WORLD_W = 1920;
  var H = 900;
  var GROUND = 770;
  var G = 920;

  var LEVELS = {
    easy:   { dots: 15, wind: 0,   fenceH: 185 },
    normal: { dots: 10, wind: 95,  fenceH: 205 },
    hard:   { dots: 5,  wind: 165, fenceH: 230 }
  };

  function loadImg(src) {
    var img = new Image();
    img.src = src;
    return img;
  }

  function imgReady(img) {
    return !!(img && img.complete && img.naturalWidth > 0);
  }

  function monImage(m) {
    var img = new Image();
    var svg = GM.mon.svg(m, 220);
    if (!svg || svg.indexOf('<svg') < 0) return null;
    if (svg.indexOf('xmlns=') < 0) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    return img;
  }

  function drawOutlinedText(g, text, x, y, size, fill, stroke, align) {
    g.save();
    g.font = '700 ' + size + 'px Fredoka, sans-serif';
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

  function flyScoreToPod(startPt, teamIdx, pts, color) {
    var fx = document.getElementById('gm-fx') || document.body;
    var pod = document.getElementById('gm-team-' + teamIdx);
    if (!fx || !pod || !startPt) return;
    var pr = pod.getBoundingClientRect();
    var tx = pr.left + pr.width / 2;
    var ty = pr.top + pr.height / 2;
    var orb = U().h('div', {
      class: 'gm-score-orb',
      text: '+' + pts
    });
    orb.style.cssText = 'position:fixed;z-index:9999;pointer-events:none;left:' + Math.round(startPt.x - 28) + 'px;top:' + Math.round(startPt.y - 22) + 'px;padding:6px 14px;border-radius:999px;font:900 22px Fredoka,sans-serif;color:#fff;border:3px solid #fff;box-shadow:0 6px 16px rgba(0,0,0,0.45);transition:transform 0.62s cubic-bezier(0.22,1,0.36,1),opacity 0.62s ease;background:' + (color || '#f59e0b') + ';';
    fx.appendChild(orb);
    requestAnimationFrame(function () {
      orb.style.transform = 'translate(' + Math.round(tx - startPt.x) + 'px, ' + Math.round(ty - startPt.y) + 'px) scale(0.65)';
      orb.style.opacity = '0.2';
    });
    setTimeout(function () {
      if (orb.parentNode) orb.remove();
    }, 680);
  }

  GM.modes.fling = {
    id: 'fling',
    name: 'Alley Fling',
    e: '🪃',
    teams: 2,
    desc: 'Cat vs Dog backyard throw! Answer a question, then fling yarn or a bone over the fence to bonk the other character!',
    fields: [
      { k: 'rounds', l: 'Throws per team', opts: [[3, '3'], [5, '5'], [7, '7']], def: 5 },
      { k: 'level',  l: 'Difficulty', opts: [['easy', '🌱 Easy (long guide, no wind)'], ['normal', '⚡ Normal (short guide, light wind)'], ['hard', '🔥 Hard (tiny guide, strong wind)']], def: 'normal' }
    ],

    start: function (ctx) {
      var T = GM.state.teams;
      if (T.length > 2) T = GM.state.teams = T.slice(0, 2);

      var rounds = +ctx.cfg.rounds || 5;
      var lvlKey = ctx.cfg.level || 'normal';
      var L = LEVELS[lvlKey] || LEVELS.normal;
      var hal = GM.state.theme === 'halloween';
      var turn = 0;
      var turnCount = 0;
      var totalTurns = rounds * 2;

      document.body.classList.add('gm-small-pods', 'gm-real3-active');
      ctx.root.innerHTML = '';

      /* Full-screen scene wrapper + canvas + floating HUD */
      var scene = U().h('div', { class: 'gm-real3-scene' });
      var cv = U().h('canvas', { class: 'gm-real3-cv', width: 1600, height: H });
      var banner = U().h('div', { class: 'gm-real3-banner in' });
      var dock = U().h('div', { class: 'gm-real3-dock' });
      scene.appendChild(cv);
      scene.appendChild(banner);
      scene.appendChild(dock);
      ctx.root.appendChild(scene);

      var g = cv.getContext('2d');
      var viewW = 1600;

      function syncCanvasSize() {
        var r = scene.getBoundingClientRect();
        if (r.width > 200 && r.height > 200) {
          viewW = Math.round(H * (r.width / r.height));
          viewW = Math.max(1200, Math.min(1920, viewW));
          if (cv.width !== viewW || cv.height !== H) {
            cv.width = viewW;
            cv.height = H;
          }
        }
      }
      syncCanvasSize();
      var ro = null;
      if (window.ResizeObserver) {
        ro = new ResizeObserver(syncCanvasSize);
        ro.observe(scene);
      }

      /* Preload all raster art */
      var monImgs = T.map(function (t) { return monImage(t.mon); });
      var art = {
        bgYards:    loadImg('art/bg_fling_yards.webp'),
        bgFallback: loadImg(hal ? 'art/bg_pumpkin_patch.webp' : 'art/bg_classic_cannon.webp'),
        catReady:   loadImg('art/c_cat_ready.webp'),
        catCheer:   loadImg('art/c_cat_cheer.webp'),
        dogReady:   loadImg('art/c_dog_ready.webp'),
        dogCheer:   loadImg('art/c_dog_cheer.webp'),
        doghouse:   loadImg('art/o_doghouse.webp'),
        yarn:       loadImg('art/o_yarn.webp'),
        bone:       loadImg('art/o_bone.webp'),
        starCoin:   loadImg('art/o_star_coin.webp'),
        target:     loadImg('art/o_target.webp'),
        lantern:    loadImg('art/o_candle_lantern.webp')
      };

      var alive = true;
      var raf = 0;
      var timers = [];
      function later(fn, ms) {
        var id = setTimeout(fn, ms);
        timers.push(id);
        return id;
      }

      /* World positions across 1920px panorama (Cat at 380, Fence at 960, Dog at 1540) */
      function midX()   { return WORLD_W * 0.5; }   /* 960 (Middle wooden fence) */
      function leftX()  { return 380; }             /* Cat position (580px left of fence) */
      function rightX() { return WORLD_W - 380; }   /* 1540 (Dog position, 580px right of fence) */

      function charPos(idx) {
        return { x: idx === 0 ? leftX() : rightX(), y: GROUND - 115 };
      }

      function shooterPos() {
        return charPos(turn);
      }

      function defenderPos() {
        return charPos(1 - turn);
      }

      /* Camera state */
      var cam = { x: 0, y: 0, zoom: 1, targetX: 0, targetY: 0, targetZoom: 1, shakeT: 0, shakeMag: 0 };
      function focusCameraForTurn(tIdx, aiming) {
        var center = tIdx === 0 ? WORLD_W * (aiming ? 0.47 : 0.49) : WORLD_W * (aiming ? 0.53 : 0.51);
        cam.targetX = Math.max(0, Math.min(WORLD_W - viewW, center - viewW * 0.5));
        cam.targetY = 0;
        cam.targetZoom = 1;
      }
      function triggerShake(mag, dur) {
        cam.shakeMag = Math.min(6, mag || 5);
        cam.shakeT = Math.min(0.28, dur || 0.22);
      }

      /* Character & buddy animation states + HP / Bonk meters */
      var charAnim = [
        { state: 'idle', t: 0, bonkT: 0, hp: 100, maxHp: 100, bubble: '' }, /* 0 = Cat (Left yard) */
        { state: 'idle', t: 0, bonkT: 0, hp: 100, maxHp: 100, bubble: '' }  /* 1 = Dog (Right yard) */
      ];
      var fenceWobble = 0;
      var slowMoT = 0;
      var crowdCheerT = 0;
      var popText = null;
      var bonkBurst = null;

      /* Ambient clouds, birds/bats, and foreground tufts */
      var clouds = [];
      for (var ci = 0; ci < 7; ci++) {
        clouds.push({
          x: ci * 310 + Math.random() * 90,
          y: 65 + (ci % 3) * 52,
          s: 0.72 + (ci % 3) * 0.22,
          v: 14 + (ci % 4) * 5
        });
      }
      var skyFlyers = [];
      for (var bi = 0; bi < 6; bi++) {
        skyFlyers.push({
          x: 180 + bi * 290,
          y: 120 + (bi % 3) * 45,
          ph: bi * 1.3,
          v: 28 + (bi % 3) * 10
        });
      }
      var fgTufts = [];
      for (var fi = 0; fi < 26; fi++) {
        fgTufts.push({
          x: fi * 85 + (fi % 2) * 25,
          h: 22 + (fi % 4) * 7,
          col: fi % 3 === 0 ? '#f43f5e' : (fi % 3 === 1 ? '#fde047' : '#38bdf8')
        });
      }

      var mode = 'wait';
      var aim = null;
      var proj = null;
      var trail = [];
      var parts = [];
      var wind = 0;
      var fenceH = L.fenceH || 205;
      var star = { y: 260, hit: false, ph: 0, ry: 260 };
      var starPts = 0;

      function newRoundProps() {
        wind = L.wind ? Math.round((Math.random() * 2 - 1) * L.wind) : 0;
        fenceH = L.fenceH || 205;
        star = { y: GROUND - fenceH - 135 - Math.random() * 35, hit: false, ph: Math.random() * 6, ry: GROUND - fenceH - 135 };
      }
      newRoundProps();
      focusCameraForTurn(0, false);
      cam.x = cam.targetX;

      function updateBanner(title, sub, compact) {
        var t = T[turn] || T[0];
        banner.style.setProperty('--c', t.color || '#38bdf8');
        banner.classList.add('in');
        banner.classList.toggle('compact', !!compact);
        banner.innerHTML = '';
        if (t.mon) banner.appendChild(U().monFace(t.mon, 38));
        banner.appendChild(U().h('b', { text: title }));
        if (sub) banner.appendChild(U().h('span', { class: 'gm-real3-sub', text: sub }));
      }

      /* Screen <-> World coordinate conversion accounting for camera pan & zoom */
      function toWorld(e) {
        var r = cv.getBoundingClientRect();
        var sx = (e.clientX - r.left) / Math.max(1, r.width) * viewW;
        var sy = (e.clientY - r.top) / Math.max(1, r.height) * H;
        var wx = (sx - viewW * 0.5) / cam.zoom + viewW * 0.5 + cam.x;
        var wy = (sy - H * 0.55) / cam.zoom + H * 0.55 + cam.y;
        return { x: wx, y: wy };
      }

      function toScreen(wx, wy) {
        var r = cv.getBoundingClientRect();
        var sx = (wx - cam.x - viewW * 0.5) * cam.zoom + viewW * 0.5;
        var sy = (wy - cam.y - H * 0.55) * cam.zoom + H * 0.55;
        return {
          x: r.left + sx / viewW * r.width,
          y: r.top + sy / H * r.height
        };
      }

      function puff(x, y, n, cols) {
        for (var k = 0; k < n; k++) {
          if (parts.length >= 150) parts.shift();
          var a = Math.random() * Math.PI * 2;
          var s = 110 + Math.random() * 360;
          parts.push({
            x: x,
            y: y,
            vx: Math.cos(a) * s,
            vy: Math.sin(a) * s - 95,
            life: 0.6 + Math.random() * 0.45,
            t: 0,
            c: cols[k % cols.length],
            r: 5 + Math.random() * 7
          });
        }
      }

      /* Compute high-arc ballistic throw over the middle fence directly at the opposing Dog/Cat! */
      function launchVec(p) {
        var sp = shooterPos();
        var dx = sp.x - p.x;
        var dy = sp.y - p.y;
        var d = Math.min(260, Math.max(40, Math.hypot(dx, dy)));
        var pullFrac = Math.min(1, Math.max(0.05, (d - 35) / 185));
        var dir = turn === 0 ? 1 : -1;

        /* Map pull distance across the fence so ~75% pull lands dead-center on the opposing character (580px past fence)! */
        var startX = sp.x + dir * 48;
        var startY = sp.y - 36;
        var targetX = midX() + dir * (160 + pullFrac * 540);
        var targetY = GROUND - 135;
        var flightT = 1.16 + pullFrac * 0.24;

        var vx = ((targetX - startX) - 0.5 * wind * flightT * flightT) / flightT;
        var vy = ((targetY - startY) - 0.5 * G * flightT * flightT) / flightT;
        var deg = Math.round(Math.atan2(-vy, Math.abs(vx)) * 180 / Math.PI);
        return {
          vx: vx,
          vy: vy,
          pull: Math.round(pullFrac * 100),
          deg: deg
        };
      }

      function fireWithVec(v) {
        if (mode !== 'aim' || !alive) return;
        mode = 'windup';
        aim = null;
        dock.innerHTML = '';
        charAnim[turn].state = 'windup';
        charAnim[turn].t = 0;
        charAnim[turn].bubble = turn === 0 ? 'Take this! 🧶' : 'Fetch this! 🦴';
        charAnim[1 - turn].bubble = 'Uh oh! 👀';
        A().play('crowd_ooh');

        later(function () {
          if (!alive) return;
          var sp = shooterPos();
          mode = 'fly';
          trail = [];
          starPts = 0;
          charAnim[turn].state = 'throw';
          charAnim[turn].t = 0;

          /* Play character voice + launch sound */
          A().play(turn === 0 ? 'cat_meow_happy' : 'dog_woof_happy');
          A().play('pu_rocket');
          A().play('whoosh_soft');

          proj = {
            x: sp.x + (turn === 0 ? 48 : -48),
            y: sp.y - 36,
            vx: v.vx,
            vy: v.vy,
            rot: 0,
            t: 0,
            bounces: 0,
            hitFence: false,
            bonkedOpponent: false
          };
          puff(proj.x, proj.y, 18, ['#ffffff', '#fde047', T[turn].color || '#38bdf8']);
          updateBanner((turn === 0 ? '🐱 ' : '🐶 ') + T[turn].name + ' flings!', 'Watch out, ' + (turn === 0 ? 'Dog!' : 'Cat!'), true);

          later(function () {
            if (alive && mode === 'fly') {
              charAnim[turn].state = 'watch';
              charAnim[turn].t = 0;
            }
          }, 220);
        }, 200);
      }

      function presetShot(kind) {
        if (mode !== 'aim' || !alive) return;
        var sp = shooterPos();
        var def = defenderPos();
        var startX = sp.x + (turn === 0 ? 48 : -48);
        var startY = sp.y - 36;
        /* Aim directly at the opposing Dog/Cat's head/body! High Lob uses a taller arc that collects the +15 star coin on the way! */
        var goalX = def.x;
        var goalY = GROUND - (kind === 'lob' ? 120 : 145);
        var flightT = kind === 'lob' ? 1.54 : 1.22;
        var vx = ((goalX - startX) - 0.5 * wind * flightT * flightT) / flightT;
        var vy = ((goalY - startY) - 0.5 * G * flightT * flightT) / flightT;
        fireWithVec({ vx: vx, vy: vy, pull: 80, deg: kind === 'lob' ? 62 : 48 });
      }

      /* Pointer & Keyboard Listeners */
      function onPointerDown(e) {
        if (mode !== 'aim') return;
        if (e.target && e.target.closest && e.target.closest('.gm-real3-dock')) return;
        e.preventDefault();
        try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        aim = toWorld(e);
        charAnim[turn].state = 'windup';
        A().play('tap');
      }
      function onPointerMove(e) {
        if (mode === 'aim' && aim) aim = toWorld(e);
      }
      function onPointerUp() {
        if (mode !== 'aim' || !aim) return;
        var sp = shooterPos();
        if (Math.hypot(sp.x - aim.x, sp.y - aim.y) < 20) {
          aim = null;
          charAnim[turn].state = 'idle';
          return;
        }
        fireWithVec(launchVec(aim));
      }
      function onKeyDown(e) {
        if (e.code !== 'Space' && e.key !== ' ') return;
        if (document.querySelector('.gm-over')) return;
        if (mode === 'wait' && !asking) {
          e.preventDefault();
          ask();
        }
      }
      cv.addEventListener('pointerdown', onPointerDown);
      cv.addEventListener('pointermove', onPointerMove);
      cv.addEventListener('pointerup', onPointerUp);
      cv.addEventListener('pointercancel', function () { aim = null; });
      document.addEventListener('keydown', onKeyDown);

      ctx.onEnd(function () {
        alive = false;
        cancelAnimationFrame(raf);
        timers.forEach(clearTimeout);
        if (ro) ro.disconnect();
        document.removeEventListener('keydown', onKeyDown);
        document.body.classList.remove('gm-small-pods', 'gm-real3-active');
      });

      function finishShot(msgText, baseScore, hitX, hitY, isDirectHit) {
        if (mode === 'payoff' || mode === 'wait') return;
        mode = 'payoff';
        var endX = hitX != null ? hitX : (proj ? proj.x : midX());
        var endY = hitY != null ? hitY : (proj ? Math.min(proj.y, GROUND - 24) : GROUND - 60);
        proj = null;

        var pts = Math.max(5, baseScore + starPts);
        var otherIdx = (turn + 1) % 2;

        /* Keep full panorama framed so both cheering thrower and bonked defender stay visible */
        cam.targetX = Math.max(0, Math.min(WORLD_W - viewW, endX - viewW * 0.5));
        cam.targetZoom = 1;

        if (isDirectHit) {
          slowMoT = 0.65;
          crowdCheerT = 1.8;
          charAnim[turn].state = 'celebrate';
          charAnim[turn].bubble = 'BULLSEYE! 🎉';
          charAnim[otherIdx].state = 'bonked';
          charAnim[otherIdx].bonkT = 1.65;
          charAnim[otherIdx].bubble = baseScore >= 30 ? 'BONK! 😵‍💫' : 'OUCH! 🐾';
          charAnim[otherIdx].hp = Math.max(10, charAnim[otherIdx].hp - baseScore);
          bonkBurst = { x: endX, y: endY, t0: performance.now() };
          triggerShake(6, 0.28);
          U().confetti(36);
          A().play(otherIdx === 0 ? 'cat_meow_happy' : 'dog_woof_happy');
          A().play('haystack_poof');
          A().play('crowd_roar_big');
          A().play('slot_high');
          A().play('sparkle');
        } else if (baseScore >= 10) {
          crowdCheerT = 1.2;
          charAnim[turn].state = 'celebrate';
          charAnim[turn].bubble = 'Close hit! 👍';
          charAnim[otherIdx].state = 'bonked';
          charAnim[otherIdx].bonkT = 1.0;
          charAnim[otherIdx].bubble = 'Whoa! 😮';
          charAnim[otherIdx].hp = Math.max(10, charAnim[otherIdx].hp - 10);
          triggerShake(4, 0.18);
          U().confetti(18);
          A().play('crowd_cheer_small');
          A().play('slot_mid');
          A().play('sparkle');
        } else {
          /* Fence knock or lawn miss -> opponent laughs, thrower still gets +5 for trying! */
          charAnim[turn].state = 'shrug';
          charAnim[turn].bubble = 'Missed! 😅';
          charAnim[otherIdx].state = 'celebrate';
          charAnim[otherIdx].bubble = otherIdx === 0 ? 'Missed me! 😸' : 'Missed me! 🐶';
          A().play('crowd_ooh');
        }

        popText = {
          text: msgText + ' +' + pts,
          col: baseScore >= 30 ? '#fde047' : (baseScore >= 20 ? '#4ade80' : '#38bdf8'),
          x: endX,
          y: endY - 54,
          t0: performance.now()
        };

        var screenPt = toScreen(endX, endY);
        A().play('coin_collect');
        flyScoreToPod(screenPt, turn, pts, T[turn].color);
        U().addScore(turn, pts);
        U().wobble(document.getElementById('gm-team-' + turn));
        updateBanner(msgText, '+' + pts + ' points for ' + T[turn].name + '!', false);

        turnCount++;
        later(function () {
          if (!alive) return;
          cam.targetZoom = 1;
          if (turnCount >= totalTurns) {
            charAnim[0].state = 'celebrate';
            charAnim[1].state = 'celebrate';
            charAnim[0].bubble = 'Great game! 🎉';
            charAnim[1].bubble = 'Good match! 🏆';
            crowdCheerT = 2.0;
            cam.targetX = Math.max(0, Math.min(WORLD_W - viewW, midX() - viewW * 0.5));
            updateBanner('🎉 Great Backyard Battle!', 'Final scores are in!', false);
            U().confetti(45);
            A().play('cheer_kids');
            A().play('crowd_roar_big');
            later(function () {
              if (alive) ctx.end();
            }, 1350);
            return;
          }
          turn = (turn + 1) % 2;
          newRoundProps();
          showTurn();
        }, 1450);
      }

      /* ---------- Layered Scene Rendering ---------- */
      function drawSkyAndParallax(now) {
        var skyGr = g.createLinearGradient(0, 0, 0, GROUND);
        if (hal) {
          skyGr.addColorStop(0, '#1e1b4b');
          skyGr.addColorStop(0.55, '#3b0764');
          skyGr.addColorStop(1, '#581c87');
        } else {
          skyGr.addColorStop(0, '#38bdf8');
          skyGr.addColorStop(0.6, '#bae6fd');
          skyGr.addColorStop(1, '#fef9c3');
        }
        g.fillStyle = skyGr;
        g.fillRect(0, 0, viewW, H);

        /* Drifting clouds & ambient birds/bats */
        clouds.forEach(function (c) {
          var cx = ((c.x - cam.x * 0.35) % (WORLD_W + 300));
          if (cx < -180) cx += WORLD_W + 300;
          var cy = c.y + (crowdCheerT > 0 ? Math.sin(now / 120 + c.x) * 6 : 0);
          var s = c.s;
          g.fillStyle = hal ? 'rgba(192, 132, 252, 0.22)' : 'rgba(255, 255, 255, 0.88)';
          g.beginPath();
          g.ellipse(cx, cy, 78 * s, 28 * s, 0, 0, Math.PI * 2);
          g.ellipse(cx + 48 * s, cy - 12 * s, 52 * s, 24 * s, 0, 0, Math.PI * 2);
          g.ellipse(cx - 46 * s, cy - 6 * s, 44 * s, 20 * s, 0, 0, Math.PI * 2);
          g.fill();
        });

        skyFlyers.forEach(function (b) {
          var bx = ((b.x - cam.x * 0.45) % (WORLD_W + 200));
          if (bx < -100) bx += WORLD_W + 200;
          var flap = Math.sin(now / (crowdCheerT > 0 ? 90 : 160) + b.ph) * 9;
          var by = b.y + Math.sin(now / 360 + b.ph) * 10 - (crowdCheerT > 0 ? Math.abs(Math.sin(now / 110 + b.ph)) * 16 : 0);
          g.save();
          g.translate(bx, by);
          g.strokeStyle = hal ? '#fde047' : '#0f172a';
          g.lineWidth = 3.5;
          g.lineCap = 'round';
          g.beginPath();
          g.moveTo(-14, flap);
          g.quadraticCurveTo(-7, -8, 0, 0);
          g.quadraticCurveTo(7, -8, 14, flap);
          g.stroke();
          g.restore();
        });
      }

      function drawBackyardWorld(now) {
        /* Layer 3 & 4 (1.0x world space): Backyard panorama + houses + 3D wooden divider fence */
        var bg = imgReady(art.bgYards) ? art.bgYards : (imgReady(art.bgFallback) ? art.bgFallback : null);
        if (bg) {
          g.drawImage(bg, -40, -40, WORLD_W + 80, H + 80);
          if (hal) {
            g.fillStyle = 'rgba(46, 16, 101, 0.34)';
            g.fillRect(-40, -40, WORLD_W + 80, H + 80);
          }
        } else {
          g.fillStyle = hal ? '#3b1a74' : '#65a30d';
          g.fillRect(0, GROUND, WORLD_W, H - GROUND);
        }

        /* Lush lawn playable band */
        var lawnGr = g.createLinearGradient(0, GROUND - 28, 0, H);
        if (hal) {
          lawnGr.addColorStop(0, 'rgba(59, 7, 100, 0.55)');
          lawnGr.addColorStop(0.3, '#2e1065');
          lawnGr.addColorStop(1, '#1e1b4b');
        } else {
          lawnGr.addColorStop(0, 'rgba(132, 204, 22, 0.65)');
          lawnGr.addColorStop(0.3, '#65a30d');
          lawnGr.addColorStop(1, '#4d7c0f');
        }
        g.fillStyle = lawnGr;
        g.fillRect(0, GROUND - 18, WORLD_W, H - GROUND + 18);

        /* Subtle mowed lawn stripes */
        for (var stIdx = 0; stIdx < 16; stIdx++) {
          if (stIdx % 2 === 0) {
            g.fillStyle = hal ? 'rgba(168, 85, 247, 0.08)' : 'rgba(255, 255, 255, 0.08)';
            g.fillRect(stIdx * 125, GROUND - 12, 62, H - GROUND + 12);
          }
        }

        /* Left Yard 3D Prop (Cat Side): 3D Yarn Basket / Pile behind the Cat */
        var catPropX = leftX() - 165;
        var catPropY = GROUND - 6;
        g.save();
        g.translate(catPropX, catPropY);
        g.fillStyle = 'rgba(15, 23, 42, 0.32)';
        g.beginPath(); g.ellipse(0, 6, 62, 14, 0, 0, Math.PI * 2); g.fill();
        if (imgReady(art.yarn)) {
          g.drawImage(art.yarn, -52, -62, 68, 68);
          g.drawImage(art.yarn, -6, -54, 62, 62);
        }
        g.restore();

        /* Right Yard 3D Prop (Dog Side): Red Wooden Doghouse o_doghouse.webp behind the Dog */
        var dogPropX = rightX() + 185;
        var dogPropY = GROUND + 4;
        g.save();
        g.translate(dogPropX, dogPropY);
        g.fillStyle = 'rgba(15, 23, 42, 0.34)';
        g.beginPath(); g.ellipse(0, 4, 96, 22, 0, 0, Math.PI * 2); g.fill();
        if (imgReady(art.doghouse)) {
          g.drawImage(art.doghouse, -110, -205, 220, 215);
        }
        g.restore();

        /* Halloween Lanterns */
        if (hal) {
          [leftX() - 210, midX() - 125, midX() + 125, rightX() + 210].forEach(function (lx, i) {
            var ly = GROUND - 155 + Math.sin(now / 320 + i) * 5;
            var lg = g.createRadialGradient(lx, ly, 6, lx, ly, 75);
            lg.addColorStop(0, 'rgba(251, 191, 36, 0.55)');
            lg.addColorStop(1, 'rgba(251, 191, 36, 0)');
            g.fillStyle = lg;
            g.beginPath(); g.arc(lx, ly, 75, 0, Math.PI * 2); g.fill();
            if (imgReady(art.lantern)) {
              g.drawImage(art.lantern, lx - 32, ly - 32, 64, 64);
            }
          });
        }
      }

      function drawFenceAndBonusStar(now) {
        var mx = midX();

        /* Note: bg_fling_yards.webp ALREADY has the 3D wooden divider fence in the center!
           We only draw a subtle shock ring if the fence is knocked, plus the floating +15 Star Coin above it. */
        if (fenceWobble > 0) {
          g.save();
          g.strokeStyle = 'rgba(253, 224, 71, ' + (fenceWobble * 0.75).toFixed(2) + ')';
          g.lineWidth = 6;
          g.beginPath();
          g.arc(mx, GROUND - fenceH * 0.6, 48 + (1 - fenceWobble) * 50, 0, Math.PI * 2);
          g.stroke();
          g.restore();
        }

        /* Floating +15 Bonus Star Coin bobbing above the 3D wooden fence */
        if (!star.hit) {
          var sy = star.y + Math.sin(now / 360 + star.ph) * 14;
          star.ry = sy;
          g.save();
          g.translate(mx, sy);
          var sg = g.createRadialGradient(0, 0, 8, 0, 0, 64);
          sg.addColorStop(0, 'rgba(253, 224, 71, 0.65)');
          sg.addColorStop(1, 'rgba(253, 224, 71, 0)');
          g.fillStyle = sg;
          g.beginPath(); g.arc(0, 0, 64, 0, Math.PI * 2); g.fill();
          if (imgReady(art.starCoin)) {
            g.drawImage(art.starCoin, -44, -44, 88, 88);
          } else {
            g.fillStyle = '#fde047'; g.strokeStyle = '#1f2a44'; g.lineWidth = 4;
            g.beginPath(); g.arc(0, 0, 36, 0, Math.PI * 2); g.fill(); g.stroke();
          }
          drawOutlinedText(g, '+15', 0, 42, 26, '#fde047', '#0f172a');
          g.restore();
        }
      }

      function drawCharactersAndBuddies(now) {
        /* Draw Team 1 (Left: Cat + Monster Buddy) and Team 2 (Right: Dog + Monster Buddy) */
        [0, 1].forEach(function (idx) {
          var isCat = (idx === 0);
          var baseX = isCat ? leftX() : rightX();
          var baseY = GROUND - 8;
          var anim = charAnim[idx];
          var teamCol = (T[idx] && T[idx].color) || (isCat ? '#f97316' : '#38bdf8');
          var isDefendingTarget = (idx !== turn) && (mode === 'aim' || mode === 'fly' || mode === 'windup');

          /* 1. Team's Cheering Monster Buddy sitting beside its animal */
          var buddyX = baseX + (isCat ? -115 : 115);
          var buddyY = GROUND - 58;
          var buddySize = 126;
          var buddyBob = Math.sin(now / 260 + idx) * 6;
          var buddyRot = 0;
          if (anim.state === 'celebrate' || crowdCheerT > 0) {
            buddyBob = -Math.abs(Math.sin(now / 115 + idx)) * 26;
            buddyRot = Math.sin(now / 130) * 0.14;
          } else if (anim.state === 'bonked' || anim.state === 'shrug') {
            buddyRot = Math.sin(now / 95) * 0.14;
          }
          g.save();
          g.translate(buddyX, buddyY);
          var bShadowScale = Math.max(0.55, 1 + buddyBob / 90);
          g.fillStyle = 'rgba(15, 23, 42, 0.34)';
          g.beginPath(); g.ellipse(0, 54, 42 * bShadowScale, 11 * bShadowScale, 0, 0, Math.PI * 2); g.fill();
          g.translate(0, buddyBob);
          g.rotate(buddyRot);
          if (!isCat) g.scale(-1, 1);
          if (imgReady(monImgs[idx])) {
            g.drawImage(monImgs[idx], -buddySize / 2, -buddySize / 2, buddySize, buddySize);
          }
          g.restore();

          /* 2. Pulsing Target Reticle around the Defending Animal when Aiming! */
          var charH = 230;
          var charW = 230;
          var drawX = baseX;
          var drawY = baseY - charH * 0.46;

          if (isDefendingTarget && mode === 'aim') {
            var retPulse = 1 + Math.sin(now / 180) * 0.06;
            g.save();
            g.translate(drawX, drawY - 12);
            g.scale(retPulse, retPulse);
            g.strokeStyle = 'rgba(244, 63, 94, 0.85)';
            g.lineWidth = 4.5;
            g.setLineDash([12, 8]);
            g.beginPath();
            g.arc(0, 0, 92, 0, Math.PI * 2);
            g.stroke();
            g.setLineDash([]);
            drawOutlinedText(g, '🎯 HIT ME! +30', 0, -112, 24, '#fde047', '#0f172a');
            g.restore();
          }

          /* 3. Big Main Animal Character (Cat or Dog, 230px tall) */
          var sx = 1, sy = 1, rot = 0, liftY = 0, knockX = 0;
          var useCheerPose = (anim.state === 'celebrate');

          if (anim.state === 'bonked' || anim.bonkT > 0) {
            /* Hit by yarn/bone! Squashed, knocked back, wobbling dizzily with spinning stars! */
            var bk = Math.max(0.2, anim.bonkT / 1.65);
            knockX = (isCat ? -1 : 1) * Math.sin(now / 45) * 16 * bk;
            sx = 1.16 + Math.sin(now / 55) * 0.08;
            sy = 0.84 - Math.sin(now / 55) * 0.08;
            rot = (isCat ? -0.22 : 0.22) * bk + Math.sin(now / 60) * 0.14;
            liftY = 14;
          } else if (anim.state === 'idle') {
            sx = 1 + Math.sin(now / 260 + idx) * 0.04;
            sy = 1 - Math.sin(now / 260 + idx) * 0.04;
            liftY = -Math.abs(Math.sin(now / 320 + idx)) * 7;
          } else if (anim.state === 'windup') {
            sx = 1.08; sy = 0.92;
            rot = isCat ? -0.18 : 0.18;
            liftY = 6;
          } else if (anim.state === 'throw') {
            sx = 0.92; sy = 1.10;
            rot = isCat ? 0.20 : -0.20;
            liftY = -18;
          } else if (anim.state === 'watch') {
            rot = isCat ? 0.08 : -0.08;
            liftY = -4;
          } else if (anim.state === 'celebrate') {
            liftY = -Math.abs(Math.sin(now / 115 + idx)) * 34;
            rot = Math.sin(now / 140 + idx) * 0.12;
            sx = 1 + Math.sin(now / 115) * 0.07;
            sy = 1 - Math.sin(now / 115) * 0.07;
          } else if (anim.state === 'shrug') {
            sx = 1.06; sy = 0.94;
            rot = Math.sin(now / 120) * 0.12;
            liftY = -Math.sin(Math.min(1, anim.t * 2.5) * Math.PI) * 10;
          }

          /* Contact shadow under animal */
          var shScale = Math.max(0.5, 1 + liftY / 110);
          g.save();
          g.translate(drawX + knockX, baseY);
          g.fillStyle = 'rgba(15, 23, 42, 0.38)';
          g.beginPath(); g.ellipse(0, 0, 68 * shScale, 17 * shScale, 0, 0, Math.PI * 2); g.fill();
          g.strokeStyle = teamCol;
          g.lineWidth = 4;
          g.beginPath(); g.ellipse(0, 0, 60 * shScale, 14 * shScale, 0, 0, Math.PI * 2); g.stroke();
          g.restore();

          /* Animal sprite (100% clean 3D raster artwork — no vector collar rectangle!) */
          g.save();
          g.translate(drawX + knockX, drawY + liftY);
          g.rotate(rot);
          g.scale(sx, sy);

          var sprite = isCat
            ? (useCheerPose ? art.catCheer : art.catReady)
            : (useCheerPose ? art.dogCheer : art.dogReady);

          if (imgReady(sprite)) {
            g.drawImage(sprite, -charW / 2, -charH / 2, charW, charH);
          } else {
            g.fillStyle = teamCol;
            g.beginPath(); g.arc(0, 0, 75, 0, Math.PI * 2); g.fill();
          }
          g.restore();

          /* Orbiting dizzy stars when bonked! */
          if (anim.state === 'bonked' || anim.bonkT > 0) {
            for (var si = 0; si < 3; si++) {
              var sa = now / 150 + (si * Math.PI * 2) / 3;
              var sxStar = drawX + knockX + Math.cos(sa) * 58;
              var syStar = drawY - charH * 0.44 + Math.sin(sa) * 16;
              drawOutlinedText(g, si % 2 === 0 ? '⭐' : '💥', sxStar, syStar, 26, '#fde047', '#0f172a');
            }
          }

          /* Comic reaction speech bubble above animal */
          if (anim.bubble && mode !== 'aim') {
            var bw = 176;
            var bh = 38;
            var bx = drawX - bw * 0.5;
            var by = drawY - charH * 0.52 - 36 + liftY * 0.4;
            g.save();
            g.fillStyle = 'rgba(255, 255, 255, 0.95)';
            g.strokeStyle = teamCol;
            g.lineWidth = 3;
            g.beginPath();
            g.roundRect(bx, by, bw, bh, 18);
            g.fill();
            g.stroke();
            g.fillStyle = '#0f172a';
            g.font = '900 16px Fredoka, sans-serif';
            g.textAlign = 'center';
            g.textBaseline = 'middle';
            g.fillText(anim.bubble, bx + bw * 0.5, by + bh * 0.5);
            g.restore();
          }

          /* Team name badge + HP bar under yard */
          g.save();
          g.translate(baseX, GROUND + 36);
          g.fillStyle = 'rgba(15, 23, 42, 0.88)';
          g.strokeStyle = teamCol;
          g.lineWidth = 4;
          g.beginPath(); g.roundRect(-105, -22, 210, 44, 14); g.fill(); g.stroke();
          drawOutlinedText(g, (isCat ? '🐱 ' : '🐶 ') + (T[idx].name || ('Team ' + (idx + 1))), 0, 1, 24, '#ffffff', '#0f172a');

          /* Mini HP / Stamina bar right above the team badge */
          var hpRatio = Math.max(0, Math.min(1, anim.hp / anim.maxHp));
          var barW = 150;
          var barH = 10;
          g.fillStyle = 'rgba(15, 23, 42, 0.85)';
          g.strokeStyle = '#ffffff';
          g.lineWidth = 2;
          g.beginPath(); g.roundRect(-barW * 0.5, -36, barW, barH, 5); g.fill(); g.stroke();
          g.fillStyle = hpRatio > 0.5 ? '#4ade80' : (hpRatio > 0.25 ? '#fbbf24' : '#f43f5e');
          if (hpRatio > 0) {
            g.beginPath(); g.roundRect(-barW * 0.5 + 2, -34, (barW - 4) * hpRatio, barH - 4, 4); g.fill();
          }
          g.restore();
        });

        /* Cartoon POW / BONK burst ring at impact point */
        if (bonkBurst) {
          var bAge = (now - bonkBurst.t0) / 1000;
          if (bAge > 0.55) {
            bonkBurst = null;
          } else {
            var bRad = 28 + bAge * 150;
            var bAlpha = Math.max(0, 1 - bAge / 0.55);
            g.save();
            g.strokeStyle = 'rgba(253, 224, 71, ' + bAlpha.toFixed(2) + ')';
            g.lineWidth = 8;
            g.beginPath();
            g.arc(bonkBurst.x, bonkBurst.y, bRad, 0, Math.PI * 2);
            g.stroke();
            g.restore();
          }
        }
      }

      function drawAimGuide() {
        if (mode !== 'aim') return;
        var sp = shooterPos();
        var defName = turn === 0 ? 'the Dog 🐶' : 'the Cat 🐱';
        if (!aim) {
          g.save();
          g.strokeStyle = '#fde047';
          g.lineWidth = 4;
          g.setLineDash([10, 8]);
          g.beginPath();
          g.arc(sp.x, sp.y - 20, 62, 0, Math.PI * 2);
          g.stroke();
          g.restore();
          drawOutlinedText(g, '👆 Drag back & release to throw at ' + defName + '!', sp.x + (turn === 0 ? 70 : -70), sp.y - 145, 25, '#fde047', '#0f172a');
          return;
        }
        var v = launchVec(aim);
        var x = sp.x + (turn === 0 ? 48 : -48);
        var y = sp.y - 36;
        var vx = v.vx;
        var vy = v.vy;

        /* Elastic pull band */
        g.save();
        g.strokeStyle = '#fde047';
        g.lineWidth = 5;
        g.setLineDash([10, 8]);
        g.beginPath();
        g.moveTo(sp.x, sp.y - 20);
        g.lineTo(aim.x, aim.y);
        g.stroke();
        g.restore();

        /* Dotted arc trajectory preview */
        for (var k = 0; k < L.dots; k++) {
          for (var s = 0; s < 4; s++) {
            vy += G * 0.02;
            vx += wind * 0.02;
            x += vx * 0.02;
            y += vy * 0.02;
          }
          g.fillStyle = 'rgba(255, 255, 255, ' + Math.max(0.25, 0.95 - k * 0.055) + ')';
          g.strokeStyle = '#0f172a';
          g.lineWidth = 3;
          g.beginPath();
          g.arc(x, y, Math.max(5, 11 - k * 0.45), 0, Math.PI * 2);
          g.fill();
          g.stroke();
        }
        drawOutlinedText(g, 'Power ' + v.pull + '% • ' + v.deg + '°', sp.x + (turn === 0 ? 30 : -30), sp.y - 140, 28, '#fde047', '#0f172a');
      }

      function drawProjectile() {
        if (!proj) return;
        var hRatio = Math.max(0, Math.min(1, (GROUND - proj.y) / 520));
        var shR = 32 * (1 - hRatio * 0.62);
        g.save();
        g.fillStyle = 'rgba(15, 23, 42, ' + (0.38 * (1 - hRatio * 0.5)) + ')';
        g.beginPath();
        g.ellipse(proj.x, GROUND - 4, shR, shR * 0.32, 0, 0, Math.PI * 2);
        g.fill();
        g.restore();

        /* Glowing ribbon trail */
        trail.forEach(function (p, k) {
          var frac = (k + 1) / trail.length;
          g.fillStyle = turn === 0
            ? 'rgba(244, 114, 182, ' + (frac * 0.65) + ')'
            : 'rgba(253, 224, 71, ' + (frac * 0.65) + ')';
          g.beginPath();
          g.arc(p.x, p.y, 4 + frac * 11, 0, Math.PI * 2);
          g.fill();
        });

        /* Spinning yarn ball (Team 1) or bone (Team 2) */
        g.save();
        g.translate(proj.x, proj.y);
        g.rotate(proj.rot);
        var prImg = turn === 0 ? art.yarn : art.bone;
        if (imgReady(prImg)) {
          g.drawImage(prImg, -38, -38, 76, 76);
        } else {
          g.fillStyle = T[turn].color || '#f59e0b';
          g.strokeStyle = '#0f172a';
          g.lineWidth = 4;
          g.beginPath(); g.arc(0, 0, 28, 0, Math.PI * 2); g.fill(); g.stroke();
        }
        g.restore();
      }

      function drawForegroundParallax(now) {
        g.save();
        fgTufts.forEach(function (f, i) {
          var fx = ((f.x - cam.x * 1.22) % (WORLD_W + 200));
          if (fx < -100) fx += WORLD_W + 200;
          var sway = Math.sin(now / 380 + i) * 6 + (wind * 0.03);
          var fy = H + 4;
          g.strokeStyle = hal ? '#3b0764' : '#365314';
          g.lineWidth = 6;
          g.lineCap = 'round';
          g.beginPath();
          g.moveTo(fx, fy);
          g.quadraticCurveTo(fx + sway * 0.5, fy - f.h * 0.6, fx + sway, fy - f.h);
          g.stroke();
          if (i % 4 === 0) {
            g.fillStyle = hal ? '#fb923c' : f.col;
            g.beginPath();
            g.arc(fx + sway, fy - f.h, 6, 0, Math.PI * 2);
            g.fill();
          }
        });
        g.restore();
      }

      function drawWindBadge() {
        var wx = viewW - 155;
        var wy = 86;
        g.save();
        g.fillStyle = 'rgba(15, 23, 42, 0.82)';
        g.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        g.lineWidth = 3;
        g.beginPath();
        g.roundRect(wx - 115, wy - 24, 230, 48, 24);
        g.fill();
        g.stroke();
        if (wind === 0) {
          drawOutlinedText(g, '🍃 Calm Air', wx, wy + 1, 22, '#4ade80', '#0f172a');
        } else {
          var arrow = wind > 0 ? '💨 Wind ➔' : '⬅ Wind 💨';
          drawOutlinedText(g, arrow, wx, wy + 1, 22, '#fde047', '#0f172a');
        }
        g.restore();
      }

      /* ---------- Single 60fps Delta-Time Loop ---------- */
      var last = performance.now();
      function frame(now) {
        if (!alive) return;
        var rawDt = Math.min(0.033, (now - last) / 1000);
        last = now;

        var dt = rawDt;
        if (slowMoT > 0) {
          slowMoT = Math.max(0, slowMoT - rawDt);
          dt = rawDt * 0.38;
        }

        if (crowdCheerT > 0) crowdCheerT = Math.max(0, crowdCheerT - rawDt);
        if (fenceWobble > 0) fenceWobble = Math.max(0, fenceWobble - rawDt * 2.4);
        charAnim[0].t += rawDt;
        charAnim[1].t += rawDt;
        if (charAnim[0].bonkT > 0) charAnim[0].bonkT = Math.max(0, charAnim[0].bonkT - rawDt);
        if (charAnim[1].bonkT > 0) charAnim[1].bonkT = Math.max(0, charAnim[1].bonkT - rawDt);

        clouds.forEach(function (c) {
          c.x += (c.v + wind * 0.08) * dt;
        });
        skyFlyers.forEach(function (b) {
          b.x += b.v * dt;
        });

        /* Projectile flight & collision checks against the opposing Dog/Cat! */
        if (proj) {
          var steps = 3;
          var sd = dt / steps;
          var mx = midX();
          var oppIdx = 1 - turn;
          var oppX = oppIdx === 0 ? leftX() : rightX();
          var oppHeadY = GROUND - 155;
          var oppBodyY = GROUND - 78;
          var oppName = oppIdx === 0 ? 'Cat' : 'Dog';

          for (var s = 0; s < steps && proj; s++) {
            proj.vy += G * sd;
            proj.vx += wind * sd;
            proj.x += proj.vx * sd;
            proj.y += proj.vy * sd;
            proj.rot += sd * 11 * (turn === 0 ? 1 : -1);
            proj.t += sd;

            /* Smoothly pan camera with the flying yarn/bone */
            cam.targetX = Math.max(0, Math.min(WORLD_W - viewW, proj.x - viewW * 0.5));

            /* 1. Floating +15 Star Coin above fence */
            if (!star.hit && Math.hypot(proj.x - mx, proj.y - (star.ry || star.y)) < 64) {
              star.hit = true;
              starPts = 15;
              A().play('pu_star');
              A().play('sparkle');
              A().play('coin_collect');
              puff(mx, star.ry || star.y, 24, ['#fde047', '#ffffff', '#38bdf8']);
              var stPt = toScreen(mx, star.ry || star.y);
              J().floatAt(stPt, '⭐ Star +15!', 'good');
            }

            /* 2. Middle Wooden Fence collision */
            if (!proj.hitFence && Math.abs(proj.x - mx) < 34 && proj.y > GROUND - fenceH) {
              proj.hitFence = true;
              fenceWobble = 1.0;
              A().play('wood_fence_knock');
              A().play('wood_knock');
              triggerShake(5, 0.2);
              puff(proj.x, proj.y, 14, ['#f59e0b', '#fde047', '#ffffff']);
              if (proj.y < GROUND - fenceH + 26 && proj.vy > 0) {
                proj.y = GROUND - fenceH - 12;
                proj.vy = -Math.abs(proj.vy) * 0.62;
              } else {
                proj.vx = -proj.vx * 0.42;
                proj.vy = Math.max(80, proj.vy * 0.5);
                proj.x = mx + (proj.x < mx ? -38 : 38);
              }
            }

            /* 3. Direct Hit on the Opposing Character (Head Bonk +30 or Body Hit +20)! */
            var dHead = Math.hypot(proj.x - oppX, proj.y - oppHeadY);
            var dBody = Math.hypot(proj.x - oppX, proj.y - oppBodyY);
            if (dHead < 82) {
              puff(proj.x, proj.y, 38, ['#fde047', '#f43f5e', '#38bdf8', '#ffffff']);
              finishShot('💥 ' + oppName.toUpperCase() + ' BONK!', 30, oppX, oppHeadY, true);
              break;
            }
            if (dBody < 92) {
              puff(proj.x, proj.y, 32, ['#4ade80', '#fde047', '#ffffff']);
              finishShot('🎯 HIT ' + oppName.toUpperCase() + '!', 20, oppX, oppBodyY, true);
              break;
            }

            /* 4. Ground landing (check if it splashed right next to the opponent for +10!) */
            if (proj && proj.y > GROUND - 24) {
              proj.y = GROUND - 24;
              proj.bounces++;
              puff(proj.x, GROUND - 10, 12, ['#84cc16', '#fde047']);

              if (Math.abs(proj.x - oppX) < 175 && !proj.hitFence) {
                puff(oppX, oppBodyY, 24, ['#38bdf8', '#fde047', '#ffffff']);
                finishShot('💦 SPLASH HIT!', 10, proj.x, GROUND - 24, false);
                break;
              }

              if (proj.bounces <= 1 && Math.abs(proj.vy) > 230 && !proj.hitFence) {
                proj.vy = -Math.abs(proj.vy) * 0.46;
                proj.vx *= 0.72;
                A().play('hunt_dig');
              } else {
                var landMsg = proj.hitFence ? '🪵 Fence Knock!' : '👍 Nice Try!';
                finishShot(landMsg, 5, proj.x, GROUND - 24, false);
                break;
              }
            }

            if (proj && (proj.x < 40 || proj.x > WORLD_W - 40 || proj.t > 5.0)) {
              finishShot('👍 Good Try!', 5, Math.max(120, Math.min(WORLD_W - 120, proj.x)), GROUND - 40, false);
              break;
            }
          }

          if (proj) {
            trail.push({ x: proj.x, y: proj.y });
            if (trail.length > 22) trail.shift();
          }
        }

        /* Smooth camera easing */
        var lerp = proj ? 0.16 : 0.09;
        cam.x += (cam.targetX - cam.x) * lerp;
        cam.y += (cam.targetY - cam.y) * lerp;
        cam.zoom += (cam.targetZoom - cam.zoom) * 0.12;

        var shakeX = 0, shakeY = 0;
        if (cam.shakeT > 0) {
          cam.shakeT = Math.max(0, cam.shakeT - rawDt);
          shakeX = (Math.random() - 0.5) * 2 * cam.shakeMag;
          shakeY = (Math.random() - 0.5) * 2 * cam.shakeMag;
        }

        parts = parts.filter(function (p) {
          p.t += rawDt;
          p.vy += 880 * rawDt;
          p.x += p.vx * rawDt;
          p.y += p.vy * rawDt;
          return p.t < p.life;
        });

        /* Draw sky & clouds in screen/parallax space */
        g.clearRect(0, 0, viewW, H);
        drawSkyAndParallax(now);

        /* Draw main world in camera-transformed space */
        g.save();
        g.translate(viewW * 0.5 + shakeX, H * 0.55 + shakeY);
        g.scale(cam.zoom, cam.zoom);
        g.translate(-viewW * 0.5 - cam.x, -H * 0.55 - cam.y);

        drawBackyardWorld(now);
        drawFenceAndBonusStar(now);
        drawCharactersAndBuddies(now);
        drawProjectile();

        parts.forEach(function (p) {
          g.globalAlpha = Math.max(0, 1 - p.t / p.life);
          g.fillStyle = p.c;
          g.beginPath();
          g.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          g.fill();
        });
        g.globalAlpha = 1;

        drawAimGuide();

        if (popText) {
          var ptAge = (now - popText.t0) / 1000;
          if (ptAge > 1.35) {
            popText = null;
          } else {
            var pScale = ptAge < 0.2 ? (0.5 + ptAge / 0.2 * 0.7) : 1.05;
            g.save();
            g.translate(popText.x, popText.y - ptAge * 36);
            g.scale(pScale, pScale);
            drawOutlinedText(g, popText.text, 0, 0, 44, popText.col, '#0f172a');
            g.restore();
          }
        }
        g.restore();

        drawForegroundParallax(now);
        drawWindBadge();

        raf = requestAnimationFrame(frame);
      }
      raf = requestAnimationFrame(frame);

      /* ---------- Turn Flow & Action Dock ---------- */
      function showTurn() {
        var t = T[turn];
        mode = 'wait';
        aim = null;
        charAnim[0].state = 'idle';
        charAnim[1].state = 'idle';
        charAnim[turn].bubble = turn === 0 ? 'My turn! 🧶' : 'My turn! 🦴';
        charAnim[1 - turn].bubble = '';
        focusCameraForTurn(turn, false);
        U().teamBar(T, turn);

        var animalTag = turn === 0 ? '🐱 Cat Side' : '🐶 Dog Side';
        updateBanner(
          t.name + '\u2019s Turn! (' + animalTag + ')',
          'Throw ' + (turnCount + 1) + ' of ' + totalTurns,
          false
        );

        dock.innerHTML = '';
        var askBtn = U().h('button', {
          type: 'button',
          class: 'gm-real3-btn amber pulse',
          text: '❓ Ask & Throw! (Space)'
        });
        askBtn.addEventListener('click', function () {
          A().play('tap');
          ask();
        });
        dock.appendChild(askBtn);
      }

      var asking = false;
      async function ask() {
        if (asking || mode !== 'wait' || !alive) return;
        asking = true;
        dock.innerHTML = '';
        var t = T[turn];
        var res = await U().ask(ctx.nextItem(), t, {
          timer: +ctx.cfg.timer || 0,
          label: 'Throw ' + (turnCount + 1) + ' of ' + totalTurns
        });
        asking = false;
        if (!alive) return;
        if (res && res.cancelled) {
          showTurn();
          return;
        }
        if (!res || !res.ok) {
          mode = 'payoff';
          charAnim[turn].state = 'shrug';
          charAnim[turn].t = 0;
          charAnim[turn].bubble = 'Nice try! 😊';
          A().play('crowd_aww_soft');
          var sp = shooterPos();
          var scPt = toScreen(sp.x, sp.y - 60);
          var fakeEl = {
            getBoundingClientRect: function () {
              return { left: scPt.x, top: scPt.y, width: 0, height: 0 };
            }
          };
          U().floatText('Nice try! 😊', fakeEl, 'soft');
          updateBanner('😊 Nice try, ' + t.name + '!', 'Next team is up!', false);
          turnCount++;
          await U().sleep(1350);
          if (!alive) return;
          if (turnCount >= totalTurns) {
            ctx.end();
            return;
          }
          turn = (turn + 1) % 2;
          newRoundProps();
          showTurn();
          return;
        }

        /* Right answer -> Ready to throw at the other character! */
        mode = 'aim';
        charAnim[turn].state = 'idle';
        charAnim[turn].bubble = 'Aim & throw!';
        charAnim[1 - turn].bubble = 'Don\u2019t hit me! 😳';
        focusCameraForTurn(turn, true);
        A().play('round');
        updateBanner(
          (turn === 0 ? '🧶 Drag back to throw yarn at the Dog!' : '🦴 Drag back to throw the bone at the Cat!'),
          'Direct Head Bonk = +30 • Body = +20 • Star = +15!',
          true
        );

        dock.innerHTML = '';
      }

      showTurn();
    }
  };
})(window);
