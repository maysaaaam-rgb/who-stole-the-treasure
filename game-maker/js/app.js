/* Game Maker app: the four-step set-up (questions, game, set-up, teams), then play and the podium. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {}, U = GM.u, h = U.h, btn = U.btn, A = GM.audio, KEY = 'eaa_gm_v1', CKEY = 'eaa_gm_sets_v1';
  var SOON = [['⚾', 'Baseball'], ['🧩', 'Jigsaw Race'], ['🎲', 'Snakes and Ladders'], ['🧠', 'Memory']];
  var TIMERS = [[0, 'Off'], [10, '10 s'], [20, '20 s'], [30, '30 s'], [45, '45 s']];
  var S = GM.state = { step: 1, setId: 'halloween', modeId: 'board', theme: 'halloween', classId: '', cfg: { teams: 2, timer: 0, pu: {} }, teams: [], theme_: 'halloween' };
  var customSets = [], stage, headSteps;

  function load() {
    try { var d = JSON.parse(localStorage.getItem(KEY) || 'null'); if (d) { ['setId', 'modeId', 'theme', 'classId'].forEach(function (k) { if (d[k]) S[k] = d[k]; }); if (d.cfg) S.cfg = Object.assign(S.cfg, d.cfg); } } catch (e) { /* private window */ }
    try { customSets = JSON.parse(localStorage.getItem(CKEY) || '[]') || []; } catch (e) { customSets = []; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify({ setId: S.setId, modeId: S.modeId, theme: S.theme, classId: S.classId, cfg: S.cfg })); } catch (e) { /* ignore */ } }
  function saveSets() { try { localStorage.setItem(CKEY, JSON.stringify(customSets)); } catch (e) { /* ignore */ } }
  function allSets() { return GM.sets.concat(customSets); }
  function curSet() { return allSets().filter(function (s) { return s.id === S.setId; })[0] || GM.sets[0]; }
  function applyTheme() { document.body.className = 'th-' + S.theme; }

  /* ---------- header ---------- */
  function drawHead() {
    var nav = document.getElementById('gm-steps'); nav.innerHTML = '';
    ['Questions', 'Game', 'Set-up', 'Teams'].forEach(function (n, i) { nav.appendChild(h('button', { type: 'button', class: 'gm-step' + (S.step === i + 1 ? ' on' : '') + (S.step > i + 1 ? ' done' : ''), text: (i + 1) + ' ' + n, onclick: function () { if (S.playing) return; A.play('tap'); S.step = i + 1; render(); } })); });
  }

  /* ---------- step 1: questions ---------- */
  function parseSet(text) {
    var items = [];
    text.split(/\r?\n/).forEach(function (line) {
      line = line.trim(); if (!line || line[0] === '#') return; var p = line.split('|').map(function (x) { return x.trim(); }).filter(function (x) { return x; });
      if (p.length >= 3) items.push({ q: p[0], a: p[1], w: p.slice(2, 5), pic: '' });
    });
    return items;
  }
  function stepQuestions() {
    var wrap = h('div', { class: 'gm-panel' }, [h('h2', { text: '1 · Choose your questions' })]), grid = h('div', { class: 'gm-cards' });
    allSets().forEach(function (s) {
      var c = h('button', { type: 'button', class: 'gm-card2 gm-glass' + (s.id === S.setId ? ' sel' : '') }, [h('span', { class: 'gm-big', text: s.e || '📝' }), h('b', { text: s.title }), h('small', { text: s.items.length + ' questions' })]);
      c.addEventListener('click', function () { A.play('tap'); S.setId = s.id; save(); render(); });
      if (s.custom) { var d = h('span', { class: 'gm-del', title: 'Delete this set', text: '🗑️' }); d.addEventListener('click', function (e) { e.stopPropagation(); if (d.dataset.sure) { customSets = customSets.filter(function (x) { return x.id !== s.id; }); saveSets(); if (S.setId === s.id) S.setId = GM.sets[0].id; render(); } else { d.dataset.sure = 1; d.textContent = 'Tap again to delete'; } }); c.appendChild(d); }
      grid.appendChild(c);
    });
    var nw = h('button', { type: 'button', class: 'gm-card2 gm-glass gm-new' }, [h('span', { class: 'gm-big', text: '➕' }), h('b', { text: 'New set' }), h('small', { text: 'Type your own questions' })]);
    nw.addEventListener('click', function () { A.play('tap'); builder.style.display = builder.style.display === 'none' ? '' : 'none'; }); grid.appendChild(nw);
    var title = h('input', { class: 'gm-input', placeholder: 'Name of the set (for example: Unit 5 words)', maxlength: '60' }), ta = h('textarea', { class: 'gm-input', rows: '7', placeholder: 'One question on each line:\nShe ____ a new hobby. | began | will | could\nWhat is a baby cat? | kitten | puppy | duck' }), msg = h('div', { class: 'gm-hint', text: 'Format:  question | right answer | wrong answer | wrong answer  (use ____ for the gap).' });
    var builder = h('div', { class: 'gm-builder gm-glass', style: 'display:none' }, [title, ta, msg, btn('💾 Save this set', 'green', function () {
      var items = parseSet(ta.value); if (!title.value.trim() || items.length < 3) { msg.textContent = 'Please write a name and at least 3 lines like:  question | right | wrong | wrong'; U.wobble(msg); return; }
      var id = 'my-' + Date.now(); customSets.push({ id: id, title: title.value.trim(), e: '📝', custom: true, items: items }); saveSets(); S.setId = id; save(); render();
    })]);
    wrap.appendChild(grid); wrap.appendChild(builder); wrap.appendChild(h('div', { class: 'gm-row' }, [btn('Next: choose the game ▶', 'big green', function () { S.step = 2; render(); })]));
    return wrap;
  }

  /* ---------- step 2: game ---------- */
  function stepGame() {
    var wrap = h('div', { class: 'gm-panel' }, [h('h2', { text: '2 · Choose the game' })]), grid = h('div', { class: 'gm-cards' });
    Object.keys(GM.modes).forEach(function (id) {
      var m = GM.modes[id], c = h('button', { type: 'button', class: 'gm-card2 gm-glass gm-mode' + (id === S.modeId ? ' sel' : '') }, [h('span', { class: 'gm-bigart' }, [U.art('m_mode_' + id, m.e)]), h('b', { text: m.name }), h('small', { text: m.desc })]);
      c.addEventListener('click', function () { A.play('tap'); S.modeId = id; save(); render(); }); grid.appendChild(c);
    });
    SOON.forEach(function (s) { grid.appendChild(h('div', { class: 'gm-card2 gm-glass gm-locked' }, [h('span', { class: 'gm-big', text: s[0] }), h('b', { text: s[1] }), h('span', { class: 'gm-lock', text: '🔒 Coming soon' })])); });
    wrap.appendChild(grid); wrap.appendChild(h('div', { class: 'gm-row' }, [btn('◀ Back', 'ghost', function () { S.step = 1; render(); }), btn('Next: set-up ▶', 'big green', function () { S.step = 3; render(); })]));
    return wrap;
  }

  /* ---------- step 3: set-up ---------- */
  function choiceRow(label, opts, cur, onPick, extra) {
    var row = h('div', { class: 'gm-field' }, [h('div', { class: 'gm-flabel', text: label })]), box = h('div', { class: 'gm-choices' });
    opts.forEach(function (o) { var b = h('button', { type: 'button', class: 'gm-choice gm-btn' + (String(o[0]) === String(cur) ? ' sel' : '') }, [h('b', { text: o[1] }), o[2] ? h('small', { text: o[2] }) : null]); b.addEventListener('click', function () { A.play('tap'); onPick(o[0]); }); box.appendChild(b); });
    row.appendChild(box); if (extra) row.appendChild(extra); return row;
  }
  function stepSetup() {
    var m = GM.modes[S.modeId], wrap = h('div', { class: 'gm-panel' }, [h('h2', { text: '3 · Set up the game: ' + m.name })]);
    wrap.appendChild(choiceRow('Theme', Object.keys(GM.themes).map(function (k) { return [k, GM.themes[k].e + ' ' + GM.themes[k].name]; }), S.theme, function (v) { S.theme = v; S.teams = []; applyTheme(); save(); render(); }));
    if (m.teams) { if (S.cfg.teams !== m.teams) { S.cfg.teams = m.teams; S.teams = []; } wrap.appendChild(h('div', { class: 'gm-field' }, [h('div', { class: 'gm-flabel', text: 'Teams' }), h('div', { class: 'gm-hint', text: m.name + ' is played by ' + m.teams + ' teams.' })])); }
    else wrap.appendChild(choiceRow('Number of teams', [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) { return [n, String(n)]; }), S.cfg.teams, function (v) { S.cfg.teams = v; S.teams = []; save(); render(); }));
    m.fields.forEach(function (f) {
      var cur = S.cfg[f.key] != null ? S.cfg[f.key] : f.def; S.cfg[f.key] = cur;
      wrap.appendChild(choiceRow(f.label, f.opts, cur, function (v) { S.cfg[f.key] = v; save(); render(); }));
    });
    wrap.appendChild(choiceRow('Timer for each question', TIMERS, S.cfg.timer, function (v) { S.cfg.timer = v; save(); render(); }));
    if (S.modeId === 'board' && S.cfg.play !== 'quiz') {
      var list = h('div', { class: 'gm-pulist' });
      GM.powerups.forEach(function (p) {
        var on = (S.cfg.pu || {})[p.id] !== false, jrOff = S.cfg.play === 'jr' && !p.jr;
        var b = h('button', { type: 'button', class: 'gm-pu gm-btn' + (on && !jrOff ? ' on' : '') + (jrOff ? ' off' : '') }, [h('span', { text: p.e }), h('b', { text: p.n }), h('small', { text: p.d })]);
        b.addEventListener('click', function () { if (jrOff) return; A.play('tap'); S.cfg.pu = S.cfg.pu || {}; S.cfg.pu[p.id] = !on; save(); render(); }); list.appendChild(b);
      });
      wrap.appendChild(h('div', { class: 'gm-field' }, [h('div', { class: 'gm-flabel', text: 'Power-ups (tap to turn one on or off)' }), list]));
    }
    wrap.appendChild(h('div', { class: 'gm-row' }, [btn('◀ Back', 'ghost', function () { S.step = 2; render(); }), btn('Next: teams ▶', 'big green', function () { S.step = 4; render(); })]));
    return wrap;
  }

  /* ---------- step 4: teams ---------- */
  var pool = [];
  function buildPool() {
    var n = S.cfg.teams, p = S.classId ? GM.mon.pupils(S.classId) : []; pool = p.length ? U.shuffle(p) : [];
    if (!S.teams.length || S.teams.length !== n) {
      var defs = GM.mon.defaults(n, S.theme); S.teams = [];
      for (var i = 0; i < n; i++) S.teams.push({ name: GM.teamNames[i], color: GM.teamColors[i], score: 0, mon: pool.length ? pool[i % pool.length] : defs[i], pi: i });
    }
  }
  function stepTeams() {
    buildPool();
    var wrap = h('div', { class: 'gm-panel' }, [h('h2', { text: '4 · Your teams and monsters' })]);
    var classes = GM.mon.classes(), cls = [['', 'Default monsters']].concat(classes.map(function (c) { return [c.id, 'My ' + c.label + ' monsters']; }));
    wrap.appendChild(choiceRow('Whose monsters play?', cls, S.classId, function (v) { S.classId = v; S.teams = []; save(); render(); }));
    var list = h('div', { class: 'gm-teamlist' });
    S.teams.forEach(function (t, i) {
      var card = h('div', { class: 'gm-teamcard gm-glass' }, [U.monFace(t.mon, 92)]), name = h('input', { class: 'gm-input', value: t.name, maxlength: '16' });
      name.addEventListener('input', function () { t.name = name.value || GM.teamNames[i]; });
      card.style.setProperty('--c', t.color); card.appendChild(name);
      card.appendChild(btn('🔄 Other monster', 'sm', function () {
        var p = S.classId ? GM.mon.pupils(S.classId) : null;
        if (p && p.length) { t.pi = (t.pi + 1) % p.length; t.mon = p[t.pi]; } else { var d = GM.mon.defaults(8, S.theme); t.pi = (t.pi + 1) % 8; t.mon = d[t.pi]; }
        render();
      }));
      list.appendChild(card);
    });
    wrap.appendChild(list);
    wrap.appendChild(h('div', { class: 'gm-row' }, [btn('◀ Back', 'ghost', function () { S.step = 3; render(); }), btn('🎲 Random monsters', 'sm', function () { S.teams = []; render(); }), btn('▶ START THE GAME', 'big green', startGame)]));
    return wrap;
  }

  /* ---------- play ---------- */
  var cleanups = [], queue = [];
  function nextItem() { if (!queue.length) queue = U.shuffle(curSet().items); return queue.pop(); }
  function startGame() {
    buildPool(); S.teams.forEach(function (t) { t.score = 0; }); S.playing = true; queue = []; cleanups = []; save();
    document.getElementById('gm-head').classList.add('play'); document.getElementById('gm-teams').style.display = ''; A.play('start'); A.musicStart(S.theme);
    stage.innerHTML = ''; var area = h('div', { class: 'gm-area' }); stage.appendChild(area);
    var m = GM.modes[S.modeId], cfg = Object.assign({}, S.cfg);
    U.teamBar(S.teams, 0);
    var ctx = { root: area, cfg: cfg, nextItem: nextItem, onEnd: function (f) { cleanups.push(f); }, end: function () { cleanups.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } }); cleanups = []; A.musicStop(); U.teamBar(S.teams, -1); U.podium(S.teams, startGame, goHome); } };
    m.start(ctx);
  }
  function goHome() { S.playing = false; cleanups.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } }); cleanups = []; A.musicStop(); document.getElementById('gm-head').classList.remove('play'); document.getElementById('gm-teams').style.display = 'none'; S.step = 1; render(); }

  function render() {
    S.playing = false; applyTheme(); drawHead(); stage.innerHTML = ''; stage.appendChild(S.step === 1 ? stepQuestions() : S.step === 2 ? stepGame() : S.step === 3 ? stepSetup() : stepTeams());
  }
  function init() {
    stage = document.getElementById('gm-stage'); load(); if (!GM.modes[S.modeId]) S.modeId = 'board';
    document.getElementById('gm-teams').style.display = 'none';
    var snd = document.getElementById('gm-snd'); snd.addEventListener('click', function () { A.setMuted(!A.isMuted()); snd.textContent = A.isMuted() ? '🔇' : '🔊'; if (!A.isMuted()) A.play('tap'); });
    var home = document.getElementById('gm-home'), armed = false;
    home.addEventListener('click', function () { if (S.playing && !armed) { armed = true; home.textContent = '⚠ Tap again to leave'; setTimeout(function () { armed = false; home.textContent = '☰ Menu'; }, 3000); return; } armed = false; home.textContent = '☰ Menu'; goHome(); });
    document.getElementById('gm-fs').addEventListener('click', function () { try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } catch (e) { /* ignore */ } });
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})(window);
