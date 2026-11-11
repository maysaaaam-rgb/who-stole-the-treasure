/**
 * Grade 3 • Unit 5 Lesson 2: "Time Capsule Mission"
 * Interactive Classroom Smartboard Controller (5 Activities + Timer + Certificate)
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'eaa_g3_time_capsule_v1';
  var D = window.TC_DATA;
  var A = window.TCAudio;

  var state = {
    view: 'home', // 'home' | 'a1'..'a5' | 'cert'
    stars: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    teams: { v1: 0, v2: 0, earth: 0, time: 0 },
    activeTeam: 'v1',
    timerSec: 0,
    timerPaused: false,
    timerInterval: null,
    // Activity runtime state
    a1: { step: 1, packed: {}, gap1: '', gap2: '', author: 'Class 3 Explorers', mistakes: 0 },
    a2: { found: {}, startCell: null, mistakes: 0 },
    a3: { idx: 0, built: [], pool: [], mistakes: 0 },
    a4: { idx: 0, mistakes: 0, locked: false },
    a5: { matched: {}, selectedLeft: null, rightOrder: [], mistakes: 0 }
  };

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var p = JSON.parse(raw);
        if (p && p.stars) {
          for (var i = 1; i <= 5; i++) state.stars[i] = Number(p.stars[i]) || 0;
        }
        if (p && p.teams) {
          D.teams.forEach(function (t) { state.teams[t.id] = Number(p.teams[t.id]) || 0; });
        }
      }
    } catch (e) {}
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        stars: state.stars,
        teams: state.teams
      }));
    } catch (e) {}
  }

  function totalStars() {
    var s = 0;
    for (var i = 1; i <= 5; i++) s += (Number(state.stars[i]) || 0);
    return s;
  }

  function starsStr(n) {
    var out = '';
    for (var i = 1; i <= 3; i++) out += i <= n ? '⭐' : '☆';
    return out;
  }

  function imgWithFallback(src, alt, emoji) {
    var safeAlt = (alt || '').replace(/"/g, '&quot;');
    return (
      '<img src="' + src + '" alt="' + safeAlt + '" ' +
      'onerror="this.style.display=\'none\';if(this.nextElementSibling)this.nextElementSibling.style.display=\'flex\';" />' +
      '<span style="display:none;align-items:center;justify-content:center;font-size:2.8rem;">' + (emoji || '🚀') + '</span>'
    );
  }

  function setSpeech(text, speakAloud) {
    var el = document.getElementById('tc-mascot-speech');
    if (el) el.textContent = text || '';
    if (speakAloud !== false && A) A.speak(text);
  }

  function awardTeamXP(pts) {
    var tid = state.activeTeam || 'v1';
    state.teams[tid] = (Number(state.teams[tid]) || 0) + pts;
    saveState();
    renderHeader();
    try {
      if (window.AdventureAcademy && typeof window.AdventureAcademy.awardXP === 'function') {
        window.AdventureAcademy.awardXP(pts, 'Time Capsule Mission');
      }
    } catch (e) {}
  }

  // =========================================================================
  // COUNTDOWN TIMER
  // =========================================================================
  function startActivityTimer(minutes) {
    stopActivityTimer();
    state.timerSec = (Number(minutes) || 6) * 60;
    state.timerPaused = false;
    updateTimerDisplay();
    state.timerInterval = setInterval(function () {
      if (!state.timerPaused && state.timerSec > 0) {
        state.timerSec--;
        updateTimerDisplay();
      }
    }, 1000);
  }

  function stopActivityTimer() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
  }

  function updateTimerDisplay() {
    var pill = document.getElementById('tc-timer-pill');
    if (!pill) return;
    if (state.view === 'home' || state.view === 'cert') {
      pill.style.display = 'none';
      return;
    }
    pill.style.display = 'inline-flex';
    var m = Math.floor(state.timerSec / 60);
    var s = state.timerSec % 60;
    pill.innerHTML = '⏱ ' + m + ':' + (s < 10 ? '0' + s : s) + ' ' + (state.timerPaused ? '▶️ Resume' : '⏸ Pause');
  }

  // =========================================================================
  // HEADER & HOME SCREEN
  // =========================================================================
  function renderHeader() {
    var strip = document.getElementById('tc-team-strip');
    if (strip) {
      strip.innerHTML = D.teams.map(function (t) {
        var act = state.activeTeam === t.id ? ' active' : '';
        var sc = Number(state.teams[t.id]) || 0;
        return (
          '<button type="button" class="tc-team-pill' + act + '" data-team="' + t.id + '">' +
            '<span>' + t.emoji + ' ' + t.name + '</span>' +
            '<span class="tc-team-score">' + sc + '</span>' +
          '</button>'
        );
      }).join('');

      Array.prototype.forEach.call(strip.querySelectorAll('.tc-team-pill'), function (btn) {
        btn.addEventListener('click', function () {
          var tid = btn.getAttribute('data-team');
          if (state.activeTeam === tid) {
            state.teams[tid] = (Number(state.teams[tid]) || 0) + 10;
            if (A) A.playCorrect();
            saveState();
          } else {
            state.activeTeam = tid;
          }
          renderHeader();
        });
      });
    }

    var starEl = document.getElementById('tc-total-stars');
    if (starEl) starEl.textContent = '⭐ ' + totalStars() + ' / 15';

    var homeBtn = document.getElementById('tc-btn-home');
    if (homeBtn) homeBtn.style.display = state.view === 'home' ? 'none' : 'inline-flex';

    updateTimerDisplay();
  }

  function openHome() {
    state.view = 'home';
    stopActivityTimer();
    renderHeader();
    setSpeech('Welcome to the Time Capsule Mission! Open the shiny Time Capsule and complete all 5 missions to send your message to the future!', false);

    var stage = document.getElementById('tc-stage');
    if (!stage) return;

    var cardsHtml = D.activities.map(function (a) {
      var st = Number(state.stars[a.id]) || 0;
      return (
        '<div class="tc-act-card' + (st > 0 ? ' completed' : '') + '" data-act="' + a.id + '" role="button" tabindex="0">' +
          '<div class="tc-act-art">' +
            '<span class="tc-act-badge">' + a.num + ' • ⏱ ' + a.minutes + ' min</span>' +
            '<span class="tc-act-stars">' + starsStr(st) + '</span>' +
            imgWithFallback(a.img, a.title, a.emoji) +
          '</div>' +
          '<div class="tc-act-caption">' +
            '<div class="tc-act-title">' + a.title + '</div>' +
            '<div class="tc-act-sub">' + a.subtitle + '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    cardsHtml += (
      '<div class="tc-act-card" id="tc-card-cert" role="button" tabindex="0" style="border-color:#a855f7;">' +
        '<div class="tc-act-art" style="background:radial-gradient(circle at 50% 40%, rgba(168,85,247,0.35), rgba(15,23,42,0.94));">' +
          '<span class="tc-act-badge" style="background:#a855f7;color:#fff;">🚀 VOYAGER &amp; CERT</span>' +
          '<span class="tc-act-stars">🎬 Space Clip</span>' +
          imgWithFallback('img/scene-voyager-space.webp', 'Voyager Space Capsule', '🛸') +
        '</div>' +
        '<div class="tc-act-caption">' +
          '<div class="tc-act-title" style="color:#e9d5ff;">🎓 Launch Capsule &amp; Certificate</div>' +
          '<div class="tc-act-sub">Watch Voyager 1 &amp; 2 in space and claim your Time Capsule Certificate!</div>' +
        '</div>' +
      '</div>'
    );

    stage.innerHTML = '<div class="tc-home-grid">' + cardsHtml + '</div>';

    Array.prototype.forEach.call(stage.querySelectorAll('[data-act]'), function (card) {
      card.addEventListener('click', function () {
        var aid = Number(card.getAttribute('data-act'));
        startActivity(aid);
      });
    });

    var certCard = document.getElementById('tc-card-cert');
    if (certCard) certCard.onclick = openCertificate;
  }

  function startActivity(aid) {
    state.view = 'a' + aid;
    var meta = D.activities.filter(function (a) { return a.id === aid; })[0];
    if (meta) {
      startActivityTimer(meta.minutes);
      setSpeech(meta.intro, true);
    }
    if (A) A.playSfx('sparkle');
    renderHeader();

    if (aid === 1) initActivity1();
    else if (aid === 2) initActivity2();
    else if (aid === 3) initActivity3();
    else if (aid === 4) initActivity4();
    else if (aid === 5) initActivity5();
  }

  // =========================================================================
  // ACTIVITY 1: TIME CAPSULE MESSAGE (Step 1: Pack 6 Objects -> Step 2: Message)
  // =========================================================================
  function initActivity1() {
    state.a1 = { step: 1, packed: {}, gap1: '', gap2: '', author: 'Class 3 Explorers', mistakes: 0 };
    renderActivity1();
  }

  function renderActivity1() {
    var stage = document.getElementById('tc-stage');
    if (!stage) return;

    var packedCount = Object.keys(state.a1.packed).length;

    if (state.a1.step === 1) {
      var objsHtml = D.capsuleItems.map(function (it) {
        var isPacked = Boolean(state.a1.packed[it.id]);
        return (
          '<div class="tc-obj-card' + (isPacked ? ' packed' : '') + '" data-oid="' + it.id + '" role="button" tabindex="0">' +
            '<div class="tc-obj-art">' + imgWithFallback(it.img, it.label, it.emoji) + '</div>' +
            '<div class="tc-obj-label">' + (isPacked ? ('✅ ' + it.label) : it.label) + '</div>' +
          '</div>'
        );
      }).join('');

      stage.innerHTML = (
        '<div class="tc-panel">' +
          '<div class="tc-panel-top">' +
            '<div class="tc-panel-heading">📦 Activity 1 (Part 1): Pack the Time Capsule! (' + packedCount + ' / 6 Packed)</div>' +
            '<span class="tc-pill">Tap the 6 real Time Capsule objects from our book!</span>' +
          '</div>' +
          '<div class="tc-a1-pack-layout">' +
            '<div class="tc-capsule-drop">' +
              '<div class="tc-capsule-art">' + imgWithFallback('img/capsule.webp', 'Time Capsule', '📦') + '</div>' +
              '<h3>Shiny Time Capsule (' + packedCount + ' / 6)</h3>' +
              '<p>Tap the 6 items that belong inside a time capsule (pp. 81–85)!</p>' +
            '</div>' +
            '<div class="tc-obj-grid">' + objsHtml + '</div>' +
          '</div>' +
        '</div>'
      );

      Array.prototype.forEach.call(stage.querySelectorAll('.tc-obj-card'), function (card) {
        card.addEventListener('click', function () {
          var oid = card.getAttribute('data-oid');
          if (state.a1.packed[oid]) return;
          var item = D.capsuleItems.filter(function (x) { return x.id === oid; })[0];
          if (!item) return;
          if (item.inCapsule) {
            state.a1.packed[oid] = true;
            if (A) A.praise(true);
            awardTeamXP(10);
            if (Object.keys(state.a1.packed).length >= 6) {
              spawnConfetti();
              setTimeout(function () {
                state.a1.step = 2;
                setSpeech('Awesome! All 6 objects are inside the capsule! Now tap two word cards to complete your message to the future!', true);
                renderActivity1();
              }, 900);
            } else {
              renderActivity1();
            }
          } else {
            state.a1.mistakes++;
            card.style.borderColor = '#f43f5e';
            setTimeout(function () { card.style.borderColor = ''; }, 450);
            if (A) {
              A.playSoftFail();
              A.speak('Wait! ' + item.label + ' cannot fit inside a time capsule!');
            }
          }
        });
      });
    } else {
      // Step 2: Message to the Future
      var wordChipsHtml = D.messageWordCards.map(function (w) {
        var used = (state.a1.gap1 === w || state.a1.gap2 === w);
        return (
          '<button type="button" class="tc-word-chip' + (used ? ' used' : '') + '" data-w="' + w + '">' +
            '✨ ' + w +
          '</button>'
        );
      }).join('');

      var fullMessageText = 'Hello, people of the future! I want you to know about ' +
        (state.a1.gap1 || '____') + '. And ' + (state.a1.gap2 || '____') + '. From, ' + (state.a1.author || 'Class 3') + '.';

      stage.innerHTML = (
        '<div class="tc-panel">' +
          '<div class="tc-panel-top">' +
            '<div class="tc-panel-heading">📜 Activity 1 (Part 2): Write Your Message to the Future! (p. 86)</div>' +
            '<button type="button" class="tc-btn tc-btn-amber" id="a1-btn-read">🔊 Read Our Message Aloud</button>' +
          '</div>' +
          '<div class="tc-a1-msg-layout">' +
            '<div class="tc-parchment-scroll">' +
              '<h3>📜 Message Inside the Time Capsule</h3>' +
              '<p class="tc-scroll-line">“Hello, people of the future!</p>' +
              '<p class="tc-scroll-line">I want you to know about <span class="tc-gap-box" id="a1-gap1">' + (state.a1.gap1 || 'Tap a card →') + '</span>.</p>' +
              '<p class="tc-scroll-line">And <span class="tc-gap-box" id="a1-gap2">' + (state.a1.gap2 || 'Tap a 2nd card →') + '</span>.</p>' +
              '<p class="tc-scroll-line">From, <input type="text" id="a1-author-input" class="tc-author-input" value="' + state.a1.author + '" />”</p>' +
              (state.a1.gap1 && state.a1.gap2
                ? '<button type="button" class="tc-btn tc-btn-emerald" id="a1-btn-send" style="margin-top:10px;font-size:1.15rem;">🚀 Seal &amp; Send Message to the Future!</button>'
                : '') +
            '</div>' +
            '<div class="tc-word-bank">' +
              '<div style="font-family:var(--font-display);font-size:1.2rem;color:#fde047;">🏷️ Tap 2 Ideas for the Future (p. 86):</div>' +
              wordChipsHtml +
            '</div>' +
          '</div>' +
        '</div>'
      );

      var inp = document.getElementById('a1-author-input');
      if (inp) {
        inp.addEventListener('input', function () {
          state.a1.author = inp.value || 'Class 3';
        });
      }

      var readBtn = document.getElementById('a1-btn-read');
      if (readBtn) {
        readBtn.onclick = function () {
          if (A) A.speak(fullMessageText);
        };
      }

      var sendBtn = document.getElementById('a1-btn-send');
      if (sendBtn) {
        sendBtn.onclick = function () {
          if (A) A.speak(fullMessageText);
          var st = state.a1.mistakes === 0 ? 3 : (state.a1.mistakes <= 2 ? 2 : 1);
          completeActivity(1, st);
        };
      }

      Array.prototype.forEach.call(stage.querySelectorAll('.tc-word-chip'), function (btn) {
        btn.addEventListener('click', function () {
          var w = btn.getAttribute('data-w');
          if (!state.a1.gap1) state.a1.gap1 = w;
          else if (!state.a1.gap2 && state.a1.gap1 !== w) state.a1.gap2 = w;
          else {
            state.a1.gap1 = w;
            state.a1.gap2 = '';
          }
          if (A) {
            A.playCorrect();
            A.speak(w);
          }
          renderActivity1();
        });
      });
    }
  }

  // =========================================================================
  // ACTIVITY 2: 10x10 WORD SEARCH GRID
  // =========================================================================
  function initActivity2() {
    state.a2 = { found: {}, startCell: null, mistakes: 0 };
    renderActivity2();
  }

  function isCellInFoundWord(r, c) {
    return D.wordSearch.words.some(function (w) {
      if (!state.a2.found[w.word]) return false;
      return r >= w.r1 && r <= w.r2 && c >= w.c1 && c <= w.c2;
    });
  }

  function renderActivity2() {
    var stage = document.getElementById('tc-stage');
    if (!stage) return;

    var grid = D.wordSearch.grid;
    var cellsHtml = '';
    for (var r = 0; r < 10; r++) {
      for (var c = 0; c < 10; c++) {
        var inFound = isCellInFoundWord(r, c);
        var isStart = state.a2.startCell && state.a2.startCell.r === r && state.a2.startCell.c === c;
        var cls = 'tc-ws-cell' + (inFound ? ' found' : '') + (isStart ? ' selected' : '');
        cellsHtml += '<button type="button" class="' + cls + '" data-r="' + r + '" data-c="' + c + '">' + grid[r][c] + '</button>';
      }
    }

    var foundCount = Object.keys(state.a2.found).length;

    var listHtml = D.wordSearch.words.map(function (w) {
      var done = Boolean(state.a2.found[w.word]);
      return (
        '<button type="button" class="tc-ws-word' + (done ? ' done' : '') + '" data-word="' + w.word + '">' +
          '<span>' + w.emoji + ' ' + w.word + '</span>' +
          '<span>' + (done ? '✅' : '🔎') + '</span>' +
        '</button>'
      );
    }).join('');

    stage.innerHTML = (
      '<div class="tc-panel">' +
        '<div class="tc-panel-top">' +
          '<div class="tc-panel-heading">🔎 Activity 2: Word Search — Found ' + foundCount + ' of ' + D.wordSearch.words.length + ' Words</div>' +
          '<span class="tc-pill">Tap First Letter &amp; Last Letter (or Tap a Word Hint on the Right)!</span>' +
        '</div>' +
        '<div class="tc-a2-layout">' +
          '<div class="tc-ws-board">' + cellsHtml + '</div>' +
          '<div class="tc-ws-sidebar">' +
            '<div style="font-family:var(--font-display);font-size:1.15rem;color:#fde047;">📋 Unit 5 Words to Find:</div>' +
            '<div class="tc-ws-list">' + listHtml + '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );

    function markWordFound(wObj) {
      if (state.a2.found[wObj.word]) return;
      state.a2.found[wObj.word] = true;
      state.a2.startCell = null;
      if (A) {
        A.playCorrect();
        A.speak(wObj.word + '!');
      }
      awardTeamXP(10);
      renderActivity2();
      if (Object.keys(state.a2.found).length === D.wordSearch.words.length) {
        spawnConfetti();
        var st = state.a2.mistakes === 0 ? 3 : (state.a2.mistakes <= 2 ? 2 : 1);
        setTimeout(function () { completeActivity(2, st); }, 1200);
      }
    }

    Array.prototype.forEach.call(stage.querySelectorAll('.tc-ws-cell'), function (btn) {
      btn.addEventListener('click', function () {
        var r = Number(btn.getAttribute('data-r'));
        var c = Number(btn.getAttribute('data-c'));
        if (!state.a2.startCell) {
          state.a2.startCell = { r: r, c: c };
          renderActivity2();
        } else {
          var sr = state.a2.startCell.r;
          var sc = state.a2.startCell.c;
          var matchedWord = D.wordSearch.words.filter(function (w) {
            return (w.r1 === sr && w.c1 === sc && w.r2 === r && w.c2 === c) ||
                   (w.r2 === sr && w.c2 === sc && w.r1 === r && w.c1 === c);
          })[0];
          if (matchedWord) {
            markWordFound(matchedWord);
          } else {
            // If they tapped the start of another word, switch startCell to it
            var startsWord = D.wordSearch.words.some(function (w) { return w.r1 === r && w.c1 === c && !state.a2.found[w.word]; });
            if (startsWord) {
              state.a2.startCell = { r: r, c: c };
            } else {
              state.a2.startCell = null;
              if (A) A.playSoftFail();
            }
            renderActivity2();
          }
        }
      });
    });

    // Clicking a word pill in the list highlights its first letter (or completes if first letter already selected)
    Array.prototype.forEach.call(stage.querySelectorAll('.tc-ws-word'), function (wBtn) {
      wBtn.addEventListener('click', function () {
        var wName = wBtn.getAttribute('data-word');
        var wObj = D.wordSearch.words.filter(function (x) { return x.word === wName; })[0];
        if (!wObj || state.a2.found[wName]) return;
        if (state.a2.startCell && state.a2.startCell.r === wObj.r1 && state.a2.startCell.c === wObj.c1) {
          markWordFound(wObj);
        } else {
          state.a2.startCell = { r: wObj.r1, c: wObj.c1 };
          if (A) A.speak('Find ' + wObj.word + '! First letter highlighted.');
          renderActivity2();
        }
      });
    });
  }

  // =========================================================================
  // ACTIVITY 3: SENTENCE SCRAMBLE (6 Sentences)
  // =========================================================================
  function initActivity3() {
    state.a3 = { idx: 0, built: [], pool: [], mistakes: 0 };
    setupSentenceRound();
    renderActivity3();
  }

  function setupSentenceRound() {
    var item = D.sentences[state.a3.idx];
    if (!item) return;
    state.a3.built = [];
    var shuf = item.words.map(function (w, i) {
      return { id: 'w_' + i, text: w, used: false };
    }).sort(function () { return Math.random() - 0.5; });
    if (shuf.map(function (x) { return x.text; }).join(' ') === item.words.join(' ')) {
      shuf.reverse();
    }
    state.a3.pool = shuf;
  }

  function renderActivity3() {
    var stage = document.getElementById('tc-stage');
    var item = D.sentences[state.a3.idx];
    if (!stage || !item) return;

    var builtHtml = item.words.map(function (w, i) {
      var placed = state.a3.built[i];
      return (
        '<div class="tc-sent-slot' + (placed ? ' filled' : '') + '">' +
          (placed || ('Word ' + (i + 1))) +
        '</div>'
      );
    }).join('');

    var poolHtml = state.a3.pool.map(function (t) {
      if (t.used) return '';
      return (
        '<button type="button" class="tc-sent-tile" data-tid="' + t.id + '">' +
          t.text +
        '</button>'
      );
    }).join('');

    stage.innerHTML = (
      '<div class="tc-panel">' +
        '<div class="tc-panel-top">' +
          '<div class="tc-panel-heading">🧩 Activity 3: Sentence Scramble — Sentence ' + (state.a3.idx + 1) + ' of ' + D.sentences.length + '</div>' +
          '<button type="button" class="tc-btn tc-btn-amber" id="a3-btn-listen">🔊 Hear Target Sentence</button>' +
        '</div>' +
        '<div class="tc-a3-layout">' +
          '<div class="tc-a3-art-box">' + imgWithFallback(item.img, item.words.join(' '), item.emoji) + '</div>' +
          '<div class="tc-a3-work">' +
            '<div class="tc-sent-slots">' + builtHtml + '</div>' +
            '<div class="tc-sent-pool">' + poolHtml + '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );

    setSpeech('Put the words in order: ' + item.words.join(' '), false);

    var lBtn = document.getElementById('a3-btn-listen');
    if (lBtn) {
      lBtn.onclick = function () {
        if (A) A.speak(item.words.join(' '));
      };
    }

    Array.prototype.forEach.call(stage.querySelectorAll('.tc-sent-tile'), function (btn) {
      btn.addEventListener('click', function () {
        var tid = btn.getAttribute('data-tid');
        var tile = state.a3.pool.filter(function (x) { return x.id === tid; })[0];
        if (!tile || tile.used) return;
        var expectedWord = item.words[state.a3.built.length];
        if (tile.text === expectedWord) {
          tile.used = true;
          state.a3.built.push(tile.text);
          if (A) {
            A.playCorrect();
            A.speak(tile.text);
          }
          renderActivity3();
          if (state.a3.built.length === item.words.length) {
            awardTeamXP(10);
            spawnConfetti();
            if (A) A.speak(item.words.join(' '));
            setTimeout(function () {
              if (state.a3.idx + 1 < D.sentences.length) {
                state.a3.idx++;
                setupSentenceRound();
                renderActivity3();
              } else {
                var st = state.a3.mistakes === 0 ? 3 : (state.a3.mistakes <= 2 ? 2 : 1);
                completeActivity(3, st);
              }
            }, 1250);
          }
        } else {
          state.a3.mistakes++;
          btn.style.borderColor = '#f43f5e';
          setTimeout(function () { btn.style.borderColor = ''; }, 400);
          if (A) A.playSoftFail();
        }
      });
    });
  }

  // =========================================================================
  // ACTIVITY 4: WORD SORTING (3 Baskets: PLACES 🌍 / SOUNDS 🔊 / TOUCH ✋)
  // =========================================================================
  function initActivity4() {
    state.a4 = { idx: 0, mistakes: 0, locked: false };
    renderActivity4();
  }

  function renderActivity4() {
    var stage = document.getElementById('tc-stage');
    var item = D.sorting.items[state.a4.idx];
    if (!stage || !item) return;

    var basketsHtml = D.sorting.baskets.map(function (b) {
      return (
        '<button type="button" class="tc-basket-btn" data-bid="' + b.id + '" style="border-color:' + b.color + ';">' +
          '<div class="tc-basket-title">' + b.title + '</div>' +
          '<div class="tc-basket-sub">' + b.sub + '</div>' +
        '</button>'
      );
    }).join('');

    stage.innerHTML = (
      '<div class="tc-panel">' +
        '<div class="tc-panel-top">' +
          '<div class="tc-panel-heading">🧺 Activity 4: Word Sorting — Item ' + (state.a4.idx + 1) + ' of ' + D.sorting.items.length + '</div>' +
          '<span class="tc-pill">Tap or Drag into PLACES 🌍, SOUNDS 🔊, or THINGS WE TOUCH ✋</span>' +
        '</div>' +
        '<div class="tc-a4-layout">' +
          '<div class="tc-sort-showcase" draggable="true">' +
            '<div class="tc-sort-art">' + imgWithFallback(item.img, item.label, item.emoji) + '</div>' +
            '<div class="tc-sort-label">' + item.emoji + ' ' + item.label + '</div>' +
          '</div>' +
          '<div class="tc-baskets-row">' + basketsHtml + '</div>' +
        '</div>' +
      '</div>'
    );

    setSpeech(item.label + '. Does it go in Places, Sounds, or Things we can touch?', true);

    function pickBasket(bid, btnEl) {
      if (state.a4.locked) return;
      if (bid === item.basket) {
        state.a4.locked = true;
        if (A) A.praise(true);
        awardTeamXP(10);
        spawnConfetti();
        setTimeout(function () {
          if (state.a4.idx + 1 < D.sorting.items.length) {
            state.a4.idx++;
            state.a4.locked = false;
            renderActivity4();
          } else {
            var st = state.a4.mistakes === 0 ? 3 : (state.a4.mistakes <= 2 ? 2 : 1);
            completeActivity(4, st);
          }
        }, 1100);
      } else {
        state.a4.mistakes++;
        if (btnEl) {
          btnEl.style.transform = 'translateX(-6px)';
          setTimeout(function () { btnEl.style.transform = ''; }, 350);
        }
        if (A) A.praise(false);
      }
    }

    Array.prototype.forEach.call(stage.querySelectorAll('.tc-basket-btn'), function (bEl) {
      var bid = bEl.getAttribute('data-bid');
      bEl.addEventListener('click', function () { pickBasket(bid, bEl); });
      bEl.addEventListener('dragover', function (ev) { ev.preventDefault(); });
      bEl.addEventListener('drop', function (ev) { ev.preventDefault(); pickBasket(bid, bEl); });
    });
  }

  // =========================================================================
  // ACTIVITY 5: OPPOSITES MATCHING (8 Pairs)
  // =========================================================================
  function initActivity5() {
    var shufRight = D.opposites.slice().sort(function () { return Math.random() - 0.5; });
    state.a5 = {
      matched: {},
      selectedLeft: D.opposites[0].id,
      rightOrder: shufRight,
      mistakes: 0
    };
    renderActivity5();
  }

  function renderActivity5() {
    var stage = document.getElementById('tc-stage');
    if (!stage) return;

    var matchedCount = Object.keys(state.a5.matched).length;

    var leftHtml = D.opposites.map(function (p) {
      var done = Boolean(state.a5.matched[p.id]);
      var sel = state.a5.selectedLeft === p.id && !done;
      return (
        '<button type="button" class="tc-opp-btn' + (done ? ' done' : '') + (sel ? ' selected' : '') + '" data-left="' + p.id + '">' +
          '<span>' + p.left + '</span>' +
          '<span>' + (done ? '✅' : '⚡') + '</span>' +
        '</button>'
      );
    }).join('');

    var rightHtml = state.a5.rightOrder.map(function (p) {
      var done = Boolean(state.a5.matched[p.id]);
      return (
        '<button type="button" class="tc-opp-btn' + (done ? ' done' : '') + '" data-right="' + p.id + '">' +
          '<span>' + p.right + '</span>' +
          '<span>' + (done ? '✅' : '🔗') + '</span>' +
        '</button>'
      );
    }).join('');

    stage.innerHTML = (
      '<div class="tc-panel">' +
        '<div class="tc-panel-top">' +
          '<div class="tc-panel-heading">⚡ Activity 5: Opposites Matching — ' + matchedCount + ' / ' + D.opposites.length + ' Matched</div>' +
          '<span class="tc-pill">Tap a Word on the Left, Then Tap Its Opposite on the Right!</span>' +
        '</div>' +
        '<div class="tc-a5-layout">' +
          '<div class="tc-opp-col">' + leftHtml + '</div>' +
          '<div class="tc-opp-col">' + rightHtml + '</div>' +
        '</div>' +
      '</div>'
    );

    Array.prototype.forEach.call(stage.querySelectorAll('[data-left]'), function (btn) {
      btn.addEventListener('click', function () {
        var pid = btn.getAttribute('data-left');
        if (state.a5.matched[pid]) return;
        state.a5.selectedLeft = pid;
        var pObj = D.opposites.filter(function (x) { return x.id === pid; })[0];
        if (pObj && A) A.speak(pObj.left);
        renderActivity5();
      });
    });

    Array.prototype.forEach.call(stage.querySelectorAll('[data-right]'), function (btn) {
      btn.addEventListener('click', function () {
        var rid = btn.getAttribute('data-right');
        if (state.a5.matched[rid] || !state.a5.selectedLeft) return;
        if (rid === state.a5.selectedLeft) {
          state.a5.matched[rid] = true;
          if (A) A.praise(true);
          awardTeamXP(10);
          var nextUnmatched = D.opposites.filter(function (x) { return !state.a5.matched[x.id]; })[0];
          state.a5.selectedLeft = nextUnmatched ? nextUnmatched.id : null;
          renderActivity5();
          if (!nextUnmatched) {
            spawnConfetti();
            var st = state.a5.mistakes === 0 ? 3 : (state.a5.mistakes <= 2 ? 2 : 1);
            setTimeout(function () { completeActivity(5, st); }, 1150);
          }
        } else {
          state.a5.mistakes++;
          btn.style.borderColor = '#f43f5e';
          setTimeout(function () { btn.style.borderColor = ''; }, 400);
          if (A) A.praise(false);
        }
      });
    });
  }

  // =========================================================================
  // COMPLETION, CERTIFICATE & TEACHER MODAL
  // =========================================================================
  function completeActivity(aid, starsEarned) {
    stopActivityTimer();
    if (starsEarned > (state.stars[aid] || 0)) {
      state.stars[aid] = starsEarned;
    }
    saveState();
    renderHeader();
    spawnConfetti();
    if (A) {
      A.playVictoryFanfare();
      A.speak('Great job! You completed Activity ' + aid + ' and earned ' + starsEarned + ' stars!');
    }

    var modal = document.getElementById('tc-modal-overlay');
    var card = document.getElementById('tc-modal-card');
    if (!modal || !card) { openHome(); return; }

    var meta = D.activities.filter(function (a) { return a.id === aid; })[0];
    card.innerHTML = (
      '<div style="font-size:3.4rem;">' + starsStr(starsEarned) + '</div>' +
      '<h2>🎉 ' + (meta ? meta.title : ('Activity ' + aid)) + ' Complete!</h2>' +
      '<p>Awesome space mission! Your class earned <strong>' + starsEarned + ' Stars</strong>!</p>' +
      '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">' +
        '<button type="button" class="tc-btn tc-btn-cyan" id="tc-m-home">🚀 Capsule Map</button>' +
        (aid < 5
          ? '<button type="button" class="tc-btn tc-btn-emerald" id="tc-m-next">✨ Next Activity (' + (aid + 1) + ') →</button>'
          : '<button type="button" class="tc-btn tc-btn-amber" id="tc-m-cert">🎓 Claim Certificate: Message Sent to the Future!</button>') +
      '</div>'
    );
    modal.classList.add('open');

    document.getElementById('tc-m-home').onclick = function () { modal.classList.remove('open'); openHome(); };
    var nxt = document.getElementById('tc-m-next');
    if (nxt) nxt.onclick = function () { modal.classList.remove('open'); startActivity(aid + 1); };
    var crt = document.getElementById('tc-m-cert');
    if (crt) crt.onclick = function () { modal.classList.remove('open'); openCertificate(); };
  }

  function openCertificate() {
    state.view = 'cert';
    stopActivityTimer();
    renderHeader();
    spawnConfetti();
    if (A) A.playVictoryFanfare();
    setSpeech('Message sent to the future! Congratulations, Voyager Time Capsule Commanders!', true);

    var modal = document.getElementById('tc-modal-overlay');
    var card = document.getElementById('tc-modal-card');
    if (!modal || !card) return;

    card.innerHTML = (
      '<div style="max-width:440px;margin:0 auto 12px;border-radius:16px;overflow:hidden;border:2px solid #38bdf8;background:#000;">' +
        '<video src="video/g3_vid_r2.mp4" poster="img/scene-voyager-space.webp" controls autoplay muted playsinline style="width:100%;max-height:200px;object-fit:cover;"></video>' +
      '</div>' +
      '<h2>🎓 Message Sent to the Future! — Certificate</h2>' +
      '<p>Awarded to <strong>Grade 3 English Adventure Academy</strong> for completing Unit 5 Lesson 2: <em>Time Capsules</em> (pp. 81–87)!</p>' +
      '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:14px 0;">' +
        '<span class="tc-pill">⭐ Total Stars: ' + totalStars() + ' / 15</span>' +
        '<span class="tc-pill">🛸 Voyager 1 &amp; 2 Gold Disc Expert</span>' +
        '<span class="tc-pill">📦 1795 Massachusetts Historian</span>' +
      '</div>' +
      '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">' +
        '<a href="worksheet.html" target="_blank" class="tc-btn tc-btn-amber" style="text-decoration:none;">🖨️ Print Worksheet &amp; Key</a>' +
        '<button type="button" class="tc-btn tc-btn-cyan" id="tc-cert-close">🚀 Return to Capsule Map</button>' +
      '</div>'
    );
    modal.classList.add('open');

    document.getElementById('tc-cert-close').onclick = function () {
      modal.classList.remove('open');
      openHome();
    };
  }

  function openTeacherModal() {
    var modal = document.getElementById('tc-modal-overlay');
    var card = document.getElementById('tc-modal-card');
    if (!modal || !card) return;

    card.innerHTML = (
      '<h2>🎓 Teacher Answer Key — Time Capsule Mission (pp. 81–87)</h2>' +
      '<div class="tc-teacher-box">' +
        '<div><strong>Activity 1 (6 Book Capsule Objects — pp. 81–85):</strong> 1795 Coins, Newspapers, A Letter, Photos of Earth, A Toy &amp; Game, The Gold Disc (Distractors: A Huge Chariot, A Live Pharaoh).</div>' +
        '<div><strong>Activity 2 (Word Search — 8 Words Across):</strong> Row 1: FUTURE | Row 2: OBJECTS | Row 3: COINS | Row 4: EARTH | Row 5: DISC | Row 6: WIND | Row 7: PAST | Row 9: ANCIENT.</div>' +
        '<div><strong>Activity 3 (Sentence Scramble):</strong> 1. This is a time capsule. | 2. People lived in the past. | 3. I want to see the future. | 4. It had coins and newspapers. | 5. Each spacecraft has a gold disc. | 6. Hello, people of the future!</div>' +
        '<div><strong>Activity 4 (Word Sorting — 3 Baskets):</strong> PLACES 🌍: Earth, ancient city, school | SOUNDS 🔊: wind, thunder, music &amp; songs | THINGS WE TOUCH ✋: coins, a toy, a letter.</div>' +
        '<div><strong>Activity 5 (Opposites Matching):</strong> past–future, old–new, ancient–modern, big–small, loud–quiet, happy–sad, open–close, day–night.</div>' +
      '</div>' +
      '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px;">' +
        '<button type="button" class="tc-btn tc-btn-amber" id="tc-t-unlock">⭐ Unlock All 15 Stars</button>' +
        '<button type="button" class="tc-btn tc-btn-coral" id="tc-t-reset">🗑️ Reset Stars &amp; Teams</button>' +
        '<a href="worksheet.html" target="_blank" class="tc-btn tc-btn-emerald" style="text-decoration:none;">🖨️ Print Worksheet + Answer Key</a>' +
        '<button type="button" class="tc-btn tc-btn-cyan" id="tc-t-close">✖ Close</button>' +
      '</div>'
    );
    modal.classList.add('open');

    document.getElementById('tc-t-unlock').onclick = function () {
      for (var i = 1; i <= 5; i++) state.stars[i] = 3;
      saveState();
      modal.classList.remove('open');
      openHome();
    };
    document.getElementById('tc-t-reset').onclick = function () {
      for (var i = 1; i <= 5; i++) state.stars[i] = 0;
      D.teams.forEach(function (t) { state.teams[t.id] = 0; });
      saveState();
      modal.classList.remove('open');
      openHome();
    };
    document.getElementById('tc-t-close').onclick = function () {
      modal.classList.remove('open');
    };
  }

  function spawnConfetti() {
    var layer = document.getElementById('tc-confetti');
    if (!layer) return;
    var colors = ['#38bdf8', '#a855f7', '#f59e0b', '#10b981', '#fde047'];
    for (var i = 0; i < 26; i++) {
      var p = document.createElement('div');
      p.className = 'tc-confetti-piece';
      p.style.left = Math.round(Math.random() * 98) + '%';
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = (1.2 + Math.random()).toFixed(2) + 's';
      layer.appendChild(p);
      (function (el) {
        setTimeout(function () { if (el && el.parentNode) el.parentNode.removeChild(el); }, 2300);
      })(p);
    }
  }

  function init() {
    loadState();
    renderHeader();

    var homeBtn = document.getElementById('tc-btn-home');
    if (homeBtn) homeBtn.onclick = openHome;

    var listenBtn = document.getElementById('tc-btn-listen');
    if (listenBtn) listenBtn.onclick = function () { if (A) A.listenAgain(); };

    var teacherBtn = document.getElementById('tc-btn-teacher');
    if (teacherBtn) teacherBtn.onclick = openTeacherModal;

    var timerPill = document.getElementById('tc-timer-pill');
    if (timerPill) {
      timerPill.onclick = function () {
        state.timerPaused = !state.timerPaused;
        updateTimerDisplay();
      };
    }

    openHome();
  }

  window.TCApp = {
    init: init,
    openHome: openHome,
    startActivity: startActivity,
    openCertificate: openCertificate,
    openTeacherModal: openTeacherModal
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
