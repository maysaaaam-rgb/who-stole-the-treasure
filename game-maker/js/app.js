/* Game Maker app. Two screens before play (like the big game sites):
   1. HOME: choose the questions (chips with grade/skill filters) and a game (big picture cards with category pills).
   2. SET-UP: one card with the game picture on the left and every option on the right (teams, monsters, timer, game options).
   Then the game, then the podium. The look comes from the skin (body.th-classic / body.th-halloween). */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {}, U = GM.u, h = U.h, btn = U.btn, A = GM.audio, KEY = 'eaa_gm_v2', CKEY = 'eaa_gm_sets_v1';
  var SOON = [];
  var TIMERS = [[0, 'Off'], [10, '10 s'], [20, '20 s'], [30, '30 s'], [45, '45 s']];
  /* the games that have the new polished look come first */
  var ORDER = ['race', 'cannon', 'fling', 'boardgame', 'penalty', 'whack', 'tower', 'balloon', 'baseball', 'jigsaw', 'snakes', 'memory', 'board', 'plinko', 'hunt', 'ttt', 'connect4', 'bowling', 'pass'];
  var GAME_CATS = [
    ['all', '⭐ All Games', null],
    ['action', '🎯 Aim & Action', ['race', 'cannon', 'fling', 'penalty', 'whack', 'tower', 'balloon', 'baseball', 'bowling']],
    ['board', '🎲 Board & Strategy', ['boardgame', 'board', 'snakes', 'hunt', 'plinko', 'pass']],
    ['versus', '⚔️ 2 Teams', ['fling', 'jigsaw', 'ttt', 'connect4']],
    ['word', '🧩 Word & Memory', ['whack', 'balloon', 'memory', 'jigsaw']]
  ];
  var HOW = {
    race: ['Every team has a lane and a monster.', 'Answer right: roll a boost and your monster sprints!', 'First over the finish line wins 50 bonus points.'],
    cannon: ['Answer right to hop into the cannon.', 'Drag back from the cannon to aim against the wind and let go!', 'Pop balloons (10 to 50 pts), hit the Bullseye (+50), or land in the haystack (+15)!'],
    fling: ['Two teams stand in opposite yards across the fence.', 'Answer right, then drag back and release to throw over the fence at the other team!', 'Direct body hits score +25 (or +35 on a 1-bounce trick shot!).'],
    boardgame: ['Answer right to roll the 3D dice and hop around the 24-square loop.', 'Collect Stars (+25), hit Corner Bonuses (+15), and pass START for +15!', 'Land on Chance squares for friendly bonus cards — zero point loss!'],
    board: ['A team picks a numbered tile.', 'Answer the question on the card (or uncover an instant Mystery Card!).', 'Golden 2× tiles, streaks, and the Final Tile can change everything!'],
    plinko: ['Answer the question right.', 'Pick a column and drop your disc.', 'It bounces into a points slot. The big slot is in the middle!'],
    hunt: ['Answer right to get a digging number.', 'Your monster digs a line of that many squares.', 'Find treasure: coins, gems, trophies and crowns!'],
    ttt: ['Two teams.', 'Answer right to put your monster on a square.', 'Three in a row wins the round.'],
    connect4: ['Two teams.', 'Answer right to drop your disc in a column.', 'Four in a row wins the round.'],
    bowling: ['Answer right, then time 3 skill steps: Stand Position, Aim Angle (at the lane arrows), and Power + Hook!', 'Angle into the 1-3 or 1-2 pocket for a STRIKE — hitting the headpin dead-center leaves a SPLIT!', 'Use your second ball to pick up spares without rolling into the gutter!'],
    pass: ['A ticking bomb goes round the teams.', 'Answer right to pass it on.', 'When it pops, everybody else wins points.'],
    penalty: ['Answer right to step up to the 3D penalty spot.', 'Step 1: Lock the figure-8 Aim Target inside a corner (watch out for the posts & crossbar!).', 'Step 2: Hit the green sweet-spot on the Power & Curve meter to bend a Banana Shot past the diving keeper!'],
    whack: ['Answer right to start a 15-second 3D Whack-a-Word wave!', 'Whack ONLY the moles holding the Target Word to build a 3× Combo Streak (and tap 2-hit Boss Moles twice!).', 'Do NOT whack wrong decoy words — they reset your combo and stun your hammer!'],
    tower: ['Answer right to get crane blocks for your team tower.', 'Tap the board or Drop button to land the swinging block.', 'Each stacked block scores +10, and overhang edges get sliced!'],
    balloon: ['Read and listen to the question in the top banner.', 'Watch the colourful answer balloons float up into the sky.', 'Pop the balloon with the right answer for +20 points!'],
    baseball: ['Answer right to step up to Home plate and swing.', 'Stop the moving power bar in the green centre for a big hit.', 'Run the bases with your monsters! Every runner crossing Home scores +20!'],
    jigsaw: ['Two teams race side-by-side on their own 12-piece puzzle.', 'Answer right to earn a puzzle piece and drag it into place.', 'Wrong answer gives the other team a STEAL question worth 2 pieces!'],
    snakes: ['Answer right to roll the big 3D dice (1 to 6).', 'Watch your monster hop along the numbered board squares.', 'Climb up ladders for +10 bonus, slide down snakes, and reach the finish!'],
    memory: ['Take turns flipping two cards on the board.', 'Match each question card with its partner answer card.', 'When you find a match, read the full sentence aloud for +20 and go again!']
  };
  var S = GM.state = {
    screen: 'home',
    setId: GM.halloweenOn ? 'halloween' : 'mona-g3',
    modeId: 'board',
    theme: GM.halloweenOn ? 'halloween' : 'classic',
    classId: '',
    qGrade: 'all',
    qSkill: 'all',
    gameCat: 'all',
    cfg: { teams: 2, timer: 0, pu: {} },
    teams: [],
    groups: {}
  };
  var customSets = [], stage;

  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (d) {
        ['setId', 'modeId', 'theme', 'classId', 'qGrade', 'qSkill', 'gameCat'].forEach(function (k) { if (d[k]) S[k] = d[k]; });
        if (d.cfg) S.cfg = Object.assign(S.cfg, d.cfg);
        if (d.groups && typeof d.groups === 'object') S.groups = d.groups;
      }
    } catch (e) { /* private window */ }
    try { customSets = JSON.parse(localStorage.getItem(CKEY) || '[]') || []; } catch (e) { customSets = []; }
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        setId: S.setId, modeId: S.modeId, theme: S.theme, classId: S.classId,
        qGrade: S.qGrade, qSkill: S.qSkill, gameCat: S.gameCat, cfg: S.cfg, groups: S.groups || {}
      }));
    } catch (e) { /* ignore */ }
  }
  function saveSets() { try { localStorage.setItem(CKEY, JSON.stringify(customSets)); } catch (e) { /* ignore */ } }
  function allSets() { return GM.sets.filter(function (s) { return GM.halloweenOn || s.id !== 'halloween'; }).concat(customSets); }
  function curSet() { return allSets().filter(function (s) { return s.id === S.setId; })[0] || allSets()[0]; }
  function applyTheme(where) { if (!GM.halloweenOn && S.theme === 'halloween') S.theme = 'classic'; document.body.className = 'th-' + S.theme + ' gm-on-' + (where || S.screen); }
  function modeName(m) { return (!GM.halloweenOn && m.nameClassic) || m.name; }
  function modeDesc(m) { return (!GM.halloweenOn && m.descClassic) || m.desc; }
  function cardArt(id, e) { return U.art(GM.halloweenOn && S.theme === 'halloween' && U.hasArt('m_mode_' + id) ? 'm_mode_' + id : 'card_' + id, e, 'gm-cardimg'); }

  function setMatchesFilter(s) {
    if (s.id === S.setId) return true;
    var g = s.grade || (/-g3\b/.test(s.id) ? 3 : /-g4\b/.test(s.id) ? 4 : 0);
    var isMix = /^smart-|^u14-/.test(s.id) || !!s.custom;
    if (S.qGrade === '3' && g !== 3) return false;
    if (S.qGrade === '4' && g !== 4) return false;
    if (S.qGrade === 'mix' && !isMix) return false;

    var sk = s.skill || (/-voc$/.test(s.id) ? 'words' : /-past$|-modals$/.test(s.id) ? 'sentences' : /-read$/.test(s.id) ? 'reading' : '');
    if (S.qSkill === 'all') {
      /* In 'All skills' view, hide the 30 granular per-skill sub-sets so the main Unit 1/2/3/4 sets stay clean */
      if (s.skill) return false;
      return true;
    }
    return sk === S.qSkill;
  }

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
    var activeSet = curSet();
    var hero = h('div', { class: 'gm-hero' }, [
      h('div', { class: 'gm-hero-txt' }, [
        h('h1', { class: 'gm-logo', text: 'Game Maker' }),
        h('p', { text: 'Pick your questions, pick a game, play with your monsters!' })
      ]),
      U.art('ui_host', '🎤', 'gm-host')
    ]);
    wrap.appendChild(hero);

    /* filter bar for question sets (Grade & Skill) */
    var fbar = h('div', { class: 'gm-filter-bar' });
    fbar.appendChild(h('span', { class: 'gm-filter-lab', text: '🎓 Grade' }));
    [['all', 'All Grades'], ['3', 'Grade 3'], ['4', 'Grade 4'], ['mix', '🧠 Smart Mix & Custom']].forEach(function (g) {
      var b = h('button', { type: 'button', class: 'gm-ftab' + (S.qGrade === g[0] ? ' sel' : ''), text: g[1] });
      b.addEventListener('click', function () { A.play('tap'); S.qGrade = g[0]; save(); render(); });
      fbar.appendChild(b);
    });
    fbar.appendChild(h('span', { class: 'gm-filter-sep' }));
    fbar.appendChild(h('span', { class: 'gm-filter-lab', text: '🎯 Skill' }));
    [['all', '📚 Full Units'], ['listen', '🎧 Listening'], ['words', '📝 Words'], ['sounds', '🔤 Sounds'], ['sentences', '💬 Sentences'], ['reading', '📖 Reading']].forEach(function (sk) {
      var b = h('button', { type: 'button', class: 'gm-ftab' + (S.qSkill === sk[0] ? ' sel' : ''), text: sk[1] });
      b.addEventListener('click', function () { A.play('tap'); S.qSkill = sk[0]; save(); render(); });
      fbar.appendChild(b);
    });
    wrap.appendChild(fbar);

    /* questions: chips */
    var qrow = h('div', { class: 'gm-qrow' }, [h('span', { class: 'gm-qlab', text: '📚 Questions' })]);
    allSets().filter(setMatchesFilter).forEach(function (s) {
      var c = h('button', { type: 'button', class: 'gm-chip' + (s.id === S.setId ? ' sel' : '') }, [h('span', { text: s.e || '📝' }), h('b', { text: s.title }), h('small', { text: s.items.length })]);
      c.addEventListener('click', function () { A.play('tap'); S.setId = s.id; save(); render(); });
      if (s.custom) { var d = h('span', { class: 'gm-del', title: 'Delete this set', text: '✕' }); d.addEventListener('click', function (e) { e.stopPropagation(); if (d.dataset.sure) { customSets = customSets.filter(function (x) { return x.id !== s.id; }); saveSets(); if (S.setId === s.id) S.setId = GM.sets[0].id; render(); } else { d.dataset.sure = 1; d.textContent = 'Delete?'; } }); c.appendChild(d); }
      qrow.appendChild(c);
    });
    if (GM.rev) wrap.appendChild(h('div', { class: 'gm-qrow gm-revtools' }, [h('span', { class: 'gm-qlab', text: '🔁 Revision' }),
      btn('🧠 Remember 5 (daily)', 'amber sm', function () { GM.rev.daily(); }), btn('📝 Exit ticket', 'amber sm', function () { GM.rev.exitTicket(activeSet.items); }),
      h('small', { class: 'gm-hint', text: 'Active set: ' + activeSet.title + ' (' + activeSet.items.length + ' questions) · Pick 🧠 Smart mix to replay missed questions.' })]));
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

    /* game category filter bar */
    var gbar = h('div', { class: 'gm-filter-bar' });
    gbar.appendChild(h('span', { class: 'gm-filter-lab', text: '🕹️ Games' }));
    var activeCat = GAME_CATS.filter(function (c) { return c[0] === S.gameCat; })[0] || GAME_CATS[0];
    GAME_CATS.forEach(function (cat) {
      var b = h('button', { type: 'button', class: 'gm-ftab' + (activeCat[0] === cat[0] ? ' sel' : ''), text: cat[1] });
      b.addEventListener('click', function () { A.play('tap'); S.gameCat = cat[0]; save(); render(); });
      gbar.appendChild(b);
    });
    wrap.appendChild(gbar);

    /* games: big picture cards */
    var grid = h('div', { class: 'gm-games' });
    ORDER.forEach(function (id) {
      var m = GM.modes[id]; if (!m) return;
      if (activeCat[2] && activeCat[2].indexOf(id) < 0) return;
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
  /* Which pupil is in which team. Kept for each class (S.groups[classId] = { ids: [[id...], ...], names, colors }),
     so the teams stay the same from game to game until the teacher mixes them again. New pupils join the smallest team. */
  function classTeams(n) {
    var p = S.classId ? GM.mon.pupils(S.classId) : []; if (!p.length) return null;
    var byId = {}, seen = {}, saved = (S.groups || {})[S.classId], ids;
    p.forEach(function (x) { byId[x.id] = x; });
    if (saved && Array.isArray(saved.ids) && saved.ids.length === n) {
      ids = saved.ids.map(function (l) { return (l || []).filter(function (id) { if (!byId[id] || seen[id]) return false; seen[id] = 1; return true; }); });
    } else {
      saved = null; ids = []; for (var i = 0; i < n; i++) ids.push([]);
      U.shuffle(p).forEach(function (x, k) { ids[k % n].push(x.id); seen[x.id] = 1; });
    }
    p.forEach(function (x) { if (seen[x.id]) return; var k = 0; ids.forEach(function (l, i) { if (l.length < ids[k].length) k = i; }); ids[k].push(x.id); });
    S.groups = S.groups || {}; S.groups[S.classId] = { ids: ids, names: saved && saved.names, colors: saved && saved.colors }; save();
    return ids.map(function (l) { return l.map(function (id) { return byId[id]; }); });
  }
  function keepTeamIds() {
    var g = S.groups && S.groups[S.classId]; if (!g) return;
    g.ids = S.teams.map(function (t) { return (t.roster || []).map(function (r) { return r.id; }); }); save();
  }
  function buildTeams() {
    var n = S.cfg.teams;
    if (!S.teams.length || S.teams.length !== n) {
      var defs = GM.mon.defaults(n, S.theme), ct = classTeams(n), g = ct && S.groups[S.classId]; S.teams = [];
      for (var i = 0; i < n; i++) {
        var tRoster = ct ? ct[i] : [];
        S.teams.push({
          name: (g && g.names && g.names[i]) || GM.teamNames[i],
          color: (g && g.colors && g.colors[i]) || GM.teamColors[i],
          score: 0,
          mon: tRoster.length ? tRoster[0] : defs[i],
          pi: i,
          roster: tRoster,
          rosterIdx: 0
        });
      }
    }
  }
  /* "Who is in which team": every pupil's name under its team. Tap a name to move it to the next team. */
  function teamLists(m) {
    var n = S.teams.length, cols = h('div', { class: 'gm-tlists' });
    S.teams.forEach(function (t, i) {
      var col = h('div', { class: 'gm-tlist' }), chips = h('div', { class: 'gm-tchips' });
      col.style.setProperty('--c', t.color);
      col.appendChild(h('div', { class: 'gm-tlist-h' }, [h('b', { text: t.name }), h('small', { text: (t.roster || []).length + ' pupils' })]));
      (t.roster || []).forEach(function (r) {
        var c = h('button', { type: 'button', class: 'gm-tchip', title: 'Move to the next team', text: r.name });
        c.addEventListener('click', function () {
          if (n < 2) return; A.play('tap');
          t.roster = t.roster.filter(function (x) { return x !== r; }); var to = S.teams[(i + 1) % n]; to.roster = (to.roster || []).concat([r]);
          [t, to].forEach(function (x) { x.rosterIdx = 0; x.rIdx = 0; x.mon = x.roster[0] || GM.mon.defaults(n, S.theme)[S.teams.indexOf(x)]; });
          keepTeamIds(); render();
        });
        chips.appendChild(c);
      });
      col.appendChild(chips); cols.appendChild(col);
    });
    var acts = h('div', { class: 'gm-tlist-acts' }, [btn('🔀 Mix the teams', 'sm', function () { if (S.groups) delete S.groups[S.classId]; S.teams = []; save(); render(); })]);
    var gr = GM.mon.groups(S.classId);
    if (gr.length >= 2 && gr.length <= 8 && (!m.teams || m.teams === gr.length)) {
      acts.appendChild(btn('👥 Use our class groups (' + gr.length + ')', 'sm amber', function () {
        S.cfg.teams = gr.length; S.groups = S.groups || {};
        S.groups[S.classId] = { ids: gr.map(function (g) { return g.ids.slice(); }), names: gr.map(function (g) { return g.name; }), colors: gr.map(function (g, k) { return g.color || GM.teamColors[k]; }) };
        S.teams = []; save(); render();
      }));
    }
    return h('div', { class: 'gm-tlist-wrap' }, [h('div', { class: 'gm-tlist-title' }, [h('b', { text: '👥 Who is in which team' }), h('small', { text: 'Tap a name to move it to the next team. The teams stay the same next time.' })]), cols, acts]);
  }
  /* the same list during the game, from the 👥 button in the header; the pupil whose turn it is next is marked */
  function showTeams() {
    var old = document.getElementById('gm-tov'); if (old) { old.remove(); return; }
    var cols = h('div', { class: 'gm-tlists' });
    S.teams.forEach(function (t) {
      var col = h('div', { class: 'gm-tlist' }), chips = h('div', { class: 'gm-tchips' });
      col.style.setProperty('--c', t.color);
      col.appendChild(h('div', { class: 'gm-tlist-h' }, [h('b', { text: t.name }), h('small', { text: S.playing ? t.score + ' points' : (t.roster || []).length + ' pupils' })]));
      (t.roster || []).forEach(function (r) { chips.appendChild(h('span', { class: 'gm-tchip' + (r === t.mon ? ' now' : ''), text: (r === t.mon ? '▶ ' : '') + r.name })); });
      col.appendChild(chips); cols.appendChild(col);
    });
    var ov = h('div', { class: 'gm-tov', id: 'gm-tov' }, [h('div', { class: 'gm-tov-card' }, [h('div', { class: 'gm-tlist-title' }, [h('b', { text: '👥 Who is in which team' }), h('small', { text: '▶ = next to answer' })]), cols, btn('Close', 'green', function () { ov.remove(); })])]);
    ov.addEventListener('click', function (e) { if (e.target === ov) ov.remove(); });
    document.body.appendChild(ov);
  }
  function teamsBtn() {
    var b = document.getElementById('gm-tbtn'); if (!b) return;
    b.style.display = S.classId && S.teams.some(function (t) { return t.roster && t.roster.length; }) && S.screen !== 'home' ? '' : 'none';
  }
  function setup() {
    var m = GM.modes[S.modeId]; if (m.teams && S.cfg.teams !== m.teams) { S.cfg.teams = m.teams; S.teams = []; }
    buildTeams();
    var card = h('div', { class: 'gm-setup' });
    /* left: the game */
    var left = h('div', { class: 'gm-setup-l' }, [h('div', { class: 'gm-setup-pic' }, [cardArt(S.modeId, m.e)]), h('h2', { text: modeName(m) }), h('ol', { class: 'gm-how' }, (HOW[S.modeId] || [modeDesc(m)]).map(function (x) { return h('li', { text: x }); })),
      h('div', { class: 'gm-setup-set' }, [h('span', { text: '📚 ' }), h('b', { text: curSet().title }), h('small', { text: ' · ' + curSet().items.length + ' questions' })])]);
    /* right: the options */
    var right = h('div', { class: 'gm-setup-r' }), classes = GM.mon.classes();
    if (classes.length) right.appendChild(seg('Class', [['', 'No class']].concat(classes.map(function (c) { return [c.id, c.label]; })), S.classId, function (v) { S.classId = v; S.teams = []; save(); render(); }));
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
      mon.addEventListener('click', function () {
        A.play('tap');
        if (t.roster && t.roster.length > 1) {
          t.rosterIdx = ((t.rosterIdx || 0) + 1) % t.roster.length;
          t.mon = t.roster[t.rosterIdx];
        } else {
          var p = S.classId ? GM.mon.pupils(S.classId) : null;
          if (p && p.length) { t.pi = (t.pi + 1) % p.length; t.mon = p[t.pi]; }
          else { var d = GM.mon.defaults(8, S.theme); t.pi = (t.pi + 1) % 8; t.mon = d[t.pi]; }
        }
        render();
      });
      name.addEventListener('input', function () { t.name = name.value || GM.teamNames[i]; var g = S.groups && S.groups[S.classId]; if (g) { g.names = S.teams.map(function (x) { return x.name; }); save(); } });
      f.appendChild(mon); f.appendChild(name);
      if (t.roster && t.roster.length) f.appendChild(h('div', { class: 'gm-roster-pill', text: '👥 ' + t.roster.length + ' pupils' }));
      faces.appendChild(f);
    });
    right.appendChild(faces);
    if (S.classId && S.teams.some(function (t) { return t.roster && t.roster.length; })) right.appendChild(teamLists(m));
    else right.appendChild(h('div', { class: 'gm-hint center', text: classes.length ? 'Choose your class above to put the pupils in teams.' : 'Tap a monster to change it. Tap a name to rename the team.' }));
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
    buildTeams(); S.teams.forEach(function (t) { t.score = 0; }); S.playing = true; queue = []; cleanups = []; GM.sessionMissed = []; GM.cardNo = 0; GM.sessionTally = []; save(); var myGame = ++gameId;
    S.screen = 'play'; applyTheme('play'); document.body.classList.add('gm-mode-' + S.modeId);
    document.getElementById('gm-teams').style.display = ''; A.play('start'); A.musicStart(S.theme);
    stage.innerHTML = ''; var area = h('div', { class: 'gm-area' }); stage.appendChild(area);
    var m = GM.modes[S.modeId], cfg = Object.assign({}, S.cfg);
    U.teamBar(S.teams, 0);
    var ctx = { root: area, cfg: cfg, nextItem: nextItem, onEnd: function (f) { cleanups.push(f); }, end: function () { if (myGame !== gameId || !S.playing) return; cleanups.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } }); cleanups = []; A.musicStop(); document.getElementById('gm-teams').style.display = 'none'; S.screen = 'end'; applyTheme('end'); U.podium(S.teams, startGame, goHome); } };
    m.start(ctx); teamsBtn();
  }
  function goHome() { S.playing = false; gameId++; cleanups.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } }); cleanups = []; A.musicStop(); document.getElementById('gm-teams').style.display = 'none'; S.screen = 'home'; render(); }

  function render() {
    S.playing = false; if (S.screen !== 'play') S.remDone = false; applyTheme(); stage.innerHTML = '';
    stage.appendChild(S.screen === 'setup' ? setup() : home());
    var back = document.getElementById('gm-home'); if (back) back.style.visibility = S.screen === 'home' ? 'hidden' : 'visible';
    var ov = document.getElementById('gm-tov'); if (ov) ov.remove(); teamsBtn();
  }
  function init() {
    stage = document.getElementById('gm-stage'); load(); if (!GM.modes[S.modeId]) S.modeId = 'board';
    /* links from the platform & lessons: ?class=<classId>&set=<setId>&game=<gameId> */
    try {
      var qs = location.search, mc = /[?&]class=([\w-]+)/.exec(qs), ms = /[?&]set=([\w-]+)/.exec(qs), mg = /[?&]game=([\w-]+)/.exec(qs);
      if (mc && mc[1]) {
        S.classId = mc[1]; S.teams = [];
        if (!ms) {
          var isG4 = /4/.test(mc[1]);
          S.qGrade = isG4 ? '4' : '3';
          if (allSets().some(function (x) { return x.id === (isG4 ? 'u14-g4' : 'u14-g3'); })) S.setId = isG4 ? 'u14-g4' : 'u14-g3';
        }
      }
      if (ms && allSets().some(function (x) { return x.id === ms[1]; })) S.setId = ms[1];
      if (mg && GM.modes[mg[1]]) { S.modeId = mg[1]; S.screen = 'setup'; S.teams = []; }
      save();
    } catch (e) { /* ignore */ }
    document.getElementById('gm-teams').style.display = 'none';
    var snd = document.getElementById('gm-snd'); snd.addEventListener('click', function () { A.setMuted(!A.isMuted()); snd.textContent = A.isMuted() ? '🔇' : '🔊'; if (!A.isMuted()) A.play('tap'); });
    var homeB = document.getElementById('gm-home'), armed = false;
    homeB.addEventListener('click', function () { if (S.playing && !armed) { armed = true; homeB.textContent = '⚠ Tap again to leave'; setTimeout(function () { armed = false; homeB.textContent = '☰ Games'; }, 3000); return; } armed = false; homeB.textContent = '☰ Games'; goHome(); });
    var tb = h('button', { type: 'button', class: 'gm-btn sm ghost', id: 'gm-tbtn', title: 'Who is in which team', text: '👥 Teams' });
    tb.addEventListener('click', function () { A.play('tap'); showTeams(); }); homeB.parentNode.insertBefore(tb, homeB);
    document.getElementById('gm-fs').addEventListener('click', function () { try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } catch (e) { /* ignore */ } });
    render();
    try { if (GM.rev && /[?&]daily=1/.test(location.search)) GM.rev.daily(); else if (GM.rev && /[?&]exit=1/.test(location.search)) GM.rev.exitTicket(curSet().items); } catch (e) { /* ignore */ }
  }
  GM.app = { go: function (screen) { S.screen = screen; render(); }, start: startGame, home: goHome, setClass: function (id) { S.classId = id; S.teams = []; save(); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})(window);
