/* Grade 3 Review: The Mona Lisa Mystery (book pp. 56-59): teacher-led smartboard lessons (35 minutes each). The board is the stage, timer and scoreboard.
   The children move, act, talk and play. Four teams earn points all lesson. One smartboard. Built from the Unit 3 lesson shell. */
(function () {
  'use strict';
  var D = window.RevG3Data, A = window.ForestAudio;
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
  var ART = { '🖼️': 'o_mona_frame', '🥷': 'o_steal', '📝': 'o_plan', '🏋️': 'o_lifted', '🚨': 'o_robbery', '👮': 'o_arrested', '📰': 'o_newspaper' };
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

  /* ============================== Grade 3 Review: The Mona Lisa Mystery (book pp. 56-59) ============================== */
  function todayG3(c) {
    todayScreen(c, 'Today we review your book pages about a famous painting. Three games, and a bonus!', [
      { e: '🔍', t: 'Look, Say, Act', s: 'Five detective words', a: 'o_plan' },
      { e: '🤫', t: 'Sneak to the Mona Lisa', s: 'Tiptoe, freeze, tiptoe', a: 'o_steal' },
      { e: '🖼️', t: 'Painting Race', s: 'Two teams build a Mona Lisa puzzle', a: 'o_mona_frame' }
    ]);
  }

  /* GAME 1: Look, Say, Act */
  function lookSayAct(c) {
    howTo(c, { icon: '🔍', title: 'Look, Say, Act', goal: 'Look at the picture. Say the word. Everybody acts it!', pupils: 'Look at the picture. Say the word with the teacher. Then ACT the word with your body.', teacher: 'Press SAY IT, then NEXT. Give a point (tap a team name at the top) to the team that acts best.' }, function (host, again) {
      var deck = shuffle(D.words.concat(D.words)), i = 0;
      var banner = h('div', { class: 'gturn', style: '--c:#38bdf8' }), card = h('div', { class: 'reqcard' }), msg = h('div', { class: 'msg gmsg' }), row = h('div', { class: 'row' });
      function draw() {
        if (i >= deck.length) { gameFinish(c, host, again); return; }
        var w = deck[i]; banner.innerHTML = ''; banner.appendChild(h('span', { class: 'tn', text: '🔍 Card ' + (i + 1) + ' of ' + deck.length })); banner.appendChild(h('span', { class: 'gb', text: 'LOOK at the picture' }));
        card.innerHTML = ''; card.appendChild(fill(h('div', { class: 'rq-e big' }), w.e, '', w.a)); card.appendChild(h('div', { class: 'rq-t', text: '❓ What is the word?' })); msg.textContent = 'Think: what is the word?';
        row.innerHTML = ''; row.appendChild(btn('🗣️ SAY IT', 'amber big', say));
      }
      function say() {
        var w = deck[i]; card.lastChild.textContent = w.w.toUpperCase(); msg.textContent = '🎭 ACT: ' + w.mime + '   (' + w.ex + ')'; A.speakSeq([w.w, w.w, w.ex]); sfx('correct');
        row.innerHTML = ''; row.appendChild(btn('➡️ NEXT', 'green big', function () { i++; draw(); }));
      }
      host.appendChild(banner); host.appendChild(card); host.appendChild(msg); host.appendChild(row);
      draw();
    });
  }

  /* GAME 2: Sneak to the Mona Lisa (red light, green light) */
  function sneak(c) {
    howTo(c, { icon: '🤫', title: 'Sneak to the Mona Lisa', goal: 'Reach the painting without the guard seeing you!', pupils: 'Start at the back. When the guard turns around: TIPTOE. When he looks at you: FREEZE! Say "I took the painting!" at the front.', teacher: 'Stick a picture of a painting at the front. Press START. When a pupil arrives, tap that pupil\'s team: +2 points.' }, function (host, again) {
      var iv = null, round = 0, ROUNDS = 5;
      c.later(function () { if (iv) clearTimeout(iv); });
      var eye = h('div', { class: 'sn-eye', text: '🛡️' }), status = h('div', { class: 'sn-st', text: 'Line up at the back!' }), panel = h('div', { class: 'sneak idle' }, [eye, status]); bgOf(panel, 'bg_museum');
      var msg = h('div', { class: 'msg gmsg', text: 'Round 0 of ' + ROUNDS }), top = h('div', { class: 'row' }), teamsRow = h('div', { class: 'row points' });
      function stop() { if (iv) { clearTimeout(iv); iv = null; } panel.className = 'sneak idle'; eye.textContent = '🛡️'; }
      function setPhase(p) {
        panel.className = 'sneak ' + p; eye.textContent = p === 'red' ? '👀' : '🙈'; status.textContent = p === 'red' ? '🛑 FREEZE!' : '🟢 TIPTOE!';
        sfx(p === 'red' ? 'soft' : 'page'); A.speak(p === 'red' ? 'Freeze!' : 'Go!');
        iv = setTimeout(function () { setPhase(p === 'red' ? 'green' : 'red'); }, p === 'red' ? 1500 + Math.random() * 1700 : 2200 + Math.random() * 2800);
      }
      top.appendChild(btn('▶ START round', 'green big', function () { if (round >= ROUNDS) { gameFinish(c, host, again); return; } stop(); round++; msg.textContent = 'Round ' + round + ' of ' + ROUNDS + ': who takes the painting first?'; setPhase('green'); }));
      top.appendChild(btn('⏹ STOP', 'ghost', function () { stop(); status.textContent = 'Paused'; }));
      teamsRow.appendChild(h('span', { class: 'lab', text: '🏆 First at the painting:' }));
      D.teams.forEach(function (t, i) { teamsRow.appendChild(h('button', { type: 'button', class: 'btn', style: '--bg:' + t.c + ';--lip:rgba(0,0,0,.4)', text: t.e + ' +2', onclick: function () { stop(); addPoint(i, 2); sfx('win'); confetti(); msg.textContent = '🎉 ' + t.n + ' took the painting!'; A.speak('I took the painting!'); } })); });
      host.appendChild(top); host.appendChild(panel); host.appendChild(msg); host.appendChild(teamsRow);
    });
  }

  /* GAME 3: Painting Race. Two teams, two real jigsaw puzzles of the Mona Lisa, at the same time. A right answer wins a piece: drop it where it belongs. A wrong answer can be stolen by the other team. */
  function paintRace(c) {
    howTo(c, { icon: '🧩', title: 'Painting Race', goal: 'Two teams build the Mona Lisa puzzle at the same time. Answer a question, win a piece!', pupils: 'One pupil from each team comes to the board. Answer the question on YOUR side. Right = you get a puzzle piece: drag it to the right place in your picture. Wrong = the other team may steal the question!', teacher: 'Both teams play together. Change the pupils at the board every few pieces. Press the speaker to read a question. 24 pieces each; the first puzzle finished wins. If a pupil misses twice, a soft glow shows the place.' }, function (host, again) {
      var N = 24, COLS = 4, ROWS = 6, CELL = 100, PAD = 30, VBW = COLS * CELL + 2 * PAD, VBH = ROWS * CELL + 2 * PAD;
      var PAIRS = [[0, 1], [2, 3], [0, 2], [1, 3]], pairAt = 0, won = null, over = false, uid = 0;
      var useImg = hasArt('painting_mona');
      /* the same knob shapes for every puzzle: tabH[r][c] is the tab of the edge above piece (r, c); tabV[r][c] the tab of the edge left of it (+1 sticks out of the lower / right piece, -1 is a hole) */
      var seed = 7; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
      var tabH = [], tabV = [];
      for (var r0 = 0; r0 < ROWS; r0++) { tabH.push([]); tabV.push([]); for (var c0 = 0; c0 < COLS; c0++) { tabH[r0].push(rnd() < 0.5 ? 1 : -1); tabV[r0].push(rnd() < 0.5 ? 1 : -1); } }
      function edge(sx, sy, ux, uy, nx, ny, sg) {
        function P(t, y) { var d = -y * sg; return (sx + ux * t + nx * d).toFixed(1) + ' ' + (sy + uy * t + ny * d).toFixed(1); }
        if (!sg) return ' L ' + P(100, 0);
        return ' L ' + P(35, 0) + ' C ' + P(35, 0) + ' ' + P(38, -8) + ' ' + P(40, -12) + ' C ' + P(43, -17) + ' ' + P(38, -28) + ' ' + P(50, -28) + ' C ' + P(62, -28) + ' ' + P(57, -17) + ' ' + P(60, -12) + ' C ' + P(62, -8) + ' ' + P(65, 0) + ' ' + P(65, 0) + ' L ' + P(100, 0);
      }
      function piecePath(r, cc) {
        var top = r > 0 ? tabH[r][cc] : 0, left = cc > 0 ? tabV[r][cc] : 0, bottom = r < ROWS - 1 ? -tabH[r + 1][cc] : 0, right = cc < COLS - 1 ? -tabV[r][cc + 1] : 0;
        return 'M 0 0' + edge(0, 0, 1, 0, 0, -1, top) + edge(100, 0, 0, 1, 1, 0, right) + edge(100, 100, -1, 0, 0, 1, bottom) + edge(0, 100, 0, -1, -1, 0, left) + ' Z';
      }
      function pieceFill(r, cc, i) {
        if (useImg) return '<image href="art/painting_mona.webp" x="' + (-cc * CELL) + '" y="' + (-r * CELL) + '" width="' + (COLS * CELL) + '" height="' + (ROWS * CELL) + '" preserveAspectRatio="none"';
        return '<rect x="-30" y="-30" width="160" height="160" fill="hsl(' + (28 + i * 7) + ',55%,' + (30 + (i % 5) * 4) + '%)"';
      }
      function pieceSvg(r, cc, i, withBox) {   // one piece in its own 160 x 160 box (a cell plus room for the knobs), centred on the cell
        var id = 'pzc' + (++uid), d = piecePath(r, cc);
        return '<svg viewBox="' + (-PAD) + ' ' + (-PAD) + ' ' + (CELL + 2 * PAD) + ' ' + (CELL + 2 * PAD) + '" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="' + id + '"><path d="' + d + '"/></clipPath></defs>' + pieceFill(r, cc, i) + ' clip-path="url(#' + id + ')"' + (useImg ? '/>' : '/>') + '<path d="' + d + '" fill="none" stroke="#0b1220" stroke-width="2" stroke-linejoin="round"/><path d="' + d + '" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.35" transform="translate(0.6 0.6)"/></svg>';
      }
      function placedG(r, cc, i) {
        var id = 'pzp' + (++uid), d = piecePath(r, cc);
        return '<g class="pz-pl" transform="translate(' + (cc * CELL) + ' ' + (r * CELL) + ')"><clipPath id="' + id + '"><path d="' + d + '"/></clipPath>' + pieceFill(r, cc, i) + ' clip-path="url(#' + id + ')"/><path d="' + d + '" fill="none" stroke="#0b1220" stroke-width="1.6" stroke-linejoin="round" opacity="0.75"/></g>';
      }
      function makeTeam(side, idx) {
        var T = { side: side, idx: idx, placed: [], count: 0, order: shuffle(Array.apply(null, { length: N }).map(function (x, k) { return k; })), bank: shuffle(D.race.slice()), bi: 0, steals: [], pending: null, miss: 0, extra: 0, cur: null, locked: false, done: false };
        for (var i = 0; i < N; i++) T.placed.push(false);
        var t = D.teams[idx];
        T.el = h('div', { class: 'pz-panel' }); T.el.style.setProperty('--c', t.c);
        T.head = h('div', { class: 'pz-head' }); T.board = h('div', { class: 'pz-board' }); T.q = h('div', { class: 'pz-q' }); T.tray = h('div', { class: 'pz-tray' }); T.msg = h('div', { class: 'pz-msg' });
        T.board.innerHTML = '<svg viewBox="' + (-PAD) + ' ' + (-PAD) + ' ' + VBW + ' ' + VBH + '" xmlns="http://www.w3.org/2000/svg">' +
          '<rect x="0" y="0" width="' + (COLS * CELL) + '" height="' + (ROWS * CELL) + '" fill="#111a2e" stroke="#475569" stroke-width="2" stroke-dasharray="8 6"/>' +
          (useImg ? '<image href="art/painting_mona.webp" x="0" y="0" width="' + (COLS * CELL) + '" height="' + (ROWS * CELL) + '" preserveAspectRatio="none" opacity="0.24"/>' : '') +
          '<g class="pz-hint"></g><g class="pz-done"></g></svg>';
        T.svg = T.board.firstChild; T.gDone = T.svg.querySelector('.pz-done'); T.gHint = T.svg.querySelector('.pz-hint');
        T.el.appendChild(T.head); T.el.appendChild(h('div', { class: 'pz-body' }, [T.board, h('div', { class: 'pz-side' }, [T.q, T.tray, T.msg])]));
        return T;
      }
      function paintHead(T) {
        var t = D.teams[T.idx]; T.head.innerHTML = '';
        T.head.appendChild(h('b', { text: t.e + ' ' + t.n })); T.head.appendChild(h('span', { class: 'pz-count', text: T.count + ' / ' + N }));
        T.head.appendChild(btn('🔊', 'small ghost', function () { if (T.cur) A.speak(T.cur.q.replace(/____/g, 'blank')); }));
        T.head.appendChild(btn('⏭', 'small ghost', function () { if (!T.locked && !T.done && T.pending === null) nextQuestion(T, true); }));
      }
      function nextPiece(T) { for (var k = 0; k < T.order.length; k++) if (!T.placed[T.order[k]]) return T.order[k]; return null; }
      function showHint(T) {
        T.gHint.innerHTML = '';
        if (T.pending === null || T.miss < 2) return;
        var r = Math.floor(T.pending / COLS), cc = T.pending % COLS;
        T.gHint.innerHTML = '<circle cx="' + (cc * CELL + 50) + '" cy="' + (r * CELL + 50) + '" r="46" fill="#fbbf24" opacity="0.28" class="pz-pulse"/><circle cx="' + (cc * CELL + 50) + '" cy="' + (r * CELL + 50) + '" r="46" fill="none" stroke="#fbbf24" stroke-width="3" stroke-dasharray="6 5"/>';
      }
      function giveQuestion(T) {
        var item = T.steals.length ? T.steals.shift() : null, steal = !!item;
        if (!item) { item = T.bank[T.bi % T.bank.length]; T.bi++; }
        var opts = shuffle([{ t: item[1], ok: true }, { t: item[2], ok: false }, { t: item[3], ok: false }]);
        return { q: item[0], opts: opts, raw: item, steal: steal };
      }
      function nextQuestion(T, skipped) {
        if (T.done) { T.q.innerHTML = ''; T.q.appendChild(h('div', { class: 'pz-donetxt', text: '🎉 Puzzle finished!' })); return; }
        T.locked = false; T.cur = giveQuestion(T); T.q.innerHTML = ''; T.tray.innerHTML = ''; T.msg.textContent = skipped ? 'New question!' : '';
        if (T.cur.steal) T.q.appendChild(h('div', { class: 'pz-steal', text: '⚡ STEAL! Right answer = 2 pieces' }));
        var art0 = T.cur.raw[4]; if (art0 && hasArt(art0)) T.q.appendChild(h('div', { class: 'pz-pic' }, [art(art0, 'pz-img')]));
        T.q.appendChild(h('div', { class: 'pz-qt', text: T.cur.q }));
        T.cur.opts.forEach(function (o) { var b = btn(o.t, 'pz-opt', function () { answer(T, o, b); }); T.q.appendChild(b); });
      }
      function answer(T, o, b) {
        if (T.locked || T.done || over) return;
        if (o.ok) {
          T.locked = true; sfx('correct'); b.classList.add('good'); [].forEach.call(T.q.querySelectorAll('.pz-opt'), function (x) { x.disabled = true; });
          T.extra = T.cur.steal ? 1 : 0; setTimeout(function () { givePiece(T); }, 450);
        } else {
          b.classList.add('wobble', 'bad'); b.disabled = true; sfx('soft');
          T.locked = true; T.msg.textContent = 'Not this time!';
          var O = other(T); if (O && !O.done) { O.steals.push(T.cur.raw); O.msg.textContent = '⚡ A question to STEAL is coming!'; }
          setTimeout(function () { nextQuestion(T); }, 1100);
        }
      }
      function givePiece(T) {
        var k = nextPiece(T); if (k === null) { finishTeam(T); return; }
        T.pending = k; T.miss = 0; T.q.innerHTML = ''; T.q.appendChild(h('div', { class: 'pz-qt', text: '✅ Right! Drag the piece to its place in the picture.' }));
        T.tray.innerHTML = ''; var pc = h('div', { class: 'pz-piece' }); pc.innerHTML = pieceSvg(Math.floor(k / COLS), k % COLS, k);
        T.tray.appendChild(pc); showHint(T); dragify(T, pc, k);
      }
      function dragify(T, pc, k) {
        pc.addEventListener('pointerdown', function (ev) {
          ev.preventDefault(); try { pc.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
          var gh = pc.cloneNode(true); gh.className = 'pz-piece pz-ghost'; gh.style.left = ev.clientX + 'px'; gh.style.top = ev.clientY + 'px'; document.body.appendChild(gh); pc.style.opacity = '.3';
          function move(e) { gh.style.left = e.clientX + 'px'; gh.style.top = e.clientY + 'px'; }
          function up(e) {
            pc.removeEventListener('pointermove', move); pc.removeEventListener('pointerup', up); pc.removeEventListener('pointercancel', up);
            gh.remove(); pc.style.opacity = '';
            var rc = T.svg.getBoundingClientRect(), ux = (e.clientX - rc.left) / rc.width * VBW - PAD, uy = (e.clientY - rc.top) / rc.height * VBH - PAD;
            tryPlace(T, ux, uy);
          }
          pc.addEventListener('pointermove', move); pc.addEventListener('pointerup', up); pc.addEventListener('pointercancel', up);
        });
      }
      function tryPlace(T, ux, uy) {
        if (T.pending === null || T.done || over) return;
        var r = Math.floor(T.pending / COLS), cc = T.pending % COLS, dx = ux - (cc * CELL + 50), dy = uy - (r * CELL + 50);
        if (Math.sqrt(dx * dx + dy * dy) > 55) {
          T.miss++; T.board.classList.remove('wobble'); void T.board.offsetWidth; T.board.classList.add('wobble'); sfx('soft');
          T.msg.textContent = T.miss >= 2 ? 'Look at the glowing circle!' : 'Almost! Look at the picture.'; showHint(T); return;
        }
        var k = T.pending; T.placed[k] = true; T.count++; T.pending = null; T.gHint.innerHTML = '';
        T.gDone.insertAdjacentHTML('beforeend', placedG(r, cc, k)); T.tray.innerHTML = ''; sfx('correct'); paintHead(T); T.msg.textContent = '';
        if (T.count >= N) { finishTeam(T); return; }
        if (T.extra > 0) { T.extra--; T.msg.textContent = '⚡ Bonus piece!'; setTimeout(function () { givePiece(T); }, 500); return; }
        setTimeout(function () { nextQuestion(T); }, 500);
      }
      function finishTeam(T) {
        T.done = true; T.pending = null; T.q.innerHTML = ''; T.tray.innerHTML = ''; T.gHint.innerHTML = ''; paintHead(T); T.el.classList.add('pz-complete');
        T.q.appendChild(h('div', { class: 'pz-donetxt', text: '🎉 Puzzle finished!' }));
        if (!won) { won = T; addPoint(T.idx, 5); sfx('win'); confetti(); T.msg.textContent = '🏆 First! +5 points'; A.speak('The Mona Lisa is finished! Well done!'); } else { addPoint(T.idx, 3); sfx('win'); T.msg.textContent = '⭐ Finished! +3 points'; }
        if (L.done && R.done) { over = true; setTimeout(function () { gameFinish(c, host, again); }, 2500); }
      }
      function other(T) { return T === L ? R : L; }
      var L, R, arena = h('div', { class: 'pz-arena' }), ctrl = h('div', { class: 'row' });
      function start() {
        won = null; over = false; arena.innerHTML = ''; var pr = PAIRS[pairAt];
        L = makeTeam('L', pr[0]); R = makeTeam('R', pr[1]); arena.appendChild(L.el); arena.appendChild(R.el);
        [L, R].forEach(function (T) { paintHead(T); nextQuestion(T); });
      }
      ctrl.appendChild(btn('👥 Other teams', 'small ghost', function () { pairAt = (pairAt + 1) % PAIRS.length; start(); }));
      ctrl.appendChild(btn('🔁 Restart', 'small ghost', function () { start(); }));
      ctrl.appendChild(btn('🏁 Finish', 'small ghost', function () { over = true; gameFinish(c, host, again); }));
      host.appendChild(arena); host.appendChild(ctrl);
      start();
    });
  }

  /* BONUS GAME: Put the story in order */
  function storyOrder(c) { orderRace(c, D.order, 3); }

  function finishG3(c) { finishScreen(c, 'Case closed', ['Peruggia took the painting.', 'The police found it.', 'The Mona Lisa went home.'], '🚪 Door pass: say one sentence: "Peruggia took the painting." or one new word (plan, steal, lifted, robbery, arrested).'); }

  var MODES = { game: '🎮 Game', think: '🤔 Think', listen: '👂 Listen', act: '🎭 Act it out', move: '🚶 Move', talk: '🗣️ Talk', race: '🏆 Team race' };
  var LESSONS = {
    1: { title: 'Mona Lisa Review · Grade 3', missions: [], door: '', scenes: [
      { t: 'Today: 3 games', mins: '2 min', mode: 'think', run: todayG3, intro: 'Review of book pp. 56-59.',
        tip: ['Use this lesson AFTER the pupils have done the book pages (Statue head, Think-Pair-Share, the museum pictures, the five words). It is a review: no teaching.', 'Make 4 teams of 4-5 pupils. Points: tap a team name in the top bar for +1 any time; the games give points by themselves.'] },
      { t: 'Game 1: Look, Say, Act', mins: '10 min', mode: 'game', run: lookSayAct, intro: 'The five detective words: plan, steal, lifted, robbery, arrested.',
        tip: ['Book link: Words in Context, p. 59 (plan, steal, lifted, robbery, arrested).', 'The picture shows first, the pupils guess, then press SAY IT: the board says the word and the sentence, and everybody ACTS the word. Give a point to the team that acts best.'] },
      { t: 'Game 2: Sneak to the Mona Lisa', mins: '10 min', mode: 'move', run: sneak, intro: 'Red light, green light, in the museum.',
        tip: ['A movement game for the new words. Pupils start at the back of the room; the "painting" (a picture) is at the front. The board switches by itself between GO (tiptoe) and FREEZE. A pupil who moves when the guard looks says "I am arrested!" and goes back (no points lost). The first pupil to arrive says "I took the painting!": tap that team (+2).'] },
      { t: 'Game 3: Painting Race', mins: '14 min', mode: 'race', run: paintRace, intro: 'Two teams build the Mona Lisa at the same time!',
        tip: ['Book link: past tense (took, lifted, found, hid, was/were) and the case words (plan, steal, lifted, robbery, arrested, museum, thief, guard).', 'Two teams play together, one pupil from each team at the board. A right answer wins one jigsaw piece: drag it to its place in the picture (a faint picture shows the way; after two misses a circle glows). A wrong answer: the other team gets that question next, and a right answer to a stolen question gives 2 pieces. Nobody loses points. 24 pieces each. First puzzle finished = 5 points, second = 3 points. Press the speaker to read a question; the arrow skips one.', 'Play it twice with the other two teams (button: Other teams).'] },
      { t: 'Bonus: Put the story in order', mins: '6 min', mode: 'game', run: storyOrder, intro: 'What happened first? Then? Finally? (only if there is time)',
        tip: ['Book link: the years in the reading (1503, 1911, 1913), pp. 58-63.', 'Each team puts 4 sentences in order (the Mona Lisa timeline and the robbery night). Right order = 3 points. A wrong tap wobbles with a hint. Then the team retells the story with First, Then, After that, Finally.'] },
      { t: 'Case Closed', mins: '5 min', mode: 'think', run: finishG3, intro: 'Scores and one sentence each.',
        tip: ['Show the scores and cheer for everyone. Each team says one sentence. At the door each pupil says one past sentence or one new word.'] }
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
