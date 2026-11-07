/* ═══════════════════════════════════════════════════════════════
   Treasure Island — Mini-Game Engine: countTap.js
   Used by: G4 Clue 4 (Numbers 1–50 through the Brass Telescope).
   Displays countable bundles of 10 + single items with real `.webp`
   harbour artwork so students can count by 10s and 1s!
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  root.Ch1Minigames = root.Ch1Minigames || {};

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function shuffle(arr) {
    var a = (arr || []).slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function calcStars(tries, hintsUsed) {
    if (tries === 0 && hintsUsed === 0) return 3;
    if (tries <= 2) return 2;
    return 1;
  }

  root.Ch1Minigames.countTap = function (container, clue, opts, onComplete) {
    opts = opts || {};
    var rounds = (opts.countRounds || clue.countRounds || []).slice();
    var idx = 0;
    var totalTries = 0;
    var hintsUsed = 0;
    var missedItems = [];
    var startTime = Date.now();
    var A = function () { return root.Ch1Audio || {}; };
    var F = function () { return root.Ch1Feedback || {}; };

    function renderRound() {
      if (idx >= rounds.length) {
        onComplete({
          correct: true,
          tries: totalTries,
          hintsUsed: hintsUsed,
          timeMs: Date.now() - startTime,
          stars: calcStars(totalTries, hintsUsed),
          missedItems: missedItems
        });
        return;
      }

      var r = rounds[idx];
      var choices = shuffle(r.options || []);
      var roundTries = 0;
      var locked = false;

      var tensHtml = '';
      for (var t = 0; t < (r.tensCount || 0); t++) {
        var cumTen = (t + 1) * 10;
        tensHtml +=
          '<button type="button" class="ch1-cnt-bundle ten" data-val="' + cumTen + '" aria-label="' + cumTen + '">' +
            (r.tensImg
              ? '<img class="ch1-cnt-img" src="' + esc(r.tensImg) + '" alt="" draggable="false">'
              : '<span class="ch1-cnt-b-icon">' + esc(r.tensLabel || '×10') + '</span>') +
            '<span class="ch1-cnt-b-tag">×10</span>' +
            '<b>' + cumTen + '</b>' +
          '</button>';
      }
      var onesHtml = '';
      for (var o = 0; o < (r.onesCount || 0); o++) {
        var cumOne = (r.tensCount || 0) * 10 + (o + 1);
        onesHtml +=
          '<button type="button" class="ch1-cnt-bundle one" data-val="' + cumOne + '" aria-label="' + cumOne + '">' +
            (r.onesImg
              ? '<img class="ch1-cnt-img sm" src="' + esc(r.onesImg) + '" alt="" draggable="false">'
              : '<span class="ch1-cnt-b-icon">' + esc(r.onesIcon || '🛢️') + '</span>') +
            '<small>+1</small>' +
          '</button>';
      }

      var dotsHtml = rounds.map(function (_, i) {
        return '<span class="ch1-step-dot' + (i < idx ? ' done' : (i === idx ? ' active' : '')) + '"></span>';
      }).join('');

      container.innerHTML =
        '<div class="ch1-mg-wrap ch1-mg-counttap">' +
          '<div class="ch1-mg-toprow">' +
            '<div class="ch1-step-dots" aria-label="Progress">' + dotsHtml + '</div>' +
            '<div class="ch1-audio-controls">' +
              '<button type="button" class="ch1-btn cyan sm" id="ch1-ct-replay" aria-label="Listen">🔊 Listen</button>' +
              '<button type="button" class="ch1-btn amber sm" id="ch1-ct-slow" aria-label="Listen slowly">🐢 Slowly, please</button>' +
            '</div>' +
          '</div>' +
          '<div class="ch1-spyglass-box">' +
            '<div class="ch1-spyglass-title">' +
              '<img src="art/flat/o_spyglass.webp" class="ch1-inline-badge-img" alt="" draggable="false"> ' +
              esc(r.title) + ' <small>(Tap bundles to count aloud!)</small>' +
            '</div>' +
            '<div class="ch1-cnt-tray" role="group" aria-label="Items to count">' +
              tensHtml + onesHtml +
            '</div>' +
          '</div>' +
          '<div class="ch1-options-grid" role="group" aria-label="Number choices">' +
            choices.map(function (c, ci) {
              var isRight = (Number(c.num) === Number(r.targetNumber));
              return (
                '<button type="button" class="ch1-opt-card has-pic" data-idx="' + ci + '" data-right="' + (isRight ? '1' : '0') + '" aria-label="' + esc(c.num + ' ' + c.word) + '">' +
                  (c.img
                    ? '<span class="ch1-opt-pic-wrap"><img class="ch1-card-img" src="' + esc(c.img) + '" alt="" draggable="false"></span>'
                    : '<span class="ch1-opt-icon" aria-hidden="true">' + esc(c.icon || String(c.num)) + '</span>') +
                  '<span class="ch1-opt-label"><b>' + esc(c.num) + '</b> — ' + esc(c.word) + '</span>' +
                  '<span class="ch1-opt-ear" data-ear="' + ci + '" role="button" tabindex="0" aria-label="Hear: ' + esc(c.word) + '">🔊</span>' +
                '</button>'
              );
            }).join('') +
          '</div>' +
        '</div>';

      var replayBtn = document.getElementById('ch1-ct-replay');
      var slowBtn = document.getElementById('ch1-ct-slow');
      if (replayBtn) {
        replayBtn.onclick = function () {
          if (A().sfxTap) A().sfxTap();
          if (A().speak) A().speak(r.speak);
        };
      }
      if (slowBtn) {
        slowBtn.onclick = function () {
          if (A().sfxTap) A().sfxTap();
          if (F().flintFlap) F().flintFlap();
          if (A().speakSlow) A().speakSlow(r.slowSpeak || r.speak);
        };
      }

      var bundles = container.querySelectorAll('.ch1-cnt-bundle');
      [].forEach.call(bundles, function (b) {
        b.onclick = function () {
          if (A().sfxTap) A().sfxTap();
          if (F().squashPop) F().squashPop(b);
          b.classList.add('counted');
          var v = b.getAttribute('data-val');
          if (A().speak) A().speak(String(v));
        };
      });

      var cards = container.querySelectorAll('.ch1-opt-card');
      [].forEach.call(cards, function (card) {
        var ci = Number(card.getAttribute('data-idx'));
        var choice = choices[ci];
        var ear = card.querySelector('.ch1-opt-ear');
        if (ear) {
          ear.onclick = function (ev) {
            ev.stopPropagation();
            if (A().sfxTap) A().sfxTap();
            if (A().speak) A().speak(choice.word);
          };
        }
        card.onclick = function () {
          if (locked) return;
          if (F().squashPop) F().squashPop(card);
          if (card.getAttribute('data-right') === '1') {
            locked = true;
            card.classList.add('correct');
            if (A().sfxCorrect) A().sfxCorrect();
            if (F().sparkleAt) F().sparkleAt(card, 14);
            if (F().floatStar) F().floatStar(card, r.targetNumber + ' — ' + r.targetWord + '! ⭐');
            if (F().benbowJump) F().benbowJump();
            if (F().showRightBanner) F().showRightBanner(r.targetNumber + ' — ' + r.targetWord + ' ' + (r.itemNoun || ''));
            if (A().speak) {
              A().speak(r.targetWord + ' ' + (r.itemNoun || ''), function () {
                setTimeout(function () {
                  idx++;
                  renderRound();
                }, 260);
              });
            } else {
              setTimeout(function () { idx++; renderRound(); }, 520);
            }
          } else {
            totalTries++;
            roundTries++;
            if (missedItems.indexOf(r.targetWord) === -1) missedItems.push(r.targetWord);
            card.classList.add('wrong');
            if (F().wiggleWrong) F().wiggleWrong(card, r.hint);
            if (roundTries >= 2) {
              hintsUsed++;
              var rightCard = container.querySelector('.ch1-opt-card[data-right="1"]');
              if (rightCard) rightCard.classList.add('ch1-hint-glow');
              if (A().speakSlow) A().speakSlow(r.slowSpeak || r.speak);
            } else if (A().speak) {
              A().speak('Almost! Try again!');
            }
          }
        };
      });

      if (A().speak) A().speak(r.speak);
    }

    renderRound();
  };
})(typeof window !== 'undefined' ? window : this);
