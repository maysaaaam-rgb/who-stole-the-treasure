/* Monster Pet Vet Clinic: Pro CLIL + PPP Smartboard Engine (6 PPP Stages, 35 min total, zero cloud writes). */
(function (window) {
  'use strict';
  var D = window.PetShopData, A = window.PetAudio;
  var $ = function (id) { return document.getElementById(id); };
  var PET = {}; D.PETS.forEach(function (p) { PET[p.id] = p; });

  var state = { cls: '', grade: 3, step: 0, teams: [], turn: 0, lastSpeech: '', met: {}, checked: {}, done: {}, vocabFlipped: {}, vocabSeen: {} };

  var STATIONS = [
    {
      title: '1 · Presentation A: Symptoms, Cures & Grammar Rule',
      mins: '5 min',
      sub: 'PPP Presentation 1 · Learn the 6 CLIL cards & the 3-Step Grammar Rule',
      run: stVocab,
      say: ["What's the matter?", 'It has got a tummy ache.', 'Give it warm water!'],
      tips: [
        'PPP Presentation 1 (Meaning & Form): Start with the 3-Block Grammar Formula bar at the top. Tap each block so the class hears and sees the colour code.',
        'Tap each of the 6 Symptom Flashcards: first pupils hear and act out the SYMPTOM (amber), then tap "🔄 Flip to Cure" on the card to reveal the TREATMENT (green)!',
        'Every word has a giant icon and a TPR action so even emerging A1 learners grasp the meaning immediately.'
      ]
    },
    {
      title: '2 · Presentation B: Meet the 7 Patients (Vet Charts)',
      mins: '6 min',
      sub: 'PPP Presentation 2 · Inspect the 3-Box Medical Chart · Choral Echo & Check',
      run: stMeet,
      say: ["What's the matter?", 'It has got ___ because it ___.', 'It should ___.'],
      tips: [
        'PPP Presentation 2 (Contextualized Input & Pronunciation): Tap 4–5 patients on the Waiting Bench to open their 3-Box Medical Chart (1. Problem -> 2. Cause/Feeling -> 3. Prescription).',
        'Press "🔁 Repeat with Dr. Luna" for choral practice and "🎭 Act It Out!" for whole-class movement.',
        'Use the 1-tap "🩺 CLIL Quick Check" at the bottom of the chart to award +1 point to the team on turn!'
      ]
    },
    {
      title: '3 · Practice A: Medical X-Ray Scanner (Listening Game)',
      mins: '5 min',
      sub: 'PPP Controlled Practice 1 · Listen to 3 clinical clues · Diagnose the patient',
      run: stCauldron,
      say: ["What's the matter?", 'It has got a sore paw.', 'Put a bandage on it!'],
      tips: [
        'PPP Controlled Practice 1 (Receptive Deduction): Now that pupils know the words, scan the mystery patient inside the X-Ray Monitor!',
        'Read Clue 1 (Symptom). Teams whisper together. Tap "Next Clue" or tap the patient the team points to: 1 clue = 3 pts, 2 clues = 2 pts, 3 clues = 1 pt.',
        'Soft-fail only: wrong guesses never deduct points — Dr. Luna reveals the next symptom clue.'
      ]
    },
    {
      title: '4 · Practice B: Medicine Cabinet & Grammar Fixer',
      mins: '6 min',
      sub: 'PPP Controlled Practice 2 · Step 1: Pick the Cure (+1) · Step 2: Fix the Grammar (+1)',
      run: stPractice,
      say: ['Give it warm honey tea!', 'It should rest in bed.', "It shouldn't eat sweets!"],
      tips: [
        'PPP Controlled Practice 2 (2-Step Accuracy Game): Each patient case has 2 steps so teams practice both CLIL science AND target grammar.',
        'Step 1 (+1 pt): Choose the right treatment card from the Medicine Cabinet.',
        'Step 2 (+1 pt): Tap the missing grammar keyword (has got / is / Give for Grade 3; because / should / shouldn\'t for Grade 4) to heal the patient!'
      ]
    },
    {
      title: '5 · Production Prep: Team Vet Card Studio',
      mins: '6 min',
      sub: 'PPP Scaffolded Prep · 4 Vet Jobs · Fill in your Team Vet Report Card',
      run: stLab,
      say: ['Look at ___.', 'It has got ___.', 'Give it ___!', 'It should ___.'],
      tips: [
        'Give each team 1 printed Monster Vet Report Card (worksheet.html, page 1). Press "⏱ 30s Jobs Timer" to assign Head Vet, X-Ray Artist, Medical Writer, and Clinic Manager.',
        'Start the 6-minute timer. On the right, use the 4 clean tabs (1. Patient, 2. Symptom, 3. Cause/Feeling, 4. Cure) to model how the Live Vet Card fills in!',
        'Writers fill in the labelled boxes on paper while Artists draw the patient and bandage.'
      ]
    },
    {
      title: '6 · Production: Live Vet Clinic Show & Awards!',
      mins: '7 min',
      sub: 'PPP Free Production · Present your Patient · Spin Inspector Q · Healing Hearts',
      run: stShop,
      say: ['Welcome to our Monster Vet Clinic!', "What's the matter with it?", 'Why is it sick?', 'What should it do?'],
      tips: [
        'PPP Communicative Production: Each Vet Team comes to the front (90s timer). The Head Vet leads Lines 1–4, and the whole team says Line 5 together.',
        'Other teams are Health Inspectors: press "🎲 Spin Inspector Question!" on the board (+1 pt for asking, +1 pt for answering).',
        'Finish with "💚 Give Healing Hearts!" (3 hearts per team) and "🏆 Clinic Awards & Door Pass"!'
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
  // Cyan (.k-has) = Causes ("because...") & Body parts / has got
  // Emerald (.k-can) = Treatments ("Give it...", "should / shouldn't", "Put...", "Wash...")
  var SYMPTOMS = /\b(tummy ache|stomach ache|sore throat|sore wing|sore paw|hurt paw|hurt wing|tired legs|weak bones|bad cold|tired|hungry|thirsty|cold|scared|dizzy|dirty|muddy|shivering|shaking|exhausted|fever|hurts|hurt)\b/gi;
  var CAUSES = /\b(because|ate|flew|shouted|danced|rolled|jumped|has got|wing|paw|legs|throat|eyes)\b/gi;
  var CURES = /\b(shouldn&#39;t|should|Give it|Give|Put a|Put on|Wash it|warm water|honey tea|warm blanket|bandage|healthy milk|fresh fruit|pillow|quiet bed|soft bed|rest)\b/gi;

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
    if (state.step === 0 || state.step === 1 || state.step === 2) {
      linesForBar = state.grade === 4
        ? ["What's the matter?", 'It has got ___ because it ___.', 'It should ___.', "It shouldn't ___!"]
        : ["What's the matter?", 'It is tired and hungry.', 'It has got a tummy ache.', 'Give it warm water!'];
    } else if (state.step === 3) {
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
    $('ps-bg').style.backgroundImage = 'url(' + art(state.step >= 4 ? 'bg_patch' : 'bg') + ')';
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

  // ------------------------------------------------------------ 1. Presentation A: Symptoms, Cures & Grammar Rule
  function stVocab(body) {
    var g4 = state.grade === 4;
    var formulas = D.FORMULAS[state.grade] || D.FORMULAS[3];

    var formulaBar = el('div', { class: 'ppp-formula-bar' }, formulas.map(function (f) {
      return el('button', {
        class: 'ppp-formula-card ' + f.cls,
        type: 'button',
        onclick: function () { A.tap(); say(f.ex.replace(/^[^\w]+/, '')); }
      }, [
        f.img ? el('img', { class: 'ppp-f-img', src: f.img, alt: '' }) : null,
        el('div', { class: 'ppp-f-txt' }, [
          el('span', { class: 'ppp-f-tag', text: f.tag }),
          el('b', { class: 'ppp-f-pat', html: colourise(f.pattern) }),
          el('small', { class: 'ppp-f-ex', text: '🔊 ' + f.ex })
        ])
      ]);
    }));

    var grid = el('div', { class: 'vocab-grid' }, D.VOCAB.map(function (v) {
      var flipped = !!state.vocabFlipped[v.id];
      var seen = !!state.vocabSeen[v.id];
      var word = g4 ? v.word4 : v.word3;
      var cure = g4 ? v.cure4 : v.cure3;
      var imgSrc = flipped ? v.cureImg : v.symImg;

      var card = el('div', { class: 'vocab-card' + (flipped ? ' cure-mode' : '') + (seen ? ' seen' : '') }, [
        el('div', { class: 'vc-top', onclick: function () {
          A.tap(); state.vocabSeen[v.id] = true;
          var speech = flipped ? cure : (word + '. ' + (g4 ? v.cause4.replace(/[^\w\s!'.,]/g, '') : v.meaning));
          say(speech);
          card.classList.add('seen');
        } }, [
          el('span', { class: 'vc-badge', text: flipped ? '💊 CURE / ADVICE' : '🌡️ SYMPTOM' }),
          el('div', { class: 'vc-art-wrap' }, [
            el('img', { class: 'vc-img bob', src: imgSrc, alt: flipped ? cure : word })
          ]),
          el('b', { class: 'vc-word', html: colourise(flipped ? cure : word) }),
          el('small', { class: 'vc-sub', html: flipped ? '🔊 Tap picture to hear cure' : colourise(g4 ? v.cause4 : v.meaning) })
        ]),
        el('div', { class: 'vc-actions' }, [
          el('button', { class: 'ps-btn sm ' + (flipped ? 'amber' : 'emerald'), type: 'button', text: flipped ? '🌡️ See Symptom' : '💊 Flip to Cure!', onclick: function () {
            A.flip(); state.vocabFlipped[v.id] = !flipped; state.vocabSeen[v.id] = true;
            var nextSpeech = !flipped ? cure : word;
            say(nextSpeech);
            body.innerHTML = ''; stVocab(body);
          } }),
          el('button', { class: 'ps-btn ghost sm', type: 'button', text: '🎭 Act!', title: v.tpr, onclick: function () {
            A.correct(); state.vocabSeen[v.id] = true;
            say(v.tpr);
          } })
        ])
      ]);
      return card;
    }));

    body.appendChild(el('div', { class: 'vocab-stage' }, [
      formulaBar,
      grid
    ]));
  }

  // ------------------------------------------------------------ 2. Presentation B: Meet the 7 Patients (3-Box Vet Chart)
  function stMeet(body) {
    var count = Object.keys(state.met).length;
    var shelf = el('div', { class: 'shelf' });
    D.PETS.forEach(function (p) {
      shelf.appendChild(el('button', { class: 'pet-card' + (state.met[p.id] ? ' met' : ''), type: 'button', onclick: function () { A.flip(); openPet(body, p); } }, [
        el('div', { class: 'pet-art' }, [
          el('img', { class: 'bob', src: art(p.id), alt: p.kind }),
          p.symImg ? el('img', { class: 'pet-sym-thumb', src: p.symImg, alt: p.badge, title: p.badge }) : null,
          el('div', { class: 'ps-pedestal sm' })
        ]),
        el('div', { class: 'pet-tray' }, [
          el('b', { text: p.name + ' (' + p.kind + ')' }),
          el('span', { text: p.badge }),
          el('i', { class: 'price', text: '🌡️ ' + p.temp })
        ]),
        state.met[p.id] ? el('div', { class: 'met-tick', text: '✓' }) : null
      ]));
    });
    body.appendChild(el('div', { class: 'meet-head' }, [
      el('span', { class: 'ps-pill', text: '🩺 Checked ' + count + ' / ' + D.PETS.length + ' patients' }),
      el('span', { class: 'legend', html: '<span class="k-col">🌡️ Symptom</span> <span class="k-has">🦠 Cause / Body</span> <span class="k-can">💊 Cure / Should</span>' })
    ]));
    body.appendChild(shelf);
    if (!count) say('Here is our Clinic Waiting Bench! Tap a patient to open its 3-Box Medical Chart.', false);
  }

  function openPet(body, p) {
    state.met[p.id] = true;
    var g4 = state.grade === 4;
    var ls = lines(p);

    // Build a super clear 3-Box Visual Medical Chart with real 3D illustrations
    var boxes = g4 ? [
      { tag: '1 · 🌡️ SYMPTOM & CAUSE (because)', img: p.symImg, icon: p.symptomIcon, cls: 'box-sym', line: p.chart4.symptom + ' ' + p.chart4.cause, sub: p.chart4.state },
      { tag: '2 · ✅ VET ADVICE (It should…)', img: p.cureImg, icon: p.cureIcon, cls: 'box-cure', line: p.chart4.should, sub: 'Helps the patient recover fast!' },
      { tag: "3 · 🚫 WARNING (It shouldn't…)", img: art(p.id), icon: '🚫', cls: 'box-warn', line: p.chart4.shouldnt, sub: 'Keep the patient safe!' }
    ] : [
      { tag: "1 · 🌡️ PROBLEM (What's the matter?)", img: p.symImg, icon: p.symptomIcon, cls: 'box-sym', line: p.chart3.symptom, sub: p.chart3.detail },
      { tag: '2 · 💊 TREATMENT (Give it…)', img: p.cureImg, icon: p.cureIcon, cls: 'box-cure', line: p.chart3.cure, sub: 'Helps the pet feel better!' },
      { tag: '3 · 💚 HEALTHY RESULT', img: art(p.id), icon: '💚', cls: 'box-res', line: p.chart3.result, sub: 'Say it together with a big smile!' }
    ];

    var chartCards = boxes.map(function (b) {
      return el('button', { class: 'chart-box ' + b.cls, type: 'button', onclick: function (ev) {
        A.tap();
        [].forEach.call(ev.currentTarget.parentNode.children, function (x) { x.classList.remove('on'); });
        ev.currentTarget.classList.add('on');
        say(b.line);
      } }, [
        b.img ? el('img', { class: 'cb-img', src: b.img, alt: '' }) : el('div', { class: 'cb-icon', text: b.icon }),
        el('div', { class: 'cb-body' }, [
          el('span', { class: 'cb-tag', text: b.tag }),
          el('b', { class: 'cb-line', html: '🔊 ' + colourise(b.line) }),
          el('small', { class: 'cb-sub', text: b.sub })
        ])
      ]);
    });

    var echoing = false;
    function echo() {
      if (echoing) return; echoing = true;
      var i = 0;
      (function nxt() {
        if (i >= chartCards.length || !document.body.contains(chartCards[0])) {
          echoing = false;
          chartCards.forEach(function (c) { c.classList.remove('on'); });
          return;
        }
        chartCards.forEach(function (c) { c.classList.remove('on'); });
        chartCards[i].classList.add('on');
        say((i === 0 ? 'Repeat after me. ' : '') + boxes[i].line).then(function () { i++; setTimeout(nxt, 2300); });
      })();
    }

    // CLIL Quick Comprehension Check inside the pet panel
    var chk = g4 ? p.check4 : p.check3;
    var choices = shuffle([chk.right].concat(chk.wrong));
    var checkSolved = !!state.checked[p.id];
    var checkBox = el('div', { class: 'clil-check' }, [
      el('div', { class: 'clil-check-head' }, [
        el('b', { text: '🩺 Quick Check (' + team(state.turn).name + '): ' + chk.q }),
        checkSolved ? el('span', { class: 'ps-pill emerald', text: '✓ +1 Pt Awarded' }) : null
      ]),
      el('div', { class: 'clil-check-opts' }, choices.map(function (ans) {
        var btn = el('button', { class: 'ps-btn ghost sm' + (checkSolved && ans === chk.right ? ' emerald' : ''), type: 'button', html: colourise(ans) });
        btn.addEventListener('click', function () {
          if (state.checked[p.id]) { say(ans.replace(/^[^\w]+/, '')); return; }
          if (ans === chk.right) {
            state.checked[p.id] = true;
            btn.className = 'ps-btn emerald sm';
            var mainImg = panel.querySelector('.pet-panel-art img.bob');
            if (mainImg) mainImg.src = art(p.id);
            addPts(state.turn, 1, btn);
            nextTurn();
            hostReact('cheer');
            say('Correct! ' + ans.replace(/^[^\w]+/, ''));
          } else {
            A.softFail(); wobble(btn); hostReact('oops');
            say('Look at Box 1 on the chart! ' + chk.q);
          }
        });
        return btn;
      }))
    ]);

    var act = el('div', { class: 'act-big', hidden: 'hidden', text: p.act });
    var panel = el('div', { class: 'pet-panel' }, [
      el('div', { class: 'pet-panel-art' }, [
        el('div', { class: 'patient-vitals', text: '🌡️ Temp: ' + p.temp + ' · ' + p.badge }),
        el('img', { class: 'bob', src: checkSolved ? art(p.id) : (p.symImg || art(p.id)), alt: p.kind }),
        el('div', { class: 'ps-pedestal' }),
        act
      ]),
      el('div', { class: 'pet-panel-text' }, [
        el('div', { class: 'chart-title-row' }, [
          el('h3', { text: '🏥 Medical Chart: ' + p.name + ' (' + p.kind + ')' }),
          el('button', { class: 'ps-btn ghost sm', type: 'button', text: '◀ Waiting Bench', onclick: function () { A.tap(); window.speechSynthesis && window.speechSynthesis.cancel(); body.innerHTML = ''; stMeet(body); } })
        ]),
        el('div', { class: 'chart-boxes' }, chartCards),
        checkBox,
        el('div', { class: 'row-btns' }, [
          el('button', { class: 'ps-btn violet sm', type: 'button', text: '🔁 Repeat with Dr. Luna', onclick: function () { A.tap(); echo(); } }),
          el('button', { class: 'ps-btn amber sm', type: 'button', text: '🎭 Act Symptom & Cure!', onclick: function () { A.correct(); act.hidden = false; say(p.act.replace(/^\S+\s/, '') + ' Everybody act it out!'); setTimeout(function () { act.hidden = true; }, 2800); } })
        ])
      ])
    ]);
    body.innerHTML = ''; body.appendChild(panel);
    say(ls.join(' '));
  }

  // ------------------------------------------------------------ 3. Practice A: Medical X-Ray Scanner
  var cauldron = null;
  function stCauldron(body) {
    if (!cauldron) cauldron = { order: shuffle(D.PETS.map(function (p) { return p.id; })).slice(0, 6), round: 0, clue: 1, solved: false };
    var c = cauldron, p = PET[c.order[c.round]], clues = state.grade === 4 ? p.clues4 : p.clues3;
    var opts = shuffle([p.id].concat(shuffle(D.PETS.filter(function (x) { return x.id !== p.id; }).map(function (x) { return x.id; })).slice(0, 3)));

    // Digital Medical X-Ray Scanner Monitor (replaces cauldron graphic!)
    var pot = el('div', { class: 'xray-monitor' + (c.solved ? ' solved' : '') }, [
      el('div', { class: 'xray-hud-top' }, [
        el('span', { text: '🔬 X-RAY SCAN #' + (c.round + 1) }),
        el('span', { text: '🌡️ ' + p.temp })
      ]),
      el('div', { class: 'xray-screen' }, [
        el('div', { class: 'xray-scan-beam' }),
        c.solved
          ? el('img', { class: 'xray-pet-reveal bob', src: art(p.id), alt: p.name })
          : el('div', { class: 'xray-mystery' }, [
              el('div', { class: 'xray-mystery-imgs' }, [
                el('img', { src: p.symImg, alt: 'Symptom' }),
                el('span', { class: 'xray-q', text: '❓' }),
                el('img', { src: p.cureImg, alt: 'Cure' })
              ]),
              el('span', { text: 'MYSTERY PATIENT' }),
              el('small', { text: p.badge })
            ])
      ]),
      el('div', { class: 'xray-hud-bot', text: c.solved ? ('✅ ADMITTED: ' + p.name.toUpperCase() + ' (' + p.kind + ')') : '📡 Scanning symptoms… Listen & choose below!' })
    ]);

    var clueBox = el('div', { class: 'clues' });
    clues.forEach(function (cl, i) {
      var shown = i < c.clue || c.solved;
      clueBox.appendChild(el('button', { class: 'clue' + (shown ? '' : ' hidden'), type: 'button', html: '<em>Clue ' + (i + 1) + '</em>' + (shown ? colourise(cl) : '🔒 Tap "Next X-Ray Clue" to scan'),
        onclick: function () { if (shown) { A.tap(); say(cl.replace(/^[^\w]+/, '')); } } }));
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
          say(c.clue < 3 ? "Not that patient! Let's scan the next symptom clue." : 'Listen closely to Clue 3: ' + clues[2].replace(/^[^\w]+/, ''));
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
      c.solved ? null : el('button', { class: 'ps-btn ghost', type: 'button', text: '🔊 Read clue again', onclick: function () { A.tap(); say(clues[c.clue - 1].replace(/^[^\w]+/, '')); } }),
      c.solved && c.round < c.order.length - 1 ? el('button', { class: 'ps-btn amber', type: 'button', text: '🩺 Scan Next Patient ▶', onclick: function () {
        A.bubble(); c.round++; c.clue = 1; c.solved = false; nextTurn(); stCauldronRefresh(body, true);
      } }) : null,
      c.solved && c.round === c.order.length - 1 ? el('button', { class: 'ps-btn emerald', type: 'button', text: '✅ All Scanned! Go to Medicine Cabinet ▶', onclick: function () { go(3); } }) : null
    ]);

    body.appendChild(el('div', { class: 'cauldron-layout' }, [
      el('div', { class: 'cauldron-left' }, [pot]),
      el('div', { class: 'cauldron-right' }, [turnBanner(c.solved ? 'Patient admitted! Great listening!' : 'Listen to the X-Ray clues, whisper in your team, then tap the patient!'), clueBox, grid, actions])
    ]));
  }
  function stCauldronRefresh(body, speakClue) {
    body.innerHTML = ''; stCauldron(body);
    if (speakClue && cauldron && !cauldron.solved) {
      var p = PET[cauldron.order[cauldron.round]], clues = state.grade === 4 ? p.clues4 : p.clues3;
      say(clues[cauldron.clue - 1].replace(/^[^\w]+/, ''));
    }
  }

  // ------------------------------------------------------------ 4. Practice B: 2-Step Medicine Cabinet + Grammar Fixer
  var prac = { round: 0, step1Solved: {}, step2Solved: {}, optsCache: {} };
  function stPractice(body) {
    var rounds = D.PRACTICE[state.grade] || D.PRACTICE[3];
    if (prac.round >= rounds.length) prac.round = 0;
    var r = rounds[prac.round], p = PET[r.pet];
    var key = state.grade + '-' + prac.round;
    if (!prac.optsCache[key]) prac.optsCache[key] = shuffle([r.right].concat(r.wrong));
    var opts = prac.optsCache[key];
    var s1 = !!prac.step1Solved[key];
    var s2 = !!prac.step2Solved[key];

    function optImg(txt) {
      var s = txt.toLowerCase();
      if (s.indexOf('water') >= 0) return 'art/cure_water.webp';
      if (s.indexOf('blanket') >= 0) return 'art/cure_blanket.webp';
      if (s.indexOf('tea') >= 0 || s.indexOf('honey') >= 0) return 'art/cure_tea.webp';
      if (s.indexOf('bandage') >= 0) return 'art/cure_bandage.webp';
      if (s.indexOf('wash') >= 0 || s.indexOf('pillow') >= 0 || s.indexOf('bed') >= 0) return 'art/cure_pillow.webp';
      if (s.indexOf('milk') >= 0 || s.indexOf('fruit') >= 0) return 'art/cure_milk.webp';
      if (s.indexOf('cold') >= 0 || s.indexOf('ice') >= 0 || s.indexOf('rain') >= 0) return 'art/sym_cold.webp';
      if (s.indexOf('shout') >= 0 || s.indexOf('sing') >= 0) return 'art/sym_throat.webp';
      if (s.indexOf('jump') >= 0 || s.indexOf('run') >= 0 || s.indexOf('fly') >= 0) return 'art/sym_paw.webp';
      if (s.indexOf('mud') >= 0 || s.indexOf('spin') >= 0) return 'art/sym_dizzy.webp';
      if (s.indexOf('dance') >= 0) return 'art/sym_bones.webp';
      return 'art/sym_tummy.webp';
    }

    var leftCol = el('div', { class: 'med-patient-card' }, [
      el('div', { class: 'patient-vitals', text: '🏥 Case ' + (prac.round + 1) + ' of ' + rounds.length + ' · ' + p.temp }),
      el('div', { class: 'med-art-stage' }, [
        el('img', { class: 'bob med-pet-img', src: s1 ? art(p.id) : (p.symImg || art(p.id)), alt: p.kind }),
        s1 && r.rightImg ? el('img', { class: 'med-cure-badge-img', src: r.rightImg, alt: 'Cure' }) : null
      ]),
      el('div', { class: 'ps-pedestal sm' }),
      el('div', { class: 'med-status' + (s2 ? ' healed' : ''), text: s2 ? ('💚 ' + p.name + ' is 100% Healed!') : (s1 ? ('💊 Medicine picked! Now fix the grammar!') : ('🤒 ' + p.badge)) })
    ]);

    var optBtns = opts.map(function (optText) {
      var b = el('button', {
        class: 'med-opt' + (s1 && optText === r.right ? ' right' : ''),
        type: 'button'
      }, [
        el('img', { class: 'med-opt-img', src: optImg(optText), alt: '' }),
        el('span', { class: 'med-opt-txt', html: colourise(optText) })
      ]);
      b.addEventListener('click', function () {
        if (prac.step1Solved[key]) { say(optText.replace(/^[^\w]+/, '')); return; }
        if (optText === r.right) {
          prac.step1Solved[key] = true;
          addPts(state.turn, 1, b);
          hostReact('cheer');
          say('Correct medicine! Plus 1 point! Now complete Step 2: the Grammar Check!');
          body.innerHTML = ''; stPractice(body);
        } else {
          A.softFail(); wobble(b); hostReact('oops');
          say("Oops! That won't help " + p.name + '. Look at the symptom and try another cure!');
        }
      });
      return b;
    });

    // Step 2: PPP Grammar Slot Builder (appears once Step 1 is solved, or always visible as Step 2)
    var grammarBox = el('div', { class: 'grammar-fixer' + (s1 ? ' active' : ' locked') }, [
      el('div', { class: 'gf-head' }, [
        el('b', { html: '🧩 ' + colourise(r.grammarQ) }),
        s2 ? el('span', { class: 'ps-pill emerald', text: '✓ +1 Grammar Pt' }) : el('span', { class: 'ps-pill', text: s1 ? 'Tap the right word (+1 pt)' : 'Solve Step 1 first' })
      ]),
      el('div', { class: 'gf-opts' }, r.grammarOpts.map(function (gw) {
        var gBtn = el('button', {
          class: 'ps-btn sm ' + (s2 && gw === r.grammarRight ? 'emerald' : 'ghost'),
          type: 'button',
          disabled: s1 ? null : 'disabled',
          text: gw
        });
        gBtn.addEventListener('click', function () {
          if (!prac.step1Solved[key] || prac.step2Solved[key]) { say(r.grammarFull); return; }
          if (gw === r.grammarRight) {
            prac.step2Solved[key] = true;
            addPts(state.turn, 1, gBtn);
            hostReact('cheer');
            say('Perfect grammar! ' + r.grammarFull);
            body.innerHTML = ''; stPractice(body);
          } else {
            A.softFail(); wobble(gBtn); hostReact('oops');
            say('Try another grammar word! Listen: ' + r.grammarQ.replace('___', '...'));
          }
        });
        return gBtn;
      }))
    ]);

    var navRow = el('div', { class: 'row-btns' }, [
      el('button', { class: 'ps-btn ghost sm', type: 'button', text: '🔊 Read Case Chart', onclick: function () { A.tap(); say(r.problem + ' ' + r.q); } }),
      s1 && prac.round < rounds.length - 1 ? el('button', { class: 'ps-btn amber sm', type: 'button', text: '💊 Next Patient Case ▶', onclick: function () {
        A.bubble(); prac.round++; nextTurn(); body.innerHTML = ''; stPractice(body);
        var nr = rounds[prac.round]; say(nr.problem);
      } }) : null,
      s1 && prac.round === rounds.length - 1 ? el('button', { class: 'ps-btn emerald sm', type: 'button', text: '✅ All Patients Treated! Go to Team Vet Studio ▶', onclick: function () { go(4); } }) : null
    ]);

    var rightCol = el('div', { class: 'med-right' }, [
      turnBanner(s2 ? 'Case complete! Say the whole sentence together!' : (s1 ? 'Now tap the missing grammar word in Step 2!' : 'Step 1: Read the symptom & pick the right cure from the Medicine Cabinet!')),
      el('div', { class: 'med-chart' }, [
        el('div', { class: 'med-problem', html: '📋 ' + colourise(r.problem) }),
        el('div', { class: 'med-q', text: '🩺 ' + r.q })
      ]),
      el('div', { class: 'med-grid' }, optBtns),
      grammarBox,
      navRow
    ]);

    body.appendChild(el('div', { class: 'med-layout' }, [leftCol, rightCol]));
  }

  // ------------------------------------------------------------ 5. Production Prep: Team Vet Card Studio (Clean 4-Tab Picker)
  var lab = { timer: null, tab: 0, pick: {}, checks: {} };
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
    var t = makeTimer(6 * 60, {
      warnAt: 120,
      warnText: 'Two minutes left! Practise reading your Vet Report Card together.',
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
        if (jobsLeft <= 0) { clearInterval(jobsIv); jobsBtn.textContent = '✓ Jobs chosen'; A.timeUp(); say('Time! X-Ray Artists, draw the patient. Medical Writers, fill in the boxes on your card!'); lab.checks[0] = true; }
      }, 1000);
    } });
    cleanup.push(function () { clearInterval(jobsIv); });

    var checks = el('div', { class: 'checks' }, D.LAB_STEPS.map(function (s, i) {
      return el('button', { class: 'check' + (lab.checks[i] ? ' on' : ''), type: 'button', onclick: function (ev) { A.tap(); lab.checks[i] = !lab.checks[i]; ev.currentTarget.classList.toggle('on'); } }, [el('i', { text: lab.checks[i] ? '✓' : String(i + 1) }), el('span', { text: s })]);
    }));

    var preview = el('div', { class: 'preview vet-card-preview' });
    function sentences() {
      var P = lab.pick, an = /^[aeiou]/i.test(P.animal) ? 'an' : 'a';
      return g4 ? [
        '1 · Patient: ' + P.name + ' (' + an + ' ' + P.animal + ').',
        '2 · Diagnosis: It has got ' + P.symptom + ' because it ' + P.cause + '.',
        '3 · State: It feels ' + P.feeling + ' today.',
        '4 · Advice (Do): It should ' + P.should4 + '.',
        "5 · Warning (Don't): It shouldn't " + P.shouldnt4 + '!'
      ] : [
        '1 · Patient: Look at ' + P.name + "! It's " + an + ' ' + P.animal + '.',
        '2 · Problem: It is ' + P.feeling + ' and it has got ' + P.symptom + '.',
        '3 · Treatment: Give it ' + P.cure3 + ' and ' + P.cure3b + '!',
        '4 · Result: Now ' + P.name + ' is happy and healthy!'
      ];
    }
    function paintPreview() {
      var P = lab.pick;
      var imgAnim = D.IMG_MAP && D.IMG_MAP[P.animal] ? '<img class="vcp-img" src="' + D.IMG_MAP[P.animal] + '" alt="">' : (D.ICONS[P.animal] || '🐾');
      var imgSym = D.IMG_MAP && D.IMG_MAP[P.symptom] ? '<img class="vcp-img" src="' + D.IMG_MAP[P.symptom] + '" alt="">' : (D.ICONS[P.symptom] || '🤒');
      var cureKey = g4 ? P.should4 : P.cure3;
      var imgCure = D.IMG_MAP && D.IMG_MAP[cureKey] ? '<img class="vcp-img" src="' + D.IMG_MAP[cureKey] + '" alt="">' : (D.ICONS[cureKey] || '💊');
      preview.innerHTML =
        '<div class="vcp-badges"><span>' + imgAnim + ' <b>' + esc(P.name) + '</b></span><span>' + imgSym + ' <b>' + esc(P.symptom) + '</b></span><span>' + imgCure + ' <b>' + esc(cureKey) + '</b></span></div>' +
        sentences().map(function (s) { return '<p>' + colourise(s) + '</p>'; }).join('');
    }

    function row(label, key, list) {
      return el('div', { class: 'b-row' }, [el('span', { class: 'b-lbl', text: label }), el('div', { class: 'b-chips' }, list.map(function (w) {
        var ic = D.ICONS[w];
        var imgUrl = D.IMG_MAP && D.IMG_MAP[w];
        return el('button', {
          class: 'chip' + (String(lab.pick[key]) === String(w) ? ' on' : '') + (imgUrl ? ' has-img' : ''),
          type: 'button',
          onclick: function (ev) {
            A.tap(); lab.pick[key] = w; [].forEach.call(ev.currentTarget.parentNode.children, function (x) { x.classList.remove('on'); }); ev.currentTarget.classList.add('on'); paintPreview();
          }
        }, [
          imgUrl ? el('img', { class: 'chip-img', src: imgUrl, alt: '' }) : null,
          el('span', { text: (!imgUrl && ic ? ic + ' ' : '') + String(w) })
        ]);
      }))]);
    }

    var tabDefs = g4 ? [
      { lbl: '1 · 🐾 Patient', rows: [row('Name', 'name', B.names), row('Pet Type', 'animal', B.animal)] },
      { lbl: '2 · 🤒 Symptom', rows: [row('Has got', 'symptom', B.symptom), row('Feels', 'feeling', B.feeling)] },
      { lbl: '3 · 🦠 Because…', rows: [row('Because it', 'cause', B.cause)] },
      { lbl: '4 · 💊 Should / Not', rows: [row('It should', 'should4', B.should4), row("Shouldn't", 'shouldnt4', B.shouldnt4)] }
    ] : [
      { lbl: '1 · 🐾 Patient', rows: [row('Name', 'name', B.names), row('Pet Type', 'animal', B.animal)] },
      { lbl: '2 · 🤒 Problem', rows: [row('It is…', 'feeling', B.feeling), row('Has got', 'symptom', B.symptom)] },
      { lbl: '3 · 💊 Give it (1)', rows: [row('Give it', 'cure3', B.cure3)] },
      { lbl: '4 · 🛌 Give it (2)', rows: [row('And…', 'cure3b', B.cure3)] }
    ];

    if (lab.tab >= tabDefs.length) lab.tab = 0;
    var tabBar = el('div', { class: 'studio-tabs' }, tabDefs.map(function (tb, idx) {
      return el('button', {
        class: 'studio-tab' + (idx === lab.tab ? ' on' : ''),
        type: 'button',
        text: tb.lbl,
        onclick: function () { A.tap(); lab.tab = idx; body.innerHTML = ''; stLab(body); }
      });
    }));

    paintPreview();
    var builder = el('div', { class: 'builder' }, [
      el('div', { class: 'jobs-head' }, [
        el('h4', { text: '🩺 Live Team Vet Report Card (Matches Printable Page 1)' }),
        el('div', { class: 'row-btns tight' }, [
          el('button', { class: 'ps-btn violet sm', type: 'button', text: '🔊 Hear Report', onclick: function () { A.tap(); say(sentences().map(function (s) { return s.replace(/^\d\s·\s[^:]+:\s/, ''); }).join(' ')); } }),
          el('button', { class: 'ps-btn ghost sm', type: 'button', text: '🎲 Random Case', onclick: function () {
            A.bubble(); var r = function (a) { return a[Math.floor(Math.random() * a.length)]; };
            lab.pick = {
              name: r(B.names), animal: r(B.animal), symptom: r(B.symptom), feeling: r(B.feeling),
              cause: r(B.cause), cure3: r(B.cure3), cure3b: r(B.cure3), should4: r(B.should4), shouldnt4: r(B.shouldnt4)
            };
            if (lab.pick.cure3b === lab.pick.cure3) lab.pick.cure3b = B.cure3[(B.cure3.indexOf(lab.pick.cure3) + 1) % B.cure3.length];
            body.innerHTML = ''; stLab(body);
          } })
        ])
      ]),
      preview,
      tabBar,
      el('div', { class: 'studio-tab-body' }, tabDefs[lab.tab].rows)
    ]);

    body.appendChild(el('div', { class: 'lab' }, [
      el('div', { class: 'lab-left' }, [el('div', { class: 'jobs-head' }, [el('h4', { text: '👥 4 Vet Clinic Roles' }), jobsBtn]), el('p', { class: 'jobs-note', text: 'Team of 5? Have two X-Ray Artists!' }), jobs, t.node, checks]),
      builder
    ]));
  }

  // ------------------------------------------------------------ 6. Production: Open the Vet Clinic!
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
        say(f.replace(/^\d\s·\s[^:]+:\s/, ''));
      } });
    });
    var seller = el('div', { class: 'seller', style: '--tc:' + tm.color }, [
      el('div', { class: 'seller-head' }, [
        el('b', { text: tm.icon + ' ' + tm.name + ' · Live Vet Presentation' }),
        el('span', { text: 'Tap any line to hear a model · Whole team says Line 5 together!' })
      ]),
      el('div', { class: 'frames' }, frameBtns)
    ]);

    var spinBtn = el('button', { class: 'ps-btn amber sm', type: 'button', text: '🎲 Spin Question!', onclick: function () {
      A.bubble();
      shop.spunQ = Math.floor(Math.random() * qs.length);
      body.innerHTML = ''; stShop(body);
      say('Health Inspector question: ' + qs[shop.spunQ].q);
    } });

    var buyers = el('div', { class: 'buyers' }, [
      el('div', { class: 'jobs-head' }, [el('h4', { text: '🔍 Inspector Q&A' }), spinBtn])
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
    say('Welcome to the Monster Pet Vet Clinic, ' + cls.toUpperCase() + '! Let\'s learn our Vet Clinic symptoms, treatments, and 3-step grammar rule first!');
    try { history.replaceState(null, '', '?class=' + cls); } catch (e) { /* file:// */ }
  }
  function init() {
    var row = $('ps-class-row');
    ['3a', '3b', '4a', '4b'].forEach(function (c) {
      row.appendChild(el('button', { class: 'ps-btn class-btn', type: 'button', text: c.toUpperCase(), onclick: function () { A.unlock(); A.tap(); start(c); } }));
    });
    $('btn-prev').onclick = function () { A.tap(); go(state.step - 1); };
    $('btn-next').onclick = function () { A.tap(); if (state.step === STATIONS.length - 1) { state.done[state.step] = true; renderSteps(); shop.phase = 'awards'; go(5); } else go(state.step + 1); };
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
