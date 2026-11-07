/* ═══════════════════════════════════════════════════════════════
   Treasure Island — Mini-Game Engine: wordOrder.js
   Used by: Star Mode across Clues 1–5 (both Grade 3 and Grade 4).
   Students tap word tiles in order to build the target sentence, OR
   tap "🎤 Say It Aloud!" to speak the sentence into the microphone!
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

  root.Ch1Minigames.wordOrder = function (container, clue, opts, onComplete) {
    opts = opts || {};
    var tasks = (opts.tasks || clue.starTasks || []).slice();
    if (!tasks.length && clue.rounds) {
      tasks = clue.rounds.slice(0, 2).map(function (r, idx) {
        var sent = (r.correct && r.correct.text) || 'Yes, you can.';
        return {
          id: 'auto_star_' + idx,
          promptIcon: r.promptIcon || '⭐',
          promptImg: r.promptImg || (r.correct && r.correct.img) || 'art/flat/o_map_stamp.webp',
          promptText: r.promptText,
          speakText: sent,
          targetSentence: sent,
          words: sent.split(/\s+/),
          distractors: [],
          allowSpeak: true,
          hint: r.hint || sent
        };
      });
    }

    var idx = 0;
    var totalTries = 0;
    var hintsUsed = 0;
    var missedItems = [];
    var startTime = Date.now();
    var A = function () { return root.Ch1Audio || {}; };
    var F = function () { return root.Ch1Feedback || {}; };

    function renderTask() {
      if (idx >= tasks.length) {
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

      var t = tasks[idx];
      var expected = (t.words || []).slice();
      var pool = shuffle(expected.concat(t.distractors || []));
      var built = [];
      var taskTries = 0;
      var locked = false;

      function draw() {
        var nextWord = expected[built.length];
        container.innerHTML =
          '<div class="ch1-mg-wrap ch1-mg-wordorder">' +
            '<div class="ch1-mg-toprow">' +
              '<div class="ch1-star-pill">⭐ STAR CHALLENGE ' + (idx + 1) + ' / ' + tasks.length + '</div>' +
              '<div class="ch1-audio-controls">' +
                '<button type="button" class="ch1-btn cyan sm" id="ch1-wo-replay" aria-label="Listen to sentence">🔊 Listen</button>' +
                '<button type="button" class="ch1-btn amber sm" id="ch1-wo-slow" aria-label="Listen slowly">🐢 Slowly, please</button>' +
              '</div>' +
            '</div>' +
            '<div class="ch1-prompt-card compact">' +
              (t.promptImg
                ? '<span class="ch1-prompt-pic-wrap"><img class="ch1-card-img" src="' + esc(t.promptImg) + '" alt="" draggable="false"></span>'
                : '<div class="ch1-prompt-icon" aria-hidden="true">' + esc(t.promptIcon || '⭐') + '</div>') +
              '<div class="ch1-prompt-body">' +
                '<div class="ch1-prompt-speaker">' + esc((clue.npc && clue.npc.name) || 'Captain Flint') + '</div>' +
                '<div class="ch1-prompt-text">' + esc(t.promptText) + '</div>' +
              '</div>' +
            '</div>' +
            '<div class="ch1-wo-slots" aria-label="Sentence builder">' +
              expected.map(function (w, wi) {
                var filled = wi < built.length;
                return (
                  '<span class="ch1-wo-slot' + (filled ? ' filled' : (wi === built.length ? ' next' : '')) + '">' +
                    (filled ? esc(built[wi]) : '___') +
                  '</span>'
                );
              }).join(' ') +
            '</div>' +
            '<div class="ch1-wo-bank" role="group" aria-label="Word tiles">' +
              pool.map(function (item, pi) {
                var used = item.__used;
                var isHint = (taskTries >= 2 && !used && item.val === nextWord);
                return (
                  '<button type="button" class="ch1-wo-tile' + (used ? ' used' : '') + (isHint ? ' ch1-hint-glow' : '') + '" ' +
                    'data-pi="' + pi + '" ' + (used ? 'disabled' : '') + ' aria-label="Word: ' + esc(item.val) + '">' +
                    esc(item.val) +
                  '</button>'
                );
              }).join('') +
            '</div>' +
            (t.allowSpeak ? (
              '<div class="ch1-wo-speakrow">' +
                '<button type="button" class="ch1-btn emerald" id="ch1-wo-mic" aria-label="Say it aloud into the microphone">🎤 Or Say It Aloud: "' + esc(t.targetSentence) + '"</button>' +
              '</div>'
            ) : '') +
          '</div>';

        var replayBtn = document.getElementById('ch1-wo-replay');
        var slowBtn = document.getElementById('ch1-wo-slow');
        if (replayBtn) {
          replayBtn.onclick = function () {
            if (A().sfxTap) A().sfxTap();
            if (A().speak) A().speak(t.speakText || t.targetSentence, { lineId: t.lineId });
          };
        }
        if (slowBtn) {
          slowBtn.onclick = function () {
            if (A().sfxTap) A().sfxTap();
            if (F().flintFlap) F().flintFlap();
            if (A().speakSlow) A().speakSlow(t.speakText || t.targetSentence, t.lineId);
          };
        }

        var tiles = container.querySelectorAll('.ch1-wo-tile');
        [].forEach.call(tiles, function (tile) {
          tile.onclick = function () {
            if (locked) return;
            var pi = Number(tile.getAttribute('data-pi'));
            var item = pool[pi];
            if (!item || item.__used) return;
            var want = expected[built.length];
            if (item.val === want) {
              item.__used = true;
              built.push(item.val);
              if (A().sfxTap) A().sfxTap();
              if (A().speak) A().speak(item.val.replace(/[^a-zA-Z0-9']/g, ''));
              if (built.length >= expected.length) {
                finishRound(tile);
              } else {
                draw();
              }
            } else {
              totalTries++;
              taskTries++;
              if (missedItems.indexOf(t.targetSentence) === -1) missedItems.push(t.targetSentence);
              if (F().wiggleWrong) F().wiggleWrong(tile, t.hint || ('Next word: "' + want + '"'));
              if (taskTries >= 2) {
                hintsUsed++;
                draw();
              }
            }
          };
        });

        var micBtn = document.getElementById('ch1-wo-mic');
        if (micBtn) {
          micBtn.onclick = function () {
            if (locked) return;
            if (A().sfxTap) A().sfxTap();
            micBtn.textContent = '🎙️ Listening... Speak clearly!';
            micBtn.disabled = true;
            if (root.IslandAudio && typeof root.IslandAudio.listenForPhrase === 'function') {
              root.IslandAudio.listenForPhrase(t.targetSentence, function (res) {
                if (res && (res.ok || res.score >= 0.45)) {
                  built = expected.slice();
                  finishRound(micBtn);
                } else {
                  micBtn.disabled = false;
                  micBtn.textContent = '🎤 Try Saying Again (or tap the words above!)';
                  if (F().showRightBanner) F().showRightBanner('Good try! Tap the words or press 🎤 again!');
                }
              });
            } else {
              setTimeout(function () {
                built = expected.slice();
                finishRound(micBtn);
              }, 900);
            }
          };
        }
      }

      pool = pool.map(function (w) { return { val: w, __used: false }; });

      function finishRound(refEl) {
        locked = true;
        if (A().sfxCorrect) A().sfxCorrect();
        if (F().sparkleAt) F().sparkleAt(refEl, 14);
        if (F().floatStar) F().floatStar(refEl, '⭐ Star Sentence!');
        if (F().benbowJump) F().benbowJump();
        if (F().showRightBanner) F().showRightBanner(t.targetSentence);
        if (A().speak) {
          A().speak(t.speakText || t.targetSentence, { lineId: t.lineId }, function () {
            setTimeout(function () {
              idx++;
              renderTask();
            }, 260);
          });
        } else {
          setTimeout(function () { idx++; renderTask(); }, 550);
        }
      }

      draw();
      if (A().speak) {
        A().speak(t.speakText || t.targetSentence, { lineId: t.lineId });
      }
    }

    renderTask();
  };
})(typeof window !== 'undefined' ? window : this);
