/* Halloween Monster Pet Shop: smartboard controller (5 stations, team points only on this page: no cloud writes). */
(function (window) {
  'use strict';
  var D = window.PetShopData, A = window.PetAudio;
  var $ = function (id) { return document.getElementById(id); };
  var PET = {}; D.PETS.forEach(function (p) { PET[p.id] = p; });

  var state = { cls: '', grade: 3, step: 0, teams: [], turn: 0, lastSpeech: '', met: {}, done: {} };

  var STATIONS = [
    { title: '1 · Who Is in the Cauldron?', mins: '5 min', sub: 'Listen to 3 clues · Guess the pet', run: stCauldron,
      say: ["It's black.", 'It has got a hat.', 'It can climb.'],
      tips: ['Warm-up: listening only. Nobody has to speak alone.', 'Read clue 1, teams whisper, then tap "Next clue". The team on turn points to a picture; you tap it. Guess after 1 clue = 3 points, after 2 clues = 2, after 3 = 1.', 'A wrong guess is never minus: Luna gives a hint and the same team tries again.'] },
    { title: '2 · Meet the Pets', mins: '7 min', sub: 'Tap a pet · Listen · Say it together · Act it', run: stMeet,
      say: ["It's a ___ ___.", 'It has got ___.', 'It can ___.'],
      tips: ['Tap a pet. Tap each sentence: the class repeats it together (choral, not alone).', 'Colours = amber, "has got" = cyan, "can" = green. Point at the colour code when pupils make the sentence.', 'Press "Act it!" and everyone does the action. Meet 4-5 pets, not all 7, if time is short.'] },
    { title: '3 · Team Pet Lab', mins: '12 min', sub: 'Jobs · Draw · Write 3 sentences · Practise', run: stLab,
      say: ['This is ___.', "It's a ___ ___.", 'It has got ___.', 'It can ___.'],
      tips: ['Give each team 1 Pet Design Card (worksheet.html). Teams choose jobs in 30 seconds: Artist, Writer, Speaker, Timer Boss (5 pupils: 2 Artists).', 'Start the timer. Walk round: help the Writer with the frames, and let the Speaker practise inside the team first.', 'Teams that want help come to the board and build their sentences with the Sentence Builder, then press "Hear our pet".'] },
    { title: '4 · The Pet Shop Is Open!', mins: '13 min', sub: 'Sellers present · Buyers ask · Buy a pet', run: stShop,
      say: ['Hello! Welcome to our pet shop!', 'Can it fly?', 'How much is it?'],
      tips: ['One team at a time: the Speaker shows the card, the whole team says the last line together. Shy pupils can hold the card or point.', 'Other teams are buyers: they ask 1 question from the question cards. Give +1 for a good question.', 'When all teams are done, press "Buy a pet!": each team gets 3 coins to spend on OTHER teams\' pets. Most coins = Best Pet Shop (+3).'] },
    { title: '5 · Awards & Door Pass', mins: '3 min', sub: 'Every team gets an award · 1 sentence at the door', run: stAwards,
      say: ['My favourite pet is the ___.', 'It can ___.'],
      tips: ['Print the Team Speaking Check (plan.html, page 2) and tick it while teams present: it shows you who needs more speaking practice next week.', 'Every team gets an award title. Give the team XP on the Class Board afterwards if you want (this page saves nothing to the cloud).', 'Door pass: each pupil says 1 sentence at the door. Pupils who find it hard can point at a picture and say the pet name.'] }
  ];

  // ------------------------------------------------------------ helpers
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k === 'html') n.innerHTML = v;
      else if (k.indexOf('on') === 0) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function team(i) { return state.teams[((i % state.teams.length) + state.teams.length) % state.teams.length]; }
  function lines(p) { return state.grade === 4 ? p.g4 : p.g3; }
  function art(id) { return 'art/' + id + '.webp'; }

  // colour-code a sentence: colours amber, has got cyan, can green
  var COLOURS = /\b(black|white|orange|purple|green|red|blue|pink|yellow)\b/g;
  function colourise(s) {
    return esc(s)
      .replace(/\b(has got|hasn&#39;t got)\b/g, '<span class="k-has">$1</span>')
      .replace(/\b(can&#39;t|can)\b/g, '<span class="k-can">$1</span>')
      .replace(COLOURS, '<span class="k-col">$1</span>');
  }

  function wobble(node) { if (!node) return; node.classList.remove('wobble'); void node.offsetWidth; node.classList.add('wobble'); }
  function burst(node, icon) {
    if (!node || !node.getBoundingClientRect) return;
    var r = node.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (var i = 0; i < 8; i++) {
      var b = el('div', { class: 'burst', text: icon || (i % 2 ? '⭐' : '🎃') }), ang = (i / 8) * Math.PI * 2;
      b.style.left = cx + 'px'; b.style.top = cy + 'px';
      b.style.setProperty('--dx', Math.cos(ang) * 110 + 'px'); b.style.setProperty('--dy', Math.sin(ang) * 110 + 'px');
      document.body.appendChild(b);
      setTimeout(function (x) { x.remove(); }.bind(null, b), 900);
    }
  }

  // ------------------------------------------------------------ host
  function say(text, speak) {
    state.lastSpeech = text;
    $('host-text').textContent = text;
    if (speak === false) return Promise.resolve();
    var stg = $('host-stage'); stg.classList.add('talking');
    return A.speak(text).then(function () { stg.classList.remove('talking'); });
  }
  function hostReact(kind) {
    var stg = $('host-stage'); stg.classList.remove('cheer', 'oops'); void stg.offsetWidth;
    stg.classList.add(kind); setTimeout(function () { stg.classList.remove(kind); }, 900);
  }

  // ------------------------------------------------------------ teams
  function loadTeams(cls) {
    var list = [];
    try { if (window.AllAboutMeData) list = window.AllAboutMeData.getTeamsForClass('class-' + cls) || []; } catch (e) { list = []; }
    var src = list.length ? list : D.FALLBACK_TEAMS;
    state.teams = src.map(function (t, i) {
      return { name: String(t.name || ('Team ' + (i + 1))), color: t.color || '#a855f7', size: (t.studentIds || []).length || 0, icon: D.TEAM_ICONS[i % D.TEAM_ICONS.length], pts: 0, coins: 0 };
    });
    restore();
  }
  function saveKey() { return 'petshop-' + state.cls + '-' + new Date().toISOString().slice(0, 10); }
  function persist() { try { localStorage.setItem(saveKey(), JSON.stringify(state.teams.map(function (t) { return [t.pts, t.coins]; }))); } catch (e) { /* private mode */ } }
  function restore() {
    try {
      var v = JSON.parse(localStorage.getItem(saveKey()) || 'null');
      if (v && v.length === state.teams.length) v.forEach(function (x, i) { state.teams[i].pts = +x[0] || 0; state.teams[i].coins = +x[1] || 0; });
    } catch (e) { /* ignore */ }
  }
  function addPts(i, n, node) {
    var t = team(i); t.pts = Math.max(0, (t.pts || 0) + n);
    if (n > 0) { A.correct(); burst(node || document.querySelector('[data-team="' + (i % state.teams.length) + '"]')); }
    persist(); renderTeams();
  }
  function renderTeams() {
    var box = $('ps-teams'); box.innerHTML = '';
    state.teams.forEach(function (t, i) {
      box.appendChild(el('div', { class: 'ps-team' + (i === state.turn % state.teams.length ? ' on' : ''), style: '--tc:' + t.color, 'data-team': i }, [
        el('button', { class: 'ps-team-add', type: 'button', title: 'Give 1 point', onclick: function (ev) { addPts(i, 1, ev.currentTarget); } }, [
          el('span', { text: t.icon + ' ' + t.name }), el('b', { text: String(t.pts || 0) })
        ]),
        el('button', { class: 'ps-team-sub', type: 'button', title: 'Take back 1 point', text: '−', onclick: function () { A.tap(); addPts(i, -1); } })
      ]));
    });
  }
  function nextTurn() { state.turn = (state.turn + 1) % state.teams.length; renderTeams(); }
  function turnBanner(text) {
    var t = team(state.turn);
    return el('div', { class: 'turn-banner', style: '--tc:' + t.color }, [el('b', { text: t.icon + ' ' + t.name }), el('span', { text: text })]);
  }

  // ------------------------------------------------------------ steps
  function renderSteps() {
    var box = $('ps-steps'); box.innerHTML = '';
    STATIONS.forEach(function (s, i) {
      box.appendChild(el('button', { class: 'ps-step' + (i === state.step ? ' on' : '') + (state.done[i] ? ' done' : ''), type: 'button', text: String(i + 1), title: s.title, onclick: function () { A.tap(); go(i); } }));
    });
  }
  function renderSay(s) {
    var box = $('ps-say'); box.innerHTML = '';
    box.appendChild(el('span', { class: 'ps-say-tag', text: '🗣️ SAY' }));
    s.say.forEach(function (line) {
      box.appendChild(el('button', { class: 'ps-say-pill', type: 'button', html: '🔊 ' + colourise(line), onclick: function () { A.tap(); say(line); } }));
    });
  }
  var cleanup = [];
  function go(i) {
    cleanup.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } }); cleanup = [];
    if (i > state.step) state.done[state.step] = true;
    state.step = Math.max(0, Math.min(STATIONS.length - 1, i));
    var s = STATIONS[state.step];
    $('st-title').textContent = s.title; $('st-mins').textContent = '⏱ ' + s.mins; $('st-sub').textContent = s.sub;
    $('btn-prev').disabled = state.step === 0;
    $('btn-next').textContent = state.step === STATIONS.length - 1 ? '🏁 Finish' : 'Next ▶';
    $('tip-body').innerHTML = '<ol>' + s.tips.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol>';
    $('ps-bg').style.backgroundImage = 'url(' + art(state.step >= 3 ? 'bg_patch' : 'bg') + ')';
    renderSteps(); renderSay(s);
    var body = $('stage-body'); body.innerHTML = ''; body.scrollTop = 0;
    s.run(body);
  }

  // ------------------------------------------------------------ timer widget
  function makeTimer(seconds, opts) {
    opts = opts || {};
    var left = seconds, iv = 0, warned = false;
    var face = el('div', { class: 'tm-face' }), bar = el('div', { class: 'tm-fill' });
    function paint() {
      var m = Math.floor(left / 60), s = left % 60;
      face.textContent = m + ':' + (s < 10 ? '0' : '') + s;
      bar.style.width = Math.max(0, (left / seconds) * 100) + '%';
      wrap.classList.toggle('low', left <= 30);
    }
    function tick() {
      left = Math.max(0, left - 1); paint();
      if (opts.warnAt && left === opts.warnAt && !warned) { warned = true; say(opts.warnText || 'Two minutes left!'); }
      if (left === 0) { stop(); A.timeUp(); if (opts.onEnd) opts.onEnd(); }
    }
    function start() { if (iv || left === 0) return; iv = setInterval(tick, 1000); playBtn.textContent = '⏸ Pause'; }
    function stop() { clearInterval(iv); iv = 0; playBtn.textContent = '▶ Start'; }
    var playBtn = el('button', { class: 'ps-btn emerald sm', type: 'button', text: '▶ Start', onclick: function () { A.tap(); if (iv) stop(); else start(); } });
    var wrap = el('div', { class: 'tm' + (opts.compact ? ' compact' : '') }, [
      face, el('div', { class: 'tm-track' }, [bar]),
      el('div', { class: 'tm-btns' }, [playBtn,
        el('button', { class: 'ps-btn ghost sm', type: 'button', text: '+1 min', onclick: function () { A.tap(); left += 60; seconds = Math.max(seconds, left); paint(); } }),
        el('button', { class: 'ps-btn ghost sm', type: 'button', text: '↺', title: 'Reset', onclick: function () { A.tap(); stop(); left = seconds = opts.reset || seconds; warned = false; paint(); } })])
    ]);
    opts.reset = seconds;
    paint(); cleanup.push(stop);
    return { node: wrap, start: start, stop: stop, reset: function (s) { stop(); left = seconds = s; warned = false; paint(); } };
  }

  // ------------------------------------------------------------ 1. cauldron
  var cauldron = null;
  function stCauldron(body) {
    if (!cauldron) cauldron = { order: shuffle(D.PETS.map(function (p) { return p.id; })).slice(0, 6), round: 0, clue: 1, solved: false };
    var c = cauldron, p = PET[c.order[c.round]], clues = state.grade === 4 ? p.clues4 : p.clues3;
    var opts = shuffle([p.id].concat(shuffle(D.PETS.filter(function (x) { return x.id !== p.id; }).map(function (x) { return x.id; })).slice(0, 3)));

    var pot = el('div', { class: 'cauldron' + (c.solved ? ' solved' : '') }, [
      el('img', { class: 'cauldron-pet', src: art(p.id), alt: '' }),
      el('img', { class: 'cauldron-pot', src: art('cauldron'), alt: '' }),
      el('div', { class: 'bubbles' }, [el('i'), el('i'), el('i'), el('i')])
    ]);
    var clueBox = el('div', { class: 'clues' });
    clues.forEach(function (cl, i) {
      var shown = i < c.clue || c.solved;
      clueBox.appendChild(el('button', { class: 'clue' + (shown ? '' : ' hidden'), type: 'button', html: '<em>Clue ' + (i + 1) + '</em>' + (shown ? colourise(cl) : '❓ ❓ ❓'),
        onclick: function () { if (shown) { A.tap(); say(cl); } } }));
    });
    var grid = el('div', { class: 'guess-grid' });
    opts.forEach(function (id) {
      var b = el('button', { class: 'guess' + (c.solved && id === p.id ? ' right' : ''), type: 'button' }, [el('img', { src: art(id), alt: PET[id].kind }), el('span', { text: PET[id].kind })]);
      b.addEventListener('click', function () {
        if (c.solved) return;
        if (id === p.id) {
          var pts = Math.max(1, 4 - c.clue); c.solved = true;
          addPts(state.turn, pts, b); hostReact('cheer');
          say('Yes! It\'s ' + p.name + ', the ' + p.kind + '! ' + pts + (pts === 1 ? ' point!' : ' points!'));
          stCauldronRefresh(body);
        } else {
          A.softFail(); wobble(b); hostReact('oops');
          say(c.clue < 3 ? 'Not this one. Listen to the next clue!' : 'Not this one. Listen again: ' + clues[2]);
          if (c.clue < 3) { c.clue++; setTimeout(function () { stCauldronRefresh(body, true); }, 1400); }
        }
      });
      grid.appendChild(b);
    });

    var actions = el('div', { class: 'row-btns' }, [
      c.solved ? null : el('button', { class: 'ps-btn violet', type: 'button', text: c.clue < 3 ? '🔮 Next clue (' + (c.clue + 1) + '/3)' : '🔊 Read all clues', onclick: function () {
        A.bubble();
        if (c.clue < 3) { c.clue++; stCauldronRefresh(body, true); } else say(clues.join(' '));
      } }),
      c.solved ? null : el('button', { class: 'ps-btn ghost', type: 'button', text: '🔊 Read clue', onclick: function () { A.tap(); say(clues[c.clue - 1]); } }),
      c.solved && c.round < c.order.length - 1 ? el('button', { class: 'ps-btn amber', type: 'button', text: '🎃 Next pet ▶', onclick: function () {
        A.bubble(); c.round++; c.clue = 1; c.solved = false; nextTurn(); stCauldronRefresh(body, true);
      } }) : null,
      c.solved && c.round === c.order.length - 1 ? el('button', { class: 'ps-btn emerald', type: 'button', text: '✅ All pets found! Go to Meet the Pets ▶', onclick: function () { go(1); } }) : null
    ]);

    body.appendChild(el('div', { class: 'cauldron-layout' }, [
      el('div', { class: 'cauldron-left' }, [pot, el('div', { class: 'round-lbl', text: 'Pet ' + (c.round + 1) + ' of ' + c.order.length })]),
      el('div', { class: 'cauldron-right' }, [turnBanner(c.solved ? 'Well done!' : 'Listen, whisper in your team, then point!'), clueBox, grid, actions])
    ]));
  }
  function stCauldronRefresh(body, speakClue) {
    body.innerHTML = ''; stCauldron(body);
    if (speakClue && cauldron && !cauldron.solved) {
      var p = PET[cauldron.order[cauldron.round]], clues = state.grade === 4 ? p.clues4 : p.clues3;
      say('Clue ' + cauldron.clue + ': ' + clues[cauldron.clue - 1]);
    }
  }

  // ------------------------------------------------------------ 2. meet the pets
  function stMeet(body) {
    var count = Object.keys(state.met).length;
    var shelf = el('div', { class: 'shelf' });
    D.PETS.forEach(function (p) {
      shelf.appendChild(el('button', { class: 'pet-card' + (state.met[p.id] ? ' met' : ''), type: 'button', onclick: function () { A.flip(); openPet(body, p); } }, [
        el('div', { class: 'pet-art' }, [el('img', { class: 'bob', src: art(p.id), alt: p.kind }), el('div', { class: 'ps-pedestal sm' })]),
        el('div', { class: 'pet-tray' }, [el('b', { text: p.name }), el('span', { text: p.kind }), el('i', { class: 'price', text: '🪙 ' + p.price })]),
        state.met[p.id] ? el('div', { class: 'met-tick', text: '✓' }) : null
      ]));
    });
    body.appendChild(el('div', { class: 'meet-head' }, [
      el('span', { class: 'ps-pill', text: '🐾 Met ' + count + ' / ' + D.PETS.length + ' pets' }),
      el('span', { class: 'legend', html: '<span class="k-col">colour</span> <span class="k-has">has got</span> <span class="k-can">can</span>' })
    ]));
    body.appendChild(shelf);
    if (!count) say('Welcome to my shop! Tap a pet to meet it.', false);
  }
  function openPet(body, p) {
    state.met[p.id] = true;
    var ls = lines(p);
    var lineBtns = ls.concat(["It's " + p.price + ' coins.']).map(function (l) {
      return el('button', { class: 'pet-line', type: 'button', html: '🔊 ' + colourise(l), onclick: function (ev) { A.tap(); markLine(ev.currentTarget); say(l); } });
    });
    function markLine(n) { lineBtns.forEach(function (b) { b.classList.remove('on'); }); if (n) n.classList.add('on'); }
    var echoing = false;
    function echo() {
      if (echoing) return; echoing = true;
      var i = 0;
      (function nxt() {
        if (i >= lineBtns.length || !document.body.contains(lineBtns[0])) { echoing = false; markLine(null); return; }
        markLine(lineBtns[i]);
        say(i === 0 ? 'Listen and say it with me. ' + ls[0] : (ls[i] || "It's " + p.price + ' coins.')).then(function () { i++; setTimeout(nxt, 2600); });
      })();
    }
    var act = el('div', { class: 'act-big', hidden: 'hidden', text: p.act });
    var panel = el('div', { class: 'pet-panel' }, [
      el('div', { class: 'pet-panel-art' }, [el('img', { class: 'bob', src: art(p.id), alt: p.kind }), el('div', { class: 'ps-pedestal' }), act]),
      el('div', { class: 'pet-panel-text' }, [
        el('h3', { text: 'This is ' + p.name + '!' }),
        el('div', { class: 'pet-lines' }, lineBtns),
        el('div', { class: 'row-btns' }, [
          el('button', { class: 'ps-btn violet', type: 'button', text: '🔁 Say it with me', onclick: function () { A.tap(); echo(); } }),
          el('button', { class: 'ps-btn amber', type: 'button', text: '🎭 Act it!', onclick: function () { A.correct(); act.hidden = false; say(p.act.replace(/^\S+\s/, '') + ' Everybody!'); setTimeout(function () { act.hidden = true; }, 2600); } }),
          el('button', { class: 'ps-btn ghost', type: 'button', text: '◀ Back to the shop', onclick: function () { A.tap(); window.speechSynthesis && window.speechSynthesis.cancel(); body.innerHTML = ''; stMeet(body); } })
        ])
      ])
    ]);
    body.innerHTML = ''; body.appendChild(panel);
    say('This is ' + p.name + '. ' + ls.join(' '));
  }

  // ------------------------------------------------------------ 3. team pet lab
  var lab = { timer: null, pick: {}, checks: {} };
  function stLab(body) {
    var B = D.BUILDER, g4 = state.grade === 4;
    if (!lab.pick.name) lab.pick = { name: 'Shadow', colour: 'black', animal: 'cat', adj: 'small', hasGot: 'big eyes', hasGot2: 'a long tail', can: 'jump', cant: 'swim', likes: 'pizza', price: 10 };
    var t = makeTimer(8 * 60, { warnAt: 120, warnText: 'Two minutes left! Practise your sentences together.', onEnd: function () { say('Time is up! Pencils down. Get ready to open your pet shop!'); } });
    lab.timer = t;

    var jobs = el('div', { class: 'jobs' }, D.JOBS.map(function (j) {
      return el('div', { class: 'job' }, [el('span', { class: 'job-ic', text: j.icon }), el('b', { text: j.name }), el('small', { text: j.job })]);
    }));
    var jobsLeft = 0, jobsIv = 0;
    var jobsBtn = el('button', { class: 'ps-btn amber sm', type: 'button', text: '⏱ 30 seconds', onclick: function () {
      A.tap(); clearInterval(jobsIv); jobsLeft = 30; jobsBtn.textContent = '⏱ 30'; say('Choose your jobs. You have 30 seconds!');
      jobsIv = setInterval(function () {
        jobsLeft--; jobsBtn.textContent = '⏱ ' + jobsLeft;
        if (jobsLeft <= 0) { clearInterval(jobsIv); jobsBtn.textContent = '✓ Jobs chosen'; A.timeUp(); say('Time! Artists, take a pencil. Start drawing!'); lab.checks[0] = true; }
      }, 1000);
    } });
    cleanup.push(function () { clearInterval(jobsIv); });
    var checks = el('div', { class: 'checks' }, D.LAB_STEPS.map(function (s, i) {
      return el('button', { class: 'check' + (lab.checks[i] ? ' on' : ''), type: 'button', onclick: function (ev) { A.tap(); lab.checks[i] = !lab.checks[i]; ev.currentTarget.classList.toggle('on'); } }, [el('i', { text: lab.checks[i] ? '✓' : String(i + 1) }), el('span', { text: s })]);
    }));

    var preview = el('div', { class: 'preview' });
    function sentences() {
      var P = lab.pick, an = /^[aeiou]/.test(g4 ? P.adj : P.colour) ? 'an' : 'a';
      return g4 ? ['This is ' + P.name + '.', "It's " + an + ' ' + P.adj + ', ' + P.colour + ' ' + P.animal + '.', 'It has got ' + P.hasGot + ' and ' + P.hasGot2 + '.', 'It can ' + P.can + ", but it can't " + P.cant + '.', 'It likes ' + P.likes + '!', "It's " + P.price + ' coins!']
        : ['This is ' + P.name + '.', "It's " + an + ' ' + P.colour + ' ' + P.animal + '.', 'It has got ' + P.hasGot + '.', 'It can ' + P.can + '.', "It's " + P.price + ' coins!'];
    }
    function paintPreview() { preview.innerHTML = sentences().map(function (s) { return '<p>' + colourise(s) + '</p>'; }).join(''); }
    function row(label, key, list) {
      return el('div', { class: 'b-row' }, [el('span', { class: 'b-lbl', text: label }), el('div', { class: 'b-chips' }, list.map(function (w) {
        var ic = D.ICONS[w];
        return el('button', { class: 'chip' + (String(lab.pick[key]) === String(w) ? ' on' : ''), type: 'button', text: (ic ? ic + ' ' : '') + String(w), onclick: function (ev) {
          A.tap(); lab.pick[key] = w; [].forEach.call(ev.currentTarget.parentNode.children, function (x) { x.classList.remove('on'); }); ev.currentTarget.classList.add('on'); paintPreview();
        } });
      }))]);
    }
    var rows = [row('Name', 'name', B.names), g4 ? row("It's", 'adj', B.adj) : null, row('Colour', 'colour', B.colour), row('Animal', 'animal', B.animal), row('Has got', 'hasGot', B.hasGot),
      g4 ? row('…and', 'hasGot2', B.hasGot) : null, row('Can', 'can', B.can), g4 ? row("Can't", 'cant', B.cant) : null, g4 ? row('Likes', 'likes', B.likes) : null, row('Coins', 'price', B.price)];
    paintPreview();
    var builder = el('div', { class: 'builder' }, [
      el('h4', { text: '🧪 Sentence Builder · tap the words' }), preview
    ].concat([el('div', { class: 'row-btns tight' }, [
      el('button', { class: 'ps-btn violet sm', type: 'button', text: '🔊 Hear our pet', onclick: function () { A.tap(); say(sentences().join(' ')); } }),
      el('button', { class: 'ps-btn ghost sm', type: 'button', text: '🎲 Surprise me', onclick: function () {
        A.bubble(); var r = function (a) { return a[Math.floor(Math.random() * a.length)]; };
        lab.pick = { name: r(B.names), colour: r(B.colour), animal: r(B.animal), adj: r(B.adj), hasGot: r(B.hasGot), hasGot2: r(B.hasGot), can: r(B.can), cant: r(B.cant), likes: r(B.likes), price: r(B.price) };
        if (lab.pick.hasGot2 === lab.pick.hasGot) lab.pick.hasGot2 = B.hasGot[(B.hasGot.indexOf(lab.pick.hasGot) + 1) % B.hasGot.length];
        if (lab.pick.cant === lab.pick.can) lab.pick.cant = lab.pick.can === 'fly' ? 'swim' : 'fly';
        body.innerHTML = ''; stLab(body);
      } })
    ])]).concat(rows));

    body.appendChild(el('div', { class: 'lab' }, [
      el('div', { class: 'lab-left' }, [el('div', { class: 'jobs-head' }, [el('h4', { text: '👥 Choose your jobs' }), jobsBtn]), el('p', { class: 'jobs-note', text: 'Team of 5? Two Artists!' }), jobs, t.node, checks]),
      builder
    ]));
  }

  // ------------------------------------------------------------ 4. pet shop open
  var shop = { cur: 0, done: {}, phase: 'sell', line: -1 };
  function stShop(body) {
    if (shop.phase === 'buy') return stBuy(body);
    var n = state.teams.length, tm = team(shop.cur), frames = D.SELLER[state.grade], qs = D.QUESTIONS[state.grade];
    var timer = makeTimer(90, { compact: true, onEnd: function () { say('Great job! Buyers, ask your question!'); } });

    var order = el('div', { class: 'shop-order' }, state.teams.map(function (t, i) {
      return el('button', { class: 'so-team' + (i === shop.cur ? ' on' : '') + (shop.done[i] ? ' done' : ''), style: '--tc:' + t.color, type: 'button', onclick: function () { A.tap(); shop.cur = i; shop.line = -1; body.innerHTML = ''; stShop(body); } }, [
        el('span', { text: t.icon }), el('b', { text: t.name }), shop.done[i] ? el('i', { text: '✓' }) : null
      ]);
    }));
    var frameBtns = frames.map(function (f, i) {
      return el('button', { class: 'frame' + (i === shop.line ? ' on' : ''), type: 'button', html: colourise(f), onclick: function (ev) {
        A.tap(); shop.line = i; [].forEach.call(ev.currentTarget.parentNode.children, function (x) { x.classList.remove('on'); }); ev.currentTarget.classList.add('on');
      } });
    });
    var seller = el('div', { class: 'seller', style: '--tc:' + tm.color }, [
      el('div', { class: 'seller-head' }, [el('b', { text: tm.icon + ' ' + tm.name + ' · Pet Shop' }), el('span', { text: 'Speaker shows the card · Team says the last line together' })]),
      el('div', { class: 'frames' }, frameBtns)
    ]);
    var buyers = el('div', { class: 'buyers' }, [el('h4', { text: '🛒 Buyers ask 1 question' })].concat(qs.map(function (q) {
      return el('button', { class: 'q-card', type: 'button', onclick: function () { A.tap(); say(q.q); } }, [el('b', { html: '❓ ' + colourise(q.q) }), el('small', { html: '→ ' + colourise(q.a) })]);
    })));
    var others = state.teams.map(function (t, i) { return i; }).filter(function (i) { return i !== shop.cur; });
    var awards = el('div', { class: 'awards-row' }, [
      el('button', { class: 'ps-btn amber', type: 'button', text: '⭐⭐ Clear sentences +2', onclick: function (ev) { addPts(shop.cur, 2, ev.currentTarget); say('Super clear sentences, ' + tm.name + '!'); } }),
      el('button', { class: 'ps-btn emerald', type: 'button', text: '🤝 Team helped +1', onclick: function (ev) { addPts(shop.cur, 1, ev.currentTarget); } }),
      el('span', { class: 'aw-lbl', text: 'Good question +1:' })
    ].concat(others.map(function (i) {
      return el('button', { class: 'ps-btn tiny', style: '--tc:' + team(i).color, type: 'button', text: team(i).icon + ' ' + team(i).name, onclick: function (ev) { addPts(i, 1, ev.currentTarget); } });
    })));
    var allDone = Object.keys(shop.done).length >= n;
    var nextBtns = el('div', { class: 'row-btns' }, [
      el('button', { class: 'ps-btn violet', type: 'button', text: shop.done[shop.cur] ? '✓ Done' : '✅ Done! Next team ▶', onclick: function () {
        A.correct(); shop.done[shop.cur] = true; shop.line = -1;
        var nx = -1; for (var k = 1; k <= n; k++) { if (!shop.done[(shop.cur + k) % n]) { nx = (shop.cur + k) % n; break; } }
        if (nx >= 0) { shop.cur = nx; say(team(nx).name + ', open your pet shop!'); } else say('Every pet shop is open! Now buy a pet with your coins!');
        body.innerHTML = ''; stShop(body);
      } }),
      el('button', { class: 'ps-btn amber', type: 'button', text: '🪙 Buy a pet!', disabled: allDone ? null : 'disabled', title: allDone ? '' : 'When every team has presented', onclick: function () { A.coin(); shop.phase = 'buy'; body.innerHTML = ''; stShop(body); } })
    ]);
    body.appendChild(el('div', { class: 'shop' }, [el('div', { class: 'shop-left' }, [order, timer.node, nextBtns]), el('div', { class: 'shop-mid' }, [seller, awards]), buyers]));
  }
  function stBuy(body) {
    var n = state.teams.length, total = 0;
    state.teams.forEach(function (t) { total += t.coins || 0; });    var cards = state.teams.map(function (t, i) {
      return el('button', { class: 'buy-card', style: '--tc:' + t.color, type: 'button', onclick: function (ev) {
        t.coins = (t.coins || 0) + 1; A.coin(); burst(ev.currentTarget, '🪙'); persist(); body.innerHTML = ''; stBuy(body);
      } }, [el('span', { class: 'buy-ic', text: t.icon }), el('b', { text: t.name + (/s$/i.test(t.name) ? "' pet" : "'s pet") }), el('div', { class: 'coins', text: (t.coins || 0) ? new Array((t.coins || 0) + 1).join('🪙') : '—' }), el('i', { text: (t.coins || 0) + ' coins' })]);
    });
    body.appendChild(el('div', { class: 'buy' }, [
      el('p', { class: 'buy-help', html: 'Each team has <b>3 coins</b>. Spend them on <b>other</b> teams\' pets: tap a pet once for each coin. Say: <span class="k-can">"I want this pet, please!"</span>' }),
      el('div', { class: 'buy-grid' }, cards),
      el('div', { class: 'row-btns' }, [
        el('span', { class: 'ps-pill', text: '🪙 ' + total + ' / ' + n * 3 + ' coins spent' }),
        el('button', { class: 'ps-btn emerald', type: 'button', text: '🏆 Finish shopping', disabled: total ? null : 'disabled', onclick: function () {
          var top = Math.max.apply(null, state.teams.map(function (t) { return t.coins || 0; }));
          state.teams.forEach(function (t, i) { if ((t.coins || 0) === top && top > 0) addPts(i, 3); });
          A.fanfare(); state.bestShop = state.teams.filter(function (t) { return (t.coins || 0) === top; }).map(function (t) { return t.name; });
          say('The Best Pet Shop is ' + state.bestShop.join(' and ') + '! Plus 3 points!'); go(4);
        } }),
        el('button', { class: 'ps-btn ghost', type: 'button', text: '↺ Coins to 0', onclick: function () { A.tap(); state.teams.forEach(function (t) { t.coins = 0; }); persist(); body.innerHTML = ''; stBuy(body); } }),
        el('button', { class: 'ps-btn ghost', type: 'button', text: '◀ Back to the sellers', onclick: function () { A.tap(); shop.phase = 'sell'; body.innerHTML = ''; stShop(body); } })
      ])
    ]));
    if (!total) say('Each team has 3 coins. Which pet do you want? Say: I want this pet, please!');
  }

  // ------------------------------------------------------------ 5. awards
  var TITLES = ['🏆 Best Pet Shop', '🗣️ Brave Speakers', '🎨 Super Artists', '🤝 Best Helpers', '⏱️ Time Champions', '✨ Spooky Stars'];
  function stAwards(body) {
    var ranked = state.teams.map(function (t, i) { return { t: t, i: i }; }).sort(function (a, b) { return (b.t.pts || 0) - (a.t.pts || 0); });
    var best = state.bestShop || [];
    var k2 = 0;
    var cards = ranked.map(function (r, k) {
      var title = best.indexOf(r.t.name) >= 0 ? TITLES[0] : TITLES[1 + (k2++ % (TITLES.length - 1))];
      return el('div', { class: 'award', style: '--tc:' + r.t.color + ';animation-delay:' + (k * 0.15) + 's' }, [
        el('div', { class: 'award-ic', text: r.t.icon }), el('b', { text: r.t.name }), el('span', { class: 'award-title', text: title }), r.t.pts ? el('i', { text: '⭐ ' + r.t.pts + (r.t.pts === 1 ? ' point' : ' points') }) : null
      ]);
    });
    var door = D.DOOR[state.grade];
    body.appendChild(el('div', { class: 'awards' }, [el('div', { class: 'award-grid' }, cards),
      el('div', { class: 'door' }, [el('h4', { text: '🚪 Door Pass: say 1 sentence' }),
        el('div', { class: 'door-lines' }, door.map(function (l) { return el('button', { class: 'frame', type: 'button', html: '🔊 ' + colourise(l), onclick: function () { A.tap(); say(l); } }); })),
        el('div', { class: 'door-pets' }, D.PETS.map(function (p) { return el('button', { class: 'door-pet', type: 'button', onclick: function () { A.tap(); say(state.grade === 4 ? 'My favourite pet is the ' + p.kind + ' because it can ' + lines(p)[2].replace(/^It can (\w+).*/, '$1') + '.' : 'My favourite pet is the ' + p.kind + '.'); } }, [el('img', { src: art(p.id), alt: p.kind }), el('span', { text: p.kind })]); }))
      ])
    ]));
    A.fanfare(); confetti();
    say('Well done, everybody! Every team is a winner today. Happy Halloween!');
  }
  function confetti() {
    var icons = ['🎃', '🦇', '👻', '⭐', '🍬'];
    for (var i = 0; i < 26; i++) {
      var c = el('div', { class: 'confetti', text: icons[i % icons.length] });
      c.style.left = Math.random() * 100 + 'vw'; c.style.animationDelay = Math.random() * 0.8 + 's'; c.style.fontSize = (20 + Math.random() * 18) + 'px';
      document.body.appendChild(c); setTimeout(function (x) { x.remove(); }.bind(null, c), 3600);
    }
  }

  // ------------------------------------------------------------ start
  function start(cls) {
    state.cls = cls; state.grade = /^4/.test(cls) ? 4 : 3;
    loadTeams(cls);
    $('ps-class-lbl').textContent = 'Class ' + cls.toUpperCase() + ' · Grade ' + state.grade + ' · ' + state.teams.length + ' teams';
    $('ps-start').hidden = true; $('ps-app').hidden = false;
    renderTeams(); go(0);
    A.spooky();
    var p = PET[cauldron.order[0]];
    say('Welcome to the Monster Pet Shop, ' + cls.toUpperCase() + '! There is a pet in my cauldron. Listen. Clue 1: ' + (state.grade === 4 ? p.clues4 : p.clues3)[0]);
    try { history.replaceState(null, '', '?class=' + cls); } catch (e) { /* file:// */ }
  }
  function init() {
    var row = $('ps-class-row');
    ['3a', '3b', '4a', '4b'].forEach(function (c) {
      row.appendChild(el('button', { class: 'ps-btn class-btn', type: 'button', text: c.toUpperCase(), onclick: function () { A.unlock(); A.tap(); start(c); } }));
    });
    $('btn-prev').onclick = function () { A.tap(); go(state.step - 1); };
    $('btn-next').onclick = function () { A.tap(); if (state.step === STATIONS.length - 1) { state.done[state.step] = true; renderSteps(); confetti(); A.fanfare(); } else go(state.step + 1); };
    $('host-replay').onclick = function () { A.tap(); if (state.lastSpeech) say(state.lastSpeech); };
    $('btn-sound').onclick = function () { A.setOn(!A.isOn()); this.textContent = A.isOn() ? '🔊' : '🔇'; };
    $('btn-tip').onclick = function () { A.tap(); $('tip-modal').hidden = false; };
    $('tip-close').onclick = function () { A.tap(); $('tip-modal').hidden = true; };
    $('tip-modal').onclick = function (e) { if (e.target === this) this.hidden = true; };
    $('btn-fs').onclick = function () { try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } catch (e) { /* not allowed */ } };
    document.addEventListener('keydown', function (e) {
      if ($('ps-app').hidden || /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      if (e.key === 'ArrowRight') go(state.step + 1); else if (e.key === 'ArrowLeft') go(state.step - 1);
    });
    var q = (/[?&]class=(3a|3b|4a|4b)/i.exec(location.search) || [])[1];
    if (q) { $('lnk-sheet').href = 'worksheet.html?class=' + q.toLowerCase(); $('lnk-plan').href = 'plan.html?class=' + q.toLowerCase(); }
    if (q) { $('ps-start').classList.add('auto'); row.querySelectorAll('button').forEach(function (b) { if (b.textContent.toLowerCase() === q.toLowerCase()) b.classList.add('suggest'); }); }
  }
  window.PetShop = { go: go, start: start, state: state };
  init();
})(window);
