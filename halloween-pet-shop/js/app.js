/* Halloween Monster Pet Vet Clinic: CLIL + PPP smartboard controller (5 PPP stations, team points on this page only: no cloud writes). */
(function (window) {
  'use strict';
  var D = window.PetShopData, A = window.PetAudio;
  var $ = function (id) { return document.getElementById(id); };
  var PET = {}; D.PETS.forEach(function (p) { PET[p.id] = p; });

  var state = { cls: '', grade: 3, step: 0, teams: [], turn: 0, lastSpeech: '', met: {}, checked: {}, done: {} };

  var STATIONS = [
    {
      title: "1 · Presentation A: Vet X-Ray Scanner",
      mins: '5 min',
      sub: "PPP Presentation · Listen to 3 symptoms · Admit the patient",
      run: stCauldron,
      say: ["What's the matter?", 'It has got a tummy ache.', 'Give it warm water!'],
      tips: [
        'PPP Presentation (Receptive Input): Pupils listen to 3 clinical clues from Dr. Luna and deduce which Halloween pet is inside the X-Ray Scanner.',
        'Read clue 1, teams whisper together, then tap "Next clue" or tap the patient the team points to. Early diagnosis = 3 pts, 2nd clue = 2 pts, 3rd clue = 1 pt.',
        'Soft-fail only: wrong guesses never lose points — Dr. Luna gives the next symptom clue.'
      ]
    },
    {
      title: '2 · Presentation B: CLIL Vet Check-Up',
      mins: '6 min',
      sub: 'PPP Meaning, Form & Pronunciation · Symptoms, Causes & Cures',
      run: stMeet,
      say: ["What's the matter?", 'It has got ___ because it ___.', 'It should ___.'],
      tips: [
        'CLIL Science Focus: Connect every SYMPTOM (amber) to its CAUSE / BODY PART (cyan) and TREATMENT (emerald).',
        'Tap a patient on the waiting bench. Use "🔁 Repeat with Dr. Luna" for choral drilling and "🎭 Act the Symptom & Cure!" for TPR.',
        'Each patient card also has a 1-question "🩺 Quick Vet Check" at the bottom so teams can earn +1 point right away!'
      ]
    },
    {
      title: '3 · Practice: Medicine Cabinet Match!',
      mins: '6 min',
      sub: 'PPP Controlled Practice · Match the symptom to the right cure',
      run: stPractice,
      say: ['Give it warm honey tea!', 'It should rest in bed.', "It shouldn't eat sweets!"],
      tips: [
        'PPP Controlled Practice: Teams take turns reading the patient\'s chart and choosing the correct treatment from the 4 Medicine Cabinet cards.',
        'Grade 3 practices imperative care commands ("Give it… / Put on… / Wash it…"). Grade 4 practices medical advice ("It should… and it shouldn\'t…") linked to causes ("because…").',
        'Every correct prescription earns +2 team points and heals the patient on screen!'
      ]
    },
    {
      title: '4 · Production Prep: Team Vet Lab',
      mins: '8 min',
      sub: 'PPP Scaffolded Prep · 4 Vet Jobs · Draw & Write the Vet Report',
      run: stLab,
      say: ['This is our patient, ___.', 'It has got ___.', 'Give it ___!', 'It should ___.'],
      tips: [
        'Hand each team 1 Monster Vet Report Card (worksheet.html). Press "⏱ 30 seconds" so teams assign their 4 jobs: Head Vet (Speaker), X-Ray Artist, Medical Writer, Clinic Manager.',
        'Start the 7-minute timer. Walk around to support Writers with the colour-coded sentence frames and let Head Vets rehearse with their team.',
        'Teams can tap words on the Live Prescription Builder on the smartboard and press "🔊 Hear our Vet Report" to test their sentences.'
      ]
    },
    {
      title: '5 · Production: Open the Vet Clinic!',
      mins: '10 min',
      sub: 'PPP Free Production · Team Vet Reports · Inspector Q&A · Awards',
      run: stShop,
      say: ['Welcome to our Monster Vet Clinic!', "What's the matter with it?", 'Why is it sick?', 'What should it do?'],
      tips: [
        'PPP Communicative Production: Each team presents their patient at the front (90s timer). The Head Vet leads, and the whole team says the final healthy cheer together.',
        'Other teams are Health Inspectors: press "🎲 Spin Inspector Question!" or let them use their cut-out Question Cards (+1 pt for asking, +1 pt for answering).',
        'After all teams present, tap "💚 Give Healing Hearts!" (3 hearts per team) followed by "🏆 Clinic Awards & Door Pass"!'
      ]
    }
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

  // CLIL colour-coding:
  // Amber (.k-col) = Symptoms & Feelings
  // Cyan (.k-has) = Causes ("because...") & Body parts
  // Emerald (.k-can) = Treatments ("Give it...", "should / shouldn't", "Put...", "Wash...")
  var SYMPTOMS = /\b(tummy ache|stomach ache|sore throat|sore wing|sore paw|tired|hungry|thirsty|cold|scared|dizzy|dirty|muddy|shivering|shaking|fever|hurts|hurt)\b/gi;
  var CAUSES = /\b(because|ate|flew|shouted|danced|rolled|jumped|has got|wing|paw|legs|throat|eyes)\b/gi;
  var CURES = /\b(shouldn&#39;t|should|Give it|Put a|Put on|Wash it|warm water|honey tea|warm blanket|bandage|healthy milk|fresh fruit|pillow|quiet bed|rest)\b/gi;

  function colourise(s) {
    return esc(s)
      .replace(CURES, '<span class="k-can">$&</span>')
      .replace(CAUSES, '<span class="k-has">$&</span>')
      .replace(SYMPTOMS, '<span class="k-col">$&</span>');
  }

  function wobble(node) { if (!node) return; node.classList.remove('wobble'); void node.offsetWidth; node.classList.add('wobble'); }
  function burst(node, icon) {
    if (!node || !node.getBoundingClientRect) return;
    var r = node.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (var i = 0; i < 8; i++) {
      var b = el('div', { class: 'burst', text: icon || (i % 2 ? '💚' : '⭐') }), ang = (i / 8) * Math.PI * 2;
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
  function saveKey() { return 'petvet-' + state.cls + '-' + new Date().toISOString().slice(0, 10); }
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
    var linesForBar = s.say;
    if (state.step === 0) {
      linesForBar = state.grade === 4
        ? ["What's the matter?", 'It has got ___ because it ___.', 'It should ___.']
        : ["What's the matter?", 'It is tired and hungry.', 'Give it warm water!'];
    } else if (state.step === 2) {
      linesForBar = state.grade === 4
        ? ['It should drink warm tea.', "It shouldn't eat sweets!", 'Because it ate too much!']
        : ['Give it warm honey tea!', 'Put a bandage on its paw!', 'Now it is happy!'];
    }
    box.appendChild(el('span', { class: 'ps-say-tag', text: '🗣️ SAY' }));
    linesForBar.forEach(function (line) {
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

  // ------------------------------------------------------------ 1. Presentation A: Vet X-Ray Scanner
  var cauldron = null;
  function stCauldron(body) {
    if (!cauldron) cauldron = { order: shuffle(D.PETS.map(function (p) { return p.id; })).slice(0, 6), round: 0, clue: 1, solved: false };
    var c = cauldron, p = PET[c.order[c.round]], clues = state.grade === 4 ? p.clues4 : p.clues3;
    var opts = shuffle([p.id].concat(shuffle(D.PETS.filter(function (x) { return x.id !== p.id; }).map(function (x) { return x.id; })).slice(0, 3)));

    var pot = el('div', { class: 'cauldron xray-scanner' + (c.solved ? ' solved' : '') }, [
      el('div', { class: 'xray-badge', text: c.solved ? ('✅ ' + p.name + ' · ' + p.badge) : '🔬 X-RAY SCANNER' }),
      el('img', { class: 'cauldron-pet', src: art(p.id), alt: '' }),
      el('img', { class: 'cauldron-pot', src: art('cauldron'), alt: '' }),
      el('div', { class: 'bubbles' }, [el('i'), el('i'), el('i'), el('i')])
    ]);
    var clueBox = el('div', { class: 'clues' });
    var clueLabels = ['🌡️ Symptom Clue', '🦠 Body / Cause Clue', '💊 Treatment Clue'];
    clues.forEach(function (cl, i) {
      var shown = i < c.clue || c.solved;
      clueBox.appendChild(el('button', { class: 'clue' + (shown ? '' : ' hidden'), type: 'button', html: '<em>' + clueLabels[i] + '</em>' + (shown ? colourise(cl) : '❓ Tap "Next clue" to scan'),
        onclick: function () { if (shown) { A.tap(); say(cl); } } }));
    });
    var grid = el('div', { class: 'guess-grid' });
    opts.forEach(function (id) {
      var b = el('button', { class: 'guess' + (c.solved && id === p.id ? ' right' : ''), type: 'button' }, [
        el('img', { src: art(id), alt: PET[id].kind }),
        el('span', { text: PET[id].name + ' (' + PET[id].kind + ')' })
      ]);
      b.addEventListener('click', function () {
        if (c.solved) return;
        if (id === p.id) {
          var pts = Math.max(1, 4 - c.clue); c.solved = true;
          addPts(state.turn, pts, b); hostReact('cheer');
          say('Diagnosis correct! Our patient is ' + p.name + ' the ' + p.kind + '! Plus ' + pts + (pts === 1 ? ' point!' : ' points!'));
          stCauldronRefresh(body);
        } else {
          A.softFail(); wobble(b); hostReact('oops');
          say(c.clue < 3 ? 'Not that patient! Let\'s scan the next symptom clue.' : 'Look closely at Clue 3: ' + clues[2]);
          if (c.clue < 3) { c.clue++; setTimeout(function () { stCauldronRefresh(body, true); }, 1400); }
        }
      });
      grid.appendChild(b);
    });

    var actions = el('div', { class: 'row-btns' }, [
      c.solved ? null : el('button', { class: 'ps-btn violet', type: 'button', text: c.clue < 3 ? '🔬 Next X-Ray Clue (' + (c.clue + 1) + '/3)' : '🔊 Read all 3 clues', onclick: function () {
        A.bubble();
        if (c.clue < 3) { c.clue++; stCauldronRefresh(body, true); } else say(clues.join(' '));
      } }),
      c.solved ? null : el('button', { class: 'ps-btn ghost', type: 'button', text: '🔊 Read clue again', onclick: function () { A.tap(); say(clues[c.clue - 1]); } }),
      c.solved && c.round < c.order.length - 1 ? el('button', { class: 'ps-btn amber', type: 'button', text: '🩺 Next Patient ▶', onclick: function () {
        A.bubble(); c.round++; c.clue = 1; c.solved = false; nextTurn(); stCauldronRefresh(body, true);
      } }) : null,
      c.solved && c.round === c.order.length - 1 ? el('button', { class: 'ps-btn emerald', type: 'button', text: '✅ All patients scanned! Go to Check-Up Table ▶', onclick: function () { go(1); } }) : null
    ]);

    body.appendChild(el('div', { class: 'cauldron-layout' }, [
      el('div', { class: 'cauldron-left' }, [pot, el('div', { class: 'round-lbl', text: 'Patient ' + (c.round + 1) + ' of ' + c.order.length })]),
      el('div', { class: 'cauldron-right' }, [turnBanner(c.solved ? 'Great diagnosis!' : "Listen to the symptoms, whisper in your team, then tap the patient!"), clueBox, grid, actions])
    ]));
  }
  function stCauldronRefresh(body, speakClue) {
    body.innerHTML = ''; stCauldron(body);
    if (speakClue && cauldron && !cauldron.solved) {
      var p = PET[cauldron.order[cauldron.round]], clues = state.grade === 4 ? p.clues4 : p.clues3;
      say('Clue ' + cauldron.clue + ': ' + clues[cauldron.clue - 1]);
    }
  }

  // ------------------------------------------------------------ 2. Presentation B: CLIL Vet Check-Up Table
  function stMeet(body) {
    var count = Object.keys(state.met).length;
    var shelf = el('div', { class: 'shelf' });
    D.PETS.forEach(function (p) {
      shelf.appendChild(el('button', { class: 'pet-card' + (state.met[p.id] ? ' met' : ''), type: 'button', onclick: function () { A.flip(); openPet(body, p); } }, [
        el('div', { class: 'pet-art' }, [el('img', { class: 'bob', src: art(p.id), alt: p.kind }), el('div', { class: 'ps-pedestal sm' })]),
        el('div', { class: 'pet-tray' }, [
          el('b', { text: p.name }),
          el('span', { text: p.badge }),
          el('i', { class: 'price', text: '🌡️ ' + p.temp })
        ]),
        state.met[p.id] ? el('div', { class: 'met-tick', text: '✓' }) : null
      ]));
    });
    body.appendChild(el('div', { class: 'meet-head' }, [
      el('span', { class: 'ps-pill', text: '🩺 Checked ' + count + ' / ' + D.PETS.length + ' patients' }),
      el('span', { class: 'legend', html: '<span class="k-col">🌡️ Symptom</span> <span class="k-has">🦠 Cause / Body</span> <span class="k-can">💊 Treatment / Advice</span>' })
    ]));
    body.appendChild(shelf);
    if (!count) say('Welcome to the Check-Up Table! Tap a patient to examine its symptoms, cause, and treatment.', false);
  }

  function openPet(body, p) {
    state.met[p.id] = true;
    var ls = lines(p);
    var lineBtns = ls.map(function (l) {
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
        say(i === 0 ? 'Listen and repeat with me. ' + ls[0] : ls[i]).then(function () { i++; setTimeout(nxt, 2500); });
      })();
    }

    // CLIL Quick Comprehension Check inside the pet panel
    var chk = state.grade === 4 ? p.check4 : p.check3;
    var choices = shuffle([chk.right].concat(chk.wrong));
    var checkSolved = !!state.checked[p.id];
    var checkBox = el('div', { class: 'clil-check' }, [
      el('div', { class: 'clil-check-head' }, [
        el('b', { text: '🩺 CLIL Quick Check (' + team(state.turn).name + '): ' + chk.q }),
        checkSolved ? el('span', { class: 'ps-pill emerald', text: '✓ +1 Pt Awarded' }) : null
      ]),
      el('div', { class: 'clil-check-opts' }, choices.map(function (ans) {
        var btn = el('button', { class: 'ps-btn ghost sm' + (checkSolved && ans === chk.right ? ' emerald' : ''), type: 'button', html: colourise(ans) });
        btn.addEventListener('click', function () {
          if (state.checked[p.id]) { say(ans); return; }
          if (ans === chk.right) {
            state.checked[p.id] = true;
            btn.className = 'ps-btn emerald sm';
            addPts(state.turn, 1, btn);
            nextTurn();
            hostReact('cheer');
            say('Spot on! ' + ans);
          } else {
            A.softFail(); wobble(btn); hostReact('oops');
            say('Look at the chart again! ' + chk.q);
          }
        });
        return btn;
      }))
    ]);

    var act = el('div', { class: 'act-big', hidden: 'hidden', text: p.act });
    var panel = el('div', { class: 'pet-panel' }, [
      el('div', { class: 'pet-panel-art' }, [
        el('div', { class: 'patient-vitals', text: '🌡️ Temp: ' + p.temp + ' · ' + p.badge }),
        el('img', { class: 'bob', src: art(p.id), alt: p.kind }),
        el('div', { class: 'ps-pedestal' }),
        act
      ]),
      el('div', { class: 'pet-panel-text' }, [
        el('h3', { text: 'Patient: ' + p.name + ' (' + p.kind + ')' }),
        el('div', { class: 'pet-lines' }, lineBtns),
        checkBox,
        el('div', { class: 'row-btns' }, [
          el('button', { class: 'ps-btn violet', type: 'button', text: '🔁 Repeat with Dr. Luna', onclick: function () { A.tap(); echo(); } }),
          el('button', { class: 'ps-btn amber', type: 'button', text: '🎭 Act the Symptom & Cure!', onclick: function () { A.correct(); act.hidden = false; say(p.act.replace(/^\S+\s/, '') + ' Everybody act it out!'); setTimeout(function () { act.hidden = true; }, 2800); } }),
          el('button', { class: 'ps-btn ghost', type: 'button', text: '◀ Back to Waiting Bench', onclick: function () { A.tap(); window.speechSynthesis && window.speechSynthesis.cancel(); body.innerHTML = ''; stMeet(body); } })
        ])
      ])
    ]);
    body.innerHTML = ''; body.appendChild(panel);
    say(ls.join(' '));
  }

  // ------------------------------------------------------------ 3. Practice: Medicine Cabinet Match!
  var prac = { round: 0, solved: {}, optsCache: {} };
  function stPractice(body) {
    var rounds = D.PRACTICE[state.grade] || D.PRACTICE[3];
    if (prac.round >= rounds.length) prac.round = 0;
    var r = rounds[prac.round], p = PET[r.pet];
    var key = state.grade + '-' + prac.round;
    if (!prac.optsCache[key]) prac.optsCache[key] = shuffle([r.right].concat(r.wrong));
    var opts = prac.optsCache[key];
    var isSolved = !!prac.solved[key];

    var leftCol = el('div', { class: 'med-patient-card' }, [
      el('div', { class: 'patient-vitals', text: '🏥 Exam Table · Case ' + (prac.round + 1) + ' of ' + rounds.length }),
      el('img', { class: 'bob med-pet-img', src: art(p.id), alt: p.kind }),
      el('div', { class: 'ps-pedestal sm' }),
      el('div', { class: 'med-status' + (isSolved ? ' healed' : ''), text: isSolved ? ('💚 ' + p.name + ' is healed!') : ('🤒 ' + p.badge) })
    ]);

    var optBtns = opts.map(function (optText) {
      var b = el('button', {
        class: 'med-opt' + (isSolved && optText === r.right ? ' right' : ''),
        type: 'button',
        html: colourise(optText)
      });
      b.addEventListener('click', function () {
        if (prac.solved[key]) { say(optText.replace(/^[^\w]+/, '')); return; }
        if (optText === r.right) {
          prac.solved[key] = true;
          addPts(state.turn, 2, b);
          hostReact('cheer');
          say('Great treatment! ' + optText.replace(/^[^\w]+/, '') + ' Plus 2 points!');
          body.innerHTML = ''; stPractice(body);
        } else {
          A.softFail(); wobble(b); hostReact('oops');
          say('Oops, that won\'t help ' + p.name + '! Read the symptom carefully and try another medicine.');
        }
      });
      return b;
    });

    var navRow = el('div', { class: 'row-btns' }, [
      el('button', { class: 'ps-btn ghost', type: 'button', text: '🔊 Read Case Chart', onclick: function () { A.tap(); say(r.problem + ' ' + r.q); } }),
      isSolved && prac.round < rounds.length - 1 ? el('button', { class: 'ps-btn amber', type: 'button', text: '💊 Next Patient Case ▶', onclick: function () {
        A.bubble(); prac.round++; nextTurn(); body.innerHTML = ''; stPractice(body);
        var nr = rounds[prac.round]; say(nr.problem + ' ' + nr.q);
      } }) : null,
      isSolved && prac.round === rounds.length - 1 ? el('button', { class: 'ps-btn emerald', type: 'button', text: '✅ All Patients Treated! Go to Team Vet Lab ▶', onclick: function () { go(3); } }) : null
    ]);

    var rightCol = el('div', { class: 'med-right' }, [
      turnBanner(isSolved ? 'Patient healed! Say the prescription aloud together!' : 'Read the symptom chart & tap the right cure from the Medicine Cabinet!'),
      el('div', { class: 'med-chart' }, [
        el('div', { class: 'med-problem', html: '📋 ' + colourise(r.problem) }),
        el('div', { class: 'med-q', text: '🩺 ' + r.q })
      ]),
      el('div', { class: 'med-grid' }, optBtns),
      navRow
    ]);

    body.appendChild(el('div', { class: 'med-layout' }, [leftCol, rightCol]));
  }

  // ------------------------------------------------------------ 4. Production Prep: Team Vet Lab
  var lab = { timer: null, pick: {}, checks: {} };
  function stLab(body) {
    var B = D.BUILDER, g4 = state.grade === 4;
    if (!lab.pick.name) {
      lab.pick = {
        name: 'Shadow',
        animal: 'black cat',
        symptom: 'a tummy ache',
        feeling: 'tired',
        cause: 'ate too many sweets',
        cure3: 'warm water',
        cure3b: 'a quiet bed',
        should4: 'drink warm honey tea',
        shouldnt4: 'eat sweets or chocolate'
      };
    }
    var t = makeTimer(7 * 60, {
      warnAt: 120,
      warnText: 'Two minutes left! Practise reading your Vet Report together.',
      onEnd: function () { say('Time is up! Pencils down. Get ready to open your Monster Vet Clinic!'); }
    });
    lab.timer = t;

    var jobs = el('div', { class: 'jobs' }, D.JOBS.map(function (j) {
      return el('div', { class: 'job' }, [el('span', { class: 'job-ic', text: j.icon }), el('b', { text: j.name }), el('small', { text: j.job })]);
    }));
    var jobsLeft = 0, jobsIv = 0;
    var jobsBtn = el('button', { class: 'ps-btn amber sm', type: 'button', text: '⏱ 30s Jobs Timer', onclick: function () {
      A.tap(); clearInterval(jobsIv); jobsLeft = 30; jobsBtn.textContent = '⏱ 30'; say('Choose your four Vet Clinic jobs! You have 30 seconds.');
      jobsIv = setInterval(function () {
        jobsLeft--; jobsBtn.textContent = '⏱ ' + jobsLeft;
        if (jobsLeft <= 0) { clearInterval(jobsIv); jobsBtn.textContent = '✓ Jobs chosen'; A.timeUp(); say('Time! X-Ray Artists, start drawing the patient. Medical Writers, get your pencils ready!'); lab.checks[0] = true; }
      }, 1000);
    } });
    cleanup.push(function () { clearInterval(jobsIv); });

    var checks = el('div', { class: 'checks' }, D.LAB_STEPS.map(function (s, i) {
      return el('button', { class: 'check' + (lab.checks[i] ? ' on' : ''), type: 'button', onclick: function (ev) { A.tap(); lab.checks[i] = !lab.checks[i]; ev.currentTarget.classList.toggle('on'); } }, [el('i', { text: lab.checks[i] ? '✓' : String(i + 1) }), el('span', { text: s })]);
    }));

    var preview = el('div', { class: 'preview' });
    function sentences() {
      var P = lab.pick, an = /^[aeiou]/i.test(P.animal) ? 'an' : 'a';
      return g4 ? [
        'Patient: ' + P.name + ' (' + an + ' ' + P.animal + ').',
        'Diagnosis: It has got ' + P.symptom + ' because it ' + P.cause + '.',
        'It feels ' + P.feeling + ' today.',
        'Prescription: It should ' + P.should4 + '.',
        "Warning: It shouldn't " + P.shouldnt4 + '!'
      ] : [
        "Look at " + P.name + "! It's " + an + ' ' + P.animal + '.',
        'It is ' + P.feeling + ' and it has got ' + P.symptom + '.',
        'Give it ' + P.cure3 + ' and ' + P.cure3b + '!',
        'Now ' + P.name + ' is happy and healthy!'
      ];
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
    var rows = g4 ? [
      row('Patient', 'name', B.names),
      row('Pet Type', 'animal', B.animal),
      row('Symptom', 'symptom', B.symptom),
      row('Because…', 'cause', B.cause),
      row('Feels', 'feeling', B.feeling),
      row('Should', 'should4', B.should4),
      row("Shouldn't", 'shouldnt4', B.shouldnt4)
    ] : [
      row('Patient', 'name', B.names),
      row('Pet Type', 'animal', B.animal),
      row('Feeling', 'feeling', B.feeling),
      row('Has got', 'symptom', B.symptom),
      row('Give it 1', 'cure3', B.cure3),
      row('Give it 2', 'cure3b', B.cure3)
    ];

    paintPreview();
    var builder = el('div', { class: 'builder' }, [
      el('h4', { text: '🩺 Live Vet Prescription Builder · tap words to build your chart' }), preview
    ].concat([el('div', { class: 'row-btns tight' }, [
      el('button', { class: 'ps-btn violet sm', type: 'button', text: '🔊 Hear our Vet Report', onclick: function () { A.tap(); say(sentences().join(' ')); } }),
      el('button', { class: 'ps-btn ghost sm', type: 'button', text: '🎲 Random Case', onclick: function () {
        A.bubble(); var r = function (a) { return a[Math.floor(Math.random() * a.length)]; };
        lab.pick = {
          name: r(B.names), animal: r(B.animal), symptom: r(B.symptom), feeling: r(B.feeling),
          cause: r(B.cause), cure3: r(B.cure3), cure3b: r(B.cure3), should4: r(B.should4), shouldnt4: r(B.shouldnt4)
        };
        if (lab.pick.cure3b === lab.pick.cure3) lab.pick.cure3b = B.cure3[(B.cure3.indexOf(lab.pick.cure3) + 1) % B.cure3.length];
        body.innerHTML = ''; stLab(body);
      } })
    ])]).concat(rows));

    body.appendChild(el('div', { class: 'lab' }, [
      el('div', { class: 'lab-left' }, [el('div', { class: 'jobs-head' }, [el('h4', { text: '👥 4 Vet Clinic Roles' }), jobsBtn]), el('p', { class: 'jobs-note', text: 'Team of 5? Have two X-Ray Artists!' }), jobs, t.node, checks]),
      builder
    ]));
  }

  // ------------------------------------------------------------ 5. Production: Open the Vet Clinic!
  var shop = { cur: 0, done: {}, phase: 'sell', line: -1, spunQ: -1 };
  function stShop(body) {
    if (shop.phase === 'buy') return stBuy(body);
    if (shop.phase === 'awards') return stAwards(body);
    var n = state.teams.length, tm = team(shop.cur), frames = D.SELLER[state.grade], qs = D.QUESTIONS[state.grade];
    var timer = makeTimer(90, { compact: true, onEnd: function () { say('Great Vet Report! Health Inspectors, ask your check-up question!'); } });

    var order = el('div', { class: 'shop-order' }, state.teams.map(function (t, i) {
      return el('button', { class: 'so-team' + (i === shop.cur ? ' on' : '') + (shop.done[i] ? ' done' : ''), style: '--tc:' + t.color, type: 'button', onclick: function () { A.tap(); shop.cur = i; shop.line = -1; body.innerHTML = ''; stShop(body); } }, [
        el('span', { text: t.icon }), el('b', { text: t.name }), shop.done[i] ? el('i', { text: '✓' }) : null
      ]);
    }));
    var frameBtns = frames.map(function (f, i) {
      return el('button', { class: 'frame' + (i === shop.line ? ' on' : ''), type: 'button', html: colourise(f), onclick: function (ev) {
        A.tap(); shop.line = i; [].forEach.call(ev.currentTarget.parentNode.children, function (x) { x.classList.remove('on'); }); ev.currentTarget.classList.add('on');
        say(f);
      } });
    });
    var seller = el('div', { class: 'seller', style: '--tc:' + tm.color }, [
      el('div', { class: 'seller-head' }, [
        el('b', { text: tm.icon + ' ' + tm.name + ' · Vet Clinic Report' }),
        el('span', { text: 'Head Vet leads the diagnosis · Whole team says Line 5 together!' })
      ]),
      el('div', { class: 'frames' }, frameBtns)
    ]);

    var spinBtn = el('button', { class: 'ps-btn amber sm', type: 'button', text: '🎲 Spin Inspector Question!', onclick: function () {
      A.bubble();
      shop.spunQ = Math.floor(Math.random() * qs.length);
      body.innerHTML = ''; stShop(body);
      say('Health Inspector question: ' + qs[shop.spunQ].q);
    } });

    var buyers = el('div', { class: 'buyers' }, [
      el('div', { class: 'jobs-head' }, [el('h4', { text: '🔍 Health Inspector Questions' }), spinBtn])
    ].concat(qs.map(function (q, idx) {
      return el('button', { class: 'q-card' + (idx === shop.spunQ ? ' spun' : ''), type: 'button', onclick: function () { A.tap(); shop.spunQ = idx; say(q.q); } }, [
        el('b', { html: '❓ ' + colourise(q.q) }),
        el('small', { html: '→ ' + colourise(q.a) })
      ]);
    })));

    var others = state.teams.map(function (t, i) { return i; }).filter(function (i) { return i !== shop.cur; });
    var awards = el('div', { class: 'awards-row' }, [
      el('button', { class: 'ps-btn amber', type: 'button', text: '⭐⭐ Clear Diagnosis +2', onclick: function (ev) { addPts(shop.cur, 2, ev.currentTarget); say('Super clear Vet Report, ' + tm.name + '!'); } }),
      el('button', { class: 'ps-btn emerald', type: 'button', text: '🤝 Team Chorus +1', onclick: function (ev) { addPts(shop.cur, 1, ev.currentTarget); } }),
      el('span', { class: 'aw-lbl', text: 'Inspector Q +1:' })
    ].concat(others.map(function (i) {
      return el('button', { class: 'ps-btn tiny', style: '--tc:' + team(i).color, type: 'button', text: team(i).icon + ' ' + team(i).name, onclick: function (ev) { addPts(i, 1, ev.currentTarget); } });
    })));

    var allDone = Object.keys(shop.done).length >= n;
    var nextBtns = el('div', { class: 'row-btns' }, [
      el('button', { class: 'ps-btn violet', type: 'button', text: shop.done[shop.cur] ? '✓ Presented' : '✅ Patient Treated! Next Team ▶', onclick: function () {
        A.correct(); shop.done[shop.cur] = true; shop.line = -1; shop.spunQ = -1;
        var nx = -1; for (var k = 1; k <= n; k++) { if (!shop.done[(shop.cur + k) % n]) { nx = (shop.cur + k) % n; break; } }
        if (nx >= 0) { shop.cur = nx; say(team(nx).name + ', welcome to the Vet Clinic stage!'); } else say('Every team has treated their patient! Now let\'s award Healing Hearts!');
        body.innerHTML = ''; stShop(body);
      } }),
      el('button', { class: 'ps-btn emerald', type: 'button', text: '💚 Give Healing Hearts!', onclick: function () { A.coin(); shop.phase = 'buy'; body.innerHTML = ''; stShop(body); } }),
      el('button', { class: 'ps-btn amber', type: 'button', text: '🏆 Awards & Door Pass', onclick: function () { A.fanfare(); shop.phase = 'awards'; body.innerHTML = ''; stShop(body); } })
    ]);
    body.appendChild(el('div', { class: 'shop' }, [el('div', { class: 'shop-left' }, [order, timer.node, nextBtns]), el('div', { class: 'shop-mid' }, [seller, awards]), buyers]));
  }

  function stBuy(body) {
    var n = state.teams.length, total = 0;
    state.teams.forEach(function (t) { total += t.coins || 0; });
    var cards = state.teams.map(function (t) {
      return el('button', { class: 'buy-card', style: '--tc:' + t.color, type: 'button', onclick: function (ev) {
        t.coins = (t.coins || 0) + 1; A.coin(); burst(ev.currentTarget, '💚'); persist(); body.innerHTML = ''; stBuy(body);
      } }, [
        el('span', { class: 'buy-ic', text: t.icon }),
        el('b', { text: t.name }),
        el('div', { class: 'coins', text: (t.coins || 0) ? new Array((t.coins || 0) + 1).join('💚') : '—' }),
        el('i', { text: (t.coins || 0) + ' Healing Hearts' })
      ]);
    });
    body.appendChild(el('div', { class: 'buy' }, [
      el('p', { class: 'buy-help', html: 'Each team has <b>3 Healing Hearts (💚)</b> to give to <b>other</b> teams\' Vet Clinics! Say: <span class="k-can">"Your treatment healed the pet!"</span>' }),
      el('div', { class: 'buy-grid' }, cards),
      el('div', { class: 'row-btns' }, [
        el('span', { class: 'ps-pill', text: '💚 ' + total + ' / ' + n * 3 + ' Healing Hearts given' }),
        el('button', { class: 'ps-btn emerald', type: 'button', text: '🏆 Reveal Clinic Awards & Door Pass', disabled: total ? null : 'disabled', onclick: function () {
          var top = Math.max.apply(null, state.teams.map(function (t) { return t.coins || 0; }));
          state.teams.forEach(function (t, i) { if ((t.coins || 0) === top && top > 0) addPts(i, 3); });
          A.fanfare(); state.bestShop = state.teams.filter(function (t) { return (t.coins || 0) === top; }).map(function (t) { return t.name; });
          say('The Top Monster Vet Clinic is ' + state.bestShop.join(' and ') + '! Plus 3 bonus points!');
          shop.phase = 'awards'; body.innerHTML = ''; stShop(body);
        } }),
        el('button', { class: 'ps-btn ghost', type: 'button', text: '↺ Reset Hearts', onclick: function () { A.tap(); state.teams.forEach(function (t) { t.coins = 0; }); persist(); body.innerHTML = ''; stBuy(body); } }),
        el('button', { class: 'ps-btn ghost', type: 'button', text: '◀ Back to Vet Presentations', onclick: function () { A.tap(); shop.phase = 'sell'; body.innerHTML = ''; stShop(body); } })
      ])
    ]));
    if (!total) say('Each team has 3 Healing Hearts. Which clinic gave the best care? Say: Your treatment healed the pet!');
  }

  // ------------------------------------------------------------ Awards & Door Pass
  var TITLES = ['🏆 Chief Monster Vets', '🩺 Master Diagnosticians', '🎨 Super X-Ray Artists', '💚 Kindest Healers', '⏱️ Fast Emergency Team', '✨ Healthy Pet Champions'];
  function stAwards(body) {
    var ranked = state.teams.map(function (t, i) { return { t: t, i: i }; }).sort(function (a, b) { return (b.t.pts || 0) - (a.t.pts || 0); });
    var best = state.bestShop || [];
    var k2 = 0;
    var cards = ranked.map(function (r, k) {
      var title = best.indexOf(r.t.name) >= 0 ? TITLES[0] : TITLES[1 + (k2++ % (TITLES.length - 1))];
      return el('div', { class: 'award', style: '--tc:' + r.t.color + ';animation-delay:' + (k * 0.15) + 's' }, [
        el('div', { class: 'award-ic', text: r.t.icon }),
        el('b', { text: r.t.name }),
        el('span', { class: 'award-title', text: title }),
        r.t.pts ? el('i', { text: '⭐ ' + r.t.pts + (r.t.pts === 1 ? ' point' : ' points') }) : null
      ]);
    });
    var door = D.DOOR[state.grade];
    body.appendChild(el('div', { class: 'awards' }, [
      el('div', { class: 'award-grid' }, cards),
      el('div', { class: 'door' }, [
        el('div', { class: 'jobs-head' }, [
          el('h4', { text: '🚪 Vet Clinic Door Pass: say 1 diagnosis & cure sentence at the door!' }),
          el('button', { class: 'ps-btn ghost sm', type: 'button', text: '◀ Back to Clinic Stage', onclick: function () { A.tap(); shop.phase = 'sell'; body.innerHTML = ''; stShop(body); } })
        ]),
        el('div', { class: 'door-lines' }, door.map(function (l) { return el('button', { class: 'frame', type: 'button', html: '🔊 ' + colourise(l), onclick: function () { A.tap(); say(l); } }); })),
        el('div', { class: 'door-pets' }, D.PETS.map(function (p) {
          return el('button', { class: 'door-pet', type: 'button', onclick: function () {
            A.tap();
            var msg = state.grade === 4 ? (p.g4[1] + ' ' + p.g4[3]) : (p.g3[1] + ' ' + p.g3[2]);
            say(msg);
          } }, [el('img', { src: art(p.id), alt: p.kind }), el('span', { text: p.name })]);
        }))
      ])
    ]));
    A.fanfare(); confetti();
    say('Congratulations, Monster Vets! Every patient is healthy and happy!');
  }

  function confetti() {
    var icons = ['🩺', '💚', '🩹', '⭐', '🎃'];
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
    $('ps-class-lbl').textContent = 'Class ' + cls.toUpperCase() + ' · Grade ' + state.grade + (state.grade === 4 ? ' (A1+)' : ' (A1)') + ' · ' + state.teams.length + ' Vet Teams';
    $('ps-start').hidden = true; $('ps-app').hidden = false;
    renderTeams(); go(0);
    A.spooky();
    var p = PET[cauldron.order[0]];
    say('Welcome to the Monster Pet Vet Clinic, ' + cls.toUpperCase() + '! Our first patient is in the X-Ray Scanner. Clue 1: ' + (state.grade === 4 ? p.clues4 : p.clues3)[0]);
    try { history.replaceState(null, '', '?class=' + cls); } catch (e) { /* file:// */ }
  }
  function init() {
    var row = $('ps-class-row');
    ['3a', '3b', '4a', '4b'].forEach(function (c) {
      row.appendChild(el('button', { class: 'ps-btn class-btn', type: 'button', text: c.toUpperCase(), onclick: function () { A.unlock(); A.tap(); start(c); } }));
    });
    $('btn-prev').onclick = function () { A.tap(); go(state.step - 1); };
    $('btn-next').onclick = function () { A.tap(); if (state.step === STATIONS.length - 1) { state.done[state.step] = true; renderSteps(); shop.phase = 'awards'; go(4); } else go(state.step + 1); };
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
