/* Game Maker: MONSTER RACE. Every team's monster runs in its own lane. A right answer = a boost (1 to 3 steps): the monster
   sprints, dust flies, the crowd cheers. A wrong answer = the monster trips and waits (nothing is taken away). First over the line wins. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {}; GM.modes = GM.modes || {};
  var U = function () { return GM.u; }, A = function () { return GM.audio; }, J = function () { return GM.juice; };

  GM.modes.race = {
    id: 'race', name: 'Monster Race', e: '🏁', desc: 'Every right answer is a boost. Your monster sprints down its lane. First over the finish line wins!',
    fields: [{ key: 'len', label: 'Race length', opts: [[8, 'Short'], [12, 'Medium'], [16, 'Long']], def: 12 }],
    start: function (ctx) {
      var st = GM.state, T = st.teams, nt = T.length, LEN = +ctx.cfg.len || 12, turn = 0, busy = false, over = false, hal = st.theme === 'halloween', places = [];
      var rootEl = ctx.root; rootEl.innerHTML = '';
      var info = U().h('div', { class: 'gm-info' }), track = U().h('div', { class: 'gm-track' }), wrap = U().h('div', { class: 'gm-boardwrap' }, [info, track]);
      rootEl.appendChild(wrap); document.body.classList.add('gm-hide-pods');
      ctx.onEnd(function () { document.body.classList.remove('gm-hide-pods'); });
      var lanes = T.map(function (t, i) {
        var lane = U().h('div', { class: 'gm-lane2' }), road = U().h('div', { class: 'gm-road' }), runner = U().h('div', { class: 'gm-runner' }), dust = U().h('div', { class: 'gm-dust' });
        lane.style.setProperty('--c', t.color);
        var tag = U().h('div', { class: 'gm-lanetag' }, [U().h('b', { text: t.name }), U().h('span', { class: 'gm-score', text: '0' })]);
        for (var k = 1; k <= LEN; k++) road.appendChild(U().h('i', { class: 'gm-tick' + (k === LEN ? ' fin' : '') }));
        runner.appendChild(U().monFull(t.mon, 100)); runner.appendChild(dust);
        road.appendChild(runner); lane.appendChild(tag); lane.appendChild(road); track.appendChild(lane);
        return { lane: lane, road: road, runner: runner, dust: dust, tag: tag, pos: 0 };
      });
      track.appendChild(U().h('div', { class: 'gm-finish' }, [U().h('span', { text: '🏁' })]));
      function sizeRunners() {
        var h = lanes[0] ? lanes[0].road.clientHeight : 80, s = Math.max(54, Math.min(150, h * 1.15));
        lanes.forEach(function (l) { var m = l.runner.querySelector('.gm-monfull'); if (m) { m.style.width = m.style.height = s + 'px'; } l.runner.style.setProperty('--s', s + 'px'); place(l); });
      }
      function place(l) { var w = l.road.clientWidth, s = parseFloat(l.runner.style.getPropertyValue('--s')) || 100; l.runner.style.transform = 'translateX(' + Math.round((w - s * 0.8) * (l.pos / LEN)) + 'px)'; }
      var ro = root.ResizeObserver ? new ResizeObserver(sizeRunners) : null; if (ro) ro.observe(track); setTimeout(sizeRunners, 30);
      ctx.onEnd(function () { if (ro) ro.disconnect(); });
      /* the scores live in the lane tags, so point the shared score helper at them */
      lanes.forEach(function (l, i) { l.tag.id = 'gm-team-' + i; });
      function showTurn() {
        if (over) return;
        var t = T[turn]; info.innerHTML = ''; info.style.setProperty('--c', t.color); info.appendChild(U().monFace(t.mon, 46)); info.appendChild(U().h('b', { text: t.name + ': answer for a boost!' }));
        info.appendChild(U().btn('❓ Ask me', 'big amber', ask));
        lanes.forEach(function (l, i) { l.lane.classList.toggle('on', i === turn); });
      }
      async function ask() {
        if (busy || over) return; busy = true; var t = T[turn], l = lanes[turn], res = await U().ask(ctx.nextItem(), t, { timer: +ctx.cfg.timer || 0, label: 'Lane ' + (turn + 1) });
        if (!res.ok) { l.runner.classList.add('gm-trip'); A().play('pu_banana'); info.innerHTML = ''; info.appendChild(U().h('b', { text: 'Oops, ' + t.name + ' tripped! Next team.' })); await U().sleep(1200); l.runner.classList.remove('gm-trip'); next(); busy = false; return; }
        var n = U().rand(1, 3), dice = U().h('div', { class: 'gm-dice spin', text: '?' });
        info.innerHTML = ''; info.appendChild(U().monFace(t.mon, 46)); info.appendChild(dice); info.appendChild(U().h('b', { text: 'Boost!' }));
        for (var k = 0; k < 8; k++) { dice.textContent = String(U().rand(1, 3)); A().play('tick'); await U().sleep(70 + k * 12); }
        dice.textContent = String(n); dice.classList.remove('spin'); A().play('round'); info.lastChild.textContent = 'Boost ' + n + '! Go, ' + t.name + '!';
        await run(turn, n); busy = false; if (!over) next();
      }
      function run(i, n) {
        return new Promise(function (resolve) {
          var l = lanes[i], from = l.pos, to = Math.min(LEN, from + n), t0 = performance.now(), dur = 520 * (to - from);
          l.runner.classList.add('gm-run'); l.lane.classList.add('gm-boost'); A().play('pu_rocket');
          var puff = setInterval(function () { var p = J().center(l.runner.querySelector('.gm-monfull')); J().burstAt({ x: p.x - 40, y: p.y + 30 }, 2, hal ? ['💨', '✨'] : ['💨', '💨', '✨']); }, 140);
          (function step(now) {
            var k = Math.min(1, (now - t0) / dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
            l.pos = from + (to - from) * e; place(l);
            if (k < 1) { requestAnimationFrame(step); return; }
            clearInterval(puff); l.runner.classList.remove('gm-run'); l.lane.classList.remove('gm-boost'); l.pos = to; place(l);
            U().floatText('+' + ((to - from) * 5), l.runner, 'good'); U().addScore(i, (to - from) * 5);
            if (to >= LEN) finish(i).then(resolve); else setTimeout(resolve, 500);
          })(t0);
        });
      }
      async function finish(i) {
        over = true; places.push(i); var l = lanes[i]; l.lane.classList.add('gm-won'); A().play('fanfare'); U().confetti(40); J().shake(10);
        info.innerHTML = ''; info.appendChild(U().monFace(T[i].mon, 46)); info.appendChild(U().h('b', { text: '🏁 ' + T[i].name + ' wins the race! +50' }));
        U().floatText('+50', l.runner, 'good'); U().addScore(i, 50);
        await U().sleep(2600); ctx.end();
      }
      function next() { turn = (turn + 1) % nt; showTurn(); }
      showTurn();
    }
  };
})(window);
