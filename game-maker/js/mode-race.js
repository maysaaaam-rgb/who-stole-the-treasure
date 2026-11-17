/* Game Maker: MONSTER RACE (Restaged). Pastel candy racetrack with 3-2-1-GO starting lights,
   dust puffs (`fx_smoke_puff.webp`), camera-shake on overtaking, a snapping finish ribbon, and a winner podium. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {}; GM.modes = GM.modes || {};
  var U = function () { return GM.u; }, A = function () { return GM.audio; }, J = function () { return GM.juice; };

  GM.modes.race = {
    id: 'race',
    name: 'Monster Race',
    e: '🏁',
    desc: '3-2-1-GO! Answer right for a turbo boost, overtake rivals with dust puffs, snap the finish ribbon, and claim the podium!',
    fields: [{ key: 'len', label: 'Race length', opts: [[8, 'Short'], [12, 'Medium'], [16, 'Long']], def: 12 }],
    start: function (ctx) {
      var st = GM.state, T = st.teams, nt = T.length, LEN = +ctx.cfg.len || 12;
      var turn = 0, busy = true, over = false, alive = true, hal = st.theme === 'halloween';

      var rootEl = ctx.root; rootEl.innerHTML = '';
      var info = U().h('div', { class: 'gm-info gm-race-info' });
      var track = U().h('div', { class: 'gm-track gm-race-track' });
      var wrap = U().h('div', { class: 'gm-boardwrap gm-race-wrap' }, [info, track]);
      rootEl.appendChild(wrap);
      document.body.classList.add('gm-hide-pods');
      ctx.onEnd(function () { alive = false; document.body.classList.remove('gm-hide-pods'); });

      /* Painted pastel racetrack lanes */
      var lanes = T.map(function (t, i) {
        var lane = U().h('div', { class: 'gm-lane2 gm-race-lane' });
        var road = U().h('div', { class: 'gm-road gm-race-road' });
        var runner = U().h('div', { class: 'gm-runner gm-race-runner' });
        var dust = U().h('div', { class: 'gm-dust' });
        var rankPill = U().h('span', { class: 'gm-race-rank', text: '#' + (i + 1) });
        lane.style.setProperty('--c', t.color);
        var tag = U().h('div', { class: 'gm-lanetag gm-race-tag' }, [
          rankPill,
          U().h('b', { text: t.name }),
          U().h('span', { class: 'gm-score', text: String(t.score || 0) })
        ]);
        tag.id = 'gm-team-' + i;
        for (var k = 1; k <= LEN; k++) {
          road.appendChild(U().h('i', { class: 'gm-tick' + (k === LEN ? ' fin' : '') }));
        }
        runner.appendChild(U().monFull(t.mon, 100));
        runner.appendChild(dust);
        road.appendChild(runner);
        lane.appendChild(tag);
        lane.appendChild(road);
        track.appendChild(lane);
        return { lane: lane, road: road, runner: runner, dust: dust, tag: tag, rankPill: rankPill, pos: 0 };
      });

      /* Finish line + taut snapping finish ribbon across all lanes */
      var ribbonTop = U().h('div', { class: 'gm-ribbon-half top' });
      var ribbonBot = U().h('div', { class: 'gm-ribbon-half bot' });
      var ribbonKnot = U().h('div', { class: 'gm-ribbon-knot' }, [U().art('art/o_finish_flag.webp', '🏁')]);
      var finishEl = U().h('div', { class: 'gm-finish gm-race-finish' }, [ribbonTop, ribbonBot, ribbonKnot]);
      track.appendChild(finishEl);

      function sizeRunners() {
        var h = lanes[0] ? lanes[0].road.clientHeight : 80;
        var s = Math.max(54, Math.min(144, h * 1.12));
        lanes.forEach(function (l) {
          var m = l.runner.querySelector('.gm-monfull');
          if (m) { m.style.width = m.style.height = s + 'px'; }
          l.runner.style.setProperty('--s', s + 'px');
          place(l);
        });
      }

      function place(l) {
        var w = l.road.clientWidth || 600;
        var s = parseFloat(l.runner.style.getPropertyValue('--s')) || 100;
        l.runner.style.transform = 'translateX(' + Math.round((w - s * 0.82) * (l.pos / LEN)) + 'px)';
      }

      function updateRanks() {
        var order = lanes.map(function (l, idx) { return { idx: idx, pos: l.pos }; })
          .sort(function (a, b) { return b.pos - a.pos; });
        var medals = ['🥇', '🥈', '🥉'];
        order.forEach(function (o, rIdx) {
          lanes[o.idx].rankPill.textContent = medals[rIdx] || ('#' + (rIdx + 1));
        });
      }

      var ro = root.ResizeObserver ? new ResizeObserver(sizeRunners) : null;
      if (ro) ro.observe(track);
      setTimeout(sizeRunners, 30);
      ctx.onEnd(function () { if (ro) ro.disconnect(); });

      /* 3-2-1-GO! Starting Lights Ceremony */
      async function runCountdown() {
        var stage = document.getElementById('gm-stage') || rootEl;
        var cd = U().h('div', { class: 'gm-over gm-race-cd' });
        var lights = U().h('div', { class: 'gm-cd-lights' }, [
          U().h('span', { class: 'gm-cd-bulb r' }),
          U().h('span', { class: 'gm-cd-bulb y' }),
          U().h('span', { class: 'gm-cd-bulb g' })
        ]);
        var num = U().h('div', { class: 'gm-cd-num', text: '3' });
        cd.appendChild(lights);
        cd.appendChild(num);
        stage.appendChild(cd);
        setTimeout(function () { cd.classList.add('in'); }, 16);

        var bulbs = lights.querySelectorAll('.gm-cd-bulb');
        A().play('race_ready');
        var steps = [
          { txt: '3', idx: 0, snd: 'tick' },
          { txt: '2', idx: 1, snd: 'tick' },
          { txt: '1', idx: 2, snd: 'tick' }
        ];
        for (var i = 0; i < steps.length; i++) {
          if (!alive) { cd.remove(); return; }
          num.textContent = steps[i].txt;
          bulbs[steps[i].idx].classList.add('on');
          J().squash(num, 1.24, 0.8, 220);
          A().play(steps[i].snd);
          await U().sleep(580);
        }
        if (!alive) { cd.remove(); return; }
        bulbs.forEach(function (b) { b.classList.add('go'); });
        num.textContent = 'GO!';
        num.classList.add('go');
        A().play('round_start');
        A().play('race_run');
        J().shockwave(num, '#2ecc71', 240, 420);
        J().sparks(num, 22, ['#ffe066', '#2ecc71', '#38bdf8', '#ff7eb6'], 10);
        await U().sleep(520);
        cd.remove();
        busy = false;
        showTurn();
      }

      function showTurn() {
        if (over || !alive) return;
        var t = T[turn];
        info.innerHTML = '';
        info.style.setProperty('--c', t.color);
        info.appendChild(U().monFace(t.mon, 46));
        info.appendChild(U().h('b', { text: t.name + ': answer for a turbo boost!' }));
        info.appendChild(U().btn('❓ Ask me', 'big amber', ask));
        lanes.forEach(function (l, i) { l.lane.classList.toggle('on', i === turn); });
      }

      function spawnDustPuff(l) {
        var fx = document.getElementById('gm-fx');
        var mon = l.runner.querySelector('.gm-monfull');
        if (!fx || !mon) return;
        var p = J().center(mon);
        var im = U().art(hal ? 'art/fx_ghost_trail.webp' : 'art/fx_smoke_puff.webp', '💨');
        im.className = 'gm-race-puff';
        im.style.left = (p.x - 36) + 'px';
        im.style.top = (p.y + 18 + (Math.random() * 14 - 7)) + 'px';
        fx.appendChild(im);
        setTimeout(function () { im.remove(); }, 650);
      }

      async function ask() {
        if (busy || over || !alive) return;
        busy = true;
        var t = T[turn], l = lanes[turn];
        var res = await U().ask(ctx.nextItem(), t, { timer: +ctx.cfg.timer || 0, label: 'Lane ' + (turn + 1) });
        if (!alive) return;

        if (!res.ok) {
          l.runner.classList.add('gm-trip');
          A().play('race_trip');
          A().play('pu_banana');
          J().squash(l.runner, 1.18, 0.78, 280);
          info.innerHTML = '';
          info.appendChild(U().art('art/pu_banana.webp', '🍌'));
          info.appendChild(U().h('b', { text: 'Oops, ' + t.name + ' slipped! Next team.' }));
          await U().sleep(1150);
          l.runner.classList.remove('gm-trip');
          next();
          busy = false;
          return;
        }

        /* Suspenseful boost roll with painted dice */
        var n = U().rand(1, 3);
        var dice = U().h('div', { class: 'gm-dice spin gm-race-dice' }, [
          U().art('art/o_dice.webp', '🎲'),
          U().h('span', { text: '?' })
        ]);
        A().play('drum_roll_short');
        A().play('dice_roll');
        info.innerHTML = '';
        info.appendChild(U().monFace(t.mon, 46));
        info.appendChild(dice);
        info.appendChild(U().h('b', { text: 'Turbo Boost…' }));
        var dTxt = dice.querySelector('span');
        for (var k = 0; k < 7; k++) {
          dTxt.textContent = String(U().rand(1, 3));
          A().play('tick');
          await U().sleep(68 + k * 14);
          if (!alive) return;
        }
        dTxt.textContent = String(n);
        dice.classList.remove('spin');
        J().squash(dice, 1.24, 0.82, 240);
        A().play('round');
        info.lastChild.textContent = 'Boost ×' + n + '! Go, ' + t.name + '!';

        await run(turn, n);
        busy = false;
        if (!over && alive) next();
      }

      function run(i, n) {
        return new Promise(function (resolve) {
          var l = lanes[i], from = l.pos, to = Math.min(LEN, from + n);
          var t0 = performance.now(), dur = Math.max(480, 480 * (to - from));
          var overtakenDone = false;
          var aheadBefore = lanes.filter(function (other, idx) { return idx !== i && other.pos > from; });

          l.runner.classList.add('gm-run');
          l.lane.classList.add('gm-boost');
          A().play('race_boost');
          A().play('pu_rocket');
          J().squash(l.runner, 1.15, 0.86, 220);

          var puff = setInterval(function () {
            spawnDustPuff(l);
          }, 115);

          (function step(now) {
            if (!alive) { clearInterval(puff); resolve(); return; }
            var k = Math.min(1, (now - t0) / dur);
            var e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
            l.pos = from + (to - from) * e;
            place(l);

            if (!overtakenDone && aheadBefore.some(function (other) { return l.pos > other.pos; })) {
              overtakenDone = true;
              J().shake(9);
              J().shockwave(l.runner, '#ffe066', 180, 380);
              A().play('sparkle');
              U().floatText('⚡ OVERTAKE!', l.runner, 'good');
            }

            if (k < 1) { requestAnimationFrame(step); return; }
            clearInterval(puff);
            l.runner.classList.remove('gm-run');
            l.lane.classList.remove('gm-boost');
            l.pos = to;
            place(l);
            updateRanks();
            A().play('coin_collect');
            if (to - from >= 2) A().play('sparkle');
            U().floatText('+' + ((to - from) * 5), l.runner, 'good');
            U().addScore(i, (to - from) * 5);
            if (to >= LEN) finish(i).then(resolve);
            else setTimeout(resolve, 460);
          })(t0);
        });
      }

      async function finish(i) {
        over = true;
        var l = lanes[i];
        l.lane.classList.add('gm-won');
        finishEl.classList.add('snapped');
        A().play('race_finish');
        A().play('win_fanfare');
        A().play('crowd_cheer_small');
        A().play('cheer_kids');
        J().shake(11);
        J().shockwave(finishEl, '#ffe066', 300, 560);
        J().sparks(finishEl, 32, ['#ffe066', '#ff7eb6', '#38bdf8', '#2ecc71', '#ffffff'], 12);
        U().confetti(55);

        info.innerHTML = '';
        info.appendChild(U().monFace(T[i].mon, 46));
        info.appendChild(U().h('b', { text: '🏁 ' + T[i].name + ' snapped the ribbon! +50' }));
        U().floatText('+50', l.runner, 'good');
        U().addScore(i, 50);

        await U().sleep(850);
        if (!alive) return;

        /* Podium Moment Overlay */
        var stage = document.getElementById('gm-stage') || rootEl;
        var podOver = U().h('div', { class: 'gm-over gm-race-podium' });
        var ranked = T.map(function (t, idx) {
          return { t: t, idx: idx, pos: lanes[idx].pos };
        }).sort(function (a, b) {
          if (a.idx === i) return -1;
          if (b.idx === i) return 1;
          return b.pos - a.pos || b.t.score - a.t.score;
        }).slice(0, 3);

        var pods = U().h('div', { class: 'gm-rp-bars' });
        ranked.forEach(function (r, placeIdx) {
          var hPct = placeIdx === 0 ? 100 : placeIdx === 1 ? 74 : 54;
          var bar = U().h('div', { class: 'gm-rp-col p' + (placeIdx + 1) }, [
            U().h('div', { class: 'gm-rp-mon' }, [
              placeIdx === 0 ? U().art('art/ui_trophy.webp', '👑') : U().h('span', { class: 'gm-rp-medal', text: placeIdx === 1 ? '🥈' : '🥉' }),
              U().monFace(r.t.mon, 68)
            ]),
            U().h('div', { class: 'gm-rp-step', style: { '--c': r.t.color, '--hp': hPct + '%' } }, [
              U().h('b', { text: '#' + (placeIdx + 1) }),
              U().h('span', { text: r.t.score + ' pts' })
            ]),
            U().h('div', { class: 'gm-rp-name', text: r.t.name })
          ]);
          pods.appendChild(bar);
        });

        podOver.appendChild(U().h('div', { class: 'gm-rp-card' }, [
          U().h('h2', { text: '🏆 ' + T[i].name + ' Wins the Race!' }),
          pods
        ]));
        stage.appendChild(podOver);
        setTimeout(function () { podOver.classList.add('in'); }, 16);
        await U().sleep(2300);
        podOver.remove();
        ctx.end();
      }

      function next() { turn = (turn + 1) % nt; showTurn(); }

      info.innerHTML = '';
      info.appendChild(U().h('b', { text: '🏁 Monsters on the starting line…' }));
      runCountdown();
    }
  };
})(window);
