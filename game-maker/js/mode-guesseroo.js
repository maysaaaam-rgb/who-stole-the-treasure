/* Game Maker: GUESS-EROO, a speaking game. The game hides one secret card. Teams take turns asking a yes/no question out loud
   ("Is it big?"). The teacher taps Yes or No. Cross out the cards that cannot be it. When a team knows, it taps its guess.
   The fewer questions, the more points. A wrong guess is only a short rest for that team (nothing is taken away). */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {}; GM.modes = GM.modes || {};
  var U = function () { return GM.u; }, A = function () { return GM.audio; }, J = function () { return GM.juice; }, E = function () { return GM.engine; };
  var DECKS = {
    animals: { name: 'Animals', cards: [['🐶', 'dog'], ['🐱', 'cat'], ['🐭', 'mouse'], ['🐰', 'rabbit'], ['🦊', 'fox'], ['🐻', 'bear'], ['🐼', 'panda'], ['🦁', 'lion'], ['🐯', 'tiger'], ['🐸', 'frog'], ['🐵', 'monkey'], ['🐘', 'elephant']],
      frames: ['Is it big?', 'Has it got four legs?', 'Can it swim?', 'Is it brown?'] },
    school: { name: 'School things', cards: [['✏️', 'pencil'], ['📚', 'books'], ['🎒', 'school bag'], ['✂️', 'scissors'], ['📏', 'ruler'], ['🖍️', 'crayon'], ['🖊️', 'pen'], ['📒', 'notebook'], ['🌍', 'globe'], ['🔔', 'bell'], ['📎', 'paper clip'], ['🧮', 'abacus']],
      frames: ['Is it long?', 'Do we write with it?', 'Is it made of paper?', 'Is it red?'] },
    clothes: { name: 'Clothes', cards: [['👕', 'T-shirt'], ['👖', 'jeans'], ['🧢', 'cap'], ['🧦', 'socks'], ['👗', 'dress'], ['🧥', 'coat'], ['👟', 'shoes'], ['🧤', 'gloves'], ['🧣', 'scarf'], ['👒', 'hat'], ['🩳', 'shorts'], ['👓', 'glasses']],
      frames: ['Do we wear it on our feet?', 'Do we wear it in winter?', 'Is it blue?', 'Has it got sleeves?'] }
  };

  GM.modes.guesseroo = {
    id: 'guesseroo', name: 'Guess-eroo', e: '🕵️',
    desc: 'A secret card is hidden. Ask yes/no questions out loud and cross out cards until your team knows what it is!',
    fields: [
      { key: 'deck', label: 'Cards', opts: [['animals', 'Animals'], ['school', 'School things'], ['clothes', 'Clothes']], def: 'animals' },
      { key: 'rounds', label: 'Secret cards to find', opts: [[1, '1'], [2, '2'], [3, '3']], def: 2 }
    ],
    start: function (ctx) {
      var st = GM.state, T = st.teams, nt = T.length, deck = DECKS[ctx.cfg.deck] || DECKS.animals, rounds = +ctx.cfg.rounds || 2;
      var eng = E().createSession(ctx, { maxRounds: 9999 });
      var round = 0, secret = 0, asked = 0, frozen = {}, guessing = false, locked = false, order = [];
      ctx.root.innerHTML = '';
      var info = U().h('div', { class: 'gm-info' }), frames = U().h('div', { class: 'gm-ge-frames' }), grid = U().h('div', { class: 'gm-ge-grid' }), bar = U().h('div', { class: 'gm-ge-bar' });
      ctx.root.appendChild(U().h('div', { class: 'gm-boardwrap gm-ge' }, [info, frames, grid, bar]));

      var cards = deck.cards.map(function (c) {
        var el = U().h('button', { type: 'button', class: 'gm-ge-card' }, [U().h('span', { class: 'gm-ge-e', text: c[0] }), U().h('b', { text: c[1] }), U().h('i', { class: 'gm-ge-x', text: '✖' })]);
        var card = { e: c[0], w: c[1], el: el, out: false };
        el.addEventListener('click', function () { tap(card); });
        grid.appendChild(el); return card;
      });
      deck.frames.forEach(function (f) { var b = U().h('button', { type: 'button', class: 'gm-ge-frame', text: f }); b.addEventListener('click', function () { A().play('tap'); A().speak(f); }); frames.appendChild(b); });

      var yes = U().btn('✅  Yes', 'big green', function () { answer(true); }), no = U().btn('❌  No', 'big coral', function () { answer(false); });
      var know = U().btn('🎯  We know it!', 'big amber', function () { startGuess(); });
      var peek = U().h('button', { type: 'button', class: 'gm-btn big ghost gm-ge-peek', text: '👀 Hold to peek (teacher)' }), peekBox = U().h('div', { class: 'gm-ge-peekbox' });
      function peekOn(e) { if (e) e.preventDefault(); peekBox.textContent = cards[secret].e + ' ' + cards[secret].w; peekBox.classList.add('on'); }
      function peekOff() { peekBox.classList.remove('on'); }
      peek.addEventListener('pointerdown', peekOn); ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { peek.addEventListener(ev, peekOff); });
      [yes, no, know, peek].forEach(function (b) { bar.appendChild(b); }); bar.appendChild(peekBox);

      function newRound() {
        secret = Math.floor(Math.random() * cards.length); asked = 0; frozen = {}; guessing = false; locked = false;
        cards.forEach(function (c) { c.out = false; c.el.classList.remove('out', 'secret', 'wrong'); });
        round++; showTurn();
      }
      function setBar(on) { [yes, no, know, peek].forEach(function (b) { b.disabled = !on; b.style.opacity = on ? '' : '.5'; }); }
      function showTurn() {
        var t = eng.activeTeam(), turn = eng.state.turn;
        info.innerHTML = ''; info.style.setProperty('--c', t.color); info.appendChild(U().monFace(t.mon, 46));
        if (frozen[turn]) {
          info.appendChild(U().h('b', { text: t.name + ' rests this turn. 😴' })); setBar(false); delete frozen[turn];
          eng.wait(1400).then(function (ok) { if (ok) { eng.nextTurn(); showTurn(); } }); return;
        }
        info.appendChild(U().h('b', { text: t.name + ': ask a yes/no question out loud!' }));
        info.appendChild(U().h('small', { class: 'gm-ge-count', text: 'Secret card ' + round + ' of ' + rounds + ' · questions: ' + asked }));
        setBar(true); guessing = false; locked = false; grid.classList.remove('guessing'); know.textContent = '🎯  We know it!';
      }
      async function answer(isYes) {
        if (locked || guessing) return; locked = true; setBar(false); asked++;
        info.innerHTML = ''; info.appendChild(U().h('b', { class: 'gm-ge-ans ' + (isYes ? 'y' : 'n'), text: isYes ? '✅ Yes!' : '❌ No!' }));
        A().play(isYes ? 'coin_collect' : 'soft'); A().speak(isYes ? 'Yes!' : 'No!');
        if (!(await eng.wait(1100))) return;
        eng.nextTurn(); showTurn();
      }
      function startGuess() {
        if (locked) return;
        if (guessing) { guessing = false; grid.classList.remove('guessing'); know.textContent = '🎯  We know it!'; return; }
        guessing = true; grid.classList.add('guessing'); know.textContent = '↩ Not yet'; A().play('tap');
        info.innerHTML = ''; info.appendChild(U().h('b', { text: eng.activeTeam().name + ': tap your guess!' }));
      }
      function tap(card) {
        if (locked) return;
        if (!guessing) { card.out = !card.out; card.el.classList.toggle('out', card.out); A().play('tap'); return; }
        guessIt(card);
      }
      async function guessIt(card) {
        locked = true; setBar(false); var turn = eng.state.turn, t = eng.activeTeam();
        if (card === cards[secret]) {
          var pts = Math.max(10, 40 - 5 * asked);
          cards[secret].el.classList.add('secret'); A().play('fanfare'); U().confetti(46); J().shake(8);
          info.innerHTML = ''; info.appendChild(U().h('b', { text: '🎉 Yes! It is the ' + card.w + '! ' + t.name + ' wins +' + pts }));
          eng.award(turn, pts, card.el, '+' + pts); A().speak('It is the ' + card.w + '!');
          if (!(await eng.wait(2800))) return;
          if (round >= rounds) { eng.finish(); return; }
          eng.nextTurn(); newRound();
        } else {
          card.out = true; card.el.classList.add('out', 'wrong'); A().play('soft'); U().wobble(card.el);
          frozen[turn] = true; guessing = false; grid.classList.remove('guessing'); know.textContent = '🎯  We know it!';
          info.innerHTML = ''; info.appendChild(U().h('b', { text: 'Not the ' + card.w + '! Good try. 💪' }));
          if (!(await eng.wait(1500))) return;
          eng.nextTurn(); showTurn();
        }
      }
      newRound();
    }
  };
})(window);
