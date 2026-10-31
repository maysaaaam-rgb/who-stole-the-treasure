/* Game Maker: STORY DICE, a speaking game. The dice show pictures from the question set (or friendly spare pictures).
   The team makes a sentence or a little story with ALL the pictures, and the teacher gives stars. Nobody ever loses points. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {}; GM.modes = GM.modes || {};
  var U = function () { return GM.u; }, A = function () { return GM.audio; }, E = function () { return GM.engine; };
  var SPARE = [['🐶', 'dog'], ['🐱', 'cat'], ['🐟', 'fish'], ['🐸', 'frog'], ['🦋', 'butterfly'], ['🌞', 'sun'], ['🌙', 'moon'], ['⭐', 'star'], ['🌈', 'rainbow'], ['🌳', 'tree'],
    ['🌸', 'flower'], ['🏠', 'house'], ['🚗', 'car'], ['🚲', 'bike'], ['✈️', 'plane'], ['🚀', 'rocket'], ['🎈', 'balloon'], ['🎁', 'present'], ['📚', 'book'], ['⚽', 'ball'], ['👑', 'crown'], ['🔑', 'key'], ['🌍', 'world'], ['🦁', 'lion']];
  var FRAMES = ['I can see a ___ and a ___.', 'There is a ___ in the ___.', 'The ___ is going to the ___.'];

  /* little words that cannot be a picture: they never go on a die */
  var SMALL = 'a an the is are was were be been am do does did has have had can could will would shall should may might must to of in on at by for from with and but or so if as because not no yes very too he she it they we you i me my your his her its our their this that these those there here what who when where why how which some any'.split(' ');
  function isIcon(p) { return !p || p === '🔊' || p === '🧩'; }
  function faceOf(it) {
    var a = String((it && it.a) || '').trim(); if (!a) return null;
    if (!/[A-Za-z0-9]/.test(a)) return { pic: a, word: '' };                  // picture answers (listening questions)
    if (a.split(/\s+/).length > 1 || a.length < 3 || a.length > 14 || SMALL.indexOf(a.toLowerCase()) >= 0 || /[^A-Za-z'-]/.test(a) || /^-|-$/.test(a)) return null;   // one real word only
    return { pic: isIcon(it.pic) ? '' : it.pic, word: a };
  }

  GM.modes.storydice = {
    id: 'storydice', name: 'Story Dice', e: '🎲',
    desc: 'Roll the dice, see the pictures, and make a sentence or a story with all of them. The teacher gives stars!',
    fields: [
      { key: 'dice', label: 'Dice', opts: [[2, '2'], [3, '3'], [4, '4'], [6, '6']], def: 3 },
      { key: 'turns', label: 'Turns for each team', opts: [[1, '1'], [2, '2'], [3, '3'], [4, '4']], def: 2 }
    ],
    start: function (ctx) {
      var st = GM.state, T = st.teams, N = +ctx.cfg.dice || 3, each = +ctx.cfg.turns || 2, busy = false, dice = [];
      var eng = E().createSession(ctx, { maxRounds: each * T.length });
      ctx.root.innerHTML = '';

      /* the faces: short words and pictures from the question set, then spare pictures if there are not enough */
      var pool = [], seen = {}, tries = 0;
      while (tries++ < 90 && pool.length < 24) {
        var it = ctx.nextItem(); if (!it) break;
        var f = faceOf(it); if (!f) continue;
        var k = f.pic + '|' + f.word; if (seen[k]) continue; seen[k] = 1; pool.push(f);
      }
      /* half of the faces are pictures, so the dice look like dice (the spare pictures fill up) */
      var wantPics = Math.max(N * 2, Math.ceil(pool.length / 2));
      U().shuffle(SPARE).forEach(function (s0) { var have = pool.filter(function (f) { return f.pic; }).length; if (have < wantPics && !seen[s0[0] + '|' + s0[1]]) { seen[s0[0] + '|' + s0[1]] = 1; pool.push({ pic: s0[0], word: s0[1] }); } });
      if (pool.length < N * 3) U().shuffle(SPARE).forEach(function (s) { if (pool.length < N * 3 + 6 && !seen[s[0] + '|' + s[1]]) { seen[s[0] + '|' + s[1]] = 1; pool.push({ pic: s[0], word: s[1] }); } });

      var info = U().h('div', { class: 'gm-info' }), table = U().h('div', { class: 'gm-sd-table' }), tray = U().h('div', { class: 'gm-sd-tray' });
      ctx.root.appendChild(U().h('div', { class: 'gm-boardwrap gm-sd' }, [info, table, tray]));
      var size = N <= 3 ? 'big' : N === 4 ? 'mid' : 'small';
      table.classList.add(size);

      function paint(d, face) {
        d.innerHTML = '';
        if (!face) { d.appendChild(U().h('span', { class: 'gm-sd-q', text: '?' })); return; }
        if (face.pic) d.appendChild(U().h('span', { class: 'gm-sd-pic', html: U().pic(face.pic) }));
        if (face.word) d.appendChild(U().h('b', { class: 'gm-sd-word' + (face.pic ? '' : ' only'), text: face.word }));
      }
      var els = [];
      for (var i = 0; i < N; i++) els.push(U().h('div', { class: 'gm-sd-die' }));
      els.forEach(function (d) { table.appendChild(d); });

      function showTurn() {
        var t = eng.activeTeam();
        info.innerHTML = ''; info.style.setProperty('--c', t.color); info.appendChild(U().monFace(t.mon, 46));
        info.appendChild(U().h('b', { text: t.name + ': roll the dice and tell a story!' }));
        els.forEach(function (d) { d.classList.remove('land', 'roll'); paint(d, null); });
        tray.innerHTML = '';
        tray.appendChild(U().btn('🎲  Roll the dice', 'huge amber', roll));
        busy = false;
      }

      async function roll() {
        if (busy) return; busy = true; tray.innerHTML = '';
        dice = U().shuffle(pool).slice(0, N);
        A().play('drum_roll_short');
        for (var k = 0; k < 12; k++) {
          els.forEach(function (d) { paint(d, pool[Math.floor(Math.random() * pool.length)]); d.classList.remove('land'); d.classList.add('roll'); });
          A().play('tick');
          if (!(await eng.wait(70 + k * 14))) return;
        }
        els.forEach(function (d, i) { paint(d, dice[i]); d.classList.remove('roll'); d.classList.add('land'); });
        A().play('round'); U().confetti(10);
        showStory();
      }

      function showStory() {
        var t = eng.activeTeam(), words = dice.map(function (f) { return f.word; }).filter(Boolean);
        info.innerHTML = ''; info.appendChild(U().monFace(t.mon, 46));
        info.appendChild(U().h('b', { text: t.name + ': make a sentence or a story with ALL the pictures!' }));
        tray.innerHTML = '';
        var frames = U().h('div', { class: 'gm-sd-frames' }, FRAMES.map(function (f) {
          var b = U().h('button', { type: 'button', class: 'gm-sd-frame', text: f });
          b.addEventListener('click', function () { A().speak(f.replace(/___/g, 'blank')); });
          return b;
        }));
        tray.appendChild(frames);
        var row = U().h('div', { class: 'gm-sd-row' });
        if (words.length) row.appendChild(U().btn('🔊 Hear the words', 'big amber', function () { A().speak(words.join(', ')); }));
        row.appendChild(U().btn('🎲 Roll again', 'big ghost', function () { busy = false; roll(); }));
        tray.appendChild(row);
        tray.appendChild(U().h('div', { class: 'gm-sd-ask', text: 'How was the story?' }));
        var judge = U().h('div', { class: 'gm-sd-row' });
        [['🙂 Nice try', 5, 'big'], ['😀 Great', 10, 'big green'], ['🤩 Super story!', 15, 'big amber']].forEach(function (j) {
          judge.appendChild(U().btn(j[0] + '  +' + j[1], j[2], function () { award(j[1]); }));
        });
        tray.appendChild(judge);
      }

      async function award(pts) {
        if (busy === 'done') return; busy = 'done';
        tray.innerHTML = '';
        eng.award(eng.state.turn, pts, table, '+' + pts);
        A().play(pts >= 15 ? 'fanfare' : 'coin_collect'); if (pts >= 10) A().play('sparkle'); U().confetti(pts >= 15 ? 44 : 20);
        if (!(await eng.wait(1300))) return;
        if (!eng.advanceRound()) return;
        eng.nextTurn(); showTurn();
      }

      showTurn();
    }
  };
})(window);
