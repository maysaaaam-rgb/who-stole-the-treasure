/* ============================================================================
 * Game Maker — Mode: Baseball (mode-baseball.js — Pro Skill Pitching Edition)
 * Baseball diamond with 4 bases (Home, 1st, 2nd, 3rd) and team monsters as runners.
 * Right answer = step up to the plate against 3 live pitch types:
 *   🔥 Fastball (high-speed needle)
 *   🌀 Curveball (accelerating curve needle)
 *   🍃 Changeup (deceptive hesitation needle)
 * Real Timing Zones (NO automatic Single!):
 *   - Center Sweet Spot (<=5): 🎆 HOME RUN (4 Bases)
 *   - Deep Gap (<=10):         🔥 TRIPLE (3 Bases)
 *   - Line Drive (<=16):       ⭐ DOUBLE (2 Bases)
 *   - Base Hit (<=24):         ⚾ SINGLE (1 Base)
 *   - Edge (<=33):             ⚠️ FOUL BALL! (Strike + re-pitch)
 *   - Wide (>33):              ❌ SWING & A MISS (Strike / Out — 0 pts!)
 * ============================================================================ */
(function () {
  'use strict';

  var GM = window.GM;
  var U = function () { return GM.u; };
  var A = function () { return GM.audio; };
  var J = function () { return GM.juice; };

  var BASE_COORDS = [
    { top: '70%', left: '50%' }, // 0: Home
    { top: '45%', left: '66%' }, // 1: 1st
    { top: '20%', left: '50%' }, // 2: 2nd
    { top: '45%', left: '34%' }  // 3: 3rd
  ];

  var PITCH_TYPES = [
    { id: 'fast',   name: '🔥 Fastball',  col: '#ef4444', spd: 0.095 },
    { id: 'curve',  name: '🌀 Curveball', col: '#38bdf8', spd: 0.082 },
    { id: 'change', name: '🍃 Changeup',  col: '#4ade80', spd: 0.076 }
  ];

  GM.modes.baseball = {
    id: 'baseball',
    name: 'Baseball',
    e: '⚾',
    desc: 'Answer to step up to the plate, read the pitch type (Fastball, Curveball, Changeup), and time the fast swing bar — late or early swings Foul off or Strike Out!',
    fields: [
      { key: 'innings', k: 'innings', label: 'Innings', l: 'Innings', opts: [[2, '2 innings'], [3, '3 innings']], def: 2 },
      { key: 'speed',   k: 'speed',   label: 'Pitch Speed', l: 'Pitch Speed', opts: [['normal', 'Pro Pitch'], ['fast', 'Major League']], def: 'normal' }
    ],

    start: function (ctx) {
      var T = GM.state.teams;
      var maxInnings = +ctx.cfg.innings || 2;
      var speedMul = ctx.cfg.speed === 'fast' ? 1.32 : 1.0;
      var inning = 1;
      var turn = 0;
      var strikes = 0;
      var outs = 0;
      var battersThisHalf = 0;
      var phase = 'ask'; // 'ask' | 'swing' | 'running' | 'ended'
      var rafId = 0;
      var needleT = 0;
      var needlePct = 50;
      var curPitch = PITCH_TYPES[0];

      // Active runners on bases [1st, 2nd, 3rd]
      var bases = [null, null, null];

      var wrap = U().h('div', { class: 'gm-bas-wrap' });
      var info = U().h('div', { class: 'gm-info' });
      var field = U().h('div', { class: 'gm-bas-field' });
      var barWrap = U().h('div', {});

      var diamond = U().h('div', { class: 'gm-bas-diamond' });
      var fxCanvas = U().h('canvas', { class: 'gm-bas-fx-canvas', width: 900, height: 460, style: 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:4;' });
      var fxCtx = fxCanvas.getContext('2d');
      var hitAnim = { active: false, t0: 0, basesHit: 1, sparks: [] };
      field.appendChild(diamond);
      field.appendChild(fxCanvas);

      var bHome = U().h('div', { class: 'gm-bas-base b-home' }, [U().h('span', { class: 'gm-bas-base-label' }, ['HOME'])]);
      var b1 = U().h('div', { class: 'gm-bas-base b-1' }, [U().h('span', { class: 'gm-bas-base-label' }, ['1ST'])]);
      var b2 = U().h('div', { class: 'gm-bas-base b-2' }, [U().h('span', { class: 'gm-bas-base-label' }, ['2ND'])]);
      var b3 = U().h('div', { class: 'gm-bas-base b-3' }, [U().h('span', { class: 'gm-bas-base-label' }, ['3RD'])]);
      field.appendChild(bHome);
      field.appendChild(b1);
      field.appendChild(b2);
      field.appendChild(b3);

      var hudEl = U().h('div', { class: 'gm-bas-hud' });
      var runnersLayer = U().h('div', {});
      var batterEl = U().h('div', { class: 'gm-bas-runner', style: 'top:70%;left:42%;' });

      var meterBox = U().h('div', { class: 'gm-bas-meter-box' });
      var meterTrack = U().h('div', { class: 'gm-bas-meter' });
      var needleEl = U().h('div', { class: 'gm-bas-needle', style: 'left:50%' });
      meterTrack.appendChild(needleEl);
      var actionSlot = U().h('div', {});
      meterBox.appendChild(meterTrack);
      meterBox.appendChild(actionSlot);

      field.appendChild(hudEl);
      field.appendChild(runnersLayer);
      field.appendChild(batterEl);
      field.appendChild(meterBox);

      wrap.appendChild(info);
      wrap.appendChild(field);
      wrap.appendChild(barWrap);
      ctx.root.appendChild(wrap);

      field.addEventListener('pointerdown', function (e) {
        if (phase === 'swing' && !e.target.closest('button')) {
          doSwing();
        }
      });

      function pickNewPitch() {
        curPitch = PITCH_TYPES[Math.floor(Math.random() * PITCH_TYPES.length)];
        needleT = (Math.random() * 2 - 1) * 1.4;
      }

      function clearBaseRunners() {
        bases = [null, null, null];
        runnersLayer.innerHTML = '';
      }

      function renderBatter() {
        var t = T[turn];
        batterEl.innerHTML = '';
        batterEl.appendChild(U().monFull(t.mon, 72));
      }

      function renderHud() {
        var t = T[turn];
        info.innerHTML = '';
        info.appendChild(U().h('div', { class: 'gm-turn-pill', style: '--tc:' + t.color }, [
          U().monFace(t.mon, 40),
          U().h('span', {}, [t.name + (phase === 'swing' ? (' — Incoming ' + curPitch.name + '! Tap SWING in the center!') : ' — Up to Bat!')])
        ]));
        info.appendChild(U().h('div', { class: 'gm-Meta' }, ['Inning ' + inning + ' / ' + maxInnings]));

        hudEl.innerHTML = '';
        hudEl.appendChild(U().h('div', { class: 'gm-bas-pill' }, ['⚾ Inning ' + inning + '/' + maxInnings]));
        hudEl.appendChild(U().h('div', { class: 'gm-bas-pill' }, ['❌ Strikes: ' + strikes + '/2 · Outs: ' + outs + '/2']));
        hudEl.appendChild(U().h('div', { class: 'gm-bas-pill', style: 'border-color:' + curPitch.col }, [curPitch.name]));

        actionSlot.innerHTML = '';
        if (phase === 'ask') {
          actionSlot.appendChild(U().btn('❓ Pitch Question', 'gm-btn gm-btn-go', doAsk));
        } else if (phase === 'swing') {
          actionSlot.appendChild(U().btn('🏏 SWING BAT! (' + curPitch.name + ')', 'gm-btn gm-btn-go', doSwing));
        } else {
          actionSlot.appendChild(U().h('span', { style: 'color:#fde047;font-weight:900;font-size:22px;' }, ['Play in motion...']));
        }

        U().teamBar(T, turn);
      }

      async function recordStrike(reasonLabel) {
        strikes++;
        if (A()) A().play('answer_soft');
        U().floatText(reasonLabel + ' (Strike ' + strikes + '!)', bHome, 'bad');
        if (J()) J().react(turn, 'sad');
        renderHud();
        await U().sleep(650);
        if (phase === 'ended') return;

        if (strikes >= 2) {
          outs++;
          strikes = 0;
          battersThisHalf++;
          U().floatText('⚾ BATTER OUT! (' + outs + '/2 Outs)', bHome, 'bad');
          await U().sleep(550);
          if (phase === 'ended') return;
          if (outs >= 2 || battersThisHalf >= 3) {
            nextHalfInning();
            return;
          }
        }
        phase = 'ask';
        renderHud();
      }

      async function doAsk() {
        if (phase !== 'ask') return;
        var item = ctx.nextItem();
        var res = await U().ask(item, T[turn], {
          timer: +ctx.cfg.timer || 0,
          label: T[turn].name + ' — answer to step into the batter\u2019s box!'
        });
        if (phase === 'ended') return;
        if (res.skipped) { doAsk(); return; }
        if (res.ok) {
          pickNewPitch();
          phase = 'swing';
          renderHud();
        } else {
          await recordStrike('❌ Wrong Answer');
        }
      }

      async function doSwing() {
        if (phase !== 'swing') return;
        phase = 'running';
        renderHud();

        if (A()) { A().play('kick'); A().play('whoosh_soft'); }
        if (J() && J().squash) J().squash(batterEl, 1.22, 0.82, 200);

        // Determine hit value from needlePct (center 50 is sweet spot — edge/outside misses!)
        var dist = Math.abs(needlePct - 50);
        var basesHit = 0;
        var hitLabel = '';

        if (dist <= 5) {
          basesHit = 4;
          hitLabel = '🎆 HOME RUN!! (4 Bases)';
        } else if (dist <= 10) {
          basesHit = 3;
          hitLabel = '🔥 TRIPLE! (3 Bases)';
        } else if (dist <= 16) {
          basesHit = 2;
          hitLabel = '⭐ DOUBLE! (2 Bases)';
        } else if (dist <= 24) {
          basesHit = 1;
          hitLabel = '⚾ SINGLE! (1 Base)';
        } else if (dist <= 33) {
          /* Foul Ball! If < 1 strike, adds a strike; on 1 strike, foul keeps batter alive for another pitch! */
          if (A()) A().play('wood_knock');
          if (strikes < 1) strikes++;
          U().floatText('⚠️ FOUL BALL! Swing again!', bHome, 'bad');
          await U().sleep(680);
          if (phase === 'ended') return;
          pickNewPitch();
          phase = 'swing';
          renderHud();
          return;
        } else {
          /* Total Swing & Miss — Strike! (0 points!) */
          await recordStrike('💨 SWING & A MISS');
          return;
        }

        if (A()) A().play('wood_knock');
        U().floatText(hitLabel, bHome, 'good');
        hitAnim.active = true;
        hitAnim.t0 = performance.now();
        hitAnim.basesHit = basesHit;
        for (var si = 0; si < 30; si++) {
          var a = Math.random() * Math.PI * 2, sp = 2 + Math.random() * 6;
          hitAnim.sparks.push({ x: 450, y: 365, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2, r: 4 + Math.random() * 4, color: ['#fde047', '#f97316', '#38bdf8', '#4ade80'][si % 4], life: 1 });
        }

        // Create a runner element for the batter starting at Home
        var t = T[turn];
        var newRunner = U().h('div', {
          class: 'gm-bas-runner',
          style: 'top:' + BASE_COORDS[0].top + ';left:' + BASE_COORDS[0].left + ';'
        }, [U().monFull(t.mon, 68)]);
        runnersLayer.appendChild(newRunner);

        var runsScored = 0;

        // Advance all runners step-by-step by basesHit bases
        for (var step = 0; step < basesHit; step++) {
          var nextBases = [null, null, null];
          if (bases[2]) {
            var r3 = bases[2];
            r3.style.top = BASE_COORDS[0].top;
            r3.style.left = BASE_COORDS[0].left;
            runsScored++;
            (function (el) {
              setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 380);
            })(r3);
          }
          if (bases[1]) {
            bases[1].style.top = BASE_COORDS[3].top;
            bases[1].style.left = BASE_COORDS[3].left;
            nextBases[2] = bases[1];
          }
          if (bases[0]) {
            bases[0].style.top = BASE_COORDS[2].top;
            bases[0].style.left = BASE_COORDS[2].left;
            nextBases[1] = bases[0];
          }
          if (step === 0) {
            newRunner.style.top = BASE_COORDS[1].top;
            newRunner.style.left = BASE_COORDS[1].left;
            nextBases[0] = newRunner;
          }
          bases = nextBases;
          if (A()) A().play('hunt_step');
          if (J() && J().squash) {
            bases.forEach(function (rEl) { if (rEl) J().squash(rEl, 1.18, 0.84, 180); });
          }
          await U().sleep(360);
          if (phase === 'ended') return;
        }

        var hitBonus = basesHit * 5;
        var totalPts = hitBonus + runsScored * 20;
        if (A()) {
          A().play('coin_collect');
          if (basesHit >= 2 || runsScored > 0) A().play('sparkle');
          if (runsScored > 0) { A().play('goal_cheer'); A().play('crowd_cheer_small'); }
        }
        U().floatText('+' + totalPts + (runsScored ? ' (' + runsScored + ' RUN!)' : ' Hit!'), bHome, 'good');
        U().addScore(turn, totalPts);
        if (runsScored > 0) U().confetti(25);
        if (J()) J().react(turn, runsScored > 0 ? 'big' : 'cheer');

        U().teamBar(T, turn);

        await U().sleep(550);
        if (phase === 'ended') return;

        strikes = 0;
        battersThisHalf++;
        if (battersThisHalf >= 3) {
          nextHalfInning();
        } else {
          phase = 'ask';
          renderHud();
        }
      }

      function nextHalfInning() {
        clearBaseRunners();
        strikes = 0;
        outs = 0;
        battersThisHalf = 0;
        turn++;
        if (turn >= T.length) {
          turn = 0;
          inning++;
          if (inning > maxInnings) {
            phase = 'ended';
            if (A()) A().play('cheer_kids');
            ctx.end();
            return;
          }
        }
        phase = 'ask';
        renderBatter();
        renderHud();
      }

      function tickNeedle() {
        if (phase === 'ended') return;
        if (phase === 'swing' || phase === 'ask') {
          var baseSpd = phase === 'swing' ? (curPitch.spd * speedMul) : 0.032;
          if (phase === 'swing' && curPitch.id === 'curve') {
            /* Curveball accelerates sharply through the center! */
            baseSpd *= (1.15 + Math.cos(needleT * 2) * 0.45);
          } else if (phase === 'swing' && curPitch.id === 'change') {
            /* Changeup hesitates then darts! */
            baseSpd *= (0.75 + Math.abs(Math.sin(needleT * 1.5)) * 0.7);
          }
          needleT += baseSpd;
          needlePct = 50 + Math.sin(needleT) * 48;
          needleEl.style.left = needlePct + '%';
        }

        var W = fxCanvas.width, H = fxCanvas.height;
        fxCtx.clearRect(0, 0, W, H);
        var moundX = W * 0.5, moundY = H * 0.45;
        var homeX = W * 0.5, homeY = H * 0.68;
        fxCtx.beginPath(); fxCtx.arc(moundX, moundY, 22, 0, Math.PI * 2);
        fxCtx.fillStyle = 'rgba(217, 119, 6, 0.75)'; fxCtx.fill();
        fxCtx.strokeStyle = '#fde68a'; fxCtx.lineWidth = 2.5; fxCtx.stroke();

        var bx = moundX, by = moundY, bScale = 0.85, batRot = -0.45;
        var now = performance.now();
        if (phase === 'swing') {
          var pPitch = ((now % 760) / 760);
          var curveOffset = curPitch.id === 'curve' ? Math.sin(pPitch * Math.PI) * 34 : 0;
          bx = moundX + (homeX - moundX) * pPitch + curveOffset;
          by = moundY + (homeY - moundY) * pPitch;
          bScale = 0.7 + pPitch * 0.4;
          batRot = -0.45 + Math.sin(now * 0.012) * 0.14;
        } else if (hitAnim.active) {
          var pHit = Math.min(1, (now - hitAnim.t0) / 850);
          batRot = -0.45 + Math.min(1, pHit * 4.5) * 2.3;
          var outX = W * (0.28 + hitAnim.basesHit * 0.11), outY = 38;
          bx = homeX + (outX - homeX) * pHit;
          by = homeY + (outY - homeY) * pHit - Math.sin(pHit * Math.PI) * 145;
          bScale = 1.15 - pHit * 0.45;
          if (pHit >= 1) hitAnim.active = false;
        }
        fxCtx.save();
        fxCtx.translate(homeX - 24, homeY - 4);
        fxCtx.rotate(batRot);
        var bgBat = fxCtx.createLinearGradient(-8, -64, 8, 0);
        bgBat.addColorStop(0, '#fcd34d'); bgBat.addColorStop(0.5, '#d97706'); bgBat.addColorStop(1, '#78350f');
        fxCtx.fillStyle = bgBat;
        fxCtx.strokeStyle = '#fff'; fxCtx.lineWidth = 2;
        fxCtx.beginPath(); fxCtx.roundRect(-7, -64, 14, 52, 7); fxCtx.fill(); fxCtx.stroke();
        fxCtx.fillStyle = '#1e293b';
        fxCtx.beginPath(); fxCtx.roundRect(-5, -14, 10, 18, 3); fxCtx.fill();
        fxCtx.restore();

        if (phase === 'swing' || hitAnim.active) {
          fxCtx.save();
          fxCtx.translate(bx, by);
          fxCtx.rotate(now * 0.025);
          var br = 13 * bScale;
          fxCtx.fillStyle = '#ffffff';
          fxCtx.strokeStyle = '#cbd5e1'; fxCtx.lineWidth = 2;
          fxCtx.beginPath(); fxCtx.arc(0, 0, br, 0, Math.PI * 2); fxCtx.fill(); fxCtx.stroke();
          fxCtx.strokeStyle = '#ef4444'; fxCtx.lineWidth = 2;
          fxCtx.beginPath(); fxCtx.arc(-br * 0.55, 0, br * 0.7, -0.8, 0.8); fxCtx.stroke();
          fxCtx.beginPath(); fxCtx.arc(br * 0.55, 0, br * 0.7, Math.PI - 0.8, Math.PI + 0.8); fxCtx.stroke();
          fxCtx.restore();
        }
        for (var si = hitAnim.sparks.length - 1; si >= 0; si--) {
          var sp = hitAnim.sparks[si];
          sp.x += sp.vx; sp.y += sp.vy; sp.vy += 0.16; sp.life -= 0.026;
          if (sp.life <= 0) { hitAnim.sparks.splice(si, 1); continue; }
          fxCtx.save();
          fxCtx.globalAlpha = Math.max(0, sp.life);
          fxCtx.fillStyle = sp.color;
          fxCtx.beginPath(); fxCtx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2); fxCtx.fill();
          fxCtx.restore();
        }
        rafId = requestAnimationFrame(tickNeedle);
      }

      ctx.onEnd(function () {
        phase = 'ended';
        if (rafId) cancelAnimationFrame(rafId);
      });

      renderBatter();
      renderHud();
      rafId = requestAnimationFrame(tickNeedle);
    }
  };
})();
