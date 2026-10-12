/* Unit 3 Board Game: question-to-buy board game for the smartboard, 3 or 4 teams, about 25 minutes.
   Roll two dice, move, answer a word question to BUY the square. Others pay rent. No harsh penalties: a wrong answer just means you do not buy. */
(function (root) {
  'use strict';
  var A = root.BoardAudio, TEAMS = root.BoardData.teams;
  var grade = /grade=4|g=4/.test(location.search) ? 4 : 3, G = root.BoardData[grade];
  var START_COINS = 300, PASS_START = 50, XP = [30, 20, 10, 5];
  var N = 20, CHANCE_AT = [3, 8, 13, 18], CORNER = { 0: 'start', 5: 'rest', 10: 'bonus', 15: 'treat' };
  var S = null;   // game state

  function $(id) { return document.getElementById(id); }
  function h(tag, attrs, kids) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { if (k === 'text') e.textContent = attrs[k]; else if (k === 'html') e.innerHTML = attrs[k]; else e.setAttribute(k, attrs[k]); });
    (kids || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }
  function btn(text, cls, fn) { var b = h('button', { type: 'button', class: 'btn ' + (cls || ''), text: text }); b.addEventListener('click', fn); return b; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function sfx(n) { try { A.play(n); } catch (e) { /* optional */ } }
  function say(t) { try { if (!t) return; if (Array.isArray(t)) A.speakSeq(t); else A.speak(t); } catch (e) { /* optional */ } }
  function num(v) { v = Number(v); return isFinite(v) ? v : 0; }

  /* ---------- the 20 squares ---------- */
  var squares = [];
  (function build() {
    var props = []; G.groups.forEach(function (g) { g.props.forEach(function (p) { props.push({ g: g, p: p }); }); });
    var pi = 0, ci = 0;
    for (var i = 0; i < N; i++) {
      if (CORNER[i]) squares.push({ i: i, type: CORNER[i], d: G.corners[CORNER[i]] });
      else if (CHANCE_AT.indexOf(i) >= 0) squares.push({ i: i, type: 'chance' });
      else { var x = props[pi++]; squares.push({ i: i, type: 'prop', g: x.g, p: x.p, price: x.g.price, rent: Math.round(x.g.price / 5) }); }
    }
  })();
  function cell(i) {
    if (i <= 5) return { r: 1, c: i + 1 };
    if (i <= 9) return { r: i - 4, c: 6 };
    if (i <= 15) return { r: 6, c: 6 - (i - 10) };
    return { r: 6 - (i - 15), c: 1 };
  }

  /* ---------- state helpers ---------- */
  function cur() { return S.teams[S.turn]; }
  function worth(t) { var w = t.coins; squares.forEach(function (q) { if (q.type === 'prop' && S.owner[q.i] === t.i) w += q.price; }); return w; }
  function ownsGroup(t, g) { return g.props.every(function (p) { return squares.some(function (q) { return q.type === 'prop' && q.p === p && S.owner[q.i] === t.i; }); }); }
  function rentOf(q, ownerT) { return q.rent * (ownsGroup(ownerT, q.g) ? 2 : 1); }

  /* ---------- drawing ---------- */
  function artEl(name, emoji) {
    if (name) { var im = h('img', { src: 'art/' + name + '.webp', alt: '' }); im.onerror = function () { im.replaceWith(document.createTextNode(emoji)); }; return im; }
    return document.createTextNode(emoji);
  }
  function tokEl(t) { var s = h('span'); if (t.img) { var im = h('img', { src: 'art/' + t.img + '.webp', alt: t.e }); im.onerror = function () { im.replaceWith(document.createTextNode(t.e)); }; s.appendChild(im); } else s.textContent = t.e; return s; }
  function drawBoard() {
    var b = $('board'); b.innerHTML = '';
    squares.forEach(function (q) {
      var c = cell(q.i), e = h('div', { class: 'sq ' + (q.type === 'prop' ? '' : q.type === 'chance' ? 'chance' : 'corner'), id: 'sq' + q.i });
      e.style.gridRow = c.r; e.style.gridColumn = c.c;
      if (q.type === 'prop') {
        e.appendChild(h('div', { class: 'band' })).style.background = q.g.color;
        var pic = h('div', { class: 'pic' }); pic.appendChild(artEl(q.p.art, q.p.e)); e.appendChild(pic);
        e.appendChild(h('div', { class: 'nm', text: q.p.w })); e.appendChild(h('div', { class: 'pr', text: '🪙 ' + q.price }));
        e.style.setProperty('--g', q.g.color);
        var o = S.owner[q.i];
        if (o != null) { e.style.borderColor = S.teams[o].c; e.classList.add('owned'); e.style.setProperty('--oc', S.teams[o].c); e.appendChild(h('div', { class: 'own' }, [tokEl(S.teams[o])])); }
      } else if (q.type === 'chance') {
        var cp = h('div', { class: 'pic' }); cp.appendChild(artEl('i_chance', '❓')); e.appendChild(cp); e.appendChild(h('div', { class: 'nm', text: 'Chance' }));
      } else {
        var kp = h('div', { class: 'pic' }); kp.appendChild(artEl(q.d.art, q.d.e)); e.appendChild(kp); e.appendChild(h('div', { class: 'nm', text: q.d.n }));
      }
      var toks = h('div', { class: 'toks' });
      S.teams.forEach(function (t) { if (t.pos === q.i) toks.appendChild(tokEl(t)); });
      e.appendChild(toks);
      if (cur().pos === q.i) e.classList.add('cur');
      b.appendChild(e);
    });
    var centre = h('div', { class: 'centre', id: 'centre' }); b.appendChild(centre);
  }
  function drawSide() {
    var s = $('side'); s.innerHTML = '';
    S.teams.forEach(function (t, k) {
      var dots = h('div', { class: 'dots' });
      squares.forEach(function (q) { if (q.type === 'prop' && S.owner[q.i] === t.i) dots.appendChild(h('i')).style.background = q.g.color; });
      var d = h('div', { class: 'tm' + (k === S.turn ? ' on' : '') }, [h('div', { class: 'n' }, [tokEl(t), document.createTextNode(' ' + t.n)]), h('div', { class: 'co' + (t.shown !== undefined && t.shown !== t.coins ? ' bump' : ''), text: '🪙 ' + t.coins }), h('div', { class: 'sm', text: 'Worth ' + worth(t) }), dots]);
      d.style.setProperty('--c', t.c); s.appendChild(d); t.shown = t.coins;
    });
    $('round').textContent = 'Round ' + Math.min(S.round, S.rounds) + ' of ' + S.rounds;
  }
  function refresh() { drawBoard(); drawSide(); }
  function centre(kids) { var c = $('centre'); c.innerHTML = ''; kids.forEach(function (k) { if (k) c.appendChild(k); }); }
  function whoBadge() { var t = cur(), w = h('div', { class: 'who', text: t.e + ' ' + t.n + ' team' }); w.style.setProperty('--c', t.c); return w; }

  /* ---------- turn flow ---------- */
  var PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
  function setDie(el, n) { el.innerHTML = ''; el.dataset.n = n; for (var i = 0; i < 9; i++) el.appendChild(h('i', { class: PIPS[n].indexOf(i) >= 0 ? 'on' : '' })); }
  function die(n) { var d = h('span', { class: 'die' }); setDie(d, n); return d; }
  function showRoll() {
    refresh();
    var t = cur();
    centre([whoBadge(), h('div', { class: 'msg', text: 'Your turn! Roll the dice.' }), h('div', { class: 'dice', id: 'dice' }, [die(5), die(3)]),
      btn('🎲 Roll', 'big', roll)]);
    say(t.n + ' team, roll the dice.');
  }
  function roll() {
    sfx('tap');
    var dice = $('dice'); dice.classList.add('roll'); $('centre').lastChild.disabled = true;
    var a = 1 + Math.floor(Math.random() * 6), b = 1 + Math.floor(Math.random() * 6);
    if (S.force) { a = S.force[0]; b = S.force[1]; S.force = null; }
    var tick = 0, iv = setInterval(function () {
      setDie(dice.children[0], 1 + Math.floor(Math.random() * 6)); setDie(dice.children[1], 1 + Math.floor(Math.random() * 6)); sfx('page');
      if (++tick >= 5) { clearInterval(iv); dice.classList.remove('roll'); setDie(dice.children[0], a); setDie(dice.children[1], b); setTimeout(function () { move(a + b); }, 500); }
    }, S.fast ? 5 : 120);
  }
  function move(steps) {
    var t = cur();
    (function step() {
      if (steps <= 0) { return land(); }
      t.pos = (t.pos + 1) % N; steps--;
      if (t.pos === 0) { t.coins += PASS_START; sfx('coin'); }
      sfx('tap'); refresh();
      centre([whoBadge(), h('div', { class: 'msg', text: 'Moving…' })]);
      setTimeout(step, S.fast ? 5 : 260);
    })();
  }
  function land() {
    var t = cur(), q = squares[t.pos]; refresh();
    if (q.type === 'prop') {
      var o = S.owner[q.i];
      if (o == null) return offer(q);
      if (o === t.i) return visit(q);
      return rent(q, S.teams[o]);
    }
    if (q.type === 'chance') return chance();
    if (q.type === 'start') return info(G.corners.start.e, 'START', 'Welcome back to the start! You got your pass bonus.', G.corners.start.say);
    if (q.type === 'rest') { t.coins += q.d.coins; sfx('coin'); refresh(); return info(q.d.e, q.d.n, '+' + q.d.coins + ' coins for a rest!', q.d.n + '. Plus ' + q.d.coins + ' coins.'); }
    if (q.type === 'treat') { t.coins += q.d.coins; sfx('coin'); refresh(); return info(q.d.e, q.d.n, '+' + q.d.coins + ' coins!', q.d.n + '. Plus ' + q.d.coins + ' coins.'); }
    if (q.type === 'bonus') return bonus();
    endTurn();
  }
  function info(e, title, text, voice, afterBtn) {
    centre([whoBadge(), h('div', { class: 'card', html: '' }, [h('div', { text: e, style: 'font-size:4rem' })]), h('h2', { text: title }), h('div', { class: 'msg', text: text }), afterBtn || btn('Next team ➜', '', endTurn)]);
    if (voice) say(voice);
  }
  function endTurn() {
    sfx('tap');
    S.turn++;
    if (S.turn >= S.teams.length) { S.turn = 0; S.round++; }
    if (S.round > S.rounds) return finish();
    showRoll();
  }

  /* ---------- questions ---------- */
  function ask(qd, onDone, label) {
    var opts = shuffle(qd.o.map(function (o, k) { return { o: o, k: k }; })), done = false, box = h('div', { class: 'opts' });
    var holder = h('div');
    opts.forEach(function (x) {
      var b = h('button', { type: 'button', class: 'btn opt' }, [h('span', { class: 'lt', text: 'ABC'.charAt(opts.indexOf(x)) }), h('span', { text: x.o })]); b.dataset.o = x.o;
      b.addEventListener('click', function () {
        if (done) return;
        if (x.k === qd.a) { done = true; b.classList.add('right'); sfx('correct'); say(qd.say || qd.o[qd.a]); setTimeout(function () { onDone(true); }, S.fast ? 5 : 1700); }
        else { b.classList.add('wobble'); b.disabled = true; sfx('soft'); say('Try again. Think about the word.'); misses++; if (misses >= 2) { done = true; Array.prototype.forEach.call(box.children, function (c) { if (c.dataset.o === qd.o[qd.a]) c.classList.add('right'); }); say(qd.say || qd.o[qd.a]); setTimeout(function () { onDone(false); }, S.fast ? 5 : 2200); } }
      });
      box.appendChild(b);
    });
    var misses = 0;
    try { A.speakSeq([qd.q.replace(/___/g, 'blank')].concat(opts.map(function (x) { return x.o; }))); } catch (e) { /* optional */ }
    return [h('div', { class: 'q', text: qd.q }), btn('🔊 Read it', 'small ghost', function () { say(qd.q.replace(/___/g, 'blank')); }), box, holder, label ? h('div', { class: 'msg', text: label }) : null];
  }

  function offer(q) {
    var t = cur(), can = t.coins >= q.price;
    centre([whoBadge(), h('div', { class: 'card' }, [h('div', { class: 'pic', style: 'font-size:3.5rem' }, [artEl(q.p.art, q.p.e)]), h('h2', { text: q.p.w })]),
      h('div', { class: 'msg', html: 'Answer right to <b>buy</b> it for 🪙 ' + q.price + (can ? '' : ' — not enough coins yet!') }),
      can ? btn('❓ Show the question', 'big violet', function () { askBuy(q); }) : btn('Next team ➜', '', endTurn),
      can ? btn('Pass', 'small ghost', endTurn) : null]);
    say([q.p.w, 'Answer to buy it.']);
  }
  function askBuy(q) {
    var t = cur(), qd = q.p.qs[Math.floor(Math.random() * q.p.qs.length)];
    centre([whoBadge()].concat(ask(qd, function (ok) {
      if (ok) { t.coins -= q.price; S.owner[q.i] = t.i; sfx('win'); refresh(); info('🎉', 'It is yours!', t.n + ' bought "' + q.p.w + '" for ' + q.price + ' coins.', 'It is yours!'); }
      else { refresh(); info('💪', 'Not this time', 'The word is still free. Another team can buy it.', 'Good try!'); }
    })));
  }
  function visit(q) {
    var t = cur(); t.coins += 10; sfx('coin'); refresh();
    centre([whoBadge(), h('div', { class: 'card' }, [h('div', { class: 'pic', style: 'font-size:3.5rem' }, [artEl(q.p.art, q.p.e)]), h('h2', { text: q.p.w })]),
      h('div', { class: 'msg', html: 'Your own word! Say it loud. <b>+10 coins</b>' }), btn('🔊 Say it', 'small ghost', function () { say(q.p.w); }), btn('Next team ➜', '', endTurn)]);
    say(['Your word!', q.p.w]);
  }
  function rent(q, owner) {
    var t = cur(), r = rentOf(q, owner);
    centre([whoBadge(), h('div', { class: 'card' }, [h('div', { class: 'pic', style: 'font-size:3.5rem' }, [artEl(q.p.art, q.p.e)]), h('h2', { text: q.p.w })]),
      h('div', { class: 'msg', html: 'Owned by <b>' + owner.e + ' ' + owner.n + '</b>. Rent: 🪙 ' + r + '. Answer right to pay <b>half</b>!' }),
      btn('❓ Answer for half price', 'big violet', function () {
        var qd = q.p.qs[Math.floor(Math.random() * q.p.qs.length)];
        centre([whoBadge()].concat(ask(qd, function (ok) { payRent(q, owner, ok ? Math.ceil(r / 2) : r, ok); })));
      }),
      btn('Pay full rent', 'small ghost', function () { payRent(q, owner, r, false); })]);
    say([q.p.w, 'This word belongs to the ' + owner.n + '.']);
  }
  function payRent(q, owner, amt, half) {
    var t = cur(), pay = Math.min(t.coins, amt); t.coins -= pay; owner.coins += pay; sfx('coin'); refresh();
    info('🪙', 'Rent: ' + pay + ' coins', t.n + ' pays ' + pay + ' to ' + owner.n + (half ? ' (half price, well done!)' : '') + '.', 'Pay the rent.');
  }
  function bonus() {
    var t = cur(), qd = G.bonusQ[Math.floor(Math.random() * G.bonusQ.length)];
    centre([whoBadge(), h('h2', { text: G.corners.bonus.e + ' ' + G.corners.bonus.n + ' — win 60 coins!' })].concat(ask(qd, function (ok) {
      if (ok) { t.coins += 60; sfx('win'); refresh(); info('🎉', 'Bonus!', '+60 coins for ' + t.n + '!', 'Bonus! Sixty coins.'); }
      else info('💪', 'Good try!', 'No bonus this time.', '');
    })));
  }
  function chance() {
    var t = cur(), c = S.deck[S.deckI++ % S.deck.length];
    if (c.k === 'money') {
      t.coins = Math.max(0, t.coins + c.coins); sfx(c.coins > 0 ? 'coin' : 'soft'); refresh();
      return info('❓', 'Chance!', c.t + '  (' + (c.coins > 0 ? '+' : '') + c.coins + ' coins)', c.say);
    }
    if (c.k === 'quiz') {
      centre([whoBadge(), h('h2', { text: '❓ Chance — win 40 coins!' })].concat(ask(c.q, function (ok) {
        if (ok) { t.coins += 40; sfx('coin'); refresh(); info('🎉', 'Well done!', '+40 coins for ' + t.n + '!', ''); } else info('💪', 'Good try!', 'No coins this time.', '');
      })));
      return;
    }
    /* speak card: the teacher decides */
    centre([whoBadge(), h('h2', { text: '❓ Chance — speak!' }), h('div', { class: 'q', text: c.t }), btn('🔊 Read it', 'small ghost', function () { say(c.say); }),
      btn('✅ Said it well (+40)', 'big', function () { t.coins += 40; sfx('coin'); refresh(); info('🎉', 'Great speaking!', '+40 coins for ' + t.n + '!', ''); }),
      btn('Skip', 'small ghost', endTurn)]);
    say(c.say);
  }

  /* ---------- start and finish ---------- */
  function setup() {
    $('h-title').firstChild.nodeValue = G.title; if (G.theme && G.theme.bg) document.body.style.background = 'linear-gradient(rgba(6,9,17,.82),rgba(6,9,17,.9)), url(art/' + G.theme.bg + '.webp) center / cover fixed, #060911'; $('h-sub').textContent = G.sub;
    var nTeams = 4, rounds = 7, ov = $('overlay'); ov.className = 'overlay on';
    var panel = h('div', { class: 'panel' }), tBox = h('div', { class: 'pick' }), rBox = h('div', { class: 'pick' });
    function draw() {
      tBox.innerHTML = ''; rBox.innerHTML = '';
      [3, 4].forEach(function (n) { tBox.appendChild(btn(n + ' teams', 'big' + (n === nTeams ? ' sel' : ' ghost'), function () { nTeams = n; draw(); })); });
      [5, 7, 9].forEach(function (n) { rBox.appendChild(btn(n + ' rounds' + (n === 7 ? ' (≈25 min)' : ''), (n === rounds ? 'sel' : 'ghost'), function () { rounds = n; draw(); })); });
    }
    panel.appendChild(h('h1', { text: G.title })); panel.appendChild(h('div', { class: 'msg', text: G.sub }));
    panel.appendChild(h('p', { class: 'msg', html: 'Roll the dice, move, and <b>answer right to buy</b> a word. Other teams pay you rent. Most valuable team wins!' }));
    panel.appendChild(h('div', { class: 'q', text: 'How many teams?' })); panel.appendChild(tBox);
    panel.appendChild(h('div', { class: 'q', text: 'How long?' })); panel.appendChild(rBox);
    panel.appendChild(btn('▶ Start game', 'big', function () { ov.className = 'overlay'; sfx('win'); begin(nTeams, rounds); }));
    ov.innerHTML = ''; ov.appendChild(panel); draw();
  }
  function begin(nTeams, rounds) {
    S = { teams: TEAMS.slice(0, nTeams).map(function (t, i) { return { i: i, n: t.n, e: t.e, img: t.img, c: t.c, coins: START_COINS, pos: 0 }; }), owner: {}, turn: 0, round: 1, rounds: rounds, deck: shuffle(G.chance), deckI: 0 };
    root.Board.S = S; showRoll();
  }
  function finish() {
    var ov = $('overlay'); ov.className = 'overlay on'; sfx('win');
    var ranked = S.teams.map(function (t) { return { t: t, w: worth(t) }; }).sort(function (a, b) { return b.w - a.w; });
    var xp = ranked.map(function (r, k) { var j = k; while (j > 0 && ranked[j - 1].w === r.w) j--; return XP[Math.min(j, XP.length - 1)]; });
    var order = [1, 0, 2, 3].filter(function (k) { return k < ranked.length; });
    var pod = h('div', { class: 'podium' });
    order.forEach(function (k) {
      var r = ranked[k], d = h('div', { class: 'pod p' + (k + 1) }, [h('div', { text: ['🥇', '🥈', '🥉', '4️⃣'][k], style: 'font-size:1.6rem' }), h('div', { class: 'em' }, [tokEl(r.t)]), h('div', { class: 'nn', text: r.t.n }),
        h('div', { text: '🪙 ' + num(r.w) + ' worth' }), h('div', { class: 'xp', text: '+' + xp[k] + ' XP' })]);
      d.style.setProperty('--c', r.t.c); pod.appendChild(d);
    });
    ov.innerHTML = ''; ov.appendChild(h('div', { class: 'panel' }, [h('div', { class: 'trophy' }, [artEl('i_trophy', '🏆')]), h('h1', { text: 'Game over!' }), h('div', { class: 'msg', text: 'Worth = coins + the words you own. Teacher: give the XP shown.' }), pod,
      btn('🔁 Play again', 'big', setup)]));
    say(ranked[0].t.n + ' team wins! Well done, everyone!');
    for (var i = 0; i < 24; i++) (function (i) { setTimeout(function () { var c = h('div', { class: 'conf', text: ['🎉', '⭐', '🪙', '✨'][i % 4] }); c.style.left = Math.random() * 100 + 'vw'; document.body.appendChild(c); setTimeout(function () { c.remove(); }, 3200); }, i * 90); })(i);
  }

  root.Board = { S: null, squares: squares, grade: grade, G: G, setup: setup, begin: begin, finish: finish, worth: worth, state: function () { return S; } };
  document.addEventListener('DOMContentLoaded', function () {
    $('snd').addEventListener('click', function () { var on = !A.isOn(); A.setOn(on); $('snd').textContent = on ? '🔊' : '🔇'; });
    $('fs').addEventListener('click', function () { try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } catch (e) { /* optional */ } });
    $('endnow').addEventListener('click', function () { if (S && confirm('Finish the game now and show the podium?')) finish(); });
    document.title = G.title + ' • English Adventure Academy';
    setup();
  });
})(window);
