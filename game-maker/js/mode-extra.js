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
        A().play('line_win'); A().play('sparkle'); A().play('crowd_cheer_small'); A().play('coin_collect');
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
        A().play('coin_collect');
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
              var b = U().h('button', { type: 'button', class: 'gm-sq', 'aria-label': 'Square ' + (k + 1) }, [U().h('span', { class: 'gm-sq-num', text: String(k + 1) })]);
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
          b.innerHTML = '';
          b.appendChild(mk);
          b.classList.add('mine');
          b.style.setProperty('--c', team.color);
          A().play('tap'); A().play('wood_knock');
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
          A().play('disc_drop'); A().play('whoosh_soft');
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
          A().play('disc_bounce'); A().play('wood_knock');
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

  /* ================= Pass the Bomb / Pumpkin (Hot Potato — Wave 4 Real Game Rebuild) ================= */
  var PASS_ART = {
    bg_hal: 'art/bg_pumpkin_patch.webp',
    bg_classic: 'art/bg_classic_balloon.webp',
    pumpkin: 'art/c_pumpkin.webp',
    bomb: 'art/pu_boom.webp',
    cauldron: 'art/o_cauldron.webp',
    star_coin: 'art/o_star_coin.webp',
    lantern: 'art/o_candle_lantern.webp',
    ghost: 'art/c_ghost.webp',
    bat: 'art/c_bat.webp'
  };
  var PASS_IMG_CACHE = {};
  var PASS_MON_CACHE = {};

  function passGetImg(key) {
    if (PASS_IMG_CACHE[key]) return PASS_IMG_CACHE[key];
    var url = PASS_ART[key];
    if (!url) return null;
    var im = new Image();
    im.decoding = 'async';
    im.src = url;
    PASS_IMG_CACHE[key] = im;
    return im;
  }

  function passImgReady(im) {
    return !!(im && im.complete && im.naturalWidth > 0);
  }

  function passMonImg(monObj) {
    var key = typeof monObj === 'string' ? monObj : (monObj && (monObj.id || monObj.name) ? (monObj.id || monObj.name) : JSON.stringify(monObj || 'm01'));
    if (PASS_MON_CACHE[key]) return PASS_MON_CACHE[key];
    if (!GM || !GM.mon || typeof GM.mon.svg !== 'function') return null;
    var svg = GM.mon.svg(monObj, 220);
    if (!svg || svg.indexOf('<svg') < 0) return null;
    if (svg.indexOf('xmlns=') < 0) {
      svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    var im = new Image();
    im.decoding = 'async';
    im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    PASS_MON_CACHE[key] = im;
    return im;
  }

  function passRoundRect(g, x, y, w, h, r) {
    var rr = Math.min(r, w * 0.5, h * 0.5);
    g.beginPath();
    g.moveTo(x + rr, y);
    g.arcTo(x + w, y, x + w, y + h, rr);
    g.arcTo(x + w, y + h, x, y + h, rr);
    g.arcTo(x, y + h, x, y, rr);
    g.arcTo(x, y, x + w, y, rr);
    g.closePath();
  }

  function passOutlinedText(g, text, x, y, size, fill, stroke) {
    g.save();
    g.font = '900 ' + size + 'px "Fredoka", "Nunito", sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.lineJoin = 'round';
    g.lineWidth = Math.max(4, Math.round(size * 0.2));
    g.strokeStyle = stroke || '#0f172a';
    g.strokeText(text, x, y);
    g.fillStyle = fill || '#ffffff';
    g.fillText(text, x, y);
    g.restore();
  }

  GM.modes.pass = {
    id: 'pass',
    name: 'Pass the Pumpkin',
    nameClassic: 'Pass the Bomb',
    e: '🥔',
    desc: 'A ticking pumpkin passes from monster to monster! Answer right (+5) to toss it on. When it pops, every other team wins +10 Safe bonus points!',
    descClassic: 'A ticking party bomb passes from monster to monster! Answer right (+5) to toss it on. When it pops, every other team wins +10 Safe bonus points!',
    fields: [
      { k: 'rounds', key: 'rounds', l: 'Rounds', label: 'Rounds', type: 'select', opts: [[3, '3 rounds'], [5, '5 rounds'], [8, '8 rounds']], def: 5, default: 5 }
    ],

    start: function (ctx) {
      var k;
      for (k in PASS_ART) {
        if (Object.prototype.hasOwnProperty.call(PASS_ART, k)) passGetImg(k);
      }

      var T = (GM.state && GM.state.teams && GM.state.teams.length) ? GM.state.teams : [
        { name: 'Team 1', color: '#38bdf8', mon: 'm01', score: 0 },
        { name: 'Team 2', color: '#f59e0b', mon: 'm02', score: 0 }
      ];
      var nt = T.length;
      var ti;
      for (ti = 0; ti < nt; ti++) {
        passMonImg(T[ti].mon);
      }

      var maxRounds = +(ctx.cfg && ctx.cfg.rounds) || 5;
      var round = 0;
      var holder = 0;
      var fuseMax = 11;
      var fuseLeft = 11;
      var tickAcc = 0;
      var phase = 'action'; // 'action' | 'question' | 'passing' | 'round_end' | 'finale'
      var ended = false;
      var passArc = null; // { fromIdx, toIdx, t, dur }
      var poses = []; // per-team pose: 'idle' | 'holding' | 'throw' | 'catch' | 'shrug' | 'popped' | 'celebrate'
      var bubbles = [];
      var particles = [];
      var shakeMag = 0;
      var slowMoT = 0;
      var shockwave = null;
      var timers = [];
      var activeOrbs = [];

      for (ti = 0; ti < nt; ti++) {
        poses.push(ti === 0 ? 'holding' : 'idle');
        bubbles.push('');
      }

      function isHal() {
        return (GM && GM.state && GM.state.theme === 'halloween') ||
               (document.body && document.body.classList.contains('gm-theme-halloween'));
      }

      function thingName() {
        return isHal() ? 'pumpkin' : 'bomb';
      }

      function setTimeoutSafe(fn, ms) {
        var id = setTimeout(function () {
          if (ended) return;
          fn();
        }, ms);
        timers.push(id);
        return id;
      }

      function clearOrbs() {
        var oi;
        for (oi = 0; oi < activeOrbs.length; oi++) {
          if (activeOrbs[oi] && activeOrbs[oi].parentNode) {
            activeOrbs[oi].parentNode.removeChild(activeOrbs[oi]);
          }
        }
        activeOrbs = [];
      }

      function clearPodUrgency() {
        var i;
        for (i = 0; i < nt; i++) {
          var pod = document.getElementById('gm-team-' + i);
          if (pod) {
            pod.classList.remove('gm-pod-urgent');
            pod.style.removeProperty('--urg');
            pod.style.removeProperty('--hb-scale');
          }
        }
      }

      // 1. Build Full-Screen Scene + Canvas + Banner + Dock
      ctx.root.innerHTML = '';
      var scene = U().h('div', { class: 'gm-real3-scene gm-pass-scene' });
      var cv = U().h('canvas', { class: 'gm-real3-cv' });
      scene.appendChild(cv);

      var banner = U().h('div', { class: 'gm-real3-banner in' });
      scene.appendChild(banner);

      var dock = U().h('div', { class: 'gm-real3-dock' });
      var askBtn = U().h('button', {
        class: 'gm-real3-btn amber pulse',
        type: 'button',
        onclick: function () { askToPass(); }
      }, ['❓ Answer & Pass! (Space)']);
      dock.appendChild(askBtn);
      scene.appendChild(dock);

      ctx.root.appendChild(scene);

      // 2. Canvas Sizing & Seat Coordinates Around the Stage Circle
      var W = 1366;
      var H = 768;
      var dpr = 1;
      var g = cv.getContext('2d');

      function resizeCanvas() {
        var r = scene.getBoundingClientRect();
        W = Math.max(640, r.width || window.innerWidth || 1366);
        H = Math.max(420, r.height || window.innerHeight || 768);
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        cv.width = Math.round(W * dpr);
        cv.height = Math.round(H * dpr);
      }
      resizeCanvas();

      var ro = null;
      if (window.ResizeObserver) {
        ro = new ResizeObserver(function () { resizeCanvas(); });
        ro.observe(scene);
      }
      window.addEventListener('resize', resizeCanvas);

      function getSeatPos(idx) {
        // Carefully positioned around the center cauldron/clock so no monster is ever covered by top banner or bottom dock
        if (nt === 2) {
          return idx === 0
            ? { x: W * 0.21, y: H * 0.62 }
            : { x: W * 0.79, y: H * 0.62 };
        }
        if (nt === 3) {
          if (idx === 0) return { x: W * 0.18, y: H * 0.65 };
          if (idx === 1) return { x: W * 0.50, y: H * 0.38 };
          return { x: W * 0.82, y: H * 0.65 };
        }
        // 4+ teams: 3D stadium ring (back pair narrower, front pair wider so zero vertical overlap)
        if (idx === 0) return { x: W * 0.30, y: H * 0.42 };
        if (idx === 1) return { x: W * 0.70, y: H * 0.42 };
        if (idx === 2) return { x: W * 0.86, y: H * 0.68 };
        return { x: W * 0.14, y: H * 0.68 };
      }

      function getBombPosForSeat(idx) {
        var sp = getSeatPos(idx);
        var cx = W * 0.50;
        var cy = H * 0.54;
        // Held slightly toward the center of the circle in the monster's hands
        return {
          x: sp.x + (cx - sp.x) * 0.32,
          y: sp.y - Math.min(190, H * 0.24) * 0.38 + (cy - sp.y) * 0.12
        };
      }

      // 3. Flying Score Orb + World Float Text
      function spawnWorldFloat(x, y, text, kind) {
        var anchor = U().h('div', {
          style: 'position:fixed;left:' + Math.round(x) + 'px;top:' + Math.round(y) + 'px;width:4px;height:4px;pointer-events:none;z-index:40;'
        });
        document.body.appendChild(anchor);
        U().floatText(text, anchor, kind || 'good');
        setTimeout(function () {
          if (anchor.parentNode) anchor.parentNode.removeChild(anchor);
        }, 1200);
      }

      function flyScoreToPod(startPt, teamIdx, label, pts) {
        U().addScore(teamIdx, pts);
        if (A()) A().play('coin_collect');

        var sx = startPt ? startPt.x : W * 0.5;
        var sy = startPt ? startPt.y : H * 0.5;
        var orb = U().h('div', {
          class: 'gm-score-orb',
          text: label,
          style: 'left:' + Math.round(sx) + 'px;top:' + Math.round(sy) + 'px;'
        });
        document.body.appendChild(orb);
        activeOrbs.push(orb);

        var pods = document.querySelectorAll('.gm-teams .gm-pod');
        var pod = pods && pods[teamIdx] ? pods[teamIdx] : document.getElementById('gm-team-' + teamIdx);
        var tx = sx;
        var ty = H - 50;
        if (pod && pod.getBoundingClientRect) {
          var pr = pod.getBoundingClientRect();
          tx = pr.left + pr.width * 0.5;
          ty = pr.top + pr.height * 0.5;
        }

        requestAnimationFrame(function () {
          orb.style.left = Math.round(tx) + 'px';
          orb.style.top = Math.round(ty) + 'px';
          orb.style.transform = 'translate(-50%, -50%) scale(0.75)';
          orb.style.opacity = '0.2';
        });

        setTimeout(function () {
          if (orb.parentNode) orb.parentNode.removeChild(orb);
        }, 580);
      }

      function spawnBurst(x, y, count, palette) {
        var cols = palette || ['#fde047', '#fb923c', '#38bdf8', '#34d399', '#fb7185', '#ffffff'];
        var n = count || 24;
        var i;
        for (i = 0; i < n; i++) {
          var ang = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.4;
          var spd = 90 + Math.random() * 260;
          particles.push({
            x: x,
            y: y,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd - 70,
            r: 5 + Math.random() * 6,
            color: cols[i % cols.length],
            life: 0.7 + Math.random() * 0.45,
            maxLife: 1.1,
            gravity: 320
          });
        }
      }

      // 4. HUD & Round Setup
      function renderBanner(customMsg, subText) {
        var t = T[holder] || T[0];
        banner.style.setProperty('--c', t.color || '#f59e0b');
        banner.innerHTML = '';
        banner.appendChild(U().monFace(t.mon, 42));
        banner.appendChild(U().h('b', {
          text: customMsg || (t.name + ' holds the ' + thingName() + '! Answer fast to pass it!')
        }));
        banner.appendChild(U().h('span', {
          class: 'gm-real3-sub',
          text: subText || ('Round ' + (round + 1) + ' / ' + maxRounds)
        }));
        banner.classList.add('in');

        if (askBtn) {
          if (phase === 'action') {
            askBtn.style.display = '';
            askBtn.textContent = (isHal() ? '🎃 ' : '💣 ') + 'Answer & Pass! (Space)';
            askBtn.className = 'gm-real3-btn amber pulse';
          } else {
            askBtn.style.display = 'none';
          }
        }
        U().teamBar(T, holder);
      }

      function startRound() {
        if (ended) return;
        fuseMax = 10 + nt * 1.5;
        fuseLeft = fuseMax;
        tickAcc = 0;
        passArc = null;
        shockwave = null;
        phase = 'action';
        clearPodUrgency();

        var i;
        for (i = 0; i < nt; i++) {
          poses[i] = (i === holder) ? 'holding' : 'idle';
          bubbles[i] = (i === holder) ? 'Hot! Pass it! 🔥' : 'Not me! 😅';
        }
        renderBanner();
      }

      // 5. Pop / Boom Payoff (When Fuse Reaches 0)
      function popBomb() {
        if (ended || phase === 'round_end' || phase === 'finale') return;
        phase = 'round_end';
        clearPodUrgency();

        var bPos = getBombPosForSeat(holder);
        var holderSeat = getSeatPos(holder);
        slowMoT = 0.42;
        shakeMag = 6;
        shockwave = { x: bPos.x, y: bPos.y, r: 16, maxR: 290, alpha: 1.0 };

        spawnBurst(bPos.x, bPos.y, 65, ['#ff5d73', '#fde047', '#fb923c', '#34d399', '#38bdf8', '#ffffff']);
        U().confetti(32);

        if (A()) {
          A().play('bomb_boom');
          A().play('haystack_poof');
          A().play('crowd_roar_big');
        }

        var i;
        var safeTeams = [];
        for (i = 0; i < nt; i++) {
          if (i === holder) {
            poses[i] = 'popped';
            bubbles[i] = 'KABOOM! 😵‍💫';
          } else {
            poses[i] = 'celebrate';
            bubbles[i] = 'SAFE! +10! 🎉';
            safeTeams.push(i);
          }
        }

        spawnWorldFloat(holderSeat.x, holderSeat.y - 120, '💥 BOOM!', 'bad');

        if (safeTeams.length) {
          renderBanner('💥 BOOM on ' + T[holder].name + '! Every other team wins +10 Safe bonus!', 'Round ' + (round + 1) + ' / ' + maxRounds);
          var si;
          for (si = 0; si < safeTeams.length; si++) {
            var sIdx = safeTeams[si];
            var sp = getSeatPos(sIdx);
            spawnWorldFloat(sp.x, sp.y - 120, '+10 Safe!', 'good');
            flyScoreToPod(sp, sIdx, '+10', 10);
          }
        } else {
          renderBanner('💥 Time is up! Next round!');
        }

        setTimeoutSafe(function () {
          round++;
          if (round >= maxRounds) {
            phase = 'finale';
            ended = true;
            clearPodUrgency();
            if (A()) {
              A().play('victory_fanfare');
              A().play('cheer_kids');
            }
            setTimeout(function () { ctx.end(); }, 750);
          } else {
            holder = (holder + 1) % nt;
            startRound();
          }
        }, 2100);
      }

      // Expose helper for instant round pop in automated verification if needed
      window.__gmPassForcePop = function () {
        if (!ended && phase === 'action') {
          fuseLeft = 0.02;
        }
      };

      // 6. Ask Question & Toss the Pumpkin / Bomb Along a 3D Parabolic Arc
      function askToPass() {
        if (ended || phase !== 'action') return;
        phase = 'question';
        renderBanner(T[holder].name + ' is answering to pass the ' + thingName() + '...');

        var item = ctx.nextItem();
        U().ask(item, {
          team: T[holder],
          timer: Math.min(+(ctx.cfg && ctx.cfg.timer) || 0, 15) || 0,
          label: 'Pass the ' + thingName() + '!'
        }).then(function (ok) {
          if (ended || phase === 'round_end' || phase === 'finale') return;

          if (ok) {
            var fromIdx = holder;
            var toIdx = (holder + 1) % nt;
            var fromSeat = getSeatPos(fromIdx);

            // Award +5 for passing!
            spawnWorldFloat(fromSeat.x, fromSeat.y - 130, '+5 Pass!', 'good');
            flyScoreToPod(fromSeat, fromIdx, '+5', 5);

            // Small fuse boost so rallies feel exciting
            fuseLeft = Math.min(fuseMax, fuseLeft + 2.0);

            poses[fromIdx] = 'throw';
            bubbles[fromIdx] = 'Catch this! 💨';
            poses[toIdx] = 'catch';
            bubbles[toIdx] = 'Whoa! 😮';

            if (A()) {
              A().play('bomb_pass');
              A().play('whoosh_soft');
              A().play('crowd_ooh');
              if (isHal()) A().play('witch');
            }

            phase = 'passing';
            passArc = {
              fromIdx: fromIdx,
              toIdx: toIdx,
              t: 0,
              dur: 0.52
            };
            renderBanner(T[fromIdx].name + ' tosses the ' + thingName() + ' to ' + T[toIdx].name + '! (+5)');
          } else {
            // Wrong answer: 0 points lost, gentle shrug, keep at least 3.5s on fuse so they get another fair try
            fuseLeft = Math.max(fuseLeft, 3.5);
            poses[holder] = 'shrug';
            bubbles[holder] = 'Good try! Try again! 😊';
            if (A()) A().play('crowd_aww_soft');
            renderBanner('Good try! ' + T[holder].name + ' still holds the ' + thingName() + ' — try again!');

            setTimeoutSafe(function () {
              if (phase === 'round_end' || phase === 'finale') return;
              poses[holder] = 'holding';
              bubbles[holder] = 'Hot! Pass it! 🔥';
              phase = 'action';
              renderBanner();
            }, 720);
          }
        });
      }

      // Tap canvas or press Space to answer & pass
      cv.addEventListener('pointerdown', function (e) {
        if (ended || phase !== 'action') return;
        e.preventDefault();
        askToPass();
      });

      function onKeyDown(e) {
        if (ended) return;
        if (e.code === 'Space' || e.key === ' ') {
          var tag = e.target && e.target.tagName ? e.target.tagName.toUpperCase() : '';
          if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
          if (document.querySelector('.gm-over')) return;
          if (phase === 'action') {
            e.preventDefault();
            askToPass();
          }
        }
      }
      window.addEventListener('keydown', onKeyDown);

      // 7. 60fps Canvas Render Loop
      var rafId = 0;
      var lastTs = performance.now();
      var elapsed = 0;

      function drawBackgroundAndStage(hal, tSec, urgency) {
        var bgIm = passGetImg(hal ? 'bg_hal' : 'bg_classic');
        if (passImgReady(bgIm)) {
          var iw = bgIm.naturalWidth;
          var ih = bgIm.naturalHeight;
          var sc = Math.max(W / iw, H / ih);
          var dw = iw * sc;
          var dh = ih * sc;
          g.drawImage(bgIm, (W - dw) * 0.5, (H - dh) * 0.5, dw, dh);
        } else {
          var grad = g.createLinearGradient(0, 0, 0, H);
          grad.addColorStop(0, hal ? '#1e1b4b' : '#0284c7');
          grad.addColorStop(1, hal ? '#3b0764' : '#0369a1');
          g.fillStyle = grad;
          g.fillRect(0, 0, W, H);
        }

        // Keep scene >=60% bright while adding a warm stage spotlight in the center
        var spot = g.createRadialGradient(W * 0.5, H * 0.55, H * 0.08, W * 0.5, H * 0.55, W * 0.72);
        if (hal) {
          spot.addColorStop(0, 'rgba(251, 146, 60, 0.22)');
          spot.addColorStop(0.55, 'rgba(88, 28, 135, 0.18)');
          spot.addColorStop(1, 'rgba(15, 23, 42, 0.36)');
        } else {
          spot.addColorStop(0, 'rgba(254, 240, 138, 0.22)');
          spot.addColorStop(1, 'rgba(15, 23, 42, 0.24)');
        }
        g.fillStyle = spot;
        g.fillRect(0, 0, W, H);

        // Halloween hanging lanterns + floating ghost/bat
        if (hal) {
          var lanIm = passGetImg('lantern');
          if (passImgReady(lanIm)) {
            var swL = Math.sin(tSec * 2.0) * 0.08;
            var swR = Math.cos(tSec * 1.8) * 0.08;
            g.save();
            g.translate(W * 0.07, 72);
            g.rotate(swL);
            g.drawImage(lanIm, -34, 0, 68, 88);
            g.restore();

            g.save();
            g.translate(W * 0.93, 72);
            g.rotate(swR);
            g.drawImage(lanIm, -34, 0, 68, 88);
            g.restore();
          }
          var ghIm = passGetImg('ghost');
          if (passImgReady(ghIm)) {
            g.save();
            g.globalAlpha = 0.85;
            g.drawImage(ghIm, W * 0.12 + Math.sin(tSec * 1.4) * 16 - 34, H * 0.22 + Math.cos(tSec * 1.9) * 10 - 34, 68, 68);
            g.restore();
          }
          var btIm = passGetImg('bat');
          if (passImgReady(btIm)) {
            g.save();
            g.globalAlpha = 0.88;
            g.drawImage(btIm, W * 0.88 + Math.cos(tSec * 1.7) * 20 - 34, H * 0.21 + Math.sin(tSec * 2.3) * 10 - 26, 68, 52);
            g.restore();
          }
        }

        // 3D Stage Ring Track connecting the monster pedestals
        var cx = W * 0.50;
        var cy = H * 0.56;
        var rx = W * 0.31;
        var ry = H * 0.16;

        g.save();
        g.strokeStyle = hal ? 'rgba(251, 146, 60, 0.45)' : 'rgba(253, 224, 71, 0.55)';
        g.lineWidth = 6;
        g.setLineDash([16, 12]);
        g.lineDashOffset = -(tSec * 42) % 28;
        g.beginPath();
        g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        g.stroke();
        g.setLineDash([]);
        g.restore();

        // Center Stage Focal Prop (Bubbling Cauldron in Halloween / Star Trophy Table in Classic) + Giant Fuse Countdown Gauge
        var fuseRatio = Math.max(0, Math.min(1, fuseLeft / Math.max(1, fuseMax)));
        var ringCol = urgency > 0.68 ? '#f43f5e' : (urgency > 0.35 ? '#f59e0b' : '#10b981');
        var pulseR = 68 + Math.sin(tSec * (4 + urgency * 10)) * (4 + urgency * 6);

        g.save();
        g.fillStyle = 'rgba(15, 23, 42, 0.72)';
        g.beginPath();
        g.arc(cx, cy, pulseR + 8, 0, Math.PI * 2);
        g.fill();

        g.strokeStyle = 'rgba(255, 255, 255, 0.22)';
        g.lineWidth = 10;
        g.beginPath();
        g.arc(cx, cy, pulseR, 0, Math.PI * 2);
        g.stroke();

        g.strokeStyle = ringCol;
        g.lineWidth = 10;
        g.lineCap = 'round';
        g.beginPath();
        g.arc(cx, cy, pulseR, -Math.PI * 0.5, -Math.PI * 0.5 + Math.PI * 2 * fuseRatio);
        g.stroke();
        g.restore();

        var centerIm = passGetImg(hal ? 'cauldron' : 'star_coin');
        if (passImgReady(centerIm)) {
          var cSize = hal ? 108 : 88;
          var cBob = Math.sin(tSec * 3.2) * 4;
          g.drawImage(centerIm, cx - cSize * 0.5, cy - cSize * 0.52 + cBob, cSize, cSize);
        }

        // Countdown seconds readout on the center pedestal
        var secText = phase === 'round_end' ? '💥 BOOM!' : (Math.ceil(Math.max(0, fuseLeft)) + 's');
        passOutlinedText(g, secText, cx, cy + pulseR + 24, 26, urgency > 0.65 ? '#fda4af' : '#fde047', '#0f172a');
      }

      function drawMonsterAtSeat(idx, tSec, urgency) {
        var team = T[idx];
        if (!team) return;
        var sp = getSeatPos(idx);
        var isHolder = (idx === holder && phase !== 'passing');
        var pose = poses[idx] || 'idle';
        var col = team.color || '#38bdf8';
        var monSize = Math.min(205, Math.max(152, H * 0.25));

        // 3D Pedestal + Urgency Halo under active holder
        g.save();
        if (isHolder && phase === 'action') {
          var haloR = monSize * (0.48 + 0.08 * Math.sin(tSec * (6 + urgency * 12)));
          var hGrad = g.createRadialGradient(sp.x, sp.y, 8, sp.x, sp.y, haloR);
          hGrad.addColorStop(0, urgency > 0.65 ? 'rgba(244, 63, 94, 0.78)' : 'rgba(245, 158, 11, 0.72)');
          hGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
          g.fillStyle = hGrad;
          g.beginPath();
          g.ellipse(sp.x, sp.y + 8, haloR, haloR * 0.42, 0, 0, Math.PI * 2);
          g.fill();
        }

        var pedGrad = g.createRadialGradient(sp.x, sp.y + 10, 6, sp.x, sp.y + 10, monSize * 0.52);
        pedGrad.addColorStop(0, col);
        pedGrad.addColorStop(0.6, 'rgba(15, 23, 42, 0.82)');
        pedGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        g.fillStyle = pedGrad;
        g.beginPath();
        g.ellipse(sp.x, sp.y + 10, monSize * 0.5, monSize * 0.18, 0, 0, Math.PI * 2);
        g.fill();

        g.strokeStyle = isHolder ? '#fde047' : col;
        g.lineWidth = isHolder ? 4.5 : 3;
        g.beginPath();
        g.ellipse(sp.x, sp.y + 6, monSize * 0.39, monSize * 0.12, 0, 0, Math.PI * 2);
        g.stroke();
        g.restore();

        // Pose animation math
        var bobSpd = isHolder ? (4.5 + urgency * 7) : 2.8;
        var bobY = Math.sin(tSec * bobSpd + idx * 1.4) * (isHolder ? 8 : 5);
        var jumpY = 0;
        var rot = 0;
        var sx = 1 + Math.sin(tSec * bobSpd + idx) * 0.03;
        var sy = 1 - Math.sin(tSec * bobSpd + idx) * 0.03;

        if (pose === 'throw') {
          jumpY = -24;
          rot = (sp.x < W * 0.5) ? 0.18 : -0.18;
          sx = 0.94;
          sy = 1.1;
        } else if (pose === 'catch') {
          jumpY = 6;
          sx = 1.14;
          sy = 0.88;
        } else if (pose === 'celebrate') {
          jumpY = -Math.abs(Math.sin(tSec * 8.5 + idx)) * 34;
          rot = Math.sin(tSec * 9 + idx) * 0.14;
        } else if (pose === 'popped') {
          rot = Math.sin(tSec * 16) * 0.18;
          sx = 1.08 + Math.sin(tSec * 14) * 0.08;
          sy = 0.92 - Math.sin(tSec * 14) * 0.08;
        } else if (pose === 'shrug') {
          rot = Math.sin(tSec * 14) * 0.1;
        }

        var monIm = passMonImg(team.mon);
        g.save();
        g.translate(sp.x, sp.y - monSize * 0.43 + bobY + jumpY);
        g.rotate(rot);
        g.scale(sx, sy);
        if (passImgReady(monIm)) {
          g.drawImage(monIm, -monSize * 0.5, -monSize * 0.5, monSize, monSize);
        } else {
          g.fillStyle = col;
          g.beginPath();
          g.arc(0, 0, monSize * 0.36, 0, Math.PI * 2);
          g.fill();
        }
        g.restore();

        // Dizzy stars above popped monster
        if (pose === 'popped') {
          var stI;
          for (stI = 0; stI < 3; stI++) {
            var sa = tSec * 5.5 + (stI * Math.PI * 2) / 3;
            var stX = sp.x + Math.cos(sa) * 44;
            var stY = sp.y - monSize * 0.92 + Math.sin(sa) * 12;
            passOutlinedText(g, '⭐', stX, stY, 20, '#fde047', '#0f172a');
          }
        }

        // Team name pill under pedestal
        var pillW = 156;
        var pillH = 32;
        g.save();
        passRoundRect(g, sp.x - pillW * 0.5, sp.y + 22, pillW, pillH, 16);
        g.fillStyle = 'rgba(15, 23, 42, 0.9)';
        g.fill();
        g.lineWidth = 2.5;
        g.strokeStyle = isHolder ? '#fde047' : col;
        g.stroke();
        g.fillStyle = '#ffffff';
        g.font = '900 15px "Fredoka", "Nunito", sans-serif';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText((isHolder ? '🔥 ' : '') + team.name, sp.x, sp.y + 22 + pillH * 0.5);
        g.restore();

        // Speech bubble above monster (or to the side for upper-row monsters so it never touches the top banner)
        var btxt = bubbles[idx];
        if (btxt) {
          var bw = 172;
          var bh = 36;
          var bx = Math.max(12, Math.min(W - bw - 12, sp.x - bw * 0.5));
          var by = sp.y - monSize - 22 + jumpY * 0.35;
          if (sp.y < H * 0.45) {
            bx = (sp.x <= W * 0.5)
              ? Math.max(14, sp.x - monSize * 0.52 - bw)
              : Math.min(W - bw - 14, sp.x + monSize * 0.52);
            by = sp.y - monSize * 0.62 + jumpY * 0.35;
          }
          g.save();
          passRoundRect(g, bx, by, bw, bh, 17);
          g.fillStyle = isHolder ? '#fef3c7' : 'rgba(255, 255, 255, 0.94)';
          g.fill();
          g.lineWidth = 2.5;
          g.strokeStyle = isHolder ? '#f59e0b' : col;
          g.stroke();
          g.fillStyle = '#0f172a';
          g.font = '900 14px "Fredoka", "Nunito", sans-serif';
          g.textAlign = 'center';
          g.textBaseline = 'middle';
          g.fillText(btxt, bx + bw * 0.5, by + bh * 0.5);
          g.restore();
        }
      }

      function drawBombOrPumpkin(hal, tSec, urgency) {
        if (phase === 'round_end' || phase === 'finale') return;

        var bx, by, rot = 0, scale = 1.0;
        if (passArc) {
          var p0 = getBombPosForSeat(passArc.fromIdx);
          var p1 = getBombPosForSeat(passArc.toIdx);
          var k = Math.max(0, Math.min(1, passArc.t / passArc.dur));
          var lift = Math.sin(k * Math.PI) * Math.min(180, H * 0.24);
          bx = p0.x + (p1.x - p0.x) * k;
          by = p0.y + (p1.y - p0.y) * k - lift;
          rot = k * Math.PI * 2 * (p1.x >= p0.x ? 1 : -1);
          scale = 1 + Math.sin(k * Math.PI) * 0.28;
        } else {
          var hp = getBombPosForSeat(holder);
          bx = hp.x;
          by = hp.y + Math.sin(tSec * (6 + urgency * 10)) * 7;
          rot = Math.sin(tSec * (7 + urgency * 12)) * (0.08 + urgency * 0.14);
          var pulse = Math.pow(Math.max(0, Math.sin(tSec * (3 + urgency * 7) * Math.PI)), 2);
          scale = 1 + pulse * (0.08 + urgency * 0.16);
        }

        var itemIm = passGetImg(hal ? 'pumpkin' : 'bomb');
        var sz = Math.min(118, Math.max(88, H * 0.14));

        // Warm glow behind the ticking pumpkin/bomb
        g.save();
        var glowR = sz * (0.68 + urgency * 0.25);
        var bGrad = g.createRadialGradient(bx, by, 6, bx, by, glowR);
        bGrad.addColorStop(0, urgency > 0.65 ? 'rgba(244, 63, 94, 0.85)' : 'rgba(251, 191, 36, 0.75)');
        bGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
        g.fillStyle = bGrad;
        g.beginPath();
        g.arc(bx, by, glowR, 0, Math.PI * 2);
        g.fill();

        g.translate(bx, by);
        g.rotate(rot);
        g.scale(scale, 2 - scale * 0.92);
        if (passImgReady(itemIm)) {
          g.drawImage(itemIm, -sz * 0.5, -sz * 0.5, sz, sz);
        } else {
          g.fillStyle = hal ? '#fb923c' : '#1e293b';
          g.beginPath();
          g.arc(0, 0, sz * 0.42, 0, Math.PI * 2);
          g.fill();
        }
        g.restore();
      }

      function drawParticlesAndShockwave(dt) {
        if (shockwave) {
          shockwave.r += (shockwave.maxR - shockwave.r) * Math.min(1, dt * 8);
          shockwave.alpha -= dt * 1.6;
          if (shockwave.alpha <= 0) {
            shockwave = null;
          } else {
            g.save();
            g.strokeStyle = 'rgba(251, 191, 36, ' + shockwave.alpha.toFixed(2) + ')';
            g.lineWidth = 8;
            g.beginPath();
            g.arc(shockwave.x, shockwave.y, shockwave.r, 0, Math.PI * 2);
            g.stroke();
            g.restore();
          }
        }

        var i;
        for (i = particles.length - 1; i >= 0; i--) {
          var p = particles[i];
          p.life -= dt;
          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += (p.gravity || 260) * dt;
          var alpha = Math.max(0, Math.min(1, p.life / (p.maxLife || 1)));
          g.save();
          g.globalAlpha = alpha;
          g.fillStyle = p.color;
          g.beginPath();
          g.arc(p.x, p.y, p.r * alpha, 0, Math.PI * 2);
          g.fill();
          g.restore();
        }
      }

      function frame(now) {
        if (ended && !scene.isConnected) return;
        var rawDt = Math.min(0.05, Math.max(0.001, (now - lastTs) * 0.001));
        lastTs = now;

        var dt = rawDt;
        if (slowMoT > 0) {
          slowMoT -= rawDt;
          dt = rawDt * 0.38;
        }
        elapsed += dt;

        if (shakeMag > 0) {
          shakeMag = Math.max(0, shakeMag - rawDt * 14);
        }

        // Advance pass arc if tossing between monsters
        if (phase === 'passing' && passArc) {
          passArc.t += rawDt;
          var pk = Math.min(1, passArc.t / passArc.dur);
          var p0 = getBombPosForSeat(passArc.fromIdx);
          var p1 = getBombPosForSeat(passArc.toIdx);
          var curX = p0.x + (p1.x - p0.x) * pk;
          var curY = p0.y + (p1.y - p0.y) * pk - Math.sin(pk * Math.PI) * Math.min(180, H * 0.24);
          particles.push({
            x: curX + (Math.random() - 0.5) * 14,
            y: curY + (Math.random() - 0.5) * 14,
            vx: (Math.random() - 0.5) * 40,
            vy: (Math.random() - 0.5) * 40,
            r: 5 + Math.random() * 4,
            color: isHal() ? '#fb923c' : '#fde047',
            life: 0.45,
            maxLife: 0.45,
            gravity: 60
          });

          if (passArc.t >= passArc.dur) {
            holder = passArc.toIdx;
            passArc = null;
            phase = 'action';
            var pi;
            for (pi = 0; pi < nt; pi++) {
              poses[pi] = (pi === holder) ? 'holding' : 'idle';
              bubbles[pi] = (pi === holder) ? 'Hot! Pass it! 🔥' : 'Nice pass! 👏';
            }
            renderBanner();
          }
        }

        // Advance fuse countdown when in action or question phase
        var urgency = Math.max(0, Math.min(1, 1 - fuseLeft / Math.max(1, fuseMax)));
        if (phase === 'action' || phase === 'question') {
          var fuseRate = phase === 'question' ? 0.18 : 1.0;
          fuseLeft -= rawDt * fuseRate;
          if (phase === 'question' && fuseLeft < 2.2) {
            // Never pop behind an open question card while the student is reading!
            fuseLeft = 2.2;
          }

          var tickInterval = 0.82 - urgency * 0.5;
          tickAcc += rawDt;
          if (tickAcc >= tickInterval) {
            tickAcc = 0;
            if (A()) A().play('fuse_tick', urgency);
            var bp = getBombPosForSeat(holder);
            var si;
            for (si = 0; si < 5; si++) {
              var ang = -Math.PI * 0.5 + (Math.random() - 0.5) * 1.8;
              var spd = 50 + Math.random() * 110;
              particles.push({
                x: bp.x,
                y: bp.y - 34,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd - 40,
                r: 4 + Math.random() * 3,
                color: urgency > 0.65 ? '#f43f5e' : '#fde047',
                life: 0.42,
                maxLife: 0.42,
                gravity: 220
              });
            }
          }

          // Pulse active team pod
          var hbFreq = 1.8 + urgency * 4.5;
          var hbWave = Math.pow(Math.max(0, Math.sin(now * 0.001 * hbFreq * Math.PI * 2)), 3);
          var activePod = document.getElementById('gm-team-' + holder);
          if (activePod) {
            activePod.classList.toggle('gm-pod-urgent', urgency > 0.25);
            activePod.style.setProperty('--urg', urgency.toFixed(3));
            activePod.style.setProperty('--hb-scale', (1 + hbWave * (0.03 + urgency * 0.12)).toFixed(3));
          }

          if (fuseLeft <= 0 && phase === 'action') {
            popBomb();
          }
        }

        g.save();
        var sx = shakeMag > 0 ? (Math.random() - 0.5) * shakeMag * 2 : 0;
        var sy = shakeMag > 0 ? (Math.random() - 0.5) * shakeMag * 2 : 0;
        g.setTransform(dpr, 0, 0, dpr, sx * dpr, sy * dpr);
        g.clearRect(-20, -20, W + 40, H + 40);

        var hal = isHal();
        drawBackgroundAndStage(hal, elapsed, urgency);

        // Draw monsters sorted by Y so back monsters render behind front monsters
        var order = [];
        var oi;
        for (oi = 0; oi < nt; oi++) order.push(oi);
        order.sort(function (a, b) { return getSeatPos(a).y - getSeatPos(b).y; });
        for (oi = 0; oi < order.length; oi++) {
          drawMonsterAtSeat(order[oi], elapsed, urgency);
        }

        drawBombOrPumpkin(hal, elapsed, urgency);
        drawParticlesAndShockwave(dt);
        g.restore();

        if (!ended) {
          rafId = requestAnimationFrame(frame);
        }
      }

      startRound();
      rafId = requestAnimationFrame(frame);

      // 8. Clean Teardown on Game End
      ctx.onEnd(function () {
        ended = true;
        clearPodUrgency();
        clearOrbs();
        if (rafId) cancelAnimationFrame(rafId);
        if (ro) ro.disconnect();
        window.removeEventListener('resize', resizeCanvas);
        window.removeEventListener('keydown', onKeyDown);
        var ti2;
        for (ti2 = 0; ti2 < timers.length; ti2++) {
          clearTimeout(timers[ti2]);
        }
      });
    }
  };

  /* ================= Bowling ================= */
  /* Real ten-pin bowling on one full-screen canvas lane in perspective (Wave 4 / Real-3 Rebuild).
     Preserves the exact top-down inch physics (41.5 in wide lane, head pin 60 ft from foul line,
     pocket strikes, two balls per frame, spares, pin-to-pin sweep collisions, kickbacks).
     Adds: full-screen bg_bowling_lane + 3D perspective lane, big 26%-height animated bowler monster
     holding o_bowling_ball / o_pumpkin_ball, waiting team buddy monster & side crowd, camera scrolling
     down the lane behind the ball, slow-motion pin scatter with light splinters, sweep bar & pinsetter,
     code-drawn bowling scoreboard, glowing footprint stand marker, lane aim arrow, and 60px Stop / Quick Roll buttons. */

  function bwlLoadImg(src) {
    var im = new Image();
    im.src = src;
    return im;
  }
  function bwlImgReady(im) {
    return !!(im && im.complete && im.naturalWidth > 0);
  }
  function bwlMonImage(m) {
    var img = new Image();
    var svg = (GM.mon && GM.mon.svg) ? GM.mon.svg(m, 260) : '';
    if (!svg || svg.indexOf('<svg') < 0) return null;
    if (svg.indexOf('xmlns=') < 0) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    return img;
  }
  function bwlOutlinedText(g, txt, x, y, size, fill, stroke, align) {
    g.save();
    g.font = '900 ' + Math.round(size) + 'px Fredoka, "Baloo 2", system-ui, sans-serif';
    g.textAlign = align || 'center';
    g.textBaseline = 'middle';
    g.lineJoin = 'round';
    g.lineWidth = Math.max(4, Math.round(size * 0.22));
    g.strokeStyle = stroke || '#0f172a';
    g.strokeText(txt, x, y);
    g.fillStyle = fill || '#ffffff';
    g.fillText(txt, x, y);
    g.restore();
  }
  function bwlFlyScoreToPod(screenPt, teamIdx, pts) {
    var pod = document.querySelector('#gm-team-' + teamIdx + ' .gm-score') || document.getElementById('gm-team-' + teamIdx);
    var layer = document.getElementById('gm-fx');
    if (!pod || !layer || !screenPt) return;
    var r = pod.getBoundingClientRect();
    var orb = GM.u.h('div', { class: 'gm-score-orb', text: '+' + pts });
    orb.style.left = Math.round(screenPt.x) + 'px';
    orb.style.top = Math.round(screenPt.y) + 'px';
    layer.appendChild(orb);
    setTimeout(function () {
      orb.style.left = Math.round(r.left + r.width / 2) + 'px';
      orb.style.top = Math.round(r.top + r.height / 2) + 'px';
      orb.style.transform = 'translate(-50%, -50%) scale(0.75)';
    }, 24);
    setTimeout(function () {
      if (orb.parentNode) orb.parentNode.removeChild(orb);
    }, 640);
  }

  GM.modes.bowling = {
    id: 'bowling', name: 'Pumpkin Bowling', nameClassic: 'Bowling', e: '🎳',
    desc: 'Answer right, then time 3 skill steps: Stand Position, Launch Angle (at the lane arrows), and Fast Power + Hook! Hit the 1-3 or 1-2 pocket for a strike — hitting dead-center leaves a split!',
    descClassic: 'Answer right, then time 3 skill steps: Stand Position, Launch Angle (at the lane arrows), and Fast Power + Hook! Hit the 1-3 or 1-2 pocket for a strike — hitting dead-center leaves a split!',
    fields: [
      { key: 'frames', label: 'Frames for each team', opts: [[2, '2'], [3, '3'], [5, '5'], [8, '8']], def: 3 },
      { key: 'level', label: 'Difficulty', opts: [['easy', 'Easy'], ['normal', 'Normal'], ['hard', 'Hard']], def: 'normal' }
    ],
    start: function (ctx) {
      var st = GM.state, hal = st.theme === 'halloween';
      var LV = {
        easy:   { s: 0.92, green: [0.66, 0.88], noise: 0.55 },
        normal: { s: 1.28, green: [0.73, 0.85], noise: 1.00 },
        hard:   { s: 1.65, green: [0.77, 0.84], noise: 1.35 }
      }[ctx.cfg.level] || { s: 1.28, green: [0.73, 0.85], noise: 1.00 };

      var totalFrames = (+ctx.cfg.frames || 3) * st.teams.length;
      var eng = E().createSession(ctx, {
        maxRounds: totalFrames,
        data: { stage: 'idle', pos: 0, posDir: 1, pow: 0.78, powDir: 1, eff: 0, effDir: 1, ball: 1 }
      });

      try { A().musicStart(hal ? 'halloween' : 'sports'); } catch (e) { /* ignore */ }

      var rootEl = ctx.root;
      rootEl.innerHTML = '';

      var lane = U().h('div', { class: 'gm-real3-scene gm-lane gm-lane3d', title: 'Tap the lane (or press Space) to lock each step' });
      var cv = U().h('canvas', { class: 'gm-real3-cv gm-lane-cv' });
      var g = cv.getContext('2d');
      var deck = U().h('div', { class: 'gm-bowl-deck' });
      var banner = U().h('div', { class: 'gm-real3-banner' });
      var dock = U().h('div', { class: 'gm-real3-dock' });
      lane.appendChild(cv);
      lane.appendChild(deck);
      rootEl.appendChild(U().h('div', { class: 'gm-boardwrap' }, [lane, banner, dock]));

      /* Preload art assets */
      var artLaneBg      = bwlLoadImg('art/bg_bowling_lane.webp');
      var artLaneFallback = bwlLoadImg('art/bg_classic_bowling.webp');
      var artBallClassic = bwlLoadImg('art/o_bowling_ball.webp');
      var artBallHal     = bwlLoadImg('art/o_pumpkin_ball.webp');
      var artPinClassic  = bwlLoadImg('art/o_bowling_pin.webp');
      var artPinHal      = bwlLoadImg('art/o_ghost_pin.webp');
      var artLantern     = bwlLoadImg('art/o_candle_lantern.webp');
      var monImgs        = st.teams.map(function (t) { return bwlMonImage(t.mon); });

      var W = 1366, H = 768;
      var dpr = Math.min(1.5, root.devicePixelRatio || 1);
      function fit() {
        var r = lane.getBoundingClientRect();
        var rw = r.width || root.innerWidth || 1366;
        var rh = r.height || root.innerHeight || 768;
        if (rw < 40 || rh < 40) return;
        dpr = Math.min(1.5, root.devicePixelRatio || 1);
        W = rw;
        H = rh;
        var cw = Math.round(W * dpr), ch = Math.round(H * dpr);
        if (cv.width !== cw || cv.height !== ch) {
          cv.width = cw;
          cv.height = ch;
        }
        g.setTransform(cv.width / W, 0, 0, cv.height / H, 0, 0);
      }
      fit();
      eng.listen(root, 'resize', fit);
      if (root.ResizeObserver) {
        var ro = new root.ResizeObserver(fit);
        ro.observe(lane);
        eng.on('end', function () { try { ro.disconnect(); } catch (e) { /* ignore */ } });
      }

      /* Camera state: camV scrolls down the lane behind the rolling ball (0 .. 0.44) */
      var cam = { v: 0, tv: 0, u: 0, tu: 0, zoom: 1, tzoom: 1, shakeT: 0, shakeMag: 0 };
      var bowlerAnim = { state: 'idle', t: 0 }; /* 'idle' | 'step' | 'windup' | 'release' | 'watch' | 'celebrate' | 'shrug' | 'finale' */
      var sweepAnim = { active: false, t: 0, mode: 'sweep' }; /* sweep bar & pinsetter */
      var lightSplinters = [];
      var crowdCheerT = 0;

      function addSplinter(sp) {
        if (lightSplinters.length >= 150) lightSplinters.shift();
        lightSplinters.push(sp);
      }
      function burstPinLight(px, py, count, isStrike) {
        var cols = isStrike
          ? ['#fde047', '#38bdf8', '#f43f5e', '#4ade80', '#ffffff', '#a855f7']
          : ['#fde047', '#38bdf8', '#ffffff', '#fb923c'];
        for (var i = 0; i < count; i++) {
          var a = Math.random() * Math.PI * 2;
          var s = (isStrike ? 140 : 90) + Math.random() * 280;
          addSplinter({
            x: px, y: py,
            vx: Math.cos(a) * s,
            vy: Math.sin(a) * s - 80,
            rot: a,
            vrot: (Math.random() - 0.5) * 10,
            len: (isStrike ? 16 : 11) + Math.random() * 14,
            r: 4 + Math.random() * 5,
            c: cols[i % cols.length],
            t: 0,
            life: 0.55 + Math.random() * 0.45
          });
        }
      }
      function triggerShake(mag, dur) {
        cam.shakeMag = Math.min(6, mag || 4);
        cam.shakeT = Math.min(0.28, dur || 0.22);
      }

      /* ---------- drawing space: u across (-1..1 = the wood), v down the lane, z up ---------- */
      var K = 2.25;
      function geo() {
        var y1 = H * 0.96, yt = H * 0.28;
        return {
          y1: y1,
          yh: (yt * (1 + K) - y1) / K,
          half: Math.min(W * 0.34, H * 0.52),
          cx: W * 0.5 - cam.u * W * 0.12
        };
      }
      function P(u, v, z) {
        var G = geo();
        var vRel = Math.max(-0.28, v - cam.v);
        var s = (1 / (1 + K * vRel)) * cam.zoom;
        return {
          x: G.cx + u * G.half * s,
          y: G.yh + (G.y1 - G.yh) * s - (z || 0) * G.half * s,
          k: G.half * s
        };
      }
      function quad(u0, u1, v0, v1) {
        var a = P(u0, v0), b = P(u1, v0), c = P(u1, v1), d = P(u0, v1);
        g.beginPath();
        g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.lineTo(c.x, c.y); g.lineTo(d.x, d.y);
        g.closePath();
      }
      function rr(x, y, w, h, r) {
        g.beginPath();
        g.moveTo(x + r, y);
        g.arcTo(x + w, y, x + w, y + h, r);
        g.arcTo(x + w, y + h, x, y + h, r);
        g.arcTo(x, y + h, x, y, r);
        g.arcTo(x, y, x + w, y, r);
        g.closePath();
      }

      /* ---------- physics space, in inches (UNTOUCHED real lane constants) ---------- */
      var LW = 20.75, KICK = 25.3, HEAD = 720, PITY = 800, PIN_R = 2.4, BALL_R = 4.3, MB = 6.8, MP = 1.6, PIN_LEN = 14;
      function U_(x) { return x / LW; }
      function V_(y) { return y < 690 ? y * (0.74 / 690) : 0.74 + (y - 690) * 0.0033; }
      var END = V_(HEAD + 52), PIT = V_(PITY + 25);

      var C = hal
        ? { wall0: '#3b1658', wall1: '#120524', wood0: '#f59e0b', wood1: '#9a3412', stripe: '#a855f7', bulb: '#fb923c' }
        : { wall0: '#1e3a8a', wall1: '#091128', wood0: '#fde68a', wood1: '#d97706', stripe: '#ef4444', bulb: '#fde047' };

      var LANE_OFF = 3.2;
      function laneName() {
        var t = eng.activeTeam();
        return (t && t.name) || 'Lane 1';
      }

      function updateBanner(title, sub, compact) {
        var t = eng.activeTeam() || st.teams[0];
        banner.style.setProperty('--c', (t && t.color) || '#38bdf8');
        banner.innerHTML = '';
        if (t && t.mon) banner.appendChild(U().monFace(t.mon, 42));
        banner.appendChild(U().h('b', { text: title }));
        if (sub) banner.appendChild(U().h('span', { class: 'gm-real3-sub', text: sub }));
        banner.className = 'gm-real3-banner in' + (compact ? ' compact' : '');
      }

      function drawLane(now) {
        var far = P(0, PIT);
        /* 0. Background panorama image (bg_bowling_lane.webp) with parallax zoom */
        var bgIm = bwlImgReady(artLaneBg) ? artLaneBg : artLaneFallback;
        if (bwlImgReady(bgIm)) {
          g.save();
          var bgScale = 1 + cam.v * 0.55;
          var bw = W * bgScale, bh = H * bgScale;
          var bx = (W - bw) * 0.5 - cam.u * 45;
          var by = (H - bh) * 0.35;
          g.drawImage(bgIm, bx, by, bw, bh);
          /* Theme atmosphere tint */
          if (hal) {
            var halTint = g.createLinearGradient(0, 0, 0, H);
            halTint.addColorStop(0, 'rgba(36, 10, 70, 0.72)');
            halTint.addColorStop(0.5, 'rgba(59, 22, 88, 0.55)');
            halTint.addColorStop(1, 'rgba(20, 6, 38, 0.65)');
            g.fillStyle = halTint;
            g.fillRect(0, 0, W, H);
          } else {
            g.fillStyle = 'rgba(15, 23, 42, 0.22)';
            g.fillRect(0, 0, W, H);
          }
          g.restore();
        } else {
          var wg = g.createLinearGradient(0, 0, 0, far.y);
          wg.addColorStop(0, C.wall1);
          wg.addColorStop(1, C.wall0);
          g.fillStyle = wg;
          g.fillRect(0, 0, W, far.y + 1);
          g.fillStyle = C.wall1;
          g.fillRect(0, far.y, W, H - far.y);
        }

        /* Draw main 3D perspective lane (L = 0) cleanly over bg_bowling_lane.webp */
        laneAt(0, now);

        /* Side wall sconces / Halloween glowing lanterns in parallax (0.65x) */
        [-1, 1].forEach(function (side) {
          for (var sc = 0; sc < 3; sc++) {
            var sv = 0.14 + sc * 0.22;
            var sp = P(side * 1.55, sv, 0.55);
            if (sp.x < -60 || sp.x > W + 60) continue;
            var glowR = Math.max(18, sp.k * 0.22);
            var lg = g.createRadialGradient(sp.x, sp.y, 2, sp.x, sp.y, glowR);
            lg.addColorStop(0, hal ? 'rgba(251, 146, 60, 0.85)' : 'rgba(254, 240, 138, 0.75)');
            lg.addColorStop(1, 'rgba(251, 146, 60, 0)');
            g.fillStyle = lg;
            g.beginPath(); g.arc(sp.x, sp.y, glowR, 0, Math.PI * 2); g.fill();
            if (hal && bwlImgReady(artLantern)) {
              var lw = Math.max(22, sp.k * 0.16);
              g.drawImage(artLantern, sp.x - lw / 2, sp.y - lw * 0.6, lw, lw * 1.2);
            }
          }
        });

        /* Masking unit over the pins with neon team sign & chasing bulbs */
        var my = P(0, PIT, 1.32).y, mh = Math.max(24, far.k * 0.46);
        var c = P(0, PIT, 1.32), ph = mh * 0.68, txt = laneName();
        g.font = '900 ' + Math.round(Math.max(20, ph * 0.66)) + 'px Fredoka, system-ui, sans-serif';
        var pw = Math.max(far.k * 1.15, g.measureText(txt).width + ph * 1.3);

        var mg = g.createLinearGradient(0, my - mh, 0, my);
        mg.addColorStop(0, '#090d1a');
        mg.addColorStop(1, hal ? '#2e1065' : '#1e293b');
        g.fillStyle = mg;
        rr(c.x - pw * 0.65, my - mh * 0.92, pw * 1.3, mh * 0.95, 14);
        g.fill();
        g.strokeStyle = C.stripe;
        g.lineWidth = 3;
        g.stroke();

        g.fillStyle = '#ffffff';
        rr(c.x - pw / 2, my - mh * 0.82, pw, ph, ph * 0.32);
        g.fill();
        bwlOutlinedText(g, txt, c.x, my - mh * 0.82 + ph / 2 + 1, Math.max(20, ph * 0.62), '#fde047', '#0f172a');

        for (var b = 0; b < 6; b++) {
          var on = (Math.floor(now / 240) + b) % 3 !== 0;
          g.fillStyle = on ? C.bulb : 'rgba(255,255,255,0.22)';
          [-1, 1].forEach(function (sd) {
            g.beginPath();
            g.arc(c.x + sd * (pw / 2 + 10 + b * 9), my - mh * 0.82 + ph / 2, 3.2, 0, Math.PI * 2);
            g.fill();
          });
        }
      }

      function laneAt(L, now) {
        var off = L * LANE_OFF, main = L === 0;
        function q(u0, u1, v0, v1) { quad(off + u0, off + u1, v0, v1); }
        if (P(off - 1.4, 0).x > W + 60 && P(off - 1.4, PIT).x > W) return;
        if (P(off + 1.4, 0).x < -60 && P(off + 1.4, PIT).x < 0) return;

        /* Outer lane trim */
        [[-1.28, -1.22], [1.22, 1.28]].forEach(function (tr) {
          q(tr[0], tr[1], -0.3, END);
          g.fillStyle = C.stripe;
          g.fill();
        });

        /* Dark pin pit at far end */
        q(-1.25, 1.25, END, PIT);
        g.fillStyle = '#05070f';
        g.fill();

        /* Side gutters */
        [[-1.22, -1], [1, 1.22]].forEach(function (sd) {
          q(sd[0], sd[1], -0.3, END);
          var gg = g.createLinearGradient(P(off + sd[0], 0).x, 0, P(off + sd[1], 0).x, 0);
          gg.addColorStop(0, '#1e293b');
          gg.addColorStop(0.5, hal ? '#6b21a8' : '#64748b');
          gg.addColorStop(1, '#1e293b');
          g.fillStyle = gg;
          g.fill();
        });

        /* Polished wooden lane surface */
        q(-1, 1, -0.3, END);
        var wd = g.createLinearGradient(0, H, 0, P(0, END).y);
        wd.addColorStop(0, C.wood0);
        wd.addColorStop(1, C.wood1);
        g.fillStyle = wd;
        g.globalAlpha = main ? 0.92 : 0.45;
        g.fill();
        g.globalAlpha = 1;

        var nb = main ? 20 : 8;
        for (var i = 0; i < nb; i++) {
          q(-1 + i * 2 / nb, -1 + (i + 1) * 2 / nb, -0.3, END);
          g.fillStyle = i % 2 ? 'rgba(255,255,255,0.08)' : 'rgba(120,60,0,0.07)';
          g.fill();
        }

        /* Glossy center reflection */
        q(-0.55, 0.55, -0.3, END);
        var sh2 = g.createLinearGradient(P(off - 0.55, 0).x, 0, P(off + 0.55, 0).x, 0);
        sh2.addColorStop(0, 'rgba(255,255,255,0)');
        sh2.addColorStop(0.5, hal ? 'rgba(251, 146, 60, 0.28)' : 'rgba(255,255,255,0.32)');
        sh2.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = sh2;
        g.fill();

        /* Glowing pin deck */
        q(-1, 1, V_(HEAD - 16), END);
        g.fillStyle = hal ? 'rgba(251, 146, 60, 0.26)' : 'rgba(255, 248, 220, 0.25)';
        g.fill();

        /* Arrows and approach dots on the lane */
        g.fillStyle = hal ? 'rgba(88, 28, 135, 0.65)' : 'rgba(110, 50, 10, 0.55)';
        for (var a = -3; a <= 3; a++) {
          var ay = 180 + Math.abs(a) * 12, ax = a * 5.2 + off * LW;
          var t = P(U_(ax), V_(ay + 16)), l = P(U_(ax - 1.2), V_(ay)), r2 = P(U_(ax + 1.2), V_(ay));
          g.beginPath(); g.moveTo(t.x, t.y); g.lineTo(l.x, l.y); g.lineTo(r2.x, r2.y); g.closePath(); g.fill();
          var d = P(U_(ax), V_(84));
          g.beginPath(); g.ellipse(d.x, d.y, d.k * 0.026 + 1.2, d.k * 0.013 + 1.2, 0, 0, Math.PI * 2); g.fill();
        }

        /* Foul line */
        q(-1.22, 1.22, -0.005, 0.005);
        g.fillStyle = hal ? '#a855f7' : '#0f172a';
        g.fill();

        if (!main) {
          q(-1.3, LANE_OFF - 1.3, -0.3, PIT);
          g.fillStyle = 'rgba(6, 9, 22, 0.55)';
          g.fill();
        }
      }

      /* ---------- pins (uses o_bowling_pin / o_ghost_pin with 3D perspective & reflections) ---------- */
      var SPOTS = [[0, 720], [-6, 730.4], [6, 730.4], [-12, 740.8], [0, 740.8], [12, 740.8], [-18, 751.2], [-6, 751.2], [6, 751.2], [18, 751.2]];
      var pins = SPOTS.map(function (s, i) { return { id: i, sx: s[0], sy: s[1] }; });
      function rackPin(p) {
        p.x = p.sx + (Math.random() - 0.5) * 0.3;
        p.y = p.sy + (Math.random() - 0.5) * 0.3;
        p.vx = 0; p.vy = 0; p.z = 0; p.vz = 0;
        p.down = false; p.fall = 0; p.dx = 0; p.dy = 1;
        p.alpha = 1; p.gone = false; p.drop = 1; p.rollDown = false; p.sweep = false;
      }
      function topple(p) {
        if (p.down) return;
        p.down = true; p.fall = 0; p.rollDown = true;
        var sp = Math.hypot(p.vx, p.vy);
        p.vz = Math.min(115, sp * 0.22);
        if (sp > 1) { p.dx = p.vx / sp; p.dy = p.vy / sp; }
        else { var a = Math.random() * 6.28; p.dx = Math.cos(a); p.dy = Math.sin(a); }
        var fp = P(U_(p.x), V_(p.y));
        burstPinLight(fp.x, fp.y - fp.k * 0.35, 8, false);
        A().play('pin_hit');
        A().play('wood_knock');
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
      function drawPin(p, now) {
        if (p.gone || p.alpha <= 0) return;
        var base = P(U_(p.x), V_(p.y), (p.drop > 0 ? p.drop * 0.8 : 0) + p.z / LW);
        var floor = P(U_(p.x), V_(p.y));
        var h = base.k * 1.05;
        var e = p.down ? Math.min(1, p.fall) : 0;
        e = e * e * (3 - 2 * e);
        var tip = P(U_(p.x + p.dx * 15), V_(p.y + p.dy * 15), 0.12);
        var lx = tip.x - floor.x, ly = tip.y - floor.y;
        var vx = lx * e, vy = -h * (1 - e) + ly * e, len = Math.max(4, Math.hypot(vx, vy));

        g.save();
        g.globalAlpha = Math.max(0, p.alpha);
        /* Contact shadow on lane */
        var shRatio = Math.max(0.25, 1 - p.z / 60);
        g.fillStyle = 'rgba(15, 23, 42, ' + (0.34 * shRatio).toFixed(2) + ')';
        g.beginPath();
        g.ellipse(floor.x + vx * 0.4 * e, floor.y + vy * 0.4 * e, (h * 0.2 + Math.abs(vx) * 0.4 * e) * shRatio, (h * 0.06 + Math.abs(vy) * 0.25 * e) * shRatio, 0, 0, Math.PI * 2);
        g.fill();

        /* Subtle reflection on polished wood */
        if (e < 0.05 && p.z < 0.5) {
          g.save();
          g.translate(floor.x, floor.y);
          g.scale(1, -0.38);
          pinShape(h);
          g.fillStyle = hal ? 'rgba(216, 180, 254, 0.12)' : 'rgba(255, 255, 255, 0.14)';
          g.fill();
          g.restore();
        }

        var wobbleRot = (!p.down && Math.hypot(p.vx, p.vy) > 0.2) ? Math.sin(now / 45 + p.id) * 0.12 : 0;
        g.translate(base.x, base.y);
        g.rotate(Math.atan2(vx, -vy) + wobbleRot);
        g.scale(1, len / h);

        var pinArt = hal ? (bwlImgReady(artPinHal) ? artPinHal : artPinClassic) : artPinClassic;
        if (bwlImgReady(pinArt)) {
          var pw = h * 0.56;
          g.drawImage(pinArt, -pw / 2, -h * 1.02, pw, h * 1.06);
        } else {
          pinShape(h);
          var pg = g.createLinearGradient(-0.2 * h, 0, 0.2 * h, 0);
          pg.addColorStop(0, '#b4bccd'); pg.addColorStop(0.38, '#ffffff'); pg.addColorStop(0.62, '#f1f3f8'); pg.addColorStop(1, '#a3adc2');
          g.fillStyle = pg; g.fill();
          g.strokeStyle = '#1f2a44'; g.lineWidth = Math.max(1.2, h * 0.028);
          pinShape(h); g.stroke();
        }
        g.restore();
      }

      /* ---------- Sweep Bar & Pinsetter Animation ---------- */
      function drawSweepBar() {
        if (!sweepAnim.active) return;
        var t = sweepAnim.t;
        /* Lower down (0..0.35), sweep back (0.35..0.85), lift up (0.85..1.0) */
        var sv = t < 0.35 ? V_(HEAD - 10) : (t < 0.85 ? V_(HEAD - 10 + (t - 0.35) / 0.5 * 85) : V_(PITY));
        var sz = t < 0.35 ? (1 - t / 0.35) * 0.75 : (t > 0.85 ? (t - 0.85) / 0.15 * 0.8 : 0.06);
        var leftP = P(-1.08, sv, sz), rightP = P(1.08, sv, sz);
        var barH = Math.max(8, leftP.k * 0.11);
        g.save();
        g.fillStyle = hal ? '#a855f7' : '#38bdf8';
        g.strokeStyle = '#ffffff';
        g.lineWidth = 3;
        rr(leftP.x, leftP.y - barH / 2, rightP.x - leftP.x, barH, barH / 2);
        g.fill();
        g.stroke();
        g.restore();
      }

      /* ---------- Ball (uses o_bowling_ball / o_pumpkin_ball) ---------- */
      var ball = { x: 0, y: 6, vx: 0, vy: 0, on: false, gutter: false, rot: 0, alpha: 1, hook: 0, done: true };
      function drawBall() {
        if (!ball.on || ball.alpha <= 0) return;

        var f = P(U_(ball.x), V_(ball.y));
        var r = Math.max(10, f.k * (BALL_R / LW) * 0.96);
        var col = (eng.activeTeam() || {}).color || '#ff6f3d';
        var x = f.x, y = f.y - r;

        g.save();
        g.globalAlpha = ball.alpha;
        /* Contact shadow on lane */
        g.fillStyle = 'rgba(15, 23, 42, 0.38)';
        g.beginPath();
        g.ellipse(x, f.y + r * 0.08, r * 0.98, r * 0.28, 0, 0, Math.PI * 2);
        g.fill();

        var bArt = hal ? (bwlImgReady(artBallHal) ? artBallHal : artBallClassic) : artBallClassic;
        if (bwlImgReady(bArt)) {
          g.translate(x, y);
          g.rotate(ball.rot * 0.65);
          g.drawImage(bArt, -r * 1.12, -r * 1.12, r * 2.24, r * 2.24);
        } else {
          g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = col; g.fill();
          g.strokeStyle = '#1f2a44'; g.lineWidth = Math.max(1.5, r * 0.07); g.stroke();
        }
        g.restore();
      }

      /* ---------- Big Bowler Monster & Waiting Buddy Monster (22-30% screen height) ---------- */
      function drawBowlerAndBuddy(now) {
        var D = eng.state.data;
        var turnIdx = eng.state.turn || 0;
        var activeTeam = st.teams[turnIdx] || st.teams[0];
        var mImg = monImgs[turnIdx];
        var bArt = hal ? (bwlImgReady(artBallHal) ? artBallHal : artBallClassic) : artBallClassic;

        /* Waiting team's cheering buddy monster on the left spectator bench */
        if (st.teams.length > 1) {
          var waitIdx = (turnIdx + 1) % st.teams.length;
          var wImg = monImgs[waitIdx];
          var wPos = P(-1.72, 0.08, 0);
          var wSize = Math.round(Math.max(125, H * 0.20));
          if (wPos.x > -100 && wPos.x < W + 100) {
            g.save();
            var wBob = crowdCheerT > 0 ? -Math.abs(Math.sin(now / 110)) * 20 : -Math.abs(Math.sin(now / 320)) * 6;
            g.translate(wPos.x, Math.min(H - 115, wPos.y) + wBob);
            g.fillStyle = 'rgba(15, 23, 42, 0.35)';
            g.beginPath(); g.ellipse(0, wSize * 0.42 - wBob, wSize * 0.32, wSize * 0.09, 0, 0, Math.PI * 2); g.fill();
            g.rotate(crowdCheerT > 0 ? Math.sin(now / 95) * 0.14 : 0.06);
            if (bwlImgReady(wImg)) {
              g.drawImage(wImg, -wSize / 2, -wSize / 2, wSize, wSize);
            }
            g.restore();
          }
        }

        /* Big Bowler Monster at the bottom of the lane (about 25% of screen height) */
        if (cam.v > 0.26 && D.stage === 'roll') return; /* Camera has scrolled past the bowler toward the pins */
        var standU = U_(D.pos || 0);
        var footP = P(standU, -0.02, 0);
        var bSize = Math.round(Math.max(175, Math.min(250, H * 0.26)));
        var bx = D.stage === 'idle' ? footP.x - bSize * 0.95 : footP.x - bSize * 0.44;
        var by = Math.min(H - 165, footP.y - bSize * 0.42);

        var sx = 1, sy = 1, rot = 0, bobY = 0;
        var stName = bowlerAnim.state;
        if (stName === 'idle' || D.stage === 'pos' || D.stage === 'eff' || D.stage === 'power') {
          sx = 1 + Math.sin(now / 240) * 0.045;
          sy = 1 - Math.sin(now / 240) * 0.045;
          bobY = -Math.abs(Math.sin(now / 280)) * 8;
          if (D.stage === 'pos') rot = Math.sin(now / 140) * 0.06;
          if (D.stage === 'eff' || D.stage === 'power') { sx = 1.05; sy = 0.95; rot = 0.08; }
        } else if (stName === 'windup') {
          var wt = Math.min(1, bowlerAnim.t / 0.32);
          rot = -0.26 * Math.sin(wt * Math.PI);
          sx = 1.08; sy = 0.92;
          bobY = -Math.sin(wt * Math.PI) * 18;
        } else if (stName === 'watch') {
          rot = 0.10;
          sx = 0.96; sy = 1.04;
          bobY = -4;
        } else if (stName === 'celebrate' || stName === 'finale') {
          bobY = -Math.abs(Math.sin(now / 115)) * 32;
          rot = Math.sin(now / 145) * 0.16;
          sx = 1 + Math.sin(now / 115) * 0.08;
          sy = 1 - Math.sin(now / 115) * 0.08;
        } else if (stName === 'shrug') {
          bobY = -Math.sin(Math.min(1, bowlerAnim.t * 2.2) * Math.PI) * 12;
          rot = Math.sin(now / 130) * 0.14;
          sx = 1.06; sy = 0.94;
        }

        g.save();
        g.translate(bx, by);
        /* Contact shadow & team colour ring under bowler's feet */
        g.fillStyle = 'rgba(15, 23, 42, 0.38)';
        g.beginPath();
        g.ellipse(0, bSize * 0.44, bSize * 0.36, bSize * 0.10, 0, 0, Math.PI * 2);
        g.fill();
        g.strokeStyle = (activeTeam && activeTeam.color) || '#38bdf8';
        g.lineWidth = 4;
        g.beginPath();
        g.ellipse(0, bSize * 0.44, bSize * 0.32, bSize * 0.085, 0, 0, Math.PI * 2);
        g.stroke();

        g.translate(0, bobY);
        g.rotate(rot);
        g.scale(sx, sy);

        if (bwlImgReady(mImg)) {
          g.drawImage(mImg, -bSize / 2, -bSize / 2, bSize, bSize);
        }

        /* Bowler holds the bowling ball before rolling */
        if (!ball.on && stName !== 'shrug' && stName !== 'celebrate' && stName !== 'finale') {
          var holdR = bSize * 0.21;
          var hx = bSize * 0.30, hy = bSize * 0.06;
          if (stName === 'windup') {
            hx = -bSize * 0.22;
            hy = -bSize * 0.12;
          }
          if (bwlImgReady(bArt)) {
            g.drawImage(bArt, hx - holdR, hy - holdR, holdR * 2, holdR * 2);
          } else {
            g.fillStyle = (activeTeam && activeTeam.color) || '#ff6f3d';
            g.beginPath(); g.arc(hx, hy, holdR, 0, Math.PI * 2); g.fill();
          }
        }

        if (stName === 'shrug') {
          bwlOutlinedText(g, '😊', bSize * 0.34, -bSize * 0.34, 34, '#fde047', '#0f172a');
        }
        g.restore();
      }

      /* ---------- Scene Guides: Glowing Footprint Stand Marker, Short Arrow-Zone Aim Guide, Power Meter ---------- */
      var DEG = Math.PI / 180;
      function drawStandAndAimGuides(now) {
        var D = eng.state.data;
        if (eng.state.phase !== 'action') return;

        /* 1. Glowing Footprint Marker at the foul line */
        var fp = P(U_(ball.x), 0.02, 0);
        var pulse = 1 + Math.sin(now / 150) * 0.08;
        g.save();
        g.translate(fp.x, fp.y);
        g.scale(pulse, pulse * 0.48);
        var fpGlow = g.createRadialGradient(0, 0, 4, 0, 0, 44);
        fpGlow.addColorStop(0, 'rgba(56, 189, 248, 0.9)');
        fpGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
        g.fillStyle = fpGlow;
        g.beginPath(); g.arc(0, 0, 44, 0, Math.PI * 2); g.fill();
        g.strokeStyle = '#fde047';
        g.lineWidth = 4;
        g.beginPath(); g.arc(0, 0, 26, 0, Math.PI * 2); g.stroke();
        g.restore();

        if (D.stage === 'pos') {
          /* Short stance alignment guide up to approach dots (y = 140 in), NOT all the way to the pins */
          var a = P(U_(ball.x), V_(28)), b = P(U_(ball.x), V_(140));
          g.save();
          g.lineCap = 'round';
          g.strokeStyle = Math.abs(ball.x) > 15.5 ? '#fb923c' : '#fde047';
          g.lineWidth = 5;
          g.setLineDash([12, 10]);
          g.lineDashOffset = -(now * 0.06) % 22;
          g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
          g.restore();
          bwlOutlinedText(g, '👣 1. Tap STOP to Stand Here', fp.x, fp.y - 52, 26, '#fde047', '#0f172a');
        }

        /* 2. Short Launch-Angle Arrow up to the Lane Target Arrows (y = 215 in) */
        if (D.stage === 'eff' || D.stage === 'power') {
          var launchDeg = D.eff * 12.5;
          var launchTan = Math.tan(launchDeg * DEG);
          var y0 = 24, y1 = 215;
          var x1 = ball.x + launchTan * (y1 - y0);
          var projectedMidX = ball.x + launchTan * 430;
          var riskGutter = Math.abs(projectedMidX) > LW - 1.2 || Math.abs(x1) > LW - 0.8;

          g.save();
          g.strokeStyle = riskGutter ? '#fb923c' : '#38bdf8';
          g.fillStyle = g.strokeStyle;
          g.lineWidth = 7;
          g.lineCap = 'round';
          g.beginPath();
          var steps = 8;
          for (var s = 0; s <= steps; s++) {
            var frac = s / steps;
            var py = y0 + frac * (y1 - y0);
            var px = ball.x + launchTan * (py - y0);
            var pt = P(U_(px), V_(py));
            if (s === 0) g.moveTo(pt.x, pt.y);
            else g.lineTo(pt.x, pt.y);
          }
          g.stroke();

          /* Arrowhead at the lane target arrows (y = 215 in) */
          var tipP = P(U_(x1), V_(y1));
          var prevP = P(U_(ball.x + launchTan * (y1 - 35 - y0)), V_(y1 - 35));
          var ang = Math.atan2(tipP.y - prevP.y, tipP.x - prevP.x);
          g.beginPath();
          g.moveTo(tipP.x, tipP.y);
          g.lineTo(tipP.x - Math.cos(ang - 0.52) * 22, tipP.y - Math.sin(ang - 0.52) * 22);
          g.lineTo(tipP.x - Math.cos(ang + 0.52) * 22, tipP.y - Math.sin(ang + 0.52) * 22);
          g.closePath();
          g.fill();
          g.restore();
        }
      }

      function meterBox() {
        var bh = Math.min(320, H * 0.44), bw = 34;
        var laneRight = P(1.38, 0.08).x;
        return { x: Math.min(W - bw - 72, Math.max(W * 0.68, laneRight + 24)), y: H * 0.78 - bh, w: bw, h: bh };
      }

      function drawMeter() {
        var D = eng.state.data;
        if (D.stage !== 'power') return;
        var m = meterBox(), x = m.x, y = m.y, bw = m.w, bh = m.h;
        g.save();
        g.fillStyle = 'rgba(15, 23, 42, 0.86)';
        rr(x - 8, y - 8, bw + 16, bh + 16, 14);
        g.fill();
        g.strokeStyle = '#ffffff';
        g.lineWidth = 3;
        g.stroke();

        var mg = g.createLinearGradient(0, y + bh, 0, y);
        mg.addColorStop(0, '#38bdf8');
        mg.addColorStop(LV.green[0], '#fde047');
        mg.addColorStop(LV.green[1], '#22c55e');
        mg.addColorStop(1, '#f43f5e');
        g.fillStyle = mg;
        rr(x, y, bw, bh, 9);
        g.fill();

        /* Highlight sweet-spot green zone */
        var gy = y + bh * (1 - LV.green[1]);
        var gh = bh * (LV.green[1] - LV.green[0]);
        g.fillStyle = 'rgba(34, 197, 94, 0.95)';
        g.fillRect(x, gy, bw, gh);
        g.strokeStyle = '#ffffff';
        g.lineWidth = 3;
        g.strokeRect(x, gy, bw, gh);

        /* Moving marker bar */
        var my = y + bh * (1 - D.pow);
        g.fillStyle = '#ffffff';
        g.strokeStyle = '#0f172a';
        g.lineWidth = 4;
        rr(x - 10, my - 7, bw + 20, 14, 7);
        g.fill();
        g.stroke();

        bwlOutlinedText(g, '⚡ 3. POWER', x + bw / 2, y - 24, 22, '#fde047', '#0f172a');
        g.restore();
      }

      function drawEffect() {
        var D = eng.state.data;
        if (D.stage !== 'eff') return;
        var R = Math.max(62, Math.min(W, H) * 0.115);
        var cx = Math.min(W - R - 32, Math.max(W * 0.72, P(1.5, 0.05).x + R));
        var cy = H * 0.72;
        g.save();
        g.fillStyle = 'rgba(15, 23, 42, 0.86)';
        g.strokeStyle = '#ffffff';
        g.lineWidth = 3;
        g.beginPath();
        g.arc(cx, cy, R + 12, Math.PI, 0);
        g.closePath();
        g.fill();
        g.stroke();

        [[-1, -0.45, '#f43f5e'], [-0.45, 0.45, '#38bdf8'], [0.45, 1, '#f43f5e']].forEach(function (z) {
          g.strokeStyle = z[2];
          g.lineWidth = R * 0.24;
          g.beginPath();
          g.arc(cx, cy, R * 0.78, -Math.PI / 2 + z[0] * 1.15, -Math.PI / 2 + z[1] * 1.15);
          g.stroke();
        });

        var a = -Math.PI / 2 + D.eff * 1.15;
        g.strokeStyle = '#ffffff';
        g.lineWidth = 6;
        g.lineCap = 'round';
        g.beginPath();
        g.moveTo(cx, cy);
        g.lineTo(cx + Math.cos(a) * R * 0.92, cy + Math.sin(a) * R * 0.92);
        g.stroke();
        g.fillStyle = '#fde047';
        g.beginPath(); g.arc(cx, cy, 8, 0, Math.PI * 2); g.fill();

        var degTxt = (D.eff >= 0 ? '+' : '') + Math.round(D.eff * 12.5) + '°';
        bwlOutlinedText(g, '🎯 2. AIM ANGLE (' + degTxt + ')', cx, cy - R - 24, 22, '#fde047', '#0f172a');
        g.restore();
      }

      /* ---------- Real Bowling Scoreboard Drawn in Code ---------- */
      var cardData = st.teams.map(function () { return []; });
      function drawScoreboard() {
        var nFrames = +ctx.cfg.frames || 3;
        var rowH = 44, nameW = 128, frW = 54, totW = 64;
        var boxW = nameW + nFrames * frW + totW + 16;
        var x0 = 18, y0 = 68;

        g.save();
        st.teams.forEach(function (t, ti) {
          var ry = y0 + ti * (rowH + 8);
          var isTurn = (ti === eng.state.turn);
          g.fillStyle = isTurn ? 'rgba(15, 23, 42, 0.92)' : 'rgba(15, 23, 42, 0.72)';
          g.strokeStyle = isTurn ? (t.color || '#fde047') : 'rgba(255, 255, 255, 0.35)';
          g.lineWidth = isTurn ? 4 : 2;
          rr(x0, ry, boxW, rowH, 12);
          g.fill();
          g.stroke();

          /* Team colour pill & name */
          g.fillStyle = t.color || '#38bdf8';
          rr(x0 + 6, ry + 6, 10, rowH - 12, 5);
          g.fill();
          bwlOutlinedText(g, (t.name || '').slice(0, 9), x0 + 24, ry + rowH / 2, 22, '#ffffff', '#0f172a', 'left');

          /* Frame cells (X for Strike, / for Spare) */
          for (var fi = 0; fi < nFrames; fi++) {
            var fx = x0 + nameW + fi * frW;
            var fr = cardData[ti][fi] || [];
            g.strokeStyle = 'rgba(255, 255, 255, 0.28)';
            g.lineWidth = 1.5;
            g.strokeRect(fx, ry + 5, frW - 4, rowH - 10);
            g.beginPath();
            g.moveTo(fx + (frW - 4) / 2, ry + 5);
            g.lineTo(fx + (frW - 4) / 2, ry + rowH - 5);
            g.stroke();

            var b1 = fr[0] || '';
            var b2 = fr[1] || '';
            bwlOutlinedText(g, b1, fx + (frW - 4) * 0.26, ry + rowH / 2, 20, b1 === 'X' ? '#fde047' : '#ffffff', '#0f172a');
            bwlOutlinedText(g, b2, fx + (frW - 4) * 0.74, ry + rowH / 2, 20, b2 === '/' ? '#4ade80' : '#ffffff', '#0f172a');
          }

          /* Total team score */
          var tx = x0 + nameW + nFrames * frW + totW / 2;
          bwlOutlinedText(g, String(t.score || 0), tx, ry + rowH / 2, 24, '#fde047', '#0f172a');
        });
        g.restore();
      }

      /* ---------- Big text pop (STRIKE! SPARE!) ---------- */
      var pop = null;
      function drawPop(now) {
        if (!pop) return;
        var t = (now - pop.t0) / 1000;
        if (t > 1.7) { pop = null; return; }
        var sc = t < 0.25 ? 0.4 + t / 0.25 * 0.8 : (t < 0.4 ? 1.2 - (t - 0.25) / 0.15 * 0.2 : 1);
        g.save();
        g.globalAlpha = t > 1.3 ? Math.max(0, 1 - (t - 1.3) / 0.4) : 1;
        g.translate(W / 2, H * 0.48);
        g.scale(sc, sc);
        g.rotate(-0.04);
        bwlOutlinedText(g, pop.text, 0, 0, Math.min(W * 0.085, H * 0.15), pop.col, '#0f172a');
        g.restore();
      }
      function say(text, col) { pop = { text: text, col: col, t0: performance.now() }; }

      /* ---------- Simulation (Real Oil Skid + Dry Hook + Pocket vs Nose-Hit Split Physics) ---------- */
      function hit(a, ma, b, mb, e) {
        var dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 0.001, nx = dx / d, ny = dy / d;
        var rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        var over = (a.rad + b.rad) - d, im = 1 / ma + 1 / mb;
        if (over > 0) {
          a.x -= nx * over * (1 / ma) / im; a.y -= ny * over * (1 / ma) / im;
          b.x += nx * over * (1 / mb) / im; b.y += ny * over * (1 / mb) / im;
        }
        if (rel >= 0) return 0;
        var j = -(1 + e) * rel / im;
        a.vx -= j / ma * nx; a.vy -= j / ma * ny;
        b.vx += j / mb * nx; b.vy += j / mb * ny;
        return j;
      }
      function segDist(px, py, ax, ay, bx, by) {
        var vx = bx - ax, vy = by - ay, l2 = vx * vx + vy * vy;
        var t = l2 ? Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / l2)) : 0;
        var cx = ax + vx * t, cy = ay + vy * t;
        return { d: Math.hypot(px - cx, py - cy), cx: cx, cy: cy };
      }
      ball.rad = BALL_R;
      pins.forEach(function (p) { p.rad = PIN_R; });

      var simT = 0, slowEnd = -1, playedScatter = false;
      function simStep(h) {
        simT += h;
        if (ball.on && !ball.gutter && slowEnd < 0 && ball.y > HEAD - 40) {
          slowEnd = simT + 0.55;
          if (!playedScatter) {
            playedScatter = true;
            A().play('pins_scatter_big');
          }
        }
        if (ball.on) {
          /* First 440 in is oiled skid zone; dry backend (440..720 in) applies hook */
          if (!ball.gutter && ball.y > 440 && ball.y < HEAD) {
            ball.vx += ball.hook * h * Math.min(1, (ball.y - 440) / 150);
          }
          ball.x += ball.vx * h; ball.y += ball.vy * h; ball.rot += h * ball.vy / 30;
          ball.vy = Math.max(125, ball.vy - 9.5 * h);
          if (!ball.gutter && Math.abs(ball.x) > LW - 0.75) {
            ball.gutter = true; ball.vx = 0; ball.x = (ball.x > 0 ? 1 : -1) * (LW + 2.3);
            A().play('crowd_aww_soft');
          }
          if (ball.y > PITY + 30) { ball.on = false; ball.alpha = 0; }
          else if (ball.y > PITY) ball.alpha = Math.max(0, 1 - (ball.y - PITY) / 30);
          if (!ball.gutter) {
            var effMB = ball.effMass || MB;
            pins.forEach(function (p) {
              if (p.gone || Math.hypot(p.x - ball.x, p.y - ball.y) > BALL_R + PIN_R) return;
              /* Headpin Pocket vs Nose-Hit Split check on Ball 1 */
              if (p.id === 0 && !ball.hitHead && eng.state.data.ball === 1) {
                ball.hitHead = true;
                var offX = ball.x - p.x;
                if (Math.abs(offX) < 1.45) {
                  /* Dead-center nose hit: drives Pin 1 straight back, deflects ball & leaves corner split! */
                  ball.noseSplit = true;
                  effMB = MB * 0.52;
                } else if (Math.abs(offX) >= 1.45 && Math.abs(offX) <= 4.4 && ball.goodPower) {
                  /* True 1-3 or 1-2 Pocket hit with sweet-spot power! */
                  effMB = MB * 1.18;
                }
              }
              var j = hit(ball, effMB, p, MP, 0.68);
              if (p.id === 0 && ball.noseSplit) {
                /* Channel headpin straight into pin 5 so outer wing/corner pins stay standing as a split */
                p.vx *= 0.18;
                ball.vx *= 0.25;
                ball.vy *= 0.76;
              }
              if (!p.down && j / MP > 18) topple(p);
              if (j > 300) triggerShake(5, 0.2);
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
          if (p.z > 0 || p.vz > 0) {
            p.z += p.vz * h; p.vz -= 386 * h;
            if (p.z <= 0) { p.z = 0; p.vz = p.vz < -25 ? -p.vz * 0.3 : 0; }
          }
          if (p.y > HEAD - 30 && Math.abs(p.x) > KICK - PIN_R) {
            p.x = (p.x > 0 ? 1 : -1) * (KICK - PIN_R); p.vx = -p.vx * 0.55;
          }
          if (!p.down && Math.abs(p.x) > LW + 0.5) topple(p);
          if (p.y > PITY) {
            if (!p.down) topple(p);
            p.alpha = Math.max(0, p.alpha - h * 2);
            if (p.alpha <= 0) p.gone = true;
          }
        });
        for (var i = 0; i < pins.length; i++) {
          var a = pins[i];
          if (a.gone) continue;
          for (var j = 0; j < pins.length; j++) {
            if (i === j) continue;
            var b = pins[j];
            if (b.gone || b.down) continue;
            /* If Ball 1 was a dead-center nose hit, prevent outer corner pins (7 & 10, id 6 & 9) from getting swept by flukes */
            if (ball.noseSplit && (b.id === 6 || b.id === 9)) continue;
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

      /* ---------- Turns & Controls ---------- */
      function rack() { pins.forEach(rackPin); }
      function resetBall() {
        ball.x = eng.state.data.pos; ball.y = 6; ball.vx = 0; ball.vy = 0;
        ball.on = false; ball.gutter = false; ball.alpha = 1; ball.rot = 0; ball.hook = 0;
        ball.hitHead = false; ball.noseSplit = false; ball.goodPower = false; ball.effMass = MB;
        playedScatter = false;
      }
      function sweep() {
        sweepAnim = { active: true, t: 0, mode: 'sweep' };
        pins.forEach(function (p) { if (p.down) p.sweep = true; p.rollDown = false; });
      }
      function standing() {
        return pins.filter(function (p) { return !p.gone && !p.down && !p.sweep; }).length;
      }

      var STEP_TXT = {
        pos:   '1️⃣ STAND: Tap STOP to place your feet (off-center for pocket strikes)!',
        eff:   '2️⃣ AIM ANGLE: Tap STOP to aim through the lane arrows!',
        power: '3️⃣ POWER & HOOK: Tap STOP in the green sweet-spot to roll!'
      };

      function renderActionDock() {
        dock.innerHTML = '';
        var stopBtn = U().h('button', {
          type: 'button',
          class: 'gm-real3-btn green pulse',
          text: '✋ STOP! (Space)'
        });
        stopBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          lock();
        });
        dock.appendChild(stopBtn);
      }

      function setStage(stage) {
        var D = eng.state.data;
        D.stage = stage;
        bowlerAnim.state = 'step';
        bowlerAnim.t = 0;
        var pre = D.ball === 2 ? ('Ball 2 (' + standing() + ' pins left)') : 'Ball 1';
        updateBanner(STEP_TXT[stage], pre, true);
        renderActionDock();
      }

      function showTurn() {
        var t = eng.activeTeam(), D = eng.state.data;
        D.stage = 'idle'; D.ball = 1;
        bowlerAnim.state = 'idle'; bowlerAnim.t = 0;
        eng.setPhase('idle');
        rack(); resetBall();
        var frameNo = (cardData[eng.state.turn] ? cardData[eng.state.turn].length : 0) + 1;
        var frames = +ctx.cfg.frames || 3;
        updateBanner(t.name + '\u2019s Turn!', 'Frame ' + frameNo + ' of ' + frames, false);
        dock.innerHTML = '';
        var askBtn = U().h('button', {
          type: 'button',
          class: 'gm-real3-btn amber pulse',
          text: '❓ Ask & Bowl! (Space)'
        });
        askBtn.addEventListener('click', function () {
          A().play('tap');
          ask();
        });
        dock.appendChild(askBtn);
      }

      async function ask() {
        if (eng.state.phase !== 'idle' || !eng.state.alive) return;
        dock.innerHTML = '';
        var r = await eng.ask(null, { label: 'Frame ' + (eng.state.round + 1) });
        if (!eng.state.alive) return;
        if (r.cancelled) { showTurn(); return; }
        var D = eng.state.data;
        var t = eng.activeTeam();
        if (!r.ok) {
          /* Soft-fail: gentle shrug, "Nice try!", zero points lost, no harsh gutter penalty */
          eng.setPhase('animating');
          D.stage = 'idle';
          bowlerAnim.state = 'shrug';
          bowlerAnim.t = 0;
          A().play('crowd_aww_soft');
          var fp = P(0, 0.05, 0.3);
          var lRect = lane.getBoundingClientRect();
          var fakeEl = { getBoundingClientRect: function () { return { left: lRect.left + fp.x, top: lRect.top + fp.y, width: 0, height: 0 }; } };
          U().floatText('Nice try! 😊', fakeEl, 'soft');
          updateBanner('😊 Nice try, ' + t.name + '!', 'Next team is up!', false);
          await eng.wait(1500);
          if (!eng.state.alive) return;
          if (eng.advanceRound()) { eng.nextTurn(); showTurn(); }
          return;
        }
        eng.setPhase('action');
        D.pos = -14; D.posDir = 1;
        setStage('pos');
      }

      function lock() {
        var D = eng.state.data;
        if (eng.state.phase !== 'action' || !eng.state.alive) return;
        A().play('tap');
        if (D.stage === 'pos') {
          ball.x = D.pos;
          D.eff = -0.85; D.effDir = 1;
          setStage('eff');
        } else if (D.stage === 'eff') {
          D.pow = 0.08; D.powDir = 1;
          setStage('power');
        } else if (D.stage === 'power') {
          launch();
        }
      }

      eng.listen(lane, 'pointerdown', function (e) {
        if (eng.state.phase !== 'action') return;
        if (e.target && e.target.closest && e.target.closest('.gm-real3-dock')) return;
        e.preventDefault();
        lock();
      });
      eng.listen(document, 'keydown', function (e) {
        if (e.code !== 'Space' && e.key !== ' ') return;
        if (document.querySelector('.gm-over')) return;
        if (eng.state.phase === 'action') {
          e.preventDefault();
          lock();
        } else if (eng.state.phase === 'idle') {
          e.preventDefault();
          ask();
        }
      });

      async function launch() {
        var D = eng.state.data;
        dock.innerHTML = '';
        eng.setPhase('animating');

        /* 1. Bowler wind-up backswing anticipation (0.32s) */
        bowlerAnim.state = 'windup';
        bowlerAnim.t = 0;
        A().play('crowd_ooh');
        await eng.wait(320);
        if (!eng.state.alive) return;

        /* 2. Release ball & roll down lane with real launch angle + oil skid + backend hook */
        D.stage = 'roll';
        bowlerAnim.state = 'watch';
        bowlerAnim.t = 0;
        var g0 = LV.green[0], g1 = LV.green[1];
        var inGreen = (D.pow >= g0 && D.pow <= g1);
        var miss = D.pow < g0 ? (g0 - D.pow) : (D.pow > g1 ? (D.pow - g1) : 0);

        /* Real launch angle from Step 2 (D.eff * 12.5 deg) + timing release wobble if outside green zone */
        var wobbleDeg = inGreen
          ? ((Math.random() - 0.5) * 0.25 * LV.noise)
          : ((D.pow > g1 ? 1 : -1) * (1.2 + miss * 8.5) * LV.noise);
        var launchDeg = D.eff * 12.5 + wobbleDeg;
        var ang = launchDeg * DEG;

        var speed = 205 + D.pow * 185;
        ball.vx = Math.sin(ang) * speed;
        ball.vy = Math.cos(ang) * speed;

        /* Dry-backend hook (y = 440..720 in):
           - Green sweet-spot gives crisp backend hook back toward center / pocket
           - Red over-power (D.pow > g1 + 0.04) skids through oil without hooking
           - Weak power (D.pow < g0) loses carry mass and deflects off pins */
        ball.goodPower = (D.pow >= g0 - 0.04 && D.pow <= g1 + 0.03);
        ball.effMass = D.pow < g0 ? MB * (0.48 + 0.52 * (D.pow / g0)) : (D.pow > g1 + 0.05 ? MB * 0.82 : MB);
        if (D.pow > g1 + 0.04) {
          /* Over-powered shot skids flat! */
          ball.hook = -D.eff * 4;
        } else {
          /* Natural backend hook curves back opposite to stand offset / spin */
          var hookSign = Math.abs(D.pos) > 2.2 ? -Math.sign(D.pos) : -Math.sign(D.eff || 1);
          var hookMag = (inGreen ? 26 : 16) * (0.35 + 0.65 * Math.min(1, Math.abs(D.pos) / 12 + Math.abs(D.eff) * 0.6));
          ball.hook = hookSign * hookMag;
        }

        ball.on = true;
        slowEnd = -1;
        updateBanner('🎳 ' + eng.activeTeam().name + ' rolls!', inGreen ? '🔥 Sweet-Spot Hook!' : (D.pow > g1 ? '💨 Over-Powered Skid!' : '🎳 Watch the pins!'), true);
        A().play('bowling_rumble_long');
        A().play('bowling_roll');

        var t0 = simT;
        while (eng.state.alive) {
          await eng.wait(90);
          if (simT - t0 > 0.95 && (settled() || (ball.y > PITY && simT - t0 > 1.85))) break;
          if (simT - t0 > 2.8) break;
        }
        if (!eng.state.alive) return;
        afterBall();
      }

      async function afterBall() {
        var D = eng.state.data;
        var n = pins.filter(function (p) { return p.rollDown; }).length;
        var left = pins.filter(function (p) { return !p.down; }).length;
        var pts = n * 5;
        var strike = D.ball === 1 && left === 0;
        var spare = D.ball === 2 && left === 0;
        var deckPos = P(0, V_(HEAD), 0.2);

        if (strike) {
          pts += 20;
          bowlerAnim.state = 'celebrate';
          crowdCheerT = 1.8;
          A().play('bowling_strike');
          A().play('crowd_roar_big');
          A().play('sparkle');
          if (hal) A().play('ghost_woo');
          triggerShake(6, 0.28);
          burstPinLight(deckPos.x, deckPos.y, 42, true);
          U().confetti(38);
          say('STRIKE! 🌟', '#fde047');
          updateBanner('🌟 POCKET STRIKE! All 10 pins!', '+' + pts + ' points!', false);
        } else if (spare) {
          pts += 10;
          bowlerAnim.state = 'celebrate';
          crowdCheerT = 1.4;
          A().play('bowling_strike');
          A().play('crowd_cheer_small');
          A().play('sparkle');
          triggerShake(5, 0.22);
          burstPinLight(deckPos.x, deckPos.y, 28, false);
          U().confetti(24);
          say('SPARE! ✨', '#4ade80');
          updateBanner('✨ SPARE! Cleared the deck!', '+' + pts + ' points!', false);
        } else if (n === 0) {
          bowlerAnim.state = 'shrug';
          A().play('crowd_aww_soft');
          say(ball.gutter ? 'GUTTER!' : 'MISS!', '#fb923c');
          updateBanner(ball.gutter ? '🌀 Gutter ball! Watch your angle!' : '😮 Missed the pins!', D.ball === 1 ? 'Ball 2 coming up!' : 'Nice effort!', false);
        } else {
          bowlerAnim.state = 'celebrate';
          crowdCheerT = 1.0;
          A().play(n >= 6 ? 'crowd_cheer_small' : 'crowd_ooh');
          triggerShake(4, 0.16);
          burstPinLight(deckPos.x, deckPos.y, 18, false);
          var split = D.ball === 1 && (ball.noseSplit || isSplit());
          say(split ? 'SPLIT! ⚡' : (n + (n === 1 ? ' PIN!' : ' PINS!')), split ? '#fb923c' : '#38bdf8');
          updateBanner(split ? ('⚡ Headpin Split! ' + n + ' pins down!') : ('🎳 ' + n + (n === 1 ? ' pin' : ' pins') + ' down!'), '+' + pts + ' points!', false);
        }

        var fr = cardData[eng.state.turn];
        if (D.ball === 1) {
          fr.push([strike ? 'X' : (n === 0 ? '-' : String(n))]);
        } else if (fr.length) {
          fr[fr.length - 1][1] = spare ? '/' : (n === 0 ? '-' : String(n));
        }

        /* Position virtual deck element at pin deck screen coords for U().floatText */
        var lRect = lane.getBoundingClientRect();
        deck.style.left = Math.round(deckPos.x) + 'px';
        deck.style.top = Math.round(deckPos.y) + 'px';

        if (pts > 0) {
          A().play('coin_collect');
          bwlFlyScoreToPod({ x: lRect.left + deckPos.x, y: lRect.top + deckPos.y }, eng.state.turn, pts);
          eng.award(eng.state.turn, pts, deck, (strike ? 'STRIKE +' : spare ? 'SPARE +' : '+') + pts);
          U().wobble(document.getElementById('gm-team-' + eng.state.turn));
        } else if (D.ball === 2 && left === 10) {
          /* Guarantee minimum +5 points after a right answer */
          A().play('coin_collect');
          bwlFlyScoreToPod({ x: lRect.left + deckPos.x, y: lRect.top + deckPos.y }, eng.state.turn, 5);
          eng.award(eng.state.turn, 5, deck, 'Nice try! +5');
        }

        await eng.wait(1100);
        if (!eng.state.alive) return;

        if (D.ball === 1 && !strike) {
          sweep();
          await eng.wait(480);
          if (!eng.state.alive) return;
          D.ball = 2;
          resetBall();
          eng.setPhase('action');
          D.pos = -14; D.posDir = 1;
          setStage('pos');
          return;
        }

        sweep();
        await eng.wait(420);
        if (!eng.state.alive) return;
        if (eng.advanceRound()) {
          eng.nextTurn();
          showTurn();
        }
      }

      function isSplit() {
        var up = pins.filter(function (p) { return !p.down; });
        if (pins[0].down !== true || up.length < 2) return false;
        up.sort(function (a, b) { return a.x - b.x; });
        for (var i = 1; i < up.length; i++) if (up[i].x - up[i - 1].x > 13) return true;
        return false;
      }

      /* ---------- 60fps Delta-Time Loop ---------- */
      eng.raf(function (dt, now) {
        var D = eng.state.data;
        bowlerAnim.t += dt;
        if (crowdCheerT > 0) crowdCheerT = Math.max(0, crowdCheerT - dt);
        if (sweepAnim.active) {
          sweepAnim.t += dt * 1.65;
          if (sweepAnim.t >= 1) sweepAnim.active = false;
        }

        if (eng.state.phase === 'action') {
          if (D.stage === 'pos') {
            D.pos += D.posDir * dt * 28 * LV.s;
            if (D.pos > 18.5) { D.pos = 18.5; D.posDir = -1; }
            if (D.pos < -18.5) { D.pos = -18.5; D.posDir = 1; }
            ball.x = D.pos;
          } else if (D.stage === 'eff') {
            D.eff += D.effDir * dt * 1.85 * LV.s;
            if (D.eff > 1) { D.eff = 1; D.effDir = -1; }
            if (D.eff < -1) { D.eff = -1; D.effDir = 1; }
          } else if (D.stage === 'power') {
            D.pow += D.powDir * dt * 1.55 * LV.s;
            if (D.pow > 1) { D.pow = 1; D.powDir = -1; }
            if (D.pow < 0) { D.pow = 0; D.powDir = 1; }
          }
        }

        var sdt = (slowEnd > 0 && simT < slowEnd) ? dt * 0.33 : dt;
        var n = Math.max(1, Math.ceil(sdt / (1 / 480)));
        for (var i = 0; i < n; i++) simStep(sdt / n);

        pins.forEach(function (p) {
          if (p.drop > 0) p.drop = Math.max(0, p.drop - dt * 3.2);
          if (p.sweep && !p.gone) {
            p.alpha -= dt * 2.5;
            if (p.alpha <= 0) p.gone = true;
          }
        });

        /* Smooth camera follow down the lane behind the rolling ball */
        if (D.stage === 'roll' && (ball.on || !settled())) {
          var prog = Math.min(1, Math.max(0, ball.y / (HEAD - 40)));
          cam.tv = prog * 0.38;
          cam.tzoom = 1 + prog * 0.34;
          cam.tu = U_(ball.x) * 0.25 * (1 - prog * 0.6);
        } else {
          cam.tv = 0;
          cam.tzoom = 1.0;
          cam.tu = 0;
        }
        var camEase = Math.min(1, dt * 4.5);
        cam.v += (cam.tv - cam.v) * camEase;
        cam.u += (cam.tu - cam.u) * camEase;
        cam.zoom += (cam.tzoom - cam.zoom) * camEase;

        var shakeX = 0, shakeY = 0;
        if (cam.shakeT > 0) {
          cam.shakeT = Math.max(0, cam.shakeT - dt);
          shakeX = (Math.random() * 2 - 1) * cam.shakeMag;
          shakeY = (Math.random() * 2 - 1) * cam.shakeMag;
        }

        lightSplinters = lightSplinters.filter(function (sp) {
          sp.t += dt;
          sp.vy += 420 * dt;
          sp.x += sp.vx * dt;
          sp.y += sp.vy * dt;
          sp.rot += sp.vrot * dt;
          return sp.t < sp.life;
        });

        g.save();
        g.clearRect(0, 0, W, H);
        g.translate(shakeX, shakeY);

        drawLane(now);

        var things = pins.filter(function (p) { return !p.gone; }).map(function (p) {
          return { y: p.y, f: function () { drawPin(p, now); } };
        });
        things.push({ y: ball.y + 0.01, f: drawBall });
        things.sort(function (a, b) { return b.y - a.y; }).forEach(function (t) { t.f(); });

        drawSweepBar();
        drawStandAndAimGuides(now);
        drawBowlerAndBuddy(now);

        /* Light splinters (never wood splinters) */
        lightSplinters.forEach(function (sp) {
          g.save();
          g.globalAlpha = Math.max(0, 1 - sp.t / sp.life);
          g.translate(sp.x, sp.y);
          g.rotate(sp.rot);
          g.strokeStyle = sp.c;
          g.lineWidth = 4;
          g.lineCap = 'round';
          g.beginPath();
          g.moveTo(-sp.len / 2, 0);
          g.lineTo(sp.len / 2, 0);
          g.stroke();
          g.fillStyle = '#ffffff';
          g.beginPath(); g.arc(0, 0, sp.r * 0.5, 0, Math.PI * 2); g.fill();
          g.restore();
        });

        drawMeter();
        drawEffect();
        drawScoreboard();
        drawPop(now);

        g.restore();
        return true;
      });

      if (/[?&]test=1/.test(root.location.search)) {
        root.__bd = eng.state.data;
        root.__bsim = { pins: pins, ball: ball, step: simStep, rack: rack, LV: LV };
      }
      eng.setTurn(0, true);
      showTurn();
    }
  };
})(window);
