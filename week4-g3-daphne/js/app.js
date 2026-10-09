/* Week 4 Grade 3: Daphne the School Detective: one teacher-led smartboard lesson (35 minutes). The board is the stage, timer and scoreboard.
   The children move, act, talk and play. Four teams earn points all lesson. One smartboard. Built from the Unit 3 lesson shell. */
(function () {
  'use strict';
  var D = window.W4G3Data, A = window.ForestAudio;
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
  var ART = { '🕵️': 'c_daphne', '👔': 'c_mr_blue', '🧒': 'c_leo' };
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
    var host = $('stage'), em = ['⭐', '🎉', '🌟', '✨', '🎈', '🏆'], k, w = h('div', { class: 'confetti' });
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

  /* ============================== Daphne the School Detective ============================== */
  function bgOf(el, name) { if (el && hasArt(name)) el.style.background = 'url(art/' + name + '.webp) center / cover'; }
  function picSpan(o, cls) { return fill(h('span', { class: cls || 'pe' }), o.e || '', '', o.a); }

  /* 1. Hook: Daphne lost her notebook */
  function hook(c) {
    hookPrompts(c, [{ e: '🕵️', n: 'c_daphne' }], D.hookPrompts, D.missions, '');
    bgOf(c.body.querySelector('.hook-stage'), 'bg_school_front');
  }

  /* 3. School map: tap a room to hear it; tap a person, then a room to place them */
  function schoolMap(c) {
    var body = c.body, sel = null, where = {};
    var grid = h('div', { class: 'rooms' }), strip = h('div', { class: 'people' }), msg = h('div', { class: 'msg gmsg', text: 'Tap a room to hear it. Tap a person, then a room: where are they?' });
    var roomEls = {}, chipEls = [];
    function the(r) { return r.prep + ' the ' + r.n; }
    function place(p, r) {
      if (where[p.n] && roomEls[where[p.n]]) { var old = roomEls[where[p.n]].querySelector('[data-p="' + p.n + '"]'); if (old) old.remove(); }
      where[p.n] = r.k;
      var mini = picSpan(p, 'mini'); mini.setAttribute('data-p', p.n); roomEls[r.k].querySelector('.inroom').appendChild(mini);
      var s1 = 'Where is ' + p.n + '?', s2 = p.who + '’s ' + the(r) + '.';
      msg.textContent = s1 + '  ' + s2; A.speakSeq([s1, s2]); sfx('correct');
    }
    D.rooms.forEach(function (r) {
      var b = h('button', { type: 'button', class: 'btn room' }, [picSpan(r, 're'), h('b', { text: r.n }), h('div', { class: 'inroom' })]);
      b.addEventListener('click', function () {
        if (sel) { place(sel, r); chipEls.forEach(function (x) { x.classList.remove('sel'); }); sel = null; }
        else { msg.textContent = 'This is the ' + r.n + '.'; A.speak('This is the ' + r.n + '.'); sfx('tap'); }
      });
      roomEls[r.k] = b; grid.appendChild(b);
    });
    D.mapPeople.forEach(function (p) {
      var b = h('button', { type: 'button', class: 'btn pchip' }, [picSpan(p, 'pe'), h('small', { text: p.n })]);
      b.addEventListener('click', function () { sel = p; chipEls.forEach(function (x) { x.classList.remove('sel'); }); b.classList.add('sel'); msg.textContent = 'Where is ' + p.n + '? Tap a room!'; A.speak('Where is ' + p.n + '?'); sfx('tap'); });
      chipEls.push(b); strip.appendChild(b);
    });
    body.appendChild(h('div', { class: 'row' }, [btn('🔊 Model it', 'small amber', function () { A.speakSeq(['Where is Daphne?', 'She’s in the library.']); }), btn('↺ Reset the map', 'small ghost', function () { where = {}; [].forEach.call(grid.querySelectorAll('.mini'), function (m) { m.remove(); }); sel = null; chipEls.forEach(function (x) { x.classList.remove('sel'); }); msg.textContent = 'The map is empty. Place the people again!'; })]));
    body.appendChild(strip); body.appendChild(grid); body.appendChild(msg);
    body.appendChild(h('div', { class: 'row' }, ['Where is Daphne?', 'She’s in the library.', 'He’s in the gym.'].map(function (s) { return h('button', { type: 'button', class: 'chip2', text: s, onclick: function () { A.speak(s); } }); })));
    body.appendChild(pointsRow());
  }

  /* 4. GAME: Where is Daphne? Hide and seek. */
  function hideSeek(c) {
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    function start() {
      host.innerHTML = '';
      var ROUNDS = 4, round = 0, turn = 0, hidden = null, found = false, tries = 0, startTurn = 0;
      var banner = h('div', { class: 'gturn' }), msg = h('div', { class: 'msg gmsg', text: '' }), grid = h('div', { class: 'rooms' }), els = {};
      function paint() { var t = D.teams[turn]; banner.style.setProperty('--c', t.c); banner.innerHTML = ''; banner.appendChild(h('span', { class: 'tn', text: t.e + ' ' + t.n + '’ turn' })); banner.appendChild(h('span', { class: 'gb', text: '🔍 Round ' + (round + 1) + ' of ' + ROUNDS })); }
      var nxt = btn('Next round ▶', 'green big', function () {
        nxt.style.display = 'none'; round++;
        if (round >= ROUNDS) { gameFinish(c, host, start); return; }
        startTurn = (startTurn + 1) % D.teams.length; turn = startTurn; newRound();
      });
      function newRound() {
        hidden = D.rooms[Math.floor(Math.random() * D.rooms.length)].k; found = false; tries = 0;
        D.rooms.forEach(function (r) { var b = els[r.k]; b.classList.remove('empty', 'found'); b.disabled = false; var d = b.querySelector('.inroom'); d.innerHTML = ''; });
        msg.textContent = 'Daphne is hiding! Ask: Is she in the …?'; paint(); nxt.style.display = 'none'; A.speak('Daphne is hiding!');
      }
      D.rooms.forEach(function (r) {
        var b = h('button', { type: 'button', class: 'btn room' }, [picSpan(r, 're'), h('b', { text: r.n }), h('div', { class: 'inroom' })]);
        b.addEventListener('click', function () {
          if (found || b.classList.contains('empty')) return;
          tries++; var q = 'Is she ' + r.prep + ' the ' + r.n + '?';
          if (r.k === hidden) {
            found = true; b.classList.add('found'); b.querySelector('.inroom').appendChild(picSpan({ e: '🕵️', a: 'c_daphne' }, 'mini big'));
            var pts = tries <= 2 ? 3 : 2; addPoint(turn, pts); msg.textContent = q + ' Yes, she is! +' + pts + ' points for ' + D.teams[turn].n + '!'; A.speakSeq([q, 'Yes, she is!']); sfx('win'); confetti();
            nxt.textContent = round + 1 >= ROUNDS ? '🏆 See the winner' : 'Next round ▶'; nxt.style.display = 'inline-flex';
          } else {
            b.classList.add('empty'); b.disabled = true; sfx('tap'); turn = (turn + 1) % D.teams.length; paint();
            msg.textContent = q + ' No, she is not. ' + D.teams[turn].n + ', your turn!'; A.speakSeq([q, 'No, she isn’t.']);
          }
        });
        els[r.k] = b; grid.appendChild(b);
      });
      host.appendChild(banner);
      host.appendChild(h('div', { class: 'row' }, [h('span', { class: 'lab', text: 'A team asks "Is she in the …?" and a pupil taps the room. Right = 3 points (2 after more tries).' })]));
      host.appendChild(grid); host.appendChild(msg); host.appendChild(h('div', { class: 'row' }, [nxt]));
      newRound();
    }
    start();
  }

  /* 5. Is there ...? How many ...? */
  function thereScene(c) {
    var body = c.body, i = 0, shown = false;
    var pics = h('div', { class: 'therepics' }), qEl = h('div', { class: 'thereq' }), aEl = h('div', { class: 'msg gmsg', text: '' });
    function draw() {
      shown = false; var it = D.there[i]; pics.innerHTML = '';
      it.pics.forEach(function (p) { pics.appendChild(picSpan(p, 'tp')); });
      qEl.textContent = it.q; aEl.textContent = 'Ask your partner. Answer with: ' + (it.q.indexOf('How many') === 0 ? 'There are … / There is one …' : 'Yes, there is. / No, there is not.');
      A.speak(it.q); sfx('page');
    }
    var show = btn('👀 Show the answer', 'amber', function () { if (shown) return; shown = true; var it = D.there[i]; aEl.textContent = '✔ ' + it.a; A.speak(it.a); sfx('correct'); });
    var nxt = btn('Next ▶', 'green', function () { if (i >= D.there.length - 1) { sfx('win'); confetti(); aEl.textContent = '🏁 Great! Now you can find the notebook!'; return; } i++; draw(); });
    body.appendChild(h('div', { class: 'row' }, [timerBtn(c, 30), show, nxt, btn('🔊 Ask again', 'small ghost', function () { A.speak(D.there[i].q); })]));
    body.appendChild(h('div', { class: 'therebox' }, [pics, qEl])); body.appendChild(aEl);
    body.appendChild(h('div', { class: 'row' }, D.thereChips.map(function (s) { return h('button', { type: 'button', class: 'chip2', text: s, onclick: function () { A.speak(s.replace(/…/g, '')); } }); })));
    body.appendChild(pointsRow()); draw();
  }

  /* 6. GAME: School Detective. Read the clue, choose the picture. */
  function detective(c) {
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    function start() {
      host.innerHTML = '';
      var N = D.detective.length, i = 0, turn = 0, tries = 0, answered = false;
      var qbox = h('div', { class: 'qbox' }), opts = h('div', { class: 'qopts four' }), msg = h('div', { class: 'msg gmsg', text: '' });
      var nxt = btn('Next clue ▶', 'green big', function () { nxt.style.display = 'none'; msg.textContent = ''; ask(); });
      function ask() {
        if (i >= N) { gameFinish(c, host, start); return; }
        var q = D.detective[i]; answered = false; qbox.innerHTML = ''; opts.innerHTML = ''; nxt.style.display = 'none';
        qbox.appendChild(h('div', { class: 'qteam', style: '--c:' + D.teams[turn].c, text: teamName(turn) + (tries ? ', your chance to steal!' : ', your clue!') + '   (clue ' + (i + 1) + ' of ' + N + ')' }));
        qbox.appendChild(h('div', { class: 'qtext', text: '🔍 ' + q.clue })); A.speak(q.clue); qbox.appendChild(sayBtn(q.clue, 'Read it'));
        shuffle(q.o.map(function (o, k) { return { o: o, k: k }; })).forEach(function (x) {
          var b = h('button', { type: 'button', class: 'btn qopt picopt' }, [picSpan(x.o, 'pe'), h('b', { text: x.o.n })]);
          b.addEventListener('click', function () {
            if (answered) return;
            if (x.k === q.a) {
              answered = true; b.classList.add('right'); addPoint(turn, tries ? 1 : 2); sfx('correct'); msg.textContent = '✔ ' + q.say + ' (+' + (tries ? 1 : 2) + ' points)'; A.speak(q.say);
              i++; tries = 0; turn = (turn + 1) % D.teams.length; nxt.textContent = i >= N ? '🏆 See the winner' : 'Next clue ▶'; nxt.style.display = 'inline-flex';
            } else if (!tries) {
              b.classList.add('wrong'); b.disabled = true; tries = 1; sfx('tap'); turn = (turn + 1) % D.teams.length; msg.textContent = 'Not this time. The next team can steal it!'; A.speak('Not this time. Next team!');
              setTimeout(ask, 1300);
            } else {
              answered = true; b.classList.add('wrong'); sfx('tap'); msg.textContent = 'Nobody got it. ' + q.say; A.speak(q.say);
              i++; tries = 0; nxt.textContent = i >= N ? '🏆 See the winner' : 'Next clue ▶'; nxt.style.display = 'inline-flex';
            }
          });
          opts.appendChild(b);
        });
      }
      host.appendChild(h('div', { class: 'row' }, [h('span', { class: 'lab', text: 'Right answer: 2 points (1 if you steal). Wrong: the next team can steal.' })]));
      host.appendChild(qbox); host.appendChild(opts); host.appendChild(h('div', { class: 'row' }, [nxt, msg]));
      ask();
    }
    start();
  }

  /* 7. Wrap: the surprise party */
  function party(c) {
    var body = c.body, panel = h('div', { class: 'marketpanel tall partypanel' });
    if (hasArt('s_found_party')) bgOf(panel, 's_found_party'); else panel.appendChild(fill(h('div', { class: 'bigscene' }), '🎉'));
    body.appendChild(panel);
    var say = 'Surprise! The notebook is in the office. Thank you, friends!';
    body.appendChild(h('div', { class: 'msg gmsg', text: say }));
    body.appendChild(h('div', { class: 'row', style: 'justify-content:center' }, [sayBtn(say, 'Hear it'), btn('🏆 See the scores', 'green big', function () { wrapScreen(c, 1); })]));
    sfx('win'); confetti(); A.speak(say);
  }

  var MODES = { game: '🎮 Game', think: '🤔 Think', listen: '👂 Listen', act: '🎭 Act it out', move: '🚶 Move', talk: '🗣️ Talk', detect: '🔍 Detective', explore: '🗺️ Explore' };
  var LESSONS = {
    1: { title: 'Daphne the School Detective', missions: D.missions, door: '🚪 Door pass: say ONE sentence about a person or a place at school!', scenes: [
      { t: 'Daphne’s Lost Notebook', mins: '3 min', mode: 'think', run: hook, intro: 'Hello! This is Daphne. She lost her red notebook. Can you help?',
        kids: { steps: ['👋 Say hello to Daphne', '🤔 Whisper to your partner: where is the notebook?', '✋ Tell the class'], say: ['Hello, Daphne!', 'I’m good, thanks!'] },
        tip: ['Book link: greetings and introductions at school, p. ___ (How are you? I\'m good, thanks! Good afternoon!).', 'Press the button for each prompt. Pupils answer "I\'m good, thanks!". Show the five missions at the end.', 'Greet pupils at the door with the same chunks next lessons.'] },
      { t: 'People at School', mins: '6 min', mode: 'detect', run: function (c) { l2Words(c, D.people); }, intro: 'Five people at school. Who are they? Tap a card.',
        kids: { steps: ['👀 Look at the picture', '🗣️ Say the word after the teacher', '🙌 Do the action'], say: ['Who’s this?', 'This is Mr. Blue.', 'She is the librarian.'] },
        tip: ['Book link: people at school, p. ___ (a classmate, a librarian, a school nurse, a headteacher, a caretaker). Who\'s this? This is Mr. Blue.', 'Tap a card: the board says the word and a sentence. Add an action: librarian reads, nurse helps, caretaker sweeps, headteacher points.', 'Press Clue game: pupils say the missing word. Support: say only the word. Stretch: "Who\'s this? This is …".'] },
      { t: 'School Map', mins: '6 min', mode: 'explore', run: schoolMap, intro: 'Eight places at school. Tap a person, then tap a room. Where are they?',
        kids: { steps: ['🏫 Tap a room: listen to the name', '🕵️ Tap a person, then a room', '🗣️ Say: Where is …? She’s in …'], say: ['Where is Daphne?', 'She’s in the library.', 'He’s in the gym.'] },
        tip: ['Book link: places at school, p. ___ (an art room, a music room, a meeting room, an office, a sports field, a corridor, a gym) and Where is Daphne? She\'s in the library.', 'Tap a room to hear the name. Tap a person and then a room to place them. Pupils say the sentence in chorus. Use the points row for good speaking.', 'Note: sports field is "on the sports field". Support: whisper first. Stretch: pupils ask each other.'] },
      { t: 'GAME: Where Is Daphne?', mins: '6 min', mode: 'game', run: hideSeek, intro: 'Daphne is hiding in a room! Ask: Is she in the …?',
        kids: { steps: ['🗣️ Ask: Is she in the gym?', '👆 A pupil taps the room', '👂 Listen: Yes, she is! / No, she isn’t.'], say: ['Is she in the library?', 'Yes, she is!', 'No, she isn’t.'] },
        tip: ['Book link: places at school, p. ___; Where is Daphne? She\'s in the library.', 'Teams take turns. The team asks "Is she in the …?" and one pupil taps a room. Right = 3 points (2 after more tries). A wrong room goes grey and the next team plays. Four rounds, then the winner is shown.', 'Support: read the room names first. Stretch: ask in full: "Is she in the art room?"'] },
      { t: 'Is There …? How Many …?', mins: '5 min', mode: 'talk', run: thereScene, intro: 'Look at Daphne’s school. Ask and answer with your partner.',
        kids: { steps: ['👀 Look at the picture', '🗣️ Ask your partner the question', '✅ Answer: Yes, there is. / There are two.'], say: ['Is there a nurse at school?', 'Yes, there is.', 'How many caretakers are there?', 'There are two.'] },
        tip: ['Book link: There is / There are, p. ___ (Is there a nurse at school? Yes, there is. How many caretakers are there at school? There are two.).', 'Press Ask again to hear the question. Pairs answer, then press Show the answer. Use the timer to keep it quick.', 'Note: one = "There is one librarian"; two or more = "There are two caretakers". Support: say only yes / no or the number. Stretch: ask your own question about your school.'] },
      { t: 'GAME: School Detective', mins: '7 min', mode: 'game', run: detective, intro: 'Read the clue. Which picture is the answer?',
        kids: { steps: ['👂 Listen to the clue', '🗣️ Talk with your team', '👆 Tap the right picture'], say: ['She is the librarian.', 'We are in the music room.', 'He is the caretaker.'] },
        tip: ['Book link: people and places at school, p. ___.', 'Teams take turns. The team talks for 10 seconds, then one pupil taps. Right = 2 points. Wrong = the next team can steal for 1 point. Eight clues, then the winner is shown.', 'Support: the clue is read aloud by the board. Stretch: pupils say the full sentence before they tap.'] },
      { t: 'Surprise Party!', mins: '2 min', mode: 'think', run: party, intro: 'Daphne found her notebook, and there is a surprise!',
        kids: { steps: ['🏆 Cheer for every team', '🚪 Door pass: one sentence about school'], say: ['This is the librarian.', 'Daphne is in the gym.'] },
        tip: ['Show the scores and cheer for everyone. At the door each pupil says one sentence: "This is the librarian." or "Daphne is in the gym." It is a quick check for you.'] }
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
