/* ============================================================================
 * Game Maker — Mode: Whack-a-Word (mode-whack.js)
 * 9 holes! Answer a question, then tap the popping target word bubbles for 15s!
 * Right tap = +5, wrong tap = funny bonk (0 lost), minimum +5 per right answer!
 * ============================================================================ */
(function () {
  'use strict';

  var GM = window.GM;
  var U = function () { return GM.u; };
  var A = function () { return GM.audio; };
  var J = function () { return GM.juice; };

  GM.modes.whack = {
    id: 'whack',
    name: 'Whack-a-Word',
    e: '🔨',
    desc: 'Answer a question, then tap the right word bubbles as they pop up!',
    fields: [
      { k: 'speed',  l: 'Pop-up speed',    opts: [['slow', 'Slow'], ['normal', 'Normal'], ['fast', 'Fast']], def: 'normal' },
      { k: 'rounds', l: 'Rounds per team', opts: [[1, '1 round'], [2, '2 rounds'], [3, '3 rounds']], def: 2 }
    ],

    start: function (ctx) {
      var T = GM.state.teams;
      var roundsPerTeam = +ctx.cfg.rounds || 2;
      var totalTurns = T.length * roundsPerTeam;
      var speedMode = ctx.cfg.speed || 'normal';
      var popIntervalMs = speedMode === 'fast' ? 620 : (speedMode === 'slow' ? 1050 : 820);
      var stayMs = speedMode === 'fast' ? 1350 : (speedMode === 'slow' ? 2100 : 1650);

      var turn = 0;
      var turnsDone = 0;
      var phase = 'ask'; // 'ask' | 'whack' | 'ended'
      var timers = [];
      var secTimer = 0;
      var popLoop = 0;
      var turnPoints = 0;
      var targets = [];
      var decoys = [];

      // Gather vocabulary pool from GM.state.pack
      var packItems = (GM.state.pack && GM.state.pack.items) ? GM.state.pack.items : [];
      var allWords = [];
      packItems.forEach(function (it) {
        if (it && it.a && allWords.indexOf(String(it.a)) === -1) allWords.push(String(it.a));
        if (it && Array.isArray(it.w)) {
          it.w.forEach(function (w) {
            if (w && allWords.indexOf(String(w)) === -1) allWords.push(String(w));
          });
        }
      });
      if (allWords.length < 6) {
        ['apple', 'banana', 'tiger', 'robot', 'castle', 'sunny', 'rocket', 'magic'].forEach(function (w) {
          if (allWords.indexOf(w) === -1) allWords.push(w);
        });
      }

      var wrap = U().h('div', { class: 'gm-whk-wrap' });
      var info = U().h('div', { class: 'gm-info' });
      var topbar = U().h('div', { class: 'gm-whk-topbar' });
      var targetsBox = U().h('div', { class: 'gm-whk-targets' });
      var timerEl = U().h('div', { class: 'gm-whk-timer' }, ['⏱ 15s']);
      topbar.appendChild(targetsBox);
      topbar.appendChild(timerEl);

      var board = U().h('div', { class: 'gm-whk-board' });
      var barWrap = U().h('div', {});

      var hammerEl = U().h('div', { class: 'gm-whk-hammer' }, [
        U().art('o_hammer', '🔨', '')
      ]);
      board.appendChild(hammerEl);
      if (U().hasArt && U().hasArt('o_bush')) {
        var bushL = U().art('o_bush', '', 'gm-whk-bush');
        bushL.style.cssText = 'position:absolute;bottom:6px;left:10px;width:58px;height:58px;pointer-events:none;z-index:1;opacity:0.9;';
        var bushR = U().art('o_bush', '', 'gm-whk-bush');
        bushR.style.cssText = 'position:absolute;bottom:6px;right:10px;width:58px;height:58px;pointer-events:none;z-index:1;opacity:0.9;';
        board.appendChild(bushL);
        board.appendChild(bushR);
      }
      board.addEventListener('pointermove', function (e) {
        var r = board.getBoundingClientRect();
        hammerEl.style.left = (e.clientX - r.left) + 'px';
        hammerEl.style.top = (e.clientY - r.top) + 'px';
      });

      var holes = [];
      for (var i = 0; i < 9; i++) {
        (function (idx) {
          var cell = U().h('div', { class: 'gm-whk-cell' });
          var holeBg = U().h('div', { class: 'gm-whk-hole' });
          var moleBtn = U().h('button', {
            class: 'gm-whk-mole',
            type: 'button',
            onclick: function (ev) { onWhackHole(idx, ev); }
          }, ['']);
          cell.appendChild(moleBtn);
          cell.appendChild(holeBg);
          board.appendChild(cell);
          holes.push({ idx: idx, cell: cell, mole: moleBtn, active: false, word: '', isTarget: false, hideTid: 0 });
        })(i);
      }

      wrap.appendChild(info);
      wrap.appendChild(topbar);
      wrap.appendChild(board);
      wrap.appendChild(barWrap);
      ctx.root.appendChild(wrap);

      function clearAllTimers() {
        if (secTimer) { clearInterval(secTimer); secTimer = 0; }
        if (popLoop) { clearInterval(popLoop); popLoop = 0; }
        timers.forEach(function (id) { clearTimeout(id); });
        timers = [];
        holes.forEach(function (h) {
          if (h.hideTid) { clearTimeout(h.hideTid); h.hideTid = 0; }
          h.active = false;
          h.mole.className = 'gm-whk-mole';
        });
      }

      ctx.onEnd(function () {
        phase = 'ended';
        clearAllTimers();
      });

      function pickTargets(firstAnswer) {
        var pool = U().shuffle(allWords.slice());
        targets = [];
        if (firstAnswer) targets.push(String(firstAnswer));
        for (var i = 0; i < pool.length && targets.length < 3; i++) {
          if (targets.indexOf(pool[i]) === -1) targets.push(pool[i]);
        }
        decoys = pool.filter(function (w) { return targets.indexOf(w) === -1; });
        if (!decoys.length) decoys = ['oops!', 'try again', 'bonk!'];
      }

      function renderTargetsBar() {
        targetsBox.innerHTML = '';
        targetsBox.appendChild(U().h('span', { class: 'gm-whk-target-label' }, ['🎯 WHACK THESE WORDS:']));
        targets.forEach(function (w) {
          targetsBox.appendChild(U().h('span', { class: 'gm-whk-chip' }, [w]));
        });
      }

      function renderHud() {
        var t = T[turn];
        var roundNum = Math.floor(turnsDone / T.length) + 1;
        info.innerHTML = '';
        info.appendChild(U().h('div', { class: 'gm-turn-pill', style: '--tc:' + t.color }, [
          U().monFace(t.mon, 40),
          U().h('span', {}, [t.name + (phase === 'whack' ? ' — Tap the target words!' : ' — Get Ready!')])
        ]));
        info.appendChild(U().h('div', { class: 'gm-Meta' }, ['Round ' + Math.min(roundNum, roundsPerTeam) + ' / ' + roundsPerTeam]));
        if (phase === 'ask') {
          info.appendChild(U().btn('❓ Question', 'gm-btn gm-btn-go', doAsk));
        } else if (phase === 'whack') {
          info.appendChild(U().btn('⏭ Finish Turn', 'gm-btn', finishWhackTurn));
        }

        U().teamBar(T, turn);
      }

      async function doAsk() {
        if (phase !== 'ask') return;
        var item = ctx.nextItem();
        var res = await U().ask(item, T[turn], {
          timer: +ctx.cfg.timer || 0,
          label: T[turn].name + ' — answer to start 15s of Whack-a-Word!'
        });
        if (phase === 'ended') return;
        if (res.skipped) { doAsk(); return; }
        if (res.ok) {
          pickTargets(item.a);
          renderTargetsBar();
          startWhackRound();
        } else {
          if (J()) J().react(turn, 'sad');
          await U().sleep(400);
          nextTurn();
        }
      }

      function spawnMole() {
        if (phase !== 'whack') return;
        var free = holes.filter(function (h) { return !h.active; });
        if (!free.length) return;
        var h = free[U().rand(0, free.length - 1)];
        var isTarget = Math.random() < 0.62;
        var word = isTarget
          ? targets[U().rand(0, targets.length - 1)]
          : decoys[U().rand(0, decoys.length - 1)];

        h.active = true;
        h.isTarget = isTarget;
        h.word = word;
        h.mole.innerHTML = '';
        var monBuddy = U().monFace(T[(h.idx + turn) % T.length].mon, 42);
        monBuddy.style.cssText = 'position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);pointer-events:none;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.45));';
        if (U().hasArt && U().hasArt('o_word_bubble')) {
          var bubArt = U().art('o_word_bubble', '', 'gm-whk-bub-art');
          bubArt.style.cssText = 'position:absolute;inset:-4px;width:calc(100% + 8px);height:calc(100% + 8px);object-fit:contain;pointer-events:none;z-index:0;opacity:0.28;';
          h.mole.appendChild(bubArt);
        }
        var wordSpan = U().h('span', { style: 'position:relative;z-index:2;display:block;padding-bottom:8px;' }, [word]);
        h.mole.appendChild(wordSpan);
        h.mole.appendChild(monBuddy);
        h.mole.className = 'gm-whk-mole up';
        if (J() && J().squash) J().squash(h.mole, 1.16, 0.86, 180);
        if (A()) { A().play('pop_up'); A().play('bubble_pop'); }

        h.hideTid = setTimeout(function () {
          if (!h.active) return;
          h.active = false;
          h.mole.className = 'gm-whk-mole';
          if (A()) A().play('whack_hide');
        }, stayMs);
      }

      function onWhackHole(idx, ev) {
        if (phase !== 'whack') return;
        var h = holes[idx];
        if (!h || !h.active) return;
        h.active = false;
        if (h.hideTid) { clearTimeout(h.hideTid); h.hideTid = 0; }

        // Move hammer sprite over the tapped hole
        var bRect = board.getBoundingClientRect();
        var cRect = h.cell.getBoundingClientRect();
        hammerEl.style.left = (cRect.left - bRect.left + cRect.width * 0.5) + 'px';
        hammerEl.style.top = (cRect.top - bRect.top + cRect.height * 0.4) + 'px';
        hammerEl.classList.add('swing');
        setTimeout(function () { hammerEl.classList.remove('swing'); }, 150);

        if (A()) { A().play('whack_hit'); A().play('wood_knock'); }

        if (h.isTarget) {
          if (A()) { A().play('sparkle'); A().play('coin_collect'); }
          if (J() && J().squash) J().squash(h.mole, 1.25, 0.76, 200);
          h.mole.className = 'gm-whk-mole up hit-good';
          turnPoints += 5;
          U().floatText('+5', h.mole, 'good');
          U().addScore(turn, 5);
          U().teamBar(T, turn);
        } else {
          if (A()) A().play('answer_soft');
          h.mole.className = 'gm-whk-mole up hit-bad';
          U().wobble(h.mole);
          U().floatText('Bonk!', h.mole, 'bad');
        }

        var tid = setTimeout(function () {
          h.mole.className = 'gm-whk-mole';
        }, 220);
        timers.push(tid);
      }

      function startWhackRound() {
        phase = 'whack';
        turnPoints = 0;
        var secsLeft = 15;
        timerEl.textContent = '⏱ ' + secsLeft + 's';
        renderHud();

        // Spawn 2 initial word bubbles immediately so pupil can tap right away
        spawnMole();
        spawnMole();

        popLoop = setInterval(function () {
          spawnMole();
        }, popIntervalMs);

        secTimer = setInterval(function () {
          secsLeft--;
          timerEl.textContent = '⏱ ' + Math.max(0, secsLeft) + 's';
          if (secsLeft <= 0) {
            finishWhackTurn();
          }
        }, 1000);
      }

      async function finishWhackTurn() {
        if (phase !== 'whack') return;
        phase = 'ask';
        clearAllTimers();

        // Every action turn after a right answer gives at least 5 points!
        if (turnPoints < 5) {
          var diff = 5 - turnPoints;
          U().floatText('Good try! +' + diff, board, 'good');
          U().addScore(turn, diff);
        }
        if (J()) J().react(turn, 'cheer');
        U().teamBar(T, turn);

        await U().sleep(420);
        if (phase === 'ended') return;
        nextTurn();
      }

      function nextTurn() {
        turnsDone++;
        if (turnsDone >= totalTurns) {
          phase = 'ended';
          clearAllTimers();
          if (A()) A().play('cheer_kids');
          ctx.end();
          return;
        }
        turn = (turn + 1) % T.length;
        phase = 'ask';
        timerEl.textContent = '⏱ 15s';
        renderHud();
      }

      pickTargets(allWords[0]);
      renderTargetsBar();
      renderHud();
    }
  };
})();
