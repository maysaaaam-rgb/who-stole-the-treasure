/* Game Maker: BINGO. One big board of answers (words or pictures). The game reads a clue (the question, spoken aloud);
   the team whose turn it is taps the answer on the board. Right: the square turns the team's colour (+10) and a line of the
   same colour is a BINGO (+25). A miss never takes points away: the next team may try the same clue. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {}; GM.modes = GM.modes || {};
  var U = function () { return GM.u; }, A = function () { return GM.audio; }, J = function () { return GM.juice; }, E = function () { return GM.engine; };

  GM.modes.bingo = {
    id: 'bingo', name: 'Bingo', e: '🎯',
    desc: 'Listen to the clue and tap the answer on the big bingo board. Win squares and make a line of your colour!',
    fields: [
      { key: 'size', label: 'Board size', opts: [[3, '3 × 3', 'quick'], [4, '4 × 4'], [5, '5 × 5', 'long game']], def: 4 },
      { key: 'miss', label: 'If a team misses', opts: [['pass', 'Next team can try'], ['lose', 'The clue is over']], def: 'pass' }
    ],
    start: function (ctx) {
      var st = GM.state, T = st.teams, nt = T.length, n = +ctx.cfg.size || 4, pass = ctx.cfg.miss !== 'lose', timerSecs = +ctx.cfg.timer || 0;
      var eng = E().createSession(ctx, { maxRounds: 9999 });
      ctx.root.innerHTML = '';

      /* the squares: different answers from the question set. Real vocabulary words and pictures come first, little words and long sentences last. */
      var SMALL = 'a an the is are was were be been am do does did has have had can could will would to of in on at by for from with and but or so if as because not no yes very too he she it they we you i me my your his her its our their this that these those there here what who when where why how which some any'.split(' ');
      function quality(a) {
        if (!/[A-Za-z0-9]/.test(a)) return 0;                                                    // picture answers
        var words = a.split(/\s+/).length;
        if (words === 1 && a.length >= 3 && a.length <= 14 && SMALL.indexOf(a.toLowerCase()) < 0 && /^[A-Za-z'][A-Za-z'-]*[A-Za-z']$/.test(a)) return 0;   // a real word
        if (a.length > 22 || /^[^A-Za-z]/.test(a) || SMALL.indexOf(a.toLowerCase()) >= 0) return 3;
        return words <= 3 ? 1 : 2;
      }
      var cand = [], seen = {}, tries = 0;
      while (tries++ < 500 && cand.length < 90) {
        var it = ctx.nextItem(); if (!it) break;
        var a = String(it.a || '').trim(), key = a.toLowerCase(); if (!a || seen[key]) continue; seen[key] = 1;
        cand.push({ label: a, item: it, owner: -1, el: null, q: quality(a) });
      }
      cand = U().shuffle(cand).sort(function (x, y) { return x.q - y.q; });
      var squares = cand.slice(0, n * n);
      while (n > 2 && n * n > squares.length) n--;
      squares = squares.slice(0, n * n);
      var info = U().h('div', { class: 'gm-info gm-bn-info' }), grid = U().h('div', { class: 'gm-bn-grid' });
      ctx.root.appendChild(U().h('div', { class: 'gm-boardwrap gm-bn' }, [info, grid]));
      if (squares.length < 4) {
        info.appendChild(U().h('b', { text: 'This question set has too few different answers for Bingo. Pick a bigger set.' }));
        info.appendChild(U().btn('◀ Back', 'big amber', function () { eng.finish(); }));
        return;
      }
      squares = U().shuffle(squares);
      grid.style.gridTemplateColumns = 'repeat(' + n + ', 1fr)'; grid.style.gridTemplateRows = 'repeat(' + n + ', 1fr)'; grid.classList.add('n' + n);

      var clues = U().shuffle(squares.slice()), ci = 0, tried = {}, locked = true, left = 0, cancelTimer = null, lines = [], doneLine = {};
      var r, c, line, d1 = [], d2 = [];
      for (r = 0; r < n; r++) { line = []; for (c = 0; c < n; c++) line.push(r * n + c); lines.push(line); }
      for (c = 0; c < n; c++) { line = []; for (r = 0; r < n; r++) line.push(r * n + c); lines.push(line); }
      for (r = 0; r < n; r++) { d1.push(r * n + r); d2.push(r * n + (n - 1 - r)); }
      lines.push(d1); lines.push(d2);

      squares.forEach(function (sq) {
        var emoji = !/[A-Za-z0-9]/.test(sq.label);
        var b = U().h('button', { type: 'button', class: 'gm-bn-sq' + (emoji ? ' emoji' : '') + (sq.label.length > 13 ? ' long' : '') }, [U().h('span', { text: sq.label })]);
        b.addEventListener('click', function () { guess(sq); });
        sq.el = b; grid.appendChild(b);
      });

      function stopTimer() { if (cancelTimer) { cancelTimer(); cancelTimer = null; } }
      function showClue() {
        if (ci >= clues.length) return end();
        var cl = clues[ci].item, t = eng.activeTeam(), timerEl = U().h('span', { class: 'gm-bn-timer', text: timerSecs ? String(timerSecs) : '' });
        info.innerHTML = ''; info.style.setProperty('--c', t.color); info.appendChild(U().monFace(t.mon, 46));
        info.appendChild(U().h('b', { text: t.name + ': find the answer!' }));
        info.appendChild(U().h('span', { class: 'gm-bn-clue', text: U().qText(cl) }));
        info.appendChild(U().btn('🔊', 'round sm', function () { A().speak(U().sayOf(cl)); }));
        if (timerSecs) info.appendChild(timerEl);
        info.appendChild(U().h('small', { class: 'gm-bn-count', text: (ci + 1) + ' / ' + clues.length }));
        A().speak(U().sayOf(cl));
        locked = false; stopTimer();
        if (timerSecs) { left = timerSecs; cancelTimer = eng.interval(function () { left--; timerEl.textContent = String(Math.max(0, left)); if (left <= 0) { stopTimer(); miss(null); } }, 1000); }
      }

      function claim(sq, team) {
        sq.owner = team; sq.el.style.setProperty('--c', T[team].color); sq.el.classList.add('own');
        J().squash(sq.el, 1.2, 0.82, 280); J().shockwave(sq.el, T[team].color, 100, 420); J().sparks(sq.el, 12, [T[team].color, '#ffe066', '#ffffff'], 6);
      }
      function checkLines(team) {
        var added = 0;
        lines.forEach(function (ln, i) {
          if (doneLine[i]) return;
          if (ln.every(function (k) { return squares[k].owner === team; })) { doneLine[i] = 1; added++; ln.forEach(function (k) { squares[k].el.classList.add('line'); }); }
        });
        if (added) { eng.award(team, 25 * added, grid, 'BINGO! +' + (25 * added)); A().play('fanfare'); U().confetti(46); J().shake(8); }
        return added;
      }

      async function guess(sq) {
        if (locked || sq.owner !== -1) return;
        locked = true; stopTimer();
        var turn = eng.state.turn, cur = clues[ci];
        if (sq === cur) {
          claim(sq, turn); A().play('coin_collect'); eng.award(turn, 10, sq.el, '+10');
          var bingo = checkLines(turn);
          if (!(await eng.wait(bingo ? 1900 : 1000))) return;
          ci++; tried = {}; eng.nextTurn(); showClue();
        } else {
          miss(sq);
        }
      }
      async function miss(sq) {
        locked = true;
        var turn = eng.state.turn, cur = clues[ci];
        tried[turn] = 1; A().play('soft');
        if (sq) U().wobble(sq.el);
        info.innerHTML = ''; info.appendChild(U().h('b', { text: sq ? 'Not that one! 💪' : '⏰ Time is up!' }));
        if (!(await eng.wait(1000))) return;
        if (pass && Object.keys(tried).length < nt) { eng.nextTurn(); showClue(); return; }
        /* nobody got it: show the answer */
        cur.owner = -2; cur.el.classList.add('lost', 'flash');
        info.innerHTML = ''; info.appendChild(U().h('b', { text: 'The answer is “' + cur.label + '”.' })); A().speak(cur.label);
        if (!(await eng.wait(1900))) return;
        ci++; tried = {}; eng.nextTurn(); showClue();
      }
      function end() { info.innerHTML = ''; info.appendChild(U().h('b', { text: 'All the squares are done!' })); A().play('fanfare'); eng.wait(1200).then(function () { eng.finish(); }); }

      showClue();
    }
  };
})(window);
