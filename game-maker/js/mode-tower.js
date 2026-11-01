/* ============================================================================
 * Game Maker — Mode: Tower Stack (mode-tower.js — Pro Skill Precision Edition)
 * Crane swings blocks horizontally above the tower with progressive speed & wind.
 * - True Progressive Slicing: Overhanging edges are permanently sliced off! Your
 *   next block is strictly as wide as what remains of the top block.
 * - 🌟 Perfect Drop (<8px alignment): Snaps flush, awards +15 pts, and restores
 *   +10px of block width!
 * - Missing the tower drops the block into the abyss for 0 points!
 * ============================================================================ */
(function () {
  'use strict';

  var GM = window.GM;
  var U = function () { return GM.u; };
  var A = function () { return GM.audio; };
  var J = function () { return GM.juice; };

  var COLORS = ['#38bdf8', '#f59e0b', '#4ade80', '#f43f5e', '#a855f7', '#facc15'];

  GM.modes.tower = {
    id: 'tower',
    name: 'Tower Stack',
    e: '🏗️',
    desc: 'Answer a question, then time the fast-swinging crane to stack blocks! Overhangs get sliced off permanently — hit a Perfect Drop to widen your tower!',
    fields: [
      { key: 'blocks', k: 'blocks', label: 'Blocks per answer', l: 'Blocks per answer', opts: [[2, '2 blocks'], [3, '3 blocks'], [4, '4 blocks']], def: 3 },
      { key: 'rounds', k: 'rounds', label: 'Rounds per team',   l: 'Rounds per team',   opts: [[2, '2 rounds'], [3, '3 rounds']], def: 2 },
      { key: 'speed',  k: 'speed',  label: 'Crane Speed',       l: 'Crane Speed',       opts: [['normal', 'Pro Crane'], ['fast', 'Turbo Wind']], def: 'normal' }
    ],

    start: function (ctx) {
      var T = GM.state.teams;
      var blocksPerTurn = +ctx.cfg.blocks || 3;
      var roundsPerTeam = +ctx.cfg.rounds || 2;
      var speedMul = ctx.cfg.speed === 'fast' ? 1.35 : 1.0;
      var totalTurns = T.length * roundsPerTeam;

      var turn = 0;
      var turnsDone = 0;
      var phase = 'ask'; // 'ask' | 'drop' | 'falling' | 'ended'
      var blocksLeft = 0;
      var perfectStreak = 0;
      var rafId = 0;

      // Each team has its own persistent tower of stacked blocks
      var towers = T.map(function (t) {
        return [{ x: 350, w: 195, color: t.color }];
      });

      var craneT = 0;
      var topSquash = 0;
      var activeBlock = { x: 350, y: 72, vy: 0, w: 195, color: '#38bdf8' };
      var slicedPieces = [];

      var wrap = U().h('div', { class: 'gm-tow-wrap' });
      var info = U().h('div', { class: 'gm-info' });
      var stage = U().h('div', { class: 'gm-tow-stage' });
      var badge = U().h('div', { class: 'gm-tow-badge' }, ['🏗️ Tower Height: 1']);
      var canvas = U().h('canvas', { class: 'gm-tow-canvas', width: 900, height: 420 });
      var controls = U().h('div', { class: 'gm-tow-controls' });
      var barWrap = U().h('div', {});

      stage.appendChild(badge);
      stage.appendChild(canvas);
      stage.appendChild(controls);
      wrap.appendChild(info);
      wrap.appendChild(stage);
      wrap.appendChild(barWrap);
      ctx.root.appendChild(wrap);

      var g = canvas.getContext('2d');
      var hookImg = new Image(); hookImg.src = 'art/o_crane_hook.webp';
      var blkAImg = new Image(); blkAImg.src = 'art/o_block_a.webp';
      var blkBImg = new Image(); blkBImg.src = 'art/o_block_b.webp';
      var towDust = [];

      canvas.addEventListener('pointerdown', function () {
        if (phase === 'drop') dropBlock();
      });

      function prepareNextBlock() {
        var stack = towers[turn];
        var topBlock = stack[stack.length - 1];
        /* Strict progressive width: next block is ONLY as wide as the current top block! */
        var nextW = Math.max(24, topBlock.w);
        craneT = (Math.random() * 2 - 1) * 1.5;
        activeBlock = {
          x: 350 + Math.sin(craneT) * 215,
          y: 74,
          vy: 0,
          w: nextW,
          color: COLORS[(stack.length + turn) % COLORS.length]
        };
      }

      function renderHud() {
        var t = T[turn];
        var stack = towers[turn];
        var topW = Math.round(stack[stack.length - 1].w);
        var roundNum = Math.floor(turnsDone / T.length) + 1;
        badge.textContent = '🏗️ ' + t.name + ': ' + stack.length + ' floors · Width: ' + topW + 'px';

        info.innerHTML = '';
        info.appendChild(U().h('div', { class: 'gm-turn-pill', style: '--tc:' + t.color }, [
          U().monFace(t.mon, 40),
          U().h('span', {}, [t.name + (phase === 'drop' ? ' — Time the Crane! (' + blocksLeft + ' left)' : ' — Tower Stack')])
        ]));
        info.appendChild(U().h('div', { class: 'gm-Meta' }, ['Round ' + Math.min(roundNum, roundsPerTeam) + ' / ' + roundsPerTeam]));

        controls.innerHTML = '';
        if (phase === 'ask') {
          controls.appendChild(U().btn('❓ Question', 'gm-btn gm-btn-go', doAsk));
        } else if (phase === 'drop') {
          controls.appendChild(U().btn('⬇️ DROP BLOCK! (' + blocksLeft + ')', 'gm-btn gm-btn-go', dropBlock));
        }

        U().teamBar(T, turn);
      }

      async function doAsk() {
        if (phase !== 'ask') return;
        var item = ctx.nextItem();
        var res = await U().ask(item, T[turn], {
          timer: +ctx.cfg.timer || 0,
          label: T[turn].name + ' — answer to get ' + blocksPerTurn + ' crane blocks!'
        });
        if (phase === 'ended') return;
        if (res.skipped) { doAsk(); return; }
        if (res.ok) {
          blocksLeft = blocksPerTurn;
          perfectStreak = 0;
          phase = 'drop';
          if (A()) A().play('crane_move');
          prepareNextBlock();
          renderHud();
        } else {
          if (J()) J().react(turn, 'sad');
          await U().sleep(400);
          nextTurn();
        }
      }

      function dropBlock() {
        if (phase !== 'drop') return;
        phase = 'falling';
        activeBlock.vy = 16;
        if (A()) { A().play('block_drop'); A().play('whoosh_soft'); }
        renderHud();
      }

      async function onBlockLanded() {
        if (phase !== 'falling') return;
        phase = 'resolving';
        var stack = towers[turn];
        var top = stack[stack.length - 1];
        var alignErr = Math.abs(activeBlock.x - top.x);
        var isPerfect = alignErr <= 8;

        var leftA = activeBlock.x - activeBlock.w / 2;
        var rightA = activeBlock.x + activeBlock.w / 2;
        var leftB = top.x - top.w / 2;
        var rightB = top.x + top.w / 2;

        var overlapLeft = Math.max(leftA, leftB);
        var overlapRight = Math.min(rightA, rightB);
        var overlapW = overlapRight - overlapLeft;

        if (isPerfect) {
          /* Perfect Drop! Snaps flush to top block and restores +10px width! */
          perfectStreak++;
          var grownW = Math.min(200, top.w + 10);
          stack.push({
            x: top.x,
            w: grownW,
            color: activeBlock.color
          });
          topSquash = 1.25;
          var perfPts = 15 + (perfectStreak > 1 ? 5 : 0);
          if (A()) { A().play('block_land'); A().play('sparkle'); A().play('coin_collect'); }
          for (var pi = 0; pi < 28; pi++) {
            towDust.push({ x: top.x + 100 + (Math.random() - 0.5) * grownW, y: activeBlock.y, vx: (Math.random() - 0.5) * 7, vy: -Math.random() * 5 - 1, r: 4 + Math.random() * 5, color: '#fde047', life: 1 });
          }
          U().floatText('🌟 PERFECT! +' + perfPts + ' (+Width!)', stage, 'good');
          U().addScore(turn, perfPts);
        } else if (overlapW >= 18) {
          /* Partial overlap: slice off the overhanging piece permanently! */
          perfectStreak = 0;
          if (leftA < overlapLeft) {
            slicedPieces.push({ x: (leftA + overlapLeft) / 2, y: activeBlock.y, w: overlapLeft - leftA, vy: 3, color: activeBlock.color });
          }
          if (rightA > overlapRight) {
            slicedPieces.push({ x: (overlapRight + rightA) / 2, y: activeBlock.y, w: rightA - overlapRight, vy: 3, color: activeBlock.color });
          }
          stack.push({
            x: (overlapLeft + overlapRight) / 2,
            w: overlapW,
            color: activeBlock.color
          });
          topSquash = 1;
          var pctKept = overlapW / activeBlock.w;
          var pts = pctKept >= 0.75 ? 10 : 5;
          if (A()) { A().play('block_land'); A().play('wood_knock'); A().play('coin_collect'); A().play('tower_wobble'); }
          for (var di = 0; di < 18; di++) {
            towDust.push({ x: (overlapLeft + overlapRight) / 2 + 100 + (Math.random() - 0.5) * overlapW, y: activeBlock.y, vx: (Math.random() - 0.5) * 6, vy: -Math.random() * 4 - 1, r: 4 + Math.random() * 4, color: di % 2 ? activeBlock.color : '#fde047', life: 1 });
          }
          U().floatText('✂️ SLICED! +' + pts + ' (' + Math.round(overlapW) + 'px left)', stage, 'good');
          U().addScore(turn, pts);
        } else {
          /* Missed the tower or too thin (<18px) — block tumbles off for 0 points! */
          perfectStreak = 0;
          slicedPieces.push({ x: activeBlock.x, y: activeBlock.y, w: activeBlock.w, vy: 5, color: activeBlock.color });
          if (A()) A().play('tower_fall');
          U().floatText('💥 MISSED TOWER! (0 pts)', stage, 'bad');
          /* If top block was shaved too thin, reset top block slightly so next turn isn't impossible */
          if (top.w < 36 && stack.length > 1) {
            stack.pop();
            U().floatText('⚠️ Top floor crumbled!', stage, 'bad');
          }
        }

        blocksLeft--;
        U().teamBar(T, turn);

        if (blocksLeft > 0) {
          phase = 'drop';
          prepareNextBlock();
          renderHud();
        } else {
          await U().sleep(520);
          if (phase === 'ended') return;
          nextTurn();
        }
      }

      function nextTurn() {
        turnsDone++;
        if (turnsDone >= totalTurns) {
          phase = 'ended';
          if (A()) A().play('cheer_kids');
          ctx.end();
          return;
        }
        turn = (turn + 1) % T.length;
        phase = 'ask';
        prepareNextBlock();
        renderHud();
      }

      function drawRoundedBlock(bx, by, bw, bh, color, idx) {
        g.save();
        var spr = (idx % 2 === 0) ? blkAImg : blkBImg;
        if (spr && spr.complete && spr.naturalWidth) {
          g.drawImage(spr, bx - bw / 2, by - bh - 3, bw, bh + 6);
        }
        g.fillStyle = color;
        g.globalAlpha = (spr && spr.complete && spr.naturalWidth) ? 0.55 : 1;
        g.beginPath();
        g.roundRect(bx - bw / 2, by - bh, bw, bh, 8);
        g.fill();
        g.globalAlpha = 1;
        g.strokeStyle = '#ffffff';
        g.lineWidth = 2.5;
        g.stroke();
        g.fillStyle = 'rgba(255,255,255,0.34)';
        g.fillRect(bx - bw / 2 + 6, by - bh + 4, Math.max(0, bw - 12), 7);
        g.restore();
      }

      function loop() {
        if (phase === 'ended') return;
        var W = canvas.width;
        var H = canvas.height;
        g.clearRect(0, 0, W, H);

        var stack = towers[turn];
        var blockH = 32;
        var baseLineY = H - 24;
        var camOffsetY = Math.max(0, (stack.length - 6) * blockH);

        g.fillStyle = 'rgba(15, 23, 42, 0.55)';
        g.fillRect(0, baseLineY + camOffsetY, W, 40);

        if (topSquash > 0) topSquash = Math.max(0, topSquash - 0.08);
        for (var i = 0; i < stack.length; i++) {
          var b = stack[i];
          var by = baseLineY - i * blockH + camOffsetY;
          var isTop = (i === stack.length - 1 && topSquash > 0);
          var bwDraw = isTop ? b.w * (1 + topSquash * 0.12) : b.w;
          var bhDraw = isTop ? blockH * (1 - topSquash * 0.18) : blockH;
          drawRoundedBlock(b.x + 100, by, bwDraw, bhDraw, b.color, i);
        }

        /* Progressive crane swing speed increases with tower height! */
        var targetLandY = baseLineY - stack.length * blockH + camOffsetY;
        if (phase === 'drop' || phase === 'ask') {
          var heightSpd = (0.045 + Math.min(10, stack.length) * 0.0055) * speedMul;
          craneT += heightSpd;
          var swingRange = 215 + Math.min(45, stack.length * 4);
          activeBlock.x = 350 + Math.sin(craneT) * swingRange + Math.sin(craneT * 2.3) * 18;
          activeBlock.y = 82;
        } else if (phase === 'falling') {
          activeBlock.y += activeBlock.vy;
          activeBlock.vy += 0.95;
          if (activeBlock.y >= targetLandY) {
            activeBlock.y = targetLandY;
            onBlockLanded();
          }
        }

        g.save();
        g.fillStyle = 'rgba(255,255,255,0.75)';
        g.strokeStyle = 'rgba(255,255,255,0.3)';
        g.font = '800 12px sans-serif';
        for (var m = 1; m <= 14; m++) {
          var ry = baseLineY - m * blockH + camOffsetY;
          if (ry > 16 && ry < H - 10) {
            g.beginPath(); g.moveTo(14, ry); g.lineTo(42, ry); g.stroke();
            g.fillText((m * 10) + 'm', 46, ry + 4);
          }
        }
        g.restore();

        var craneScreenX = activeBlock.x + 100;
        g.strokeStyle = '#fde047';
        g.lineWidth = 5;
        g.beginPath();
        g.moveTo(craneScreenX, 0);
        g.lineTo(craneScreenX, 42);
        g.stroke();
        if (hookImg.complete && hookImg.naturalWidth) {
          g.drawImage(hookImg, craneScreenX - 26, 22, 52, 52);
        } else {
          g.fillStyle = '#f59e0b';
          g.beginPath(); g.arc(craneScreenX, 48, 12, 0, Math.PI * 2); g.fill();
        }
        for (var di = towDust.length - 1; di >= 0; di--) {
          var pt = towDust[di];
          pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.18; pt.life -= 0.03;
          if (pt.life <= 0) { towDust.splice(di, 1); continue; }
          g.save();
          g.globalAlpha = Math.max(0, pt.life);
          g.fillStyle = pt.color;
          g.beginPath(); g.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2); g.fill();
          g.restore();
        }

        if (phase === 'drop' || phase === 'falling') {
          drawRoundedBlock(activeBlock.x + 100, activeBlock.y, activeBlock.w, blockH, activeBlock.color, stack.length);
        }

        for (var k = slicedPieces.length - 1; k >= 0; k--) {
          var sp = slicedPieces[k];
          sp.y += sp.vy;
          sp.vy += 0.7;
          drawRoundedBlock(sp.x + 100, sp.y, sp.w, blockH, sp.color);
          if (sp.y > H + 60) slicedPieces.splice(k, 1);
        }

        rafId = requestAnimationFrame(loop);
      }

      ctx.onEnd(function () {
        phase = 'ended';
        if (rafId) cancelAnimationFrame(rafId);
      });

      prepareNextBlock();
      renderHud();
      rafId = requestAnimationFrame(loop);
    }
  };
})();
