/* ============================================================================
 * Game Maker — Mode: Snakes and Ladders (mode-snakes.js)
 * Winding board of 20 or 30 squares with ladders going up and friendly snakes
 * sliding down. Right answer = roll the 3D dice (1-6), move step-by-step (+5 min).
 * Ladder = +10 bonus! Snake = funny slide, 0 points lost! First to finish = +50!
 * ============================================================================ */
(function () {
  'use strict';

  var GM = window.GM;
  var U = function () { return GM.u; };
  var A = function () { return GM.audio; };
  var J = function () { return GM.juice; };

  var TILE_COLORS = ['#fef08a', '#bae6fd', '#bbf7d0', '#fecdd3', '#e9d5ff', '#fed7aa'];
  var DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  GM.modes.snakes = {
    id: 'snakes',
    name: 'Snakes & Ladders',
    e: '🎲',
    desc: 'Answer a question to roll the big dice, climb ladders, and race to the finish square!',
    fields: [
      { k: 'len', l: 'Board length', opts: [[20, '20 squares'], [30, '30 squares']], def: 30 }
    ],

    start: function (ctx) {
      var T = GM.state.teams;
      var totalSq = +ctx.cfg.len || 30;
      var cols = 6;
      var rows = Math.ceil(totalSq / cols);

      var ladders = totalSq === 20
        ? { 3: 11, 8: 16, 13: 19 }
        : { 3: 14, 8: 19, 15: 26, 21: 28 };
      var snakes = totalSq === 20
        ? { 14: 5, 18: 10 }
        : { 12: 4, 23: 11, 29: 18 };

      var pos = T.map(function () { return 1; });
      var turn = 0;
      var phase = 'ask'; // 'ask' | 'roll' | 'moving' | 'ended'
      var turnsCount = 0;
      var maxTotalTurns = T.length * 14;

      if (A() && A().play) A().play('music_puzzle');

      var wrap = U().h('div', { class: 'gm-snk-wrap' });
      var info = U().h('div', { class: 'gm-info' });
      var main = U().h('div', { class: 'gm-snk-main' });
      var boardWrap = U().h('div', { class: 'gm-snk-board-wrap' });
      var grid = U().h('div', {
        class: 'gm-snk-grid',
        style: 'grid-template-columns:repeat(' + cols + ', 1fr);grid-template-rows:repeat(' + rows + ', 1fr);'
      });
      var side = U().h('div', { class: 'gm-snk-side' });
      var barWrap = U().h('div', {});

      var cellMap = {};
      var tokenSlots = {};

      // Build boustrophedon board (bottom row is 1..6 left-to-right, next row 7..12 right-to-left, etc.)
      for (var r = rows - 1; r >= 0; r--) {
        var rowFromBottom = (rows - 1) - r;
        var evenRow = (rowFromBottom % 2 === 0);
        for (var c = 0; c < cols; c++) {
          var sqNum = rowFromBottom * cols + (evenRow ? (c + 1) : (cols - c));
          var bgCol = TILE_COLORS[(sqNum - 1) % TILE_COLORS.length];
          var cell = U().h('div', {
            class: 'gm-snk-cell',
            style: 'background:' + bgCol + ';'
          });

          var topRow = U().h('div', { style: 'display:flex;justify-content:space-between;width:100%;align-items:center;' });
          topRow.appendChild(U().h('span', { class: 'gm-snk-num' }, [sqNum === totalSq ? '🏁 ' + sqNum : String(sqNum)]));

          if (ladders[sqNum]) {
            topRow.appendChild(U().h('span', { class: 'gm-snk-tag ladder' }, ['🪜 ↗' + ladders[sqNum]]));
          } else if (snakes[sqNum]) {
            topRow.appendChild(U().h('span', { class: 'gm-snk-tag snake' }, ['🐍 ↘' + snakes[sqNum]]));
          }

          var tokBox = U().h('div', { class: 'gm-snk-tokens' });
          cell.appendChild(topRow);
          cell.appendChild(tokBox);
          grid.appendChild(cell);

          cellMap[sqNum] = cell;
          tokenSlots[sqNum] = tokBox;
        }
      }

      var diceBox = U().h('div', {
        class: 'gm-snk-dice-box',
        onclick: function () {
          if (phase === 'roll') doRoll();
        }
      }, ['🎲']);
      var statusText = U().h('div', { style: 'font-size:22px;font-weight:900;line-height:1.25;' }, ['Answer a question to roll the dice!']);
      var actionSlot = U().h('div', {});

      side.appendChild(U().h('div', { style: 'font-size:24px;font-weight:900;color:#fde047;' }, ['🎲 Dice Roller']));
      side.appendChild(diceBox);
      side.appendChild(statusText);
      side.appendChild(actionSlot);

      boardWrap.style.position = 'relative';
      boardWrap.appendChild(grid);

      // Build SVG Visual Overlay for Wooden Ladders & Smiling Cartoon Snakes
      function sqCenter(sq) {
        var zero = sq - 1;
        var rowFromBottom = Math.floor(zero / cols);
        var r = (rows - 1) - rowFromBottom;
        var cInRow = zero % cols;
        var c = (rowFromBottom % 2 === 0) ? cInRow : (cols - 1 - cInRow);
        return { x: (c + 0.5) * (600 / cols), y: (r + 0.5) * (400 / rows) };
      }
      var svgParts = [];
      Object.keys(ladders).forEach(function (k) {
        var f = +k, t = ladders[k], p1 = sqCenter(f), p2 = sqCenter(t);
        var dx = p2.x - p1.x, dy = p2.y - p1.y, len = Math.hypot(dx, dy) || 1;
        var nx = (-dy / len) * 10, ny = (dx / len) * 10;
        svgParts.push('<line x1="' + (p1.x + nx) + '" y1="' + (p1.y + ny) + '" x2="' + (p2.x + nx) + '" y2="' + (p2.y + ny) + '" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>');
        svgParts.push('<line x1="' + (p1.x - nx) + '" y1="' + (p1.y - ny) + '" x2="' + (p2.x - nx) + '" y2="' + (p2.y - ny) + '" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>');
        var rungs = Math.max(4, Math.floor(len / 24));
        for (var s = 1; s < rungs; s++) {
          var u = s / rungs, rx = p1.x + dx * u, ry = p1.y + dy * u;
          svgParts.push('<line x1="' + (rx + nx) + '" y1="' + (ry + ny) + '" x2="' + (rx - nx) + '" y2="' + (ry - ny) + '" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>');
        }
      });
      var sCols = [['#ef4444', '#fca5a5'], ['#a855f7', '#d8b4fe'], ['#10b981', '#6ee7b7']];
      Object.keys(snakes).forEach(function (k, idx) {
        var h = +k, t = snakes[k], p1 = sqCenter(h), p2 = sqCenter(t);
        var mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
        var cx1 = (p1.x + mx) / 2 + 38, cy1 = (p1.y + my) / 2 - 16;
        var d = 'M ' + p1.x + ' ' + p1.y + ' Q ' + cx1 + ' ' + cy1 + ' ' + mx + ' ' + my + ' T ' + p2.x + ' ' + p2.y;
        var col = sCols[idx % sCols.length];
        svgParts.push('<path d="' + d + '" fill="none" stroke="rgba(0,0,0,0.35)" stroke-width="14" stroke-linecap="round"/>');
        svgParts.push('<path d="' + d + '" fill="none" stroke="' + col[0] + '" stroke-width="10" stroke-linecap="round"/>');
        svgParts.push('<path d="' + d + '" fill="none" stroke="' + col[1] + '" stroke-width="5" stroke-linecap="round" stroke-dasharray="7 9"/>');
        svgParts.push('<circle cx="' + p1.x + '" cy="' + p1.y + '" r="11" fill="' + col[0] + '" stroke="#fff" stroke-width="2"/>');
        svgParts.push('<circle cx="' + (p1.x - 3.5) + '" cy="' + (p1.y - 2) + '" r="2.2" fill="#fff"/><circle cx="' + (p1.x + 3.5) + '" cy="' + (p1.y - 2) + '" r="2.2" fill="#fff"/>');
      });
      var overlayHolder = U().h('div', { style: 'position:absolute;inset:0;pointer-events:none;z-index:3;' });
      overlayHolder.innerHTML = '<svg viewBox="0 0 600 400" preserveAspectRatio="none" style="width:100%;height:100%;display:block;">' + svgParts.join('') + '</svg>';
      boardWrap.appendChild(overlayHolder);
      main.appendChild(boardWrap);
      main.appendChild(side);

      wrap.appendChild(info);
      wrap.appendChild(main);
      wrap.appendChild(barWrap);
      ctx.root.appendChild(wrap);

      function renderTokens() {
        Object.keys(tokenSlots).forEach(function (k) {
          tokenSlots[k].innerHTML = '';
        });
        T.forEach(function (t, idx) {
          var sq = Math.max(1, Math.min(totalSq, pos[idx]));
          var slot = tokenSlots[sq];
          if (slot) {
            var tok = U().h('div', { class: 'gm-snk-tok', style: '--tc:' + t.color }, [
              U().monFace(t.mon, 34)
            ]);
            slot.appendChild(tok);
          }
        });
      }

      function renderHud() {
        var t = T[turn];
        info.innerHTML = '';
        info.appendChild(U().h('div', { class: 'gm-turn-pill', style: '--tc:' + t.color }, [
          U().monFace(t.mon, 40),
          U().h('span', {}, [t.name + ' — Square ' + pos[turn] + ' / ' + totalSq])
        ]));
        info.appendChild(U().h('div', { class: 'gm-Meta' }, ['Goal: Square ' + totalSq]));

        actionSlot.innerHTML = '';
        if (phase === 'ask') {
          statusText.textContent = t.name + ': Answer to unlock the dice!';
          actionSlot.appendChild(U().btn('❓ Question', 'gm-btn gm-btn-go', doAsk));
        } else if (phase === 'roll') {
          statusText.textContent = 'Tap the big dice to roll 1–6!';
          actionSlot.appendChild(U().btn('🎲 Roll Dice!', 'gm-btn gm-btn-go', doRoll));
        } else {
          statusText.textContent = 'Moving along the board...';
        }

        U().teamBar(T, turn);
      }

      async function doAsk() {
        if (phase !== 'ask') return;
        var item = ctx.nextItem();
        var res = await U().ask(item, T[turn], {
          timer: +ctx.cfg.timer || 0,
          label: T[turn].name + ' — answer to roll the dice!'
        });
        if (phase === 'ended') return;
        if (res.skipped) { doAsk(); return; }
        if (res.ok) {
          phase = 'roll';
          renderHud();
        } else {
          if (J()) J().react(turn, 'sad');
          await U().sleep(400);
          nextTurn();
        }
      }

      async function doRoll() {
        if (phase !== 'roll') return;
        phase = 'moving';
        renderHud();

        if (A()) A().play('dice_roll');
        diceBox.classList.add('rolling');
        for (var i = 0; i < 6; i++) {
          diceBox.textContent = DICE_FACES[U().rand(0, 5)];
          await U().sleep(65);
          if (phase === 'ended') return;
        }
        diceBox.classList.remove('rolling');
        var steps = U().rand(1, 6);
        diceBox.textContent = DICE_FACES[steps - 1] + ' ' + steps;

        // Step-by-step movement
        for (var s = 0; s < steps; s++) {
          if (pos[turn] < totalSq) {
            pos[turn]++;
            if (A()) A().play('step');
            renderTokens();
            await U().sleep(170);
            if (phase === 'ended') return;
          }
        }

        // Minimum +5 points for every right answer + 2 pts per square moved
        var movePts = Math.max(5, steps * 2);
        var landedCell = cellMap[pos[turn]] || boardWrap;
        U().floatText('+' + movePts, landedCell, 'good');
        U().addScore(turn, movePts);

        // Check ladder or snake
        var curSq = pos[turn];
        if (ladders[curSq]) {
          var destUp = ladders[curSq];
          statusText.textContent = '🪜 Ladder! Climb up to ' + destUp + '! (+10)';
          if (A()) A().play('ladder_up');
          await U().sleep(380);
          if (phase === 'ended') return;
          pos[turn] = destUp;
          renderTokens();
          U().floatText('🪜 +10!', cellMap[destUp] || boardWrap, 'good');
          U().addScore(turn, 10);
          if (J()) J().react(turn, 'big');
        } else if (snakes[curSq]) {
          var destDown = snakes[curSq];
          statusText.textContent = '🐍 Friendly snake slide to ' + destDown + '! (No points lost!)';
          if (A()) A().play('snake_slide');
          await U().sleep(380);
          if (phase === 'ended') return;
          pos[turn] = destDown;
          renderTokens();
          U().floatText('Wheee! 🐍', cellMap[destDown] || boardWrap, 'bad');
        }

        U().teamBar(T, turn);

        // Check win
        if (pos[turn] >= totalSq) {
          if (A()) A().play('win');
          U().floatText('🏁 WINNER! +50', cellMap[totalSq] || boardWrap, 'good');
          U().addScore(turn, 50);
          U().confetti(45);
          await U().sleep(950);
          if (phase !== 'ended') {
            phase = 'ended';
            ctx.end();
          }
          return;
        }

        await U().sleep(480);
        if (phase === 'ended') return;
        nextTurn();
      }

      function nextTurn() {
        turnsCount++;
        if (turnsCount >= maxTotalTurns) {
          phase = 'ended';
          ctx.end();
          return;
        }
        turn = (turn + 1) % T.length;
        phase = 'ask';
        renderHud();
      }

      ctx.onEnd(function () {
        phase = 'ended';
      });

      renderTokens();
      renderHud();
    }
  };
})();
