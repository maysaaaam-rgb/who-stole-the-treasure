/* Game Maker mode 2: Plink-oh!
   Powered by GM.engine (GameEngineCore) with 60fps sub-step peg physics, peg spark bursts, and squash-and-stretch landing. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {}; GM.modes = GM.modes || {};
  var U = function () { return GM.u; }, A = function () { return GM.audio; }, J = function () { return GM.juice; }, E = function () { return GM.engine; };
  var W = 520, H = 640, PEG = 7, DISC = 24, SLOT_Y = 560, NCOL = 10, SLOTS = [10, 20, 50, 20, 10], G = 1300;

  GM.modes.plinko = {
    id: 'plinko', name: 'Prize Machine', nameClassic: 'Prize Machine', e: '🎰',
    desc: 'Answer right, then time your DROP! Your ball bounces down the prize machine. Hit the flashing JACKPOT for double!',
    descClassic: 'Answer right, then time your DROP! Your ball bounces down the prize machine. Hit the flashing JACKPOT for double!',
    fields: [{ key: 'q', label: 'Drops for each team', opts: [[2, '2'], [3, '3'], [4, '4'], [6, '6'], [8, '8']], def: 3 }],
    start: function (ctx) {
      var cfg = ctx.cfg, st = GM.state, rootEl = ctx.root, hal = st.theme === 'halloween';
      var totalDrops = (+cfg.q || 3) * st.teams.length;
      var eng = E().createSession(ctx, { maxRounds: totalDrops });
      rootEl.innerHTML = '';

      var info = U().h('div', { class: 'gm-info' });
      var board = U().h('div', { class: 'gm-pl' });
      var bulbs = U().h('div', { class: 'gm-pm-bulbs' });
      /* light bulbs all the way round the cabinet (top, right, bottom, left) */
      (function () {
        var pts = [], k, n = 9, m = 11;
        for (k = 0; k <= n; k++) pts.push([k / n * 100, 0]);
        for (k = 1; k <= m; k++) pts.push([100, k / m * 100]);
        for (k = n - 1; k >= 0; k--) pts.push([k / n * 100, 100]);
        for (k = m - 1; k >= 1; k--) pts.push([0, k / m * 100]);
        pts.forEach(function (p, j) { bulbs.appendChild(U().h('i', { style: 'left:' + p[0] + '%;top:' + p[1] + '%;animation-delay:' + (-(j % 3) * 0.24) + 's' })); });
      })();
      var cab = U().h('div', { class: 'gm-pm-cab' }, [U().h('div', { class: 'gm-pm-sign', text: '★ PRIZE MACHINE ★' }), bulbs, board]);
      var box = U().h('div', { class: 'gm-plbox gm-pm-box' }, [cab]);
      var i;
      var cols = U().h('div', { class: 'gm-plcols' });
      var wrap = U().h('div', { class: 'gm-boardwrap' }, [info, box]);
      rootEl.appendChild(wrap);

      if (hal) {
        box.appendChild(U().art('c_ghost', '👻', 'gm-deco l'));
        box.appendChild(U().art('c_cat_witch', '🐈‍⬛', 'gm-deco r'));
      }
      board.style.width = W + 'px';
      board.style.height = H + 'px';

      var pegs = [], r, x, y;
      for (r = 0; r < 6; r++) {
        y = 150 + r * 62;
        var n = r % 2 ? 6 : 5;
        for (i = 0; i < n; i++) {
          x = (r % 2 ? 40 : 84) + i * 88;
          pegs.push({ x: x, y: y, el: null });
        }
      }
      pegs.forEach(function (p) {
        var d = U().h('div', { class: 'gm-peg' });
        d.style.left = (p.x - PEG) + 'px';
        d.style.top = (p.y - PEG) + 'px';
        board.appendChild(d);
        p.el = d;
      });

      var slotEls = SLOTS.map(function (v, k) {
        var s = U().h('div', { class: 'gm-slot gm-pm-slot s' + (v >= 50 ? 'hi' : v >= 20 ? 'mid' : 'lo') }, [
          U().art(v >= 50 ? 'pu_gold' : v >= 20 ? 'pu_gift' : 'o_star_coin', v >= 50 ? '💰' : v >= 20 ? '🎁' : '⭐', 'gm-pm-prize'),
          U().h('b', { text: String(v) }), U().h('span', { class: 'gm-pm-jp', text: 'JACKPOT ×2' })
        ]);
        s.style.left = (k * W / 5 + 3) + 'px';
        s.style.width = (W / 5 - 6) + 'px';
        s.style.top = SLOT_Y + 'px';
        board.appendChild(s);
        return s;
      });

      board.appendChild(cols);
      var disc = U().h('div', { class: 'gm-disc' });
      disc.style.display = 'none';
      board.appendChild(disc);

      function fit() {
        var CW = W + 44, CH = H + 78;   /* the cabinet adds a frame and a sign */
        var s = Math.min((box.clientWidth || CW) / CW, (box.clientHeight || CH) / CH, 1.25);
        cab.style.transform = 'scale(' + s + ')';
        cab.style.transformOrigin = 'top center';
        box.style.setProperty('--s', s);
      }
      var ro = root.ResizeObserver ? new ResizeObserver(fit) : null;
      if (ro) ro.observe(box);
      eng.listen(root, 'resize', fit);
      eng.timeout(fit, 30);
      ctx.onEnd(function () { if (ro) ro.disconnect(); });

      /* the dropper slides left and right; the team presses DROP (or Space / taps the machine) to let the ball go */
      var dropper = U().h('div', { class: 'gm-pm-dropper' }, [U().h('i')]);
      board.appendChild(dropper);
      var jackpot = -1, dropX = W / 2, swing = 0, swingOn = false;
      function pickJackpot() {
        slotEls.forEach(function (el) { el.classList.remove('jackpot'); });
        jackpot = U().rand(0, SLOTS.length - 1);
        slotEls[jackpot].classList.add('jackpot');
      }
      function startSwing() {
        swingOn = true; dropper.classList.add('on');
        var speed = 0.0021 + Math.random() * 0.0009;
        eng.raf(function (dt) {
          if (!swingOn || !eng.state.alive) return false;
          swing += dt * 1000 * speed;
          dropX = W / 2 + Math.sin(swing) * (W / 2 - DISC - 8);
          dropper.style.left = dropX + 'px';
          disc.style.left = (dropX - DISC) + 'px';
          return true;
        });
      }
      function setCols(on) { if (!on) { swingOn = false; dropper.classList.remove('on'); } }
      eng.listen(board, 'pointerdown', function (e) { if (eng.state.phase === 'action') { e.preventDefault(); drop(); } });
      eng.listen(document, 'keydown', function (e) { if ((e.key === ' ' || e.key === 'Enter') && eng.state.phase === 'action') { e.preventDefault(); drop(); } });

      function showTurn() {
        var t = eng.activeTeam();
        eng.setPhase('idle');
        setCols(false);
        info.innerHTML = '';
        info.style.setProperty('--c', t.color);
        info.appendChild(U().monFace(t.mon, 46));
        info.appendChild(U().h('b', {
          text: t.name + ': answer to drop your ' + (hal ? 'pumpkin' : 'disc') + '!  (drop ' + (eng.state.round + 1) + ' of ' + eng.state.maxRounds + ')'
        }));
        info.appendChild(U().btn('❓ Ask me', 'big amber', ask));
        disc.className = 'gm-disc' + (hal ? ' hal' : '');
        disc.innerHTML = '';
        disc.appendChild(U().monFace(t.mon, DISC * 1.9));
        disc.style.display = '';
        disc.style.left = (dropX - DISC) + 'px';
        disc.style.top = '70px';
        disc.style.transform = '';
        dropper.style.left = dropX + 'px';
        pickJackpot();
      }

      async function ask() {
        if (eng.state.phase !== 'idle' || !eng.state.alive) return;
        var t = eng.activeTeam();
        var res = await eng.ask(null, { label: 'Drop ' + (eng.state.round + 1) });
        if (!eng.state.alive || res.cancelled) return;
        if (res.ok) {
          eng.setPhase('action');
          info.innerHTML = '';
          info.style.setProperty('--c', t.color);
          info.appendChild(U().monFace(t.mon, 46));
          info.appendChild(U().h('b', { text: '✨ Right! Watch the machine… press DROP!' }));
          info.appendChild(U().btn('⬇ DROP!', 'big green', function () { drop(); }));
          startSwing();
          A().play('round');
        } else {
          eng.setPhase('animating');
          info.innerHTML = '';
          info.appendChild(U().h('b', { text: 'Good try! Next team\u2019s drop.' }));
          U().wobble(disc);
          await eng.wait(1000);
          if (!eng.state.alive) return;
          if (eng.advanceRound()) {
            eng.nextTurn();
            showTurn();
          }
        }
      }

      function drop() {
        if (eng.state.phase !== 'action' || !eng.state.alive) return;
        eng.setPhase('animating');
        setCols(false);
        dropper.classList.add('open'); eng.timeout(function () { dropper.classList.remove('open'); }, 400);
        var dbtn = info.querySelector('.gm-btn'); if (dbtn) dbtn.remove();
        var tip = info.querySelector('b'); if (tip) tip.textContent = '⬇ Here it goes…';
        A().play('plinko_drop'); A().play('whoosh_soft');
        J().squash(disc, 0.86, 1.18, 200);

        var px = dropX, py = 70, vx = (Math.random() - 0.5) * 42, vy = 0;
        var lastSnd = 0, elapsed = 0;
        disc.style.left = (px - DISC) + 'px';
        disc.style.top = (py - DISC) + 'px';

        eng.raf(function (dt, now) {
          elapsed += dt;
          var steps = Math.max(1, Math.ceil(dt * 240)), sd = dt / steps, s;
          for (s = 0; s < steps; s++) {
            vy += G * sd;
            px += vx * sd;
            py += vy * sd;
            if (px < DISC) { px = DISC; vx = Math.abs(vx) * 0.62; }
            if (px > W - DISC) { px = W - DISC; vx = -Math.abs(vx) * 0.62; }
            for (var p = 0; p < pegs.length; p++) {
              var dx = px - pegs[p].x, dy = py - pegs[p].y, d2 = dx * dx + dy * dy, R = DISC + PEG;
              if (d2 < R * R) {
                var d = Math.sqrt(d2) || 0.01, nx = dx / d, ny = dy / d, vn = vx * nx + vy * ny;
                px = pegs[p].x + nx * R;
                py = pegs[p].y + ny * R;
                if (vn < 0) {
                  vx -= 1.62 * vn * nx;
                  vy -= 1.62 * vn * ny;
                  vx += (Math.random() - 0.5) * 62;
                }
                if (now - lastSnd > 68) {
                  A().play('plinko_peg'); A().play('wood_knock');
                  lastSnd = now;
                  var pegEl = pegs[p].el;
                  pegEl.classList.add('hit');
                  J().sparks(pegEl, 5, ['#ffffff', '#ffe066', '#38bdf8'], 4);
                  eng.timeout(function () { pegEl.classList.remove('hit'); }, 160);
                }
              }
            }
          }
          disc.style.left = (px - DISC) + 'px';
          disc.style.top = (py - DISC) + 'px';
          disc.style.transform = 'rotate(' + Math.round(px * 1.5) + 'deg)';
          if (py >= SLOT_Y || elapsed > 12) {
            land(px);
            return false;
          }
          return true;
        });
      }

      async function land(x) {
        if (!eng.state.alive) return;
        var si = Math.max(0, Math.min(4, Math.floor(x / (W / 5)))), bonus = si === jackpot;
        var base = SLOTS[si], v = base * (bonus ? 2 : 1), el = slotEls[si];
        disc.style.left = (si * W / 5 + W / 10 - DISC) + 'px';
        disc.style.top = (SLOT_Y + 14) + 'px';
        disc.style.transform = 'none';
        el.classList.add('win');
        A().play('disc_bounce'); A().play('coin_collect'); A().play('sparkle');
        if (base >= 50) A().play('crowd_cheer_small');
        A().play(base >= 50 ? 'slot_high' : base >= 20 ? 'slot_mid' : 'slot_low');
        if (hal) A().play(base >= 50 ? 'witch' : 'ghost');
        J().squash(disc, 1.26, 0.76, 260);
        J().shockwave(el, base >= 50 ? '#ff5d9e' : '#2ecc71', base >= 50 ? 180 : 120, 480);
        J().sparks(el, base >= 50 ? 26 : 14, ['#ffe066', '#ff5d73', '#2ecc71', '#ffffff'], 8);
        if (base >= 50 || bonus) J().shake(bonus ? 11 : 7);
        el.classList.add('pop'); eng.timeout(function () { el.classList.remove('pop'); }, 900);
        eng.award(eng.state.turn, v, el, (bonus ? '🎰 JACKPOT ' : '') + '+' + v);
        U().confetti(bonus ? 40 : base >= 50 ? 26 : 10);
        if (bonus) { A().play('crowd_roar_big'); U().fx('coin_shower', el, 1.6); }
        U().fx(base >= 50 ? 'confetti_burst' : 'sparkle_burst', el, 1.2);
        U().wobble(document.getElementById('gm-team-' + eng.state.turn));

        await eng.wait(1500);
        if (!eng.state.alive) return;
        el.classList.remove('win');
        if (eng.advanceRound()) {
          eng.nextTurn();
          showTurn();
        }
      }

      eng.setTurn(0, true);
      showTurn();
    }
  };
})(window);
