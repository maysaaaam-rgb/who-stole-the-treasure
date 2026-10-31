/* Game Maker teacher tools, in the spirit of Baamboozle's teacher controls:
   1. ✏️ Scores: change any team's score or name while playing.
   2. Judge: "Anyone can answer" (the teacher gives the points to any team) and "Partial credit" (the teacher picks how many points).
   3. Choose questions: tick which questions of a set to play.
   4. Picture tricks: Super Zoom (tap a picture for full screen) and Blur (slide to reveal).
   Everything is plain DOM, works offline and never takes points away by itself. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {}, U = GM.u, h = U.h, btn = U.btn, A = GM.audio, T = GM.tools = {};

  function team(i) { return (GM.state && GM.state.teams || [])[i]; }
  function activeIndex() { var on = document.querySelector('.gm-pod.on'); return on ? (+on.id.replace('gm-team-', '') || 0) : 0; }
  function refreshBar() { try { U.teamBar(GM.state.teams, activeIndex()); } catch (e) { /* not playing */ } }
  function close(o) { if (o && o.parentNode) o.parentNode.removeChild(o); }
  function layer(extra) { var o = h('div', { class: 'gm-tt' + (extra ? ' ' + extra : '') }); document.body.appendChild(o); return o; }

  /* ---------------- 1. edit scores and names ---------------- */
  T.scoreEditor = function () {
    var old = document.getElementById('gm-sedit'); if (old) { close(old); return; }
    var teams = (GM.state && GM.state.teams) || []; if (!teams.length) return;
    var ov = layer(); ov.id = 'gm-sedit';
    var card = h('div', { class: 'gm-tt-card' }, [h('h3', { text: '✏️ Scores and team names' }), h('p', { class: 'gm-tt-hint', text: 'Fix a mistake or give a bonus. The game goes on from here.' })]);
    teams.forEach(function (t, i) {
      var row = h('div', { class: 'gm-tt-row' }), dot = h('span', { class: 'gm-tt-dot' });
      dot.style.background = t.color;
      var name = h('input', { class: 'gm-tt-name', value: t.name, maxlength: '14', title: 'Team name', 'aria-label': 'Team name' });
      name.addEventListener('input', function () { t.name = name.value || (GM.teamNames && GM.teamNames[i]) || ('Team ' + (i + 1)); refreshBar(); });
      var score = h('input', { class: 'gm-tt-score', type: 'number', min: '0', value: String(t.score), inputmode: 'numeric', 'aria-label': 'Score' });
      function set(v) { v = Math.max(0, Math.round(+v || 0)); U.setScore(i, v); score.value = String(v); }
      score.addEventListener('change', function () { set(score.value); });
      row.appendChild(dot); row.appendChild(name);
      [['−10', -10], ['−5', -5]].forEach(function (d) { row.appendChild(btn(d[0], 'sm ghost', function () { set(t.score + d[1]); })); });
      row.appendChild(score);
      [['+5', 5], ['+10', 10]].forEach(function (d) { row.appendChild(btn(d[0], 'sm', function () { set(t.score + d[1]); })); });
      card.appendChild(row);
    });
    card.appendChild(btn('Done', 'huge green', function () { close(ov); refreshBar(); }));
    ov.appendChild(card);
    ov.addEventListener('click', function (e) { if (e.target === ov) { close(ov); refreshBar(); } });
  };

  /* ---------------- 2. judge: who gets the points, and how many ---------------- */
  var FRACS = [[0, '0'], [0.25, '¼'], [0.5, '½'], [0.75, '¾'], [1, 'All']];
  /* o: { teams, turn, anyone, partial, ok, base }  ->  Promise({ team: index or -1, frac }) */
  T.judge = function (o) {
    return new Promise(function (resolve) {
      var sel = o.ok ? o.turn : -1, frac = o.partial ? (o.ok ? 1 : 0) : 1;
      var ov = layer(), card = h('div', { class: 'gm-tt-card' }), teamRow = h('div', { class: 'gm-tt-opts' }), fracRow = h('div', { class: 'gm-tt-opts' }), go;
      card.appendChild(h('h3', { text: o.anyone ? '🏅 Who gets the points?' : '⭐ How many points?' }));
      function paint() {
        [].forEach.call(teamRow.children, function (b) { b.classList.toggle('sel', +b.dataset.i === sel); });
        [].forEach.call(fracRow.children, function (b) { b.classList.toggle('sel', +b.dataset.f === frac); });
        var n = sel < 0 ? 0 : Math.round(o.base * frac);
        go.textContent = n > 0 ? '✔  Give ' + n + ' points' + (sel >= 0 && o.anyone ? ' to ' + team2(sel).name : '') : '✔  No points';
      }
      function team2(i) { return o.teams[i]; }
      if (o.anyone) {
        o.teams.forEach(function (t, i) {
          var b = h('button', { type: 'button', class: 'gm-tt-opt', 'data-i': String(i) }, [U.monFace(t.mon, 44), h('b', { text: t.name }), h('small', { text: t.score + ' points' })]);
          b.style.setProperty('--c', t.color);
          b.addEventListener('click', function () { A.play('tap'); sel = i; if (o.partial && frac === 0) frac = 1; paint(); });
          teamRow.appendChild(b);
        });
        var none = h('button', { type: 'button', class: 'gm-tt-opt', 'data-i': '-1' }, [h('span', { class: 'gm-tt-big', text: '🙈' }), h('b', { text: 'Nobody' })]);
        none.addEventListener('click', function () { A.play('tap'); sel = -1; paint(); });
        teamRow.appendChild(none); card.appendChild(teamRow);
      }
      if (o.partial) {
        card.appendChild(h('p', { class: 'gm-tt-hint', text: 'How many of the ' + o.base + ' points?' }));
        FRACS.forEach(function (f) {
          var b = h('button', { type: 'button', class: 'gm-tt-opt small', 'data-f': String(f[0]) }, [h('b', { text: f[1] }), h('small', { text: Math.round(o.base * f[0]) + ' pts' })]);
          b.addEventListener('click', function () { A.play('tap'); frac = f[0]; if (!o.anyone) sel = f[0] > 0 ? o.turn : -1; else if (f[0] > 0 && sel < 0) sel = o.turn; paint(); });
          fracRow.appendChild(b);
        });
        card.appendChild(fracRow);
      }
      go = btn('✔', 'huge green', function () { close(ov); resolve({ team: Math.round(o.base * frac) > 0 ? sel : -1, frac: frac }); });
      card.appendChild(go); ov.appendChild(card);
      if (!o.anyone) sel = o.turn;
      paint();
    });
  };

  /* ---------------- 3. choose questions ---------------- */
  /* picks = array of chosen indexes (empty or missing = all). onSave(newPicks) with [] meaning all. */
  T.chooseQuestions = function (set, picks, onSave) {
    var items = set.items || [], chosen = {};
    (picks && picks.length ? picks : items.map(function (x, i) { return i; })).forEach(function (i) { chosen[i] = 1; });
    var ov = layer(), card = h('div', { class: 'gm-tt-card wide' }), list = h('div', { class: 'gm-tt-list' }), count = h('b', { class: 'gm-tt-count' });
    function paint() { var n = Object.keys(chosen).length; count.textContent = n + ' of ' + items.length + ' questions chosen'; }
    card.appendChild(h('h3', { text: '✔ Choose the questions' }));
    var bar = h('div', { class: 'gm-tt-bar' }, [count, h('span', { class: 'gm-grow' }),
      btn('All', 'sm', function () { chosen = {}; items.forEach(function (x, i) { chosen[i] = 1; }); [].forEach.call(list.querySelectorAll('input'), function (c) { c.checked = true; }); paint(); }),
      btn('None', 'sm ghost', function () { chosen = {}; [].forEach.call(list.querySelectorAll('input'), function (c) { c.checked = false; }); paint(); })]);
    card.appendChild(bar);
    items.forEach(function (it, i) {
      var cb = h('input', { type: 'checkbox' }); cb.checked = !!chosen[i];
      cb.addEventListener('change', function () { if (cb.checked) chosen[i] = 1; else delete chosen[i]; paint(); });
      var row = h('label', { class: 'gm-tt-q' }, [cb, h('span', { text: (it.pic && it.pic !== '🔊' && it.pic !== '🧩' && !/\.(png|webp|jpe?g|gif|svg)/i.test(it.pic) ? it.pic + ' ' : '') + U.qText(it) }), h('small', { text: '→ ' + String(it.a || '') })]);
      list.appendChild(row);
    });
    card.appendChild(list);
    var msg = h('div', { class: 'gm-qmsg soft' });
    card.appendChild(msg);
    card.appendChild(h('div', { class: 'gm-row' }, [btn('Cancel', 'ghost', function () { close(ov); }), btn('✔  Use these', 'huge green', function () {
      var arr = items.map(function (x, i) { return i; }).filter(function (i) { return chosen[i]; });
      if (!arr.length) { msg.textContent = 'Please choose at least one question.'; U.wobble(msg); return; }
      close(ov); onSave(arr.length === items.length ? [] : arr);
    })]));
    ov.appendChild(card); paint();
  };

  /* ---------------- 4. picture tricks ---------------- */
  function zoom(p) {
    var ov = layer('gm-zoom'), big = h('div', { class: 'gm-zoom-big', html: U.pic(p) });
    ov.appendChild(big); ov.appendChild(h('div', { class: 'gm-zoom-x', text: '✕' }));
    ov.addEventListener('click', function () { close(ov); });
  }
  /* picBox = the picture frame of the question card; cfg.pics = 'zoom' or 'blur' */
  T.pic = function (picBox, item, cfg) {
    var mode = cfg && cfg.pics;
    if (!picBox || !item || !item.pic || item.pic === '🔊' || (mode !== 'zoom' && mode !== 'blur')) return;
    if (mode === 'zoom') {
      picBox.classList.add('gm-zoomable'); picBox.title = 'Tap to see it big';
      picBox.appendChild(h('span', { class: 'gm-zoom-hint', text: '🔍' }));
      picBox.addEventListener('click', function () { A.play('tap'); zoom(item.pic); });
    } else {
      picBox.classList.add('gm-blurpic'); picBox.style.setProperty('--blur', '26px');
      var r = h('input', { type: 'range', min: '0', max: '100', value: '0', class: 'gm-blur-range', 'aria-label': 'Slide to reveal the picture' });
      r.addEventListener('input', function () { picBox.style.setProperty('--blur', (26 * (1 - r.value / 100)).toFixed(1) + 'px'); });
      picBox.appendChild(r);
      picBox._reveal = function () { picBox.style.setProperty('--blur', '0px'); r.value = '100'; };
    }
  };

  /* ---------------- the ✏️ button in the header ---------------- */
  function addButton() {
    var homeB = document.getElementById('gm-home'); if (!homeB || document.getElementById('gm-edit')) return;
    var b = h('button', { type: 'button', class: 'gm-btn sm ghost', id: 'gm-edit', title: 'Change scores and team names', text: '✏️ Scores' });
    b.style.display = 'none';
    b.addEventListener('click', function () { A.play('tap'); T.scoreEditor(); });
    homeB.parentNode.insertBefore(b, homeB);
    function sync() { b.style.display = document.body.classList.contains('gm-on-play') ? '' : 'none'; }
    try { new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] }); } catch (e) { /* old browser */ }
    sync();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addButton); else addButton();
})(window);
