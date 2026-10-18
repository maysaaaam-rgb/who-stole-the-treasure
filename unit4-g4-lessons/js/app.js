/* Unit 4 Grade 4: We Can Do It: teacher-led smartboard lessons (35 minutes each). The board is the stage, timer and scoreboard.
   The children move, act, talk and play. Four teams earn points all lesson. One smartboard. Built from the Unit 3 lesson shell. */
(function () {
  'use strict';
  var D = window.U4G4Data, A = window.ForestAudio;
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
  var ART = { '🏀': 'o_basketball', '🎻': 'o_orchestra', '⚽': 'o_football', '🤝': 'o_team_hands', '🏆': 'o_league' };
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
    var host = $('stage'), em = ['⭐', '🎉', '🌟', '✨', '🏀', '🏆'], k, w = h('div', { class: 'confetti' });
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

  function l2Words(c, words) {
    var WL = words || D.words, body = c.body, clueI = -1;
    var grid = h('div', { class: 'vgrid' + (WL.length > 5 ? ' six' : '') }), box = h('div', { class: 'msg' }), gap = h('div', { class: 'gapbox' });
    WL.forEach(function (w) {
      var card = h('button', { type: 'button', class: 'btn vcard' }, [fill(h('span', { class: 'em' }), w.e, '', w.a), h('b', { text: w.w })]);
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

  function teamName(i) { return D.teams[i].e + ' ' + D.teams[i].n; }
  function gameFinish(c, host, onAgain) {
    host.innerHTML = '';
    if (hasArt('w_trophy')) host.appendChild(h('div', { class: 'trophy' }, [art('w_trophy')]));
    podium(host); sfx('win'); confetti();
    host.appendChild(h('div', { class: 'row', style: 'justify-content:center' }, [btn('🔁 Play again', 'green big', onAgain), btn('🎉 Celebrate!', 'amber', function () { sfx('win'); confetti(); })]));
  }

  /* ============================== Unit 4 Grade 4: We Can Do It ============================== */
  function bgOf(el, name) { if (el && hasArt(name)) el.style.background = 'url(art/' + name + '.webp) center / cover'; }

  /* 1. Hook */
  function hook(c) {
    hookPrompts(c, [{ e: '🏀', n: 'o_basketball' }, { e: '🎻', n: 'o_orchestra' }, { e: '⚽', n: 'o_football' }], D.l1hook, D.l1missions, '');
    bgOf(c.body.querySelector('.hook-stage'), 'bg_team_stage');
  }

  /* 2. Think, Pair, Share */
  function thinkPairShare(c) {
    var body = c.body, cur = -1, shown = 0;
    var scene = h('div', { class: 'bigscene' }), panel = h('div', { class: 'marketpanel' }, [scene]);
    bgOf(panel, 'bg_team_stage'); body.appendChild(panel); fill(scene, '🤝', '', 'o_team_hands');
    var bubble = h('div', { class: 'bubble left' }), step = h('div', { class: 'msg gmsg', text: D.tpsLines[0] });
    bubble.innerHTML = '<small>👀 Look at the team</small>Tap a team!';
    function show(i) {
      cur = i; var t = D.team[i]; scene.innerHTML = ''; fill(scene, t.e, '', t.a);
      var s = t.who + ' ' + t.ing + '.'; bubble.innerHTML = '<small>👀 Look at the team</small>' + s; A.speak(s); sfx('tap');
      bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop');
    }
    var chips = h('div', { class: 'row' }, [h('span', { class: 'lab', text: '👥 Teams:' })].concat(D.team.map(function (t, i) { return h('button', { type: 'button', class: 'chip2', text: t.e + ' ' + t.who.replace('The ', ''), onclick: function () { show(i); } }); })));
    var tm = timerBtn(c, 10);
    var nb = btn('Think ▶ Pair ▶ Share', 'violet big', function () {
      shown = (shown + 1) % 3; var l = D.tpsLines[shown]; step.textContent = l; A.speak(l.replace(/[“”]/g, '')); sfx('page');
    });
    body.appendChild(h('div', { class: 'row' }, [nb, tm, btn('🔊 Model it', 'small amber', function () { A.speakSeq(['The dancers are moving with the music.', 'The musicians are playing it.', 'We think everyone is listening to one another.']); })]));
    body.appendChild(step); body.appendChild(h('div', { class: 'dialog' }, [bubble])); body.appendChild(chips); body.appendChild(pointsRow());
    show(0);
  }

  /* 3. Vocabulary: l2Words (league, court, basket, score, shooting) */
  function vocab(c) { l2Words(c, D.words); }

  /* 4. The Sparks story told in parts */
  function sparksStory(c) {
    var scene = h('div', { class: 'bigscene' }), panel = h('div', { class: 'marketpanel tall' }, [scene]);
    bgOf(panel, 'bg_court'); c.body.appendChild(panel); fill(scene, '🏀', '', 'o_basketball');
    runStory(c, D.sparks, function (ch, predicting) {
      scene.innerHTML = '';
      if (!ch) { fill(scene, '🏆', '', 'o_league'); return; }
      fill(scene, predicting ? '🤔' : ch.scene, '', predicting ? null : ch.art);
    }, 'Listen to a true story about a basketball team. Do the actions with me!', 'Well done! Teams win and lose together.');
  }

  /* 5. GAME: True or False Court */
  function tfGame(c) {
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    function start() {
      host.innerHTML = '';
      var ROUNDS = 8, round = 0, turn = 0, deck = shuffle(D.tf), cur = null, revealed = false;
      var banner = h('div', { class: 'gturn' }), card = h('div', { class: 'reqcard' }), msg = h('div', { class: 'msg gmsg', text: '' });
      var zones = h('div', { class: 'zones' }, [h('div', { class: 'zone', style: '--c:#22c55e', text: '✅ TRUE: run to the green side' }), h('div', { class: 'zone', style: '--c:#ef4444', text: '❌ FALSE: run to the red side' })]);
      zones.style.gridTemplateColumns = 'repeat(2, 1fr)';
      function draw() {
        if (round >= ROUNDS) { gameFinish(c, host, start); return; }
        cur = deck[round % deck.length]; revealed = false; var t = D.teams[turn];
        [].forEach.call(zones.children, function (z) { z.classList.remove('hit'); });
        banner.style.setProperty('--c', t.c); banner.innerHTML = ''; banner.appendChild(h('span', { class: 'tn', text: t.e + ' ' + t.n + '’ turn' })); banner.appendChild(h('span', { class: 'gb', text: '🏟️ Statement ' + (round + 1) + ' of ' + ROUNDS }));
        card.innerHTML = ''; card.appendChild(fill(h('div', { class: 'rq-e' }), cur.e)); card.appendChild(h('div', { class: 'rq-t', text: cur.s }));
        card.appendChild(h('div', { class: 'rq-a', text: 'The whole team stands on the side they think is right!' }));
        msg.textContent = ''; A.speak(cur.s);
      }
      function next(pts) {
        if (pts > 0) { addPoint(turn, pts); sfx('correct'); if (pts === 2) confetti(); } else sfx('tap');
        round++; turn = (turn + 1) % D.teams.length; draw();
      }
      var show = btn('👀 Show the answer', 'amber', function () {
        if (revealed) return; revealed = true; zones.children[cur.a ? 0 : 1].classList.add('hit');
        msg.textContent = (cur.a ? '✅ TRUE. ' : '❌ FALSE. ') + cur.fix; A.speak((cur.a ? 'True. ' : 'False. ') + cur.fix); sfx('page');
      });
      host.appendChild(h('div', { class: 'row' }, [timerBtn(c, 15), show, btn('✅ Team is right (+2)', 'green', function () { next(2); }), btn('👍 Fixed it nicely (+1)', 'violet', function () { next(1); }), btn('⏭ Skip', 'small ghost', function () { next(0); })]));
      host.appendChild(banner); host.appendChild(card); host.appendChild(zones); host.appendChild(msg);
      draw();
    }
    start();
  }

  /* 6. GAME: Order the Events (first, then, after that, finally) */
  function orderGame(c) {
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    function start() {
      host.innerHTML = '';
      var round = 0, turn = 0, placed = 0, ROUNDS = D.order.length, set = null, tiles = [];
      var banner = h('div', { class: 'gturn' }), title = h('div', { class: 'prompt' }), list = h('div', { class: 'scr' }), line = h('div', { class: 'msg gmsg', text: '' });
      var rowDone = h('div', { class: 'reqcard' });
      function draw() {
        if (round >= ROUNDS) { gameFinish(c, host, start); return; }
        set = D.order[round]; placed = 0; var t = D.teams[turn];
        banner.style.setProperty('--c', t.c); banner.innerHTML = ''; banner.appendChild(h('span', { class: 'tn', text: t.e + ' ' + t.n + '’ turn' })); banner.appendChild(h('span', { class: 'gb', text: set.e + ' Story ' + (round + 1) + ' of ' + ROUNDS }));
        title.textContent = 'Tap the sentences in the right order: ' + set.title; line.textContent = ''; rowDone.innerHTML = '';
        list.innerHTML = '';
        shuffle(set.steps.map(function (s, k) { return { s: s, k: k }; })).forEach(function (o) {
          var tile = h('button', { type: 'button', class: 'btn tile2 chip2', text: o.s, onclick: function () { pick(tile, o); } }); list.appendChild(tile);
        });
      }
      function pick(tile, o) {
        if (o.k !== placed) { tile.classList.remove('wobble'); void tile.offsetWidth; tile.classList.add('wobble'); sfx('tap'); line.textContent = 'Almost! Look again. What happens ' + D.orderWords[placed].toLowerCase().replace(',', '') + '?'; A.speak('Try again.'); return; }
        var text = D.orderWords[placed] + ' ' + o.s.charAt(0).toLowerCase() + o.s.slice(1);
        rowDone.appendChild(h('div', { class: 'rq-t', text: placed + 1 + '. ' + text })); tile.style.display = 'none'; A.speak(text); sfx('correct'); placed++;
        if (placed >= set.steps.length) { addPoint(turn, 3); confetti(); line.textContent = '⭐ +3 points for ' + D.teams[turn].n + '! Now retell it with your partner.'; sfx('win'); round++; turn = (turn + 1) % D.teams.length; setTimeout(function () { nb.style.display = ''; }, 200); nb.style.display = ''; }
      }
      var nb = btn('Next story ▶', 'green big', function () { nb.style.display = 'none'; draw(); }); nb.style.display = 'none';
      host.appendChild(h('div', { class: 'row' }, [timerBtn(c, 45), nb]));
      host.appendChild(banner); host.appendChild(title); host.appendChild(list); host.appendChild(rowDone); host.appendChild(line);
      host.appendChild(h('div', { class: 'row' }, D.orderWords.map(function (w) { return h('button', { type: 'button', class: 'chip2', text: w, onclick: function () { A.speak(w.replace(',', '')); } }); })));
      draw();
    }
    start();
  }

  /* 7. Wrap-up */
  function wrap(c) { wrapStart(c, 1, '🏆', 'Team Players!'); }

  var MODES = { game: '🎮 Game', think: '🤔 Think', listen: '👂 Listen', act: '🎭 Act it out', move: '🚶 Move', talk: '🗣️ Talk', race: '🏆 Team race' };
  var LESSONS = {
    1: { title: 'Team Players', missions: D.l1missions, door: '🚪 Door pass: tell me one sentence: "I am on a team and I …" or one new word (league, court, basket, score, shooting).', scenes: [
      { t: 'Team Week Starts!', mins: '3 min', mode: 'think', run: hook, intro: 'Welcome to Unit 4! Look at the pictures. Do you see a team?',
        kids: { steps: ['👀 Look at the three pictures', '🤔 Whisper to your partner: what is a team?', '✋ Tell the class one team you know'], say: ['A team is …', 'I know a team: …'] },
        tip: ['Book link: Unit 4 "We Can Do It" opener, p. 56.', 'Press the button for each question and accept one word or a sentence. Pupils may answer in Turkish first, then repeat in English. Show the five missions at the end.'] },
      { t: 'Think, Pair, Share', mins: '7 min', mode: 'talk', run: thinkPairShare, intro: 'Look at each team. How are they working together? Think, tell a partner, share.',
        kids: { steps: ['🧠 THINK: look at the team (10 seconds)', '🤝 PAIR: tell your partner', '🗣️ SHARE: tell the class'], say: ['The dancers are moving with the music.', 'The musicians are playing it.', 'We think everyone is listening to one another.'] },
        tip: ['Book link: Think, Pair, Share, p. 57 (A-D).', 'Tap a team to hear the model sentence. Use the 10 second timer for THINK. Frames from the book: "The dancers are moving with the music." and "We think everyone is listening to one another." Pupils make their own sentence with another team.'] },
      { t: 'Sports Words', mins: '5 min', mode: 'listen', run: vocab, intro: 'Five new words for our reading: league, court, basket, score, shooting.',
        kids: { steps: ['👆 Tap a card and listen', '🗣️ Say the word and the sentence', '🎲 Clue game: which word is missing?'], say: ['league', 'court', 'basket', 'score', 'shooting'] },
        tip: ['Book link: Words in Context, p. 58-59 (league, court, basket, score, shooting).', 'Tap each card: the board says the word, the meaning and a sentence. Then play the clue game: read the sentence with a gap and let pupils guess; press again to show the word.'] },
      { t: 'The Sparks Story', mins: '6 min', mode: 'act', run: sparksStory, intro: 'Listen to a true story about a basketball team. Do the actions with me!',
        kids: { steps: ['👂 Listen to each part', '🙌 Do the action', '🤔 Guess before the big moment'], say: ['The Sparks are losing.', 'She scores three points!'] },
        tip: ['Book link: "Teamwork Makes the Dream Work", p. 58-59. This is an oral preview in very simple words; the book text is read in lesson 2.', 'Press the green button for each part. At the 🤔 part let pupils predict with their partner before you reveal.'] },
      { t: 'GAME: True or False Court', mins: '7 min', mode: 'game', run: tfGame, intro: 'Teams take turns. Is the sentence TRUE or FALSE? Run to the right side!',
        kids: { steps: ['👂 Listen to the sentence', '🏃 The team stands on TRUE or FALSE', '✏️ If it is false, say the right sentence'], say: ['That is true.', 'That is false. The answer is …'] },
        tip: ['Book link: Explore the Reading, True or False, p. 60 A.', 'Put a green sign on one side of the room and a red sign on the other. Read the statement, start the 15 second timer, the team stands on a side, then press Show the answer. Right = 2 points; if they say a good corrected sentence press +1.'] },
      { t: 'GAME: Put It in Order', mins: '5 min', mode: 'game', run: orderGame, intro: 'Tap the sentences in the right order. Use: first, then, after that, finally.',
        kids: { steps: ['👀 Read the four sentences', '👆 Tap them in the right order', '🗣️ Retell with: First, … Then, …'], say: ['First, the players come on the court.', 'Then, they pass the ball.', 'After that, …', 'Finally, …'] },
        tip: ['Book link: Understanding the Sequence of Events, p. 61.', 'A wrong tap wobbles softly: no points are lost. When a team finishes, the whole class retells the story with First, Then, After that, Finally.'] },
      { t: 'Team Players!', mins: '2 min', mode: 'think', run: wrap, intro: 'You are great team players!',
        kids: { steps: ['🏆 Cheer for every team', '🚪 Door pass: one sentence for the teacher'], say: ['I am on a team and I …', 'Teamwork makes the dream work!'] },
        tip: ['Show the scores and cheer for everyone. At the door each pupil says "I am on a team and I …" (book p. 71 C) or one of the new words. Quick check for you.'] }
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
    $('h-title').firstChild.nodeValue = L.title;
    drawSteps(); sfx('page');
    try { s.run(ctxFor(main)); } catch (e) { main.appendChild(h('div', { class: 'msg soft', text: 'Oops, this activity could not start.' })); if (window.console) console.error(e); }
    try { history.replaceState(null, '', '?scene=' + (idx + 1)); } catch (e) { /* ignore */ }
  }
  function tipHtml() {
    var s = LESSONS[state.lesson].scenes[state.idx], t = $('tip'); t.innerHTML = '';
    t.appendChild(h('h4', { text: '🎓 ' + s.t + '  •  ' + s.mins }));
    s.tip.forEach(function (x, k) { t.appendChild(h('p', { text: (k + 1) + '. ' + x })); });
  }
  $('back').addEventListener('click', function () { if (state.idx > 0) go(state.lesson, state.idx - 1); });
  $('next').addEventListener('click', function () { if (state.idx < LESSONS[state.lesson].scenes.length - 1) go(state.lesson, state.idx + 1); });
  $('tipbtn').addEventListener('click', function () { var t = $('tip'); if (t.hidden) { tipHtml(); t.hidden = false; } else t.hidden = true; });
  $('snd').addEventListener('click', function () { A.setOn(!A.isOn()); $('snd').textContent = A.isOn() ? '🔊' : '🔇'; });
  $('fs').addEventListener('click', function () { try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } catch (e) { /* ignore */ } });
  document.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') $('next').click(); else if (e.key === 'ArrowLeft') $('back').click(); });

  var q = {}; (location.search || '').replace(/^\?/, '').split('&').forEach(function (p) { var kv = p.split('='); if (kv[0]) q[kv[0]] = decodeURIComponent(kv[1] || ''); });
  var s0 = Math.max(0, Math.min(LESSONS[1].scenes.length - 1, (parseInt(q.scene, 10) || 1) - 1));
  window.W4Lessons = { state: state, go: go, LESSONS: LESSONS };
  loadManifest(function () { drawTeams(); go(1, s0); });
})();
