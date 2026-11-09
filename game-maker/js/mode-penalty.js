/* ============================================================================
   Game Maker — Mode: Penalty Kick (3D Interactive Physics & Animated Athletes)
   ----------------------------------------------------------------------------
   Full-screen 1600x900 3D perspective stadium with:
   - True 3D coordinate system (X, Y, Z) with perspective projection, real
     gravity, Magnus banana-curve spin, ground shadows, turf bounces, post/bar
     ricochets (including "In Off The Post!"), and 3D net catch physics.
   - Direct Smartboard Touch, Drag & Swipe Controls:
     * Touch or drag anywhere on the goal to aim with a live 3D trajectory arc,
       OR swipe directly from the ball toward the goal to shoot with curve!
     * Choose Shot Spin (Curve Left / Power Straight / Curve Right) to bend the
       ball around the goalkeeper.
   - Real Goalkeeper Logic (Zero Fake RNG Coin-Flips):
     * Keeper patrols the goal line in real time with visible open corners.
     * Reacts after a human reaction window and dives physically from their
       actual position on the line — smart placement or curve into the open
       corner genuinely beats the keeper's reach!
   - Articulated 60fps Monster Athletes:
     * Legless monster body + procedural 2-jointed legs, socks & studded boots
       for real 4-stride run-ups, plant foot, wind-up backswing, kick swoosh,
       celebration jumps, and connected goalkeeper arms/gloves.
   ============================================================================ */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {};
  GM.modes = GM.modes || {};

  var U = function () { return GM.u; };
  var A = function () { return GM.audio; };

  var VW = 1600;
  var VH = 900;

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  function loadImg(src) {
    var im = new Image();
    im.src = src;
    return im;
  }
  function imgReady(im) {
    return !!(im && im.complete && im.naturalWidth > 0);
  }

  /* Render monster body WITHOUT static legs or pedestal so we can animate
     articulated 2-jointed legs, boots, and arms at 60fps on canvas! */
  function makeMonBodyImg(m) {
    var img = new Image();
    var svg = (GM.mon && GM.mon.svg) ? GM.mon.svg(m, 260) : '';
    if (!svg || svg.indexOf('<svg') < 0) return null;
    svg = svg
      .replace(/<g class="monster-pedestal-stage">[\s\S]*?<\/g>/g, '')
      .replace(/<g class="gm-legs">(?:<g class="gm-leg">[\s\S]*?<\/g>)*<\/g>/g, '');
    if (svg.indexOf('xmlns=') < 0) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    return img;
  }

  function getMonPalette(m) {
    var col = (m && m.color) || 'blue';
    var P = (root.MonsterRenderer && root.MonsterRenderer.palettes && root.MonsterRenderer.palettes[col]) || null;
    if (P) return P;
    var map = {
      blue:   { primary: '#38bdf8', primaryDark: '#0284c7', shadowDark: '#0c4a6e', primaryLight: '#bae6fd' },
      pink:   { primary: '#f472b6', primaryDark: '#db2777', shadowDark: '#831843', primaryLight: '#fbcfe8' },
      green:  { primary: '#4ade80', primaryDark: '#16a34a', shadowDark: '#14532d', primaryLight: '#bbf7d0' },
      orange: { primary: '#fb923c', primaryDark: '#ea580c', shadowDark: '#7c2d12', primaryLight: '#fed7aa' },
      purple: { primary: '#c084fc', primaryDark: '#9333ea', shadowDark: '#581c87', primaryLight: '#e9d5ff' },
      gold:   { primary: '#facc15', primaryDark: '#ca8a04', shadowDark: '#713f12', primaryLight: '#fef08a' }
    };
    return map[col] || map.blue;
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
    desc: 'Answer right, then aim on the 3D goal or swipe the ball with curve to beat the goalkeeper!',
    descClassic: 'Answer right, then aim on the 3D goal or swipe the ball with curve to beat the goalkeeper!',
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

      /* Difficulty tuning — 100% physical reaction delay, patrol speed & dive speed (no random coin-flips!) */
      var LV = {
        easy:   { patrolSpd: 0.72, patrolRange: 0.42, reactDelay: 0.24, diveSpdX: 0.72, diveSpdY: 0.65, gloveReach: 0.13 },
        normal: { patrolSpd: 0.96, patrolRange: 0.44, reactDelay: 0.18, diveSpdX: 0.92, diveSpdY: 0.82, gloveReach: 0.15 },
        hard:   { patrolSpd: 1.25, patrolRange: 0.46, reactDelay: 0.12, diveSpdX: 1.18, diveSpdY: 1.05, gloveReach: 0.18 }
      }[ctx.cfg.level] || { patrolSpd: 0.96, patrolRange: 0.44, reactDelay: 0.18, diveSpdX: 0.92, diveSpdY: 0.82, gloveReach: 0.15 };

      try { A().musicStart(hal ? 'halloween' : 'sports'); } catch (e) { /* ignore */ }
      if (document.body) document.body.classList.add('gm-small-pods', 'gm-real3-active');

      var rootEl = ctx.root;
      rootEl.innerHTML = '';

      var wrap = U().h('div', {
        class: 'gm-real3-scene gm-penalty-real3',
        title: 'Touch or drag on the goal to aim, or swipe the ball toward the goal to shoot!'
      });
      var cv = U().h('canvas', { class: 'gm-real3-cv' });
      var g = cv.getContext('2d');
      var banner = U().h('div', { class: 'gm-real3-banner' });
      var dock = U().h('div', {
        class: 'gm-real3-dock gm-pen-dock',
        style: 'bottom: 20px !important; right: 24px !important; left: auto !important; transform: none !important; flex-direction: column; align-items: flex-end; gap: 10px;'
      });
      wrap.appendChild(cv);
      rootEl.appendChild(U().h('div', { class: 'gm-boardwrap' }, [wrap, banner, dock]));

      /* Preload art assets */
      var artBgClassic    = loadImg('art/bg_classic_penalty.webp');
      var artBgHal        = loadImg('art/bg_pumpkin_patch.webp');
      var artNet          = loadImg('art/o_goal_net.webp');
      var artBall         = loadImg(hal ? 'art/o_pumpkin_ball.webp' : 'art/o_football.webp');
      var artBallFallback = loadImg('art/o_football.webp');
      var artGlove        = loadImg('art/o_keeper_glove.webp');
      var artTarget       = loadImg('art/o_target.webp');
      var monBodyImgs     = T.map(function (t) { return makeMonBodyImg(t.mon); });
      var monPalettes     = T.map(function (t) { return getMonPalette(t.mon); });

      /* ====================================================================
         3D STADIUM & GOAL PROJECTION GEOMETRY
         --------------------------------------------------------------------
         X in [-1..+1] across goal mouth (width 2*GW = 780px at Z = 1.0)
         Y in [0..+1] from turf (0) to crossbar (1, height GH = 290px at Z = 1.0)
         Z in [0..1.18] from Penalty Spot (Z = 0) to Goal Line (Z = 1.0)
                        and Back of Net (Z = 1.18).
         ==================================================================== */
      var GX = 800, GY_LINE = 475, GY_BAR = 185, GW = 390, GH = 290;
      var SPOT_X = 800, SPOT_Y = 775;
      var GRAVITY = 2.65; /* normalized height units / s^2 */

      function project3D(X, Y, Z) {
        var persp = 1 / (0.68 + 0.32 * Z);
        var groundY = SPOT_Y - (SPOT_Y - GY_LINE) * Math.pow(Math.max(0, Z), 0.88);
        if (Z < 0) groundY = SPOT_Y - (SPOT_Y - GY_LINE) * Z * 1.12;
        return {
          x: GX + X * GW * persp,
          y: groundY - Y * GH * persp,
          groundY: groundY,
          scale: persp
        };
      }

      /* Unproject a screen point (sx, sy) onto the Goal Plane (Z = 1.0) */
      function screenToGoal(sx, sy) {
        return {
          nx: clamp((sx - GX) / GW, -1.15, 1.15),
          ny: clamp((GY_LINE - sy) / GH, 0.05, 1.15)
        };
      }

      /* ====================================================================
         GAME STATE & PHYSICS ENTITIES
         ==================================================================== */
      var phase = 'wait'; /* 'wait' | 'aim' | 'runup' | 'flight' | 'result' | 'shrug' | 'finale' */
      var phaseT = 0;
      var hitStopT = 0;

      /* Player-controlled Aim & Spin */
      var aimX = 0.58;        /* Default aimed toward right side */
      var aimY = 0.56;        /* Mid-high shot */
      var shotSpin = -1;      /* -1 = Curve Left, 0 = Straight Power, +1 = Curve Right */
      var shotPower = 0.84;   /* [0.45 .. 1.0] */
      var userTouchedAim = false;

      /* Pointer / Swipe interaction state */
      var dragMode = null;    /* null | 'goal' | 'swipe' */
      var swipeStart = null;
      var swipePts = [];

      /* Camera & Stadium FX */
      var cam = { shakeT: 0, shakeMag: 0 };
      var postShake = { t: 0, x: 0, y: 0 };
      var netRipple = { t: 0, x: 0, y: 0.5, active: false };
      var crowdCheerT = 0;
      var popText = null;
      var particles = [];
      var trail = [];
      var impactWaves = [];
      var scorecard = T.map(function () { return []; });

      /* Kicker Athlete State */
      var kicker = {
        X: -0.22,
        Z: -0.18,
        stridePhase: 0,
        hipL: 0, kneeL: 0,
        hipR: 0, kneeR: 0,
        torsoTilt: 0,
        bobY: 0,
        kickSwoosh: 0,
        struck: false
      };

      /* Goalkeeper Athlete State */
      var keeper = {
        X: 0,
        Y: 0,          /* Vertical lift off ground during dive [0..0.55] */
        vx: 0,
        vy: 0,
        patrolDir: 1,
        stepPhase: 0,
        reactTimer: 0,
        diving: false,
        diveSide: 0,   /* -1 left, +1 right, 0 center jump */
        targetX: 0,
        targetY: 0.35,
        rot: 0,
        gloveLX: -0.18, gloveLY: 0.32,
        gloveRX:  0.18, gloveRY: 0.32,
        saved: false
      };

      /* 3D Ball State */
      var ball = {
        X: 0,
        Y: 0.04,
        Z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        ax: 0,         /* Magnus lateral curve acceleration */
        rot: 0,
        spinRate: 0,
        crossedGoalLine: false,
        outcome: 'goal' /* 'topbins' | 'corner' | 'in_off_post' | 'goal' | 'save' | 'post' | 'crossbar' | 'wide' */
      };

      function triggerShake(mag, dur) {
        cam.shakeMag = Math.min(10, mag || 5);
        cam.shakeT = Math.min(0.34, dur || 0.22);
      }

      function addBurst(x, y, count, cols, speed, upBias) {
        for (var i = 0; i < count; i++) {
          var a = Math.random() * Math.PI * 2;
          var s = (speed || 180) * (0.35 + Math.random() * 0.9);
          particles.push({
            x: x, y: y,
            vx: Math.cos(a) * s,
            vy: Math.sin(a) * s - (upBias == null ? 75 : upBias),
            r: 4 + Math.random() * 6,
            c: cols[i % cols.length],
            t: 0,
            life: 0.45 + Math.random() * 0.4
          });
        }
      }

      function addTurfPuff(x, y, dirX) {
        var cols = hal ? ['#a855f7', '#fb923c', '#fde047'] : ['#22c55e', '#15803d', '#ffffff', '#dcfce7'];
        for (var i = 0; i < 7; i++) {
          particles.push({
            x: x + (Math.random() - 0.5) * 18,
            y: y + (Math.random() - 0.5) * 6,
            vx: (dirX || -1) * (40 + Math.random() * 90) + (Math.random() - 0.5) * 40,
            vy: -45 - Math.random() * 75,
            r: 3.5 + Math.random() * 4,
            c: cols[i % cols.length],
            t: 0,
            life: 0.32 + Math.random() * 0.22
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

      function clientToWorld(clientX, clientY) {
        var r = cv.getBoundingClientRect();
        if (!r.width || !r.height) return { x: GX, y: GY_LINE };
        return {
          x: ((clientX - r.left) / r.width) * VW,
          y: ((clientY - r.top) / r.height) * VH
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

      /* ====================================================================
         TRAJECTORY & SHOT PHYSICS CALCULATOR
         Computes exact 3D initial velocity (vx, vy, vz) and Magnus curve (ax)
         so the ball lands at (targetX, targetY) at Z = 1.0!
         ==================================================================== */
      function computeShotKinematics(tx, ty, spin, power) {
        var T_flight = clamp(0.64 - power * 0.18, 0.44, 0.66);
        var vz = 1.0 / T_flight;
        /* Magnus lateral curve acceleration: bends left (-1) or right (+1) */
        var ax = spin * 1.45;
        var vx = (tx - 0.5 * ax * T_flight * T_flight) / T_flight;
        var vy = (ty - 0.04 + 0.5 * GRAVITY * T_flight * T_flight) / T_flight;
        return {
          T: T_flight,
          vx: vx,
          vy: vy,
          vz: vz,
          ax: ax
        };
      }

      function renderActionDock() {
        dock.innerHTML = '';
        if (phase !== 'aim') return;

        var spinRow = U().h('div', {
          style: 'display: flex; gap: 8px; align-items: center; justify-content: flex-end; flex-wrap: wrap;'
        });

        var spinLeftBtn = U().h('button', {
          type: 'button',
          class: 'gm-real3-btn ' + (shotSpin === -1 ? 'amber' : 'cyan'),
          style: 'padding: 8px 16px !important; min-height: 52px !important; font-size: 18px !important;',
          text: '↩️ Curve Left'
        });
        spinLeftBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          A().play('tap');
          shotSpin = -1;
          renderActionDock();
        });

        var straightBtn = U().h('button', {
          type: 'button',
          class: 'gm-real3-btn ' + (shotSpin === 0 ? 'amber' : 'cyan'),
          style: 'padding: 8px 16px !important; min-height: 52px !important; font-size: 18px !important;',
          text: '⚡ Straight'
        });
        straightBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          A().play('tap');
          shotSpin = 0;
          renderActionDock();
        });

        var spinRightBtn = U().h('button', {
          type: 'button',
          class: 'gm-real3-btn ' + (shotSpin === 1 ? 'amber' : 'cyan'),
          style: 'padding: 8px 16px !important; min-height: 52px !important; font-size: 18px !important;',
          text: '↪️ Curve Right'
        });
        spinRightBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          A().play('tap');
          shotSpin = 1;
          renderActionDock();
        });

        spinRow.appendChild(spinLeftBtn);
        spinRow.appendChild(straightBtn);
        spinRow.appendChild(spinRightBtn);

        var shootBtn = U().h('button', {
          type: 'button',
          class: 'gm-real3-btn green pulse',
          style: 'width: 100%; justify-content: center;',
          text: '👟 SHOOT BALL! (Space)'
        });
        shootBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          triggerRunupAndKick();
        });

        dock.appendChild(spinRow);
        dock.appendChild(shootBtn);
      }

      function resetEntitiesForTurn() {
        ball.X = 0;
        ball.Y = 0.04;
        ball.Z = 0;
        ball.vx = 0;
        ball.vy = 0;
        ball.vz = 0;
        ball.ax = 0;
        ball.rot = 0;
        ball.spinRate = 0;
        ball.crossedGoalLine = false;
        trail = [];
        impactWaves = [];

        kicker.X = -0.22;
        kicker.Z = -0.18;
        kicker.stridePhase = 0;
        kicker.hipL = 0.1; kicker.kneeL = 0.15;
        kicker.hipR = -0.1; kicker.kneeR = 0.2;
        kicker.torsoTilt = 0;
        kicker.bobY = 0;
        kicker.kickSwoosh = 0;
        kicker.struck = false;

        keeper.X = 0;
        keeper.Y = 0;
        keeper.vx = 0;
        keeper.vy = 0;
        keeper.patrolDir = (Math.random() < 0.5 ? -1 : 1);
        keeper.stepPhase = 0;
        keeper.diving = false;
        keeper.diveSide = 0;
        keeper.rot = 0;
        keeper.saved = false;

        /* Default aim swaps sides each turn and sets smart inward banana curve */
        var side = (kickNo % 2 === 0) ? 1 : -1;
        aimX = side * 0.62;
        aimY = 0.58;
        shotSpin = -side;
        shotPower = 0.86;
        userTouchedAim = false;
      }

      function showTurn() {
        var t = T[turn];
        phase = 'wait';
        phaseT = 0;
        resetEntitiesForTurn();
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
          var p0 = project3D(kicker.X, 0.45, kicker.Z);
          var sp = worldToClient(p0.x, p0.y);
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

        /* Keep any celebration sticker in the top-right corner so the Goal & Keeper stay 100% visible */
        var reactEl = document.querySelector('.gm-react');
        if (reactEl) {
          reactEl.style.cssText = 'justify-content: flex-end; align-items: flex-start; padding: 96px 28px; transform: scale(0.46); transform-origin: top right; pointer-events: none;';
        }

        /* Enter Interactive Aim & Swipe Phase */
        phase = 'aim';
        phaseT = 0;
        A().play('whistle');
        updateBanner(
          '🎯 Tap/Drag on the Goal to Aim — or Swipe the Ball to Shoot!',
          'Watch the Goalkeeper move and aim for the OPEN corner!',
          true
        );
        renderActionDock();
      }

      function triggerRunupAndKick() {
        if (!alive || phase !== 'aim') return;
        dock.innerHTML = '';
        phase = 'runup';
        phaseT = 0;
        kicker.struck = false;
        A().play('tap');
        A().play('crowd_ooh');
      }

      /* ====================================================================
         STRIKE THE BALL (Transition from Run-up -> 3D Flight)
         ==================================================================== */
      function executeBallStrike() {
        kicker.struck = true;
        kicker.kickSwoosh = 1.0;
        phase = 'flight';
        phaseT = 0;
        hitStopT = 0.032; /* Crisp 32ms tactile impact freeze */

        var kin = computeShotKinematics(aimX, aimY, shotSpin, shotPower);
        ball.X = 0;
        ball.Y = 0.04;
        ball.Z = 0;
        ball.vx = kin.vx;
        ball.vy = kin.vy;
        ball.vz = kin.vz;
        ball.ax = kin.ax;
        ball.spinRate = (shotSpin !== 0 ? shotSpin * 22 : 12);
        ball.crossedGoalLine = false;

        /* Impact shockwave & turf sparks at penalty spot */
        var sp = project3D(0, 0.04, 0);
        impactWaves.push({ x: sp.x, y: sp.y, r: 12, maxR: 92, t: 0, col: '#fde047' });
        addBurst(sp.x, sp.y, 16, ['#ffffff', '#fde047', '#4ade80'], 210, 90);
        A().play('ball_kick');

        /* Goalkeeper Reaction Setup:
           The keeper reads the initial flight direction after `LV.reactDelay`.
           If the player used curve (`shotSpin != 0`), the initial velocity points
           away from the final target, so the keeper's initial read is fooled by a
           portion of the curve! */
        keeper.reactTimer = LV.reactDelay + (shotSpin !== 0 ? 0.06 : 0);
        keeper.diving = false;
        var perceivedX = aimX * (shotSpin !== 0 ? 0.72 : 0.92);
        keeper.targetX = clamp(perceivedX, -0.88, 0.88);
        keeper.targetY = clamp(aimY * 0.86, 0.12, 0.80);
      }

      /* ====================================================================
         GOAL PLANE COLLISION & OUTCOME RESOLUTION (At Z = 1.0)
         100% physical check against keeper's actual body/gloves & posts!
         ==================================================================== */
      function checkGoalLineCrossing() {
        ball.crossedGoalLine = true;
        var bx = ball.X;
        var by = Math.max(0.04, ball.Y);
        var absX = Math.abs(bx);

        /* 1. Check Goalkeeper Physical Save (Body capsule + Outstretched Gloves) */
        var inFrame = (absX < 0.96 && by < 0.95);
        if (inFrame) {
          var distBody   = Math.hypot((bx - keeper.X) * 1.15, (by - (keeper.Y + 0.22)) * 1.05);
          var distGloveL = Math.hypot(bx - keeper.gloveLX, by - keeper.gloveLY);
          var distGloveR = Math.hypot(bx - keeper.gloveRX, by - keeper.gloveRY);
          var minGloveDist = Math.min(distGloveL, distGloveR, distBody * 0.95);

          if (minGloveDist <= LV.gloveReach) {
            /* Saved by the Goalkeeper! Deflect ball back onto the pitch */
            ball.outcome = 'save';
            keeper.saved = true;
            ball.Z = 0.98;
            ball.vz = -0.92;
            ball.vx = (bx >= keeper.X ? 1 : -1) * (0.55 + Math.random() * 0.35);
            ball.vy = 0.72;
            ball.ax = 0;
            var savePt = project3D(bx, by, 1.0);
            impactWaves.push({ x: savePt.x, y: savePt.y, r: 14, maxR: 110, t: 0, col: '#38bdf8' });
            finalizeOutcome(bx, by);
            return;
          }
        }

        /* 2. Check Crossbar & Goalpost Cylinder Collisions */
        var hitCrossbar = (by >= 0.94 && by <= 1.07 && absX <= 1.06);
        var hitInnerPost = (absX >= 0.93 && absX < 0.985 && by < 0.95);
        var hitOuterPost = (absX >= 0.985 && absX <= 1.07 && by <= 1.05);

        if (hitInnerPost) {
          /* IN OFF THE POST! Ricochets off inside woodwork into the goal! */
          ball.outcome = 'in_off_post';
          ball.vx = -ball.vx * 0.55 + (bx > 0 ? -0.65 : 0.65);
          ball.vz = Math.max(0.75, ball.vz * 0.68);
          ball.ax = 0;
          postShake = { t: 0.38, x: bx > 0 ? 1 : -1, y: 0 };
          var inPostPt = project3D(bx, by, 1.0);
          impactWaves.push({ x: inPostPt.x, y: inPostPt.y, r: 12, maxR: 95, t: 0, col: '#fde047' });
          A().play('hit_rim');
          A().play('wood_knock');
          finalizeOutcome(bx, by);
          return;
        }

        if (hitCrossbar) {
          ball.outcome = 'crossbar';
          ball.Z = 0.98;
          ball.vz = -0.88;
          ball.vy = 0.95;
          ball.vx *= 0.6;
          ball.ax = 0;
          postShake = { t: 0.45, x: 0, y: 1 };
          var barPt = project3D(bx, 1.0, 1.0);
          impactWaves.push({ x: barPt.x, y: barPt.y, r: 14, maxR: 115, t: 0, col: '#fb923c' });
          finalizeOutcome(bx, by);
          return;
        }

        if (hitOuterPost) {
          ball.outcome = 'post';
          ball.Z = 0.98;
          ball.vz = -0.95;
          ball.vx = (bx > 0 ? 1 : -1) * 1.15;
          ball.vy = 0.55;
          ball.ax = 0;
          postShake = { t: 0.45, x: bx > 0 ? 1 : -1, y: 0 };
          var postPt = project3D(bx > 0 ? 1 : -1, by, 1.0);
          impactWaves.push({ x: postPt.x, y: postPt.y, r: 14, maxR: 115, t: 0, col: '#fb923c' });
          finalizeOutcome(bx, by);
          return;
        }

        /* 3. Missed Wide or Over the Bar */
        if (absX > 1.07 || by > 1.07) {
          ball.outcome = 'wide';
          finalizeOutcome(bx, by);
          return;
        }

        /* 4. CLEAN GOAL! Classify Top Bins (+30), Corner (+20), or Goal (+15) */
        ball.vy = Math.min(0, ball.vy) - 0.55; /* Net roof/mesh catches upward rise and drops ball down inside the goal */
        if (absX >= 0.58 && by >= 0.58) {
          ball.outcome = 'topbins';
        } else if (absX >= 0.48) {
          ball.outcome = 'corner';
        } else {
          ball.outcome = 'goal';
        }
        finalizeOutcome(bx, by);
      }

      function finalizeOutcome(bx, by) {
        phase = 'result';
        phaseT = 0;
        var gp = project3D(clamp(bx, -1.1, 1.1), clamp(by, 0.05, 1.1), 1.0);
        var clientPt = worldToClient(gp.x, gp.y);
        var activeTurn = turn;
        var pts = 5;
        var mark = '✖';

        if (ball.outcome === 'topbins') {
          pts = 30;
          mark = '⭐';
          crowdCheerT = 2.0;
          netRipple = { t: 0, x: bx, y: by, active: true };
          A().play('goal_horn');
          A().play('crowd_roar_big');
          A().play('sparkle');
          triggerShake(7, 0.28);
          addBurst(gp.x, gp.y, 40, ['#fde047', '#4ade80', '#38bdf8', '#ffffff', '#f43f5e'], 290);
          U().confetti(36);
          popText = { txt: '🌟 TOP BINS! +30', col: '#fde047', t: 0 };
          updateBanner('🌟 TOP BINS UPPER-90 GOAL! +30!', 'Unstoppable strike into the top corner!', false);
        } else if (ball.outcome === 'in_off_post') {
          pts = 25;
          mark = '🎯';
          crowdCheerT = 1.8;
          netRipple = { t: 0, x: bx * 0.85, y: by, active: true };
          A().play('goal_horn');
          A().play('crowd_roar_big');
          triggerShake(7, 0.26);
          addBurst(gp.x, gp.y, 34, ['#fde047', '#4ade80', '#fb923c', '#ffffff'], 260);
          U().confetti(30);
          popText = { txt: '🎯 IN OFF THE POST! +25', col: '#fde047', t: 0 };
          updateBanner('🎯 IN OFF THE INSIDE OF THE POST! +25!', 'Pure precision!', false);
        } else if (ball.outcome === 'corner' || ball.outcome === 'goal') {
          pts = ball.outcome === 'corner' ? 20 : 15;
          mark = '⚽';
          crowdCheerT = 1.6;
          netRipple = { t: 0, x: bx, y: by, active: true };
          A().play('goal_horn');
          A().play('crowd_cheer_small');
          triggerShake(5, 0.22);
          addBurst(gp.x, gp.y, 28, ['#4ade80', '#fde047', '#38bdf8', '#ffffff'], 230);
          U().confetti(24);
          popText = { txt: (pts === 20 ? '🍌 CORNER GOAL! +20' : '⚽ GOAL! +15'), col: '#4ade80', t: 0 };
          updateBanner('⚽ GOAL FOR ' + T[activeTurn].name.toUpperCase() + '! +' + pts + '!', 'Beat the diving goalkeeper!', false);
        } else if (ball.outcome === 'save') {
          pts = 5;
          mark = '🧤';
          A().play('hit_rim');
          A().play('crowd_ooh');
          triggerShake(5, 0.18);
          addBurst(gp.x, gp.y, 20, ['#38bdf8', '#ffffff', '#fde047'], 180);
          popText = { txt: '🧤 KEEPER SAVE! +5', col: '#38bdf8', t: 0 };
          updateBanner('🧤 WHAT A SAVE BY THE GOALKEEPER!', 'Tip: Watch the keeper move and shoot to the open side! (+5)', false);
        } else if (ball.outcome === 'crossbar' || ball.outcome === 'post') {
          pts = 5;
          mark = '💥';
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
          updateBanner('😮 Fired outside the frame!', 'Keep your aim inside the white goalposts! (+5)', false);
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
        }, 2150);
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

      /* ====================================================================
         SMARTBOARD TOUCH, DRAG & SWIPE-TO-SHOOT INPUT HANDLERS
         ==================================================================== */
      function updateAimFromGoalPt(wx, wy) {
        var gPt = screenToGoal(wx, wy);
        aimX = clamp(gPt.nx, -1.08, 1.08);
        aimY = clamp(gPt.ny, 0.08, 1.06);
        /* Automatically set natural shot power from height */
        shotPower = clamp(0.68 + aimY * 0.28, 0.62, 0.96);
        userTouchedAim = true;
      }

      function onPointerDown(e) {
        if (!alive) return;
        if (e.target && e.target.closest && e.target.closest('.gm-real3-dock')) return;
        if (phase !== 'aim') return;
        e.preventDefault();

        var wPt = clientToWorld(e.clientX, e.clientY);
        var ballScreen = project3D(0, 0.04, 0);
        var distToBall = Math.hypot(wPt.x - ballScreen.x, wPt.y - ballScreen.y);

        /* Did the pupil touch near the ball to swipe-shoot, or touch the goal to aim? */
        if (distToBall < 145 || wPt.y > 585) {
          dragMode = 'swipe';
          swipeStart = { x: wPt.x, y: wPt.y, t: performance.now() };
          swipePts = [{ x: wPt.x, y: wPt.y }];
        } else {
          dragMode = 'goal';
          updateAimFromGoalPt(wPt.x, wPt.y);
          A().play('tap');
        }
        if (wrap.setPointerCapture && e.pointerId != null) {
          try { wrap.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        }
      }

      function onPointerMove(e) {
        if (!alive || phase !== 'aim' || !dragMode) return;
        var wPt = clientToWorld(e.clientX, e.clientY);

        if (dragMode === 'goal') {
          updateAimFromGoalPt(wPt.x, wPt.y);
        } else if (dragMode === 'swipe' && swipeStart) {
          swipePts.push({ x: wPt.x, y: wPt.y });
          if (swipePts.length > 24) swipePts.shift();
          var dy = swipeStart.y - wPt.y;
          if (dy > 25) {
            /* Map upward swipe vector to goal target (aimX, aimY) */
            var dx = wPt.x - swipeStart.x;
            aimX = clamp(dx / 340, -1.05, 1.05);
            aimY = clamp(dy / 420, 0.12, 1.04);
            shotPower = clamp(0.60 + (dy / 460) * 0.38, 0.58, 0.98);
            userTouchedAim = true;

            /* Detect swipe curvature for natural Banana Spin! */
            if (swipePts.length >= 5) {
              var mid = swipePts[Math.floor(swipePts.length / 2)];
              var lineX = (swipeStart.x + wPt.x) * 0.5;
              var bend = mid.x - lineX;
              if (Math.abs(bend) > 22) {
                shotSpin = bend > 0 ? -1 : 1;
                renderActionDock();
              }
            }
          }
        }
      }

      function onPointerUp(e) {
        if (!alive || phase !== 'aim' || !dragMode) return;
        var mode = dragMode;
        dragMode = null;

        if (mode === 'swipe' && swipeStart) {
          var wPt = clientToWorld(e.clientX, e.clientY);
          var dy = swipeStart.y - wPt.y;
          swipeStart = null;
          swipePts = [];
          /* If the pupil swiped upward toward the goal, kick immediately! */
          if (dy > 55) {
            triggerRunupAndKick();
          }
        }
      }

      function onKeyDown(e) {
        if (!alive) return;
        if (document.querySelector('.gm-over')) return;
        if (phase === 'wait' && !asking && (e.code === 'Space' || e.key === ' ')) {
          e.preventDefault();
          askQuestion();
          return;
        }
        if (phase === 'aim') {
          if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
            e.preventDefault();
            aimX = clamp(aimX - 0.08, -1.05, 1.05);
            userTouchedAim = true;
          } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
            e.preventDefault();
            aimX = clamp(aimX + 0.08, -1.05, 1.05);
            userTouchedAim = true;
          } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
            e.preventDefault();
            aimY = clamp(aimY + 0.07, 0.08, 1.05);
            userTouchedAim = true;
          } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
            e.preventDefault();
            aimY = clamp(aimY - 0.07, 0.08, 1.05);
            userTouchedAim = true;
          } else if (e.code === 'KeyQ') {
            e.preventDefault();
            shotSpin = -1;
            renderActionDock();
          } else if (e.code === 'KeyE') {
            e.preventDefault();
            shotSpin = 1;
            renderActionDock();
          } else if (e.code === 'Space' || e.key === ' ' || e.code === 'Enter') {
            e.preventDefault();
            triggerRunupAndKick();
          }
        }
      }

      wrap.addEventListener('pointerdown', onPointerDown);
      wrap.addEventListener('pointermove', onPointerMove);
      wrap.addEventListener('pointerup', onPointerUp);
      wrap.addEventListener('pointercancel', onPointerUp);
      root.addEventListener('keydown', onKeyDown);

      ctx.onEnd(function () {
        alive = false;
        cancelAnimationFrame(rafId);
        root.removeEventListener('resize', fitCanvas);
        root.removeEventListener('keydown', onKeyDown);
        if (document.body) document.body.classList.remove('gm-small-pods', 'gm-real3-active');
      });

      /* ====================================================================
         ARTICULATED LIMB & CHARACTER RENDERING HELPERS
         Draws 2-jointed legs + socks + studded football boots so monsters
         genuinely sprint, plant, wind up, strike, shuffle, and dive!
         ==================================================================== */
      function drawArticulatedLeg(hipX, hipY, thighLen, shinLen, hipAngle, kneeAngle, pal, sockCol, scale) {
        var kneeX = hipX + Math.sin(hipAngle) * thighLen;
        var kneeY = hipY + Math.cos(hipAngle) * thighLen;
        var totAngle = hipAngle + kneeAngle;
        var ankleX = kneeX + Math.sin(totAngle) * shinLen;
        var ankleY = kneeY + Math.cos(totAngle) * shinLen;
        var legW = Math.max(8, 15 * scale);

        g.save();
        g.lineCap = 'round';
        g.lineJoin = 'round';

        /* Upper thigh (monster body color with dark outline) */
        g.strokeStyle = pal.shadowDark || '#0f172a';
        g.lineWidth = legW + 5 * scale;
        g.beginPath();
        g.moveTo(hipX, hipY);
        g.lineTo(kneeX, kneeY);
        g.stroke();

        g.strokeStyle = pal.primary || '#38bdf8';
        g.lineWidth = legW;
        g.beginPath();
        g.moveTo(hipX, hipY);
        g.lineTo(kneeX, kneeY);
        g.stroke();

        /* Lower shin with team football sock */
        g.strokeStyle = '#0f172a';
        g.lineWidth = legW * 0.92 + 5 * scale;
        g.beginPath();
        g.moveTo(kneeX, kneeY);
        g.lineTo(ankleX, ankleY);
        g.stroke();

        g.strokeStyle = sockCol || '#ffffff';
        g.lineWidth = legW * 0.92;
        g.beginPath();
        g.moveTo(kneeX, kneeY);
        g.lineTo(ankleX, ankleY);
        g.stroke();

        /* Football Boot + Cleat Studs at ankle */
        g.translate(ankleX, ankleY);
        g.rotate(-totAngle * 0.65);
        var bootW = 24 * scale, bootH = 12 * scale;
        g.fillStyle = '#0f172a';
        g.strokeStyle = '#ffffff';
        g.lineWidth = 2.5 * scale;
        rr(g, -bootW * 0.35, -bootH * 0.45, bootW, bootH, bootH * 0.45);
        g.fill();
        g.stroke();

        /* Boot stripe */
        g.fillStyle = sockCol || '#fde047';
        g.fillRect(-bootW * 0.05, -bootH * 0.3, bootW * 0.32, bootH * 0.55);

        /* White studs under boot */
        g.fillStyle = '#e2e8f0';
        g.fillRect(-bootW * 0.22, bootH * 0.5, 3.5 * scale, 3.5 * scale);
        g.fillRect(bootW * 0.32, bootH * 0.5, 3.5 * scale, 3.5 * scale);
        g.restore();

        return { ankleX: ankleX, ankleY: ankleY, kneeX: kneeX, kneeY: kneeY };
      }

      /* ====================================================================
         DRAW STADIUM, CROWD, TURF & 3D GOALPOSTS
         ==================================================================== */
      function drawStadiumAndPitch(now) {
        var bg = hal ? (imgReady(artBgHal) ? artBgHal : artBgClassic) : artBgClassic;
        if (imgReady(bg)) {
          g.drawImage(bg, 0, 0, VW, VH);
          g.fillStyle = hal ? 'rgba(18, 6, 36, 0.42)' : 'rgba(6, 15, 32, 0.22)';
          g.fillRect(0, 0, VW, VH);
        } else {
          var sky = g.createLinearGradient(0, 0, 0, GY_LINE);
          sky.addColorStop(0, hal ? '#1a0633' : '#09152e');
          sky.addColorStop(1, hal ? '#3b0764' : '#1e3a8a');
          g.fillStyle = sky;
          g.fillRect(0, 0, VW, GY_LINE);
        }

        /* Animated Stadium Crowd Tier behind the goal */
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
          g.fillStyle = 'rgba(255, 255, 255, 0.055)';
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
        g.strokeStyle = 'rgba(255, 255, 255, 0.84)';
        g.lineWidth = 6;
        g.beginPath();
        g.moveTo(0, GY_LINE);
        g.lineTo(VW, GY_LINE);
        g.moveTo(GX - GW - 140, GY_LINE);
        g.lineTo(GX - GW - 340, VH);
        g.moveTo(GX + GW + 140, GY_LINE);
        g.lineTo(GX + GW + 340, VH);
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

      function drawGoalBackAndNet(now) {
        var L = GX - GW, R = GX + GW, T_Y = GY_BAR, B_Y = GY_LINE;
        var backL = project3D(-1, 0, 1.18).x;
        var backR = project3D(1, 0, 1.18).x;
        var backT = project3D(0, 1, 1.18).y;
        var backB = project3D(0, 0, 1.18).groundY;

        g.save();
        /* Goal Ground Shadow */
        g.fillStyle = 'rgba(0, 0, 0, 0.34)';
        g.beginPath();
        g.moveTo(L - 12, B_Y + 6);
        g.lineTo(R + 12, B_Y + 6);
        g.lineTo(backR + 10, backB + 14);
        g.lineTo(backL - 10, backB + 14);
        g.closePath();
        g.fill();

        /* Dark Goal Interior + Net Texture */
        g.fillStyle = 'rgba(15, 23, 42, 0.44)';
        g.beginPath();
        g.moveTo(L, T_Y);
        g.lineTo(R, T_Y);
        g.lineTo(R, B_Y);
        g.lineTo(L, B_Y);
        g.closePath();
        g.fill();

        if (imgReady(artNet)) {
          g.save();
          g.globalAlpha = 0.52;
          g.drawImage(artNet, L + 6, T_Y + 6, (R - L) - 12, (B_Y - T_Y) - 6);
          g.restore();
        }

        /* 3D Spring Net Mesh with Dynamic Impact Ripple */
        g.strokeStyle = 'rgba(255, 255, 255, 0.36)';
        g.lineWidth = 2;
        var cols = 22, rows = 10;
        var ripAmp = netRipple.active ? Math.sin(netRipple.t * 24) * Math.exp(-netRipple.t * 3.0) * 32 : 0;
        var ripPt = project3D(netRipple.x, netRipple.y, 1.08);

        for (var c = 0; c <= cols; c++) {
          var u = c / cols;
          g.beginPath();
          for (var r = 0; r <= rows; r++) {
            var v = r / rows;
            var nx = lerp(backL + u * (backR - backL), L + u * (R - L), 0.32);
            var ny = lerp(backT + v * (backB - backT), T_Y + v * (B_Y - T_Y), 0.32);
            if (ripAmp !== 0) {
              var d = Math.hypot(nx - ripPt.x, ny - ripPt.y);
              var push = Math.max(0, 1 - d / 210) * ripAmp;
              ny -= push * 0.65;
              nx += (nx - ripPt.x) * 0.09 * (push / 32);
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
            var nx2 = lerp(backL + u2 * (backR - backL), L + u2 * (R - L), 0.32);
            var ny2 = lerp(backT + v2 * (backB - backT), T_Y + v2 * (B_Y - T_Y), 0.32);
            if (ripAmp !== 0) {
              var d2 = Math.hypot(nx2 - ripPt.x, ny2 - ripPt.y);
              var push2 = Math.max(0, 1 - d2 / 210) * ripAmp;
              ny2 -= push2 * 0.65;
            }
            if (c2 === 0) g.moveTo(nx2, ny2);
            else g.lineTo(nx2, ny2);
          }
          g.stroke();
        }

        /* Live Open-Corner & Top-Bins Zones during Aiming */
        if (phase === 'aim') {
          [-1, 1].forEach(function (side) {
            var bx = side < 0 ? L + 14 : R - 134;
            var by = T_Y + 14;
            /* Highlight the side the keeper has left open! */
            var keeperFar = (side * keeper.X < -0.12);
            var pulse = 0.72 + Math.sin(now / 170) * 0.18;
            g.save();
            g.globalAlpha = pulse;
            g.fillStyle = keeperFar ? 'rgba(74, 222, 128, 0.26)' : 'rgba(250, 204, 21, 0.18)';
            g.strokeStyle = keeperFar ? '#4ade80' : '#fde047';
            g.lineWidth = keeperFar ? 4 : 3;
            g.setLineDash([8, 6]);
            rr(g, bx, by, 120, 88, 14);
            g.fill();
            g.stroke();
            g.setLineDash([]);
            drawOutlinedText(g, '⭐ +30', bx + 60, by + 34, 22, '#fde047', '#0f172a');
            if (keeperFar) {
              drawOutlinedText(g, 'OPEN!', bx + 60, by + 64, 18, '#4ade80', '#0f172a');
            }
            g.restore();
          });
        }

        /* Rear Stanchion Bars */
        g.strokeStyle = '#94a3b8';
        g.lineWidth = 7;
        g.beginPath();
        g.moveTo(L, T_Y); g.lineTo(backL, backT); g.lineTo(backL, backB);
        g.moveTo(R, T_Y); g.lineTo(backR, backT); g.lineTo(backR, backB);
        g.moveTo(backL, backT); g.lineTo(backR, backT);
        g.stroke();
        g.restore();
      }

      /* Front Goalposts & Crossbar drawn with metallic cylindrical shading & vibration */
      function drawGoalFrontFrame() {
        var L = GX - GW, R = GX + GW, T_Y = GY_BAR, B_Y = GY_LINE;
        var vibX = postShake.t > 0 ? Math.sin(postShake.t * 55) * 6 * postShake.x : 0;
        var vibY = postShake.t > 0 ? Math.cos(postShake.t * 55) * 6 * postShake.y : 0;

        g.save();
        g.translate(vibX, vibY);
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

        /* Specular highlight along crossbar & posts */
        g.strokeStyle = 'rgba(224, 242, 254, 0.85)';
        g.lineWidth = 5;
        g.beginPath();
        g.moveTo(L - 3, B_Y); g.lineTo(L - 3, T_Y - 3); g.lineTo(R - 3, T_Y - 3);
        g.stroke();
        g.restore();
      }

      /* ====================================================================
         DRAW ARTICULATED GOALKEEPER (Connected Arms, Gloves, Legs & Dive)
         ==================================================================== */
      function drawGoalkeeper(now) {
        var oppIdx = (turn + 1) % nt;
        var kImg = monBodyImgs[oppIdx] || monBodyImgs[0];
        var pal  = monPalettes[oppIdx] || monPalettes[0];
        var sockCol = (T[oppIdx] && T[oppIdx].color) || '#f43f5e';

        var groundPt = project3D(keeper.X, 0, 0.98);
        var bodyPt   = project3D(keeper.X, keeper.Y + 0.24, 0.98);
        var kSize = 152;

        g.save();
        /* Keeper Ground Shadow on Goal Line */
        var shadowScale = clamp(1 - keeper.Y * 0.65, 0.45, 1.0);
        g.fillStyle = 'rgba(15, 23, 42, 0.44)';
        g.beginPath();
        g.ellipse(groundPt.x, groundPt.y + 6, 58 * shadowScale, 15 * shadowScale, 0, 0, Math.PI * 2);
        g.fill();

        /* Compute Animated Keeper Legs */
        var hipSpread = 22;
        var hipY = bodyPt.y + 28;
        var hipLX = bodyPt.x - hipSpread;
        var hipRX = bodyPt.x + hipSpread;

        var lHipAng = -0.18, lKneeAng = 0.32;
        var rHipAng =  0.18, rKneeAng = -0.32;

        if (!keeper.diving) {
          /* Athletic side-shuffle footwork synced to patrol movement */
          var s1 = Math.sin(keeper.stepPhase);
          var s2 = Math.cos(keeper.stepPhase);
          lHipAng = -0.22 + s1 * 0.28;
          lKneeAng = 0.36 + Math.max(0, s2) * 0.28;
          rHipAng =  0.22 - s1 * 0.28;
          rKneeAng = -0.36 - Math.max(0, -s2) * 0.28;
        } else {
          /* Aerial dive leg extension trailing opposite the dive direction */
          var trailSign = keeper.diveSide >= 0 ? -1 : 1;
          lHipAng = trailSign * 0.65;
          lKneeAng = trailSign * 0.25;
          rHipAng = trailSign * 0.48;
          rKneeAng = trailSign * 0.35;
        }

        drawArticulatedLeg(hipLX, hipY, 26, 26, lHipAng, lKneeAng, pal, sockCol, 0.88);
        drawArticulatedLeg(hipRX, hipY, 26, 26, rHipAng, rKneeAng, pal, sockCol, 0.88);

        /* Keeper Torso + Head */
        var idleBob = keeper.diving ? 0 : -Math.abs(Math.sin(keeper.stepPhase)) * 7;
        g.save();
        g.translate(bodyPt.x, bodyPt.y + idleBob);
        g.rotate(keeper.rot);
        if (imgReady(kImg)) {
          g.drawImage(kImg, -kSize / 2, -kSize / 2, kSize, kSize);
        } else {
          g.fillStyle = sockCol;
          g.beginPath();
          g.arc(0, 0, 56, 0, Math.PI * 2);
          g.fill();
        }
        g.restore();

        /* Connected Goalkeeper Arms + Gloves (Shoulder -> Elbow -> Glove) */
        var glL = project3D(keeper.gloveLX, keeper.gloveLY, 0.98);
        var glR = project3D(keeper.gloveRX, keeper.gloveRY, 0.98);
        var shL = { x: bodyPt.x - 36, y: bodyPt.y + idleBob - 4 };
        var shR = { x: bodyPt.x + 36, y: bodyPt.y + idleBob - 4 };

        [
          { sh: shL, gl: glL, side: -1 },
          { sh: shR, gl: glR, side: 1 }
        ].forEach(function (arm) {
          var midX = (arm.sh.x + arm.gl.x) * 0.5 + arm.side * 10;
          var midY = (arm.sh.y + arm.gl.y) * 0.5 + 10;

          /* Connected arm sleeve */
          g.lineCap = 'round';
          g.strokeStyle = pal.shadowDark || '#0f172a';
          g.lineWidth = 18;
          g.beginPath();
          g.moveTo(arm.sh.x, arm.sh.y);
          g.quadraticCurveTo(midX, midY, arm.gl.x, arm.gl.y);
          g.stroke();

          g.strokeStyle = pal.primary || sockCol;
          g.lineWidth = 12;
          g.beginPath();
          g.moveTo(arm.sh.x, arm.sh.y);
          g.quadraticCurveTo(midX, midY, arm.gl.x, arm.gl.y);
          g.stroke();

          /* Glove at wrist */
          g.save();
          g.translate(arm.gl.x, arm.gl.y);
          var ang = Math.atan2(arm.gl.y - arm.sh.y, arm.gl.x - arm.sh.x);
          g.rotate(ang * 0.35);
          g.scale(arm.side, 1);
          if (imgReady(artGlove)) {
            g.drawImage(artGlove, -30, -30, 60, 60);
          } else {
            g.fillStyle = '#fde047';
            g.strokeStyle = '#0f172a';
            g.lineWidth = 4;
            g.beginPath();
            g.arc(0, 0, 22, 0, Math.PI * 2);
            g.fill();
            g.stroke();
          }
          g.restore();
        });

        g.restore();
      }

      /* ====================================================================
         DRAW 3D TRAJECTORY ARC, SPIN PREVIEW & AIM TARGET RETICLE
         ==================================================================== */
      function drawTrajectoryAndReticle(now) {
        if (phase !== 'aim') return;

        var kin = computeShotKinematics(aimX, aimY, shotSpin, shotPower);
        var inFrame = (Math.abs(aimX) < 0.96 && aimY < 0.95);
        var onWood  = (!inFrame && Math.abs(aimX) <= 1.07 && aimY <= 1.06);
        var arcCol  = inFrame ? (shotSpin !== 0 ? '#fde047' : '#4ade80') : (onWood ? '#fb923c' : '#f43f5e');

        g.save();
        /* 1. Ground Shadow Path on the Turf */
        g.strokeStyle = 'rgba(15, 23, 42, 0.32)';
        g.lineWidth = 4;
        g.setLineDash([8, 8]);
        g.beginPath();
        var steps = 20;
        for (var i = 0; i <= steps; i++) {
          var t = (i / steps) * kin.T;
          var gx = kin.vx * t + 0.5 * kin.ax * t * t;
          var gz = kin.vz * t;
          var gp = project3D(gx, 0, gz);
          if (i === 0) g.moveTo(gp.x, gp.y);
          else g.lineTo(gp.x, gp.y);
        }
        g.stroke();
        g.setLineDash([]);

        /* 2. 3D Elevated Flight Arc with Animated Chevron Dots */
        for (var j = 1; j <= steps; j++) {
          var tj = (j / steps) * kin.T;
          var Xj = kin.vx * tj + 0.5 * kin.ax * tj * tj;
          var Yj = Math.max(0, 0.04 + kin.vy * tj - 0.5 * GRAVITY * tj * tj);
          var Zj = kin.vz * tj;
          var pj = project3D(Xj, Yj, Zj);
          var pulse = ((j - (now * 0.018)) % 4 + 4) % 4;
          var rDot = (5.5 - (j / steps) * 2.2) * (pulse < 1.2 ? 1.28 : 1.0);

          g.fillStyle = arcCol;
          g.strokeStyle = '#0f172a';
          g.lineWidth = 2.5;
          g.beginPath();
          g.arc(pj.x, pj.y, rDot, 0, Math.PI * 2);
          g.fill();
          g.stroke();
        }

        /* 3. Target Reticle on Goal Plane (Z = 1.0) */
        var ap = project3D(aimX, aimY, 1.0);
        var tPulse = 1 + Math.sin(now / 120) * 0.07;
        g.translate(ap.x, ap.y);
        g.scale(tPulse, tPulse);
        if (imgReady(artTarget)) {
          g.drawImage(artTarget, -40, -40, 80, 80);
        } else {
          g.strokeStyle = arcCol;
          g.lineWidth = 6;
          g.beginPath();
          g.arc(0, 0, 32, 0, Math.PI * 2);
          g.stroke();
        }

        var badgeTxt = !inFrame
          ? (onWood ? '⚠️ POST / BAR!' : '⚠️ WIDE!')
          : (Math.abs(aimX) >= 0.58 && aimY >= 0.58 ? '⭐ TOP BINS! +30' : (shotSpin !== 0 ? '🍌 CURVE SHOT' : '⚡ POWER SHOT'));
        drawOutlinedText(g, badgeTxt, 0, -50, 21, arcCol, '#0f172a');
        g.restore();

        /* 4. Live Swipe Finger Trail when swiping from ball */
        if (dragMode === 'swipe' && swipePts.length > 1) {
          g.save();
          g.strokeStyle = '#fde047';
          g.lineWidth = 7;
          g.lineCap = 'round';
          g.lineJoin = 'round';
          g.beginPath();
          for (var k = 0; k < swipePts.length; k++) {
            if (k === 0) g.moveTo(swipePts[k].x, swipePts[k].y);
            else g.lineTo(swipePts[k].x, swipePts[k].y);
          }
          g.stroke();
          g.restore();
        }
      }

      /* ====================================================================
         DRAW 3D BALL, GROUND SHADOW & SPINNING SEAM TRAIL
         ==================================================================== */
      function drawBall3D() {
        var bPt = project3D(ball.X, ball.Y, ball.Z);
        var sPt = project3D(ball.X, 0, ball.Z);
        var bRad = Math.max(17, 30 * bPt.scale);

        /* Curved Ribbon Trail */
        for (var i = 0; i < trail.length; i++) {
          var tr = trail[i];
          var alpha = ((i + 1) / (trail.length + 1)) * 0.42;
          g.save();
          g.globalAlpha = alpha;
          g.fillStyle = tr.curve ? '#fde047' : '#38bdf8';
          g.beginPath();
          g.arc(tr.x, tr.y, tr.r * 0.68, 0, Math.PI * 2);
          g.fill();
          g.restore();
        }

        /* True 3D Ground Shadow directly below (ball.X, 0, ball.Z) */
        var heightFade = clamp(1 - ball.Y * 0.65, 0.32, 1.0);
        g.save();
        g.fillStyle = 'rgba(15, 23, 42, ' + (0.42 * heightFade).toFixed(2) + ')';
        g.beginPath();
        g.ellipse(sPt.x, sPt.y + 4, bRad * 0.92 * heightFade, bRad * 0.30 * heightFade, 0, 0, Math.PI * 2);
        g.fill();
        g.restore();

        /* Ball Sprite with 3D Rotation */
        g.save();
        g.translate(bPt.x, bPt.y);
        g.rotate(ball.rot);
        var bIm = imgReady(artBall) ? artBall : artBallFallback;
        if (imgReady(bIm)) {
          g.drawImage(bIm, -bRad, -bRad, bRad * 2, bRad * 2);
        } else {
          g.fillStyle = '#ffffff';
          g.strokeStyle = '#0f172a';
          g.lineWidth = 4;
          g.beginPath();
          g.arc(0, 0, bRad, 0, Math.PI * 2);
          g.fill();
          g.stroke();
        }
        g.restore();
      }

      /* ====================================================================
         DRAW ARTICULATED KICKER & CHEERING TEAMMATE
         ==================================================================== */
      function drawKickerAndBuddy(now) {
        var kImg = monBodyImgs[turn];
        var pal  = monPalettes[turn];
        var teamCol = (T[turn] && T[turn].color) || '#38bdf8';

        /* 1. Cheering Teammate Monster on Left Touchline */
        if (nt > 1) {
          var buddyIdx = (turn + 1) % nt;
          var bImg = monBodyImgs[buddyIdx];
          var bPal = monPalettes[buddyIdx];
          var bCol = (T[buddyIdx] && T[buddyIdx].color) || '#f59e0b';
          var bWave = crowdCheerT > 0 ? Math.sin(now / 90) * 0.45 : Math.sin(now / 280) * 0.12;
          var bBob  = crowdCheerT > 0 ? -Math.abs(Math.sin(now / 100)) * 22 : -Math.abs(Math.sin(now / 300)) * 5;
          var bx = 205, by = 665 + bBob;

          g.save();
          g.fillStyle = 'rgba(15, 23, 42, 0.36)';
          g.beginPath();
          g.ellipse(bx, 738, 48, 13, 0, 0, Math.PI * 2);
          g.fill();

          drawArticulatedLeg(bx - 16, by + 28, 22, 22, -0.12 + bWave * 0.4, 0.2, bPal, bCol, 0.8);
          drawArticulatedLeg(bx + 16, by + 28, 22, 22,  0.12 - bWave * 0.4, -0.2, bPal, bCol, 0.8);

          if (imgReady(bImg)) {
            g.translate(bx, by);
            g.rotate(bWave * 0.25);
            g.drawImage(bImg, -74, -74, 148, 148);
          }
          g.restore();
        }

        /* 2. Main Kicker Athlete (Articulated Legs + Body + Kick Swoosh) */
        var kGround = project3D(kicker.X, 0, kicker.Z);
        var kScale = clamp(kGround.scale * 0.72, 0.85, 1.18);
        var kSize = 186 * kScale;
        var kx = kGround.x;
        var ky = kGround.y - 68 * kScale + kicker.bobY;

        g.save();
        /* Ground Shadow + Team Ring */
        g.fillStyle = 'rgba(15, 23, 42, 0.44)';
        g.beginPath();
        g.ellipse(kGround.x, kGround.y + 8, 56 * kScale, 15 * kScale, 0, 0, Math.PI * 2);
        g.fill();
        g.strokeStyle = teamCol;
        g.lineWidth = 4;
        g.beginPath();
        g.ellipse(kGround.x, kGround.y + 8, 48 * kScale, 12 * kScale, 0, 0, Math.PI * 2);
        g.stroke();

        /* Left Plant Leg & Right Kicking Leg */
        var hipY = ky + 26 * kScale;
        var hipLX = kx - 18 * kScale;
        var hipRX = kx + 18 * kScale;
        drawArticulatedLeg(hipLX, hipY, 30 * kScale, 30 * kScale, kicker.hipL, kicker.kneeL, pal, teamCol, kScale);
        var rFoot = drawArticulatedLeg(hipRX, hipY, 30 * kScale, 30 * kScale, kicker.hipR, kicker.kneeR, pal, teamCol, kScale);

        /* Glowing Crescent Kick Swoosh Arc during Strike */
        if (kicker.kickSwoosh > 0.02) {
          g.save();
          g.globalAlpha = kicker.kickSwoosh * 0.85;
          g.strokeStyle = '#fde047';
          g.lineWidth = 14 * kScale;
          g.lineCap = 'round';
          g.beginPath();
          g.arc(hipRX, hipY, 56 * kScale, -0.35, 1.15, false);
          g.stroke();
          g.restore();
        }

        /* Kicker Body Sprite */
        g.save();
        g.translate(kx, ky);
        g.rotate(kicker.torsoTilt);
        if (imgReady(kImg)) {
          g.drawImage(kImg, -kSize / 2, -kSize / 2, kSize, kSize);
        } else {
          g.fillStyle = teamCol;
          g.beginPath();
          g.arc(0, 0, 64 * kScale, 0, Math.PI * 2);
          g.fill();
        }
        if (phase === 'shrug') {
          drawOutlinedText(g, '😊', kSize * 0.34, -kSize * 0.34, 34, '#fde047', '#0f172a');
        }
        g.restore();

        /* Golden Boot Aura when ready to kick in Aim phase */
        if (phase === 'aim') {
          var auraPulse = 0.55 + Math.sin(now / 140) * 0.25;
          g.save();
          g.globalAlpha = auraPulse;
          g.strokeStyle = '#fde047';
          g.lineWidth = 3;
          g.beginPath();
          g.arc(rFoot.ankleX, rFoot.ankleY, 18, 0, Math.PI * 2);
          g.stroke();
          g.restore();
        }

        g.restore();
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

      /* ====================================================================
         60FPS MAIN SIMULATION & ANIMATION LOOP
         ==================================================================== */
      var lastNow = performance.now();
      var rafId = 0;

      function updateGoalkeeperPhysics(dt, now) {
        if (phase === 'wait' || phase === 'aim') {
          /* Active Patrol along the goal line: pupil can time their shot when keeper steps away! */
          keeper.X += keeper.patrolDir * LV.patrolSpd * dt * 0.65;
          if (keeper.X > LV.patrolRange) {
            keeper.X = LV.patrolRange;
            keeper.patrolDir = -1;
          } else if (keeper.X < -LV.patrolRange) {
            keeper.X = -LV.patrolRange;
            keeper.patrolDir = 1;
          }
          keeper.stepPhase += dt * 9.5 * LV.patrolSpd;
          keeper.Y = 0;
          keeper.rot = Math.sin(keeper.stepPhase) * 0.04;
          /* Ready hands position */
          keeper.gloveLX = keeper.X - 0.16;
          keeper.gloveRX = keeper.X + 0.16;
          keeper.gloveLY = 0.28 + Math.sin(now / 160) * 0.03;
          keeper.gloveRY = 0.28 + Math.cos(now / 160) * 0.03;
        } else if (phase === 'runup') {
          /* Keeper sets their feet at their current spot as the kicker runs up */
          keeper.stepPhase += dt * 12;
          keeper.Y = Math.abs(Math.sin(keeper.stepPhase)) * 0.03;
          keeper.rot = 0;
          keeper.gloveLX = keeper.X - 0.17;
          keeper.gloveRX = keeper.X + 0.17;
          keeper.gloveLY = 0.28;
          keeper.gloveRY = 0.28;
        } else if (phase === 'flight') {
          if (keeper.reactTimer > 0) {
            keeper.reactTimer -= dt;
            keeper.stepPhase += dt * 11;
            keeper.gloveLX = keeper.X - 0.16;
            keeper.gloveRX = keeper.X + 0.16;
            keeper.gloveLY = 0.28;
            keeper.gloveRY = 0.28;
          } else {
            /* Keeper launches into aerial dive from their current patrol spot! */
            if (!keeper.diving) {
              keeper.diving = true;
              var dx = keeper.targetX - keeper.X;
              keeper.diveSide = Math.abs(dx) < 0.08 ? 0 : (dx > 0 ? 1 : -1);
            }
            var remX = keeper.targetX - keeper.X;
            var stepX = clamp(remX * 5.2, -LV.diveSpdX, LV.diveSpdX);
            keeper.X = clamp(keeper.X + stepX * dt, -0.96, 0.96);

            var targetLift = Math.max(0.06, keeper.targetY - 0.18);
            keeper.Y = lerp(keeper.Y, targetLift, clamp(dt * 8.5, 0, 1));
            keeper.rot = lerp(keeper.rot, keeper.diveSide * 0.92, clamp(dt * 9.5, 0, 1));

            /* Outstretched gloves reach toward the ball's height & side */
            var reachX = keeper.diveSide * 0.20;
            keeper.gloveLX = keeper.X - 0.12 + reachX;
            keeper.gloveRX = keeper.X + 0.12 + reachX;
            keeper.gloveLY = keeper.Y + 0.28 + (keeper.targetY - 0.28) * 0.55;
            keeper.gloveRY = keeper.Y + 0.28 + (keeper.targetY - 0.28) * 0.55;
          }
        } else if (phase === 'result') {
          /* Settle back to the turf after the dive */
          keeper.Y = Math.max(0, keeper.Y - dt * 1.15);
          keeper.rot = lerp(keeper.rot, 0, clamp(dt * 5.5, 0, 1));
          keeper.gloveLX = lerp(keeper.gloveLX, keeper.X - 0.16, clamp(dt * 6, 0, 1));
          keeper.gloveRX = lerp(keeper.gloveRX, keeper.X + 0.16, clamp(dt * 6, 0, 1));
          keeper.gloveLY = lerp(keeper.gloveLY, 0.26, clamp(dt * 6, 0, 1));
          keeper.gloveRY = lerp(keeper.gloveRY, 0.26, clamp(dt * 6, 0, 1));
        }
      }

      function updateKickerAnimation(dt, now) {
        if (kicker.kickSwoosh > 0) {
          kicker.kickSwoosh = Math.max(0, kicker.kickSwoosh - dt * 3.4);
        }

        if (phase === 'wait' || phase === 'aim') {
          kicker.X = -0.22;
          kicker.Z = -0.18;
          kicker.bobY = -Math.abs(Math.sin(now / 240)) * 6;
          kicker.torsoTilt = Math.sin(now / 360) * 0.04;
          /* Athletic ready stance with slight knee flex */
          kicker.hipL = -0.14;
          kicker.kneeL = 0.24;
          kicker.hipR = 0.18 + Math.sin(now / 180) * 0.08;
          kicker.kneeR = -0.22;
        } else if (phase === 'runup') {
          /* 0.00..0.34s: 4-Stride Approach Sprint
             0.34..0.44s: Plant Left Foot & Big Right-Leg Backswing Wind-Up
             0.44..0.52s: Whip Right Boot through the Ball! */
          var u = clamp(phaseT / 0.46, 0, 1);
          kicker.X = lerp(-0.22, -0.07, u);
          kicker.Z = lerp(-0.18, 0.0, u);

          if (phaseT < 0.34) {
            var prevStride = Math.floor(kicker.stridePhase / Math.PI);
            kicker.stridePhase += dt * 34;
            var curStride = Math.floor(kicker.stridePhase / Math.PI);
            if (curStride !== prevStride) {
              var fp = project3D(kicker.X, 0, kicker.Z);
              addTurfPuff(fp.x, fp.y + 8, -1);
            }
            var s = Math.sin(kicker.stridePhase);
            kicker.hipL = s * 0.78;
            kicker.kneeL = Math.max(0, -s) * 0.65;
            kicker.hipR = -s * 0.78;
            kicker.kneeR = Math.max(0, s) * 0.65;
            kicker.torsoTilt = 0.16;
            kicker.bobY = -Math.abs(Math.cos(kicker.stridePhase)) * 11;
          } else if (phaseT < 0.45) {
            /* Plant foot down & wind kicking leg high back */
            var w = (phaseT - 0.34) / 0.11;
            kicker.hipL = lerp(kicker.hipL, 0.32, w);
            kicker.kneeL = lerp(kicker.kneeL, 0.18, w);
            kicker.hipR = lerp(kicker.hipR, -1.18, w);
            kicker.kneeR = lerp(kicker.kneeR, 0.95, w);
            kicker.torsoTilt = lerp(0.16, -0.24, w);
            kicker.bobY = -4;
          } else {
            /* Explosive Forward Strike! */
            kicker.hipL = 0.25;
            kicker.kneeL = 0.12;
            kicker.hipR = 0.98;
            kicker.kneeR = -0.08;
            kicker.torsoTilt = -0.28;
            kicker.bobY = -12;
            if (!kicker.struck) {
              executeBallStrike();
            }
          }
        } else if (phase === 'flight') {
          /* Follow-through pose watching the shot */
          var f = clamp(phaseT / 0.35, 0, 1);
          kicker.hipL = lerp(0.25, -0.12, f);
          kicker.kneeL = 0.16;
          kicker.hipR = lerp(0.98, 0.38, f);
          kicker.kneeR = lerp(-0.08, -0.25, f);
          kicker.torsoTilt = lerp(-0.28, 0.06, f);
          kicker.bobY = lerp(-12, 0, f);
        } else if (phase === 'result') {
          var isGoal = (ball.outcome === 'topbins' || ball.outcome === 'in_off_post' || ball.outcome === 'corner' || ball.outcome === 'goal');
          if (isGoal) {
            /* Joyful Jumping Celebration with kicking legs */
            var jump = Math.abs(Math.sin(now / 115));
            kicker.bobY = -jump * 38;
            kicker.torsoTilt = Math.sin(now / 140) * 0.18;
            kicker.hipL = -0.45 * jump;
            kicker.kneeL = 0.55 * jump;
            kicker.hipR = 0.45 * jump;
            kicker.kneeR = -0.55 * jump;
          } else {
            kicker.bobY = -Math.abs(Math.sin(now / 260)) * 5;
            kicker.torsoTilt = 0.08;
            kicker.hipL = -0.1; kicker.kneeL = 0.2;
            kicker.hipR = 0.1;  kicker.kneeR = -0.2;
          }
        }
      }

      function updateBallPhysics(dt) {
        if (phase === 'flight') {
          ball.vx += ball.ax * dt;
          ball.vy -= GRAVITY * dt;
          ball.X += ball.vx * dt;
          ball.Y += ball.vy * dt;
          ball.Z += ball.vz * dt;
          ball.rot += ball.spinRate * dt;

          /* Turf bounce if shot was aimed very low */
          if (ball.Y < 0.04) {
            ball.Y = 0.04;
            ball.vy = Math.abs(ball.vy) * 0.55;
          }

          var scPt = project3D(ball.X, ball.Y, ball.Z);
          if (trail.length === 0 || Math.hypot(scPt.x - trail[trail.length - 1].x, scPt.y - trail[trail.length - 1].y) > 16) {
            trail.push({ x: scPt.x, y: scPt.y, r: Math.max(16, 28 * scPt.scale), curve: shotSpin !== 0 });
            if (trail.length > 15) trail.shift();
          }

          if (!ball.crossedGoalLine && ball.Z >= 1.0) {
            checkGoalLineCrossing();
          }
        } else if (phase === 'result') {
          var isGoal = (ball.outcome === 'topbins' || ball.outcome === 'in_off_post' || ball.outcome === 'corner' || ball.outcome === 'goal');
          if (isGoal) {
            /* Ball travels into the back of the net (Z -> 1.15), hits the mesh, and drops to the grass inside the goal! */
            ball.X += ball.vx * dt * 0.45;
            ball.Z += ball.vz * dt * 0.45;
            ball.vy -= GRAVITY * 1.15 * dt;
            ball.Y += ball.vy * dt;
            ball.rot += ball.spinRate * dt * 0.4;

            if (ball.Z >= 1.15) {
              ball.Z = 1.15;
              ball.vz = -Math.abs(ball.vz) * 0.18;
              ball.vx *= 0.35;
              ball.spinRate *= 0.5;
            }
            if (ball.X < -0.92) { ball.X = -0.92; ball.vx = Math.abs(ball.vx) * 0.4; }
            if (ball.X >  0.92) { ball.X =  0.92; ball.vx = -Math.abs(ball.vx) * 0.4; }
            if (ball.Y >  0.86) { ball.Y =  0.86; ball.vy = -Math.abs(ball.vy) * 0.5; }
            if (ball.Y <= 0.04) {
              ball.Y = 0.04;
              ball.vy = Math.abs(ball.vy) > 0.25 ? Math.abs(ball.vy) * 0.42 : 0;
              ball.vx *= 0.88;
            }
          } else {
            /* Rebound / Wide ball continues with 3D gravity and bounces on turf */
            ball.vy -= GRAVITY * 1.25 * dt;
            ball.X += ball.vx * dt;
            ball.Y += ball.vy * dt;
            ball.Z = clamp(ball.Z + ball.vz * dt, 0.15, 1.35);
            ball.rot += ball.spinRate * dt * 0.6;
            if (ball.Y <= 0.04) {
              ball.Y = 0.04;
              if (Math.abs(ball.vy) > 0.2) {
                ball.vy = Math.abs(ball.vy) * 0.52;
                var bp = project3D(ball.X, 0, ball.Z);
                addTurfPuff(bp.x, bp.y, ball.vx >= 0 ? 1 : -1);
              } else {
                ball.vy = 0;
              }
              ball.vx *= 0.90;
              ball.vz *= 0.90;
            }
          }
        }
      }

      function frame(now) {
        if (!alive) return;
        var rawDt = Math.min(0.05, Math.max(0.001, (now - lastNow) / 1000));
        lastNow = now;

        if (hitStopT > 0) {
          hitStopT = Math.max(0, hitStopT - rawDt);
          rafId = requestAnimationFrame(frame);
          return;
        }

        var dt = rawDt;
        phaseT += dt;
        if (crowdCheerT > 0) crowdCheerT = Math.max(0, crowdCheerT - dt);
        if (postShake.t > 0) postShake.t = Math.max(0, postShake.t - dt);
        if (netRipple.active) {
          netRipple.t += dt;
          if (netRipple.t > 1.3) netRipple.active = false;
        }

        /* Subtle breathing motion on default target before pupil touches it */
        if (phase === 'aim' && !userTouchedAim && !dragMode) {
          var side = (kickNo % 2 === 0) ? 1 : -1;
          aimX = side * (0.58 + Math.sin(now / 520) * 0.14);
          aimY = 0.56 + Math.cos(now / 640) * 0.12;
        }

        updateGoalkeeperPhysics(dt, now);
        updateKickerAnimation(dt, now);
        updateBallPhysics(dt);

        /* Update particles & impact rings */
        particles = particles.filter(function (p) {
          p.t += dt;
          p.vy += 460 * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          return p.t < p.life;
        });
        impactWaves = impactWaves.filter(function (w) {
          w.t += dt;
          w.r = lerp(12, w.maxR, Math.min(1, w.t / 0.28));
          return w.t < 0.28;
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
        drawGoalBackAndNet(now);

        /* Depth-sorted rendering: if ball is inside the goal (Z > 1.0), draw ball behind front posts & keeper! */
        if (ball.Z > 1.0) {
          drawBall3D();
          drawGoalkeeper(now);
          drawGoalFrontFrame();
        } else {
          drawGoalkeeper(now);
          drawGoalFrontFrame();
          drawTrajectoryAndReticle(now);
          drawBall3D();
        }

        drawKickerAndBuddy(now);

        /* Shockwave Impact Rings */
        impactWaves.forEach(function (w) {
          g.save();
          g.globalAlpha = Math.max(0, 1 - w.t / 0.28);
          g.strokeStyle = w.col;
          g.lineWidth = 6 * (1 - w.t / 0.28);
          g.beginPath();
          g.arc(w.x, w.y, w.r, 0, Math.PI * 2);
          g.stroke();
          g.restore();
        });

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
