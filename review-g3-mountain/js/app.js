/* Grade 3 Review: The Angry Mountain (book pp. 65-71): teacher-led smartboard lessons (35 minutes each). The board is the stage, timer and scoreboard.
   The children move, act, talk and play. Four teams earn points all lesson. One smartboard. Built from the Unit 3 lesson shell. */
(function () {
  'use strict';
  var D = window.RevG3MData, A = window.ForestAudio;
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
  var ART = { '⛈️': 'o_thunder', '🐕': 'o_bark', '🌋': 'o_volcano', '💭': 'o_dream', '🌅': 'o_sunrise', '⛵': 'o_boat', '🚢': 'o_ship', '🌴': 'c_girl_tree' };
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
    var host = $('stage'), em = ['⭐', '🎉', '🌋', '✨', '⛵', '🌅'], k, w = h('div', { class: 'confetti' });
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

  /* ============================== Grade 3 Review: The Angry Mountain (book Reading 2, pp. 64-71) ============================== */
  function todayM(c) {
    todayScreen(c, 'Today we explore The Angry Mountain (Mount Tambora, pp. 65-71): volcano words, island escape, -nd blends, and cause & effect!', [
      { e: '🌋', t: 'Volcano Words', s: 'thunder, bark, ash, dream, sunrise', a: 'o_volcano' },
      { e: '⛵', t: 'Escape the Island!', s: 'Put the events & cause/effect in order', a: 'o_boat' },
      { e: '🔤', t: 'Phonics -nd Spotlight', s: 'end, stand, wind, send, find, hand', a: 'c_girl_tree' }
    ]);
  }

  /* GAME 1: Volcano Words (Words in Context p. 67) */
  function volcanoWords(c) {
    howTo(c, { icon: '🌋', title: 'Volcano Words: Say & Act!', goal: 'Say the missing word from The Angry Mountain, then ACT it out!', pupils: 'Read the sentence with the gap. Say the missing word, then the whole team ACTS it out for 3 seconds!', teacher: 'Press SHOW to reveal the word and picture. Give 2 points for a great team action, 1 point for a good try.' }, function (host, again) {
      var ROUNDS = 8, round = 0, turn = 0, deck = shuffle(D.words.concat(D.words)), word = null, stage = 'clue';
      var banner = h('div'), clue = h('div', { class: 'reqcard' }), msg = h('div', { class: 'msg gmsg' }), row = h('div', { class: 'row' });
      function buttons() {
        row.innerHTML = '';
        if (stage === 'clue') row.appendChild(btn('👀 SHOW the word', 'amber big', function () {
          stage = 'act'; clue.innerHTML = ''; clue.appendChild(fill(h('div', { class: 'rq-e' }), word.e, '', word.a)); clue.appendChild(h('div', { class: 'rq-t', text: word.w + ': ' + word.ex }));
          A.speakSeq([word.w, word.ex]); sfx('correct'); msg.textContent = '🎭 ACT it: ' + word.act; buttons();
        }));
        else {
          row.appendChild(btn('⭐ Great act! +2', 'green big', function () { addPoint(turn, 2); sfx('win'); confetti(); next(1100); }));
          row.appendChild(btn('👍 Good try +1', 'ghost', function () { addPoint(turn, 1); sfx('correct'); next(900); }));
        }
      }
      function next(ms) { setTimeout(function () { round++; turn = (turn + 1) % D.teams.length; draw(); }, ms); }
      function draw() {
        if (round >= ROUNDS) { gameFinish(c, host, again); return; }
        word = deck[round]; stage = 'clue'; var nb = teamBanner(turn, '🌋 Word ' + (round + 1) + ' of ' + ROUNDS); banner.replaceWith(nb); banner = nb;
        clue.innerHTML = ''; clue.appendChild(fill(h('div', { class: 'rq-e' }), '❓', '', 'o_volcano')); clue.appendChild(h('div', { class: 'rq-t', text: word.gap })); msg.textContent = 'Team: talk together, then say the missing word!'; A.speak(word.gap.replace(/_+/g, 'blank')); buttons();
      }
      banner = h('div'); host.appendChild(banner); host.appendChild(clue); host.appendChild(msg); host.appendChild(row); host.appendChild(h('div', { class: 'row' }, [timerBtn(c, 20)]));
      draw();
    });
  }

  function lcFirstM(t) { return /^(The|A|They|She|He|It|We) /.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t; }

  /* GAME 2: Escape the Island! (Story Order & Cause/Effect Relay, pp. 65-69, 71) */
  function islandEscape(c) {
    howTo(c, { icon: '⛵', title: 'Escape the Island!', goal: 'Put the story events and Cause & Effect pairs in order to sail to the rescue ship!', pupils: 'Read the sentences. On your turn, say which event comes next. Then retell: First, Then, Next...', teacher: 'Tap the sentence the team says. Right = 1 point and the boat moves forward. Wrong tap wobbles gently with a hint (no points lost).' }, function (host, again) {
      var ri = 0, turn = 0, placed = 0, route = null;
      var banner = h('div'), title = h('div', { class: 'prompt' }), track = h('div', { class: 'trk' }), list = h('div', { class: 'scr' }), told = h('div', { class: 'reqcard' }), msg = h('div', { class: 'msg gmsg' }), nxt;
      function paintTrack() {
        track.innerHTML = '';
        route.stops.forEach(function (s, k) {
          var st = h('div', { class: 'trk-stop' + (k < placed ? ' done' : '') + (k === placed ? ' now' : '') }, [h('span', { class: 'trk-ic', text: route.icons[k] }), h('b', { text: String(k + 1) })]);
          track.appendChild(st);
        });
        var cur = track.children[Math.min(placed, route.stops.length - 1)]; if (cur) cur.classList.add('here');
      }
      function draw() {
        if (ri >= D.routes.length) { gameFinish(c, host, again); return; }
        route = D.routes[ri]; placed = 0; var nb = teamBanner(turn, route.e + ' Route ' + (ri + 1) + ' of ' + D.routes.length + ': which comes FIRST?'); banner.replaceWith(nb); banner = nb;
        title.textContent = route.title; msg.textContent = 'Tap the first event.'; told.innerHTML = ''; list.innerHTML = ''; paintTrack(); nxt.style.display = 'none';
        shuffle(route.stops.map(function (s, k) { return { s: s, k: k }; })).forEach(function (o) {
          var tile = h('button', { type: 'button', class: 'btn tile2 chip2' }, [route.art[o.k] && hasArt(route.art[o.k]) ? art(route.art[o.k], 'tilepic') : h('span', { class: 'tile-emo', text: route.icons[o.k] }), h('span', { text: o.s })]);
          tile.addEventListener('click', function () { pick(tile, o); }); list.appendChild(tile);
        });
      }
      function pick(tile, o) {
        if (o.k !== placed) { tile.classList.remove('wob', 'wobble'); void tile.offsetWidth; tile.classList.add('wobble'); sfx('soft'); msg.textContent = 'Almost! What happens ' + D.stops[placed].toLowerCase().replace(',', '') + '?'; A.speak('Try again.'); return; }
        told.appendChild(h('div', { class: 'rq-t', text: D.stops[placed] + ' ' + lcFirstM(o.s) })); tile.style.display = 'none'; A.speak(o.s); sfx('correct'); addPoint(turn, 1); placed++; paintTrack();
        turn = (turn + 1) % D.teams.length;
        if (placed >= route.stops.length) { sfx('win'); confetti(); msg.textContent = '🎉 Safe on the ship! Retell the steps together.'; ri++; nxt.style.display = ''; }
        else { var nb = teamBanner(turn, route.e + ' Which comes next?'); banner.replaceWith(nb); banner = nb; msg.textContent = '⛵ Right! The boat sails forward.'; }
      }
      nxt = btn('Next ▶', 'green big', function () { nxt.style.display = 'none'; draw(); }); nxt.style.display = 'none';
      banner = h('div'); host.appendChild(banner); host.appendChild(title); host.appendChild(track); host.appendChild(list); host.appendChild(told); host.appendChild(msg); host.appendChild(h('div', { class: 'row' }, [nxt]));
      draw();
    });
  }

  /* GAME 3: Phonics -nd Blends Spotlight (p. 70: end, stand, wind, send, find, hand) */
  function ndSpotlight(c) {
    howTo(c, { icon: '🔤', title: 'Phonics -nd Spotlight!', goal: 'Complete the sentence with the right -nd blend word (end, stand, wind, send, find, hand)!', pupils: 'Read the sentence with the gap, say the -nd word clearly, and act it out!', teacher: 'Tap the -nd word the team says. Right on first try = +1 point, then press SAY & ACT for +1 bonus!' }, function (host, again) {
      var deck = shuffle(D.lines), round = 0, turn = 0, tries = 0, cur = null;
      var banner = h('div'), card = h('div', { class: 'reqcard' }), faces = h('div', { class: 'faces' }), msg = h('div', { class: 'msg gmsg' }), row = h('div', { class: 'row' });
      D.chars.forEach(function (ch) {
        var f = h('button', { type: 'button', class: 'btn face' }, [fill(h('span', { class: 'face-pic' }), ch.e, '', ch.a), h('b', { text: ch.n })]);
        f.addEventListener('click', function () { guess(ch, f); }); faces.appendChild(f);
      });
      function guess(ch, f) {
        if (!cur || cur.done) return;
        if (ch.k === cur.who) {
          cur.done = true; if (tries === 0) addPoint(turn, 1); sfx('correct'); f.classList.add('right');
          var fullSent = cur.t.replace('____', ch.k);
          msg.textContent = '✅ ' + fullSent + (tries === 0 ? '  +1' : ''); A.speak(fullSent);
          row.innerHTML = ''; row.appendChild(btn('🗣️ SAY & ACT! +1', 'violet big', function () { addPoint(turn, 1); sfx('win'); msg.textContent = '🎭 ' + cur.act; next(); }));
          row.appendChild(btn('⏭ Next sentence', 'ghost', function () { next(); }));
        } else { tries++; f.classList.remove('wob', 'wobble'); void f.offsetWidth; f.classList.add('wobble'); sfx('soft'); msg.textContent = 'Listen to the -nd sound at the end! Try again.'; A.speak('Try again.'); }
      }
      function next() { round++; turn = (turn + 1) % D.teams.length; setTimeout(draw, 300); }
      function draw() {
        if (round >= deck.length) { gameFinish(c, host, again); return; }
        cur = deck[round]; tries = 0; cur.done = false; [].forEach.call(faces.children, function (f) { f.classList.remove('right'); });
        var nb = teamBanner(turn, '🔤 -nd Blend ' + (round + 1) + ' of ' + deck.length); banner.replaceWith(nb); banner = nb;
        card.innerHTML = ''; card.appendChild(fill(h('div', { class: 'rq-e' }), '🔤', '', 'o_sunrise')); card.appendChild(h('div', { class: 'rq-t', text: cur.t })); msg.textContent = 'Which -nd word fits the gap?'; row.innerHTML = ''; row.appendChild(timerBtn(c, 10));
        A.speak(cur.t.replace('____', 'blank'));
      }
      banner = h('div'); host.appendChild(banner); host.appendChild(card); host.appendChild(faces); host.appendChild(msg); host.appendChild(row);
      draw();
    });
  }

  /* CLOSING: Feelings & Cause-Effect Spinner (pp. 70 C & 71) */
  function feelingsSpin(c) {
    howTo(c, { icon: '🎡', title: 'How Did You Feel in 1815?', goal: 'Spin the reels to build a Cause & Effect feeling sentence from Mount Tambora!', pupils: 'Read the three reels aloud: "I felt ... because ... Then ...!"', teacher: 'Press SPIN. The team says the full sentence aloud. Clear speaking + acting = 2 points, good try = 1 point.' }, function (host, again) {
      var ROUNDS = 4, round = 0, turn = 0, spinning = false, pick = [0, 0, 0];
      var banner = h('div'), reels = h('div', { class: 'reels' }), sent = h('div', { class: 'bigsent' }), msg = h('div', { class: 'msg gmsg' }), row = h('div', { class: 'row' });
      var lists = [D.late, D.because, D.then], heads = ['I felt...', 'because (Cause)...', 'Then (Effect)...'], boxes = [];
      heads.forEach(function (hd, i) {
        var val = h('div', { class: 'reel-v', text: '—' });
        boxes.push(val); reels.appendChild(h('div', { class: 'reel' }, [h('div', { class: 'reel-h', text: hd }), val]));
      });
      function showSentence() {
        var s = 'I felt ' + D.late[pick[0]] + ' because ' + D.because[pick[1]] + '. Then ' + D.then[pick[2]] + '!';
        sent.textContent = '“' + s + '”'; A.speak(s);
      }
      function spin() {
        if (spinning) return; spinning = true; sfx('page'); sent.textContent = 'Spinning...';
        var ticks = 0, iv = setInterval(function () {
          ticks++;
          for (var i = 0; i < 3; i++) { if (ticks < 8 + i * 4) { pick[i] = Math.floor(Math.random() * lists[i].length); boxes[i].textContent = lists[i][pick[i]]; } }
          if (ticks >= 18) { clearInterval(iv); spinning = false; sfx('correct'); showSentence(); msg.textContent = 'Say the whole sentence aloud with feeling!'; drawBtns(true); }
        }, 70);
      }
      function drawBtns(afterSpin) {
        row.innerHTML = '';
        if (!afterSpin) row.appendChild(btn('🎡 SPIN!', 'amber big', spin));
        else {
          row.appendChild(btn('🌟 Great sentence! +2', 'green big', function () { addPoint(turn, 2); sfx('win'); confetti(); next(); }));
          row.appendChild(btn('👍 Good English +1', 'ghost', function () { addPoint(turn, 1); sfx('correct'); next(); }));
          row.appendChild(btn('🔄 Spin again', 'ghost', spin));
        }
      }
      function next() { round++; turn = (turn + 1) % D.teams.length; setTimeout(draw, 400); }
      function draw() {
        if (round >= ROUNDS) { gameFinish(c, host, again); return; }
        var nb = teamBanner(turn, '🎡 Turn ' + (round + 1) + ' of ' + ROUNDS); banner.replaceWith(nb); banner = nb;
        boxes.forEach(function (b) { b.textContent = '?'; }); sent.textContent = 'Press SPIN to make your sentence!'; msg.textContent = 'Book p. 70 C: Imagine you lived near Mount Tambora in 1815. How do you feel?';
        drawBtns(false);
      }
      banner = h('div'); host.appendChild(banner); host.appendChild(reels); host.appendChild(sent); host.appendChild(msg); host.appendChild(row);
      draw();
    });
  }

  function finishM(c) {
    finishScreen(c, 'Safe at Sunrise!', ['Smoke and ash came from the volcano, so the sky turned dark.', 'The family sailed away in their wooden boat.', 'At sunrise, they saw a big rescue ship!'], '🚪 Door pass: say one -nd word (end, stand, wind, send, find, hand) or one sentence: "I felt ... because ..."');
  }

  var MODES = { game: '🎮 Game', think: '🤔 Think', listen: '👂 Listen', act: '🎭 Act it out', move: '🚶 Move', talk: '🗣️ Talk', race: '🏆 Team race' };
  var LESSONS = {
    1: { title: 'The Angry Mountain Review (pp. 65-71)', missions: ['Volcano Words', 'Escape the Island', '-nd Blends', 'Feelings & Cause/Effect'], door: 'Say one sentence with "I feel ... because ..." or one -nd word!', scenes: [
      { t: 'Today', mins: '1 min', mode: 'listen', run: todayM, intro: 'What we play today (book pp. 65-71).',
        tip: ['Book pages: pp. 65-71 (Get Ready to Read: Cause and Effect, Reading 2: The Angry Mountain, Explore the Reading, Phonics -nd blends, and Think Together).', 'Four teams (Hawks, Tigers, Bears, Sharks) earn points across all activities.'] },
      { t: 'Game 1: Volcano Words', mins: '8 min', mode: 'act', run: volcanoWords, intro: 'Words in Context: thunder, bark, ash, dream, sunrise.',
        tip: ['Book link: Words in Context, p. 67 (thunder, bark, ash, dream, sunrise).', 'The board shows a gap sentence. The team says the missing word, then you press SHOW: the board speaks it and gives a whole-team TPR action. Award +2 for a great act, +1 for a good try.'] },
      { t: 'Game 2: Escape the Island!', mins: '10 min', mode: 'game', run: islandEscape, intro: 'Put the Mount Tambora events and Cause & Effect pairs in order.',
        tip: ['Book link: Reading 2 pp. 66-69, Cause & Effect p. 65, and Think Together table p. 71.', 'Route 1 orders the 6 events of The Angry Mountain as Papa’s boat sails toward the rescue ship. Route 2 matches Causes and Effects from both Unit 4 readings (Where Is She? and The Angry Mountain).'] },
      { t: 'Game 3: Phonics -nd Spotlight', mins: '8 min', mode: 'game', run: ndSpotlight, intro: 'Final -nd blends: end, stand, wind, send, find, hand.',
        tip: ['Book link: Phonics -nd blends, p. 70 (end, stand, wind, send, find, hand).', 'Teams read the sentence, pick the matching -nd word, and act it out aloud for a bonus point.'] },
      { t: 'How Did You Feel in 1815?', mins: '5 min', mode: 'talk', run: feelingsSpin, intro: 'Spin to connect Feelings, Causes, and Effects.',
        tip: ['Book link: p. 70 C ("Imagine you lived near Mount Tambora in 1815. How do you feel? I feel...") and p. 71 B ("What was an important event for you?").', 'Teams spin the 3 reels and read the full Cause & Effect sentence aloud.'] },
      { t: 'Podium & Exit Ticket', mins: '3 min', mode: 'think', run: finishM, intro: 'Celebrate the winning team and share one exit sentence.',
        tip: ['At the door, each pupil says either one -nd word (end, stand, wind, send, find, hand) or one sentence: "I feel thankful/safe/happy because..."'] }
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
