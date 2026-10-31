/* ============================================================================
   Game Maker — Mode: Penalty Kick (Real-3 Full-Screen 60fps Rebuild)
   ----------------------------------------------------------------------------
   Full-screen 1600x900 virtual stadium canvas with:
   - 3D perspective pitch, penalty box, 3D goal posts/crossbar & rippling net
   - Opposing team's Monster Goalkeeper wearing o_keeper_glove.webp who patrols,
     reads the kicker, and dives with real glove-reach physics
   - Big Kicker Monster (25% height) at the penalty spot + cheering buddy monster
   - 2-Step Skill Timing (NO automatic kick button):
     1️⃣ AIM TARGET: Lock the figure-8 reticle inside the goal (Top Bins = +30,
        Corners = +20, Center = +15 — but locking past the posts/crossbar clangs
        off the woodwork or misses wide!)
     2️⃣ POWER & BANANA CURVE: Hit the green sweet spot for a high-speed curving
        banana shot that bends around the keeper's dive; weak shots get saved by
        the keeper; red over-power blasts into the crossbar or over the bar!
   ============================================================================ */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {};
  GM.modes = GM.modes || {};

  var U = function () { return GM.u; };
  var A = function () { return GM.audio; };

  var VW = 1600;
  var VH = 900;

  function loadImg(src) {
    var im = new Image();
    im.src = src;
    return im;
  }
  function imgReady(im) {
    return !!(im && im.complete && im.naturalWidth > 0);
  }
  function makeMonImg(m) {
    var img = new Image();
    var svg = (GM.mon && GM.mon.svg) ? GM.mon.svg(m, 260) : '';
    if (!svg || svg.indexOf('<svg') < 0) return null;
    if (svg.indexOf('xmlns=') < 0) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    return img;
  }
  function drawOutlinedText(g, txt, x, y, size, fill, stroke, align) {
    g.save();
    g.font = '900 ' + Math.round(size) + 'px Fredoka, "Baloo 2", system-ui, sans-serif';
    g.textAlign = align || 'center';
    g.textBaseline = 'middle';
    g.lineJoin = 'round';
    g.lineWidth = Math.max(4, Math.round(size * 0.22));
    g.strokeStyle = stroke || '#0f172a';
    g.strokeText(txt, x, y);
    g.fillStyle = fill || '#ffffff';
    g.fillText(txt, x, y);
    g.restore();
  }
  function rr(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }
  function flyScoreToPod(screenPt, teamIdx, pts, cb) {
    var pod = document.querySelector('#gm-team-' + teamIdx + ' .gm-score') || document.getElementById('gm-team-' + teamIdx);
    var layer = document.getElementById('gm-fx');
    if (!pod || !layer || !screenPt) {
      if (cb) cb();
      return;
    }
    var r = pod.getBoundingClientRect();
    var orb = U().h('div', { class: 'gm-score-orb', text: '+' + pts });
    orb.style.left = Math.round(screenPt.x) + 'px';
    orb.style.top = Math.round(screenPt.y) + 'px';
    layer.appendChild(orb);
    setTimeout(function () {
      orb.style.left = Math.round(r.left + r.width / 2) + 'px';
      orb.style.top = Math.round(r.top + r.height / 2) + 'px';
      orb.style.transform = 'translate(-50%, -50%) scale(0.75)';
    }, 24);
    setTimeout(function () {
      if (orb.parentNode) orb.parentNode.removeChild(orb);
      if (cb) cb();
    }, 640);
  }

  GM.modes.penalty = {
    id: 'penalty',
    name: 'Pumpkin Penalty',
    nameClassic: 'Penalty Kick',
    e: '⚽',
    desc: 'Answer right, then lock your Aim Target on the 3D goal and time the Fast Power + Banana Curve meter to beat the diving goalkeeper!',
    descClassic: 'Answer right, then lock your Aim Target on the 3D goal and time the Fast Power + Banana Curve meter to beat the diving goalkeeper!',
    fields: [
      { key: 'kicks', label: 'Kicks for each team', opts: [[3, '3'], [4, '4'], [5, '5'], [8, '8']], def: 4 },
      { key: 'level', label: 'Goalkeeper Skill', opts: [['easy', 'Easy'], ['normal', 'Normal'], ['hard', 'Pro Keeper']], def: 'normal' }
    ],

    start: function (ctx) {
      var st = GM.state;
      var hal = st.theme === 'halloween';
      var T = st.teams;
      var nt = T.length;
      var totalKicks = (+ctx.cfg.kicks || 4) * nt;
      var kickNo = 0;
      var turn = 0;
      var alive = true;
      var ended = false;
      var asking = false;

      var LV = {
        easy:   { s: 0.88, green: [0.64, 0.88], keeperSkill: 0.48, keeperReach: 0.36 },
        normal: { s: 1.25, green: [0.72, 0.85], keeperSkill: 0.72, keeperReach: 0.43 },
        hard:   { s: 1.62, green: [0.76, 0.84], keeperSkill: 0.88, keeperReach: 0.49 }
      }[ctx.cfg.level] || { s: 1.25, green: [0.72, 0.85], keeperSkill: 0.72, keeperReach: 0.43 };

      try { A().musicStart(hal ? 'halloween' : 'sports'); } catch (e) { /* ignore */ }
      if (document.body) document.body.classList.add('gm-small-pods', 'gm-real3-active');

      var rootEl = ctx.root;
      rootEl.innerHTML = '';

      var wrap = U().h('div', { class: 'gm-real3-scene gm-penalty-real3', title: 'Tap the stadium (or press Space) to lock Aim and Power!' });
      var cv = U().h('canvas', { class: 'gm-real3-cv' });
      var g = cv.getContext('2d');
      var banner = U().h('div', { class: 'gm-real3-banner' });
      var dock = U().h('div', { class: 'gm-real3-dock' });
      wrap.appendChild(cv);
      rootEl.appendChild(U().h('div', { class: 'gm-boardwrap' }, [wrap, banner, dock]));

      /* Preload art assets */
      var artBgClassic = loadImg('art/bg_classic_penalty.webp');
      var artBgHal     = loadImg('art/bg_pumpkin_patch.webp');
      var artNet       = loadImg('art/o_goal_net.webp');
      var artBall      = loadImg(hal ? 'art/o_pumpkin_ball.webp' : 'art/o_football.webp');
      var artBallFallback = loadImg('art/o_football.webp');
      var artGlove     = loadImg('art/o_keeper_glove.webp');
      var artTarget    = loadImg('art/o_target.webp');
      var artStar      = loadImg('art/o_star_coin.webp');
      var monImgs      = T.map(function (t) { return makeMonImg(t.mon); });

      /* 3D Goal Geometry in virtual 1600x900 coords:
         Goal mouth spans x: [410..1190] (center 800, half-width GW = 390),
         y: [185..475] (crossbar at 185, goal line at 475, height GH = 290).
         Penalty spot is at (800, 775). */
      var GX = 800, GY_LINE = 475, GY_BAR = 185, GW = 390, GH = 290;
      var SPOT_X = 800, SPOT_Y = 775;

      function goalToScreen(nx, ny) {
        /* nx in [-1..1] across goalposts, ny in [0..1] from ground (0) to crossbar (1) */
        return {
          x: GX + nx * GW,
          y: GY_LINE - ny * GH
        };
      }

      /* Game State */
      var phase = 'wait'; /* 'wait' | 'aim' | 'power' | 'runup' | 'flight' | 'result' | 'shrug' | 'finale' */
      var phaseT = 0;
      var aimT = 0;
      var aimX = 0, aimY = 0.5;
      var pow = 0.15, powDir = 1;
      var spinDir = 1; /* +1 curves right-to-left or left-to-right into corner */
      var cam = { zoom: 1, tzoom: 1, ox: 0, oy: 0, shakeT: 0, shakeMag: 0 };
      var netRipple = { t: 0, x: 0, y: 0.5, active: false };
      var crowdCheerT = 0;
      var popText = null;
      var particles = [];
      var trail = [];
      var scorecard = T.map(function () { return []; });

      var keeper = {
        x: 0,       /* normalized [-1..1] */
        y: 0.18,    /* normalized [0..1] */
        tx: 0,
        ty: 0.18,
        startX: 0,
        startY: 0.18,
        diving: false,
        diveT: 0,
        rot: 0,
        saved: false
      };

      var ball = {
        x: SPOT_X,
        y: SPOT_Y,
        r: 44,
        rot: 0,
        startX: 0,
        targetX: 0,
        targetY: 0.4,
        curveX: 0,
        flightDur: 0.58,
        t: 0,
        outcome: 'goal', /* 'topbins' | 'corner' | 'goal' | 'save' | 'post' | 'crossbar' | 'wide' */
        reboundVX: 0,
        reboundVY: 0,
        rebounding: false
      };

      function triggerShake(mag, dur) {
        cam.shakeMag = Math.min(9, mag || 5);
        cam.shakeT = Math.min(0.32, dur || 0.22);
      }

      function addBurst(x, y, count, cols, speed) {
        for (var i = 0; i < count; i++) {
          var a = Math.random() * Math.PI * 2;
          var s = (speed || 180) * (0.4 + Math.random() * 0.9);
          particles.push({
            x: x, y: y,
            vx: Math.cos(a) * s,
            vy: Math.sin(a) * s - 70,
            r: 5 + Math.random() * 6,
            c: cols[i % cols.length],
            t: 0,
            life: 0.5 + Math.random() * 0.4
          });
        }
      }

      function worldToClient(wx, wy) {
        var r = cv.getBoundingClientRect();
        return {
          x: r.left + (wx / VW) * r.width,
          y: r.top + (wy / VH) * r.height
        };
      }

      function updateBanner(title, sub, compact) {
        var t = T[turn] || T[0];
        banner.style.setProperty('--c', (t && t.color) || '#38bdf8');
        banner.innerHTML = '';
        if (t && t.mon) banner.appendChild(U().monFace(t.mon, 42));
        banner.appendChild(U().h('b', { text: title }));
        if (sub) banner.appendChild(U().h('span', { class: 'gm-real3-sub', text: sub }));
        banner.className = 'gm-real3-banner in' + (compact ? ' compact' : '');
      }

      function fitCanvas() {
        var dpr = Math.min(2, root.devicePixelRatio || 1);
        cv.width = Math.round(VW * dpr);
        cv.height = Math.round(VH * dpr);
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      fitCanvas();
      root.addEventListener('resize', fitCanvas);

      function renderActionDock() {
        dock.innerHTML = '';
        if (phase === 'aim') {
          var aimBtn = U().h('button', {
            type: 'button',
            class: 'gm-real3-btn green pulse',
            text: '🎯 1. LOCK AIM! (Space)'
          });
          aimBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            lockStep();
          });
          dock.appendChild(aimBtn);
        } else if (phase === 'power') {
          var kickBtn = U().h('button', {
            type: 'button',
            class: 'gm-real3-btn green pulse',
            text: '👟 2. KICK BALL! (Space)'
          });
          kickBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            lockStep();
          });
          dock.appendChild(kickBtn);
        }
      }

      function resetBallAndKeeper() {
        ball.x = SPOT_X;
        ball.y = SPOT_Y;
        ball.r = 44;
        ball.rot = 0;
        ball.t = 0;
        ball.rebounding = false;
        trail = [];
        keeper.x = 0;
        keeper.y = 0.18;
        keeper.tx = 0;
        keeper.ty = 0.18;
        keeper.diving = false;
        keeper.diveT = 0;
        keeper.rot = 0;
        keeper.saved = false;
        cam.tzoom = 1.0;
      }

      function showTurn() {
        var t = T[turn];
        phase = 'wait';
        phaseT = 0;
        resetBallAndKeeper();
        U().teamBar(T, turn);
        updateBanner(t.name + '\u2019s Penalty Kick!', 'Kick ' + (kickNo + 1) + ' of ' + totalKicks, false);
        dock.innerHTML = '';
        var askBtn = U().h('button', {
          type: 'button',
          class: 'gm-real3-btn amber pulse',
          text: '❓ Ask & Step Up! (Space)'
        });
        askBtn.addEventListener('click', function () {
          A().play('tap');
          askQuestion();
        });
        dock.appendChild(askBtn);
      }

      async function askQuestion() {
        if (asking || phase !== 'wait' || !alive) return;
        asking = true;
        dock.innerHTML = '';
        var t = T[turn];
        var res = await U().ask(ctx.nextItem(), t, {
          timer: +ctx.cfg.timer || 0,
          label: 'Kick ' + (kickNo + 1) + ' of ' + totalKicks
        });
        asking = false;
        if (!alive) return;

        if (!res || !res.ok) {
          phase = 'shrug';
          phaseT = 0;
          A().play('crowd_aww_soft');
          var sp = worldToClient(SPOT_X - 165, SPOT_Y - 120);
          U().floatText('Nice try! 😊', { getBoundingClientRect: function () { return { left: sp.x, top: sp.y, width: 0, height: 0 }; } }, 'soft');
          updateBanner('😊 Nice try, ' + t.name + '!', 'Next team steps up!', false);
          kickNo++;
          setTimeout(function () {
            if (!alive) return;
            if (kickNo >= totalKicks) { startFinale(); return; }
            turn = (turn + 1) % nt;
            showTurn();
          }, 1450);
          return;
        }

        /* Start Step 1: Aim Target */
        phase = 'aim';
        phaseT = 0;
        aimT = Math.random() * 6.28;
        A().play('whistle');
        updateBanner('1️⃣ AIM TARGET: Tap LOCK AIM when the reticle is inside a corner!', 'Watch out for the posts & crossbar!', true);
        renderActionDock();
      }

      function lockStep() {
        if (!alive) return;
        if (phase === 'aim') {
          A().play('tap');
          phase = 'power';
          phaseT = 0;
          pow = 0.08;
          powDir = 1;
          /* Banana curve bends inward from whichever side you aimed */
          spinDir = aimX >= 0 ? -1 : 1;
          updateBanner('2️⃣ POWER & CURVE: Tap KICK in the green zone for a Banana Curve Shot!', 'Too weak = Keeper Save! Red zone = Crossbar blast!', true);
          renderActionDock();
        } else if (phase === 'power') {
          A().play('tap');
          startKick();
        }
      }

      function startKick() {
        dock.innerHTML = '';
        phase = 'runup';
        phaseT = 0;
        A().play('crowd_ooh');

        var g0 = LV.green[0], g1 = LV.green[1];
        var inGreen = (pow >= g0 && pow <= g1);
        var tooWeak = (pow < 0.44);
        var overPow = (pow > g1 + 0.03);

        /* Compute final ball target at goal plane (normalized nx, ny) */
        var finalX = aimX;
        var finalY = aimY;
        var curveAmt = 0;

        if (inGreen) {
          /* Banana curve bends the ball away from the keeper and into the corner */
          curveAmt = (aimX >= 0 ? 0.24 : -0.24);
          finalY = Math.min(0.93, Math.max(0.14, finalY + 0.04));
        } else if (overPow) {
          /* Red over-power blasts the ball high toward/over the crossbar! */
          var over = pow - g1;
          finalY = Math.min(1.26, finalY + 0.34 + over * 2.1);
          finalX += (Math.random() - 0.5) * 0.24;
        } else if (tooWeak) {
          /* Weak shot rolls low and slow */
          finalY = Math.min(0.28, finalY * 0.45);
        } else {
          /* Yellow zone: slight natural drift */
          curveAmt = (aimX >= 0 ? 0.08 : -0.08);
          finalX += (Math.random() - 0.5) * 0.08;
        }

        ball.targetX = finalX;
        ball.targetY = finalY;
        ball.curveX = curveAmt;
        ball.flightDur = tooWeak ? 0.78 : (overPow ? 0.44 : (0.64 - pow * 0.16));

        /* Smart Goalkeeper Dive AI */
        keeper.startX = keeper.x;
        keeper.startY = keeper.y;
        keeper.diving = true;
        keeper.diveT = 0;

        /* Does the keeper read the shot direction? */
        var readChance = LV.keeperSkill + (tooWeak ? 0.25 : 0) - (inGreen ? 0.22 : 0);
        var guessesRight = Math.random() < readChance || Math.abs(finalX) < 0.46;
        if (guessesRight) {
          /* Keeper dives toward the aimed spot, but banana curve (inGreen) bends around their reach! */
          var maxDiveX = inGreen ? 0.72 : 0.90;
          keeper.tx = Math.max(-maxDiveX, Math.min(maxDiveX, finalX - curveAmt * 0.55));
          keeper.ty = Math.max(0.14, Math.min(0.84, finalY * (tooWeak ? 1.0 : 0.88)));
        } else {
          /* Keeper gets wrong-footed by the kicker's eyes/curve! */
          keeper.tx = (finalX >= 0 ? -1 : 1) * (0.45 + Math.random() * 0.35);
          keeper.ty = 0.22 + Math.random() * 0.45;
        }

        /* Determine shot outcome */
        var absX = Math.abs(finalX);
        var hitPost = (absX >= 0.96 && absX <= 1.08 && finalY <= 1.06);
        var hitBar  = (finalY >= 0.95 && finalY <= 1.07 && absX <= 1.08);
        var isWide  = (absX > 1.08 || finalY > 1.07);

        if (hitBar) {
          ball.outcome = 'crossbar';
        } else if (hitPost) {
          ball.outcome = 'post';
        } else if (isWide) {
          ball.outcome = 'wide';
        } else {
          /* Inside the goal frame [|x| < 0.96, y < 0.95]: check goalkeeper reach! */
          var distToKeeper = Math.hypot((finalX - keeper.tx) * 1.05, (finalY - keeper.ty) * 0.95);
          var reach = LV.keeperReach + (tooWeak ? 0.22 : 0) - (inGreen ? 0.14 : 0);
          /* Top Bins shots in the green sweet spot always beat the keeper! */
          var isTopBins = (absX >= 0.64 && finalY >= 0.62);
          if (isTopBins && inGreen) {
            ball.outcome = 'topbins';
          } else if (distToKeeper < reach) {
            ball.outcome = 'save';
          } else if (isTopBins) {
            ball.outcome = 'topbins';
          } else if (absX >= 0.54) {
            ball.outcome = 'corner';
          } else {
            ball.outcome = 'goal';
          }
        }
      }

      function resolveKickResult() {
        phase = 'result';
        phaseT = 0;
        var gp = goalToScreen(ball.targetX, ball.targetY);
        var clientPt = worldToClient(gp.x, gp.y);
        var activeTurn = turn;
        var pts = 5;
        var mark = '✖';

        if (ball.outcome === 'topbins') {
          pts = 30;
          mark = '⭐';
          crowdCheerT = 1.9;
          netRipple = { t: 0, x: ball.targetX, y: ball.targetY, active: true };
          A().play('goal_horn');
          A().play('crowd_roar_big');
          A().play('sparkle');
          triggerShake(7, 0.28);
          addBurst(gp.x, gp.y, 38, ['#fde047', '#4ade80', '#38bdf8', '#ffffff', '#f43f5e'], 280);
          U().confetti(36);
          popText = { txt: '🌟 TOP BINS! +30', col: '#fde047', t: 0 };
          updateBanner('🌟 TOP BINS BANANA GOAL! +30!', 'Unstoppable upper-90 strike!', false);
        } else if (ball.outcome === 'corner' || ball.outcome === 'goal') {
          pts = ball.outcome === 'corner' ? 20 : 15;
          mark = '⚽';
          crowdCheerT = 1.5;
          netRipple = { t: 0, x: ball.targetX, y: ball.targetY, active: true };
          A().play('goal_horn');
          A().play('crowd_cheer_small');
          triggerShake(5, 0.22);
          addBurst(gp.x, gp.y, 26, ['#4ade80', '#fde047', '#38bdf8', '#ffffff'], 220);
          U().confetti(24);
          popText = { txt: (pts === 20 ? '🍌 CORNER GOAL! +20' : '⚽ GOAL! +15'), col: '#4ade80', t: 0 };
          updateBanner('⚽ GOAL FOR ' + T[activeTurn].name.toUpperCase() + '! +' + pts + '!', 'Beat the diving goalkeeper!', false);
        } else if (ball.outcome === 'save') {
          pts = 5;
          mark = '🧤';
          keeper.saved = true;
          ball.rebounding = true;
          ball.reboundVX = (ball.targetX >= 0 ? 1 : -1) * 260;
          ball.reboundVY = 180;
          A().play('hit_rim');
          A().play('crowd_ooh');
          triggerShake(5, 0.18);
          addBurst(gp.x, gp.y, 18, ['#38bdf8', '#ffffff', '#fde047'], 170);
          popText = { txt: '🧤 KEEPER SAVE! +5', col: '#38bdf8', t: 0 };
          updateBanner('🧤 WHAT A SAVE BY THE KEEPER!', 'Nice effort! +5 points!', false);
        } else if (ball.outcome === 'crossbar' || ball.outcome === 'post') {
          pts = 5;
          mark = '💥';
          ball.rebounding = true;
          ball.reboundVX = (ball.targetX >= 0 ? 1 : -1) * 320;
          ball.reboundVY = 240;
          A().play('hit_rim');
          A().play('wood_knock');
          A().play('crowd_ooh');
          triggerShake(8, 0.28);
          addBurst(gp.x, gp.y, 24, ['#fb923c', '#fde047', '#ffffff'], 240);
          popText = { txt: (ball.outcome === 'crossbar' ? '💥 CROSSBAR CLANG! +5' : '💥 OFF THE POST! +5'), col: '#fb923c', t: 0 };
          updateBanner(ball.outcome === 'crossbar' ? '💥 CLANG OFF THE CROSSBAR!' : '💥 OFF THE GOALPOST!', 'Inches away! +5 effort points!', false);
        } else {
          pts = 5;
          mark = '💨';
          A().play('crowd_aww_soft');
          popText = { txt: '🚀 JUST WIDE! +5', col: '#fb923c', t: 0 };
          updateBanner('😮 Fired wide of the frame!', 'Good try! +5 effort points!', false);
        }

        scorecard[activeTurn].push(mark);
        A().play('coin_collect');
        flyScoreToPod(clientPt, activeTurn, pts, function () {
          if (!alive) return;
          U().addScore(activeTurn, pts);
        });

        kickNo++;
        setTimeout(function () {
          if (!alive) return;
          if (kickNo >= totalKicks) {
            startFinale();
            return;
          }
          turn = (turn + 1) % nt;
          showTurn();
        }, 2000);
      }

      function startFinale() {
        if (ended) return;
        phase = 'finale';
        phaseT = 0;
        dock.innerHTML = '';
        updateBanner('🏆 Penalty Shootout Complete!', 'What a match!', false);
        A().play('crowd_roar_big');
        A().play('win_fanfare');
        U().confetti(44);
        setTimeout(function () {
          if (!alive || ended) return;
          ended = true;
          ctx.end();
        }, 1750);
      }

      /* Input Listeners */
      function onPointerDown(e) {
        if (!alive) return;
        if (e.target && e.target.closest && e.target.closest('.gm-real3-dock')) return;
        if (phase === 'aim' || phase === 'power') {
          e.preventDefault();
          lockStep();
        }
      }
      function onKeyDown(e) {
        if (!alive) return;
        if (e.code === 'Space' || e.key === ' ') {
          if (document.querySelector('.gm-over')) return;
          if (phase === 'aim' || phase === 'power') {
            e.preventDefault();
            lockStep();
          } else if (phase === 'wait' && !asking) {
            e.preventDefault();
            askQuestion();
          }
        }
      }
      wrap.addEventListener('pointerdown', onPointerDown);
      root.addEventListener('keydown', onKeyDown);

      ctx.onEnd(function () {
        alive = false;
        cancelAnimationFrame(rafId);
        root.removeEventListener('resize', fitCanvas);
        root.removeEventListener('keydown', onKeyDown);
        if (document.body) document.body.classList.remove('gm-small-pods', 'gm-real3-active');
      });

      /* ---- Drawing Helpers ---- */
      function drawStadiumAndPitch(now) {
        var bg = hal ? (imgReady(artBgHal) ? artBgHal : artBgClassic) : artBgClassic;
        if (imgReady(bg)) {
          g.drawImage(bg, 0, 0, VW, VH);
          g.fillStyle = hal ? 'rgba(18, 6, 36, 0.42)' : 'rgba(6, 15, 32, 0.24)';
          g.fillRect(0, 0, VW, VH);
        } else {
          var sky = g.createLinearGradient(0, 0, 0, GY_LINE);
          sky.addColorStop(0, hal ? '#1a0633' : '#09152e');
          sky.addColorStop(1, hal ? '#3b0764' : '#1e3a8a');
          g.fillStyle = sky;
          g.fillRect(0, 0, VW, GY_LINE);
        }

        /* Cheering Stadium Crowd Tier behind the goal */
        g.save();
        g.fillStyle = 'rgba(15, 23, 42, 0.78)';
        g.fillRect(0, GY_LINE - 135, VW, 135);
        for (var c = 0; c < 34; c++) {
          var cx = 35 + c * 46;
          var bounce = crowdCheerT > 0
            ? Math.abs(Math.sin(now / 95 + c * 0.7)) * 18
            : Math.abs(Math.sin(now / 380 + c * 0.9)) * 4;
          var cy = GY_LINE - 52 - (c % 2) * 24 - bounce;
          g.fillStyle = T[c % nt] ? T[c % nt].color : '#38bdf8';
          g.beginPath();
          g.arc(cx, cy, 13, 0, Math.PI * 2);
          g.fill();
          g.fillStyle = '#0f172a';
          g.beginPath();
          g.arc(cx, cy - 16, 9, 0, Math.PI * 2);
          g.fill();
        }
        g.restore();

        /* 3D Perspective Turf with mowed stripes */
        var turfGrad = g.createLinearGradient(0, GY_LINE, 0, VH);
        turfGrad.addColorStop(0, hal ? '#14532d' : '#15803d');
        turfGrad.addColorStop(1, hal ? '#052e16' : '#166534');
        g.fillStyle = turfGrad;
        g.fillRect(0, GY_LINE, VW, VH - GY_LINE);

        for (var s = -5; s <= 5; s++) {
          if (s % 2 === 0) continue;
          g.fillStyle = 'rgba(255, 255, 255, 0.05)';
          g.beginPath();
          g.moveTo(GX + s * 115, GY_LINE);
          g.lineTo(GX + (s + 1) * 115, GY_LINE);
          g.lineTo(GX + (s + 1) * 260, VH);
          g.lineTo(GX + s * 260, VH);
          g.closePath();
          g.fill();
        }

        /* Crisp 3D Penalty Box Lines & Goal Line */
        g.save();
        g.strokeStyle = 'rgba(255, 255, 255, 0.82)';
        g.lineWidth = 6;
        g.beginPath();
        g.moveTo(0, GY_LINE);
        g.lineTo(VW, GY_LINE);
        /* 18-yard penalty box perspective lines */
        g.moveTo(GX - GW - 140, GY_LINE);
        g.lineTo(GX - GW - 340, VH);
        g.moveTo(GX + GW + 140, GY_LINE);
        g.lineTo(GX + GW + 340, VH);
        /* 6-yard goal box */
        g.moveTo(GX - GW - 35, GY_LINE);
        g.lineTo(GX - GW - 95, GY_LINE + 135);
        g.lineTo(GX + GW + 95, GY_LINE + 135);
        g.lineTo(GX + GW + 35, GY_LINE);
        g.stroke();

        /* Penalty Spot */
        g.fillStyle = '#ffffff';
        g.beginPath();
        g.ellipse(SPOT_X, SPOT_Y + 12, 18, 7, 0, 0, Math.PI * 2);
        g.fill();
        g.restore();
      }

      function drawGoal3D(now) {
        var L = GX - GW, R = GX + GW, T_Y = GY_BAR, B_Y = GY_LINE;
        var depthX = 52, depthY = 38;
        var backL = L + depthX, backR = R - depthX, backT = T_Y + depthY, backB = B_Y - 12;

        g.save();
        /* Goal Ground Shadow */
        g.fillStyle = 'rgba(0, 0, 0, 0.34)';
        g.beginPath();
        g.moveTo(L - 12, B_Y + 6);
        g.lineTo(R + 12, B_Y + 6);
        g.lineTo(backR + 10, backB + 18);
        g.lineTo(backL - 10, backB + 18);
        g.closePath();
        g.fill();

        /* Back Netting Backdrop + o_goal_net.webp */
        g.fillStyle = 'rgba(15, 23, 42, 0.42)';
        g.beginPath();
        g.moveTo(L, T_Y);
        g.lineTo(R, T_Y);
        g.lineTo(R, B_Y);
        g.lineTo(L, B_Y);
        g.closePath();
        g.fill();

        if (imgReady(artNet)) {
          g.save();
          g.globalAlpha = 0.55;
          g.drawImage(artNet, L + 6, T_Y + 6, (R - L) - 12, (B_Y - T_Y) - 6);
          g.restore();
        }

        /* Procedural 3D Net Mesh with Dynamic Goal Ripple! */
        g.strokeStyle = 'rgba(255, 255, 255, 0.34)';
        g.lineWidth = 2;
        var cols = 22, rows = 10;
        var ripAmp = netRipple.active ? Math.sin(netRipple.t * 22) * Math.exp(-netRipple.t * 3.2) * 28 : 0;
        var ripWX = GX + netRipple.x * GW;
        var ripWY = GY_LINE - netRipple.y * GH;

        for (var c = 0; c <= cols; c++) {
          var u = c / cols;
          g.beginPath();
          for (var r = 0; r <= rows; r++) {
            var v = r / rows;
            var nx = (backL + u * (backR - backL)) * 0.65 + (L + u * (R - L)) * 0.35;
            var ny = (backT + v * (backB - backT)) * 0.65 + (T_Y + v * (B_Y - T_Y)) * 0.35;
            if (ripAmp !== 0) {
              var d = Math.hypot(nx - ripWX, ny - ripWY);
              var push = Math.max(0, 1 - d / 190) * ripAmp;
              ny -= push * 0.6;
              nx += (nx - ripWX) * 0.08 * (push / 28);
            }
            if (r === 0) g.moveTo(nx, ny);
            else g.lineTo(nx, ny);
          }
          g.stroke();
        }
        for (var r2 = 0; r2 <= rows; r2++) {
          var v2 = r2 / rows;
          g.beginPath();
          for (var c2 = 0; c2 <= cols; c2++) {
            var u2 = c2 / cols;
            var nx2 = (backL + u2 * (backR - backL)) * 0.65 + (L + u2 * (R - L)) * 0.35;
            var ny2 = (backT + v2 * (backB - backT)) * 0.65 + (T_Y + v2 * (B_Y - T_Y)) * 0.35;
            if (ripAmp !== 0) {
              var d2 = Math.hypot(nx2 - ripWX, ny2 - ripWY);
              var push2 = Math.max(0, 1 - d2 / 190) * ripAmp;
              ny2 -= push2 * 0.6;
            }
            if (c2 === 0) g.moveTo(nx2, ny2);
            else g.lineTo(nx2, ny2);
          }
          g.stroke();
        }

        /* Top Corners ("TOP BINS! +30") Bonus Target Zones inside the frame */
        [-1, 1].forEach(function (side) {
          var bx = side < 0 ? L + 14 : R - 134;
          var by = T_Y + 14;
          var pulse = 0.72 + Math.sin(now / 180) * 0.18;
          g.save();
          g.globalAlpha = pulse;
          g.fillStyle = 'rgba(250, 204, 21, 0.22)';
          g.strokeStyle = '#fde047';
          g.lineWidth = 3;
          g.setLineDash([8, 6]);
          rr(g, bx, by, 120, 88, 14);
          g.fill();
          g.stroke();
          g.setLineDash([]);
          drawOutlinedText(g, '⭐ +30', bx + 60, by + 44, 24, '#fde047', '#0f172a');
          g.restore();
        });

        /* Rear Stanchion Bars */
        g.strokeStyle = '#94a3b8';
        g.lineWidth = 7;
        g.beginPath();
        g.moveTo(L, T_Y); g.lineTo(backL, backT); g.lineTo(backL, backB);
        g.moveTo(R, T_Y); g.lineTo(backR, backT); g.lineTo(backR, backB);
        g.moveTo(backL, backT); g.lineTo(backR, backT);
        g.stroke();

        /* Main 3D Front Goalposts & Crossbar with Cylindrical Shading */
        g.lineCap = 'round';
        g.lineJoin = 'round';
        g.strokeStyle = '#0f172a';
        g.lineWidth = 24;
        g.beginPath();
        g.moveTo(L, B_Y); g.lineTo(L, T_Y); g.lineTo(R, T_Y); g.lineTo(R, B_Y);
        g.stroke();

        g.strokeStyle = '#ffffff';
        g.lineWidth = 16;
        g.beginPath();
        g.moveTo(L, B_Y); g.lineTo(L, T_Y); g.lineTo(R, T_Y); g.lineTo(R, B_Y);
        g.stroke();

        g.restore();
      }

      function drawGoalkeeper(now) {
        var oppIdx = (turn + 1) % nt;
        var kImg = monImgs[oppIdx] || monImgs[0];
        var kp = goalToScreen(keeper.x, keeper.y);
        var kSize = 185;

        g.save();
        /* Keeper ground shadow on goal line */
        var groundP = goalToScreen(keeper.x, 0);
        g.fillStyle = 'rgba(15, 23, 42, 0.42)';
        g.beginPath();
        g.ellipse(groundP.x, groundP.y + 8, 56, 16, 0, 0, Math.PI * 2);
        g.fill();

        var bob = keeper.diving ? 0 : -Math.abs(Math.sin(now / 190)) * 12;
        g.translate(kp.x, kp.y + bob);
        g.rotate(keeper.rot);

        if (imgReady(kImg)) {
          g.drawImage(kImg, -kSize / 2, -kSize / 2, kSize, kSize);
        } else {
          g.fillStyle = T[oppIdx] ? T[oppIdx].color : '#f43f5e';
          g.beginPath();
          g.arc(0, 0, 68, 0, Math.PI * 2);
          g.fill();
        }

        /* Goalkeeper Gloves (o_keeper_glove.webp) */
        var gloveSpread = keeper.diving ? 88 : 72 + Math.sin(now / 150) * 8;
        var gloveY = keeper.diving ? -28 : -8 + Math.cos(now / 150) * 8;
        [-1, 1].forEach(function (side) {
          g.save();
          g.translate(side * gloveSpread, gloveY);
          g.scale(side, 1);
          if (imgReady(artGlove)) {
            g.drawImage(artGlove, -34, -34, 68, 68);
          } else {
            g.fillStyle = '#fde047';
            g.strokeStyle = '#0f172a';
            g.lineWidth = 4;
            g.beginPath();
            g.arc(0, 0, 24, 0, Math.PI * 2);
            g.fill();
            g.stroke();
          }
          g.restore();
        });
        g.restore();
      }

      function drawKickerAndBuddy(now) {
        var kImg = monImgs[turn];
        var teamCol = (T[turn] && T[turn].color) || '#38bdf8';

        /* Waiting Buddy / Coach Monster on left touchline */
        if (nt > 1) {
          var buddyIdx = (turn + 1) % nt;
          var bImg = monImgs[buddyIdx];
          g.save();
          var bBob = crowdCheerT > 0 ? -Math.abs(Math.sin(now / 105)) * 22 : -Math.abs(Math.sin(now / 320)) * 6;
          g.translate(210, 695 + bBob);
          g.fillStyle = 'rgba(15, 23, 42, 0.35)';
          g.beginPath();
          g.ellipse(0, 72 - bBob, 52, 14, 0, 0, Math.PI * 2);
          g.fill();
          if (imgReady(bImg)) {
            g.drawImage(bImg, -82, -82, 164, 164);
          }
          g.restore();
        }

        /* Big Kicker Monster at the Penalty Spot (25% of screen height = 225px) */
        var kSize = 228;
        var kx = SPOT_X - 155;
        var ky = SPOT_Y - 58;
        var rot = 0, sx = 1, sy = 1, bobY = 0;

        if (phase === 'runup') {
          var rt = Math.min(1, phaseT / 0.28);
          kx = (SPOT_X - 210) + rt * 115;
          ky = (SPOT_Y - 40) - Math.sin(rt * Math.PI) * 28;
          rot = rt < 0.7 ? -0.22 : 0.28;
        } else if (phase === 'flight' || phase === 'result') {
          kx = SPOT_X - 95;
          if (ball.outcome === 'topbins' || ball.outcome === 'corner' || ball.outcome === 'goal') {
            bobY = -Math.abs(Math.sin(now / 110)) * 32;
            rot = Math.sin(now / 140) * 0.16;
          } else {
            rot = 0.08;
          }
        } else if (phase === 'shrug') {
          bobY = -Math.abs(Math.sin(now / 200)) * 10;
          rot = Math.sin(now / 140) * 0.14;
        } else {
          bobY = -Math.abs(Math.sin(now / 260)) * 9;
          sx = 1 + Math.sin(now / 240) * 0.04;
          sy = 1 - Math.sin(now / 240) * 0.04;
        }

        g.save();
        g.translate(kx, ky);
        g.fillStyle = 'rgba(15, 23, 42, 0.42)';
        g.beginPath();
        g.ellipse(0, kSize * 0.42, kSize * 0.34, kSize * 0.10, 0, 0, Math.PI * 2);
        g.fill();
        g.strokeStyle = teamCol;
        g.lineWidth = 4;
        g.beginPath();
        g.ellipse(0, kSize * 0.42, kSize * 0.30, kSize * 0.085, 0, 0, Math.PI * 2);
        g.stroke();

        g.translate(0, bobY);
        g.rotate(rot);
        g.scale(sx, sy);
        if (imgReady(kImg)) {
          g.drawImage(kImg, -kSize / 2, -kSize / 2, kSize, kSize);
        }
        if (phase === 'shrug') {
          drawOutlinedText(g, '😊', kSize * 0.34, -kSize * 0.34, 36, '#fde047', '#0f172a');
        }
        g.restore();
      }

      function drawBallAndTrail() {
        /* Curved flight trail */
        for (var i = 0; i < trail.length; i++) {
          var tr = trail[i];
          var alpha = (i + 1) / (trail.length + 1) * 0.45;
          g.save();
          g.globalAlpha = alpha;
          g.fillStyle = tr.curve ? '#fde047' : '#38bdf8';
          g.beginPath();
          g.arc(tr.x, tr.y, tr.r * 0.72, 0, Math.PI * 2);
          g.fill();
          g.restore();
        }

        /* Ground shadow under ball */
        var prog = Math.max(0, Math.min(1, (SPOT_Y - ball.y) / (SPOT_Y - GY_LINE)));
        var groundY = SPOT_Y - prog * (SPOT_Y - GY_LINE);
        g.save();
        g.fillStyle = 'rgba(15, 23, 42, 0.38)';
        g.beginPath();
        g.ellipse(ball.x, Math.max(GY_LINE + 4, groundY + ball.r * 0.55), ball.r * 0.85, ball.r * 0.26, 0, 0, Math.PI * 2);
        g.fill();

        g.translate(ball.x, ball.y);
        g.rotate(ball.rot);
        var bIm = imgReady(artBall) ? artBall : artBallFallback;
        if (imgReady(bIm)) {
          g.drawImage(bIm, -ball.r, -ball.r, ball.r * 2, ball.r * 2);
        } else {
          g.fillStyle = '#ffffff';
          g.strokeStyle = '#0f172a';
          g.lineWidth = 4;
          g.beginPath();
          g.arc(0, 0, ball.r, 0, Math.PI * 2);
          g.fill();
          g.stroke();
        }
        g.restore();
      }

      function drawAimReticleAndPowerMeter(now) {
        if (phase !== 'aim' && phase !== 'power') return;

        var ap = goalToScreen(aimX, aimY);
        var inFrame = (Math.abs(aimX) < 0.96 && aimY < 0.95);
        var onWood = (!inFrame && Math.abs(aimX) <= 1.08 && aimY <= 1.07);

        /* Dotted Aim Guide from ball to reticle */
        g.save();
        g.strokeStyle = inFrame ? '#4ade80' : (onWood ? '#fb923c' : '#f43f5e');
        g.lineWidth = 4;
        g.setLineDash([12, 10]);
        g.lineDashOffset = -(now * 0.08) % 22;
        g.beginPath();
        g.moveTo(SPOT_X, SPOT_Y);
        if (phase === 'power') {
          var cp = goalToScreen(aimX + (aimX >= 0 ? 0.22 : -0.22), aimY);
          g.quadraticCurveTo((SPOT_X + cp.x) * 0.5 + (aimX >= 0 ? -75 : 75), (SPOT_Y + cp.y) * 0.5, ap.x, ap.y);
        } else {
          g.lineTo(ap.x, ap.y);
        }
        g.stroke();
        g.setLineDash([]);

        /* Glowing Target Reticle */
        var pulse = 1 + Math.sin(now / 110) * 0.08;
        g.translate(ap.x, ap.y);
        g.scale(pulse, pulse);
        if (imgReady(artTarget)) {
          g.drawImage(artTarget, -42, -42, 84, 84);
        } else {
          g.strokeStyle = inFrame ? '#4ade80' : '#f43f5e';
          g.lineWidth = 6;
          g.beginPath();
          g.arc(0, 0, 34, 0, Math.PI * 2);
          g.stroke();
        }
        if (!inFrame) {
          drawOutlinedText(g, onWood ? '⚠️ POST/BAR!' : '⚠️ WIDE!', 0, -52, 22, '#fb923c', '#0f172a');
        } else if (Math.abs(aimX) >= 0.64 && aimY >= 0.62) {
          drawOutlinedText(g, '⭐ TOP BINS!', 0, -52, 22, '#fde047', '#0f172a');
        }
        g.restore();

        /* Step 2: Fast Power & Banana Curve Meter on Right */
        if (phase === 'power') {
          var mx = 1390, my = 230, mw = 42, mh = 360;
          g.save();
          g.fillStyle = 'rgba(15, 23, 42, 0.88)';
          rr(g, mx - 10, my - 10, mw + 20, mh + 20, 16);
          g.fill();
          g.strokeStyle = '#ffffff';
          g.lineWidth = 3;
          g.stroke();

          var mg = g.createLinearGradient(0, my + mh, 0, my);
          mg.addColorStop(0, '#38bdf8');
          mg.addColorStop(LV.green[0], '#fde047');
          mg.addColorStop(LV.green[1], '#22c55e');
          mg.addColorStop(1, '#f43f5e');
          g.fillStyle = mg;
          rr(g, mx, my, mw, mh, 10);
          g.fill();

          /* Sweet-Spot Green Banana Curve Zone */
          var gy = my + mh * (1 - LV.green[1]);
          var gh = mh * (LV.green[1] - LV.green[0]);
          g.fillStyle = 'rgba(34, 197, 94, 0.96)';
          g.fillRect(mx, gy, mw, gh);
          g.strokeStyle = '#ffffff';
          g.lineWidth = 3;
          g.strokeRect(mx, gy, mw, gh);
          drawOutlinedText(g, '🍌 CURVE!', mx - 72, gy + gh / 2, 22, '#4ade80', '#0f172a');
          drawOutlinedText(g, '💥 OVER!', mx - 68, my + 18, 20, '#f43f5e', '#0f172a');
          drawOutlinedText(g, '🧤 WEAK', mx - 68, my + mh - 18, 20, '#38bdf8', '#0f172a');

          /* Moving Marker Bar */
          var py = my + mh * (1 - pow);
          g.fillStyle = '#ffffff';
          g.strokeStyle = '#0f172a';
          g.lineWidth = 4;
          rr(g, mx - 12, py - 8, mw + 24, 16, 8);
          g.fill();
          g.stroke();

          drawOutlinedText(g, '⚡ 2. POWER', mx + mw / 2, my - 28, 24, '#fde047', '#0f172a');
          g.restore();
        }
      }

      function drawScorecardHUD() {
        var totalPerTeam = +ctx.cfg.kicks || 4;
        var rowH = 44, nameW = 132, cellW = 42, totW = 64;
        var boxW = nameW + totalPerTeam * cellW + totW + 16;
        var x0 = 22, y0 = 132;

        g.save();
        T.forEach(function (t, ti) {
          var ry = y0 + ti * (rowH + 8);
          var isTurn = (ti === turn);
          g.fillStyle = isTurn ? 'rgba(15, 23, 42, 0.92)' : 'rgba(15, 23, 42, 0.72)';
          g.strokeStyle = isTurn ? (t.color || '#fde047') : 'rgba(255, 255, 255, 0.32)';
          g.lineWidth = isTurn ? 4 : 2;
          rr(g, x0, ry, boxW, rowH, 12);
          g.fill();
          g.stroke();

          g.fillStyle = t.color || '#38bdf8';
          rr(g, x0 + 6, ry + 6, 10, rowH - 12, 5);
          g.fill();
          drawOutlinedText(g, (t.name || '').slice(0, 9), x0 + 24, ry + rowH / 2, 22, '#ffffff', '#0f172a', 'left');

          for (var ki = 0; ki < totalPerTeam; ki++) {
            var kx = x0 + nameW + ki * cellW;
            var mk = (scorecard[ti] && scorecard[ti][ki]) || '·';
            drawOutlinedText(g, mk, kx + cellW / 2, ry + rowH / 2, 20, '#ffffff', '#0f172a');
          }

          var tx = x0 + nameW + totalPerTeam * cellW + totW / 2;
          drawOutlinedText(g, String(t.score || 0), tx, ry + rowH / 2, 24, '#fde047', '#0f172a');
        });
        g.restore();
      }

      /* ---- 60fps Main Loop ---- */
      var lastNow = performance.now();
      var rafId = 0;

      function frame(now) {
        if (!alive) return;
        var dt = Math.min(0.05, Math.max(0.001, (now - lastNow) / 1000));
        lastNow = now;
        phaseT += dt;
        if (crowdCheerT > 0) crowdCheerT = Math.max(0, crowdCheerT - dt);
        if (netRipple.active) {
          netRipple.t += dt;
          if (netRipple.t > 1.2) netRipple.active = false;
        }

        /* Step 1: Sweeping Figure-8 Aim Reticle + Keeper Patrol */
        if (phase === 'aim') {
          aimT += dt * 1.95 * LV.s;
          aimX = Math.sin(aimT) * 1.14;
          aimY = 0.52 + Math.sin(aimT * 2.1) * 0.52;
          keeper.x = Math.sin(now / 420) * 0.34;
          keeper.y = 0.18 + Math.abs(Math.cos(now / 260)) * 0.06;
        } else if (phase === 'power') {
          pow += powDir * dt * 1.62 * LV.s;
          if (pow >= 1) { pow = 1; powDir = -1; }
          if (pow <= 0) { pow = 0; powDir = 1; }
          keeper.x = Math.sin(now / 320) * 0.26;
        } else if (phase === 'runup') {
          if (phaseT >= 0.28) {
            phase = 'flight';
            phaseT = 0;
            ball.t = 0;
            A().play('ball_kick');
          }
        } else if (phase === 'flight') {
          ball.t += dt / ball.flightDur;
          var u = Math.min(1, ball.t);
          /* Banana curve peaks mid-flight: 4*u*(1-u) */
          var curNX = ball.targetX * u - ball.curveX * 4 * u * (1 - u);
          var arcLift = Math.sin(u * Math.PI) * 0.26;
          var curNY = ball.targetY * u + arcLift;
          var goalPt = goalToScreen(curNX, curNY);
          ball.x = SPOT_X + (goalPt.x - SPOT_X) * u;
          ball.y = SPOT_Y + (goalPt.y - SPOT_Y) * Math.pow(u, 0.85);
          ball.r = 44 - u * 21;
          ball.rot += dt * (14 + Math.abs(ball.curveX) * 28) * spinDir;

          if (trail.length === 0 || Math.hypot(ball.x - trail[trail.length - 1].x, ball.y - trail[trail.length - 1].y) > 18) {
            trail.push({ x: ball.x, y: ball.y, r: ball.r, curve: Math.abs(ball.curveX) > 0.15 });
            if (trail.length > 14) trail.shift();
          }

          /* Keeper dives simultaneously */
          var kd = Math.min(1, u * 1.12);
          var easeK = 1 - Math.pow(1 - kd, 3);
          keeper.x = keeper.startX + (keeper.tx - keeper.startX) * easeK;
          keeper.y = keeper.startY + (keeper.ty - keeper.startY) * easeK + Math.sin(kd * Math.PI) * 0.12;
          keeper.rot = (keeper.tx - keeper.startX) * 0.58 * easeK;

          if (u >= 1) {
            resolveKickResult();
          }
        } else if (phase === 'result') {
          if (ball.rebounding) {
            ball.x += ball.reboundVX * dt;
            ball.y += ball.reboundVY * dt;
            ball.reboundVY += 620 * dt;
            ball.rot += dt * 12;
            if (ball.y > GY_LINE + 45) {
              ball.y = GY_LINE + 45;
              ball.reboundVY = -Math.abs(ball.reboundVY) * 0.45;
            }
          }
          /* Keeper settles back down after dive */
          keeper.y = Math.max(0.14, keeper.y - dt * 0.55);
          keeper.rot *= Math.pow(0.18, dt);
        }

        /* Update particles */
        particles = particles.filter(function (p) {
          p.t += dt;
          p.vy += 460 * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          return p.t < p.life;
        });

        var shakeX = 0, shakeY = 0;
        if (cam.shakeT > 0) {
          cam.shakeT = Math.max(0, cam.shakeT - dt);
          shakeX = (Math.random() * 2 - 1) * cam.shakeMag;
          shakeY = (Math.random() * 2 - 1) * cam.shakeMag;
        }

        g.save();
        g.clearRect(0, 0, VW, VH);
        g.translate(shakeX, shakeY);

        drawStadiumAndPitch(now);
        drawGoal3D(now);
        drawGoalkeeper(now);
        drawAimReticleAndPowerMeter(now);
        drawBallAndTrail();
        drawKickerAndBuddy(now);

        /* Particles */
        particles.forEach(function (p) {
          g.save();
          g.globalAlpha = Math.max(0, 1 - p.t / p.life);
          g.fillStyle = p.c;
          g.beginPath();
          g.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          g.fill();
          g.restore();
        });

        drawScorecardHUD();

        if (popText) {
          popText.t += dt;
          if (popText.t > 1.65) {
            popText = null;
          } else {
            var sc = popText.t < 0.22 ? 0.5 + (popText.t / 0.22) * 0.65 : 1.0;
            g.save();
            g.globalAlpha = popText.t > 1.25 ? Math.max(0, 1 - (popText.t - 1.25) / 0.4) : 1;
            g.translate(GX, 315);
            g.scale(sc, sc);
            drawOutlinedText(g, popText.txt, 0, 0, 56, popText.col, '#0f172a');
            g.restore();
          }
        }

        g.restore();
        rafId = requestAnimationFrame(frame);
      }

      showTurn();
      rafId = requestAnimationFrame(frame);
    }
  };
})(window);
