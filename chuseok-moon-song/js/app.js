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

  /* ============================== Chuseok Moon Song: call and response circle song ============================== */
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

  /* 1. Moon night opening */
  function moonOpen(c) {
    hookPrompts(c, [{ e: '🌕', n: 'o_moon' }, { e: '🏮', n: 'o_lantern' }], D.hook, D.missions, '');
    bgOf(c.body.querySelector('.hook-stage'), 'bg_moon_night'); c.body.appendChild(glowBar());
  }

  /* 2. Moon words */
  function moonWords(c) { l2Words(c, D.words); c.body.appendChild(glowBar()); }

  /* 3. Learn the call and response with the beat */
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
    body.appendChild(h('div', { class: 'row' }, [btn('✅ The class sang it (+2 glow)', 'green', function () { addGlow(2); sfx('correct'); }), pointsRow()])); body.appendChild(glowBar());
  }

  /* 4. GAME: Moon Circle Commander (the circle moves with the beat) */
  function circleCommander(c) {
    stopBeat(c);
    var body = c.body, deck = shuffle(D.commands), i = -1, auto = false, bars = 0;
    var card = h('div', { class: 'reqcard' }), dots = beatDots(), msg = h('div', { class: 'msg gmsg', text: 'Stand in a big circle. Move with the beat!' });
    function show(cmd) { card.innerHTML = ''; card.appendChild(h('div', { class: 'rq-e', text: cmd.e })); card.appendChild(h('div', { class: 'rq-t', text: cmd.t })); card.appendChild(h('div', { class: 'rq-a', text: cmd.a })); A.speak(cmd.t); sfx('page'); }
    function next() {
      i = (i + 1) % deck.length; var cmd = deck[i]; show(cmd);
      if (/^Freeze/.test(cmd.t) && MB.isOn()) { MB.stop(); msg.textContent = '🧊 FREEZE! The drum stops. Nobody moves...'; setTimeout(function () { if (auto) { MB.start(MB.getBpm(), onBeat); msg.textContent = 'The drum is back!'; } }, 4000); }
    }
    function onBeat(b) { dots.set(b); if (b === 0) { bars++; if (auto && bars % 2 === 0) next(); } }
    var go = btn('▶ Start the drum', 'green big', function () { auto = true; bars = 0; MB.start(MB.getBpm(), onBeat); go.textContent = '🔁 Restart'; if (i < 0) next(); });
    body.appendChild(h('div', { class: 'row' }, [go, btn('⏭ Next command', 'amber', next), btn('⏹ Stop', 'small ghost', function () { auto = false; MB.stop(); }), btn('✅ Great circle (+2 glow)', 'violet', function () { addGlow(2); sfx('correct'); })]));
    body.appendChild(dots); body.appendChild(card); body.appendChild(msg); body.appendChild(pointsRow()); body.appendChild(glowBar());
    card.appendChild(h('div', { class: 'rq-e', text: '🌕' })); card.appendChild(h('div', { class: 'rq-t', text: 'Press Start. A new command comes every two bars!' }));
  }

  /* 5. GAME: Make Your Verse */
  var verses = {};
  function makeVerse(c) {
    stopBeat(c);
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    function start() {
      host.innerHTML = ''; verses = {};
      var turn = 0, pick = null;
      var banner = h('div'), line = h('div', { class: 'reqcard' }), msg = h('div', { class: 'msg gmsg' }), chips = h('div', { class: 'row' }), dots = beatDots();
      function sentence() { return 'We ' + (pick ? pick.w : '…') + ' under the moon.'; }
      function paint() { line.innerHTML = ''; line.appendChild(h('div', { class: 'rq-e', text: pick ? pick.e : '✍️' })); line.appendChild(h('div', { class: 'rq-t', text: sentence() })); line.appendChild(h('div', { class: 'rq-a', text: 'Then the whole circle answers: Ganggangsullae!' })); }
      function draw() {
        if (turn >= D.teams.length) { MB.stop(); gameFinish(c, host, start); return; }
        pick = null; var nb = teamBanner(turn, '✍️ Verse ' + (turn + 1) + ' of ' + D.teams.length); banner.replaceWith(nb); banner = nb; paint(); msg.textContent = 'Choose a word. Make your own line!';
      }
      chips.appendChild(h('span', { class: 'lab', text: 'We … under the moon:' }));
      D.verbs.forEach(function (v) { chips.appendChild(h('button', { type: 'button', class: 'chip2', text: v.e + ' ' + v.w, onclick: function () { pick = v; paint(); A.speak(sentence()); sfx('tap'); } })); });
      var perform = btn('▶ Perform with the beat', 'green big', function () {
        if (!pick) { msg.textContent = 'Choose a word first!'; sfx('tap'); return; }
        var bar = -1;
        MB.start(MB.getBpm(), function (b) { dots.set(b); if (b === 0) { bar++; if (bar === 0) A.speak(sentence()); else if (bar === 1) A.speak(D.refrainSay); else { MB.stop(); msg.textContent = '👏 Great verse! Rate it:'; } } });
      });
      function done(pts) { MB.stop(); if (pts) { addPoint(turn, pts); addGlow(pts); } if (pick) verses[turn] = sentence(); turn++; draw(); }
      banner = h('div');
      host.appendChild(h('div', { class: 'row' }, [timerBtn(c, 60), perform, btn('⭐ Great (+2)', 'green', function () { done(2); }), btn('👍 Good (+1)', 'violet', function () { done(1); }), btn('⏭ Skip', 'small ghost', function () { done(0); })]));
      host.appendChild(banner); host.appendChild(line); host.appendChild(chips); host.appendChild(dots); host.appendChild(msg); host.appendChild(glowBar());
      draw();
    }
    start();
  }

  /* 6. Moon Concert: all verses in a row, the whole circle answers */
  function moonConcert(c) {
    stopBeat(c);
    var body = c.body, dots = beatDots(), stage = h('div', { class: 'cr' }), msg = h('div', { class: 'msg gmsg', text: 'Each team sings its verse. The whole class answers: Ganggangsullae!' });
    var lines = D.teams.map(function (t, i) { return { t: t, s: verses[i] || ('We ' + ['dance', 'sing', 'hold hands', 'clap'][i % 4] + ' under the moon.') }; });
    var cards = lines.map(function (l) { return h('div', { class: 'cr-card', style: '--c:' + l.t.c }, [h('small', { text: l.t.e + ' ' + l.t.n }), h('b', { text: l.s })]); });
    cards.forEach(function (x) { stage.appendChild(x); }); stage.style.gridTemplateColumns = 'repeat(2, 1fr)';
    var go = btn('🎶 Start the Moon Concert', 'green big', function () {
      var bar = -1, step = 0; go.textContent = '🎶 Again';
      cards.forEach(function (x) { x.classList.remove('on'); });
      MB.start(MB.getBpm(), function (b) {
        dots.set(b);
        if (b === 0) {
          bar++; var team = Math.floor(bar / 2), isRefrain = bar % 2 === 1;
          if (team >= lines.length) { MB.stop(); cards.forEach(function (x) { x.classList.remove('on'); }); msg.textContent = '🌕 What a night! Happy Chuseok!'; sfx('win'); confetti(); addGlow(4); return; }
          cards.forEach(function (x, k) { x.classList.toggle('on', k === team); });
          if (isRefrain) { A.speak(D.refrainSay); msg.textContent = '👥 Everyone: ' + D.refrain; } else { A.speak(lines[team].s); msg.textContent = '🎤 ' + lines[team].t.n + ': ' + lines[team].s; }
        }
      });
    });
    body.appendChild(h('div', { class: 'row' }, [go, btn('⏹ Stop', 'small ghost', function () { MB.stop(); }), btn('🎉 Cheer!', 'amber', function () { sfx('win'); confetti(); })]));
    body.appendChild(dots); body.appendChild(stage); body.appendChild(msg); body.appendChild(glowBar());
  }

  /* 7. Wrap + homework */
  function wrap(c) {
    wrapStart(c, 1, '🌕', glow >= GOAL ? 'The moon shines bright!' : 'Moon glow: ' + glow);
    var url = (location.href || '').replace(/chuseok-moon-song\/[^?#]*.*$/, '') + D.hwUrl;
    c.body.appendChild(h('div', { class: 'door', text: '🏠 Quick homework (5 minutes): open ' + D.hwUrl + ' on a phone. The link for the pupils: ' + url }));
  }

  var MODES = { game: '🎮 Game', think: '🤔 Think', listen: '👂 Listen', act: '🎭 Act it out', move: '🚶 Move', talk: '🗣️ Talk', race: '🏆 Team race', song: '🎶 Song' };
  var LESSONS = {
    1: { title: 'Chuseok Moon Song', missions: D.missions, door: '🚪 Door pass: sing me ONE leader line (for example "We dance under the moon.") and I will answer: Ganggangsullae!', scenes: [
      { t: 'A Night of the Full Moon', mins: '3 min', mode: 'think', run: moonOpen, intro: 'It is Chuseok night. Look at the big, round moon!',
        kids: { steps: ['🌕 Look at the moon', '🤔 Whisper: what do we do at Chuseok?', '✋ Tell the class'], say: ['The moon is big.', 'We eat songpyeon.'] },
        tip: ['Chuseok festival: the Korean harvest festival under the full moon. The class fills one shared Moon Glow bar (20 = the moon shines bright) while four teams also score.', 'Make 4 teams (Moons, Stars, Rabbits, Lanterns). Press the button for each question; accept one word or a sentence, Turkish first is fine.'] },
      { t: 'Moon Words', mins: '5 min', mode: 'listen', run: moonWords, intro: 'Six words for our song: moon, circle, hold hands, harvest, dance, songpyeon.',
        kids: { steps: ['👆 Tap a card and listen', '🗣️ Say the word and the sentence', '🎲 Clue game: which word is missing?'], say: ['moon', 'circle', 'hold hands', 'harvest', 'dance', 'songpyeon'] },
        tip: ['Tap each card (word, meaning, sentence), then the clue game. Pupils do a small action for each word (circle with arms, hold hands, dance).'] },
      { t: 'Learn the Song: Call and Response', mins: '8 min', mode: 'song', run: callResponse, intro: 'The leader calls. The whole circle answers: Ganggangsullae!',
        kids: { steps: ['🎤 Leader: sing the line', '👥 Circle: answer Ganggangsullae!', '🥁 Move with the drum'], say: ['We dance under the moon.', 'Ganggangsullae!'] },
        tip: ['The refrain "Ganggangsullae" belongs to the traditional Korean circle-dance song sung at Chuseok. Here the leader lines are simple English lines written for this lesson.', 'Press Play with the beat: the drum plays and the lines run by themselves (one bar for the leader, one bar for the circle). Practise slowly first (Slower), then faster. A real recording of the folk song can play next to it if you have one.'] },
      { t: 'GAME: Moon Circle Commander', mins: '6 min', mode: 'move', run: circleCommander, intro: 'Stand in a big circle. Do what the moon says, with the drum!',
        kids: { steps: ['🤝 Hold hands', '🚶 Move with the drum', '🧊 Freeze when the drum stops'], say: ['Walk to the left.', 'Clap three times.', 'Freeze like the moon!'] },
        tip: ['Clear space for a circle (or two circles). A new command comes every two bars. At "Freeze like the moon!" the drum stops for 4 seconds and nobody moves. Give +2 glow when the circle is great, or a team point to a team with the best movement.'] },
      { t: 'GAME: Make Your Verse', mins: '8 min', mode: 'talk', run: makeVerse, intro: 'Each team makes a new line: We ___ under the moon.',
        kids: { steps: ['✍️ Choose a word', '🎤 Sing your line with the beat', '👥 The circle answers'], say: ['We sing under the moon.', 'We jump under the moon.'] },
        tip: ['Teams take turns. Choose a word (dance, sing, walk, clap, jump, laugh, look at the stars, hold hands) and press Perform: the drum plays, the board says the line, then the circle answers Ganggangsullae. Great +2, good +1. The verses are kept for the concert.'] },
      { t: 'The Moon Concert', mins: '4 min', mode: 'song', run: moonConcert, intro: 'All teams sing their verse. The whole class answers!',
        kids: { steps: ['🎤 Each team: sing your verse', '👥 Everyone: Ganggangsullae!', '👏 Cheer for all teams'], say: ['Ganggangsullae!', 'Happy Chuseok!'] },
        tip: ['Press Start: the drum runs and each team\'s verse lights up in turn. Record a short video if you want to share it for the festival (with the school\'s photo rules).'] },
      { t: 'Happy Chuseok!', mins: '1 min', mode: 'think', run: wrap, intro: 'You sang like a real circle!',
        kids: { steps: ['🏆 Cheer for every team', '🚪 Door pass: sing your line'], say: ['We dance under the moon.', 'Happy Chuseok!'] },
        tip: ['Show the scores. Tell the pupils about the 5-minute homework (link shown on the board). At the door each pupil sings or says one leader line and you answer Ganggangsullae!'] }
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
