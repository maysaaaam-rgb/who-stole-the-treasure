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
  GM.modes.bowling = {
    id: 'bowling', name: 'Pumpkin Bowling', nameClassic: 'Bowling', e: '🎳',
    desc: 'Answer right, then stop the aim bar in the middle. Knock down as many ghost pins as you can!',
    descClassic: 'Answer right, then stop the aim bar in the middle. Knock down as many pins as you can!',
    fields: [{ key: 'frames', label: 'Frames for each team', opts: [[2, '2'], [3, '3'], [5, '5'], [8, '8']], def: 3 }],
    start: function (ctx) {
      var st = GM.state, hal = st.theme === 'halloween';
      var totalFrames = (+ctx.cfg.frames || 3) * st.teams.length;
      var eng = E().createSession(ctx, {
        maxRounds: totalFrames,
        data: { pos: 0.5, targetPos: 0.5, dirn: 1, aiming: false, dragging: false, dragPointerId: null }
      });
      var rootEl = ctx.root;
      rootEl.innerHTML = '';

      var info = U().h('div', { class: 'gm-info' });
      var lane = U().h('div', { class: 'gm-lane', style: 'cursor:pointer;', title: 'Drag to aim or tap to roll!' });
      var laneCv = U().h('canvas', { class: 'gm-lane-cv', width: 800, height: 480, style: 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;' });
      var laneCtx = laneCv.getContext('2d');
      var pinsEl = U().h('div', { class: 'gm-pins', style: 'z-index:2;' });
      var ball = U().h('div', { class: 'gm-ball', style: 'z-index:3;' });
      var aim = U().h('div', { class: 'gm-aim', style: 'cursor:ew-resize;' }, [U().h('i')]);
      var res = U().h('div', { class: 'gm-bres' });
      lane.appendChild(laneCv);
      lane.appendChild(pinsEl);
      lane.appendChild(ball);
      var wrap = U().h('div', { class: 'gm-boardwrap' }, [info, lane, aim, res]);
      rootEl.appendChild(wrap);

      function syncLaneCanvasSize() {
        var r = lane.getBoundingClientRect();
        if (r.width > 40 && r.height > 40) {
          var w = Math.round(r.width), h = Math.round(r.height);
          if (laneCv.width !== w || laneCv.height !== h) {
            laneCv.width = w;
            laneCv.height = h;
          }
        }
      }
      syncLaneCanvasSize();
      eng.listen(root, 'resize', syncLaneCanvasSize);
      if (root.ResizeObserver) {
        var ro = new root.ResizeObserver(syncLaneCanvasSize);
        ro.observe(lane);
        eng.on('end', function () { try { ro.disconnect(); } catch (e) { /* ignore */ } });
      }

      /* Build 10-pin triangle with normalized lane coordinates for physics collision */
      var rows = [4, 3, 2, 1], pins = [];
      rows.forEach(function (n, r) {
        for (var i = 0; i < n; i++) {
          var colIndex = (4 - n) + i * 2; // 0..7
          var normX = 32 + (colIndex / 6) * 36; // 32% .. 68% across lane
          var normY = 10 + r * 9;               // 10% .. 37% from top
          var p = U().h('div', { class: 'gm-pin', text: hal ? '👻' : '🎳' });
          p.style.gridColumn = String(1 + colIndex) + ' / span 2';
          p.style.gridRow = String(r + 1);
          pinsEl.appendChild(p);
          pins.push({ el: p, r: r, i: i, x: normX, y: normY, down: false });
        }
      });

      var mark = aim.firstChild;

      function resetLane() {
        pins.forEach(function (p) {
          p.down = false;
          p.el.classList.remove('down');
          p.el.style.transform = '';
        });
        ball.style.transition = 'none';
        ball.style.left = '50%';
        ball.style.bottom = '-8%';
        ball.style.transform = 'translateX(-50%) scale(1)';
        void ball.offsetWidth;
      }

      function showTurn() {
        var t = eng.activeTeam();
        eng.state.data.aiming = false;
        eng.setPhase('idle');
        info.innerHTML = '';
        info.style.setProperty('--c', t.color);
        info.appendChild(U().monFace(t.mon, 46));
        info.appendChild(U().h('b', {
          text: t.name + ': answer to bowl! (frame ' + (eng.state.round + 1) + ' of ' + eng.state.maxRounds + ')'
        }));
        info.appendChild(U().btn('❓ Ask me', 'big amber', ask));
        aim.style.visibility = 'hidden';
        res.textContent = '';
      }

      async function ask() {
        if (eng.state.phase !== 'idle' || !eng.state.alive) return;
        var r = await eng.ask(null, { label: 'Frame ' + (eng.state.round + 1) });
        if (!eng.state.alive || r.cancelled) return;
        if (!r.ok) {
          eng.setPhase('animating');
          res.textContent = '🌀 Gutter roll! Next team\u2019s frame.';
          ball.style.transition = 'left .65s ease-in, bottom .85s ease-in, transform .85s';
          ball.style.left = '8%';
          ball.style.bottom = '88%';
          ball.style.transform = 'translateX(-50%) scale(0.72) rotate(-360deg)';
          A().play('hunt_empty');
          await eng.wait(1300);
          if (!eng.state.alive) return;
          resetLane();
          if (eng.advanceRound()) {
            eng.nextTurn();
            showTurn();
          }
          return;
        }
        var t = eng.activeTeam();
        info.innerHTML = '';
        info.style.setProperty('--c', t.color);
        info.appendChild(U().monFace(t.mon, 46));
        info.appendChild(U().h('b', { text: '🎯 Drag on the lane to aim & release — or tap ROLL in the green middle!' }));
        info.appendChild(U().btn('🎳 ROLL!', 'big green', roll));
        aim.style.visibility = 'visible';
        eng.state.data.pos = 0.15;
        eng.state.data.targetPos = 0.15;
        eng.state.data.dirn = 1;
        eng.state.data.dragging = false;
        eng.state.data.dragPointerId = null;
        eng.state.data.aiming = true;
        eng.setPhase('action');
      }

      function posFromClientX(clientX, refEl) {
        var r = refEl.getBoundingClientRect();
        if (!r || r.width <= 0) return 0.5;
        return Math.max(0.02, Math.min(0.98, (clientX - r.left) / r.width));
      }

      function bindAimSurface(surfaceEl) {
        eng.listen(surfaceEl, 'pointerdown', function (e) {
          var D = eng.state.data;
          if (eng.state.phase !== 'action' || !D.aiming) return;
          e.preventDefault();
          D.dragging = true;
          D.dragMoved = false;
          D.dragStartX = e.clientX;
          D.dragPointerId = e.pointerId;
          try { surfaceEl.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
          if (surfaceEl === aim) {
            D.targetPos = posFromClientX(e.clientX, surfaceEl);
            D.pos = D.targetPos;
            mark.style.left = (D.pos * 100) + '%';
          }
        });
        eng.listen(surfaceEl, 'pointermove', function (e) {
          var D = eng.state.data;
          if (!D.dragging || e.pointerId !== D.dragPointerId || !D.aiming || eng.state.phase !== 'action') return;
          e.preventDefault();
          if (Math.abs(e.clientX - D.dragStartX) > 5 || surfaceEl === aim) D.dragMoved = true;
          if (D.dragMoved) {
            D.targetPos = posFromClientX(e.clientX, surfaceEl);
            D.pos = D.targetPos;
            mark.style.left = (D.pos * 100) + '%';
          }
        });
        function finishDrag(e) {
          var D = eng.state.data;
          if (!D.dragging || (e.pointerId != null && e.pointerId !== D.dragPointerId)) return;
          e.preventDefault();
          if (D.dragMoved) {
            D.targetPos = posFromClientX(e.clientX, surfaceEl);
            D.pos = D.targetPos;
            mark.style.left = (D.pos * 100) + '%';
          }
          D.dragging = false;
          D.dragPointerId = null;
          try { surfaceEl.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
          if (D.aiming && eng.state.phase === 'action') roll();
        }
        eng.listen(surfaceEl, 'pointerup', finishDrag);
        eng.listen(surfaceEl, 'pointercancel', finishDrag);
      }
      bindAimSurface(lane);
      bindAimSurface(aim);

      async function roll() {
        var D = eng.state.data;
        if (!D.aiming || eng.state.phase !== 'action' || !eng.state.alive) return;
        D.aiming = false;
        D.dragging = false;
        eng.setPhase('animating');
        J().squash(aim, 1.06, 0.85, 220);

        var err = Math.abs(D.pos - 0.5) * 2; // 0 = dead center, 1 = far edge
        var targetX = 50 + (D.pos - 0.5) * 40;
        var maxKnocked = err < 0.16 ? 10 : Math.max(1, Math.min(9, Math.round(10 - err * 8.5)));

        A().play('bowling_roll');
        ball.style.transition = 'left .72s cubic-bezier(.2,.6,.35,1), bottom .72s ease-in, transform .72s ease-in';
        ball.style.left = targetX + '%';
        ball.style.bottom = '76%';
        ball.style.transform = 'translateX(-50%) scale(0.76) rotate(540deg)';
        await eng.wait(680);
        if (!eng.state.alive) return;

        /* Sort pins by proximity to ball impact line targetX so realistic pins scatter first! */
        var sorted = pins.slice().sort(function (a, b) {
          return (Math.abs(a.x - targetX) - rWeight(a)) - (Math.abs(b.x - targetX) - rWeight(b));
        });
        function rWeight(p) { return (3 - p.r) * 2.5; } // front pin hit first

        var knocked = sorted.slice(0, maxKnocked);
        for (var i = 0; i < knocked.length; i++) {
          (function (pin, delayIdx) {
            eng.timeout(function () {
              pin.down = true;
              pin.el.classList.add('down');
              var scatterX = (pin.x - targetX) * 3.2 + (Math.random() - 0.5) * 60;
              var scatterY = -35 - Math.random() * 45;
              var rot = (scatterX >= 0 ? 1 : -1) * (65 + Math.random() * 75);
              pin.el.style.transform = 'translate(' + Math.round(scatterX) + 'px, ' + Math.round(scatterY) + 'px) rotate(' + Math.round(rot) + 'deg) scale(0.68)';
              A().play('pin_hit');
              J().sparks(pin.el, 6, ['#ffffff', '#ffe066', '#38bdf8'], 5);
            }, delayIdx * 48);
          })(knocked[i], i);
        }

        await eng.wait(knocked.length * 48 + 140);
        if (!eng.state.alive) return;

        var n = knocked.length, strike = (n === 10), pts = n * 5 + (strike ? 20 : 0);
        if (strike) {
          A().play('bowling_strike');
          if (hal) A().play('ghost');
          J().shake(9);
          J().shockwave(pinsEl, '#ffe066', 220, 560);
          U().confetti(32);
          res.textContent = '🌟 STRIKE! All 10 pins! +' + pts;
        } else {
          A().play(n >= 6 ? 'slot_mid' : 'slot_low');
          J().shake(4);
          res.textContent = '🎳 ' + n + (n === 1 ? ' pin' : ' pins') + ' knocked down! +' + pts;
        }
        eng.award(eng.state.turn, pts, pinsEl, (strike ? 'STRIKE +' : '+') + pts);
        U().wobble(document.getElementById('gm-team-' + eng.state.turn));

        await eng.wait(1650);
        if (!eng.state.alive) return;
        resetLane();
        if (eng.advanceRound()) {
          eng.nextTurn();
          showTurn();
        }
      }

      /* 60fps aim bar & lane trajectory guide loop */
      eng.raf(function (dt, now) {
        var D = eng.state.data;
        var W = laneCv.width, H = laneCv.height;
        laneCtx.clearRect(0, 0, W, H);

        /* Draw lane arrows */
        laneCtx.save();
        laneCtx.fillStyle = 'rgba(120, 60, 0, 0.22)';
        for (var a = -2; a <= 2; a++) {
          var ax = W * (0.5 + a * 0.08), ay = H * 0.68 + Math.abs(a) * 18;
          laneCtx.beginPath();
          laneCtx.moveTo(ax, ay - 14);
          laneCtx.lineTo(ax - 8, ay + 8);
          laneCtx.lineTo(ax + 8, ay + 8);
          laneCtx.closePath();
          laneCtx.fill();
        }
        laneCtx.restore();

        if (D.aiming && eng.state.phase === 'action') {
          if (!D.dragging) {
            D.pos += D.dirn * dt * 1.05;
            if (D.pos >= 1) { D.pos = 1; D.dirn = -1; }
            if (D.pos <= 0) { D.pos = 0; D.dirn = 1; }
            D.targetPos = D.pos;
          } else {
            D.pos += (D.targetPos - D.pos) * Math.min(1, dt * 36);
          }
          mark.style.left = (D.pos * 100) + '%';

          /* Draw live aim guide line & target reticle on lane canvas */
          var sx = W * 0.5, sy = H * 0.92;
          var tx = W * (0.5 + (D.pos - 0.5) * 0.4), ty = H * 0.22;
          var inSweetSpot = Math.abs(D.pos - 0.5) < 0.08;
          var guideColor = inSweetSpot ? '#2ecc71' : (Math.abs(D.pos - 0.5) < 0.22 ? '#ffe066' : '#ff5d73');
          laneCtx.save();
          laneCtx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          laneCtx.lineWidth = inSweetSpot ? 12 : 9;
          laneCtx.lineCap = 'round';
          laneCtx.beginPath();
          laneCtx.moveTo(sx, sy);
          laneCtx.lineTo(tx, ty);
          laneCtx.stroke();

          laneCtx.strokeStyle = guideColor;
          laneCtx.lineWidth = inSweetSpot ? 6 : 4.5;
          laneCtx.setLineDash([14, 10]);
          laneCtx.lineDashOffset = -(now * 0.045) % 24;
          laneCtx.beginPath();
          laneCtx.moveTo(sx, sy);
          laneCtx.lineTo(tx, ty);
          laneCtx.stroke();

          laneCtx.setLineDash([]);
          laneCtx.fillStyle = guideColor;
          laneCtx.beginPath();
          laneCtx.arc(tx, ty, inSweetSpot ? 9 : 7, 0, Math.PI * 2);
          laneCtx.fill();
          laneCtx.strokeStyle = '#1f2a44';
          laneCtx.lineWidth = 2.5;
          laneCtx.stroke();
          laneCtx.restore();
        }
        return true;
      });

      eng.setTurn(0, true);
      resetLane();
      showTurn();
    }
  };
})(window);
