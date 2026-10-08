/* Unit 3 Grade 4: two teacher-led smartboard lessons. The board is the stage, timer and scoreboard.
   The children move, act, talk, draw and solve. Four teams earn points all lesson. One smartboard, mini whiteboards. */
(function () {
  'use strict';
  var D = window.U3G4Data, A = window.ForestAudio;
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
    '🕳️': 'w_hole', '✌️': 'w_twice', '😠': 'w_enemy', '📄': 'w_thin', '🪤': 'w_trap', '🫠': 'w_melting', '🐻‍❄️': 'w_polar_bear', '🧊': 'w_ice',
    '🎣': 'w_fishing_rod', '💥': 'w_crack', '🏊': 'w_swim', '🙏': 'w_hope', '⚠️': 'w_danger', '🧭': 'w_arctic', '🌡️': 'w_climate_change', '🌍': 'w_planet',
    '🚲': 'w_bike', '🗑️': 'w_trash', '☀️': 'w_solar_panel', '🌽': 'w_corn', '💨': 'w_smoke', '🧑‍🔬': 'c_scientist', '👦': 'c_young_fisherman', '👴': 'c_old_fisherman',
    '🤍': 'w_fur'
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
    var host = $('stage'), em = ['⭐', '🎉', '🌟', '✨', '❄️', '🧊', '🐻‍❄️'], k, w = h('div', { class: 'confetti' });
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
    if (LESSONS[lesson + 1]) rowb.appendChild(btn('Lesson ' + (lesson + 1) + ': ' + LESSONS[lesson + 1].title + ' ▶', 'green big', function () { go(lesson + 1, 0); }));
    rowb.appendChild(btn('🎉 Celebrate!', 'amber', function () { sfx('win'); confetti(); }));
    body.appendChild(rowb); sfx('win'); confetti();
  }
  function wrapStart(c, lesson, emoji, title) {
    c.body.appendChild(h('div', { class: 'report' }, [fill(h('div', { class: 'rank' }), emoji), h('div', { class: 'score', text: title }), btn('🏆 See the scores', 'green big', function () { wrapScreen(c, lesson); })]));
  }

  /* ---------- Unit 3 Grade 4 helpers ---------- */
  function hookPrompts(c, bigItems, prompts, missions, bgName) {
    var body = c.body, i = -1;
    var stage = h('div', { class: 'hook-stage' }), big = h('div', { class: 'jarsbig' }), q = h('div', { class: 'hookq', style: 'display:none' }), mis = h('div', { class: 'missions', style: 'display:none' });
    if (bgName && hasArt(bgName)) stage.style.background = 'url(art/' + bgName + '.webp) center / cover';
    bigItems.forEach(function (e) { big.appendChild(fill(h('span', { class: 'bj' }), e.e || e, '', e.n)); });
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
  function teamName(i) { return D.teams[i].e + ' ' + D.teams[i].n; }
  function gameFinish(c, host, onAgain) {
    host.innerHTML = '';
    if (hasArt('w_trophy')) host.appendChild(h('div', { class: 'trophy' }, [art('w_trophy')]));
    podium(host); sfx('win'); confetti();
    host.appendChild(h('div', { class: 'row', style: 'justify-content:center' }, [btn('🔁 Play again', 'green big', onAgain), btn('🎉 Celebrate!', 'amber', function () { sfx('win'); confetti(); })]));
  }

  /* ============================== LESSON 1: It Keeps Changing ============================== */
  function l1Arctic(c) {
    var scene = h('div', { class: 'bigscene' }), meter = h('div', { class: 'icemeter' }, [h('span', { class: 'lab', text: '🧊 ICE' }), h('div', { class: 'ib' }, [h('i')])]);
    var panel = h('div', { class: 'marketpanel arcticpanel' }, [scene]);
    function setBg(n) { var nm = n ? 'bg_arctic_melting' : 'bg_arctic_ice'; if (hasArt(nm)) panel.style.background = 'url(art/' + nm + '.webp) center / cover'; else panel.style.background = n ? 'linear-gradient(#fcd34d, #38bdf8 60%, #0369a1)' : 'linear-gradient(#bae6fd, #e0f2fe 60%, #7dd3fc)'; }
    function setIce(p) { meter.querySelector('i').style.width = p + '%'; meter.classList.toggle('low', p < 50); }
    setBg(0); setIce(100); c.body.appendChild(panel); c.body.appendChild(meter); fill(scene, '🧭');
    runStory(c, D.arctic, function (ch, predicting) { scene.innerHTML = ''; if (!ch) { fill(scene, '🌍'); setIce(30); setBg(1); return; } fill(scene, predicting ? '🤔' : ch.scene, '', predicting ? null : ch.art); if (!predicting) { setIce(ch.ice); setBg(ch.bg); } }, 'Stand up, friends! Visit the Arctic with your body.', 'The Arctic is changing. Some changes are bad. But we can make good changes!');
  }

  function l1Compare(c) {
    var body = c.body;
    var left = h('div', { class: 'cmp cl' }), right = h('div', { class: 'cmp cr' }), sent = h('div', { class: 'msg gmsg', text: 'Tap a pair. Is it true for your town? Say the sentence with your partner.' });
    var fr = h('div', { class: 'cmpwrap' }, [h('div', { class: 'cmphead', text: '❄️ The Arctic' }), left, h('div', { class: 'cmpvs', text: 'VS' }), h('div', { class: 'cmphead', text: '🏡 Where I live' }), right]);
    function show(p) { left.innerHTML = ''; right.innerHTML = ''; left.appendChild(fill(h('div', { class: 'cmpe' }), p.l.split(' ')[0])); left.appendChild(h('b', { text: p.l.split(' ').slice(1).join(' ') })); right.appendChild(fill(h('div', { class: 'cmpe' }), p.r.split(' ')[0])); right.appendChild(h('b', { text: p.r.split(' ').slice(1).join(' ') })); sent.textContent = p.s; A.speak(p.s); sfx('page'); }
    var chips = h('div', { class: 'bank' }, D.compare.map(function (p) { return h('button', { type: 'button', class: 'chip2', text: p.l + '  ⇄  ' + p.r, onclick: function () { show(p); } }); }));
    body.appendChild(h('div', { class: 'row' }, [timerBtn(c, 240), sayBtn('Both the Arctic and my town have things that are the same. But some things are different.', 'Model it')]));
    body.appendChild(fr); body.appendChild(sent); body.appendChild(chips);
    body.appendChild(h('div', { class: 'frame-big', html: '<b>In the Arctic</b> there is … , <b>but</b> where I live there is … &nbsp; · &nbsp; <b>Both</b> … and … have …' }));
    body.appendChild(pointsRow());
    show(D.compare[0]);
  }

  /* GAME (Lesson 1): Arctic Memory. Teams flip two cards. A picture and its word make a pair. A pair = 2 points and another turn. */
  function l1Memory(c) {
    var body = c.body, host = h('div', { class: 'gameroot' }); body.appendChild(host);
    function start() {
      host.innerHTML = '';
      var turn = 0, first = null, lock = false, found = 0, cards = [];
      D.memory.forEach(function (p) { cards.push({ id: p.id, kind: 'pic', p: p }); cards.push({ id: p.id, kind: 'word', p: p }); });
      cards = shuffle(cards);
      var banner = h('div', { class: 'gturn' }), msg = h('div', { class: 'msg gmsg', text: 'Flip two cards. Find a picture and its word!' }), grid = h('div', { class: 'memgrid' });
      function paintBanner() { var t = D.teams[turn]; banner.style.setProperty('--c', t.c); banner.innerHTML = ''; banner.appendChild(h('span', { class: 'tn', text: t.e + ' ' + t.n + '’ turn' })); banner.appendChild(h('span', { class: 'gb', text: '🃏 Pairs found: ' + found + ' / ' + D.memory.length })); }
      var els = cards.map(function (cd, k) {
        var el = h('button', { type: 'button', class: 'btn memcard' }, [h('span', { class: 'mb', text: '❓' })]);
        el.addEventListener('click', function () {
          if (lock || el.classList.contains('up') || el.classList.contains('done')) return;
          el.classList.add('up'); el.innerHTML = '';
          if (cd.kind === 'pic') el.appendChild(fill(h('span', { class: 'mp' }), cd.p.e, '', cd.p.a)); else el.appendChild(h('b', { class: 'mw', text: cd.p.w }));
          A.speak(cd.p.w); sfx('tap');
          if (!first) { first = { cd: cd, el: el }; return; }
          var a = first; first = null; lock = true;
          if (a.cd.id === cd.id && a.cd.kind !== cd.kind) {
            setTimeout(function () { a.el.classList.add('done'); el.classList.add('done'); found++; addPoint(turn, 2); sfx('correct'); msg.textContent = teamName(turn) + ' found a pair: ' + cd.p.w + '! +2 points. Go again!'; paintBanner(); lock = false; if (found === D.memory.length) { sfx('win'); setTimeout(function () { gameFinish(c, host, start); }, 900); } }, 500);
          } else {
            setTimeout(function () { [a.el, el].forEach(function (x) { x.classList.remove('up'); x.innerHTML = ''; x.appendChild(h('span', { class: 'mb', text: '❓' })); }); turn = (turn + 1) % D.teams.length; msg.textContent = 'Not a pair. Next team!'; paintBanner(); lock = false; }, 1200);
          }
        });
        grid.appendChild(el); return el;
      });
      host.appendChild(banner); host.appendChild(msg); host.appendChild(grid);
      host.appendChild(h('div', { class: 'row' }, [h('span', { class: 'lab', text: 'Say the word every time a card turns over!' })]));
      paintBanner();
    }
    start();
  }

  /* ============================== LESSON 2: The Bear and I ============================== */
  function l2Poem(c) {
    var scene = h('div', { class: 'bigscene' }), panel = h('div', { class: 'marketpanel arcticpanel tall' }, [scene]);
    if (hasArt('bg_arctic_ice')) panel.style.background = 'url(art/bg_arctic_ice.webp) center / cover'; else panel.style.background = 'linear-gradient(#bae6fd, #e0f2fe 60%, #7dd3fc)';
    c.body.appendChild(panel); fill(scene, '🏔️');
    runStory(c, D.poem, function (ch, predicting) { scene.innerHTML = ''; if (!ch) { fill(scene, '🐻‍❄️'); return; } fill(scene, predicting ? '🤔' : ch.scene, '', predicting ? null : ch.art); }, 'Stand up! You are the man in the poem. Do every action!', 'That is the first half of the poem. What will happen to the man and the bear when the ice gets thin?');
  }

  function l2Words(c) {
    var body = c.body, clueI = -1;
    var grid = h('div', { class: 'vgrid six' }), box = h('div', { class: 'msg' }), gap = h('div', { class: 'gapbox' });
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
        cards.appendChild(h('div', { class: 'ocard wide' + (ordered ? ' in' : '') }, [h('div', { class: 'on', text: ordered ? String(i + 1) : '?' }), fill(h('div', { class: 'oe' }), o.e, '', o.a), h('b', { text: o.n })]));
      });
    }
    draw(false); info.textContent = 'Teams: write the order 1-2-3-4 on your mini whiteboard. What happens first? What happens last?';
    var show = btn('👀 Show the order', 'amber', function () { if (done) return; done = true; draw(true); var t = 'First the man fishes. Next a giant bear is face to face with him. Then the man has a chance to go. Last the bear is his enemy.'; info.textContent = t; A.speak(t); sfx('win'); });
    body.appendChild(h('div', { class: 'row' }, [timerBtn(c, 60), show]));
    body.appendChild(cards); body.appendChild(info);
    body.appendChild(h('div', { class: 'frame-big', html: '<b>First</b> … &nbsp; <b>Next</b> … &nbsp; <b>Then</b> … &nbsp; <b>Last</b> …' }));
    body.appendChild(h('div', { class: 'row' }, ['First, the man fishes.', 'Next, a giant bear comes.', 'Then, the man has a chance to go.', 'Last, the bear is his enemy.'].map(function (s) { return h('button', { type: 'button', class: 'chip2', text: s, onclick: function () { A.speak(s); } }); })));
    body.appendChild(pointsRow());
  }

  /* GAME (Lesson 2): Ice Escape. Each team has its own lane of ice blocks. Right answer = one step. Wrong answer = the ice cracks. First to the end wins. */
  function l2Escape(c) {
    var body = c.body, host = h('div', { class: 'gameroot' }); body.appendChild(host);
    function start() {
      host.innerHTML = '';
      var N = D.steps, pos = D.teams.map(function () { return 0; }), finishedOrder = [], turn = 0, qs = shuffle(D.quiz), qi = 0, answered = false, asked = 0;
      var lanes = h('div', { class: 'lanes' }), qbox = h('div', { class: 'qbox' }), opts = h('div', { class: 'qopts' }), msg = h('div', { class: 'msg gmsg', text: '' });
      var laneEls = D.teams.map(function (t, i) {
        var lane = h('div', { class: 'lane', style: '--c:' + t.c }, [h('div', { class: 'lname', text: t.e + ' ' + t.n })]);
        var row = h('div', { class: 'lrow' });
        for (var k = 0; k <= N; k++) row.appendChild(h('div', { class: 'blk' + (k === N ? ' end' : ''), text: k === N ? '🏁' : '' }));
        lane.appendChild(row); lanes.appendChild(lane); return { lane: lane, row: row };
      });
      function place() { laneEls.forEach(function (l, i) { [].forEach.call(l.row.children, function (b, k) { b.innerHTML = ''; b.classList.toggle('on', k === pos[i]); if (k === pos[i]) { b.appendChild(h('span', { class: 'tkn', text: D.teams[i].e })); } else if (k === N) b.textContent = '🏁'; }); l.lane.classList.toggle('turn', i === turn && finishedOrder.indexOf(i) < 0); }); }
      function nextTurn() { var n = 0; do { turn = (turn + 1) % D.teams.length; n++; } while (finishedOrder.indexOf(turn) >= 0 && n <= D.teams.length); }
      function ask() {
        if (finishedOrder.length >= D.teams.length - 0 || asked >= 28) { finish(); return; }
        if (finishedOrder.indexOf(turn) >= 0) nextTurn();
        if (qi >= qs.length) { qs = shuffle(D.quiz); qi = 0; }
        var q = qs[qi++]; answered = false; asked++;
        qbox.innerHTML = ''; opts.innerHTML = '';
        qbox.appendChild(h('div', { class: 'qteam', style: '--c:' + D.teams[turn].c, text: teamName(turn) + ', your question!' }));
        qbox.appendChild(h('div', { class: 'qtext', text: q.q.replace(/_+/g, '______') }));
        var say = q.q.replace(/_+/g, 'blank'); A.speak(say);
        qbox.appendChild(sayBtn(say, 'Read it'));
        shuffle(q.o.map(function (t, k) { return { t: t, k: k }; })).forEach(function (op) {
          var b = h('button', { type: 'button', class: 'btn qopt', text: op.t });
          b.addEventListener('click', function () {
            if (answered) return; answered = true;
            if (op.k === q.a) {
              b.classList.add('right'); pos[turn]++; addPoint(turn, 1); sfx('correct'); msg.textContent = '✔ ' + q.say; A.speak(q.say);
              if (pos[turn] >= N) { finishedOrder.push(turn); var bonus = [3, 2, 1, 0][finishedOrder.length - 1] || 0; if (bonus) addPoint(turn, bonus); msg.textContent = '🏁 ' + teamName(turn) + ' escaped' + (bonus ? '! +' + bonus + ' bonus points' : '!'); sfx('win'); confetti(); }
            } else {
              b.classList.add('wrong'); sfx('tap'); msg.textContent = '💥 Crack! The ice is thin. The answer is: ' + q.o[q.a] + '. ' + q.say; A.speak('Crack! ' + q.say);
              var blk = laneEls[turn].row.children[pos[turn]]; if (blk) { blk.classList.add('crack'); setTimeout(function () { blk.classList.remove('crack'); }, 1400); }
            }
            place(); nxt.style.display = 'inline-flex';
          });
          opts.appendChild(b);
        });
        nxt.style.display = 'none'; place();
      }
      var nxt = btn('Next team ▶', 'green big', function () { nextTurn(); msg.textContent = ''; ask(); });
      function finish() { gameFinish(c, host, start); }
      var skip = btn('⏭ Skip', 'small ghost', function () { if (!answered) { ask(); } });
      host.appendChild(qbox); host.appendChild(opts); host.appendChild(h('div', { class: 'row' }, [nxt, skip, msg])); host.appendChild(lanes);
      place(); ask();
    }
    start();
  }

  /* ============================== LESSONS 3-4 helpers ============================== */
  function pairBoard(c, pairs, headL, headR, vsText, hint, frame) {
    var body = c.body;
    var left = h('div', { class: 'cmp cl' }), right = h('div', { class: 'cmp cr' }), sent = h('div', { class: 'msg gmsg', text: hint });
    var fr = h('div', { class: 'cmpwrap' }, [h('div', { class: 'cmphead', text: headL }), left, h('div', { class: 'cmpvs', text: vsText }), h('div', { class: 'cmphead', text: headR }), right]);
    function part(box, txt) { var bits = txt.split(' '); box.innerHTML = ''; box.appendChild(fill(h('div', { class: 'cmpe' }), bits[0])); box.appendChild(h('b', { text: bits.slice(1).join(' ') })); }
    function show(p) { part(left, p.l); part(right, p.r); sent.textContent = p.s; A.speak(p.s); sfx('page'); }
    var chips = h('div', { class: 'bank' }, pairs.map(function (p) { return h('button', { type: 'button', class: 'chip2', text: p.l + '  ⇄  ' + p.r, onclick: function () { show(p); } }); }));
    body.appendChild(h('div', { class: 'row' }, [timerBtn(c, 180)]));
    body.appendChild(fr); body.appendChild(sent); body.appendChild(chips);
    body.appendChild(h('div', { class: 'frame-big', html: frame }));
    body.appendChild(pointsRow());
    show(pairs[0]);
  }

  function wordCards(c, WL, six) {
    var body = c.body, clueI = -1;
    var grid = h('div', { class: 'vgrid six' }), box = h('div', { class: 'msg' }), gap = h('div', { class: 'gapbox' });
    WL.forEach(function (w) {
      var card = h('button', { type: 'button', class: 'btn vcard' }, [fill(h('span', { class: 'em' }), w.e), h('b', { text: w.w })]);
      card.addEventListener('click', function () {
        sfx('tap'); box.innerHTML = '<b>' + w.w + '</b>: ' + w.def + '.<br><i>' + w.ex + '</i>';
        A.speakSeq([w.w, w.def, w.ex]); [].forEach.call(grid.children, function (el) { el.classList.remove('sel'); }); card.classList.add('sel');
      });
      grid.appendChild(card);
    });
    var order = shuffle(WL.map(function (w, k) { return k; })), shown = false;
    var clue = btn('🎲 Clue game', 'violet', function () {
      if (clueI < 0 || shown) { clueI = (clueI + 1) % order.length; shown = false; var w = WL[order[clueI]]; gap.textContent = w.gap; A.speak(w.gap.replace(/_+/g, 'blank')); clue.textContent = '👀 Show the word'; sfx('page'); }
      else { shown = true; var w2 = WL[order[clueI]]; gap.textContent = w2.ex; A.speak(w2.ex); sfx('correct'); clue.textContent = '🎲 Next clue'; }
    });
    body.appendChild(h('div', { class: 'row' }, [clue, h('span', { class: 'lab', text: 'Tap a word card to hear it.' })]));
    body.appendChild(grid); body.appendChild(box); body.appendChild(gap); body.appendChild(pointsRow());
  }

  /* generic memory-pairs game with text cards */
  function textPairs(c, pairs, intro, kindA, kindB) {
    var body = c.body, host = h('div', { class: 'gameroot' }); body.appendChild(host);
    function start() {
      host.innerHTML = '';
      var turn = 0, first = null, lock = false, found = 0, cards = [];
      pairs.forEach(function (p) { cards.push({ id: p.id, kind: 'a', p: p.a }); cards.push({ id: p.id, kind: 'b', p: p.b }); });
      cards = shuffle(cards);
      var banner = h('div', { class: 'gturn' }), msg = h('div', { class: 'msg gmsg', text: intro }), grid = h('div', { class: 'memgrid txt' });
      function paintBanner() { var t = D.teams[turn]; banner.style.setProperty('--c', t.c); banner.innerHTML = ''; banner.appendChild(h('span', { class: 'tn', text: t.e + ' ' + t.n + '’ turn' })); banner.appendChild(h('span', { class: 'gb', text: '🃏 Pairs: ' + found + ' / ' + pairs.length })); }
      cards.forEach(function (cd) {
        var el = h('button', { type: 'button', class: 'btn memcard txt' }, [h('span', { class: 'mb', text: '❓' })]);
        el.addEventListener('click', function () {
          if (lock || el.classList.contains('up') || el.classList.contains('done')) return;
          el.classList.add('up'); el.innerHTML = ''; el.appendChild(fill(h('span', { class: 'mp' }), cd.p.e)); el.appendChild(h('span', { class: 'mt', text: cd.p.t }));
          A.speak(cd.p.t); sfx('tap');
          if (!first) { first = { cd: cd, el: el }; return; }
          var a = first; first = null; lock = true;
          if (a.cd.id === cd.id && a.cd.kind !== cd.kind) {
            setTimeout(function () { a.el.classList.add('done'); el.classList.add('done'); found++; addPoint(turn, 2); sfx('correct'); msg.textContent = teamName(turn) + ' found a pair! +2 points. Go again!'; paintBanner(); lock = false; if (found === pairs.length) { sfx('win'); setTimeout(function () { gameFinish(c, host, start); }, 900); } }, 600);
          } else {
            setTimeout(function () { [a.el, el].forEach(function (x) { x.classList.remove('up'); x.innerHTML = ''; x.appendChild(h('span', { class: 'mb', text: '❓' })); }); turn = (turn + 1) % D.teams.length; msg.textContent = 'Not a pair. Next team!'; paintBanner(); lock = false; }, 1500);
          }
        });
        grid.appendChild(el);
      });
      host.appendChild(banner); host.appendChild(msg); host.appendChild(grid); paintBanner();
    }
    start();
  }

  function voteBoard(c, options, frameHtml, chips, say) {
    var body = c.body, counts = options.map(function () { return 0; });
    var grid = h('div', { class: 'votes' }), tot = h('span', { class: 'pill amber', text: '🗳️ 0 votes' });
    grid.style.gridTemplateColumns = 'repeat(' + Math.min(options.length, 6) + ', 1fr)';
    function draw() {
      var max = Math.max.apply(null, counts.concat([1])), sum = counts.reduce(function (a, b) { return a + b; }, 0);
      tot.textContent = '🗳️ ' + sum + ' vote' + (sum === 1 ? '' : 's'); grid.innerHTML = '';
      options.forEach(function (v, k) {
        grid.appendChild(h('div', { class: 'vote' }, [
          h('div', { class: 'vbar' }, [h('i', { style: 'height:' + Math.round(counts[k] / max * 100) + '%' })]), h('b', { class: 'vn', text: String(counts[k]) }),
          h('button', { type: 'button', class: 'btn votebtn', onclick: function () { counts[k]++; sfx('coin'); A.speak(say(v)); draw(); } }, [fill(h('span', { class: 'em' }), v.e, '', v.a), h('small', { text: v.n })])
        ]));
      });
    }
    body.appendChild(h('div', { class: 'row' }, [timerBtn(c, 150), tot, btn('↺ Clear', 'small ghost', function () { counts = options.map(function () { return 0; }); draw(); })]));
    body.appendChild(h('div', { class: 'frame-big', html: frameHtml }));
    body.appendChild(grid);
    body.appendChild(h('div', { class: 'row' }, chips.map(function (s) { return h('button', { type: 'button', class: 'chip2', text: s, onclick: function () { A.speak(s.replace(/…/g, '')); } }); })));
    body.appendChild(pointsRow()); draw();
  }

  /* ============================== LESSON 3: The Ice Cracks ============================== */
  function l3Poem(c) {
    var scene = h('div', { class: 'bigscene' }), meter = h('div', { class: 'icemeter low' }, [h('span', { class: 'lab', text: '🧊 ICE' }), h('div', { class: 'ib' }, [h('i')])]);
    var panel = h('div', { class: 'marketpanel arcticpanel tall' }, [scene]);
    function setBg(n) { var nm = n ? 'bg_arctic_melting' : 'bg_arctic_ice'; if (hasArt(nm)) panel.style.background = 'url(art/' + nm + '.webp) center / cover'; else panel.style.background = n ? 'linear-gradient(#fcd34d, #38bdf8 60%, #0369a1)' : 'linear-gradient(#bae6fd, #e0f2fe 60%, #7dd3fc)'; }
    function setIce(p) { meter.querySelector('i').style.width = p + '%'; meter.classList.toggle('low', p < 50); }
    setBg(0); setIce(100); c.body.appendChild(panel); c.body.appendChild(meter); fill(scene, '🧊');
    runStory(c, D.poem2, function (ch, predicting) { scene.innerHTML = ''; if (!ch) { fill(scene, '🐻‍❄️'); return; } fill(scene, predicting ? '🤔' : ch.scene, '', predicting ? null : ch.art); if (!predicting) { setIce(ch.ice); setBg(ch.bg); } }, 'Stand up! You are the man in the poem. The ice is getting thin…', 'That is the whole poem. The man and the bear were not enemies in the trap. Things change, and the world has danger and hope.');
  }

  function orderBoard(c, list, intro, speakText, frames, frameHtml) {
    var body = c.body, done = false, cards = h('div', { class: 'ordrow' }), info = h('div', { class: 'msg' });
    var shuffled = shuffle(list);
    function draw(ordered) {
      cards.innerHTML = '';
      (ordered ? list.slice().sort(function (a, b) { return a.k - b.k; }) : shuffled).forEach(function (o, i) {
        cards.appendChild(h('div', { class: 'ocard wide' + (ordered ? ' in' : '') }, [h('div', { class: 'on', text: ordered ? String(i + 1) : '?' }), fill(h('div', { class: 'oe' }), o.e, '', o.a), h('b', { text: o.n })]));
      });
    }
    draw(false); info.textContent = intro;
    var show = btn('👀 Show the order', 'amber', function () { if (done) return; done = true; draw(true); info.textContent = speakText; A.speak(speakText); sfx('win'); });
    body.appendChild(h('div', { class: 'row' }, [timerBtn(c, 90), show]));
    body.appendChild(cards); body.appendChild(info);
    body.appendChild(h('div', { class: 'frame-big', html: frameHtml }));
    body.appendChild(h('div', { class: 'row' }, frames.map(function (s) { return h('button', { type: 'button', class: 'chip2', text: s, onclick: function () { A.speak(s); } }); })));
    body.appendChild(pointsRow());
  }

  /* ============================== LESSON 4: Explore the Poem ============================== */
  function l4Phonics(c) {
    var body = c.body, found = 0, total = D.ngWords.filter(function (w) { return w.ng; }).length, cnt = h('span', { class: 'pill amber', text: '🔤 0 / ' + total });
    var grid = h('div', { class: 'ngrid' }), info = h('div', { class: 'msg gmsg', text: 'Listen and say. Which words END with the -ng sound? Tap them!' });
    var showTxt = h('div', { class: 'ngbig', text: '-ng' });
    D.ngWords.forEach(function (w) {
      var b = h('button', { type: 'button', class: 'btn ngcard' }, [fill(h('span', { class: 'em' }), w.e), h('b', { text: w.w })]);
      b.addEventListener('click', function () {
        if (b.classList.contains('hit') || b.classList.contains('miss')) { A.speak(w.w); return; }
        A.speak(w.w);
        if (w.ng) { b.classList.add('hit'); found++; cnt.textContent = '🔤 ' + found + ' / ' + total; sfx('coin'); info.textContent = '✔ ' + w.w + ' ends with -ng.'; if (found === total) { sfx('win'); confetti(); info.textContent = 'You found them all! Say the -ng sound at the back of your mouth.'; } }
        else { b.classList.add('miss'); sfx('tap'); info.textContent = w.w + ' does not end with -ng.'; }
      });
      grid.appendChild(b);
    });
    body.appendChild(h('div', { class: 'row' }, [timerBtn(c, 240), cnt, sayBtn('sing, long, reading, bang, spring', 'Book words')]));
    body.appendChild(showTxt); body.appendChild(info); body.appendChild(grid); body.appendChild(pointsRow());
  }

  /* GAME (Lesson 4): Stanza Detective. Which stanza has the answer? Tap a number from 1 to 8. */
  function l4Stanza(c) {
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    function start() {
      host.innerHTML = '';
      var qs = shuffle(D.stanzaQuiz).slice(0, 8), qi = 0, turn = 0, tries = 0, answered = false;
      var qbox = h('div', { class: 'qbox' }), nums = h('div', { class: 'stnums' }), msg = h('div', { class: 'msg gmsg', text: '' }), prog = h('span', { class: 'pill amber' });
      var nxt = btn('Next question ▶', 'green big', function () { nxt.style.display = 'none'; msg.textContent = ''; ask(); });
      function ask() {
        if (qi >= qs.length) { gameFinish(c, host, start); return; }
        var q = qs[qi]; answered = false; qbox.innerHTML = ''; nums.innerHTML = ''; nxt.style.display = 'none'; prog.textContent = 'Question ' + (qi + 1) + ' of ' + qs.length;
        qbox.appendChild(h('div', { class: 'qteam', style: '--c:' + D.teams[turn].c, text: teamName(turn) + (tries ? ', your chance to steal!' : ', your question!') }));
        qbox.appendChild(h('div', { class: 'qtext', text: q.q })); A.speak(q.q); qbox.appendChild(sayBtn(q.q, 'Read it'));
        qbox.appendChild(h('div', { class: 'qhint', text: 'Which stanza has the answer? Look in the poem!' }));
        for (var n = 1; n <= 8; n++) (function (n) {
          var b = h('button', { type: 'button', class: 'btn stnum', text: String(n) });
          b.addEventListener('click', function () {
            if (answered || b.disabled) return;
            if (n === q.a) { answered = true; b.classList.add('right'); addPoint(turn, tries ? 1 : 2); sfx('correct'); msg.textContent = '✔ ' + q.say + ' (+' + (tries ? 1 : 2) + ')'; A.speak(q.say); qi++; tries = 0; turn = (turn + 1) % D.teams.length; nxt.style.display = 'inline-flex'; if (qi >= qs.length) nxt.textContent = '🏆 See the winner'; else nxt.textContent = 'Next question ▶'; }
            else if (!tries) { b.classList.add('wrong'); b.disabled = true; tries = 1; sfx('tap'); turn = (turn + 1) % D.teams.length; msg.textContent = 'Not that stanza. The next team can steal it!'; A.speak('Not that stanza. Next team!'); setTimeout(ask, 1300); }
            else { answered = true; b.classList.add('wrong'); sfx('tap'); msg.textContent = 'Nobody found it. ' + q.say; A.speak(q.say); qi++; tries = 0; nxt.style.display = 'inline-flex'; nxt.textContent = qi >= qs.length ? '🏆 See the winner' : 'Next question ▶'; }
          });
          nums.appendChild(b);
        })(n);
      }
      host.appendChild(h('div', { class: 'row' }, [prog, h('span', { class: 'lab', text: 'Right stanza: 2 points (1 if you steal). Wrong: the next team can steal.' })]));
      host.appendChild(qbox); host.appendChild(nums); host.appendChild(h('div', { class: 'row' }, [nxt, msg])); ask();
    }
    start();
  }

  /* Perform the poem: eight stanza cards, each group performs one */
  function l4Perform(c) {
    var body = c.body, cur = -1;
    var grid = h('div', { class: 'perf' }), big = h('div', { class: 'perfbig', text: 'Choose a stanza. A group says it and does the actions!' }), done = {};
    D.stanzaRetell.forEach(function (s, k) {
      var b = h('button', { type: 'button', class: 'btn perfcard' }, [h('span', { class: 'pn', text: String(s.n) }), fill(h('span', { class: 'em' }), s.e)]);
      b.addEventListener('click', function () { cur = k; big.innerHTML = '<b>Stanza ' + s.n + '</b><br>' + s.t; A.speak(s.t); sfx('page'); b.classList.add('seen'); [].forEach.call(grid.children, function (x) { x.classList.remove('on'); }); b.classList.add('on'); done[k] = 1; if (Object.keys(done).length === 8) { sfx('win'); confetti(); } });
      grid.appendChild(b);
    });
    body.appendChild(h('div', { class: 'row' }, [timerBtn(c, 360), sayBtn(D.stanzaRetell.map(function (s) { return s.t; }).join(' '), 'Hear it all')]));
    body.appendChild(grid); body.appendChild(big);
    body.appendChild(h('div', { class: 'frame-big', html: '8 groups, 8 stanzas. <b>Say your lines clearly. Add actions. Everybody joins the last line: “For the bear and I.”</b>' }));
    body.appendChild(pointsRow());
  }


  var MODES = { game: '🎮 Game', think: '🤔 Think', listen: '👂 Listen', act: '🎭 Act it out', move: '🚶 Move', talk: '🗣️ Talk', create: '🎨 Create', race: '🏆 Team race', detect: '🔍 Detective', story: '📖 Story' };
  var LESSONS = {
    1: { title: 'It Keeps Changing', missions: D.missions1, door: '🚪 Door pass: tell me ONE change in nature (good or bad) before you leave!', scenes: [
      { t: 'The Pink River', mins: '3 min', mode: 'think', run: function (c) { hookPrompts(c, [{ e: '🧑‍🔬', n: 'c_scientist' }], D.stwPrompts, D.missions1, 'bg_pink_river'); }, intro: 'Look at this picture. What do you see? What do you think? What do you wonder?',
        kids: { steps: ['👀 Look at the picture', '🤔 Think: why is the water pink?', '❓ Ask a question: I wonder…'], say: ['I see a lot of pink.', 'There’s paint in the water.', 'Is it juice?'] },
        tip: ['Book link: p.40 unit opener (a person pours pink colour into a river) and p.41 A-C "See, Think, Wonder" (I see a lot of pink. There’s paint in the water. Is it juice? What is he doing?).', 'Press the button for each question. Accept all ideas: paint, juice, a science test. Do NOT give the answer. The book does not explain the photo; it is a hook for the unit "It Keeps Changing".', 'Show the five missions at the end.'] },
      { t: 'Good Change or Bad Change?', mins: '5 min', mode: 'move', run: function (c) { walkScene(c, D.zones1, D.walk1, function (w) { return (w.a === 'G' ? 'Good change: ' : 'Bad change: ') + w.t; }, '🚶 GOOD or BAD? Walk to the right corner.'); }, intro: 'Read the card. Is it a good change or a bad change? Walk to the right corner.',
        kids: { steps: ['👀 Read the card', '🚶 Walk to GOOD or BAD', '🗣️ Say why: It is bad because …'], say: ['It is a good change.', 'It is a bad change because …'] },
        tip: ['Book link: p.41 D "What good and bad changes in nature do you know about?"', 'Print the two corner signs from the Cards page (GOOD and BAD). Pupils walk, then give a reason with "because".', 'Ask pupils to add their own changes (the seasons, a baby growing, a river drying).'] },
      { t: 'The Arctic and My Town', mins: '6 min', mode: 'talk', run: l1Compare, intro: 'Compare and contrast the Arctic with the place where you live.',
        kids: { steps: ['🤝 Tap a pair with your partner', '🗣️ Say it: In the Arctic … but where I live …', '✅ Is it true for your town? Say yes or no'], say: ['In the Arctic there is …', 'but where I live there is …', 'Both … and … have …'] },
        tip: ['Book link: p.41 E "Look at this picture (a house in the snow). Compare and contrast this setting to where you live." Compare means find what is the same; contrast means find what is different (p.47).', 'Press Model it. Tap a pair: the board says a sentence. Pupils decide with their partner whether it is true for their own town and change the second half if it is not.', 'Use Both: "Both the Arctic and my town have wind." Support: point and say two words. Stretch: add "because".'] },
      { t: 'A Visit to the Arctic', mins: '8 min', mode: 'act', run: l1Arctic, intro: 'Stand up, friends! Visit the Arctic with your body.',
        kids: { steps: ['🧍 Stand up and do the action', '🗣️ Repeat after the teacher (echo)', '🤔 At the 🤔 part: talk with your partner'], say: ['It is very cold.', 'The ice is melting.', 'We can help.'] },
        tip: ['Book link: preparation for the poem on pp.42-45 and the unit idea "How can we make good changes in our world?" (p.55). The man, the polar bear and the thin ice are introduced here.', 'Pupils do each action first, then you press the next part. Watch the ICE bar go down when the winters get warmer. At the 🤔 part pupils guess what happens to the ice.', 'Do not read the poem yet. Pupils meet "The Bear and I" in Lesson 2.'] },
      { t: 'GAME: Arctic Memory', mins: '10 min', mode: 'game', run: l1Memory, intro: 'Teams take turns. Find a picture and its word. A pair gives 2 points and another turn!',
        kids: { steps: ['🃏 Flip two cards', '🗣️ Say the word every time', '🤝 Match the picture and its word'], say: ['This is a polar bear.', 'The ice is melting.', 'It is a pair!'] },
        tip: ['Book link: vocabulary from pp.40-45 (polar bear, ice, hole, melting, thin, fishing rod, crack, the Arctic). It pre-teaches the six Words in Context of Lesson 2.', 'The team in turn chooses two cards (the whole team shouts a number, one pupil taps). The board says the word each time a card turns over. A pair = 2 points and the team goes again. A wrong pair turns back and the next team plays.', 'Eight pairs are on the board. When all are found the winner is shown. Press Play again for a new shuffle.'] },
      { t: 'Change Makers', mins: '3 min', mode: 'think', run: function (c) { wrapStart(c, 1, '🌍', 'It Keeps Changing'); }, intro: 'Mission complete!',
        kids: { steps: ['🏆 Cheer for every team', '🚪 Door pass: one change in nature'], say: ['The ice is melting.', 'Plants grow.'] },
        tip: ['Show the scores and cheer for everyone. At the door each pupil says one change in nature in English (for example "Plants grow" or "The ice is melting"). It is a quick check for you.'] }
    ] },
    2: { title: 'The Bear and I', missions: D.missions2, door: '🚪 Door pass: say ONE sentence about the man or the bear!', scenes: [
      { t: 'Who Is “I”?', mins: '3 min', mode: 'think', run: function (c) { hookPrompts(c, [{ e: '🐻‍❄️', n: 'c_polar_bear' }, { e: '👦', n: 'c_young_fisherman' }], D.titlePrompts, D.missions2, 'bg_cabin_snow'); }, intro: 'The poem is called The Bear and I. Who is “I”?',
        kids: { steps: ['👀 Look at the picture', '🤔 Guess with your partner', '✋ Tell the class'], say: ['I think “I” is …', 'I think the bear is …'] },
        tip: ['Book link: p.42 "The Bear and I" (Fiction, a poem). The book asks "How many stanzas does this poem have?" (a stanza is a group of lines in a poem; the poem has 8 stanzas, 2 on each page).', 'Accept all guesses. Do not read the poem yet. Show the five missions at the end.'] },
      { t: 'The Poem: Part 1', mins: '7 min', mode: 'act', run: l2Poem, intro: 'Stand up! You are the man in the poem. Do every action!',
        kids: { steps: ['🧍 Stand up and do the action', '🗣️ Repeat after the teacher (echo)', '🤝 At the end, retell it to a partner'], say: ['I fish through a hole.', 'The bear was twice my size.', 'The bear was my enemy.'] },
        tip: ['Book link: pp.42-43, stanzas 1-4 (the man from a land of wind and cold, his fishing hole, the giant arctic bear twice his size, the bear as his enemy). The lines here are retold in simple words, not copied.', 'Pupils do each action, then you press the next part. At the 🤔 part pupils guess what is near the fishing hole. Press Reveal.', 'After the story, read the real poem from the book with the class (pp.42-43).'] },
      { t: 'Word Detectives', mins: '6 min', mode: 'detect', run: l2Words, intro: 'Six new words from the poem. What do you think they mean?',
        kids: { steps: ['👀 Look at the word card', '🤔 Guess the meaning with your partner', '🗣️ Say the word and the sentence'], say: ['hole', 'twice', 'enemy'] },
        tip: ['Book link: p.43 "Words in Context": hole, twice, enemy, thin, trap, melting ("Find these words in the reading. What do you think they mean?"). Thin, trap and melting come back in stanzas 5-8 (next lessons).', 'Tap a card: the board says the word, the meaning and an example sentence. Pupils guess first.', 'Then press Clue game: pupils say the missing word.'] },
      { t: 'Put the Story in Order', mins: '4 min', mode: 'think', run: l2Order, intro: 'Four things happen in the poem. What happens first? What happens last?',
        kids: { steps: ['🤝 Talk with your team', '✍️ Write 1-2-3-4 on the mini whiteboard', '⬆️ Hold it up at 0'], say: ['First …', 'Next …', 'Last …'] },
        tip: ['Book link: pp.42-43 (order of events in stanzas 1-4).', 'Teams order the four cards on their whiteboards. Show the order, then practise First / Next / Then / Last.', 'Give a point to every team that is correct.'] },
      { t: 'Man or Bear or Both?', mins: '4 min', mode: 'move', run: function (c) { walkScene(c, D.zones2, D.walk2, function (w) { return w.s; }, '🚶 Who is it? Walk to MAN, BOTH or BEAR.'); }, intro: 'Read the card. Is it the man, the bear or both? Walk to the right corner!',
        kids: { steps: ['👀 Read the card', '🚶 Walk to MAN, BOTH or BEAR', '🗣️ Say the sentence'], say: ['The man …', 'The bear …', 'Both … and …'] },
        tip: ['Book link: p.47 "Compare and Contrast" (compare the bear and the man: eats fish, is big and scary, lives in the Arctic, is hungry, falls in the water, lives in a house). Today pupils use only what they know from stanzas 1-4.', 'Print the three corner signs from the Cards page. Pupils walk, then say the sentence. Reward the sentence, not only the corner.'] },
      { t: 'GAME: Ice Escape', mins: '8 min', mode: 'game', run: l2Escape, intro: 'Each team has its own lane of ice. Answer right and step forward. Answer wrong and the ice cracks!',
        kids: { steps: ['👂 Listen to the question', '🗣️ Talk with your team, then answer', '🏁 Be the first team to the end of the ice'], say: ['I think it is …', 'The answer is …'] },
        tip: ['Book link: pp.42-43 (Words in Context and the facts of stanzas 1-4). Questions are mixed: words and understanding.', 'Teams take turns. The team talks for 10 seconds, then one pupil taps the answer. Right answer = one step and 1 point. A wrong answer cracks the ice but nobody loses points. The first team to the flag gets +3, the second +2, the third +1.', 'Press Next team after each answer. Skip a question that is too hard. At the end the winner is shown.'] },
      { t: 'The Ice Escape Ceremony', mins: '3 min', mode: 'think', run: function (c) { wrapStart(c, 2, '🐻‍❄️', 'The Bear and I'); }, intro: 'Well done, friends!',
        kids: { steps: ['🏆 Cheer for every team', '🚪 Door pass: one sentence about the man or the bear'], say: ['The bear was twice my size.', 'The man fishes through a hole.'] },
        tip: ['At the door each pupil says one sentence about the man or the bear (for example "The bear is hungry."). Next lesson: stanzas 5-8, when the ice gets thin.'] }
    ] },
    3: { title: 'The Ice Cracks', missions: D.missions3, door: '🚪 Door pass: say ONE sentence with because about the ice, the bear or the man!', scenes: [
      { t: 'Remember the Poem', mins: '3 min', mode: 'think', run: function (c) { hookPrompts(c, [{ e: '👦', n: 'c_young_fisherman' }, { e: '🐻‍❄️', n: 'c_polar_bear' }], D.recapPrompts, D.missions3, 'bg_arctic_ice'); }, intro: 'Last lesson we met a man and a giant polar bear. What do you remember?',
        kids: { steps: ['👀 Look at the pictures', '🤔 Whisper to your partner: what do you remember?', '✋ Tell the class'], say: ['The man is from …', 'The bear was his enemy.'] },
        tip: ['Book link: recap of stanzas 1-4 (pp.42-43) before stanzas 5-8 (pp.44-45).', 'Press the button for each question. Accept one-word answers and sentences. Show the six missions at the end.'] },
      { t: 'The Poem: Part 2', mins: '7 min', mode: 'act', run: l3Poem, intro: 'Stand up! You are the man. The ice is getting thin…',
        kids: { steps: ['🧍 Stand up and do the action', '🗣️ Repeat after the teacher (echo)', '🤝 At the end, retell it to a partner'], say: ['The ice is thin.', 'They are in a trap together.', 'The ice is melting.'] },
        tip: ['Book link: pp.44-45, stanzas 5-8 (warm winters, thin ice, they fall in, a trap of ice and sea, the bear is not his enemy, things change, danger, the ice is melting, he hopes to see the bear once more). The lines are retold in simple words, not copied.', 'Watch the ICE bar go down. At the 🤔 part pupils guess what happens when the ice is thin. Press Reveal.', 'After the story, read the real stanzas 5-8 from the book with the class. The book asks: "Why do you think the ice was a trap?" (p.44) and "Does the man change his mind about the bear?" (p.45).'] },
      { t: 'Six Poem Words', mins: '5 min', mode: 'detect', run: function (c) { wordCards(c, D.words3); }, intro: 'Six words from the end of the poem. What do you think they mean?',
        kids: { steps: ['👀 Look at the word card', '🤔 Guess the meaning with your partner', '🗣️ Say the word and the sentence'], say: ['crack', 'together', 'danger'] },
        tip: ['Book link: stanzas 5-8 on pp.44-45 (crack, swim, together, danger, hope, once more). "Thin", "trap" and "melting" were Words in Context on p.43 and come back here.', 'Tap a card: the board says the word, the meaning and an example. Then press Clue game: pupils say the missing word.'] },
      { t: 'Cause and Effect', mins: '5 min', mode: 'think', run: function (c) { orderBoard(c, D.chain, 'Teams: write the order 1-2-3-4-5 on your mini whiteboard. What happens first? What happens next?', 'First there are many warm winters. Next the ice gets thin. Then the ice cracks. After that the man and the bear fall in. Last they are in the trap together.', ['Many warm winters make the ice thin.', 'The ice is thin, so it cracks.', 'The ice cracks, so they fall in.'], '<b>…, so …</b> &nbsp; · &nbsp; <b>… because …</b>'); }, intro: 'One thing makes the next thing happen. Put the poem events in order!',
        kids: { steps: ['🤝 Talk with your team', '✍️ Write 1-2-3-4-5 on the mini whiteboard', '🗣️ Say: …, so …'], say: ['The ice is thin, so it cracks.', 'It cracks because it is thin.'] },
        tip: ['Book link: stanzas 5-6 (pp.44) and the Think Together cause and effect idea on p.55.', 'Teams order the five cards. Show the order, then practise the frame with "so" and "because".', 'Give a point to every team that is correct.'] },
      { t: 'GAME: Cause and Effect Pairs', mins: '9 min', mode: 'game', run: function (c) { textPairs(c, D.pairs3, 'Flip two cards. Find a CAUSE and its EFFECT!'); }, intro: 'Teams take turns. Find a cause and its effect. A pair gives 2 points and another turn!',
        kids: { steps: ['🃏 Flip two cards', '🗣️ Read the card out loud', '🤝 Match the cause and its effect'], say: ['… , so …', '… because …'] },
        tip: ['Book link: stanzas 5-8 (pp.44-45). Pairs: warm winters → thin ice; thin ice → it cracks; it cracks → they fall in; difficult to swim → a trap of ice and sea; they help each other → the bear is not his enemy; the ice is melting → danger.', 'The team in turn chooses two cards (the whole team shouts a number, one pupil taps). The board reads each card. A pair = 2 points and the team goes again. A wrong pair turns back and the next team plays.', 'Six pairs. When all are found the winner is shown. Ask for a sentence with "so" for every pair.'] },
      { t: 'How Can We Help?', mins: '4 min', mode: 'talk', run: function (c) { voteBoard(c, D.help, '<b>I can … because …</b> &nbsp; · &nbsp; How can we make good changes in our world?', ['I can ride a bike because bikes do not make the air dirty.', 'I can clean up trash because trash is a danger for animals.', 'I can … because …'], function (v) { return 'I can ' + v.n + '.'; }); }, intro: 'The ice is melting. How can WE help? Vote for your idea!',
        kids: { steps: ['🤔 Think: how can I help?', '🗳️ Tell the teacher your vote', '🗣️ Say: I can … because …'], say: ['I can … because …'] },
        tip: ['Book link: p.55 B "What changes can you make to keep our world clean?" with the frames "I can clean up trash because trash is a danger for animals." and "I can ride a bike to school because bikes don’t make the air dirty."', 'Tap an idea once for each pupil’s vote. Ask two or three pupils to say a full sentence with "because". There is no wrong answer.'] },
      { t: 'The Ice Ceremony', mins: '2 min', mode: 'think', run: function (c) { wrapStart(c, 3, '🧊', 'The Ice Cracks'); }, intro: 'You have finished the poem!',
        kids: { steps: ['🏆 Cheer for every team', '🚪 Door pass: one sentence with because'], say: ['The ice cracks because it is thin.'] },
        tip: ['At the door each pupil says one sentence with "because" or "so" about the ice, the bear or the man. Next lesson: explore the poem (True/False, stanza questions, -ng sound, friends or not).'] }
    ] },
    4: { title: 'Explore the Poem', missions: D.missions4, door: '🚪 Door pass: say ONE word that ends with -ng!', scenes: [
      { t: 'True or False?', mins: '4 min', mode: 'move', run: function (c) { walkScene(c, D.zones4, D.walk4, function (w) { return w.s; }, '🚶 TRUE or FALSE? Walk to the right corner.'); }, intro: 'Read the sentence. Is it true or false? Walk to the right corner!',
        kids: { steps: ['👀 Read the sentence', '🚶 Walk to TRUE or FALSE', '🗣️ Say why: It is false because …'], say: ['It is true.', 'It is false because …'] },
        tip: ['Book link: p.46 A "Read and write True or False." (1 False, 2 True, 3 False, 4 True, 5 False).', 'Print the two corner signs from the Cards page (TRUE and FALSE). Pupils walk, then correct the false sentence. Pupils then write the answers in their books.'] },
      { t: 'The -ng Sound', mins: '5 min', mode: 'listen', run: l4Phonics, intro: 'Listen and say. Which words END with the -ng sound?',
        kids: { steps: ['👂 Listen to the word', '🗣️ Say it after the board', '👆 Tap the words that end with -ng'], say: ['sing', 'long', 'spring'] },
        tip: ['Book link: p.46 Phonics -ng: "Listen and say. sing, long, reading, bang, spring. Now find more words ending with -ng in the reading." (young, fishing, morning, melting, changing, getting, living).', 'Say each word first: the -ng is one sound at the back of the mouth, with no hard "g" at the end. Tap a word: the board says it. -ng words turn green; other words turn grey.', 'Turkish speakers often add a hard "g" (sin-g). Practise a nasal "ng" with a hum.'] },
      { t: 'GAME: Stanza Detective', mins: '9 min', mode: 'game', run: l4Stanza, intro: 'Which stanza has the answer? Look in the poem, then tap the stanza number!',
        kids: { steps: ['👂 Listen to the question', '📖 Find the answer in the poem with your team', '🔢 Tap the number of the stanza'], say: ['The answer is in stanza …', 'I think it is stanza …'] },
        tip: ['Book link: p.46 B "Read and answer. Then write the number of the stanza where you can find the answer." (Where is the man from? stanza 1; How big is the polar bear? stanza 3; Why is the ice thin? stanza 5; Why are they in the water? stanza 5; What does the man hope? stanza 8).', 'Pupils keep the books open at pp.42-45. Teams take turns: right stanza = 2 points, wrong = the next team can steal for 1 point.', 'Eight questions are chosen from ten. After the last one the winner is shown. Press Play again for a new set.'] },
      { t: 'Are They Friends?', mins: '5 min', mode: 'talk', run: function (c) { voteBoard(c, D.friendVote, '<b>I think they are / are not friends because …</b> &nbsp; · &nbsp; Do you think the man and the bear are friends at the end of the poem?', ['I think they are friends because they helped each other.', 'I think they are not friends because the bear takes his fish.', 'I am not sure because …'], function (v) { return 'I think they are ' + v.n + '.'; }); }, intro: 'Do you think the man and the bear are friends at the end? Why or why not?',
        kids: { steps: ['🤔 Think: friends or not?', '🗳️ Tell the teacher your vote', '🗣️ Say: I think … because …'], say: ['I think they are friends because …', 'I think they are not friends because …'] },
        tip: ['Book link: p.46 C "Think and discuss. Do you think the man and the bear are friends at the end of the poem? Why or why not?" with the frame "I think they’re not friends because the bear takes his fish."', 'Tap once for each pupil’s vote. Ask pupils from each side to give a reason with "because". Reward the reason, not the side.'] },
      { t: 'Compare Two Cars', mins: '4 min', mode: 'talk', run: function (c) { pairBoard(c, D.cars, '🔴 The red car', '⚪ The white car', 'VS', 'Tap a pair. Say the sentence with your partner.', '<b>… , but …</b> &nbsp; · &nbsp; <b>Both … and …</b> &nbsp; (same: circle · different: underline)'); }, intro: 'Compare and contrast the red car and the white car. What is the same? What is different?',
        kids: { steps: ['🤝 Tap a pair with your partner', '🗣️ Say: …, but … / Both …', '✍️ Circle the same, underline the different'], say: ['The red car is …, but the white car is …', 'Both cars have …'] },
        tip: ['Book link: p.47 B "Look and read. Circle things that are the same. Draw a line under things that are different. Compare with a partner." (the red car: red, four wheels, big, noisy, fast; the white car: small, fast, quiet, white, four wheels). Compare = same, contrast = different (p.47).', 'Pupils do p.47 B in their books, then tap pairs to check. Model "The red car is big, but the white car is small." and "Both cars have four wheels."'] },
      { t: 'Perform the Poem', mins: '6 min', mode: 'create', run: l4Perform, intro: 'Eight groups, eight stanzas. Say your stanza and add actions!',
        kids: { steps: ['👥 Each group gets one stanza', '🗣️ Say it clearly with actions', '👏 Everybody joins the last line'], say: ['For the bear and I.'] },
        tip: ['Book link: pp.42-45, all eight stanzas of The Bear and I.', 'Tap a stanza number: the board shows and reads a simple retelling. Each group first reads its REAL stanza from the book, then performs it with actions. Give a team point for clear voices and good actions.', 'If the class is small, groups may take two stanzas. If time is short, perform stanzas 5-8 only.'] },
      { t: 'Poets’ Ceremony', mins: '2 min', mode: 'think', run: function (c) { wrapStart(c, 4, '🎤', 'Explore the Poem'); }, intro: 'Well done, poets!',
        kids: { steps: ['🏆 Cheer for every team', '🚪 Door pass: a word that ends with -ng'], say: ['sing', 'long', 'spring'] },
        tip: ['At the door each pupil says one word that ends with -ng (sing, long, spring, young, fishing, morning, melting, changing). Next lessons: Reading 2, Clean Cars (pp.48-55).'] }
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
    $('tab1').classList.toggle('on', lesson === 1); $('tab2').classList.toggle('on', lesson === 2); $('tab3').classList.toggle('on', lesson === 3); $('tab4').classList.toggle('on', lesson === 4); 
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
  $('tab4').addEventListener('click', function () { go(4, 0); });
  $('back').addEventListener('click', function () { if (state.idx > 0) go(state.lesson, state.idx - 1); });
  $('next').addEventListener('click', function () { if (state.idx < LESSONS[state.lesson].scenes.length - 1) go(state.lesson, state.idx + 1); });
  $('tipbtn').addEventListener('click', function () { var t = $('tip'); if (t.hidden) { tipHtml(); t.hidden = false; } else t.hidden = true; });
  $('snd').addEventListener('click', function () { A.setOn(!A.isOn()); $('snd').textContent = A.isOn() ? '🔊' : '🔇'; });
  $('fs').addEventListener('click', function () { try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } catch (e) { /* ignore */ } });
  document.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') $('next').click(); else if (e.key === 'ArrowLeft') $('back').click(); });

  var q = {}; (location.search || '').replace(/^\?/, '').split('&').forEach(function (p) { var kv = p.split('='); if (kv[0]) q[kv[0]] = decodeURIComponent(kv[1] || ''); });
  var l0 = ({ '2': 2, '3': 3, '4': 4 })[q.lesson] || 1, s0 = Math.max(0, Math.min(LESSONS[l0].scenes.length - 1, (parseInt(q.scene, 10) || 1) - 1));
  window.G3Lessons = { state: state, go: go, LESSONS: LESSONS };
  loadManifest(function () { drawTeams(); go(l0, s0); });
})();
