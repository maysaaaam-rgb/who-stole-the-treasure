/* Game Maker "game feel" layer. Loaded after core.js; it wraps the shared helpers so EVERY game gets:
   - monsters that act: idle breathing, a cheer jump on a right answer, a head-scratch on a wrong one, a happy wave when they score;
   - scores that count up, with coins flying from the action into the team's plate;
   - a screen shake for big moments and a soft zoom-punch on the board;
   - screens that slide in instead of cutting;
   - a living background (drifting clouds or twinkling stars, a bouncing crowd of flags at the bottom). */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {}, U = GM.u, A = function () { return GM.audio; };
  if (!U) return;
  var reduce = false;
  try { reduce = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* ignore */ }

  /* ---------- helpers ---------- */
  function center(el) { if (!el || !el.getBoundingClientRect) return { x: innerWidth / 2, y: innerHeight / 2 }; var r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
  function layer() { return document.getElementById('gm-fx'); }
  function podOf(i) { return document.getElementById('gm-team-' + i); }
  function teamIndex(team) { var T = (GM.state && GM.state.teams) || []; return T.indexOf(team); }
  function restart(el, cls) { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

  /* ---------- monsters act ---------- */
  function react(i, kind) {
    var pod = podOf(i); if (!pod) return; var mon = pod.querySelector('.gm-pod-mon'); if (!mon) return;
    var cls = { cheer: 'gm-act-cheer', sad: 'gm-act-sad', score: 'gm-act-wave', big: 'gm-act-spin' }[kind] || 'gm-act-cheer';
    ['gm-act-cheer', 'gm-act-sad', 'gm-act-wave', 'gm-act-spin'].forEach(function (c) { mon.classList.remove(c); });
    void mon.offsetWidth; mon.classList.add(cls);
    if (kind === 'cheer' || kind === 'big') burstAt(center(mon), kind === 'big' ? 18 : 10, ['⭐', '✨', '🌟']);
    if (kind === 'sad') floatAt(center(mon), '?', 'soft');
    setTimeout(function () { mon.classList.remove(cls); }, 1300);
  }

  /* ---------- particles: a burst of emoji from a point ---------- */
  function burstAt(p, n, list) {
    var L = layer(); if (!L || reduce) return;
    for (var k = 0; k < n; k++) {
      var s = U.h('span', { class: 'gm-part', text: list[k % list.length] }), a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 120;
      s.style.left = p.x + 'px'; s.style.top = p.y + 'px'; s.style.setProperty('--dx', Math.cos(a) * d + 'px'); s.style.setProperty('--dy', (Math.sin(a) * d - 40) + 'px'); s.style.fontSize = (16 + Math.random() * 18) + 'px';
      L.appendChild(s); (function (x) { setTimeout(function () { x.remove(); }, 900); })(s);
    }
  }
  function floatAt(p, text, cls) {
    var L = layer(); if (!L) return; var s = U.h('span', { class: 'gm-float ' + (cls || ''), text: text }); s.style.left = p.x + 'px'; s.style.top = p.y + 'px'; L.appendChild(s);
    setTimeout(function () { s.remove(); }, 1500);
  }
  /* coins fly from a point to the team plate, then the score counts up */
  function flyCoins(from, i, n, done) {
    var pod = podOf(i), L = layer(); if (!pod || !L || reduce) { done(); return; }
    var target = center(pod.querySelector('.gm-score') || pod), count = Math.max(3, Math.min(10, Math.round(n / 5))), arrived = 0;
    for (var k = 0; k < count; k++) (function (k) {
      var c = U.h('span', { class: 'gm-coin' }); var sx = from.x + (Math.random() - 0.5) * 60, sy = from.y + (Math.random() - 0.5) * 40;
      c.style.left = sx + 'px'; c.style.top = sy + 'px'; L.appendChild(c);
      setTimeout(function () {
        c.style.transition = 'left .55s cubic-bezier(.5,-0.3,.7,1), top .55s cubic-bezier(.3,0,.5,1.4), transform .55s'; c.style.left = target.x + 'px'; c.style.top = target.y + 'px'; c.style.transform = 'translate(-50%,-50%) scale(.6)';
        setTimeout(function () { c.remove(); arrived++; if (k === 0) A().play('tap'); if (arrived === count) done(); }, 580);
      }, 60 + k * 55);
    })(k);
  }
  function countTo(el, from, to) {
    if (!el) return; var t0 = performance.now(), dur = Math.min(900, 250 + Math.abs(to - from) * 12);
    (function step(now) { var k = Math.min(1, (now - t0) / dur), v = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))); el.textContent = String(v); if (k < 1) requestAnimationFrame(step); else { el.textContent = String(to); restart(el, 'gm-bump'); } })(t0);
  }

  /* ---------- wrap the score helpers: count up + flying coins ---------- */
  var lastFloat = null, lastFloatAt = 0;
  var oFloat = U.floatText;
  U.floatText = function (text, el, cls) { lastFloat = el; lastFloatAt = Date.now(); return oFloat(text, el, cls); };
  U.setScore = function (i, n) {
    var t = GM.state.teams[i]; var before = t.score; t.score = Math.max(0, n); var el = document.querySelector('#gm-team-' + i + ' .gm-score');
    if (!el) return; var to = t.score;
    setTimeout(function () {
      var gain = to - before;
      if (gain > 0) { var from = (lastFloat && Date.now() - lastFloatAt < 300) ? center(lastFloat) : { x: innerWidth / 2, y: innerHeight * 0.45 }; flyCoins(from, i, gain, function () { countTo(el, before, to); react(i, gain >= 30 ? 'big' : 'score'); }); if (gain >= 40) shake(8); }
      else countTo(el, before, to);
    }, 0);
  };
  U.addScore = function (i, n) { U.setScore(i, GM.state.teams[i].score + n); };

  /* ---------- wrap the question card: the team's monster reacts ---------- */
  var oAsk = U.ask;
  U.ask = function (item, team, opts) {
    var i = teamIndex(team), pod = podOf(i);
    if (pod) restart(pod.querySelector('.gm-pod-mon'), 'gm-act-wave');
    return oAsk(item, team, opts).then(function (res) { if (i >= 0 && !res.skipped) react(i, res.ok ? 'cheer' : 'sad'); return res; });
  };

  /* ---------- the team bar: idle life, the active team steps forward ---------- */
  var oBar = U.teamBar;
  U.teamBar = function (teams, active) {
    var bar = document.getElementById('gm-teams'), prev = bar && bar.querySelector('.gm-pod.on'), prevIdx = prev ? +prev.id.replace('gm-team-', '') : -1;
    oBar(teams, active);
    if (!bar) return;
    [].forEach.call(bar.querySelectorAll('.gm-pod-mon'), function (m, k) { m.style.animationDelay = (k * 0.37) + 's'; });
    if (active >= 0 && active !== prevIdx) { var p = podOf(active); if (p) { restart(p, 'gm-step-in'); A().play('hunt_step'); } }
  };

  /* ---------- screen shake and board punch ---------- */
  function shake(px) {
    if (reduce) return; var st = document.getElementById('gm-stage'); if (!st) return;
    st.style.setProperty('--sh', (px || 6) + 'px'); restart(st, 'gm-shake'); setTimeout(function () { st.classList.remove('gm-shake'); }, 450);
  }
  function punch(el) { restart(el, 'gm-punch'); }
  function squash(el, sx, sy, ms) {
    if (!el || reduce) return;
    sx = sx || 1.18; sy = sy || 0.84; ms = ms || 260;
    el.animate([
      { transform: 'scale(1, 1)' },
      { transform: 'scale(' + sx + ', ' + sy + ')', offset: 0.35 },
      { transform: 'scale(' + (2 - sx * 0.92) + ', ' + (2 - sy * 0.92) + ')', offset: 0.7 },
      { transform: 'scale(1, 1)' }
    ], { duration: ms, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
  }

  /* ---------- shared 60fps overlay canvas for shockwaves, sparks & win beams ---------- */
  var fxCv = null, fxCtx = null, fxItems = [], fxRaf = 0;
  function ensureFxCanvas() {
    var L = layer(); if (!L) return null;
    if (!fxCv || !fxCv.parentNode) {
      fxCv = U.h('canvas', { class: 'gm-fx-cv' });
      fxCv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:102;';
      L.appendChild(fxCv);
    }
    var w = root.innerWidth || 1280, h = root.innerHeight || 720;
    if (fxCv.width !== w || fxCv.height !== h) { fxCv.width = w; fxCv.height = h; }
    fxCtx = fxCv.getContext('2d');
    return fxCtx;
  }
  function stepFxCanvas() {
    fxRaf = 0;
    var g = ensureFxCanvas(); if (!g) { fxItems.length = 0; return; }
    g.clearRect(0, 0, fxCv.width, fxCv.height);
    var now = performance.now();
    for (var i = fxItems.length - 1; i >= 0; i--) {
      var it = fxItems[i], u = Math.min(1, (now - it.t0) / it.dur);
      if (it.kind === 'ring') {
        g.save();
        g.strokeStyle = it.color || '#ffe066';
        g.lineWidth = Math.max(2, (1 - u) * (it.lw || 10));
        g.globalAlpha = Math.max(0, 1 - u);
        g.beginPath();
        g.arc(it.x, it.y, it.r0 + (it.r1 - it.r0) * (1 - Math.pow(1 - u, 3)), 0, Math.PI * 2);
        g.stroke();
        g.restore();
      } else if (it.kind === 'spark') {
        it.vx *= 0.97; it.vy = it.vy * 0.97 + 0.38;
        it.x += it.vx; it.y += it.vy;
        g.save();
        g.fillStyle = it.color;
        g.globalAlpha = Math.max(0, 1 - u);
        g.beginPath();
        g.arc(it.x, it.y, Math.max(1.5, it.r * (1 - u * 0.6)), 0, Math.PI * 2);
        g.fill();
        g.restore();
      } else if (it.kind === 'beam') {
        var drawU = Math.min(1, u * 2.5), alpha = u < 0.75 ? 1 : (1 - (u - 0.75) / 0.25);
        var ex = it.x1 + (it.x2 - it.x1) * drawU, ey = it.y1 + (it.y2 - it.y1) * drawU;
        g.save();
        g.lineCap = 'round';
        g.globalAlpha = Math.max(0, alpha);
        g.strokeStyle = '#ffffff';
        g.lineWidth = 18;
        g.shadowColor = it.color || '#ffe066';
        g.shadowBlur = 24;
        g.beginPath(); g.moveTo(it.x1, it.y1); g.lineTo(ex, ey); g.stroke();
        g.strokeStyle = it.color || '#ffe066';
        g.lineWidth = 10;
        g.beginPath(); g.moveTo(it.x1, it.y1); g.lineTo(ex, ey); g.stroke();
        g.restore();
      }
      if (u >= 1) fxItems.splice(i, 1);
    }
    if (fxItems.length) fxRaf = requestAnimationFrame(stepFxCanvas);
  }
  function kickFx() { if (!fxRaf && fxItems.length) fxRaf = requestAnimationFrame(stepFxCanvas); }
  function shockwave(ptOrEl, color, maxR, durMs) {
    if (reduce) return;
    var p = (ptOrEl && typeof ptOrEl.x === 'number') ? ptOrEl : center(ptOrEl);
    fxItems.push({ kind: 'ring', x: p.x, y: p.y, r0: 12, r1: maxR || 150, color: color || '#ffe066', lw: 10, t0: performance.now(), dur: durMs || 480 });
    kickFx();
  }
  function sparks(ptOrEl, count, cols, speed) {
    if (reduce) return;
    var p = (ptOrEl && typeof ptOrEl.x === 'number') ? ptOrEl : center(ptOrEl);
    cols = cols || ['#ffe066', '#ff5d73', '#38bdf8', '#2ecc71', '#ffffff'];
    var n = count || 22, sp = speed || 9;
    var now = performance.now();
    for (var k = 0; k < n; k++) {
      var a = (k / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.4, v = sp * (0.45 + Math.random() * 0.75);
      fxItems.push({ kind: 'spark', x: p.x, y: p.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2.5, r: 4 + Math.random() * 5, color: cols[k % cols.length], t0: now, dur: 520 + Math.random() * 280 });
    }
    kickFx();
  }
  function beam(fromEl, toEl, color, durMs) {
    if (reduce) return;
    var p1 = (fromEl && typeof fromEl.x === 'number') ? fromEl : center(fromEl);
    var p2 = (toEl && typeof toEl.x === 'number') ? toEl : center(toEl);
    fxItems.push({ kind: 'beam', x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, color: color || '#ffe066', t0: performance.now(), dur: durMs || 1400 });
    kickFx();
  }

  /* ---------- screens slide in ---------- */
  var mo = new MutationObserver(function (list) {
    list.forEach(function (m) { [].forEach.call(m.addedNodes, function (n) { if (n.nodeType === 1 && n.parentNode && n.parentNode.id === 'gm-stage' && !n.classList.contains('gm-over')) restart(n, 'gm-enter'); }); });
  });
  function watch() { var st = document.getElementById('gm-stage'); if (st) mo.observe(st, { childList: true }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch); else watch();

  /* ---------- living background: a crowd of flags along the bottom ---------- */
  function crowd() {
    var bg = document.querySelector('.gm-bg'); if (!bg || bg.querySelector('.gm-crowd')) return;
    var c = U.h('div', { class: 'gm-crowd' }), cols = ['#ff5d73', '#2aa8ff', '#ffb21a', '#2ecc71', '#9b6bff'];
    for (var k = 0; k < 26; k++) { var f = U.h('i'); f.style.left = (k * 4 + Math.random() * 2) + '%'; f.style.setProperty('--c', cols[k % cols.length]); f.style.animationDelay = (Math.random() * 1.2) + 's'; f.style.height = (26 + Math.random() * 26) + 'px'; c.appendChild(f); }
    bg.appendChild(c);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', crowd); else crowd();

  GM.juice = { react: react, burstAt: burstAt, floatAt: floatAt, flyCoins: flyCoins, shake: shake, punch: punch, squash: squash, shockwave: shockwave, sparks: sparks, beam: beam, center: center };
})(window);
