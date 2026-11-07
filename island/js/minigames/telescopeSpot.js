/* ═══════════════════════════════════════════════════════════════
   Treasure Island — Mini-Game Engine: telescopeSpot.js
   Used by: G3 Clue 4 (Spot Jim's Surprise Birthday Party on the Dock
   + "How old are you? I'm 8 years old" & "When's your birthday? It's in July").
   Features a rich harbour party backdrop + illustrated `.webp` sprites!
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

  root.Ch1Minigames.telescopeSpot = function (container, clue, opts, onComplete) {
    opts = opts || {};
    var items = (clue.sceneItems || []).slice();
    var targetIdx = 0;
    var foundIds = {};
    var totalTries = 0;
    var hintsUsed = 0;
    var spotTries = 0;
    var missedItems = [];
    var startTime = Date.now();
    var A = function () { return root.Ch1Audio || {}; };
    var F = function () { return root.Ch1Feedback || {}; };

    function renderScene() {
      if (targetIdx >= items.length) {
        if (clue.questions && clue.questions.length) {
          setTimeout(runBirthdayQuestions, 380);
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

      var cur = items[targetIdx];
      var bgImg = clue.sceneBackdrop || 'art/bg_party.webp';

      container.innerHTML =
        '<div class="ch1-mg-wrap ch1-mg-telescope">' +
          '<div class="ch1-mg-toprow">' +
            '<div class="ch1-dm-instruction">' +
              '<img src="art/flat/o_spyglass.webp" class="ch1-inline-badge-img" alt="" draggable="false"> ' +
              'Look through the brass telescope! Tap the <b>' + esc(cur.word) + '</b>! (' + (targetIdx + 1) + '/' + items.length + ')' +
            '</div>' +
            '<div class="ch1-audio-controls">' +
              '<button type="button" class="ch1-btn cyan sm" id="ch1-ts-replay" aria-label="Listen to Captain Flint">🔊 Hear Clue</button>' +
              '<button type="button" class="ch1-btn amber sm" id="ch1-ts-slow" aria-label="Listen slowly">🐢 Slowly, please</button>' +
            '</div>' +
          '</div>' +
          '<div class="ch1-telescope-viewport" style="background-image:linear-gradient(180deg, rgba(6,12,26,0.38), rgba(6,12,26,0.52)), url(\'' + esc(bgImg) + '\');background-size:cover;background-position:center;" role="region" aria-label="Telescope view of the harbour dock">' +
            '<div class="ch1-telescope-ring"></div>' +
            items.map(function (it, i) {
              var isFound = !!foundIds[it.id];
              var isHint = (spotTries >= 2 && i === targetIdx);
              return (
                '<button type="button" class="ch1-ts-spot' + (isFound ? ' found' : '') + (isHint ? ' ch1-hint-glow' : '') + '" ' +
                  'style="left:' + it.x + '%;top:' + it.y + '%" data-id="' + esc(it.id) + '" ' +
                  'aria-label="' + esc(it.word) + '">' +
                  (it.img
                    ? '<img class="ch1-ts-img" src="' + esc(it.img) + '" alt="' + esc(it.word) + '" draggable="false">'
                    : '<span class="ch1-ts-icon">' + esc(it.icon) + '</span>') +
                  '<span class="ch1-ts-label">' + esc(it.word) + '</span>' +
                '</button>'
              );
            }).join('') +
          '</div>' +
        '</div>';

      var replayBtn = document.getElementById('ch1-ts-replay');
      var slowBtn = document.getElementById('ch1-ts-slow');
      if (replayBtn) {
        replayBtn.onclick = function () {
          if (A().sfxTap) A().sfxTap();
          if (A().speak) A().speak(cur.speak);
        };
      }
      if (slowBtn) {
        slowBtn.onclick = function () {
          if (A().sfxTap) A().sfxTap();
          if (F().flintFlap) F().flintFlap();
          if (A().speakSlow) A().speakSlow(cur.speak);
        };
      }

      var spots = container.querySelectorAll('.ch1-ts-spot');
      [].forEach.call(spots, function (spot) {
        spot.onclick = function () {
          var sid = spot.getAttribute('data-id');
          if (foundIds[sid]) return;
          if (F().squashPop) F().squashPop(spot);
          if (sid === cur.id) {
            foundIds[sid] = true;
            spotTries = 0;
            if (A().sfxCorrect) A().sfxCorrect();
            if (F().sparkleAt) F().sparkleAt(spot, 12);
            if (F().floatStar) F().floatStar(spot, cur.word + '! ⭐');
            if (F().benbowJump) F().benbowJump();
            if (F().showRightBanner) F().showRightBanner('Spotted: ' + cur.word + '!');
            if (A().speak) {
              A().speak(cur.word, function () {
                targetIdx++;
                setTimeout(renderScene, 220);
              });
            } else {
              targetIdx++;
              setTimeout(renderScene, 420);
            }
          } else {
            totalTries++;
            spotTries++;
            if (missedItems.indexOf(cur.word) === -1) missedItems.push(cur.word);
            if (F().wiggleWrong) F().wiggleWrong(spot, 'Find the "' + cur.word + '"!');
            if (spotTries >= 2) {
              hintsUsed++;
              renderScene();
              if (A().speakSlow) A().speakSlow(cur.word);
            } else if (A().speak) {
              A().speak('Almost! Look for the ' + cur.word + '!');
            }
          }
        };
      });

      if (A().speak) A().speak(cur.speak);
    }

    function runBirthdayQuestions() {
      var qRounds = (clue.questions || []).map(function (q) {
        return {
          id: q.id,
          speaker: 'Captain Flint',
          promptIcon: q.promptIcon || '🎂',
          promptImg: q.promptImg || 'art/flat/o_cake.webp',
          promptText: q.promptText,
          speakText: q.speakText,
          lineId: q.lineId,
          hint: q.hint,
          correct: q.correct,
          options: q.options
        };
      });
      root.Ch1Minigames.listenTap(container, clue, { rounds: qRounds }, function (res) {
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

    renderScene();
  };
})(typeof window !== 'undefined' ? window : this);
