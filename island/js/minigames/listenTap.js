/* ═══════════════════════════════════════════════════════════════
   Treasure Island — Mini-Game Engine: listenTap.js
   Used by: G3 Clue 1 (Greetings), G3 Clue 2 (People & Places),
            G4 Clue 1 (Asking Permission), and Stop 5 Final Reviews.
   Non-reader friendly: big illustrated `.webp` pictures + automatic
   character voice + slow replay.
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

  function renderVisual(img, icon, cls) {
    if (img) {
      return '<span class="' + (cls || 'ch1-opt-pic-wrap') + '">' +
        '<img class="ch1-card-img" src="' + esc(img) + '" alt="" draggable="false" onerror="this.style.display=\'none\'">' +
      '</span>';
    }
    return '<span class="ch1-opt-icon" aria-hidden="true">' + esc(icon || '⭐') + '</span>';
  }

  root.Ch1Minigames.listenTap = function (container, clue, opts, onComplete) {
    opts = opts || {};
    var rounds = (opts.rounds || clue.rounds || []).slice();
    var idx = 0;
    var totalTries = 0;
    var hintsUsed = 0;
    var missedItems = [];
    var startTime = Date.now();
    var A = function () { return root.Ch1Audio || {}; };
    var F = function () { return root.Ch1Feedback || {}; };

    function renderRound() {
      if (idx >= rounds.length) {
        var timeMs = Date.now() - startTime;
        onComplete({
          correct: true,
          tries: totalTries,
          hintsUsed: hintsUsed,
          timeMs: timeMs,
          stars: calcStars(totalTries, hintsUsed),
          missedItems: missedItems
        });
        return;
      }

      var r = rounds[idx];
      var roundTries = 0;
      var locked = false;
      var choices = shuffle(r.options || []);
      var promptImg = r.promptImg || (r.correct && r.correct.img) || '';

      var dotsHtml = rounds.map(function (_, i) {
        return '<span class="ch1-step-dot' + (i < idx ? ' done' : (i === idx ? ' active' : '')) + '"></span>';
      }).join('');

      container.innerHTML =
        '<div class="ch1-mg-wrap ch1-mg-listentap">' +
          '<div class="ch1-mg-toprow">' +
            '<div class="ch1-step-dots" aria-label="Progress">' + dotsHtml + '</div>' +
            '<div class="ch1-audio-controls">' +
              '<button type="button" class="ch1-btn cyan sm" id="ch1-lt-replay" aria-label="Listen again">🔊 Listen</button>' +
              '<button type="button" class="ch1-btn amber sm" id="ch1-lt-slow" aria-label="Listen slowly">🐢 Slowly, please</button>' +
            '</div>' +
          '</div>' +
          '<div class="ch1-prompt-card" id="ch1-lt-prompt">' +
            renderVisual(promptImg, r.promptIcon || '🏴‍☠️', 'ch1-prompt-pic-wrap') +
            '<div class="ch1-prompt-body">' +
              '<div class="ch1-prompt-speaker">' + esc(r.speaker || (clue.npc && clue.npc.name) || 'Jim Hawkins') + '</div>' +
              '<div class="ch1-prompt-text">' + esc(r.promptText) + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="ch1-options-grid" role="group" aria-label="Answer choices">' +
            choices.map(function (c, ci) {
              var isRight = (c.text === (r.correct && r.correct.text));
              return (
                '<button type="button" class="ch1-opt-card has-pic" data-idx="' + ci + '" data-right="' + (isRight ? '1' : '0') + '" aria-label="' + esc(c.text) + '">' +
                  renderVisual(c.img, c.icon || '⭐', 'ch1-opt-pic-wrap') +
                  '<span class="ch1-opt-label">' + esc(c.text) + '</span>' +
                  '<span class="ch1-opt-ear" data-ear="' + ci + '" role="button" tabindex="0" aria-label="Hear option: ' + esc(c.text) + '">🔊</span>' +
                '</button>'
              );
            }).join('') +
          '</div>' +
        '</div>';

      var replayBtn = document.getElementById('ch1-lt-replay');
      var slowBtn = document.getElementById('ch1-lt-slow');
      if (replayBtn) {
        replayBtn.onclick = function () {
          if (A().sfxTap) A().sfxTap();
          if (A().speak) A().speak(r.speakText || r.promptText, { lineId: r.lineId });
        };
      }
      if (slowBtn) {
        slowBtn.onclick = function () {
          if (A().sfxTap) A().sfxTap();
          if (F().flintFlap) F().flintFlap();
          if (A().speakSlow) A().speakSlow(r.slowText || r.speakText || r.promptText, r.lineId);
        };
      }

      var cards = container.querySelectorAll('.ch1-opt-card');
      [].forEach.call(cards, function (card) {
        var ear = card.querySelector('.ch1-opt-ear');
        var ci = Number(card.getAttribute('data-idx'));
        var choice = choices[ci];
        if (ear) {
          ear.onclick = function (ev) {
            ev.stopPropagation();
            if (A().sfxTap) A().sfxTap();
            if (A().speak) A().speak(choice.speak || choice.text);
          };
        }
        card.onclick = function () {
          if (locked) return;
          if (F().squashPop) F().squashPop(card);
          var isRight = card.getAttribute('data-right') === '1';
          if (isRight) {
            locked = true;
            card.classList.add('correct');
            if (A().sfxCorrect) A().sfxCorrect();
            if (F().sparkleAt) F().sparkleAt(card, 12);
            if (F().floatStar) F().floatStar(card, '+1 ⭐');
            if (F().benbowJump) F().benbowJump();
            if (F().showRightBanner) F().showRightBanner(choice.text);
            if (A().speak) {
              A().speak(choice.speak || choice.text, { lineId: r.correct && r.correct.lineId }, function () {
                setTimeout(function () {
                  idx++;
                  renderRound();
                }, 260);
              });
            } else {
              setTimeout(function () { idx++; renderRound(); }, 550);
            }
          } else {
            totalTries++;
            roundTries++;
            if (missedItems.indexOf(r.correct.text) === -1) missedItems.push(r.correct.text);
            card.classList.add('wrong');
            if (F().wiggleWrong) F().wiggleWrong(card, r.hint);
            if (roundTries >= 2) {
              hintsUsed++;
              var rightCard = container.querySelector('.ch1-opt-card[data-right="1"]');
              if (rightCard) rightCard.classList.add('ch1-hint-glow');
              if (A().speakSlow) A().speakSlow(r.slowText || r.speakText || r.promptText, r.lineId);
            } else if (A().speak) {
              A().speak('Almost! Try again!');
            }
          }
        };
      });

      if (A().speak) {
        A().speak(r.speakText || r.promptText, { lineId: r.lineId });
      }
    }

    renderRound();
  };
})(typeof window !== 'undefined' ? window : this);
