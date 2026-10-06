/* Grade 4 Worksheet + Class Store lesson (35 min). The pupils work on paper (worksheet.html, versions A and B).
   The board runs the timer, the marking, and the Class Store tour. Nothing is stored; the store here is a DEMO. */
(function () {
  'use strict';
  var D = window.WsData, A = window.ForestAudio;
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
  function sfx(n) { A.play(n); }
  function btn(text, cls, fn) { return h('button', { type: 'button', class: 'btn ' + (cls || ''), text: text, onclick: fn }); }
  function fmt(sec) { return Math.floor(sec / 60) + ':' + ('0' + (sec % 60)).slice(-2); }
  var state = { idx: 0, done: {}, cleanups: [] };

  function confetti() {
    var host = $('stage'), em = ['⭐', '🎉', '🌟', '✨', '🪙', '🎁'], k, w = h('div', { class: 'confetti' });
    for (k = 0; k < 26; k++) w.appendChild(h('i', { text: em[k % em.length], style: 'left:' + Math.random() * 96 + '%;animation-delay:' + Math.random() * 0.5 + 's;font-size:' + (2.4 + Math.random() * 2.4) + 'vh' }));
    host.appendChild(w); setTimeout(function () { w.remove(); }, 2400);
  }

  /* ============ 1. MISSION ============ */
  function sceneMission(c) {
    var body = c.body;
    body.appendChild(h('div', { class: 'earn3' }, [
      h('div', { class: 'ecard' }, [h('div', { class: 'ei', text: '⭐' }), h('b', { text: 'XP' }), h('small', { text: 'from lessons, at school and at home' })]),
      h('div', { class: 'ar', text: '➜' }),
      h('div', { class: 'ecard' }, [h('div', { class: 'ei', text: '🪙' }), h('b', { text: 'Coins' }), h('small', { text: '10 XP = 1 coin' })]),
      h('div', { class: 'plus', text: '+' }),
      h('div', { class: 'ecard hot' }, [h('div', { class: 'ei', text: '📝' }), h('b', { text: 'Worksheet' }), h('small', { text: 'up to 10 coins today!' })]),
      h('div', { class: 'ar', text: '➜' }),
      h('div', { class: 'ecard' }, [h('div', { class: 'ei', text: '🛍️' }), h('b', { text: 'Class Store' }), h('small', { text: 'spend them!' })])
    ]));
    body.appendChild(h('div', { class: 'rules' }, [
      h('div', { class: 'rule', html: '<b>1</b> 10 questions = up to <b>10 coins</b>.' }),
      h('div', { class: 'rule', html: '<b>2</b> Part 1 is Unit 1. Part 2 is Unit 2.' }),
      h('div', { class: 'rule', html: '<b>3</b> Work alone. Ask 3 friends… then ask me.' }),
      h('div', { class: 'rule', html: '<b>4</b> Finished? Read your sheet again, then do the Fast Finisher task.' }),
      h('div', { class: 'rule', html: '<b>5</b> Later you can <b>fix your mistakes</b> with a green pen to win more coins.' })
    ]));
    body.appendChild(h('div', { class: 'row' }, [btn('🔊 Read the rules', 'amber', function () { A.speakSeq(['Ten questions equal up to ten coins.', 'Part one is unit one. Part two is unit two.', 'Work alone. Ask three friends, then ask me.']); }), btn('🎉 Let’s go!', 'green', function () { sfx('win'); confetti(); })]));
  }

  /* ============ 2. WORKSHEET TIME ============ */
  function sceneWork(c) {
    var body = c.body, total = 17 * 60, left = total, iv = null, warned = {};
    var clock = h('div', { class: 'bigclock', text: fmt(left) }), msg = h('div', { class: 'msg', text: '📝 Hand out version A and B (alternate desks). Press Start when everyone has a pencil.' });
    var bar = h('div', { class: 'tbar' }, [h('i')]);
    function paint() { clock.textContent = fmt(left); bar.firstChild.style.width = (100 * left / total) + '%'; clock.classList.toggle('low', left <= 60); }
    function tick() {
      left--; paint();
      if (left === 600) { msg.textContent = '⏰ 10 minutes left. Part 1 should be finished!'; sfx('season'); }
      if (left === 300) { msg.textContent = '⏰ 5 minutes left. Check your answers!'; sfx('season'); }
      if (left === 60) { msg.textContent = '⏰ One minute! Finish your last answer.'; sfx('season'); }
      if (left <= 0) { clearInterval(iv); iv = null; msg.textContent = '🛑 Pencils down! Hands on your heads.'; sfx('win'); confetti(); c.done(); start.textContent = '▶ Start'; }
    }
    var start = btn('▶ Start', 'green big', function () {
      if (iv) { clearInterval(iv); iv = null; start.textContent = '▶ Continue'; msg.textContent = '⏸ Paused.'; return; }
      if (left <= 0) left = total;
      iv = setInterval(tick, 1000); start.textContent = '⏸ Pause'; msg.textContent = '✍️ Work quietly. Part 1 first, then Part 2.'; sfx('tap'); paint();
    });
    c.later(function () { if (iv) clearInterval(iv); });
    var help = h('div', { class: 'helpboard', style: 'display:none' }, [
      h('div', { class: 'hh', text: 'Help board: words you know' }),
      h('div', { class: 'hw', text: 'chased · fell · gave · grew · built · hit · paid' }),
      h('div', { class: 'hw', text: 'Who · Where · Why' }),
      h('div', { class: 'hw', text: 'so it can · so they can' }),
      h('div', { class: 'hw', text: 'deciduous · coniferous · hibernate · survive' })
    ]);
    var fast = h('div', { class: 'fast' }, [h('b', { text: '⚡ Fast Finisher: ' }), document.createTextNode('Turn your sheet over. Write 2 sentences with so it can… about an animal. Then quiz a friend: Who? Where? Why?')]);
    body.appendChild(h('div', { class: 'worktop' }, [clock, h('div', { class: 'col' }, [bar, msg])]));
    body.appendChild(h('div', { class: 'row' }, [start, btn('+1 min', 'small ghost', function () { left += 60; total = Math.max(total, left); paint(); sfx('tap'); }), btn('🆘 Help board', 'small cyan', function () { help.style.display = help.style.display === 'none' ? 'block' : 'none'; sfx('page'); }), btn('↺ Reset', 'small ghost', function () { if (iv) { clearInterval(iv); iv = null; } left = total = 17 * 60; start.textContent = '▶ Start'; paint(); })]));
    body.appendChild(help); body.appendChild(fast);
    paint();
  }

  /* ============ 3. MARK IT TOGETHER ============ */
  function sceneMark(c) {
    var body = c.body, ver = 'A', shown = 0, main = h('div'), fixLeft = 45, fixIv = null;
    var tabs = h('div', { class: 'row' }), info = h('div', { class: 'msg' });
    function draw() {
      main.innerHTML = '';
      var list = h('div', { class: 'anslist' });
      D.key[ver].forEach(function (k, i) {
        var open = i < shown;
        list.appendChild(h('div', { class: 'ans u' + k.u + (open ? ' open' : '') }, [h('span', { class: 'qn', text: 'Q' + k.n }), h('span', { class: 'av', text: open ? k.a : '?' }), open ? h('button', { type: 'button', class: 'btn small ghost', text: '🔊', onclick: function () { A.speak(k.say); } }) : null]));
      });
      main.appendChild(list);
    }
    ['A', 'B'].forEach(function (v) { tabs.appendChild(btn('Version ' + v, v === 'A' ? 'cyan' : 'violet', function () { ver = v; shown = 0; draw(); info.textContent = '✅ Version ' + v + ': swap sheets and tick each correct answer.'; sfx('page'); })); });
    var next = btn('Next answer ▶', 'amber big', function () {
      if (shown >= 10) return; var k = D.key[ver][shown]; shown++; draw(); sfx('correct'); A.speak(k.say);
      info.textContent = shown >= 10 ? '🧮 Count your ticks. Write the score at the top: __ / 10. Then press the other version.' : '✔ Tick it if you wrote it. Cross it if not. Do not change your answer!';
      if (shown >= 10) c.done();
    });
    var all = btn('Show all', 'small ghost', function () { shown = 10; draw(); sfx('page'); });
    var fix = h('div', { class: 'fixbox' }, [h('b', { text: '🖍️ Fix-it time (45 s): ' }), document.createTextNode('Use a GREEN pen. Correct every mistake. Coins = correct answers + fixed answers ÷ 2 (round down), max 10.')]);
    var fixTime = btn('⏱ 0:45', 'small violet', function () {
      if (fixIv) { clearInterval(fixIv); fixIv = null; fixLeft = 45; fixTime.textContent = '⏱ 0:45'; return; }
      sfx('tap');
      fixIv = setInterval(function () { fixLeft--; fixTime.textContent = '⏱ ' + fmt(fixLeft); if (fixLeft <= 0) { clearInterval(fixIv); fixIv = null; fixLeft = 45; fixTime.textContent = '⏱ 0:45'; sfx('win'); } }, 1000);
    });
    c.later(function () { if (fixIv) clearInterval(fixIv); });
    body.appendChild(tabs); body.appendChild(main); body.appendChild(info);
    body.appendChild(h('div', { class: 'row' }, [next, all]));
    body.appendChild(h('div', { class: 'row' }, [fix, fixTime]));
    info.textContent = '✅ Version A: swap sheets with your neighbour (they mark yours). Press Next answer.';
    draw();
  }

  /* ============ 4. CLASS STORE TOUR (demo) ============ */
  function sceneStore(c) {
    var body = c.body, coins = D.demoCoins;
    var wallet = h('div', { class: 'wallet' }), msg = h('div', { class: 'msg' }), shelf = h('div', { class: 'shelves' }), boxStage = h('div', { class: 'boxstage', style: 'display:none' });
    function paintWallet() { wallet.innerHTML = ''; wallet.appendChild(h('span', { class: 'wl', text: '🧑 Demo pupil' })); wallet.appendChild(h('span', { class: 'wc', text: '🪙 ' + coins + ' coins' })); }
    function openBox(it) {
      var pr = D.boxPrizes[Math.floor(Math.random() * D.boxPrizes.length)];
      boxStage.style.display = 'flex'; boxStage.innerHTML = '';
      var box = h('div', { class: 'bigbox shake', text: it.e }); boxStage.appendChild(box); sfx('season');
      setTimeout(function () { box.classList.remove('shake'); box.textContent = pr.e; boxStage.appendChild(h('div', { class: 'prize', text: 'You got ' + pr.t })); sfx('win'); confetti(); }, 1300);
    }
    function buy(it) {
      if (coins < it.p) { var need = it.p - coins; msg.className = 'msg soft'; msg.textContent = '🪙 Not enough yet. You need ' + need + ' more coin' + (need === 1 ? '' : 's') + '. Keep earning XP and doing worksheets!'; sfx('soft'); A.speak('You need ' + need + ' more ' + (need === 1 ? 'coin.' : 'coins.')); return; }
      coins -= it.p; paintWallet(); draw(); sfx('coin'); msg.className = 'msg';
      msg.textContent = it.box ? '🎁 Bought! Opening…' : '✅ Bought ' + it.n + '! (Rewards are checked by the teacher first.)';
      if (it.box) openBox(it); else { boxStage.style.display = 'none'; A.speak('Bought ' + it.n + '.'); }
    }
    function draw() {
      shelf.innerHTML = '';
      D.shelves.forEach(function (sh) {
        var row = h('div', { class: 'shelf' }, [h('div', { class: 'sht', text: sh.title })]);
        var items = h('div', { class: 'sitems' });
        sh.items.forEach(function (it) {
          var can = coins >= it.p, pct = Math.min(100, Math.round(100 * coins / it.p));
          items.appendChild(h('button', { type: 'button', class: 'sitem' + (can ? ' can' : ''), onclick: function () { buy(it); } }, [
            h('div', { class: 'se', text: it.e }), h('div', { class: 'sn', text: it.n }), h('div', { class: 'sp', text: '🪙 ' + it.p }), h('div', { class: 'sbar' }, [h('i', { style: 'width:' + pct + '%' })])
          ]));
        });
        row.appendChild(items); shelf.appendChild(row);
      });
    }
    var earn = btn('📝 +8 worksheet coins', 'amber', function () { coins += 8; paintWallet(); draw(); sfx('coin'); msg.className = 'msg'; msg.textContent = '🪙 The worksheet gave 8 coins! Now what can you buy?'; });
    var xp = btn('⭐ +30 XP = +3 coins', 'cyan small', function () { coins += 3; paintWallet(); draw(); sfx('coin'); msg.className = 'msg'; msg.textContent = '⭐ 30 XP became 3 coins.'; });
    var reset = btn('↺ Reset demo', 'small ghost', function () { coins = D.demoCoins; paintWallet(); draw(); boxStage.style.display = 'none'; msg.className = 'msg'; msg.textContent = 'Demo reset: 12 coins.'; });
    body.appendChild(h('div', { class: 'row' }, [wallet, earn, xp, reset]));
    body.appendChild(msg); body.appendChild(boxStage); body.appendChild(shelf);
    msg.textContent = '👀 This is a DEMO. Ask a volunteer: what do you want to buy? Can you? How many more coins do you need?';
    paintWallet(); draw(); c.done();
  }

  /* ============ 5. WISH LIST + DOOR PASS ============ */
  function sceneWish(c) {
    var body = c.body;
    body.appendChild(h('div', { class: 'wish' }, [
      h('div', { class: 'wl1', html: 'I want <u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>.' }),
      h('div', { class: 'wl1', html: 'It costs <u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u> coins.' }),
      h('div', { class: 'wl1', html: 'I have <u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u> coins.' })
    ]));
    body.appendChild(h('div', { class: 'rules' }, [
      h('div', { class: 'rule', html: '<b>📝</b> Write your wish list on the back of your sheet.' }),
      h('div', { class: 'rule', html: '<b>🏠</b> Practise on the platform at home: more XP = more coins.' }),
      h('div', { class: 'rule', html: '<b>🚪</b> Door pass: say <b>I want … It costs … coins.</b> before you leave!' })
    ]));
    body.appendChild(h('div', { class: 'row' }, [btn('🔊 Model it', 'amber', function () { A.speakSeq(['I want a special sticker.', 'It costs thirty five coins.', 'I have twelve coins.']); }), btn('🎉 Well done!', 'green', function () { sfx('win'); confetti(); })]));
    c.done();
  }

  /* ---------- lesson ---------- */
  var MODES = { think: '🤔 Think', talk: '🗣️ Talk', work: '✍️ Write', mark: '✅ Check', store: '🛍️ Store' };
  var SCENES = [
    { t: 'Today’s Mission', mins: '3 min', mode: 'think', run: sceneMission, intro: 'Show what you remember and earn up to 10 coins!',
      kids: { steps: ['👀 Read the rules', '🙋 Ask a question if you do not understand'], say: ['Can I have a pencil?', 'I do not understand.'] },
      tip: ['Hand out the printed worksheet (worksheet.html): version A and B on alternate desks so neighbours cannot copy.', 'Explain the money path: XP becomes coins (10 XP = 1 coin), and today the worksheet can give up to 10 more coins.', 'Say clearly: mistakes are fixed later, so a mistake is not a disaster.', 'Keep this to 3 minutes. Pupils write their name and class first.'] },
    { t: 'Worksheet Time', mins: '17 min', mode: 'work', run: sceneWork, intro: 'Quiet work. Ten questions. Part 1 Unit 1, Part 2 Unit 2.',
      kids: { steps: ['✍️ Do Part 1, then Part 2', '🤫 Ask 3 friends, then ask me', '⚡ Finished? Do the Fast Finisher'], say: [] },
      tip: ['Press Start. The board chimes at 10, 5 and 1 minute. Walk around and note who is stuck on which question.', 'Do not give answers. Point to the Help board (verbs, question words, so it can, tree words) if pupils need help.', 'Fast finishers turn the sheet over and write two so it can sentences, then quiz a friend. This is extra speaking practice.', 'Seventeen minutes is enough for 10 short A1+ questions. If the class finishes early, press Reset only if you want a second timer; otherwise move on.'] },
    { t: 'Mark It Together', mins: '4 min', mode: 'mark', run: sceneMark, intro: 'Swap sheets. Tick the right answers. Then fix your own mistakes.',
      kids: { steps: ['🔄 Swap sheets with your neighbour', '✔ Tick the right answers', '🔢 Write the score: __ / 10', '🖍️ Fix-it with a green pen'], say: [] },
      tip: ['Choose Version A first, then Version B. Press Next answer: the answer shows and is read aloud in a full sentence (this is also revision).', 'Pupils write the score at the top of the sheet. Then 45 seconds of fix-it with a green pen. Coins = correct + fixed ÷ 2, rounded down, maximum 10.', 'Collect the sheets. Later, enter the coins in the platform: Classroom Store, Worksheet coins. Use the score on the sheet.', 'Spot-check three sheets for honest marking.'] },
    { t: 'Class Store Tour', mins: '9 min', mode: 'store', run: sceneStore, intro: 'A demo pupil has 12 coins. What can they buy? Who needs to save up?',
      kids: { steps: ['👀 Look at the shelves', '🗣️ Say what you want', '🤔 Can the demo pupil buy it?'], say: ['I want …', 'It costs … coins.', 'I need … more coins.'] },
      tip: ['This is a DEMO with the standard prices: nothing here changes any real pupil. The real prices are in the platform under Classroom Store (they may be different).', 'Ask volunteers to choose: Can they buy it? How many more coins? Press +8 worksheet coins to show that saving works, then buy the Bronze Box and watch it open.', 'Main message: coins come from XP at school AND at home, so homework makes the store bigger. Rewards need your approval; boxes open at once.', 'Pupils then write their own wish list in the next step.'] },
    { t: 'Wish List and Door Pass', mins: '2 min', mode: 'talk', run: sceneWish, intro: 'Write what you want. Say it at the door!',
      kids: { steps: ['📝 Write your wish list', '🚪 Say it at the door'], say: ['I want … It costs … coins. I have … coins.'] },
      tip: ['Pupils fill the sentence frames on the back of the worksheet.', 'Door pass: each pupil says I want … It costs … coins. Their score and coins are entered in the platform afterwards.'] }
  ];

  /* ---------- shell ---------- */
  function ctxFor(main) { return { body: main, done: function () { state.done[state.idx] = true; drawSteps(); }, later: function (fn) { state.cleanups.push(fn); } }; }
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
    A.stop(); state.idx = idx;
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
  window.WsLesson = { state: state, go: go, SCENES: SCENES };
  state.idx = -1; go(s0);
})();
