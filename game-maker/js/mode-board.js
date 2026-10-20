/* Game Maker mode 1: the Tile Board (Quiz, Classic, Classic Jr). A tile hides a question and sometimes a power-up. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {}; GM.modes = GM.modes || {};
  var U = function () { return GM.u; }, A = function () { return GM.audio; };
  var COLS = { 8: 4, 16: 4, 24: 6, 36: 6, 48: 8 };

  function amt() { return U().rand(1, 5) * 5; }   // 5 to 25
  var SND = { fairy: 'pu_good', thief: 'pu_banana', rocket: 'pu_rocket', banana: 'pu_banana', star: 'pu_star', heart: 'pu_good', eraser: 'pu_reset', virus: 'pu_reset', shark: 'pu_shark', magnet: 'pu_good', lifesaver: 'pu_good', trap: 'pu_trap', seesaw: 'pu_seesaw', gold: 'pu_gold', boom: 'pu_boom', gift: 'pu_good' };

  /* apply one power-up; returns a short message. target = index of the other team the teacher picked (or -1) */
  function applyPU(id, me, target) {
    var T = GM.state.teams, S = U().setScore, mine = T[me].score, others = T.map(function (t, i) { return i; }).filter(function (i) { return i !== me; }), r, tgt = target >= 0 ? target : (others.length ? others[0] : -1);
    var tn = tgt >= 0 ? T[tgt].name : '';
    switch (id) {
      case 'fairy': if (tgt < 0) return 'No other team to take from.'; r = Math.min(10, T[tgt].score); S(tgt, T[tgt].score - r); S(me, mine + r); return 'The fairy takes ' + r + ' points from ' + tn + '!';
      case 'thief': if (tgt < 0) return 'Nobody to give to.'; r = Math.min(10, mine); S(me, mine - r); S(tgt, T[tgt].score + r); return 'The thief gives ' + r + ' points to ' + tn + '!';
      case 'rocket': r = Math.max.apply(null, T.map(function (t) { return t.score; })); if (mine >= r && T.length > 1 && T.every(function (t, i) { return i === me || t.score < mine; })) return 'You are already first!'; S(me, r + 5); return 'Rocket! You jump to first place!';
      case 'banana': if (!others.length) return 'The banana slips... nothing happens.'; r = Math.min.apply(null, others.map(function (i) { return T[i].score; })); S(me, Math.min(mine, r)); return 'Slip! You slide to last place.';
      case 'star': S(me, mine * 2); return 'Star! Your points are doubled: ' + (mine * 2) + '.';
      case 'heart': if (tgt < 0) return 'Heart: nobody to share with.'; r = amt(); S(tgt, T[tgt].score + r); return tn + ' wins ' + r + ' points!';
      case 'eraser': S(me, 0); return 'Erased! Your score is back to 0.';
      case 'virus': T.forEach(function (t, i) { S(i, 0); }); return 'Virus! Every score is reset to 0.';
      case 'shark': if (tgt < 0) return 'Shark: nobody to bite.'; r = Math.min(amt(), T[tgt].score); S(tgt, T[tgt].score - r); return 'Shark! ' + tn + ' loses ' + r + ' points.';
      case 'magnet': if (tgt < 0) return 'Magnet: nothing to pull.'; r = Math.min(amt(), T[tgt].score); S(tgt, T[tgt].score - r); S(me, mine + r); return 'Magnet! You take ' + r + ' points from ' + tn + '.';
      case 'lifesaver': if (tgt < 0) return 'Lifesaver: nobody to save.'; r = Math.min(amt(), mine); S(me, mine - r); S(tgt, T[tgt].score + r); return 'Lifesaver! You give ' + r + ' points to ' + tn + '.';
      case 'trap': return 'Trap! No points this time.';
      case 'seesaw': if (tgt < 0) return 'Seesaw: nobody to swap with.'; S(me, T[tgt].score); S(tgt, mine); return 'Seesaw! You swap points with ' + tn + '.';
      case 'gold': S(me, mine + 50); return 'Gold! You win 50 points!';
      case 'boom': S(me, Math.max(0, mine - 50)); return 'Boom! You lose 50 points.';
      case 'gift': r = amt(); S(me, mine + r); return 'A gift! You win ' + r + ' points!';
    }
    return '';
  }

  GM.modes.board = {
    id: 'board', name: 'Tile Board', e: '🔢', desc: 'Pick a numbered tile. Answer the question. Some tiles hide power-ups!',
    fields: [
      { key: 'play', label: 'Game type', opts: [['quiz', 'Quiz', 'Questions only'], ['classic', 'Classic', 'Questions and power-ups'], ['jr', 'Classic Jr', 'Only friendly power-ups']], def: 'classic' },
      { key: 'grid', label: 'Number of tiles', opts: [[8, '8'], [16, '16'], [24, '24'], [36, '36'], [48, '48']], def: 16 }
    ],
    start: function (ctx) {
      var cfg = ctx.cfg, st = GM.state, root0 = ctx.root, n = +cfg.grid || 16, cols = COLS[n] || 4, busy = false, turn = 0, left = n;
      var pool = GM.powerups.filter(function (p) { return (cfg.pu || {})[p.id] !== false && (cfg.play === 'jr' ? p.jr : true); });
      var tiles = [], i;
      for (i = 0; i < n; i++) tiles.push({ i: i, item: ctx.nextItem(), pu: (cfg.play !== 'quiz' && pool.length && Math.random() < 0.32) ? U().shuffle(pool)[0].id : null, used: false });
      root0.innerHTML = '';
      var info = U().h('div', { class: 'gm-info' }), grid = U().h('div', { class: 'gm-grid gm-t' + n }), wrap = U().h('div', { class: 'gm-boardwrap' }, [info, grid]);
      grid.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)'; grid.style.gridTemplateRows = 'repeat(' + Math.ceil(n / cols) + ', 1fr)';
      root0.appendChild(wrap);
      function turnInfo() { var t = st.teams[turn]; info.innerHTML = ''; info.appendChild(U().monFace(t.mon, 46)); info.appendChild(U().h('b', { text: t.name + ', pick a tile!' })); info.style.setProperty('--c', t.color); U().teamBar(st.teams, turn); }
      tiles.forEach(function (tl) {
        var b = U().h('button', { type: 'button', class: 'gm-tile', text: String(tl.i + 1) }); tl.el = b; grid.appendChild(b);
        b.addEventListener('click', function () { if (busy || tl.used) return; busy = true; A().play('tap'); play(tl); });
      });
      async function play(tl) {
        var team = st.teams[turn], res = await U().ask(tl.item, team, { timer: +cfg.timer || 0, label: 'Tile ' + (tl.i + 1) });
        tl.used = true; tl.el.classList.add('used'); left--;
        if (res.ok) {
          U().addScore(turn, 10); U().floatText('+10', tl.el, 'good'); tl.el.textContent = '✓'; U().fx('smoke_puff', tl.el);
          if (tl.pu) await reveal(tl, tl.pu);
        } else { tl.el.textContent = '·'; }
        if (left <= 0) { await U().sleep(500); ctx.end(); return; }
        turn = (turn + 1) % st.teams.length; turnInfo(); busy = false;
      }
      async function reveal(tl, id) {
        var pu = GM.powerups.filter(function (p) { return p.id === id; })[0], T = st.teams, target = -1;
        var over = U().h('div', { class: 'gm-over' }), card = U().h('div', { class: 'gm-card gm-glass gm-pucard' }, [U().h('div', { class: 'gm-pu-ic' }, [U().art('pu_' + id, pu.e)]), U().h('h2', { text: pu.n + '!' }), U().h('div', { class: 'gm-q', text: pu.d })]), msg = U().h('div', { class: 'gm-qmsg' });
        card.appendChild(msg); over.appendChild(card); document.getElementById('gm-stage').appendChild(over);
        A().play(SND[id] || 'pu_good'); U().confetti(10); U().fx(id === 'gold' ? 'coin_shower' : id === 'heart' ? 'heart_float' : id === 'rocket' ? 'rocket_trail' : 'sparkle_burst', card, 1.6);
        await U().sleep(900);
        if (pu.needs && T.length > 2) { over.style.display = 'none'; target = await U().chooseTeam(pu.n + ': choose a team', T, turn); over.style.display = ''; }
        var text = applyPU(id, turn, target); msg.textContent = text; U().teamBar(T, turn); U().wobble(document.getElementById('gm-team-' + turn));
        var ok = U().btn('✔ Okay!', 'big green', function () { over.remove(); }); card.appendChild(ok);
        await new Promise(function (res) { var iv = setInterval(function () { if (!over.parentNode) { clearInterval(iv); res(); } }, 120); });
      }
      turnInfo();
    }
  };
})(window);
