/**
 * Grade 4 • Unit 5: Make Some Noise — "Sound Detectives"
 * Interactive Classroom Smartboard Engine (7 Missions + Certificate + Teacher Key)
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'eaa_g4_sound_detectives_v1';
  var D = window.SD_DATA;
  var A = window.SDAudio;

  var state = {
    view: 'home', // 'home' | 'm1'..'m7' | 'cert'
    stars: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
    teams: { dragon: 0, phoenix: 0, tiger: 0, wolf: 0 },
    activeTeam: 'dragon',
    mascotText: 'Welcome, Sound Detectives! Choose any mission on the map to begin investigating sounds and music!',
    // Mission runtime state
    m1: { idx: 0, cluesRevealed: 1, starsEarned: [], locked: false },
    m2: { idx: 0, mistakes: 0, selectedSfx: null, matched: false },
    m3: { idx: 0, mistakes: 0, locked: false },
    m4: { placed: {}, selectedId: null, mistakes: 0 },
    m5: { idx: 0, mistakes: 0, locked: false },
    m6: { slots: [null, null, null, null, null, null], pool: [], selectedCardId: null, mistakes: 0 },
    m7: { idx: 0, mistakes: 0, locked: false }
  };

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.stars) {
          for (var k = 1; k <= 7; k++) {
            state.stars[k] = Number(parsed.stars[k]) || 0;
          }
        }
        if (parsed && parsed.teams) {
          D.teams.forEach(function (t) {
            state.teams[t.id] = Number(parsed.teams[t.id]) || 0;
          });
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
    var sum = 0;
    for (var i = 1; i <= 7; i++) sum += (Number(state.stars[i]) || 0);
    return sum;
  }

  function completedMissionsCount() {
    var c = 0;
    for (var i = 1; i <= 7; i++) {
      if ((Number(state.stars[i]) || 0) > 0) c++;
    }
    return c;
  }

  function awardTeamPoints(pts) {
    var tid = state.activeTeam || 'dragon';
    state.teams[tid] = (Number(state.teams[tid]) || 0) + pts;
    saveState();
    renderHeader();
    try {
      if (window.AdventureAcademy && typeof window.AdventureAcademy.awardXP === 'function') {
        window.AdventureAcademy.awardXP(pts, 'Sound Detectives');
      }
    } catch (e) {}
  }

  function setMascotSpeech(text, speakAloud) {
    state.mascotText = text || '';
    var el = document.getElementById('sd-mascot-speech');
    if (el) el.textContent = state.mascotText;
    if (speakAloud !== false && A) {
      A.speak(state.mascotText);
    }
  }

  function imgWithFallback(src, alt, emoji, cls) {
    var safeAlt = (alt || '').replace(/"/g, '&quot;');
    var safeCls = cls ? ' class="' + cls + '"' : '';
    return (
      '<img src="' + src + '" alt="' + safeAlt + '"' + safeCls +
      ' onerror="this.style.display=\'none\';if(this.nextElementSibling)this.nextElementSibling.style.display=\'flex\';" />' +
      '<span class="sd-emoji-fallback" style="display:none;align-items:center;justify-content:center;font-size:3.2rem;">' + (emoji || '🎵') + '</span>'
    );
  }

  function renderStarsString(count) {
    var s = '';
    for (var i = 1; i <= 3; i++) {
      s += i <= count ? '⭐' : '☆';
    }
    return s;
  }

  // =========================================================================
  // HEADER & MASCOT BAR
  // =========================================================================
  function renderHeader() {
    var teamStrip = document.getElementById('sd-team-strip');
    if (teamStrip) {
      teamStrip.innerHTML = D.teams.map(function (t) {
        var activeCls = state.activeTeam === t.id ? ' active' : '';
        var sc = Number(state.teams[t.id]) || 0;
        return (
          '<button type="button" class="sd-team-pill' + activeCls + '" data-team="' + t.id + '" title="Tap to select Team ' + t.name + ' (+10 XP on right click)">' +
            '<span>' + t.emoji + ' ' + t.name + '</span>' +
            '<span class="sd-team-score">' + sc + '</span>' +
          '</button>'
        );
      }).join('');

      Array.prototype.forEach.call(teamStrip.querySelectorAll('.sd-team-pill'), function (btn) {
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

    var starTotalEl = document.getElementById('sd-total-stars');
    if (starTotalEl) {
      starTotalEl.textContent = '⭐ ' + totalStars() + ' / 21';
    }

    var backBtn = document.getElementById('sd-btn-home');
    if (backBtn) {
      backBtn.style.display = state.view === 'home' ? 'none' : 'inline-flex';
    }
  }

  // =========================================================================
  // HOME MAP (7 Missions + Certificate Button)
  // =========================================================================
  function openHome() {
    state.view = 'home';
    renderHeader();
    var doneCount = completedMissionsCount();
    setMascotSpeech(
      doneCount === 7
        ? 'Hooray! You completed all 7 Sound Detective missions! Tap your Golden Detective Certificate below!'
        : 'Welcome, Sound Detectives! Tap any of the 7 missions on the map to explore Foley sound effects and Beethoven!',
      false
    );

    var stage = document.getElementById('sd-stage');
    if (!stage) return;

    var cardsHtml = D.missions.map(function (m) {
      var st = Number(state.stars[m.id]) || 0;
      var doneCls = st > 0 ? ' completed' : '';
      return (
        '<div class="sd-mission-card' + doneCls + '" data-mission="' + m.id + '" role="button" tabindex="0">' +
          '<div class="sd-mission-art">' +
            '<span class="sd-mission-num">' + m.num + '</span>' +
            '<span class="sd-mission-stars">' + renderStarsString(st) + '</span>' +
            imgWithFallback(m.img, m.title, m.emoji) +
          '</div>' +
          '<div class="sd-mission-caption">' +
            '<div class="sd-mission-title">' + m.title + '</div>' +
            '<div class="sd-mission-sub">' + m.subtitle + '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    var certReady = doneCount === 7;
    cardsHtml += (
      '<div class="sd-mission-card' + (certReady ? ' completed' : '') + '" id="sd-card-cert" role="button" tabindex="0" style="border-color:rgba(245,158,11,0.75);">' +
        '<div class="sd-mission-art" style="background:radial-gradient(circle at 50% 35%, rgba(245,158,11,0.35), rgba(15,23,42,0.95));">' +
          '<span class="sd-mission-num" style="background:#f59e0b;color:#060911;">FINAL</span>' +
          '<span class="sd-mission-stars">🏆 ' + doneCount + '/7</span>' +
          imgWithFallback('img/fox-detective.webp', 'Detective Certificate', '🎓') +
        '</div>' +
        '<div class="sd-mission-caption">' +
          '<div class="sd-mission-title" style="color:#fde68a;">🎓 Detective Certificate</div>' +
          '<div class="sd-mission-sub">' + (certReady ? 'All 7 missions finished! Tap to claim your certificate!' : 'Finish missions to earn your Master Sound Detective badge!') + '</div>' +
        '</div>' +
      '</div>'
    );

    stage.innerHTML = '<div class="sd-map-grid">' + cardsHtml + '</div>';

    Array.prototype.forEach.call(stage.querySelectorAll('[data-mission]'), function (card) {
      card.addEventListener('click', function () {
        var mid = Number(card.getAttribute('data-mission'));
        startMission(mid);
      });
    });

    var certCard = document.getElementById('sd-card-cert');
    if (certCard) {
      certCard.addEventListener('click', function () {
        openCertificate();
      });
    }
  }

  function startMission(mid) {
    state.view = 'm' + mid;
    renderHeader();
    var mMeta = D.missions.filter(function (m) { return m.id === mid; })[0];
    if (mMeta) {
      setMascotSpeech(mMeta.intro, true);
    }
    if (mid === 1) initMission1();
    else if (mid === 2) initMission2();
    else if (mid === 3) initMission3();
    else if (mid === 4) initMission4();
    else if (mid === 5) initMission5();
    else if (mid === 6) initMission6();
    else if (mid === 7) initMission7();
  }

  // =========================================================================
  // MISSION 1: SOUND DETECTIVE (3 Progressive Clues -> 4 Picture Choices)
  // =========================================================================
  function initMission1() {
    state.m1 = { idx: 0, cluesRevealed: 1, starsEarned: [], locked: false };
    renderMission1();
  }

  function renderMission1() {
    var stage = document.getElementById('sd-stage');
    var round = D.m1[state.m1.idx];
    if (!stage || !round) return;

    var potentialStars = Math.max(1, 4 - state.m1.cluesRevealed);

    var cluesHtml = round.clues.map(function (cText, i) {
      var unlocked = (i + 1) <= state.m1.cluesRevealed;
      return (
        '<div class="sd-clue-card' + (unlocked ? '' : ' locked') + '" data-clue-idx="' + i + '">' +
          '<span class="sd-clue-badge">🔎 Clue ' + (i + 1) + '</span>' +
          '<span>' + (unlocked ? cText : 'Tap "Reveal Next Clue" if you need another hint!') + '</span>' +
        '</div>'
      );
    }).join('');

    var optionsHtml = round.options.map(function (opt) {
      return (
        '<div class="sd-choice-card" data-opt="' + opt.id + '" role="button" tabindex="0">' +
          '<div class="sd-choice-art">' +
            imgWithFallback(opt.img, opt.label, opt.emoji) +
          '</div>' +
          '<div class="sd-choice-caption">' + opt.label + '</div>' +
        '</div>'
      );
    }).join('');

    stage.innerHTML = (
      '<div class="sd-mission-panel">' +
        '<div class="sd-mission-top">' +
          '<div class="sd-mission-heading">🔎 Mission 1: Sound Detective — Mystery Sound ' + (state.m1.idx + 1) + ' of ' + D.m1.length + '</div>' +
          '<div style="display:flex;gap:10px;align-items:center;">' +
            '<span class="sd-progress-pill">Round Stars: ' + renderStarsString(potentialStars) + '</span>' +
            '<button type="button" class="sd-btn sd-btn-amber" id="m1-btn-sfx">🔊 Hear Mystery Sound</button>' +
            (state.m1.cluesRevealed < 3
              ? '<button type="button" class="sd-btn sd-btn-cyan" id="m1-btn-clue">💡 Reveal Clue ' + (state.m1.cluesRevealed + 1) + '</button>'
              : '') +
          '</div>' +
        '</div>' +
        '<div class="sd-m1-layout">' +
          '<div class="sd-clues-box">' +
            cluesHtml +
          '</div>' +
          '<div class="sd-choices-grid">' +
            optionsHtml +
          '</div>' +
        '</div>' +
      '</div>'
    );

    setMascotSpeech(round.clues[state.m1.cluesRevealed - 1], true);

    var sfxBtn = document.getElementById('m1-btn-sfx');
    if (sfxBtn) {
      sfxBtn.addEventListener('click', function () {
        if (A) A.playSfx(round.sfx);
      });
    }

    var clueBtn = document.getElementById('m1-btn-clue');
    if (clueBtn) {
      clueBtn.addEventListener('click', function () {
        if (state.m1.cluesRevealed < 3) {
          state.m1.cluesRevealed++;
          renderMission1();
        }
      });
    }

    Array.prototype.forEach.call(stage.querySelectorAll('.sd-choice-card'), function (card) {
      card.addEventListener('click', function () {
        if (state.m1.locked) return;
        var picked = card.getAttribute('data-opt');
        if (picked === round.answerId) {
          state.m1.locked = true;
          card.classList.add('correct');
          if (A) {
            A.playSfx(round.sfx);
            setTimeout(function () { A.praise(true); }, 350);
          }
          var earned = Math.max(1, 4 - state.m1.cluesRevealed);
          state.m1.starsEarned.push(earned);
          awardTeamPoints(10);
          spawnConfetti();
          setTimeout(function () {
            if (state.m1.idx + 1 < D.m1.length) {
              state.m1.idx++;
              state.m1.cluesRevealed = 1;
              state.m1.locked = false;
              renderMission1();
            } else {
              var avg = Math.round(state.m1.starsEarned.reduce(function (a, b) { return a + b; }, 0) / state.m1.starsEarned.length);
              completeMission(1, Math.max(1, Math.min(3, avg)));
            }
          }, 1300);
        } else {
          card.classList.add('wrong');
          if (A) A.praise(false);
          if (state.m1.cluesRevealed < 3) {
            state.m1.cluesRevealed++;
            setTimeout(function () { renderMission1(); }, 650);
          } else {
            setTimeout(function () { card.classList.remove('wrong'); }, 600);
          }
        }
      });
    });
  }

  // =========================================================================
  // MISSION 2: SOUND EFFECTS STUDIO (Silent Scene + Drag/Tap Sound Button)
  // =========================================================================
  function initMission2() {
    state.m2 = { idx: 0, mistakes: 0, selectedSfx: null, matched: false };
    renderMission2();
  }

  function renderMission2() {
    var stage = document.getElementById('sd-stage');
    var sc = D.m2.scenes[state.m2.idx];
    if (!stage || !sc) return;

    var mediaHtml = '';
    if (sc.video) {
      mediaHtml = (
        '<video src="' + sc.video + '" poster="' + sc.img + '" autoplay loop muted playsinline ' +
        'onerror="this.outerHTML=\'<img src=&quot;' + sc.img + '&quot; alt=&quot;Scene&quot; />\'">' +
        '</video>'
      );
    } else {
      mediaHtml = imgWithFallback(sc.img, sc.title, sc.emoji);
    }

    var bankHtml = D.m2.bank.map(function (b) {
      var selCls = state.m2.selectedSfx === b.id ? ' selected' : '';
      return (
        '<button type="button" class="sd-sfx-token' + selCls + '" draggable="true" data-sfx-id="' + b.id + '">' +
          '<span style="font-size:2rem;">' + b.emoji + '</span>' +
          '<div style="text-align:left;">' +
            '<div>' + b.label + '</div>' +
            '<div style="font-size:0.85rem;color:#38bdf8;">Foley Tool: ' + b.tool + '</div>' +
          '</div>' +
        '</button>'
      );
    }).join('');

    stage.innerHTML = (
      '<div class="sd-mission-panel">' +
        '<div class="sd-mission-top">' +
          '<div class="sd-mission-heading">🎬 Mission 2: Sound Effects Studio — Scene ' + (state.m2.idx + 1) + ' of ' + D.m2.scenes.length + '</div>' +
          '<span class="sd-progress-pill">' + sc.title + '</span>' +
        '</div>' +
        '<div class="sd-m2-layout">' +
          '<div class="sd-scene-screen" id="m2-drop-screen">' +
            '<div class="sd-scene-viewport">' +
              mediaHtml +
            '</div>' +
            '<div class="sd-drop-target-bar' + (state.m2.matched ? ' matched' : '') + '" id="m2-drop-zone">' +
              (state.m2.matched
                ? '✅ Sound Effect Added! Playing Scene with Foley Sound!'
                : '🎯 Tap or Drag the Right Foley Sound Effect Here!') +
            '</div>' +
          '</div>' +
          '<div class="sd-sfx-bank">' +
            '<div style="font-family:var(--font-display);font-size:1.25rem;color:#fde68a;">🎛️ Foley Soundboard (Tap to preview & select):</div>' +
            bankHtml +
          '</div>' +
        '</div>' +
      '</div>'
    );

    setMascotSpeech(sc.prompt, true);

    function tryMatchSfx(sfxId, btnEl) {
      if (state.m2.matched) return;
      if (sfxId === sc.answerId) {
        state.m2.matched = true;
        var dz = document.getElementById('m2-drop-zone');
        if (dz) {
          dz.className = 'sd-drop-target-bar matched';
          dz.textContent = '✅ Perfect Match! Playing Scene with Sound!';
        }
        if (A) {
          A.playSfx(sfxId);
          setTimeout(function () { A.praise(true); }, 450);
        }
        awardTeamPoints(10);
        spawnConfetti();
        setTimeout(function () {
          if (state.m2.idx + 1 < D.m2.scenes.length) {
            state.m2.idx++;
            state.m2.selectedSfx = null;
            state.m2.matched = false;
            renderMission2();
          } else {
            var st = state.m2.mistakes === 0 ? 3 : (state.m2.mistakes <= 2 ? 2 : 1);
            completeMission(2, st);
          }
        }, 1450);
      } else {
        state.m2.mistakes++;
        if (btnEl) {
          btnEl.classList.add('wrong');
          setTimeout(function () { btnEl.classList.remove('wrong'); }, 550);
        }
        if (A) A.praise(false);
      }
    }

    Array.prototype.forEach.call(stage.querySelectorAll('.sd-sfx-token'), function (btn) {
      var sid = btn.getAttribute('data-sfx-id');
      btn.addEventListener('click', function () {
        if (A) A.playSfx(sid);
        state.m2.selectedSfx = sid;
        tryMatchSfx(sid, btn);
      });
      btn.addEventListener('dragstart', function (ev) {
        state.m2.selectedSfx = sid;
        if (ev.dataTransfer) ev.dataTransfer.setData('text/plain', sid);
      });
    });

    var dropScreen = document.getElementById('m2-drop-screen');
    if (dropScreen) {
      dropScreen.addEventListener('dragover', function (ev) { ev.preventDefault(); });
      dropScreen.addEventListener('drop', function (ev) {
        ev.preventDefault();
        var sid = (ev.dataTransfer && ev.dataTransfer.getData('text/plain')) || state.m2.selectedSfx;
        if (sid) tryMatchSfx(sid, null);
      });
      dropScreen.addEventListener('click', function () {
        if (state.m2.selectedSfx) tryMatchSfx(state.m2.selectedSfx, null);
      });
    }
  }

  // =========================================================================
  // MISSION 3: LOUD OR QUIET? (8 Items)
  // =========================================================================
  function initMission3() {
    state.m3 = { idx: 0, mistakes: 0, locked: false };
    renderMission3();
  }

  function renderMission3() {
    var stage = document.getElementById('sd-stage');
    var item = D.m3[state.m3.idx];
    if (!stage || !item) return;

    stage.innerHTML = (
      '<div class="sd-mission-panel">' +
        '<div class="sd-mission-top">' +
          '<div class="sd-mission-heading">📢 Mission 3: Loud or Quiet? — Sound ' + (state.m3.idx + 1) + ' of ' + D.m3.length + '</div>' +
          '<button type="button" class="sd-btn sd-btn-amber" id="m3-btn-play">🔊 Play Sound</button>' +
        '</div>' +
        '<div class="sd-m3-layout">' +
          '<div class="sd-m3-showcase">' +
            '<div class="sd-m3-art">' +
              imgWithFallback(item.img, item.name, item.emoji) +
            '</div>' +
            '<div class="sd-m3-info">' +
              '<h3>' + item.name + '</h3>' +
              '<p>' + item.sentence + '</p>' +
            '</div>' +
          '</div>' +
          '<div class="sd-lq-buttons">' +
            '<button type="button" class="sd-lq-btn loud" data-ans="loud">' +
              '<span style="font-size:3rem;">📢</span>' +
              '<span>LOUD!</span>' +
            '</button>' +
            '<button type="button" class="sd-lq-btn quiet" data-ans="quiet">' +
              '<span style="font-size:3rem;">🤫</span>' +
              '<span>QUIET!</span>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );

    if (A) A.playSfx(item.sfx);
    setMascotSpeech(item.name + '. ' + item.sentence + ' Is it LOUD or QUIET?', true);

    var playBtn = document.getElementById('m3-btn-play');
    if (playBtn) {
      playBtn.addEventListener('click', function () {
        if (A) A.playSfx(item.sfx);
      });
    }

    Array.prototype.forEach.call(stage.querySelectorAll('.sd-lq-btn'), function (btn) {
      btn.addEventListener('click', function () {
        if (state.m3.locked) return;
        var ans = btn.getAttribute('data-ans');
        if (ans === item.answer) {
          state.m3.locked = true;
          if (A) A.praise(true);
          awardTeamPoints(10);
          spawnConfetti();
          setTimeout(function () {
            if (state.m3.idx + 1 < D.m3.length) {
              state.m3.idx++;
              state.m3.locked = false;
              renderMission3();
            } else {
              var st = state.m3.mistakes === 0 ? 3 : (state.m3.mistakes <= 2 ? 2 : 1);
              completeMission(3, st);
            }
          }, 1150);
        } else {
          state.m3.mistakes++;
          btn.style.transform = 'translateX(-8px)';
          setTimeout(function () { btn.style.transform = ''; }, 350);
          if (A) A.praise(false);
        }
      });
    });
  }

  // =========================================================================
  // MISSION 4: WHERE ARE THEY? — CONCERT HALL (7 Hotspots)
  // =========================================================================
  function initMission4() {
    state.m4 = { placed: {}, selectedId: D.m4.targets[0].id, mistakes: 0 };
    renderMission4();
  }

  function renderMission4() {
    var stage = document.getElementById('sd-stage');
    if (!stage) return;

    var placedCount = Object.keys(state.m4.placed).length;

    var pinsHtml = D.m4.targets.map(function (t, i) {
      var isFilled = Boolean(state.m4.placed[t.id]);
      return (
        '<button type="button" class="sd-hotspot' + (isFilled ? ' filled' : '') + '" data-spot="' + t.id + '" ' +
          'style="left:' + t.x + '%;top:' + t.y + '%;" title="' + t.clue + '">' +
          (isFilled ? (t.emoji + ' ' + t.label) : ('🎯 ' + (i + 1) + '. Tap Here')) +
        '</button>'
      );
    }).join('');

    var labelsHtml = D.m4.targets.map(function (t, i) {
      var isPlaced = Boolean(state.m4.placed[t.id]);
      var isSel = state.m4.selectedId === t.id && !isPlaced;
      return (
        '<button type="button" class="sd-label-chip' + (isPlaced ? ' placed' : '') + (isSel ? ' selected' : '') + '" ' +
          'draggable="' + (!isPlaced) + '" data-chip="' + t.id + '">' +
          '<span>' + (i + 1) + '. ' + t.emoji + ' ' + t.label + '</span>' +
          (isPlaced ? '<span>✅</span>' : '') +
        '</button>'
      );
    }).join('');

    var activeTarget = D.m4.targets.filter(function (t) { return t.id === state.m4.selectedId; })[0];

    stage.innerHTML = (
      '<div class="sd-mission-panel">' +
        '<div class="sd-mission-top">' +
          '<div class="sd-mission-heading">🎻 Mission 4: Where Are They? — Concert Hall (' + placedCount + ' / ' + D.m4.targets.length + ')</div>' +
          '<span class="sd-progress-pill">' + (activeTarget ? ('Clue: ' + activeTarget.clue) : 'All Placed!') + '</span>' +
        '</div>' +
        '<div class="sd-m4-layout">' +
          '<div class="sd-hall-canvas">' +
            '<img src="' + D.m4.backdrop + '" alt="Concert Hall" />' +
            pinsHtml +
          '</div>' +
          '<div class="sd-label-bank">' +
            '<div style="font-family:var(--font-display);font-size:1.15rem;color:#fde68a;">🏷️ Tap a Word, Then Tap Number on Stage:</div>' +
            labelsHtml +
          '</div>' +
        '</div>' +
      '</div>'
    );

    if (activeTarget) {
      setMascotSpeech('Find number ' + (D.m4.targets.indexOf(activeTarget) + 1) + ': ' + activeTarget.label + '! ' + activeTarget.clue, false);
    }

    function tryPlace(chipId, spotId, spotEl) {
      if (!chipId || state.m4.placed[spotId]) return;
      if (chipId === spotId) {
        state.m4.placed[spotId] = true;
        if (A) A.praise(true);
        awardTeamPoints(10);
        // Select next unplaced
        var nextUnplaced = D.m4.targets.filter(function (t) { return !state.m4.placed[t.id]; })[0];
        state.m4.selectedId = nextUnplaced ? nextUnplaced.id : null;
        renderMission4();
        if (!nextUnplaced) {
          spawnConfetti();
          var st = state.m4.mistakes === 0 ? 3 : (state.m4.mistakes <= 2 ? 2 : 1);
          setTimeout(function () { completeMission(4, st); }, 1100);
        }
      } else {
        state.m4.mistakes++;
        if (spotEl) {
          spotEl.style.borderColor = '#f43f5e';
          setTimeout(function () { spotEl.style.borderColor = ''; }, 500);
        }
        if (A) A.praise(false);
      }
    }

    Array.prototype.forEach.call(stage.querySelectorAll('.sd-label-chip'), function (chip) {
      var cid = chip.getAttribute('data-chip');
      chip.addEventListener('click', function () {
        if (state.m4.placed[cid]) return;
        state.m4.selectedId = cid;
        var tgt = D.m4.targets.filter(function (t) { return t.id === cid; })[0];
        if (tgt && A) A.speak(tgt.label + '. ' + tgt.clue);
        renderMission4();
      });
      chip.addEventListener('dragstart', function (ev) {
        state.m4.selectedId = cid;
        if (ev.dataTransfer) ev.dataTransfer.setData('text/plain', cid);
      });
    });

    Array.prototype.forEach.call(stage.querySelectorAll('.sd-hotspot'), function (spot) {
      var sid = spot.getAttribute('data-spot');
      spot.addEventListener('click', function () {
        tryPlace(state.m4.selectedId, sid, spot);
      });
      spot.addEventListener('dragover', function (ev) { ev.preventDefault(); });
      spot.addEventListener('drop', function (ev) {
        ev.preventDefault();
        var cid = (ev.dataTransfer && ev.dataTransfer.getData('text/plain')) || state.m4.selectedId;
        tryPlace(cid, sid, spot);
      });
    });
  }

  // =========================================================================
  // MISSION 5: THE TWO DOORS (10 Cards -> Foley World vs Beethoven's World)
  // =========================================================================
  function initMission5() {
    state.m5 = { idx: 0, mistakes: 0, locked: false };
    renderMission5();
  }

  function renderMission5() {
    var stage = document.getElementById('sd-stage');
    var card = D.m5[state.m5.idx];
    if (!stage || !card) return;

    stage.innerHTML = (
      '<div class="sd-mission-panel">' +
        '<div class="sd-mission-top">' +
          '<div class="sd-mission-heading">🚪 Mission 5: The Two Doors — Card ' + (state.m5.idx + 1) + ' of ' + D.m5.length + '</div>' +
          '<span class="sd-progress-pill">Tap or Drag to the Right Door!</span>' +
        '</div>' +
        '<div class="sd-m5-layout">' +
          '<div class="sd-door foley" data-door="foley" role="button" tabindex="0">' +
            '<div class="sd-door-icon">🎬</div>' +
            '<div class="sd-door-title">The World of Foley</div>' +
            '<div class="sd-door-sub">Film Sound Studio, Coconuts, Metal & Props</div>' +
          '</div>' +
          '<div class="sd-sort-card" id="m5-active-card" draggable="true">' +
            '<div class="sd-sort-card-art">' +
              imgWithFallback(card.img, card.text, card.emoji) +
            '</div>' +
            '<div class="sd-sort-card-text">' + card.text + '</div>' +
          '</div>' +
          '<div class="sd-door beethoven" data-door="beethoven" role="button" tabindex="0">' +
            '<div class="sd-door-icon">🎹</div>' +
            '<div class="sd-door-title">Beethoven’s World</div>' +
            '<div class="sd-door-sub">Composer, 9th Symphony, Concert Hall & Orchestra</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );

    setMascotSpeech(card.text, true);

    function chooseDoor(doorId, doorEl) {
      if (state.m5.locked) return;
      if (doorId === card.door) {
        state.m5.locked = true;
        if (A) {
          A.playSfx(doorId === 'foley' ? 'horse' : 'orchestra_chord');
          setTimeout(function () { A.praise(true); }, 350);
        }
        awardTeamPoints(10);
        spawnConfetti();
        setTimeout(function () {
          if (state.m5.idx + 1 < D.m5.length) {
            state.m5.idx++;
            state.m5.locked = false;
            renderMission5();
          } else {
            var st = state.m5.mistakes === 0 ? 3 : (state.m5.mistakes <= 2 ? 2 : 1);
            completeMission(5, st);
          }
        }, 1150);
      } else {
        state.m5.mistakes++;
        if (doorEl) {
          doorEl.style.transform = 'translateX(-8px)';
          setTimeout(function () { doorEl.style.transform = ''; }, 350);
        }
        if (A) A.praise(false);
      }
    }

    Array.prototype.forEach.call(stage.querySelectorAll('.sd-door'), function (doorEl) {
      var did = doorEl.getAttribute('data-door');
      doorEl.addEventListener('click', function () {
        chooseDoor(did, doorEl);
      });
      doorEl.addEventListener('dragover', function (ev) {
        ev.preventDefault();
        doorEl.classList.add('drag-over');
      });
      doorEl.addEventListener('dragleave', function () {
        doorEl.classList.remove('drag-over');
      });
      doorEl.addEventListener('drop', function (ev) {
        ev.preventDefault();
        doorEl.classList.remove('drag-over');
        chooseDoor(did, doorEl);
      });
    });
  }

  // =========================================================================
  // MISSION 6: PUT THE EVENTS IN ORDER (6 Story Cards — Beethoven's 9th)
  // =========================================================================
  function initMission6() {
    var shuffled = D.m6.slice().sort(function () { return Math.random() - 0.5; });
    // Ensure not already sorted
    if (shuffled[0].step === 1 && shuffled[1].step === 2) {
      shuffled.reverse();
    }
    state.m6 = {
      slots: [null, null, null, null, null, null],
      pool: shuffled,
      selectedCardId: shuffled[0].id,
      mistakes: 0
    };
    renderMission6();
  }

  function renderMission6() {
    var stage = document.getElementById('sd-stage');
    if (!stage) return;

    var nextSlotIdx = state.m6.slots.indexOf(null);

    var slotsHtml = state.m6.slots.map(function (placedCard, i) {
      var stepNum = i + 1;
      if (placedCard) {
        return (
          '<div class="sd-order-slot filled" data-slot="' + i + '">' +
            '<div class="sd-slot-num">' + stepNum + '</div>' +
            '<div class="sd-order-art">' +
              imgWithFallback(placedCard.img, placedCard.text, placedCard.emoji) +
            '</div>' +
            '<div class="sd-order-text">' + placedCard.text + '</div>' +
          '</div>'
        );
      }
      var isTargetSlot = i === nextSlotIdx;
      return (
        '<div class="sd-order-slot" data-slot="' + i + '" style="' + (isTargetSlot ? 'border-color:#38bdf8;background:rgba(56,189,248,0.12);' : '') + '">' +
          '<div class="sd-slot-num">' + stepNum + '</div>' +
          '<div class="sd-order-art" style="font-size:2.4rem;">🎯</div>' +
          '<div class="sd-order-text" style="color:#94a3b8;">' +
            (isTargetSlot ? 'Tap the Story Card for Step ' + stepNum + ' below!' : 'Step ' + stepNum) +
          '</div>' +
        '</div>'
      );
    }).join('');

    var poolHtml = state.m6.pool.map(function (c) {
      var isPlaced = state.m6.slots.some(function (s) { return s && s.id === c.id; });
      if (isPlaced) return '';
      var isSel = state.m6.selectedCardId === c.id;
      return (
        '<div class="sd-pool-card' + (isSel ? ' selected' : '') + '" draggable="true" data-card="' + c.id + '" role="button" tabindex="0">' +
          '<div class="sd-pool-art">' +
            imgWithFallback(c.img, c.text, c.emoji) +
          '</div>' +
          '<div class="sd-pool-text">' + c.text + '</div>' +
        '</div>'
      );
    }).join('');

    stage.innerHTML = (
      '<div class="sd-mission-panel">' +
        '<div class="sd-mission-top">' +
          '<div class="sd-mission-heading">🎼 Mission 6: Put the Events in Order — Step ' + (nextSlotIdx === -1 ? 6 : (nextSlotIdx + 1)) + ' of 6</div>' +
          '<span class="sd-progress-pill">Tap or Drag the Next Story Card in Order (1 → 6)</span>' +
        '</div>' +
        '<div class="sd-m6-layout">' +
          '<div class="sd-order-slots">' + slotsHtml + '</div>' +
          '<div class="sd-order-pool">' + poolHtml + '</div>' +
        '</div>' +
      '</div>'
    );

    function tryPlaceCardInSlot(cardId, slotIndex, cardEl) {
      var cardObj = D.m6.filter(function (c) { return c.id === cardId; })[0];
      if (!cardObj) return;
      var targetIdx = (typeof slotIndex === 'number' && slotIndex >= 0) ? slotIndex : state.m6.slots.indexOf(null);
      if (targetIdx < 0) return;

      if (cardObj.step === targetIdx + 1) {
        state.m6.slots[targetIdx] = cardObj;
        if (A) {
          A.playSfx(cardObj.sfx || 'piano_calm');
          A.speak(cardObj.text);
        }
        awardTeamPoints(10);
        renderMission6();
        if (state.m6.slots.indexOf(null) === -1) {
          spawnConfetti();
          var st = state.m6.mistakes === 0 ? 3 : (state.m6.mistakes <= 2 ? 2 : 1);
          setTimeout(function () { completeMission(6, st); }, 1400);
        }
      } else {
        state.m6.mistakes++;
        if (cardEl) {
          cardEl.style.borderColor = '#f43f5e';
          cardEl.style.transform = 'translateX(-6px)';
          setTimeout(function () {
            cardEl.style.borderColor = '';
            cardEl.style.transform = '';
          }, 450);
        }
        if (A) A.praise(false);
      }
    }

    Array.prototype.forEach.call(stage.querySelectorAll('.sd-pool-card'), function (cardEl) {
      var cid = cardEl.getAttribute('data-card');
      cardEl.addEventListener('click', function () {
        state.m6.selectedCardId = cid;
        tryPlaceCardInSlot(cid, nextSlotIdx, cardEl);
      });
      cardEl.addEventListener('dragstart', function (ev) {
        state.m6.selectedCardId = cid;
        if (ev.dataTransfer) ev.dataTransfer.setData('text/plain', cid);
      });
    });

    Array.prototype.forEach.call(stage.querySelectorAll('.sd-order-slot'), function (slotEl) {
      var sIdx = Number(slotEl.getAttribute('data-slot'));
      slotEl.addEventListener('dragover', function (ev) { ev.preventDefault(); });
      slotEl.addEventListener('drop', function (ev) {
        ev.preventDefault();
        var cid = (ev.dataTransfer && ev.dataTransfer.getData('text/plain')) || state.m6.selectedCardId;
        if (cid) tryPlaceCardInSlot(cid, sIdx, null);
      });
    });
  }

  // =========================================================================
  // MISSION 7: HOW DOES HE FEEL? (6 Rounds with Live Music + 4 Feelings)
  // =========================================================================
  function initMission7() {
    state.m7 = { idx: 0, mistakes: 0, locked: false };
    renderMission7();
  }

  function renderMission7() {
    var stage = document.getElementById('sd-stage');
    var round = D.m7[state.m7.idx];
    if (!stage || !round) return;

    var feelingsHtml = D.feelings.map(function (f) {
      return (
        '<button type="button" class="sd-feel-btn" data-feel="' + f.id + '">' +
          '<span class="sd-feel-emoji">' + f.emoji + '</span>' +
          '<span class="sd-feel-label">' + f.label + '</span>' +
        '</button>'
      );
    }).join('');

    stage.innerHTML = (
      '<div class="sd-mission-panel">' +
        '<div class="sd-mission-top">' +
          '<div class="sd-mission-heading">😊 Mission 7: How Does He Feel? — Round ' + (state.m7.idx + 1) + ' of ' + D.m7.length + '</div>' +
          '<button type="button" class="sd-btn sd-btn-amber" id="m7-btn-music">' + round.musicLabel + '</button>' +
        '</div>' +
        '<div class="sd-m7-layout">' +
          '<div class="sd-m7-story">' +
            '<div class="sd-m7-art">' +
              imgWithFallback(round.img, round.title, round.emoji) +
            '</div>' +
            '<div class="sd-m7-text">' +
              '<h3>' + round.title + '</h3>' +
              '<p>' + round.story + '</p>' +
            '</div>' +
          '</div>' +
          '<div class="sd-feelings-grid">' +
            feelingsHtml +
          '</div>' +
        '</div>' +
      '</div>'
    );

    if (A) A.playSfx(round.sfx);
    setMascotSpeech(round.story + ' How does he feel?', true);

    var musicBtn = document.getElementById('m7-btn-music');
    if (musicBtn) {
      musicBtn.addEventListener('click', function () {
        if (A) A.playSfx(round.sfx);
      });
    }

    Array.prototype.forEach.call(stage.querySelectorAll('.sd-feel-btn'), function (btn) {
      btn.addEventListener('click', function () {
        if (state.m7.locked) return;
        var picked = btn.getAttribute('data-feel');
        if (picked === round.answer) {
          state.m7.locked = true;
          btn.style.borderColor = '#10b981';
          btn.style.background = 'rgba(16,185,129,0.28)';
          if (A) A.praise(true);
          awardTeamPoints(10);
          spawnConfetti();
          setTimeout(function () {
            if (state.m7.idx + 1 < D.m7.length) {
              state.m7.idx++;
              state.m7.locked = false;
              renderMission7();
            } else {
              var st = state.m7.mistakes === 0 ? 3 : (state.m7.mistakes <= 2 ? 2 : 1);
              completeMission(7, st);
            }
          }, 1200);
        } else {
          state.m7.mistakes++;
          btn.style.borderColor = '#f43f5e';
          btn.style.transform = 'translateX(-6px)';
          setTimeout(function () {
            btn.style.borderColor = '';
            btn.style.transform = '';
          }, 400);
          if (A) A.praise(false);
        }
      });
    });
  }

  // =========================================================================
  // MISSION COMPLETE MODAL & CERTIFICATE
  // =========================================================================
  function completeMission(mid, starsEarned) {
    var prev = Number(state.stars[mid]) || 0;
    if (starsEarned > prev) {
      state.stars[mid] = starsEarned;
    }
    saveState();
    renderHeader();
    spawnConfetti();
    if (A) {
      A.playCorrect();
      A.speak('Great job, detective! You earned ' + starsEarned + ' stars in Mission ' + mid + '!');
    }

    var mMeta = D.missions.filter(function (m) { return m.id === mid; })[0];
    var modal = document.getElementById('sd-modal-overlay');
    var card = document.getElementById('sd-modal-card');
    if (!modal || !card) {
      openHome();
      return;
    }

    card.innerHTML = (
      '<div style="font-size:3.6rem;">' + renderStarsString(starsEarned) + '</div>' +
      '<h2>🎉 ' + (mMeta ? mMeta.title : ('Mission ' + mid)) + ' Complete!</h2>' +
      '<p>Awesome detective work! Your class earned <strong>' + starsEarned + ' Stars</strong> and team bonus XP!</p>' +
      '<div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;">' +
        '<button type="button" class="sd-btn sd-btn-cyan" id="sd-modal-map">🗺️ Back to Mission Map</button>' +
        (mid < 7
          ? '<button type="button" class="sd-btn sd-btn-emerald" id="sd-modal-next">🚀 Next Mission (' + (mid + 1) + ') →</button>'
          : '<button type="button" class="sd-btn sd-btn-amber" id="sd-modal-cert">🎓 Open Detective Certificate!</button>') +
      '</div>'
    );
    modal.classList.add('open');

    var mapBtn = document.getElementById('sd-modal-map');
    if (mapBtn) {
      mapBtn.addEventListener('click', function () {
        modal.classList.remove('open');
        openHome();
      });
    }
    var nextBtn = document.getElementById('sd-modal-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        modal.classList.remove('open');
        startMission(mid + 1);
      });
    }
    var certBtn = document.getElementById('sd-modal-cert');
    if (certBtn) {
      certBtn.addEventListener('click', function () {
        modal.classList.remove('open');
        openCertificate();
      });
    }
  }

  function openCertificate() {
    state.view = 'cert';
    renderHeader();
    spawnConfetti();
    if (A) A.playSfx('clapping');
    setMascotSpeech('Congratulations, Master Sound Detectives! You know all about Foley sound effects and Ludwig van Beethoven!', true);

    var modal = document.getElementById('sd-modal-overlay');
    var card = document.getElementById('sd-modal-card');
    if (!modal || !card) return;

    var topTeam = D.teams.slice().sort(function (a, b) {
      return (Number(state.teams[b.id]) || 0) - (Number(state.teams[a.id]) || 0);
    })[0];

    card.innerHTML = (
      '<div style="width:110px;height:110px;margin:0 auto 10px;border-radius:50%;border:3px solid #f59e0b;overflow:hidden;background:#0f172a;display:flex;align-items:center;justify-content:center;">' +
        imgWithFallback('img/fox-detective.webp', 'Inspector Foxy', '🦊') +
      '</div>' +
      '<h2>🎓 Master Sound Detective Certificate</h2>' +
      '<p>Presented to <strong>Grade 4 English Adventure Academy</strong> for mastering Unit 5: <em>Make Some Noise</em> (The Art of Sound &amp; Beethoven’s 9th)!</p>' +
      '<div class="sd-cert-badges">' +
        '<span class="sd-cert-badge">⭐ Total Stars: ' + totalStars() + ' / 21</span>' +
        '<span class="sd-cert-badge">🏆 Leading Team: ' + topTeam.emoji + ' ' + topTeam.name + ' (' + (state.teams[topTeam.id] || 0) + ' XP)</span>' +
        '<span class="sd-cert-badge">🎬 Foley Studio Expert</span>' +
        '<span class="sd-cert-badge">🎼 Beethoven’s 9th Historian</span>' +
      '</div>' +
      '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">' +
        '<button type="button" class="sd-btn sd-btn-emerald" id="sd-cert-celebrate">🎺 Play Symphony Fanfare!</button>' +
        '<button type="button" class="sd-btn sd-btn-cyan" id="sd-cert-close">🗺️ Return to Mission Map</button>' +
      '</div>'
    );
    modal.classList.add('open');

    var celBtn = document.getElementById('sd-cert-celebrate');
    if (celBtn) {
      celBtn.addEventListener('click', function () {
        spawnConfetti();
        if (A) A.playSfx('orchestra_chord');
      });
    }
    var closeBtn = document.getElementById('sd-cert-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        modal.classList.remove('open');
        openHome();
      });
    }
  }

  // =========================================================================
  // TEACHER ANSWER KEY & RESET MODAL
  // =========================================================================
  function openTeacherModal() {
    var modal = document.getElementById('sd-modal-overlay');
    var card = document.getElementById('sd-modal-card');
    if (!modal || !card) return;

    card.innerHTML = (
      '<h2>🎓 Teacher Guide &amp; Answer Key</h2>' +
      '<div class="sd-teacher-list">' +
        '<div><strong>Mission 1 (Sound Detective — Global Readings 3 pp. 74–77):</strong><br/>' +
          '1. Horse walking → Two pieces of coconut 🥥 | 2. Thunder → Thin piece of metal ⚡ | 3. Knight marching → Shaking metal keys 🔑 | 4. Soft crunch → Head of lettuce 🥬 | 5. Loud squeak → Old wooden chair 🪑 | 6. Action punch → Closing a big book 📕' +
        '</div>' +
        '<div><strong>Mission 2 (Sound Effects Studio):</strong><br/>' +
          'Scene 1 Knights → Swords Clashing | Scene 2 Horse → Horse Hooves | Scene 3 Old Chair/Door → Loud Squeak | Scene 4 Storm → Big Thunder | Scene 5 Boots → Footsteps' +
        '</div>' +
        '<div><strong>Mission 3 (Loud or Quiet?):</strong><br/>' +
          'LOUD: Big Bass Drum, Thunder, Full Orchestra, Audience Clapping, Swords Clashing. QUIET: Girl Whispering, Clock Ticking, Leaves Rustling.' +
        '</div>' +
        '<div><strong>Mission 4 (Concert Hall Hotspots):</strong><br/>' +
          '1. Beethoven (Top Center) | 2. Conductor’s Arms (Top Left) | 3. Orchestra (Top Right) | 4. Violin &amp; Strings (Mid Left) | 5. Grand Piano (Mid Right) | 6. Theater Stage (Center) | 7. Audience (Bottom Rows)' +
        '</div>' +
        '<div><strong>Mission 5 (The Two Doors):</strong><br/>' +
          'Foley Door 🎬: studio sound effects, coconuts/horse, metal sheet/thunder, lettuce/crunch, wooden floor/big book.<br/>' +
          'Beethoven Door 🎹: German composer, deaf/could not hear, 10 years at piano, arms like an eagle in red scarf, singer turns him around to see flowers.' +
        '</div>' +
        '<div><strong>Mission 6 (Beethoven’s 9th Sequence — pp. 80–85):</strong><br/>' +
          '1. Orchestra &amp; singers wait → 2. Worked 10 years at piano → 3. Lifts arms like an eagle in red scarf → 4. Crowd stands, claps &amp; throws flowers → 5. Beethoven is deaf and cannot hear → 6. Singer turns him around; he cries happy tears and bows low!' +
        '</div>' +
        '<div><strong>Mission 7 (How Does He Feel?):</strong><br/>' +
          '1. Waiting before concert → Worried 😟 | 2. Cannot hear (deaf) → Sad 😢 | 3. Turned around on stage → Surprised 😮 | 4. Flowers &amp; cheers → Happy 😊 | 5. Foley film finished → Happy 😊 | 6. Sudden thunderbolt → Surprised 😮' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:14px;">' +
        '<button type="button" class="sd-btn sd-btn-amber" id="sd-teacher-unlock">⭐ Unlock All 21 Stars (Demo)</button>' +
        '<button type="button" class="sd-btn sd-btn-coral" id="sd-teacher-reset">🗑️ Reset Stars &amp; Scores</button>' +
        '<a href="worksheet.html" target="_blank" class="sd-btn sd-btn-emerald" style="text-decoration:none;">🖨️ Printable Worksheet</a>' +
        '<button type="button" class="sd-btn sd-btn-cyan" id="sd-teacher-close">✖ Close</button>' +
      '</div>'
    );
    modal.classList.add('open');

    var unlockBtn = document.getElementById('sd-teacher-unlock');
    if (unlockBtn) {
      unlockBtn.addEventListener('click', function () {
        for (var i = 1; i <= 7; i++) state.stars[i] = 3;
        saveState();
        modal.classList.remove('open');
        openHome();
      });
    }

    var resetBtn = document.getElementById('sd-teacher-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        for (var i = 1; i <= 7; i++) state.stars[i] = 0;
        D.teams.forEach(function (t) { state.teams[t.id] = 0; });
        saveState();
        modal.classList.remove('open');
        openHome();
      });
    }

    var closeBtn = document.getElementById('sd-teacher-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        modal.classList.remove('open');
      });
    }
  }

  // =========================================================================
  // CONFETTI
  // =========================================================================
  function spawnConfetti() {
    var layer = document.getElementById('sd-confetti');
    if (!layer) return;
    var colors = ['#38bdf8', '#f59e0b', '#10b981', '#f43f5e', '#a855f7', '#fde047'];
    for (var i = 0; i < 28; i++) {
      var piece = document.createElement('div');
      piece.className = 'sd-confetti-piece';
      piece.style.left = Math.round(Math.random() * 98) + '%';
      piece.style.background = colors[i % colors.length];
      piece.style.animationDuration = (1.2 + Math.random() * 1.1).toFixed(2) + 's';
      layer.appendChild(piece);
      (function (el) {
        setTimeout(function () {
          if (el && el.parentNode) el.parentNode.removeChild(el);
        }, 2400);
      })(piece);
    }
  }

  // =========================================================================
  // BOOTSTRAP
  // =========================================================================
  function init() {
    loadState();
    renderHeader();

    var homeBtn = document.getElementById('sd-btn-home');
    if (homeBtn) {
      homeBtn.addEventListener('click', function () {
        openHome();
      });
    }

    var listenBtn = document.getElementById('sd-btn-listen');
    if (listenBtn) {
      listenBtn.addEventListener('click', function () {
        if (A) A.listenAgain();
      });
    }

    var teacherBtn = document.getElementById('sd-btn-teacher');
    if (teacherBtn) {
      teacherBtn.addEventListener('click', function () {
        openTeacherModal();
      });
    }

    openHome();
  }

  window.SDApp = {
    init: init,
    openHome: openHome,
    startMission: startMission,
    openCertificate: openCertificate,
    openTeacherModal: openTeacherModal
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
