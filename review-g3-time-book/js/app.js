/**
 * Grade 3 • Unit 5 Lesson 1: "The Time Book – Help Jannah!"
 * Interactive Classroom Smartboard Controller (5 Activities + Timer + Certificate)
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'eaa_g3_time_book_v1';
  var D = window.TB_DATA;
  var A = window.TBAudio;

  var state = {
    view: 'home', // 'home' | 'a1'..'a5' | 'cert'
    stars: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    teams: { croc: 0, falcon: 0, lion: 0, scarab: 0 },
    activeTeam: 'croc',
    timerSec: 0,
    timerPaused: false,
    timerInterval: null,
    // Activity runtime state
    a1: { r: 0, c: 0, unlockedGates: {}, activeGate: null, mistakes: 0 },
    a2: { idx: 0, built: '', pool: [], mistakes: 0 },
    a3: { slots: [null, null, null, null, null, null], pool: [], selectedId: null, mistakes: 0 },
    a4: { idx: 0, mistakes: 0, locked: false, feedback: '' },
    a5: { idx: 0, mistakes: 0, locked: false }
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

  function imgWithFallback(src, alt, emoji, cls) {
    var safeAlt = (alt || '').replace(/"/g, '&quot;');
    var safeCls = cls ? ' class="' + cls + '"' : '';
    return (
      '<img src="' + src + '" alt="' + safeAlt + '"' + safeCls +
      ' onerror="this.style.display=\'none\';if(this.nextElementSibling)this.nextElementSibling.style.display=\'flex\';" />' +
      '<span class="tb-emoji-fallback" style="display:none;align-items:center;justify-content:center;font-size:3rem;">' + (emoji || '🏺') + '</span>'
    );
  }

  function setSpeech(text, speakAloud) {
    var el = document.getElementById('tb-mascot-speech');
    if (el) el.textContent = text || '';
    if (speakAloud !== false && A) A.speak(text);
  }

  function awardTeamXP(pts) {
    var tid = state.activeTeam || 'croc';
    state.teams[tid] = (Number(state.teams[tid]) || 0) + pts;
    saveState();
    renderHeader();
    try {
      if (window.AdventureAcademy && typeof window.AdventureAcademy.awardXP === 'function') {
        window.AdventureAcademy.awardXP(pts, 'The Time Book');
      }
    } catch (e) {}
  }

  // =========================================================================
  // COUNTDOWN TIMER (With Pause/Resume for Teacher)
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
    var pill = document.getElementById('tb-timer-pill');
    if (!pill) return;
    if (state.view === 'home' || state.view === 'cert') {
      pill.style.display = 'none';
      return;
    }
    pill.style.display = 'inline-flex';
    var m = Math.floor(state.timerSec / 60);
    var s = state.timerSec % 60;
    var timeTxt = m + ':' + (s < 10 ? '0' + s : s);
    pill.innerHTML = '⏱ ' + timeTxt + ' ' + (state.timerPaused ? '▶️ Resume' : '⏸ Pause');
  }

  // =========================================================================
  // HEADER
  // =========================================================================
  function renderHeader() {
    var strip = document.getElementById('tb-team-strip');
    if (strip) {
      strip.innerHTML = D.teams.map(function (t) {
        var act = state.activeTeam === t.id ? ' active' : '';
        var sc = Number(state.teams[t.id]) || 0;
        return (
          '<button type="button" class="tb-team-pill' + act + '" data-team="' + t.id + '">' +
            '<span>' + t.emoji + ' ' + t.name + '</span>' +
            '<span class="tb-team-score">' + sc + '</span>' +
          '</button>'
        );
      }).join('');

      Array.prototype.forEach.call(strip.querySelectorAll('.tb-team-pill'), function (btn) {
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

    var starEl = document.getElementById('tb-total-stars');
    if (starEl) starEl.textContent = '⭐ ' + totalStars() + ' / 15';

    var homeBtn = document.getElementById('tb-btn-home');
    if (homeBtn) homeBtn.style.display = state.view === 'home' ? 'none' : 'inline-flex';

    updateTimerDisplay();
  }

  // =========================================================================
  // HOME SCREEN: THE MAGIC BOOK & 5 ACTIVITY BUTTONS
  // =========================================================================
  function openHome() {
    state.view = 'home';
    stopActivityTimer();
    renderHeader();
    setSpeech('Welcome to The Time Book! Open the magic book and complete all 5 activities to help Jannah return home!', false);

    var stage = document.getElementById('tb-stage');
    if (!stage) return;

    var cardsHtml = D.activities.map(function (a) {
      var st = Number(state.stars[a.id]) || 0;
      return (
        '<div class="tb-act-card' + (st > 0 ? ' completed' : '') + '" data-act="' + a.id + '" role="button" tabindex="0">' +
          '<div class="tb-act-art">' +
            '<span class="tb-act-badge">' + a.num + ' • ⏱ ' + a.minutes + ' min</span>' +
            '<span class="tb-act-stars">' + starsStr(st) + '</span>' +
            imgWithFallback(a.img, a.title, a.emoji) +
          '</div>' +
          '<div class="tb-act-caption">' +
            '<div class="tb-act-title">' + a.title + '</div>' +
            '<div class="tb-act-sub">' + a.subtitle + '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    // 6th slot: Story Video & Certificate Card
    cardsHtml += (
      '<div class="tb-act-card" id="tb-card-cert" role="button" tabindex="0" style="border-color:#f59e0b;">' +
        '<div class="tb-act-art" style="background:radial-gradient(circle at 50% 40%, rgba(245,158,11,0.35), rgba(15,23,42,0.94));">' +
          '<span class="tb-act-badge" style="background:#f59e0b;color:#060911;">🏆 FINAL &amp; VIDEO</span>' +
          '<span class="tb-act-stars">🎬 Story Clip</span>' +
          imgWithFallback('img/scene-book-open.webp', 'You Saved Jannah Certificate', '🎓') +
        '</div>' +
        '<div class="tb-act-caption">' +
          '<div class="tb-act-title" style="color:#fde047;">🎬 Watch Story &amp; Certificate</div>' +
          '<div class="tb-act-sub">Watch Jannah open The Time Book &amp; claim your Time Traveler Certificate!</div>' +
        '</div>' +
      '</div>'
    );

    stage.innerHTML = '<div class="tb-home-grid">' + cardsHtml + '</div>';

    Array.prototype.forEach.call(stage.querySelectorAll('[data-act]'), function (card) {
      card.addEventListener('click', function () {
        var aid = Number(card.getAttribute('data-act'));
        startActivity(aid);
      });
    });

    var certCard = document.getElementById('tb-card-cert');
    if (certCard) {
      certCard.addEventListener('click', function () {
        openCertificate();
      });
    }
  }

  function startActivity(aid) {
    state.view = 'a' + aid;
    var meta = D.activities.filter(function (a) { return a.id === aid; })[0];
    if (meta) {
      startActivityTimer(meta.minutes);
      setSpeech(meta.intro, true);
    }
    if (A) A.playSfx('page_turn');
    renderHeader();

    if (aid === 1) initActivity1();
    else if (aid === 2) initActivity2();
    else if (aid === 3) initActivity3();
    else if (aid === 4) initActivity4();
    else if (aid === 5) initActivity5();
  }

  // =========================================================================
  // ACTIVITY 1: HELP JANNAH ESCAPE! (7x7 Grid Maze + 5 Story Gates)
  // =========================================================================
  function initActivity1() {
    state.a1 = { r: 0, c: 0, unlockedGates: {}, activeGate: null, mistakes: 0 };
    renderActivity1();
  }

  function renderActivity1() {
    var stage = document.getElementById('tb-stage');
    if (!stage) return;

    var grid = D.maze.grid;
    var cellsHtml = '';
    for (var r = 0; r < grid.length; r++) {
      for (var c = 0; c < grid[r].length; c++) {
        var cell = grid[r][c];
        var isJannah = (state.a1.r === r && state.a1.c === c);
        var cls = 'tb-maze-cell';
        var inner = '';

        if (cell === 'W') {
          cls += ' wall';
          inner = '🧱';
        } else if (cell === 'G') {
          cls += ' guard';
          inner = '💂';
        } else if (cell === 'S') {
          cls += ' start';
          inner = '🏛️';
        } else if (cell === 'E') {
          cls += ' goal';
          inner = '🛏️';
        } else if ('12345'.indexOf(cell) !== -1) {
          var isUnlocked = Boolean(state.a1.unlockedGates[cell]);
          cls += isUnlocked ? ' gate-open' : ' gate-locked';
          inner = isUnlocked ? ('🔓' + cell) : ('🚪' + cell);
        } else {
          cls += ' path';
          inner = '·';
        }

        if (isJannah) {
          cls += ' player';
          inner = '<img src="img/jannah.webp" alt="Jannah" class="tb-maze-player-img" onerror="this.outerHTML=\'👧\'" />';
        }

        cellsHtml += '<button type="button" class="' + cls + '" data-r="' + r + '" data-c="' + c + '">' + inner + '</button>';
      }
    }

    var unlockedCount = Object.keys(state.a1.unlockedGates).length;

    var rightPanelHtml = '';
    if (state.a1.activeGate) {
      var gObj = D.maze.gates[state.a1.activeGate];
      rightPanelHtml = (
        '<div class="tb-gate-quiz">' +
          '<div class="tb-gate-q-title">🚪 Story Gate ' + gObj.num + ' Question:</div>' +
          '<div class="tb-gate-q-text">' + gObj.question + '</div>' +
          '<div class="tb-gate-options">' +
            gObj.options.map(function (opt) {
              return (
                '<button type="button" class="tb-gate-opt" data-opt="' + opt.id + '">' +
                  '<div class="tb-gate-opt-art">' + imgWithFallback(opt.img, opt.label, opt.emoji) + '</div>' +
                  '<span>' + opt.label + '</span>' +
                '</button>'
              );
            }).join('') +
          '</div>' +
        '</div>'
      );
    } else {
      rightPanelHtml = (
        '<div class="tb-maze-controls-card">' +
          '<h3>🧭 Move Jannah Through the City!</h3>' +
          '<p>Tap any glowing tile next to Jannah or use the arrow buttons below. Unlock all <strong>5 Story Gates (🚪1–🚪5)</strong> and reach her bed (🛏️)!</p>' +
          '<div class="tb-dpad">' +
            '<div></div>' +
            '<button type="button" class="tb-btn tb-btn-amber tb-dpad-btn" data-dir="up">⬆️</button>' +
            '<div></div>' +
            '<button type="button" class="tb-btn tb-btn-amber tb-dpad-btn" data-dir="left">⬅️</button>' +
            '<button type="button" class="tb-btn tb-btn-amber tb-dpad-btn" data-dir="down">⬇️</button>' +
            '<button type="button" class="tb-btn tb-btn-amber tb-dpad-btn" data-dir="right">➡️</button>' +
          '</div>' +
          '<div class="tb-maze-legend">' +
            '<span>👧 Jannah</span>' +
            '<span>🚪1–5 Story Gates (' + unlockedCount + '/5)</span>' +
            '<span>💂 Palace Guards</span>' +
            '<span>🛏️ Safe Bedroom</span>' +
          '</div>' +
        '</div>'
      );
    }

    stage.innerHTML = (
      '<div class="tb-panel">' +
        '<div class="tb-panel-top">' +
          '<div class="tb-panel-heading">🏺 Activity 1: Help Jannah Escape! (Gates Unlocked: ' + unlockedCount + ' / 5)</div>' +
          '<span class="tb-pill">Move Jannah to 🚪 Gates 1–5 → 🛏️ Bedroom!</span>' +
        '</div>' +
        '<div class="tb-a1-layout">' +
          '<div class="tb-maze-board">' + cellsHtml + '</div>' +
          '<div class="tb-a1-side">' + rightPanelHtml + '</div>' +
        '</div>' +
      '</div>'
    );

    Array.prototype.forEach.call(stage.querySelectorAll('.tb-dpad-btn'), function (b) {
      b.addEventListener('click', function () {
        var dir = b.getAttribute('data-dir');
        var dr = dir === 'up' ? -1 : (dir === 'down' ? 1 : 0);
        var dc = dir === 'left' ? -1 : (dir === 'right' ? 1 : 0);
        tryMoveJannah(state.a1.r + dr, state.a1.c + dc);
      });
    });

    Array.prototype.forEach.call(stage.querySelectorAll('.tb-maze-cell'), function (cellBtn) {
      cellBtn.addEventListener('click', function () {
        var tr = Number(cellBtn.getAttribute('data-r'));
        var tc = Number(cellBtn.getAttribute('data-c'));
        if (Math.abs(tr - state.a1.r) + Math.abs(tc - state.a1.c) === 1) {
          tryMoveJannah(tr, tc);
        }
      });
    });

    Array.prototype.forEach.call(stage.querySelectorAll('.tb-gate-opt'), function (optBtn) {
      optBtn.addEventListener('click', function () {
        var picked = optBtn.getAttribute('data-opt');
        var gKey = state.a1.activeGate;
        var gObj = D.maze.gates[gKey];
        if (!gObj) return;
        if (picked === gObj.answerId) {
          state.a1.unlockedGates[gKey] = true;
          state.a1.activeGate = null;
          if (A) A.praise(true);
          awardTeamXP(10);
          spawnConfetti();
          renderActivity1();
        } else {
          state.a1.mistakes++;
          optBtn.style.borderColor = '#f43f5e';
          if (A) A.praise(false);
        }
      });
    });
  }

  function tryMoveJannah(nr, nc) {
    if (state.a1.activeGate) return;
    var grid = D.maze.grid;
    if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length) return;
    var cell = grid[nr][nc];
    if (cell === 'W') {
      if (A) A.playSoftFail();
      return;
    }
    if (cell === 'G') {
      state.a1.mistakes++;
      if (A) A.playSfx('footsteps');
      setSpeech('Watch out! A Pharaoh’s guard is blocking that alley! Go the other way!', true);
      return;
    }
    state.a1.r = nr;
    state.a1.c = nc;
    if ('12345'.indexOf(cell) !== -1 && !state.a1.unlockedGates[cell]) {
      state.a1.activeGate = cell;
      var gObj = D.maze.gates[cell];
      if (gObj) setSpeech(gObj.question, true);
      renderActivity1();
      return;
    }
    if (cell === 'E') {
      if (Object.keys(state.a1.unlockedGates).length < 5) {
        setSpeech('Unlock all 5 Story Gates first before entering the bedroom!', true);
        renderActivity1();
        return;
      }
      var st = state.a1.mistakes === 0 ? 3 : (state.a1.mistakes <= 2 ? 2 : 1);
      completeActivity(1, st);
      return;
    }
    renderActivity1();
  }

  // =========================================================================
  // ACTIVITY 2: UNSCRAMBLE THE LETTERS (6 Words in Context, p. 75)
  // =========================================================================
  function initActivity2() {
    state.a2 = { idx: 0, built: '', pool: [], mistakes: 0 };
    setupUnscrambleRound();
    renderActivity2();
  }

  function setupUnscrambleRound() {
    var item = D.unscramble[state.a2.idx];
    if (!item) return;
    // First letter pre-filled as a friendly hint!
    state.a2.built = item.word.charAt(0);
    var rest = item.word.slice(1).split('').map(function (ch, idx) {
      return { id: 'l_' + idx, ch: ch, used: false };
    });
    rest.sort(function () { return Math.random() - 0.5; });
    if (rest.map(function (x) { return x.ch; }).join('') === item.word.slice(1)) {
      rest.reverse();
    }
    state.a2.pool = rest;
  }

  function renderActivity2() {
    var stage = document.getElementById('tb-stage');
    var item = D.unscramble[state.a2.idx];
    if (!stage || !item) return;

    var slotsHtml = item.word.split('').map(function (ch, i) {
      var filledChar = state.a2.built.charAt(i) || '';
      return (
        '<div class="tb-letter-slot' + (filledChar ? ' filled' : '') + '">' +
          (filledChar || '_') +
        '</div>'
      );
    }).join('');

    var tilesHtml = state.a2.pool.map(function (t) {
      if (t.used) return '';
      return (
        '<button type="button" class="tb-letter-tile" data-tid="' + t.id + '">' +
          t.ch +
        '</button>'
      );
    }).join('');

    stage.innerHTML = (
      '<div class="tb-panel">' +
        '<div class="tb-panel-top">' +
          '<div class="tb-panel-heading">🔤 Activity 2: Unscramble the Letters — Word ' + (state.a2.idx + 1) + ' of ' + D.unscramble.length + '</div>' +
          '<button type="button" class="tb-btn tb-btn-amber" id="a2-btn-speak">🔊 Hear Word &amp; Clue</button>' +
        '</div>' +
        '<div class="tb-a2-layout">' +
          '<div class="tb-a2-card">' +
            '<div class="tb-a2-art">' + imgWithFallback(item.img, item.word, item.emoji) + '</div>' +
            '<div class="tb-a2-clue">' + item.clue + '</div>' +
          '</div>' +
          '<div class="tb-a2-work">' +
            '<div class="tb-pill">First letter hint: <strong>' + item.word.charAt(0) + '</strong></div>' +
            '<div class="tb-letter-slots">' + slotsHtml + '</div>' +
            '<div class="tb-letter-pool">' + tilesHtml + '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );

    setSpeech(item.clue + ' Spell the word: ' + item.word + '!', false);

    var spkBtn = document.getElementById('a2-btn-speak');
    if (spkBtn) {
      spkBtn.addEventListener('click', function () {
        if (A) A.speak(item.word + '. ' + item.clue);
      });
    }

    Array.prototype.forEach.call(stage.querySelectorAll('.tb-letter-tile'), function (btn) {
      btn.addEventListener('click', function () {
        var tid = btn.getAttribute('data-tid');
        var tile = state.a2.pool.filter(function (x) { return x.id === tid; })[0];
        if (!tile || tile.used) return;
        var expectedChar = item.word.charAt(state.a2.built.length);
        if (tile.ch === expectedChar) {
          tile.used = true;
          state.a2.built += tile.ch;
          if (A) A.playCorrect();
          renderActivity2();
          if (state.a2.built === item.word) {
            awardTeamXP(10);
            spawnConfetti();
            if (A) A.speak(item.word + '! Well done!');
            setTimeout(function () {
              if (state.a2.idx + 1 < D.unscramble.length) {
                state.a2.idx++;
                setupUnscrambleRound();
                renderActivity2();
              } else {
                var st = state.a2.mistakes === 0 ? 3 : (state.a2.mistakes <= 3 ? 2 : 1);
                completeActivity(2, st);
              }
            }, 1150);
          }
        } else {
          state.a2.mistakes++;
          btn.style.borderColor = '#f43f5e';
          btn.style.transform = 'translateX(-6px)';
          setTimeout(function () { btn.style.borderColor = ''; btn.style.transform = ''; }, 400);
          if (A) A.playSoftFail();
        }
      });
    });
  }

  // =========================================================================
  // ACTIVITY 3: PUT THE EVENTS IN ORDER (6 Story Cards)
  // =========================================================================
  function initActivity3() {
    var shuf = D.events.slice().sort(function () { return Math.random() - 0.5; });
    if (shuf[0].step === 1 && shuf[1].step === 2) shuf.reverse();
    state.a3 = {
      slots: [null, null, null, null, null, null],
      pool: shuf,
      selectedId: shuf[0].id,
      mistakes: 0
    };
    renderActivity3();
  }

  function renderActivity3() {
    var stage = document.getElementById('tb-stage');
    if (!stage) return;

    var nextSlot = state.a3.slots.indexOf(null);

    var slotsHtml = state.a3.slots.map(function (c, i) {
      var stepNum = i + 1;
      if (c) {
        return (
          '<div class="tb-order-slot filled" data-slot="' + i + '">' +
            '<span class="tb-slot-num">' + stepNum + '</span>' +
            '<div class="tb-order-art">' + imgWithFallback(c.img, c.text, c.emoji) + '</div>' +
            '<div class="tb-order-text">' + c.text + '</div>' +
          '</div>'
        );
      }
      var isTarget = i === nextSlot;
      return (
        '<div class="tb-order-slot" data-slot="' + i + '" style="' + (isTarget ? 'border-color:#f59e0b;background:rgba(245,158,11,0.14);' : '') + '">' +
          '<span class="tb-slot-num">' + stepNum + '</span>' +
          '<div class="tb-order-art" style="font-size:2.2rem;">🏺</div>' +
          '<div class="tb-order-text" style="color:#cbd5e1;">' + (isTarget ? ('Tap Card for Step ' + stepNum + '!') : ('Step ' + stepNum)) + '</div>' +
        '</div>'
      );
    }).join('');

    var poolHtml = state.a3.pool.map(function (c) {
      var placed = state.a3.slots.some(function (s) { return s && s.id === c.id; });
      if (placed) return '';
      return (
        '<div class="tb-pool-card" draggable="true" data-cid="' + c.id + '" role="button" tabindex="0">' +
          '<div class="tb-order-art">' + imgWithFallback(c.img, c.text, c.emoji) + '</div>' +
          '<div class="tb-order-text">' + c.text + '</div>' +
        '</div>'
      );
    }).join('');

    stage.innerHTML = (
      '<div class="tb-panel">' +
        '<div class="tb-panel-top">' +
          '<div class="tb-panel-heading">📖 Activity 3: Put the Events in Order — Step ' + (nextSlot === -1 ? 6 : (nextSlot + 1)) + ' of 6</div>' +
          '<span class="tb-pill">Tap or Drag Story Cards in Order (1 → 6)</span>' +
        '</div>' +
        '<div class="tb-a3-layout">' +
          '<div class="tb-order-row">' + slotsHtml + '</div>' +
          '<div class="tb-order-row">' + poolHtml + '</div>' +
        '</div>' +
      '</div>'
    );

    function tryPlace(cid, slotIdx, cardEl) {
      var cardObj = D.events.filter(function (e) { return e.id === cid; })[0];
      if (!cardObj) return;
      var tIdx = (typeof slotIdx === 'number' && slotIdx >= 0) ? slotIdx : state.a3.slots.indexOf(null);
      if (tIdx < 0) return;
      if (cardObj.step === tIdx + 1) {
        state.a3.slots[tIdx] = cardObj;
        if (A) {
          A.playCorrect();
          A.speak(cardObj.text);
        }
        awardTeamXP(10);
        renderActivity3();
        if (state.a3.slots.indexOf(null) === -1) {
          spawnConfetti();
          var st = state.a3.mistakes === 0 ? 3 : (state.a3.mistakes <= 2 ? 2 : 1);
          setTimeout(function () { completeActivity(3, st); }, 1300);
        }
      } else {
        state.a3.mistakes++;
        if (cardEl) {
          cardEl.style.borderColor = '#f43f5e';
          setTimeout(function () { cardEl.style.borderColor = ''; }, 450);
        }
        if (A) A.praise(false);
      }
    }

    Array.prototype.forEach.call(stage.querySelectorAll('.tb-pool-card'), function (el) {
      var cid = el.getAttribute('data-cid');
      el.addEventListener('click', function () {
        tryPlace(cid, nextSlot, el);
      });
      el.addEventListener('dragstart', function (ev) {
        if (ev.dataTransfer) ev.dataTransfer.setData('text/plain', cid);
      });
    });

    Array.prototype.forEach.call(stage.querySelectorAll('.tb-order-slot'), function (slotEl) {
      var sIdx = Number(slotEl.getAttribute('data-slot'));
      slotEl.addEventListener('dragover', function (ev) { ev.preventDefault(); });
      slotEl.addEventListener('drop', function (ev) {
        ev.preventDefault();
        var cid = ev.dataTransfer && ev.dataTransfer.getData('text/plain');
        if (cid) tryPlace(cid, sIdx, null);
      });
    });
  }

  // =========================================================================
  // ACTIVITY 4: MAIN IDEA OR DETAIL? (pp. 73 & 81)
  // =========================================================================
  function initActivity4() {
    state.a4 = { idx: 0, mistakes: 0, locked: false, feedback: '' };
    renderActivity4();
  }

  function renderActivity4() {
    var stage = document.getElementById('tb-stage');
    var item = D.mainIdea[state.a4.idx];
    if (!stage || !item) return;

    stage.innerHTML = (
      '<div class="tb-panel">' +
        '<div class="tb-panel-top">' +
          '<div class="tb-panel-heading">⭐ Activity 4: Main Idea or Detail? — Card ' + (state.a4.idx + 1) + ' of ' + D.mainIdea.length + '</div>' +
          '<span class="tb-pill">Main Idea = The Big Idea ⭐ | Detail = Extra Info 🔍</span>' +
        '</div>' +
        '<div class="tb-a4-layout">' +
          '<div class="tb-mi-card">' +
            '<div class="tb-mi-art">' + imgWithFallback(item.img, item.sentence, item.emoji) + '</div>' +
            '<div class="tb-mi-sentence">“' + item.sentence + '”</div>' +
            (state.a4.feedback ? '<div class="tb-mi-explain">' + state.a4.feedback + '</div>' : '') +
          '</div>' +
          '<div class="tb-mi-buttons">' +
            '<button type="button" class="tb-mi-btn main" data-ans="main">' +
              '<span style="font-size:3rem;">⭐</span>' +
              '<span>MAIN IDEA</span>' +
              '<small>The most important big idea!</small>' +
            '</button>' +
            '<button type="button" class="tb-mi-btn detail" data-ans="detail">' +
              '<span style="font-size:3rem;">🔍</span>' +
              '<span>DETAIL</span>' +
              '<small>Extra information inside the story!</small>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );

    if (!state.a4.feedback) {
      setSpeech(item.sentence + ' Is this the Main Idea or a Detail?', true);
    }

    Array.prototype.forEach.call(stage.querySelectorAll('.tb-mi-btn'), function (btn) {
      btn.addEventListener('click', function () {
        if (state.a4.locked) return;
        var ans = btn.getAttribute('data-ans');
        if (ans === item.answer) {
          state.a4.locked = true;
          state.a4.feedback = '✅ ' + item.explain;
          renderActivity4();
          if (A) {
            A.playCorrect();
            A.speak(item.explain);
          }
          awardTeamXP(10);
          spawnConfetti();
          setTimeout(function () {
            if (state.a4.idx + 1 < D.mainIdea.length) {
              state.a4.idx++;
              state.a4.locked = false;
              state.a4.feedback = '';
              renderActivity4();
            } else {
              var st = state.a4.mistakes === 0 ? 3 : (state.a4.mistakes <= 2 ? 2 : 1);
              completeActivity(4, st);
            }
          }, 1800);
        } else {
          state.a4.mistakes++;
          btn.style.transform = 'translateX(-6px)';
          setTimeout(function () { btn.style.transform = ''; }, 350);
          if (A) A.praise(false);
        }
      });
    });
  }

  // =========================================================================
  // ACTIVITY 5: WHO AM I? (7 Riddles)
  // =========================================================================
  function initActivity5() {
    state.a5 = { idx: 0, mistakes: 0, locked: false };
    renderActivity5();
  }

  function renderActivity5() {
    var stage = document.getElementById('tb-stage');
    var rid = D.riddles[state.a5.idx];
    if (!stage || !rid) return;

    var optsHtml = rid.options.map(function (o) {
      return (
        '<div class="tb-riddle-opt" data-opt="' + o.id + '" role="button" tabindex="0">' +
          '<div class="tb-riddle-art">' + imgWithFallback(o.img, o.label, o.emoji) + '</div>' +
          '<div class="tb-riddle-label">' + o.label + '</div>' +
        '</div>'
      );
    }).join('');

    stage.innerHTML = (
      '<div class="tb-panel">' +
        '<div class="tb-panel-top">' +
          '<div class="tb-panel-heading">🕵️ Activity 5: Who Am I? — Riddle ' + (state.a5.idx + 1) + ' of ' + D.riddles.length + '</div>' +
          '<button type="button" class="tb-btn tb-btn-amber" id="a5-btn-listen">🔊 Read Riddle Aloud</button>' +
        '</div>' +
        '<div class="tb-a5-layout">' +
          '<div class="tb-riddle-banner">' + rid.clue + '</div>' +
          '<div class="tb-riddle-grid">' + optsHtml + '</div>' +
        '</div>' +
      '</div>'
    );

    setSpeech(rid.clue, true);

    var lBtn = document.getElementById('a5-btn-listen');
    if (lBtn) {
      lBtn.addEventListener('click', function () {
        if (A) A.speak(rid.clue);
      });
    }

    Array.prototype.forEach.call(stage.querySelectorAll('.tb-riddle-opt'), function (card) {
      card.addEventListener('click', function () {
        if (state.a5.locked) return;
        var picked = card.getAttribute('data-opt');
        if (picked === rid.answerId) {
          state.a5.locked = true;
          card.classList.add('correct');
          if (A) A.praise(true);
          awardTeamXP(10);
          spawnConfetti();
          setTimeout(function () {
            if (state.a5.idx + 1 < D.riddles.length) {
              state.a5.idx++;
              state.a5.locked = false;
              renderActivity5();
            } else {
              var st = state.a5.mistakes === 0 ? 3 : (state.a5.mistakes <= 2 ? 2 : 1);
              completeActivity(5, st);
            }
          }, 1200);
        } else {
          state.a5.mistakes++;
          card.classList.add('wrong');
          setTimeout(function () { card.classList.remove('wrong'); }, 500);
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
      A.speak('Well done! You completed Activity ' + aid + ' and earned ' + starsEarned + ' stars!');
    }

    var modal = document.getElementById('tb-modal-overlay');
    var card = document.getElementById('tb-modal-card');
    if (!modal || !card) { openHome(); return; }

    var meta = D.activities.filter(function (a) { return a.id === aid; })[0];
    card.innerHTML = (
      '<div style="font-size:3.4rem;">' + starsStr(starsEarned) + '</div>' +
      '<h2>🎉 ' + (meta ? meta.title : ('Activity ' + aid)) + ' Complete!</h2>' +
      '<p>Great teamwork! You earned <strong>' + starsEarned + ' Stars</strong> Helping Jannah!</p>' +
      '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">' +
        '<button type="button" class="tb-btn tb-btn-cyan" id="tb-m-home">📖 Back to The Time Book</button>' +
        (aid < 5
          ? '<button type="button" class="tb-btn tb-btn-emerald" id="tb-m-next">🚀 Next Activity (' + (aid + 1) + ') →</button>'
          : '<button type="button" class="tb-btn tb-btn-amber" id="tb-m-cert">🎓 Claim Certificate: You Saved Jannah!</button>') +
      '</div>'
    );
    modal.classList.add('open');

    document.getElementById('tb-m-home').onclick = function () { modal.classList.remove('open'); openHome(); };
    var nxt = document.getElementById('tb-m-next');
    if (nxt) nxt.onclick = function () { modal.classList.remove('open'); startActivity(aid + 1); };
    var crt = document.getElementById('tb-m-cert');
    if (crt) crt.onclick = function () { modal.classList.remove('open'); openCertificate(); };
  }

  function openCertificate() {
    state.view = 'cert';
    stopActivityTimer();
    renderHeader();
    spawnConfetti();
    if (A) A.playVictoryFanfare();
    setSpeech('You saved Jannah! Congratulations, Grade 3 Time Travelers!', true);

    var modal = document.getElementById('tb-modal-overlay');
    var card = document.getElementById('tb-modal-card');
    if (!modal || !card) return;

    card.innerHTML = (
      '<div style="max-width:440px;margin:0 auto 12px;border-radius:16px;overflow:hidden;border:2px solid #f59e0b;background:#000;">' +
        '<video src="video/g3_vid_r1.mp4" poster="img/scene-book-open.webp" controls autoplay muted playsinline style="width:100%;max-height:200px;object-fit:cover;"></video>' +
      '</div>' +
      '<h2>🎓 You Saved Jannah! — Time Traveler Certificate</h2>' +
      '<p>Awarded to <strong>Grade 3 English Adventure Academy</strong> for completing Unit 5 Lesson 1: <em>The Time Book</em> (pp. 72–81)!</p>' +
      '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:14px 0;">' +
        '<span class="tb-pill">⭐ Total Stars: ' + totalStars() + ' / 15</span>' +
        '<span class="tb-pill">🏺 Ancient Egypt Explorer</span>' +
        '<span class="tb-pill">👓 Helper of the Old Woman</span>' +
      '</div>' +
      '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">' +
        '<a href="worksheet.html" target="_blank" class="tb-btn tb-btn-amber" style="text-decoration:none;">🖨️ Print Worksheet &amp; Key</a>' +
        '<button type="button" class="tb-btn tb-btn-cyan" id="tb-cert-close">📖 Return to Book Map</button>' +
      '</div>'
    );
    modal.classList.add('open');

    document.getElementById('tb-cert-close').onclick = function () {
      modal.classList.remove('open');
      openHome();
    };
  }

  function openTeacherModal() {
    var modal = document.getElementById('tb-modal-overlay');
    var card = document.getElementById('tb-modal-card');
    if (!modal || !card) return;

    card.innerHTML = (
      '<h2>🎓 Teacher Answer Key — The Time Book (pp. 72–81)</h2>' +
      '<div class="tb-teacher-box">' +
        '<div><strong>Activity 1 (Maze Gate Answers):</strong> 1. A strange book (The Time Book) | 2. An ancient Egyptian city | 3. A kind old woman | 4. Her red polka-dot glasses | 5. The Pharaoh.</div>' +
        '<div><strong>Activity 2 (Unscramble — p. 75):</strong> 1. ANCIENT | 2. STRANGE | 3. PHARAOH | 4. CHARIOT | 5. SURPRISED | 6. SCARED.</div>' +
        '<div><strong>Activity 3 (Story Order — pp. 74–79):</strong> 1. Jannah found a strange book → 2. Opened book &amp; travelled to ancient city → 3. Met old woman who could not see chariot → 4. Gave her red glasses → 5. Pharaoh told guards to stop Jannah → 6. Woke up in bed (glasses on book cover).</div>' +
        '<div><strong>Activity 4 (Main Idea vs Detail — pp. 73 &amp; 81):</strong> MAIN IDEA: "With her special book, Jannah explores Cairo in ancient Egypt" &amp; "Jannah travels into the past to ancient Egypt with a magic book." DETAILS: lives in Cairo/loves to read, gives glasses to old woman, Pharaoh shouts Stop her, wakes up in bed.</div>' +
        '<div><strong>Activity 5 (Who Am I? Riddles):</strong> 1. The Pharaoh | 2. Red Glasses | 3. The Old Woman | 4. The Time Book | 5. Jannah | 6. The Guards | 7. A Chariot.</div>' +
      '</div>' +
      '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px;">' +
        '<button type="button" class="tb-btn tb-btn-amber" id="tb-t-unlock">⭐ Unlock All 15 Stars</button>' +
        '<button type="button" class="tb-btn tb-btn-coral" id="tb-t-reset">🗑️ Reset Stars &amp; Teams</button>' +
        '<a href="worksheet.html" target="_blank" class="tb-btn tb-btn-emerald" style="text-decoration:none;">🖨️ Print Worksheet + Answer Key</a>' +
        '<button type="button" class="tb-btn tb-btn-cyan" id="tb-t-close">✖ Close</button>' +
      '</div>'
    );
    modal.classList.add('open');

    document.getElementById('tb-t-unlock').onclick = function () {
      for (var i = 1; i <= 5; i++) state.stars[i] = 3;
      saveState();
      modal.classList.remove('open');
      openHome();
    };
    document.getElementById('tb-t-reset').onclick = function () {
      for (var i = 1; i <= 5; i++) state.stars[i] = 0;
      D.teams.forEach(function (t) { state.teams[t.id] = 0; });
      saveState();
      modal.classList.remove('open');
      openHome();
    };
    document.getElementById('tb-t-close').onclick = function () {
      modal.classList.remove('open');
    };
  }

  function spawnConfetti() {
    var layer = document.getElementById('tb-confetti');
    if (!layer) return;
    var colors = ['#f59e0b', '#38bdf8', '#10b981', '#f43f5e', '#fde047'];
    for (var i = 0; i < 26; i++) {
      var p = document.createElement('div');
      p.className = 'tb-confetti-piece';
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

    var homeBtn = document.getElementById('tb-btn-home');
    if (homeBtn) homeBtn.onclick = openHome;

    var listenBtn = document.getElementById('tb-btn-listen');
    if (listenBtn) listenBtn.onclick = function () { if (A) A.listenAgain(); };

    var teacherBtn = document.getElementById('tb-btn-teacher');
    if (teacherBtn) teacherBtn.onclick = openTeacherModal;

    var timerPill = document.getElementById('tb-timer-pill');
    if (timerPill) {
      timerPill.onclick = function () {
        state.timerPaused = !state.timerPaused;
        updateTimerDisplay();
      };
    }

    window.addEventListener('keydown', function (ev) {
      if (state.view !== 'a1' || state.a1.activeGate) return;
      if (ev.key === 'ArrowUp') tryMoveJannah(state.a1.r - 1, state.a1.c);
      else if (ev.key === 'ArrowDown') tryMoveJannah(state.a1.r + 1, state.a1.c);
      else if (ev.key === 'ArrowLeft') tryMoveJannah(state.a1.r, state.a1.c - 1);
      else if (ev.key === 'ArrowRight') tryMoveJannah(state.a1.r, state.a1.c + 1);
    });

    openHome();
  }

  window.TBApp = {
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
