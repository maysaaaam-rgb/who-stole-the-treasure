/* Game Maker: STAR LOOP BOARD (mode-board3.js, id: 'boardgame').
   24-square Monopoly-style looping perimeter board with hopping class monsters, Star-Collection squares,
   4 Corner Bonus squares, and friendly Chance Cards. Points only go up — zero point deductions! */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {}; GM.modes = GM.modes || {};
  var U = function () { return GM.u; }, A = function () { return GM.audio; }, J = function () { return GM.juice; };
  var N = 24;
  var BANDS = ['#38bdf8', '#f59e0b', '#10b981', '#a855f7'];
  var THEMES = {
    classic: {
      corners: [
        { t: 'START', e: '🏁', art: 'i_start', pts: 25, desc: 'Pass or land on Start for +25 bonus points!' },
        { t: 'Rest Stop', e: '☕', art: 'i_rest', pts: 15, desc: 'Warm cocoa break! +15 points!' },
        { t: 'Super Stage', e: '🎤', art: 'i_bonus', pts: 25, desc: 'Super Stage bonus question for +25 points!' },
        { t: 'Treasure', e: '🧰', art: 'i_treat', pts: 20, desc: 'Open the treasure chest for +20 points!' }
      ],
      words: ['Star Meadow', 'Cloud Bridge', 'Sunny Bell', 'Rainbow Gate', 'Golden Key', 'Magic Book', 'Crystal Pond', 'Rocket Hill', 'Music Box', 'Crown Tower', 'Diamond Cave', 'Candy Lane', 'Feather Nest', 'Moon Harbor', ' Emerald Tree', 'Victory Arch'],
      icons: ['⭐', '🌈', '🔔', '🗝️', '📖', '💎', '🚀', '🎵', '👑', '🔮', '🍭', '🪺', '🌙', '🌳', '🏆', '🎈']
    },
    arctic: {
      corners: [
        { t: 'Base Camp', e: '⛺', art: 'i_start', pts: 25, desc: 'Back at Arctic Camp! +25 bonus points!' },
        { t: 'Cocoa Stop', e: '☕', art: 'i_rest', pts: 15, desc: 'Hot cocoa by the fire! +15 points!' },
        { t: 'Sing Stage', e: '🎤', art: 'i_bonus', pts: 25, desc: 'Sing & Answer on the ice stage for +25 points!' },
        { t: 'Fish Feast', e: '🐟', art: 'i_treat', pts: 20, desc: 'Friendly polar feast! +20 points!' }
      ],
      words: ['Ice Hole', 'Snow Trap', 'Thin Ice', 'Polar Bear', 'Twice Size', 'Melting Sun', 'Ice Crack', 'Deep Swim', 'Safe Camp', 'Work Together', 'Bright Hope', 'Once More', 'Snowy Owl', 'Arctic Fox', 'Northern Star', 'Glacier Peak'],
      icons: ['🕳️', '🪤', '🧊', '🐻‍❄️', '✌️', '💧', '⚡', '🏊', '⛺', '🤝', '🌈', '🔁', '🦉', '🦊', '🌟', '🏔️']
    },
    market: {
      corners: [
        { t: 'Bank Start', e: '🏦', art: 'i_start', pts: 25, desc: 'Pass the Bank for +25 bonus points!' },
        { t: 'Piggy Bank', e: '🐷', art: 'i_rest', pts: 15, desc: 'Saved in your piggy bank! +15 points!' },
        { t: 'Money Quiz', e: '🎯', art: 'i_bonus', pts: 25, desc: 'Big Money Quiz for +25 points!' },
        { t: 'Gold Chest', e: '🧰', art: 'i_treat', pts: 20, desc: 'Treasure reward! +20 points!' }
      ],
      words: ['Barter Swap', 'Farm Goat', 'Golden Grain', 'Sea Shell', 'Shiny Metal', 'Gold Coin', 'Paper Bill', 'Credit Card', 'Plastic Card', 'Coat Pocket', 'Phone Store', 'Kind Cashier', 'Smart Save', 'Good Solution', 'Valuable Gem', 'Market Bell'],
      icons: ['🔄', '🐐', '🌾', '🐚', '🔩', '🪙', '💵', '💳', '🧴', '👖', '🏬', '🧾', '🐷', '💡', '💎', '🔔']
    }
  };

  var CHANCE_CARDS = [
    { e: '🚀', t: 'Rocket Boost!', d: 'Hop 2 extra squares forward and win +15 points!', hop: 2, pts: 15 },
    { e: '🌟', t: 'Shooting Star!', d: 'A bright star lands on your monster! +20 points!', hop: 0, pts: 20 },
    { e: '🎁', t: 'Friendly Gift!', d: 'You get +20 points, and every other team gets +5!', hop: 0, pts: 20, allBonus: 5 },
    { e: '🌈', t: 'Rainbow Bridge!', d: 'Hop 3 squares forward and collect +15 points!', hop: 3, pts: 15 },
    { e: '💎', t: 'Hidden Gem!', d: 'Your monster dug up a sparkling gem! +25 points!', hop: 0, pts: 25 }
  ];

  /* 24-square perimeter coordinates on an 8 columns x 6 rows CSS grid:
     Top row (col 1..8, row 1): indices 0..7
     Right col (col 8, row 2..5): indices 8..11
     Bottom row (col 8..1, row 6): indices 12..19
     Left col (col 1, row 5..2): indices 20..23 */
  function gridPos(i) {
    if (i <= 7) return { c: i + 1, r: 1 };
    if (i <= 11) return { c: 8, r: i - 6 };
    if (i <= 19) return { c: 8 - (i - 12), r: 6 };
    return { c: 1, r: 6 - (i - 19) };
  }

  GM.modes.boardgame = {
    id: 'boardgame',
    name: 'Star Loop Board',
    e: '🎲',
    desc: 'Roll the dice, hop your monster around the 24-square board, collect Stars on squares and open Chance cards!',
    fields: [
      { key: 'laps', label: 'Laps to finish', opts: [[1, '1 lap', 'Quick (10-12m)'], [2, '2 laps', 'Standard'], [3, '3 laps', 'Long']], def: 1 },
      { key: 'world', label: 'Board world', opts: [['classic', '⭐ Classic'], ['arctic', '🐻‍❄️ Arctic Ice'], ['market', '🪙 Golden Market']], def: 'classic' }
    ],
    start: function (ctx) {
      var st = GM.state, T = st.teams, nt = T.length, targetLaps = +ctx.cfg.laps || 1;
      var worldKey = ctx.cfg.world || 'classic', WDATA = THEMES[worldKey] || THEMES.classic;
      var rootEl = ctx.root; rootEl.innerHTML = '';
      var alive = true, busy = false, turn = 0;
      ctx.onEnd(function () { alive = false; });

      var pos = T.map(function () { return 0; });
      var laps = T.map(function () { return 0; });
      var stars = {}; /* sqIndex -> teamIndex */

      /* Build the 24 squares */
      var CORNERS = { 0: 0, 7: 1, 12: 2, 19: 3 };
      var CHANCES = [4, 10, 16, 22];
      var squares = [], wi = 0;
      for (var i = 0; i < N; i++) {
        if (CORNERS[i] != null) {
          var cd = WDATA.corners[CORNERS[i]];
          squares.push({ i: i, type: 'corner', cIdx: CORNERS[i], title: cd.t, e: cd.e, art: cd.art, pts: cd.pts, desc: cd.desc });
        } else if (CHANCES.indexOf(i) >= 0) {
          squares.push({ i: i, type: 'chance', title: 'Chance', e: '❓', art: 'i_chance' });
        } else {
          var band = BANDS[Math.floor(wi / 4) % 4];
          squares.push({
            i: i,
            type: 'star',
            band: band,
            title: WDATA.words[wi % WDATA.words.length],
            e: WDATA.icons[wi % WDATA.icons.length],
            pts: 20
          });
          wi++;
        }
      }

      var info = U().h('div', { class: 'gm-info' });
      var board = U().h('div', { class: 'gm-b3-board gm-b3-' + worldKey });
      var center = U().h('div', { class: 'gm-b3-center' });
      rootEl.appendChild(U().h('div', { class: 'gm-boardwrap' }, [info, board]));

      var sqEls = [], tokBoxes = [];
      squares.forEach(function (sq) {
        var gp = gridPos(sq.i);
        var el = U().h('div', { class: 'gm-b3-sq gm-b3-' + sq.type, id: 'gm-b3-sq-' + sq.i });
        el.style.gridColumn = String(gp.c);
        el.style.gridRow = String(gp.r);
        if (sq.band) {
          var bBar = U().h('div', { class: 'gm-b3-band' });
          bBar.style.background = sq.band;
          el.appendChild(bBar);
        }
        var numBadge = U().h('span', { class: 'gm-b3-num', text: String(sq.i + 1) });
        var ic = U().h('div', { class: 'gm-b3-ic' }, [sq.art ? U().art(sq.art, sq.e, 'gm-b3-art') : U().h('span', { text: sq.e })]);
        var nm = U().h('div', { class: 'gm-b3-nm', text: sq.title });
        var starSlot = U().h('div', { class: 'gm-b3-star' });
        var toks = U().h('div', { class: 'gm-b3-toks' });
        el.appendChild(numBadge);
        el.appendChild(ic);
        el.appendChild(nm);
        el.appendChild(starSlot);
        el.appendChild(toks);
        board.appendChild(el);
        sqEls.push(el);
        tokBoxes.push(toks);
      });
      board.appendChild(center);

      function renderTokens(hopTeamIdx) {
        tokBoxes.forEach(function (tb) { tb.innerHTML = ''; });
        sqEls.forEach(function (el, idx) {
          el.classList.toggle('active-sq', pos[turn] === idx);
          var owner = stars[idx];
          var stEl = el.querySelector('.gm-b3-star');
          if (stEl) {
            if (owner != null && T[owner]) {
              stEl.textContent = '⭐';
              stEl.style.background = T[owner].color;
              stEl.classList.add('owned');
            } else {
              stEl.textContent = '';
              stEl.classList.remove('owned');
            }
          }
        });
        T.forEach(function (t, ti) {
          var p = pos[ti] || 0;
          var tok = U().h('div', { class: 'gm-b3-tok' + (ti === turn ? ' cur' : '') + (ti === hopTeamIdx ? ' hop' : '') }, [U().monFace(t.mon, 42)]);
          tok.style.setProperty('--c', t.color);
          tokBoxes[p].appendChild(tok);
        });
      }

      function showCenterPrompt() {
        if (!alive) return;
        busy = false;
        var t = T[turn], pName = (t.mon && t.mon.name) ? ' (' + t.mon.name + ')' : '';
        U().teamBar(T, turn);
        renderTokens(-1);

        info.innerHTML = '';
        info.style.setProperty('--c', t.color);
        info.appendChild(U().monFace(t.mon, 46));
        info.appendChild(U().h('b', { text: t.name + pName + ': answer right to roll the dice!  (Lap ' + (laps[turn] + 1) + ' of ' + targetLaps + ')' }));
        info.appendChild(U().btn('🎲 Ask & Roll!', 'big amber', handleTurnStart));

        center.innerHTML = '';
        var card = U().h('div', { class: 'gm-b3-stagecard' }, [
          U().h('div', { class: 'gm-b3-who', style: '--c:' + t.color }, [
            U().monFull(t.mon, 108),
            U().h('div', {}, [
              U().h('h3', { text: t.name + pName }),
              U().h('small', { text: 'Square ' + (pos[turn] + 1) + ' of ' + N + ' · Lap ' + (laps[turn] + 1) + '/' + targetLaps })
            ])
          ]),
          U().h('div', { class: 'gm-b3-dicebox', id: 'gm-b3-dicebox' }, [
            U().h('div', { class: 'gm-b3-die', id: 'gm-b3-die', text: '🎲' })
          ]),
          U().btn('🎲 Answer & Roll Dice!', 'huge green', handleTurnStart)
        ]);
        center.appendChild(card);
      }

      async function handleTurnStart() {
        if (busy || !alive) return;
        busy = true;
        var t = T[turn];
        var res = await U().ask(ctx.nextItem(), t, { timer: +ctx.cfg.timer || 0, label: t.name + ' · Roll the Dice' });
        if (!alive) return;
        if (!res.ok) {
          info.innerHTML = '';
          info.appendChild(U().h('b', { text: 'Good try! Next team rolls!' }));
          await U().sleep(1100);
          if (!alive) return;
          turn = (turn + 1) % nt;
          showCenterPrompt();
          return;
        }
        await rollAndMove();
      }

      async function rollAndMove() {
        var dieEl = document.getElementById('gm-b3-die');
        var faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        var rollVal = U().rand(1, 6);
        A().play('flip');
        if (dieEl) {
          dieEl.classList.add('rolling');
          for (var k = 0; k < 7; k++) {
            dieEl.textContent = faces[U().rand(0, 5)];
            await U().sleep(75);
          }
          dieEl.classList.remove('rolling');
          dieEl.textContent = faces[rollVal - 1] + ' ' + rollVal;
        }
        A().play('pu_good');
        info.innerHTML = '';
        info.style.setProperty('--c', T[turn].color);
        info.appendChild(U().monFace(T[turn].mon, 46));
        info.appendChild(U().h('b', { text: '🎲 ' + T[turn].name + ' rolled a ' + rollVal + '! Hopping...' }));
        await U().sleep(380);
        await hopSteps(rollVal);
      }

      async function hopSteps(steps) {
        for (var s = 0; s < steps; s++) {
          if (!alive) return;
          pos[turn] = (pos[turn] + 1) % N;
          A().play('hunt_step');
          renderTokens(turn);
          if (pos[turn] === 0) {
            laps[turn]++;
            A().play('pu_gold');
            U().confetti(20);
            U().floatText('🏁 Lap +25!', sqEls[0], 'good');
            U().addScore(turn, 25);
            if (laps[turn] >= targetLaps) {
              await U().sleep(900);
              if (alive) ctx.end();
              return;
            }
          }
          await U().sleep(230);
        }
        if (!alive) return;
        await resolveLanding(squares[pos[turn]]);
      }

      async function resolveLanding(sq) {
        var t = T[turn], sqEl = sqEls[sq.i];
        if (sq.type === 'corner') {
          A().play('pu_star');
          J().shockwave(sqEl, t.color, 110, 420);
          U().floatText('+' + sq.pts, sqEl, 'good');
          U().addScore(turn, sq.pts);
          await showLandingCard(sq.e, sq.title, sq.desc, '+' + sq.pts + ' points!');
        } else if (sq.type === 'chance') {
          var ch = CHANCE_CARDS[U().rand(0, CHANCE_CARDS.length - 1)];
          A().play('pu_good');
          J().shockwave(sqEl, '#ffe066', 120, 450);
          U().floatText('+' + ch.pts, sqEl, 'good');
          U().addScore(turn, ch.pts);
          if (ch.allBonus) {
            T.forEach(function (ot, idx) { if (idx !== turn) U().addScore(idx, ch.allBonus); });
          }
          await showLandingCard(ch.e, 'Chance: ' + ch.t, ch.d, '+' + ch.pts + ' points!');
          if (!alive) return;
          if (ch.hop) {
            await hopSteps(ch.hop);
            return;
          }
        } else if (sq.type === 'star') {
          var owner = stars[sq.i];
          if (owner == null) {
            /* Claim the Star on this square! */
            stars[sq.i] = turn;
            A().play('pu_star');
            J().shockwave(sqEl, t.color, 120, 440);
            J().sparks(sqEl, 16, [t.color, '#ffe066', '#ffffff'], 7);
            U().floatText('⭐ Star +20!', sqEl, 'good');
            U().addScore(turn, 20);
            renderTokens(-1);
            await showLandingCard('⭐', sq.title + ' — Star Collected!', t.name + ' placed a Star on ' + sq.title + '!', '+20 points!');
          } else if (owner === turn) {
            A().play('pu_good');
            U().floatText('⭐ Own Star +15!', sqEl, 'good');
            U().addScore(turn, 15);
            await showLandingCard('🌟', sq.title + ' — Your Star!', 'Visiting your own Star square gives a +15 boost!', '+15 points!');
          } else {
            /* Friendly visit: active team gets +10, star owner gets +5 friendly bonus (zero points lost!) */
            A().play('pu_good');
            U().floatText('+10', sqEl, 'good');
            U().addScore(turn, 10);
            U().addScore(owner, 5);
            await showLandingCard(sq.e, sq.title, t.name + ' earns +10 points, and ' + T[owner].name + ' gets a +5 Star Owner bonus!', '+10 / +5 points!');
          }
        }
        if (!alive) return;
        turn = (turn + 1) % nt;
        showCenterPrompt();
      }

      function showLandingCard(emoji, title, desc, badgeText) {
        return new Promise(function (resolve) {
          center.innerHTML = '';
          var done = false;
          var tm = setTimeout(function () { if (!done) { done = true; resolve(); } }, 2200);
          var card = U().h('div', { class: 'gm-b3-stagecard gm-b3-event' }, [
            U().h('div', { class: 'gm-b3-ev-ic', text: emoji }),
            U().h('h3', { text: title }),
            U().h('p', { text: desc }),
            U().h('div', { class: 'gm-b3-ev-pts', text: badgeText }),
            U().btn('Continue ▶', 'big green', function () {
              if (done) return;
              done = true;
              clearTimeout(tm);
              resolve();
            })
          ]);
          center.appendChild(card);
        });
      }

      showCenterPrompt();
    }
  };
})(window);
