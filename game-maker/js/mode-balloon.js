/* ============================================================================
 * Game Maker — Mode: Balloon Pop (mode-balloon.js — Skill & Wind Edition)
 * Question appears in top banner; answer balloons weave upward on wind gusts
 * alongside a drifting 💣 Storm Decoy Balloon!
 * - Right balloon = +20 (+5 Speed Bonus if popped on the first pass!)
 * - Wrong balloon or Storm Bomb = 0 points!
 * - Letting balloons escape off the top twice expires the turn (0 points)!
 * ============================================================================ */
(function () {
  'use strict';

  var GM = window.GM;
  var U = function () { return GM.u; };
  var A = function () { return GM.audio; };
  var J = function () { return GM.juice; };

  var BALLOON_ARTS = ['o_balloon_blue', 'o_balloon_green', 'o_balloon_yellow', 'o_balloon_red'];

  GM.modes.balloon = {
    id: 'balloon',
    name: 'Balloon Pop',
    e: '🎈',
    desc: 'Read the question and pop the fast-weaving answer balloon before it escapes into the clouds — watch out for the Storm Bomb balloon!',
    fields: [
      { key: 'rounds', k: 'rounds', label: 'Rounds per team', l: 'Rounds per team', opts: [[3, '3 rounds'], [5, '5 rounds']], def: 3 },
      { key: 'speed',  k: 'speed',  label: 'Balloon speed',   l: 'Balloon speed',   opts: [['slow', 'Breezy'], ['normal', 'Gusty Wind'], ['fast', 'Jet Stream']], def: 'normal' }
    ],

    start: function (ctx) {
      var T = GM.state.teams;
      var roundsPerTeam = +ctx.cfg.rounds || 3;
      var totalTurns = T.length * roundsPerTeam;
      var speedKey = ctx.cfg.speed || 'normal';
      var vyBase = speedKey === 'fast' ? 0.36 : (speedKey === 'slow' ? 0.17 : 0.25);
      var swayAmp = speedKey === 'fast' ? 8.5 : (speedKey === 'slow' ? 3.8 : 6.2);

      var turn = 0;
      var turnsDone = 0;
      var phase = 'play'; // 'play' | 'resolving' | 'ended'
      var rafId = 0;
      var currentItem = null;
      var balloons = [];
      var passCount = 0;

      var wrap = U().h('div', { class: 'gm-bal-wrap' });
      var info = U().h('div', { class: 'gm-info' });
      var qbar = U().h('div', { class: 'gm-bal-qbar' });
      var qtext = U().h('div', { class: 'gm-bal-qtext' }, ['']);
      var speakBtn = U().btn('🔊 Listen', 'gm-btn', function () {
        if (currentItem && A()) A().speak(U().sayOf(currentItem));
      });
      qbar.appendChild(qtext);
      qbar.appendChild(speakBtn);

      var sky = U().h('div', { class: 'gm-bal-sky' });

      wrap.appendChild(info);
      wrap.appendChild(qbar);
      wrap.appendChild(sky);
      ctx.root.appendChild(wrap);

      function renderHud() {
        var t = T[turn];
        var roundNum = Math.floor(turnsDone / T.length) + 1;
        info.innerHTML = '';
        info.appendChild(U().h('div', { class: 'gm-turn-pill', style: '--tc:' + t.color }, [
          U().monFace(t.mon, 40),
          U().h('span', {}, [t.name + ' — Pop the right balloon before it escapes!'])
        ]));
        info.appendChild(U().h('div', { class: 'gm-Meta' }, ['Round ' + Math.min(roundNum, roundsPerTeam) + ' / ' + roundsPerTeam]));
        U().teamBar(T, turn);
      }

      function spawnQuestionBalloons() {
        if (phase === 'ended') return;
        phase = 'play';
        passCount = 0;
        currentItem = ctx.nextItem();
        var rightAns = String(currentItem.a || '');
        if (currentItem.speak === 1 && currentItem.act) {
          qtext.textContent = '🎭 ' + currentItem.act + '  🎤 ' + U().qText(currentItem);
        } else {
          qtext.textContent = '❓ ' + U().qText(currentItem);
        }
        if (A()) A().speak(U().sayOf(currentItem));

        var wrongs = (currentItem.w || []).map(function (x) { return String(x || ''); }).filter(function (x) { return x && x !== rightAns; }).slice(0, 3);
        if (wrongs.length < 3) {
          var poolItems = (GM.state && GM.state.items) || [];
          U().shuffle(poolItems.slice()).forEach(function (it) {
            if (wrongs.length >= 3 || !it || it === currentItem) return;
            var cand = String(it.a || '');
            if (cand && cand !== rightAns && wrongs.indexOf(cand) < 0) wrongs.push(cand);
          });
          var fb = ['Not this one!', 'Try another!', 'Watch out!'];
          fb.forEach(function (f) {
            if (wrongs.length < 3 && f !== rightAns && wrongs.indexOf(f) < 0) wrongs.push(f);
          });
        }
        var opts = U().shuffle([rightAns].concat(wrongs.slice(0, 3)));
        sky.innerHTML = '';
        balloons = [];

        opts.forEach(function (optText, idx) {
          var artName = BALLOON_ARTS[idx % BALLOON_ARTS.length];
          var el = U().h('div', {
            class: 'gm-bal-item',
            onclick: function () { onPopBalloon(idx); }
          }, [
            U().h('div', { class: 'gm-bal-art' }, [U().art(artName, '🎈', '')]),
            U().h('div', { class: 'gm-bal-label' }, [String(optText)])
          ]);
          sky.appendChild(el);

          var lanePct = 14 + idx * (72 / Math.max(1, opts.length - 1));
          balloons.push({
            idx: idx,
            el: el,
            text: String(optText),
            correct: String(optText) === rightAns,
            hazard: false,
            xPct: lanePct,
            yPct: 68 + (idx % 2) * 14,
            vy: vyBase * (0.92 + (idx % 3) * 0.14),
            swayPhase: Math.random() * 6.28,
            swaySpd: 0.045 + (idx % 2) * 0.015
          });
        });

        /* Add 1 weaving Storm Bomb Hazard Balloon in Normal/Fast modes! */
        if (speedKey !== 'slow') {
          var hazIdx = balloons.length;
          var hazEl = U().h('div', {
            class: 'gm-bal-item',
            onclick: function () { onPopBalloon(hazIdx); }
          }, [
            U().h('div', { class: 'gm-bal-art' }, [U().h('span', { style: 'font-size:52px;display:block;filter:drop-shadow(0 6px 10px rgba(0,0,0,0.45));' }, ['💣'])]),
            U().h('div', { class: 'gm-bal-label', style: 'background:#ef4444;color:#fff;border-color:#fff;' }, ['⚡ STORM TRAP!'])
          ]);
          sky.appendChild(hazEl);
          balloons.push({
            idx: hazIdx,
            el: hazEl,
            text: 'STORM TRAP',
            correct: false,
            hazard: true,
            xPct: 50,
            yPct: 78,
            vy: vyBase * 1.15,
            swayPhase: 1.5,
            swaySpd: 0.065
          });
        }

        renderHud();
      }

      async function advanceNextBalloonTurn() {
        await U().sleep(880);
        if (phase === 'ended') return;
        turnsDone++;
        if (turnsDone >= totalTurns) {
          phase = 'ended';
          if (A()) A().play('cheer_kids');
          ctx.end();
          return;
        }
        if (A()) A().play('whoosh_soft');
        turn = (turn + 1) % T.length;
        spawnQuestionBalloons();
      }

      async function onPopBalloon(idx) {
        if (phase !== 'play') return;
        phase = 'resolving';
        var b = balloons[idx];
        if (!b) return;

        if (J() && J().squash) J().squash(b.el, 1.24, 0.78, 180);
        b.el.classList.add('popped');
        if (A()) {
          A().play('balloon_pop');
          A().play('bubble_pop');
        }

        if (b.correct) {
          var fastBonus = passCount === 0 ? 5 : 0;
          var pts = 20 + fastBonus;
          if (A()) {
            A().play('answer_right');
            A().play('sparkle');
            A().play('coin_collect');
          }
          if (A() && currentItem) A().speak(currentItem.a);
          U().floatText('+' + pts + (fastBonus ? ' ⚡ FAST POP!' : ''), b.el, 'good');
          U().addScore(turn, pts);
          U().confetti(24);
          if (J()) J().react(turn, 'big');
        } else if (b.hazard) {
          if (A()) A().play('answer_soft');
          U().floatText('💥 BOOM! Storm Trap! (0 pts)', b.el, 'bad');
          if (J()) J().react(turn, 'sad');
        } else {
          /* Wrong balloon = 0 points! Reveal the right one */
          if (A()) A().play('answer_soft');
          balloons.forEach(function (other) {
            if (other.correct) other.el.classList.add('glow-right');
          });
          if (A() && currentItem) A().speak(currentItem.a);
          U().floatText('❌ Wrong Balloon! (0 pts)', b.el, 'bad');
          if (J()) J().react(turn, 'sad');
        }
        U().teamBar(T, turn);
        await advanceNextBalloonTurn();
      }

      function tick() {
        if (phase === 'ended') return;
        if (phase === 'play') {
          var escapedThisFrame = false;
          balloons.forEach(function (b) {
            b.yPct -= b.vy;
            b.swayPhase += b.swaySpd;
            if (b.yPct < -14) {
              b.yPct = 92;
              if (b.correct) escapedThisFrame = true;
            }
            var swayX = Math.sin(b.swayPhase) * (b.hazard ? swayAmp * 3.2 : swayAmp);
            b.el.style.left = Math.max(8, Math.min(92, b.xPct + swayX)) + '%';
            b.el.style.top = b.yPct + '%';
            b.el.style.transform = 'translate(-50%, 0)';
          });

          if (escapedThisFrame) {
            passCount++;
            if (passCount >= 2 && phase === 'play') {
              phase = 'resolving';
              if (A()) A().play('answer_soft');
              U().floatText('⏰ Balloons Escaped! (0 pts)', sky, 'bad');
              advanceNextBalloonTurn();
            }
          }
        }
        rafId = requestAnimationFrame(tick);
      }

      ctx.onEnd(function () {
        phase = 'ended';
        if (rafId) cancelAnimationFrame(rafId);
      });

      spawnQuestionBalloons();
      rafId = requestAnimationFrame(tick);
    }
  };
})();
