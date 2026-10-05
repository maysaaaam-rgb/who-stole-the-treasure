/* Unit 2 Grade 4: two teacher-led smartboard lessons. The board is the stage, timer and scoreboard.
   The children move, act, talk, draw and solve. Four teams earn points all lesson. One smartboard, mini whiteboards. */
(function () {
  'use strict';
  var D = window.ForestLessonsData, A = window.ForestAudio;
  function $(id) { return document.getElementById(id); }
  function h(tag, attrs, kids) {
    var e = document.createElement(tag), k;
    attrs = attrs || {};
    for (k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'text') e.textContent = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k === 'style') e.style.cssText = attrs[k];
      else if (k.indexOf('on') === 0) e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (n) { if (n != null) e.appendChild(typeof n === 'string' ? document.createTextNode(n) : n); });
    return e;
  }
  function shuffle(a) { var b = a.slice(), i, j, t; for (i = b.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = b[i]; b[i] = b[j]; b[j] = t; } return b; }
  function sfx(n) { A.play(n); }
  function sayBtn(text, label) { return h('button', { type: 'button', class: 'btn small ghost say', text: '🔊 ' + (label || 'Say it'), onclick: function () { A.speak(text); } }); }
  function btn(text, cls, fn) { return h('button', { type: 'button', class: 'btn ' + (cls || ''), text: text, onclick: fn }); }

  var state = { lesson: 1, idx: 0, scores: D.teams.map(function () { return 0; }), done: {}, cleanups: [] };

  /* ---------- teams ---------- */
  function drawTeams() {
    var box = $('teams'); box.innerHTML = '';
    D.teams.forEach(function (t, i) {
      box.appendChild(h('div', { class: 'tm', style: '--c:' + t.c, id: 'tm' + i }, [
        h('button', { type: 'button', class: 'tm-main', onclick: function () { addPoint(i, 1); } }, [h('span', { text: t.e + ' ' + t.n }), h('b', { text: String(state.scores[i]) })]),
        h('button', { type: 'button', class: 'tm-minus', text: '−', title: 'take a point away', onclick: function () { addPoint(i, -1); } })
      ]));
    });
  }
  function addPoint(i, n) {
    state.scores[i] = Math.max(0, state.scores[i] + n); sfx(n > 0 ? 'coin' : 'tap');
    var el = $('tm' + i); if (el) { el.querySelector('b').textContent = state.scores[i]; el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
  }
  function pointsRow() {
    var row = h('div', { class: 'row points' }, [h('span', { class: 'lab', text: '⭐ Point for:' })]);
    D.teams.forEach(function (t, i) { row.appendChild(h('button', { type: 'button', class: 'btn small', style: '--bg:' + t.c + ';--lip:rgba(0,0,0,.4)', text: t.e + ' +1', onclick: function () { addPoint(i, 1); } })); });
    return row;
  }

  /* ---------- small helpers ---------- */
  function confetti() {
    var host = $('stage'), em = ['⭐', '🎉', '🌟', '✨', '🍂', '🌲', '🕊️'], k, w = h('div', { class: 'confetti' });
    for (k = 0; k < 26; k++) w.appendChild(h('i', { text: em[k % em.length], style: 'left:' + Math.random() * 96 + '%;animation-delay:' + Math.random() * 0.5 + 's;font-size:' + (2.4 + Math.random() * 2.4) + 'vh' }));
    host.appendChild(w); setTimeout(function () { w.remove(); }, 2400);
  }
  function timerBtn(c, sec, onStart, onEnd) {
    var left = sec, iv = null, b = h('button', { type: 'button', class: 'btn small violet timer-btn' });
    function fmt() { return '⏱ ' + Math.floor(left / 60) + ':' + ('0' + (left % 60)).slice(-2); }
    function reset() { if (iv) { clearInterval(iv); iv = null; } left = sec; b.textContent = fmt(); b.classList.remove('run', 'end'); if (onEnd) onEnd(false); }
    b.textContent = fmt();
    b.addEventListener('click', function () {
      if (iv) { reset(); return; }
      b.classList.remove('end'); b.classList.add('run'); sfx('tap'); if (onStart) onStart();
      iv = setInterval(function () { left--; b.textContent = fmt(); if (left <= 0) { clearInterval(iv); iv = null; b.classList.remove('run'); b.classList.add('end'); sfx('win'); if (onEnd) onEnd(true); setTimeout(function () { left = sec; b.textContent = fmt(); b.classList.remove('end'); }, 4000); } }, 1000);
    });
    c.later(function () { if (iv) clearInterval(iv); });
    b.resetTimer = reset;
    return b;
  }
  function podium(host) {
    var order = D.teams.map(function (t, i) { return { t: t, s: state.scores[i] }; }).sort(function (a, b) { return b.s - a.s; }), medals = ['🥇', '🥈', '🥉', '⭐'];
    host.appendChild(h('div', { class: 'podium' }, order.map(function (o, k) { return h('div', { class: 'pod', style: '--c:' + o.t.c + ';height:' + (34 - k * 5) + 'vh' }, [h('div', { class: 'em', text: o.t.e }), h('div', { text: medals[k] + ' ' + o.t.n }), h('b', { text: o.s + ' ⭐' })]); })));
  }

  /* ---------- forest picture (used by lesson 1) ---------- */
  function buildForest() {
    var season = 'summer', animals = {};
    var forests = h('div', { class: 'forests', 'data-season': season });
    function mkPine(left, scale) { return h('div', { class: 'pine', style: 'left:' + left + '%;transform:scale(' + scale + ');transform-origin:bottom' }, [h('div', { class: 'trunk' }), h('div', { class: 'tier t1' }), h('div', { class: 'tier t2' }), h('div', { class: 'tier t3' })]); }
    function mkTree(left, scale) { return h('div', { class: 'tree', style: 'left:' + left + '%;transform:scale(' + scale + ')' }, [h('div', { class: 'trunk' }), h('div', { class: 'branch b1' }), h('div', { class: 'branch b2' }), h('div', { class: 'branch b3' }), h('div', { class: 'crown' })]); }
    function mkParts(kind, emoji, n) { var p = h('div', { class: 'parts' }), k; for (k = 0; k < n; k++) p.appendChild(h('i', { class: kind, text: emoji, style: 'left:' + (Math.random() * 96) + '%;font-size:' + (2 + Math.random() * 1.6) + 'vh;animation-duration:' + (5 + Math.random() * 5) + 's;animation-delay:-' + (Math.random() * 8) + 's' })); return p; }
    function mkAn(id, emoji, style, cls) {
      var b = h('button', { type: 'button', class: 'an ' + (cls || ''), style: style, text: emoji });
      b.addEventListener('click', function () { sfx('tap'); A.speak(id); }); animals[id] = b; return b;
    }
    var t1 = mkTree(3, 1), p1 = mkPine(4, 1.05);
    var deci = h('div', { class: 'forest deci' }, [h('div', { class: 'tag', text: '🍂 Deciduous forest' }), h('div', { class: 'ground' }), t1, mkTree(68, 0.85), h('div', { class: 'den' }), h('div', { class: 'zzz', text: 'Zzz' }),
      mkAn('bear', '🐻', 'left:21%;bottom:21%', 'bear'), mkAn('deer', '🦌', 'left:80%;bottom:20%', ''), mkAn('squirrel', '🐿️', 'left:38%;bottom:22%;font-size:6vh', ''), mkParts('leaf', '🍂', 12), mkParts('flake', '❄️', 12)]);
    var coni = h('div', { class: 'forest' }, [h('div', { class: 'tag', text: '🌲 Coniferous forest' }), h('div', { class: 'ground' }), p1, mkPine(34, 0.8), mkPine(70, 1),
      mkAn('hare', '🐇', 'left:50%;bottom:19%', 'hare'), mkAn('wolf', '🐺', 'left:20%;bottom:19%;font-size:8vh', ''), mkAn('owl', '🦉', 'left:76%;top:12%;font-size:6.5vh', ''), mkParts('flake', '❄️', 14)]);
    forests.appendChild(deci); forests.appendChild(coni);
    var focusEls = { bear: animals.bear, hare: animals.hare, tree: t1, pine: p1 };
    return {
      root: forests,
      set: function (s) { season = s; forests.setAttribute('data-season', s); },
      spot: function (id) { Object.keys(focusEls).forEach(function (k) { focusEls[k].classList.remove('spot'); }); if (id && focusEls[id]) focusEls[id].classList.add('spot'); }
    };
  }

  /* ============================== LESSON 1 ============================== */
  function l1Hook(c) {
    var body = c.body, i = -1;
    var sky = h('div', { class: 'hook-stage' }), paper = h('div', { class: 'letter', style: 'display:none' }), mis = h('div', { class: 'missions', style: 'display:none' });
    sky.appendChild(h('div', { class: 'stars-bg' })); sky.appendChild(paper); body.appendChild(sky);
    var env = h('div', { class: 'envelope', text: '✉️' });
    sky.appendChild(env);
    var nextBtn = btn('✉ Open the letter', 'amber big', function () {
      i++;
      if (i === 0) { env.style.display = 'none'; paper.style.display = 'block'; sfx('page'); }
      if (i < D.letter.length) { var ln = h('p', { class: 'ln', text: D.letter[i] }); paper.appendChild(ln); sfx('tap'); A.speak(D.letter[i]); nextBtn.textContent = i < D.letter.length - 1 ? 'Next line ▶' : 'Show the missions ▶'; }
      else { nextBtn.style.display = 'none'; mis.style.display = 'grid'; sfx('win'); }
    });
    var read = sayBtn(D.letter.join(' '), 'Read the whole letter');
    body.appendChild(h('div', { class: 'row' }, [nextBtn, read]));
    D.missions1.forEach(function (m, k) { mis.appendChild(h('div', { class: 'mission' }, [h('div', { class: 'num', text: String(k + 1) }), h('div', { class: 'em', text: m.e }), h('div', { text: m.t })])); });
    body.appendChild(mis);
  }

  function l1Story(c) {
    var body = c.body, f = buildForest(), i = -1, revealed = false;
    var cap = h('div', { class: 'caption' }), act = h('div', { class: 'gesture' }), count = h('span', { class: 'pill amber', text: 'Part 0 of ' + D.year.length });
    var go = btn('▶ Tell the story', 'green big', next), echo = sayBtn('', 'Echo'), cur = null;
    echo.onclick = function () { if (cur) A.speak(cur.say); };
    function show(ch) {
      cap.innerHTML = ''; cap.appendChild(h('div', { class: 'say' + (ch.key ? ' key' : ''), text: ch.say })); act.textContent = ch.act; act.style.display = 'block';
      f.set(ch.season); f.spot(ch.focus); sfx('season'); A.speak(ch.say);
    }
    function next() {
      if (cur && cur.predict && !revealed) { revealed = true; show(cur); go.textContent = i === D.year.length - 1 ? '🎬 Finish' : '▶ Next part'; return; }
      i++; revealed = false;
      if (i >= D.year.length) {
        cap.innerHTML = ''; cap.appendChild(h('div', { class: 'say', text: '🎬 Now tell it to your partner! Use: so it can… / so they can…' })); act.style.display = 'none'; f.spot(null); sfx('win'); confetti(); go.textContent = '↺ Tell it again'; i = -1; cur = null; count.textContent = 'The end'; return;
      }
      cur = D.year[i]; count.textContent = 'Part ' + (i + 1) + ' of ' + D.year.length;
      if (cur.predict) {
        f.set(cur.season); f.spot(cur.focus); cap.innerHTML = ''; cap.appendChild(h('div', { class: 'say predict', text: '🤔 ' + cur.predict })); act.textContent = '✋ Show with your body. Talk to your partner. Then I reveal!'; act.style.display = 'block'; go.textContent = '👀 Reveal'; sfx('page');
      } else { show(cur); go.textContent = i === D.year.length - 1 ? '🎬 Finish' : '▶ Next part'; }
    }
    c.later(function () { f.spot(null); });
    var seasons = h('div', { class: 'row' }); ['spring', 'summer', 'autumn', 'winter'].forEach(function (s) { seasons.appendChild(btn({ spring: '🌸 Spring', summer: '☀️ Summer', autumn: '🍂 Autumn', winter: '❄️ Winter' }[s], 'small cyan', function () { f.set(s); sfx('season'); })); });
    var cap0 = h('div', { class: 'say', text: 'Stand up, Rangers! We are going to act out one year in the forest.' }); cap.appendChild(cap0);
    body.appendChild(f.root);
    body.appendChild(h('div', { class: 'storybar' }, [h('div', { class: 'grow' }, [cap, act]), h('div', { class: 'col' }, [count, go, echo])]));
    body.appendChild(seasons);
  }

  function l1Walk(c) {
    var body = c.body, i = 0, revealed = false;
    var card = h('div', { class: 'walkcard' }), info = h('div', { class: 'msg' }), z = {};
    var zones = h('div', { class: 'zones' });
    [['D', '🍂 DECIDUOUS', '#b45309'], ['B', '🌳 BOTH', '#475569'], ['C', '🌲 CONIFEROUS', '#166534']].forEach(function (zn) { z[zn[0]] = h('div', { class: 'zone', style: '--c:' + zn[2], text: zn[1] }); zones.appendChild(z[zn[0]]); });
    var rev = btn('👀 Show the answer', 'amber', function () {
      if (revealed) return; revealed = true; var w = D.walk[i]; z[w.a].classList.add('hit'); sfx('correct');
      var s = w.a === 'B' ? 'It is in both forests because trees grow in both.' : 'It is a ' + (w.a === 'D' ? 'deciduous' : 'coniferous') + ' forest because ' + w.t.charAt(0).toLowerCase() + w.t.slice(1);
      info.textContent = s; A.speak(s);
    });
    var nxt = btn('Next card ▶', 'green', function () {
      if (i >= D.walk.length - 1) { info.textContent = '🏁 Mission complete! Everyone back to your seats.'; sfx('win'); confetti(); return; }
      i++; draw();
    });
    function draw() { revealed = false; Object.keys(z).forEach(function (k) { z[k].classList.remove('hit'); }); var w = D.walk[i]; card.innerHTML = ''; card.appendChild(h('div', { class: 'em', text: w.e })); card.appendChild(h('div', { class: 'tx', text: w.t })); card.appendChild(h('div', { class: 'pill amber', text: 'Card ' + (i + 1) + ' of ' + D.walk.length })); info.textContent = '🚶 Walk to your forest! Stand on the line for BOTH.'; sfx('page'); }
    body.appendChild(card); body.appendChild(zones); body.appendChild(info);
    body.appendChild(h('div', { class: 'row' }, [rev, nxt, btn('🔊 Read card', 'small ghost', function () { A.speak(D.walk[i].t); })]));
    body.appendChild(pointsRow());
    draw();
  }

  function l1Interview(c) {
    var body = c.body, sel = D.interview[0], qi = 2;
    var rep = h('div', { class: 'bubble left' }), ans = h('div', { class: 'bubble right' }), grid = h('div', { class: 'agrid' });
    function show() { rep.innerHTML = '<small>🎤 Ranger Reporter</small>' + D.reporterQs[qi]; ans.innerHTML = '<small>' + sel.e + ' ' + sel.n + '</small>' + sel.a; }
    D.interview.forEach(function (a) { grid.appendChild(h('button', { type: 'button', class: 'btn acard', onclick: function () { sel = a; show(); sfx('tap'); A.speak(a.n); } }, [h('span', { class: 'em', text: a.e }), h('span', { text: a.n })])); });
    var qrow = h('div', { class: 'row' }); D.reporterQs.forEach(function (q, k) { qrow.appendChild(btn('Q' + (k + 1), 'small ghost', function () { qi = k; show(); A.speak(q); })); });
    var swap = btn('🔁 Swap roles!', 'coral', function () { sfx('season'); swap.textContent = '🔁 Swapped! Go!'; setTimeout(function () { swap.textContent = '🔁 Swap roles!'; }, 2200); });
    body.appendChild(h('div', { class: 'row' }, [timerBtn(c, 180), swap, btn('🔊 Model it', 'small amber', function () { A.speakSeq([D.reporterQs[qi], sel.a]); })]));
    body.appendChild(h('div', { class: 'dialog' }, [rep, ans])); body.appendChild(qrow); body.appendChild(grid);
    show();
  }

  function l1Create(c) {
    var body = c.body, last = -1;
    var ch = h('div', { class: 'challenge', text: '🎲 Press the button to get your challenge!' });
    var bank = h('div', { class: 'bank' }, D.bank.map(function (w) { return h('button', { type: 'button', class: 'chip2', text: w, onclick: function () { sfx('tap'); A.speak(w); } }); }));
    var roll = btn('🎲 New challenge', 'violet', function () { var k; do { k = Math.floor(Math.random() * D.challenges.length); } while (k === last && D.challenges.length > 1); last = k; ch.textContent = '🎲 ' + D.challenges[k]; sfx('season'); A.speak(D.challenges[k]); });
    var clap = btn('🎉 Applause!', 'green', function () { sfx('win'); confetti(); });
    body.appendChild(h('div', { class: 'row' }, [roll, timerBtn(c, 240), clap])); body.appendChild(ch);
    body.appendChild(h('div', { class: 'frame-big', html: 'This is a <b>__________</b>. It has <b>__________</b> so it can <b>__________</b>.' }));
    body.appendChild(h('div', { class: 'hintbox', text: 'Word bank (tap to hear):' })); body.appendChild(bank);
  }

  function l1Race(c) {
    var body = c.body, i = 0, revealed = false;
    var stim = h('div', { class: 'stim' }), box = h('div', { class: 'msg' });
    var tm = timerBtn(c, 45, function () { $('stage').classList.add('storm'); }, function () { $('stage').classList.remove('storm'); });
    var show = btn('✅ Show the answer', 'amber', function () {
      if (revealed) return; revealed = true; var r = D.race[i]; sfx('correct'); $('stage').classList.remove('storm'); tm.resetTimer();
      box.className = 'msg'; box.textContent = '✔ ' + r.answer; A.speak(r.answer);
    });
    var nxt = btn('Next round ▶', 'green', function () { if (i >= D.race.length - 1) { sfx('win'); confetti(); box.textContent = '🏁 The blizzard is over! Rangers win!'; return; } i++; draw(); });
    function draw() {
      revealed = false; var r = D.race[i]; box.textContent = ''; stim.innerHTML = '';
      stim.appendChild(h('div', { class: 'pill amber', text: 'Round ' + (i + 1) + ' of ' + D.race.length }));
      if (r.type === 'scramble') { stim.appendChild(h('div', { class: 'prompt', text: '✍️ Write the sentence on your mini whiteboard!' })); stim.appendChild(h('div', { class: 'scr' }, shuffle(r.words).map(function (w) { return h('span', { class: 'tile2', text: w }); }))); }
      else { stim.appendChild(h('div', { class: 'prompt', text: r.type === 'heading' ? '🔎 Which heading is best? Write A, B or C.' : '🤔 Why did the author write this? Write A, B or C.' })); stim.appendChild(h('div', { class: 'para', text: r.text })); stim.appendChild(h('div', { class: 'scr' }, r.options.map(function (o, k) { return h('span', { class: 'tile2', text: 'ABC'.charAt(k) + ': ' + o }); }))); }
      sfx('page');
    }
    body.appendChild(h('div', { class: 'row' }, [tm, show, nxt])); body.appendChild(stim); body.appendChild(box); body.appendChild(pointsRow());
    draw();
  }

  function wrap(c, lesson) {
    var body = c.body; body.innerHTML = '';
    podium(body);
    var L = LESSONS[lesson];
    body.appendChild(h('div', { class: 'row', style: 'justify-content:center' }, L.missions.map(function (m) { return h('span', { class: 'pill amber', text: '✅ ' + m.e + ' ' + m.t }); })));
    body.appendChild(h('div', { class: 'door', text: L.door }));
    var rowb = h('div', { class: 'row', style: 'justify-content:center' });
    if (lesson === 1) rowb.appendChild(btn("Lesson 2: The Swallow's Gift ▶", 'green big', function () { go(2, 0); }));
    rowb.appendChild(btn('🎉 Celebrate!', 'amber', function () { sfx('win'); confetti(); }));
    body.appendChild(rowb); sfx('win'); confetti();
  }
  function l1Wrap(c) {
    c.body.appendChild(h('div', { class: 'report' }, [h('div', { class: 'rank', text: '🌲' }), h('div', { class: 'score', text: 'Ranger Badge Ceremony' }), btn('🏆 See the scores', 'green big', function () { wrap(c, 1); })]));
  }

  /* ============================== LESSON 2 ============================== */
  function l2Hook(c) {
    var body = c.body, i = -1;
    var stage = h('div', { class: 'hook-stage seed' }, [h('div', { class: 'stars-bg' }), h('div', { class: 'seedbig', text: '🌰' })]);
    var list = h('div', { class: 'clues' }), mis = h('div', { class: 'missions', style: 'display:none' });
    var nextBtn = btn('🔍 First question', 'amber big', function () {
      i++;
      if (i < D.seedPrompts.length) { list.appendChild(h('div', { class: 'clue big', text: '❓ ' + D.seedPrompts[i] })); A.speak(D.seedPrompts[i]); sfx('tap'); nextBtn.textContent = i < D.seedPrompts.length - 1 ? 'Next question ▶' : 'Show the missions ▶'; }
      else { nextBtn.style.display = 'none'; mis.style.display = 'grid'; sfx('win'); }
    });
    body.appendChild(stage); body.appendChild(list); body.appendChild(h('div', { class: 'row' }, [nextBtn]));
    D.missions2.forEach(function (m, k) { mis.appendChild(h('div', { class: 'mission' }, [h('div', { class: 'num', text: String(k + 1) }), h('div', { class: 'em', text: m.e }), h('div', { text: m.t })])); });
    body.appendChild(mis);
  }

  function l2Story(c) {
    var body = c.body, i = 0;
    function beat() {
      var b = D.beats[i], revealed = false;
      body.innerHTML = '';
      var set = h('div', { class: 'stage-set' }), acts = [];
      b.actors.forEach(function (a) { var e = h('div', { class: 'act', text: a.e, style: 'left:' + a.x + '%;top:' + a.y + '%;font-size:' + a.s + 'vh' }); acts.push(e); set.appendChild(e); });
      body.appendChild(set);
      var gap = h('span', { class: 'gap', text: '?' });
      body.appendChild(h('div', { class: 'beat-line' }, [b.pre + ' ', gap, ' ' + b.post]));
      var gest = h('div', { class: 'gesture', text: 'Gesture: ' + b.gesture }), wrong = h('div', { class: 'wrongs' });
      var rev = btn('👀 Reveal the verb', 'amber big', function () {
        if (revealed) return; revealed = true; gap.textContent = b.gap; gap.classList.add('filled'); sfx('correct');
        b.actors.forEach(function (a, k) { if (a.fx) acts[k].classList.add('fx-' + a.fx); });
        wrong.innerHTML = b.wrong.map(function (w) { return '<s>' + w + '</s>'; }).join(' ') + ' ➜ <b>' + b.gap + '</b>' + (b.note ? ' <i>(' + b.note + ')</i>' : '');
        A.speak(b.pre + ' ' + b.gap + ' ' + b.post); rev.disabled = true;
      });
      var last = i === D.beats.length - 1;
      var nxt = btn(last ? 'Finish ✔' : 'Next scene ▶', 'green', function () {
        if (!last) { i++; beat(); return; }
        body.innerHTML = ''; sfx('win'); confetti();
        body.appendChild(h('div', { class: 'prompt', text: 'Six irregular verbs! Say them again, with all the gestures:' }));
        body.appendChild(h('div', { class: 'verbgrid' }, D.beats.map(function (x) { return h('button', { type: 'button', class: 'btn vb', onclick: function () { sfx('tap'); A.speak(x.gap); } }, [h('b', { text: x.gap }), h('small', { text: x.gesture })]); })));
        body.appendChild(sayBtn(D.beats.map(function (x) { return x.gap; }).join(', '), 'Say all six'));
      });
      body.appendChild(h('div', { class: 'row' }, [btn('🔊 Read it (stop at the gap)', 'ghost small', function () { A.speak(b.pre + ' …'); }), rev, nxt, h('span', { class: 'pill amber', text: 'Scene ' + (i + 1) + ' of ' + D.beats.length })]));
      body.appendChild(gest); body.appendChild(wrong);
    }
    beat();
  }

  function l2Freeze(c) {
    var body = c.body, groups = shuffle([1, 2, 3, 4, 5, 6]), dealt = false, grid = h('div', { class: 'fgrid' }), spotlight = h('div', { class: 'spotlight' }), cards = [];
    D.freeze.forEach(function (f, k) {
      var el = h('div', { class: 'fcard' }, [h('div', { class: 'em', text: f.e }), h('div', { class: 'ft', text: f.t }), h('div', { class: 'gbadge', text: '?' })]);
      var go = btn('▶ Perform', 'small cyan', function () { perform(k, el); }); go.style.display = 'none'; el.appendChild(go); el._go = go; cards.push(el); grid.appendChild(el);
    });
    var deal = btn('🃏 Deal the scenes', 'amber', function () {
      dealt = true; sfx('season'); cards.forEach(function (el, k) { el.querySelector('.gbadge').textContent = 'Group ' + groups[k]; el._go.style.display = 'inline-block'; }); deal.disabled = true; spotlight.textContent = 'Groups: read your card. Plan a FREEZE-FRAME with your bodies. No talking! ⏱ Use the timer.';
    });
    function perform(k, el) {
      el.classList.add('done'); spotlight.innerHTML = ''; setTimeout(function () { spotlight.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, 60);
      var big = h('div', { class: 'count', text: '3' }); spotlight.appendChild(h('div', { class: 'prompt', text: 'Group ' + groups[k] + ', get ready!' })); spotlight.appendChild(big);
      var n = 3, iv = setInterval(function () {
        n--; if (n > 0) { big.textContent = String(n); sfx('tap'); return; }
        clearInterval(iv); big.textContent = '❄️ FREEZE!'; sfx('season');
        spotlight.appendChild(h('div', { class: 'prompt', text: 'Class: look! What is the sentence?' }));
        var r = btn('👀 Reveal', 'amber', function () { r.disabled = true; var s = D.freeze[k].t; spotlight.appendChild(h('div', { class: 'sentence', text: s })); A.speak(s); sfx('correct'); });
        spotlight.appendChild(r); spotlight.appendChild(pointsRow()); spotlight.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 900);
      c.later(function () { clearInterval(iv); });
    }
    body.appendChild(h('div', { class: 'row' }, [deal, timerBtn(c, 90)])); body.appendChild(grid); body.appendChild(spotlight);
  }

  function l2Case(c) {
    var body = c.body, seen = {}, out = {}, els = {};
    var sus = h('div', { class: 'suspects' }); D.suspects.forEach(function (s) { var el = h('button', { type: 'button', class: 'suspect', onclick: function () { solve(s, el); } }, [h('div', { class: 'em', text: s.e }), h('div', { text: s.n })]); els[s.id] = el; sus.appendChild(el); });
    var board = h('div', { class: 'clueboard' }), msg = h('div', { class: 'msg', text: '🔎 Case: someone left a gift on Go Ne’s roof. WHO? Witnesses: tell your clue out loud. Do not show your card!' });
    D.clues.forEach(function (cl, k) {
      var line = h('div', { class: 'cl' }), b = btn('Witness ' + cl.w, 'small cyan', function () {
        if (seen[k]) return; seen[k] = true; b.disabled = true; line.appendChild(h('span', { class: 'ct', text: '“' + cl.t + '”' })); A.speak(cl.t); sfx('tap');
        cl.out.forEach(function (id) { out[id] = true; els[id].classList.add('out'); }); if (cl.out.length) sfx('soft');
        if (Object.keys(seen).length >= 3) msg.textContent = '🤔 Who is left? Talk to your group. Then press Solve!';
      }); line.insertBefore(b, line.firstChild); board.appendChild(line);
    });
    var done = false;
    function solve(s, el) {
      if (done) return;
      if (Object.keys(seen).length < 3) { msg.className = 'msg soft'; msg.textContent = 'Not enough clues yet. Ask more witnesses!'; return; }
      if (s.id === 'wen') { done = true; el.classList.add('win'); msg.className = 'msg'; var t = 'Wen Shu left a gift for the roof. Case closed!'; msg.textContent = '🎉 ' + t; A.speak(t); sfx('win'); confetti(); }
      else { sfx('soft'); el.style.animation = 'wob .35s'; setTimeout(function () { el.style.animation = ''; }, 400); msg.className = 'msg soft'; msg.textContent = 'Not him! Check the clues again.'; }
    }
    body.appendChild(msg); body.appendChild(sus); body.appendChild(board);
    body.appendChild(h('div', { class: 'hintbox', text: 'To solve: tap the suspect you think is right.' }));
  }

  function l2Train(c) {
    var body = c.body, i = 0, order = shuffle(D.aiPairs.map(function (p, k) { return k; })), word = '', pair = null;
    var train = h('div', { class: 'train' }, [h('div', { class: 'engine', text: '🚂' })]);
    D.aiWords.forEach(function (w) { train.appendChild(h('button', { type: 'button', class: 'btn car', html: w.replace('ai', '<b>ai</b>'), onclick: function () { sfx('tap'); A.speak(w); } })); });
    train.appendChild(btn('🎵 Chant + clap', 'amber small', function () { A.speak(D.aiChant.join(' ')); }));
    train.appendChild(btn('🐌 Snail Rap', 'violet small', function () { openRap(c); }));
    var info = h('div', { class: 'big-say' }), msg = h('div', { class: 'msg' });
    function listen() { pair = D.aiPairs[order[i]]; word = pair[Math.random() < 0.6 ? 0 : 1]; info.textContent = '👂 Listen…  Long ai = STAND UP tall.  Short a = SIT down.'; msg.textContent = ''; A.speak(word); }
    var started = false, lbtn = btn('🔊 Listen', 'violet', function () { if (!started) { started = true; listen(); } else A.speak(word); });
    var rev = btn('👀 Reveal', 'amber', function () { var ai = /ai/.test(word); info.innerHTML = '<b>' + word.replace('ai', '<span style="color:#fde047">ai</span>') + '</b> ' + (ai ? '🧍 stand! (ai says /eɪ/)' : '🪑 sit! (short a)'); sfx('correct'); });
    var nxt = btn('Next word ▶', 'green', function () { if (i >= D.aiPairs.length - 1) { sfx('win'); confetti(); info.textContent = '🚂 The Rain Train is home! Well done!'; return; } i++; listen(); });
    body.appendChild(train); body.appendChild(info); body.appendChild(h('div', { class: 'row' }, [lbtn, rev, nxt, h('span', { class: 'pill amber', text: 'Pairs: rain/ran · tail/tell · paid/pad' })])); body.appendChild(msg); body.appendChild(pointsRow());
    info.textContent = '🚂 Tap the carriages to hear the ai words. Then press Listen to start the game!';
  }

  function openRap(c) {
    if (document.querySelector('.rap')) return;
    var R = D.rap, audio = new Audio(R.src), playing = false;
    function lyric(l) { return l.replace(/([A-Za-z']+)/g, function (w) { return /ai/i.test(w) ? '<b class="aiw">' + w + '</b>' : w; }); }
    function block(lines, cls) { return h('div', { class: 'rapblock ' + (cls || ''), html: lines.map(function (l) { return '<p>' + lyric(l) + '</p>'; }).join('') }); }
    var more = h('div', { style: 'display:none' }, [h('div', { class: 'raplab', text: 'Verse' }), block(R.verse), h('div', { class: 'raplab', text: 'Outro' }), block(R.outro)]);
    var play = btn('▶ Play the song', 'green big', function () { if (playing) { audio.pause(); playing = false; play.textContent = '▶ Play the song'; } else if (A.isOn()) { var pr = audio.play(); if (pr && pr.catch) pr.catch(function () { playing = false; play.textContent = '▶ Play the song'; }); playing = true; play.textContent = '⏸ Pause'; } });
    audio.addEventListener('ended', function () { playing = false; play.textContent = '▶ Play the song'; sfx('win'); confetti(); });
    var panel = h('div', { class: 'rap' }, [
      h('div', { class: 'row' }, [h('h3', { text: '🐌 ' + R.title }), h('div', { class: 'grow' }), btn('✕ Close', 'small ghost', function () { audio.pause(); panel.remove(); })]),
      h('div', { class: 'raplab', text: 'Chorus (sing and do the actions!)' }), block(R.chorus, 'chorus'),
      h('div', { class: 'row' }, R.actions.map(function (a) { return h('span', { class: 'chip2', text: a[1] }); })),
      h('div', { class: 'row' }, [play, btn('Show all the words', 'small cyan', function () { more.style.display = more.style.display === 'none' ? 'block' : 'none'; })]),
      more, h('div', { class: 'hintbox', text: 'Gold words have the ai sound. Listen once. Then chorus together. Then try: clap on every ai word!' })
    ]);
    c.later(function () { audio.pause(); panel.remove(); });
    $('stage').appendChild(panel);
  }

  function l2Court(c) {
    var body = c.body, tab = h('div', { class: 'row' }), main = h('div', { class: 's-body' });
    function hot() {
      main.innerHTML = '';
      main.appendChild(h('div', { class: 'prompt', text: '🎤 A pupil is Wen Shu. The class asks the questions!' }));
      var q = h('div', { class: 'bubble left' }), a = h('div', { class: 'bubble right', style: 'visibility:hidden' }), cur = 0;
      function show() { q.innerHTML = '<small>🙋 Class asks</small>' + D.hotseat[cur].q; a.style.visibility = 'hidden'; a.innerHTML = '<small>🧒 Wen Shu</small>' + D.hotseat[cur].a; A.speak(D.hotseat[cur].q); }
      var list = h('div', { class: 'row' }); D.hotseat.forEach(function (x, k) { list.appendChild(btn('Q' + (k + 1), 'small ghost', function () { cur = k; show(); })); });
      main.appendChild(h('div', { class: 'dialog' }, [q, a])); main.appendChild(list);
      main.appendChild(h('div', { class: 'row' }, [btn('💡 Show a model answer', 'amber', function () { a.style.visibility = 'visible'; A.speak(D.hotseat[cur].a); sfx('correct'); }), btn('Next question ▶', 'green', function () { cur = (cur + 1) % D.hotseat.length; show(); })]));
      main.appendChild(h('div', { class: 'hintbox', text: 'Pupil Wen Shu answers FIRST in their own words. Then press the model answer.' })); show();
    }
    function vote() {
      main.innerHTML = ''; var i = 0, kindness = 0;
      function fork() {
        var f = D.forks[i], viewed = {}, got = false; main.innerHTML = '';
        main.appendChild(h('div', { class: 'pill amber', style: 'align-self:flex-start', text: 'Vote ' + (i + 1) + ' of ' + D.forks.length + '   • hands up for A or B!' }));
        main.appendChild(h('div', { class: 'center', style: 'font-size:9vh;line-height:1', text: f.scene })); main.appendChild(h('div', { class: 'prompt', text: f.q }));
        var meter = h('div', { class: 'meter' }, [h('i', { style: 'width:' + Math.max(8, Math.min(100, 50 + kindness * 16)) + '%' })]), outEl = h('div'), after = h('div', { class: 'row' }), fk = h('div', { class: 'fork' });
        [['A', f.a], ['B', f.b]].forEach(function (p) {
          fk.appendChild(h('button', { type: 'button', class: 'btn opt', text: p[0] + ': ' + p[1].t, onclick: function () {
            sfx(p[1].kind > 0 ? 'correct' : 'soft'); if (!viewed[p[0]]) { viewed[p[0]] = 1; kindness += p[1].kind; }
            meter.firstChild.style.width = Math.max(8, Math.min(100, 50 + kindness * 16)) + '%'; outEl.innerHTML = ''; outEl.appendChild(h('div', { class: 'outcome', text: (p[1].kind > 0 ? '❤️ ' : '💔 ') + p[1].out }));
            if (p[1].kind > 0 && !got) { got = true; after.appendChild(h('div', { class: 'sentence', text: f.say })); after.appendChild(sayBtn(f.say)); var last = i === D.forks.length - 1; after.appendChild(btn(last ? 'Finish ✔' : 'Next vote ▶', 'green', function () { if (last) { sfx('win'); confetti(); main.innerHTML = ''; main.appendChild(h('div', { class: 'report' }, [h('div', { class: 'rank', text: '❤️' }), h('div', { class: 'score', text: 'Kindness grows friendship!' })])); } else { i++; fork(); } })); }
          } }));
        });
        main.appendChild(fk); main.appendChild(h('div', { class: 's-intro', text: '❤️ Kindness meter' })); main.appendChild(meter); main.appendChild(outEl); main.appendChild(after);
      }
      fork();
    }
    tab.appendChild(btn('🎤 Hot seat', 'cyan small', hot)); tab.appendChild(btn('⚖️ Kindness vote', 'violet small', vote));
    body.appendChild(tab); body.appendChild(main); hot();
  }

  function l2Wrap(c) {
    var body = c.body, i = 0, chosen = [], timer = null;
    c.later(function () { if (timer) clearInterval(timer); });
    function render() {
      body.innerHTML = '';
      body.appendChild(h('div', { class: 'prompt', text: 'Build the 3-sentence retell. Class decides, then tap!' }));
      var rt = h('div', { class: 'retell' });
      D.retell.forEach(function (r, k) { rt.appendChild(h('div', { class: 'rslot' }, [h('div', { class: 'lead', text: r.lead }), h('div', { class: 'rbox' + (chosen[k] ? ' ok' : ''), text: chosen[k] || '…' })])); });
      body.appendChild(rt);
      if (i >= D.retell.length) {
        var lower = function (t) { return /^(A|The) /.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t; };
        var full = D.retell.map(function (r, k) { return r.lead + ' ' + lower(chosen[k]); }).join(' '), tm = h('div', { class: 'timer', text: '1:00' });
        body.appendChild(h('div', { class: 'row' }, [sayBtn(full, 'Read the retell'),
          btn('⏱ Partner retell: 60 seconds', 'violet', function () { if (timer) clearInterval(timer); var t = 60; tm.textContent = '1:00'; timer = setInterval(function () { t--; tm.textContent = Math.floor(t / 60) + ':' + ('0' + (t % 60)).slice(-2); if (t <= 0) { clearInterval(timer); timer = null; sfx('win'); } }, 1000); }), tm,
          btn('🏆 See the scores', 'green', function () { wrap(c, 2); })]));
        body.appendChild(h('div', { class: 'hintbox', text: 'Pairs: tell the story. Use First, Then, At the end. Do not look at the board!' }));
        return;
      }
      var r = D.retell[i], msg = h('div', { class: 'msg' }), opts = h('div', { class: 'opts' });
      shuffle([r.right].concat(r.wrong)).forEach(function (t) {
        var b = h('button', { type: 'button', class: 'btn opt', text: t });
        b.addEventListener('click', function () {
          if (t === r.right) { chosen[i] = t; i++; sfx('coin'); render(); }
          else { sfx('soft'); b.classList.add('wrong'); setTimeout(function () { b.classList.remove('wrong'); }, 400); msg.className = 'msg soft'; msg.textContent = 'Not yet. Does it fit "' + r.lead + '"?'; }
        });
        opts.appendChild(b);
      });
      body.appendChild(h('div', { class: 'prompt', text: r.lead + ' …' })); body.appendChild(opts); body.appendChild(msg);
    }
    render();
  }

  /* ---------- lessons ---------- */
  var MODES = { think: '🤔 Think', listen: '👂 Listen', act: '🎭 Act it out', move: '🚶 Move', talk: '🗣️ Talk', create: '🎨 Create', race: '🏆 Team race', detect: '🔍 Detective', story: '📖 Story' };
  var LESSONS = {
    1: { title: 'Forest Rangers', missions: D.missions1, door: '🚪 Door pass: say ONE sentence with "so it can…" before you leave!', scenes: [
      { t: 'A Letter from Ranger Rosa', mins: '4 min', mode: 'think', run: l1Hook, intro: 'A mystery message has arrived…',
        kids: { steps: ['🤫 Listen to the letter', '🤔 Whisper to your partner: which animals live in a forest?'], say: ['I think … live in the forest.'] },
        tip: ['Dim the lights if you can. Press Open the letter and read each line slowly. Pupils guess what the mission will be.', 'Pre-teach nothing. Pupils will meet deciduous and coniferous in the next step, in context.', 'Show the four missions: this is the plan for the lesson.'] },
      { t: 'One Year in the Forest', mins: '8 min', mode: 'act', run: l1Story, intro: 'Everyone stand up! Act every part with your body.',
        kids: { steps: ['🧍 Stand up and do the action', '🗣️ Repeat after the teacher (echo)', '🤝 At the end, retell it to a partner'], say: ['… so it can …', '… so they can …'] },
        tip: ['Tell the story in your own words. Pupils do the action first, then you press the next part. The key sentences (gold) contain so they can: repeat them three times.', 'At the 🤔 parts the screen waits: pupils predict with their bodies before you press Reveal. This builds meaning before language.', 'Gesture for so they can: point your arm forward like an arrow. Pupils use it every time they say it.', 'Watch for because instead of so they can. Because looks back; so they can looks forward at the goal.'] },
      { t: 'Walk to Your Forest', mins: '6 min', mode: 'move', run: l1Walk, intro: 'Stick tape on the floor: the left side is DECIDUOUS, the right side is CONIFEROUS, the line is BOTH.',
        kids: { steps: ['👀 Read the card', '🚶 Walk to your forest (or stand on the line)', '🗣️ Tell a partner why'], say: ['It is a … forest because …'] },
        tip: ['Print the three signs from the Cards page (or write them). Pupils walk on the count of three. Ask two pupils why: It is a coniferous forest because the trees have needles.', 'Press Show the answer only after they have all chosen. Reward good reasons with team points, not only right answers.', 'Safety: walk, do not run.'] },
      { t: 'Animal Interviews', mins: '7 min', mode: 'talk', run: l1Interview, intro: 'Pairs: one is a Ranger Reporter and one is a winter animal. Then swap!',
        kids: { steps: ['🎤 Reporter: ask the 3 questions', '🐾 Animal: answer with your card', '🔁 When the timer rings, swap roles'], say: ['How do you survive winter?', 'I … so I can …'] },
        tip: ['Print the animal cards (Cards page) and cut them. Each pair gets one animal card for Animal. If you cannot print, pupils choose an animal from the board.', 'Model the whole dialogue once with a confident pupil. Then pairs work for 3 minutes. Walk around and listen only.', 'This is the real speaking practice: every pupil speaks at the same time.'] },
      { t: 'Invent a Survivor', mins: '7 min', mode: 'create', run: l1Create, intro: 'Draw an animal that can survive winter. Use the challenge!',
        kids: { steps: ['🎲 Read the challenge', '🎨 Draw your animal on the mini whiteboard', '✍️ Write 2 sentences', '📢 Show and say it'], say: ['This is a … It has … so it can …'] },
        tip: ['Pairs get 4 minutes. The rule: your animal must have TWO adaptations and the sentences must have so it can.', 'Gallery: pairs hold up their boards while you walk around. Ask three pairs to read aloud, and the class applauds.', 'Praise the language, not the drawing.'] },
      { t: 'Beat the Blizzard', mins: '5 min', mode: 'race', run: l1Race, intro: 'Teams: write the answer on your mini whiteboard before the blizzard comes!',
        kids: { steps: ['👀 Read the board', '✍️ Team writes the answer', '⬆️ Hold up the board at 0'], say: [] },
        tip: ['Start the timer. Teams write on mini whiteboards and hold them up when the time is over. Press Show the answer.', 'Give a point to every team that is correct, not only the fastest.', 'Rounds mix sentences, headings and author’s purpose, so you also check the reading skills.'] },
      { t: 'Ranger Badge Ceremony', mins: '3 min', mode: 'think', run: l1Wrap, intro: 'Mission complete!',
        kids: { steps: ['🏆 Cheer for every team', '🚪 Door pass: one sentence with so it can…'], say: [] },
        tip: ['Show the scores and cheer for everyone. Door pass at the door: each pupil says one sentence with so it can before leaving. It is a quick check for you.'] }
    ] },
    2: { title: "The Swallow's Gift", missions: D.missions2, door: '🚪 Door pass: tell me ONE thing that happened in the story, with a past verb!', scenes: [
      { t: 'The Golden Seed', mins: '4 min', mode: 'think', run: l2Hook, intro: 'A mysterious seed… Today you are Story Detectives.',
        kids: { steps: ['🤔 Guess with your partner', '🗣️ Share your idea'], say: ['I think a … gave it because …'] },
        tip: ['If you can, bring a real prop: a chocolate coin or a gold-wrapped sweet. Hold it up: What is it? Who gave it? Why?', 'Accept all predictions. Do not say the answer yet. The story will tell.'] },
      { t: 'A New Friend, with Actions', mins: '8 min', mode: 'listen', run: l2Story, intro: 'Listen. When I stop, SHOUT the verb and do the action!',
        kids: { steps: ['👂 Listen to the sentence', '🗣️ SHOUT the missing verb', '🙌 Do the action'], say: ['built · fell · gave · grew · hit · paid'] },
        tip: ['Read the sentence and stop at the gap. Pupils shout the verb and do the action; then press Reveal.', 'Press Reveal to show the right form: falled, growed, payed are crossed out. The 🔊 reads the whole sentence.', 'hit does not change: stress it. At the end, say all six verbs with the actions, fast.'] },
      { t: 'Freeze-Frame Theatre', mins: '7 min', mode: 'act', run: l2Freeze, intro: 'Groups: act a scene without talking. The class guesses the sentence!',
        kids: { steps: ['🃏 Read your scene', '🧍 Plan a freeze-frame (no talking!)', '❄️ FREEZE on my signal', '🗣️ Class says the sentence'], say: ['He/She/It … (past)'] },
        tip: ['Six groups of 3-4. Press Deal the scenes and start the 90-second timer. Groups plan a still picture with their bodies.', 'Press Perform for each group: 3-2-1 FREEZE. The class guesses the sentence with a past verb. Then press Reveal.', 'Points for the guessing and the acting.'] },
      { t: 'The Roof Mystery', mins: '8 min', mode: 'detect', run: l2Case, intro: 'Who left the gift on the roof? Listen to the witnesses!',
        kids: { steps: ['🕵️ Witness: read your clue out loud', '👂 Everyone: listen and cross out suspects', '🤝 Group: solve the case'], say: ['It was not … He/She …'] },
        tip: ['Print the witness cards (Cards page) and give one to each pupil in groups of six. Pupils read their clue aloud and do not show the card. If you cannot print, press the witness buttons.', 'Press the matching Witness button as each clue is told: suspects are crossed out. Clues 4-6 are the proof.', 'Let groups argue and decide before you press a suspect.'] },
      { t: 'The Rain Train', mins: '4 min', mode: 'listen', run: l2Train, intro: 'Listen for the long ai sound. Stand up for ai, sit for short a! Then sing the Snail Rap.',
        kids: { steps: ['👂 Listen', '🧍 Long ai: stand', '🪑 Short a: sit'], say: ['rain · train · tail · mail'] },
        tip: ['Clap the chant: Rain, rain, train, train. Pupils stand for the long ai sound and sit for the short a.', 'Press Snail Rap: play the song once while pupils listen. The chorus is for singing with actions (snail, tail, mail). Ask them to clap every gold ai word.', 'If the voice is missing, say the word yourself and press Reveal.'] },
      { t: 'Hot Seat and Kindness Vote', mins: '6 min', mode: 'talk', run: l2Court, intro: 'A pupil is Wen Shu. Ask him questions. Then vote!',
        kids: { steps: ['🙋 Ask Wen Shu questions', '🎤 Wen Shu answers', '✋ Vote with your hands: A or B'], say: ['Why did you …?', 'I think … should … because …'] },
        tip: ['Choose a confident pupil for Wen Shu (or you take the role). The class asks. Wen Shu answers in their own words first.', 'The vote: count hands for A and B. Ask a pupil to explain with because. Let the class try the other path too. The meter shows what kindness does.'] },
      { t: 'Retell and Scores', mins: '3 min', mode: 'talk', run: l2Wrap, intro: 'Build a 3-sentence retell, then tell it to a partner.',
        kids: { steps: ['🗣️ Tell the story: First, Then, At the end', '🏆 Cheer for every team'], say: ['First, … Then, … At the end, …'] },
        tip: ['Three sentences is the goal for every pupil. Run the 60-second timer. Walk around and listen for First, Then, At the end.', 'End with the scores and the door pass.'] }
    ] }
  };

  /* ---------- shell ---------- */
  function ctxFor(main) {
    return { body: main, done: function () { state.done[state.lesson + ':' + state.idx] = true; drawSteps(); }, later: function (fn) { state.cleanups.push(fn); } };
  }
  function drawSteps() {
    var L = LESSONS[state.lesson], box = $('steps'); box.innerHTML = '';
    L.scenes.forEach(function (s, k) {
      var isDone = state.done[state.lesson + ':' + k];
      box.appendChild(h('button', { type: 'button', class: 'dot' + (k === state.idx ? ' on' : '') + (isDone ? ' done' : ''), text: isDone ? '✓' : String(k + 1), title: s.t, onclick: function () { go(state.lesson, k); } }));
    });
    $('back').disabled = state.idx === 0; $('next').disabled = state.idx === L.scenes.length - 1;
  }
  function kidsPanel(k) {
    if (!k) return null;
    var steps = h('ol', { class: 'ysteps' }, k.steps.map(function (s) { return h('li', { text: s }); }));
    var say = h('div', { class: 'ysay' }, (k.say || []).map(function (s) { return h('button', { type: 'button', class: 'frame', text: s, onclick: function () { A.speak(s.replace(/…/g, '')); } }); }));
    return h('div', { class: 'youdo' }, [h('div', { class: 'ylab', text: 'YOU DO' }), steps, (k.say && k.say.length) ? h('div', { class: 'ylab say', text: 'SAY' }) : null, (k.say && k.say.length) ? say : null]);
  }
  function go(lesson, idx) {
    if (state.idx >= 0 && state.lesson === lesson && idx > state.idx) state.done[lesson + ':' + state.idx] = true;
    state.cleanups.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } }); state.cleanups = [];
    A.stop();
    state.lesson = lesson; state.idx = idx;
    var L = LESSONS[lesson], s = L.scenes[idx], stage = $('stage');
    stage.className = ''; stage.innerHTML = ''; $('tip').hidden = true;
    stage.appendChild(h('div', { class: 's-head' }, [h('h2', { text: s.t }), h('span', { class: 'pill mode', text: MODES[s.mode] }), h('span', { class: 'pill', text: '⏱ ' + s.mins }), h('div', { class: 'grow' }), h('span', { class: 'pill amber', text: 'Step ' + (idx + 1) + ' of ' + L.scenes.length })]));
    stage.appendChild(h('div', { class: 's-intro', text: s.intro }));
    var main = h('div', { class: 's-body' }); stage.appendChild(main);
    var kp = kidsPanel(s.kids); if (kp) stage.appendChild(kp);
    $('tab1').classList.toggle('on', lesson === 1); $('tab2').classList.toggle('on', lesson === 2);
    $('h-title').firstChild.nodeValue = L.title;
    drawSteps(); sfx('page');
    try { s.run(ctxFor(main)); } catch (e) { main.appendChild(h('div', { class: 'msg soft', text: 'Oops, this activity could not start.' })); if (window.console) console.error(e); }
    try { history.replaceState(null, '', '?lesson=' + lesson + '&scene=' + (idx + 1)); } catch (e) { /* ignore */ }
  }
  function tipHtml() {
    var s = LESSONS[state.lesson].scenes[state.idx], t = $('tip'); t.innerHTML = '';
    t.appendChild(h('h4', { text: '🎓 ' + s.t + '  •  ' + s.mins }));
    s.tip.forEach(function (x, k) { t.appendChild(h('p', { text: (k + 1) + '. ' + x })); });
  }

  $('tab1').addEventListener('click', function () { go(1, 0); });
  $('tab2').addEventListener('click', function () { go(2, 0); });
  $('back').addEventListener('click', function () { if (state.idx > 0) go(state.lesson, state.idx - 1); });
  $('next').addEventListener('click', function () { if (state.idx < LESSONS[state.lesson].scenes.length - 1) go(state.lesson, state.idx + 1); });
  $('tipbtn').addEventListener('click', function () { var t = $('tip'); if (t.hidden) { tipHtml(); t.hidden = false; } else t.hidden = true; });
  $('snd').addEventListener('click', function () { A.setOn(!A.isOn()); $('snd').textContent = A.isOn() ? '🔊' : '🔇'; });
  $('fs').addEventListener('click', function () { try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } catch (e) { /* ignore */ } });
  document.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') $('next').click(); else if (e.key === 'ArrowLeft') $('back').click(); });

  var q = {}; (location.search || '').replace(/^\?/, '').split('&').forEach(function (p) { var kv = p.split('='); if (kv[0]) q[kv[0]] = decodeURIComponent(kv[1] || ''); });
  var l0 = q.lesson === '2' ? 2 : 1, s0 = Math.max(0, Math.min(LESSONS[l0].scenes.length - 1, (parseInt(q.scene, 10) || 1) - 1));
  window.ForestLessons = { state: state, go: go, LESSONS: LESSONS };
  drawTeams(); state.idx = -1; go(l0, s0);
})();
