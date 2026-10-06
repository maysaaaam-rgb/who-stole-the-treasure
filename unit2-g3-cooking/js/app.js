/* Grade 3 Week 2: Chuseok Cooking and Treats. Two 35-minute teacher-led smartboard lessons.
   Lesson 1: treats, kitchen actions, two videos, Mix and Make. Lesson 2: Kitchen Freeze, Recipe Race, Junior Chef Show, home cooking mission.
   Four teams earn points. Nothing is stored. */
(function () {
  'use strict';
  var D = window.CookData, A = window.ForestAudio;
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
  function recipe(id) { return D.recipes.filter(function (r) { return r.id === id; })[0]; }
  function shelfItem(id) { return D.shelf.filter(function (s) { return s.id === id; })[0]; }
  function verbOf(v) { return D.verbs.filter(function (x) { return x.v === v; })[0] || { e: '👩‍🍳', v: v }; }

  var state = { lesson: 1, idx: 0, scores: D.teams.map(function () { return 0; }), done: {}, cleanups: [] };

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
    var host = $('stage'), em = ['⭐', '🎉', '🍡', '🍯', '🍓', '🍙', '🌕'], k, w = h('div', { class: 'confetti' });
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
      b.classList.add('run'); sfx('tap');
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
  /* YouTube player (privacy mode). If the school blocks YouTube, the teacher can still open it in a new tab. */
  function video(v, opts) {
    opts = opts || {};
    var src = 'https://www.youtube-nocookie.com/embed/' + v.id + '?rel=0&modestbranding=1&playsinline=1' + (opts.mute ? '&mute=1' : '');
    return h('div', { class: 'vbox' }, [
      h('div', { class: 'vframe' }, [h('iframe', { src: src, title: v.title, allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen', allowfullscreen: 'true', loading: 'lazy', referrerpolicy: 'strict-origin-when-cross-origin' })]),
      h('div', { class: 'vmeta' }, [h('b', { text: '▶ ' + v.title }), h('span', { text: ' · ' + v.by + ' · ' + v.len + (opts.mute ? ' · press the speaker to keep it muted' : '') }), h('a', { href: 'https://www.youtube.com/watch?v=' + v.id, target: '_blank', rel: 'noopener', class: 'btn small ghost', text: 'Not playing? Open on YouTube ↗' })])
    ]);
  }
  function missionsGrid(list) {
    return h('div', { class: 'missions' }, list.map(function (m, k) { return h('div', { class: 'mission' }, [h('div', { class: 'num', text: String(k + 1) }), h('div', { class: 'em', text: m.e }), h('div', { text: m.t })]); }));
  }

  /* ============================== LESSON 1 ============================== */
  function l1Mystery(c) {
    var body = c.body, i = -1;
    var stage = h('div', { class: 'kitchen' }, [h('div', { class: 'chef' }, [art('min_ji')]), h('div', { class: 'bubble-chef', text: 'Hi! I am Chef Min-ji. I have four Chuseok treats in my box. Can you guess?' })]);
    var box = h('div', { class: 'mbox', text: '🎁' }), clues = h('div', { class: 'tgrid4' }), mis = missionsGrid(D.missions1); mis.style.display = 'none';
    stage.appendChild(box);
    D.mystery.forEach(function (m, k) {
      var card = h('div', { class: 'tcard' }, [h('div', { class: 'te', text: '❓' }), h('div', { class: 'tc', text: 'Treat ' + (k + 1) })]);
      card._m = m; clues.appendChild(card);
    });
    var nxt = btn('🔍 First clue', 'amber big', function () {
      if (i >= 0 && i < D.mystery.length) { var prev = clues.children[i]; prev.classList.add('open'); prev.querySelector('.te').textContent = prev._m.e; prev.querySelector('.tc').textContent = prev._m.n; sfx('correct'); A.speak(prev._m.n); }
      i++;
      if (i < D.mystery.length) { var cur = clues.children[i]; cur.classList.add('now'); cur.querySelector('.tc').textContent = cur._m.clue; A.speak(cur._m.clue); sfx('page'); nxt.textContent = '👀 Reveal'; box.classList.add('shake'); setTimeout(function () { box.classList.remove('shake'); }, 600); }
      else { nxt.style.display = 'none'; mis.style.display = 'grid'; sfx('win'); confetti(); }
    });
    body.appendChild(stage); body.appendChild(clues); body.appendChild(h('div', { class: 'row' }, [nxt])); body.appendChild(mis);
  }

  function l1Song(c) {
    var body = c.body, cards = h('div', { class: 'tgrid4' }), act = h('div', { class: 'gesture', style: 'display:none' });
    D.songWords.forEach(function (w) {
      cards.appendChild(h('button', { type: 'button', class: 'tcard btnish', onclick: function () { sfx('tap'); A.speak(w.n); act.style.display = 'block'; act.textContent = w.e + ' ' + w.n + ' = ' + w.m + '   •   ' + w.act; } }, [h('div', { class: 'te', text: w.e }), h('div', { class: 'tc', html: '<b>' + w.n + '</b><br><small>' + w.m + '</small>' })]));
    });
    body.appendChild(h('div', { class: 'split' }, [video(D.videos.song), h('div', { class: 'col' }, [h('div', { class: 'prompt', text: 'Watch 1: listen. Watch 2: stand up and do the action for each treat!' }), cards, act])]));
    body.appendChild(h('div', { class: 'row' }, [btn('🔊 Say all four', 'small amber', function () { A.speakSeq(D.songWords.map(function (w) { return w.n; })); }), btn('😋 It is sweet!', 'small cyan', function () { A.speak('It is sweet!'); }), btn('😬 It is crispy!', 'small cyan', function () { A.speak('It is crispy!'); })]));
  }

  function l1ChefSays(c) {
    var body = c.body, big = h('div', { class: 'bigverb', text: '👩‍🍳' }), msg = h('div', { class: 'msg', text: 'Tap a card to learn the action. Then play Chef Says!' }), last = null;
    var grid = h('div', { class: 'vgrid' }, D.verbs.map(function (x) { return h('button', { type: 'button', class: 'vcard', onclick: function () { big.textContent = x.e + ' ' + x.v; msg.className = 'msg'; msg.textContent = '🙌 ' + x.act; A.speak(x.v); sfx('tap'); } }, [h('span', { text: x.e }), h('b', { text: x.v })]); }));
    var play = btn('👩‍🍳 Chef says…', 'amber big', function () {
      var pool = D.verbs.filter(function (x) { return x !== last; }), x = pool[Math.floor(Math.random() * pool.length)], trick = Math.random() < 0.3; last = x;
      big.textContent = x.e + ' ' + x.v; big.classList.remove('pop'); void big.offsetWidth; big.classList.add('pop');
      if (trick) { msg.className = 'msg soft'; msg.textContent = '🤫 "' + x.v.charAt(0).toUpperCase() + x.v.slice(1) + '!" (no Chef says!) Did you move? Sit down!'; A.speak(x.v.charAt(0).toUpperCase() + x.v.slice(1) + '!'); }
      else { msg.className = 'msg'; msg.textContent = '✅ Chef says: ' + x.v + '! Do the action!'; A.speak('Chef says: ' + x.v + '!'); }
      sfx('page');
    });
    body.appendChild(h('div', { class: 'row' }, [play, timerBtn(c, 180)])); body.appendChild(big); body.appendChild(msg); body.appendChild(grid); body.appendChild(pointsRow());
  }

  function l1HowTo(c) {
    var body = c.body, i = -1, chips = h('div', { class: 'steps-strip' });
    D.songpyeonSteps.forEach(function (s, k) { chips.appendChild(h('button', { type: 'button', class: 'schip', onclick: function () { light(k); } }, [h('span', { class: 'n', text: String(k + 1) }), h('span', { text: verbOf(s.v).e + ' ' + s.v })])); });
    var line = h('div', { class: 'big-say', text: '🎬 Watch with the sound off. Tap each step when you see it!' });
    function light(k) { i = k; [].forEach.call(chips.children, function (ch, n) { ch.classList.toggle('on', n === k); ch.classList.toggle('done', n < k); }); line.textContent = D.songpyeonSteps[k].s; A.speak(D.songpyeonSteps[k].s); sfx('correct'); }
    body.appendChild(h('div', { class: 'split' }, [video(D.videos.cook, { mute: true }), h('div', { class: 'col' }, [h('div', { class: 'prompt', text: 'How do we make songpyeon?' }), chips, line, h('div', { class: 'chef small' }, [art('songpyeon')])])]));
    body.appendChild(h('div', { class: 'row' }, [btn('Next step ▶', 'green', function () { light(Math.min(D.songpyeonSteps.length - 1, i + 1)); }), btn('🔊 Say all steps', 'small amber', function () { A.speakSeq(D.songpyeonSteps.map(function (s) { return s.s; })); }), btn('↺ Start again', 'small ghost', function () { i = -1; [].forEach.call(chips.children, function (ch) { ch.classList.remove('on', 'done'); }); line.textContent = '🎬 Watch again and do the actions!'; })]));
  }

  function l1Mix(c) {
    var body = c.body, cur = null, got = {}, step = 0, turn = 0, yuck = false;
    var pick = h('div', { class: 'row' }), shelf = h('div', { class: 'shelf' }), bowl = h('div', { class: 'bowl' }, [h('div', { class: 'bin' }), h('div', { class: 'bface', text: '🥣' })]);
    var card = h('div', { class: 'rcard' }), actions = h('div', { class: 'row acts' }), msg = h('div', { class: 'msg' }), team = h('div', { class: 'turn' });
    function paintTurn() { var t = D.teams[turn % D.teams.length]; team.textContent = t.e + ' ' + t.n + ': ask the chef! "Add the ___, please!"'; team.style.setProperty('--c', t.c); }
    function start(r) {
      cur = r; got = {}; step = 0; yuck = false; bowl.querySelector('.bin').innerHTML = ''; bowl.querySelector('.bface').textContent = '🥣'; bowl.classList.remove('yuck', 'done');
      card.innerHTML = ''; card.appendChild(h('div', { class: 'rt', text: r.e + ' ' + r.n })); card.appendChild(h('div', { class: 'rneed', text: 'Ingredients: ' + r.need.length + ' things. Which ones?' }));
      actions.innerHTML = ''; msg.className = 'msg'; msg.textContent = '🥣 Teams take turns. Say "Add the ___, please!" and I tap it.'; paintTurn(); drawShelf(); sfx('season');
    }
    function drawShelf() {
      shelf.innerHTML = '';
      shuffle(D.shelf).forEach(function (s) {
        shelf.appendChild(h('button', { type: 'button', class: 'ing' + (got[s.id] ? ' used' : ''), onclick: function () { add(s); } }, [h('span', { text: s.e }), h('small', { text: s.n })]));
      });
    }
    function add(s) {
      if (!cur || got[s.id]) return;
      var t = turn % D.teams.length;
      if (cur.need.indexOf(s.id) >= 0) {
        got[s.id] = true; bowl.querySelector('.bin').appendChild(h('span', { class: 'dropin', text: s.e })); sfx('coin'); addPoint(t, 1);
        msg.className = 'msg'; msg.textContent = '✅ Yes! Add the ' + s.n + '!'; A.speak('Add the ' + s.n + '!');
      } else {
        yuck = true; bowl.classList.add('yuck'); bowl.querySelector('.bface').textContent = '🤢'; sfx('soft');
        msg.className = 'msg soft'; msg.textContent = '🤢 Yuck! ' + s.n.charAt(0).toUpperCase() + s.n.slice(1) + ' is not in ' + cur.n.split(' (')[0] + '! Take it out!';
        setTimeout(function () { bowl.classList.remove('yuck'); bowl.querySelector('.bface').textContent = '🥣'; }, 1300);
      }
      turn++; paintTurn(); drawShelf();
      if (cur.need.every(function (id) { return got[id]; })) { showActions(); }
    }
    function showActions() {
      actions.innerHTML = ''; msg.className = 'msg'; msg.textContent = '👩‍🍳 All in! Now cook it: tap the actions in the right order. Everybody does the action!';
      shuffle(cur.steps).forEach(function (v) {
        var b = h('button', { type: 'button', class: 'btn verb', text: verbOf(v).e + ' ' + v, onclick: function () {
          if (cur.steps[step] === v) { b.disabled = true; b.classList.add('ok'); A.speak(cur.say[step]); msg.textContent = cur.say[step]; step++; sfx('correct');
            if (step >= cur.steps.length) { bowl.classList.add('done'); bowl.querySelector('.bface').textContent = cur.e; bowl.querySelector('.bin').innerHTML = ''; sfx('win'); confetti(); msg.textContent = '🎉 ' + cur.n.split(' (')[0] + ' is ready! It is yummy! Everybody say: Yummy!'; }
          } else { sfx('soft'); b.classList.add('wrong'); setTimeout(function () { b.classList.remove('wrong'); }, 400); msg.className = 'msg soft'; msg.textContent = 'Not yet! What do we do first? Think: First, … Then, …'; }
        } });
        actions.appendChild(b);
      });
    }
    D.recipes.forEach(function (r) { pick.appendChild(btn(r.e + ' ' + r.n, 'cyan', function () { start(r); })); });
    body.appendChild(pick);
    body.appendChild(h('div', { class: 'mixwrap' }, [h('div', { class: 'col' }, [team, card, bowl]), h('div', { class: 'col grow' }, [shelf, actions, msg])]));
    body.appendChild(pointsRow());
    start(D.recipes[0]);
  }

  function wrap(c, lesson) {
    var body = c.body; body.innerHTML = '';
    podium(body);
    body.appendChild(h('div', { class: 'door', text: lesson === 1 ? '🚪 Door pass: say ONE cooking step: "First, I mix…"' : '🚪 Door pass: "I will make ___ with my family!"' }));
    var rowb = h('div', { class: 'row', style: 'justify-content:center' });
    if (lesson === 1) rowb.appendChild(btn('Lesson 2: Junior Chef Show ▶', 'green big', function () { go(2, 0); }));
    rowb.appendChild(btn('🎉 Celebrate!', 'amber', function () { sfx('win'); confetti(); }));
    body.appendChild(rowb); sfx('win'); confetti();
  }
  function l1Wrap(c) {
    c.body.appendChild(h('div', { class: 'report' }, [h('div', { class: 'rank' }, [art('min_ji')]), h('div', { class: 'score', text: 'Great cooking, chefs!' }), btn('🏆 See the scores', 'green big', function () { wrap(c, 1); })]));
  }

  /* ============================== LESSON 2 ============================== */
  function l2Freeze(c) {
    var body = c.body, big = h('div', { class: 'bigverb', text: '🧊' }), msg = h('div', { class: 'msg', text: 'I say a kitchen action. Do it! When I say FREEZE, stop like a statue!' });
    var go1 = btn('▶ Action!', 'amber big', function () { var x = D.verbs[Math.floor(Math.random() * D.verbs.length)]; big.textContent = x.e + ' ' + x.v + '!'; big.classList.remove('pop'); void big.offsetWidth; big.classList.add('pop'); msg.textContent = '🙌 ' + x.act; A.speak(x.v + '!'); sfx('page'); });
    var fr = btn('🧊 FREEZE!', 'cyan big', function () { big.textContent = '🧊 FREEZE!'; msg.textContent = 'Who is moving? Sit down!'; A.speak('Freeze!'); sfx('season'); });
    body.appendChild(missionsGrid(D.missions2)); body.appendChild(h('div', { class: 'row' }, [go1, fr, timerBtn(c, 240)])); body.appendChild(big); body.appendChild(msg); body.appendChild(pointsRow());
  }

  function l2Race(c) {
    var body = c.body, ri = 0, order = [], cards = h('div', { class: 'racecards' }), msg = h('div', { class: 'msg' }), title = h('div', { class: 'rt' });
    function draw() {
      var R = D.race[ri], r = recipe(R.r); order = []; cards.innerHTML = ''; title.textContent = r.e + ' ' + r.n + ': put the steps in order!';
      shuffle(R.cards.map(function (t, k) { return { t: t, k: k }; })).forEach(function (o) {
        var b = h('button', { type: 'button', class: 'rc' }, [h('span', { class: 'no', text: '?' }), h('span', { text: o.t })]);
        b.addEventListener('click', function () { if (b.classList.contains('picked')) return; order.push(o.k); b.classList.add('picked'); b.querySelector('.no').textContent = String(order.length); sfx('tap'); A.speak(o.t); if (order.length === R.cards.length) check(); });
        cards.appendChild(b);
      });
      msg.className = 'msg'; msg.textContent = '✍️ Teams: write the order on your mini whiteboard (for example 3-1-2-4). Then one team tells me and I tap.';
    }
    function check() {
      var ok = order.every(function (k, n) { return k === n; });
      if (ok) { sfx('win'); confetti(); msg.className = 'msg'; msg.textContent = '🏆 Correct! First, … Then, … Finally! Give the team a point.'; A.speakSeq(D.race[ri].cards.map(function (t, n) { return (n === 0 ? 'First, ' : (n === D.race[ri].cards.length - 1 ? 'Finally, ' : 'Then, ')) + t.charAt(0).toLowerCase() + t.slice(1); })); }
      else { sfx('soft'); msg.className = 'msg soft'; msg.textContent = 'Not quite! Press "Show the answer" or try again.'; }
    }
    function answer() {
      var R = D.race[ri]; cards.innerHTML = '';
      R.cards.forEach(function (t, k) { cards.appendChild(h('div', { class: 'rc picked ok' }, [h('span', { class: 'no', text: String(k + 1) }), h('span', { text: (k === 0 ? 'First, ' : (k === R.cards.length - 1 ? 'Finally, ' : 'Then, ')) + t.charAt(0).toLowerCase() + t.slice(1) })])); });
      sfx('correct');
    }
    body.appendChild(title); body.appendChild(cards); body.appendChild(msg);
    body.appendChild(h('div', { class: 'row' }, [btn('↺ Try again', 'small ghost', draw), btn('👀 Show the answer', 'amber', answer), btn('Next recipe ▶', 'green', function () { ri = (ri + 1) % D.race.length; draw(); sfx('page'); }), timerBtn(c, 60)]));
    body.appendChild(pointsRow());
    draw();
  }

  function l2Show(c) {
    var body = c.body;
    var frames = h('div', { class: 'frames' }, D.showFrames.map(function (f) { return h('div', { class: 'frame-line', text: f }); }));
    var recs = h('div', { class: 'tgrid3' }, D.recipes.map(function (r) { return h('div', { class: 'tcard' }, [h('div', { class: 'te', text: r.e }), h('div', { class: 'tc', html: '<b>' + r.n + '</b><br><small>' + r.steps.map(function (v) { return verbOf(v).e + ' ' + v; }).join(' → ') + '</small>' })]); }));
    var model = btn('🔊 Model it', 'small amber', function () { A.speakSeq(['Hello! I am Chef Min-ji. Today I make fruit punch.', 'First, I cut the fruit.', 'Then, I pour the juice.', 'Finally, I mix.', 'It is sweet! Do you like it?']); });
    var action = btn('🎬 Lights, camera, ACTION!', 'cyan', function () { sfx('season'); A.speak('Lights, camera, action!'); });
    body.appendChild(h('div', { class: 'split' }, [h('div', { class: 'col' }, [h('div', { class: 'prompt', text: '📺 Pairs: one CHEF, one HELPER. Mime the cooking and say the steps!' }), frames, h('div', { class: 'row' }, [model, timerBtn(c, 180), action])]), h('div', { class: 'col' }, [h('div', { class: 'chef' }, [art('min_ji')]), recs])]));
    body.appendChild(h('div', { class: 'row' }, [btn('👏 Applause!', 'green', function () { sfx('win'); confetti(); })]));
    body.appendChild(pointsRow());
  }

  function l2Home(c) {
    var body = c.body, votes = D.homeRecipes.map(function () { return 0; });
    var grid = h('div', { class: 'tgrid3' });
    function draw() {
      grid.innerHTML = '';
      D.homeRecipes.forEach(function (r, k) {
        grid.appendChild(h('div', { class: 'hcard' }, [
          h('div', { class: 'te', text: r.e }), h('b', { text: r.n }), h('small', { class: 'lvl', text: r.level }),
          h('ol', {}, r.steps.map(function (s) { return h('li', { text: s }); })),
          h('button', { type: 'button', class: 'btn small amber', text: '✋ I want this one (' + votes[k] + ')', onclick: function () { votes[k]++; sfx('coin'); draw(); } })
        ]));
      });
    }
    draw();
    var send = h('div', { class: 'sendbox' }, [
      h('b', { text: '📸 What to send (parents send it to the teacher on K12):' }),
      h('div', { class: 'sendgrid' }, [
        h('div', { text: '1️⃣ A photo of the ingredients' }), h('div', { text: '2️⃣ A photo of you cooking' }), h('div', { text: '3️⃣ A photo of the finished treat' }), h('div', { text: '🎥 A short video: First… Then… Finally…' })
      ]),
      h('div', { class: 'safe', text: '⚠️ Safety: an adult helps with knives and the stove. Wash your hands first!' })
    ]);
    body.appendChild(h('div', { class: 'prompt', text: '🏠 Home Cooking Mission: cook a Chuseok treat with your family!' }));
    body.appendChild(grid); body.appendChild(send);
    body.appendChild(h('div', { class: 'row' }, [h('a', { class: 'btn amber', href: 'cards.html', target: '_blank', style: 'text-decoration:none', text: '🖨️ Print recipe cards + parent letter' }), h('a', { class: 'btn ghost small', href: 'show.html', target: '_blank', style: 'text-decoration:none', text: '📺 Presentation page (for later)' })]));
  }
  function l2Wrap(c) {
    c.body.appendChild(h('div', { class: 'report' }, [h('div', { class: 'rank' }, [art('min_ji')]), h('div', { class: 'score', text: 'See you at the Cooking Show!' }), btn('🏆 See the scores', 'green big', function () { wrap(c, 2); })]));
  }

  /* ---------- lessons ---------- */
  var MODES = { think: '🤔 Think', listen: '👂 Listen and watch', act: '🎭 Act it out', move: '🚶 Move', talk: '🗣️ Talk', race: '🏆 Team game', home: '🏠 Home mission' };
  var LESSONS = {
    1: { title: 'Chuseok Treats Kitchen', scenes: [
      { t: 'The Mystery Treat Box', mins: '3 min', mode: 'think', run: l1Mystery, intro: 'Chef Min-ji has four Chuseok treats. Listen to the clue and guess!',
        kids: { steps: ['👂 Listen to the clue', '🤔 Guess with your partner'], say: ['Is it sweet?', 'I think it is …'] },
        tip: ['Press First clue. The clue is read aloud. Pupils whisper a guess, then press Reveal.', 'Teach the key words with the clues: sweet, crispy, soft, drink, cookie.', 'Show the four missions at the end: that is the plan for today.'] },
      { t: 'The Chuseok Snack Song', mins: '5 min', mode: 'listen', run: l1Song, intro: 'Watch the song. The second time, stand up and act!',
        kids: { steps: ['👀 Watch 1: listen', '🧍 Watch 2: do the action for each treat', '🗣️ Say the treat names'], say: ['It is sweet!', 'It is crispy!'] },
        tip: ['Play the video once (2:42). Then tap the four treat cards and teach one action for each.', 'Play it again (or only the chorus) while pupils do the actions.', 'If YouTube is blocked in school, use "Open on YouTube" on your own device, or just tap the cards: the words are the important part.'] },
      { t: 'Chef Says: Kitchen Actions', mins: '6 min', mode: 'act', run: l1ChefSays, intro: 'Learn eight kitchen actions. Then play Chef Says!',
        kids: { steps: ['👀 Learn the action', '🙌 Do it when the chef says', '🤫 No "Chef says"? Do not move!'], say: ['mix · pour · roll · press · steam'] },
        tip: ['Tap each card: pupils say the verb and do the action. Then press Chef says. About one in three is a trick with no "Chef says": pupils who move sit down for one turn.', 'Give team points to rows that are still in the game.', 'Cut is only mimed and only with an adult: say it clearly.'] },
      { t: 'How to Make Songpyeon', mins: '5 min', mode: 'listen', run: l1HowTo, intro: 'Watch a real cook make songpyeon. Sound off: we say the steps!',
        kids: { steps: ['👀 Watch the hands', '🙌 Do each step', '🗣️ Say: First, … Then, … Finally, …'], say: ['First, mix…', 'Then, roll…', 'Finally, steam…'] },
        tip: ['The video (2:22) is muted on purpose: the narration is too hard for A1. Press Next step as you see each step on screen. The sentence is read aloud and pupils do the action.', 'Repeat the five steps once without the video, with actions only.', 'Point out the half-moon shape: the same moon from last week’s legend.'] },
      { t: 'Mix and Make', mins: '12 min', mode: 'race', run: l1Mix, intro: 'Teams ask the chef for ingredients. Silly ones make a YUCK pot!',
        kids: { steps: ['🗣️ Ask: "Add the ___, please!"', '🥣 Right ingredient = a point', '👩‍🍳 Then do the cooking actions in order'], say: ['Add the honey, please!', 'First, … Then, … Finally, …'] },
        tip: ['Pick a recipe. The team whose turn it is asks in English: "Add the honey, please!" Only tap when they ask in a full sentence.', 'A silly item (sock, fish, worm, chili) makes the bowl say Yuck. Children love it: keep it light, no points lost.', 'When all ingredients are in, the class decides the order of the actions and does each one. Three recipes fit in 12 minutes.'] },
      { t: 'Yummy! Scores', mins: '4 min', mode: 'think', run: l1Wrap, intro: 'Great cooking, chefs!',
        kids: { steps: ['🏆 Cheer for every team', '🚪 Door pass: say one cooking step'], say: ['First, I mix…'] },
        tip: ['Show the scores and cheer. Door pass: each pupil says one step with First, Then or Finally.', 'Tell them: next lesson they will be TV chefs!'] }
    ] },
    2: { title: 'Junior Chef Show', scenes: [
      { t: 'Kitchen Freeze', mins: '4 min', mode: 'move', run: l2Freeze, intro: 'Do the kitchen action. When I say FREEZE, stop!',
        kids: { steps: ['🙌 Do the action', '🧊 FREEZE when I say'], say: ['mix · pour · roll · fill · press · steam · add · cut'] },
        tip: ['Quick revision of the eight verbs with movement. Press Action! for a random verb, Freeze! to stop.', 'Show the four missions for today.'] },
      { t: 'Recipe Race', mins: '8 min', mode: 'race', run: l2Race, intro: 'The steps are mixed up. Put them in order!',
        kids: { steps: ['👀 Read the steps', '✍️ Team writes the order', '🗣️ Say it: First, … Then, … Finally, …'], say: ['First, …', 'Then, …', 'Finally, …'] },
        tip: ['Teams write the order on mini whiteboards (for example 2-1-3). Then one team tells you and you tap the cards in that order.', 'When the order is right the board reads the recipe with First, Then, Finally. Give points to every correct team.', 'Three recipes: fruit punch, rice balls, songpyeon. These are also the home recipes.'] },
      { t: 'Junior Chef Show', mins: '12 min', mode: 'talk', run: l2Show, intro: 'Pairs: be TV chefs! Mime the cooking and say the steps.',
        kids: { steps: ['🤝 One chef, one helper', '🎭 Mime the cooking', '🗣️ Use the sentence frames', '📺 Show the class'], say: ['Hello! I am Chef ___.', 'First, I ___.', 'Finally, I ___. It is yummy!'] },
        tip: ['Model once with Model it, or with a confident pupil. Pairs practise for 3 minutes, then swap roles.', 'Three or four pairs show the class. Press Lights, camera, action! before each show and Applause after.', 'This is the rehearsal for the home video: the same sentences.'] },
      { t: 'Home Cooking Mission', mins: '8 min', mode: 'home', run: l2Home, intro: 'Cook a Chuseok treat with your family and show us!',
        kids: { steps: ['👀 Look at the three recipes', '✋ Choose one', '📸 Take 3 photos and 1 short video', '📨 Parents send them on K12'], say: ['I will make ___.'] },
        tip: ['Show the three recipes. Pupils vote with their hands (tap the buttons to count). They may choose any of the three at home.', 'Hand out the printed recipe card and the parent letter (Print button). Write the deadline on the letter.', 'Safety: an adult cuts and uses the stove. No pupil uses a knife or the stove alone.', 'Presentations: when photos arrive on K12, open the Presentation page, drag them in, and each pupil presents with First, Then, Finally. The photos stay on your computer.'] },
      { t: 'See You at the Show', mins: '3 min', mode: 'think', run: l2Wrap, intro: 'Well done, chefs!',
        kids: { steps: ['🏆 Cheer for every team', '🚪 Door pass: "I will make ___!"'], say: ['I will make fruit punch!'] },
        tip: ['Show the scores. Door pass: each pupil says which treat they will make at home.'] }
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
    var say = h('div', { class: 'ysay' }, (k.say || []).map(function (s) { return h('button', { type: 'button', class: 'frame', text: s, onclick: function () { A.speak(s.replace(/…|___/g, '')); } }); }));
    return h('div', { class: 'youdo' }, [h('div', { class: 'ylab', text: 'YOU DO' }), steps, (k.say && k.say.length) ? h('div', { class: 'ylab say', text: 'SAY' }) : null, (k.say && k.say.length) ? say : null]);
  }
  function go(lesson, idx) {
    if (state.idx >= 0 && state.lesson === lesson && idx > state.idx) state.done[lesson + ':' + state.idx] = true;
    state.cleanups.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } }); state.cleanups = [];
    A.stop(); state.lesson = lesson; state.idx = idx;
    var L = LESSONS[lesson], s = L.scenes[idx], stage = $('stage');
    stage.className = ''; stage.innerHTML = ''; $('tip').hidden = true;
    stage.appendChild(h('div', { class: 's-head' }, [h('h2', { text: s.t }), h('span', { class: 'pill mode', text: MODES[s.mode] }), h('span', { class: 'pill', text: '⏱ ' + s.mins }), h('div', { class: 'grow' }), h('span', { class: 'pill amber', text: 'Step ' + (idx + 1) + ' of ' + L.scenes.length })]));
    stage.appendChild(h('div', { class: 's-intro', text: s.intro }));
    var main = h('div', { class: 's-body' }); stage.appendChild(main);
    var kp = kidsPanel(s.kids); if (kp) stage.appendChild(kp);
    $('tab1').classList.toggle('on', lesson === 1); $('tab2').classList.toggle('on', lesson === 2);
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
  $('tab1').addEventListener('click', function () { go(1, 0); });
  $('tab2').addEventListener('click', function () { go(2, 0); });
  $('back').addEventListener('click', function () { if (state.idx > 0) go(state.lesson, state.idx - 1); });
  $('next').addEventListener('click', function () { if (state.idx < LESSONS[state.lesson].scenes.length - 1) go(state.lesson, state.idx + 1); });
  $('tipbtn').addEventListener('click', function () { var t = $('tip'); if (t.hidden) { tipHtml(); t.hidden = false; } else t.hidden = true; });
  $('snd').addEventListener('click', function () { A.setOn(!A.isOn()); $('snd').textContent = A.isOn() ? '🔊' : '🔇'; });
  $('fs').addEventListener('click', function () { try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } catch (e) { /* ignore */ } });
  document.addEventListener('keydown', function (e) { if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return; if (e.key === 'ArrowRight') $('next').click(); else if (e.key === 'ArrowLeft') $('back').click(); });
  var q = {}; (location.search || '').replace(/^\?/, '').split('&').forEach(function (p) { var kv = p.split('='); if (kv[0]) q[kv[0]] = decodeURIComponent(kv[1] || ''); });
  var l0 = q.lesson === '2' ? 2 : 1, s0 = Math.max(0, Math.min(LESSONS[l0].scenes.length - 1, (parseInt(q.scene, 10) || 1) - 1));
  window.CookLessons = { state: state, go: go, LESSONS: LESSONS };
  drawTeams(); state.idx = -1; go(l0, s0);
})();
