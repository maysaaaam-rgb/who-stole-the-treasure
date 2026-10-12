/* Grade 3 Unit 3: Word City: one teacher-led smartboard lesson (35 minutes). The board is the stage, timer and scoreboard.
   The children move, act, talk and play. Four teams earn points all lesson. One smartboard. Built from the Unit 3 lesson shell. */
(function () {
  'use strict';
  var D = window.W5CityData, A = window.ForestAudio;
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
  var ART = { '🏭': 'o_factory', '🚪': 'o_gate', '🕳️': 'o_hole', '🪤': 'o_trap', '🚃': 'o_train' };
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
    var host = $('stage'), em = ['⭐', '🎉', '🎈', '✨', '🚂', '🏆'], k, w = h('div', { class: 'confetti' });
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

  /* ============================== shared game engines for the Unit 3 Grade 3 lessons ============================== */
  function bgOf(el, name) { if (el && hasArt(name)) el.style.background = 'url(art/' + name + '.webp) center / cover'; }
  function nextTurn(t) { return (t + 1) % D.teams.length; }
  function sayWords(s) { try { A.speak(s); } catch (e) { /* optional */ } }

  /* Picture quiz: a word or sentence, three pictures. Right = 2 points (1 if you steal). Wrong: the next team can steal. */
  function pickRounds(c, rounds, opts) {
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    function start() {
      host.innerHTML = '';
      var N = rounds.length, i = 0, turn = 0, tries = 0, answered = false;
      var qbox = h('div', { class: 'qbox' }), opts3 = h('div', { class: 'qopts' }), msg = h('div', { class: 'msg gmsg', text: '' });
      var nxt = btn('Next ▶', 'green big', function () { nxt.style.display = 'none'; msg.textContent = ''; ask(); });
      function ask() {
        if (i >= N) { gameFinish(c, host, start); return; }
        var r = rounds[i]; answered = false; qbox.innerHTML = ''; opts3.innerHTML = ''; nxt.style.display = 'none';
        qbox.appendChild(h('div', { class: 'qteam', style: '--c:' + D.teams[turn].c, text: teamName(turn) + (tries ? ', your chance to steal!' : ', your turn!') + '   (' + (i + 1) + ' of ' + N + ')' }));
        qbox.appendChild(h('div', { class: 'qtext', text: (opts && opts.prefix ? opts.prefix + ' ' : '') + r.q })); sayWords(r.q); qbox.appendChild(sayBtn(r.q, 'Read it'));
        shuffle(r.o.map(function (o, k) { return { o: o, k: k }; })).forEach(function (x) {
          var b = h('button', { type: 'button', class: 'btn qopt picopt' }, [fill(h('span', { class: 'pe' }), x.o.e), h('b', { text: x.o.n })]);
          b.addEventListener('click', function () {
            if (answered) return;
            if (x.k === r.a) {
              answered = true; b.classList.add('right'); addPoint(turn, tries ? 1 : 2); sfx('correct'); msg.textContent = '✔ ' + r.say + ' (+' + (tries ? 1 : 2) + ')'; sayWords(r.say);
              i++; tries = 0; turn = nextTurn(turn); nxt.textContent = i >= N ? '🏆 See the winner' : 'Next ▶'; nxt.style.display = 'inline-flex';
            } else if (!tries) {
              b.classList.add('wrong'); b.disabled = true; tries = 1; sfx('tap'); turn = nextTurn(turn); msg.textContent = 'Not this time. The next team can steal it!'; sayWords('Not this time. Next team!'); setTimeout(ask, 1300);
            } else {
              answered = true; b.classList.add('wrong'); sfx('tap'); msg.textContent = 'Nobody got it. ' + r.say; sayWords(r.say); i++; tries = 0;
              nxt.textContent = i >= N ? '🏆 See the winner' : 'Next ▶'; nxt.style.display = 'inline-flex';
            }
          });
          opts3.appendChild(b);
        });
      }
      host.appendChild(h('div', { class: 'row' }, [h('span', { class: 'lab', text: 'Talk with your team, then one pupil taps the picture. Right = 2 points (1 if you steal).' })]));
      host.appendChild(qbox); host.appendChild(opts3); host.appendChild(h('div', { class: 'row' }, [nxt, msg])); ask();
    }
    start();
  }

  /* Sentence builder: tap the word cards in the right order. A right sentence moves the walker one step along the track. */
  function sentenceBuilder(c, list, cfg) {
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    function start() {
      host.innerHTML = '';
      var N = list.length, i = 0, turn = 0, picked = [], locked = false, stepIcons = cfg.stops;
      var track = h('div', { class: 'strack' }), walker = fill(h('span', { class: 'swalker' }), cfg.walker), banner = h('div', { class: 'gturn' }), line = h('div', { class: 'sline' }), bank = h('div', { class: 'sbank' }), msg = h('div', { class: 'msg gmsg', text: '' });
      stepIcons.forEach(function (e, k) { track.appendChild(h('div', { class: 'sstop', id: 'ss' + k }, [fill(h('span'), e)])); });
      track.appendChild(walker);
      function place() { var pct = N ? (i / N) * 86 : 0; walker.style.left = pct + '%'; [].forEach.call(track.querySelectorAll('.sstop'), function (el, k) { el.classList.toggle('lit', k < i); }); }
      function paint() { var t = D.teams[turn]; banner.style.setProperty('--c', t.c); banner.innerHTML = ''; banner.appendChild(h('span', { class: 'tn', text: t.e + ' ' + t.n + '’ turn' })); banner.appendChild(h('span', { class: 'gb', text: cfg.label + ' ' + Math.min(i + 1, N) + ' of ' + N })); }
      function draw() {
        if (i >= N) { sfx('win'); confetti(); msg.textContent = cfg.done; sayWords(cfg.done); setTimeout(function () { gameFinish(c, host, start); }, 1800); return; }
        var words = list[i].s.replace(/[.!?]$/, '').split(' '), punct = (list[i].s.match(/[.!?]$/) || [''])[0]; picked = []; locked = false;
        paint(); place(); line.innerHTML = ''; bank.innerHTML = '';
        shuffle(words.map(function (w, k) { return { w: w, k: k }; })).forEach(function (x) {
          var b = h('button', { type: 'button', class: 'btn stile', text: x.w });
          b.addEventListener('click', function () {
            if (locked || b.classList.contains('used')) return; b.classList.add('used'); picked.push(x); sayWords(x.w); sfx('tap');
            line.appendChild(h('span', { class: 'sw', text: x.w })); if (picked.length === words.length) check(words, punct);
          });
          bank.appendChild(b);
        });
        msg.textContent = cfg.hint;
      }
      function check(words, punct) {
        locked = true; var ok = picked.every(function (p, k) { return p.k === k; });
        if (ok) { addPoint(turn, 2); sfx('correct'); msg.textContent = '✔ ' + list[i].s + ' (+2 points)'; sayWords(list[i].s); i++; turn = nextTurn(turn); setTimeout(draw, 2200); }
        else { sfx('tap'); line.classList.add('wob'); msg.textContent = 'Not yet. Try again, next team!'; sayWords('Try again.'); turn = nextTurn(turn); setTimeout(function () { line.classList.remove('wob'); draw0(); }, 1100); }
      }
      function draw0() { var cur = i; draw(); i = cur; }
      host.appendChild(banner); host.appendChild(track); host.appendChild(line); host.appendChild(msg); host.appendChild(bank);
      host.appendChild(h('div', { class: 'row' }, [btn('↩ Start again', 'small ghost', function () { var cur = i; draw(); i = cur; })]));
      draw();
    }
    start();
  }

  /* ============================== Word City (Grade 3 Unit 3) ============================== */
  function hook(c) {
    hookPrompts(c, [{ e: '🏙️' }, { e: '🏭' }, { e: '🚪' }], D.hookPrompts, D.missions, '');
    var st = c.body.querySelector('.hook-stage'); if (st) { st.style.background = 'linear-gradient(#1e3a8a, #6d28d9 60%, #0f172a)'; bgOf(st, 'bg_city'); }
  }

  /* GAME 1: city explore. The team in turn taps a place; the character walks there and may find a hidden word for the backpack. */
  function cityExplore(c) {
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    function start() {
      host.innerHTML = '';
      var turn = 0, found = 0, total = D.city.filter(function (p) { return p.w; }).length, bag = [];
      var banner = h('div', { class: 'gturn' }), grid = h('div', { class: 'citygrid' }), pack = h('div', { class: 'backpack' }), msg = h('div', { class: 'msg gmsg', text: 'Tap a place. Walk there and look! Some places hide a word.' });
      function paint() { var t = D.teams[turn]; banner.style.setProperty('--c', t.c); banner.innerHTML = ''; banner.appendChild(h('span', { class: 'tn', text: t.e + ' ' + t.n + '’ turn' })); banner.appendChild(h('span', { class: 'gb', text: '🎒 ' + found + ' / ' + total + ' words' })); }
      function drawPack() { pack.innerHTML = ''; pack.appendChild(h('span', { class: 'lab', text: '🎒 Backpack:' })); bag.forEach(function (w) { pack.appendChild(h('button', { type: 'button', class: 'chip2', text: w, onclick: function () { sayWords(w); } })); }); }
      D.city.forEach(function (p) {
        var b = h('button', { type: 'button', class: 'btn place' }, [fill(h('span', { class: 'plc' }), p.place), h('b', { text: p.n })]);
        b.addEventListener('click', function () {
          if (b.classList.contains('seen')) { sayWords(p.say); return; }
          b.classList.add('seen'); b.querySelector('.plc').classList.add('walk');
          setTimeout(function () {
            if (p.w) { b.appendChild(h('div', { class: 'foundcard' }, [fill(h('span', { class: 'fe' }), p.e), h('b', { text: p.w })])); bag.push(p.w); found++; addPoint(turn, 2); sfx('correct'); msg.textContent = '🎉 You found: ' + p.w + '! +2 points'; sayWords(p.say); drawPack(); }
            else { b.appendChild(h('div', { class: 'foundcard empty' }, [h('b', { text: 'nothing' })])); sfx('tap'); msg.textContent = 'Nothing here. Try another place!'; sayWords('Nothing here.'); }
            turn = nextTurn(turn); paint();
            if (found >= total) { sfx('win'); confetti(); setTimeout(function () { gameFinish(c, host, start); }, 2200); }
          }, 600);
        });
        grid.appendChild(b);
      });
      bgOf(grid, 'bg_city'); grid.classList.add('hasbg'); host.appendChild(banner); host.appendChild(grid); host.appendChild(pack); host.appendChild(msg); drawPack(); paint();
    }
    start();
  }

  /* GAME 2: letter factory. Letters are scattered. Tap them in the right order to fill the machine. */
  function letterFactory(c) {
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    function start() {
      host.innerHTML = '';
      var i = 0, turn = 0, pos = 0, N = D.factory.length;
      var banner = h('div', { class: 'gturn' }), machine = h('div', { class: 'machine' }), belt = h('div', { class: 'belt' }), msg = h('div', { class: 'msg gmsg', text: '' }), clue = h('div', { class: 'fclue' });
      function paint() { var t = D.teams[turn]; banner.style.setProperty('--c', t.c); banner.innerHTML = ''; banner.appendChild(h('span', { class: 'tn', text: t.e + ' ' + t.n + '’ turn' })); banner.appendChild(h('span', { class: 'gb', text: '🏭 Word ' + Math.min(i + 1, N) + ' of ' + N })); }
      function draw() {
        if (i >= N) { sfx('win'); confetti(); setTimeout(function () { gameFinish(c, host, start); }, 1200); return; }
        var w = D.factory[i]; pos = 0; paint(); machine.innerHTML = ''; belt.innerHTML = ''; clue.innerHTML = '';
        clue.appendChild(fill(h('span', { class: 'fce' }), w.clue)); clue.appendChild(btn('🔊 Hear the word', 'small amber', function () { sayWords(w.say); }));
        w.w.split('').forEach(function (ch, k) { machine.appendChild(h('span', { class: 'slot', id: 'slot' + k, text: '' })); });
        shuffle(w.w.split('').map(function (ch, k) { return { ch: ch, k: k }; })).forEach(function (x, n) {
          var b = h('button', { type: 'button', class: 'btn letter', style: 'animation-delay:-' + (n * 0.7) + 's', text: x.ch });
          b.addEventListener('click', function () {
            if (b.classList.contains('used')) return;
            if (x.ch === w.w.charAt(pos)) {
              b.classList.add('used'); var sl = machine.querySelector('#slot' + pos); sl.textContent = x.ch; sl.classList.add('on'); sayWords(x.ch.toLowerCase()); sfx('coin'); pos++;
              if (pos === w.w.length) { addPoint(turn, 2); sfx('correct'); machine.classList.add('lit'); msg.textContent = '🏭 ' + w.w.toLowerCase() + '! The machine works! +2 points'; sayWords(w.say); i++; turn = nextTurn(turn); setTimeout(function () { machine.classList.remove('lit'); draw(); }, 2400); }
            } else { b.classList.remove('wob'); void b.offsetWidth; b.classList.add('wob'); sfx('tap'); msg.textContent = 'Not that letter. Look at the machine: which letter comes next?'; }
          });
          belt.appendChild(b);
        });
        msg.textContent = 'Tap the letters in the right order. Say the word!';
      }
      host.appendChild(banner); host.appendChild(clue); host.appendChild(machine); host.appendChild(belt); host.appendChild(msg); draw();
    }
    start();
  }

  /* GAME 3: -ng balloons. One team at a time, 25 seconds. Tap balloons whose word ends with -ng. */
  function balloons(c) {
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    var played = {}, turn = 0, running = false, caught = 0, left = 25, spawnIv = null, tickIv = null;
    function stop() { running = false; if (spawnIv) clearInterval(spawnIv); if (tickIv) clearInterval(tickIv); spawnIv = tickIv = null; field.innerHTML = ''; }
    c.later(stop);
    var field = h('div', { class: 'balloonfield' }), info = h('div', { class: 'msg gmsg', text: 'Tap the balloons with words that end with -ng. Do not tap the others!' }), hud = h('div', { class: 'row' });
    var cnt = h('span', { class: 'pill amber', text: '🎈 0' }), clock = h('span', { class: 'pill violet', text: '⏱ 25' });
    function drawHud() { hud.innerHTML = ''; D.teams.forEach(function (t, i) { hud.appendChild(h('span', { class: 'pill' + (played[i] ? '' : ' amber'), style: i === turn && !played[i] ? 'outline:3px solid ' + t.c : '', text: t.e + ' ' + (played[i] ? '✓ ' + played[i].n : t.n) })); }); }
    function spawn() {
      var good = Math.random() < 0.6, pool = good ? D.balloonsGood : D.balloonsBad, w = pool[Math.floor(Math.random() * pool.length)], col = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7'][Math.floor(Math.random() * 5)];
      var el = h('button', { type: 'button', class: 'balloon', style: 'left:' + (4 + Math.random() * 78) + '%;--bc:' + col + ';animation-duration:' + (4.2 + Math.random() * 2) + 's' }, [h('i', { text: '🎈' }), h('b', { text: w })]);
      el.addEventListener('animationend', function () { el.remove(); });
      el.addEventListener('click', function () {
        if (!running || el.classList.contains('hit')) return; el.classList.add('hit'); sayWords(w);
        if (good) { caught++; cnt.textContent = '🎈 ' + caught; sfx('coin'); el.classList.add('pop'); } else { sfx('tap'); el.classList.add('oops'); }
        setTimeout(function () { el.remove(); }, 260);
      });
      field.appendChild(el);
    }
    var go = btn('▶ Start', 'green big', function () {
      if (running) return;
      if (D.teams.every(function (t, i) { return played[i]; })) { gameFinish(c, host, function () { host.parentNode.removeChild(host); balloons(c); }); return; }
      while (played[turn]) turn = nextTurn(turn);
      caught = 0; left = 25; cnt.textContent = '🎈 0'; clock.textContent = '⏱ 25'; field.innerHTML = ''; running = true; sfx('page'); go.disabled = true; go.textContent = '🎮 ' + D.teams[turn].n + ' play!'; drawHud();
      spawn(); spawnIv = setInterval(spawn, 650);
      tickIv = setInterval(function () {
        left--; clock.textContent = '⏱ ' + left;
        if (left <= 0) {
          stop(); addPoint(turn, caught); played[turn] = { n: caught }; sfx('win'); info.textContent = D.teams[turn].n + ' caught ' + caught + '! +' + caught + ' points'; sayWords(D.teams[turn].n + ' caught ' + caught + '!');
          var done = D.teams.every(function (t, i) { return played[i]; }); go.disabled = false; go.textContent = done ? '🏆 See the winner' : '▶ Next team'; if (!done) { turn = nextTurn(turn); while (played[turn]) turn = nextTurn(turn); } drawHud();
        }
      }, 1000);
    });
    host.appendChild(h('div', { class: 'row' }, [go, clock, cnt, h('span', { class: 'lab', text: 'One team at a time. Everybody shouts the words!' })])); host.appendChild(hud); host.appendChild(field); host.appendChild(info); drawHud();
  }

  /* GAME 4: word trains. Tap a word, then the right train car. */
  function wordTrains(c) {
    var host = h('div', { class: 'gameroot' }); c.body.appendChild(host);
    function start() {
      host.innerHTML = '';
      var queue = shuffle(D.words), i = 0, turn = 0, N = queue.length, loaded = { T: [], P: [], D: [] };
      var banner = h('div', { class: 'gturn' }), card = h('div', { class: 'trainword' }), cars = h('div', { class: 'cars' }), msg = h('div', { class: 'msg gmsg', text: '' });
      function paint() { var t = D.teams[turn]; banner.style.setProperty('--c', t.c); banner.innerHTML = ''; banner.appendChild(h('span', { class: 'tn', text: t.e + ' ' + t.n + '’ turn' })); banner.appendChild(h('span', { class: 'gb', text: '🚂 Word ' + Math.min(i + 1, N) + ' of ' + N })); }
      function drawCars() { cars.innerHTML = ''; D.cars.forEach(function (cr) { var b = h('button', { type: 'button', class: 'btn car', style: '--c:' + cr.c }, [fill(h('span', { class: 'ce' }), '🚃'), h('b', { text: cr.t }), h('div', { class: 'cargo' }, loaded[cr.k].map(function (w) { return h('span', { class: 'gchip', text: w }); }))]); b.addEventListener('click', function () { choose(cr.k); }); cars.appendChild(b); }); }
      function draw() {
        if (i >= N) { sfx('win'); confetti(); setTimeout(function () { gameFinish(c, host, start); }, 1500); return; }
        var w = queue[i]; card.innerHTML = ''; card.appendChild(fill(h('span', { class: 'twe' }), w.e)); card.appendChild(h('b', { text: w.w })); card.appendChild(btn('🔊', 'small ghost', function () { sayWords(w.w); })); sayWords(w.w); paint(); drawCars(); msg.textContent = 'Which train car is it? Things and places, people, or describing words?';
      }
      function choose(k) {
        var w = queue[i];
        if (k === w.k) { loaded[k].push(w.w); addPoint(turn, 2); sfx('correct'); msg.textContent = '✔ ' + w.w + ' goes here! +2 points'; sayWords(w.w); i++; turn = nextTurn(turn); drawCars(); setTimeout(draw, 1300); }
        else { sfx('tap'); msg.textContent = 'Not that car. Next team!'; sayWords('Next team!'); turn = nextTurn(turn); paint(); }
      }
      bgOf(cars, 'bg_station'); cars.classList.add('hasbg'); host.appendChild(banner); host.appendChild(card); host.appendChild(cars); host.appendChild(msg); draw();
    }
    start();
  }

  function wrap(c) { wrapStart(c, 1, '🚪', 'The gate is open!'); }

  var MODES = { game: '🎮 Game', think: '🤔 Think', listen: '👂 Listen', act: '🎭 Act it out', move: '🚶 Move', talk: '🗣️ Talk', race: '🏆 Team race', create: '🧩 Build' };
  var LESSONS = {
    1: { title: 'Word City', missions: D.missions, door: '🚪 Door pass: say ONE word you found in Word City!', scenes: [
      { t: 'Welcome to Word City', mins: '3 min', mode: 'think', run: hook, intro: 'Welcome to Word City! The words are hidden. Can you find them?',
        kids: { steps: ['👀 Look at the city', '🤔 Where can a word hide?', '✋ Tell the class'], say: ['I can see a factory.', 'I can see a gate.'] },
        tip: ['Book link: Unit 3 poem The Bear and I, words and the -ng sound, p. ___.', 'Press the button for each prompt. Show the five missions at the end.'] },
      { t: 'GAME: Explore the City', mins: '6 min', mode: 'game', run: cityExplore, intro: 'Tap a place. Your character walks there. Find the hidden words for your backpack!',
        kids: { steps: ['👆 Tap a place', '🔍 Look: is there a word?', '🎒 Say the word and keep it'], say: ['hole', 'trap', 'enemy', 'thin'] },
        tip: ['Book link: words from the poem, p. ___ (hole, trap, enemy, thin).', 'Teams take turns tapping a place. A found word = 2 points and goes in the backpack. Two places are empty. Tap a card in the backpack to hear it again.', 'Ask: "What is thin? What is a trap?" and let pupils show it with their body.'] },
      { t: 'GAME: The Letter Factory', mins: '7 min', mode: 'game', run: letterFactory, intro: 'The factory is broken! The letters are all over the place. Put them in the machine in the right order.',
        kids: { steps: ['🔊 Hear the word', '👀 Look at the letters', '👆 Tap them in order'], say: ['sing', 'long', 'spring'] },
        tip: ['Book link: phonics -ng, p. ___ (sing, long, spring).', 'The team in turn taps the letters in the right order; wrong letters only wobble. Right = 2 points and the machine lights up. Three words.', 'Say the ending slowly: "si-ng". Ask for more -ng words after each one.'] },
      { t: 'GAME: -ng Balloons', mins: '6 min', mode: 'game', run: balloons, intro: 'Balloons fly up! Catch only the words that end with -ng.',
        kids: { steps: ['👀 Read the balloon words', '👆 Tap the -ng words', '🗣️ Everybody shouts the word'], say: ['sing', 'long', 'bang', 'spring'] },
        tip: ['Book link: phonics -ng, p. ___.', 'Each team has 25 seconds. One pupil taps while the team shouts the words. Wrong balloons only wobble: nobody loses points. Four teams, then the winner is shown.'] },
      { t: 'GAME: Word Trains', mins: '6 min', mode: 'game', run: wordTrains, intro: 'Load each word into the right train car: things and places, people, or describing words.',
        kids: { steps: ['👂 Listen to the word', '🤝 Talk with your team', '🚃 Tap the right car'], say: ['hole is a thing', 'thin is a describing word'] },
        tip: ['Book link: word types and meanings, p. ___.', 'Teams take turns. Right = 2 points and the word rides in the car. Wrong = the next team tries. Seven words.', 'Ask why: "Why is thin a describing word?" (It tells us about the ice or the road.)'] },
      { t: 'The Magic Gate', mins: '5 min', mode: 'create', run: function (c) { sentenceBuilder(c, D.gate, { walker: '🧙', stops: ['🔒', '🔒', '🔒', '🔒', '🚪'], label: 'Sentence', hint: 'Build the sentence. Each right sentence lights a part of the gate!', done: '🚪 The magic gate is open!' }); }, intro: 'Use your words to build sentences. Each right sentence opens a part of the magic gate!',
        kids: { steps: ['🧩 Look at the word cards', '🗣️ Say the sentence in your head', '👆 Tap the words in order'], say: ['There is a hole in the ground.', 'The road is long.'] },
        tip: ['Book link: making sentences with the new words, p. ___ (There is a hole in the ground.).', 'Four sentences light the gate. The team in turn taps the cards. Right = 2 points. Wrong = the next team tries.'] },
      { t: 'The Gate Is Open!', mins: '2 min', mode: 'think', run: wrap, intro: 'You opened the gate. Well done, word explorers!',
        kids: { steps: ['🏆 Cheer for every team', '🚪 Door pass: one word'], say: ['hole', 'sing', 'thin'] },
        tip: ['Show the scores. At the door each pupil says one word from the city and uses it in a short sentence.'] }
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
  window.W5Lessons = { state: state, go: go, LESSONS: LESSONS };
  loadManifest(function () { drawTeams(); go(1, s0); });
})();
