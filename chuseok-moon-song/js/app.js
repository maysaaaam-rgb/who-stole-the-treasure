/* Chuseok Moon Song (Grade 3): teacher-led smartboard lessons (35 minutes each). The board is the stage, timer and scoreboard.
   The children move, act, talk and play. Four teams earn points all lesson. One smartboard. Built from the Unit 3 lesson shell. */
(function () {
  'use strict';
  var D = window.MoonData, A = window.ForestAudio;
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
  var ART = { '🌕': 'o_moon', '🏮': 'o_lantern' };
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
    var host = $('stage'), em = ['⭐', '🎉', '🌕', '✨', '🏮', '🥟'], k, w = h('div', { class: 'confetti' });
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

  /* ============================== Chuseok Moon Song: facts, dance verbs, call and response, rhythm, team dance ============================== */
  function bgOf(el, name) { if (el && hasArt(name)) el.style.background = 'url(art/' + name + '.webp) center / cover'; }
  var MB = window.MoonBeat;
  var glow = 0, GOAL = 20, glowDone = false;
  function addGlow(n) {
    glow = Math.min(GOAL, glow + n);
    [].forEach.call(document.querySelectorAll('.casefill'), function (el) { el.style.width = (glow / GOAL * 100) + '%'; });
    [].forEach.call(document.querySelectorAll('.casetxt'), function (el) { el.textContent = '🌕 Moon glow: ' + glow + ' / ' + GOAL; });
    if (glow >= GOAL && !glowDone) { glowDone = true; sfx('win'); confetti(); A.speak('The moon is shining bright! Happy Chuseok!'); }
  }
  function glowBar() {
    return h('div', { class: 'casebar' }, [h('span', { class: 'casetxt', text: '🌕 Moon glow: ' + glow + ' / ' + GOAL }), h('div', { class: 'casetrack' }, [h('i', { class: 'casefill', style: 'width:' + (glow / GOAL * 100) + '%' })])]);
  }
  function teamBanner(i, label) {
    var t = D.teams[i], b = h('div', { class: 'gturn' });
    b.style.setProperty('--c', t.c); b.appendChild(h('span', { class: 'tn', text: t.e + ' ' + t.n + '’ turn' })); b.appendChild(h('span', { class: 'gb', text: label }));
    return b;
  }
  function beatDots() {
    var box = h('div', { class: 'bdots' }, [0, 1, 2, 3].map(function (k) { return h('i', { text: k === 0 ? '🥁' : '•' }); }));
    box.set = function (b) { [].forEach.call(box.children, function (el, k) { el.classList.toggle('on', k === b); }); };
    return box;
  }
  function stopBeat(c) { c.later(function () { if (MB) MB.stop(); }); }
  /* the real song on YouTube (optional, needs the internet) */
  function watchBox() {
    var box = h('div', { class: 'watch' }), open = false;
    var b = btn('🎬 Watch the real song', 'violet', function () {
      open = !open; box.innerHTML = '';
      if (open) { box.appendChild(h('iframe', { src: 'https://www.youtube-nocookie.com/embed/' + D.video.id + '?rel=0', title: D.video.title, allow: 'accelerometer; autoplay; encrypted-media; picture-in-picture', allowfullscreen: 'true', loading: 'lazy' })); b.textContent = '✖ Close the video'; MB.stop(); }
      else b.textContent = '🎬 Watch the real song';
    });
    return h('div', {}, [h('div', { class: 'row' }, [b, h('span', { class: 'lab', text: 'Optional: needs the internet.' })]), box]);
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function cardSentence(k) { return k.v + (k.d ? ' ' + k.d : '') + (k.m ? ' ' + k.m : '') + '.'; }
  function bpmOf(k) { var m = D.manners.filter(function (x) { return x.w === k.m; })[0]; return m ? m.bpm : 84; }

  /* 1. Moon night opening */
  function moonOpen(c) {
    hookPrompts(c, [{ e: '🌕', n: 'o_moon' }, { e: '🏮', n: 'o_lantern' }], D.hook, D.missions, '');
    bgOf(c.body.querySelector('.hook-stage'), 'bg_moon_night'); c.body.appendChild(watchBox()); c.body.appendChild(glowBar());
  }

  /* 2. Chuseok facts: six things to learn, then a quick true/false walk */
  function factsScene(c) {
    var body = c.body, i = -1, shown = false, seen = {};
    var grid = h('div', { class: 'roles' }), big = h('div', { class: 'reqcard' }), msg = h('div', { class: 'msg gmsg', text: 'Tap a card to learn a Chuseok fact!' });
    big.appendChild(h('div', { class: 'rq-e', text: '🍂' })); big.appendChild(h('div', { class: 'rq-t', text: 'Chuseok is a Korean autumn festival.' }));
    D.facts.forEach(function (f, k) {
      grid.appendChild(h('button', { type: 'button', class: 'btn vcard', onclick: function () {
        big.innerHTML = ''; big.appendChild(h('div', { class: 'rq-e', text: f.e })); big.appendChild(h('div', { class: 'rq-t', text: f.t })); A.speak(f.t); sfx('page'); if (!seen[k]) { seen[k] = 1; addGlow(1); }
      } }, [h('span', { class: 'em', text: f.e }), h('b', { text: f.t.split(' ').slice(0, 3).join(' ') + '…' })]));
    });
    grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    var deck = shuffle(D.factQuiz), q = -1, card = h('div', { class: 'reqcard' }), zones = h('div', { class: 'zones' }, [h('div', { class: 'zone', style: '--c:#22c55e', text: '✅ TRUE' }), h('div', { class: 'zone', style: '--c:#ef4444', text: '❌ FALSE' })]);
    zones.style.gridTemplateColumns = 'repeat(2, 1fr)';
    function nextQ() { q = (q + 1) % deck.length; shown = false; [].forEach.call(zones.children, function (z) { z.classList.remove('hit'); }); card.innerHTML = ''; card.appendChild(h('div', { class: 'rq-e', text: '❓' })); card.appendChild(h('div', { class: 'rq-t', text: deck[q].s })); A.speak(deck[q].s); sfx('page'); }
    function reveal() { if (q < 0 || shown) return; shown = true; zones.children[deck[q].a ? 0 : 1].classList.add('hit'); msg.textContent = deck[q].fix; A.speak(deck[q].fix); sfx('correct'); }
    body.appendChild(h('div', { class: 'row' }, [h('span', { class: 'lab', text: '1️⃣ Learn the facts:' })])); body.appendChild(grid); body.appendChild(big);
    body.appendChild(h('div', { class: 'row' }, [h('span', { class: 'lab', text: '2️⃣ True or false? Walk to a side:' }), btn('❓ Next sentence', 'amber', nextQ), btn('💡 Answer', 'violet', reveal), btn('✅ Team right (+1 glow)', 'green', function () { addGlow(1); sfx('correct'); })]));
    body.appendChild(card); body.appendChild(zones); body.appendChild(msg); body.appendChild(pointsRow()); body.appendChild(glowBar());
  }

  /* 3. Dance verbs: learn eight moving words (l2Words) + do the action */
  function verbsScene(c) {
    l2Words(c, D.moves);
    var card = h('div', { class: 'reqcard' }), k = -1, order = shuffle(D.moves);
    card.appendChild(h('div', { class: 'rq-t', text: '💃 Do it! Everybody does the action when the card shows.' }));
    c.body.appendChild(h('div', { class: 'row' }, [btn('🎴 Do it!', 'violet big', function () { k = (k + 1) % order.length; var w = order[k]; card.innerHTML = ''; card.appendChild(h('div', { class: 'rq-e', text: w.e })); card.appendChild(h('div', { class: 'rq-t', text: cap(w.w) + '!' })); A.speak(cap(w.w) + '!'); sfx('page'); }), btn('✅ Everybody did it (+1 glow)', 'green', function () { addGlow(1); sfx('correct'); })]));
    c.body.appendChild(card); c.body.appendChild(glowBar());
  }

  /* 4. Learn the song: call and response with the drum */
  function callResponse(c) {
    stopBeat(c);
    var body = c.body, seq = [], idx = -1;
    D.calls.forEach(function (l) { seq.push({ who: 'leader', t: l }); seq.push({ who: 'group', t: D.refrain }); });
    var lead = h('div', { class: 'cr-card leader' }), grp = h('div', { class: 'cr-card group' }), dots = beatDots(), msg = h('div', { class: 'msg gmsg', text: 'The leader calls. The whole circle answers: Ganggangsullae!' });
    function paint(cur) {
      lead.innerHTML = '<small>🎤 LEADER calls</small><b>' + (cur && cur.who === 'leader' ? cur.t : '…') + '</b>'; grp.innerHTML = '<small>👥 CIRCLE answers</small><b>' + (cur && cur.who === 'group' ? cur.t : '…') + '</b>';
      lead.classList.toggle('on', !!cur && cur.who === 'leader'); grp.classList.toggle('on', !!cur && cur.who === 'group');
    }
    paint(null);
    var bpmTxt = h('span', { class: 'pill amber', text: '♩ ' + MB.getBpm() });
    function play() {
      idx = -1;
      MB.start(MB.getBpm(), function (b) {
        dots.set(b);
        if (b === 0) { idx++; if (idx >= seq.length) { MB.stop(); paint(null); msg.textContent = '🎉 Well sung! Do it again, louder!'; sfx('win'); addGlow(2); play.btn.textContent = '▶ Play again'; return; } var cur = seq[idx]; paint(cur); A.speak(cur.who === 'group' ? D.refrainSay : cur.t); }
      });
    }
    play.btn = btn('▶ Play with the beat', 'green big', function () { play.btn.textContent = '▶ Play again'; play(); });
    body.appendChild(h('div', { class: 'row' }, [play.btn, btn('⏹ Stop', 'small ghost', function () { MB.stop(); paint(null); }),
      btn('🐢 Slower', 'small', function () { MB.setBpm(MB.getBpm() - 8); bpmTxt.textContent = '♩ ' + MB.getBpm(); }), btn('🐇 Faster', 'small', function () { MB.setBpm(MB.getBpm() + 8); bpmTxt.textContent = '♩ ' + MB.getBpm(); }), bpmTxt]));
    body.appendChild(dots); body.appendChild(h('div', { class: 'cr' }, [lead, grp])); body.appendChild(msg);
    body.appendChild(h('div', { class: 'row' }, D.calls.map(function (s) { return h('button', { type: 'button', class: 'chip2', text: s, onclick: function () { A.speak(s); } }); })));
    body.appendChild(h('div', { class: 'row' }, [btn('✅ The class sang it (+2 glow)', 'green', function () { addGlow(2); sfx('correct'); }), pointsRow()])); body.appendChild(watchBox()); body.appendChild(glowBar());
  }

  /* 5. GAME: Move Like the Moon: a verb card + direction + SPEED. The drum really gets slower or faster. */
  function moveCards(c) {
    stopBeat(c);
    var body = c.body, deck = shuffle(D.cards), i = -1, auto = false, bars = 0, onTimer = null;
    var card = h('div', { class: 'reqcard' }), dots = beatDots(), msg = h('div', { class: 'msg gmsg', text: 'Stand in a circle. Do the move! Listen: the drum tells you the speed.' });
    c.later(function () { if (onTimer) clearTimeout(onTimer); });
    function show(k) {
      card.innerHTML = ''; card.appendChild(h('div', { class: 'rq-e', text: k.e }));
      card.appendChild(h('div', { class: 'rq-t', text: cardSentence(k) }));
      var m = D.manners.filter(function (x) { return x.w === k.m; })[0];
      card.appendChild(h('div', { class: 'rq-a', text: m ? m.e + ' ' + m.w + ': ' + (m.bpm < 80 ? 'slow drum' : m.bpm > 100 ? 'fast drum' : 'listen to the drum') : 'Move with the drum.' }));
      A.speak(cardSentence(k)); sfx('page'); MB.setBpm(bpmOf(k)); if (MB.isOn()) { MB.start(bpmOf(k), onBeat); }
    }
    function next() { i = (i + 1) % deck.length; show(deck[i]); }
    function onBeat(b) { dots.set(b); if (b === 0) { bars++; if (auto && bars % 3 === 0) next(); } }
    var go = btn('▶ Start the drum', 'green big', function () { auto = true; bars = 0; MB.start(MB.getBpm(), onBeat); go.textContent = '🔁 Restart'; if (i < 0) next(); });
    var legend = h('div', { class: 'row' }, [h('span', { class: 'lab', text: 'Speed words:' })].concat(D.manners.map(function (m) { return h('button', { type: 'button', class: 'chip2', text: m.e + ' ' + m.w, onclick: function () { A.speak(m.w); MB.setBpm(m.bpm); if (MB.isOn()) MB.start(m.bpm, onBeat); sfx('tap'); } }); })));
    body.appendChild(h('div', { class: 'row' }, [go, btn('⏭ Next move', 'amber', next), btn('⏹ Stop', 'small ghost', function () { auto = false; MB.stop(); }), btn('✅ Great circle (+2 glow)', 'violet', function () { addGlow(2); sfx('correct'); })]));
    body.appendChild(dots); body.appendChild(card); body.appendChild(legend); body.appendChild(msg); body.appendChild(pointsRow()); body.appendChild(glowBar());
    card.appendChild(h('div', { class: 'rq-e', text: '🌕' })); card.appendChild(h('div', { class: 'rq-t', text: 'Press Start. A new move comes every three bars!' }));
  }

  /* 6. GAME: Rhythm Echo: listen to the pattern, then copy it with your hands */
  function rhythmEcho(c) {
    stopBeat(c);
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    function start() {
      host.innerHTML = '';
      var pats = ['X.X.', 'XXX.', 'X.XX', 'XX..', 'XXXX', '.XX.'], ROUNDS = 6, round = 0, playing = false, timers = [];
      c.later(function () { timers.forEach(clearTimeout); });
      var banner = h('div'), boxes = h('div', { class: 'bdots' }), msg = h('div', { class: 'msg gmsg' });
      function paintBoxes(p, lit) { boxes.innerHTML = ''; p.split('').forEach(function (ch, k) { var b = h('i', { text: ch === 'X' ? '🥁' : '·' }); if (k === lit) b.classList.add('on'); boxes.appendChild(b); }); }
      function play() {
        if (round >= ROUNDS) { gameFinish(c, host, start); return; }
        if (playing) return; playing = true; var p = pats[round]; msg.textContent = '👂 Listen... then clap the same pattern!';
        var step = 520; p.split('').forEach(function (ch, k) { timers.push(setTimeout(function () { paintBoxes(p, k); if (ch === 'X') MB.hit(k === 0 ? 'dung' : 'deok'); }, 700 + k * step)); });
        timers.push(setTimeout(function () { paintBoxes(p, -1); msg.textContent = '👏 Your turn! Clap it!'; playing = false; }, 700 + p.length * step + 300));
      }
      function draw() { if (round >= ROUNDS) { gameFinish(c, host, start); return; } var nb = teamBanner(round % D.teams.length, '🥁 Pattern ' + (round + 1) + ' of ' + ROUNDS); banner.replaceWith(nb); banner = nb; paintBoxes(pats[round], -1); msg.textContent = 'Press Listen. The drum plays a pattern.'; }
      function done(pts) { if (pts) { addPoint(round % D.teams.length, pts); addGlow(pts); } round++; draw(); }
      banner = h('div'); host.appendChild(h('div', { class: 'row' }, [btn('👂 Listen', 'green big', play), btn('🔁 Again', 'amber', function () { playing = false; play(); }), btn('⭐ Perfect (+2)', 'violet', function () { done(2); }), btn('👍 Almost (+1)', 'small', function () { done(1); }), btn('⏭ Next', 'small ghost', function () { done(0); })]));
      host.appendChild(banner); host.appendChild(boxes); host.appendChild(msg); host.appendChild(glowBar()); draw();
    }
    start();
  }

  /* 7. GAME: Build Your Team Dance: choose 4 moves, say First, Then, Next, Finally, then dance it with the drum */
  var dances = {};
  function buildDance(c) {
    stopBeat(c);
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    function start() {
      host.innerHTML = ''; dances = {};
      var turn = 0, picks = [];
      var banner = h('div'), board = h('div', { class: 'reqcard' }), chips = h('div', { class: 'row' }), msg = h('div', { class: 'msg gmsg' }), dots = beatDots();
      function paint() {
        board.innerHTML = '';
        D.seqWords.forEach(function (w, k) { board.appendChild(h('div', { class: 'rq-t', text: w + ' ' + (picks[k] ? cardSentence(picks[k]).toLowerCase() : '…') })); });
      }
      function draw() {
        if (turn >= D.teams.length) { MB.stop(); gameFinish(c, host, start); return; }
        picks = []; var nb = teamBanner(turn, '💃 Dance ' + (turn + 1) + ' of ' + D.teams.length); banner.replaceWith(nb); banner = nb; paint(); msg.textContent = 'Choose 4 moves. Make your team dance!';
      }
      chips.appendChild(h('span', { class: 'lab', text: 'Moves:' }));
      D.cards.forEach(function (k) { chips.appendChild(h('button', { type: 'button', class: 'chip2', text: k.e + ' ' + cardSentence(k).replace('.', ''), onclick: function () { if (picks.length >= 4) { msg.textContent = 'Four moves is enough! Press Dance.'; sfx('tap'); return; } picks.push(k); paint(); A.speak(cardSentence(k)); sfx('tap'); } })); });
      var dance = btn('▶ Dance it with the drum', 'green big', function () {
        if (picks.length < 4) { msg.textContent = 'Choose 4 moves first!'; sfx('tap'); return; }
        var bar = -1; MB.start(bpmOf(picks[0]), function (b) {
          dots.set(b);
          if (b === 0) {
            bar++; if (bar < 4) { var k = picks[bar]; MB.setBpm(bpmOf(k)); var s = D.seqWords[bar] + ' ' + cardSentence(k).toLowerCase(); msg.textContent = '💃 ' + s; A.speak(s); }
            else if (bar === 4) { msg.textContent = '👥 Everyone: ' + D.refrain; A.speak(D.refrainSay); }
            else { MB.stop(); msg.textContent = '👏 What a dance! Rate it:'; }
          }
        });
      });
      function done(pts) { MB.stop(); if (pts) { addPoint(turn, pts); addGlow(pts); } if (picks.length) dances[turn] = picks.slice(); turn++; draw(); }
      banner = h('div');
      host.appendChild(h('div', { class: 'row' }, [timerBtn(c, 60), btn('🗑️ Clear', 'small ghost', function () { picks = []; paint(); }), dance, btn('⭐ Great (+2)', 'green', function () { done(2); }), btn('👍 Good (+1)', 'violet', function () { done(1); }), btn('⏭ Skip', 'small ghost', function () { done(0); })]));
      host.appendChild(banner); host.appendChild(board); host.appendChild(chips); host.appendChild(dots); host.appendChild(msg); host.appendChild(glowBar());
      draw();
    }
    start();
  }

  /* 8. Moon Concert: every team's dance, one after the other, each ends with the circle's answer */
  function moonConcert(c) {
    stopBeat(c);
    var body = c.body, dots = beatDots(), stage = h('div', { class: 'cr' }), msg = h('div', { class: 'msg gmsg', text: 'Each team dances its four moves. Everyone answers: Ganggangsullae!' });
    var defaults = [[0, 4, 7, 10], [1, 5, 6, 9], [2, 8, 3, 11], [4, 1, 7, 10]];
    var lines = D.teams.map(function (t, i) { var m = dances[i] || defaults[i % 4].map(function (k) { return D.cards[k]; }); return { t: t, m: m }; });
    var cards = lines.map(function (l) { return h('div', { class: 'cr-card', style: '--c:' + l.t.c }, [h('small', { text: l.t.e + ' ' + l.t.n }), h('b', { text: l.m.map(function (k) { return k.v; }).join(' · ') })]); });
    cards.forEach(function (x) { stage.appendChild(x); }); stage.style.gridTemplateColumns = 'repeat(2, 1fr)';
    var go = btn('🎶 Start the Moon Concert', 'green big', function () {
      var bar = -1; go.textContent = '🎶 Again'; cards.forEach(function (x) { x.classList.remove('on'); });
      MB.start(84, function (b) {
        dots.set(b);
        if (b === 0) {
          bar++; var team = Math.floor(bar / 5), pos = bar % 5;
          if (team >= lines.length) { MB.stop(); cards.forEach(function (x) { x.classList.remove('on'); }); msg.textContent = '🌕 What a night! Happy Chuseok!'; sfx('win'); confetti(); addGlow(4); return; }
          cards.forEach(function (x, k) { x.classList.toggle('on', k === team); });
          if (pos < 4) { var k = lines[team].m[pos], s = D.seqWords[pos] + ' ' + cardSentence(k).toLowerCase(); MB.setBpm(bpmOf(k)); msg.textContent = '🎤 ' + lines[team].t.n + ': ' + s; A.speak(s); }
          else { MB.setBpm(84); A.speak(D.refrainSay); msg.textContent = '👥 Everyone: ' + D.refrain; }
        }
      });
    });
    body.appendChild(h('div', { class: 'row' }, [go, btn('⏹ Stop', 'small ghost', function () { MB.stop(); }), btn('🎉 Cheer!', 'amber', function () { sfx('win'); confetti(); })]));
    body.appendChild(dots); body.appendChild(stage); body.appendChild(msg); body.appendChild(glowBar());
  }

  /* 9. Wrap + homework */
  function wrap(c) {
    wrapStart(c, 1, '🌕', glow >= GOAL ? 'The moon shines bright!' : 'Moon glow: ' + glow);
    var url = (location.href || '').replace(/chuseok-moon-song\/[^?#]*.*$/, '') + D.hwUrl;
    c.body.appendChild(h('div', { class: 'door', text: '🏠 Quick homework (5 minutes): open ' + D.hwUrl + ' on a phone. The link for the pupils: ' + url }));
  }

  var MODES = { game: '🎮 Game', think: '🤔 Think', listen: '👂 Listen', act: '🎭 Act it out', move: '🚶 Move', talk: '🗣️ Talk', race: '🏆 Team race', song: '🎶 Song' };
  var LESSONS = {
    1: { title: 'Chuseok Moon Song', missions: D.missions, door: '🚪 Door pass: show me ONE move and say it: "Step to the left slowly." or "Spin quickly." (or say one Chuseok fact: "Families come together.")', scenes: [
      { t: 'A Night of the Full Moon', mins: '2 min', mode: 'think', run: moonOpen, intro: 'It is Chuseok night. Look at the big, round moon!',
        kids: { steps: ['🌕 Look at the moon', '🤔 Whisper: what do we do at Chuseok?', '✋ Tell the class'], say: ['The moon is big.', 'We sing together.'] },
        tip: ['Week 3 of the Chuseok festival: Folk Dance & Rhythms. The class fills one shared Moon Glow bar (20 = the moon shines bright) while four teams also score.', 'Make 4 teams (Moons, Stars, Rabbits, Lanterns). Press the button for each question; accept one word or a sentence, Turkish first is fine. The real song is one button away (needs the internet).'] },
      { t: 'Chuseok Facts', mins: '3 min', mode: 'listen', run: factsScene, intro: 'Six things about Chuseok. Then: true or false?',
        kids: { steps: ['👆 Tap a card and listen', '🗣️ Say the fact', '🏃 Walk to TRUE or FALSE'], say: ['Chuseok is in autumn.', 'Families come together.', 'People wear a hanbok.'] },
        tip: ['New knowledge in simple English: autumn, full moon, families, hanbok (traditional dress), circle dance, thank you for the harvest.', 'Pupils tap the cards and repeat. Then put a TRUE sign and a FALSE sign on two sides of the room: read the sentence, pupils walk to a side, press Answer.'] },
      { t: 'Dance Verbs', mins: '5 min', mode: 'listen', run: verbsScene, intro: 'Eight new moving words: step, turn, spin, stamp, wave, hop, bow, sway.',
        kids: { steps: ['👆 Tap a card and listen', '💃 Do the action', '🎲 Clue game: which word is missing?'], say: ['step', 'spin', 'hop', 'sway'] },
        tip: ['New verbs for the dance: step, turn, spin, stamp, wave, hop, bow, sway. Tap each card (word, meaning, sentence). Then press Do it!: a card shows and everybody does the action fast.'] },
      { t: 'Learn the Song: Call and Response', mins: '4 min', mode: 'song', run: callResponse, intro: 'The leader calls. The whole circle answers: Ganggangsullae!',
        kids: { steps: ['🎤 Leader: sing the line', '👥 Circle: answer Ganggangsullae!', '🥁 Move with the drum'], say: ['We dance under the moon.', 'Ganggangsullae!'] },
        tip: ['The refrain "Ganggangsullae" belongs to the traditional Korean circle-dance song sung at Chuseok. The leader lines are simple English lines written for this lesson.', 'Press Play with the beat: the drum plays and the lines run by themselves (one bar for the leader, one bar for the circle). Practise slowly first (Slower), then faster. The real song is one button away (the KIZSONG Ganggangsullae video, needs the internet).'] },
      { t: 'GAME: Move Like the Moon', mins: '5 min', mode: 'move', run: moveCards, intro: 'Do the move. Listen to the drum: slowly or quickly?',
        kids: { steps: ['👀 Read the move card', '🥁 Hear the speed in the drum', '💃 Move like the card'], say: ['Step to the left slowly.', 'Spin quickly.', 'Stamp loudly.'] },
        tip: ['New language: directions (to the left, to the right, forward, back, around) and speed words (slowly, quickly, softly, loudly). The drum really changes: slowly = slow drum, quickly = fast drum. A new move comes every three bars.', 'Clear space for a circle. Give +2 glow when the circle moves well together.'] },
      { t: 'GAME: Rhythm Echo', mins: '3 min', mode: 'game', run: rhythmEcho, intro: 'Listen to the drum pattern. Then clap it back!',
        kids: { steps: ['👂 Listen to the pattern', '👏 Clap it back', '🥁 Keep the beat'], say: ['Listen.', 'Clap it.', 'Again, please.'] },
        tip: ['Music skill: listening and copying a rhythm. Press Listen: the drum plays 4 beats (🥁 = a hit, · = a rest). Pupils clap the same pattern. Perfect +2, almost +1. Teams take turns.'] },
      { t: 'GAME: Build Your Team Dance', mins: '7 min', mode: 'talk', run: buildDance, intro: 'Choose four moves. Say: First, then, next, finally. Then dance!',
        kids: { steps: ['👆 Choose 4 moves', '🗣️ Say: First, … Then, … Next, … Finally, …', '💃 Dance it with the drum'], say: ['First, step to the left slowly.', 'Then, spin quickly.', 'Finally, bow slowly.'] },
        tip: ['New language: sequence words (first, then, next, finally) with the dance verbs. Each team chooses 4 move cards; the board writes the dance as four sentences, then the drum runs and the board says each move; the circle answers Ganggangsullae at the end. Great +2, good +1. The dances are kept for the concert.'] },
      { t: 'The Moon Concert', mins: '5 min', mode: 'song', run: moonConcert, intro: 'Every team dances its four moves. Everyone answers!',
        kids: { steps: ['💃 Each team: dance your moves', '👥 Everyone: Ganggangsullae!', '👏 Cheer for all teams'], say: ['Ganggangsullae!', 'Happy Chuseok!'] },
        tip: ['Press Start: the drum runs and each team\'s dance lights up in turn (four moves, then the circle\'s answer). Record a short video if you want to share it for the festival (with the school\'s photo rules).'] },
      { t: 'Happy Chuseok!', mins: '1 min', mode: 'think', run: wrap, intro: 'You danced like a real circle!',
        kids: { steps: ['🏆 Cheer for every team', '🚪 Door pass: show one move and say it'], say: ['Step to the left slowly.', 'Happy Chuseok!'] },
        tip: ['Show the scores. Tell the pupils about the 5-minute homework (link shown on the board). At the door each pupil shows one move and says it, or says one Chuseok fact; you answer Ganggangsullae!'] }
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
    try { history.replaceState(null, '', '?lesson=' + lesson + '&scene=' + (idx + 1)); } catch (e) { /* ignore */ }
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
  var L0 = LESSONS[parseInt(q.lesson, 10)] ? parseInt(q.lesson, 10) : 1; var s0 = Math.max(0, Math.min(LESSONS[L0].scenes.length - 1, (parseInt(q.scene, 10) || 1) - 1));
  window.W4Lessons = { state: state, go: go, LESSONS: LESSONS };
  loadManifest(function () { drawTeams(); go(L0, s0); });
})();
