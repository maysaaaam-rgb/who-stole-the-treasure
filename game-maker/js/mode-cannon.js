/* Game Maker: MONSTER CANNON. A right answer = a shot. The team's monster runs in, jumps INTO the cannon and peeks out of it.
   The pupil pulls back on the board (like a slingshot) and lets go: the monster flies out in an arc and pops the balloons it hits.
   Difficulty: Easy (big still balloons, long aim line), Normal (smaller moving balloons, wind, short aim line), Hard (small fast balloons,
   strong wind, almost no aim line). Every shot still scores at least 5 points. Drawn on a canvas at 60 frames a second. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {}; GM.modes = GM.modes || {};
  var U = function () { return GM.u; }, A = function () { return GM.audio; }, J = function () { return GM.juice; };
  var W = 1600, H = 900, GROUND = 810, G = 900, CX = 200, CY = 700, MUZZLE = 132, MR = 50;
  var VALUES = [[10, 84, '#2aa8ff'], [20, 74, '#2ecc71'], [30, 64, '#ffb21a'], [50, 54, '#ff5d73']], WEIGHTS = [0.36, 0.3, 0.22, 0.12];
  var LEVELS = {
    easy: { size: 1, dots: 12, wind: 0, bob: 10, drift: 0, count: 6 },
    normal: { size: 0.74, dots: 5, wind: 110, bob: 45, drift: 0, count: 6 },
    hard: { size: 0.58, dots: 2, wind: 190, bob: 70, drift: 55, count: 5 }
  };
  function pickValue() { var r = Math.random(), k; for (k = 0; k < 4; k++) { r -= WEIGHTS[k]; if (r <= 0) return VALUES[k]; } return VALUES[0]; }
  function monImage(m) {
    var img = new Image(); var svg = GM.mon.svg(m, 200);
    if (svg.indexOf('<svg') < 0) return null;
    if (svg.indexOf('xmlns=') < 0) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); return img;
  }

  GM.modes.cannon = {
    id: 'cannon', name: 'Monster Cannon', e: '🎯', desc: 'Answer right: your monster jumps into the cannon. Pull back, let go and pop the balloons!',
    fields: [
      { key: 'level', label: 'Difficulty', opts: [['easy', 'Easy', 'Big balloons'], ['normal', 'Normal', 'Wind, moving balloons'], ['hard', 'Hard', 'Small, fast, strong wind']], def: 'normal' },
      { key: 'shots', label: 'Shots for each team', opts: [[2, '2'], [3, '3'], [4, '4'], [5, '5']], def: 3 }
    ],
    start: function (ctx) {
      var st = GM.state, T = st.teams, nt = T.length, shots = (+ctx.cfg.shots || 3) * nt, shot = 0, turn = 0, hal = st.theme === 'halloween', L = LEVELS[ctx.cfg.level] || LEVELS.normal;
      var rootEl = ctx.root; rootEl.innerHTML = '';
      document.body.classList.add('gm-small-pods'); ctx.onEnd(function () { document.body.classList.remove('gm-small-pods'); });
      var info = U().h('div', { class: 'gm-info' }), cv = U().h('canvas', { class: 'gm-cannon-cv', width: W, height: H }), box = U().h('div', { class: 'gm-cannonbox' }, [cv]);
      rootEl.appendChild(U().h('div', { class: 'gm-boardwrap' }, [info, box]));
      /* the world is always 900 high; its width follows the screen, so the game fills the whole board with no empty bars */
      function fit() { var bw = box.clientWidth, bh = box.clientHeight; if (!bw || !bh) return; var nw = Math.round(Math.max(1400, Math.min(2800, H * bw / bh))); if (nw !== W) { var k = nw / W; (targets || []).forEach(function (t) { t.x *= k; t.bx *= k; }); W = nw; cv.width = W; } }
      W = 1600; var ro = root.ResizeObserver ? new ResizeObserver(fit) : null; if (ro) ro.observe(box); fit();
      ctx.onEnd(function () { if (ro) ro.disconnect(); });
      var g = cv.getContext('2d'), imgs = T.map(function (t) { return monImage(t.mon); }), alive = true, raf = 0;
      ctx.onEnd(function () { alive = false; cancelAnimationFrame(raf); });
      /* mode: wait | load | aim | fly */
      var mode = 'wait', aim = null, ball = null, trail = [], parts = [], targets = [], clouds = [], hitThisShot = 0, recoil = 0, wind = 0, load = null, peek = 0;
      for (var k = 0; k < 5; k++) clouds.push({ x: Math.random() * W, y: 60 + Math.random() * 220, s: 0.6 + Math.random() * 0.8, v: 8 + Math.random() * 14 });
      function newTargets() {
        targets = targets.filter(function (t) { return !t.pop; });
        var tries = 0;
        while (targets.length < L.count && tries++ < 400) {
          var v = pickValue(), r = Math.round(v[1] * L.size), x = 760 + Math.random() * (W - 860), y = 150 + Math.random() * 500, ok = true;
          if (x > W - 360 && y < 300) ok = false;
          targets.forEach(function (o) { if (Math.hypot(o.x - x, o.y - y) < o.r + r + 40) ok = false; });
          if (ok) targets.push({ x: x, y: y, bx: x, r: r, v: v[0], c: v[2], ph: Math.random() * 6, sp: 0.6 + Math.random() * 0.8 + v[0] / 60, pop: 0 });
        }
      }
      function newWind() { wind = L.wind ? Math.round((Math.random() * 2 - 1) * L.wind) : 0; }
      newTargets();
      function toWorld(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H }; }
      function toScreen(x, y) { var r = cv.getBoundingClientRect(); return { x: r.left + x / W * r.width, y: r.top + y / H * r.height }; }
      function launchVec(p) { var dx = CX - p.x, dy = CY - p.y, d = Math.min(320, Math.hypot(dx, dy)) || 1, a = Math.atan2(dy, dx); a = Math.max(-1.45, Math.min(0.15, a)); return { vx: Math.cos(a) * d * 4.2, vy: Math.sin(a) * d * 4.2, pull: d, a: a }; }
      var restA = -0.6;
      function barrelA(now) { return aim ? launchVec(aim).a : restA + Math.sin(now / 900) * 0.04; }
      cv.addEventListener('pointerdown', function (e) { if (mode !== 'aim') return; e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ } aim = toWorld(e); A().play('tap'); });
      cv.addEventListener('pointermove', function (e) { if (mode === 'aim' && aim) aim = toWorld(e); });
      function release() {
        if (mode !== 'aim' || !aim) return; var v = launchVec(aim); if (v.pull < 30) { aim = null; return; }
        restA = v.a; mode = 'fly'; ball = { x: CX + Math.cos(v.a) * MUZZLE, y: CY + Math.sin(v.a) * MUZZLE, vx: v.vx, vy: v.vy, rot: 0, t: 0 }; aim = null; trail = []; hitThisShot = 0; recoil = 1;
        A().play('pu_rocket'); A().play('plinko_drop'); J().shake(6); puff(CX + Math.cos(v.a) * (MUZZLE + 20), CY + Math.sin(v.a) * (MUZZLE + 20), 18, ['#ffffff', '#ffe066', '#ffb21a']);
      }
      cv.addEventListener('pointerup', release); cv.addEventListener('pointercancel', function () { aim = null; });
      function puff(x, y, n, cols) { for (var k = 0; k < n; k++) { var a = Math.random() * Math.PI * 2, s = 120 + Math.random() * 380; parts.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 100, life: 0.7 + Math.random() * 0.5, t: 0, c: cols[k % cols.length], r: 5 + Math.random() * 9 }); } }
      function pop(t) {
        t.pop = 1; hitThisShot += t.v; puff(t.x, t.ry || t.y, 26, [t.c, '#ffffff', '#ffe066']); A().play(t.v >= 30 ? 'slot_high' : 'slot_mid'); A().play('pu_boom');
        var p = toScreen(t.x, t.ry || t.y); J().floatAt(p, '+' + t.v, 'good'); J().shake(t.v >= 30 ? 9 : 5);
      }
      function landed() {
        mode = 'wait'; var pts = Math.max(5, hitThisShot), p = toScreen(ball.x, Math.min(ball.y, GROUND));
        if (hitThisShot === 0) { J().floatAt(p, 'Good try +5', 'soft'); A().play('hunt_empty'); } else if (hitThisShot >= 50) { U().confetti(30); A().play('fanfare'); }
        var marker = U().h('span', { class: 'gm-ghostpt' }); marker.style.left = p.x + 'px'; marker.style.top = p.y + 'px'; document.getElementById('gm-fx').appendChild(marker);
        U().floatText('', marker, 'good'); U().addScore(turn, pts); setTimeout(function () { marker.remove(); }, 1500);
        ball = null; shot++;
        setTimeout(function () { if (!alive) return; if (shot >= shots) { ctx.end(); return; } newTargets(); turn = (turn + 1) % nt; showTurn(); }, 1600);
      }
      /* ---------- the monster gets into the cannon ---------- */
      function startLoad() {
        mode = 'load'; restA = -0.6; load = { t: 0 }; peek = 0; newWind(); A().play('hunt_step');
      }
      /* ---------- drawing ---------- */
      function sky() {
        var gr = g.createLinearGradient(0, 0, 0, GROUND);
        if (hal) { gr.addColorStop(0, '#2a0f57'); gr.addColorStop(1, '#7a2f8f'); } else { gr.addColorStop(0, '#5cc8ff'); gr.addColorStop(1, '#d7f3ff'); }
        g.fillStyle = gr; g.fillRect(0, 0, W, GROUND);
        if (hal) { g.fillStyle = '#fff7d6'; g.beginPath(); g.arc(W - 260, 150, 70, 0, 7); g.fill(); }
        clouds.forEach(function (c) { g.fillStyle = hal ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.85)'; var x = c.x, y = c.y, s = c.s; g.beginPath(); g.ellipse(x, y, 90 * s, 34 * s, 0, 0, 7); g.ellipse(x + 60 * s, y - 18 * s, 60 * s, 30 * s, 0, 0, 7); g.ellipse(x - 55 * s, y - 8 * s, 50 * s, 24 * s, 0, 0, 7); g.fill(); });
        g.fillStyle = hal ? '#3b1a74' : '#7fe08a'; g.fillRect(0, GROUND, W, H - GROUND); g.fillStyle = hal ? '#2a1250' : '#3fb85a'; g.fillRect(0, GROUND, W, 16);
        g.strokeStyle = '#1f2a44'; g.lineWidth = 6; g.beginPath(); g.moveTo(0, GROUND); g.lineTo(W, GROUND); g.stroke();
      }
      function flag(now) {
        if (!L.wind) return;
        var x = W - 150, y = 70, dir = wind >= 0 ? 1 : -1, len = 40 + Math.abs(wind) / L.wind * 70, wave = Math.sin(now / 150) * 6;
        g.fillStyle = 'rgba(255,255,255,.85)'; g.strokeStyle = '#1f2a44'; g.lineWidth = 4; g.beginPath(); g.roundRect(x - 120, y - 40, 240, 92, 20); g.fill(); g.stroke();
        g.font = '700 26px Fredoka, sans-serif'; g.fillStyle = '#1f2a44'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(wind === 0 ? 'No wind' : 'Wind', x, y - 14);
        if (wind !== 0) { g.strokeStyle = '#ff5d73'; g.fillStyle = '#ff5d73'; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - dir * len / 2, y + 22 + wave * 0.2); g.lineTo(x + dir * len / 2, y + 22); g.stroke(); g.beginPath(); g.moveTo(x + dir * (len / 2 + 14), y + 22); g.lineTo(x + dir * (len / 2 - 6), y + 8); g.lineTo(x + dir * (len / 2 - 6), y + 36); g.fill(); g.lineCap = 'butt'; }
      }
      function balloon(t, now, dt) {
        if (t.pop) return; var y = t.y + Math.sin(now / 700 * t.sp + t.ph) * L.bob;
        if (L.drift) t.x = t.bx + Math.sin(now / 1100 * t.sp + t.ph * 2) * L.drift;
        g.strokeStyle = 'rgba(31,42,68,.6)'; g.lineWidth = 3; g.beginPath(); g.moveTo(t.x, y + t.r); g.quadraticCurveTo(t.x + 14, y + t.r + 36, t.x, y + t.r + 70); g.stroke();
        var gr = g.createRadialGradient(t.x - t.r * 0.35, y - t.r * 0.4, t.r * 0.1, t.x, y, t.r); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.25, t.c); gr.addColorStop(1, t.c);
        g.fillStyle = gr; g.strokeStyle = '#1f2a44'; g.lineWidth = 5; g.beginPath(); g.ellipse(t.x, y, t.r * 0.9, t.r, 0, 0, 7); g.fill(); g.stroke();
        g.fillStyle = '#1f2a44'; g.beginPath(); g.moveTo(t.x - 8, y + t.r + 2); g.lineTo(t.x + 8, y + t.r + 2); g.lineTo(t.x, y + t.r - 8); g.fill();
        g.font = '700 ' + Math.round(Math.max(22, t.r * 0.66)) + 'px Fredoka, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 6; g.strokeStyle = 'rgba(0,0,0,.35)'; g.strokeText(String(t.v), t.x, y + 2); g.fillStyle = '#fff'; g.fillText(String(t.v), t.x, y + 2);
        t.ry = y;
      }
      function barrel(a, back) {
        g.save(); g.translate(CX, CY); g.rotate(a); g.translate(-back, 0);
        g.fillStyle = '#3b4a6b'; g.strokeStyle = '#1f2a44'; g.lineWidth = 6; g.beginPath(); g.roundRect(-44, -44, 170, 88, 28); g.fill(); g.stroke();
        g.fillStyle = '#ffb21a'; g.beginPath(); g.roundRect(112, -52, 36, 104, 14); g.fill(); g.stroke();
        g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.roundRect(-32, -34, 136, 16, 8); g.fill();
        g.restore();
      }
      function wheel() {
        g.fillStyle = '#ff5d73'; g.strokeStyle = '#1f2a44'; g.lineWidth = 6; g.beginPath(); g.arc(CX - 16, CY + 54, 52, 0, 7); g.fill(); g.stroke();
        g.fillStyle = '#ffe066'; g.beginPath(); g.arc(CX - 16, CY + 54, 16, 0, 7); g.fill(); g.stroke();
      }
      /* the monster peeking out of the muzzle: drawn first and clipped so the barrel covers its body */
      function peekMonster(a, now) {
        var img = imgs[turn]; if (!img || !img.complete || peek <= 0) return;
        var s = 128, cx = MUZZLE - s * 0.25 + peek * s * 0.45 + (aim ? 0 : Math.sin(now / 220) * 4);
        g.save(); g.translate(CX, CY); g.rotate(a);
        g.beginPath(); g.rect(MUZZLE - 6, -s, s * 2, s * 2); g.clip();
        g.translate(cx, 0); g.rotate(Math.PI / 2); g.drawImage(img, -s / 2, -s / 2, s, s);
        g.restore();
      }
      function loadMonster(dt) {
        var img = imgs[turn]; load.t += dt; var t = load.t, ma = restA, mx = CX + Math.cos(ma) * MUZZLE, my = CY + Math.sin(ma) * MUZZLE, s = 120, x, y, sc = 1;
        if (t < 0.9) { var k = t / 0.9; x = -80 + (CX - 150 + 80) * k; y = GROUND - s / 2 + 4 - Math.abs(Math.sin(k * Math.PI * 4)) * 18; }
        else if (t < 1.6) { var k2 = (t - 0.9) / 0.7, sx = CX - 150, sy = GROUND - s / 2; x = sx + (mx - sx) * k2; y = sy + (my - sy) * k2 - Math.sin(k2 * Math.PI) * 220; sc = 1 - k2 * 0.25; if (!load.jumped) { load.jumped = 1; A().play('pu_good'); } }
        else { if (!load.done) { load.done = 1; A().play('hunt_dig'); puff(mx, my, 14, ['#ffffff', '#ffe066']); J().shake(4); mode = 'aim'; peek = 0; info.lastChild.textContent = '🎯 Pull back from the cannon and let go!'; A().play('round'); } return; }
        if (img && img.complete) { g.save(); g.translate(x, y); if (t >= 0.9) g.rotate((t - 0.9) / 0.7 * Math.PI * 1.5); g.drawImage(img, -s * sc / 2, -s * sc / 2, s * sc, s * sc); g.restore(); }
      }
      function guide() {
        if (!aim) return; var v = launchVec(aim), x = CX + Math.cos(v.a) * MUZZLE, y = CY + Math.sin(v.a) * MUZZLE, vx = v.vx, vy = v.vy;
        g.strokeStyle = hal ? 'rgba(255,255,255,.5)' : 'rgba(31,42,68,.5)'; g.lineWidth = 4; g.setLineDash([8, 8]); g.beginPath(); g.moveTo(CX, CY); g.lineTo(aim.x, aim.y); g.stroke(); g.setLineDash([]);
        for (var k = 0; k < L.dots; k++) { for (var s = 0; s < 4; s++) { vy += G * 0.02; x += vx * 0.02; y += vy * 0.02; } g.fillStyle = 'rgba(255,255,255,' + (0.95 - k * 0.07) + ')'; g.strokeStyle = '#1f2a44'; g.lineWidth = 3; g.beginPath(); g.arc(x, y, 10 - k * 0.5, 0, 7); g.fill(); g.stroke(); }
        g.font = '700 34px Fredoka, sans-serif'; g.textAlign = 'left'; g.fillStyle = hal ? '#ffffff' : '#1f2a44'; g.fillText('Power ' + Math.round(v.pull / 3.2) + '%', CX - 60, CY - 200);
      }
      var last = performance.now();
      function frame(now) {
        if (!alive) return; var dt = Math.min(0.033, (now - last) / 1000); last = now; recoil = Math.max(0, recoil - dt * 4);
        if (mode === 'aim') peek = Math.min(1, peek + dt * 3);
        clouds.forEach(function (c) { c.x += (c.v + wind * 0.08) * dt; if (c.x > W + 200) c.x = -200; if (c.x < -200) c.x = W + 200; });
        if (ball) {
          var steps = 3, sd = dt / steps;
          for (var s = 0; s < steps && ball; s++) {
            ball.vy += G * sd; ball.vx += wind * sd; ball.x += ball.vx * sd; ball.y += ball.vy * sd; ball.rot += sd * 9; ball.t += sd;
            targets.forEach(function (t) { if (!t.pop && Math.hypot(t.x - ball.x, (t.ry || t.y) - ball.y) < t.r + MR * 0.85) pop(t); });
            if (ball.y > GROUND - MR) { ball.y = GROUND - MR; if (Math.abs(ball.vy) > 260) { ball.vy *= -0.42; ball.vx *= 0.7; A().play('hunt_dig'); puff(ball.x, GROUND, 8, ['#c8a06a', '#ffffff']); } else { landed(); break; } }
            if (ball && (ball.x > W + 120 || ball.x < -120 || ball.t > 6)) { landed(); break; }
          }
          if (ball) { trail.push({ x: ball.x, y: ball.y }); if (trail.length > 22) trail.shift(); }
        }
        parts = parts.filter(function (p) { p.t += dt; p.vy += 900 * dt; p.x += p.vx * dt; p.y += p.vy * dt; return p.t < p.life; });
        sky(); flag(now); targets.forEach(function (t) { balloon(t, now, dt); });
        trail.forEach(function (p, k) { g.fillStyle = 'rgba(255,224,102,' + (k / trail.length * 0.7) + ')'; g.beginPath(); g.arc(p.x, p.y, 4 + k * 0.9, 0, 7); g.fill(); });
        var a = barrelA(now);
        if (mode === 'aim') peekMonster(a, now);
        barrel(a, recoil * 26); wheel();
        if (mode === 'load') loadMonster(dt);
        if (ball && imgs[turn] && imgs[turn].complete) { g.save(); g.translate(ball.x, ball.y); g.rotate(ball.rot); g.drawImage(imgs[turn], -MR * 1.4, -MR * 1.4, MR * 2.8, MR * 2.8); g.restore(); }
        parts.forEach(function (p) { g.globalAlpha = 1 - p.t / p.life; g.fillStyle = p.c; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 7); g.fill(); }); g.globalAlpha = 1;
        if (mode === 'aim') guide();
        raf = requestAnimationFrame(frame);
      }
      raf = requestAnimationFrame(frame);
      function showTurn() {
        var t = T[turn]; mode = 'wait'; peek = 0; info.innerHTML = ''; info.style.setProperty('--c', t.color); info.appendChild(U().monFace(t.mon, 46));
        info.appendChild(U().h('b', { text: t.name + ': answer to get a shot!  (shot ' + (shot + 1) + ' of ' + shots + ')' })); info.appendChild(U().btn('❓ Ask me', 'big amber', ask)); U().teamBar(T, turn);
      }
      var asking = false;
      async function ask() {
        if (asking || mode !== 'wait') return; asking = true; var t = T[turn], res = await U().ask(ctx.nextItem(), t, { timer: +ctx.cfg.timer || 0, label: 'Shot ' + (shot + 1) });
        asking = false;
        if (!res.ok) { info.innerHTML = ''; info.appendChild(U().h('b', { text: 'No shot this time. Next team!' })); shot++; await U().sleep(1200); if (shot >= shots) { ctx.end(); return; } turn = (turn + 1) % nt; showTurn(); return; }
        info.innerHTML = ''; info.appendChild(U().monFace(t.mon, 46)); info.appendChild(U().h('b', { text: '🏃 ' + t.name + ' jumps into the cannon...' }));
        startLoad();
      }
      showTurn();
    }
  };
})(window);
