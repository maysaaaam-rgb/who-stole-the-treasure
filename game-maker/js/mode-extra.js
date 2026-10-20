/* Game Maker modes 4-7: Tic-Tac-Toe, Connect 4 (two teams), Pass the Pumpkin (hot potato) and Bowling.
   Same rules everywhere: a right answer earns the move, a wrong answer only passes the turn. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {}; GM.modes = GM.modes || {};
  var U = function () { return GM.u; }, A = function () { return GM.audio; };

  /* ================= shared: a two-team board game with rounds ================= */
  function markEl(team, size) { var d = U().monFace(team.mon, size); d.classList.add('gm-mark'); d.style.setProperty('--c', team.color); return d; }
  function lineWin(cells, n, k) {   // cells: array of team index or -1, n columns; k in a row
    var R = Math.floor(cells.length / n), dirs = [[0, 1], [1, 0], [1, 1], [1, -1]], r, c, d, i, who, ok;
    for (r = 0; r < R; r++) for (c = 0; c < n; c++) { who = cells[r * n + c]; if (who < 0) continue; for (d = 0; d < 4; d++) { ok = true; for (i = 1; i < k; i++) { var rr = r + dirs[d][0] * i, cc = c + dirs[d][1] * i; if (rr < 0 || rr >= R || cc < 0 || cc >= n || cells[rr * n + cc] !== who) { ok = false; break; } } if (ok) return who; } }
    return -1;
  }
  function twoTeamGame(ctx, opt) {
    var st = GM.state, rootEl = ctx.root, rounds = +ctx.cfg.rounds || 3, round = 0, turn = 0, busy = false, wins = [0, 0], cells, over = false;
    rootEl.innerHTML = '';
    var info = U().h('div', { class: 'gm-info' }), boardEl = U().h('div', { class: 'gm-ttt ' + opt.cls }), wrap = U().h('div', { class: 'gm-boardwrap' }, [info, U().h('div', { class: 'gm-tttbox' }, [boardEl])]);
    rootEl.appendChild(wrap);
    function newBoard() { cells = []; for (var i = 0; i < opt.cols * opt.rows; i++) cells.push(-1); boardEl.innerHTML = ''; opt.build(boardEl, cells, onPick); over = false; showTurn(); }
    function showTurn(msg) {
      var t = st.teams[turn]; info.innerHTML = ''; info.style.setProperty('--c', t.color); info.appendChild(U().monFace(t.mon, 46));
      info.appendChild(U().h('b', { text: msg || (t.name + ': ' + opt.prompt + '  (round ' + (round + 1) + ' of ' + rounds + ')') })); info.appendChild(U().h('span', { class: 'gm-wins', text: st.teams[0].name + ' ' + wins[0] + ' : ' + wins[1] + ' ' + st.teams[1].name })); U().teamBar(st.teams, turn);
    }
    async function onPick(idx) {
      if (busy || over) return; busy = true; var t = st.teams[turn], res = await U().ask(ctx.nextItem(), t, { timer: +ctx.cfg.timer || 0, label: 'Round ' + (round + 1) });
      if (!res.ok) { showTurn('Not this time. Next team!'); await U().sleep(900); turn = 1 - turn; showTurn(); busy = false; return; }
      var at = opt.place(boardEl, cells, idx, turn, t); if (at == null) { busy = false; return; }
      A().play('tap'); var w = lineWin(cells, opt.cols, opt.k);
      if (w >= 0) { over = true; wins[w]++; U().addScore(w, 10); U().confetti(24); A().play('fanfare'); showTurn('🎉 ' + st.teams[w].name + ' wins this round! +10'); opt.glow && opt.glow(boardEl, cells, opt.cols, opt.k, w); await U().sleep(2200); next(); }
      else if (cells.every(function (c) { return c >= 0; })) { over = true; showTurn('A draw! Play again.'); await U().sleep(1600); newBoard(); busy = false; return; }
      else { turn = 1 - turn; showTurn(); busy = false; return; }
    }
    function next() { round++; if (round >= rounds) { ctx.end(); return; } turn = round % 2; busy = false; newBoard(); }
    newBoard();
  }

  GM.modes.ttt = {
    id: 'ttt', name: 'Tic-Tac-Toe', e: '⭕', teams: 2, desc: 'Two teams. Answer right to put your monster on a square. Three in a row wins the round!',
    fields: [{ key: 'rounds', label: 'Rounds', opts: [[1, '1'], [3, '3'], [5, '5']], def: 3 }],
    start: function (ctx) {
      twoTeamGame(ctx, {
        cls: 'ttt', cols: 3, rows: 3, k: 3, prompt: 'pick a square!',
        build: function (el, cells, pick) { for (var i = 0; i < 9; i++) (function (k) { var b = U().h('button', { type: 'button', class: 'gm-sq' }); b.addEventListener('click', function () { if (cells[k] < 0) pick(k); }); el.appendChild(b); })(i); },
        place: function (el, cells, idx, who, team) { if (cells[idx] >= 0) return null; cells[idx] = who; var b = el.children[idx]; b.appendChild(markEl(team, 84)); b.classList.add('mine'); b.style.setProperty('--c', team.color); return idx; },
        glow: function (el, cells, n, k, who) { [].forEach.call(el.children, function (b, i) { if (cells[i] === who) b.classList.add('win'); }); }
      });
    }
  };
  GM.modes.connect4 = {
    id: 'connect4', name: 'Connect 4', e: '🔴', teams: 2, desc: 'Two teams. Answer right to drop your monster disc. Connect four in a row to win!',
    fields: [{ key: 'rounds', label: 'Rounds', opts: [[1, '1'], [3, '3'], [5, '5']], def: 3 }],
    start: function (ctx) {
      twoTeamGame(ctx, {
        cls: 'c4', cols: 7, rows: 6, k: 4, prompt: 'pick a column!',
        build: function (el, cells, pick) { for (var i = 0; i < 42; i++) { var s = U().h('div', { class: 'gm-hole' }); el.appendChild(s); } for (var c = 0; c < 7; c++) (function (cc) { var b = U().h('button', { type: 'button', class: 'gm-ccol', text: '▼' }); b.style.gridColumn = String(cc + 1); b.addEventListener('click', function () { pick(cc); }); el.insertBefore(b, el.firstChild); })(c); },
        place: function (el, cells, idx, who, team) { var col = idx % 7, r; for (r = 5; r >= 0; r--) if (cells[r * 7 + col] < 0) break; if (r < 0) return null; cells[r * 7 + col] = who; var holes = [].filter.call(el.children, function (x) { return x.classList.contains('gm-hole'); }), h = holes[r * 7 + col]; h.appendChild(markEl(team, 52)); h.classList.add('mine'); h.style.setProperty('--c', team.color); h.firstChild.classList.add('gm-dropin'); return r * 7 + col; },
        glow: function (el, cells, n, k, who) { var holes = [].filter.call(el.children, function (x) { return x.classList.contains('gm-hole'); }); holes.forEach(function (h, i) { if (cells[i] === who) h.classList.add('win'); }); }
      });
    }
  };

  /* ================= Pass the Pumpkin (hot potato) ================= */
  GM.modes.pass = {
    id: 'pass', name: 'Pass the Pumpkin', e: '🥔', desc: 'A pumpkin ticks and passes from team to team. Answer right to pass it on. When it pops, the team holding it is out of that round!',
    fields: [{ key: 'rounds', label: 'Rounds', opts: [[3, '3'], [5, '5'], [8, '8']], def: 5 }],
    start: function (ctx) {
      var st = GM.state, rootEl = ctx.root, nt = st.teams.length, rounds = +ctx.cfg.rounds || 5, round = 0, holder = 0, alive = true, fuse = 0, tickT = null, busy = false;
      rootEl.innerHTML = '';
      var info = U().h('div', { class: 'gm-info' }), stage = U().h('div', { class: 'gm-passbox' }), pump = U().h('div', { class: 'gm-pumpkin' }), ring = U().h('div', { class: 'gm-passring' });
      var wrap = U().h('div', { class: 'gm-boardwrap' }, [info, stage]); stage.appendChild(ring); stage.appendChild(pump); rootEl.appendChild(wrap);
      pump.appendChild(U().art('c_pumpkin', '🎃', 'gm-pumpimg'));
      var seats = st.teams.map(function (t, i) { var s = U().h('div', { class: 'gm-seat' }, [U().monFace(t.mon, 76), U().h('b', { text: t.name })]); var a = (i / nt) * Math.PI * 2 - Math.PI / 2; s.style.left = (50 + 40 * Math.cos(a)) + '%'; s.style.top = (46 + 38 * Math.sin(a)) + '%'; s.style.setProperty('--c', t.color); ring.appendChild(s); return s; });
      function place() { var a = (holder / nt) * Math.PI * 2 - Math.PI / 2; pump.style.left = (50 + 22 * Math.cos(a)) + '%'; pump.style.top = (46 + 21 * Math.sin(a)) + '%'; seats.forEach(function (s, i) { s.classList.toggle('hold', i === holder); }); }
      function tick() { if (!alive) return; fuse--; pump.classList.remove('gm-bump'); void pump.offsetWidth; pump.classList.add('gm-bump'); A().play('tick'); if (fuse <= 0) { pop(); return; } tickT = setTimeout(tick, fuse < 4 ? 450 : 900); }
      async function pop() {
        alive = false; clearTimeout(tickT); pump.textContent = '💥'; A().play('pu_boom'); U().confetti(30); U().wobble(seats[holder]); U().fx('smoke_puff', pump, 2);
        var others = st.teams.map(function (t, i) { return i; }).filter(function (i) { return i !== holder; });
        info.innerHTML = ''; info.appendChild(U().h('b', { text: '💥 The pumpkin popped on ' + st.teams[holder].name + '! Everybody else wins 10 points.' }));
        others.forEach(function (i) { U().addScore(i, 10); }); await U().sleep(2600); round++; if (round >= rounds) { ctx.end(); return; } holder = round % nt; startRound();
      }
      function startRound() { alive = true; fuse = U().rand(8, 16) + nt; pump.textContent = ''; pump.appendChild(U().art('c_pumpkin', '🎃', 'gm-pumpimg')); place(); showTurn(); clearTimeout(tickT); tickT = setTimeout(tick, 900); busy = false; }
      function showTurn() {
        var t = st.teams[holder]; info.innerHTML = ''; info.style.setProperty('--c', t.color); info.appendChild(U().monFace(t.mon, 46)); info.appendChild(U().h('b', { text: t.name + ' has the pumpkin! Answer to pass it on.  (round ' + (round + 1) + ' of ' + rounds + ')' }));
        info.appendChild(U().btn('❓ Ask me', 'big amber', ask)); U().teamBar(st.teams, holder);
      }
      async function ask() {
        if (busy || !alive) return; busy = true; var t = st.teams[holder], res = await U().ask(ctx.nextItem(), t, { timer: Math.min(+ctx.cfg.timer || 0, 20) || 0, label: 'Pass it!' });
        if (!alive) return;
        if (res.ok) { A().play('witch'); holder = (holder + 1) % nt; place(); showTurn(); busy = false; }
        else { info.innerHTML = ''; info.appendChild(U().h('b', { text: 'Not yet! ' + t.name + ' still holds the pumpkin...' })); await U().sleep(800); showTurn(); busy = false; }
      }
      ctx.onEnd(function () { alive = false; clearTimeout(tickT); });
      startRound();
    }
  };

  /* ================= Bowling ================= */
  GM.modes.bowling = {
    id: 'bowling', name: 'Pumpkin Bowling', e: '🎳', desc: 'Answer right, then stop the aim bar in the middle. Knock down as many ghost pins as you can!',
    fields: [{ key: 'frames', label: 'Frames for each team', opts: [[2, '2'], [3, '3'], [5, '5'], [8, '8']], def: 3 }],
    start: function (ctx) {
      var st = GM.state, rootEl = ctx.root, nt = st.teams.length, frames = (+ctx.cfg.frames || 3) * nt, f = 0, turn = 0, busy = false, hal = st.theme === 'halloween';
      rootEl.innerHTML = '';
      var info = U().h('div', { class: 'gm-info' }), lane = U().h('div', { class: 'gm-lane' }), pinsEl = U().h('div', { class: 'gm-pins' }), ball = U().h('div', { class: 'gm-ball' }), aim = U().h('div', { class: 'gm-aim' }, [U().h('i')]), res = U().h('div', { class: 'gm-bres' });
      lane.appendChild(pinsEl); lane.appendChild(ball); var wrap = U().h('div', { class: 'gm-boardwrap' }, [info, lane, aim, res]); rootEl.appendChild(wrap);
      var rows = [4, 3, 2, 1], pins = []; rows.forEach(function (n, r) { for (var i = 0; i < n; i++) { var p = U().h('div', { class: 'gm-pin', text: hal ? '👻' : '🎳' }); p.style.gridColumn = String(1 + (4 - n) + i * 2) + ' / span 2'; p.style.gridRow = String(r + 1); pinsEl.appendChild(p); pins.push(p); } });
      var raf = null, pos = 0, dirn = 1, aiming = false, mark = aim.firstChild;
      function showTurn() { var t = st.teams[turn]; info.innerHTML = ''; info.style.setProperty('--c', t.color); info.appendChild(U().monFace(t.mon, 46)); info.appendChild(U().h('b', { text: t.name + ': answer to roll! (frame ' + (f + 1) + ' of ' + frames + ')' })); info.appendChild(U().btn('❓ Ask me', 'big amber', ask)); aim.style.visibility = 'hidden'; U().teamBar(st.teams, turn); res.textContent = ''; }
      function reset() { pins.forEach(function (p) { p.classList.remove('down'); }); ball.style.transition = 'none'; ball.style.left = '50%'; ball.style.bottom = '-8%'; void ball.offsetWidth; }
      async function ask() {
        if (busy) return; busy = true; var t = st.teams[turn], r = await U().ask(ctx.nextItem(), t, { timer: +ctx.cfg.timer || 0, label: 'Frame ' + (f + 1) });
        if (!r.ok) { res.textContent = '🌀 Gutter ball! Next team.'; ball.style.transition = 'left .6s,bottom .9s'; ball.style.left = '4%'; ball.style.bottom = '90%'; A().play('hunt_empty'); await U().sleep(1400); reset(); next(); busy = false; return; }
        info.innerHTML = ''; info.appendChild(U().h('b', { text: 'Stop the bar in the green middle!' })); info.appendChild(U().btn('🎳 ROLL!', 'big green', roll)); aim.style.visibility = 'visible'; aiming = true; pos = 0; dirn = 1; busy = false;
        (function loop() { if (!aiming) return; pos += dirn * 0.018; if (pos > 1) { pos = 1; dirn = -1; } if (pos < 0) { pos = 0; dirn = 1; } mark.style.left = (pos * 100) + '%'; raf = requestAnimationFrame(loop); })();
      }
      async function roll() {
        if (!aiming) return; aiming = false; cancelAnimationFrame(raf); busy = true; var d = Math.abs(pos - 0.5) * 2, n = Math.max(0, Math.min(10, Math.round(10 - 9 * d) + U().rand(0, 1)));
        ball.style.transition = 'left .8s ease-in,bottom .8s ease-in'; ball.style.left = (50 + (pos - 0.5) * 36) + '%'; ball.style.bottom = '78%'; A().play('plinko_drop'); await U().sleep(850);
        var order = U().shuffle(pins.slice()); for (var i = 0; i < n; i++) { order[i].classList.add('down'); A().play('hunt_dig'); await U().sleep(70); }
        var strike = n === 10; U().addScore(turn, n * 5 + (strike ? 20 : 0)); res.textContent = strike ? '🌟 STRIKE! +' + (n * 5 + 20) : n + ' pins! +' + (n * 5); A().play(strike ? 'slot_high' : n >= 6 ? 'slot_mid' : 'slot_low'); if (strike) { U().confetti(30); if (hal) A().play('ghost'); }
        U().wobble(document.getElementById('gm-team-' + turn)); await U().sleep(1700); reset(); next(); busy = false;
      }
      function next() { f++; if (f >= frames) { ctx.end(); return; } turn = (turn + 1) % nt; showTurn(); }
      ctx.onEnd(function () { aiming = false; cancelAnimationFrame(raf); });
      reset(); showTurn();
    }
  };
})(window);
