/* ═══════════════════════════════════════════════════════════════
   Treasure Island — Mini-Game Engine: dialLock.js
   Used by: G4 Clue 5 (Billy Bones's Sea Chest Brass Number Lock +
   "Can I open the chest?" Permission Step + 4-Question Mixed Review).
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

  function calcStars(tries, hintsUsed) {
    if (tries === 0 && hintsUsed === 0) return 3;
    if (tries <= 2) return 2;
    return 1;
  }

  root.Ch1Minigames.dialLock = function (container, clue, opts, onComplete) {
    opts = opts || {};
    var lockCode = (clue.lockCode || []).slice();
    var selected = lockCode.map(function (d) { return d.options[0]; });
    var totalTries = 0;
    var hintsUsed = 0;
    var missedItems = [];
    var dialTries = 0;
    var startTime = Date.now();
    var A = function () { return root.Ch1Audio || {}; };
    var F = function () { return root.Ch1Feedback || {}; };

    function renderDials() {
      container.innerHTML =
        '<div class="ch1-mg-wrap ch1-mg-diallock">' +
          '<div class="ch1-mg-toprow">' +
            '<div class="ch1-dm-instruction">' +
              '<img src="' + esc(clue.lockImg || 'art/flat/o_billy_chest.webp') + '" class="ch1-inline-badge-img" alt="" draggable="false"> ' +
              'Listen to the 3 numbers and turn each brass dial to match!' +
            '</div>' +
            '<div class="ch1-audio-controls">' +
              '<button type="button" class="ch1-btn cyan sm" id="ch1-dl-replay" aria-label="Listen to secret code">🔊 Hear Code</button>' +
              '<button type="button" class="ch1-btn amber sm" id="ch1-dl-slow" aria-label="Listen slowly">🐢 Slowly, please</button>' +
            '</div>' +
          '</div>' +
          '<div class="ch1-dials-row" role="group" aria-label="Three brass number dials">' +
            lockCode.map(function (d, di) {
              var curVal = selected[di];
              var showHint = (dialTries >= 2 && curVal !== d.number);
              return (
                '<div class="ch1-dial-card' + (curVal === d.number ? ' right-val' : '') + (showHint ? ' ch1-hint-glow' : '') + '" data-di="' + di + '">' +
                  '<div class="ch1-dial-hdr">' +
                    '<img src="' + esc(d.img || 'art/flat/o_compass.webp') + '" class="ch1-inline-badge-img" alt="" draggable="false"> ' +
                    'DIAL ' + (di + 1) + (opts.mode === 'star' ? '' : (' · "' + esc(d.word) + '"')) +
                  '</div>' +
                  '<div class="ch1-dial-wheel">' +
                    '<button type="button" class="ch1-dial-step" data-di="' + di + '" data-dir="-1" aria-label="Previous number on dial ' + (di + 1) + '">◀</button>' +
                    '<div class="ch1-dial-num" id="ch1-dial-val-' + di + '">' + esc(curVal) + '</div>' +
                    '<button type="button" class="ch1-dial-step" data-di="' + di + '" data-dir="1" aria-label="Next number on dial ' + (di + 1) + '">▶</button>' +
                  '</div>' +
                  '<div class="ch1-dial-quick">' +
                    d.options.map(function (n) {
                      return (
                        '<button type="button" class="ch1-dial-chip' + (n === curVal ? ' on' : '') + (showHint && n === d.number ? ' ch1-hint-glow' : '') + '" ' +
                          'data-di="' + di + '" data-num="' + n + '" aria-label="Set dial ' + (di + 1) + ' to ' + n + '">' + n + '</button>'
                      );
                    }).join('') +
                  '</div>' +
                '</div>'
              );
            }).join('') +
          '</div>' +
          '<div class="ch1-dl-actions">' +
            '<button type="button" class="ch1-btn gold lg" id="ch1-dl-check" aria-label="Unlock brass dials">' +
              '<img src="art/flat/o_billy_chest.webp" class="ch1-inline-badge-img" alt="" draggable="false"> ' +
              'Open the Lock' +
            '</button>' +
          '</div>' +
        '</div>';

      var replayBtn = document.getElementById('ch1-dl-replay');
      var slowBtn = document.getElementById('ch1-dl-slow');
      if (replayBtn) {
        replayBtn.onclick = function () {
          if (A().sfxTap) A().sfxTap();
          if (A().speak) A().speak(clue.lockSpeak);
        };
      }
      if (slowBtn) {
        slowBtn.onclick = function () {
          if (A().sfxTap) A().sfxTap();
          if (F().flintFlap) F().flintFlap();
          if (A().speakSlow) A().speakSlow(clue.lockSlowSpeak || clue.lockSpeak);
        };
      }

      var stepBtns = container.querySelectorAll('.ch1-dial-step');
      [].forEach.call(stepBtns, function (btn) {
        btn.onclick = function () {
          if (A().sfxTap) A().sfxTap();
          var di = Number(btn.getAttribute('data-di'));
          var dir = Number(btn.getAttribute('data-dir'));
          var optsArr = lockCode[di].options;
          var curIdx = Math.max(0, optsArr.indexOf(selected[di]));
          var nextIdx = (curIdx + dir + optsArr.length) % optsArr.length;
          selected[di] = optsArr[nextIdx];
          if (A().speak) A().speak(String(selected[di]));
          renderDials();
        };
      });

      var chips = container.querySelectorAll('.ch1-dial-chip');
      [].forEach.call(chips, function (chip) {
        chip.onclick = function () {
          if (A().sfxTap) A().sfxTap();
          var di = Number(chip.getAttribute('data-di'));
          var num = Number(chip.getAttribute('data-num'));
          selected[di] = num;
          if (A().speak) A().speak(String(num));
          renderDials();
        };
      });

      var checkBtn = document.getElementById('ch1-dl-check');
      if (checkBtn) {
        checkBtn.onclick = function () {
          var allRight = lockCode.every(function (d, i) { return selected[i] === d.number; });
          if (allRight) {
            if (A().sfxCorrect) A().sfxCorrect();
            if (F().sparkleAt) F().sparkleAt(checkBtn, 16);
            if (F().benbowJump) F().benbowJump();
            if (F().showRightBanner) F().showRightBanner('Click! ' + lockCode.map(function (d) { return d.number; }).join(' – ') + ' unlocked the brass dials!');
            setTimeout(runPermissionAndReview, 450);
          } else {
            totalTries++;
            dialTries++;
            lockCode.forEach(function (d, i) {
              if (selected[i] !== d.number && missedItems.indexOf(d.word) === -1) {
                missedItems.push(d.word);
              }
            });
            if (F().wiggleWrong) {
              F().wiggleWrong(checkBtn, dialTries >= 2
                ? 'Listen for: ' + lockCode.map(function (d) { return d.word + ' (' + d.number + ')'; }).join(', ') + '!'
                : 'Almost! Listen again!');
            }
            if (dialTries >= 2) {
              hintsUsed++;
              renderDials();
              if (A().speakSlow) A().speakSlow(clue.lockSlowSpeak || clue.lockSpeak);
            } else if (A().speak) {
              A().speak('Almost! Listen to the three numbers and try again!');
            }
          }
        };
      }
    }

    function runPermissionAndReview() {
      var permRound = clue.permissionStep ? [{
        id: 'g4_s5_perm',
        speaker: 'Billy Bones',
        promptIcon: clue.permissionStep.promptIcon || '🗝️🧰',
        promptImg: clue.permissionStep.promptImg || 'art/flat/o_billy_chest.webp',
        promptText: clue.permissionStep.promptText,
        speakText: clue.permissionStep.speakText,
        hint: 'Ask politely: "Can I open the chest, please?"',
        correct: clue.permissionStep.correct,
        options: clue.permissionStep.options
      }] : [];
      var allRounds = permRound.concat(clue.reviewRounds || []);
      if (!allRounds.length) {
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
      root.Ch1Minigames.listenTap(container, clue, { rounds: allRounds }, function (revRes) {
        var totTries = totalTries + (revRes.tries || 0);
        var totHints = hintsUsed + (revRes.hintsUsed || 0);
        onComplete({
          correct: true,
          tries: totTries,
          hintsUsed: totHints,
          timeMs: Date.now() - startTime,
          stars: calcStars(totTries, totHints),
          missedItems: missedItems.concat(revRes.missedItems || [])
        });
      });
    }

    renderDials();
    if (A().speak) A().speak(clue.lockSpeak);
  };
})(typeof window !== 'undefined' ? window : this);
