/* ============================================================================
 * Game Maker — Mode: Memory (mode-memory.js)
 * Grid of face-down cards made from the question set: each pair is a Question
 * card and its matching Answer card.
 * Match = read the full sentence aloud (+20 pts) and go again!
 * Mismatch = cards flip back after 1.2s, team gets +5 for trying, next team's turn.
 * ============================================================================ */
(function () {
  'use strict';

  var GM = window.GM;
  var U = function () { return GM.u; };
  var A = function () { return GM.audio; };
  var J = function () { return GM.juice; };

  function makeFullSentence(q, a) {
    var qs = String(q || '');
    var as = String(a || '');
    if (qs.indexOf('___') !== -1) {
      return qs.replace(/_{2,}/g, as);
    }
    return qs + ' — ' + as;
  }

  GM.modes.memory = {
    id: 'memory',
    name: 'Memory Match',
    e: '🃏',
    desc: 'Flip two cards to match a question with its answer, then read the full sentence aloud!',
    fields: [
      { k: 'pairs', l: 'Card pairs', opts: [[6, '6 pairs (12 cards)'], [8, '8 pairs (16 cards)'], [10, '10 pairs (20 cards)']], def: 6 }
    ],

    start: function (ctx) {
      var T = GM.state.teams;
      var numPairs = +ctx.cfg.pairs || 6;
      var totalCards = numPairs * 2;
      var cols = totalCards <= 12 ? 4 : 5;
      var rows = Math.ceil(totalCards / cols);

      var turn = 0;
      var matchedPairs = 0;
      var flipped = [];
      var busy = false;
      var ended = false;

      // Build pairs from ctx.nextItem()
      var deck = [];
      for (var p = 0; p < numPairs; p++) {
        var it = ctx.nextItem();
        var fullSent = makeFullSentence(it.q, it.a);
        deck.push({ pairId: p, kind: 'q', text: String(it.q || ''), full: fullSent, matched: false, faceUp: false, el: null });
        deck.push({ pairId: p, kind: 'a', text: String(it.a || ''), rawAns: String(it.a || ''), full: fullSent, matched: false, faceUp: false, el: null });
      }
      deck = U().shuffle(deck);

      var wrap = U().h('div', { class: 'gm-mem-wrap', style: 'position:relative;' });
      var info = U().h('div', { class: 'gm-info' });
      var grid = U().h('div', {
        class: 'gm-mem-grid',
        style: 'grid-template-columns:repeat(' + cols + ', 1fr);grid-template-rows:repeat(' + rows + ', 1fr);'
      });

      wrap.appendChild(info);
      wrap.appendChild(grid);
      ctx.root.appendChild(wrap);

      function renderCard(card, idx) {
        var inner = U().h('div', { class: 'gm-mem-inner' });
        inner.appendChild(U().h('span', { class: 'gm-mem-num' }, [String(idx + 1)]));

        if (card.faceUp || card.matched) {
          var txtEl = U().h('div', { class: 'gm-mem-text' });
          if (card.kind === 'a') {
            txtEl.appendChild(U().art('o_star_coin', '⭐', 'gm-mem-star-ic'));
          }
          txtEl.appendChild(U().h('span', {}, [card.text]));
          inner.appendChild(txtEl);
        } else {
          inner.appendChild(U().art('o_card_back', '🃏', 'gm-mem-art'));
        }

        var cls = 'gm-mem-card ' + (card.matched ? 'matched' : (card.faceUp ? 'face-up' : 'face-down'));
        if (card.kind === 'a') cls += ' is-ans';
        card.el.className = cls; card.el.setAttribute('data-pair', String(card.pairId));
        card.el.innerHTML = '';
        card.el.appendChild(inner);
      }

      deck.forEach(function (card, idx) {
        var btn = U().h('button', {
          class: 'gm-mem-card face-down',
          type: 'button',
          onclick: function () { onTapCard(idx); }
        });
        card.el = btn;
        renderCard(card, idx);
        grid.appendChild(btn);
      });

      function renderHud() {
        var t = T[turn];
        info.innerHTML = '';
        info.appendChild(U().h('div', { class: 'gm-turn-pill', style: '--tc:' + t.color }, [
          U().monFace(t.mon, 40),
          U().h('span', {}, [t.name + ' — Flip 2 cards to find a Question + Answer pair!'])
        ]));
        info.appendChild(U().h('div', { class: 'gm-Meta' }, ['Pairs: ' + matchedPairs + ' / ' + numPairs]));
        U().teamBar(T, turn);
      }

      function showReadAloudModal(sentenceText, onDone) {
        if (A()) A().speak(sentenceText);
        var modal = U().h('div', { class: 'gm-mem-aloud' });
        var box = U().h('div', { class: 'gm-mem-aloud-box' }, [
          U().h('div', { style: 'font-size:24px;font-weight:900;color:#4ade80;' }, ['🎉 MATCH! Read the full sentence aloud:']),
          U().h('div', { class: 'gm-mem-aloud-sentence' }, [sentenceText]),
          U().h('div', { style: 'display:flex;gap:12px;flex-wrap:wrap;justify-content:center;' }, [
            U().btn('🔊 Listen', 'gm-btn', function () {
              if (A()) A().speak(sentenceText);
            }),
            U().btn('🗣️ We Read It Aloud! (+20)', 'gm-btn gm-btn-go', function () {
              if (modal.parentNode) modal.parentNode.removeChild(modal);
              onDone();
            })
          ])
        ]);
        modal.appendChild(box);
        wrap.appendChild(modal);
      }

      async function onTapCard(idx) {
        if (busy || ended) return;
        var card = deck[idx];
        if (!card || card.faceUp || card.matched) return;

        card.faceUp = true;
        renderCard(card, idx);
        if (J() && J().squash && card.el) J().squash(card.el, 1.14, 0.88, 220);
        if (A()) {
          A().play('card_turn');
          A().play('page_slide');
        }
        flipped.push({ card: card, idx: idx });

        if (flipped.length < 2) return;

        busy = true;
        var c1 = flipped[0].card, i1 = flipped[0].idx;
        var c2 = flipped[1].card, i2 = flipped[1].idx;
        flipped = [];

        if (c1.pairId === c2.pairId) {
          c1.matched = true;
          c2.matched = true;
          matchedPairs++;
          renderCard(c1, i1);
          renderCard(c2, i2);
          if (A()) {
            A().play('card_match');
            A().play('sparkle');
            A().play('coin_collect');
          }

          showReadAloudModal(c1.full, function () {
            if (ended) return;
            U().floatText('+20', c2.el, 'good');
            U().addScore(turn, 20);
            U().confetti(20);
            if (J()) J().react(turn, 'big');
            renderHud();

            if (matchedPairs >= numPairs) {
              ended = true;
              if (A()) A().play('cheer_kids');
              setTimeout(function () { ctx.end(); }, 550);
              return;
            }
            // Same team gets another turn on a match!
            busy = false;
          });
        } else {
          // No match: let everyone see both cards, award +5 for trying, then flip back
          await U().sleep(1050);
          if (ended) return;
          c1.faceUp = false;
          c2.faceUp = false;
          renderCard(c1, i1);
          renderCard(c2, i2);
          if (A()) A().play('wood_knock');

          U().floatText('Good try! +5', c2.el, 'good');
          U().addScore(turn, 5);
          turn = (turn + 1) % T.length;
          renderHud();
          busy = false;
        }
      }

      ctx.onEnd(function () {
        ended = true;
      });

      renderHud();
    }
  };
})();
