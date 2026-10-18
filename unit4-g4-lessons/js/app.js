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

  /* ============================== Unit 4 Grade 4: We Can Do It, The Dream Team League ============================== */
  function bgOf(el, name) { if (el && hasArt(name)) el.style.background = 'url(art/' + name + '.webp) center / cover'; }

  /* ---------- the Teamwork Meter: a team can only shoot a 3-pointer when ALL five pupils have spoken English ---------- */
  var meter = D.teams.map(function () { return {}; });
  function mCount(i) { return D.roles.filter(function (r) { return meter[i][r.n]; }).length; }
  function mFull(i) { return mCount(i) === D.roles.length; }
  function meterPanel() {
    var box = h('div', { class: 'mpanel' });
    function paint() {
      box.innerHTML = '';
      box.appendChild(h('div', { class: 'mtitle', text: '⚡ Teamwork Meter: tap a badge when that pupil speaks English' }));
      D.teams.forEach(function (t, i) {
        var row = h('div', { class: 'mrow', style: '--c:' + t.c }, [h('span', { class: 'mname', text: t.e + ' ' + t.n })]);
        D.roles.forEach(function (r) {
          row.appendChild(h('button', { type: 'button', class: 'mchip' + (meter[i][r.n] ? ' on' : ''), title: r.n + ': ' + r.job, text: r.e, onclick: function () {
            var wasFull = mFull(i); meter[i][r.n] = !meter[i][r.n]; sfx('tap'); paint();
            if (!wasFull && mFull(i)) { sfx('win'); confetti(); A.speak('Teamwork meter full! ' + t.n + ' can shoot a three-pointer.'); }
          } }));
        });
        row.appendChild(h('span', { class: 'mfull' + (mFull(i) ? ' on' : ''), text: mFull(i) ? '⚡ FULL' : mCount(i) + '/' + D.roles.length }));
        box.appendChild(row);
      });
    }
    paint(); box.repaint = paint; return box;
  }
  function teamBanner(i, label) {
    var t = D.teams[i], b = h('div', { class: 'gturn' });
    b.style.setProperty('--c', t.c); b.appendChild(h('span', { class: 'tn', text: t.e + ' ' + t.n + '’ turn' })); b.appendChild(h('span', { class: 'gb', text: label }));
    return b;
  }

  /* 1. Match Day opening: roles + meter */
  function opening(c) {
    var body = c.body;
    var stage = h('div', { class: 'hook-stage' }, [h('div', { class: 'stars-bg' })]); bgOf(stage, 'bg_team_stage');
    stage.appendChild(h('div', { class: 'mdtitle', text: '🏟️ DREAM TEAM LEAGUE · MATCH DAY 1' }));
    stage.appendChild(h('div', { class: 'hookq', style: 'display:block', text: 'Welcome, teams! Today we play like the Sparks: nobody wins alone.' }));
    var roles = h('div', { class: 'roles' }, D.roles.map(function (r) { return h('div', { class: 'role' }, [h('div', { class: 'em', text: r.e }), h('b', { text: r.n }), h('small', { text: r.job })]); }));
    var lg = leagueRead(), season = h('div', { class: 'msg gmsg', text: lg.days ? '📊 Season so far: ' + lg.line : '📊 This is the first match day of the season!' });
    body.appendChild(h('div', { class: 'row' }, [btn('🔊 Read the rules', 'amber', function () { A.speakSeq(['Welcome to the Dream Team League.', 'Each team has five roles. Every pupil has a badge.', 'A team can only shoot a three-pointer when all five pupils have spoken English.']); }), h('span', { class: 'lab', text: '5 pupils per team. Give each pupil a badge.' })]));
    body.appendChild(stage); body.appendChild(roles); body.appendChild(season); body.appendChild(meterPanel());
  }

  /* 2. GAME: Freeze Frame (book p. 57 Think, Pair, Share) */
  function freezeFrame(c) {
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    function start() {
      host.innerHTML = '';
      var ROUNDS = 6, round = 0, deck = shuffle(D.team), cur = null, shown = false;
      var banner = h('div'), card = h('div', { class: 'reqcard' }), msg = h('div', { class: 'msg gmsg' }), guessRow = h('div', { class: 'row points' });
      function acting() { return round % D.teams.length; }
      function draw() {
        if (round >= ROUNDS) { gameFinish(c, host, start); return; }
        cur = deck[round % deck.length]; shown = false;
        var nb = teamBanner(acting(), '🧊 Round ' + (round + 1) + ' of ' + ROUNDS); banner.replaceWith(nb); banner = nb;
        card.innerHTML = ''; card.appendChild(h('div', { class: 'rq-e', text: '❓' })); card.appendChild(h('div', { class: 'rq-t', text: 'Captain: look at the card. Team: FREEZE like this team!' }));
        msg.textContent = 'Other teams: Think, Pair, Share. How are they working together?';
        guessRow.innerHTML = ''; guessRow.appendChild(h('span', { class: 'lab', text: '🙋 Guessed with the sentence:' }));
        D.teams.forEach(function (t, i) { if (i !== acting()) guessRow.appendChild(h('button', { type: 'button', class: 'btn small', style: '--bg:' + t.c + ';--lip:rgba(0,0,0,.4)', text: t.e + ' +2', onclick: function () { addPoint(i, 2); addPoint(acting(), 1); meter[i]['Commentator'] = true; round++; draw(); } })); });
      }
      var peek = btn('👀 Show the card to the Captain (3 s)', 'amber', function () {
        card.innerHTML = ''; card.appendChild(fill(h('div', { class: 'rq-e' }), cur.e, '', cur.a)); card.appendChild(h('div', { class: 'rq-t', text: cur.who.replace('The ', '').toUpperCase() })); sfx('page');
        setTimeout(function () { if (!shown) { card.innerHTML = ''; card.appendChild(h('div', { class: 'rq-e', text: '🧊' })); card.appendChild(h('div', { class: 'rq-t', text: 'FREEZE! Guess the team.' })); } }, 3000);
      });
      var reveal = btn('💡 Reveal', 'violet', function () {
        shown = true; card.innerHTML = ''; card.appendChild(fill(h('div', { class: 'rq-e' }), cur.e, '', cur.a)); var s = cur.who + ' ' + cur.ing + '.'; card.appendChild(h('div', { class: 'rq-t', text: s })); A.speak(s); sfx('correct');
      });
      banner = h('div'); host.appendChild(h('div', { class: 'row' }, [timerBtn(c, 30), peek, reveal, btn('⏭ Skip', 'small ghost', function () { round++; draw(); })]));
      host.appendChild(banner); host.appendChild(card); host.appendChild(msg); host.appendChild(guessRow); host.appendChild(meterPanel());
      draw();
    }
    start();
  }

  /* 3. GAME: Court Shootout (book pp. 58-59 words: league, court, basket, score, shooting) */
  function courtShootout(c) {
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    function start() {
      host.innerHTML = '';
      var ROUNDS = 8, round = 0, turn = 0, deck = shuffle(D.words.concat(D.words)), shot = 0, word = null, phase = 'clue';
      var banner = h('div'), clue = h('div', { class: 'reqcard' }), msg = h('div', { class: 'msg gmsg' });
      var court = h('div', { class: 'courtbox' }, [h('div', { class: 'hoop', text: '🏀' }), h('div', { class: 'ball', text: '🟠' })]), ball = court.querySelector('.ball');
      var mp = meterPanel();
      var bShow = btn('👀 Show the word', 'amber'), b2 = btn('✅ Right: 2-point shot', 'green'), b3 = btn('⚡ Right: 3-POINT shot', 'violet'), bIn = btn('🏀 BASKET!', 'green big'), bMiss = btn('💨 Miss', 'ghost'), bSkip = btn('⏭ Next team', 'small ghost');
      function setPhase(p) { phase = p; [bShow, b2, b3, bSkip].forEach(function (b) { b.style.display = p === 'clue' ? '' : 'none'; }); [bIn, bMiss].forEach(function (b) { b.style.display = p === 'shot' ? '' : 'none'; }); }
      function draw() {
        if (round >= ROUNDS) { gameFinish(c, host, start); return; }
        word = deck[round]; shot = 0; ball.className = 'ball'; setPhase('clue');
        var nb = teamBanner(turn, '🏟️ Shot ' + (round + 1) + ' of ' + ROUNDS); banner.replaceWith(nb); banner = nb;
        clue.innerHTML = ''; clue.appendChild(h('div', { class: 'rq-e', text: '❓' })); clue.appendChild(h('div', { class: 'rq-t', text: word.gap })); clue.appendChild(h('div', { class: 'rq-a', text: 'Team: talk, then answer. Right = you shoot a paper ball into the bin!' }));
        msg.textContent = mFull(turn) ? '⚡ The Teamwork Meter is FULL: you may call a 3-POINT shot!' : 'Fill the meter (all five badges) to unlock the 3-point shot.'; A.speak(word.gap.replace(/_+/g, 'blank'));
      }
      function next() { round++; turn = (turn + 1) % D.teams.length; draw(); }
      bShow.onclick = function () { clue.innerHTML = ''; clue.appendChild(fill(h('div', { class: 'rq-e' }), word.e, '', word.a)); clue.appendChild(h('div', { class: 'rq-t', text: word.w + ': ' + word.ex })); A.speakSeq([word.w, word.ex]); sfx('correct'); };
      b2.onclick = function () { shot = 2; msg.textContent = '🏀 Shoot the paper ball! Basket = 2 points.'; setPhase('shot'); sfx('tap'); };
      b3.onclick = function () { if (!mFull(turn)) { msg.textContent = '⚡ Light all five badges first! Every pupil must speak.'; sfx('tap'); return; } shot = 3; msg.textContent = '🔥 THREE-POINTER from the far line! Basket = 3 points.'; setPhase('shot'); sfx('tap'); };
      bIn.onclick = function () { ball.className = 'ball fly'; addPoint(turn, shot); if (shot === 3) { meter[turn] = {}; mp.repaint(); } sfx('win'); confetti(); msg.textContent = '🎉 SWISH! ' + shot + ' points for ' + D.teams[turn].n + '!'; setTimeout(next, 1400); };
      bMiss.onclick = function () { ball.className = 'ball miss'; sfx('tap'); msg.textContent = 'So close! Great try. Next team!'; setTimeout(next, 1100); };
      bSkip.onclick = next;
      banner = h('div'); host.appendChild(h('div', { class: 'row' }, [timerBtn(c, 20), bShow, b2, b3, bIn, bMiss, bSkip]));
      host.appendChild(banner); host.appendChild(clue); host.appendChild(court); host.appendChild(msg); host.appendChild(mp);
      draw();
    }
    start();
  }

  /* 4. Live Commentary: the Sparks story (book pp. 58-60), the Commentator reads, the team acts */
  function sparksStory(c) {
    var scene = h('div', { class: 'bigscene' }), panel = h('div', { class: 'marketpanel' }, [scene]);
    bgOf(panel, 'bg_court'); c.body.appendChild(panel); fill(scene, '🏀', '', 'o_basketball');
    runStory(c, D.sparks, function (ch, predicting) {
      scene.innerHTML = '';
      if (!ch) { fill(scene, '🏆', '', 'o_league'); return; }
      fill(scene, predicting ? '🤔' : ch.scene, '', predicting ? null : ch.art);
    }, '🎙️ Commentators: read each part like a sports reporter! Teams: act it out!', 'What a game! Teams win and lose together.');
    c.body.appendChild(meterPanel());
  }

  /* 5. GAME: Morning Relay (book p. 61, sequence of events) */
  function orderGame(c) {
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    function start() {
      host.innerHTML = '';
      var round = 0, turn = 0, placed = 0, ROUNDS = D.order.length, set = null;
      var banner = h('div'), title = h('div', { class: 'prompt' }), list = h('div', { class: 'scr' }), line = h('div', { class: 'msg gmsg', text: '' });
      var rowDone = h('div', { class: 'reqcard' });
      function draw() {
        if (round >= ROUNDS) { gameFinish(c, host, start); return; }
        set = D.order[round]; placed = 0;
        var nb = teamBanner(turn, set.e + ' Story ' + (round + 1) + ' of ' + ROUNDS); banner.replaceWith(nb); banner = nb;
        title.textContent = 'Tap the sentences in the right order: ' + set.title; line.textContent = ''; rowDone.innerHTML = ''; list.innerHTML = '';
        shuffle(set.steps.map(function (s, k) { return { s: s, k: k }; })).forEach(function (o) {
          var tile = h('button', { type: 'button', class: 'btn tile2 chip2', text: o.s, onclick: function () { pick(tile, o); } }); list.appendChild(tile);
        });
      }
      function pick(tile, o) {
        if (o.k !== placed) { tile.classList.remove('wobble'); void tile.offsetWidth; tile.classList.add('wobble'); sfx('tap'); line.textContent = 'Almost! Look again. What happens ' + D.orderWords[placed].toLowerCase().replace(',', '') + '?'; A.speak('Try again.'); return; }
        var text = D.orderWords[placed] + ' ' + o.s.charAt(0).toLowerCase() + o.s.slice(1);
        rowDone.appendChild(h('div', { class: 'rq-t', text: placed + 1 + '. ' + text })); tile.style.display = 'none'; A.speak(text); sfx('correct'); placed++;
        if (placed >= set.steps.length) { addPoint(turn, 3); confetti(); line.textContent = '⭐ +3 points for ' + D.teams[turn].n + '! Now the Scorer retells it: First, … Then, …'; sfx('win'); round++; turn = (turn + 1) % D.teams.length; nb2.style.display = ''; }
      }
      var nb2 = btn('Next story ▶', 'green big', function () { nb2.style.display = 'none'; draw(); }); nb2.style.display = 'none';
      banner = h('div'); host.appendChild(h('div', { class: 'row' }, [timerBtn(c, 45), nb2]));
      host.appendChild(banner); host.appendChild(title); host.appendChild(list); host.appendChild(rowDone); host.appendChild(line);
      host.appendChild(h('div', { class: 'row' }, D.orderWords.map(function (w) { return h('button', { type: 'button', class: 'chip2', text: w, onclick: function () { A.speak(w.replace(',', '')); } }); })));
      draw();
    }
    start();
  }

  /* 6. GAME: Disaster Cards (a taste of the play "Late for the Show": Why don't we ...?) */
  function disasterCards(c) {
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    function start() {
      host.innerHTML = '';
      var ROUNDS = 8, round = 0, deck = shuffle(D.disasters), cur = null;
      var banner = h('div'), card = h('div', { class: 'reqcard' }), msg = h('div', { class: 'msg gmsg' });
      function turn() { return round % D.teams.length; }
      function back() { cur = null; card.innerHTML = ''; card.appendChild(h('div', { class: 'rq-e', text: '🎴' })); card.appendChild(h('div', { class: 'rq-t', text: 'Press DRAW. A problem happens! Help each other.' })); }
      function draw() {
        if (round >= ROUNDS) { gameFinish(c, host, start); return; }
        var nb = teamBanner(turn(), '🎭 Problem ' + (round + 1) + ' of ' + ROUNDS); banner.replaceWith(nb); banner = nb; back(); msg.textContent = 'Say: “Why don’t we …?” Every pupil gives one idea!';
      }
      var drawBtn = btn('🎴 DRAW a problem card', 'amber big', function () {
        cur = deck[round % deck.length]; card.innerHTML = ''; card.appendChild(fill(h('div', { class: 'rq-e' }), cur.e)); card.appendChild(h('div', { class: 'rq-t', text: cur.t })); A.speak(cur.t); sfx('page');
      });
      var model = btn('💡 Model sentence', 'violet', function () { if (!cur) return; msg.textContent = '💡 ' + cur.a; A.speak(cur.a); sfx('correct'); });
      function done(pts) { if (pts) { addPoint(turn(), pts); if (pts === 2) confetti(); } round++; draw(); }
      banner = h('div'); host.appendChild(h('div', { class: 'row' }, [timerBtn(c, 30), drawBtn, model, btn('✅ Great idea (+2)', 'green', function () { done(2); }), btn('👍 Good (+1)', 'violet', function () { done(1); }), btn('⏭ Skip', 'small ghost', function () { done(0); })]));
      host.appendChild(banner); host.appendChild(card); host.appendChild(msg); host.appendChild(meterPanel());
      draw();
    }
    start();
  }

  /* 7. League table + Teamwork Cup */
  function leagueKey() { var m = /[?&]class=([^&]+)/.exec(location.search || ''); return 'u4g4_league_' + (m ? decodeURIComponent(m[1]) : 'all'); }
  function leagueData() { try { var d = JSON.parse(localStorage.getItem(leagueKey()) || 'null'); if (d && d.md) return d; } catch (e) { /* storage may be blocked */ } return { md: {} }; }
  function leagueRead() {
    var d = leagueData(), tot = D.teams.map(function () { return 0; }), days = Object.keys(d.md);
    days.forEach(function (k) { (d.md[k] || []).forEach(function (v, i) { tot[i] += Number(v) || 0; }); });
    return { days: days.length, tot: tot, line: D.teams.map(function (t, i) { return t.e + ' ' + tot[i]; }).join('  ') };
  }
  function leagueScene(c) {
    var body = c.body; podium(body);
    var cup = h('div', { class: 'row', style: 'justify-content:center' }, [h('span', { class: 'lab', text: '🏆 Teamwork Cup (+3 for a FULL meter):' })]);
    D.teams.forEach(function (t, i) {
      if (mFull(i)) cup.appendChild(btn(t.e + ' ' + t.n + ' +3', 'green small', function () { addPoint(i, 3); sfx('win'); confetti(); }));
    });
    if (cup.children.length === 1) cup.appendChild(h('span', { class: 'lab', text: 'No team had all five badges. Next match day!' }));
    var table = h('div', { class: 'msg gmsg' });
    function paint() { var lg = leagueRead(); table.textContent = lg.days ? '📊 League after ' + lg.days + ' match day(s): ' + lg.line : '📊 Press Save to start the league table.'; }
    paint();
    var save = btn('💾 Save Match Day 1 to the league', 'amber', function () {
      var d = leagueData(); d.md['1'] = state.scores.slice(); try { localStorage.setItem(leagueKey(), JSON.stringify(d)); } catch (e) { /* ignore */ } paint(); sfx('win'); save.textContent = '✅ Saved (this computer only)';
    });
    body.appendChild(cup); body.appendChild(h('div', { class: 'row', style: 'justify-content:center' }, [save, btn('🎉 Celebrate!', 'violet', function () { sfx('win'); confetti(); })])); body.appendChild(table);
    body.appendChild(h('div', { class: 'door', text: LESSONS[1].door })); sfx('win'); confetti();
  }

  var MODES = { game: '🎮 Game', think: '🤔 Think', listen: '👂 Listen', act: '🎭 Act it out', move: '🚶 Move', talk: '🗣️ Talk', race: '🏆 Team race' };
  var LESSONS = {
    1: { title: 'Dream Team League · Match Day 1', missions: D.l1missions, door: '🚪 Door pass: say one sentence: "I am on a team and I …" or "The Sparks were losing, but …" (or one new word: league, court, basket, score, shooting).', scenes: [
      { t: 'Match Day 1: Meet the Team', mins: '3 min', mode: 'think', run: opening, intro: 'Welcome to the Dream Team League! Get your badge. Nobody wins alone.',
        kids: { steps: ['🧢 Take a badge: Captain, Coach, Commentator, Scorer or Mascot', '👀 Look at the Teamwork Meter', '🗣️ Every pupil must speak to fill it'], say: ['We are a team.', 'I am the Captain.'] },
        tip: ['Book link: Unit 4 "We Can Do It" opener, p. 56 (working together).', 'Make 4 teams of 4-5. Give each pupil a role badge (paper card). Explain: a team can only shoot a THREE-POINTER when all five badges are lit. Tap a badge each time that pupil says an English sentence. Roles rotate next lesson.'] },
      { t: 'GAME: Freeze Frame', mins: '7 min', mode: 'game', run: freezeFrame, intro: 'One team freezes like a team from the book. The others guess and say a sentence.',
        kids: { steps: ['🧊 The acting team FREEZES in a pose', '🤔 Others: Think, Pair, Share', '🗣️ Guess with a full sentence'], say: ['The dancers are moving with the music.', 'We think everyone is listening to one another.'] },
        tip: ['Book link: Think, Pair, Share, p. 57 (A-D). Frames: "The dancers are moving with the music." / "We think everyone is listening to one another."', 'Press Show: only the acting Captain looks (3 seconds), then the team freezes. Other teams discuss, then say the sentence. The first right team taps +2 and the Commentator badge lights.'] },
      { t: 'GAME: Court Shootout', mins: '8 min', mode: 'game', run: courtShootout, intro: 'Answer the word clue, then shoot a paper ball into the bin! Full meter = 3-pointer.',
        kids: { steps: ['❓ Read the clue and talk in your team', '✅ Right answer = you shoot', '⚡ Full meter = a 3-point shot from far away'], say: ['The answer is court.', 'Ten players are on the court.'] },
        tip: ['Book link: Words in Context, pp. 58-59 (league, court, basket, score, shooting).', 'Put a bin or box at the front (2-point line) and mark a far line (3-point line) with tape. A right answer lets one pupil shoot a paper ball: BASKET = points. A 3-point shot needs the Teamwork Meter full; it empties after the shot.'] },
      { t: 'Live Commentary: The Sparks', mins: '6 min', mode: 'act', run: sparksStory, intro: 'Commentators read like sports reporters. The team acts out the game!',
        kids: { steps: ['🎙️ Commentator: read the part loudly', '🎭 Team: act it out', '🤔 Guess the big moment'], say: ['The Sparks are losing by five points.', 'She scores three points!'] },
        tip: ['Book link: "Teamwork Makes the Dream Work", pp. 58-59. An oral preview in very simple words; the book text is read in lesson 2.', 'Press the green button for each part. The Commentator of one team repeats in a sports-reporter voice; the team acts. At the 🤔 part let pupils predict, then reveal.'] },
      { t: 'GAME: Morning Relay', mins: '5 min', mode: 'game', run: orderGame, intro: 'Put the sentences in order. Use: first, then, after that, finally.',
        kids: { steps: ['👀 Read the four sentences', '👆 Tap them in the right order', '🔢 Scorer retells: First, … Then, …'], say: ['First, I wake up.', 'Then, I eat breakfast.', 'After that, …', 'Finally, …'] },
        tip: ['Book link: Understanding the Sequence of Events, p. 61 (Paige\'s morning, the first event / after that).', 'A wrong tap wobbles softly: no points lost. When a team finishes, its Scorer retells the story with First, Then, After that, Finally.'] },
      { t: 'GAME: Disaster Cards', mins: '4 min', mode: 'talk', run: disasterCards, intro: 'A problem happens! Say: Why don\'t we …? Every pupil gives one idea.',
        kids: { steps: ['🎴 Draw a problem card', '💬 Everyone gives an idea', '🗣️ Say: Why don\'t we …?'], say: ['Why don\'t we take the train?', 'Why don\'t we perform here, now?', 'We can do it together!'] },
        tip: ['Book link: a first taste of the play "Late for the Show", pp. 62-69 ("Why don\'t we perform the show here, now?").', 'Teams draw problem cards (traffic, train stopped, no costume). Each pupil says one idea with "Why don\'t we …?". +2 for every pupil speaking, +1 if only some do. Light the badges on the meter.'] },
      { t: 'League Table & Teamwork Cup', mins: '2 min', mode: 'think', run: leagueScene, intro: 'Match Day 1 is over! Who filled the Teamwork Meter?',
        kids: { steps: ['🏆 Cheer for every team', '🚪 Door pass: one sentence for the teacher'], say: ['I am on a team and I …', 'Teamwork makes the dream work!'] },
        tip: ['Show the scores. Teams with a FULL meter get the Teamwork Cup (+3). Save Match Day 1: the league table stays on this computer for the next match days (add ?class=4a to the link to keep a table per class). At the door each pupil says one sentence (book p. 71 C).'] }
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
