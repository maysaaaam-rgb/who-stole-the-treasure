/* Week 4 Grade 4: Captain Quiet's Space Mission: one teacher-led smartboard lesson (35 minutes). The board is the stage, timer and scoreboard.
   The children move, act, talk and play. Four teams earn points all lesson. One smartboard. Built from the Unit 3 lesson shell. */
(function () {
  'use strict';
  var D = window.W4G4Data, A = window.ForestAudio;
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
  var ART = { '🐧': 'c_captain_quiet', '🤖': 'c_robot', '🚀': 'n_rocket', '🙏': 'o_please_star', '🧑‍🚀': 'c_captain_wave', '🙋': 'c_sam', '👧': 'c_ayla' };
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
    var host = $('stage'), em = ['⭐', '🎉', '🌟', '✨', '🚀', '🏆'], k, w = h('div', { class: 'confetti' });
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

  /* ============================== Captain Quiet's Space Mission ============================== */
  var ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty'];
  function numWord(n) { return n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : ''); }
  function bgOf(el, name) { if (el && hasArt(name)) el.style.background = 'url(art/' + name + '.webp) center / cover'; }

  /* 1. Hook: Captain Quiet's briefing */
  function hook(c) {
    hookPrompts(c, [{ e: '🐧', n: 'c_captain_quiet' }, { e: '🤖', n: 'c_robot' }], D.hookPrompts, D.missions, '');
    bgOf(c.body.querySelector('.hook-stage'), 'bg_space_class');
  }

  /* 2. Captain Says (TPR): act only when the Captain says please */
  function captainSays(c) {
    var scene = h('div', { class: 'bigscene' }), panel = h('div', { class: 'marketpanel tall' }, [scene]);
    bgOf(panel, 'bg_space_class'); c.body.appendChild(panel); fill(scene, '🧑‍🚀', '', 'c_captain_wave');
    runStory(c, D.captain, function (ch, predicting) {
      scene.innerHTML = '';
      if (!ch) { fill(scene, '🧑‍🚀', '', 'c_captain_wave'); return; }
      fill(scene, predicting ? '🤔' : ch.scene, '', predicting ? null : ch.art);
    }, 'Stand up, crew! Do the action only when Captain Quiet says PLEASE.', 'Great crew! "Please" is the magic word.');
  }

  /* 3. GAME: Number Rocket (count to 50, then find the number) */
  function numberRocket(c) {
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    var iv = null; c.later(function () { if (iv) clearInterval(iv); });
    function start() {
      host.innerHTML = ''; if (iv) { clearInterval(iv); iv = null; }
      var cells = [], mode = 'free', target = 0, round = 0, ROUNDS = 8, turn = 0, busy = false;
      var grid = h('div', { class: 'numgrid' }), msg = h('div', { class: 'msg gmsg', text: 'Tap a number to hear it. Then press the buttons!' });
      var bar = h('div', { class: 'gbar' }, [h('i', { style: 'width:0%' })]), pill = h('span', { class: 'pill amber', text: '🚀 0' });
      var banner = h('div', { class: 'gturn', style: 'display:none' });
      function light(n) { cells.forEach(function (el, i) { el.classList.toggle('lit', i < n); }); bar.firstChild.style.width = Math.round(n * 2) + '%'; pill.textContent = '🚀 ' + n; }
      function stopCount() { if (iv) { clearInterval(iv); iv = null; } }
      function autoCount(step, label) {
        stopCount(); mode = 'free'; banner.style.display = 'none'; var n = 0; msg.textContent = label; light(0);
        iv = setInterval(function () {
          n += step; light(n); A.speak(numWord(n)); sfx('tap');
          if (n >= 50) { stopCount(); msg.textContent = '🚀 Fifty! Blast off!'; sfx('win'); confetti(); }
        }, step === 1 ? 900 : 1500);
      }
      function paintBanner() { var t = D.teams[turn]; banner.style.display = 'flex'; banner.style.setProperty('--c', t.c); banner.innerHTML = ''; banner.appendChild(h('span', { class: 'tn', text: t.e + ' ' + t.n + '’ turn' })); banner.appendChild(h('span', { class: 'gb', text: '🎯 Round ' + (round + 1) + ' of ' + ROUNDS })); }
      function nextTarget() {
        if (round >= ROUNDS) { gameFinish(c, host, start); return; }
        target = 1 + Math.floor(Math.random() * 50); busy = false; paintBanner();
        msg.textContent = '🎯 Touch ' + numWord(target) + '!'; A.speak('Touch ' + numWord(target) + '!');
        cells.forEach(function (el) { el.classList.remove('hit', 'wob'); });
      }
      for (var n = 1; n <= 50; n++) (function (n) {
        var el = h('button', { type: 'button', class: 'btn numcell', text: String(n) });
        el.addEventListener('click', function () {
          if (mode === 'find') {
            if (busy) return;
            if (n === target) { busy = true; el.classList.add('hit'); addPoint(turn, 2); sfx('correct'); msg.textContent = '✔ ' + numWord(n) + '! +2 points'; A.speak(numWord(n) + '!'); turn = (turn + 1) % D.teams.length; round++; setTimeout(nextTarget, 1500); }
            else { el.classList.remove('wob'); void el.offsetWidth; el.classList.add('wob'); sfx('tap'); msg.textContent = 'That is ' + numWord(n) + '. Find ' + numWord(target) + '!'; A.speak('That is ' + numWord(n) + '.'); }
          } else { A.speak(numWord(n)); sfx('tap'); light(n); }
        });
        cells.push(el); grid.appendChild(el);
      })(n);
      host.appendChild(h('div', { class: 'row' }, [
        btn('🚀 Count 1-50', 'green', function () { autoCount(1, 'Count with the rocket! Say every number.'); }),
        btn('🔟 Count in tens', 'amber', function () { autoCount(10, 'Ten, twenty, thirty, forty, fifty! Clap on every ten.'); }),
        btn('🎯 Find it! (team game)', 'violet big', function () { stopCount(); mode = 'find'; round = 0; turn = 0; light(0); nextTarget(); }),
        btn('⏹ Stop', 'small ghost', function () { stopCount(); mode = 'free'; banner.style.display = 'none'; light(0); msg.textContent = 'Tap a number to hear it.'; }),
        pill
      ]));
      host.appendChild(bar); host.appendChild(banner); host.appendChild(msg); host.appendChild(grid);
      host.appendChild(h('div', { class: 'row' }, ['Count to fifty.', 'Ten, twenty, thirty, forty, fifty.', 'What comes after twenty-nine?'].map(function (s) { return h('button', { type: 'button', class: 'chip2', text: s, onclick: function () { A.speak(s); } }); })));
    }
    start();
  }

  /* 4. The Door Problem: asking for and giving permission */
  function doorScene(c) {
    var body = c.body, cur = null;
    var panel = h('div', { class: 'marketpanel doorpanel' });
    if (hasArt('s_late_at_door')) { bgOf(panel, 's_late_at_door'); panel.style.backgroundPosition = 'center 22%'; } else panel.appendChild(fill(h('div', { class: 'bigscene' }), '🚪'));
    var q = h('div', { class: 'bubble left' }), a = h('div', { class: 'bubble right' });
    q.innerHTML = '<small>🙋 Pupil at the door</small>Tap a question!'; a.innerHTML = '<small>🤖 Teacher Robot</small>…';
    function ask(s) { cur = s; q.innerHTML = '<small>🙋 Pupil at the door</small>' + s; a.innerHTML = '<small>🤖 Teacher Robot</small>…'; A.speak(s); sfx('tap'); }
    function answer(o) {
      if (!cur) { a.innerHTML = '<small>🤖 Teacher Robot</small>Ask a question first!'; return; }
      a.innerHTML = '<small>🤖 Teacher Robot</small>' + o.t; A.speak(o.t); sfx(o.ok ? 'correct' : 'tap');
      var kept = a; kept.classList.remove('pop'); void kept.offsetWidth; kept.classList.add('pop');
    }
    var asks = h('div', { class: 'row' }, [h('span', { class: 'lab', text: '🙋 Ask:' })].concat(D.asks.map(function (s) { return h('button', { type: 'button', class: 'chip2', text: s, onclick: function () { ask(s); } }); })));
    var yes = D.answers.filter(function (o) { return o.ok; }), no = D.answers.filter(function (o) { return !o.ok; });
    var doors = h('div', { class: 'doors' }, [
      h('div', { class: 'dgroup green' }, [fill(h('div', { class: 'dpic' }), '✅', '', 'o_green_door')].concat(yes.map(function (o) { return btn(o.t, 'small', function () { answer(o); }); }))),
      h('div', { class: 'dgroup red' }, [fill(h('div', { class: 'dpic' }), '⛔', '', 'o_red_door')].concat(no.map(function (o) { return btn(o.t, 'small', function () { answer(o); }); })))
    ]);
    var robot = btn('🎲 Robot decides!', 'violet', function () { answer(D.answers[Math.floor(Math.random() * D.answers.length)]); });
    body.appendChild(h('div', { class: 'row' }, [timerBtn(c, 240), robot, btn('🔊 Model it', 'small amber', function () { A.speakSeq(['Can I come in?', 'Yes, you can.', 'Can I go out?', 'Sorry, not right now.']); })]));
    body.appendChild(panel); body.appendChild(h('div', { class: 'dialog' }, [q, a])); body.appendChild(asks); body.appendChild(doors);
    body.appendChild(pointsRow());
  }

  /* 5. GAME: Give Me, Please. Teams take turns to make a polite request. */
  function requestGame(c) {
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    function start() {
      host.innerHTML = '';
      var ROUNDS = 8, round = 0, turn = 0, deck = shuffle(D.objects), kinds = ['give', 'give', 'again', 'give', 'give', 'again', 'give', 'give'];
      var banner = h('div', { class: 'gturn' }), card = h('div', { class: 'reqcard' }), msg = h('div', { class: 'msg gmsg', text: '' });
      function frameOf() {
        var k = kinds[round], o = deck[round % deck.length];
        if (k === 'again') return { k: k, e: '🙉', say: 'Say that again, please.', show: 'Your partner speaks very quietly. Ask: ______', o: o };
        return { k: k, e: o.e, say: 'Give me the ' + o.n + ', please.', show: 'Ask your partner: Give me the ' + o.n + ', ______', o: o };
      }
      var cur = null;
      function draw() {
        if (round >= ROUNDS) { gameFinish(c, host, start); return; }
        cur = frameOf(); var t = D.teams[turn];
        banner.style.setProperty('--c', t.c); banner.innerHTML = ''; banner.appendChild(h('span', { class: 'tn', text: t.e + ' ' + t.n + '’ turn' })); banner.appendChild(h('span', { class: 'gb', text: '🙏 Request ' + (round + 1) + ' of ' + ROUNDS }));
        card.innerHTML = ''; card.appendChild(fill(h('div', { class: 'rq-e' }), cur.e)); card.appendChild(h('div', { class: 'rq-t', text: cur.show })); card.appendChild(h('div', { class: 'rq-a', text: 'Partner answers: Here you are. / Sure. / Of course.' }));
        msg.textContent = 'One pupil asks. The partner answers. Say the magic word: PLEASE!';
      }
      function done(pts) { if (pts > 0) { addPoint(turn, pts); sfx('correct'); if (pts === 2) confetti(); msg.textContent = '+' + pts + ' points for ' + D.teams[turn].n + '!'; } else { msg.textContent = 'Not this time. Next team!'; sfx('tap'); } round++; turn = (turn + 1) % D.teams.length; setTimeout(draw, 900); }
      host.appendChild(banner); host.appendChild(card);
      host.appendChild(h('div', { class: 'row' }, [
        btn('🔊 Model it', 'small amber', function () { A.speakSeq([cur.say, 'Here you are.']); }),
        btn('⭐ Perfect with please (+2)', 'green', function () { done(2); }),
        btn('👍 Almost (+1)', 'amber', function () { done(1); }),
        btn('↪ Next team', 'small ghost', function () { done(0); })
      ]));
      host.appendChild(msg);
      host.appendChild(h('div', { class: 'row' }, ['Give me the book, please.', 'Here you are.', 'Sure.', 'Say that again, please.'].map(function (s) { return h('button', { type: 'button', class: 'chip2', text: s, onclick: function () { A.speak(s); } }); })));
      draw();
    }
    start();
  }

  /* 6. GAME: Rule Race. Four rockets race to the star. */
  function ruleRace(c) {
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    function start() {
      host.innerHTML = '';
      var GOAL = 6, deck = shuffle(D.race), idx = 0, turn = 0, steps = D.teams.map(function () { return 0; }), revealed = false, over = false;
      var lanes = D.teams.map(function (t, i) {
        var rk = fill(h('span', { class: 'lrk' }), '🚀'), tr = h('div', { class: 'ltrack' }, [rk, h('span', { class: 'lgoal', text: '⭐' })]);
        return { el: h('div', { class: 'lane', style: '--c:' + t.c }, [h('span', { class: 'lname', text: t.e + ' ' + t.n }), tr]), rk: rk };
      });
      function place() { lanes.forEach(function (l, i) { l.rk.style.left = (steps[i] / GOAL * 82) + '%'; }); }
      var banner = h('div', { class: 'gturn' }), task = h('div', { class: 'racecard' }), ans = h('div', { class: 'msg gmsg', text: '' });
      function draw() {
        if (idx >= deck.length) { deck = shuffle(D.race); idx = 0; }
        var t = D.teams[turn], r = deck[idx]; revealed = false;
        banner.style.setProperty('--c', t.c); banner.innerHTML = ''; banner.appendChild(h('span', { class: 'tn', text: t.e + ' ' + t.n + '’ turn' })); banner.appendChild(h('span', { class: 'gb', text: '🏁 First to ' + GOAL + ' steps' }));
        task.innerHTML = ''; task.appendChild(fill(h('div', { class: 'rq-e' }), r.e)); task.appendChild(h('div', { class: 'rq-t', text: r.p }));
        ans.textContent = ''; A.speak(r.p);
      }
      function advance(i, pts) {
        steps[i]++; addPoint(i, pts); place(); sfx('correct');
        if (steps[i] >= GOAL) { over = true; setTimeout(function () { gameFinish(c, host, start); }, 900); return; }
        idx++; turn = (turn + 1) % D.teams.length; draw();
      }
      var show = btn('👀 Show the answer', 'amber', function () { var r = deck[idx]; revealed = true; ans.textContent = '✔ ' + r.a; A.speak(r.a); sfx('page'); });
      var ok = btn('✅ Team got it (+2)', 'green', function () { if (!over) advance(turn, 2); });
      var steal = btn('↪ Next team steals (+1)', 'violet', function () { if (!over) advance((turn + 1) % D.teams.length, 1); });
      var skip = btn('⏭ Nobody', 'small ghost', function () { if (over) return; idx++; turn = (turn + 1) % D.teams.length; draw(); });
      host.appendChild(h('div', { class: 'row' }, [timerBtn(c, 20), show, ok, steal, skip]));
      host.appendChild(banner); host.appendChild(task); host.appendChild(ans);
      host.appendChild(h('div', { class: 'lanes' }, lanes.map(function (l) { return l.el; })));
      place(); draw();
    }
    start();
  }

  /* 7. Wrap-up */
  function wrap(c) { wrapStart(c, 1, '🚀', 'Mission complete!'); if (hasArt('s_quiet_class')) { var r = c.body.querySelector('.report'); if (r) { var im = art('s_quiet_class', 'wrapart'); r.insertBefore(im, r.firstChild); } } }

  var MODES = { game: '🎮 Game', think: '🤔 Think', listen: '👂 Listen', act: '🎭 Act it out', move: '🚶 Move', talk: '🗣️ Talk', race: '🏆 Team race' };
  var LESSONS = {
    1: { title: 'Captain Quiet’s Space Mission', missions: D.missions, door: '🚪 Door pass: ask me "Can I go out?" or "Give me the book, please." and I will answer!', scenes: [
      { t: 'Captain Quiet’s Briefing', mins: '3 min', mode: 'think', run: hook, intro: 'Welcome aboard, crew! Look at the picture. What can you see?',
        kids: { steps: ['👀 Look at Captain Quiet and the robot', '🤔 Whisper to your partner: what can you see?', '✋ Raise your hand to tell the class'], say: ['Hello, Captain!', 'I can see …'] },
        tip: ['Book link: Unit 1 "Classroom Rules" opener, p. ___.', 'Press the button for each question. Accept one word or a sentence. At the end show the five missions. Greet pupils at the door as the Captain.'] },
      { t: 'Captain Says', mins: '5 min', mode: 'act', run: captainSays, intro: 'Stand up, crew! Do the action only when Captain Quiet says PLEASE.',
        kids: { steps: ['🧍 Stand up', '👂 Listen to the Captain', '🏃 Do the action ONLY if you hear please'], say: ['Open the door, please.', 'Be quiet, please.'] },
        tip: ['Book link: classroom instructions, p. ___ (Open/close the door, Look at the board, Be quiet, Clean the board, Go back to your place, Open the window, The pencil please).', 'Pupils do each action first, then you press the next part. At the 🤔 part there is no "please": pupils must freeze. Then give the job of Captain to a pupil.', 'Support: show the action yourself. Stretch: a pupil is the Captain and gives the instructions.'] },
      { t: 'GAME: Number Rocket', mins: '5 min', mode: 'game', run: numberRocket, intro: 'Count the rocket up to fifty! Then find the number.',
        kids: { steps: ['🚀 Count 1 to 50 with the rocket', '🔟 Count in tens and clap', '🎯 Teams: touch the number the board says'], say: ['Twenty-three!', 'Count to fifty.'] },
        tip: ['Book link: numbers from one to fifty, p. ___.', 'Press Count 1-50: the rocket climbs and the board says each number. Pupils say it too. Then Count in tens (clap on every ten).', 'Press Find it!: teams take turns. The board says a number, the pupil points and taps. Right = 2 points. 8 rounds, then the winner is shown.', 'Support: tap a number and let pupils repeat. Stretch: ask "What comes after 39?" before they tap.'] },
      { t: 'The Door Problem', mins: '6 min', mode: 'talk', run: doorScene, intro: 'A pupil is at the door. Ask to come in or go out. Teacher Robot answers.',
        kids: { steps: ['🙋 Ask: Can I come in?', '🤖 Robot: Yes, you can. OR Sorry, not right now.', '🔁 Swap roles with your partner'], say: ['Can I come in?', 'Can I go out?', 'Yes, you can.', 'Sorry, not right now.'] },
        tip: ['Book link: asking for and giving permission, p. ___ (Can/May I come in/go out? Yes, you can. / Sure. / Of course. / Sorry, not right now.).', 'Model with a pupil: tap a question, then a door (green = yes, red = no). Press Robot decides so pupils must react.', 'Pairs practise. Start the timer. Walk round and listen. Support: point to the door colour. Stretch: ask for something else politely.'] },
      { t: 'GAME: Give Me, Please', mins: '6 min', mode: 'game', run: requestGame, intro: 'Teams take turns. Make a polite request. Do not forget please!',
        kids: { steps: ['🙏 Look at the picture', '🗣️ Ask: Give me the …, please.', '🤝 The partner answers: Here you are.'], say: ['Give me the pencil, please.', 'Here you are.', 'Say that again, please.'] },
        tip: ['Book link: making requests, p. ___ (Give me the book, please. Sure. / Of course. / Here you are. / Say that again, please.).', 'Each team sends two pupils: one asks, one answers with a real object. Press Perfect (+2) if the request has please, Almost (+1) if not complete. Eight requests, then the winner is shown.', 'Support: use the model button first. Stretch: ask for two things.'] },
      { t: 'GAME: Rule Race', mins: '8 min', mode: 'race', run: ruleRace, intro: 'Four rockets race to the star! Answer the task to move your rocket.',
        kids: { steps: ['👂 Listen to the task', '🗣️ Talk with your team, then answer', '🚀 A right answer moves your rocket'], say: ['Can I go out, please?', 'Open the window, please.', 'Sure.'] },
        tip: ['Book link: review of the whole lesson, p. ___ (permission, requests, instructions, numbers 1-50).', 'Teams take turns. Tasks: count, ask for permission, give an instruction, ask politely. Start the 20 second timer. Right = 2 points. Press "Next team steals" for 1 point if the first team cannot answer.', 'The first rocket to 6 steps wins and the podium is shown. Check that every team member speaks at least once.'] },
      { t: 'Mission Complete!', mins: '2 min', mode: 'think', run: wrap, intro: 'You finished the mission, crew!',
        kids: { steps: ['🏆 Cheer for every team', '🚪 Door pass: ask the teacher a question'], say: ['Can I go out?', 'Give me the book, please.'] },
        tip: ['Show the scores and cheer for everyone. At the door each pupil asks "Can I go out?" or says "Give me the book, please." and you answer (Yes, you can. / Here you are.). It is a quick check for you.'] }
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
