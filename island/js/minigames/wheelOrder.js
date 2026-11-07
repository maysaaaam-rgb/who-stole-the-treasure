/* ═══════════════════════════════════════════════════════════════
   Treasure Island — Mini-Game Engine: wheelOrder.js
   Used by: G3 Clue 3 (The Twelve Months Ship Wheel + "What month is it now?").
   Students place the missing months onto the 12 spokes of the ship wheel
   in calendar order (January–December), with `.webp` pictures on every spoke!
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

  function renderMonthVisual(img, icon, cls) {
    if (img) {
      return '<span class="' + (cls || 'ch1-month-pic-wrap') + '">' +
        '<img class="ch1-card-img" src="' + esc(img) + '" alt="" draggable="false" onerror="this.style.display=\'none\'">' +
      '</span>';
    }
    return '<span class="ch1-spoke-icon">' + esc(icon || '📅') + '</span>';
  }

  root.Ch1Minigames.wheelOrder = function (container, clue, opts, onComplete) {
    opts = opts || {};
    var months = (clue.months || []).slice();
    var missingList = (opts.mode === 'star' ? (clue.starMissingSpokes || [1, 4, 5, 8, 11, 12]) : (clue.easyMissingSpokes || [3, 7, 10, 11])).slice();
    var filledSpokes = {};
    months.forEach(function (m) {
      if (missingList.indexOf(m.num) === -1) filledSpokes[m.num] = true;
    });

    var bank = shuffle(months.filter(function (m) { return missingList.indexOf(m.num) !== -1; }));
    var totalTries = 0;
    var hintsUsed = 0;
    var spokeTries = 0;
    var missedItems = [];
    var startTime = Date.now();
    var A = function () { return root.Ch1Audio || {}; };
    var F = function () { return root.Ch1Feedback || {}; };

    function nextMissingMonth() {
      for (var i = 0; i < months.length; i++) {
        if (!filledSpokes[months[i].num]) return months[i];
      }
      return null;
    }

    function renderWheel() {
      var target = nextMissingMonth();
      if (!target) {
        if (clue.bonusQuestion) {
          setTimeout(runBonusQuestion, 380);
          return;
        }
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

      var prevMonth = target.num > 1 ? months[target.num - 2].name : 'December';
      var promptLine = 'Spoke #' + target.num + ' (after ' + prevMonth + '): Tap "' + target.name + '"!';

      container.innerHTML =
        '<div class="ch1-mg-wrap ch1-mg-wheelorder">' +
          '<div class="ch1-mg-toprow">' +
            '<div class="ch1-dm-instruction">' +
              '<img src="art/flat/o_ship_wheel.webp" class="ch1-inline-badge-img" alt="" draggable="false"> ' +
              esc(promptLine) +
            '</div>' +
            '<div class="ch1-audio-controls">' +
              '<button type="button" class="ch1-btn cyan sm" id="ch1-wh-replay" aria-label="Listen to month">🔊 Hear Month</button>' +
              '<button type="button" class="ch1-btn amber sm" id="ch1-wh-slow" aria-label="Hear all 12 months">🐢 12 Months Song</button>' +
            '</div>' +
          '</div>' +
          '<div class="ch1-wheel-grid" role="group" aria-label="12 Ship Wheel Spokes">' +
            months.map(function (m) {
              var isFilled = !!filledSpokes[m.num];
              var isTarget = (!isFilled && m.num === target.num);
              return (
                '<div class="ch1-spoke-slot' + (isFilled ? ' filled' : ' empty') + (isTarget ? ' active-spoke' : '') + '" ' +
                  'data-spoke="' + m.num + '" aria-label="Spoke ' + m.num + ': ' + (isFilled ? esc(m.name) : 'Empty') + '">' +
                  '<span class="ch1-spoke-num">#' + m.num + '</span>' +
                  (isFilled ? renderMonthVisual(m.img, m.icon, 'ch1-spoke-pic-wrap') : '<span class="ch1-spoke-icon">❓</span>') +
                  '<span class="ch1-spoke-name">' + (isFilled ? esc(m.name) : '???') + '</span>' +
                '</div>'
              );
            }).join('') +
          '</div>' +
          '<div class="ch1-wheel-bank" role="group" aria-label="Missing month cards">' +
            bank.map(function (m) {
              var used = !!filledSpokes[m.num];
              var isHint = (spokeTries >= 2 && !used && m.num === target.num);
              return (
                '<button type="button" class="ch1-month-card' + (used ? ' used' : '') + (isHint ? ' ch1-hint-glow' : '') + '" ' +
                  'data-num="' + m.num + '" ' + (used ? 'disabled' : '') + ' aria-label="' + esc(m.name) + '">' +
                  renderMonthVisual(m.img, m.icon, 'ch1-month-pic-wrap') +
                  '<span class="ch1-month-label">' + esc(m.name) + '</span>' +
                '</button>'
              );
            }).join('') +
          '</div>' +
        '</div>';

      var replayBtn = document.getElementById('ch1-wh-replay');
      var slowBtn = document.getElementById('ch1-wh-slow');
      if (replayBtn) {
        replayBtn.onclick = function () {
          if (A().sfxTap) A().sfxTap();
          if (A().speak) A().speak('Find month number ' + target.num + ': ' + target.name + '!');
        };
      }
      if (slowBtn) {
        slowBtn.onclick = function () {
          if (A().sfxTap) A().sfxTap();
          if (F().flintFlap) F().flintFlap();
          if (A().speakSlow) A().speakSlow(clue.flintWord, clue.flintLineId);
        };
      }

      var filledEls = container.querySelectorAll('.ch1-spoke-slot.filled');
      [].forEach.call(filledEls, function (el) {
        el.onclick = function () {
          var n = Number(el.getAttribute('data-spoke'));
          var mObj = months[n - 1];
          if (mObj && A().speak) A().speak(mObj.name);
        };
      });

      var cards = container.querySelectorAll('.ch1-month-card');
      [].forEach.call(cards, function (card) {
        card.onclick = function () {
          var pickedNum = Number(card.getAttribute('data-num'));
          if (filledSpokes[pickedNum]) return;
          if (F().squashPop) F().squashPop(card);
          if (pickedNum === target.num) {
            filledSpokes[pickedNum] = true;
            spokeTries = 0;
            if (A().sfxCorrect) A().sfxCorrect();
            if (F().sparkleAt) F().sparkleAt(card, 12);
            if (F().floatStar) F().floatStar(card, target.name + '! ⭐');
            if (F().benbowJump) F().benbowJump();
            if (F().showRightBanner) F().showRightBanner('#' + target.num + ' — ' + target.name + '!');
            if (A().speak) {
              A().speak(target.name, function () {
                setTimeout(renderWheel, 220);
              });
            } else {
              setTimeout(renderWheel, 400);
            }
          } else {
            totalTries++;
            spokeTries++;
            if (missedItems.indexOf(target.name) === -1) missedItems.push(target.name);
            if (F().wiggleWrong) {
              F().wiggleWrong(card, 'Month #' + target.num + ' (after ' + prevMonth + ') is "' + target.name + '"!');
            }
            if (spokeTries >= 2) {
              hintsUsed++;
              renderWheel();
              if (A().speakSlow) A().speakSlow(target.name);
            } else if (A().speak) {
              A().speak('Almost! Find ' + target.name + '!');
            }
          }
        };
      });

      if (A().speak) {
        A().speak('Find month number ' + target.num + ': ' + target.name + '!');
      }
    }

    function runBonusQuestion() {
      var bq = clue.bonusQuestion;
      var round = {
        id: 'g3_s3_bonus_q',
        speaker: 'Captain Flint',
        promptIcon: bq.promptIcon || '🍁📅',
        promptImg: bq.promptImg || 'art/flat/r_leaf.webp',
        promptText: bq.promptText,
        speakText: bq.speakText,
        lineId: bq.lineId,
        hint: 'Tap "It\'s November." 🍁!',
        correct: bq.correct,
        options: bq.options
      };
      root.Ch1Minigames.listenTap(container, clue, { rounds: [round] }, function (res) {
        var totTries = totalTries + (res.tries || 0);
        var totHints = hintsUsed + (res.hintsUsed || 0);
        onComplete({
          correct: true,
          tries: totTries,
          hintsUsed: totHints,
          timeMs: Date.now() - startTime,
          stars: calcStars(totTries, totHints),
          missedItems: missedItems.concat(res.missedItems || [])
        });
      });
    }

    renderWheel();
  };
})(typeof window !== 'undefined' ? window : this);
