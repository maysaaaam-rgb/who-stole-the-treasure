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

  /* ============================== Chuseok Moon Song (simple version): 3 moon words, 5 dance words, the song, slowly / quickly, team dance ============================== */
  function bgOf(el, name) { if (el && hasArt(name)) el.style.background = 'url(art/' + name + '.webp) center / cover'; }
  var MB = window.MoonBeat, SND = window.MoonSnd;
  var glow = 0, GOAL = 20, glowDone = false;

  /* real sound files first, the old computer sounds as a fallback */
  function sfx(n) {
    var map = { correct: ['sfx_correct', 0.9], coin: ['sfx_correct', 0.7], win: ['sfx_team_done', 0.9], tap: ['drum_rim', 0.55], page: ['drum_deok', 0.5] };
    var m = map[n];
    if (SND && m && SND.ready(m[0])) SND.play(m[0], m[1]); else A.play(n);
  }
  function say(key, text) { if (SND && SND.ready('v_' + key)) return SND.say(key); A.speak(text || key); return Promise.resolve(); }
  function sayList(keys, text) { if (SND && keys.every(function (k) { return SND.ready('v_' + k); })) return SND.sayList(keys); A.speak(text || keys.join(' ')); return Promise.resolve(); }
  function addGlow(n) {
    glow = Math.min(GOAL, glow + n);
    [].forEach.call(document.querySelectorAll('.casefill'), function (el) { el.style.width = (glow / GOAL * 100) + '%'; });
    [].forEach.call(document.querySelectorAll('.casetxt'), function (el) { el.textContent = '🌕 Moon glow: ' + glow + ' / ' + GOAL; });
    if (glow >= GOAL && !glowDone) { glowDone = true; sfx('win'); confetti(); if (SND) { SND.play('sfx_moon_glow', 0.9); SND.play('sfx_cheer', 0.8); } A.speak('The moon is shining bright! Happy Chuseok!'); }
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
  /* the real song file, with the video as an option */
  function songBox() {
    var audio = h('audio', { controls: 'controls', preload: 'none', src: 'audio/song_real.mp3', style: 'width:100%' });
    audio.addEventListener('play', function () { if (MB) MB.stop(); });
    var vid = h('div', { class: 'watch' }), open = false;
    var b = btn('🎬 Watch the video', 'small violet', function () {
      open = !open; vid.innerHTML = '';
      if (open) { audio.pause(); if (MB) MB.stop(); vid.appendChild(h('iframe', { src: 'https://www.youtube-nocookie.com/embed/' + D.video.id + '?rel=0', title: D.video.title, allow: 'accelerometer; autoplay; encrypted-media; picture-in-picture', allowfullscreen: 'true', loading: 'lazy' })); b.textContent = '✖ Close the video'; }
      else b.textContent = '🎬 Watch the video';
    });
    c_later_audio = audio;
    return h('div', { class: 'songbox' }, [h('div', { class: 'lab', text: '🎵 Our song (press play):' }), audio, h('div', { class: 'row' }, [b, h('span', { class: 'lab', text: 'The video needs the internet.' })]), vid]);
  }
  var c_later_audio = null;
  function cardSentence(k) { return k.v + ' ' + k.m + '.'; }

  /* 1. The moon night: three moon words and the song */
  function moonOpen(c) {
    hookPrompts(c, [{ e: '🌕', n: 'o_moon' }, { e: '🏮', n: 'o_lantern' }], D.hook, D.missions, '');
    bgOf(c.body.querySelector('.hook-stage'), 'bg_moon_night');
    var box = h('div', { class: 'msg gmsg', text: 'Tap a word to hear it.' });
    var cards = h('div', { class: 'roles' }, D.words3.map(function (w) {
      return h('button', { type: 'button', class: 'btn vcard', onclick: function () { sfx('tap'); A.speakSeq([w.w, w.ex]); box.textContent = w.w + ': ' + w.ex; addGlow(0); } }, [h('span', { class: 'em', text: w.e }), h('b', { text: w.w })]);
    }));
    cards.style.gridTemplateColumns = 'repeat(3, 1fr)';
    c.body.appendChild(cards); c.body.appendChild(box); c.body.appendChild(songBox()); c.body.appendChild(glowBar());
    c.later(function () { if (c_later_audio) c_later_audio.pause(); });
  }

  /* 2. Five dance words with the teacher's voice */
  function danceWords(c) {
    stopBeat(c);
    var body = c.body, big = h('div', { class: 'reqcard' }), msg = h('div', { class: 'msg gmsg', text: 'Tap a card. Listen. Then do the action!' }), seen = {};
    big.appendChild(h('div', { class: 'rq-e', text: '💃' })); big.appendChild(h('div', { class: 'rq-t', text: 'Five dance words' }));
    var grid = h('div', { class: 'roles' }, D.dance5.map(function (w, k) {
      return h('button', { type: 'button', class: 'btn vcard', onclick: function () {
        big.innerHTML = ''; big.appendChild(h('div', { class: 'rq-e', text: w.e })); big.appendChild(h('div', { class: 'rq-t', text: w.w.toUpperCase() })); big.appendChild(h('div', { class: 'rq-a', text: w.ex }));
        say(w.w).then(function () { A.speak(w.ex); }); if (!seen[k]) { seen[k] = 1; addGlow(1); }
      } }, [h('span', { class: 'em', text: w.e }), h('b', { text: w.w })]);
    }));
    grid.style.gridTemplateColumns = 'repeat(5, 1fr)';
    var order = shuffle(D.dance5), k = -1;
    var doit = btn('🎴 Do it!', 'violet big', function () { k = (k + 1) % order.length; var w = order[k]; big.innerHTML = ''; big.appendChild(h('div', { class: 'rq-e', text: w.e })); big.appendChild(h('div', { class: 'rq-t', text: w.w.toUpperCase() + '!' })); say(w.w); });
    body.appendChild(grid); body.appendChild(big);
    body.appendChild(h('div', { class: 'row' }, [doit, btn('✅ Everybody did it (+1 glow)', 'green', function () { addGlow(1); sfx('correct'); })]));
    body.appendChild(msg); body.appendChild(pointsRow()); body.appendChild(glowBar());
  }

  /* 3. The song: the leader calls, the circle answers Ganggangsullae */
  function songStep(c) {
    stopBeat(c);
    var body = c.body, seq = [], idx = -1;
    D.calls.forEach(function (l) { seq.push({ who: 'leader', t: l }); seq.push({ who: 'group', t: D.refrain }); });
    var lead = h('div', { class: 'cr-card leader' }), grp = h('div', { class: 'cr-card group' }), dots = beatDots(), msg = h('div', { class: 'msg gmsg', text: 'The leader calls. The whole circle answers: Ganggangsullae!' });
    function paint(cur) {
      lead.innerHTML = '<small>🎤 LEADER calls</small><b>' + (cur && cur.who === 'leader' ? cur.t : '…') + '</b>'; grp.innerHTML = '<small>👥 CIRCLE answers</small><b>' + (cur && cur.who === 'group' ? cur.t : '…') + '</b>';
      lead.classList.toggle('on', !!cur && cur.who === 'leader'); grp.classList.toggle('on', !!cur && cur.who === 'group');
    }
    paint(null);
    var bpmTxt = h('span', { class: 'pill amber', text: '♩ ' + MB.getBpm() }), playBtn;
    function play() {
      idx = -1;
      MB.start(MB.getBpm(), function (b) {
        dots.set(b);
        if (b === 0) {
          idx++;
          if (idx >= seq.length) { MB.stop(); paint(null); msg.textContent = '🎉 Well sung! Do it again, louder!'; sfx('win'); addGlow(2); playBtn.textContent = '▶ Play again'; return; }
          var cur = seq[idx]; paint(cur); if (cur.who === 'group') say('ganggang', D.refrainSay); else A.speak(cur.t);
        }
      });
    }
    playBtn = btn('▶ Sing with the band', 'green big', function () { playBtn.textContent = '▶ Play again'; play(); });
    body.appendChild(h('div', { class: 'row' }, [playBtn, btn('⏹ Stop', 'small ghost', function () { MB.stop(); paint(null); }),
      btn('🐢 Slower', 'small', function () { MB.setBpm(MB.getBpm() - 12); bpmTxt.textContent = '♩ ' + MB.getBpm(); }), btn('🐇 Faster', 'small', function () { MB.setBpm(MB.getBpm() + 12); bpmTxt.textContent = '♩ ' + MB.getBpm(); }), bpmTxt]));
    body.appendChild(dots); body.appendChild(h('div', { class: 'cr' }, [lead, grp])); body.appendChild(msg);
    body.appendChild(h('div', { class: 'row' }, D.calls.map(function (s) { return h('button', { type: 'button', class: 'chip2', text: s, onclick: function () { A.speak(s); } }); })));
    body.appendChild(h('div', { class: 'row' }, [btn('✅ The class sang it (+2 glow)', 'green', function () { addGlow(2); sfx('correct'); }), pointsRow()])); body.appendChild(songBox()); body.appendChild(glowBar());
    c.later(function () { if (c_later_audio) c_later_audio.pause(); });
  }

  /* 4. GAME: Move Like the Moon: five verbs, slowly or quickly; the band really changes speed; freeze when the bowl rings */
  function moveCards(c) {
    stopBeat(c);
    var body = c.body, deck = shuffle(D.cards5), i = -1, auto = false, bars = 0, freezeAt = 0;
    var card = h('div', { class: 'reqcard' }), dots = beatDots(), msg = h('div', { class: 'msg gmsg', text: 'Stand in a circle. Do the move. Listen: slowly or quickly?' });
    function show(k) {
      card.innerHTML = ''; card.appendChild(h('div', { class: 'rq-e', text: k.e })); card.appendChild(h('div', { class: 'rq-t', text: cardSentence(k) }));
      var sp = D.speeds.filter(function (x) { return x.w === k.m; })[0];
      card.appendChild(h('div', { class: 'rq-a', text: sp.e + ' ' + sp.w + ': ' + (sp.bpm < 80 ? 'slow band' : 'fast band') }));
      sayList([k.key, k.m], cardSentence(k)); MB.setBpm(k.bpm); if (MB.isOn()) MB.start(k.bpm, onBeat);
    }
    function freeze() {
      MB.stop(); card.innerHTML = ''; card.appendChild(h('div', { class: 'rq-e', text: '🧊' })); card.appendChild(h('div', { class: 'rq-t', text: 'Freeze like the moon!' })); card.appendChild(h('div', { class: 'rq-a', text: 'The bowl rings. Nobody moves...' }));
      if (SND && SND.ready('moon_bowl')) SND.play('moon_bowl', 0.8, '.wav'); say('freeze', 'Freeze like the moon!');
      setTimeout(function () { if (auto) { MB.start(MB.getBpm(), onBeat); } }, 5000);
    }
    function next() { i = (i + 1) % deck.length; show(deck[i]); }
    function onBeat(b) { dots.set(b); if (b === 0) { bars++; if (auto && bars % 3 === 0) { if (bars % 12 === 0) freeze(); else next(); } } }
    var go = btn('▶ Start the band', 'green big', function () { auto = true; bars = 0; MB.start(MB.getBpm(), onBeat); go.textContent = '🔁 Restart'; if (i < 0) next(); });
    var legend = h('div', { class: 'row' }, [h('span', { class: 'lab', text: 'Speed words:' })].concat(D.speeds.map(function (m) { return h('button', { type: 'button', class: 'chip2', text: m.e + ' ' + m.w, onclick: function () { say(m.w); MB.setBpm(m.bpm); if (MB.isOn()) MB.start(m.bpm, onBeat); } }); })));
    body.appendChild(h('div', { class: 'row' }, [go, btn('⏭ Next move', 'amber', next), btn('🧊 Freeze!', 'small', freeze), btn('⏹ Stop', 'small ghost', function () { auto = false; MB.stop(); }), btn('✅ Great circle (+2 glow)', 'violet', function () { addGlow(2); sfx('correct'); })]));
    body.appendChild(dots); body.appendChild(card); body.appendChild(legend); body.appendChild(msg); body.appendChild(pointsRow()); body.appendChild(glowBar());
    card.appendChild(h('div', { class: 'rq-e', text: '🌕' })); card.appendChild(h('div', { class: 'rq-t', text: 'Press Start. A new move comes every three bars!' }));
  }

  /* 5. GAME: Our Team Dance (3 moves, First / Then / Finally), then the Moon Concert */
  function teamDance(c) {
    stopBeat(c);
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    var SEQ = ['First,', 'Then,', 'Finally,'];
    function start() {
      host.innerHTML = '';
      var turn = 0, picks = [], dances = {};
      var banner = h('div'), board = h('div', { class: 'reqcard' }), chips = h('div', { class: 'row' }), msg = h('div', { class: 'msg gmsg' }), dots = beatDots();
      function paint() { board.innerHTML = ''; SEQ.forEach(function (w, k) { board.appendChild(h('div', { class: 'rq-t', text: w + ' ' + (picks[k] ? cardSentence(picks[k]).toLowerCase() : '…') })); }); }
      function draw() {
        if (turn >= D.teams.length) { MB.stop(); concert(dances); return; }
        picks = []; var nb = teamBanner(turn, '💃 Dance ' + (turn + 1) + ' of ' + D.teams.length); banner.replaceWith(nb); banner = nb; paint(); msg.textContent = 'Choose 3 moves. Make your team dance!';
      }
      chips.appendChild(h('span', { class: 'lab', text: 'Moves:' }));
      D.cards5.forEach(function (k) { chips.appendChild(h('button', { type: 'button', class: 'chip2', text: k.e + ' ' + k.v + ' ' + k.m, onclick: function () { if (picks.length >= 3) { msg.textContent = 'Three moves is enough! Press Dance.'; sfx('tap'); return; } picks.push(k); paint(); sayList([k.key, k.m], cardSentence(k)); } })); });
      var dance = btn('▶ Dance it with the band', 'green big', function () {
        if (picks.length < 3) { msg.textContent = 'Choose 3 moves first!'; sfx('tap'); return; }
        var bar = -1; MB.start(picks[0].bpm, function (b) {
          dots.set(b);
          if (b === 0) {
            bar++;
            if (bar < 3) { var k = picks[bar]; MB.setBpm(k.bpm); msg.textContent = '💃 ' + SEQ[bar] + ' ' + cardSentence(k).toLowerCase(); sayList([k.key, k.m], cardSentence(k)); }
            else if (bar === 3) { msg.textContent = '👥 Everyone: ' + D.refrain; say('ganggang', D.refrainSay); }
            else { MB.stop(); msg.textContent = '👏 What a dance! Rate it:'; if (SND) SND.play('clap_group', 0.9, '.wav'); }
          }
        });
      });
      function done(pts) { MB.stop(); if (pts) { addPoint(turn, pts); addGlow(pts); } if (picks.length) dances[turn] = picks.slice(); turn++; draw(); }
      banner = h('div');
      host.appendChild(h('div', { class: 'row' }, [timerBtn(c, 60), btn('🗑️ Clear', 'small ghost', function () { picks = []; paint(); }), dance, btn('⭐ Great (+2)', 'green', function () { done(2); }), btn('👍 Good (+1)', 'violet', function () { done(1); }), btn('⏭ Skip', 'small ghost', function () { done(0); })]));
      host.appendChild(banner); host.appendChild(board); host.appendChild(chips); host.appendChild(dots); host.appendChild(msg); host.appendChild(glowBar());
      draw();
    }
    /* the Moon Concert: every team's dance in a row, then the circle answers */
    function concert(dances) {
      host.innerHTML = '';
      var dots = beatDots(), stage = h('div', { class: 'cr' }), msg = h('div', { class: 'msg gmsg', text: 'Each team dances its three moves. Everyone answers: Ganggangsullae!' });
      var defaults = [[0, 3, 6], [2, 5, 8], [1, 4, 9], [3, 6, 0]];
      var lines = D.teams.map(function (t, i) { var m = dances[i] || defaults[i % 4].map(function (k) { return D.cards5[k]; }); return { t: t, m: m }; });
      var cards = lines.map(function (l) { return h('div', { class: 'cr-card', style: '--c:' + l.t.c }, [h('small', { text: l.t.e + ' ' + l.t.n }), h('b', { text: l.m.map(function (k) { return k.v; }).join(' · ') })]); });
      cards.forEach(function (x) { stage.appendChild(x); }); stage.style.gridTemplateColumns = 'repeat(2, 1fr)';
      var go = btn('🎶 Start the Moon Concert', 'green big', function () {
        var bar = -1; go.textContent = '🎶 Again'; cards.forEach(function (x) { x.classList.remove('on'); });
        MB.start(84, function (b) {
          dots.set(b);
          if (b === 0) {
            bar++; var team = Math.floor(bar / 4), pos = bar % 4;
            if (team >= lines.length) { MB.stop(); cards.forEach(function (x) { x.classList.remove('on'); }); msg.textContent = '🌕 What a night! Happy Chuseok!'; sfx('win'); confetti(); if (SND) { SND.play('sfx_cheer', 0.9); SND.play('clap_group', 0.8, '.wav'); } say('happy_chuseok', 'Happy Chuseok!'); addGlow(4); return; }
            cards.forEach(function (x, k) { x.classList.toggle('on', k === team); });
            if (pos < 3) { var k = lines[team].m[pos]; MB.setBpm(k.bpm); msg.textContent = '🎤 ' + lines[team].t.n + ': ' + SEQ[pos] + ' ' + cardSentence(k).toLowerCase(); sayList([k.key, k.m], cardSentence(k)); }
            else { MB.setBpm(84); say('ganggang', D.refrainSay); msg.textContent = '👥 Everyone: ' + D.refrain; }
          }
        });
      });
      host.appendChild(h('div', { class: 'row' }, [go, btn('⏹ Stop', 'small ghost', function () { MB.stop(); }), btn('🎉 Cheer!', 'amber', function () { sfx('win'); confetti(); if (SND) SND.play('sfx_cheer', 0.9); }), btn('🔁 New dances', 'small ghost', start)]));
      host.appendChild(dots); host.appendChild(stage); host.appendChild(msg); host.appendChild(glowBar());
    }
    start();
  }

  /* 6. Wrap + homework */
  function wrap(c) {
    wrapStart(c, 1, '🌕', glow >= GOAL ? 'The moon shines bright!' : 'Moon glow: ' + glow);
    var url = (location.href || '').replace(/chuseok-moon-song\/[^?#]*.*$/, '') + D.hwUrl;
    c.body.appendChild(h('div', { class: 'door', text: '🏠 Quick homework (5 minutes): open ' + D.hwUrl + ' on a phone. The link for the pupils: ' + url }));
  }

  var MODES = { game: '🎮 Game', think: '🤔 Think', listen: '👂 Listen', act: '🎭 Act it out', move: '🚶 Move', talk: '🗣️ Talk', race: '🏆 Team race', song: '🎶 Song' };
  var LESSONS = {
    1: { title: 'Chuseok Moon Song', missions: D.missions, door: '🚪 Door pass: show me ONE move and say it: "Step slowly." or "Hop quickly."', scenes: [
      { t: 'The Moon Night', mins: '4 min', mode: 'listen', run: moonOpen, intro: 'It is Chuseok night. Look at the moon! Three words, and our song.',
        kids: { steps: ['🌕 Look and listen', '👆 Tap a word', '🎵 Listen to our song'], say: ['moon', 'circle', 'family'] },
        tip: ['Week 3 of the Chuseok festival: Folk Dance & Rhythms. Make 4 teams (Moons, Stars, Rabbits, Lanterns). The class also fills one shared Moon Glow bar (20 = the moon shines bright).', 'Three words only: moon, circle, family. Then press play on our song (the real song file). The video is optional and needs the internet.'] },
      { t: 'Five Dance Words', mins: '6 min', mode: 'listen', run: danceWords, intro: 'Listen and do: step, turn, clap, hop, bow.',
        kids: { steps: ['👆 Tap a card and listen', '💃 Do the action', '🎴 Do it! Fast!'], say: ['step', 'turn', 'clap', 'hop', 'bow'] },
        tip: ['Five verbs only. Tap each card: the teacher voice says the word and the board says a sentence. Then press Do it!: a card shows and everybody does the action.'] },
      { t: 'Sing the Song', mins: '7 min', mode: 'song', run: songStep, intro: 'The leader calls. The whole circle answers: Ganggangsullae!',
        kids: { steps: ['🎤 Leader: say the line', '👥 Circle: answer Ganggangsullae!', '🥁 Move with the band'], say: ['We dance under the moon.', 'Ganggangsullae!'] },
        tip: ['The refrain "Ganggangsullae" belongs to the traditional Korean circle-dance song sung at Chuseok. The leader lines are simple English lines written for this lesson.', 'Press Sing with the band: the folk band plays; one bar for the leader line, one bar for the circle. Practise slowly first (Slower), then faster. Under the buttons you can play the real song file.'] },
      { t: 'GAME: Move Like the Moon', mins: '8 min', mode: 'move', run: moveCards, intro: 'Do the move. Listen to the band: slowly or quickly? Freeze when the bowl rings!',
        kids: { steps: ['👀 Read the move', '🥁 Hear the speed', '💃 Move like the card'], say: ['Step slowly.', 'Hop quickly.', 'Freeze like the moon!'] },
        tip: ['New language: slowly and quickly. The band really changes speed with the card (slow band, fast band). A new move comes every three bars; now and then the singing bowl rings and everybody freezes.', 'Clear space for a circle. Give +2 glow when the circle moves well together.'] },
      { t: 'GAME: Our Team Dance', mins: '9 min', mode: 'talk', run: teamDance, intro: 'Choose three moves. Say: First, Then, Finally. Dance it! Then the Moon Concert.',
        kids: { steps: ['👆 Choose 3 moves', '🗣️ Say: First, … Then, … Finally, …', '💃 Dance it with the band'], say: ['First, step slowly.', 'Then, hop quickly.', 'Finally, bow slowly.'] },
        tip: ['Each team chooses 3 move cards; the board writes the dance as three sentences, then the band plays and the voice says each move; the circle answers Ganggangsullae at the end. Great +2, good +1.', 'After the 4 teams: the Moon Concert plays all four dances in a row, with cheering. Record a short video if you want to share it for the festival (with the school\'s photo rules).'] },
      { t: 'Happy Chuseok!', mins: '1 min', mode: 'think', run: wrap, intro: 'You danced like a real circle!',
        kids: { steps: ['🏆 Cheer for every team', '🚪 Door pass: show one move and say it'], say: ['Step slowly.', 'Happy Chuseok!'] },
        tip: ['Show the scores. Tell the pupils about the 5-minute homework (link shown on the board). At the door each pupil shows one move and says it; you answer Ganggangsullae!'] }
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
