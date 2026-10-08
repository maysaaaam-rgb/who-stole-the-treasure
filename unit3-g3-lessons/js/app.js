/* Unit 3 Grade 3: two teacher-led smartboard lessons. The board is the stage, timer and scoreboard.
   The children move, act, talk, draw and solve. Four teams earn points all lesson. One smartboard, mini whiteboards. */
(function () {
  'use strict';
  var D = window.U3G3Data, A = window.ForestAudio;
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
  /* real pictures: ART maps an emoji to a picture name; HAS lists the pictures that exist in art/ (art/manifest.json).
     A missing picture falls back to the emoji, so the lessons work with any number of pictures. */
  var HAS = {};
  var ART = {
    '🐐': 'w_goat', '🌾': 'w_grain', '🐚': 'w_cowrie_shells', '⚒️': 'w_knives_spades', '🪙': 'w_coin', '💳': 'w_credit_card', '💵': 'w_bill',
    '🫙': 'w_jar_saving', '🍕': 'w_pizza', '👳': 'c_farmer_a', '🧴': 'w_plastic', '🔩': 'w_metal', '💎': 'w_valuable', '🔄': 'w_bartered',
    '📱': 'w_cell_phone', '👛': 'w_wallet', '🐷': 'w_save', '💸': 'w_expensive', '🍽️': 'w_restaurant', '⭕': 'w_round_holed_coin', '💰': 'w_money',
    '😴': 'w_tired', '🍎': 'w_apple', '🍪': 'w_cookie', '🎈': 'w_balloon', '📚': 'w_book', '🧸': 'w_teddy', '⚽': 'w_football', '🍞': 'w_bread',
    '🎬': 'w_cinema', '🚌': 'w_bus', '🎡': 'w_funfair', '👑': 'w_lydia_coin', '⏳': 'w_waiting', '🏪': 'w_shop'
  };
  function hasArt(name) { return !!(name && HAS[name]); }
  function imgEl(name, e, cls) {
    var im = h('img', { class: 'pic' + (cls ? ' ' + cls : ''), src: 'art/' + name + '.webp', alt: '', draggable: 'false' });
    im.addEventListener('error', function () { var sp = document.createElement('span'); sp.textContent = e || ''; if (im.parentNode) im.parentNode.replaceChild(sp, im); });
    return im;
  }
  function pic(e, cls) { var f = ART[e]; return hasArt(f) ? imgEl(f, e, cls) : null; }
  function fill(el, e, cls, name) {
    if (name && hasArt(name)) { el.appendChild(imgEl(name, e, cls)); return el; }
    var toks = String(e).split(' ');
    if (toks.length > 1) { toks.forEach(function (t) { el.appendChild(fill(h('span', { class: 'tok' }), t, cls)); }); return el; }
    var im = pic(e, cls); if (im) el.appendChild(im); else el.textContent = e;
    return el;
  }
  function art(name, cls) { return hasArt(name) ? imgEl(name, '', cls) : h('span'); }
  function loadManifest(done) {
    var fin = false; function end() { if (!fin) { fin = true; done(); } }
    try { var x = new XMLHttpRequest(); x.open('GET', 'art/manifest.json?v=' + Date.now(), true); x.onload = function () { try { JSON.parse(x.responseText).forEach(function (n) { HAS[n] = 1; }); } catch (e) { /* none */ } end(); }; x.onerror = end; x.send(); setTimeout(end, 2500); } catch (e) { end(); }
  }
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
    var host = $('stage'), em = ['⭐', '🎉', '🌟', '✨', '🪙', '💰', '🐚'], k, w = h('div', { class: 'confetti' });
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
    var env = fill(h('div', { class: 'envelope' }), envEmoji); sky.appendChild(env);
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
    function draw() { revealed = false; Object.keys(z).forEach(function (k) { z[k].classList.remove('hit'); }); var w = cards[i]; card.innerHTML = ''; card.appendChild(fill(h('div', { class: 'em' }), w.e)); card.appendChild(h('div', { class: 'tx', text: w.t })); card.appendChild(h('div', { class: 'pill amber', text: 'Card ' + (i + 1) + ' of ' + cards.length })); info.textContent = intro; sfx('page'); }
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
      else if (r.type === 'price') { stim.appendChild(h('div', { class: 'prompt', text: '💬 Ask and answer: How much is it? Write the answer.' })); stim.appendChild(h('div', { class: 'pricecard' }, [fill(h('span', { class: 'pe' }), r.emoji), h('b', { class: 'pt', text: '$' + r.price })])); }
      else { stim.appendChild(h('div', { class: 'prompt', text: '🤔 ' + r.prompt })); stim.appendChild(h('div', { class: 'countrow' }, r.emoji.split(' ').map(function (e) { return fill(h('span'), e); }))); }
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
    if (lesson === 1) rowb.appendChild(btn('Lesson 2: Before Money Was Money ▶', 'green big', function () { go(2, 0); }));
    rowb.appendChild(btn('🎉 Celebrate!', 'amber', function () { sfx('win'); confetti(); }));
    body.appendChild(rowb); sfx('win'); confetti();
  }
  function wrapStart(c, lesson, emoji, title) {
    c.body.appendChild(h('div', { class: 'report' }, [fill(h('div', { class: 'rank' }), emoji), h('div', { class: 'score', text: title }), btn('🏆 See the scores', 'green big', function () { wrapScreen(c, lesson); })]));
  }

  /* ---------- Unit 3 helpers ---------- */
  function hookPrompts(c, bigEmoji, prompts, missions, bg) {
    var body = c.body, i = -1;
    var stage = h('div', { class: 'hook-stage ' + (bg || '') }), big = h('div', { class: 'jarsbig' }), q = h('div', { class: 'hookq', style: 'display:none' }), mis = h('div', { class: 'missions', style: 'display:none' });
    bigEmoji.forEach(function (e) { big.appendChild(fill(h('span', { class: 'bj' }), e.e || e, '', e.n)); });
    stage.appendChild(big); stage.appendChild(q); body.appendChild(stage);
    var nb = btn('👀 Look and think', 'amber big', function () {
      i++;
      if (i < prompts.length) { q.style.display = 'block'; q.textContent = prompts[i]; sfx('page'); A.speak(prompts[i]); nb.textContent = i < prompts.length - 1 ? 'Next question ▶' : 'Show the missions ▶'; }
      else { nb.style.display = 'none'; mis.style.display = 'grid'; sfx('win'); }
    });
    body.appendChild(h('div', { class: 'row' }, [nb, sayBtn(prompts.join(' '), 'Read all')]));
    missions.forEach(function (m, k) { mis.appendChild(h('div', { class: 'mission' }, [h('div', { class: 'num', text: String(k + 1) }), h('div', { class: 'em', text: m.e }), h('div', { text: m.t })])); });
    body.appendChild(mis);
  }
  function timelineBar() {
    var bar = h('div', { class: 'tlbar' }), dots = [];
    D.timeline.forEach(function (t) {
      var d = h('div', { class: 'tld' }, [fill(h('div', { class: 'tle' }), t.e, '', t.a), h('b', { text: t.d }), h('small', { text: t.n })]);
      dots.push(d); bar.appendChild(d);
    });
    bar.setAt = function (n) { dots.forEach(function (d, k) { d.classList.toggle('on', k <= n); }); };
    return bar;
  }

  /* ============================== LESSON 1: How Much Is It? ============================== */
  function l1Farmers(c) {
    var scene = h('div', { class: 'bigscene' });
    var panel = h('div', { class: 'marketpanel' }, [scene]);
    if (hasArt('bg_ancient_market')) panel.style.background = 'url(art/bg_ancient_market.webp) center / cover';
    c.body.appendChild(panel); fill(scene, '🤝', '', 'w_bartered');
    runStory(c, D.farmers, function (ch, predicting) { scene.innerHTML = ''; if (!ch) { fill(scene, '💰'); return; } fill(scene, predicting ? '🤔' : ch.scene, '', predicting ? null : ch.art); }, 'Stand up, friends! Act every part. Use your body and your face.', 'Money solves the problem! Now we can ask: How much is it?');
  }

  function l1Shop(c) {
    var body = c.body, budget = 5, sel = null;
    var q = h('div', { class: 'bubble left' }), a = h('div', { class: 'bubble right' }), bud = h('span', { class: 'pill amber' });
    q.innerHTML = '<small>🙋 Customer</small>How much is it?'; a.innerHTML = '<small>🏪 Shopkeeper</small>Tap an item!';
    function setBudget(n) { budget = n; bud.textContent = '👛 I have $' + n; if (sel != null) pick(sel); }
    function pick(k) {
      sel = k; var it = D.shop[k], word = D.numw[it.p], ok = it.p <= budget;
      q.innerHTML = '<small>🙋 Customer</small>How much is it?';
      a.innerHTML = '<small>🏪 Shopkeeper</small>It’s ' + word + ' dollar' + (it.p === 1 ? '' : 's') + '.' + (ok ? '' : '<br><b>That’s expensive!</b>');
      A.speakSeq(['How much is it?', 'It’s ' + word + ' dollar' + (it.p === 1 ? '' : 's') + '.'].concat(ok ? [] : ['That’s expensive!']));
      sfx(ok ? 'coin' : 'tap');
      [].forEach.call(grid.children, function (el, j) { el.classList.toggle('sel', j === k); });
    }
    var grid = h('div', { class: 'shopgrid' });
    D.shop.forEach(function (it, k) { grid.appendChild(h('button', { type: 'button', class: 'btn shopitem', onclick: function () { pick(k); } }, [h('span', { class: 'em' }, [fill(h('span'), it.e)]), h('span', { class: 'nm', text: it.n }), h('b', { class: 'tag', text: '$' + it.p })])); });
    var bb = [3, 5, 8].map(function (n) { return btn('👛 $' + n, 'small ghost', function () { setBudget(n); }); });
    var model = btn('🔊 Model it', 'small amber', function () { A.speakSeq(['How much is it?', 'It’s five dollars.', 'That’s expensive!']); });
    setBudget(5);
    body.appendChild(h('div', { class: 'row' }, [timerBtn(c, 240), bud].concat(bb).concat([model])));
    body.appendChild(h('div', { class: 'dialog' }, [q, a]));
    body.appendChild(grid);
    body.appendChild(h('div', { class: 'row' }, [h('span', { class: 'lab', text: 'Say it:' })].concat(['It’s … dollars.', 'That’s expensive!', 'OK, I’ll take it.'].map(function (s) { return h('button', { type: 'button', class: 'chip2', text: s, onclick: function () { A.speak(s.replace('…', '')); } }); }))));
  }

  function l1Labels(c) {
    var body = c.body, n = 0, seen = {};
    var shelf = h('div', { class: 'shelf' }), cnt = h('span', { class: 'pill amber', text: '🫙 0 jars' });
    function addJar(l) {
      n++; cnt.textContent = '🫙 ' + n + ' jar' + (n === 1 ? '' : 's');
      shelf.appendChild(h('div', { class: 'jar' }, [fill(h('span', { class: 'je' }), '🫙'), h('span', { class: 'jl' }, [fill(h('i'), l.e), document.createTextNode(' ' + l.n)])]));
      sfx('coin'); A.speak('A jar for ' + l.n + '.'); if (n % 5 === 0) confetti();
    }
    var chips = h('div', { class: 'bank' }, D.labels.map(function (l) { return h('button', { type: 'button', class: 'chip2', onclick: function () { addJar(l); } }, [fill(h('span'), l.e), document.createTextNode(' ' + l.n)]); }));
    var q = h('div', { class: 'bubble left' }), a = h('div', { class: 'bubble right' });
    q.innerHTML = '<small>🙋 Friend 1</small>Do you want a label for <b>college</b>?'; a.innerHTML = '<small>🙂 Friend 2</small>Of course I do! We both want a label for <b>college</b>.';
    var model = btn('🔊 Model it', 'small amber', function () { A.speakSeq(['Do you want a label for college?', 'Of course I do!', 'We both want a label for college.']); });
    body.appendChild(h('div', { class: 'row' }, [timerBtn(c, 240), model, btn('🎉 Applause!', 'green', function () { sfx('win'); confetti(); }), cnt]));
    body.appendChild(h('div', { class: 'dialog' }, [q, a]));
    body.appendChild(h('div', { class: 'frame-big', html: 'Do you want a label for <b>__________</b>? &nbsp; Of course I do! &nbsp; We both want <b>__________</b>.' }));
    body.appendChild(chips); body.appendChild(h('div', { class: 'shelfwrap' }, [shelf]));
  }

  /* ============================== LESSON 2: Before Money Was Money ============================== */
  function l2Hook(c) {
    var body = c.body, opened = 0;
    var row = h('div', { class: 'mysrow' }), info = h('div', { class: 'hookq' });
    info.textContent = 'Five mystery boxes. Tap a box. Is it money?';
    D.mystery.forEach(function (m) {
      var bx = h('button', { type: 'button', class: 'btn mybox' }, [h('span', { class: 'em', text: '❓' }), h('small', { text: 'tap me' })]);
      bx.addEventListener('click', function () {
        if (bx.classList.contains('open')) { A.speak(m.say); return; }
        bx.classList.add('open'); bx.innerHTML = ''; bx.appendChild(fill(h('span', { class: 'em' }), m.e, '', m.a)); bx.appendChild(h('small', { text: m.n }));
        opened++; info.textContent = m.say; A.speak(m.say); sfx('coin');
        if (opened === D.mystery.length) { info.textContent = 'All of these were money! Money keeps changing. Today we travel back in time.'; sfx('win'); confetti(); mis.style.display = 'grid'; }
      });
      row.appendChild(bx);
    });
    var mis = h('div', { class: 'missions', style: 'display:none' });
    D.missions2.forEach(function (m, k) { mis.appendChild(h('div', { class: 'mission' }, [h('div', { class: 'num', text: String(k + 1) }), h('div', { class: 'em', text: m.e }), h('div', { text: m.t })])); });
    body.appendChild(h('div', { class: 'hook-stage' }, [row, info])); body.appendChild(mis);
  }

  function l2History(c) {
    var scene = h('div', { class: 'bigscene' }), bar = timelineBar();
    var panel = h('div', { class: 'marketpanel tall' }, [scene]);
    c.body.appendChild(panel); c.body.appendChild(bar); bar.setAt(-1); fill(scene, '🏞️'); if (hasArt('bg_ancient_market')) panel.style.background = 'url(art/bg_ancient_market.webp) center / cover';
    runStory(c, D.history, function (ch, predicting) { scene.innerHTML = ''; if (!ch) { fill(scene, '🪙', '', 'w_lydia_coin'); bar.setAt(3); return; } fill(scene, predicting ? '🤔' : ch.scene, '', predicting ? null : ch.art); bar.setAt(predicting ? bar.cur || -1 : ch.at); if (!predicting) bar.cur = ch.at; }, 'Stand up! We are travelling back in time. Do every action!', 'Money changed because people wanted something easier to carry and easier to count.');
  }

  function l2Words(c) {
    var body = c.body, clueI = -1;
    var grid = h('div', { class: 'vgrid' }), box = h('div', { class: 'msg' }), gap = h('div', { class: 'gapbox' });
    D.words.forEach(function (w) {
      var card = h('button', { type: 'button', class: 'btn vcard' }, [fill(h('span', { class: 'em' }), w.e), h('b', { text: w.w })]);
      card.addEventListener('click', function () {
        sfx('tap'); box.innerHTML = '<b>' + w.w + '</b>: ' + w.def + '.<br><i>' + w.ex + '</i>';
        A.speakSeq([w.w, w.def, w.ex]); [].forEach.call(grid.children, function (el) { el.classList.remove('sel'); }); card.classList.add('sel');
      });
      grid.appendChild(card);
    });
    var order = shuffle(D.words.map(function (w, k) { return k; })), shown = false;
    var clue = btn('🎲 Clue game', 'violet', function () {
      if (clueI < 0 || shown) { clueI = (clueI + 1) % order.length; shown = false; var w = D.words[order[clueI]]; gap.textContent = w.gap; A.speak(w.gap.replace(/_+/g, 'blank')); clue.textContent = '👀 Show the word'; sfx('page'); }
      else { shown = true; var w2 = D.words[order[clueI]]; gap.textContent = w2.ex; A.speak(w2.ex); sfx('correct'); clue.textContent = '🎲 Next clue'; }
    });
    body.appendChild(h('div', { class: 'row' }, [clue, h('span', { class: 'lab', text: 'Tap a word card to hear it.' })]));
    body.appendChild(grid); body.appendChild(box); body.appendChild(gap); body.appendChild(pointsRow());
  }

  function l2Order(c) {
    var body = c.body, done = false;
    var cards = h('div', { class: 'ordrow' }), info = h('div', { class: 'msg' });
    var shuffled = shuffle(D.order);
    function draw(ordered) {
      cards.innerHTML = '';
      (ordered ? D.order.slice().sort(function (a, b) { return a.k - b.k; }) : shuffled).forEach(function (o, i) {
        cards.appendChild(h('div', { class: 'ocard' + (ordered ? ' in' : '') }, [h('div', { class: 'on', text: ordered ? String(i + 1) : '?' }), fill(h('div', { class: 'oe' }), o.e, '', o.a), h('b', { text: o.n }), h('small', { text: ordered ? o.d : '' })]));
      });
    }
    draw(false); info.textContent = 'Teams: write the order 1-2-3-4 on your mini whiteboard. Which was first? Which was last?';
    var show = btn('👀 Show the order', 'amber', function () { if (done) return; done = true; draw(true); info.textContent = 'First barter, then shells, then knives and spades, then the first coins.'; A.speak('First barter, then shells, then knives and spades, then the first coins.'); sfx('win'); });
    body.appendChild(h('div', { class: 'row' }, [timerBtn(c, 60), show]));
    body.appendChild(cards); body.appendChild(info);
    body.appendChild(h('div', { class: 'row' }, [h('span', { class: 'lab', text: 'Easier to carry:' })].concat(D.carryChips.map(function (s) { return h('button', { type: 'button', class: 'chip2', text: s, onclick: function () { A.speak(s); } }); }))));
    body.appendChild(h('div', { class: 'frame-big', html: '🤔 Why do you think they put <b>holes</b> in the coins? &nbsp; <b>I think … because …</b>' }));
    body.appendChild(h('div', { class: 'row' }, D.holesChips.map(function (s) { return h('button', { type: 'button', class: 'chip2', text: s, onclick: function () { A.speak(s.replace('…', '')); } }); })));
    body.appendChild(pointsRow());
  }

  /* ============================== GAMES ============================== */
  function teamName(i) { return D.teams[i].e + ' ' + D.teams[i].n; }
  function gameFinish(c, host, onAgain) {
    host.innerHTML = '';
    if (hasArt('w_trophy')) host.appendChild(h('div', { class: 'trophy' }, [art('w_trophy')]));
    podium(host); sfx('win'); confetti();
    host.appendChild(h('div', { class: 'row', style: 'justify-content:center' }, [btn('🔁 Play again', 'green big', onAgain), btn('🎉 Celebrate!', 'amber', function () { sfx('win'); confetti(); })]));
  }

  /* LESSON 1 GAME: Super Shopper. Each team has a turn, a budget and six items. Fill the basket, stay under the budget. */
  function l1Game(c) {
    var body = c.body, turn = 0, played = {}, budget = 10, items = [], basket = [], total = 0, paid = false, root = h('div', { class: 'gameroot' });
    body.appendChild(root);
    function pickItems() { items = shuffle(D.shop).slice(0, 6); budget = D.budgets[Math.floor(Math.random() * D.budgets.length)]; basket = []; total = 0; paid = false; }
    function allPlayed() { return D.teams.every(function (t, i) { return played[i]; }); }
    function draw() {
      root.innerHTML = '';
      var t = D.teams[turn];
      var banner = h('div', { class: 'gturn', style: '--c:' + t.c }, [h('span', { class: 'tn', text: t.e + ' ' + t.n + '’ turn' }), h('span', { class: 'gb', text: '👛 You have $' + budget }), h('span', { class: 'gt', text: '🛒 $' + total })]);
      var bar = h('div', { class: 'gbar' }, [h('i', { style: 'width:' + Math.round(total / budget * 100) + '%' })]);
      var msg = h('div', { class: 'msg gmsg', text: paid ? '' : 'Tap an item. Ask: How much is it? Stay under your money!' });
      var grid = h('div', { class: 'gshop' });
      items.forEach(function (it, k) {
        var inB = basket.indexOf(k) >= 0;
        var card = h('button', { type: 'button', class: 'btn gitem' + (inB ? ' sold' : '') }, [fill(h('span', { class: 'em' }), it.e), h('span', { class: 'nm', text: it.n }), h('b', { class: 'tag', text: '$' + it.p })]);
        if (paid || inB) card.disabled = true; else card.removeAttribute('disabled');
        card.addEventListener('click', function () {
          var left = budget - total, word = D.numw[it.p];
          if (it.p > left) { card.classList.remove('wob'); void card.offsetWidth; card.classList.add('wob'); msg.textContent = 'That’s expensive! You have only $' + left + ' left.'; A.speakSeq(['How much is it?', 'It’s ' + word + ' dollar' + (it.p === 1 ? '' : 's') + '.', 'That’s expensive!']); sfx('tap'); return; }
          basket.push(k); total += it.p; sfx('coin'); A.speak('It’s ' + word + ' dollar' + (it.p === 1 ? '' : 's') + '.'); draw();
        });
        grid.appendChild(card);
      });
      var cart = h('div', { class: 'gcart' }, [h('span', { class: 'lab', text: '🛒 Basket:' })].concat(basket.map(function (k) { return h('span', { class: 'gchip' }, [fill(h('span'), items[k].e), document.createTextNode(' $' + items[k].p)]); })));
      var undo = btn('↩ Undo', 'small ghost', function () { if (paid || !basket.length) return; var k = basket.pop(); total -= items[k].p; sfx('tap'); draw(); });
      var pay = btn(paid ? '➡ Next team' : '✅ Pay and finish', paid ? 'green' : 'amber', function () {
        if (!paid) {
          paid = true; var pts = basket.length + (total === budget ? 3 : 0); addPoint(turn, pts); played[turn] = true; sfx('win');
          if (total === budget) confetti();
          draw(); var m2 = root.querySelector('.gmsg'); m2.textContent = teamName(turn) + ': ' + basket.length + ' item' + (basket.length === 1 ? '' : 's') + (total === budget ? ' and EXACTLY $' + budget + '! +3 bonus' : '') + ' = ' + pts + ' points!';
          A.speak(teamName(turn).replace(/^\S+ /, '') + ' get ' + pts + ' points!');
        } else {
          if (allPlayed()) { gameFinish(c, root, function () { played = {}; turn = 0; pickItems(); draw(); }); return; }
          do { turn = (turn + 1) % D.teams.length; } while (played[turn]);
          pickItems(); draw();
        }
      });
      root.appendChild(banner); root.appendChild(bar);
      root.appendChild(h('div', { class: 'row' }, [undo, pay, h('span', { class: 'lab', text: '1 point per item · +3 if you spend EXACTLY your money' })]));
      root.appendChild(msg); root.appendChild(grid); root.appendChild(cart);
    }
    pickItems(); draw();
  }

  /* LESSON 2 GAME: Money Catcher. Each team has 25 seconds. Tap the things that are or were money. */
  function l2Game(c) {
    var body = c.body, played = {}, turn = 0, running = false, caught = 0, left = 25, spawnIv = null, tickIv = null;
    var host = h('div', { class: 'gameroot' });
    body.appendChild(host);
    var field = h('div', { class: 'catchfield' }), hud = h('div', { class: 'row' }), info = h('div', { class: 'msg gmsg', text: 'Tap things that are or were MONEY. Do not tap other things!' });
    var legend = h('div', { class: 'row legend' }, [h('span', { class: 'gchip good', text: '✅ money: shell · coin · note · card · knife money' }), h('span', { class: 'gchip bad', text: '❌ not money: fork · wallet · toy · ball · pizza' })]);
    function nextTeam() { var n = 0; while (played[turn] && n < D.teams.length) { turn = (turn + 1) % D.teams.length; n++; } }
    function drawHud() {
      hud.innerHTML = '';
      D.teams.forEach(function (t, i) { hud.appendChild(h('span', { class: 'pill' + (played[i] ? '' : ' amber'), style: i === turn && !played[i] ? 'outline:3px solid ' + t.c : '', text: t.e + ' ' + (played[i] ? '✓ ' + played[i].n : t.n) })); });
    }
    function stop() { running = false; if (spawnIv) clearInterval(spawnIv); if (tickIv) clearInterval(tickIv); spawnIv = tickIv = null; field.innerHTML = ''; }
    c.later(stop);
    function spawn() {
      var good = Math.random() < 0.62, pool = good ? D.catchGood : D.catchBad, it = pool[Math.floor(Math.random() * pool.length)];
      var el = h('button', { type: 'button', class: 'fall' }), x = 3 + Math.random() * 84, dur = 3.6 + Math.random() * 1.8 - (25 - left) * 0.03;
      fill(el, it.e, '', it.a); el.style.left = x + '%'; el.style.animationDuration = Math.max(2.4, dur) + 's';
      el.addEventListener('animationend', function () { el.remove(); });
      el.addEventListener('click', function () {
        if (!running || el.classList.contains('hit')) return; el.classList.add('hit');
        var lb = h('div', { class: 'flt ' + (good ? 'ok' : 'no'), text: good ? it.n + ' +1' : 'Not money!', style: 'left:' + el.style.left });
        field.appendChild(lb); setTimeout(function () { lb.remove(); }, 900);
        if (good) { caught++; sfx('coin'); cnt.textContent = '🪙 ' + caught; el.classList.add('pop'); } else { sfx('tap'); el.classList.add('oops'); }
        setTimeout(function () { el.remove(); }, 260);
      });
      field.appendChild(el);
    }
    var cnt = h('span', { class: 'pill amber', text: '🪙 0' }), clock = h('span', { class: 'pill violet', text: '⏱ 25' });
    var go = btn('▶ Start', 'green big', function () {
      if (running) return;
      if (D.teams.every(function (t, i) { return played[i]; })) { gameFinish(c, host, function () { host.parentNode.removeChild(host); l2Game(c); }); return; }
      nextTeam(); caught = 0; left = 25; cnt.textContent = '🪙 0'; clock.textContent = '⏱ 25'; field.innerHTML = ''; running = true; sfx('page');
      go.disabled = true; go.textContent = '🎮 ' + teamName(turn) + ' play!'; info.textContent = D.teams[turn].n + ': tap the money!'; drawHud();
      field.style.setProperty('--h', field.clientHeight + 'px');
      if (hasArt('bg_catch_sky')) field.style.background = 'url(art/bg_catch_sky.webp) center / cover';
      spawn(); spawnIv = setInterval(spawn, 720);
      tickIv = setInterval(function () {
        left--; clock.textContent = '⏱ ' + left;
        if (left <= 0) {
          stop(); addPoint(turn, caught); played[turn] = { n: caught }; sfx('win');
          info.textContent = teamName(turn) + ' caught ' + caught + '! +' + caught + ' points'; A.speak(D.teams[turn].n + ' caught ' + caught + '!');
          var done = D.teams.every(function (t, i) { return played[i]; });
          go.disabled = false; go.textContent = done ? '🏆 See the winner' : '▶ Next team';
          if (!done) { turn = (turn + 1) % D.teams.length; nextTeam(); }
          drawHud();
        }
      }, 1000);
    });
    host.appendChild(h('div', { class: 'row' }, [go, clock, cnt, h('span', { class: 'lab', text: 'One team at a time. Everybody shouts the words!' })]));
    host.appendChild(hud); host.appendChild(field); host.appendChild(info); host.appendChild(legend);
    drawHud();
  }

  var MODES = { game: '🎮 Game', think: '🤔 Think', listen: '👂 Listen', act: '🎭 Act it out', move: '🚶 Move', talk: '🗣️ Talk', create: '🎨 Create', race: '🏆 Team race', detect: '🔍 Detective', story: '📖 Story' };
  var LESSONS = {
    1: { title: 'How Much Is It?', missions: D.missions1, door: '🚪 Door pass: ask me "How much is it?" and I will tell you a price!', scenes: [
      { t: 'Two Money Jars', mins: '3 min', mode: 'think', run: function (c) { hookPrompts(c, [{ e: '🫙', n: 'w_jar_donate' }, { e: '🫙', n: 'w_jar_saving' }], D.jarPrompts, D.missions1, 'jarhook'); }, intro: 'Look at these two jars. What can you see?',
        kids: { steps: ['👀 Look at the jars', '🤔 Whisper to your partner: why are there jars?'], say: ['I can see …', 'There is money in the jar.'] },
        tip: ['Book link: Unit 3 opener, p.40-41 (the jars: "Donating: Save the Animals" and "Saving: Gift for Mom").', 'Press the button for each question. Accept one-word answers and sentences; praise "I can see …".', 'Do not teach "saving" or "donating" yet. Pupils will meet the words in the jar labels later. Show the five missions at the end.'] },
      { t: 'Where Do We Use Money?', mins: '4 min', mode: 'move', run: function (c) { walkScene(c, D.zones1, D.walk1, function (w) { return w.t; }, '🚶 BUY or GO? Walk to the right corner.'); }, intro: 'Read the card. Do we BUY it or do we GO there? Walk to the right corner.',
        kids: { steps: ['👀 Read the card', '🚶 Walk to BUY or GO', '🗣️ Say the sentence to a friend'], say: ['You can buy …', 'You can go …'] },
        tip: ['Book link: p.41 D "Where do people use money?" and p.55 frames "You can buy … / You can go …".', 'Print the two corner signs from the Cards page (BUY and GO). Pupils walk, then say the sentence. Reveal the answer, then press Read card.', 'Extra: ask "Where do YOU use money?" and let pupils add their own places (shop, cafe, bus, cinema).'] },
      { t: 'The Farmers’ Problem', mins: '6 min', mode: 'act', run: l1Farmers, intro: 'Stand up, friends! Act every part with your body.',
        kids: { steps: ['🧍 Stand up and do the action', '🗣️ Repeat after the teacher (echo)', '🤔 At the 🤔 part: talk with your partner'], say: ['One farmer needs a goat.', 'The other farmer needs some grain.'] },
        tip: ['Book link: p.41 E (picture of two farmers: "One farmer needs a goat. The other farmer needs some grain.", "What’s wrong? How can they fix it?").', 'Pupils do each action first, then you press the next part. At the 🤔 part the screen waits: pupils guess the problem (answer: they cannot agree how much grain is one goat).', 'The book’s question is "What’s wrong? How can they fix it?" Pupils may say money, shells or a price. Accept all good ideas: this leads to Lesson 2.'] },
      { t: 'The Class Shop: How Much Is It?', mins: '7 min', mode: 'talk', run: l1Shop, intro: 'Work in pairs. Customer asks. Shopkeeper answers.',
        kids: { steps: ['🙋 Customer: ask How much is it?', '🏪 Shopkeeper: answer It’s … dollars.', '🔁 Swap roles. Say That’s expensive! when it costs too much'], say: ['How much is it?', 'It’s … dollars.', 'That’s expensive!'] },
        tip: ['Book link: unit title "How Much Is It?"; the book story uses "That’s expensive" (p.52).', 'Model once with a pupil (press Model it). Tap an item: the board says the price. Change the 👛 money to show when "That’s expensive!" appears.', 'Pairs practise with the item cards on the board. Start the timer. Walk around and listen. Support: point and say only the number. Stretch: add "I’ll take it".'] },
      { t: 'Jar Labels', mins: '4 min', mode: 'create', run: l1Labels, intro: 'Which labels do you want on your jars? Ask your partner!',
        kids: { steps: ['🗣️ Ask: Do you want a label for …?', '✅ Answer: Of course I do!', '📢 Tell the class: We both want …'], say: ['Do you want a label for …?', 'Of course I do!', 'We both want …'] },
        tip: ['Book link: p.41 A-C (think about jar labels, discuss with a partner, share with the class).', 'Model the dialogue (Model it). Pairs choose a label idea. Each pair tells the class "We both want …", and you tap the label to add a jar to the shelf.', 'Pupils may also write their own label on a mini whiteboard. Good ideas are real: video games, college, animals, a gift for Mom.'] },
      { t: 'GAME: Super Shopper', mins: '9 min', mode: 'game', run: l1Game, intro: 'Teams take turns. Fill your basket, but do not spend more than your money!',
        kids: { steps: ['🛒 Tap an item for your basket', '🗣️ Everybody asks: How much is it?', '👛 Stop before your money is gone. Spend EXACTLY your money for +3!'], say: ['How much is it?', 'It’s … dollars.', 'That’s expensive!'] },
        tip: ['Book link: unit title "How Much Is It?" and p.52 "That’s expensive". This is the practice game for prices.', 'Each team gets a budget ($6, $8 or $10) and six items. The team talks, then one pupil taps. Every pupil shouts "How much is it?" before the answer.', 'Points: 1 for each item, +3 if the team spends EXACTLY its money. Press Pay and finish, then Next team. Four teams play, then the winner is shown.', 'Support: a weaker team may take the cheap items. Stretch: ask "How much is it altogether?"'] },
      { t: 'Thank You, Shoppers!', mins: '2 min', mode: 'think', run: function (c) { wrapStart(c, 1, '🏪', 'How Much Is It?'); }, intro: 'Mission complete!',
        kids: { steps: ['🏆 Cheer for every team', '🚪 Door pass: ask the teacher: How much is it?'], say: ['How much is it?'] },
        tip: ['Show the scores and cheer for everyone. At the door each pupil asks "How much is it?" about something in the room and you answer with a price. It is a quick check for you.'] }
    ] },
    2: { title: 'Before Money Was Money', missions: D.missions2, door: '🚪 Door pass: tell me ONE thing people used as money long ago!', scenes: [
      { t: 'Mystery Money', mins: '3 min', mode: 'think', run: l2Hook, intro: 'Five mystery boxes. What is inside? Is it money?',
        kids: { steps: ['👀 Look at the boxes', '🤔 Guess with your partner: Is it money?', '✋ Raise your hand to open a box'], say: ['I think it is …', 'Is it money?'] },
        tip: ['Book link: p.46 A (Which of these is or was money?). All five things were money at some time in history.', 'Pupils guess before you open each box. Accept all guesses. When all five are open, show the four missions.', 'Do not say the dates yet. They come in the next step.'] },
      { t: 'Travel Back in Time', mins: '7 min', mode: 'act', run: l2History, intro: 'Stand up! We are travelling back in time. Do every action!',
        kids: { steps: ['🧍 Stand up and do the action', '🗣️ Repeat after the teacher (echo)', '🤝 At the end, retell it to a partner'], say: ['People bartered.', 'Shells are easier to carry than goats.'] },
        tip: ['Book link: pp.42-43, Reading 1 "The History of Money" (barter around 6000 BCE, cowrie shells in 1200 BCE, metal knives and spades around 1000 BCE, round metal money with holes, first true coins around 600 BCE in Lydia).', 'The timeline fills as the story goes. At the 🤔 part pupils guess what people can use before you reveal the shells.', 'BCE means "Before Common Era": the dates count backwards (6000 BCE is older than 1200 BCE). The book asks: "Can you guess what CE stands for?"', 'Lydia is part of modern-day Turkey (book p.43). Pupils usually love this.'] },
      { t: 'Word Detectives', mins: '6 min', mode: 'detect', run: l2Words, intro: 'Five new words. What do you think they mean? Tap a card.',
        kids: { steps: ['👀 Look at the word card', '🤔 Guess the meaning with your partner', '🗣️ Say the word and the sentence'], say: ['bartered', 'valuable', 'credit card'] },
        tip: ['Book link: p.43 "Words in Context": bartered, metal, valuable, credit card, plastic ("Find these words in the reading. What do you think they mean?").', 'Tap a card: the board says the word, the meaning and an example sentence. Pupils guess first, then you tap.', 'Then press Clue game: pupils say the missing word. The word cards are the sentence frames for the next steps.'] },
      { t: 'Put the Money in Order', mins: '5 min', mode: 'think', run: l2Order, intro: 'Four kinds of money. Which was first? Which came last?',
        kids: { steps: ['🤝 Talk with your team', '✍️ Write 1-2-3-4 on the mini whiteboard', '⬆️ Hold it up at 0'], say: ['First …', 'Shells are easier to carry than goats.'] },
        tip: ['Book link: pp.44-45 timeline (1200 BCE cowrie shells, 1000 BCE knives and spades, 600 BCE first coins) and p.43 "Why do you think they put holes in the coins?".', 'Teams order the four cards on their whiteboards. Show the order, then practise "easier to carry than".', 'Holes: discuss "I think … because …". A likely answer is that holes let people carry coins on a string (teacher fact: not printed in the book).'] },
      { t: 'Problem or Solution?', mins: '4 min', mode: 'move', run: function (c) { walkScene(c, D.zones2, D.walk2, function (w) { return (w.a === 'P' ? 'Problem: ' : 'Solution: ') + w.t; }, '🚶 Problem or solution? Walk to the right corner.'); }, intro: 'Is it a problem or a solution? Walk to the right corner!',
        kids: { steps: ['👀 Read the card', '🚶 Walk to PROBLEM or SOLUTION', '🗣️ Say why'], say: ['It is a problem because …', 'It is a solution because …'] },
        tip: ['Book link: p.47 "A problem is something difficult … A solution is a way to fix the problem." The skill is practised again later in the unit.', 'Print the two corner signs from the Cards page. Pupils walk, then give a reason with "because".', 'Reward the reason, not only the correct corner.'] },
      { t: 'GAME: Money Catcher', mins: '8 min', mode: 'game', run: l2Game, intro: 'Things fall from the sky! Tap only the things that are or were MONEY.',
        kids: { steps: ['👀 Look at the falling things', '👆 Tap money: shell, coin, note, card, knife money', '🗣️ Everybody shouts the word'], say: ['This is money.', 'This is not money.'] },
        tip: ['Book link: p.46 A "Which of these is or was money?" (cowrie shells, ancient Chinese knife, paper money, credit card are money; a fork and knife and a wallet are not).', 'Each team has 25 seconds and one pupil taps at a time (change the pupil every few seconds). The rest of the team shouts what they see. Not-money items only wobble: nobody loses points.', 'Points go to the scoreboard automatically. After four teams the winner is shown. Press Play again for a second round.', 'Ask afterwards: Which was the first money? Which was the last? (checks the timeline).'] },
      { t: 'Time Travellers’ Ceremony', mins: '3 min', mode: 'think', run: function (c) { wrapStart(c, 2, '⏳', 'Before Money Was Money'); }, intro: 'You have finished the time travel!',
        kids: { steps: ['🏆 Cheer for every team', '🚪 Door pass: one thing people used as money'], say: ['People used … as money.'] },
        tip: ['At the door each pupil says one sentence: "People used shells / coins / … as money." It checks the new vocabulary.'] }
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
  window.G3Lessons = { state: state, go: go, LESSONS: LESSONS };
  loadManifest(function () { drawTeams(); go(l0, s0); });
})();
