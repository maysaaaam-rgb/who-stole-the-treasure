/* Unit 4 Grade 3: What Happened? Detective Academy: teacher-led smartboard lessons (35 minutes each). The board is the stage, timer and scoreboard.
   The children move, act, talk and play. Four teams earn points all lesson. One smartboard. Built from the Unit 3 lesson shell. */
(function () {
  'use strict';
  var D = window.U4G3Data, A = window.ForestAudio;
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
  var ART = { '🗽': 'o_statue', '🕵️': 'c_daphne_case', '🏛️': 'o_mona_frame', '🖼️': 'o_mona_frame', '🎨': 'o_mona_frame', '👮': 'o_police', '📰': 'o_newspaper', '📝': 'o_plan', '🥷': 'o_steal', '🚶': 'o_steal', '🧥': 'o_steal', '🏋️': 'o_lifted', '🚨': 'o_robbery', '📞': 'o_robbery', '🔍': 'c_daphne_case' };
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
  function pointsRow() { return document.createDocumentFragment(); }

  /* ---------- helpers ---------- */
  function confetti() {
    var host = $('stage'), em = ['⭐', '🎉', '🌟', '✨', '🔍', '🏆'], k, w = h('div', { class: 'confetti' });
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
      var kids = [];
      if (w.pos) kids.push(h('span', { class: 'pos-badge', style: 'background:' + (w.posColor || '#38bdf8'), text: w.pos }));
      kids.push(fill(h('span', { class: 'em' }), w.e, '', w.a));
      kids.push(h('b', { text: w.w }));
      var card = h('button', { type: 'button', class: 'btn vcard' }, kids);
      card.addEventListener('click', function () {
        sfx('tap'); box.innerHTML = '<b>' + w.w + '</b>' + (w.pos ? ' <small>(' + w.pos + ')</small>' : '') + ': ' + w.def + '.<br><i>' + w.ex + '</i>';
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
    body.appendChild(grid); body.appendChild(box); body.appendChild(gap);
  }

  function teamName(i) { return D.teams[i].e + ' ' + D.teams[i].n; }
  function gameFinish(c, host, onAgain) {
    host.innerHTML = '';
    if (hasArt('w_trophy')) host.appendChild(h('div', { class: 'trophy' }, [art('w_trophy')]));
    podium(host); sfx('win'); confetti();
    host.appendChild(h('div', { class: 'row', style: 'justify-content:center' }, [btn('🔁 Play again', 'green big', onAgain), btn('🎉 Celebrate!', 'amber', function () { sfx('win'); confetti(); })]));
  }

  /* ============================== Unit 4 Grade 3: What Happened? Detective Academy ============================== */
  function bgOf(el, name) { if (el && hasArt(name)) el.style.background = 'url(art/' + name + '.webp) center / cover'; }
  function softFail(el, msgEl, hintText) {
    sfx('soft');
    if (el) { el.classList.remove('wob', 'wobble'); void el.offsetWidth; el.classList.add('wobble'); }
    if (msgEl) msgEl.textContent = hintText || 'Almost! Think again, detectives.';
    A.speak('Try again.');
  }

  /* ---------- the Case File: the whole class fills one case together (cooperation) while the teams also compete ---------- */
  var clues = { 1: 0, 2: 0 }, solved = {};
  function updateHudCase() {
    var box = $('hud-case'); if (!box) return;
    var L = state.lesson, cCount = clues[L] || 0, pct = Math.min(100, Math.round((cCount / D.goal) * 100));
    box.innerHTML = '';
    box.appendChild(h('span', { class: 'casetxt', text: '🧩 Case file: ' + cCount + ' / ' + D.goal + ' clues' }));
    box.appendChild(h('div', { class: 'casetrack' }, [h('i', { class: 'casefill', style: 'width:' + pct + '%' })]));
  }
  function addClue(n) {
    var L = state.lesson; clues[L] = Math.min(D.goal, (clues[L] || 0) + n);
    updateHudCase();
    [].forEach.call(document.querySelectorAll('.casefill'), function (el) { el.style.width = (clues[L] / D.goal * 100) + '%'; });
    [].forEach.call(document.querySelectorAll('.casetxt'), function (el) { el.textContent = '🧩 Case file: ' + clues[L] + ' / ' + D.goal + ' clues'; });
    if (clues[L] >= D.goal && !solved[L]) { solved[L] = 1; sfx('win'); confetti(); A.speak('Case solved! Great detectives!'); }
  }
  function caseBar() {
    updateHudCase();
    var L = state.lesson;
    return h('div', { class: 'casebar' }, [h('span', { class: 'casetxt', text: '🧩 Case file: ' + (clues[L] || 0) + ' / ' + D.goal + ' clues' }), h('div', { class: 'casetrack' }, [h('i', { class: 'casefill', style: 'width:' + ((clues[L] || 0) / D.goal * 100) + '%' })])]);
  }
  function teamBanner(i, label) {
    var t = D.teams[i], b = h('div', { class: 'gturn' });
    b.style.setProperty('--c', t.c); b.appendChild(h('span', { class: 'tn', text: t.e + ' ' + t.n + '’ turn' })); b.appendChild(h('span', { class: 'gb', text: label }));
    return b;
  }

  /* L1-1 Merged: Open the Case + Think, Pair, Share (book pp. 56-57) */
  function caseOpenTps(c) {
    var body = c.body, cur = 0, promptIdx = -1;
    var scene = h('div', { class: 'jarsbig' }, [
      fill(h('span', { class: 'bj' }), '🗽', '', 'o_statue'),
      fill(h('span', { class: 'bj' }), '🕵️', '', 'c_daphne_case')
    ]);
    var qBanner = h('div', { class: 'hookq', text: D.hook1[0] });
    var stage = h('div', { class: 'hook-stage' }, [scene, qBanner]);
    bgOf(stage, 'bg_museum');

    var bq = h('div', { class: 'bubble left' }), ba = h('div', { class: 'bubble right' });
    function show(i, speakIt) {
      cur = i;
      bq.innerHTML = '<small>🕵️ Detective asks</small>' + D.tps[i].q;
      ba.innerHTML = '<small>👥 Team answers</small>…';
      if (speakIt) { A.speak(D.tps[i].q); sfx('tap'); }
    }
    var chips = h('div', { class: 'row' }, [h('span', { class: 'lab', text: '❓ Think, Pair, Share:' })].concat(D.tps.map(function (t, i) {
      return h('button', { type: 'button', class: 'chip2', text: t.q, onclick: function () { show(i, true); } });
    })));
    var tm = timerBtn(c, 10);
    var lookBtn = btn('👀 Next hook question', 'amber', function () {
      promptIdx = (promptIdx + 1) % D.hook1.length;
      qBanner.textContent = D.hook1[promptIdx];
      sfx('page'); A.speak(D.hook1[promptIdx]);
    });
    body.appendChild(h('div', { class: 'row' }, [
      tm,
      lookBtn,
      btn('💡 Model answer', 'violet', function () { ba.innerHTML = '<small>👥 Team answers</small>' + D.tps[cur].a; A.speak(D.tps[cur].a); sfx('correct'); }),
      btn('✅ Shared with the class (+1 clue)', 'green', function () { addClue(1); sfx('correct'); })
    ]));
    body.appendChild(stage);
    body.appendChild(h('div', { class: 'dialog' }, [bq, ba]));
    body.appendChild(chips);
    body.appendChild(caseBar());
    show(0, false);
  }

  /* L1-2 Spot the Changes (book p. 57 E: two museum scenes side by side with 5 clickable hotspots + text pills fallback) */
  function spotChanges(c) {
    var body = c.body, seen = {};
    var left = h('div', { class: 'ba-card' }), right = h('div', { class: 'ba-card' });
    bgOf(left, 'bg_museum'); bgOf(right, 'bg_museum');
    var say = h('div', { class: 'msg gmsg', text: 'Tap one of the 5 numbered hotspots on the museum pictures (or the buttons below)!' });
    var hotBtnsL = [], hotBtnsR = [];

    function paint(idx, speakIt) {
      var x = D.changes[idx];
      left.innerHTML = ''; right.innerHTML = '';
      left.appendChild(h('small', { text: 'PICTURE 1: the beginning (1911)' }));
      left.appendChild(fill(h('div', { class: 'ba-e' }), x.b, '', x.artB));
      left.appendChild(h('b', { text: x.w + ': ' + x.sb }));

      right.appendChild(h('small', { text: 'PICTURE 2: the end (Today)' }));
      right.appendChild(fill(h('div', { class: 'ba-e' }), x.a, '', x.artA));
      right.appendChild(h('b', { text: x.w + ': ' + x.sa }));

      hotBtnsL = []; hotBtnsR = [];
      D.changes.forEach(function (ch, k) {
        var bL = h('button', { type: 'button', class: 'spot-hotspot' + (seen[k] ? ' found' : ''), style: 'left:' + ch.x + ';top:' + ch.y, text: seen[k] ? '✓' : String(k + 1), title: ch.w, onclick: function () { triggerSpot(k); } });
        var bR = h('button', { type: 'button', class: 'spot-hotspot' + (seen[k] ? ' found' : ''), style: 'left:' + ch.x + ';top:' + ch.y, text: seen[k] ? '✓' : String(k + 1), title: ch.w, onclick: function () { triggerSpot(k); } });
        left.appendChild(bL); right.appendChild(bR);
        hotBtnsL.push(bL); hotBtnsR.push(bR);
      });

      if (speakIt) {
        var s = 'In picture one, ' + x.sb.charAt(0).toLowerCase() + x.sb.slice(1) + ' In picture two, ' + x.sa.charAt(0).toLowerCase() + x.sa.slice(1);
        say.textContent = '🔎 ' + x.w + ': ' + s;
        A.speak(s); sfx('correct');
      }
    }

    function triggerSpot(i) {
      if (!seen[i]) { seen[i] = 1; addClue(1); }
      paint(i, true);
    }

    var chips = h('div', { class: 'row' }, D.changes.map(function (x, i) {
      return h('button', { type: 'button', class: 'chip2', text: (i + 1) + '. ' + x.w, onclick: function () { triggerSpot(i); } });
    }));

    body.appendChild(h('div', { class: 'row' }, [
      timerBtn(c, 60),
      btn('🔊 Model it', 'small amber', function () { A.speakSeq(['In picture one, there is one man.', 'In picture two, there are many people.']); })
    ]));
    body.appendChild(h('div', { class: 'ba' }, [left, h('div', { class: 'ba-arrow', text: '➜' }), right]));
    body.appendChild(chips);
    body.appendChild(say);
    body.appendChild(caseBar());
    paint(1, false);
  }

  /* L1-3 Case words + Mime it (book p. 59 Words in Context, with NOUN / VERB / PAST VERB badges) */
  function wordsScene(c) {
    l2Words(c, D.words);
    var card = h('div', { class: 'reqcard', style: 'min-height:18vh' }), cur = null, order = shuffle(D.words), k = -1;
    card.appendChild(h('div', { class: 'rq-t', text: '🎭 Mime it! One pupil acts the word. The team guesses.' }));
    var mime = btn('🎭 Mime card', 'violet', function () {
      k = (k + 1) % order.length; cur = order[k]; card.innerHTML = '';
      card.appendChild(h('div', { class: 'rq-e', text: '🤫' }));
      card.appendChild(h('div', { class: 'rq-t', text: 'Secret: ' + cur.mime }));
      card.appendChild(h('div', { class: 'rq-a', text: 'Only the actor reads this. The team guesses the word!' }));
      sfx('page');
    });
    var rev = btn('💡 Reveal the word', 'amber', function () {
      if (!cur) cur = D.words[0];
      card.innerHTML = '';
      card.appendChild(fill(h('div', { class: 'rq-e' }), cur.e, '', cur.a));
      card.appendChild(h('div', { class: 'rq-t', text: cur.w + ' (' + cur.pos + '): ' + cur.ex }));
      A.speakSeq([cur.w, cur.ex]); sfx('correct');
    });
    c.body.appendChild(h('div', { class: 'row' }, [mime, rev, btn('✅ Guessed (+1 clue)', 'green', function () { addClue(1); sfx('correct'); })]));
    c.body.appendChild(card);
    c.body.appendChild(caseBar());
  }

  /* L1-4 NEW! Past-Tense Machine (teach before testing: tap present verb -> golden +ed joins it; flip 3 irregular cards) */
  function pastMachineScene(c) {
    var body = c.body, regIdx = 0, joined = true, mode = 'reg';
    var topTabs = h('div', { class: 'row' });
    var stageWrap = h('div', { style: 'flex:1;display:flex;flex-direction:column;gap:1vh' });
    var msg = h('div', { class: 'msg gmsg', text: 'Tap a present verb below to join the golden +ed block!' });

    function drawReg() {
      stageWrap.innerHTML = '';
      var item = D.pastMachine.regular[regIdx];
      var leftCard = h('div', { class: 'pm-card' }, [
        h('span', { class: 'pill', text: '☀️ TODAY (NOW)' }),
        fill(h('div', { class: 'rq-e' }), '🚶', '', item.a),
        h('div', { class: 'pm-word', text: item.now })
      ]);
      var midBtn = h('div', { style: 'align-self:center' }, [
        btn('⚡ Join +ed ▶', 'amber big', function () {
          joined = true; sfx('correct'); addClue(1); drawReg(); A.speakSeq([item.now, item.past, item.ex]);
        })
      ]);
      var rightCard = h('div', { class: 'pm-card past' }, [
        h('span', { class: 'pill amber', text: '⏪ YESTERDAY (1911)' }),
        fill(h('div', { class: 'rq-e' }), '🕵️', '', item.a),
        h('div', { class: 'pm-word', html: joined ? (item.now + '<span class="ed-block">+ed</span> = ' + item.past) : '❓' })
      ]);
      stageWrap.appendChild(h('div', { class: 'pm-stage' }, [leftCard, midBtn, rightCard]));
      var verbRow = h('div', { class: 'row' }, [h('span', { class: 'lab', text: '👆 Present verbs:' })]);
      D.pastMachine.regular.forEach(function (v, k) {
        verbRow.appendChild(btn(v.now + ' → ' + v.past, k === regIdx ? 'amber small' : 'cyan small', function () {
          regIdx = k; joined = true; sfx('correct'); addClue(1); msg.textContent = '✅ ' + v.ex; drawReg(); A.speakSeq([v.now, v.past, v.ex]);
        }));
      });
      stageWrap.appendChild(verbRow);
      msg.textContent = '✅ ' + item.ex;
    }

    function drawIrr() {
      stageWrap.innerHTML = '';
      var grid = h('div', { class: 'irr-grid' });
      D.pastMachine.irregular.forEach(function (v) {
        var flipped = false;
        var wordLine = h('div', { class: 'pm-word', text: v.now + ' → ❓' });
        var subLine = h('div', { class: 'rq-a', text: '👆 Tap to flip this special verb!' });
        var card = h('div', { class: 'pm-card past', style: 'cursor:pointer', onclick: function () {
          flipped = !flipped;
          wordLine.innerHTML = v.now + ' → <span class="ed-block">' + v.past + '</span>';
          subLine.textContent = v.ex;
          sfx('correct'); addClue(1); A.speakSeq([v.now, v.past, v.ex]);
        } }, [
          h('span', { class: 'pill amber', text: '🔮 SPECIAL PAST CARD' }),
          fill(h('div', { class: 'rq-e' }), '🕵️', '', v.a),
          wordLine,
          subLine
        ]);
        grid.appendChild(card);
      });
      stageWrap.appendChild(grid);
      msg.textContent = 'Some past verbs do not use +ed! Tap the 3 special cards: take → took, hide → hid, find → found.';
    }

    var bReg = btn('⚙️ 1. Regular Verbs (+ed)', 'amber', function () { mode = 'reg'; sfx('page'); drawReg(); });
    var bIrr = btn('🔮 2. Special Cards (take→took, hide→hid, find→found)', 'violet', function () { mode = 'irr'; sfx('page'); drawIrr(); });
    topTabs.appendChild(bReg); topTabs.appendChild(bIrr);

    body.appendChild(topTabs);
    body.appendChild(stageWrap);
    body.appendChild(msg);
    body.appendChild(caseBar());
    drawReg();
  }

  /* L1-5 GAME: Sneak to the Mona Lisa (red light, green light: the guard looks / the guard turns) */
  function sneakGame(c) {
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    var iv = null, round = 0, ROUNDS = 6, phase = 'idle';
    c.later(function () { if (iv) clearTimeout(iv); });
    var eye = fill(h('div', { class: 'sn-eye' }), '👮', '', 'o_police');
    var status = h('div', { class: 'sn-st', text: 'Line up at the back. The painting is at the front!' });
    var panel = h('div', { class: 'sneak idle' }, [eye, status]); bgOf(panel, 'bg_museum');
    var msg = h('div', { class: 'msg gmsg', text: 'Pupils tiptoe forward when the guard turns. Freeze when he looks!' });
    function stop() {
      if (iv) { clearTimeout(iv); iv = null; }
      phase = 'idle'; panel.className = 'sneak idle';
      eye.innerHTML = ''; fill(eye, '👮', '', 'o_police');
    }
    function setPhase(p) {
      phase = p; panel.className = 'sneak ' + p;
      eye.innerHTML = '';
      fill(eye, p === 'red' ? '👮' : '🥷', '', p === 'red' ? 'o_police' : 'o_steal');
      status.textContent = p === 'red' ? '🛑 FREEZE! The guard is looking!' : '🟢 TIPTOE! The guard is turned around.';
      sfx(p === 'red' ? 'soft' : 'page'); A.speak(p === 'red' ? 'Freeze!' : 'Go!');
      iv = setTimeout(function () { setPhase(p === 'red' ? 'green' : 'red'); }, p === 'red' ? 1500 + Math.random() * 1700 : 2200 + Math.random() * 2800);
    }
    var go = btn('▶ Start the round', 'green big', function () {
      if (round >= ROUNDS) { gameFinish(c, host, restart); return; }
      stop(); round++; msg.textContent = 'Round ' + round + ' of ' + ROUNDS + '. Who takes the painting first?'; setPhase('green');
    });
    function restart() { host.innerHTML = ''; round = 0; build(); }
    function build() {
      var row = h('div', { class: 'row points' }, [h('span', { class: 'lab', text: '🏆 First to the painting:' })]);
      D.teams.forEach(function (t, i) {
        row.appendChild(h('button', { type: 'button', class: 'btn small', style: '--bg:' + t.c + ';--lip:rgba(0,0,0,.4)', text: t.e + ' +2', onclick: function () {
          stop(); addPoint(i, 2); addClue(1); sfx('win'); confetti();
          msg.textContent = '🎉 ' + t.n + ' took the painting! Say: I took the painting!'; A.speak('I took the painting!');
        } }));
      });
      host.appendChild(h('div', { class: 'row' }, [
        go,
        btn('⏹ Stop', 'small ghost', function () { stop(); status.textContent = 'Paused.'; }),
        btn('😅 Caught!', 'violet', function () { sfx('soft'); msg.textContent = 'Caught! Say: I am arrested! Then go back and try again.'; A.speak('I am arrested!'); })
      ]));
      host.appendChild(panel); host.appendChild(msg); host.appendChild(row); host.appendChild(caseBar());
    }
    build();
  }

  /* generic multiple-choice with team turns, soft fail (sfx('soft') + wobble, kind hint, no point deduction) */
  function mcqGame(c, items, cfg) {
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    function start() {
      host.innerHTML = '';
      var deck = shuffle(items), ROUNDS = Math.min(cfg.rounds || 8, deck.length * 2), round = 0, turn = 0, tries = 0, cur = null;
      var banner = h('div'), card = h('div', { class: 'reqcard' }), opts = h('div', { class: 'row', style: 'justify-content:center' }), msg = h('div', { class: 'msg gmsg' });
      function draw() {
        if (round >= ROUNDS) { gameFinish(c, host, start); return; }
        cur = deck[round % deck.length]; tries = 0;
        var nb = teamBanner(turn, cfg.label + ' ' + (round + 1) + ' of ' + ROUNDS); banner.replaceWith(nb); banner = nb;
        card.innerHTML = '';
        card.appendChild(fill(h('div', { class: 'rq-e' }), cur.e, '', cur.art || cur.a));
        card.appendChild(h('div', { class: 'rq-t', text: cur.q || cur.s }));
        msg.textContent = cfg.hint;
        opts.innerHTML = '';
        shuffle(cur.o.map(function (t, k) { return { t: t, k: k }; })).forEach(function (o) {
          var b = btn(o.t, 'amber big', function () {
            if (o.k === cur.a) {
              var pts = tries === 0 ? cfg.pts : 1;
              addPoint(turn, pts); addClue(1); sfx('correct');
              if (pts > 1) confetti();
              var full = (cur.q ? (cur.q + ' — ' + cur.o[cur.a]) : cur.s.replace('____', cur.o[cur.a]));
              msg.textContent = '✅ ' + full; A.speak(cur.q ? cur.o[cur.a] : full);
              round++; turn = (turn + 1) % D.teams.length;
              setTimeout(draw, 1650);
            } else {
              tries++;
              softFail(b, msg, '💡 ' + (cur.hint || 'Almost! Think about what happened in 1911.'));
            }
          });
          opts.appendChild(b);
        });
        A.speak((cur.q || cur.s).replace(/____/g, 'blank'));
      }
      banner = h('div');
      host.appendChild(h('div', { class: 'row' }, [timerBtn(c, 20), btn('🔊 Read it', 'small amber', function () { A.speak((cur.q || cur.s).replace(/____/g, 'blank')); })]));
      host.appendChild(banner); host.appendChild(card); host.appendChild(opts); host.appendChild(msg); host.appendChild(caseBar());
      draw();
    }
    start();
  }
  function pastGame(c) { mcqGame(c, D.past, { label: '⏪ Case', pts: 2, rounds: 8, hint: 'Which word is right? Peruggia did it yesterday.' }); }
  function quizShow(c) { mcqGame(c, D.quiz, { label: '❓ Question', pts: 3, rounds: 5, hint: 'Team talk (10 seconds), then tap the answer!' }); }

  /* G. Rich Case Closed Podium & Stamp View (never an empty box when opened directly via ?lesson=1&scene=N) */
  function renderCaseClosedView(host, lesson, onReplay) {
    host.innerHTML = '';
    var L = LESSONS[lesson] || LESSONS[1];
    var cCount = clues[lesson] || 0;
    var isSolved = cCount >= D.goal;
    var topBanner = h('div', { class: 'cc-banner' }, [
      fill(h('div', { class: 'rq-e' }), '🕵️', '', 'c_daphne_case'),
      h('div', { class: 'col', style: 'align-items:center;text-align:center' }, [
        h('div', { class: 'solved-stamp', text: isSolved ? '🏆 CASE SOLVED! (' + cCount + ' / ' + D.goal + ' CLUES)' : '🗂️ CASE FILE ' + lesson + ' · ' + cCount + ' / ' + D.goal + ' CLUES' }),
        h('div', { class: 'row', style: 'justify-content:center;margin-top:0.5vh' }, L.missions.map(function (m) {
          return h('span', { class: 'pill amber', style: 'font-size:clamp(10px,1.35vh,14px)', text: '✅ ' + m.e + ' ' + m.t });
        }))
      ]),
      fill(h('div', { class: 'rq-e' }), '🖼️', '', 'o_mona_frame')
    ]);
    host.appendChild(topBanner);
    podium(host);
    host.appendChild(h('div', { class: 'door', text: L.door }));
    var rowb = h('div', { class: 'row', style: 'justify-content:center' });
    if (onReplay) rowb.appendChild(btn('⏳ Play Timeline Game', 'cyan', onReplay));
    if (LESSONS[lesson + 1]) rowb.appendChild(btn('Lesson ' + (lesson + 1) + ': ' + LESSONS[lesson + 1].title + ' ▶', 'green big', function () { go(lesson + 1, 0); }));
    rowb.appendChild(btn('🎉 Celebrate!', 'amber', function () { sfx('win'); confetti(); }));
    host.appendChild(rowb);
    sfx('win'); confetti();
  }

  /* L1-6 Merged: Timeline Game + Case Closed Podium & Door Pass */
  function timelineAndClose(c) {
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    function startTimeline() {
      host.innerHTML = '';
      var round = 0, turn = 0, placed = 0, ROUNDS = D.timeline.length, set = null;
      var banner = h('div'), title = h('div', { class: 'prompt' }), list = h('div', { class: 'scr' }), line = h('div', { class: 'msg gmsg', text: '' }), rowDone = h('div', { class: 'reqcard' }), nb2;
      function draw() {
        if (round >= ROUNDS) { renderCaseClosedView(host, state.lesson, startTimeline); return; }
        set = D.timeline[round]; placed = 0;
        var nb = teamBanner(turn, set.e + ' Case ' + (round + 1) + ' of ' + ROUNDS); banner.replaceWith(nb); banner = nb;
        title.textContent = 'Tap the sentences in the right order: ' + set.title;
        line.textContent = ''; rowDone.innerHTML = '';
        rowDone.appendChild(fill(h('div', { class: 'rq-e' }), set.e, '', (set.arts && set.arts[0]) || 'o_mona_frame'));
        list.innerHTML = '';
        shuffle(set.steps.map(function (s, k) { return { s: s, k: k }; })).forEach(function (o) {
          var tile = h('button', { type: 'button', class: 'btn tile2 chip2', text: o.s, onclick: function () { pick(tile, o); } });
          list.appendChild(tile);
        });
      }
      function pick(tile, o) {
        if (o.k !== placed) {
          softFail(tile, line, 'Almost! Look again. What happened ' + D.orderWords[placed].toLowerCase().replace(',', '') + '?');
          return;
        }
        rowDone.appendChild(h('div', { class: 'rq-t', text: (placed + 1) + '. ' + D.orderWords[placed] + ' ' + o.s }));
        tile.style.display = 'none'; A.speak(o.s); sfx('correct'); placed++; addClue(1);
        if (placed >= set.steps.length) {
          addPoint(turn, 3); confetti();
          line.textContent = '⭐ +3 points for ' + D.teams[turn].n + '! Retell it: First, … Then, …';
          sfx('win'); round++; turn = (turn + 1) % D.teams.length; nb2.style.display = '';
        }
      }
      nb2 = btn('Next case ▶', 'green big', function () { nb2.style.display = 'none'; draw(); }); nb2.style.display = 'none';
      var showPodiumBtn = btn('🏆 Case Closed & Scores', 'amber small', function () { renderCaseClosedView(host, state.lesson, startTimeline); });
      banner = h('div');
      host.appendChild(h('div', { class: 'row' }, [timerBtn(c, 45), nb2, showPodiumBtn]));
      host.appendChild(banner); host.appendChild(title); host.appendChild(list); host.appendChild(rowDone); host.appendChild(line); host.appendChild(caseBar());
      draw();
    }
    startTimeline();
  }

  /* L2-7 Case closed (always renders full podium, clue count, stamp, and door pass immediately) */
  function caseWrap(c) {
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    renderCaseClosedView(host, state.lesson, null);
  }

  /* ---------------- Lesson 2: Where Is She? (book pp. 58-64) ---------------- */
  /* L2-1 Word Flash */
  function wordFlash(c) {
    var body = c.body, deck = shuffle(D.words.concat([{ w: 'lined up', pos: 'PAST VERB', posColor: '#f59e0b', e: '🧍🧍', a: 'o_robbery', def: 'stood in a line', ex: 'People lined up to see the empty space.' }])), i = -1, shown = false;
    var card = h('div', { class: 'reqcard' }), msg = h('div', { class: 'msg gmsg', text: 'Look at the picture. Say the word fast!' });
    function next() { i = (i + 1) % deck.length; shown = false; var w = deck[i]; card.innerHTML = ''; card.appendChild(fill(h('div', { class: 'rq-e' }), w.e, '', w.a)); card.appendChild(h('div', { class: 'rq-t', text: '❓ What is the word?' })); sfx('page'); }
    function reveal() { var w = deck[i]; if (shown) return; shown = true; card.lastChild.textContent = w.w + ': ' + w.def + '.'; A.speakSeq([w.w, w.ex]); sfx('correct'); }
    body.appendChild(h('div', { class: 'row' }, [timerBtn(c, 5), btn('🎴 Next card', 'amber big', next), btn('💡 Reveal', 'violet', reveal), btn('✅ Said it fast (+1 clue)', 'green', function () { addClue(1); sfx('correct'); })]));
    body.appendChild(card); body.appendChild(msg); body.appendChild(caseBar()); next();
  }
  /* L2-2 Story theatre */
  function storyTheatre(c) {
    var scene = h('div', { class: 'bigscene' }), panel = h('div', { class: 'marketpanel tall' }, [scene]);
    bgOf(panel, 'bg_museum'); c.body.appendChild(panel); fill(scene, '🏛️', '', 'o_mona_frame');
    runStory(c, D.story, function (ch, predicting) {
      scene.innerHTML = '';
      if (!ch) { fill(scene, '🏛️', '', 'o_mona_frame'); return; }
      fill(scene, predicting ? '🕵️' : ch.scene, '', predicting ? 'c_daphne_case' : ch.art);
    }, 'Listen like a detective. Do the actions! Open your book at page 58 after the story.', 'Case closed! The Mona Lisa went home.');
    c.body.appendChild(caseBar());
  }
  /* L2-3 Headlines */
  function headlines(c) {
    var body = c.body, i = -1;
    var card = h('div', { class: 'reqcard' }), msg = h('div', { class: 'msg gmsg', text: 'Reporters: write the headline on your mini whiteboard!' });
    function next() { i = (i + 1) % D.headlines.length; var x = D.headlines[i]; card.innerHTML = ''; card.appendChild(fill(h('div', { class: 'rq-e' }), x.e, '', x.a)); card.appendChild(h('div', { class: 'rq-t', text: '📰 ' + x.t + ': the Mona Lisa is not on the wall!' })); card.appendChild(h('div', { class: 'rq-a', text: 'Write a short headline. Use: missing, robbery, police.' })); msg.textContent = ''; A.speak('Breaking news in ' + x.t.toLowerCase() + '!'); sfx('page'); }
    body.appendChild(h('div', { class: 'row' }, [timerBtn(c, 45), btn('📰 Breaking news', 'amber big', next), btn('💡 Model headline', 'violet', function () { var x = D.headlines[Math.max(0, i)]; msg.textContent = '💡 ' + x.h; A.speak(x.h); sfx('correct'); }), btn('✅ Great headline (+1 clue)', 'green', function () { addClue(1); sfx('correct'); })]));
    body.appendChild(card); body.appendChild(msg); body.appendChild(caseBar()); next();
  }
  /* L2-5 Four corners debate (book p. 64 B) */
  function debate(c) {
    var body = c.body, d = D.debate;
    var q = h('div', { class: 'reqcard' }, [fill(h('div', { class: 'rq-e' }), '🕵️', '', 'c_daphne_case'), h('div', { class: 'rq-t', text: d.q })]), msg = h('div', { class: 'msg gmsg', text: 'Walk to the YES side or the NO side of the room. Then say why!' });
    var zones = h('div', { class: 'zones' }, [h('div', { class: 'zone', style: '--c:#22c55e', text: '✅ YES: ' + d.yes }), h('div', { class: 'zone', style: '--c:#ef4444', text: '❌ NO: ' + d.no })]); zones.style.gridTemplateColumns = 'repeat(2, 1fr)';
    body.appendChild(h('div', { class: 'row' }, [timerBtn(c, 30), btn('🔊 Read the question', 'amber', function () { A.speakSeq([d.q, d.yes, d.no]); }),
      btn('🎲 Pick a speaker', 'violet', function () { msg.textContent = '🎤 Team ' + D.teams[Math.floor(Math.random() * D.teams.length)].n + ': one pupil says a reason!'; sfx('page'); }),
      btn('✅ Good reason (+1 clue)', 'green', function () { addClue(1); sfx('correct'); })]));
    body.appendChild(q); body.appendChild(zones); body.appendChild(msg);
    body.appendChild(h('div', { class: 'row' }, d.hint.map(function (s) { return h('button', { type: 'button', class: 'chip2', text: s, onclick: function () { A.speak(s); } }); })));
    body.appendChild(caseBar());
  }
  /* L2-6 Draw two faces (book p. 64 C) */
  function drawFaces(c) {
    var body = c.body;
    var cards = h('div', { class: 'ba' }, [
      h('div', { class: 'ba-card' }, [h('small', { text: D.faces[0].t }), fill(h('div', { class: 'ba-e' }), '🖼️', '', D.faces[0].a), h('b', { text: D.faces[0].s })]),
      h('div', { class: 'ba-arrow', text: '➜' }),
      h('div', { class: 'ba-card' }, [h('small', { text: D.faces[1].t }), fill(h('div', { class: 'ba-e' }), '🖼️', '', D.faces[1].a), h('b', { text: D.faces[1].s })])
    ]);
    var msg = h('div', { class: 'msg gmsg', text: 'You are a newspaper artist. Draw the museum worker’s face: MISSING and FOUND.' });
    body.appendChild(h('div', { class: 'row' }, [timerBtn(c, 120), btn('😱 Show: missing', 'amber', function () { cards.children[0].querySelector('.ba-e').textContent = D.faces[0].e; msg.textContent = 'Draw this face in the first box. How does he feel?'; A.speak('The worker is scared. The painting is missing!'); sfx('page'); }),
      btn('😄 Show: found', 'amber', function () { cards.children[2].querySelector('.ba-e').textContent = D.faces[1].e; msg.textContent = 'Draw this face in the second box. How does he feel?'; A.speak('The worker is happy. The painting is found!'); sfx('correct'); }),
      btn('🖼️ Gallery walk (+1 clue)', 'green', function () { addClue(1); sfx('correct'); msg.textContent = 'Walk around. Look at 3 pictures. Say: He is scared. / He is happy.'; })]));
    body.appendChild(cards); body.appendChild(msg);
    body.appendChild(h('div', { class: 'row' }, ['He is scared.', 'He is happy.', 'The painting is missing.', 'The painting is found.'].map(function (s) { return h('button', { type: 'button', class: 'chip2', text: s, onclick: function () { A.speak(s); } }); })));
    body.appendChild(caseBar());
  }

  var MODES = { game: '🎮 Game', think: '🤔 Think', listen: '👂 Listen', act: '🎭 Act it out', move: '🚶 Move', talk: '🗣️ Talk', race: '🏆 Team race' };
  /* Case 1 has 7 steps (merged Open + TPS; merged Timeline + Case Closed; plus the new Past-Tense Machine step before Past-Tense Detectives) */
  var LESSONS = {
    1: { title: 'Case File 1 · A Picture on the Wall', missions: D.c1missions, door: '🚪 Door pass: tell me one past sentence: "Peruggia took the painting." or one new word (plan, steal, lifted, robbery, arrested).', scenes: [
      { t: 'Open the Case & Think, Pair, Share', mins: '6 min', mode: 'talk', run: caseOpenTps, intro: 'Look at the Statue of Liberty head (pp. 56–57). Think, tell your partner, share!',
        kids: { steps: ['👀 Look at the statue', '🤝 PAIR: tell your partner', '🗣️ SHARE: tell the class'], say: ['What do you think?', 'I think it is in the park for decoration.', 'We think it is a new decoration.'] },
        tip: ['Book link: Unit 4 opener (p. 56) + Get Ready to Read, Think, Pair, Share (p. 57 A–C).', 'Make 4 teams (Foxes, Owls, Cats, Wolves). Explain the Case File bar in the top HUD (20 clues = case solved). Use the 10s timer, then press +1 clue when pairs share.'] },
      { t: 'GAME: Spot the Changes', mins: '5 min', mode: 'game', run: spotChanges, intro: 'The museum at the beginning and at the end. Tap the 5 hotspots on the pictures!',
        kids: { steps: ['👀 Compare Picture 1 and Picture 2', '👆 Tap a numbered hotspot (1–5)', '🗣️ Say: In picture one … In picture two …'], say: ['In picture one, there is one man.', 'In picture two, there are many people.'] },
        tip: ['Book link: Think and discuss E, p. 57 (the museum at the beginning and end of the story).', 'Pupils tap the 5 hotspots directly on the side-by-side museum pictures (or use the text pills below). Each new change speaks the comparison and adds +1 clue.'] },
      { t: 'Case Words + Mime It', mins: '6 min', mode: 'listen', run: wordsScene, intro: 'Five detective words (NOUN / VERB / PAST VERB): plan, steal, lifted, robbery, arrested.',
        kids: { steps: ['👆 Tap a card and listen', '🎭 Mime the word', '🎲 Guess the missing word'], say: ['plan', 'steal', 'lifted', 'robbery', 'arrested'] },
        tip: ['Book link: Words in Context, p. 59 (plan, steal, lifted, robbery, arrested). Notice the NOUN / VERB / PAST VERB badges on each card.', 'Tap each card to hear the word, meaning, and sentence. Then play the Clue game and Mime It!'] },
      { t: 'Past-Tense Machine', mins: '5 min', mode: 'think', run: pastMachineScene, intro: 'How do verbs talk about yesterday? Join +ed or flip the 3 special verb cards!',
        kids: { steps: ['⚙️ Tap a present verb to join +ed', '🔮 Flip the 3 special cards', '🗣️ Say the past sentence'], say: ['walk → walked', 'lift → lifted', 'take → took', 'hide → hid', 'find → found'] },
        tip: ['Teach before testing: show how walk, want, lift, call, arrest, paint add +ed, and flip the 3 irregular cards (take→took, hide→hid, find→found) before starting the quiz!'] },
      { t: 'GAME: Sneak to the Mona Lisa', mins: '5 min', mode: 'move', run: sneakGame, intro: 'The guard looks, you freeze! The guard turns, you tiptoe. Reach the painting!',
        kids: { steps: ['🙈 Guard turns: tiptoe forward', '👀 Guard looks: FREEZE!', '🗣️ Say: I took the painting!'], say: ['I took the painting!', 'I am arrested!'] },
        tip: ['Movement game for the new words and past tense. Pupils start at the back of the room; the board switches between GO and FREEZE. First pupil to reach the front says "I took the painting!" (+2 for their team).'] },
      { t: 'GAME: Past-Tense Detectives', mins: '5 min', mode: 'game', run: pastGame, intro: 'What happened yesterday? Choose the right past verb for each sentence.',
        kids: { steps: ['👀 Read the sentence', '🤝 Talk with your team', '👆 Tap the right word'], say: ['He walked into the museum.', 'He lifted the painting.', 'The police arrested him.'] },
        tip: ['Book link: past simple in the reading, pp. 58–63 (walked, wanted, lifted, called, arrested; took, hid, found). Wrong taps play the gentle soft chime and wobble with a kind hint.'] },
      { t: 'Timeline & Case Closed!', mins: '5 min', mode: 'game', run: timelineAndClose, intro: 'Put the events in order (First, Then, After that, Finally) and celebrate at the podium!',
        kids: { steps: ['👀 Read the four sentences', '👆 Tap them in order', '🏆 Cheer at the podium & say your Door Pass!'], say: ['First, Leonardo painted the Mona Lisa.', 'Then, Peruggia took it.', 'Finally, the police found it.'] },
        tip: ['Book link: timeline years (1503, 1911, 1913) and sequence words. When both cases are ordered (or when you click "🏆 Case Closed & Scores"), the full podium, CASE SOLVED stamp, and Door Pass appear!'] }
    ] },
    2: { title: 'Case File 2 · Where Is She?', missions: D.c2missions, door: '🚪 Door pass: answer one question: "What did Peruggia want to do?" or "Where did he put the painting?"', scenes: [
      { t: 'Word Flash', mins: '3 min', mode: 'race', run: wordFlash, intro: 'Quick! Look at the picture and say the word before the timer ends.',
        kids: { steps: ['👀 Look at the picture', '🗣️ Say the word fast', '✋ Teams: +1 for a fast answer'], say: ['plan', 'steal', 'lifted', 'robbery', 'arrested'] },
        tip: ['Book link: Words in Context, p. 59, and "lined up / queued", p. 61.', 'Press Next card, give 5 seconds, then Reveal. Fast team answers earn +1 clue.'] },
      { t: 'Act Out the Robbery', mins: '8 min', mode: 'act', run: storyTheatre, intro: 'Listen like a detective. Do every action with me!',
        kids: { steps: ['👂 Listen to each part', '🎭 Do the action', '🤔 Guess the big question'], say: ['Peruggia had a plan.', 'He lifted the painting.', 'The police arrested him.'] },
        tip: ['Book link: "Where Is She?", pp. 58-63. This is an oral retelling in very simple words; then pupils open the book and read.', 'Press the green button for each part and do the actions together. At the 🤔 part let pupils guess "Where is the Mona Lisa?" before you reveal.'] },
      { t: 'Newspaper Race', mins: '4 min', mode: 'talk', run: headlines, intro: 'Breaking news from Madrid, Tokyo and New York! Write the headline.',
        kids: { steps: ['📰 Read the breaking news', '✍️ Write a short headline', '🗣️ Read it to your team'], say: ['The Mona Lisa is missing!', 'Big robbery in Paris!'] },
        tip: ['Book link: the newspaper pictures, p. 61 (Madrid, Tokyo, New York).', 'Press Breaking news. Teams write a short headline on a mini whiteboard (use: missing, robbery, police), then read it. Press the model headline last.'] },
      { t: 'GAME: Detective Quiz Show', mins: '6 min', mode: 'game', run: quizShow, intro: 'Five questions about the story. Talk in your team, then answer!',
        kids: { steps: ['❓ Listen to the question', '🤝 Talk for 10 seconds', '👆 Tap your answer'], say: ['Peruggia wanted to steal a painting.', 'He put it under his clothes.'] },
        tip: ['Book link: Explore the Reading A, p. 64 (five questions).', 'Teams take turns. A wrong tap wobbles softly with a kind hint. First try +3, later +1.'] },
      { t: 'Four Corners Debate', mins: '5 min', mode: 'move', run: debate, intro: 'Can someone steal a painting from a museum today? Yes or no?',
        kids: { steps: ['🤔 Think about the question', '🚶 Walk to YES or NO', '🗣️ Say a reason'], say: ['Yes, but a very small one.', 'No, there are alarms!'] },
        tip: ['Book link: Think and discuss B, p. 64.', 'Put a YES sign on one side of the room and NO on the other. Pupils walk, then say a reason with the frames from the book. Press Pick a speaker for a random team.'] },
      { t: 'Draw the Two Faces', mins: '6 min', mode: 'act', run: drawFaces, intro: 'You work at a newspaper. Draw the worker’s face: missing and found.',
        kids: { steps: ['😱 Draw: the painting is MISSING', '😄 Draw: the painting is FOUND', '🖼️ Gallery walk: say how he feels'], say: ['He is scared.', 'He is happy.'] },
        tip: ['Book link: Explore the Reading C, p. 64 (draw the museum worker\'s face).', 'Pupils draw in the book (or on paper). Start the 2 minute timer. Then a gallery walk: pupils look at 3 pictures and say how the worker feels.'] },
      { t: 'Case Closed!', mins: '3 min', mode: 'think', run: caseWrap, intro: 'The Mona Lisa went home. Case closed!',
        kids: { steps: ['🏆 Cheer for every team', '🚪 Door pass: answer one question'], say: ['He wanted to steal a painting.', 'He put it under his clothes.'] },
        tip: ['Show the Case File result and the team scores. At the door each pupil answers one question from the story (see the door pass).'] }
    ] }
  };


  /* ---------- shell ---------- */
  function ctxFor(main) { return { body: main, done: function () { state.done[state.lesson + ':' + state.idx] = true; drawSteps(); }, later: function (fn) { state.cleanups.push(fn); } }; }
  function drawLessonTabs() {
    var box = $('lesson-tabs'); if (!box) return; box.innerHTML = '';
    var keys = Object.keys(LESSONS);
    if (keys.length <= 1) return;
    keys.forEach(function (k) {
      var id = parseInt(k, 10);
      box.appendChild(h('button', { type: 'button', class: 'btn ltab' + (state.lesson === id ? ' on' : ' ghost'), text: 'Case ' + id, title: LESSONS[id].title, onclick: function () { if (state.lesson !== id) go(id, 0); } }));
    });
  }
  function drawSteps() {
    var L = LESSONS[state.lesson], box = $('steps'); if (!box) return; box.innerHTML = '';
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
    if (!LESSONS[lesson]) lesson = 1;
    var L = LESSONS[lesson];
    idx = Math.max(0, Math.min(L.scenes.length - 1, idx || 0));
    if (state.idx >= 0 && state.lesson === lesson && idx > state.idx) state.done[lesson + ':' + state.idx] = true;
    state.cleanups.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } }); state.cleanups = [];
    A.stop();
    state.lesson = lesson; state.idx = idx;
    var s = L.scenes[idx], stage = $('stage');
    stage.className = ''; stage.innerHTML = ''; $('tip').hidden = true;
    stage.appendChild(h('div', { class: 's-head' }, [
      h('h2', { text: s.t }),
      h('span', { class: 'pill mode', text: MODES[s.mode] }),
      h('span', { class: 'pill', text: '⏱ ' + s.mins }),
      h('span', { class: 's-sub', text: s.intro }),
      h('div', { class: 'grow' }),
      h('span', { class: 'pill amber', text: 'Step ' + (idx + 1) + ' of ' + L.scenes.length })
    ]));
    var main = h('div', { class: 's-body' }); stage.appendChild(main);
    var kp = kidsPanel(s.kids); if (kp) stage.appendChild(kp);
    $('h-title').firstChild.nodeValue = L.title;
    drawLessonTabs();
    if (typeof updateHudCase === 'function') updateHudCase();
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
