/* ============================================================================
 * Game Maker — Mode: Balloon Pop (mode-balloon.js)
 * Question appears in top banner; 4 colourful balloons carrying the answer options
 * float upward from the bottom. Right balloon = +20, wrong balloon = soft pop +
 * right one glows + team still gets +5 for trying!
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
    desc: 'Read the question in the banner and pop the floating balloon with the right answer!',
    fields: [
      { key: 'rounds', k: 'rounds', label: 'Rounds per team', l: 'Rounds per team', opts: [[3, '3 rounds'], [5, '5 rounds']], def: 3 },
      { key: 'speed',  k: 'speed',  label: 'Balloon speed',   l: 'Balloon speed',   opts: [['slow', 'Slow'], ['normal', 'Normal'], ['fast', 'Fast']], def: 'normal' }
    ],

    start: function (ctx) {
      var T = GM.state.teams;
      var roundsPerTeam = +ctx.cfg.rounds || 3;
      var totalTurns = T.length * roundsPerTeam;
      var speedKey = ctx.cfg.speed || 'normal';
      var vyBase = speedKey === 'fast' ? 0.24 : (speedKey === 'slow' ? 0.11 : 0.16);

      var turn = 0;
      var turnsDone = 0;
      var phase = 'play'; // 'play' | 'resolving' | 'ended'
      var rafId = 0;
      var currentItem = null;
      var balloons = [];

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
          U().h('span', {}, [t.name + ' — Pop the right balloon!'])
        ]));
        info.appendChild(U().h('div', { class: 'gm-Meta' }, ['Round ' + Math.min(roundNum, roundsPerTeam) + ' / ' + roundsPerTeam]));
        U().teamBar(T, turn);
      }

      function spawnQuestionBalloons() {
        if (phase === 'ended') return;
        phase = 'play';
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
          var fb = ['Not this one!', 'Try another balloon!', 'Guess again!'];
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

          var lanePct = 12 + idx * (76 / Math.max(1, opts.length - 1));
          balloons.push({
            idx: idx,
            el: el,
            text: String(optText),
            correct: String(optText) === rightAns,
            xPct: lanePct,
            yPct: 46 + (idx % 2) * 12,
            vy: vyBase * (0.9 + (idx % 3) * 0.1),
            swayPhase: idx * 1.4
          });
        });

        renderHud();
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
          if (A()) {
            A().play('answer_right');
            A().play('sparkle');
            A().play('coin_collect');
          }
          if (A() && currentItem) A().speak(currentItem.a);
          U().floatText('+20', b.el, 'good');
          U().addScore(turn, 20);
          U().confetti(24);
          if (J()) J().react(turn, 'big');
        } else {
          // Soft pop with no penalty; highlight the right balloon and give +5 for trying!
          if (A()) A().play('answer_soft');
          balloons.forEach(function (other) {
            if (other.correct) other.el.classList.add('glow-right');
          });
          if (A() && currentItem) A().speak(currentItem.a);
          U().floatText('Good try! +5', b.el, 'good');
          U().addScore(turn, 5);
          if (J()) J().react(turn, 'cheer');
        }
        U().teamBar(T, turn);

        await U().sleep(850);
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

      function tick() {
        if (phase === 'ended') return;
        if (phase === 'play') {
          balloons.forEach(function (b) {
            b.yPct -= b.vy;
            b.swayPhase += 0.03;
            if (b.yPct < -12) {
              b.yPct = 92; // Loop smoothly from the bottom so pupils never lose a turn
            }
            var swayX = Math.sin(b.swayPhase) * 2.2;
            b.el.style.left = (b.xPct + swayX) + '%';
            b.el.style.top = b.yPct + '%';
            b.el.style.transform = 'translate(-50%, 0)';
          });
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
