/* ============================================================================
 * Game Maker — Mode: Memory Match (mode-memory.js) — "Real Game" Edition
 * Full-screen living tabletop scene with big animated team monsters on the
 * left & right of the table, tactile 3D flip cards (o_card_back.webp),
 * canvas particle bursts, flying score orbs, and smartboard Quick Flip dock.
 * Match = read the full sentence aloud (+20 pts) and go again!
 * Mismatch = cards stay visible 1.15s, team gets +5 for trying, next team's turn.
 * Plain ES5 JavaScript (var, function, no arrow functions or classes).
 * ============================================================================ */
(function () {
  'use strict';

  var GM = window.GM;
  var U = function () { return GM.u; };
  var A = function () { return GM.audio; };
  var J = function () { return GM.juice; };

  var ART_PATHS = {
    bg_table: 'art/bg_classic_memory.webp',
    card_back: 'art/o_card_back.webp',
    star_coin: 'art/o_star_coin.webp',
    lantern: 'art/o_candle_lantern.webp',
    ghost: 'art/c_ghost.webp',
    bat: 'art/c_bat.webp'
  };

  var IMG_CACHE = {};
  var MON_IMG_CACHE = {};

  function getImg(key) {
    if (IMG_CACHE[key]) return IMG_CACHE[key];
    var url = ART_PATHS[key];
    if (!url) return null;
    var im = new Image();
    im.decoding = 'async';
    im.src = url;
    IMG_CACHE[key] = im;
    return im;
  }

  function imgReady(im) {
    return !!(im && im.complete && im.naturalWidth > 0);
  }

  function getMonImg(monObj) {
    var key = typeof monObj === 'string' ? monObj : (monObj && (monObj.id || monObj.name) ? (monObj.id || monObj.name) : JSON.stringify(monObj || 'm01'));
    if (MON_IMG_CACHE[key]) return MON_IMG_CACHE[key];
    if (!GM || !GM.mon || typeof GM.mon.svg !== 'function') return null;
    var svg = GM.mon.svg(monObj, 220);
    if (!svg || svg.indexOf('<svg') < 0) return null;
    if (svg.indexOf('xmlns=') < 0) {
      svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    var im = new Image();
    im.decoding = 'async';
    im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    MON_IMG_CACHE[key] = im;
    return im;
  }

  function preloadMemoryArt() {
    var k;
    for (k in ART_PATHS) {
      if (Object.prototype.hasOwnProperty.call(ART_PATHS, k)) getImg(k);
    }
  }

  function isHalloween() {
    return (GM && GM.state && GM.state.theme === 'halloween') ||
           (document.body && document.body.classList.contains('gm-theme-halloween'));
  }

  function makeFullSentence(q, a) {
    var qs = String(q || '');
    var as = String(a || '');
    if (qs.indexOf('___') !== -1) {
      return qs.replace(/_{2,}/g, as);
    }
    return qs + ' — ' + as;
  }

  function roundRectPath(g, x, y, w, h, r) {
    var rr = Math.min(r, w * 0.5, h * 0.5);
    g.beginPath();
    g.moveTo(x + rr, y);
    g.arcTo(x + w, y, x + w, y + h, rr);
    g.arcTo(x + w, y + h, x, y + h, rr);
    g.arcTo(x, y + h, x, y, rr);
    g.arcTo(x, y, x + w, y, rr);
    g.closePath();
  }

  GM.modes.memory = {
    id: 'memory',
    name: 'Memory Match',
    e: '🃏',
    desc: 'Flip two cards on the living tabletop to match a Question with its Answer, then read the full sentence aloud!',
    fields: [
      { k: 'pairs', key: 'pairs', l: 'Card pairs', label: 'Card pairs', type: 'select', opts: [[6, '6 pairs (12 cards)'], [8, '8 pairs (16 cards)'], [10, '10 pairs (20 cards)']], def: 6, default: 6 }
    ],

    start: function (ctx) {
      preloadMemoryArt();

      var T = (GM.state && GM.state.teams && GM.state.teams.length) ? GM.state.teams : [
        { name: 'Team 1', color: '#38bdf8', mon: 'm01', score: 0 },
        { name: 'Team 2', color: '#f59e0b', mon: 'm02', score: 0 }
      ];
      var ti;
      for (ti = 0; ti < T.length; ti++) {
        getMonImg(T[ti].mon);
      }

      var numPairs = +(ctx.cfg && ctx.cfg.pairs) || 6;
      if (numPairs < 4) numPairs = 6;
      if (numPairs > 12) numPairs = 10;
      var totalCards = numPairs * 2;
      // 12 cards -> 4x3, 16 cards -> 4x4, 20 cards -> 5x4 (always full rectangular grid)
      var cols = totalCards <= 16 ? 4 : 5;
      var rows = Math.ceil(totalCards / cols);

      var turn = 0;
      var matchedPairs = 0;
      var flipped = [];
      var busy = false;
      var ended = false;
      var activeAloudDone = null;
      var timers = [];
      var activeOrbs = [];

      // Character animation state ('idle', 'peek', 'check', 'celebrate', 'shrug', 'finale')
      var charPose = 'idle';
      var charPoseTimer = 0;
      var charBubble = 'Pick 2 cards!';
      var buddyPose = 'idle';

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

      // Build pairs from ctx.nextItem()
      var deck = [];
      var p;
      for (p = 0; p < numPairs; p++) {
        var it = ctx.nextItem() || { q: 'Question ' + (p + 1), a: 'Answer ' + (p + 1) };
        var fullSent = makeFullSentence(it.q, it.a);
        deck.push({
          pairId: p,
          kind: 'q',
          text: String(it.q || ''),
          full: fullSent,
          matched: false,
          faceUp: false,
          mismatch: false,
          el: null
        });
        deck.push({
          pairId: p,
          kind: 'a',
          text: String(it.a || ''),
          rawAns: String(it.a || ''),
          full: fullSent,
          matched: false,
          faceUp: false,
          mismatch: false,
          el: null
        });
      }
      deck = U().shuffle(deck);

      // 1. Build Full-Screen Scene + Canvas + Banner + 3D Card Board + Bottom Dock
      ctx.root.innerHTML = '';
      var scene = U().h('div', { class: 'gm-real3-scene gm-mem-scene' });
      var cv = U().h('canvas', { class: 'gm-real3-cv' });
      scene.appendChild(cv);

      var banner = U().h('div', { class: 'gm-real3-banner in' });
      scene.appendChild(banner);

      var board = U().h('div', {
        class: 'gm-mem-real3-board',
        style: 'grid-template-columns:repeat(' + cols + ', 1fr);grid-template-rows:repeat(' + rows + ', 1fr);'
      });
      scene.appendChild(board);

      var dock = U().h('div', { class: 'gm-real3-dock' });
      var quickBtn = U().h('button', {
        class: 'gm-real3-btn amber pulse',
        type: 'button',
        onclick: function () { onQuickFlip(); }
      }, ['⚡ Quick Flip! (Space)']);
      dock.appendChild(quickBtn);
      scene.appendChild(dock);

      ctx.root.appendChild(scene);

      // 2. Render 3D Cards
      function buildCardDom(card, idx) {
        var btn = U().h('button', {
          class: 'gm-mem-card3d gm-mem-card face-down ' + (card.kind === 'a' ? 'is-a is-ans' : 'is-q'),
          type: 'button',
          'data-idx': String(idx),
          'data-pair': String(card.pairId),
          onclick: function () { onTapCard(idx); }
        });

        var inner = U().h('div', { class: 'gm-mem-card3d-inner gm-mem-inner' });

        // Back face (face-down)
        var backFace = U().h('div', { class: 'gm-mem-face gm-mem-face-back' }, [
          U().h('img', {
            class: 'gm-mem-back-img',
            src: ART_PATHS.card_back,
            alt: '',
            draggable: 'false'
          }),
          U().h('div', { class: 'gm-mem-back-sheen' }),
          U().h('span', { class: 'gm-mem-num-badge gm-mem-num' }, [String(idx + 1)])
        ]);

        // Front face (face-up)
        var kindPill;
        if (card.kind === 'a') {
          kindPill = U().h('span', { class: 'gm-mem-kind-pill' }, [
            U().h('img', { src: ART_PATHS.star_coin, alt: '⭐' }),
            U().h('span', {}, ['ANSWER'])
          ]);
        } else {
          kindPill = U().h('span', { class: 'gm-mem-kind-pill' }, ['❓ QUESTION']);
        }

        var frontFace = U().h('div', { class: 'gm-mem-face gm-mem-face-front' }, [
          U().h('span', { class: 'gm-mem-num-badge', style: 'top:5px;left:7px;min-width:28px;height:28px;font-size:15px;' }, [String(idx + 1)]),
          kindPill,
          U().h('div', { class: 'gm-mem-front-text gm-mem-text' }, [card.text])
        ]);

        inner.appendChild(backFace);
        inner.appendChild(frontFace);
        btn.appendChild(inner);

        card.el = btn;
        card.kindPillEl = kindPill;
        return btn;
      }

      function syncCardDom(card) {
        if (!card || !card.el) return;
        var cls = 'gm-mem-card3d gm-mem-card ' + (card.kind === 'a' ? 'is-a is-ans' : 'is-q');
        if (card.matched) {
          cls += ' is-matched matched';
          if (card.kindPillEl) card.kindPillEl.textContent = '✓ MATCH!';
        } else if (card.faceUp) {
          cls += ' is-flipped face-up';
        } else {
          cls += ' face-down';
        }
        if (card.mismatch) {
          cls += ' is-mismatch';
        }
        card.el.className = cls;
      }

      var ci;
      for (ci = 0; ci < deck.length; ci++) {
        board.appendChild(buildCardDom(deck[ci], ci));
      }

      // 3. HUD & Quick Flip Button Updater
      function renderHud() {
        var t = T[turn] || T[0];
        banner.style.setProperty('--c', t.color || '#38bdf8');
        banner.innerHTML = '';
        banner.appendChild(U().monFace(t.mon, 42));
        banner.appendChild(U().h('b', { text: t.name + ' — Flip 2 Cards!' }));
        banner.appendChild(U().h('span', { class: 'gm-real3-sub', text: 'Pairs: ' + matchedPairs + ' / ' + numPairs }));
        banner.classList.add('in');

        if (quickBtn) {
          if (activeAloudDone) {
            quickBtn.textContent = '🗣️ We Read It Aloud! (+20) [Space]';
            quickBtn.className = 'gm-real3-btn green pulse';
          } else if (flipped.length === 1) {
            quickBtn.textContent = '⚡ Flip 2nd Card! (Space)';
            quickBtn.className = 'gm-real3-btn cyan pulse';
          } else {
            quickBtn.textContent = '⚡ Quick Flip! (Space)';
            quickBtn.className = 'gm-real3-btn amber pulse';
          }
        }

        U().teamBar(T, turn);
      }

      // 4. Flying Score Orb helper (awards score immediately, animates orb to team pod)
      function flyScoreToPod(sourceEl, teamIdx, label, pts) {
        U().addScore(teamIdx, pts);
        if (A()) A().play('coin_collect');

        var rect = sourceEl && sourceEl.getBoundingClientRect ? sourceEl.getBoundingClientRect() : {
          left: window.innerWidth * 0.5,
          top: window.innerHeight * 0.5,
          width: 0,
          height: 0
        };
        var sx = rect.left + rect.width * 0.5;
        var sy = rect.top + rect.height * 0.5;

        var orb = U().h('div', {
          class: 'gm-score-orb',
          text: label,
          style: 'left:' + sx + 'px;top:' + sy + 'px;'
        });
        document.body.appendChild(orb);
        activeOrbs.push(orb);

        var pods = document.querySelectorAll('.gm-teams .gm-pod');
        var pod = pods && pods[teamIdx] ? pods[teamIdx] : null;
        var tx = sx;
        var ty = window.innerHeight - 54;
        if (pod && pod.getBoundingClientRect) {
          var pr = pod.getBoundingClientRect();
          tx = pr.left + pr.width * 0.5;
          ty = pr.top + pr.height * 0.5;
        }

        requestAnimationFrame(function () {
          orb.style.left = tx + 'px';
          orb.style.top = ty + 'px';
          orb.style.transform = 'translate(-50%, -50%) scale(0.75)';
          orb.style.opacity = '0.2';
        });

        setTimeout(function () {
          if (orb.parentNode) orb.parentNode.removeChild(orb);
        }, 560);
      }

      // 5. Canvas Particle & Burst System
      var W = 1366;
      var H = 768;
      var dpr = 1;
      var g = cv.getContext('2d');
      var particles = [];
      var motes = [];
      var mi;
      for (mi = 0; mi < 26; mi++) {
        motes.push({
          x: Math.random(),
          y: Math.random(),
          r: 2 + Math.random() * 3.5,
          vy: -0.012 - Math.random() * 0.018,
          vx: (Math.random() - 0.5) * 0.01,
          phase: Math.random() * Math.PI * 2
        });
      }

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

      function spawnCardBurst(cardEl, color, count) {
        var cx = W * 0.5;
        var cy = H * 0.5;
        if (cardEl && cardEl.getBoundingClientRect) {
          var cr = cardEl.getBoundingClientRect();
          cx = cr.left + cr.width * 0.5;
          cy = cr.top + cr.height * 0.5;
        }
        var n = count || 18;
        var palette = [color || '#fde047', '#38bdf8', '#34d399', '#f59e0b', '#fb7185', '#ffffff'];
        var k;
        for (k = 0; k < n; k++) {
          var ang = (Math.PI * 2 * k) / n + (Math.random() - 0.5) * 0.35;
          var spd = 90 + Math.random() * 210;
          particles.push({
            x: cx,
            y: cy,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd - 60,
            r: 5 + Math.random() * 6,
            color: palette[k % palette.length],
            life: 0.75 + Math.random() * 0.35,
            maxLife: 1.0,
            rot: Math.random() * Math.PI * 2,
            vrot: (Math.random() - 0.5) * 8
          });
        }
      }

      // 6. Read-Aloud Celebration Drawer on Match
      function showReadAloudDrawer(sentenceText, c1, c2, onDone) {
        if (A()) A().speak(sentenceText);

        var drawer = U().h('div', { class: 'gm-mem-aloud-drawer gm-mem-aloud' });
        function finishReadAloud() {
          if (!activeAloudDone) return;
          var cb = activeAloudDone;
          activeAloudDone = null;
          if (drawer.parentNode) drawer.parentNode.removeChild(drawer);
          cb();
        }
        activeAloudDone = onDone;
        renderHud();

        var cardBox = U().h('div', { class: 'gm-mem-aloud-card gm-mem-aloud-box' }, [
          U().h('div', { class: 'gm-mem-aloud-title' }, ['🎉 MATCH FOUND! Read the full sentence aloud:']),
          U().h('div', { class: 'gm-mem-aloud-sentence-pill gm-mem-aloud-sentence' }, [sentenceText]),
          U().h('div', { style: 'display:flex;gap:16px;flex-wrap:wrap;justify-content:center;' }, [
            U().h('button', {
              class: 'gm-real3-btn cyan',
              type: 'button',
              onclick: function () {
                if (A()) A().speak(sentenceText);
              }
            }, ['🔊 Listen Again']),
            U().h('button', {
              class: 'gm-real3-btn green pulse gm-btn-go',
              type: 'button',
              onclick: function () {
                finishReadAloud();
              }
            }, ['🗣️ We Read It Aloud! (+20)'])
          ])
        ]);

        drawer.appendChild(cardBox);
        scene.appendChild(drawer);
      }

      // 7. Card Flip & Match/Mismatch Gameplay Loop
      function onTapCard(idx) {
        if (busy || ended || activeAloudDone) return;
        var card = deck[idx];
        if (!card || card.faceUp || card.matched) return;

        card.faceUp = true;
        syncCardDom(card);
        spawnCardBurst(card.el, T[turn] ? T[turn].color : '#38bdf8', 12);

        if (J() && J().squash && card.el) J().squash(card.el, 1.08, 0.94, 200);
        if (A()) {
          A().play('card_turn');
          A().play('page_slide');
        }

        flipped.push({ card: card, idx: idx });

        if (flipped.length === 1) {
          charPose = 'peek';
          charPoseTimer = 2.5;
          charBubble = 'Find its partner!';
          buddyPose = 'peek';
          renderHud();
          return;
        }

        // 2 cards flipped!
        busy = true;
        charPose = 'check';
        buddyPose = 'check';
        renderHud();

        var c1 = flipped[0].card, i1 = flipped[0].idx;
        var c2 = flipped[1].card, i2 = flipped[1].idx;
        flipped = [];

        if (c1.pairId === c2.pairId) {
          // MATCH!
          c1.matched = true;
          c2.matched = true;
          matchedPairs++;
          syncCardDom(c1);
          syncCardDom(c2);

          charPose = 'celebrate';
          charPoseTimer = 3.2;
          charBubble = 'MATCH! +20! 🎉';
          buddyPose = 'celebrate';

          spawnCardBurst(c1.el, '#34d399', 24);
          spawnCardBurst(c2.el, '#fde047', 24);

          if (A()) {
            A().play('card_match');
            A().play('sparkle');
            A().play('crowd_roar_big');
          }

          setTimeoutSafe(function () {
            showReadAloudDrawer(c1.full, c1, c2, function () {
              if (ended) return;
              U().floatText('+20', c2.el, 'good');
              flyScoreToPod(c2.el, turn, '+20', 20);
              U().confetti(24);
              if (J()) J().react(turn, 'big');

              if (matchedPairs >= numPairs) {
                ended = true;
                charPose = 'finale';
                buddyPose = 'finale';
                charBubble = 'ALL MATCHED! 🏆';
                if (A()) {
                  A().play('victory_fanfare');
                  A().play('cheer_kids');
                }
                setTimeout(function () { ctx.end(); }, 750);
                return;
              }

              // Same team goes again on a match!
              charPose = 'idle';
              buddyPose = 'idle';
              charBubble = 'Go again! 🌟';
              busy = false;
              renderHud();
            });
          }, 340);
        } else {
          // MISMATCH — keep visible 1.15s, gentle wobble, award +5 for trying!
          charPose = 'shrug';
          charPoseTimer = 1.6;
          charBubble = 'Good try! +5 😊';
          buddyPose = 'idle';

          setTimeoutSafe(function () {
            c1.mismatch = true;
            c2.mismatch = true;
            syncCardDom(c1);
            syncCardDom(c2);
            if (A()) A().play('crowd_aww_soft');
          }, 260);

          setTimeoutSafe(function () {
            c1.faceUp = false;
            c2.faceUp = false;
            c1.mismatch = false;
            c2.mismatch = false;
            syncCardDom(c1);
            syncCardDom(c2);
            if (A()) A().play('wood_knock');

            U().floatText('Good try! +5', c2.el, 'good');
            flyScoreToPod(c2.el, turn, '+5', 5);

            var prevTurn = turn;
            setTimeoutSafe(function () {
              turn = (prevTurn + 1) % T.length;
              charPose = 'idle';
              buddyPose = 'idle';
              charBubble = 'Pick 2 cards!';
              busy = false;
              renderHud();
            }, 420);
          }, 1150);
        }
      }

      // 8. Smartboard Quick Flip Helper (for pupils who can't reach high cards or press Space)
      function onQuickFlip() {
        if (ended) return;
        if (activeAloudDone) {
          var drawerBtn = scene.querySelector('.gm-mem-aloud-drawer .gm-btn-go');
          if (drawerBtn) drawerBtn.click();
          return;
        }
        if (busy) return;

        var candidates = [];
        var partnerIdx = -1;
        var openCard = flipped.length === 1 ? flipped[0].card : null;
        var i;
        for (i = 0; i < deck.length; i++) {
          if (!deck[i].matched && !deck[i].faceUp) {
            candidates.push(i);
            if (openCard && deck[i].pairId === openCard.pairId) {
              partnerIdx = i;
            }
          }
        }
        if (!candidates.length) return;

        var chosenIdx;
        if (partnerIdx !== -1 && Math.random() < 0.5) {
          chosenIdx = partnerIdx;
        } else {
          chosenIdx = candidates[Math.floor(Math.random() * candidates.length)];
        }
        onTapCard(chosenIdx);
      }

      function onKeyDown(e) {
        if (ended) return;
        if (e.code === 'Space' || e.key === ' ' || e.code === 'Enter') {
          var tag = e.target && e.target.tagName ? e.target.tagName.toUpperCase() : '';
          if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
          e.preventDefault();
          onQuickFlip();
        }
      }
      window.addEventListener('keydown', onKeyDown);

      // 9. 60fps Canvas Render Loop (Living Tabletop + Big Left/Right Team Monsters)
      var rafId = 0;
      var lastTs = performance.now();
      var elapsed = 0;

      function drawTableBackground(hal, tSec) {
        var bgIm = getImg('bg_table');
        if (imgReady(bgIm)) {
          var iw = bgIm.naturalWidth;
          var ih = bgIm.naturalHeight;
          var scale = Math.max(W / iw, H / ih);
          var dw = iw * scale;
          var dh = ih * scale;
          g.drawImage(bgIm, (W - dw) * 0.5, (H - dh) * 0.5, dw, dh);
        } else {
          var fallbackGrad = g.createLinearGradient(0, 0, 0, H);
          fallbackGrad.addColorStop(0, '#78350f');
          fallbackGrad.addColorStop(1, '#451a03');
          g.fillStyle = fallbackGrad;
          g.fillRect(0, 0, W, H);
        }

        if (hal) {
          // Bright enchanted purple-indigo Halloween wizard table tint (>=60% brightness)
          var halTint = g.createRadialGradient(W * 0.5, H * 0.48, H * 0.12, W * 0.5, H * 0.5, W * 0.75);
          halTint.addColorStop(0, 'rgba(88, 28, 135, 0.36)');
          halTint.addColorStop(0.6, 'rgba(49, 46, 129, 0.48)');
          halTint.addColorStop(1, 'rgba(15, 23, 42, 0.62)');
          g.fillStyle = halTint;
          g.fillRect(0, 0, W, H);
        } else {
          var sunGrad = g.createRadialGradient(W * 0.5, H * 0.35, H * 0.1, W * 0.5, H * 0.5, W * 0.75);
          sunGrad.addColorStop(0, 'rgba(254, 243, 199, 0.16)');
          sunGrad.addColorStop(1, 'rgba(15, 23, 42, 0.28)');
          g.fillStyle = sunGrad;
          g.fillRect(0, 0, W, H);
        }

        // Stitched playmat frame under the 3D card grid
        var matW = Math.min(912, W * 0.635);
        var matH = Math.max(250, H - 110 - 182);
        var matX = (W - matW) * 0.5;
        var matY = 108;

        g.save();
        roundRectPath(g, matX, matY, matW, matH, 28);
        g.fillStyle = hal ? 'rgba(30, 27, 75, 0.52)' : 'rgba(15, 23, 42, 0.32)';
        g.fill();
        g.lineWidth = 3;
        g.setLineDash([12, 8]);
        g.strokeStyle = hal ? 'rgba(251, 146, 60, 0.68)' : 'rgba(253, 224, 71, 0.68)';
        g.stroke();
        g.setLineDash([]);
        g.restore();

        // Halloween hanging lanterns + floating friendly ghost/bat
        if (hal) {
          var lanIm = getImg('lantern');
          if (imgReady(lanIm)) {
            var swayL = Math.sin(tSec * 2.1) * 0.08;
            var swayR = Math.cos(tSec * 1.9) * 0.08;
            g.save();
            g.translate(W * 0.08, 72);
            g.rotate(swayL);
            var lg1 = g.createRadialGradient(0, 44, 4, 0, 44, 95);
            lg1.addColorStop(0, 'rgba(251, 191, 36, 0.55)');
            lg1.addColorStop(1, 'rgba(251, 191, 36, 0)');
            g.fillStyle = lg1;
            g.beginPath();
            g.arc(0, 44, 95, 0, Math.PI * 2);
            g.fill();
            g.drawImage(lanIm, -36, 0, 72, 92);
            g.restore();

            g.save();
            g.translate(W * 0.92, 72);
            g.rotate(swayR);
            var lg2 = g.createRadialGradient(0, 44, 4, 0, 44, 95);
            lg2.addColorStop(0, 'rgba(251, 191, 36, 0.55)');
            lg2.addColorStop(1, 'rgba(251, 191, 36, 0)');
            g.fillStyle = lg2;
            g.beginPath();
            g.arc(0, 44, 95, 0, Math.PI * 2);
            g.fill();
            g.drawImage(lanIm, -36, 0, 72, 92);
            g.restore();
          }

          var ghostIm = getImg('ghost');
          if (imgReady(ghostIm)) {
            var gx = W * 0.14 + Math.sin(tSec * 1.2) * 18;
            var gy = H * 0.22 + Math.cos(tSec * 1.8) * 12;
            g.save();
            g.globalAlpha = 0.88;
            g.drawImage(ghostIm, gx - 38, gy - 38, 76, 76);
            g.restore();
          }

          var batIm = getImg('bat');
          if (imgReady(batIm)) {
            var bx = W * 0.86 + Math.cos(tSec * 1.6) * 22;
            var by = H * 0.21 + Math.sin(tSec * 2.4) * 12;
            g.save();
            g.globalAlpha = 0.9;
            g.drawImage(batIm, bx - 36, by - 28, 72, 56);
            g.restore();
          }
        }

        // Ambient floating dust motes / magical embers
        var m;
        for (m = 0; m < motes.length; m++) {
          var mt = motes[m];
          var mx = ((mt.x + Math.sin(tSec * 0.8 + mt.phase) * 0.02 + 1) % 1) * W;
          var my = ((mt.y + tSec * mt.vy + 10) % 1) * H;
          var alpha = 0.35 + 0.45 * Math.sin(tSec * 2.4 + mt.phase);
          g.save();
          g.fillStyle = hal
            ? 'rgba(251, 146, 60, ' + alpha.toFixed(2) + ')'
            : 'rgba(254, 240, 138, ' + alpha.toFixed(2) + ')';
          g.beginPath();
          g.arc(mx, my, mt.r, 0, Math.PI * 2);
          g.fill();
          g.restore();
        }
      }

      function drawTableMonster(side, teamObj, pose, tSec, bubbleText) {
        if (!teamObj) return;
        var isLeft = side === 'left';
        var cx = isLeft ? W * 0.095 : W * 0.905;
        var baseY = H * 0.67;
        var monSize = Math.min(220, Math.max(164, H * 0.275));
        var col = teamObj.color || (isLeft ? '#38bdf8' : '#f59e0b');

        // Pedestal disc on the wooden table side
        g.save();
        var pedGrad = g.createRadialGradient(cx, baseY + 12, 8, cx, baseY + 12, monSize * 0.56);
        pedGrad.addColorStop(0, col);
        pedGrad.addColorStop(0.55, 'rgba(15, 23, 42, 0.78)');
        pedGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        g.fillStyle = pedGrad;
        g.beginPath();
        g.ellipse(cx, baseY + 12, monSize * 0.54, monSize * 0.19, 0, 0, Math.PI * 2);
        g.fill();

        g.strokeStyle = col;
        g.lineWidth = 3.5;
        g.beginPath();
        g.ellipse(cx, baseY + 8, monSize * 0.42, monSize * 0.13, 0, 0, Math.PI * 2);
        g.stroke();
        g.restore();

        // Compute pose transforms (6 distinct states)
        var bobY = Math.sin(tSec * 3.1 + (isLeft ? 0 : 1.7)) * 7;
        var jumpY = 0;
        var leanX = 0;
        var rot = 0;
        var sx = 1 + Math.sin(tSec * 3.1) * 0.03;
        var sy = 1 - Math.sin(tSec * 3.1) * 0.03;

        if (pose === 'peek') {
          leanX = isLeft ? 16 : -16;
          rot = isLeft ? 0.09 : -0.09;
          bobY = Math.sin(tSec * 5.0) * 5;
        } else if (pose === 'check') {
          leanX = isLeft ? 22 : -22;
          rot = isLeft ? 0.12 : -0.12;
          sy = 1.06;
          sx = 0.95;
        } else if (pose === 'celebrate' || pose === 'finale') {
          jumpY = -Math.abs(Math.sin(tSec * 8.5)) * 38;
          rot = Math.sin(tSec * 9.0) * 0.16;
          sx = 1.08 + Math.sin(tSec * 12) * 0.06;
          sy = 1.08 - Math.sin(tSec * 12) * 0.06;
        } else if (pose === 'shrug') {
          leanX = Math.sin(tSec * 14) * 8;
          rot = Math.sin(tSec * 14) * 0.08;
          sx = 1.05;
          sy = 0.94;
        }

        // Periodic blink
        var blinkCycle = (tSec + (isLeft ? 0.4 : 1.9)) % 4.2;
        if (blinkCycle > 4.06) {
          sy *= 0.92;
        }

        var monIm = getMonImg(teamObj.mon);
        g.save();
        g.translate(cx + leanX, baseY - monSize * 0.44 + bobY + jumpY);
        g.rotate(rot);
        g.scale(sx, sy);
        if (imgReady(monIm)) {
          g.drawImage(monIm, -monSize * 0.5, -monSize * 0.5, monSize, monSize);
        } else {
          g.fillStyle = col;
          g.beginPath();
          g.arc(0, 0, monSize * 0.36, 0, Math.PI * 2);
          g.fill();
        }
        g.restore();

        // Team name pill under pedestal
        var pillW = Math.min(180, W * 0.145);
        var pillH = 34;
        var pillX = cx - pillW * 0.5;
        var pillY = baseY + 26;
        g.save();
        roundRectPath(g, pillX, pillY, pillW, pillH, 17);
        g.fillStyle = 'rgba(15, 23, 42, 0.88)';
        g.fill();
        g.lineWidth = 2.5;
        g.strokeStyle = col;
        g.stroke();

        g.fillStyle = '#ffffff';
        g.font = '900 15px "Fredoka", "Nunito", sans-serif';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        var roleTag = isLeft ? '🎯 ' + teamObj.name : '👀 ' + teamObj.name;
        g.fillText(roleTag, cx, pillY + pillH * 0.5);
        g.restore();

        // Speech / reaction bubble above the monster
        if (bubbleText) {
          var bw = Math.min(184, W * 0.15);
          var bh = 38;
          var bx = Math.max(10, Math.min(W - bw - 10, cx - bw * 0.5));
          var by = baseY - monSize - 24 + jumpY * 0.4;
          g.save();
          roundRectPath(g, bx, by, bw, bh, 18);
          g.fillStyle = 'rgba(255, 255, 255, 0.95)';
          g.fill();
          g.lineWidth = 3;
          g.strokeStyle = col;
          g.stroke();

          g.fillStyle = '#0f172a';
          g.font = '900 14px "Fredoka", "Nunito", sans-serif';
          g.textAlign = 'center';
          g.textBaseline = 'middle';
          g.fillText(bubbleText, bx + bw * 0.5, by + bh * 0.5);
          g.restore();
        }
      }

      function drawParticles(dt) {
        var i;
        for (i = particles.length - 1; i >= 0; i--) {
          var pt = particles[i];
          pt.life -= dt;
          if (pt.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
          pt.x += pt.vx * dt;
          pt.y += pt.vy * dt;
          pt.vy += 320 * dt;
          pt.rot += pt.vrot * dt;

          var alpha = Math.max(0, Math.min(1, pt.life / pt.maxLife));
          g.save();
          g.globalAlpha = alpha;
          g.translate(pt.x, pt.y);
          g.rotate(pt.rot);
          g.fillStyle = pt.color;
          g.fillRect(-pt.r, -pt.r * 0.6, pt.r * 2, pt.r * 1.2);
          g.restore();
        }
      }

      function frame(now) {
        if (ended && !scene.isConnected) return;
        var dt = Math.min(0.05, Math.max(0.001, (now - lastTs) * 0.001));
        lastTs = now;
        elapsed += dt;

        if (charPoseTimer > 0) {
          charPoseTimer -= dt;
          if (charPoseTimer <= 0 && charPose !== 'finale') {
            charPose = flipped.length === 1 ? 'peek' : 'idle';
            buddyPose = 'idle';
          }
        }

        g.save();
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        g.clearRect(0, 0, W, H);

        var hal = isHalloween();
        drawTableBackground(hal, elapsed);

        var activeTeam = T[turn] || T[0];
        var nextTeam = T.length > 1 ? T[(turn + 1) % T.length] : T[0];

        drawTableMonster('left', activeTeam, charPose, elapsed, charBubble);
        drawTableMonster('right', nextTeam, buddyPose, elapsed, buddyPose === 'celebrate' ? 'Nice match! 👏' : 'Watching...');

        drawParticles(dt);
        g.restore();

        if (!ended) {
          rafId = requestAnimationFrame(frame);
        }
      }

      renderHud();
      rafId = requestAnimationFrame(frame);

      // 10. Clean Teardown on Game End
      ctx.onEnd(function () {
        ended = true;
        activeAloudDone = null;
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
})();
