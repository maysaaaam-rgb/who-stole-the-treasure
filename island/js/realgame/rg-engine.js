/* ═══════════════════════════════════════════════════════════════
   Practice Island · REAL GAME ENGINE (Phaser 4 WebGL, no Godot)
   (island/js/realgame/rg-engine.js -> window.RealIsland)

   Turns Chapter 1 (Benbow Harbour) and Chapter 2 (Hispaniola Bay) into a
   real free-roam 2.5D game on the painted art:
   - Free 8-way movement: WASD / arrows, drag-to-steer joystick (touch + mouse),
     tap-to-walk with A* pathfinding and smooth wall sliding
   - True 2.5D depth: Y-sorting + painting cut-outs drawn in front of the hero
     (walk behind pier posts, flowers and the pavilion)
   - Perspective scale, walk-cycle sprite of the pupil's own dressed monster,
     surface footsteps (sand / wood / stone) with dust particles
   - Living world: rippling sea (displacement filter), sea glints, bobbing ship
     and boats, lantern glow, chimney smoke, fireflies, falling leaves,
     Flint the parrot, swallows, scuttling crabs, a kickable beach ball
   - Talkable NPCs, hidden treasures with magnet pick-up, the 5 lesson stops
     (open the SAME Harbour / BayWorld stop adventures, so lessons + progress
     + teacher reports are unchanged), finales, ship boarding to Chapter 2
   - Reuses the Unified HUD, Golden Wayfinder, Sea Chart, Store, Look, Games
   Classic DOM worlds stay available with ?classic=1
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var IMG_W = 1376, IMG_H = 768, CELL = 8;
  var BASE_SPEED = 196;
  var Q = new URLSearchParams(root.location.search);

  var CH = function () { return root.RG_CHAPTERS || {}; };
  var A = function () { return root.Ch1Audio || {}; };
  var F = function () { return root.Ch1Feedback || {}; };
  var UF = function () { return root.UnityFeel || null; };
  var WG = function () { return root.WorldGame || null; };
  var $ = function (id) { return document.getElementById(id); };

  var state = { game: null, chapter: 1, paused: true, busy: false, lookHooked: false, firstGesture: false, lastPos: {}, bakeSeq: 0, pending: null };
  var G = null;   // live data of the running scene (rebuilt on every chapter start)

  /* ───────────────────────── small helpers ───────────────────────── */
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function dist(ax, ay, bx, by) { var dx = ax - bx, dy = ay - by; return Math.sqrt(dx * dx + dy * dy); }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function pip(x, y, poly) {
    var inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-9) + xi)) inside = !inside;
    }
    return inside;
  }
  function segInfo(px, py, ax, ay, bx, by) {
    var dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
    var t = L ? clamp(((px - ax) * dx + (py - ay) * dy) / L, 0, 1) : 0;
    var cx = ax + dx * t, cy = ay + dy * t;
    return { d: dist(px, py, cx, cy), t: t };
  }
  function bbox(poly) {
    var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    poly.forEach(function (p) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); });
    return { x: Math.floor(x0), y: Math.floor(y0), w: Math.ceil(x1 - x0) + 1, h: Math.ceil(y1 - y0) + 1 };
  }

  function prog() { return state.chapter === 2 ? root.Ch2Progress : root.Ch1Progress; }
  function grade() { var p = prog(); try { return p ? p.getActiveGrade() : 3; } catch (e) { return 3; } }
  function isDone(n) { try { var p = prog(); return !!(p && p.isClueDone && p.isClueDone(grade(), n)); } catch (e) { return false; } }
  function nextStop() { for (var i = 1; i <= 5; i++) if (!isDone(i)) return i; return 6; }
  function doneCount() { var c = 0; for (var i = 1; i <= 5; i++) if (isDone(i)) c++; return c; }
  function allOpen() { try { return !!(WG() && WG().isAllChaptersUnlocked && WG().isAllChaptersUnlocked()); } catch (e) { return false; } }
  function starPreferred() { try { var p = prog(); return !!(p && p.isStarPreferred && p.isStarPreferred()); } catch (e) { return false; } }
  function say(t, cb) { if (A().speak) A().speak(t, {}, cb); else if (cb) setTimeout(cb, 700); }
  function sfx(name, arg) { try { if (A()[name]) A()[name](arg); } catch (e) { /* no sound */ } }
  function calm() { try { return root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  function touchFirst() { try { return root.matchMedia('(pointer: coarse)').matches; } catch (e) { return false; } }

  function domBlocked() {
    var mr = $('isl-modal-root');
    return !!(
      (mr && mr.children.length) ||
      $('ch1-modal-backdrop') || $('ch1-modal') || $('hb-scene') || $('ch2-scene') || $('ch2-star-backdrop') ||
      document.querySelector('.ch1-finale-overlay, #ch2-cutscene, #hb-cutscene, #st-overlay.open') ||
      document.documentElement.classList.contains('adv-on')
    );
  }

  /* ───────────────────────── walkability + A* navigation ───────────────────────── */
  function Nav(def) {
    this.areas = def.walk.areas || [];
    this.ribbons = def.walk.ribbons || [];
    this.holes = def.walk.holes || [];
    this.solids = [];
    this.cols = Math.ceil(IMG_W / CELL);
    this.rows = Math.ceil(IMG_H / CELL);
    this.grid = null;
  }
  Nav.prototype.addSolid = function (x, y, r) { this.solids.push([x, y, r]); };
  Nav.prototype.ok = function (x, y) {
    if (x < 2 || y < 2 || x > IMG_W - 2 || y > IMG_H - 1) return false;
    var i;
    for (i = 0; i < this.solids.length; i++) {
      var s = this.solids[i], dx = x - s[0], dy = (y - s[1]) * 1.9;
      if (dx * dx + dy * dy < s[2] * s[2]) return false;
    }
    for (i = 0; i < this.holes.length; i++) if (pip(x, y, this.holes[i])) return false;
    for (i = 0; i < this.areas.length; i++) if (pip(x, y, this.areas[i])) return true;
    for (i = 0; i < this.ribbons.length; i++) {
      var rb = this.ribbons[i];
      for (var k = 0; k < rb.length - 1; k++) {
        var a = rb[k], b = rb[k + 1], si = segInfo(x, y, a[0], a[1], b[0], b[1]);
        if (si.d <= a[2] + (b[2] - a[2]) * si.t) return true;
      }
    }
    return false;
  };
  Nav.prototype.build = function () {
    var g = new Uint8Array(this.cols * this.rows);
    for (var r = 0; r < this.rows; r++) {
      for (var c = 0; c < this.cols; c++) {
        g[r * this.cols + c] = this.ok(c * CELL + CELL / 2, r * CELL + CELL / 2) ? 1 : 0;
      }
    }
    this.grid = g;
  };
  Nav.prototype.cellOk = function (c, r) { return c >= 0 && r >= 0 && c < this.cols && r < this.rows && this.grid[r * this.cols + c] === 1; };
  Nav.prototype.nearest = function (x, y, maxR) {
    if (this.ok(x, y)) return [x, y];
    var c0 = Math.floor(x / CELL), r0 = Math.floor(y / CELL), lim = maxR || 40;
    for (var rad = 1; rad <= lim; rad++) {
      var best = null, bd = 1e9;
      for (var dr = -rad; dr <= rad; dr++) {
        for (var dc = -rad; dc <= rad; dc++) {
          if (Math.max(Math.abs(dr), Math.abs(dc)) !== rad) continue;
          if (!this.cellOk(c0 + dc, r0 + dr)) continue;
          var px = (c0 + dc) * CELL + CELL / 2, py = (r0 + dr) * CELL + CELL / 2, d = dist(px, py, x, y);
          if (d < bd) { bd = d; best = [px, py]; }
        }
      }
      if (best) return best;
    }
    return null;
  };
  Nav.prototype.los = function (x0, y0, x1, y1) {
    var d = dist(x0, y0, x1, y1), n = Math.ceil(d / 3);
    for (var i = 1; i <= n; i++) {
      var t = i / n;
      if (!this.ok(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t)) return false;
    }
    return true;
  };
  Nav.prototype.path = function (sx, sy, tx, ty) {
    var C = this.cols, R = this.rows, g = this.grid;
    var sp = this.nearest(sx, sy, 8), tp = this.nearest(tx, ty, 30);
    if (!sp || !tp) return null;
    if (this.los(sx, sy, tp[0], tp[1])) return [[tp[0], tp[1]]];
    var s = Math.floor(sp[1] / CELL) * C + Math.floor(sp[0] / CELL);
    var t = Math.floor(tp[1] / CELL) * C + Math.floor(tp[0] / CELL);
    var N = C * R, gs = new Float32Array(N), came = new Int32Array(N), closed = new Uint8Array(N);
    for (var i = 0; i < N; i++) { gs[i] = 1e9; came[i] = -1; }
    var heap = [], tc = t % C, tr = Math.floor(t / C);
    function h(idx) { var dc = Math.abs(idx % C - tc), dr = Math.abs(Math.floor(idx / C) - tr); return (dc + dr) + (1.4142 - 2) * Math.min(dc, dr); }
    function push(f, idx) {
      heap.push([f, idx]);
      var k = heap.length - 1;
      while (k > 0) { var p = (k - 1) >> 1; if (heap[p][0] <= heap[k][0]) break; var tmp = heap[p]; heap[p] = heap[k]; heap[k] = tmp; k = p; }
    }
    function pop() {
      var top = heap[0], last = heap.pop();
      if (heap.length) {
        heap[0] = last;
        var k = 0;
        for (;;) {
          var l = 2 * k + 1, r = l + 1, m = k;
          if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
          if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
          if (m === k) break;
          var tmp = heap[m]; heap[m] = heap[k]; heap[k] = tmp; k = m;
        }
      }
      return top;
    }
    gs[s] = 0; push(h(s), s);
    var DIRS = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.4142], [1, -1, 1.4142], [-1, 1, 1.4142], [-1, -1, 1.4142]];
    var found = false, guard = 0;
    while (heap.length && guard++ < 60000) {
      var cur = pop()[1];
      if (cur === t) { found = true; break; }
      if (closed[cur]) continue;
      closed[cur] = 1;
      var cc = cur % C, cr = Math.floor(cur / C);
      for (var d = 0; d < 8; d++) {
        var nc = cc + DIRS[d][0], nr = cr + DIRS[d][1];
        if (nc < 0 || nr < 0 || nc >= C || nr >= R) continue;
        var ni = nr * C + nc;
        if (!g[ni] || closed[ni]) continue;
        if (DIRS[d][2] > 1 && (!g[cr * C + nc] || !g[nr * C + cc])) continue;
        var ng = gs[cur] + DIRS[d][2];
        if (ng < gs[ni]) { gs[ni] = ng; came[ni] = cur; push(ng + h(ni), ni); }
      }
    }
    if (!found) return null;
    var cells = [], k2 = t;
    while (k2 !== -1 && k2 !== s) { cells.push([(k2 % C) * CELL + CELL / 2, Math.floor(k2 / C) * CELL + CELL / 2]); k2 = came[k2]; }
    cells.reverse();
    if (cells.length) cells[cells.length - 1] = [tp[0], tp[1]];
    // string-pull smoothing
    var out = [], ax = sx, ay = sy, idx = 0;
    while (idx < cells.length) {
      var far = idx;
      for (var j = cells.length - 1; j > idx; j--) {
        if (this.los(ax, ay, cells[j][0], cells[j][1])) { far = j; break; }
      }
      out.push(cells[far]);
      ax = cells[far][0]; ay = cells[far][1];
      idx = far + 1;
    }
    return out;
  };
  Nav.prototype.slide = function (x, y, dx, dy) {
    if (!dx && !dy) return [x, y];
    if (this.ok(x + dx, y + dy)) return [x + dx, y + dy];
    var len = Math.sqrt(dx * dx + dy * dy), ang = Math.atan2(dy, dx);
    var tries = [0.42, -0.42, 0.85, -0.85, 1.25, -1.25];
    for (var i = 0; i < tries.length; i++) {
      var a = ang + tries[i], l = len * Math.cos(tries[i]);
      var nx = x + Math.cos(a) * l, ny = y + Math.sin(a) * l;
      if (this.ok(nx, ny)) return [nx, ny];
    }
    return [x, y];
  };

  /* ───────────────────────── perspective ───────────────────────── */
  function persp(y) {
    var p = G.def.persp, t = clamp((y - p.y0) / (p.y1 - p.y0), 0, 1);
    return p.h0 + (p.h1 - p.h0) * t;
  }
  function pscale(y) { return persp(y) / G.def.persp.h1; }
  function surfaceAt(x, y) {
    var s = G.def.surfaces || [];
    for (var i = 0; i < s.length; i++) if (pip(x, y, s[i].poly)) return s[i].type;
    return 'sand';
  }
  function toScreen(x, y) {
    var cam = G.sc.cameras.main;
    return { x: (x - cam.worldView.x) * cam.zoom, y: (y - cam.worldView.y) * cam.zoom };
  }

  /* ───────────────────────── procedural textures ───────────────────────── */
  function canvasTex(sc, key, w, h, draw) {
    if (sc.textures.exists(key)) return;
    var cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    draw(cv.getContext('2d'), w, h);
    sc.textures.addCanvas(key, cv);
  }
  function makeTextures(sc) {
    canvasTex(sc, 'rg-dot', 32, 32, function (c) {
      var g = c.createRadialGradient(16, 16, 0, 16, 16, 16);
      g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.5, 'rgba(255,255,255,0.75)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = g; c.fillRect(0, 0, 32, 32);
    });
    canvasTex(sc, 'rg-glow', 128, 128, function (c) {
      var g = c.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(0.35, 'rgba(255,255,255,0.45)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = g; c.fillRect(0, 0, 128, 128);
    });
    canvasTex(sc, 'rg-shadow', 128, 48, function (c) {
      var g = c.createRadialGradient(64, 24, 2, 64, 24, 62);
      g.addColorStop(0, 'rgba(10,14,28,0.55)'); g.addColorStop(0.6, 'rgba(10,14,28,0.28)'); g.addColorStop(1, 'rgba(10,14,28,0)');
      c.save(); c.scale(1, 48 / 128 * 2.6); c.fillStyle = g; c.fillRect(0, 0, 128, 128); c.restore();
    });
    canvasTex(sc, 'rg-glint', 48, 48, function (c) {
      c.translate(24, 24);
      var g = c.createRadialGradient(0, 0, 0, 0, 0, 22);
      g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,250,220,0.65)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = g;
      c.beginPath(); c.moveTo(0, -22); c.quadraticCurveTo(3, -3, 22, 0); c.quadraticCurveTo(3, 3, 0, 22); c.quadraticCurveTo(-3, 3, -22, 0); c.quadraticCurveTo(-3, -3, 0, -22); c.fill();
    });
    canvasTex(sc, 'rg-leaf', 32, 20, function (c) {
      c.translate(16, 10); c.rotate(-0.3);
      c.fillStyle = '#ffffff';
      c.beginPath(); c.moveTo(-13, 0); c.quadraticCurveTo(0, -11, 13, 0); c.quadraticCurveTo(0, 11, -13, 0); c.fill();
      c.strokeStyle = 'rgba(0,0,0,0.25)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(-12, 0); c.lineTo(12, 0); c.stroke();
    });
    canvasTex(sc, 'rg-ring', 192, 80, function (c) {
      c.translate(96, 40);
      c.shadowColor = 'rgba(255,255,255,0.9)'; c.shadowBlur = 12;
      c.strokeStyle = '#ffffff'; c.lineWidth = 7;
      c.beginPath(); c.ellipse(0, 0, 78, 26, 0, 0, Math.PI * 2); c.stroke();
      c.shadowBlur = 0; c.globalAlpha = 0.22; c.fillStyle = '#ffffff';
      c.beginPath(); c.ellipse(0, 0, 74, 23, 0, 0, Math.PI * 2); c.fill();
    });
    canvasTex(sc, 'rg-badge', 72, 72, function (c) {
      c.fillStyle = 'rgba(2,6,23,0.55)'; c.beginPath(); c.arc(36, 40, 30, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#ffffff'; c.beginPath(); c.arc(36, 34, 30, 0, Math.PI * 2); c.fill();
      c.strokeStyle = 'rgba(15,23,42,0.85)'; c.lineWidth = 4; c.beginPath(); c.arc(36, 34, 28, 0, Math.PI * 2); c.stroke();
    });
    canvasTex(sc, 'rg-beam', 512, 160, function (c) {
      var g = c.createLinearGradient(0, 0, 512, 0);
      g.addColorStop(0, 'rgba(255,240,170,0.85)'); g.addColorStop(0.5, 'rgba(255,230,140,0.28)'); g.addColorStop(1, 'rgba(255,230,140,0)');
      c.fillStyle = g;
      c.beginPath(); c.moveTo(0, 74); c.lineTo(512, 0); c.lineTo(512, 160); c.lineTo(0, 86); c.closePath(); c.fill();
    });
    // seamless ripple map for the water displacement filter (128 = no shift)
    canvasTex(sc, 'rg-ripple', 256, 256, function (c, w, h) {
      var img = c.createImageData(w, h), d = img.data, TAU = Math.PI * 2;
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var u = x / w, v = y / h, i = (y * w + x) * 4;
          var rx = Math.sin(TAU * (v * 6 + 0.35 * Math.sin(TAU * u * 2))) * 0.6 + Math.sin(TAU * (u * 3 + v * 4)) * 0.4;
          var ry = Math.sin(TAU * (v * 5 + u * 1)) * 0.55 + Math.sin(TAU * (u * 4 - v * 3)) * 0.45;
          d[i] = 128 + rx * 90; d[i + 1] = 128 + ry * 90; d[i + 2] = 128; d[i + 3] = 255;
        }
      }
      c.putImageData(img, 0, 0);
    });
  }

  // Trim transparent borders once so feet sit exactly on the ground and taps hit the real picture
  function trimTex(sc, key) {
    var tex = sc.textures.get(key);
    if (!tex || tex.key === '__MISSING' || tex.has('trim')) return;
    try {
      var img = tex.getSourceImage(), w = img.width, h = img.height;
      var s = Math.min(1, 180 / Math.max(w, h)), cw = Math.max(1, Math.round(w * s)), ch = Math.max(1, Math.round(h * s));
      var cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
      var cx = cv.getContext('2d'); cx.drawImage(img, 0, 0, cw, ch);
      var d = cx.getImageData(0, 0, cw, ch).data, x0 = cw, y0 = ch, x1 = -1, y1 = -1;
      for (var y = 0; y < ch; y++) for (var x = 0; x < cw; x++) {
        if (d[(y * cw + x) * 4 + 3] > 28) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
      }
      if (x1 < 0) return;
      var X0 = Math.max(0, Math.floor(x0 / s) - 1), Y0 = Math.max(0, Math.floor(y0 / s) - 1);
      var X1 = Math.min(w, Math.ceil((x1 + 1) / s) + 1), Y1 = Math.min(h, Math.ceil((y1 + 1) / s) + 1);
      tex.add('trim', 0, X0, Y0, X1 - X0, Y1 - Y0);
    } catch (e) { /* use the full picture */ }
  }
  function addImg(sc, key, x, y, h, oy) {
    trimTex(sc, key);
    var tex = sc.textures.get(key);
    var spr = sc.add.image(x, y, key, tex && tex.has('trim') ? 'trim' : undefined).setOrigin(0.5, oy == null ? 1 : oy);
    spr.setScale(h / Math.max(1, spr.height));
    return spr;
  }
  function addShadow(sc, x, y, w) {
    return sc.add.image(x, y, 'rg-shadow').setScale(w / 128, w / 128 * 0.9).setDepth(y - 0.5);
  }
  function cutout(sc, srcImg, poly, key) {
    var b = bbox(poly), k = srcImg.width / IMG_W;
    var cv = document.createElement('canvas');
    cv.width = Math.max(1, Math.round(b.w * k)); cv.height = Math.max(1, Math.round(b.h * k));
    var c = cv.getContext('2d');
    c.beginPath();
    poly.forEach(function (p, i) { var px = (p[0] - b.x) * k, py = (p[1] - b.y) * k; if (i) c.lineTo(px, py); else c.moveTo(px, py); });
    c.closePath(); c.clip();
    c.drawImage(srcImg, b.x * k, b.y * k, b.w * k, b.h * k, 0, 0, cv.width, cv.height);
    if (sc.textures.exists(key)) sc.textures.remove(key);
    sc.textures.addCanvas(key, cv);
    return sc.add.image(b.x, b.y, key).setOrigin(0, 0).setScale(1 / k);
  }
  function randomInPoly(poly, avoid) {
    var b = bbox(poly);
    for (var i = 0; i < 40; i++) {
      var x = b.x + Math.random() * b.w, y = b.y + Math.random() * b.h;
      if (pip(x, y, poly) && !(avoid && pip(x, y, avoid))) return [x, y];
    }
    return [b.x + b.w / 2, b.y + b.h / 2];
  }

  /* ───────────────────────── DOM shell (HUD, talk card, joystick, action button) ───────────────────────── */
  function ensureDom() {
    if ($('rg-root')) return;
    var r = document.createElement('div');
    r.id = 'rg-root';
    r.className = 'rg-root';
    r.style.display = 'none';
    r.innerHTML =
      '<div class="rg-stage" id="rg-stage"></div>' +
      '<div class="rg-loading" id="rg-loading"><div class="rg-loading-card"><b>⛵ Sailing to the island…</b><span class="rg-loading-bar"><i id="rg-loading-fill"></i></span></div></div>' +
      '<div id="rg-hud"></div>' +
      '<button type="button" class="uf-wayfinder" id="rg-wayfinder" hidden></button>' +
      '<div class="rg-tip" id="rg-tip" aria-live="polite"></div>' +
      '<div class="rg-joy" id="rg-joy" aria-hidden="true"><div class="rg-joy-knob" id="rg-joy-knob"></div></div>' +
      '<button type="button" class="rg-action" id="rg-action" hidden><span class="rg-action-ic" id="rg-action-ic">✋</span><span class="rg-action-lbl" id="rg-action-lbl">Talk</span></button>' +
      '<div class="rg-talk" id="rg-talk" role="dialog" aria-live="polite">' +
        '<div class="rg-talk-face"><img id="rg-talk-img" src="" alt=""></div>' +
        '<div class="rg-talk-body"><b id="rg-talk-name"></b><p id="rg-talk-line"></p>' +
          '<div class="rg-talk-actions">' +
            '<button type="button" class="rg-btn amber" id="rg-talk-go">🧭 Show me the way</button>' +
            '<button type="button" class="rg-btn cyan" id="rg-talk-again">🔊 Again</button>' +
            '<button type="button" class="rg-btn emerald" id="rg-talk-ok">OK ✓</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="rg-fade" id="rg-fade"></div>';
    document.body.appendChild(r);

    $('rg-action').addEventListener('click', function (e) { e.stopPropagation(); gesture(); if (G && G.focus) interact(G.focus); });
    $('rg-talk-ok').addEventListener('click', function () { sfx('sfxTap'); hideTalk(); });
    $('rg-talk-again').addEventListener('click', function () { sfx('sfxTap'); if (G && G.talkLine) say(G.talkLine); });
    $('rg-talk-go').addEventListener('click', function () { sfx('sfxTap'); hideTalk(); walkToStop(Math.min(5, nextStop()), true); });
    $('rg-wayfinder').addEventListener('click', function () { sfx('sfxTap'); walkToStop(Math.min(5, nextStop()), true); });
  }

  function showTip(text, ms) {
    var t = $('rg-tip');
    if (!t) return;
    t.textContent = text;
    t.classList.add('on');
    clearTimeout(showTip._t);
    showTip._t = setTimeout(function () { t.classList.remove('on'); }, ms || 3200);
  }
  function fade(on) { var f = $('rg-fade'); if (f) f.classList.toggle('on', !!on); }
  function setLoading(p, done) {
    var l = $('rg-loading'), fl = $('rg-loading-fill');
    if (fl) fl.style.width = Math.round(clamp(p, 0, 1) * 100) + '%';
    if (l) l.classList.toggle('off', !!done);
  }

  function showTalk(npc) {
    if (!G) return;
    var g = grade(), line = (nextStop() > 5 && npc.lines.done) || npc.lines['g' + g] || npc.lines.g3;
    G.talkLine = line;
    G.talkOpen = true;
    $('rg-talk-img').src = npc.happy || npc.img;
    $('rg-talk-name').textContent = npc.name;
    $('rg-talk-line').textContent = line;
    $('rg-talk-go').style.display = nextStop() > 5 ? 'none' : '';
    $('rg-talk').classList.add('on');
    say(line);
  }
  function hideTalk() {
    if (!G) return;
    G.talkOpen = false;
    var t = $('rg-talk');
    if (t) t.classList.remove('on');
  }

  /* ───────────────────────── stops, lessons and rewards ───────────────────────── */
  function stopLabel(n) {
    var nx = nextStop();
    if (isDone(n)) return '✓ Stop ' + n + ' · Play again';
    if (!allOpen() && n > nx) return '🔒 Stop ' + n;
    return '⭐ Stop ' + n + ' · ' + G.def.stops[n - 1].name;
  }
  function heroHtml(size) {
    var src = state.chapter === 2 ? root.BayWorld : root.Harbour;
    try { if (src && src.heroSvg) return src.heroSvg(size); } catch (e) { /* fallback */ }
    return '<img src="art/flat/c_benbow_happy.webp" alt="">';
  }
  function openStop(n) {
    if (!G || state.busy) return;
    var nx = nextStop();
    if (!allOpen() && n > nx) {
      sfx('sfxWrong');
      var st = G.stops[nx - 1];
      if (st && st.badge) G.sc.tweens.add({ targets: st.badge, scale: { from: st.badge.scale * 1.35, to: st.badge.scale }, duration: 420, ease: 'Back.out' });
      showTip('🔒 First, visit Stop ' + nx + '!');
      say('First, visit Stop ' + nx + '!');
      return;
    }
    hideTalk();
    stopPlayer();
    state.busy = true;
    var wasDone = isDone(n), g = grade();
    var finish = function (res) {
      state.busy = false;
      refreshMarkers();
      if (UF()) UF().refreshAllUnifiedHuds(false);
      var solved = (res && res.solved) || (!wasDone && isDone(n));
      if (solved) celebrate(n, wasDone);
    };
    var ctx = { grade: g, stop: n, hero: heroHtml, done: finish, say: say };
    sfx('sfxTap');
    if (state.chapter === 1) {
      if (starPreferred() && root.Chapter1 && root.Chapter1.openClue) {
        root.Chapter1.openClue(n, 'star');
        watchClose('ch1-modal-backdrop', function () { finish({ solved: isDone(n) && !wasDone }); });
      } else if (root.Harbour && root.Harbour.stops && root.Harbour.stops[n]) {
        root.Harbour.stops[n](ctx);
      } else if (root.Chapter1 && root.Chapter1.openClue) {
        root.Chapter1.openClue(n, 'easy');
        watchClose('ch1-modal-backdrop', function () { finish({ solved: isDone(n) && !wasDone }); });
      } else { state.busy = false; }
    } else {
      if (starPreferred() && root.Chapter2 && root.Chapter2.openClue) {
        root.Chapter2.openClue(n, 'star', finish);
      } else if (root.BayWorld && root.BayWorld.stops && root.BayWorld.stops[n]) {
        root.BayWorld.stops[n](ctx);
      } else if (root.Chapter2 && root.Chapter2.openClue) {
        root.Chapter2.openClue(n, 'easy', finish);
      } else { state.busy = false; }
    }
  }
  function watchClose(id, cb) {
    var iv = setInterval(function () { if (!$(id)) { clearInterval(iv); cb(); } }, 450);
  }
  function celebrate(n, wasDone) {
    if (!G) return;
    var st = G.stops[n - 1], sc = G.sc;
    sfx('sfxStamp');
    if (G.party) G.party.explode(n === 5 ? 70 : 42, st.rx, st.top);
    sc.cameras.main.shake(260, 0.004);
    cheer(1300);
    if (!wasDone && UF() && UF().flyCoinsToHud) {
      var p = toScreen(st.rx, st.top);
      UF().flyCoinsToHud(n === 5 ? 25 : 10, p.x, p.y);
    }
    refreshMarkers();
    var nx = nextStop();
    if (nx > 5) {
      if (state.chapter === 1) {
        var P = root.Ch1Progress;
        if (F().playChestFinale && P && !(P.isChestOpened && P.isChestOpened(grade()))) {
          setTimeout(function () { F().playChestFinale(function () { if (P.markChestOpened) P.markChestOpened(grade()); refreshMarkers(); }); }, 900);
        } else {
          showTip('⛵ All clues solved! Board the Hispaniola at the end of the pier!', 4200);
        }
      } else {
        setBeacon(true);
        sfx('sfxBeacon');
        var P2 = root.Ch2Progress;
        if (root.BayWorld && root.BayWorld.playFinale && P2 && !(P2.isChestOpened && P2.isChestOpened(grade()))) {
          setTimeout(function () { root.BayWorld.playFinale(function () { if (P2.markChestOpened) P2.markChestOpened(grade()); refreshMarkers(); }); }, 900);
        }
      }
    } else {
      setTimeout(function () { showTip('🧭 Next: Stop ' + nx + ' · ' + G.def.stops[nx - 1].name, 3600); }, 1200);
    }
  }
  function board() {
    if (!G) return;
    sfx('sfxTap');
    if (state.chapter === 1) {
      var can = doneCount() >= 4 || allOpen();
      if (can && root.SceneDirector) {
        stopPlayer();
        state.busy = true;
        fade(true);
        say(G.def.boardLines.ready, function () {
          state.busy = false;
          root.SceneDirector.goZone(2, { sailIntro: true });
        });
      } else {
        showTip('⛵ Solve ' + Math.max(1, 4 - doneCount()) + ' more clue' + (4 - doneCount() === 1 ? '' : 's') + ' first!');
        say(G.def.boardLines.locked);
      }
    } else {
      say(G.def.boardLines.ready);
      if (WG() && WG().openWorldMap) WG().openWorldMap();
    }
  }

  /* ───────────────────────── interaction targets ───────────────────────── */
  function interact(t) {
    if (!t || !G || state.busy) return;
    gesture();
    if (t.kind === 'stop') openStop(t.n);
    else if (t.kind === 'npc') { npcHappy(t.ref); showTalk(t.ref.def); }
    else if (t.kind === 'board') board();
    else if (t.kind === 'comp') petCompanion();
    else if (t.kind === 'flint') flintSquawk();
    else if (t.kind === 'crab') crabSnap(t.ref);
  }
  function targetsAll() {
    var list = [];
    G.stops.forEach(function (s) { list.push(s.target); });
    G.npcs.forEach(function (n) { list.push(n.target); });
    if (G.boardTarget) list.push(G.boardTarget);
    return list;
  }
  function findFocus() {
    var p = G.pl, best = null, bd = 1e9;
    targetsAll().forEach(function (t) {
      var r = t.r * (0.7 + 0.3 * pscale(t.y));
      var d = dist(p.x, p.y, t.x, t.y);
      if (d <= r && d < bd) { bd = d; best = t; }
    });
    return best;
  }
  function goToTarget(t) {
    if (!t || !G) return;
    gesture();
    hideTalk();
    if (t.kind === 'comp' || t.kind === 'flint' || t.kind === 'crab') { interact(t); return; }
    var p = G.pl;
    if (dist(p.x, p.y, t.x, t.y) <= t.r) { interact(t); return; }
    var ap = G.nav.nearest(t.x, t.y + 4, 30);
    if (!ap) return;
    walkTo(ap[0], ap[1], function () { interact(t); });
  }
  function walkToStop(n, auto) {
    if (!G) return;
    var st = G.stops[clamp(n, 1, 5) - 1];
    if (!st) return;
    G.overview = false;
    goToTarget(st.target);
    if (auto) showTip('🧭 Walking to Stop ' + st.n + '…', 2000);
  }

  /* ───────────────────────── player ───────────────────────── */
  function measureFrame(canvas, fx, fy, size) {
    try {
      var c = canvas.getContext('2d'), d = c.getImageData(fx, fy, size, size).data;
      var y0 = size, y1 = -1;
      for (var y = 0; y < size; y += 2) for (var x = 0; x < size; x += 2) {
        if (d[(y * size + x) * 4 + 3] > 40) { if (y < y0) y0 = y; if (y > y1) y1 = y; }
      }
      if (y1 < 0) return { top: size * 0.18, bottom: size * 0.84 };
      return { top: y0, bottom: Math.min(size, y1 + 2) };
    } catch (e) { return { top: size * 0.18, bottom: size * 0.84 }; }
  }
  function bakePlayer(sc) {
    var W = root.IslandWalker;
    if (!W || !W.bakeSheet || !root.MonsterRenderer) return Promise.resolve(false);
    return W.bakeSheet(W.look()).then(function (sh) {
      if (!G || G.sc !== sc || !sc.sys || !sc.sys.isActive()) return false;
      var key = 'rg-me-' + (++state.bakeSeq);
      var tex = sc.textures.addCanvas(key, sh.canvas);
      for (var n = 0; n < sh.count; n++) {
        var col = n % sh.cols, row = Math.floor(n / sh.cols);
        tex.add(n, 0, col * sh.frame, row * sh.frame, sh.frame, sh.frame);
      }
      ['down', 'diag', 'side', 'up'].forEach(function (d) {
        sc.anims.create({ key: key + '-' + d, frames: W.WALK[d].map(function (f) { return { key: key, frame: f }; }), frameRate: 10, repeat: -1 });
      });
      var m = measureFrame(sh.canvas, 0, 0, sh.frame);
      var old = G.pl.key;
      G.pl.key = key;
      G.pl.frame = sh.frame;
      G.pl.visH = Math.max(40, m.bottom - m.top);
      G.pl.originY = clamp(m.bottom / sh.frame, 0.6, 0.98);
      if (!G.pl.spr) {
        G.pl.spr = sc.add.sprite(G.pl.x, G.pl.y, key, 0);
        G.pl.spr.setInteractive({ useHandCursor: true });
        G.pl.spr.rgTarget = { kind: 'me' };
      } else {
        G.pl.spr.anims.stop();
        G.pl.spr.setTexture(key, 0);
      }
      G.pl.spr.setOrigin(0.5, G.pl.originY);
      G.pl.anim = '';
      if (old && old !== key) {
        setTimeout(function () {
          try {
            ['down', 'diag', 'side', 'up'].forEach(function (d) { if (sc.anims.exists(old + '-' + d)) sc.anims.remove(old + '-' + d); });
            if (sc.textures.exists(old)) sc.textures.remove(old);
          } catch (e) { /* old sheet stays */ }
        }, 100);
      }
      return true;
    }).catch(function () { return false; });
  }
  function fallbackPlayer(sc) {
    if (G.pl.spr) return;
    trimTex(sc, 'art/flat/c_benbow_happy.webp');
    G.pl.spr = sc.add.sprite(G.pl.x, G.pl.y, 'art/flat/c_benbow_happy.webp', 'trim').setOrigin(0.5, 1);
    G.pl.key = null; G.pl.visH = G.pl.spr.height; G.pl.originY = 1;
  }
  function stopPlayer() {
    if (!G) return;
    G.pl.path = null; G.pl.onArrive = null; G.joy = null;
  }
  function walkTo(x, y, onArrive) {
    var p = G.pl;
    var path = G.nav.path(p.x, p.y, x, y);
    if (!path || !path.length) { if (onArrive && dist(p.x, p.y, x, y) < 30) onArrive(); return false; }
    p.path = path; p.onArrive = onArrive || null; p.stuck = 0;
    return true;
  }
  function cheer(ms) {
    if (!G || !G.pl.spr) return;
    G.pl.cheerUntil = G.sc.time.now + (ms || 1200);
  }
  function readInput() {
    var k = G.keys, x = 0, y = 0;
    if (k) {
      if (k.left.isDown || k.a.isDown) x -= 1;
      if (k.right.isDown || k.d.isDown) x += 1;
      if (k.up.isDown || k.w.isDown) y -= 1;
      if (k.down.isDown || k.s.isDown) y += 1;
    }
    if (G.joy) { x += G.joy.x; y += G.joy.y; }
    var len = Math.sqrt(x * x + y * y);
    if (len > 1) { x /= len; y /= len; }
    return { x: x, y: y, run: !!(k && k.shift.isDown) };
  }

  function updatePlayer(dt, time, blocked) {
    var p = G.pl, nav = G.nav;
    var inp = blocked ? { x: 0, y: 0, run: false } : readInput();
    var spd = BASE_SPEED * pscale(p.y) * (inp.run ? 1.45 : 1);
    var dx = 0, dy = 0;
    if (inp.x || inp.y) {
      if (p.path) { p.path = null; p.onArrive = null; }
      if (G.talkOpen) hideTalk();
      dx = inp.x * spd * dt; dy = inp.y * spd * dt * 0.92;
    } else if (!blocked && p.path && p.path.length) {
      var wp = p.path[0], ddx = wp[0] - p.x, ddy = wp[1] - p.y, dd = Math.sqrt(ddx * ddx + ddy * ddy);
      if (dd < 3) {
        p.path.shift();
        if (!p.path.length) { var cb = p.onArrive; p.path = null; p.onArrive = null; if (cb) cb(); }
      } else {
        var stp = Math.min(dd, spd * dt);
        dx = ddx / dd * stp; dy = ddy / dd * stp;
      }
    }
    var np = nav.slide(p.x, p.y, dx, dy);
    var mx = np[0] - p.x, my = np[1] - p.y, moved = Math.sqrt(mx * mx + my * my);
    if (p.path && (dx || dy) && moved < 0.15) { p.stuck += dt; if (p.stuck > 0.6) { p.path = null; p.onArrive = null; } } else p.stuck = 0;
    p.x = np[0]; p.y = np[1];
    p.vx = dt > 0 ? mx / dt : 0; p.vy = dt > 0 ? my / dt : 0;
    p.moving = moved > 0.05;
    if (p.moving && (Math.abs(mx) > 0.02 || Math.abs(my) > 0.02)) {
      var W = root.IslandWalker;
      p.dir = W && W.dirFromVec ? W.dirFromVec(mx, my) : (Math.abs(mx) > Math.abs(my) ? 'side' : (my < 0 ? 'up' : 'down'));
      if (Math.abs(mx) > 0.05) p.face = mx < 0 ? -1 : 1;
    }

    // footsteps + dust
    if (p.moving) {
      p.stepAcc += moved;
      var stride = 22 * pscale(p.y) * (inp.run ? 1.25 : 1);
      if (p.stepAcc > stride) {
        p.stepAcc = 0;
        var surf = surfaceAt(p.x, p.y);
        sfx('sfxFootstep', surf);
        if (G.dust && surf !== 'wood') {
          G.dust.setDepth(p.y - 1);
          try { if (G.dust.setParticleTint) G.dust.setParticleTint(surf === 'stone' ? 0xcbd5e1 : 0xe9d3a1); } catch (e) { /* default tint */ }
          G.dust.emitParticleAt(p.x + rand(-4, 4), p.y - 1, surf === 'sand' ? 3 : 2);
        }
      }
      if (!G.trail.length || dist(p.x, p.y, G.trail[G.trail.length - 1][0], G.trail[G.trail.length - 1][1]) > 3) {
        G.trail.push([p.x, p.y]);
        if (G.trail.length > 60) G.trail.shift();
      }
    }

    // draw
    var spr = p.spr;
    if (!spr) return;
    var s = persp(p.y) / p.visH;
    p.phase += (p.moving ? dt * (inp.run ? 15 : 11) : dt * 2.2);
    var bob = p.moving ? Math.abs(Math.sin(p.phase)) * 2.6 * pscale(p.y) : 0;
    var squash = p.moving ? 1 - Math.abs(Math.cos(p.phase)) * 0.035 : 1 + Math.sin(p.phase) * 0.012;
    var cheering = p.cheerUntil && time < p.cheerUntil;
    if (cheering) bob = Math.abs(Math.sin(time / 110)) * 9 * pscale(p.y);
    spr.setPosition(p.x, p.y - bob);
    spr.setScale(s, s * squash);
    spr.setDepth(p.y);
    if (p.key) {
      if (cheering) {
        if (spr.anims.isPlaying) spr.anims.stop();
        spr.setFrame(20);
        p.anim = '';
      } else if (p.moving) {
        var ak = p.key + '-' + p.dir;
        if (p.anim !== ak) { spr.play(ak, true); p.anim = ak; }
        spr.anims.timeScale = inp.run ? 1.45 : 1;
        spr.setFlipX(p.dir !== 'down' && p.face < 0);
      } else if (p.anim !== 'idle') {
        spr.anims.stop();
        var IDLE = (root.IslandWalker && root.IslandWalker.IDLE_FRAME) || { down: 0, diag: 5, side: 10, up: 15 };
        spr.setFrame(IDLE[p.dir === 'up' ? 'diag' : p.dir] || 0);
        p.anim = 'idle';
      }
    } else {
      spr.setFlipX(p.face < 0);
    }
    if (p.shadow) {
      var sw = persp(p.y) * 0.62 * (1 - bob * 0.02);
      p.shadow.setPosition(p.x, p.y + 1).setScale(sw / 128, sw / 128 * 0.9).setDepth(p.y - 0.5).setAlpha(0.85 - bob * 0.02);
    }
  }

  /* ───────────────────────── companion (Benbow / Lulu) ───────────────────────── */
  function buildCompanion(sc) {
    var c = G.def.companion;
    if (!c) return;
    [c.img, c.walk1, c.walk2, c.sit, c.happy].forEach(function (k) { if (k) trimTex(sc, k); });
    var x = G.pl.x - 34, y = G.pl.y + 6;
    var a = G.nav.nearest(x, y, 12) || [G.pl.x, G.pl.y];
    var spr = addImg(sc, c.walk1 || c.img, a[0], a[1], persp(a[1]) * c.hMul);
    spr.setInteractive({ useHandCursor: true });
    var comp = { def: c, x: a[0], y: a[1], spr: spr, shadow: addShadow(sc, a[0], a[1], 40), still: 0, step: 0, lastStep: 0, face: 1, mode: '' };
    spr.rgTarget = { kind: 'comp', x: comp.x, y: comp.y };
    G.comp = comp;
  }
  function setCompFrame(mode) {
    var c = G.comp, d = c.def, key = d.img;
    if (mode === c.mode) return;
    c.mode = mode;
    if (mode === 'walk1' && d.walk1) key = d.walk1;
    else if (mode === 'walk2' && d.walk2) key = d.walk2;
    else if (mode === 'sit' && d.sit) key = d.sit;
    else if (mode === 'happy' && d.happy) key = d.happy;
    else if (mode === 'stand') key = d.walk1 || d.img;
    var tex = G.sc.textures.get(key);
    c.spr.setTexture(key, tex && tex.has('trim') ? 'trim' : undefined);
  }
  function updateCompanion(dt, time) {
    var c = G.comp;
    if (!c) return;
    var lag = 16, tgt = G.trail.length > lag ? G.trail[G.trail.length - 1 - lag] : null;
    var moving = false;
    if (tgt && !c.petUntil) {
      var dx = tgt[0] - c.x, dy = tgt[1] - c.y, d = Math.sqrt(dx * dx + dy * dy);
      var near = dist(c.x, c.y, G.pl.x, G.pl.y);
      if (d > 2 && near > 26) {
        var spd = (BASE_SPEED * 1.05 + Math.max(0, near - 60) * 2.2) * pscale(c.y);
        var st = Math.min(d, spd * dt);
        c.x += dx / d * st; c.y += dy / d * st;
        if (Math.abs(dx) > 0.5) c.face = dx < 0 ? -1 : 1;
        moving = st > 0.05;
      }
    }
    if (c.petUntil && time > c.petUntil) c.petUntil = 0;
    if (c.def.kind === 'cat') {
      if (c.petUntil) setCompFrame('happy');
      else if (moving) {
        c.still = time;
        if (time - c.lastStep > 150) { c.step = 1 - c.step; c.lastStep = time; setCompFrame(c.step ? 'walk2' : 'walk1'); }
      } else setCompFrame(time - c.still > 1700 ? 'sit' : 'stand');
    }
    var h = persp(c.y) * c.def.hMul * (c.petUntil ? 1.08 : 1);
    var wob = c.def.kind === 'crab' && moving ? Math.sin(time / 70) * 0.12 : 0;
    var hop = c.petUntil ? Math.abs(Math.sin(time / 120)) * 6 : 0;
    c.spr.setPosition(c.x, c.y - hop).setScale((h / Math.max(1, c.spr.height)) * (c.face < 0 ? -1 : 1), h / Math.max(1, c.spr.height));
    c.spr.setRotation(wob);
    c.spr.setDepth(c.y);
    var sw = persp(c.y) * 0.55;
    c.shadow.setPosition(c.x, c.y + 1).setScale(sw / 128, sw / 128 * 0.9).setDepth(c.y - 0.5);
    c.spr.rgTarget.x = c.x; c.spr.rgTarget.y = c.y;
  }
  function petCompanion() {
    if (!G || !G.comp) return;
    G.comp.petUntil = G.sc.time.now + 1400;
    sfx('sfxCoin');
    if (G.fx) G.fx.explode(10, G.comp.x, G.comp.y - persp(G.comp.y) * 0.5);
    say(G.def.companion.line);
  }

  /* ───────────────────────── NPCs ───────────────────────── */
  function buildNpcs(sc) {
    G.npcs = (G.def.npcs || []).map(function (n) {
      trimTex(sc, n.img); if (n.happy) trimTex(sc, n.happy);
      var h = persp(n.y) * n.hMul;
      var spr = addImg(sc, n.img, n.x, n.y, h).setDepth(n.y);
      var o = { def: n, spr: spr, h: h, ph: Math.random() * 6.28, shadow: addShadow(sc, n.x, n.y, h * 0.55) };
      spr.setInteractive({ useHandCursor: true });
      o.target = { kind: 'npc', ref: o, x: n.x, y: n.y, r: 58, top: n.y - h, label: function () { return '💬 Talk to ' + n.name; } };
      spr.rgTarget = o.target;
      return o;
    });
  }
  function updateNpcs(time) {
    var t = time / 1000;
    G.npcs.forEach(function (o) {
      var s = o.h / Math.max(1, o.spr.height), breath = calm() ? 0 : Math.sin(t * 2.2 + o.ph) * 0.018;
      o.spr.setScale(s, s * (1 + breath));
    });
  }
  function npcHappy(o) {
    var sc = G.sc, n = o.def;
    if (n.happy && sc.textures.exists(n.happy)) {
      var tex = sc.textures.get(n.happy);
      o.spr.setTexture(n.happy, tex.has('trim') ? 'trim' : undefined);
      clearTimeout(o.revert);
      o.revert = setTimeout(function () {
        if (!o.spr || !o.spr.scene) return;
        var t2 = sc.textures.get(n.img);
        o.spr.setTexture(n.img, t2.has('trim') ? 'trim' : undefined);
      }, 3200);
    }
    sc.tweens.add({ targets: o.spr, y: n.y - 8, duration: 160, yoyo: true, ease: 'Quad.out' });
  }

  /* ───────────────────────── stop markers ───────────────────────── */
  function buildStops(sc) {
    G.stops = G.def.stops.map(function (s) {
      var rx = s.ring ? s.ring[0] : s.x, ry = s.ring ? s.ring[1] : s.y + 2;
      var ps = pscale(ry);
      var o = { n: s.n, def: s, rx: rx, ry: ry };
      o.ring = sc.add.image(rx, ry, 'rg-ring').setDepth(ry - 0.6).setScale(0.52 * ps).setBlendMode(Phaser.BlendModes.ADD);
      o.ringBase = 0.52 * ps;
      var top = ry - persp(ry) * 0.95;
      if (s.prop) {
        var px = s.propAt ? s.propAt[0] : s.x, py = s.propAt ? s.propAt[1] : s.y;
        o.prop = addImg(sc, s.prop, px, py, s.h).setDepth(py);
        o.propShadow = addShadow(sc, px, py, Math.max(24, o.prop.displayWidth * 0.8));
        if (s.solid) G.nav.addSolid(px, py, s.solid);
        top = Math.min(top, py - s.h);
      }
      if (state.chapter === 1 && s.n === 1) top = 300;
      o.top = top;
      var bs = 0.42 * (0.75 + 0.25 * ps);
      o.badge = sc.add.container(rx, top - 18).setDepth(8500);
      o.badgeImg = sc.add.image(0, 0, 'rg-badge');
      o.badgeTxt = sc.add.text(0, -2, String(s.n), { fontFamily: 'Fredoka, Nunito, Arial, sans-serif', fontSize: '34px', fontStyle: '800', color: '#0f172a' }).setOrigin(0.5).setResolution(2);
      o.badge.add([o.badgeImg, o.badgeTxt]);
      o.badge.setScale(bs);
      o.badgeBase = bs;
      if (sc.textures.exists('art/kenney/arrow_down.webp')) {
        o.arrow = sc.add.image(rx, top - 52, 'art/kenney/arrow_down.webp').setDepth(8501).setVisible(false);
        o.arrow.setScale(30 / Math.max(1, o.arrow.height));
        sc.tweens.add({ targets: o.arrow, y: top - 62, duration: 520, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      }
      o.target = { kind: 'stop', n: s.n, x: rx, y: ry, r: s.prop ? 60 : 50, top: top, label: function () { return stopLabel(s.n); } };
      [o.prop, o.badgeImg].forEach(function (obj) { if (obj) { obj.setInteractive({ useHandCursor: true }); obj.rgTarget = o.target; } });
      o.pulse = sc.tweens.add({ targets: o.ring, alpha: { from: 1, to: 0.45 }, duration: 760, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      return o;
    });
  }
  function refreshMarkers() {
    if (!G || !G.stops) return;
    var nx = nextStop(), open = allOpen();
    G.stops.forEach(function (o) {
      var done = isDone(o.n), next = o.n === nx, locked = !open && o.n > nx;
      var tint = done ? 0x34d399 : (next ? 0xfde047 : (locked ? 0x94a3b8 : 0x38bdf8));
      o.ring.setTint(tint);
      o.ring.setVisible(!locked || next);
      o.ring.setScale(o.ringBase * (next ? 1.12 : 0.92));
      o.badgeImg.setTint(done ? 0x6ee7b7 : (next ? 0xfde047 : (locked ? 0xcbd5e1 : 0x7dd3fc)));
      o.badgeTxt.setText(done ? '✓' : String(o.n));
      o.badge.setAlpha(locked ? 0.62 : 1);
      if (o.arrow) o.arrow.setVisible(next);
    });
    G.lastNext = nx;
    setBeacon(nx > 5 || (root.Ch2Progress && state.chapter === 2 && root.Ch2Progress.isChestOpened && root.Ch2Progress.isChestOpened(grade())));
    if (G.ship) {
      var ready = state.chapter === 1 && (doneCount() >= 4 || open);
      if (ready !== G.shipReady) {
        G.shipReady = ready;
        try {
          if (ready && G.ship.enableFilters) { G.ship.enableFilters(); G.shipGlow = G.ship.filters.internal.addGlow(0xfde047, 4, 0, 1, false, 0.1, 10); }
          else if (!ready && G.shipGlow && G.ship.filters) { G.ship.filters.internal.remove(G.shipGlow); G.shipGlow = null; }
        } catch (e) { G.ship.setTint(ready ? 0xfff3c4 : 0xffffff); }
      }
    }
  }

  /* ───────────────────────── treasures ───────────────────────── */
  function findsKey() { return G.def.findsKey + grade(); }
  function foundList() { try { return JSON.parse(root.localStorage.getItem(findsKey()) || '[]'); } catch (e) { return []; } }
  function saveFound(list) { try { root.localStorage.setItem(findsKey(), JSON.stringify(list)); } catch (e) { /* memory only */ } }
  function buildFinds(sc) {
    (G.finds || []).forEach(function (f) { if (f.spr) f.spr.destroy(); if (f.glint) f.glint.destroy(); if (f.tw) f.tw.stop(); });
    var got = foundList();
    G.finds = (G.def.finds || []).filter(function (f) { return got.indexOf(f.id) === -1; }).map(function (f) {
      var h = 22 * (0.75 + 0.25 * pscale(f.y));
      var spr = addImg(sc, f.img, f.x, f.y, h, 0.85).setDepth(f.y);
      var o = { def: f, x: f.x, y: f.y, spr: spr, base: spr.y };
      o.tw = sc.tweens.add({ targets: spr, y: f.y - 5, duration: 900 + Math.random() * 400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      o.glint = sc.add.image(f.x + 6, f.y - h * 0.7, 'rg-glint').setDepth(f.y + 0.2).setBlendMode(Phaser.BlendModes.ADD).setScale(0.3).setAlpha(0);
      sc.tweens.add({ targets: o.glint, alpha: { from: 0, to: 0.95 }, scale: { from: 0.18, to: 0.42 }, duration: 520, yoyo: true, repeat: -1, repeatDelay: 900 + Math.random() * 1400, delay: Math.random() * 1500 });
      return o;
    });
  }
  function updateFinds(dt) {
    var p = G.pl;
    for (var i = G.finds.length - 1; i >= 0; i--) {
      var f = G.finds[i];
      if (f.taken) continue;
      var d = dist(p.x, p.y, f.x, f.y), mag = 54 * (0.7 + 0.3 * pscale(p.y));
      if (d < mag) {
        if (f.tw) { f.tw.stop(); f.tw = null; }
        var k = Math.min(1, dt * (d < 26 ? 14 : 6));
        f.x += (p.x - f.x) * k; f.y += (p.y - 8 - f.y) * k;
        f.spr.setPosition(f.x, f.y).setDepth(f.y + 2);
        if (f.glint) f.glint.setPosition(f.x + 6, f.y - 14);
        if (d < 14) collectFind(f, i);
      }
    }
  }
  function collectFind(f, idx) {
    f.taken = true;
    var list = foundList();
    if (list.indexOf(f.def.id) === -1) list.push(f.def.id);
    saveFound(list);
    sfx('sfxCoin');
    if (G.fx) G.fx.explode(14, f.x, f.y - 10);
    var scr = toScreen(f.x, f.y - 12);
    try {
      if (WG()) {
        if (f.def.coins && WG().addBonusCoins) WG().addBonusCoins(f.def.coins);
        if (f.def.mat && WG().giveMaterials) { var m = {}; m[f.def.mat] = 1; WG().giveMaterials(m); }
      }
    } catch (e) { /* bag stays */ }
    if (UF() && UF().flyCoinsToHud) UF().flyCoinsToHud(f.def.coins || 3, scr.x, scr.y);
    G.sc.tweens.add({ targets: f.spr, y: f.y - 40, alpha: 0, scale: f.spr.scale * 1.6, duration: 420, ease: 'Quad.out', onComplete: function () { f.spr.destroy(); } });
    if (f.glint) f.glint.destroy();
    G.finds.splice(idx, 1);
    var total = (G.def.finds || []).length, have = list.length;
    showTip(have >= total ? '🏆 You found all ' + total + ' hidden treasures!' : '✨ Treasure ' + have + ' / ' + total + ' found!', 2200);
    if (have >= total) setTimeout(function () { sfx('sfxFanfare'); }, 400);
    if (UF()) UF().refreshAllUnifiedHuds(false);
  }

  /* ───────────────────────── beach ball + crabs ───────────────────────── */
  function buildBall(sc) {
    var b = G.def.ball;
    if (!b) return;
    var h = 30 * pscale(b.y) + 8;
    var spr = addImg(sc, 'art/flat/o_ball.webp', b.x, b.y, h, 0.5);
    G.ball = { x: b.x, y: b.y, z: 0, vx: 0, vy: 0, vz: 0, spr: spr, shadow: addShadow(sc, b.x, b.y, h * 0.9), h: h, r: h * 0.45, spin: 0 };
    spr.setInteractive({ useHandCursor: true });
    spr.rgTarget = { kind: 'ball' };
  }
  function kickBall(power) {
    var b = G.ball, p = G.pl;
    var dx = b.x - p.x, dy = b.y - p.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
    var sp = power || (180 + Math.sqrt(p.vx * p.vx + p.vy * p.vy) * 1.35);
    b.vx = dx / d * sp; b.vy = dy / d * sp * 0.85; b.vz = 120 + sp * 0.35;
    sfx('sfxTap');
  }
  function updateBall(dt) {
    var b = G.ball;
    if (!b) return;
    var p = G.pl, d = dist(b.x, b.y, p.x, p.y);
    if (d < b.r + 12 * pscale(p.y) && b.z < 14 && (p.moving || d < b.r)) kickBall();
    if (b.vx || b.vy) {
      var nx = b.x + b.vx * dt, ny = b.y + b.vy * dt;
      if (!G.nav.ok(nx, b.y)) { b.vx = -b.vx * 0.7; nx = b.x; }
      if (!G.nav.ok(b.x, ny)) { b.vy = -b.vy * 0.7; ny = b.y; }
      if (!G.nav.ok(nx, ny)) { nx = b.x; ny = b.y; b.vx *= -0.6; b.vy *= -0.6; }
      var moved = dist(nx, ny, b.x, b.y);
      b.x = nx; b.y = ny;
      b.spin += moved / Math.max(4, b.r) * (b.vx < 0 ? -1 : 1);
      var fr = Math.pow(b.z > 0 ? 0.6 : 0.28, dt);
      b.vx *= fr; b.vy *= fr;
      if (Math.abs(b.vx) < 3 && Math.abs(b.vy) < 3) { b.vx = 0; b.vy = 0; }
    }
    b.vz -= 620 * dt; b.z += b.vz * dt;
    if (b.z <= 0) { b.z = 0; if (b.vz < -90) { b.vz = -b.vz * 0.42; } else b.vz = 0; }
    var s = (30 * pscale(b.y) + 8) / b.h;
    b.spr.setPosition(b.x, b.y - b.r - b.z).setRotation(b.spin).setScale((b.h / Math.max(1, b.spr.height)) * s).setDepth(b.y);
    b.shadow.setPosition(b.x, b.y + 1).setDepth(b.y - 0.5).setAlpha(clamp(0.9 - b.z / 120, 0.25, 0.9)).setScale((b.h * 0.9 * s * (1 - b.z / 260)) / 128, (b.h * 0.9 * s * (1 - b.z / 260)) / 128 * 0.9);
  }
  function buildCrabs(sc) {
    G.crabs = (G.def.crabs || []).map(function (c) {
      var h = 18 + 10 * pscale(c.y);
      var spr = addImg(sc, 'art/flat/e_sand_crab.webp', c.x, c.y, h).setDepth(c.y);
      var o = { x: c.x, y: c.y, hx: c.x, hy: c.y, spr: spr, h: h, tx: c.x, ty: c.y, wait: rand(0.5, 2.5), speed: 40, face: 1, shadow: addShadow(sc, c.x, c.y, h * 1.2) };
      spr.setInteractive({ useHandCursor: true });
      o.target = { kind: 'crab', ref: o, x: c.x, y: c.y };
      spr.rgTarget = o.target;
      return o;
    });
  }
  function updateCrabs(dt, time) {
    var p = G.pl;
    G.crabs.forEach(function (c) {
      var dp = dist(c.x, c.y, p.x, p.y);
      if (dp < 64) {
        var ax = c.x - p.x, ay = c.y - p.y, al = Math.sqrt(ax * ax + ay * ay) || 1;
        var fx = c.x + ax / al * 70, fy = c.y + ay / al * 40;
        var np = G.nav.nearest(fx, fy, 10);
        if (np) { c.tx = np[0]; c.ty = np[1]; c.speed = 150; c.wait = 0; }
      } else if (dist(c.x, c.y, c.tx, c.ty) < 2) {
        c.wait -= dt;
        if (c.wait <= 0) {
          var cand = G.nav.nearest(c.hx + rand(-90, 90), c.hy + rand(-30, 30), 8);
          if (cand) { c.tx = cand[0]; c.ty = cand[1]; }
          c.speed = rand(30, 55); c.wait = rand(1.2, 3.4);
        }
      }
      var dx = c.tx - c.x, dy = c.ty - c.y, d = Math.sqrt(dx * dx + dy * dy);
      var moving = d > 1;
      if (moving) {
        var st = Math.min(d, c.speed * dt), np2 = G.nav.slide(c.x, c.y, dx / d * st, dy / d * st);
        c.x = np2[0]; c.y = np2[1];
        if (Math.abs(dx) > 0.5) c.face = dx < 0 ? -1 : 1;
      }
      var s = c.h / Math.max(1, c.spr.height);
      c.spr.setPosition(c.x, c.y - (moving ? Math.abs(Math.sin(time / 45)) * 1.5 : 0)).setScale(s * c.face, s).setRotation(moving ? Math.sin(time / 60) * 0.08 : 0).setDepth(c.y);
      c.shadow.setPosition(c.x, c.y + 1).setDepth(c.y - 0.5);
      c.target.x = c.x; c.target.y = c.y;
    });
  }
  function crabSnap(c) {
    sfx('sfxPop'); sfx('sfxTap');
    G.sc.tweens.add({ targets: c.spr, angle: { from: -16, to: 16 }, duration: 70, yoyo: true, repeat: 3, onComplete: function () { c.spr.setAngle(0); } });
    showTip('🦀 Snip snap! The crab says hello!', 1600);
  }

  /* ───────────────────────── living world ───────────────────────── */
  function buildSea(sc, srcImg) {
    var def = G.def;
    if (!def.sea) return;
    var sea = cutout(sc, srcImg, def.sea, 'rg-sea-' + def.key).setDepth(-990);
    G.sea = sea;
    // rippling water: a scrolling ripple map feeds a displacement filter (WebGL only)
    try {
      if (!calm() && sea.enableFilters && sc.sys.renderer && sc.sys.renderer.gl) {
        var dkey = 'rg-disp-' + def.key;
        if (sc.textures.exists(dkey)) sc.textures.remove(dkey);
        var dyn = sc.textures.addDynamicTexture(dkey, 256, 256);
        var ts = sc.make.tileSprite({ x: 0, y: 0, width: 256, height: 256, key: 'rg-ripple' }, false);
        ts.setOrigin(0, 0);
        dyn.clear().draw(ts, 0, 0).render();
        sea.enableFilters();
        sea.filters.internal.addDisplacement(dkey, 0.010, 0.006);
        G.ripple = { dyn: dyn, ts: ts, t: 0 };
      }
    } catch (e) { G.ripple = null; }
    // glints dancing on the water
    var n = calm() ? 0 : 24;
    G.glints = [];
    for (var i = 0; i < n; i++) {
      var g = sc.add.image(0, 0, 'rg-glint').setDepth(-985).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0);
      G.glints.push(g);
      glintCycle(sc, g, Math.random() * 2400);
    }
  }
  function glintCycle(sc, g, delay) {
    if (!G || !g.scene) return;
    var pt = randomInPoly(G.def.sea, G.def.seaAvoid);
    var s = 0.12 + 0.35 * clamp((pt[1] - 330) / 438, 0, 1);
    g.setPosition(pt[0], pt[1]).setScale(s * 0.4).setAlpha(0);
    sc.tweens.add({
      targets: g, alpha: { from: 0, to: rand(0.55, 0.95) }, scale: { from: s * 0.4, to: s }, duration: rand(380, 820), yoyo: true, delay: delay || 0,
      onComplete: function () { glintCycle(sc, g, rand(80, 900)); }
    });
  }
  function buildShipBoats(sc) {
    var def = G.def;
    (def.boats || []).forEach(function (b) {
      if (!sc.textures.exists(b.img)) return;
      var spr = sc.add.image(b.x, b.y, b.img).setOrigin(0.5, 0.88).setDepth(b.y);
      spr.setScale(b.w / spr.width);
      if (b.flip) spr.setFlipX(true);
      if (!calm()) {
        sc.tweens.add({ targets: spr, y: b.y + 2, angle: { from: -1.6, to: 1.6 }, duration: 2100, yoyo: true, repeat: -1, ease: 'Sine.inOut', delay: b.d * 600 });
      }
    });
    if (def.ship && sc.textures.exists(def.ship.img)) {
      var sh = def.ship;
      var mirror = sc.add.image(sh.x, sh.y - 4, sh.img).setOrigin(0.5, 0).setDepth(sh.y - 2).setAlpha(0.2).setTint(0x7dd3fc);
      mirror.setScale(sh.w / mirror.width, -(sh.w / mirror.width) * 0.42);
      var ship = sc.add.image(sh.x, sh.y, sh.img).setOrigin(0.5, sh.oy || 0.92).setDepth(sh.y);
      ship.setScale(sh.w / ship.width);
      if (!calm()) {
        sc.tweens.add({ targets: ship, angle: { from: -1.1, to: 1.1 }, y: sh.y + 3, duration: 3200, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
        sc.tweens.add({ targets: mirror, angle: { from: 1.1, to: -1.1 }, duration: 3200, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      }
      ship.setInteractive({ useHandCursor: true });
      G.ship = ship;
    }
    if (def.board) {
      G.boardTarget = {
        kind: 'board', x: def.board.x, y: def.board.y, r: def.board.r, top: def.board.y - 70,
        label: function () { return state.chapter === 1 ? '⛵ Board the Hispaniola' : '🗺️ Open the Sea Chart'; }
      };
      if (G.ship) G.ship.rgTarget = G.boardTarget;
    }
  }
  function buildGlows(sc) {
    (G.def.glows || []).forEach(function (g, i) {
      var spr = sc.add.image(g.x, g.y, 'rg-glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(g.lantern ? 600 : -900).setTint(g.lantern ? 0xffc46b : 0xffb04a);
      var s = (g.r * (g.lantern ? 2.4 : 2.0)) / 128;
      spr.setScale(s).setAlpha(g.lantern ? 0.62 : 0.42);
      if (!calm()) sc.tweens.add({ targets: spr, alpha: { from: spr.alpha, to: spr.alpha * 0.55 }, scale: { from: s, to: s * 0.9 }, duration: 900 + (i % 4) * 260, yoyo: true, repeat: -1, ease: 'Sine.inOut', delay: i * 170 });
    });
    if (G.def.smoke && !calm()) {
      for (var k = 0; k < 6; k++) smokePuff(sc, k * 700);
    }
    if (G.def.lighthouse) {
      var L = G.def.lighthouse;
      G.lamp = sc.add.image(L.x, L.y, 'rg-glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(-890).setTint(0xfff1a8).setScale(0.55).setAlpha(0.5);
      sc.tweens.add({ targets: G.lamp, alpha: { from: 0.5, to: 0.2 }, duration: 1100, yoyo: true, repeat: -1 });
      G.beam = sc.add.image(L.x, L.y, 'rg-beam').setOrigin(0, 0.5).setBlendMode(Phaser.BlendModes.ADD).setDepth(-889).setAlpha(0).setScale(1.5, 1.2);
    }
  }
  function setBeacon(on) {
    if (!G || !G.beam) return;
    on = !!on;
    if (G.beaconOn === on) return;
    G.beaconOn = on;
    G.sc.tweens.add({ targets: G.beam, alpha: on ? 0.75 : 0, duration: 900 });
    if (G.lamp) G.lamp.setScale(on ? 1.1 : 0.55);
  }
  function smokePuff(sc, delay) {
    if (!G || !G.def.smoke) return;
    var s = G.def.smoke;
    var p = sc.add.image(s.x, s.y, 'rg-dot').setDepth(-895).setTint(0xe2e8f0).setAlpha(0).setScale(0.6);
    sc.tweens.add({
      targets: p, delay: delay, x: s.x + rand(-6, 18), y: s.y - rand(55, 80), alpha: { from: 0.42, to: 0 }, scale: { from: 0.6, to: 2.2 }, duration: 4200, ease: 'Sine.out',
      onComplete: function () { p.destroy(); smokePuff(sc, rand(0, 400)); }
    });
  }
  function buildAmbient(sc) {
    var d = G.def;
    G.flies = [];
    if (d.fireflies && !calm()) {
      for (var i = 0; i < d.fireflies.n; i++) {
        var f = sc.add.image(0, 0, 'rg-glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(6000).setTint(0xfde68a).setScale(0.06);
        G.flies.push({ spr: f, cx: rand(d.fireflies.x0, d.fireflies.x1), cy: rand(d.fireflies.y0, d.fireflies.y1), ph: rand(0, 6.28), sp: rand(0.25, 0.6), r: rand(10, 26) });
      }
    }
    G.leaves = [];
    if (d.leaves && !calm()) {
      var tints = [0xf59e0b, 0xfbbf24, 0xea580c, 0xdc2626, 0xfacc15];
      for (var k = 0; k < d.leaves.n; k++) {
        var lf = sc.add.image(0, 0, 'rg-leaf').setDepth(7000).setTint(tints[k % tints.length]).setScale(rand(0.32, 0.5));
        var o = { spr: lf, x: 0, y: 0, vy: 0, ph: 0, sp: 0, amp: 0, rot: 0 };
        resetLeaf(o, true);
        G.leaves.push(o);
      }
    }
    if (d.flint && sc.textures.exists('art/ch1/c_flint_fly1.webp')) {
      var fl = sc.add.image(700, 200, 'art/ch1/c_flint_fly1.webp').setDepth(8000);
      fl.setScale(46 / fl.height);
      fl.setInteractive({ useHandCursor: true });
      fl.rgTarget = { kind: 'flint' };
      G.flint = { spr: fl, t: rand(0, 6), frame: 0, last: 0, swoop: 0 };
    }
    G.swallowAt = 3;
  }
  function resetLeaf(o, anywhere) {
    var L = G.def.leaves;
    o.x = rand(L.x0, L.x1);
    o.y = anywhere ? rand(L.y0, L.floor) : rand(L.y0, L.y1);
    o.vy = rand(14, 26); o.ph = rand(0, 6.28); o.sp = rand(1, 2.2); o.amp = rand(10, 22); o.rot = rand(-2, 2);
    o.spr.setAlpha(0.95);
  }
  function updateAmbient(dt, time) {
    var t = time / 1000;
    G.flies.forEach(function (f) {
      var x = f.cx + Math.sin(t * f.sp + f.ph) * f.r + Math.sin(t * f.sp * 2.3 + f.ph) * 6;
      var y = f.cy + Math.cos(t * f.sp * 0.8 + f.ph) * f.r * 0.6;
      f.spr.setPosition(x, y).setAlpha(0.35 + 0.65 * Math.max(0, Math.sin(t * 2.4 + f.ph * 3)));
    });
    var L = G.def.leaves;
    G.leaves.forEach(function (o) {
      o.y += o.vy * dt;
      o.ph += o.sp * dt;
      var x = o.x + Math.sin(o.ph) * o.amp;
      o.spr.setPosition(x, o.y).setRotation(Math.sin(o.ph * 1.3) * 0.9 + o.rot);
      if (o.y > L.floor - 30) o.spr.setAlpha(Math.max(0, (L.floor - o.y) / 30));
      if (o.y > L.floor) resetLeaf(o, false);
    });
    if (G.flint) {
      var fl = G.flint;
      fl.t += dt * (fl.swoop > 0 ? 0.55 : 0.16);
      if (fl.swoop > 0) fl.swoop -= dt;
      var fx = 760 + Math.sin(fl.t) * 420, fy = 190 + Math.sin(fl.t * 2) * 70;
      var face = Math.cos(fl.t) >= 0 ? 1 : -1;
      if (time - fl.last > 140) { fl.last = time; fl.frame = 1 - fl.frame; fl.spr.setTexture(fl.frame ? 'art/ch1/c_flint_fly2.webp' : 'art/ch1/c_flint_fly1.webp'); fl.spr.setScale(46 / fl.spr.height); }
      fl.spr.setPosition(fx, fy).setFlipX(face < 0);
    }
    if (G.def.swallows && !calm()) {
      G.swallowAt -= dt;
      if (G.swallowAt <= 0) { G.swallowAt = rand(7, 13); flySwallows(); }
    }
  }
  function flySwallows() {
    var sc = G.sc;
    if (!sc.textures.exists('art/ch2/c_swallow.webp')) return;
    var rtl = Math.random() < 0.5, y0 = rand(70, 240), n = 1 + Math.floor(Math.random() * 3);
    for (var i = 0; i < n; i++) {
      (function (k) {
        var sw = sc.add.image(rtl ? IMG_W + 40 : -40, y0 + k * 18, 'art/ch2/c_swallow.webp').setDepth(8000);
        sw.setScale(26 / sw.height).setFlipX(rtl);
        sc.tweens.add({ targets: sw, x: rtl ? -60 : IMG_W + 60, duration: rand(6500, 9000), delay: k * 260, ease: 'Linear', onComplete: function () { sw.destroy(); } });
        sc.tweens.add({ targets: sw, y: sw.y - rand(18, 40), duration: 900, yoyo: true, repeat: 8, ease: 'Sine.inOut', delay: k * 260 });
      })(i);
    }
  }
  function flintSquawk() {
    if (!G.flint) return;
    G.flint.swoop = 2.2;
    sfx('sfxPop');
    showTip('🦜 Squawk! Pieces of eight!', 1800);
    say('Squawk! Pieces of eight! Pieces of eight!');
  }
  function buildOccluders(sc, srcImg) {
    G.occ = [];
    (G.def.occluders || []).forEach(function (o, i) {
      cutout(sc, srcImg, o.poly, 'rg-occ-' + G.def.key + '-' + i).setDepth(o.base);
      var b = bbox(o.poly);
      G.occ.push({ base: o.base, poly: o.poly, x0: b.x, y0: b.y, x1: b.x + b.w, y1: b.y + b.h });
    });
  }
  // When the hero walks behind a post, flowers or the pavilion, show a soft see-through silhouette on top
  function updateGhost() {
    var p = G.pl;
    if (!p.spr) return;
    var h = persp(p.y), w = h * 0.7, hidden = false;
    for (var i = 0; i < G.occ.length && !hidden; i++) {
      var o = G.occ[i];
      if (o.base <= p.y + 0.5) continue;
      if (p.x + w / 2 < o.x0 || p.x - w / 2 > o.x1 || p.y < o.y0 || p.y - h > o.y1) continue;
      var pts = [[p.x, p.y - h * 0.5], [p.x, p.y - h * 0.2], [p.x - w * 0.3, p.y - h * 0.45], [p.x + w * 0.3, p.y - h * 0.45], [p.x, p.y - h * 0.8]];
      var inside = 0;
      for (var k = 0; k < pts.length; k++) if (pip(pts[k][0], pts[k][1], o.poly)) inside++;
      if (inside >= 2) hidden = true;
    }
    if (!p.ghost) {
      p.ghost = G.sc.add.sprite(p.x, p.y, p.spr.texture.key, p.spr.frame.name).setDepth(8400).setAlpha(0).setVisible(false);
    }
    var g = p.ghost;
    var target = hidden ? 0.42 : 0;
    g.alpha += (target - g.alpha) * 0.25;
    if (g.alpha < 0.02 && !hidden) { g.setVisible(false); return; }
    g.setVisible(true);
    if (g.texture.key !== p.spr.texture.key || g.frame.name !== p.spr.frame.name) g.setTexture(p.spr.texture.key, p.spr.frame.name);
    g.setOrigin(p.spr.originX, p.spr.originY).setPosition(p.spr.x, p.spr.y).setScale(p.spr.scaleX, p.spr.scaleY).setFlipX(p.spr.flipX);
    try { g.setTintFill(0x7dd3fc); } catch (e) { g.setTint(0x7dd3fc); }
  }

  /* ───────────────────────── prompt bubble ───────────────────────── */
  function buildPrompt(sc) {
    var c = sc.add.container(0, 0).setDepth(9000).setVisible(false);
    var bg = sc.add.graphics();
    var txt = sc.add.text(0, 0, '', { fontFamily: 'Fredoka, Nunito, Arial, sans-serif', fontSize: '22px', fontStyle: '800', color: '#f8fafc' }).setOrigin(0.5).setResolution(3);
    var key = sc.add.text(0, 0, 'E', { fontFamily: 'Fredoka, Nunito, Arial, sans-serif', fontSize: '18px', fontStyle: '900', color: '#060911' }).setOrigin(0.5).setResolution(3);
    c.add([bg, txt, key]);
    G.prompt = { c: c, bg: bg, txt: txt, key: key, label: '' };
  }
  function setPrompt(t) {
    var P = G.prompt;
    var lbl = t ? t.label() : '';
    if (lbl !== P.label) {
      P.label = lbl;
      P.txt.setText(lbl);
      var showKey = !touchFirst();
      var w = P.txt.width + (showKey ? 52 : 30), h = 42;
      P.bg.clear();
      P.bg.fillStyle(0x020617, 0.55); P.bg.fillRoundedRect(-w / 2, -h / 2 + 5, w, h, 16);
      P.bg.fillStyle(0x0f172a, 0.94); P.bg.fillRoundedRect(-w / 2, -h / 2, w, h, 16);
      P.bg.lineStyle(2, t && t.kind === 'stop' ? 0xfde047 : 0x38bdf8, 1); P.bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 16);
      if (showKey) {
        P.bg.fillStyle(0xfde047, 1); P.bg.fillRoundedRect(-w / 2 + 8, -13, 26, 26, 7);
        P.key.setVisible(true).setPosition(-w / 2 + 21, 0);
        P.txt.setPosition(13, 0);
      } else { P.key.setVisible(false); P.txt.setPosition(0, 0); }
    }
    var act = $('rg-action');
    if (!t) {
      P.c.setVisible(false);
      if (act && !act.hidden) act.hidden = true;
      return;
    }
    var zoom = G.sc.cameras.main.zoom;
    P.c.setVisible(true).setPosition(t.x, (t.top || t.y - 80) - 30).setScale(1 / Math.max(0.6, zoom) * 0.95);
    if (act) {
      act.hidden = false;
      var ic = t.kind === 'stop' ? '⭐' : (t.kind === 'npc' ? '💬' : '⛵');
      if ($('rg-action-ic').textContent !== ic) $('rg-action-ic').textContent = ic;
      var short = t.kind === 'stop' ? ('Stop ' + t.n) : (t.kind === 'npc' ? 'Talk' : (state.chapter === 1 ? 'Sail' : 'Map'));
      if ($('rg-action-lbl').textContent !== short) $('rg-action-lbl').textContent = short;
      act.classList.toggle('gold', t.kind === 'stop');
    }
  }

  /* ───────────────────────── camera ───────────────────────── */
  function camZoomTarget() {
    var sc = G.sc, w = sc.scale.width, h = sc.scale.height;
    var base = Math.max(w / IMG_W, h / IMG_H);
    if (G.overview) return base;
    var k = Math.min(w, h * 1.78) < 1000 ? 1.32 : 1.55;
    return base * k;
  }
  function updateCamera(dt, snap) {
    var cam = G.sc.cameras.main, p = G.pl;
    var zt = camZoomTarget();
    cam.setZoom(snap ? zt : cam.zoom + (zt - cam.zoom) * Math.min(1, dt * 3.2));
    var tx, ty;
    if (G.overview) { tx = IMG_W / 2; ty = IMG_H / 2; }
    else {
      tx = p.x + clamp(p.vx, -260, 260) * 0.32;
      ty = p.y - persp(p.y) * 0.45 + clamp(p.vy, -260, 260) * 0.26;
    }
    if (snap || G.camX == null) { G.camX = tx; G.camY = ty; }
    else { var k = Math.min(1, dt * 4.2); G.camX += (tx - G.camX) * k; G.camY += (ty - G.camY) * k; }
    var vw = cam.width / cam.zoom, vh = cam.height / cam.zoom;
    var cx = clamp(G.camX, vw / 2, Math.max(vw / 2, IMG_W - vw / 2));
    var cy = clamp(G.camY, vh / 2, Math.max(vh / 2, IMG_H - vh / 2));
    cam.centerOn(cx, cy);
  }

  /* ───────────────────────── input ───────────────────────── */
  function gesture() {
    if (state.firstGesture) return;
    state.firstGesture = true;
    try { if (A().startAmbience) A().startAmbience(); } catch (e) { /* quiet */ }
  }
  function joyShow(x, y) { var j = $('rg-joy'); if (!j) return; j.style.left = x + 'px'; j.style.top = y + 'px'; j.classList.add('on'); }
  function joyKnob(dx, dy, len) { var k = $('rg-joy-knob'); if (!k) return; var m = Math.min(len, 46) / (len || 1); k.style.transform = 'translate(' + (dx * m) + 'px,' + (dy * m) + 'px)'; }
  function joyHide() { var j = $('rg-joy'), k = $('rg-joy-knob'); if (j) j.classList.remove('on'); if (k) k.style.transform = ''; }
  function setupInput(sc) {
    if (sc.input.keyboard) {
      G.keys = sc.input.keyboard.addKeys({ up: 'UP', down: 'DOWN', left: 'LEFT', right: 'RIGHT', w: 'W', a: 'A', s: 'S', d: 'D', e: 'E', space: 'SPACE', enter: 'ENTER', shift: 'SHIFT' }, false);
    }
    sc.input.on('pointerdown', function (p, over) {
      if (domBlocked() || state.busy) return;
      gesture();
      G.ptr = { id: p.id, sx: p.x, sy: p.y, joy: false, over: over && over.length ? over[0] : null };
    });
    sc.input.on('pointermove', function (p) {
      var q = G.ptr;
      if (!q || q.id !== p.id || !p.isDown) return;
      var dx = p.x - q.sx, dy = p.y - q.sy, len = Math.sqrt(dx * dx + dy * dy);
      if (!q.joy && len > 18) { q.joy = true; stopPlayer(); hideTalk(); joyShow(q.sx, q.sy); }
      if (q.joy) {
        var k = Math.min(1, len / 60);
        G.joy = { x: dx / (len || 1) * k, y: dy / (len || 1) * k };
        joyKnob(dx, dy, len);
      }
    });
    var up = function (p) {
      var q = G.ptr;
      if (!q || q.id !== p.id) return;
      G.ptr = null;
      if (q.joy) { G.joy = null; joyHide(); return; }
      if (domBlocked() || state.busy) return;
      handleTap(p, q.over);
    };
    sc.input.on('pointerup', up);
    sc.input.on('pointerupoutside', up);
  }
  function handleTap(p, over) {
    var t = over && over.rgTarget;
    if (t && t.kind === 'me') { cheer(900); sfx('sfxPop'); return; }
    if (t && t.kind === 'ball') { if (dist(G.pl.x, G.pl.y, G.ball.x, G.ball.y) < 90) kickBall(260); else walkTo(G.ball.x, G.ball.y); return; }
    if (t) { goToTarget(t); return; }
    var wx = p.worldX, wy = p.worldY;
    if (wx < 0 || wy < 0 || wx > IMG_W || wy > IMG_H) return;
    var hit = null, hd = 1e9;
    targetsAll().forEach(function (tg) {
      var top = tg.top || tg.y - 60, d = Math.abs(wx - tg.x) < 34 && wy > top - 20 && wy < tg.y + 16 ? Math.abs(wy - tg.y) : 1e9;
      if (d < hd) { hd = d; hit = tg; }
    });
    if (hit) { goToTarget(hit); return; }
    var pt = G.nav.nearest(wx, wy, 16);
    if (!pt) return;
    hideTalk();
    if (walkTo(pt[0], pt[1])) ripple(pt[0], pt[1]);
  }
  function ripple(x, y) {
    var sc = G.sc, r = sc.add.image(x, y, 'rg-ring').setDepth(y - 0.7).setTint(0xffffff).setBlendMode(Phaser.BlendModes.ADD).setScale(0.12 * pscale(y)).setAlpha(0.9);
    sc.tweens.add({ targets: r, scale: 0.34 * pscale(y), alpha: 0, duration: 520, ease: 'Quad.out', onComplete: function () { r.destroy(); } });
  }

  /* ───────────────────────── HUD + wayfinder ───────────────────────── */
  function mountHud() {
    var host = $('rg-hud');
    if (!host || !UF() || !UF().mountUnifiedHud) return;
    var def = G.def;
    UF().mountUnifiedHud(host, {
      chapter: def.chapter,
      title: def.title,
      findsMax: (def.finds || []).length,
      getFindsCount: function () { return G && G.def === def ? foundList().length : 0; },
      isOverview: function () { return !!(G && G.overview); },
      onToggleCam: function () { if (G) G.overview = !G.overview; },
      onTapFinds: function () {
        var left = (def.finds || []).length - foundList().length;
        var msg = left > 0 ? ('Look for ' + left + ' more sparkling treasures! Walk close to pick them up.') : 'You found every hidden treasure here!';
        showTip('✨ ' + msg, 2600); say(msg);
      },
      onSelectStop: function (n) { walkToStop(n, true); },
      onModeChanged: function () { if (!G) return; buildFinds(G.sc); refreshMarkers(); }
    });
  }
  function updateWayfinder() {
    var el = $('rg-wayfinder');
    if (!el || !UF() || !UF().updateWayfinder) return;
    var nx = nextStop();
    if (nx > 5 || state.busy || domBlocked()) { el.hidden = true; return; }
    var st = G.stops[nx - 1], scr = toScreen(st.rx, st.ry - 30);
    UF().updateWayfinder(el, { overview: !!G.overview }, { screenX: scr.x, screenY: scr.y }, 'Stop ' + nx);
  }

  /* ───────────────────────── the Phaser scene ───────────────────────── */
  function assetList(def) {
    var a = [def.bg];
    (def.stops || []).forEach(function (s) { if (s.prop) a.push(s.prop); });
    (def.npcs || []).forEach(function (n) { a.push(n.img); if (n.happy) a.push(n.happy); });
    (def.finds || []).forEach(function (f) { a.push(f.img); });
    (def.boats || []).forEach(function (b) { a.push(b.img); });
    if (def.ship) a.push(def.ship.img);
    var c = def.companion;
    if (c) [c.img, c.walk1, c.walk2, c.sit, c.happy].forEach(function (k) { if (k) a.push(k); });
    if (def.flint) a.push('art/ch1/c_flint_fly1.webp', 'art/ch1/c_flint_fly2.webp');
    if (def.swallows) a.push('art/ch2/c_swallow.webp');
    if (def.ball) a.push('art/flat/o_ball.webp');
    if (def.crabs && def.crabs.length) a.push('art/flat/e_sand_crab.webp');
    a.push('art/flat/c_benbow_happy.webp', 'art/kenney/arrow_down.webp');
    return a.filter(function (v, i) { return v && a.indexOf(v) === i; });
  }
  function wantHiRes() {
    var dpr = Math.min(2, root.devicePixelRatio || 1);
    return Math.max(root.innerWidth, root.innerHeight) * dpr > 1500 && Q.get('lowres') !== '1';
  }

  var RealScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function RealScene() { Phaser.Scene.call(this, { key: 'rg' }); },
    init: function (data) {
      this.rgChapter = (data && data.chapter) || state.chapter || 1;
      this.rgOpts = (data && data.opts) || {};
    },
    preload: function () {
      var def = CH()['ch' + this.rgChapter];
      var sc = this;
      setLoading(0, false);
      sc.load.on('progress', function (v) { setLoading(v, false); });
      var bgKey = 'rg-bg-' + def.key + (wantHiRes() ? '-2x' : '');
      if (!sc.textures.exists(bgKey)) sc.load.image(bgKey, wantHiRes() && def.bg2x ? def.bg2x : def.bg);
      sc.rgBgKey = bgKey;
      assetList(def).forEach(function (k) { if (k !== def.bg && !sc.textures.exists(k)) sc.load.image(k, k); });
    },
    create: function () { buildWorld(this); },
    update: function (time, delta) { tick(this, time, delta); }
  });

  function buildWorld(sc) {
    var def = CH()['ch' + sc.rgChapter];
    state.chapter = def.chapter;
    G = {
      sc: sc, def: def, nav: new Nav(def), stops: [], npcs: [], finds: [], crabs: [], trail: [], flies: [], leaves: [], glints: [],
      pl: { x: def.spawn.x, y: def.spawn.y, vx: 0, vy: 0, dir: 'down', face: 1, moving: false, phase: 0, stepAcc: 0, path: null, onArrive: null, stuck: 0, spr: null, key: null, visH: 180, originY: 0.84 },
      overview: false, focus: null, talkOpen: false, camX: null, camY: null, wayAt: 0, refreshAt: 0, hintShown: false
    };
    var opts = sc.rgOpts || {};
    sc.cameras.main.setBackgroundColor('#060911');
    sc.cameras.main.setBounds(0, 0, IMG_W, IMG_H);
    makeTextures(sc);

    var bgTex = sc.textures.get(sc.rgBgKey);
    var src = bgTex.getSourceImage();
    var bg = sc.add.image(0, 0, sc.rgBgKey).setOrigin(0, 0).setDepth(-1000);
    bg.setScale(IMG_W / Math.max(1, src.width));

    buildSea(sc, src);
    buildShipBoats(sc);
    buildGlows(sc);
    buildOccluders(sc, src);
    buildStops(sc);
    buildNpcs(sc);
    buildFinds(sc);
    buildBall(sc);
    buildCrabs(sc);
    G.nav.build();

    // spawn: arriving by sea, returning to the last spot, or the chapter start
    var sp = opts.sailIntro ? def.spawnFromSea : (state.lastPos[def.key] || def.spawn);
    var start = G.nav.nearest(sp.x, sp.y, 30) || [def.spawn.x, def.spawn.y];
    G.pl.x = start[0]; G.pl.y = start[1];
    G.pl.shadow = addShadow(sc, G.pl.x, G.pl.y, 60);
    buildCompanion(sc);
    buildAmbient(sc);
    buildPrompt(sc);

    G.fx = sc.add.particles(0, 0, 'rg-dot', { speed: { min: 60, max: 220 }, lifespan: 650, scale: { start: 0.45, end: 0 }, tint: [0xfde047, 0xffffff, 0x38bdf8, 0xf472b6], emitting: false }).setDepth(8600);
    G.party = sc.add.particles(0, 0, 'rg-dot', { speed: { min: 140, max: 420 }, angle: { min: 200, max: 340 }, gravityY: 380, lifespan: 1500, scale: { start: 0.6, end: 0.1 }, tint: [0xfde047, 0x38bdf8, 0xf43f5e, 0x10b981, 0xa855f7], emitting: false }).setDepth(8600);
    G.dust = sc.add.particles(0, 0, 'rg-dot', { speed: { min: 6, max: 26 }, angle: { min: 200, max: 340 }, lifespan: 460, scale: { start: 0.32, end: 0 }, alpha: { start: 0.6, end: 0 }, emitting: false });

    setupInput(sc);
    var onResize = function () { if (!G || G.sc !== sc) return; sc.cameras.resize(sc.scale.width, sc.scale.height); updateCamera(0, true); };
    sc.scale.on('resize', onResize);
    sc.events.once('shutdown', function () { sc.scale.off('resize', onResize); });

    refreshMarkers();
    mountHud();
    updateCamera(0, true);
    if (!state.lookHooked && UF() && UF().onLookChanged) {
      state.lookHooked = true;
      UF().onLookChanged(function () { if (G && G.sc && G.sc.sys.isActive()) { bakePlayer(G.sc); refreshMarkers(); buildFinds(G.sc); } });
    }

    bakePlayer(sc).then(function (ok) {
      if (!G || G.sc !== sc) return;
      if (!ok) fallbackPlayer(sc);
      setLoading(1, true);
      fade(false);
      sc.cameras.main.fadeIn(450, 6, 9, 17);
      afterArrive(opts);
    });
  }

  function afterArrive(opts) {
    var def = G.def, g = grade();
    var greet = function () {
      if (!G) return;
      if (opts.stopNum) { walkToStop(opts.stopNum, true); return; }
      var nx = nextStop();
      var msg = (def.greet && (def.greet['g' + g] || def.greet.g3)) || '';
      if (msg) setTimeout(function () { if (G && !state.paused && !domBlocked()) say(msg); }, 500);
      showTip(touchFirst() ? '👆 Drag to walk · Tap ⭐ to play · Tap people to talk' : '⌨️ WASD / Arrows to walk · Shift to run · E to talk · Click to walk there', 5200);
      if (nx <= 5) setTimeout(function () { if (G) refreshMarkers(); }, 300);
    };
    if (def.chapter === 2 && opts.sailIntro && root.BayWorld && root.BayWorld.playSailCutscene) {
      root.BayWorld.playSailCutscene(true, greet);
    } else {
      greet();
    }
  }

  function tick(sc, time, delta) {
    if (!G || G.sc !== sc) return;
    var dt = Math.min(0.05, delta / 1000);
    var blocked = domBlocked() || state.busy;
    if (blocked && G.ptr) { G.ptr = null; G.joy = null; joyHide(); }

    if (G.ripple) {
      G.ripple.t += dt;
      G.ripple.ts.tilePositionX = G.ripple.t * 9;
      G.ripple.ts.tilePositionY = G.ripple.t * 5;
      if (((time / 33) | 0) !== G.ripple.last) {
        G.ripple.last = (time / 33) | 0;
        try { G.ripple.dyn.clear().draw(G.ripple.ts, 0, 0).render(); } catch (e) { G.ripple = null; }
      }
    }
    if (G.beam && G.beaconOn) G.beam.setRotation(Math.PI + Math.sin(time / 1800) * 0.42);

    updatePlayer(dt, time, blocked);
    updateGhost();
    updateCompanion(dt, time);
    updateNpcs(time);
    updateBall(dt);
    updateCrabs(dt, time);
    updateFinds(dt);
    updateAmbient(dt, time);
    updateCamera(dt, false);

    // keyboard interaction (always read the keys so a press inside a lesson never fires later)
    var k = G.keys, jd = k ? [Phaser.Input.Keyboard.JustDown(k.e), Phaser.Input.Keyboard.JustDown(k.space), Phaser.Input.Keyboard.JustDown(k.enter)] : [];
    var pressed = !blocked && !!(jd[0] || jd[1] || jd[2]);
    if (G.talkOpen && pressed) { hideTalk(); pressed = false; }
    G.focus = blocked || G.pl.path ? null : findFocus();
    setPrompt(blocked ? null : G.focus);
    if (pressed && G.focus) interact(G.focus);

    if (time > G.wayAt) { G.wayAt = time + 120; updateWayfinder(); }
    if (time > G.refreshAt) {
      G.refreshAt = time + 1500;
      if (!blocked && nextStop() !== G.lastNext) refreshMarkers();
      state.lastPos[G.def.key] = { x: G.pl.x, y: G.pl.y };
    }
  }

  /* ───────────────────────── public API ───────────────────────── */
  function createGame(zone, opts) {
    ensureDom();
    state.game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: 'rg-stage',
      backgroundColor: '#060911',
      scale: { mode: Phaser.Scale.RESIZE, width: root.innerWidth, height: root.innerHeight },
      render: { antialias: true, roundPixels: false },
      input: { activePointers: 2 },
      banner: false,
      scene: []
    });
    state.game.scene.add('rg', RealScene, true, { chapter: zone, opts: opts || {} });
  }

  root.RealIsland = {
    enabled: function () {
      return Q.get('classic') !== '1' && Q.get('oldmap') !== '1' && !!root.Phaser && !!root.RG_CHAPTERS;
    },
    start: function (zone, opts) {
      opts = opts || {};
      var z = zone === 2 ? 2 : 1;
      ensureDom();
      var r = $('rg-root');
      r.style.display = '';
      document.body.classList.add('rg-on');
      state.paused = false;
      hideTalk();
      if (!state.game) {
        state.chapter = z;
        fade(true);
        createGame(z, opts);
        return;
      }
      try { state.game.loop.wake(); } catch (e) { /* awake */ }
      var sc = state.game.scene.getScene('rg');
      if (!sc || !G || state.chapter !== z || opts.restart || opts.sailIntro) {
        if (G) state.lastPos[G.def.key] = { x: G.pl.x, y: G.pl.y };
        state.chapter = z;
        G = null;
        fade(true);
        setLoading(0, false);
        if (sc) sc.scene.restart({ chapter: z, opts: opts });
        else state.game.scene.add('rg', RealScene, true, { chapter: z, opts: opts });
        return;
      }
      mountHud();
      refreshMarkers();
      buildFinds(G.sc);
      if (opts.stopNum) walkToStop(opts.stopNum, true);
    },
    pause: function () {
      if (state.paused) return;
      state.paused = true;
      var r = $('rg-root');
      if (r) r.style.display = 'none';
      document.body.classList.remove('rg-on');
      hideTalk();
      if (G) { state.lastPos[G.def.key] = { x: G.pl.x, y: G.pl.y }; stopPlayer(); }
      try { if (state.game) state.game.loop.sleep(); } catch (e) { /* asleep */ }
    },
    isActive: function () { return !state.paused && !!G; },
    chapter: function () { return state.chapter; },
    walkToStop: function (n) { walkToStop(n, true); },
    refresh: function () { refreshMarkers(); if (G) buildFinds(G.sc); },
    // read-only probe used by the safe local test harness
    debug: function () {
      if (!G) return { ready: false };
      var cam = G.sc.cameras.main;
      return {
        ready: !!G.pl.spr, chapter: G.def.chapter, paused: state.paused, busy: state.busy,
        player: { x: Math.round(G.pl.x), y: Math.round(G.pl.y), moving: G.pl.moving, path: G.pl.path ? G.pl.path.length : 0, sheet: !!G.pl.key },
        zoom: +cam.zoom.toFixed(2), focus: G.focus ? G.focus.kind + (G.focus.n ? G.focus.n : '') : null,
        stops: G.stops.length, npcs: G.npcs.length, finds: G.finds.length, crabs: G.crabs.length, ball: !!G.ball,
        ripple: !!G.ripple, renderer: G.sc.sys.renderer && G.sc.sys.renderer.gl ? 'webgl' : 'canvas',
        walkCells: G.nav.grid ? G.nav.grid.reduce(function (a, v) { return a + v; }, 0) : 0,
        next: nextStop(), talk: !!G.talkOpen, ghost: G.pl.ghost ? +G.pl.ghost.alpha.toFixed(2) : 0, beacon: !!G.beaconOn
      };
    },
    _test: {
      walkTo: function (x, y) { return G ? walkTo(x, y) : false; },
      teleport: function (x, y) { if (!G) return false; var p = G.nav.nearest(x, y, 20); if (!p) return false; G.pl.x = p[0]; G.pl.y = p[1]; G.trail = []; updateCamera(0, true); return true; },
      ok: function (x, y) { return G ? G.nav.ok(x, y) : false; },
      interactFocus: function () { if (G && G.focus) { interact(G.focus); return true; } return false; }
    }
  };
})(typeof window !== 'undefined' ? window : this);
