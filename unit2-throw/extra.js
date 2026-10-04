/* ==========================================================================
   ALLEY FLING: CATS VS DOGS - EXTRA QUESTION ENGINE & CURRICULUM BANKS
   Unit 2 Practice Engine for Grade 3 & Grade 4 (A1 Level)
   Extracts and generates 7 distinct pedagogical task types:
   1. listen: Listen & choose (Reward: Fish / Bone throw)
   2. word_pic: Word to picture / picture to word (Reward: Quick throw)
   3. builder: Sentence builder with draggable/clickable tiles (Reward: Big throw)
   4. spelling: Spelling builder with blank blanks and letter tiles (Reward: Curve throw)
   5. speaking: Speak it! oral prompt with teacher check (Reward: Rainbow throw)
   6. grammar: Sentence grammar & True/False (Reward: Shield-breaker throw)
   7. reading: Reading mini-passage & question (Reward: Quick throw)
   ========================================================================== */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.EXTRA_ENGINE = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  // Helper shuffle
  function shuffleArr(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Helper pick N unique random elements excluding a target
  function pickDistractors(pool, target, count) {
    var uniquePool = [];
    pool.forEach(function (x) {
      if (x !== target && uniquePool.indexOf(x) === -1) {
        uniquePool.push(x);
      }
    });
    var shuffled = shuffleArr(uniquePool);
    return shuffled.slice(0, count);
  }

  // Distractor uppercase letters for spelling
  var ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Builds question banks from ARC and BQ
  function compileBanks(ARC_DATA, BQ_DATA) {
    var banks = {
      '3': {
        listen: [],
        word_pic: [],
        builder: [],
        spelling: [],
        speaking: [],
        grammar: [],
        reading: []
      },
      '4': {
        listen: [],
        word_pic: [],
        builder: [],
        spelling: [],
        speaking: [],
        grammar: [],
        reading: []
      }
    };

    ['3', '4'].forEach(function (grade) {
      var arcWords = (ARC_DATA && ARC_DATA[grade] && ARC_DATA[grade].words) ? ARC_DATA[grade].words : [];
      var arcBuilders = (ARC_DATA && ARC_DATA[grade] && ARC_DATA[grade].builders) ? ARC_DATA[grade].builders : [];
      var bqUnit2 = (BQ_DATA && BQ_DATA[grade] && BQ_DATA[grade]['2']) ? BQ_DATA[grade]['2'] : [];

      var allWordStrings = arcWords.map(function (w) { return w.w; });
      var allEmojis = arcWords.map(function (w) { return w.e; });

      // ----------------------------------------------------
      // 1. LISTEN & CHOOSE (Reward: normal / Fish / Bone)
      // ----------------------------------------------------
      // From BQ Listening
      bqUnit2.forEach(function (item, idx) {
        if (item.s === 'Listening' && item.say && item.o && item.a) {
          banks[grade].listen.push({
            id: 'listen_bq_' + grade + '_' + idx,
            type: 'listen',
            skill: 'Listening',
            reward: 'normal',
            level: 1,
            q: item.q,
            say: item.say,
            options: item.o.slice(),
            a: item.a,
            pic: item.pic || '',
            hint: 'Listen closely and choose the matching answer.'
          });
        }
      });

      // From ARC words (Listen and pick the word)
      arcWords.forEach(function (wObj, idx) {
        var distractors = pickDistractors(allWordStrings, wObj.w, 3);
        var opts = shuffleArr([wObj.w].concat(distractors));
        banks[grade].listen.push({
          id: 'listen_arc_' + grade + '_' + idx,
          type: 'listen',
          skill: 'Listening',
          reward: 'normal',
          level: 1,
          q: 'Listen to the word. Which word did you hear?',
          say: wObj.w,
          options: opts,
          a: wObj.w,
          pic: wObj.e,
          hint: 'Listen to the word: ' + wObj.w
        });
      });

      // ----------------------------------------------------
      // 2. WORD TO PICTURE / PICTURE TO WORD (Reward: quick)
      // ----------------------------------------------------
      arcWords.forEach(function (wObj, idx) {
        // Word -> Picture (emojis)
        var emojiDistractors = pickDistractors(allEmojis, wObj.e, 3);
        var emojiOpts = shuffleArr([wObj.e].concat(emojiDistractors));
        banks[grade].word_pic.push({
          id: 'word2pic_' + grade + '_' + idx,
          type: 'word_pic',
          skill: 'Words',
          reward: 'quick',
          level: 1,
          q: 'Which picture shows: ' + wObj.w.toUpperCase() + '?',
          say: wObj.w,
          options: emojiOpts,
          a: wObj.e,
          pic: '',
          def: wObj.d,
          hint: wObj.w + ': ' + wObj.d
        });

        // Picture + Def -> Word
        var wordDistractors = pickDistractors(allWordStrings, wObj.w, 3);
        var wordOpts = shuffleArr([wObj.w].concat(wordDistractors));
        banks[grade].word_pic.push({
          id: 'pic2word_' + grade + '_' + idx,
          type: 'word_pic',
          skill: 'Words',
          reward: 'quick',
          level: 1,
          q: 'Look at the picture and meaning. Which word is it?',
          say: wObj.w,
          options: wordOpts,
          a: wObj.w,
          pic: wObj.e,
          def: wObj.d,
          hint: 'This word means: ' + wObj.d
        });
      });

      // Also BQ Words items
      bqUnit2.forEach(function (item, idx) {
        if (item.s === 'Words' && item.o && item.a) {
          banks[grade].word_pic.push({
            id: 'words_bq_' + grade + '_' + idx,
            type: 'word_pic',
            skill: 'Words',
            reward: 'quick',
            level: 1,
            q: item.q,
            say: item.a,
            options: item.o.slice(),
            a: item.a,
            pic: item.pic || '📖',
            hint: 'Choose the correct vocabulary word.'
          });
        }
      });

      // ----------------------------------------------------
      // 3. SENTENCE BUILDER (Reward: big)
      // ----------------------------------------------------
      arcBuilders.forEach(function (bObj, idx) {
        if (bObj.order && bObj.order.length >= 3 && bObj.answer) {
          var shuffledTokens = shuffleArr(bObj.order);
          // ensure shuffled isn't accidentally identical to the answer order
          if (shuffledTokens.join(' ') === bObj.order.join(' ') && shuffledTokens.length > 2) {
            shuffledTokens.reverse();
          }
          banks[grade].builder.push({
            id: 'builder_arc_' + grade + '_' + idx,
            type: 'builder',
            skill: 'Sentences',
            reward: 'big',
            level: 2,
            q: 'Tap the words in the correct order to make the sentence:',
            tokens: shuffledTokens,
            targetOrder: bObj.order.slice(),
            a: bObj.answer,
            say: bObj.answer,
            pic: '🧩',
            hint: 'Starts with: "' + bObj.order[0] + '"'
          });
        }
      });

      // ----------------------------------------------------
      // 4. SPELLING BUILDER (Reward: curve)
      // ----------------------------------------------------
      arcWords.forEach(function (wObj, idx) {
        // filter out multi-word phrases for spelling clarity (like "space suit", "author's purpose")
        var cleanWord = wObj.w.replace(/[^a-zA-Z]/g, '').toUpperCase();
        if (cleanWord.length >= 3 && cleanWord.length <= 10) {
          var targetLetters = cleanWord.split('');
          var unused = ALPHABET.filter(function (ch) { return targetLetters.indexOf(ch) === -1; });
          var extraLetters = shuffleArr(unused).slice(0, 3);
          var allLetters = shuffleArr(targetLetters.concat(extraLetters));

          banks[grade].spelling.push({
            id: 'spelling_arc_' + grade + '_' + idx,
            type: 'spelling',
            skill: 'Spelling',
            reward: 'curve',
            level: 2,
            q: 'Spell the word for ' + wObj.e + ' (' + wObj.d + '):',
            targetWord: cleanWord,
            displayWord: wObj.w,
            pic: wObj.e,
            def: wObj.d,
            letters: allLetters,
            a: cleanWord,
            say: wObj.w,
            hint: 'The word is "' + wObj.w + '" (' + cleanWord.length + ' letters)'
          });
        }
      });

      // ----------------------------------------------------
      // 5. SPEAK IT! (Reward: rainbow)
      // ----------------------------------------------------
      arcWords.forEach(function (wObj, idx) {
        banks[grade].speaking.push({
          id: 'speaking_arc_' + grade + '_' + idx,
          type: 'speaking',
          skill: 'Speaking',
          reward: 'rainbow',
          level: 2,
          q: 'Say a full English sentence with the word "' + wObj.w + '"!',
          word: wObj.w,
          pic: wObj.e,
          def: wObj.d,
          modelSentence: wObj.x,
          say: wObj.x,
          a: wObj.w,
          hint: 'Example: "' + wObj.x + '"'
        });
      });

      // ----------------------------------------------------
      // 6. GRAMMAR & WHICH IS CORRECT (Reward: shield_breaker)
      // ----------------------------------------------------
      bqUnit2.forEach(function (item, idx) {
        if ((item.s === 'Sentences' || item.s === 'Sounds') && item.o && item.a) {
          banks[grade].grammar.push({
            id: 'grammar_bq_' + grade + '_' + idx,
            type: 'grammar',
            skill: 'Grammar',
            reward: 'shield_breaker',
            level: 2,
            q: item.q,
            say: item.a,
            options: item.o.slice(),
            a: item.a,
            pic: item.pic || '⚡',
            hint: 'Grammar rule: check singular/plural and verb form.'
          });
        }
      });

      // ----------------------------------------------------
      // 7. READING MINI-QUESTION (Reward: quick / normal)
      // ----------------------------------------------------
      bqUnit2.forEach(function (item, idx) {
        if (item.s === 'Reading' && item.o && item.a) {
          banks[grade].reading.push({
            id: 'reading_bq_' + grade + '_' + idx,
            type: 'reading',
            skill: 'Reading',
            reward: 'quick',
            level: 3,
            q: item.q,
            say: item.a,
            options: item.o.slice(),
            a: item.a,
            passage: item.pass || '',
            pic: item.pic || '📚',
            hint: 'Read the question carefully and find the fact.'
          });
        }
      });

    });

    return banks;
  }

  // Validation function that checks all questions in all banks
  function validateBanks(banks) {
    var report = { valid: true, counts: {}, errors: [] };

    ['3', '4'].forEach(function (grade) {
      report.counts[grade] = {};
      var gradeBanks = banks[grade];
      if (!gradeBanks) {
        report.valid = false;
        report.errors.push('Missing grade ' + grade);
        return;
      }

      Object.keys(gradeBanks).forEach(function (type) {
        var list = gradeBanks[type];
        report.counts[grade][type] = list.length;
        if (list.length === 0) {
          report.valid = false;
          report.errors.push('Grade ' + grade + ' type ' + type + ' has 0 tasks');
        }

        list.forEach(function (task, idx) {
          var prefix = 'Grade ' + grade + ' [' + type + ' #' + idx + ' ' + task.id + ']: ';

          if (!task.q || typeof task.q !== 'string' || task.q.trim() === '') {
            report.valid = false;
            report.errors.push(prefix + 'empty question text');
          }

          if (!task.skill) {
            report.valid = false;
            report.errors.push(prefix + 'missing skill');
          }

          if (!task.reward) {
            report.valid = false;
            report.errors.push(prefix + 'missing reward type');
          }

          // Type-specific validations
          if (type === 'builder') {
            if (!Array.isArray(task.tokens) || task.tokens.length < 2) {
              report.valid = false;
              report.errors.push(prefix + 'invalid builder tokens');
            }
            if (!task.a || typeof task.a !== 'string') {
              report.valid = false;
              report.errors.push(prefix + 'invalid builder answer string');
            }
            if (!Array.isArray(task.targetOrder) || task.targetOrder.length < 2) {
              report.valid = false;
              report.errors.push(prefix + 'missing targetOrder');
            }
          } else if (type === 'spelling') {
            if (!task.targetWord || typeof task.targetWord !== 'string') {
              report.valid = false;
              report.errors.push(prefix + 'missing targetWord');
            }
            if (!Array.isArray(task.letters)) {
              report.valid = false;
              report.errors.push(prefix + 'missing letters array');
            } else {
              // Ensure all letters of target word are present in letters array
              var wordChars = task.targetWord.split('');
              var available = task.letters.slice();
              wordChars.forEach(function (c) {
                var foundIdx = available.indexOf(c);
                if (foundIdx === -1) {
                  report.valid = false;
                  report.errors.push(prefix + 'letter ' + c + ' missing from letter pool');
                } else {
                  available.splice(foundIdx, 1);
                }
              });
            }
          } else if (type === 'speaking') {
            if (!task.word || !task.modelSentence) {
              report.valid = false;
              report.errors.push(prefix + 'missing word or modelSentence');
            }
          } else {
            // Multiple choice tasks (listen, word_pic, grammar, reading)
            if (!Array.isArray(task.options) || task.options.length < 2) {
              report.valid = false;
              report.errors.push(prefix + 'options must have at least 2 items');
            } else {
              // check duplicates
              var seen = {};
              task.options.forEach(function (opt) {
                if (seen[opt]) {
                  report.valid = false;
                  report.errors.push(prefix + 'duplicate option: "' + opt + '"');
                }
                seen[opt] = true;
              });
              // check correct answer presence
              if (task.options.indexOf(task.a) === -1) {
                report.valid = false;
                report.errors.push(prefix + 'answer "' + task.a + '" not found in options');
              }
            }
          }
        });
      });
    });

    return report;
  }

  // Mastery Tracker Singleton / Class
  function createMasteryTracker() {
    var tracker = {
      skills: {
        'Listening': { firstTry: 0, secondTry: 0, missed: 0, total: 0 },
        'Words': { firstTry: 0, secondTry: 0, missed: 0, total: 0 },
        'Sentences': { firstTry: 0, secondTry: 0, missed: 0, total: 0 },
        'Spelling': { firstTry: 0, secondTry: 0, missed: 0, total: 0 },
        'Speaking': { firstTry: 0, secondTry: 0, missed: 0, total: 0 },
        'Grammar': { firstTry: 0, secondTry: 0, missed: 0, total: 0 },
        'Reading': { firstTry: 0, secondTry: 0, missed: 0, total: 0 }
      },
      words: {}, // key: word string -> { word, firstTry, secondTry, missed, sentence, emoji }
      history: []
    };

    tracker.recordAttempt = function (task, result, isFirstTry) {
      var skill = task.skill || 'Words';
      if (!tracker.skills[skill]) {
        tracker.skills[skill] = { firstTry: 0, secondTry: 0, missed: 0, total: 0 };
      }
      tracker.skills[skill].total++;

      var wordKey = task.word || task.targetWord || task.a || '';
      var isVocabTask = (task.type === 'word_pic' || task.type === 'spelling' || task.type === 'speaking' || !!task.word);
      if (isVocabTask && typeof wordKey === 'string' && /^[A-Za-z][A-Za-z'\-]*$/.test(wordKey)) {
        if (!tracker.words[wordKey]) {
          tracker.words[wordKey] = {
            word: wordKey,
            firstTry: 0,
            secondTry: 0,
            missed: 0,
            sentence: task.sentence || task.modelSentence || task.hint || '',
            emoji: task.pic || '📖'
          };
        }
      }

      if (result === 'correct') {
        if (isFirstTry) {
          tracker.skills[skill].firstTry++;
          if (tracker.words[wordKey]) tracker.words[wordKey].firstTry++;
        } else {
          tracker.skills[skill].secondTry++;
          if (tracker.words[wordKey]) tracker.words[wordKey].secondTry++;
        }
      } else {
        tracker.skills[skill].missed++;
        if (tracker.words[wordKey]) tracker.words[wordKey].missed++;
      }

      tracker.history.push({
        taskId: task.id,
        skill: skill,
        word: wordKey,
        result: result,
        isFirstTry: isFirstTry
      });
    };

    tracker.getSkillReport = function () {
      var report = [];
      Object.keys(tracker.skills).forEach(function (sk) {
        var sData = tracker.skills[sk];
        var pct = sData.total > 0 ? Math.round((sData.firstTry / sData.total) * 100) : 0;
        report.push({
          skill: sk,
          firstTry: sData.firstTry,
          secondTry: sData.secondTry,
          missed: sData.missed,
          total: sData.total,
          percent: pct
        });
      });
      return report;
    };

    tracker.getWordsToPractise = function (limit) {
      limit = limit || 6;
      var arr = Object.values(tracker.words);
      // Sort by missed descending, then by fewest firstTry
      arr.sort(function (a, b) {
        if (b.missed !== a.missed) return b.missed - a.missed;
        return a.firstTry - b.firstTry;
      });
      var needPractice = arr.filter(function (w) { return w.missed > 0 || (w.firstTry === 0 && w.secondTry > 0); });
      return needPractice.slice(0, limit);
    };

    tracker.getBestSkill = function () {
      var best = null;
      var maxPct = -1;
      Object.keys(tracker.skills).forEach(function (sk) {
        var sData = tracker.skills[sk];
        if (sData.total > 0) {
          var pct = (sData.firstTry / sData.total) * 100;
          if (pct > maxPct) {
            maxPct = pct;
            best = sk;
          }
        }
      });
      return best || 'English';
    };

    return tracker;
  }

  // Task Selector with Difficulty Ramp & Anti-Repeat
  function createTaskSelector(banks, grade) {
    var usedIds = {};
    var turnCounter = 0;

    return {
      getNextTask: function (level, enabledTypes) {
        turnCounter++;
        var gradeBanks = banks[grade] || banks['3'];
        enabledTypes = enabledTypes || ['listen', 'word_pic', 'builder', 'spelling', 'speaking', 'grammar', 'reading'];

        // Speaking task appears roughly once every 5 turns if enabled
        var targetType = null;
        if (turnCounter % 5 === 0 && enabledTypes.indexOf('speaking') !== -1) {
          targetType = 'speaking';
        } else {
          // Filter candidate types matching level
          var candidates = enabledTypes.filter(function (t) {
            if (level === 1) return t === 'listen' || t === 'word_pic';
            if (level === 2) return t === 'builder' || t === 'spelling' || t === 'grammar' || t === 'word_pic';
            return true; // level 3: all types
          });
          if (candidates.length === 0) candidates = enabledTypes;
          targetType = candidates[Math.floor(Math.random() * candidates.length)];
        }

        var pool = gradeBanks[targetType] || [];
        var unused = pool.filter(function (task) { return !usedIds[task.id]; });

        // If unused pool is empty, reset used for this type
        if (unused.length === 0 && pool.length > 0) {
          pool.forEach(function (t) { delete usedIds[t.id]; });
          unused = pool;
        }

        if (unused.length === 0) {
          // Fallback to any task in any available pool
          for (var i = 0; i < enabledTypes.length; i++) {
            var anyPool = gradeBanks[enabledTypes[i]] || [];
            if (anyPool.length > 0) {
              var t = anyPool[Math.floor(Math.random() * anyPool.length)];
              usedIds[t.id] = true;
              return t;
            }
          }
          return null;
        }

        var selected = unused[Math.floor(Math.random() * unused.length)];
        usedIds[selected.id] = true;
        return selected;
      },
      reset: function () {
        usedIds = {};
        turnCounter = 0;
      }
    };
  }

  return {
    compileBanks: compileBanks,
    validateBanks: validateBanks,
    createMasteryTracker: createMasteryTracker,
    createTaskSelector: createTaskSelector
  };
});
