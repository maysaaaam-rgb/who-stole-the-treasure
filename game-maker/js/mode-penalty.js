/* ============================================================================
 * Game Maker — Mode: Penalty Kick (mode-penalty.js)
 * Answer a question -> swipe or tap the football past the moving keeper glove!
 * Goal = +20 (top corners +30), Keeper save = +5 for trying!
 * ============================================================================ */
(function () {
  'use strict';

  var GM = window.GM;
  var U = function () { return GM.u; };
  var A = function () { return GM.audio; };
  var J = function () { return GM.juice; };

  GM.modes.penalty = {
    id: 'penalty',
    name: 'Penalty Kick',
    e: '⚽',
    desc: 'Answer a question, then swipe or tap to shoot past the keeper!',
    fields: [
      { k: 'shots', l: 'Shots per team', opts: [[3, '3 shots'], [5, '5 shots']], def: 3 },
      { k: 'speed', l: 'Keeper speed',   opts: [['slow', 'Slow'], ['fast', 'Fast']], def: 'slow' }
    ],

    start: function (ctx) {
      var T = GM.state.teams;
      var shotsPerTeam = +ctx.cfg.shots || 3;
      var totalTurns = T.length * shotsPerTeam;
      var fastKeeper = ctx.cfg.speed === 'fast';
      var turn = 0;
      var shotsTaken = 0;
      var phase = 'ask'; // 'ask' | 'shoot' | 'anim' | 'ended'
      var rafId = 0;
      var keeperT = 0;
      var keeperX = 50; // percentage 22..78 within goal

      if (A() && A().play) A().play('music_sports');

      var wrap = U().h('div', { class: 'gm-pen-wrap' });
      var info = U().h('div', { class: 'gm-info' });
      var pitch = U().h('div', { class: 'gm-pen-pitch' });
      var barWrap = U().h('div', {});

      var fxCanvas = U().h('canvas', { class: 'gm-pen-fx-canvas', width: 900, height: 460, style: 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:3;' });
      var fxCtx = fxCanvas.getContext('2d');
      var hoverZone = null;
      var ballTrail = [];
      var penSparks = [];
      var boxLine = U().h('div', { class: 'gm-pen-box-line' });
      var goal = U().h('div', { class: 'gm-pen-goal' });
      if (U().hasArt && U().hasArt('o_goal_net')) {
        goal.appendChild(U().art('o_goal_net', '', 'gm-pen-goal-art'));
      }

      var targetsGrid = U().h('div', { class: 'gm-pen-targets' });
      var ZONES = [
        { id: 0, label: 'TOP L ⭐+30', gx: 22, gy: 15, bonus: 30 },
        { id: 1, label: 'TOP M ⚽+20', gx: 50, gy: 15, bonus: 20 },
        { id: 2, label: 'TOP R ⭐+30', gx: 78, gy: 15, bonus: 30 },
        { id: 3, label: 'LOW L ⚽+20', gx: 22, gy: 32, bonus: 20 },
        { id: 4, label: 'LOW M ⚽+20', gx: 50, gy: 32, bonus: 20 },
        { id: 5, label: 'LOW R ⚽+20', gx: 78, gy: 32, bonus: 20 }
      ];
      var zoneEls = ZONES.map(function (z) {
        var btn = U().h('button', {
          class: 'gm-pen-target',
          type: 'button',
          onmouseenter: function () { hoverZone = z; },
          onclick: function () {
            if (phase === 'shoot') shootAtZone(z);
          }
        }, [z.label]);
        targetsGrid.appendChild(btn);
        return btn;
      });
      goal.appendChild(targetsGrid);

      var keeperEl = U().h('div', { class: 'gm-pen-keeper' }, [
        U().art('o_keeper_glove', '🧤', '')
      ]);
      var spotEl = U().h('div', { class: 'gm-pen-spot' });
      var kickerEl = U().h('div', { class: 'gm-pen-kicker' });
      var ballEl = U().h('div', { class: 'gm-pen-ball' }, [
        U().art('o_football', '⚽', '')
      ]);
      var hudEl = U().h('div', { class: 'gm-pen-hud' });
      var bannerEl = U().h('div', { class: 'gm-pen-banner', style: 'display:none' }, ['']);

      pitch.appendChild(fxCanvas);
      pitch.appendChild(boxLine);
      pitch.appendChild(goal);
      pitch.appendChild(keeperEl);
      pitch.appendChild(spotEl);
      pitch.appendChild(kickerEl);
      pitch.appendChild(ballEl);
      pitch.appendChild(hudEl);
      pitch.appendChild(bannerEl);

      wrap.appendChild(info);
      wrap.appendChild(pitch);
      wrap.appendChild(barWrap);
      ctx.root.appendChild(wrap);

      // Swipe / drag support on ball or pitch
      var dragStart = null;
      pitch.addEventListener('pointerdown', function (e) {
        if (phase !== 'shoot') return;
        dragStart = { x: e.clientX, y: e.clientY };
      });
      pitch.addEventListener('pointerup', function (e) {
        if (phase !== 'shoot' || !dragStart) return;
        var dx = e.clientX - dragStart.x;
        var dy = e.clientY - dragStart.y;
        dragStart = null;
        if (dy < -30) {
          var col = dx < -45 ? 0 : (dx > 45 ? 2 : 1);
          var row = dy < -110 ? 0 : 1;
          shootAtZone(ZONES[row * 3 + col]);
        }
      });

      function tickKeeper() {
        if (phase === 'ended') return;
        if (phase !== 'anim') {
          keeperT += fastKeeper ? 0.048 : 0.028;
          keeperX = 50 + Math.sin(keeperT) * 23;
          keeperEl.style.left = keeperX + '%';
          keeperEl.style.top = (25 + Math.cos(keeperT * 2) * 5) + '%';
        }
        // Render 60fps Pro Stadium FX Canvas
        var W = fxCanvas.width, H = fxCanvas.height;
        fxCtx.clearRect(0, 0, W, H);
        // Aiming trajectory curve during shoot phase
        var hz = hoverZone || ZONES[2];
        if (phase === 'shoot' && hz) {
          var sx = W * 0.5, sy = H * 0.86;
          var tx = W * (hz.gx / 100), ty = H * (hz.gy / 100 + 0.08);
          var cx = (sx + tx) * 0.5 + (tx - sx) * 0.25, cy = Math.min(sy, ty) - 70;
          fxCtx.save();
          fxCtx.strokeStyle = 'rgba(253, 224, 71, 0.85)';
          fxCtx.lineWidth = 4;
          fxCtx.setLineDash([10, 8]);
          fxCtx.lineDashOffset = -(keeperT * 18) % 18;
          fxCtx.beginPath();
          fxCtx.moveTo(sx, sy);
          fxCtx.quadraticCurveTo(cx, cy, tx, ty);
          fxCtx.stroke();
          fxCtx.beginPath();
          fxCtx.arc(tx, ty, 18 + Math.sin(keeperT * 3) * 4, 0, Math.PI * 2);
          fxCtx.strokeStyle = '#fde047';
          fxCtx.setLineDash([]);
          fxCtx.stroke();
          fxCtx.restore();
        }
        // Draw ball trail & goal sparks
        for (var i = ballTrail.length - 1; i >= 0; i--) {
          var tr = ballTrail[i];
          tr.a -= 0.05;
          if (tr.a <= 0) { ballTrail.splice(i, 1); continue; }
          fxCtx.beginPath();
          fxCtx.arc(tr.x, tr.y, tr.r * tr.a, 0, Math.PI * 2);
          fxCtx.fillStyle = 'rgba(253, 224, 71, ' + (tr.a * 0.6) + ')';
          fxCtx.fill();
        }
        for (var j = penSparks.length - 1; j >= 0; j--) {
          var sp = penSparks[j];
          sp.x += sp.vx; sp.y += sp.vy; sp.vy += 0.18; sp.life -= 0.025;
          if (sp.life <= 0) { penSparks.splice(j, 1); continue; }
          fxCtx.save();
          fxCtx.globalAlpha = Math.max(0, sp.life);
          fxCtx.fillStyle = sp.color;
          fxCtx.beginPath(); fxCtx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2); fxCtx.fill();
          fxCtx.restore();
        }
        rafId = requestAnimationFrame(tickKeeper);
      }
      rafId = requestAnimationFrame(tickKeeper);

      ctx.onEnd(function () {
        phase = 'ended';
        if (rafId) cancelAnimationFrame(rafId);
      });

      function setZonesReady(ready) {
        zoneEls.forEach(function (el) {
          el.classList.toggle('ready', !!ready);
        });
        ballEl.classList.toggle('ready', !!ready);
      }

      function resetBallAndKicker() {
        var t = T[turn];
        kickerEl.innerHTML = '';
        kickerEl.appendChild(U().monFull(t.mon, 108));
        ballEl.style.transition = 'none';
        ballEl.style.left = '50%';
        ballEl.style.bottom = '10%';
        ballEl.style.transform = 'translate(-50%, 0) scale(1)';
      }

      function renderHud() {
        var t = T[turn];
        var shotNum = Math.floor(shotsTaken / T.length) + 1;
        info.innerHTML = '';
        info.appendChild(U().h('div', { class: 'gm-turn-pill', style: '--tc:' + t.color }, [
          U().monFace(t.mon, 40),
          U().h('span', {}, [t.name + (phase === 'shoot' ? ' — Swipe or tap the goal to SHOOT!' : ' — Penalty Shot')])
        ]));
        info.appendChild(U().h('div', { class: 'gm-Meta' }, ['Shot ' + Math.min(shotNum, shotsPerTeam) + ' / ' + shotsPerTeam]));

        hudEl.innerHTML = '';
        if (phase === 'ask') {
          hudEl.appendChild(U().btn('❓ Question', 'gm-btn gm-btn-go', doAsk));
        } else if (phase === 'shoot') {
          hudEl.appendChild(U().btn('👟 Kick Now!', 'gm-btn gm-btn-go', function () {
            var z = ZONES[U().rand(0, ZONES.length - 1)];
            shootAtZone(z);
          }));
        }

        U().teamBar(T, turn);
      }

      async function doAsk() {
        if (phase !== 'ask') return;
        var item = ctx.nextItem();
        var res = await U().ask(item, T[turn], {
          timer: +ctx.cfg.timer || 0,
          label: T[turn].name + ' — answer to take your penalty kick!'
        });
        if (phase === 'ended') return;
        if (res.skipped) { doAsk(); return; }
        if (res.ok) {
          phase = 'shoot';
          setZonesReady(true);
          renderHud();
        } else {
          if (J()) J().react(turn, 'sad');
          await U().sleep(450);
          nextTurn();
        }
      }

      async function shootAtZone(z) {
        if (phase !== 'shoot') return;
        phase = 'anim';
        setZonesReady(false);
        renderHud();

        if (A()) A().play('kick');
        // Kicker monster run-up kick lunge!
        kickerEl.style.transition = 'transform 0.22s cubic-bezier(0.2,0.9,0.3,1.2)';
        kickerEl.style.transform = 'translate(18px, -14px) rotate(-14deg) scale(1.08)';
        setTimeout(function () { kickerEl.style.transform = 'translate(0,0) rotate(0) scale(1)'; }, 450);

        // Spawn golden flight trail & target burst
        var W = fxCanvas.width, H = fxCanvas.height;
        var sx = W * 0.5, sy = H * 0.86;
        var tx = W * (z.gx / 100), ty = H * (z.gy / 100 + 0.08);
        for (var s = 0; s <= 12; s++) {
          (function (step) {
            setTimeout(function () {
              var u = step / 12;
              ballTrail.push({ x: sx + (tx - sx) * u, y: sy + (ty - sy) * u - Math.sin(u * Math.PI) * 55, r: 22 * (1 - u * 0.35), a: 0.9 });
            }, step * 26);
          })(s);
        }
        for (var k = 0; k < 28; k++) {
          var ang = Math.random() * Math.PI * 2, spd = 2 + Math.random() * 6;
          penSparks.push({ x: tx, y: ty, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd - 2, r: 4 + Math.random() * 4, color: ['#fde047', '#38bdf8', '#4ade80', '#f43f5e'][k % 4], life: 1 });
        }

        // Animate ball flying to target zone
        ballEl.style.transition = 'left 0.36s cubic-bezier(0.2, 0.8, 0.3, 1), bottom 0.36s cubic-bezier(0.2, 0.8, 0.3, 1), transform 0.36s ease-out';
        ballEl.style.left = z.gx + '%';
        ballEl.style.bottom = (100 - z.gy - 8) + '%';
        ballEl.style.transform = 'translate(-50%, 0) scale(0.68) rotate(360deg)';

        // Keeper dives near where it currently is (with a small dive offset)
        var diveX = Math.max(22, Math.min(78, keeperX + U().rand(-8, 8)));
        keeperEl.style.left = diveX + '%';
        keeperEl.style.top = z.gy + '%';

        await U().sleep(370);
        if (phase === 'ended') return;

        var dist = Math.abs(diveX - z.gx);
        var saved = dist < 13;

        if (!saved) {
          var pts = z.bonus || 20;
          if (A()) { A().play('net_swish'); A().play('goal_cheer'); }
          U().floatText('GOAL! +' + pts, goal, 'good');
          U().addScore(turn, pts);
          U().confetti(28);
          if (J()) J().react(turn, 'big');
          bannerEl.textContent = '⚽ GOAL! +' + pts + ' points!';
          bannerEl.style.display = '';
        } else {
          if (A()) A().play('keeper_save');
          // Ball bounces off keeper glove, still awards +5 for trying!
          ballEl.style.left = (z.gx + (z.gx < 50 ? -12 : 12)) + '%';
          ballEl.style.bottom = '42%';
          U().floatText('Nice shot! +5', keeperEl, 'good');
          U().addScore(turn, 5);
          if (J()) J().react(turn, 'cheer');
          bannerEl.textContent = '🧤 Keeper touched it! Still +5 for a great shot!';
          bannerEl.style.display = '';
        }

        U().teamBar(T, turn);

        await U().sleep(900);
        if (phase === 'ended') return;
        bannerEl.style.display = 'none';
        nextTurn();
      }

      function nextTurn() {
        shotsTaken++;
        if (shotsTaken >= totalTurns) {
          phase = 'ended';
          ctx.end();
          return;
        }
        turn = (turn + 1) % T.length;
        phase = 'ask';
        resetBallAndKicker();
        renderHud();
      }

      resetBallAndKicker();
      renderHud();
    }
  };
})();
