/* ============================================================================
   Game Maker — Mode: Whack-a-Word (Real-3 Full-Screen 60fps Rebuild)
   ----------------------------------------------------------------------------
   Full-screen 1600x900 3D Garden / Haunted Patch canvas with:
   - 9 3D perspective burrows (o_hole.webp) across 3 depth rows with real
     hole-lip clipping so moles rise out of and duck into the ground!
   - Big cheering Team Monster Mascot on the lawn + layered bushes (o_bush.webp)
   - Giant 3D Mallet (o_hammer.webp) that swings down with shockwaves & stars
   - Logical, Skill-Based Reading & Reflex Gameplay (15-Second Wave per Turn):
     * 🎯 TARGET MOLES: Hold the target answer word! Whack them to build a
       🔥 Combo Streak (1x -> 2x -> 3x) for +5 / +10 / +15 points!
     * 🪖 HARD-HAT BOSS MOLE: Wears a golden helmet — takes 2 taps (1st tap
       knocks off the helmet, 2nd tap scores 🌟 BOSS WHACK! +20)!
     * 💣 DECOY MOLES: Hold wrong distractor words! Whacking a wrong word
       breaks your combo streak and briefly stuns your hammer (0.55s dizzy
       boing, zero points deducted) so pupils must READ before whacking!
   ============================================================================ */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {};
  GM.modes = GM.modes || {};

  var U = function () { return GM.u; };
  var A = function () { return GM.audio; };

  var VW = 1600;
  var VH = 900;

  function loadImg(src) {
    var im = new Image();
    im.src = src;
    return im;
  }
  function imgReady(im) {
    return !!(im && im.complete && im.naturalWidth > 0);
  }
  function makeMonImg(m) {
    var img = new Image();
    var svg = (GM.mon && GM.mon.svg) ? GM.mon.svg(m, 260) : '';
    if (!svg || svg.indexOf('<svg') < 0) return null;
    if (svg.indexOf('xmlns=') < 0) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    return img;
  }
  function drawOutlinedText(g, txt, x, y, size, fill, stroke, align) {
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
  function rr(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }
  function flyScoreToPod(screenPt, teamIdx, pts, cb) {
    var pod = document.querySelector('#gm-team-' + teamIdx + ' .gm-score') || document.getElementById('gm-team-' + teamIdx);
    var layer = document.getElementById('gm-fx');
    if (!pod || !layer || !screenPt) {
      if (cb) cb();
      return;
    }
    var r = pod.getBoundingClientRect();
    var orb = U().h('div', { class: 'gm-score-orb', text: '+' + pts });
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
      if (cb) cb();
    }, 640);
  }

  GM.modes.whack = {
    id: 'whack',
    name: 'Whack-a-Ghost',
    nameClassic: 'Whack-a-Word',
    e: '🔨',
    desc: 'Answer right, then whack ONLY the moles holding the target word! Build combos & crack 2-hit Boss Moles — whacking wrong decoy words stuns your hammer!',
    descClassic: 'Answer right, then whack ONLY the moles holding the target word! Build combos & crack 2-hit Boss Moles — whacking wrong decoy words stuns your hammer!',
    fields: [
      { key: 'rounds', label: 'Waves for each team', opts: [[2, '2'], [3, '3'], [4, '4'], [6, '6']], def: 3 },
      { key: 'speed', label: 'Mole Speed', opts: [['easy', 'Gentle'], ['normal', 'Normal'], ['hard', 'Turbo']], def: 'normal' }
    ],

    start: function (ctx) {
      var st = GM.state;
      var hal = st.theme === 'halloween';
      var T = st.teams;
      var nt = T.length;
      var totalWaves = (+ctx.cfg.rounds || 3) * nt;
      var waveNo = 0;
      var turn = 0;
      var alive = true;
      var ended = false;
      var asking = false;

      var SP = {
        easy:   { upDur: 2.15, spawnEvery: 0.72, waveSec: 15 },
        normal: { upDur: 1.55, spawnEvery: 0.54, waveSec: 15 },
        hard:   { upDur: 1.15, spawnEvery: 0.42, waveSec: 15 }
      }[ctx.cfg.speed] || { upDur: 1.55, spawnEvery: 0.54, waveSec: 15 };

      try { A().musicStart(hal ? 'halloween' : 'arcade'); } catch (e) { /* ignore */ }
      if (document.body) document.body.classList.add('gm-small-pods', 'gm-real3-active');

      var rootEl = ctx.root;
      rootEl.innerHTML = '';

      var wrap = U().h('div', { class: 'gm-real3-scene gm-whack-real3', title: 'Tap the moles holding the TARGET WORD!' });
      var cv = U().h('canvas', { class: 'gm-real3-cv' });
      var g = cv.getContext('2d');
      var banner = U().h('div', { class: 'gm-real3-banner' });
      var dock = U().h('div', { class: 'gm-real3-dock' });
      wrap.appendChild(cv);
      rootEl.appendChild(U().h('div', { class: 'gm-boardwrap' }, [wrap, banner, dock]));

      /* Preload art assets */
      var artBgClassic = loadImg('art/bg_classic_whack.webp');
      var artBgHal     = loadImg('art/bg_pumpkin_patch.webp');
      var artHole      = loadImg('art/o_hole.webp');
      var artHammer    = loadImg('art/o_hammer.webp');
      var artBubble    = loadImg('art/o_word_bubble.webp');
      var artBush      = loadImg('art/o_bush.webp');
      var artStar      = loadImg('art/o_star_coin.webp');
      var critterImgs  = [
        loadImg('art/c_pumpkin.webp'),
        loadImg('art/c_ghost.webp'),
        loadImg('art/c_bat.webp')
      ];
      var monImgs = T.map(function (t) { return makeMonImg(t.mon); });

      /* 9 3D Perspective Burrows across 3 depth rows */
      var HOLES = [
        /* Back row (row 0, scale 0.80) */
        { id: 0, row: 0, x: 560,  y: 415, sc: 0.82 },
        { id: 1, row: 0, x: 890,  y: 405, sc: 0.82 },
        { id: 2, row: 0, x: 1220, y: 415, sc: 0.82 },
        /* Middle row (row 1, scale 0.94) */
        { id: 3, row: 1, x: 495,  y: 575, sc: 0.94 },
        { id: 4, row: 1, x: 890,  y: 565, sc: 0.94 },
        { id: 5, row: 1, x: 1285, y: 575, sc: 0.94 },
        /* Front row (row 2, scale 1.08) */
        { id: 6, row: 2, x: 440,  y: 748, sc: 1.08 },
        { id: 7, row: 2, x: 890,  y: 740, sc: 1.08 },
        { id: 8, row: 2, x: 1340, y: 748, sc: 1.08 }
      ];

      /* Active Mole State per Hole */
      var moles = HOLES.map(function (h) {
        return {
          hole: h,
          state: 'down', /* 'down' | 'rising' | 'up' | 'bonked' | 'hiding' */
          pop: 0,        /* 0 (hidden) .. 1 (fully popped) */
          timer: 0,
          upDur: 1.5,
          word: '',
          isTarget: false,
          isBoss: false,
          hp: 1,
          critterIdx: 0,
          bonkT: 0
        };
      });

      /* Game State */
      var phase = 'wait'; /* 'wait' | 'wave' | 'summary' | 'shrug' | 'finale' */
      var phaseT = 0;
      var waveTimeLeft = 0;
      var spawnCd = 0;
      var targetWord = '';
      var targetPrompt = '';
      var decoyPool = [];
      var wavePts = 0;
      var waveHits = 0;
      var combo = 1;
      var stunT = 0;
      var camShakeT = 0, camShakeMag = 0;
      var crowdCheerT = 0;
      var popText = null;
      var particles = [];
      var shockwaves = [];
      var flyingHelmets = [];

      var hammer = {
        x: 920,
        y: 480,
        swingT: 0,
        swinging: false
      };

      function triggerShake(mag, dur) {
        camShakeMag = Math.min(8, mag || 5);
        camShakeT = Math.min(0.28, dur || 0.18);
      }

      function addParticles(x, y, count, cols, speed) {
        for (var i = 0; i < count; i++) {
          var a = Math.random() * Math.PI * 2;
          var s = (speed || 190) * (0.4 + Math.random() * 0.9);
          particles.push({
            x: x, y: y,
            vx: Math.cos(a) * s,
            vy: Math.sin(a) * s - 80,
            r: 5 + Math.random() * 6,
            c: cols[i % cols.length],
            t: 0,
            life: 0.45 + Math.random() * 0.35
          });
        }
      }

      function screenToWorld(clientX, clientY) {
        var r = cv.getBoundingClientRect();
        return {
          x: ((clientX - r.left) / Math.max(1, r.width)) * VW,
          y: ((clientY - r.top) / Math.max(1, r.height)) * VH
        };
      }
      function worldToClient(wx, wy) {
        var r = cv.getBoundingClientRect();
        return {
          x: r.left + (wx / VW) * r.width,
          y: r.top + (wy / VH) * r.height
        };
      }

      function fitCanvas() {
        var dpr = Math.min(2, root.devicePixelRatio || 1);
        cv.width = Math.round(VW * dpr);
        cv.height = Math.round(VH * dpr);
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      fitCanvas();
      root.addEventListener('resize', fitCanvas);

      function updateBanner(title, sub, compact) {
        var t = T[turn] || T[0];
        banner.style.setProperty('--c', (t && t.color) || '#38bdf8');
        banner.innerHTML = '';
        if (t && t.mon) banner.appendChild(U().monFace(t.mon, 42));
        banner.appendChild(U().h('b', { text: title }));
        if (sub) banner.appendChild(U().h('span', { class: 'gm-real3-sub', text: sub }));
        banner.className = 'gm-real3-banner in' + (compact ? ' compact' : '');
      }

      function extractTargetAndDecoys(item) {
        var ans = '';
        var prompt = '';
        if (item) {
          prompt = item.q ? U().qText(item) : (item.prompt || item.word || item.clue || 'Target Word');
          if (item.opts && typeof item.a === 'number' && item.opts[item.a]) {
            ans = String(item.opts[item.a]);
          } else if (item.a !== undefined && item.a !== null) {
            ans = String(item.a);
          } else if (item.word) {
            ans = String(item.word);
          } else if (item.ans) {
            ans = String(item.ans);
          }
        }
        if (!ans) ans = 'STAR';

        /* Gather decoy words from item.w, item.opts, and the active question set in GM.sets */
        var decoys = [];
        if (item && Array.isArray(item.w)) {
          item.w.forEach(function (w) {
            if (w && String(w) !== ans && decoys.indexOf(String(w)) < 0) decoys.push(String(w));
          });
        }
        if (item && Array.isArray(item.opts)) {
          item.opts.forEach(function (o, idx) {
            if (idx !== item.a && o && String(o) !== ans && decoys.indexOf(String(o)) < 0) decoys.push(String(o));
          });
        }
        var activeSet = (GM.sets || []).filter(function (s) { return s.id === (st && st.setId); })[0] || (GM.sets && GM.sets[0]);
        var allItems = (activeSet && activeSet.items) || (st && st.items) || [];
        allItems.forEach(function (it) {
          var w = (it.opts && typeof it.a === 'number') ? it.opts[it.a] : (it.a || it.word || it.ans);
          if (w && String(w) !== ans && decoys.indexOf(String(w)) < 0) {
            decoys.push(String(w));
          }
          if (Array.isArray(it.w)) {
            it.w.forEach(function (op) {
              if (op && String(op) !== ans && decoys.indexOf(String(op)) < 0) decoys.push(String(op));
            });
          }
        });
        var fallbacks = ['apple', 'banana', 'tiger', 'rocket', 'castle', 'pencil', 'monkey', 'rainbow', 'cloudy', 'pirate'];
        fallbacks.forEach(function (fb) {
          if (fb.toLowerCase() !== ans.toLowerCase() && decoys.indexOf(fb) < 0) decoys.push(fb);
        });
        return { target: ans, prompt: prompt, decoys: decoys };
      }

      function clearMoles() {
        moles.forEach(function (m) {
          m.state = 'down';
          m.pop = 0;
          m.timer = 0;
        });
      }

      function showTurn() {
        var t = T[turn];
        phase = 'wait';
        phaseT = 0;
        clearMoles();
        U().teamBar(T, turn);
        updateBanner(t.name + '\u2019s Whack Wave!', 'Wave ' + (waveNo + 1) + ' of ' + totalWaves, false);
        dock.innerHTML = '';
        var askBtn = U().h('button', {
          type: 'button',
          class: 'gm-real3-btn amber pulse',
          text: '❓ Ask & Start Wave! (Space)'
        });
        askBtn.addEventListener('click', function () {
          A().play('tap');
          askQuestion();
        });
        dock.appendChild(askBtn);
      }

      async function askQuestion() {
        if (asking || phase !== 'wait' || !alive) return;
        asking = true;
        dock.innerHTML = '';
        var t = T[turn];
        var item = ctx.nextItem();
        var res = await U().ask(item, t, {
          timer: +ctx.cfg.timer || 0,
          label: 'Wave ' + (waveNo + 1) + ' of ' + totalWaves
        });
        asking = false;
        if (!alive) return;

        if (!res || !res.ok) {
          phase = 'shrug';
          phaseT = 0;
          A().play('crowd_aww_soft');
          var sp = worldToClient(210, 560);
          U().floatText('Nice try! 😊', { getBoundingClientRect: function () { return { left: sp.x, top: sp.y, width: 0, height: 0 }; } }, 'soft');
          updateBanner('😊 Nice try, ' + t.name + '!', 'Next team is up!', false);
          waveNo++;
          setTimeout(function () {
            if (!alive) return;
            if (waveNo >= totalWaves) { startFinale(); return; }
            turn = (turn + 1) % nt;
            showTurn();
          }, 1450);
          return;
        }

        /* Start 15-Second Whack Wave! */
        var wd = extractTargetAndDecoys(item);
        targetWord = wd.target;
        targetPrompt = wd.prompt;
        decoyPool = wd.decoys;
        wavePts = 10; /* Base +10 for answering the question right */
        waveHits = 0;
        combo = 1;
        stunT = 0;
        waveTimeLeft = SP.waveSec;
        spawnCd = 0.15;
        phase = 'wave';
        phaseT = 0;
        clearMoles();
        A().play('round_start');
        updateBanner('🔨 WHACK ONLY: "' + targetWord + '"!', 'Avoid wrong decoy words! Crack 2-hit Boss Moles!', true);
      }

      function spawnMole(forceTarget) {
        var free = moles.filter(function (m) { return m.state === 'down'; });
        if (!free.length) return;
        var m = free[Math.floor(Math.random() * free.length)];
        var activeTargets = moles.filter(function (x) { return x.state !== 'down' && x.isTarget; }).length;
        var isTarget = forceTarget || (activeTargets === 0 ? true : Math.random() < 0.56);

        m.state = 'rising';
        m.pop = 0;
        m.timer = 0;
        m.isTarget = isTarget;
        m.isBoss = isTarget && Math.random() < 0.26;
        m.hp = m.isBoss ? 2 : 1;
        m.upDur = SP.upDur * (m.isBoss ? 1.28 : (0.85 + Math.random() * 0.3));
        m.critterIdx = Math.floor(Math.random() * 3);

        if (isTarget) {
          m.word = targetWord;
        } else {
          m.word = decoyPool[Math.floor(Math.random() * decoyPool.length)] || 'WRONG';
        }
        A().play('mole_pop');
      }

      function tryWhackAt(wx, wy) {
        if (phase !== 'wave' || !alive) return;
        hammer.x = wx;
        hammer.y = wy;
        hammer.swinging = true;
        hammer.swingT = 0;

        if (stunT > 0) {
          A().play('boing');
          return;
        }

        /* Check front-most popped mole under tap (iterate from front row to back row) */
        var hitMole = null;
        for (var i = moles.length - 1; i >= 0; i--) {
          var m = moles[i];
          if (m.state === 'down' || m.state === 'bonked' || m.pop < 0.25) continue;
          var hx = m.hole.x;
          var hy = m.hole.y - m.pop * 95 * m.hole.sc;
          var hitR = 112 * m.hole.sc;
          if (Math.hypot(wx - hx, wy - hy) <= hitR) {
            hitMole = m;
            break;
          }
        }

        if (!hitMole) {
          /* Whiff on empty grass */
          A().play('tap');
          shockwaves.push({ x: wx, y: wy, r: 12, maxR: 64, t: 0, c: 'rgba(255,255,255,0.45)' });
          return;
        }

        var mx = hitMole.hole.x;
        var my = hitMole.hole.y - hitMole.pop * 95 * hitMole.hole.sc;
        var clientPt = worldToClient(mx, my - 40);
        var fakeEl = { getBoundingClientRect: function () { return { left: clientPt.x, top: clientPt.y, width: 0, height: 0 }; } };

        if (hitMole.isTarget) {
          if (hitMole.hp > 1) {
            /* 1st hit on Hard-Hat Boss Mole cracks & knocks helmet off! */
            hitMole.hp = 1;
            hitMole.timer = Math.max(0, hitMole.timer - 0.45);
            A().play('hit_rim');
            triggerShake(5, 0.16);
            flyingHelmets.push({ x: mx, y: my - 55, vx: (Math.random() > 0.5 ? 1 : -1) * 240, vy: -320, rot: 0, t: 0 });
            shockwaves.push({ x: mx, y: my, r: 16, maxR: 110, t: 0, c: '#fde047' });
            U().floatText('🪖 HELMET CRACKED! TAP AGAIN!', fakeEl, 'good');
            return;
          }

          /* Successful Target Whack! */
          hitMole.state = 'bonked';
          hitMole.bonkT = 0;
          waveHits++;
          var gain = hitMole.isBoss ? 20 : (combo === 1 ? 5 : (combo === 2 ? 10 : 15));
          wavePts += gain;
          combo = Math.min(3, combo + 1);
          crowdCheerT = 0.85;

          A().play('whack_bonk');
          A().play('coin_collect');
          if (hitMole.isBoss || combo >= 3) A().play('sparkle');
          triggerShake(hitMole.isBoss ? 7 : 5, 0.2);
          shockwaves.push({ x: mx, y: my, r: 18, maxR: hitMole.isBoss ? 150 : 110, t: 0, c: hitMole.isBoss ? '#fde047' : '#4ade80' });
          addParticles(mx, my - 25, hitMole.isBoss ? 28 : 18, ['#fde047', '#4ade80', '#38bdf8', '#ffffff'], 240);

          var tag = hitMole.isBoss ? ('🌟 BOSS +' + gain + '!') : ('+' + gain + (combo > 1 ? ' (x' + combo + ' 🔥)' : ''));
          U().floatText(tag, fakeEl, 'good');
        } else {
          /* Whacked a WRONG Decoy Word! Reset combo & stun hammer for 0.55s (soft-fail: 0 pts deducted) */
          hitMole.state = 'hiding';
          combo = 1;
          stunT = 0.55;
          A().play('boing');
          A().play('crowd_aww_soft');
          triggerShake(5, 0.18);
          shockwaves.push({ x: mx, y: my, r: 16, maxR: 95, t: 0, c: '#fb923c' });
          addParticles(mx, my - 20, 14, ['#fb923c', '#fde047', '#94a3b8'], 160);
          U().floatText('💫 WRONG WORD! Read carefully!', fakeEl, 'soft');
        }
      }

      function finishWave() {
        phase = 'summary';
        phaseT = 0;
        clearMoles();
        var activeTurn = turn;
        var totalPts = Math.max(10, wavePts);
        crowdCheerT = 1.5;

        if (totalPts >= 45) {
          A().play('crowd_roar_big');
          A().play('sparkle');
          U().confetti(34);
        } else {
          A().play('crowd_cheer_small');
        }

        popText = { txt: '🔨 WAVE CLEAR! +' + totalPts + ' PTS!', col: '#fde047', t: 0 };
        updateBanner('🎉 ' + T[activeTurn].name + ' scored +' + totalPts + '!', waveHits + ' target moles whacked!', false);

        var centerClient = worldToClient(890, 560);
        flyScoreToPod(centerClient, activeTurn, totalPts, function () {
          if (!alive) return;
          U().addScore(activeTurn, totalPts);
        });

        waveNo++;
        setTimeout(function () {
          if (!alive) return;
          if (waveNo >= totalWaves) {
            startFinale();
            return;
          }
          turn = (turn + 1) % nt;
          showTurn();
        }, 2000);
      }

      function startFinale() {
        if (ended) return;
        phase = 'finale';
        phaseT = 0;
        dock.innerHTML = '';
        updateBanner('🏆 Whack-a-Word Finale!', 'Awesome reading & reflexes!', false);
        A().play('crowd_roar_big');
        A().play('win_fanfare');
        U().confetti(44);
        setTimeout(function () {
          if (!alive || ended) return;
          ended = true;
          ctx.end();
        }, 1750);
      }

      /* Input Listeners */
      function onPointerMove(e) {
        if (!alive) return;
        var pt = screenToWorld(e.clientX, e.clientY);
        hammer.x = pt.x;
        hammer.y = pt.y;
      }
      function onPointerDown(e) {
        if (!alive) return;
        if (e.target && e.target.closest && e.target.closest('.gm-real3-dock')) return;
        var pt = screenToWorld(e.clientX, e.clientY);
        if (phase === 'wave') {
          e.preventDefault();
          tryWhackAt(pt.x, pt.y);
        }
      }
      function onKeyDown(e) {
        if (!alive) return;
        if (e.code === 'Space' || e.key === ' ') {
          if (document.querySelector('.gm-over')) return;
          if (phase === 'wait' && !asking) {
            e.preventDefault();
            askQuestion();
          }
        }
      }
      wrap.addEventListener('pointermove', onPointerMove);
      wrap.addEventListener('pointerdown', onPointerDown);
      root.addEventListener('keydown', onKeyDown);

      ctx.onEnd(function () {
        alive = false;
        cancelAnimationFrame(rafId);
        root.removeEventListener('resize', fitCanvas);
        root.removeEventListener('keydown', onKeyDown);
        if (document.body) document.body.classList.remove('gm-small-pods', 'gm-real3-active');
      });

      /* ---- Drawing Helpers ---- */
      function drawLawnAndMascot(now) {
        var bg = hal ? (imgReady(artBgHal) ? artBgHal : artBgClassic) : artBgClassic;
        if (imgReady(bg)) {
          g.drawImage(bg, 0, 0, VW, VH);
          g.fillStyle = hal ? 'rgba(18, 6, 36, 0.34)' : 'rgba(6, 20, 14, 0.16)';
          g.fillRect(0, 0, VW, VH);
        } else {
          var lg = g.createLinearGradient(0, 0, 0, VH);
          lg.addColorStop(0, hal ? '#1e1b4b' : '#38bdf8');
          lg.addColorStop(0.35, hal ? '#14532d' : '#22c55e');
          lg.addColorStop(1, hal ? '#052e16' : '#15803d');
          g.fillStyle = lg;
          g.fillRect(0, 0, VW, VH);
        }

        /* Decorative 3D Bushes (o_bush.webp) for depth */
        if (imgReady(artBush)) {
          [
            { x: 330, y: 365, w: 150, h: 95 },
            { x: 1445, y: 375, w: 160, h: 100 },
            { x: 265, y: 785, w: 185, h: 115 }
          ].forEach(function (b) {
            g.drawImage(artBush, b.x - b.w / 2, b.y - b.h / 2, b.w, b.h);
          });
        }

        /* Big Cheering Team Monster Mascot on Left Lawn */
        var mImg = monImgs[turn];
        var teamCol = (T[turn] && T[turn].color) || '#38bdf8';
        var mSize = 215;
        var mx = 195, my = 595;
        var bob = crowdCheerT > 0
          ? -Math.abs(Math.sin(now / 105)) * 26
          : -Math.abs(Math.sin(now / 260)) * 9;
        var rot = phase === 'shrug' ? Math.sin(now / 130) * 0.14 : Math.sin(now / 320) * 0.05;

        g.save();
        g.translate(mx, my);
        g.fillStyle = 'rgba(15, 23, 42, 0.38)';
        g.beginPath();
        g.ellipse(0, mSize * 0.42, mSize * 0.34, mSize * 0.10, 0, 0, Math.PI * 2);
        g.fill();
        g.strokeStyle = teamCol;
        g.lineWidth = 4;
        g.beginPath();
        g.ellipse(0, mSize * 0.42, mSize * 0.30, mSize * 0.085, 0, 0, Math.PI * 2);
        g.stroke();

        g.translate(0, bob);
        g.rotate(rot);
        if (imgReady(mImg)) {
          g.drawImage(mImg, -mSize / 2, -mSize / 2, mSize, mSize);
        }
        if (phase === 'shrug') {
          drawOutlinedText(g, '😊', mSize * 0.34, -mSize * 0.34, 34, '#fde047', '#0f172a');
        }
        g.restore();
      }

      function drawBurrowAndMole(m, now) {
        var h = m.hole;
        var sc = h.sc;
        var holeW = 235 * sc;
        var holeH = 88 * sc;

        g.save();
        /* 1. Back rim of burrow hole */
        g.fillStyle = '#090d16';
        g.beginPath();
        g.ellipse(h.x, h.y, holeW * 0.44, holeH * 0.34, 0, 0, Math.PI * 2);
        g.fill();
        if (imgReady(artHole)) {
          g.drawImage(artHole, h.x - holeW / 2, h.y - holeH * 0.52, holeW, holeH);
        } else {
          g.strokeStyle = '#78350f';
          g.lineWidth = 10 * sc;
          g.beginPath();
          g.ellipse(h.x, h.y, holeW * 0.46, holeH * 0.36, 0, 0, Math.PI * 2);
          g.stroke();
        }

        /* 2. Clipping region above the hole's front lip so mole emerges from inside the burrow! */
        if (m.state !== 'down' && m.pop > 0.01) {
          g.save();
          g.beginPath();
          g.rect(h.x - holeW * 0.85, h.y - 320 * sc, holeW * 1.7, 326 * sc);
          g.clip();

          var popEase = m.pop;
          var moleY = h.y + (1 - popEase) * 145 * sc - 28 * sc;
          var sqX = 1, sqY = 1;
          if (m.state === 'bonked') {
            sqX = 1.28;
            sqY = 0.68;
          } else {
            sqX = 1 + Math.sin(now / 140 + h.id) * 0.04;
            sqY = 1 - Math.sin(now / 140 + h.id) * 0.04;
          }

          g.translate(h.x, moleY);
          g.scale(sc * sqX, sc * sqY);

          /* Mole Creature Sprite */
          var cIm = critterImgs[m.critterIdx];
          if (imgReady(cIm)) {
            g.drawImage(cIm, -68, -98, 136, 136);
          } else {
            g.fillStyle = '#a16207';
            g.strokeStyle = '#0f172a';
            g.lineWidth = 5;
            g.beginPath();
            g.arc(0, -34, 54, 0, Math.PI * 2);
            g.fill();
            g.stroke();
          }

          /* Golden Hard-Hat on 2-Hit Boss Mole */
          if (m.isBoss && m.hp > 1) {
            g.save();
            g.fillStyle = '#facc15';
            g.strokeStyle = '#0f172a';
            g.lineWidth = 4;
            g.beginPath();
            g.arc(0, -78, 46, Math.PI, 0);
            g.closePath();
            g.fill();
            g.stroke();
            rr(g, -54, -82, 108, 12, 6);
            g.fill();
            g.stroke();
            drawOutlinedText(g, '🪖 2x', 0, -96, 20, '#fde047', '#0f172a');
            g.restore();
          }

          /* Large Readable Word Bubble Sign (o_word_bubble.webp) */
          var signW = Math.max(176, Math.min(265, (m.word || '').length * 22 + 54));
          var signH = 66;
          var signY = -142;
          g.save();
          if (imgReady(artBubble)) {
            g.drawImage(artBubble, -signW / 2, signY - signH / 2, signW, signH);
          }
          g.fillStyle = m.isBoss ? 'rgba(254, 240, 138, 0.96)' : 'rgba(255, 255, 255, 0.96)';
          g.strokeStyle = m.isBoss ? '#ca8a04' : '#0f172a';
          g.lineWidth = 4;
          rr(g, -signW / 2, signY - signH / 2, signW, signH, 16);
          g.fill();
          g.stroke();

          var fontSize = m.word.length > 10 ? 24 : (m.word.length > 7 ? 28 : 32);
          drawOutlinedText(g, m.word, 0, signY, fontSize, '#fde047', '#0f172a');
          g.restore();

          /* Dizzy stars when bonked */
          if (m.state === 'bonked') {
            for (var s = 0; s < 3; s++) {
              var sa = now / 120 + s * 2.09;
              var sx = Math.cos(sa) * 48;
              var sy = -95 + Math.sin(sa) * 14;
              drawOutlinedText(g, '⭐', sx, sy, 24, '#fde047', '#0f172a');
            }
          }

          g.restore();
        }

        g.restore();
      }

      function drawWaveHUD(now) {
        if (phase !== 'wave') return;

        /* Pinned Target Word Badge at Top Left (below top banner) */
        var bx = 24, by = 134, bw = 340, bh = 104;
        g.save();
        g.fillStyle = 'rgba(15, 23, 42, 0.92)';
        g.strokeStyle = '#fde047';
        g.lineWidth = 4;
        rr(g, bx, by, bw, bh, 18);
        g.fill();
        g.stroke();

        drawOutlinedText(g, '🎯 TARGET WORD:', bx + bw / 2, by + 28, 20, '#38bdf8', '#0f172a');
        drawOutlinedText(g, targetWord, bx + bw / 2, by + 68, 36, '#fde047', '#0f172a');

        /* Wave Timer & Combo Streak Badge at Top Right (below top banner) */
        var rx = VW - 324, ry = 134, rw = 300, rh = 104;
        var isFrenzy = waveTimeLeft <= 5.0;
        g.fillStyle = 'rgba(15, 23, 42, 0.92)';
        g.strokeStyle = isFrenzy ? '#f43f5e' : '#4ade80';
        g.lineWidth = 4;
        rr(g, rx, ry, rw, rh, 18);
        g.fill();
        g.stroke();

        var secTxt = Math.ceil(waveTimeLeft) + 's';
        drawOutlinedText(g, (isFrenzy ? '⚡ FRENZY: ' : '⏱ TIME: ') + secTxt, rx + rw / 2, ry + 34, 26, isFrenzy ? '#f43f5e' : '#ffffff', '#0f172a');
        var comboCol = combo === 3 ? '#fde047' : (combo === 2 ? '#4ade80' : '#94a3b8');
        drawOutlinedText(g, '🔥 COMBO x' + combo + '  •  +' + wavePts + ' pts', rx + rw / 2, ry + 78, 24, comboCol, '#0f172a');

        g.restore();
      }

      function drawMallet(now) {
        if (phase !== 'wave') return;
        g.save();
        g.translate(hammer.x, hammer.y);

        var rot = -0.35;
        var sc = 1.0;
        if (hammer.swinging) {
          var u = Math.min(1, hammer.swingT / 0.18);
          rot = u < 0.5 ? (-0.35 - (u / 0.5) * 0.95) : (-1.30 + ((u - 0.5) / 0.5) * 0.95);
          sc = u < 0.5 ? 1.18 : 1.0;
        }
        if (stunT > 0) {
          rot += Math.sin(now / 45) * 0.35;
        }

        g.rotate(rot);
        g.scale(sc, sc);
        if (imgReady(artHammer)) {
          g.drawImage(artHammer, -68, -110, 155, 155);
        } else {
          g.fillStyle = '#f59e0b';
          g.strokeStyle = '#0f172a';
          g.lineWidth = 5;
          rr(g, -45, -85, 90, 50, 12);
          g.fill();
          g.stroke();
        }

        if (stunT > 0) {
          drawOutlinedText(g, '💫 STUNNED!', 0, -115, 24, '#fb923c', '#0f172a');
        }
        g.restore();
      }

      /* ---- 60fps Main Loop ---- */
      var lastNow = performance.now();
      var rafId = 0;

      function frame(now) {
        if (!alive) return;
        var dt = Math.min(0.05, Math.max(0.001, (now - lastNow) / 1000));
        lastNow = now;
        phaseT += dt;
        if (crowdCheerT > 0) crowdCheerT = Math.max(0, crowdCheerT - dt);
        if (stunT > 0) stunT = Math.max(0, stunT - dt);
        if (hammer.swinging) {
          hammer.swingT += dt;
          if (hammer.swingT >= 0.18) hammer.swinging = false;
        }

        /* Update active Whack Wave */
        if (phase === 'wave') {
          waveTimeLeft -= dt;
          if (waveTimeLeft <= 0) {
            waveTimeLeft = 0;
            finishWave();
          } else {
            var isFrenzy = waveTimeLeft <= 5.0;
            spawnCd -= dt;
            if (spawnCd <= 0) {
              spawnMole(false);
              if (isFrenzy && Math.random() < 0.55) spawnMole(true);
              spawnCd = SP.spawnEvery * (isFrenzy ? 0.68 : 1.0);
            }
          }

          moles.forEach(function (m) {
            if (m.state === 'rising') {
              m.pop = Math.min(1, m.pop + dt * 5.2);
              if (m.pop >= 1) {
                m.state = 'up';
                m.timer = 0;
              }
            } else if (m.state === 'up') {
              m.timer += dt;
              if (m.timer >= m.upDur) {
                m.state = 'hiding';
              }
            } else if (m.state === 'bonked') {
              m.bonkT += dt;
              if (m.bonkT >= 0.28) {
                m.state = 'hiding';
              }
            } else if (m.state === 'hiding') {
              m.pop = Math.max(0, m.pop - dt * 5.8);
              if (m.pop <= 0) {
                m.state = 'down';
              }
            }
          });
        }

        /* Update shockwaves, particles, flying helmets */
        shockwaves = shockwaves.filter(function (sw) {
          sw.t += dt;
          sw.r += (sw.maxR - sw.r) * Math.min(1, dt * 12);
          return sw.t < 0.32;
        });
        particles = particles.filter(function (p) {
          p.t += dt;
          p.vy += 480 * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          return p.t < p.life;
        });
        flyingHelmets = flyingHelmets.filter(function (fh) {
          fh.t += dt;
          fh.vy += 680 * dt;
          fh.x += fh.vx * dt;
          fh.y += fh.vy * dt;
          fh.rot += dt * 11;
          return fh.t < 0.65;
        });

        var shakeX = 0, shakeY = 0;
        if (camShakeT > 0) {
          camShakeT = Math.max(0, camShakeT - dt);
          shakeX = (Math.random() * 2 - 1) * camShakeMag;
          shakeY = (Math.random() * 2 - 1) * camShakeMag;
        }

        g.save();
        g.clearRect(0, 0, VW, VH);
        g.translate(shakeX, shakeY);

        drawLawnAndMascot(now);

        /* Draw burrows & moles sorted back-to-front by row */
        for (var i = 0; i < moles.length; i++) {
          drawBurrowAndMole(moles[i], now);
        }

        /* Shockwaves */
        shockwaves.forEach(function (sw) {
          g.save();
          g.globalAlpha = Math.max(0, 1 - sw.t / 0.32);
          g.strokeStyle = sw.c;
          g.lineWidth = 6;
          g.beginPath();
          g.ellipse(sw.x, sw.y, sw.r, sw.r * 0.48, 0, 0, Math.PI * 2);
          g.stroke();
          g.restore();
        });

        /* Flying cracked helmets */
        flyingHelmets.forEach(function (fh) {
          g.save();
          g.translate(fh.x, fh.y);
          g.rotate(fh.rot);
          g.fillStyle = '#facc15';
          g.strokeStyle = '#0f172a';
          g.lineWidth = 4;
          g.beginPath();
          g.arc(0, 0, 38, Math.PI, 0);
          g.closePath();
          g.fill();
          g.stroke();
          g.restore();
        });

        /* Particles */
        particles.forEach(function (p) {
          g.save();
          g.globalAlpha = Math.max(0, 1 - p.t / p.life);
          g.fillStyle = p.c;
          g.beginPath();
          g.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          g.fill();
          g.restore();
        });

        drawWaveHUD(now);
        drawMallet(now);

        if (popText) {
          popText.t += dt;
          if (popText.t > 1.65) {
            popText = null;
          } else {
            var sc = popText.t < 0.22 ? 0.5 + (popText.t / 0.22) * 0.65 : 1.0;
            g.save();
            g.globalAlpha = popText.t > 1.25 ? Math.max(0, 1 - (popText.t - 1.25) / 0.4) : 1;
            g.translate(890, 240);
            g.scale(sc, sc);
            drawOutlinedText(g, popText.txt, 0, 0, 54, popText.col, '#0f172a');
            g.restore();
          }
        }

        g.restore();
        rafId = requestAnimationFrame(frame);
      }

      showTurn();
      rafId = requestAnimationFrame(frame);
    }
  };
})(window);
