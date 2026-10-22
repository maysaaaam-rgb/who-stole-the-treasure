/* Unit 4 Review: remember it, then play: teacher-led smartboard lessons (35 minutes each). The board is the stage, timer and scoreboard.
   The children move, act, talk and play. Four teams earn points all lesson. One smartboard. Built from the Unit 3 lesson shell. */
(function () {
  'use strict';
  var D = window.RevU4Data, A = window.ForestAudio;
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
  var ART = { '🖼️': 'o_mona_frame', '🥷': 'o_steal', '🏋️': 'o_lifted', '📰': 'o_newspaper', '👮': 'o_arrested', '🏆': 'o_league', '🙌': 'o_shooting', '🏀': 'o_basketball', '🚗': 'o_traffic', '🚇': 'o_train', '🎭': 'o_curtain', '💡': 'c_lynn' };
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
    var host = $('stage'), em = ['⭐', '🎉', '🌟', '✨', '🖼️', '🎭'], k, w = h('div', { class: 'confetti' });
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

  /* ============================== Review lessons: shared pieces ============================== */
  function bgOf(el, name) { if (el && hasArt(name)) el.style.background = 'url(art/' + name + '.webp) center / cover'; }
  function teamBanner(i, label) {
    var t = D.teams[i], b = h('div', { class: 'gturn' });
    b.style.setProperty('--c', t.c); b.appendChild(h('span', { class: 'tn', text: t.e + ' ' + t.n + '’ turn' })); b.appendChild(h('span', { class: 'gb', text: label }));
    return b;
  }
  /* Every game starts with ONE clear screen: the goal, what the pupils do, what the teacher does. Then START. */
  function howTo(c, spec, build) {
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    function run() { host.innerHTML = ''; host.appendChild(h('div', { class: 'rulebar' }, [h('b', { text: spec.icon + ' ' + spec.title + ': ' }), h('span', { text: spec.goal })])); var inner = h('div', { class: 'gameinner' }); host.appendChild(inner); build(inner, run); }
    function show() {
      host.innerHTML = '';
      var rows = [['🎯 THE GAME', spec.goal], ['👥 PUPILS', spec.pupils], ['🧑‍🏫 TEACHER', spec.teacher]];
      var box = h('div', { class: 'howto' }, [h('div', { class: 'howhead', text: spec.icon + ' ' + spec.title })]);
      rows.forEach(function (r) { box.appendChild(h('div', { class: 'howrow' }, [h('b', { text: r[0] }), h('span', { text: r[1] })])); });
      box.appendChild(btn('▶ START', 'green big', function () { sfx('page'); run(); }));
      host.appendChild(box); A.speak(spec.goal);
    }
    show();
  }
  /* the first screen of a lesson: today's three games */
  function todayScreen(c, intro, cards) {
    var grid = h('div', { class: 'today' }, cards.map(function (k, i) {
      return h('div', { class: 'today-card' }, [h('div', { class: 'tn-num', text: String(i + 1) }), fill(h('div', { class: 'tn-em' }), k.e, '', k.a), h('b', { text: k.t }), h('span', { text: k.s })]);
    }));
    c.body.appendChild(h('div', { class: 'msg gmsg', text: intro })); c.body.appendChild(grid);
    c.body.appendChild(h('div', { class: 'row' }, [btn('🔊 Read it', 'amber', function () { A.speak(intro + ' ' + cards.map(function (k, i) { return 'Game ' + (i + 1) + ': ' + k.t + '.'; }).join(' ')); })]));
  }
  /* a one-sentence order game: tap the sentences in the right order (soft fail: a wrong tap wobbles with a hint, no points lost) */
  function orderRace(c, sets, pts) {
    howTo(c, { icon: '🔢', title: 'Put it in order', goal: 'Put the four sentences in the right order.', pupils: 'Read the four sentences. Decide the order together. Say it: First, Then, After that, Finally.', teacher: 'Tap the sentences in the order your team says. Right order = ' + pts + ' points.' }, function (host, again) {
      var round = 0, turn = 0, placed = 0, set = null;
      var banner = h('div'), title = h('div', { class: 'prompt' }), list = h('div', { class: 'scr' }), done = h('div', { class: 'reqcard' }), msg = h('div', { class: 'msg gmsg' }), nb2;
      var WORDS = ['First,', 'Then,', 'After that,', 'Finally,'];
      function draw() {
        if (round >= sets.length) { gameFinish(c, host, again); return; }
        set = sets[round]; placed = 0; var nb = teamBanner(turn, set.e + ' Story ' + (round + 1) + ' of ' + sets.length); banner.replaceWith(nb); banner = nb;
        title.textContent = set.title; msg.textContent = ''; done.innerHTML = ''; list.innerHTML = '';
        shuffle(set.steps.map(function (s, k) { return { s: s, k: k }; })).forEach(function (o) {
          var tile = h('button', { type: 'button', class: 'btn tile2 chip2' }, [set.art && set.art[o.k] && hasArt(set.art[o.k]) ? art(set.art[o.k], 'tilepic') : null, h('span', { text: o.s })]);
          tile.addEventListener('click', function () { pick(tile, o); }); list.appendChild(tile);
        });
      }
      function pick(tile, o) {
        if (o.k !== placed) { tile.classList.remove('wob', 'wobble'); void tile.offsetWidth; tile.classList.add('wobble'); sfx('soft'); msg.textContent = 'Almost! What happens ' + WORDS[placed].toLowerCase().replace(',', '') + '?'; A.speak('Try again.'); return; }
        done.appendChild(h('div', { class: 'rq-t', text: WORDS[placed] + ' ' + o.s.charAt(0).toLowerCase() + o.s.slice(1) })); tile.style.display = 'none'; A.speak(o.s); sfx('correct'); placed++;
        if (placed >= set.steps.length) { addPoint(turn, pts); confetti(); msg.textContent = '⭐ +' + pts + ' points for ' + D.teams[turn].n + '! Now tell the story with your own words.'; sfx('win'); round++; turn = (turn + 1) % D.teams.length; nb2.style.display = ''; }
      }
      nb2 = btn('Next ▶', 'green big', function () { nb2.style.display = 'none'; draw(); }); nb2.style.display = 'none';
      banner = h('div'); host.appendChild(banner); host.appendChild(title); host.appendChild(list); host.appendChild(done); host.appendChild(msg); host.appendChild(h('div', { class: 'row' }, [nb2]));
      draw();
    });
  }
  /* the last screen: scores, the speaking minute and the door pass */
  function finishScreen(c, title, sentences, door) {
    podium(c.body);
    c.body.appendChild(h('div', { class: 'msg gmsg', text: '🗣️ Speaking minute: each team says one sentence.' }));
    c.body.appendChild(h('div', { class: 'row' }, sentences.map(function (s) { return h('button', { type: 'button', class: 'chip2', text: s, onclick: function () { A.speak(s.replace(/…/g, '')); } }); })));
    c.body.appendChild(h('div', { class: 'door', text: door })); sfx('win'); confetti();
  }

  /* ============================== Unit 4 Review: Part 1 remember it, Part 2 play it in Game Maker ============================== */
  var G = D.g;
  function todayU(c) {
    todayScreen(c, 'Lesson 1: let us REMEMBER Unit 4. Lesson 2: games!', [
      { e: '📖', t: 'Stories and words', s: 'Retell it, say it, act it', a: D.grade === 4 ? 'o_curtain' : 'o_mona_frame' },
      { e: '🔢', t: 'Order and cause', s: 'What happened first? Why?', a: D.grade === 4 ? 'o_train' : 'o_newspaper' },
      { e: '❓', t: 'Reading quiz', s: 'Think and answer', a: '' }
    ]);
  }

  /* PART 1a: Story cards: look, retell, then the team fills the gap */
  function storyCards(c) {
    howTo(c, { icon: '📖', title: 'Remember the stories', goal: 'Look at the picture. Retell what happened. Say the missing word!', pupils: 'Look at the picture. Say what happened with your team. Then choose the missing word.', teacher: 'Press SHOW LINE to read the story line, then the team taps the word. Right = 1 point; a wrong tap wobbles with a hint, no points lost.' }, function (host, again) {
      var deck = G.cards, round = 0, turn = 0, tries = 0, cur = null;
      var banner = h('div'), card = h('div', { class: 'reqcard' }), line = h('div', { class: 'msg gmsg' }), opts = h('div', { class: 'row bigopts' }), row = h('div', { class: 'row' });
      function draw() {
        if (round >= deck.length) { gameFinish(c, host, again); return; }
        cur = deck[round]; tries = 0; var nb = teamBanner(turn, '📖 Story ' + (round + 1) + ' of ' + deck.length); banner.replaceWith(nb); banner = nb;
        card.innerHTML = ''; card.appendChild(fill(h('div', { class: 'rq-e big' }), cur.e, '', cur.a)); card.appendChild(h('div', { class: 'rq-t', text: cur.q })); line.textContent = 'What happened? Retell it with your team.'; opts.innerHTML = ''; row.innerHTML = '';
        row.appendChild(btn('📢 SHOW LINE', 'ghost', function () { line.textContent = cur.t; A.speak(cur.t); }));
        shuffle(cur.o.map(function (t, k) { return { t: t, k: k }; })).forEach(function (o) {
          var b = btn(o.t, 'amber big', function () {
            if (o.k === 0) { if (tries === 0) addPoint(turn, 1); sfx('correct'); line.textContent = '✅ ' + cur.t + (tries === 0 ? '  +1' : ''); A.speak(cur.t); round++; turn = (turn + 1) % D.teams.length; setTimeout(draw, 2200); }
            else { tries++; b.classList.remove('wob', 'wobble'); void b.offsetWidth; b.classList.add('wobble'); sfx('soft'); line.textContent = 'Almost! Look at the picture and think again.'; A.speak('Try again.'); }
          }); opts.appendChild(b);
        });
        A.speak(cur.q.replace(/_+/g, 'blank'));
      }
      banner = h('div'); host.appendChild(banner); host.appendChild(card); host.appendChild(opts); host.appendChild(line); host.appendChild(row);
      draw();
    });
  }

  /* PART 1b: Cause and effect: tap the effect that matches the cause */
  function causeEffect(c) {
    howTo(c, { icon: '➡️', title: 'Cause and effect', goal: 'A cause is WHY something happens. The effect is WHAT happens. Match them!', pupils: 'Read the cause. Choose the effect. Say: "Because ..., ..."', teacher: 'The team taps the effect. Right = 2 points. A wrong tap wobbles with a hint, nothing is lost. Ask the team to say the sentence with "because".' }, function (host, again) {
      var deck = shuffle(G.ce), round = 0, turn = 0, cur = null, tries = 0;
      var banner = h('div'), causeBox = h('div', { class: 'reqcard' }), opts = h('div', { class: 'row bigopts' }), msg = h('div', { class: 'msg gmsg' });
      function draw() {
        if (round >= deck.length) { gameFinish(c, host, again); return; }
        cur = deck[round]; tries = 0; var nb = teamBanner(turn, '➡️ Pair ' + (round + 1) + ' of ' + deck.length); banner.replaceWith(nb); banner = nb;
        causeBox.innerHTML = ''; causeBox.appendChild(h('div', { class: 'rq-e', text: '❓' })); causeBox.appendChild(h('div', { class: 'rq-a', text: 'CAUSE (why)' })); causeBox.appendChild(h('div', { class: 'rq-t', text: cur.c })); msg.textContent = 'What happened because of this? Choose the EFFECT.'; opts.innerHTML = '';
        shuffle([{ t: cur.e, ok: true }].concat(cur.w.map(function (x) { return { t: x, ok: false }; }))).forEach(function (o) {
          var b = btn(o.t, 'amber big', function () {
            if (o.ok) { if (tries === 0) addPoint(turn, 2); sfx('correct'); msg.textContent = '✅ ' + cur.c.replace(/\.$/, '') + ', so ' + cur.e.charAt(0).toLowerCase() + cur.e.slice(1) + (tries === 0 ? '  +2' : ''); A.speak(cur.c + ' ' + cur.e); round++; turn = (turn + 1) % D.teams.length; setTimeout(draw, 2600); }
            else { tries++; b.classList.remove('wob', 'wobble'); void b.offsetWidth; b.classList.add('wobble'); sfx('soft'); msg.textContent = 'Almost! Think: what really happens after the cause?'; A.speak('Try again.'); }
          }); opts.appendChild(b);
        });
        A.speak(cur.c);
      }
      banner = h('div'); host.appendChild(banner); host.appendChild(causeBox); host.appendChild(opts); host.appendChild(msg);
      draw();
    });
  }

  /* PART 1c: Words: say the missing word, then ACT it */
  function wordsRecap(c) {
    howTo(c, { icon: '🔤', title: 'Words from the unit', goal: 'Say the missing word, then ACT the word!', pupils: 'The team says the missing word. Then the whole team acts it for three seconds.', teacher: 'Press SHOW to reveal the word. The board says it and tells the team how to act. 2 points for a great act, 1 for a good try.' }, function (host, again) {
      var deck = shuffle(G.words), round = 0, turn = 0, word = null, stage = 'clue';
      var banner = h('div'), clue = h('div', { class: 'reqcard' }), msg = h('div', { class: 'msg gmsg' }), row = h('div', { class: 'row' });
      function buttons() {
        row.innerHTML = '';
        if (stage === 'clue') row.appendChild(btn('👀 SHOW the word', 'amber big', function () { stage = 'act'; clue.innerHTML = ''; clue.appendChild(fill(h('div', { class: 'rq-e' }), word.e, '', word.a)); clue.appendChild(h('div', { class: 'rq-t', text: word.w + ': ' + word.ex.replace(/_+/g, word.w) })); A.speakSeq([word.w, word.ex.replace(/_+/g, word.w)]); sfx('correct'); msg.textContent = '🎭 ACT it: ' + word.act; buttons(); }));
        else { row.appendChild(btn('⭐ Great act! +2', 'green big', function () { addPoint(turn, 2); sfx('win'); confetti(); next(1000); })); row.appendChild(btn('👍 Good try +1', 'ghost', function () { addPoint(turn, 1); sfx('correct'); next(800); })); }
      }
      function next(ms) { setTimeout(function () { round++; turn = (turn + 1) % D.teams.length; draw(); }, ms); }
      function draw() {
        if (round >= deck.length) { gameFinish(c, host, again); return; }
        word = deck[round]; stage = 'clue'; var nb = teamBanner(turn, '🔤 Word ' + (round + 1) + ' of ' + deck.length); banner.replaceWith(nb); banner = nb;
        clue.innerHTML = ''; clue.appendChild(fill(h('div', { class: 'rq-e' }), '❓', '', null)); clue.appendChild(h('div', { class: 'rq-t', text: word.ex })); msg.textContent = 'Team: talk, then say the word.'; A.speak(word.ex.replace(/_+/g, 'blank')); buttons();
      }
      banner = h('div'); host.appendChild(banner); host.appendChild(clue); host.appendChild(msg); host.appendChild(row); host.appendChild(h('div', { class: 'row' }, [timerBtn(c, 20)]));
      draw();
    });
  }

  /* PART 1d: Put the events in order */
  function orderU(c) { orderRace(c, G.order, 3); }

  /* PART 1e: Reading quiz: questions about the readings */
  function readingQuiz(c) {
    howTo(c, { icon: '❓', title: 'Reading quiz', goal: 'Answer questions about the stories. Think, then choose!', pupils: 'Talk with your team for 10 seconds. Then say your answer out loud.', teacher: 'Tap the answer your team says. Right = 1 point. A wrong tap gives a hint and they try again, nothing is lost.' }, function (host, again) {
      var deck = shuffle(G.quiz), round = 0, turn = 0, tries = 0, cur = null;
      var banner = h('div'), card = h('div', { class: 'reqcard' }), opts = h('div', { class: 'row bigopts' }), msg = h('div', { class: 'msg gmsg' });
      function draw() {
        if (round >= deck.length) { gameFinish(c, host, again); return; }
        cur = deck[round]; tries = 0; var nb = teamBanner(turn, '❓ Question ' + (round + 1) + ' of ' + deck.length); banner.replaceWith(nb); banner = nb;
        card.innerHTML = ''; card.appendChild(h('div', { class: 'rq-e', text: cur.e })); card.appendChild(h('div', { class: 'rq-t', text: cur.q })); msg.textContent = ''; opts.innerHTML = '';
        shuffle(cur.o.map(function (t, k) { return { t: t, k: k }; })).forEach(function (o) {
          var b = btn(o.t, 'amber big', function () {
            if (o.k === 0) { if (tries === 0) addPoint(turn, 1); sfx('correct'); msg.textContent = '✅ ' + cur.o[0] + (tries === 0 ? '  +1' : ''); A.speak(cur.o[0]); round++; turn = (turn + 1) % D.teams.length; setTimeout(draw, 1500); }
            else { tries++; b.classList.remove('wob', 'wobble'); void b.offsetWidth; b.classList.add('wobble'); sfx('soft'); msg.textContent = 'Almost! ' + cur.h; A.speak('Try again.'); }
          }); opts.appendChild(b);
        });
        A.speak(cur.q);
      }
      banner = h('div'); host.appendChild(banner); host.appendChild(card); host.appendChild(opts); host.appendChild(msg); host.appendChild(h('div', { class: 'row' }, [timerBtn(c, 10)]));
      draw();
    });
  }

  /* ===== LESSON 3: speaking check ===== */
  function todaySp(c) {
    todayScreen(c, 'Speaking check: talk in the PAST. Speak in full sentences!', [
      { e: '👀', t: 'Look and talk', s: 'What happened here?', a: D.grade === 4 ? 'o_traffic' : 'o_mona_frame' },
      { e: '🗣️', t: 'Ask and answer', s: 'With your partner', a: '' },
      { e: '🎤', t: 'Interview', s: 'Reporter and star', a: '' }
    ]);
  }

  function warmSp(c) {
    var i = 0, host = h('div', { class: 'gameinner' }), pic = h('div', { class: 'reqcard' }), msg = h('div', { class: 'msg gmsg' }), row = h('div', { class: 'row' });
    c.body.appendChild(h('div', { class: 'rulebar' }, [h('b', { text: '👀 Look and talk: ' }), h('span', { text: 'Look at the picture. Say what happened!' })]));
    function draw() {
      var w = G.warm[i]; pic.innerHTML = ''; pic.appendChild(fill(h('div', { class: 'rq-e big' }), w.e, '', w.a)); pic.appendChild(h('div', { class: 'rq-t', text: w.q })); msg.textContent = 'Talk with your partner. Then one pair says it.'; A.speak(w.q); row.innerHTML = '';
      row.appendChild(btn('👀 SHOW the answer', 'amber big', function () { msg.textContent = w.ans; A.speak(w.ans); sfx('correct'); }));
      row.appendChild(btn('⭐ Pair spoke +1', 'green', function () { addPoint(i % D.teams.length, 1); sfx('correct'); }));
      row.appendChild(btn(i + 1 < G.warm.length ? 'Next picture ▶' : 'Done ✔', 'ghost', function () { if (i + 1 < G.warm.length) { i++; draw(); } else { msg.textContent = '✅ Good warm-up! Press Next on the right for the next step.'; } }));
    }
    c.body.appendChild(host); host.appendChild(pic); host.appendChild(msg); host.appendChild(row); host.appendChild(h('div', { class: 'row' }, [timerBtn(c, 20)]));
    draw();
  }

  function qaSp(c) {
    howTo(c, { icon: '🗣️', title: 'Ask and answer', goal: 'Pupil A asks. Pupil B answers in a full past sentence. Then swap!', pupils: 'Ask the question on the board to your partner. Answer with the PAST: He stole... They found... Then swap roles.', teacher: 'Walk around and listen. SHOW the model answer when you want. Press ⭐ for a full correct sentence (+2) or 👍 for a good try (+1). After every four questions: stand up and find a new partner!' }, function (host, again) {
      var deck = G.sq, round = 0, turn = 0;
      var banner = h('div'), card = h('div', { class: 'reqcard' }), msg = h('div', { class: 'msg gmsg' }), row = h('div', { class: 'row' });
      function next(ms) { setTimeout(function () { round++; turn = (turn + 1) % D.teams.length; draw(); }, ms); }
      function draw() {
        if (round >= deck.length) { gameFinish(c, host, again); return; }
        var cur = deck[round], nb = teamBanner(turn, '🗣️ Question ' + (round + 1) + ' of ' + deck.length); banner.replaceWith(nb); banner = nb;
        card.innerHTML = ''; card.appendChild(h('div', { class: 'rq-e', text: '🙋' })); card.appendChild(h('div', { class: 'rq-t', text: cur[0] }));
        msg.textContent = round > 0 && round % 4 === 0 ? '🔄 Stand up! Find a NEW partner. Then ask this question.' : 'A asks. B answers. Then swap.'; A.speak(cur[0]); row.innerHTML = '';
        row.appendChild(btn('👀 SHOW model answer', 'ghost', function () { msg.textContent = '💬 ' + cur[1]; A.speak(cur[1]); }));
        row.appendChild(btn('⭐ Full sentence +2', 'green', function () { addPoint(turn, 2); sfx('win'); confetti(); next(900); }));
        row.appendChild(btn('👍 Good try +1', 'amber', function () { addPoint(turn, 1); sfx('correct'); next(700); }));
      }
      banner = h('div'); host.appendChild(banner); host.appendChild(card); host.appendChild(msg); host.appendChild(row); host.appendChild(h('div', { class: 'row' }, [timerBtn(c, 45)]));
      draw();
    });
  }

  function happenSp(c) {
    howTo(c, { icon: '🖼️', title: 'It happened... it did not happen', goal: 'Three pictures: ONE really happened. Two did NOT. Say which one happened and what did not.', pupils: 'Look at the three pictures. Say: "(It) ... " for the true one. Then say two things that did NOT happen: "He didn’t ..."', teacher: 'The pair talks. Tap the picture they choose. Right = the card shows all three sentences. Wrong = a hint and try again, nothing lost. Then press ⭐ +3 (all three sentences), 👍 +2 or 💬 +1.' }, function (host, again) {
      var deck = shuffle(G.happen), round = 0, turn = 0, tries = 0;
      var banner = h('div'), q = h('div', { class: 'prompt' }), grid = h('div', { class: 'row bigopts' }), msg = h('div', { class: 'msg gmsg' }), rate = h('div', { class: 'row' });
      function draw() {
        if (round >= deck.length) { gameFinish(c, host, again); return; }
        var cur = deck[round]; tries = 0; var nb = teamBanner(turn, '🖼️ Round ' + (round + 1) + ' of ' + deck.length); banner.replaceWith(nb); banner = nb;
        q.textContent = cur.q; msg.textContent = 'Which one happened? Talk with your partner, then tap it.'; grid.innerHTML = ''; rate.innerHTML = ''; A.speak(cur.q);
        shuffle(cur.items).forEach(function (it) {
          var b = h('button', { type: 'button', class: 'btn tile2 chip2 hp' }, [fill(h('div', { class: 'hpic' }), it.e, '', it.a), h('span', { class: 'cap', text: '' })]);
          b.addEventListener('click', function () {
            if (!it.ok) { tries++; b.classList.remove('wob', 'wobble'); void b.offsetWidth; b.classList.add('wobble'); sfx('soft'); msg.textContent = 'Almost! Think about the story. What really happened?'; A.speak('Try again.'); return; }
            sfx('correct'); [].slice.call(grid.children).forEach(function (btn2, k) { btn2.disabled = true; });
            cur.items.forEach(function (x, k) { var el = [].slice.call(grid.children).filter(function (e2) { return e2.__it === x; })[0]; if (el) { el.querySelector('.cap').textContent = (x.ok ? '✅ ' : '❌ ') + x.s; el.style.opacity = x.ok ? '1' : '.75'; } });
            msg.textContent = '✅ ' + it.s; A.speak(it.s);
            rate.innerHTML = '';
            rate.appendChild(btn('⭐ All three sentences +3', 'green big', function () { addPoint(turn, 3); sfx('win'); confetti(); round++; turn = (turn + 1) % D.teams.length; draw(); }));
            rate.appendChild(btn('👍 Good +2', 'amber', function () { addPoint(turn, 2); sfx('correct'); round++; turn = (turn + 1) % D.teams.length; draw(); }));
            rate.appendChild(btn('💬 Tried +1', 'ghost', function () { addPoint(turn, 1); round++; turn = (turn + 1) % D.teams.length; draw(); }));
          });
          b.__it = it; grid.appendChild(b);
        });
      }
      banner = h('div'); host.appendChild(banner); host.appendChild(q); host.appendChild(grid); host.appendChild(msg); host.appendChild(rate); host.appendChild(h('div', { class: 'row' }, [timerBtn(c, 45)]));
      draw();
    });
  }

  function roleSp(c) {
    howTo(c, { icon: '🎤', title: 'Interview role-play', goal: 'One pupil is the reporter. One is the person from the story. Talk in the PAST. Then swap!', pupils: 'The reporter asks the three questions. The star answers. Use the starter lines if you need help. Then swap roles.', teacher: 'Pairs practise for 90 seconds each way. Then ask one pair to show the class. After that ask one pupil to be the narrator and tell it: "The mountain made loud noises. The family packed and left by boat." Score with the sheet.' }, function (host, again) {
      var deck = G.role, round = 0, turn = 0;
      var banner = h('div'), title = h('div', { class: 'prompt' }), cards = h('div', { class: 'row' }), msg = h('div', { class: 'msg gmsg' }), row = h('div', { class: 'row' });
      function draw() {
        if (round >= deck.length) { gameFinish(c, host, again); return; }
        var r = deck[round], nb = teamBanner(turn, '🎤 Interview ' + (round + 1) + ' of ' + deck.length); banner.replaceWith(nb); banner = nb;
        title.textContent = r.title; cards.innerHTML = '';
        cards.appendChild(h('div', { class: 'reqcard' }, [h('div', { class: 'rq-a', text: '🅰️ ' + r.a + ' asks' })].concat(r.qs.map(function (x) { return h('div', { class: 'rq-t', text: x }); }))));
        cards.appendChild(h('div', { class: 'reqcard' }, [h('div', { class: 'rq-a', text: '🅱️ ' + r.b + ' answers' })].concat(r.st.map(function (x) { return h('div', { class: 'rq-t', text: x }); }))));
        msg.textContent = 'Practise. Then swap roles!'; row.innerHTML = '';
        row.appendChild(btn('🔊 Hear the questions', 'ghost', function () { A.speakSeq(r.qs); }));
        row.appendChild(btn('⭐ Great interview +3', 'green', function () { addPoint(turn, 3); sfx('win'); confetti(); round++; turn = (turn + 1) % D.teams.length; draw(); }));
        row.appendChild(btn('👍 Good +2', 'amber', function () { addPoint(turn, 2); sfx('correct'); round++; turn = (turn + 1) % D.teams.length; draw(); }));
      }
      banner = h('div'); host.appendChild(banner); host.appendChild(title); host.appendChild(cards); host.appendChild(msg); host.appendChild(row); host.appendChild(h('div', { class: 'row' }, [timerBtn(c, 90)]));
      draw();
    });
  }

  function exitSp(c) {
    c.body.appendChild(h('div', { class: 'msg gmsg', text: '🎟️ Exit ticket: each pupil says ONE sentence about an event from the unit. Use the verb bank!' }));
    c.body.appendChild(h('div', { class: 'row bigopts' }, [
      h('div', { class: 'reqcard' }, [h('div', { class: 'rq-a', text: 'Regular (+ed)' }), h('div', { class: 'rq-t', text: G.verbs.reg })]),
      h('div', { class: 'reqcard' }, [h('div', { class: 'rq-a', text: 'Irregular' }), h('div', { class: 'rq-t', text: G.verbs.irr })])
    ]));
    finishScreen(c, 'Speaking check done', G.say, '🚪 ' + G.doors);
  }

  /* PART 2: the games, in Game Maker, with the Unit 4 questions already loaded */
  function gamesPart(c) {
    var body = c.body;
    body.appendChild(h('div', { class: 'msg gmsg', text: '🎮 Choose a game. It opens with your class monsters and the Unit 4 questions. Press ☰ Games to come back and pick another.' }));
    var grid = h('div', { class: 'today' }, D.games.map(function (g, i) {
      var a = h('a', { class: 'today-card', href: '../game-maker/index.html?set=' + D.setId + '&game=' + g.id, style: 'text-decoration:none;color:inherit' }, [h('div', { class: 'tn-num', text: String(i + 1) }), h('div', { class: 'tn-em', text: g.e }), h('b', { text: g.n }), h('span', { text: g.s })]);
      a.addEventListener('click', function () { sfx('page'); }); return a;
    }));
    body.appendChild(grid);
    body.appendChild(h('div', { class: 'row' }, [h('a', { class: 'btn amber big', href: '../game-maker/index.html?set=' + D.setId, style: 'text-decoration:none', text: '🎮 Open all games' })]));
  }

  function finishU(c) { finishScreen(c, 'Unit 4 done', G.say, '🚪 ' + G.doors); }

  var MODES = { game: '🎮 Game', think: '🤔 Think', listen: '👂 Listen', act: '🎭 Act it out', move: '🚶 Move', talk: '🗣️ Talk', race: '🏆 Team race' };
  var LESSONS = {
    1: { title: 'Unit 4 Review 1 · Grade ' + D.grade, tab: '1 · Remember it', missions: [], door: '', scenes: [
      { t: 'Today: remember Unit 4', mins: '2 min', mode: 'think', run: todayU, intro: 'Lesson 1: remember the whole unit. Lesson 2: games.',
        tip: ['Use this AFTER the pupils finished the book pages (Grade ' + D.grade + ', Unit 4, pp. 56-71). It is a review: no new teaching. Make 4 teams. Tap a team name in the top bar for +1 any time.', 'Lesson 1 order: stories, words, put in order, cause and effect, reading quiz, then the finish screen. Lesson 2 is the games (tab "2 · Play games").'] },
      { t: 'Remember the stories', mins: '7 min', mode: 'game', run: storyCards, intro: 'Look at the picture. Retell it. Say the missing word.',
        tip: ['Each card shows one moment from the unit. The team retells it, then taps the missing word. SHOW LINE reads the story line. Right = 1 point, a wrong tap gives a hint and no points are lost.'] },
      { t: 'Words from the unit', mins: '7 min', mode: 'act', run: wordsRecap, intro: 'Say the missing word. Then act it.',
        tip: ['Book link: Words in Context (Grade 3: plan, steal, lifted, robbery, arrested; thunder, bark, ash, dream, sunrise; the -nd sound. Grade 4: league, court, basket, score, shooting; show, calm, platform, sank, alive). The team says the word, then you press SHOW and everybody acts it.'] },
      { t: 'Put the events in order', mins: '5 min', mode: 'game', run: orderU, intro: 'What happened first? Then? Finally?',
        tip: ['Two stories a team each: tap the sentences in the right order. Right order = 3 points. A wrong tap wobbles with a hint. Then the team retells with First, Then, After that, Finally.'] },
      { t: 'Cause and effect', mins: '5 min', mode: 'game', run: causeEffect, intro: 'A cause is why. An effect is what happens.',
        tip: ['Book link: cause and effect (Grade 3 p. 65 and p. 71; the same idea works for the Grade 4 stories). Ask for full sentences with "because". Right = 2 points.'] },
      { t: 'Reading quiz', mins: '6 min', mode: 'game', run: readingQuiz, intro: 'Questions about the stories.',
        tip: ['Book link: Explore the Reading (Grade 3 pp. 64 and 70). The team talks for 10 seconds, you tap the answer they say. Right = 1 point.'] },
      { t: 'Unit 4 remembered!', mins: '3 min', mode: 'think', run: finishU, intro: 'Scores and one sentence each.',
        tip: ['Show the scores and cheer for everyone. Each team says one sentence. At the door each pupil says one sentence with "because".'] }
    ] },
    2: { title: 'Unit 4 Review 2 · Grade ' + D.grade, tab: '2 · Play games', missions: [], door: '', scenes: [
      { t: 'Play the games', mins: '30 min', mode: 'race', run: gamesPart, intro: 'Pick a game. It opens in Game Maker with the Unit 4 questions.',
        tip: ['Each button opens Game Maker with this grade\'s Unit 4 questions already chosen and the game ready to set up. Set 2 to 4 teams, press PLAY. Use ☰ Games in Game Maker to choose another game. Play 3 or 4 different games in the lesson.'] }
    ] }
,
    3: { title: 'Unit 4 Speaking Check · Grade ' + D.grade, tab: '3 · Speaking check', missions: [], door: '', scenes: [
      { t: 'Today: speaking check', mins: '2 min', mode: 'talk', run: todaySp, intro: 'We speak in the PAST today. Full sentences!',
        tip: ['Open speaking.html?grade=' + D.grade + ' (in this folder) and print the scoring sheet before class: 4 criteria, 1 to 3 each, 12 in all. Make 4 teams. Pupils are scored on paper by you; the board only gives team points.', 'Order: look and talk, ask and answer, happened or not, interview, exit ticket. Praise self-corrections.'] },
      { t: 'Look and talk', mins: '4 min', mode: 'talk', run: warmSp, intro: 'Look at the picture. What happened?',
        tip: ['Warm-up for the whole class: show the picture, ask the question, let pairs talk 20 seconds, then one pair says it. Press SHOW to give the model sentence.'] },
      { t: 'Ask and answer', mins: '8 min', mode: 'talk', run: qaSp, intro: 'A asks. B answers in the PAST.',
        tip: ['Controlled pair work: did + base verb in the question, past verb in the answer. After four questions pupils stand up and swap partners (mingle). Listen and score on the sheet.'] },
      { t: 'It happened... it did not', mins: '8 min', mode: 'talk', run: happenSp, intro: 'One picture happened. Two did not.',
        tip: ['Free-er speaking: the pair says what happened AND two things that did NOT (didn’t + base verb). Tap the picture they choose. Wrong tap = hint, no points lost. Score past tense and fluency on the sheet.'] },
      { t: 'Interview role-play', mins: '9 min', mode: 'talk', run: roleSp, intro: 'Reporter and star. Past tense!',
        tip: ['Role-play: reporter asks, star answers; swap after 90 seconds. Then one pupil is the narrator and retells in the past. This is the main score for fluency and listening.'] },
      { t: 'Exit ticket', mins: '4 min', mode: 'think', run: exitSp, intro: 'One sentence each. Use the verb bank.',
        tip: ['At the door each pupil says ONE past sentence from the unit. Keep the verb bank on the board for pupils who need support.'] }
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
      box.appendChild(h('button', { type: 'button', class: 'btn ltab' + (state.lesson === id ? ' on' : ' ghost'), text: (LESSONS[id].tab || ('Case ' + id)), title: LESSONS[id].title, onclick: function () { if (state.lesson !== id) go(id, 0); } }));
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
