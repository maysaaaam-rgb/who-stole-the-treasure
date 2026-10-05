/* Unit 2 Grade 3: two teacher-led smartboard lessons. The board is the stage, timer and scoreboard.
   The children move, act, talk, draw and solve. Four teams earn points all lesson. One smartboard, mini whiteboards. */
(function () {
  'use strict';
  var D = window.G3LessonsData, A = window.ForestAudio;
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
  function lc(t) { return t.charAt(0).toLowerCase() + t.slice(1); }

  var state = { lesson: 1, idx: -1, scores: D.teams.map(function () { return 0; }), done: {}, cleanups: [] };

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

  /* ---------- helpers ---------- */
  function confetti() {
    var host = $('stage'), em = ['⭐', '🎉', '🌟', '✨', '🌕', '🍡', '🌱'], k, w = h('div', { class: 'confetti' });
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

  /* ---------- generic activities ---------- */
  function hookLetter(c, lines, missions, envEmoji, bgClass) {
    var body = c.body, i = -1;
    var sky = h('div', { class: 'hook-stage ' + (bgClass || '') }), paper = h('div', { class: 'letter', style: 'display:none' }), mis = h('div', { class: 'missions', style: 'display:none' });
    sky.appendChild(h('div', { class: 'stars-bg' })); sky.appendChild(paper); body.appendChild(sky);
    var env = h('div', { class: 'envelope', text: envEmoji }); sky.appendChild(env);
    var nextBtn = btn('✉ Open the invitation', 'amber big', function () {
      i++;
      if (i === 0) { env.style.display = 'none'; paper.style.display = 'block'; sfx('page'); }
      if (i < lines.length) { paper.appendChild(h('p', { class: 'ln', text: lines[i] })); sfx('tap'); A.speak(lines[i]); nextBtn.textContent = i < lines.length - 1 ? 'Next line ▶' : 'Show the missions ▶'; }
      else { nextBtn.style.display = 'none'; mis.style.display = 'grid'; sfx('win'); }
    });
    body.appendChild(h('div', { class: 'row' }, [nextBtn, sayBtn(lines.join(' '), 'Read it all')]));
    missions.forEach(function (m, k) { mis.appendChild(h('div', { class: 'mission' }, [h('div', { class: 'num', text: String(k + 1) }), h('div', { class: 'em', text: m.e }), h('div', { text: m.t })])); });
    body.appendChild(mis);
  }

  function storyBar(body) {
    var cap = h('div', { class: 'caption' }), act = h('div', { class: 'gesture' }), count = h('span', { class: 'pill amber' });
    var go = btn('▶ Tell the story', 'green big'), echo = sayBtn('', 'Echo');
    body.appendChild(h('div', { class: 'storybar' }, [h('div', { class: 'grow' }, [cap, act]), h('div', { class: 'col' }, [count, go, echo])]));
    return { cap: cap, act: act, count: count, go: go, echo: echo };
  }
  // runs a story: items with say/act/predict/key; apply(item) updates the picture
  function runStory(c, items, apply, intro, outro) {
    var sb = storyBar(c.body), i = -1, cur = null, revealed = false;
    sb.count.textContent = 'Part 0 of ' + items.length;
    sb.cap.appendChild(h('div', { class: 'say', text: intro }));
    sb.echo.onclick = function () { if (cur) A.speak(cur.say); };
    function show(ch) { sb.cap.innerHTML = ''; sb.cap.appendChild(h('div', { class: 'say' + (ch.key ? ' key' : ''), text: ch.say })); sb.act.textContent = ch.act; sb.act.style.display = 'block'; apply(ch); sfx('season'); A.speak(ch.say); }
    function next() {
      if (cur && cur.predict && !revealed) { revealed = true; show(cur); sb.go.textContent = i === items.length - 1 ? '🎬 Finish' : '▶ Next part'; return; }
      i++; revealed = false;
      if (i >= items.length) { sb.cap.innerHTML = ''; sb.cap.appendChild(h('div', { class: 'say', text: outro })); sb.act.style.display = 'none'; sfx('win'); confetti(); sb.go.textContent = '↺ Tell it again'; i = -1; cur = null; sb.count.textContent = 'The end'; apply(null); return; }
      cur = items[i]; sb.count.textContent = 'Part ' + (i + 1) + ' of ' + items.length;
      if (cur.predict) { apply(cur, true); sb.cap.innerHTML = ''; sb.cap.appendChild(h('div', { class: 'say predict', text: '🤔 ' + cur.predict })); sb.act.textContent = '✋ Show with your body. Talk to your partner. Then I reveal!'; sb.act.style.display = 'block'; sb.go.textContent = '👀 Reveal'; sfx('page'); }
      else { show(cur); sb.go.textContent = i === items.length - 1 ? '🎬 Finish' : '▶ Next part'; }
    }
    sb.go.onclick = next;
  }

  function walkScene(c, zones, cards, sentence, intro, speakFn) {
    var body = c.body, i = 0, revealed = false;
    var card = h('div', { class: 'walkcard' }), info = h('div', { class: 'msg' }), z = {}, zonesEl = h('div', { class: 'zones' });
    zones.forEach(function (zn) { z[zn.k] = h('div', { class: 'zone', style: '--c:' + zn.c, text: zn.t }); zonesEl.appendChild(z[zn.k]); });
    zonesEl.style.gridTemplateColumns = 'repeat(' + zones.length + ', 1fr)';
    var rev = btn('👀 Show the answer', 'amber', function () {
      if (revealed) return; revealed = true; var w = cards[i]; z[w.a].classList.add('hit'); sfx('correct'); var s = sentence(w); info.textContent = s; A.speak(speakFn ? speakFn(w) : s);
    });
    var nxt = btn('Next card ▶', 'green', function () {
      if (i >= cards.length - 1) { info.textContent = '🏁 Mission complete! Back to your seats, please.'; sfx('win'); confetti(); return; }
      i++; draw();
    });
    function draw() { revealed = false; Object.keys(z).forEach(function (k) { z[k].classList.remove('hit'); }); var w = cards[i]; card.innerHTML = ''; card.appendChild(h('div', { class: 'em', text: w.e })); card.appendChild(h('div', { class: 'tx', text: w.t })); card.appendChild(h('div', { class: 'pill amber', text: 'Card ' + (i + 1) + ' of ' + cards.length })); info.textContent = intro; sfx('page'); }
    body.appendChild(card); body.appendChild(zonesEl); body.appendChild(info);
    body.appendChild(h('div', { class: 'row' }, [rev, nxt, btn('🔊 Read card', 'small ghost', function () { A.speak(cards[i].t); })]));
    body.appendChild(pointsRow());
    draw();
  }

  function raceScene(c, rounds, sayHint) {
    var body = c.body, i = 0, revealed = false;
    var stim = h('div', { class: 'stim' }), box = h('div', { class: 'msg' });
    var tm = timerBtn(c, 45, function () { $('stage').classList.add('storm'); }, function () { $('stage').classList.remove('storm'); });
    var show = btn('✅ Show the answer', 'amber', function () {
      if (revealed) return; revealed = true; var r = rounds[i]; sfx('correct'); $('stage').classList.remove('storm'); tm.resetTimer();
      box.className = 'msg'; box.textContent = '✔ ' + r.answer; A.speak(r.answer);
    });
    var nxt = btn('Next round ▶', 'green', function () { if (i >= rounds.length - 1) { sfx('win'); confetti(); box.textContent = '🏁 Mission complete! Great teamwork!'; return; } i++; draw(); });
    function draw() {
      revealed = false; var r = rounds[i]; box.textContent = ''; stim.innerHTML = '';
      stim.appendChild(h('div', { class: 'pill amber', text: 'Round ' + (i + 1) + ' of ' + rounds.length }));
      if (r.type === 'scramble') { stim.appendChild(h('div', { class: 'prompt', text: '✍️ Write the sentence on your mini whiteboard!' })); stim.appendChild(h('div', { class: 'scr' }, shuffle(r.words).map(function (w) { return h('span', { class: 'tile2', text: w }); }))); }
      else if (r.type === 'count') { stim.appendChild(h('div', { class: 'prompt', text: '👀 Count and write: There is… / There are…' })); var em = h('div', { class: 'countrow' }); for (var k = 0; k < r.n; k++) em.appendChild(h('span', { text: r.emoji })); stim.appendChild(em); }
      else { stim.appendChild(h('div', { class: 'prompt', text: '🔤 Make a word with the letters. It ends with -st!' })); stim.appendChild(h('div', { class: 'scr' }, shuffle(r.letters).map(function (w) { return h('span', { class: 'tile2', text: w }); }))); }
      sfx('page');
    }
    body.appendChild(h('div', { class: 'row' }, [tm, show, nxt])); body.appendChild(stim); body.appendChild(box); body.appendChild(pointsRow());
    draw();
  }

  function wrapScreen(c, lesson) {
    var body = c.body; body.innerHTML = ''; podium(body);
    var L = LESSONS[lesson];
    body.appendChild(h('div', { class: 'row', style: 'justify-content:center' }, L.missions.map(function (m) { return h('span', { class: 'pill amber', text: '✅ ' + m.e + ' ' + m.t }); })));
    body.appendChild(h('div', { class: 'door', text: L.door }));
    var rowb = h('div', { class: 'row', style: 'justify-content:center' });
    if (lesson === 1) rowb.appendChild(btn('Lesson 2: First Harvest ▶', 'green big', function () { go(2, 0); }));
    rowb.appendChild(btn('🎉 Celebrate!', 'amber', function () { sfx('win'); confetti(); }));
    body.appendChild(rowb); sfx('win'); confetti();
  }
  function wrapStart(c, lesson, emoji, title) {
    c.body.appendChild(h('div', { class: 'report' }, [h('div', { class: 'rank', text: emoji }), h('div', { class: 'score', text: title }), btn('🏆 See the scores', 'green big', function () { wrapScreen(c, lesson); })]));
  }

  /* ============================== LESSON 1 ============================== */
  function l1Story(c) {
    var body = c.body;
    var moon = h('div', { class: 'moon' }, [h('div', { class: 'shade' })]), scene = h('div', { class: 'bigscene', text: '🌾' });
    var sky = h('div', { class: 'moonpanel' }, [h('div', { class: 'stars-bg' }), moon, scene, h('div', { class: 'hills' })]);
    function setMoon(p) { moon.firstChild.style.transform = 'translateX(' + Math.round((1 - p) * 100) + '%)'; moon.classList.toggle('full', p >= 1); }
    setMoon(0.02);
    body.appendChild(sky);
    runStory(c, D.legend, function (ch) { if (!ch) { setMoon(1); scene.textContent = '🌕'; return; } setMoon(ch.phase); scene.textContent = ch.scene; }, 'Stand up, friends! We are going to act out the legend of the moon.', '🎬 Now tell the legend to your partner! Use: They weave… The king gives a feast…');
  }

  function l1Mingle(c) {
    var body = c.body;
    var grid = h('div', { class: 'tgrid' });
    D.thanks.forEach(function (t) { grid.appendChild(h('button', { type: 'button', class: 'btn tcardx', onclick: function () { sfx('tap'); A.speak(t.n); } }, [h('span', { class: 'em', text: t.e }), h('span', { text: t.n })])); });
    var q = h('div', { class: 'bubble left' }), a = h('div', { class: 'bubble right' });
    q.innerHTML = '<small>🙋 Friend 1</small>What are you thankful for?'; a.innerHTML = '<small>🙂 Friend 2</small>I am thankful for my <b>family</b>.';
    var model = btn('🔊 Model it', 'small amber', function () { A.speakSeq(['What are you thankful for?', 'I am thankful for my family.', 'because I love them.']); });
    var stop = btn('🛑 Freeze! Back to your seats', 'coral', function () { sfx('win'); stop.textContent = '🛑 Thank you, friends!'; setTimeout(function () { stop.textContent = '🛑 Freeze! Back to your seats'; }, 2500); });
    body.appendChild(h('div', { class: 'row' }, [timerBtn(c, 240), stop, model]));
    body.appendChild(h('div', { class: 'dialog' }, [q, a]));
    body.appendChild(h('div', { class: 'row' }, D.becauseBank.map(function (b) { return h('button', { type: 'button', class: 'chip2', text: '…because ' + lc(b), onclick: function () { A.speak('because ' + lc(b)); } }); })));
    body.appendChild(grid);
  }

  function l1Lantern(c) {
    var body = c.body, n = 0;
    var wall = h('div', { class: 'wall' }), cnt = h('span', { class: 'pill amber', text: '🏮 0 lanterns' });
    var add = btn('🏮 Add a lantern to the Moon Wall', 'violet', function () { n++; cnt.textContent = '🏮 ' + n + ' lantern' + (n === 1 ? '' : 's'); wall.appendChild(h('span', { class: 'lant', text: '🏮', style: 'animation-delay:' + (Math.random() * 0.4) + 's' })); sfx('coin'); if (n % 6 === 0) confetti(); });
    var bank = h('div', { class: 'bank' }, D.thanks.map(function (t) { return h('button', { type: 'button', class: 'chip2', text: t.e + ' ' + t.n, onclick: function () { sfx('tap'); A.speak(t.n); } }); }));
    body.appendChild(h('div', { class: 'row' }, [timerBtn(c, 240), add, btn('🎉 Applause!', 'green', function () { sfx('win'); confetti(); }), cnt]));
    body.appendChild(h('div', { class: 'frame-big', html: 'I am thankful for my <b>__________</b> because <b>__________</b>.' }));
    body.appendChild(bank); body.appendChild(h('div', { class: 'moonwall' }, [h('div', { class: 'moon small full' }, [h('div', { class: 'shade', style: 'transform:translateX(100%)' })]), wall]));
  }

  /* ============================== LESSON 2 ============================== */
  function cropRow(n, size) {
    var row = h('div', { class: 'crops' });
    D.crops.slice(0, n).forEach(function (cr) { row.appendChild(h('div', { class: 'crop' }, [h('span', { class: 'ce', text: cr.e, style: 'filter:' + cr.f + ';font-size:' + (size || 9) + 'vh' }), h('small', { text: cr.c + ' ' + cr.n })])); });
    return row;
  }
  function l2Hook(c) {
    var body = c.body, i = -1;
    var stage = h('div', { class: 'hook-stage farmhook' }, [h('div', { class: 'stars-bg' }), cropRow(5, 11)]);
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
    var body = c.body;
    var view = h('div', { class: 'win earth' }, [h('div', { class: 'sunmars', text: '☀️' }), h('div', { class: 'hill' }), h('div', { class: 'marstag', text: 'MARS!' })]);
    var inside = h('div', { class: 'inside' }), fam = h('div', { class: 'fam', text: '👨 👩 👦 👧' }), cropsEl = h('div');
    inside.appendChild(cropsEl); inside.appendChild(fam);
    var farm = h('div', { class: 'farmpanel' }, [view, inside]);
    body.appendChild(farm);
    function setCrops(n) { cropsEl.innerHTML = ''; cropsEl.appendChild(cropRow(n, 8)); }
    setCrops(0);
    runStory(c, D.farm, function (ch) {
      if (!ch) { return; }
      setCrops(ch.show || 0); fam.textContent = ch.suits ? '🧑‍🚀 🧑‍🚀 🧑‍🚀 🧑‍🚀' : '👨 👩 👦 👧';
      var mars = !!ch.mars; view.className = 'win ' + (mars ? 'mars' : 'earth'); view.querySelector('.sunmars').textContent = mars ? '🪐' : '☀️';
      if (mars) { sfx('win'); }
    }, 'Stand up, friends! Listen carefully. Where is this farm? Do not shout the answer yet!', '🎬 Now tell the story to your partner. Where is the farm? What are the colours?');
  }

  function l2St(c) {
    var body = c.body, i = 0, order = shuffle(D.stPairs.map(function (p, k) { return k; })), word = '', started = false;
    function hl(w) { return w.replace(/st$/, '<b>st</b>'); }
    var train = h('div', { class: 'train' });
    D.stWords.forEach(function (w) { train.appendChild(h('button', { type: 'button', class: 'btn car', html: hl(w), onclick: function () { sfx('tap'); A.speak(w); } })); });
    train.appendChild(btn('🎵 Chant + clap', 'amber small', function () { A.speak(D.stChant.join(' ')); }));
    var info = h('div', { class: 'big-say' });
    function listen() { var pair = D.stPairs[order[i]]; word = pair[Math.random() < 0.6 ? 0 : 1]; info.textContent = '👂 Listen…  Ends with -st: hand up like STOP ✋.   No -st: hands down.'; A.speak(word); }
    var lbtn = btn('🔊 Listen', 'violet', function () { if (!started) { started = true; listen(); } else A.speak(word); });
    var rev = btn('👀 Reveal', 'amber', function () { var yes = /st$/.test(word); info.innerHTML = '<b>' + hl(word) + '</b> ' + (yes ? '✋ STOP! (ends with -st)' : '🙌 no stop (no -st)'); sfx('correct'); });
    var nxt = btn('Next word ▶', 'green', function () { if (i >= D.stPairs.length - 1) { sfx('win'); confetti(); info.textContent = '🛑 Great stopping, everybody!'; return; } i++; listen(); });
    body.appendChild(train); body.appendChild(info); body.appendChild(h('div', { class: 'row' }, [lbtn, rev, nxt, h('span', { class: 'pill amber', text: 'Pairs: fast/fat · best/bet · nest/net · lost/lot' })])); body.appendChild(pointsRow());
    info.textContent = '🚂 Tap the carriages to hear the -st words. Then press Listen to start the game!';
  }

  function l2Dict(c) {
    var body = c.body;
    var ex = h('div', { class: 'bubble right', html: '<small>🗣️ Model</small>There are <b>three</b> <b>pink</b> potatoes. There are <b>two</b> <b>purple</b> corn.' });
    var q = h('div', { class: 'bubble left', html: '<small>🖍️ Partner draws</small>How many? What colour?' });
    var grid = h('div', { class: 'dgrid' });
    D.dict.forEach(function (d) {
      var el = h('div', { class: 'dcard' }, [h('div', { class: 'dn', text: 'Card ' + d.id }), h('div', { class: 'dbody', text: '?' })]);
      var rb = btn('Reveal', 'small cyan', function () {
        var body2 = el.querySelector('.dbody'); body2.innerHTML = '';
        d.items.forEach(function (it) { var cr = D.crops.filter(function (x) { return x.n === it[1]; })[0]; var row = h('div', { class: 'drow' }); for (var k = 0; k < it[2]; k++) row.appendChild(h('span', { text: cr.e, style: 'filter:' + cr.f })); row.appendChild(h('small', { text: ' ' + it[0] + ' ' + it[1] })); body2.appendChild(row); });
        sfx('tap'); rb.disabled = true;
      });
      el.appendChild(rb); grid.appendChild(el);
    });
    body.appendChild(h('div', { class: 'row' }, [timerBtn(c, 240), btn('🔊 Model it', 'small amber', function () { A.speak('There are three pink potatoes. There are two purple corn.'); }), btn('🔁 Swap roles!', 'coral', function () { sfx('season'); })]));
    body.appendChild(h('div', { class: 'dialog' }, [ex, q]));
    body.appendChild(h('div', { class: 'hintbox', text: 'Check at the end: press Reveal to show a card on the board. Does the partner\'s drawing match?' }));
    body.appendChild(grid);
  }

  /* ============================== LESSON 3: ARCADE DAY ============================== */
  var pupilsN = 19;
  function rotation(n) { var hosts = Math.ceil(n / 2), vis = n - hosts, groups = Math.max(1, Math.ceil(vis / 3)); return { hosts: hosts, vis: vis, groups: groups }; }
  function chips(list, cls) { return h('div', { class: 'row' }, list.map(function (t) { return h('button', { type: 'button', class: cls || 'chip2', text: t, onclick: function () { sfx('tap'); A.speak(t.replace(/…/g, '')); } }); })); }

  function arcadeOpen(c) {
    var body = c.body, G = D.arcade;
    var stations = h('div', { class: 'stations' }, G.games.map(function (g, k) { return h('button', { type: 'button', class: 'station', onclick: function () { sfx('tap'); A.speak(g.n + '. ' + g.rule); info.textContent = g.e + ' ' + g.n + ': ' + g.rule; } }, [h('div', { class: 'em', text: g.e }), h('div', { class: 'nm', text: g.n })]); }));
    var info = h('div', { class: 'msg', text: 'Tap a game to hear an example rule. Your hosts will use their OWN rules.' });
    var plan = h('div', { class: 'planbox' }), nTxt = h('b', { text: String(pupilsN) });
    function drawPlan() { var r = rotation(pupilsN); nTxt.textContent = pupilsN; plan.innerHTML = '<b>Round 1:</b> ' + r.hosts + ' hosts stay at their stations. ' + r.vis + ' visitors go in ' + r.groups + ' groups of about 3.<br><b>Every 3 minutes:</b> visitor groups move to the next station (clockwise).<br><b>Round 2:</b> swap roles. <b>Round 3:</b> open arcade, visit a NEW station.'; }
    var stepper = h('div', { class: 'row' }, [h('span', { class: 'lab', text: '👥 Pupils in class today:' }), btn('−', 'small ghost', function () { pupilsN = Math.max(6, pupilsN - 1); drawPlan(); }), nTxt, btn('+', 'small ghost', function () { pupilsN = Math.min(34, pupilsN + 1); drawPlan(); })]);
    body.appendChild(h('div', { class: 'arcadesign', text: '🎮 CHUSEOK ARCADE 🌕' }));
    body.appendChild(stations); body.appendChild(info);
    body.appendChild(h('div', { class: 'dialog' }, [h('div', { class: 'bubble right' }, [h('small', { text: '🏠 HOSTS say' }), h('div', { text: 'Hello! Welcome to my game. The rules are … Let us play! Thank you for playing!' })]), h('div', { class: 'bubble left' }, [h('small', { text: '🎮 VISITORS say' }), h('div', { text: 'Can I play? … Great job! … Thank you!' })])]));
    body.appendChild(h('div', { class: 'raplab', text: 'Cheering phrases (tap to hear)' })); body.appendChild(chips(G.cheers));
    body.appendChild(stepper); body.appendChild(plan); drawPlan();
  }

  function arcadeRound(c, round) {
    var body = c.body, SEC = window.__arcadeSec || 180, mini = 0, left = SEC, iv = null, G = D.arcade;
    var roles = [
      ['🏠 HOSTS: stay at your station', '🎮 VISITORS: go to a station', 'Hosts: welcome, say your rules, let the visitors play, cheer for them, and ask them to sign your log.'],
      ['🔁 SWAP! Visitors are now HOSTS', '🏠 Hosts are now VISITORS', 'Roles have changed. New hosts: welcome your visitors and say your rules.'],
      ['🌟 OPEN ARCADE', '🎯 Visit a station you have NOT visited yet', 'Host or visit. Try new games and sign the logs. Hosts: you can still host!']
    ][round - 1];
    var r = rotation(pupilsN);
    var clock = h('div', { class: 'bigclock', text: '3:00' }), dots = h('div', { class: 'row', style: 'justify-content:center' });
    var status = h('div', { class: 'msg' }), go = btn('▶ Start 3 minutes', 'green big', start);
    function drawDots() { dots.innerHTML = ''; for (var k = 0; k < 3; k++) dots.appendChild(h('span', { class: 'pill ' + (k < mini ? '' : 'amber'), text: (k < mini ? '✓ ' : '') + 'Station time ' + (k + 1) })); }
    function fmt(s) { return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
    function start() {
      if (iv) return; left = SEC; clock.textContent = fmt(left); clock.classList.remove('rotate'); status.textContent = '🎮 Play, cheer and sign the log!'; go.disabled = true; sfx('season');
      iv = setInterval(function () {
        left--; clock.textContent = fmt(Math.max(0, left));
        if (left <= 0) { clearInterval(iv); iv = null; mini++; drawDots(); sfx('win'); clock.classList.add('rotate'); clock.textContent = '🔔';
          if (mini >= 3) { status.textContent = '🏁 Round ' + round + ' is finished! ' + (round < 3 ? 'Get ready to swap roles.' : 'Arcade closed. Thank you, hosts and visitors!'); confetti(); go.textContent = '✓ Round done'; go.disabled = true; c.done(); }
          else { status.textContent = '🔔 ROTATE! Visitors, walk clockwise to the next station.'; go.textContent = '▶ Start next 3 minutes'; go.disabled = false; }
        }
      }, 1000);
    }
    c.later(function () { if (iv) clearInterval(iv); });
    var cols = h('div', { class: 'dialog' }, [h('div', { class: 'bubble right' }, [h('small', { text: roles[0] }), h('div', { text: roles[2] })]), h('div', { class: 'bubble left' }, [h('small', { text: roles[1] }), h('div', { text: 'Visitors: say "Can I play?", play, cheer, say "Thank you!" At the bell move to the next station.' })])]);
    body.appendChild(h('div', { class: 'row' }, [h('span', { class: 'pill amber', text: round === 3 ? 'Round 3: open arcade' : 'Round ' + round + ' of 3' }), h('span', { class: 'pill', text: r.hosts + ' hosts · ' + r.vis + ' visitors · ' + r.groups + ' groups' })]));
    body.appendChild(clock); body.appendChild(dots); body.appendChild(h('div', { class: 'row', style: 'justify-content:center' }, [go])); body.appendChild(status);
    body.appendChild(cols);
    body.appendChild(chips(G.cheers.concat(G.visit)));
    body.appendChild(pointsRow());
    drawDots();
  }

  function arcadeShare(c) {
    var body = c.body, G = D.arcade, counts = G.games.map(function () { return 0; });
    var bars = h('div', { class: 'votes' });
    function draw() { var max = Math.max.apply(null, counts.concat([1])); bars.innerHTML = ''; G.games.forEach(function (g, k) {
      bars.appendChild(h('div', { class: 'vote' }, [
        h('button', { type: 'button', class: 'btn votebtn', onclick: function () { counts[k]++; sfx('coin'); draw(); } }, [h('span', { class: 'em', text: g.e }), h('span', { text: g.n })]),
        h('div', { class: 'vbar' }, [h('i', { style: 'height:' + (counts[k] / max * 100) + '%' })]), h('b', { text: String(counts[k]) })]));
    }); }
    body.appendChild(h('div', { class: 'prompt', text: '⭐ Which game was your favourite? Tell us why!' }));
    body.appendChild(h('div', { class: 'frame-big', html: 'My favourite game was <b>__________</b> because <b>__________</b>.' }));
    body.appendChild(h('div', { class: 'row' }, [btn('🎉 Applause!', 'green', function () { sfx('win'); confetti(); }), btn('↺ Reset votes', 'small ghost', function () { counts = G.games.map(function () { return 0; }); draw(); }), h('span', { class: 'pill amber', text: 'Tap a game each time a pupil says it is their favourite' })]));
    body.appendChild(bars); body.appendChild(chips(['It is fun.', 'It is easy.', 'It is exciting.', 'I like the rules.', 'I won!']));
    draw();
  }

  /* ---------- lessons ---------- */
  var MODES = { think: '🤔 Think', listen: '👂 Listen', act: '🎭 Act it out', move: '🚶 Move', talk: '🗣️ Talk', create: '🎨 Create', race: '🏆 Team race', detect: '🔍 Detective', story: '📖 Story' };
  var LESSONS = {
    1: { title: 'Chuseok Moon Feast', missions: D.missions1, door: '🚪 Door pass: say "I am thankful for my ___" before you leave!', scenes: [
      { t: 'The Moon Invitation', mins: '4 min', mode: 'think', run: function (c) { hookLetter(c, D.letter, D.missions1, '💌', 'moonhook'); }, intro: 'A letter has arrived from a friend in Korea…',
        kids: { steps: ['🤫 Listen to the invitation', '🤔 Whisper to your partner: what is a festival?'], say: ['A festival has …'] },
        tip: ['Read the invitation line by line. Ask: What is a festival? What festival do you like? Accept one-word answers and sentences.', 'Show the four missions. This is the plan for the lesson.', 'Do not pre-teach Chuseok: pupils meet the words in the story next.'] },
      { t: 'The Moon Legend', mins: '8 min', mode: 'act', run: l1Story, intro: 'Everyone stand up! Act every part with your body.',
        kids: { steps: ['🧍 Stand up and do the action', '🗣️ Repeat after the teacher (echo)', '🤝 At the end, retell it to a partner'], say: ['They weave cloth.', 'The king gives a feast.'] },
        tip: ['Tell the legend in your own words. Pupils do the action first, then you press the next part. Watch the moon grow as the month goes by.', 'At the 🤔 part the screen waits: pupils guess which team wins before you press Reveal.', 'Key gesture: weave = hands go over and under. Practise it three times. The words weave, cloth, contest, feast, harvest and ancestors all appear here.', 'Ancestors: say "the grandparents of our grandparents" and bow.'] },
      { t: 'Visit the Festival Corners', mins: '6 min', mode: 'move', run: function (c) { walkScene(c, D.zones1, D.walk1, function (w) { var z = D.zones1.filter(function (x) { return x.k === w.a; })[0]; return z.t + ': ' + w.t; }, '🚶 Walk to the right corner! FOOD, DANCE or FAMILY?', function (w) { return w.t; }); }, intro: 'Stick the three signs on the walls: FOOD, DANCE and FAMILY.',
        kids: { steps: ['👀 Read the card', '🚶 Walk to the right corner', '🗣️ Say the sentence to a friend'], say: ['People eat songpyeon.', 'Families travel home.'] },
        tip: ['Print the three corner signs from the Cards page. Pupils walk on the count of three. Ask two pupils to read the sentence aloud, then show the answer.', 'Some cards have more than one possible corner; accept good reasons and give team points for them.', 'Safety: walk, never run.'] },
      { t: 'What Are You Thankful For?', mins: '7 min', mode: 'talk', run: l1Mingle, intro: 'Walk around the room. Ask three friends. Tick your sheet!',
        kids: { steps: ['🚶 Walk and find a friend', '🗣️ Ask and answer', '✅ Tick the picture, then find a new friend'], say: ['What are you thankful for?', 'I am thankful for my … because …'] },
        tip: ['Print the mingle sheet (Cards page): each pupil ticks the pictures that friends say. Model one dialogue with a pupil first.', 'Stretch: add "because". Support: point to the picture card and say only the word.', 'Start the timer. When it rings press Freeze and everyone sits down.'] },
      { t: 'Thank-You Lanterns', mins: '7 min', mode: 'create', run: l1Lantern, intro: 'Write and draw a thank-you on your paper lantern.',
        kids: { steps: ['✍️ Write: I am thankful for my … because …', '🎨 Draw it on your lantern', '📢 Show it and read it to the class'], say: ['I am thankful for my … because …'] },
        tip: ['Give each pupil a paper lantern (Cards page) or a rectangle of paper. Four minutes to write and draw.', 'Each pupil who reads aloud earns an applause; press Add a lantern each time to build the Moon Wall on the board.', 'Stick the real lanterns on the class wall afterwards: a "Gratitude Moon".'] },
      { t: 'Harvest Moon Race', mins: '5 min', mode: 'race', run: function (c) { raceScene(c, D.race1); }, intro: 'Teams: write the answer on your mini whiteboard before the timer ends!',
        kids: { steps: ['👀 Read or count', '✍️ Team writes the answer', '⬆️ Hold up the board at 0'], say: [] },
        tip: ['Start the timer. Teams write on mini whiteboards and hold them up when time is over. Press Show the answer.', 'Give a point to every team that is correct, not only the fastest.', 'The counting rounds practise There is / There are with number words.'] },
      { t: 'Thank-You Ceremony', mins: '3 min', mode: 'think', run: function (c) { wrapStart(c, 1, '🌕', 'Chuseok Moon Feast'); }, intro: 'Mission complete!',
        kids: { steps: ['🏆 Cheer for every team', '🚪 Door pass: I am thankful for my …'], say: [] },
        tip: ['Show the scores and cheer for everyone. At the door each pupil says one sentence with I am thankful for my … It is a quick check for you.'] }
    ] },
    2: { title: 'First Harvest', missions: D.missions2, door: '🚪 Door pass: ask me "Can we go outside?" and I will answer!', scenes: [
      { t: 'A Strange Farm', mins: '4 min', mode: 'think', run: l2Hook, intro: 'Look at this farm. Something is strange…',
        kids: { steps: ['👀 Look at the colours', '🤔 Guess with your partner: where is this farm?'], say: ['There are … potatoes.', 'I think it is …'] },
        tip: ['Do NOT tell pupils where the farm is. The reveal comes at the end of the story. Accept all guesses (a magic farm, another country, a dream).', 'Ask What colour? and practise There are pink potatoes. Write guesses on the board if you like.'] },
      { t: 'First Harvest: the Story', mins: '8 min', mode: 'act', run: l2Story, intro: 'Listen and act. Do not shout where the farm is!',
        kids: { steps: ['🧍 Stand up and do the action', '🗣️ Repeat after the teacher (echo)', '🤫 Keep the secret: where is the farm?'], say: ['There are … ', 'Can we go outside?'] },
        tip: ['Press Tell the story. Pupils do each action. At the 🤔 part the screen waits: pupils guess what Mom says before you press Reveal.', 'Press Next to reveal the surprise: the farm is on Mars. Wait for the gasps! Then ask: How do you know? (space suits, air, helmets).', 'Key language: There is not much water. There are pink potatoes. Can we go outside? Check your space suits.', 'Worried: act it out with a worried face. Believe: shake your head: I do not believe it!'] },
      { t: 'Setting Detectives', mins: '6 min', mode: 'move', run: function (c) { walkScene(c, D.zones2, D.walk2, function (w) { var s = { E: 'Earth', M: 'Mars', B: 'both Earth and Mars' }[w.a]; return 'It is ' + s + ' because ' + lc(w.t); }, '🚶 Where is it? EARTH, MARS or BOTH? Walk to the right place!'); }, intro: 'Stick the signs EARTH, BOTH and MARS on the walls.',
        kids: { steps: ['👀 Read the card', '🚶 Walk to Earth, Mars or Both', '🗣️ Say why'], say: ['It is Mars because …'] },
        tip: ['Print the signs from the Cards page. The setting is the place and time of a story. Pupils walk, then give a reason with because.', 'Reward the reason, not only the right corner.'] },
      { t: 'The Stop Sound: -st', mins: '5 min', mode: 'listen', run: l2St, intro: 'Listen for the stop sound at the end of the word.',
        kids: { steps: ['👂 Listen to the word', '✋ -st at the end: hand up like STOP', '🙌 No -st: hands down'], say: ['fast · last · best · first'] },
        tip: ['Say the words first: fast, last, lost, best, test, first, harvest, nest. Pupils copy the stop hand.', 'Press Listen: pupils show a stop hand or hands down. Then press Reveal.', 'If the voice does not work, say the word yourself.'] },
      { t: 'Describe and Draw the Farm', mins: '7 min', mode: 'talk', run: l2Dict, intro: 'Pairs: one describes, one draws. Then swap!',
        kids: { steps: ['🗣️ Pupil A: describe your card', '🖍️ Pupil B: draw on the mini whiteboard', '🔁 Swap roles, then check the card'], say: ['There are … … (colour) … (thing).'] },
        tip: ['Print the farm cards (Cards page): six different cards. Pupil A holds a card and describes it with There is / There are and colours; Pupil B draws on the mini whiteboard without looking.', 'Model once with a pupil. Walk around and listen. Use Reveal to show a card on the board for checking.'] },
      { t: 'Mars Mission Race', mins: '6 min', mode: 'race', run: function (c) { raceScene(c, D.race2); }, intro: 'Teams: complete the mission before the timer ends!',
        kids: { steps: ['👀 Read, count or look at the letters', '✍️ Team writes the answer', '⬆️ Hold up the board at 0'], say: [] },
        tip: ['Same routine as Lesson 1. Teams write on mini whiteboards; reveal the answer after each round; give a point to every correct team.', 'This round checks Can we go outside?, There is / There are, and -st words.'] },
      { t: 'Mission Complete', mins: '4 min', mode: 'think', run: function (c) { wrapStart(c, 2, '🚀', 'First Harvest on Mars'); }, intro: 'You have finished the mission!',
        kids: { steps: ['🏆 Cheer for every team', '🚪 Door pass: Can we go outside?'], say: ['Can we go outside?'] },
        tip: ['At the door each pupil asks "Can we go outside?" and you answer: "Yes, check your space suit!" It checks the question form and the new vocabulary.'] }
    ] },
    3: { title: 'Chuseok Games Arcade Day', missions: D.missions3, door: '🚪 Door pass: say ONE rule of your game in English before you leave!', scenes: [
      { t: 'The Arcade Opens', mins: '5 min', mode: 'think', run: arcadeOpen, intro: 'Today the pupils are the teachers: they host the games they made at home.',
        kids: { steps: ['🎮 Put your game on your desk', '🏠 Hosts: get your host script ready', '📣 Everybody: practise the cheering phrases'], say: ['Welcome to my game.', 'Great job!'] },
        tip: ['Pupils put their home-made game and rulebook on their desks. Check that every pupil has a game; pair a pupil who forgot with a friend as a co-host.', 'Use the stepper to enter the number of pupils present: the board tells you how many hosts and visitor groups there are.', 'Practise the cheering phrases twice. Say the rules of the day: hosts stay, visitors move at the bell, everybody signs the visitor log.'] },
      { t: 'Round 1: Hosts and Visitors', mins: '9 min', mode: 'talk', run: function (c) { arcadeRound(c, 1); }, intro: 'Half the class host. Half the class visit. Rotate at the bell!',
        kids: { steps: ['🏠 Hosts: welcome, say the rules, let them play', '🎮 Visitors: play, cheer and thank the host', '✍️ Host signs the visitor log'], say: ['Can I play?', 'Great job!', 'Thank you for playing!'] },
        tip: ['Press Start. Three 3-minute station times. At the bell visitor groups walk clockwise to the next host. Press Start again for each station time.', 'Walk around and listen. Do not correct during the games; note good hosting and cheering for team points. Use the Point for buttons below.', 'Listen for: the host says the rules in English, the visitor cheers in English, and the log gets signed.'] },
      { t: 'Round 2: Swap Roles', mins: '9 min', mode: 'talk', run: function (c) { arcadeRound(c, 2); }, intro: 'Swap! Visitors become hosts. Hosts become visitors.',
        kids: { steps: ['🔁 Swap roles', '🏠 New hosts: say your rules', '🎮 New visitors: play and cheer'], say: ['Welcome to my game.', 'That was fun!'] },
        tip: ['Same routine with the roles swapped. Pupils who were hosts take their game to a visitor table first; make sure no game is left behind.', 'Give a point to teams where every pupil is speaking English.'] },
      { t: 'Round 3: Open Arcade', mins: '9 min', mode: 'move', run: function (c) { arcadeRound(c, 3); }, intro: 'Visit a station you have not visited yet. Everybody can host or visit!',
        kids: { steps: ['🎯 Choose a NEW station', '🎮 Play, cheer and thank the host', '✍️ Sign the log (aim for 3 visitors)'], say: ['Can I try again?', 'You can do it!'] },
        tip: ['Open arcade: pupils choose where to go. Check the visitor logs: every host should have 3 signatures.', 'This round is for pupils who still need to host or visit. Help quiet pupils to join a station.'] },
      { t: 'My Favourite Game', mins: '5 min', mode: 'talk', run: arcadeShare, intro: 'Tell the class which game you liked best, and why.',
        kids: { steps: ['🗣️ Say: My favourite game was … because …', '🗳️ Teacher taps the game', '👏 Applause for every pupil'], say: ['My favourite game was … because …'] },
        tip: ['Ask pupils to say the sentence aloud. Tap the game each time. Ask three pupils to give a reason with because.', 'Support: pupils may say only the name of the game. Stretch: pupils add a rule of the game.'] },
      { t: 'Arcade Champions', mins: '3 min', mode: 'think', run: function (c) { wrapStart(c, 3, '🏆', 'Chuseok Arcade Champions'); }, intro: 'Thank you, hosts and visitors!',
        kids: { steps: ['🏆 Cheer for every team', '🚪 Door pass: say one rule of your game'], say: ['The rule is …'] },
        tip: ['Show the scores and cheer for everyone. At the door each pupil says one rule of their game in English.'] }
    ] }
  };

  /* ---------- shell ---------- */
  function ctxFor(main) { return { body: main, done: function () { state.done[state.lesson + ':' + state.idx] = true; drawSteps(); }, later: function (fn) { state.cleanups.push(fn); } }; }
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
    $('tab1').classList.toggle('on', lesson === 1); $('tab2').classList.toggle('on', lesson === 2); $('tab3').classList.toggle('on', lesson === 3);
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
  $('tab3').addEventListener('click', function () { go(3, 0); });
  $('back').addEventListener('click', function () { if (state.idx > 0) go(state.lesson, state.idx - 1); });
  $('next').addEventListener('click', function () { if (state.idx < LESSONS[state.lesson].scenes.length - 1) go(state.lesson, state.idx + 1); });
  $('tipbtn').addEventListener('click', function () { var t = $('tip'); if (t.hidden) { tipHtml(); t.hidden = false; } else t.hidden = true; });
  $('snd').addEventListener('click', function () { A.setOn(!A.isOn()); $('snd').textContent = A.isOn() ? '🔊' : '🔇'; });
  $('fs').addEventListener('click', function () { try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } catch (e) { /* ignore */ } });
  document.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') $('next').click(); else if (e.key === 'ArrowLeft') $('back').click(); });

  var q = {}; (location.search || '').replace(/^\?/, '').split('&').forEach(function (p) { var kv = p.split('='); if (kv[0]) q[kv[0]] = decodeURIComponent(kv[1] || ''); });
  var l0 = q.lesson === '3' ? 3 : (q.lesson === '2' ? 2 : 1), s0 = Math.max(0, Math.min(LESSONS[l0].scenes.length - 1, (parseInt(q.scene, 10) || 1) - 1));
  window.G3Lessons = { state: state, go: go, LESSONS: LESSONS };
  drawTeams(); go(l0, s0);
})();
