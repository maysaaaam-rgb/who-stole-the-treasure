/* Game Maker mode 3: Pumpkin Hunt. Each team has a monster on a field of pumpkins. A right answer gives a number: the monster digs
   a straight line of that many pumpkins and wins the prizes hidden in them. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {}; GM.modes = GM.modes || {};
  var U = function () { return GM.u; }, A = function () { return GM.audio; };
  var COLS = 8, ROWS = 6, DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  var PRIZES = [{ v: 5, e: '🪙' }, { v: 10, e: '💎' }, { v: 20, e: '🏆' }, { v: 50, e: '👑' }, { v: 0, e: '👻' }];

  GM.modes.hunt = {
    id: 'hunt', name: 'Pumpkin Hunt', e: '🔦', desc: 'Your monster digs a line of pumpkins to find hidden prizes. A right answer says how far!',
    fields: [{ key: 'q', label: 'Turns for each team', opts: [[2, '2'], [3, '3'], [4, '4'], [6, '6'], [8, '8']], def: 4 }],
    start: function (ctx) {
      var cfg = ctx.cfg, st = GM.state, rootEl = ctx.root, nt = st.teams.length, rounds = (+cfg.q || 4) * nt, round = 0, turn = 0, busy = false, hal = st.theme === 'halloween';
      rootEl.innerHTML = '';
      var info = U().h('div', { class: 'gm-info' }), field = U().h('div', { class: 'gm-hunt' }), layer = U().h('div', { class: 'gm-hlayer' }), box = U().h('div', { class: 'gm-huntbox' }, [field, layer]);
      var wrap = U().h('div', { class: 'gm-boardwrap' }, [info, box]); rootEl.appendChild(wrap);
      if (hal) { box.appendChild(U().art('c_bat', '🦇', 'gm-deco l')); box.appendChild(U().art('c_spider' in {} ? 'c_spider' : 'o_spider', '🕷️', 'gm-deco r')); }
      field.style.gridTemplateColumns = 'repeat(' + COLS + ', 1fr)'; field.style.gridTemplateRows = 'repeat(' + ROWS + ', 1fr)';
      /* the perimeter, clockwise: teams start evenly spaced around it */
      var per = [], r, c, i;
      for (c = 0; c < COLS; c++) per.push([0, c]); for (r = 1; r < ROWS; r++) per.push([r, COLS - 1]); for (c = COLS - 2; c >= 0; c--) per.push([ROWS - 1, c]); for (r = ROWS - 2; r > 0; r--) per.push([r, 0]);
      var cells = [], mons = [];
      for (r = 0; r < ROWS; r++) { cells.push([]); for (c = 0; c < COLS; c++) cells[r].push({ r: r, c: c, dug: false, prize: null, el: null }); }
      for (i = 0; i < nt; i++) { var sp = per[Math.floor(i * per.length / nt)]; cells[sp[0]][sp[1]].dug = true; mons.push({ r: sp[0], c: sp[1], el: null }); }
      var free = []; cells.forEach(function (row) { row.forEach(function (cl) { if (!cl.dug) free.push(cl); }); });
      var weights = [14, 10, 6, 2, 12], bag = []; PRIZES.forEach(function (p, k) { for (var z = 0; z < weights[k]; z++) bag.push(p); }); bag = U().shuffle(bag);
      free = U().shuffle(free); free.forEach(function (cl, k) { cl.prize = bag[k % bag.length]; });
      cells.forEach(function (row) { row.forEach(function (cl) {
        var b = U().h('button', { type: 'button', class: 'gm-hcell' + (cl.dug ? ' dug' : '') }, [cl.dug ? null : U().art('o_hunt_pumpkin_blank', hal ? '🎃' : '🌿', 'gm-pumpk')]); cl.el = b; field.appendChild(b);
        b.addEventListener('click', function () { choose(cl); });
      }); });
      function place(m, k) { var s = 100 / COLS, t = 100 / ROWS; m.el.style.left = (m.c * s) + '%'; m.el.style.top = (m.r * t) + '%'; m.el.style.width = s + '%'; m.el.style.height = t + '%'; }
      mons.forEach(function (m, k) { var t = st.teams[k]; m.el = U().h('div', { class: 'gm-hmon' }, [U().monFace(t.mon, 58)]); m.el.style.setProperty('--c', t.color); layer.appendChild(m.el); place(m, k); });
      var rays = [], allowed = false;
      function occupied(r2, c2, me) { return mons.some(function (m, k) { return k !== me && m.r === r2 && m.c === c2; }); }
      function clearRays() { rays = []; allowed = false; cells.forEach(function (row) { row.forEach(function (cl) { cl.el.classList.remove('ray'); cl.ray = -1; }); }); }
      function showRays(n) {
        clearRays(); var m = mons[turn];
        DIRS.forEach(function (d) { var path = [], rr = m.r, cc = m.c; for (var s = 0; s < n; s++) { rr += d[0]; cc += d[1]; if (rr < 0 || cc < 0 || rr >= ROWS || cc >= COLS || occupied(rr, cc, turn)) break; path.push(cells[rr][cc]); } if (path.length) rays.push(path); });
        rays.forEach(function (p, k) { p.forEach(function (cl) { cl.el.classList.add('ray'); cl.ray = k; }); }); allowed = rays.length > 0; return allowed;
      }
      function showTurn() {
        var t = st.teams[turn]; info.innerHTML = ''; info.style.setProperty('--c', t.color); info.appendChild(U().monFace(t.mon, 46)); info.appendChild(U().h('b', { text: t.name + ': answer to roll your digging number!  (turn ' + (round + 1) + ' of ' + rounds + ')' }));
        info.appendChild(U().btn('❓ Ask me', 'big amber', ask)); U().teamBar(st.teams, turn);
        mons.forEach(function (m, k) { m.el.classList.toggle('active', k === turn); });
      }
      async function ask() {
        if (busy) return; busy = true; var t = st.teams[turn], res = await U().ask(ctx.nextItem(), t, { timer: +cfg.timer || 0, label: 'Turn ' + (round + 1) });
        if (!res.ok) { info.innerHTML = ''; info.appendChild(U().h('b', { text: 'No digging this time. Next team!' })); await U().sleep(1100); busy = false; next(); return; }
        var n = U().rand(2, 5); A().play('round'); info.innerHTML = ''; info.appendChild(U().monFace(t.mon, 46)); info.appendChild(U().h('div', { class: 'gm-dice', text: String(n) })); info.appendChild(U().h('b', { text: 'Dig ' + n + ' pumpkins in a line! Tap a glowing line.' }));
        if (!showRays(n)) { info.appendChild(U().h('b', { text: ' (No room to dig!)' })); await U().sleep(1200); busy = false; next(); return; }
        busy = false;
      }
      function next() { clearRays(); round++; if (round >= rounds) { U().sleep(400).then(ctx.end); return; } turn = (turn + 1) % nt; showTurn(); }
      async function choose(cl) {
        if (!allowed || busy || cl.ray == null || cl.ray < 0) return; busy = true; var path = rays[cl.ray], m = mons[turn], t = st.teams[turn]; clearRays();
        for (var k = 0; k < path.length; k++) {
          var p = path[k]; A().play('hunt_step'); m.r = p.r; m.c = p.c; place(m, turn); await U().sleep(340);
          if (!p.dug) {
            p.dug = true; A().play('hunt_rustle'); await U().sleep(160); A().play('hunt_dig'); p.el.classList.add('dug'); U().fx('smoke_puff', p.el); p.el.innerHTML = ''; p.el.appendChild(U().h('span', { class: 'gm-prize', text: p.prize.e }));
            if (p.prize.v > 0) { A().play('hunt_prize'); U().addScore(turn, p.prize.v); U().floatText('+' + p.prize.v, p.el, 'good'); if (p.prize.v >= 20) { U().confetti(14); U().fx('coin_shower', p.el, 1.2); if (hal) A().play('witch'); } }
            else { A().play('hunt_empty'); U().floatText('boo!', p.el, 'soft'); if (hal) A().play('ghost'); }
            await U().sleep(380);
          }
        }
        U().wobble(document.getElementById('gm-team-' + turn)); await U().sleep(500); busy = false; next();
      }
      showTurn();
    }
  };
})(window);
