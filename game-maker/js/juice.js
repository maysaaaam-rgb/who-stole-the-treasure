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

  GM.juice = { react: react, burstAt: burstAt, floatAt: floatAt, flyCoins: flyCoins, shake: shake, punch: punch, center: center };
})(window);
