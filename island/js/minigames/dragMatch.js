/* ═══════════════════════════════════════════════════════════════
   Treasure Island — Mini-Game Engine: dragMatch.js
   Used by: G3 Clue 2 Star (People & Places), G3 Clue 5 (National Days + Review),
            and G4 Clue 2 (Harbour Crates Polite Requests).
   Supports both pointer drag-and-drop AND tap-to-select + tap-to-drop
   with full `.webp` artwork on every token and target slot.
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
      return '<span class="' + (cls || 'ch1-dm-pic-wrap') + '">' +
        '<img class="ch1-card-img" src="' + esc(img) + '" alt="" draggable="false" onerror="this.style.display=\'none\'">' +
      '</span>';
    }
    return '<span class="ch1-dm-icon" aria-hidden="true">' + esc(icon || '📦') + '</span>';
  }

  // Before a match: the pair's question (if it has one) so the answer is not given away; after: the full sentence
  function cueText(p) { return p.ask || p.prompt; }
  function cueSpeak(p) { return p.askSpeak || p.ask || p.speak || p.prompt; }

  root.Ch1Minigames.dragMatch = function (container, clue, opts, onComplete) {
    opts = opts || {};
    var pairs = (opts.pairs || clue.pairs || clue.starPairs || []).slice();
    var totalTries = 0;
    var hintsUsed = 0;
    var missedItems = [];
    var matchedIds = {};
    var selectedLeftId = null;
    var activeIdx = 0;
    var startTime = Date.now();
    var A = function () { return root.Ch1Audio || {}; };
    var F = function () { return root.Ch1Feedback || {}; };

    var rightPool = shuffle(pairs);

    function currentPair() {
      for (var i = 0; i < pairs.length; i++) {
        var p = pairs[(activeIdx + i) % pairs.length];
        if (!matchedIds[p.id]) return p;
      }
      return null;
    }

    function render() {
      var cur = currentPair();
      if (!cur) {
        if (clue.reviewRounds && clue.reviewRounds.length && !opts.skipReview) {
          if (F().showRightBanner) F().showRightBanner('All matched! Now complete the 4 Harbour Review Questions!');
          setTimeout(function () {
            root.Ch1Minigames.listenTap(container, clue, { rounds: clue.reviewRounds }, function (revRes) {
              var totTries = totalTries + (revRes.tries || 0);
              var totHints = hintsUsed + (revRes.hintsUsed || 0);
              var allMissed = missedItems.concat(revRes.missedItems || []);
              onComplete({
                correct: true,
                tries: totTries,
                hintsUsed: totHints,
                timeMs: Date.now() - startTime,
                stars: calcStars(totTries, totHints),
                missedItems: allMissed
              });
            });
          }, 420);
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

      if (!selectedLeftId || matchedIds[selectedLeftId]) {
        selectedLeftId = cur.id;
      }
      var selPair = pairs.filter(function (p) { return p.id === selectedLeftId; })[0] || cur;

      container.innerHTML =
        '<div class="ch1-mg-wrap ch1-mg-dragmatch">' +
          '<div class="ch1-mg-toprow">' +
            '<div class="ch1-dm-instruction">👆 Tap or drag an item on the left to its match on the right!</div>' +
            '<div class="ch1-audio-controls">' +
              '<button type="button" class="ch1-btn cyan sm" id="ch1-dm-replay" aria-label="Say that again, please">' + esc(clue.replayLabel || '🔊 Listen') + '</button>' +
              '<button type="button" class="ch1-btn amber sm" id="ch1-dm-slow" aria-label="Slowly, please">' + esc(clue.slowLabel || '🐢 Slowly, please') + '</button>' +
            '</div>' +
          '</div>' +
          '<div class="ch1-prompt-card compact">' +
            renderVisual(selPair.leftImg, selPair.leftIcon || '📦', 'ch1-prompt-pic-wrap') +
            '<div class="ch1-prompt-body">' +
              '<div class="ch1-prompt-speaker">' + esc((clue.npc && clue.npc.name) || 'Jim Hawkins') + '</div>' +
              '<div class="ch1-prompt-text">' + esc(cueText(selPair)) + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="ch1-dm-board">' +
            '<div class="ch1-dm-col ch1-dm-left" role="group" aria-label="Items to match">' +
              pairs.map(function (p) {
                var done = !!matchedIds[p.id];
                var sel = (!done && p.id === selectedLeftId);
                return (
                  '<button type="button" class="ch1-dm-token' + (done ? ' matched' : '') + (sel ? ' selected' : '') + '" ' +
                    'draggable="' + (!done) + '" data-id="' + esc(p.id) + '" ' + (done ? 'disabled' : '') + ' aria-label="' + esc(p.leftLabel) + '">' +
                    renderVisual(p.leftImg, p.leftIcon, 'ch1-dm-pic-wrap') +
                    '<span class="ch1-dm-text">' + esc(p.leftLabel) + '</span>' +
                    (done ? '<span class="ch1-dm-check">✓</span>' : '') +
                  '</button>'
                );
              }).join('') +
            '</div>' +
            '<div class="ch1-dm-col ch1-dm-right" role="group" aria-label="Matching targets">' +
              rightPool.map(function (p) {
                var done = !!matchedIds[p.id];
                return (
                  '<button type="button" class="ch1-dm-slot' + (done ? ' matched' : '') + '" ' +
                    'data-target-id="' + esc(p.id) + '" ' + (done ? 'disabled' : '') + ' aria-label="' + esc(p.rightLabel) + '">' +
                    renderVisual(p.rightImg, p.rightIcon, 'ch1-dm-pic-wrap') +
                    '<span class="ch1-dm-text">' + esc(p.rightLabel) + '</span>' +
                    '<span class="ch1-opt-ear" data-speak="' + esc(p.ask ? p.rightLabel : (p.speak || p.rightLabel)) + '" role="button" tabindex="0" aria-label="Hear: ' + esc(p.rightLabel) + '">🔊</span>' +
                  '</button>'
                );
              }).join('') +
            '</div>' +
          '</div>' +
        '</div>';

      var replayBtn = document.getElementById('ch1-dm-replay');
      var slowBtn = document.getElementById('ch1-dm-slow');
      if (replayBtn) {
        replayBtn.onclick = function () {
          if (A().sfxTap) A().sfxTap();
          if (A().speak) A().speak(cueSpeak(selPair));
        };
      }
      if (slowBtn) {
        slowBtn.onclick = function () {
          if (A().sfxTap) A().sfxTap();
          if (F().flintFlap) F().flintFlap();
          if (A().speakSlow) A().speakSlow(cueSpeak(selPair));
        };
      }

      var tokens = container.querySelectorAll('.ch1-dm-token');
      [].forEach.call(tokens, function (tok) {
        var pid = tok.getAttribute('data-id');
        tok.onclick = function () {
          if (matchedIds[pid]) return;
          if (A().sfxTap) A().sfxTap();
          selectedLeftId = pid;
          var pObj = pairs.filter(function (x) { return x.id === pid; })[0];
          if (pObj && A().speak) A().speak(pObj.ask ? cueSpeak(pObj) : (pObj.speak || pObj.leftLabel));
          render();
        };
        tok.ondragstart = function (ev) {
          selectedLeftId = pid;
          if (ev.dataTransfer) ev.dataTransfer.setData('text/plain', pid);
        };
      });

      var slots = container.querySelectorAll('.ch1-dm-slot');
      var slotTries = 0;
      [].forEach.call(slots, function (slot) {
        var tid = slot.getAttribute('data-target-id');
        var ear = slot.querySelector('.ch1-opt-ear');
        if (ear) {
          ear.onclick = function (ev) {
            ev.stopPropagation();
            if (A().sfxTap) A().sfxTap();
            if (A().speak) A().speak(ear.getAttribute('data-speak'));
          };
        }
        slot.ondragover = function (ev) { ev.preventDefault(); slot.classList.add('dragover'); };
        slot.ondragleave = function () { slot.classList.remove('dragover'); };
        slot.ondrop = function (ev) {
          ev.preventDefault();
          slot.classList.remove('dragover');
          var droppedId = (ev.dataTransfer && ev.dataTransfer.getData('text/plain')) || selectedLeftId;
          attemptMatch(droppedId, tid, slot);
        };
        slot.onclick = function () {
          if (matchedIds[tid] || !selectedLeftId) return;
          attemptMatch(selectedLeftId, tid, slot);
        };
      });

      function attemptMatch(fromId, targetId, slotEl) {
        if (!fromId || matchedIds[targetId]) return;
        var pairObj = pairs.filter(function (p) { return p.id === fromId; })[0];
        if (fromId === targetId) {
          matchedIds[targetId] = true;
          selectedLeftId = null;
          if (A().sfxCorrect) A().sfxCorrect();
          if (F().sparkleAt) F().sparkleAt(slotEl, 12);
          if (F().floatStar) F().floatStar(slotEl, 'Here you are! ⭐');
          if (F().benbowJump) F().benbowJump();
          if (F().showRightBanner) F().showRightBanner(pairObj ? pairObj.rightLabel : 'Matched!');
          if (pairObj && A().speak) {
            A().speak(pairObj.speak || pairObj.rightLabel, function () {
              setTimeout(render, 220);
            });
          } else {
            setTimeout(render, 420);
          }
        } else {
          totalTries++;
          slotTries = (slotTries || 0) + 1;
          if (pairObj && missedItems.indexOf(pairObj.rightLabel) === -1) {
            missedItems.push(pairObj.rightLabel);
          }
          if (F().wiggleWrong) {
            F().wiggleWrong(slotEl, pairObj && slotTries >= 2 ? ('Match "' + pairObj.leftLabel + '" with "' + pairObj.rightLabel + '"!') : 'Try another match!');
          }
          if (slotTries >= 2) {
            hintsUsed++;
            var rightSlot = container.querySelector('.ch1-dm-slot[data-target-id="' + fromId + '"]');
            if (rightSlot) rightSlot.classList.add('ch1-hint-glow');
            if (pairObj && A().speakSlow) A().speakSlow(pairObj.speak || pairObj.prompt);
          } else if (A().speak) {
            A().speak('Almost! Try again!');
          }
        }
      }
    }

    var firstP = currentPair();
    render();
    if (firstP && A().speak) {
      A().speak(cueSpeak(firstP));
    }
  };
})(typeof window !== 'undefined' ? window : this);
