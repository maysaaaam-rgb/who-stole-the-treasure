/* Game Maker: ALLEY FLING (mode-fling.js).
   Two teams face each other across a sunny cartoon alley with a changing wooden fence and a floating bonus star in the middle.
   Answer right to earn a throw: pull back from your monster (or tap Quick Aim) to fling a yarn ball / star over the fence!
   Every throw scores at least +5 points, hitting the floating star adds +15, and hitting the target zones scores +10, +20 or +30! */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {}; GM.modes = GM.modes || {};
  var U = function () { return GM.u; }, A = function () { return GM.audio; }, J = function () { return GM.juice; };
  var W = 1600, H = 900, GROUND = 790, G = 920;
  var LEVELS = {
    easy: { dots: 14, wind: 0, fenceMin: 180, fenceMax: 240, targetR: 110 },
    normal: { dots: 7, wind: 110, fenceMin: 230, fenceMax: 330, targetR: 92 },
    hard: { dots: 3, wind: 190, fenceMin: 290, fenceMax: 400, targetR: 78 }
  };

  function monImage(m) {
    var img = new Image(); var svg = GM.mon.svg(m, 200);
    if (svg.indexOf('<svg') < 0) return null;
    if (svg.indexOf('xmlns=') < 0) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    return img;
  }

  GM.modes.fling = {
    id: 'fling',
    name: 'Alley Fling',
    e: '🪃',
    teams: 2,
    desc: 'Two teams face off across the fence! Answer right, pull back (or tap Quick Throw) and fling over the fence for big points!',
    fields: [
      { key: 'level', label: 'Difficulty', opts: [['easy', 'Easy', 'Low fence, no wind'], ['normal', 'Normal', 'Changing fence + wind'], ['hard', 'Hard', 'Tall fence + strong wind']], def: 'normal' },
      { key: 'rounds', label: 'Throws per team', opts: [[2, '2'], [3, '3'], [4, '4'], [5, '5']], def: 3 }
    ],
    start: function (ctx) {
      var st = GM.state, T = st.teams, totalTurns = (+ctx.cfg.rounds || 3) * 2, turnCount = 0, turn = 0;
      var hal = st.theme === 'halloween', L = LEVELS[ctx.cfg.level] || LEVELS.normal;
      var rootEl = ctx.root; rootEl.innerHTML = '';
      document.body.classList.add('gm-small-pods');
      ctx.onEnd(function () { document.body.classList.remove('gm-small-pods'); });

      var info = U().h('div', { class: 'gm-info' });
      var cv = U().h('canvas', { class: 'gm-cannon-cv gm-fling-cv', width: W, height: H });
      var box = U().h('div', { class: 'gm-cannonbox gm-flingbox' }, [cv]);
      rootEl.appendChild(U().h('div', { class: 'gm-boardwrap' }, [info, box]));

      function fit() {
        var bw = box.clientWidth, bh = box.clientHeight;
        if (!bw || !bh) return;
        var nw = Math.round(Math.max(1400, Math.min(2600, H * bw / bh)));
        if (nw !== W) { W = nw; cv.width = W; }
      }
      var ro = root.ResizeObserver ? new ResizeObserver(fit) : null;
      if (ro) ro.observe(box);
      fit();
      ctx.onEnd(function () { if (ro) ro.disconnect(); });

      var g = cv.getContext('2d'), imgs = T.map(function (t) { return monImage(t.mon); }), alive = true, raf = 0;
      ctx.onEnd(function () { alive = false; cancelAnimationFrame(raf); });

      var mode = 'wait', aim = null, proj = null, trail = [], parts = [], clouds = [];
      var wind = 0, fenceH = 260, star = { y: 260, hit: false, ph: 0 }, bouncePad = { w: 130, glow: 0 };
      var cheerL = 0, cheerR = 0, hitPts = 0, starPts = 0;
      for (var k = 0; k < 5; k++) clouds.push({ x: Math.random() * W, y: 70 + Math.random() * 180, s: 0.65 + Math.random() * 0.7, v: 10 + Math.random() * 14 });

      function leftX() { return Math.round(W * 0.16); }
      function rightX() { return Math.round(W * 0.84); }
      function midX() { return Math.round(W * 0.5); }
      function shooterPos() { return { x: turn === 0 ? leftX() : rightX(), y: GROUND - 95 }; }
      function targetPos() { return { x: turn === 0 ? rightX() : leftX(), y: GROUND - 95 }; }

      function newRoundProps() {
        wind = L.wind ? Math.round((Math.random() * 2 - 1) * L.wind) : 0;
        fenceH = U().rand(L.fenceMin, L.fenceMax);
        star = { y: GROUND - fenceH - 125 - Math.random() * 70, hit: false, ph: Math.random() * 6 };
      }
      newRoundProps();

      function toWorld(e) {
        var r = cv.getBoundingClientRect();
        return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H };
      }
      function toScreen(x, y) {
        var r = cv.getBoundingClientRect();
        return { x: r.left + x / W * r.width, y: r.top + y / H * r.height };
      }

      function launchVec(p) {
        var sp = shooterPos();
        var dx = sp.x - p.x, dy = sp.y - p.y;
        /* If the pupil drags forward toward the target instead of pulling back, invert so both ways work naturally! */
        if ((turn === 0 && dx < -15) || (turn === 1 && dx > 15)) {
          dx = -dx;
          dy = Math.min(-40, -Math.abs(dy));
        }
        var d = Math.min(320, Math.max(60, Math.hypot(dx, dy)));
        var dir = turn === 0 ? 1 : -1;
        var upAngle = Math.atan2(Math.min(-35, dy), Math.max(25, Math.abs(dx)));
        upAngle = Math.max(-1.35, Math.min(-0.28, upAngle));
        var speed = d * 4.25;
        return {
          vx: dir * Math.cos(upAngle) * speed,
          vy: Math.sin(upAngle) * speed,
          pull: d
        };
      }

      function fireWithVec(v) {
        if (mode !== 'aim') return;
        var sp = shooterPos();
        mode = 'fly';
        aim = null;
        trail = [];
        hitPts = 0;
        starPts = 0;
        proj = { x: sp.x + (turn === 0 ? 45 : -45), y: sp.y - 25, vx: v.vx, vy: v.vy, rot: 0, t: 0, bounces: 0 };
        if (turn === 0) cheerL = 0.6; else cheerR = 0.6;
        A().play('pu_rocket');
        puff(proj.x, proj.y, 16, ['#ffffff', '#ffe066', T[turn].color]);
      }

      function presetShot(powerMul) {
        if (mode !== 'aim') return;
        var sp = shooterPos(), tp = targetPos();
        var dx = tp.x - sp.x;
        var flightT = 1.32 * powerMul;
        var vx = (dx - 0.5 * wind * flightT * flightT) / flightT;
        var vy = -0.5 * G * flightT - (fenceH * 0.42);
        fireWithVec({ vx: vx, vy: vy, pull: 240 });
      }

      cv.addEventListener('pointerdown', function (e) {
        if (mode !== 'aim') return;
        e.preventDefault();
        try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        aim = toWorld(e);
        A().play('tap');
      });
      cv.addEventListener('pointermove', function (e) {
        if (mode === 'aim' && aim) aim = toWorld(e);
      });
      function release() {
        if (mode !== 'aim' || !aim) return;
        var sp = shooterPos();
        if (Math.hypot(sp.x - aim.x, sp.y - aim.y) < 28) {
          aim = null;
          return;
        }
        fireWithVec(launchVec(aim));
      }
      cv.addEventListener('pointerup', release);
      cv.addEventListener('pointercancel', function () { aim = null; });

      function puff(x, y, n, cols) {
        for (var k = 0; k < n; k++) {
          var a = Math.random() * Math.PI * 2, s = 110 + Math.random() * 340;
          parts.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 90, life: 0.65 + Math.random() * 0.45, t: 0, c: cols[k % cols.length], r: 5 + Math.random() * 8 });
        }
      }

      function finishShot(msgText, totalScore) {
        if (mode === 'wait') return;
        var endX = proj ? proj.x : targetPos().x, endY = proj ? Math.min(proj.y, GROUND - 20) : GROUND - 80;
        mode = 'wait';
        proj = null;
        var pts = Math.max(5, totalScore + starPts);
        var p = toScreen(endX, endY);
        J().floatAt(p, msgText + ' +' + pts, totalScore >= 20 ? 'good' : 'soft');
        if (pts >= 25) { U().confetti(24); A().play('slot_high'); J().shake(7); }
        else if (pts >= 15) { A().play('slot_mid'); J().shake(4); }
        else { A().play('hunt_empty'); }

        var marker = U().h('span', { class: 'gm-ghostpt' });
        marker.style.left = p.x + 'px'; marker.style.top = p.y + 'px';
        document.getElementById('gm-fx').appendChild(marker);
        U().addScore(turn, pts);
        setTimeout(function () { marker.remove(); }, 1400);

        turnCount++;
        setTimeout(function () {
          if (!alive) return;
          if (turnCount >= totalTurns) { ctx.end(); return; }
          turn = (turn + 1) % 2;
          newRoundProps();
          showTurn();
        }, 1500);
      }

      function drawSkyAndAlley(now) {
        var gr = g.createLinearGradient(0, 0, 0, GROUND);
        if (hal) { gr.addColorStop(0, '#1e1040'); gr.addColorStop(1, '#581c87'); }
        else { gr.addColorStop(0, '#38bdf8'); gr.addColorStop(0.65, '#bae6fd'); gr.addColorStop(1, '#fef3c7'); }
        g.fillStyle = gr; g.fillRect(0, 0, W, GROUND);

        /* Soft cartoon rooftops in background */
        g.fillStyle = hal ? 'rgba(15, 23, 42, 0.45)' : 'rgba(255, 255, 255, 0.35)';
        for (var b = 0; b < 7; b++) {
          var bx = b * (W / 6.5), bw = W / 7.2, bh = 160 + (b % 3) * 55;
          g.beginPath(); g.roundRect(bx, GROUND - bh, bw, bh, [18, 18, 0, 0]); g.fill();
        }

        clouds.forEach(function (c) {
          g.fillStyle = hal ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.86)';
          var x = c.x, y = c.y, s = c.s;
          g.beginPath();
          g.ellipse(x, y, 86 * s, 32 * s, 0, 0, 7);
          g.ellipse(x + 56 * s, y - 16 * s, 56 * s, 28 * s, 0, 0, 7);
          g.ellipse(x - 52 * s, y - 8 * s, 48 * s, 22 * s, 0, 0, 7);
          g.fill();
        });

        /* Cobblestone & turf ground */
        g.fillStyle = hal ? '#3b1a74' : '#65a30d';
        g.fillRect(0, GROUND, W, H - GROUND);
        g.fillStyle = hal ? '#2a1250' : '#84cc16';
        g.fillRect(0, GROUND, W, 18);
        g.strokeStyle = '#1f2a44'; g.lineWidth = 6;
        g.beginPath(); g.moveTo(0, GROUND); g.lineTo(W, GROUND); g.stroke();

        /* Wind badge */
        var wx = midX(), wy = 66;
        g.fillStyle = 'rgba(255,255,255,.9)'; g.strokeStyle = '#1f2a44'; g.lineWidth = 4;
        g.beginPath(); g.roundRect(wx - 135, wy - 36, 270, 76, 20); g.fill(); g.stroke();
        g.font = '700 24px Fredoka, sans-serif'; g.fillStyle = '#1f2a44'; g.textAlign = 'center'; g.textBaseline = 'middle';
        if (wind === 0) {
          g.fillText('🍃 Calm air (No wind)', wx, wy + 2);
        } else {
          var dir = wind > 0 ? 1 : -1, len = 36 + Math.abs(wind) / (L.wind || 120) * 55;
          g.fillText('💨 Wind', wx - dir * 48, wy + 2);
          g.strokeStyle = '#f43f5e'; g.fillStyle = '#f43f5e'; g.lineWidth = 7; g.lineCap = 'round';
          g.beginPath(); g.moveTo(wx + 10 - dir * len / 2, wy + 2); g.lineTo(wx + 10 + dir * len / 2, wy + 2); g.stroke();
          g.beginPath();
          g.moveTo(wx + 10 + dir * (len / 2 + 12), wy + 2);
          g.lineTo(wx + 10 + dir * (len / 2 - 5), wy - 10);
          g.lineTo(wx + 10 + dir * (len / 2 - 5), wy + 14);
          g.fill();
        }
      }

      function drawFenceAndStar(now) {
        var mx = midX(), fy = GROUND - fenceH;
        /* Center wooden fence */
        g.fillStyle = hal ? '#4c1d95' : '#d97706';
        g.strokeStyle = '#1f2a44'; g.lineWidth = 6;
        g.beginPath(); g.roundRect(mx - 26, fy, 52, fenceH, [16, 16, 0, 0]); g.fill(); g.stroke();
        g.fillStyle = hal ? '#6d28d9' : '#f59e0b';
        for (var py = fy + 24; py < GROUND - 20; py += 48) {
          g.beginPath(); g.roundRect(mx - 32, py, 64, 18, 6); g.fill(); g.stroke();
        }

        /* Bouncy trampoline pads on either side of the fence */
        [-210, 210].forEach(function (dx) {
          var px = mx + dx;
          g.fillStyle = '#ec4899'; g.strokeStyle = '#1f2a44'; g.lineWidth = 4;
          g.beginPath(); g.roundRect(px - 56, GROUND - 18, 112, 18, 9); g.fill(); g.stroke();
        });

        /* Floating +15 Bonus Star above the fence */
        if (!star.hit) {
          var sy = star.y + Math.sin(now / 380 + star.ph) * 14;
          star.ry = sy;
          g.save();
          g.translate(mx, sy);
          g.fillStyle = '#fde047'; g.strokeStyle = '#1f2a44'; g.lineWidth = 4;
          g.beginPath(); g.arc(0, 0, 38, 0, Math.PI * 2); g.fill(); g.stroke();
          g.font = '700 26px Fredoka, sans-serif'; g.fillStyle = '#1f2a44'; g.textAlign = 'center'; g.textBaseline = 'middle';
          g.fillText('⭐+15', 0, 2);
          g.restore();
        }
      }

      function drawTeamsAndTarget(now) {
        var tp = targetPos();
        /* Draw target rings around the defending team's side when aiming or flying */
        if (mode === 'aim' || mode === 'fly') {
          var pulse = 1 + Math.sin(now / 260) * 0.04;
          var rOuter = L.targetR * 1.45 * pulse, rMid = L.targetR * pulse, rBull = L.targetR * 0.55 * pulse;
          [
            [rOuter, 'rgba(56, 189, 248, 0.25)', '#38bdf8'],
            [rMid, 'rgba(250, 204, 21, 0.32)', '#f59e0b'],
            [rBull, 'rgba(244, 63, 94, 0.42)', '#f43f5e']
          ].forEach(function (ring) {
            g.fillStyle = ring[1]; g.strokeStyle = ring[2]; g.lineWidth = 4;
            g.beginPath(); g.arc(tp.x, tp.y, ring[0], 0, Math.PI * 2); g.fill(); g.stroke();
          });
          g.font = '700 22px Fredoka, sans-serif'; g.fillStyle = '#ffffff'; g.strokeStyle = '#1f2a44'; g.lineWidth = 5;
          g.textAlign = 'center';
          g.strokeText('🎯 +30 / +20 / +10', tp.x, tp.y - rOuter - 18);
          g.fillText('🎯 +30 / +20 / +10', tp.x, tp.y - rOuter - 18);
        }

        /* Draw both teams' monsters on pedestals */
        [0, 1].forEach(function (idx) {
          var x = idx === 0 ? leftX() : rightX(), y = GROUND - 95;
          var bounce = Math.sin(now / 340 + idx * 2) * 6;
          if ((idx === 0 && cheerL > 0) || (idx === 1 && cheerR > 0)) bounce -= 24;
          /* Pedestal */
          g.fillStyle = T[idx].color; g.strokeStyle = '#1f2a44'; g.lineWidth = 5;
          g.beginPath(); g.ellipse(x, GROUND - 10, 82, 22, 0, 0, Math.PI * 2); g.fill(); g.stroke();
          /* Monster sprite */
          var img = imgs[idx], s = 175;
          if (img && img.complete && img.naturalWidth > 0) {
            g.save();
            g.translate(x, y + bounce);
            if (idx === 1) g.scale(-1, 1);
            g.drawImage(img, -s / 2, -s / 2, s, s);
            g.restore();
          }
          /* Team label pill */
          g.fillStyle = 'rgba(15, 23, 42, 0.85)'; g.strokeStyle = T[idx].color; g.lineWidth = 4;
          g.beginPath(); g.roundRect(x - 86, GROUND + 18, 172, 42, 14); g.fill(); g.stroke();
          g.font = '700 22px Fredoka, sans-serif'; g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.textBaseline = 'middle';
          var pName = (T[idx].mon && T[idx].mon.name) ? T[idx].mon.name : T[idx].name;
          g.fillText(pName, x, GROUND + 39);
        });
      }

      function drawGuide() {
        if (mode !== 'aim' || !aim) return;
        var sp = shooterPos(), v = launchVec(aim), x = sp.x + (turn === 0 ? 45 : -45), y = sp.y - 25, vx = v.vx, vy = v.vy;
        g.strokeStyle = 'rgba(31, 42, 68, 0.55)'; g.lineWidth = 4; g.setLineDash([8, 8]);
        g.beginPath(); g.moveTo(sp.x, sp.y); g.lineTo(aim.x, aim.y); g.stroke(); g.setLineDash([]);
        for (var k = 0; k < L.dots; k++) {
          for (var s = 0; s < 4; s++) { vy += G * 0.02; vx += wind * 0.02; x += vx * 0.02; y += vy * 0.02; }
          g.fillStyle = 'rgba(255,255,255,' + (0.95 - k * 0.06) + ')'; g.strokeStyle = '#1f2a44'; g.lineWidth = 3;
          g.beginPath(); g.arc(x, y, Math.max(4, 10 - k * 0.5), 0, Math.PI * 2); g.fill(); g.stroke();
        }
        g.font = '700 30px Fredoka, sans-serif'; g.textAlign = 'center'; g.fillStyle = '#1f2a44';
        g.fillText('Power ' + Math.round(v.pull / 3.2) + '%', sp.x, sp.y - 135);
      }

      function drawProjectile() {
        if (!proj) return;
        trail.forEach(function (p, k) {
          g.fillStyle = 'rgba(255, 224, 102, ' + (k / trail.length * 0.72) + ')';
          g.beginPath(); g.arc(p.x, p.y, 4 + k * 0.85, 0, Math.PI * 2); g.fill();
        });
        g.save();
        g.translate(proj.x, proj.y);
        g.rotate(proj.rot);
        g.fillStyle = T[turn].color; g.strokeStyle = '#1f2a44'; g.lineWidth = 5;
        g.beginPath(); g.arc(0, 0, 28, 0, Math.PI * 2); g.fill(); g.stroke();
        g.font = '32px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText(hal ? '🎃' : (turn === 0 ? '🧶' : '🦴'), 0, 2);
        g.restore();
      }

      var last = performance.now();
      function frame(now) {
        if (!alive) return;
        var dt = Math.min(0.033, (now - last) / 1000); last = now;
        cheerL = Math.max(0, cheerL - dt);
        cheerR = Math.max(0, cheerR - dt);
        clouds.forEach(function (c) {
          c.x += (c.v + wind * 0.08) * dt;
          if (c.x > W + 200) c.x = -200;
          if (c.x < -200) c.x = W + 200;
        });

        if (proj) {
          var steps = 3, sd = dt / steps, mx = midX(), tp = targetPos();
          for (var s = 0; s < steps && proj; s++) {
            proj.vy += G * sd;
            proj.vx += wind * sd;
            proj.x += proj.vx * sd;
            proj.y += proj.vy * sd;
            proj.rot += sd * 10 * (turn === 0 ? 1 : -1);
            proj.t += sd;

            /* Bonus Star check */
            if (!star.hit && Math.hypot(proj.x - mx, proj.y - (star.ry || star.y)) < 62) {
              star.hit = true;
              starPts = 15;
              A().play('pu_star');
              puff(mx, star.ry || star.y, 22, ['#fde047', '#ffffff', '#38bdf8']);
              J().floatAt(toScreen(mx, star.ry || star.y), '⭐ Bonus +15!', 'good');
            }

            /* Fence collision */
            if (Math.abs(proj.x - mx) < 42 && proj.y > GROUND - fenceH - 18) {
              if (proj.y < GROUND - fenceH + 22 && proj.vy > 0) {
                proj.y = GROUND - fenceH - 18;
                proj.vy = -Math.abs(proj.vy) * 0.68;
                A().play('plinko_peg');
              } else {
                proj.vx = -proj.vx * 0.55;
                proj.x = mx + (proj.x < mx ? -44 : 44);
                A().play('hunt_dig');
                puff(proj.x, proj.y, 10, ['#d97706', '#ffffff']);
              }
            }

            /* Target hit check */
            var distT = Math.hypot(proj.x - tp.x, proj.y - tp.y);
            if (distT < L.targetR * 1.42) {
              var zoned = distT < L.targetR * 0.55 ? 30 : (distT < L.targetR ? 20 : 10);
              var label = zoned === 30 ? '🎯 BULLSEYE!' : (zoned === 20 ? '💥 Great hit!' : '✨ Nice hit!');
              puff(proj.x, proj.y, 28, [T[turn].color, '#ffe066', '#ffffff']);
              if (turn === 0) cheerR = 0.7; else cheerL = 0.7;
              finishShot(label, zoned);
              break;
            }

            /* Trampoline pad check */
            if (proj.y >= GROUND - 38 && (Math.abs(proj.x - (mx - 210)) < 64 || Math.abs(proj.x - (mx + 210)) < 64)) {
              proj.y = GROUND - 40;
              proj.vy = -Math.max(480, Math.abs(proj.vy) * 0.88);
              A().play('pu_good');
              puff(proj.x, GROUND - 20, 12, ['#ec4899', '#ffffff']);
            } else if (proj.y > GROUND - 26) {
              proj.y = GROUND - 26;
              proj.bounces++;
              if (proj.bounces <= 1 && Math.abs(proj.vy) > 240) {
                proj.vy = -Math.abs(proj.vy) * 0.48;
                proj.vx *= 0.76;
                A().play('hunt_dig');
              } else {
                finishShot('Good throw!', 5);
                break;
              }
            }
            if (proj && (proj.x < -120 || proj.x > W + 120 || proj.t > 5.5)) {
              finishShot('Good throw!', 5);
              break;
            }
          }
          if (proj) {
            trail.push({ x: proj.x, y: proj.y });
            if (trail.length > 22) trail.shift();
          }
        }

        parts = parts.filter(function (p) { p.t += dt; p.vy += 880 * dt; p.x += p.vx * dt; p.y += p.vy * dt; return p.t < p.life; });
        drawSkyAndAlley(now);
        drawFenceAndStar(now);
        drawTeamsAndTarget(now);
        drawProjectile();
        parts.forEach(function (p) {
          g.globalAlpha = Math.max(0, 1 - p.t / p.life);
          g.fillStyle = p.c;
          g.beginPath(); g.arc(p.x, p.y, p.r, 0, Math.PI * 2); g.fill();
        });
        g.globalAlpha = 1;
        drawGuide();
        raf = requestAnimationFrame(frame);
      }
      raf = requestAnimationFrame(frame);

      function showTurn() {
        var t = T[turn], pName = (t.mon && t.mon.name) ? ' (' + t.mon.name + ')' : '';
        mode = 'wait';
        info.innerHTML = '';
        info.style.setProperty('--c', t.color);
        info.appendChild(U().monFace(t.mon, 46));
        info.appendChild(U().h('b', { text: t.name + pName + ': answer to fling over the fence!  (throw ' + (turnCount + 1) + ' of ' + totalTurns + ')' }));
        info.appendChild(U().btn('❓ Ask me', 'big amber', ask));
        U().teamBar(T, turn);
      }

      var asking = false;
      async function ask() {
        if (asking || mode !== 'wait') return;
        asking = true;
        var t = T[turn];
        var res = await U().ask(ctx.nextItem(), t, { timer: +ctx.cfg.timer || 0, label: 'Throw ' + (turnCount + 1) + ' of ' + totalTurns });
        asking = false;
        if (!alive) return;
        if (!res.ok) {
          info.innerHTML = '';
          info.appendChild(U().h('b', { text: 'Good try! Next team steps up!' }));
          turnCount++;
          await U().sleep(1200);
          if (!alive) return;
          if (turnCount >= totalTurns) { ctx.end(); return; }
          turn = (turn + 1) % 2;
          newRoundProps();
          showTurn();
          return;
        }
        mode = 'aim';
        A().play('round');
        info.innerHTML = '';
        info.style.setProperty('--c', t.color);
        info.appendChild(U().monFace(t.mon, 46));
        info.appendChild(U().h('b', { text: '🪃 Pull back on the board — or tap Quick Fling:' }));
        info.appendChild(U().btn('🌈 High Lob', 'sm cyan', function () { presetShot(1.42); }));
        info.appendChild(U().btn('🎯 Direct Fling!', 'big green', function () { presetShot(1.18); }));
      }

      showTurn();
    }
  };
})(window);
