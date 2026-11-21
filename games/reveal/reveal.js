/* Hidden Picture Games (v2) · Seven Handcrafted Kawaii Game Worlds
   reveal/index.html?game=flashlight | doors | orbit | camera | bricks | tiles | pixels
   Add &preview=1 for the silent self-playing showcase loop. */
(function (root) {
  'use strict';
  root.KIT_ROOT = '../../';
  var Kit = root.Kit, el = Kit.el, doc = root.document;
  var app = doc.getElementById('app');
  var BG = [
    ['#ffe6f2', '#ffd1e8'], ['#e4f2ff', '#cce5ff'], ['#e2fbf0', '#c6f2de'],
    ['#fff5d6', '#ffe8ab'], ['#f0e8ff', '#dfd1ff'], ['#ffece0', '#ffd8c2']
  ];
  var DPR = Math.min(2, root.devicePixelRatio || 1);

  /* ======================= The Seven Worlds ======================= */
  var GAMES = {
    flashlight: {
      title: 'Flashlight Finder', icon: '🔦', color: 'lilac', mood: 'mystery',
      sub: 'Listen · Shine the golden beam · Find the hidden picture',
      how: ['Hear or read the clue', 'Sweep the flashlight in the dark', 'Tap the matching picture!'],
      perRound: 6, opts: { light: 130, clueMode: 'word' }
    },
    doors: {
      title: 'Sneaky Doors', icon: '🚪', color: 'pink', mood: 'mystery',
      sub: 'Pick a rooftop door · Sneak a spotlight peek · Guess!',
      how: ['Pick one of 8 candy doors', 'Sneak a spotlight peek inside', 'Swing both doors wide open!'],
      perRound: 8, opts: {}
    },
    orbit: {
      title: 'Orbit Puzzle', icon: '🧩', color: 'sky', mood: 'cosmic',
      sub: '3D jigsaw pieces orbit in space · Snap them home · Guess early!',
      how: ['Jigsaw pieces orbit in 3D space', 'Snap pieces into the frame', 'Guess before the last piece!'],
      opts: { pieces: 12, style: 'ring', speed: 1, framed: true }
    },
    camera: {
      title: 'Snap Cameras', icon: '📸', color: 'butter', mood: 'sunny',
      sub: 'Four cute animal cameras · Flash Polaroid clues · Pick the answer!',
      how: ['Tap Bunny, Frog, Bear or Duck cam', 'Snap & inspect the Polaroid clue', 'Pick or shout the answer!'],
      opts: { answerMode: 'choices' }
    },
    bricks: {
      title: 'Brick Blast', icon: '🧱', color: 'peach', mood: 'sunny',
      sub: 'Swing the Star Mallet · Pop pastel toy bricks · Reveal the picture!',
      how: ['Tap any brick with the Star Mallet', 'Pop holes in the candy wall', 'Guess what\'s hiding behind!'],
      opts: { size: 'medium' }
    },
    tiles: {
      title: 'Letter Tiles', icon: '🔤', color: 'mint', mood: 'sunny',
      sub: 'Call a letter A–Z · Pop the candy tile · Uncover the picture!',
      how: ['Students call out a letter', 'That candy tile pops away', 'Guess the hidden picture!'],
      opts: { count: 20, sayLetter: true }
    },
    pixels: {
      title: 'Pixel Quiz', icon: '🟪', color: 'lilac', mood: 'sunny',
      sub: 'Candy mosaic sharpens · Tap A, B, C or D early for max points!',
      how: ['A mosaic picture appears', 'Tiles sharpen second by second', 'Tap the right word early!'],
      opts: { speed: 'normal' }
    }
  };

  var gid = Kit.param('game'); if (!GAMES[gid]) gid = 'doors';
  var G = GAMES[gid];
  doc.title = G.title + ' · Games · English Adventure Academy';
  var PKEY = 'reveal_' + gid;

  var S = {
    setId: Kit.param('set') || Kit.pref('set') || 'g3-u5-time-book',
    classId: Kit.classroom ? Kit.classroom.defaultClassId() : '',
    teams: Kit.pref('teams') == null ? 2 : Kit.pref('teams'),
    rounds: Kit.pref('rounds_' + gid) || 'all',
    opts: Object.assign({}, G.opts || {}, Kit.pref(PKEY) || {}),
    allSets: [], set: null, cards: [], round: 0, total: 0, worth: 10, teamsData: [], turn: 0, phase: 'setup'
  };

  function advanceTurn() {
    if (!S.teamsData.length) return;
    if (Kit.classroom && Kit.classroom.advanceSpeaker) {
      Kit.classroom.advanceSpeaker(S.teamsData[S.turn]);
    }
    S.turn = (S.turn + 1) % S.teamsData.length;
  }

  function openLiveEditor() {
    paused = true;
    Kit.studio(S.setId, function (id) {
      paused = false;
      if (id) { S.setId = id; Kit.pref('set', id); }
      if (S.phase === 'setup') {
        setup();
      } else {
        Kit.sets.get(S.setId).then(function (freshSet) {
          if (freshSet && freshSet.cards && freshSet.cards.length >= 2) {
            Kit.toast('Updated "' + freshSet.name + '" — restarting round with your changes!');
            start(freshSet);
          }
        });
      }
    });
  }

  function mountTopbar() {
    Kit.topbar({
      home: '../index.html',
      title: G.icon + ' ' + G.title,
      onEdit: openLiveEditor,
      editLabel: '✎ Edit game',
      onResize: function () { if (S.phase !== 'setup') fit(); }
    });
  }

  /* ======================= Setup Screen ======================= */
  function setup() {
    clearTimers(); if (mode && mode.destroy) mode.destroy(); mode = null;
    S.phase = 'setup';
    Kit.clearKeys();
    mountTopbar();
    if (Kit.music) Kit.music.start(G.mood || 'sunny');

    Kit.sets.all().then(function (sets) {
      S.allSets = sets;
      var cur = (Kit.matchPack ? Kit.matchPack(sets, S.setId) : sets.filter(function (s) { return s.id === S.setId; })[0]) || sets[0];
      S.setId = cur.id;
      app.innerHTML = '';
      app.className = 'app setup-screen';

      var hero = el('section', { class: 'hero panel' }, [
        el('div', { class: 'hero-poster' }, [
          el('img', { src: '../posters/' + gid + '.webp', alt: G.title })
        ]),
        el('div', { class: 'hero-info' }, [
          el('h1', { text: G.title }),
          el('p', { class: 'muted', text: G.sub }),
          el('ol', { class: 'how' }, G.how.map(function (t, i) {
            return el('li', null, [el('b', { text: String(i + 1) }), el('span', { text: t })]);
          }))
        ])
      ]);

      /* Picture sets box */
      var setBox = el('section', { class: 'panel' }, [el('h2', { text: '🖼️ Choose a Picture Pack' })]);
      var chips = el('div', { class: 'set-grid' });
      sets.forEach(function (s) {
        var thumbs = el('div', { class: 'set-thumbs' }, s.cards.slice(0, 3).map(function (c) {
          return el('img', { src: Kit.src(c.img), alt: '', loading: 'lazy', decoding: 'async' });
        }));
        chips.appendChild(el('button', {
          type: 'button',
          class: 'set-card' + (s.id === S.setId ? ' on' : ''),
          onclick: function () { Kit.sound('tap'); S.setId = s.id; Kit.pref('set', s.id); setup(); }
        }, [
          thumbs,
          el('b', { text: (s.e ? s.e + ' ' : '') + s.name }),
          el('small', { text: (s.sub ? s.sub + ' · ' : '') + s.cards.length + ' pictures' })
        ]));
      });
      setBox.appendChild(chips);
      setBox.appendChild(el('div', { class: 'row-end' }, [
        el('button', {
          type: 'button', class: 'btn lilac sm', text: '🎨 Make it your own (Add / Cutout / Arrange)',
          onclick: openLiveEditor
        })
      ]));

      /* Players, Mascots, Real Class & Options */
      var playBox = el('section', { class: 'panel' }, [el('h2', { text: '🐾 Teams & Classroom Setup' })]);
      playBox.appendChild(seg([[0, '🌟 Whole class'], [2, '2 teams'], [3, '3 teams'], [4, '4 teams'], [5, '5'], [6, '6']], S.teams, function (v) {
        Kit.sound('tap');
        S.teams = v;
        Kit.pref('teams', v);
        if (v > 0 && S.classId && Kit.pref('teamMode') === 'groups' && Kit.classroom && Kit.classroom.groups(S.classId).length !== v) {
          Kit.pref('teamMode', 'fair');
        }
        setup();
      }));

      var clsNode = Kit.classroom && Kit.classroom.setupPanel ? Kit.classroom.setupPanel(S, setup) : null;
      if (clsNode) playBox.appendChild(clsNode);

      var maxRounds = cur.cards.length;
      var roundOpts = gid === 'flashlight'
        ? [[6, '6 words · ≈ 5 min'], [12, '12 words · ≈ 10 min'], ['all', 'All ' + cur.cards.length + ' words']]
        : [[5, '5 rounds · ≈ 7 min'], [8, '8 rounds · ≈ 10 min'], [12, '12 rounds · ≈ 15 min'], ['all', 'All ' + cur.cards.length]];
      playBox.appendChild(el('div', { class: 'label', text: gid === 'flashlight' ? 'Words & Time' : 'Rounds & Lesson Fit' }));
      playBox.appendChild(seg(roundOpts.filter(function (o) { return o[0] === 'all' || o[0] < maxRounds; }), S.rounds, function (v) {
        Kit.sound('tap'); S.rounds = v; Kit.pref('rounds_' + gid, v); setup();
      }));

      var extra = gameOptions();
      if (extra) {
        playBox.appendChild(el('div', { class: 'label', text: extra.label }));
        playBox.appendChild(extra.node);
      }

      var n = roundsCount(cur);
      var mins = Math.max(3, Math.round(n * (gid === 'flashlight' ? 0.6 : gid === 'pixels' ? 0.9 : 1.25)));
      var go = el('section', { class: 'go panel' }, [
        el('div', null, [
          el('b', { text: '⏱ About ' + mins + ' minutes' }),
          el('small', { class: 'muted', text: n + (gid === 'flashlight' ? ' words to find' : ' mystery pictures') + ' · ' + (S.teams ? S.teams + ' mascot teams' : 'whole class') })
        ]),
        el('button', {
          type: 'button', class: 'btn lg', text: '▶ Play Now',
          disabled: cur.cards.length < (gid === 'pixels' ? 4 : 2) ? true : null,
          onclick: function () { Kit.sound('pop'); start(cur); }
        })
      ]);

      app.appendChild(hero);
      app.appendChild(el('div', { class: 'setup-cols' }, [setBox, el('div', { class: 'setup-side' }, [playBox, go])]));
      app.appendChild(el('p', {
        class: 'keys-hint muted',
        html: 'Shortcuts: <span class="kbd">Space</span> main action · <span class="kbd">Enter</span> reveal answer · <span class="kbd">N</span> next · <span class="kbd">R</span> speak word · <span class="kbd">F</span> present full screen'
      }));
      Kit.keys({ enter: function () { start(cur); } });
    });
  }

  function seg(list, val, fn) {
    var box = el('div', { class: 'seg' });
    list.forEach(function (o) {
      box.appendChild(el('button', {
        type: 'button',
        class: 'chip' + (String(o[0]) === String(val) ? ' on' : ''),
        text: o[1],
        onclick: function () { fn(o[0]); }
      }));
    });
    return box;
  }
  function saveOpts() { Kit.pref(PKEY, S.opts); }

  function gameOptions() {
    if (gid === 'flashlight') {
      var box = el('div');
      var r = el('input', { type: 'range', min: 65, max: 220, value: S.opts.light, 'aria-label': 'Light size' });
      r.addEventListener('input', function () { S.opts.light = +r.value; saveOpts(); });
      box.appendChild(el('div', { class: 'range-row' }, [el('span', { text: '🔦' }), r, el('span', { text: '🌕' })]));
      box.appendChild(el('div', { style: { height: '8px' } }));
      box.appendChild(seg([['word', '🔤 Word clue'], ['sentence', '💬 Sentence clue']], S.opts.clueMode || 'word', function (v) { S.opts.clueMode = v; saveOpts(); setup(); }));
      return { label: 'Flashlight & Clue Style', node: box };
    }
    if (gid === 'camera') {
      return {
        label: 'How Students Answer',
        node: seg([['choices', '🍬 4 Candy Choices (with audio)'], ['open', '🎤 Shout Aloud (Teacher awards)']], S.opts.answerMode || 'choices', function (v) { S.opts.answerMode = v; saveOpts(); setup(); })
      };
    }
    if (gid === 'orbit') {
      var oBox = el('div');
      oBox.appendChild(seg([[6, '6 pcs'], [9, '9 pcs'], [12, '12 pcs'], [16, '16 pcs'], [24, '24 pcs']], S.opts.pieces || 12, function (v) { S.opts.pieces = v; saveOpts(); setup(); }));
      oBox.appendChild(el('div', { style: { height: '8px' } }));
      oBox.appendChild(seg([
        ['ring', '💫 3D Ring'], ['galaxy', '🌌 Galaxy'], ['wave', '🌊 Wave'],
        ['parade', '🎠 Parade'], ['bubbles', '🫧 Bubbles'], ['mix', '🎲 Mixed · Auto']
      ], S.opts.style || 'ring', function (v) { S.opts.style = v; saveOpts(); setup(); }));
      return { label: 'Jigsaw Pieces & Motion Mode', node: oBox };
    }
    if (gid === 'bricks') {
      return { label: 'Brick Wall Density', node: seg([['big', 'Big bricks (easy)'], ['medium', 'Medium'], ['small', 'Small bricks (challenge)']], S.opts.size, function (v) { S.opts.size = v; saveOpts(); setup(); }) };
    }
    if (gid === 'tiles') {
      return { label: 'Alphabet Grid', node: seg([[12, '12 tiles (A–L)'], [20, '20 tiles (A–T)'], [24, '24 tiles (A–X)']], S.opts.count, function (v) { S.opts.count = v; saveOpts(); setup(); }) };
    }
    if (gid === 'pixels') {
      return { label: 'Unblur Speed', node: seg([['slow', '🐢 Relaxed'], ['normal', '🐇 Normal'], ['fast', '🚀 Fast']], S.opts.speed, function (v) { S.opts.speed = v; saveOpts(); setup(); }) };
    }
    return null;
  }

  function roundsCount(set) {
    var n = set.cards.length;
    return S.rounds === 'all' ? n : Math.min(n, +S.rounds);
  }

  /* ======================= Play Screen Engine ======================= */
  var ui = {}, mode = null, timers = [], rafId = 0, paused = false;
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; if (rafId) cancelAnimationFrame(rafId); rafId = 0; }
  function loop(fn) {
    if (rafId) cancelAnimationFrame(rafId);
    var last = performance.now();
    function f(t) {
      var dt = Math.max(0, Math.min(50, t - last));
      last = t;
      if (!paused) fn(dt, t);
      rafId = requestAnimationFrame(f);
    }
    rafId = requestAnimationFrame(f);
  }

  function start(set) {
    S.set = set;
    S.cards = Kit.shuffle(set.cards);
    S.total = roundsCount(set);
    S.cards = S.cards.slice(0, S.total);
    S.teamsData = S.teams ? Kit.makeTeams(S.teams, { classId: Kit.preview ? '' : S.classId }) : [];
    S.round = 0; S.turn = 0; S.classStars = 0; S.used = {}; paused = false;
    if (gid === 'doors') S.total = Math.min(S.total, 8);
    S.phase = 'play';
    Kit.clearKeys(['enter']);
    if (Kit.music) Kit.music.start(G.mood || 'sunny');
    buildPlay();
    ui.worth.style.visibility = '';
    if (gid === 'flashlight') flashlightRound(0); else nextRound(true);
  }

  function buildPlay() {
    app.innerHTML = '';
    app.className = 'app play-screen' + (Kit.preview ? ' is-preview' : '');
    ui.head = el('div', { class: 'play-head' });
    ui.count = el('div', { class: 'count-pill' });
    ui.worth = el('div', { class: 'worth-pill' });
    ui.teams = el('div', { class: 'team-bar' });
    ui.head.appendChild(ui.count); ui.head.appendChild(ui.teams); ui.head.appendChild(ui.worth);
    ui.box = el('div', { class: 'stage-box' });
    ui.stage = el('div', { class: 'stage' });
    ui.box.appendChild(ui.stage);
    ui.ctrl = el('div', { class: 'controls' });
    ui.caption = el('div', { class: 'caption hidden' });
    app.appendChild(ui.head); app.appendChild(ui.box); app.appendChild(ui.ctrl); app.appendChild(ui.caption);
    drawTeams();
    fit();
    Kit.keys({
      n: function () { if (ui.nextBtn && !ui.nextBtn.disabled) ui.nextBtn.click(); },
      enter: function () { if (ui.ansBtn && !ui.ansBtn.disabled) ui.ansBtn.click(); },
      r: function () { var c = currentCard(); if (c) Kit.say(c.w); },
      k: function () { paused = !paused; Kit.toast(paused ? '⏸ Paused' : '▶ Playing', 900); },
      space: function () { if (mode && mode.main) mode.main(); },
      escape: function () { quitAsk(); }
    });
  }

  function currentCard() { return gid === 'flashlight' ? (mode && mode.target) : S.curCard; }
  function drawTeams() {
    if (!S.teamsData.length) {
      ui.teams.innerHTML = '';
      ui.teams.appendChild(el('div', { class: 'play-head-wrap' }, [
        el('div', { class: 'class-stars', text: '⭐ ' + S.classStars + ' class stars' })
      ]));
      return;
    }
    Kit.renderTeams(ui.teams, S.teamsData, { turn: S.turn });
  }
  function setWorth(n) {
    S.worth = Math.max(2, Math.round(n));
    ui.worth.innerHTML = '';
    ui.worth.appendChild(el('span', { text: 'Worth' }));
    ui.worth.appendChild(el('b', { text: '⭐ ' + S.worth }));
    ui.worth.classList.remove('bump'); void ui.worth.offsetWidth; ui.worth.classList.add('bump');
  }
  function stageSize() { var r = ui.stage.getBoundingClientRect(); return { w: Math.max(240, r.width), h: Math.max(160, r.height) }; }
  function fit() {
    if (!ui.box) return;
    var r = ui.box.getBoundingClientRect();
    if (root.innerWidth <= 860 || r.width < r.height) {
      ui.stage.style.width = Math.max(240, Math.floor(r.width)) + 'px';
      ui.stage.style.height = Math.max(240, Math.floor(r.height)) + 'px';
      return;
    }
    var ar = 16 / 10;
    var w = r.width, h = w / ar;
    if (h > r.height) { h = r.height; w = h * ar; }
    ui.stage.style.width = Math.floor(w) + 'px';
    ui.stage.style.height = Math.floor(h) + 'px';
  }
  var resizeT = 0;
  root.addEventListener('resize', function () {
    clearTimeout(resizeT);
    resizeT = setTimeout(function () {
      if (S.phase === 'play' || S.phase === 'answer' || S.phase === 'awarded' || S.phase === 'end') {
        fit();
        if (mode && mode.resize) mode.resize();
      }
    }, 120);
  });

  function controls(list) {
    ui.ctrl.innerHTML = ''; ui.ansBtn = null; ui.nextBtn = null;
    list.forEach(function (b) {
      if (!b) return;
      if (b.node) { ui.ctrl.appendChild(b.node); return; }
      var n = el('button', {
        type: 'button', class: 'btn ' + (b.cls || ''),
        html: b.html || null, text: b.html ? null : b.label,
        title: b.title || null, disabled: b.disabled ? true : null,
        onclick: b.on
      });
      if (b.key === 'answer') ui.ansBtn = n;
      if (b.key === 'next') ui.nextBtn = n;
      ui.ctrl.appendChild(n);
    });
  }

  function caption(i, text) {
    if (!Kit.preview) return;
    ui.caption.classList.remove('hidden');
    ui.caption.innerHTML = '<b>' + i + '</b> ' + Kit.esc(text);
    ui.caption.classList.remove('in'); void ui.caption.offsetWidth; ui.caption.classList.add('in');
  }

  /* Compose a card's artwork on an ornate pastel canvas backdrop */
  function compose(card, w, h, bgIdx, padArg) {
    return Kit.loadImg(Kit.src(card.img)).then(function (img) {
      var c = doc.createElement('canvas'); c.width = Math.round(w * DPR); c.height = Math.round(h * DPR);
      var g = c.getContext('2d'); g.scale(DPR, DPR);
      var b = BG[(bgIdx || 0) % BG.length];
      var gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, b[0]); gr.addColorStop(1, b[1]);
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
      /* Subtle pastel confetti polka dots */
      g.fillStyle = 'rgba(255,255,255,.58)';
      for (var i = 0; i < 28; i++) { g.beginPath(); g.arc((i * 103 + 29) % w, (i * 61 + 19) % h, 3 + (i % 4), 0, 6.283); g.fill(); }
      var rg = g.createRadialGradient(w / 2, h / 2, 12, w / 2, h / 2, Math.min(w, h) * 0.58);
      rg.addColorStop(0, 'rgba(255,255,255,.96)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = rg; g.fillRect(0, 0, w, h);
      var pad = padArg == null ? 0.12 : padArg, mw = w * (1 - pad * 2), mh = h * (1 - pad * 2);
      var sc = Math.min(mw / img.width, mh / img.height);
      var dw = img.width * sc, dh = img.height * sc, dx = (w - dw) / 2, dy = (h - dh) / 2;
      /* Ground reflection oval + artwork drop shadow */
      g.save();
      g.fillStyle = 'rgba(74, 34, 108, .12)';
      g.beginPath(); g.ellipse(w / 2, dy + dh * 0.96, dw * 0.38, Math.max(8, dh * 0.06), 0, 0, 6.283); g.fill();
      g.shadowColor = 'rgba(64, 28, 98, .26)'; g.shadowBlur = 22; g.shadowOffsetY = 9;
      g.drawImage(img, dx, dy, dw, dh);
      g.restore();
      return c;
    });
  }

  function canvasFor(w, h) {
    var c = el('canvas', { class: 'layer' });
    c.width = Math.round(w * DPR); c.height = Math.round(h * DPR);
    var g = c.getContext('2d'); g.scale(DPR, DPR);
    return { c: c, g: g };
  }

  /* Helper: build 4 Candy Answer Buttons (A, B, C, D) with audio on every choice */
  function buildCandyChoices(targetCard, onRight, onWrong) {
    var pool = S.set.cards.map(function (x) { return x.w; }).filter(function (w, i, a) { return w !== targetCard.w && a.indexOf(w) === i; });
    while (pool.length < 3) pool.push(['balloon', 'rocket', 'pyramid', 'treasure'][pool.length]);
    var opts = Kit.shuffle([targetCard.w].concat(Kit.shuffle(pool).slice(0, 3)));
    var letters = ['A', 'B', 'C', 'D'];
    var row = el('div', { class: 'cam-choices' });
    var nodes = [];
    opts.forEach(function (w, idx) {
      var btn = el('div', {
        class: 'candy-ans',
        role: 'button',
        tabindex: '0',
        onclick: function () { pick(idx); }
      }, [
        el('span', { class: 'c-let', text: letters[idx] }),
        el('span', { class: 'c-word', text: w }),
        el('button', {
          type: 'button', class: 'c-say', title: 'Hear "' + w + '"', text: '🔈',
          onclick: function (ev) { ev.stopPropagation(); Kit.say(w); }
        })
      ]);
      nodes.push(btn);
      row.appendChild(btn);
    });
    function pick(idx) {
      var n = nodes[idx];
      if (!n || n.classList.contains('wrong') || n.classList.contains('right')) return;
      if (opts[idx] === targetCard.w) {
        n.classList.add('right');
        onRight(opts[idx], n);
      } else {
        n.classList.add('wrong');
        onWrong(opts[idx], n);
      }
    }
    return { row: row, opts: opts, nodes: nodes, pick: pick };
  }

  /* ---------- Round Flow for the 6 Guessing Games ---------- */
  function nextRound(first) {
    clearTimers();
    if (mode && mode.destroy) mode.destroy();
    if (!first && S.teamsData.length) advanceTurn();
    S.round++;
    if (S.round > S.total) return finish();
    S.phase = 'play';
    ui.stage.innerHTML = ''; ui.stage.className = 'stage stage-' + gid;
    ui.count.innerHTML = '<span>Round</span><b>' + S.round + ' / ' + S.total + '</b>';
    drawTeams(); setWorth(10);
    if (gid === 'doors') doorPicker(begin); else begin(S.cards[S.round - 1], (S.round - 1) % 8);
  }

  function begin(card, doorPaletteIdx) {
    S.curCard = card;
    S.doorIdx = doorPaletteIdx || 0;
    var sz = stageSize();
    ui.stage.innerHTML = '';
    mode = MODES[gid]();
    compose(card, sz.w, sz.h, S.round, { orbit: 0.08, tiles: 0.08, bricks: 0.08, camera: 0.06, pixels: 0.06, doors: 0.08 }[gid]).then(function (pic) {
      if (S.phase !== 'play') return;
      mode.init(card, pic, sz);
      if (Kit.preview) mode.demo && mode.demo();
    }).catch(function () {
      Kit.toast('A picture could not load — skipping');
      later(function () { nextRound(); }, 700);
    });
  }

  function mountDoorsBackdrop() {
    ui.stage.appendChild(el('img', { class: 'doors-world-bg', src: Kit.src('assets/games/reveal/bg_night_rooftops.webp'), alt: '' }));
    ui.stage.appendChild(el('div', { class: 'doors-world-tint' }));
    ui.stage.appendChild(el('img', { class: 'doors-mascot', src: Kit.src('assets/games/reveal/mascot_sneaky_cat.webp'), alt: '' }));
  }

  /* 🚪 Sneaky Doors: Moonlit Rooftop 8-Door Picker */
  function doorPicker(done) {
    S.used = S.used || {};
    mountDoorsBackdrop();
    var hall = el('div', { class: 'hall' });
    var turnTeam = S.teamsData.length ? S.teamsData[S.turn] : null;
    var turnSpk = turnTeam && Kit.classroom && Kit.classroom.currentSpeaker ? Kit.classroom.currentSpeaker(turnTeam) : null;
    var promptTxt = turnTeam
      ? (turnTeam.emoji + ' ' + turnTeam.name + (turnSpk ? ' · 🎤 ' + turnSpk.name : '') + ' — Choose a door!')
      : 'Choose a door to start the sneak peek!';
    hall.appendChild(el('div', { class: 'hall-banner', text: promptTxt }));

    var row = el('div', { class: 'hall-doors' });
    var picked = false;
    for (var i = 0; i < S.total; i++) (function (i) {
      var used = S.used[i];
      var d = el('button', {
        type: 'button',
        class: 'mini-door' + (used ? ' used' : ''),
        disabled: used ? true : null,
        style: { animationDelay: (i * 0.04) + 's' },
        'aria-label': 'Door ' + (i + 1)
      }, [
        el('div', { class: 'md-leaves' }, used
          ? [el('img', { src: Kit.src(S.cards[i].img), alt: '' }), el('span', { class: 'mini-word', text: S.cards[i].w })]
          : [
              el('span', { class: 'md-leaf left' }, [el('i', { class: 'md-handle' })]),
              el('span', { class: 'md-leaf right' }, [el('i', { class: 'md-handle' })])
            ]),
        used ? null : el('span', { class: 'mini-num', text: 'Door ' + (i + 1) })
      ]);
      d.addEventListener('click', function () { if (!picked) pick(i, d); });
      row.appendChild(d);
    })(i);

    hall.appendChild(row);
    ui.stage.appendChild(hall);
    controls([{
      label: '🎲 Random door', cls: 'pink',
      on: function () {
        var free = [];
        for (var j = 0; j < S.total; j++) if (!S.used[j]) free.push(j);
        if (free.length) { var r = free[Math.floor(Math.random() * free.length)]; pick(r, row.children[r]); }
      }
    }]);

    var keys = {};
    for (var k = 1; k <= Math.min(8, S.total); k++) (function (k) {
      keys[String(k)] = function () { if (!S.used[k - 1] && !picked) pick(k - 1, row.children[k - 1]); };
    })(k);
    var pop = Kit.overlayKeys(keys);

    function pick(i, node) {
      picked = true; pop(); S.used[i] = true;
      if (node) node.classList.add('chosen');
      Kit.sound('whoosh');
      later(function () { done(S.cards[i], i); }, 380);
    }

    if (Kit.preview) {
      caption(1, 'Pick a rooftop door');
      later(function () {
        var free = [];
        for (var j = 0; j < S.total; j++) if (!S.used[j]) free.push(j);
        if (free.length) pick(free[0], row.children[free[0]]);
      }, 950);
    }
  }

  function answer(autoAwardedTeam) {
    if (S.phase !== 'play') return;
    S.phase = 'answer'; clearTimers();
    var card = S.curCard;
    if (mode && mode.reveal) mode.reveal();
    var rib = el('div', { class: 'ribbon' }, [
      el('span', null, [
        card.w,
        el('button', { type: 'button', class: 'icon-btn', style: { width: '38px', height: '38px', fontSize: '.52em' }, text: '🔈', onclick: function () { Kit.say(card.w); } })
      ])
    ]);
    ui.stage.appendChild(rib);
    Kit.sound('reveal'); Kit.say(card.w);
    var c = Kit.centerOf(ui.stage); Kit.confetti(c.x, c.y - 30, Kit.preview ? 32 : 76);

    if (autoAwardedTeam != null && S.teamsData[autoAwardedTeam]) {
      Kit.award(ui.teams, S.teamsData, autoAwardedTeam, S.worth);
      afterAward();
      return;
    }

    if (S.teamsData.length) {
      var list = [{ html: '<small><b>Who guessed it?</b></small>', cls: 'soft label-btn', disabled: true }];
      S.teamsData.forEach(function (t, i) {
        var dotHtml = t.mascotImg
          ? '<span class="tdot"><img src="' + Kit.esc(Kit.src(t.mascotImg)) + '" alt=""></span>'
          : '<span class="tdot" style="background:' + t.color + '">' + t.emoji + '</span>';
        list.push({
          html: dotHtml + ' ' + Kit.esc(t.name) + ' <b>+' + S.worth + '</b>',
          cls: 'soft team-btn' + (i === S.turn ? ' turn' : ''),
          on: function () { Kit.award(ui.teams, S.teamsData, i, S.worth); afterAward(); }
        });
      });
      list.push({ label: 'Nobody', cls: 'soft sm', on: afterAward });
      controls(list);
      Kit.keys({ 1: pick(0), 2: pick(1), 3: pick(2), 4: pick(3), 5: pick(4), 6: pick(5) });
    } else {
      S.classStars += S.worth; drawTeams();
      Kit.sound('correct');
      controls([{ label: S.round >= S.total ? '🏆 See Results' : 'Next picture →', cls: 'mint lg', key: 'next', on: function () { nextRound(); } }]);
      if (Kit.preview) later(function () { nextRound(); }, 1350);
    }
    function pick(i) {
      return function () { if (S.phase === 'answer' && S.teamsData[i]) { Kit.award(ui.teams, S.teamsData, i, S.worth); afterAward(); } };
    }
  }

  function afterAward() {
    S.phase = 'awarded';
    Kit.clearKeys(['1', '2', '3', '4', '5', '6']);
    controls([{ label: S.round >= S.total ? '🏆 See the Winners' : 'Next picture →', cls: 'mint lg', key: 'next', on: function () { nextRound(); } }]);
    if (Kit.preview) later(function () { nextRound(); }, 1350);
  }

  function stdControls(extra) {
    controls((extra || []).concat([
      { label: '👁 Show Answer', cls: 'lilac', key: 'answer', on: function () { answer(); } },
      { label: 'Skip →', cls: 'soft sm', key: 'next', on: function () { nextRound(); } }
    ]));
  }

  /* ---------- Finish & Podium ---------- */
  function finish() {
    clearTimers(); if (mode && mode.destroy) mode.destroy(); mode = null;
    S.phase = 'end';
    ui.stage.innerHTML = ''; ui.stage.className = 'stage stage-end';
    ui.worth.innerHTML = ''; ui.worth.style.visibility = 'hidden'; ui.count.innerHTML = '<b>🏁 Finished!</b>';
    fit();
    var box = el('div', { class: 'podium-wrap' });
    var mainCol = el('div', { class: 'podium-main' });
    if (S.teamsData.length) {
      var ranked = S.teamsData.map(function (t, i) { return { t: t, i: i }; }).sort(function (a, b) { return b.t.score - a.t.score; });
      var top = ranked[0].t.score, winners = ranked.filter(function (r) { return r.t.score === top; });
      mainCol.appendChild(el('h2', { class: 'win-title', text: winners.length > 1 ? '🤝 Amazing Tie!' : '🏆 ' + winners[0].t.name + ' Wins!' }));
      var pod = el('div', { class: 'podium' });
      ranked.forEach(function (r, k) {
        var hgt = top ? 30 + 68 * (r.t.score / top) : 32;
        var mascotTop = el('div', { class: 'pod-mascot' });
        if (k === 0 && r.t.score > 0) mascotTop.appendChild(el('span', { class: 'pod-crown', text: '👑' }));
        if (r.t.mascotImg) {
          var im = el('img', { src: Kit.src(r.t.mascotImg), alt: '' });
          im.onerror = function () { im.remove(); mascotTop.appendChild(doc.createTextNode(r.t.emoji)); };
          mascotTop.appendChild(im);
        } else {
          mascotTop.appendChild(doc.createTextNode(r.t.emoji));
        }
        pod.appendChild(el('div', { class: 'pod', style: { '--tc': r.t.color, '--h': hgt + '%', animationDelay: (k * 0.1) + 's' } }, [
          mascotTop,
          el('div', { class: 'pod-bar' }, [el('b', { text: String(r.t.score) })]),
          el('span', { text: r.t.name })
        ]));
      });
      mainCol.appendChild(pod);
    } else {
      mainCol.appendChild(el('h2', { class: 'win-title', text: '🌟 Awesome Job, Everyone!' }));
      mainCol.appendChild(el('p', { class: 'big-stars', text: '⭐ ' + S.classStars + ' Class Stars' }));
    }
    box.appendChild(mainCol);

    var xpPanel = (!Kit.preview && Kit.classroom && Kit.classroom.podiumPanel)
      ? Kit.classroom.podiumPanel({
          classId: S.classId,
          teams: S.teamsData,
          classStars: S.classStars,
          gameId: 'reveal-' + gid,
          gameTitle: G.title,
          icon: G.icon
        })
      : null;
    if (xpPanel) {
      box.classList.add('has-xp');
      box.appendChild(xpPanel);
    }
    ui.stage.appendChild(box);
    Kit.sound('fanfare'); Kit.confetti(null, null, Kit.preview ? 40 : 160);
    controls([
      { label: '↺ Play again', cls: 'mint lg', on: function () { start(S.set); } },
      { label: '⚙ Setup & Packs', cls: 'soft', on: setup },
      { label: '✦ All games', cls: 'soft', on: function () { root.location.href = '../index.html'; } }
    ]);
    if (Kit.preview) later(function () { start(S.set); }, 2500);
  }

  function quitAsk() {
    if (Kit.preview || S.phase === 'setup') return;
    Kit.modal({
      title: 'Back to setup?',
      body: '<p>Current round scores will reset.</p>',
      buttons: [{ label: 'Keep playing', cls: 'soft', value: false }, { label: 'Back to setup', cls: 'peach', value: true }]
    }).then(function (ok) {
      if (ok) { clearTimers(); if (mode && mode.destroy) mode.destroy(); mode = null; setup(); }
    });
  }

  /* ======================= THE SEVEN GAME MODES ======================= */
  var MODES = {};

  /* ---------- 1. 🚪 SNEAKY DOORS (Double Doors + Wandering Spotlight + Cat Detective) ---------- */
  var DOOR_COLORS = [
    ['#a8dcff', '#84c2ff'], ['#9cf2ec', '#73dfd7'], ['#fff3b0', '#ffe27a'], ['#ffc8dd', '#ffa6c7'],
    ['#dec9ff', '#c5a6ff'], ['#ffe09e', '#ffc966'], ['#c8eeb0', '#aedf8f'], ['#ffd1c2', '#ffb39b']
  ];
  MODES.doors = function () {
    var m = {}, open = 0, light = { x: 0.5, y: 0.45, vx: 0.0028, vy: 0.0034 };
    m.init = function (card, pic, sz) {
      mountDoorsBackdrop();
      var wrap = el('div', { class: 'dd-stage-wrap' });
      var interior = el('div', { class: 'dd-interior' });
      var iw = Math.round(sz.w * 0.7), ih = Math.round(sz.h * 0.86);
      var bg = canvasFor(iw, ih);
      interior.appendChild(bg.c);

      var pal = DOOR_COLORS[(S.doorIdx || 0) % DOOR_COLORS.length];
      function makeWing(side) {
        return el('div', { class: 'dd-wing ' + side, style: { '--dc1': pal[0], '--dc2': pal[1] } }, [
          el('span', { class: 'dd-shine' }),
          el('span', { class: 'dd-tag' }),
          el('div', { class: 'dd-slats' }, [el('i'), el('i'), el('i'), el('i')])
        ]);
      }
      var leftW = makeWing('left'), rightW = makeWing('right');
      var doors = el('div', { class: 'dd-doors' }, [leftW, rightW]);
      wrap.appendChild(interior);
      wrap.appendChild(doors);
      wrap.appendChild(el('div', { class: 'dd-badge', text: 'Door ' + ((S.doorIdx || 0) + 1) }));
      ui.stage.appendChild(wrap);

      m.leftW = leftW; m.rightW = rightW; m.bg = bg; m.pic = pic; m.iw = iw; m.ih = ih;

      function draw() {
        var g = bg.g; g.clearRect(0, 0, iw, ih);
        g.drawImage(pic, 0, 0, iw, ih);
        if (open >= 4) return;
        var dark = open === 0 ? 0.96 : (0.9 - open * 0.14);
        g.save();
        g.fillStyle = 'rgba(12, 8, 28, ' + dark + ')';
        g.fillRect(0, 0, iw, ih);
        if (open > 0) {
          g.globalCompositeOperation = 'destination-out';
          var R = Math.min(iw, ih) * (0.2 + open * 0.065);
          var rg = g.createRadialGradient(light.x * iw, light.y * ih, R * 0.35, light.x * iw, light.y * ih, R);
          rg.addColorStop(0, 'rgba(0,0,0,1)');
          rg.addColorStop(1, 'rgba(0,0,0,0)');
          g.fillStyle = rg;
          g.beginPath(); g.arc(light.x * iw, light.y * ih, R, 0, 6.283); g.fill();
          g.globalCompositeOperation = 'source-over';
          g.strokeStyle = 'rgba(255, 218, 118, .65)';
          g.lineWidth = 2.5;
          g.beginPath(); g.arc(light.x * iw, light.y * ih, R * 0.92, 0, 6.283); g.stroke();
        }
        g.restore();
      }

      loop(function (dt) {
        if (open > 0 && open < 4) {
          var halfGap = [0, 0.12, 0.24, 0.38][open] || 0.2;
          light.x += light.vx * dt * 0.08 * (1 + open * 0.4);
          light.y += light.vy * dt * 0.08 * (1 + open * 0.4);
          if (light.x < 0.5 - halfGap) { light.x = 0.5 - halfGap; light.vx = Math.abs(light.vx); }
          if (light.x > 0.5 + halfGap) { light.x = 0.5 + halfGap; light.vx = -Math.abs(light.vx); }
          if (light.y < 0.2 || light.y > 0.8) light.vy *= -1;
        }
        draw();
      });

      stdControls([{ label: '🔦 Sneak a peek', cls: 'butter', on: m.main }]);
      draw();
    };

    m.main = function () {
      if (S.phase !== 'play') return;
      if (open >= 3) { answer(); return; }
      open++;
      Kit.sound('creak');
      var shiftPct = [0, 12, 24, 38][open];
      m.leftW.style.transform = 'translateX(-' + shiftPct + '%)';
      m.rightW.style.transform = 'translateX(' + shiftPct + '%)';
      setWorth(10 - open * 2);
      if (open >= 3 && ui.ctrl.firstChild) ui.ctrl.firstChild.textContent = '🚪 Open Doors!';
    };

    m.reveal = function () {
      open = 4;
      m.leftW.style.transform = 'rotateY(-112deg)';
      m.rightW.style.transform = 'rotateY(112deg)';
      m.bg.g.clearRect(0, 0, m.iw, m.ih);
      m.bg.g.drawImage(m.pic, 0, 0, m.iw, m.ih);
    };
    m.destroy = function () {};
    m.demo = function () {
      later(function () { caption(2, 'Sneak a spotlight peek!'); m.main(); }, 850);
      later(m.main, 2200);
      later(function () { caption(3, 'Open the doors & guess!'); answer(); }, 3700);
    };
    return m;
  };

  /* ---------- 2. 📸 SNAP CAMERAS (4 Kawaii Animal Cameras + Polaroid Clue Tray + Candy Choices) ---------- */
  var CAM_TOYS = [
    { name: 'Bunny Cam', img: 'assets/games/reveal/cam_bunny.webp', c: '#ff85b3' },
    { name: 'Froggy Cam', img: 'assets/games/reveal/cam_frog.webp',  c: '#4cd6ad' },
    { name: 'Teddy Cam',  img: 'assets/games/reveal/cam_bear.webp',  c: '#d99559' },
    { name: 'Ducky Cam',  img: 'assets/games/reveal/cam_duck.webp',  c: '#f5be41' }
  ];
  MODES.camera = function () {
    var m = {}, shots = 0, regions = [], done = false;
    m.init = function (card, pic, sz) {
      m.pic = pic; m.sz = sz; m.card = card;
      var studio = el('div', { class: 'cam-studio' });
      var clueTray = el('div', { class: 'cam-clue-tray' });
      var promptPill = el('div', { class: 'cam-prompt-pill', text: '📸 Tap a camera to snap a clue!' });
      studio.appendChild(el('div', { class: 'cam-strip-bar' }, [promptPill, clueTray]));

      var cams = el('div', { class: 'cams' });
      regions = Kit.shuffle([[0.28, 0.3], [0.72, 0.3], [0.28, 0.7], [0.72, 0.7]]);
      CAM_TOYS.forEach(function (spec, i) {
        var cam = el('button', {
          type: 'button',
          class: 'cam-toy',
          style: { '--cc': spec.c },
          'aria-label': spec.name + ' (' + (i + 1) + ')',
          onclick: function () { snap(i); }
        }, [
          el('img', { src: Kit.src(spec.img), alt: spec.name }),
          el('span', { class: 'cam-pedestal', text: (i + 1) + ' · ' + spec.name })
        ]);
        cams.appendChild(cam);
      });
      studio.appendChild(cams);

      var useChoices = (S.opts.answerMode || 'choices') === 'choices';
      if (useChoices && S.set.cards.length >= 4) {
        var cc = buildCandyChoices(card, function () {
          if (done) return;
          done = true;
          Kit.sound('correct');
          var teamIdx = S.teamsData.length ? S.turn : null;
          later(function () { answer(teamIdx); }, 420);
        }, function () {
          Kit.sound('soft');
          setWorth(S.worth - 2);
          if (S.teamsData.length) { advanceTurn(); drawTeams(); Kit.toast('Next turn: ' + S.teamsData[S.turn].name, 1100); }
        });
        studio.appendChild(cc.row);
        m.choices = cc;
      } else {
        studio.appendChild(el('div'));
      }

      ui.stage.appendChild(studio);
      m.studio = studio; m.cams = cams; m.clueTray = clueTray;
      m.big = el('div', { class: 'cam-big hidden', onclick: function () { hideBig(); } });
      ui.stage.appendChild(m.big);

      stdControls([{ label: '📸 Snap Next Camera!', cls: 'butter', on: m.main }]);
      Kit.keys({ 1: function () { snap(0); }, 2: function () { snap(1); }, 3: function () { snap(2); }, 4: function () { snap(3); } });
    };

    function hideBig() {
      if (m.big.classList.contains('hidden')) return;
      m.big.classList.add('out');
      later(function () { m.big.classList.add('hidden'); m.big.classList.remove('in', 'out'); m.busy = false; }, 300);
    }

    function showPolaroid(cropCanvas, label) {
      var clone = doc.createElement('canvas');
      clone.width = cropCanvas.width; clone.height = cropCanvas.height;
      clone.getContext('2d').drawImage(cropCanvas, 0, 0);
      m.big.innerHTML = '';
      m.big.appendChild(el('div', { class: 'polaroid' }, [clone, el('span', { text: label + ' · Tap to close' })]));
      m.big.classList.remove('hidden', 'out'); m.big.classList.add('in');
    }

    function snap(i) {
      if (S.phase !== 'play' || m.busy || done) return;
      var cam = m.cams.children[i]; if (!cam) return;
      m.busy = true;
      var firstShot = !cam.classList.contains('used');
      if (firstShot) shots++;
      cam.classList.add('shot', 'used');
      Kit.sound('shutter');
      var flash = el('div', { class: 'flash' }); ui.stage.appendChild(flash); later(function () { flash.remove(); }, 540);

      var rg = regions[i % 4], sz = m.sz, zw = sz.w * 0.38, zh = sz.h * 0.38;
      var cx = sz.w * rg[0], cy = sz.h * rg[1];
      var crop = canvasFor(sz.w * 0.56, sz.h * 0.56); crop.c.className = '';
      crop.g.drawImage(m.pic, (cx - zw / 2) * DPR, (cy - zh / 2) * DPR, zw * DPR, zh * DPR, 0, 0, sz.w * 0.56, sz.h * 0.56);

      var label = CAM_TOYS[i].name + ' #' + (i + 1);
      showPolaroid(crop.c, label);

      if (firstShot) {
        setWorth(10 - (shots - 1) * 2);
        var thumbCanvas = doc.createElement('canvas');
        thumbCanvas.width = 112; thumbCanvas.height = 96;
        thumbCanvas.getContext('2d').drawImage(crop.c, 0, 0, 112, 96);
        var mini = el('div', {
          class: 'mini-pola',
          title: 'Click to view ' + label + ' again',
          onclick: function () { Kit.sound('tap'); showPolaroid(crop.c, label); }
        }, [thumbCanvas, el('b', { text: '#' + (i + 1) })]);
        m.clueTray.appendChild(mini);
      }

      later(function () { cam.classList.remove('shot'); hideBig(); }, Kit.preview ? 1150 : 1650);
    }

    m.main = function () {
      var free = Array.prototype.map.call(m.cams.children, function (c, i) { return c.classList.contains('used') ? -1 : i; }).filter(function (i) { return i >= 0; });
      snap(free.length ? free[0] : Math.floor(Math.random() * 4));
    };
    m.reveal = function () {
      done = true;
      m.studio.classList.add('away');
      m.big.classList.add('hidden');
      var c = canvasFor(m.sz.w, m.sz.h); c.g.drawImage(m.pic, 0, 0, m.sz.w, m.sz.h); c.c.classList.add('full-reveal'); ui.stage.appendChild(c.c);
    };
    m.destroy = function () { Kit.clearKeys(['1', '2', '3', '4']); };
    m.demo = function () {
      caption(1, 'Tap a cute animal camera');
      later(function () { caption(2, 'Snap! Inspect the Polaroid clue'); m.main(); }, 950);
      later(m.main, 2600);
      later(function () {
        caption(3, 'Pick the right answer!');
        if (m.choices) {
          var rightIdx = m.choices.opts.indexOf(m.card.w);
          m.choices.pick(rightIdx >= 0 ? rightIdx : 0);
        } else {
          answer();
        }
      }, 4300);
    };
    return m;
  };

  /* ---------- 3. 🧩 ORBIT PUZZLE (Cosmic Starfield + True Interlocking Jigsaw Tabs + 8 Motion Styles) ---------- */
  function traceJigsawEdge(ctx, x0, y0, x1, y1, tabSign) {
    if (!tabSign) { ctx.lineTo(x1, y1); return; }
    var dx = x1 - x0, dy = y1 - y0;
    var nx = -dy * tabSign, ny = dx * tabSign;
    function pt(along, out) { return [x0 + dx * along + nx * out, y0 + dy * along + ny * out]; }
    var p1 = pt(0.35, 0), p2 = pt(0.32, 0.16), p3 = pt(0.38, 0.25), p4 = pt(0.5, 0.25),
        p5 = pt(0.62, 0.25), p6 = pt(0.68, 0.16), p7 = pt(0.65, 0);
    ctx.lineTo(p1[0], p1[1]);
    ctx.bezierCurveTo(p2[0], p2[1], p3[0], p3[1], p4[0], p4[1]);
    ctx.bezierCurveTo(p5[0], p5[1], p6[0], p6[1], p7[0], p7[1]);
    ctx.lineTo(x1, y1);
  }

  function makeJigsawPieceCanvas(picCanvas, sz, cIdx, rIdx, cols, rows, tabs, bx, by, bw, bh) {
    var cw = bw / cols, ch = bh / rows;
    var padX = cw * 0.34, padY = ch * 0.34;
    var pw = Math.ceil(cw + padX * 2), ph = Math.ceil(ch + padY * 2);
    var cv = doc.createElement('canvas');
    cv.width = Math.round(pw * DPR); cv.height = Math.round(ph * DPR);
    cv.style.width = pw + 'px'; cv.style.height = ph + 'px';
    var g = cv.getContext('2d'); g.scale(DPR, DPR);

    var ox = padX, oy = padY;
    g.beginPath();
    g.moveTo(ox, oy);
    traceJigsawEdge(g, ox, oy, ox + cw, oy, tabs.top);
    traceJigsawEdge(g, ox + cw, oy, ox + cw, oy + ch, tabs.right);
    traceJigsawEdge(g, ox + cw, oy + ch, ox, oy + ch, tabs.bottom);
    traceJigsawEdge(g, ox, oy + ch, ox, oy, tabs.left);
    g.closePath();

    g.save();
    g.clip();
    var srcX = (bx + cIdx * cw - padX) * (picCanvas.width / sz.w);
    var srcY = (by + rIdx * ch - padY) * (picCanvas.height / sz.h);
    var srcW = pw * (picCanvas.width / sz.w);
    var srcH = ph * (picCanvas.height / sz.h);
    g.drawImage(picCanvas, srcX, srcY, srcW, srcH, 0, 0, pw, ph);
    g.restore();

    g.strokeStyle = 'rgba(255, 255, 255, .92)';
    g.lineWidth = 2.4;
    g.stroke();

    return { canvas: cv, pw: pw, ph: ph, padX: padX, padY: padY, targetX: bx + cIdx * cw - padX, targetY: by + rIdx * ch - padY };
  }

  var ORBIT_STYLES = ['ring', 'galaxy', 'wave', 'drift', 'parade', 'bubbles', 'bounce'];
  MODES.orbit = function () {
    var m = {}, pieces = [], placed = 0, spin = 0;
    var n = +S.opts.pieces || 12;
    var grid = n === 6 ? [3, 2] : n === 9 ? [3, 3] : n === 16 ? [4, 4] : n === 24 ? [6, 4] : [4, 3];
    var activeStyle = S.opts.style === 'mix' ? ORBIT_STYLES[S.round % ORBIT_STYLES.length] : (S.opts.style || 'ring');

    m.init = function (card, pic, sz) {
      /* Animated Cosmic Starfield Layer */
      var starLayer = canvasFor(sz.w, sz.h);
      ui.stage.appendChild(starLayer.c);
      var stars = [];
      for (var si = 0; si < 75; si++) {
        stars.push({ x: Math.random() * sz.w, y: Math.random() * sz.h, r: 0.7 + Math.random() * 1.9, ph: Math.random() * 6.28 });
      }

      /* Live Top Motion HUD (EasyPeasy Picture Puzzle style!) */
      if (!Kit.preview) {
        var modeSel = el('select', { 'aria-label': 'Motion mode' });
        [
          ['ring', '💫 3D Ring'], ['galaxy', '🌌 Galaxy Spiral'], ['wave', '🌊 Wave Dance'],
          ['drift', '✨ Star Drift'], ['parade', '🎠 Piece Parade'], ['bubbles', '🫧 Bubble Rise'],
          ['bounce', '🎈 Bounce Party'], ['mix', '🎲 Mixed · Auto']
        ].forEach(function (opt) {
          var o = el('option', { value: opt[0], text: opt[1] });
          if ((S.opts.style || 'ring') === opt[0]) o.selected = true;
          modeSel.appendChild(o);
        });
        modeSel.addEventListener('change', function () {
          S.opts.style = modeSel.value; saveOpts();
          activeStyle = modeSel.value === 'mix' ? ORBIT_STYLES[S.round % ORBIT_STYLES.length] : modeSel.value;
        });

        var spVal = el('span', { text: (+(S.opts.speed || 1)).toFixed(1) + '×' });
        var spRange = el('input', { type: 'range', min: 4, max: 22, value: Math.round((S.opts.speed || 1) * 10), 'aria-label': 'Motion speed' });
        spRange.addEventListener('input', function () {
          S.opts.speed = (+spRange.value) / 10;
          spVal.textContent = S.opts.speed.toFixed(1) + '×';
          saveOpts();
        });

        var hud = el('div', { class: 'orbit-hud' }, [
          el('div', { class: 'orbit-pill' }, ['Mode:', modeSel]),
          el('div', { class: 'orbit-pill' }, ['Speed:', spRange, spVal])
        ]);
        ui.stage.appendChild(hud);
      }

      var bx = sz.w * 0.14, by = sz.h * 0.12, bw = sz.w * 0.72, bh = sz.h * 0.79;
      var board = el('div', { class: 'orbit-board' + (S.opts.framed !== false ? ' framed' : '') });
      ui.stage.appendChild(board);
      m.board = board;

      var arena = el('div', { class: 'orbit-arena' });
      var ring = el('div', { class: 'orbit-ring' });
      arena.appendChild(ring); ui.stage.appendChild(arena);

      /* Generate matching interlocking tab matrix */
      var cols = grid[0], rows = grid[1];
      var hTabs = [], vTabs = [];
      for (var r = 0; r < rows; r++) {
        hTabs[r] = [];
        for (var c = 0; c < cols - 1; c++) hTabs[r][c] = Math.random() < 0.5 ? 1 : -1;
      }
      for (var r2 = 0; r2 < rows - 1; r2++) {
        vTabs[r2] = [];
        for (var c2 = 0; c2 < cols; c2++) vTabs[r2][c2] = Math.random() < 0.5 ? 1 : -1;
      }

      var fullBoardPic = doc.createElement('canvas');
      fullBoardPic.width = pic.width; fullBoardPic.height = pic.height;
      var fbg = fullBoardPic.getContext('2d');
      fbg.drawImage(pic, 0, 0, pic.width, pic.height, bx * DPR, by * DPR, bw * DPR, bh * DPR);

      var order = [];
      for (var ry = 0; ry < rows; ry++) for (var cx = 0; cx < cols; cx++) order.push({ c: cx, r: ry });
      order = Kit.shuffle(order);

      order.forEach(function (s, idx) {
        var tabs = {
          top: s.r === 0 ? 0 : -vTabs[s.r - 1][s.c],
          right: s.c === cols - 1 ? 0 : hTabs[s.r][s.c],
          bottom: s.r === rows - 1 ? 0 : vTabs[s.r][s.c],
          left: s.c === 0 ? 0 : -hTabs[s.r][s.c - 1]
        };
        var jp = makeJigsawPieceCanvas(fullBoardPic, sz, s.c, s.r, cols, rows, tabs, bx, by, bw, bh);
        jp.canvas.className = 'jigsaw-piece';
        ring.appendChild(jp.canvas);
        pieces.push({
          node: jp.canvas, pw: jp.pw, ph: jp.ph,
          tx: jp.targetX, ty: jp.targetY,
          ph: Math.random() * 6.283,
          bx: (0.15 + Math.random() * 0.7) * (sz.w - jp.pw),
          by: (0.16 + Math.random() * 0.68) * (sz.h - jp.ph),
          vx: (Math.random() < 0.5 ? -1 : 1) * (0.09 + Math.random() * 0.08),
          vy: (Math.random() < 0.5 ? -1 : 1) * (0.08 + Math.random() * 0.08),
          i: idx, placed: false
        });
      });

      var totalN = pieces.length;
      loop(function (dt, t) {
        /* Draw twinkling cosmic starfield */
        var sg = starLayer.g;
        sg.clearRect(0, 0, sz.w, sz.h);
        stars.forEach(function (st) {
          sg.globalAlpha = 0.35 + 0.6 * (0.5 + 0.5 * Math.sin(t * 0.0024 + st.ph));
          sg.fillStyle = '#e0fbff';
          sg.beginPath(); sg.arc(st.x, st.y, st.r, 0, 6.283); sg.fill();
        });
        sg.globalAlpha = 1;

        var spd = S.opts.speed || 1;
        spin += dt * 0.00038 * spd;
        var live = pieces.filter(function (p) { return !p.placed; }), k = live.length;
        live.forEach(function (p, j) {
          var a = spin * 6.283 + (j / Math.max(1, k)) * 6.283, x, y, z = 0, sc = 0.72, rotDeg = 0;
          if (activeStyle === 'galaxy') {
            var rad = (0.16 + 0.26 * ((j % 3) / 2)) * Math.min(sz.w, sz.h);
            x = sz.w / 2 + Math.cos(a * (1 + (j % 3) * 0.25)) * rad * 1.28 - p.pw / 2;
            y = sz.h / 2 + Math.sin(a * (1 + (j % 3) * 0.25)) * rad * 0.72 - p.ph / 2;
            sc = 0.66 + 0.16 * Math.sin(a);
            rotDeg = (a * 45) % 360;
            p.node.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) scale(' + sc + ') rotate(' + rotDeg + 'deg)';
            p.node.style.zIndex = 20; p.node.style.opacity = 0.92;
            return;
          }
          if (activeStyle === 'parade') {
            var px = ((j / Math.max(1, k) + spin * 0.9) % 1) * (sz.w + p.pw) - p.pw;
            var py = sz.h * (0.25 + 0.5 * ((j % 3) / 2)) + Math.sin(t * 0.004 + p.ph) * 16 - p.ph / 2;
            p.node.style.transform = 'translate3d(' + px + 'px,' + py + 'px,0) scale(.72)';
            p.node.style.zIndex = 20; p.node.style.opacity = 0.94;
            return;
          }
          if (activeStyle === 'bubbles') {
            var bx2 = (0.12 + 0.76 * ((j * 0.37 + 0.19) % 1)) * sz.w - p.pw / 2 + Math.sin(t * 0.002 + p.ph) * 24;
            var by2 = sz.h - (((t * 0.06 * spd + j * 95) % (sz.h + p.ph))) ;
            p.node.style.transform = 'translate3d(' + bx2 + 'px,' + by2 + 'px,0) scale(.7) rotate(' + (Math.sin(t * 0.002 + p.ph) * 10) + 'deg)';
            p.node.style.zIndex = 20; p.node.style.opacity = 0.9;
            return;
          }
          if (activeStyle === 'bounce') {
            p.bx += p.vx * dt * spd; p.by += p.vy * dt * spd;
            if (p.bx < 12 || p.bx > sz.w - p.pw - 12) p.vx *= -1;
            if (p.by < 44 || p.by > sz.h - p.ph - 12) p.vy *= -1;
            p.node.style.transform = 'translate3d(' + p.bx + 'px,' + p.by + 'px,0) scale(.72)';
            p.node.style.zIndex = 20; p.node.style.opacity = 0.94;
            return;
          }
          if (activeStyle === 'drift') {
            x = (0.14 + 0.72 * (0.5 + 0.5 * Math.sin(t * 0.00038 * spd + p.ph * 2.7))) * sz.w - p.pw / 2;
            y = (0.18 + 0.66 * (0.5 + 0.5 * Math.cos(t * 0.00031 * spd + p.ph * 1.9))) * sz.h - p.ph / 2;
            p.node.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) scale(.72) rotate(' + (Math.sin(t * 0.0012 + p.ph) * 14) + 'deg)';
            p.node.style.zIndex = 20; p.node.style.opacity = 0.92;
            return;
          }
          /* Default: True 3D Ring or Wave Dance */
          x = Math.cos(a) * sz.w * 0.37; z = Math.sin(a);
          y = activeStyle === 'wave' ? Math.sin(a * 2 + t * 0.0025) * sz.h * 0.17 : Math.sin(a) * sz.h * 0.085;
          sc = 0.58 + (z + 1) * 0.22;
          p.node.style.transform = 'translate3d(' + (sz.w / 2 + x - p.pw / 2) + 'px,' + (sz.h / 2 + y - p.ph / 2) + 'px,0) scale(' + sc + ') rotateY(' + (-a * 57 + 90) + 'deg)';
          p.node.style.zIndex = Math.round(10 + (z + 1) * 40);
          p.node.style.opacity = 0.58 + (z + 1) * 0.21;
        });
      });

      stdControls([
        { label: '🧩 Place 1 piece', cls: 'sky', on: m.main },
        { label: '⏩ Place all', cls: 'soft sm', on: function () { placeAll(); } },
        { label: '⏸ Pause', cls: 'soft sm', title: 'Pause / play motion (K)', on: function (e) { paused = !paused; e.currentTarget.textContent = paused ? '▶ Play' : '⏸ Pause'; } }
      ]);

      function placeOne(p) {
        p.placed = true; placed++;
        p.node.classList.add('placed');
        p.node.style.transition = 'transform .52s cubic-bezier(.25, 1.35, .5, 1), opacity .25s';
        p.node.style.transform = 'translate3d(' + p.tx + 'px,' + p.ty + 'px,0) scale(1) rotate(0deg)';
        p.node.style.opacity = 1;
        Kit.sound('jigsaw');
      }

      function placeAll() {
        var live = pieces.filter(function (p) { return !p.placed; });
        live.forEach(function (p, i) { later(function () { placeOne(p); }, i * 65); });
        later(function () { answer(); }, live.length * 65 + 320);
      }

      m.main = function () {
        if (S.phase !== 'play') return;
        var live = pieces.filter(function (p) { return !p.placed; });
        if (!live.length) return;
        var p = live[Math.floor(Math.random() * live.length)];
        placeOne(p);
        setWorth(10 - (placed / totalN) * 8.5);
        if (placed >= totalN) later(function () { answer(); }, 540);
      };
    };

    m.reveal = function () {
      pieces.forEach(function (p) {
        if (!p.placed) {
          p.placed = true;
          p.node.classList.add('placed');
          p.node.style.transition = 'transform .42s ease-out, opacity .2s';
          p.node.style.transform = 'translate3d(' + p.tx + 'px,' + p.ty + 'px,0) scale(1)';
          p.node.style.opacity = 1;
        }
      });
      if (m.board) m.board.classList.add('done');
    };
    m.destroy = function () {};
    m.demo = function () {
      caption(1, 'Jigsaw pieces orbit in 3D space');
      later(function () { caption(2, 'Snap pieces into place'); m.main(); }, 1100);
      later(m.main, 1750); later(m.main, 2400); later(m.main, 3050);
      later(function () { caption(3, 'Guess the picture!'); answer(); }, 4100);
    };
    return m;
  };

  /* ---------- 4. 🧱 BRICK BLAST (Sunny Courtyard + Studded Candy Bricks + Star Mallet Bonk) ---------- */
  var BRICK_PAL = [
    ['#ff9ebb', '#df6d92', '#ffc7da'],
    ['#8de6cb', '#56be9f', '#bcf5e3'],
    ['#95d1ff', '#5ba6e0', '#c4e6ff'],
    ['#ffe082', '#dfb23b', '#fff0ba'],
    ['#c9b2ff', '#987be0', '#e3d6ff']
  ];
  MODES.bricks = function () {
    var m = {}, bricks = [], gone = 0;
    m.init = function (card, pic, sz) {
      ui.stage.appendChild(el('img', { class: 'bricks-bg', src: Kit.src('assets/games/reveal/bg_sunny_courtyard.webp'), alt: '' }));
      var frame = el('div', { class: 'bricks-frame' });
      var fw = Math.round(sz.w * 0.84), fh = Math.round(sz.h * 0.9);
      var c = canvasFor(fw, fh); c.g.drawImage(pic, 0, 0, fw, fh);
      frame.appendChild(c.c);
      var wall = el('div', { class: 'wall' }); frame.appendChild(wall);
      ui.stage.appendChild(frame);
      m.wall = wall;

      var cols = S.opts.size === 'big' ? 5 : S.opts.size === 'small' ? 8 : 6, rows = Math.round(cols * 0.78);
      var bw = fw / cols, bh = fh / rows;
      for (var r = 0; r < rows; r++) {
        var off = r % 2 ? -bw / 2 : 0;
        for (var k = 0; k < cols + (r % 2 ? 1 : 0); k++) {
          var x = k * bw + off, w = bw;
          if (x < 0) { w += x; x = 0; }
          if (x + w > fw) w = fw - x;
          if (w < 8) continue;
          var pal = BRICK_PAL[(r * 3 + k) % BRICK_PAL.length];
          var b = el('button', {
            type: 'button', class: 'brick', 'aria-label': 'Candy brick',
            style: { left: (x + 1.5) + 'px', top: (r * bh + 1.5) + 'px', width: (w - 3) + 'px', height: (bh - 3) + 'px', '--bc': pal[0], '--bd': pal[1], '--bl': pal[2] }
          });
          (function (b, baseCol) { b.addEventListener('click', function () { hit(b, baseCol, true); }); })(b, pal[0]);
          wall.appendChild(b); bricks.push({ node: b, col: pal[0] });
        }
      }
      stdControls([{ label: '⭐ Star Mallet Blast (×3)', cls: 'peach', on: m.main }]);
    };

    function spawnMallet(cx, cy) {
      var ml = el('img', {
        class: 'mallet-swing',
        src: Kit.src('assets/games/reveal/prop_star_mallet.webp'),
        alt: '',
        style: { left: cx + 'px', top: cy + 'px' }
      });
      doc.body.appendChild(ml);
      setTimeout(function () { ml.remove(); }, 400);
    }

    function hit(b, col, showMallet) {
      if (S.phase !== 'play' || b.classList.contains('gone')) return;
      b.classList.add('gone'); gone++;
      Kit.sound('smash');
      var r = b.getBoundingClientRect();
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      if (showMallet && !Kit.preview) spawnMallet(cx, cy);
      for (var i = 0; i < 6; i++) {
        var d = el('i', {
          class: 'chunk',
          style: {
            left: cx + 'px', top: cy + 'px', background: col || '#ff9ebb',
            '--dx': ((Math.random() - 0.5) * 180) + 'px',
            '--dy': (55 + Math.random() * 130) + 'px',
            '--rot': (Math.random() * 360) + 'deg'
          }
        });
        doc.body.appendChild(d);
        (function (d) { setTimeout(function () { d.remove(); }, 780); })(d);
      }
      setWorth(10 - (gone / bricks.length) * 10);
    }

    m.main = function () {
      var left = bricks.filter(function (x) { return !x.node.classList.contains('gone'); });
      Kit.shuffle(left).slice(0, 3).forEach(function (x, i) { later(function () { hit(x.node, x.col, i === 0); }, i * 130); });
    };
    m.reveal = function () {
      bricks.forEach(function (x, i) { if (!x.node.classList.contains('gone')) later(function () { x.node.classList.add('gone'); }, (i % 12) * 24); });
    };
    m.destroy = function () {};
    m.demo = function () {
      caption(1, 'Swing the Star Mallet!');
      later(function () { caption(2, 'Pop holes in the candy wall'); m.main(); }, 950);
      later(m.main, 1850); later(m.main, 2750);
      later(function () { caption(3, 'Guess what\'s hiding behind!'); answer(); }, 4050);
    };
    return m;
  };

  /* ---------- 5. 🔤 LETTER TILES (3D Candy Alphabet Tiles + Letter Speech) ---------- */
  var TILE_PAL = [
    ['#ff8ec0', '#d9548e'], ['#a992ff', '#7b60e0'], ['#5fdcb7', '#2da884'],
    ['#6ec2ff', '#3a8fd1'], ['#ffd56b', '#d9a326'], ['#ffa985', '#de764b']
  ];
  MODES.tiles = function () {
    var m = {}, tiles = [], gone = 0, count = +S.opts.count || 20;
    m.init = function (card, pic, sz) {
      var frame = el('div', { class: 'tiles-frame' });
      var fw = Math.round(sz.w * 0.86), fh = Math.round(sz.h * 0.92);
      var c = canvasFor(fw, fh); c.g.drawImage(pic, 0, 0, fw, fh);
      frame.appendChild(c.c);
      var cols = count === 12 ? 4 : count === 24 ? 6 : 5, rows = count / cols, tw = fw / cols, th = fh / rows;
      var box = el('div', { class: 'tiles' }); frame.appendChild(box);
      ui.stage.appendChild(frame);

      for (var i = 0; i < count; i++) {
        var L = String.fromCharCode(65 + i);
        var pal = TILE_PAL[(i + Math.floor(i / cols)) % TILE_PAL.length];
        var t = el('button', {
          type: 'button', class: 'tile', 'aria-label': 'Letter ' + L,
          style: { left: (i % cols) * tw + 'px', top: Math.floor(i / cols) * th + 'px', width: tw + 'px', height: th + 'px', '--tc': pal[0], '--td': pal[1], animationDelay: (i * 0.025) + 's' }
        }, [el('span', { text: L })]);
        (function (t, letter) { t.addEventListener('click', function () { lift(t, letter); }); })(t, L);
        box.appendChild(t); tiles.push({ node: t, letter: L });
      }
      var keys = {};
      tiles.forEach(function (it, i) { keys[String.fromCharCode(97 + i)] = function () { lift(it.node, it.letter); }; });
      m.pop = Kit.overlayKeys(keys);
      stdControls([{ label: '🎲 Pop random letter', cls: 'mint', on: m.main }]);
    };

    function lift(t, letter) {
      if (S.phase !== 'play' || t.classList.contains('gone')) return;
      t.classList.add('gone'); gone++;
      Kit.sound('tilepop');
      if (S.opts.sayLetter !== false && letter && !Kit.preview) Kit.say(letter);
      var rc = Kit.centerOf(t);
      Kit.confetti(rc.x, rc.y, 14);
      setWorth(10 - (gone / tiles.length) * 9.5);
    }

    m.main = function () {
      var left = tiles.filter(function (it) { return !it.node.classList.contains('gone'); });
      if (left.length) {
        var pick = left[Math.floor(Math.random() * left.length)];
        lift(pick.node, pick.letter);
      }
    };
    m.reveal = function () { if (m.pop) m.pop(); tiles.forEach(function (it, i) { later(function () { it.node.classList.add('gone'); }, i * 18); }); };
    m.destroy = function () { if (m.pop) m.pop(); };
    m.demo = function () {
      caption(1, 'Call out a letter A–T');
      later(function () { caption(2, 'That candy tile pops away!'); m.main(); }, 950);
      later(m.main, 1550); later(m.main, 2150); later(m.main, 2750);
      later(function () { caption(3, 'Guess the hidden picture!'); answer(); }, 3900);
    };
    return m;
  };

  /* ---------- 6. 🟪 PIXEL QUIZ (Pastel Arcade Screen + Candy Choices + 50/50 Hint) ---------- */
  MODES.pixels = function () {
    var m = {}, prog = 0, done = false;
    var dur = S.opts.speed === 'slow' ? 25000 : S.opts.speed === 'fast' ? 11000 : 17000;
    m.init = function (card, pic, sz) {
      m.pic = pic; m.sz = sz; m.card = card;
      var cab = el('div', { class: 'pix-cabinet' });
      var bar = el('div', { class: 'pix-bar' }, [el('i')]);
      var topRow = el('div', { class: 'pix-top' }, [
        el('span', { style: { fontWeight: 900, fontSize: '.86em' }, text: '✨ Sharpening' }),
        bar
      ]);
      cab.appendChild(topRow);

      var screenWrap = el('div', { class: 'pix-screen-wrap' });
      var sw = Math.round(sz.w * 0.92), sh = Math.round(sz.h * 0.68);
      var c = canvasFor(sw, sh);
      screenWrap.appendChild(c.c);
      cab.appendChild(screenWrap);
      m.c = c; m.sw = sw; m.sh = sh; m.bar = bar.firstChild;

      var cc = buildCandyChoices(card, function () {
        if (done) return;
        done = true;
        Kit.sound('correct');
        var teamIdx = S.teamsData.length ? S.turn : null;
        later(function () { answer(teamIdx); }, 450);
      }, function () {
        Kit.sound('soft');
        if (S.teamsData.length) { advanceTurn(); drawTeams(); Kit.toast('Next turn: ' + S.teamsData[S.turn].name, 1100); }
      });
      cab.appendChild(cc.row);
      ui.stage.appendChild(cab);
      m.choices = cc;

      var small = doc.createElement('canvas'), sg = small.getContext('2d');
      function draw() {
        var cells = Math.round(6 + Math.pow(prog, 2.15) * 115);
        small.width = cells; small.height = Math.max(4, Math.round(cells * sh / sw));
        sg.drawImage(pic, 0, 0, small.width, small.height);
        c.g.imageSmoothingEnabled = false;
        c.g.clearRect(0, 0, sw, sh);
        c.g.drawImage(small, 0, 0, sw, sh);
      }
      m.draw = draw; draw();

      var used50 = false;
      controls([
        {
          label: '✨ 50 / 50 Hint', cls: 'butter sm',
          on: function (e) {
            if (used50 || done) return;
            used50 = true; e.currentTarget.disabled = true;
            var wrongs = cc.opts.map(function (w, idx) { return w === card.w ? -1 : idx; }).filter(function (i) { return i >= 0; });
            Kit.shuffle(wrongs).slice(0, 2).forEach(function (idx) { cc.nodes[idx].classList.add('wrong'); });
            Kit.sound('pop'); setWorth(S.worth - 2);
          }
        },
        { label: '👁 Show Answer', cls: 'lilac sm', key: 'answer', on: function () { answer(); } },
        { label: 'Skip →', cls: 'soft sm', key: 'next', on: function () { nextRound(); } }
      ]);

      var keys = {};
      cc.opts.forEach(function (w, i) { keys[String(i + 1)] = function () { cc.pick(i); }; });
      Kit.keys(keys);

      loop(function (dt) {
        if (done) return;
        prog = Math.min(1, prog + dt / dur);
        draw();
        m.bar.style.width = (prog * 100) + '%';
        var v = Math.max(2, Math.round(10 - prog * 8));
        if (v !== S.worth) setWorth(v);
        if (prog >= 1) { done = true; answer(); }
      });
    };

    m.reveal = function () {
      done = true; prog = 1;
      m.c.g.imageSmoothingEnabled = true;
      m.c.g.drawImage(m.pic, 0, 0, m.sw, m.sh);
      m.bar.style.width = '100%';
      Kit.clearKeys(['1', '2', '3', '4']);
    };
    m.destroy = function () { Kit.clearKeys(['1', '2', '3', '4']); };
    m.demo = function () {
      caption(1, 'A candy mosaic appears');
      later(function () { caption(2, 'It sharpens second by second'); }, 1400);
      later(function () {
        caption(3, 'Tap the right word early!');
        var i = m.choices.opts.indexOf(m.card.w);
        m.choices.pick(i >= 0 ? i : 0);
      }, 3400);
    };
    return m;
  };

  /* ---------- 7. 🔦 FLASHLIGHT FINDER (Midnight Starry Room + Word/Sentence Clues + Live Pack/Light Dock) ---------- */
  function flashlightRound(startIdx) {
    clearTimers(); if (mode && mode.destroy) mode.destroy();
    var group = S.cards.slice(startIdx, startIdx + G.perRound);
    if (!group.length) return finish();
    S.phase = 'play';
    ui.stage.innerHTML = ''; ui.stage.className = 'stage stage-flashlight';
    var sz = stageSize(), m = mode = {}, found = 0, queue = Kit.shuffle(group);
    var beam = { x: sz.w / 2, y: sz.h * 0.56, tx: sz.w / 2, ty: sz.h * 0.56, user: false };

    var c = canvasFor(sz.w, sz.h); ui.stage.appendChild(c.c);
    var dotsBox = el('div', { class: 'fl-dots' }, group.map(function () { return el('i'); }));
    var flHud = el('div', { class: 'fl-hud' }, [el('span'), dotsBox]);
    ui.stage.appendChild(flHud);
    var clue = el('div', { class: 'clue', title: 'Click to hear clue again' });
    ui.stage.appendChild(clue);

    var stars = [];
    for (var si = 0; si < 48; si++) stars.push({ x: Math.random() * sz.w, y: Math.random() * sz.h, r: 0.8 + Math.random() * 1.6, ph: Math.random() * 6.28 });

    var defaultSlots = layout(group.length, sz);
    Promise.all(group.map(function (card) { return Kit.loadImg(Kit.src(card.img)); })).then(function (imgs) {
      var items = group.map(function (card, i) {
        var box = defaultSlots[i];
        if (card.ax != null && card.ay != null) {
          var baseDim = Math.min(sz.w, sz.h) * 0.22 * (card.asc || 1);
          box = { x: card.ax * sz.w - baseDim / 2, y: card.ay * sz.h - baseDim / 2, w: baseDim, h: baseDim };
        }
        return { card: card, img: imgs[i], box: box, found: false, shake: 0 };
      });
      m.items = items;

      function updateDots() {
        Array.prototype.forEach.call(dotsBox.children, function (d, idx) {
          d.className = idx < found ? 'done' : idx === found ? 'cur' : '';
        });
      }

      function clueTextFor(card) {
        return (S.opts.clueMode === 'sentence' && card.cl) ? card.cl : card.w;
      }

      function nextClue() {
        m.target = queue.filter(function (q) { return !items.filter(function (it) { return it.card === q; })[0].found; })[0];
        if (!m.target) return;
        var txt = clueTextFor(m.target);
        clue.innerHTML = '';
        clue.appendChild(el('b', { text: txt }));
        clue.appendChild(el('span', { text: '🔊' }));
        clue.classList.remove('in'); void clue.offsetWidth; clue.classList.add('in');
        ui.count.innerHTML = '<span>Find</span><b>' + (found + 1) + ' / ' + group.length + '</b>';
        updateDots();
        setWorth(10); m.miss = 0;
        Kit.say(txt);
      }
      clue.addEventListener('click', function () { if (m.target) Kit.say(clueTextFor(m.target)); });

      function draw(t) {
        var g = c.g; g.clearRect(0, 0, sz.w, sz.h);
        /* Cozy twilight room floor + starry wallpaper */
        var bg = g.createLinearGradient(0, 0, 0, sz.h);
        bg.addColorStop(0, '#1f1744'); bg.addColorStop(0.75, '#2d225e'); bg.addColorStop(1, '#3b2c73');
        g.fillStyle = bg; g.fillRect(0, 0, sz.w, sz.h);
        stars.forEach(function (st) {
          g.fillStyle = 'rgba(255,255,255,' + (0.2 + 0.3 * Math.sin(t * 0.002 + st.ph)) + ')';
          g.beginPath(); g.arc(st.x, st.y, st.r, 0, 6.283); g.fill();
        });

        items.forEach(function (it) {
          var b = it.box, sc = Math.min(b.w / it.img.width, b.h / it.img.height), w = it.img.width * sc, h = it.img.height * sc;
          var dx = b.x + (b.w - w) / 2 + (it.shake ? Math.sin(t * 0.09) * it.shake : 0), dy = b.y + (b.h - h) / 2;
          if (it.shake) it.shake = Math.max(0, it.shake - 0.42);
          it.rect = { x: dx, y: dy, w: w, h: h };
          g.save();
          g.fillStyle = 'rgba(0,0,0,.25)';
          g.beginPath(); g.ellipse(dx + w / 2, dy + h * 0.96, w * 0.38, Math.max(5, h * 0.06), 0, 0, 6.283); g.fill();
          g.drawImage(it.img, dx, dy, w, h);
          g.restore();
        });

        var R = (+S.opts.light || 130) * (sz.w / 900);
        var mask = c.mask || (c.mask = doc.createElement('canvas')); mask.width = c.c.width; mask.height = c.c.height;
        var mg = mask.getContext('2d'); mg.setTransform(DPR, 0, 0, DPR, 0, 0);
        mg.clearRect(0, 0, sz.w, sz.h);
        mg.fillStyle = 'rgba(8, 6, 20, .965)';
        mg.fillRect(0, 0, sz.w, sz.h);
        mg.globalCompositeOperation = 'destination-out';

        var rg = mg.createRadialGradient(beam.x, beam.y, R * 0.62, beam.x, beam.y, R);
        rg.addColorStop(0, 'rgba(0,0,0,1)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
        mg.fillStyle = rg; mg.beginPath(); g; mg.arc(beam.x, beam.y, R, 0, 6.283); mg.fill();

        items.forEach(function (it) {
          if (it.found && it.rect) {
            var r = it.rect, cx = r.x + r.w / 2, cy = r.y + r.h / 2, rr = Math.max(r.w, r.h) * 0.66;
            var g2 = mg.createRadialGradient(cx, cy, rr * 0.55, cx, cy, rr);
            g2.addColorStop(0, 'rgba(0,0,0,1)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
            mg.fillStyle = g2; mg.beginPath(); mg.arc(cx, cy, rr, 0, 6.283); mg.fill();
          }
        });
        mg.globalCompositeOperation = 'source-over';
        g.drawImage(mask, 0, 0, sz.w, sz.h);

        /* Warm golden double-ring beam rim */
        g.save();
        g.strokeStyle = 'rgba(255, 214, 130, .92)';
        g.lineWidth = 3.5;
        g.shadowColor = '#ffb36b';
        g.shadowBlur = 22;
        g.beginPath(); g.arc(beam.x, beam.y, R * 0.96, 0, 6.283); g.stroke();
        g.restore();

        items.forEach(function (it) {
          if (it.found && it.rect) {
            var r = it.rect;
            g.save();
            g.font = '900 ' + Math.max(15, r.h * 0.17) + 'px Fredoka, Nunito, sans-serif';
            g.textAlign = 'center'; g.fillStyle = '#fff'; g.strokeStyle = '#5a3ec8'; g.lineWidth = 5;
            var ty = Math.min(sz.h - 10, r.y + r.h + Math.max(16, r.h * 0.14));
            g.strokeText(it.card.w, r.x + r.w / 2, ty);
            g.fillText(it.card.w, r.x + r.w / 2, ty);
            g.restore();
          }
        });
      }

      loop(function (dt, t) {
        if (!beam.user) {
          beam.tx = sz.w * (0.5 + 0.34 * Math.sin(t * 0.00055));
          beam.ty = sz.h * (0.56 + 0.25 * Math.sin(t * 0.00085 + 1));
        }
        beam.x += (beam.tx - beam.x) * 0.22;
        beam.y += (beam.ty - beam.y) * 0.22;
        draw(t);
      });

      function local(e) {
        var r = c.c.getBoundingClientRect();
        return { x: (e.clientX - r.left) * (sz.w / r.width), y: (e.clientY - r.top) * (sz.h / r.height) };
      }
      c.c.addEventListener('pointermove', function (e) { var p = local(e); beam.user = true; beam.tx = p.x; beam.ty = p.y; });
      c.c.addEventListener('pointerdown', function (e) { var p = local(e); beam.user = true; beam.tx = p.x; beam.ty = p.y; tap(p); });

      function tap(p) {
        if (S.phase !== 'play' || !m.target) return;
        var hit = items.filter(function (it) {
          var r = it.rect;
          return !it.found && r && p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
        })[0];
        if (!hit) return;
        if (hit.card === m.target) {
          hit.found = true; found++; updateDots();
          Kit.sound('correct'); Kit.say(hit.card.w);
          var cr = c.c.getBoundingClientRect(), sx = cr.width / sz.w;
          var gx = cr.left + (hit.rect.x + hit.rect.w / 2) * sx, gy = cr.top + (hit.rect.y + hit.rect.h / 2) * sx;
          Kit.confetti(gx, gy, 48);
          if (S.teamsData.length) { Kit.award(ui.teams, S.teamsData, S.turn, S.worth); advanceTurn(); drawTeams(); }
          else { S.classStars += S.worth; drawTeams(); Kit.popText(gx, gy, '+' + S.worth); }
          if (found >= items.length) {
            m.target = null;
            clue.innerHTML = '<b>🌟 Round Complete!</b>';
            later(function () { flashlightRound(startIdx + G.perRound); }, 1650);
          } else {
            later(nextClue, 850);
          }
        } else {
          hit.shake = 9; Kit.sound('soft'); m.miss++; setWorth(10 - m.miss * 2);
        }
      }

      m.main = function () {
        if (!m.target) return;
        var it = items.filter(function (x) { return x.card === m.target; })[0];
        if (!it || !it.rect) return;
        Kit.sound('beam');
        beam.user = true;
        beam.tx = it.rect.x + it.rect.w / 2;
        beam.ty = it.rect.y + it.rect.h / 2;
      };

      /* Live EasyPeasy-style Flashlight Dock: Light Size Slider + Clue Toggle + Pack Switcher + Shuffle + Skip */
      var lightSlider = el('input', { type: 'range', min: 65, max: 220, value: S.opts.light || 130, 'aria-label': 'Light size' });
      lightSlider.addEventListener('input', function () { S.opts.light = +lightSlider.value; saveOpts(); });

      var packSelect = el('select', { class: 'fl-pack-sel', 'aria-label': 'Switch picture pack' });
      (S.allSets.length ? S.allSets : Kit.sets.builtIn()).forEach(function (ps) {
        var op = el('option', { value: ps.id, text: (ps.e ? ps.e + ' ' : '') + ps.name });
        if (ps.id === S.set.id) op.selected = true;
        packSelect.appendChild(op);
      });
      packSelect.addEventListener('change', function () {
        S.setId = packSelect.value; Kit.pref('set', S.setId);
        Kit.sets.get(S.setId).then(function (ns) { if (ns) start(ns); });
      });

      controls([
        { node: el('div', { class: 'fl-slider-pill' }, ['🔦 Light', lightSlider]) },
        {
          label: S.opts.clueMode === 'sentence' ? '💬 Sentence clue' : '🔤 Word clue',
          cls: 'soft sm',
          on: function (e) {
            S.opts.clueMode = S.opts.clueMode === 'sentence' ? 'word' : 'sentence';
            saveOpts();
            e.currentTarget.textContent = S.opts.clueMode === 'sentence' ? '💬 Sentence clue' : '🔤 Word clue';
            if (m.target) {
              var txt = clueTextFor(m.target);
              clue.querySelector('b').textContent = txt;
              Kit.say(txt);
            }
          }
        },
        { node: packSelect },
        {
          label: '🔀 Shuffle', cls: 'soft sm',
          on: function () {
            var newSlots = layout(items.length, sz);
            items.forEach(function (it, idx) { it.box = newSlots[idx]; });
            Kit.sound('whoosh');
          }
        },
        { label: '💡 Hint', cls: 'butter sm', on: function () { m.main(); setWorth(S.worth - 3); } },
        {
          label: 'Skip clue →', cls: 'peach sm', key: 'next',
          on: function () {
            if (!m.target) return;
            var it = items.filter(function (x) { return x.card === m.target; })[0];
            if (it) { it.found = true; found++; updateDots(); }
            if (found >= items.length) { m.target = null; later(function () { flashlightRound(startIdx + G.perRound); }, 550); }
            else nextClue();
          }
        }
      ]);

      nextClue();
      if (Kit.preview) {
        caption(1, 'Read & hear the clue');
        later(function () { caption(2, 'Shine the light in the dark'); }, 1150);
        later(function () { m.main(); }, 2100);
        later(function () {
          caption(3, 'Tap the matching picture!');
          var it = items.filter(function (x) { return x.card === m.target; })[0];
          if (it && it.rect) tap({ x: it.rect.x + it.rect.w / 2, y: it.rect.y + it.rect.h / 2 });
        }, 3350);
        later(function () { start(S.set); }, 5600);
      }
    });
  }

  function layout(n, sz) {
    var cols = n <= 4 ? n : Math.ceil(n / 2), rows = Math.ceil(n / cols), out = [];
    var cw = sz.w / cols, ch = (sz.h * 0.78) / rows;
    for (var i = 0; i < n; i++) {
      var c = i % cols, r = Math.floor(i / cols), s = 0.72 + Math.random() * 0.14;
      var w = cw * s, h = ch * s * 0.88;
      out.push({
        x: c * cw + (cw - w) / 2 + (Math.random() - 0.5) * cw * 0.1,
        y: sz.h * 0.18 + r * ch + (ch - h) / 2 + (Math.random() - 0.5) * ch * 0.06,
        w: w, h: h
      });
    }
    return Kit.shuffle(out);
  }

  /* ======================= Boot ======================= */
  if (Kit.preview) {
    doc.body.classList.add('preview');
    Kit.sets.all().then(function (sets) {
      S.allSets = sets;
      var defaultId = Kit.param('set') || ({ flashlight: 'my-things', bricks: 'dinosaurs', orbit: 'adventure', doors: 'g3-u5-time-book', camera: 'animals', tiles: 'adventure', pixels: 'animals' }[gid] || 'my-things');
      var pick = sets.filter(function (s) { return s.id === defaultId; })[0] || sets[0];
      S.teams = gid === 'flashlight' || gid === 'pixels' ? 2 : 3;
      S.rounds = 3;
      start(pick);
    });
  } else {
    setup();
  }
})(window);
