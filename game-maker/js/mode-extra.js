/* Game Maker modes 4-7: Tic-Tac-Toe, Connect 4 (two teams), Pass the Bomb / Pumpkin, and Bowling.
   Powered by GM.engine (GameEngineCore) with decoupled simulation state, 60fps canvas juice, squash-and-stretch tweens, and Web Audio SFX. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {}; GM.modes = GM.modes || {};
  var U = function () { return GM.u; }, A = function () { return GM.audio; }, J = function () { return GM.juice; }, E = function () { return GM.engine; };

  /* ================= shared: two-team board game engine (Tic-Tac-Toe & Connect 4) ================= */
  function markEl(team, size) {
    var d = U().monFace(team.mon, size);
    d.classList.add('gm-mark');
    d.style.setProperty('--c', team.color);
    return d;
  }

  /* Returns { who: teamIdx, line: [idx1, idx2, ...] } or null */
  function findWinLine(cells, cols, k) {
    var rows = Math.floor(cells.length / cols), dirs = [[0, 1], [1, 0], [1, 1], [1, -1]], r, c, d, i;
    for (r = 0; r < rows; r++) {
      for (c = 0; c < cols; c++) {
        var who = cells[r * cols + c];
        if (who < 0) continue;
        for (d = 0; d < 4; d++) {
          var line = [r * cols + c];
          for (i = 1; i < k; i++) {
            var rr = r + dirs[d][0] * i, cc = c + dirs[d][1] * i;
            if (rr < 0 || rr >= rows || cc < 0 || cc >= cols || cells[rr * cols + cc] !== who) break;
            line.push(rr * cols + cc);
          }
          if (line.length === k) return { who: who, line: line };
        }
      }
    }
    return null;
  }

  function twoTeamGame(ctx, opt) {
    var rounds = +ctx.cfg.rounds || 3;
    var eng = E().createSession(ctx, {
      maxRounds: rounds,
      data: { wins: [0, 0], cells: [] }
    });
    var rootEl = ctx.root;
    rootEl.innerHTML = '';
    var info = U().h('div', { class: 'gm-info' });
    var boardEl = U().h('div', { class: 'gm-ttt ' + opt.cls });
    var boxEl = U().h('div', { class: 'gm-tttbox' }, [boardEl]);
    var wrap = U().h('div', { class: 'gm-boardwrap' }, [info, boxEl]);
    rootEl.appendChild(wrap);

    function renderTurnBanner(msg) {
      var t = eng.activeTeam(), wins = eng.state.data.wins;
      info.innerHTML = '';
      info.style.setProperty('--c', t.color);
      info.appendChild(U().monFace(t.mon, 46));
      info.appendChild(U().h('b', {
        text: msg || (t.name + ': ' + opt.prompt + '  (round ' + (eng.state.round + 1) + ' of ' + eng.state.maxRounds + ')')
      }));
      info.appendChild(U().h('span', {
        class: 'gm-wins',
        text: eng.teams[0].name + ' ' + wins[0] + ' : ' + wins[1] + ' ' + eng.teams[1].name
      }));
    }

    function newBoard() {
      var cells = [];
      for (var i = 0; i < opt.cols * opt.rows; i++) cells.push(-1);
      eng.state.data.cells = cells;
      boardEl.innerHTML = '';
      opt.build(boardEl, cells, onPick, eng);
      eng.setPhase('action');
      renderTurnBanner();
    }

    async function onPick(idx) {
      if (eng.state.phase !== 'action' || !eng.state.alive) return;
      var cells = eng.state.data.cells;
      if (opt.canPick && !opt.canPick(cells, idx)) {
        J().shake(4);
        A().play('soft');
        return;
      }
      var res = await eng.ask(null, { label: 'Round ' + (eng.state.round + 1) });
      if (!eng.state.alive || res.cancelled) return;
      if (!res.ok) {
        renderTurnBanner('Good try! Next team\u2019s turn.');
        await eng.wait(900);
        if (!eng.state.alive) return;
        eng.setTurn(1 - eng.state.turn);
        eng.setPhase('action');
        renderTurnBanner();
        return;
      }

      eng.setPhase('animating');
      var placed = await opt.place(boardEl, cells, idx, eng.state.turn, eng.activeTeam(), eng);
      if (placed == null || !eng.state.alive) {
        eng.setPhase('action');
        return;
      }

      var win = findWinLine(cells, opt.cols, opt.k);
      if (win) {
        eng.setPhase('round_end');
        eng.state.data.wins[win.who]++;
        var winner = eng.teams[win.who];
        var winEls = opt.highlight(boardEl, win.line);
        A().play('line_win');
        A().play('fanfare');
        if (winEls && winEls.length >= 2) {
          J().beam(winEls[0], winEls[winEls.length - 1], winner.color, 1600);
          winEls.forEach(function (el) { J().sparks(el, 12, [winner.color, '#ffe066', '#ffffff'], 7); });
        }
        J().shake(7);
        U().confetti(28);
        eng.award(win.who, 20, winEls && winEls[Math.floor(winEls.length / 2)] || boardEl, '+20 WIN!');
        renderTurnBanner('🎉 ' + winner.name + ' connects ' + opt.k + ' and wins the round! +20');
        await eng.wait(2100);
        if (!eng.state.alive) return;
        if (eng.advanceRound()) {
          eng.setTurn(eng.state.round % 2, true);
          newBoard();
        }
      } else if (cells.every(function (c) { return c >= 0; })) {
        eng.setPhase('round_end');
        A().play('round');
        eng.award(0, 5, boardEl, '+5 Draw');
        eng.award(1, 5, boardEl, '+5 Draw');
        renderTurnBanner('🤝 Full board draw! Both teams get +5. Resetting board...');
        await eng.wait(1500);
        if (!eng.state.alive) return;
        newBoard();
      } else {
        eng.award(eng.state.turn, 5, placed.el || boardEl, '+5');
        eng.setTurn(1 - eng.state.turn);
        eng.setPhase('action');
        renderTurnBanner();
      }
    }

    eng.setTurn(0, true);
    newBoard();
  }

  GM.modes.ttt = {
    id: 'ttt', name: 'Tic-Tac-Toe', e: '⭕', teams: 2,
    desc: 'Two teams. Answer right to put your monster on a square. Three in a row wins the round!',
    fields: [{ key: 'rounds', label: 'Rounds', opts: [[1, '1'], [3, '3'], [5, '5']], def: 3 }],
    start: function (ctx) {
      twoTeamGame(ctx, {
        cls: 'ttt', cols: 3, rows: 3, k: 3, prompt: 'tap a square!',
        canPick: function (cells, idx) { return cells[idx] < 0; },
        build: function (el, cells, pick) {
          for (var i = 0; i < 9; i++) {
            (function (k) {
              var b = U().h('button', { type: 'button', class: 'gm-sq', 'aria-label': 'Square ' + (k + 1) });
              b.addEventListener('pointerdown', function (e) {
                e.preventDefault();
                if (cells[k] < 0) pick(k);
              });
              el.appendChild(b);
            })(i);
          }
        },
        place: async function (el, cells, idx, who, team, eng) {
          if (cells[idx] >= 0) return null;
          cells[idx] = who;
          var b = el.children[idx];
          var mk = markEl(team, 86);
          b.appendChild(mk);
          b.classList.add('mine');
          b.style.setProperty('--c', team.color);
          A().play('tap');
          J().squash(mk, 1.24, 0.78, 300);
          J().shockwave(b, team.color, 95, 380);
          J().sparks(b, 12, [team.color, '#ffe066', '#ffffff'], 6);
          await eng.wait(180);
          return { idx: idx, el: b };
        },
        highlight: function (el, line) {
          return line.map(function (i) {
            var cell = el.children[i];
            if (cell) cell.classList.add('win');
            return cell;
          });
        }
      });
    }
  };

  GM.modes.connect4 = {
    id: 'connect4', name: 'Connect 4', e: '🔴', teams: 2,
    desc: 'Two teams. Answer right to drop your monster disc. Connect four in a row to win!',
    fields: [{ key: 'rounds', label: 'Rounds', opts: [[1, '1'], [3, '3'], [5, '5']], def: 3 }],
    start: function (ctx) {
      twoTeamGame(ctx, {
        cls: 'c4', cols: 7, rows: 6, k: 4, prompt: 'pick a column to drop your disc!',
        canPick: function (cells, col) { return cells[col % 7] < 0; },
        build: function (el, cells, pick) {
          for (var c = 0; c < 7; c++) {
            (function (cc) {
              var b = U().h('button', { type: 'button', class: 'gm-ccol', text: '▼ ' + (cc + 1) });
              b.style.gridColumn = String(cc + 1);
              b.addEventListener('pointerdown', function (e) {
                e.preventDefault();
                pick(cc);
              });
              el.appendChild(b);
            })(c);
          }
          for (var i = 0; i < 42; i++) {
            var colIdx = i % 7;
            var s = U().h('div', { class: 'gm-hole', 'data-col': String(colIdx) });
            (function (cc) {
              s.addEventListener('pointerdown', function (e) {
                e.preventDefault();
                pick(cc);
              });
            })(colIdx);
            el.appendChild(s);
          }
        },
        place: async function (el, cells, idx, who, team, eng) {
          var col = idx % 7, r;
          for (r = 5; r >= 0; r--) if (cells[r * 7 + col] < 0) break;
          if (r < 0) return null;
          cells[r * 7 + col] = who;
          var holes = [].filter.call(el.children, function (x) { return x.classList.contains('gm-hole'); });
          var hole = holes[r * 7 + col];
          var mk = markEl(team, 54);
          hole.appendChild(mk);
          hole.classList.add('mine');
          hole.style.setProperty('--c', team.color);
          A().play('disc_drop');
          var dropPx = (r + 1) * 58;
          var dur = 180 + r * 55;
          await new Promise(function (resolve) {
            eng.tween(dur, 'outBounce', function (k) {
              mk.style.transform = 'translateY(' + Math.round(-dropPx * (1 - k)) + 'px)';
            }, function () {
              mk.style.transform = '';
              resolve();
            });
          });
          A().play('disc_bounce');
          J().squash(mk, 1.2, 0.82, 220);
          J().sparks(hole, 10, [team.color, '#ffe066'], 5);
          if (cells[col] >= 0 && el.children[col]) el.children[col].disabled = true;
          return { idx: r * 7 + col, el: hole };
        },
        highlight: function (el, line) {
          var holes = [].filter.call(el.children, function (x) { return x.classList.contains('gm-hole'); });
          return line.map(function (i) {
            if (holes[i]) holes[i].classList.add('win');
            return holes[i];
          });
        }
      });
    }
  };

  /* ================= Pass the Bomb / Pumpkin (Hot Potato) ================= */
  GM.modes.pass = {
    id: 'pass', name: 'Pass the Pumpkin', nameClassic: 'Pass the Bomb', e: '🥔',
    desc: 'A pumpkin ticks and passes from team to team. Answer right to pass it on. When it pops, every other team wins bonus points!',
    descClassic: 'A ticking bomb passes from team to team. Answer right to pass it on. When it pops, every other team wins bonus points!',
    fields: [{ key: 'rounds', label: 'Rounds', opts: [[3, '3'], [5, '5'], [8, '8']], def: 5 }],
    start: function (ctx) {
      var st = GM.state, hal = st.theme === 'halloween', thing = hal ? 'pumpkin' : 'bomb';
      var rounds = +ctx.cfg.rounds || 5;
      var eng = E().createSession(ctx, {
        maxRounds: rounds,
        data: { holder: 0, fuseMax: 12, fuseLeft: 12, tickAcc: 0, passArc: null, sparks: [] }
      });
      var nt = eng.teamCount, rootEl = ctx.root;
      rootEl.innerHTML = '';

      var info = U().h('div', { class: 'gm-info' });
      var stage = U().h('div', { class: 'gm-passbox' });
      var fxCv = U().h('canvas', { class: 'gm-pass-cv', width: 960, height: 540, style: 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;' });
      var fxCtx = fxCv.getContext('2d');
      var ring = U().h('div', { class: 'gm-passring', style: 'z-index:2;' });
      var pump = U().h('div', { class: 'gm-pumpkin', style: 'z-index:3;cursor:pointer;', title: 'Tap to answer and pass!' });
      var wrap = U().h('div', { class: 'gm-boardwrap' }, [info, stage]);
      stage.appendChild(fxCv);
      stage.appendChild(ring);
      stage.appendChild(pump);
      rootEl.appendChild(wrap);

      function seatAngle(i) { return (i / nt) * Math.PI * 2 - Math.PI / 2; }
      function seatPosPct(i, rx, ry) {
        var a = seatAngle(i);
        return { x: 50 + (rx || 39) * Math.cos(a), y: 48 + (ry || 36) * Math.sin(a) };
      }

      var seats = eng.teams.map(function (t, i) {
        var pos = seatPosPct(i, 39, 36);
        var s = U().h('div', { class: 'gm-seat' }, [
          U().monFace(t.mon, 78),
          U().h('b', { text: t.name })
        ]);
        s.style.left = pos.x + '%';
        s.style.top = pos.y + '%';
        s.style.setProperty('--c', t.color);
        ring.appendChild(s);
        return s;
      });

      eng.listen(pump, 'pointerdown', function (e) {
        e.preventDefault();
        if (eng.state.phase === 'action') askToPass();
      });

      function clearPodUrgency() {
        for (var i = 0; i < nt; i++) {
          var pod = document.getElementById('gm-team-' + i);
          if (pod) {
            pod.classList.remove('gm-pod-urgent');
            pod.style.removeProperty('--urg');
            pod.style.removeProperty('--hb-scale');
          }
          if (seats[i]) {
            seats[i].classList.remove('gm-seat-urgent');
            seats[i].style.removeProperty('--urg');
            seats[i].style.removeProperty('--hb-scale');
          }
        }
      }
      eng.on('end', clearPodUrgency);

      function placeBombAtHolder(idx) {
        var pos = seatPosPct(idx, 21, 20);
        pump.style.left = pos.x + '%';
        pump.style.top = pos.y + '%';
        seats.forEach(function (s, i) { s.classList.toggle('hold', i === idx); });
        clearPodUrgency();
      }

      function renderBanner(customMsg) {
        var hIdx = eng.state.data.holder, t = eng.teams[hIdx];
        info.innerHTML = '';
        info.style.setProperty('--c', t.color);
        info.appendChild(U().monFace(t.mon, 46));
        info.appendChild(U().h('b', {
          text: customMsg || (t.name + ' holds the ' + thing + '! Answer fast to pass it!  (round ' + (eng.state.round + 1) + ' of ' + eng.state.maxRounds + ')')
        }));
        if (!customMsg && eng.state.phase === 'action') {
          info.appendChild(U().btn('❓ Answer & Pass!', 'big amber', askToPass));
        }
      }

      function startRound() {
        var D = eng.state.data;
        D.fuseMax = U().rand(11, 17) + nt * 1.2;
        D.fuseLeft = D.fuseMax;
        D.tickAcc = 0;
        D.passArc = null;
        pump.innerHTML = '';
        pump.appendChild(U().art(hal ? 'c_pumpkin' : 'pu_boom', hal ? '🎃' : '💣', 'gm-pumpimg'));
        eng.setTurn(D.holder, true);
        placeBombAtHolder(D.holder);
        eng.setPhase('action');
        renderBanner();
      }

      async function popBomb() {
        var D = eng.state.data, holder = D.holder;
        eng.setPhase('round_end');
        clearPodUrgency();
        pump.textContent = '💥';
        J().squash(pump, 1.45, 0.65, 340);
        A().play('bomb_boom');
        J().shake(10);
        J().shockwave(pump, '#ff5d73', 240, 580);
        J().sparks(pump, 32, ['#ff5d73', '#ffe066', '#ffb21a', '#ffffff'], 11);
        U().confetti(28);
        U().wobble(seats[holder]);
        U().fx('smoke_puff', pump, 2);

        var others = eng.teams.map(function (t, i) { return i; }).filter(function (i) { return i !== holder; });
        if (others.length) {
          renderBanner('💥 BOOM on ' + eng.teams[holder].name + '! Every other team wins +10 points!');
          others.forEach(function (i) { eng.award(i, 10, seats[i], '+10 Safe!'); });
        } else {
          renderBanner('💥 Time is up! Let\u2019s start the next round!');
        }

        await eng.wait(2500);
        if (!eng.state.alive) return;
        if (eng.advanceRound()) {
          D.holder = eng.state.round % nt;
          startRound();
        }
      }

      async function askToPass() {
        if (eng.state.phase !== 'action' || !eng.state.alive) return;
        var D = eng.state.data, holder = D.holder, t = eng.teams[holder];
        var res = await eng.ask(null, {
          timer: Math.min(+ctx.cfg.timer || 0, 15) || 0,
          label: 'Pass the ' + thing + '!'
        });
        if (!eng.state.alive || res.cancelled || eng.state.phase === 'round_end') return;

        if (res.ok) {
          eng.setPhase('animating');
          var fromIdx = holder;
          var toIdx = (holder + 1) % nt;
          D.holder = toIdx;
          eng.award(fromIdx, 5, seats[fromIdx], '+5 Pass!');
          A().play('bomb_pass');
          if (hal) A().play('witch');
          var p0 = seatPosPct(fromIdx, 21, 20), p1 = seatPosPct(toIdx, 21, 20);
          pump.style.transition = 'none';
          await new Promise(function (resolve) {
            eng.tween(380, 'inOutCubic', function (k) {
              var arcLift = Math.sin(k * Math.PI) * 11;
              var cx = p0.x + (p1.x - p0.x) * k;
              var cy = p0.y + (p1.y - p0.y) * k - arcLift;
              pump.style.left = cx + '%';
              pump.style.top = cy + '%';
              pump.style.transform = 'translate(-50%,-50%) rotate(' + Math.round(k * 360) + 'deg) scale(' + (1 + Math.sin(k * Math.PI) * 0.22) + ')';
              D.sparks.push({ x: cx / 100 * fxCv.width, y: cy / 100 * fxCv.height, vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3, r: 5, life: 1, c: '#ffe066' });
            }, function () {
              pump.style.transform = 'translate(-50%,-50%)';
              pump.style.transition = '';
              resolve();
            });
          });
          if (!eng.state.alive || eng.state.phase === 'round_end') return;
          eng.setTurn(toIdx, true);
          placeBombAtHolder(toIdx);
          J().squash(seats[toIdx], 1.16, 0.86, 240);
          eng.setPhase('action');
          renderBanner();
        } else {
          renderBanner('Good try! ' + t.name + ' still holds the ' + thing + ' \u2014 try again!');
          await eng.wait(750);
          if (!eng.state.alive || eng.state.phase === 'round_end') return;
          eng.setPhase('action');
          renderBanner();
        }
      }

      /* 60fps simulation & fuse spark canvas loop */
      eng.raf(function (dt, now) {
        var D = eng.state.data;
        var W = fxCv.width, H = fxCv.height;
        fxCtx.clearRect(0, 0, W, H);

        /* Draw team ring track */
        fxCtx.save();
        fxCtx.strokeStyle = hal ? 'rgba(255, 224, 102, 0.24)' : 'rgba(31, 42, 68, 0.16)';
        fxCtx.lineWidth = 6;
        fxCtx.setLineDash([12, 10]);
        fxCtx.lineDashOffset = -(now * 0.025) % 22;
        fxCtx.beginPath();
        fxCtx.ellipse(W * 0.5, H * 0.48, W * 0.39, H * 0.36, 0, 0, Math.PI * 2);
        fxCtx.stroke();
        fxCtx.restore();

        /* Advance fuse timer when round is active (pauses slightly during question modal so kids have a fair chance) */
        if (eng.state.phase === 'action' || eng.state.phase === 'question') {
          var rate = eng.state.phase === 'question' ? 0.35 : 1.0;
          D.fuseLeft -= dt * rate;
          var urgency = Math.max(0, Math.min(1, 1 - D.fuseLeft / Math.max(1, D.fuseMax)));
          var fuseRatio = Math.max(0, Math.min(1, D.fuseLeft / Math.max(1, D.fuseMax)));
          var tickInterval = 0.85 - urgency * 0.52;
          D.tickAcc += dt;
          if (D.tickAcc >= tickInterval) {
            D.tickAcc = 0;
            A().play('fuse_tick', urgency);
            J().squash(pump, 1.14 + urgency * 0.1, 0.88 - urgency * 0.08, 180);
            var bPos = seatPosPct(D.holder, 21, 20);
            var bx = bPos.x / 100 * W, by = bPos.y / 100 * H - 28;
            for (var s = 0; s < 5; s++) {
              var a = -Math.PI / 2 + (Math.random() - 0.5) * 1.8, sp = 2 + Math.random() * 4.5;
              D.sparks.push({ x: bx, y: by, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.5, r: 3.5 + Math.random() * 3, life: 1, c: urgency > 0.65 ? '#ff5d73' : '#ffe066' });
            }
          }

          /* Heartbeat pulse scale on active team pod (#gm-team-<holder>) & holder seat */
          var hbFreq = 1.8 + urgency * 4.6;
          var hbWave = Math.pow(Math.max(0, Math.sin(now * 0.001 * hbFreq * Math.PI * 2)), 3);
          var hbScale = (1 + hbWave * (0.03 + urgency * 0.13)).toFixed(3);
          var urgStr = urgency.toFixed(3);
          var activePod = document.getElementById('gm-team-' + D.holder);
          if (activePod) {
            activePod.classList.toggle('gm-pod-urgent', urgency > 0.25);
            activePod.style.setProperty('--urg', urgStr);
            activePod.style.setProperty('--hb-scale', hbScale);
          }
          var activeSeat = seats[D.holder];
          if (activeSeat) {
            activeSeat.classList.toggle('gm-seat-urgent', urgency > 0.25);
            activeSeat.style.setProperty('--urg', urgStr);
            activeSeat.style.setProperty('--hb-scale', hbScale);
          }

          /* Draw pulsing tension halo + visual radial countdown arc around holder */
          var hPos = seatPosPct(D.holder, 39, 36);
          var hx = hPos.x / 100 * W, hy = hPos.y / 100 * H;
          var pulseR = 50 + hbWave * (6 + urgency * 12);
          var ringColor = urgency > 0.68 ? '#ff5d73' : (urgency > 0.35 ? '#ffb21a' : '#2ecc71');
          fxCtx.save();
          fxCtx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
          fxCtx.lineWidth = 7;
          fxCtx.beginPath();
          fxCtx.arc(hx, hy, pulseR, 0, Math.PI * 2);
          fxCtx.stroke();

          fxCtx.strokeStyle = ringColor;
          fxCtx.lineWidth = 7;
          fxCtx.lineCap = 'round';
          fxCtx.globalAlpha = 0.72 + urgency * 0.28;
          fxCtx.beginPath();
          fxCtx.arc(hx, hy, pulseR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * fuseRatio);
          fxCtx.stroke();
          fxCtx.restore();

          if (D.fuseLeft <= 0 && eng.state.phase !== 'round_end') {
            popBomb();
          }
        }

        /* Update & draw fuse/pass sparks */
        for (var i = D.sparks.length - 1; i >= 0; i--) {
          var p = D.sparks[i];
          p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life -= dt * 2.2;
          if (p.life <= 0) { D.sparks.splice(i, 1); continue; }
          fxCtx.save();
          fxCtx.globalAlpha = Math.max(0, p.life);
          fxCtx.fillStyle = p.c;
          fxCtx.beginPath();
          fxCtx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
          fxCtx.fill();
          fxCtx.restore();
        }
        return true;
      });

      startRound();
    }
  };

  /* ================= Bowling ================= */
  /* Real ten-pin bowling on one canvas lane in perspective.
     The physics runs top-down in inches on a real lane (41.5 in wide, head pin 60 ft from the foul line):
     ball and pins collide, a falling pin sweeps its whole length into its neighbours, pins bounce off the kickbacks.
     A strike only comes from the pocket; two balls per frame, so spares are possible.
     Each ball takes three timed taps: where to stand, aim at the arrows, power (+ an optional curve). */
  GM.modes.bowling = {
    id: 'bowling', name: 'Pumpkin Bowling', nameClassic: 'Bowling', e: '🎳',
    desc: 'Answer right, then stand, aim and roll. Hit the pocket for a strike, and pick up your spare with the second ball!',
    descClassic: 'Answer right, then stand, aim and roll. Hit the pocket for a strike, and pick up your spare with the second ball!',
    fields: [
      { key: 'frames', label: 'Frames for each team', opts: [[2, '2'], [3, '3'], [5, '5'], [8, '8']], def: 3 },
      { key: 'level', label: 'Difficulty', opts: [['easy', 'Easy'], ['normal', 'Normal'], ['hard', 'Hard']], def: 'normal' }
    ],
    start: function (ctx) {
      var st = GM.state, hal = st.theme === 'halloween';
      var LV = { easy: { s: 0.75, green: [0.6, 0.92], noise: 0.55 }, normal: { s: 1.15, green: [0.7, 0.88], noise: 1 }, hard: { s: 1.6, green: [0.76, 0.86], noise: 1.4 } }[ctx.cfg.level] || null;
      if (!LV) LV = { s: 1.15, green: [0.7, 0.88], noise: 1 };
      var totalFrames = (+ctx.cfg.frames || 3) * st.teams.length;
      var eng = E().createSession(ctx, {
        maxRounds: totalFrames,
        data: { stage: 'idle', pos: 0, posDir: 1, pow: 0, powDir: 1, eff: 0, effDir: 1, ball: 1 }
      });
      var rootEl = ctx.root;
      rootEl.innerHTML = '';

      var info = U().h('div', { class: 'gm-info' });
      var lane = U().h('div', { class: 'gm-lane gm-lane3d', title: 'Tap the lane (or press Space) to stop each bar' });
      var cv = U().h('canvas', { class: 'gm-lane-cv' });
      var g = cv.getContext('2d');
      var deck = U().h('div', { class: 'gm-bowl-deck' }); // where coins and sparks start
      var card = U().h('div', { class: 'gm-bowl-card' });
      var askCard = U().h('div', { class: 'gm-bowl-ask' }); // the big "answer to bowl" card over the lane
      var res = U().h('div', { class: 'gm-bres' });
      lane.appendChild(cv);
      lane.appendChild(deck);
      lane.appendChild(askCard);
      var mid = U().h('div', { class: 'gm-bowl-mid' }, [card, lane]);
      rootEl.appendChild(U().h('div', { class: 'gm-boardwrap' }, [info, mid, res]));

      var W = 800, H = 480;
      function fit() {
        var mw = mid.clientWidth, mh = mid.clientHeight;
        if (mw > 40 && mh > 40) { var lw = Math.min(mw, Math.round(mh * 1.15)) + 'px'; if (lane.style.width !== lw) lane.style.width = lw; }
        var r = lane.getBoundingClientRect();
        if (r.width < 40 || r.height < 40) return;
        var dpr = Math.min(2, root.devicePixelRatio || 1);
        W = r.width; H = r.height;
        var cw = Math.round(W * dpr), ch = Math.round(H * dpr);
        if (cv.width !== cw || cv.height !== ch) { cv.width = cw; cv.height = ch; }
        g.setTransform(cv.width / W, 0, 0, cv.height / H, 0, 0);
      }
      fit();
      eng.listen(root, 'resize', fit);
      if (root.ResizeObserver) {
        var ro = new root.ResizeObserver(fit);
        ro.observe(lane);
        ro.observe(mid);
        eng.on('end', function () { try { ro.disconnect(); } catch (e) { /* ignore */ } });
      }

      /* ---------- drawing space: u across (-1..1 = the wood), v down the lane, z up; s(v) = 1 / (1 + K v) ---------- */
      var K = 2.3;
      function geo() {
        var y1 = H * 1.02, yt = H * 0.3;
        return { y1: y1, yh: (yt * (1 + K) - y1) / K, half: Math.min(W * 0.3, H * 0.46), cx: W / 2 };
      }
      function P(u, v, z) {
        var G = geo(), s = 1 / (1 + K * v);
        return { x: G.cx + u * G.half * s, y: G.yh + (G.y1 - G.yh) * s - (z || 0) * G.half * s, k: G.half * s };
      }
      function quad(u0, u1, v0, v1) {
        var a = P(u0, v0), b = P(u1, v0), c = P(u1, v1), d = P(u0, v1);
        g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.lineTo(c.x, c.y); g.lineTo(d.x, d.y); g.closePath();
      }
      function rr(x, y, w, h, r) {
        g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
        g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
      }

      /* ---------- physics space, in inches ---------- */
      var LW = 20.75, KICK = 25.3, HEAD = 720, PITY = 800, PIN_R = 2.4, BALL_R = 4.3, MB = 6.8, MP = 1.6, PIN_LEN = 14;
      function U_(x) { return x / LW; }
      function V_(y) { return y < 690 ? y * (0.74 / 690) : 0.74 + (y - 690) * 0.0033; } // the pin deck is drawn a little deeper
      var END = V_(HEAD + 52), PIT = V_(PITY + 25);

      var C = hal
        ? { wall0: '#3b1658', wall1: '#14061f', wood0: '#e7b77b', wood1: '#b9824a', stripe: '#8b3fd1', bulb: '#ff9a3c' }
        : { wall0: '#24407a', wall1: '#0d1733', wood0: '#f7cf93', wood1: '#c98e4f', stripe: '#e23b4a', bulb: '#ffe066' };

      var LANE_OFF = 3.2; // the next lane: wood + two gutters + the capping between lanes, in lane half-widths
      function laneName() { var t = eng.activeTeam(); return (t && t.name) || 'Lane'; }
      function drawLane(now) {
        var far = P(0, PIT);
        var wg = g.createLinearGradient(0, 0, 0, far.y);
        wg.addColorStop(0, C.wall1); wg.addColorStop(1, C.wall0);
        g.fillStyle = wg; g.fillRect(0, 0, W, far.y + 1);
        g.fillStyle = C.wall1; g.fillRect(0, far.y, W, H - far.y);
        for (var L = -3; L <= 3; L++) laneAt(L, now);
        /* masking unit over the pins, with a sign for every lane; ours shows the team */
        var my = P(0, PIT, 1.3).y, mh = Math.max(16, far.k * 0.42);
        var mg = g.createLinearGradient(0, my - mh, 0, my);
        mg.addColorStop(0, '#0a0e1c'); mg.addColorStop(1, '#222b4a');
        g.fillStyle = mg; g.fillRect(0, my - mh, W, mh);
        g.fillStyle = C.stripe; g.fillRect(0, my - 3, W, 3);
        for (L = 0; L <= 0; L++) {
          var c = P(0, PIT, 1.3), ph = mh * 0.6, txt = laneName();
          g.font = '800 ' + Math.round(ph * 0.66) + 'px Fredoka, system-ui, sans-serif';
          var pw = Math.max(far.k * 0.9, g.measureText(txt).width + ph);
          if (c.x + pw < 0 || c.x - pw > W) continue;
          g.fillStyle = L === 0 ? '#ffffff' : 'rgba(255,255,255,.16)';
          rr(c.x - pw / 2, my - mh * 0.8, pw, ph, ph * 0.3); g.fill();
          g.fillStyle = L === 0 ? '#1f2a44' : 'rgba(255,255,255,.6)';
          g.textAlign = 'center'; g.textBaseline = 'middle';
          g.fillText(txt, c.x, my - mh * 0.8 + ph / 2 + 1);
          if (L === 0) {
            for (var b = 0; b < 6; b++) {
              var on = (Math.floor(now / 260) + b) % 3 !== 0;
              g.fillStyle = on ? C.bulb : 'rgba(255,255,255,.2)';
              [-1, 1].forEach(function (sd) { g.beginPath(); g.arc(c.x + sd * (pw / 2 + 8 + b * 9), my - mh * 0.8 + ph / 2, 2.6, 0, 7); g.fill(); });
            }
          }
        }
      }
      function laneAt(L, now) {
        var off = L * LANE_OFF, main = L === 0;
        function q(u0, u1, v0, v1) { quad(off + u0, off + u1, v0, v1); }
        if (P(off - 1.4, 0).x > W + 40 && P(off - 1.4, PIT).x > W) return;
        if (P(off + 1.4, 0).x < -40 && P(off + 1.4, PIT).x < 0) return;
        /* capping between this lane and the next one, with a stripe */
        q(1.22, LANE_OFF - 1.22, -0.3, PIT); g.fillStyle = '#20263a'; g.fill();
        q(LANE_OFF / 2 - 0.1, LANE_OFF / 2 + 0.1, -0.3, PIT); g.fillStyle = C.stripe; g.fill();
        q(1.22, 1.32, -0.3, PIT); g.fillStyle = 'rgba(255,255,255,.18)'; g.fill();
        q(LANE_OFF - 1.32, LANE_OFF - 1.22, -0.3, PIT); g.fill();
        q(-1.25, 1.25, END, PIT); g.fillStyle = '#05070f'; g.fill();
        [[-1.22, -1], [1, 1.22]].forEach(function (sd) {
          q(sd[0], sd[1], -0.3, END);
          var gg = g.createLinearGradient(P(off + sd[0], 0).x, 0, P(off + sd[1], 0).x, 0);
          gg.addColorStop(0, '#2b3448'); gg.addColorStop(0.5, '#6a7590'); gg.addColorStop(1, '#2b3448');
          g.fillStyle = gg; g.fill();
        });
        q(-1, 1, -0.3, END);
        var wd = g.createLinearGradient(0, H, 0, P(0, END).y);
        wd.addColorStop(0, C.wood0); wd.addColorStop(1, C.wood1);
        g.fillStyle = wd; g.fill();
        var nb = main ? 20 : 8;
        for (var i = 0; i < nb; i++) {
          q(-1 + i * 2 / nb, -1 + (i + 1) * 2 / nb, -0.3, END);
          g.fillStyle = i % 2 ? 'rgba(255,255,255,.07)' : 'rgba(120,60,0,.06)'; g.fill();
          g.strokeStyle = 'rgba(110,60,15,.14)'; g.lineWidth = 1; g.stroke();
        }
        /* glossy lane: a soft reflection of the lights down the middle */
        q(-0.5, 0.5, -0.3, END);
        var sh2 = g.createLinearGradient(P(off - 0.5, 0).x, 0, P(off + 0.5, 0).x, 0);
        sh2.addColorStop(0, 'rgba(255,255,255,0)'); sh2.addColorStop(0.5, 'rgba(255,255,255,.26)'); sh2.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = sh2; g.fill();
        q(-1, 1, V_(HEAD - 12), END); g.fillStyle = 'rgba(255,240,210,.18)'; g.fill();
        g.fillStyle = 'rgba(110,50,10,.45)';
        for (var a = -3; a <= 3; a++) {
          var ay = 180 + Math.abs(a) * 12, ax = a * 5.2 + off * LW, t = P(U_(ax), V_(ay + 14)), l = P(U_(ax - 1.1), V_(ay)), r2 = P(U_(ax + 1.1), V_(ay));
          g.beginPath(); g.moveTo(t.x, t.y); g.lineTo(l.x, l.y); g.lineTo(r2.x, r2.y); g.closePath(); g.fill();
          var d = P(U_(ax), V_(84));
          g.beginPath(); g.ellipse(d.x, d.y, d.k * 0.025 + 1, d.k * 0.012 + 1, 0, 0, 7); g.fill();
        }
        q(-1.22, 1.22, -0.004, 0.004); g.fillStyle = '#1f2a44'; g.fill();
        if (!main) { q(-1.3, LANE_OFF - 1.3, -0.3, PIT); g.fillStyle = 'rgba(6,9,22,.62)'; g.fill(); }
      }

      /* ---------- pins ---------- */
      var SPOTS = [[0, 720], [-6, 730.4], [6, 730.4], [-12, 740.8], [0, 740.8], [12, 740.8], [-18, 751.2], [-6, 751.2], [6, 751.2], [18, 751.2]];
      var pins = SPOTS.map(function (s, i) { return { id: i, sx: s[0], sy: s[1] }; });
      function rackPin(p) {
        p.x = p.sx + (Math.random() - 0.5) * 0.3; p.y = p.sy + (Math.random() - 0.5) * 0.3;
        p.vx = 0; p.vy = 0; p.z = 0; p.vz = 0; p.down = false; p.fall = 0; p.dx = 0; p.dy = 1; p.alpha = 1; p.gone = false; p.drop = 1; p.rollDown = false; p.sweep = false;
      }
      function topple(p) {
        if (p.down) return;
        p.down = true; p.fall = 0; p.rollDown = true;
        var sp = Math.hypot(p.vx, p.vy);
        p.vz = Math.min(110, sp * 0.2); // a hard hit throws the pin up
        if (sp > 1) { p.dx = p.vx / sp; p.dy = p.vy / sp; } else { var a = Math.random() * 6.28; p.dx = Math.cos(a); p.dy = Math.sin(a); }
        A().play('pin_hit');
      }
      function pinShape(h) {
        g.beginPath(); g.moveTo(-0.09 * h, 0);
        g.bezierCurveTo(-0.21 * h, -0.2 * h, -0.2 * h, -0.4 * h, -0.115 * h, -0.53 * h);
        g.bezierCurveTo(-0.06 * h, -0.61 * h, -0.05 * h, -0.67 * h, -0.075 * h, -0.75 * h);
        g.bezierCurveTo(-0.125 * h, -0.87 * h, -0.1 * h, -h, 0, -h);
        g.bezierCurveTo(0.1 * h, -h, 0.125 * h, -0.87 * h, 0.075 * h, -0.75 * h);
        g.bezierCurveTo(0.05 * h, -0.67 * h, 0.06 * h, -0.61 * h, 0.115 * h, -0.53 * h);
        g.bezierCurveTo(0.2 * h, -0.4 * h, 0.21 * h, -0.2 * h, 0.09 * h, 0);
        g.closePath();
      }
      function drawPin(p) {
        if (p.gone || p.alpha <= 0) return;
        var base = P(U_(p.x), V_(p.y), (p.drop > 0 ? p.drop * 0.8 : 0) + p.z / LW), floor = P(U_(p.x), V_(p.y)), h = base.k * 0.95;
        /* upright vector, or the pin lying along its fall direction (seen in perspective) */
        var e = p.down ? Math.min(1, p.fall) : 0;
        e = e * e * (3 - 2 * e);
        var tip = P(U_(p.x + p.dx * 15), V_(p.y + p.dy * 15), 0.12);
        var lx = tip.x - floor.x, ly = tip.y - floor.y;
        var vx = lx * e, vy = -h * (1 - e) + ly * e, len = Math.max(4, Math.hypot(vx, vy));
        g.save();
        g.globalAlpha = Math.max(0, p.alpha);
        g.fillStyle = 'rgba(40,20,0,.28)';
        g.beginPath(); g.ellipse(floor.x + vx * 0.4 * e, floor.y + vy * 0.4 * e, h * 0.17 + Math.abs(vx) * 0.4 * e, h * 0.05 + Math.abs(vy) * 0.25 * e, 0, 0, 7); g.fill();
        if (e < 0.05 && p.z < 0.5 && p.id != null) { // reflection on the polished lane (our lane only)
          g.save(); g.translate(floor.x, floor.y); g.scale(1, -0.45); pinShape(h); g.fillStyle = 'rgba(255,255,255,.1)'; g.fill(); g.restore();
        }
        g.translate(base.x, base.y);
        g.rotate(Math.atan2(vx, -vy));
        g.scale(1, len / h);
        pinShape(h);
        var pg = g.createLinearGradient(-0.2 * h, 0, 0.2 * h, 0);
        pg.addColorStop(0, '#b4bccd'); pg.addColorStop(0.38, '#ffffff'); pg.addColorStop(0.62, '#f1f3f8'); pg.addColorStop(1, '#a3adc2');
        g.fillStyle = pg; g.fill();
        g.save(); g.clip();
        g.fillStyle = C.stripe;
        g.fillRect(-h, -0.705 * h, 2 * h, 0.045 * h);
        g.fillRect(-h, -0.635 * h, 2 * h, 0.035 * h);
        g.fillStyle = 'rgba(255,255,255,.75)';
        g.beginPath(); g.ellipse(-0.07 * h, -0.33 * h, 0.03 * h, 0.12 * h, 0.15, 0, 7); g.fill();
        g.restore();
        g.strokeStyle = '#1f2a44'; g.lineWidth = Math.max(1.2, h * 0.028); g.lineJoin = 'round';
        pinShape(h); g.stroke();
        g.restore();
      }

      /* ---------- ball ---------- */
      var ball = { x: 0, y: 6, vx: 0, vy: 0, on: false, gutter: false, rot: 0, alpha: 1, hook: 0, done: true };
      function drawBall() {
        if (ball.alpha <= 0) return;
        var f = P(U_(ball.x), V_(ball.y)), r = f.k * (BALL_R / LW), col = (eng.activeTeam() || {}).color || '#ff6f3d';
        var x = f.x, y = f.y - r;
        g.save(); g.globalAlpha = ball.alpha;
        g.fillStyle = 'rgba(30,15,0,.3)';
        g.beginPath(); g.ellipse(x, f.y, r * 0.95, r * 0.25, 0, 0, 7); g.fill();
        g.beginPath(); g.arc(x, y, r, 0, 7); g.fillStyle = col; g.fill();
        var dk = g.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.2, x, y, r);
        dk.addColorStop(0, 'rgba(0,0,0,0)'); dk.addColorStop(0.6, 'rgba(0,0,0,.08)'); dk.addColorStop(1, 'rgba(0,0,0,.5)');
        g.fillStyle = dk; g.fill();
        [[-0.2, 0], [0.2, 0], [0, 0.45]].forEach(function (hole) {
          var a = ball.rot + hole[1], c = Math.cos(a);
          if (c < 0.05) return;
          g.fillStyle = 'rgba(15,10,30,.85)';
          g.beginPath(); g.ellipse(x + hole[0] * r * c, y - r * 0.62 * Math.sin(a), r * 0.1, r * 0.1 * c, 0, 0, 7); g.fill();
        });
        var gl = g.createRadialGradient(x - r * 0.38, y - r * 0.42, 0, x - r * 0.38, y - r * 0.42, r * 0.55);
        gl.addColorStop(0, 'rgba(255,255,255,.85)'); gl.addColorStop(1, 'rgba(255,255,255,0)');
        g.beginPath(); g.arc(x, y, r, 0, 7); g.fillStyle = gl; g.fill();
        g.strokeStyle = '#1f2a44'; g.lineWidth = Math.max(1.5, r * 0.07); g.stroke();
        g.restore();
      }

      /* ---------- guide, power meter and effect dial ---------- */
      var DEG = Math.PI / 180;
      function drawGuide(now) {
        var D = eng.state.data;
        if (D.stage !== 'pos') return;
        var a = P(U_(ball.x), V_(40)), b = P(U_(ball.x), V_(330));
        g.save(); g.lineCap = 'round';
        g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 4; g.setLineDash([12, 12]); g.lineDashOffset = -(now * 0.05) % 24;
        g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
        g.restore();
      }
      function meterBox() {
        var bh = H * 0.46, bw = Math.max(18, Math.min(30, W * 0.02));
        return { x: Math.max(14, P(-1.9, 0.02).x - bw), y: H * 0.94 - bh, w: bw, h: bh };
      }
      function drawMeter() {
        var D = eng.state.data;
        if (D.stage !== 'power' && D.stage !== 'eff') return;
        var m = meterBox(), x = m.x, y = m.y, bw = m.w, bh = m.h;
        g.save();
        g.globalAlpha = D.stage === 'power' ? 1 : 0.6;
        g.fillStyle = 'rgba(0,0,0,.5)'; rr(x - 5, y - 5, bw + 10, bh + 10, 10); g.fill();
        var mg = g.createLinearGradient(0, y + bh, 0, y);
        mg.addColorStop(0, '#38bdf8'); mg.addColorStop(LV.green[0], '#ffe066'); mg.addColorStop(LV.green[1], '#2ecc71'); mg.addColorStop(1, '#ff5d73');
        g.fillStyle = mg; rr(x, y, bw, bh, 7); g.fill();
        g.fillStyle = 'rgba(46,204,113,.95)';
        g.fillRect(x, y + bh * (1 - LV.green[1]), bw, bh * (LV.green[1] - LV.green[0]));
        g.strokeStyle = '#fff'; g.lineWidth = 2; g.strokeRect(x, y + bh * (1 - LV.green[1]), bw, bh * (LV.green[1] - LV.green[0]));
        var my = y + bh * (1 - D.pow);
        g.fillStyle = '#fff'; g.strokeStyle = '#1f2a44'; g.lineWidth = 3;
        rr(x - 8, my - 5, bw + 16, 10, 5); g.fill(); g.stroke();
        g.font = '800 ' + Math.round(Math.max(12, bw * 0.55)) + 'px Fredoka, system-ui, sans-serif';
        g.textAlign = 'center'; g.fillStyle = '#fff'; g.fillText('POWER', x + bw / 2, y - 12);
        g.restore();
      }
      function drawEffect() {
        var D = eng.state.data;
        if (D.stage !== 'eff') return;
        var R = Math.max(46, Math.min(W, H) * 0.15), cx = Math.min(W - R - 16, P(1.9, 0.02).x + R), cy = H * 0.9;
        g.save();
        g.fillStyle = 'rgba(0,0,0,.5)';
        g.beginPath(); g.arc(cx, cy, R + 10, Math.PI, 0); g.closePath(); g.fill();
        /* left curve, straight, right curve */
        [[-1, -0.33, '#a855f7'], [-0.33, 0.33, '#2ecc71'], [0.33, 1, '#f59e0b']].forEach(function (z) {
          g.strokeStyle = z[2]; g.lineWidth = R * 0.22;
          g.beginPath(); g.arc(cx, cy, R * 0.8, -Math.PI / 2 + z[0] * 1.1, -Math.PI / 2 + z[1] * 1.1); g.stroke();
        });
        var a = -Math.PI / 2 + D.eff * 1.1;
        g.strokeStyle = '#fff'; g.lineWidth = 5; g.lineCap = 'round';
        g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * R * 0.95, cy + Math.sin(a) * R * 0.95); g.stroke();
        g.fillStyle = '#fff'; g.beginPath(); g.arc(cx, cy, 6, 0, 7); g.fill();
        g.font = '800 ' + Math.round(Math.max(12, R * 0.2)) + 'px Fredoka, system-ui, sans-serif';
        g.textAlign = 'center'; g.fillText('EFFECT', cx, cy - R - 16);
        g.textAlign = 'left'; g.fillText('↶', cx - R - 4, cy - 4);
        g.textAlign = 'right'; g.fillText('↷', cx + R + 4, cy - 4);
        g.restore();
      }

      /* ---------- big text pop (STRIKE! SPARE!) ---------- */
      var pop = null;
      function drawPop(now) {
        if (!pop) return;
        var t = (now - pop.t0) / 1000;
        if (t > 1.7) { pop = null; return; }
        var sc = t < 0.25 ? 0.4 + t / 0.25 * 0.8 : (t < 0.4 ? 1.2 - (t - 0.25) / 0.15 * 0.2 : 1);
        g.save();
        g.globalAlpha = t > 1.3 ? Math.max(0, 1 - (t - 1.3) / 0.4) : 1;
        g.translate(W / 2, H * 0.62); g.scale(sc, sc); g.rotate(-0.05);
        g.font = '900 ' + Math.round(Math.min(W * 0.09, H * 0.18)) + 'px Fredoka, "Baloo 2", system-ui, sans-serif';
        g.textAlign = 'center'; g.textBaseline = 'middle';
        g.lineJoin = 'round'; g.lineWidth = Math.min(W, H) * 0.03; g.strokeStyle = '#1f2a44'; g.strokeText(pop.text, 0, 0);
        g.fillStyle = pop.col; g.fillText(pop.text, 0, 0);
        g.restore();
      }
      function say(text, col) { pop = { text: text, col: col, t0: performance.now() }; }

      /* ---------- simulation ---------- */
      function hit(a, ma, b, mb, e) { // circles a and b touching: push apart and swap momentum along the line between them
        var dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 0.001, nx = dx / d, ny = dy / d;
        var rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        var over = (a.rad + b.rad) - d, im = 1 / ma + 1 / mb;
        if (over > 0) { a.x -= nx * over * (1 / ma) / im; a.y -= ny * over * (1 / ma) / im; b.x += nx * over * (1 / mb) / im; b.y += ny * over * (1 / mb) / im; }
        if (rel >= 0) return 0;
        var j = -(1 + e) * rel / im;
        a.vx -= j / ma * nx; a.vy -= j / ma * ny; b.vx += j / mb * nx; b.vy += j / mb * ny;
        return j;
      }
      function segDist(px, py, ax, ay, bx, by) {
        var vx = bx - ax, vy = by - ay, l2 = vx * vx + vy * vy, t = l2 ? Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / l2)) : 0;
        var cx = ax + vx * t, cy = ay + vy * t;
        return { d: Math.hypot(px - cx, py - cy), cx: cx, cy: cy };
      }
      ball.rad = BALL_R;
      pins.forEach(function (p) { p.rad = PIN_R; });

      var simT = 0, slowEnd = -1; // slow motion while the ball meets the pins
      function simStep(h) {
        simT += h;
        if (ball.on && !ball.gutter && slowEnd < 0 && ball.y > HEAD - 40) slowEnd = simT + 0.5;
        if (ball.on) {
          if (!ball.gutter && ball.y > 420 && ball.y < HEAD) ball.vx += ball.hook * h * Math.min(1, (ball.y - 420) / 160);
          ball.x += ball.vx * h; ball.y += ball.vy * h; ball.rot += h * ball.vy / 30;
          ball.vy = Math.max(60, ball.vy - 8 * h);
          if (!ball.gutter && Math.abs(ball.x) > LW - 0.8) {
            ball.gutter = true; ball.vx = 0; ball.x = (ball.x > 0 ? 1 : -1) * (LW + 2.3); A().play('hunt_empty');
          }
          if (ball.y > PITY + 30) { ball.on = false; ball.alpha = 0; }
          else if (ball.y > PITY) ball.alpha = Math.max(0, 1 - (ball.y - PITY) / 30);
          if (!ball.gutter) {
            pins.forEach(function (p) {
              if (p.gone || Math.hypot(p.x - ball.x, p.y - ball.y) > BALL_R + PIN_R) return;
              var j = hit(ball, MB, p, MP, 0.7);
              if (!p.down && j / MP > 18) topple(p);
              if (j > 300) J().shake(3);
            });
          }
        }
        pins.forEach(function (p) {
          if (p.gone) return;
          if (p.down && p.fall < 1) p.fall = Math.min(1, p.fall + h / 0.24);
          var sp = Math.hypot(p.vx, p.vy);
          if (sp > 0) {
            var dec = (p.down ? 55 : 260) * h, k = sp > dec ? (sp - dec) / sp : 0;
            p.vx *= k; p.vy *= k;
            p.x += p.vx * h; p.y += p.vy * h;
          }
          if (p.z > 0 || p.vz > 0) { p.z += p.vz * h; p.vz -= 386 * h; if (p.z <= 0) { p.z = 0; p.vz = p.vz < -25 ? -p.vz * 0.3 : 0; } }
          if (p.y > HEAD - 30 && Math.abs(p.x) > KICK - PIN_R) { // the kickback walls throw pins back in
            p.x = (p.x > 0 ? 1 : -1) * (KICK - PIN_R); p.vx = -p.vx * 0.55;
          }
          if (!p.down && Math.abs(p.x) > LW + 0.5) topple(p);
          if (p.y > PITY) { if (!p.down) topple(p); p.alpha = Math.max(0, p.alpha - h * 2); if (p.alpha <= 0) p.gone = true; }
        });
        /* pin against pin: a falling pin sweeps its whole length */
        for (var i = 0; i < pins.length; i++) {
          var a = pins[i];
          if (a.gone) continue;
          for (var j = 0; j < pins.length; j++) {
            if (i === j) continue;
            var b = pins[j];
            if (b.gone || b.down) continue;
            if (a.down) {
              var spA = Math.hypot(a.vx, a.vy);
              if (spA < 30 && a.fall >= 1) continue;
              var L = PIN_LEN * a.fall, s = segDist(b.x, b.y, a.x, a.y, a.x + a.dx * L, a.y + a.dy * L);
              if (s.d < PIN_R * 2) {
                var nx = (b.x - s.cx) / (s.d || 0.01), ny = (b.y - s.cy) / (s.d || 0.01), push = 12 + spA * 0.3;
                b.vx = a.vx * 0.7 + nx * push + a.dx * 30 * (1 - a.fall);
                b.vy = a.vy * 0.7 + ny * push + a.dy * 30 * (1 - a.fall);
                a.vx *= 0.8; a.vy *= 0.8;
                topple(b);
              }
            } else if (j > i && Math.hypot(a.x - b.x, a.y - b.y) < PIN_R * 2) {
              var jj = hit(a, MP, b, MP, 0.5);
              if (jj / MP > 18) { topple(a); topple(b); }
            }
          }
        }
      }
      function settled() {
        if (ball.on && ball.y < PITY) return false;
        return pins.every(function (p) { return p.gone || (Math.hypot(p.vx, p.vy) < 6 && (!p.down || p.fall >= 1)); });
      }

      /* ---------- turns ---------- */
      function rack() { pins.forEach(rackPin); }
      function resetBall() {
        ball.x = eng.state.data.pos; ball.y = 6; ball.vx = 0; ball.vy = 0; ball.on = false; ball.gutter = false; ball.alpha = 1; ball.rot = 0; ball.hook = 0;
      }
      var cardData = st.teams.map(function () { return []; });
      function renderCard() {
        card.innerHTML = '';
        st.teams.forEach(function (t, ti) {
          var row = U().h('div', { class: 'gm-bowl-row' + (ti === eng.state.turn ? ' on' : '') });
          row.style.setProperty('--c', t.color);
          row.appendChild(U().h('b', { text: t.name }));
          for (var fi = 0; fi < (+ctx.cfg.frames || 3); fi++) {
            var fr = cardData[ti][fi] || [], box = U().h('span', { class: 'gm-bowl-fr' });
            box.appendChild(U().h('i', { text: fr[0] || '' }));
            box.appendChild(U().h('i', { text: fr[1] || '' }));
            row.appendChild(box);
          }
          card.appendChild(row);
        });
      }
      function sweep() { pins.forEach(function (p) { if (p.down) p.sweep = true; p.rollDown = false; }); }
      function standing() { return pins.filter(function (p) { return !p.gone && !p.down && !p.sweep; }).length; }

      function header(text, btns) {
        var t = eng.activeTeam();
        info.innerHTML = '';
        info.style.setProperty('--c', t.color);
        info.appendChild(U().monFace(t.mon, 46));
        info.appendChild(U().h('b', { text: text }));
        (btns || []).forEach(function (b) { info.appendChild(b); });
      }
      var STEP_TXT = {
        pos: '1️⃣ MOVE: tap to stop the ball where you want to stand.',
        power: '2️⃣ POWER: tap when the bar is in the green.',
        eff: '3️⃣ EFFECT: tap to set the curve (green = straight).'
      };
      function setStage(stage) {
        var D = eng.state.data;
        D.stage = stage;
        var pre = D.ball === 2 ? 'Ball 2 (' + standing() + ' left) · ' : '';
        header(pre + STEP_TXT[stage], [U().btn('✋ STOP!', 'big green', lock)]);
        if (stage === 'pos' && D.ball === 1) res.textContent = '💡 Tip: stand on one side and curve the ball into the pocket, just beside the head pin.';
      }

      function showTurn() {
        var t = eng.activeTeam(), D = eng.state.data;
        D.stage = 'idle'; D.ball = 1;
        renderCard();
        eng.setPhase('idle');
        rack(); resetBall();
        var frameNo = cardData[eng.state.turn].length + 1, frames = +ctx.cfg.frames || 3;
        header(t.name + '\u2019s turn \u00b7 frame ' + frameNo + ' of ' + frames);
        askCard.innerHTML = '';
        askCard.style.setProperty('--c', t.color);
        askCard.appendChild(U().h('div', { class: 'gm-bowl-ask-mon' }, [U().monFull(t.mon, 120)]));
        askCard.appendChild(U().h('b', { text: t.name }));
        askCard.appendChild(U().h('small', { text: 'Frame ' + frameNo + ' of ' + frames + ' \u00b7 answer right to bowl!' }));
        askCard.appendChild(U().btn('\u2753 Ask me!', 'big amber gm-bowl-askbtn', ask));
        askCard.classList.remove('show'); void askCard.offsetWidth; askCard.classList.add('show');
        res.textContent = '';
      }

      async function ask() {
        if (eng.state.phase !== 'idle' || !eng.state.alive) return;
        askCard.classList.remove('show');
        var r = await eng.ask(null, { label: 'Frame ' + (eng.state.round + 1) });
        if (!eng.state.alive) return;
        if (r.cancelled) { askCard.classList.add('show'); return; }
        var D = eng.state.data;
        if (!r.ok) {
          eng.setPhase('animating'); D.stage = 'roll';
          header('🌀 Oops! The ball slipped into the gutter.');
          res.textContent = '🌀 Gutter ball! Next team’s frame.';
          resetBall(); ball.on = true; ball.gutter = true; ball.x = (Math.random() < 0.5 ? -1 : 1) * (LW + 2.3); ball.vy = 300;
          A().play('hunt_empty');
          await eng.wait(2600);
          if (!eng.state.alive) return;
          if (eng.advanceRound()) { eng.nextTurn(); showTurn(); }
          return;
        }
        eng.setPhase('action');
        D.pos = -12; D.posDir = 1;
        setStage('pos');
      }

      function lock() {
        var D = eng.state.data;
        if (eng.state.phase !== 'action' || !eng.state.alive) return;
        A().play('tap');
        if (D.stage === 'pos') { ball.x = D.pos; D.pow = 0; D.powDir = 1; setStage('power'); }
        else if (D.stage === 'power') { D.eff = -1; D.effDir = 1; setStage('eff'); }
        else if (D.stage === 'eff') launch();
      }
      eng.listen(lane, 'pointerdown', function (e) {
        if (eng.state.phase !== 'action') return;
        e.preventDefault();
        lock();
      });
      eng.listen(document, 'keydown', function (e) {
        if (e.code !== 'Space' || eng.state.phase !== 'action') return;
        e.preventDefault();
        lock();
      });

      async function launch() {
        var D = eng.state.data;
        D.stage = 'roll';
        eng.setPhase('animating');
        var g0 = LV.green[0], g1 = LV.green[1], miss = D.pow < g0 ? g0 - D.pow : (D.pow > g1 ? D.pow - g1 : 0);
        /* a release outside the green wobbles the line; too soft also hooks less */
        var ang = ((Math.random() - 0.5) * (0.12 + miss * 7) * LV.noise) * DEG;
        var speed = 230 + D.pow * 150;
        ball.vx = Math.sin(ang) * speed; ball.vy = Math.cos(ang) * speed;
        ball.hook = D.eff * 32 * (0.7 + 0.3 * Math.min(1, D.pow)) * (1 + (Math.random() - 0.5) * 0.25 * LV.noise);
        ball.on = true; slowEnd = -1;
        header(eng.activeTeam().name + ' is rolling... 🎳');
        A().play('bowling_roll');
        var t0 = simT;
        while (eng.state.alive) {
          await eng.wait(100);
          if (simT - t0 > 1.2 && settled()) break;
          if (simT - t0 > 7) break;
        }
        if (!eng.state.alive) return;
        afterBall();
      }

      async function afterBall() {
        var D = eng.state.data, n = pins.filter(function (p) { return p.rollDown; }).length, left = pins.filter(function (p) { return !p.down; }).length;
        var pts = n * 5, strike = D.ball === 1 && left === 0, spare = D.ball === 2 && left === 0;
        if (strike) {
          pts += 20;
          A().play('bowling_strike'); if (hal) A().play('ghost');
          J().shake(9); J().shockwave(deck, '#ffe066', 220, 560); U().confetti(36);
          say('STRIKE!', '#ffe066');
          res.textContent = '🌟 STRIKE! All 10 pins with one ball! +' + pts;
        } else if (spare) {
          pts += 10;
          A().play('bowling_strike'); J().shake(6); U().confetti(20);
          say('SPARE!', '#2ecc71');
          res.textContent = '✨ SPARE! You got the last ' + n + (n === 1 ? ' pin' : ' pins') + '! +' + pts;
        } else if (n === 0) {
          A().play('slot_low');
          say(ball.gutter ? 'GUTTER!' : 'MISS!', '#ff5d73');
          res.textContent = (ball.gutter ? '🌀 Gutter ball' : '😮 No pins this time') + (D.ball === 1 ? '. Try again with ball 2!' : '.');
        } else {
          A().play(n >= 6 ? 'slot_mid' : 'slot_low'); J().shake(4);
          J().sparks(deck, 10, ['#ffffff', '#ffe066', '#38bdf8'], 6);
          var split = D.ball === 1 && isSplit();
          say(split ? 'SPLIT!' : n + (n === 1 ? ' PIN' : ' PINS'), split ? '#ff9a3c' : (n >= 7 ? '#2ecc71' : '#38bdf8'));
          res.textContent = '🎳 ' + n + (n === 1 ? ' pin' : ' pins') + ' down! +' + pts + (split ? ' (a split: hard spare!)' : '');
        }
        var fr = cardData[eng.state.turn];
        if (D.ball === 1) { fr.push([strike ? 'X' : (n === 0 ? '-' : String(n))]); }
        else { fr[fr.length - 1][1] = spare ? '/' : (n === 0 ? '-' : String(n)); }
        renderCard();
        if (pts > 0) {
          eng.award(eng.state.turn, pts, deck, (strike ? 'STRIKE +' : spare ? 'SPARE +' : '+') + pts);
          U().wobble(document.getElementById('gm-team-' + eng.state.turn));
        }
        await eng.wait(1700);
        if (!eng.state.alive) return;
        if (D.ball === 1 && !strike) {
          sweep();
          D.ball = 2;
          resetBall();
          eng.setPhase('action');
          D.pos = -12; D.posDir = 1;
          setStage('pos');
          return;
        }
        if (eng.advanceRound()) { eng.nextTurn(); showTurn(); }
      }
      function isSplit() { // head pin down and two standing pins with a gap between them
        var up = pins.filter(function (p) { return !p.down; });
        if (pins[0].down !== true || up.length < 2) return false;
        up.sort(function (a, b) { return a.x - b.x; });
        for (var i = 1; i < up.length; i++) if (up[i].x - up[i - 1].x > 13) return true;
        return false;
      }

      /* ---------- loop ---------- */
      eng.raf(function (dt, now) {
        var D = eng.state.data;
        if (eng.state.phase === 'action') {
          if (D.stage === 'pos') {
            D.pos += D.posDir * dt * 20 * LV.s;
            if (D.pos > 14) { D.pos = 14; D.posDir = -1; }
            if (D.pos < -14) { D.pos = -14; D.posDir = 1; }
            ball.x = D.pos;
          } else if (D.stage === 'eff') {
            D.eff += D.effDir * dt * 1.6 * LV.s;
            if (D.eff > 1) { D.eff = 1; D.effDir = -1; }
            if (D.eff < -1) { D.eff = -1; D.effDir = 1; }
          } else if (D.stage === 'power') {
            D.pow += D.powDir * dt * 1.25 * LV.s;
            if (D.pow > 1) { D.pow = 1; D.powDir = -1; }
            if (D.pow < 0) { D.pow = 0; D.powDir = 1; }
          }
        }
        var sdt = (slowEnd > 0 && simT < slowEnd) ? dt * 0.33 : dt, n = Math.max(1, Math.ceil(sdt / (1 / 480)));
        for (var i = 0; i < n; i++) simStep(sdt / n);
        pins.forEach(function (p) {
          if (p.drop > 0) p.drop = Math.max(0, p.drop - dt * 3.2);
          if (p.sweep && !p.gone) { p.alpha -= dt * 2.5; if (p.alpha <= 0) p.gone = true; }
        });

        g.clearRect(0, 0, W, H);
        drawLane(now);
        var things = pins.filter(function (p) { return !p.gone; }).map(function (p) { return { y: p.y, f: function () { drawPin(p); } }; });
        things.push({ y: ball.y + 0.01, f: drawBall });
        things.sort(function (a, b) { return b.y - a.y; }).forEach(function (t) { t.f(); });
        drawGuide(now);
        drawMeter();
        drawEffect();
        drawPop(now);
        return true;
      });

      if (/[?&]test=1/.test(root.location.search)) { root.__bd = eng.state.data; root.__bsim = { pins: pins, ball: ball, step: simStep, rack: rack, LV: LV }; } // local tests only
      eng.setTurn(0, true);
      showTurn();
    }
  };
})(window);
