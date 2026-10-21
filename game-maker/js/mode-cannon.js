/* Game Maker: MONSTER CANNON. A right answer = a shot. The pupil pulls back on the board (like a slingshot) and lets go:
   the team's monster flies in an arc and pops the balloons it hits. Every shot scores at least 5 points. Drawn on a canvas at 60 frames a second. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {}; GM.modes = GM.modes || {};
  var U = function () { return GM.u; }, A = function () { return GM.audio; }, J = function () { return GM.juice; };
  var W = 1600, H = 900, GROUND = 800, G = 900, CX = 190, CY = 690, MR = 56;
  var VALUES = [[10, 84, '#2aa8ff'], [20, 74, '#2ecc71'], [30, 64, '#ffb21a'], [50, 54, '#ff5d73']], WEIGHTS = [0.36, 0.3, 0.22, 0.12];
  function pickValue() { var r = Math.random(), k; for (k = 0; k < 4; k++) { r -= WEIGHTS[k]; if (r <= 0) return VALUES[k]; } return VALUES[0]; }

  function monImage(m) {
    var img = new Image(); var svg = GM.mon.svg(m, 200);
    if (svg.indexOf('<svg') < 0) return null;
    if (svg.indexOf('xmlns=') < 0) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); return img;
  }

  GM.modes.cannon = {
    id: 'cannon', name: 'Monster Cannon', e: '🎯', desc: 'Answer right, then pull back and let go! Your monster flies and pops the balloons it hits.',
    fields: [{ key: 'shots', label: 'Shots for each team', opts: [[2, '2'], [3, '3'], [4, '4'], [5, '5']], def: 3 }],
    start: function (ctx) {
      var st = GM.state, T = st.teams, nt = T.length, shots = (+ctx.cfg.shots || 3) * nt, shot = 0, turn = 0, hal = st.theme === 'halloween';
      var rootEl = ctx.root; rootEl.innerHTML = '';
      var info = U().h('div', { class: 'gm-info' }), cv = U().h('canvas', { class: 'gm-cannon-cv', width: W, height: H }), box = U().h('div', { class: 'gm-cannonbox' }, [cv]);
      rootEl.appendChild(U().h('div', { class: 'gm-boardwrap' }, [info, box]));
      var g = cv.getContext('2d'), imgs = T.map(function (t) { return monImage(t.mon); }), alive = true, raf = 0;
      ctx.onEnd(function () { alive = false; cancelAnimationFrame(raf); });
      /* state: aim | fly | wait */
      var mode = 'wait', aim = null, ball = null, trail = [], parts = [], targets = [], clouds = [], hitThisShot = 0, wobbleT = 0, recoil = 0;
      for (var k = 0; k < 5; k++) clouds.push({ x: Math.random() * W, y: 60 + Math.random() * 220, s: 0.6 + Math.random() * 0.8, v: 8 + Math.random() * 14 });
      function newTargets() {
        targets = targets.filter(function (t) { return !t.pop; });
        var tries = 0;
        while (targets.length < 6 && tries++ < 400) {
          var v = pickValue(), x = 720 + Math.random() * 760, y = 160 + Math.random() * 470, ok = true;
          targets.forEach(function (o) { if (Math.hypot(o.x - x, o.y - y) < o.r + v[1] + 24) ok = false; });
          if (ok) targets.push({ x: x, y: y, r: v[1], v: v[0], c: v[2], ph: Math.random() * 6, pop: 0 });
        }
      }
      newTargets();
      function toWorld(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H }; }
      function toScreen(x, y) { var r = cv.getBoundingClientRect(); return { x: r.left + x / W * r.width, y: r.top + y / H * r.height }; }
      function launchVec(p) { var dx = CX - p.x, dy = CY - p.y, d = Math.min(320, Math.hypot(dx, dy)) || 1, a = Math.atan2(dy, dx); return { vx: Math.cos(a) * d * 4.2, vy: Math.sin(a) * d * 4.2, pull: d, a: a }; }
      cv.addEventListener('pointerdown', function (e) { if (mode !== 'aim') return; e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ } aim = toWorld(e); A().play('tap'); });
      cv.addEventListener('pointermove', function (e) { if (mode === 'aim' && aim) aim = toWorld(e); });
      function release() {
        if (mode !== 'aim' || !aim) return; var v = launchVec(aim); if (v.pull < 30) { aim = null; return; }
        mode = 'fly'; ball = { x: CX + Math.cos(v.a) * 70, y: CY + Math.sin(v.a) * 70, vx: v.vx, vy: v.vy, rot: 0, t: 0 }; aim = null; trail = []; hitThisShot = 0; recoil = 1;
        A().play('pu_rocket'); A().play('plinko_drop'); J().shake(5); puff(CX + Math.cos(v.a) * 90, CY + Math.sin(v.a) * 90, 16, ['#ffffff', '#ffe066', '#ffb21a']);
      }
      cv.addEventListener('pointerup', release); cv.addEventListener('pointercancel', function () { aim = null; });
      function puff(x, y, n, cols) { for (var k = 0; k < n; k++) { var a = Math.random() * Math.PI * 2, s = 120 + Math.random() * 380; parts.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 100, life: 0.7 + Math.random() * 0.5, t: 0, c: cols[k % cols.length], r: 5 + Math.random() * 9 }); } }
      function pop(t) {
        t.pop = 1; hitThisShot += t.v; puff(t.x, t.y, 26, [t.c, '#ffffff', '#ffe066']); A().play(t.v >= 30 ? 'slot_high' : 'slot_mid'); A().play('pu_boom');
        var p = toScreen(t.x, t.y); J().floatAt(p, '+' + t.v, 'good'); J().shake(t.v >= 30 ? 9 : 5);
      }
      function landed() {
        mode = 'wait'; var pts = Math.max(5, hitThisShot), p = toScreen(ball.x, Math.min(ball.y, GROUND));
        if (hitThisShot === 0) { J().floatAt(p, 'Good try +5', 'soft'); A().play('hunt_empty'); } else if (hitThisShot >= 50) { U().confetti(30); A().play('fanfare'); }
        var marker = U().h('span', { class: 'gm-ghostpt' }); marker.style.left = p.x + 'px'; marker.style.top = p.y + 'px'; document.getElementById('gm-fx').appendChild(marker);
        U().floatText('', marker, 'good'); U().addScore(turn, pts); setTimeout(function () { marker.remove(); }, 1500);
        ball = null; shot++;
        setTimeout(function () { if (!alive) return; if (shot >= shots) { ctx.end(); return; } newTargets(); turn = (turn + 1) % nt; showTurn(); }, 1600);
      }
      /* ---------- drawing ---------- */
      function sky() {
        var gr = g.createLinearGradient(0, 0, 0, GROUND);
        if (hal) { gr.addColorStop(0, '#2a0f57'); gr.addColorStop(1, '#7a2f8f'); } else { gr.addColorStop(0, '#5cc8ff'); gr.addColorStop(1, '#d7f3ff'); }
        g.fillStyle = gr; g.fillRect(0, 0, W, GROUND);
        if (hal) { g.fillStyle = '#fff7d6'; g.beginPath(); g.arc(1380, 140, 70, 0, 7); g.fill(); }
        clouds.forEach(function (c) { g.fillStyle = hal ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.85)'; var x = c.x, y = c.y, s = c.s; g.beginPath(); g.ellipse(x, y, 90 * s, 34 * s, 0, 0, 7); g.ellipse(x + 60 * s, y - 18 * s, 60 * s, 30 * s, 0, 0, 7); g.ellipse(x - 55 * s, y - 8 * s, 50 * s, 24 * s, 0, 0, 7); g.fill(); });
        g.fillStyle = hal ? '#3b1a74' : '#7fe08a'; g.fillRect(0, GROUND, W, H - GROUND); g.fillStyle = hal ? '#2a1250' : '#3fb85a'; g.fillRect(0, GROUND, W, 16);
        g.strokeStyle = '#1f2a44'; g.lineWidth = 6; g.beginPath(); g.moveTo(0, GROUND); g.lineTo(W, GROUND); g.stroke();
      }
      function balloon(t, now) {
        if (t.pop) return; var y = t.y + Math.sin(now / 600 + t.ph) * 10;
        g.strokeStyle = 'rgba(31,42,68,.6)'; g.lineWidth = 3; g.beginPath(); g.moveTo(t.x, y + t.r); g.quadraticCurveTo(t.x + 14, y + t.r + 40, t.x, y + t.r + 80); g.stroke();
        var gr = g.createRadialGradient(t.x - t.r * 0.35, y - t.r * 0.4, t.r * 0.1, t.x, y, t.r); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.25, t.c); gr.addColorStop(1, t.c);
        g.fillStyle = gr; g.strokeStyle = '#1f2a44'; g.lineWidth = 5; g.beginPath(); g.ellipse(t.x, y, t.r * 0.9, t.r, 0, 0, 7); g.fill(); g.stroke();
        g.fillStyle = '#1f2a44'; g.beginPath(); g.moveTo(t.x - 8, y + t.r + 2); g.lineTo(t.x + 8, y + t.r + 2); g.lineTo(t.x, y + t.r - 8); g.fill();
        g.font = '700 ' + Math.round(t.r * 0.62) + 'px Fredoka, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 6; g.strokeStyle = 'rgba(0,0,0,.35)'; g.strokeText(String(t.v), t.x, y + 2); g.fillStyle = '#fff'; g.fillText(String(t.v), t.x, y + 2);
        t.ry = y;
      }
      function cannon(now) {
        var a = aim ? launchVec(aim).a : -0.6 + Math.sin(now / 900) * 0.05, back = recoil * 26;
        g.save(); g.translate(CX, CY); g.rotate(a); g.translate(-back, 0);
        g.fillStyle = '#3b4a6b'; g.strokeStyle = '#1f2a44'; g.lineWidth = 6; g.beginPath(); g.roundRect(-40, -38, 160, 76, 24); g.fill(); g.stroke();
        g.fillStyle = '#ffb21a'; g.beginPath(); g.roundRect(104, -44, 34, 88, 12); g.fill(); g.stroke();
        g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.roundRect(-30, -30, 130, 16, 8); g.fill();
        g.restore();
        g.fillStyle = '#ff5d73'; g.strokeStyle = '#1f2a44'; g.lineWidth = 6; g.beginPath(); g.arc(CX - 14, CY + 50, 46, 0, 7); g.fill(); g.stroke();
        g.fillStyle = '#ffe066'; g.beginPath(); g.arc(CX - 14, CY + 50, 14, 0, 7); g.fill(); g.stroke();
        if (mode === 'aim' && imgs[turn] && imgs[turn].complete) { var s = 150 + (aim ? 0 : Math.sin(now / 200) * 5); g.drawImage(imgs[turn], CX - s / 2 - 10, CY - s - 18, s, s); }
      }
      function guide() {
        if (!aim) return; var v = launchVec(aim), x = CX + Math.cos(v.a) * 70, y = CY + Math.sin(v.a) * 70, vx = v.vx, vy = v.vy;
        g.strokeStyle = 'rgba(31,42,68,.5)'; g.lineWidth = 4; g.setLineDash([8, 8]); g.beginPath(); g.moveTo(CX, CY); g.lineTo(aim.x, aim.y); g.stroke(); g.setLineDash([]);
        for (var k = 0; k < 14; k++) { for (var s = 0; s < 4; s++) { vy += G * 0.02; x += vx * 0.02; y += vy * 0.02; } g.fillStyle = 'rgba(255,255,255,' + (0.95 - k * 0.06) + ')'; g.strokeStyle = '#1f2a44'; g.lineWidth = 3; g.beginPath(); g.arc(x, y, 9 - k * 0.4, 0, 7); g.fill(); g.stroke(); }
        g.font = '700 34px Fredoka, sans-serif'; g.textAlign = 'left'; g.fillStyle = hal ? '#ffffff' : '#1f2a44'; g.fillText('Power ' + Math.round(v.pull / 3.2) + '%', CX - 60, CY - 170);
      }
      var last = performance.now();
      function frame(now) {
        if (!alive) return; var dt = Math.min(0.033, (now - last) / 1000); last = now; recoil = Math.max(0, recoil - dt * 4);
        clouds.forEach(function (c) { c.x += c.v * dt; if (c.x > W + 200) c.x = -200; });
        if (ball) {
          var steps = 3, sd = dt / steps;
          for (var s = 0; s < steps && ball; s++) {
            ball.vy += G * sd; ball.x += ball.vx * sd; ball.y += ball.vy * sd; ball.rot += sd * 9; ball.t += sd;
            targets.forEach(function (t) { if (!t.pop && Math.hypot(t.x - ball.x, (t.ry || t.y) - ball.y) < t.r + MR) pop(t); });
            if (ball.y > GROUND - MR) { ball.y = GROUND - MR; if (Math.abs(ball.vy) > 260) { ball.vy *= -0.42; ball.vx *= 0.7; A().play('hunt_dig'); puff(ball.x, GROUND, 8, ['#c8a06a', '#ffffff']); } else { landed(); break; } }
            if (ball && (ball.x > W + 120 || ball.x < -120 || ball.t > 6)) { landed(); break; }
          }
          if (ball) { trail.push({ x: ball.x, y: ball.y }); if (trail.length > 22) trail.shift(); }
        }
        parts = parts.filter(function (p) { p.t += dt; p.vy += 900 * dt; p.x += p.vx * dt; p.y += p.vy * dt; return p.t < p.life; });
        sky(); targets.forEach(function (t) { balloon(t, now); });
        trail.forEach(function (p, k) { g.fillStyle = 'rgba(255,224,102,' + (k / trail.length * 0.7) + ')'; g.beginPath(); g.arc(p.x, p.y, 4 + k * 0.9, 0, 7); g.fill(); });
        cannon(now);
        if (ball && imgs[turn] && imgs[turn].complete) { g.save(); g.translate(ball.x, ball.y); g.rotate(ball.rot); g.drawImage(imgs[turn], -MR * 1.4, -MR * 1.4, MR * 2.8, MR * 2.8); g.restore(); }
        parts.forEach(function (p) { g.globalAlpha = 1 - p.t / p.life; g.fillStyle = p.c; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 7); g.fill(); }); g.globalAlpha = 1;
        if (mode === 'aim') guide();
        raf = requestAnimationFrame(frame);
      }
      raf = requestAnimationFrame(frame);
      function showTurn() {
        var t = T[turn]; mode = 'wait'; info.innerHTML = ''; info.style.setProperty('--c', t.color); info.appendChild(U().monFace(t.mon, 46));
        info.appendChild(U().h('b', { text: t.name + ': answer to get a shot!  (shot ' + (shot + 1) + ' of ' + shots + ')' })); info.appendChild(U().btn('❓ Ask me', 'big amber', ask)); U().teamBar(T, turn);
      }
      var asking = false;
      async function ask() {
        if (asking || mode !== 'wait') return; asking = true; var t = T[turn], res = await U().ask(ctx.nextItem(), t, { timer: +ctx.cfg.timer || 0, label: 'Shot ' + (shot + 1) });
        asking = false;
        if (!res.ok) { info.innerHTML = ''; info.appendChild(U().h('b', { text: 'No shot this time. Next team!' })); shot++; await U().sleep(1200); if (shot >= shots) { ctx.end(); return; } turn = (turn + 1) % nt; showTurn(); return; }
        mode = 'aim'; info.innerHTML = ''; info.appendChild(U().monFace(t.mon, 46)); info.appendChild(U().h('b', { text: '🎯 Pull back from the cannon and let go!' })); A().play('round');
      }
      showTurn();
    }
  };
})(window);
