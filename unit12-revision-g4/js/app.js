/* Grade 4 Revision Quest (Units 1 and 2): one 25-minute smartboard lesson.
   Memory methods: say it, hide it, say it again (vanishing sentences), picture + gesture words, team recall.
   The board is the stage, timer and scoreboard. Four teams earn points. Nothing is stored. */
(function () {
  'use strict';
  var D = window.RevData, A = window.ForestAudio;
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
  function btn(text, cls, fn) { return h('button', { type: 'button', class: 'btn ' + (cls || ''), text: text, onclick: fn }); }
  function art(name, cls) { return h('img', { class: 'pic' + (cls ? ' ' + cls : ''), src: 'art/' + name + '.webp', alt: '', draggable: 'false' }); }
  function face(o, cls) { return o.a ? art(o.a, cls) : (o.art ? art(o.art, cls) : h('span', { class: 'emo ' + (cls || ''), text: o.e })); }

  var state = { idx: 0, scores: D.teams.map(function () { return 0; }), done: {}, cleanups: [] };

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
  function confetti() {
    var host = $('stage'), em = ['⭐', '🎉', '🌟', '✨', '🦋', '🍂', '🌲'], k, w = h('div', { class: 'confetti' });
    for (k = 0; k < 26; k++) w.appendChild(h('i', { text: em[k % em.length], style: 'left:' + Math.random() * 96 + '%;animation-delay:' + Math.random() * 0.5 + 's;font-size:' + (2.4 + Math.random() * 2.4) + 'vh' }));
    host.appendChild(w); setTimeout(function () { w.remove(); }, 2400);
  }
  function timerBtn(c, sec, onEnd) {
    var left = sec, iv = null, b = h('button', { type: 'button', class: 'btn small violet timer-btn' });
    function fmt() { return '⏱ ' + Math.floor(left / 60) + ':' + ('0' + (left % 60)).slice(-2); }
    function reset() { if (iv) { clearInterval(iv); iv = null; } left = sec; b.textContent = fmt(); b.classList.remove('run', 'end'); }
    b.textContent = fmt();
    b.addEventListener('click', function () {
      if (iv) { reset(); return; }
      b.classList.remove('end'); b.classList.add('run'); sfx('tap');
      iv = setInterval(function () { left--; b.textContent = fmt(); if (left <= 0) { clearInterval(iv); iv = null; b.classList.remove('run'); b.classList.add('end'); sfx('win'); if (onEnd) onEnd(); setTimeout(function () { left = sec; b.textContent = fmt(); b.classList.remove('end'); }, 4000); } }, 1000);
    });
    c.later(function () { if (iv) clearInterval(iv); });
    b.resetTimer = reset;
    return b;
  }
  function podium(host) {
    var order = D.teams.map(function (t, i) { return { t: t, s: state.scores[i] }; }).sort(function (a, b) { return b.s - a.s; }), medals = ['🥇', '🥈', '🥉', '⭐'];
    host.appendChild(h('div', { class: 'podium' }, order.map(function (o, k) { return h('div', { class: 'pod', style: '--c:' + o.t.c + ';height:' + (30 - k * 4) + 'vh' }, [h('div', { class: 'em', text: o.t.e }), h('div', { text: medals[k] + ' ' + o.t.n }), h('b', { text: o.s + ' ⭐' })]); })));
  }
  function unitChip(u) { return h('span', { class: 'pill unit u' + u, text: u === 1 ? 'UNIT 1 · Alice, butterflies, the brain' : 'UNIT 2 · forests and the swallow' }); }

  /* ============ 1. MISSION ============ */
  function sceneMission(c) {
    var body = c.body;
    var cols = h('div', { class: 'goalcols' });
    [1, 2].forEach(function (u) {
      var col = h('div', { class: 'goalcol u' + u }, [h('div', { class: 'gh', text: u === 1 ? '📖 Unit 1' : '🌲 Unit 2' })]);
      D.goals.filter(function (g) { return g.u === u; }).forEach(function (g) { col.appendChild(h('div', { class: 'goal', text: '✔ ' + g.t })); });
      cols.appendChild(col);
    });
    var trick = h('div', { class: 'trick' }, [
      h('div', { class: 'tk', html: '<b>1</b> 🗣️ Say it' }), h('div', { class: 'ar', text: '➜' }),
      h('div', { class: 'tk', html: '<b>2</b> 🫥 Hide it' }), h('div', { class: 'ar', text: '➜' }),
      h('div', { class: 'tk', html: '<b>3</b> 🧠 Say it from memory!' })
    ]);
    body.appendChild(cols); body.appendChild(trick);
    body.appendChild(h('div', { class: 'row' }, [btn('🔊 Read the goals', 'amber', function () { A.speakSeq(D.goals.map(function (g) { return g.t; })); }), btn('🎉 Ready, team!', 'green', function () { sfx('win'); confetti(); })]));
  }

  /* ============ 2 + 4. VANISHING SENTENCES ============ */
  function sceneVanish(list, unit) {
    return function (c) {
      var body = c.body, i = 0, level = 0, order = [], words = [], revealed = false;
      var card = h('div', { class: 'vcard u' + unit }), info = h('div', { class: 'msg' }), gest = h('div', { class: 'gesture' });
      var lvl = h('span', { class: 'pill amber' });
      function split(w) { var m = /^(.*?)([.,?!"]*)$/.exec(w); return { core: m[1], tail: m[2] }; }
      function setup() {
        var s = list[i]; words = s.s.split(' ').map(split); order = shuffle(words.map(function (w, k) { return k; })); level = 0; revealed = false;
        draw(); info.textContent = '🗣️ Say it together, then press Hide more.';
      }
      function hiddenCount() { return level === 0 ? 0 : (level >= 4 ? words.length : Math.ceil(words.length * level / 4)); }
      function draw() {
        var s = list[i], hid = {}, n = hiddenCount(), k;
        for (k = 0; k < n; k++) hid[order[k]] = true;
        card.innerHTML = '';
        var pics = h('div', { class: 'vpics' });
        (s.art || []).forEach(function (a) { pics.appendChild(art(a)); });
        (s.pics || []).forEach(function (e) { pics.appendChild(h('span', { class: 'emo', text: e })); });
        card.appendChild(pics);
        var line = h('div', { class: 'vline' });
        words.forEach(function (w, k2) {
          var gone = hid[k2] && !revealed;
          line.appendChild(h('span', { class: 'vw' + (gone ? ' gone' : ''), text: gone ? new Array(Math.min(Math.max(w.core.length, 2), 9) + 1).join('_') + w.tail : w.core + w.tail }));
          line.appendChild(document.createTextNode(' '));
        });
        card.appendChild(line);
        gest.textContent = 'Gesture: ' + s.g;
        lvl.textContent = 'Sentence ' + (i + 1) + ' of ' + list.length + '  •  hidden ' + Math.min(level, 4) + '/4';
      }
      var say = btn('🔊 Say it', 'violet', function () { A.speak(list[i].s); });
      var hide = btn('🫥 Hide more', 'amber big', function () {
        if (revealed) return;
        if (level < 4) level++;
        draw(); sfx(level >= 4 ? 'season' : 'tap');
        info.textContent = level >= 4 ? '🧠 Everything is hidden! Say it from memory!' : (level === 3 ? '💪 Almost all gone. Louder!' : '🗣️ Say it again together.');
      });
      var rev = btn('👀 Check it', 'green', function () { revealed = true; draw(); sfx('correct'); A.speak(list[i].s); info.textContent = '⭐ Did you remember it? Give a team a point!'; });
      var nxt = btn(i === list.length - 1 ? 'Last one ✔' : 'Next sentence ▶', 'cyan', function () {
        if (i >= list.length - 1) { sfx('win'); confetti(); info.textContent = '🏁 All sentences done! Press Next step.'; c.done(); return; }
        i++; nxt.textContent = i === list.length - 1 ? 'Last one ✔' : 'Next sentence ▶'; setup(); sfx('page');
      });
      body.appendChild(h('div', { class: 'row' }, [unitChip(unit), lvl]));
      body.appendChild(card); body.appendChild(gest); body.appendChild(info);
      body.appendChild(h('div', { class: 'row' }, [say, hide, rev, nxt]));
      body.appendChild(pointsRow());
      setup();
    };
  }

  /* ============ 3 + 5. WORD GYM ============ */
  function sceneGym(list, unit) {
    return function (c) {
      var body = c.body, cells = [], shown = list.map(function () { return true; }), mystery = -1;
      var info = h('div', { class: 'msg', text: '👀 Learn: tap a card. Say the word and do the gesture!' }), gest = h('div', { class: 'gesture', style: 'display:none' });
      var grid = h('div', { class: 'gym n' + list.length });
      list.forEach(function (o, k) {
        var lab = h('div', { class: 'gl', text: o.w });
        var cell = h('button', { type: 'button', class: 'gcard u' + unit, onclick: function () { tap(k); } }, [h('div', { class: 'gf' }, [face(o)]), lab]);
        cell._lab = lab; cells.push(cell); grid.appendChild(cell);
      });
      function paint(k) { var o = list[k]; cells[k]._lab.textContent = shown[k] ? o.w : '?'; cells[k].classList.toggle('hidden', !shown[k]); }
      function paintAll() { list.forEach(function (o, k) { paint(k); }); }
      function tap(k) {
        var o = list[k];
        shown[k] = true; paint(k); sfx('tap'); A.speak(o.w);
        gest.style.display = 'block'; gest.textContent = 'Gesture: ' + o.g + '   •   ' + o.x;
        if (mystery === k) { mystery = -1; cells.forEach(function (x) { x.classList.remove('dim', 'spot'); }); info.textContent = '⭐ Yes! Give a team a point!'; sfx('correct'); }
      }
      var hideAll = btn('🙈 Hide all words', 'amber', function () { shown = list.map(function () { return false; }); paintAll(); mystery = -1; cells.forEach(function (x) { x.classList.remove('dim', 'spot'); }); info.textContent = '🧠 Look at the pictures. Can you say every word? Tap a card to check.'; sfx('season'); });
      var showAll = btn('👀 Show words', 'cyan small', function () { shown = list.map(function () { return true; }); paintAll(); sfx('page'); });
      var myst = btn('🎲 Mystery card', 'violet', function () {
        var hid = []; list.forEach(function (o, k) { if (!shown[k]) hid.push(k); });
        if (!hid.length) { hideAll.click(); hid = list.map(function (o, k) { return k; }); }
        mystery = hid[Math.floor(Math.random() * hid.length)];
        cells.forEach(function (x, k) { x.classList.toggle('dim', k !== mystery); x.classList.toggle('spot', k === mystery); });
        info.textContent = '🎲 What is this word? Do the gesture first! Then tap the card.'; sfx('season');
      });
      var all = btn('🔊 Say all', 'small ghost', function () { A.speakSeq(list.map(function (o) { return o.w; })); });
      body.appendChild(h('div', { class: 'row' }, [unitChip(unit), timerBtn(c, 120), hideAll, myst, showAll, all]));
      body.appendChild(grid); body.appendChild(gest); body.appendChild(info); body.appendChild(pointsRow());
      c.done();
    };
  }

  /* ============ 6. MEMORY BOSS BATTLE ============ */
  function sceneBoss(c) {
    var body = c.body, i = 0, revealed = false, order = shuffle(D.boss.map(function (b, k) { return k; }));
    var card = h('div', { class: 'bosscard' }), turn = h('div', { class: 'turn' }), ans = h('div', { class: 'bans' }), info = h('div', { class: 'msg' });
    var tm = timerBtn(c, 20, function () { info.textContent = '⏰ Time! Press Check it.'; });
    function draw() {
      var b = D.boss[order[i]], t = D.teams[i % D.teams.length]; revealed = false;
      card.innerHTML = ''; ans.textContent = ''; ans.style.display = 'none'; tm.resetTimer();
      card.appendChild(h('div', { class: 'row', style: 'justify-content:center' }, [unitChip(b.u), h('span', { class: 'pill amber', text: 'Round ' + (i + 1) + ' of ' + D.boss.length })]));
      card.appendChild(h('div', { class: 'bface' }, [face(b)]));
      card.appendChild(h('div', { class: 'cue', text: b.cue }));
      turn.textContent = t.e + ' ' + t.n + ', your turn!'; turn.style.setProperty('--c', t.c);
      info.textContent = '🧠 Say the whole sentence from memory. Team can whisper for 10 seconds.'; sfx('page');
    }
    var rev = btn('👀 Check it', 'amber', function () { if (revealed) return; revealed = true; var b = D.boss[order[i]]; ans.textContent = '✔ ' + b.ans; ans.style.display = 'block'; tm.resetTimer(); sfx('correct'); A.speak(b.ans); info.textContent = '⭐ Correct? Give the team a point. Wrong words? Say it together.'; });
    var nxt = btn('Next round ▶', 'green', function () {
      if (i >= D.boss.length - 1) { sfx('win'); confetti(); info.textContent = '🏆 Boss defeated! Press Next step for the ceremony.'; c.done(); return; }
      i++; draw();
    });
    body.appendChild(turn); body.appendChild(card); body.appendChild(ans); body.appendChild(info);
    body.appendChild(h('div', { class: 'row' }, [tm, rev, nxt])); body.appendChild(pointsRow());
    draw();
  }

  /* ============ 7. CEREMONY ============ */
  function sceneWrap(c) {
    var body = c.body, ticks = 0;
    var list = h('div', { class: 'goalcols' });
    [1, 2].forEach(function (u) {
      var col = h('div', { class: 'goalcol u' + u }, [h('div', { class: 'gh', text: u === 1 ? '📖 Unit 1' : '🌲 Unit 2' })]);
      D.goals.filter(function (g) { return g.u === u; }).forEach(function (g) {
        var b = h('button', { type: 'button', class: 'goal tick', text: '⬜ ' + g.t });
        b.addEventListener('click', function () { if (b.classList.contains('on')) return; b.classList.add('on'); b.textContent = '✅ ' + g.t; ticks++; sfx('coin'); if (ticks === D.goals.length) { sfx('win'); confetti(); } });
        col.appendChild(b);
      });
      list.appendChild(col);
    });
    body.appendChild(h('div', { class: 'prompt', text: 'Tap a goal when most of the class can do it!' }));
    body.appendChild(list);
    var out = h('div');
    body.appendChild(h('div', { class: 'row', style: 'justify-content:center' }, [btn('🏆 See the scores', 'green big', function () { out.innerHTML = ''; podium(out); out.appendChild(h('div', { class: 'door', text: '🚪 Door pass: say ONE sentence from memory before you leave! Next lesson: the worksheet and the Class Store.' })); sfx('win'); confetti(); }), btn('🎉 Celebrate!', 'amber', function () { sfx('win'); confetti(); })]));
    body.appendChild(out);
  }

  /* ---------- lesson ---------- */
  var MODES = { think: '🤔 Think', listen: '👂 Listen', act: '🎭 Act it out', move: '🚶 Move', talk: '🗣️ Talk', race: '🏆 Team race', memory: '🧠 Memory' };
  var SCENES = [
    { t: 'Today’s Memory Mission', mins: '2 min', mode: 'think', run: sceneMission, intro: 'Two units, one mission: remember the sentences and the words!',
      kids: { steps: ['👀 Read the goals', '🗣️ Whisper to your partner: which goal is easy for you?'], say: ['I can …'] },
      tip: ['Read the six goals aloud. Pupils whisper which one is easy and which one is hard: this tells you where to spend time.', 'Explain the three-step memory trick: Say it, Hide it, Say it from memory. They will use it all lesson.', 'Keep this to 2 minutes. Pupils must be on their feet and speaking by minute 3.'] },
    { t: 'Unit 1: Vanishing Sentences', mins: '5 min', mode: 'memory', run: sceneVanish(D.sent1, 1), intro: 'Say the sentence together. Words vanish. Say it again!',
      kids: { steps: ['🗣️ Say it together', '🫥 Words vanish: say it again', '🧠 All hidden: say it from memory', '🙌 Do the gesture'], say: ['Alice chased …', 'Who? Where? Why?'] },
      tip: ['Press Say it, then pupils echo it with the gesture. Press Hide more: some words become lines. Pupils say the full sentence again. Repeat until all words are hidden.', 'At level 4 the board is empty: pairs say the sentence to each other from memory. Then press Check it.', 'About one minute per sentence. If time is short, skip the last sentence.', 'Why it works: saying the sentence while the words disappear forces the brain to retrieve it, and retrieval is what builds memory.'] },
    { t: 'Unit 1: Word Gym', mins: '4 min', mode: 'memory', run: sceneGym(D.gym1, 1), intro: 'Eight words: picture, gesture, say it. Then hide the words!',
      kids: { steps: ['👀 Tap a card: say the word', '🙌 Do the gesture', '🙈 Words hidden: say them all from the pictures'], say: ['freeze · journey · visualize · predator'] },
      tip: ['First minute: tap each card, pupils say the word and do the gesture. Then press Hide all words.', 'Press Mystery card: one card glows. Pupils do the gesture first, then say the word. Tap to check and give a team point.', 'Gestures help memory: the body remembers what the mouth forgets.'] },
    { t: 'Unit 2: Vanishing Sentences', mins: '5 min', mode: 'memory', run: sceneVanish(D.sent2, 2), intro: 'Forests and the swallow: say it, hide it, say it again!',
      kids: { steps: ['🗣️ Say it together', '🫥 Words vanish: say it again', '🧠 All hidden: say it from memory', '🙌 Do the gesture'], say: ['… so it can …', '… so they can …'] },
      tip: ['Same routine as Unit 1. The first three sentences all use so it can / so they can: pupils should hear the pattern.', 'Use the point arrow gesture every time they say so it can.', 'Last sentence has two past verbs: fell and gave. Let pupils say them first from memory.'] },
    { t: 'Unit 2: Word Gym', mins: '4 min', mode: 'memory', run: sceneGym(D.gym2, 2), intro: 'Ten words and six past verbs: picture, gesture, say it!',
      kids: { steps: ['👀 Tap a card: say the word', '🙌 Do the gesture', '🙈 Words hidden: say them all from the pictures'], say: ['built · fell · gave · grew · hit · paid'] },
      tip: ['The bottom six cards are the past verbs. Say them fast with all the gestures, then press Hide all words.', 'Press Mystery card a few times. Remind pupils: hit does not change.', 'Give points for correct verbs, not for speed alone.'] },
    { t: 'Memory Boss Battle', mins: '4 min', mode: 'race', run: sceneBoss, intro: 'Teams take turns. Say the whole sentence from memory!',
      kids: { steps: ['👀 Look at the picture and the first words', '🤫 Team whispers for 10 seconds', '🧠 Say the whole sentence'], say: [] },
      tip: ['Rounds alternate Unit 1 and Unit 2 and rotate between the four teams. The team whose turn it is says the sentence; press Check it and give a point if it is right.', 'If a team is wrong, say it together and move on with no punishment.', 'Eight rounds fit in 4 minutes if you keep the pace quick.', 'This is also your quick assessment: write down any sentence that nobody could say, and revisit it in the worksheet lesson.'] },
    { t: 'Goals and Scores', mins: '1 min', mode: 'think', run: sceneWrap, intro: 'Which goals can we do now?',
      kids: { steps: ['👍 Tap a goal when most of the class can do it', '🚪 Door pass: one sentence from memory'], say: [] },
      tip: ['Pupils show thumbs up for each goal. Tap the goals that most of the class can do.', 'Goals left unticked go into your plan: they are revision for the worksheet lesson.', 'Door pass: each pupil says one sentence from memory as they leave.'] }
  ];

  /* ---------- shell ---------- */
  function ctxFor(main) {
    return { body: main, done: function () { state.done[state.idx] = true; drawSteps(); }, later: function (fn) { state.cleanups.push(fn); } };
  }
  function drawSteps() {
    var box = $('steps'); box.innerHTML = '';
    SCENES.forEach(function (s, k) {
      var isDone = state.done[k];
      box.appendChild(h('button', { type: 'button', class: 'dot' + (k === state.idx ? ' on' : '') + (isDone ? ' done' : ''), text: isDone ? '✓' : String(k + 1), title: s.t, onclick: function () { go(k); } }));
    });
    $('back').disabled = state.idx === 0; $('next').disabled = state.idx === SCENES.length - 1;
  }
  function kidsPanel(k) {
    if (!k) return null;
    var steps = h('ol', { class: 'ysteps' }, k.steps.map(function (s) { return h('li', { text: s }); }));
    var say = h('div', { class: 'ysay' }, (k.say || []).map(function (s) { return h('button', { type: 'button', class: 'frame', text: s, onclick: function () { A.speak(s.replace(/…/g, '')); } }); }));
    return h('div', { class: 'youdo' }, [h('div', { class: 'ylab', text: 'YOU DO' }), steps, (k.say && k.say.length) ? h('div', { class: 'ylab say', text: 'SAY' }) : null, (k.say && k.say.length) ? say : null]);
  }
  function go(idx) {
    if (state.idx >= 0 && idx > state.idx) state.done[state.idx] = true;
    state.cleanups.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } }); state.cleanups = [];
    A.stop();
    state.idx = idx;
    var s = SCENES[idx], stage = $('stage');
    stage.className = ''; stage.innerHTML = ''; $('tip').hidden = true;
    stage.appendChild(h('div', { class: 's-head' }, [h('h2', { text: s.t }), h('span', { class: 'pill mode', text: MODES[s.mode] }), h('span', { class: 'pill', text: '⏱ ' + s.mins }), h('div', { class: 'grow' }), h('span', { class: 'pill amber', text: 'Step ' + (idx + 1) + ' of ' + SCENES.length })]));
    stage.appendChild(h('div', { class: 's-intro', text: s.intro }));
    var main = h('div', { class: 's-body' }); stage.appendChild(main);
    var kp = kidsPanel(s.kids); if (kp) stage.appendChild(kp);
    drawSteps(); sfx('page');
    try { s.run(ctxFor(main)); } catch (e) { main.appendChild(h('div', { class: 'msg soft', text: 'Oops, this activity could not start.' })); if (window.console) console.error(e); }
    try { history.replaceState(null, '', '?scene=' + (idx + 1)); } catch (e) { /* ignore */ }
  }
  function tipHtml() {
    var s = SCENES[state.idx], t = $('tip'); t.innerHTML = '';
    t.appendChild(h('h4', { text: '🎓 ' + s.t + '  •  ' + s.mins }));
    s.tip.forEach(function (x, k) { t.appendChild(h('p', { text: (k + 1) + '. ' + x })); });
  }

  $('back').addEventListener('click', function () { if (state.idx > 0) go(state.idx - 1); });
  $('next').addEventListener('click', function () { if (state.idx < SCENES.length - 1) go(state.idx + 1); });
  $('tipbtn').addEventListener('click', function () { var t = $('tip'); if (t.hidden) { tipHtml(); t.hidden = false; } else t.hidden = true; });
  $('snd').addEventListener('click', function () { A.setOn(!A.isOn()); $('snd').textContent = A.isOn() ? '🔊' : '🔇'; });
  $('fs').addEventListener('click', function () { try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } catch (e) { /* ignore */ } });
  document.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') $('next').click(); else if (e.key === 'ArrowLeft') $('back').click(); });

  var q = {}; (location.search || '').replace(/^\?/, '').split('&').forEach(function (p) { var kv = p.split('='); if (kv[0]) q[kv[0]] = decodeURIComponent(kv[1] || ''); });
  var s0 = Math.max(0, Math.min(SCENES.length - 1, (parseInt(q.scene, 10) || 1) - 1));
  window.RevLesson = { state: state, go: go, SCENES: SCENES };
  drawTeams(); state.idx = -1; go(s0);
})();
