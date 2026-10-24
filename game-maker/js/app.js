/* Game Maker app. Two screens before play (like the big game sites):
   1. HOME: choose the questions (chips) and a game (big picture cards).
   2. SET-UP: one card with the game picture on the left and every option on the right (teams, monsters, timer, game options).
   Then the game, then the podium. The look comes from the skin (body.th-classic / body.th-halloween). */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {}, U = GM.u, h = U.h, btn = U.btn, A = GM.audio, KEY = 'eaa_gm_v2', CKEY = 'eaa_gm_sets_v1';
  var SOON = [];
  var TIMERS = [[0, 'Off'], [10, '10 s'], [20, '20 s'], [30, '30 s'], [45, '45 s']];
  /* the three games that have the new polished look come first */
  var ORDER = ['race', 'cannon', 'penalty', 'whack', 'tower', 'balloon', 'baseball', 'jigsaw', 'snakes', 'memory', 'board', 'plinko', 'hunt', 'ttt', 'connect4', 'bowling', 'pass'];
  var HOW = {
    race: ['Every team has a lane and a monster.', 'Answer right: roll a boost and your monster sprints!', 'First over the finish line wins 50 bonus points.'],
    cannon: ['Answer right to get a shot.', 'Pull back from the cannon on the board and let go.', 'Pop balloons: 10, 20, 30 or 50 points. Every shot gets at least 5!'],
    board: ['A team picks a numbered tile.', 'Answer the question on the card.', 'Some tiles hide power-ups: luck can change everything!'],
    plinko: ['Answer the question right.', 'Pick a column and drop your disc.', 'It bounces into a points slot. The big slot is in the middle!'],
    hunt: ['Answer right to get a digging number.', 'Your monster digs a line of that many squares.', 'Find treasure: coins, gems, trophies and crowns!'],
    ttt: ['Two teams.', 'Answer right to put your monster on a square.', 'Three in a row wins the round.'],
    connect4: ['Two teams.', 'Answer right to drop your disc in a column.', 'Four in a row wins the round.'],
    bowling: ['Answer right to roll.', 'Stop the aim bar in the green middle.', 'Knock down the pins. Ten is a STRIKE!'],
    pass: ['A ticking bomb goes round the teams.', 'Answer right to pass it on.', 'When it pops, everybody else wins points.'],
    penalty: ['Answer right to step up to the penalty spot.', 'Swipe the football or tap a corner of the goal to shoot.', 'Beat the moving keeper for +20 or +30! Even a save gives +5!'],
    whack: ['Answer right to start a 15-second Whack-a-Word round.', 'Check the target words at the top of the board.', 'Tap the matching word bubbles as they pop up for +5 each!'],
    tower: ['Answer right to get crane blocks for your team tower.', 'Tap the board or Drop button to land the swinging block.', 'Each stacked block scores +10, and overhang edges get sliced!'],
    balloon: ['Read and listen to the question in the top banner.', 'Watch the colourful answer balloons float up into the sky.', 'Pop the balloon with the right answer for +20 points!'],
    baseball: ['Answer right to step up to Home plate and swing.', 'Stop the moving power bar in the green centre for a big hit.', 'Run the bases with your monsters! Every runner crossing Home scores +20!'],
    jigsaw: ['Two teams race side-by-side on their own 12-piece puzzle.', 'Answer right to earn a puzzle piece and drag it into place.', 'Wrong answer gives the other team a STEAL question worth 2 pieces!'],
    snakes: ['Answer right to roll the big 3D dice (1 to 6).', 'Watch your monster hop along the numbered board squares.', 'Climb up ladders for +10 bonus, slide down snakes, and reach the finish!'],
    memory: ['Take turns flipping two cards on the board.', 'Match each question card with its partner answer card.', 'When you find a match, read the full sentence aloud for +20 and go again!']
  };
  var S = GM.state = { screen: 'home', setId: GM.halloweenOn ? 'halloween' : 'mona-g3', modeId: 'board', theme: GM.halloweenOn ? 'halloween' : 'classic', classId: '', cfg: { teams: 2, timer: 0, pu: {} }, teams: [] };
  var customSets = [], stage;

  function load() {
    try { var d = JSON.parse(localStorage.getItem(KEY) || 'null'); if (d) { ['setId', 'modeId', 'theme', 'classId'].forEach(function (k) { if (d[k]) S[k] = d[k]; }); if (d.cfg) S.cfg = Object.assign(S.cfg, d.cfg); } } catch (e) { /* private window */ }
    try { customSets = JSON.parse(localStorage.getItem(CKEY) || '[]') || []; } catch (e) { customSets = []; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify({ setId: S.setId, modeId: S.modeId, theme: S.theme, classId: S.classId, cfg: S.cfg })); } catch (e) { /* ignore */ } }
  function saveSets() { try { localStorage.setItem(CKEY, JSON.stringify(customSets)); } catch (e) { /* ignore */ } }
  function allSets() { return GM.sets.filter(function (s) { return GM.halloweenOn || s.id !== 'halloween'; }).concat(customSets); }
  function curSet() { return allSets().filter(function (s) { return s.id === S.setId; })[0] || allSets()[0]; }
  function applyTheme(where) { if (!GM.halloweenOn && S.theme === 'halloween') S.theme = 'classic'; document.body.className = 'th-' + S.theme + ' gm-on-' + (where || S.screen); }
  function modeName(m) { return (!GM.halloweenOn && m.nameClassic) || m.name; }
  function modeDesc(m) { return (!GM.halloweenOn && m.descClassic) || m.desc; }
  function cardArt(id, e) { return U.art(GM.halloweenOn && S.theme === 'halloween' && U.hasArt('m_mode_' + id) ? 'm_mode_' + id : 'card_' + id, e, 'gm-cardimg'); }

  /* ---------- HOME ---------- */
  function parseSet(text) {
    var items = [];
    text.split(/\r?\n/).forEach(function (line) {
      line = line.trim(); if (!line || line[0] === '#') return; var p = line.split('|').map(function (x) { return x.trim(); }).filter(function (x) { return x; });
      if (p.length >= 3) items.push({ q: p[0], a: p[1], w: p.slice(2, 5), pic: '' });
    });
    return items;
  }
  function home() {
    var wrap = h('div', { class: 'gm-home' });
    /* hero */
    var hero = h('div', { class: 'gm-hero' }, [h('div', { class: 'gm-hero-txt' }, [h('h1', { class: 'gm-logo', text: 'Game Maker' }), h('p', { text: 'Pick your questions, pick a game, play with your monsters!' })]), U.art('ui_host', '🎤', 'gm-host')]);
    wrap.appendChild(hero);
    /* questions: chips */
    var qrow = h('div', { class: 'gm-qrow' }, [h('span', { class: 'gm-qlab', text: '📚 Questions' })]);
    allSets().forEach(function (s) {
      var c = h('button', { type: 'button', class: 'gm-chip' + (s.id === S.setId ? ' sel' : '') }, [h('span', { text: s.e || '📝' }), h('b', { text: s.title }), h('small', { text: s.items.length })]);
      c.addEventListener('click', function () { A.play('tap'); S.setId = s.id; save(); render(); });
      if (s.custom) { var d = h('span', { class: 'gm-del', title: 'Delete this set', text: '✕' }); d.addEventListener('click', function (e) { e.stopPropagation(); if (d.dataset.sure) { customSets = customSets.filter(function (x) { return x.id !== s.id; }); saveSets(); if (S.setId === s.id) S.setId = GM.sets[0].id; render(); } else { d.dataset.sure = 1; d.textContent = 'Delete?'; } }); c.appendChild(d); }
      qrow.appendChild(c);
    });
    if (GM.rev) wrap.appendChild(h('div', { class: 'gm-qrow gm-revtools' }, [h('span', { class: 'gm-qlab', text: '🔁 Revision' }),
      btn('🧠 Remember 5 (daily)', 'amber sm', function () { GM.rev.daily(); }), btn('📝 Exit ticket', 'amber sm', function () { GM.rev.exitTicket(curSet().items); }),
      h('small', { class: 'gm-hint', text: 'Pick the 🧠 Smart mix questions to bring back what the class missed.' })]));
    var builder;
    var nw = h('button', { type: 'button', class: 'gm-chip gm-chip-new' }, [h('span', { text: '➕' }), h('b', { text: 'New set' })]);
    nw.addEventListener('click', function () { A.play('tap'); builder.classList.toggle('open'); });
    qrow.appendChild(nw); wrap.appendChild(qrow);
    var title = h('input', { class: 'gm-input', placeholder: 'Name of the set (for example: Unit 5 words)', maxlength: '60' }), ta = h('textarea', { class: 'gm-input', rows: '6', placeholder: 'One question on each line:\nShe ____ a new hobby. | began | will | could\nWhat is a baby cat? | kitten | puppy | duck' }), msg = h('div', { class: 'gm-hint', text: 'Write:  question | right answer | wrong answer | wrong answer   (use ____ for the gap).' });
    builder = h('div', { class: 'gm-builder' }, [title, ta, msg, btn('💾 Save this set', 'green', function () {
      var items = parseSet(ta.value); if (!title.value.trim() || items.length < 3) { msg.textContent = 'Please write a name and at least 3 lines like:  question | right | wrong | wrong'; U.wobble(msg); return; }
      var id = 'my-' + Date.now(); customSets.push({ id: id, title: title.value.trim(), e: '📝', custom: true, items: items }); saveSets(); S.setId = id; save(); render();
    })]);
    wrap.appendChild(builder);
    /* games: big picture cards */
    var grid = h('div', { class: 'gm-games' });
    ORDER.forEach(function (id) {
      var m = GM.modes[id]; if (!m) return;
      var c = h('button', { type: 'button', class: 'gm-game' }, [h('div', { class: 'gm-game-pic' }, [cardArt(id, m.e)]), h('div', { class: 'gm-game-cap' }, [h('b', { text: modeName(m) }), h('small', { text: m.teams ? m.teams + ' teams' : '1-8 teams' })])]);
      c.addEventListener('click', function () { A.play('flip'); S.modeId = id; save(); S.screen = 'setup'; render(); });
      grid.appendChild(c);
    });
    SOON.forEach(function (s) { grid.appendChild(h('div', { class: 'gm-game locked' }, [h('div', { class: 'gm-game-pic' }, [U.art(s[2], s[0], 'gm-cardimg')]), h('div', { class: 'gm-game-cap' }, [h('b', { text: s[1] }), h('small', { text: '🔒 Coming soon' })])])); });
    wrap.appendChild(grid);
    return wrap;
  }

  /* ---------- SET-UP ---------- */
  function seg(label, opts, cur, onPick) {
    var row = h('div', { class: 'gm-opt-row' }, [h('div', { class: 'gm-opt-lab', text: label })]), box = h('div', { class: 'gm-seg' });
    opts.forEach(function (o) { var b = h('button', { type: 'button', class: 'gm-segb' + (String(o[0]) === String(cur) ? ' sel' : '') }, [h('b', { text: o[1] }), o[2] ? h('small', { text: o[2] }) : null]); b.addEventListener('click', function () { A.play('tap'); onPick(o[0]); }); box.appendChild(b); });
    row.appendChild(box); return row;
  }
  function buildTeams() {
    var n = S.cfg.teams, p = S.classId ? GM.mon.pupils(S.classId) : [], pool = p.length ? U.shuffle(p) : [];
    if (!S.teams.length || S.teams.length !== n) {
      var defs = GM.mon.defaults(n, S.theme); S.teams = [];
      for (var i = 0; i < n; i++) S.teams.push({ name: GM.teamNames[i], color: GM.teamColors[i], score: 0, mon: pool.length ? pool[i % pool.length] : defs[i], pi: i });
    }
  }
  function setup() {
    var m = GM.modes[S.modeId]; if (m.teams && S.cfg.teams !== m.teams) { S.cfg.teams = m.teams; S.teams = []; }
    buildTeams();
    var card = h('div', { class: 'gm-setup' });
    /* left: the game */
    var left = h('div', { class: 'gm-setup-l' }, [h('div', { class: 'gm-setup-pic' }, [cardArt(S.modeId, m.e)]), h('h2', { text: modeName(m) }), h('ol', { class: 'gm-how' }, (HOW[S.modeId] || [modeDesc(m)]).map(function (x) { return h('li', { text: x }); })),
      h('div', { class: 'gm-setup-set' }, [h('span', { text: '📚 ' }), h('b', { text: curSet().title }), h('small', { text: ' · ' + curSet().items.length + ' questions' })])]);
    /* right: the options */
    var right = h('div', { class: 'gm-setup-r' });
    if (!m.teams) {
      var stepper = h('div', { class: 'gm-stepper' }, [btn('−', 'round', function () { if (S.cfg.teams > 1) { S.cfg.teams--; S.teams = []; save(); render(); } }), h('b', { class: 'gm-stepn', text: String(S.cfg.teams) }), btn('+', 'round', function () { if (S.cfg.teams < 8) { S.cfg.teams++; S.teams = []; save(); render(); } })]);
      right.appendChild(h('div', { class: 'gm-opt-row' }, [h('div', { class: 'gm-opt-lab', text: 'Teams' }), stepper]));
    }
    /* the teams, big */
    var faces = h('div', { class: 'gm-teamfaces' });
    S.teams.forEach(function (t, i) {
      var f = h('div', { class: 'gm-tface' }), name = h('input', { class: 'gm-tname-in', value: t.name, maxlength: '14', title: 'Team name' });
      f.style.setProperty('--c', t.color);
      var mon = h('button', { type: 'button', class: 'gm-tmon', title: 'Tap for another monster' }, [U.monFace(t.mon, 96)]);
      mon.addEventListener('click', function () { A.play('tap'); var p = S.classId ? GM.mon.pupils(S.classId) : null; if (p && p.length) { t.pi = (t.pi + 1) % p.length; t.mon = p[t.pi]; } else { var d = GM.mon.defaults(8, S.theme); t.pi = (t.pi + 1) % 8; t.mon = d[t.pi]; } render(); });
      name.addEventListener('input', function () { t.name = name.value || GM.teamNames[i]; });
      f.appendChild(mon); f.appendChild(name); faces.appendChild(f);
    });
    right.appendChild(faces);
    right.appendChild(h('div', { class: 'gm-hint center', text: 'Tap a monster to change it. Tap a name to rename the team.' }));
    var classes = GM.mon.classes();
    if (classes.length) right.appendChild(seg('Monsters', [['', 'Default']].concat(classes.map(function (c) { return [c.id, c.label]; })), S.classId, function (v) { S.classId = v; S.teams = []; save(); render(); }));
    m.fields.forEach(function (f) { var cur = S.cfg[f.key] != null ? S.cfg[f.key] : f.def; S.cfg[f.key] = cur; right.appendChild(seg(f.label, f.opts, cur, function (v) { S.cfg[f.key] = v; save(); render(); })); });
    right.appendChild(seg('Timer', TIMERS, S.cfg.timer, function (v) { S.cfg.timer = v; save(); render(); }));
    if (GM.rev) {
      right.appendChild(seg('Remember first', [[1, 'On', 'reminder before the game'], [0, 'Off']], S.cfg.rem === 0 ? 0 : 1, function (v) { S.cfg.rem = +v; save(); render(); }));
      right.appendChild(seg('Answer cards', [[0, 'Off'], [1, 'On', 'everybody answers on paper']], S.cfg.cards ? 1 : 0, function (v) { S.cfg.cards = +v; save(); render(); }));
    }
    var themes = Object.keys(GM.themes).filter(function (k) { return GM.halloweenOn || k !== 'halloween'; });
    if (themes.length > 1) right.appendChild(seg('Theme', themes.map(function (k) { return [k, GM.themes[k].e + ' ' + GM.themes[k].name]; }), S.theme, function (v) { S.theme = v; S.teams = []; save(); render(); }));
    if (S.modeId === 'board' && S.cfg.play !== 'quiz') {
      var det = h('details', { class: 'gm-pudet' }, [h('summary', { text: '⚡ Power-ups (' + GM.powerups.filter(function (p) { return (S.cfg.pu || {})[p.id] !== false && (S.cfg.play !== 'jr' || p.jr); }).length + ' on) · tap to change' })]), list = h('div', { class: 'gm-pulist' });
      GM.powerups.forEach(function (p) {
        var on = (S.cfg.pu || {})[p.id] !== false, jrOff = S.cfg.play === 'jr' && !p.jr;
        var b = h('button', { type: 'button', class: 'gm-pu' + (on && !jrOff ? ' on' : '') + (jrOff ? ' off' : '') }, [U.art('pu_' + p.id, p.e, 'gm-puimg'), h('b', { text: p.n }), h('small', { text: p.d })]);
        b.addEventListener('click', function () { if (jrOff) return; A.play('tap'); S.cfg.pu = S.cfg.pu || {}; S.cfg.pu[p.id] = !on; save(); var o = det.open; render(); var d2 = document.querySelector('.gm-pudet'); if (d2 && o) d2.open = true; }); list.appendChild(b);
      });
      det.appendChild(list); right.appendChild(det);
    }
    card.appendChild(left); card.appendChild(right);
    var wrap = h('div', { class: 'gm-setupwrap' }, [card, h('div', { class: 'gm-setup-go' }, [btn('◀ Back', 'ghost', function () { S.screen = 'home'; render(); }), btn('▶  PLAY', 'huge green', startGame)])]);
    return wrap;
  }

  /* ---------- play ---------- */
  var cleanups = [], queue = [], gameId = 0;
  function nextItem() { if (!queue.length) queue = U.shuffle(curSet().items); return queue.pop(); }
  function startGame(skipRemember) {
    if (skipRemember !== true && GM.rev && S.cfg.rem !== 0 && !S.playing && !S.remDone) {
      buildTeams(); document.getElementById('gm-teams').style.display = 'none';
      return GM.rev.remember(curSet().items, { points: 8, check: 3 }, function () { S.remDone = true; startGame(true); });
    }
    cleanups.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } });
    buildTeams(); S.teams.forEach(function (t) { t.score = 0; }); S.playing = true; queue = []; cleanups = []; save(); var myGame = ++gameId;
    S.screen = 'play'; applyTheme('play'); document.body.classList.add('gm-mode-' + S.modeId);
    document.getElementById('gm-teams').style.display = ''; A.play('start'); A.musicStart(S.theme);
    stage.innerHTML = ''; var area = h('div', { class: 'gm-area' }); stage.appendChild(area);
    var m = GM.modes[S.modeId], cfg = Object.assign({}, S.cfg);
    U.teamBar(S.teams, 0);
    var ctx = { root: area, cfg: cfg, nextItem: nextItem, onEnd: function (f) { cleanups.push(f); }, end: function () { if (myGame !== gameId || !S.playing) return; cleanups.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } }); cleanups = []; A.musicStop(); document.getElementById('gm-teams').style.display = 'none'; S.screen = 'end'; applyTheme('end'); U.podium(S.teams, startGame, goHome); } };
    m.start(ctx);
  }
  function goHome() { S.playing = false; gameId++; cleanups.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } }); cleanups = []; A.musicStop(); document.getElementById('gm-teams').style.display = 'none'; S.screen = 'home'; render(); }

  function render() {
    S.playing = false; if (S.screen !== 'play') S.remDone = false; applyTheme(); stage.innerHTML = '';
    stage.appendChild(S.screen === 'setup' ? setup() : home());
    var back = document.getElementById('gm-home'); if (back) back.style.visibility = S.screen === 'home' ? 'hidden' : 'visible';
  }
  function init() {
    stage = document.getElementById('gm-stage'); load(); if (!GM.modes[S.modeId]) S.modeId = 'board';
    /* links from the lessons: ?set=<set id>&game=<game id> opens that question set (and that game's set-up) */
    try {
      var qs = location.search, ms = /[?&]set=([\w-]+)/.exec(qs), mg = /[?&]game=([\w-]+)/.exec(qs);
      if (ms && allSets().some(function (x) { return x.id === ms[1]; })) S.setId = ms[1];
      if (mg && GM.modes[mg[1]]) { S.modeId = mg[1]; S.screen = 'setup'; S.teams = []; }
    } catch (e) { /* ignore */ }
    document.getElementById('gm-teams').style.display = 'none';
    var snd = document.getElementById('gm-snd'); snd.addEventListener('click', function () { A.setMuted(!A.isMuted()); snd.textContent = A.isMuted() ? '🔇' : '🔊'; if (!A.isMuted()) A.play('tap'); });
    var homeB = document.getElementById('gm-home'), armed = false;
    homeB.addEventListener('click', function () { if (S.playing && !armed) { armed = true; homeB.textContent = '⚠ Tap again to leave'; setTimeout(function () { armed = false; homeB.textContent = '☰ Games'; }, 3000); return; } armed = false; homeB.textContent = '☰ Games'; goHome(); });
    document.getElementById('gm-fs').addEventListener('click', function () { try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } catch (e) { /* ignore */ } });
    render();
    try { if (GM.rev && /[?&]daily=1/.test(location.search)) GM.rev.daily(); else if (GM.rev && /[?&]exit=1/.test(location.search)) GM.rev.exitTicket(curSet().items); } catch (e) { /* ignore */ }
  }
  GM.app = { go: function (screen) { S.screen = screen; render(); }, start: startGame, home: goHome, setClass: function (id) { S.classId = id; S.teams = []; save(); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})(window);
