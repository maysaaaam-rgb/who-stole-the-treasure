/* ============================================================================
 * Game Maker — Mode: Jigsaw Race (mode-jigsaw.js)
 * Adapted from paintRace in review-g3-museum/js/app.js.
 * Two teams play side-by-side at the same time, each with a 12-piece puzzle!
 * Right answer = 1 piece to drag into place (+10 pts, golden hint after 2 misses).
 * Wrong answer = other team gets a STEAL question worth 2 pieces!
 * ============================================================================ */
(function () {
  'use strict';

  var GM = window.GM;
  var U = function () { return GM.u; };
  var A = function () { return GM.audio; };
  var J = function () { return GM.juice; };

  var COLS = 4, ROWS = 3, TOTAL = 12;
  var PW = 100, PH = 90, BW = 400, BH = 270;
  var SNAP_DIST = 44;

  function buildEdges() {
    var h = [], v = [], r, c;
    for (r = 0; r < ROWS - 1; r++) {
      h[r] = [];
      for (c = 0; c < COLS; c++) h[r][c] = ((r + c) % 2 === 0) ? 1 : -1;
    }
    for (r = 0; r < ROWS; r++) {
      v[r] = [];
      for (c = 0; c < COLS - 1; c++) v[r][c] = ((r + c) % 2 === 0) ? -1 : 1;
    }
    return { h: h, v: v };
  }
  var EDGES = buildEdges();

  function edgeH(x1, y1, x2, y2, sign) {
    if (!sign) return 'L ' + x2 + ' ' + y2 + ' ';
    var dx = x2 - x1, mx = (x1 + x2) / 2;
    var s = dx > 0 ? 1 : -1;
    var ny = sign * s * 16;
    var w = Math.abs(dx);
    return 'L ' + (mx - s * w * 0.17) + ' ' + y1 +
      ' C ' + (mx - s * w * 0.12) + ' ' + (y1 - ny * 0.25) + ', ' + (mx - s * w * 0.22) + ' ' + (y1 + ny) + ', ' + mx + ' ' + (y1 + ny) +
      ' C ' + (mx + s * w * 0.22) + ' ' + (y1 + ny) + ', ' + (mx + s * w * 0.12) + ' ' + (y1 - ny * 0.25) + ', ' + (mx + s * w * 0.17) + ' ' + y1 +
      ' L ' + x2 + ' ' + y2 + ' ';
  }

  function edgeV(x1, y1, x2, y2, sign) {
    if (!sign) return 'L ' + x2 + ' ' + y2 + ' ';
    var dy = y2 - y1, my = (y1 + y2) / 2;
    var s = dy > 0 ? 1 : -1;
    var nx = -sign * s * 16;
    var h = Math.abs(dy);
    return 'L ' + x1 + ' ' + (my - s * h * 0.17) +
      ' C ' + (x1 - nx * 0.25) + ' ' + (my - s * h * 0.12) + ', ' + (x1 + nx) + ' ' + (my - s * h * 0.22) + ', ' + (x1 + nx) + ' ' + my +
      ' C ' + (x1 + nx) + ' ' + (my + s * h * 0.22) + ', ' + (x1 - nx * 0.25) + ' ' + (my + s * h * 0.12) + ', ' + x1 + ' ' + (my + s * h * 0.17) +
      ' L ' + x2 + ' ' + y2 + ' ';
  }

  function piecePath(r, c) {
    var x0 = c * PW, y0 = r * PH, x1 = x0 + PW, y1 = y0 + PH;
    var top = (r === 0) ? 0 : -EDGES.h[r - 1][c];
    var right = (c === COLS - 1) ? 0 : EDGES.v[r][c];
    var bottom = (r === ROWS - 1) ? 0 : EDGES.h[r][c];
    var left = (c === 0) ? 0 : -EDGES.v[r][c - 1];
    return 'M ' + x0 + ' ' + y0 + ' ' +
      edgeH(x0, y0, x1, y0, top) +
      edgeV(x1, y0, x1, y1, right) +
      edgeH(x1, y1, x0, y1, bottom) +
      edgeV(x0, y1, x0, y0, left) + 'Z';
  }

  GM.modes.jigsaw = {
    id: 'jigsaw',
    name: 'Jigsaw Race',
    e: '🧩',
    desc: 'Two teams race side-by-side to answer questions and snap 12 jigsaw pieces into place!',
    teams: 2,
    fields: [
      {
        k: 'pic',
        l: 'Puzzle picture',
        opts: [
          ['card_jigsaw', 'Puzzle Frame'],
          ['bg_classic_race', 'Sunny Stadium'],
          ['bg_classic_hunt', 'Treasure Garden']
        ],
        def: 'card_jigsaw'
      }
    ],

    start: function (ctx) {
      var T = GM.state.teams;
      var picName = ctx.cfg.pic || 'card_jigsaw';
      var imgHref = 'art/' + picName + '.webp';
      var ended = false;
      var finishOrder = [];

      if (A() && A().play) A().play('music_puzzle');

      var wrap = U().h('div', { class: 'gm-jig-wrap' });
      var info = U().h('div', { class: 'gm-info' });
      var split = U().h('div', { class: 'gm-jig-split' });

      wrap.appendChild(info);
      wrap.appendChild(split);
      ctx.root.appendChild(wrap);

      // Build state for the 2 competing lanes (if >2 teams exist, first 2 race side-by-side)
      var numLanes = Math.min(2, T.length);
      var lanes = [];
      for (var i = 0; i < numLanes; i++) {
        var order = [];
        for (var p = 0; p < TOTAL; p++) order.push(p);
        lanes.push({
          idx: i,
          team: T[i],
          placed: {},
          placedCount: 0,
          unplaced: U().shuffle(order),
          phase: 'question', // 'question' | 'place' | 'done'
          toPlace: 0,
          activePiece: null,
          misses: 0,
          isSteal: false,
          item: ctx.nextItem(),
          el: null
        });
      }

      function renderTopBar() {
        info.innerHTML = '';
        info.appendChild(U().h('div', { class: 'gm-turn-pill', style: '--tc:' + T[0].color }, [
          U().monFace(T[0].mon, 36),
          U().h('span', {}, ['Jigsaw Race — First team to place all 12 pieces wins +50!'])
        ]));
        U().teamBar(T, 0);
      }

      function buildBoardSVG(lane) {
        var tid = lane.idx;
        var svgNS = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('viewBox', '-18 -18 ' + (BW + 36) + ' ' + (BH + 130));
        svg.setAttribute('class', 'gm-jig-svg');

        var defs = document.createElementNS(svgNS, 'defs');
        var p, r, c;
        for (p = 0; p < TOTAL; p++) {
          r = Math.floor(p / COLS); c = p % COLS;
          var cp = document.createElementNS(svgNS, 'clipPath');
          cp.setAttribute('id', 'gm-jig-clip-' + tid + '-' + p);
          var pathEl = document.createElementNS(svgNS, 'path');
          pathEl.setAttribute('d', piecePath(r, c));
          cp.appendChild(pathEl);
          defs.appendChild(cp);
        }
        svg.appendChild(defs);

        // Board frame
        var bg = document.createElementNS(svgNS, 'rect');
        bg.setAttribute('x', -8); bg.setAttribute('y', -8);
        bg.setAttribute('width', BW + 16); bg.setAttribute('height', BH + 16);
        bg.setAttribute('rx', 16);
        bg.setAttribute('fill', '#0f172a');
        bg.setAttribute('stroke', lane.team.color);
        bg.setAttribute('stroke-width', '5');
        svg.appendChild(bg);

        // Faint guide preview
        var ghost = document.createElementNS(svgNS, 'image');
        ghost.setAttribute('href', imgHref);
        ghost.setAttribute('x', 0); ghost.setAttribute('y', 0);
        ghost.setAttribute('width', BW); ghost.setAttribute('height', BH);
        ghost.setAttribute('preserveAspectRatio', 'none');
        ghost.setAttribute('opacity', '0.16');
        svg.appendChild(ghost);

        // Slot outlines
        for (p = 0; p < TOTAL; p++) {
          r = Math.floor(p / COLS); c = p % COLS;
          var slot = document.createElementNS(svgNS, 'path');
          slot.setAttribute('d', piecePath(r, c));
          slot.setAttribute('fill', 'none');
          slot.setAttribute('stroke', 'rgba(255,255,255,0.28)');
          slot.setAttribute('stroke-width', '2');
          slot.setAttribute('stroke-dasharray', '5 4');
          svg.appendChild(slot);
        }

        // Placed pieces
        Object.keys(lane.placed).forEach(function (k) {
          var pid = +k;
          var pr = Math.floor(pid / COLS), pc = pid % COLS;
          var g = document.createElementNS(svgNS, 'g');
          var im = document.createElementNS(svgNS, 'image');
          im.setAttribute('href', imgHref);
          im.setAttribute('x', 0); im.setAttribute('y', 0);
          im.setAttribute('width', BW); im.setAttribute('height', BH);
          im.setAttribute('preserveAspectRatio', 'none');
          im.setAttribute('clip-path', 'url(#gm-jig-clip-' + tid + '-' + pid + ')');
          g.appendChild(im);
          var outline = document.createElementNS(svgNS, 'path');
          outline.setAttribute('d', piecePath(pr, pc));
          outline.setAttribute('fill', 'none');
          outline.setAttribute('stroke', '#ffffff');
          outline.setAttribute('stroke-width', '2');
          g.appendChild(outline);
          svg.appendChild(g);
        });

        // Tray area at bottom of SVG
        var tray = document.createElementNS(svgNS, 'rect');
        tray.setAttribute('x', -8); tray.setAttribute('y', BH + 14);
        tray.setAttribute('width', BW + 16); tray.setAttribute('height', 92);
        tray.setAttribute('rx', 14);
        tray.setAttribute('fill', 'rgba(30,41,59,0.9)');
        tray.setAttribute('stroke', 'rgba(255,255,255,0.3)');
        tray.setAttribute('stroke-width', '2');
        svg.appendChild(tray);

        if (lane.phase === 'place' && lane.activePiece !== null) {
          var ap = lane.activePiece;
          var ar = Math.floor(ap / COLS), ac = ap % COLS;
          var targetCx = ac * PW + PW / 2, targetCy = ar * PH + PH / 2;

          // Golden glowing target hint (always clickable for smartboard tap-to-place or after 2 misses)
          var hint = document.createElementNS(svgNS, 'circle');
          hint.setAttribute('cx', targetCx);
          hint.setAttribute('cy', targetCy);
          hint.setAttribute('r', lane.misses >= 2 ? '34' : '24');
          hint.setAttribute('fill', lane.misses >= 2 ? 'rgba(250,204,21,0.35)' : 'rgba(250,204,21,0.14)');
          hint.setAttribute('stroke', '#fde047');
          hint.setAttribute('stroke-width', lane.misses >= 2 ? '4' : '2');
          hint.setAttribute('stroke-dasharray', '6 4');
          hint.style.cursor = 'pointer';
          hint.addEventListener('click', function () {
            snapPieceIn(lane);
          });
          svg.appendChild(hint);

          // Draggable piece starting in tray center
          var homeX = BW / 2 - (ac * PW + PW / 2);
          var homeY = (BH + 60) - (ar * PH + PH / 2);

          var dg = document.createElementNS(svgNS, 'g');
          dg.setAttribute('transform', 'translate(' + homeX + ',' + homeY + ')');
          dg.style.cursor = 'grab';

          var dim = document.createElementNS(svgNS, 'image');
          dim.setAttribute('href', imgHref);
          dim.setAttribute('x', 0); dim.setAttribute('y', 0);
          dim.setAttribute('width', BW); dim.setAttribute('height', BH);
          dim.setAttribute('preserveAspectRatio', 'none');
          dim.setAttribute('clip-path', 'url(#gm-jig-clip-' + tid + '-' + ap + ')');
          dg.appendChild(dim);

          var dpath = document.createElementNS(svgNS, 'path');
          dpath.setAttribute('d', piecePath(ar, ac));
          dpath.setAttribute('fill', 'none');
          dpath.setAttribute('stroke', '#fde047');
          dpath.setAttribute('stroke-width', '4');
          dg.appendChild(dpath);
          svg.appendChild(dg);

          wireDrag(svg, dg, lane, homeX, homeY);
        }

        return svg;
      }

      function wireDrag(svg, dg, lane, homeX, homeY) {
        var dragging = false;
        var startPt = null;
        var curX = homeX, curY = homeY;

        function clientToSVG(evt) {
          var pt = svg.createSVGPoint();
          pt.x = evt.clientX;
          pt.y = evt.clientY;
          var ctm = svg.getScreenCTM();
          return ctm ? pt.matrixTransform(ctm.inverse()) : { x: 0, y: 0 };
        }

        dg.addEventListener('pointerdown', function (evt) {
          evt.preventDefault();
          dragging = true;
          try { dg.setPointerCapture(evt.pointerId); } catch (e) {}
          startPt = clientToSVG(evt);
        });

        dg.addEventListener('pointermove', function (evt) {
          if (!dragging || !startPt) return;
          var now = clientToSVG(evt);
          curX = homeX + (now.x - startPt.x);
          curY = homeY + (now.y - startPt.y);
          dg.setAttribute('transform', 'translate(' + curX + ',' + curY + ')');
        });

        function endDrag() {
          if (!dragging) return;
          dragging = false;
          var dist = Math.hypot(curX, curY);
          if (dist <= SNAP_DIST) {
            snapPieceIn(lane);
          } else {
            lane.misses++;
            if (A()) A().play('wrong');
            renderLane(lane);
          }
        }
        dg.addEventListener('pointerup', endDrag);
        dg.addEventListener('pointercancel', endDrag);
      }

      function snapPieceIn(lane) {
        if (ended || lane.phase !== 'place' || lane.activePiece === null) return;
        var ap = lane.activePiece;
        lane.placed[ap] = true;
        lane.placedCount++;
        lane.toPlace = Math.max(0, lane.toPlace - 1);
        lane.activePiece = null;
        lane.misses = 0;

        if (A()) A().play('card_match');
        U().floatText('+10 🧩', lane.el, 'good');
        U().addScore(lane.idx, 10);
        if (J()) J().react(lane.idx, 'score');

        if (lane.placedCount >= TOTAL) {
          lane.phase = 'done';
          finishOrder.push(lane.idx);
          var bonus = finishOrder.length === 1 ? 50 : 30;
          if (A()) A().play('win');
          U().floatText('FINISHED! +' + bonus, lane.el, 'good');
          U().addScore(lane.idx, bonus);
          U().confetti(45);
          renderTopBar();
          renderLane(lane);

          // End game as soon as the first team completes all 12 pieces!
          setTimeout(function () {
            if (!ended) {
              ended = true;
              ctx.end();
            }
          }, 1100);
          return;
        }

        if (lane.toPlace > 0 && lane.unplaced.length > 0) {
          lane.activePiece = lane.unplaced.pop();
        } else {
          lane.phase = 'question';
          lane.isSteal = false;
          lane.item = ctx.nextItem();
        }
        renderTopBar();
        renderLane(lane);
      }

      function onAnswerOption(lane, chosenText) {
        if (ended || lane.phase !== 'question') return;
        var correct = String(chosenText) === String(lane.item.a);
        if (A()) A().play('card_turn');

        if (correct) {
          if (A()) A().play('correct');
          var count = lane.isSteal ? 2 : 1;
          lane.isSteal = false;
          lane.toPlace = Math.min(count, TOTAL - lane.placedCount);
          lane.activePiece = lane.unplaced.pop();
          lane.misses = 0;
          lane.phase = 'place';
          renderLane(lane);
        } else {
          if (A()) A().play('wrong');
          U().wobble(lane.el);
          lane.isSteal = false;
          lane.item = ctx.nextItem();
          renderLane(lane);

          // Other team gets a STEAL question worth 2 pieces!
          var otherIdx = lane.idx === 0 ? 1 : 0;
          var other = lanes[otherIdx];
          if (other && other.phase === 'question' && !other.isSteal) {
            other.isSteal = true;
            U().floatText('⚡ STEAL (2 Pieces)!', other.el, 'good');
            renderLane(other);
          }
        }
      }

      function renderLane(lane) {
        if (!lane.el) return;
        lane.el.innerHTML = '';

        var head = U().h('div', { class: 'gm-jig-head' }, [
          U().h('div', { style: 'display:flex;align-items:center;gap:8px;' }, [
            U().monFace(lane.team.mon, 36),
            U().h('span', {}, [lane.team.name])
          ]),
          U().h('span', { class: 'gm-jig-prog' }, ['🧩 ' + lane.placedCount + ' / ' + TOTAL])
        ]);

        var body = U().h('div', { class: 'gm-jig-body' });
        var svgWrap = U().h('div', { class: 'gm-jig-svg-wrap' });
        svgWrap.appendChild(buildBoardSVG(lane));

        var side = U().h('div', { class: 'gm-jig-side' });
        var qbox = U().h('div', { class: 'gm-jig-qbox' });

        if (lane.phase === 'question') {
          if (lane.isSteal) {
            qbox.appendChild(U().h('span', { class: 'gm-jig-steal-tag' }, ['⚡ STEAL — Worth 2 Pieces!']));
          }
          qbox.appendChild(U().h('div', { class: 'gm-jig-q' }, [lane.item.q || '']));
          var optsWrap = U().h('div', { class: 'gm-jig-opts' });
          var opts = U().shuffle([lane.item.a].concat((lane.item.w || []).slice(0, 2)));
          opts.forEach(function (opt) {
            var b = U().h('button', {
              class: 'gm-jig-opt', 'data-ok': String(opt) === String(lane.item.a) ? '1' : '0',
              type: 'button',
              onclick: function () { onAnswerOption(lane, opt); }
            }, [String(opt)]);
            optsWrap.appendChild(b);
          });
          qbox.appendChild(optsWrap);
        } else if (lane.phase === 'place') {
          qbox.appendChild(U().h('div', { class: 'gm-jig-q' }, ['🎉 Correct! (' + lane.toPlace + ' piece' + (lane.toPlace > 1 ? 's' : '') + ' left)']));
          qbox.appendChild(U().h('div', { class: 'gm-jig-hint' }, ['👉 Drag the piece from the tray into its glowing spot on the puzzle!']));
          qbox.appendChild(U().btn('✨ Snap Piece In', 'gm-btn gm-btn-go', function () {
            snapPieceIn(lane);
          }));
        } else {
          qbox.appendChild(U().h('div', { class: 'gm-jig-q' }, ['🏆 Puzzle Complete!']));
        }

        side.appendChild(qbox);
        body.appendChild(svgWrap);
        body.appendChild(side);

        lane.el.appendChild(head);
        lane.el.appendChild(body);
      }

      ctx.onEnd(function () {
        ended = true;
      });

      lanes.forEach(function (lane) {
        var laneEl = U().h('div', { class: 'gm-jig-lane', style: '--tc:' + lane.team.color });
        lane.el = laneEl;
        split.appendChild(laneEl);
        renderLane(lane);
      });
      renderTopBar();
    }
  };
})();
