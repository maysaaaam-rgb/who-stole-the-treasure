/* Monster Pet Vet Clinic: Super-Easy 35-Min Whole-Class + Individual PPP Engine (Zero Group Work, 3 Short Lines per Pet). */
(function (window) {
  'use strict';
  var D = window.PetShopData, A = window.PetAudio;
  var $ = function (id) { return document.getElementById(id); };
  var PET = {}; D.PETS.forEach(function (p) { PET[p.id] = p; });

  var state = { cls: '', grade: 3, step: 0, teams: [], turn: 0, lastSpeech: '', met: {}, checked: {}, done: {}, vocabFlipped: {}, vocabSeen: {}, braveVets: 0 };

  var STATIONS = [
    {
      title: '1 · Presentation A: 6 Problems, 6 Cures & Grammar Rule',
      mins: '5 min',
      sub: 'Whole Class PPP · Tap the 3-Block Rule & Flip the 6 Picture Cards',
      run: stVocab,
      say: ["What's the matter?", 'It has got a tummy ache.', 'Give it warm water!'],
      tips: [
        'Whole Class (5 min): Tap the 3 Grammar Rule blocks at the top so everyone hears the 3-step pattern.',
        'Tap each of the 6 Picture Cards: first students repeat the PROBLEM and do the mime ("🎭 Act!"), then tap "💊 Flip to Cure!" to see the 2-word picture cure!',
        'Only 2 words per card — super easy for every student to remember.'
      ]
    },
    {
      title: '2 · Presentation B: Meet the 6 Patients (3 Short Lines)',
      mins: '6 min',
      sub: 'Whole Class Choral Echo · Only 3 short lines per pet + 1-Tap Picture Check',
      run: stMeet,
      say: ["What's the matter?", 'It has got a tummy ache.', 'It should drink warm water.'],
      tips: [
        'Whole Class (6 min): Tap a patient on the Waiting Bench to open its 3-Box Picture Chart (only 5–6 words per line!).',
        'Press "🔁 Echo 3 Lines" so the whole class repeats after Dr. Luna.',
        'Call 1 student to tap the 2-word Picture Check at the bottom (+1 Star!).'
      ]
    },
    {
      title: '3 · Practice A: Medical X-Ray Scanner (1 Student at a Time)',
      mins: '6 min',
      sub: 'Controlled Practice 1 · Call 1 student to the board · Listen & tap the pet!',
      run: stCauldron,
      say: ["What's the matter?", 'It has got a hurt paw.', 'Give it a bandage!'],
      tips: [
        'Individual Student Turn (6 min): Call 1 student to the smartboard for each X-Ray scan!',
        'Look at the Problem & Cure pictures inside the X-Ray screen and listen to the 5-word clue.',
        'The student taps the matching pet card (+3, +2, or +1 Star). Zero penalty for wrong taps!'
      ]
    },
    {
      title: '4 · Practice B: Medicine Cabinet (2-Word Picture Buttons)',
      mins: '6 min',
      sub: 'Controlled Practice 2 · Step 1: Tap the Cure Picture · Step 2: Tap 1 Grammar Word',
      run: stPractice,
      say: ['Give it warm tea!', 'It should drink warm water.', "It shouldn't eat sweets!"],
      tips: [
        'Individual Student Turn (6 min): Call 1 student to the smartboard!',
        'Step 1 (+1 Star): All 4 Medicine Cabinet buttons have a big 3D picture + ONLY 2 words (no long sentences to read!).',
        'Step 2 (+1 Star): Tap 1 grammar word (has got / Give for Grade 3; should / shouldn\'t for Grade 4) and the whole class repeats the sentence!'
      ]
    },
    {
      title: '5 · Individual Practice: "Circle & Say" Vet Sheet (At Desks)',
      mins: '7 min',
      sub: 'Individual Desk Work (No Group Work!) · Circle 3 Pictures + Write 1 Pet Name',
      run: stLab,
      say: ['Look at Shadow!', 'It has got a tummy ache.', 'Give it warm water!'],
      tips: [
        'Individual Desk Work (7 min — NO group work!): Give each student 1 "Circle & Say" Vet Check-Up Sheet (worksheet.html, page 1).',
        'Students do NOT have to write long sentences: they write ONLY the pet\'s name, CIRCLE 1 pet picture, CIRCLE 1 problem picture, and CIRCLE 1 cure picture!',
        'Use the 3 tabs on the board to model how circling the pictures builds their 3 short speaking lines.'
      ]
    },
    {
      title: '6 · Production: Brave Vet Stand-Up & Class Finale!',
      mins: '5 min',
      sub: 'Individual Volunteers (3 Short Lines) · Spin 1 Easy Question · Whole-Class Finale',
      run: stShop,
      say: ["What's the matter?", 'It has got a tummy ache.', 'Give it warm water!'],
      tips: [
        'Individual Speaking (5 min): Invite 4–5 Brave Vet volunteers to stand at their desk (or front) and read the 3 short lines they circled on their sheet!',
        'Tap "✅ Brave Vet Spoke! (+2 Stars)" for each volunteer and press "🎲 Spin 1 Easy Question!" for a quick check.',
        'Press "🏆 Class Finale & Exit Pass!" so everyone reads their 3 lines together and gets their Vet Star!'
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

  // Simple colour coding:
  // Amber (.k-col) = Problems (tummy ache, cold, sore throat, hurt paw, tired, hungry)
  // Cyan (.k-has) = Grammar verb (has got / is)
  // Emerald (.k-can) = Cures (Give it, should, shouldn't, warm water, blanket, tea, bandage, bed, milk)
  var SYMPTOMS = /\b(tummy ache|bad cold|sore throat|hurt paw|tired|dizzy|hungry|weak|cold)\b/gi;
  var CAUSES = /\b(has got|What&#39;s the matter)\b/gi;
  var CURES = /\b(shouldn&#39;t|should|Give it|Give|warm water|honey tea|warm tea|warm blanket|blanket|bandage|milk|apple|soft bed|sleep)\b/gi;

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

  // ------------------------------------------------------------ star pods (for individual student answers)
  function loadTeams(cls) {
    var list = [];
    try { if (window.AllAboutMeData) list = window.AllAboutMeData.getTeamsForClass('class-' + cls) || []; } catch (e) { list = []; }
    var src = list.length ? list : D.FALLBACK_TEAMS;
    state.teams = src.map(function (t, i) {
      return { name: String(t.name || ('Row ' + (i + 1))), color: t.color || '#a855f7', size: (t.studentIds || []).length || 0, icon: D.TEAM_ICONS[i % D.TEAM_ICONS.length], pts: 0, coins: 0 };
    });
    restore();
  }
  function saveKey() { return 'petvet-ez-' + state.cls + '-' + new Date().toISOString().slice(0, 10); }
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
        el('button', { class: 'ps-team-add', type: 'button', title: 'Give 1 Star', onclick: function (ev) { addPts(i, 1, ev.currentTarget); } }, [
          el('span', { text: t.icon + ' ' + t.name }), el('b', { text: String(t.pts || 0) })
        ]),
        el('button', { class: 'ps-team-sub', type: 'button', title: 'Take back 1 Star', text: '−', onclick: function () { A.tap(); addPts(i, -1); } })
      ]));
    });
  }
  function nextTurn() { state.turn = (state.turn + 1) % state.teams.length; renderTeams(); }
  function turnBanner(text) {
    var t = team(state.turn);
    return el('div', { class: 'turn-banner', style: '--tc:' + t.color }, [el('b', { text: '🙋 Student Turn (' + t.icon + ' ' + t.name + ')' }), el('span', { text: text })]);
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
    var linesForBar = state.grade === 4
      ? ["What's the matter?", 'It has got a tummy ache.', 'It should drink warm water.', "It shouldn't eat sweets!"]
      : ["What's the matter?", 'Look at Shadow!', 'It has got a tummy ache.', 'Give it warm water!'];
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
      if (opts.warnAt && left === opts.warnAt && !warned) { warned = true; say(opts.warnText || 'One minute left!'); }
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

  // ------------------------------------------------------------ 1. Presentation A: 6 Problems, 6 Cures & Grammar Rule
  function stVocab(body) {
    var g4 = state.grade === 4;
    var formulas = D.FORMULAS[state.grade] || D.FORMULAS[3];

    var formulaBar = el('div', { class: 'ppp-formula-bar' }, formulas.map(function (f) {
      return el('button', {
        class: 'ppp-formula-card ' + f.cls,
        type: 'button',
        onclick: function () { A.tap(); say(f.ex); }
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
      var cureSent = g4 ? v.cure4 : v.cure3;
      var imgSrc = flipped ? v.cureImg : v.symImg;

      var card = el('div', { class: 'vocab-card' + (flipped ? ' cure-mode' : '') + (seen ? ' seen' : '') }, [
        el('div', { class: 'vc-top', onclick: function () {
          A.tap(); state.vocabSeen[v.id] = true;
          say(flipped ? (v.cureLabel + '. ' + cureSent) : (word + '. ' + v.meaning));
          card.classList.add('seen');
        } }, [
          el('span', { class: 'vc-badge', text: flipped ? '💊 CURE (2 WORDS)' : '🤒 PROBLEM (2 WORDS)' }),
          el('div', { class: 'vc-art-wrap' }, [
            el('img', { class: 'vc-img bob', src: imgSrc, alt: flipped ? v.cureLabel : word })
          ]),
          el('b', { class: 'vc-word', html: colourise(flipped ? (v.cureIcon + ' ' + v.cureLabel) : word) }),
          el('small', { class: 'vc-sub', html: colourise(flipped ? cureSent : (g4 ? v.cause4 : v.meaning)) })
        ]),
        el('div', { class: 'vc-actions' }, [
          el('button', { class: 'ps-btn sm ' + (flipped ? 'amber' : 'emerald'), type: 'button', text: flipped ? '🤒 See Problem' : '💊 Flip to Cure!', onclick: function () {
            A.flip(); state.vocabFlipped[v.id] = !flipped; state.vocabSeen[v.id] = true;
            say(!flipped ? (v.cureLabel + '. ' + cureSent) : word);
            body.innerHTML = ''; stVocab(body);
          } }),
          el('button', { class: 'ps-btn ghost sm', type: 'button', text: '🎭 Act!', title: v.tpr, onclick: function () {
            A.correct(); state.vocabSeen[v.id] = true;
            say(v.tpr.replace(/^\S+\s/, ''));
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

  // ------------------------------------------------------------ 2. Presentation B: Meet the 6 Patients (3 Short Lines!)
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
          el('i', { class: 'price', text: p.cureShort })
        ]),
        state.met[p.id] ? el('div', { class: 'met-tick', text: '✓' }) : null
      ]));
    });
    body.appendChild(el('div', { class: 'meet-head' }, [
      el('span', { class: 'ps-pill', text: '🩺 Checked ' + count + ' / ' + D.PETS.length + ' patients' }),
      el('span', { class: 'legend', html: '<span class="k-col">🤒 Problem</span> <span class="k-has">🔹 has got</span> <span class="k-can">💊 Cure / should</span>' })
    ]));
    body.appendChild(shelf);
    if (!count) say('Tap a patient on the Waiting Bench! Every patient has only 3 short, easy lines.', false);
  }

  function openPet(body, p) {
    state.met[p.id] = true;
    var g4 = state.grade === 4;
    var ls = lines(p);

    var boxes = g4 ? [
      { tag: 'LINE 1 · 🤒 PROBLEM (has got)', img: p.symImg, cls: 'box-sym', line: p.chart4.symptom, sub: 'Short 5-word diagnosis!' },
      { tag: 'LINE 2 · ✅ DO (It should…)', img: p.cureImg, cls: 'box-cure', line: p.chart4.should, sub: 'Cure: ' + p.cureShort },
      { tag: "LINE 3 · 🚫 DON'T (It shouldn't…)", img: art(p.id), cls: 'box-warn', line: p.chart4.shouldnt, sub: 'Short warning!' }
    ] : [
      { tag: 'LINE 1 · 🐾 PATIENT', img: art(p.id), cls: 'box-res', line: p.chart3.symptom, sub: 'Meet the pet!' },
      { tag: "LINE 2 · 🤒 PROBLEM (What's the matter?)", img: p.symImg, cls: 'box-sym', line: p.chart3.cure, sub: p.badge },
      { tag: 'LINE 3 · 💊 CURE (Give it…)', img: p.cureImg, cls: 'box-cure', line: p.chart3.result, sub: 'Cure: ' + p.cureShort }
    ];

    var chartCards = boxes.map(function (b) {
      return el('button', { class: 'chart-box ' + b.cls, type: 'button', onclick: function (ev) {
        A.tap();
        [].forEach.call(ev.currentTarget.parentNode.children, function (x) { x.classList.remove('on'); });
        ev.currentTarget.classList.add('on');
        say(b.line);
      } }, [
        el('img', { class: 'cb-img', src: b.img, alt: '' }),
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
        say((i === 0 ? 'Repeat after me. ' : '') + boxes[i].line).then(function () { i++; setTimeout(nxt, 2100); });
      })();
    }

    var chk = g4 ? p.check4 : p.check3;
    var choices = shuffle([chk.right].concat(chk.wrong));
    var checkSolved = !!state.checked[p.id];
    var checkBox = el('div', { class: 'clil-check' }, [
      el('div', { class: 'clil-check-head' }, [
        el('b', { text: '🙋 1-Student Check: ' + chk.q }),
        checkSolved ? el('span', { class: 'ps-pill emerald', text: '✓ +1 Star!' }) : null
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
            say('Yes! ' + ans.replace(/^[^\w]+/, ''));
          } else {
            A.softFail(); wobble(btn); hostReact('oops');
            say('Look at the Cure Box! ' + chk.q);
          }
        });
        return btn;
      }))
    ]);

    var act = el('div', { class: 'act-big', hidden: 'hidden', text: p.act });
    var panel = el('div', { class: 'pet-panel' }, [
      el('div', { class: 'pet-panel-art' }, [
        el('div', { class: 'patient-vitals', text: p.badge + ' ➜ ' + p.cureShort }),
        el('img', { class: 'bob', src: checkSolved ? art(p.id) : (p.symImg || art(p.id)), alt: p.kind }),
        el('div', { class: 'ps-pedestal' }),
        act
      ]),
      el('div', { class: 'pet-panel-text' }, [
        el('div', { class: 'chart-title-row' }, [
          el('h3', { text: '🏥 ' + p.name + ' (' + p.kind + ')' }),
          el('button', { class: 'ps-btn ghost sm', type: 'button', text: '◀ All 6 Patients', onclick: function () { A.tap(); window.speechSynthesis && window.speechSynthesis.cancel(); body.innerHTML = ''; stMeet(body); } })
        ]),
        el('div', { class: 'chart-boxes' }, chartCards),
        checkBox,
        el('div', { class: 'row-btns' }, [
          el('button', { class: 'ps-btn violet sm', type: 'button', text: '🔁 Echo 3 Lines', onclick: function () { A.tap(); echo(); } }),
          el('button', { class: 'ps-btn amber sm', type: 'button', text: '🎭 Act It Out!', onclick: function () { A.correct(); act.hidden = false; say(p.act.replace(/^\S+\s/, '')); setTimeout(function () { act.hidden = true; }, 2600); } })
        ])
      ])
    ]);
    body.innerHTML = ''; body.appendChild(panel);
    say(ls.join(' '));
  }

  // ------------------------------------------------------------ 3. Practice A: Medical X-Ray Scanner (1 Student at a Time)
  var cauldron = null;
  function stCauldron(body) {
    if (!cauldron) cauldron = { order: shuffle(D.PETS.map(function (p) { return p.id; })), round: 0, clue: 1, solved: false };
    var c = cauldron, p = PET[c.order[c.round]], clues = state.grade === 4 ? p.clues4 : p.clues3;
    var opts = shuffle([p.id].concat(shuffle(D.PETS.filter(function (x) { return x.id !== p.id; }).map(function (x) { return x.id; })).slice(0, 3)));

    var pot = el('div', { class: 'xray-monitor' + (c.solved ? ' solved' : '') }, [
      el('div', { class: 'xray-hud-top' }, [
        el('span', { text: '🔬 X-RAY #' + (c.round + 1) + ' / ' + c.order.length }),
        el('span', { text: p.cureShort })
      ]),
      el('div', { class: 'xray-screen' }, [
        el('div', { class: 'xray-scan-beam' }),
        c.solved
          ? el('img', { class: 'xray-pet-reveal bob', src: art(p.id), alt: p.name })
          : el('div', { class: 'xray-mystery' }, [
              el('div', { class: 'xray-mystery-imgs' }, [
                el('img', { src: p.symImg, alt: 'Problem' }),
                el('span', { class: 'xray-q', text: '➜' }),
                el('img', { src: p.cureImg, alt: 'Cure' })
              ]),
              el('span', { text: 'WHO IS THIS PATIENT?' }),
              el('small', { text: p.badge + ' ➜ ' + p.cureShort })
            ])
      ]),
      el('div', { class: 'xray-hud-bot', text: c.solved ? ('✅ FOUND: ' + p.name.toUpperCase() + ' (' + p.kind + ')') : '🙋 Call 1 student to tap the pet below!' })
    ]);

    var clueBox = el('div', { class: 'clues' });
    clues.forEach(function (cl, i) {
      var shown = i < c.clue || c.solved;
      clueBox.appendChild(el('button', { class: 'clue' + (shown ? '' : ' hidden'), type: 'button', html: '<em>Clue ' + (i + 1) + '</em>' + (shown ? colourise(cl) : '🔒 Tap "Next Clue"'),
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
          say('Yes! It is ' + p.name + ' the ' + p.kind + '! Plus ' + pts + ' stars!');
          stCauldronRefresh(body);
        } else {
          A.softFail(); wobble(b); hostReact('oops');
          say(c.clue < 3 ? "Let's check the next clue!" : 'Listen to Clue 3: ' + clues[2].replace(/^[^\w]+/, ''));
          if (c.clue < 3) { c.clue++; setTimeout(function () { stCauldronRefresh(body, true); }, 1200); }
        }
      });
      grid.appendChild(b);
    });

    var actions = el('div', { class: 'row-btns' }, [
      c.solved ? null : el('button', { class: 'ps-btn violet', type: 'button', text: c.clue < 3 ? '🔬 Next Clue (' + (c.clue + 1) + '/3)' : '🔊 Read Clues', onclick: function () {
        A.bubble();
        if (c.clue < 3) { c.clue++; stCauldronRefresh(body, true); } else say(clues.join(' '));
      } }),
      c.solved ? null : el('button', { class: 'ps-btn ghost', type: 'button', text: '🔊 Repeat Clue', onclick: function () { A.tap(); say(clues[c.clue - 1].replace(/^[^\w]+/, '')); } }),
      c.solved && c.round < c.order.length - 1 ? el('button', { class: 'ps-btn amber', type: 'button', text: '🩺 Next Student & Next Patient ▶', onclick: function () {
        A.bubble(); c.round++; c.clue = 1; c.solved = false; nextTurn(); stCauldronRefresh(body, true);
      } }) : null,
      c.solved && c.round === c.order.length - 1 ? el('button', { class: 'ps-btn emerald', type: 'button', text: '✅ Go to Medicine Cabinet ▶', onclick: function () { go(3); } }) : null
    ]);

    body.appendChild(el('div', { class: 'cauldron-layout' }, [
      el('div', { class: 'cauldron-left' }, [pot]),
      el('div', { class: 'cauldron-right' }, [turnBanner(c.solved ? 'Great job! Say the 3 lines together!' : 'Call 1 student to the board — listen and tap the patient!'), clueBox, grid, actions])
    ]));
  }
  function stCauldronRefresh(body, speakClue) {
    body.innerHTML = ''; stCauldron(body);
    if (speakClue && cauldron && !cauldron.solved) {
      var p = PET[cauldron.order[cauldron.round]], clues = state.grade === 4 ? p.clues4 : p.clues3;
      say(clues[cauldron.clue - 1].replace(/^[^\w]+/, ''));
    }
  }

  // ------------------------------------------------------------ 4. Practice B: Medicine Cabinet (2-Word Picture Buttons!)
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
      if (s.indexOf('tea') >= 0) return 'art/cure_tea.webp';
      if (s.indexOf('bandage') >= 0) return 'art/cure_bandage.webp';
      if (s.indexOf('bed') >= 0 || s.indexOf('pillow') >= 0) return 'art/cure_pillow.webp';
      if (s.indexOf('milk') >= 0 || s.indexOf('apple') >= 0) return 'art/cure_milk.webp';
      return 'art/cure_water.webp';
    }

    var leftCol = el('div', { class: 'med-patient-card' }, [
      el('div', { class: 'patient-vitals', text: '🏥 Patient ' + (prac.round + 1) + ' of ' + rounds.length + ' · ' + p.name }),
      el('div', { class: 'med-art-stage' }, [
        el('img', { class: 'bob med-pet-img', src: s1 ? art(p.id) : (p.symImg || art(p.id)), alt: p.kind }),
        s1 && r.rightImg ? el('img', { class: 'med-cure-badge-img', src: r.rightImg, alt: 'Cure' }) : null
      ]),
      el('div', { class: 'ps-pedestal sm' }),
      el('div', { class: 'med-status' + (s2 ? ' healed' : ''), text: s2 ? ('💚 ' + p.name + ' is Healed!') : (s1 ? ('💊 Cure picked! Now tap Step 2!') : p.badge) })
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
          say(optText.replace(/^[^\w]+/, '') + '! Now tap the word in Step 2!');
          body.innerHTML = ''; stPractice(body);
        } else {
          A.softFail(); wobble(b); hostReact('oops');
          say('Try another picture cure for ' + p.name + '!');
        }
      });
      return b;
    });

    var grammarBox = el('div', { class: 'grammar-fixer' + (s1 ? ' active' : ' locked') }, [
      el('div', { class: 'gf-head' }, [
        el('b', { html: '🧩 ' + colourise(r.grammarQ) }),
        s2 ? el('span', { class: 'ps-pill emerald', text: '✓ +1 Star!' }) : el('span', { class: 'ps-pill', text: s1 ? 'Tap 1 word!' : 'Tap Step 1 first' })
      ]),
      el('div', { class: 'gf-opts' }, r.grammarOpts.map(function (gw) {
        var gBtn = el('button', {
          class: 'ps-btn ' + (s2 && gw === r.grammarRight ? 'emerald' : 'violet'),
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
            say('Great! Repeat together: ' + r.grammarFull);
            body.innerHTML = ''; stPractice(body);
          } else {
            A.softFail(); wobble(gBtn); hostReact('oops');
            say('Tap the other word!');
          }
        });
        return gBtn;
      }))
    ]);

    var navRow = el('div', { class: 'row-btns' }, [
      el('button', { class: 'ps-btn ghost sm', type: 'button', text: '🔊 Hear Sentence', onclick: function () { A.tap(); say(s2 ? r.grammarFull : r.problem); } }),
      s1 && prac.round < rounds.length - 1 ? el('button', { class: 'ps-btn amber sm', type: 'button', text: '🙋 Next Student & Next Patient ▶', onclick: function () {
        A.bubble(); prac.round++; nextTurn(); body.innerHTML = ''; stPractice(body);
        var nr = rounds[prac.round]; say(nr.problem.replace(/^[^\w]+/, ''));
      } }) : null,
      s1 && prac.round === rounds.length - 1 ? el('button', { class: 'ps-btn emerald sm', type: 'button', text: '✅ Start Individual "Circle & Say" Sheet ▶', onclick: function () { go(4); } }) : null
    ]);

    var rightCol = el('div', { class: 'med-right' }, [
      turnBanner(s2 ? 'Everybody repeat the sentence together!' : (s1 ? 'Step 2: Tap the right grammar word below!' : 'Call 1 student: Tap the right 2-word cure picture!')),
      el('div', { class: 'med-chart' }, [
        el('div', { class: 'med-problem', html: colourise(r.problem) }),
        el('div', { class: 'med-q', text: '👆 ' + r.q })
      ]),
      el('div', { class: 'med-grid' }, optBtns),
      grammarBox,
      navRow
    ]);

    body.appendChild(el('div', { class: 'med-layout' }, [leftCol, rightCol]));
  }

  // ------------------------------------------------------------ 5. Individual Practice: "Circle & Say" Sheet at Desks (NO Group Work!)
  var lab = { timer: null, tab: 0, pick: {}, checks: {} };
  function stLab(body) {
    var B = D.BUILDER, g4 = state.grade === 4;
    if (!lab.pick.name) {
      lab.pick = {
        name: 'Shadow',
        animal: 'black cat',
        symptom: 'a tummy ache',
        cure3: 'warm water',
        should4: 'drink warm water',
        shouldnt4: 'eat sweets'
      };
    }
    var t = makeTimer(5 * 60, {
      warnAt: 60,
      warnText: 'One minute left! Whisper your 3 short sentences at your desk.',
      onEnd: function () { say('Pencils down! Who wants to be a Brave Vet and read their 3 short lines?'); }
    });
    lab.timer = t;

    var checks = el('div', { class: 'checks' }, D.INDIVIDUAL_STEPS.map(function (s, i) {
      return el('button', { class: 'check' + (lab.checks[i] ? ' on' : ''), type: 'button', onclick: function (ev) { A.tap(); lab.checks[i] = !lab.checks[i]; ev.currentTarget.classList.toggle('on'); } }, [el('i', { text: lab.checks[i] ? '✓' : String(i + 1) }), el('span', { text: s })]);
    }));

    var preview = el('div', { class: 'preview vet-card-preview' });
    function sentences() {
      var P = lab.pick, an = /^[aeiou]/i.test(P.animal) ? 'an' : 'a';
      return g4 ? [
        '1 · ' + P.name + ' has got ' + P.symptom + '.',
        '2 · It should ' + P.should4 + '.',
        "3 · It shouldn't " + P.shouldnt4 + '!'
      ] : [
        '1 · Look at ' + P.name + '! It is ' + an + ' ' + P.animal + '.',
        '2 · It has got ' + P.symptom + '.',
        '3 · Give it ' + P.cure3 + '!'
      ];
    }
    function paintPreview() {
      var P = lab.pick;
      var imgAnim = D.IMG_MAP[P.animal] ? '<img class="vcp-img" src="' + D.IMG_MAP[P.animal] + '" alt="">' : '🐾';
      var imgSym = D.IMG_MAP[P.symptom] ? '<img class="vcp-img" src="' + D.IMG_MAP[P.symptom] + '" alt="">' : '🤒';
      var cureKey = g4 ? P.should4 : P.cure3;
      var imgCure = D.IMG_MAP[cureKey] ? '<img class="vcp-img" src="' + D.IMG_MAP[cureKey] + '" alt="">' : '💊';
      preview.innerHTML =
        '<div class="vcp-badges"><span>' + imgAnim + ' <b>' + esc(P.name) + ' (' + esc(P.animal) + ')</b></span><span>' + imgSym + ' <b>' + esc(P.symptom) + '</b></span><span>' + imgCure + ' <b>' + esc(cureKey) + '</b></span></div>' +
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
      { lbl: '1 · 🐾 Circle Pet', rows: [row('Name', 'name', B.names), row('Pet', 'animal', B.animal)] },
      { lbl: '2 · 🤒 Circle Problem', rows: [row('Has got', 'symptom', B.symptom)] },
      { lbl: '3 · 💊 Circle Cure', rows: [row('Should', 'should4', B.should4), row("Shouldn't", 'shouldnt4', B.shouldnt4)] }
    ] : [
      { lbl: '1 · 🐾 Circle Pet', rows: [row('Name', 'name', B.names), row('Pet', 'animal', B.animal)] },
      { lbl: '2 · 🤒 Circle Problem', rows: [row('Has got', 'symptom', B.symptom)] },
      { lbl: '3 · 💊 Circle Cure', rows: [row('Give it', 'cure3', B.cure3)] }
    ];

    if (lab.tab >= tabDefs.length) lab.tab = 0;
    var tabBar = el('div', { class: 'studio-tabs three' }, tabDefs.map(function (tb, idx) {
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
        el('h4', { text: '⭕ Model "Circle & Say" Sheet (Only 3 Short Lines!)' }),
        el('div', { class: 'row-btns tight' }, [
          el('button', { class: 'ps-btn violet sm', type: 'button', text: '🔊 Hear 3 Lines', onclick: function () { A.tap(); say(sentences().map(function (s) { return s.replace(/^\d\s·\s/, ''); }).join(' ')); } }),
          el('button', { class: 'ps-btn ghost sm', type: 'button', text: '🎲 Random Example', onclick: function () {
            A.bubble(); var r = function (a) { return a[Math.floor(Math.random() * a.length)]; };
            lab.pick = { name: r(B.names), animal: r(B.animal), symptom: r(B.symptom), cure3: r(B.cure3), should4: r(B.should4), shouldnt4: r(B.shouldnt4) };
            body.innerHTML = ''; stLab(body);
          } })
        ])
      ]),
      preview,
      tabBar,
      el('div', { class: 'studio-tab-body' }, tabDefs[lab.tab].rows)
    ]);

    body.appendChild(el('div', { class: 'lab' }, [
      el('div', { class: 'lab-left' }, [
        el('div', { class: 'jobs-head' }, [el('h4', { text: '👤 Individual Desk Task (5 Min)' })]),
        el('p', { class: 'jobs-note', text: 'No group work! Every student circles 3 pictures & writes 1 name on their own sheet:' }),
        t.node,
        checks
      ]),
      builder
    ]));
  }

  // ------------------------------------------------------------ 6. Production: Brave Vet Stand-Up (Individual Volunteers + Class Finale)
  var shop = { phase: 'speak', line: -1, spunQ: -1 };
  function stShop(body) {
    if (shop.phase === 'awards') return stAwards(body);
    var frames = D.SELLER[state.grade], qs = D.QUESTIONS[state.grade];
    var timer = makeTimer(30, { compact: true, onEnd: function () { say('Great job, Brave Vet! Give a big clap!'); } });

    var frameBtns = frames.map(function (f, i) {
      return el('button', { class: 'frame' + (i === shop.line ? ' on' : ''), type: 'button', html: colourise(f), onclick: function (ev) {
        A.tap(); shop.line = i; [].forEach.call(ev.currentTarget.parentNode.children, function (x) { x.classList.remove('on'); }); ev.currentTarget.classList.add('on');
        say(f.replace(/^\d\s·\s[^\w]+/, '').replace(/\[[^\]]+\]/g, 'Shadow'));
      } });
    });

    var qCards = qs.map(function (q, idx) {
      return el('button', { class: 'q-card' + (shop.spunQ === idx ? ' spun' : ''), type: 'button', onclick: function () { A.tap(); shop.spunQ = idx; say(q.q); body.innerHTML = ''; stShop(body); } }, [
        el('b', { text: '🩺 ' + q.q }), el('small', { html: '➜ ' + colourise(q.a) })
      ]);
    });

    body.appendChild(el('div', { class: 'shop' }, [
      el('div', { class: 'shop-left' }, [
        el('div', { class: 'award', style: '--tc:#10b981' }, [
          el('div', { class: 'award-ic', text: '🌟' }),
          el('b', { text: 'Brave Vets Spoken: ' + state.braveVets }),
          el('span', { class: 'award-title', text: 'Individual Volunteers' })
        ]),
        timer.node,
        el('div', { class: 'row-btns' }, [
          el('button', { class: 'ps-btn emerald', type: 'button', text: '🌟 Brave Vet Spoke! (+2 Stars)', onclick: function (ev) {
            state.braveVets++;
            addPts(state.turn, 2, ev.currentTarget);
            nextTurn();
            hostReact('cheer');
            say('Wonderful speaking! Brave Vet number ' + state.braveVets + '!');
            body.innerHTML = ''; stShop(body);
          } }),
          el('button', { class: 'ps-btn amber', type: 'button', text: '🏆 Class Finale & Exit Pass ▶', onclick: function () { A.fanfare(); shop.phase = 'awards'; body.innerHTML = ''; stShop(body); } })
        ])
      ]),
      el('div', { class: 'shop-stage' }, [
        el('div', { class: 'shop-banner', style: '--tc:#a855f7' }, [
          el('span', { text: '🙋' }),
          el('b', { text: 'Brave Vet Stand-Up (Read Your 3 Circle & Say Lines!)' }),
          el('small', { text: 'Tap a line to hear Dr. Luna model it' })
        ]),
        el('div', { class: 'frames' }, frameBtns)
      ]),
      el('div', { class: 'buyers' }, [
        el('div', { class: 'jobs-head' }, [
          el('h4', { text: '🩺 Ask 1 Easy Question' }),
          el('button', { class: 'ps-btn violet sm', type: 'button', text: '🎲 Spin!', onclick: function () {
            A.bubble();
            shop.spunQ = Math.floor(Math.random() * qs.length);
            body.innerHTML = ''; stShop(body);
            say('Question: ' + qs[shop.spunQ].q);
          } })
        ]),
        el('div', { class: 'buyers' }, qCards)
      ])
    ]));
  }

  // ------------------------------------------------------------ Awards & Door Pass
  var TITLES = ['🏆 Super Vet Stars', '🩺 Master Healers', '💚 Kindest Vets', '✨ Healthy Pet Heroes'];
  function stAwards(body) {
    var ranked = state.teams.map(function (t, i) { return { t: t, i: i }; }).sort(function (a, b) { return (b.t.pts || 0) - (a.t.pts || 0); });
    var cards = ranked.map(function (r, k) {
      return el('div', { class: 'award', style: '--tc:' + r.t.color + ';animation-delay:' + (k * 0.15) + 's' }, [
        el('div', { class: 'award-ic', text: r.t.icon }),
        el('b', { text: r.t.name }),
        el('span', { class: 'award-title', text: TITLES[k % TITLES.length] }),
        el('i', { text: '⭐ ' + (r.t.pts || 0) + ' stars' })
      ]);
    });
    var door = D.DOOR[state.grade];
    body.appendChild(el('div', { class: 'awards' }, [
      el('div', { class: 'award-grid' }, cards),
      el('div', { class: 'door' }, [
        el('div', { class: 'jobs-head' }, [
          el('h4', { text: '🚪 Whole-Class Finale & Door Pass: Tap a pet & say its cure!' }),
          el('button', { class: 'ps-btn ghost sm', type: 'button', text: '◀ Back to Brave Vets', onclick: function () { A.tap(); shop.phase = 'speak'; body.innerHTML = ''; stShop(body); } })
        ]),
        el('div', { class: 'door-lines' }, door.map(function (l) { return el('button', { class: 'frame', type: 'button', html: '🔊 ' + colourise(l), onclick: function () { A.tap(); say(l); } }); })),
        el('div', { class: 'door-pets' }, D.PETS.map(function (p) {
          return el('button', { class: 'door-pet', type: 'button', onclick: function () {
            A.tap();
            var msg = state.grade === 4 ? (p.g4[0] + ' ' + p.g4[1]) : (p.g3[1] + ' ' + p.g3[2]);
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
    $('ps-class-lbl').textContent = 'Class ' + cls.toUpperCase() + ' · Grade ' + state.grade + (state.grade === 4 ? ' (A1+)' : ' (A1)') + ' · 35-Min Lesson';
    $('ps-start').hidden = true; $('ps-app').hidden = false;
    renderTeams(); go(0);
    A.spooky();
    say('Welcome to the Monster Pet Vet Clinic, ' + cls.toUpperCase() + '! Let\'s learn our 6 easy problems and 6 cures!');
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
