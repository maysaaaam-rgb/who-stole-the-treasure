/* Our Class Plan: the new rules: teacher-led smartboard lessons (35 minutes each). The board is the stage, timer and scoreboard.
   The children move, act, talk and play. Four teams earn points all lesson. One smartboard. Built from the Unit 3 lesson shell. */
(function () {
  'use strict';
  var D = window.ResetData, A = window.ForestAudio;
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
  var ART = { '🪑': 'o_rule_sit', '🤫': 'o_rule_voice', '🔔': 'o_rule_bell', '📮': 'o_voice_box', '📜': 'o_promise_scroll', '🙏': 'o_slip_thanks', '💡': 'o_slip_idea', '🙋': 'o_slip_help', '😟': 'o_slip_worry' };
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
    var host = $('stage'), em = ['⭐', '🎉', '🌟', '✨', '🚦', '🤝'], k, w = h('div', { class: 'confetti' });
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

  /* ============================== Our Class Plan: the Monday reset (35 minutes) ============================== */
  function resetCss() {
    if (document.getElementById('rs-css')) return;
    var st = document.createElement('style'); st.id = 'rs-css';
    st.textContent = '.lightwrap{display:flex;gap:3vh;align-items:center;justify-content:center;flex-wrap:wrap;margin:1vh 0}' +
      '.lamp{width:30vh;height:30vh;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:7vh;box-shadow:0 0 6vh rgba(0,0,0,.5) inset,0 1vh 3vh rgba(0,0,0,.45);border:1vh solid #0b1220;transition:background .3s}' +
      '.lamp.haspic{width:auto;height:auto;border:0;border-radius:0;background:none !important;box-shadow:none}.lampimg{height:46vh;width:auto;filter:drop-shadow(0 1vh 2vh rgba(0,0,0,.4))}' +
      '.lamp.green{background:radial-gradient(circle at 35% 30%,#86efac,#16a34a)}.lamp.yellow{background:radial-gradient(circle at 35% 30%,#fde68a,#f59e0b)}.lamp.red{background:radial-gradient(circle at 35% 30%,#fca5a5,#dc2626)}' +
      '.lampcol{display:flex;flex-direction:column;gap:1vh;align-items:flex-start;max-width:46vw}.lamplab{font-size:4.2vh;font-weight:900}.lampinfo{font-size:3vh;opacity:.9}.lamptime{font-size:5vh;font-weight:900;font-variant-numeric:tabular-nums}' +
      '.lightbtns{display:flex;gap:1.4vh;flex-wrap:wrap}.bigcmd{font-size:9vh;text-align:center;margin:2vh 0;font-weight:900}.bigcmd small{display:block;font-size:4.4vh;opacity:.85;font-weight:700}';
    document.head.appendChild(st);
  }
  /* the class traffic light: green time earns a bonus for EVERY team (every full minute of green), yellow = ten seconds to be calm, red = one minute silent reset. No names, no XP taken away. */
  function lightPanel(c, withBonus) {
    resetCss();
    var mode = 'green', running = false, cd = 0, greenSec = 0, bonus = 0, iv = null;
    var lamp = h('div', { class: 'lamp green' }), lab = h('div', { class: 'lamplab' }), info = h('div', { class: 'lampinfo' }), tm = h('div', { class: 'lamptime' }), bon = h('div', { class: 'lampinfo' });
    function draw() {
      var L = D.light[mode], face = mode === 'green' ? '🙂' : mode === 'yellow' ? '😮' : '✋', lp = hasArt('o_light_' + mode); lamp.className = 'lamp ' + mode + (lp ? ' haspic' : ''); lamp.textContent = ''; if (lp) lamp.appendChild(imgEl('o_light_' + mode, face, 'lampimg')); else lamp.textContent = face;
      lab.textContent = L.t; info.textContent = L.d;
      tm.textContent = mode === 'green' ? '🟢 ' + Math.floor(greenSec / 60) + ':' + ('0' + (greenSec % 60)).slice(-2) : '⏱ ' + Math.floor(cd / 60) + ':' + ('0' + (cd % 60)).slice(-2);
      bon.textContent = withBonus ? '⭐ Calm bonus so far: +' + bonus + ' for every team (each full minute of green)' : '';
    }
    function setMode(m) { mode = m; cd = m === 'yellow' ? 10 : m === 'red' ? 60 : 0; if (m !== 'green') sfx(m === 'yellow' ? 'tap' : 'soft'); else sfx('correct'); A.speak(D.light[m].say); draw(); }
    function tick() {
      if (!running) return;
      if (mode === 'green') { greenSec++; if (withBonus && greenSec % 60 === 0) { bonus++; D.teams.forEach(function (t, i) { addPoint(i, 1); }); sfx('win'); } }
      else { cd--; if (cd <= 0) { mode = 'green'; sfx('correct'); A.speak('Green. Thank you!'); } }
      draw();
    }
    var go = btn('▶ Start the light clock', 'green', function () { running = !running; go.textContent = running ? '⏸ Pause the clock' : '▶ Start the light clock'; sfx('tap'); });
    var bg = btn('🟢 Green', 'green', function () { setMode('green'); }), by = btn('🟡 Yellow', 'amber', function () { setMode('yellow'); }), br = btn('🔴 Red', 'coral', function () { setMode('red'); });
    iv = setInterval(tick, 1000); c.later(function () { clearInterval(iv); });
    var wrap = h('div', { class: 'lightwrap' }, [lamp, h('div', { class: 'lampcol' }, [lab, info, tm, bon, h('div', { class: 'lightbtns' }, [bg, by, br, go])])]);
    draw();
    return wrap;
  }

  function todayR(c) {
    todayScreen(c, 'Our class plan: calm and ready for English!', [
      { e: '📜', t: '3 simple rules', s: 'Sit · One voice · Bell', a: '' },
      { e: '🚦', t: 'The traffic light', s: 'Green · Yellow · Red', a: '' },
      { e: '🤝', t: 'Team points', s: 'A calm class earns a bonus', a: '' }
    ]);
  }

  function rulesR(c) {
    var body = c.body, box = h('div', { class: 'msg gmsg', text: 'Tap a rule. Listen. Then do the action together!' }), best = null, t0 = 0;
    var grid = h('div', { class: 'today' }, D.rules.map(function (r, i) {
      var card = h('button', { type: 'button', class: 'today-card', style: 'cursor:pointer;text-align:left' }, [h('div', { class: 'tn-num', text: String(i + 1) }), fill(h('div', { class: 'tn-em' }), r.e), h('b', { text: r.t }), h('span', { text: r.s })]);
      card.addEventListener('click', function () { sfx('tap'); box.innerHTML = '<b>' + r.t + '</b><br>' + r.act; A.speakSeq([r.t, r.s]); });
      return card;
    }));
    var res = h('div', { class: 'msg gmsg', text: '🔔 Bell game: press the bell. How fast can the whole class be silent? Target: 5 seconds.' });
    var quiet = btn('🤫 The class is silent', 'green big', function () {
      if (!t0) return; var s = (Date.now() - t0) / 1000; t0 = 0; quiet.disabled = true;
      var nb = best == null || s < best; if (nb) best = s;
      res.innerHTML = '⏱ Silent in <b>' + s.toFixed(1) + ' seconds</b>' + (nb ? ' ⭐ new class best!' : '. Best: ' + best.toFixed(1) + ' s') + (s <= 5 ? ' · Target reached! +1 for every team' : ' · Try again, you can do it!');
      if (s <= 5) { D.teams.forEach(function (t, i) { addPoint(i, 1); }); confetti(); sfx('win'); } else sfx('correct');
    });
    quiet.disabled = true;
    var bell = btn('🔔 Ring the bell', 'amber big', function () { t0 = Date.now(); quiet.disabled = false; sfx('win'); A.speak('Stop. Eyes on me.'); res.textContent = '🔔 Bell! Everybody stops. Press the green button when the class is silent.'; });
    body.appendChild(grid); body.appendChild(box); body.appendChild(res); body.appendChild(h('div', { class: 'row' }, [bell, quiet]));
  }

  function lightR(c) {
    var body = c.body; resetCss();
    body.appendChild(h('div', { class: 'msg gmsg', text: '🚦 The traffic light is for the WHOLE class. It never shows a name. Press the colours to hear what they mean.' }));
    body.appendChild(lightPanel(c, false));
    howTo(c, { icon: '🚦', title: 'Which colour?', goal: 'Read the situation. Choose the colour for our class.', pupils: 'Talk in your team. Say: “It is yellow because …”', teacher: 'Tap the colour your team says. Right = +1 point. A wrong tap gives a hint and nothing is lost.' }, function (host, again) {
      var deck = shuffle(D.situations), round = 0, turn = 0, tries = 0;
      var banner = h('div'), card = h('div', { class: 'reqcard' }), opts = h('div', { class: 'row bigopts' }), msg = h('div', { class: 'msg gmsg' });
      function draw() {
        if (round >= deck.length) { gameFinish(c, host, again); return; }
        var cur = deck[round]; tries = 0; var nb = teamBanner(turn, '🚦 Situation ' + (round + 1) + ' of ' + deck.length); banner.replaceWith(nb); banner = nb;
        card.innerHTML = ''; card.appendChild(h('div', { class: 'rq-e', text: cur.e })); card.appendChild(h('div', { class: 'rq-t', text: cur.q })); msg.textContent = ''; opts.innerHTML = ''; A.speak(cur.q);
        [['green', '🟢 Green'], ['yellow', '🟡 Yellow'], ['red', '🔴 Red']].forEach(function (o) {
          var b = btn(o[1], o[0] === 'green' ? 'green big' : o[0] === 'yellow' ? 'amber big' : 'coral big', function () {
            if (o[0] === cur.c) { if (tries === 0) addPoint(turn, 1); sfx('correct'); msg.textContent = '✅ ' + o[1].slice(2) + '! ' + cur.hint; A.speak(cur.hint); round++; turn = (turn + 1) % D.teams.length; setTimeout(draw, 1800); }
            else { tries++; b.classList.remove('wob', 'wobble'); void b.offsetWidth; b.classList.add('wobble'); sfx('soft'); msg.textContent = 'Almost! Think about the whole class.'; A.speak('Try again.'); }
          }); opts.appendChild(b);
        });
      }
      banner = h('div'); host.appendChild(banner); host.appendChild(card); host.appendChild(opts); host.appendChild(msg); draw();
    });
  }

  function movingR(c) {
    var body = c.body, big = h('div', { class: 'bigcmd', text: '🪑 Sit down.' }), msg = h('div', { class: 'msg gmsg', text: 'We stand only in a game round or when the teacher says “Stand”. Practise the signals: the teacher presses a command.' }), n = 0;
    body.appendChild(msg); body.appendChild(big);
    var row = h('div', { class: 'row' }, D.commands.map(function (k) {
      return btn(k.e + ' ' + k.t.replace('.', ''), 'amber', function () { n++; big.innerHTML = k.e + ' ' + k.t; sfx('tap'); A.speak(k.t); });
    }));
    body.appendChild(row);
    body.appendChild(h('div', { class: 'msg gmsg', text: '🎮 Game round: press START. The class may stand and move. Press STOP: everybody freezes and sits in 5 seconds.' }));
    var gr = h('div', { class: 'msg gmsg', text: '' }), t0 = 0;
    var start = btn('▶ START the game round', 'green big', function () { big.innerHTML = '🏃 Game round!<small>Move quietly and safely</small>'; sfx('win'); A.speak('Game round. Go!'); t0 = 0; stop.disabled = false; gr.textContent = ''; });
    var stop = btn('⏹ STOP: freeze and sit', 'coral big', function () { big.innerHTML = '🧊 Freeze. Sit down.'; sfx('soft'); A.speak('Stop. Freeze. Sit down.'); t0 = Date.now(); done.disabled = false; stop.disabled = true; });
    var done = btn('🪑 Everybody is sitting', 'green big', function () { var s = (Date.now() - t0) / 1000; done.disabled = true; gr.innerHTML = '⏱ All sitting in <b>' + s.toFixed(1) + ' seconds</b>' + (s <= 5 ? ' · Great! +1 for every team' : ' · Let us try once more.'); if (s <= 5) { D.teams.forEach(function (t, i) { addPoint(i, 1); }); confetti(); sfx('win'); } else sfx('correct'); big.textContent = '🪑 Sit down.'; });
    stop.disabled = true; done.disabled = true;
    body.appendChild(h('div', { class: 'row' }, [start, stop, done])); body.appendChild(gr);
  }

  function helpR(c) {
    var body = c.body, box = h('div', { class: 'msg gmsg', text: 'If we forget a rule, this is what happens. It is calm, private and the same for everybody. Tap a card.' });
    body.appendChild(box);
    body.appendChild(h('div', { class: 'today' }, D.help.map(function (x, i) {
      var card = h('button', { type: 'button', class: 'today-card', style: 'cursor:pointer;text-align:left' }, [h('div', { class: 'tn-num', text: String(i + 1) }), fill(h('div', { class: 'tn-em' }), x.e), h('b', { text: x.t }), h('span', { text: x.d })]);
      card.addEventListener('click', function () { sfx('tap'); A.speak(x.t + '. ' + x.d); }); return card;
    })));
    body.appendChild(h('div', { class: 'msg gmsg', text: '💬 Kind words. Tap and say them together:' }));
    body.appendChild(h('div', { class: 'row' }, D.kind.map(function (k) { return h('button', { type: 'button', class: 'chip2', text: k.e + ' ' + k.t, onclick: function () { sfx('tap'); A.speak(k.t); } }); })));
  }

  function voiceR(c) {
    var body = c.body, box = h('div', { class: 'msg gmsg', text: '📮 The Class Voice Box: a place for thank-yous, ideas, help and worries. Tap a slip.' });
    body.appendChild(box);
    body.appendChild(h('div', { class: 'today' }, D.voice.map(function (x, i) {
      var card = h('button', { type: 'button', class: 'today-card', style: 'cursor:pointer;text-align:left' }, [h('div', { class: 'tn-num', text: String(i + 1) }), fill(h('div', { class: 'tn-em' }), x.e), h('b', { text: x.t }), h('span', { text: x.s })]);
      card.addEventListener('click', function () { sfx('tap'); box.innerHTML = '<b>' + x.t + '</b>: ' + x.s; A.speakSeq([x.t, x.s]); }); return card;
    })));
    body.appendChild(h('div', { class: 'msg gmsg', html: D.voiceRules.join('<br>') }));
    howTo(c, { icon: '📮', title: 'Finish the sentence', goal: 'Each team picks a slip and says the sentence out loud.', pupils: 'Choose a kind of slip. Start with the words on the card and finish the sentence. Example: “Thank you, Ali, for helping me.”', teacher: 'Tap the slip the team chooses. +1 for every team that says a full sentence. No real worries are said out loud in this game.' }, function (host, again) {
      var turn = 0, banner = h('div'), msg = h('div', { class: 'msg gmsg', text: '' }), opts = h('div', { class: 'row bigopts' });
      function draw() {
        if (turn >= D.teams.length) { gameFinish(c, host, again); return; }
        var nb = teamBanner(turn, '📮 Slip ' + (turn + 1) + ' of ' + D.teams.length); banner.replaceWith(nb); banner = nb; opts.innerHTML = ''; msg.textContent = 'Choose a slip, then finish the sentence together.';
        D.voice.slice(0, 3).forEach(function (x) { var b = btn(x.e + ' ' + x.t, 'amber big', function () { addPoint(turn, 1); sfx('correct'); msg.textContent = '✅ ' + x.s; A.speak(x.s.replace(/…/g, '')); turn++; setTimeout(draw, 2600); }); opts.appendChild(b); });
      }
      banner = h('div'); host.appendChild(banner); host.appendChild(opts); host.appendChild(msg); draw();
    });
  }

  function practiceR(c) {
    var body = c.body, big = h('div', { class: 'bigcmd', text: '🎯 Ready?' }), i = -1, turn = 0, hint = h('div', { class: 'msg gmsg', text: 'Practice lesson: the light is ON. The teacher leads “Simon says” with the commands. A calm class earns a bonus every minute of green.' });
    body.appendChild(hint); body.appendChild(lightPanel(c, true)); body.appendChild(big);
    var deck = shuffle(D.commands);
    var next = btn('🎲 Next command', 'amber big', function () {
      i = (i + 1) % deck.length; var k = deck[i]; big.innerHTML = k.e + ' ' + k.t + '<small>Teacher says: “Simon says …” or only the command</small>'; sfx('tap'); A.speak('Simon says. ' + k.t);
    });
    body.appendChild(h('div', { class: 'row' }, [next]));
  }

  function promiseR(c) {
    howTo(c, { icon: '✍️', title: 'Our class promise', goal: 'Each team chooses ONE promise and says it with a loud, calm voice.', pupils: 'Talk in your team. Choose a promise. Say it together: “We promise: …”', teacher: 'Tap the promise the team chooses. Each team gets +2. After four teams we “sign” the class promise.' }, function (host, again) {
      var turn = 0, banner = h('div'), msg = h('div', { class: 'msg gmsg', text: '' }), opts = h('div', { class: 'row bigopts' });
      function draw() {
        if (turn >= D.teams.length) { gameFinish(c, host, again); return; }
        var nb = teamBanner(turn, '✍️ Promise ' + (turn + 1) + ' of ' + D.teams.length); banner.replaceWith(nb); banner = nb; opts.innerHTML = ''; msg.textContent = 'Choose a promise for your team.';
        D.promises.forEach(function (p) { var b = btn(p.e + ' ' + p.t, 'amber big', function () { addPoint(turn, 2); sfx('win'); confetti(); var pt = p.t.replace(/^I /, 'We ').replace('my turn', 'our turn'); msg.textContent = '✅ ' + D.teams[turn].n + ': “We promise: ' + pt.charAt(0).toLowerCase() + pt.slice(1) + '”'; A.speak('We promise. ' + pt); turn++; setTimeout(draw, 2600); }); opts.appendChild(b); });
      }
      banner = h('div'); host.appendChild(banner); host.appendChild(opts); host.appendChild(msg); draw();
    });
  }

  function finishR(c) { finishScreen(c, 'Our class plan', D.say, '🚪 ' + D.door); }

  var MODES = { game: '🎮 Game', think: '🤔 Think', listen: '👂 Listen', act: '🎭 Act it out', move: '🚶 Move', talk: '🗣️ Talk', race: '🏆 Team race' };
  var LESSONS = {
    1: { title: 'Our Class Plan: the new rules', tab: 'Class plan', missions: [], door: '', scenes: [
      { t: 'Today: our class plan', mins: '3 min', mode: 'think', run: todayR, intro: 'A calm class means more English and more fun.',
        tip: ['Say it warmly: “We are starting a new plan so that everybody can learn and feel good.” Do not talk about past problems or about any child. Make 4 teams. Keep your voice calm and slow today.', 'The traffic light is for the whole class. It never shows a name.'] },
      { t: 'Our 3 rules', mins: '7 min', mode: 'act', run: rulesR, intro: 'Three rules. We practise each one.',
        tip: ['Tap each rule, read it, and do the action together. Then play the Bell game twice: ring the bell, wait for silence, press the green button. A fast calm class (5 seconds or less) earns +1 for every team.', 'Thank the class when it works. Praise the whole class, not individuals.'] },
      { t: 'The traffic light', mins: '7 min', mode: 'game', run: lightR, intro: 'Green, yellow, red: what do they mean?',
        tip: ['Show each colour and read what we do: green = calm bonus; yellow = ten seconds to be calm; red = stop, sit, silent for one minute. Then play “Which colour?” with the teams. A wrong answer only gives a hint.', 'Say clearly: yellow and red are about the class, not about one pupil.'] },
      { t: 'Moving in class', mins: '3 min', mode: 'move', run: movingR, intro: 'We stand only in a game round or on the signal.',
        tip: ['Practise the commands (Stand, Sit, Hands up, Quiet, Eyes on me). Then do one game round: START, move for 20 seconds, STOP: freeze and sit in 5 seconds. Repeat twice.'] },
      { t: 'If we forget a rule', mins: '4 min', mode: 'talk', run: helpR, intro: 'The steps are calm, private and fair.',
        tip: ['Read the five cards in simple words. Say it plainly and calmly: the rules are for everybody, the steps are the same for everybody, and they are private (nobody is named in front of the class). The aim is that every pupil can learn. Then say the kind words together.'] },
      { t: 'Our Class Voice Box', mins: '3 min', mode: 'talk', run: voiceR, intro: 'A place for thank-yous, ideas, help and worries.',
        tip: ['Show the box and the four kinds of slips (print class-reset/voice-box.html). Explain how it works in simple words: the teacher reads it on Tuesday and Friday, worries are never read aloud, and serious things go to the people who can help. Then play “Finish the sentence” with thank-you, idea and help only: do not ask for real worries in front of the class.'] },
      { t: 'Practice lesson', mins: '5 min', mode: 'act', run: practiceR, intro: 'The light is on. Simon says!',
        tip: ['Press “Start the light clock”. Lead Simon says with the commands. Keep the light green by praising calm behaviour. If it gets loud, press Yellow (10 seconds) and wait with a calm voice. Every full green minute gives +1 to every team.'] },
      { t: 'Our class promise', mins: '2 min', mode: 'talk', run: promiseR, intro: 'Each team makes a promise.',
        tip: ['Each team chooses one promise and says it loudly and calmly. +2 for each team. Then say: “We have a plan. I know you can do it.”'] },
      { t: 'Plan done!', mins: '1 min', mode: 'think', run: finishR, intro: 'Scores and one sentence each.',
        tip: ['Read the scores. Each team says one sentence. At the door each pupil says one rule.'] }
    ] },
    2: { title: 'Daily 3-minute reset', tab: 'Daily reset', missions: [], door: '', scenes: [
      { t: 'Our 3 rules', mins: '2 min', mode: 'act', run: rulesR, intro: 'Quick reminder at the start of the lesson.',
        tip: ['Use this at the start of any lesson: read the three rules, do one bell game.'] },
      { t: 'The light is on', mins: 'all lesson', mode: 'think', run: function (c) { c.body.appendChild(h('div', { class: 'msg gmsg', text: '🚦 Keep this page open on the board during the lesson. Green time earns a bonus for every team.' })); c.body.appendChild(lightPanel(c, true)); }, intro: 'The class traffic light for the whole lesson.',
        tip: ['Open a second tab for the lesson itself and keep this one for the light, or switch back and forth.'] }
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
