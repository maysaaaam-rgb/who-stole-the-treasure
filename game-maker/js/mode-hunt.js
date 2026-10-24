/* Game Maker mode 3: Treasure / Pumpkin Hunt.
   Powered by GM.engine (GameEngineCore) with squash-and-stretch monster hops, treasure shockwaves, and 1-8 team rotation. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {}; GM.modes = GM.modes || {};
  var U = function () { return GM.u; }, A = function () { return GM.audio; }, J = function () { return GM.juice; }, E = function () { return GM.engine; };
  var COLS = 8, ROWS = 6, DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  var PRIZES = [{ v: 10, e: '🪙' }, { v: 15, e: '💎' }, { v: 25, e: '🏆' }, { v: 50, e: '👑' }, { v: 5, e: '⭐' }];

  GM.modes.hunt = {
    id: 'hunt', name: 'Pumpkin Hunt', nameClassic: 'Treasure Hunt', e: '🔦',
    desc: 'Your monster digs a line of pumpkins to find hidden prizes. A right answer says how far!',
    descClassic: 'Your monster digs a line of bushes to find hidden prizes. A right answer says how far!',
    fields: [{ key: 'q', label: 'Turns for each team', opts: [[2, '2'], [3, '3'], [4, '4'], [6, '6'], [8, '8']], def: 4 }],
    start: function (ctx) {
      var cfg = ctx.cfg, st = GM.state, rootEl = ctx.root, hal = st.theme === 'halloween';
      var totalTurns = (+cfg.q || 4) * st.teams.length;
      var eng = E().createSession(ctx, { maxRounds: totalTurns });
      var nt = eng.teamCount;
      rootEl.innerHTML = '';

      var info = U().h('div', { class: 'gm-info' });
      var field = U().h('div', { class: 'gm-hunt' });
      var layer = U().h('div', { class: 'gm-hlayer' });
      var box = U().h('div', { class: 'gm-huntbox' }, [field, layer]);
      var wrap = U().h('div', { class: 'gm-boardwrap' }, [info, box]);
      rootEl.appendChild(wrap);

      if (hal) {
        box.appendChild(U().art('c_bat', '🦇', 'gm-deco l'));
        box.appendChild(U().art('o_spider', '🕷️', 'gm-deco r'));
      }
      field.style.gridTemplateColumns = 'repeat(' + COLS + ', 1fr)';
      field.style.gridTemplateRows = 'repeat(' + ROWS + ', 1fr)';

      var per = [], r, c, i;
      for (c = 0; c < COLS; c++) per.push([0, c]);
      for (r = 1; r < ROWS; r++) per.push([r, COLS - 1]);
      for (c = COLS - 2; c >= 0; c--) per.push([ROWS - 1, c]);
      for (r = ROWS - 2; r > 0; r--) per.push([r, 0]);

      var cells = [], mons = [];
      for (r = 0; r < ROWS; r++) {
        cells.push([]);
        for (c = 0; c < COLS; c++) cells[r].push({ r: r, c: c, dug: false, prize: null, el: null, ray: -1 });
      }
      for (i = 0; i < nt; i++) {
        var sp = per[Math.floor(i * per.length / nt)];
        cells[sp[0]][sp[1]].dug = true;
        mons.push({ r: sp[0], c: sp[1], el: null });
      }

      var free = [];
      cells.forEach(function (row) { row.forEach(function (cl) { if (!cl.dug) free.push(cl); }); });
      var weights = [14, 10, 6, 3, 11], bag = [];
      PRIZES.forEach(function (p, k) { for (var z = 0; z < weights[k]; z++) bag.push(p); });
      bag = U().shuffle(bag);
      free = U().shuffle(free);
      free.forEach(function (cl, k) { cl.prize = bag[k % bag.length]; });

      cells.forEach(function (row) {
        row.forEach(function (cl) {
          var b = U().h('button', {
            type: 'button',
            class: 'gm-hcell' + (cl.dug ? ' dug' : '')
          }, [cl.dug ? null : U().art(hal ? 'o_hunt_pumpkin_blank' : 'o_bush', hal ? '🎃' : '🌳', 'gm-pumpk')]);
          cl.el = b;
          field.appendChild(b);
          eng.listen(b, 'pointerdown', function (e) {
            e.preventDefault();
            choose(cl);
          });
        });
      });

      function place(m) {
        var s = 100 / COLS, t = 100 / ROWS;
        m.el.style.left = (m.c * s) + '%';
        m.el.style.top = (m.r * t) + '%';
        m.el.style.width = s + '%';
        m.el.style.height = t + '%';
      }

      mons.forEach(function (m, k) {
        var t = eng.teams[k];
        m.el = U().h('div', { class: 'gm-hmon' }, [
          U().monFace(t.mon, Math.round(Math.min(96, Math.max(54, (root.innerHeight || 900) / 13))))
        ]);
        m.el.style.setProperty('--c', t.color);
        layer.appendChild(m.el);
        place(m);
      });

      var rays = [];
      function occupied(r2, c2, me) { return mons.some(function (m, k) { return k !== me && m.r === r2 && m.c === c2; }); }
      function clearRays() {
        rays = [];
        cells.forEach(function (row) { row.forEach(function (cl) { cl.el.classList.remove('ray'); cl.ray = -1; }); });
      }
      function showRays(n) {
        clearRays();
        var turn = eng.state.turn, m = mons[turn];
        DIRS.forEach(function (d) {
          var path = [], rr = m.r, cc = m.c;
          for (var s = 0; s < n; s++) {
            rr += d[0]; cc += d[1];
            if (rr < 0 || cc < 0 || rr >= ROWS || cc >= COLS || occupied(rr, cc, turn)) break;
            path.push(cells[rr][cc]);
          }
          if (path.length) rays.push(path);
        });
        rays.forEach(function (p, k) { p.forEach(function (cl) { cl.el.classList.add('ray'); cl.ray = k; }); });
        return rays.length > 0;
      }

      function showTurn() {
        var t = eng.activeTeam(), turn = eng.state.turn;
        eng.setPhase('idle');
        clearRays();
        info.innerHTML = '';
        info.style.setProperty('--c', t.color);
        info.appendChild(U().monFace(t.mon, 46));
        info.appendChild(U().h('b', {
          text: t.name + ': answer to roll your digging number!  (turn ' + (eng.state.round + 1) + ' of ' + eng.state.maxRounds + ')'
        }));
        info.appendChild(U().btn('❓ Ask me', 'big amber', ask));
        mons.forEach(function (m, k) { m.el.classList.toggle('active', k === turn); });
      }

      async function ask() {
        if (eng.state.phase !== 'idle' || !eng.state.alive) return;
        var t = eng.activeTeam();
        var res = await eng.ask(null, { label: 'Turn ' + (eng.state.round + 1) });
        if (!eng.state.alive || res.cancelled) return;
        if (!res.ok) {
          eng.setPhase('animating');
          info.innerHTML = '';
          info.appendChild(U().h('b', { text: 'Good try! Next team\u2019s turn to dig.' }));
          await eng.wait(1000);
          if (!eng.state.alive) return;
          if (eng.advanceRound()) {
            eng.nextTurn();
            showTurn();
          }
          return;
        }
        var n = U().rand(2, 5);
        A().play('round');
        info.innerHTML = '';
        info.style.setProperty('--c', t.color);
        info.appendChild(U().monFace(t.mon, 46));
        var diceEl = U().h('div', { class: 'gm-dice', text: String(n) });
        info.appendChild(diceEl);
        J().squash(diceEl, 1.24, 0.78, 280);
        info.appendChild(U().h('b', { text: 'Dig ' + n + (hal ? ' pumpkins' : ' bushes') + ' in a line! Tap any glowing square.' }));
        if (!showRays(n)) {
          info.appendChild(U().h('b', { text: ' (No room to dig \u2014 +10 bonus!)' }));
          eng.award(eng.state.turn, 10, mons[eng.state.turn].el, '+10');
          await eng.wait(1100);
          if (!eng.state.alive) return;
          if (eng.advanceRound()) {
            eng.nextTurn();
            showTurn();
          }
          return;
        }
        eng.setPhase('action');
      }

      async function choose(cl) {
        if (eng.state.phase !== 'action' || cl.ray == null || cl.ray < 0 || !eng.state.alive) return;
        eng.setPhase('animating');
        var turn = eng.state.turn, t = eng.activeTeam(), path = rays[cl.ray], m = mons[turn];
        clearRays();
        var dugAny = false;
        for (var k = 0; k < path.length; k++) {
          var p = path[k];
          A().play('hunt_step');
          m.r = p.r; m.c = p.c;
          place(m);
          J().squash(m.el, 1.18, 0.84, 220);
          await eng.wait(300);
          if (!eng.state.alive) return;
          if (!p.dug) {
            p.dug = true;
            dugAny = true;
            A().play('hunt_rustle');
            await eng.wait(140);
            if (!eng.state.alive) return;
            A().play('hunt_dig');
            p.el.classList.add('dug');
            U().fx('smoke_puff', p.el);
            p.el.innerHTML = '';
            var prEl = U().h('span', { class: 'gm-prize', text: p.prize.e });
            p.el.appendChild(prEl);
            J().squash(prEl, 1.28, 0.75, 280);
            J().sparks(p.el, p.prize.v >= 25 ? 20 : 10, [t.color, '#ffe066', '#ffffff'], 7);
            A().play('hunt_prize');
            eng.award(turn, p.prize.v, p.el, '+' + p.prize.v);
            if (p.prize.v >= 25) {
              J().shockwave(p.el, '#ffe066', 140, 460);
              J().shake(6);
              U().confetti(14);
              U().fx('coin_shower', p.el, 1.2);
              if (hal) A().play('witch');
            }
            await eng.wait(340);
            if (!eng.state.alive) return;
          }
        }
        if (!dugAny) {
          eng.award(turn, 5, m.el, '+5 Walk!');
        }
        U().wobble(document.getElementById('gm-team-' + turn));
        await eng.wait(450);
        if (!eng.state.alive) return;
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
