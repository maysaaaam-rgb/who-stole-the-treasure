/* ═══════════════════════════════════════════════════════════════
   Treasure Island — Mini-Game Engine: flintSays.js
   Used by: G4 Clue 3 ("Flint Says" Classroom Instructions TPR at Ship Wheel).
   Captain Flint calls out an order; student taps the matching illustrated
   `.webp` action card and watches their monster perform the action!
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

  root.Ch1Minigames.flintSays = function (container, clue, opts, onComplete) {
    opts = opts || {};
    var orders = (opts.orders || clue.orders || []).slice();
    var idx = 0;
    var totalTries = 0;
    var hintsUsed = 0;
    var missedItems = [];
    var startTime = Date.now();
    var A = function () { return root.Ch1Audio || {}; };
    var F = function () { return root.Ch1Feedback || {}; };

    function renderOrder() {
      if (idx >= orders.length) {
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

      var ord = orders[idx];
      var choices = shuffle(ord.options || []);
      var roundTries = 0;
      var locked = false;

      var dotsHtml = orders.map(function (_, i) {
        return '<span class="ch1-step-dot' + (i < idx ? ' done' : (i === idx ? ' active' : '')) + '"></span>';
      }).join('');

      container.innerHTML =
        '<div class="ch1-mg-wrap ch1-mg-flintsays">' +
          '<div class="ch1-mg-toprow">' +
            '<div class="ch1-step-dots" aria-label="Progress">' + dotsHtml + '</div>' +
            '<div class="ch1-audio-controls">' +
              '<button type="button" class="ch1-btn cyan sm" id="ch1-fs-replay" aria-label="Say that again, please">🔊 Flint Says</button>' +
              '<button type="button" class="ch1-btn amber sm" id="ch1-fs-slow" aria-label="Slowly, please">🐢 Slowly, please</button>' +
            '</div>' +
          '</div>' +
          '<div class="ch1-flint-stage">' +
            '<div class="ch1-flint-order-box">' +
              '<div class="ch1-flint-badge">' +
                '<img src="art/flat/c_pip_happy.webp" class="ch1-inline-badge-img" alt="" draggable="false"> ' +
                'CAPTAIN FLINT\'S ORDER' +
              '</div>' +
              '<div class="ch1-flint-cmd">' +
                (ord.img
                  ? '<span class="ch1-prompt-pic-wrap" id="ch1-fs-act-icon"><img class="ch1-card-img" src="' + esc(ord.img) + '" alt="" draggable="false"></span>'
                  : '<span class="ch1-flint-icon" id="ch1-fs-act-icon" aria-hidden="true">' + esc(ord.icon || '⚓') + '</span>') +
                '<b>"Flint says: ' + esc(ord.command) + '"</b>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="ch1-options-grid" role="group" aria-label="Classroom actions">' +
            choices.map(function (c, ci) {
              var isRight = (c.text === ord.command);
              return (
                '<button type="button" class="ch1-opt-card has-pic" data-idx="' + ci + '" data-right="' + (isRight ? '1' : '0') + '" aria-label="' + esc(c.text) + '">' +
                  renderVisual(c.img, c.icon || '⭐', 'ch1-opt-pic-wrap') +
                  '<span class="ch1-opt-label">' + esc(c.text) + '</span>' +
                  '<span class="ch1-opt-ear" data-ear="' + ci + '" role="button" tabindex="0" aria-label="Hear: ' + esc(c.text) + '">🔊</span>' +
                '</button>'
              );
            }).join('') +
          '</div>' +
        '</div>';

      var replayBtn = document.getElementById('ch1-fs-replay');
      var slowBtn = document.getElementById('ch1-fs-slow');
      if (replayBtn) {
        replayBtn.onclick = function () {
          if (A().sfxTap) A().sfxTap();
          if (F().flintFlap) F().flintFlap();
          if (A().speak) A().speak(ord.speak);
        };
      }
      if (slowBtn) {
        slowBtn.onclick = function () {
          if (A().sfxTap) A().sfxTap();
          if (F().flintFlap) F().flintFlap();
          if (A().speakSlow) A().speakSlow(ord.slowSpeak || ord.speak);
        };
      }

      var cards = container.querySelectorAll('.ch1-opt-card');
      [].forEach.call(cards, function (card) {
        var ci = Number(card.getAttribute('data-idx'));
        var choice = choices[ci];
        var ear = card.querySelector('.ch1-opt-ear');
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
          if (card.getAttribute('data-right') === '1') {
            locked = true;
            card.classList.add('correct');
            if (A().sfxCorrect) A().sfxCorrect();
            if (F().sparkleAt) F().sparkleAt(card, 14);
            if (F().floatStar) F().floatStar(card, 'Aye, Aye, Captain! ⭐');
            if (F().benbowJump) F().benbowJump();
            if (F().flintFlap) F().flintFlap();
            var actIcon = document.getElementById('ch1-fs-act-icon');
            if (actIcon) actIcon.classList.add('ch1-act-pop');
            if (F().showRightBanner) F().showRightBanner(ord.command);
            if (A().speak) {
              A().speak(choice.speak || choice.text, function () {
                setTimeout(function () {
                  idx++;
                  renderOrder();
                }, 260);
              });
            } else {
              setTimeout(function () { idx++; renderOrder(); }, 520);
            }
          } else {
            totalTries++;
            roundTries++;
            if (missedItems.indexOf(ord.command) === -1) missedItems.push(ord.command);
            card.classList.add('wrong');
            if (F().flintFlap) F().flintFlap();
            if (F().wiggleWrong) F().wiggleWrong(card, 'Squawk! ' + (ord.hint || 'Listen to Captain Flint again!'));
            if (roundTries >= 2) {
              hintsUsed++;
              var rightCard = container.querySelector('.ch1-opt-card[data-right="1"]');
              if (rightCard) rightCard.classList.add('ch1-hint-glow');
              if (A().speakSlow) A().speakSlow(ord.slowSpeak || ord.speak);
            } else if (A().speak) {
              A().speak('Squawk! Haha, almost! Try again!');
            }
          }
        };
      });

      if (A().speak) A().speak(ord.speak);
    }

    renderOrder();
  };
})(typeof window !== 'undefined' ? window : this);
