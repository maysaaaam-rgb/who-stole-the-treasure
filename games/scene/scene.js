/* Games Collection — Tap the Scene Family (3 Games)
   shadows (Peekaboo Shadows) | prep (Preposition Room) | looktap (Look & Tap Scene) */
(function (root) {
  'use strict';

  var Kit = root.Kit;
  var el = Kit.el;
  var doc = root.document;
  var app = doc.getElementById('app');

  var GAMES = {
    shadows: {
      id: 'shadows', name: 'Peekaboo Shadows', icon: '🐸',
      sub: 'Listen · Tap the Matching Silhouette · Watch It Colour In!',
      poster: 'posters/shadows.webp',
      bg: 'assets/games/reveal/bg_sunny_courtyard.webp',
      steps: ['Hear or read the mystery word clue', 'Tap the matching dark shadow silhouette', 'Watch it pop into full 3D colour (+10 ⭐)!']
    },
    prep: {
      id: 'prep', name: 'Preposition Room', icon: '🐱',
      sub: 'Read & Listen · Move Kitty ON / IN / UNDER / NEXT TO / BEHIND!',
      poster: 'posters/prep.webp',
      bg: 'assets/games/scene/bg_cozy_room.webp',
      steps: ['Listen to where Kitty wants to go', 'Tap the matching spot in the cozy room', 'Watch Kitty jump ON / IN / UNDER / NEXT TO it!']
    },
    looktap: {
      id: 'looktap', name: 'Look & Tap Scene', icon: '🔎',
      sub: 'Illustrated Room · Find & Tap the Spoken Word!',
      poster: 'posters/looktap.webp',
      bg: 'assets/games/scene/bg_cozy_room.webp',
      steps: ['Scan the objects placed around the cozy room', 'Hear or read the target word / clue', 'Tap the matching picture before time runs out!']
    }
  };

  var qMatch = /[?&]game=([^&]+)/.exec(root.location.search);
  var GAME_ID = (qMatch && GAMES[qMatch[1]]) ? qMatch[1] : 'shadows';
  var META = GAMES[GAME_ID];

  var PREP_SPOTS = [
    { id: 'on_sofa',    prep: 'ON',      place: 'the sofa',    sent: 'Put Kitty ON the sofa!',      x: 20, y: 58 },
    { id: 'under_bed',  prep: 'UNDER',   place: 'the bed',     sent: 'Put Kitty UNDER the bed!',    x: 50, y: 74 },
    { id: 'on_bed',     prep: 'ON',      place: 'the bed',     sent: 'Put Kitty ON the bed!',       x: 50, y: 46 },
    { id: 'in_box',     prep: 'IN',      place: 'the toy box', sent: 'Put Kitty IN the toy box!',   x: 28, y: 80 },
    { id: 'next_table', prep: 'NEXT TO', place: 'the table',   sent: 'Put Kitty NEXT TO the table!',x: 80, y: 66 },
    { id: 'on_rug',     prep: 'ON',      place: 'the rug',     sent: 'Put Kitty ON the rug!',       x: 68, y: 82 }
  ];

  var SCENE_SPOTS = [
    { x: 18, y: 40 }, { x: 38, y: 34 }, { x: 60, y: 36 }, { x: 82, y: 42 },
    { x: 22, y: 72 }, { x: 46, y: 68 }, { x: 68, y: 70 }, { x: 84, y: 74 }
  ];

  var S = {
    phase: 'setup',
    packId: Kit.pref('sc_pack') || '',
    pack: null,
    teams: +(Kit.pref('teams') || 2),
    classId: Kit.pref('classId') || '',
    rounds: +(Kit.pref('sc_rounds') || 8),
    teamsData: [],
    turn: 0,
    round: 0,
    classStars: 0,
    busy: false
  };

  var ui = {};
  var timers = [];
  function later(fn, ms) { var id = setTimeout(fn, ms); timers.push(id); return id; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  Kit.topbar({
    home: '../index.html',
    homeLabel: 'Games',
    title: META.icon + ' ' + META.name,
    onEdit: function () {
      Kit.studio({ tab: 'pictures' }, function () { if (S.phase === 'setup') setup(); });
    },
    editLabel: '✎ Edit pictures'
  });

  function seg(opts, val, onPick) {
    var box = el('div', { class: 'seg' });
    opts.forEach(function (o) {
      box.appendChild(el('button', {
        type: 'button',
        class: 'chip' + (o[0] === val ? ' on' : ''),
        text: o[1],
        onclick: function () { Kit.sound('tap'); onPick(o[0]); }
      }));
    });
    return box;
  }

  /* ======================= SETUP ======================= */
  function setup() {
    clearTimers();
    S.phase = 'setup';
    app.className = 'app';
    app.innerHTML = '';

    Kit.sets.all().then(function (sets) {
      var cur = sets.filter(function (s) { return s.id === S.packId; })[0] || sets[0];
      S.packId = cur.id;
      S.pack = cur;

      var hero = el('section', { class: 'hero' }, [
        el('div', { class: 'hero-poster' }, [
          el('img', {
            src: '../' + META.poster + '?v=1',
            alt: META.name,
            onerror: function (e) { e.target.src = Kit.src('assets/games/mascots/kitty.webp'); }
          })
        ]),
        el('div', null, [
          el('h1', { text: META.icon + ' ' + META.name }),
          el('p', { text: META.sub }),
          el('div', { class: 'steps' }, META.steps.map(function (st, idx) {
            return el('span', { class: 'step' }, [el('b', { text: String(idx + 1) }), st]);
          }))
        ])
      ]);

      var left = el('section', { class: 'panel' }, [
        el('h2', { text: GAME_ID === 'prep' ? '🐱 Prepositions Practice' : '🖼️ Picture Pack' })
      ]);

      if (GAME_ID === 'prep') {
        left.appendChild(el('p', { style: { fontWeight: '700', color: 'var(--plum-soft)' }, text: 'Built-in cozy bedroom prepositions: ON · IN · UNDER · NEXT TO (the sofa, the bed, the toy box, the table, the rug).' }));
      } else {
        var pGrid = el('div', { class: 'packs' });
        sets.forEach(function (s) {
          pGrid.appendChild(el('button', {
            type: 'button',
            class: 'pack' + (s.id === cur.id ? ' on' : ''),
            onclick: function () { Kit.sound('tap'); S.packId = s.id; Kit.pref('sc_pack', s.id); setup(); }
          }, [
            el('b', { text: (s.icon || '🖼️') + ' ' + s.name }),
            el('small', { text: ((s.cards || s.items || []).length) + ' pictures' })
          ]));
        });
        left.appendChild(pGrid);
      }

      left.appendChild(el('div', { class: 'label', text: '🔄 Rounds' }));
      left.appendChild(seg([[6, '6 rounds'], [8, '8 rounds'], [12, '12 rounds']], S.rounds, function (v) {
        S.rounds = +v; Kit.pref('sc_rounds', +v); setup();
      }));

      var right = el('section', { class: 'panel' }, [el('h2', { text: '🐾 Teams & Class' })]);
      right.appendChild(seg([[0, '🌟 Whole class'], [2, '2 teams'], [3, '3 teams'], [4, '4 teams']], S.teams, function (v) {
        S.teams = +v; Kit.pref('teams', +v); setup();
      }));
      var clsNode = Kit.classroom && Kit.classroom.setupPanel ? Kit.classroom.setupPanel(S, setup) : null;
      if (clsNode) right.appendChild(clsNode);

      var go = el('section', { class: 'go panel' }, [
        el('div', null, [
          el('b', { text: '⏱ About ' + Math.max(5, Math.round(S.rounds * 0.8)) + ' minutes' }),
          el('small', { class: 'muted', text: S.rounds + ' rounds · ' + (S.teams ? S.teams + ' teams' : 'Whole class') })
        ]),
        el('button', {
          type: 'button', class: 'btn pink lg', text: '▶ Play ' + META.name + '!',
          onclick: function () { Kit.sound('reveal'); start(cur); }
        })
      ]);

      app.appendChild(hero);
      app.appendChild(el('div', { class: 'setup-cols' }, [left, el('div', { class: 'setup-side' }, [right, go])]));
      Kit.keys({ enter: function () { Kit.sound('reveal'); start(cur); } });
    });
  }

  /* ======================= PLAY SHELL ======================= */
  function fit() {
    if (!ui.box) return;
    var r = ui.box.getBoundingClientRect(), ar = 16 / 10;
    var w = r.width, h = w / ar;
    if (h > r.height) { h = r.height; w = h * ar; }
    ui.stage.style.width = Math.floor(w) + 'px';
    ui.stage.style.height = Math.floor(h) + 'px';
  }
  root.addEventListener('resize', function () { if (S.phase !== 'setup') fit(); });

  function start(pack) {
    clearTimers();
    S.pack = pack;
    S.phase = 'play';
    S.round = 0;
    S.turn = 0;
    S.classStars = 0;
    S.busy = false;
    S.teamsData = S.teams > 0
      ? (Kit.classroom && Kit.classroom.makeTeams ? Kit.classroom.makeTeams(S.teams, S.classId) : Kit.makeTeams(S.teams))
      : [];

    app.innerHTML = '';
    app.className = 'app play-screen' + (Kit.preview ? ' preview' : '');

    ui.head = el('div', { class: 'play-head' });
    ui.count = el('div', { class: 'count-pill' });
    ui.teams = el('div', { class: 'team-bar' });
    ui.worth = el('div', { class: 'worth-pill', html: '<span>Goal</span><b>' + META.icon + '</b>' });
    ui.head.appendChild(ui.count); ui.head.appendChild(ui.teams); ui.head.appendChild(ui.worth);

    ui.box = el('div', { class: 'stage-box' });
    ui.stage = el('div', { class: 'stage' });
    ui.bg = el('img', {
      class: 'sc-bg',
      src: Kit.src(META.bg),
      alt: '',
      onerror: function (e) { e.target.src = Kit.src('assets/games/reveal/bg_sunny_courtyard.webp'); }
    });
    ui.prompt = el('div', { class: 'sc-prompt' });
    ui.layer = el('div', { style: { position: 'absolute', inset: 0, zIndex: 5 } });

    ui.stage.appendChild(ui.bg);
    ui.stage.appendChild(ui.prompt);
    ui.stage.appendChild(ui.layer);
    ui.box.appendChild(ui.stage);

    ui.ctrl = el('div', { class: 'controls' });
    ui.caption = el('div', { class: 'caption hidden' });

    app.appendChild(ui.head); app.appendChild(ui.box); app.appendChild(ui.ctrl); app.appendChild(ui.caption);
    fit();
    drawTeams();

    if (GAME_ID === 'shadows') runShadows();
    else if (GAME_ID === 'prep') runPrepositions();
    else runLookTap();

    Kit.keys({
      space: function () { if (ui.speakCur) ui.speakCur(); },
      escape: function () {
        if (Kit.preview || S.phase === 'setup') return;
        Kit.modal({
          title: 'Leave ' + META.name + '?',
          body: '<p>Current progress will reset.</p>',
          buttons: [{ label: 'Keep playing', cls: 'soft', value: false }, { label: 'Setup', cls: 'peach', value: true }]
        }).then(function (ok) { if (ok) { clearTimers(); setup(); } });
      }
    });
  }

  function drawTeams() {
    if (S.teamsData.length) Kit.renderTeams(ui.teams, S.teamsData, { turn: S.turn });
    else {
      ui.teams.innerHTML = '';
      ui.teams.appendChild(el('div', { class: 'class-stars', text: '⭐ ' + S.classStars + ' class stars' }));
    }
    ui.count.innerHTML = '<span>Round</span><b>' + Math.min(S.round + 1, S.rounds) + ' / ' + S.rounds + '</b>';
  }

  function awardTurn(pts) {
    if (S.teamsData.length) {
      S.teamsData[S.turn].score += pts;
      Kit.renderTeams(ui.teams, S.teamsData, { turn: S.turn });
    } else {
      S.classStars += pts;
      drawTeams();
    }
    Kit.sound('correct');
    var c = Kit.centerOf(ui.stage);
    Kit.confetti(c.x, c.y, Kit.preview ? 22 : 48);
  }

  function advanceRound(renderNext) {
    S.round++;
    if (S.round >= S.rounds) return showFinale();
    if (S.teamsData.length) S.turn = (S.turn + 1) % S.teamsData.length;
    drawTeams();
    renderNext();
  }

  function caption(i, text) {
    if (!Kit.preview) return;
    ui.caption.classList.remove('hidden');
    ui.caption.innerHTML = '<b>' + i + '</b> ' + Kit.esc(text);
  }

  /* ----------------------- 1. PEEKABOO SHADOWS ----------------------- */
  function runShadows() {
    var srcCards = (S.pack && (S.pack.cards || S.pack.items)) || [];
    var pool = Kit.shuffle(srcCards.slice()).slice(0, 8);
    var targets = Kit.shuffle(pool.slice());
    var tIdx = 0;

    function drawRound() {
      if (S.round >= S.rounds || tIdx >= targets.length) {
        if (S.round >= S.rounds) return showFinale();
        targets = Kit.shuffle(pool.slice()); tIdx = 0;
      }
      S.busy = false;
      var target = targets[tIdx];
      var wLabel = target.w || target.word || target.label || '';
      ui.speakCur = function () { Kit.say(target.say || target.cl || wLabel); };
      ui.prompt.innerHTML = '';
      ui.prompt.appendChild(el('span', { html: 'Tap the shadow of: <b>' + Kit.esc(wLabel) + '</b>' }));
      ui.prompt.appendChild(el('button', { type: 'button', class: 'icon-btn sm', text: '🔊', onclick: ui.speakCur }));
      if (!Kit.preview) Kit.say(wLabel);

      ui.layer.innerHTML = '';
      var grid = el('div', { class: 'shadow-grid' });
      pool.forEach(function (item) {
        var iLabel = item.w || item.word || item.label || '';
        var isRevealed = item._rev;
        var card = el('button', {
          type: 'button',
          class: 'sh-card ' + (isRevealed ? 'revealed' : 'is-shadow'),
          onclick: function () {
            if (S.busy || isRevealed) return;
            if (iLabel === wLabel) {
              S.busy = true;
              item._rev = true;
              card.className = 'sh-card revealed';
              awardTurn(10);
              Kit.say(wLabel + '!');
              tIdx++;
              later(function () { advanceRound(drawRound); }, 1100);
            } else {
              card.classList.add('wrong');
              Kit.sound('soft');
              later(function () { card.classList.remove('wrong'); }, 380);
            }
          }
        }, [
          el('img', { src: Kit.src(item.img), alt: '' }),
          el('span', { class: 'sh-word', text: iLabel })
        ]);
        grid.appendChild(card);
      });
      ui.layer.appendChild(grid);

      if (Kit.preview) {
        later(function () {
          var cards = grid.querySelectorAll('.sh-card');
          var matchIdx = pool.indexOf(target);
          if (cards[matchIdx]) cards[matchIdx].click();
        }, 1100);
      }
    }

    if (Kit.preview) caption(1, 'Listen & tap the matching shadow!');
    drawRound();
    if (Kit.preview) later(function () { caption(2, 'It pops into full 3D colour!'); }, 1600);
  }

  /* ----------------------- 2. PREPOSITION ROOM ----------------------- */
  function runPrepositions() {
    var order = Kit.shuffle(PREP_SPOTS.slice());
    var pIdx = 0;

    function drawRoom() {
      if (S.round >= S.rounds) return showFinale();
      S.busy = false;
      var target = order[pIdx % order.length];
      pIdx++;
      ui.speakCur = function () { Kit.say(target.sent); };
      ui.prompt.innerHTML = '';
      ui.prompt.appendChild(el('span', { html: 'Put Kitty <b>' + Kit.esc(target.prep) + '</b> ' + Kit.esc(target.place) + '!' }));
      ui.prompt.appendChild(el('button', { type: 'button', class: 'icon-btn sm', text: '🔊', onclick: ui.speakCur }));
      if (!Kit.preview) Kit.say(target.sent);

      ui.layer.innerHTML = '';
      var kitty = el('img', {
        class: 'prep-kitty',
        src: Kit.src('assets/games/mascots/kitty.webp'),
        alt: 'Kitty',
        style: { left: '50%', top: '24%' }
      });
      ui.layer.appendChild(kitty);

      PREP_SPOTS.forEach(function (sp) {
        var z = el('button', {
          type: 'button',
          class: 'prep-zone',
          style: { left: sp.x + '%', top: sp.y + '%' },
          onclick: function () {
            if (S.busy) return;
            if (sp.id === target.id) {
              S.busy = true;
              z.classList.add('right');
              kitty.style.left = sp.x + '%';
              kitty.style.top = (sp.y - 6) + '%';
              awardTurn(10);
              Kit.say('Kitty is ' + sp.prep.toLowerCase() + ' ' + sp.place + '!');
              later(function () { advanceRound(drawRoom); }, 1250);
            } else {
              z.classList.add('wrong');
              Kit.sound('soft');
              later(function () { z.classList.remove('wrong'); }, 380);
            }
          }
        }, [
          el('b', { text: sp.prep }),
          el('span', { text: sp.place })
        ]);
        ui.layer.appendChild(z);
      });

      if (Kit.preview) {
        later(function () {
          var zones = ui.layer.querySelectorAll('.prep-zone');
          var idx = PREP_SPOTS.indexOf(target);
          if (zones[idx]) zones[idx].click();
        }, 1100);
      }
    }

    if (Kit.preview) caption(1, 'Read & listen: ON · IN · UNDER · NEXT TO!');
    drawRoom();
    if (Kit.preview) later(function () { caption(2, 'Tap the spot & watch Kitty jump!'); }, 1600);
  }

  /* ----------------------- 3. LOOK & TAP SCENE ----------------------- */
  function runLookTap() {
    var srcCards = (S.pack && (S.pack.cards || S.pack.items)) || [];
    var items = Kit.shuffle(srcCards.slice()).slice(0, 8);
    var tIdx = 0;

    function drawScene() {
      if (S.round >= S.rounds) return showFinale();
      S.busy = false;
      var target = items[tIdx % items.length];
      tIdx++;
      var wLabel = target.w || target.word || target.label || '';
      ui.speakCur = function () { Kit.say(target.say || target.cl || ('Find the ' + wLabel)); };
      ui.prompt.innerHTML = '';
      ui.prompt.appendChild(el('span', { html: 'Find & tap: <b>' + Kit.esc(wLabel) + '</b>' }));
      ui.prompt.appendChild(el('button', { type: 'button', class: 'icon-btn sm', text: '🔊', onclick: ui.speakCur }));
      if (!Kit.preview) Kit.say(wLabel);

      ui.layer.innerHTML = '';
      items.forEach(function (it, idx) {
        var iLabel = it.w || it.word || it.label || '';
        var pos = SCENE_SPOTS[idx % SCENE_SPOTS.length];
        var btn = el('button', {
          type: 'button',
          class: 'lt-item',
          style: { left: pos.x + '%', top: pos.y + '%', '--d': (-(idx % 4) * 0.45) + 's' },
          onclick: function () {
            if (S.busy) return;
            if (iLabel === wLabel) {
              S.busy = true;
              btn.classList.add('right');
              awardTurn(10);
              Kit.say(wLabel + '!');
              later(function () { advanceRound(drawScene); }, 1050);
            } else {
              btn.classList.add('wrong');
              Kit.sound('soft');
              later(function () { btn.classList.remove('wrong'); }, 380);
            }
          }
        }, [el('img', { src: Kit.src(it.img), alt: iLabel })]);
        ui.layer.appendChild(btn);
      });

      if (Kit.preview) {
        later(function () {
          var btns = ui.layer.querySelectorAll('.lt-item');
          var mIdx = items.indexOf(target);
          if (btns[mIdx]) btns[mIdx].click();
        }, 1100);
      }
    }

    if (Kit.preview) caption(1, 'Scan the cozy room & listen!');
    drawScene();
    if (Kit.preview) later(function () { caption(2, 'Tap the matching object (+10 ⭐)!'); }, 1600);
  }

  /* ----------------------- FINALE ----------------------- */
  function showFinale() {
    clearTimers();
    S.phase = 'end';
    ui.layer.innerHTML = '';
    ui.prompt.classList.add('hidden');

    var mainCol = el('div', { class: 'finale-main' });
    if (S.teamsData.length) {
      var ranked = S.teamsData.slice().sort(function (a, b) { return b.score - a.score; });
      var top = ranked[0] ? ranked[0].score : 0;
      mainCol.appendChild(el('h2', { text: '🏆 ' + ranked[0].name + ' Wins ' + META.name + '!' }));
      var pod = el('div', { class: 'podium' });
      ranked.forEach(function (t, k) {
        var hgt = top ? 30 + 66 * (t.score / top) : 34;
        pod.appendChild(el('div', { class: 'pod', style: { '--tc': t.color, '--h': hgt + '%' } }, [
          t.mascotImg ? el('img', { src: Kit.src(t.mascotImg), alt: '' }) : el('span', { text: t.emoji }),
          el('div', { class: 'pod-bar' }, [el('b', { text: String(t.score) })]),
          el('span', { text: (k === 0 ? '👑 ' : '') + t.name })
        ]));
      });
      mainCol.appendChild(pod);
    } else {
      mainCol.appendChild(el('h2', { text: '🌟 Amazing Work! ' + S.classStars + ' Class Stars!' }));
    }

    var card = el('div', { class: 'finale-card' }, [mainCol]);
    var xpPanel = (!Kit.preview && Kit.classroom && Kit.classroom.podiumPanel)
      ? Kit.classroom.podiumPanel({
          classId: S.classId,
          teams: S.teamsData,
          classStars: S.classStars,
          gameId: 'scene-' + GAME_ID,
          gameTitle: META.name,
          icon: META.icon
        })
      : null;
    if (xpPanel) card.appendChild(xpPanel);

    ui.stage.appendChild(card);
    Kit.sound('fanfare');
    Kit.confetti(null, null, Kit.preview ? 30 : 120);

    ui.ctrl.innerHTML = '';
    ui.ctrl.appendChild(el('button', { type: 'button', class: 'btn mint lg', text: '↺ Play Again', onclick: function () { card.remove(); ui.prompt.classList.remove('hidden'); start(S.pack); } }));
    ui.ctrl.appendChild(el('button', { type: 'button', class: 'btn soft', text: '⚙ Setup', onclick: setup }));
    ui.ctrl.appendChild(el('button', { type: 'button', class: 'btn soft', text: '✦ All games', onclick: function () { root.location.href = '../index.html'; } }));
  }

  /* ======================= BOOT ======================= */
  if (Kit.preview) {
    doc.body.classList.add('preview');
    Kit.sets.all().then(function (sets) {
      start(sets[0] || { id: 'demo', name: 'Demo', items: [] });
    });
  } else {
    setup();
  }
})(window);
