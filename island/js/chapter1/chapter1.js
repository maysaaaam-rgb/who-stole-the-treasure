/* ═══════════════════════════════════════════════════════════════
   Treasure Island — Chapter 1 Controller (island/js/chapter1/chapter1.js)
   "Admiral Benbow Harbour" (Grades 3 & 4, Easy + Star Modes)
   Coordinates:
   - 5-Stop Golden Harbour Trail & Benbow leading the way
   - 5 Golden Map-Stamp HUD slots (0/5 -> 5/5)
   - Grade 3 & Grade 4 Clue Modal, Mini-Game dispatch, and Star Mode offer
   - Chapter 1 Finale (Billy Bones's Chest, Map Piece #1, Benbow Sticker,
     and Long John Silver's cliffhanger)
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var activeClue = null;
  var activeMode = 'easy';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function P() { return root.Ch1Progress; }
  function A() { return root.Ch1Audio || {}; }
  function F() { return root.Ch1Feedback || {}; }

  function getContent(grade) {
    var g = grade || (P() ? P().getActiveGrade() : 3);
    return g === 4 ? root.CH1_CONTENT_G4 : root.CH1_CONTENT_G3;
  }

  function getClue(stopNum, grade) {
    var content = getContent(grade);
    var n = Math.max(1, Math.min(5, Number(stopNum) || 1));
    return (content && content.stops && content.stops[n - 1]) || null;
  }

  /* ---------- 5-Stamp HUD Bar in #w-top ---------- */
  function ensureStampHud() {
    var topBar = document.getElementById('w-top');
    if (!topBar) return;
    var bar = document.getElementById('ch1-stamp-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'ch1-stamp-bar';
      bar.className = 'ch1-stamp-bar';
      bar.setAttribute('role', 'region');
      bar.setAttribute('aria-label', 'Chapter 1 Map Stamps Progress');
      var goalBtn = document.getElementById('w-goal');
      if (goalBtn && goalBtn.parentNode === topBar) {
        topBar.insertBefore(bar, goalBtn.nextSibling);
      } else {
        topBar.appendChild(bar);
      }
    }
    renderStampHud();
  }

  function renderStampHud() {
    var bar = document.getElementById('ch1-stamp-bar');
    if (!bar || !P()) return;
    var grade = P().getActiveGrade();
    var stamps = P().getStampCount(grade);
    var totalStars = P().getTotalStars(grade);
    var nextStop = P().getNextStop(grade);

    var slotsHtml = '';
    for (var i = 1; i <= 5; i++) {
      var st = P().getClueStars(grade, i);
      var earned = st > 0;
      var isNext = (!earned && i === nextStop);
      var locked = (i === 5 && stamps < 4 && !earned);
      slotsHtml +=
        '<button type="button" id="ch1-stamp-slot-' + i + '" ' +
          'class="ch1-stamp-slot' + (earned ? ' earned' : '') + (isNext ? ' next' : '') + (locked ? ' locked' : '') + '" ' +
          'data-stop="' + i + '" aria-label="Clue ' + i + (earned ? (' completed with ' + st + ' stars') : (isNext ? ' active next clue' : ' locked')) + '">' +
          '<img src="art/flat/' + (earned ? 'o_map_stamp.webp' : 'o_compass.webp') + '" onerror="this.src=\'art/flat/o_compass.webp\'" alt="">' +
          '<span class="ch1-stamp-num">' + i + '</span>' +
          (earned ? '<em class="ch1-stamp-stars">' + '★'.repeat(st) + '</em>' : '') +
        '</button>';
    }

    bar.innerHTML =
      '<div class="ch1-stamp-grade" title="Current Grade Curriculum">G' + grade + '</div>' +
      '<div class="ch1-stamp-slots">' + slotsHtml + '</div>' +
      '<div class="ch1-stamp-counter" aria-label="' + stamps + ' of 5 Map Stamps collected">' +
        '<b>' + stamps + '/5</b> <small>Stamps · ⭐' + totalStars + '</small>' +
      '</div>';

    var btns = bar.querySelectorAll('.ch1-stamp-slot');
    [].forEach.call(btns, function (b) {
      b.onclick = function () {
        var sNum = Number(b.getAttribute('data-stop'));
        if (A().sfxTap) A().sfxTap();
        if (sNum === 5 && P().getStampCount(grade) < 4 && P().getClueStars(grade, 5) === 0) {
          var prevClue = getClue(nextStop, grade);
          if (A().speak) A().speak('Collect the 4 harbour clues first to unlock Billy Bones\'s Sea Chest!');
          if (root.WORLD && root.WORLD.walkToActiveGoal) root.WORLD.walkToActiveGoal();
          return;
        }
        openClue(sNum, 'easy');
      };
    });
  }

  /* ---------- Sync Benbow Position to Next Active Stop on Harbour Map ---------- */
  function syncBenbowGuide() {
    if (!root.WORLD || !root.WORLD.scene || !P()) return;
    var sc = root.WORLD.scene();
    if (!sc || !sc.companions || !sc.stops) return;
    var grade = P().getActiveGrade();
    var nextStop = P().getNextStop(grade);
    var stopObj = sc.stops[nextStop - 1];
    var benbowComp = sc.companions.filter(function (c) { return c.cp && c.cp.id === 'comp_benbow'; })[0];
    if (stopObj && benbowComp && benbowComp.img) {
      var tx = stopObj.x - 138;
      var ty = stopObj.y + 8;
      benbowComp.x = tx;
      benbowComp.y = ty;
      if (sc.tweens) {
        sc.tweens.add({
          targets: [benbowComp.img, benbowComp.shadow].filter(Boolean),
          x: tx,
          y: ty,
          duration: 650,
          ease: 'Cubic.Out'
        });
      } else {
        benbowComp.img.setPosition(tx, ty);
        if (benbowComp.shadow) benbowComp.shadow.setPosition(tx, ty);
      }
      if (benbowComp.tag) {
        benbowComp.tag.setPosition(tx, ty - 148);
        benbowComp.tag.setText('🐆 Benbow');
      }
    }
  }

  function renderPlayerMonsterSvg() {
    try {
      var st = root.IslandApp && root.IslandApp.state ? root.IslandApp.state() : null;
      var s = (st && st.session) || {};
      var prof = (s.student && s.student.monsterProfile) || {};
      if (root.MonsterRenderer && typeof root.MonsterRenderer.renderMonsterSVG === 'function') {
        return root.MonsterRenderer.renderMonsterSVG({
          stage: 'growing',
          color: prof.baseColor || 'blue',
          equipped: Object.assign({}, prof.equipped || {}, (s.doc && s.doc.look) || {}),
          size: 110,
          animated: true,
          isAvatar: true
        });
      }
    } catch (e) { /* fallback */ }
    return '<img src="art/flat/c_benbow_happy.webp" alt="Hero Monster" style="width:84px;height:84px;object-fit:contain;">';
  }

  /* ---------- Open Clue Modal ---------- */
  function openClue(stopNum, mode, optsAllowAny) {
    var grade = P().getActiveGrade();
    var nextStop = P().getNextStop(grade);
    var n = Math.max(1, Math.min(5, Number(stopNum) || 1));

    // Enforce sequential stop lock for Stop 5 chest until Stops 1–4 are done
    if (n === 5 && P().getStampCount(grade) < 4 && P().getClueStars(grade, 5) === 0 && !optsAllowAny) {
      n = nextStop;
    }

    var clue = getClue(n, grade);
    if (!clue) return;

    activeClue = clue;
    activeMode = (mode === 'star') ? 'star' : 'easy';
    if (A().startAmbience) A().startAmbience();

    var modalRoot = document.getElementById('isl-modal-root') || document.body;
    document.body.classList.add('isl-modal-open');

    var existing = document.getElementById('ch1-modal-backdrop');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    var easyDone = P().isClueDone(grade, n, 'easy');
    var starDone = P().isClueDone(grade, n, 'star');

    var wrap = document.createElement('div');
    wrap.id = 'ch1-modal-backdrop';
    wrap.className = 'ch1-modal-backdrop';
    wrap.innerHTML =
      '<div class="ch1-modal-card" role="dialog" aria-modal="true" aria-label="' + esc(clue.title) + '">' +
        '<div class="ch1-modal-header">' +
          '<div class="ch1-modal-titlegroup">' +
            '<span class="ch1-stop-pill">📍 STOP ' + n + ' OF 5 · G' + grade + '</span>' +
            '<h2 class="ch1-modal-title">' + esc(clue.title) + '</h2>' +
          '</div>' +
          '<div class="ch1-mode-switch" role="group" aria-label="Difficulty Mode">' +
            '<button type="button" class="ch1-mode-btn' + (activeMode === 'easy' ? ' on' : '') + '" id="ch1-mode-easy" aria-label="Easy Mode: Listen and Tap">' +
              '🟢 Easy' + (easyDone ? ' ✓' : '') +
            '</button>' +
            '<button type="button" class="ch1-mode-btn star' + (activeMode === 'star' ? ' on' : '') + '" id="ch1-mode-star" aria-label="Star Mode: Speak and Order Words">' +
              '⭐ Star' + (starDone ? ' ✓' : '') +
            '</button>' +
          '</div>' +
          '<button type="button" class="ch1-btn close" id="ch1-modal-close" aria-label="Back to Harbour Map">✕ Back</button>' +
        '</div>' +

        '<div class="ch1-stage-Cast">' +
          '<div class="ch1-actor ch1-actor-hero" title="Your Monster Hero">' +
            renderPlayerMonsterSvg() +
            '<span class="ch1-actor-tag">You</span>' +
          '</div>' +
          '<div class="ch1-npc-speech">' +
            '<div class="ch1-npc-line" id="ch1-npc-line">' + esc(clue.introLine) + '</div>' +
            '<div class="ch1-npc-subbtns">' +
              '<button type="button" class="ch1-btn cyan xs" id="ch1-intro-speak" aria-label="Hear instruction">🔊 ' + esc(clue.npc.name) + '</button>' +
              '<button type="button" class="ch1-btn amber xs" id="ch1-flint-repeat" aria-label="Hear Captain Flint repeat key words">🦜 Flint Repeat</button>' +
            '</div>' +
          '</div>' +
          '<div class="ch1-actor ch1-actor-npc">' +
            '<img src="art/flat/' + esc(clue.npc.art) + '.webp" id="ch1-npc-img" alt="' + esc(clue.npc.name) + '">' +
            '<span class="ch1-actor-tag">' + esc(clue.npc.name) + '</span>' +
          '</div>' +
          '<div class="ch1-actor ch1-actor-benbow ch1-npc-benbow ch1-npc-flint">' +
            '<img src="art/flat/' + esc((clue.companion && clue.companion.art) || 'c_benbow') + '.webp" id="ch1-comp-img" alt="' + esc((clue.companion && clue.companion.name) || 'Benbow') + '">' +
            '<span class="ch1-actor-tag">' + esc((clue.companion && clue.companion.name) || 'Benbow') + '</span>' +
          '</div>' +
        '</div>' +

        '<div id="ch1-feedback-banner" class="ch1-feedback-banner" aria-live="polite"></div>' +
        '<div id="ch1-mg-stage" class="ch1-mg-stage"></div>' +
      '</div>';

    modalRoot.appendChild(wrap);

    document.getElementById('ch1-modal-close').onclick = function () {
      if (A().sfxTap) A().sfxTap();
      closeClue();
    };
    document.getElementById('ch1-mode-easy').onclick = function () {
      if (A().sfxTap) A().sfxTap();
      openClue(n, 'easy');
    };
    document.getElementById('ch1-mode-star').onclick = function () {
      if (A().sfxTap) A().sfxTap();
      openClue(n, 'star');
    };
    document.getElementById('ch1-intro-speak').onclick = function () {
      if (A().sfxTap) A().sfxTap();
      if (A().speak) A().speak(clue.introLine, { lineId: clue.introLineId });
    };
    document.getElementById('ch1-flint-repeat').onclick = function () {
      if (A().sfxTap) A().sfxTap();
      if (F().flintFlap) F().flintFlap();
      if (A().speakSlow) A().speakSlow(clue.flintWord || clue.introLine, clue.flintLineId);
    };

    var mgStage = document.getElementById('ch1-mg-stage');
    var engineName = (activeMode === 'star') ? (clue.starEngine || 'wordOrder') : (clue.easyEngine || 'listenTap');
    var engineFn = root.Ch1Minigames && root.Ch1Minigames[engineName];

    if (typeof engineFn === 'function') {
      engineFn(mgStage, clue, { mode: activeMode }, function (result) {
        onClueFinished(clue, activeMode, result);
      });
    }
  }

  function onClueFinished(clue, mode, result) {
    var grade = P().getActiveGrade();
    var saved = P().recordClueResult({
      clueId: clue.clueId,
      stopNum: clue.stopNum,
      grade: grade,
      mode: mode,
      stars: result.stars,
      tries: result.tries,
      hintsUsed: result.hintsUsed,
      timeMs: result.timeMs,
      missedItems: result.missedItems
    });

    // Update NPC to happy sprite
    var npcImg = document.getElementById('ch1-npc-img');
    if (npcImg && clue.npc && clue.npc.happy) {
      npcImg.src = 'art/flat/' + clue.npc.happy + '.webp';
    }
    var compImg = document.getElementById('ch1-comp-img');
    if (compImg && clue.companion && clue.companion.happy) {
      compImg.src = 'art/flat/' + clue.companion.happy + '.webp';
    }

    var mgStage = document.getElementById('ch1-mg-stage');
    if (!mgStage) return;

    var starsStr = '⭐'.repeat(result.stars) + '☆'.repeat(Math.max(0, 3 - result.stars));
    var isLastStop = (clue.stopNum === 5);

    mgStage.innerHTML =
      '<div class="ch1-victory-card">' +
        '<div class="ch1-victory-stamp" id="ch1-victory-stamp-origin">' +
          '<img src="art/flat/o_map_stamp.webp" onerror="this.src=\'art/flat/o_compass.webp\'" alt="Golden Map Stamp">' +
        '</div>' +
        '<div class="ch1-victory-stars" aria-label="' + result.stars + ' out of 3 stars">' + starsStr + '</div>' +
        '<h3 class="ch1-victory-title">Clue ' + clue.stopNum + ' Solved! (+' + saved.coinsEarned + ' 🪙)</h3>' +
        '<p class="ch1-victory-sub">' +
          (isLastStop
            ? 'All 5 Harbour Clues solved! Billy Bones\'s Sea Chest is ready to burst open!'
            : 'Golden Map Stamp #' + clue.stopNum + ' flies to your HUD! Benbow is running ahead to Stop ' + (clue.stopNum + 1) + '!') +
        '</p>' +
        '<div class="ch1-victory-actions">' +
          (mode === 'easy' ? (
            '<button type="button" class="ch1-btn amber" id="ch1-vic-star" aria-label="Play Star Mode for bonus stars">' +
              '⭐ Try Star Mode! (Speak &amp; Order Words)' +
            '</button>'
          ) : '') +
          '<button type="button" class="ch1-btn gold lg" id="ch1-vic-next" aria-label="' + (isLastStop ? 'Open Billy Bones Sea Chest' : 'Continue to next stop') + '">' +
            (isLastStop ? '🗝️ Open Billy Bones\'s Sea Chest! ▶' : ('🐆 Follow Benbow to Stop ' + (clue.stopNum + 1) + ' ▶')) +
          '</button>' +
        '</div>' +
      '</div>';

    var stampOrigin = document.getElementById('ch1-victory-stamp-origin');
    if (F().flyStampToHud) {
      F().flyStampToHud(stampOrigin, clue.stopNum, function () {
        renderStampHud();
      });
    } else {
      renderStampHud();
    }

    if (root.WORLD && typeof root.WORLD.onMissionComplete === 'function') {
      var legId = P().legacyMissionId(grade, clue.stopNum, mode);
      root.WORLD.onMissionComplete(legId, result.stars);
    }
    syncBenbowGuide();

    var starBtn = document.getElementById('ch1-vic-star');
    if (starBtn) {
      starBtn.onclick = function () {
        if (A().sfxTap) A().sfxTap();
        openClue(clue.stopNum, 'star');
      };
    }

    var nextBtn = document.getElementById('ch1-vic-next');
    if (nextBtn) {
      nextBtn.onclick = function () {
        if (A().sfxTap) A().sfxTap();
        closeClue();
        if (isLastStop) {
          P().markChestOpened(grade);
          if (F().playChestFinale) {
            F().playChestFinale(function () {
              if (root.WORLD && root.WORLD.refresh) root.WORLD.refresh(true);
              renderStampHud();
            });
          }
        } else if (root.WORLD && root.WORLD.walkToActiveGoal) {
          setTimeout(function () {
            syncBenbowGuide();
            root.WORLD.walkToActiveGoal();
          }, 220);
        }
      };
    }
  }

  function closeClue() {
    if (A().stopVoice) A().stopVoice();
    var el = document.getElementById('ch1-modal-backdrop');
    if (el && el.parentNode) el.parentNode.removeChild(el);
    document.body.classList.remove('isl-modal-open');
    activeClue = null;
    renderStampHud();
    syncBenbowGuide();
    if (root.WORLD && root.WORLD.refresh) root.WORLD.refresh(false);
  }

  /* ---------- Hook into IslandApp & WORLD for Zone 1 ---------- */
  function installHooks() {
    ensureStampHud();

    // Patch IslandData Zone 1 titles & mission descriptions so world tooltips match the 5 Stops
    if (root.IslandData && root.IslandData.CURRICULUM) {
      var patchGradeStops = function (g) {
        var content = getContent(g);
        var list = root.IslandData.CURRICULUM[g] && root.IslandData.CURRICULUM[g][1];
        if (!content || !list) return;
        content.stops.forEach(function (st, idx) {
          if (list[idx]) {
            list[idx].title = st.stopName + ': ' + st.title.replace(/^Clue \d+:\s*/, '');
          }
        });
      };
      patchGradeStops(3);
      patchGradeStops(4);
    }

    // Intercept IslandApp.tapPin & tapChest for Zone 1
    if (root.IslandApp && !root.IslandApp.__ch1Hooked) {
      root.IslandApp.__ch1Hooked = true;
      var origTapPin = root.IslandApp.tapPin;
      root.IslandApp.tapPin = function (missionId, zoneNum, isStar, ev) {
        var z = Number(zoneNum) || (root.WORLD && root.WORLD.S && root.WORLD.S.zone) || 1;
        if (z === 1) {
          var m = /_z1_(\d+)/.exec(String(missionId || ''));
          var stopNum = m ? Number(m[1]) : 1;
          openClue(stopNum, isStar ? 'star' : 'easy');
          return;
        }
        if (origTapPin) return origTapPin.apply(this, arguments);
      };

      var origTapChest = root.IslandApp.tapChest;
      root.IslandApp.tapChest = function (zoneNum) {
        var z = Number(zoneNum) || 1;
        if (z === 1) {
          var g = P().getActiveGrade();
          if (P().getStampCount(g) >= 5) {
            P().markChestOpened(g);
            if (F().playChestFinale) {
              F().playChestFinale(function () {
                if (root.WORLD && root.WORLD.refresh) root.WORLD.refresh(true);
                renderStampHud();
              });
            }
          } else {
            openClue(P().getNextStop(g), 'easy');
          }
          return;
        }
        if (origTapChest) return origTapChest.apply(this, arguments);
      };
    }

    setTimeout(function () {
      ensureStampHud();
      syncBenbowGuide();
    }, 900);
    setTimeout(function () {
      ensureStampHud();
      syncBenbowGuide();
    }, 2200);
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', installHooks);
    } else {
      installHooks();
    }
  }

  root.Chapter1 = {
    openClue: openClue,
    closeClue: closeClue,
    getContent: getContent,
    getClue: getClue,
    renderStampHud: renderStampHud,
    syncBenbowGuide: syncBenbowGuide
  };
})(typeof window !== 'undefined' ? window : this);
