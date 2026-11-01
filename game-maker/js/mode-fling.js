/* ============================================================================
   Game Maker: ALLEY FLING ("Cat vs Dog" Backyard Battle — True Skill Edition)
   ----------------------------------------------------------------------------
   2-Team Turn-Based Backyard Artillery & Skill Game (Grade 3 & Grade 4)
   - ZERO Auto-Throw / Auto-Aim Crutches:
     * No 1-tap auto-aim preset buttons.
     * No full-screen trajectory cheat arc. Only a short 110px muzzle pointer is
       shown at the hand — players must read the Wind Gauge, Rival Distance,
       Fence Height, and Patrolling Wasp to judge Angle (°) & Power (%)!
   - Dual Skill Input (Both 100% Player-Controlled):
     1️⃣ 2-STEP ARCADE TIMING:
        - Step 1 (ANGLE): Sweeping angle needle (20° ↔ 78°) — tap/Space to lock!
        - Step 2 (POWER): Fast surging power gauge (10% ↔ 100%) — tap/Space to
          fire! Over-charging (>94%) causes a wild spin slip!
     2️⃣ MANUAL SLINGSHOT DRAG:
        - Or grab & pull back directly on the canvas to set angle & power with
          high-tension hand tremor, then release to fire!
   - Dynamic Challenge Mechanics:
     * Shifting Yard Positions: Cat & Dog move forward/back in their yards each
       turn so the same throw power never works twice in a row.
     * Active Rival Ducking: In Normal/Gusty modes, rivals duck slightly when a
       projectile approaches, requiring crisp aim.
     * Patrolling Aerial Hazard: A buzzing Backyard Wasp patrols above the
       center fence and deflects careless shots!
     * Real Wind & Mid-Air Gusts: Bidirectional wind bar (-260 .. +260 px/s²)
       actively pushes shots in flight.
     * Real Miss Consequences: Hitting the fence, getting deflected, or missing
       wide awards 0 points. Headshots (+35), Body Hits (+25), Tin Cans (+10),
       Star Coin (+15), and Yard Knockouts (+30 bonus) reward real skill!
   ============================================================================ */
(function (w) {
  'use strict';
  var GM = w.GM = w.GM || {};
  GM.modes = GM.modes || {};

  var U = function () { return GM.u; };
  var A = function () { return GM.audio; };

  /* Virtual 16:9 Smartboard Panorama Dimensions */
  var W = 1600;
  var H = 900;
  var GROUND_Y = 790;
  var FENCE_X = 800;
  var FENCE_TOP_Y = 468; /* Taller wooden dividing fence requiring real arc control */
  var FENCE_HALF_W = 30;
  var BASE_CAT_X = 300;
  var BASE_DOG_X = 1260;
  var GRAVITY = 980;

  var ASSET_PATHS = {
    bgYards: 'art/bg_fling_yards.webp',
    catReady: 'art/c_cat_ready.webp',
    catCheer: 'art/c_cat_cheer.webp',
    dogReady: 'art/c_dog_ready.webp',
    dogCheer: 'art/c_dog_cheer.webp',
    doghouse: 'art/o_doghouse.webp',
    yarn: 'art/o_yarn.webp',
    bone: 'art/o_bone.webp',
    starCoin: 'art/o_star_coin.webp'
  };

  /* Clean baked-in bottom grey shadow blobs from character cutouts */
  function cleanBottomShadow(img) {
    try {
      var cw = img.naturalWidth || img.width;
      var ch = img.naturalHeight || img.height;
      if (!cw || !ch) return img;
      var c = document.createElement('canvas');
      c.width = cw;
      c.height = ch;
      var cx = c.getContext('2d');
      cx.drawImage(img, 0, 0);
      var id = cx.getImageData(0, 0, cw, ch);
      var d = id.data;
      var startY = Math.floor(ch * 0.84);
      for (var y = startY; y < ch; y++) {
        for (var x = 0; x < cw; x++) {
          var i = (y * cw + x) * 4;
          var a = d[i + 3];
          if (a === 0) continue;
          var r = d[i], g = d[i + 1], b = d[i + 2];
          var max = Math.max(r, g, b), min = Math.min(r, g, b);
          if ((max - min) < 22 && max < 212) {
            d[i + 3] = 0;
          }
        }
      }
      cx.putImageData(id, 0, 0);
      return c;
    } catch (e) {
      return img;
    }
  }

  function loadArtAssets() {
    var cache = {};
    Object.keys(ASSET_PATHS).forEach(function (k) {
      var img = new Image();
      img.onload = function () {
        if (k === 'catReady' || k === 'catCheer' || k === 'dogReady' || k === 'dogCheer') {
          cache[k + 'Clean'] = cleanBottomShadow(img);
        }
      };
      img.src = ASSET_PATHS[k];
      cache[k] = img;
    });
    return cache;
  }

  function imgReady(im) {
    if (!im) return false;
    if (im.tagName === 'CANVAS') return im.width > 0;
    return !!(im.complete && im.naturalWidth > 0);
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function roundRect(g, x, y, w, h, r) {
    var rr = Math.min(r, w / 2, h / 2);
    g.beginPath();
    g.moveTo(x + rr, y);
    g.arcTo(x + w, y, x + w, y + h, rr);
    g.arcTo(x + w, y + h, x, y + h, rr);
    g.arcTo(x, y + h, x, y, rr);
    g.arcTo(x, y, x + w, y, rr);
    g.closePath();
  }

  function drawOutlinedText(g, text, x, y, size, fill, stroke, align) {
    g.save();
    g.font = '900 ' + size + 'px "Fredoka", "Nunito", sans-serif';
    g.textAlign = align || 'center';
    g.textBaseline = 'middle';
    g.lineJoin = 'round';
    g.lineWidth = Math.max(4, size * 0.18);
    g.strokeStyle = stroke || '#090d16';
    g.strokeText(text, x, y);
    g.fillStyle = fill || '#ffffff';
    g.fillText(text, x, y);
    g.restore();
  }

  GM.modes.fling = {
    id: 'fling',
    name: 'Alley Fling',
    sub: 'Cat vs Dog Backyard Battle',
    e: '🐱',
    teams: 2,
    desc: 'True Cat vs Dog skill battle! Read the wind gauge, lock your throw angle, time the fast power bar (or pull the slingshot), dodge the patrolling wasp, and bonk your rival!',
    fields: [
      {
        key: 'rounds',
        label: 'Throws',
        opts: [
          [6, '6 throws', '3 each'],
          [10, '10 throws', '5 each'],
          [14, '14 throws', '7 each']
        ],
        def: 10
      },
      {
        key: 'windMode',
        label: 'Difficulty & Wind',
        opts: [
          ['easy', 'Standard Yard', 'moderate wind · steady meter'],
          ['normal', 'Pro Backyard', 'strong wind · moving stances · wasp hazard'],
          ['gusty', 'Hurricane Alley', 'extreme gusts · fast meter · active dodging!']
        ],
        def: 'normal'
      }
    ],

    start: function (ctx) {
      var T = GM.state.teams;
      var totalTurns = +ctx.cfg.rounds || 10;
      var windMode = ctx.cfg.windMode || 'normal';
      var turn = 0;
      var turnCount = 0;
      var alive = true;
      var timers = [];

      var DIFF = {
        easy:   { maxWind: 155, angleSpd: 1.45, powerSpd: 1.55, waspAmp: 55, waspSpd: 1.6, hitScale: 1.0,  shiftRange: 55, dodgeAmp: 0 },
        normal: { maxWind: 225, angleSpd: 1.95, powerSpd: 2.10, waspAmp: 95, waspSpd: 2.3, hitScale: 0.88, shiftRange: 95, dodgeAmp: 16 },
        gusty:  { maxWind: 285, angleSpd: 2.45, powerSpd: 2.65, waspAmp: 125, waspSpd: 3.1, hitScale: 0.78, shiftRange: 120, dodgeAmp: 28 }
      }[windMode] || { maxWind: 225, angleSpd: 1.95, powerSpd: 2.10, waspAmp: 95, waspSpd: 2.3, hitScale: 0.88, shiftRange: 95, dodgeAmp: 16 };

      function later(fn, ms) {
        var id = setTimeout(function () {
          if (alive) fn();
        }, ms);
        timers.push(id);
        return id;
      }

      if (T.length > 2) T = GM.state.teams = T.slice(0, 2);
      document.body.classList.add('gm-small-pods', 'gm-real3-active');
      ctx.root.innerHTML = '';

      /* Build Stage DOM */
      var wrap = U().h('div', { class: 'gm-real3-scene' });
      var cv = U().h('canvas', { width: String(W), height: String(H), class: 'gm-real3-cv' });
      var turnBanner = U().h('div', { class: 'gm-real3-banner in' });
      var dock = U().h('div', { class: 'gm-real3-dock' });
      wrap.appendChild(cv);
      wrap.appendChild(turnBanner);
      wrap.appendChild(dock);
      ctx.root.appendChild(wrap);

      var g = cv.getContext('2d');
      var art = loadArtAssets();

      /* Render Team Monster Coach Sprites */
      var monImgs = T.map(function (t) {
        var im = new Image();
        try {
          var svg = GM.mon.svg(t.mon, 220);
          if (svg && svg.indexOf('<svg') >= 0) {
            if (svg.indexOf('xmlns=') < 0) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
            im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
          }
        } catch (e) { /* ignore */ }
        return im;
      });

      /* Game State */
      var mode = 'wait';       /* 'wait' | 'aim' | 'fly' | 'payoff' */
      var aimSubPhase = 'angle'; /* 'angle' | 'power' | 'drag' */
      var wind = 0;            /* horizontal acceleration px/s^2 (-285 .. +285) */
      var windGustPhase = 0;
      var activePower = null;  /* null | 'giant' | 'double' | 'bouncy' */

      /* Per-team power-up inventory (1 use of each per match — modifies physics ONLY, never auto-aims!) */
      var teamPowers = [
        { giant: 1, double: 1, bouncy: 1 },
        { giant: 1, double: 1, bouncy: 1 }
      ];

      /* Dynamic Character Positions & Stamina State */
      var charState = [
        { x: BASE_CAT_X, state: 'idle', t0: 0, dizzyUntil: 0, bubble: 'Read the wind! 🧶', hp: 100, hitsTaken: 0, duckOffset: 0 },
        { x: BASE_DOG_X, state: 'idle', t0: 0, dizzyUntil: 0, bubble: 'Try to hit me! 🦴', hp: 100, hitsTaken: 0, duckOffset: 0 }
      ];

      /* Skill Aim State */
      var aimState = {
        dragging: false,
        angleDeg: 45,
        angleOscT: 0,
        power: 0.25,
        powerOscT: 0,
        holdTime: 0,
        startX: 0,
        startY: 0,
        curX: 0,
        curY: 0
      };

      /* Active Projectiles, Particles, Popups, Cans & Patrolling Wasp Hazard */
      var projs = [];
      var parts = [];
      var popups = [];
      var fenceCans = [];
      var bonusStar = { x: FENCE_X, y: 270, r: 34, hit: false, bobPhase: 0 };
      var waspHazard = { x: FENCE_X, baseY: 345, y: 345, r: 34, phase: 0, stingCooldown: 0 };
      var shakeT = 0;
      var shakeMag = 0;
      var freezeDt = 0;

      /* Ambient wind streamers */
      var windStreamers = [];
      for (var ws = 0; ws < 16; ws++) {
        windStreamers.push({
          x: Math.random() * W,
          y: 140 + Math.random() * 490,
          len: 42 + Math.random() * 48,
          spd: 0.75 + Math.random() * 0.55,
          alpha: 0.20 + Math.random() * 0.24
        });
      }

      function addPopup(x, y, text, col, size) {
        popups.push({
          x: x,
          y: y,
          text: text,
          col: col || '#fde047',
          size: size || 40,
          t: 0,
          life: 1.35
        });
      }

      function burstParticles(x, y, col, count, kind) {
        var n = count || 22;
        for (var i = 0; i < n; i++) {
          var a = Math.random() * Math.PI * 2;
          var sp = 120 + Math.random() * 420;
          parts.push({
            x: x,
            y: y,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp - 180,
            r: 4 + Math.random() * 7,
            c: i % 3 === 0 ? '#ffffff' : (i % 3 === 1 ? '#fde047' : col),
            kind: kind || 'circle',
            rot: Math.random() * 6.28,
            vrot: (Math.random() - 0.5) * 12,
            t: 0,
            life: 0.55 + Math.random() * 0.45
          });
        }
      }

      function triggerShake(mag, dur) {
        shakeMag = Math.max(shakeMag, mag || 10);
        shakeT = Math.max(shakeT, dur || 0.25);
      }

      /* Randomize Wind, Target Stance Distance & Fence Props Every Turn */
      function resetTurnEnvironment() {
        /* 1. Strong non-trivial wind every turn */
        var dirSign = Math.random() < 0.5 ? -1 : 1;
        var minW = Math.round(DIFF.maxWind * 0.28);
        wind = dirSign * Math.round(minW + Math.random() * (DIFF.maxWind - minW));
        windGustPhase = Math.random() * 6.28;

        /* 2. Shift both characters forward/back in their yards so players must judge distance */
        var catShift = Math.round((Math.random() * 2 - 1) * DIFF.shiftRange);
        var dogShift = Math.round((Math.random() * 2 - 1) * DIFF.shiftRange);
        charState[0].x = clamp(BASE_CAT_X + catShift, 195, 425);
        charState[1].x = clamp(BASE_DOG_X + dogShift, 1140, 1380);
        charState[0].duckOffset = 0;
        charState[1].duckOffset = 0;

        /* 3. High-altitude Bonus Star Coin (requires risky high lob over the wasp!) */
        bonusStar = {
          x: FENCE_X + (Math.random() * 70 - 35),
          y: 215 + Math.random() * 40,
          r: 32,
          hit: false,
          bobPhase: Math.random() * 6.28
        };

        /* 4. Patrolling Backyard Wasp above the fence */
        waspHazard.baseY = 335 + (Math.random() * 40 - 20);
        waspHazard.stingCooldown = 0;

        /* 5. 3 colorful tin cans perched on the fence top */
        var canColors = ['#ef4444', '#38bdf8', '#f59e0b'];
        fenceCans = [
          { x: FENCE_X - 18, y: FENCE_TOP_Y - 22, vx: 0, vy: 0, rot: 0, vrot: 0, hit: false, col: canColors[0] },
          { x: FENCE_X + 18, y: FENCE_TOP_Y - 22, vx: 0, vy: 0, rot: 0, vrot: 0, hit: false, col: canColors[1] },
          { x: FENCE_X,      y: FENCE_TOP_Y - 58, vx: 0, vy: 0, rot: 0, vrot: 0, hit: false, col: canColors[2] }
        ];
      }
      resetTurnEnvironment();

      /* Coordinate Helpers using dynamic character X */
      function throwOrigin(teamIdx) {
        var isCat = teamIdx === 0;
        return {
          x: charState[teamIdx].x + (isCat ? 52 : -52),
          y: GROUND_Y - 125
        };
      }

      function targetCenter(teamIdx) {
        return {
          x: charState[teamIdx].x,
          y: GROUND_Y - 102 + (charState[teamIdx].duckOffset || 0)
        };
      }

      function toCanvasPt(e) {
        var r = cv.getBoundingClientRect();
        var t = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) || e;
        return {
          x: (t.clientX - r.left) / r.width * W,
          y: (t.clientY - r.top) / r.height * H
        };
      }

      function toScreenPt(wx, wy) {
        var r = cv.getBoundingClientRect();
        return {
          x: r.left + (wx / W) * r.width,
          y: r.top + (wy / H) * r.height
        };
      }

      function flyScoreToPod(startPt, teamIdx, pts, color) {
        if (pts <= 0) return;
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

      function updateBanner(titleText, subText, isHot) {
        var t = T[turn] || T[0];
        turnBanner.style.setProperty('--c', t.color || '#f59e0b');
        turnBanner.classList.add('in');
        turnBanner.classList.toggle('compact', !!isHot);
        turnBanner.innerHTML = '';
        if (t && t.mon) {
          turnBanner.appendChild(U().monFace(t.mon, 38));
        }
        turnBanner.appendChild(U().h('b', { text: titleText }));
        if (subText) {
          turnBanner.appendChild(U().h('span', { class: 'gm-real3-sub', text: subText }));
        }
      }

      /* Compute Launch Velocity Vector from (angleDeg, powerFrac) */
      function computeLaunchVelocity(angleDeg, powerFrac, teamIdx, isOvercharged) {
        var dir = teamIdx === 0 ? 1 : -1;
        var adjAngle = clamp(angleDeg, 18, 80);
        var p = clamp(powerFrac, 0.12, 1.0);
        /* If player overcharged into the red danger zone (>94%), add wild angle/power slip! */
        if (isOvercharged) {
          adjAngle = clamp(adjAngle + (Math.random() < 0.5 ? -9 : 9), 16, 82);
          p = clamp(p * (0.82 + Math.random() * 0.26), 0.2, 1.08);
        }
        var rad = adjAngle * Math.PI / 180;
        var speed = 560 + p * 780; /* 654 .. 1340 px/s */
        return {
          vx: Math.cos(rad) * speed * dir,
          vy: -Math.sin(rad) * speed,
          speed: speed,
          angleDeg: Math.round(adjAngle),
          powerPct: Math.round(p * 100)
        };
      }

      /* Convert pointer drag into manual (angleDeg, power) */
      function updateAimFromPointer(pt) {
        var orig = throwOrigin(turn);
        var dir = turn === 0 ? 1 : -1;
        aimState.curX = pt.x;
        aimState.curY = pt.y;

        var dx = pt.x - orig.x;
        var dy = pt.y - orig.y;
        var dist = Math.hypot(dx, dy);
        if (dist < 12) return;

        var pullX, pullY;
        if (dx * dir < -10) {
          /* Slingshot Pull-Back behind character */
          pullX = -dx * dir;
          pullY = -dy;
        } else if (dx * dir > 20 && dy < 45) {
          /* Forward drag toward fence */
          pullX = dx * dir;
          pullY = -dy;
        } else {
          var rdx = aimState.startX - pt.x;
          var rdy = aimState.startY - pt.y;
          pullX = Math.max(15, Math.abs(rdx));
          pullY = Math.max(15, Math.abs(rdy));
        }

        var rawAngle = Math.atan2(Math.max(12, pullY), Math.max(12, pullX)) * 180 / Math.PI;
        /* High-power hand tremor when holding >80% power */
        var tremor = aimState.power > 0.80 ? Math.sin(performance.now() / 38) * 2.8 : 0;
        aimState.angleDeg = clamp(rawAngle + tremor, 18, 78);
        var pullMag = Math.hypot(pullX, pullY);
        aimState.power = clamp((pullMag - 18) / 235, 0.14, 1.0);
      }

      /* Advance 2-Step Arcade Skill Lock (Step 1: Lock Angle -> Step 2: Lock Power & Fire!) */
      function advanceSkillStep() {
        if (mode !== 'aim') return;
        if (aimSubPhase === 'angle') {
          aimSubPhase = 'power';
          aimState.powerOscT = -Math.PI / 2; /* Start power sweep from bottom 12% */
          aimState.power = 0.12;
          A().play('tap');
          charState[turn].bubble = 'Angle ' + Math.round(aimState.angleDeg) + '° locked! Now time POWER! ⚡';
          updateBanner(
            '⚡ STEP 2: Lock Throw Power! (Angle: ' + Math.round(aimState.angleDeg) + '°)',
            'Watch the Wind (' + formatWindShort() + ') & Rival Distance — tap FIRE when power is right!',
            true
          );
          renderAimDock();
        } else if (aimSubPhase === 'power') {
          fireThrow(aimState.angleDeg, aimState.power);
        }
      }

      /* Fire the Active Throw! */
      function fireThrow(angleDeg, powerFrac) {
        if (mode !== 'aim') return;
        mode = 'fly';
        aimState.dragging = false;
        dock.innerHTML = '';

        var orig = throwOrigin(turn);
        var pwr = activePower;
        if (pwr && teamPowers[turn][pwr] > 0) {
          teamPowers[turn][pwr]--;
        }

        var isOvercharged = powerFrac > 0.94;
        charState[turn].state = 'throw';
        charState[turn].t0 = performance.now();
        charState[turn].bubble = isOvercharged
          ? 'WHOA! OVERCHARGED! 😵'
          : (pwr === 'giant' ? 'HEAVY GIANT! 💪' : (pwr === 'double' ? 'DOUBLE SHOT! ✌️' : (pwr === 'bouncy' ? 'BOUNCY LOB! 💣' : 'FLING! 🎯')));

        if (isOvercharged) {
          addPopup(orig.x, orig.y - 55, '⚠️ OVERCHARGE SLIP!', '#ef4444', 34);
        }

        A().play('whoosh');
        A().play('cannon');
        burstParticles(orig.x, orig.y, T[turn].color, 16);

        var baseVec = computeLaunchVelocity(angleDeg, powerFrac, turn, isOvercharged);
        projs = [];

        if (pwr === 'double') {
          var v1 = computeLaunchVelocity(clamp(angleDeg - 4.5, 18, 78), clamp(powerFrac - 0.04, 0.15, 1), turn, isOvercharged);
          var v2 = computeLaunchVelocity(clamp(angleDeg + 4.5, 18, 78), clamp(powerFrac + 0.04, 0.15, 1), turn, isOvercharged);
          [v1, v2].forEach(function (v, idx) {
            projs.push({
              x: orig.x,
              y: orig.y - idx * 14,
              vx: v.vx,
              vy: v.vy,
              rot: 0,
              r: 28,
              scale: 0.92,
              gravMul: 1.0,
              power: 'double',
              bouncesLeft: 0,
              trail: [],
              done: false
            });
          });
        } else {
          var isGiant = pwr === 'giant';
          var isBouncy = pwr === 'bouncy';
          projs.push({
            x: orig.x,
            y: orig.y,
            vx: baseVec.vx,
            vy: baseVec.vy,
            rot: 0,
            r: isGiant ? 48 : 30,
            scale: isGiant ? 1.55 : 1.0,
            /* Giant throw is heavier (1.18x gravity), so you must throw it harder! */
            gravMul: isGiant ? 1.18 : 1.0,
            power: pwr,
            bouncesLeft: isBouncy ? 2 : 0,
            trail: [],
            done: false
          });
        }

        updateBanner(
          (turn === 0 ? '🧶 Flying Yarn!' : '🦴 Flying Bone!'),
          baseVec.angleDeg + '° Angle · ' + baseVec.powerPct + '% Power · ' + formatWindShort(),
          true
        );
      }

      /* Pointer Events on Canvas */
      function onPointerDown(e) {
        if (mode !== 'aim') return;
        e.preventDefault();
        var pt = toCanvasPt(e);
        aimState.dragging = true;
        aimState.holdTime = 0;
        aimState.startX = pt.x;
        aimState.startY = pt.y;
        aimState.curX = pt.x;
        aimState.curY = pt.y;
        A().play('pull');
      }

      function onPointerMove(e) {
        if (mode !== 'aim' || !aimState.dragging) return;
        e.preventDefault();
        var pt = toCanvasPt(e);
        var dragDist = Math.hypot(pt.x - aimState.startX, pt.y - aimState.startY);
        if (dragDist >= 18) {
          aimSubPhase = 'drag';
          updateAimFromPointer(pt);
        }
      }

      function onPointerUp(e) {
        if (mode !== 'aim' || !aimState.dragging) return;
        e.preventDefault();
        var dragDist = Math.hypot(aimState.curX - aimState.startX, aimState.curY - aimState.startY);
        aimState.dragging = false;
        if (aimSubPhase === 'drag' && dragDist >= 24) {
          fireThrow(aimState.angleDeg, aimState.power);
        } else {
          /* Short tap on canvas advances the 2-step skill lock! */
          advanceSkillStep();
        }
      }

      cv.addEventListener('mousedown', onPointerDown);
      cv.addEventListener('mousemove', onPointerMove);
      w.addEventListener('mouseup', onPointerUp);
      cv.addEventListener('touchstart', onPointerDown, { passive: false });
      cv.addEventListener('touchmove', onPointerMove, { passive: false });
      w.addEventListener('touchend', onPointerUp);

      /* Track round outcomes across projectiles */
      var roundPoints = 0;
      var roundHeadlines = [];
      var hitOpponentThisTurn = false;
      var missReason = '';

      function awardTurnHit(pts, headline, wx, wy, col) {
        roundPoints += pts;
        if (headline && roundHeadlines.indexOf(headline) === -1) {
          roundHeadlines.push(headline);
        }
        addPopup(wx, wy - 45, headline + ' +' + pts, col || '#fde047', 42);
        var sp = toScreenPt(wx, wy);
        flyScoreToPod(sp, turn, pts, T[turn].color);
      }

      function finishTurnFlight() {
        if (mode !== 'fly') return;
        mode = 'payoff';

        if (roundPoints > 0) {
          A().play('coin_collect');
          U().addScore(turn, roundPoints);
          U().wobble(document.getElementById('gm-team-' + turn));
          var summaryTitle = roundHeadlines.join(' + ') || 'Nice Shot!';
          updateBanner(summaryTitle, '+' + roundPoints + ' points for ' + T[turn].name + '!', hitOpponentThisTurn);
        } else {
          /* Real miss consequence: 0 points! */
          A().play('bounce');
          var failMsg = missReason || '💨 Missed Wide! Zero Points!';
          charState[turn].bubble = 'Aw, missed! Next turn! 🎯';
          charState[1 - turn].state = 'cheer';
          charState[1 - turn].bubble = 'Haha! Missed me! 😜';
          updateBanner(failMsg, '0 points — read the wind & distance carefully next turn!', false);
        }

        activePower = null;
        turnCount++;

        later(function () {
          if (!alive) return;
          if (turnCount >= totalTurns) {
            charState[0].state = 'cheer';
            charState[1].state = 'cheer';
            charState[0].bubble = 'Great battle! 🎉';
            charState[1].bubble = 'Awesome match! 🏆';
            updateBanner('🎉 Backyard Battle Complete!', 'Final scores are in!', true);
            U().confetti(45);
            A().play('cheer_kids');
            A().play('crowd_roar_big');
            later(function () {
              if (alive) ctx.end();
            }, 1450);
            return;
          }
          turn = (turn + 1) % 2;
          resetTurnEnvironment();
          showWaitTurn();
        }, 1450);
      }

      /* Physics Step for Projectiles */
      function stepProjectiles(dt, now) {
        var opp = 1 - turn;
        /* Active rival ducking in Normal/Gusty modes when projectile approaches */
        if (DIFF.dodgeAmp > 0 && projs.length > 0) {
          var leadP = projs[0];
          var distToOpp = Math.abs(leadP.x - charState[opp].x);
          if (distToOpp < 380 && !leadP.done) {
            charState[opp].duckOffset = Math.max(0, Math.sin(now / 140) * DIFF.dodgeAmp);
          } else {
            charState[opp].duckOffset = 0;
          }
        }

        var oppCenter = targetCenter(opp);
        var oppHead = { x: oppCenter.x, y: oppCenter.y - 54 };
        var oppPropX = opp === 0 ? charState[0].x - 105 : charState[1].x + 215;
        var oppPropY = GROUND_Y - 76;

        /* Live gust oscillation in Gusty/Normal modes */
        var gustOsc = Math.sin(now / 380 + windGustPhase) * (windMode === 'gusty' ? 55 : (windMode === 'normal' ? 25 : 0));
        var effWind = (activePower === 'giant' ? wind * 0.55 : wind) + gustOsc;

        var anyActive = false;

        projs.forEach(function (pr) {
          if (pr.done) return;
          anyActive = true;

          pr.vx += effWind * dt;
          pr.vy += (GRAVITY * (pr.gravMul || 1.0)) * dt;
          pr.x += pr.vx * dt;
          pr.y += pr.vy * dt;
          pr.rot += (pr.vx >= 0 ? 1 : -1) * 11 * dt;

          pr.trail.push({ x: pr.x, y: pr.y });
          if (pr.trail.length > 22) pr.trail.shift();

          /* 1. Check Patrolling Backyard Wasp Hazard above the fence! */
          if (waspHazard.stingCooldown <= 0 && Math.hypot(pr.x - waspHazard.x, pr.y - waspHazard.y) < waspHazard.r + pr.r * 0.65) {
            waspHazard.stingCooldown = 1.2;
            triggerShake(10, 0.25);
            A().play('peg');
            burstParticles(waspHazard.x, waspHazard.y, '#facc15', 22);
            addPopup(waspHazard.x, waspHazard.y - 34, '🐝 WASP DEFLECT!', '#ef4444', 36);
            missReason = '🐝 Deflected by the Backyard Wasp!';
            pr.vx = -pr.vx * 0.45;
            pr.vy = Math.abs(pr.vy) * 0.35 + 180;
            pr.bouncesLeft = 0;
          }

          /* 2. Check High-Altitude Floating Bonus Star (+15 pts, non-stopping!) */
          if (!bonusStar.hit && Math.hypot(pr.x - bonusStar.x, pr.y - bonusStar.y) < bonusStar.r + pr.r * 0.7) {
            bonusStar.hit = true;
            A().play('star');
            burstParticles(bonusStar.x, bonusStar.y, '#fde047', 26);
            awardTurnHit(15, '⭐ High Star!', bonusStar.x, bonusStar.y, '#fde047');
          }

          /* 3. Check Fence-Top Tin Cans (+10 pts) */
          fenceCans.forEach(function (can) {
            if (!can.hit && Math.hypot(pr.x - can.x, pr.y - can.y) < pr.r + 20) {
              can.hit = true;
              can.vx = pr.vx * 0.45 + (Math.random() - 0.5) * 180;
              can.vy = -260 - Math.random() * 140;
              can.vrot = (Math.random() - 0.5) * 18;
              A().play('peg');
              burstParticles(can.x, can.y, can.col, 14);
              awardTurnHit(10, '🥫 Can Smash!', can.x, can.y, '#38bdf8');
            }
          });

          /* 4. Check Precision Headshot OR Body Hit on Opposing Cat / Dog */
          var headRadius = 38 * DIFF.hitScale + (pr.scale > 1.2 ? 12 : 0);
          var bodyRadius = 60 * DIFF.hitScale + (pr.scale > 1.2 ? 16 : 0);
          var isHeadshot = Math.hypot(pr.x - oppHead.x, pr.y - oppHead.y) < headRadius;
          var isBodyHit = !isHeadshot && Math.hypot(pr.x - oppCenter.x, pr.y - oppCenter.y) < bodyRadius;

          if (isHeadshot || isBodyHit) {
            pr.done = true;
            hitOpponentThisTurn = true;
            var hitPts = isHeadshot ? 35 : (pr.power === 'giant' ? 30 : 25);
            var hpDmg = isHeadshot ? 45 : (pr.power === 'giant' ? 40 : 30);
            var hitLabel = isHeadshot ? '🎯 HEADSHOT!' : (pr.power === 'giant' ? '💥 GIANT BONK!' : '🎯 DIRECT HIT!');

            freezeDt = isHeadshot ? 0.085 : 0.055;
            triggerShake(isHeadshot ? 18 : 12, 0.35);
            A().play('whack_pop');
            A().play('cheer_kids');
            U().confetti(isHeadshot ? 36 : 24);
            burstParticles(pr.x, pr.y, T[turn].color, 34);

            charState[turn].state = 'cheer';
            charState[turn].bubble = isHeadshot ? 'HEADSHOT!! 🔥' : 'BULLSEYE! 🎉';
            charState[opp].state = 'hit';
            charState[opp].dizzyUntil = performance.now() + 2400;
            charState[opp].hitsTaken++;
            charState[opp].hp = Math.max(0, charState[opp].hp - hpDmg);
            charState[opp].bubble = opp === 0 ? 'MEOWCH! 🙀💫' : 'RUFF! 🐶💫';

            awardTurnHit(hitPts, hitLabel, pr.x, pr.y - 30, '#fde047');

            /* Yard Knockout Bonus if opponent HP reaches 0! */
            if (charState[opp].hp <= 0) {
              charState[opp].hp = 100;
              awardTurnHit(30, '🥊 YARD KNOCKOUT!', oppCenter.x, oppCenter.y - 95, '#f43f5e');
            }
            return;
          }

          /* 5. Check Rival Yard Prop Hit (Doghouse / Yarn Basket, +10 pts) */
          if (Math.hypot(pr.x - oppPropX, pr.y - oppPropY) < 62 + pr.r * 0.3) {
            pr.done = true;
            triggerShake(8, 0.2);
            A().play('hit');
            burstParticles(pr.x, pr.y, '#fb923c', 20);
            charState[turn].state = 'cheer';
            charState[opp].bubble = 'Watch my ' + (opp === 0 ? 'basket!' : 'doghouse!') + ' 🐾';
            awardTurnHit(10, opp === 0 ? '🧶 Basket Hit!' : '🏠 Doghouse Hit!', pr.x, pr.y - 25, '#fb923c');
            return;
          }

          /* 6. Check Center Wooden Fence Collision (0 pts unless Bouncy!) */
          if (Math.abs(pr.x - FENCE_X) < FENCE_HALF_W + pr.r * 0.5 && pr.y > FENCE_TOP_Y) {
            triggerShake(9, 0.22);
            A().play('peg');
            burstParticles(pr.x, pr.y, '#d97706', 18);
            if (pr.bouncesLeft > 0) {
              pr.bouncesLeft--;
              pr.vx = -pr.vx * 0.55;
              pr.vy = -Math.abs(pr.vy) * 0.55 - 170;
              pr.x = pr.x < FENCE_X ? FENCE_X - FENCE_HALF_W - pr.r : FENCE_X + FENCE_HALF_W + pr.r;
              addPopup(pr.x, pr.y - 30, 'BOING! 💣', '#f59e0b', 34);
            } else {
              pr.done = true;
              missReason = '🪵 Blocked by the Center Fence!';
              charState[opp].bubble = 'Blocked by the fence! 🪵';
              addPopup(pr.x, pr.y - 25, '🪵 FENCE BLOCK! (0)', '#ef4444', 34);
            }
            return;
          }

          /* 7. Check Ground / Out of Bounds */
          if (pr.y >= GROUND_Y - 12 || pr.x < -80 || pr.x > W + 80) {
            var clampX = clamp(pr.x, 80, W - 80);
            var clampY = Math.min(pr.y, GROUND_Y - 12);
            if (pr.bouncesLeft > 0 && pr.x > 60 && pr.x < W - 60) {
              pr.bouncesLeft--;
              pr.y = GROUND_Y - 14;
              pr.vy = -Math.abs(pr.vy) * 0.60 - 135;
              pr.vx *= 0.80;
              A().play('peg');
              burstParticles(clampX, clampY, '#4ade80', 12);
              addPopup(clampX, clampY - 30, 'BOUNCE! 💣', '#4ade80', 32);
              return;
            }
            pr.done = true;
            A().play('hit');
            burstParticles(clampX, clampY, '#4ade80', 16);
            var footDist = Math.abs(clampX - oppCenter.x);
            if (footDist < 52 * DIFF.hitScale) {
              charState[opp].hp = Math.max(10, charState[opp].hp - 12);
              awardTurnHit(10, '🌿 Grazing Splash!', clampX, clampY - 25, '#4ade80');
            } else if (roundPoints === 0) {
              var shortOfFence = (turn === 0 && clampX < FENCE_X) || (turn === 1 && clampX > FENCE_X);
              missReason = shortOfFence
                ? '💨 Fell Short in Your Own Yard!'
                : (clampX < oppCenter.x ? '💨 Landed Left of Target!' : '💨 Overshot Past Target!');
              addPopup(clampX, clampY - 28, 'MISS! (0)', '#94a3b8', 32);
            }
          }
        });

        /* Step knocked tin cans */
        fenceCans.forEach(function (can) {
          if (can.hit && can.y < GROUND_Y + 40) {
            can.vy += GRAVITY * dt;
            can.x += can.vx * dt;
            can.y += can.vy * dt;
            can.rot += can.vrot * dt;
          }
        });

        if (!anyActive && projs.length > 0) {
          finishTurnFlight();
        }
      }

      function formatWindShort() {
        var lvl = Math.max(1, Math.min(10, Math.round(Math.abs(wind) / 26)));
        return wind < 0 ? ('◄◄ WIND ' + lvl) : ('WIND ' + lvl + ' ►►');
      }

      /* ======================================================================
         SCENE RENDERING PIPELINE (Full 1600x900 Backyard Panorama)
         ====================================================================== */
      function drawBackyardScene(now) {
        if (imgReady(art.bgYards)) {
          g.drawImage(art.bgYards, 0, 0, W, H);
        } else {
          var skyGr = g.createLinearGradient(0, 0, 0, H);
          skyGr.addColorStop(0, '#38bdf8');
          skyGr.addColorStop(0.55, '#bae6fd');
          skyGr.addColorStop(0.56, '#4ade80');
          skyGr.addColorStop(1, '#15803d');
          g.fillStyle = skyGr;
          g.fillRect(0, 0, W, H);
        }

        /* Subtle top & bottom vignette */
        var topVig = g.createLinearGradient(0, 0, 0, 145);
        topVig.addColorStop(0, 'rgba(6, 9, 17, 0.38)');
        topVig.addColorStop(1, 'rgba(6, 9, 17, 0)');
        g.fillStyle = topVig;
        g.fillRect(0, 0, W, 145);

        var botVig = g.createLinearGradient(0, H - 130, 0, H);
        botVig.addColorStop(0, 'rgba(6, 9, 17, 0)');
        botVig.addColorStop(1, 'rgba(6, 9, 17, 0.44)');
        g.fillStyle = botVig;
        g.fillRect(0, H - 130, W, 130);

        /* Animated Wind Streamer Lines across the sky */
        if (Math.abs(wind) >= 15) {
          g.save();
          g.lineCap = 'round';
          g.lineWidth = 3;
          windStreamers.forEach(function (ws) {
            ws.x += (wind * 1.45 * ws.spd) * 0.016;
            if (ws.x > W + 100) ws.x = -100;
            if (ws.x < -100) ws.x = W + 100;
            g.strokeStyle = 'rgba(255, 255, 255, ' + ws.alpha + ')';
            g.beginPath();
            g.moveTo(ws.x, ws.y);
            g.lineTo(ws.x + (wind > 0 ? ws.len : -ws.len), ws.y + Math.sin(now / 260 + ws.y) * 4);
            g.stroke();
          });
          g.restore();
        }

        /* Yard Props: Cat's Yarn Basket (Left) & Dog's Doghouse (Right) */
        var yarnX = charState[0].x - 105;
        var yarnY = GROUND_Y - 12;
        g.fillStyle = 'rgba(15, 23, 42, 0.28)';
        g.beginPath();
        g.ellipse(yarnX, yarnY + 4, 58, 14, 0, 0, Math.PI * 2);
        g.fill();
        if (imgReady(art.yarn)) {
          g.drawImage(art.yarn, yarnX - 54, yarnY - 68, 72, 72);
          g.drawImage(art.yarn, yarnX - 8, yarnY - 62, 66, 66);
          g.drawImage(art.yarn, yarnX - 30, yarnY - 96, 64, 64);
        }

        var dhX = charState[1].x + 215;
        var dhY = GROUND_Y - 36;
        g.fillStyle = 'rgba(15, 23, 42, 0.30)';
        g.beginPath();
        g.ellipse(dhX, dhY + 6, 82, 18, 0, 0, Math.PI * 2);
        g.fill();
        if (imgReady(art.doghouse)) {
          g.drawImage(art.doghouse, dhX - 92, dhY - 172, 184, 180);
        }
      }

      /* Draw Fence Extension, Tin Cans, Patrolling Wasp & Floating Bonus Star */
      function drawFenceAndHazards(now, dt) {
        /* Wooden Fence Top Extension so the taller fence barrier is clearly visible */
        g.save();
        roundRect(g, FENCE_X - 22, FENCE_TOP_Y, 44, GROUND_Y - FENCE_TOP_Y - 10, 8);
        var woodGr = g.createLinearGradient(FENCE_X - 22, 0, FENCE_X + 22, 0);
        woodGr.addColorStop(0, '#92400e');
        woodGr.addColorStop(0.5, '#d97706');
        woodGr.addColorStop(1, '#78350f');
        g.fillStyle = woodGr;
        g.fill();
        g.lineWidth = 3;
        g.strokeStyle = '#451a03';
        g.stroke();
        g.restore();

        /* Tin Cans on top of the wooden dividing fence */
        fenceCans.forEach(function (can) {
          g.save();
          g.translate(can.x, can.y);
          g.rotate(can.rot);
          roundRect(g, -15, -20, 30, 40, 6);
          g.fillStyle = can.col;
          g.fill();
          g.lineWidth = 2.5;
          g.strokeStyle = '#0f172a';
          g.stroke();
          g.fillStyle = 'rgba(255,255,255,0.85)';
          g.fillRect(-13, -6, 26, 12);
          g.fillStyle = '#e2e8f0';
          g.fillRect(-16, -20, 32, 5);
          g.fillRect(-16, 15, 32, 5);
          g.restore();
        });

        /* Patrolling Backyard Wasp Hazard above the Fence */
        waspHazard.phase += dt * DIFF.waspSpd;
        if (waspHazard.stingCooldown > 0) waspHazard.stingCooldown = Math.max(0, waspHazard.stingCooldown - dt);
        waspHazard.x = FENCE_X + Math.sin(waspHazard.phase * 0.7) * 32;
        waspHazard.y = waspHazard.baseY + Math.sin(waspHazard.phase) * DIFF.waspAmp;

        g.save();
        g.translate(waspHazard.x, waspHazard.y);
        /* Danger zone ring */
        g.beginPath();
        g.arc(0, 0, waspHazard.r, 0, Math.PI * 2);
        g.fillStyle = 'rgba(239, 68, 68, 0.16)';
        g.fill();
        g.lineWidth = 2;
        g.setLineDash([5, 5]);
        g.strokeStyle = 'rgba(239, 68, 68, 0.65)';
        g.stroke();
        g.setLineDash([]);
        /* Fluttering wings */
        var wingFlap = Math.sin(now / 28) * 10;
        g.fillStyle = 'rgba(224, 242, 254, 0.85)';
        g.beginPath();
        g.ellipse(-10, -14 - wingFlap * 0.3, 16, 9, -0.4, 0, Math.PI * 2);
        g.ellipse(10, -14 + wingFlap * 0.3, 16, 9, 0.4, 0, Math.PI * 2);
        g.fill();
        /* Striped Wasp Body */
        g.beginPath();
        g.ellipse(0, 0, 22, 15, 0, 0, Math.PI * 2);
        g.fillStyle = '#facc15';
        g.fill();
        g.lineWidth = 3;
        g.strokeStyle = '#0f172a';
        g.stroke();
        g.fillStyle = '#0f172a';
        g.fillRect(-8, -13, 6, 26);
        g.fillRect(4, -12, 6, 24);
        drawOutlinedText(g, '🐝 HAZARD', 0, 32, 15, '#fca5a5', '#090d16');
        g.restore();

        /* High-Altitude Bonus Star Coin above the Wasp */
        if (!bonusStar.hit) {
          var bobY = bonusStar.y + Math.sin(now / 260 + bonusStar.bobPhase) * 9;
          g.save();
          g.translate(bonusStar.x, bobY);
          var halo = g.createRadialGradient(0, 0, 6, 0, 0, 48);
          halo.addColorStop(0, 'rgba(250, 204, 21, 0.65)');
          halo.addColorStop(1, 'rgba(250, 204, 21, 0)');
          g.fillStyle = halo;
          g.beginPath();
          g.arc(0, 0, 48, 0, Math.PI * 2);
          g.fill();

          if (imgReady(art.starCoin)) {
            g.drawImage(art.starCoin, -34, -34, 68, 68);
          } else {
            g.fillStyle = '#facc15';
            g.beginPath();
            g.arc(0, 0, 28, 0, Math.PI * 2);
            g.fill();
          }
          drawOutlinedText(g, '+15', 0, 42, 20, '#fde047', '#0f172a');
          g.restore();
        }
      }

      /* Draw Cat, Dog, Team Monster Coaches & Stamina HUD Cards */
      function drawCharacters(now) {
        [0, 1].forEach(function (idx) {
          var isCat = idx === 0;
          var st = charState[idx];
          var baseX = st.x;
          var baseY = GROUND_Y;
          var isTurn = turn === idx && (mode === 'wait' || mode === 'aim');
          var isDizzy = now < st.dizzyUntil;

          /* Active Turn Spotlight Ring on the Grass */
          g.save();
          g.beginPath();
          g.ellipse(baseX, baseY - 4, 86, 22, 0, 0, Math.PI * 2);
          g.fillStyle = isTurn ? (isCat ? 'rgba(251, 146, 60, 0.35)' : 'rgba(56, 189, 248, 0.35)') : 'rgba(6, 9, 17, 0.36)';
          g.fill();
          if (isTurn) {
            g.lineWidth = 4;
            g.strokeStyle = isCat ? '#fb923c' : '#38bdf8';
            g.stroke();
          }
          g.restore();

          /* Draw Team Monster Coach beside the animal */
          var coachX = isCat ? baseX - 165 : baseX + 125;
          var coachY = baseY - 8;
          var coachBob = Math.sin(now / 240 + idx * 2) * 5 + (st.state === 'cheer' ? Math.abs(Math.sin(now / 110)) * -18 : 0);
          g.fillStyle = 'rgba(6, 9, 17, 0.32)';
          g.beginPath();
          g.ellipse(coachX, coachY, 44, 12, 0, 0, Math.PI * 2);
          g.fill();

          if (imgReady(monImgs[idx])) {
            g.save();
            g.translate(coachX, coachY + coachBob);
            g.drawImage(monImgs[idx], -58, -112, 116, 116);
            g.restore();
          }

          /* Compute Animal Bounce / Squash-Stretch / Ducking / Dizzy Wobble */
          var sx = 1, sy = 1, dy = st.duckOffset || 0, rot = 0;
          var breath = Math.sin(now / 260 + idx * 1.7);
          if (st.state === 'cheer') {
            dy = -Math.abs(Math.sin(now / 130)) * 24;
            sx = 1 + Math.sin(now / 130) * 0.06;
            sy = 1 - Math.sin(now / 130) * 0.06;
          } else if (st.state === 'throw') {
            var dtThrow = (now - st.t0) / 1000;
            if (dtThrow < 0.38) {
              sx = 1.12 - dtThrow * 0.25;
              sy = 0.90 + dtThrow * 0.25;
              rot = (isCat ? 0.14 : -0.14) * (1 - dtThrow / 0.38);
            }
          } else if (isDizzy) {
            rot = Math.sin(now / 75) * 0.12;
            sx = 1.05;
            sy = 0.94;
          } else if (mode === 'aim' && turn === idx && (aimSubPhase === 'power' || aimState.dragging)) {
            rot = (isCat ? -1 : 1) * aimState.power * 0.15;
            sx = 1 + aimState.power * 0.05;
            sy = 1 - aimState.power * 0.05;
          } else {
            sx = 1 + breath * 0.022;
            sy = 1 - breath * 0.022 - (st.duckOffset ? 0.08 : 0);
            dy += -Math.abs(breath) * 4;
          }

          var useCheer = st.state === 'cheer';
          var rawSpr = isCat
            ? (useCheer ? (art.catCheerClean || art.catCheer) : (art.catReadyClean || art.catReady))
            : (useCheer ? (art.dogCheerClean || art.dogCheer) : (art.dogReadyClean || art.dogReady));

          g.save();
          g.translate(baseX, baseY + dy);
          g.rotate(rot);
          g.scale(sx, sy);
          var charW = 210, charH = 210;
          if (imgReady(rawSpr)) {
            g.drawImage(rawSpr, -charW / 2, -charH + 10, charW, charH);
          }
          g.restore();

          /* Dizzy Spinning Stars when bonked! */
          if (isDizzy) {
            g.save();
            g.translate(baseX, baseY - 210);
            for (var s = 0; s < 3; s++) {
              var sa = (now / 180) + (s * Math.PI * 2 / 3);
              var sxStar = Math.cos(sa) * 48;
              var syStar = Math.sin(sa) * 14;
              drawOutlinedText(g, '⭐', sxStar, syStar, 24, '#fde047', '#0f172a');
            }
            g.restore();
          }

          /* Comic Speech Bubble */
          if (st.bubble) {
            var bx = baseX + (isCat ? -10 : 10);
            var by = baseY - 242;
            g.save();
            g.font = '800 18px "Fredoka", "Nunito", sans-serif';
            var bw = Math.max(136, g.measureText(st.bubble).width + 34);
            roundRect(g, bx - bw / 2, by - 22, bw, 42, 20);
            g.fillStyle = 'rgba(255, 255, 255, 0.96)';
            g.fill();
            g.lineWidth = 3.5;
            g.strokeStyle = T[idx] ? T[idx].color : (isCat ? '#fb923c' : '#38bdf8');
            g.stroke();
            g.fillStyle = '#0f172a';
            g.textAlign = 'center';
            g.textBaseline = 'middle';
            g.fillText(st.bubble, bx, by - 1);
            g.restore();
          }

          /* Clean Team Plate + HP Bar + Distance Marker under Character */
          var plateW = 220, plateH = 54;
          var px = baseX - plateW / 2;
          var py = baseY + 14;
          g.save();
          roundRect(g, px, py, plateW, plateH, 16);
          g.fillStyle = 'rgba(15, 23, 42, 0.92)';
          g.fill();
          g.lineWidth = 3.5;
          g.strokeStyle = T[idx] ? T[idx].color : (isCat ? '#fb923c' : '#38bdf8');
          g.stroke();

          var distFromFence = Math.round(Math.abs(baseX - FENCE_X) / 10);
          var teamLabel = (isCat ? '🐱 ' : '🐶 ') + (T[idx] ? T[idx].name : ('Team ' + (idx + 1))) + ' (' + distFromFence + 'm)';
          drawOutlinedText(g, teamLabel, baseX, py + 19, 18, '#ffffff', '#090d16');

          var barW = plateW - 36, barH = 9;
          var bxBar = baseX - barW / 2, byBar = py + 37;
          roundRect(g, bxBar, byBar, barW, barH, 5);
          g.fillStyle = 'rgba(255,255,255,0.18)';
          g.fill();
          var hpFrac = clamp(st.hp / 100, 0.05, 1);
          roundRect(g, bxBar, byBar, barW * hpFrac, barH, 5);
          g.fillStyle = hpFrac > 0.5 ? '#22c55e' : (hpFrac > 0.25 ? '#f59e0b' : '#ef4444');
          g.fill();
          g.restore();
        });
      }

      /* Draw Classic "Cat vs Dog" Top-Center Wind Meter Bar */
      function drawClassicWindMeter(now) {
        var cx = FENCE_X;
        var cy = 176;
        var boxW = 365, boxH = 58;

        g.save();
        roundRect(g, cx - boxW / 2, cy - boxH / 2, boxW, boxH, 29);
        g.fillStyle = 'rgba(15, 23, 42, 0.92)';
        g.fill();
        g.lineWidth = 3;
        g.strokeStyle = Math.abs(wind) > 180 ? '#f43f5e' : 'rgba(148, 163, 184, 0.65)';
        g.stroke();

        var windLvl = Math.max(1, Math.min(10, Math.round(Math.abs(wind) / 26)));
        var windDesc = wind < 0
          ? ('◄◄ STRONG WIND ' + windLvl + ' (LEFT)')
          : ('STRONG WIND ' + windLvl + ' (RIGHT) ►►');
        var labelCol = wind < 0 ? '#38bdf8' : '#fbbf24';
        drawOutlinedText(g, '💨 ' + windDesc, cx, cy - 10, 17, labelCol, '#090d16');

        /* Bidirectional Center-Zero Gauge Track */
        var trackW = 280, trackH = 12;
        var tx = cx - trackW / 2, ty = cy + 10;
        roundRect(g, tx, ty, trackW, trackH, 6);
        g.fillStyle = 'rgba(255, 255, 255, 0.16)';
        g.fill();

        var frac = clamp(wind / 260, -1, 1);
        var fillW = Math.abs(frac) * (trackW / 2);
        var fillX = frac > 0 ? cx : cx - fillW;
        roundRect(g, fillX, ty, fillW, trackH, 5);
        g.fillStyle = frac > 0 ? '#f59e0b' : '#38bdf8';
        g.fill();

        g.fillStyle = '#ffffff';
        g.fillRect(cx - 1.5, ty - 2, 3, trackH + 4);
        g.restore();
      }

      /* Draw Skill Aim Overlay: Short Muzzle Pointer ONLY + Live Angle/Power Meters (NO Cheat Arc!) */
      function drawAimOverlay() {
        if (mode !== 'aim') return;
        var orig = throwOrigin(turn);
        var dir = turn === 0 ? 1 : -1;
        var rad = clamp(aimState.angleDeg, 18, 80) * Math.PI / 180;
        var teamCol = T[turn] ? T[turn].color : '#f59e0b';

        g.save();

        /* 1. Protractor Angle Dial around Throw Hand */
        var ringR = 72;
        g.beginPath();
        var aStart = turn === 0 ? -80 * Math.PI / 180 : (Math.PI + 18 * Math.PI / 180);
        var aEnd = turn === 0 ? -18 * Math.PI / 180 : (Math.PI + 80 * Math.PI / 180);
        g.arc(orig.x, orig.y, ringR, aStart, aEnd, false);
        g.lineWidth = 6;
        g.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        g.stroke();

        /* Active angle ray & 4 short muzzle dots (MAX 112px — never crosses the fence!) */
        for (var i = 1; i <= 4; i++) {
          var dist = i * 28;
          var px = orig.x + Math.cos(rad) * dist * dir;
          var py = orig.y - Math.sin(rad) * dist;
          var rDot = 10 - i * 1.4;
          g.beginPath();
          g.arc(px, py, rDot, 0, Math.PI * 2);
          g.fillStyle = i === 4 ? '#fde047' : teamCol;
          g.fill();
          g.lineWidth = 2.5;
          g.strokeStyle = '#ffffff';
          g.stroke();
        }

        /* If dragging manually, draw slingshot band to finger */
        if (aimState.dragging && aimSubPhase === 'drag') {
          g.beginPath();
          g.moveTo(orig.x, orig.y);
          g.lineTo(aimState.curX, aimState.curY);
          g.lineWidth = 5;
          g.strokeStyle = 'rgba(253, 224, 71, 0.85)';
          g.setLineDash([8, 6]);
          g.stroke();
          g.setLineDash([]);
        }

        /* 2. Classic Vertical "Cat vs Dog" Power Charge Bar in front of the Character */
        var barW = 26, barH = 148;
        var barX = orig.x + (turn === 0 ? 112 : -138);
        var barY = orig.y - 82;
        roundRect(g, barX, barY, barW, barH, 13);
        g.fillStyle = 'rgba(15, 23, 42, 0.92)';
        g.fill();
        g.lineWidth = 3;
        g.strokeStyle = '#ffffff';
        g.stroke();

        /* Power fill from bottom of bar */
        var pFrac = clamp(aimState.power, 0.08, 1.0);
        var fillH = Math.round((barH - 8) * pFrac);
        var fillY = barY + barH - 4 - fillH;
        var pGr = g.createLinearGradient(0, barY + barH, 0, barY);
        pGr.addColorStop(0, '#22c55e');
        pGr.addColorStop(0.65, '#f59e0b');
        pGr.addColorStop(0.92, '#ef4444');
        pGr.addColorStop(1, '#dc2626');
        roundRect(g, barX + 4, fillY, barW - 8, fillH, 9);
        g.fillStyle = pGr;
        g.fill();

        /* Overcharge danger line at 94% */
        var dangerY = barY + Math.round(barH * 0.08);
        g.strokeStyle = '#ef4444';
        g.lineWidth = 2;
        g.beginPath();
        g.moveTo(barX - 4, dangerY);
        g.lineTo(barX + barW + 4, dangerY);
        g.stroke();

        drawOutlinedText(g, 'PWR', barX + barW / 2, barY + barH + 16, 15, '#fde047', '#090d16');

        /* 3. Live Angle & Power Readout Pill above the Power Bar */
        var badgeX = orig.x + (turn === 0 ? 125 : -125);
        var badgeY = barY - 28;
        roundRect(g, badgeX - 102, badgeY - 20, 204, 40, 20);
        g.fillStyle = 'rgba(15, 23, 42, 0.94)';
        g.fill();
        g.lineWidth = 3;
        g.strokeStyle = aimSubPhase === 'angle' ? '#38bdf8' : '#f59e0b';
        g.stroke();
        var readout = Math.round(aimState.angleDeg) + '° ANGLE · ' + Math.round(aimState.power * 100) + '% PWR';
        drawOutlinedText(g, readout, badgeX, badgeY, 17, '#ffffff', '#090d16');

        g.restore();
      }

      /* Draw Flying Projectiles & Comet Trails */
      function drawProjectiles() {
        var spr = turn === 0 ? art.yarn : art.bone;

        projs.forEach(function (pr) {
          for (var i = 0; i < pr.trail.length; i++) {
            var pt = pr.trail[i];
            var frac = (i + 1) / pr.trail.length;
            g.beginPath();
            g.arc(pt.x, pt.y, frac * 13 * pr.scale, 0, Math.PI * 2);
            g.fillStyle = turn === 0
              ? 'rgba(251, 146, 60, ' + (frac * 0.45) + ')'
              : 'rgba(56, 189, 248, ' + (frac * 0.45) + ')';
            g.fill();
          }

          if (pr.done) return;

          var hRatio = clamp(1 - (GROUND_Y - pr.y) / 650, 0.2, 1);
          g.fillStyle = 'rgba(6, 9, 17, ' + (0.32 * hRatio) + ')';
          g.beginPath();
          g.ellipse(pr.x, GROUND_Y - 4, 26 * hRatio * pr.scale, 8 * hRatio * pr.scale, 0, 0, Math.PI * 2);
          g.fill();

          g.save();
          g.translate(pr.x, pr.y);
          g.rotate(pr.rot);
          g.scale(pr.scale, pr.scale);
          if (imgReady(spr)) {
            g.drawImage(spr, -38, -38, 76, 76);
          } else {
            g.fillStyle = turn === 0 ? '#ef4444' : '#f8fafc';
            g.beginPath();
            g.arc(0, 0, 28, 0, Math.PI * 2);
            g.fill();
          }
          g.restore();
        });
      }

      /* Main 60fps Render & Physics Loop */
      var lastT = performance.now();
      var raf = 0;

      function frame(now) {
        if (!alive) return;
        var rawDt = Math.min(0.05, (now - lastT) / 1000);
        lastT = now;

        if (freezeDt > 0) {
          freezeDt -= rawDt;
          raf = requestAnimationFrame(frame);
          return;
        }

        /* Step 2-Phase Oscillating Skill Gauges during Aim */
        if (mode === 'aim' && !aimState.dragging) {
          if (aimSubPhase === 'angle') {
            aimState.angleOscT += rawDt * DIFF.angleSpd;
            /* Sweep smoothly between 20 deg and 76 deg */
            aimState.angleDeg = 48 + Math.sin(aimState.angleOscT) * 28;
          } else if (aimSubPhase === 'power') {
            aimState.powerOscT += rawDt * DIFF.powerSpd;
            /* Surge between 12% and 100% */
            aimState.power = 0.56 + Math.sin(aimState.powerOscT) * 0.44;
          }
        }

        if (mode === 'fly') {
          stepProjectiles(rawDt, now);
        }

        parts = parts.filter(function (p) {
          p.t += rawDt;
          p.vy += 880 * rawDt;
          p.x += p.vx * rawDt;
          p.y += p.vy * rawDt;
          p.rot += p.vrot * rawDt;
          return p.t < p.life;
        });

        popups = popups.filter(function (pop) {
          pop.t += rawDt;
          return pop.t < pop.life;
        });

        var sx = 0, sy = 0;
        if (shakeT > 0) {
          shakeT = Math.max(0, shakeT - rawDt);
          sx = (Math.random() - 0.5) * 2 * shakeMag;
          sy = (Math.random() - 0.5) * 2 * shakeMag;
          if (shakeT === 0) shakeMag = 0;
        }

        g.clearRect(0, 0, W, H);
        g.save();
        g.translate(sx, sy);

        drawBackyardScene(now);
        drawFenceAndHazards(now, rawDt);
        drawCharacters(now);
        drawAimOverlay();
        drawProjectiles();

        parts.forEach(function (p) {
          g.save();
          g.globalAlpha = Math.max(0, 1 - p.t / p.life);
          g.fillStyle = p.c;
          g.beginPath();
          g.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          g.fill();
          g.restore();
        });

        popups.forEach(function (pop) {
          var sc = pop.t < 0.18 ? (0.55 + (pop.t / 0.18) * 0.55) : 1.05;
          var alpha = pop.t > pop.life - 0.3 ? Math.max(0, (pop.life - pop.t) / 0.3) : 1;
          g.save();
          g.globalAlpha = alpha;
          g.translate(pop.x, pop.y - pop.t * 42);
          g.scale(sc, sc);
          drawOutlinedText(g, pop.text, 0, 0, pop.size, pop.col, '#090d16');
          g.restore();
        });

        g.restore();

        drawClassicWindMeter(now);

        raf = requestAnimationFrame(frame);
      }
      raf = requestAnimationFrame(frame);

      /* ======================================================================
         TURN FLOW & SKILL DOCK CONTROLS (ZERO AUTO-THROW BUTTONS!)
         ====================================================================== */
      function renderAimDock() {
        dock.innerHTML = '';
        var pBag = teamPowers[turn];

        /* 1. Tactical Power-Up Modifiers (1 use each per match — NO auto-aim!) */
        var powerDefs = [
          { id: 'giant',  label: '💪 Heavy Giant' },
          { id: 'double', label: '✌️ Double Shot' },
          { id: 'bouncy', label: '💣 Bouncy Bomb' }
        ];

        powerDefs.forEach(function (pw) {
          var leftCount = pBag[pw.id] || 0;
          var isSel = activePower === pw.id;
          var btn = U().h('button', {
            type: 'button',
            class: 'gm-real3-btn sm ' + (isSel ? 'amber pulse' : (leftCount > 0 ? 'cyan' : 'coral')),
            text: pw.label + (leftCount > 0 ? ' (x' + leftCount + ')' : ' (0)')
          });
          if (leftCount <= 0) {
            btn.disabled = true;
            btn.style.opacity = '0.42';
          } else {
            btn.addEventListener('click', function () {
              A().play('tap');
              activePower = (activePower === pw.id) ? null : pw.id;
              charState[turn].bubble = activePower ? (pw.label + ' armed!') : 'Lock angle & power!';
              renderAimDock();
            });
          }
          dock.appendChild(btn);
        });

        /* 2. Single Skill-Lock Action Button (Step 1: Lock Angle -> Step 2: Fire Power) */
        if (aimSubPhase === 'angle') {
          var lockAngleBtn = U().h('button', {
            type: 'button',
            class: 'gm-real3-btn green pulse',
            text: '1️⃣ LOCK ANGLE! (Space / Tap)'
          });
          lockAngleBtn.addEventListener('click', function () {
            advanceSkillStep();
          });
          dock.appendChild(lockAngleBtn);
        } else {
          var resetAngleBtn = U().h('button', {
            type: 'button',
            class: 'gm-real3-btn sm cyan',
            text: '↩ Re-Aim Angle'
          });
          resetAngleBtn.addEventListener('click', function () {
            aimSubPhase = 'angle';
            A().play('tap');
            renderAimDock();
          });
          dock.appendChild(resetAngleBtn);

          var fireBtn = U().h('button', {
            type: 'button',
            class: 'gm-real3-btn amber pulse',
            text: '2️⃣ FIRE THROW! (Space / Tap)'
          });
          fireBtn.addEventListener('click', function () {
            advanceSkillStep();
          });
          dock.appendChild(fireBtn);
        }
      }

      function enterAimPhase() {
        mode = 'aim';
        aimSubPhase = 'angle';
        activePower = null;
        roundPoints = 0;
        roundHeadlines = [];
        hitOpponentThisTurn = false;
        missReason = '';

        /* Start with oscillating angle & low power — NEVER pre-calculated to hit the target! */
        aimState.angleDeg = 45;
        aimState.angleOscT = (Math.random() * 2 - 1);
        aimState.power = 0.22;
        aimState.powerOscT = -Math.PI / 2;
        aimState.dragging = false;

        charState[turn].state = 'idle';
        charState[turn].bubble = 'Step 1: Lock Angle! (Or drag slingshot!) 🎯';
        charState[1 - turn].bubble = 'Bet you miss me in this wind! 💨';

        updateBanner(
          '🎯 STEP 1: Lock Throw Angle! (' + T[turn].name + ')',
          'Tap LOCK ANGLE (or pull the slingshot) — check the Wind & Wasp first!',
          true
        );
        renderAimDock();
      }

      function showWaitTurn() {
        var t = T[turn];
        mode = 'wait';
        projs = [];
        activePower = null;
        charState[0].state = 'idle';
        charState[1].state = 'idle';
        charState[turn].bubble = turn === 0 ? 'My turn! 🧶' : 'My turn! 🦴';
        charState[1 - turn].bubble = '';
        U().teamBar(T, turn);

        var sideTag = turn === 0 ? '🐱 Cat Yard' : '🐶 Dog Yard';
        updateBanner(
          t.name + '\u2019s Turn! (' + sideTag + ')',
          'Throw ' + (turnCount + 1) + ' of ' + totalTurns + ' · ' + formatWindShort(),
          false
        );

        dock.innerHTML = '';
        var askBtn = U().h('button', {
          type: 'button',
          class: 'gm-real3-btn amber pulse',
          text: '❓ Ask & Throw! (Space)'
        });
        askBtn.addEventListener('click', function () {
          if (mode !== 'wait') return;
          dock.innerHTML = '';
          U().ask(ctx.nextItem(), {
            team: t,
            timer: ctx.cfg.timer,
            pics: ctx.cfg.pics,
            sub: 'Throw ' + (turnCount + 1) + ' of ' + totalTurns
          }).then(function (res) {
            if (!alive) return;
            if (res.cancelled) {
              showWaitTurn();
              return;
            }
            if (!res.ok) {
              charState[turn].state = 'hit';
              charState[turn].dizzyUntil = performance.now() + 900;
              charState[turn].bubble = 'Next time! 💪';
              turnCount++;
              if (turnCount >= totalTurns) {
                later(function () { if (alive) ctx.end(); }, 700);
                return;
              }
              turn = (turn + 1) % 2;
              resetTurnEnvironment();
              showWaitTurn();
              return;
            }
            enterAimPhase();
          });
        });
        dock.appendChild(askBtn);
      }

      /* Keyboard Shortcut: Space / Enter advances Wait -> Lock Angle -> Fire Power! */
      function onKey(e) {
        if (document.querySelector('.gm-qov')) return;
        if (e.code === 'Space' || e.code === 'Enter') {
          if (mode === 'wait') {
            var b = dock.querySelector('button');
            if (b) { e.preventDefault(); b.click(); }
          } else if (mode === 'aim') {
            e.preventDefault();
            advanceSkillStep();
          }
        }
      }
      w.addEventListener('keydown', onKey);

      ctx.onEnd(function () {
        alive = false;
        cancelAnimationFrame(raf);
        timers.forEach(clearTimeout);
        document.body.classList.remove('gm-small-pods', 'gm-real3-active');
        w.removeEventListener('mouseup', onPointerUp);
        w.removeEventListener('touchend', onPointerUp);
        w.removeEventListener('keydown', onKey);
      });

      showWaitTurn();
    }
  };
})(window);
