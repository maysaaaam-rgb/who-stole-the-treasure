/* Game Maker mode 2: Plink-oh (Halloween Pumpkin Plink-oh). A right answer earns a drop: the team picks a column, the team's pumpkin
   (with the team's monster inside) falls through the pegs and lands in a points slot. Own physics, works offline. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {}; GM.modes = GM.modes || {};
  var U = function () { return GM.u; }, A = function () { return GM.audio; };
  var W = 520, H = 640, PEG = 7, DISC = 24, SLOT_Y = 560, NCOL = 10, SLOTS = [10, 20, 50, 20, 10], G = 1300;

  GM.modes.plinko = {
    id: 'plinko', name: 'Plink-oh!', nameClassic: 'Plink-oh!', e: '🎃', desc: 'Answer right to drop your pumpkin. It bounces through the pegs into a points slot!', descClassic: 'Answer right to drop your monster disc. It bounces through the pegs into a points slot!',
    fields: [{ key: 'q', label: 'Drops for each team', opts: [[2, '2'], [3, '3'], [4, '4'], [6, '6'], [8, '8']], def: 3 }],
    start: function (ctx) {
      var cfg = ctx.cfg, st = GM.state, rootEl = ctx.root, rounds = (+cfg.q || 3) * st.teams.length, round = 0, turn = 0, busy = false, hal = st.theme === 'halloween';
      rootEl.innerHTML = '';
      var info = U().h('div', { class: 'gm-info' }), board = U().h('div', { class: 'gm-pl' }), box = U().h('div', { class: 'gm-plbox' }, [board]), cols = U().h('div', { class: 'gm-plcols' });
      var wrap = U().h('div', { class: 'gm-boardwrap' }, [info, box]);
      rootEl.appendChild(wrap);
      if (hal) { box.appendChild(U().art('c_ghost', '👻', 'gm-deco l')); box.appendChild(U().art('c_cat_witch', '🐈‍⬛', 'gm-deco r')); }
      board.style.width = W + 'px'; board.style.height = H + 'px';
      var pegs = [], r, i, x, y;
      for (r = 0; r < 6; r++) { y = 150 + r * 62; var n = r % 2 ? 6 : 5; for (i = 0; i < n; i++) { x = (r % 2 ? 40 : 84) + i * 88; pegs.push({ x: x, y: y }); } }
      pegs.forEach(function (p) { var d = U().h('div', { class: 'gm-peg' }); d.style.left = (p.x - PEG) + 'px'; d.style.top = (p.y - PEG) + 'px'; board.appendChild(d); p.el = d; });
      var slotEls = SLOTS.map(function (v, k) { var s = U().h('div', { class: 'gm-slot s' + (v >= 50 ? 'hi' : v >= 20 ? 'mid' : 'lo') }, [U().h('b', { text: String(v) })]); s.style.left = (k * W / 5 + 3) + 'px'; s.style.width = (W / 5 - 6) + 'px'; s.style.top = SLOT_Y + 'px'; board.appendChild(s); return s; });
      board.appendChild(cols);
      var disc = U().h('div', { class: 'gm-disc' }); disc.style.display = 'none'; board.appendChild(disc);
      function fit() { var s = Math.min((box.clientWidth || W) / W, (box.clientHeight || H) / H, 1.25); board.style.transform = 'scale(' + s + ')'; board.style.transformOrigin = 'top center'; box.style.setProperty('--s', s); }
      var ro = root.ResizeObserver ? new ResizeObserver(fit) : null; if (ro) ro.observe(box); root.addEventListener('resize', fit); setTimeout(fit, 30);
      ctx.onEnd(function () { if (ro) ro.disconnect(); root.removeEventListener('resize', fit); });
      var sparkle = [U().rand(0, NCOL - 1), U().rand(0, NCOL - 1)];
      for (i = 0; i < NCOL; i++) { (function (k) { var b = U().h('button', { type: 'button', class: 'gm-col', text: sparkle.indexOf(k) >= 0 ? '✨' : String(k + 1) }); b.style.left = (26 + k * 49.5 - 22) + 'px'; b.disabled = true; b.addEventListener('click', function () { drop(k); }); cols.appendChild(b); })(i); }
      function setCols(on) { [].forEach.call(cols.children, function (b) { b.disabled = !on; b.classList.toggle('on', on); }); }
      function showTurn() {
        var t = st.teams[turn]; info.innerHTML = ''; info.style.setProperty('--c', t.color); info.appendChild(U().monFace(t.mon, 46)); info.appendChild(U().h('b', { text: t.name + ': answer to drop your pumpkin!  (drop ' + (round + 1) + ' of ' + rounds + ')' }));
        info.appendChild(U().btn('❓ Ask me', 'big amber', ask)); U().teamBar(st.teams, turn);
        disc.className = 'gm-disc' + (hal ? ' hal' : ''); disc.innerHTML = ''; disc.appendChild(U().monFace(t.mon, DISC * 1.9)); disc.style.display = '';
        disc.style.left = (W / 2 - DISC) + 'px'; disc.style.top = '70px'; disc.style.transition = '';
      }
      async function ask() {
        if (busy) return; busy = true; var t = st.teams[turn], res = await U().ask(ctx.nextItem(), t, { timer: +cfg.timer || 0, label: 'Drop ' + (round + 1) });
        if (res.ok) { info.innerHTML = ''; info.appendChild(U().monFace(t.mon, 46)); info.appendChild(U().h('b', { text: 'Right! Pick a column to drop the pumpkin!' })); setCols(true); A().play('round'); busy = false; }
        else { info.innerHTML = ''; info.appendChild(U().h('b', { text: 'No drop this time. Next team!' })); U().wobble(disc); await U().sleep(1100); busy = false; next(); }
      }
      function next() { round++; if (round >= rounds) { U().sleep(400).then(ctx.end); return; } turn = (turn + 1) % st.teams.length; showTurn(); }
      function drop(k) {
        if (busy) return; busy = true; setCols(false); A().play('plinko_drop');
        var px = 26 + k * 49.5, py = 70, vx = (Math.random() - 0.5) * 40, vy = 0, last = performance.now(), hit = 0, lastSnd = 0, born = last, bonus = sparkle.indexOf(k) >= 0;
        disc.style.left = (px - DISC) + 'px'; disc.style.top = (py - DISC) + 'px';
        function frame(now) {
          var dt = Math.min(0.05, (now - last) / 1000), steps = Math.ceil(dt * 240), sd = dt / steps, s;
          last = now;
          for (s = 0; s < steps; s++) {
            vy += G * sd; px += vx * sd; py += vy * sd;
            if (px < DISC) { px = DISC; vx = Math.abs(vx) * 0.6; } if (px > W - DISC) { px = W - DISC; vx = -Math.abs(vx) * 0.6; }
            for (var p = 0; p < pegs.length; p++) {
              var dx = px - pegs[p].x, dy = py - pegs[p].y, d2 = dx * dx + dy * dy, R = DISC + PEG;
              if (d2 < R * R) {
                var d = Math.sqrt(d2) || 0.01, nx = dx / d, ny = dy / d, vn = vx * nx + vy * ny;
                px = pegs[p].x + nx * R; py = pegs[p].y + ny * R;
                if (vn < 0) { vx -= 1.6 * vn * nx; vy -= 1.6 * vn * ny; vx += (Math.random() - 0.5) * 60; }
                if (now - lastSnd > 70) { A().play('plinko_peg'); lastSnd = now; pegs[p].el.classList.add('hit'); (function (e) { setTimeout(function () { e.classList.remove('hit'); }, 160); })(pegs[p].el); hit++; }
              }
            }
          }
          disc.style.left = (px - DISC) + 'px'; disc.style.top = (py - DISC) + 'px'; disc.style.transform = 'rotate(' + Math.round(px * 1.5) + 'deg)';
          if (py >= SLOT_Y || now - born > 14000) { land(px); return; }
          requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
        async function land(x) {
          var si = Math.max(0, Math.min(4, Math.floor(x / (W / 5)))), v = SLOTS[si] * (bonus ? 2 : 1), el = slotEls[si];
          disc.style.left = (si * W / 5 + W / 10 - DISC) + 'px'; disc.style.top = (SLOT_Y + 14) + 'px'; disc.style.transform = 'none'; el.classList.add('win');
          A().play(SLOTS[si] >= 50 ? 'slot_high' : SLOTS[si] >= 20 ? 'slot_mid' : 'slot_low'); if (hal) A().play(SLOTS[si] >= 50 ? 'witch' : 'ghost');
          U().addScore(turn, v); U().floatText('+' + v + (bonus ? ' ✨×2' : ''), el, 'good'); U().confetti(SLOTS[si] >= 50 ? 24 : 8); if (SLOTS[si] >= 50) U().fx('confetti_burst', el, 1.2); else U().fx('sparkle_burst', el); U().wobble(document.getElementById('gm-team-' + turn));
          await U().sleep(1600); el.classList.remove('win'); busy = false; next();
        }
      }
      showTurn();
    }
  };
})(window);
