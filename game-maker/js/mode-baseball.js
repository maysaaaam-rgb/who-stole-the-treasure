/* ============================================================================
 * Game Maker — Mode: Baseball (mode-baseball.js)
 * Baseball diamond with 4 bases (Home, 1st, 2nd, 3rd) and team monsters as runners.
 * Right answer = tap Swing to stop the power bar (Single/Double/Triple/Home Run).
 * Every hit gives at least +5, plus +20 for every runner crossing Home!
 * Wrong answer = soft "Strike!" (no points lost).
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

  GM.modes.baseball = {
    id: 'baseball',
    name: 'Baseball',
    e: '⚾',
    desc: 'Answer to step up to the plate, then stop the power bar to hit and run the bases!',
    fields: [
      { k: 'innings', l: 'Innings', opts: [[2, '2 innings'], [3, '3 innings']], def: 2 }
    ],

    start: function (ctx) {
      var T = GM.state.teams;
      var maxInnings = +ctx.cfg.innings || 2;
      var inning = 1;
      var turn = 0;
      var strikes = 0;
      var battersThisHalf = 0; // cap at 3 batters per half-inning so every team gets fair turns
      var phase = 'ask'; // 'ask' | 'swing' | 'running' | 'ended'
      var rafId = 0;
      var needleT = 0;
      var needlePct = 50;

      // Active runners on bases [1st, 2nd, 3rd] (each entry null or runner DOM element)
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
          U().h('span', {}, [t.name + (phase === 'swing' ? ' — Tap SWING when the needle hits green!' : ' — Up to Bat!')])
        ]));
        info.appendChild(U().h('div', { class: 'gm-Meta' }, ['Inning ' + inning + ' / ' + maxInnings]));

        hudEl.innerHTML = '';
        hudEl.appendChild(U().h('div', { class: 'gm-bas-pill' }, ['⚾ Inning ' + inning + '/' + maxInnings]));
        hudEl.appendChild(U().h('div', { class: 'gm-bas-pill' }, ['❌ Strikes: ' + strikes + ' / 2']));
        hudEl.appendChild(U().h('div', { class: 'gm-bas-pill' }, ['🧢 Batter: ' + (battersThisHalf + 1) + ' / 3']));

        actionSlot.innerHTML = '';
        if (phase === 'ask') {
          actionSlot.appendChild(U().btn('❓ Pitch Question', 'gm-btn gm-btn-go', doAsk));
        } else if (phase === 'swing') {
          actionSlot.appendChild(U().btn('🏏 SWING BAT!', 'gm-btn gm-btn-go', doSwing));
        } else {
          actionSlot.appendChild(U().h('span', { style: 'color:#fde047;font-weight:900;font-size:22px;' }, ['Running bases...']));
        }

        U().teamBar(T, turn);
      }

      async function doAsk() {
        if (phase !== 'ask') return;
        var item = ctx.nextItem();
        var res = await U().ask(item, T[turn], {
          timer: +ctx.cfg.timer || 0,
          label: T[turn].name + ' — answer to swing the bat!'
        });
        if (phase === 'ended') return;
        if (res.skipped) { doAsk(); return; }
        if (res.ok) {
          phase = 'swing';
          renderHud();
        } else {
          strikes++;
          U().floatText('Strike ' + strikes + '!', bHome, 'bad');
          if (J()) J().react(turn, 'sad');
          renderHud();
          await U().sleep(500);
          if (phase === 'ended') return;
          if (strikes >= 2 || battersThisHalf + 1 >= 3) {
            nextHalfInning();
          } else {
            battersThisHalf++;
            renderHud();
          }
        }
      }

      async function doSwing() {
        if (phase !== 'swing') return;
        phase = 'running';
        renderHud();

        if (A()) { A().play('kick'); A().play('whoosh_soft'); A().play('wood_knock'); }
        if (J() && J().squash) J().squash(batterEl, 1.22, 0.82, 200);

        // Determine hit value from needlePct (center 50 is sweet spot)
        var dist = Math.abs(needlePct - 50);
        var basesHit = 1;
        var hitLabel = 'SINGLE! (1 Base)';
        if (dist <= 6) {
          basesHit = 4;
          hitLabel = 'HOME RUN! 🎆 (4 Bases)';
        } else if (dist <= 13) {
          basesHit = 3;
          hitLabel = 'TRIPLE! 🔥 (3 Bases)';
        } else if (dist <= 26) {
          basesHit = 2;
          hitLabel = 'DOUBLE! ⭐ (2 Bases)';
        }

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
          // 3rd base -> Home
          if (bases[2]) {
            var r3 = bases[2];
            r3.style.top = BASE_COORDS[0].top;
            r3.style.left = BASE_COORDS[0].left;
            runsScored++;
            (function (el) {
              setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 380);
            })(r3);
          }
          // 2nd -> 3rd
          if (bases[1]) {
            bases[1].style.top = BASE_COORDS[3].top;
            bases[1].style.left = BASE_COORDS[3].left;
            nextBases[2] = bases[1];
          }
          // 1st -> 2nd
          if (bases[0]) {
            bases[0].style.top = BASE_COORDS[2].top;
            bases[0].style.left = BASE_COORDS[2].left;
            nextBases[1] = bases[0];
          }
          // New batter advances on step 0 onto 1st base
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

        // Award at least +5 for the hit, plus +20 for every run that crossed Home plate!
        var totalPts = 5 + runsScored * 20;
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
          needleT += phase === 'swing' ? 0.055 : 0.025;
          needlePct = 50 + Math.sin(needleT) * 46;
          needleEl.style.left = needlePct + '%';
        }
        // Render 60fps Pitcher Mound, Pitching 3D Baseball, Swinging 3D Bat & Outfield Home Run Arc
        var W = fxCanvas.width, H = fxCanvas.height;
        fxCtx.clearRect(0, 0, W, H);
        var moundX = W * 0.5, moundY = H * 0.45;
        var homeX = W * 0.5, homeY = H * 0.68;
        // Pitcher's mound circle
        fxCtx.beginPath(); fxCtx.arc(moundX, moundY, 22, 0, Math.PI * 2);
        fxCtx.fillStyle = 'rgba(217, 119, 6, 0.75)'; fxCtx.fill();
        fxCtx.strokeStyle = '#fde68a'; fxCtx.lineWidth = 2.5; fxCtx.stroke();

        var bx = moundX, by = moundY, bScale = 0.85, batRot = -0.45;
        var now = performance.now();
        if (phase === 'swing') {
          var pPitch = ((now % 950) / 950);
          bx = moundX + (homeX - moundX) * pPitch;
          by = moundY + (homeY - moundY) * pPitch;
          bScale = 0.7 + pPitch * 0.4;
          batRot = -0.45 + Math.sin(now * 0.01) * 0.14;
        } else if (hitAnim.active) {
          var pHit = Math.min(1, (now - hitAnim.t0) / 850);
          batRot = -0.45 + Math.min(1, pHit * 4.5) * 2.3;
          var outX = W * (0.28 + hitAnim.basesHit * 0.11), outY = 38;
          bx = homeX + (outX - homeX) * pHit;
          by = homeY + (outY - homeY) * pHit - Math.sin(pHit * Math.PI) * 145;
          bScale = 1.15 - pHit * 0.45;
          if (pHit >= 1) hitAnim.active = false;
        }
        // 3D Glossy Wooden Baseball Bat
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

        // 3D Spinning Baseball with Red Seams
        if (phase === 'swing' || hitAnim.active) {
          fxCtx.save();
          fxCtx.translate(bx, by);
          fxCtx.rotate(now * 0.02);
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
