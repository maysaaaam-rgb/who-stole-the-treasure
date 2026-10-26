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
  /* One canvas lane in perspective: the ball rolls away from the class and the pins tumble with simple physics.
     Lane units: u across (-1..1 is the wood, the gutters go to 1.2), v down the lane (0 = foul line, 1 = pin deck end), z = height. */
  GM.modes.bowling = {
    id: 'bowling', name: 'Pumpkin Bowling', nameClassic: 'Bowling', e: '🎳',
    desc: 'Answer right, then aim the ball at the head pin. Knock down as many ghost pins as you can!',
    descClassic: 'Answer right, then aim the ball at the head pin. Knock down as many pins as you can!',
    fields: [{ key: 'frames', label: 'Frames for each team', opts: [[2, '2'], [3, '3'], [5, '5'], [8, '8']], def: 3 }],
    start: function (ctx) {
      var st = GM.state, hal = st.theme === 'halloween';
      var totalFrames = (+ctx.cfg.frames || 3) * st.teams.length;
      var eng = E().createSession(ctx, {
        maxRounds: totalFrames,
        data: { aim: 0, dirn: 1, aiming: false, dragging: false, dragPointerId: null }
      });
      var rootEl = ctx.root;
      rootEl.innerHTML = '';

      var info = U().h('div', { class: 'gm-info' });
      var lane = U().h('div', { class: 'gm-lane gm-lane3d', title: 'Drag to aim, let go to roll!' });
      var cv = U().h('canvas', { class: 'gm-lane-cv' });
      var g = cv.getContext('2d');
      var deck = U().h('div', { class: 'gm-bowl-deck' }); // where coins and sparks start
      var res = U().h('div', { class: 'gm-bres' });
      lane.appendChild(cv);
      lane.appendChild(deck);
      rootEl.appendChild(U().h('div', { class: 'gm-boardwrap' }, [info, lane, res]));

      var W = 800, H = 480;
      function fit() {
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
        eng.on('end', function () { try { ro.disconnect(); } catch (e) { /* ignore */ } });
      }

      /* ---- perspective: s(v) = 1 / (1 + K v); the far end (v = 1) sits at yt ---- */
      var K = 1.5;
      function geo() {
        var y1 = H * 0.98, yt = H * 0.4;
        return { y1: y1, yh: (yt * (1 + K) - y1) / K, half: Math.min(W * 0.21, H * 0.78), cx: W / 2 };
      }
      function P(u, v, z) {
        var G = geo(), s = 1 / (1 + K * v);
        return { x: G.cx + u * G.half * s, y: G.yh + (G.y1 - G.yh) * s - (z || 0) * G.half * s, k: G.half * s };
      }
      function quad(u0, u1, v0, v1) {
        var a = P(u0, v0), b = P(u1, v0), c = P(u1, v1), d = P(u0, v1);
        g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.lineTo(c.x, c.y); g.lineTo(d.x, d.y); g.closePath();
      }

      var END = 1.04, PIT = 1.13;
      var C = hal
        ? { wall0: '#3b1658', wall1: '#14061f', wood0: '#e7b77b', wood1: '#b9824a', stripe: '#8b3fd1', bulb: '#ff9a3c' }
        : { wall0: '#24407a', wall1: '#0d1733', wood0: '#f7cf93', wood1: '#c98e4f', stripe: '#e23b4a', bulb: '#ffe066' };

      function drawLane(now) {
        var G = geo(), far = P(0, PIT);
        /* back wall and the lit sign over the pins */
        var wg = g.createLinearGradient(0, 0, 0, far.y);
        wg.addColorStop(0, C.wall1); wg.addColorStop(1, C.wall0);
        g.fillStyle = wg; g.fillRect(0, 0, W, far.y + 1);
        var sl = P(-1.5, PIT).x, sr = P(1.5, PIT).x, sy = P(0, PIT, 1.3).y, sh = far.k * 0.12 + 6;
        g.fillStyle = 'rgba(0,0,0,.35)'; rr(sl, sy - sh, sr - sl, sh * 1.6, sh * 0.5); g.fill();
        for (var b = 0; b < 13; b++) {
          var on = (Math.floor(now / 260) + b) % 3 !== 0;
          g.fillStyle = on ? C.bulb : 'rgba(255,255,255,.18)';
          g.beginPath(); g.arc(sl + (b + 0.5) * (sr - sl) / 13, sy - sh * 0.2, Math.max(2, sh * 0.2), 0, 7); g.fill();
        }
        /* alley floor on both sides, with lines running to the back so the room has depth */
        var fl = g.createLinearGradient(0, far.y, 0, H);
        fl.addColorStop(0, C.wall1); fl.addColorStop(1, C.wall0);
        g.fillStyle = fl; g.fillRect(0, far.y, W, H - far.y);
        g.strokeStyle = 'rgba(255,255,255,.07)'; g.lineWidth = 2;
        [1.8, 2.6, 3.8, 5.6, 8.5].forEach(function (u) {
          [-u, u].forEach(function (uu) { var p0 = P(uu, PIT), p1 = P(uu, -0.6); g.beginPath(); g.moveTo(p0.x, p0.y); g.lineTo(p1.x, p1.y); g.stroke(); });
        });
        g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, far.y - 2, W, 4);
        /* low side walls (kickbacks) beside the gutters */
        [[-1.42, -1.22], [1.22, 1.42]].forEach(function (s) {
          quad(s[0], s[1], -0.3, PIT); g.fillStyle = 'rgba(255,255,255,.1)'; g.fill();
          g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 2; g.stroke();
        });
        /* pit behind the deck */
        quad(-1.25, 1.25, END, PIT); g.fillStyle = '#05070f'; g.fill();
        /* gutters */
        [[-1.22, -1], [1, 1.22]].forEach(function (s) {
          quad(s[0], s[1], -0.3, END);
          var gg = g.createLinearGradient(P(s[0], 0).x, 0, P(s[1], 0).x, 0);
          gg.addColorStop(0, '#2b3448'); gg.addColorStop(0.5, '#59647d'); gg.addColorStop(1, '#2b3448');
          g.fillStyle = gg; g.fill();
        });
        /* wood */
        quad(-1, 1, -0.3, END);
        var wd = g.createLinearGradient(0, G.y1, 0, far.y);
        wd.addColorStop(0, C.wood0); wd.addColorStop(1, C.wood1);
        g.fillStyle = wd; g.fill();
        for (var i = 0; i < 20; i++) {
          quad(-1 + i * 0.1, -0.9 + i * 0.1, -0.3, END);
          g.fillStyle = i % 2 ? 'rgba(255,255,255,.07)' : 'rgba(120,60,0,.06)'; g.fill();
          g.strokeStyle = 'rgba(110,60,15,.14)'; g.lineWidth = 1; g.stroke();
        }
        /* polish: a soft shine down the middle */
        quad(-0.45, 0.45, -0.3, END);
        var sh2 = g.createLinearGradient(P(-0.45, 0).x, 0, P(0.45, 0).x, 0);
        sh2.addColorStop(0, 'rgba(255,255,255,0)'); sh2.addColorStop(0.5, 'rgba(255,255,255,.22)'); sh2.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = sh2; g.fill();
        /* pin deck, a little lighter */
        quad(-1, 1, 0.8, END); g.fillStyle = 'rgba(255,240,210,.18)'; g.fill();
        /* aiming arrows and dots */
        g.fillStyle = 'rgba(110,50,10,.38)';
        for (var a = -3; a <= 3; a++) {
          var av = 0.3 + Math.abs(a) * 0.035, t = P(a * 0.24, av + 0.035), l = P(a * 0.24 - 0.045, av), r2 = P(a * 0.24 + 0.045, av);
          g.beginPath(); g.moveTo(t.x, t.y); g.lineTo(l.x, l.y); g.lineTo(r2.x, r2.y); g.closePath(); g.fill();
          var d = P(a * 0.24, 0.08);
          g.beginPath(); g.ellipse(d.x, d.y, d.k * 0.025 + 1, d.k * 0.012 + 1, 0, 0, 7); g.fill();
        }
        /* foul line */
        quad(-1.22, 1.22, -0.004, 0.004); g.fillStyle = '#1f2a44'; g.fill();
      }
      function rr(x, y, w, h, r) {
        g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
        g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
      }

      /* ---- pins ---- */
      var PIN_H = 0.95, pins = [];
      [[0], [-0.29, 0.29], [-0.58, 0, 0.58], [-0.87, -0.29, 0.29, 0.87]].forEach(function (row, r) {
        row.forEach(function (u) { pins.push({ u0: u, v0: 0.84 + r * 0.05, r: r }); });
      });
      function setPin(p, dropFrom) {
        p.u = p.u0; p.v = p.v0; p.z = dropFrom || 0; p.vu = 0; p.vv = 0; p.vz = 0;
        p.tilt = 0; p.vt = 0; p.fly = false; p.hitAt = -1; p.t = 0; p.alpha = 1; p.down = false;
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
        if (p.alpha <= 0) return;
        var base = P(p.u, p.v, p.z), floor = P(p.u, p.v), h = base.k * PIN_H;
        g.save();
        g.globalAlpha = Math.max(0, p.alpha);
        g.fillStyle = 'rgba(40,20,0,.28)';
        g.beginPath(); g.ellipse(floor.x, floor.y, h * 0.17, h * 0.05, 0, 0, 7); g.fill();
        g.translate(base.x, base.y); g.rotate(p.tilt);
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

      /* ---- ball ---- */
      var BALL_R = 0.2, ball = { u: 0, v: 0.03, rot: 0, alpha: 1 };
      function drawBall(now) {
        if (ball.alpha <= 0) return;
        var f = P(ball.u, ball.v), r = f.k * BALL_R, col = (eng.activeTeam() || {}).color || '#ff6f3d';
        var x = f.x, y = f.y - r;
        g.save(); g.globalAlpha = ball.alpha;
        g.fillStyle = 'rgba(30,15,0,.3)';
        g.beginPath(); g.ellipse(x, f.y, r * 0.95, r * 0.25, 0, 0, 7); g.fill();
        g.beginPath(); g.arc(x, y, r, 0, 7); g.fillStyle = col; g.fill();
        var dk = g.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.2, x, y, r);
        dk.addColorStop(0, 'rgba(0,0,0,0)'); dk.addColorStop(0.6, 'rgba(0,0,0,.08)'); dk.addColorStop(1, 'rgba(0,0,0,.5)');
        g.fillStyle = dk; g.fill();
        /* three finger holes roll over the top as the ball moves away */
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

      /* ---- the aim guide, drawn on the lane ---- */
      function startU(aim) { return aim * 0.3; }
      function hitU(aim) { return aim * 0.9; }
      function drawAim(now) {
        var D = eng.state.data;
        if (!(D.aiming && eng.state.phase === 'action')) return;
        var a = P(startU(D.aim), 0.06), b = P(hitU(D.aim), 0.82);
        var sweet = Math.abs(D.aim) < 0.12, col = sweet ? '#2ecc71' : (Math.abs(D.aim) < 0.4 ? '#ffe066' : '#ff5d73');
        g.save();
        g.lineCap = 'round';
        g.strokeStyle = 'rgba(31,42,68,.35)'; g.lineWidth = 12;
        g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
        g.strokeStyle = col; g.lineWidth = 6; g.setLineDash([16, 12]); g.lineDashOffset = -(now * 0.06) % 28;
        g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
        g.setLineDash([]);
        var pulse = 1 + Math.sin(now / 140) * 0.12;
        g.lineWidth = 4; g.strokeStyle = col;
        g.beginPath(); g.ellipse(b.x, b.y, b.k * 0.22 * pulse, b.k * 0.08 * pulse, 0, 0, 7); g.stroke();
        g.restore();
      }

      /* ---- big text pop (STRIKE!) ---- */
      var pop = null;
      function drawPop(now) {
        if (!pop) return;
        var t = (now - pop.t0) / 1000;
        if (t > 1.6) { pop = null; return; }
        var sc = t < 0.25 ? 0.4 + t / 0.25 * 0.8 : (t < 0.4 ? 1.2 - (t - 0.25) / 0.15 * 0.2 : 1);
        g.save();
        g.globalAlpha = t > 1.2 ? Math.max(0, 1 - (t - 1.2) / 0.4) : 1;
        g.translate(W / 2, H * 0.62); g.scale(sc, sc); g.rotate(-0.05);
        g.font = '900 ' + Math.round(Math.min(W * 0.1, H * 0.2)) + 'px Fredoka, "Baloo 2", system-ui, sans-serif';
        g.textAlign = 'center'; g.textBaseline = 'middle';
        g.lineJoin = 'round'; g.lineWidth = Math.min(W, H) * 0.03; g.strokeStyle = '#1f2a44'; g.strokeText(pop.text, 0, 0);
        g.fillStyle = pop.col; g.fillText(pop.text, 0, 0);
        g.restore();
      }

      /* ---- simulation ---- */
      var rollT = -1, rollDur = 1.15, rollMode = '', rollAim = 0, gutterSide = 1, clock = 0;
      function ballAt(t) { // t 0..1 of the roll
        var v = 0.03 + (PIT - 0.03) * (1 - Math.pow(1 - t, 1.35));
        if (rollMode === 'gutter') {
          return { v: v, u: gutterSide * Math.min(1.11, 0.15 + v * 4) };
        }
        return { v: v, u: startU(rollAim) + (hitU(rollAim) - startU(rollAim)) * Math.min(1.25, v / 0.84) };
      }
      function step(dt) {
        clock += dt;
        if (rollT >= 0) {
          rollT = Math.min(1, rollT + dt / rollDur);
          var b = ballAt(rollT);
          ball.u = b.u; ball.v = b.v; ball.rot += dt * 9;
          ball.alpha = ball.v > END ? Math.max(0, 1 - (ball.v - END) / (PIT - END)) : 1;
          pins.forEach(function (p) {
            if (p.down && !p.fly && p.hitAt < 0 && ball.v >= p.v0 - 0.04) {
              p.hitAt = clock + (Math.abs(p.u0 - ball.u) > 0.35 ? 0.1 + Math.random() * 0.18 : 0);
            }
          });
        }
        pins.forEach(function (p) {
          if (p.hitAt >= 0 && !p.fly && clock >= p.hitAt) {
            p.fly = true;
            p.vu = (p.u0 - ball.u) * 2.2 + (Math.random() - 0.5) * 1.2;
            p.vv = 0.35 + Math.random() * 0.5;
            p.vz = 0.7 + Math.random() * 0.8;
            p.vt = (p.vu >= 0 ? 1 : -1) * (5 + Math.random() * 7);
            A().play('pin_hit');
          }
          if (p.fly || p.z > 0 || p.vz !== 0) {
            p.u += p.vu * dt; p.v += p.vv * dt; p.z += p.vz * dt; p.vz -= 5 * dt;
            if (p.z <= 0) {
              p.z = 0; p.vz = Math.abs(p.vz) < 0.4 ? 0 : -p.vz * 0.35;
              p.vu *= 0.6; p.vv *= 0.6;
              if (p.fly) p.vt *= 0.7;
            }
            if (p.fly) {
              p.tilt += p.vt * dt; p.t += dt;
              if (p.t > 0.8 || p.v > END || Math.abs(p.u) > 1.05) p.alpha -= dt * 1.6;
            }
          }
        });
      }

      function resetLane() {
        pins.forEach(function (p) { setPin(p, 0.9 + p.r * 0.12); });
        rollT = -1; rollMode = '';
        ball.u = 0; ball.v = 0.03; ball.rot = 0; ball.alpha = 1;
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
        res.textContent = '';
      }

      async function ask() {
        if (eng.state.phase !== 'idle' || !eng.state.alive) return;
        var r = await eng.ask(null, { label: 'Frame ' + (eng.state.round + 1) });
        if (!eng.state.alive || r.cancelled) return;
        if (!r.ok) {
          eng.setPhase('animating');
          res.textContent = '🌀 Gutter ball! Next team’s frame.';
          gutterSide = Math.random() < 0.5 ? -1 : 1;
          rollMode = 'gutter'; rollT = 0;
          A().play('hunt_empty');
          await eng.wait(1500);
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
        info.appendChild(U().h('b', { text: '🎯 Aim at the head pin: drag on the lane, or press ROLL when the line is green!' }));
        info.appendChild(U().btn('🎳 ROLL!', 'big green', roll));
        var D = eng.state.data;
        D.aim = -0.85; D.dirn = 1; D.dragging = false; D.dragPointerId = null; D.aiming = true;
        eng.setPhase('action');
      }

      function aimFromClientX(clientX) {
        var r = lane.getBoundingClientRect();
        return Math.max(-1, Math.min(1, (clientX - r.left - r.width / 2) / (geo().half * 0.34)));
      }
      eng.listen(lane, 'pointerdown', function (e) {
        var D = eng.state.data;
        if (eng.state.phase !== 'action' || !D.aiming) return;
        e.preventDefault();
        D.dragging = true; D.dragMoved = false; D.dragStartX = e.clientX; D.dragPointerId = e.pointerId;
        try { lane.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      });
      eng.listen(lane, 'pointermove', function (e) {
        var D = eng.state.data;
        if (!D.dragging || e.pointerId !== D.dragPointerId || !D.aiming || eng.state.phase !== 'action') return;
        e.preventDefault();
        if (Math.abs(e.clientX - D.dragStartX) > 5) D.dragMoved = true;
        if (D.dragMoved) D.aim = aimFromClientX(e.clientX);
      });
      function finishDrag(e) {
        var D = eng.state.data;
        if (!D.dragging || (e.pointerId != null && e.pointerId !== D.dragPointerId)) return;
        e.preventDefault();
        if (D.dragMoved) D.aim = aimFromClientX(e.clientX);
        D.dragging = false; D.dragPointerId = null;
        try { lane.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        if (D.aiming && eng.state.phase === 'action') roll();
      }
      eng.listen(lane, 'pointerup', finishDrag);
      eng.listen(lane, 'pointercancel', finishDrag);

      async function roll() {
        var D = eng.state.data;
        if (!D.aiming || eng.state.phase !== 'action' || !eng.state.alive) return;
        D.aiming = false; D.dragging = false;
        eng.setPhase('animating');

        var err = Math.abs(D.aim); // 0 = head pin, 1 = edge of the lane
        var n = err < 0.12 ? 10 : Math.max(1, Math.min(9, Math.round(10 - err * 9)));
        var impact = hitU(D.aim);
        pins.slice().sort(function (a, b) {
          return (Math.abs(a.u0 - impact) + a.r * 0.12) - (Math.abs(b.u0 - impact) + b.r * 0.12);
        }).slice(0, n).forEach(function (p) { p.down = true; });

        rollAim = D.aim; rollMode = 'roll'; rollT = 0;
        var tb = eng.activeTeam();
        info.innerHTML = '';
        info.appendChild(U().monFace(tb.mon, 46));
        info.appendChild(U().h('b', { text: tb.name + ' is rolling... 🎳' }));
        A().play('bowling_roll');
        await eng.wait(rollDur * 1000 + 450);
        if (!eng.state.alive) return;

        var strike = (n === 10), pts = n * 5 + (strike ? 20 : 0);
        if (strike) {
          A().play('bowling_strike');
          if (hal) A().play('ghost');
          J().shake(9);
          J().shockwave(deck, '#ffe066', 220, 560);
          U().confetti(32);
          pop = { text: 'STRIKE!', col: '#ffe066', t0: performance.now() };
          res.textContent = '🌟 STRIKE! All 10 pins! +' + pts;
        } else {
          A().play(n >= 6 ? 'slot_mid' : 'slot_low');
          J().shake(4);
          J().sparks(deck, 10, ['#ffffff', '#ffe066', '#38bdf8'], 6);
          pop = { text: n + (n === 1 ? ' PIN!' : ' PINS!'), col: n >= 7 ? '#2ecc71' : '#38bdf8', t0: performance.now() };
          res.textContent = '🎳 ' + n + (n === 1 ? ' pin' : ' pins') + ' knocked down! +' + pts;
        }
        eng.award(eng.state.turn, pts, deck, (strike ? 'STRIKE +' : '+') + pts);
        U().wobble(document.getElementById('gm-team-' + eng.state.turn));

        await eng.wait(1700);
        if (!eng.state.alive) return;
        resetLane();
        if (eng.advanceRound()) {
          eng.nextTurn();
          showTurn();
        }
      }

      eng.raf(function (dt, now) {
        var D = eng.state.data;
        if (D.aiming && eng.state.phase === 'action' && !D.dragging) {
          D.aim += D.dirn * dt * 1.25;
          if (D.aim >= 1) { D.aim = 1; D.dirn = -1; }
          if (D.aim <= -1) { D.aim = -1; D.dirn = 1; }
        }
        if (D.aiming && eng.state.phase === 'action') { ball.u = startU(D.aim); }
        step(dt);
        g.clearRect(0, 0, W, H);
        drawLane(now);
        drawAim(now);
        /* far things first, so near pins and the ball cover them */
        pins.slice().sort(function (a, b) { return b.v - a.v; }).forEach(function (p) {
          if (p.v >= ball.v) drawPin(p);
        });
        drawBall(now);
        pins.slice().sort(function (a, b) { return b.v - a.v; }).forEach(function (p) {
          if (p.v < ball.v) drawPin(p);
        });
        drawPop(now);
        return true;
      });

      eng.setTurn(0, true);
      resetLane();
      showTurn();
    }
  };
})(window);
